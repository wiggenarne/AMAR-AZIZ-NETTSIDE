import { defineField, defineType } from "sanity";

export const exhibition = defineType({
  name: "exhibition",
  title: "Utstilling",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel på utstillingen",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "venue",
      title: "Sted / galleri",
      description: "Navn på stedet eller galleriet hvor utstillingen er.",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "city",
      title: "By",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "country",
      title: "Land",
      type: "string",
      initialValue: "Norway",
    }),
    defineField({
      name: "startDate",
      title: "Startdato",
      description: "Velg dato fra kalenderen.",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "endDate",
      title: "Sluttdato",
      description: "Valgfritt — la stå tom hvis utstillingen er pågående.",
      type: "date",
    }),
    defineField({
      name: "type",
      title: "Type utstilling",
      type: "string",
      options: {
        list: [
          { title: "Soloutstilling", value: "solo" },
          { title: "Gruppeutstilling", value: "group" },
        ],
        layout: "radio",
      },
      initialValue: "group",
    }),
    defineField({
      name: "link",
      title: "Lenke",
      description:
        "Lenke til utstillingsstedet eller arrangementets nettside (valgfritt).",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "title.no", subtitle: "venue", startDate: "startDate" },
    prepare({ title, subtitle, startDate }) {
      return {
        title,
        subtitle: `${subtitle} — ${startDate ?? ""}`,
      };
    },
  },
  orderings: [
    {
      title: "Dato (nyeste først)",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
});
