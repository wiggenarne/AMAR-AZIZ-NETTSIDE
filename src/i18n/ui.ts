export const languages = {
  no: "Norsk",
  en: "English",
} as const;

export type Lang = keyof typeof languages;

export const ui = {
  no: {
    "nav.home": "Forside",
    "nav.artworks": "Kunstverk",
    "nav.series": "Serier",
    "nav.about": "Om kunstneren",
    "nav.exhibitions": "Utstillinger",
    "nav.contact": "Kontakt",
    "site.title": "Amar Aziz – Kubist-maler i Drøbak",
    "site.description":
      "Amar Aziz er en norsk-pakistansk kubist-maler bosatt i Drøbak. Originale verk på lerret og børstet aluminium.",
    "hero.eyebrow": "Kubist-maler i Drøbak",
    "hero.lede":
      "Digitale kubistiske motiver trykket på børstet aluminium – moderne kunst i samspill med interiør, lys og dimensjon.",
    "hero.cta.primary": "Se kunstverk",
    "hero.cta.secondary": "Ta kontakt",
    "about.title": "Om kunstneren",
    "about.body":
      "Født i Lahore i 1951, utdannet arkitekt og grafisk designer, bosatt i Drøbak. Etter 20 år som grafisk designer hos Freia har Amar arbeidet som profesjonell billedkunstner siden 2004.",
    "about.more": "Les mer om Amar",
    "series.title": "Utvalgte serier",
    "latest.title": "Siste verk",
    "latest.viewAll": "Se alle kunstverk",
    "contact.title": "Interessert i et verk?",
    "contact.body":
      "Alle verk er originaler. Ta direkte kontakt for pris, tilgjengelighet og frakt.",
    "contact.email": "Send e-post",
    "contact.phone": "Ring kunstneren",
    "footer.rights": "Alle rettigheter forbeholdt.",
  },
  en: {
    "nav.home": "Home",
    "nav.artworks": "Artworks",
    "nav.series": "Series",
    "nav.about": "About",
    "nav.exhibitions": "Exhibitions",
    "nav.contact": "Contact",
    "site.title": "Amar Aziz – Cubist Painter in Drøbak",
    "site.description":
      "Amar Aziz is a Norwegian-Pakistani cubist painter based in Drøbak. Original works on canvas and brushed aluminium.",
    "hero.eyebrow": "Cubist painter in Drøbak",
    "hero.lede":
      "Digital cubist motifs printed on brushed aluminium – modern art in dialogue with interior, light and dimension.",
    "hero.cta.primary": "View artworks",
    "hero.cta.secondary": "Get in touch",
    "about.title": "About the artist",
    "about.body":
      "Born in Lahore in 1951, trained as an architect and graphic designer, based in Drøbak. After 20 years as a graphic designer at Freia, Amar has worked as a professional visual artist since 2004.",
    "about.more": "Read more about Amar",
    "series.title": "Selected series",
    "latest.title": "Latest works",
    "latest.viewAll": "See all artworks",
    "contact.title": "Interested in a work?",
    "contact.body":
      "All works are originals. Contact the artist directly for price, availability and shipping.",
    "contact.email": "Send email",
    "contact.phone": "Call the artist",
    "footer.rights": "All rights reserved.",
  },
} as const;

export type UIKey = keyof (typeof ui)["no"];

export function t(lang: Lang, key: UIKey): string {
  return ui[lang][key];
}

export const routes = {
  no: {
    home: "/",
    artworks: "/kunstverk",
    series: "/serier",
    about: "/om",
    exhibitions: "/utstillinger",
    contact: "/kontakt",
  },
  en: {
    home: "/en/",
    artworks: "/en/artworks",
    series: "/en/series",
    about: "/en/about",
    exhibitions: "/en/exhibitions",
    contact: "/en/contact",
  },
} as const;
