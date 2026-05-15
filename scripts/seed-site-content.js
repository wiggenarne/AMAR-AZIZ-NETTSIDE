#!/usr/bin/env node
/**
 * Lager singleton-dokumentene `siteContent` og `artistInfo` i Sanity med
 * de gjeldende default-verdiene. Skriver kun hvis dokumentene ikke finnes
 * (createIfNotExists), så det er trygt å kjøre flere ganger.
 *
 * Bruk:
 *   PUBLIC_SANITY_PROJECT_ID=xxx PUBLIC_SANITY_DATASET=production \
 *   SANITY_AUTH_TOKEN=sk... node scripts/seed-site-content.js
 *
 * Flagg:
 *   --force   Overskriv eksisterende dokumenter (createOrReplace)
 *   --dry-run Kun vis hva som ville bli skrevet
 */

import { createClient } from "@sanity/client";

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const DRY = args.includes("--dry-run");

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_AUTH_TOKEN;

if (!projectId) bail("PUBLIC_SANITY_PROJECT_ID mangler");
if (!DRY && !token) bail("SANITY_AUTH_TOKEN mangler (kreves når ikke --dry-run)");

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

function bail(msg) {
  console.error("✗", msg);
  process.exit(1);
}

const siteContent = {
  _id: "siteContent",
  _type: "siteContent",
  heroEyebrow: { no: "Kubist-maler i Drøbak", en: "Cubist painter in Drøbak" },
  heroLede: {
    no: "Digitale kubistiske motiver trykket på børstet aluminium – moderne kunst i samspill med interiør, lys og dimensjon.",
    en: "Digital cubist motifs printed on brushed aluminium – modern art in dialogue with interior, light and dimension.",
  },
  heroCtaPrimary: { no: "Se kunstverk", en: "View artworks" },
  heroCtaSecondary: { no: "Ta kontakt", en: "Get in touch" },
  homeAboutTitle: { no: "Om kunstneren", en: "About the artist" },
  homeAboutBody: {
    no: "Født i Lahore i 1951, utdannet arkitekt og grafisk designer, bosatt i Drøbak. Etter 20 år som grafisk designer hos Freia har Amar arbeidet som profesjonell billedkunstner siden 2004.",
    en: "Born in Lahore in 1951, trained as an architect and graphic designer, based in Drøbak. After 20 years as a graphic designer at Freia, Amar has worked as a professional visual artist since 2004.",
  },
  homeAboutMore: { no: "Les mer om Amar", en: "Read more about Amar" },
  homeSeriesTitle: { no: "Utvalgte serier", en: "Selected series" },
  homeLatestTitle: { no: "Siste verk", en: "Latest works" },
  homeLatestViewAll: { no: "Se alle kunstverk", en: "See all artworks" },
  homeContactTitle: { no: "Interessert i et verk?", en: "Interested in a work?" },
  homeContactBody: {
    no: "Alle verk er originaler. Ta direkte kontakt for pris, tilgjengelighet og frakt.",
    en: "All works are originals. Contact the artist directly for price, availability and shipping.",
  },
  homeContactEmailButton: { no: "Send e-post", en: "Send email" },
  homeContactPhoneButton: { no: "Ring kunstneren", en: "Call the artist" },
  galleryTitle: { no: "Kunstverk", en: "Artworks" },
  galleryIntro: {
    no: "Et utvalg originale verk av Amar Aziz – akryl på lerret og digitale kubistiske motiver på børstet aluminium.",
    en: "A selection of original works by Amar Aziz – acrylic on canvas and digital cubist motifs on brushed aluminium.",
  },
  seriesIndexTitle: { no: "Utvalgte serier", en: "Selected series" },
  seriesIndexIntro: {
    no: "Verkene er organisert i tematiske serier som speiler ulike kapitler i Amars kunstneriske utvikling.",
    en: "The works are organised in thematic series that reflect different chapters in Amar's artistic development.",
  },
  exhibitionsTitle: { no: "Utstillinger", en: "Exhibitions" },
  exhibitionsIntro: {
    no: "Et utvalg av separat- og gruppeutstillinger Amar har deltatt i.",
    en: "A selection of solo and group exhibitions Amar has participated in.",
  },
  siteTitle: {
    no: "Amar Aziz – Kubist-maler i Drøbak",
    en: "Amar Aziz – Cubist Painter in Drøbak",
  },
  siteDescription: {
    no: "Amar Aziz er en norsk-pakistansk kubist-maler bosatt i Drøbak. Originale verk på lerret og børstet aluminium.",
    en: "Amar Aziz is a Norwegian-Pakistani cubist painter based in Drøbak. Original works on canvas and brushed aluminium.",
  },
  footerRights: { no: "Alle rettigheter forbeholdt.", en: "All rights reserved." },
};

