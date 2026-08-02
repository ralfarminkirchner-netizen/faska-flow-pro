import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as motion } from "./proxy--6s_pC9q.js";
import { V as AnimatePresence, a as playCoin, h as playJingle, l as playError, w as playPop, z as playWhoosh } from "./sounds-Dh98eEYj.js";
import { i as useReducedMotion, n as createLucideIcon, r as confetti_module_default, t as Star } from "./star-DBCbE8d7.js";
import { p as RotateCw, s as SUBJECT_VARIANT_CONTENT } from "./learningContent-D1WsycQZ.js";
import { t as WandSparkles } from "./wand-sparkles-CtIcwwM8.js";
import { t as ANIMAL_FRIENDS } from "./animalFriends-U19Ro3hF.js";
import { n as getDeepLearningPack, t as withPremiumCollections } from "./premiumGamePack-CHz1F5u_.js";
var ArrowRight = createLucideIcon("arrow-right", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "m12 5 7 7-7 7",
	key: "xquz4c"
}]]);
var BookOpen = createLucideIcon("book-open", [["path", {
	d: "M12 7v14",
	key: "1akyts"
}], ["path", {
	d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
	key: "ruj8y"
}]]);
var Brain = createLucideIcon("brain", [
	["path", {
		d: "M12 18V5",
		key: "adv99a"
	}],
	["path", {
		d: "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4",
		key: "1e3is1"
	}],
	["path", {
		d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5",
		key: "1gqd8o"
	}],
	["path", {
		d: "M17.997 5.125a4 4 0 0 1 2.526 5.77",
		key: "iwvgf7"
	}],
	["path", {
		d: "M18 18a4 4 0 0 0 2-7.464",
		key: "efp6ie"
	}],
	["path", {
		d: "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517",
		key: "1gq6am"
	}],
	["path", {
		d: "M6 18a4 4 0 0 1-2-7.464",
		key: "k1g0md"
	}],
	["path", {
		d: "M6.003 5.125a4 4 0 0 0-2.526 5.77",
		key: "q97ue3"
	}]
]);
var CircleCheck = createLucideIcon("circle-check", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]);
var Eye = createLucideIcon("eye", [["path", {
	d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
	key: "1nclc0"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "3",
	key: "1v7zrd"
}]]);
var Lightbulb = createLucideIcon("lightbulb", [
	["path", {
		d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
		key: "1gvzjb"
	}],
	["path", {
		d: "M9 18h6",
		key: "x1upvd"
	}],
	["path", {
		d: "M10 22h4",
		key: "ceow96"
	}]
]);
var Puzzle = createLucideIcon("puzzle", [["path", {
	d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",
	key: "w46dr5"
}]]);
var Search = createLucideIcon("search", [["path", {
	d: "m21 21-4.34-4.34",
	key: "14j7rj"
}], ["circle", {
	cx: "11",
	cy: "11",
	r: "8",
	key: "4ej97u"
}]]);
var ShieldCheck = createLucideIcon("shield-check", [["path", {
	d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
	key: "oel41y"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]);
//#endregion
//#region src/components/games/DeepLearningQuest.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var MotionButton = motion.button;
var SUBJECT_THEMES = {
	deutsch: {
		title: "Sprach-Detektiv",
		kicker: "Wörter, Sätze, Bedeutung",
		background: "/faska-flow-pro/premium-sky/backgrounds/sky-morning.jpg",
		sprite: "/faska-flow-pro/premium-sky/sprites/story-book.png",
		accent: "#f59e0b",
		dark: "#7c2d12",
		glow: "rgba(245, 158, 11, .28)",
		gradient: "from-amber-50 via-white to-cyan-50",
		companionOffset: 7,
		method: "Lies langsam. Prüfe Wort, Klang und Sinn im ganzen Satz.",
		transfer: "Ich kann meine Antwort mit Wort, Satz und Spur begründen.",
		wrongTransfers: ["Ich rate schnell und wechsle sofort.", "Ich schaue nur auf die schönste Karte."]
	},
	mathe: {
		title: "Zahlen-Architekt",
		kicker: "Material, Muster, Beweis",
		background: "/faska-flow-pro/premium-sky/backgrounds/sky-rainbow.jpg",
		sprite: "/faska-flow-pro/premium-sky/sprites/number-balloon.png",
		accent: "#0ea5e9",
		dark: "#075985",
		glow: "rgba(14, 165, 233, .3)",
		gradient: "from-sky-50 via-white to-amber-50",
		companionOffset: 2,
		method: "Lege die Menge in Gedanken. Suche Schritt, Stelle oder Muster.",
		transfer: "Ich kann zeigen, welcher Rechenschritt die Lösung trägt.",
		wrongTransfers: ["Ich nehme die größte Zahl.", "Ich wähle, was am lautesten aussieht."]
	},
	sachunterricht: {
		title: "Forscher-Lupe",
		kicker: "Beobachten, erklären, schützen",
		background: "/faska-flow-pro/premium-sky/backgrounds/sky-rain.jpg",
		sprite: "/faska-flow-pro/premium-sky/sprites/leaf-glider.png",
		accent: "#10b981",
		dark: "#065f46",
		glow: "rgba(16, 185, 129, .3)",
		gradient: "from-emerald-50 via-white to-sky-50",
		companionOffset: 8,
		method: "Beobachte ruhig. Verbinde Körper, Ort, Wetter und Verhalten.",
		transfer: "Ich kann erklären, welche Beobachtung zur Antwort passt.",
		wrongTransfers: ["Ich fasse alles sofort an.", "Ich entscheide ohne Hinsehen."]
	},
	ethik: {
		title: "Herz-Kompass",
		kicker: "Gefühl, Grenze, nächster Schritt",
		background: "/faska-flow-pro/premium-sky/backgrounds/sky-sunset.jpg",
		sprite: "/faska-flow-pro/premium-sky/sprites/heart-balloon.png",
		accent: "#ec4899",
		dark: "#831843",
		glow: "rgba(236, 72, 153, .26)",
		gradient: "from-pink-50 via-white to-indigo-50",
		companionOffset: 4,
		method: "Spüre: Was ist sicher, freundlich und klar für alle Beteiligten?",
		transfer: "Ich kann einen ruhigen, sicheren nächsten Schritt wählen.",
		wrongTransfers: ["Ich dränge, bis alle nachgeben.", "Ich tue so, als gäbe es kein Gefühl."]
	},
	musik: {
		title: "Klang-Labor",
		kicker: "Hören, Muster, Ausdruck",
		background: "/faska-flow-pro/premium-sky/backgrounds/sky-aurora.jpg",
		sprite: "/faska-flow-pro/premium-sky/sprites/music-notes.png",
		accent: "#a855f7",
		dark: "#581c87",
		glow: "rgba(168, 85, 247, .28)",
		gradient: "from-fuchsia-50 via-white to-cyan-50",
		companionOffset: 1,
		method: "Höre in Gedanken: Material, Bewegung, Tempo und Klangfarbe.",
		transfer: "Ich kann Klang, Instrument oder Muster mit einem Merkmal begründen.",
		wrongTransfers: ["Ich nehme immer das gleiche Instrument.", "Ich wähle nur nach Farbe."]
	}
};
var FALLBACK_THEME = SUBJECT_THEMES.deutsch;
var EMPTY_COLLECTION = {
	id: "empty",
	label: "Leere Sammlung",
	icon: "✦",
	color: "bg-slate-500",
	items: []
};
var normalizeText = (value) => String(value ?? "").trim();
var unique = (items) => Array.from(new Set(items.map(normalizeText).filter(Boolean)));
var shuffleBySeed = (items, seed) => [...items].map((item, index) => ({
	item,
	sortKey: (index * 37 + seed * 17 + normalizeText(item?.id || item).length * 11) % 101
})).sort((a, b) => a.sortKey - b.sortKey).map(({ item }) => item);
var normalizeCollections = (collections = []) => collections.map((collection, collectionIndex) => ({
	id: collection?.id || `collection-${collectionIndex}`,
	label: collection?.label || collection?.title || `Sammlung ${collectionIndex + 1}`,
	icon: collection?.icon || "✦",
	color: collection?.color || "bg-slate-600",
	items: Array.isArray(collection?.items) ? collection.items.filter((item) => item?.prompt && item?.answer).map((item, itemIndex) => {
		const answer = normalizeText(item.answer);
		const options = unique([answer, ...Array.isArray(item.options) ? item.options : []]).slice(0, 4);
		return {
			...item,
			id: item.id || `${collection?.id || collectionIndex}-${itemIndex}`,
			answer,
			options: options.length >= 2 ? options : [answer]
		};
	}) : []
})).filter((collection) => collection.items.length > 0);
var makeDeck = (collection, seed) => shuffleBySeed(collection?.items || [], seed).map((item, index) => ({
	...item,
	deckId: `${collection.id}-${seed}-${item.id || index}`,
	collectionLabel: collection.label
}));
var subjectFallbackPrompt = (subject) => {
	switch (subject) {
		case "mathe": return "Welche Zahl, Form oder Struktur passt wirklich?";
		case "sachunterricht": return "Welche Beobachtung erklärt die Situation am besten?";
		case "ethik": return "Welcher Schritt ist klar, freundlich und sicher?";
		case "musik": return "Welcher Klang oder welches Muster passt?";
		default: return "Welche Antwort passt zu Wort, Satz und Bedeutung?";
	}
};
var buildClues = (challenge, collection, theme, subject) => {
	const support = normalizeText(challenge?.support) || subjectFallbackPrompt(subject);
	const example = normalizeText(challenge?.example);
	const imageCue = normalizeText(challenge?.imageCue || challenge?.scene);
	const collectionLine = `${collection.icon} ${collection.label}: ${challenge.collectionLabel || collection.label}`;
	return [
		{
			id: "trace",
			label: "Spur",
			icon: Search,
			text: support
		},
		{
			id: "picture",
			label: imageCue ? "Bild" : "Feld",
			icon: Eye,
			text: imageCue ? `Stell dir vor: ${imageCue}.` : collectionLine
		},
		{
			id: "method",
			label: example ? "Probe" : "Werkzeug",
			icon: Lightbulb,
			text: example || theme.method
		}
	];
};
var buildTransferChoices = (theme, challenge, seed) => {
	const support = normalizeText(challenge?.support);
	const answer = normalizeText(challenge?.answer);
	return shuffleBySeed([
		{
			id: "correct",
			text: support ? `Ich begründe mit der Spur: ${support}` : `Ich begründe: ${answer} passt zur Aufgabe.`,
			correct: true
		},
		{
			id: "subject",
			text: theme.transfer,
			correct: true
		},
		...theme.wrongTransfers.map((text, index) => ({
			id: `wrong-${index}`,
			text,
			correct: false
		}))
	].slice(0, 4), seed + answer.length);
};
var getFeedbackText = (challenge, selected) => {
	if (!selected) return "";
	if (selected === challenge.answer) return `Ja: ${challenge.answer}.`;
	return `${selected} passt hier nicht tragfähig. Die Spur zeigt auf ${challenge.answer}.`;
};
function ProgressPath({ progress, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-2",
		"aria-hidden": true,
		children: Array.from({ length: 5 }, (_, index) => {
			const active = index < progress;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					animate: { scale: active ? 1.08 : 1 },
					className: "h-9 w-9 rounded-full border-2 border-white shadow-sm grid place-items-center",
					style: {
						backgroundColor: active ? accent : "rgba(255,255,255,.68)",
						color: active ? "white" : "#94a3b8"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
						size: 16,
						fill: active ? "currentColor" : "none"
					})
				}), index < 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-7 rounded-full bg-white/70" })]
			}, index);
		})
	});
}
function StatPill({ label, value, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 rounded-2xl border border-white/80 bg-white/74 px-4 py-3 shadow-sm backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2 text-slate-400",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-sans text-[10px] font-bold uppercase tracking-[.18em]",
				children: label
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 truncate font-hand text-3xl font-bold",
			style: { color },
			children: value
		})]
	});
}
function DeepLearningQuest({ subject = "deutsch", title, collections, onCorrect = () => {}, onWrong = () => {} }) {
	const shouldReduceMotion = useReducedMotion();
	const theme = SUBJECT_THEMES[subject] || FALLBACK_THEME;
	const baseCollections = (0, import_react.useMemo)(() => collections || withPremiumCollections(subject, SUBJECT_VARIANT_CONTENT[subject]), [collections, subject]);
	const sourceCollections = (0, import_react.useMemo)(() => [...baseCollections, ...getDeepLearningPack(subject)], [baseCollections, subject]);
	const playableCollections = (0, import_react.useMemo)(() => normalizeCollections(sourceCollections), [sourceCollections]);
	const [activeCollectionId, setActiveCollectionId] = (0, import_react.useState)(playableCollections[0]?.id);
	const [seed, setSeed] = (0, import_react.useState)(3);
	const [roundIndex, setRoundIndex] = (0, import_react.useState)(0);
	const [openedClues, setOpenedClues] = (0, import_react.useState)([]);
	const [selectedAnswer, setSelectedAnswer] = (0, import_react.useState)(null);
	const [answerFeedback, setAnswerFeedback] = (0, import_react.useState)(null);
	const [selectedTransfer, setSelectedTransfer] = (0, import_react.useState)(null);
	const [transferFeedback, setTransferFeedback] = (0, import_react.useState)(null);
	const [score, setScore] = (0, import_react.useState)(0);
	const [streak, setStreak] = (0, import_react.useState)(0);
	const [mastery, setMastery] = (0, import_react.useState)(0);
	const activeCollection = playableCollections.find((collection) => collection.id === activeCollectionId) || playableCollections[0] || EMPTY_COLLECTION;
	const deck = (0, import_react.useMemo)(() => makeDeck(activeCollection, seed), [activeCollection, seed]);
	const challenge = deck[roundIndex % Math.max(deck.length, 1)];
	const clues = (0, import_react.useMemo)(() => buildClues(challenge, activeCollection, theme, subject), [
		activeCollection,
		challenge,
		subject,
		theme
	]);
	const transferChoices = (0, import_react.useMemo)(() => buildTransferChoices(theme, challenge || {}, seed), [
		challenge,
		seed,
		theme
	]);
	const companion = ANIMAL_FRIENDS[(roundIndex + seed + theme.companionOffset) % ANIMAL_FRIENDS.length];
	const readyToAnswer = openedClues.length >= 2;
	const totalItems = playableCollections.reduce((sum, collection) => sum + collection.items.length, 0);
	const clearRound = () => {
		setOpenedClues([]);
		setSelectedAnswer(null);
		setAnswerFeedback(null);
		setSelectedTransfer(null);
		setTransferFeedback(null);
	};
	const switchCollection = (collectionId) => {
		if (collectionId === activeCollection.id) return;
		playWhoosh();
		setActiveCollectionId(collectionId);
		setRoundIndex(0);
		setSeed((value) => value + 5);
		clearRound();
	};
	const openClue = (id) => {
		if (openedClues.includes(id)) return;
		playPop();
		setOpenedClues((items) => [...items, id]);
	};
	const chooseAnswer = (option) => {
		if (!challenge || answerFeedback === "richtig" || !readyToAnswer) return;
		setSelectedAnswer(option);
		if (option === challenge.answer) {
			playCoin();
			setAnswerFeedback("richtig");
			return;
		}
		playError();
		setAnswerFeedback("falsch");
		setStreak(0);
		onWrong();
		setTimeout(() => {
			setSelectedAnswer(null);
			setAnswerFeedback(null);
		}, 1400);
	};
	const chooseTransfer = (choice) => {
		if (answerFeedback !== "richtig" || transferFeedback === "richtig") return;
		setSelectedTransfer(choice.id);
		if (!choice.correct) {
			playError();
			setTransferFeedback("falsch");
			onWrong();
			setTimeout(() => {
				setSelectedTransfer(null);
				setTransferFeedback(null);
			}, 1200);
			return;
		}
		const nextStreak = streak + 1;
		const gained = 8 + Math.min(nextStreak, 5) * 2 + openedClues.length;
		setTransferFeedback("richtig");
		setStreak(nextStreak);
		setScore((value) => value + gained);
		setMastery((value) => Math.min(value + 1, 5));
		onCorrect(gained);
		if (nextStreak % 3 === 0) {
			playJingle("combo");
			confetti_module_default({
				particleCount: 120,
				spread: 100,
				origin: { y: .72 }
			});
		} else {
			playJingle("success");
			confetti_module_default({
				particleCount: 70,
				spread: 80,
				origin: { y: .76 }
			});
		}
		setTimeout(() => {
			setRoundIndex((value) => value + 1);
			setSeed((value) => value + 1);
			setMastery((value) => value >= 5 ? 0 : value);
			clearRound();
		}, 1350);
	};
	const reshuffle = () => {
		playJingle("start");
		setRoundIndex(0);
		setSeed((value) => value + 11);
		setScore(0);
		setStreak(0);
		setMastery(0);
		clearRound();
	};
	if (!challenge) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		"data-testid": `deep-learning-quest-${subject}`,
		className: "w-full max-w-6xl mx-auto py-4 md:py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-[38px] border-4 border-white bg-white/72 shadow-2xl paper-texture",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 opacity-90",
					"aria-hidden": true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: theme.background,
							alt: "",
							className: "h-full w-full object-cover",
							loading: "lazy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-[.88]` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0",
							style: { background: "radial-gradient(circle at 18% 20%, rgba(255,255,255,.86), transparent 24%), radial-gradient(circle at 86% 16%, rgba(255,255,255,.54), transparent 18%), radial-gradient(circle at 58% 92%, rgba(255,255,255,.54), transparent 24%)" }
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 flex flex-col gap-6 p-4 md:p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
									animate: shouldReduceMotion ? void 0 : {
										y: [
											0,
											-6,
											0
										],
										rotate: [
											-1.5,
											1.5,
											-1.5
										]
									},
									transition: {
										duration: 4.2,
										repeat: Infinity,
										ease: "easeInOut"
									},
									className: "relative h-24 w-24 shrink-0 rounded-[28px] border-2 border-white/80 bg-white/54 p-2 shadow-xl backdrop-blur",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: theme.sprite,
										alt: "",
										className: "h-full w-full object-contain drop-shadow-md"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-sans text-xs font-bold uppercase tracking-[.22em] text-slate-500",
										children: theme.kicker
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-hand text-5xl font-bold leading-tight text-slate-900 md:text-6xl",
										children: title || theme.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap items-center gap-2 text-slate-500",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-full bg-white/70 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[.16em]",
											children: [totalItems, " Karten"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-white/70 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[.16em]",
											children: "Denken · Beweisen · Übertragen"
										})]
									})
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2 sm:min-w-[410px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatPill, {
										label: "Tiefe",
										value: score,
										color: theme.dark
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatPill, {
										label: "Serie",
										value: `${streak}x`,
										color: "#ea580c"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatPill, {
										label: "Runde",
										value: `${roundIndex % activeCollection.items.length + 1}`,
										color: "#0f766e"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 overflow-x-auto pb-2",
							children: playableCollections.map((collection) => {
								const active = collection.id === activeCollection.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
									whileHover: { y: -2 },
									whileTap: { scale: .96 },
									onClick: () => switchCollection(collection.id),
									className: `flex shrink-0 items-center gap-2 rounded-2xl border-2 px-4 py-3 shadow-sm transition-all ${active ? `${collection.color} border-white text-white ring-2 ring-white` : "border-white/80 bg-white/70 text-slate-600 hover:bg-white"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-2xl",
											children: collection.icon
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-hand text-2xl font-bold leading-none",
											children: collection.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-sans text-[10px] font-bold uppercase tracking-widest ${active ? "text-white/80" : "text-slate-400"}`,
											children: collection.items.length
										})
									]
								}, collection.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,.85fr)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative min-h-[600px] overflow-hidden rounded-[34px] border-4 border-white bg-white/54 shadow-inner",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-0",
									"aria-hidden": true,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute inset-0 opacity-80",
											style: { backgroundImage: "linear-gradient(180deg, rgba(255,255,255,.15), rgba(255,255,255,.72)), radial-gradient(circle at 18% 70%, rgba(52,211,153,.26), transparent 28%), radial-gradient(circle at 84% 78%, rgba(14,165,233,.22), transparent 26%)" }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
											animate: shouldReduceMotion ? void 0 : {
												x: [
													0,
													18,
													0
												],
												y: [
													0,
													-4,
													0
												]
											},
											transition: {
												duration: 7,
												repeat: Infinity,
												ease: "easeInOut"
											},
											className: "absolute left-[8%] top-[10%] h-16 w-36 rounded-full bg-white/64 blur-sm"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
											animate: shouldReduceMotion ? void 0 : {
												x: [
													0,
													-16,
													0
												],
												y: [
													0,
													6,
													0
												]
											},
											transition: {
												duration: 8.5,
												repeat: Infinity,
												ease: "easeInOut"
											},
											className: "absolute right-[8%] top-[18%] h-14 w-32 rounded-full bg-white/58 blur-sm"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-r from-emerald-200/70 via-lime-100/70 to-sky-200/70" })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative z-10 flex min-h-[600px] flex-col justify-between gap-5 p-5 md:p-7",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "max-w-2xl rounded-[30px] border-2 border-white/90 bg-white/82 p-5 shadow-lg backdrop-blur",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 text-slate-400",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-sans text-[11px] font-bold uppercase tracking-[.18em]",
														children: activeCollection.label
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "mt-3 font-hand text-4xl font-bold leading-[1.05] text-slate-900 md:text-5xl",
													children: challenge.prompt
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
												whileHover: {
													rotate: 10,
													scale: 1.05
												},
												whileTap: { scale: .92 },
												onClick: reshuffle,
												className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-white bg-slate-900 text-white shadow-lg",
												"aria-label": "Neu mischen",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { size: 21 })
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid gap-3 sm:grid-cols-3",
											children: clues.map((clue) => {
												const Icon = clue.icon;
												const open = openedClues.includes(clue.id);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
													"data-testid": `deep-clue-${clue.id}`,
													whileHover: {
														y: -4,
														scale: 1.02
													},
													whileTap: { scale: .96 },
													onClick: () => openClue(clue.id),
													className: `min-h-36 rounded-[28px] border-2 p-4 text-left shadow-md transition-all ${open ? "border-white bg-white text-slate-800" : "border-white/70 bg-white/42 text-slate-500 hover:bg-white/72"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "grid h-9 w-9 place-items-center rounded-2xl text-white shadow-sm",
																style: { backgroundColor: theme.accent },
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 18 })
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-hand text-2xl font-bold",
																children: clue.label
															})]
														}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
															size: 19,
															className: "text-emerald-500"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
														mode: "wait",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
															initial: {
																opacity: 0,
																y: 6
															},
															animate: {
																opacity: 1,
																y: 0
															},
															exit: { opacity: 0 },
															className: `mt-3 font-hand text-2xl leading-tight ${open ? "text-slate-700" : "text-slate-400"}`,
															children: open ? clue.text : "antippen"
														}, open ? "open" : "closed")
													})]
												}, clue.id);
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-auto flex items-end justify-between gap-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												animate: shouldReduceMotion ? void 0 : { y: [
													0,
													-8,
													0
												] },
												transition: {
													duration: 3.8,
													repeat: Infinity,
													ease: "easeInOut"
												},
												className: "relative h-36 w-32 md:h-44 md:w-40",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "absolute bottom-2 left-5 right-5 h-8 rounded-full blur-xl",
													style: { backgroundColor: theme.glow }
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: companion.image,
													alt: "",
													className: "relative h-full w-full object-contain drop-shadow-xl"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex min-w-0 flex-1 flex-col items-end gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressPath, {
													progress: mastery,
													accent: theme.accent
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "max-w-md rounded-[26px] border-2 border-white bg-white/76 px-4 py-3 text-right shadow-md backdrop-blur",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-hand text-2xl font-bold text-slate-700",
														children: readyToAnswer ? "Jetzt entscheiden." : "Öffne zwei Spuren."
													})
												})]
											})]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[32px] border-4 border-white bg-white/72 p-5 shadow-lg backdrop-blur",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-4 flex items-center justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Puzzle, {
													size: 20,
													style: { color: theme.accent }
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "font-hand text-3xl font-bold text-slate-800",
													children: "Antwort wählen"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded-full bg-slate-100 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[.16em] text-slate-400",
												children: [openedClues.length, "/3"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid gap-3",
											children: challenge.options.map((option, optionIndex) => {
												const isSelected = selectedAnswer === option;
												const isCorrect = option === challenge.answer;
												const locked = !readyToAnswer;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
													"data-testid": `deep-answer-${optionIndex}`,
													whileHover: !locked ? {
														x: 4,
														scale: 1.01
													} : void 0,
													whileTap: !locked ? { scale: .98 } : void 0,
													disabled: locked,
													onClick: () => chooseAnswer(option),
													className: `min-h-20 rounded-[24px] border-2 px-4 py-4 text-left font-hand text-2xl font-bold leading-tight shadow-sm transition-all md:text-3xl ${isSelected && answerFeedback === "richtig" && isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800" : isSelected && answerFeedback === "falsch" ? "border-rose-300 bg-rose-50 text-rose-800" : locked ? "border-white/70 bg-white/38 text-slate-300" : "border-white bg-white/86 text-slate-700 hover:bg-white"}`,
													children: option
												}, option);
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
											mode: "wait",
											children: selectedAnswer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
												initial: {
													opacity: 0,
													y: 8
												},
												animate: {
													opacity: 1,
													y: 0
												},
												exit: { opacity: 0 },
												className: `mt-4 rounded-[24px] border-2 px-4 py-3 ${answerFeedback === "richtig" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-hand text-2xl font-bold leading-tight",
													children: getFeedbackText(challenge, selectedAnswer)
												})
											}, `${selectedAnswer}-${answerFeedback}`)
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[32px] border-4 border-white bg-white/72 p-5 shadow-lg backdrop-blur",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-4 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
												size: 20,
												style: { color: theme.accent }
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-hand text-3xl font-bold text-slate-800",
												children: "Begründung"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid gap-3",
											children: transferChoices.map((choice) => {
												const active = selectedTransfer === choice.id;
												const enabled = answerFeedback === "richtig";
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
													"data-testid": `deep-transfer-${choice.id}`,
													whileHover: enabled ? {
														x: 4,
														scale: 1.01
													} : void 0,
													whileTap: enabled ? { scale: .98 } : void 0,
													disabled: !enabled,
													onClick: () => chooseTransfer(choice),
													className: `min-h-16 rounded-[22px] border-2 px-4 py-3 text-left font-hand text-xl font-bold leading-tight shadow-sm transition-all ${!enabled ? "border-white/70 bg-white/36 text-slate-300" : active && transferFeedback === "richtig" ? "border-emerald-300 bg-emerald-50 text-emerald-800" : active && transferFeedback === "falsch" ? "border-rose-300 bg-rose-50 text-rose-800" : "border-white bg-white/84 text-slate-700 hover:bg-white"}`,
													children: choice.text
												}, choice.id);
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 flex items-center justify-between gap-3 rounded-[24px] border-2 border-white/80 bg-slate-900 px-4 py-3 text-white shadow-md",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 19 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-hand text-2xl font-bold",
													children: "Verstehen zählt"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 20 })]
										})
									]
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					"aria-hidden": true,
					className: "absolute right-5 top-5 h-16 w-16 rounded-full",
					animate: shouldReduceMotion ? void 0 : {
						scale: [
							1,
							1.14,
							1
						],
						rotate: [
							0,
							8,
							0
						]
					},
					transition: {
						duration: 5.2,
						repeat: Infinity,
						ease: "easeInOut"
					},
					style: { background: `radial-gradient(circle, ${theme.glow}, transparent 68%)` }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, {
					className: "absolute bottom-5 right-6 text-white/70 drop-shadow",
					size: 28,
					"aria-hidden": true
				})
			]
		})
	});
}
//#endregion
export { DeepLearningQuest as default, Search as t };
