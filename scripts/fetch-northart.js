#!/usr/bin/env node
import { writeFile, mkdir, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Buffer } from "node:buffer";
import { chromium } from "playwright";

const SITEMAP_URLS = [1, 2, 3].map(
  (i) => `https://shop.northart.no/sitemap.xml?urlset=${i}`,
);
const ARTIST_URL_RE =
  /\/(?:profesjonelle-nordiske-kunstnere|original-digital-grafikk|giclee-og-trykk)\/amar-aziz\/[^/]+\.html$/;
const UA =
  "Mozilla/5.0 (compatible; AmarAzizImport/1.0; +https://github.com/wiggenarne/AMAR-AZIZ-NETTSIDE)";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMG_DIR = join(ROOT, "public", "images", "artworks");
const MD_DIR = join(ROOT, "src", "content", "artworks");
const DRY_RUN = process.argv.includes("--dry-run");
const INSPECT = process.argv.includes("--inspect");
const LIMIT_ARG = process.argv.find((a) => a.startsWith("--limit="));
const LIMIT = LIMIT_ARG ? Number(LIMIT_ARG.split("=")[1]) : Infinity;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function imageExt(url) {
  try {
    const m = new URL(url).pathname.match(/\.([a-z0-9]+)(?:$|\?)/i);
    return m ? m[1].toLowerCase() : "jpg";
  } catch {
    return "jpg";
  }
}

