import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as motion } from "./proxy--6s_pC9q.js";
import { V as AnimatePresence, a as playCoin, h as playJingle, l as playError, w as playPop, z as playWhoosh } from "./sounds-Dh98eEYj.js";
import { i as useReducedMotion, n as createLucideIcon, r as confetti_module_default, t as Star } from "./star-DBCbE8d7.js";
import { t as Compass } from "./compass-JckdT0FA.js";
import { t as Grid3x3 } from "./grid-3x3-BjeKZBlx.js";
import { p as RotateCw, s as SUBJECT_VARIANT_CONTENT } from "./learningContent-D1WsycQZ.js";
import { t as Sparkles } from "./sparkles-bt2KNUwI.js";
import { t as withPremiumCollections } from "./premiumGamePack-CHz1F5u_.js";
import DeepLearningQuest, { t as Search } from "./DeepLearningQuest-CbOGahul.js";
var Brush = createLucideIcon("brush", [
	["path", {
		d: "m11 10 3 3",
		key: "fzmg1i"
	}],
	["path", {
		d: "M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z",
		key: "p4q2r7"
	}],
	["path", {
		d: "M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031",
		key: "wy6l02"
	}]
]);
var Gem = createLucideIcon("gem", [
	["path", {
		d: "M10.5 3 8 9l4 13 4-13-2.5-6",
		key: "b3dvk1"
	}],
	["path", {
		d: "M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z",
		key: "7w4byz"
	}],
	["path", {
		d: "M2 9h20",
		key: "16fsjt"
	}]
]);
var Image = createLucideIcon("image", [
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		ry: "2",
		key: "1m3agn"
	}],
	["circle", {
		cx: "9",
		cy: "9",
		r: "2",
		key: "af1f0g"
	}],
	["path", {
		d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
		key: "1xmnt7"
	}]
]);
var Map = createLucideIcon("map", [
	["path", {
		d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
		key: "169xi5"
	}],
	["path", {
		d: "M15 5.764v15",
		key: "1pn4in"
	}],
	["path", {
		d: "M9 3.236v15",
		key: "1uimfh"
	}]
]);
//#endregion
//#region src/components/PremiumPictureBookData.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var PREMIUM_PICTURE_BOOK_SCENES = {
	deutsch: {
		title: "Buchstabenlichtung",
		subtitle: "Deutsch",
		image: "/faska-flow-pro/premium/scenes/deutsch-buchstabenlichtung.svg",
		accent: "#c96f2d",
		ink: "#5d3b25",
		tokens: [
			"A",
			"M",
			"Ei",
			"Sch"
		]
	},
	mathe: {
		title: "Zahlenwerkstatt",
		subtitle: "Mathe",
		image: "/faska-flow-pro/premium/scenes/mathe-zahlenwerkstatt.svg",
		accent: "#2f80b7",
		ink: "#23465f",
		tokens: [
			"1",
			"5",
			"10",
			"+"
		]
	},
	welt: {
		title: "Wunderwelt",
		subtitle: "Welt",
		image: "/faska-flow-pro/premium/scenes/welt-forscherpfad.svg",
		accent: "#3d9270",
		ink: "#285946",
		tokens: [
			"Blatt",
			"Stern",
			"See",
			"Berg"
		]
	},
	miteinander: {
		title: "Herzgarten",
		subtitle: "Miteinander",
		image: "/faska-flow-pro/premium/scenes/miteinander-herzgarten.svg",
		accent: "#ba5d7b",
		ink: "#66364c",
		tokens: [
			"Mut",
			"Danke",
			"Stopp",
			"Wir"
		]
	},
	musik: {
		title: "Klangnest",
		subtitle: "Musik",
		image: "/faska-flow-pro/premium/scenes/musik-klangnest.svg",
		accent: "#8d69bd",
		ink: "#4f3d68",
		tokens: [
			"Ta",
			"Ti",
			"La",
			"Bum"
		]
	},
	abenteuer: {
		title: "Sternenpfad",
		subtitle: "Abenteuer",
		image: "/faska-flow-pro/premium/scenes/abenteuer-sternenpfad.svg",
		accent: "#d59335",
		ink: "#5b4930",
		tokens: [
			"Karte",
			"Tor",
			"Fund",
			"Ziel"
		]
	}
};
Object.entries(PREMIUM_PICTURE_BOOK_SCENES).map(([id, scene]) => ({
	id,
	...scene
}));
function getPremiumPictureBookScene(scene = "abenteuer") {
	return PREMIUM_PICTURE_BOOK_SCENES[scene] || PREMIUM_PICTURE_BOOK_SCENES.abenteuer;
}
//#endregion
//#region src/components/PremiumPictureBook.jsx
var import_jsx_runtime = require_jsx_runtime();
var MotionFigure = motion.figure;
var MotionDiv$1 = motion.div;
function PremiumPictureBook({ scene = "abenteuer", title, subtitle, className = "", imageClassName = "", showTokens = true, children }) {
	const labelId = (0, import_react.useId)();
	const shouldReduceMotion = useReducedMotion();
	const cfg = getPremiumPictureBookScene(scene);
	const displayTitle = title || cfg.title;
	const displaySubtitle = subtitle || cfg.subtitle;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionFigure, {
		className: `relative isolate overflow-hidden rounded-[28px] border border-white/80 bg-[#fffaf0] shadow-[0_24px_70px_rgba(91,73,48,0.18)] ${className}`,
		"aria-labelledby": labelId,
		initial: {
			opacity: 0,
			y: 14
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .5,
			ease: "easeOut"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-[16/10] min-h-56 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: `h-full w-full object-cover ${imageClassName}`,
					src: cfg.image,
					alt: `${displaySubtitle}: ${displayTitle}`,
					loading: "lazy",
					draggable: "false"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fffaf0]/96 via-[#fffaf0]/56 to-transparent" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
				className: "relative z-10 -mt-14 flex flex-wrap items-end justify-between gap-4 px-5 pb-5 sm:px-6 sm:pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-sans text-[10px] font-black uppercase tracking-[0.24em]",
						style: { color: cfg.accent },
						children: displaySubtitle
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						id: labelId,
						className: "font-hand text-4xl font-black leading-none text-[#3e3c38] sm:text-5xl",
						children: displayTitle
					})]
				}), showTokens ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex max-w-full flex-wrap justify-end gap-2",
					children: cfg.tokens.map((token, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv$1, {
						className: "grid h-10 min-w-10 place-items-center rounded-full border-2 border-white bg-white/82 px-3 text-sm font-black shadow-sm",
						style: { color: cfg.ink },
						animate: shouldReduceMotion ? { y: 0 } : { y: [
							0,
							-4,
							0
						] },
						transition: {
							duration: 2.8 + index * .22,
							repeat: shouldReduceMotion ? 0 : 2,
							ease: "easeInOut"
						},
						children: token
					}, token))
				}) : null]
			}),
			children ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 px-5 pb-5 sm:px-6 sm:pb-6",
				children
			}) : null
		]
	});
}
//#endregion
//#region src/components/games/PremiumQuestBoard.jsx
var MotionButton = motion.button;
var MotionDiv = motion.div;
var EMPTY_COLLECTION = {
	id: "leer",
	label: "Keine Sammlung",
	icon: "✦",
	color: "bg-slate-500",
	items: []
};
var HEARTS = [
	"♥",
	"♥",
	"♥"
];
var PATH_CELLS = [
	"Start",
	"Spur",
	"Tor",
	"Fund",
	"Brücke",
	"Licht",
	"Zelt",
	"Kompass",
	"Ziel"
];
var MODES = [
	{
		id: "imageSearch",
		label: "Bild-Suche",
		short: "Finde die Spur",
		icon: Image,
		tint: "from-sky-100 via-white to-emerald-50",
		color: "bg-sky-500"
	},
	{
		id: "expedition",
		label: "Expedition",
		short: "Folge dem Pfad",
		icon: Compass,
		tint: "from-emerald-100 via-white to-amber-50",
		color: "bg-emerald-500"
	},
	{
		id: "memory",
		label: "Paare",
		short: "Dreh zwei Karten",
		icon: Grid3x3,
		tint: "from-violet-100 via-white to-rose-50",
		color: "bg-violet-500"
	},
	{
		id: "atelier",
		label: "Atelier",
		short: "Baue die Lösung",
		icon: Brush,
		tint: "from-amber-100 via-white to-pink-50",
		color: "bg-amber-500"
	},
	{
		id: "starCombo",
		label: "Sternencombo",
		short: "Halte die Serie",
		icon: Star,
		tint: "from-fuchsia-100 via-white to-cyan-50",
		color: "bg-fuchsia-500"
	}
];
var normalizeText = (value) => String(value ?? "").trim();
var normalizeCollections = (collections) => (Array.isArray(collections) ? collections : []).map((collection, collectionIndex) => ({
	id: collection?.id || `collection-${collectionIndex}`,
	label: collection?.label || collection?.title || `Sammlung ${collectionIndex + 1}`,
	icon: collection?.icon || "✦",
	color: collection?.color || "bg-slate-600",
	items: Array.isArray(collection?.items) ? collection.items.filter((item) => item?.prompt && item?.answer).map((item, itemIndex) => ({
		...item,
		id: item.id || `${collection?.id || collectionIndex}-${itemIndex}`,
		answer: normalizeText(item.answer),
		options: buildOptions(item)
	})) : []
})).filter((collection) => collection.items.length > 0);
var buildOptions = (item) => {
	const answer = normalizeText(item?.answer);
	const options = Array.isArray(item?.options) ? item.options.map(normalizeText).filter(Boolean) : [];
	return Array.from(new Set([answer, ...options])).filter(Boolean).slice(0, 6);
};
var getItemCue = (item, fallback = "✦") => item?.imageCue || item?.scene || item?.icon || fallback;
var getSceneLabel = (scene) => {
	if (!scene) return "Premium Quest";
	if (typeof scene === "string") return scene;
	return scene.label || scene.title || scene.name || "Premium Quest";
};
var makeDeck = (collection, roundSeed) => (collection?.items || []).map((item, index) => ({
	...item,
	deckId: `${collection.id}-${roundSeed}-${item.id || index}`,
	collectionLabel: collection.label
}));
var makeMemoryCards = (challenge, seed) => {
	return challenge.options.slice(0, 4).flatMap((option, index) => {
		const correct = option === challenge.answer;
		return [{
			id: `${seed}-${index}-a`,
			value: option,
			label: correct ? getItemCue(challenge, option) : option,
			kind: "cue"
		}, {
			id: `${seed}-${index}-b`,
			value: option,
			label: option,
			kind: "answer"
		}];
	}).map((card, index) => ({
		...card,
		sortKey: (index * 17 + seed * 11) % 29
	})).sort((a, b) => a.sortKey - b.sortKey);
};
var makeAtelierPieces = (challenge, seed) => {
	const configured = challenge.challenge?.pieces || challenge.challenge?.parts || challenge.parts;
	const answer = normalizeText(challenge.answer);
	return (Array.isArray(configured) && configured.length ? configured.map(normalizeText).filter(Boolean) : answer.includes(" ") ? answer.split(/\s+/) : answer.length > 6 ? answer.match(/.{1,2}/g) || [answer] : answer.split("")).map((piece, index) => ({
		id: `${seed}-${index}-${piece}`,
		piece,
		sortKey: (index * 13 + seed * 7) % 23
	})).sort((a, b) => a.sortKey - b.sortKey);
};
function PremiumQuestBoard({ title = "Premium Quest Board", collections = [], accent = "bg-slate-900", scene = "Quest-Atelier", onCorrect = () => {}, onWrong = () => {} }) {
	const shouldReduceMotion = useReducedMotion();
	const playableCollections = (0, import_react.useMemo)(() => normalizeCollections(collections), [collections]);
	const [activeCollectionId, setActiveCollectionId] = (0, import_react.useState)(playableCollections[0]?.id);
	const [activeModeId, setActiveModeId] = (0, import_react.useState)(MODES[0].id);
	const [questionIndex, setQuestionIndex] = (0, import_react.useState)(0);
	const [roundSeed, setRoundSeed] = (0, import_react.useState)(1);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [score, setScore] = (0, import_react.useState)(0);
	const [combo, setCombo] = (0, import_react.useState)(0);
	const [hearts, setHearts] = (0, import_react.useState)(3);
	const [trail, setTrail] = (0, import_react.useState)(0);
	const [memoryOpen, setMemoryOpen] = (0, import_react.useState)([]);
	const [memorySolved, setMemorySolved] = (0, import_react.useState)([]);
	const [atelierBuild, setAtelierBuild] = (0, import_react.useState)([]);
	const activeCollection = playableCollections.find((collection) => collection.id === activeCollectionId) || playableCollections[0] || EMPTY_COLLECTION;
	const activeMode = MODES.find((mode) => mode.id === activeModeId) || MODES[0];
	const deck = (0, import_react.useMemo)(() => makeDeck(activeCollection, roundSeed), [activeCollection, roundSeed]);
	const challenge = deck[questionIndex % Math.max(deck.length, 1)];
	const memoryCards = (0, import_react.useMemo)(() => challenge ? makeMemoryCards(challenge, roundSeed) : [], [challenge, roundSeed]);
	const atelierPieces = (0, import_react.useMemo)(() => challenge ? makeAtelierPieces(challenge, roundSeed) : [], [challenge, roundSeed]);
	const clearLocalModeState = () => {
		setSelected(null);
		setFeedback(null);
		setMemoryOpen([]);
		setMemorySolved([]);
		setAtelierBuild([]);
	};
	const goNext = () => {
		setQuestionIndex((index) => index + 1);
		setTrail((value) => activeModeId === "expedition" ? Math.min(value + 1, PATH_CELLS.length - 1) : value);
		setRoundSeed((seed) => seed + 1);
		clearLocalModeState();
	};
	const resetBoard = () => {
		playJingle("start");
		setQuestionIndex(0);
		setRoundSeed((seed) => seed + 1);
		setScore(0);
		setCombo(0);
		setHearts(3);
		setTrail(0);
		clearLocalModeState();
	};
	const switchMode = (modeId) => {
		if (modeId === activeModeId) return;
		playWhoosh();
		setActiveModeId(modeId);
		setTrail(0);
		clearLocalModeState();
		setRoundSeed((seed) => seed + 1);
	};
	const switchCollection = (collectionId) => {
		if (collectionId === activeCollection.id) return;
		playPop();
		setActiveCollectionId(collectionId);
		setQuestionIndex(0);
		setTrail(0);
		clearLocalModeState();
		setRoundSeed((seed) => seed + 1);
	};
	const markCorrect = (bonus = 5) => {
		const nextCombo = combo + 1;
		const nextScore = score + bonus + Math.min(nextCombo, 6) * 2;
		setFeedback("richtig");
		setCombo(nextCombo);
		setScore(nextScore);
		onCorrect(bonus + Math.min(nextCombo, 4));
		if (nextCombo % 4 === 0 || activeModeId === "starCombo") {
			playJingle("combo");
			confetti_module_default({
				particleCount: 90,
				spread: 95,
				origin: { y: .74 }
			});
		} else playCoin();
		setTimeout(goNext, activeModeId === "memory" ? 900 : 720);
	};
	const markWrong = () => {
		const nextHearts = Math.max(hearts - 1, 0);
		setFeedback("falsch");
		setCombo(0);
		setHearts(nextHearts);
		playError();
		onWrong();
		setTimeout(() => {
			clearLocalModeState();
			if (nextHearts <= 0) {
				setHearts(3);
				setTrail(0);
				setQuestionIndex((index) => index + 1);
				setRoundSeed((seed) => seed + 1);
			}
		}, 900);
	};
	const chooseOption = (option) => {
		if (!challenge || feedback) return;
		setSelected(option);
		if (option === challenge.answer) markCorrect(activeModeId === "starCombo" ? 8 : 5);
		else markWrong();
	};
	const flipMemoryCard = (card) => {
		if (feedback || memorySolved.includes(card.id) || memoryOpen.some((openCard) => openCard.id === card.id)) return;
		playPop();
		const nextOpen = [...memoryOpen, card].slice(-2);
		setMemoryOpen(nextOpen);
		if (nextOpen.length < 2) return;
		const [first, second] = nextOpen;
		if (first.value === second.value) {
			setMemorySolved((solved) => [
				...solved,
				first.id,
				second.id
			]);
			if (first.value === challenge.answer) markCorrect(7);
			else {
				setFeedback("neutral");
				setTimeout(() => {
					setFeedback(null);
					setMemoryOpen([]);
				}, 780);
			}
			return;
		}
		markWrong();
	};
	const addAtelierPiece = (piece) => {
		if (feedback) return;
		playPop();
		const nextBuild = [...atelierBuild, piece];
		const targetLength = atelierPieces.length;
		setAtelierBuild(nextBuild);
		const joined = nextBuild.join("");
		const spaced = nextBuild.join(" ");
		if (joined === challenge.answer || spaced === challenge.answer) {
			markCorrect(8);
			return;
		}
		if (nextBuild.length >= targetLength) markWrong();
	};
	const removeAtelierPiece = (index) => {
		playWhoosh();
		setAtelierBuild((pieces) => pieces.filter((_, pieceIndex) => pieceIndex !== index));
	};
	if (!playableCollections.length || !challenge) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full max-w-5xl mx-auto py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white/75 border-4 border-white rounded-[38px] shadow-xl p-8 text-center paper-texture",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400",
					children: "Premium Quest Board"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Noch keine spielbaren Aufgaben"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Übergebe `collections` mit `items`, `prompt`, `answer` und optional `options`."
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-7xl mx-auto py-8 flex flex-col gap-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "text-center space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl md:text-6xl font-bold text-slate-800 leading-tight",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2 shadow-sm border border-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
							size: 18,
							className: "text-amber-500"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-hand text-2xl text-slate-600",
							children: getSceneLabel(scene)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gem, {
							size: 18,
							className: "text-emerald-500"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 lg:grid-cols-5 gap-3",
				children: MODES.map((mode) => {
					const Icon = mode.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
						whileHover: {
							y: -3,
							scale: 1.03
						},
						whileTap: { scale: .95 },
						onClick: () => switchMode(mode.id),
						className: `min-h-28 rounded-[30px] border-4 p-4 shadow-md text-left transition-all ${mode.id === activeMode.id ? `${mode.color} text-white border-white ring-4 ring-white` : "bg-white/75 text-slate-600 border-white hover:bg-white"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								size: 30,
								strokeWidth: 2.4
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-hand text-3xl font-bold leading-none mt-2",
								children: mode.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: mode.short
							})
						]
					}, mode.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-3",
				children: playableCollections.map((collection) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
						whileHover: {
							y: -2,
							scale: 1.04
						},
						whileTap: { scale: .95 },
						onClick: () => switchCollection(collection.id),
						className: `px-5 py-3 rounded-full border-2 font-hand text-xl font-bold shadow-md flex items-center gap-2 transition-all ${collection.id === activeCollection.id ? `${collection.color} text-white border-white ring-4 ring-white` : "bg-white/75 text-slate-500 border-white hover:bg-white"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: collection.icon }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: collection.label }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "sr-only",
								children: [collection.items.length, " Karten"]
							})
						]
					}, collection.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "bg-white/65 rounded-[48px] border-4 border-white shadow-2xl p-5 md:p-7 overflow-hidden relative paper-texture",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestStat, {
								label: "Modus",
								value: activeMode.label,
								color: "text-slate-800"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestStat, {
								label: "Herzen",
								value: HEARTS.map((heart, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: index < hearts ? "" : "opacity-20",
									children: heart
								}, index)),
								color: "text-rose-500"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestStat, {
								label: "Combo",
								value: `${combo}x`,
								color: "text-fuchsia-500"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestStat, {
								label: "Punkte",
								value: score,
								color: "text-emerald-600"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `relative min-h-[600px] rounded-[42px] border-4 border-white bg-gradient-to-br ${activeMode.tint} shadow-inner overflow-hidden`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 opacity-70",
								style: {
									backgroundImage: "radial-gradient(circle at 18% 22%, rgba(14,165,233,.18), transparent 22%), radial-gradient(circle at 82% 24%, rgba(16,185,129,.16), transparent 24%), radial-gradient(circle at 50% 88%, rgba(244,114,182,.14), transparent 27%)",
									backgroundSize: "100% 100%"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-10 p-5 md:p-7 flex flex-col gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestHeader, {
									mode: activeMode,
									collection: activeCollection,
									challenge,
									accent
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
									mode: "wait",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionDiv, {
										initial: {
											opacity: 0,
											y: 24,
											scale: .98
										},
										animate: {
											opacity: 1,
											y: 0,
											scale: 1
										},
										exit: {
											opacity: 0,
											y: -18,
											scale: .98
										},
										transition: {
											type: "spring",
											bounce: .28
										},
										children: [
											activeMode.id === "imageSearch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageSearchStage, {
												challenge,
												selected,
												feedback,
												onChoose: chooseOption,
												shouldReduceMotion
											}),
											activeMode.id === "expedition" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpeditionStage, {
												challenge,
												selected,
												feedback,
												trail,
												onChoose: chooseOption,
												shouldReduceMotion
											}),
											activeMode.id === "memory" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemoryStage, {
												cards: memoryCards,
												open: memoryOpen,
												solved: memorySolved,
												answer: challenge.answer,
												feedback,
												onFlip: flipMemoryCard
											}),
											activeMode.id === "atelier" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtelierStage, {
												pieces: atelierPieces,
												build: atelierBuild,
												feedback,
												onAdd: addAtelierPiece,
												onRemove: removeAtelierPiece
											}),
											activeMode.id === "starCombo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarComboStage, {
												challenge,
												selected,
												feedback,
												combo,
												onChoose: chooseOption,
												shouldReduceMotion
											})
										]
									}, `${activeMode.id}-${challenge.deckId}`)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedbackToast, {
								feedback,
								combo
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
							whileHover: {
								scale: 1.04,
								y: -2
							},
							whileTap: { scale: .95 },
							onClick: resetBoard,
							className: `px-7 py-3 ${accent} text-white rounded-full font-hand text-2xl font-bold shadow-lg border-4 border-white flex items-center gap-2`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { size: 22 }), "Neu mischen"]
						})
					})
				]
			})
		]
	});
}
function QuestStat({ label, value, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white/80 rounded-3xl p-4 border-2 border-white shadow-inner min-h-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `font-hand text-3xl md:text-4xl font-bold leading-tight ${color}`,
			children: value
		})]
	});
}
function QuestHeader({ mode, collection, challenge, accent }) {
	const Icon = mode.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white/88 rounded-[34px] border-4 border-white shadow-lg p-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400",
					children: [
						mode.label,
						" · ",
						collection.label
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-hand text-4xl md:text-5xl font-bold text-slate-800 leading-tight",
					children: challenge.prompt
				}),
				challenge.support && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: challenge.support
				}),
				challenge.example && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl font-bold text-slate-700 mt-2",
					children: challenge.example
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `${accent} text-white rounded-3xl p-4 shadow-lg border-4 border-white flex items-center gap-3 w-fit`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 34 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gem, { size: 24 })]
			})]
		})
	});
}
function ImageSearchStage({ challenge, selected, feedback, onChoose, shouldReduceMotion }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-[0.9fr_1.2fr] gap-6 items-stretch",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white/76 border-4 border-white rounded-[36px] shadow-inner p-6 min-h-72 flex flex-col items-center justify-center text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv, {
				animate: shouldReduceMotion ? {
					scale: 1,
					rotate: 0
				} : {
					scale: [
						1,
						1.05,
						1
					],
					rotate: [
						0,
						1.5,
						-1.5,
						0
					]
				},
				transition: {
					duration: 3.6,
					repeat: shouldReduceMotion ? 0 : 1
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-40 h-40 rounded-[38px] bg-white border-4 border-sky-100 shadow-xl flex items-center justify-center text-7xl",
					children: getItemCue(challenge, "🔎")
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex items-center justify-center gap-2 text-sky-600",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 24 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-3xl font-bold",
					children: "Welche Karte passt?"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid sm:grid-cols-2 gap-4",
			children: challenge.options.slice(0, 4).map((option, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnswerCard, {
				option,
				index,
				selected,
				feedback,
				answer: challenge.answer,
				onChoose,
				prefix: index + 1
			}, `${challenge.deckId}-image-${option}`))
		})]
	});
}
function ExpeditionStage({ challenge, selected, feedback, trail, onChoose, shouldReduceMotion }) {
	const options = challenge.options.slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-[1.1fr_0.9fr] gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-white/72 border-4 border-white rounded-[36px] shadow-inner p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-3",
				children: PATH_CELLS.map((cell, index) => {
					const active = index <= trail;
					const current = index === trail;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionDiv, {
						animate: {
							y: current && !shouldReduceMotion ? [
								0,
								-8,
								0
							] : 0,
							scale: active ? 1.03 : 1
						},
						transition: {
							duration: .9,
							repeat: current && !shouldReduceMotion ? 2 : 0
						},
						className: `aspect-square rounded-[26px] border-4 flex flex-col items-center justify-center text-center p-2 ${active ? "bg-emerald-400 border-white text-white shadow-lg" : "bg-white/75 border-white text-slate-300"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, { size: 24 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-hand text-2xl font-bold leading-none mt-1",
							children: cell
						})]
					}, cell);
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4",
			children: options.map((option, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnswerCard, {
				option,
				index,
				selected,
				feedback,
				answer: challenge.answer,
				onChoose,
				prefix: "Pfad"
			}, `${challenge.deckId}-path-${option}`))
		})]
	});
}
function MemoryStage({ cards, open, solved, answer, feedback, onFlip }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white/70 border-4 border-white rounded-[36px] shadow-inner p-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 md:grid-cols-4 gap-4",
			children: cards.map((card, index) => {
				const visible = open.some((openCard) => openCard.id === card.id) || solved.includes(card.id);
				const solvedCorrect = solved.includes(card.id) && card.value === answer;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
					initial: {
						opacity: 0,
						y: 20,
						rotateY: 0
					},
					animate: {
						opacity: 1,
						y: 0,
						rotateY: visible ? 180 : 0
					},
					transition: {
						type: "spring",
						bounce: .34,
						delay: index * .03
					},
					whileHover: {
						y: -4,
						scale: 1.03
					},
					whileTap: { scale: .94 },
					onClick: () => onFlip(card),
					className: `relative min-h-36 rounded-[28px] border-4 shadow-xl p-4 font-hand text-3xl font-bold transition-colors ${solvedCorrect ? "bg-emerald-100 border-emerald-300 text-emerald-800" : visible ? "bg-white border-violet-100 text-slate-700" : "bg-violet-500 border-white text-white"} ${feedback === "falsch" && visible ? "ring-4 ring-rose-200" : ""}`,
					style: { transformStyle: "preserve-3d" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block",
						style: { transform: visible ? "rotateY(180deg)" : "none" },
						children: visible ? card.label : "?"
					}), visible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-sans text-[10px] uppercase tracking-widest text-slate-400 mt-2",
						children: card.kind === "cue" ? "Spur" : "Antwort"
					})]
				}, card.id);
			})
		})
	});
}
function AtelierStage({ pieces, build, feedback, onAdd, onRemove }) {
	const usedCount = (piece) => build.filter((entry) => entry === piece).length;
	const availableCount = (piece) => pieces.filter((entry) => entry.piece === piece).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-[1fr_1.1fr] gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white/72 border-4 border-white rounded-[36px] shadow-inner p-5 min-h-72",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400 mb-3",
				children: "Baukasten"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-3",
				children: pieces.map((entry, index) => {
					const disabled = usedCount(entry.piece) >= availableCount(entry.piece);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
						whileHover: {
							y: disabled ? 0 : -4,
							scale: disabled ? 1 : 1.05
						},
						whileTap: { scale: disabled ? 1 : .94 },
						onClick: () => !disabled && onAdd(entry.piece),
						className: `min-w-16 min-h-16 px-5 rounded-[22px] border-4 shadow-lg font-hand text-3xl font-bold ${disabled ? "bg-slate-100 border-white text-slate-300" : "bg-amber-100 border-white text-slate-700"}`,
						children: [entry.piece, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block font-sans text-[9px] uppercase tracking-widest text-amber-500",
							children: ["Teil ", index + 1]
						})]
					}, entry.id);
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white/82 border-4 border-white rounded-[36px] shadow-lg p-5 min-h-72",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400 mb-3",
				children: "Atelierfläche"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `min-h-40 rounded-[28px] border-4 border-dashed flex flex-wrap content-center gap-3 p-4 ${feedback === "falsch" ? "border-rose-200 bg-rose-50" : "border-amber-200 bg-white/70"}`,
				children: [build.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-3xl text-slate-300",
					children: "Lege die Teile hier ab."
				}), build.map((piece, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
					initial: {
						scale: .7,
						opacity: 0
					},
					animate: {
						scale: 1,
						opacity: 1
					},
					whileHover: { y: -3 },
					whileTap: { scale: .92 },
					onClick: () => onRemove(index),
					className: "min-w-16 min-h-16 px-5 rounded-[22px] bg-white border-4 border-amber-100 shadow-md font-hand text-3xl font-bold text-slate-800",
					children: piece
				}, `${piece}-${index}`))]
			})]
		})]
	});
}
function StarComboStage({ challenge, selected, feedback, combo, onChoose, shouldReduceMotion }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-white/72 border-4 border-white rounded-[36px] shadow-inner p-5 flex flex-wrap justify-center gap-2",
			children: Array.from({ length: 8 }, (_, index) => {
				const active = index < Math.min(combo, 8);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv, {
					animate: {
						scale: active && !shouldReduceMotion ? [
							1,
							1.22,
							1
						] : 1,
						rotate: active && !shouldReduceMotion ? [
							0,
							8,
							-8,
							0
						] : 0
					},
					transition: {
						duration: 1.1,
						repeat: active && !shouldReduceMotion ? 2 : 0
					},
					className: active ? "text-fuchsia-500 drop-shadow-sm" : "text-slate-200",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
						size: 38,
						fill: "currentColor"
					})
				}, index);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4",
			children: challenge.options.slice(0, 4).map((option, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnswerCard, {
				option,
				index,
				selected,
				feedback,
				answer: challenge.answer,
				onChoose,
				prefix: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 18 })
			}, `${challenge.deckId}-combo-${option}`))
		})]
	});
}
function AnswerCard({ option, index, selected, feedback, answer, onChoose, prefix }) {
	const isSelected = selected === option;
	const isCorrect = option === answer;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
		initial: {
			opacity: 0,
			y: 28,
			scale: .92
		},
		animate: {
			opacity: 1,
			y: 0,
			scale: 1
		},
		transition: {
			type: "spring",
			bounce: .36,
			delay: index * .04
		},
		whileHover: {
			y: -4,
			scale: 1.04
		},
		whileTap: { scale: .94 },
		onClick: () => onChoose(option),
		className: `min-h-32 rounded-[30px] border-4 shadow-xl p-5 font-hand text-3xl font-bold transition-colors ${isSelected && feedback === "richtig" && isCorrect ? "bg-emerald-100 border-emerald-300 text-emerald-800" : isSelected && feedback === "falsch" ? "bg-rose-100 border-rose-300 text-rose-800" : "bg-white/92 border-white text-slate-700 hover:border-slate-200"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest text-slate-400 mb-2",
			children: prefix
		}), option]
	});
}
function FeedbackToast({ feedback, combo }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, { children: [
		feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionDiv, {
			initial: {
				opacity: 0,
				scale: .84,
				y: 20
			},
			animate: {
				opacity: 1,
				scale: 1,
				y: 0
			},
			exit: { opacity: 0 },
			className: "absolute bottom-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl z-20",
			children: ["Treffer! Combo ", combo]
		}),
		feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv, {
			initial: {
				opacity: 0,
				scale: .84,
				y: 20
			},
			animate: {
				opacity: 1,
				scale: 1,
				y: 0
			},
			exit: { opacity: 0 },
			className: "absolute bottom-5 left-1/2 -translate-x-1/2 bg-rose-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl z-20",
			children: "Noch einmal genau schauen."
		}),
		feedback === "neutral" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv, {
			initial: {
				opacity: 0,
				scale: .84,
				y: 20
			},
			animate: {
				opacity: 1,
				scale: 1,
				y: 0
			},
			exit: { opacity: 0 },
			className: "absolute bottom-5 left-1/2 -translate-x-1/2 bg-violet-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl z-20",
			children: "Paar gefunden. Suche das Zielpaar."
		})
	] });
}
//#endregion
//#region src/components/games/SubjectPremiumAtelier.jsx
var SETTINGS = {
	deutsch: {
		picture: "deutsch",
		title: "Sprach-Premium-Atelier",
		accent: "bg-amber-500",
		scene: "Deutsch · Buchstabenlichtung"
	},
	mathe: {
		picture: "mathe",
		title: "Zahlen-Premium-Atelier",
		accent: "bg-sky-500",
		scene: "Mathe · Zahlenwerkstatt"
	},
	sachunterricht: {
		picture: "welt",
		title: "Forscher-Premium-Atelier",
		accent: "bg-emerald-500",
		scene: "Welt · Forscherpfad"
	},
	ethik: {
		picture: "miteinander",
		title: "Miteinander-Premium-Atelier",
		accent: "bg-pink-500",
		scene: "Miteinander · Herzgarten"
	},
	musik: {
		picture: "musik",
		title: "Klang-Premium-Atelier",
		accent: "bg-fuchsia-500",
		scene: "Musik · Klangnest"
	}
};
function SubjectPremiumAtelier({ subject, onCorrect, onWrong }) {
	const cfg = SETTINGS[subject] || SETTINGS.deutsch;
	const collections = withPremiumCollections(subject, SUBJECT_VARIANT_CONTENT[subject]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeepLearningQuest, {
				subject,
				title: cfg.title.replace("Premium-Atelier", "Denk-Abenteuer"),
				collections,
				onCorrect,
				onWrong
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumPictureBook, { scene: cfg.picture }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumQuestBoard, {
				title: cfg.title,
				collections,
				accent: cfg.accent,
				scene: cfg.scene,
				onCorrect,
				onWrong
			})
		]
	});
}
//#endregion
export { SubjectPremiumAtelier as default };
