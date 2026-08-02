import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, Tt as Shape, a as useFrame, s as useThree, t as Canvas, xt as RepeatWrapping } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as create } from "./react-B1iXS_n6.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as useTexture } from "./Texture-BOsfVZMl.js";
//#region src/components/games/engines/FaskaTonyHawkSwarm/GameLogic.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var useGameStore = create((set) => ({
	score: 0,
	timer: 60,
	streak: 0,
	question: null,
	feedback: null,
	addScore: (points) => set((state) => ({ score: state.score + points })),
	setStreak: (val) => set({ streak: val }),
	setQuestion: (q) => set({ question: q }),
	setFeedback: (f) => set({ feedback: f }),
	tickTimer: () => set((state) => ({ timer: Math.max(0, state.timer - 1) })),
	reset: () => set({
		score: 0,
		timer: 60,
		streak: 0,
		question: null,
		feedback: null
	})
}));
//#endregion
//#region src/components/games/engines/FaskaTonyHawkSwarm/Player.jsx
var import_jsx_runtime = require_jsx_runtime();
function Player({ isLearncade }) {
	const deckTexture = useTexture("/faska-flow-pro/textures/skate_deck.png");
	const bodyRef = (0, import_react.useRef)();
	const [keys, setKeys] = (0, import_react.useState)({});
	const { setQuestion, question } = useGameStore();
	const { camera } = useThree();
	(0, import_react.useEffect)(() => {
		const handleDown = (e) => setKeys((k) => ({
			...k,
			[e.key]: true
		}));
		const handleUp = (e) => setKeys((k) => ({
			...k,
			[e.key]: false
		}));
		window.addEventListener("keydown", handleDown);
		window.addEventListener("keyup", handleUp);
		return () => {
			window.removeEventListener("keydown", handleDown);
			window.removeEventListener("keyup", handleUp);
		};
	}, []);
	useFrame(() => {
		if (!bodyRef.current) return;
		try {
			const pos = bodyRef.current.translation();
			const linvel = bodyRef.current.linvel();
			let moveX = 0;
			if (keys["ArrowLeft"]) moveX = -15;
			if (keys["ArrowRight"]) moveX = 15;
			bodyRef.current.setLinvel({
				x: moveX || linvel.x,
				y: linvel.y,
				z: 0
			}, true);
			if (keys[" "] && Math.abs(linvel.y) < .2 && !question) {
				bodyRef.current.applyImpulse({
					x: 0,
					y: 12,
					z: 0
				}, true);
				setKeys((k) => ({
					...k,
					" ": false
				}));
				if (isLearncade) {
					const a = Math.floor(Math.random() * 5);
					const b = Math.floor(Math.random() * 5);
					setQuestion({
						a,
						b,
						op: "+",
						answer: a + b
					});
				}
			}
			camera.position.lerp(new Vector3(pos.x * .4, Math.max(8, pos.y + 4), 25), .1);
			camera.lookAt(pos.x * .4, Math.max(4, pos.y - 2), 0);
		} catch (err) {
			console.warn("Rapier translation error:", err);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: bodyRef,
		position: [
			0,
			5,
			0
		],
		colliders: "capsule",
		mass: 1,
		enabledTranslations: [
			true,
			true,
			false
		],
		lockRotations: true,
		friction: 0,
		restitution: 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				0,
				-.6,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						1,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.6,
						1.5,
						.4
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#00ffff" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						2,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [.3] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ffccaa" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.1,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						1.2,
						.1,
						.4
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						map: deckTexture,
						color: "#ffffff"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.4,
						0,
						.15
					],
					rotation: [
						Math.PI / 2,
						0,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.1,
						.1,
						.1
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ff00ff" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.4,
						0,
						.15
					],
					rotation: [
						Math.PI / 2,
						0,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.1,
						.1,
						.1
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ff00ff" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.4,
						0,
						-.15
					],
					rotation: [
						Math.PI / 2,
						0,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.1,
						.1,
						.1
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ff00ff" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.4,
						0,
						-.15
					],
					rotation: [
						Math.PI / 2,
						0,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.1,
						.1,
						.1
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ff00ff" })]
				})
			]
		})
	});
}
//#endregion
//#region src/components/games/engines/FaskaTonyHawkSwarm/World.jsx
var FLAT_WIDTH = 4;
var R = 8;
var MAX_X = FLAT_WIDTH + R;
function getRampY(x) {
	const ax = Math.abs(x);
	if (ax <= FLAT_WIDTH) return 0;
	if (ax >= MAX_X) return R;
	const xp = ax - FLAT_WIDTH;
	return R - Math.sqrt(R * R - xp * xp);
}
function World() {
	const concreteTexture = useTexture("/faska-flow-pro/textures/skate_concrete.png");
	concreteTexture.wrapS = concreteTexture.wrapT = RepeatWrapping;
	concreteTexture.repeat.set(4, 4);
	const shape = (0, import_react.useMemo)(() => {
		const s = new Shape();
		s.moveTo(-MAX_X - 2, R);
		for (let i = 0; i <= 30; i++) {
			const t = i / 30;
			const x = -MAX_X + t * R;
			const y = getRampY(x);
			s.lineTo(x, y);
		}
		s.lineTo(FLAT_WIDTH, 0);
		for (let i = 0; i <= 30; i++) {
			const x = FLAT_WIDTH + i / 30 * R;
			const y = getRampY(x);
			s.lineTo(x, y);
		}
		s.lineTo(MAX_X + 2, R);
		s.lineTo(MAX_X + 2, -2);
		s.lineTo(-MAX_X - 2, -2);
		s.lineTo(-MAX_X - 2, R);
		return s;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		rotation: [
			-Math.PI / 2,
			0,
			0
		],
		position: [
			0,
			-.1,
			0
		],
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [200, 200] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#0a0515" })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "fixed",
		colliders: "trimesh",
		position: [
			0,
			0,
			-5
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			receiveShadow: true,
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("extrudeGeometry", { args: [shape, {
				depth: 10,
				bevelEnabled: false
			}] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				map: concreteTexture,
				color: "#888888",
				roughness: .8
			})]
		})
	})] });
}
//#endregion
//#region src/components/games/engines/FaskaTonyHawkSwarm/UIOverlay.jsx
function UIOverlay({ onExit, isLearncade }) {
	const { score, timer, streak, question, feedback, tickTimer, setFeedback, addScore, setStreak, setQuestion } = useGameStore();
	(0, import_react.useEffect)(() => {
		const int = setInterval(tickTimer, 1e3);
		return () => clearInterval(int);
	}, [tickTimer]);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (!question) return;
			if (e.key >= "0" && e.key <= "9") {
				if (parseInt(e.key, 10) === question.answer) {
					setFeedback("RADICAL!");
					addScore(100 + streak * 50);
					setStreak(streak + 1);
				} else {
					setFeedback("WIPEOUT!");
					setStreak(0);
				}
				setQuestion(null);
				setTimeout(() => setFeedback(null), 1500);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		question,
		streak,
		addScore,
		setFeedback,
		setQuestion,
		setStreak
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: 20,
				left: 20,
				zIndex: 100,
				color: "#00ffff",
				fontFamily: "Impact, sans-serif"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					style: {
						margin: 0,
						fontSize: "48px",
						textShadow: "2px 2px 0 #ff00ff"
					},
					children: ["SCORE: ", score]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					style: {
						margin: 0,
						fontSize: "32px",
						color: streak > 2 ? "#ff00ff" : "#00ffff",
						textShadow: "2px 2px 0 #000"
					},
					children: ["STREAK: x", streak]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					style: {
						margin: 0,
						fontSize: "32px",
						textShadow: "2px 2px 0 #000"
					},
					children: ["TIME: ", timer]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				position: "absolute",
				top: 20,
				right: 20,
				zIndex: 100
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					padding: "12px 24px",
					fontSize: "20px",
					background: "#ff00ff",
					color: "white",
					border: "4px solid #00ffff",
					cursor: "pointer",
					fontFamily: "Impact, sans-serif"
				},
				children: "EXIT"
			})
		}),
		question && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: "40%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				zIndex: 100,
				color: "#00ffff",
				fontFamily: "Impact, sans-serif",
				textAlign: "center"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					fontSize: "96px",
					background: "rgba(0,0,0,0.8)",
					padding: "20px 40px",
					border: "4px solid #ff00ff",
					textShadow: "4px 4px 0 #ff00ff"
				},
				children: [
					question.a,
					" ",
					question.op,
					" ",
					question.b,
					" = ?"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					fontSize: "28px",
					color: "#fff",
					marginTop: "10px",
					textShadow: "2px 2px 0 #000"
				},
				children: "PRESS NUMBER KEY (0-9) TO LAND!"
			})]
		}),
		feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				position: "absolute",
				top: "60%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				zIndex: 100,
				color: feedback === "RADICAL!" ? "#00ffff" : "#ff00ff",
				fontFamily: "Impact, sans-serif",
				fontSize: "80px",
				textShadow: "4px 4px 0 #000"
			},
			children: feedback
		})
	] });
}
//#endregion
//#region src/components/games/engines/FaskaTonyHawkSwarm/MobileJoystick.jsx
function MobileJoystick() {
	const triggerKey = (key) => {
		window.dispatchEvent(new KeyboardEvent("keydown", { key }));
		setTimeout(() => {
			window.dispatchEvent(new KeyboardEvent("keyup", { key }));
		}, 100);
	};
	const startKey = (key) => {
		window.dispatchEvent(new KeyboardEvent("keydown", { key }));
	};
	const endKey = (key) => {
		window.dispatchEvent(new KeyboardEvent("keyup", { key }));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			bottom: 20,
			width: "100%",
			display: "flex",
			justifyContent: "space-between",
			padding: "0 40px",
			zIndex: 100,
			pointerEvents: "none"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				gap: "20px",
				pointerEvents: "auto"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onPointerDown: () => startKey("ArrowLeft"),
				onPointerUp: () => endKey("ArrowLeft"),
				onPointerLeave: () => endKey("ArrowLeft"),
				style: {
					padding: "20px 30px",
					fontSize: "24px",
					background: "rgba(255,0,255,0.7)",
					color: "#fff",
					border: "3px solid #00ffff",
					borderRadius: "10px",
					fontFamily: "Impact, sans-serif"
				},
				children: "LEFT"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onPointerDown: () => startKey("ArrowRight"),
				onPointerUp: () => endKey("ArrowRight"),
				onPointerLeave: () => endKey("ArrowRight"),
				style: {
					padding: "20px 30px",
					fontSize: "24px",
					background: "rgba(255,0,255,0.7)",
					color: "#fff",
					border: "3px solid #00ffff",
					borderRadius: "10px",
					fontFamily: "Impact, sans-serif"
				},
				children: "RIGHT"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: { pointerEvents: "auto" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onPointerDown: () => triggerKey(" "),
				style: {
					padding: "20px 50px",
					fontSize: "24px",
					background: "rgba(0,255,255,0.7)",
					color: "#fff",
					border: "3px solid #ff00ff",
					borderRadius: "10px",
					fontFamily: "Impact, sans-serif"
				},
				children: "OLLIE"
			})
		})]
	});
}
//#endregion
//#region src/components/games/engines/FaskaTonyHawkSwarm/FaskaTonyHawkSwarm.jsx
function FaskaTonyHawkSwarm({ onExit, isLearncade = true }) {
	const reset = useGameStore((s) => s.reset);
	(0, import_react.useEffect)(() => {
		reset();
	}, [reset]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100vw",
			height: "100vh",
			overflow: "hidden",
			background: "#1a0b2e",
			position: "relative"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UIOverlay, {
				onExit,
				isLearncade
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileJoystick, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
				shadows: true,
				camera: {
					position: [
						0,
						8,
						25
					],
					fov: 60
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Suspense, {
					fallback: null,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
							attach: "background",
							args: ["#1a0b2e"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .4 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
							position: [
								10,
								20,
								10
							],
							intensity: 1.5,
							color: "#00ffff",
							castShadow: true,
							"shadow-mapSize": [1024, 1024]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
							position: [
								-10,
								10,
								10
							],
							intensity: 1,
							color: "#ff00ff"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
							gravity: [
								0,
								-25,
								0
							],
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, { isLearncade }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { FaskaTonyHawkSwarm as default };
