const unique = (items) => Array.from(new Set(items.map((item) => String(item ?? "").trim()).filter(Boolean)));

const rotateOptions = (answer, pool, seed, size = 4) => {
  const source = unique(pool);
  const rotated = Array.from({ length: size + 8 }, (_, offset) => source[(seed * 3 + offset) % source.length]);
  return unique([answer, ...rotated]).slice(0, size);
};

const item = ({ prompt, answer, options, support, example, imageCue, scene, challenge }) => ({
  prompt,
  answer: String(answer),
  options: rotateOptions(answer, options, prompt.length + String(answer).length),
  support,
  example,
  imageCue,
  scene,
  challenge,
});

const collection = (id, label, icon, color, items) => ({ id, label, icon, color, items });

const names = ["Mira", "Noa", "Lio", "Ava", "Sam", "Lina", "Jona", "Emil", "Tara", "Mika", "Nuri", "Ella"];
const places = ["im Garten", "am Fenster", "auf dem Teppich", "in der Küche", "an der Werkbank", "unter dem Baum", "neben der Brücke", "am Maltisch", "in der Leseecke", "auf dem Balkon"];

const vocabularyRows = [
  ["Apfel", "Der", "Obst", "🍎", "rund", "wächst am Baum"],
  ["Banane", "Die", "Obst", "🍌", "gelb", "ist länglich und süß"],
  ["Birne", "Die", "Obst", "🍐", "weich", "hat einen Kern im Inneren"],
  ["Erdbeere", "Die", "Obst", "🍓", "rot", "wächst nahe am Boden"],
  ["Pflaume", "Die", "Obst", "🫐", "violett", "hat einen Stein in der Mitte"],
  ["Karotte", "Die", "Gemüse", "🥕", "knackig", "wächst in der Erde"],
  ["Gurke", "Die", "Gemüse", "🥒", "grün", "enthält viel Wasser"],
  ["Kartoffel", "Die", "Gemüse", "🥔", "erdig", "wird oft gekocht"],
  ["Tomate", "Die", "Gemüse", "🍅", "saftig", "hat kleine Kerne"],
  ["Paprika", "Die", "Gemüse", "🫑", "bunt", "kann rot, gelb oder grün sein"],
  ["Brot", "Das", "Essen", "🍞", "duftend", "wird aus Getreide gebacken"],
  ["Käse", "Der", "Essen", "🧀", "würzig", "wird aus Milch gemacht"],
  ["Wasser", "Das", "Essen", "💧", "klar", "löscht Durst"],
  ["Milch", "Die", "Essen", "🥛", "weiß", "kommt oft von der Kuh"],
  ["Suppe", "Die", "Essen", "🥣", "warm", "wird mit dem Löffel gegessen"],
  ["Teller", "Der", "Zuhause", "🍽️", "flach", "trägt das Essen"],
  ["Löffel", "Der", "Zuhause", "🥄", "rund", "hilft bei Suppe"],
  ["Gabel", "Die", "Zuhause", "🍴", "spitz", "hat Zinken"],
  ["Tasse", "Die", "Zuhause", "☕", "hohl", "hält ein Getränk"],
  ["Topf", "Der", "Zuhause", "🍲", "tief", "steht beim Kochen auf dem Herd"],
  ["Pfanne", "Die", "Zuhause", "🍳", "breit", "brät Essen"],
  ["Baum", "Der", "Natur", "🌳", "hoch", "hat Stamm und Krone"],
  ["Blatt", "Das", "Natur", "🍃", "leicht", "wächst an Pflanzen"],
  ["Blume", "Die", "Natur", "🌸", "bunt", "öffnet ihre Blüte"],
  ["Wurzel", "Die", "Natur", "🌱", "verborgen", "hält die Pflanze fest"],
  ["Samen", "Der", "Natur", "🌰", "klein", "kann zu einer Pflanze werden"],
  ["Stein", "Der", "Natur", "🪨", "hart", "liegt oft am Weg"],
  ["Muschel", "Die", "Natur", "🐚", "glatt", "kommt oft vom Strand"],
  ["Sand", "Der", "Natur", "🏖️", "körnig", "rieselt durch die Finger"],
  ["Bach", "Der", "Natur", "🏞️", "kühl", "fließt leise"],
  ["See", "Der", "Natur", "🌊", "weit", "sammelt viel Wasser"],
  ["Berg", "Der", "Natur", "⛰️", "hoch", "ragt in den Himmel"],
  ["Tal", "Das", "Natur", "🏞️", "tief", "liegt zwischen Bergen"],
  ["Wolke", "Die", "Himmel", "☁️", "weich", "schwebt am Himmel"],
  ["Sonne", "Die", "Himmel", "☀️", "hell", "gibt Licht und Wärme"],
  ["Mond", "Der", "Himmel", "🌙", "silbern", "scheint in der Nacht"],
  ["Stern", "Der", "Himmel", "⭐", "funkelnd", "leuchtet am Nachthimmel"],
  ["Regen", "Der", "Wetter", "🌧️", "nass", "fällt aus Wolken"],
  ["Schnee", "Der", "Wetter", "❄️", "kalt", "bedeckt den Boden weiß"],
  ["Wind", "Der", "Wetter", "🌬️", "unsichtbar", "bewegt Blätter"],
  ["Nebel", "Der", "Wetter", "🌫️", "grau", "macht die Sicht weich"],
  ["Regenbogen", "Der", "Himmel", "🌈", "bunt", "erscheint bei Sonne und Regen"],
  ["Hund", "Der", "Tiere", "🐶", "treu", "wedelt oft mit dem Schwanz"],
  ["Katze", "Die", "Tiere", "🐱", "leise", "schleicht auf Pfoten"],
  ["Hase", "Der", "Tiere", "🐇", "schnell", "hat lange Ohren"],
  ["Fuchs", "Der", "Tiere", "🦊", "wachsam", "hat eine feine Nase"],
  ["Reh", "Das", "Tiere", "🦌", "scheu", "lebt gern am Waldrand"],
  ["Igel", "Der", "Tiere", "🦔", "stachelig", "rollt sich zum Schutz ein"],
  ["Vogel", "Der", "Tiere", "🐦", "leicht", "kann fliegen"],
  ["Ente", "Die", "Tiere", "🦆", "schwimmend", "lebt gern am Wasser"],
  ["Frosch", "Der", "Tiere", "🐸", "feucht", "springt am Teich"],
  ["Fisch", "Der", "Tiere", "🐟", "glitschig", "atmet unter Wasser"],
  ["Biene", "Die", "Tiere", "🐝", "fleißig", "sammelt Nektar"],
  ["Ameise", "Die", "Tiere", "🐜", "stark", "trägt kleine Stücke"],
  ["Schmetterling", "Der", "Tiere", "🦋", "zart", "hat bunte Flügel"],
  ["Schnecke", "Die", "Tiere", "🐌", "langsam", "trägt ein Haus"],
  ["Pferd", "Das", "Tiere", "🐴", "kräftig", "läuft auf Hufen"],
  ["Kuh", "Die", "Tiere", "🐄", "ruhig", "frisst Gras"],
  ["Ziege", "Die", "Tiere", "🐐", "neugierig", "klettert gern"],
  ["Elefant", "Der", "Tiere", "🐘", "groß", "hat einen Rüssel"],
  ["Pinguin", "Der", "Tiere", "🐧", "watschelnd", "lebt in kalten Gegenden"],
  ["Hand", "Die", "Körper", "✋", "geschickt", "kann greifen"],
  ["Fuß", "Der", "Körper", "🦶", "tragend", "hilft beim Gehen"],
  ["Auge", "Das", "Körper", "👁️", "wach", "nimmt Licht wahr"],
  ["Ohr", "Das", "Körper", "👂", "aufmerksam", "hört Geräusche"],
  ["Nase", "Die", "Körper", "👃", "fein", "riecht Düfte"],
  ["Mund", "Der", "Körper", "👄", "beweglich", "spricht und isst"],
  ["Zahn", "Der", "Körper", "🦷", "fest", "zerkleinert Essen"],
  ["Herz", "Das", "Körper", "💛", "lebendig", "schlägt in der Brust"],
  ["Bauch", "Der", "Körper", "🫶", "weich", "meldet Hunger oder Ruhe"],
  ["Rücken", "Der", "Körper", "🧍", "stark", "hält den Körper aufrecht"],
  ["Freude", "Die", "Gefühle", "😊", "hell", "macht das Gesicht weich"],
  ["Mut", "Der", "Gefühle", "🦁", "stark", "hilft trotz Angst"],
  ["Angst", "Die", "Gefühle", "😟", "wachsam", "will schützen"],
  ["Wut", "Die", "Gefühle", "😠", "heiß", "zeigt eine Grenze"],
  ["Trauer", "Die", "Gefühle", "🌧️", "schwer", "braucht Trost"],
  ["Ruhe", "Die", "Gefühle", "🕯️", "still", "gibt dem Körper Pause"],
  ["Hoffnung", "Die", "Gefühle", "🌱", "klein", "zeigt einen nächsten Schritt"],
  ["Scham", "Die", "Gefühle", "🫣", "leise", "möchte sich verstecken"],
  ["Stolz", "Der", "Gefühle", "🏅", "aufrecht", "kommt nach echter Mühe"],
  ["Neugier", "Die", "Gefühle", "🔎", "wach", "möchte etwas entdecken"],
  ["Buch", "Das", "Lernen", "📖", "spannend", "erzählt mit Seiten"],
  ["Heft", "Das", "Lernen", "📓", "geordnet", "sammelt Gedanken"],
  ["Stift", "Der", "Lernen", "✏️", "spitz", "macht Zeichen"],
  ["Pinsel", "Der", "Lernen", "🖌️", "weich", "trägt Farbe"],
  ["Schere", "Die", "Lernen", "✂️", "scharf", "schneidet Papier"],
  ["Kleber", "Der", "Lernen", "🧴", "klebrig", "verbindet Papier"],
  ["Lineal", "Das", "Lernen", "📏", "gerade", "misst Längen"],
  ["Ranzen", "Der", "Lernen", "🎒", "tragbar", "nimmt Hefte mit"],
  ["Tafel", "Die", "Lernen", "🧑‍🏫", "groß", "zeigt Zeichen für alle"],
  ["Karte", "Die", "Lernen", "🗺️", "hilfreich", "zeigt Orte und Wege"],
  ["Würfel", "Der", "Lernen", "🎲", "eckig", "hat sechs Flächen"],
  ["Perle", "Die", "Lernen", "🟡", "zählbar", "hilft beim Rechnen"],
  ["Jacke", "Die", "Kleidung", "🧥", "warm", "schützt den Oberkörper"],
  ["Mütze", "Die", "Kleidung", "🧢", "wärmend", "schützt den Kopf"],
  ["Schuh", "Der", "Kleidung", "👟", "fest", "schützt den Fuß"],
  ["Schal", "Der", "Kleidung", "🧣", "weich", "wärmt den Hals"],
  ["Hose", "Die", "Kleidung", "👖", "praktisch", "bedeckt die Beine"],
  ["Kleid", "Das", "Kleidung", "👗", "leicht", "ist ein Kleidungsstück"],
  ["Haus", "Das", "Orte", "🏠", "sicher", "hat Räume und Dach"],
  ["Garten", "Der", "Orte", "🌿", "grün", "hat Pflanzen und Wege"],
  ["Brücke", "Die", "Orte", "🌉", "verbindend", "führt über etwas"],
  ["Straße", "Die", "Orte", "🛣️", "lang", "führt von Ort zu Ort"],
  ["Schule", "Die", "Orte", "🏫", "lebendig", "ist ein Lernort"],
  ["Küche", "Die", "Orte", "🍳", "warm", "ist ein Ort zum Kochen"],
  ["Zimmer", "Das", "Orte", "🛏️", "ruhig", "ist ein Raum im Haus"],
  ["Fenster", "Das", "Orte", "🪟", "durchsichtig", "lässt Licht herein"],
  ["Tür", "Die", "Orte", "🚪", "beweglich", "öffnet und schließt Räume"],
  ["Trommel", "Die", "Musik", "🥁", "rhythmisch", "klingt beim Schlagen"],
  ["Flöte", "Die", "Musik", "🪈", "luftig", "klingt durch Atem"],
  ["Geige", "Die", "Musik", "🎻", "singend", "hat Saiten und Bogen"],
  ["Gitarre", "Die", "Musik", "🎸", "gezupft", "hat Saiten"],
  ["Klavier", "Das", "Musik", "🎹", "tastend", "hat weiße und schwarze Tasten"],
  ["Glocke", "Die", "Musik", "🔔", "hell", "klingt beim Anschlagen"],
  ["Rassel", "Die", "Musik", "🪇", "raschelnd", "klingt beim Schütteln"],
  ["Hammer", "Der", "Werkzeug", "🔨", "schwer", "schlägt Nägel"],
  ["Säge", "Die", "Werkzeug", "🪚", "gezackt", "schneidet Holz"],
  ["Lupe", "Die", "Werkzeug", "🔍", "vergrößernd", "macht Kleines groß"],
  ["Kompass", "Der", "Werkzeug", "🧭", "richtend", "zeigt Himmelsrichtungen"],
  ["Uhr", "Die", "Werkzeug", "🕰️", "genau", "zeigt die Zeit"],
  ["Lampe", "Die", "Werkzeug", "💡", "leuchtend", "macht es hell"],
  ["Schlüssel", "Der", "Werkzeug", "🔑", "passend", "öffnet ein Schloss"],
  ["Seil", "Das", "Werkzeug", "🪢", "lang", "kann Dinge verbinden"],
];

