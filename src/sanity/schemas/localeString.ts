import { defineType } from "sanity";

export const localeString = defineType({
  name: "localeString",
  title: "Tekst (NO/EN)",
  type: "object",
  fields: [
    {
      name: "no",
      title: "Norsk",
      description: "Norsk tekst. Vises som standard på nettsiden.",
      type: "string",
    },
    {
      name: "en",
      title: "Engelsk",
      description:
        "Engelsk versjon. Kan stå tom hvis du kun ønsker norsk på siden.",
      type: "string",
    },
  ],
});

export const localeText = defineType({
  name: "localeText",
  title: "Lengre tekst (NO/EN)",
  type: "object",
  fields: [
    {
      name: "no",
      title: "Norsk",
      description: "Norsk tekst. Vises som standard på nettsiden.",
      type: "text",
      rows: 4,
    },
    {
      name: "en",
      title: "Engelsk",
      description:
        "Engelsk versjon. Kan stå tom hvis du kun ønsker norsk på siden.",
      type: "text",
      rows: 4,
    },
  ],
});
