import { defineType } from "sanity";

export const localeString = defineType({
  name: "localeString",
  title: "Tekst (NO/EN)",
  type: "object",
  fields: [
    { name: "no", title: "Norsk", type: "string" },
    { name: "en", title: "English", type: "string" },
  ],
});

export const localeText = defineType({
  name: "localeText",
  title: "Lengre tekst (NO/EN)",
  type: "object",
  fields: [
    { name: "no", title: "Norsk", type: "text", rows: 4 },
    { name: "en", title: "English", type: "text", rows: 4 },
  ],
});