const vocabulary = vocabularyRows.map(([word, article, category, icon, adjective, detail], index) => ({
  id: `word-${index}`,
  word,
  article,
  category,
  icon,
  adjective,
  detail,
}));

const categories = unique(vocabulary.map((entry) => entry.category));
const adjectives = unique(vocabulary.map((entry) => entry.adjective));
const details = unique(vocabulary.map((entry) => entry.detail));

const buildDeutschPack = () => {
  const articleItems = vocabulary.map((entry) =>
    item({
      prompt: `Welcher Artikel passt zu ${entry.icon} ${entry.word}?`,
      answer: `${entry.article} ${entry.word}`,
      options: ["Der", "Die", "Das"].map((article) => `${article} ${entry.word}`),
      support: `Artikelprobe: ${entry.article.toLowerCase()} ${entry.word}.`,
      example: `${entry.article} ${entry.word} ist ${entry.adjective}.`,
      imageCue: `${entry.word} als klare Bildkarte`,
      scene: "Artikelkarten",
      challenge: "article-vocabulary",
    })
  );

  const categoryItems = vocabulary.map((entry, index) =>
    item({
      prompt: `${entry.icon} In welches Wortschatz-Regal gehört ${entry.word}?`,
      answer: entry.category,
      options: rotateOptions(entry.category, categories, index + 2, 4),
      support: `${entry.word} gehört zu: ${entry.category}.`,
      example: `${entry.article} ${entry.word} liegt im ${entry.category}-Regal.`,
      imageCue: `${entry.category}-Regal mit ${entry.word}`,
      scene: "Wortschatzregal",
      challenge: "semantic-category",
    })
  );

  const adjectiveItems = vocabulary.map((entry, index) =>
    item({
      prompt: `Welches Eigenschaftswort passt zu ${entry.icon} ${entry.word}?`,
      answer: entry.adjective,
      options: rotateOptions(entry.adjective, adjectives, index + 4, 4),
      support: `Beschreibe ${entry.article.toLowerCase()} ${entry.word}: ${entry.adjective}.`,
      example: `${entry.article} ${entry.word} ist ${entry.adjective}.`,
      imageCue: `${entry.word}, ${entry.adjective}`,
      scene: "Adjektivkarten",
      challenge: "adjective-vocabulary",
    })
  );

  const meaningItems = vocabulary.map((entry, index) =>
    item({
      prompt: `Was passt zu ${entry.icon} ${entry.word}?`,
      answer: entry.detail,
      options: rotateOptions(entry.detail, details, index + 6, 4),
      support: `Suche die Bedeutung, nicht nur den Klang.`,
      example: `${entry.article} ${entry.word} ${entry.detail}.`,
      imageCue: `${entry.word} in einer echten Situation`,
      scene: "Bedeutungsnetz",
      challenge: "meaning-network",
    })
  );

  const sentenceItems = vocabulary.map((entry, index) => {
    const place = places[index % places.length];
    const name = names[index % names.length];
    const correct = `${entry.article} ${entry.word} ist ${entry.adjective} ${place}.`;
    return item({
      prompt: `${name} baut einen Satz mit ${entry.icon} ${entry.word}. Welcher Satz ist sinnvoll?`,
      answer: correct,
      options: [
        correct,
        `${entry.word} ${entry.article.toLowerCase()} ${place} ist.`,
        `${entry.article} ${entry.word} rennt ohne Sinn durch die Farbe.`,
        `${entry.adjective} ist ${place} ${entry.article.toLowerCase()}.`,
      ],
      support: `Ein guter Satz hat einen klaren Gegenstand und eine passende Aussage.`,
      example: correct,
      imageCue: `${entry.word} ${place}`,
      scene: "Satzstreifen",
      challenge: "sentence-sense",
    });
  });

  return [
    collection("mehr-artikelbank", "Artikelbank XL", "📚", "bg-emerald-500", articleItems),
    collection("mehr-wortregale", "Wortregale XL", "🧺", "bg-cyan-500", categoryItems),
    collection("mehr-adjektivgarten", "Adjektivgarten", "🌼", "bg-amber-500", adjectiveItems),
    collection("mehr-bedeutungsnetz", "Bedeutungsnetz", "🕸️", "bg-indigo-500", meaningItems),
    collection("mehr-satzgarten", "Satzgarten", "📝", "bg-rose-500", sentenceItems),
  ];
};

