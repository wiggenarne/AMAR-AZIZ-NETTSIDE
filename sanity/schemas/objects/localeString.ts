import { defineType } from "sanity";

export const localeString = defineType({
  name: "localeString",
  title: "Lokalisert tekst",
  type: "object",
  fields: [
    {
      name: "no",
      title: "Norsk",
      type: "string",
      validation: (r) => r.required(),
    },
    {
      name: "en",
      title: "English",
      type: "string",
    },
  ],
});
