import groq from "groq";
import { client } from "./sanity";
import type { Artwork, Series, Exhibition, SiteSettings } from "./sanity";

const artworkProjection = groq`
  _id,
  "slug": slug.current,
  title,
  image,
  width_cm,
  height_cm,
  depth_cm,
  medium,
  year,
  description,
  available,
  featured,
  order,
  series->{ _id, "slug": slug.current, title }
`;

const seriesProjection = groq`
  _id,
  "slug": slug.current,
  title,
  statement,
  cover,
  order
`;

export async function getAllArtworks(): Promise<Artwork[]> {
  return client.fetch(groq`*[_type == "artwork"] | order(order asc) {
    ${artworkProjection}
  }`);
}

export async function getFeaturedArtworks(): Promise<Artwork[]> {
  return client.fetch(groq`*[_type == "artwork" && featured == true] | order(order asc) {
    ${artworkProjection}
  }`);
}

export async function getArtworkSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(groq`*[_type == "artwork" && defined(slug.current)]{
    "slug": slug.current
  }`);
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  return client.fetch(
    groq`*[_type == "artwork" && slug.current == $slug][0]{
      ${artworkProjection}
    }`,
    { slug },
  );
}

export async function getArtworksBySeriesId(seriesId: string): Promise<Artwork[]> {
  return client.fetch(
    groq`*[_type == "artwork" && series._ref == $seriesId] | order(order asc) {
      ${artworkProjection}
    }`,
    { seriesId },
  );
}

export async function getAllSeries(): Promise<Series[]> {
  return client.fetch(groq`*[_type == "series"] | order(order asc) {
    ${seriesProjection}
  }`);
}

export async function getSeriesSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(groq`*[_type == "series" && defined(slug.current)]{
    "slug": slug.current
  }`);
}

export async function getSeriesBySlug(slug: string): Promise<Series | null> {
  return client.fetch(
    groq`*[_type == "series" && slug.current == $slug][0]{
      ${seriesProjection}
    }`,
    { slug },
  );
}

export async function getSeriesCounts(): Promise<Record<string, number>> {
  const rows = await client.fetch<Array<{ id: string; count: number }>>(
    groq`*[_type == "series"]{
      "id": _id,
      "count": count(*[_type == "artwork" && references(^._id)])
    }`,
  );
  return Object.fromEntries(rows.map((row) => [row.id, row.count]));
}

export async function getAllExhibitions(): Promise<Exhibition[]> {
  return client.fetch(groq`*[_type == "exhibition"] | order(startDate desc) {
    _id,
    title,
    venue,
    city,
    country,
    startDate,
    endDate,
    type,
    link
  }`);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return client.fetch(groq`*[_type == "siteSettings"][0]{
    name,
    born,
    birthplace,
    email,
    phone,
    phoneRaw,
    address,
    social,
    bio,
    cv
  }`);
}