const numberObjects = vocabulary.slice(0, 42).map((entry) => entry.word.toLowerCase());

const buildMathePack = () => {
  const storyItems = Array.from({ length: 260 }, (_, index) => {
    const a = 3 + (index % 24);
    const b = 2 + ((index * 7) % 15);
    const plus = index % 3 !== 0;
    const object = numberObjects[index % numberObjects.length];
    const answer = plus ? a + b : a + b - b;
    return item({
      prompt: plus ? `${names[index % names.length]} hat ${a} ${object}. ${b} kommen dazu. Wie viele sind es?` : `${names[index % names.length]} hat ${a + b} ${object}. ${b} werden weggelegt. Wie viele bleiben?`,
      answer,
      options: [answer, answer - 2, answer - 1, answer + 1, answer + 2, a + b].filter((value) => value >= 0),
      support: plus ? "Dazu bedeutet: die Menge wächst." : "Weglegen bedeutet: die Menge wird kleiner.",
      example: plus ? `${a} + ${b} = ${answer}` : `${a + b} - ${b} = ${answer}`,
      imageCue: `${object} als Rechenmaterial`,
      scene: "Rechengeschichte",
      challenge: "word-problem-xl",
    });
  });

  const sequenceItems = Array.from({ length: 210 }, (_, index) => {
    const step = [2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50][index % 11];
    const start = (index % 18) * (index % 4 === 0 ? 5 : 1);
    const missing = 1 + (index % 4);
    const row = Array.from({ length: 6 }, (_, pos) => start + pos * step);
    const answer = row[missing];
    const shown = row.map((value, pos) => (pos === missing ? "__" : value)).join(" · ");
    return item({
      prompt: `Welche Zahl fehlt? ${shown}`,
      answer,
      options: [answer, answer - step, answer + step, answer + 1, answer - 1, start + step],
      support: `Die Reihe springt immer um ${step}.`,
      example: row.join(" · "),
      imageCue: `Zahlenkette mit ${step}er-Schritten`,
      scene: "Zahlenmuster",
      challenge: "sequence-xl",
    });
  });

  const placeValueItems = Array.from({ length: 160 }, (_, index) => {
    const hundreds = 1 + (index % 8);
    const tens = (index * 3) % 10;
    const ones = (index * 7) % 10;
    const answer = hundreds * 100 + tens * 10 + ones;
    return item({
      prompt: `${hundreds} Hunderter, ${tens} Zehner und ${ones} Einer ergeben welche Zahl?`,
      answer,
      options: [answer, hundreds * 100 + ones * 10 + tens, tens * 100 + hundreds * 10 + ones, answer + 10, answer - 1],
      support: "Hunderter, Zehner und Einer stehen an festen Stellen.",
      example: `${hundreds}00 + ${tens}0 + ${ones} = ${answer}`,
      imageCue: "goldenes Perlenmaterial mit Stellenwert",
      scene: "Stellenwert",
      challenge: "place-value-xl",
    });
  });

  const measureItems = Array.from({ length: 120 }, (_, index) => {
    const tasks = [
      ["Ein Bleistift ist etwa 12 __ lang.", "Zentimeter", ["Liter", "Kilogramm", "Stunden"], "Länge misst man mit Zentimeter oder Meter."],
      ["Eine Trinkflasche fasst eher 1 __.", "Liter", ["Meter", "Gramm", "Uhr"], "Flüssigkeit misst man oft in Litern."],
      ["Ein Schulweg dauert vielleicht 15 __.", "Minuten", ["Zentimeter", "Kilogramm", "Liter"], "Zeit misst man mit Minuten und Stunden."],
      ["Ein Apfel wiegt eher 150 __.", "Gramm", ["Meter", "Liter", "Minuten"], "Gewicht misst man mit Gramm oder Kilogramm."],
      ["Ein Klassenzimmer ist eher 7 __ lang.", "Meter", ["Gramm", "Liter", "Sekunden"], "Große Längen misst man in Metern."],
    ];
    const [prompt, answer, wrong, support] = tasks[index % tasks.length];
    return item({
      prompt,
      answer,
      options: [answer, ...wrong],
      support,
      example: "Wähle die Einheit, die zur Sache passt.",
      imageCue: "Messwerkstatt mit Lineal, Waage und Uhr",
      scene: "Messen",
      challenge: "measurement-xl",
    });
  });

  return [
    collection("mehr-rechengeschichten-xl", "Rechengeschichten XL", "🧮", "bg-emerald-500", storyItems),
    collection("mehr-zahlenmuster-xl", "Zahlenmuster XL", "〰️", "bg-sky-500", sequenceItems),
    collection("mehr-stellenwert-xl", "Stellenwert XL", "🏛️", "bg-indigo-500", placeValueItems),
    collection("mehr-messwerkstatt-xl", "Messwerkstatt XL", "📏", "bg-amber-500", measureItems),
  ];
};

