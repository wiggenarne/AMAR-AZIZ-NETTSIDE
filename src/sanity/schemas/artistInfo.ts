import { defineField, defineType } from "sanity";

export const cvEntry = defineType({
  name: "cvEntry",
  title: "CV-rad",
  type: "object",
  fields: [
    {
      name: "years",
      title: "Årstall",
      description: "F.eks. '2014–2018' eller '2004–' for pågående.",
      type: "string",
      validation: (r) => r.required(),
    },
    {
      name: "text",
      title: "Beskrivelse",
      type: "localeString",
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { title: "text.no", subtitle: "years" },
  },
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Sosial lenke",
  type: "object",
  fields: [
    {
      name: "label",
      title: "Navn på lenken",
      description: "F.eks. 'Instagram', 'Facebook', 'NorthArt'.",
      type: "string",
      validation: (r) => r.required(),
    },
    {
      name: "url",
      title: "Nettadresse",
      description: "Full URL, inkludert https://",
      type: "url",
      validation: (r) => r.required().uri({ scheme: ["http", "https"] }),
    },
  ],
  preview: {
    select: { title: "label", subtitle: "url" },
  },
});

const currentYear = new Date().getFullYear();

export const artistInfo = defineType({
  name: "artistInfo",
  title: "Kunstner-info (kontakt + biografi)",
  type: "document",
  groups: [
    { name: "contact", title: "Kontakt", default: true },
    { name: "about", title: "Om / Biografi" },
    { name: "cv", title: "CV" },
  ],
  fields: [
    // KONTAKT
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "email",
      title: "E-post",
      description:
        "E-postadressen som vises på siden og brukes for 'Send e-post'-knappen.",
      type: "string",
      validation: (r) =>
        r.required().email().error("Skriv inn en gyldig e-postadresse."),
      group: "contact",
    }),
    defineField({
      name: "phone",
      title: "Telefon (vises på siden)",
      description: "F.eks. '+47 452 83 915'. Mellomrom og bindestreker er OK.",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "phoneRaw",
      title: "Telefon for klikk-til-ringe",
      description:
        "Genereres automatisk ved oppsett. Trenger normalt ikke endres — gjelder kun selve klikk-å-ringe-lenken.",
      type: "string",
      readOnly: true,
      group: "contact",
    }),
    defineField({
      name: "addressStreet",
      title: "Adresse – gate",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "addressPostalCode",
      title: "Adresse – postnummer",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "addressCity",
      title: "Adresse – by",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "addressCountry",
      title: "Adresse – land",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "social",
      title: "Sosiale lenker",
      description:
        "Lenker til Instagram, Facebook, eller andre profiler. Bruk '+'-knappen for å legge til.",
      type: "array",
      of: [{ type: "socialLink" }],
      group: "contact",
    }),
    defineField({
      name: "contactHeading",
      title: "Tittel på Kontakt-siden",
      type: "localeString",
      group: "contact",
    }),
    defineField({
      name: "contactIntro",
      title: "Innledningstekst på Kontakt-siden",
      type: "localeText",
      group: "contact",
    }),
    defineField({
      name: "contactEmailLabel",
      title: "Etikett over e-post",
      type: "localeString",
      group: "contact",
    }),
    defineField({
      name: "contactPhoneLabel",
      title: "Etikett over telefon",
      type: "localeString",
      group: "contact",
    }),
    defineField({
      name: "contactAddressLabel",
      title: "Etikett over adresse",
      type: "localeString",
      group: "contact",
    }),
    defineField({
      name: "contactSocialLabel",
      title: "Etikett over sosiale lenker",
      type: "localeString",
      group: "contact",
    }),

    // OM / BIOGRAFI
    defineField({
      name: "born",
      title: "Født (årstall)",
      type: "number",
      validation: (r) =>
        r
          .integer()
          .min(1900)
          .max(currentYear)
          .error("Årstallet må være mellom 1900 og i år."),
      group: "about",
    }),
    defineField({
      name: "birthplace",
      title: "Fødselssted",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutHeading",
      title: "Tittel på Om-siden",
      type: "localeString",
      group: "about",
    }),
    defineField({
      name: "bioNo",
      title: "Biografi – norsk",
      description:
        "Skriv ett avsnitt per innslag. Bruk '+'-knappen for å legge til et nytt avsnitt.",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      group: "about",
    }),
    defineField({
      name: "bioEn",
      title: "Biografi – engelsk",
      description:
        "Skriv ett avsnitt per innslag. Kan stå tom hvis du kun ønsker norsk biografi.",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      group: "about",
    }),

    // CV
    defineField({
      name: "educationTitle",
      title: "Overskrift 'Utdanning'",
      type: "localeString",
      group: "cv",
    }),
    defineField({
      name: "education",
      title: "Utdanning",
      description: "Legg til én rad per skole/utdanning. Bruk '+'-knappen.",
      type: "array",
      of: [{ type: "cvEntry" }],
      group: "cv",
    }),
    defineField({
      name: "careerTitle",
      title: "Overskrift 'Karriere'",
      type: "localeString",
      group: "cv",
    }),
    defineField({
      name: "career",
      title: "Karriere",
      description: "Legg til én rad per jobb/posisjon. Bruk '+'-knappen.",
      type: "array",
      of: [{ type: "cvEntry" }],
      group: "cv",
    }),
    defineField({
      name: "membershipsTitle",
      title: "Overskrift 'Medlemskap'",
      type: "localeString",
      group: "cv",
    }),
    defineField({
      name: "membershipsNo",
      title: "Medlemskap – norsk",
      description: "Én forening/medlemskap per rad.",
      type: "array",
      of: [{ type: "string" }],
      group: "cv",
    }),
    defineField({
      name: "membershipsEn",
      title: "Medlemskap – engelsk",
      description:
        "Engelske navn på medlemskapene. Kan stå tom hvis kun norsk brukes.",
      type: "array",
      of: [{ type: "string" }],
      group: "cv",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Kunstner-info" }),
  },
});
