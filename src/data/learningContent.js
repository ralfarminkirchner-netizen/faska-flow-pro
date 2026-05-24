const cls = {
  artikel: "Artikel",
  nomen: "Nomen",
  verb: "Verb",
  adjektiv: "Adjektiv",
  praeposition: "Präposition",
};

const CORE_WORD_BANK = [
  { id: "apfel", word: "Apfel", article: "Der", icon: "🍎", syllables: 2, parts: ["AP", "FEL"], category: "Obst", color: "text-red-500", first: "A", sound: "aaa" },
  { id: "banane", word: "Banane", article: "Die", icon: "🍌", syllables: 3, parts: ["BA", "NA", "NE"], category: "Obst", color: "text-yellow-600", first: "B", sound: "bbb" },
  { id: "birne", word: "Birne", article: "Die", icon: "🍐", syllables: 2, parts: ["BIR", "NE"], category: "Obst", color: "text-lime-600", first: "B", sound: "bbb" },
  { id: "erdbeere", word: "Erdbeere", article: "Die", icon: "🍓", syllables: 3, parts: ["ERD", "BEE", "RE"], category: "Obst", color: "text-rose-500", first: "E", sound: "eee" },
  { id: "tomate", word: "Tomate", article: "Die", icon: "🍅", syllables: 3, parts: ["TO", "MA", "TE"], category: "Gemüse", color: "text-red-500", first: "T", sound: "ttt" },
  { id: "karotte", word: "Karotte", article: "Die", icon: "🥕", syllables: 3, parts: ["KA", "ROT", "TE"], category: "Gemüse", color: "text-orange-500", first: "K", sound: "kkk" },
  { id: "gurke", word: "Gurke", article: "Die", icon: "🥒", syllables: 2, parts: ["GUR", "KE"], category: "Gemüse", color: "text-emerald-600", first: "G", sound: "ggg" },
  { id: "kartoffel", word: "Kartoffel", article: "Die", icon: "🥔", syllables: 3, parts: ["KAR", "TOF", "FEL"], category: "Gemüse", color: "text-amber-700", first: "K", sound: "kkk" },
  { id: "blume", word: "Blume", article: "Die", icon: "🌸", syllables: 2, parts: ["BLU", "ME"], category: "Natur", color: "text-pink-500", first: "B", sound: "bbb" },
  { id: "baum", word: "Baum", article: "Der", icon: "🌳", syllables: 1, parts: ["BAUM"], category: "Natur", color: "text-emerald-700", first: "B", sound: "bbb" },
  { id: "blatt", word: "Blatt", article: "Das", icon: "🍃", syllables: 1, parts: ["BLATT"], category: "Natur", color: "text-green-600", first: "B", sound: "bbb" },
  { id: "pilz", word: "Pilz", article: "Der", icon: "🍄", syllables: 1, parts: ["PILZ"], category: "Natur", color: "text-red-600", first: "P", sound: "ppp" },
  { id: "sonne", word: "Sonne", article: "Die", icon: "☀️", syllables: 2, parts: ["SON", "NE"], category: "Himmel", color: "text-amber-500", first: "S", sound: "sss" },
  { id: "mond", word: "Mond", article: "Der", icon: "🌙", syllables: 1, parts: ["MOND"], category: "Himmel", color: "text-slate-600", first: "M", sound: "mmm" },
  { id: "stern", word: "Stern", article: "Der", icon: "⭐", syllables: 1, parts: ["STERN"], category: "Himmel", color: "text-yellow-500", first: "S", sound: "sss" },
  { id: "wolke", word: "Wolke", article: "Die", icon: "☁️", syllables: 2, parts: ["WOL", "KE"], category: "Himmel", color: "text-sky-500", first: "W", sound: "www" },
  { id: "regenbogen", word: "Regenbogen", article: "Der", icon: "🌈", syllables: 4, parts: ["RE", "GEN", "BO", "GEN"], category: "Himmel", color: "text-fuchsia-500", first: "R", sound: "rrr" },
  { id: "haus", word: "Haus", article: "Das", icon: "🏠", syllables: 1, parts: ["HAUS"], category: "Zuhause", color: "text-sky-600", first: "H", sound: "hhh" },
  { id: "tisch", word: "Tisch", article: "Der", icon: "🪑", syllables: 1, parts: ["TISCH"], category: "Zuhause", color: "text-amber-700", first: "T", sound: "ttt" },
  { id: "tasse", word: "Tasse", article: "Die", icon: "☕", syllables: 2, parts: ["TAS", "SE"], category: "Zuhause", color: "text-stone-600", first: "T", sound: "ttt" },
  { id: "bett", word: "Bett", article: "Das", icon: "🛏️", syllables: 1, parts: ["BETT"], category: "Zuhause", color: "text-indigo-500", first: "B", sound: "bbb" },
  { id: "buch", word: "Buch", article: "Das", icon: "📖", syllables: 1, parts: ["BUCH"], category: "Lernen", color: "text-indigo-600", first: "B", sound: "bbb" },
  { id: "stift", word: "Stift", article: "Der", icon: "✏️", syllables: 1, parts: ["STIFT"], category: "Lernen", color: "text-yellow-700", first: "S", sound: "sss" },
  { id: "schere", word: "Schere", article: "Die", icon: "✂️", syllables: 2, parts: ["SCHE", "RE"], category: "Lernen", color: "text-slate-600", first: "SCH", sound: "sch" },
  { id: "pinsel", word: "Pinsel", article: "Der", icon: "🖌️", syllables: 2, parts: ["PIN", "SEL"], category: "Lernen", color: "text-purple-600", first: "P", sound: "ppp" },
  { id: "auto", word: "Auto", article: "Das", icon: "🚗", syllables: 2, parts: ["AU", "TO"], category: "Fahrzeuge", color: "text-red-500", first: "A", sound: "aaa" },
  { id: "zug", word: "Zug", article: "Der", icon: "🚂", syllables: 1, parts: ["ZUG"], category: "Fahrzeuge", color: "text-slate-700", first: "Z", sound: "zzz" },
  { id: "fahrrad", word: "Fahrrad", article: "Das", icon: "🚲", syllables: 2, parts: ["FAHR", "RAD"], category: "Fahrzeuge", color: "text-emerald-600", first: "F", sound: "fff" },
  { id: "boot", word: "Boot", article: "Das", icon: "⛵", syllables: 1, parts: ["BOOT"], category: "Fahrzeuge", color: "text-sky-600", first: "B", sound: "bbb" },
  { id: "maus", word: "Maus", article: "Die", icon: "🐭", syllables: 1, parts: ["MAUS"], category: "Tiere", color: "text-stone-500", first: "M", sound: "mmm" },
  { id: "katze", word: "Katze", article: "Die", icon: "🐱", syllables: 2, parts: ["KAT", "ZE"], category: "Tiere", color: "text-orange-500", first: "K", sound: "kkk" },
  { id: "hund", word: "Hund", article: "Der", icon: "🐶", syllables: 1, parts: ["HUND"], category: "Tiere", color: "text-amber-700", first: "H", sound: "hhh" },
  { id: "hase", word: "Hase", article: "Der", icon: "🐇", syllables: 2, parts: ["HA", "SE"], category: "Tiere", color: "text-stone-600", first: "H", sound: "hhh" },
  { id: "vogel", word: "Vogel", article: "Der", icon: "🐦", syllables: 2, parts: ["VO", "GEL"], category: "Tiere", color: "text-sky-600", first: "V", sound: "vvv" },
  { id: "fisch", word: "Fisch", article: "Der", icon: "🐟", syllables: 1, parts: ["FISCH"], category: "Tiere", color: "text-blue-600", first: "F", sound: "fff" },
  { id: "frosch", word: "Frosch", article: "Der", icon: "🐸", syllables: 1, parts: ["FROSCH"], category: "Tiere", color: "text-green-600", first: "F", sound: "fff" },
  { id: "ente", word: "Ente", article: "Die", icon: "🦆", syllables: 2, parts: ["EN", "TE"], category: "Tiere", color: "text-emerald-600", first: "E", sound: "eee" },
  { id: "igel", word: "Igel", article: "Der", icon: "🦔", syllables: 2, parts: ["I", "GEL"], category: "Tiere", color: "text-stone-700", first: "I", sound: "iii" },
  { id: "loewe", word: "Löwe", article: "Der", icon: "🦁", syllables: 2, parts: ["LÖ", "WE"], category: "Tiere", color: "text-orange-600", first: "L", sound: "lll" },
  { id: "elefant", word: "Elefant", article: "Der", icon: "🐘", syllables: 3, parts: ["E", "LE", "FANT"], category: "Tiere", color: "text-slate-600", first: "E", sound: "eee" },
  { id: "schmetterling", word: "Schmetterling", article: "Der", icon: "🦋", syllables: 4, parts: ["SCHMET", "TER", "LING"], category: "Tiere", color: "text-violet-600", first: "SCH", sound: "sch" },
  { id: "biene", word: "Biene", article: "Die", icon: "🐝", syllables: 2, parts: ["BIE", "NE"], category: "Tiere", color: "text-yellow-700", first: "B", sound: "bbb" },
  { id: "ameise", word: "Ameise", article: "Die", icon: "🐜", syllables: 3, parts: ["A", "MEI", "SE"], category: "Tiere", color: "text-rose-700", first: "A", sound: "aaa" },
  { id: "muschel", word: "Muschel", article: "Die", icon: "🐚", syllables: 2, parts: ["MU", "SCHEL"], category: "Natur", color: "text-pink-400", first: "M", sound: "mmm" },
  { id: "stein", word: "Stein", article: "Der", icon: "🪨", syllables: 1, parts: ["STEIN"], category: "Natur", color: "text-slate-500", first: "S", sound: "sss" },
  { id: "insel", word: "Insel", article: "Die", icon: "🏝️", syllables: 2, parts: ["IN", "SEL"], category: "Natur", color: "text-teal-600", first: "I", sound: "iii" },
  { id: "bruecke", word: "Brücke", article: "Die", icon: "🌉", syllables: 2, parts: ["BRÜ", "CKE"], category: "Orte", color: "text-indigo-500", first: "B", sound: "bbb" },
  { id: "garten", word: "Garten", article: "Der", icon: "🌿", syllables: 2, parts: ["GAR", "TEN"], category: "Orte", color: "text-green-700", first: "G", sound: "ggg" },
  { id: "schule", word: "Schule", article: "Die", icon: "🏫", syllables: 2, parts: ["SCHU", "LE"], category: "Orte", color: "text-sky-700", first: "SCH", sound: "sch" },
  { id: "laterne", word: "Laterne", article: "Die", icon: "🏮", syllables: 3, parts: ["LA", "TER", "NE"], category: "Dinge", color: "text-red-500", first: "L", sound: "lll" },
  { id: "trommel", word: "Trommel", article: "Die", icon: "🥁", syllables: 2, parts: ["TROM", "MEL"], category: "Musik", color: "text-rose-600", first: "T", sound: "ttt" },
  { id: "glocke", word: "Glocke", article: "Die", icon: "🔔", syllables: 2, parts: ["GLO", "CKE"], category: "Musik", color: "text-amber-500", first: "G", sound: "ggg" },
  { id: "floete", word: "Flöte", article: "Die", icon: "🪈", syllables: 2, parts: ["FLÖ", "TE"], category: "Musik", color: "text-teal-600", first: "F", sound: "fff" },
  { id: "gitarre", word: "Gitarre", article: "Die", icon: "🎸", syllables: 3, parts: ["GI", "TAR", "RE"], category: "Musik", color: "text-orange-600", first: "G", sound: "ggg" },
  { id: "klavier", word: "Klavier", article: "Das", icon: "🎹", syllables: 2, parts: ["KLA", "VIER"], category: "Musik", color: "text-indigo-600", first: "K", sound: "kkk" },
  { id: "geige", word: "Geige", article: "Die", icon: "🎻", syllables: 2, parts: ["GEI", "GE"], category: "Musik", color: "text-red-600", first: "G", sound: "ggg" },
];

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const firstSound = (word) => {
  const upper = word.toUpperCase();
  if (upper.startsWith("SCH")) return "SCH";
  if (upper.startsWith("ST")) return "ST";
  if (upper.startsWith("SP")) return "SP";
  return upper[0] || "A";
};

