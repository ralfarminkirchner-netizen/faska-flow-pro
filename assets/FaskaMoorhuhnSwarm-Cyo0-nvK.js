import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { a as useFrame, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as create } from "./react-B1iXS_n6.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { t as PointerLockControls } from "./PointerLockControls-LuZl7kld.js";
import { t as Text } from "./Text-CuphjnHx.js";
//#region src/components/games/engines/FaskaMoorhuhnSwarm/GameLogic.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var WORD_GROUPS = [
	{
		name: "Früchte",
		words: [
			"Apfel",
			"Banane",
			"Kirsche",
			"Birne",
			"Orange",
			"Traube",
			"Melone",
			"Pfirsich",
			"Kiwi"
		]
	},
	{
		name: "Fahrzeuge",
		words: [
			"Auto",
			"Bus",
			"Fahrrad",
			"Zug",
			"Flugzeug",
			"Schiff",
			"LKW",
			"Traktor",
			"Roller"
		]
	},
	{
		name: "Tiere",
		words: [
			"Hund",
			"Katze",
			"Maus",
			"Elefant",
			"Tiger",
			"Bär",
			"Löwe",
			"Vogel",
			"Pferd"
		]
	},
	{
		name: "Möbel",
		words: [
			"Stuhl",
			"Tisch",
			"Bett",
			"Schrank",
			"Sofa",
			"Regal",
			"Sessel",
			"Hocker"
		]
	},
	{
		name: "Kleidung",
		words: [
			"Hose",
			"Hemd",
			"Schuh",
			"Jacke",
			"Hut",
			"Socke",
			"Kleid",
			"Pullover",
			"Mütze"
		]
	},
	{
		name: "Berufe",
		words: [
			"Arzt",
			"Lehrer",
			"Bäcker",
			"Maler",
			"Koch",
			"Bauer",
			"Polizist",
			"Friseur",
			"Pilot"
		]
	}
];
var useGameStore = create((set, get) => ({
	score: 0,
	targets: [],
	instruction: "Finde das unpassende Wort!",
	hitTarget: (id, isOdd) => set((state) => {
		const newTargets = state.targets.filter((t) => t.id !== id);
		if (isOdd) {
			setTimeout(() => get().startWave(), 1500);
			return {
				score: state.score + 10,
				targets: newTargets.map((t) => ({
					...t,
					fleeing: true
				}))
			};
		} else return {
			score: Math.max(0, state.score - 5),
			targets: newTargets
		};
	}),
	startWave: () => {
		const mainGroupIdx = Math.floor(Math.random() * WORD_GROUPS.length);
		let oddGroupIdx = Math.floor(Math.random() * WORD_GROUPS.length);
		while (oddGroupIdx === mainGroupIdx) oddGroupIdx = Math.floor(Math.random() * WORD_GROUPS.length);
		const mainGroup = WORD_GROUPS[mainGroupIdx];
		const oddGroup = WORD_GROUPS[oddGroupIdx];
		const shuffle = (array) => [...array].sort(() => .5 - Math.random());
		const mainWords = shuffle(mainGroup.words).slice(0, 4);
		const oddWord = shuffle(oddGroup.words)[0];
		set({ targets: shuffle([...mainWords.map((w) => ({
			word: w,
			isOdd: false
		})), {
			word: oddWord,
			isOdd: true
		}]).map((item, i) => ({
			id: `target_${Date.now()}_${i}`,
			word: item.word,
			isOdd: item.isOdd,
			position: [
				(Math.random() - .5) * 40,
				Math.random() * 10 + 5,
				-(Math.random() * 20 + 20)
			],
			speed: (Math.random() * 2 + 2) * (Math.random() > .5 ? 1 : -1),
			fleeing: false
		})) });
	}
}));
//#endregion
//#region src/components/games/engines/FaskaMoorhuhnSwarm/World.jsx
var import_jsx_runtime = require_jsx_runtime();
var Target = ({ id, word, isOdd, position, speed, fleeing }) => {
	const ref = (0, import_react.useRef)();
	const hitTarget = useGameStore((state) => state.hitTarget);
	const [color] = (0, import_react.useState)(() => [
		"#ff4444",
		"#44ff44",
		"#4444ff",
		"#ffff44",
		"#ff44ff",
		"#44ffff",
		"#ff9900"
	][Math.floor(Math.random() * 7)]);
	useFrame((state, delta) => {
		if (ref.current) {
			ref.current.position.x += speed * delta * (fleeing ? 3 : 1);
			if (!fleeing) ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3 + position[0]) * 1.5;
			if (ref.current.position.x > 50) ref.current.position.x = -50;
			if (ref.current.position.x < -50) ref.current.position.x = 50;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref,
		position,
		onClick: () => hitTarget(id, isOdd),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
			type: "kinematicPosition",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						2,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						1.5,
						16,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						-.5,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						1.5,
						1,
						1
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8B4513" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.5,
						.75,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.02,
						.02,
						1.5
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "black" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.5,
						.75,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.02,
						.02,
						1.5
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "black" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						-.5,
						.6
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						3,
						1,
						.1
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "white" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						0,
						-.5,
						.66
					],
					fontSize: .5,
					color: "black",
					anchorX: "center",
					anchorY: "middle",
					children: word
				})
			]
		})
	});
};
var World = () => {
	const targets = useGameStore((state) => state.targets);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, { sunPosition: [
			100,
			20,
			100
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				10,
				10,
				10
			],
			intensity: 1
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				-5,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1e3, 1e3] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#228B22" })]
		}),
		targets.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { ...t }, t.id))
	] });
};
//#endregion
//#region src/components/games/engines/FaskaMoorhuhnSwarm/Player.jsx
var Player = () => {
	useFrame(() => {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PointerLockControls, {}) });
};
//#endregion
//#region src/components/games/engines/FaskaMoorhuhnSwarm/UIOverlay.jsx
var UIOverlay = ({ onExit }) => {
	const score = useGameStore((state) => state.score);
	const instruction = useGameStore((state) => state.instruction);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			pointerEvents: "none",
			zIndex: 10
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "30px",
					height: "30px",
					border: "2px solid red",
					borderRadius: "50%"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						position: "absolute",
						top: "50%",
						left: "-10px",
						width: "10px",
						height: "2px",
						backgroundColor: "red"
					} }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						position: "absolute",
						top: "50%",
						right: "-10px",
						width: "10px",
						height: "2px",
						backgroundColor: "red"
					} }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						position: "absolute",
						top: "-10px",
						left: "50%",
						width: "2px",
						height: "10px",
						backgroundColor: "red"
					} }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						position: "absolute",
						bottom: "-10px",
						left: "50%",
						width: "2px",
						height: "10px",
						backgroundColor: "red"
					} })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 20,
					left: 20,
					fontSize: "32px",
					color: "white",
					fontWeight: "bold",
					textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
				},
				children: ["Punkte: ", score]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					top: 20,
					left: "50%",
					transform: "translateX(-50%)",
					backgroundColor: "rgba(0,0,0,0.5)",
					padding: "10px 20px",
					borderRadius: "10px",
					fontSize: "26px",
					color: "yellow",
					fontWeight: "bold"
				},
				children: instruction
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					top: "20px",
					right: "20px",
					pointerEvents: "auto",
					padding: "10px 20px",
					fontSize: "18px",
					fontWeight: "bold",
					backgroundColor: "#ff4444",
					color: "white",
					border: "3px solid #cc0000",
					borderRadius: "8px",
					cursor: "pointer",
					boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
					textTransform: "uppercase"
				},
				children: "Beenden"
			})
		]
	});
};
//#endregion
//#region src/components/games/engines/FaskaMoorhuhnSwarm/MobileJoystick.jsx
var MobileJoystick = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			position: "absolute",
			bottom: 20,
			left: 20,
			width: 100,
			height: 100,
			backgroundColor: "rgba(255,255,255,0.2)",
			borderRadius: "50%",
			pointerEvents: "auto",
			display: "none"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
			width: 40,
			height: 40,
			backgroundColor: "rgba(255,255,255,0.5)",
			borderRadius: "50%",
			position: "absolute",
			top: 30,
			left: 30
		} })
	});
};
//#endregion
//#region src/components/games/engines/FaskaMoorhuhnSwarm/FaskaMoorhuhnSwarm.jsx
var FaskaMoorhuhnSwarm = ({ onExit }) => {
	const startWave = useGameStore((state) => state.startWave);
	(0, import_react.useEffect)(() => {
		startWave();
	}, [startWave]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "800px",
			height: "600px",
			margin: "0 auto",
			overflow: "hidden",
			borderRadius: "10px",
			boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
			backgroundColor: "#87CEEB"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UIOverlay, { onExit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileJoystick, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
				camera: {
					position: [
						0,
						0,
						0
					],
					fov: 75
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {})] })
			})
		]
	});
};
//#endregion
export { FaskaMoorhuhnSwarm as default };
