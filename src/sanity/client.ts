import { createClient } from "@sanity/client";
import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  throw new Error(
    "PUBLIC_SANITY_PROJECT_ID mangler. Legg den i .env (se .env.example).",
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  useCdn: true,
  perspective: "published",
  stega: {
    enabled: true,
    studioUrl: "/studio",
  },
});

const builder = createImageUrlBuilder(sanityClient);
export const urlFor = (source: SanityImageSource) => builder.image(source);
