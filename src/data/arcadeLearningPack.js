import {
  DEUTSCH_ARCADE_ARTICLE_ITEMS,
  DEUTSCH_ARCADE_READING_ROUTE_ITEMS,
  DEUTSCH_ARCADE_SENTENCE_ITEMS,
  DEUTSCH_ARCADE_SENTENCE_SLOT_ITEMS,
  DEUTSCH_ARCADE_VOCABULARY_ITEMS,
  DEUTSCH_ARCADE_WORD_CLASS_ITEMS,
} from "./deutschArcadeFundus.js";

const optionSet = (answer, options) => [...new Set([answer, ...options].map((value) => String(value)))].slice(0, 4);

const collection = (id, label, icon, color, items) => ({ id, label, icon, color, items });

const item = ({ prompt, answer, options, support, example, imageCue, scene, challenge }) => ({
  prompt,
  answer: String(answer),
  options: optionSet(answer, options),
  support,
  example,
  imageCue,
  scene,
  challenge,
});

const buildDeutschPack = () => [
  collection("arcade-lesefahrten-xl", "Lesefahrten", "🚕", "bg-yellow-500", DEUTSCH_ARCADE_READING_ROUTE_ITEMS),
  collection("arcade-satzluecken-taxi-xl", "Satz-Lücken", "🧩", "bg-indigo-500", DEUTSCH_ARCADE_SENTENCE_SLOT_ITEMS),
  collection("arcade-wortarten-fundus-xl", "Wortarten-Fundus", "🏃", "bg-orange-500", DEUTSCH_ARCADE_WORD_CLASS_ITEMS),
  collection("arcade-satzfundus-xl", "Satzfundus", "🌉", "bg-rose-500", DEUTSCH_ARCADE_SENTENCE_ITEMS),
  collection("arcade-artikel-fundus-xl", "Artikel-Fundus", "🌊", "bg-cyan-500", DEUTSCH_ARCADE_ARTICLE_ITEMS),
  collection("arcade-wortschatz-fundus-xl", "Wortschatz-Fundus", "🧺", "bg-emerald-500", DEUTSCH_ARCADE_VOCABULARY_ITEMS),
];

const buildMathePack = () => {
  const quickMathItems = Array.from({ length: 220 }, (_, index) => {
    const a = 4 + (index % 18);
    const b = 2 + ((index * 3) % 9);
    const type = index % 4;
    const answer = type === 0 ? a + b : type === 1 ? a - b : type === 2 ? a * b : a * 10 + b;
    const prompt =
      type === 0
        ? `${a} + ${b}: Welches Tor stimmt?`
        : type === 1
          ? `${a} - ${b}: Welches Tor stimmt?`
          : type === 2
            ? `${a} Reihen mit ${b}: Wie viele?`
            : `${a} Zehner und ${b} Einer ergeben?`;
    return item({
      prompt,
      answer,
      options: [answer + 1, answer - 1, answer + b, Math.max(0, answer - b), answer + 10],
      support: type === 3 ? "Zehner stehen links, Einer rechts." : "Rechne in einem klaren Schritt.",
      example: type === 2 ? `${a} x ${b}` : "Zahlenlauf",
      imageCue: "Zahlentor",
      scene: "Mathe-Arcade",
      challenge: "number-speed-xl",
    });
  });

  const patternItems = Array.from({ length: 180 }, (_, index) => {
    const start = 2 + (index % 9);
    const step = 2 + (index % 6);
    const answer = start + step * 4;
    return item({
      prompt: `Welche Zahl setzt die Reihe fort: ${start}, ${start + step}, ${start + step * 2}, ${start + step * 3}, __?`,
      answer,
      options: [answer - step, answer + step, answer + 1, answer - 1, start + step * 5],
      support: `Die Reihe springt immer um ${step}.`,
      example: "Muster erkennen",
      imageCue: "Zahlenspur",
      scene: "Musterlauf",
      challenge: "pattern-run-xl",
    });
  });

  return [
    collection("arcade-rechenblitz-xl", "Rechenblitz XL", "⚡", "bg-sky-500", quickMathItems),
    collection("arcade-musterlauf-xl", "Musterlauf XL", "〰️", "bg-violet-500", patternItems),
  ];
};

