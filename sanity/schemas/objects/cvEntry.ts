import { defineType } from "sanity";

export const cvEntry = defineType({
  name: "cvEntry",
  title: "CV-oppføring",
  type: "object",
  fields: [
    {
      name: "years",
      title: "År / periode",
      type: "string",
      validation: (r) => r.required(),
    },
    {
      name: "text",
      title: "Tekst",
      type: "string",
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { title: "years", subtitle: "text" },
  },
});
