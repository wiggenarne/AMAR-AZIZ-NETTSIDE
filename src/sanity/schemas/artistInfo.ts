import { defineField, defineType } from "sanity";

export const cvEntry = defineType({
  name: "cvEntry",
  title: "CV-rad",
  type: "object",
  fields: [
    {
      name: "years",
      title: "Årstall (f.eks. '2014–2018')",
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
      title: "Navn (Instagram, Facebook, osv.)",
      type: "string",
      validation: (r) => r.required(),
    },
    {
      name: "url",
      title: "URL",
      type: "url",
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { title: "label", subtitle: "url" },
  },
});

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
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "phone",
      title: "Telefon (vises på siden, f.eks. '+47 452 83 915')",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "phoneRaw",
      title: "Telefon for tel:-lenke (uten mellomrom, f.eks. '+4745283915')",
      type: "string",
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
      title: "Biografi – norsk (ett avsnitt per linje)",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      group: "about",
    }),
    defineField({
      name: "bioEn",
      title: "Biografi – engelsk (ett avsnitt per linje)",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      group: "about",
    }),

    // CV
    defineField({
      name: "educationTitle",
      title: "CV – overskrift 'Utdanning'",
      type: "localeString",
      group: "cv",
    }),
    defineField({
      name: "education",
      title: "Utdanning",
      type: "array",
      of: [{ type: "cvEntry" }],
      group: "cv",
    }),
    defineField({
      name: "careerTitle",
      title: "CV – overskrift 'Karriere'",
      type: "localeString",
      group: "cv",
    }),
    defineField({
      name: "career",
      title: "Karriere",
      type: "array",
      of: [{ type: "cvEntry" }],
      group: "cv",
    }),
    defineField({
      name: "membershipsTitle",
      title: "CV – overskrift 'Medlemskap'",
      type: "localeString",
      group: "cv",
    }),
    defineField({
      name: "membershipsNo",
      title: "Medlemskap – norsk",
      type: "array",
      of: [{ type: "string" }],
      group: "cv",
    }),
    defineField({
      name: "membershipsEn",
      title: "Memberships – English",
      type: "array",
      of: [{ type: "string" }],
      group: "cv",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Kunstner-info" }),
  },
});