const livingFacts = [
  ["Frosch", "Teich und Ufer", "feuchte Haut", "Wasser und Verstecke"],
  ["Biene", "Blumenwiese", "Saugrüssel", "Blüten und Nektar"],
  ["Igel", "Laubhaufen", "Stacheln", "ruhige Ecken"],
  ["Ente", "Teich", "Schwimmfüße", "Wasser und Ufer"],
  ["Fuchs", "Waldrand", "feine Nase", "Verstecke und offene Flächen"],
  ["Schmetterling", "Blumen", "Flügel", "Sonne und Blüten"],
  ["Kaktus", "Wüste", "dicke Wasserspeicher", "trockene warme Orte"],
  ["Moos", "Schatten", "weiche Polster", "Feuchtigkeit"],
  ["Regenwurm", "Erde", "langer weicher Körper", "feuchte Erde"],
  ["Pinguin", "kalte Küste", "dichtes Gefieder", "Kälte und Meer"],
];

const worldSystems = [
  ["Regen", "Pfützen entstehen", "Wasser fällt aus Wolken"],
  ["Sonne", "Schatten werden sichtbar", "Licht wird blockiert"],
  ["Wind", "Blätter bewegen sich", "Luft ist in Bewegung"],
  ["Frost", "Wasser kann gefrieren", "Kälte verändert Wasser"],
  ["Frühling", "Knospen öffnen sich", "Pflanzen beginnen zu wachsen"],
  ["Herbst", "Blätter fallen", "Bäume bereiten sich auf Kälte vor"],
  ["Kompost", "Reste werden zu Erde", "kleine Lebewesen zersetzen Material"],
  ["Magnet", "Eisen wird angezogen", "bestimmte Metalle reagieren"],
];

