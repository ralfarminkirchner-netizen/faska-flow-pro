//#region src/data/deepLearningContentPack.js
var unique = (items) => Array.from(new Set(items.map((item) => String(item ?? "").trim()).filter(Boolean)));
var rotateOptions = (answer, pool, seed, size = 4) => {
	const source = unique(pool);
	return unique([answer, ...Array.from({ length: size + 8 }, (_, offset) => source[(seed * 3 + offset) % source.length])]).slice(0, size);
};
var item = ({ prompt, answer, options, support, example, imageCue, scene, challenge }) => ({
	prompt,
	answer: String(answer),
	options: rotateOptions(answer, options, prompt.length + String(answer).length),
	support,
	example,
	imageCue,
	scene,
	challenge
});
var collection$1 = (id, label, icon, color, items) => ({
	id,
	label,
	icon,
	color,
	items
});
var names = [
	"Mira",
	"Noa",
	"Lio",
	"Ava",
	"Sam",
	"Lina",
	"Jona",
	"Emil",
	"Tara",
	"Mika",
	"Nuri",
	"Ella"
];
var places = [
	"im Garten",
	"am Fenster",
	"auf dem Teppich",
	"in der Küche",
	"an der Werkbank",
	"unter dem Baum",
	"neben der Brücke",
	"am Maltisch",
	"in der Leseecke",
	"auf dem Balkon"
];
var vocabulary = [
	[
		"Apfel",
		"Der",
		"Obst",
		"🍎",
		"rund",
		"wächst am Baum"
	],
	[
		"Banane",
		"Die",
		"Obst",
		"🍌",
		"gelb",
		"ist länglich und süß"
	],
	[
		"Birne",
		"Die",
		"Obst",
		"🍐",
		"weich",
		"hat einen Kern im Inneren"
	],
	[
		"Erdbeere",
		"Die",
		"Obst",
		"🍓",
		"rot",
		"wächst nahe am Boden"
	],
	[
		"Pflaume",
		"Die",
		"Obst",
		"🫐",
		"violett",
		"hat einen Stein in der Mitte"
	],
	[
		"Karotte",
		"Die",
		"Gemüse",
		"🥕",
		"knackig",
		"wächst in der Erde"
	],
	[
		"Gurke",
		"Die",
		"Gemüse",
		"🥒",
		"grün",
		"enthält viel Wasser"
	],
	[
		"Kartoffel",
		"Die",
		"Gemüse",
		"🥔",
		"erdig",
		"wird oft gekocht"
	],
	[
		"Tomate",
		"Die",
		"Gemüse",
		"🍅",
		"saftig",
		"hat kleine Kerne"
	],
	[
		"Paprika",
		"Die",
		"Gemüse",
		"🫑",
		"bunt",
		"kann rot, gelb oder grün sein"
	],
	[
		"Brot",
		"Das",
		"Essen",
		"🍞",
		"duftend",
		"wird aus Getreide gebacken"
	],
	[
		"Käse",
		"Der",
		"Essen",
		"🧀",
		"würzig",
		"wird aus Milch gemacht"
	],
	[
		"Wasser",
		"Das",
		"Essen",
		"💧",
		"klar",
		"löscht Durst"
	],
	[
		"Milch",
		"Die",
		"Essen",
		"🥛",
		"weiß",
		"kommt oft von der Kuh"
	],
	[
		"Suppe",
		"Die",
		"Essen",
		"🥣",
		"warm",
		"wird mit dem Löffel gegessen"
	],
	[
		"Teller",
		"Der",
		"Zuhause",
		"🍽️",
		"flach",
		"trägt das Essen"
	],
	[
		"Löffel",
		"Der",
		"Zuhause",
		"🥄",
		"rund",
		"hilft bei Suppe"
	],
	[
		"Gabel",
		"Die",
		"Zuhause",
		"🍴",
		"spitz",
		"hat Zinken"
	],
	[
		"Tasse",
		"Die",
		"Zuhause",
		"☕",
		"hohl",
		"hält ein Getränk"
	],
	[
		"Topf",
		"Der",
		"Zuhause",
		"🍲",
		"tief",
		"steht beim Kochen auf dem Herd"
	],
	[
		"Pfanne",
		"Die",
		"Zuhause",
		"🍳",
		"breit",
		"brät Essen"
	],
	[
		"Baum",
		"Der",
		"Natur",
		"🌳",
		"hoch",
		"hat Stamm und Krone"
	],
	[
		"Blatt",
		"Das",
		"Natur",
		"🍃",
		"leicht",
		"wächst an Pflanzen"
	],
	[
		"Blume",
		"Die",
		"Natur",
		"🌸",
		"bunt",
		"öffnet ihre Blüte"
	],
	[
		"Wurzel",
		"Die",
		"Natur",
		"🌱",
		"verborgen",
		"hält die Pflanze fest"
	],
	[
		"Samen",
		"Der",
		"Natur",
		"🌰",
		"klein",
		"kann zu einer Pflanze werden"
	],
	[
		"Stein",
		"Der",
		"Natur",
		"🪨",
		"hart",
		"liegt oft am Weg"
	],
	[
		"Muschel",
		"Die",
		"Natur",
		"🐚",
		"glatt",
		"kommt oft vom Strand"
	],
	[
		"Sand",
		"Der",
		"Natur",
		"🏖️",
		"körnig",
		"rieselt durch die Finger"
	],
	[
		"Bach",
		"Der",
		"Natur",
		"🏞️",
		"kühl",
		"fließt leise"
	],
	[
		"See",
		"Der",
		"Natur",
		"🌊",
		"weit",
		"sammelt viel Wasser"
	],
	[
		"Berg",
		"Der",
		"Natur",
		"⛰️",
		"hoch",
		"ragt in den Himmel"
	],
	[
		"Tal",
		"Das",
		"Natur",
		"🏞️",
		"tief",
		"liegt zwischen Bergen"
	],
	[
		"Wolke",
		"Die",
		"Himmel",
		"☁️",
		"weich",
		"schwebt am Himmel"
	],
	[
		"Sonne",
		"Die",
		"Himmel",
		"☀️",
		"hell",
		"gibt Licht und Wärme"
	],
	[
		"Mond",
		"Der",
		"Himmel",
		"🌙",
		"silbern",
		"scheint in der Nacht"
	],
	[
		"Stern",
		"Der",
		"Himmel",
		"⭐",
		"funkelnd",
		"leuchtet am Nachthimmel"
	],
	[
		"Regen",
		"Der",
		"Wetter",
		"🌧️",
		"nass",
		"fällt aus Wolken"
	],
	[
		"Schnee",
		"Der",
		"Wetter",
		"❄️",
		"kalt",
		"bedeckt den Boden weiß"
	],
	[
		"Wind",
		"Der",
		"Wetter",
		"🌬️",
		"unsichtbar",
		"bewegt Blätter"
	],
	[
		"Nebel",
		"Der",
		"Wetter",
		"🌫️",
		"grau",
		"macht die Sicht weich"
	],
	[
		"Regenbogen",
		"Der",
		"Himmel",
		"🌈",
		"bunt",
		"erscheint bei Sonne und Regen"
	],
	[
		"Hund",
		"Der",
		"Tiere",
		"🐶",
		"treu",
		"wedelt oft mit dem Schwanz"
	],
	[
		"Katze",
		"Die",
		"Tiere",
		"🐱",
		"leise",
		"schleicht auf Pfoten"
	],
	[
		"Hase",
		"Der",
		"Tiere",
		"🐇",
		"schnell",
		"hat lange Ohren"
	],
	[
		"Fuchs",
		"Der",
		"Tiere",
		"🦊",
		"wachsam",
		"hat eine feine Nase"
	],
	[
		"Reh",
		"Das",
		"Tiere",
		"🦌",
		"scheu",
		"lebt gern am Waldrand"
	],
	[
		"Igel",
		"Der",
		"Tiere",
		"🦔",
		"stachelig",
		"rollt sich zum Schutz ein"
	],
	[
		"Vogel",
		"Der",
		"Tiere",
		"🐦",
		"leicht",
		"kann fliegen"
	],
	[
		"Ente",
		"Die",
		"Tiere",
		"🦆",
		"schwimmend",
		"lebt gern am Wasser"
	],
	[
		"Frosch",
		"Der",
		"Tiere",
		"🐸",
		"feucht",
		"springt am Teich"
	],
	[
		"Fisch",
		"Der",
		"Tiere",
		"🐟",
		"glitschig",
		"atmet unter Wasser"
	],
	[
		"Biene",
		"Die",
		"Tiere",
		"🐝",
		"fleißig",
		"sammelt Nektar"
	],
	[
		"Ameise",
		"Die",
		"Tiere",
		"🐜",
		"stark",
		"trägt kleine Stücke"
	],
	[
		"Schmetterling",
		"Der",
		"Tiere",
		"🦋",
		"zart",
		"hat bunte Flügel"
	],
	[
		"Schnecke",
		"Die",
		"Tiere",
		"🐌",
		"langsam",
		"trägt ein Haus"
	],
	[
		"Pferd",
		"Das",
		"Tiere",
		"🐴",
		"kräftig",
		"läuft auf Hufen"
	],
	[
		"Kuh",
		"Die",
		"Tiere",
		"🐄",
		"ruhig",
		"frisst Gras"
	],
	[
		"Ziege",
		"Die",
		"Tiere",
		"🐐",
		"neugierig",
		"klettert gern"
	],
	[
		"Elefant",
		"Der",
		"Tiere",
		"🐘",
		"groß",
		"hat einen Rüssel"
	],
	[
		"Pinguin",
		"Der",
		"Tiere",
		"🐧",
		"watschelnd",
		"lebt in kalten Gegenden"
	],
	[
		"Hand",
		"Die",
		"Körper",
		"✋",
		"geschickt",
		"kann greifen"
	],
	[
		"Fuß",
		"Der",
		"Körper",
		"🦶",
		"tragend",
		"hilft beim Gehen"
	],
	[
		"Auge",
		"Das",
		"Körper",
		"👁️",
		"wach",
		"nimmt Licht wahr"
	],
	[
		"Ohr",
		"Das",
		"Körper",
		"👂",
		"aufmerksam",
		"hört Geräusche"
	],
	[
		"Nase",
		"Die",
		"Körper",
		"👃",
		"fein",
		"riecht Düfte"
	],
	[
		"Mund",
		"Der",
		"Körper",
		"👄",
		"beweglich",
		"spricht und isst"
	],
	[
		"Zahn",
		"Der",
		"Körper",
		"🦷",
		"fest",
		"zerkleinert Essen"
	],
	[
		"Herz",
		"Das",
		"Körper",
		"💛",
		"lebendig",
		"schlägt in der Brust"
	],
	[
		"Bauch",
		"Der",
		"Körper",
		"🫶",
		"weich",
		"meldet Hunger oder Ruhe"
	],
	[
		"Rücken",
		"Der",
		"Körper",
		"🧍",
		"stark",
		"hält den Körper aufrecht"
	],
	[
		"Freude",
		"Die",
		"Gefühle",
		"😊",
		"hell",
		"macht das Gesicht weich"
	],
	[
		"Mut",
		"Der",
		"Gefühle",
		"🦁",
		"stark",
		"hilft trotz Angst"
	],
	[
		"Angst",
		"Die",
		"Gefühle",
		"😟",
		"wachsam",
		"will schützen"
	],
	[
		"Wut",
		"Die",
		"Gefühle",
		"😠",
		"heiß",
		"zeigt eine Grenze"
	],
	[
		"Trauer",
		"Die",
		"Gefühle",
		"🌧️",
		"schwer",
		"braucht Trost"
	],
	[
		"Ruhe",
		"Die",
		"Gefühle",
		"🕯️",
		"still",
		"gibt dem Körper Pause"
	],
	[
		"Hoffnung",
		"Die",
		"Gefühle",
		"🌱",
		"klein",
		"zeigt einen nächsten Schritt"
	],
	[
		"Scham",
		"Die",
		"Gefühle",
		"🫣",
		"leise",
		"möchte sich verstecken"
	],
	[
		"Stolz",
		"Der",
		"Gefühle",
		"🏅",
		"aufrecht",
		"kommt nach echter Mühe"
	],
	[
		"Neugier",
		"Die",
		"Gefühle",
		"🔎",
		"wach",
		"möchte etwas entdecken"
	],
	[
		"Buch",
		"Das",
		"Lernen",
		"📖",
		"spannend",
		"erzählt mit Seiten"
	],
	[
		"Heft",
		"Das",
		"Lernen",
		"📓",
		"geordnet",
		"sammelt Gedanken"
	],
	[
		"Stift",
		"Der",
		"Lernen",
		"✏️",
		"spitz",
		"macht Zeichen"
	],
	[
		"Pinsel",
		"Der",
		"Lernen",
		"🖌️",
		"weich",
		"trägt Farbe"
	],
	[
		"Schere",
		"Die",
		"Lernen",
		"✂️",
		"scharf",
		"schneidet Papier"
	],
	[
		"Kleber",
		"Der",
		"Lernen",
		"🧴",
		"klebrig",
		"verbindet Papier"
	],
	[
		"Lineal",
		"Das",
		"Lernen",
		"📏",
		"gerade",
		"misst Längen"
	],
	[
		"Ranzen",
		"Der",
		"Lernen",
		"🎒",
		"tragbar",
		"nimmt Hefte mit"
	],
	[
		"Tafel",
		"Die",
		"Lernen",
		"🧑‍🏫",
		"groß",
		"zeigt Zeichen für alle"
	],
	[
		"Karte",
		"Die",
		"Lernen",
		"🗺️",
		"hilfreich",
		"zeigt Orte und Wege"
	],
	[
		"Würfel",
		"Der",
		"Lernen",
		"🎲",
		"eckig",
		"hat sechs Flächen"
	],
	[
		"Perle",
		"Die",
		"Lernen",
		"🟡",
		"zählbar",
		"hilft beim Rechnen"
	],
	[
		"Jacke",
		"Die",
		"Kleidung",
		"🧥",
		"warm",
		"schützt den Oberkörper"
	],
	[
		"Mütze",
		"Die",
		"Kleidung",
		"🧢",
		"wärmend",
		"schützt den Kopf"
	],
	[
		"Schuh",
		"Der",
		"Kleidung",
		"👟",
		"fest",
		"schützt den Fuß"
	],
	[
		"Schal",
		"Der",
		"Kleidung",
		"🧣",
		"weich",
		"wärmt den Hals"
	],
	[
		"Hose",
		"Die",
		"Kleidung",
		"👖",
		"praktisch",
		"bedeckt die Beine"
	],
	[
		"Kleid",
		"Das",
		"Kleidung",
		"👗",
		"leicht",
		"ist ein Kleidungsstück"
	],
	[
		"Haus",
		"Das",
		"Orte",
		"🏠",
		"sicher",
		"hat Räume und Dach"
	],
	[
		"Garten",
		"Der",
		"Orte",
		"🌿",
		"grün",
		"hat Pflanzen und Wege"
	],
	[
		"Brücke",
		"Die",
		"Orte",
		"🌉",
		"verbindend",
		"führt über etwas"
	],
	[
		"Straße",
		"Die",
		"Orte",
		"🛣️",
		"lang",
		"führt von Ort zu Ort"
	],
	[
		"Schule",
		"Die",
		"Orte",
		"🏫",
		"lebendig",
		"ist ein Lernort"
	],
	[
		"Küche",
		"Die",
		"Orte",
		"🍳",
		"warm",
		"ist ein Ort zum Kochen"
	],
	[
		"Zimmer",
		"Das",
		"Orte",
		"🛏️",
		"ruhig",
		"ist ein Raum im Haus"
	],
	[
		"Fenster",
		"Das",
		"Orte",
		"🪟",
		"durchsichtig",
		"lässt Licht herein"
	],
	[
		"Tür",
		"Die",
		"Orte",
		"🚪",
		"beweglich",
		"öffnet und schließt Räume"
	],
	[
		"Trommel",
		"Die",
		"Musik",
		"🥁",
		"rhythmisch",
		"klingt beim Schlagen"
	],
	[
		"Flöte",
		"Die",
		"Musik",
		"🪈",
		"luftig",
		"klingt durch Atem"
	],
	[
		"Geige",
		"Die",
		"Musik",
		"🎻",
		"singend",
		"hat Saiten und Bogen"
	],
	[
		"Gitarre",
		"Die",
		"Musik",
		"🎸",
		"gezupft",
		"hat Saiten"
	],
	[
		"Klavier",
		"Das",
		"Musik",
		"🎹",
		"tastend",
		"hat weiße und schwarze Tasten"
	],
	[
		"Glocke",
		"Die",
		"Musik",
		"🔔",
		"hell",
		"klingt beim Anschlagen"
	],
	[
		"Rassel",
		"Die",
		"Musik",
		"🪇",
		"raschelnd",
		"klingt beim Schütteln"
	],
	[
		"Hammer",
		"Der",
		"Werkzeug",
		"🔨",
		"schwer",
		"schlägt Nägel"
	],
	[
		"Säge",
		"Die",
		"Werkzeug",
		"🪚",
		"gezackt",
		"schneidet Holz"
	],
	[
		"Lupe",
		"Die",
		"Werkzeug",
		"🔍",
		"vergrößernd",
		"macht Kleines groß"
	],
	[
		"Kompass",
		"Der",
		"Werkzeug",
		"🧭",
		"richtend",
		"zeigt Himmelsrichtungen"
	],
	[
		"Uhr",
		"Die",
		"Werkzeug",
		"🕰️",
		"genau",
		"zeigt die Zeit"
	],
	[
		"Lampe",
		"Die",
		"Werkzeug",
		"💡",
		"leuchtend",
		"macht es hell"
	],
	[
		"Schlüssel",
		"Der",
		"Werkzeug",
		"🔑",
		"passend",
		"öffnet ein Schloss"
	],
	[
		"Seil",
		"Das",
		"Werkzeug",
		"🪢",
		"lang",
		"kann Dinge verbinden"
	]
].map(([word, article, category, icon, adjective, detail], index) => ({
	id: `word-${index}`,
	word,
	article,
	category,
	icon,
	adjective,
	detail
}));
var categories = unique(vocabulary.map((entry) => entry.category));
var adjectives = unique(vocabulary.map((entry) => entry.adjective));
var details = unique(vocabulary.map((entry) => entry.detail));
var buildDeutschPack = () => {
	const articleItems = vocabulary.map((entry) => item({
		prompt: `Welcher Artikel passt zu ${entry.icon} ${entry.word}?`,
		answer: `${entry.article} ${entry.word}`,
		options: [
			"Der",
			"Die",
			"Das"
		].map((article) => `${article} ${entry.word}`),
		support: `Artikelprobe: ${entry.article.toLowerCase()} ${entry.word}.`,
		example: `${entry.article} ${entry.word} ist ${entry.adjective}.`,
		imageCue: `${entry.word} als klare Bildkarte`,
		scene: "Artikelkarten",
		challenge: "article-vocabulary"
	}));
	const categoryItems = vocabulary.map((entry, index) => item({
		prompt: `${entry.icon} In welches Wortschatz-Regal gehört ${entry.word}?`,
		answer: entry.category,
		options: rotateOptions(entry.category, categories, index + 2, 4),
		support: `${entry.word} gehört zu: ${entry.category}.`,
		example: `${entry.article} ${entry.word} liegt im ${entry.category}-Regal.`,
		imageCue: `${entry.category}-Regal mit ${entry.word}`,
		scene: "Wortschatzregal",
		challenge: "semantic-category"
	}));
	const adjectiveItems = vocabulary.map((entry, index) => item({
		prompt: `Welches Eigenschaftswort passt zu ${entry.icon} ${entry.word}?`,
		answer: entry.adjective,
		options: rotateOptions(entry.adjective, adjectives, index + 4, 4),
		support: `Beschreibe ${entry.article.toLowerCase()} ${entry.word}: ${entry.adjective}.`,
		example: `${entry.article} ${entry.word} ist ${entry.adjective}.`,
		imageCue: `${entry.word}, ${entry.adjective}`,
		scene: "Adjektivkarten",
		challenge: "adjective-vocabulary"
	}));
	const meaningItems = vocabulary.map((entry, index) => item({
		prompt: `Was passt zu ${entry.icon} ${entry.word}?`,
		answer: entry.detail,
		options: rotateOptions(entry.detail, details, index + 6, 4),
		support: `Suche die Bedeutung, nicht nur den Klang.`,
		example: `${entry.article} ${entry.word} ${entry.detail}.`,
		imageCue: `${entry.word} in einer echten Situation`,
		scene: "Bedeutungsnetz",
		challenge: "meaning-network"
	}));
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
				`${entry.adjective} ist ${place} ${entry.article.toLowerCase()}.`
			],
			support: `Ein guter Satz hat einen klaren Gegenstand und eine passende Aussage.`,
			example: correct,
			imageCue: `${entry.word} ${place}`,
			scene: "Satzstreifen",
			challenge: "sentence-sense"
		});
	});
	return [
		collection$1("mehr-artikelbank", "Artikelbank XL", "📚", "bg-emerald-500", articleItems),
		collection$1("mehr-wortregale", "Wortregale XL", "🧺", "bg-cyan-500", categoryItems),
		collection$1("mehr-adjektivgarten", "Adjektivgarten", "🌼", "bg-amber-500", adjectiveItems),
		collection$1("mehr-bedeutungsnetz", "Bedeutungsnetz", "🕸️", "bg-indigo-500", meaningItems),
		collection$1("mehr-satzgarten", "Satzgarten", "📝", "bg-rose-500", sentenceItems)
	];
};
var numberObjects = vocabulary.slice(0, 42).map((entry) => entry.word.toLowerCase());
var buildMathePack = () => {
	const storyItems = Array.from({ length: 260 }, (_, index) => {
		const a = 3 + index % 24;
		const b = 2 + index * 7 % 15;
		const plus = index % 3 !== 0;
		const object = numberObjects[index % numberObjects.length];
		const answer = plus ? a + b : a + b - b;
		return item({
			prompt: plus ? `${names[index % names.length]} hat ${a} ${object}. ${b} kommen dazu. Wie viele sind es?` : `${names[index % names.length]} hat ${a + b} ${object}. ${b} werden weggelegt. Wie viele bleiben?`,
			answer,
			options: [
				answer,
				answer - 2,
				answer - 1,
				answer + 1,
				answer + 2,
				a + b
			].filter((value) => value >= 0),
			support: plus ? "Dazu bedeutet: die Menge wächst." : "Weglegen bedeutet: die Menge wird kleiner.",
			example: plus ? `${a} + ${b} = ${answer}` : `${a + b} - ${b} = ${answer}`,
			imageCue: `${object} als Rechenmaterial`,
			scene: "Rechengeschichte",
			challenge: "word-problem-xl"
		});
	});
	const sequenceItems = Array.from({ length: 210 }, (_, index) => {
		const step = [
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			25,
			50
		][index % 11];
		const start = index % 18 * (index % 4 === 0 ? 5 : 1);
		const missing = 1 + index % 4;
		const row = Array.from({ length: 6 }, (_, pos) => start + pos * step);
		const answer = row[missing];
		return item({
			prompt: `Welche Zahl fehlt? ${row.map((value, pos) => pos === missing ? "__" : value).join(" · ")}`,
			answer,
			options: [
				answer,
				answer - step,
				answer + step,
				answer + 1,
				answer - 1,
				start + step
			],
			support: `Die Reihe springt immer um ${step}.`,
			example: row.join(" · "),
			imageCue: `Zahlenkette mit ${step}er-Schritten`,
			scene: "Zahlenmuster",
			challenge: "sequence-xl"
		});
	});
	const placeValueItems = Array.from({ length: 160 }, (_, index) => {
		const hundreds = 1 + index % 8;
		const tens = index * 3 % 10;
		const ones = index * 7 % 10;
		const answer = hundreds * 100 + tens * 10 + ones;
		return item({
			prompt: `${hundreds} Hunderter, ${tens} Zehner und ${ones} Einer ergeben welche Zahl?`,
			answer,
			options: [
				answer,
				hundreds * 100 + ones * 10 + tens,
				tens * 100 + hundreds * 10 + ones,
				answer + 10,
				answer - 1
			],
			support: "Hunderter, Zehner und Einer stehen an festen Stellen.",
			example: `${hundreds}00 + ${tens}0 + ${ones} = ${answer}`,
			imageCue: "goldenes Perlenmaterial mit Stellenwert",
			scene: "Stellenwert",
			challenge: "place-value-xl"
		});
	});
	const measureItems = Array.from({ length: 120 }, (_, index) => {
		const tasks = [
			[
				"Ein Bleistift ist etwa 12 __ lang.",
				"Zentimeter",
				[
					"Liter",
					"Kilogramm",
					"Stunden"
				],
				"Länge misst man mit Zentimeter oder Meter."
			],
			[
				"Eine Trinkflasche fasst eher 1 __.",
				"Liter",
				[
					"Meter",
					"Gramm",
					"Uhr"
				],
				"Flüssigkeit misst man oft in Litern."
			],
			[
				"Ein Schulweg dauert vielleicht 15 __.",
				"Minuten",
				[
					"Zentimeter",
					"Kilogramm",
					"Liter"
				],
				"Zeit misst man mit Minuten und Stunden."
			],
			[
				"Ein Apfel wiegt eher 150 __.",
				"Gramm",
				[
					"Meter",
					"Liter",
					"Minuten"
				],
				"Gewicht misst man mit Gramm oder Kilogramm."
			],
			[
				"Ein Klassenzimmer ist eher 7 __ lang.",
				"Meter",
				[
					"Gramm",
					"Liter",
					"Sekunden"
				],
				"Große Längen misst man in Metern."
			]
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
			challenge: "measurement-xl"
		});
	});
	return [
		collection$1("mehr-rechengeschichten-xl", "Rechengeschichten XL", "🧮", "bg-emerald-500", storyItems),
		collection$1("mehr-zahlenmuster-xl", "Zahlenmuster XL", "〰️", "bg-sky-500", sequenceItems),
		collection$1("mehr-stellenwert-xl", "Stellenwert XL", "🏛️", "bg-indigo-500", placeValueItems),
		collection$1("mehr-messwerkstatt-xl", "Messwerkstatt XL", "📏", "bg-amber-500", measureItems)
	];
};
var livingFacts = [
	[
		"Frosch",
		"Teich und Ufer",
		"feuchte Haut",
		"Wasser und Verstecke"
	],
	[
		"Biene",
		"Blumenwiese",
		"Saugrüssel",
		"Blüten und Nektar"
	],
	[
		"Igel",
		"Laubhaufen",
		"Stacheln",
		"ruhige Ecken"
	],
	[
		"Ente",
		"Teich",
		"Schwimmfüße",
		"Wasser und Ufer"
	],
	[
		"Fuchs",
		"Waldrand",
		"feine Nase",
		"Verstecke und offene Flächen"
	],
	[
		"Schmetterling",
		"Blumen",
		"Flügel",
		"Sonne und Blüten"
	],
	[
		"Kaktus",
		"Wüste",
		"dicke Wasserspeicher",
		"trockene warme Orte"
	],
	[
		"Moos",
		"Schatten",
		"weiche Polster",
		"Feuchtigkeit"
	],
	[
		"Regenwurm",
		"Erde",
		"langer weicher Körper",
		"feuchte Erde"
	],
	[
		"Pinguin",
		"kalte Küste",
		"dichtes Gefieder",
		"Kälte und Meer"
	]
];
var worldSystems = [
	[
		"Regen",
		"Pfützen entstehen",
		"Wasser fällt aus Wolken"
	],
	[
		"Sonne",
		"Schatten werden sichtbar",
		"Licht wird blockiert"
	],
	[
		"Wind",
		"Blätter bewegen sich",
		"Luft ist in Bewegung"
	],
	[
		"Frost",
		"Wasser kann gefrieren",
		"Kälte verändert Wasser"
	],
	[
		"Frühling",
		"Knospen öffnen sich",
		"Pflanzen beginnen zu wachsen"
	],
	[
		"Herbst",
		"Blätter fallen",
		"Bäume bereiten sich auf Kälte vor"
	],
	[
		"Kompost",
		"Reste werden zu Erde",
		"kleine Lebewesen zersetzen Material"
	],
	[
		"Magnet",
		"Eisen wird angezogen",
		"bestimmte Metalle reagieren"
	]
];
var buildWorldPack = () => {
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
			challenge: "habitat-xl"
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
			challenge: "world-system-xl"
		});
	});
	const experimentItems = Array.from({ length: 150 }, (_, index) => {
		const tasks = [
			[
				"Was prüfst du mit einer Lupe?",
				"kleine Details",
				"Eine Lupe macht Kleines größer."
			],
			[
				"Warum notieren Forscher Beobachtungen?",
				"damit sie vergleichen können",
				"Aufschreiben hilft beim genauen Denken."
			],
			[
				"Was ist bei einem Experiment wichtig?",
				"nur eine Sache verändern",
				"So sieht man, was wirkt."
			],
			[
				"Was zeigt ein Schatten?",
				"wo Licht blockiert wird",
				"Schatten braucht Licht und ein Hindernis."
			],
			[
				"Was ist Naturpflege?",
				"Lebewesen und Orte achtsam behandeln",
				"Forschen heißt nicht zerstören."
			]
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
			challenge: "experiment-xl"
		});
	});
	return [
		collection$1("mehr-lebensraum-xl", "Lebensraum XL", "🌍", "bg-emerald-500", habitatItems),
		collection$1("mehr-naturzusammenhang-xl", "Zusammenhänge", "🔗", "bg-sky-500", systemItems),
		collection$1("mehr-forscherwerkstatt-xl", "Forscherwerkstatt", "🔬", "bg-teal-500", experimentItems)
	];
};
var heartSituations = [
	[
		"Ein Kind sagt Nein zum Mitmachen.",
		"die Grenze achten",
		"Ein Nein darf ruhig und klar bleiben."
	],
	[
		"Jemand wirkt traurig und still.",
		"sanft fragen, ob Hilfe gewünscht ist",
		"Trost braucht Erlaubnis."
	],
	[
		"Du bist wütend im Bauch.",
		"Abstand nehmen und atmen",
		"Gefühle dürfen da sein; Verletzen nicht."
	],
	[
		"Ein Fehler ist passiert.",
		"ehrlich sagen und beim Reparieren helfen",
		"Verantwortung macht wieder frei."
	],
	[
		"Zwei Kinder wollen dasselbe Material.",
		"abwechseln oder gemeinsam planen",
		"Fairness sieht beide Seiten."
	],
	[
		"Ein Geheimnis fühlt sich schwer an.",
		"mit einer sicheren erwachsenen Person sprechen",
		"Schwere Geheimnisse brauchen Hilfe."
	],
	[
		"Du brauchst eine Pause.",
		"Bescheid sagen und kurz ausruhen",
		"Pausen schützen Kraft."
	],
	[
		"Jemand wird ausgelacht.",
		"freundlich stoppen oder Hilfe holen",
		"Würde ist wichtiger als Mitlachen."
	],
	[
		"Du willst noch nicht erzählen.",
		"dein Tempo wählen",
		"Niemand muss alles sofort sagen."
	],
	[
		"Nach einem Streit ist es still.",
		"Zeit lassen und Wiedergutmachung suchen",
		"Reparieren geht Schritt für Schritt."
	]
];
var feelingClues = [
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
	["Vertrauen", "Man fühlt sich sicher genug."]
];
var buildEthikPack = () => {
	const situationItems = Array.from({ length: 220 }, (_, index) => {
		const [situation, answer, support] = heartSituations[index % heartSituations.length];
		const name = names[index % names.length];
		return item({
			prompt: `${name}: ${situation} Was hilft jetzt?`,
			answer,
			options: [
				...heartSituations.map((entry) => entry[1]),
				"drängen",
				"auslachen",
				"alles wegnehmen"
			],
			support,
			example: `${name} sucht einen sicheren nächsten Schritt.`,
			imageCue: "ruhiger Gesprächskreis",
			scene: "Miteinander",
			challenge: "heart-situation-xl"
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
			challenge: "feeling-word-xl"
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
		"Wir können abwechseln."
	];
	const sentenceItems = Array.from({ length: 160 }, (_, index) => {
		const sentence = repairSentences[index % repairSentences.length];
		const [situation] = heartSituations[index % heartSituations.length];
		return item({
			prompt: `${situation} Welcher Satz ist klar und freundlich?`,
			answer: sentence,
			options: [
				sentence,
				"Ist mir egal.",
				"Du bist schuld.",
				"Alle sollen weggehen.",
				"Ich muss gewinnen."
			],
			support: "Klar, freundlich und sicher ist stärker als laut.",
			example: sentence,
			imageCue: "Satzkarte für Grenzen, Trost und Wiedergutmachung",
			scene: "Gute Sätze",
			challenge: "safe-sentence-xl"
		});
	});
	return [
		collection$1("mehr-herzsituationen-xl", "Herzsituationen XL", "🤝", "bg-emerald-500", situationItems),
		collection$1("mehr-gefuehle-xl", "Gefühle XL", "🧠", "bg-fuchsia-500", feelingItems),
		collection$1("mehr-gute-saetze-xl", "Gute Sätze XL", "💬", "bg-indigo-500", sentenceItems)
	];
};
var instruments = [
	[
		"Klavier",
		"Tasten",
		"Finger drücken Tasten",
		"warm oder hell",
		"Tasteninstrument"
	],
	[
		"Trommel",
		"Fell",
		"Hände oder Schlägel schlagen",
		"rhythmisch",
		"Schlagwerk"
	],
	[
		"Flöte",
		"Luft",
		"Atem bringt Luft zum Schwingen",
		"luftig",
		"Holzbläser"
	],
	[
		"Geige",
		"Saiten",
		"ein Bogen streicht",
		"singend",
		"Streicher"
	],
	[
		"Gitarre",
		"Saiten",
		"Finger zupfen oder schlagen",
		"gezupft",
		"Saiteninstrument"
	],
	[
		"Glockenspiel",
		"Metallstäbe",
		"Schlägel treffen Metall",
		"glitzernd",
		"Schlagwerk"
	],
	[
		"Trompete",
		"Blech",
		"Luft schwingt im Mundstück",
		"strahlend",
		"Blechbläser"
	],
	[
		"Kalimba",
		"Metallzungen",
		"Daumen zupfen",
		"rund",
		"Zupfinstrument"
	],
	[
		"Xylophon",
		"Holzstäbe",
		"Schlägel treffen Holz",
		"trocken hell",
		"Schlagwerk"
	],
	[
		"Kontrabass",
		"lange Saiten",
		"große Saiten schwingen",
		"tief",
		"Streicher"
	]
];
var buildMusikPack = () => {
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
			challenge: "instrument-feature-xl"
		});
	});
	const rhythmWords = [
		"klatsch",
		"stampf",
		"pause",
		"zisch",
		"kling",
		"klopf"
	];
	const rhythmItems = Array.from({ length: 180 }, (_, index) => {
		const a = rhythmWords[index % rhythmWords.length];
		const b = rhythmWords[(index + 2) % rhythmWords.length];
		const pattern = index % 3 === 0 ? `${a} ${b} ${a} ${b}` : index % 3 === 1 ? `${a} ${a} ${b}` : `${a} ${b} pause ${a}`;
		const answer = index % 3 === 0 ? "ABAB" : index % 3 === 1 ? "AAB" : "AB-Ruhe-A";
		return item({
			prompt: `Welches Muster passt zu: ${pattern}?`,
			answer,
			options: [
				"ABAB",
				"AAB",
				"ABB",
				"ABC",
				"AB-Ruhe-A",
				"AAAA"
			],
			support: "Gleiche Klänge bekommen denselben Buchstaben.",
			example: pattern,
			imageCue: "Rhythmuskarten",
			scene: "Rhythmus",
			challenge: "rhythm-xl"
		});
	});
	const listeningItems = Array.from({ length: 150 }, (_, index) => {
		const [name, , , timbre, family] = instruments[index % instruments.length];
		const mood = [
			"ruhig",
			"mutig",
			"leicht",
			"geheimnisvoll",
			"fröhlich",
			"traurig"
		][index % 6];
		return item({
			prompt: `Welche Klangfarbe passt zu ${mood} und ${timbre}?`,
			answer: name,
			options: instruments.map((entry) => entry[0]),
			support: `Achte auf Material, Spielweise und Tonhöhe.`,
			example: `${name} gehört zu: ${family}.`,
			imageCue: `${name} Klangbild`,
			scene: "Hörwortschatz",
			challenge: "listening-xl"
		});
	});
	return [
		collection$1("mehr-instrumentenbank-xl", "Instrumentenbank XL", "🎼", "bg-fuchsia-500", instrumentItems),
		collection$1("mehr-rhythmus-xl", "Rhythmus XL", "🥁", "bg-amber-500", rhythmItems),
		collection$1("mehr-hoeren-xl", "Hören XL", "👂", "bg-sky-500", listeningItems)
	];
};
var DEEP_LEARNING_PACK = {
	deutsch: buildDeutschPack(),
	mathe: buildMathePack(),
	sachunterricht: buildWorldPack(),
	ethik: buildEthikPack(),
	musik: buildMusikPack()
};
var getDeepLearningPack = (subject) => DEEP_LEARNING_PACK[subject] || [];
Object.fromEntries(Object.entries(DEEP_LEARNING_PACK).map(([subject, collections]) => [subject, {
	collections: collections.length,
	items: collections.reduce((sum, entry) => sum + entry.items.length, 0)
}]));
//#endregion
//#region src/data/premiumGameContent.js
var makeItem = ({ prompt, answer, options, support, imageCue, scene, challenge }) => ({
	prompt,
	answer,
	options,
	support,
	imageCue,
	scene,
	challenge
});
var PREMIUM_GAME_CONTENT$1 = {
	deutsch: [
		makeItem({
			prompt: "Welcher Artikel passt zu dem Wort 'Apfel'?",
			answer: "der",
			options: [
				"der",
				"die",
				"das",
				"den"
			],
			support: "Sprich langsam: der Apfel. Viele Obstsorten haben unterschiedliche Artikel.",
			imageCue: "Ein roter Apfel liegt auf einem kleinen Holzteller.",
			scene: "Sprachregal mit Artikelkarten",
			challenge: "article-choice"
		}),
		makeItem({
			prompt: "Welches Wort reimt sich auf 'Haus'?",
			answer: "Maus",
			options: [
				"Maus",
				"Tasse",
				"Blume",
				"Garten"
			],
			support: "Ein Reim klingt am Ende gleich oder sehr ähnlich.",
			imageCue: "Ein kleines Haus und eine Maus daneben.",
			scene: "Reimkreis auf dem Teppich",
			challenge: "rhyme-match"
		}),
		makeItem({
			prompt: "Setze den Satz richtig zusammen: 'liest / ein / Mira / Buch'",
			answer: "Mira liest ein Buch",
			options: [
				"Mira liest ein Buch",
				"Ein liest Mira Buch",
				"Buch liest ein Mira",
				"Liest Mira Buch ein"
			],
			support: "Wer tut etwas? Mira. Was tut sie? Sie liest.",
			imageCue: "Ein Kind sitzt mit einem Buch in einer ruhigen Leseecke.",
			scene: "Satzbau mit Wortstreifen",
			challenge: "sentence-order"
		}),
		makeItem({
			prompt: "Welche Silben hörst du in 'Banane'?",
			answer: "Ba-na-ne",
			options: [
				"Ba-na-ne",
				"Ban-ane",
				"Ba-nan-e",
				"Bana-ne"
			],
			support: "Klatsche das Wort langsam: Ba - na - ne.",
			imageCue: "Drei gelbe Silbensteine neben einer Banane.",
			scene: "Silbenklatschen am Arbeitsteppich",
			challenge: "syllable-split"
		}),
		makeItem({
			prompt: "Welches Wort ist ein Verb?",
			answer: "laufen",
			options: [
				"laufen",
				"Blume",
				"weich",
				"unter"
			],
			support: "Ein Verb sagt, was jemand tut oder was geschieht.",
			imageCue: "Ein Kind läuft vorsichtig um bunte Kegel.",
			scene: "Wortarten-Material mit Bewegungskarten",
			challenge: "word-class"
		}),
		makeItem({
			prompt: "Welches Wort beginnt mit dem Laut 'Sch'?",
			answer: "Schere",
			options: [
				"Schere",
				"Sonne",
				"Tisch",
				"Rose"
			],
			support: "Lege die Hand vor den Mund und sprich: Sch.",
			imageCue: "Eine Kinderschere liegt neben Papierstreifen.",
			scene: "Anlaut-Schublade",
			challenge: "initial-sound"
		}),
		makeItem({
			prompt: "Welche Beschreibung passt zu 'Feder'?",
			answer: "leicht",
			options: [
				"leicht",
				"laut",
				"eckig",
				"scharf"
			],
			support: "Fühle in Gedanken: Eine Feder wiegt fast nichts.",
			imageCue: "Eine helle Feder schwebt über einer Hand.",
			scene: "Adjektiv-Tisch mit Sinnesmaterial",
			challenge: "adjective-choice"
		}),
		makeItem({
			prompt: "Was ist das Gegenteil von 'früh'?",
			answer: "spät",
			options: [
				"spät",
				"hell",
				"weich",
				"nah"
			],
			support: "Gegenteile stehen sich wie zwei Enden einer Linie gegenüber.",
			imageCue: "Zwei Uhren zeigen Morgen und Abend.",
			scene: "Gegensatz-Leiste",
			challenge: "antonym-match"
		}),
		makeItem({
			prompt: "Welches Wort passt in den Satz: 'Der Vogel ___ im Baum.'",
			answer: "singt",
			options: [
				"singt",
				"trinkt",
				"malt",
				"schneidet"
			],
			support: "Wähle ein Tunwort, das zum Vogel passt.",
			imageCue: "Ein Vogel sitzt auf einem Ast.",
			scene: "Lückensatz-Karten",
			challenge: "context-verb"
		}),
		makeItem({
			prompt: "Welcher Satz ist freundlich formuliert?",
			answer: "Kann ich bitte den Stift haben?",
			options: [
				"Kann ich bitte den Stift haben?",
				"Gib sofort den Stift her!",
				"Der Stift ist jetzt meiner.",
				"Ich nehme den Stift einfach."
			],
			support: "Bitte-Wörter machen eine Frage freundlich.",
			imageCue: "Zwei Kinder teilen sich Buntstifte.",
			scene: "Gesprächskreis",
			challenge: "polite-language"
		}),
		makeItem({
			prompt: "Welches Wort ist ein Nomen?",
			answer: "Garten",
			options: [
				"Garten",
				"grün",
				"hüpfen",
				"neben"
			],
			support: "Nomen kann man oft mit der, die oder das sagen.",
			imageCue: "Ein Garten mit Beeten und einer kleinen Gießkanne.",
			scene: "Wortarten-Tablett",
			challenge: "word-class"
		}),
		makeItem({
			prompt: "Welche Endung passt: 'Ich mal__ ein Bild.'",
			answer: "e",
			options: [
				"e",
				"st",
				"t",
				"en"
			],
			support: "Bei 'ich' endet das Verb oft auf -e: ich male.",
			imageCue: "Ein Kind malt eine Sonne auf Papier.",
			scene: "Verbformen mit Perlenstäbchen",
			challenge: "verb-ending"
		}),
		makeItem({
			prompt: "Welche Reihenfolge erzählt logisch: Samen, Keim, Pflanze, Blüte?",
			answer: "Samen -> Keim -> Pflanze -> Blüte",
			options: [
				"Samen -> Keim -> Pflanze -> Blüte",
				"Blüte -> Samen -> Pflanze -> Keim",
				"Pflanze -> Keim -> Samen -> Blüte",
				"Keim -> Blüte -> Samen -> Pflanze"
			],
			support: "Erst liegt der Samen in der Erde, dann wächst er Schritt für Schritt.",
			imageCue: "Vier Bildkarten zum Wachstum einer Blume.",
			scene: "Erzählfolge am Naturtisch",
			challenge: "story-sequence"
		}),
		makeItem({
			prompt: "Welche Frage passt zur Antwort: 'Im Korb liegen drei Birnen.'",
			answer: "Wie viele Birnen liegen im Korb?",
			options: [
				"Wie viele Birnen liegen im Korb?",
				"Warum ist der Korb blau?",
				"Wo schläft der Hund?",
				"Wer baut die Brücke?"
			],
			support: "Suche die Frage, die nach der Zahl fragt.",
			imageCue: "Ein Korb mit drei Birnen.",
			scene: "Frage-und-Antwort-Karten",
			challenge: "question-match"
		}),
		makeItem({
			prompt: "Welches zusammengesetzte Wort entsteht aus 'Sonne' und 'Blume'?",
			answer: "Sonnenblume",
			options: [
				"Sonnenblume",
				"Blumensonne",
				"Sonnentisch",
				"Blumenhaus"
			],
			support: "Manchmal bekommt das erste Wort ein kleines n in der Mitte.",
			imageCue: "Eine hohe Sonnenblume am Gartenzaun.",
			scene: "Wortbau-Werkstatt",
			challenge: "compound-word"
		})
	],
	mathe: [
		makeItem({
			prompt: "Du legst 4 rote Perlen und 3 blaue Perlen. Wie viele Perlen sind es zusammen?",
			answer: 7,
			options: [
				6,
				7,
				8,
				9
			],
			support: "Zähle zuerst die roten, dann weiter mit den blauen: 4, 5, 6, 7.",
			imageCue: "Vier rote und drei blaue Perlen auf einem Filzteppich.",
			scene: "Perlenmaterial",
			challenge: "addition-with-objects"
		}),
		makeItem({
			prompt: "Welche Zahl fehlt: 10, 20, 30, __, 50?",
			answer: 40,
			options: [
				35,
				40,
				45,
				60
			],
			support: "Die Reihe wächst immer um zehn.",
			imageCue: "Zehnerstäbe liegen in einer Treppe.",
			scene: "Zehnerleiter",
			challenge: "number-sequence"
		}),
		makeItem({
			prompt: "Welche Menge ist größer?",
			answer: "9 Steine",
			options: [
				"9 Steine",
				"6 Muscheln",
				"4 Blätter",
				"2 Zapfen"
			],
			support: "Vergleiche die Zahlen. 9 ist mehr als 6, 4 und 2.",
			imageCue: "Vier kleine Schalen mit Naturmaterialien.",
			scene: "Mengentablett",
			challenge: "quantity-compare"
		}),
		makeItem({
			prompt: "Lina hat 8 Apfelstücke. Sie isst 2. Wie viele bleiben übrig?",
			answer: 6,
			options: [
				4,
				5,
				6,
				7
			],
			support: "Nimm von 8 zwei weg: 8, 7, 6.",
			imageCue: "Apfelstücke auf einem kleinen Teller.",
			scene: "Subtraktion mit Alltagsmaterial",
			challenge: "subtraction-story"
		}),
		makeItem({
			prompt: "Welche Zahl ist gerade?",
			answer: 12,
			options: [
				7,
				9,
				12,
				15
			],
			support: "Gerade Zahlen lassen sich in zwei gleiche Gruppen teilen.",
			imageCue: "Zwölf Knöpfe in zwei Reihen.",
			scene: "Teilen in Paare",
			challenge: "even-odd"
		}),
		makeItem({
			prompt: "Was ist die Hälfte von 14?",
			answer: 7,
			options: [
				6,
				7,
				8,
				10
			],
			support: "Teile 14 in zwei gleich große Gruppen: 7 und 7.",
			imageCue: "Vierzehn Perlen werden in zwei Schalen verteilt.",
			scene: "Halbieren mit Schalen",
			challenge: "halving"
		}),
		makeItem({
			prompt: "Was ist das Doppelte von 6?",
			answer: 12,
			options: [
				10,
				11,
				12,
				14
			],
			support: "Doppelt bedeutet: die gleiche Menge noch einmal dazu.",
			imageCue: "Zwei Reihen mit je sechs Perlen.",
			scene: "Verdopplungsbrett",
			challenge: "doubling"
		}),
		makeItem({
			prompt: "Welche Form hat drei Ecken?",
			answer: "Dreieck",
			options: [
				"Dreieck",
				"Kreis",
				"Quadrat",
				"Rechteck"
			],
			support: "Zähle die Ecken der Form.",
			imageCue: "Holzformen auf einem Geometrie-Tablett.",
			scene: "Geometrische Kommode",
			challenge: "shape-recognition"
		}),
		makeItem({
			prompt: "Welche Uhrzeit zeigt der große Zeiger auf 12 und der kleine auf 3?",
			answer: "3 Uhr",
			options: [
				"3 Uhr",
				"12 Uhr",
				"6 Uhr",
				"9 Uhr"
			],
			support: "Wenn der große Zeiger oben steht, ist es eine volle Stunde.",
			imageCue: "Eine Lernuhr mit beweglichen Zeigern.",
			scene: "Uhrenarbeit",
			challenge: "time-full-hour"
		}),
		makeItem({
			prompt: "Welche Zahl liegt zwischen 48 und 50?",
			answer: 49,
			options: [
				47,
				49,
				51,
				59
			],
			support: "Zähle weiter: 48, 49, 50.",
			imageCue: "Eine Zahlengerade aus kleinen Holzkarten.",
			scene: "Zahlengerade",
			challenge: "number-neighbor"
		}),
		makeItem({
			prompt: "Welche Rechnung passt zu 5 Körben mit je 2 Kastanien?",
			answer: "5 x 2 = 10",
			options: [
				"5 x 2 = 10",
				"5 + 2 = 7",
				"5 - 2 = 3",
				"10 - 5 = 5"
			],
			support: "Gleiche Gruppen kann man als Malrechnung schreiben.",
			imageCue: "Fünf kleine Körbe mit je zwei Kastanien.",
			scene: "Multiplikation mit Gruppen",
			challenge: "multiplication-groups"
		}),
		makeItem({
			prompt: "Welche Zahl ergänzt zu 10: 6 + __ = 10?",
			answer: 4,
			options: [
				3,
				4,
				5,
				6
			],
			support: "Lege sechs Perlen. Wie viele fehlen bis zehn?",
			imageCue: "Ein Zehnerrahmen mit sechs gefüllten Feldern.",
			scene: "Zehnerfreunde",
			challenge: "make-ten"
		}),
		makeItem({
			prompt: "Welche Einheit passt besser: Ein Bleistift ist etwa 12 __ lang.",
			answer: "Zentimeter",
			options: [
				"Zentimeter",
				"Liter",
				"Kilogramm",
				"Stunden"
			],
			support: "Längen misst man mit Zentimetern oder Metern.",
			imageCue: "Ein Bleistift neben einem Lineal.",
			scene: "Messwerkstatt",
			challenge: "measurement-unit"
		}),
		makeItem({
			prompt: "Du hast 15 Perlen und legst immer 5 in eine Reihe. Wie viele Reihen entstehen?",
			answer: 3,
			options: [
				2,
				3,
				4,
				5
			],
			support: "Zähle die Fünfergruppen: 5, 10, 15.",
			imageCue: "Fünfzehn Perlen in drei ordentlichen Reihen.",
			scene: "Gruppieren und Dividieren",
			challenge: "division-groups"
		}),
		makeItem({
			prompt: "Welche Zahl ist 100 mehr als 340?",
			answer: 440,
			options: [
				240,
				350,
				430,
				440
			],
			support: "Bei plus 100 ändert sich die Hunderterstelle.",
			imageCue: "Hunderterplatten, Zehnerstäbe und Einerwürfel.",
			scene: "Goldenes Perlenmaterial",
			challenge: "place-value"
		})
	],
	sachunterricht: [
		makeItem({
			prompt: "Was braucht eine Pflanze zum Wachsen?",
			answer: "Wasser, Licht und Erde",
			options: [
				"Wasser, Licht und Erde",
				"Schuhe, Salz und Papier",
				"Sand, Seife und Mondlicht",
				"Steine, Wolle und Glas"
			],
			support: "Pflanzen brauchen Wasser, Licht, Luft und Nährstoffe aus der Erde.",
			imageCue: "Ein Keimling in einem Topf am Fenster.",
			scene: "Pflanzenstation",
			challenge: "living-needs"
		}),
		makeItem({
			prompt: "Welches Tier lebt oft im Teich?",
			answer: "Frosch",
			options: [
				"Frosch",
				"Kamel",
				"Pinguin",
				"Maulwurf"
			],
			support: "Frösche mögen feuchte Orte und Wasser.",
			imageCue: "Ein Frosch sitzt auf einem Seerosenblatt.",
			scene: "Lebensräume",
			challenge: "habitat-match"
		}),
		makeItem({
			prompt: "Welche Jahreszeit kommt nach dem Frühling?",
			answer: "Sommer",
			options: [
				"Sommer",
				"Winter",
				"Herbst",
				"März"
			],
			support: "Die Reihenfolge ist Frühling, Sommer, Herbst, Winter.",
			imageCue: "Vier Jahreszeitenkarten in einem Kreis.",
			scene: "Jahreskreis",
			challenge: "season-sequence"
		}),
		makeItem({
			prompt: "Was passiert mit Wasser im Gefrierfach?",
			answer: "Es wird zu Eis.",
			options: [
				"Es wird zu Eis.",
				"Es wird zu Sand.",
				"Es wird zu Holz.",
				"Es verschwindet immer."
			],
			support: "Wenn Wasser sehr kalt wird, gefriert es.",
			imageCue: "Eine Eiswürfelform mit gefrorenem Wasser.",
			scene: "Wasser-Experiment",
			challenge: "state-change"
		}),
		makeItem({
			prompt: "Welches Material wird von einem Magneten angezogen?",
			answer: "Eisen",
			options: [
				"Eisen",
				"Holz",
				"Stoff",
				"Papier"
			],
			support: "Viele Dinge aus Eisen oder Stahl reagieren auf Magnete.",
			imageCue: "Ein Magnet zieht eine Büroklammer an.",
			scene: "Magnettablett",
			challenge: "material-property"
		}),
		makeItem({
			prompt: "Welche Aufgabe haben Wurzeln?",
			answer: "Sie halten die Pflanze fest und nehmen Wasser auf.",
			options: [
				"Sie halten die Pflanze fest und nehmen Wasser auf.",
				"Sie machen Musik.",
				"Sie tragen Schuhe.",
				"Sie fliegen zur Sonne."
			],
			support: "Wurzeln sind meistens in der Erde verborgen.",
			imageCue: "Eine Pflanze mit sichtbaren Wurzeln im Glas.",
			scene: "Botanik-Beobachtung",
			challenge: "plant-part-function"
		}),
		makeItem({
			prompt: "Welches Verkehrsmittel fährt auf Schienen?",
			answer: "Zug",
			options: [
				"Zug",
				"Fahrrad",
				"Boot",
				"Roller"
			],
			support: "Schienen geben dem Zug den Weg vor.",
			imageCue: "Ein Zug fährt an einem Bahnsteig vorbei.",
			scene: "Verkehr und Wege",
			challenge: "transport-match"
		}),
		makeItem({
			prompt: "Was gehört in den Papiermüll?",
			answer: "Eine alte Zeitung",
			options: [
				"Eine alte Zeitung",
				"Eine Bananenschale",
				"Eine Glasflasche",
				"Eine leere Batterie"
			],
			support: "Papier und Pappe gehören in die Papiertonne, wenn sie sauber sind.",
			imageCue: "Drei kleine Recyclingkisten mit Symbolen.",
			scene: "Sortierstation",
			challenge: "recycling-sort"
		}),
		makeItem({
			prompt: "Welche Spur kann zu einem Vogel passen?",
			answer: "Drei dünne Zehen im Sand",
			options: [
				"Drei dünne Zehen im Sand",
				"Ein runder Reifenabdruck",
				"Eine breite Schuhsohle",
				"Eine gerade Linealspur"
			],
			support: "Vögel haben schmale Zehen und hinterlassen kleine Abdrücke.",
			imageCue: "Vogelspuren im feuchten Sand.",
			scene: "Spurenforscher",
			challenge: "observation"
		}),
		makeItem({
			prompt: "Was macht die Sonne für die Erde?",
			answer: "Sie gibt Licht und Wärme.",
			options: [
				"Sie gibt Licht und Wärme.",
				"Sie gießt Pflanzen direkt.",
				"Sie baut Häuser.",
				"Sie macht den Wind sichtbar."
			],
			support: "Ohne Sonnenlicht wäre es dunkel und sehr kalt.",
			imageCue: "Sonnenstrahlen fallen auf eine Wiese.",
			scene: "Himmel und Wetter",
			challenge: "earth-science"
		}),
		makeItem({
			prompt: "Welcher Teil des Körpers hilft dir beim Riechen?",
			answer: "Nase",
			options: [
				"Nase",
				"Knie",
				"Ellbogen",
				"Ferse"
			],
			support: "Mit der Nase kannst du Düfte wahrnehmen.",
			imageCue: "Duftdosen mit Orange, Minze und Zimt.",
			scene: "Sinnesmaterial",
			challenge: "body-senses"
		}),
		makeItem({
			prompt: "Was ist eine Insel?",
			answer: "Ein Stück Land, das von Wasser umgeben ist.",
			options: [
				"Ein Stück Land, das von Wasser umgeben ist.",
				"Ein Berg ohne Steine.",
				"Eine Straße durch den Wald.",
				"Ein Haus mit vielen Fenstern."
			],
			support: "Stell dir Land in der Mitte und Wasser rundherum vor.",
			imageCue: "Eine kleine Insel in einer blauen Wasserschale.",
			scene: "Land-und-Wasser-Formen",
			challenge: "geography-form"
		}),
		makeItem({
			prompt: "Welche Kleidung passt zu Regenwetter?",
			answer: "Regenjacke",
			options: [
				"Regenjacke",
				"Badehose",
				"Sonnenhut",
				"Sandalen ohne Socken"
			],
			support: "Bei Regen hilft Kleidung, die Wasser abhält.",
			imageCue: "Eine gelbe Regenjacke hängt an einem Haken.",
			scene: "Wetterstation",
			challenge: "weather-choice"
		}),
		makeItem({
			prompt: "Welche Reihenfolge passt zum Schmetterling?",
			answer: "Ei -> Raupe -> Puppe -> Schmetterling",
			options: [
				"Ei -> Raupe -> Puppe -> Schmetterling",
				"Raupe -> Ei -> Schmetterling -> Puppe",
				"Puppe -> Ei -> Raupe -> Schmetterling",
				"Schmetterling -> Puppe -> Ei -> Raupe"
			],
			support: "Viele Insekten verändern ihre Gestalt beim Wachsen.",
			imageCue: "Vier Karten zur Entwicklung eines Schmetterlings.",
			scene: "Lebenszyklus-Karten",
			challenge: "life-cycle"
		}),
		makeItem({
			prompt: "Warum waschen wir die Hände vor dem Essen?",
			answer: "Damit Schmutz und Keime entfernt werden.",
			options: [
				"Damit Schmutz und Keime entfernt werden.",
				"Damit die Hände lauter werden.",
				"Damit das Essen kalt bleibt.",
				"Damit der Tisch wächst."
			],
			support: "Saubere Hände helfen, gesund zu bleiben.",
			imageCue: "Hände werden mit Seife unter Wasser gewaschen.",
			scene: "Gesundheit und Alltag",
			challenge: "health-habit"
		})
	],
	ethik: [
		makeItem({
			prompt: "Ein Kind ist neu in der Gruppe und steht allein. Was ist hilfreich?",
			answer: "Ich frage, ob es mitspielen möchte.",
			options: [
				"Ich frage, ob es mitspielen möchte.",
				"Ich lache und gehe weg.",
				"Ich verstecke die Spielsachen.",
				"Ich sage nichts und schubse."
			],
			support: "Ein freundlicher Anfang kann Mut machen.",
			imageCue: "Ein Kind lädt ein anderes an den Bautisch ein.",
			scene: "Gemeinschaftskreis",
			challenge: "empathy-choice"
		}),
		makeItem({
			prompt: "Du hast aus Versehen Wasser verschüttet. Was tust du?",
			answer: "Ich hole ein Tuch und wische es auf.",
			options: [
				"Ich hole ein Tuch und wische es auf.",
				"Ich renne weg.",
				"Ich schiebe es jemand anderem zu.",
				"Ich gieße noch mehr Wasser dazu."
			],
			support: "Verantwortung heißt: Ich helfe, etwas wieder in Ordnung zu bringen.",
			imageCue: "Ein Kind wischt Wasser neben einem Krug auf.",
			scene: "Praktisches Leben",
			challenge: "responsibility"
		}),
		makeItem({
			prompt: "Zwei Kinder wollen dasselbe Material. Welche Lösung ist fair?",
			answer: "Sie sprechen ab, wer zuerst arbeitet und wer danach.",
			options: [
				"Sie sprechen ab, wer zuerst arbeitet und wer danach.",
				"Ein Kind nimmt alles weg.",
				"Beide schreien gleichzeitig.",
				"Das Material wird versteckt."
			],
			support: "Abwechseln schützt die Arbeit beider Kinder.",
			imageCue: "Eine Sanduhr steht neben einem Montessori-Material.",
			scene: "Friedensarbeit",
			challenge: "fairness"
		}),
		makeItem({
			prompt: "Wie kannst du zeigen, dass du zuhörst?",
			answer: "Ich schaue ruhig hin und lasse die andere Person ausreden.",
			options: [
				"Ich schaue ruhig hin und lasse die andere Person ausreden.",
				"Ich rede lauter darüber.",
				"Ich drehe mich weg und summe.",
				"Ich nehme das Buch aus der Hand."
			],
			support: "Zuhören braucht Ruhe, Augen, Ohren und Geduld.",
			imageCue: "Zwei Kinder sitzen sich im Gespräch gegenüber.",
			scene: "Dialogübung",
			challenge: "listening"
		}),
		makeItem({
			prompt: "Du merkst, dass dein Freund traurig ist. Was passt?",
			answer: "Ich frage vorsichtig, ob er Hilfe möchte.",
			options: [
				"Ich frage vorsichtig, ob er Hilfe möchte.",
				"Ich sage: Stell dich nicht so an.",
				"Ich nehme sein Spiel weg.",
				"Ich erzähle es allen laut."
			],
			support: "Mitgefühl beginnt oft mit einer leisen Frage.",
			imageCue: "Ein Kind reicht einem traurigen Kind ein Taschentuch.",
			scene: "Gefühlskarten",
			challenge: "compassion"
		}),
		makeItem({
			prompt: "Was bedeutet 'achtsam arbeiten'?",
			answer: "Ich gehe sorgfältig mit Material und Umgebung um.",
			options: [
				"Ich gehe sorgfältig mit Material und Umgebung um.",
				"Ich werfe alles schnell in die Ecke.",
				"Ich störe andere absichtlich.",
				"Ich mache Material kaputt, wenn es schwer ist."
			],
			support: "Achtsamkeit sieht man an ruhigen Händen und klaren Handlungen.",
			imageCue: "Hände rollen eine Arbeitsmatte ordentlich ein.",
			scene: "Vorbereitete Umgebung",
			challenge: "mindfulness"
		}),
		makeItem({
			prompt: "Was ist ehrlich?",
			answer: "Ich sage, dass mir der Becher heruntergefallen ist.",
			options: [
				"Ich sage, dass mir der Becher heruntergefallen ist.",
				"Ich sage, niemand war es.",
				"Ich verstecke die Scherben.",
				"Ich beschuldige ein anderes Kind."
			],
			support: "Ehrlichkeit hilft, gemeinsam eine Lösung zu finden.",
			imageCue: "Ein zerbrochener Becher liegt neben einem Handfeger.",
			scene: "Wahrheit und Vertrauen",
			challenge: "honesty"
		}),
		makeItem({
			prompt: "Du möchtest mitarbeiten, aber das Material ist besetzt. Was kannst du tun?",
			answer: "Ich warte oder wähle zuerst eine andere Arbeit.",
			options: [
				"Ich warte oder wähle zuerst eine andere Arbeit.",
				"Ich reiße es weg.",
				"Ich lege mich darauf.",
				"Ich verstecke die Anleitung."
			],
			support: "Geduld schützt die Konzentration des anderen Kindes.",
			imageCue: "Ein Kind wartet mit einer Namenskarte an einem Regal.",
			scene: "Freiarbeit",
			challenge: "patience"
		}),
		makeItem({
			prompt: "Welche Worte helfen nach einem Streit?",
			answer: "Es tut mir leid. Können wir neu anfangen?",
			options: [
				"Es tut mir leid. Können wir neu anfangen?",
				"Du bist immer schuld.",
				"Ich spiele nie wieder mit dir.",
				"Ich höre dir nicht zu."
			],
			support: "Gute Friedensworte öffnen eine Tür zurück zueinander.",
			imageCue: "Zwei Kinder reichen sich nach einem Gespräch die Hand.",
			scene: "Friedenstisch",
			challenge: "conflict-repair"
		}),
		makeItem({
			prompt: "Was bedeutet teilen?",
			answer: "Ich gebe etwas ab oder benutze es abwechselnd.",
			options: [
				"Ich gebe etwas ab oder benutze es abwechselnd.",
				"Ich behalte immer alles.",
				"Ich nehme heimlich mehr.",
				"Ich sage, andere dürfen nie mitmachen."
			],
			support: "Teilen kann gleichzeitig oder nacheinander geschehen.",
			imageCue: "Zwei Kinder teilen Apfelschnitze auf Tellern.",
			scene: "Gemeinsamer Snack",
			challenge: "sharing"
		}),
		makeItem({
			prompt: "Welche Handlung schützt die Arbeit eines anderen Kindes?",
			answer: "Ich gehe langsam um den Arbeitsteppich herum.",
			options: [
				"Ich gehe langsam um den Arbeitsteppich herum.",
				"Ich laufe über die Karten.",
				"Ich mische die Arbeit ungefragt.",
				"Ich nehme ein Teil weg."
			],
			support: "Ein Arbeitsteppich zeigt: Hier arbeitet jemand konzentriert.",
			imageCue: "Ein Teppich mit geordneten Karten auf dem Boden.",
			scene: "Respekt vor Arbeit",
			challenge: "respect-boundary"
		}),
		makeItem({
			prompt: "Du bekommst Hilfe. Was passt danach?",
			answer: "Danke sagen",
			options: [
				"Danke sagen",
				"Weglaufen",
				"Schimpfen",
				"Alles fallen lassen"
			],
			support: "Dankbarkeit zeigt: Ich habe die Hilfe bemerkt.",
			imageCue: "Ein Kind bekommt Hilfe beim Binden einer Schleife.",
			scene: "Höflichkeit im Alltag",
			challenge: "gratitude"
		}),
		makeItem({
			prompt: "Wie kannst du Mut zeigen?",
			answer: "Ich versuche eine schwere Aufgabe in kleinen Schritten.",
			options: [
				"Ich versuche eine schwere Aufgabe in kleinen Schritten.",
				"Ich gebe sofort auf.",
				"Ich lache über andere.",
				"Ich verstecke das Material."
			],
			support: "Mut ist nicht laut. Mut kann ein erster kleiner Schritt sein.",
			imageCue: "Ein Kind legt konzentriert ein schwieriges Puzzle.",
			scene: "Selbstvertrauen",
			challenge: "courage"
		}),
		makeItem({
			prompt: "Was ist eine gute Regel für eine Gruppe?",
			answer: "Wir achten auf uns, auf andere und auf die Dinge.",
			options: [
				"Wir achten auf uns, auf andere und auf die Dinge.",
				"Wer laut ist, bekommt alles.",
				"Material darf überall liegen.",
				"Niemand hört zu."
			],
			support: "Gute Regeln machen gemeinsames Lernen leichter.",
			imageCue: "Drei Symbolkarten: Ich, Wir, Material.",
			scene: "Gruppenregeln",
			challenge: "community-rule"
		}),
		makeItem({
			prompt: "Ein anderes Kind macht etwas anders als du. Was ist respektvoll?",
			answer: "Ich schaue interessiert und frage freundlich.",
			options: [
				"Ich schaue interessiert und frage freundlich.",
				"Ich sage, nur mein Weg ist richtig.",
				"Ich mache es kaputt.",
				"Ich lache über die Idee."
			],
			support: "Unterschiede können uns etwas Neues zeigen.",
			imageCue: "Zwei Kinder vergleichen unterschiedliche Bauideen.",
			scene: "Vielfalt und Respekt",
			challenge: "respect-difference"
		})
	],
	musik: [
		makeItem({
			prompt: "Welches Instrument hat Saiten?",
			answer: "Gitarre",
			options: [
				"Gitarre",
				"Trommel",
				"Triangel",
				"Rassel"
			],
			support: "Saiten können gezupft oder gestrichen werden.",
			imageCue: "Eine kleine Gitarre liegt auf einem Musikteppich.",
			scene: "Instrumenten-Karten",
			challenge: "instrument-family"
		}),
		makeItem({
			prompt: "Welches Zeichen passt zu einer Pause in der Musik?",
			answer: "Stille",
			options: [
				"Stille",
				"Schneller werden",
				"Lauter singen",
				"Höher spielen"
			],
			support: "Eine Pause ist ein geplanter Moment ohne Klang.",
			imageCue: "Kinder halten Klanghölzer still in den Händen.",
			scene: "Rhythmuskreis",
			challenge: "music-concept"
		}),
		makeItem({
			prompt: "Welcher Rhythmus hat vier Schläge?",
			answer: "ta ta ta ta",
			options: [
				"ta ta ta ta",
				"ta ta",
				"ta ta ta",
				"taaaaa"
			],
			support: "Zähle jeden Klang: eins, zwei, drei, vier.",
			imageCue: "Vier Punkte auf einer Rhythmuskarte.",
			scene: "Rhythmusbausteine",
			challenge: "beat-count"
		}),
		makeItem({
			prompt: "Welches Instrument klingt, wenn man darauf schlägt?",
			answer: "Trommel",
			options: [
				"Trommel",
				"Flöte",
				"Geige",
				"Harfe"
			],
			support: "Schlaginstrumente werden angeschlagen, geklopft oder geschüttelt.",
			imageCue: "Eine Hand schlägt sanft auf eine Rahmentrommel.",
			scene: "Percussion-Tablett",
			challenge: "sound-action"
		}),
		makeItem({
			prompt: "Was bedeutet 'laut' in der Musik?",
			answer: "Mit kräftigem Klang spielen oder singen",
			options: [
				"Mit kräftigem Klang spielen oder singen",
				"Gar nicht spielen",
				"Sehr langsam gehen",
				"Nur flüstern"
			],
			support: "Laut beschreibt die Stärke des Klangs.",
			imageCue: "Eine große Klangwelle neben einer Trommel.",
			scene: "Dynamik-Karten",
			challenge: "dynamics"
		}),
		makeItem({
			prompt: "Was bedeutet 'leise' in der Musik?",
			answer: "Mit sanftem Klang spielen oder singen",
			options: [
				"Mit sanftem Klang spielen oder singen",
				"Immer schneller werden",
				"Alle Töne weglassen",
				"Auf einem Bein stehen"
			],
			support: "Leise Klänge brauchen aufmerksame Ohren.",
			imageCue: "Ein Kind streicht sehr sanft über ein Xylophon.",
			scene: "Dynamik-Übung",
			challenge: "dynamics"
		}),
		makeItem({
			prompt: "Welches Instrument spielt man mit Luft?",
			answer: "Flöte",
			options: [
				"Flöte",
				"Trommel",
				"Becken",
				"Klangholz"
			],
			support: "Bei Blasinstrumenten bringt Atem die Luft zum Schwingen.",
			imageCue: "Eine Holzflöte neben Atemkarten.",
			scene: "Blasinstrumente",
			challenge: "instrument-action"
		}),
		makeItem({
			prompt: "Welche Bewegung passt zu schneller Musik?",
			answer: "Trippeln",
			options: [
				"Trippeln",
				"Langsam schleichen",
				"Still schlafen",
				"Einfrieren"
			],
			support: "Schnelle Musik hat viele Schläge in kurzer Zeit.",
			imageCue: "Fußspuren liegen dicht hintereinander.",
			scene: "Musik und Bewegung",
			challenge: "tempo-response"
		}),
		makeItem({
			prompt: "Welche Bewegung passt zu langsamer Musik?",
			answer: "Schreiten",
			options: [
				"Schreiten",
				"Hüpfen wie ein Ball",
				"Rennen",
				"Klatschen ohne Pause"
			],
			support: "Langsame Musik lässt mehr Zeit zwischen den Schritten.",
			imageCue: "Große Fußspuren liegen weit auseinander.",
			scene: "Tempo-Karten",
			challenge: "tempo-response"
		}),
		makeItem({
			prompt: "Welches Instrument hat Tasten?",
			answer: "Klavier",
			options: [
				"Klavier",
				"Rassel",
				"Triangel",
				"Trommel"
			],
			support: "Beim Klavier drücken Finger die Tasten.",
			imageCue: "Schwarze und weiße Klaviertasten aus Holz.",
			scene: "Instrumentenfamilien",
			challenge: "instrument-feature"
		}),
		makeItem({
			prompt: "Welche Reihenfolge klingt wie ein Echo?",
			answer: "Vorspielen -> Nachspielen",
			options: [
				"Vorspielen -> Nachspielen",
				"Wegräumen -> Schlafen",
				"Malen -> Schneiden",
				"Zählen -> Springen"
			],
			support: "Beim Echo antwortet jemand mit demselben Klangmuster.",
			imageCue: "Zwei Kinder mit Klanghölzern sitzen gegenüber.",
			scene: "Echo-Spiel",
			challenge: "call-response"
		}),
		makeItem({
			prompt: "Welches Wort beschreibt die Tonhöhe?",
			answer: "hoch",
			options: [
				"hoch",
				"süß",
				"eckig",
				"nass"
			],
			support: "Töne können hoch wie ein Vogel oder tief wie eine große Trommel klingen.",
			imageCue: "Eine Klangtreppe steigt nach oben.",
			scene: "Tonhöhenleiter",
			challenge: "pitch"
		}),
		makeItem({
			prompt: "Was passt zu einem tiefen Ton?",
			answer: "Große Trommel",
			options: [
				"Große Trommel",
				"Kleine Glocke",
				"Vogelpfiff",
				"Triangel"
			],
			support: "Große Klangkörper klingen oft tiefer.",
			imageCue: "Eine große Trommel steht neben einer kleinen Glocke.",
			scene: "Hoch-und-tief-Vergleich",
			challenge: "pitch-match"
		}),
		makeItem({
			prompt: "Welche Karte zeigt ein Klangmuster mit Wiederholung?",
			answer: "klatsch stampf klatsch stampf",
			options: [
				"klatsch stampf klatsch stampf",
				"klatsch stampf raschel pause",
				"summ summ klopf kling",
				"stampfen rennen schlafen malen"
			],
			support: "Ein Muster wiederholt sich: A B A B.",
			imageCue: "Zwei Symbolkarten wiederholen sich abwechselnd.",
			scene: "Pattern-Arbeit",
			challenge: "music-pattern"
		}),
		makeItem({
			prompt: "Was machst du vor dem gemeinsamen Singen?",
			answer: "Ich atme ruhig ein und höre auf den Anfang.",
			options: [
				"Ich atme ruhig ein und höre auf den Anfang.",
				"Ich schreie sofort los.",
				"Ich renne durch den Raum.",
				"Ich drehe dem Kreis den Rücken zu."
			],
			support: "Gemeinsames Singen beginnt mit Aufmerksamkeit.",
			imageCue: "Kinder stehen im Kreis und warten auf ein Startzeichen.",
			scene: "Singkreis",
			challenge: "ensemble-readiness"
		})
	]
};
//#endregion
//#region src/data/premiumGamePack.js
var optionSet = (answer, wrongs) => [...new Set([answer, ...wrongs])].slice(0, 4);
var collection = (id, label, icon, color, scene, rawItems) => ({
	id,
	label,
	icon,
	color,
	items: rawItems.map(([prompt, answer, wrongs, support, imageCue, challenge], index) => ({
		prompt,
		answer,
		options: optionSet(answer, wrongs),
		support,
		imageCue,
		scene,
		challenge: challenge || [
			"sehen",
			"denken",
			"handeln"
		][index % 3]
	}))
});
var PREMIUM_GAME_CONTENT = {
	deutsch: [
		collection("premium-bilderlesen", "Bilderlesen", "🖼️", "bg-orange-400", "language", [
			[
				"Im Bild steht eine Tasse auf dem Tisch. Welches Wort passt?",
				"Tasse",
				[
					"Tisch",
					"Fenster",
					"Schuh"
				],
				"Suche das Ding, das man halten kann.",
				"warme Tasse auf einem Holztisch",
				"Bildspur"
			],
			[
				"Ein Kind legt ein Buch in den Ranzen. Was passiert?",
				"Es packt ein Buch ein",
				[
					"Es gießt Blumen",
					"Es baut einen Turm",
					"Es schläft"
				],
				"Schau auf die Handlung.",
				"Buch und Ranzen",
				"Szenenlesen"
			],
			[
				"Auf der Wiese fliegt etwas Buntes. Welches Wort passt?",
				"Schmetterling",
				[
					"Stein",
					"Trommel",
					"Schal"
				],
				"Achte auf Flügel und Farben.",
				"bunter Schmetterling ueber Wiese",
				"Bildwort"
			],
			[
				"Neben der Lampe liegt ein Stift. Wo liegt der Stift?",
				"Neben der Lampe",
				[
					"Unter dem Bett",
					"Im Wasser",
					"Auf dem Dach"
				],
				"Das Ortswort ist wichtig.",
				"Stift neben kleiner Lampe",
				"Ortswort"
			],
			[
				"Ein roter Apfel liegt im Korb. Was ist rot?",
				"Der Apfel",
				[
					"Der Korb",
					"Das Blatt",
					"Der Tisch"
				],
				"Frage nach der Farbe.",
				"roter Apfel im Korb",
				"Detailblick"
			],
			[
				"Eine Glocke klingt leise. Welches Tun passt?",
				"klingt",
				[
					"rennt",
					"schwimmt",
					"malt"
				],
				"Suche das passende Verb.",
				"kleine goldene Glocke",
				"Verbspur"
			]
		]),
		collection("premium-wortwerkstatt", "Wortwerkstatt", "🔤", "bg-rose-400", "language", [
			[
				"Welches Wort ist ein Nomen?",
				"Garten",
				[
					"laufen",
					"weich",
					"unter"
				],
				"Nomen kann man oft anfassen oder sich vorstellen.",
				"Garten mit Weg",
				"Wortart"
			],
			[
				"Welches Wort beschreibt, wie etwas ist?",
				"hell",
				[
					"Mond",
					"tanzt",
					"unter"
				],
				"Beschreibewoerter sind Adjektive.",
				"heller Mond",
				"Wortart"
			],
			[
				"Welches Wort sagt, was jemand tut?",
				"summt",
				[
					"Biene",
					"gelb",
					"die"
				],
				"Tu-Woerter sind Verben.",
				"Biene an Blume",
				"Verb"
			],
			[
				"Was ist ein zusammengesetztes Wort?",
				"Sonnenblume",
				[
					"Sonne",
					"Blume",
					"gelb"
				],
				"Zwei Woerter werden ein neues Wort.",
				"Sonnenblume",
				"Wortbau"
			],
			[
				"Welche Silben bauen Laterne?",
				"La-ter-ne",
				[
					"Lat-er-ne",
					"La-tern-e",
					"L-a-terne"
				],
				"Klopfe jede Silbe einmal.",
				"leuchtende Laterne",
				"Silben"
			],
			[
				"Welches Wort passt nicht in die Reihe?",
				"Trommel",
				[
					"Apfel",
					"Birne",
					"Banane"
				],
				"Drei Woerter gehoeren zum Obst.",
				"Obstkorb und Trommel",
				"Sortieren"
			]
		]),
		collection("premium-geschichten", "Geschichtenpfad", "📚", "bg-violet-400", "language", [
			[
				"Mira findet einen verlorenen Handschuh. Was ist ein guter naechster Satz?",
				"Sie fragt, wem er gehoert.",
				[
					"Sie wirft ihn weg.",
					"Sie versteckt ihn.",
					"Sie malt ihn an."
				],
				"Eine Geschichte soll sinnvoll weitergehen.",
				"Handschuh auf Schulbank",
				"Erzaehlen"
			],
			[
				"Der Samen bekommt Wasser und Sonne. Was kommt als Naechstes?",
				"Ein kleiner Keim waechst.",
				[
					"Ein Fisch springt heraus.",
					"Der Schnee schmilzt im Zimmer.",
					"Eine Trommel klingt."
				],
				"Denke an Pflanzenwachstum.",
				"Samen mit Keim",
				"Reihenfolge"
			],
			[
				"Noa hoert ein Geraeusch hinter der Tuer. Welcher Satz macht neugierig?",
				"Leise oeffnet er die Tuer einen Spalt.",
				[
					"Er zaehlt bis zehn.",
					"Der Apfel ist rund.",
					"Die Schuhe sind blau."
				],
				"Ein spannender Satz fuehrt weiter.",
				"angelehnte Tuer mit Licht",
				"Spannung"
			],
			[
				"Im Satz fehlt ein Ende: Der Hund wedelt, weil ...",
				"er sich freut.",
				[
					"der Mond scheint.",
					"der Stein hart ist.",
					"das Buch liest."
				],
				"Das Ende soll zum Anfang passen.",
				"freudiger Hund",
				"Satzende"
			],
			[
				"Welche Ueberschrift passt zu einer Geschichte ueber Teilen?",
				"Der Baustein fuer zwei",
				[
					"Der schnelle Blitz",
					"Die kalte Suppe",
					"Das tiefe Meer"
				],
				"Eine Ueberschrift nennt den Kern.",
				"zwei Kinder mit Baustein",
				"Titel"
			],
			[
				"Was macht eine Geschichte freundlich?",
				"Figuren hoeren einander zu.",
				[
					"Alle schreien gleichzeitig.",
					"Niemand darf sprechen.",
					"Das Ende bleibt gemein."
				],
				"Freundlich heisst nicht langweilig.",
				"Kinderkreis",
				"Erzaehlton"
			]
		])
	],
	mathe: [
		collection("premium-materialbank", "Materialbank", "🧮", "bg-amber-400", "math", [
			[
				"Drei Zehnerstaebe und vier Einer ergeben welche Zahl?",
				"34",
				[
					"43",
					"304",
					"7"
				],
				"Zehner zuerst, dann Einer.",
				"Montessori-Zehnerstaebe und Einer",
				"Perlen"
			],
			[
				"Zwei Hunderter, fuenf Zehner und sechs Einer ergeben?",
				"256",
				[
					"265",
					"526",
					"206"
				],
				"Lege die Stellen nebeneinander.",
				"Hunderterplatte und Zehner",
				"Stellenwert"
			],
			[
				"Welche Zahl ist um 10 groesser als 48?",
				"58",
				[
					"49",
					"38",
					"68"
				],
				"Nur die Zehnerstelle waechst.",
				"Zahlenleiter",
				"Zehnersprung"
			],
			[
				"Welche Zahl ist die Haelfte von 18?",
				"9",
				[
					"8",
					"10",
					"12"
				],
				"Teile 18 gerecht in zwei gleiche Gruppen.",
				"geteilte Perlen",
				"Halbieren"
			],
			[
				"Welche Aufgabe passt zu 4 Reihen mit je 3 Perlen?",
				"4 x 3",
				[
					"4 + 4",
					"3 - 4",
					"12 x 4"
				],
				"Reihen mal Perlen pro Reihe.",
				"Perlenrechteck",
				"Multiplikation"
			],
			[
				"Welche Zahl liegt zwischen 399 und 401?",
				"400",
				[
					"390",
					"410",
					"499"
				],
				"Zaehle genau einen Schritt weiter.",
				"Zahlenbruecke",
				"Nachbarzahl"
			]
		]),
		collection("premium-knobelkarten", "Knobelkarten", "🧩", "bg-sky-400", "math", [
			[
				"Im Korb liegen 8 Muscheln. 3 kommen dazu. Wie viele sind es?",
				"11",
				[
					"10",
					"12",
					"5"
				],
				"Plus bedeutet: Es wird mehr.",
				"Muschelkorb",
				"Plus"
			],
			[
				"12 Kinder teilen sich in 3 gleiche Gruppen. Wie viele pro Gruppe?",
				"4",
				[
					"3",
					"6",
					"9"
				],
				"Jede Gruppe bekommt gleich viel.",
				"Gruppenkreise",
				"Teilen"
			],
			[
				"Welche Form hat genau sechs Ecken?",
				"Sechseck",
				[
					"Dreieck",
					"Kreis",
					"Quadrat"
				],
				"Zaehle die Ecken.",
				"Sechseck-Mosaik",
				"Geometrie"
			],
			[
				"Was ist laenger: 1 Meter oder 30 Zentimeter?",
				"1 Meter",
				[
					"30 Zentimeter",
					"beides gleich",
					"keins"
				],
				"Ein Meter sind 100 Zentimeter.",
				"Messband",
				"Messen"
			],
			[
				"Welche Zahl fehlt: 6, 12, 18, __, 30?",
				"24",
				[
					"20",
					"22",
					"26"
				],
				"Die Reihe springt immer um 6.",
				"Zahlentreppen",
				"Muster"
			],
			[
				"Welche Menge ist groesser?",
				"7 Sterne",
				[
					"5 Sterne",
					"beide gleich",
					"2 Sterne"
				],
				"Vergleiche die Anzahlen.",
				"Sternegruppen",
				"Vergleichen"
			]
		]),
		collection("premium-formenatelier", "Formenatelier", "🔷", "bg-indigo-400", "math", [
			[
				"Welche Form passt zu einer Uhr?",
				"Kreis",
				[
					"Dreieck",
					"Wuerfel",
					"Pyramide"
				],
				"Der Rand ist rund.",
				"runde Uhr",
				"Formblick"
			],
			[
				"Welche Form passt zu einem Buchdeckel?",
				"Rechteck",
				[
					"Kugel",
					"Kreis",
					"Kegel"
				],
				"Zwei lange und zwei kurze Seiten.",
				"offenes Buch",
				"Alltagsform"
			],
			[
				"Welcher Koerper hat sechs gleiche Flaechen?",
				"Wuerfel",
				[
					"Kugel",
					"Zylinder",
					"Kegel"
				],
				"Denke an einen Spielwuerfel.",
				"Holzwuerfel",
				"Koerper"
			],
			[
				"Welche Form kann rollen und hat keine Ecke?",
				"Kugel",
				[
					"Quader",
					"Pyramide",
					"Wuerfel"
				],
				"Ein Ball kann rollen.",
				"Ball auf Teppich",
				"Koerper"
			],
			[
				"Welche Linie ist gerade?",
				"Lineal-Kante",
				[
					"Schneckenhaus",
					"Welle",
					"Spirale"
				],
				"Gerade heisst ohne Kurve.",
				"Lineal",
				"Linien"
			],
			[
				"Was passt zu Symmetrie?",
				"Beide Seiten sehen gleich aus.",
				[
					"Eine Seite fehlt.",
					"Alles ist durcheinander.",
					"Nur eine Ecke zaehlt."
				],
				"Falte ein Blatt in Gedanken.",
				"Schmetterlingsfluegel",
				"Symmetrie"
			]
		])
	],
	sachunterricht: [
		collection("premium-forscherbilder", "Forscherbilder", "🔎", "bg-emerald-400", "world", [
			[
				"Ein Blatt hat braune, trockene Raender. Was braucht die Pflanze vielleicht?",
				"Wasser",
				[
					"Schnee",
					"Sand",
					"Laerm"
				],
				"Pflanzen brauchen Pflege.",
				"Pflanze mit trockenem Blatt",
				"Forschen"
			],
			[
				"Du siehst Spuren im weichen Boden. Was kann man tun?",
				"Genau beobachten",
				[
					"Darauf stampfen",
					"Wegwischen",
					"Schnell wegrennen"
				],
				"Forscher schauen ruhig und genau.",
				"Spuren im Matsch",
				"Beobachten"
			],
			[
				"Eine Schnecke hat ihr Haus dabei. Was schuetzt es?",
				"Den weichen Koerper",
				[
					"Die Sonne",
					"Den Regen",
					"Den Weg"
				],
				"Das Haus ist Schutz.",
				"Schnecke auf Blatt",
				"Tierwissen"
			],
			[
				"Warum sammeln Bienen Nektar?",
				"Sie machen daraus Nahrung.",
				[
					"Sie bauen Steine.",
					"Sie kochen Suppe.",
					"Sie malen Blumen."
				],
				"Bienen besuchen Blueten.",
				"Biene auf Bluete",
				"Naturkreislauf"
			],
			[
				"Was ist bei Gewitter sicherer?",
				"Drinnen bleiben",
				[
					"Unter einem Baum warten",
					"Im Wasser schwimmen",
					"Auf ein Feld laufen"
				],
				"Sicherheit kommt zuerst.",
				"Gewitter am Fenster",
				"Wetter"
			],
			[
				"Was hilft einem Igel im Herbst?",
				"Laubhaufen liegen lassen",
				[
					"Alle Blaetter wegsaugen",
					"Sehr laute Musik",
					"Kein Versteck"
				],
				"Manche Tiere brauchen ruhige Ecken.",
				"Laubhaufen",
				"Naturpflege"
			]
		]),
		collection("premium-experimente", "Mini-Experimente", "🧪", "bg-cyan-400", "world", [
			[
				"Was pruefst du mit einer Lupe?",
				"Kleine Details",
				[
					"Laute Toene",
					"Geschmack",
					"Gewicht allein"
				],
				"Eine Lupe macht Kleines groesser.",
				"Lupe ueber Blatt",
				"Werkzeug"
			],
			[
				"Was passiert oft mit Eis in warmer Hand?",
				"Es schmilzt",
				[
					"Es wird groesser",
					"Es wird Holz",
					"Es klingt"
				],
				"Waerme veraendert Eis.",
				"Eiswuerfel",
				"Zustand"
			],
			[
				"Welche Frage passt zu einem Experiment?",
				"Was veraendert sich?",
				[
					"Wer gewinnt?",
					"Warum bin ich laut?",
					"Welche Farbe mag ich nie?"
				],
				"Forscherfragen sind genau.",
				"Experimenttisch",
				"Frage"
			],
			[
				"Was braucht ein Samen zum Wachsen?",
				"Erde, Wasser und Licht",
				[
					"Nur Dunkelheit",
					"Nur Steine",
					"Nur Papier"
				],
				"Pflanzen brauchen mehrere Dinge.",
				"Samenstation",
				"Wachsen"
			],
			[
				"Was zeigt ein Schatten?",
				"Wo Licht blockiert wird",
				[
					"Wie laut es ist",
					"Wie suess etwas ist",
					"Wie schwer Musik ist"
				],
				"Schatten entsteht durch Licht.",
				"Schattenfigur",
				"Licht"
			],
			[
				"Warum sortieren Forscher Fundstuecke?",
				"Damit sie Muster erkennen",
				[
					"Damit alles verschwindet",
					"Damit nichts passt",
					"Damit es lauter wird"
				],
				"Ordnen hilft beim Denken.",
				"Naturtablett",
				"Sortieren"
			]
		]),
		collection("premium-weltreise", "Weltreise", "🗺️", "bg-lime-400", "world", [
			[
				"Wo lebt ein Kamel besonders gut?",
				"In trockenen warmen Gegenden",
				[
					"Im ewigen Eis",
					"Nur im Aquarium",
					"Im Baumhaus"
				],
				"Denke an Wasser, Waerme und Koerperbau.",
				"Wuestenszene",
				"Lebensraum"
			],
			[
				"Warum haben Fische Flossen?",
				"Zum Schwimmen",
				[
					"Zum Graben",
					"Zum Fliegen",
					"Zum Klettern"
				],
				"Flossen helfen im Wasser.",
				"klarer Teich",
				"Tierkoerper"
			],
			[
				"Was passt zum Wald?",
				"Baeume, Moos und viele Verstecke",
				[
					"Nur Sandduenen",
					"Nur Eisplatten",
					"Nur Ampeln"
				],
				"Ein Lebensraum hat typische Dinge.",
				"Waldlichtung",
				"Lebensraum"
			],
			[
				"Was veraendert sich im Fruehling?",
				"Viele Pflanzen treiben aus.",
				[
					"Alle Blaetter fallen.",
					"Seen frieren immer zu.",
					"Es wird jeden Tag dunkel."
				],
				"Fruehling ist Wachstumszeit.",
				"Fruehlingsknospen",
				"Jahreszeit"
			],
			[
				"Warum ist sauberes Wasser wichtig?",
				"Menschen, Tiere und Pflanzen brauchen es.",
				[
					"Nur Steine brauchen es.",
					"Es ist egal.",
					"Es macht Laerm."
				],
				"Wasser ist Lebensgrundlage.",
				"Bach mit Steinen",
				"Umwelt"
			],
			[
				"Was zeigt eine Karte?",
				"Orte und Wege",
				[
					"Gerueche",
					"Traeume",
					"Musik allein"
				],
				"Karten helfen beim Orientieren.",
				"bunte Karte",
				"Orientierung"
			]
		])
	],
	ethik: [
		collection("premium-herzfragen", "Herzfragen", "💛", "bg-pink-400", "heart", [
			[
				"Ein Kind sagt: Ich will nicht mitmachen. Was ist achtsam?",
				"Nachfragen und die Grenze achten",
				[
					"Es auslachen",
					"Es schubsen",
					"Es zwingen"
				],
				"Ein Nein darf ernst genommen werden.",
				"ruhige Kindergruppe",
				"Grenze"
			],
			[
				"Jemand weint leise. Was kann helfen?",
				"Sanft fragen, ob Hilfe gewuenscht ist",
				[
					"Sofort anfassen",
					"Laut rufen",
					"Weglaufen"
				],
				"Trost braucht Erlaubnis und Ruhe.",
				"weiches Trostlicht",
				"Trost"
			],
			[
				"Du bist sehr wuetend. Was ist ein sicherer erster Schritt?",
				"Atmen und Abstand nehmen",
				[
					"Etwas werfen",
					"Jemanden beleidigen",
					"Alles kaputt machen"
				],
				"Gefuehle duerfen da sein, Handlungen brauchen Schutz.",
				"Atempause",
				"Selbstregulation"
			],
			[
				"Zwei Kinder wollen dasselbe Spielzeug. Was ist fair?",
				"Abwechseln oder gemeinsam planen",
				[
					"Wegreissen",
					"Verstecken",
					"Schimpfen"
				],
				"Fair heisst: Alle werden gesehen.",
				"Bausteine zwischen zwei Kindern",
				"Fairness"
			],
			[
				"Ein Geheimnis fuehlt sich schwer und unsicher an. Was ist gut?",
				"Mit einer vertrauten erwachsenen Person sprechen",
				[
					"Allein bleiben",
					"Nichts sagen duerfen",
					"Sich schuldig fuehlen"
				],
				"Bei Unsicherheit darf man Hilfe holen.",
				"Licht im Zimmer",
				"Sicherheit"
			],
			[
				"Was ist Mut?",
				"Etwas versuchen, obwohl es kribbelt",
				[
					"Nie Angst haben",
					"Immer gewinnen",
					"Andere klein machen"
				],
				"Mut und Angst koennen gleichzeitig da sein.",
				"kleine Buehne",
				"Mut"
			]
		]),
		collection("premium-miteinander", "Miteinander-Werkstatt", "🤝", "bg-emerald-400", "heart", [
			[
				"Was zeigt gutes Zuhoeren?",
				"Blick, Ruhe und nachfragen",
				[
					"Unterbrechen",
					"Weglaufen",
					"Lachen"
				],
				"Zuhoeren ist ein Geschenk.",
				"Gespraechskreis",
				"Empathie"
			],
			[
				"Ein Fehler passiert. Was hilft beim Reparieren?",
				"Entschuldigen und neu versuchen",
				[
					"Leugnen",
					"Beschuldigen",
					"Wegschauen"
				],
				"Fehler koennen repariert werden.",
				"zerbrochener Turm wird neu gebaut",
				"Reparatur"
			],
			[
				"Was ist ein freundlicher Stopp-Satz?",
				"Stopp, ich moechte das nicht.",
				[
					"Du bist gemein!",
					"Ich hasse alles!",
					"Verschwinde fuer immer!"
				],
				"Klar und ruhig kann stark sein.",
				"Handzeichen",
				"Grenzwort"
			],
			[
				"Was macht eine Gruppe stark?",
				"Jede Person darf etwas beitragen",
				[
					"Nur eine Person bestimmt alles",
					"Niemand hoert zu",
					"Alle lachen ueber Fehler"
				],
				"Gemeinsam wird mehr moeglich.",
				"Teamteppich",
				"Kooperation"
			],
			[
				"Du merkst: Ich brauche Pause. Was darfst du tun?",
				"Eine Pause nehmen und Bescheid sagen",
				[
					"Einfach verschwinden",
					"Andere erschrecken",
					"Mich zwingen"
				],
				"Pausen helfen dem Nervensystem.",
				"Ruheinsel",
				"Achtsamkeit"
			],
			[
				"Was ist ein gutes Kompliment?",
				"Du hast dir Muehe gegeben.",
				[
					"Du bist nur gut, wenn du gewinnst.",
					"Alle anderen sind schlecht.",
					"Du musst perfekt sein."
				],
				"Komplimente koennen Druck vermeiden.",
				"Sonnenkarte",
				"Sprache"
			]
		]),
		collection("premium-tiefe-fragen", "Tiefe Fragen", "🕯️", "bg-indigo-400", "heart", [
			[
				"Wenn etwas traurig ist: Darf Traurigkeit da sein?",
				"Ja, sie darf da sein und braucht Begleitung.",
				[
					"Nein, sie ist verboten.",
					"Nur Erwachsene duerfen traurig sein.",
					"Man muss sie wegdruecken."
				],
				"Gefuehle sind Signale, keine Fehler.",
				"kleine Kerze",
				"Gefuehl"
			],
			[
				"Was hilft, wenn Gedanken sehr laut werden?",
				"Langsam atmen und Hilfe holen",
				[
					"Alles allein schaffen muessen",
					"Noch schneller denken",
					"Sich verstecken fuer immer"
				],
				"Laute Gedanken brauchen oft Ruhe und Verbindung.",
				"Sternenhimmel",
				"Beruhigung"
			],
			[
				"Was kann man tun, wenn man sich schuldig fuehlt?",
				"Mit einer sicheren Person sprechen und sortieren",
				[
					"Sich selbst beschimpfen",
					"Nie wieder reden",
					"Alles vergessen muessen"
				],
				"Schuldgefuehle brauchen Klarheit, nicht Strafe.",
				"Gesprächsplatz",
				"Verstehen"
			],
			[
				"Was bedeutet Vertrauen?",
				"Ich darf sicher sein und ernst genommen werden.",
				[
					"Ich muss alles tun.",
					"Ich darf nie Nein sagen.",
					"Ich darf keine Fragen stellen."
				],
				"Vertrauen hat mit Sicherheit zu tun.",
				"Bruecke im Morgenlicht",
				"Sicherheit"
			],
			[
				"Was hilft nach einem Streit?",
				"Zeit, Zuhoeren und Wiedergutmachen",
				[
					"Gewinnen muessen",
					"Immer recht haben",
					"Nie mehr reden"
				],
				"Reparatur braucht manchmal kleine Schritte.",
				"reparierte Papierbruecke",
				"Konflikt"
			],
			[
				"Was kann Hoffnung sein?",
				"Ein kleiner naechster guter Schritt",
				[
					"Ein Zauber, der alles sofort loest",
					"Ein Befehl",
					"Ein Wettbewerb"
				],
				"Hoffnung darf klein anfangen.",
				"kleiner gruenender Samen",
				"Hoffnung"
			]
		])
	],
	musik: [
		collection("premium-klangbilder", "Klangbilder", "🎨", "bg-fuchsia-400", "music", [
			[
				"Welcher Klang passt zu Regentropfen?",
				"Glockenspiel",
				[
					"Tuba",
					"Bassdrum",
					"Laute Hupe"
				],
				"Helle kurze Toene koennen tropfen.",
				"Regentropfen auf Fenster",
				"Klangbild"
			],
			[
				"Welches Instrument klingt oft gestrichen?",
				"Geige",
				[
					"Trommel",
					"Rassel",
					"Triangel"
				],
				"Der Bogen streicht ueber Saiten.",
				"Geige mit Bogen",
				"Instrument"
			],
			[
				"Was bedeutet piano in der Musik?",
				"leise",
				[
					"laut",
					"schnell",
					"hoeher"
				],
				"Piano heisst leise.",
				"leise Klangwelle",
				"Dynamik"
			],
			[
				"Was bedeutet forte?",
				"laut",
				[
					"langsam",
					"kurz",
					"traurig"
				],
				"Forte hat Kraft.",
				"kraeftige Klangwelle",
				"Dynamik"
			],
			[
				"Welcher Klang passt zu einem Wiegenlied?",
				"sanft und ruhig",
				[
					"hart und hektisch",
					"sehr schrill",
					"stampfend"
				],
				"Wiegenlieder beruhigen.",
				"Mond und Noten",
				"Stimmung"
			],
			[
				"Welches Instrument hat Tasten?",
				"Klavier",
				[
					"Floete",
					"Trommel",
					"Gitarre"
				],
				"Man drueckt Tasten.",
				"Klavier",
				"Instrument"
			]
		]),
		collection("premium-rhythmuslabor", "Rhythmuslabor", "🥁", "bg-amber-400", "music", [
			[
				"Welches Muster passt: klatsch - pause - klatsch?",
				"ta - ruhe - ta",
				[
					"ta - ta - ta",
					"ruhe - ruhe - ta",
					"ta - ta - ruhe"
				],
				"Eine Pause ist auch Musik.",
				"Rhythmuskarten",
				"Rhythmus"
			],
			[
				"Was ist ein Takt?",
				"Ein geordneter Abschnitt in der Musik",
				[
					"Ein sehr lauter Ton",
					"Ein Instrument",
					"Ein Bild"
				],
				"Takte ordnen Musik.",
				"Taktstriche",
				"Ordnung"
			],
			[
				"Was macht ein Dirigent?",
				"Er gibt Einsatz und Tempo",
				[
					"Er malt die Wand",
					"Er stimmt nur die Trommel",
					"Er versteckt Noten"
				],
				"Haende zeigen viel.",
				"Dirigierbewegung",
				"Orchester"
			],
			[
				"Was bedeutet schneller werden?",
				"accelerando",
				[
					"piano",
					"legato",
					"staccato"
				],
				"Das Tempo nimmt zu.",
				"laufende Noten",
				"Tempo"
			],
			[
				"Was bedeutet langsam?",
				"adagio",
				[
					"forte",
					"presto",
					"laut"
				],
				"Adagio ist ruhig langsam.",
				"ruhiger Fluss",
				"Tempo"
			],
			[
				"Was ist eine Wiederholung im Rhythmus?",
				"Ein Muster kommt noch einmal",
				[
					"Alles ist neu",
					"Es wird still fuer immer",
					"Nur ein Ton bleibt"
				],
				"Muster helfen beim Mitmachen.",
				"Musterband",
				"Muster"
			]
		]),
		collection("premium-orchester", "Orchesterreise", "🎻", "bg-rose-400", "music", [
			[
				"Welche Instrumentengruppe hat Saiten?",
				"Streicher",
				[
					"Blechblaeser",
					"Schlagwerk",
					"Tasten allein"
				],
				"Geige und Cello haben Saiten.",
				"Streichergruppe",
				"Familie"
			],
			[
				"Welche Gruppe bläst Luft durch ein Mundstueck?",
				"Blechblaeser",
				[
					"Streicher",
					"Schlagwerk",
					"Tasten"
				],
				"Trompete und Posaune gehoeren dazu.",
				"Trompete",
				"Familie"
			],
			[
				"Was gehoert zum Schlagwerk?",
				"Trommel",
				[
					"Floete",
					"Geige",
					"Cello"
				],
				"Man schlaegt, schuettelt oder streicht manche Schlaginstrumente.",
				"Trommelset",
				"Instrument"
			],
			[
				"Welche Stimme klingt meist tief?",
				"Bass",
				[
					"Sopran",
					"Fluesterstimme",
					"Pfeifen"
				],
				"Bass ist tief.",
				"tiefe Klanglinie",
				"Stimme"
			],
			[
				"Was ist ein Duett?",
				"Zwei musizieren zusammen",
				[
					"Vierzig schweigen",
					"Ein Ton allein",
					"Ein Bild klingt"
				],
				"Duo bedeutet zwei.",
				"zwei Musikstaender",
				"Ensemble"
			],
			[
				"Was ist Improvisieren?",
				"Musik im Moment erfinden",
				[
					"Alles auswendig vergessen",
					"Nie zuhoeren",
					"Nur die Uhr anschauen"
				],
				"Erfinden kann trotzdem aufmerksam sein.",
				"freie Noten",
				"Kreativitaet"
			]
		])
	]
};
var getPremiumCollections = (subject) => PREMIUM_GAME_CONTENT[subject] || [];
var generatedCollectionMeta = {
	deutsch: [
		"premium-sprachfundus",
		"Premium-Sprachfundus",
		"📚",
		"bg-orange-500",
		"language"
	],
	mathe: [
		"premium-zahlenfundus",
		"Premium-Zahlenfundus",
		"🧮",
		"bg-sky-500",
		"math"
	],
	sachunterricht: [
		"premium-forscherfundus",
		"Premium-Forscherfundus",
		"🔬",
		"bg-emerald-500",
		"world"
	],
	ethik: [
		"premium-herzfundus",
		"Premium-Herzfundus",
		"🫶",
		"bg-pink-500",
		"heart"
	],
	musik: [
		"premium-klangfundus",
		"Premium-Klangfundus",
		"🎼",
		"bg-fuchsia-500",
		"music"
	]
};
var getGeneratedPremiumCollection = (subject) => {
	const items = PREMIUM_GAME_CONTENT$1[subject] || [];
	const [id, label, icon, color, scene] = generatedCollectionMeta[subject] || [
		"premium-fundus",
		"Premium-Fundus",
		"✦",
		"bg-slate-600",
		"default"
	];
	return {
		id,
		label,
		icon,
		color,
		items: items.map((item, index) => ({
			...item,
			prompt: item.prompt,
			answer: item.answer,
			options: optionSet(item.answer, item.options || []),
			support: item.support,
			imageCue: item.imageCue,
			scene: item.scene || scene,
			challenge: item.challenge || `premium-${index + 1}`
		}))
	};
};
var withPremiumCollections = (subject, baseCollections = []) => [
	...baseCollections,
	...getPremiumCollections(subject),
	getGeneratedPremiumCollection(subject)
];
//#endregion
export { getDeepLearningPack as n, withPremiumCollections as t };
