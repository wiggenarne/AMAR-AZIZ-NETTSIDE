import { defineField, defineType } from "sanity";

export const series = defineType({
  name: "series",
  title: "Serie",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title.no", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "statement",
      title: "Kunstnerstatement",
      type: "localeText",
    }),
    defineField({
      name: "cover",
      title: "Forsidebilde",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Sortering",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "title.no", media: "cover" },
  },
});