const buildWorldPack = () => {
  const habitatItems = Array.from({ length: 180 }, (_, index) => {
    const [thing, habitat, feature, answer] = livingFacts[index % livingFacts.length];
    return item({
      prompt: `${thing}: Was passt zu seinem Lebensraum?`,
      answer,
      options: livingFacts.map((fact) => fact[3]),
      support: `${feature} passt zu ${habitat}.`,
      example: `${thing} braucht ${answer.toLowerCase()}.`,
      imageCue: `${thing} in ${habitat}`,
      scene: "Lebensraumkarten",
      challenge: "habitat-xl",
    });
  });

  const systemItems = Array.from({ length: 180 }, (_, index) => {
    const [phenomenon, answer, support] = worldSystems[index % worldSystems.length];
    return item({
      prompt: `Was passiert oft bei ${phenomenon}?`,
      answer,
      options: worldSystems.map((fact) => fact[1]),
      support,
      example: `${phenomenon}: ${answer}.`,
      imageCue: `${phenomenon} als Forscherbild`,
      scene: "Naturzusammenhänge",
      challenge: "world-system-xl",
    });
  });

  const experimentItems = Array.from({ length: 150 }, (_, index) => {
    const tasks = [
      ["Was prüfst du mit einer Lupe?", "kleine Details", "Eine Lupe macht Kleines größer."],
      ["Warum notieren Forscher Beobachtungen?", "damit sie vergleichen können", "Aufschreiben hilft beim genauen Denken."],
      ["Was ist bei einem Experiment wichtig?", "nur eine Sache verändern", "So sieht man, was wirkt."],
      ["Was zeigt ein Schatten?", "wo Licht blockiert wird", "Schatten braucht Licht und ein Hindernis."],
      ["Was ist Naturpflege?", "Lebewesen und Orte achtsam behandeln", "Forschen heißt nicht zerstören."],
    ];
    const [prompt, answer, support] = tasks[index % tasks.length];
    return item({
      prompt,
      answer,
      options: tasks.map((task) => task[1]),
      support,
      example: "Erst schauen, dann handeln.",
      imageCue: "Forscherwerkstatt mit Lupe und Notizkarte",
      scene: "Experiment",
      challenge: "experiment-xl",
    });
  });

  return [
    collection("mehr-lebensraum-xl", "Lebensraum XL", "🌍", "bg-emerald-500", habitatItems),
    collection("mehr-naturzusammenhang-xl", "Zusammenhänge", "🔗", "bg-sky-500", systemItems),
    collection("mehr-forscherwerkstatt-xl", "Forscherwerkstatt", "🔬", "bg-teal-500", experimentItems),
  ];
};

