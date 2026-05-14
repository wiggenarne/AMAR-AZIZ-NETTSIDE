import { sanityClient } from "sanity:client";
import type { Lang } from "../i18n/ui";

export const client = sanityClient;

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; width: number; height: number };
}

export interface LocaleString {
  no: string;
  en?: string;
}

export interface Artwork {
  _id: string;
  slug: string;
  title: LocaleString;
  image: SanityImage;
  width_cm: number;
  height_cm: number;
  depth_cm?: number;
  medium: LocaleString;
  year: number;
  series?: { _id: string; slug: string; title: LocaleString };
  description: LocaleString;
  available: boolean;
  featured: boolean;
  order: number;
}

export interface Series {
  _id: string;
  slug: string;
  title: LocaleString;
  statement: LocaleString;
  cover?: SanityImage;
  order: number;
}

export interface Exhibition {
  _id: string;
  title: LocaleString;
  venue: string;
  city: string;
  country: string;
  startDate: string;
  endDate?: string;
  type: "solo" | "group";
  link?: string;
}

export interface SiteSettings {
  name: string;
  born?: number;
  birthplace?: string;
  email: string;
  phone: string;
  phoneRaw: string;
  address: {
    street?: string;
    postalCode?: string;
    city?: string;
    country?: string;
  };
  social: Array<{ label: string; url: string }>;
  bio: { no: string[]; en: string[] };
  cv: {
    no: {
      education: Array<{ years: string; text: string }>;
      career: Array<{ years: string; text: string }>;
      memberships: string[];
    };
    en: {
      education: Array<{ years: string; text: string }>;
      career: Array<{ years: string; text: string }>;
      memberships: string[];
    };
  };
}

/**
 * Henter en lokalisert streng – faller tilbake til norsk hvis engelsk er tom.
 */
export function pickLocale(value: LocaleString | undefined, lang: Lang): string {
  if (!value) return "";
  const v = value[lang];
  if (v && v.trim()) return v;
  return value.no ?? "";
}
