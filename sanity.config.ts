import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "amar-aziz-studio",
  title: "Amar Aziz — Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Innhold")
          .items([
            S.listItem()
              .title("Kunstverk")
              .schemaType("artwork")
              .child(S.documentTypeList("artwork").title("Kunstverk")),
            S.listItem()
              .title("Serier")
              .schemaType("series")
              .child(S.documentTypeList("series").title("Serier")),
            S.listItem()
              .title("Utstillinger")
              .schemaType("exhibition")
              .child(S.documentTypeList("exhibition").title("Utstillinger")),
            S.divider(),
            S.listItem()
              .title("Innstillinger")
              .schemaType("siteSettings")
              .child(
                S.editor()
                  .id("siteSettings")
                  .schemaType("siteSettings")
                  .documentId("siteSettings"),
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
