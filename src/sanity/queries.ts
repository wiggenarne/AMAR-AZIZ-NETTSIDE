import { sanityClient, urlFor } from "./client";

export type LocaleString = { no: string; en: string };

export type SanityImage = {
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number };
};

export type ArtworkDoc = {
  _id: string;
  slug: string;
  title: LocaleString;
  image: SanityImage;
  width_cm: number;
  height_cm: number;
  depth_cm?: number;
  medium: LocaleString;
  year: number;
  seriesSlug?: string;
  description: LocaleString;
  available: boolean;
  featured: boolean;
  order: number;
};

export type SeriesDoc = {
  _id: string;
  slug: string;
  title: LocaleString;
  statement: LocaleString;
  cover?: SanityImage;
  order: number;
};

export type ExhibitionDoc = {
  _id: string;
  title: LocaleString;
  venue: string;
  city: string;
  country: string;
  startDate: string;
  endDate?: string;
  type: "solo" | "group";
  link?: string;
};

const ARTWORK_PROJECTION = `{
  _id,
  "slug": slug.current,
  title,
  image,
  width_cm,
  height_cm,
  depth_cm,
  medium,
  year,
  "seriesSlug": series->slug.current,
  description,
  "available": coalesce(available, true),
  "featured": coalesce(featured, false),
  "order": coalesce(order, 0)
}`;

const SERIES_PROJECTION = `{
  _id,
  "slug": slug.current,
  title,
  statement,
  cover,
  "order": coalesce(order, 0)
}`;

export async function getArtworks(): Promise<ArtworkDoc[]> {
  return sanityClient.fetch(
    `*[_type == "artwork"] | order(order asc, year desc) ${ARTWORK_PROJECTION}`
  );
}

export async function getArtwork(slug: string): Promise<ArtworkDoc | null> {
  return sanityClient.fetch(
    `*[_type == "artwork" && slug.current == $slug][0] ${ARTWORK_PROJECTION}`,
    { slug }
  );
}

export async function getAllSeries(): Promise<SeriesDoc[]> {
  return sanityClient.fetch(
    `*[_type == "series"] | order(order asc, title.no asc) ${SERIES_PROJECTION}`
  );
}

export async function getSeriesBySlug(slug: string): Promise<SeriesDoc | null> {
  return sanityClient.fetch(
    `*[_type == "series" && slug.current == $slug][0] ${SERIES_PROJECTION}`,
    { slug }
  );
}

export async function getArtworksInSeries(seriesSlug: string): Promise<ArtworkDoc[]> {
  return sanityClient.fetch(
    `*[_type == "artwork" && series->slug.current == $seriesSlug] | order(order asc, year desc) ${ARTWORK_PROJECTION}`,
    { seriesSlug }
  );
}

export async function getExhibitions(): Promise<ExhibitionDoc[]> {
  return sanityClient.fetch(
    `*[_type == "exhibition"] | order(startDate desc) {
      _id,
      title,
      venue,
      city,
      "country": coalesce(country, "Norway"),
      startDate,
      endDate,
      "type": coalesce(type, "group"),
      link
    }`
  );
}

export function imageUrl(image: SanityImage, width?: number): string {
  let b = urlFor(image).auto("format").fit("max");
  if (width) b = b.width(width);
  return b.url();
}
