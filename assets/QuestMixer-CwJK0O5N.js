import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as motion } from "./proxy--6s_pC9q.js";
import { V as AnimatePresence, a as playCoin, h as playJingle, l as playError, w as playPop, z as playWhoosh } from "./sounds-Dh98eEYj.js";
import { i as useReducedMotion, r as confetti_module_default, t as Star } from "./star-DBCbE8d7.js";
import { t as Compass } from "./compass-JckdT0FA.js";
import { t as Grid3x3 } from "./grid-3x3-BjeKZBlx.js";
import { p as RotateCw } from "./learningContent-D1WsycQZ.js";
import { t as Sparkles } from "./sparkles-bt2KNUwI.js";
import { t as Trophy } from "./trophy-Ci-hdIiU.js";
//#region src/components/games/VariantStudio.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
motion.button;
var countItems = (collections) => collections.reduce((sum, collection) => sum + collection.items.length, 0);
function VariantStudio({ title = "Varianten-Werkstatt", intro = "Wähle eine Übungswelt und entdecke immer neue Aufgaben.", collections = [], onCorrect = () => {}, onWrong = () => {} }) {
	const [activeCollectionId, setActiveCollectionId] = (0, import_react.useState)(collections[0]?.id);
	const [challengeIndex, setChallengeIndex] = (0, import_react.useState)(0);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const activeCollection = collections.find((collection) => collection.id === activeCollectionId) || collections[0];
	const challenge = activeCollection?.items[challengeIndex % activeCollection.items.length];
	const total = (0, import_react.useMemo)(() => countItems(collections), [collections]);
	const selectCollection = (id) => {
		playWhoosh();
		setActiveCollectionId(id);
		setChallengeIndex(0);
		setSelected(null);
		setFeedback(null);
	};
	const choose = (option) => {
		if (!challenge || feedback === "richtig") return;
		setSelected(option);
		if (option === challenge.answer) {
			playCoin();
			setFeedback("richtig");
			onCorrect(4);
			confetti_module_default({
				particleCount: 90,
				spread: 90,
				origin: { y: .75 }
			});
		} else {
			playError();
			setFeedback("falsch");
			onWrong();
			setTimeout(() => {
				setSelected(null);
				setFeedback(null);
			}, 1300);
		}
	};
	const nextChallenge = () => {
		playPop();
		setChallengeIndex((index) => index + 1);
		setSelected(null);
		setFeedback(null);
	};
	const surprise = () => {
		if (!collections.length) return;
		playJingle("start");
		const collection = collections[Math.floor(Math.random() * collections.length)];
		setActiveCollectionId(collection.id);
		setChallengeIndex(Math.floor(Math.random() * collection.items.length));
		setSelected(null);
		setFeedback(null);
	};
	if (!activeCollection || !challenge) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-6xl mx-auto py-8 flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400",
						children: [total, " Aufgaben im Pool"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-hand text-5xl font-bold text-slate-800",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-hand text-2xl text-slate-500",
						children: intro
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3",
				children: collections.map((collection) => {
					const active = collection.id === activeCollection.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
						whileHover: {
							scale: 1.04,
							y: -3
						},
						whileTap: { scale: .96 },
						onClick: () => selectCollection(collection.id),
						className: `min-h-28 rounded-[30px] border-4 p-4 shadow-md flex flex-col items-center justify-center gap-1 transition-all ${active ? `${collection.color} text-white border-white ring-4 ring-white` : "bg-white/75 text-slate-600 border-white hover:bg-white"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-4xl",
								children: collection.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-hand text-2xl font-bold leading-none",
								children: collection.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `font-sans text-[10px] uppercase tracking-wide ${active ? "text-white/80" : "text-slate-400"}`,
								children: [collection.items.length, " Varianten"]
							})
						]
					}, collection.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white/65 backdrop-blur-xl rounded-[54px] border-4 border-white shadow-2xl p-6 md:p-8 paper-texture",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-7",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400",
							children: activeCollection.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-hand text-4xl md:text-5xl font-bold text-slate-800 leading-tight",
							children: challenge.prompt
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: surprise,
							className: "px-6 py-3 bg-slate-800 text-white rounded-full font-hand text-2xl font-bold shadow-lg w-fit",
							children: "Zufallskarte"
						})]
					}),
					challenge.support && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 bg-white/70 rounded-[28px] border-2 border-white px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-hand text-2xl text-slate-500",
							children: challenge.support
						}), challenge.example && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-hand text-2xl font-bold text-slate-700",
							children: challenge.example
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
						children: challenge.options.map((option) => {
							const isSelected = selected === option;
							const isCorrect = option === challenge.answer;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
								whileHover: {
									scale: 1.04,
									y: -3
								},
								whileTap: { scale: .96 },
								onClick: () => choose(option),
								className: `min-h-24 rounded-[30px] border-4 px-5 py-4 shadow-lg font-hand text-3xl font-bold transition-all ${isSelected && feedback === "richtig" && isCorrect ? "bg-emerald-100 border-emerald-300 text-emerald-800" : isSelected && feedback === "falsch" ? "bg-rose-100 border-rose-300 text-rose-800" : "bg-white/85 border-white text-slate-700 hover:border-slate-200"}`,
								children: option
							}, option);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-24 flex flex-col items-center gap-4 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
					mode: "wait",
					children: [feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: { opacity: 0 },
						className: "font-hand text-3xl font-bold text-rose-500",
						children: "Noch nicht ganz. Schau noch einmal auf die Spur."
					}, "wrong"), feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: { opacity: 0 },
						className: "flex flex-col items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-hand text-3xl font-bold text-emerald-600",
							children: "Genau. Nächste Variante?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: nextChallenge,
							className: "px-8 py-3 bg-emerald-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg",
							children: "Nächste Aufgabe"
						})]
					}, "right")]
				})
			})
		]
	});
}
//#endregion
//#region src/components/games/ActionArena.jsx
motion.button;
var ORB_MOTIONS = [
	{
		x: [
			0,
			18,
			-10,
			0
		],
		y: [
			0,
			-18,
			12,
			0
		],
		rotate: [
			0,
			5,
			-4,
			0
		]
	},
	{
		x: [
			0,
			-16,
			12,
			0
		],
		y: [
			0,
			14,
			-16,
			0
		],
		rotate: [
			0,
			-6,
			5,
			0
		]
	},
	{
		x: [
			0,
			12,
			22,
			0
		],
		y: [
			0,
			-12,
			18,
			0
		],
		rotate: [
			0,
			4,
			8,
			0
		]
	},
	{
		x: [
			0,
			-20,
			8,
			0
		],
		y: [
			0,
			18,
			-10,
			0
		],
		rotate: [
			0,
			-5,
			4,
			0
		]
	}
];
var HEARTS$2 = [
	"♥",
	"♥",
	"♥"
];
function ActionArena({ title = "Action-Spiel", intro = "Fang die richtige Antwort, bevor die Zeit abläuft.", collections = [], accent = "bg-fuchsia-500", onCorrect = () => {}, onWrong = () => {} }) {
	const [activeCollectionId, setActiveCollectionId] = (0, import_react.useState)(collections[0]?.id);
	const [challengeIndex, setChallengeIndex] = (0, import_react.useState)(0);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(45);
	const [hearts, setHearts] = (0, import_react.useState)(3);
	const [combo, setCombo] = (0, import_react.useState)(0);
	const [arenaScore, setArenaScore] = (0, import_react.useState)(0);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [roundComplete, setRoundComplete] = (0, import_react.useState)(false);
	const [fieldSeed, setFieldSeed] = (0, import_react.useState)(0);
	const activeCollection = collections.find((collection) => collection.id === activeCollectionId) || collections[0];
	const challenges = activeCollection?.items || [];
	const challenge = challenges[challengeIndex % Math.max(1, challenges.length)];
	const totalVariants = (0, import_react.useMemo)(() => collections.reduce((sum, collection) => sum + collection.items.length, 0), [collections]);
	(0, import_react.useEffect)(() => {
		if (!running || roundComplete) return void 0;
		const timer = setInterval(() => {
			setTimeLeft((value) => {
				if (value <= 1) {
					setRoundComplete(true);
					setRunning(false);
					return 0;
				}
				return value - 1;
			});
		}, 1e3);
		return () => clearInterval(timer);
	}, [running, roundComplete]);
	const resetRound = (start = true) => {
		playJingle(start ? "start" : "calm");
		setRunning(start);
		setTimeLeft(45);
		setHearts(3);
		setCombo(0);
		setArenaScore(0);
		setSelected(null);
		setFeedback(null);
		setRoundComplete(false);
		setFieldSeed((seed) => seed + 1);
	};
	const selectCollection = (id) => {
		playWhoosh();
		setActiveCollectionId(id);
		setChallengeIndex(0);
		setRunning(false);
		setTimeLeft(45);
		setHearts(3);
		setCombo(0);
		setArenaScore(0);
		setSelected(null);
		setFeedback(null);
		setRoundComplete(false);
		setFieldSeed((seed) => seed + 1);
	};
	const nextChallenge = () => {
		setChallengeIndex((index) => (index + 1) % Math.max(1, challenges.length));
		setSelected(null);
		setFeedback(null);
		setFieldSeed((seed) => seed + 1);
	};
	const choose = (option) => {
		if (!running || roundComplete || feedback) return;
		setSelected(option);
		if (option === challenge.answer) {
			const nextCombo = combo + 1;
			const bonus = 8 + Math.min(nextCombo, 8) * 2;
			setCombo(nextCombo);
			setArenaScore((score) => score + bonus);
			setFeedback("richtig");
			if (nextCombo % 4 === 0) playJingle("combo");
			else playCoin();
			onCorrect(2 + Math.min(nextCombo, 4));
			if (nextCombo % 4 === 0) confetti_module_default({
				particleCount: 80,
				spread: 85,
				origin: { y: .75 }
			});
			setTimeout(nextChallenge, 780);
		} else {
			const nextHearts = hearts - 1;
			setHearts(nextHearts);
			setCombo(0);
			setFeedback("falsch");
			playError();
			onWrong();
			setTimeout(() => {
				setSelected(null);
				setFeedback(null);
				if (nextHearts <= 0) {
					setRoundComplete(true);
					setRunning(false);
				}
			}, 850);
		}
	};
	if (!activeCollection || !challenge) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-6xl mx-auto py-8 flex flex-col gap-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400",
						children: [totalVariants, " Aufgaben im Action-Pool"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-hand text-5xl font-bold text-slate-800",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-hand text-2xl text-slate-500",
						children: intro
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-3",
				children: collections.map((collection) => {
					const active = collection.id === activeCollection.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
						whileHover: {
							y: -3,
							scale: 1.04
						},
						whileTap: { scale: .95 },
						onClick: () => selectCollection(collection.id),
						className: `px-5 py-3 rounded-full border-2 font-hand text-xl font-bold shadow-md flex items-center gap-2 transition-all ${active ? `${collection.color} text-white border-white ring-4 ring-white` : "bg-white/75 text-slate-500 border-white hover:bg-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: collection.icon }), collection.label]
					}, collection.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white/65 rounded-[56px] border-4 border-white shadow-2xl p-5 md:p-7 overflow-hidden relative paper-texture",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white/80 rounded-3xl p-4 border-2 border-white shadow-inner",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400",
								children: "Zeit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-hand text-4xl font-bold text-slate-800",
								children: [timeLeft, "s"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white/80 rounded-3xl p-4 border-2 border-white shadow-inner",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400",
								children: "Herzen"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-hand text-4xl font-bold text-rose-500",
								children: HEARTS$2.map((heart, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: index < hearts ? "" : "opacity-20",
									children: heart
								}, index))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white/80 rounded-3xl p-4 border-2 border-white shadow-inner",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400",
								children: "Combo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-hand text-4xl font-bold text-orange-500",
								children: [combo, "x"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white/80 rounded-3xl p-4 border-2 border-white shadow-inner",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400",
								children: "Arena"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-hand text-4xl font-bold text-emerald-600",
								children: arenaScore
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-h-[430px] rounded-[44px] border-4 border-white bg-gradient-to-br from-white via-slate-50 to-amber-50 shadow-inner overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							className: "absolute inset-0 opacity-50",
							animate: { backgroundPosition: [
								"0% 0%",
								"100% 100%",
								"0% 0%"
							] },
							transition: {
								duration: 18,
								repeat: Infinity,
								ease: "linear"
							},
							style: {
								backgroundImage: "radial-gradient(circle at 20% 20%, rgba(251,191,36,.25), transparent 22%), radial-gradient(circle at 80% 30%, rgba(96,165,250,.22), transparent 24%), radial-gradient(circle at 50% 85%, rgba(244,114,182,.18), transparent 28%)",
								backgroundSize: "140% 140%"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 p-5 md:p-7",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-white/80 rounded-[34px] border-4 border-white shadow-lg p-5 mb-7",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400",
											children: activeCollection.label
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
									]
								}),
								!running && !roundComplete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 z-20 flex items-center justify-center bg-white/55 backdrop-blur-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
										whileHover: { scale: 1.06 },
										whileTap: { scale: .94 },
										onClick: () => resetRound(true),
										className: `px-10 py-5 ${accent} text-white rounded-full font-hand text-4xl font-bold shadow-2xl border-4 border-white`,
										children: "Runde starten"
									})
								}),
								roundComplete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
										initial: {
											scale: .86,
											opacity: 0
										},
										animate: {
											scale: 1,
											opacity: 1
										},
										className: "bg-white rounded-[44px] border-4 border-white shadow-2xl p-8 text-center max-w-md",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400",
												children: "Runde beendet"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
												className: "font-hand text-5xl font-bold text-slate-800",
												children: [arenaScore, " Arena-Punkte"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-hand text-2xl text-slate-500 mt-2",
												children: "Starte neu und versuche eine längere Combo."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => resetRound(true),
												className: `mt-5 px-8 py-3 ${accent} text-white rounded-full font-hand text-2xl font-bold shadow-lg`,
												children: "Nochmal spielen"
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 min-h-56 items-center",
									children: challenge.options.map((option, index) => {
										const motionPath = ORB_MOTIONS[index % ORB_MOTIONS.length];
										const isSelected = selected === option;
										const correct = option === challenge.answer;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
											initial: {
												opacity: 0,
												scale: .6,
												y: 30
											},
											animate: {
												opacity: running || roundComplete ? 1 : .45,
												scale: 1,
												x: motionPath.x,
												y: motionPath.y,
												rotate: motionPath.rotate
											},
											transition: {
												opacity: { duration: .25 },
												scale: {
													type: "spring",
													bounce: .45
												},
												x: {
													duration: 3 + index * .4,
													repeat: Infinity,
													ease: "easeInOut"
												},
												y: {
													duration: 3.4 + index * .35,
													repeat: Infinity,
													ease: "easeInOut"
												},
												rotate: {
													duration: 3.2 + index * .25,
													repeat: Infinity,
													ease: "easeInOut"
												}
											},
											whileHover: { scale: 1.1 },
											whileTap: { scale: .9 },
											onClick: () => choose(option),
											className: `min-h-36 rounded-[38px] border-4 shadow-xl p-5 font-hand text-3xl font-bold transition-colors ${isSelected && feedback === "richtig" && correct ? "bg-emerald-100 border-emerald-300 text-emerald-800" : isSelected && feedback === "falsch" ? "bg-rose-100 border-rose-300 text-rose-800" : "bg-white/90 border-white text-slate-700"}`,
											children: option
										}, `${fieldSeed}-${option}`);
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, { children: [feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								scale: .8,
								y: 20
							},
							animate: {
								opacity: 1,
								scale: 1,
								y: 0
							},
							exit: { opacity: 0 },
							className: "absolute bottom-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl",
							children: ["Treffer! Combo ", combo + 1]
						}), feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								scale: .8,
								y: 20
							},
							animate: {
								opacity: 1,
								scale: 1,
								y: 0
							},
							exit: { opacity: 0 },
							className: "absolute bottom-5 left-1/2 -translate-x-1/2 bg-rose-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl",
							children: "Fast. Neues Ziel suchen."
						})] })
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/PremiumIllustration.jsx
var PALETTE = {
	ink: "#3e3c38",
	line: "#6b5f55",
	paper: "#fffaf0",
	paperWarm: "#fff4dc",
	amber: "#f59e0b",
	amberSoft: "#fde68a",
	rose: "#f9a8d4",
	roseDeep: "#db2777",
	sky: "#7dd3fc",
	skyDeep: "#0284c7",
	green: "#86efac",
	greenDeep: "#16a34a",
	violet: "#c4b5fd",
	violetDeep: "#7c3aed",
	clay: "#d97706",
	coral: "#fb7185"
};
var PREMIUM_ILLUSTRATION_VARIANTS = [
	"hero",
	"language",
	"numbers",
	"world",
	"harmony",
	"music"
];
var SUBJECT_ACCENTS = {
	hero: [
		PALETTE.violet,
		PALETTE.rose,
		PALETTE.amberSoft
	],
	language: [
		PALETTE.amberSoft,
		PALETTE.rose,
		PALETTE.sky
	],
	numbers: [
		PALETTE.sky,
		PALETTE.amberSoft,
		PALETTE.violet
	],
	world: [
		PALETTE.green,
		PALETTE.sky,
		PALETTE.amberSoft
	],
	harmony: [
		PALETTE.violet,
		PALETTE.rose,
		PALETTE.green
	],
	music: [
		PALETTE.rose,
		PALETTE.amberSoft,
		PALETTE.sky
	]
};
function makeId(raw) {
	return raw.replace(/[^a-zA-Z0-9_-]/g, "");
}
function Defs({ id, accents }) {
	const [a, b, c] = accents;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("filter", {
			id: `${id}-paper`,
			x: "-20%",
			y: "-20%",
			width: "140%",
			height: "140%",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feTurbulence", {
					type: "fractalNoise",
					baseFrequency: "0.72",
					numOctaves: "3",
					seed: "8"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feColorMatrix", {
					type: "saturate",
					values: "0"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feComponentTransfer", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feFuncA", {
					type: "table",
					tableValues: "0 0.12"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feBlend", {
					in: "SourceGraphic",
					mode: "multiply"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("filter", {
			id: `${id}-bleed`,
			x: "-16%",
			y: "-16%",
			width: "132%",
			height: "132%",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feTurbulence", {
				type: "fractalNoise",
				baseFrequency: "0.035",
				numOctaves: "2",
				seed: "11",
				result: "noise"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feDisplacementMap", {
				in: "SourceGraphic",
				in2: "noise",
				scale: "3.5"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("filter", {
			id: `${id}-shadow`,
			x: "-24%",
			y: "-24%",
			width: "148%",
			height: "148%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feDropShadow", {
				dx: "0",
				dy: "10",
				stdDeviation: "10",
				floodColor: "#6b5f55",
				floodOpacity: "0.13"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
			id: `${id}-wash-a`,
			cx: "42%",
			cy: "35%",
			r: "70%",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: "#ffffff",
					stopOpacity: "0.82"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "48%",
					stopColor: a,
					stopOpacity: "0.62"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: b,
					stopOpacity: "0.28"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
			id: `${id}-wash-b`,
			cx: "58%",
			cy: "35%",
			r: "70%",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: "#ffffff",
					stopOpacity: "0.7"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "58%",
					stopColor: c,
					stopOpacity: "0.58"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: a,
					stopOpacity: "0.22"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
			id: `${id}-thread`,
			x1: "65",
			y1: "46",
			x2: "285",
			y2: "230",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", { stopColor: PALETTE.roseDeep }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0.42",
					stopColor: PALETTE.violetDeep
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "1",
					stopColor: PALETTE.skyDeep
				})
			]
		})
	] });
}
function ScribbleOval({ cx, cy, rx, ry, fill, stroke = PALETTE.line, opacity = 1 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		filter: "url(#none)",
		opacity,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: `M${cx - rx + 4} ${cy + 3} C${cx - rx - 7} ${cy - ry + 14} ${cx - 22} ${cy - ry - 8} ${cx + 4} ${cy - ry + 2} C${cx + rx + 26} ${cy - ry + 7} ${cx + rx + 10} ${cy + ry - 9} ${cx + 10} ${cy + ry + 3} C${cx - 24} ${cy + ry + 11} ${cx - rx - 12} ${cy + ry - 10} ${cx - rx + 4} ${cy + 3} Z`,
			fill,
			stroke,
			strokeWidth: "2.4",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: `M${cx - rx + 11} ${cy - 5} C${cx - 34} ${cy - ry - 17} ${cx + 31} ${cy - ry - 11} ${cx + rx - 8} ${cy + 2} C${cx + 35} ${cy + ry + 14} ${cx - 40} ${cy + ry + 9} ${cx - rx + 11} ${cy - 5} Z`,
			fill: "none",
			stroke: "#ffffff",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			opacity: "0.42"
		})]
	});
}
function PaperCard({ id }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		filter: `url(#${id}-shadow)`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M54 52 C92 35 234 32 292 54 C313 95 314 205 290 246 C228 270 88 266 48 244 C30 184 31 94 54 52 Z",
			fill: PALETTE.paper,
			stroke: "#eadfca",
			strokeWidth: "3",
			filter: `url(#${id}-paper)`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M69 70 C114 57 225 55 274 72 C288 111 286 194 273 229 C216 244 101 243 68 226 C53 172 54 110 69 70 Z",
			fill: "none",
			stroke: "#ffffff",
			strokeWidth: "2",
			opacity: "0.7"
		})]
	});
}
function Plant({ x, y, scale = 1 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: `translate(${x} ${y}) scale(${scale})`,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 34 C1 20 1 8 0 -4",
				stroke: PALETTE.greenDeep,
				strokeWidth: "3",
				fill: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 17 C-17 8 -20 -8 -5 -14 C9 -9 11 6 0 17 Z",
				fill: PALETTE.green,
				stroke: PALETTE.greenDeep,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M1 22 C18 9 25 -7 10 -14 C-4 -7 -7 9 1 22 Z",
				fill: "#6ee7b7",
				stroke: PALETTE.greenDeep,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 9 C-7 3 -11 -2 -13 -8",
				stroke: "#ffffff",
				strokeWidth: "1.4",
				opacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M2 14 C8 8 12 2 14 -6",
				stroke: "#ffffff",
				strokeWidth: "1.4",
				opacity: "0.55"
			})
		]
	});
}
function GoldenBeads() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: "translate(193 143)",
		children: [[
			0,
			1,
			2
		].map((row) => [
			0,
			1,
			2
		].map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: col * 18,
			cy: row * 18,
			r: "7.4",
			fill: PALETTE.amberSoft,
			stroke: PALETTE.clay,
			strokeWidth: "1.6"
		}, `${row}-${col}`))), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M-8 -9 L45 47",
			stroke: "#ffffff",
			strokeWidth: "2",
			opacity: "0.45",
			strokeLinecap: "round"
		})]
	});
}
function Book() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: "translate(82 139)",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10 0 C33 -7 53 -3 72 9 L72 65 C49 52 31 51 10 60 Z",
				fill: "#fff7ed",
				stroke: PALETTE.clay,
				strokeWidth: "2.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M72 9 C94 -4 113 -6 135 1 L135 60 C112 52 94 53 72 65 Z",
				fill: "#fff1f2",
				stroke: PALETTE.roseDeep,
				strokeWidth: "2.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M72 11 L72 65",
				stroke: PALETTE.line,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M26 18 C39 15 49 16 61 21 M25 32 C40 29 49 31 60 36",
				stroke: PALETTE.clay,
				strokeWidth: "1.8",
				opacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M87 19 C101 14 112 14 125 18 M87 33 C101 29 113 29 126 34",
				stroke: PALETTE.roseDeep,
				strokeWidth: "1.8",
				opacity: "0.5"
			})
		]
	});
}
function Globe() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: "translate(164 121)",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "0",
				cy: "0",
				r: "48",
				fill: PALETTE.sky,
				stroke: PALETTE.skyDeep,
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M-31 -21 C-12 -33 4 -25 10 -12 C1 -9 -4 1 0 12 C-17 14 -31 7 -34 -8 Z",
				fill: PALETTE.green,
				stroke: PALETTE.greenDeep,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 -28 C34 -18 41 2 33 22 C21 25 11 18 12 7 C22 3 24 -10 16 -28 Z",
				fill: "#6ee7b7",
				stroke: PALETTE.greenDeep,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M-47 2 C-17 12 16 12 47 2 M-38 -27 C-13 -18 16 -18 38 -27 M-38 27 C-12 20 14 20 38 27",
				stroke: "#ffffff",
				strokeWidth: "1.5",
				opacity: "0.58"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M-56 58 C-19 72 21 72 58 58",
				stroke: PALETTE.line,
				strokeWidth: "3",
				fill: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 49 L0 68",
				stroke: PALETTE.line,
				strokeWidth: "3"
			})
		]
	});
}
function MusicNotes() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: "translate(95 111)",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M6 56 C45 20 92 18 140 40",
				stroke: PALETTE.violetDeep,
				strokeWidth: "3",
				fill: "none",
				opacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M34 23 L34 78",
				stroke: PALETTE.roseDeep,
				strokeWidth: "4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "23",
				cy: "80",
				rx: "15",
				ry: "10",
				fill: PALETTE.rose,
				stroke: PALETTE.roseDeep,
				strokeWidth: "2.3",
				transform: "rotate(-16 23 80)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M92 8 L92 64",
				stroke: PALETTE.skyDeep,
				strokeWidth: "4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "80",
				cy: "67",
				rx: "15",
				ry: "10",
				fill: PALETTE.sky,
				stroke: PALETTE.skyDeep,
				strokeWidth: "2.3",
				transform: "rotate(-16 80 67)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M92 8 C111 15 120 19 136 17 L136 29 C118 31 108 24 92 19 Z",
				fill: PALETTE.amberSoft,
				stroke: PALETTE.clay,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "135",
				cy: "78",
				r: "15",
				fill: PALETTE.green,
				stroke: PALETTE.greenDeep,
				strokeWidth: "2.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M129 76 L135 83 L145 71",
				stroke: "#ffffff",
				strokeWidth: "3",
				fill: "none"
			})
		]
	});
}
function HarmonyHands() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: "translate(91 133)",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M60 53 C36 45 14 29 9 9 C7 -1 17 -6 24 3 C31 13 38 21 49 27",
				fill: "#fed7aa",
				stroke: PALETTE.clay,
				strokeWidth: "2.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M113 53 C138 46 159 30 164 10 C167 0 156 -6 149 3 C141 14 134 22 124 28",
				fill: "#fecdd3",
				stroke: PALETTE.roseDeep,
				strokeWidth: "2.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M55 30 C74 10 96 10 117 30 C118 53 103 70 86 78 C69 70 54 53 55 30 Z",
				fill: PALETTE.violet,
				stroke: PALETTE.violetDeep,
				strokeWidth: "2.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M76 38 C82 32 90 32 96 38",
				stroke: "#ffffff",
				strokeWidth: "2.4",
				fill: "none",
				opacity: "0.62"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M74 51 C82 58 91 58 100 51",
				stroke: PALETTE.violetDeep,
				strokeWidth: "2.4",
				fill: "none"
			})
		]
	});
}
function LanguageLetters() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: "translate(82 97)",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Book, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
			transform: "translate(18 1)",
			children: [
				[
					"A",
					0,
					7,
					PALETTE.amberSoft,
					PALETTE.clay
				],
				[
					"M",
					73,
					-9,
					PALETTE.sky,
					PALETTE.skyDeep
				],
				[
					"L",
					138,
					20,
					PALETTE.rose,
					PALETTE.roseDeep
				]
			].map(([letter, x, y, fill, stroke]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				transform: `translate(${x} ${y}) rotate(${letter === "M" ? 8 : -7})`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M2 7 C14 -2 35 0 45 9 C48 25 42 41 25 45 C8 43 -3 28 2 7 Z",
					fill,
					stroke,
					strokeWidth: "2.3"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "22",
					y: "32",
					textAnchor: "middle",
					fontFamily: "Caveat, cursive",
					fontSize: "30",
					fontWeight: "700",
					fill: PALETTE.ink,
					children: letter
				})]
			}, letter))
		})]
	});
}
function NumbersBoard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldenBeads, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: "translate(83 100)",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M5 10 C35 -2 84 -1 112 11 L108 86 C78 94 36 94 6 84 Z",
				fill: "#eff6ff",
				stroke: PALETTE.skyDeep,
				strokeWidth: "2.8"
			}),
			[
				0,
				1,
				2
			].map((row) => [
				0,
				1,
				2
			].map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: `M${25 + col * 27} ${28 + row * 18} C${31 + col * 27} ${25 + row * 18} ${38 + col * 27} ${25 + row * 18} ${44 + col * 27} ${28 + row * 18}`,
				stroke: row === col ? PALETTE.violetDeep : PALETTE.skyDeep,
				strokeWidth: "2.6",
				fill: "none",
				opacity: "0.7"
			}, `${row}-${col}`))),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "56",
				y: "72",
				textAnchor: "middle",
				fontFamily: "Caveat, cursive",
				fontSize: "36",
				fontWeight: "700",
				fill: PALETTE.ink,
				children: "123"
			})
		]
	})] });
}
function HeroScene({ id }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M91 187 C122 109 202 100 242 177",
			stroke: `url(#${id}-thread)`,
			strokeWidth: "5",
			fill: "none",
			strokeLinecap: "round",
			opacity: "0.55"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScribbleOval, {
			cx: "118",
			cy: "120",
			rx: "43",
			ry: "42",
			fill: `url(#${id}-wash-a)`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScribbleOval, {
			cx: "219",
			cy: "125",
			rx: "44",
			ry: "42",
			fill: `url(#${id}-wash-b)`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScribbleOval, {
			cx: "168",
			cy: "169",
			rx: "57",
			ry: "40",
			fill: "#ffffff",
			opacity: "0.88"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Book, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldenBeads, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plant, {
			x: "69",
			y: "209",
			scale: "0.9"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plant, {
			x: "271",
			y: "211",
			scale: "0.8"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M128 86 C141 67 158 65 171 85 C183 65 202 67 214 86 C215 111 196 129 171 143 C146 129 127 111 128 86 Z",
			fill: PALETTE.rose,
			stroke: PALETTE.roseDeep,
			strokeWidth: "3"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M154 97 C164 90 177 91 187 98",
			stroke: "#ffffff",
			strokeWidth: "2.4",
			opacity: "0.7",
			strokeLinecap: "round"
		})
	] });
}
function VariantScene({ id, variant }) {
	if (variant === "language") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageLetters, {});
	if (variant === "numbers") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumbersBoard, {});
	if (variant === "world") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plant, {
			x: "82",
			y: "208",
			scale: "0.85"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plant, {
			x: "252",
			y: "212",
			scale: "0.75"
		})
	] });
	if (variant === "harmony") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HarmonyHands, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plant, {
			x: "73",
			y: "211",
			scale: "0.7"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plant, {
			x: "267",
			y: "211",
			scale: "0.7"
		})
	] });
	if (variant === "music") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MusicNotes, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plant, {
		x: "257",
		y: "211",
		scale: "0.72"
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroScene, { id });
}
function PremiumIllustration({ variant = "hero", title, size = 320, className = "", animated = true }) {
	const id = makeId(`premium-${variant}-${(0, import_react.useId)()}`);
	const safeVariant = PREMIUM_ILLUSTRATION_VARIANTS.includes(variant) ? variant : "hero";
	const accents = SUBJECT_ACCENTS[safeVariant];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(animated ? motion.svg : "svg", {
		width: size,
		height: size,
		viewBox: "0 0 340 300",
		role: title ? "img" : "presentation",
		"aria-label": title,
		className: `overflow-visible drop-shadow-xl ${className}`,
		initial: animated ? {
			opacity: 0,
			y: 10,
			rotate: -1
		} : void 0,
		animate: animated ? {
			opacity: 1,
			y: [
				0,
				-5,
				0
			],
			rotate: [
				-1,
				1,
				-1
			]
		} : void 0,
		transition: animated ? {
			opacity: { duration: .45 },
			y: {
				duration: 6,
				repeat: Infinity,
				ease: "easeInOut"
			},
			rotate: {
				duration: 7,
				repeat: Infinity,
				ease: "easeInOut"
			}
		} : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Defs, {
				id,
				accents
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperCard, { id }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				filter: `url(#${id}-bleed)`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M71 91 C107 55 233 49 276 88 C293 124 287 204 262 232 C205 255 95 249 62 222 C42 175 42 119 71 91 Z",
					fill: `url(#${id}-wash-a)`,
					opacity: "0.5"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M106 68 C151 51 236 65 260 108 C230 89 154 83 100 103 Z",
					fill: `url(#${id}-wash-b)`,
					opacity: "0.38"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VariantScene, {
				id,
				variant: safeVariant
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M46 246 C101 269 237 270 294 240",
				stroke: "#ffffff",
				strokeWidth: "2.5",
				opacity: "0.54",
				strokeLinecap: "round",
				fill: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M54 56 C102 39 232 37 291 57",
				stroke: "#ffffff",
				strokeWidth: "2",
				opacity: "0.48",
				strokeLinecap: "round",
				fill: "none"
			})
		]
	});
}
//#endregion
//#region src/components/PremiumScene.jsx
var MotionDiv$2 = motion.div;
var MotionSpan$1 = motion.span;
var sceneConfig = {
	language: {
		bg: [
			"#fff7ed",
			"#fef3c7",
			"#fde68a"
		],
		ink: "#92400e",
		accent: "#f97316",
		soft: "#fed7aa",
		title: "Wortatelier",
		motifs: [
			"A",
			"B",
			"SCH",
			"RE"
		]
	},
	math: {
		bg: [
			"#eff6ff",
			"#dbeafe",
			"#bfdbfe"
		],
		ink: "#1d4ed8",
		accent: "#0ea5e9",
		soft: "#bae6fd",
		title: "Zahlenwerkstatt",
		motifs: [
			"3",
			"8",
			"+",
			"="
		]
	},
	world: {
		bg: [
			"#ecfdf5",
			"#d1fae5",
			"#a7f3d0"
		],
		ink: "#047857",
		accent: "#10b981",
		soft: "#bbf7d0",
		title: "Forscherpfad",
		motifs: [
			"✦",
			"☁",
			"↟",
			"◌"
		]
	},
	heart: {
		bg: [
			"#fdf2f8",
			"#fae8ff",
			"#fce7f3"
		],
		ink: "#a21caf",
		accent: "#ec4899",
		soft: "#fbcfe8",
		title: "Herzgarten",
		motifs: [
			"♥",
			"↔",
			"✓",
			"…"
		]
	},
	music: {
		bg: [
			"#fff1f2",
			"#ffe4e6",
			"#fce7f3"
		],
		ink: "#be123c",
		accent: "#d946ef",
		soft: "#fbcfe8",
		title: "Klangbühne",
		motifs: [
			"♪",
			"♫",
			"♬",
			"𝄞"
		]
	},
	default: {
		bg: [
			"#f8fafc",
			"#f1f5f9",
			"#e2e8f0"
		],
		ink: "#334155",
		accent: "#8b5cf6",
		soft: "#ddd6fe",
		title: "Spielwelt",
		motifs: [
			"✦",
			"●",
			"◆",
			"○"
		]
	}
};
var modeProps = {
	blitz: {
		icon: "⚡",
		path: "M40 138 C95 84 146 110 208 64 C265 22 318 56 374 30"
	},
	schatz: {
		icon: "🗺️",
		path: "M42 128 C92 160 142 94 196 126 C252 160 292 70 376 104"
	},
	wirbel: {
		icon: "🌀",
		path: "M70 102 C112 58 190 60 212 106 C234 154 152 178 120 134 C94 98 142 78 172 100"
	},
	meister: {
		icon: "🏆",
		path: "M52 130 C106 96 128 46 208 82 C274 112 300 56 370 74"
	},
	expedition: {
		icon: "🧭",
		path: "M34 148 C88 132 104 78 160 94 C216 112 230 50 286 66 C330 78 338 124 384 102"
	},
	atelier: {
		icon: "🎨",
		path: "M54 92 C116 42 180 158 236 94 C288 36 322 128 382 76"
	},
	puzzle: {
		icon: "🧩",
		path: "M42 118 C90 70 134 152 184 108 C236 64 292 146 370 76"
	},
	sternenlauf: {
		icon: "⭐",
		path: "M44 150 C92 90 142 92 190 136 C240 182 292 86 374 52"
	}
};
function PremiumScene({ scene = "default", mode = "blitz", compact = false }) {
	const shouldReduceMotion = useReducedMotion();
	const cfg = sceneConfig[scene] || sceneConfig.default;
	const modeCfg = modeProps[mode] || modeProps.blitz;
	const [top, middle, bottom] = cfg.bg;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative overflow-hidden rounded-[38px] border-4 border-white shadow-xl ${compact ? "h-48" : "h-64 md:h-72"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 420 240",
				className: "absolute inset-0 w-full h-full",
				preserveAspectRatio: "none",
				"aria-hidden": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: `premium-scene-${scene}-${mode}`,
						x1: "0",
						x2: "1",
						y1: "0",
						y2: "1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: top
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "54%",
								stopColor: middle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: bottom
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("filter", {
						id: `premium-paper-${scene}-${mode}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feTurbulence", {
							type: "fractalNoise",
							baseFrequency: "0.018",
							numOctaves: "3",
							seed: "7"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feDisplacementMap", {
							in: "SourceGraphic",
							scale: "3"
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						width: "420",
						height: "240",
						fill: `url(#premium-scene-${scene}-${mode})`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M-20 194 C76 160 132 202 222 172 C302 146 360 180 444 146 L444 260 L-20 260 Z",
						fill: "rgba(255,255,255,.58)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M-10 72 C68 24 136 80 220 38 C308 -6 360 46 438 18",
						fill: "none",
						stroke: "rgba(255,255,255,.55)",
						strokeWidth: "24",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: modeCfg.path,
						fill: "none",
						stroke: "rgba(255,255,255,.88)",
						strokeWidth: "12",
						strokeLinecap: "round",
						strokeDasharray: "1 22"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: modeCfg.path,
						fill: "none",
						stroke: cfg.ink,
						strokeWidth: "2.5",
						strokeLinecap: "round",
						strokeDasharray: "10 15",
						opacity: ".32"
					}),
					[
						0,
						1,
						2,
						3
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						transform: `translate(${44 + item * 94} ${52 + item % 2 * 78}) rotate(${item % 2 ? 8 : -7})`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "0",
								y: "0",
								width: "70",
								height: "58",
								rx: "18",
								fill: "rgba(255,255,255,.72)",
								stroke: "rgba(255,255,255,.9)",
								strokeWidth: "4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "17",
								cy: "18",
								r: "8",
								fill: cfg.soft
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: "35",
								y: "35",
								textAnchor: "middle",
								fontFamily: "Caveat, cursive",
								fontSize: "25",
								fontWeight: "700",
								fill: cfg.ink,
								children: cfg.motifs[item]
							})
						]
					}, item))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv$2, {
				className: "absolute left-[9%] top-[17%] w-24 h-24 md:w-28 md:h-28 rounded-[34px] bg-white/80 border-4 border-white shadow-xl flex items-center justify-center text-5xl",
				animate: shouldReduceMotion ? {
					y: 0,
					rotate: -3
				} : {
					y: [
						0,
						-10,
						0
					],
					rotate: [
						-3,
						4,
						-3
					]
				},
				transition: {
					duration: 5,
					repeat: shouldReduceMotion ? 0 : 2,
					ease: "easeInOut"
				},
				children: modeCfg.icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv$2, {
				className: "absolute right-[8%] top-[18%] w-28 h-20 rounded-[32px] bg-white/75 border-4 border-white shadow-lg flex items-center justify-center",
				animate: shouldReduceMotion ? {
					y: 0,
					rotate: 4
				} : {
					y: [
						0,
						8,
						0
					],
					rotate: [
						4,
						-3,
						4
					]
				},
				transition: {
					duration: 6,
					repeat: shouldReduceMotion ? 0 : 2,
					ease: "easeInOut"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 110 74",
					className: "w-24 h-16",
					"aria-hidden": true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M14 54 C26 18 48 46 60 20 C76 -10 96 26 94 54",
							fill: "none",
							stroke: cfg.accent,
							strokeWidth: "7",
							strokeLinecap: "round"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "23",
							cy: "54",
							r: "6",
							fill: cfg.ink,
							opacity: ".75"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "56",
							cy: "27",
							r: "6",
							fill: cfg.ink,
							opacity: ".75"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "91",
							cy: "54",
							r: "6",
							fill: cfg.ink,
							opacity: ".75"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute left-6 right-6 bottom-5 flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-4xl md:text-5xl font-bold text-slate-800 leading-none",
					children: cfg.title
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden sm:flex gap-2",
					children: [
						0,
						1,
						2
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionSpan$1, {
						className: "w-9 h-9 rounded-full bg-white/75 border-2 border-white shadow-md flex items-center justify-center font-hand text-xl font-bold",
						style: { color: cfg.ink },
						animate: shouldReduceMotion ? {
							y: 0,
							scale: 1
						} : {
							y: [
								0,
								-7,
								0
							],
							scale: [
								1,
								1.12,
								1
							]
						},
						transition: {
							duration: 2.4 + item * .35,
							repeat: shouldReduceMotion ? 0 : 2,
							ease: "easeInOut"
						},
						children: cfg.motifs[item]
					}, item))
				})]
			})
		]
	});
}
//#endregion
//#region src/components/games/GameWorld.jsx
var MotionButton$1 = motion.button;
var MotionDiv$1 = motion.div;
var MotionSpan = motion.span;
var MODES = [
	{
		id: "blitz",
		label: "Blitzrunde",
		icon: "⚡",
		color: "bg-amber-400",
		prompt: "Schnell denken, ruhig bleiben."
	},
	{
		id: "schatz",
		label: "Schatzpfad",
		icon: "🗺️",
		color: "bg-emerald-400",
		prompt: "Richtige Antworten öffnen den Weg."
	},
	{
		id: "wirbel",
		label: "Wirbel-Sortierer",
		icon: "🌀",
		color: "bg-sky-400",
		prompt: "Fange die Karte ins richtige Fach."
	},
	{
		id: "meister",
		label: "Meisterrunde",
		icon: "🏆",
		color: "bg-fuchsia-400",
		prompt: "Fülle alle Lichter ohne die Ruhe zu verlieren."
	},
	{
		id: "expedition",
		label: "Expedition",
		icon: "🧭",
		color: "bg-teal-400",
		prompt: "Wandere von Station zu Station."
	},
	{
		id: "atelier",
		label: "Atelier",
		icon: "🎨",
		color: "bg-rose-400",
		prompt: "Male die Szene mit richtigen Antworten frei."
	},
	{
		id: "puzzle",
		label: "Puzzle-Garten",
		icon: "🧩",
		color: "bg-indigo-400",
		prompt: "Sammle Teile für ein großes Bild."
	},
	{
		id: "sternenlauf",
		label: "Sternenlauf",
		icon: "⭐",
		color: "bg-violet-400",
		prompt: "Verbinde Sterne mit ruhiger Combo."
	}
];
var FLOATERS = [
	"✦",
	"✧",
	"●",
	"◆",
	"○",
	"✺",
	"◇",
	"✶"
];
var HEARTS$1 = [
	"♥",
	"♥",
	"♥"
];
var TARGETS = {
	schatz: 6,
	expedition: 7,
	atelier: 6,
	puzzle: 6,
	sternenlauf: 8,
	meister: 5
};
var sceneIllustrations = {
	language: "language",
	math: "numbers",
	world: "world",
	heart: "harmony",
	music: "music",
	default: "hero"
};
function GameWorld({ title = "Große Spielwelt", collections = [], accent = "bg-fuchsia-500", scene = "default", onCorrect = () => {}, onWrong = () => {} }) {
	const shouldReduceMotion = useReducedMotion();
	const [mode, setMode] = (0, import_react.useState)("blitz");
	const [activeCollectionId, setActiveCollectionId] = (0, import_react.useState)(collections[0]?.id);
	const [challengeIndex, setChallengeIndex] = (0, import_react.useState)(0);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [seconds, setSeconds] = (0, import_react.useState)(35);
	const [hearts, setHearts] = (0, import_react.useState)(3);
	const [combo, setCombo] = (0, import_react.useState)(0);
	const [score, setScore] = (0, import_react.useState)(0);
	const [pathStep, setPathStep] = (0, import_react.useState)(0);
	const [masterLights, setMasterLights] = (0, import_react.useState)(0);
	const [roundComplete, setRoundComplete] = (0, import_react.useState)(false);
	const [seed, setSeed] = (0, import_react.useState)(0);
	const activeMode = MODES.find((item) => item.id === mode) || MODES[0];
	const activeCollection = collections.find((collection) => collection.id === activeCollectionId) || collections[0];
	const challenge = activeCollection?.items[challengeIndex % Math.max(activeCollection.items.length, 1)];
	const isTimed = mode === "blitz" || mode === "sternenlauf";
	const progressTarget = TARGETS[mode] || 0;
	const progressValue = mode === "meister" ? masterLights : pathStep;
	(0, import_react.useEffect)(() => {
		if (!running || !isTimed || roundComplete) return void 0;
		const timer = setInterval(() => {
			setSeconds((value) => {
				if (value <= 1) {
					setRoundComplete(true);
					setRunning(false);
					playJingle("calm");
					return 0;
				}
				return value - 1;
			});
		}, 1e3);
		return () => clearInterval(timer);
	}, [
		isTimed,
		roundComplete,
		running
	]);
	const resetRound = (start = true, nextMode = mode) => {
		playJingle(start ? "start" : "calm");
		setRunning(start);
		setSeconds(nextMode === "blitz" ? 35 : nextMode === "sternenlauf" ? 45 : 60);
		setHearts(3);
		setCombo(0);
		setScore(0);
		setPathStep(0);
		setMasterLights(0);
		setChallengeIndex(0);
		setSelected(null);
		setFeedback(null);
		setRoundComplete(false);
		setSeed((value) => value + 1);
	};
	const switchMode = (nextMode) => {
		setMode(nextMode);
		resetRound(false, nextMode);
	};
	const switchCollection = (id) => {
		playWhoosh();
		setActiveCollectionId(id);
		resetRound(false);
	};
	const nextChallenge = () => {
		setChallengeIndex((index) => index + 1);
		setSelected(null);
		setFeedback(null);
		setSeed((value) => value + 1);
	};
	const completeRound = (nextScore) => {
		setScore(nextScore);
		setRoundComplete(true);
		setRunning(false);
		playJingle("levelUp");
		confetti_module_default({
			particleCount: 140,
			spread: 100,
			origin: { y: .7 }
		});
	};
	const choose = (option) => {
		if (!running || roundComplete || feedback || !challenge) return;
		setSelected(option);
		if (option === challenge.answer) {
			const nextCombo = combo + 1;
			const nextScore = score + (mode === "meister" ? 12 : mode === "blitz" ? 10 : 8) + Math.min(nextCombo, 8);
			const progressMode = [
				"schatz",
				"expedition",
				"atelier",
				"puzzle",
				"sternenlauf"
			].includes(mode);
			const nextPathStep = progressMode ? pathStep + 1 : pathStep;
			const nextMasterLights = mode === "meister" ? masterLights + 1 : masterLights;
			setCombo(nextCombo);
			setScore(nextScore);
			setFeedback("richtig");
			if (nextCombo % 3 === 0) playJingle("combo");
			else playCoin();
			onCorrect(2 + Math.min(nextCombo, 5));
			if (mode === "schatz") setPathStep(nextPathStep);
			if (mode === "meister") setMasterLights(nextMasterLights);
			if (progressMode && nextPathStep >= (TARGETS[mode] || 6) || mode === "meister" && nextMasterLights >= TARGETS.meister) setTimeout(() => completeRound(nextScore), 620);
			else setTimeout(nextChallenge, mode === "wirbel" ? 520 : 720);
		} else {
			const nextHearts = hearts - 1;
			setHearts(nextHearts);
			setCombo(0);
			setFeedback("falsch");
			playError();
			onWrong();
			setTimeout(() => {
				setSelected(null);
				setFeedback(null);
				if (nextHearts <= 0) {
					setRoundComplete(true);
					setRunning(false);
					playJingle("try");
				} else if (mode === "blitz" || mode === "wirbel") nextChallenge();
			}, 760);
		}
	};
	if (!activeCollection || !challenge) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-6xl mx-auto py-8 flex flex-col gap-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center space-y-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl md:text-6xl font-bold text-slate-800",
					children: title
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-stretch",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumScene, {
					scene,
					mode
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-white/65 border-4 border-white rounded-[38px] shadow-xl p-5 flex flex-col items-center justify-center text-center overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumIllustration, {
						variant: sceneIllustrations[scene] || "hero",
						size: 210,
						title: `${title} Illustration`
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-3",
				children: MODES.map((item) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton$1, {
						whileHover: {
							y: -3,
							scale: 1.03
						},
						whileTap: { scale: .95 },
						onClick: () => switchMode(item.id),
						className: `min-h-28 rounded-[30px] border-4 p-4 shadow-md text-left transition-all ${item.id === mode ? `${item.color} text-white border-white ring-4 ring-white` : "bg-white/75 text-slate-600 border-white hover:bg-white"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-4xl",
								children: item.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-hand text-3xl font-bold leading-none mt-1",
								children: item.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: item.prompt
							})
						]
					}, item.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-3",
				children: collections.map((collection) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton$1, {
						whileHover: {
							y: -2,
							scale: 1.04
						},
						whileTap: { scale: .95 },
						onClick: () => switchCollection(collection.id),
						className: `px-5 py-3 rounded-full border-2 font-hand text-xl font-bold shadow-md flex items-center gap-2 transition-all ${collection.id === activeCollection.id ? `${collection.color} text-white border-white ring-4 ring-white` : "bg-white/75 text-slate-500 border-white hover:bg-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: collection.icon }), collection.label]
					}, collection.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white/65 rounded-[56px] border-4 border-white shadow-2xl p-5 md:p-7 overflow-hidden relative paper-texture",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: isTimed ? "Zeit" : "Runde",
							value: isTimed ? `${seconds}s` : activeMode.label,
							color: "text-slate-800"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Herzen",
							value: HEARTS$1.map((heart, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: index < hearts ? "" : "opacity-20",
								children: heart
							}, index)),
							color: "text-rose-500"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Combo",
							value: `${combo}x`,
							color: "text-orange-500"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Punkte",
							value: score,
							color: "text-emerald-600"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-h-[560px] rounded-[44px] border-4 border-white bg-gradient-to-br from-white via-amber-50 to-sky-50 shadow-inner overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 opacity-70",
							style: {
								backgroundImage: "radial-gradient(circle at 18% 20%, rgba(251,191,36,.26), transparent 20%), radial-gradient(circle at 85% 25%, rgba(14,165,233,.18), transparent 24%), radial-gradient(circle at 45% 85%, rgba(217,70,239,.16), transparent 26%)",
								backgroundSize: "100% 100%"
							}
						}),
						FLOATERS.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionSpan, {
							className: "absolute text-2xl md:text-3xl text-white/70 drop-shadow-sm pointer-events-none",
							style: {
								left: `${10 + index * 11}%`,
								top: `${12 + index % 4 * 18}%`
							},
							animate: shouldReduceMotion ? {
								y: 0,
								rotate: 0,
								scale: 1
							} : {
								y: [
									0,
									-18,
									12,
									0
								],
								rotate: [
									0,
									15,
									-10,
									0
								],
								scale: [
									1,
									1.18,
									.94,
									1
								]
							},
							transition: {
								duration: 4 + index * .35,
								repeat: shouldReduceMotion ? 0 : 1,
								ease: "easeInOut"
							},
							children: item
						}, `${seed}-${item}-${index}`)),
						!running && !roundComplete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 z-30 flex items-center justify-center bg-white/55 backdrop-blur-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton$1, {
								whileHover: { scale: 1.06 },
								whileTap: { scale: .94 },
								onClick: () => resetRound(true),
								className: `px-10 py-5 ${accent} text-white rounded-full font-hand text-4xl font-bold shadow-2xl border-4 border-white`,
								children: "Spiel starten"
							})
						}),
						roundComplete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 z-30 flex items-center justify-center bg-white/72 backdrop-blur-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionDiv$1, {
								initial: {
									scale: .86,
									opacity: 0
								},
								animate: {
									scale: 1,
									opacity: 1
								},
								className: "bg-white rounded-[44px] border-4 border-white shadow-2xl p-8 text-center max-w-md",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400",
										children: "Spiel beendet"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-hand text-5xl font-bold text-slate-800",
										children: [score, " Punkte"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-hand text-2xl text-slate-500 mt-2",
										children: "Wähle einen Modus oder starte eine neue Runde."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => resetRound(true),
										className: `mt-5 px-8 py-3 ${accent} text-white rounded-full font-hand text-2xl font-bold shadow-lg`,
										children: "Neue Runde"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 p-5 md:p-7 flex flex-col gap-6",
							children: [
								mode === "schatz" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreasurePath, { step: pathStep }),
								mode === "meister" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MasterLights, { count: masterLights }),
								mode === "expedition" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpeditionMap, {
									step: pathStep,
									target: TARGETS.expedition
								}),
								mode === "atelier" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtelierCanvas, {
									marks: pathStep,
									target: TARGETS.atelier,
									scene
								}),
								mode === "puzzle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuzzleBoard, {
									pieces: pathStep,
									target: TARGETS.puzzle,
									scene
								}),
								mode === "sternenlauf" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarRun, {
									step: pathStep,
									target: TARGETS.sternenlauf
								}),
								progressTarget > 0 && mode !== "meister" && mode !== "schatz" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-white/65 border-2 border-white rounded-[28px] px-5 py-3 shadow-inner flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400",
										children: "Fortschritt"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-hand text-3xl font-bold text-slate-700",
										children: [
											Math.min(progressValue, progressTarget),
											"/",
											progressTarget
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv$1, {
									initial: {
										opacity: 0,
										y: 24,
										scale: .96
									},
									animate: {
										opacity: 1,
										y: 0,
										scale: 1
									},
									transition: {
										type: "spring",
										bounce: .35
									},
									className: `bg-white/85 rounded-[34px] border-4 border-white shadow-lg p-5 ${mode === "wirbel" ? "rotate-[-1deg]" : ""}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col md:flex-row md:items-center md:justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400",
												children: activeCollection.label
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
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-5xl",
											children: activeMode.icon
										})]
									})
								}, `${seed}-prompt`),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: mode === "wirbel" ? "grid grid-cols-1 md:grid-cols-2 gap-4 min-h-64" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 min-h-56 items-center",
									children: challenge.options.map((option, index) => {
										const isSelected = selected === option;
										const isCorrect = option === challenge.answer;
										const baseDelay = mode === "wirbel" ? index * .05 : index * .08;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton$1, {
											initial: {
												opacity: 0,
												y: mode === "wirbel" ? -70 : 28,
												rotate: mode === "wirbel" ? -8 + index * 4 : 0,
												scale: .82
											},
											animate: {
												opacity: running || roundComplete ? 1 : .45,
												y: mode === "wirbel" && !shouldReduceMotion ? [
													0,
													10,
													-8,
													0
												] : 0,
												rotate: mode === "wirbel" && !shouldReduceMotion ? [
													-1,
													2,
													-2,
													-1
												] : 0,
												scale: 1
											},
											transition: {
												opacity: {
													duration: .2,
													delay: baseDelay
												},
												scale: {
													type: "spring",
													bounce: .45,
													delay: baseDelay
												},
												y: mode === "wirbel" && !shouldReduceMotion ? {
													duration: 2.4 + index * .25,
													repeat: 2,
													ease: "easeInOut"
												} : { duration: .25 },
												rotate: mode === "wirbel" && !shouldReduceMotion ? {
													duration: 2.6 + index * .2,
													repeat: 2,
													ease: "easeInOut"
												} : { duration: .2 }
											},
											whileHover: {
												scale: 1.08,
												y: -4
											},
											whileTap: { scale: .94 },
											onClick: () => choose(option),
											className: `min-h-32 rounded-[34px] border-4 shadow-xl p-5 font-hand text-3xl font-bold transition-colors ${isSelected && feedback === "richtig" && isCorrect ? "bg-emerald-100 border-emerald-300 text-emerald-800" : isSelected && feedback === "falsch" ? "bg-rose-100 border-rose-300 text-rose-800" : mode === "wirbel" ? "bg-white/90 border-sky-100 text-slate-700" : "bg-white/90 border-white text-slate-700"}`,
											children: [mode === "wirbel" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "block font-sans text-[10px] uppercase tracking-widest text-slate-400 mb-1",
												children: ["Fach ", index + 1]
											}), option]
										}, `${seed}-${option}-${index}`);
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, { children: [feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionDiv$1, {
							initial: {
								opacity: 0,
								scale: .8,
								y: 20
							},
							animate: {
								opacity: 1,
								scale: 1,
								y: 0
							},
							exit: { opacity: 0 },
							className: "absolute bottom-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl",
							children: ["Treffer! Combo ", combo + 1]
						}), feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv$1, {
							initial: {
								opacity: 0,
								scale: .8,
								y: 20
							},
							animate: {
								opacity: 1,
								scale: 1,
								y: 0
							},
							exit: { opacity: 0 },
							className: "absolute bottom-5 left-1/2 -translate-x-1/2 bg-rose-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl",
							children: "Fast. Neuer Versuch."
						})] })
					]
				})]
			})
		]
	});
}
function Stat({ label, value, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white/80 rounded-3xl p-4 border-2 border-white shadow-inner",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `font-hand text-3xl md:text-4xl font-bold ${color}`,
			children: value
		})]
	});
}
function TreasurePath({ step }) {
	const shouldReduceMotion = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white/65 border-2 border-white rounded-[30px] p-4 shadow-inner",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-7 gap-2 items-center",
			children: Array.from({ length: 7 }, (_, index) => {
				const active = index <= step;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv$1, {
					animate: {
						scale: active ? 1.08 : 1,
						y: active && index === step && !shouldReduceMotion ? [
							0,
							-6,
							0
						] : 0
					},
					transition: {
						duration: .7,
						repeat: active && index === step && !shouldReduceMotion ? 2 : 0
					},
					className: `h-14 rounded-2xl border-2 flex items-center justify-center font-hand text-2xl font-bold ${active ? "bg-amber-300 border-amber-100 text-white shadow-lg" : "bg-white/70 border-white text-slate-300"}`,
					children: index === 6 ? "★" : index + 1
				}, index);
			})
		})
	});
}
function MasterLights({ count }) {
	const shouldReduceMotion = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center gap-3 bg-white/65 border-2 border-white rounded-[30px] p-4 shadow-inner",
		children: Array.from({ length: 5 }, (_, index) => {
			const active = index < count;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv$1, {
				animate: {
					scale: active && !shouldReduceMotion ? [
						1,
						1.2,
						1
					] : 1,
					opacity: active ? 1 : .35
				},
				transition: {
					duration: .8,
					repeat: active && !shouldReduceMotion ? 1 : 0
				},
				className: `w-14 h-14 rounded-full border-4 ${active ? "bg-fuchsia-400 border-white shadow-[0_0_28px_rgba(217,70,239,.55)]" : "bg-white border-slate-100"}`
			}, index);
		})
	});
}
function ExpeditionMap({ step, target }) {
	const shouldReduceMotion = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white/65 border-2 border-white rounded-[32px] p-4 shadow-inner overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-28",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 780 120",
				className: "absolute inset-0 w-full h-full",
				preserveAspectRatio: "none",
				"aria-hidden": true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M28 78 C122 26 168 98 244 55 C320 12 382 104 456 60 C538 12 584 98 742 38",
					fill: "none",
					stroke: "rgba(255,255,255,.92)",
					strokeWidth: "18",
					strokeLinecap: "round"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M28 78 C122 26 168 98 244 55 C320 12 382 104 456 60 C538 12 584 98 742 38",
					fill: "none",
					stroke: "#14b8a6",
					strokeWidth: "4",
					strokeDasharray: "12 14",
					strokeLinecap: "round",
					opacity: ".55"
				})]
			}), Array.from({ length: target }, (_, index) => {
				const left = 5 + index / Math.max(1, target - 1) * 88;
				const active = index < step;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv$1, {
					className: `absolute top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center font-hand text-2xl font-bold ${active ? "bg-teal-400 text-white" : "bg-white/80 text-slate-300"}`,
					style: { left: `${left}%` },
					animate: {
						y: active && index === step - 1 && !shouldReduceMotion ? [
							0,
							-9,
							0
						] : 0,
						rotate: active && !shouldReduceMotion ? [
							-2,
							3,
							-2
						] : 0
					},
					transition: {
						duration: 1.2,
						repeat: active && index === step - 1 && !shouldReduceMotion ? 2 : 0
					},
					children: index === target - 1 ? "🏁" : index + 1
				}, index);
			})]
		})
	});
}
function AtelierCanvas({ marks, target, scene }) {
	const shouldReduceMotion = useReducedMotion();
	const palette = {
		language: [
			"#f97316",
			"#facc15",
			"#fb923c",
			"#fbbf24",
			"#fdba74",
			"#fef3c7"
		],
		math: [
			"#0ea5e9",
			"#60a5fa",
			"#2563eb",
			"#93c5fd",
			"#38bdf8",
			"#dbeafe"
		],
		world: [
			"#10b981",
			"#22c55e",
			"#84cc16",
			"#a7f3d0",
			"#34d399",
			"#ecfccb"
		],
		heart: [
			"#ec4899",
			"#d946ef",
			"#f9a8d4",
			"#c084fc",
			"#f0abfc",
			"#fce7f3"
		],
		music: [
			"#d946ef",
			"#fb7185",
			"#f472b6",
			"#fda4af",
			"#c084fc",
			"#ffe4e6"
		],
		default: [
			"#8b5cf6",
			"#38bdf8",
			"#f59e0b",
			"#34d399",
			"#f472b6",
			"#ddd6fe"
		]
	}[scene] || [
		"#8b5cf6",
		"#38bdf8",
		"#f59e0b",
		"#34d399",
		"#f472b6",
		"#ddd6fe"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white/65 border-2 border-white rounded-[32px] p-4 shadow-inner",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-36 rounded-[28px] bg-white/75 border-4 border-white overflow-hidden",
			children: [Array.from({ length: target }, (_, index) => {
				const active = index < marks;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv$1, {
					className: "absolute rounded-full blur-[1px]",
					style: {
						width: `${80 + index * 11}px`,
						height: `${42 + index % 3 * 18}px`,
						left: `${8 + index % 3 * 27}%`,
						top: `${12 + Math.floor(index / 3) * 34}%`,
						backgroundColor: palette[index % palette.length],
						opacity: active ? .82 : .1
					},
					animate: active && !shouldReduceMotion ? {
						scale: [
							.92,
							1.08,
							1
						],
						rotate: [
							-3,
							4,
							-2
						]
					} : { scale: 1 },
					transition: {
						duration: 1.6,
						repeat: active && index === marks - 1 && !shouldReduceMotion ? 1 : 0
					}
				}, index);
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-x-5 bottom-4 flex justify-between",
				children: palette.slice(0, 5).map((color, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-10 h-10 rounded-full border-4 border-white shadow-md",
					style: {
						backgroundColor: color,
						opacity: index < marks ? 1 : .28
					}
				}, color))
			})]
		})
	});
}
function PuzzleBoard({ pieces, target, scene }) {
	const shouldReduceMotion = useReducedMotion();
	const tone = {
		language: "from-orange-100 to-amber-200",
		math: "from-sky-100 to-blue-200",
		world: "from-emerald-100 to-lime-200",
		heart: "from-pink-100 to-fuchsia-200",
		music: "from-rose-100 to-purple-200",
		default: "from-violet-100 to-sky-200"
	}[scene] || "from-violet-100 to-sky-200";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white/65 border-2 border-white rounded-[32px] p-4 shadow-inner",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-6 gap-2",
			children: Array.from({ length: target }, (_, index) => {
				const active = index < pieces;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv$1, {
					className: `h-20 rounded-[22px] border-4 border-white shadow-md bg-gradient-to-br ${tone} flex items-center justify-center font-hand text-3xl font-bold ${active ? "text-slate-700" : "text-slate-300 grayscale opacity-40"}`,
					animate: active && !shouldReduceMotion ? {
						y: [
							0,
							-6,
							0
						],
						rotate: [
							0,
							index % 2 ? 3 : -3,
							0
						]
					} : { y: 0 },
					transition: {
						duration: 1.4,
						repeat: active && index === pieces - 1 && !shouldReduceMotion ? 1 : 0
					},
					children: active ? "✦" : "?"
				}, index);
			})
		})
	});
}
function StarRun({ step, target }) {
	const shouldReduceMotion = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white/65 border-2 border-white rounded-[32px] p-4 shadow-inner",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap justify-center gap-3",
			children: Array.from({ length: target }, (_, index) => {
				const active = index < step;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv$1, {
					className: `w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center text-2xl ${active ? "bg-amber-300" : "bg-white/70 grayscale opacity-40"}`,
					animate: active && !shouldReduceMotion ? {
						scale: [
							1,
							1.22,
							1
						],
						rotate: [
							0,
							16,
							-8,
							0
						]
					} : { scale: 1 },
					transition: {
						duration: 1.15,
						repeat: active && index === step - 1 && !shouldReduceMotion ? 2 : 0
					},
					children: "⭐"
				}, index);
			})
		})
	});
}
//#endregion
//#region src/components/games/questMixerConfig.js
var QUEST_MIXER_MODES = [
	{
		id: "expedition",
		label: "Expedition",
		icon: Compass,
		color: "bg-emerald-500",
		description: "Wandere von Station zu Station.",
		target: 6
	},
	{
		id: "puzzle",
		label: "Puzzle",
		icon: Grid3x3,
		color: "bg-amber-500",
		description: "Fülle das Aufgabenmosaik.",
		target: 8
	},
	{
		id: "sternenlauf",
		label: "Sternenlauf",
		icon: Star,
		color: "bg-fuchsia-500",
		description: "Sammle eine helle Sternspur.",
		target: 7
	},
	{
		id: "kartenwirbel",
		label: "Kartenwirbel",
		icon: RotateCw,
		color: "bg-sky-500",
		description: "Finde die richtige wirbelnde Karte.",
		target: 5
	}
];
//#endregion
//#region src/components/games/QuestMixer.jsx
var MotionButton = motion.button;
var MotionDiv = motion.div;
var EMPTY_COLLECTION = {
	id: "empty",
	label: "Keine Sammlung",
	icon: "✦",
	color: "bg-slate-400",
	items: []
};
var HEARTS = [
	"♥",
	"♥",
	"♥"
];
var TRAIL = [
	"Basis",
	"Pfad",
	"Brücke",
	"Lichtung",
	"Gipfel",
	"Fund",
	"Ziel"
];
var normalizeCollections = (collections) => collections.map((collection) => ({
	...collection,
	items: Array.isArray(collection.items) ? collection.items.filter((item) => item?.prompt && item?.answer && Array.isArray(item.options)) : []
})).filter((collection) => collection.items.length > 0);
var makeQuestionDeck = (collections, activeCollectionId, seed) => {
	const activeCollection = collections.find((collection) => collection.id === activeCollectionId) || collections[0] || EMPTY_COLLECTION;
	return (activeCollection.items.length ? activeCollection.items : collections.flatMap((collection) => collection.items)).map((item, index) => ({
		...item,
		deckId: `${activeCollection.id}-${seed}-${index}`,
		collectionId: activeCollection.id,
		collectionLabel: activeCollection.label
	}));
};
function QuestMixer({ title = "Abenteuer-Mixer", collections = [], modes = QUEST_MIXER_MODES, initialMode = "expedition", accent = "bg-slate-900", roundHearts = 3, onCorrect = () => {}, onWrong = () => {}, onComplete = () => {} }) {
	const shouldReduceMotion = useReducedMotion();
	const playableCollections = (0, import_react.useMemo)(() => normalizeCollections(collections), [collections]);
	const availableModes = modes.length ? modes : QUEST_MIXER_MODES;
	const [activeModeId, setActiveModeId] = (0, import_react.useState)(availableModes.some((mode) => mode.id === initialMode) ? initialMode : availableModes[0].id);
	const [activeCollectionId, setActiveCollectionId] = (0, import_react.useState)(playableCollections[0]?.id);
	const [questionIndex, setQuestionIndex] = (0, import_react.useState)(0);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [score, setScore] = (0, import_react.useState)(0);
	const [streak, setStreak] = (0, import_react.useState)(0);
	const [hearts, setHearts] = (0, import_react.useState)(roundHearts);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [finished, setFinished] = (0, import_react.useState)(false);
	const [seed, setSeed] = (0, import_react.useState)(1);
	const activeMode = availableModes.find((mode) => mode.id === activeModeId) || availableModes[0];
	const activeCollection = playableCollections.find((collection) => collection.id === activeCollectionId) || playableCollections[0] || EMPTY_COLLECTION;
	const deck = (0, import_react.useMemo)(() => makeQuestionDeck(playableCollections, activeCollection.id, seed), [
		activeCollection.id,
		playableCollections,
		seed
	]);
	const challenge = deck[questionIndex % Math.max(deck.length, 1)];
	const modeTarget = activeMode.target || 6;
	const completionRatio = Math.min(progress / modeTarget, 1);
	const resetRound = (nextModeId = activeModeId, nextCollectionId = activeCollection.id) => {
		const nextCollection = playableCollections.find((collection) => collection.id === nextCollectionId) || playableCollections[0];
		playJingle("start");
		setActiveModeId(nextModeId);
		setActiveCollectionId(nextCollection?.id);
		setQuestionIndex(0);
		setSelected(null);
		setFeedback(null);
		setScore(0);
		setStreak(0);
		setHearts(roundHearts);
		setProgress(0);
		setFinished(false);
		setSeed((value) => value + 1);
	};
	const switchMode = (modeId) => {
		if (modeId === activeModeId) return;
		playWhoosh();
		resetRound(modeId, activeCollection.id);
	};
	const switchCollection = (collectionId) => {
		if (collectionId === activeCollection.id) return;
		playPop();
		resetRound(activeModeId, collectionId);
	};
	const completeRound = (nextScore, nextProgress) => {
		setFinished(true);
		setScore(nextScore);
		setProgress(nextProgress);
		playJingle("levelUp");
		onComplete({
			mode: activeMode.id,
			collection: activeCollection.id,
			score: nextScore,
			progress: nextProgress
		});
		confetti_module_default({
			particleCount: 130,
			spread: 100,
			origin: { y: .72 }
		});
	};
	const nextQuestion = () => {
		setQuestionIndex((index) => index + 1);
		setSelected(null);
		setFeedback(null);
		setSeed((value) => value + 1);
	};
	const choose = (option) => {
		if (!challenge || feedback || finished) return;
		setSelected(option);
		if (option === challenge.answer) {
			const nextStreak = streak + 1;
			const nextProgress = progress + 1;
			const nextScore = score + 10 + Math.min(nextStreak, 5) * 3;
			setFeedback("richtig");
			setStreak(nextStreak);
			setScore(nextScore);
			setProgress(nextProgress);
			onCorrect(3 + Math.min(nextStreak, 4));
			if (nextStreak % 3 === 0) playJingle("combo");
			else playCoin();
			if (nextProgress >= modeTarget) setTimeout(() => completeRound(nextScore, nextProgress), 560);
			else setTimeout(nextQuestion, activeMode.id === "kartenwirbel" ? 500 : 700);
			return;
		}
		const nextHearts = hearts - 1;
		setFeedback("falsch");
		setStreak(0);
		setHearts(nextHearts);
		playError();
		onWrong();
		setTimeout(() => {
			setSelected(null);
			setFeedback(null);
			if (nextHearts <= 0) {
				setFinished(true);
				playJingle("try");
			} else if (activeMode.id === "kartenwirbel") nextQuestion();
		}, 780);
	};
	if (!playableCollections.length || !challenge) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full max-w-5xl mx-auto py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white/75 border-4 border-white rounded-[38px] shadow-xl p-8 text-center paper-texture",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400",
					children: "Abenteuer-Mixer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Noch keine spielbaren Aufgaben"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Übergebe Collections mit `items`, `prompt`, `answer` und `options`."
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-6xl mx-auto py-8 flex flex-col gap-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center space-y-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl md:text-6xl font-bold text-slate-800",
					children: title
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-3",
				children: availableModes.map((mode) => {
					const ModeIcon = mode.icon || Sparkles;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
						whileHover: {
							y: -3,
							scale: 1.03
						},
						whileTap: { scale: .95 },
						onClick: () => switchMode(mode.id),
						className: `min-h-28 rounded-[28px] border-4 p-4 shadow-md text-left transition-all ${mode.id === activeMode.id ? `${mode.color} text-white border-white ring-4 ring-white` : "bg-white/75 text-slate-600 border-white hover:bg-white"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeIcon, {
								size: 32,
								strokeWidth: 2.5
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-hand text-3xl font-bold leading-none mt-2",
								children: mode.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: mode.description
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: collection.icon }), collection.label]
					}, collection.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white/65 rounded-[48px] border-4 border-white shadow-2xl p-5 md:p-7 overflow-hidden relative paper-texture",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestStat, {
							label: "Fortschritt",
							value: `${progress}/${modeTarget}`,
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
							label: "Serie",
							value: `${streak}x`,
							color: "text-orange-500"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestStat, {
							label: "Punkte",
							value: score,
							color: "text-emerald-600"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-h-[530px] rounded-[38px] border-4 border-white bg-gradient-to-br from-white via-lime-50 to-sky-50 shadow-inner overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 opacity-80",
							style: {
								backgroundImage: "linear-gradient(120deg, rgba(255,255,255,.6), transparent 36%), radial-gradient(circle at 16% 22%, rgba(16,185,129,.18), transparent 20%), radial-gradient(circle at 88% 28%, rgba(14,165,233,.2), transparent 25%), radial-gradient(circle at 48% 88%, rgba(244,114,182,.16), transparent 24%)",
								backgroundSize: "100% 100%"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 p-5 md:p-7 flex flex-col gap-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeProgress, {
									modeId: activeMode.id,
									progress,
									target: modeTarget,
									ratio: completionRatio
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv, {
									initial: {
										opacity: 0,
										y: 24,
										scale: .96
									},
									animate: {
										opacity: 1,
										y: 0,
										scale: 1
									},
									transition: {
										type: "spring",
										bounce: .35
									},
									className: "bg-white/88 rounded-[32px] border-4 border-white shadow-lg p-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col md:flex-row md:items-start md:justify-between gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400",
												children: [
													activeMode.label,
													" · ",
													activeCollection.label
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
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `${activeMode.color} text-white rounded-3xl p-4 shadow-lg border-4 border-white`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { size: 38 })
										})]
									})
								}, `${seed}-${challenge.deckId}-prompt`),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnswerStage, {
									modeId: activeMode.id,
									options: challenge.options,
									selected,
									feedback,
									answer: challenge.answer,
									seed,
									onChoose: choose,
									shouldReduceMotion
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, { children: [feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionDiv, {
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
							children: ["Treffer! Serie ", streak + 1]
						}), feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv, {
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
						})] }),
						finished && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 z-30 flex items-center justify-center bg-white/74 backdrop-blur-sm p-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionDiv, {
								initial: {
									scale: .86,
									opacity: 0
								},
								animate: {
									scale: 1,
									opacity: 1
								},
								className: "bg-white rounded-[38px] border-4 border-white shadow-2xl p-8 text-center max-w-md",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400",
										children: [activeMode.label, " beendet"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-hand text-5xl font-bold text-slate-800",
										children: [score, " Punkte"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-hand text-2xl text-slate-500 mt-2",
										children: progress >= modeTarget ? "Die Runde ist vollständig." : "Starte neu und sammle die fehlenden Stationen."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => resetRound(),
										className: `mt-5 px-8 py-3 ${accent} text-white rounded-full font-hand text-2xl font-bold shadow-lg`,
										children: "Neue Runde"
									})
								]
							})
						})
					]
				})]
			})
		]
	});
}
function QuestStat({ label, value, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white/80 rounded-3xl p-4 border-2 border-white shadow-inner",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `font-hand text-3xl md:text-4xl font-bold ${color}`,
			children: value
		})]
	});
}
function ModeProgress({ modeId, progress, target, ratio }) {
	if (modeId === "expedition") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpeditionProgress, { progress });
	if (modeId === "puzzle") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuzzleProgress, {
		progress,
		target
	});
	if (modeId === "sternenlauf") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarRunProgress, {
		progress,
		target
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhirlProgress, {
		ratio,
		progress,
		target
	});
}
function ExpeditionProgress({ progress }) {
	const shouldReduceMotion = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white/70 border-2 border-white rounded-[30px] p-4 shadow-inner",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-7 gap-2",
			children: TRAIL.map((label, index) => {
				const active = index <= progress;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionDiv, {
					animate: {
						y: active && index === progress && !shouldReduceMotion ? [
							0,
							-7,
							0
						] : 0,
						scale: active ? 1.04 : 1
					},
					transition: {
						duration: .8,
						repeat: active && index === progress && !shouldReduceMotion ? 2 : 0
					},
					className: `min-h-14 rounded-2xl border-2 flex flex-col items-center justify-center px-2 ${active ? "bg-emerald-400 border-white text-white shadow-lg" : "bg-white/80 border-white text-slate-300"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-hand text-xl font-bold leading-none",
						children: index + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-sans text-[9px] uppercase tracking-wide truncate max-w-full",
						children: label
					})]
				}, label);
			})
		})
	});
}
function PuzzleProgress({ progress, target }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white/70 border-2 border-white rounded-[30px] p-4 shadow-inner",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-4 gap-2",
			children: Array.from({ length: target }, (_, index) => {
				const active = index < progress;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv, {
					animate: {
						rotate: active ? [
							0,
							-2,
							2,
							0
						] : 0,
						scale: active ? [
							1,
							1.1,
							1
						] : 1
					},
					transition: { duration: .6 },
					className: `aspect-square rounded-xl border-2 ${active ? "bg-amber-300 border-white shadow-md" : "bg-white/80 border-white"}`
				}, index);
			})
		})
	});
}
function StarRunProgress({ progress, target }) {
	const shouldReduceMotion = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center gap-2 bg-white/70 border-2 border-white rounded-[30px] p-4 shadow-inner",
		children: Array.from({ length: target }, (_, index) => {
			const active = index < progress;
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
					repeat: active && !shouldReduceMotion ? 1 : 0
				},
				className: active ? "text-fuchsia-500 drop-shadow-sm" : "text-slate-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
					size: 34,
					fill: "currentColor"
				})
			}, index);
		})
	});
}
function WhirlProgress({ ratio, progress, target }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white/70 border-2 border-white rounded-[30px] p-4 shadow-inner",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, {
					className: "text-sky-500",
					size: 34
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-5 flex-1 bg-white rounded-full border-2 border-white overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionDiv, {
						className: "h-full bg-sky-400 rounded-full",
						animate: { width: `${ratio * 100}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-hand text-3xl font-bold text-slate-700",
					children: [
						progress,
						"/",
						target
					]
				})
			]
		})
	});
}
function AnswerStage({ modeId, options, selected, feedback, answer, seed, onChoose, shouldReduceMotion }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: modeId === "puzzle" ? "grid grid-cols-2 lg:grid-cols-4 gap-4 min-h-64" : modeId === "kartenwirbel" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 min-h-72 items-center" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 min-h-60 items-center",
		children: options.map((option, index) => {
			const isSelected = selected === option;
			const isCorrect = option === answer;
			const whirl = modeId === "kartenwirbel";
			const puzzle = modeId === "puzzle";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
				initial: {
					opacity: 0,
					y: whirl ? -80 : 28,
					rotate: whirl ? -10 + index * 6 : puzzle ? -2 + index : 0,
					scale: .84
				},
				animate: {
					opacity: 1,
					y: whirl && !shouldReduceMotion ? [
						0,
						12,
						-8,
						0
					] : 0,
					rotate: whirl && !shouldReduceMotion ? [
						-2,
						3,
						-3,
						-2
					] : 0,
					scale: 1
				},
				transition: {
					opacity: {
						duration: .2,
						delay: index * .04
					},
					scale: {
						type: "spring",
						bounce: .42,
						delay: index * .04
					},
					y: whirl && !shouldReduceMotion ? {
						duration: 2.4 + index * .22,
						repeat: 2,
						ease: "easeInOut"
					} : { duration: .25 },
					rotate: whirl && !shouldReduceMotion ? {
						duration: 2.7 + index * .2,
						repeat: 2,
						ease: "easeInOut"
					} : { duration: .2 }
				},
				whileHover: {
					scale: 1.07,
					y: -4
				},
				whileTap: { scale: .94 },
				onClick: () => onChoose(option),
				className: `min-h-32 rounded-[30px] border-4 shadow-xl p-5 font-hand text-3xl font-bold transition-colors ${isSelected && feedback === "richtig" && isCorrect ? "bg-emerald-100 border-emerald-300 text-emerald-800" : isSelected && feedback === "falsch" ? "bg-rose-100 border-rose-300 text-rose-800" : puzzle ? "bg-white/92 border-amber-100 text-slate-700" : whirl ? "bg-white/92 border-sky-100 text-slate-700" : "bg-white/92 border-white text-slate-700"}`,
				children: [
					whirl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block font-sans text-[10px] uppercase tracking-widest text-slate-400 mb-1",
						children: ["Karte ", index + 1]
					}),
					puzzle && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block font-sans text-[10px] uppercase tracking-widest text-amber-500 mb-1",
						children: ["Teil ", index + 1]
					}),
					option
				]
			}, `${seed}-${option}-${index}`);
		})
	});
}
//#endregion
export { VariantStudio as i, GameWorld as n, ActionArena as r, QuestMixer as t };
