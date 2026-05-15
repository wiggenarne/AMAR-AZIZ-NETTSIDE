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
      title: "Nettadresse (slug)",
      description:
        "Lages automatisk fra tittelen. Endre kun hvis du vil at nettadressen til verket skal være annerledes.",
      type: "slug",
      options: { source: "title.no", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Bilde",
      description:
        "Last opp bildet av verket. Dra det blå punktet til den viktigste delen av bildet — det sørger for at beskjæringen på små skjermer fokuserer der.",
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
      description: "Valgfritt — kun for skulptur eller 3D-verk.",
    }),
    defineField({
      name: "medium",
      title: "Teknikk",
      description:
        "F.eks. 'Akryl på lerret' eller 'Digitalt trykk på aluminium'.",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "year",
      title: "År",
      type: "number",
      validation: (r) =>
        r
          .required()
          .integer()
          .min(1900)
          .max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: "series",
      title: "Serie",
      description:
        "Hvilken serie hører dette verket til? La stå tom hvis det står alene.",
      type: "reference",
      to: [{ type: "series" }],
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      description:
        "Valgfri tekst om verket — bakgrunn, inspirasjon, eller annet du vil dele.",
      type: "localeText",
    }),
    defineField({
      name: "available",
      title: "Til salgs",
      description:
        "På = vises som tilgjengelig. Hak av for å vise verket som solgt.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "salesUrl",
      title: "Lenke til salg (NorthArt eller annen butikk)",
      description:
        "Hvis verket selges på NorthArt eller et annet galleri på nett, lim inn lenken her. 'Forespør pris'-knappen blir da til 'Kjøp på NorthArt' og fører kunden direkte dit. La stå tom hvis du foretrekker at de tar kontakt på e-post.",
      type: "url",
      validation: (r) => r.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "featured",
      title: "Fremhevet på forsiden",
      description:
        "På = verket vises i 'Siste verk'-seksjonen på forsiden.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Sortering",
      description:
        "Bestemmer rekkefølge i listene. Lavere tall vises først. La stå på 0 hvis du ikke har en preferanse.",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title.no",
      year: "year",
      medium: "medium.no",
      media: "image",
    },
    prepare({ title, year, medium, media }) {
      const subtitleParts = [year, medium].filter(Boolean);
      return {
        title: title || "(uten tittel)",
        subtitle: subtitleParts.join(" – "),
        media,
      };
    },
  },
});
