# Amar Aziz – Portefølje-nettside

Statisk nettside for den norsk-pakistanske kubist-maleren Amar Aziz (Drøbak).
Bygget med [Astro](https://astro.build/) og [Tailwind CSS](https://tailwindcss.com/),
deployet som ren statisk side på Vercel free tier.

## Stack

- **Astro 5** – statisk sidegenerator med innebygd i18n
- **TypeScript** – streng typing
- **Tailwind CSS 4** – via Vite-plugin
- **@astrojs/sitemap** – `sitemap-index.xml` ved build
- **Ingen API-er** – ingen CMS, ingen database, ingen serverless funksjoner.
  Alt innhold lever som filer i repoet. Kontakt skjer via `mailto:` og `tel:`.

## Lokalt utviklingsmiljø

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # bygger til ./dist
npm run preview  # forhåndsvis bygd output
```

Krever Node 20+.

## Prosjektstruktur

```
src/
├── components/      # Header.astro, Footer.astro
├── i18n/            # ui.ts (NO/EN-strenger og rute-mapping)
├── layouts/         # BaseLayout.astro (head, hreflang, OG)
├── pages/           # index.astro (forside)
└── styles/          # global.css (designtokens, Tailwind-import)
```

## Deploy til Vercel

Repoet er klart for direkte import:

1. Gå til https://vercel.com/new
2. Velg `wiggenarne/amar-aziz-nettside`
3. Vercel auto-detekterer Astro – bekreft med **Deploy**
4. Etter første deploy: oppdater `site`-URL i `astro.config.mjs`
   til den faktiske Vercel-URL-en for korrekt sitemap og hreflang.

## Innholdsoppdatering

Per dags dato (Fase 2) er innholdet hardkodet i `src/pages/index.astro`.
Fra Fase 3 flyttes kunstverk og serier inn i Astro Content Collections
under `src/content/`, slik at hvert verk er en Markdown-fil med bilde.
