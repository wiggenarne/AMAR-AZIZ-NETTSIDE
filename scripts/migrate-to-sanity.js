#!/usr/bin/env node
/**
 * Migrer markdown-innhold (src/content/) + bilder (public/images/artworks/) til Sanity.
 *
 * Bruk:
 *   PUBLIC_SANITY_PROJECT_ID=xxx PUBLIC_SANITY_DATASET=production \
 *   SANITY_AUTH_TOKEN=sk... node scripts/migrate-to-sanity.js
 *
 * Flagg:
 *   --dry-run   Parser alt, men skriver ikke til Sanity
 *   --series    Kun serier
 *   --artworks  Kun verk
 *   --exhibitions  Kun utstillinger
 */

import { readFile, readdir } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const ONLY = {
  series: args.includes("--series"),
  artworks: args.includes("--artworks"),
  exhibitions: args.includes("--exhibitions"),
};
const ALL = !ONLY.series && !ONLY.artworks && !ONLY.exhibitions;

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_AUTH_TOKEN;

if (!projectId) bail("PUBLIC_SANITY_PROJECT_ID mangler");
if (!DRY && !token) bail("SANITY_AUTH_TOKEN mangler (kreves når ikke --dry-run)");

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

function bail(msg) {
  console.error("✗", msg);
  process.exit(1);
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const body = m[1];
  const data = {};
  const lines = body.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) {
      i++;
      continue;
    }
    const key = kv[1];
    const val = kv[2].trim();
    if (val === "") {
      const nested = {};
      i++;
      while (i < lines.length && lines[i].startsWith("  ")) {
        const nkv = lines[i].match(/^\s+(\w+):\s*(.*)$/);
        if (nkv) nested[nkv[1]] = unquote(nkv[2]);
        i++;
      }
      data[key] = nested;
    } else {
      data[key] = unquote(val);
      i++;
    }
  }
  return data;
}

function unquote(s) {
  s = s.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  if (s === "true") return true;
  if (s === "false") return false;
  return s;
}

async function uploadImage(absPath, label) {
  if (DRY) {
    console.log(`  [dry] ville lastet opp bilde: ${path.basename(absPath)}`);
    return { _type: "image", asset: { _ref: "image-placeholder", _type: "reference" } };
  }
  const stream = createReadStream(absPath);
  const asset = await client.assets.upload("image", stream, {
    filename: path.basename(absPath),
    label,
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

function slugFromFilename(file) {
  return path.basename(file, ".md");
}

async function migrateSeries() {
  const dir = path.join(ROOT, "src/content/series");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".md"));
  console.log(`→ ${files.length} serier`);
  for (const f of files) {
    const slug = slugFromFilename(f);
    const raw = await readFile(path.join(dir, f), "utf8");
    const fm = parseFrontmatter(raw);
    const doc = {
      _id: `series-${slug}`,
      _type: "series",
      title: { no: fm.title?.no ?? "", en: fm.title?.en ?? "" },
      slug: { _type: "slug", current: slug },
      statement: { no: fm.statement?.no ?? "", en: fm.statement?.en ?? "" },
      order: typeof fm.order === "number" ? fm.order : 0,
    };
    if (DRY) {
      console.log(`  [dry] series: ${slug}`);
    } else {
      await client.createOrReplace(doc);
      console.log(`  ✓ series: ${slug}`);
    }
  }
}

async function migrateExhibitions() {
  const dir = path.join(ROOT, "src/content/exhibitions");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".md"));
  console.log(`→ ${files.length} utstillinger`);
  for (const f of files) {
    const slug = slugFromFilename(f);
    const raw = await readFile(path.join(dir, f), "utf8");
    const fm = parseFrontmatter(raw);
    const doc = {
      _id: `exhibition-${slug}`,
      _type: "exhibition",
      title: { no: fm.title?.no ?? "", en: fm.title?.en ?? "" },
      venue: fm.venue ?? "",
      city: fm.city ?? "",
      country: fm.country ?? "Norway",
      startDate: String(fm.startDate ?? ""),
      ...(fm.endDate ? { endDate: String(fm.endDate) } : {}),
      type: fm.type === "solo" ? "solo" : "group",
      ...(fm.link ? { link: fm.link } : {}),
    };
    if (DRY) {
      console.log(`  [dry] exhibition: ${slug}`);
    } else {
      await client.createOrReplace(doc);
      console.log(`  ✓ exhibition: ${slug}`);
    }
  }
}

async function migrateArtworks() {
  const dir = path.join(ROOT, "src/content/artworks");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".md"));
  console.log(`→ ${files.length} kunstverk`);
  for (const f of files) {
    const slug = slugFromFilename(f);
    const raw = await readFile(path.join(dir, f), "utf8");
    const fm = parseFrontmatter(raw);

    let image = null;
    if (fm.image) {
      const rel = fm.image.replace(/^\//, "");
      const absImg = path.join(ROOT, "public", rel);
      try {
        image = await uploadImage(absImg, fm.title?.no ?? slug);
      } catch (e) {
        console.warn(`  ⚠ kunne ikke laste opp ${absImg}: ${e.message}`);
      }
    }

    const doc = {
      _id: `artwork-${slug}`,
      _type: "artwork",
      title: { no: fm.title?.no ?? "", en: fm.title?.en ?? "" },
      slug: { _type: "slug", current: slug },
      ...(image ? { image } : {}),
      width_cm: typeof fm.width_cm === "number" ? fm.width_cm : 0,
      height_cm: typeof fm.height_cm === "number" ? fm.height_cm : 0,
      ...(typeof fm.depth_cm === "number" ? { depth_cm: fm.depth_cm } : {}),
      medium: { no: fm.medium?.no ?? "", en: fm.medium?.en ?? "" },
      year: typeof fm.year === "number" ? fm.year : new Date().getFullYear(),
      ...(fm.series
        ? { series: { _type: "reference", _ref: `series-${fm.series}` } }
        : {}),
      description: { no: fm.description?.no ?? "", en: fm.description?.en ?? "" },
      available: fm.available !== false,
      featured: fm.featured === true,
      order: typeof fm.order === "number" ? fm.order : 0,
    };

    if (DRY) {
      console.log(`  [dry] artwork: ${slug}`);
    } else {
      await client.createOrReplace(doc);
      console.log(`  ✓ artwork: ${slug}`);
    }
  }
}

async function main() {
  console.log(`Sanity migrering → projectId=${projectId} dataset=${dataset}${DRY ? " (DRY RUN)" : ""}`);
  if (ALL || ONLY.series) await migrateSeries();
  if (ALL || ONLY.exhibitions) await migrateExhibitions();
  if (ALL || ONLY.artworks) await migrateArtworks();
  console.log("✓ Ferdig");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