const animals = [
  ["Igel", "Laubhaufen", "Stacheln schützen ihn.", "Wald und Garten"],
  ["Fisch", "Wasser", "Flossen helfen beim Schwimmen.", "Teich"],
  ["Biene", "Blüte", "Sie sammelt Nektar.", "Wiese"],
  ["Kamel", "Wüste", "Es kommt mit Trockenheit gut zurecht.", "trockene Gegend"],
  ["Schnecke", "feuchte Blätter", "Ihr Haus schützt den weichen Körper.", "Garten"],
  ["Eule", "Nacht", "Sie sieht und hört sehr gut.", "Wald"],
];

const weather = [
  ["Gewitter", "drinnen bleiben", "Draußen unter Bäumen ist es gefährlich."],
  ["starker Regen", "Regenjacke", "Kleidung kann vor Nässe schützen."],
  ["Sonne", "Schatten und Wasser", "Der Körper braucht Schutz und Trinken."],
  ["Schnee", "warme Kleidung", "Kälte braucht Schutz."],
  ["Wind", "leichte Dinge sichern", "Wind kann Dinge wegtragen."],
  ["Nebel", "langsam und aufmerksam gehen", "Man sieht weniger weit."],
];

const buildWorldPack = () => {
  const habitatItems = Array.from({ length: 180 }, (_, index) => {
    const [animal, answer, support, scene] = animals[index % animals.length];
    return item({
      prompt: `Wo passt ${animal} besonders gut hin?`,
      answer,
      options: animals.map((entry) => entry[1]).concat(["laute Straße", "trockenes Regal"]),
      support,
      example: scene,
      imageCue: `${animal} im Lebensraum`,
      scene: "Lebensraum-Arcade",
      challenge: "habitat-run-xl",
    });
  });

  const weatherItems = Array.from({ length: 160 }, (_, index) => {
    const [name, answer, support] = weather[index % weather.length];
    return item({
      prompt: `Was ist bei ${name} ein guter Schritt?`,
      answer,
      options: weather.map((entry) => entry[1]).concat(["alles anfassen", "Spuren zerstören"]),
      support,
      example: "Wetterentscheidung",
      imageCue: `${name} am Himmel`,
      scene: "Wetter-Arcade",
      challenge: "weather-decision-xl",
    });
  });

  return [
    collection("arcade-lebensraum-xl", "Lebensraum XL", "🌍", "bg-emerald-500", habitatItems),
    collection("arcade-wetterlauf-xl", "Wetterlauf XL", "🌦️", "bg-sky-500", weatherItems),
  ];
};

const heartMoves = [
  ["Jemand sagt Nein.", "Grenze achten", "Ein Nein darf ernst genommen werden."],
  ["Ein Kind weint leise.", "fragen, ob Hilfe gewünscht ist", "Trost braucht Ruhe und Erlaubnis."],
  ["Du bist sehr wütend.", "Abstand nehmen und atmen", "Gefühle dürfen da sein, Handlungen sollen sicher bleiben."],
  ["Zwei wollen denselben Baustein.", "abwechseln oder planen", "Fair ist, wenn beide gesehen werden."],
  ["Ein Geheimnis fühlt sich schwer an.", "mit sicherer erwachsener Person sprechen", "Schwere Geheimnisse muss man nicht allein tragen."],
  ["Du brauchst Pause.", "Pause nehmen und Bescheid sagen", "Pausen helfen dem Körper und dem Kopf."],
];