const soundFor = (first) => (first === "SCH" ? "sch" : `${first.toLowerCase()}${first.toLowerCase()}${first.toLowerCase()}`);

const compoundPrefixes = [
  "Wald",
  "Garten",
  "Sonnen",
  "Mond",
  "Regen",
  "Wasser",
  "Berg",
  "Wiesen",
  "Blumen",
  "Stern",
  "Klang",
  "Bücher",
  "Farben",
  "Muschel",
  "Stein",
  "Forscher",
  "Kinder",
  "Schatz",
  "Winter",
  "Sommer",
  "Herbst",
  "Frühlings",
  "Wind",
  "Insel",
  "Meer",
  "Wolken",
  "Wunder",
  "Perlen",
  "Traum",
  "Morgen",
  "Abend",
  "Feuer",
];

const compoundHeads = [
  ["Der", "Weg", "Orte", "🛤️", "text-stone-600"],
  ["Die", "Brücke", "Orte", "🌉", "text-indigo-500"],
  ["Das", "Haus", "Zuhause", "🏠", "text-sky-600"],
  ["Der", "Turm", "Orte", "🗼", "text-slate-600"],
  ["Die", "Höhle", "Orte", "🕳️", "text-stone-700"],
  ["Der", "Hafen", "Orte", "⚓", "text-blue-700"],
  ["Die", "Insel", "Natur", "🏝️", "text-teal-600"],
  ["Das", "Ufer", "Natur", "🌊", "text-sky-500"],
  ["Der", "Bach", "Natur", "💧", "text-cyan-600"],
  ["Die", "Quelle", "Natur", "💦", "text-cyan-500"],
  ["Der", "Stein", "Natur", "🪨", "text-slate-500"],
  ["Das", "Blatt", "Natur", "🍃", "text-green-600"],
  ["Die", "Blüte", "Natur", "🌸", "text-pink-500"],
  ["Der", "Samen", "Natur", "🌰", "text-amber-700"],
  ["Das", "Nest", "Tiere", "🪹", "text-lime-700"],
  ["Der", "Vogel", "Tiere", "🐦", "text-sky-600"],
  ["Die", "Biene", "Tiere", "🐝", "text-yellow-700"],
  ["Der", "Falter", "Tiere", "🦋", "text-violet-600"],
  ["Das", "Reh", "Tiere", "🦌", "text-amber-700"],
  ["Der", "Fuchs", "Tiere", "🦊", "text-orange-600"],
  ["Die", "Eule", "Tiere", "🦉", "text-stone-700"],
  ["Der", "Pinguin", "Tiere", "🐧", "text-slate-700"],
  ["Das", "Boot", "Fahrzeuge", "⛵", "text-sky-600"],
  ["Der", "Zug", "Fahrzeuge", "🚂", "text-slate-700"],
  ["Das", "Rad", "Fahrzeuge", "🚲", "text-emerald-600"],
  ["Der", "Kompass", "Dinge", "🧭", "text-rose-500"],
  ["Die", "Karte", "Lernen", "🗺️", "text-emerald-700"],
  ["Das", "Buch", "Lernen", "📖", "text-indigo-600"],
  ["Der", "Stift", "Lernen", "✏️", "text-yellow-700"],
  ["Die", "Tafel", "Lernen", "🧮", "text-slate-600"],
  ["Das", "Lineal", "Lernen", "📏", "text-amber-700"],
  ["Der", "Pinsel", "Lernen", "🖌️", "text-purple-600"],
  ["Die", "Farbe", "Dinge", "🎨", "text-fuchsia-600"],
  ["Das", "Muster", "Lernen", "🔷", "text-blue-600"],
  ["Der", "Kreis", "Lernen", "⭕", "text-rose-500"],
  ["Die", "Linie", "Lernen", "➖", "text-slate-600"],
  ["Das", "Zeichen", "Lernen", "✴️", "text-amber-500"],
  ["Der", "Schlüssel", "Dinge", "🔑", "text-yellow-700"],
  ["Die", "Laterne", "Dinge", "🏮", "text-red-500"],
  ["Das", "Fenster", "Zuhause", "🪟", "text-sky-600"],
  ["Der", "Tisch", "Zuhause", "🪑", "text-amber-700"],
  ["Die", "Tasse", "Zuhause", "☕", "text-stone-600"],
  ["Das", "Kissen", "Zuhause", "🛏️", "text-indigo-500"],
  ["Der", "Korb", "Dinge", "🧺", "text-amber-800"],
  ["Die", "Schale", "Dinge", "🥣", "text-slate-600"],
  ["Das", "Glas", "Dinge", "🥛", "text-cyan-600"],
  ["Der", "Löffel", "Dinge", "🥄", "text-slate-500"],
  ["Die", "Glocke", "Musik", "🔔", "text-amber-500"],
  ["Die", "Trommel", "Musik", "🥁", "text-rose-600"],
  ["Die", "Flöte", "Musik", "🪈", "text-teal-600"],
  ["Die", "Geige", "Musik", "🎻", "text-red-600"],
  ["Das", "Klavier", "Musik", "🎹", "text-indigo-600"],
  ["Der", "Rhythmus", "Musik", "🎵", "text-violet-600"],
  ["Der", "Ton", "Musik", "🎶", "text-purple-600"],
  ["Die", "Melodie", "Musik", "🎼", "text-violet-700"],
  ["Die", "Sonne", "Himmel", "☀️", "text-amber-500"],
  ["Der", "Mond", "Himmel", "🌙", "text-slate-600"],
  ["Der", "Stern", "Himmel", "⭐", "text-yellow-500"],
  ["Die", "Wolke", "Himmel", "☁️", "text-sky-500"],
  ["Der", "Regenbogen", "Himmel", "🌈", "text-fuchsia-500"],
  ["Der", "Wind", "Himmel", "🌬️", "text-sky-600"],
  ["Der", "Schnee", "Himmel", "❄️", "text-cyan-500"],
  ["Der", "Funke", "Dinge", "✨", "text-amber-500"],
  ["Die", "Idee", "Lernen", "💡", "text-yellow-600"],
  ["Die", "Frage", "Lernen", "❓", "text-blue-600"],
  ["Die", "Antwort", "Lernen", "✅", "text-emerald-600"],
  ["Das", "Rätsel", "Lernen", "🧩", "text-violet-600"],
  ["Die", "Geschichte", "Lernen", "📚", "text-indigo-600"],
  ["Das", "Abenteuer", "Orte", "🧭", "text-orange-600"],
  ["Die", "Spur", "Natur", "👣", "text-stone-600"],
  ["Das", "Herz", "Gefühle", "💛", "text-amber-500"],
  ["Der", "Mut", "Gefühle", "🦁", "text-orange-600"],
  ["Die", "Freude", "Gefühle", "😊", "text-emerald-600"],
  ["Die", "Ruhe", "Gefühle", "🫧", "text-sky-500"],
  ["Die", "Grenze", "Gefühle", "✋", "text-rose-500"],
  ["Die", "Hilfe", "Miteinander", "🤝", "text-teal-600"],
  ["Der", "Plan", "Miteinander", "🗒️", "text-slate-600"],
  ["Das", "Team", "Miteinander", "👥", "text-indigo-600"],
];

const GENERATED_WORD_BANK = compoundPrefixes.flatMap((prefix, prefixIndex) =>
  compoundHeads.map(([article, head, category, icon, color], headIndex) => {
    const word = `${prefix}${head}`;
    const first = firstSound(word);
    return {
      id: `fundus-${slugify(prefix)}-${slugify(head)}-${prefixIndex}-${headIndex}`,
      word,
      article,
      icon,
      syllables: 2 + ((prefixIndex + headIndex) % 3),
      parts: [prefix.toUpperCase(), head.toUpperCase()],
      category,
      color,
      first,
      sound: soundFor(first),
    };
  })
);

export const WORD_BANK = [...CORE_WORD_BANK, ...GENERATED_WORD_BANK];

const pick = (items, index, size = 4) => Array.from({ length: size }, (_, offset) => items[(index + offset) % items.length]);
const optionTexts = (answer, pool, index, size = 4) => [...new Set([answer, ...pick(pool, index, size + 2)])].slice(0, size);

export const LAB_DICTIONARY = Object.fromEntries(
  WORD_BANK.map((entry) => [entry.parts.join(""), entry.icon])
);

export const LAB_SYLLABLES = [...new Set(WORD_BANK.flatMap((entry) => entry.parts))];

const articleOptions = ["Der", "Die", "Das"];

const wordClass = (satz, loesung) => ({
  satz,
  loesung,
  wortarten: [...new Set(Object.values(loesung))],
});

const grammarAgents = [
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
  ["Der", "geduldige", "Bäcker"],
  ["Die", "aufmerksame", "Forscherin"],
  ["Das", "geschickte", "Känguru"],
  ["Der", "klare", "Sänger"],
  ["Die", "sorgsame", "Köchin"],
  ["Das", "stille", "Reh"],
  ["Der", "helle", "Seefahrer"],
  ["Die", "mutige", "Pilotin"],
  ["Das", "bunte", "Chamäleon"],
];

const grammarVerbs = [
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
  "lauscht",
  "formt",
  "prüft",
];

const grammarPlaces = [
  ["an", "dem", "Bach"],
  ["in", "dem", "Garten"],
  ["unter", "der", "Brücke"],
  ["neben", "dem", "Fenster"],
  ["auf", "der", "Wiese"],
  ["hinter", "dem", "Hügel"],
  ["vor", "der", "Schule"],
  ["zwischen", "den", "Steinen"],
  ["über", "dem", "Wasser"],
  ["bei", "der", "Laterne"],
  ["in", "der", "Werkstatt"],
  ["auf", "dem", "Markt"],
  ["neben", "der", "Höhle"],
  ["unter", "dem", "Apfelbaum"],
  ["in", "dem", "Atelier"],
  ["vor", "dem", "Gewächshaus"],
  ["an", "der", "Küste"],
  ["in", "dem", "Leseraum"],
  ["auf", "dem", "Dach"],
  ["bei", "der", "Feuerstelle"],
  ["in", "der", "Bibliothek"],
  ["neben", "dem", "Brunnen"],
  ["an", "dem", "Waldrand"],
  ["unter", "dem", "Sternenzelt"],
];

const grammarObjects = [
  ["glatte", "Steine"],
  ["runde", "Perlen"],
  ["leuchtende", "Sterne"],
  ["farbige", "Karten"],
  ["schimmernde", "Muscheln"],
  ["weiche", "Federn"],
  ["goldene", "Blätter"],
  ["zarte", "Töne"],
  ["leichte", "Zweige"],
  ["geheime", "Schlüssel"],
  ["sichtbare", "Spuren"],
  ["warme", "Farben"],
  ["lange", "Fäden"],
  ["sichere", "Zeichen"],
  ["liebevolle", "Worte"],
  ["feine", "Muster"],
  ["stabile", "Brücken"],
  ["duftende", "Kräuter"],
  ["blaue", "Bänder"],
  ["neue", "Fragen"],
  ["sortierte", "Gedanken"],
  ["eigene", "Ideen"],
  ["ordentliche", "Reihen"],
  ["frische", "Samen"],
  ["klangvolle", "Silben"],
  ["präzise", "Linien"],
  ["grüne", "Halme"],
  ["spannende", "Bücher"],
  ["sorgfältige", "Notizen"],
  ["funkelnde", "Lichter"],
];

const buildGrammarSentence = (index) => {
  const [article, adjective, noun] = grammarAgents[index % grammarAgents.length];
  const verb = grammarVerbs[(index * 5 + 3) % grammarVerbs.length];
  const [preposition, placeArticle, placeNoun] = grammarPlaces[(index * 7 + 2) % grammarPlaces.length];
  const [objectAdjective, objectNoun] = grammarObjects[(index * 11 + 4) % grammarObjects.length];
  const satz = [article, adjective, noun, verb, preposition, placeArticle, placeNoun, objectAdjective, objectNoun];
  const loesung = {
    [article]: cls.artikel,
    [adjective]: cls.adjektiv,
    [noun]: cls.nomen,
    [verb]: cls.verb,
    [preposition]: cls.praeposition,
    [placeArticle]: cls.artikel,
    [placeNoun]: cls.nomen,
    [objectAdjective]: cls.adjektiv,
    [objectNoun]: cls.nomen,
  };
  return { satz, loesung };
};

