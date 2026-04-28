export const artist = {
  name: "Amar Aziz",
  email: "amar260651@gmail.com",
  phone: "+47 452 83 915",
  phoneRaw: "+4745283915",
  address: {
    street: "Holter Terrasse 7",
    postalCode: "1448",
    city: "Drøbak",
    country: "Norge",
  },
  born: 1951,
  birthplace: "Lahore, Pakistan",
  social: [
    { label: "Instagram", url: "https://www.instagram.com/amar2606/" },
    { label: "NorthArt", url: "https://shop.northart.no" },
  ],
} as const;

export const cv = {
  no: {
    education: [
      {
        years: "2014–2018",
        text: "Kunsthøyskolen i Holbæk, Danmark",
      },
      {
        years: "2009–2010",
        text: "Praktisk-pedagogisk utdanning i kunst og håndverk, HIO",
      },
      {
        years: "1977–1980",
        text: "Grafisk design, Statens Håndverks- og kunstindustriskole (SHKS), Oslo",
      },
      {
        years: "1975–1977",
        text: "Interiørarkitektur, Statens Håndverks- og kunstindustriskole (SHKS), Oslo",
      },
      {
        years: "1966–1969",
        text: "Bachelor i arkitektur, National College of Arts, Lahore",
      },
    ],
    career: [
      {
        years: "2004–",
        text: "Profesjonell billedkunstner",
      },
      {
        years: "1984–2004",
        text: "Grafisk designer, Freia Oslo",
      },
    ],
    memberships: [
      "Drøbak Kunstnerforum",
      "Ås Kunstforening",
      "Gamleveien Maleselskab",
    ],
  },
  en: {
    education: [
      {
        years: "2014–2018",
        text: "Holbæk Art School, Denmark",
      },
      {
        years: "2009–2010",
        text: "Practical-Pedagogical Education in Art and Crafts, HIO",
      },
      {
        years: "1977–1980",
        text: "Graphic Design, National College of Art and Design (SHKS), Oslo",
      },
      {
        years: "1975–1977",
        text: "Interior Architecture, National College of Art and Design (SHKS), Oslo",
      },
      {
        years: "1966–1969",
        text: "Bachelor of Architecture, National College of Arts, Lahore",
      },
    ],
    career: [
      {
        years: "2004–",
        text: "Professional visual artist",
      },
      {
        years: "1984–2004",
        text: "Graphic designer, Freia Oslo",
      },
    ],
    memberships: [
      "Drøbak Artists Forum",
      "Ås Art Association",
      "Gamleveien Painting Society",
    ],
  },
} as const;

export const bio = {
  no: [
    "Amar Aziz er en norsk-pakistansk kubist-maler bosatt i Drøbak. Han ble født i Lahore i 1951 og emigrerte til Norge i 1975.",
    "Etter en bachelor i arkitektur fra National College of Arts i Lahore videreutdannet han seg innen interiørarkitektur og grafisk design ved Statens Håndverks- og kunstindustriskole i Oslo.",
    "I 20 år arbeidet Amar som grafisk designer hos Freia. Siden 2004 har han vært profesjonell billedkunstner. Han kombinerer sin arkitektoniske bakgrunn med kunstnerisk uttrykk – senest gjennom digitale kubistiske motiver trykket på børstet aluminium.",
    "Amar har illustrert to fortellinger i prinsesse Märtha Louises «Englebok» og er medlem av Drøbak Kunstnerforum, Ås Kunstforening og Gamleveien Maleselskab.",
  ],
  en: [
    "Amar Aziz is a Norwegian-Pakistani cubist painter based in Drøbak. Born in Lahore in 1951, he emigrated to Norway in 1975.",
    "After a Bachelor of Architecture from the National College of Arts in Lahore, he continued his studies in interior architecture and graphic design at the National College of Art and Design (SHKS) in Oslo.",
    "Amar worked as a graphic designer at Freia for 20 years. Since 2004 he has been a professional visual artist, combining his architectural background with artistic expression – most recently through digital cubist motifs printed on brushed aluminium.",
    "Amar illustrated two stories in Princess Märtha Louise's \"Book of Angels\" and is a member of Drøbak Artists Forum, Ås Art Association and Gamleveien Painting Society.",
  ],
} as const;
