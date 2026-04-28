# Amar Aziz – Portefølje-nettside

Statisk nettside for den norsk-pakistanske kubist-maleren Amar Aziz (Drøbak).
Bygget med [Astro](https://astro.build/) og [Tailwind CSS](https://tailwindcss.com/),
deployet som ren statisk side på Vercel free tier.

**Live:** https://amar-aziz-nettside.vercel.app

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
├── components/
│   ├── pages/            # delte side-bodies (HomePage, GalleryPage, …)
│   ├── ArtworkCard.astro
│   ├── Footer.astro
│   ├── Header.astro
│   └── InquiryButton.astro
├── content/
│   ├── artworks/         # ett .md per kunstverk (NO+EN frontmatter)
│   ├── series/           # ett .md per serie
│   └── exhibitions/      # ett .md per utstilling
├── data/
│   └── settings.ts       # artist-info, bio, CV
├── i18n/
│   └── ui.ts             # NO/EN-strenger og rute-mapping
├── layouts/
│   └── BaseLayout.astro  # head, hreflang, OG, fonts
├── pages/                # NO-ruter (default uten prefiks)
│   └── en/               # EN-ruter under /en/
└── styles/
    └── global.css        # designtokens og Tailwind-import
```

## Legge til et nytt kunstverk

1. Legg fotofil i `public/images/artworks/<slug>.jpg`
   (1600×1600 px anbefalt for kvadratiske verk; mindre dimensjoner OK).
2. Lag `src/content/artworks/<slug>.md` med dette skjelettet:

   ```markdown
   ---
   title:
     no: "Verkets tittel"
     en: "Work title"
   image: "/images/artworks/<slug>.jpg"
   width_cm: 100
   height_cm: 100
   medium:
     no: "Akryl på lerret"
     en: "Acrylic on canvas"
   year: 2025
   series: aluminium  # valgfritt: slug fra src/content/series/
   description:
     no: "Norsk beskrivelse av verket."
     en: "English description of the work."
   available: true
   featured: false  # vises på forsiden hvis true
   order: 7  # lavere tall = vises først
   ---
   ```

3. `npm run build` bekrefter at skjemaet stemmer.
4. Commit og push – Vercel deployer automatisk.

## Legge til en utstilling

Lag `src/content/exhibitions/<slug>.md`:

```markdown
---
title:
  no: "Utstillingstittel"
  en: "Exhibition title"
venue: "Galleri X"
city: "Oslo"
country: "Norway"
startDate: 2026-03-15
endDate: 2026-04-15  # valgfritt
type: solo  # eller group
link: "https://galleri-x.no/utstilling"  # valgfritt
---
```

## Endre artist-info

`src/data/settings.ts` inneholder e-post, telefon, adresse, bio og CV.
Endre der – det oppdateres på alle sider samtidig.

## Deploy

Vercel deployer automatisk:

- Push til `main` → produksjons-deploy.
- Hver PR → preview-deploy med egen URL i PR-kommentar.

For å koble til custom domene (f.eks. `amaraziz.no`):
Vercel-dashboard → Settings → Domains → Add domain. Oppdater
`site`-URL i `astro.config.mjs` etterpå.