const buildWordClassExercises = (count) =>
  Array.from({ length: count }, (_, index) => {
    const { satz, loesung } = buildGrammarSentence(index);
    return wordClass(satz, loesung);
  });

const scrambleSentenceWords = (words, index) => {
  const scrambled = [...words].sort((a, b) => ((a.length * 17 + index * 11) % 97) - ((b.length * 19 + index * 7) % 97));
  return scrambled.join(" ") === words.join(" ") ? scrambled.reverse() : scrambled;
};

const buildSentenceExercises = (count) =>
  Array.from({ length: count }, (_, index) => {
    const { satz } = buildGrammarSentence(index + 80);
    return {
      worte: scrambleSentenceWords(satz, index),
      loesung: satz.join(" "),
    };
  });

const letterRound = (entry, index) => ({
  letter: entry.first,
  sound: entry.sound,
  answer: entry.id,
  options: pick(WORD_BANK, index, 4).some((item) => item.id === entry.id)
    ? pick(WORD_BANK, index, 4).map(({ id, icon, word }) => ({ id, icon, word }))
    : [entry, ...pick(WORD_BANK, index, 3)].map(({ id, icon, word }) => ({ id, icon, word })),
});

export const DEUTSCH_CONTENT = {
  articleWords: WORD_BANK.map(({ word, article, color }) => ({ wort: word, artikel: article, color })),
  syllableWords: WORD_BANK.map(({ word, syllables }) => ({ wort: word, silben: syllables })),
  memoryPairs: WORD_BANK.map(({ id, word, icon }) => ({ id, word, icon })),
  letterRounds: [
    WORD_BANK.find((w) => w.id === "maus"),
    WORD_BANK.find((w) => w.id === "baum"),
    WORD_BANK.find((w) => w.id === "stern"),
    WORD_BANK.find((w) => w.id === "loewe"),
    WORD_BANK.find((w) => w.id === "apfel"),
    WORD_BANK.find((w) => w.id === "fisch"),
    WORD_BANK.find((w) => w.id === "glocke"),
    WORD_BANK.find((w) => w.id === "trommel"),
    WORD_BANK.find((w) => w.id === "igel"),
    WORD_BANK.find((w) => w.id === "schmetterling"),
    WORD_BANK.find((w) => w.id === "wolke"),
    WORD_BANK.find((w) => w.id === "karotte"),
  ].map(letterRound),
  wordClassExercises: buildWordClassExercises(360),
  sentenceExercises: buildSentenceExercises(420),
  rhymePairs: [
    { a: "Maus", b: "Haus", color: "bg-fuchsia-100" },
    { a: "Hund", b: "Mund", color: "bg-sky-100" },
    { a: "Kuchen", b: "Suchen", color: "bg-amber-100" },
    { a: "Sonne", b: "Tonne", color: "bg-emerald-100" },
    { a: "Katze", b: "Tatze", color: "bg-rose-100" },
    { a: "Fisch", b: "Tisch", color: "bg-blue-100" },
    { a: "Baum", b: "Traum", color: "bg-lime-100" },
    { a: "Biene", b: "Schiene", color: "bg-yellow-100" },
    { a: "Hase", b: "Nase", color: "bg-orange-100" },
    { a: "Stein", b: "Bein", color: "bg-slate-100" },
    { a: "Boot", b: "Rot", color: "bg-cyan-100" },
    { a: "Schule", b: "Mühle", color: "bg-indigo-100" },
  ],
  antonymPairs: [
    { a: "Groß", b: "Klein" }, { a: "Hell", b: "Dunkel" }, { a: "Schnell", b: "Langsam" }, { a: "Heiß", b: "Kalt" },
    { a: "Leise", b: "Laut" }, { a: "Voll", b: "Leer" }, { a: "Nass", b: "Trocken" }, { a: "Weich", b: "Hart" },
    { a: "Oben", b: "Unten" }, { a: "Innen", b: "Außen" }, { a: "Nah", b: "Fern" }, { a: "Früh", b: "Spät" },
    { a: "Mutig", b: "Ängstlich" }, { a: "Rund", b: "Eckig" }, { a: "Warm", b: "Kühl" }, { a: "Lang", b: "Kurz" },
  ],
  stories: [
    {
      title: "Der kleine Samen",
      cards: [{ icon: "🌰", text: "Ein Samen liegt weich in der Erde." }, { icon: "💧", text: "Regen klopft leise auf den Garten." }],
      answer: "sprout",
      options: [{ id: "sprout", icon: "🌱", text: "Ein grüner Keim schaut heraus." }, { id: "moon", icon: "🌙", text: "Der Mond macht das Licht aus." }, { id: "stone", icon: "🪨", text: "Ein Stein rollt in den Weg." }],
      ending: "So beginnt Wachstum: erst klein, dann mutig.",
    },
    {
      title: "Das verlorene Band",
      cards: [{ icon: "🎀", text: "Mira findet ein rotes Band." }, { icon: "👀", text: "Sie schaut, wem es gehören könnte." }],
      answer: "ask",
      options: [{ id: "hide", icon: "🤐", text: "Sie steckt es heimlich ein." }, { id: "ask", icon: "🙋", text: "Sie fragt freundlich in die Runde." }, { id: "throw", icon: "🗑️", text: "Sie wirft es einfach weg." }],
      ending: "Fragen kann ein kleines Problem ganz leicht machen.",
    },
    {
      title: "Der nasse Pinsel",
      cards: [{ icon: "🎨", text: "Auf dem Tisch liegt ein nasser Pinsel." }, { icon: "📄", text: "Das Papier wartet noch ganz weiß." }],
      answer: "paint",
      options: [{ id: "sleep", icon: "💤", text: "Der Pinsel macht ein Schläfchen." }, { id: "paint", icon: "🌈", text: "Ein bunter Bogen wächst auf dem Blatt." }, { id: "run", icon: "👟", text: "Die Schuhe laufen alleine los." }],
      ending: "Eine Geschichte wird klar, wenn der nächste Schritt passt.",
    },
    {
      title: "Die mutige Flöte",
      cards: [{ icon: "🪈", text: "Noa möchte vorspielen, aber sein Bauch kribbelt." }, { icon: "🌬️", text: "Er atmet langsam ein und aus." }],
      answer: "play",
      options: [{ id: "play", icon: "🎶", text: "Ein sanfter Ton füllt den Raum." }, { id: "hide", icon: "🫣", text: "Er versteckt die Flöte im Schrank." }, { id: "spill", icon: "🪣", text: "Ein Eimer kippt um." }],
      ending: "Mut ist da, wenn man etwas mit klopfendem Herzen versucht.",
    },
    {
      title: "Der kleine Streit",
      cards: [{ icon: "🧱", text: "Zwei Kinder wollen denselben Baustein." }, { icon: "😕", text: "Beide merken: So macht Spielen keinen Spaß." }],
      answer: "share",
      options: [{ id: "shout", icon: "📣", text: "Sie schreien noch lauter." }, { id: "share", icon: "🤝", text: "Sie bauen abwechselnd weiter." }, { id: "leave", icon: "🚪", text: "Alle Steine werden weggeräumt." }],
      ending: "Abwechseln kann aus Streit wieder Spiel machen.",
    },
    {
      title: "Die Regenpause",
      cards: [{ icon: "🌧️", text: "Draußen regnet es stark." }, { icon: "🪟", text: "Lina schaut aus dem Fenster." }],
      answer: "inside",
      options: [{ id: "inside", icon: "📚", text: "Sie baut drinnen eine Bücherhöhle." }, { id: "snow", icon: "⛄", text: "Sie baut einen Schneemann." }, { id: "sun", icon: "🏖️", text: "Sie legt sich an den Strand." }],
      ending: "Auch graue Tage können gute Ideen bringen.",
    },
  ],
};

export const MATHE_CONTENT = {
  numberRiverRounds: [
    { title: "In Einer-Schritten", river: [2, 3, 4, null, 6], answer: 5, options: [5, 7, 1, 9] },
    { title: "In Zweier-Schritten", river: [10, 12, null, 16, 18], answer: 14, options: [11, 13, 14, 20] },
    { title: "In Fünfer-Schritten", river: [5, 10, 15, null, 25], answer: 20, options: [18, 20, 22, 30] },
    { title: "In Zehner-Schritten", river: [40, 50, 60, null, 80], answer: 70, options: [65, 70, 75, 90] },
    { title: "Rückwärts wandern", river: [30, 25, 20, null, 10], answer: 15, options: [5, 12, 15, 18] },
    { title: "Hunderter-Leiter", river: [100, 200, null, 400, 500], answer: 300, options: [250, 300, 350, 600] },
    { title: "Verdoppeln", river: [3, 6, 12, null, 48], answer: 24, options: [18, 20, 24, 36] },
    { title: "Halbieren", river: [64, 32, null, 8, 4], answer: 16, options: [12, 14, 16, 18] },
    { title: "Plus sieben", river: [7, 14, 21, null, 35], answer: 28, options: [24, 27, 28, 32] },
    { title: "Rückwärts Zehner", river: [90, 80, null, 60, 50], answer: 70, options: [65, 70, 75, 85] },
  ],
};

export const WORLD_CONTENT = {
  terrainTypes: [
    { id: "gras", color: "#86efac", name: "Wiese", icon: "🌱" },
    { id: "wasser", color: "#7dd3fc", name: "Wasser", icon: "💧" },
    { id: "sand", color: "#fde047", name: "Wüste", icon: "☀️" },
    { id: "eis", color: "#e2e8f0", name: "Eis", icon: "❄️" },
    { id: "wald", color: "#4ade80", name: "Wald", icon: "🌲" },
    { id: "fels", color: "#cbd5e1", name: "Felsen", icon: "🪨" },
  ],
  sandboxAnimals: [
    { id: "frog", name: "Frosch", habitat: "wasser", emoji: "🐸" },
    { id: "camel", name: "Kamel", habitat: "sand", emoji: "🐪" },
    { id: "penguin", name: "Pinguin", habitat: "eis", emoji: "🐧" },
    { id: "deer", name: "Reh", habitat: "wald", emoji: "🦌" },
    { id: "snake", name: "Schlange", habitat: "sand", emoji: "🐍" },
    { id: "fish", name: "Fisch", habitat: "wasser", emoji: "🐟" },
    { id: "polarbear", name: "Eisbär", habitat: "eis", emoji: "🐻‍❄️" },
    { id: "rabbit", name: "Hase", habitat: "gras", emoji: "🐇" },
    { id: "fox", name: "Fuchs", habitat: "wald", emoji: "🦊" },
    { id: "goat", name: "Steinbock", habitat: "fels", emoji: "🐐" },
  ],
  foodChainItems: [
    { id: "gras", type: "plant", emoji: "🌿", name: "Pflanze" },
    { id: "hase", type: "herbivore", emoji: "🐇", name: "Pflanzenfresser" },
    { id: "fuchs", type: "carnivore", emoji: "🦊", name: "Fleischfresser" },
  ],
  lifeCycles: [
    { id: "frog", name: "Frosch", stages: [{ id: "c1", emoji: "🥚", stage: 1, name: "Laich" }, { id: "c2", emoji: "🐟", stage: 2, name: "Kaulquappe" }, { id: "c3", emoji: "🦎", stage: 3, name: "Frosch mit Schwanz" }, { id: "c4", emoji: "🐸", stage: 4, name: "Erwachsener Frosch" }] },
  ],
};

