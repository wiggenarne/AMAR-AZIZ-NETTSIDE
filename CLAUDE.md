# AMAR-AZIZ-NETTSIDE

Bilingual (Norwegian/English) portfolio site for artist Amar Aziz. Static, no CMS, no database — content is markdown in `src/content/`.

## Stack

- Astro 5 (static site generator) with built-in i18n
- TypeScript
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- `@astrojs/sitemap`

## Commands

```bash
npm install            # one-time
npm run dev            # http://localhost:4321
npm run build          # static build → ./dist
npm run preview        # serve the build

# NorthArt importer (rarely needed)
npm run fetch:northart                  # scrape all amar-aziz works → md + jpg
npm run fetch:northart -- --dry-run     # parse only, no writes
npm run fetch:northart -- --limit=5     # first 5 only
```

The scraper needs Playwright Chromium: `npx playwright install chromium`.

## Content collections

Defined in `src/content.config.ts`. The `artworks` schema is strict — `npm run build` is the source of truth for validation.

```ts
artworks: {
  title:       { no: string, en: string }   // required
  image:       string                        // "/images/artworks/{slug}.{ext}"
  width_cm:    number
  height_cm:   number
  depth_cm?:   number
  medium:      { no: string, en: string }
  year:        number
  series?:     reference("series")           // must point to an existing series .md
  description: { no: string, en: string }
  available:   boolean = true
  featured:    boolean = false
  order:       number  = 0
}
```

`series` and `exhibitions` collections live alongside under `src/content/`. Slugs are kebab-case ASCII (e.g. `aluminium-prism`, `komposisjon-blaa`).

## Routes

- `/` (no), `/en/` — home
- `/kunstverk/[slug]/`, `/en/artworks/[slug]/` — single artwork
- `/serier/[slug]/`, `/en/series/[slug]/` — series
- `/utstillinger/`, `/en/exhibitions/` — exhibitions
- `/om/`, `/en/about/` — about

Page templates: `src/pages/`. Layouts: `src/layouts/`. Components: `src/components/`. Translations: `src/i18n/`. Hard-coded data (e.g. site config): `src/data/`.

## Adding an artwork manually

1. Save the image at `public/images/artworks/{slug}.jpg`
2. Create `src/content/artworks/{slug}.md` matching the schema — copy an existing file for the shape
3. Run `npm run build` — Zod validation will fail loudly on schema mismatch

## NorthArt importer

`scripts/fetch-northart.js` is a Playwright scraper that reads the sitemap of shop.northart.no, opens each amar-aziz product page in headless Chromium, extracts title/dimensions/year/technique/image, and writes paired `.md` + `.jpg` files. The site is a JS-rendered SPA (Textalk/Abicart) — static fetch returns no product data, so a real browser is required.

`.github/workflows/fetch-northart.yml` runs the script on `workflow_dispatch` and opens a PR via `peter-evans/create-pull-request`. Trigger from Actions tab → "Fetch NorthArt artworks" → "Run workflow". Optional `limit` input for partial imports.

For the workflow's PR-creation step to succeed, repo settings must allow it: **Settings → Actions → General → Workflow permissions → "Allow GitHub Actions to create and approve pull requests"**.

## Other workflows

`.github/workflows/blank.yml` references the Claude Code Base Action and needs an `ANTHROPIC_API_KEY` secret. If failing CI runs are noisy, either set the secret or delete the workflow — neither affects the site build.

## Things to remember

- Both `*.no` and `*.en` fields are required strings; empty `""` is valid for English placeholders awaiting translation.
- `description.no` may also be empty — NorthArt rarely has prose to scrape.
- `series` is optional; setting it requires a matching `src/content/series/{name}.md` to exist (it's a content-collection reference, not a free string).
- Image paths in frontmatter must start with `/images/artworks/...` to be resolved from `public/`.
- Slug collisions are handled by the scraper (suffix `-maleri` / `-digital` / `-trykk`); manual additions should pick a unique slug.
