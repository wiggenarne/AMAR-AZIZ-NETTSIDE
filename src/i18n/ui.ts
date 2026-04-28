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
    "gallery.title": "Kunstverk",
    "gallery.intro":
      "Et utvalg originale verk av Amar Aziz – akryl på lerret og digitale kubistiske motiver på børstet aluminium.",
    "gallery.empty": "Ingen verk å vise enda.",
    "gallery.filter.all": "Alle",
    "detail.medium": "Medium",
    "detail.dimensions": "Dimensjoner",
    "detail.year": "År",
    "detail.series": "Serie",
    "detail.status": "Status",
    "detail.status.available": "Tilgjengelig",
    "detail.status.sold": "Solgt",
    "detail.back": "← Tilbake til galleri",
    "series.intro":
      "Verkene er organisert i tematiske serier som speiler ulike kapitler i Amars kunstneriske utvikling.",
    "series.works": "Verk i serien",
    "series.works.empty": "Ingen verk i denne serien ennå.",
    "about.heading": "Om Amar Aziz",
    "about.cv.education": "Utdanning",
    "about.cv.career": "Karriere",
    "about.cv.memberships": "Medlemskap",
    "exhibitions.title": "Utstillinger",
    "exhibitions.intro":
      "Et utvalg av separat- og gruppeutstillinger Amar har deltatt i.",
    "exhibitions.solo": "Separatutstilling",
    "exhibitions.group": "Gruppeutstilling",
    "exhibitions.empty": "Ingen utstillinger registrert ennå.",
    "contact.heading": "Kontakt",
    "contact.address": "Studioadresse",
    "contact.social": "Følg Amar",
    "contact.email.label": "E-post",
    "contact.phone.label": "Telefon",
    "404.title": "Siden finnes ikke",
    "404.body":
      "Vi finner dessverre ikke siden du leter etter. Den kan være flyttet eller tatt bort.",
    "404.cta": "Til forsiden",
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
    "gallery.title": "Artworks",
    "gallery.intro":
      "A selection of original works by Amar Aziz – acrylic on canvas and digital cubist motifs on brushed aluminium.",
    "gallery.empty": "No works to show yet.",
    "gallery.filter.all": "All",
    "detail.medium": "Medium",
    "detail.dimensions": "Dimensions",
    "detail.year": "Year",
    "detail.series": "Series",
    "detail.status": "Status",
    "detail.status.available": "Available",
    "detail.status.sold": "Sold",
    "detail.back": "← Back to gallery",
    "series.intro":
      "The works are organised in thematic series that reflect different chapters in Amar's artistic development.",
    "series.works": "Works in this series",
    "series.works.empty": "No works in this series yet.",
    "about.heading": "About Amar Aziz",
    "about.cv.education": "Education",
    "about.cv.career": "Career",
    "about.cv.memberships": "Memberships",
    "exhibitions.title": "Exhibitions",
    "exhibitions.intro":
      "A selection of solo and group exhibitions Amar has participated in.",
    "exhibitions.solo": "Solo exhibition",
    "exhibitions.group": "Group exhibition",
    "exhibitions.empty": "No exhibitions registered yet.",
    "contact.heading": "Contact",
    "contact.address": "Studio address",
    "contact.social": "Follow Amar",
    "contact.email.label": "Email",
    "contact.phone.label": "Phone",
    "404.title": "Page not found",
    "404.body":
      "We can't find the page you're looking for. It may have been moved or removed.",
    "404.cta": "Go to homepage",
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
