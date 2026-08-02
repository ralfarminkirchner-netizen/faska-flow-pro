import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { a as useFrame, t as Canvas, xt as RepeatWrapping } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as create } from "./react-B1iXS_n6.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Environment } from "./Environment-CqP6Yhdo.js";
import { t as Text } from "./Text-CuphjnHx.js";
import { t as useTexture } from "./Texture-BOsfVZMl.js";
import { t as OrthographicCamera } from "./OrthographicCamera-CIEeig0B.js";
//#region src/components/games/engines/FaskaJump/GameLogic.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var useGameStore = create((set) => ({
	score: 0,
	controls: {
		left: false,
		right: false,
		jump: false
	},
	question: {
		num1: 0,
		num2: 0,
		op: "+",
		answer: 0,
		options: []
	},
	isTransitioning: false,
	incrementScore: (points) => set((state) => ({ score: Math.max(0, state.score + points) })),
	setControl: (key, value) => set((state) => ({ controls: {
		...state.controls,
		[key]: value
	} })),
	generateQuestion: () => {
		let num1 = Math.floor(Math.random() * 10) + 1;
		let num2 = Math.floor(Math.random() * 10) + 1;
		let op = Math.random() > .5 ? 0 : 1;
		let answer, opStr;
		if (op === 0) {
			answer = num1 + num2;
			opStr = "+";
		} else {
			if (num1 < num2) {
				let t = num1;
				num1 = num2;
				num2 = t;
			}
			answer = num1 - num2;
			opStr = "-";
		}
		let options = [answer];
		while (options.length < 4) {
			let wrong = answer + Math.floor(Math.random() * 11) - 5;
			if (wrong !== answer && !options.includes(wrong) && wrong >= 0) options.push(wrong);
		}
		options.sort(() => Math.random() - .5);
		set({
			question: {
				num1,
				num2,
				op: opStr,
				answer,
				options
			},
			isTransitioning: false
		});
	},
	setTransitioning: (val) => set({ isTransitioning: val })
}));
//#endregion
//#region src/components/games/engines/FaskaJump/World.jsx
var import_jsx_runtime = require_jsx_runtime();
var Platform = ({ position, args, type = "platform" }) => {
	const texture = useTexture(type === "platform" ? "/faska-flow-pro/textures/grass_platform.png" : "/faska-flow-pro/textures/castle_wall.png");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "fixed",
		position,
		colliders: "cuboid",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			map: texture,
			"map-wrapS": RepeatWrapping,
			"map-wrapT": RepeatWrapping,
			"map-repeat": [args[0] / 2, args[1] / 2]
		})] })
	});
};
var QuestionBlock = ({ position, value }) => {
	const { question, isTransitioning, setTransitioning, generateQuestion, incrementScore } = useGameStore();
	const rigidBody = (0, import_react.useRef)();
	const handleCollision = (e) => {
		if (isTransitioning) return;
		if (e.other.rigidBodyObject?.position.y < position[1] - .5) {
			setTransitioning(true);
			if (value === question.answer) {
				incrementScore(10);
				setTimeout(() => {
					generateQuestion();
				}, 600);
			} else {
				incrementScore(-5);
				setTimeout(() => {
					setTransitioning(false);
				}, 400);
			}
		}
	};
	const texture = useTexture("/faska-flow-pro/textures/castle_wall.png");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: rigidBody,
		type: "fixed",
		position,
		colliders: "cuboid",
		onCollisionEnter: handleCollision,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1,
				1,
				1
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				map: texture,
				color: "#ffc107",
				"map-wrapS": RepeatWrapping,
				"map-wrapT": RepeatWrapping
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				position: [
					0,
					0,
					.51
				],
				fontSize: .5,
				color: "white",
				anchorX: "center",
				anchorY: "middle",
				outlineWidth: .05,
				outlineColor: "black",
				children: value
			})
		] })
	});
};
var World = () => {
	const { question, generateQuestion } = useGameStore();
	(0, import_react.useEffect)(() => {
		generateQuestion();
	}, [generateQuestion]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Platform, {
			position: [
				0,
				-2,
				0
			],
			args: [
				20,
				1,
				3
			],
			type: "platform"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Platform, {
			position: [
				-5,
				0,
				0
			],
			args: [
				4,
				.5,
				2
			],
			type: "platform"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Platform, {
			position: [
				5,
				0,
				0
			],
			args: [
				4,
				.5,
				2
			],
			type: "platform"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Platform, {
			position: [
				0,
				2,
				0
			],
			args: [
				4,
				.5,
				2
			],
			type: "platform"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Platform, {
			position: [
				-5,
				4,
				0
			],
			args: [
				4,
				.5,
				2
			],
			type: "platform"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Platform, {
			position: [
				5,
				4,
				0
			],
			args: [
				4,
				.5,
				2
			],
			type: "platform"
		}),
		question.options.length === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionBlock, {
				position: [
					-3,
					2,
					0
				],
				value: question.options[0]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionBlock, {
				position: [
					3,
					2,
					0
				],
				value: question.options[1]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionBlock, {
				position: [
					-5,
					6,
					0
				],
				value: question.options[2]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionBlock, {
				position: [
					5,
					6,
					0
				],
				value: question.options[3]
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Platform, {
			position: [
				0,
				4,
				-2
			],
			args: [
				20,
				12,
				1
			],
			type: "wall"
		})
	] });
};
//#endregion
//#region src/components/games/engines/FaskaJump/Player.jsx
var Player = () => {
	const rigidBody = (0, import_react.useRef)(null);
	const { left, right, jump } = useGameStore((state) => state.controls);
	useFrame(() => {
		if (!rigidBody.current) return;
		const velocity = rigidBody.current.linvel();
		const speed = 5;
		if (left) velocity.x = -speed;
		else if (right) velocity.x = speed;
		else velocity.x = 0;
		if (jump && Math.abs(velocity.y) < .1) velocity.y = 8;
		rigidBody.current.setLinvel(velocity, true);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: rigidBody,
		position: [
			0,
			2,
			0
		],
		restitution: .1,
		lockRotations: true,
		colliders: "cuboid",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.8,
				.8,
				.8
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#00ccff" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.2,
					.2,
					.41
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.15, .15] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "white" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							0,
							0,
							.01
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.08, .08] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "black" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.2,
					.2,
					.41
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.15, .15] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "white" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							0,
							0,
							.01
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.08, .08] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "black" })]
					})
				]
			})
		] })
	});
};
//#endregion
//#region src/components/games/engines/FaskaJump/MobileJoystick.jsx
var MobileJoystick = () => {
	const setControl = useGameStore((state) => state.setControl);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "ArrowLeft") setControl("left", true);
			if (e.key === "ArrowRight") setControl("right", true);
			if (e.key === "ArrowUp" || e.key === " ") setControl("jump", true);
		};
		const handleKeyUp = (e) => {
			if (e.key === "ArrowLeft") setControl("left", false);
			if (e.key === "ArrowRight") setControl("right", false);
			if (e.key === "ArrowUp" || e.key === " ") setControl("jump", false);
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [setControl]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			bottom: "20px",
			left: "20px",
			right: "20px",
			display: "flex",
			justifyContent: "space-between",
			pointerEvents: "none",
			zIndex: 20
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				gap: "10px",
				pointerEvents: "auto"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onPointerDown: () => setControl("left", true),
				onPointerUp: () => setControl("left", false),
				onPointerLeave: () => setControl("left", false),
				style: buttonStyle,
				children: "←"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onPointerDown: () => setControl("right", true),
				onPointerUp: () => setControl("right", false),
				onPointerLeave: () => setControl("right", false),
				style: buttonStyle,
				children: "→"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: { pointerEvents: "auto" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onPointerDown: () => setControl("jump", true),
				onPointerUp: () => setControl("jump", false),
				onPointerLeave: () => setControl("jump", false),
				style: buttonStyle,
				children: "↑ JUMP"
			})
		})]
	});
};
var buttonStyle = {
	width: "60px",
	height: "60px",
	borderRadius: "30px",
	backgroundColor: "rgba(255, 255, 255, 0.3)",
	border: "2px solid rgba(255, 255, 255, 0.5)",
	color: "white",
	fontSize: "24px",
	fontWeight: "bold",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	userSelect: "none",
	touchAction: "none",
	cursor: "pointer",
	backdropFilter: "blur(4px)"
};
//#endregion
//#region src/components/games/engines/FaskaJump/UIOverlay.jsx
var UIOverlay = ({ onExit }) => {
	const score = useGameStore((state) => state.score);
	const question = useGameStore((state) => state.question);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			pointerEvents: "none",
			zIndex: 10,
			fontFamily: "Arial, sans-serif"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: "20px",
					left: "20px",
					fontSize: "28px",
					color: "#00ffff",
					fontWeight: "bold",
					WebkitTextStroke: "1px black"
				},
				children: ["Punkte: ", score]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					top: "40px",
					left: "50%",
					transform: "translateX(-50%)",
					fontSize: "48px",
					color: "#ffeb3b",
					fontWeight: "bold",
					WebkitTextStroke: "2px black"
				},
				children: question.num1 ? `${question.num1} ${question.op} ${question.num2} = ?` : ""
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					top: "15px",
					right: "15px",
					pointerEvents: "auto",
					padding: "10px 24px",
					backgroundColor: "#ff3366",
					color: "#ffffff",
					border: "none",
					borderRadius: "8px",
					fontSize: "18px",
					fontWeight: "bold",
					cursor: "pointer",
					boxShadow: "0 4px 8px rgba(0,0,0,0.4)"
				},
				children: "Beenden"
			})
		]
	});
};
//#endregion
//#region src/components/games/engines/FaskaJump/FaskaJump.jsx
var FaskaJump = ({ onExit }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100%",
			height: "100vh",
			backgroundColor: "#1e1e38",
			overflow: "hidden"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UIOverlay, { onExit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
				shadows: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Suspense, {
					fallback: null,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrthographicCamera, {
							makeDefault: true,
							position: [
								0,
								4,
								10
							],
							zoom: 60
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
							position: [
								10,
								10,
								5
							],
							intensity: 1,
							castShadow: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Environment, { preset: "city" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
							gravity: [
								0,
								-20,
								0
							],
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileJoystick, {})
		]
	});
};
//#endregion
export { FaskaJump as default };
