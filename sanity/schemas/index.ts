import { localeString } from "./objects/localeString";
import { localeText } from "./objects/localeText";
import { cvEntry } from "./objects/cvEntry";
import { socialLink } from "./objects/socialLink";
import { artwork } from "./artwork";
import { series } from "./series";
import { exhibition } from "./exhibition";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [
  // Objects
  localeString,
  localeText,
  cvEntry,
  socialLink,
  // Documents
  artwork,
  series,
  exhibition,
  siteSettings,
];