const heartSituations = [
  ["Ein Kind sagt Nein zum Mitmachen.", "die Grenze achten", "Ein Nein darf ruhig und klar bleiben."],
  ["Jemand wirkt traurig und still.", "sanft fragen, ob Hilfe gewünscht ist", "Trost braucht Erlaubnis."],
  ["Du bist wütend im Bauch.", "Abstand nehmen und atmen", "Gefühle dürfen da sein; Verletzen nicht."],
  ["Ein Fehler ist passiert.", "ehrlich sagen und beim Reparieren helfen", "Verantwortung macht wieder frei."],
  ["Zwei Kinder wollen dasselbe Material.", "abwechseln oder gemeinsam planen", "Fairness sieht beide Seiten."],
  ["Ein Geheimnis fühlt sich schwer an.", "mit einer sicheren erwachsenen Person sprechen", "Schwere Geheimnisse brauchen Hilfe."],
  ["Du brauchst eine Pause.", "Bescheid sagen und kurz ausruhen", "Pausen schützen Kraft."],
  ["Jemand wird ausgelacht.", "freundlich stoppen oder Hilfe holen", "Würde ist wichtiger als Mitlachen."],
  ["Du willst noch nicht erzählen.", "dein Tempo wählen", "Niemand muss alles sofort sagen."],
  ["Nach einem Streit ist es still.", "Zeit lassen und Wiedergutmachung suchen", "Reparieren geht Schritt für Schritt."],
];

