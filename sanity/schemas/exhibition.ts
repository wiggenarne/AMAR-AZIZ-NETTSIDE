import { defineType } from "sanity";

export const exhibition = defineType({
  name: "exhibition",
  title: "Utstillinger",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Tittel",
      type: "localeString",
      validation: (r) => r.required(),
    },
    {
      name: "venue",
      title: "Sted (galleri / lokale)",
      type: "string",
      validation: (r) => r.required(),
    },
    {
      name: "city",
      title: "By",
      type: "string",
      validation: (r) => r.required(),
    },
    {
      name: "country",
      title: "Land",
      type: "string",
      initialValue: "Norway",
    },
    {
      name: "startDate",
      title: "Startdato",
      type: "date",
      validation: (r) => r.required(),
    },
    {
      name: "endDate",
      title: "Sluttdato",
      type: "date",
    },
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Separatutstilling", value: "solo" },
          { title: "Gruppeutstilling", value: "group" },
        ],
        layout: "radio",
      },
      initialValue: "group",
    },
    {
      name: "link",
      title: "Ekstern lenke",
      type: "url",
    },
  ],
  orderings: [
    {
      title: "Startdato (nyest først)",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title.no",
      subtitle: "venue",
      date: "startDate",
    },
    prepare({ title, subtitle, date }) {
      return {
        title,
        subtitle: `${subtitle}${date ? ` — ${date}` : ""}`,
      };
    },
  },
});
