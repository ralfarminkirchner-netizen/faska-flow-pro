import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, j as Euler, mt as Quaternion, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as create } from "./react-B1iXS_n6.js";
import { a as Physics, n as CuboidCollider, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Text } from "./Text-CuphjnHx.js";
import { t as PerspectiveCamera } from "./PerspectiveCamera-DlPG4WJK.js";
//#region src/components/games/engines/FaskaMicroMachinesSwarm/GameLogic.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var useGameStore = create((set, get) => ({
	speed: 0,
	maxSpeed: 30,
	gateActive: false,
	score: 0,
	feedback: null,
	feedbackColor: "white",
	problem: {
		num1: 2,
		num2: 2
	},
	answers: {
		top: 4,
		bottom: 5
	},
	correctLocation: "top",
	inputs: {
		up: false,
		down: false,
		left: false,
		right: false
	},
	setInput: (key, value) => set((state) => ({ inputs: {
		...state.inputs,
		[key]: value
	} })),
	generateProblem: () => {
		const num1 = Math.floor(Math.random() * 9) + 2;
		const num2 = Math.floor(Math.random() * 9) + 2;
		const answer = num1 * num2;
		let wrongAnswer = answer + Math.floor(Math.random() * 11) - 5;
		if (wrongAnswer === answer) wrongAnswer += 2;
		if (wrongAnswer <= 0) wrongAnswer = answer + 3;
		const correctLocation = Math.random() > .5 ? "top" : "bottom";
		set({
			gateActive: true,
			problem: {
				num1,
				num2
			},
			answers: {
				top: correctLocation === "top" ? answer : wrongAnswer,
				bottom: correctLocation === "bottom" ? answer : wrongAnswer
			},
			correctLocation
		});
	},
	hitZone: (zoneName) => {
		const state = get();
		if (!state.gateActive) return;
		if (zoneName === state.correctLocation) {
			set({
				gateActive: false,
				maxSpeed: 60,
				score: state.score + 1,
				feedback: "RICHTIG!",
				feedbackColor: "#00ff00"
			});
			setTimeout(() => set({
				maxSpeed: 30,
				feedback: null
			}), 2e3);
		} else {
			set({
				gateActive: false,
				maxSpeed: 5,
				feedback: "FALSCH!",
				feedbackColor: "#ff0000"
			});
			setTimeout(() => set({
				maxSpeed: 30,
				feedback: null
			}), 3e3);
		}
	},
	hitCheckpoint: () => {
		if (!get().gateActive) get().generateProblem();
	}
}));
//#endregion
//#region src/components/games/engines/FaskaMicroMachinesSwarm/World.jsx
var import_jsx_runtime = require_jsx_runtime();
function World() {
	const hitZone = useGameStore((state) => state.hitZone);
	const hitCheckpoint = useGameStore((state) => state.hitCheckpoint);
	const answers = useGameStore((state) => state.answers);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			friction: 1,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				receiveShadow: true,
				position: [
					0,
					-.5,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					100,
					1,
					100
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#0a0a1a" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("gridHelper", {
			args: [
				100,
				20,
				"#334455",
				"#112233"
			],
			position: [
				0,
				.01,
				0
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
				position: [
					0,
					.5,
					-40
				],
				args: [
					50,
					2,
					1
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
				position: [
					0,
					.5,
					40
				],
				args: [
					50,
					2,
					1
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
				position: [
					-50,
					.5,
					0
				],
				args: [
					1,
					2,
					40
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
				position: [
					50,
					.5,
					0
				],
				args: [
					1,
					2,
					40
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
				position: [
					0,
					.5,
					0
				],
				args: [
					30,
					2,
					20
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.5,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				60,
				2,
				40
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#0088ff",
				wireframe: true
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.5,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				100,
				2,
				80
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#0088ff",
				wireframe: true
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
				position: [
					0,
					.5,
					-30
				],
				args: [
					10,
					2,
					1
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.5,
				-30
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				20,
				2,
				2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#ff00ff",
				wireframe: true
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
			position: [
				0,
				1,
				-35
			],
			args: [
				10,
				2,
				4
			],
			sensor: true,
			onIntersectionEnter: () => hitZone("top")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			position: [
				0,
				.1,
				-35
			],
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			fontSize: 8,
			color: "#0ff",
			children: answers.top
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
			position: [
				0,
				1,
				-25
			],
			args: [
				10,
				2,
				4
			],
			sensor: true,
			onIntersectionEnter: () => hitZone("bottom")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			position: [
				0,
				.1,
				-25
			],
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			fontSize: 8,
			color: "#0ff",
			children: answers.bottom
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
			position: [
				40,
				1,
				0
			],
			args: [
				10,
				2,
				20
			],
			sensor: true,
			onIntersectionEnter: () => hitCheckpoint()
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				40,
				.02,
				0
			],
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [20, 40] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#ffffff",
				transparent: true,
				opacity: .1
			})]
		})
	] });
}
//#endregion
//#region src/components/games/engines/FaskaMicroMachinesSwarm/Car.jsx
function Car() {
	const bodyRef = (0, import_react.useRef)();
	const inputs = useGameStore((state) => state.inputs);
	const maxSpeed = useGameStore((state) => state.maxSpeed);
	useFrame((state, delta) => {
		if (!bodyRef.current) return;
		const { up, down, left, right } = inputs;
		const linvel = bodyRef.current.linvel();
		const currentSpeed = Math.sqrt(linvel.x * linvel.x + linvel.z * linvel.z);
		const rotation = bodyRef.current.rotation();
		const euler = new Euler().setFromQuaternion(new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w));
		let turnSpeed = 0;
		if (currentSpeed > 2) {
			if (left) turnSpeed = 3 * delta;
			if (right) turnSpeed = -3 * delta;
		}
		bodyRef.current.setAngvel({
			x: 0,
			y: turnSpeed * 10,
			z: 0
		}, true);
		euler.y += turnSpeed;
		const forward = new Vector3(0, 0, -1).applyEuler(euler);
		const accelForce = 60;
		if (up) bodyRef.current.applyImpulse({
			x: forward.x * accelForce * delta,
			y: 0,
			z: forward.z * accelForce * delta
		}, true);
		if (down) bodyRef.current.applyImpulse({
			x: -forward.x * accelForce * delta,
			y: 0,
			z: -forward.z * accelForce * delta
		}, true);
		const newLinvel = bodyRef.current.linvel();
		const newSpeed = Math.sqrt(newLinvel.x * newLinvel.x + newLinvel.z * newLinvel.z);
		if (newSpeed > maxSpeed) {
			const ratio = maxSpeed / newSpeed;
			bodyRef.current.setLinvel({
				x: newLinvel.x * ratio,
				y: newLinvel.y,
				z: newLinvel.z * ratio
			}, true);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		ref: bodyRef,
		position: [
			0,
			1,
			20
		],
		colliders: "cuboid",
		linearDamping: 2,
		angularDamping: 5,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.5,
				.8,
				3
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ff3355" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.5,
				-.2
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.2,
				.6,
				1.5
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
		})]
	});
}
//#endregion
//#region src/components/games/engines/FaskaMicroMachinesSwarm/UIOverlay.jsx
function UIOverlay({ onExit }) {
	const problem = useGameStore((state) => state.problem);
	const score = useGameStore((state) => state.score);
	const feedback = useGameStore((state) => state.feedback);
	const feedbackColor = useGameStore((state) => state.feedbackColor);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			pointerEvents: "none",
			zIndex: 10,
			padding: "20px",
			boxSizing: "border-box",
			display: "flex",
			flexDirection: "column",
			alignItems: "center"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					top: "20px",
					right: "20px",
					pointerEvents: "auto",
					padding: "12px 24px",
					backgroundColor: "#ff3344",
					color: "white",
					border: "2px solid #fff",
					borderRadius: "8px",
					cursor: "pointer",
					fontWeight: "bold",
					fontSize: "18px",
					textTransform: "uppercase",
					boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
				},
				children: "Beenden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					fontSize: "72px",
					fontWeight: "bold",
					color: "white",
					textShadow: "0 0 15px #0088ff",
					marginTop: "40px"
				},
				children: [
					problem.num1,
					" x ",
					problem.num2,
					" = ?"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					fontSize: "32px",
					color: "white",
					marginTop: "10px",
					textShadow: "0 0 5px #000"
				},
				children: ["Score: ", score]
			}),
			feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					fontSize: "80px",
					fontWeight: "bold",
					color: feedbackColor,
					marginTop: "15vh",
					textShadow: `0 0 20px ${feedbackColor}`
				},
				children: feedback
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					bottom: "20px",
					color: "#aaa",
					fontSize: "18px",
					textShadow: "0 0 4px #000"
				},
				children: "Steuern: Pfeile L/R | Gas: Pfeil Oben | Bremsen: Pfeil Unten"
			})
		]
	});
}
//#endregion
//#region src/components/games/engines/FaskaMicroMachinesSwarm/MobileJoystick.jsx
function MobileJoystick() {
	const setInput = useGameStore((state) => state.setInput);
	const handleTouch = (key, value) => (e) => {
		if (e.cancelable) e.preventDefault();
		setInput(key, value);
	};
	const btnStyle = {
		width: "70px",
		height: "70px",
		background: "rgba(255,255,255,0.2)",
		borderRadius: "35px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		color: "white",
		fontSize: "28px",
		userSelect: "none",
		touchAction: "none",
		border: "2px solid rgba(255,255,255,0.4)",
		fontWeight: "bold"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			bottom: "60px",
			left: "0",
			width: "100%",
			display: "flex",
			justifyContent: "space-between",
			padding: "0 40px",
			boxSizing: "border-box",
			pointerEvents: "none",
			zIndex: 20
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				gap: "20px",
				pointerEvents: "auto"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: btnStyle,
				onPointerDown: handleTouch("left", true),
				onPointerUp: handleTouch("left", false),
				onPointerLeave: handleTouch("left", false),
				children: "L"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: btnStyle,
				onPointerDown: handleTouch("right", true),
				onPointerUp: handleTouch("right", false),
				onPointerLeave: handleTouch("right", false),
				children: "R"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				gap: "20px",
				pointerEvents: "auto"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: btnStyle,
				onPointerDown: handleTouch("up", true),
				onPointerUp: handleTouch("up", false),
				onPointerLeave: handleTouch("up", false),
				children: "U"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: btnStyle,
				onPointerDown: handleTouch("down", true),
				onPointerUp: handleTouch("down", false),
				onPointerLeave: handleTouch("down", false),
				children: "D"
			})]
		})]
	});
}
//#endregion
//#region src/components/games/engines/FaskaMicroMachinesSwarm/FaskaMicroMachinesSwarm.jsx
function FaskaMicroMachinesSwarm({ onExit }) {
	const setInput = useGameStore((state) => state.setInput);
	const generateProblem = useGameStore((state) => state.generateProblem);
	(0, import_react.useEffect)(() => {
		generateProblem();
		const handleKeyDown = (e) => {
			if (e.key === "ArrowUp" || e.key === "w") setInput("up", true);
			if (e.key === "ArrowDown" || e.key === "s") setInput("down", true);
			if (e.key === "ArrowLeft" || e.key === "a") setInput("left", true);
			if (e.key === "ArrowRight" || e.key === "d") setInput("right", true);
		};
		const handleKeyUp = (e) => {
			if (e.key === "ArrowUp" || e.key === "w") setInput("up", false);
			if (e.key === "ArrowDown" || e.key === "s") setInput("down", false);
			if (e.key === "ArrowLeft" || e.key === "a") setInput("left", false);
			if (e.key === "ArrowRight" || e.key === "d") setInput("right", false);
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [setInput, generateProblem]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100%",
			height: "100vh",
			background: "#0a0a1a",
			overflow: "hidden"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UIOverlay, { onExit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
				shadows: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerspectiveCamera, {
						makeDefault: true,
						position: [
							0,
							90,
							0
						],
						rotation: [
							-Math.PI / 2,
							0,
							0
						],
						fov: 50
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
						position: [
							20,
							50,
							20
						],
						intensity: 1,
						castShadow: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
						fallback: null,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
							gravity: [
								0,
								-9.81,
								0
							],
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, {})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileJoystick, {})
		]
	});
}
//#endregion
export { FaskaMicroMachinesSwarm as default };
