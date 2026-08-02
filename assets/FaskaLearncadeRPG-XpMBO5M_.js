import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
import { t as create } from "./react-B1iXS_n6.js";
//#region src/components/games/engines/FaskaLearncadeRPG/GameLogic.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var useGameStore = create((set) => ({
	score: 0,
	activeNPC: null,
	joystickVector: {
		x: 0,
		y: 0
	},
	interactPressed: false,
	setActiveNPC: (npc) => set({ activeNPC: npc }),
	setJoystickVector: (vector) => set({ joystickVector: vector }),
	setInteractPressed: (pressed) => set({ interactPressed: pressed }),
	addScore: (points) => set((state) => ({ score: state.score + points }))
}));
//#endregion
//#region src/components/games/engines/FaskaLearncadeRPG/Player.jsx
function Player({ scene }) {
	const spriteRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!scene || !scene.playerGroup) return;
		const sprite = scene.playerGroup.create(400, 300, "player");
		sprite.setDisplaySize(48, 48);
		sprite.setCollideWorldBounds(true);
		sprite.setBounce(.1);
		spriteRef.current = sprite;
		const updateLoop = () => {
			const { joystickVector } = useGameStore.getState();
			const speed = 250;
			if (spriteRef.current && spriteRef.current.active) {
				spriteRef.current.setVelocityX(joystickVector.x * speed);
				spriteRef.current.setVelocityY(joystickVector.y * speed);
			}
		};
		scene.events.on("update", updateLoop);
		return () => {
			scene.events.off("update", updateLoop);
			if (spriteRef.current) spriteRef.current.destroy();
		};
	}, [scene]);
	return null;
}
//#endregion
//#region src/components/games/engines/FaskaLearncadeRPG/NPCs.jsx
function NPCs({ scene }) {
	(0, import_react.useEffect)(() => {
		if (!scene || !scene.npcGroup) return;
		const mathNPC = scene.npcGroup.create(200, 200, "math_npc");
		mathNPC.setImmovable(true);
		mathNPC.setDisplaySize(64, 64);
		const germanNPC = scene.npcGroup.create(600, 200, "german_npc");
		germanNPC.setImmovable(true);
		germanNPC.setDisplaySize(64, 64);
		const updateLoop = () => {
			const { interactPressed, activeNPC } = useGameStore.getState();
			if (interactPressed && !activeNPC && scene.playerGroup) {
				const player = scene.playerGroup.getChildren()[0];
				if (!player) return;
				const distMath = __webpack_exports__default.Math.Distance.Between(player.x, player.y, mathNPC.x, mathNPC.y);
				const distGerman = __webpack_exports__default.Math.Distance.Between(player.x, player.y, germanNPC.x, germanNPC.y);
				if (distMath < 100) {
					useGameStore.getState().setActiveNPC("math");
					useGameStore.getState().setInteractPressed(false);
				} else if (distGerman < 100) {
					useGameStore.getState().setActiveNPC("german");
					useGameStore.getState().setInteractPressed(false);
				}
			}
		};
		scene.events.on("update", updateLoop);
		return () => {
			scene.events.off("update", updateLoop);
			if (mathNPC) mathNPC.destroy();
			if (germanNPC) germanNPC.destroy();
		};
	}, [scene]);
	return null;
}
//#endregion
//#region src/components/games/engines/FaskaLearncadeRPG/World.jsx
var import_jsx_runtime = require_jsx_runtime();
function World() {
	const containerRef = (0, import_react.useRef)(null);
	const [scene, setScene] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!containerRef.current) return;
		class MainScene extends __webpack_exports__default.Scene {
			constructor() {
				super("MainScene");
			}
			preload() {
				this.load.image("grass", "/faska-flow-pro/textures/grass_platform.png");
				this.load.image("wall", "/faska-flow-pro/textures/castle_wall.png");
				this.load.image("player", "/faska-flow-pro/animal-friends/cutouts/luna-hase.png");
				this.load.image("math_npc", "/faska-flow-pro/animal-friends/cutouts/luna-hase.png");
				this.load.image("german_npc", "/faska-flow-pro/animal-friends/cutouts/bruno-baer.png");
			}
			create() {
				this.physics.world.setBounds(0, 0, 800, 600);
				for (let x = 0; x < 800; x += 64) for (let y = 0; y < 600; y += 64) this.add.image(x + 32, y + 32, "grass").setDisplaySize(64, 64);
				this.walls = this.physics.add.staticGroup();
				for (let x = 0; x <= 800; x += 64) {
					this.walls.create(x + 32, 32, "wall").setDisplaySize(64, 64).refreshBody();
					this.walls.create(x + 32, 568, "wall").setDisplaySize(64, 64).refreshBody();
				}
				for (let y = 0; y <= 600; y += 64) {
					this.walls.create(32, y + 32, "wall").setDisplaySize(64, 64).refreshBody();
					this.walls.create(768, y + 32, "wall").setDisplaySize(64, 64).refreshBody();
				}
				this.playerGroup = this.physics.add.group();
				this.npcGroup = this.physics.add.group();
				this.physics.add.collider(this.playerGroup, this.walls);
				this.physics.add.collider(this.playerGroup, this.npcGroup);
				setScene(this);
			}
		}
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 800,
			height: 600,
			parent: containerRef.current,
			transparent: true,
			physics: {
				default: "arcade",
				arcade: {
					gravity: { y: 0 },
					debug: false
				}
			},
			scene: [MainScene]
		};
		const game = new __webpack_exports__default.Game(config);
		return () => {
			game.destroy(true);
			setScene(null);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-center items-center w-full max-w-[800px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border-4 border-indigo-500/30 bg-black",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: containerRef,
			className: "w-full h-full"
		}), scene && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, { scene }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NPCs, { scene })] })]
	});
}
//#endregion
//#region src/components/games/engines/FaskaLearncadeRPG/MobileJoystick.jsx
function MobileJoystick() {
	const setJoystickVector = useGameStore((state) => state.setJoystickVector);
	const setInteractPressed = useGameStore((state) => state.setInteractPressed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute bottom-10 left-0 right-0 px-10 flex justify-between items-center pointer-events-none z-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-3 gap-2 pointer-events-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "w-16 h-16 bg-white/20 rounded-full active:bg-white/50 touch-none flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-colors",
					onTouchStart: () => setJoystickVector({
						x: 0,
						y: -1
					}),
					onTouchEnd: () => setJoystickVector({
						x: 0,
						y: 0
					}),
					onMouseDown: () => setJoystickVector({
						x: 0,
						y: -1
					}),
					onMouseUp: () => setJoystickVector({
						x: 0,
						y: 0
					}),
					onMouseLeave: () => setJoystickVector({
						x: 0,
						y: 0
					}),
					children: "↑"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "w-16 h-16 bg-white/20 rounded-full active:bg-white/50 touch-none flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-colors",
					onTouchStart: () => setJoystickVector({
						x: -1,
						y: 0
					}),
					onTouchEnd: () => setJoystickVector({
						x: 0,
						y: 0
					}),
					onMouseDown: () => setJoystickVector({
						x: -1,
						y: 0
					}),
					onMouseUp: () => setJoystickVector({
						x: 0,
						y: 0
					}),
					onMouseLeave: () => setJoystickVector({
						x: 0,
						y: 0
					}),
					children: "←"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "w-16 h-16 bg-white/20 rounded-full active:bg-white/50 touch-none flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-colors",
					onTouchStart: () => setJoystickVector({
						x: 0,
						y: 1
					}),
					onTouchEnd: () => setJoystickVector({
						x: 0,
						y: 0
					}),
					onMouseDown: () => setJoystickVector({
						x: 0,
						y: 1
					}),
					onMouseUp: () => setJoystickVector({
						x: 0,
						y: 0
					}),
					onMouseLeave: () => setJoystickVector({
						x: 0,
						y: 0
					}),
					children: "↓"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "w-16 h-16 bg-white/20 rounded-full active:bg-white/50 touch-none flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-colors",
					onTouchStart: () => setJoystickVector({
						x: 1,
						y: 0
					}),
					onTouchEnd: () => setJoystickVector({
						x: 0,
						y: 0
					}),
					onMouseDown: () => setJoystickVector({
						x: 1,
						y: 0
					}),
					onMouseUp: () => setJoystickVector({
						x: 0,
						y: 0
					}),
					onMouseLeave: () => setJoystickVector({
						x: 0,
						y: 0
					}),
					children: "→"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "w-24 h-24 bg-blue-500/50 hover:bg-blue-500/70 rounded-full active:bg-blue-500/90 touch-none border-4 border-white/20 text-white font-bold text-lg flex items-center justify-center shadow-2xl transition-colors",
				onTouchStart: () => setInteractPressed(true),
				onTouchEnd: () => setInteractPressed(false),
				onMouseDown: () => setInteractPressed(true),
				onMouseUp: () => setInteractPressed(false),
				onMouseLeave: () => setInteractPressed(false),
				children: "A"
			})
		})]
	});
}
//#endregion
//#region src/components/games/engines/FaskaLearncadeRPG/UIOverlay.jsx
function UIOverlay() {
	const { activeNPC, setActiveNPC, addScore } = useGameStore();
	const [question, setQuestion] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (activeNPC === "math") {
			const a = Math.floor(Math.random() * 10) + 1;
			const b = Math.floor(Math.random() * 10) + 1;
			setQuestion({
				text: `What is ${a} + ${b}?`,
				options: [
					a + b,
					a + b + 2,
					a + b - 1,
					a + b + 5
				].sort(() => Math.random() - .5),
				answer: a + b
			});
		} else if (activeNPC === "german") {
			const q = [
				{
					text: "Which article is correct for \"Hund\"?",
					options: [
						"der",
						"die",
						"das",
						"dem"
					],
					answer: "der"
				},
				{
					text: "Which article is correct for \"Katze\"?",
					options: [
						"der",
						"die",
						"das",
						"dem"
					],
					answer: "die"
				},
				{
					text: "Which article is correct for \"Auto\"?",
					options: [
						"der",
						"die",
						"das",
						"dem"
					],
					answer: "das"
				}
			];
			setQuestion(q[Math.floor(Math.random() * q.length)]);
		}
	}, [activeNPC]);
	const handleAnswer = (opt) => {
		if (opt === question.answer) {
			setFeedback("Correct!");
			addScore(10);
			setTimeout(() => {
				setFeedback("");
				setActiveNPC(null);
			}, 1500);
		} else setFeedback("Try again!");
	};
	if (!activeNPC || !question) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 bg-black/60 flex items-center justify-center z-50 p-4 pointer-events-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl max-w-md w-full shadow-2xl text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-3xl font-extrabold text-white mb-2 capitalize drop-shadow-md",
					children: [activeNPC, " Challenge"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xl text-blue-200 mb-8 font-medium",
					children: question.text
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4 mb-6",
					children: question.options.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleAnswer(opt),
						className: "py-4 bg-white/5 hover:bg-white/20 border border-white/10 rounded-xl text-white font-bold text-xl transition-all shadow-sm active:scale-95",
						children: opt
					}, i))
				}),
				feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `text-2xl font-bold mb-6 drop-shadow-md ${feedback === "Correct!" ? "text-green-400" : "text-red-400"}`,
					children: feedback
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setFeedback("");
						setActiveNPC(null);
					},
					className: "mt-4 px-10 py-3 bg-red-500/80 hover:bg-red-500 text-white rounded-full font-bold shadow-lg transition-all active:scale-95",
					children: "Exit"
				})
			]
		})
	});
}
//#endregion
//#region src/components/games/engines/FaskaLearncadeRPG/FaskaLearncadeRPG.jsx
function FaskaLearncadeRPG() {
	const activeNPC = useGameStore((state) => state.activeNPC);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full h-[100dvh] bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col items-center justify-center font-sans overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-8 left-8 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-xl z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-bold text-white tracking-wider",
					children: ["Score: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-yellow-400",
						children: useGameStore((state) => state.score)
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileJoystick, {}),
			activeNPC && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UIOverlay, {})
		]
	});
}
//#endregion
export { FaskaLearncadeRPG as default };