export const WORLD_WEATHER_ROUNDS = [
  { sky: "🌧️", title: "Regentag", clue: "Viele Tropfen fallen vom Himmel.", answer: "schirm", options: [{ id: "schirm", icon: "☂️", label: "Regenschirm" }, { id: "sonnenhut", icon: "👒", label: "Sonnenhut" }, { id: "schlitten", icon: "🛷", label: "Schlitten" }] },
  { sky: "☀️", title: "Sonnentag", clue: "Es ist hell und warm.", answer: "wasser", options: [{ id: "schal", icon: "🧣", label: "Schal" }, { id: "wasser", icon: "💧", label: "Trinken" }, { id: "stiefel", icon: "🥾", label: "Matschstiefel" }] },
  { sky: "❄️", title: "Schneetag", clue: "Der Boden ist weiß und kalt.", answer: "handschuhe", options: [{ id: "handschuhe", icon: "🧤", label: "Handschuhe" }, { id: "sandale", icon: "🩴", label: "Sandalen" }, { id: "feder", icon: "🪶", label: "Feder" }] },
  { sky: "🌬️", title: "Windtag", clue: "Blätter tanzen durch die Luft.", answer: "drachen", options: [{ id: "drachen", icon: "🪁", label: "Drachen" }, { id: "eis", icon: "🍦", label: "Eis" }, { id: "lampe", icon: "💡", label: "Lampe" }] },
  { sky: "🌫️", title: "Nebelmorgen", clue: "Die Welt sieht weich und verschwommen aus.", answer: "langsam", options: [{ id: "langsam", icon: "👣", label: "Langsam gehen" }, { id: "rennen", icon: "🏃", label: "Rennen" }, { id: "tauchen", icon: "🤿", label: "Tauchen" }] },
  { sky: "⛈️", title: "Gewitter", clue: "Es donnert und blitzt.", answer: "drinnen", options: [{ id: "drinnen", icon: "🏠", label: "Drinnen bleiben" }, { id: "baum", icon: "🌳", label: "Unter den Baum" }, { id: "bad", icon: "🏊", label: "Baden gehen" }] },
  { sky: "🥶", title: "Frostmorgen", clue: "Die Luft ist eisig und die Finger werden kalt.", answer: "schal", options: [{ id: "sonne", icon: "🕶️", label: "Sonnenbrille" }, { id: "schal", icon: "🧣", label: "Schal" }, { id: "sandale", icon: "🩴", label: "Sandalen" }] },
  { sky: "🌡️", title: "Hitzetag", clue: "Es ist sehr warm und der Körper braucht Schutz.", answer: "schatten", options: [{ id: "schatten", icon: "🌳", label: "Schatten suchen" }, { id: "handschuhe", icon: "🧤", label: "Handschuhe" }, { id: "heizung", icon: "🔥", label: "Heizung" }] },
];

export const WORLD_SEASON_CARDS = [
  { id: "nest", icon: "🐣", title: "Junge Vögel im Nest", answer: "fruehling" },
  { id: "badesee", icon: "🏊", title: "Warmer Tag am See", answer: "sommer" },
  { id: "laub", icon: "🍁", title: "Bunte Blätter fallen", answer: "herbst" },
  { id: "schnee", icon: "⛄", title: "Schneemann im Garten", answer: "winter" },
  { id: "erdbeeren", icon: "🍓", title: "Rote Erdbeeren", answer: "sommer" },
  { id: "knospe", icon: "🌱", title: "Eine Knospe öffnet sich", answer: "fruehling" },
  { id: "kastanie", icon: "🌰", title: "Kastanien liegen auf dem Weg", answer: "herbst" },
  { id: "eiszapfen", icon: "🧊", title: "Eiszapfen hängen am Dach", answer: "winter" },
  { id: "schmetterling", icon: "🦋", title: "Schmetterlinge flattern über Blumen", answer: "fruehling" },
  { id: "sonnenhut", icon: "👒", title: "Ein Sonnenhut schützt den Kopf", answer: "sommer" },
];

export const WORLD_TRACK_CASES = [
  { title: "Leise Spuren im Schnee", trail: ["●", "●", "●", "●"], clue: "Vier kleine Pfoten stehen dicht beieinander.", answer: "hase", options: [{ id: "hase", name: "Hase", icon: "🐇", place: "Wiese und Feld" }, { id: "ente", name: "Ente", icon: "🦆", place: "Teich" }, { id: "igel", name: "Igel", icon: "🦔", place: "Laubhaufen" }] },
  { title: "Ein Abdruck am Teich", trail: ["⌵", "⌵", "⌵"], clue: "Die Spur sieht aus wie ein kleiner Fächer.", answer: "ente", options: [{ id: "fuchs", name: "Fuchs", icon: "🦊", place: "Waldrand" }, { id: "ente", name: "Ente", icon: "🦆", place: "Teich" }, { id: "maus", name: "Maus", icon: "🐁", place: "Wiese" }] },
  { title: "Zarte Punkte am Kornfeld", trail: ["·", "·", "·", "·", "·"], clue: "Sehr kleine Schritte laufen schnell zum Gras.", answer: "maus", options: [{ id: "maus", name: "Maus", icon: "🐁", place: "Wiese" }, { id: "hase", name: "Hase", icon: "🐇", place: "Feld" }, { id: "ente", name: "Ente", icon: "🦆", place: "Wasser" }] },
  { title: "Schmale Linie am Waldrand", trail: ["ᘛ", "ᘛ", "ᘛ"], clue: "Die Spur wirkt weich und schleicht in Kurven.", answer: "fuchs", options: [{ id: "fuchs", name: "Fuchs", icon: "🦊", place: "Waldrand" }, { id: "ente", name: "Ente", icon: "🦆", place: "Teich" }, { id: "frosch", name: "Frosch", icon: "🐸", place: "Ufer" }] },
  { title: "Stachelige Spur im Laub", trail: ["✹", "·", "✹", "·"], clue: "Zwischen Blättern sieht man kleine tapsige Abdrücke.", answer: "igel", options: [{ id: "igel", name: "Igel", icon: "🦔", place: "Laubhaufen" }, { id: "hase", name: "Hase", icon: "🐇", place: "Feld" }, { id: "reh", name: "Reh", icon: "🦌", place: "Wald" }] },
  { title: "Zwei Hufe im weichen Boden", trail: ["⌒⌒", "⌒⌒", "⌒⌒"], clue: "Die Spur ist größer und paarig.", answer: "reh", options: [{ id: "reh", name: "Reh", icon: "🦌", place: "Wald" }, { id: "maus", name: "Maus", icon: "🐁", place: "Wiese" }, { id: "ente", name: "Ente", icon: "🦆", place: "Teich" }] },
];

const mathChallenges = [
  ...MATHE_CONTENT.numberRiverRounds.map((round) => ({
    prompt: `${round.title}: Welche Zahl fehlt in ${round.river.map((n) => n ?? "?").join(" - ")}?`,
    answer: String(round.answer),
    options: round.options.map(String),
    support: "Zähle die Abstände zwischen den Zahlen.",
  })),
  ...Array.from({ length: 18 }, (_, i) => {
    const a = (i % 9) + 2;
    const b = Math.floor(i / 3) + 2;
    return {
      prompt: `${a} × ${b}: Wie viele Perlen sind es zusammen?`,
      answer: String(a * b),
      options: optionTexts(String(a * b), [String(a + b), String(a * b + a), String(a * b - b), String(a * b + 2)], i),
      support: `${a} Reihen mit je ${b} Perlen.`,
    };
  }),
  ...Array.from({ length: 16 }, (_, i) => {
    const value = (i + 3) * 7;
    return {
      prompt: `Welche Zerlegung passt zu ${value}?`,
      answer: `${Math.floor(value / 10) * 10} + ${value % 10}`,
      options: [`${Math.floor(value / 10) * 10} + ${value % 10}`, `${value - 5} + 4`, `${value + 10} - 1`, `${value - 2} + 1`],
      support: "Zehner und Einer dürfen getrennt werden.",
    };
  }),
];

const worldWeather = [
  ["Regentag", "☂️", "Regenschirm"], ["Sonnentag", "💧", "Trinken"], ["Schneetag", "🧤", "Handschuhe"],
  ["Windtag", "🪁", "Drachen"], ["Nebelmorgen", "🔦", "Langsam schauen"], ["Gewitter", "🏠", "Drinnen bleiben"],
  ["Frost", "🧣", "Schal"], ["Hitze", "🧢", "Schatten suchen"],
];

const emotionChoices = [
  ["Jemand sagt Nein zu einer Umarmung.", "Abstand lassen", "Weiter umarmen", "Auslachen", "Ziehen"],
  ["Ein Kind weint leise in der Ecke.", "Sanft fragen", "Auslachen", "Ignorieren", "Befehlen"],
  ["Du bist wütend und dein Körper ist heiß.", "Atmen und Abstand nehmen", "Schubsen", "Schreien ins Gesicht", "Wegnehmen"],
  ["Ein Freund hat gewonnen.", "Gratulieren", "Schimpfen", "Betrügen", "Verstecken"],
  ["Du brauchst Ruhe.", "Eine Pause sagen", "Alles runterschlucken", "Andere stören", "Laut werden"],
  ["Jemand nimmt dein Bild.", "Klar sagen: Das gehört mir", "Hauen", "Zerreißen", "Gar nichts fühlen müssen"],
  ["Du hast einen Fehler gemacht.", "Neu versuchen", "Aufgeben für immer", "Lügen", "Andere beschuldigen"],
  ["Ein Kind ist neu in der Gruppe.", "Einladen", "Wegschicken", "Tuscheln", "Anstarren"],
  ["Jemand möchte dein Geheimnis weitererzählen.", "Stopp sagen", "Mitmachen", "Drohen", "Alles erlauben"],
  ["Du merkst: Dein Körper will nicht gekitzelt werden.", "Nein sagen", "Stillhalten", "Lachen müssen", "Weglaufen ohne Hilfe"],
  ["Zwei Kinder streiten um ein Spiel.", "Abwechseln vorschlagen", "Alles nehmen", "Schreien", "Verstecken"],
  ["Du siehst, dass jemand ausgeschlossen wird.", "Dazuholen", "Mitlachen", "Wegschauen", "Befehlen"],
  ["Du bist traurig und willst nicht reden.", "Das ruhig sagen", "Andere verletzen", "Dich schämen", "Alles wegdrücken"],
  ["Ein Freund entschuldigt sich.", "Zuhören", "Sofort bestrafen", "Auslachen", "So tun als wäre nichts"],
  ["Du brauchst Hilfe bei einer Aufgabe.", "Um Hilfe bitten", "Schummeln", "Auf den Tisch hauen", "Andere stören"],
  ["Jemand ist anders als du.", "Neugierig und freundlich sein", "Auslachen", "Wegschicken", "Nachmachen"],
  ["Du spürst Angst vor etwas Neuem.", "Kleine Schritte machen", "Dich zwingen", "Andere beschuldigen", "Alles vermeiden für immer"],
  ["Ein Kind sagt etwas Gemeines.", "Grenze setzen", "Gemeiner zurück sein", "Hauen", "Alle auslachen"],
];