const artistInfo = {
  _id: "artistInfo",
  _type: "artistInfo",
  name: "Amar Aziz",
  email: "amar260651@gmail.com",
  phone: "+47 452 83 915",
  phoneRaw: "+4745283915",
  addressStreet: "Holter Terrasse 7",
  addressPostalCode: "1448",
  addressCity: "Drøbak",
  addressCountry: "Norge",
  social: [
    { _key: "instagram", label: "Instagram", url: "https://www.instagram.com/amar2606/" },
    { _key: "northart", label: "NorthArt", url: "https://shop.northart.no" },
  ],
  contactHeading: { no: "Kontakt", en: "Contact" },
  contactIntro: {
    no: "Alle verk er originaler. Ta direkte kontakt for pris, tilgjengelighet og frakt.",
    en: "All works are originals. Contact the artist directly for price, availability and shipping.",
  },
  contactEmailLabel: { no: "E-post", en: "Email" },
  contactPhoneLabel: { no: "Telefon", en: "Phone" },
  contactAddressLabel: { no: "Studioadresse", en: "Studio address" },
  contactSocialLabel: { no: "Følg Amar", en: "Follow Amar" },
  born: 1951,
  birthplace: "Lahore, Pakistan",
  aboutHeading: { no: "Om Amar Aziz", en: "About Amar Aziz" },
  bioNo: [
    "Amar Aziz er en norsk-pakistansk kubist-maler bosatt i Drøbak. Han ble født i Lahore i 1951 og emigrerte til Norge i 1975.",
    "Etter en bachelor i arkitektur fra National College of Arts i Lahore videreutdannet han seg innen interiørarkitektur og grafisk design ved Statens Håndverks- og kunstindustriskole i Oslo.",
    "I 20 år arbeidet Amar som grafisk designer hos Freia. Siden 2004 har han vært profesjonell billedkunstner. Han kombinerer sin arkitektoniske bakgrunn med kunstnerisk uttrykk – senest gjennom digitale kubistiske motiver trykket på børstet aluminium.",
    "Amar har illustrert to fortellinger i prinsesse Märtha Louises «Englebok» og er medlem av Drøbak Kunstnerforum, Ås Kunstforening og Gamleveien Maleselskab.",
  ],
  bioEn: [
    "Amar Aziz is a Norwegian-Pakistani cubist painter based in Drøbak. Born in Lahore in 1951, he emigrated to Norway in 1975.",
    "After a Bachelor of Architecture from the National College of Arts in Lahore, he continued his studies in interior architecture and graphic design at the National College of Art and Design (SHKS) in Oslo.",
    "Amar worked as a graphic designer at Freia for 20 years. Since 2004 he has been a professional visual artist, combining his architectural background with artistic expression – most recently through digital cubist motifs printed on brushed aluminium.",
    'Amar illustrated two stories in Princess Märtha Louise\'s "Book of Angels" and is a member of Drøbak Artists Forum, Ås Art Association and Gamleveien Painting Society.',
  ],
  educationTitle: { no: "Utdanning", en: "Education" },
  education: [
    { _key: "edu1", years: "2014–2018", text: { no: "Kunsthøyskolen i Holbæk, Danmark", en: "Holbæk Art School, Denmark" } },
    { _key: "edu2", years: "2009–2010", text: { no: "Praktisk-pedagogisk utdanning i kunst og håndverk, HIO", en: "Practical-Pedagogical Education in Art and Crafts, HIO" } },
    { _key: "edu3", years: "1977–1980", text: { no: "Grafisk design, Statens Håndverks- og kunstindustriskole (SHKS), Oslo", en: "Graphic Design, National College of Art and Design (SHKS), Oslo" } },
    { _key: "edu4", years: "1975–1977", text: { no: "Interiørarkitektur, Statens Håndverks- og kunstindustriskole (SHKS), Oslo", en: "Interior Architecture, National College of Art and Design (SHKS), Oslo" } },
    { _key: "edu5", years: "1966–1969", text: { no: "Bachelor i arkitektur, National College of Arts, Lahore", en: "Bachelor of Architecture, National College of Arts, Lahore" } },
  ],
  careerTitle: { no: "Karriere", en: "Career" },
  career: [
    { _key: "car1", years: "2004–", text: { no: "Profesjonell billedkunstner", en: "Professional visual artist" } },
    { _key: "car2", years: "1984–2004", text: { no: "Grafisk designer, Freia Oslo", en: "Graphic designer, Freia Oslo" } },
  ],
  membershipsTitle: { no: "Medlemskap", en: "Memberships" },
  membershipsNo: ["Drøbak Kunstnerforum", "Ås Kunstforening", "Gamleveien Maleselskab"],
  membershipsEn: ["Drøbak Artists Forum", "Ås Art Association", "Gamleveien Painting Society"],
};

async function upsert(doc) {
  if (DRY) {
    console.log(`  [dry] ville ${FORCE ? "overskrevet" : "opprettet"}: ${doc._id}`);
    return;
  }
  if (FORCE) {
    await client.createOrReplace(doc);
    console.log(`  ✓ overskrevet: ${doc._id}`);
  } else {
    try {
      await client.createIfNotExists(doc);
      console.log(`  ✓ opprettet (eller eksisterte fra før): ${doc._id}`);
    } catch (e) {
      console.error(`  ✗ feilet for ${doc._id}: ${e.message}`);
      throw e;
    }
  }
}

async function main() {
  console.log(`Sanity seed → projectId=${projectId} dataset=${dataset}${DRY ? " (DRY)" : ""}${FORCE ? " (FORCE)" : ""}`);
  await upsert(siteContent);
  await upsert(artistInfo);
  console.log("✓ Ferdig");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
