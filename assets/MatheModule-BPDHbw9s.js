const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/SubjectPremiumAtelier-OFFtJlBa.js","assets/jsx-runtime-Be5yPkiZ.js","assets/star-DBCbE8d7.js","assets/proxy--6s_pC9q.js","assets/sounds-Dh98eEYj.js","assets/DeepLearningQuest-CbOGahul.js","assets/learningContent-D1WsycQZ.js","assets/wand-sparkles-CtIcwwM8.js","assets/animalFriends-U19Ro3hF.js","assets/premiumGamePack-CHz1F5u_.js","assets/compass-JckdT0FA.js","assets/grid-3x3-BjeKZBlx.js","assets/sparkles-bt2KNUwI.js","assets/SkyWonderland-Bz4SaHcY.js","assets/volume-2-Vs6pZO3N.js","assets/LearningArcade-BGnmy9QN.js","assets/trophy-Ci-hdIiU.js"])))=>i.map(i=>d[i]);
import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as motion } from "./proxy--6s_pC9q.js";
import { N as playSparkle, V as AnimatePresence, l as playError, w as playPop } from "./sounds-Dh98eEYj.js";
import { r as confetti_module_default } from "./star-DBCbE8d7.js";
import { t as __vitePreload } from "./index-B5O6y7xB.js";
import { i as MATHE_CONTENT, s as SUBJECT_VARIANT_CONTENT } from "./learningContent-D1WsycQZ.js";
import { i as VariantStudio, n as GameWorld, r as ActionArena, t as QuestMixer } from "./QuestMixer-CwJK0O5N.js";
//#region src/components/games/MusterGarten.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FLOWERS = {
	rose: {
		name: "Rosenblume",
		petal: "#fb7185",
		center: "#fef08a",
		leaf: "#86efac"
	},
	sun: {
		name: "Sonnenblume",
		petal: "#facc15",
		center: "#92400e",
		leaf: "#65a30d"
	},
	sky: {
		name: "Himmelblume",
		petal: "#60a5fa",
		center: "#dbeafe",
		leaf: "#22c55e"
	},
	violet: {
		name: "Lila Blume",
		petal: "#a78bfa",
		center: "#fbcfe8",
		leaf: "#34d399"
	},
	coral: {
		name: "Korallenblume",
		petal: "#fb923c",
		center: "#fde68a",
		leaf: "#84cc16"
	}
};
var ROUNDS$1 = [
	{
		title: "Zwei Farben tanzen",
		hint: "Rot, Gelb, Rot, Gelb ...",
		pattern: [
			"rose",
			"sun",
			"rose",
			"sun"
		],
		answer: "rose",
		options: [
			"rose",
			"sun",
			"sky",
			"violet"
		]
	},
	{
		title: "Immer ein blauer Stern",
		hint: "Gelb, Blau, Rot, Gelb, Blau, Rot ...",
		pattern: [
			"sun",
			"sky",
			"rose",
			"sun",
			"sky"
		],
		answer: "rose",
		options: [
			"rose",
			"coral",
			"violet",
			"sun"
		]
	},
	{
		title: "Doppelte Freunde",
		hint: "Lila, Lila, Rot, Lila, Lila, Rot ...",
		pattern: [
			"violet",
			"violet",
			"rose",
			"violet",
			"violet"
		],
		answer: "rose",
		options: [
			"rose",
			"sky",
			"sun",
			"coral"
		]
	},
	{
		title: "Warmer Gartenweg",
		hint: "Orange, Gelb, Gelb, Orange, Gelb, Gelb ...",
		pattern: [
			"coral",
			"sun",
			"sun",
			"coral",
			"sun"
		],
		answer: "sun",
		options: [
			"sky",
			"sun",
			"rose",
			"violet"
		]
	}
];
function Flower({ kind, muted = false, small = false }) {
	const flower = FLOWERS[kind] || FLOWERS.rose;
	const size = small ? 72 : 96;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width: size,
		height: size,
		viewBox: "0 0 120 120",
		className: `drop-shadow-md ${muted ? "opacity-35" : ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			className: "watercolor-effect",
			children: [
				[
					0,
					60,
					120,
					180,
					240,
					300
				].map((deg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "60",
					cy: "42",
					rx: "16",
					ry: "28",
					fill: flower.petal,
					opacity: "0.82",
					stroke: "#ffffff",
					strokeWidth: "2",
					transform: `rotate(${deg} 60 60)`
				}, deg)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "60",
					cy: "60",
					r: "17",
					fill: flower.center,
					stroke: "#fff7ed",
					strokeWidth: "3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M60 76 C60 90 56 101 47 112",
					stroke: flower.leaf,
					strokeWidth: "5",
					strokeLinecap: "round",
					fill: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M58 92 C43 85 34 87 28 98 C42 100 51 99 58 92Z",
					fill: flower.leaf,
					opacity: "0.72"
				})
			]
		})
	});
}
function MusterGarten({ onCorrect = () => {}, onWrong = () => {} }) {
	const [roundIndex, setRoundIndex] = (0, import_react.useState)(0);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const round = ROUNDS$1[roundIndex];
	const chooseFlower = (kind) => {
		if (feedback === "richtig") return;
		setSelected(kind);
		playPop();
		if (kind === round.answer) {
			setFeedback("richtig");
			playSparkle();
			onCorrect(5);
			confetti_module_default({
				particleCount: 90,
				spread: 80,
				origin: { y: .72 }
			});
		} else {
			setFeedback("falsch");
			playError();
			onWrong();
			setTimeout(() => {
				setFeedback(null);
				setSelected(null);
			}, 1300);
		}
	};
	const nextRound = () => {
		playPop();
		setRoundIndex((roundIndex + 1) % ROUNDS$1.length);
		setSelected(null);
		setFeedback(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-8 py-8 w-full max-w-5xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Muster-Garten"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Welche Blume wächst als Nächstes?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full bg-emerald-50/70 rounded-[50px] border-4 border-white shadow-2xl p-8 paper-texture",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-sans text-xs font-bold uppercase tracking-widest text-emerald-600",
						children: ["Runde ", roundIndex + 1]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-hand text-4xl font-bold text-slate-700",
						children: round.title
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-hand text-2xl text-emerald-700 bg-white/70 px-5 py-3 rounded-[24px] border-2 border-emerald-100",
						children: round.hint
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-center items-end gap-3 md:gap-6 bg-white/60 rounded-[40px] border-4 border-dashed border-emerald-200 px-4 py-10",
					children: [round.pattern.map((kind, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							scale: .7,
							opacity: 0
						},
						animate: {
							scale: 1,
							opacity: 1
						},
						transition: { delay: index * .06 },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flower, { kind })
					}, `${kind}-${index}`)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						animate: feedback === "richtig" ? {
							scale: [
								1,
								1.12,
								1
							],
							rotate: [
								0,
								-2,
								2,
								0
							]
						} : {},
						className: "w-28 h-28 md:w-32 md:h-32 rounded-[34px] border-4 border-dashed border-amber-300 bg-amber-50/80 flex items-center justify-center shadow-inner",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
							mode: "wait",
							children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: { scale: 0 },
								animate: { scale: 1 },
								exit: { scale: 0 },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flower, {
									kind: selected,
									small: true
								})
							}, selected) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								className: "font-hand text-6xl text-amber-500",
								children: "?"
							}, "question")
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl",
				children: round.options.map((kind) => {
					const isChosen = selected === kind;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
						whileHover: {
							scale: 1.05,
							y: -4
						},
						whileTap: { scale: .95 },
						onClick: () => chooseFlower(kind),
						className: `bg-white/80 rounded-[30px] border-4 p-4 shadow-lg flex flex-col items-center gap-2 transition-all ${isChosen ? "border-emerald-300 ring-4 ring-emerald-100" : "border-white hover:border-emerald-100"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flower, {
							kind,
							small: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-hand text-xl font-bold text-slate-600",
							children: FLOWERS[kind].name
						})]
					}, kind);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-20 flex flex-col items-center gap-4",
				children: [feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-3xl font-bold text-rose-500",
					children: "Fast. Schau noch einmal auf den Rhythmus der Blumen."
				}), feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-3xl font-bold text-emerald-600",
					children: "Genau. Das Muster wächst weiter."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: nextRound,
					className: "px-8 py-3 bg-emerald-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg",
					children: "Weiterpflanzen"
				})] })]
			})
		]
	});
}
//#endregion
//#region src/components/games/ZahlenFluss.jsx
var ROUNDS = MATHE_CONTENT.numberRiverRounds;
function ZahlenFluss({ onCorrect = () => {}, onWrong = () => {} }) {
	const [roundIndex, setRoundIndex] = (0, import_react.useState)(0);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const round = ROUNDS[roundIndex];
	const choose = (value) => {
		if (feedback === "richtig") return;
		setSelected(value);
		playPop();
		if (value === round.answer) {
			setFeedback("richtig");
			playSparkle();
			onCorrect(5);
			confetti_module_default({
				particleCount: 110,
				spread: 100,
				origin: { y: .75 }
			});
		} else {
			setFeedback("falsch");
			playError();
			onWrong();
			setTimeout(() => {
				setSelected(null);
				setFeedback(null);
			}, 1200);
		}
	};
	const next = () => {
		playPop();
		setRoundIndex((roundIndex + 1) % ROUNDS.length);
		setSelected(null);
		setFeedback(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-6xl mx-auto py-8 flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Zahlen-Fluss"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Springe von Stein zu Stein und finde die fehlende Zahl."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-gradient-to-br from-sky-100 via-blue-50 to-emerald-50 rounded-[56px] border-4 border-white shadow-2xl p-8 paper-texture overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4 mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-sans text-xs font-bold uppercase tracking-widest text-sky-700",
						children: "Muster"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-hand text-4xl font-bold text-slate-700",
						children: round.title
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:block font-hand text-5xl opacity-50",
						children: "〰️"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap justify-center items-center gap-3 md:gap-5",
					children: round.river.map((value, index) => {
						const isBlank = value === null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								y: 20,
								opacity: 0
							},
							animate: {
								y: index % 2 === 0 ? -4 : 8,
								opacity: 1
							},
							transition: {
								delay: index * .08,
								type: "spring"
							},
							className: `w-28 h-24 md:w-36 md:h-28 rounded-[36px] border-4 shadow-lg flex items-center justify-center ${isBlank ? "bg-amber-50 border-dashed border-amber-300" : "bg-white/85 border-white"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
								mode: "wait",
								children: isBlank && selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									initial: { scale: 0 },
									animate: { scale: 1 },
									className: "font-hand text-5xl font-bold text-amber-600",
									children: selected
								}, "selected") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									initial: { opacity: 0 },
									animate: { opacity: 1 },
									className: `font-hand font-bold ${isBlank ? "text-6xl text-amber-400" : "text-5xl text-slate-700"}`,
									children: isBlank ? "?" : value
								}, value ?? "blank")
							})
						}, `${roundIndex}-${index}`);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-4",
				children: round.options.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
					whileHover: {
						scale: 1.08,
						y: -4
					},
					whileTap: { scale: .94 },
					onClick: () => choose(value),
					className: `w-24 h-20 rounded-[28px] border-4 bg-white shadow-lg font-hand text-4xl font-bold transition-all ${selected === value ? "border-sky-300 ring-4 ring-sky-100 text-sky-600" : "border-white text-slate-700 hover:border-sky-100"}`,
					children: value
				}, value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-20 text-center",
				children: [feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-3xl font-bold text-rose-500",
					children: "Der Sprung passt noch nicht."
				}), feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-hand text-3xl font-bold text-sky-700",
						children: "Genau. Der Fluss fließt weiter."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: next,
						className: "px-8 py-3 bg-sky-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg",
						children: "Nächster Fluss"
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/games/FormenMosaik.jsx
var SHAPES = {
	circle: {
		label: "Kreis",
		color: "#fb7185",
		icon: "●"
	},
	square: {
		label: "Quadrat",
		color: "#60a5fa",
		icon: "■"
	},
	triangle: {
		label: "Dreieck",
		color: "#facc15",
		icon: "▲"
	},
	diamond: {
		label: "Raute",
		color: "#34d399",
		icon: "◆"
	}
};
var PUZZLES = [
	{
		title: "Mosaik-Rand",
		pattern: [
			"circle",
			"square",
			"circle",
			null,
			"circle",
			"square"
		],
		answer: "square",
		options: [
			"triangle",
			"square",
			"diamond",
			"circle"
		]
	},
	{
		title: "Dach und Fenster",
		pattern: [
			"triangle",
			"square",
			"triangle",
			"square",
			null,
			"square"
		],
		answer: "triangle",
		options: [
			"circle",
			"diamond",
			"triangle",
			"square"
		]
	},
	{
		title: "Glitzersteine",
		pattern: [
			"diamond",
			"circle",
			"square",
			"diamond",
			"circle",
			null
		],
		answer: "square",
		options: [
			"square",
			"triangle",
			"diamond",
			"circle"
		]
	},
	{
		title: "Ruhiger Teppich",
		pattern: [
			"square",
			"square",
			"circle",
			"square",
			"square",
			null
		],
		answer: "circle",
		options: [
			"triangle",
			"circle",
			"diamond",
			"square"
		]
	}
];
function ShapeTile({ shapeId, blank = false }) {
	if (blank) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "font-hand text-6xl text-violet-400",
		children: "?"
	});
	const shape = SHAPES[shapeId];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-6xl drop-shadow-sm",
		style: { color: shape.color },
		children: shape.icon
	});
}
function FormenMosaik({ onCorrect = () => {}, onWrong = () => {} }) {
	const [puzzleIndex, setPuzzleIndex] = (0, import_react.useState)(0);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const puzzle = PUZZLES[puzzleIndex];
	const choose = (shapeId) => {
		if (feedback === "richtig") return;
		setSelected(shapeId);
		playPop();
		if (shapeId === puzzle.answer) {
			setFeedback("richtig");
			playSparkle();
			onCorrect(5);
			confetti_module_default({
				particleCount: 120,
				spread: 100,
				origin: { y: .72 }
			});
		} else {
			setFeedback("falsch");
			playError();
			onWrong();
			setTimeout(() => {
				setSelected(null);
				setFeedback(null);
			}, 1200);
		}
	};
	const next = () => {
		playPop();
		setPuzzleIndex((puzzleIndex + 1) % PUZZLES.length);
		setSelected(null);
		setFeedback(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-6xl mx-auto py-8 flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Formen-Mosaik"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Setze das Muster mit der richtigen Form fort."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-violet-50/70 rounded-[56px] border-4 border-white shadow-2xl p-8 paper-texture",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-7 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-sans text-xs font-bold uppercase tracking-widest text-violet-600",
						children: "Mosaik"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-hand text-4xl font-bold text-slate-700",
						children: puzzle.title
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
					children: puzzle.pattern.map((shapeId, index) => {
						const blank = shapeId === null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								scale: .8,
								opacity: 0
							},
							animate: {
								scale: 1,
								opacity: 1,
								rotate: index % 2 === 0 ? -1 : 1
							},
							transition: { delay: index * .06 },
							className: `aspect-square rounded-[34px] border-4 shadow-lg flex items-center justify-center ${blank ? "bg-amber-50 border-dashed border-violet-300" : "bg-white/85 border-white"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
								mode: "wait",
								children: blank && selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
									initial: { scale: 0 },
									animate: { scale: 1 },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShapeTile, { shapeId: selected })
								}, selected) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
									initial: { opacity: 0 },
									animate: { opacity: 1 },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShapeTile, {
										shapeId,
										blank
									})
								}, shapeId ?? "blank")
							})
						}, `${puzzleIndex}-${index}`);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-4",
				children: puzzle.options.map((shapeId) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
					whileHover: {
						scale: 1.08,
						y: -4
					},
					whileTap: { scale: .94 },
					onClick: () => choose(shapeId),
					className: `w-28 h-28 rounded-[32px] border-4 bg-white shadow-lg flex flex-col items-center justify-center transition-all ${selected === shapeId ? "border-violet-300 ring-4 ring-violet-100" : "border-white hover:border-violet-100"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShapeTile, { shapeId }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-hand text-xl font-bold text-slate-600",
						children: SHAPES[shapeId].label
					})]
				}, shapeId))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-20 text-center",
				children: [feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-3xl font-bold text-rose-500",
					children: "Schau auf die Reihenfolge der Formen."
				}), feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-hand text-3xl font-bold text-violet-700",
						children: "Das Mosaik ist vollständig."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: next,
						className: "px-8 py-3 bg-violet-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg",
						children: "Neues Mosaik"
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/modules/MatheModule.jsx
var SubjectPremiumAtelier = (0, import_react.lazy)(() => __vitePreload(() => import("./SubjectPremiumAtelier-OFFtJlBa.js"), __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])));
var SkyWonderland = (0, import_react.lazy)(() => __vitePreload(() => import("./SkyWonderland-Bz4SaHcY.js"), __vite__mapDeps([13,1,2,3,4,12,14,7,8])));
var DeepLearningQuest = (0, import_react.lazy)(() => __vitePreload(() => import("./DeepLearningQuest-CbOGahul.js"), __vite__mapDeps([5,1,2,3,4,6,7,8,9])));
var LearningArcade = (0, import_react.lazy)(() => __vitePreload(() => import("./LearningArcade-BGnmy9QN.js"), __vite__mapDeps([15,1,2,3,4,10,6,12,16,8,9])));
var BEAD_COLORS = {
	unit: "#fbbf24",
	ten: "#fbbf24",
	hundred: "#fbbf24"
};
var WatercolorBead = ({ size = 20, className = "" }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	width: size,
	height: size,
	viewBox: "0 0 30 30",
	className: `${className}`,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		d: "M15 3 C22 3 27 8 27 15 C27 22 22 27 15 27 C8 27 3 22 3 15 C3 8 8 3 15 3 Z",
		fill: BEAD_COLORS.unit,
		stroke: "#b45309",
		strokeWidth: "1"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
		cx: "11",
		cy: "11",
		rx: "3",
		ry: "2",
		fill: "white",
		opacity: "0.4"
	})]
});
var TenBar = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "flex flex-col gap-0.5 p-1 bg-amber-50/50 rounded-full border border-amber-200/50 shadow-sm",
	children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WatercolorBead, { size: 18 }, i))
});
var HundredSquare = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "grid grid-cols-10 gap-0.5 p-1.5 bg-amber-100/30 rounded-xl border border-amber-200 shadow-md",
	children: Array.from({ length: 100 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WatercolorBead, { size: 14 }, i))
});
var ThousandCube = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "relative w-28 h-28",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-amber-200/40 rounded-xl border-2 border-amber-400 rotate-3 translate-x-2 translate-y-2 shadow-sm flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HundredSquare, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-amber-200/60 rounded-xl border-2 border-amber-400 -rotate-2 -translate-x-1 -translate-y-1 shadow-md flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HundredSquare, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-2 bg-amber-500/20 blur-xl rounded-full" })
	]
});
var DraggableItem = ({ type, onDragEnd, containerRef }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
	drag: true,
	dragConstraints: containerRef,
	dragElastic: .1,
	dragMomentum: false,
	onDragEnd: (e, info) => onDragEnd(type, info.point),
	whileDrag: {
		scale: 1.1,
		zIndex: 100
	},
	whileHover: { scale: 1.05 },
	className: "inline-block touch-none cursor-grab active:cursor-grabbing",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hover:drag-shadow active:drag-shadow transition-shadow duration-200 flex flex-col items-center gap-1",
		children: [
			type === "unit" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WatercolorBead, {
				size: 32,
				className: "drop-shadow-sm"
			}),
			type === "ten" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TenBar, {}),
			type === "hundred" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HundredSquare, {}),
			type === "thousand" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThousandCube, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-hand text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity",
				children: type === "unit" ? "1" : type === "ten" ? "10" : type === "hundred" ? "100" : "1000"
			})
		]
	})
});
function PerlenbankGame({ onCorrect, onWrong }) {
	const [level, setLevel] = (0, import_react.useState)(1);
	const generateTarget = (lvl) => {
		const max = lvl * 500;
		return Math.floor(Math.random() * Math.min(max, 9999)) + 1;
	};
	const [targetNumber, setTargetNumber] = (0, import_react.useState)(generateTarget(1));
	const [placedItems, setPlacedItems] = (0, import_react.useState)([]);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const carpetRef = (0, import_react.useRef)(null);
	const calculateTotal = () => placedItems.reduce((acc, item) => {
		if (item.type === "unit") return acc + 1;
		if (item.type === "ten") return acc + 10;
		if (item.type === "hundred") return acc + 100;
		if (item.type === "thousand") return acc + 1e3;
		return acc;
	}, 0);
	const handleDragEndFromBank = (type, point) => {
		const rect = carpetRef.current.getBoundingClientRect();
		const rLeft = rect.left + window.scrollX;
		const rRight = rect.right + window.scrollX;
		const rTop = rect.top + window.scrollY;
		const rBottom = rect.bottom + window.scrollY;
		const buffer = 20;
		if (point.x >= rLeft - buffer && point.x <= rRight + buffer && point.y >= rTop - buffer && point.y <= rBottom + buffer) {
			playPop();
			setPlacedItems((prev) => [...prev, {
				id: Date.now(),
				type,
				x: point.x - rLeft - 20,
				y: point.y - rTop - 20,
				rotation: (Math.random() - .5) * 10
			}]);
		}
	};
	const removeItem = (id) => {
		playPop();
		setPlacedItems((prev) => prev.filter((item) => item.id !== id));
	};
	const checkResult = () => {
		if (calculateTotal() === targetNumber) {
			setFeedback("richtig");
			playSparkle();
			onCorrect(10 + level);
			confetti_module_default({
				particleCount: 200,
				spread: 120,
				origin: { y: .6 }
			});
		} else {
			setFeedback("falsch");
			playError();
			onWrong();
			setTimeout(() => setFeedback(null), 3e3);
		}
	};
	const nextLevel = () => {
		playPop();
		const newLvl = level + 1;
		setLevel(newLvl);
		setTargetNumber(generateTarget(newLvl));
		setPlacedItems([]);
		setFeedback(null);
	};
	const currentTotal = calculateTotal();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-end px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-hand text-4xl font-bold text-slate-800",
				children: "Die Goldene Perlenbank"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white/80 p-4 rounded-3xl border-2 border-amber-200 shadow-lg text-center min-w-[200px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-xs font-bold uppercase text-slate-400 mb-1",
					children: "Deine Aufgabe"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-5xl font-bold text-amber-600",
					children: targetNumber
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-4 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-1 bg-white/60 rounded-3xl border-2 border-white p-6 flex flex-col gap-6 shadow-xl relative z-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-hand text-2xl font-bold text-slate-700 text-center border-b pb-2",
					children: "Die Bank"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-6 py-4 overflow-y-auto max-h-[500px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraggableItem, {
							type: "thousand",
							onDragEnd: handleDragEndFromBank,
							containerRef: null
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraggableItem, {
							type: "hundred",
							onDragEnd: handleDragEndFromBank,
							containerRef: null
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraggableItem, {
							type: "ten",
							onDragEnd: handleDragEndFromBank,
							containerRef: null
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraggableItem, {
							type: "unit",
							onDragEnd: handleDragEndFromBank,
							containerRef: null
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-3 flex flex-col gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: carpetRef,
					className: "relative h-[450px] bg-[#f8fafc] rounded-[40px] border-4 border-dashed border-slate-200 overflow-hidden paper-texture",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: placedItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: { scale: 0 },
						animate: {
							scale: 1,
							x: item.x,
							y: item.y,
							rotate: item.rotation
						},
						exit: { scale: 0 },
						drag: true,
						dragConstraints: carpetRef,
						className: "absolute cursor-grab z-10",
						onDoubleClick: () => removeItem(item.id),
						children: [
							item.type === "unit" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WatercolorBead, { size: 32 }),
							item.type === "ten" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TenBar, {}),
							item.type === "hundred" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HundredSquare, {}),
							item.type === "thousand" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThousandCube, {})
						]
					}, item.id)) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center bg-white/50 p-4 rounded-3xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-6 py-2 bg-slate-100 rounded-full border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-sans text-sm font-bold text-slate-500 mr-2",
								children: "ZÄHLER:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-hand text-3xl font-bold text-slate-800",
								children: currentTotal
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPlacedItems([]),
							className: "text-slate-400 hover:text-red-500 font-hand text-xl",
							children: "Teppich leeren"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
							whileTap: { scale: .95 },
							onClick: checkResult,
							disabled: placedItems.length === 0 || !!feedback,
							className: `px-10 py-3 rounded-2xl font-bold text-white shadow-lg text-xl ${feedback === "richtig" ? "bg-emerald-500" : "bg-amber-500"}`,
							children: feedback === "richtig" ? "Super! ✓" : "Fertig?"
						}), feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
							onClick: nextLevel,
							className: "px-8 py-3 rounded-2xl bg-white border-2 border-amber-200 text-amber-700 text-xl font-bold",
							children: "Nächstes Level →"
						})]
					})]
				})]
			})]
		})]
	});
}
function MultiplikationGame({ onCorrect, onWrong }) {
	const [a, setA] = (0, import_react.useState)(Math.floor(Math.random() * 5) + 2);
	const [b, setB] = (0, import_react.useState)(Math.floor(Math.random() * 5) + 2);
	const target = a * b;
	const [placedDots, setPlacedDots] = (0, import_react.useState)(0);
	const addDot = () => {
		if (placedDots < target) setPlacedDots((prev) => prev + 1);
	};
	const removeDot = () => {
		if (placedDots > 0) setPlacedDots((prev) => prev - 1);
	};
	const check = () => {
		if (placedDots === target) {
			playSparkle();
			onCorrect(3);
			confetti_module_default({ particleCount: 150 });
			setTimeout(() => {
				setA(Math.floor(Math.random() * 5) + 2);
				setB(Math.floor(Math.random() * 5) + 2);
				setPlacedDots(0);
			}, 3e3);
		} else {
			playError();
			onWrong();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6 items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-hand text-4xl font-bold text-slate-800",
				children: "Das Multiplikationsbrett"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-sky-100 rounded-2xl p-6 text-center border-4 border-sky-300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-hand text-6xl font-bold mb-4",
					children: [
						a,
						" × ",
						b
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-sans text-sky-700 font-bold uppercase tracking-widest text-sm",
					children: [
						"Lege ",
						a,
						" Reihen mit jeweils ",
						b,
						" Perlen"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
						whileTap: { scale: .9 },
						onClick: removeDot,
						className: "w-16 h-16 bg-red-400 rounded-full text-white text-4xl shadow",
						children: "-"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 p-6 bg-amber-50 rounded-[40px] border-4 border-amber-200 min-h-[300px] min-w-[300px] place-content-start",
						style: { gridTemplateColumns: `repeat(${b}, minmax(0, 1fr))` },
						children: Array.from({ length: placedDots }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: { scale: 0 },
							animate: { scale: 1 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WatercolorBead, { size: 40 })
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
						whileTap: { scale: .9 },
						onClick: addDot,
						className: "w-16 h-16 bg-emerald-400 rounded-full text-white text-4xl shadow",
						children: "+"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
				whileHover: { scale: 1.05 },
				whileTap: { scale: .95 },
				onClick: check,
				className: "px-10 py-4 bg-sky-500 text-white font-bold rounded-2xl text-xl mt-4 shadow-lg",
				children: "Abgeben"
			})
		]
	});
}
var geometryItems = [
	{
		id: "kreis",
		name: "Kreis",
		type: "2d",
		color: "#f87171"
	},
	{
		id: "quadrat",
		name: "Quadrat",
		type: "2d",
		color: "#60a5fa"
	},
	{
		id: "dreieck",
		name: "Dreieck",
		type: "2d",
		color: "#facc15"
	},
	{
		id: "wurfel",
		name: "Würfel",
		type: "3d",
		color: "#34d399"
	},
	{
		id: "kugel",
		name: "Kugel",
		type: "3d",
		color: "#c084fc"
	},
	{
		id: "zylinder",
		name: "Zylinder",
		type: "3d",
		color: "#fb923c"
	}
];
var ShapeIcon = ({ id, color, size = 60 }) => {
	const props = {
		width: size,
		height: size,
		fill: color,
		stroke: "#333",
		strokeWidth: 2,
		className: "watercolor-effect drop-shadow-md"
	};
	switch (id) {
		case "kreis": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 100 100",
			...props,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "50",
				r: "45"
			})
		});
		case "quadrat": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 100 100",
			...props,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "10",
				y: "10",
				width: "80",
				height: "80",
				rx: "10"
			})
		});
		case "dreieck": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 100 100",
			...props,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "50,10 90,90 10,90",
				strokeLinejoin: "round"
			})
		});
		case "wurfel": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 100 100",
			...props,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "25",
					y: "35",
					width: "50",
					height: "50"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
					points: "25,35 45,15 95,15 75,35",
					fillOpacity: "0.8"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
					points: "75,35 95,15 95,65 75,85",
					fillOpacity: "0.6"
				})
			]
		});
		case "kugel": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 100 100",
			...props,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "50",
				r: "45"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "35",
				cy: "35",
				rx: "15",
				ry: "10",
				fill: "white",
				opacity: "0.5",
				stroke: "none",
				transform: "rotate(-45 35 35)"
			})]
		});
		case "zylinder": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 100 100",
			...props,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "25",
					y: "30",
					width: "50",
					height: "55"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "50",
					cy: "30",
					rx: "25",
					ry: "10",
					fillOpacity: "0.8"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M 25 85 A 25 10 0 0 0 75 85",
					fill: "none"
				})
			]
		});
		default: return null;
	}
};
function FormenGame({ onCorrect, onWrong }) {
	const [remaining, setRemaining] = (0, import_react.useState)(geometryItems);
	const [assigned, setAssigned] = (0, import_react.useState)({
		"2d": [],
		"3d": []
	});
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const containerRef = (0, import_react.useRef)(null);
	const boxesRef = (0, import_react.useRef)({});
	const handleDrop = (item, point) => {
		let target = null;
		Object.keys(boxesRef.current).forEach((type) => {
			const el = boxesRef.current[type];
			if (el) {
				const rect = el.getBoundingClientRect();
				const rLeft = rect.left + window.scrollX;
				const rRight = rect.right + window.scrollX;
				const rTop = rect.top + window.scrollY;
				const rBottom = rect.bottom + window.scrollY;
				const buffer = 20;
				if (point.x >= rLeft - buffer && point.x <= rRight + buffer && point.y >= rTop - buffer && point.y <= rBottom + buffer) target = type;
			}
		});
		if (target) {
			playPop();
			setAssigned((prev) => ({
				...prev,
				[target]: [...prev[target], item]
			}));
			setRemaining((prev) => prev.filter((i) => i.id !== item.id));
		}
	};
	const check = () => {
		let isCorrect = true;
		Object.entries(assigned).forEach(([type, items]) => {
			items.forEach((i) => {
				if (i.type !== type) isCorrect = false;
			});
		});
		if (isCorrect && remaining.length === 0) {
			playSparkle();
			setFeedback("richtig");
			onCorrect(5);
			confetti_module_default();
		} else {
			playError();
			setFeedback("falsch");
			onWrong();
			setTimeout(() => setFeedback(null), 3e3);
		}
	};
	const reset = () => {
		playPop();
		setAssigned({
			"2d": [],
			"3d": []
		});
		setRemaining(geometryItems);
		setFeedback(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		className: "flex flex-col gap-8 items-center w-full pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-4xl font-bold text-slate-800",
					children: "Geometrische Körper & Flächen"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500",
					children: "Ist es flach (2D) oder plastisch (3D)?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white/50 backdrop-blur rounded-[40px] p-8 border-4 border-dashed border-white/60 min-h-[140px] flex flex-wrap justify-center gap-6 shadow-inner w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: remaining.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					drag: true,
					dragConstraints: containerRef,
					dragElastic: .1,
					dragMomentum: false,
					onDragEnd: (e, info) => handleDrop(item, info.point),
					whileDrag: {
						scale: 1.2,
						zIndex: 100
					},
					whileHover: { scale: 1.1 },
					className: "cursor-grab active:cursor-grabbing flex flex-col items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShapeIcon, {
						id: item.id,
						color: item.color
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-hand text-lg mt-1 font-bold text-slate-600",
						children: item.name
					})]
				}, item.id)) }), remaining.length === 0 && feedback !== "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-400",
					children: "Prüfe deine Zuordnung!"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-10 w-full mt-4",
				children: ["2d", "3d"].map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: (el) => boxesRef.current[type] = el,
					className: `min-h-[250px] rounded-3xl border-4 flex flex-col p-6 items-center ${type === "2d" ? "bg-rose-50 border-rose-200" : "bg-indigo-50 border-indigo-200"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-hand text-3xl font-bold mb-4",
						style: { color: type === "2d" ? "#f43f5e" : "#6366f1" },
						children: type === "2d" ? "Flache Formen (2D)" : "Körper (3D)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-4 justify-center",
						children: assigned[type].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: { scale: 0 },
							animate: { scale: 1 },
							className: "flex flex-col items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShapeIcon, {
								id: item.id,
								color: item.color,
								size: 50
							})
						}, item.id))
					})]
				}, type))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: reset,
					className: "font-hand text-2xl text-slate-400 hover:text-slate-600 px-4",
					children: "Zurücksetzen"
				}), !feedback || feedback === "falsch" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
					onClick: check,
					disabled: remaining.length > 0,
					className: "px-10 py-3 bg-emerald-500 text-white font-bold text-xl rounded-2xl shadow-lg disabled:opacity-30",
					children: "Kontrollieren"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					className: "bg-emerald-100 text-emerald-800 px-8 py-3 rounded-2xl font-bold border border-emerald-300 text-xl font-hand",
					children: "Super! Alles richtig sortiert! ✓"
				})]
			})
		]
	});
}
function MatheModule({ onCorrect = () => {}, onWrong = () => {} }) {
	const [activeTab, setActiveTab] = (0, import_react.useState)("himmelwelt");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8 w-full max-w-5xl mx-auto h-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap justify-center gap-4 p-2 bg-slate-200/50 rounded-2xl w-fit mx-auto border-2 border-white shadow-inner",
			children: [
				{
					id: "himmelwelt",
					label: "Himmelswelt",
					color: "bg-sky-500"
				},
				{
					id: "arcade",
					label: "Arcade-Welt",
					color: "bg-orange-500"
				},
				{
					id: "sinn",
					label: "Denk-Abenteuer",
					color: "bg-slate-900"
				},
				{
					id: "perlen",
					label: "Perlenbank",
					color: "bg-amber-400"
				},
				{
					id: "fluss",
					label: "Zahlen-Fluss",
					color: "bg-sky-500"
				},
				{
					id: "muster",
					label: "Muster-Garten",
					color: "bg-emerald-400"
				},
				{
					id: "mosaik",
					label: "Formen-Mosaik",
					color: "bg-violet-400"
				},
				{
					id: "multiplikation",
					label: "Multiplikation",
					color: "bg-sky-400"
				},
				{
					id: "geometrie",
					label: "Geometrie",
					color: "bg-rose-400"
				},
				{
					id: "spielwelt",
					label: "Spielwelt",
					color: "bg-fuchsia-500"
				},
				{
					id: "quest",
					label: "Quest-Mixer",
					color: "bg-emerald-500"
				},
				{
					id: "premium",
					label: "Premium-Atelier",
					color: "bg-amber-500"
				},
				{
					id: "action",
					label: "Zahlen-Fangspiel",
					color: "bg-orange-500"
				},
				{
					id: "varianten",
					label: "Mega-Auswahl",
					color: "bg-slate-800"
				}
			].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setActiveTab(tab.id),
				className: `px-8 py-3 rounded-xl font-hand text-2xl font-bold transition-all
              ${activeTab === tab.id ? `${tab.color} text-white shadow-md scale-105` : "text-slate-500 hover:bg-white/50"}`,
				children: tab.label
			}, tab.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "wait",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 10
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						y: -10
					},
					children: [
						activeTab === "himmelwelt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[620px] rounded-[34px] bg-sky-100/80 border-4 border-white shadow-lg" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkyWonderland, {
								title: "Zahlen-Himmel",
								onCorrect,
								onWrong
							})
						}),
						activeTab === "arcade" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[660px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearningArcade, {
								subject: "mathe",
								onCorrect,
								onWrong
							})
						}),
						activeTab === "sinn" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[640px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeepLearningQuest, {
								subject: "mathe",
								onCorrect,
								onWrong
							})
						}),
						activeTab === "perlen" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerlenbankGame, {
							onCorrect,
							onWrong
						}),
						activeTab === "fluss" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZahlenFluss, {
							onCorrect,
							onWrong
						}),
						activeTab === "muster" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MusterGarten, {
							onCorrect,
							onWrong
						}),
						activeTab === "mosaik" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormenMosaik, {
							onCorrect,
							onWrong
						}),
						activeTab === "multiplikation" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MultiplikationGame, {
							onCorrect,
							onWrong
						}),
						activeTab === "geometrie" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormenGame, {
							onCorrect,
							onWrong
						}),
						activeTab === "spielwelt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameWorld, {
							title: "Zahlen-Spielwelt",
							intro: "Acht Spielarten für Zahlenfolgen, Mal-Reihen, Zerlegen, Formenblick und Premium-Materialaufgaben.",
							collections: SUBJECT_VARIANT_CONTENT.mathe,
							accent: "bg-sky-500",
							scene: "math",
							onCorrect,
							onWrong
						}),
						activeTab === "quest" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestMixer, {
							title: "Zahlen-Quest-Mixer",
							intro: "Expedition, Puzzle, Sternenlauf und Kartenwirbel für Rechnen, Folgen, Formen, Messen und Montessori-Material.",
							collections: SUBJECT_VARIANT_CONTENT.mathe,
							accent: "bg-sky-500",
							onCorrect,
							onWrong
						}),
						activeTab === "premium" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[360px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubjectPremiumAtelier, {
								subject: "mathe",
								onCorrect,
								onWrong
							})
						}),
						activeTab === "action" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionArena, {
							title: "Zahlen-Fangspiel",
							intro: "Fang die passende Zahl, sammle Combo-Punkte und halte die Herzen oben.",
							collections: SUBJECT_VARIANT_CONTENT.mathe,
							accent: "bg-sky-500",
							onCorrect,
							onWrong
						}),
						activeTab === "varianten" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VariantStudio, {
							title: "Zahlen-Mega-Auswahl",
							intro: "Viele Zahlenfolgen, Mal-Reihen, Zerlegungen, Formen-, Mess- und Materialfragen in wechselnden Varianten.",
							collections: SUBJECT_VARIANT_CONTENT.mathe,
							onCorrect,
							onWrong
						})
					]
				}, activeTab)
			})
		})]
	});
}
//#endregion
export { MatheModule as default };