const feelingQuestions = [
  { prompt: "Dein Bauch kribbelt vor dem Vorspielen. Welches Wort passt?", answer: "Nervosität", options: ["Nervosität", "Langeweile", "Hunger", "Kälte"], support: "Freude und ein bisschen Angst können zusammen da sein." },
  { prompt: "Du willst etwas schaffen, obwohl es schwer ist.", answer: "Mut", options: ["Mut", "Ekel", "Schlaf", "Durst"], support: "Mut heißt nicht: keine Angst." },
  { prompt: "Alles war heute zu viel und du brauchst Pause.", answer: "Erschöpfung", options: ["Erschöpfung", "Begeisterung", "Neid", "Übermut"], support: "Der Körper bittet um Ruhe." },
  { prompt: "Du freust dich riesig und möchtest es teilen.", answer: "Begeisterung", options: ["Begeisterung", "Abscheu", "Schreck", "Stillstand"], support: "Ein großes helles Wow-Gefühl." },
  { prompt: "Du denkst lange über etwas Trauriges nach.", answer: "Nachdenklichkeit", options: ["Nachdenklichkeit", "Eile", "Hunger", "Kitzel"], support: "Der Kopf hilft dem Herzen beim Sortieren." },
  { prompt: "Etwas klappt nicht und du willst es trotzdem weiter versuchen.", answer: "Ehrgeiz", options: ["Ehrgeiz", "Müdigkeit", "Ekel", "Schweigen"], support: "Wut kann manchmal Kraft zum Üben geben." },
  { prompt: "Du vermisst jemanden und erinnerst dich an Schönes.", answer: "Nostalgie", options: ["Nostalgie", "Lärm", "Durst", "Tempo"], support: "Schön und traurig können zusammen sein." },
  { prompt: "Etwas kam plötzlich und du brauchst kurz Zeit.", answer: "Erschrecken", options: ["Erschrecken", "Sattsein", "Gewicht", "Farbe"], support: "Ein Schreck darf erst einmal abklingen." },
  { prompt: "Du möchtest etwas nicht anfassen, weil dein Bauch Nein sagt.", answer: "Abneigung", options: ["Abneigung", "Begeisterung", "Ruhe", "Stolz"], support: "Dein Bauchgefühl kann eine Grenze zeigen." },
  { prompt: "Du hast etwas Neues verstanden und willst mehr wissen.", answer: "Wissensdurst", options: ["Wissensdurst", "Kummer", "Schlaf", "Eis"], support: "Fragen sind hier etwas Gutes." },
  { prompt: "Du bist traurig und sehr wütend zugleich.", answer: "Frustration", options: ["Frustration", "Euphorie", "Kälte", "Ruhe"], support: "Ein Knoten aus Nicht-klappen und Ärger." },
  { prompt: "Du bist ruhig, warm und zufrieden nach einem guten Tag.", answer: "Zufriedenheit", options: ["Zufriedenheit", "Panik", "Ekel", "Zorn"], support: "Ein weiches Ja-Gefühl im Körper." },
];

export const MUSIC_MEMORY_INSTRUMENTS = [
  { id: "trommel", icon: "🥁", word: "Trommel", freq: 130.81 },
  { id: "glocke", icon: "🔔", word: "Glocke", freq: 783.99 },
  { id: "floete", icon: "🪈", word: "Flöte", freq: 659.25 },
  { id: "gitarre", icon: "🎸", word: "Gitarre", freq: 196.0 },
  { id: "klavier", icon: "🎹", word: "Klavier", freq: 523.25 },
  { id: "geige", icon: "🎻", word: "Geige", freq: 440.0 },
  { id: "trompete", icon: "🎺", word: "Trompete", freq: 587.33 },
  { id: "xylophon", icon: "🪵", word: "Xylophon", freq: 880.0 },
  { id: "kalimba", icon: "🫧", word: "Kalimba", freq: 698.46 },
  { id: "orgel", icon: "⛪", word: "Orgel", freq: 329.63 },
  { id: "kontrabass", icon: "🎻", word: "Kontrabass", freq: 98.0 },
  { id: "chor", icon: "🎶", word: "Chor", freq: 392.0 },
];

export const MUSIC_RHYTHM_PATTERNS = [
  { title: "Herzschlag", pattern: ["stampf", "klatsch", "stampf", "klatsch"] },
  { title: "Blättertanz", pattern: ["zisch", "zisch", "klatsch", "stampf"] },
  { title: "Wanderschritt", pattern: ["stampf", "stampf", "zisch", "klatsch"] },
  { title: "Sternenregen", pattern: ["klatsch", "zisch", "klatsch", "zisch"] },
  { title: "Regentropfen", pattern: ["zisch", "klatsch", "zisch", "stampf"] },
  { title: "Elefantenschritt", pattern: ["stampf", "stampf", "stampf", "klatsch"] },
  { title: "Leiser Fuchs", pattern: ["zisch", "stampf", "zisch", "klatsch"] },
  { title: "Tanzkreis", pattern: ["klatsch", "stampf", "klatsch", "zisch"] },
  { title: "Echo-Weg", pattern: ["stampf", "klatsch", "klatsch", "stampf"] },
  { title: "Funkelpfad", pattern: ["zisch", "klatsch", "stampf", "zisch"] },
];

const musicInstruments = [
  ["Klavier", "🎹", "Tasten"], ["Glockenspiel", "🔔", "hell"], ["Flöte", "🪈", "Luft"], ["Geige", "🎻", "Bogen"],
  ["Gitarre", "🎸", "Saiten"], ["Trommel", "🥁", "Rhythmus"], ["Trompete", "🎺", "Blech"], ["Chor", "🎶", "Stimmen"],
  ["Kalimba", "🫧", "Zupfen"], ["Xylophon", "🪵", "Holz"], ["Orgel", "⛪", "lange Töne"], ["Kontrabass", "🎻", "tief"],
];

const musicTheoryQuestions = [
  { prompt: "Welches Muster passt zu Stampf, Klatsch, Stampf, Klatsch?", answer: "ABAB", options: ["ABAB", "AABB", "ABBA", "AAAA"], support: "Zwei Klänge wechseln sich ab." },
  { prompt: "Welches Muster passt zu Klatsch, Klatsch, Zisch?", answer: "AAB", options: ["AAB", "ABA", "ABC", "ABB"], support: "Die ersten zwei sind gleich." },
  { prompt: "Wie heißt Musik sehr leise?", answer: "piano", options: ["piano", "forte", "presto", "staccato"], support: "Nicht das Instrument, sondern die Lautstärke." },
  { prompt: "Wie heißt Musik laut?", answer: "forte", options: ["forte", "piano", "lento", "legato"], support: "Es klingt kräftig." },
  { prompt: "Wie heißt Musik schnell?", answer: "presto", options: ["presto", "lento", "piano", "pause"], support: "Die Musik flitzt." },
  { prompt: "Wie heißt Musik langsam?", answer: "lento", options: ["lento", "forte", "presto", "hoch"], support: "Die Musik geht gemächlich." },
  { prompt: "Was ist höher: C oder C5?", answer: "C5", options: ["C5", "C", "beide gleich", "keins"], support: "Die 5 zeigt die höhere Lage." },
  { prompt: "Was macht eine Pause?", answer: "Stille", options: ["Stille", "lauter", "schneller", "höher"], support: "Auch Stille gehört zur Musik." },
  { prompt: "Welche Spielweise klingt kurz abgehackt?", answer: "staccato", options: ["staccato", "legato", "piano", "tief"], support: "Kurze kleine Tonpunkte." },
  { prompt: "Welche Spielweise klingt verbunden?", answer: "legato", options: ["legato", "staccato", "forte", "Pause"], support: "Die Töne halten sich an den Händen." },
  { prompt: "Was ist ein Rhythmus?", answer: "ein Zeitmuster", options: ["ein Zeitmuster", "eine Farbe", "ein Tier", "ein Artikel"], support: "Rhythmus ordnet Klänge in der Zeit." },
  { prompt: "Was ist eine Melodie?", answer: "Töne nacheinander", options: ["Töne nacheinander", "nur Stille", "nur Trommeln", "ein Reim"], support: "Eine kleine Ton-Geschichte." },
  { prompt: "Welche Lage klingt tief?", answer: "Kontrabass", options: ["Kontrabass", "Glockenspiel", "Flöte", "Vogel"], support: "Große Saiten klingen oft tiefer." },
  { prompt: "Welche Klangfarbe ist hell und funkelnd?", answer: "Glockenspiel", options: ["Glockenspiel", "Kontrabass", "Trommel", "Schritte"], support: "Metall kann hell glitzern." },
];

const mathQuickMix = [
  ...Array.from({ length: 12 }, (_, index) => {
    const a = index + 3;
    const b = (index % 5) + 2;
    const answer = a + b;
    return {
      prompt: `${a} + ${b} = ?`,
      answer,
      options: [answer, answer - 1, answer + 2, Math.max(1, answer - 3)],
      support: "Lege erst die größere Zahl in den Kopf und zähle weiter.",
    };
  }),
  ...Array.from({ length: 12 }, (_, index) => {
    const answer = index + 4;
    const b = (index % 4) + 2;
    const a = answer + b;
    return {
      prompt: `${a} - ${b} = ?`,
      answer,
      options: [answer, answer + 1, Math.max(1, answer - 2), answer + 4],
      support: "Gehe in kleinen Schritten zurück.",
    };
  }),
];

const mathCompareQuestions = [
  [8, 5, ">"], [6, 9, "<"], [12, 12, "="], [14, 11, ">"], [7, 10, "<"], [20, 18, ">"],
  [15, 15, "="], [3, 6, "<"], [24, 19, ">"], [30, 40, "<"], [50, 50, "="], [42, 38, ">"],
].map(([left, right, answer]) => ({
  prompt: `${left} ${"□"} ${right}`,
  answer,
  options: [">", "<", "=", "?" ],
  support: "Das offene Feld braucht das passende Vergleichszeichen.",
}));

const worldCareQuestions = [
  { prompt: "Was hilft einer Pflanze an einem trockenen Tag?", answer: "Wasser", options: ["Wasser", "Schuh", "Lärm", "Stein"], support: "Pflanzen trinken über ihre Wurzeln." },
  { prompt: "Was braucht ein Tier, damit es sich sicher fühlt?", answer: "Schutz", options: ["Schutz", "Krach", "Hektik", "Hunger"], support: "Ein sicherer Ort hilft beim Ausruhen." },
  { prompt: "Was gehört in den Mülleimer?", answer: "Abfall", options: ["Abfall", "Blume", "Vogel", "Regen"], support: "So bleibt die Natur sauber." },
  { prompt: "Was beobachten Forschende zuerst?", answer: "genau schauen", options: ["genau schauen", "sofort raten", "alles anfassen", "wegrennen"], support: "Beobachten kommt vor dem Erklären." },
  { prompt: "Was schützt die Haut an heißen Tagen?", answer: "Schatten", options: ["Schatten", "Wolle", "Heizung", "Schnee"], support: "Schatten und Trinken helfen." },
  { prompt: "Was machen Bienen bei Blüten?", answer: "Nektar sammeln", options: ["Nektar sammeln", "Schneebälle bauen", "Steine tragen", "Möbel rücken"], support: "Dabei helfen sie auch den Pflanzen." },
  { prompt: "Was ist gut, wenn ein Tier schläft?", answer: "leise sein", options: ["leise sein", "anstupsen", "rufen", "ziehen"], support: "Ruhe ist auch Fürsorge." },
  { prompt: "Wie erkennt man Wind?", answer: "Blätter bewegen sich", options: ["Blätter bewegen sich", "Steine singen", "Wasser brennt", "Sonne fällt"], support: "Man sieht Wind oft an dem, was er bewegt." },
];

const ethicsBoundaryQuestions = [
  { prompt: "Dein Körper sagt Nein. Was ist ein klarer Satz?", answer: "Stopp, ich möchte das nicht.", options: ["Stopp, ich möchte das nicht.", "Mach ruhig weiter.", "Ich muss alles erlauben.", "Lach mich aus."], support: "Ein Nein darf kurz und freundlich sein." },
  { prompt: "Jemand möchte allein sein. Was hilft?", answer: "Raum geben", options: ["Raum geben", "drängen", "ausfragen", "festhalten"], support: "Nähe ist gut, wenn beide sie wollen." },
  { prompt: "Du hast jemandem wehgetan. Was ist ein guter Anfang?", answer: "Es tut mir leid.", options: ["Es tut mir leid.", "Selbst schuld.", "War doch lustig.", "Ich höre nicht zu."], support: "Reparieren beginnt mit Verantwortung." },
  { prompt: "Ein Streit wird sehr laut. Was kann sicherer sein?", answer: "Pause machen", options: ["Pause machen", "lauter werden", "schubsen", "drohen"], support: "Abstand kann helfen, wieder klar zu denken." },
  { prompt: "Du merkst: Ein Freund ist traurig. Was passt?", answer: "Ich bin da.", options: ["Ich bin da.", "Stell dich nicht so an.", "Pech gehabt.", "Geh weg."], support: "Trost muss nicht groß sein." },
  { prompt: "Du willst nicht über etwas reden. Was darfst du sagen?", answer: "Jetzt nicht.", options: ["Jetzt nicht.", "Ich muss alles erzählen.", "Frag noch mehr.", "Ich bin falsch."], support: "Auch Reden braucht ein gutes Tempo." },
  { prompt: "Ein Kind wird ausgelacht. Was ist mutig und sicher?", answer: "Hilfe holen", options: ["Hilfe holen", "mitlachen", "filmen", "wegschauen"], support: "Hilfe holen ist kein Petzen, wenn jemand Schutz braucht." },
  { prompt: "Du bist sehr aufgeregt. Was hilft oft zuerst?", answer: "langsam atmen", options: ["langsam atmen", "alles werfen", "rennen müssen", "dich schämen"], support: "Der Körper darf erst zur Ruhe kommen." },
];

