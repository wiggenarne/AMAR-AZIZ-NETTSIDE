import { defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Innstillinger",
  type: "document",
  // Singleton-håndtering skjer i sanity.config.ts via structure-builderen
  // (kun én forekomst med deterministisk _id "siteSettings").
  groups: [
    { name: "artist", title: "Kunstner", default: true },
    { name: "contact", title: "Kontakt" },
    { name: "bio", title: "Bio" },
    { name: "cv", title: "CV" },
  ],
  fields: [
    {
      name: "name",
      title: "Navn",
      type: "string",
      group: "artist",
      validation: (r) => r.required(),
    },
    {
      name: "born",
      title: "Født (årstall)",
      type: "number",
      group: "artist",
    },
    {
      name: "birthplace",
      title: "Fødested",
      type: "string",
      group: "artist",
    },
    {
      name: "email",
      title: "E-post",
      type: "string",
      group: "contact",
      validation: (r) => r.required().email(),
    },
    {
      name: "phone",
      title: "Telefon (vist)",
      type: "string",
      group: "contact",
    },
    {
      name: "phoneRaw",
      title: "Telefon (tel:-format)",
      description: "Uten mellomrom, med landkode. Eks: +4745283915",
      type: "string",
      group: "contact",
    },
    {
      name: "address",
      title: "Adresse",
      type: "object",
      group: "contact",
      fields: [
        { name: "street", title: "Gateadresse", type: "string" },
        { name: "postalCode", title: "Postnummer", type: "string" },
        { name: "city", title: "By", type: "string" },
        { name: "country", title: "Land", type: "string" },
      ],
    },
    {
      name: "social",
      title: "Sosiale lenker",
      type: "array",
      of: [{ type: "socialLink" }],
      group: "contact",
    },
    {
      name: "bio",
      title: "Bio (paragrafer)",
      type: "object",
      group: "bio",
      fields: [
        {
          name: "no",
          title: "Norsk",
          type: "array",
          of: [{ type: "text", rows: 3 }],
        },
        {
          name: "en",
          title: "English",
          type: "array",
          of: [{ type: "text", rows: 3 }],
        },
      ],
    },
    {
      name: "cv",
      title: "CV",
      type: "object",
      group: "cv",
      fields: [
        {
          name: "no",
          title: "Norsk",
          type: "object",
          fields: [
            { name: "education", title: "Utdanning", type: "array", of: [{ type: "cvEntry" }] },
            { name: "career", title: "Karriere", type: "array", of: [{ type: "cvEntry" }] },
            { name: "memberships", title: "Medlemskap", type: "array", of: [{ type: "string" }] },
          ],
        },
        {
          name: "en",
          title: "English",
          type: "object",
          fields: [
            { name: "education", title: "Education", type: "array", of: [{ type: "cvEntry" }] },
            { name: "career", title: "Career", type: "array", of: [{ type: "cvEntry" }] },
            { name: "memberships", title: "Memberships", type: "array", of: [{ type: "string" }] },
          ],
        },
      ],
    },
  ],
  preview: {
    select: { title: "name" },
    prepare({ title }) {
      return { title: title ?? "Innstillinger", subtitle: "Singleton" };
    },
  },
});
