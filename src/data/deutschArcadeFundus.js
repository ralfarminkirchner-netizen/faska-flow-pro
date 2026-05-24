import { WORD_BANK } from "./learningContent.js";

const WORD_KIND_OPTIONS = ["Artikel", "Nomen", "Verb", "Adjektiv", "Präposition"];
const ARTICLE_OPTIONS = ["Der", "Die", "Das", "Ein", "Eine"];

const pick = (items, index, size = 4, step = 1) =>
  Array.from({ length: size }, (_, offset) => items[(index + offset * step) % items.length]);

const optionSet = (answer, pool, index = 0, size = 4) => {
  const answerText = String(answer);
  return [...new Set([answerText, ...pick(pool, index, size + 5, 2).map(String)])].slice(0, size);
};

const wordKindSupport = {
  Artikel: "Artikel begleiten ein Nomen: der, die, das, ein oder eine.",
  Nomen: "Nomen benennen Menschen, Tiere, Dinge, Orte oder Gefühle.",
  Verb: "Verben zeigen, was jemand tut oder was geschieht.",
  Adjektiv: "Adjektive beschreiben, wie etwas ist.",
  Präposition: "Präpositionen zeigen Orte, Richtungen oder Verbindungen.",
};

const agents = [
  ["Der", "neugierige", "Forscher"],
  ["Die", "ruhige", "Malerin"],
  ["Das", "mutige", "Kind"],
  ["Der", "freundliche", "Gärtner"],
  ["Die", "kluge", "Erfinderin"],
  ["Das", "helle", "Mädchen"],
  ["Der", "schnelle", "Pilot"],
  ["Die", "wache", "Schülerin"],
  ["Das", "starke", "Team"],
  ["Der", "achtsame", "Arzt"],
  ["Die", "fröhliche", "Musikerin"],
  ["Das", "leise", "Eichhörnchen"],
  ["Der", "vorsichtige", "Fuchs"],
  ["Die", "emsige", "Biene"],
  ["Das", "kleine", "Pony"],
  ["Der", "mutige", "Pinguin"],
  ["Die", "sanfte", "Hüterin"],
  ["Das", "geschickte", "Kind"],
  ["Der", "geduldige", "Bäcker"],
  ["Die", "aufmerksame", "Forscherin"],
  ["Das", "neugierige", "Känguru"],
  ["Der", "leise", "Seefahrer"],
  ["Die", "starke", "Tänzerin"],
  ["Das", "freundliche", "Murmeltier"],
  ["Der", "klare", "Sänger"],
  ["Die", "mutige", "Pilotin"],
  ["Das", "wache", "Reh"],
  ["Der", "sorgsame", "Koch"],
  ["Die", "helle", "Gärtnerin"],
  ["Das", "bunte", "Chamäleon"],
  ["Der", "ruhige", "Roboter"],
  ["Die", "geschickte", "Baumeisterin"],
  ["Das", "achtsame", "Kind"],
  ["Der", "schnelle", "Hase"],
  ["Die", "neugierige", "Eule"],
  ["Das", "stille", "Reh"],
];

const verbs = [
  "sammelt",
  "findet",
  "betrachtet",
  "sortiert",
  "zeichnet",
  "baut",
  "öffnet",
  "entdeckt",
  "vergleicht",
  "zählt",
  "trägt",
  "teilt",
  "hört",
  "schützt",
  "repariert",
  "begleitet",
  "untersucht",
  "verbindet",
  "erklärt",
  "ordnet",
  "pflanzt",
  "misst",
  "notiert",
  "spiegelt",
  "bewegt",
  "malt",
  "liest",
  "öffnet",
  "lauscht",
  "formt",
];

const places = [
  ["an", "dem Bach"],
  ["in", "dem Garten"],
  ["unter", "der Brücke"],
  ["neben", "dem Fenster"],
  ["auf", "der Wiese"],
  ["hinter", "dem Hügel"],
  ["vor", "der Schule"],
  ["zwischen", "den Steinen"],
  ["über", "dem Wasser"],
  ["bei", "der Laterne"],
  ["in", "der Werkstatt"],
  ["auf", "dem Markt"],
  ["neben", "der Höhle"],
  ["unter", "dem Apfelbaum"],
  ["in", "dem Atelier"],
  ["vor", "dem Gewächshaus"],
  ["an", "der Küste"],
  ["in", "dem Leseraum"],
  ["auf", "dem Dach"],
  ["bei", "der Feuerstelle"],
  ["in", "der Bibliothek"],
  ["neben", "dem Brunnen"],
  ["an", "dem Waldrand"],
  ["unter", "dem Sternenzelt"],
];

