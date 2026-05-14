import { defineType } from "sanity";

export const artwork = defineType({
  name: "artwork",
  title: "Kunstverk",
  type: "document",
  groups: [
    { name: "content", title: "Innhold", default: true },
    { name: "meta", title: "Metadata" },
    { name: "display", title: "Visning" },
  ],
  fields: [
    {
      name: "title",
      title: "Tittel",
      type: "localeString",
      group: "content",
      validation: (r) => r.required(),
    },
    {
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "content",
      options: { source: "title.no", maxLength: 96 },
      validation: (r) => r.required(),
    },
    {
      name: "image",
      title: "Bilde",
      type: "image",
      group: "content",
      options: { hotspot: true },
      validation: (r) => r.required(),
    },
    {
      name: "year",
      title: "År",
      type: "number",
      group: "meta",
      validation: (r) => r.required().min(1900).max(new Date().getFullYear() + 1),
    },
    {
      name: "medium",
      title: "Teknikk / medium",
      type: "localeString",
      group: "meta",
      validation: (r) => r.required(),
    },
    {
      name: "width_cm",
      title: "Bredde (cm)",
      type: "number",
      group: "meta",
      validation: (r) => r.required().positive(),
    },
    {
      name: "height_cm",
      title: "Høyde (cm)",
      type: "number",
      group: "meta",
      validation: (r) => r.required().positive(),
    },
    {
      name: "depth_cm",
      title: "Dybde (cm)",
      type: "number",
      group: "meta",
    },
    {
      name: "series",
      title: "Serie",
      type: "reference",
      to: [{ type: "series" }],
      group: "meta",
    },
    {
      name: "description",
      title: "Beskrivelse",
      type: "localeText",
      group: "content",
    },
    {
      name: "available",
      title: "Tilgjengelig for salg",
      type: "boolean",
      initialValue: true,
      group: "display",
    },
    {
      name: "featured",
      title: "Vis på forsiden",
      type: "boolean",
      initialValue: false,
      group: "display",
    },
    {
      name: "order",
      title: "Sortering",
      type: "number",
      initialValue: 0,
      group: "display",
    },
  ],
  orderings: [
    {
      title: "Sortering",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "År (nyest først)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title.no",
      subtitle: "year",
      media: "image",
    },
  },
});