const ethicsFeelingDepthQuestions = [
  { prompt: "Kann man traurig und dankbar zugleich sein?", answer: "Ja", options: ["Ja", "Nein", "Nur Erwachsene", "Nur im Sommer"], support: "Mehrere Gefühle können nebeneinander wohnen." },
  { prompt: "Was bedeutet Vertrauen?", answer: "Ich fühle mich sicher genug.", options: ["Ich fühle mich sicher genug.", "Ich muss alles allein machen.", "Ich darf nie Nein sagen.", "Ich gewinne immer."], support: "Vertrauen wächst langsam." },
  { prompt: "Was bedeutet Scham?", answer: "Ich möchte mich verstecken.", options: ["Ich möchte mich verstecken.", "Ich bin hungrig.", "Ich höre Musik.", "Ich zähle."], support: "Scham braucht besonders viel Freundlichkeit." },
  { prompt: "Was ist ein sicherer Trost?", answer: "Bei dir bleiben und zuhören", options: ["Bei dir bleiben und zuhören", "sofort Lösungen befehlen", "auslachen", "weggehen"], support: "Manchmal hilft Da-sein mehr als Reden." },
  { prompt: "Was heißt Wiedergutmachen?", answer: "Etwas reparieren", options: ["Etwas reparieren", "alles leugnen", "nochmal verletzen", "schneller rennen"], support: "Nach einem Fehler kann ein guter nächster Schritt kommen." },
  { prompt: "Was kann bei Angst helfen?", answer: "ein kleiner sicherer Schritt", options: ["ein kleiner sicherer Schritt", "dich zwingen", "allein bleiben müssen", "Schuld suchen"], support: "Mut darf klein anfangen." },
];

const musicSoundColorQuestions = [
  { prompt: "Welche Klangfarbe passt zu hell und glitzernd?", answer: "Glockenspiel", options: ["Glockenspiel", "Kontrabass", "Trommel", "leise Schritte"], support: "Hohe Metallklänge funkeln oft." },
  { prompt: "Welche Klangfarbe passt zu weich und schwebend?", answer: "Chor", options: ["Chor", "Snare", "Kick", "Klopfen"], support: "Viele Stimmen können wie eine Wolke klingen." },
  { prompt: "Welche Klangfarbe passt zu gezupft?", answer: "Kalimba", options: ["Kalimba", "Trompete", "Becken", "Wind"], support: "Gezupfte Zungen klingen kurz und rund." },
  { prompt: "Welche Klangfarbe passt zu tief und tragend?", answer: "Kontrabass", options: ["Kontrabass", "Flöte", "Glockenspiel", "Triangel"], support: "Große Saiten können warm brummen." },
  { prompt: "Welche Klangfarbe passt zu luftig?", answer: "Flöte", options: ["Flöte", "Trommel", "Bass", "Xylophon"], support: "Atem macht den Ton." },
  { prompt: "Welche Klangfarbe passt zu mutig und hell?", answer: "Trompete", options: ["Trompete", "Kalimba", "Chor", "Kontrabass"], support: "Blech kann strahlen." },
];

const musicTempoQuestions = [
  { prompt: "Das Lied soll wie ein Spaziergang klingen. Welches Tempo passt?", answer: "mittel", options: ["mittel", "rasend", "gar nicht", "unhörbar"], support: "Nicht zu schnell, nicht zu langsam." },
  { prompt: "Das Lied soll einschlafen helfen. Welches Tempo passt?", answer: "langsam", options: ["langsam", "presto", "hektisch", "springend"], support: "Langsam kann beruhigen." },
  { prompt: "Das Lied soll hüpfen. Welches Tempo passt?", answer: "schnell", options: ["schnell", "still", "schwer", "dunkel"], support: "Hüpfen braucht Bewegung." },
  { prompt: "Was macht eine Pause im Rhythmus?", answer: "sie lässt Platz", options: ["sie lässt Platz", "sie macht alles laut", "sie zählt rückwärts", "sie malt"], support: "Stille kann Musik ordnen." },
  { prompt: "Welche Dynamik ist sanft?", answer: "leise", options: ["leise", "fortissimo", "knallend", "hart"], support: "Sanft muss nicht verschwinden." },
  { prompt: "Welche Dynamik ist kräftig?", answer: "laut", options: ["laut", "flüsternd", "stumm", "fern"], support: "Kräftig klingt deutlich." },
];

const BASE_SUBJECT_VARIANT_CONTENT = {
  deutsch: [
    { id: "artikel", label: "Artikel-Wald", icon: "🐸", color: "bg-emerald-400", items: WORD_BANK.map((w) => ({ prompt: `Welcher Artikel passt zu ${w.icon} ${w.word}?`, answer: w.article, options: articleOptions, support: "Sprich das Wort mit jedem Artikel aus." })) },
    { id: "silben", label: "Silben-Klatschen", icon: "👏", color: "bg-amber-400", items: WORD_BANK.map((w) => ({ prompt: `Wie viele Silben hörst du in ${w.word}?`, answer: String(w.syllables), options: ["1", "2", "3", "4"], support: w.parts.join(" - ") })) },
    { id: "laute", label: "Anlaut-Wiese", icon: "🌼", color: "bg-lime-400", items: WORD_BANK.map((w, i) => ({ prompt: `Mit welchem Laut beginnt ${w.icon} ${w.word}?`, answer: w.first, options: optionTexts(w.first, ["A", "B", "F", "G", "H", "K", "M", "S", "T", "W", "SCH"], i), support: "Sprich das Wort ganz langsam." })) },
    { id: "kategorien", label: "Wortschatz-Regale", icon: "🧺", color: "bg-sky-400", items: WORD_BANK.map((w, i) => ({ prompt: `In welches Regal gehört ${w.icon} ${w.word}?`, answer: w.category, options: optionTexts(w.category, ["Obst", "Gemüse", "Natur", "Tiere", "Musik", "Fahrzeuge", "Lernen", "Himmel"], i), support: "Suche, wozu das Wort gehört." })) },
    { id: "wortbilder", label: "Wortbilder", icon: "🖼️", color: "bg-cyan-400", items: WORD_BANK.map((w, i) => ({ prompt: `Welches Bild passt zu ${w.word}?`, answer: w.icon, options: optionTexts(w.icon, WORD_BANK.map((item) => item.icon), i), support: "Lies das Wort und suche das passende Bild." })) },
    { id: "silbenbau", label: "Silbenbau", icon: "🧱", color: "bg-orange-400", items: WORD_BANK.filter((w) => w.parts.length > 1).map((w, i) => ({ prompt: `Welche Silben bauen ${w.icon} ${w.word}?`, answer: w.parts.join(" - "), options: optionTexts(w.parts.join(" - "), WORD_BANK.filter((item) => item.parts.length > 1).map((item) => item.parts.join(" - ")), i), support: "Sprich langsam und höre die Bausteine." })) },
    { id: "reime", label: "Reim-Fundus", icon: "〰️", color: "bg-rose-400", items: DEUTSCH_CONTENT.rhymePairs.map((p, i) => ({ prompt: `Was reimt sich auf ${p.a}?`, answer: p.b, options: optionTexts(p.b, DEUTSCH_CONTENT.rhymePairs.map((pair) => pair.b), i), support: "Achte auf den letzten Klang." })) },
    { id: "gegenteile", label: "Gegenteil-Kompass", icon: "🧲", color: "bg-violet-400", items: DEUTSCH_CONTENT.antonymPairs.map((p, i) => ({ prompt: `Was ist das Gegenteil von ${p.a}?`, answer: p.b, options: optionTexts(p.b, DEUTSCH_CONTENT.antonymPairs.map((pair) => pair.b), i), support: "Denke an die andere Richtung." })) },
  ],
  mathe: [
    { id: "zahlenfluss", label: "Zahlenfolgen", icon: "〰️", color: "bg-sky-400", items: mathChallenges.slice(0, 10) },
    { id: "multiplikation", label: "Mal-Reihen", icon: "✖️", color: "bg-indigo-400", items: mathChallenges.slice(10, 28) },
    { id: "zerlegen", label: "Zerlegen", icon: "🧮", color: "bg-amber-400", items: mathChallenges.slice(28) },
    { id: "plusminus", label: "Plus & Minus", icon: "➕", color: "bg-emerald-400", items: mathQuickMix },
    { id: "vergleichen", label: "Vergleichen", icon: "⚖️", color: "bg-violet-400", items: mathCompareQuestions },
    { id: "formen", label: "Formenblick", icon: "🔷", color: "bg-rose-400", items: [
      { prompt: "Was hat keine Ecken?", answer: "Kreis", options: ["Kreis", "Dreieck", "Quadrat", "Würfel"], support: "Fahre mit dem Finger am Rand entlang." },
      { prompt: "Welcher Körper kann rollen?", answer: "Kugel", options: ["Kugel", "Würfel", "Quader", "Pyramide"], support: "Denke an einen Ball." },
      { prompt: "Welche Form hat drei Ecken?", answer: "Dreieck", options: ["Dreieck", "Kreis", "Rechteck", "Kugel"], support: "Zähle die Ecken." },
      { prompt: "Welche Form hat vier gleich lange Seiten?", answer: "Quadrat", options: ["Quadrat", "Kreis", "Dreieck", "Zylinder"], support: "Alle Seiten sind gleich lang." },
    ] },
  ],
  sachunterricht: [
    { id: "lebensraum", label: "Lebensräume", icon: "🌍", color: "bg-emerald-400", items: WORLD_CONTENT.sandboxAnimals.map((a, i) => ({ prompt: `Wo fühlt sich ${a.emoji} ${a.name} besonders wohl?`, answer: WORLD_CONTENT.terrainTypes.find((t) => t.id === a.habitat)?.name || "Wiese", options: optionTexts(WORLD_CONTENT.terrainTypes.find((t) => t.id === a.habitat)?.name || "Wiese", WORLD_CONTENT.terrainTypes.map((t) => t.name), i), support: "Denke an Wärme, Wasser, Futter und Schutz." })) },
    { id: "wetter", label: "Wetter-Entscheider", icon: "🌦️", color: "bg-sky-400", items: worldWeather.map(([weather, answerIcon, answer], i) => ({ prompt: `Was passt gut zu einem ${weather}?`, answer, options: optionTexts(answer, worldWeather.map((item) => item[2]), i), support: `Hilfsbild: ${answerIcon}` })) },
    { id: "naturpflege", label: "Naturpflege", icon: "🌿", color: "bg-teal-400", items: worldCareQuestions },
    { id: "jahreszeit", label: "Jahreszeiten", icon: "🍂", color: "bg-orange-400", items: [
      { prompt: "Wann öffnen sich viele Knospen?", answer: "Frühling", options: ["Frühling", "Sommer", "Herbst", "Winter"], support: "Viele Pflanzen wachen auf." },
      { prompt: "Wann fallen bunte Blätter?", answer: "Herbst", options: ["Frühling", "Sommer", "Herbst", "Winter"], support: "Die Bäume lassen Blätter los." },
      { prompt: "Wann ist es oft sehr kalt und es kann schneien?", answer: "Winter", options: ["Frühling", "Sommer", "Herbst", "Winter"], support: "Mütze und Handschuhe helfen." },
      { prompt: "Wann sind Badetage und Erdbeeren typisch?", answer: "Sommer", options: ["Frühling", "Sommer", "Herbst", "Winter"], support: "Die Sonne wärmt lange." },
    ] },
    { id: "spuren", label: "Spuren-Fragen", icon: "🔎", color: "bg-lime-400", items: WORLD_TRACK_CASES.map((item, i) => ({ prompt: item.clue, answer: item.options.find((option) => option.id === item.answer)?.name || "Tier", options: optionTexts(item.options.find((option) => option.id === item.answer)?.name || "Tier", item.options.map((option) => option.name), i), support: item.title })) },
  ],
  ethik: [
    { id: "situationen", label: "Was hilft?", icon: "🤝", color: "bg-emerald-400", items: emotionChoices.map(([prompt, answer, ...wrong], i) => ({ prompt, answer, options: optionTexts(answer, wrong, i), support: "Freundlich, klar und sicher ist meistens eine gute Spur." })) },
    { id: "gefuehle", label: "Gefühlswörter", icon: "🧠", color: "bg-fuchsia-400", items: feelingQuestions },
    { id: "grenzen", label: "Grenzen & Trost", icon: "🫶", color: "bg-rose-400", items: ethicsBoundaryQuestions },
    { id: "tiefe", label: "Tiefe Fragen", icon: "🕯️", color: "bg-indigo-400", items: ethicsFeelingDepthQuestions },
  ],
  musik: [
    { id: "instrumente", label: "Instrumentenkunde", icon: "🎼", color: "bg-fuchsia-400", items: musicInstruments.map(([name, icon, answer], i) => ({ prompt: `${icon} ${name}: Was passt dazu?`, answer, options: optionTexts(answer, musicInstruments.map((item) => item[2]), i), support: "Schau auf Form und Spielweise." })) },
    { id: "rhythmus", label: "Rhythmus-Muster", icon: "🥁", color: "bg-amber-400", items: musicTheoryQuestions },
    { id: "klangfarben", label: "Klangfarben", icon: "🌈", color: "bg-sky-400", items: musicSoundColorQuestions },
    { id: "tempo", label: "Tempo & Dynamik", icon: "🎚️", color: "bg-emerald-400", items: musicTempoQuestions },
  ],
};

