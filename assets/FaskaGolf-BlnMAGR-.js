import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, s as useThree, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { n as Line, t as Sparkles } from "./Sparkles-DQajTpFP.js";
import { a as Physics, o as RigidBody, r as CylinderCollider } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Text } from "./Text-CuphjnHx.js";
//#region src/components/games/engines/FaskaGolf/FaskaGolf.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function GameScene({ setGameState, setStrokes, gameState }) {
	const ballRef = (0, import_react.useRef)();
	const { camera } = useThree();
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [dragStart, setDragStart] = (0, import_react.useState)(new Vector3());
	const [dragCurrent, setDragCurrent] = (0, import_react.useState)(new Vector3());
	const [ballPos, setBallPos] = (0, import_react.useState)(new Vector3(4, .5, 0));
	const [flash, setFlash] = (0, import_react.useState)(false);
	const [shake, setShake] = (0, import_react.useState)(0);
	const baseCameraPos = new Vector3(0, 14, 12);
	const lookAtTarget = new Vector3(0, 0, 2);
	useFrame((state, delta) => {
		if (shake > 0) {
			state.camera.position.x = baseCameraPos.x + (Math.random() - .5) * .5;
			state.camera.position.y = baseCameraPos.y + (Math.random() - .5) * .5;
			state.camera.position.z = baseCameraPos.z + (Math.random() - .5) * .5;
			setShake((s) => s - delta);
		} else state.camera.position.copy(baseCameraPos);
		state.camera.lookAt(lookAtTarget);
		if (ballRef.current) {
			const t = ballRef.current.translation();
			setBallPos(new Vector3(t.x, t.y, t.z));
		}
	});
	const handlePointerDown = (e) => {
		if (gameState === "won") return;
		e.stopPropagation();
		setIsDragging(true);
		setDragStart(e.point.clone());
		setDragCurrent(e.point.clone());
	};
	const handlePointerMove = (e) => {
		if (isDragging) setDragCurrent(e.point.clone());
	};
	const handlePointerUp = (e) => {
		if (isDragging) {
			setIsDragging(false);
			const impulse = new Vector3().subVectors(dragStart, dragCurrent);
			impulse.y = 0;
			if (impulse.length() > .1) {
				ballRef.current.applyImpulse(impulse.multiplyScalar(1.2), true);
				setStrokes((s) => s + 1);
			}
		}
	};
	const dragVector = new Vector3().subVectors(dragStart, dragCurrent).setY(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				.01,
				0
			],
			onPointerDown: handlePointerDown,
			onPointerMove: handlePointerMove,
			onPointerUp: handlePointerUp,
			onPointerLeave: () => setIsDragging(false),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [100, 100] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { visible: false })]
		}),
		isDragging && gameState !== "won" && dragVector.length() > .1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
			points: [ballPos, new Vector3().copy(ballPos).add(dragVector)],
			color: "white",
			lineWidth: 4
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			ref: ballRef,
			position: [
				4,
				.5,
				0
			],
			colliders: "ball",
			restitution: .8,
			friction: .2,
			linearDamping: .4,
			angularDamping: .4,
			onCollisionEnter: (e) => {
				if (e.other.rigidBodyObject?.name === "wall") {
					setFlash(true);
					setShake(.15);
					setTimeout(() => setFlash(false), 150);
				}
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.3,
					32,
					32
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: flash ? "#FFD700" : "#FFFFFF" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			restitution: .2,
			friction: .5,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				receiveShadow: true,
				position: [
					0,
					-.5,
					2
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					20,
					1,
					20
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2E8B57" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			restitution: 1,
			friction: 0,
			name: "wall",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.5,
					1.5
				],
				castShadow: true,
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.5,
					1,
					5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8B4513" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			restitution: 1,
			friction: 0,
			name: "wall",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.5,
					-4.5
				],
				castShadow: true,
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					12,
					1,
					1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8B4513" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			restitution: 1,
			friction: 0,
			name: "wall",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.5,
					7.5
				],
				castShadow: true,
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					12,
					1,
					1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8B4513" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			restitution: 1,
			friction: 0,
			name: "wall",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-6.5,
					.5,
					1.5
				],
				castShadow: true,
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1,
					1,
					13
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8B4513" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			restitution: 1,
			friction: 0,
			name: "wall",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					6.5,
					.5,
					1.5
				],
				castShadow: true,
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1,
					1,
					13
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8B4513" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			position: [
				0,
				.5,
				-3.9
			],
			fontSize: .7,
			color: "white",
			anchorX: "center",
			anchorY: "middle",
			children: "45°"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.02,
				-3.5
			],
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [2, 1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#FFD700",
				transparent: true,
				opacity: .3
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			position: [
				3,
				.5,
				-3.9
			],
			fontSize: .7,
			color: "white",
			anchorX: "center",
			anchorY: "middle",
			children: "90°"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				3,
				.02,
				-3.5
			],
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [2, 1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#FF4500",
				transparent: true,
				opacity: .3
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-4,
				.01,
				0
			],
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [.5, 32] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#000000" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				-4,
				.2,
				0
			],
			sensor: true,
			onIntersectionEnter: () => setGameState("won"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CylinderCollider, { args: [.2, .4] })
		}),
		gameState === "won" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
			position: [
				-4,
				.5,
				0
			],
			count: 100,
			scale: 4,
			size: 6,
			speed: 3,
			color: "#FFD700"
		})
	] });
}
function FaskaGolf({ onExit }) {
	const [gameState, setGameState] = (0, import_react.useState)("playing");
	const [strokes, setStrokes] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100vw",
			height: "100vh",
			overflow: "hidden",
			backgroundColor: "#87CEEB"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					padding: "20px",
					background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
					color: "white",
					zIndex: 10,
					fontFamily: "sans-serif",
					pointerEvents: "none",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					textAlign: "center"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							margin: "0 0 10px 0",
							textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
						},
						children: "FaskaGolf: Geometrie-Putt"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						style: {
							margin: 0,
							fontSize: "18px",
							maxWidth: "600px",
							textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Einfallswinkel = Ausfallswinkel." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Das Loch ist hinter der Wand versteckt. Welcher Winkel ist richtig: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "45°" }),
							" oder ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "90°" }),
							"?",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								style: {
									fontSize: "14px",
									color: "#ddd"
								},
								children: ["Klicken und ziehen (wie ein Slingshot), um zu zielen! Schläge: ", strokes]
							})
						]
					}),
					gameState === "won" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							marginTop: "30px",
							padding: "15px 30px",
							background: "rgba(76, 175, 80, 0.95)",
							borderRadius: "15px",
							boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
							pointerEvents: "auto",
							animation: "popIn 0.5s ease-out"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							style: {
								margin: 0,
								color: "white"
							},
							children: "Perfekt versenkt! 🎉"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								margin: "5px 0 0 0",
								color: "white"
							},
							children: "Richtig! 45° ist der korrekte Reflexionswinkel, um das Ziel zu erreichen."
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					top: "20px",
					right: "20px",
					zIndex: 20,
					padding: "10px 20px",
					fontSize: "16px",
					fontWeight: "bold",
					cursor: "pointer",
					backgroundColor: "#f44336",
					color: "white",
					border: "2px solid white",
					borderRadius: "8px",
					boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
					transition: "transform 0.1s"
				},
				onMouseDown: (e) => e.currentTarget.style.transform = "scale(0.95)",
				onMouseUp: (e) => e.currentTarget.style.transform = "scale(1)",
				children: "Beenden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
				shadows: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
						attach: "background",
						args: ["#87CEEB"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .6 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
						position: [
							10,
							15,
							10
						],
						castShadow: true,
						intensity: 1.2,
						"shadow-mapSize": [2048, 2048],
						"shadow-camera-left": -10,
						"shadow-camera-right": 10,
						"shadow-camera-top": 10,
						"shadow-camera-bottom": -10
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
						fallback: null,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Physics, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameScene, {
							setGameState,
							setStrokes,
							gameState
						}) })
					})
				]
			})
		]
	});
}
//#endregion
export { FaskaGolf as default };