const objects = [
  ["glatte", "Steine"],
  ["runde", "Perlen"],
  ["helle", "Sterne"],
  ["bunte", "Karten"],
  ["kleine", "Muscheln"],
  ["weiche", "Federn"],
  ["goldene", "Blätter"],
  ["stille", "Töne"],
  ["leichte", "Zweige"],
  ["alte", "Schlüssel"],
  ["klare", "Spuren"],
  ["warme", "Farben"],
  ["lange", "Fäden"],
  ["sichere", "Zeichen"],
  ["freundliche", "Worte"],
  ["feine", "Muster"],
  ["leuchtende", "Lichter"],
  ["stabile", "Brücken"],
  ["duftende", "Kräuter"],
  ["blaue", "Bänder"],
  ["neue", "Fragen"],
  ["ruhige", "Gedanken"],
  ["mutige", "Ideen"],
  ["ordentliche", "Reihen"],
  ["frische", "Samen"],
  ["klangvolle", "Silben"],
  ["präzise", "Linien"],
  ["weiche", "Kissen"],
  ["grüne", "Halme"],
  ["spannende", "Bücher"],
];

const sentenceTopics = [
  "Natur",
  "Werkstatt",
  "Forschen",
  "Kunst",
  "Musik",
  "Garten",
  "Miteinander",
  "Entdecken",
  "Lesen",
  "Bauen",
  "Wasser",
  "Himmel",
];

const makeSentenceEntry = (index) => {
  const [article, adjective, noun] = agents[index % agents.length];
  const verb = verbs[(index * 5 + 3) % verbs.length];
  const [preposition, placeNoun] = places[(index * 7 + 2) % places.length];
  const [objectAdjective, objectNoun] = objects[(index * 11 + 4) % objects.length];
  const sentence = `${article} ${adjective} ${noun} ${verb} ${preposition} ${placeNoun} ${objectAdjective} ${objectNoun}.`;
  const opening = `${article} ${adjective} ${noun}`;
  const ending = `${verb} ${preposition} ${placeNoun} ${objectAdjective} ${objectNoun}.`;

  return {
    id: `fundus-satz-${index}`,
    sentence,
    opening,
    ending,
    topic: sentenceTopics[index % sentenceTopics.length],
    words: [
      [article, "Artikel"],
      [adjective, "Adjektiv"],
      [noun, "Nomen"],
      [verb, "Verb"],
      [preposition, "Präposition"],
      [placeNoun.split(" ").at(-1), "Nomen"],
      [objectAdjective, "Adjektiv"],
      [objectNoun, "Nomen"],
    ],
  };
};

export const DEUTSCH_ARCADE_SENTENCE_BANK = Array.from({ length: 288 }, (_, index) => makeSentenceEntry(index));

export const DEUTSCH_ARCADE_WORD_CLASS_ITEMS = DEUTSCH_ARCADE_SENTENCE_BANK.flatMap((entry, sentenceIndex) =>
  entry.words.map(([word, answer], wordIndex) => ({
    id: `fundus-wortart-${sentenceIndex}-${wordIndex}`,
    prompt: `"${word}": Welche Wortart ist das?`,
    answer,
    options: WORD_KIND_OPTIONS,
    support: entry.sentence,
    example: `${entry.topic} · ${wordKindSupport[answer]}`,
    imageCue: "Wortarten-Sprung",
    scene: "Wortarten-Fundus",
    challenge: "word-class-fundus-xl",
  }))
);

export const DEUTSCH_ARCADE_SENTENCE_ITEMS = Array.from({ length: 420 }, (_, index) => {
  const entry = DEUTSCH_ARCADE_SENTENCE_BANK[index % DEUTSCH_ARCADE_SENTENCE_BANK.length];
  const endings = DEUTSCH_ARCADE_SENTENCE_BANK.map((sentence) => sentence.ending);

  return {
    id: `fundus-satzlauf-${index}`,
    prompt: `Was passt weiter: ${entry.opening} ...`,
    answer: entry.ending,
    options: optionSet(entry.ending, endings, index, 4),
    support: entry.sentence,
    example: entry.topic,
    imageCue: "Satz-Tor",
    scene: "Satzlauf-Fundus",
    challenge: "sentence-meaning-fundus-xl",
  };
});

export const DEUTSCH_ARCADE_SENTENCE_SLOT_ITEMS = Array.from({ length: 260 }, (_, index) => {
  const [article, adjective, noun] = agents[index % agents.length];
  const verb = verbs[(index * 7 + 4) % verbs.length];
  const [objectAdjective, objectNoun] = objects[(index * 9 + 6) % objects.length];
  const answerPool = pick(verbs, index + 3, 10, 3);
  const sentence = `${article} ${adjective} ${noun} ${verb} ${objectAdjective} ${objectNoun}.`;

  return {
    id: `fundus-satzluecke-${index}`,
    prompt: `Fahre das Wort in die Lücke: ${article} ${adjective} ${noun} ___ ${objectAdjective} ${objectNoun}.`,
    answer: verb,
    options: optionSet(verb, answerPool, index, 4),
    support: sentence,
    example: "Verb im Satz",
    imageCue: "Satz-Lücke",
    scene: "Satz-Taxi",
    challenge: "sentence-slot-taxi-xl",
    taxiCargo: verb,
  };
});