const text = (value) => String(value);
const modPick = (pool, index) => pool[index % pool.length];
const uniq = (items) => Array.from(new Set(items.map(text).filter(Boolean)));
const makeOptions = (answer, pool, index, size = 4) => uniq([answer, ...Array.from({ length: size + 3 }, (_, offset) => pool[(index * 3 + offset + 1) % pool.length])]).slice(0, size);

const lessonItem = ({ prompt, answer, options, support, example, imageCue, scene, challenge }) => ({
  prompt,
  answer: text(answer),
  options: makeOptions(answer, options.map(text), prompt.length + options.length),
  support,
  example,
  imageCue,
  scene,
  challenge,
});

const childNames = ["Mira", "Noa", "Lio", "Ava", "Sam", "Lina", "Jona", "Emil", "Tara", "Mika", "Nuri", "Ella"];
const places = ["im Garten", "am Fenster", "auf dem Teppich", "in der Leseecke", "an der Werkbank", "unter dem Baum", "neben der Brücke", "am Maltisch"];
const gentleVerbs = [
  ["sieht", "beobachtet aufmerksam"],
  ["findet", "entdeckt"],
  ["legt", "ordnet"],
  ["malt", "zeichnet"],
  ["holt", "bringt"],
  ["zählt", "prüft"],
  ["fragt nach", "spricht freundlich über"],
  ["beschreibt", "erzählt von"],
];

const buildDeutschDepth = () => {
  const articleContextItems = WORD_BANK.flatMap((word, wordIndex) =>
    ["auf der Karte", "im Satz", "im kleinen Buch", "beim Sortieren"].map((placeLabel, frameIndex) => {
      const name = modPick(childNames, wordIndex + frameIndex);
      const place = modPick(places, wordIndex + frameIndex * 2);
      const example = `${name} entdeckt ${word.article.toLowerCase()} ${word.word} ${place}.`;
      return lessonItem({
        prompt: `${word.icon} Welcher Artikel passt zu ${word.word} ${placeLabel}?`,
        answer: `${word.article} ${word.word}`,
        options: articleOptions.map((article) => `${article} ${word.word}`),
        support: `Artikelprobe: ${word.article.toLowerCase()} ${word.word}.`,
        example,
        imageCue: `${word.word} ${place}`,
        scene: "Artikelarbeit mit Wortkarten",
        challenge: "article-context",
      });
    })
  );

  const sentenceItems = WORD_BANK.flatMap((word, index) =>
    gentleVerbs.slice(0, 4).map(([verb, meaning], verbIndex) => {
      const name = modPick(childNames, index + verbIndex);
      const place = modPick(places, index + verbIndex);
      const sentence = `${name} ${verb} ${word.article.toLowerCase()} ${word.word} ${place}.`;
      const wrongPool = [
        `${word.article} ${word.word} ${verb} ${name}.`,
        `${name} ${verb} ${place} ${word.article.toLowerCase()}.`,
        `${verb} ${name} ${word.word} ${place}.`,
        `${name} und ${word.word} ${place}.`,
      ];
      return lessonItem({
        prompt: `Welcher Satz ist vollständig und sinnvoll?`,
        answer: sentence,
        options: wrongPool,
        support: `Wer tut etwas? ${name}. Was tut ${name}? ${meaning}.`,
        example: sentence,
        imageCue: `${name} ${meaning} ${word.word}`,
        scene: "Satzstreifen mit Bildkarte",
        challenge: "sentence-meaning",
      });
    })
  );

  const categoryItems = WORD_BANK.flatMap((word, index) =>
    ["Regal", "Tablett", "Bildkarte"].map((kind, kindIndex) =>
      lessonItem({
        prompt: `${word.icon} In welches ${kind} gehört ${word.word}?`,
        answer: word.category,
        options: ["Obst", "Gemüse", "Natur", "Tiere", "Musik", "Fahrzeuge", "Lernen", "Himmel", "Zuhause", "Orte", "Dinge"],
        support: `${word.word} gehört zu: ${word.category}.`,
        example: `${modPick(childNames, index + kindIndex)} sortiert ${word.article.toLowerCase()} ${word.word} in das ${word.category}-Regal.`,
        imageCue: `${word.category}-Regal mit ${word.word}`,
        scene: "Wortschatzregal",
        challenge: "semantic-category",
      })
    )
  );

  return [
    { id: "deep-artikel-kontext", label: "Artikel-Kontextbank", icon: "📚", color: "bg-emerald-500", items: articleContextItems },
    { id: "deep-satzfundus", label: "Satzfundus", icon: "📝", color: "bg-indigo-500", items: sentenceItems },
    { id: "deep-wortschatznetz", label: "Wortschatznetz", icon: "🧺", color: "bg-cyan-500", items: categoryItems },
  ];
};

const numberStories = [
  ["Perlen", "liegen auf dem Teppich"], ["Muscheln", "liegen im Korb"], ["Sterne", "kleben am Himmel"], ["Bausteine", "stehen im Turm"],
  ["Blätter", "liegen auf dem Weg"], ["Trommelschläge", "klingen im Kreis"], ["Buntstifte", "liegen in der Schale"], ["Karten", "liegen auf dem Tisch"],
];

const buildMatheDepth = () => {
  const plusMinusItems = Array.from({ length: 180 }, (_, index) => {
    const a = 3 + (index % 18);
    const b = 2 + ((index * 5) % 11);
    const plus = index % 2 === 0;
    const answer = plus ? a + b : a + b - b;
    const story = modPick(numberStories, index);
    const name = modPick(childNames, index);
    return lessonItem({
      prompt: plus ? `${name} hat ${a} ${story[0]}. ${b} kommen dazu. Wie viele sind es?` : `${name} hat ${a + b} ${story[0]}. ${b} werden weggelegt. Wie viele bleiben?`,
      answer,
      options: [answer - 2, answer - 1, answer + 1, answer + 2, answer + 3].filter((n) => n >= 0),
      support: plus ? "Lege dazu und zähle weiter." : "Nimm weg und zähle, was bleibt.",
      example: plus ? `${a} + ${b} = ${answer}` : `${a + b} - ${b} = ${answer}`,
      imageCue: `${story[0]} ${story[1]}`,
      scene: "Rechengeschichte mit Material",
      challenge: "material-word-problem",
    });
  });

  const multiplicationItems = Array.from({ length: 144 }, (_, index) => {
    const rows = 2 + (index % 10);
    const columns = 2 + ((index * 3) % 9);
    const answer = rows * columns;
    return lessonItem({
      prompt: `${rows} Reihen mit je ${columns} Perlen: Wie viele Perlen sind es?`,
      answer,
      options: [rows + columns, answer - rows, answer + columns, answer + rows, rows * (columns + 1)].filter((n) => n > 0),
      support: `${rows} gleiche Reihen. Zähle in ${columns}er-Schritten oder rechne ${rows} × ${columns}.`,
      example: `${rows} × ${columns} = ${answer}`,
      imageCue: `${rows} mal ${columns} Perlenrechteck`,
      scene: "Perlenrechteck",
      challenge: "multiplication-grid",
    });
  });

  const sequenceItems = Array.from({ length: 150 }, (_, index) => {
    const step = [2, 3, 4, 5, 6, 7, 8, 9, 10][index % 9];
    const start = (index % 12) * step + (index % 3);
    const missingPos = 2 + (index % 3);
    const sequence = Array.from({ length: 6 }, (_, i) => start + i * step);
    const answer = sequence[missingPos];
    const shown = sequence.map((value, i) => (i === missingPos ? "?" : value)).join(" - ");
    return lessonItem({
      prompt: `Welche Zahl fehlt? ${shown}`,
      answer,
      options: [answer - step, answer + step, answer + 1, answer - 1, start + step].filter((n) => n >= 0),
      support: `Die Reihe springt immer um ${step}.`,
      example: sequence.join(" - "),
      imageCue: `Zahlenleiter mit ${step}er-Schritten`,
      scene: "Zahlenleiter",
      challenge: "number-sequence",
    });
  });

  return [
    { id: "deep-rechengeschichten", label: "Rechengeschichten", icon: "🧮", color: "bg-emerald-500", items: plusMinusItems },
    { id: "deep-perlenreihen", label: "Perlenreihen", icon: "✖️", color: "bg-indigo-500", items: multiplicationItems },
    { id: "deep-zahlenmuster", label: "Zahlenmuster", icon: "〰️", color: "bg-sky-500", items: sequenceItems },
  ];
};

const animalFacts = [
  ["Frosch", "Teich", "feuchte Haut", "Wasser und Ufer"], ["Kamel", "Wüste", "breite Füße", "trockene warme Orte"],
  ["Pinguin", "Eis und Meer", "dichtes Gefieder", "kalte Küsten"], ["Reh", "Wald", "leise Hufe", "Wald und Wiese"],
  ["Fuchs", "Waldrand", "feine Nase", "Verstecke und offene Flächen"], ["Biene", "Blumenwiese", "Saugrüssel", "Blüten und Nektar"],
  ["Igel", "Laubhaufen", "Stacheln", "ruhige Ecken"], ["Ente", "Teich", "Schwimmfüße", "Wasser und Ufer"],
  ["Maus", "Feldrand", "kleine Pfoten", "Gras und Verstecke"], ["Schmetterling", "Blumen", "Flügel", "sonnige Blüten"],
];

const weatherFacts = [
  ["Regen", "Regenschirm", "Viele Tropfen fallen.", "Matsch und Pfützen"], ["Sonne", "Trinken und Schatten", "Es ist hell und warm.", "heller warmer Tag"],
  ["Schnee", "Handschuhe", "Der Boden ist weiß.", "kalte Flocken"], ["Wind", "Drachen oder feste Jacke", "Blätter bewegen sich.", "tanzende Blätter"],
  ["Nebel", "langsam gehen", "Man sieht weniger weit.", "weiche graue Luft"], ["Gewitter", "drinnen bleiben", "Blitz und Donner kommen.", "sicheres Fenster"],
  ["Frost", "Schal", "Die Luft ist eisig.", "glitzerndes Eis"], ["Hitze", "Wasser und Pause", "Der Körper braucht Schutz.", "Schattenplatz"],
];

