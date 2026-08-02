import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { $ as MathUtils, Rt as Vector3, a as useFrame, t as Canvas, xt as RepeatWrapping } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, n as CuboidCollider, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { t as Text } from "./Text-CuphjnHx.js";
import { t as useTexture } from "./Texture-BOsfVZMl.js";
//#region src/components/games/engines/FaskaTonyHawk/FaskaTonyHawk.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var QUESTIONS = [
	{
		text: "I ___ to the store.",
		options: [
			"go",
			"goes",
			"going"
		],
		correct: "go"
	},
	{
		text: "She ___ playing tennis.",
		options: [
			"is",
			"are",
			"am"
		],
		correct: "is"
	},
	{
		text: "They ___ a new car.",
		options: [
			"has",
			"have",
			"having"
		],
		correct: "have"
	},
	{
		text: "He ___ pizza every day.",
		options: [
			"eat",
			"eats",
			"eating"
		],
		correct: "eats"
	},
	{
		text: "We ___ to the beach yesterday.",
		options: [
			"go",
			"went",
			"gone"
		],
		correct: "went"
	},
	{
		text: "The dog ___ loudly.",
		options: [
			"barks",
			"bark",
			"barking"
		],
		correct: "barks"
	}
];
var SmoothHalfpipe = () => {
	const [concreteTex] = useTexture(["/faska-flow-pro/textures/skate_concrete.png"]);
	concreteTex.wrapS = concreteTex.wrapT = RepeatWrapping;
	concreteTex.repeat.set(2, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "trimesh",
			friction: .01,
			restitution: 0,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					10,
					0
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				receiveShadow: true,
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					10,
					10,
					20,
					64,
					1,
					true,
					0,
					Math.PI
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					map: concreteTex,
					side: 2
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-10,
				10,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.5,
				.5,
				20
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ff0055" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				10,
				10,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.5,
				.5,
				20
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ff0055" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			friction: .1,
			restitution: 0,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-15,
					10,
					0
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					10,
					1,
					20
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: concreteTex })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			friction: .1,
			restitution: 0,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					15,
					10,
					0
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					10,
					1,
					20
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: concreteTex })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				-20,
				20,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, { args: [
				1,
				15,
				15
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				20,
				20,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, { args: [
				1,
				15,
				15
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				0,
				20,
				-10
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, { args: [
				20,
				15,
				1
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				0,
				20,
				10
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, { args: [
				20,
				15,
				1
			] })
		})
	] });
};
var OptionsBoxes = ({ gameState, setGameState }) => {
	if (!gameState.questionActive) return null;
	const handleHit = (option, hitPosition) => {
		const isCorrect = option === gameState.currentQuestion.correct;
		setGameState((prev) => ({
			...prev,
			score: isCorrect ? prev.score + 500 : Math.max(0, prev.score - 100),
			message: isCorrect ? "SICK TRICK!" : "BAIL!",
			questionActive: false,
			explosions: [...prev.explosions, {
				id: Date.now(),
				position: hitPosition,
				color: isCorrect ? "#00ff00" : "#ff0000"
			}]
		}));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: gameState.currentQuestion.options.map((option, i) => {
		const zOffset = (i - 1) * 4;
		const finalX = gameState.jumpX;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
			type: "fixed",
			position: [
				finalX,
				22,
				zOffset
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
					args: [
						1.5,
						1.5,
						1.5
					],
					sensor: true,
					onIntersectionEnter: () => handleHit(option, [
						finalX,
						22,
						zOffset
					])
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						2.5,
						2.5,
						2.5
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#00ffff",
						emissive: "#00ffff",
						emissiveIntensity: .5,
						transparent: true,
						opacity: .8
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						0,
						0,
						1.3
					],
					fontSize: 1,
					color: "black",
					anchorX: "center",
					anchorY: "middle",
					outlineWidth: .05,
					outlineColor: "white",
					fontWeight: "900",
					children: option
				})
			]
		}, option);
	}) });
};
var SkaterMeshes = ({ skaterRef }) => {
	const groupRef = (0, import_react.useRef)();
	const [deckTex] = useTexture(["/faska-flow-pro/textures/skate_deck.png"]);
	useFrame(() => {
		if (!groupRef.current || !skaterRef.current) return;
		const pos = skaterRef.current.translation();
		const vel = skaterRef.current.linvel();
		let targetAngleZ = 0;
		if (pos.y < 10) {
			const x = MathUtils.clamp(pos.x, -9.9, 9.9);
			targetAngleZ = Math.asin(x / 10);
		}
		groupRef.current.rotation.z = MathUtils.lerp(groupRef.current.rotation.z, targetAngleZ, .5);
		const targetAngleX = MathUtils.clamp(vel.z * .1, -Math.PI / 6, Math.PI / 6);
		groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, targetAngleX, .2);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: groupRef,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.4,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.8,
					.1,
					.6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: deckTex })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.6,
					-.5,
					.2
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.1,
					.1,
					.2,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#fff" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.6,
					-.5,
					-.2
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.1,
					.1,
					.2,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#fff" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.6,
					-.5,
					.2
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.1,
					.1,
					.2,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#fff" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.6,
					-.5,
					-.2
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.1,
					.1,
					.2,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#fff" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.5,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
					.3,
					1,
					4,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				position: [
					0,
					1.4,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.3,
						16,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ffccaa" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.2,
						.1,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.4,
						.1,
						.4
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ff0055" })]
				})]
			})
		]
	});
};
var Skater = (0, import_react.forwardRef)(({ gameState, setGameState }, ref) => {
	const [keys, setKeys] = (0, import_react.useState)({
		left: false,
		right: false,
		space: false,
		w: false,
		s: false
	});
	const inAirRef = (0, import_react.useRef)(false);
	const jumpTriggeredRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const down = (e) => {
			if (e.code === "KeyA" || e.code === "ArrowLeft") setKeys((k) => ({
				...k,
				left: true
			}));
			if (e.code === "KeyD" || e.code === "ArrowRight") setKeys((k) => ({
				...k,
				right: true
			}));
			if (e.code === "KeyW" || e.code === "ArrowUp") setKeys((k) => ({
				...k,
				w: true
			}));
			if (e.code === "KeyS" || e.code === "ArrowDown") setKeys((k) => ({
				...k,
				s: true
			}));
			if (e.code === "Space") setKeys((k) => ({
				...k,
				space: true
			}));
		};
		const up = (e) => {
			if (e.code === "KeyA" || e.code === "ArrowLeft") setKeys((k) => ({
				...k,
				left: false
			}));
			if (e.code === "KeyD" || e.code === "ArrowRight") setKeys((k) => ({
				...k,
				right: false
			}));
			if (e.code === "KeyW" || e.code === "ArrowUp") setKeys((k) => ({
				...k,
				w: false
			}));
			if (e.code === "KeyS" || e.code === "ArrowDown") setKeys((k) => ({
				...k,
				s: false
			}));
			if (e.code === "Space") setKeys((k) => ({
				...k,
				space: false
			}));
		};
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
		};
	}, []);
	useFrame(() => {
		if (!ref.current) return;
		const pos = ref.current.translation();
		const vel = ref.current.linvel();
		if (pos.y <= 10.5) {
			if (keys.left) ref.current.applyImpulse({
				x: -.6,
				y: 0,
				z: 0
			}, true);
			if (keys.right) ref.current.applyImpulse({
				x: .6,
				y: 0,
				z: 0
			}, true);
			if (keys.w) ref.current.applyImpulse({
				x: 0,
				y: 0,
				z: -.8
			}, true);
			if (keys.s) ref.current.applyImpulse({
				x: 0,
				y: 0,
				z: .8
			}, true);
			if (Math.abs(vel.x) < 5) ref.current.applyImpulse({
				x: pos.x > 0 ? -.2 : .2,
				y: 0,
				z: 0
			}, true);
		}
		if (pos.y > 8.5 && pos.y < 11.5 && !jumpTriggeredRef.current) {
			if (keys.space && vel.y > 0) {
				ref.current.setLinvel({
					x: vel.x * .2,
					y: 25,
					z: vel.z
				}, true);
				jumpTriggeredRef.current = true;
				inAirRef.current = true;
				setGameState((prev) => {
					if (prev.questionActive) return prev;
					return {
						...prev,
						questionActive: true,
						currentQuestion: QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)],
						message: "",
						jumpX: pos.x > 0 ? 10 : -10
					};
				});
			}
		}
		if (pos.y > 12 && inAirRef.current) {
			if (keys.w) ref.current.applyImpulse({
				x: 0,
				y: 0,
				z: -.6
			}, true);
			if (keys.s) ref.current.applyImpulse({
				x: 0,
				y: 0,
				z: .6
			}, true);
		}
		if (pos.y < 9 && inAirRef.current) {
			inAirRef.current = false;
			jumpTriggeredRef.current = false;
			if (gameState.questionActive) setGameState((prev) => ({
				...prev,
				questionActive: false,
				message: "MISSED IT!",
				score: Math.max(0, prev.score - 50)
			}));
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref,
		position: [
			0,
			2,
			0
		],
		colliders: "capsule",
		friction: .01,
		restitution: 0,
		enabledRotations: [
			false,
			false,
			false
		],
		name: "skater",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkaterMeshes, { skaterRef: ref })
	});
});
var CameraController = ({ skaterRef }) => {
	useFrame((state, delta) => {
		if (!skaterRef.current) return;
		const pos = skaterRef.current.translation();
		const targetX = pos.x * .2;
		const targetY = Math.max(8, pos.y + 4);
		const targetZ = pos.z + 18;
		state.camera.position.lerp(new Vector3(targetX, targetY, targetZ), 5 * delta);
		state.camera.lookAt(pos.x * .5, pos.y, pos.z);
	});
	return null;
};
function Explosion({ position, color }) {
	const ref = (0, import_react.useRef)();
	const [particles] = (0, import_react.useState)(() => Array.from({ length: 20 }).map(() => ({ vel: new Vector3((Math.random() - .5) * 20, (Math.random() - .5) * 20, (Math.random() - .5) * 20) })));
	useFrame((state, delta) => {
		if (ref.current) ref.current.children.forEach((mesh, i) => {
			mesh.position.addScaledVector(particles[i].vel, delta);
			mesh.scale.multiplyScalar(.9);
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref,
		position,
		children: particles.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			1,
			1,
			1
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color })] }, i))
	});
}
var GameScene = ({ gameState, setGameState }) => {
	const skaterRef = (0, import_react.useRef)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: ["#87CEEB"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .8 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				10,
				50,
				20
			],
			castShadow: true,
			intensity: 2,
			"shadow-mapSize": [2048, 2048]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, {
			sunPosition: [
				100,
				20,
				100
			],
			turbidity: .1
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
			gravity: [
				0,
				-20,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmoothHalfpipe, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skater, {
					ref: skaterRef,
					gameState,
					setGameState
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionsBoxes, {
					gameState,
					setGameState
				})
			]
		}),
		gameState.explosions.map((exp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Explosion, {
			position: exp.position,
			color: exp.color
		}, exp.id)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraController, { skaterRef })
	] });
};
var GameUI = ({ gameState, onExit }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			pointerEvents: "none",
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
			padding: "30px",
			boxSizing: "border-box",
			fontFamily: "Impact, sans-serif"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						background: "rgba(255, 255, 255, 0.9)",
						padding: "15px 40px",
						borderRadius: "10px",
						color: "#ff0055",
						fontSize: "36px",
						boxShadow: "0 10px 0 #cc0044",
						border: "4px solid #000"
					},
					children: ["SCORE: ", gameState.score]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					style: {
						pointerEvents: "auto",
						background: "#e74c3c",
						color: "white",
						border: "4px solid #000",
						padding: "15px 40px",
						borderRadius: "10px",
						fontSize: "30px",
						cursor: "pointer",
						boxShadow: "0 10px 0 #c0392b",
						fontFamily: "Impact, sans-serif"
					},
					onMouseDown: (e) => {
						e.currentTarget.style.transform = "translateY(10px)";
						e.currentTarget.style.boxShadow = "0 0 0 #c0392b";
					},
					onMouseUp: (e) => {
						e.currentTarget.style.transform = "translateY(0)";
						e.currentTarget.style.boxShadow = "0 10px 0 #c0392b";
					},
					children: "BEENDEN"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					textAlign: "center",
					pointerEvents: "none",
					marginBottom: "15vh"
				},
				children: [
					!gameState.questionActive && !gameState.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							background: "rgba(0, 0, 0, 0.8)",
							padding: "20px 40px",
							borderRadius: "10px",
							display: "inline-block",
							color: "#00ffff",
							fontSize: "28px",
							border: "3px solid #00ffff"
						},
						children: "HOLD A/D TO PUMP. PRESS SPACE AT RED LIPS TO JUMP!"
					}),
					gameState.questionActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: "rgba(0, 0, 0, 0.9)",
							padding: "30px 60px",
							borderRadius: "15px",
							display: "inline-block",
							border: "5px solid #ff0055",
							boxShadow: "0 0 30px #ff0055"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							style: {
								margin: 0,
								color: "white",
								fontSize: "48px"
							},
							children: gameState.currentQuestion.text
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								margin: "15px 0 0",
								color: "#00ffff",
								fontSize: "24px"
							},
							children: "USE W / S TO STEER MIDAIR TO THE ANSWER!"
						})]
					}),
					gameState.message && !gameState.questionActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							background: gameState.message === "SICK TRICK!" ? "#00ff00" : "#ff0000",
							padding: "20px 50px",
							borderRadius: "10px",
							display: "inline-block",
							color: "black",
							fontSize: "48px",
							border: "5px solid black",
							transform: "rotate(-5deg)",
							animation: "pop 0.5s ease-out"
						},
						children: gameState.message
					}, Date.now())
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes pop { 0% { transform: scale(0.5) rotate(-20deg); } 100% { transform: scale(1) rotate(-5deg); } }` })
		]
	});
};
function FaskaTonyHawk({ onExit }) {
	const [gameState, setGameState] = (0, import_react.useState)({
		score: 0,
		questionActive: false,
		currentQuestion: null,
		message: "",
		jumpX: 0,
		explosions: []
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100%",
			height: "100%",
			position: "absolute",
			inset: 0,
			overflow: "hidden"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
			shadows: true,
			camera: { fov: 60 },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameScene, {
					gameState,
					setGameState
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameUI, {
			gameState,
			onExit
		})]
	});
}
//#endregion
export { FaskaTonyHawk as default };
