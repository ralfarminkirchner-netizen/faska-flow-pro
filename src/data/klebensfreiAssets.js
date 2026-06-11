const ASSET_VERSION = "20260609";

const klebensfreiImage = (fileName) => `/klebensfrei/${fileName}?v=${ASSET_VERSION}`;

export const KLEBENSFREI_IMAGES = {
  leo: klebensfreiImage("leo-dschungelbegleiter.png"),
  mira: klebensfreiImage("mira-einhorn-abc.png"),
  nuba: klebensfreiImage("nuba-wolke.png"),
  suedamerika: klebensfreiImage("suedamerika-karte.png"),
  zora: klebensfreiImage("zora-zebra.png"),
};

export const KLEBENSFREI_COMPANIONS = [
  {
    id: "klebensfrei-zora",
    name: "Zora",
    species: "Zebra",
    image: KLEBENSFREI_IMAGES.zora,
    accent: "bg-stone-500",
    color: "#57534e",
    gift: "Muster",
    source: "KLEBENSFREi",
  },
  {
    id: "klebensfrei-nuba",
    name: "Nuba",
    species: "Wolke",
    image: KLEBENSFREI_IMAGES.nuba,
    accent: "bg-sky-300",
    color: "#38bdf8",
    gift: "Leise",
    source: "KLEBENSFREi",
  },
  {
    id: "klebensfrei-mira",
    name: "Mira",
    species: "Einhorn",
    image: KLEBENSFREI_IMAGES.mira,
    accent: "bg-pink-400",
    color: "#ec4899",
    gift: "Zeichen",
    source: "KLEBENSFREi",
  },
  {
    id: "klebensfrei-leo",
    name: "Leo",
    species: "Dschungelbegleiter",
    image: KLEBENSFREI_IMAGES.leo,
    accent: "bg-emerald-500",
    color: "#10b981",
    gift: "Neugier",
    source: "KLEBENSFREi",
  },
];

export const KLEBENSFREI_STORY_PROPS = [
  {
    id: "klebensfrei-suedamerika",
    name: "Südamerika",
    species: "Karte",
    image: KLEBENSFREI_IMAGES.suedamerika,
    color: "#be123c",
    gift: "Reise",
    source: "KLEBENSFREi",
  },
];

export const KLEBENSFREI_SHOWCASE = [...KLEBENSFREI_COMPANIONS, ...KLEBENSFREI_STORY_PROPS];