const buildEthikPack = () => {
  const situationItems = Array.from({ length: 210 }, (_, index) => {
    const [prompt, answer, support] = heartMoves[index % heartMoves.length];
    return item({
      prompt: `Was hilft: ${prompt}`,
      answer,
      options: heartMoves.map((entry) => entry[1]).concat(["drängen", "auslachen"]),
      support,
      example: "klar, freundlich, sicher",
      imageCue: "ruhige Szene",
      scene: "Herz-Arcade",
      challenge: "safe-step-xl",
    });
  });

  const sentenceItems = Array.from({ length: 160 }, (_, index) => {
    const entries = [
      ["Wenn ich Stopp sage, brauche ich", "dass du aufhörst."],
      ["Wenn ich traurig bin, hilft mir", "ruhig gefragt zu werden."],
      ["Wenn ich einen Fehler mache, darf ich", "es neu versuchen."],
      ["Wenn mir etwas unheimlich ist, darf ich", "Hilfe holen."],
      ["Wenn ich wütend bin, kann ich", "Abstand nehmen."],
      ["Wenn wir streiten, können wir", "später reparieren."],
    ];
    const [start, answer] = entries[index % entries.length];
    return item({
      prompt: `Welches Ende passt: ${start} ...`,
      answer,
      options: entries.map((entry) => entry[1]).concat(["alles allein machen.", "nie wieder reden."]),
      support: "Der Satz soll schützen und verbinden.",
      example: start,
      imageCue: "Satzkarte",
      scene: "Miteinander-Sätze",
      challenge: "heart-sentence-xl",
    });
  });

  return [
    collection("arcade-gute-schritte-xl", "Gute Schritte XL", "🫶", "bg-pink-500", situationItems),
    collection("arcade-herzsaetze-xl", "Herzsätze XL", "💬", "bg-indigo-500", sentenceItems),
  ];
};

const instruments = [
  ["Geige", "Streicher", "Saiten schwingen mit dem Bogen.", "gestrichen"],
  ["Trompete", "Blechbläser", "Luft schwingt im Mundstück.", "strahlend"],
  ["Trommel", "Schlagwerk", "Fell wird angeschlagen.", "pulsierend"],
  ["Klavier", "Tasteninstrument", "Tasten bewegen Hämmer.", "klar"],
  ["Flöte", "Holzbläser", "Luftkante erzeugt den Ton.", "weich"],
  ["Gitarre", "Zupfinstrument", "Saiten werden gezupft.", "warm"],
];

const buildMusikPack = () => {
  const instrumentItems = Array.from({ length: 190 }, (_, index) => {
    const [name, answer, support, timbre] = instruments[index % instruments.length];
    return item({
      prompt: `${name}: Welche Familie passt?`,
      answer,
      options: instruments.map((entry) => entry[1]).concat(["Wetter", "Zahlen"]),
      support,
      example: `Klang: ${timbre}`,
      imageCue: `${name} auf Bühne`,
      scene: "Klang-Arcade",
      challenge: "instrument-family-xl",
    });
  });

  const rhythmItems = Array.from({ length: 170 }, (_, index) => {
    const patterns = [
      ["ta ta pause ta", "AA-Ruhe-A"],
      ["ta ti-ti ta ti-ti", "ABAB"],
      ["klatsch stampf klatsch stampf", "ABAB"],
      ["leise leise laut", "AAB"],
      ["hoch tief hoch tief", "ABAB"],
      ["lang kurz kurz", "ABB"],
    ];
    const [pattern, answer] = patterns[index % patterns.length];
    return item({
      prompt: `Welches Muster passt: ${pattern}?`,
      answer,
      options: patterns.map((entry) => entry[1]).concat(["AAAA", "ABC"]),
      support: "Gleiche Klänge bekommen denselben Buchstaben.",
      example: pattern,
      imageCue: "Rhythmusband",
      scene: "Rhythmus-Arcade",
      challenge: "rhythm-pattern-xl",
    });
  });

  return [
    collection("arcade-instrumente-xl", "Instrumente XL", "🎼", "bg-fuchsia-500", instrumentItems),
    collection("arcade-rhythmus-xl", "Rhythmus XL", "🥁", "bg-amber-500", rhythmItems),
  ];
};

export const ARCADE_LEARNING_PACK = {
  deutsch: buildDeutschPack(),
  mathe: buildMathePack(),
  sachunterricht: buildWorldPack(),
  ethik: buildEthikPack(),
  musik: buildMusikPack(),
};

export const getArcadeLearningPack = (subject) => ARCADE_LEARNING_PACK[subject] || [];
