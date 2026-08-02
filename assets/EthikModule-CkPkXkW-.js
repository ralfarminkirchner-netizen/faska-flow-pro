const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/SubjectPremiumAtelier-OFFtJlBa.js","assets/jsx-runtime-Be5yPkiZ.js","assets/star-DBCbE8d7.js","assets/proxy--6s_pC9q.js","assets/sounds-Dh98eEYj.js","assets/DeepLearningQuest-CbOGahul.js","assets/learningContent-D1WsycQZ.js","assets/wand-sparkles-CtIcwwM8.js","assets/animalFriends-U19Ro3hF.js","assets/premiumGamePack-CHz1F5u_.js","assets/compass-JckdT0FA.js","assets/grid-3x3-BjeKZBlx.js","assets/sparkles-bt2KNUwI.js","assets/SkyWonderland-Bz4SaHcY.js","assets/volume-2-Vs6pZO3N.js","assets/LearningArcade-BGnmy9QN.js","assets/trophy-Ci-hdIiU.js"])))=>i.map(i=>d[i]);
import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as motion } from "./proxy--6s_pC9q.js";
import { N as playSparkle, V as AnimatePresence, l as playError, w as playPop } from "./sounds-Dh98eEYj.js";
import { r as confetti_module_default } from "./star-DBCbE8d7.js";
import { n as LumiSvg, t as __vitePreload } from "./index-B5O6y7xB.js";
import { s as SUBJECT_VARIANT_CONTENT } from "./learningContent-D1WsycQZ.js";
import { i as VariantStudio, n as GameWorld, r as ActionArena, t as QuestMixer } from "./QuestMixer-CwJK0O5N.js";
//#region src/components/games/RuheInsel.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	{
		id: "feet",
		icon: "🦶",
		text: "Füße spüren",
		detail: "Drück beide Füße sanft in den Boden."
	},
	{
		id: "breath",
		icon: "🌬️",
		text: "Lang ausatmen",
		detail: "Atme aus, als bewegst du eine Kerze."
	},
	{
		id: "look",
		icon: "👀",
		text: "Drei Dinge sehen",
		detail: "Nenne leise drei Dinge im Raum."
	},
	{
		id: "hand",
		icon: "🤲",
		text: "Hand aufs Herz",
		detail: "Spür: Ich bin jetzt hier."
	}
];
function RuheInsel({ onCorrect = () => {} }) {
	const [done, setDone] = (0, import_react.useState)([]);
	const [complete, setComplete] = (0, import_react.useState)(false);
	const toggle = (id) => {
		if (complete) return;
		playPop();
		setDone((current) => {
			const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
			if (next.length === STEPS.length) setTimeout(() => {
				setComplete(true);
				playSparkle();
				onCorrect(5);
				confetti_module_default({
					particleCount: 80,
					spread: 80,
					origin: { y: .75 }
				});
			}, 300);
			return next;
		});
	};
	const reset = () => {
		playPop();
		setDone([]);
		setComplete(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-8 py-8 w-full max-w-5xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Ruhe-Insel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Sammle vier ruhige Anker für deinen Körper."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full bg-gradient-to-br from-teal-50 via-white to-amber-50 rounded-[60px] border-4 border-white shadow-2xl p-8 paper-texture overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					animate: {
						scale: complete ? [
							1,
							1.08,
							1
						] : [
							1,
							1.03,
							1
						],
						opacity: complete ? .95 : .65
					},
					transition: {
						repeat: Infinity,
						duration: complete ? 3 : 4
					},
					className: "absolute left-1/2 top-1/2 w-80 h-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-100/60 blur-3xl"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative grid grid-cols-1 md:grid-cols-2 gap-5",
					children: STEPS.map((step) => {
						const active = done.includes(step.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
							whileHover: {
								scale: 1.03,
								y: -3
							},
							whileTap: { scale: .96 },
							onClick: () => toggle(step.id),
							className: `min-h-44 rounded-[38px] border-4 p-6 shadow-lg text-left flex items-center gap-5 transition-all ${active ? "bg-teal-50 border-teal-200 ring-4 ring-teal-100" : "bg-white/85 border-white hover:border-teal-100"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-6xl",
								children: step.icon
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-hand text-3xl font-bold text-slate-700",
								children: step.text
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-hand text-xl text-slate-500 mt-1",
								children: step.detail
							})] })]
						}, step.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-20 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					mode: "wait",
					children: complete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						className: "flex flex-col items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-hand text-3xl font-bold text-teal-700",
							children: "Gut. Dein Körper kennt jetzt vier Anker."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: reset,
							className: "px-8 py-3 bg-teal-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg",
							children: "Noch einmal ruhig werden"
						})]
					}, "complete") : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.p, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						className: "font-hand text-2xl text-slate-500",
						children: [
							done.length,
							" von ",
							STEPS.length,
							" Ankern gesammelt"
						]
					}, "count")
				})
			})
		]
	});
}
//#endregion
//#region src/components/games/GrenzenGarten.jsx
var SCENES = [
	{
		title: "Zu nah",
		text: "Jemand möchte dich kitzeln, obwohl du gerade nicht willst.",
		answer: "stop",
		options: [
			{
				id: "laugh",
				label: "Einfach lachen, obwohl es blöd ist",
				icon: "😬"
			},
			{
				id: "stop",
				label: "Stopp. Ich möchte das nicht.",
				icon: "✋"
			},
			{
				id: "hide",
				label: "Nichts sagen und wegschauen",
				icon: "🙈"
			}
		],
		wisdom: "Dein Körper gehört dir. Ein klares Stopp ist erlaubt."
	},
	{
		title: "Schweres Geheimnis",
		text: "Ein Geheimnis fühlt sich im Bauch schwer und komisch an.",
		answer: "tell",
		options: [
			{
				id: "tell",
				label: "Es einem sicheren Erwachsenen erzählen",
				icon: "🗣️"
			},
			{
				id: "keep",
				label: "Es für immer behalten",
				icon: "🤐"
			},
			{
				id: "joke",
				label: "Einen Witz daraus machen",
				icon: "🎭"
			}
		],
		wisdom: "Schwere Geheimnisse darf man erzählen. Hilfe holen ist mutig."
	},
	{
		title: "Nein sagen",
		text: "Du sollst etwas machen, das sich für dich nicht richtig anfühlt.",
		answer: "pause",
		options: [
			{
				id: "pause",
				label: "Ich brauche kurz Zeit. Ich frage erst nach.",
				icon: "🧭"
			},
			{
				id: "rush",
				label: "Schnell ja sagen",
				icon: "🏃"
			},
			{
				id: "angry",
				label: "Sofort schreien",
				icon: "🌋"
			}
		],
		wisdom: "Ein langsames Nein oder eine Pause kann sehr klug sein."
	},
	{
		title: "Freundschaft",
		text: "Ein Freund will nur spielen, wenn immer er bestimmen darf.",
		answer: "fair",
		options: [
			{
				id: "fair",
				label: "Lass uns abwechseln.",
				icon: "🔁"
			},
			{
				id: "giveup",
				label: "Immer nachgeben",
				icon: "🫥"
			},
			{
				id: "leave",
				label: "Nie wieder reden",
				icon: "🚪"
			}
		],
		wisdom: "Gute Freundschaft hat Platz für beide Stimmen."
	}
];
function GrenzenGarten({ onCorrect = () => {}, onWrong = () => {} }) {
	const [sceneIndex, setSceneIndex] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const scene = SCENES[sceneIndex];
	const choose = (id) => {
		if (feedback === "richtig") return;
		setPicked(id);
		playPop();
		if (id === scene.answer) {
			setFeedback("richtig");
			playSparkle();
			onCorrect(5);
			confetti_module_default({
				particleCount: 90,
				spread: 80,
				origin: { y: .75 }
			});
		} else {
			setFeedback("falsch");
			playError();
			onWrong();
			setTimeout(() => {
				setPicked(null);
				setFeedback(null);
			}, 1400);
		}
	};
	const next = () => {
		playPop();
		setSceneIndex((sceneIndex + 1) % SCENES.length);
		setPicked(null);
		setFeedback(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-5xl mx-auto py-8 flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Grenzen-Garten"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Übe klare, freundliche und sichere Sätze."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-rose-50/70 rounded-[56px] border-4 border-white shadow-2xl p-8 paper-texture",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-sans text-xs font-bold uppercase tracking-widest text-rose-600",
						children: ["Szene ", sceneIndex + 1]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-hand text-5xl font-bold text-slate-800 mt-1",
						children: scene.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-hand text-3xl text-slate-600 mt-4 leading-snug",
						children: scene.text
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-4",
				children: scene.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
					whileHover: {
						scale: 1.03,
						y: -3
					},
					whileTap: { scale: .96 },
					onClick: () => choose(option.id),
					className: `bg-white/85 rounded-[34px] border-4 p-5 shadow-lg text-left flex flex-col gap-4 transition-all min-h-52 ${picked === option.id ? "border-rose-300 ring-4 ring-rose-100" : "border-white hover:border-rose-100"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-6xl",
						children: option.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-hand text-3xl font-bold text-slate-700 leading-tight",
						children: option.label
					})]
				}, option.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-28 text-center",
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
						className: "font-hand text-3xl font-bold text-rose-500",
						children: "Such den Satz, der dich schützt und ruhig klar bleibt."
					}, "wrong"), feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						className: "flex flex-col items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-hand text-3xl font-bold text-rose-700 max-w-3xl",
							children: scene.wisdom
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: next,
							className: "px-8 py-3 bg-rose-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg",
							children: "Nächste Szene"
						})]
					}, "right")]
				})
			})
		]
	});
}
//#endregion
//#region src/modules/EthikModule.jsx
var SubjectPremiumAtelier = (0, import_react.lazy)(() => __vitePreload(() => import("./SubjectPremiumAtelier-OFFtJlBa.js"), __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])));
var SkyWonderland = (0, import_react.lazy)(() => __vitePreload(() => import("./SkyWonderland-Bz4SaHcY.js"), __vite__mapDeps([13,1,2,3,4,12,14,7,8])));
var DeepLearningQuest = (0, import_react.lazy)(() => __vitePreload(() => import("./DeepLearningQuest-CbOGahul.js"), __vite__mapDeps([5,1,2,3,4,6,7,8,9])));
var LearningArcade = (0, import_react.lazy)(() => __vitePreload(() => import("./LearningArcade-BGnmy9QN.js"), __vite__mapDeps([15,1,2,3,4,10,6,12,16,8,9])));
var basicEmotions = [
	{
		id: "angst",
		name: "Angst",
		emoji: "😨",
		color: "#d8b4fe"
	},
	{
		id: "ekel",
		name: "Ekel",
		emoji: "🤢",
		color: "#86efac"
	},
	{
		id: "freude",
		name: "Freude",
		emoji: "😄",
		color: "#fde047"
	},
	{
		id: "mudigkeit",
		name: "Müdigkeit",
		emoji: "🥱",
		color: "#cbd5e1"
	},
	{
		id: "neugier",
		name: "Neugier",
		emoji: "🧐",
		color: "#67e8f9"
	},
	{
		id: "trauer",
		name: "Trauer",
		emoji: "😢",
		color: "#93c5fd"
	},
	{
		id: "uberraschung",
		name: "Überraschung",
		emoji: "😯",
		color: "#f9a8d4"
	},
	{
		id: "wut",
		name: "Wut",
		emoji: "😡",
		color: "#fca5a5"
	}
];
var recipes = {
	"angst,wut": {
		name: "Panik",
		emoji: "😱",
		color: "#c084fc",
		text: "Große Angst gemischt mit der Wut, die Kontrolle verloren zu haben. Wenn das passiert, atme dreimal ganz tief durch deinen Bauch ein und aus. Du bist sicher."
	},
	"angst,freude": {
		name: "Nervosität",
		emoji: "😬",
		color: "#fca5a5",
		text: "Man freut sich auf etwas, hat aber gleichzeitig auch etwas Angst davor (wie vor einer Achterbahnfahrt!). Das ist okay, Nervosität bedeutet, dass dir etwas wichtig ist."
	},
	"trauer,wut": {
		name: "Frustration",
		emoji: "😫",
		color: "#fb923c",
		text: "Wenn man traurig ist, dass etwas nicht klappt, und wütend darüber wird. Frustration ist wie ein dicker Knoten. Hol dir Hilfe oder mach kurz eine kleine Pause, dann löst er sich oft von selbst!"
	},
	"freude,trauer": {
		name: "Nostalgie",
		emoji: "🥹",
		color: "#a7f3d0",
		text: "Schöne Erinnerungen an früher, die uns lächeln lassen, aber wir vermissen sie auch. Erinnerst du dich an einen wirklich schönen Moment?"
	},
	"ekel,wut": {
		name: "Abneigung",
		emoji: "😤",
		color: "#bef264",
		text: "Wenn du etwas ganz furchtbar findest und wütend bist, dass es da ist. Setze sanft, aber bestimmt eine Grenze: 'Nein danke, das mag ich nicht!'"
	},
	"freude,uberraschung": {
		name: "Begeisterung",
		emoji: "🤩",
		color: "#fde047",
		text: "Ein riesiges, plötzliches 'Wow!'. Begeisterung ist so hell wie die Sonne. Mit wem teilst du deine schönen Momente am liebsten?"
	},
	"mudigkeit,wut": {
		name: "Gerechtfertigter Griesgram",
		emoji: "😒",
		color: "#94a3b8",
		text: "Wenn der Körper Pause braucht, haben wir keine Energie für Geduld. Da wird man schnell wütend. Ein kleines Nickerchen bewirkt oft Wunder!"
	},
	"angst,ekel": {
		name: "Abscheu",
		emoji: "🤮",
		color: "#4ade80",
		text: "Man möchte etwas gar nicht berühren, aus Angst, dass es einem nicht guttut. Dein Bauchgefühl beschützt dich."
	},
	"angst,trauer": {
		name: "Verzweiflung",
		emoji: "😭",
		color: "#64748b",
		text: "Ein ganz schweres Gefühl, als gäbe es keinen Ausweg. Aber denk immer dran: Auf jeden Regen folgt irgendwann ein Regenbogen. Sprich mit jemandem darüber!"
	},
	"mudigkeit,trauer": {
		name: "Erschöpfung",
		emoji: "🤕",
		color: "#9ca3af",
		text: "Wenn alles zu viel war. Dein Kopf und dein Herz müssen rasten. Eine warme Decke und ein Kakao sind jetzt genau das Richtige."
	},
	"neugier,uberraschung": {
		name: "Faszination",
		emoji: "🤯",
		color: "#7dd3fc",
		text: "Wenn die Welt so spannend ist, dass wir große Augen machen. Bewahre dir diese staunenden Augen, die Welt ist voller Wunder!"
	},
	"freude,wut": {
		name: "Schadenfreude",
		emoji: "🤭",
		color: "#fcd34d",
		text: "Über jemanden lachen, dem etwas Dummes passiert ist. Kurz fühlt es sich lustig an, aber eigentlich ist es nicht nett. Trösten macht viel glücklicher!"
	},
	"trauer,uberraschung": {
		name: "Schock",
		emoji: "🫢",
		color: "#e2e8f0",
		text: "Wenn plötzlich etwas Trauriges passiert, auf das wir gar nicht vorbereitet waren. Nimm dir Zeit, es zu verstehen. Du musst nicht sofort wissen, was du fühlst."
	},
	"ekel,freude": {
		name: "Quatsch-Ekel",
		emoji: "🤪",
		color: "#d9f99d",
		text: "Wenn etwas eigentlich eklig ist, man aber trotzdem darüber lachen muss (wie Pups-Witze!). Manchmal ist Quatsch machen tut uns einfach gut."
	},
	"angst,neugier": {
		name: "Mut",
		emoji: "🦸",
		color: "#fbbf24",
		text: "Man hat zwar große Angst, aber die Neugier ist noch größer, also probiert man es trotzdem! Mutig sein heißt nicht, keine Angst zu haben. Sondern es zu tun, OBWOHL man Angst hat."
	},
	"freude,neugier": {
		name: "Entdeckergeist",
		emoji: "🧭",
		color: "#86efac",
		text: "Du hast richtig Lust, etwas Neues zu lernen! Die Welt ist wie ein riesiger Abenteuerspielplatz."
	},
	"ekel,trauer": {
		name: "Melancholie",
		emoji: "🌫️",
		color: "#94a3b8",
		text: "Ein graues Gefühl, wenn man sich von der Welt etwas zurückziehen möchte. Das ist okay, auch Wolken gehören zum Himmel."
	},
	"neugier,trauer": {
		name: "Nachdenklichkeit",
		emoji: "🤔",
		color: "#818cf8",
		text: "Wenn du über etwas Trauriges nachdenkst, um es zu verstehen. Dein Verstand hilft deinem Herzen."
	},
	"freude,mudigkeit": {
		name: "Zufriedenheit",
		emoji: "😌",
		color: "#bef264",
		text: "Nach einem langen Tag voller Spiel und Spaß einfach nur ausruhen. Das ist ein warmes, weiches Gefühl."
	},
	"ekel,neugier": {
		name: "Argwohn",
		emoji: "🤨",
		color: "#a3e635",
		text: "Etwas sieht komisch aus, aber du willst trotzdem wissen, was es ist. Sei vorsichtig, aber bleib aufmerksam!"
	},
	"neugier,wut": {
		name: "Ehrgeiz",
		emoji: "⚡",
		color: "#f87171",
		text: "Wenn etwas nicht klappt und du wütend wirst, es aber UNBEDINGT schaffen willst. Nutze die Energie der Wut, um es nochmal zu probieren!"
	},
	"angst,uberraschung": {
		name: "Erschrecken",
		emoji: "🫨",
		color: "#e2e8f0",
		text: "Huch! Das kam unerwartet. Atme kurz durch, der Schreck verfliegt meistens schnell."
	},
	"mudigkeit,uberraschung": {
		name: "Verwirrung",
		emoji: "😵",
		color: "#cbd5e1",
		text: "Wenn man zu müde ist, um zu verstehen, was gerade passiert ist. Ruh dich erst mal aus."
	},
	"ekel,uberraschung": {
		name: "Abscheu",
		emoji: "🤮",
		color: "#4ade80",
		text: "Ih, das war eklig UND kam plötzlich! Schnell Hände waschen und an etwas Schönes denken."
	},
	"freude,ekel": {
		name: "Kichern",
		emoji: "🤭",
		color: "#fef08a",
		text: "Eigentlich eklig, aber irgendwie auch lustig. Ein bisschen Quatsch muss sein!"
	},
	"trauer,mudigkeit": {
		name: "Erschöpfung",
		emoji: "💤",
		color: "#94a3b8",
		text: "Dein Herz und dein Körper brauchen eine Pause. Morgen sieht die Welt schon wieder anders aus."
	},
	"freude,freude": {
		name: "Euphorie",
		emoji: "🎊",
		color: "#fde047",
		text: "Pures Glück! Du möchtest die ganze Welt umarmen. Genieße diesen Moment!"
	},
	"wut,wut": {
		name: "Zorn",
		emoji: "🌋",
		color: "#ef4444",
		text: "Wie ein Vulkan! Die Wut ist riesig. Stampf fest auf den Boden oder schrei in ein Kissen, um den Druck abzulassen."
	},
	"trauer,trauer": {
		name: "Tiefer Kummer",
		emoji: "🌧️",
		color: "#60a5fa",
		text: "Ein sehr schweres Herz. Es ist okay zu weinen, Tränen waschen die Seele sauber."
	},
	"angst,angst": {
		name: "Panik",
		emoji: "😱",
		color: "#a855f7",
		text: "Wenn die Angst dich ganz fest im Griff hat. Such dir eine Hand zum Halten, du bist nicht allein."
	},
	"neugier,neugier": {
		name: "Wissensdurst",
		emoji: "📚",
		color: "#22d3ee",
		text: "Du willst alles wissen! Die Welt hat keine Geheimnisse vor dir. Frag Löcher in den Bauch!"
	},
	"mudigkeit,mudigkeit": {
		name: "Tiefschlaf",
		emoji: "😴",
		color: "#475569",
		text: "Dein Akku ist leer. Zeit für das Land der Träume. Gute Nacht!"
	},
	"ekel,ekel": {
		name: "Ekelpaket",
		emoji: "🤢",
		color: "#166534",
		text: "Das ist wirklich, wirklich bäh! Geh weg davon und such dir etwas Schönes zum Anschauen."
	},
	"uberraschung,uberraschung": {
		name: "Sprachlosigkeit",
		emoji: "😶",
		color: "#f472b6",
		text: "Da fehlen einem glatt die Worte! Manchmal ist Stille die beste Antwort auf ein Wunder."
	}
};
var dailyWisdoms = [
	{
		text: "Heute ist ein guter Tag, um jemanden anzulächeln.",
		prompt: "Wem hast du heute schon ein Lächeln geschenkt?"
	},
	{
		text: "Kleine Taten der Höflichkeit machen die Welt heller.",
		prompt: "Hast du heute schon 'Bitte' oder 'Danke' gesagt?"
	},
	{
		text: "Jeder von uns ist ein Puzzleteil in einem großen Ganzen.",
		prompt: "Was macht dich heute besonders einzigartig?"
	},
	{
		text: "Zuhören ist wie das Öffnen eines Geschenks.",
		prompt: "Wem hast du heute ganz aufmerksam zugehört?"
	},
	{
		text: "Es ist okay, Pausen zu machen, wenn man müde ist.",
		prompt: "Was hat dir heute geholfen, zur Ruhe zu kommen?"
	}
];
function LumisCorner() {
	const [dayIndex] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getDate() % dailyWisdoms.length);
	const wisdom = dailyWisdoms[dayIndex];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-10 py-12 text-center max-w-2xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				scale: .8,
				opacity: 0
			},
			animate: {
				scale: 1,
				opacity: 1
			},
			className: "relative bg-amber-50 p-10 rounded-[60px] border-8 border-white shadow-2xl watercolor-effect",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-amber-200 overflow-hidden p-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LumiSvg, { mood: "gentle" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-hand text-4xl text-amber-700 font-bold mb-6 mt-4",
					children: "Lumis sanfte Weisheit"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-hand text-3xl text-slate-700 leading-relaxed mb-8 italic",
					children: [
						"\"",
						wisdom.text,
						"\""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-amber-200 w-full mb-8" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-amber-600 font-bold mb-2",
					children: "Deine heutige Entdeckung:"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-600",
					children: wisdom.prompt
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
				whileHover: { scale: 1.05 },
				whileTap: { scale: .95 },
				className: "px-8 py-3 bg-white text-amber-600 rounded-full font-hand text-xl font-bold shadow-md border-2 border-amber-100",
				children: "Ich denke darüber nach..."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
				whileHover: { scale: 1.05 },
				whileTap: { scale: .95 },
				className: "px-8 py-3 bg-amber-500 text-white rounded-full font-hand text-xl font-bold shadow-md",
				children: "Fertig!"
			})]
		})]
	});
}
function EmotionAlchemy() {
	const [cauldron, setCauldron] = (0, import_react.useState)([]);
	const [result, setResult] = (0, import_react.useState)(null);
	const handleDrop = (emotion) => {
		if (cauldron.length >= 2) return;
		playPop();
		const newCauldron = [...cauldron, emotion];
		setCauldron(newCauldron);
		if (newCauldron.length === 2) {
			const combination = recipes[[newCauldron[0].id, newCauldron[1].id].sort().join(",")] || {
				name: "Gefühlschaos",
				emoji: "😵‍💫",
				color: "#cbd5e1",
				text: "Manche Gefühle sind schwer zu benennen, wenn sie sich mischen."
			};
			setTimeout(() => {
				setResult(combination);
				playSparkle();
			}, 800);
		}
	};
	const reset = () => {
		setCauldron([]);
		setResult(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-10 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-hand text-3xl font-bold text-slate-800",
					children: "Die Gefühls-Alchemie"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-xl text-slate-500",
					children: "Mische zwei einfache Gefühle, um komplexe zu verstehen!"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-6 p-6 bg-white/60 rounded-[40px] shadow-lg border-2 border-white max-w-3xl",
				children: basicEmotions.map((emo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					draggable: true,
					whileHover: { scale: 1.1 },
					onDragStart: (e) => e.dataTransfer.setData("text/plain", emo.id),
					className: "w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-inner border-4 border-white",
					style: { backgroundColor: emo.color },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-3xl md:text-4xl",
						children: emo.emoji
					})
				}, emo.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-80 h-80 rounded-[50px] border-8 border-slate-300 relative shadow-inner overflow-hidden flex items-center justify-center watercolor-effect transition-colors duration-1000",
				style: { backgroundColor: result ? result.color : "#f8fafc" },
				onDragOver: (e) => e.preventDefault(),
				onDrop: (e) => {
					const data = e.dataTransfer.getData("text/plain");
					const emo = basicEmotions.find((e) => e.id === data);
					if (emo) handleDrop(emo);
				},
				children: [
					!result && cauldron.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-hand text-xl text-slate-400 opacity-60 text-center px-4",
						children: "Zieh zwei Gefühle hier hinein!"
					}),
					!result && cauldron.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-4",
						children: cauldron.map((emo, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								y: -50,
								opacity: 0
							},
							animate: {
								y: 0,
								opacity: 1
							},
							className: "text-5xl",
							children: emo.emoji
						}, i))
					}),
					result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: { scale: 0 },
						animate: { scale: 1 },
						className: "flex flex-col items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-8xl wiggler",
							children: result.emoji
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-hand text-3xl font-bold text-slate-800 bg-white/50 px-4 py-1 rounded-full",
							children: result.name
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "bg-white p-8 rounded-[30px] border-2 border-slate-200 shadow-xl max-w-2xl text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-600 mb-6",
					children: result.text
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: reset,
					className: "px-8 py-3 bg-indigo-500 text-white rounded-xl font-bold font-hand text-xl hover:bg-indigo-600",
					children: "Nochmal mischen"
				})]
			}) })
		]
	});
}
var dilemmaScenarios = [
	{
		id: "turm",
		startNode: "start",
		nodes: {
			start: {
				text: "Du spielst mit den Bauklötzen. Plötzlich kommt Leo angerannt und stößt deinen riesigen Turm aus Versehen um.",
				choices: [
					{
						id: "c1",
						text: "Brüllen und ihn wegschubsen",
						next: "schubsen",
						color: "bg-red-400"
					},
					{
						id: "c2",
						text: "Tief durchatmen: 'Das ärgert mich!'",
						next: "reden",
						color: "bg-emerald-400"
					},
					{
						id: "c3",
						text: "Weinen und weglaufen",
						next: "weinen",
						color: "bg-blue-400"
					}
				]
			},
			schubsen: {
				text: "Du schubst Leo. Er fällt hin und weint auch. Jetzt seid ihr beide traurig und der Turm ist immer noch kaputt.",
				isEnd: true,
				success: false,
				wisdom: "Wut vergeht, aber wie wir andere behandeln, bleibt in Erinnerung."
			},
			reden: {
				text: "Leo schaut dich erschrocken an. 'Oje, das wollte ich nicht! Kann ich dir helfen, ihn wieder aufzubauen?'",
				choices: [{
					id: "c6",
					text: "Ja, lass uns zusammen bauen!",
					next: "zusammen",
					color: "bg-amber-400"
				}, {
					id: "c7",
					text: "Nein, ich will erst mal alleine sein.",
					next: "alleine",
					color: "bg-blue-300"
				}]
			},
			weinen: {
				text: "Du weinst leise. Leo kommt zu dir und legt eine Hand auf deine Schulter. 'Tut mir leid, wirklich.'",
				choices: [{
					id: "c8",
					text: "Ihm verzeihen",
					next: "zusammen",
					color: "bg-emerald-400"
				}]
			},
			zusammen: {
				text: "Zu zweit geht es viel schneller! Der neue Turm ist sogar noch schöner als der alte. Gemeinsam macht alles mehr Spaß.",
				isEnd: true,
				success: true,
				wisdom: "Zusammenarbeit verwandelt ein Missgeschick in ein gemeinsames Abenteuer."
			},
			alleine: {
				text: "Das ist okay. Manchmal braucht man Zeit für sich, um die Wut verrauchen zu lassen. Später fühlst du dich ruhiger.",
				isEnd: true,
				success: true,
				wisdom: "Es ist mutig zu sagen, wenn man eine Pause von anderen braucht."
			}
		}
	},
	{
		id: "apfel",
		startNode: "start",
		nodes: {
			start: {
				text: "Du hast einen wunderschönen, roten Apfel dabei. Dein Freund Elias hat sein Pausenbrot vergessen und sein Bauch knurrt ganz laut.",
				choices: [{
					id: "a1",
					text: "Den Apfel alleine essen",
					next: "alleine",
					color: "bg-red-400"
				}, {
					id: "a2",
					text: "Den Apfel teilen",
					next: "teilen",
					color: "bg-emerald-400"
				}]
			},
			teilen: {
				text: "Du brichst den Apfel in zwei Hälften. Elias Augen leuchten! 'Danke, du bist mein bester Freund!'",
				isEnd: true,
				success: true,
				wisdom: "Geteilte Freude ist doppelte Freude – und geteiltes Essen schmeckt doppelt so gut."
			},
			alleine: {
				text: "Du isst den Apfel, während Elias traurig zuschaut. Der Apfel schmeckt okay, aber irgendwie fühlt sich dein Bauch jetzt schwer an.",
				isEnd: true,
				success: false,
				wisdom: "Sich um andere zu kümmern, nährt auch das eigene Herz."
			}
		}
	},
	{
		id: "geheimnis",
		startNode: "start",
		nodes: {
			start: {
				text: "Sarah erzählt dir ein Geheimnis: Sie hat aus Versehen die schöne Vase der Lehrerin kaputt gemacht und sie unter dem Schrank versteckt.",
				choices: [
					{
						id: "g1",
						text: "Es für dich behalten",
						next: "behalten",
						color: "bg-slate-400"
					},
					{
						id: "g2",
						text: "Ihr raten, es ehrlich zu sagen",
						next: "ehrlich",
						color: "bg-emerald-400"
					},
					{
						id: "g3",
						text: "Es der Lehrerin petzen",
						next: "petzen",
						color: "bg-red-400"
					}
				]
			},
			behalten: {
				text: "Du behältst das Geheimnis. Aber jedes Mal, wenn du die Lehrerin ansiehst, hast du ein mulmiges Gefühl.",
				isEnd: true,
				success: false,
				wisdom: "Geheimnisse können schwer wie Steine im Rucksack werden."
			},
			ehrlich: {
				text: "Sarah traut sich und sagt es der Lehrerin. Die Lehrerin ist zwar traurig wegen der Vase, aber froh über Sarahs Ehrlichkeit.",
				isEnd: true,
				success: true,
				wisdom: "Ehrlichkeit braucht Mut, aber sie macht das Herz frei."
			},
			petzen: {
				text: "Die Lehrerin schimpft mit Sarah. Sarah ist jetzt wütend auf dich, weil du ihr Vertrauen gebrochen hast.",
				isEnd: true,
				success: false,
				wisdom: "Vertrauen ist eine kostbare Blume. Man muss sie vorsichtig pflegen."
			}
		}
	},
	{
		id: "vogel",
		startNode: "start",
		nodes: {
			start: {
				text: "Im Garten findest du einen kleinen Vogel, der aus dem Nest gefallen ist. Er piepst ganz leise und zittert.",
				choices: [
					{
						id: "v1",
						text: "Ihn ignorieren",
						next: "ignorieren",
						color: "bg-slate-400"
					},
					{
						id: "v2",
						text: "Einen Erwachsenen rufen",
						next: "helfen",
						color: "bg-emerald-400"
					},
					{
						id: "v3",
						text: "Ihn alleine füttern",
						next: "mitnehmen",
						color: "bg-amber-400"
					}
				]
			},
			ignorieren: {
				text: "Du spielst weiter, vergisst den Vogel aber nicht. Am Abend fragst du dich, wie es ihm wohl geht.",
				isEnd: true,
				success: false,
				wisdom: "Auch kleine Wesen brauchen unseren Schutz."
			},
			helfen: {
				text: "Die Erzieherin holt eine kleine Kiste und ruft beim Tierschutz an. Du hast dem Vogel das Leben gerettet!",
				isEnd: true,
				success: true,
				wisdom: "Helfen heißt, hinzuschauen, wenn andere in Not sind."
			},
			mitnehmen: {
				text: "Du gibst ihm Kekskrümel, aber er kann sie nicht essen. Ein Tierpfleger wäre besser gewesen.",
				isEnd: true,
				success: false,
				wisdom: "Gute Hilfe bedeutet auch, zu wissen, wann man Profis braucht."
			}
		}
	},
	{
		id: "team",
		startNode: "start",
		nodes: {
			start: {
				text: "Alle spielen fangen. Tom ist etwas langsamer als die anderen und wird immer als erster abgeschlagen. Einer ruft: 'Tom darf nicht mehr mitmachen!'",
				choices: [
					{
						id: "t1",
						text: "Nichts sagen und weiterspielen",
						next: "nichts",
						color: "bg-slate-400"
					},
					{
						id: "t2",
						text: "Sagen: 'Doch, jeder darf mitmachen!'",
						next: "alle",
						color: "bg-emerald-400"
					},
					{
						id: "t3",
						text: "Selbst rufen: 'Ja, Tom ist zu langsam!'",
						next: "gemein",
						color: "bg-red-400"
					}
				]
			},
			alle: {
				text: "Die anderen überlegen kurz. 'Na gut, dann ändern wir die Regeln ein bisschen.' Tom freut sich riesig, dass du für ihn eingestanden bist.",
				isEnd: true,
				success: true,
				wisdom: "Echte Helden sind die, die andere nicht ausschließen."
			},
			nichts: {
				text: "Tom geht traurig an den Rand und schaut euch zu. Du hast zwar Spaß beim Spielen, aber ein komisches Gefühl im Bauch.",
				isEnd: true,
				success: false,
				wisdom: "Schweigen kann manchmal auch wehtun."
			},
			gemein: {
				text: "Tom fängt an zu weinen und rennt weg. Jetzt ist die Stimmung im Spiel irgendwie kaputt.",
				isEnd: true,
				success: false,
				wisdom: "Worte können wie kleine Pfeile sein. Sei vorsichtig mit ihnen."
			}
		}
	}
];
function DilemmaEngine({ onCorrect, onWrong }) {
	const [scenarioIndex, setScenarioIndex] = (0, import_react.useState)(0);
	const [currentNodeId, setCurrentNodeId] = (0, import_react.useState)("start");
	const node = dilemmaScenarios[scenarioIndex].nodes[currentNodeId];
	const traverse = (nextId) => {
		playPop();
		setCurrentNodeId(nextId);
	};
	const handleFinish = (success) => {
		if (success) {
			onCorrect?.();
			playSparkle();
			confetti_module_default();
		} else {
			onWrong?.();
			playError();
		}
	};
	const reset = () => {
		playPop();
		setCurrentNodeId("start");
		setScenarioIndex((scenarioIndex + 1) % dilemmaScenarios.length);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-8 py-8 w-full max-w-3xl mx-auto min-h-[450px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-hand text-3xl font-bold text-slate-800",
				children: "Die Geschichten-Werkstatt"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-xl text-slate-500",
				children: "Jede Entscheidung verändert die Geschichte."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				scale: .9,
				y: 20
			},
			animate: {
				opacity: 1,
				scale: 1,
				y: 0
			},
			className: "w-full bg-white rounded-3xl p-8 border-4 border-slate-100 shadow-xl watercolor-effect text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-2xl text-slate-700 leading-relaxed mb-8",
				children: node.text
			}), node.isEnd ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `p-6 rounded-2xl ${node.success ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"} border-2 border-current items-center justify-center`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-hand text-2xl font-bold mb-2",
						children: "Lumis sanfter Rat:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-hand text-xl italic leading-relaxed",
						children: [
							"\"",
							node.wisdom,
							"\""
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						handleFinish(node.success);
						reset();
					},
					className: "px-8 py-3 bg-indigo-500 text-white rounded-xl font-bold font-hand text-xl hover:bg-indigo-600 transition-colors shadow-lg",
					children: "Nächste Geschichte"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col md:flex-row gap-4 justify-center",
				children: node.choices.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
					whileHover: { scale: 1.05 },
					whileTap: { scale: .95 },
					onClick: () => traverse(c.next),
					className: `flex-1 py-4 px-6 rounded-2xl ${c.color} text-white font-hand text-xl shadow-md border-b-4 border-black/20`,
					children: c.text
				}, c.id))
			})]
		}, `${scenarioIndex}-${currentNodeId}`)]
	});
}
var perspectives = [
	{
		id: "leo",
		name: "Leo",
		role: "Hat Turm umgestoßen",
		emoji: "🏃‍♂️",
		correctThought: "c1"
	},
	{
		id: "mia",
		name: "Mia",
		role: "Besitzerin des Turms",
		emoji: "👧",
		correctThought: "c2"
	},
	{
		id: "tom",
		name: "Tom",
		role: "Beobachter",
		emoji: "👀",
		correctThought: "c3"
	}
];
var thoughts = [
	{
		id: "c1",
		text: "Mist, ich habe gar nicht aufgepasst..."
	},
	{
		id: "c2",
		text: "Hey! Ich habe da so lange dran gebaut!"
	},
	{
		id: "c3",
		text: "Oh oh, gibt das jetzt wohl Streit?"
	}
];
function EmpathyRadar() {
	const [matches, setMatches] = (0, import_react.useState)({});
	const handleDrop = (charId, thoughtId) => {
		playPop();
		const newMatches = {
			...matches,
			[charId]: thoughtId
		};
		setMatches(newMatches);
		if (perspectives.every((p) => newMatches[p.id] === p.correctThought)) setTimeout(() => {
			playSparkle();
			confetti_module_default();
		}, 500);
	};
	const isWon = perspectives.every((p) => matches[p.id] === p.correctThought);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-8 py-8 w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-hand text-3xl font-bold text-slate-800",
					children: "Das Empathie-Radar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-xl text-slate-500",
					children: "Wer denkt was? Ordne die Gedankenblasen richtig zu."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col md:flex-row gap-6 w-full justify-center max-w-5xl",
				children: perspectives.map((p) => {
					const matchedThought = thoughts.find((t) => t.id === matches[p.id]);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex-1 min-h-[250px] p-6 rounded-3xl border-4 flex flex-col items-center shadow-lg transition-colors
                ${matchedThought ? matches[p.id] === p.correctThought ? "bg-emerald-50 border-emerald-300" : "bg-red-50 border-red-300" : "bg-white border-slate-200"}`,
						onDragOver: (e) => e.preventDefault(),
						onDrop: (e) => handleDrop(p.id, e.dataTransfer.getData("text/plain")),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-6xl mb-2",
								children: p.emoji
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-hand text-2xl font-bold text-slate-800",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-sans font-medium uppercase tracking-wider text-slate-400 mb-6",
								children: p.role
							}),
							matchedThought ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white p-4 rounded-xl shadow-sm text-center font-hand text-lg border-2 border-slate-100",
								children: [
									"💭 \"",
									matchedThought.text,
									"\""
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full py-8 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 font-hand",
								children: "Gedanke hier ablegen"
							})
						]
					}, p.id);
				})
			}),
			!isWon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-4 mt-4 bg-white/60 p-6 rounded-[30px] border-2 border-white shadow-md",
				children: thoughts.map((t) => {
					if (perspectives.some((p) => matches[p.id] === t.id && p.correctThought === t.id)) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						draggable: true,
						whileHover: { scale: 1.05 },
						onDragStart: (e) => e.dataTransfer.setData("text/plain", t.id),
						className: "bg-white p-4 rounded-2xl cursor-grab shadow-md border-2 border-indigo-100 font-hand text-lg",
						children: [
							"💭 \"",
							t.text,
							"\""
						]
					}, t.id);
				})
			}),
			isWon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: { scale: 0 },
				animate: { scale: 1 },
				className: "mt-4 font-hand text-2xl font-bold text-emerald-600 bg-emerald-100 px-8 py-4 rounded-full border-4 border-emerald-300",
				children: "Fantastisch! Du hast dich wunderbar in alle hineinversetzt."
			})
		]
	});
}
var reflectionCards = [
	{
		id: 1,
		question: "Wie war mein Tag heute?",
		options: [
			"Sonnig und hell",
			"Ein bisschen bewölkt",
			"Stürmisch"
		],
		color: "bg-amber-100"
	},
	{
		id: 2,
		question: "Habe ich heute jemanden zum Lächeln gebracht?",
		options: [
			"Ja, das war toll!",
			"Ich glaube schon",
			"Morgen probiere ich es!"
		],
		color: "bg-emerald-100"
	},
	{
		id: 3,
		question: "Gab es etwas, das mich traurig gemacht hat?",
		options: [
			"Ja, aber es ist okay",
			"Nein, alles gut",
			"Ich brauche noch einen Drücker"
		],
		color: "bg-sky-100"
	},
	{
		id: 4,
		question: "Was habe ich heute Neues gelernt?",
		options: [
			"Ganz viel!",
			"Ein kleines bisschen",
			"Ich habe nur gespielt (das ist auch lernen!)"
		],
		color: "bg-purple-100"
	}
];
function MirrorOfTruth() {
	const [currentCard, setCurrentCard] = (0, import_react.useState)(0);
	const [selections, setSelections] = (0, import_react.useState)({});
	const handleSelect = (option) => {
		playPop();
		setSelections({
			...selections,
			[currentCard]: option
		});
		if (currentCard < reflectionCards.length - 1) setTimeout(() => setCurrentCard(currentCard + 1), 600);
		else setTimeout(() => {
			playSparkle();
			confetti_module_default();
		}, 500);
	};
	const card = reflectionCards[currentCard];
	const isFinished = Object.keys(selections).length === reflectionCards.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-8 py-8 w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-hand text-3xl font-bold text-slate-800",
				children: "Der Spiegel der Wahrheit"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-xl text-slate-500",
				children: "Schau in dein Herz und entdecke deine Wahrheit."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
			mode: "wait",
			children: !isFinished ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					x: 50
				},
				animate: {
					opacity: 1,
					x: 0
				},
				exit: {
					opacity: 0,
					x: -50
				},
				className: `w-full max-w-xl p-10 rounded-[40px] border-8 border-white shadow-2xl ${card.color} watercolor-effect text-center`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "font-hand text-3xl text-slate-800 font-bold mb-10",
					children: card.question
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-4",
					children: card.options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
						whileHover: {
							scale: 1.02,
							x: 10
						},
						whileTap: { scale: .98 },
						onClick: () => handleSelect(opt),
						className: "bg-white/80 backdrop-blur-sm p-6 rounded-2xl text-left font-hand text-xl text-slate-700 shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-white",
						children: ["✨ ", opt]
					}, opt))
				})]
			}, currentCard) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					scale: .8
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				className: "w-full max-w-2xl bg-white p-12 rounded-[50px] border-8 border-amber-100 shadow-2xl text-center watercolor-effect",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-32 h-32 mx-auto mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LumiSvg, { mood: "happy" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-hand text-4xl text-amber-700 font-bold mb-6",
						children: "Dein Kristallklares Herz"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-hand text-2xl text-slate-600 leading-relaxed mb-10",
						children: "Du hast heute mutig in dich hineingeschaut. Jedes Gefühl ist ein Teil von dir, und das ist wunderbar!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setCurrentCard(0);
							setSelections({});
						},
						className: "px-10 py-4 bg-amber-500 text-white rounded-2xl font-hand text-2xl shadow-lg hover:bg-amber-600 transition-transform hover:scale-105",
						children: "Nochmal hineinschauen"
					})
				]
			})
		})]
	});
}
var tools = [
	{
		id: "brullen",
		name: "Brüllen",
		val: 3,
		color: "bg-red-400",
		emoji: "🗣️"
	},
	{
		id: "weglaufen",
		name: "Weglaufen",
		val: 1,
		color: "bg-orange-400",
		emoji: "🏃"
	},
	{
		id: "zuhoren",
		name: "Aktiv Zuhören",
		val: -3,
		color: "bg-sky-400",
		emoji: "👂"
	},
	{
		id: "ich-botschaft",
		name: "Ich-Botschaft senden",
		val: -2,
		color: "bg-emerald-400",
		emoji: "💌"
	}
];
function ConflictKnot() {
	const [tension, setTension] = (0, import_react.useState)(5);
	const [msg, setMsg] = (0, import_react.useState)("Zieh ein Werkzeug auf den Knoten!");
	const handleDrop = (toolId) => {
		const tool = tools.find((t) => t.id === toolId);
		if (!tool) return;
		let newT = Math.min(10, Math.max(0, tension + tool.val));
		setTension(newT);
		if (tool.val > 0) {
			playError();
			setMsg(`"${tool.name}" zieht den Knoten fester!`);
		} else {
			playPop();
			setMsg(`"${tool.name}" entspannt den Knoten.`);
			if (newT === 0) setTimeout(() => {
				playSparkle();
				confetti_module_default();
				setMsg("Frieden! Alle Knoten sind gelöst.");
			}, 300);
		}
	};
	const knotScale = 1 + tension / 10;
	const knotColor = tension > 7 ? "#ef4444" : tension < 3 ? "#4ade80" : "#fbbf24";
	const knotRotate = tension > 7 ? [
		0,
		-5,
		5,
		-5,
		5,
		0
	] : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col lg:flex-row items-center justify-center gap-12 py-8 w-full max-w-5xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full lg:w-1/2 flex flex-col items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-hand text-3xl font-bold text-slate-800 mb-2",
					children: "Der Konflikt-Knoten"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-xl text-slate-500 mb-8 h-8",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-80 h-80 bg-white/50 rounded-full border-8 border-white shadow-xl flex items-center justify-center relative overflow-hidden watercolor-effect",
					onDragOver: (e) => e.preventDefault(),
					onDrop: (e) => handleDrop(e.dataTransfer.getData("text/plain")),
					children: tension === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: { scale: 0 },
						animate: { scale: 1 },
						className: "text-8xl wiggler",
						children: "🕊️"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						animate: {
							scale: knotScale,
							rotate: knotRotate
						},
						transition: { duration: .3 },
						className: "w-24 h-24 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] shadow-2xl flex items-center justify-center text-5xl",
						style: {
							backgroundColor: knotColor,
							transition: "background-color 0.5s ease"
						},
						children: "🧶"
					})
				}),
				tension === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setTension(5);
						setMsg("Ein neuer Konflikt!");
					},
					className: "mt-6 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-hand text-xl font-bold",
					children: "Neuer Konflikt"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full lg:w-1/2 bg-white/60 p-8 rounded-[40px] border-4 border-white shadow-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "font-hand text-2xl font-bold mb-6 text-slate-700",
				children: "Kommunikations-Werkzeuge"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-4",
				children: tools.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					draggable: true,
					whileHover: { scale: 1.05 },
					onDragStart: (e) => e.dataTransfer.setData("text/plain", t.id),
					className: `flex items-center gap-4 p-4 rounded-2xl cursor-grab shadow-md text-white font-hand text-xl font-bold ${t.color}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-3xl bg-white/20 w-12 h-12 flex items-center justify-center rounded-full shadow-inner",
						children: t.emoji
					}), t.name]
				}, t.id))
			})]
		})]
	});
}
function WaageDerFairness() {
	const [leftApples, setLeftApples] = (0, import_react.useState)(5);
	const [rightApples, setRightApples] = (0, import_react.useState)(1);
	const [isWon, setIsWon] = (0, import_react.useState)(false);
	const targetApples = 6 / 2;
	const angle = (rightApples - leftApples) * 4;
	const moveApple = (fromDir) => {
		if (isWon) return;
		playPop();
		if (fromDir === "left" && leftApples > 0) {
			setLeftApples((l) => l - 1);
			setRightApples((r) => r + 1);
		} else if (fromDir === "right" && rightApples > 0) {
			setRightApples((r) => r - 1);
			setLeftApples((l) => l + 1);
		}
		if (fromDir === "left" && leftApples - 1 === targetApples || fromDir === "right" && rightApples - 1 === targetApples) setTimeout(() => {
			playSparkle();
			setIsWon(true);
			confetti_module_default();
		}, 500);
	};
	const reset = () => {
		playPop();
		setIsWon(false);
		setLeftApples(5);
		setRightApples(1);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-8 py-8 w-full max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-hand text-4xl font-bold text-slate-800",
					children: "Waage der Gerechtigkeit"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-xl text-slate-500",
					children: "Klicke auf die Äpfel, um sie gerecht zu verteilen."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full h-[400px] flex items-end justify-center pb-12 mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-12 w-8 h-40 bg-slate-300 rounded-t-full border-4 border-slate-400 z-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					animate: { rotate: angle },
					transition: {
						type: "spring",
						stiffness: 50,
						damping: 10
					},
					className: "absolute bottom-48 w-3/4 h-6 bg-amber-700 rounded-full z-20 origin-center flex justify-between px-4 items-center shadow-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 rounded-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-1 h-32 bg-slate-400 -top-0 -left-0 origin-top rotate-12" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-1 h-32 bg-slate-400 -top-0 -right-0 origin-top -rotate-12" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => moveApple("left"),
									className: "absolute top-32 -left-16 w-32 h-16 bg-amber-100 rounded-[50px] border-4 border-amber-300 shadow-md flex justify-center items-end pb-2 cursor-pointer hover:bg-amber-200 transition-colors",
									style: { transform: `rotate(${-angle}deg)` },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap justify-center w-24 gap-1",
										children: Array.from({ length: leftApples }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
											layout: true,
											className: "text-3xl drop-shadow-sm",
											children: "🍎"
										}, i))
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-1 h-32 bg-slate-400 -top-0 -left-0 origin-top rotate-12" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-1 h-32 bg-slate-400 -top-0 -right-0 origin-top -rotate-12" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => moveApple("right"),
									className: "absolute top-32 -left-16 w-32 h-16 bg-amber-100 rounded-[50px] border-4 border-amber-300 shadow-md flex justify-center items-end pb-2 cursor-pointer hover:bg-amber-200 transition-colors",
									style: { transform: `rotate(${-angle}deg)` },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap justify-center w-24 gap-1",
										children: Array.from({ length: rightApples }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
											layout: true,
											className: "text-3xl drop-shadow-sm",
											children: "🍎"
										}, i))
									})
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: isWon && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: { scale: 0 },
				animate: { scale: 1 },
				className: "flex flex-col items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-emerald-100 text-emerald-700 px-8 py-4 rounded-3xl font-hand text-2xl font-bold border-4 border-emerald-300",
					children: "Perfekt! Beide haben gleich viel. Das ist fair!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: reset,
					className: "px-6 py-2 bg-emerald-500 text-white rounded-full font-hand text-xl hover:bg-emerald-600",
					children: "Nochmal spielen"
				})]
			}) })
		]
	});
}
var KOMPLIMENTE = [
	{
		text: "Du bist nett!",
		isGood: true
	},
	{
		text: "Lass mich in Ruhe!",
		isGood: false
	},
	{
		text: "Du kannst das gut!",
		isGood: true
	},
	{
		text: "Das ist dumm.",
		isGood: false
	},
	{
		text: "Ich spiele gern mit dir.",
		isGood: true
	}
];
function KomplimenteWolke() {
	const [cloudLevel, setCloudLevel] = (0, import_react.useState)(0);
	const [words, setWords] = (0, import_react.useState)(KOMPLIMENTE.map((w, index) => ({
		...w,
		id: index
	})));
	const handleDrop = (id) => {
		const word = words.find((w) => w.id === parseInt(id));
		if (!word) return;
		if (word.isGood) {
			playSparkle();
			setCloudLevel(Math.min(3, cloudLevel + 1));
			if (cloudLevel + 1 === 3) confetti_module_default();
		} else {
			playError();
			setCloudLevel(Math.max(0, cloudLevel - 1));
		}
		setWords(words.filter((w) => w.id !== word.id));
	};
	const getCloudStyle = () => {
		switch (cloudLevel) {
			case 0: return {
				color: "bg-slate-400",
				emoji: "🌧️",
				scale: 1
			};
			case 1: return {
				color: "bg-sky-300",
				emoji: "⛅",
				scale: 1.1
			};
			case 2: return {
				color: "bg-yellow-200",
				emoji: "☀️",
				scale: 1.2
			};
			case 3: return {
				color: "bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400",
				emoji: "🌈",
				scale: 1.3
			};
			default: return {
				color: "bg-slate-400",
				emoji: "🌧️",
				scale: 1
			};
		}
	};
	const style = getCloudStyle();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-8 py-8 w-full max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-hand text-4xl font-bold text-slate-800",
					children: "Die Komplimente-Wolke"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-xl text-slate-500",
					children: "Ziehe nette Worte auf die Wolke, um sie froh zu machen."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row gap-12 w-full justify-center items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					animate: { scale: style.scale },
					className: `w-64 h-64 rounded-[50px] shadow-xl flex items-center justify-center text-8xl border-8 border-white ${style.color}`,
					onDragOver: (e) => e.preventDefault(),
					onDrop: (e) => handleDrop(e.dataTransfer.getData("text")),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
						animate: { y: [
							0,
							-10,
							0
						] },
						transition: {
							repeat: Infinity,
							duration: 2
						},
						children: style.emoji
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: words.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							x: 20
						},
						animate: {
							opacity: 1,
							x: 0
						},
						exit: {
							opacity: 0,
							scale: 0
						},
						draggable: true,
						onDragStart: (e) => e.dataTransfer.setData("text", w.id),
						className: "bg-white/80 backdrop-blur-sm p-4 rounded-full border-4 border-white shadow-md font-hand text-2xl font-bold text-slate-700 cursor-grab active:cursor-grabbing hover:scale-105",
						children: [
							"💧 \"",
							w.text,
							"\""
						]
					}, w.id)) }), words.length === 0 && cloudLevel < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-hand text-xl text-slate-400",
						children: "Keine Worte mehr da."
					})]
				})]
			}),
			cloudLevel === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: { scale: 0 },
				animate: { scale: 1 },
				className: "mt-8 bg-pink-100 text-pink-700 px-8 py-4 rounded-3xl font-hand text-2xl font-bold border-4 border-pink-300",
				children: "Wundervoll! Nette Worte können einen ganzen Tag erhellen."
			})
		]
	});
}
function EthikModule({ onCorrect = () => {}, onWrong = () => {} }) {
	const [activeTab, setActiveTab] = (0, import_react.useState)("himmelwelt");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-12 w-full max-w-6xl mx-auto pb-20 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-6xl font-bold text-slate-800 tracking-tight",
					children: "Miteinander & Welt"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 italic",
					children: "Entdecke die Magie der Gefühle und der Freundschaft."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-3 bg-white/40 p-3 rounded-[40px] shadow-inner backdrop-blur-sm border-2 border-white max-w-4xl mx-auto",
				children: [
					{
						id: "himmelwelt",
						name: "Himmelswelt",
						icon: "🌤️",
						color: "bg-sky-500"
					},
					{
						id: "arcade",
						name: "Arcade-Welt",
						icon: "🎮",
						color: "bg-orange-500"
					},
					{
						id: "sinn",
						name: "Denk-Abenteuer",
						icon: "🧭",
						color: "bg-slate-900"
					},
					{
						id: "alchemy",
						name: "Gefühls-Mixer",
						icon: "🧪",
						color: "bg-fuchsia-400"
					},
					{
						id: "ruhe",
						name: "Ruhe-Insel",
						icon: "🏝️",
						color: "bg-teal-400"
					},
					{
						id: "grenzen",
						name: "Grenzen",
						icon: "✋",
						color: "bg-rose-400"
					},
					{
						id: "dilemma",
						name: "Geschichten",
						icon: "📖",
						color: "bg-amber-400"
					},
					{
						id: "radar",
						name: "Gedanken-Radar",
						icon: "🧠",
						color: "bg-emerald-400"
					},
					{
						id: "knot",
						name: "Konflikt-Knoten",
						icon: "🧶",
						color: "bg-rose-400"
					},
					{
						id: "mirror",
						name: "Spiegel",
						icon: "🪞",
						color: "bg-sky-400"
					},
					{
						id: "lumi",
						name: "Lumis Rat",
						icon: "🦊",
						color: "bg-orange-400"
					},
					{
						id: "waage",
						name: "Fairness-Waage",
						icon: "⚖️",
						color: "bg-indigo-400"
					},
					{
						id: "wolke",
						name: "Komplimente",
						icon: "⛅",
						color: "bg-pink-400"
					},
					{
						id: "spielwelt",
						name: "Spielwelt",
						icon: "🎲",
						color: "bg-fuchsia-500"
					},
					{
						id: "quest",
						name: "Quest-Mixer",
						icon: "🧭",
						color: "bg-emerald-500"
					},
					{
						id: "premium",
						name: "Premium-Atelier",
						icon: "✨",
						color: "bg-amber-500"
					},
					{
						id: "action",
						name: "Herz-Fangspiel",
						icon: "💫",
						color: "bg-orange-500"
					},
					{
						id: "varianten",
						name: "Mega-Auswahl",
						icon: "🧭",
						color: "bg-slate-800"
					}
				].map((tab) => {
					const isActive = activeTab === tab.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
						onClick: () => {
							playPop();
							setActiveTab(tab.id);
						},
						whileHover: { scale: 1.05 },
						whileTap: { scale: .95 },
						className: `flex items-center gap-3 px-8 py-4 rounded-[30px] font-hand text-2xl font-bold transition-all shadow-md 
                ${isActive ? `${tab.color} text-white scale-105 ring-4 ring-white` : "bg-white text-slate-400 hover:text-slate-600"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl",
							children: tab.icon
						}), tab.name]
					}, tab.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white/60 backdrop-blur-2xl rounded-[60px] p-10 border-8 border-white shadow-3xl relative overflow-hidden min-h-[600px] watercolor-effect",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					mode: "wait",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							y: -20
						},
						transition: {
							duration: .4,
							ease: "backOut"
						},
						children: [
							activeTab === "himmelwelt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[620px] rounded-[34px] bg-sky-100/80 border-4 border-white shadow-lg" }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkyWonderland, {
									title: "Herz-Himmel",
									onCorrect,
									onWrong
								})
							}),
							activeTab === "arcade" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[660px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearningArcade, {
									subject: "ethik",
									onCorrect,
									onWrong
								})
							}),
							activeTab === "sinn" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[640px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeepLearningQuest, {
									subject: "ethik",
									onCorrect,
									onWrong
								})
							}),
							activeTab === "lumi" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LumisCorner, {}),
							activeTab === "alchemy" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmotionAlchemy, {}),
							activeTab === "ruhe" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuheInsel, {
								onCorrect,
								onWrong
							}),
							activeTab === "grenzen" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrenzenGarten, {
								onCorrect,
								onWrong
							}),
							activeTab === "dilemma" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DilemmaEngine, {
								onCorrect,
								onWrong
							}),
							activeTab === "radar" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmpathyRadar, {}),
							activeTab === "knot" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConflictKnot, {}),
							activeTab === "mirror" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MirrorOfTruth, {}),
							activeTab === "waage" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WaageDerFairness, {}),
							activeTab === "wolke" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KomplimenteWolke, {}),
							activeTab === "spielwelt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameWorld, {
								title: "Miteinander-Spielwelt",
								intro: "Acht Spielarten für Gefühle, Grenzen, Fairness, Trost, Konflikte und tiefe Fragen.",
								collections: SUBJECT_VARIANT_CONTENT.ethik,
								accent: "bg-fuchsia-500",
								scene: "heart",
								onCorrect,
								onWrong
							}),
							activeTab === "quest" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestMixer, {
								title: "Miteinander-Quest-Mixer",
								intro: "Expedition, Puzzle, Sternenlauf und Kartenwirbel für Gefühle, Grenzen, Trost und achtsame Tiefe.",
								collections: SUBJECT_VARIANT_CONTENT.ethik,
								accent: "bg-emerald-500",
								onCorrect,
								onWrong
							}),
							activeTab === "premium" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[360px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubjectPremiumAtelier, {
									subject: "ethik",
									onCorrect,
									onWrong
								})
							}),
							activeTab === "action" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionArena, {
								title: "Herz-Fangspiel",
								intro: "Fang hilfreiche Antworten für Gefühle, Grenzen und Miteinander.",
								collections: SUBJECT_VARIANT_CONTENT.ethik,
								accent: "bg-fuchsia-500",
								onCorrect,
								onWrong
							}),
							activeTab === "varianten" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VariantStudio, {
								title: "Miteinander-Mega-Auswahl",
								intro: "Viele kurze Situationskarten für Gefühle, Grenzen, Fairness, Trost, Konflikte und tiefe Fragen.",
								collections: SUBJECT_VARIANT_CONTENT.ethik,
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
export { EthikModule as default };
