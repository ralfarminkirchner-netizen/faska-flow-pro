export const PREMIUM_PICTURE_BOOK_SCENES = {
  deutsch: {
    title: "Buchstabenlichtung",
    subtitle: "Deutsch",
    image: "/premium/scenes/deutsch-buchstabenlichtung.svg",
    accent: "#c96f2d",
    ink: "#5d3b25",
    tokens: ["A", "M", "Ei", "Sch"],
  },
  mathe: {
    title: "Zahlenwerkstatt",
    subtitle: "Mathe",
    image: "/premium/scenes/mathe-zahlenwerkstatt.svg",
    accent: "#2f80b7",
    ink: "#23465f",
    tokens: ["1", "5", "10", "+"],
  },
  welt: {
    title: "Wunderwelt",
    subtitle: "Welt",
    image: "/premium/scenes/welt-forscherpfad.svg",
    accent: "#3d9270",
    ink: "#285946",
    tokens: ["Blatt", "Stern", "See", "Berg"],
  },
  miteinander: {
    title: "Herzgarten",
    subtitle: "Miteinander",
    image: "/premium/scenes/miteinander-herzgarten.svg",
    accent: "#ba5d7b",
    ink: "#66364c",
    tokens: ["Mut", "Danke", "Stopp", "Wir"],
  },
  musik: {
    title: "Klangnest",
    subtitle: "Musik",
    image: "/premium/scenes/musik-klangnest.svg",
    accent: "#8d69bd",
    ink: "#4f3d68",
    tokens: ["Ta", "Ti", "La", "Bum"],
  },
  abenteuer: {
    title: "Sternenpfad",
    subtitle: "Abenteuer",
    image: "/premium/scenes/abenteuer-sternenpfad.svg",
    accent: "#d59335",
    ink: "#5b4930",
    tokens: ["Karte", "Tor", "Fund", "Ziel"],
  },
};

export const premiumPictureBookSceneList = Object.entries(PREMIUM_PICTURE_BOOK_SCENES).map(([id, scene]) => ({
  id,
  ...scene,
}));

export function getPremiumPictureBookScene(scene = "abenteuer") {
  return PREMIUM_PICTURE_BOOK_SCENES[scene] || PREMIUM_PICTURE_BOOK_SCENES.abenteuer;
}
