import {
  getArtworks as fetchArtworks,
  getArtwork as fetchArtwork,
  getAllSeries as fetchAllSeries,
  getSeriesBySlug as fetchSeriesBySlug,
  getArtworksInSeries as fetchArtworksInSeries,
  getExhibitions as fetchExhibitions,
  getSiteContent as fetchSiteContent,
  getArtistInfo as fetchArtistInfo,
  imageUrl,
  type ArtworkDoc,
  type SeriesDoc,
  type ExhibitionDoc,
  type SiteContentDoc,
  type ArtistInfoDoc,
} from "./queries";
import { siteContentDefaults, artistInfoDefaults } from "./defaults";
import type { Lang } from "../i18n/ui";

export type LocaleString = { no: string; en: string };

export type ArtworkEntry = {
  id: string;
  data: {
    title: LocaleString;
    image: string;
    width_cm: number;
    height_cm: number;
    depth_cm?: number;
    medium: LocaleString;
    year: number;
    series?: { id: string };
    description: LocaleString;
    available: boolean;
    featured: boolean;
    order: number;
    salesUrl?: string;
  };
};

export type SeriesEntry = {
  id: string;
  data: {
    title: LocaleString;
    statement: LocaleString;
    cover?: string;
    order: number;
  };
};

export type ExhibitionEntry = {
  id: string;
  data: {
    title: LocaleString;
    venue: string;
    city: string;
    country: string;
    startDate: Date;
    endDate?: Date;
    type: "solo" | "group";
    link?: string;
  };
};

const ARTWORK_IMG_WIDTH = 1600;
const COVER_IMG_WIDTH = 1400;

function artworkToEntry(doc: ArtworkDoc): ArtworkEntry {
  return {
    id: doc.slug,
    data: {
      title: doc.title,
      image: doc.image ? imageUrl(doc.image, ARTWORK_IMG_WIDTH) : "",
      width_cm: doc.width_cm,
      height_cm: doc.height_cm,
      depth_cm: doc.depth_cm,
      medium: doc.medium,
      year: doc.year,
      series: doc.seriesSlug ? { id: doc.seriesSlug } : undefined,
      description: doc.description ?? { no: "", en: "" },
      available: doc.available,
      featured: doc.featured,
      order: doc.order,
      salesUrl: doc.salesUrl,
    },
  };
}

function seriesToEntry(doc: SeriesDoc): SeriesEntry {
  return {
    id: doc.slug,
    data: {
      title: doc.title,
      statement: doc.statement ?? { no: "", en: "" },
      cover: doc.cover ? imageUrl(doc.cover, COVER_IMG_WIDTH) : undefined,
      order: doc.order,
    },
  };
}

function exhibitionToEntry(doc: ExhibitionDoc): ExhibitionEntry {
  return {
    id: doc._id,
    data: {
      title: doc.title,
      venue: doc.venue,
      city: doc.city,
      country: doc.country,
      startDate: new Date(doc.startDate),
      endDate: doc.endDate ? new Date(doc.endDate) : undefined,
      type: doc.type,
      link: doc.link,
    },
  };
}

export async function getArtworks(): Promise<ArtworkEntry[]> {
  const docs = await fetchArtworks();
  return docs.map(artworkToEntry);
}

export async function getArtwork(slug: string): Promise<ArtworkEntry | null> {
  const doc = await fetchArtwork(slug);
  return doc ? artworkToEntry(doc) : null;
}

export async function getSeries(): Promise<SeriesEntry[]> {
  const docs = await fetchAllSeries();
  return docs.map(seriesToEntry);
}

export async function getSeriesEntry(slug: string): Promise<SeriesEntry | null> {
  const doc = await fetchSeriesBySlug(slug);
  return doc ? seriesToEntry(doc) : null;
}

export async function getArtworksInSeries(seriesSlug: string): Promise<ArtworkEntry[]> {
  const docs = await fetchArtworksInSeries(seriesSlug);
  return docs.map(artworkToEntry);
}

export async function getExhibitions(): Promise<ExhibitionEntry[]> {
  const docs = await fetchExhibitions();
  return docs.map(exhibitionToEntry);
}

export type SiteContent = Required<SiteContentDoc>;
export type ArtistInfo = Required<ArtistInfoDoc>;

function mergeLocale(
  doc: LocaleString | undefined,
  fallback: LocaleString,
): LocaleString {
  return {
    no: doc?.no?.trim() ? doc.no : fallback.no,
    en: doc?.en?.trim() ? doc.en : fallback.en,
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  const doc = (await fetchSiteContent()) ?? {};
  const out: any = {};
  for (const [key, fallback] of Object.entries(siteContentDefaults)) {
    out[key] = mergeLocale(
      (doc as any)[key],
      fallback as LocaleString,
    );
  }
  return out;
}

export async function getArtistInfo(): Promise<ArtistInfo> {
  const doc = (await fetchArtistInfo()) ?? {};
  const d = doc as any;
  const def = artistInfoDefaults as any;
  const pick = <T,>(value: T | undefined, fb: T): T =>
    value === undefined || value === null || (typeof value === "string" && value.trim() === "")
      ? fb
      : value;
  return {
    name: pick(d.name, def.name),
    email: pick(d.email, def.email),
    phone: pick(d.phone, def.phone),
    phoneRaw: pick(d.phoneRaw, def.phoneRaw),
    addressStreet: pick(d.addressStreet, def.addressStreet),
    addressPostalCode: pick(d.addressPostalCode, def.addressPostalCode),
    addressCity: pick(d.addressCity, def.addressCity),
    addressCountry: pick(d.addressCountry, def.addressCountry),
    social: d.social?.length ? d.social : def.social,
    contactHeading: mergeLocale(d.contactHeading, def.contactHeading),
    contactIntro: mergeLocale(d.contactIntro, def.contactIntro),
    contactEmailLabel: mergeLocale(d.contactEmailLabel, def.contactEmailLabel),
    contactPhoneLabel: mergeLocale(d.contactPhoneLabel, def.contactPhoneLabel),
    contactAddressLabel: mergeLocale(d.contactAddressLabel, def.contactAddressLabel),
    contactSocialLabel: mergeLocale(d.contactSocialLabel, def.contactSocialLabel),
    born: pick(d.born, def.born),
    birthplace: pick(d.birthplace, def.birthplace),
    aboutHeading: mergeLocale(d.aboutHeading, def.aboutHeading),
    bioNo: d.bioNo?.length ? d.bioNo : def.bioNo,
    bioEn: d.bioEn?.length ? d.bioEn : def.bioEn,
    educationTitle: mergeLocale(d.educationTitle, def.educationTitle),
    education: d.education?.length ? d.education : def.education,
    careerTitle: mergeLocale(d.careerTitle, def.careerTitle),
    career: d.career?.length ? d.career : def.career,
    membershipsTitle: mergeLocale(d.membershipsTitle, def.membershipsTitle),
    membershipsNo: d.membershipsNo?.length ? d.membershipsNo : def.membershipsNo,
    membershipsEn: d.membershipsEn?.length ? d.membershipsEn : def.membershipsEn,
  };
}

export function bio(info: ArtistInfo, lang: Lang): string[] {
  return lang === "no" ? info.bioNo : info.bioEn;
}

export function memberships(info: ArtistInfo, lang: Lang): string[] {
  return lang === "no" ? info.membershipsNo : info.membershipsEn;
}
