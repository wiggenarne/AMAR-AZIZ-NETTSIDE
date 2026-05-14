#!/usr/bin/env node
/**
 * Engangs migreringsskript: leser src/content/*.md + public/images/artworks/*.jpg
 * og oppretter tilsvarende dokumenter i Sanity.
 *
 * Idempotent — bruker createOrReplace med deterministisk _id per slug, så
 * skriptet kan kjøres flere ganger uten å duplikere data.
 *
 * Kjøring:
 *   1) Kopier .env.local til riktige verdier (PUBLIC_SANITY_PROJECT_ID,
 *      PUBLIC_SANITY_DATASET, SANITY_API_TOKEN med Editor-rettigheter)
 *   2) npm run migrate
 */
import { readdir, readFile } from "node:fs/promises";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { createClient } from "@sanity/client";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ARTWORKS_DIR = join(ROOT, "src", "content", "artworks");
const SERIES_DIR = join(ROOT, "src", "content", "series");
const EXHIBITIONS_DIR = join(ROOT, "src", "content", "exhibitions");
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Mangler PUBLIC_SANITY_PROJECT_ID eller SANITY_API_TOKEN i .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function readMarkdownDocs(dir) {
  const files = await readdir(dir);
  const docs = [];
  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const raw = await readFile(join(dir, file), "utf8");
    const { data } = matter(raw);
    docs.push({ id: file.replace(/\.md$/, ""), data });
  }
  return docs;
}

