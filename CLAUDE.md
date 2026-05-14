# AMAR-AZIZ-NETTSIDE

Bilingual (Norwegian/English) portfolio site for artist Amar Aziz. Astro 5 static front-end + Sanity v3 CMS — kunden redigerer innhold på `/studio`, og endringene bygges inn statisk ved deploy.

## Stack

- Astro 5 (static SSG) with built-in i18n + `@astrojs/vercel` adapter
- TypeScript, Tailwind CSS 4 (`@tailwindcss/vite`)
- Sanity v3 (`@sanity/astro` + `@sanity/client` + `@sanity/image-url`)
- React 18+ (kun for å rendre Studio på `/studio`)
- `@astrojs/sitemap`

## Commands

```bash
npm install                  # one-time
npm run dev                  # http://localhost:4321 (Studio på /studio)
npm run build                # statisk build → ./dist (henter fra Sanity)
npm run preview              # serve the build

npm run migrate              # engangsmigrering: md + bilder → Sanity (krever SANITY_API_TOKEN)
```

## Miljøvariabler

`.env.local` (kopier fra `.env.example`):

```bash
PUBLIC_SANITY_PROJECT_ID=ee4xo87q
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_STUDIO_URL=https://amar-aziz-nettside.vercel.app/studio
SANITY_API_TOKEN=sk...        # kun for migreringsskript og build-time fetch
```

På Vercel: legg inn alle fire under **Project Settings → Environment Variables**.

## Sanity-skjemaer

Definert i `sanity/schemas/`. Tre dokumenttyper + én singleton:

- `artwork` — tittel (NO/EN), bilde, dimensjoner, år, teknikk, serie (ref), beskrivelse, available, featured, order
- `series` — tittel (NO/EN), statement (NO/EN), cover, order
- `exhibition` — tittel (NO/EN), venue, city, country, startDate, endDate, type (solo/group), link
- `siteSettings` (singleton, `_id: "siteSettings"`) — kunstner-info, kontakt, bio, CV

Tospråklighet via gjenbrukbare `localeString` / `localeText`-objekter (`{no, en}`).

## Routes

- `/` (no), `/en/` — forside
- `/kunstverk/[slug]/`, `/en/artworks/[slug]/` — verk-detalj
- `/serier/[slug]/`, `/en/series/[slug]/` — serie-detalj
- `/utstillinger/`, `/en/exhibitions/` — utstillinger
- `/om/`, `/en/about/` — om kunstneren
- `/studio` — Sanity Studio (kun innloggede redaktører)

## Hvor finnes hva

- Sanity-konfig: `sanity.config.ts`, `sanity/schemas/`
- Sanity-client + GROQ: `src/lib/sanity.ts`, `src/lib/queries.ts`
- Bilde-URL builder: `src/lib/urlForImage.ts`
- Side-komponenter: `src/components/pages/`
- Generelle komponenter: `src/components/`
- Layouts: `src/layouts/`
- UI-strenger (NO/EN): `src/i18n/ui.ts`
- Engangs-migrering: `scripts/migrate-to-sanity.js`

## Legge til et nytt kunstverk

Kunden gjør dette selv:
1. Logg inn på `https://amar-aziz-nettside.vercel.app/studio`
2. Velg **Kunstverk → +**
3. Fyll inn tittel (NO + EN), last opp bilde, sett dimensjoner/år/teknikk
4. Klikk **Publish**
5. Vercel deploy hook trigges automatisk → siden er live på ~60 s

## Webhook (Sanity → Vercel)

For at publiseringer skal trigge en ny build:
1. Vercel: **Project → Settings → Git → Deploy Hooks** → opprett "Sanity Publish"
2. Sanity: **Manage → API → Webhooks → Create webhook**
   - URL: deploy hook fra Vercel
   - Dataset: `production`
   - Trigger on: create / update / delete

## Andre workflows

`.github/workflows/blank.yml` refererer Claude Code Base Action og trenger `ANTHROPIC_API_KEY`. Slett om uønsket — påvirker ikke siden.