const routePlaces = [
  ["Brücke", "die Brücke führt über Wasser", "🌉"],
  ["Garten", "im Garten wachsen Pflanzen", "🌿"],
  ["Schule", "in der Schule lernen Kinder", "🏫"],
  ["Insel", "eine Insel liegt im Wasser", "🏝️"],
  ["Baum", "der Baum hat Stamm und Blätter", "🌳"],
  ["Haus", "im Haus wohnen Menschen", "🏠"],
  ["Bach", "ein Bach ist kleines fließendes Wasser", "💧"],
  ["Wiese", "auf der Wiese wächst Gras", "🌱"],
  ["Mond", "der Mond steht am Nachthimmel", "🌙"],
  ["Sonne", "die Sonne leuchtet am Himmel", "☀️"],
  ["Stern", "ein Stern leuchtet in der Nacht", "⭐"],
  ["Fenster", "durch das Fenster schaut man hinaus", "🪟"],
  ["Tisch", "am Tisch kann man arbeiten", "🪑"],
  ["Buch", "in einem Buch stehen Wörter", "📖"],
  ["Laterne", "eine Laterne macht Licht", "🏮"],
  ["Boot", "ein Boot fährt auf Wasser", "⛵"],
  ["Zug", "ein Zug fährt auf Schienen", "🚂"],
  ["Fahrrad", "ein Fahrrad hat zwei Räder", "🚲"],
  ["Trommel", "die Trommel macht Rhythmus", "🥁"],
  ["Glocke", "eine Glocke klingt hell", "🔔"],
];

export const DEUTSCH_ARCADE_READING_ROUTE_ITEMS = Array.from({ length: 220 }, (_, index) => {
  const [place, clue, icon] = routePlaces[index % routePlaces.length];

  return {
    id: `fundus-lesefahrt-${index}`,
    prompt: `Lies das Ziel und fahre dorthin: ${place}`,
    answer: place,
    options: optionSet(place, routePlaces.map(([name]) => name), index, 4),
    support: clue,
    example: `${icon} ${place}`,
    imageCue: "Lesefahrt Klasse 1",
    scene: "Lesefahrt",
    challenge: "reading-route-taxi-xl",
    taxiCargo: place,
  };
});

export const DEUTSCH_ARCADE_ARTICLE_ITEMS = WORD_BANK.flatMap((word, index) => {
  const [preposition, placeNoun] = places[(index * 3 + 1) % places.length];
  const articlePool = optionSet(word.article, ARTICLE_OPTIONS, index, 4);
  return [
    {
      id: `fundus-artikel-${word.id}-tor`,
      prompt: `Welcher Artikel passt zu ${word.icon} ${word.word}?`,
      answer: word.article,
      options: articlePool,
      support: `${word.article} ${word.word}`,
      example: word.parts.join(" - "),
      imageCue: "Artikel-Tor",
      scene: "Artikel-Fundus",
      challenge: "article-fundus-xl",
    },
    {
      id: `fundus-artikel-${word.id}-satz`,
      prompt: `___ ${word.word} liegt ${preposition} ${placeNoun}.`,
      answer: word.article,
      options: articlePool,
      support: `${word.article} ${word.word} liegt ${preposition} ${placeNoun}.`,
      example: word.category,
      imageCue: "Satz mit Lücke",
      scene: "Artikel-im-Satz",
      challenge: "article-context-fundus-xl",
    },
  ];
});

export const DEUTSCH_ARCADE_VOCABULARY_ITEMS = WORD_BANK.flatMap((word, index) => [
  {
    id: `fundus-regal-${word.id}`,
    prompt: `In welches Wort-Regal gehört ${word.icon} ${word.word}?`,
    answer: word.category,
    options: optionSet(word.category, WORD_BANK.map((entry) => entry.category), index, 4),
    support: `${word.word} gehört zu ${word.category}.`,
    example: `${word.syllables} Silben`,
    imageCue: "Wortschatz-Regal",
    scene: "Wortschatz-Fundus",
    challenge: "vocabulary-category-fundus-xl",
  },
  {
    id: `fundus-anlaut-${word.id}`,
    prompt: `Mit welchem Laut beginnt ${word.icon} ${word.word}?`,
    answer: word.first,
    options: optionSet(word.first, WORD_BANK.map((entry) => entry.first), index + 5, 4),
    support: `Sprich langsam: ${word.word}.`,
    example: word.parts.join(" - "),
    imageCue: "Anlaut-Bahn",
    scene: "Laut-Fundus",
    challenge: "sound-fundus-xl",
  },
]);
