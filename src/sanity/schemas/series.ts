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
      title: "Nettadresse (slug)",
      description:
        "Lages automatisk fra tittelen. Endre kun hvis du vil at nettadressen til serien skal være annerledes.",
      type: "slug",
      options: { source: "title.no", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "statement",
      title: "Kunstnerstatement",
      description:
        "Et par setninger som beskriver tanken bak serien — kan stå tom.",
      type: "localeText",
    }),
    defineField({
      name: "cover",
      title: "Forsidebilde",
      description:
        "Valgfritt — bilde som representerer serien (vises i oversikt).",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Sortering",
      description:
        "Bestemmer rekkefølge i listene. Lavere tall vises først. La stå på 0 hvis du ikke har preferanse.",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "title.no", media: "cover" },
  },
});
