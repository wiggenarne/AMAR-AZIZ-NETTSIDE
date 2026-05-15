import { defineField, defineType } from "sanity";

export const siteContent = defineType({
  name: "siteContent",
  title: "Tekst på nettsiden",
  type: "document",
  description:
    "Her redigerer du fast tekst på nettsiden: hero, intro-tekster, knappetekster og titler. Bruk fanene nedenfor for å bytte mellom sidene. Verk, serier og utstillinger redigeres separat fra venstre meny.",
  groups: [
    { name: "home", title: "Forsiden", default: true },
    { name: "gallery", title: "Galleri" },
    { name: "series", title: "Serier (oversikt)" },
    { name: "exhibitions", title: "Utstillinger" },
    { name: "general", title: "Generelt / SEO" },
  ],
  fields: [
    // FORSIDEN
    defineField({
      name: "heroEyebrow",
      title: "Hero – overtittel (liten tekst over navnet)",
      type: "localeString",
      group: "home",
    }),
    defineField({
      name: "heroLede",
      title: "Hero – introduksjonstekst",
      type: "localeText",
      group: "home",
    }),
    defineField({
      name: "heroCtaPrimary",
      title: "Hero – primær knapp (Se kunstverk)",
      type: "localeString",
      group: "home",
    }),
    defineField({
      name: "heroCtaSecondary",
      title: "Hero – sekundær knapp (Ta kontakt)",
      type: "localeString",
      group: "home",
    }),
    defineField({
      name: "homeAboutTitle",
      title: "Forsiden – tittel på Om-seksjonen",
      type: "localeString",
      group: "home",
    }),
    defineField({
      name: "homeAboutBody",
      title: "Forsiden – kort om-tekst",
      type: "localeText",
      group: "home",
    }),
    defineField({
      name: "homeAboutMore",
      title: "Forsiden – 'Les mer'-lenke-tekst",
      type: "localeString",
      group: "home",
    }),
    defineField({
      name: "homeSeriesTitle",
      title: "Forsiden – tittel på Serier-seksjonen",
      type: "localeString",
      group: "home",
    }),
    defineField({
      name: "homeLatestTitle",
      title: "Forsiden – tittel på 'Siste verk'",
      type: "localeString",
      group: "home",
    }),
    defineField({
      name: "homeLatestViewAll",
      title: "Forsiden – 'Se alle verk'-lenketekst",
      type: "localeString",
      group: "home",
    }),
    defineField({
      name: "homeContactTitle",
      title: "Forsiden – tittel på kontakt-seksjonen",
      type: "localeString",
      group: "home",
    }),
    defineField({
      name: "homeContactBody",
      title: "Forsiden – kontakt-tekst",
      type: "localeText",
      group: "home",
    }),
    defineField({
      name: "homeContactEmailButton",
      title: "Forsiden – knapp 'Send e-post'",
      type: "localeString",
      group: "home",
    }),
    defineField({
      name: "homeContactPhoneButton",
      title: "Forsiden – knapp 'Ring kunstneren'",
      type: "localeString",
      group: "home",
    }),

    // GALLERI
    defineField({
      name: "galleryTitle",
      title: "Galleri – tittel",
      type: "localeString",
      group: "gallery",
    }),
    defineField({
      name: "galleryIntro",
      title: "Galleri – introduksjonstekst",
      type: "localeText",
      group: "gallery",
    }),

    // SERIER
    defineField({
      name: "seriesIndexTitle",
      title: "Serier – tittel",
      type: "localeString",
      group: "series",
    }),
    defineField({
      name: "seriesIndexIntro",
      title: "Serier – introduksjonstekst",
      type: "localeText",
      group: "series",
    }),

    // UTSTILLINGER
    defineField({
      name: "exhibitionsTitle",
      title: "Utstillinger – tittel",
      type: "localeString",
      group: "exhibitions",
    }),
    defineField({
      name: "exhibitionsIntro",
      title: "Utstillinger – introduksjonstekst",
      type: "localeText",
      group: "exhibitions",
    }),

    // GENERELT
    defineField({
      name: "siteTitle",
      title: "Nettsidens tittel (vises i fanen og søketreff)",
      type: "localeString",
      group: "general",
    }),
    defineField({
      name: "siteDescription",
      title: "Nettsidens beskrivelse (SEO meta description)",
      type: "localeText",
      group: "general",
    }),
    defineField({
      name: "footerRights",
      title: "Footer – copyright-tekst",
      type: "localeString",
      group: "general",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Tekst på nettsiden" }),
  },
});
