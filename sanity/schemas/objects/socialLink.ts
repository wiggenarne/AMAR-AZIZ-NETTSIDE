import { defineType } from "sanity";

export const socialLink = defineType({
  name: "socialLink",
  title: "Sosial lenke",
  type: "object",
  fields: [
    {
      name: "label",
      title: "Tittel",
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