function escapeYaml(s) {
  return String(s ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function cleanDescription(raw) {
  if (!raw) return "";
  let s = String(raw)
    .replace(/^\s*Beskrivelse\b[:\s]*/i, "")
    .replace(/Artikkelnr\.[^.\n]*/gi, "")
    .replace(/\b(?:Vis|Les) mer\.?\.?\.?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  // If only boilerplate remains, drop it.
  if (s.length < 8) return "";
  return s;
}

async function getProductUrls() {
  const all = new Set();
  for (const sm of SITEMAP_URLS) {
    const res = await fetch(sm, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`sitemap ${sm}: HTTP ${res.status}`);
    const xml = await res.text();
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      if (ARTIST_URL_RE.test(m[1])) all.add(m[1]);
    }
  }
  return [...all].sort();
}

async function downloadBinary(url, dest) {
  // Cap dimensions to keep the repo lean — Textalk's CDN supports thumbor params.
  // Astro can still process these as full-quality source images at build time.
  const sized = url.includes("?")
    ? `${url}&max-width=2000&max-height=2000&quality=90`
    : `${url}?max-width=2000&max-height=2000&quality=90`;
  const res = await fetch(sized, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buf);
}

function isArtworkImage(src) {
  if (!src) return false;
  let pathname;
  try {
    pathname = new URL(src).pathname;
  } catch {
    return false;
  }
  const decoded = decodeURIComponent(pathname);
  if (/themes\.textalk\.se|themes\.abicart\.com/i.test(src)) return false;
  // Look at the basename only — mockup images have names like "living-room-with-mountain-views.jpg"
  // while real artwork files are "{id}-origpic-{hash}.{ext}" or "Art. nr. {n} {title}.{ext}".
  const base = decoded.split("/").pop() || "";
  if (/logo|favicon|sprite|icon/i.test(base)) return false;
  return /-origpic-[0-9a-f]+\.\w+$/i.test(base) || /^Art\.?\s*nr/i.test(base);
}

async function scrapeWork(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
  // Wait for the actual artwork image (filename ends with -origpic-... or starts with "Art. nr.").
  await page
    .waitForFunction(
      () => {
        const imgs = Array.from(document.querySelectorAll("img"));
        return imgs.some((i) => {
          if (!i.src) return false;
          let p;
          try {
            p = decodeURIComponent(new URL(i.src).pathname.split("/").pop() || "");
          } catch {
            return false;
          }
          return /-origpic-[0-9a-f]+\.\w+$/i.test(p) || /^Art\.?\s*nr/i.test(p);
        });
      },
      { timeout: 30_000 },
    )
    .catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  const data = await page.evaluate(() => {
    const allText = document.body.innerText;

    // Title — pick the most prominent text node that isn't a generic site label.
    // On Textalk pages the article name appears as a quoted string (e.g. "Dreams") inside the article display.
    const text = (sel) => {
      const el = document.querySelector(sel);
      return el ? el.textContent.trim() : "";
    };
    const candidates = [
      "[class*='tws-article-display-name']",
      "[class*='tws-article-name']",
      "[class*='tws-article-display'] h1",
      "main h1",
      "h1",
    ];
    let title = "";
    for (const sel of candidates) {
      const t = text(sel);
      if (t && t.length > 1 && t.length < 200) {
        title = t;
        break;
      }
    }
    title = title.replace(/^["“”']+|["“”']+$/g, "").trim();

    // Pick the largest non-logo image whose src looks like an artwork file.
    const imgs = Array.from(document.querySelectorAll("img"));
    const isArtwork = (s) => {
      if (!s) return false;
      if (/themes\.textalk\.se|themes\.abicart\.com/i.test(s)) return false;
      let base;
      try {
        base = decodeURIComponent(new URL(s).pathname.split("/").pop() || "");
      } catch {
        return false;
      }
      if (/logo|favicon|sprite|icon/i.test(base)) return false;
      return /-origpic-[0-9a-f]+\.\w+$/i.test(base) || /^Art\.?\s*nr/i.test(base);
    };
    const artwork = imgs
      .filter((i) => isArtwork(i.src))
      .sort((a, b) => (b.naturalWidth || 0) - (a.naturalWidth || 0))[0];
    const imageUrl = artwork?.src || "";

    const description =
      text("[class*='tws-article-description']") ||
      text("[itemprop='description']") ||
      "";

    const allImageSrcs = imgs.map((i) => i.src).filter(Boolean);
    return { title, imageUrl, description, allText, allImageSrcs };
  });

  const text = data.allText;
  // Dimensions: "100 x 100 cm", "70x70", "Størrelse: 70x70"
  const dims =
    text.match(/(\d+)\s*[x×]\s*(\d+)\s*cm/i) ||
    text.match(/størrelse[:\s]+(\d+)\s*[x×]\s*(\d+)/i);
  // Prefer "Produksjonsår: YYYY" if present, else any 19xx/20xx year token
  const yearMatch =
    text.match(/produksjonsår[:\s]+((?:19|20)\d{2})/i) ||
    text.match(/\b((?:19|20)\d{2})\b/);
  const tek = text.match(/teknikk[:\s]+([^\n\r]+)/i);
  const priceMatch = text.match(/([\d.\s]+)\s*(?:NOK|kr)\b/i);
  // Description: text between "Beskrivelse" header and the next section/footer.
  // Filter out boilerplate (Artikkelnr., Vis mer, etc.) — keep only real prose.
  let textDesc = "";
  const descMatch = text.match(
    /Beskrivelse\s*\n+(?:Artikkelnr[^\n]*\n+)?([\s\S]*?)(?=\n\s*Liaveien|\n\s*Betingelser|\n\s*\*|\n\s*Kontakt oss|$)/,
  );
  if (descMatch) {
    const lines = descMatch[1]
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(
        (l) =>
          l &&
          !/^Artikkelnr/i.test(l) &&
          !/^Vis mer$/i.test(l) &&
          !/^Les mer/i.test(l),
      );
    textDesc = lines.join(" ").trim();
  }

  return {
    url,
    title: data.title,
    width_cm: dims ? Number(dims[1]) : null,
    height_cm: dims ? Number(dims[2]) : null,
    year: yearMatch ? Number(yearMatch[1]) : null,
    medium: tek ? tek[1].trim() : "",
    price: priceMatch ? priceMatch[1].replace(/\s/g, "") : "",
    description: cleanDescription(data.description || textDesc),
    imageUrl: data.imageUrl,
    rawText: text,
    rawImageSrcs: data.allImageSrcs,
  };
}

function buildFrontmatter(work, slug, order, ext) {
  return `---
title:
  no: "${escapeYaml(work.title)}"
  en: ""
image: "/images/artworks/${slug}.${ext}"
width_cm: ${work.width_cm}
height_cm: ${work.height_cm}
medium:
  no: "${escapeYaml(work.medium)}"
  en: ""
year: ${work.year}
description:
  no: "${escapeYaml(work.description)}"
  en: ""
available: true
featured: false
order: ${order}
---
`;
}

async function main() {
  console.log(
    `[fetch-northart] mode: ${DRY_RUN ? "DRY_RUN" : "LIVE"}${INSPECT ? " +INSPECT" : ""}, limit: ${LIMIT}`,
  );

  const urls = (await getProductUrls()).slice(0, LIMIT);
  console.log(`[fetch-northart] sitemap → ${urls.length} amar-aziz product URL(s)`);
  if (urls.length === 0) {
    console.error("[fetch-northart] no product URLs — sitemap shape changed?");
    process.exit(1);
  }
  for (const u of urls) console.log("  ->", u);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: UA,
    locale: "nb-NO",
  });
  const page = await context.newPage();

  if (!DRY_RUN) {
    await mkdir(IMG_DIR, { recursive: true });
    await mkdir(MD_DIR, { recursive: true });
  }

  const successes = [];
  const failures = [];
  let order = 100;

  for (const url of urls) {
    try {
      console.log(`\n[fetch-northart] ${url}`);
      const work = await scrapeWork(page, url);
      console.log("  title :", work.title || "(missing)");
      console.log("  dims  :", work.width_cm, "x", work.height_cm, "cm");
      console.log("  year  :", work.year);
      console.log("  medium:", work.medium || "(missing)");
      console.log("  image :", work.imageUrl || "(missing)");

      if (INSPECT) {
        console.log("\n--- ALL IMAGES ---");
        for (const s of work.rawImageSrcs ?? []) console.log("  img:", s);
        console.log("\n--- RAW PAGE TEXT (truncated) ---");
        console.log(work.rawText.slice(0, 2000));
        console.log("--- END RAW ---\n");
      }

      const missing = [];
      if (!work.title) missing.push("title");
      if (!work.imageUrl) missing.push("image");
      if (work.width_cm == null) missing.push("dims");
      if (work.year == null) missing.push("year");
      if (missing.length) {
        failures.push({ url, reason: `missing: ${missing.join(", ")}` });
        continue;
      }

      const slug = slugify(work.title);
      if (!slug) {
        failures.push({ url, reason: "empty slug" });
        continue;
      }
      const ext = imageExt(work.imageUrl);
      const imgPath = join(IMG_DIR, `${slug}.${ext}`);
      const mdPath = join(MD_DIR, `${slug}.md`);

      if (!DRY_RUN) {
        if (!(await exists(imgPath))) {
          await downloadBinary(work.imageUrl, imgPath);
          console.log("  saved image ->", imgPath);
        } else {
          console.log("  image exists, skipping download");
        }
        await writeFile(mdPath, buildFrontmatter(work, slug, order, ext));
        console.log("  wrote .md   ->", mdPath);
      }

      successes.push({ url, slug });
      order += 1;
    } catch (err) {
      console.error("  ERROR:", err.message);
      failures.push({ url, reason: err.message });
    }
    await sleep(500);
  }

  await browser.close();

  console.log(`\n[fetch-northart] ok: ${successes.length}, failed: ${failures.length}`);
  if (failures.length) {
    console.log("[fetch-northart] failures:");
    for (const f of failures) console.log("   -", f.url, "—", f.reason);
  }
  if (successes.length === 0) process.exit(1);
}

main().catch((e) => {
  console.error("[fetch-northart] FATAL:", e);
  process.exit(1);
});