async function uploadImage(imagePath) {
  const absPath = join(ROOT, "public", imagePath.replace(/^\//, ""));
  const buffer = await readFile(absPath);
  const filename = basename(absPath);
  const asset = await client.assets.upload("image", buffer, { filename });
  return asset._id;
}

async function migrateSeries() {
  console.log("\n=== Serier ===");
  const docs = await readMarkdownDocs(SERIES_DIR);
  const idMap = {};
  for (const { id, data } of docs) {
    const _id = `series-${id}`;
    idMap[id] = _id;
    const doc = {
      _id,
      _type: "series",
      title: { no: data.title?.no ?? "", en: data.title?.en ?? "" },
      slug: { _type: "slug", current: id },
      statement: { no: data.statement?.no ?? "", en: data.statement?.en ?? "" },
      order: data.order ?? 0,
    };
    await client.createOrReplace(doc);
    console.log(`  ✓ series: ${id}`);
  }
  return idMap;
}

async function migrateArtworks(seriesIdMap) {
  console.log("\n=== Kunstverk ===");
  const docs = await readMarkdownDocs(ARTWORKS_DIR);
  let ok = 0;
  let failed = 0;
  for (const { id, data } of docs) {
    try {
      const _id = `artwork-${id}`;
      let assetId;
      try {
        assetId = await uploadImage(data.image);
      } catch (err) {
        console.warn(`  ⚠  ${id}: bilde mangler eller feilet — ${err.message}`);
        failed += 1;
        continue;
      }
      const seriesRef = data.series && seriesIdMap[data.series]
        ? { _type: "reference", _ref: seriesIdMap[data.series] }
        : undefined;
      const doc = {
        _id,
        _type: "artwork",
        title: { no: data.title?.no ?? "", en: data.title?.en ?? "" },
        slug: { _type: "slug", current: id },
        image: { _type: "image", asset: { _type: "reference", _ref: assetId } },
        width_cm: Number(data.width_cm),
        height_cm: Number(data.height_cm),
        ...(data.depth_cm ? { depth_cm: Number(data.depth_cm) } : {}),
        medium: { no: data.medium?.no ?? "", en: data.medium?.en ?? "" },
        year: Number(data.year),
        ...(seriesRef ? { series: seriesRef } : {}),
        description: {
          no: data.description?.no ?? "",
          en: data.description?.en ?? "",
        },
        available: data.available ?? true,
        featured: data.featured ?? false,
        order: data.order ?? 0,
      };
      await client.createOrReplace(doc);
      console.log(`  ✓ ${id}`);
      ok += 1;
    } catch (err) {
      console.error(`  ✗ ${id}: ${err.message}`);
      failed += 1;
    }
  }
  console.log(`  → ${ok} ok, ${failed} feilet`);
}

async function migrateExhibitions() {
  console.log("\n=== Utstillinger ===");
  const docs = await readMarkdownDocs(EXHIBITIONS_DIR);
  for (const { id, data } of docs) {
    const _id = `exhibition-${id}`;
    const toDateStr = (d) => {
      if (!d) return undefined;
      if (d instanceof Date) return d.toISOString().slice(0, 10);
      return String(d).slice(0, 10);
    };
    const doc = {
      _id,
      _type: "exhibition",
      title: { no: data.title?.no ?? "", en: data.title?.en ?? "" },
      venue: data.venue,
      city: data.city,
      country: data.country ?? "Norway",
      startDate: toDateStr(data.startDate),
      ...(data.endDate ? { endDate: toDateStr(data.endDate) } : {}),
      type: data.type ?? "group",
      ...(data.link ? { link: data.link } : {}),
    };
    await client.createOrReplace(doc);
    console.log(`  ✓ ${id}`);
  }
}

// Hardkodet fra src/data/settings.ts (filen slettes etter migrering).
const SETTINGS = {
  artist: {
    name: "Amar Aziz",
    email: "amar260651@gmail.com",
    phone: "+47 452 83 915",
    phoneRaw: "+4745283915",
    address: {
      street: "Holter Terrasse 7",
      postalCode: "1448",
      city: "Drøbak",
      country: "Norge",
    },
    born: 1951,
    birthplace: "Lahore, Pakistan",
    social: [
      { label: "Instagram", url: "https://www.instagram.com/amar2606/" },
      { label: "NorthArt", url: "https://shop.northart.no" },
    ],
  },
  bio: {
    no: [
      "Amar Aziz er en norsk-pakistansk kubist-maler bosatt i Drøbak. Han ble født i Lahore i 1951 og emigrerte til Norge i 1975.",
      "Etter en bachelor i arkitektur fra National College of Arts i Lahore videreutdannet han seg innen interiørarkitektur og grafisk design ved Statens Håndverks- og kunstindustriskole i Oslo.",
      "I 20 år arbeidet Amar som grafisk designer hos Freia. Siden 2004 har han vært profesjonell billedkunstner. Han kombinerer sin arkitektoniske bakgrunn med kunstnerisk uttrykk – senest gjennom digitale kubistiske motiver trykket på børstet aluminium.",
      "Amar har illustrert to fortellinger i prinsesse Märtha Louises «Englebok» og er medlem av Drøbak Kunstnerforum, Ås Kunstforening og Gamleveien Maleselskab.",
    ],
    en: [
      "Amar Aziz is a Norwegian-Pakistani cubist painter based in Drøbak. Born in Lahore in 1951, he emigrated to Norway in 1975.",
      "After a Bachelor of Architecture from the National College of Arts in Lahore, he continued his studies in interior architecture and graphic design at the National College of Art and Design (SHKS) in Oslo.",
      "Amar worked as a graphic designer at Freia for 20 years. Since 2004 he has been a professional visual artist, combining his architectural background with artistic expression – most recently through digital cubist motifs printed on brushed aluminium.",
      'Amar illustrated two stories in Princess Märtha Louise\'s "Book of Angels" and is a member of Drøbak Artists Forum, Ås Art Association and Gamleveien Painting Society.',
    ],
  },
  cv: {
    no: {
      education: [
        { years: "2014–2018", text: "Kunsthøyskolen i Holbæk, Danmark" },
        { years: "2009–2010", text: "Praktisk-pedagogisk utdanning i kunst og håndverk, HIO" },
        { years: "1977–1980", text: "Grafisk design, Statens Håndverks- og kunstindustriskole (SHKS), Oslo" },
        { years: "1975–1977", text: "Interiørarkitektur, Statens Håndverks- og kunstindustriskole (SHKS), Oslo" },
        { years: "1966–1969", text: "Bachelor i arkitektur, National College of Arts, Lahore" },
      ],
      career: [
        { years: "2004–", text: "Profesjonell billedkunstner" },
        { years: "1984–2004", text: "Grafisk designer, Freia Oslo" },
      ],
      memberships: ["Drøbak Kunstnerforum", "Ås Kunstforening", "Gamleveien Maleselskab"],
    },
    en: {
      education: [
        { years: "2014–2018", text: "Holbæk Art School, Denmark" },
        { years: "2009–2010", text: "Practical-Pedagogical Education in Art and Crafts, HIO" },
        { years: "1977–1980", text: "Graphic Design, National College of Art and Design (SHKS), Oslo" },
        { years: "1975–1977", text: "Interior Architecture, National College of Art and Design (SHKS), Oslo" },
        { years: "1966–1969", text: "Bachelor of Architecture, National College of Arts, Lahore" },
      ],
      career: [
        { years: "2004–", text: "Professional visual artist" },
        { years: "1984–2004", text: "Graphic designer, Freia Oslo" },
      ],
      memberships: ["Drøbak Artists Forum", "Ås Art Association", "Gamleveien Painting Society"],
    },
  },
};

async function migrateSiteSettings() {
  console.log("\n=== Settings ===");
  const { artist, bio, cv } = SETTINGS;
  const doc = {
    _id: "siteSettings",
    _type: "siteSettings",
    name: artist.name,
    born: artist.born,
    birthplace: artist.birthplace,
    email: artist.email,
    phone: artist.phone,
    phoneRaw: artist.phoneRaw,
    address: artist.address,
    social: artist.social.map((s) => ({ _key: slugify(s.label), ...s })),
    bio: {
      no: bio.no,
      en: bio.en,
    },
    cv: {
      no: {
        education: cv.no.education.map((e, i) => ({ _key: `edu-${i}`, ...e })),
        career: cv.no.career.map((e, i) => ({ _key: `car-${i}`, ...e })),
        memberships: [...cv.no.memberships],
      },
      en: {
        education: cv.en.education.map((e, i) => ({ _key: `edu-${i}`, ...e })),
        career: cv.en.career.map((e, i) => ({ _key: `car-${i}`, ...e })),
        memberships: [...cv.en.memberships],
      },
    },
  };
  await client.createOrReplace(doc);
  console.log("  ✓ siteSettings");
}

async function main() {
  console.log(`Migrerer til Sanity (project: ${projectId}, dataset: ${dataset})`);
  const seriesIdMap = await migrateSeries();
  await migrateArtworks(seriesIdMap);
  await migrateExhibitions();
  await migrateSiteSettings();
  console.log("\nFerdig.");
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
