import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as motion } from "./proxy--6s_pC9q.js";
import { V as AnimatePresence, a as playCoin, h as playJingle, l as playError, w as playPop, x as playMagicDust, z as playWhoosh } from "./sounds-Dh98eEYj.js";
import { i as useReducedMotion, n as createLucideIcon, r as confetti_module_default, t as Star } from "./star-DBCbE8d7.js";
import { t as Compass } from "./compass-JckdT0FA.js";
import { c as WORD_BANK, p as RotateCw, s as SUBJECT_VARIANT_CONTENT } from "./learningContent-D1WsycQZ.js";
import { t as Sparkles } from "./sparkles-bt2KNUwI.js";
import { t as Trophy } from "./trophy-Ci-hdIiU.js";
import { t as ANIMAL_FRIENDS } from "./animalFriends-U19Ro3hF.js";
import { n as getDeepLearningPack, t as withPremiumCollections } from "./premiumGamePack-CHz1F5u_.js";
var Car = createLucideIcon("car", [
	["path", {
		d: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",
		key: "5owen"
	}],
	["circle", {
		cx: "7",
		cy: "17",
		r: "2",
		key: "u2ysq9"
	}],
	["path", {
		d: "M9 17h6",
		key: "r8uit2"
	}],
	["circle", {
		cx: "17",
		cy: "17",
		r: "2",
		key: "axvx0g"
	}]
]);
var DoorOpen = createLucideIcon("door-open", [
	["path", {
		d: "M11 20H2",
		key: "nlcfvz"
	}],
	["path", {
		d: "M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z",
		key: "au4z13"
	}],
	["path", {
		d: "M11 4H8a2 2 0 0 0-2 2v14",
		key: "74r1mk"
	}],
	["path", {
		d: "M14 12h.01",
		key: "1jfl7z"
	}],
	["path", {
		d: "M22 20h-3",
		key: "vhrsz"
	}]
]);
var Snowflake = createLucideIcon("snowflake", [
	["path", {
		d: "m10 20-1.25-2.5L6 18",
		key: "18frcb"
	}],
	["path", {
		d: "M10 4 8.75 6.5 6 6",
		key: "7mghy3"
	}],
	["path", {
		d: "m14 20 1.25-2.5L18 18",
		key: "1chtki"
	}],
	["path", {
		d: "m14 4 1.25 2.5L18 6",
		key: "1b4wsy"
	}],
	["path", {
		d: "m17 21-3-6h-4",
		key: "15hhxa"
	}],
	["path", {
		d: "m17 3-3 6 1.5 3",
		key: "11697g"
	}],
	["path", {
		d: "M2 12h6.5L10 9",
		key: "kv9z4n"
	}],
	["path", {
		d: "m20 10-1.5 2 1.5 2",
		key: "1swlpi"
	}],
	["path", {
		d: "M22 12h-6.5L14 15",
		key: "1mxi28"
	}],
	["path", {
		d: "m4 10 1.5 2L4 14",
		key: "k9enpj"
	}],
	["path", {
		d: "m7 21 3-6-1.5-3",
		key: "j8hb9u"
	}],
	["path", {
		d: "m7 3 3 6h4",
		key: "1otusx"
	}]
]);
var Target = createLucideIcon("target", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["circle", {
		cx: "12",
		cy: "12",
		r: "6",
		key: "1vlfrh"
	}],
	["circle", {
		cx: "12",
		cy: "12",
		r: "2",
		key: "1c9p78"
	}]
]);
var Zap = createLucideIcon("zap", [["path", {
	d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
	key: "1xq2db"
}]]);
//#endregion
//#region src/data/deutschArcadeFundus.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var WORD_KIND_OPTIONS = [
	"Artikel",
	"Nomen",
	"Verb",
	"Adjektiv",
	"Präposition"
];
var ARTICLE_OPTIONS = [
	"Der",
	"Die",
	"Das",
	"Ein",
	"Eine"
];
var pick = (items, index, size = 4, step = 1) => Array.from({ length: size }, (_, offset) => items[(index + offset * step) % items.length]);
var optionSet$1 = (answer, pool, index = 0, size = 4) => {
	return [...new Set([String(answer), ...pick(pool, index, size + 5, 2).map(String)])].slice(0, size);
};
var wordKindSupport = {
	Artikel: "Artikel begleiten ein Nomen: der, die, das, ein oder eine.",
	Nomen: "Nomen benennen Menschen, Tiere, Dinge, Orte oder Gefühle.",
	Verb: "Verben zeigen, was jemand tut oder was geschieht.",
	Adjektiv: "Adjektive beschreiben, wie etwas ist.",
	Präposition: "Präpositionen zeigen Orte, Richtungen oder Verbindungen."
};
var agents = [
	[
		"Der",
		"neugierige",
		"Forscher"
	],
	[
		"Die",
		"ruhige",
		"Malerin"
	],
	[
		"Das",
		"mutige",
		"Kind"
	],
	[
		"Der",
		"freundliche",
		"Gärtner"
	],
	[
		"Die",
		"kluge",
		"Erfinderin"
	],
	[
		"Das",
		"helle",
		"Mädchen"
	],
	[
		"Der",
		"schnelle",
		"Pilot"
	],
	[
		"Die",
		"wache",
		"Schülerin"
	],
	[
		"Das",
		"starke",
		"Team"
	],
	[
		"Der",
		"achtsame",
		"Arzt"
	],
	[
		"Die",
		"fröhliche",
		"Musikerin"
	],
	[
		"Das",
		"leise",
		"Eichhörnchen"
	],
	[
		"Der",
		"vorsichtige",
		"Fuchs"
	],
	[
		"Die",
		"emsige",
		"Biene"
	],
	[
		"Das",
		"kleine",
		"Pony"
	],
	[
		"Der",
		"mutige",
		"Pinguin"
	],
	[
		"Die",
		"sanfte",
		"Hüterin"
	],
	[
		"Das",
		"geschickte",
		"Kind"
	],
	[
		"Der",
		"geduldige",
		"Bäcker"
	],
	[
		"Die",
		"aufmerksame",
		"Forscherin"
	],
	[
		"Das",
		"neugierige",
		"Känguru"
	],
	[
		"Der",
		"leise",
		"Seefahrer"
	],
	[
		"Die",
		"starke",
		"Tänzerin"
	],
	[
		"Das",
		"freundliche",
		"Murmeltier"
	],
	[
		"Der",
		"klare",
		"Sänger"
	],
	[
		"Die",
		"mutige",
		"Pilotin"
	],
	[
		"Das",
		"wache",
		"Reh"
	],
	[
		"Der",
		"sorgsame",
		"Koch"
	],
	[
		"Die",
		"helle",
		"Gärtnerin"
	],
	[
		"Das",
		"bunte",
		"Chamäleon"
	],
	[
		"Der",
		"ruhige",
		"Roboter"
	],
	[
		"Die",
		"geschickte",
		"Baumeisterin"
	],
	[
		"Das",
		"achtsame",
		"Kind"
	],
	[
		"Der",
		"schnelle",
		"Hase"
	],
	[
		"Die",
		"neugierige",
		"Eule"
	],
	[
		"Das",
		"stille",
		"Reh"
	]
];
var verbs = [
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
	"formt"
];
var places = [
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
	["unter", "dem Sternenzelt"]
];
var objects = [
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
	["spannende", "Bücher"]
];
var sentenceTopics = [
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
	"Himmel"
];
var makeSentenceEntry = (index) => {
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
			[objectNoun, "Nomen"]
		]
	};
};
var DEUTSCH_ARCADE_SENTENCE_BANK = Array.from({ length: 288 }, (_, index) => makeSentenceEntry(index));
var DEUTSCH_ARCADE_WORD_CLASS_ITEMS = DEUTSCH_ARCADE_SENTENCE_BANK.flatMap((entry, sentenceIndex) => entry.words.map(([word, answer], wordIndex) => ({
	id: `fundus-wortart-${sentenceIndex}-${wordIndex}`,
	prompt: `"${word}": Welche Wortart ist das?`,
	answer,
	options: WORD_KIND_OPTIONS,
	support: entry.sentence,
	example: `${entry.topic} · ${wordKindSupport[answer]}`,
	imageCue: "Wortarten-Sprung",
	scene: "Wortarten-Fundus",
	challenge: "word-class-fundus-xl"
})));
var DEUTSCH_ARCADE_SENTENCE_ITEMS = Array.from({ length: 420 }, (_, index) => {
	const entry = DEUTSCH_ARCADE_SENTENCE_BANK[index % DEUTSCH_ARCADE_SENTENCE_BANK.length];
	const endings = DEUTSCH_ARCADE_SENTENCE_BANK.map((sentence) => sentence.ending);
	return {
		id: `fundus-satzlauf-${index}`,
		prompt: `Was passt weiter: ${entry.opening} ...`,
		answer: entry.ending,
		options: optionSet$1(entry.ending, endings, index, 4),
		support: entry.sentence,
		example: entry.topic,
		imageCue: "Satz-Tor",
		scene: "Satzlauf-Fundus",
		challenge: "sentence-meaning-fundus-xl"
	};
});
var DEUTSCH_ARCADE_SENTENCE_SLOT_ITEMS = Array.from({ length: 260 }, (_, index) => {
	const [article, adjective, noun] = agents[index % agents.length];
	const verb = verbs[(index * 7 + 4) % verbs.length];
	const [objectAdjective, objectNoun] = objects[(index * 9 + 6) % objects.length];
	const answerPool = pick(verbs, index + 3, 10, 3);
	const sentence = `${article} ${adjective} ${noun} ${verb} ${objectAdjective} ${objectNoun}.`;
	return {
		id: `fundus-satzluecke-${index}`,
		prompt: `Fahre das Wort in die Lücke: ${article} ${adjective} ${noun} ___ ${objectAdjective} ${objectNoun}.`,
		answer: verb,
		options: optionSet$1(verb, answerPool, index, 4),
		support: sentence,
		example: "Verb im Satz",
		imageCue: "Satz-Lücke",
		scene: "Satz-Taxi",
		challenge: "sentence-slot-taxi-xl",
		taxiCargo: verb
	};
});
var routePlaces = [
	[
		"Brücke",
		"die Brücke führt über Wasser",
		"🌉"
	],
	[
		"Garten",
		"im Garten wachsen Pflanzen",
		"🌿"
	],
	[
		"Schule",
		"in der Schule lernen Kinder",
		"🏫"
	],
	[
		"Insel",
		"eine Insel liegt im Wasser",
		"🏝️"
	],
	[
		"Baum",
		"der Baum hat Stamm und Blätter",
		"🌳"
	],
	[
		"Haus",
		"im Haus wohnen Menschen",
		"🏠"
	],
	[
		"Bach",
		"ein Bach ist kleines fließendes Wasser",
		"💧"
	],
	[
		"Wiese",
		"auf der Wiese wächst Gras",
		"🌱"
	],
	[
		"Mond",
		"der Mond steht am Nachthimmel",
		"🌙"
	],
	[
		"Sonne",
		"die Sonne leuchtet am Himmel",
		"☀️"
	],
	[
		"Stern",
		"ein Stern leuchtet in der Nacht",
		"⭐"
	],
	[
		"Fenster",
		"durch das Fenster schaut man hinaus",
		"🪟"
	],
	[
		"Tisch",
		"am Tisch kann man arbeiten",
		"🪑"
	],
	[
		"Buch",
		"in einem Buch stehen Wörter",
		"📖"
	],
	[
		"Laterne",
		"eine Laterne macht Licht",
		"🏮"
	],
	[
		"Boot",
		"ein Boot fährt auf Wasser",
		"⛵"
	],
	[
		"Zug",
		"ein Zug fährt auf Schienen",
		"🚂"
	],
	[
		"Fahrrad",
		"ein Fahrrad hat zwei Räder",
		"🚲"
	],
	[
		"Trommel",
		"die Trommel macht Rhythmus",
		"🥁"
	],
	[
		"Glocke",
		"eine Glocke klingt hell",
		"🔔"
	]
];
var DEUTSCH_ARCADE_READING_ROUTE_ITEMS = Array.from({ length: 220 }, (_, index) => {
	const [place, clue, icon] = routePlaces[index % routePlaces.length];
	return {
		id: `fundus-lesefahrt-${index}`,
		prompt: `Lies das Ziel und fahre dorthin: ${place}`,
		answer: place,
		options: optionSet$1(place, routePlaces.map(([name]) => name), index, 4),
		support: clue,
		example: `${icon} ${place}`,
		imageCue: "Lesefahrt Klasse 1",
		scene: "Lesefahrt",
		challenge: "reading-route-taxi-xl",
		taxiCargo: place
	};
});
var DEUTSCH_ARCADE_ARTICLE_ITEMS = WORD_BANK.flatMap((word, index) => {
	const [preposition, placeNoun] = places[(index * 3 + 1) % places.length];
	const articlePool = optionSet$1(word.article, ARTICLE_OPTIONS, index, 4);
	return [{
		id: `fundus-artikel-${word.id}-tor`,
		prompt: `Welcher Artikel passt zu ${word.icon} ${word.word}?`,
		answer: word.article,
		options: articlePool,
		support: `${word.article} ${word.word}`,
		example: word.parts.join(" - "),
		imageCue: "Artikel-Tor",
		scene: "Artikel-Fundus",
		challenge: "article-fundus-xl"
	}, {
		id: `fundus-artikel-${word.id}-satz`,
		prompt: `___ ${word.word} liegt ${preposition} ${placeNoun}.`,
		answer: word.article,
		options: articlePool,
		support: `${word.article} ${word.word} liegt ${preposition} ${placeNoun}.`,
		example: word.category,
		imageCue: "Satz mit Lücke",
		scene: "Artikel-im-Satz",
		challenge: "article-context-fundus-xl"
	}];
});
var DEUTSCH_ARCADE_VOCABULARY_ITEMS = WORD_BANK.flatMap((word, index) => [{
	id: `fundus-regal-${word.id}`,
	prompt: `In welches Wort-Regal gehört ${word.icon} ${word.word}?`,
	answer: word.category,
	options: optionSet$1(word.category, WORD_BANK.map((entry) => entry.category), index, 4),
	support: `${word.word} gehört zu ${word.category}.`,
	example: `${word.syllables} Silben`,
	imageCue: "Wortschatz-Regal",
	scene: "Wortschatz-Fundus",
	challenge: "vocabulary-category-fundus-xl"
}, {
	id: `fundus-anlaut-${word.id}`,
	prompt: `Mit welchem Laut beginnt ${word.icon} ${word.word}?`,
	answer: word.first,
	options: optionSet$1(word.first, WORD_BANK.map((entry) => entry.first), index + 5, 4),
	support: `Sprich langsam: ${word.word}.`,
	example: word.parts.join(" - "),
	imageCue: "Anlaut-Bahn",
	scene: "Laut-Fundus",
	challenge: "sound-fundus-xl"
}]);
//#endregion
//#region src/data/arcadeLearningPack.js
var optionSet = (answer, options) => [...new Set([answer, ...options].map((value) => String(value)))].slice(0, 4);
var collection = (id, label, icon, color, items) => ({
	id,
	label,
	icon,
	color,
	items
});
var item = ({ prompt, answer, options, support, example, imageCue, scene, challenge }) => ({
	prompt,
	answer: String(answer),
	options: optionSet(answer, options),
	support,
	example,
	imageCue,
	scene,
	challenge
});
var buildDeutschPack = () => [
	collection("arcade-lesefahrten-xl", "Lesefahrten", "🚕", "bg-yellow-500", DEUTSCH_ARCADE_READING_ROUTE_ITEMS),
	collection("arcade-satzluecken-taxi-xl", "Satz-Lücken", "🧩", "bg-indigo-500", DEUTSCH_ARCADE_SENTENCE_SLOT_ITEMS),
	collection("arcade-wortarten-fundus-xl", "Wortarten-Fundus", "🏃", "bg-orange-500", DEUTSCH_ARCADE_WORD_CLASS_ITEMS),
	collection("arcade-satzfundus-xl", "Satzfundus", "🌉", "bg-rose-500", DEUTSCH_ARCADE_SENTENCE_ITEMS),
	collection("arcade-artikel-fundus-xl", "Artikel-Fundus", "🌊", "bg-cyan-500", DEUTSCH_ARCADE_ARTICLE_ITEMS),
	collection("arcade-wortschatz-fundus-xl", "Wortschatz-Fundus", "🧺", "bg-emerald-500", DEUTSCH_ARCADE_VOCABULARY_ITEMS)
];
var buildMathePack = () => {
	const quickMathItems = Array.from({ length: 220 }, (_, index) => {
		const a = 4 + index % 18;
		const b = 2 + index * 3 % 9;
		const type = index % 4;
		const answer = type === 0 ? a + b : type === 1 ? a - b : type === 2 ? a * b : a * 10 + b;
		return item({
			prompt: type === 0 ? `${a} + ${b}: Welches Tor stimmt?` : type === 1 ? `${a} - ${b}: Welches Tor stimmt?` : type === 2 ? `${a} Reihen mit ${b}: Wie viele?` : `${a} Zehner und ${b} Einer ergeben?`,
			answer,
			options: [
				answer + 1,
				answer - 1,
				answer + b,
				Math.max(0, answer - b),
				answer + 10
			],
			support: type === 3 ? "Zehner stehen links, Einer rechts." : "Rechne in einem klaren Schritt.",
			example: type === 2 ? `${a} x ${b}` : "Zahlenlauf",
			imageCue: "Zahlentor",
			scene: "Mathe-Arcade",
			challenge: "number-speed-xl"
		});
	});
	const patternItems = Array.from({ length: 180 }, (_, index) => {
		const start = 2 + index % 9;
		const step = 2 + index % 6;
		const answer = start + step * 4;
		return item({
			prompt: `Welche Zahl setzt die Reihe fort: ${start}, ${start + step}, ${start + step * 2}, ${start + step * 3}, __?`,
			answer,
			options: [
				answer - step,
				answer + step,
				answer + 1,
				answer - 1,
				start + step * 5
			],
			support: `Die Reihe springt immer um ${step}.`,
			example: "Muster erkennen",
			imageCue: "Zahlenspur",
			scene: "Musterlauf",
			challenge: "pattern-run-xl"
		});
	});
	return [collection("arcade-rechenblitz-xl", "Rechenblitz XL", "⚡", "bg-sky-500", quickMathItems), collection("arcade-musterlauf-xl", "Musterlauf XL", "〰️", "bg-violet-500", patternItems)];
};
var animals = [
	[
		"Igel",
		"Laubhaufen",
		"Stacheln schützen ihn.",
		"Wald und Garten"
	],
	[
		"Fisch",
		"Wasser",
		"Flossen helfen beim Schwimmen.",
		"Teich"
	],
	[
		"Biene",
		"Blüte",
		"Sie sammelt Nektar.",
		"Wiese"
	],
	[
		"Kamel",
		"Wüste",
		"Es kommt mit Trockenheit gut zurecht.",
		"trockene Gegend"
	],
	[
		"Schnecke",
		"feuchte Blätter",
		"Ihr Haus schützt den weichen Körper.",
		"Garten"
	],
	[
		"Eule",
		"Nacht",
		"Sie sieht und hört sehr gut.",
		"Wald"
	]
];
var weather = [
	[
		"Gewitter",
		"drinnen bleiben",
		"Draußen unter Bäumen ist es gefährlich."
	],
	[
		"starker Regen",
		"Regenjacke",
		"Kleidung kann vor Nässe schützen."
	],
	[
		"Sonne",
		"Schatten und Wasser",
		"Der Körper braucht Schutz und Trinken."
	],
	[
		"Schnee",
		"warme Kleidung",
		"Kälte braucht Schutz."
	],
	[
		"Wind",
		"leichte Dinge sichern",
		"Wind kann Dinge wegtragen."
	],
	[
		"Nebel",
		"langsam und aufmerksam gehen",
		"Man sieht weniger weit."
	]
];
var buildWorldPack = () => {
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
			challenge: "habitat-run-xl"
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
			challenge: "weather-decision-xl"
		});
	});
	return [collection("arcade-lebensraum-xl", "Lebensraum XL", "🌍", "bg-emerald-500", habitatItems), collection("arcade-wetterlauf-xl", "Wetterlauf XL", "🌦️", "bg-sky-500", weatherItems)];
};
var heartMoves = [
	[
		"Jemand sagt Nein.",
		"Grenze achten",
		"Ein Nein darf ernst genommen werden."
	],
	[
		"Ein Kind weint leise.",
		"fragen, ob Hilfe gewünscht ist",
		"Trost braucht Ruhe und Erlaubnis."
	],
	[
		"Du bist sehr wütend.",
		"Abstand nehmen und atmen",
		"Gefühle dürfen da sein, Handlungen sollen sicher bleiben."
	],
	[
		"Zwei wollen denselben Baustein.",
		"abwechseln oder planen",
		"Fair ist, wenn beide gesehen werden."
	],
	[
		"Ein Geheimnis fühlt sich schwer an.",
		"mit sicherer erwachsener Person sprechen",
		"Schwere Geheimnisse muss man nicht allein tragen."
	],
	[
		"Du brauchst Pause.",
		"Pause nehmen und Bescheid sagen",
		"Pausen helfen dem Körper und dem Kopf."
	]
];
var buildEthikPack = () => {
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
			challenge: "safe-step-xl"
		});
	});
	const sentenceItems = Array.from({ length: 160 }, (_, index) => {
		const entries = [
			["Wenn ich Stopp sage, brauche ich", "dass du aufhörst."],
			["Wenn ich traurig bin, hilft mir", "ruhig gefragt zu werden."],
			["Wenn ich einen Fehler mache, darf ich", "es neu versuchen."],
			["Wenn mir etwas unheimlich ist, darf ich", "Hilfe holen."],
			["Wenn ich wütend bin, kann ich", "Abstand nehmen."],
			["Wenn wir streiten, können wir", "später reparieren."]
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
			challenge: "heart-sentence-xl"
		});
	});
	return [collection("arcade-gute-schritte-xl", "Gute Schritte XL", "🫶", "bg-pink-500", situationItems), collection("arcade-herzsaetze-xl", "Herzsätze XL", "💬", "bg-indigo-500", sentenceItems)];
};
var instruments = [
	[
		"Geige",
		"Streicher",
		"Saiten schwingen mit dem Bogen.",
		"gestrichen"
	],
	[
		"Trompete",
		"Blechbläser",
		"Luft schwingt im Mundstück.",
		"strahlend"
	],
	[
		"Trommel",
		"Schlagwerk",
		"Fell wird angeschlagen.",
		"pulsierend"
	],
	[
		"Klavier",
		"Tasteninstrument",
		"Tasten bewegen Hämmer.",
		"klar"
	],
	[
		"Flöte",
		"Holzbläser",
		"Luftkante erzeugt den Ton.",
		"weich"
	],
	[
		"Gitarre",
		"Zupfinstrument",
		"Saiten werden gezupft.",
		"warm"
	]
];
var buildMusikPack = () => {
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
			challenge: "instrument-family-xl"
		});
	});
	const rhythmItems = Array.from({ length: 170 }, (_, index) => {
		const patterns = [
			["ta ta pause ta", "AA-Ruhe-A"],
			["ta ti-ti ta ti-ti", "ABAB"],
			["klatsch stampf klatsch stampf", "ABAB"],
			["leise leise laut", "AAB"],
			["hoch tief hoch tief", "ABAB"],
			["lang kurz kurz", "ABB"]
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
			challenge: "rhythm-pattern-xl"
		});
	});
	return [collection("arcade-instrumente-xl", "Instrumente XL", "🎼", "bg-fuchsia-500", instrumentItems), collection("arcade-rhythmus-xl", "Rhythmus XL", "🥁", "bg-amber-500", rhythmItems)];
};
var ARCADE_LEARNING_PACK = {
	deutsch: buildDeutschPack(),
	mathe: buildMathePack(),
	sachunterricht: buildWorldPack(),
	ethik: buildEthikPack(),
	musik: buildMusikPack()
};
var getArcadeLearningPack = (subject) => ARCADE_LEARNING_PACK[subject] || [];
//#endregion
//#region src/components/games/LearningArcade.jsx
var import_jsx_runtime = require_jsx_runtime();
var MotionButton = motion.button;
var MODE_META = {
	taxi: {
		icon: Car,
		color: "bg-yellow-500",
		short: "Fahr",
		title: "Sprach-Taxi",
		description: "Top-Down fahren, Wort abholen, richtiges Ziel ansteuern."
	},
	ninja: {
		icon: Target,
		color: "bg-slate-900",
		short: "Wirf",
		title: "Ninja-Dojo",
		description: "Shuriken auf die richtige Wortkarte werfen."
	},
	maze: {
		icon: DoorOpen,
		color: "bg-teal-500",
		short: "Such",
		title: "Labyrinth",
		description: "Durch Wege steuern und den passenden Ausgang finden."
	},
	parkour: {
		icon: Zap,
		color: "bg-orange-500",
		short: "Spring"
	},
	snowball: {
		icon: Snowflake,
		color: "bg-sky-500",
		short: "Triff"
	},
	runner: {
		icon: Compass,
		color: "bg-emerald-500",
		short: "Lauf"
	},
	vault: {
		icon: Trophy,
		color: "bg-violet-500",
		short: "Serie"
	}
};
var THEMES = {
	deutsch: {
		title: "Sprach-Arcade",
		kicker: "Wortarten, Bilder, Sätze",
		accent: "#f97316",
		dark: "#431407",
		glow: "rgba(249, 115, 22, .3)",
		background: "/faska-flow-pro/premium-sky/backgrounds/sky-rainbow.jpg",
		sprite: "/faska-flow-pro/premium-sky/sprites/story-book.png",
		friendIndex: 4,
		modeLabels: {
			taxi: "Sprach-Taxi",
			ninja: "Ninja-Dojo",
			maze: "Wort-Labyrinth",
			parkour: "Wortarten-Parkour",
			snowball: "Schneeball-Wörter",
			runner: "Satz-Tore",
			vault: "Sprach-Schatz"
		}
	},
	mathe: {
		title: "Zahlen-Arcade",
		kicker: "Rechnen, Muster, Beweise",
		accent: "#0ea5e9",
		dark: "#075985",
		glow: "rgba(14, 165, 233, .3)",
		background: "/faska-flow-pro/premium-sky/backgrounds/sky-morning.jpg",
		sprite: "/faska-flow-pro/premium-sky/sprites/number-balloon.png",
		friendIndex: 0,
		modeLabels: {
			taxi: "Zahlen-Taxi",
			ninja: "Rechen-Dojo",
			maze: "Zahlen-Labyrinth",
			parkour: "Zahlen-Parkour",
			snowball: "Schneeball-Zahlen",
			runner: "Rechen-Tore",
			vault: "Zahlen-Schatz"
		}
	},
	sachunterricht: {
		title: "Forscher-Arcade",
		kicker: "Natur, Wetter, Lebensräume",
		accent: "#10b981",
		dark: "#064e3b",
		glow: "rgba(16, 185, 129, .3)",
		background: "/faska-flow-pro/premium-sky/backgrounds/sky-rain.jpg",
		sprite: "/faska-flow-pro/premium-sky/sprites/leaf-glider.png",
		friendIndex: 8,
		modeLabels: {
			taxi: "Forscher-Taxi",
			ninja: "Spuren-Dojo",
			maze: "Natur-Labyrinth",
			parkour: "Forscher-Parkour",
			snowball: "Schneeball-Spuren",
			runner: "Natur-Tore",
			vault: "Forscher-Schatz"
		}
	},
	ethik: {
		title: "Herz-Arcade",
		kicker: "Gefühle, Grenzen, gute Schritte",
		accent: "#ec4899",
		dark: "#831843",
		glow: "rgba(236, 72, 153, .28)",
		background: "/faska-flow-pro/premium-sky/backgrounds/sky-sunset.jpg",
		sprite: "/faska-flow-pro/premium-sky/sprites/heart-balloon.png",
		friendIndex: 7,
		modeLabels: {
			taxi: "Herz-Taxi",
			ninja: "Stopp-Dojo",
			maze: "Miteinander-Labyrinth",
			parkour: "Herz-Parkour",
			snowball: "Schneeball-Stopp",
			runner: "Miteinander-Tore",
			vault: "Herz-Schatz"
		}
	},
	musik: {
		title: "Klang-Arcade",
		kicker: "Instrumente, Rhythmus, Klangfarben",
		accent: "#a855f7",
		dark: "#581c87",
		glow: "rgba(168, 85, 247, .3)",
		background: "/faska-flow-pro/premium-sky/backgrounds/sky-aurora.jpg",
		sprite: "/faska-flow-pro/premium-sky/sprites/music-notes.png",
		friendIndex: 1,
		modeLabels: {
			taxi: "Klang-Taxi",
			ninja: "Rhythmus-Dojo",
			maze: "Klang-Labyrinth",
			parkour: "Klang-Parkour",
			snowball: "Schneeball-Klänge",
			runner: "Rhythmus-Tore",
			vault: "Klang-Schatz"
		}
	}
};
var FALLBACK_THEME = THEMES.deutsch;
var COMMON_OPTIONS = {
	deutsch: [
		"Nomen",
		"Verb",
		"Adjektiv",
		"Artikel",
		"Präposition",
		"Der",
		"Die",
		"Das"
	],
	mathe: [
		"10",
		"12",
		"20",
		"24",
		"Kreis",
		"Quadrat",
		"größer",
		"kleiner"
	],
	sachunterricht: [
		"Wasser",
		"Licht",
		"Wiese",
		"Wald",
		"Winter",
		"Frühling",
		"beobachten",
		"schützen"
	],
	ethik: [
		"Stopp sagen",
		"zuhören",
		"Pause nehmen",
		"Hilfe holen",
		"teilen",
		"nachfragen"
	],
	musik: [
		"leise",
		"laut",
		"schnell",
		"langsam",
		"Streicher",
		"Blechbläser",
		"ABAB",
		"AAB"
	]
};
var GAME_WIDTH = 1e3;
var GAME_HEIGHT = 420;
var normalizeText = (value) => String(value ?? "").trim();
var unique = (items) => Array.from(new Set(items.map(normalizeText).filter(Boolean)));
var shuffleBySeed = (items, seed) => [...items].map((item, index) => ({
	item,
	sortKey: (index * 47 + seed * 31 + normalizeText(item?.id || item).length * 13) % 997
})).sort((a, b) => a.sortKey - b.sortKey).map(({ item }) => item);
var normalizeCollections = (collections = [], subject = "deutsch") => collections.map((collection, collectionIndex) => {
	const rawItems = Array.isArray(collection?.items) ? collection.items.filter((item) => item?.prompt && item?.answer) : [];
	const answerPool = unique(rawItems.map((item) => item.answer));
	return {
		id: collection?.id || `arcade-collection-${collectionIndex}`,
		label: collection?.label || collection?.title || `Welt ${collectionIndex + 1}`,
		icon: collection?.icon || "✦",
		color: collection?.color || "bg-slate-700",
		items: rawItems.map((item, itemIndex) => {
			const answer = normalizeText(item.answer);
			const optionsWithAnswer = unique([answer, ...unique([
				answer,
				...Array.isArray(item.options) ? item.options : [],
				...shuffleBySeed(answerPool, itemIndex + collectionIndex * 17),
				...COMMON_OPTIONS[subject] || COMMON_OPTIONS.deutsch
			]).filter((option) => option !== answer)]).slice(0, 4);
			return {
				...item,
				id: item.id || `${collection?.id || collectionIndex}-${itemIndex}`,
				prompt: normalizeText(item.prompt),
				answer,
				options: shuffleBySeed(optionsWithAnswer, itemIndex + answer.length).slice(0, 4),
				support: normalizeText(item.support),
				example: normalizeText(item.example),
				imageCue: normalizeText(item.imageCue)
			};
		})
	};
}).filter((collection) => collection.items.length > 0);
var getSourceCollections = (subject) => [
	...getArcadeLearningPack(subject),
	...withPremiumCollections(subject, SUBJECT_VARIANT_CONTENT[subject] || []),
	...getDeepLearningPack(subject)
];
function StatPill({ label, value, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-sans text-[10px] font-bold uppercase tracking-[.18em] text-slate-400",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-hand text-3xl font-bold leading-none",
			style: { color },
			children: value
		})]
	});
}
function ArcadeSky({ theme, reduceMotion }) {
	const cloudMotion = reduceMotion ? {} : {
		x: [
			0,
			18,
			-10,
			0
		],
		y: [
			0,
			-6,
			4,
			0
		]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			"aria-hidden": true,
			className: "absolute left-[8%] top-[12%] h-12 w-36 rounded-full bg-white/70 blur-[1px]",
			animate: cloudMotion,
			transition: {
				duration: 8,
				repeat: Infinity,
				ease: "easeInOut"
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			"aria-hidden": true,
			className: "absolute right-[12%] top-[18%] h-16 w-44 rounded-full bg-white/65 blur-[1px]",
			animate: reduceMotion ? {} : {
				x: [
					0,
					-14,
					12,
					0
				],
				y: [
					0,
					5,
					-6,
					0
				]
			},
			transition: {
				duration: 9,
				repeat: Infinity,
				ease: "easeInOut"
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "absolute right-10 top-8 h-24 w-24 rounded-full bg-amber-200/80 shadow-[0_0_70px_rgba(253,224,71,.65)]"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "absolute -bottom-10 left-0 right-0 h-44 bg-gradient-to-t from-emerald-500/45 via-lime-300/35 to-transparent"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "absolute bottom-5 left-0 right-0 h-28 rounded-[50%_50%_0_0] bg-emerald-500/35"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: theme.sprite,
			alt: "",
			className: "absolute right-7 bottom-9 h-20 w-20 object-contain opacity-75 drop-shadow-xl",
			draggable: "false"
		})
	] });
}
function FriendPicker({ friends, activeFriend, setFriendIndex, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-w-0 gap-2 overflow-x-auto rounded-[28px] border-2 border-white bg-white/58 p-2 shadow-inner",
		children: friends.map((friend, index) => {
			const active = friend.id === activeFriend.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					playPop();
					setFriendIndex(index);
				},
				className: `h-20 w-16 shrink-0 rounded-2xl border-2 bg-white/85 p-1 shadow-sm transition-all ${active ? "scale-105 border-sky-300 shadow-lg" : "border-white opacity-75 hover:opacity-100"}`,
				"aria-label": `${friend.name} wählen`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: friend.image,
					alt: "",
					className: "mx-auto h-11 w-11 object-contain drop-shadow-sm",
					draggable: "false"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate font-hand text-lg font-bold leading-none",
					style: { color: active ? color : "#64748b" },
					children: friend.name
				})]
			}, friend.id);
		})
	});
}
function CollectionStrip({ collections, activeCollection, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-2 overflow-x-auto rounded-[28px] border-2 border-white bg-white/58 p-2 shadow-inner",
		children: collections.map((collection) => {
			const active = collection.id === activeCollection.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSelect(collection.id),
				className: `min-h-20 w-36 shrink-0 rounded-2xl border-2 px-3 py-2 shadow-sm transition-all sm:w-40 ${active ? `${collection.color} border-white text-white shadow-lg` : "border-white bg-white/85 text-slate-600 hover:bg-white"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-2xl",
						children: collection.icon
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block min-h-10 font-hand text-lg font-bold leading-tight",
						children: collection.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `font-sans text-[10px] font-bold uppercase tracking-wide ${active ? "text-white/75" : "text-slate-400"}`,
						children: collection.items.length
					})
				]
			}, collection.id);
		})
	});
}
function PromptRibbon({ collection, challenge, theme }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative z-20 rounded-[30px] border-2 border-white bg-white/86 p-4 shadow-xl backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-sans text-[10px] font-bold uppercase tracking-[.18em] text-slate-400",
					children: [
						collection.icon,
						" ",
						collection.label
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1 font-hand text-3xl font-bold leading-tight text-slate-800 md:text-4xl",
					children: challenge.prompt
				})]
			}), challenge.imageCue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-48 rounded-2xl bg-slate-900/5 px-3 py-2 text-right font-hand text-xl font-bold text-slate-500",
				children: challenge.imageCue
			})]
		}), (challenge.support || challenge.example) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: [challenge.support && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full bg-white px-4 py-2 font-hand text-xl font-bold shadow-sm",
				style: { color: theme.dark },
				children: challenge.support
			}), challenge.example && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full bg-white/70 px-4 py-2 font-hand text-xl font-bold text-slate-500 shadow-sm",
				children: challenge.example
			})]
		})]
	});
}
function FeedbackBurst({ feedback, challenge, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
		mode: "wait",
		children: feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				y: 18,
				scale: .92
			},
			animate: {
				opacity: 1,
				y: 0,
				scale: 1
			},
			exit: {
				opacity: 0,
				y: -10,
				scale: .94
			},
			className: `absolute bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full border-4 border-white px-6 py-3 font-hand text-3xl font-bold shadow-2xl ${feedback === "richtig" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`,
			children: [feedback === "richtig" ? "Treffer" : `Spur: ${challenge.answer}`, feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
				className: "ml-2 inline",
				size: 24,
				color,
				fill: color
			})]
		}, feedback)
	});
}
function ModeButton({ mode, active, label, onClick }) {
	const Icon = MODE_META[mode].icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
		type: "button",
		whileHover: {
			y: -2,
			scale: 1.03
		},
		whileTap: { scale: .96 },
		onClick,
		className: `flex min-h-16 items-center gap-3 rounded-2xl border-2 px-4 py-3 shadow-md transition-all ${active ? `${MODE_META[mode].color} border-white text-white ring-4 ring-white/70` : "border-white bg-white/78 text-slate-600"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 22 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-hand text-2xl font-bold leading-none",
			children: label
		})]
	});
}
var clamp = (value, min, max) => Math.min(Math.max(value, min), max);
var roundedRect = (ctx, x, y, width, height, radius) => {
	const r = Math.min(radius, width / 2, height / 2);
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + width - r, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + r);
	ctx.lineTo(x + width, y + height - r);
	ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
	ctx.lineTo(x + r, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
};
var wrapCanvasText = (ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) => {
	const words = normalizeText(text).split(/\s+/).filter(Boolean);
	const lines = [];
	let line = "";
	words.forEach((word) => {
		const testLine = line ? `${line} ${word}` : word;
		if (ctx.measureText(testLine).width <= maxWidth || !line) {
			line = testLine;
			return;
		}
		lines.push(line);
		line = word;
	});
	if (line) lines.push(line);
	lines.slice(0, maxLines).forEach((entry, index) => {
		const label = index === maxLines - 1 && lines.length > maxLines ? `${entry.replace(/\s+\S+$/, "")}...` : entry;
		ctx.fillText(label, x, y + index * lineHeight);
	});
};
var rectsOverlap = (a, b, padding = 0) => a.x + padding < b.x + b.w && a.x + a.w - padding > b.x && a.y + padding < b.y + b.h && a.y + a.h - padding > b.y;
var getCargoLabel = (challenge) => {
	const quoted = normalizeText(challenge?.prompt).match(/"([^"]+)"/)?.[1];
	return normalizeText(challenge?.taxiCargo || quoted || challenge?.answer || challenge?.imageCue || "Wort");
};
var getDirectionKey = (key) => {
	if (key === "ArrowUp" || key === "w" || key === "W") return "up";
	if (key === "ArrowDown" || key === "s" || key === "S") return "down";
	if (key === "ArrowLeft" || key === "a" || key === "A") return "left";
	if (key === "ArrowRight" || key === "d" || key === "D") return "right";
	return null;
};
var getControlVector = (controls) => {
	let x = 0;
	let y = 0;
	if (controls.left) x -= 1;
	if (controls.right) x += 1;
	if (controls.up) y -= 1;
	if (controls.down) y += 1;
	const length = Math.hypot(x, y);
	return length > 0 ? {
		x: x / length,
		y: y / length
	} : {
		x: 0,
		y: 0
	};
};
var moveTowardTarget = (player, target, speed, dt) => {
	if (!target) return {
		x: 0,
		y: 0,
		reached: true
	};
	const centerX = player.x + player.w / 2;
	const centerY = player.y + player.h / 2;
	const dx = target.x - centerX;
	const dy = target.y - centerY;
	const distance = Math.hypot(dx, dy);
	if (distance < 10) return {
		x: 0,
		y: 0,
		reached: true
	};
	return {
		x: dx / distance * speed * dt,
		y: dy / distance * speed * dt,
		reached: false
	};
};
var drawCanvasCard = (ctx, x, y, width, height, label, theme, state = "idle") => {
	ctx.save();
	const body = ctx.createLinearGradient(x, y, x, y + height);
	if (state === "hit") {
		body.addColorStop(0, "rgba(236, 253, 245, .98)");
		body.addColorStop(.56, "rgba(167, 243, 208, .94)");
		body.addColorStop(1, "rgba(52, 211, 153, .78)");
	} else if (state === "wrong") {
		body.addColorStop(0, "rgba(255, 241, 242, .98)");
		body.addColorStop(.58, "rgba(254, 205, 211, .92)");
		body.addColorStop(1, "rgba(251, 113, 133, .76)");
	} else {
		body.addColorStop(0, "rgba(255, 255, 255, .98)");
		body.addColorStop(.52, "rgba(248, 250, 252, .88)");
		body.addColorStop(1, "rgba(251, 191, 36, .22)");
	}
	ctx.shadowColor = "rgba(15, 23, 42, .24)";
	ctx.shadowBlur = 22;
	ctx.shadowOffsetY = 12;
	roundedRect(ctx, x, y, width, height, 24);
	ctx.fillStyle = body;
	ctx.strokeStyle = state === "hit" ? "#34d399" : state === "wrong" ? "#fb7185" : "rgba(255,255,255,.98)";
	ctx.lineWidth = 5;
	ctx.fill();
	ctx.stroke();
	ctx.shadowColor = "transparent";
	ctx.save();
	ctx.globalAlpha = .38;
	roundedRect(ctx, x + 10, y + 9, width - 20, Math.max(18, height * .34), 18);
	ctx.fillStyle = "#ffffff";
	ctx.fill();
	ctx.restore();
	ctx.save();
	ctx.globalAlpha = state === "idle" ? .72 : .9;
	ctx.fillStyle = state === "wrong" ? "#fb7185" : state === "hit" ? "#10b981" : theme.accent;
	roundedRect(ctx, x + width / 2 - 35, y + 13, 70, 8, 5);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(x + 18, y + height - 18, 4, 0, Math.PI * 2);
	ctx.arc(x + width - 18, y + height - 18, 4, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
	ctx.fillStyle = state === "hit" ? "#065f46" : state === "wrong" ? "#9f1239" : "#1f2937";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = `800 ${width < 140 ? 25 : 31}px Caveat, Nunito, sans-serif`;
	wrapCanvasText(ctx, label, x + width / 2, y + height / 2 - 8, width - 28, 30, 2);
	ctx.restore();
};
var drawFriend = (ctx, image, player, fallbackColor) => {
	ctx.save();
	ctx.shadowColor = "rgba(15, 23, 42, .32)";
	ctx.shadowBlur = 18;
	ctx.shadowOffsetY = 10;
	if (image?.complete && image.naturalWidth) ctx.drawImage(image, player.x, player.y, player.w, player.h);
	else {
		roundedRect(ctx, player.x, player.y, player.w, player.h, 28);
		ctx.fillStyle = fallbackColor;
		ctx.fill();
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(player.x + player.w * .35, player.y + player.h * .4, 7, 0, Math.PI * 2);
		ctx.arc(player.x + player.w * .65, player.y + player.h * .4, 7, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
};
function CanvasArcadeStage({ mode, challenge, collection, theme, activeFriend, feedback, locked, onPick, roundSeed, reduceMotion }) {
	const canvasRef = (0, import_react.useRef)(null);
	const onPickRef = (0, import_react.useRef)(onPick);
	const feedbackRef = (0, import_react.useRef)(feedback);
	const lockedRef = (0, import_react.useRef)(locked);
	(0, import_react.useEffect)(() => {
		onPickRef.current = onPick;
	}, [onPick]);
	(0, import_react.useEffect)(() => {
		feedbackRef.current = feedback;
		lockedRef.current = locked;
	}, [feedback, locked]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas || !challenge) return void 0;
		const ctx = canvas.getContext("2d");
		const dpr = window.devicePixelRatio || 1;
		canvas.width = GAME_WIDTH * dpr;
		canvas.height = GAME_HEIGHT * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		let animationFrame = 0;
		let last = performance.now();
		const friendImage = new Image();
		friendImage.src = activeFriend.image;
		const pointer = {
			x: GAME_WIDTH / 2,
			y: GAME_HEIGHT / 2
		};
		const controls = {
			up: false,
			down: false,
			left: false,
			right: false
		};
		const optionCount = Math.max(1, challenge.options.length);
		const optionState = {
			hit: null,
			wrong: null
		};
		const particles = [];
		const taxiCargo = getCargoLabel(challenge);
		const destinationSlots = [
			{
				x: 62,
				y: 282,
				w: 190,
				h: 84
			},
			{
				x: 392,
				y: 46,
				w: 205,
				h: 84
			},
			{
				x: 736,
				y: 284,
				w: 200,
				h: 84
			},
			{
				x: 728,
				y: 56,
				w: 205,
				h: 84
			}
		];
		const mazeExitSlots = [
			{
				x: 762,
				y: 46,
				w: 184,
				h: 78
			},
			{
				x: 762,
				y: 292,
				w: 184,
				h: 78
			},
			{
				x: 410,
				y: 174,
				w: 184,
				h: 78
			},
			{
				x: 60,
				y: 54,
				w: 184,
				h: 78
			}
		];
		const mazeWalls = [
			{
				x: 292,
				y: 34,
				w: 24,
				h: 166
			},
			{
				x: 292,
				y: 248,
				w: 24,
				h: 136
			},
			{
				x: 142,
				y: 178,
				w: 246,
				h: 24
			},
			{
				x: 462,
				y: 76,
				w: 24,
				h: 126
			},
			{
				x: 462,
				y: 244,
				w: 24,
				h: 132
			},
			{
				x: 586,
				y: 178,
				w: 248,
				h: 24
			},
			{
				x: 650,
				y: 34,
				w: 24,
				h: 110
			},
			{
				x: 650,
				y: 244,
				w: 24,
				h: 142
			},
			{
				x: 116,
				y: 284,
				w: 226,
				h: 24
			},
			{
				x: 536,
				y: 288,
				w: 220,
				h: 24
			}
		];
		const burst = (x, y, color) => {
			for (let i = 0; i < 18; i += 1) particles.push({
				x,
				y,
				vx: Math.cos(Math.PI * 2 * i / 18) * (80 + i % 4 * 30),
				vy: Math.sin(Math.PI * 2 * i / 18) * (70 + i % 5 * 25),
				life: .7,
				color
			});
		};
		const finishWith = (option, x, y) => {
			if (optionState.hit || optionState.wrong || feedbackRef.current || lockedRef.current) return;
			if (option === challenge.answer) {
				optionState.hit = option;
				burst(x, y, theme.accent);
			} else {
				optionState.wrong = option;
				burst(x, y, "#fb7185");
			}
			onPickRef.current(option);
		};
		const state = {
			parkour: {
				player: {
					x: 122,
					y: 310,
					w: 92,
					h: 102,
					vy: 0,
					onGround: true
				},
				groundY: 396,
				speed: 190,
				platforms: challenge.options.map((option, index) => ({
					option,
					x: 455 + index * 235,
					y: [
						280,
						245,
						304,
						260
					][index % 4],
					w: 178,
					h: 72,
					checked: false
				})),
				distance: 0
			},
			snowball: {
				targets: challenge.options.map((option, index) => ({
					option,
					x: 140 + index * (720 / Math.max(1, optionCount - 1 || 1)),
					y: 72 + index % 2 * 120,
					w: 170,
					h: 86,
					vx: (index % 2 === 0 ? 1 : -1) * (45 + index * 9),
					vy: (index % 2 === 0 ? -1 : 1) * (28 + index * 4)
				})),
				projectiles: [],
				cooldown: 0
			},
			runner: {
				playerLane: 1,
				gateY: 28,
				speed: 155,
				laneFlash: null
			},
			taxi: {
				player: {
					x: 446,
					y: 322,
					w: 78,
					h: 46,
					angle: 0,
					target: null
				},
				pickup: {
					x: 84,
					y: 64,
					w: 218,
					h: 92,
					collected: false
				},
				destinations: challenge.options.map((option, index) => ({
					option,
					...destinationSlots[index % destinationSlots.length]
				})),
				speed: 270
			},
			maze: {
				player: {
					x: 72,
					y: 336,
					w: 62,
					h: 62,
					target: null
				},
				exits: challenge.options.map((option, index) => ({
					option,
					...mazeExitSlots[index % mazeExitSlots.length]
				})),
				speed: 238
			}
		};
		const getCanvasPoint = (event) => {
			const rect = canvas.getBoundingClientRect();
			return {
				x: (event.clientX - rect.left) / rect.width * GAME_WIDTH,
				y: (event.clientY - rect.top) / rect.height * GAME_HEIGHT
			};
		};
		const jump = () => {
			const player = state.parkour.player;
			if (mode !== "parkour" || !player.onGround || optionState.hit || optionState.wrong) return;
			player.vy = -650;
			player.onGround = false;
			playWhoosh();
		};
		const fireSnowball = (targetPoint = pointer) => {
			if (!["snowball", "ninja"].includes(mode) || optionState.hit || optionState.wrong) return;
			const snowball = state.snowball;
			if (snowball.cooldown > 0) return;
			const start = {
				x: GAME_WIDTH / 2,
				y: GAME_HEIGHT - 30
			};
			const dx = targetPoint.x - start.x;
			const dy = targetPoint.y - start.y;
			const length = Math.max(1, Math.hypot(dx, dy));
			snowball.projectiles.push({
				x: start.x,
				y: start.y,
				vx: dx / length * 760,
				vy: dy / length * 760,
				life: 1.2
			});
			snowball.cooldown = .22;
			playWhoosh();
		};
		const setPointerTarget = (targetState, point) => {
			targetState.target = point;
			playWhoosh();
		};
		const setRunnerLane = (lane) => {
			if (mode !== "runner" || optionState.hit || optionState.wrong) return;
			state.runner.playerLane = clamp(lane, 0, challenge.options.length - 1);
			state.runner.laneFlash = state.runner.playerLane;
			playPop();
		};
		const handlePointerMove = (event) => {
			const point = getCanvasPoint(event);
			pointer.x = point.x;
			pointer.y = point.y;
		};
		const handlePointerDown = (event) => {
			const point = getCanvasPoint(event);
			pointer.x = point.x;
			pointer.y = point.y;
			if (mode === "parkour") jump();
			if (mode === "snowball" || mode === "ninja") fireSnowball(point);
			if (mode === "runner") setRunnerLane(Math.floor(point.x / GAME_WIDTH * challenge.options.length));
			if (mode === "taxi") setPointerTarget(state.taxi.player, point);
			if (mode === "maze") setPointerTarget(state.maze.player, point);
		};
		const handleKeyDown = (event) => {
			const direction = getDirectionKey(event.key);
			if ((mode === "taxi" || mode === "maze") && direction) {
				event.preventDefault();
				controls[direction] = true;
			}
			if (event.key === " " || event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
				event.preventDefault();
				if (mode === "parkour") jump();
				if (mode === "snowball" || mode === "ninja") fireSnowball(pointer);
			}
			if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
				event.preventDefault();
				setRunnerLane(state.runner.playerLane - 1);
			}
			if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
				event.preventDefault();
				setRunnerLane(state.runner.playerLane + 1);
			}
			if (/^[1-4]$/.test(event.key)) setRunnerLane(Number(event.key) - 1);
		};
		const handleKeyUp = (event) => {
			const direction = getDirectionKey(event.key);
			if (!direction) return;
			controls[direction] = false;
		};
		const drawBackdrop = (time) => {
			ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
			ctx.save();
			const sky = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
			sky.addColorStop(0, mode === "snowball" ? "rgba(219, 234, 254, .74)" : "rgba(125, 211, 252, .54)");
			sky.addColorStop(.52, mode === "snowball" ? "rgba(240, 249, 255, .52)" : "rgba(186, 230, 253, .32)");
			sky.addColorStop(1, "rgba(16, 185, 129, .18)");
			ctx.fillStyle = sky;
			ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
			ctx.save();
			ctx.globalAlpha = .55;
			ctx.fillStyle = "#fde68a";
			ctx.beginPath();
			ctx.arc(GAME_WIDTH - 105, 76, 38 + Math.sin(time / 360) * 3, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = "rgba(253, 230, 138, .55)";
			ctx.lineWidth = 6;
			for (let ray = 0; ray < 12; ray += 1) {
				const angle = Math.PI * 2 * ray / 12 + time / 2600;
				ctx.beginPath();
				ctx.moveTo(GAME_WIDTH - 105 + Math.cos(angle) * 52, 76 + Math.sin(angle) * 52);
				ctx.lineTo(GAME_WIDTH - 105 + Math.cos(angle) * 68, 76 + Math.sin(angle) * 68);
				ctx.stroke();
			}
			ctx.restore();
			ctx.globalAlpha = .5;
			ctx.fillStyle = "#ffffff";
			for (let i = 0; i < 10; i += 1) {
				const x = (time * .018 + i * 142) % 1160 - 80;
				const y = 30 + i % 4 * 42;
				ctx.beginPath();
				ctx.ellipse(x, y, 46, 13, 0, 0, Math.PI * 2);
				ctx.ellipse(x + 38, y + 6, 34, 11, 0, 0, Math.PI * 2);
				ctx.ellipse(x - 32, y + 8, 28, 10, 0, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.globalAlpha = 1;
			ctx.save();
			const farHills = ctx.createLinearGradient(0, 180, 0, 320);
			farHills.addColorStop(0, "rgba(34, 197, 94, .18)");
			farHills.addColorStop(1, "rgba(16, 185, 129, .38)");
			ctx.fillStyle = farHills;
			ctx.beginPath();
			ctx.moveTo(0, 265);
			ctx.bezierCurveTo(160, 205, 270, 302, 440, 236);
			ctx.bezierCurveTo(610, 178, 705, 302, 1e3, 216);
			ctx.lineTo(1e3, 420);
			ctx.lineTo(0, 420);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
			ctx.restore();
		};
		const drawParticles = (dt) => {
			for (let i = particles.length - 1; i >= 0; i -= 1) {
				const particle = particles[i];
				particle.life -= dt;
				particle.x += particle.vx * dt;
				particle.y += particle.vy * dt;
				particle.vy += 260 * dt;
				if (particle.life <= 0) {
					particles.splice(i, 1);
					continue;
				}
				ctx.save();
				ctx.globalAlpha = clamp(particle.life / .7, 0, 1);
				ctx.fillStyle = particle.color;
				ctx.beginPath();
				ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2);
				ctx.fill();
				ctx.restore();
			}
		};
		const updateParkour = (dt) => {
			const parkour = state.parkour;
			const player = parkour.player;
			if (!feedbackRef.current && !lockedRef.current && !optionState.hit && !optionState.wrong) {
				parkour.distance += parkour.speed * dt;
				player.vy += 1500 * dt;
				player.y += player.vy * dt;
				if (player.y + player.h >= parkour.groundY) {
					player.y = parkour.groundY - player.h;
					player.vy = 0;
					player.onGround = true;
				}
				parkour.platforms.forEach((platform) => {
					platform.x -= parkour.speed * dt;
					if (platform.x + platform.w < -30) {
						platform.x = Math.max(...parkour.platforms.map((entry) => entry.x)) + 230 + parkour.distance % 50;
						platform.y = 238 + (Math.floor(parkour.distance / 120) + platform.option.length) % 4 * 22;
						platform.checked = false;
					}
					const feet = player.y + player.h;
					const overlapsX = player.x + player.w * .78 > platform.x && player.x + player.w * .24 < platform.x + platform.w;
					const landsOnTop = player.vy >= 0 && feet >= platform.y - 8 && feet <= platform.y + platform.h * .7;
					if (!platform.checked && overlapsX && landsOnTop) {
						platform.checked = true;
						player.y = platform.y - player.h;
						player.vy = 0;
						player.onGround = true;
						finishWith(platform.option, platform.x + platform.w / 2, platform.y + platform.h / 2);
					}
				});
			}
		};
		const drawParkour = (time) => {
			const parkour = state.parkour;
			const player = parkour.player;
			ctx.save();
			const track = ctx.createLinearGradient(0, 292, 0, GAME_HEIGHT);
			track.addColorStop(0, "rgba(21, 128, 61, .48)");
			track.addColorStop(.4, "rgba(22, 101, 52, .58)");
			track.addColorStop(1, "rgba(15, 23, 42, .38)");
			ctx.fillStyle = track;
			roundedRect(ctx, 0, 300, GAME_WIDTH, 120, 0);
			ctx.fill();
			ctx.strokeStyle = "rgba(255,255,255,.56)";
			ctx.lineWidth = 6;
			for (let i = 0; i < 3; i += 1) {
				ctx.beginPath();
				ctx.moveTo(0, 326 + i * 43);
				ctx.lineTo(GAME_WIDTH, 326 + i * 43);
				ctx.stroke();
			}
			ctx.strokeStyle = "rgba(255,255,255,.28)";
			ctx.lineWidth = 4;
			for (let dash = 0; dash < 14; dash += 1) {
				const x = (dash * 92 - time * .12) % 1100 - 80;
				ctx.beginPath();
				ctx.moveTo(x, 382);
				ctx.lineTo(x + 42, 382);
				ctx.stroke();
			}
			parkour.platforms.forEach((platform) => {
				const visualState = optionState.hit === platform.option ? "hit" : optionState.wrong === platform.option ? "wrong" : "idle";
				ctx.save();
				ctx.globalAlpha = .28;
				ctx.fillStyle = "#0f172a";
				ctx.beginPath();
				ctx.ellipse(platform.x + platform.w / 2, platform.y + platform.h + 16, platform.w * .42, 14, 0, 0, Math.PI * 2);
				ctx.fill();
				ctx.restore();
				drawCanvasCard(ctx, platform.x, platform.y, platform.w, platform.h, platform.option, theme, visualState);
			});
			drawFriend(ctx, friendImage, player, theme.accent);
			ctx.fillStyle = "rgba(255,255,255,.78)";
			ctx.font = "800 18px Nunito, sans-serif";
			ctx.textAlign = "left";
			ctx.fillText("SPACE / SPRUNG", 18, 34);
			ctx.fillStyle = theme.accent;
			ctx.fillRect(18, 43, 130 + Math.sin(time / 180) * 20, 5);
			ctx.restore();
		};
		const updateSnowball = (dt) => {
			const snowball = state.snowball;
			snowball.cooldown = Math.max(0, snowball.cooldown - dt);
			if (!feedbackRef.current && !lockedRef.current && !optionState.hit && !optionState.wrong) {
				snowball.targets.forEach((target) => {
					target.x += target.vx * dt;
					target.y += target.vy * dt;
					if (target.x < 40 || target.x + target.w > GAME_WIDTH - 40) target.vx *= -1;
					if (target.y < 18 || target.y + target.h > GAME_HEIGHT - 145) target.vy *= -1;
				});
				for (let projectileIndex = snowball.projectiles.length - 1; projectileIndex >= 0; projectileIndex -= 1) {
					const projectile = snowball.projectiles[projectileIndex];
					projectile.x += projectile.vx * dt;
					projectile.y += projectile.vy * dt;
					projectile.vy += 120 * dt;
					projectile.life -= dt;
					if (projectile.life <= 0 || projectile.x < -30 || projectile.x > GAME_WIDTH + 30 || projectile.y < -40 || projectile.y > GAME_HEIGHT + 40) {
						snowball.projectiles.splice(projectileIndex, 1);
						continue;
					}
					const hitTarget = snowball.targets.find((target) => projectile.x > target.x && projectile.x < target.x + target.w && projectile.y > target.y && projectile.y < target.y + target.h);
					if (hitTarget) {
						snowball.projectiles.splice(projectileIndex, 1);
						finishWith(hitTarget.option, hitTarget.x + hitTarget.w / 2, hitTarget.y + hitTarget.h / 2);
						break;
					}
				}
			}
		};
		const drawSnowball = () => {
			const snowball = state.snowball;
			const isNinja = mode === "ninja";
			ctx.save();
			ctx.fillStyle = isNinja ? "rgba(15, 23, 42, .62)" : "rgba(255,255,255,.62)";
			roundedRect(ctx, 0, GAME_HEIGHT - 80, GAME_WIDTH, 120, 0);
			ctx.fill();
			snowball.targets.forEach((target) => {
				const visualState = optionState.hit === target.option ? "hit" : optionState.wrong === target.option ? "wrong" : "idle";
				drawCanvasCard(ctx, target.x, target.y, target.w, target.h, target.option, theme, visualState);
			});
			snowball.projectiles.forEach((projectile) => {
				ctx.save();
				ctx.shadowColor = isNinja ? "rgba(15, 23, 42, .4)" : "rgba(14, 165, 233, .35)";
				ctx.shadowBlur = 18;
				if (isNinja) {
					ctx.translate(projectile.x, projectile.y);
					ctx.rotate(projectile.life * 18);
					ctx.fillStyle = "#e5e7eb";
					ctx.strokeStyle = "#111827";
					ctx.lineWidth = 3;
					for (let blade = 0; blade < 4; blade += 1) {
						ctx.rotate(Math.PI / 2);
						ctx.beginPath();
						ctx.moveTo(0, 0);
						ctx.lineTo(21, -7);
						ctx.lineTo(13, 0);
						ctx.lineTo(21, 7);
						ctx.closePath();
						ctx.fill();
						ctx.stroke();
					}
					ctx.beginPath();
					ctx.arc(0, 0, 5, 0, Math.PI * 2);
					ctx.fillStyle = "#64748b";
					ctx.fill();
				} else {
					ctx.fillStyle = "#f8fafc";
					ctx.strokeStyle = "#bfdbfe";
					ctx.lineWidth = 4;
					ctx.beginPath();
					ctx.arc(projectile.x, projectile.y, 14, 0, Math.PI * 2);
					ctx.fill();
					ctx.stroke();
				}
				ctx.restore();
			});
			ctx.strokeStyle = theme.accent;
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.arc(pointer.x, pointer.y, 24, 0, Math.PI * 2);
			ctx.moveTo(pointer.x - 36, pointer.y);
			ctx.lineTo(pointer.x - 12, pointer.y);
			ctx.moveTo(pointer.x + 12, pointer.y);
			ctx.lineTo(pointer.x + 36, pointer.y);
			ctx.moveTo(pointer.x, pointer.y - 36);
			ctx.lineTo(pointer.x, pointer.y - 12);
			ctx.moveTo(pointer.x, pointer.y + 12);
			ctx.lineTo(pointer.x, pointer.y + 36);
			ctx.stroke();
			ctx.fillStyle = "rgba(15,23,42,.72)";
			ctx.font = "800 18px Nunito, sans-serif";
			ctx.fillText(isNinja ? "ZIELEN + SHURIKEN" : "ZIELEN + WURF", 18, GAME_HEIGHT - 28);
			ctx.restore();
		};
		const updateRunner = (dt) => {
			const runner = state.runner;
			if (!feedbackRef.current && !lockedRef.current && !optionState.hit && !optionState.wrong) {
				runner.gateY += runner.speed * dt;
				if (runner.gateY >= 266) finishWith(challenge.options[runner.playerLane] || challenge.options[0], 150 + runner.playerLane * 235, GAME_HEIGHT - 110);
			}
		};
		const drawRunner = () => {
			const runner = state.runner;
			ctx.save();
			const laneWidth = GAME_WIDTH / challenge.options.length;
			const road = ctx.createLinearGradient(0, 40, 0, GAME_HEIGHT);
			road.addColorStop(0, "rgba(15, 23, 42, .16)");
			road.addColorStop(1, "rgba(15, 23, 42, .5)");
			ctx.fillStyle = road;
			roundedRect(ctx, 38, 34, GAME_WIDTH - 76, GAME_HEIGHT - 52, 42);
			ctx.fill();
			ctx.strokeStyle = "rgba(255,255,255,.54)";
			ctx.lineWidth = 5;
			for (let i = 1; i < challenge.options.length; i += 1) {
				const x = i * laneWidth;
				ctx.beginPath();
				ctx.moveTo(GAME_WIDTH / 2 + (x - GAME_WIDTH / 2) * .16, 60);
				ctx.lineTo(x, GAME_HEIGHT - 24);
				ctx.stroke();
			}
			challenge.options.forEach((option, index) => {
				const scale = .62 + runner.gateY / 360;
				const width = laneWidth * .6 * scale;
				const height = 78 * scale;
				const x = index * laneWidth + laneWidth / 2 - width / 2;
				const y = runner.gateY;
				drawCanvasCard(ctx, x, y, width, height, option, theme, optionState.hit === option ? "hit" : optionState.wrong === option ? "wrong" : "idle");
			});
			const player = {
				x: runner.playerLane * laneWidth + laneWidth / 2 - 48,
				y: GAME_HEIGHT - 122,
				w: 96,
				h: 104
			};
			ctx.fillStyle = "rgba(255,255,255,.22)";
			roundedRect(ctx, runner.playerLane * laneWidth + 10, GAME_HEIGHT - 142, laneWidth - 20, 130, 26);
			ctx.fill();
			drawFriend(ctx, friendImage, player, theme.accent);
			ctx.fillStyle = "rgba(255,255,255,.82)";
			ctx.font = "800 18px Nunito, sans-serif";
			ctx.textAlign = "left";
			ctx.fillText("←  →  / SPUR", 18, 34);
			ctx.restore();
		};
		const updateTaxi = (dt) => {
			const taxi = state.taxi;
			const player = taxi.player;
			if (feedbackRef.current || lockedRef.current || optionState.hit || optionState.wrong) return;
			const vector = getControlVector(controls);
			let dx = vector.x * taxi.speed * dt;
			let dy = vector.y * taxi.speed * dt;
			if (Math.hypot(vector.x, vector.y) === 0 && player.target) {
				const targetMove = moveTowardTarget(player, player.target, taxi.speed, dt);
				dx = targetMove.x;
				dy = targetMove.y;
				if (targetMove.reached) player.target = null;
			}
			if (dx || dy) {
				player.angle = Math.atan2(dy, dx);
				player.x = clamp(player.x + dx, 30, GAME_WIDTH - player.w - 30);
				player.y = clamp(player.y + dy, 28, GAME_HEIGHT - player.h - 26);
			}
			if (!taxi.pickup.collected && rectsOverlap(player, taxi.pickup, 10)) {
				taxi.pickup.collected = true;
				playPop();
				burst(taxi.pickup.x + taxi.pickup.w / 2, taxi.pickup.y + taxi.pickup.h / 2, theme.accent);
			}
			if (taxi.pickup.collected) {
				const target = taxi.destinations.find((destination) => rectsOverlap(player, destination, 8));
				if (target) finishWith(target.option, target.x + target.w / 2, target.y + target.h / 2);
			}
		};
		const drawTaxi = (time) => {
			const taxi = state.taxi;
			const player = taxi.player;
			ctx.save();
			const asphalt = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
			asphalt.addColorStop(0, "rgba(71, 85, 105, .52)");
			asphalt.addColorStop(1, "rgba(15, 23, 42, .56)");
			ctx.fillStyle = asphalt;
			ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
			ctx.fillStyle = "rgba(255,255,255,.1)";
			for (let block = 0; block < 6; block += 1) {
				roundedRect(ctx, 42 + block % 3 * 318, 28 + Math.floor(block / 3) * 210, 180, 92, 18);
				ctx.fill();
			}
			ctx.strokeStyle = "rgba(255,255,255,.62)";
			ctx.lineWidth = 8;
			ctx.setLineDash([34, 28]);
			ctx.beginPath();
			ctx.moveTo(0, 214);
			ctx.lineTo(GAME_WIDTH, 214);
			ctx.moveTo(500, 0);
			ctx.lineTo(500, GAME_HEIGHT);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.strokeStyle = "rgba(250, 204, 21, .8)";
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.moveTo(0, 236);
			ctx.lineTo(GAME_WIDTH, 236);
			ctx.moveTo(522, 0);
			ctx.lineTo(522, GAME_HEIGHT);
			ctx.stroke();
			taxi.destinations.forEach((destination) => {
				const visualState = optionState.hit === destination.option ? "hit" : optionState.wrong === destination.option ? "wrong" : "idle";
				drawCanvasCard(ctx, destination.x, destination.y, destination.w, destination.h, destination.option, theme, visualState);
			});
			drawCanvasCard(ctx, taxi.pickup.x, taxi.pickup.y, taxi.pickup.w, taxi.pickup.h, taxi.pickup.collected ? `An Bord: ${taxiCargo}` : taxiCargo, theme, taxi.pickup.collected ? "hit" : "idle");
			if (!taxi.pickup.collected) {
				ctx.save();
				ctx.globalAlpha = .76 + Math.sin(time / 180) * .14;
				ctx.strokeStyle = theme.accent;
				ctx.lineWidth = 5;
				ctx.beginPath();
				ctx.arc(taxi.pickup.x + taxi.pickup.w / 2, taxi.pickup.y + taxi.pickup.h / 2, 64, 0, Math.PI * 2);
				ctx.stroke();
				ctx.restore();
			}
			ctx.save();
			ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
			ctx.rotate(player.angle);
			ctx.shadowColor = "rgba(15, 23, 42, .38)";
			ctx.shadowBlur = 18;
			ctx.shadowOffsetY = 10;
			roundedRect(ctx, -player.w / 2, -player.h / 2, player.w, player.h, 15);
			ctx.fillStyle = "#facc15";
			ctx.fill();
			ctx.strokeStyle = "#fef3c7";
			ctx.lineWidth = 4;
			ctx.stroke();
			ctx.fillStyle = "#111827";
			roundedRect(ctx, -24, -16, 30, 32, 7);
			ctx.fill();
			ctx.fillStyle = "#f8fafc";
			ctx.font = "800 13px Nunito, sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("TAXI", 20, 0);
			ctx.fillStyle = "#0f172a";
			[-30, 30].forEach((x) => {
				roundedRect(ctx, x - 9, -28, 18, 10, 5);
				ctx.fill();
				roundedRect(ctx, x - 9, 18, 18, 10, 5);
				ctx.fill();
			});
			ctx.restore();
			if (taxi.pickup.collected) {
				ctx.fillStyle = "rgba(255,255,255,.9)";
				ctx.font = "800 20px Caveat, Nunito, sans-serif";
				ctx.textAlign = "center";
				ctx.fillText(taxiCargo, player.x + player.w / 2, player.y - 12);
			}
			ctx.fillStyle = "rgba(255,255,255,.84)";
			ctx.font = "800 18px Nunito, sans-serif";
			ctx.textAlign = "left";
			ctx.fillText("WASD / PFEILE / TIPPE ZUM FAHREN", 18, GAME_HEIGHT - 24);
			ctx.restore();
		};
		const collidesWithMaze = (rect) => mazeWalls.some((wall) => rectsOverlap(rect, wall, 0));
		const moveMazePlayer = (dx, dy) => {
			const player = state.maze.player;
			const nextX = {
				...player,
				x: clamp(player.x + dx, 22, GAME_WIDTH - player.w - 22)
			};
			if (!collidesWithMaze(nextX)) player.x = nextX.x;
			const nextY = {
				...player,
				y: clamp(player.y + dy, 22, GAME_HEIGHT - player.h - 22)
			};
			if (!collidesWithMaze(nextY)) player.y = nextY.y;
		};
		const updateMaze = (dt) => {
			const maze = state.maze;
			const player = maze.player;
			if (feedbackRef.current || lockedRef.current || optionState.hit || optionState.wrong) return;
			const vector = getControlVector(controls);
			let dx = vector.x * maze.speed * dt;
			let dy = vector.y * maze.speed * dt;
			if (Math.hypot(vector.x, vector.y) === 0 && player.target) {
				const targetMove = moveTowardTarget(player, player.target, maze.speed, dt);
				dx = targetMove.x;
				dy = targetMove.y;
				if (targetMove.reached) player.target = null;
			}
			moveMazePlayer(dx, dy);
			const exit = maze.exits.find((entry) => rectsOverlap(player, entry, 8));
			if (exit) finishWith(exit.option, exit.x + exit.w / 2, exit.y + exit.h / 2);
		};
		const drawMaze = (time) => {
			const maze = state.maze;
			ctx.save();
			const floor = ctx.createLinearGradient(0, 0, GAME_WIDTH, GAME_HEIGHT);
			floor.addColorStop(0, "rgba(240, 253, 250, .78)");
			floor.addColorStop(.56, "rgba(236, 254, 255, .58)");
			floor.addColorStop(1, "rgba(255, 251, 235, .7)");
			ctx.fillStyle = floor;
			ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
			mazeWalls.forEach((wall, index) => {
				const shade = ctx.createLinearGradient(wall.x, wall.y, wall.x, wall.y + wall.h);
				shade.addColorStop(0, index % 2 ? "rgba(20, 184, 166, .82)" : "rgba(15, 118, 110, .82)");
				shade.addColorStop(1, "rgba(13, 148, 136, .62)");
				ctx.fillStyle = shade;
				ctx.shadowColor = "rgba(15, 23, 42, .2)";
				ctx.shadowBlur = 14;
				ctx.shadowOffsetY = 8;
				roundedRect(ctx, wall.x, wall.y, wall.w, wall.h, 11);
				ctx.fill();
				ctx.shadowColor = "transparent";
			});
			maze.exits.forEach((exit) => {
				const visualState = optionState.hit === exit.option ? "hit" : optionState.wrong === exit.option ? "wrong" : "idle";
				drawCanvasCard(ctx, exit.x, exit.y, exit.w, exit.h, exit.option, theme, visualState);
			});
			const pulse = 1 + Math.sin(time / 220) * .04;
			ctx.save();
			ctx.translate(maze.player.x + maze.player.w / 2, maze.player.y + maze.player.h / 2);
			ctx.scale(pulse, pulse);
			drawFriend(ctx, friendImage, {
				x: -maze.player.w / 2,
				y: -maze.player.h / 2,
				w: maze.player.w,
				h: maze.player.h
			}, theme.accent);
			ctx.restore();
			ctx.fillStyle = "rgba(15,23,42,.72)";
			ctx.font = "800 18px Nunito, sans-serif";
			ctx.textAlign = "left";
			ctx.fillText("LABYRINTH: ZUM RICHTIGEN AUSGANG", 18, GAME_HEIGHT - 24);
			ctx.restore();
		};
		const loop = (now) => {
			const dt = Math.min((now - last) / 1e3, .033);
			last = now;
			drawBackdrop(now);
			if (mode === "parkour") {
				updateParkour(reduceMotion ? 0 : dt);
				drawParkour(now);
			}
			if (mode === "snowball") {
				updateSnowball(reduceMotion ? 0 : dt);
				drawSnowball(now);
			}
			if (mode === "ninja") {
				updateSnowball(reduceMotion ? 0 : dt);
				drawSnowball(now);
			}
			if (mode === "runner") {
				updateRunner(reduceMotion ? 0 : dt);
				drawRunner(now);
			}
			if (mode === "taxi") {
				updateTaxi(reduceMotion ? 0 : dt);
				drawTaxi(now);
			}
			if (mode === "maze") {
				updateMaze(reduceMotion ? 0 : dt);
				drawMaze(now);
			}
			drawParticles(dt);
			animationFrame = window.requestAnimationFrame(loop);
		};
		canvas.addEventListener("pointermove", handlePointerMove);
		canvas.addEventListener("pointerdown", handlePointerDown);
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		animationFrame = window.requestAnimationFrame(loop);
		return () => {
			window.cancelAnimationFrame(animationFrame);
			canvas.removeEventListener("pointermove", handlePointerMove);
			canvas.removeEventListener("pointerdown", handlePointerDown);
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [
		activeFriend.image,
		challenge,
		feedback,
		locked,
		mode,
		reduceMotion,
		roundSeed,
		theme
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-[620px] overflow-hidden rounded-[42px] border-4 border-white shadow-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneBackground, {
				theme,
				reduceMotion,
				winter: mode === "snowball"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-20 p-4 md:p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptRibbon, {
					collection,
					challenge,
					theme
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "relative z-20 block h-[420px] w-full touch-none",
				"aria-label": `${MODE_META[mode].short}: ${challenge.prompt}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedbackBurst, {
				feedback,
				challenge,
				color: theme.accent
			})
		]
	});
}
function LearningArcade({ subject = "deutsch", onCorrect = () => {}, onWrong = () => {} }) {
	const reduceMotion = useReducedMotion();
	const theme = THEMES[subject] || FALLBACK_THEME;
	const [activeMode, setActiveMode] = (0, import_react.useState)("taxi");
	const [activeCollectionId, setActiveCollectionId] = (0, import_react.useState)(null);
	const [challengeIndex, setChallengeIndex] = (0, import_react.useState)(() => Math.floor(Math.random() * 997));
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [score, setScore] = (0, import_react.useState)(0);
	const [combo, setCombo] = (0, import_react.useState)(0);
	const [hearts, setHearts] = (0, import_react.useState)(4);
	const [friendIndex, setFriendIndex] = (0, import_react.useState)(theme.friendIndex);
	const [roundSeed, setRoundSeed] = (0, import_react.useState)(1);
	const [fullscreenMode, setFullscreenMode] = (0, import_react.useState)(null);
	const sourceCollections = (0, import_react.useMemo)(() => getSourceCollections(subject), [subject]);
	const collections = (0, import_react.useMemo)(() => sourceCollections.map((collection, index) => ({
		id: collection?.id || `arcade-collection-${index}`,
		label: collection?.label || collection?.title || `Welt ${index + 1}`,
		icon: collection?.icon || "✦",
		color: collection?.color || "bg-slate-700",
		items: Array.isArray(collection?.items) ? collection.items : []
	})).filter((collection) => collection.items.length > 0), [sourceCollections]);
	const activeSourceCollection = sourceCollections.find((collection) => collection.id === activeCollectionId) || sourceCollections[0];
	const activeCollection = (0, import_react.useMemo)(() => normalizeCollections(activeSourceCollection ? [activeSourceCollection] : [], subject)[0], [activeSourceCollection, subject]);
	const challenge = activeCollection?.items[challengeIndex % Math.max(1, activeCollection.items.length)];
	const activeFriend = ANIMAL_FRIENDS[friendIndex % ANIMAL_FRIENDS.length] || ANIMAL_FRIENDS[0];
	const totalItems = (0, import_react.useMemo)(() => collections.reduce((sum, collection) => sum + collection.items.length, 0), [collections]);
	const locked = hearts <= 0;
	(0, import_react.useEffect)(() => {
		if (!fullscreenMode) return void 0;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [fullscreenMode]);
	const resetRound = () => {
		playJingle("start");
		setHearts(4);
		setCombo(0);
		setScore(0);
		setSelected(null);
		setFeedback(null);
		setChallengeIndex((index) => index + 1);
		setRoundSeed((seed) => seed + 1);
	};
	const startFullscreenGame = (mode) => {
		playJingle("start");
		setActiveMode(mode);
		setFullscreenMode(mode);
		setHearts(4);
		setCombo(0);
		setScore(0);
		setSelected(null);
		setFeedback(null);
		setRoundSeed((seed) => seed + 1);
	};
	const closeFullscreenGame = () => {
		playWhoosh();
		setFullscreenMode(null);
		setSelected(null);
		setFeedback(null);
		setRoundSeed((seed) => seed + 1);
	};
	const selectMode = (mode) => {
		playWhoosh();
		setActiveMode(mode);
		setSelected(null);
		setFeedback(null);
		setRoundSeed((seed) => seed + 1);
	};
	const selectCollection = (id) => {
		playWhoosh();
		setActiveCollectionId(id);
		setChallengeIndex(0);
		setSelected(null);
		setFeedback(null);
		setCombo(0);
		setRoundSeed((seed) => seed + 1);
	};
	const nextChallenge = () => {
		setChallengeIndex((index) => index + 1);
		setSelected(null);
		setFeedback(null);
		setRoundSeed((seed) => seed + 1);
	};
	const choose = (option) => {
		if (!challenge || feedback || locked) return;
		const correct = option === challenge.answer;
		setSelected(option);
		if (correct) {
			const nextCombo = combo + 1;
			setCombo(nextCombo);
			setScore((value) => value + 40 + Math.min(nextCombo, 8) * 8);
			setFeedback("richtig");
			if (activeMode === "snowball" || activeMode === "ninja") playMagicDust();
			else if (nextCombo % 5 === 0) playJingle("combo");
			else playCoin();
			onCorrect(3 + Math.min(nextCombo, 5));
			if (nextCombo % 5 === 0) confetti_module_default({
				particleCount: 120,
				spread: 95,
				origin: { y: .65 }
			});
			setTimeout(nextChallenge, activeMode === "parkour" ? 980 : 760);
		} else {
			setHearts((value) => Math.max(0, value - 1));
			setCombo(0);
			setFeedback("falsch");
			playError();
			onWrong();
			setTimeout(() => {
				setSelected(null);
				setFeedback(null);
			}, 1050);
		}
	};
	if (!activeCollection || !challenge) return null;
	const renderCanvasGame = (mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CanvasArcadeStage, {
		mode,
		challenge,
		collection: activeCollection,
		theme,
		activeFriend,
		feedback,
		locked,
		onPick: choose,
		roundSeed,
		reduceMotion
	});
	const renderActiveGame = () => activeMode === "vault" ? renderVault() : renderCanvasGame(activeMode);
	const renderLockedOverlay = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		className: "absolute inset-0 z-50 grid place-items-center rounded-[42px] bg-white/78 p-6 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md rounded-[34px] border-4 border-white bg-white p-7 text-center shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-xs font-bold uppercase tracking-[.2em] text-slate-400",
					children: "Runde"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-hand text-5xl font-bold text-slate-900",
					children: [score, " Punkte"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: resetRound,
					className: "mt-5 rounded-full px-8 py-4 font-hand text-3xl font-bold text-white shadow-xl",
					style: { backgroundColor: theme.accent },
					children: "Neu starten"
				})
			]
		})
	}) });
	const renderVault = () => {
		const crystals = Array.from({ length: 5 }, (_, index) => index < Math.min(combo, 5));
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative min-h-[580px] overflow-hidden rounded-[42px] border-4 border-white shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneBackground, {
					theme,
					reduceMotion
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative z-20 p-4 md:p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptRibbon, {
						collection: activeCollection,
						challenge,
						theme
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-20 mx-auto mt-1 flex max-w-3xl flex-col items-center gap-5 px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-3 rounded-full border-2 border-white bg-white/76 px-5 py-3 shadow-xl",
						children: crystals.map((active, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							animate: {
								scale: active ? [
									1,
									1.12,
									1
								] : 1,
								rotate: active ? [
									0,
									10,
									-8,
									0
								] : 0
							},
							transition: { duration: .8 },
							className: `grid h-12 w-12 place-items-center rounded-2xl border-2 border-white shadow-sm ${active ? "bg-amber-300 text-white" : "bg-white/70 text-slate-300"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
								size: 24,
								fill: "currentColor"
							})
						}, index))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid w-full grid-cols-1 gap-3 sm:grid-cols-2",
						children: challenge.options.map((option) => {
							const active = selected === option;
							const correct = option === challenge.answer;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
								type: "button",
								onClick: () => choose(option),
								whileHover: {
									y: -4,
									scale: 1.03
								},
								whileTap: { scale: .96 },
								className: `min-h-28 rounded-[28px] border-4 px-5 py-4 font-hand text-3xl font-bold leading-tight shadow-xl ${active && feedback === "richtig" && correct ? "border-emerald-200 bg-emerald-100 text-emerald-900" : active && feedback === "falsch" ? "border-rose-200 bg-rose-100 text-rose-900" : "border-white bg-white/88 text-slate-800"}`,
								children: option
							}, `${roundSeed}-vault-${option}`);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.img, {
					src: activeFriend.image,
					alt: "",
					className: "absolute bottom-5 left-8 z-30 h-24 w-24 object-contain drop-shadow-2xl md:h-32 md:w-32",
					animate: reduceMotion ? {} : {
						y: [
							0,
							-8,
							0
						],
						rotate: [
							0,
							-3,
							3,
							0
						]
					},
					transition: {
						duration: 2.4,
						repeat: Infinity,
						ease: "easeInOut"
					},
					draggable: "false"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedbackBurst, {
					feedback,
					challenge,
					color: theme.accent
				})
			]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-6xl flex-col gap-6 py-4",
		"data-testid": `learning-arcade-${subject}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-xs font-bold uppercase tracking-[.22em] text-slate-400",
					children: theme.kicker
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-hand text-6xl font-bold leading-none text-slate-900",
					children: theme.title
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2 sm:min-w-[420px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatPill, {
							label: "Karten",
							value: totalItems,
							color: theme.accent
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatPill, {
							label: "Combo",
							value: `${combo}x`,
							color: "#f59e0b"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatPill, {
							label: "Score",
							value: score,
							color: "#10b981"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 lg:grid-cols-[1fr_1.2fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FriendPicker, {
					friends: ANIMAL_FRIENDS,
					activeFriend,
					setFriendIndex,
					color: theme.accent
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionStrip, {
					collections,
					activeCollection,
					onSelect: selectCollection
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-[32px] border-2 border-white bg-white/55 p-3 shadow-inner backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-[10px] font-bold uppercase tracking-[.2em] text-slate-400",
					children: "Spiele-Dock"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-3xl font-bold leading-none text-slate-800",
					children: theme.modeLabels[activeMode]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-2xl bg-white/74 px-4 py-3 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-sans text-[10px] font-bold uppercase tracking-[.18em] text-slate-400",
							children: "Herzen"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-hand text-3xl font-bold text-rose-500",
							children: Array.from({ length: 4 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: index < hearts ? "" : "opacity-20",
								children: "♥"
							}, index))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: resetRound,
							className: "grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-white shadow-md",
							"aria-label": "Runde neu starten",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { size: 18 })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: Object.keys(MODE_META).map((mode) => {
					const meta = MODE_META[mode];
					const Icon = meta.icon;
					const active = activeMode === mode;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
						type: "button",
						whileHover: {
							y: -4,
							scale: 1.02
						},
						whileTap: { scale: .96 },
						onClick: () => startFullscreenGame(mode),
						className: `min-h-36 rounded-[32px] border-4 p-5 text-left shadow-lg transition-all ${active ? `${meta.color} border-white text-white ring-4 ring-white/80` : "border-white bg-white/78 text-slate-700 hover:bg-white"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `mb-4 grid h-12 w-12 place-items-center rounded-2xl border-2 border-white shadow-md ${active ? "bg-white/18" : `${meta.color} text-white`}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 25 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-hand text-4xl font-bold leading-none",
								children: theme.modeLabels[mode]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `mt-3 inline-flex rounded-full px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[.18em] ${active ? "bg-white/20 text-white" : "bg-slate-900 text-white"}`,
								children: "Vollbild"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: meta.description || meta.title
							})
						]
					}, mode);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: fullscreenMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				className: "fixed inset-0 z-[120] overflow-y-auto bg-slate-950/96 p-3 text-white md:p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex min-h-full max-w-7xl flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 rounded-[30px] border border-white/16 bg-white/10 p-3 shadow-2xl backdrop-blur",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-sans text-[10px] font-bold uppercase tracking-[.22em] text-white/45",
								children: activeCollection.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-hand text-4xl font-bold leading-none text-white md:text-5xl",
								children: theme.modeLabels[activeMode]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-white/12 px-4 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-sans text-[10px] font-bold uppercase tracking-[.18em] text-white/45",
										children: "Score"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-hand text-3xl font-bold text-emerald-300",
										children: score
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: closeFullscreenGame,
									className: "rounded-full bg-white px-6 py-3 font-hand text-2xl font-bold text-slate-900 shadow-xl",
									children: "Schließen"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 lg:grid-cols-[1fr_1.2fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FriendPicker, {
								friends: ANIMAL_FRIENDS,
								activeFriend,
								setFriendIndex,
								color: theme.accent
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionStrip, {
								collections,
								activeCollection,
								onSelect: selectCollection
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2 rounded-[28px] border border-white/16 bg-white/10 p-2 shadow-inner backdrop-blur",
							children: Object.keys(MODE_META).map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeButton, {
								mode,
								active: activeMode === mode,
								label: theme.modeLabels[mode],
								onClick: () => selectMode(mode)
							}, mode))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1 pb-4",
							children: [renderActiveGame(), renderLockedOverlay()]
						})
					]
				})
			}, "arcade-fullscreen") })
		]
	});
}
function SceneBackground({ theme, reduceMotion, winter = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-cover bg-center",
			style: { backgroundImage: `linear-gradient(180deg, rgba(255,255,255,.18), rgba(15,23,42,.18)), url(${theme.background})` }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute inset-0 ${winter ? "bg-sky-100/22" : "bg-white/5"}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArcadeSky, {
			theme,
			reduceMotion
		}),
		winter && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/86 via-white/46 to-transparent"
		})
	] });
}
//#endregion
export { LearningArcade as default };
