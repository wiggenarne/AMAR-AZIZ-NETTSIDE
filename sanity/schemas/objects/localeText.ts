import { defineType } from "sanity";

export const localeText = defineType({
  name: "localeText",
  title: "Lokalisert lengre tekst",
  type: "object",
  fields: [
    {
      name: "no",
      title: "Norsk",
      type: "text",
      rows: 5,
    },
    {
      name: "en",
      title: "English",
      type: "text",
      rows: 5,
    },
  ],
});
