import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "./src/sanity/schemas";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? "production";
const previewUrl =
  import.meta.env.PUBLIC_SITE_URL ?? "https://amar-aziz-nettside.vercel.app";

const SINGLETONS = ["siteContent", "artistInfo"] as const;

export default defineConfig({
  name: "default",
  title: "Amar Aziz – Innhold",
  projectId,
  dataset,
  plugins: [
    presentationTool({
      previewUrl: {
        origin: previewUrl,
        preview: "/",
      },
    }),
    structureTool({
      structure: (S) =>
        S.list()
          .title("Innhold")
          .items([
            S.listItem()
              .title("Tekst på nettsiden")
              .id("siteContent")
              .child(
                S.document().schemaType("siteContent").documentId("siteContent"),
              ),
            S.listItem()
              .title("Kunstner-info (kontakt + biografi)")
              .id("artistInfo")
              .child(
                S.document().schemaType("artistInfo").documentId("artistInfo"),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) =>
                item.getId() && !SINGLETONS.includes(item.getId() as any),
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) => !SINGLETONS.includes(schemaType as any),
      ),
  },
  document: {
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType as any)
        ? input.filter(
            ({ action }) =>
              !["unpublish", "delete", "duplicate"].includes(action ?? ""),
          )
        : input,
  },
});