const feelingClues = [
  ["Freude", "Es fühlt sich hell und warm an."],
  ["Mut", "Angst ist da, aber ein kleiner Schritt ist möglich."],
  ["Wut", "Der Körper zeigt: Eine Grenze ist berührt."],
  ["Trauer", "Etwas tut im Herzen weh."],
  ["Scham", "Man möchte sich verstecken."],
  ["Neugier", "Man möchte genauer wissen, was passiert."],
  ["Hoffnung", "Ein nächster guter Schritt wird sichtbar."],
  ["Erschöpfung", "Der Körper bittet um Pause."],
  ["Enttäuschung", "Etwas Erhofftes kam anders."],
  ["Dankbarkeit", "Etwas Gutes wird bemerkt."],
  ["Überforderung", "Es ist gerade zu viel auf einmal."],
  ["Vertrauen", "Man fühlt sich sicher genug."],
];

const buildEthikPack = () => {
  const situationItems = Array.from({ length: 220 }, (_, index) => {
    const [situation, answer, support] = heartSituations[index % heartSituations.length];
    const name = names[index % names.length];
    return item({
      prompt: `${name}: ${situation} Was hilft jetzt?`,
      answer,
      options: [...heartSituations.map((entry) => entry[1]), "drängen", "auslachen", "alles wegnehmen"],
      support,
      example: `${name} sucht einen sicheren nächsten Schritt.`,
      imageCue: "ruhiger Gesprächskreis",
      scene: "Miteinander",
      challenge: "heart-situation-xl",
    });
  });

  const feelingItems = Array.from({ length: 180 }, (_, index) => {
    const [feeling, clue] = feelingClues[index % feelingClues.length];
    const name = names[(index + 3) % names.length];
    return item({
      prompt: `${name} merkt: ${clue} Welches Wort passt?`,
      answer: feeling,
      options: feelingClues.map((entry) => entry[0]),
      support: "Gefühlswörter machen innen genauer.",
      example: `${name} sagt: Ich glaube, das ist ${feeling.toLowerCase()}.`,
      imageCue: `${feeling} als Gefühlskarte`,
      scene: "Gefühlswortschatz",
      challenge: "feeling-word-xl",
    });
  });

  const repairSentences = [
    "Stopp, ich möchte das nicht.",
    "Ich brauche kurz eine Pause.",
    "Kannst du mir bitte helfen?",
    "Ich höre dir zu.",
    "Es tut mir leid, ich mache es wieder gut.",
    "Ich möchte erst nachdenken.",
    "Ich freue mich für dich.",
    "Ich bin da, wenn du möchtest.",
    "Ich sage es einer sicheren erwachsenen Person.",
    "Wir können abwechseln.",
  ];

  const sentenceItems = Array.from({ length: 160 }, (_, index) => {
    const sentence = repairSentences[index % repairSentences.length];
    const [situation] = heartSituations[index % heartSituations.length];
    return item({
      prompt: `${situation} Welcher Satz ist klar und freundlich?`,
      answer: sentence,
      options: [sentence, "Ist mir egal.", "Du bist schuld.", "Alle sollen weggehen.", "Ich muss gewinnen."],
      support: "Klar, freundlich und sicher ist stärker als laut.",
      example: sentence,
      imageCue: "Satzkarte für Grenzen, Trost und Wiedergutmachung",
      scene: "Gute Sätze",
      challenge: "safe-sentence-xl",
    });
  });

  return [
    collection("mehr-herzsituationen-xl", "Herzsituationen XL", "🤝", "bg-emerald-500", situationItems),
    collection("mehr-gefuehle-xl", "Gefühle XL", "🧠", "bg-fuchsia-500", feelingItems),
    collection("mehr-gute-saetze-xl", "Gute Sätze XL", "💬", "bg-indigo-500", sentenceItems),
  ];
};

