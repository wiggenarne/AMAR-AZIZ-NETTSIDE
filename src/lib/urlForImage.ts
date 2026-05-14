import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? "production";

const builder = imageUrlBuilder({ projectId, dataset });

export function urlForImage(source: SanityImageSource | null | undefined) {
  if (!source) return null;
  return builder.image(source).auto("format").fit("max");
}
