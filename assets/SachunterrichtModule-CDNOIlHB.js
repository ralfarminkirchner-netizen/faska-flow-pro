const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/SubjectPremiumAtelier-OFFtJlBa.js","assets/jsx-runtime-Be5yPkiZ.js","assets/star-DBCbE8d7.js","assets/proxy--6s_pC9q.js","assets/sounds-Dh98eEYj.js","assets/DeepLearningQuest-CbOGahul.js","assets/learningContent-D1WsycQZ.js","assets/wand-sparkles-CtIcwwM8.js","assets/animalFriends-U19Ro3hF.js","assets/premiumGamePack-CHz1F5u_.js","assets/compass-JckdT0FA.js","assets/grid-3x3-BjeKZBlx.js","assets/sparkles-bt2KNUwI.js","assets/SkyWonderland-Bz4SaHcY.js","assets/volume-2-Vs6pZO3N.js","assets/LearningArcade-BGnmy9QN.js","assets/trophy-Ci-hdIiU.js"])))=>i.map(i=>d[i]);
import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as motion } from "./proxy--6s_pC9q.js";
import { N as playSparkle, V as AnimatePresence, l as playError, w as playPop } from "./sounds-Dh98eEYj.js";
import { r as confetti_module_default } from "./star-DBCbE8d7.js";
import { t as __vitePreload } from "./index-B5O6y7xB.js";
import { d as WORLD_TRACK_CASES, f as WORLD_WEATHER_ROUNDS, l as WORLD_CONTENT, s as SUBJECT_VARIANT_CONTENT, u as WORLD_SEASON_CARDS } from "./learningContent-D1WsycQZ.js";
import { i as VariantStudio, n as GameWorld, r as ActionArena, t as QuestMixer } from "./QuestMixer-CwJK0O5N.js";
//#region src/components/games/SpurenDetektiv.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var CASES = WORLD_TRACK_CASES;
function Trail({ marks }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-64 bg-gradient-to-br from-sky-50 via-white to-emerald-50 rounded-[44px] border-4 border-white shadow-inner overflow-hidden paper-texture",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#bfdbfe_0,transparent_22%),radial-gradient(circle_at_80%_70%,#bbf7d0_0,transparent_24%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute left-1/2 top-8 -translate-x-1/2 flex flex-col gap-3 rotate-[-12deg]",
			children: marks.map((mark, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
				initial: {
					opacity: 0,
					scale: .5
				},
				animate: {
					opacity: 1,
					scale: index % 2 === 0 ? 1 : .82,
					x: index % 2 === 0 ? -18 : 18
				},
				transition: { delay: index * .12 },
				className: "font-hand text-6xl text-slate-500 drop-shadow-sm",
				children: mark
			}, `${mark}-${index}`))
		})]
	});
}
function SpurenDetektiv({ onCorrect = () => {}, onWrong = () => {} }) {
	const [caseIndex, setCaseIndex] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const activeCase = CASES[caseIndex];
	const pickedOption = activeCase.options.find((option) => option.id === picked);
	const choose = (id) => {
		if (feedback === "richtig") return;
		setPicked(id);
		playPop();
		if (id === activeCase.answer) {
			setFeedback("richtig");
			playSparkle();
			onCorrect(5);
			confetti_module_default({
				particleCount: 100,
				spread: 90,
				origin: { y: .7 }
			});
		} else {
			setFeedback("falsch");
			playError();
			onWrong();
			setTimeout(() => {
				setPicked(null);
				setFeedback(null);
			}, 1300);
		}
	};
	const nextCase = () => {
		playPop();
		setCaseIndex((caseIndex + 1) % CASES.length);
		setPicked(null);
		setFeedback(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Spuren-Detektiv"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Welche Spur passt zu welchem Tier?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white/60 rounded-[48px] border-4 border-white shadow-xl p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-sans text-xs font-bold uppercase tracking-widest text-emerald-600",
							children: ["Fall ", caseIndex + 1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-hand text-4xl font-bold text-slate-700 mb-4",
							children: activeCase.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trail, { marks: activeCase.trail }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-hand text-2xl text-slate-600 mt-5 bg-white/70 rounded-[26px] px-5 py-3 border-2 border-emerald-100",
							children: activeCase.clue
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-emerald-50/60 rounded-[48px] border-4 border-white shadow-xl p-6 flex flex-col gap-4 justify-center",
					children: activeCase.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
						whileHover: {
							scale: 1.03,
							x: 4
						},
						whileTap: { scale: .96 },
						onClick: () => choose(option.id),
						className: `bg-white/85 rounded-[30px] border-4 p-5 shadow-md flex items-center gap-5 text-left transition-all ${picked === option.id ? "border-emerald-300 ring-4 ring-emerald-100" : "border-white hover:border-emerald-100"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-6xl",
							children: option.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-hand text-3xl font-bold text-slate-700",
							children: option.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-hand text-xl text-slate-500",
							children: option.place
						})] })]
					}, option.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-24 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
					mode: "wait",
					children: [feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						initial: {
							opacity: 0,
							y: 10
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: { opacity: 0 },
						className: "font-hand text-3xl font-bold text-rose-500",
						children: "Schau noch einmal auf Form und Größe der Spur."
					}, "wrong"), feedback === "richtig" && pickedOption && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 10
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: { opacity: 0 },
						className: "flex flex-col items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-hand text-3xl font-bold text-emerald-600",
							children: [
								"Gefunden: ",
								pickedOption.name,
								"! Gute Beobachtung."
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: nextCase,
							className: "px-8 py-3 bg-emerald-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg",
							children: "Nächster Fall"
						})]
					}, "right")]
				})
			})
		]
	});
}
//#endregion
//#region src/components/games/WetterAtelier.jsx
var WEATHER = WORLD_WEATHER_ROUNDS;
function WetterAtelier({ onCorrect = () => {}, onWrong = () => {} }) {
	const [roundIndex, setRoundIndex] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const round = WEATHER[roundIndex];
	const choose = (id) => {
		if (feedback === "richtig") return;
		setPicked(id);
		playPop();
		if (id === round.answer) {
			setFeedback("richtig");
			playSparkle();
			onCorrect(4);
			confetti_module_default({
				particleCount: 90,
				spread: 90,
				origin: { y: .72 }
			});
		} else {
			setFeedback("falsch");
			playError();
			onWrong();
			setTimeout(() => {
				setPicked(null);
				setFeedback(null);
			}, 1200);
		}
	};
	const next = () => {
		playPop();
		setRoundIndex((roundIndex + 1) % WEATHER.length);
		setPicked(null);
		setFeedback(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Wetter-Atelier"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Was passt zu diesem Wetter?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-gradient-to-br from-sky-50 via-white to-amber-50 rounded-[52px] border-4 border-white shadow-2xl p-8 paper-texture flex flex-col items-center justify-center min-h-96",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								scale: .7,
								rotate: -5
							},
							animate: {
								scale: 1,
								rotate: 0
							},
							className: "text-9xl mb-5 drop-shadow-md",
							children: round.sky
						}, round.title),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-sans text-xs font-bold uppercase tracking-widest text-sky-600",
							children: "Heute"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-hand text-5xl font-bold text-slate-700",
							children: round.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-hand text-2xl text-slate-500 mt-4 text-center",
							children: round.clue
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-white/60 rounded-[52px] border-4 border-white shadow-2xl p-6 flex flex-col gap-4 justify-center",
					children: round.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
						whileHover: {
							scale: 1.03,
							x: 4
						},
						whileTap: { scale: .96 },
						onClick: () => choose(option.id),
						className: `bg-white/85 rounded-[30px] border-4 p-5 shadow-md flex items-center gap-5 text-left transition-all ${picked === option.id ? "border-sky-300 ring-4 ring-sky-100" : "border-white hover:border-sky-100"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-6xl",
							children: option.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-hand text-3xl font-bold text-slate-700",
							children: option.label
						})]
					}, option.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-20 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
					mode: "wait",
					children: [feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						className: "font-hand text-3xl font-bold text-rose-500",
						children: "Das passt heute nicht so gut."
					}, "wrong"), feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						className: "flex flex-col items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-hand text-3xl font-bold text-sky-700",
							children: "Gut vorbereitet."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: next,
							className: "px-8 py-3 bg-sky-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg",
							children: "Nächstes Wetter"
						})]
					}, "right")]
				})
			})
		]
	});
}
//#endregion
//#region src/components/games/Jahreskreis.jsx
var SEASONS = {
	fruehling: {
		label: "Frühling",
		icon: "🌷",
		color: "bg-pink-100 border-pink-200 text-pink-700"
	},
	sommer: {
		label: "Sommer",
		icon: "☀️",
		color: "bg-yellow-100 border-yellow-200 text-yellow-700"
	},
	herbst: {
		label: "Herbst",
		icon: "🍂",
		color: "bg-orange-100 border-orange-200 text-orange-700"
	},
	winter: {
		label: "Winter",
		icon: "❄️",
		color: "bg-sky-100 border-sky-200 text-sky-700"
	}
};
var CARDS = WORLD_SEASON_CARDS;
function Jahreskreis({ onCorrect = () => {}, onWrong = () => {} }) {
	const [cardIndex, setCardIndex] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const card = CARDS[cardIndex];
	const choose = (season) => {
		if (feedback === "richtig") return;
		setPicked(season);
		playPop();
		if (season === card.answer) {
			setFeedback("richtig");
			playSparkle();
			onCorrect(4);
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
				setPicked(null);
				setFeedback(null);
			}, 1200);
		}
	};
	const next = () => {
		playPop();
		setCardIndex((cardIndex + 1) % CARDS.length);
		setPicked(null);
		setFeedback(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-8 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Jahreskreis"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Welche Jahreszeit passt zu diesem Bild?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full max-w-4xl bg-white/60 rounded-[56px] border-4 border-white shadow-2xl p-8 paper-texture",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						scale: .85,
						rotate: -2,
						opacity: 0
					},
					animate: {
						scale: 1,
						rotate: 0,
						opacity: 1
					},
					className: "bg-gradient-to-br from-white to-amber-50 rounded-[44px] border-4 border-white shadow-inner min-h-72 flex flex-col items-center justify-center text-center p-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-9xl drop-shadow-md mb-5",
						children: card.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-hand text-5xl font-bold text-slate-700",
						children: card.title
					})]
				}, card.id)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl",
				children: Object.entries(SEASONS).map(([id, season]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
					whileHover: {
						scale: 1.05,
						y: -4
					},
					whileTap: { scale: .95 },
					onClick: () => choose(id),
					className: `rounded-[34px] border-4 p-5 shadow-lg flex flex-col items-center gap-2 transition-all ${season.color} ${picked === id ? "ring-4 ring-white scale-105" : "hover:bg-white"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-6xl",
						children: season.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-hand text-3xl font-bold",
						children: season.label
					})]
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-20 text-center",
				children: [feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-3xl font-bold text-rose-500",
					children: "Schau auf Temperatur, Pflanzen und Licht."
				}), feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-hand text-3xl font-bold text-emerald-600",
						children: [
							"Ja, das passt in den ",
							SEASONS[card.answer].label,
							"."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: next,
						className: "px-8 py-3 bg-emerald-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg",
						children: "Weiter im Kreis"
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/modules/SachunterrichtModule.jsx
var SubjectPremiumAtelier = (0, import_react.lazy)(() => __vitePreload(() => import("./SubjectPremiumAtelier-OFFtJlBa.js"), __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])));
var SkyWonderland = (0, import_react.lazy)(() => __vitePreload(() => import("./SkyWonderland-Bz4SaHcY.js"), __vite__mapDeps([13,1,2,3,4,12,14,7,8])));
var DeepLearningQuest = (0, import_react.lazy)(() => __vitePreload(() => import("./DeepLearningQuest-CbOGahul.js"), __vite__mapDeps([5,1,2,3,4,6,7,8,9])));
var LearningArcade = (0, import_react.lazy)(() => __vitePreload(() => import("./LearningArcade-BGnmy9QN.js"), __vite__mapDeps([15,1,2,3,4,10,6,12,16,8,9])));
var terrainTypes = WORLD_CONTENT.terrainTypes;
var sandboxAnimals = WORLD_CONTENT.sandboxAnimals;
function EcosystemSandbox() {
	const [grid, setGrid] = (0, import_react.useState)(Array(16).fill("gras"));
	const [activeTool, setActiveTool] = (0, import_react.useState)("wasser");
	const [placedAnimals, setPlacedAnimals] = (0, import_react.useState)({});
	const paintCell = (index) => {
		playPop();
		const newGrid = [...grid];
		newGrid[index] = activeTool;
		setGrid(newGrid);
	};
	const handleAnimalDrop = (animal, info) => {
		const dropCell = document.elementsFromPoint(info.point.x, info.point.y).find((el) => el.getAttribute("data-cell-index"));
		if (dropCell) {
			const idx = dropCell.getAttribute("data-cell-index");
			setPlacedAnimals((prev) => ({
				...prev,
				[idx]: animal
			}));
			playPop();
		}
	};
	const AnimalWidget = ({ animal, cellTerrain }) => {
		const isHappy = animal.habitat === cellTerrain;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: { scale: 0 },
			animate: {
				scale: 1,
				rotate: isHappy ? [
					0,
					-10,
					10,
					0
				] : 0
			},
			transition: {
				loop: isHappy ? Infinity : 0,
				duration: 2
			},
			className: "absolute inset-0 flex items-center justify-center text-5xl pointer-events-none",
			children: [animal.emoji, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					opacity: 0,
					y: 10
				},
				animate: {
					opacity: 1,
					y: -20
				},
				className: "absolute -top-4 text-2xl",
				children: isHappy ? "❤️" : "💦"
			})]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white/60 backdrop-blur-md p-6 rounded-[30px] border-2 border-white shadow-xl flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-hand text-xl font-bold text-slate-500 mr-2",
					children: "Pinsel:"
				}), terrainTypes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
					whileHover: { scale: 1.1 },
					whileTap: { scale: .9 },
					onClick: () => setActiveTool(t.id),
					className: `p-4 rounded-xl text-3xl transition-all ${activeTool === t.id ? "ring-4 ring-slate-400 shadow-lg scale-110" : "opacity-60"}`,
					style: { backgroundColor: t.color },
					children: t.icon
				}, t.id))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					setGrid(Array(16).fill("gras"));
					setPlacedAnimals({});
				},
				className: "px-6 py-3 bg-red-400 text-white rounded-xl font-bold font-hand hover:bg-red-500",
				children: "Reset Welt"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-2/3 grid grid-cols-4 gap-2 bg-slate-200 p-4 rounded-[40px] shadow-inner",
				children: grid.map((terrainId, idx) => {
					const terrain = terrainTypes.find((t) => t.id === terrainId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-cell-index": idx,
						onClick: () => paintCell(idx),
						onDragOver: (e) => e.preventDefault(),
						className: "aspect-square rounded-2xl relative cursor-pointer overflow-hidden shadow-sm hover:ring-4 ring-white transition-all watercolor-effect",
						style: { backgroundColor: terrain.color },
						children: placedAnimals[idx] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimalWidget, {
							animal: placedAnimals[idx],
							cellTerrain: terrainId
						})
					}, idx);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-1/3 bg-white/60 p-6 rounded-[40px] flex flex-wrap gap-4 content-start border-2 border-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "w-full font-hand text-xl font-bold text-slate-500 border-b pb-2 mb-2",
					children: "Tiere (zieh mich)"
				}), sandboxAnimals.map((animal) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					drag: true,
					dragSnapToOrigin: true,
					onDragEnd: (e, info) => handleAnimalDrop(animal, info),
					whileDrag: {
						scale: 1.5,
						zIndex: 100
					},
					className: "text-5xl cursor-grab active:cursor-grabbing hover:scale-110 transition-transform bg-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-md border border-slate-100",
					children: animal.emoji
				}, animal.id))]
			})]
		})]
	});
}
var chainItems = WORLD_CONTENT.foodChainItems;
function FoodChainGame({ onCorrect }) {
	const [slots, setSlots] = (0, import_react.useState)({
		slot1: null,
		slot2: null,
		slot3: null
	});
	const [inventory, setInventory] = (0, import_react.useState)(chainItems);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const slotsRef = (0, import_react.useRef)({});
	const expectedOrder = [
		"plant",
		"herbivore",
		"carnivore"
	];
	const handleDragEnd = (item, point) => {
		let droppedSlot = null;
		Object.keys(slotsRef.current).forEach((slotName) => {
			const el = slotsRef.current[slotName];
			if (el) {
				const rect = el.getBoundingClientRect();
				const rL = rect.left + window.scrollX;
				const rR = rect.right + window.scrollX;
				const rT = rect.top + window.scrollY;
				const rB = rect.bottom + window.scrollY;
				if (point.x >= rL - 20 && point.x <= rR + 20 && point.y >= rT - 20 && point.y <= rB + 20) droppedSlot = slotName;
			}
		});
		if (droppedSlot) {
			playPop();
			setSlots((prev) => ({
				...prev,
				[droppedSlot]: item
			}));
			setInventory((prev) => prev.filter((i) => i.id !== item.id));
		}
	};
	const check = () => {
		if ([
			slots.slot1?.type,
			slots.slot2?.type,
			slots.slot3?.type
		].join(",") === expectedOrder.join(",")) {
			playSparkle();
			setFeedback("richtig");
			onCorrect(5);
			confetti_module_default();
		} else {
			playError();
			setFeedback("falsch");
			setTimeout(() => setFeedback(null), 3e3);
		}
	};
	const reset = () => {
		playPop();
		setSlots({
			slot1: null,
			slot2: null,
			slot3: null
		});
		setInventory(chainItems);
		setFeedback(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-10 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-2xl text-slate-500",
				children: "Wer isst wen? Bilde die richtige Reihenfolge!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-8 items-center bg-emerald-50/50 p-8 rounded-[40px] border-4 border-dashed border-emerald-200",
				children: [
					1,
					2,
					3
				].map((num) => {
					const slotName = `slot${num}`;
					const item = slots[slotName];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: (el) => slotsRef.current[slotName] = el,
							className: "w-32 h-32 bg-white rounded-full border-4 border-emerald-100 shadow-inner flex items-center justify-center text-6xl relative",
							children: [item && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: { scale: 0 },
								animate: { scale: 1 },
								children: item.emoji
							}), !item && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xl text-emerald-200 font-hand",
								children: num
							})]
						}), num < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-4xl text-emerald-300",
							children: "➜"
						})]
					}, num);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-6 p-6 bg-white/60 rounded-[30px] border-2 border-white shadow-xl min-h-[120px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: inventory.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					drag: true,
					dragSnapToOrigin: true,
					onDragEnd: (e, info) => handleDragEnd(item, info.point),
					whileDrag: {
						scale: 1.3,
						zIndex: 100
					},
					initial: { scale: 0 },
					animate: { scale: 1 },
					exit: { scale: 0 },
					className: "w-24 h-24 bg-white rounded-2xl shadow-lg border-2 border-slate-100 flex flex-col items-center justify-center text-5xl cursor-grab active:cursor-grabbing hover:scale-105 transition-transform",
					children: [item.emoji, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-hand text-slate-400 mt-1",
						children: item.name
					})]
				}, item.id)) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: reset,
					className: "px-6 py-3 bg-slate-200 text-slate-600 rounded-xl font-hand text-xl hover:bg-slate-300",
					children: "Nochmal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
					onClick: check,
					className: "px-10 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-xl hover:bg-emerald-600 shadow-lg",
					whileHover: { scale: 1.05 },
					whileTap: { scale: .95 },
					children: "Kette prüfen!"
				})]
			}),
			feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-2xl text-red-500",
				children: "Irgendetwas stimmt hier nicht ganz..."
			}),
			feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-3xl text-emerald-500",
				children: "Perfekt! Der Kreislauf der Natur."
			})
		]
	});
}
var frogCycle = WORLD_CONTENT.lifeCycles[0].stages;
function LifeCycleGame({ onCorrect }) {
	const [slots, setSlots] = (0, import_react.useState)({
		s1: null,
		s2: null,
		s3: null,
		s4: null
	});
	const [inventory, setInventory] = (0, import_react.useState)([...frogCycle].sort(() => Math.random() - .5));
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const slotsRef = (0, import_react.useRef)({});
	const handleDragEnd = (item, point) => {
		let droppedSlot = null;
		Object.keys(slotsRef.current).forEach((slotName) => {
			const el = slotsRef.current[slotName];
			if (el) {
				const rect = el.getBoundingClientRect();
				const rL = rect.left + window.scrollX;
				const rR = rect.right + window.scrollX;
				const rT = rect.top + window.scrollY;
				const rB = rect.bottom + window.scrollY;
				if (point.x >= rL - 20 && point.x <= rR + 20 && point.y >= rT - 20 && point.y <= rB + 20) droppedSlot = slotName;
			}
		});
		if (droppedSlot) {
			playPop();
			setSlots((prev) => ({
				...prev,
				[droppedSlot]: item
			}));
			setInventory((prev) => prev.filter((i) => i.id !== item.id));
		}
	};
	const check = () => {
		if (slots.s1?.stage === 1 && slots.s2?.stage === 2 && slots.s3?.stage === 3 && slots.s4?.stage === 4) {
			playSparkle();
			setFeedback("richtig");
			onCorrect(5);
			confetti_module_default();
		} else {
			playError();
			setFeedback("falsch");
			setTimeout(() => setFeedback(null), 3e3);
		}
	};
	const reset = () => {
		playPop();
		setSlots({
			s1: null,
			s2: null,
			s3: null,
			s4: null
		});
		setInventory([...frogCycle].sort(() => Math.random() - .5));
		setFeedback(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-10 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-2xl text-slate-500",
				children: "Wie wächst ein Frosch? Sortiere den Lebenszyklus!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-96 h-96 bg-blue-50/50 rounded-full border-4 border-dashed border-blue-200 shadow-inner flex items-center justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-8 top-1/2 -translate-y-1/2 border-t-4 border-blue-200 border-dashed rounded-full h-full pointer-events-none opacity-50" }), [
					{
						id: "s1",
						pos: "-top-12 left-1/2 -translate-x-1/2"
					},
					{
						id: "s2",
						pos: "top-1/2 -right-12 -translate-y-1/2"
					},
					{
						id: "s3",
						pos: "-bottom-12 left-1/2 -translate-x-1/2"
					},
					{
						id: "s4",
						pos: "top-1/2 -left-12 -translate-y-1/2"
					}
				].map((slot, i) => {
					const item = slots[slot.id];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: (el) => slotsRef.current[slot.id] = el,
						className: `absolute ${slot.pos} w-28 h-28 bg-white rounded-full border-4 border-blue-100 shadow-xl flex items-center justify-center text-5xl`,
						children: item ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: { scale: 0 },
							animate: { scale: 1 },
							children: item.emoji
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl text-blue-200 font-hand",
							children: i + 1
						})
					}, slot.id);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-6 mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: inventory.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					drag: true,
					dragSnapToOrigin: true,
					onDragEnd: (e, info) => handleDragEnd(item, info.point),
					whileDrag: {
						scale: 1.3,
						zIndex: 100
					},
					initial: { scale: 0 },
					animate: { scale: 1 },
					exit: { scale: 0 },
					className: "w-24 h-24 bg-white rounded-3xl shadow-lg border-2 border-slate-100 flex flex-col items-center justify-center text-5xl cursor-grab active:cursor-grabbing hover:scale-105 transition-transform",
					children: [item.emoji, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-hand text-slate-400 mt-1",
						children: item.name
					})]
				}, item.id)) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: reset,
					className: "px-6 py-3 bg-slate-200 text-slate-600 rounded-xl font-hand text-xl hover:bg-slate-300",
					children: "Nochmal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
					onClick: check,
					className: "px-10 py-4 bg-blue-500 text-white rounded-2xl font-bold text-xl hover:bg-blue-600 shadow-lg",
					whileHover: { scale: 1.05 },
					whileTap: { scale: .95 },
					children: "Kreislauf prüfen!"
				})]
			}),
			feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-2xl text-red-500",
				children: "Die Reihenfolge passt noch nicht..."
			}),
			feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-3xl text-emerald-500",
				children: "Wunderbar! Ein neuer Frosch!"
			})
		]
	});
}
function SachunterrichtModule({ onCorrect = () => {}, onWrong = () => {} }) {
	const [activeTab, setActiveTab] = (0, import_react.useState)("himmelwelt");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8 w-full max-w-6xl mx-auto pb-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800 tracking-wide",
					children: "Natur & Welt"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500",
					children: "Erforsche die Geheimnisse der Natur."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-4",
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
						id: "sandbox",
						label: "Die Welt-Sandbox",
						color: "bg-emerald-400"
					},
					{
						id: "wetter",
						label: "Wetter-Atelier",
						color: "bg-sky-400"
					},
					{
						id: "jahreskreis",
						label: "Jahreskreis",
						color: "bg-orange-400"
					},
					{
						id: "chain",
						label: "Nahrungskette",
						color: "bg-amber-400"
					},
					{
						id: "cycle",
						label: "Lebenszyklus",
						color: "bg-blue-400"
					},
					{
						id: "spuren",
						label: "Spuren-Detektiv",
						color: "bg-lime-400"
					},
					{
						id: "spielwelt",
						label: "Spielwelt",
						color: "bg-fuchsia-500"
					},
					{
						id: "quest",
						label: "Quest-Mixer",
						color: "bg-teal-500"
					},
					{
						id: "premium",
						label: "Premium-Atelier",
						color: "bg-amber-500"
					},
					{
						id: "action",
						label: "Forscher-Fangspiel",
						color: "bg-orange-500"
					},
					{
						id: "varianten",
						label: "Mega-Auswahl",
						color: "bg-slate-800"
					}
				].map((tab) => {
					const isActive = activeTab === tab.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
						onClick: () => {
							playPop();
							setActiveTab(tab.id);
						},
						whileHover: { scale: 1.05 },
						whileTap: { scale: .95 },
						className: `px-8 py-3 rounded-full font-hand text-xl font-bold transition-all shadow-md ${isActive ? `${tab.color} text-white` : "bg-white text-slate-400 border-2 border-slate-100 hover:border-slate-300"}`,
						children: tab.label
					}, tab.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white/50 backdrop-blur-xl rounded-[50px] p-8 border-4 border-white shadow-2xl relative overflow-hidden min-h-[500px]",
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
									title: "Himmelswunderland",
									onCorrect,
									onWrong
								})
							}),
							activeTab === "arcade" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[660px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearningArcade, {
									subject: "sachunterricht",
									onCorrect,
									onWrong
								})
							}),
							activeTab === "sinn" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[640px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeepLearningQuest, {
									subject: "sachunterricht",
									onCorrect,
									onWrong
								})
							}),
							activeTab === "sandbox" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EcosystemSandbox, {}),
							activeTab === "wetter" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WetterAtelier, {
								onCorrect,
								onWrong
							}),
							activeTab === "jahreskreis" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Jahreskreis, {
								onCorrect,
								onWrong
							}),
							activeTab === "chain" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodChainGame, { onCorrect }),
							activeTab === "cycle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeCycleGame, { onCorrect }),
							activeTab === "spuren" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpurenDetektiv, {
								onCorrect,
								onWrong
							}),
							activeTab === "spielwelt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameWorld, {
								title: "Forscher-Spielwelt",
								intro: "Acht Spielarten mit Expedition, Atelier, Puzzle und erweitertem Premium-Forscherpool.",
								collections: SUBJECT_VARIANT_CONTENT.sachunterricht,
								accent: "bg-emerald-500",
								scene: "world",
								onCorrect,
								onWrong
							}),
							activeTab === "quest" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestMixer, {
								title: "Forscher-Quest-Mixer",
								intro: "Expedition, Puzzle, Sternenlauf und Kartenwirbel für Lebensräume, Wetter, Experimente und Naturpflege.",
								collections: SUBJECT_VARIANT_CONTENT.sachunterricht,
								accent: "bg-emerald-500",
								onCorrect,
								onWrong
							}),
							activeTab === "premium" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[360px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubjectPremiumAtelier, {
									subject: "sachunterricht",
									onCorrect,
									onWrong
								})
							}),
							activeTab === "action" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionArena, {
								title: "Forscher-Fangspiel",
								intro: "Fang die richtige Naturantwort, bevor die Runde abläuft.",
								collections: SUBJECT_VARIANT_CONTENT.sachunterricht,
								accent: "bg-emerald-500",
								onCorrect,
								onWrong
							}),
							activeTab === "varianten" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VariantStudio, {
								title: "Welt-Mega-Auswahl",
								intro: "Viele Lebensraum-, Wetter-, Jahreszeiten-, Experiment- und Naturpflegekarten zum Forschen und Variieren.",
								collections: SUBJECT_VARIANT_CONTENT.sachunterricht,
								onCorrect,
								onWrong
							})
						]
					}, activeTab)
				})
			})
		]
	});
}
//#endregion
export { SachunterrichtModule as default };
