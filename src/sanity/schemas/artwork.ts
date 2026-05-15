import { defineField, defineType } from "sanity";

export const artwork = defineType({
  name: "artwork",
  title: "Kunstverk",
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
      name: "image",
      title: "Bilde",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "width_cm",
      title: "Bredde (cm)",
      type: "number",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "height_cm",
      title: "Høyde (cm)",
      type: "number",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "depth_cm",
      title: "Dybde (cm)",
      type: "number",
      description: "Valgfritt — kun for skulptur/3D",
    }),
    defineField({
      name: "medium",
      title: "Teknikk",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "year",
      title: "År",
      type: "number",
      validation: (r) => r.required().integer().min(1900).max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: "series",
      title: "Serie",
      type: "reference",
      to: [{ type: "series" }],
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "localeText",
    }),
    defineField({
      name: "available",
      title: "Til salgs",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Fremhevet på forsiden",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Sortering",
      type: "number",
      initialValue: 0,
      description: "Lavere tall vises først",
    }),
  ],
  preview: {
    select: {
      title: "title.no",
      subtitle: "year",
      media: "image",
    },
  },
});
