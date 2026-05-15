# AMAR-AZIZ-NETTSIDE

Bilingual (Norwegian/English) portfolio site for artist Amar Aziz. Content lives in **Sanity.io** (CMS). Sanity Studio is embedded at `/studio`.

## Stack

- Astro 5 (static site generator) with built-in i18n
- TypeScript
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- `@astrojs/sitemap`
- **Sanity.io** for content (artworks, series, exhibitions)
- Embedded Sanity Studio via `@sanity/astro`

## Env vars

Required for both dev and build. Copy `.env.example` → `.env`:

```
PUBLIC_SANITY_PROJECT_ID=4tuzsh1b
PUBLIC_SANITY_DATASET=production
SANITY_AUTH_TOKEN=sk...     # only for migration script and write-access
```

`PUBLIC_*` vars are exposed to the client (read-only Sanity API uses them). `SANITY_AUTH_TOKEN` is **secret** — never commit.

On Vercel: add the same vars to the project's Environment Variables (Production + Preview).

## Commands

```bash
npm install            # one-time
npm run dev            # http://localhost:4321 (site) and /studio (CMS)
npm run build          # static build → ./dist
npm run preview        # serve the build

# Migration (one-time, from markdown → Sanity)
npm run sanity:migrate:dry      # parse only, no writes
npm run sanity:migrate          # upload artworks/series/exhibitions + images

# Legacy NorthArt scraper (rarely needed)
npm run fetch:northart                  # scrape amar-aziz works → md + jpg
npm run fetch:northart -- --dry-run
npm run fetch:northart -- --limit=5
```

The scraper needs Playwright Chromium: `npx playwright install chromium`.

## Content model (Sanity schemas in `src/sanity/schemas/`)

```ts
artwork {
  title:       { no: string, en: string }   // required
  slug:        slug                          // kebab-case
  image:       image                         // Sanity asset (hotspot enabled)
  width_cm:    number
  height_cm:   number
  depth_cm?:   number
  medium:      { no: string, en: string }
  year:        number
  series?:     reference -> series
  description: { no: string, en: string }
  available:   boolean = true
  featured:    boolean = false
  order:       number  = 0
}

series {
  title:     { no: string, en: string }
  slug:      slug
  statement: { no: string, en: string }
  cover?:    image
  order:     number = 0
}

exhibition {
  title:     { no: string, en: string }
  venue:     string
  city:      string
  country:   string = "Norway"
  startDate: date
  endDate?:  date
  type:      "solo" | "group" = "group"
  link?:     url
}
```

Localized fields use the `localeString`/`localeText` object type (NO + EN). Empty `""` strings are valid placeholders.

## Data flow

Pages fetch via the adapter in `src/sanity/content.ts`:

- `getArtworks()`, `getArtwork(slug)`, `getArtworksInSeries(slug)`
- `getSeries()`, `getSeriesEntry(slug)`
- `getExhibitions()`

The adapter returns objects in `{ id, data: {...} }` shape (mirrors the old Astro content-collection entries), so page templates require minimal changes.

Raw Sanity client + GROQ queries live in `src/sanity/queries.ts`. Image URLs are built via `urlFor()` from `src/sanity/client.ts`.

## Routes

- `/` (no), `/en/` — home
- `/kunstverk/[slug]/`, `/en/artworks/[slug]/` — single artwork
- `/serier/[slug]/`, `/en/series/[slug]/` — series
- `/utstillinger/`, `/en/exhibitions/` — exhibitions
- `/om/`, `/en/about/` — about
- **`/studio/#/`** — Sanity Studio (hash-routed SPA, gated by Sanity login)

Page templates: `src/pages/`. Layouts: `src/layouts/`. Components: `src/components/`. Translations: `src/i18n/`. Site config: `src/data/`.

## Adding/editing content

Use the embedded Studio at `/studio` — log in with the same account that owns the Sanity project at sanity.io/manage. All edits are immediately reflected on next build (or live in dev mode).

## Static build + content updates

Build is fully static. To redeploy when content changes:

1. Sanity dashboard → **API → Webhooks → Add webhook**
2. URL: your hosting deploy hook (Vercel: Project Settings → Git → Deploy Hooks)
3. Trigger: Create, Update, Delete on all document types

Now any edit in Studio triggers a fresh deploy.

## CORS origins (required)

Sanity blocks API requests unless the origin is allowlisted:

- `http://localhost:4321` — local dev
- `http://localhost:3333` — Sanity Studio default port (legacy)
- Production URL once deployed
- `*` (with Allow credentials = on) — broadest setting, fine for read-only data

Configure at https://www.sanity.io/manage/project/4tuzsh1b/api

## NorthArt importer (legacy)

`scripts/fetch-northart.js` is a Playwright scraper for shop.northart.no. It writes `.md` + `.jpg` files into the old `src/content/` layout. To bring those works into Sanity, run the scraper followed by `npm run sanity:migrate`.

`.github/workflows/fetch-northart.yml` runs on `workflow_dispatch` and opens a PR. Requires repo permission: **Settings → Actions → General → Workflow permissions → "Allow GitHub Actions to create and approve pull requests"**.

## Other workflows

`.github/workflows/blank.yml` references the Claude Code Base Action and needs an `ANTHROPIC_API_KEY` secret. Failing runs are cosmetic — they don't affect the site build.

## Things to remember

- `PUBLIC_SANITY_PROJECT_ID` must be set or the dev server / build will throw at module load.
- The studio uses hash-based routing (`/studio/#/...`) so it works with Astro's static output — no SSR adapter required.
- Slugs are managed by Sanity's slug field — keep them kebab-case ASCII.
- The old markdown files in `src/content/` are kept temporarily for migration source. After migration is verified, they can be deleted along with `public/images/artworks/` (since images now live in Sanity's asset CDN).
- Sanity free tier: 100k API requests/month, 5GB asset storage — ample for this site.