const buildWorldDepth = () => {
  const habitatItems = Array.from({ length: 180 }, (_, index) => {
    const [animal, place, body, answer] = modPick(animalFacts, index);
    return lessonItem({
      prompt: `${animal}: Was hilft diesem Tier in seinem Lebensraum?`,
      answer,
      options: animalFacts.map((fact) => fact[3]),
      support: `${body} passt zu ${place}.`,
      example: `Der ${animal} lebt gut dort, wo ${answer.toLowerCase()} da sind.`,
      imageCue: `${animal} in ${place}`,
      scene: "Lebensraum-Forscherkarten",
      challenge: "habitat-reasoning",
    });
  });

  const weatherItems = Array.from({ length: 144 }, (_, index) => {
    const [weather, answer, clue, cue] = modPick(weatherFacts, index);
    const name = modPick(childNames, index);
    return lessonItem({
      prompt: `${name} erlebt ${weather}. Was passt jetzt gut?`,
      answer,
      options: weatherFacts.map((fact) => fact[1]),
      support: clue,
      example: `Bei ${weather.toLowerCase()} hilft: ${answer}.`,
      imageCue: cue,
      scene: "Wetter-Entscheider",
      challenge: "weather-choice",
    });
  });

  const observationItems = Array.from({ length: 132 }, (_, index) => {
    const [animal, place, body] = modPick(animalFacts, index);
    const questionTypes = [
      [`Was beobachtest du zuerst bei ${animal}?`, body, "erst schauen, dann vorsichtig fragen"],
      [`Was verrät der Ort ${place}?`, `Hier könnte ${animal} leben.`, "Lebensräume geben Hinweise."],
      [`Was ist beim Forschen freundlich?`, "Abstand halten", "Lebewesen werden nicht gestört."],
    ];
    const [prompt, answer, support] = modPick(questionTypes, index);
    return lessonItem({
      prompt,
      answer,
      options: [answer, body, "laut rufen", "alles anfassen", "Spuren zerstören", "wegrennen"],
      support,
      example: `Ich schaue genau hin und lasse dem ${animal} Raum.`,
      imageCue: `${animal} Beobachtung`,
      scene: "Forscherfrage",
      challenge: "nature-observation",
    });
  });

  return [
    { id: "deep-lebensraumwissen", label: "Lebensraumwissen", icon: "🌍", color: "bg-emerald-500", items: habitatItems },
    { id: "deep-wetterwissen", label: "Wetterwissen", icon: "🌦️", color: "bg-sky-500", items: weatherItems },
    { id: "deep-forscherfragen", label: "Forscherfragen", icon: "🔎", color: "bg-teal-500", items: observationItems },
  ];
};

const heartSituations = [
  ["Ein Kind sagt Nein zum Kitzeln.", "Stopp achten", "Die Grenze gilt auch beim Spielen."],
  ["Ein Freund ist sehr still.", "sanft fragen", "Nähe braucht Erlaubnis."],
  ["Du hast etwas kaputt gemacht.", "ehrlich sagen und helfen", "Wiedergutmachen beginnt mit Verantwortung."],
  ["Zwei Kinder wollen denselben Platz.", "abwechseln oder gemeinsam planen", "Fairness sucht eine Lösung für beide."],
  ["Jemand lacht über einen Fehler.", "Schutz holen und freundlich stoppen", "Fehler dürfen sicher bleiben."],
  ["Du bist wütend im Bauch.", "Abstand nehmen und atmen", "Gefühle sind okay, Verletzen nicht."],
  ["Ein Geheimnis fühlt sich schwer an.", "mit einer sicheren erwachsenen Person reden", "Schwere Geheimnisse brauchen Hilfe."],
  ["Du willst nicht erzählen.", "Jetzt nicht sagen", "Du darfst dein Tempo wählen."],
  ["Ein Kind wird ausgeschlossen.", "einladen oder Hilfe holen", "Dazugehören ist wichtig."],
  ["Du hast Angst vor etwas Neuem.", "einen kleinen Schritt wählen", "Mut darf klein sein."],
];

const feelingWords = [
  ["Mut", "Angst und Neugier sind gleichzeitig da."], ["Scham", "Man möchte sich verstecken."],
  ["Trauer", "Etwas tut im Herzen weh."], ["Wut", "Der Körper zeigt: Eine Grenze ist berührt."],
  ["Freude", "Etwas fühlt sich hell und warm an."], ["Nervosität", "Vor etwas Wichtigem kribbelt es."],
  ["Erschöpfung", "Der Körper bittet um Pause."], ["Vertrauen", "Man fühlt sich sicher genug."],
  ["Dankbarkeit", "Etwas Gutes wird bemerkt."], ["Enttäuschung", "Etwas Erhofftes ist anders gekommen."],
  ["Hoffnung", "Ein kleiner nächster guter Schritt wird sichtbar."], ["Überforderung", "Es ist gerade zu viel auf einmal."],
];

const buildEthikDepth = () => {
  const situationItems = Array.from({ length: 220 }, (_, index) => {
    const [situation, answer, support] = modPick(heartSituations, index);
    const name = modPick(childNames, index);
    return lessonItem({
      prompt: `${name}: ${situation} Was hilft jetzt am ehesten?`,
      answer,
      options: heartSituations.map((item) => item[1]).concat(["drängen", "auslachen", "alles wegnehmen", "so tun als wäre nichts"]),
      support,
      example: `${name} sagt ruhig: Ich brauche einen guten nächsten Schritt.`,
      imageCue: "ruhiger Gesprächskreis",
      scene: "Miteinander-Karte",
      challenge: "social-situation",
    });
  });

  const feelingItems = Array.from({ length: 168 }, (_, index) => {
    const [feeling, clue] = modPick(feelingWords, index);
    const name = modPick(childNames, index);
    return lessonItem({
      prompt: `${name} merkt: ${clue} Welches Wort passt?`,
      answer: feeling,
      options: feelingWords.map((item) => item[0]),
      support: "Gefühlswörter helfen, innen genauer zu werden.",
      example: `${name} sagt: Ich glaube, das ist ${feeling.toLowerCase()}.`,
      imageCue: `${feeling} als Gefühlskarte`,
      scene: "Gefühlskarten",
      challenge: "feeling-vocabulary",
    });
  });

  const sentenceItems = Array.from({ length: 144 }, (_, index) => {
    const [situation, answer] = modPick(heartSituations, index);
    const sentence = [
      "Stopp, ich möchte das nicht.",
      "Ich brauche kurz eine Pause.",
      "Kannst du mir bitte helfen?",
      "Ich höre dir zu.",
      "Es tut mir leid, ich mache es wieder gut.",
      "Ich möchte erst nachdenken.",
      "Ich freue mich für dich.",
      "Ich bin da, wenn du möchtest.",
    ][index % 8];
    return lessonItem({
      prompt: `${situation} Welcher Satz ist klar und freundlich?`,
      answer: sentence,
      options: [sentence, "Ist mir egal.", "Du bist schuld.", "Ich muss gar nichts sagen.", "Alle sollen weggehen."],
      support: `Hilfreiche Richtung: ${answer}.`,
      example: sentence,
      imageCue: "Satzkarte für Grenzen und Trost",
      scene: "Traumasensible Sprachkarten",
      challenge: "safe-language",
    });
  });

  return [
    { id: "deep-herzsituationen", label: "Herzsituationen", icon: "🤝", color: "bg-emerald-500", items: situationItems },
    { id: "deep-gefuehlswortschatz", label: "Gefühlswortschatz", icon: "🧠", color: "bg-fuchsia-500", items: feelingItems },
    { id: "deep-gute-saetze", label: "Gute Sätze", icon: "💬", color: "bg-indigo-500", items: sentenceItems },
  ];
};

const instrumentFacts = [
  ["Klavier", "Tasten", "hell oder warm", "Finger drücken Tasten"], ["Trommel", "Fell", "rhythmisch", "Hände oder Schlägel schlagen"],
  ["Flöte", "Luft", "luftig", "Atem macht den Ton"], ["Geige", "Saiten", "singend", "ein Bogen streicht"],
  ["Gitarre", "Saiten", "gezupft", "Finger zupfen oder schlagen"], ["Glockenspiel", "Metallstäbe", "glitzernd", "Schlägel treffen Metall"],
  ["Trompete", "Blech", "strahlend", "Luft schwingt im Mundstück"], ["Kalimba", "Metallzungen", "rund gezupft", "Daumen zupfen"],
  ["Xylophon", "Holzstäbe", "trocken hell", "Schlägel treffen Holz"], ["Kontrabass", "lange Saiten", "tief", "große Saiten schwingen"],
];

const buildMusikDepth = () => {
  const instrumentItems = Array.from({ length: 180 }, (_, index) => {
    const [name, feature, timbre, action] = modPick(instrumentFacts, index);
    return lessonItem({
      prompt: `${name}: Was passt zu diesem Instrument?`,
      answer: feature,
      options: instrumentFacts.map((item) => item[1]),
      support: `${action}.`,
      example: `${name} klingt oft ${timbre}.`,
      imageCue: `${name} Nahaufnahme`,
      scene: "Instrumentenfamilien",
      challenge: "instrument-feature",
    });
  });

  const rhythmWords = ["klatsch", "stampf", "pause", "zisch", "kling", "klopf"];
  const rhythmItems = Array.from({ length: 160 }, (_, index) => {
    const a = rhythmWords[index % rhythmWords.length];
    const b = rhythmWords[(index + 2) % rhythmWords.length];
    const pattern = index % 3 === 0 ? `${a} ${b} ${a} ${b}` : index % 3 === 1 ? `${a} ${a} ${b}` : `${a} ${b} pause ${a}`;
    const answer = index % 3 === 0 ? "ABAB" : index % 3 === 1 ? "AAB" : "AB-Ruhe-A";
    return lessonItem({
      prompt: `Welches Muster passt zu: ${pattern}?`,
      answer,
      options: ["ABAB", "AAB", "ABB", "ABC", "AB-Ruhe-A", "AAAA"],
      support: "Gleiche Klänge bekommen denselben Buchstaben.",
      example: pattern,
      imageCue: "Rhythmuskarten",
      scene: "Rhythmuslabor",
      challenge: "rhythm-pattern",
    });
  });

  const listeningItems = Array.from({ length: 132 }, (_, index) => {
    const [name, , timbre] = modPick(instrumentFacts, index);
    const mood = ["ruhig", "mutig", "leicht", "geheimnisvoll", "fröhlich", "traurig"][index % 6];
    return lessonItem({
      prompt: `Welche Klangfarbe passt zu ${mood} und ${timbre}?`,
      answer: name,
      options: instrumentFacts.map((item) => item[0]),
      support: `Achte auf Material, Tonhöhe und Spielweise.`,
      example: `Ich höre ${name}: Der Klang wirkt ${mood}.`,
      imageCue: `${name} Klangbild`,
      scene: "Hörkarten",
      challenge: "listening-vocabulary",
    });
  });

  return [
    { id: "deep-instrumentenbank", label: "Instrumentenbank", icon: "🎼", color: "bg-fuchsia-500", items: instrumentItems },
    { id: "deep-rhythmusbank", label: "Rhythmusbank", icon: "🥁", color: "bg-amber-500", items: rhythmItems },
    { id: "deep-hoerwortschatz", label: "Hörwortschatz", icon: "👂", color: "bg-sky-500", items: listeningItems },
  ];
};

export const SUBJECT_VARIANT_CONTENT = {
  deutsch: [...BASE_SUBJECT_VARIANT_CONTENT.deutsch, ...buildDeutschDepth()],
  mathe: [...BASE_SUBJECT_VARIANT_CONTENT.mathe, ...buildMatheDepth()],
  sachunterricht: [...BASE_SUBJECT_VARIANT_CONTENT.sachunterricht, ...buildWorldDepth()],
  ethik: [...BASE_SUBJECT_VARIANT_CONTENT.ethik, ...buildEthikDepth()],
  musik: [...BASE_SUBJECT_VARIANT_CONTENT.musik, ...buildMusikDepth()],
};

export const SUBJECT_CONTENT_STATS = Object.fromEntries(
  Object.entries(SUBJECT_VARIANT_CONTENT).map(([subject, collections]) => [
    subject,
    {
      collections: collections.length,
      items: collections.reduce((sum, collection) => sum + collection.items.length, 0),
      largestCollection: Math.max(...collections.map((collection) => collection.items.length)),
    },
  ])
);
