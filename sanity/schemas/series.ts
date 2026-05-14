import { defineType } from "sanity";

export const series = defineType({
  name: "series",
  title: "Serier",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Tittel",
      type: "localeString",
      validation: (r) => r.required(),
    },
    {
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title.no", maxLength: 96 },
      validation: (r) => r.required(),
    },
    {
      name: "statement",
      title: "Beskrivelse av serien",
      type: "localeText",
    },
    {
      name: "cover",
      title: "Forsidebilde",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "order",
      title: "Sortering",
      type: "number",
      initialValue: 0,
    },
  ],
  orderings: [
    {
      title: "Sortering",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title.no", media: "cover" },
  },
});