const instruments = [
  ["Klavier", "Tasten", "Finger drücken Tasten", "warm oder hell", "Tasteninstrument"],
  ["Trommel", "Fell", "Hände oder Schlägel schlagen", "rhythmisch", "Schlagwerk"],
  ["Flöte", "Luft", "Atem bringt Luft zum Schwingen", "luftig", "Holzbläser"],
  ["Geige", "Saiten", "ein Bogen streicht", "singend", "Streicher"],
  ["Gitarre", "Saiten", "Finger zupfen oder schlagen", "gezupft", "Saiteninstrument"],
  ["Glockenspiel", "Metallstäbe", "Schlägel treffen Metall", "glitzernd", "Schlagwerk"],
  ["Trompete", "Blech", "Luft schwingt im Mundstück", "strahlend", "Blechbläser"],
  ["Kalimba", "Metallzungen", "Daumen zupfen", "rund", "Zupfinstrument"],
  ["Xylophon", "Holzstäbe", "Schlägel treffen Holz", "trocken hell", "Schlagwerk"],
  ["Kontrabass", "lange Saiten", "große Saiten schwingen", "tief", "Streicher"],
];

const buildMusikPack = () => {
  const instrumentItems = Array.from({ length: 180 }, (_, index) => {
    const [name, feature, action, timbre, family] = instruments[index % instruments.length];
    return item({
      prompt: `${name}: Was passt zu diesem Instrument?`,
      answer: feature,
      options: instruments.map((entry) => entry[1]),
      support: `${action}.`,
      example: `${name} klingt oft ${timbre}.`,
      imageCue: `${name} Nahaufnahme`,
      scene: family,
      challenge: "instrument-feature-xl",
    });
  });

  const rhythmWords = ["klatsch", "stampf", "pause", "zisch", "kling", "klopf"];
  const rhythmItems = Array.from({ length: 180 }, (_, index) => {
    const a = rhythmWords[index % rhythmWords.length];
    const b = rhythmWords[(index + 2) % rhythmWords.length];
    const pattern = index % 3 === 0 ? `${a} ${b} ${a} ${b}` : index % 3 === 1 ? `${a} ${a} ${b}` : `${a} ${b} pause ${a}`;
    const answer = index % 3 === 0 ? "ABAB" : index % 3 === 1 ? "AAB" : "AB-Ruhe-A";
    return item({
      prompt: `Welches Muster passt zu: ${pattern}?`,
      answer,
      options: ["ABAB", "AAB", "ABB", "ABC", "AB-Ruhe-A", "AAAA"],
      support: "Gleiche Klänge bekommen denselben Buchstaben.",
      example: pattern,
      imageCue: "Rhythmuskarten",
      scene: "Rhythmus",
      challenge: "rhythm-xl",
    });
  });

  const listeningItems = Array.from({ length: 150 }, (_, index) => {
    const [name, , , timbre, family] = instruments[index % instruments.length];
    const mood = ["ruhig", "mutig", "leicht", "geheimnisvoll", "fröhlich", "traurig"][index % 6];
    return item({
      prompt: `Welche Klangfarbe passt zu ${mood} und ${timbre}?`,
      answer: name,
      options: instruments.map((entry) => entry[0]),
      support: `Achte auf Material, Spielweise und Tonhöhe.`,
      example: `${name} gehört zu: ${family}.`,
      imageCue: `${name} Klangbild`,
      scene: "Hörwortschatz",
      challenge: "listening-xl",
    });
  });

  return [
    collection("mehr-instrumentenbank-xl", "Instrumentenbank XL", "🎼", "bg-fuchsia-500", instrumentItems),
    collection("mehr-rhythmus-xl", "Rhythmus XL", "🥁", "bg-amber-500", rhythmItems),
    collection("mehr-hoeren-xl", "Hören XL", "👂", "bg-sky-500", listeningItems),
  ];
};

export const DEEP_LEARNING_PACK = {
  deutsch: buildDeutschPack(),
  mathe: buildMathePack(),
  sachunterricht: buildWorldPack(),
  ethik: buildEthikPack(),
  musik: buildMusikPack(),
};

export const getDeepLearningPack = (subject) => DEEP_LEARNING_PACK[subject] || [];

export const DEEP_LEARNING_PACK_STATS = Object.fromEntries(
  Object.entries(DEEP_LEARNING_PACK).map(([subject, collections]) => [
    subject,
    {
      collections: collections.length,
      items: collections.reduce((sum, entry) => sum + entry.items.length, 0),
    },
  ])
);
