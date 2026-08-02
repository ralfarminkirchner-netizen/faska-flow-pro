import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, s as useThree, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Text } from "./Text-CuphjnHx.js";
//#region src/components/games/engines/FaskaMarbleMadness/FaskaMarbleMadness.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function usePlayerControls() {
	const [movement, setMovement] = (0, import_react.useState)({
		forward: false,
		backward: false,
		left: false,
		right: false
	});
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			switch (e.code) {
				case "KeyW":
				case "ArrowUp":
					setMovement((m) => ({
						...m,
						forward: true
					}));
					break;
				case "KeyS":
				case "ArrowDown":
					setMovement((m) => ({
						...m,
						backward: true
					}));
					break;
				case "KeyA":
				case "ArrowLeft":
					setMovement((m) => ({
						...m,
						left: true
					}));
					break;
				case "KeyD":
				case "ArrowRight":
					setMovement((m) => ({
						...m,
						right: true
					}));
					break;
				default: break;
			}
		};
		const handleKeyUp = (e) => {
			switch (e.code) {
				case "KeyW":
				case "ArrowUp":
					setMovement((m) => ({
						...m,
						forward: false
					}));
					break;
				case "KeyS":
				case "ArrowDown":
					setMovement((m) => ({
						...m,
						backward: false
					}));
					break;
				case "KeyA":
				case "ArrowLeft":
					setMovement((m) => ({
						...m,
						left: false
					}));
					break;
				case "KeyD":
				case "ArrowRight":
					setMovement((m) => ({
						...m,
						right: false
					}));
					break;
				default: break;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);
	return movement;
}
function Marble({ onFall, resetCounter, currentNumber, gameState }) {
	const bodyRef = (0, import_react.useRef)();
	const textRef = (0, import_react.useRef)();
	const controls = usePlayerControls();
	const { camera } = useThree();
	(0, import_react.useEffect)(() => {
		if (bodyRef.current) {
			bodyRef.current.setTranslation({
				x: 0,
				y: 2,
				z: 0
			}, true);
			bodyRef.current.setLinvel({
				x: 0,
				y: 0,
				z: 0
			}, true);
			bodyRef.current.setAngvel({
				x: 0,
				y: 0,
				z: 0
			}, true);
		}
	}, [resetCounter]);
	useFrame((state, delta) => {
		if (!bodyRef.current) return;
		const pos = bodyRef.current.translation();
		if (textRef.current) textRef.current.position.set(pos.x, pos.y + 1.2, pos.z);
		if (gameState === "playing") {
			const { forward, backward, left, right } = controls;
			const impulseStrength = .8 * delta * 60;
			const torqueStrength = .4 * delta * 60;
			if (forward) {
				bodyRef.current.applyImpulse({
					x: 0,
					y: 0,
					z: -impulseStrength
				}, true);
				bodyRef.current.applyTorqueImpulse({
					x: -torqueStrength,
					y: 0,
					z: 0
				}, true);
			}
			if (backward) {
				bodyRef.current.applyImpulse({
					x: 0,
					y: 0,
					z: impulseStrength
				}, true);
				bodyRef.current.applyTorqueImpulse({
					x: torqueStrength,
					y: 0,
					z: 0
				}, true);
			}
			if (left) {
				bodyRef.current.applyImpulse({
					x: -impulseStrength,
					y: 0,
					z: 0
				}, true);
				bodyRef.current.applyTorqueImpulse({
					x: 0,
					y: 0,
					z: torqueStrength
				}, true);
			}
			if (right) {
				bodyRef.current.applyImpulse({
					x: impulseStrength,
					y: 0,
					z: 0
				}, true);
				bodyRef.current.applyTorqueImpulse({
					x: 0,
					y: 0,
					z: -torqueStrength
				}, true);
			}
		}
		if (pos.y < -15 && gameState === "playing") onFall();
		else {
			const targetCamPos = new Vector3(pos.x, pos.y + 6, pos.z + 10);
			camera.position.lerp(targetCamPos, .1);
			camera.lookAt(pos.x, pos.y - 2, pos.z - 4);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: bodyRef,
		position: [
			0,
			2,
			0
		],
		colliders: "ball",
		mass: 1,
		restitution: .4,
		friction: 1,
		linearDamping: 1.5,
		angularDamping: 1.5,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.5,
				32,
				32
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#fcd34d",
				roughness: .1,
				metalness: .5
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
		ref: textRef,
		fontSize: .8,
		color: "white",
		outlineColor: "black",
		outlineWidth: .05,
		children: currentNumber
	})] });
}
function MathZone({ zone, active, onEnter }) {
	const { position, size, operation, value, section } = zone;
	const symbol = operation === "add" ? "+" : operation === "sub" ? "-" : operation === "mul" ? "×" : "÷";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			sensor: true,
			onIntersectionEnter: () => {
				if (active) onEnter(section, operation, value);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: size }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: active ? "#22c55e" : "#64748b",
				transparent: true,
				opacity: active ? .3 : .1
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			position: [
				0,
				size[1] / 2 + .5,
				0
			],
			fontSize: 1.5,
			color: "white",
			outlineColor: "black",
			outlineWidth: .1,
			children: `${symbol} ${value}`
		})]
	});
}
function GoalZone({ currentNumber, targetNumber, gameState, onWin, onLose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			0,
			-3.5,
			-40
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			sensor: true,
			onIntersectionEnter: () => {
				if (gameState !== "playing") return;
				if (currentNumber === targetNumber) onWin();
				else onLose();
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				8,
				4,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: currentNumber === targetNumber ? "#10b981" : "#ef4444",
				transparent: true,
				opacity: .3
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			position: [
				0,
				3,
				0
			],
			fontSize: 2,
			color: "white",
			outlineColor: "black",
			outlineWidth: .1,
			children: ["ZIEL: ", targetNumber]
		})]
	});
}
function TrackWalls() {
	const wallMat = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
		color: "#94a3b8",
		transparent: true,
		opacity: .3
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
			type: "fixed",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-4,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.5,
						2,
						8
					] }), wallMat]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						4,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.5,
						2,
						8
					] }), wallMat]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						0,
						4
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						8,
						2,
						.5
					] }), wallMat]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
			type: "fixed",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-4,
					-1,
					-10
				],
				rotation: [
					.1,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.5,
					2,
					12
				] }), wallMat]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					4,
					-1,
					-10
				],
				rotation: [
					.1,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.5,
					2,
					12
				] }), wallMat]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
			type: "fixed",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-4,
					-2,
					-20
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.5,
					2,
					8
				] }), wallMat]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					4,
					-2,
					-20
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.5,
					2,
					8
				] }), wallMat]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
			type: "fixed",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-4,
					-3,
					-30
				],
				rotation: [
					.1,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.5,
					2,
					12
				] }), wallMat]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					4,
					-3,
					-30
				],
				rotation: [
					.1,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.5,
					2,
					12
				] }), wallMat]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
			type: "fixed",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-4,
						-4,
						-40
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.5,
						2,
						8
					] }), wallMat]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						4,
						-4,
						-40
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.5,
						2,
						8
					] }), wallMat]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						-4,
						-44
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						8,
						2,
						.5
					] }), wallMat]
				})
			]
		})
	] });
}
function Track() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		type: "fixed",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.5,
					0
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					8,
					1,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#1e293b" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-1.5,
					-10
				],
				rotation: [
					.1,
					0,
					0
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					8,
					1,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#334155" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-2.5,
					-20
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					8,
					1,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#1e293b" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-3.5,
					-30
				],
				rotation: [
					.1,
					0,
					0
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					8,
					1,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#334155" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-4.5,
					-40
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					8,
					1,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#0f172a" })]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackWalls, {})] });
}
function FaskaMarbleMadness({ onExit }) {
	const START_NUMBER = 5;
	const TARGET_NUMBER = 20;
	const [currentNumber, setCurrentNumber] = (0, import_react.useState)(START_NUMBER);
	const [gameState, setGameState] = (0, import_react.useState)("playing");
	const [resetCounter, setResetCounter] = (0, import_react.useState)(0);
	const [activeSections, setActiveSections] = (0, import_react.useState)({
		s1: true,
		s2: true,
		s3: true
	});
	const ZONES = [
		{
			id: "s1_l",
			section: "s1",
			position: [
				-2.1,
				-1.5,
				-10
			],
			size: [
				3.8,
				4,
				4
			],
			operation: "add",
			value: 5
		},
		{
			id: "s1_r",
			section: "s1",
			position: [
				2.1,
				-1.5,
				-10
			],
			size: [
				3.8,
				4,
				4
			],
			operation: "mul",
			value: 2
		},
		{
			id: "s2_l",
			section: "s2",
			position: [
				-2.1,
				-2.5,
				-20
			],
			size: [
				3.8,
				4,
				4
			],
			operation: "add",
			value: 2
		},
		{
			id: "s2_r",
			section: "s2",
			position: [
				2.1,
				-2.5,
				-20
			],
			size: [
				3.8,
				4,
				4
			],
			operation: "sub",
			value: 2
		},
		{
			id: "s3_l",
			section: "s3",
			position: [
				-2.1,
				-3.5,
				-30
			],
			size: [
				3.8,
				4,
				4
			],
			operation: "add",
			value: 8
		},
		{
			id: "s3_r",
			section: "s3",
			position: [
				2.1,
				-3.5,
				-30
			],
			size: [
				3.8,
				4,
				4
			],
			operation: "add",
			value: 12
		}
	];
	const handleZoneEnter = (section, operation, value) => {
		setActiveSections((prev) => {
			if (!prev[section]) return prev;
			setCurrentNumber((numPrev) => {
				let next = numPrev;
				if (operation === "add") next += value;
				if (operation === "sub") next -= value;
				if (operation === "mul") next *= value;
				if (operation === "div") next /= value;
				return next;
			});
			return {
				...prev,
				[section]: false
			};
		});
	};
	const resetGame = () => {
		setCurrentNumber(START_NUMBER);
		setActiveSections({
			s1: true,
			s2: true,
			s3: true
		});
		setGameState("playing");
		setResetCounter((c) => c + 1);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100vw",
			height: "100vh",
			position: "relative",
			overflow: "hidden",
			background: "#0f172a"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
			shadows: true,
			camera: {
				position: [
					0,
					5,
					10
				],
				fov: 50
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
					attach: "background",
					args: ["#0f172a"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					position: [
						10,
						20,
						10
					],
					intensity: 1.5,
					castShadow: true,
					"shadow-mapSize": [1024, 1024]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: null,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Track, {}),
						ZONES.map((zone) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MathZone, {
							zone,
							active: activeSections[zone.section],
							onEnter: handleZoneEnter
						}, zone.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoalZone, {
							currentNumber,
							targetNumber: TARGET_NUMBER,
							gameState,
							onWin: () => setGameState("win"),
							onLose: () => setGameState("lose")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marble, {
							onFall: resetGame,
							resetCounter,
							currentNumber,
							gameState
						})
					] })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				pointerEvents: "none",
				padding: "20px",
				boxSizing: "border-box"
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
							background: "rgba(0,0,0,0.7)",
							padding: "15px",
							borderRadius: "10px",
							color: "white",
							fontFamily: "sans-serif"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								style: {
									margin: 0,
									fontSize: "1.2rem"
								},
								children: ["Zielwert: ", TARGET_NUMBER]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								style: {
									margin: "5px 0 0 0",
									fontSize: "2rem",
									color: currentNumber === TARGET_NUMBER ? "#4ade80" : "white"
								},
								children: ["Aktuell: ", currentNumber]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								style: {
									margin: "5px 0 0 0",
									fontSize: "0.9rem",
									color: "#cbd5e1"
								},
								children: "Bewege dich mit WASD / Pfeiltasten"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: "10px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: resetGame,
							style: {
								pointerEvents: "auto",
								padding: "10px 15px",
								fontSize: "16px",
								background: "#3b82f6",
								color: "white",
								border: "none",
								borderRadius: "8px",
								cursor: "pointer",
								fontWeight: "bold"
							},
							children: "Neustart"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onExit,
							style: {
								pointerEvents: "auto",
								padding: "10px 15px",
								fontSize: "16px",
								background: "#ef4444",
								color: "white",
								border: "none",
								borderRadius: "8px",
								cursor: "pointer",
								fontWeight: "bold"
							},
							children: "Beenden"
						})]
					})]
				}),
				gameState === "win" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						background: "rgba(34, 197, 94, 0.95)",
						padding: "40px",
						borderRadius: "20px",
						color: "white",
						textAlign: "center",
						pointerEvents: "auto",
						boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
						fontFamily: "sans-serif"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							style: {
								margin: "0 0 10px 0",
								fontSize: "3rem"
							},
							children: "Gewonnen! 🎉"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							style: {
								fontSize: "1.2rem",
								margin: "0 0 20px 0"
							},
							children: [
								"Du hast den Zielwert ",
								TARGET_NUMBER,
								" genau erreicht!"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: resetGame,
							style: {
								padding: "12px 24px",
								fontSize: "18px",
								background: "white",
								color: "#16a34a",
								border: "none",
								borderRadius: "8px",
								cursor: "pointer",
								fontWeight: "bold"
							},
							children: "Nochmal Spielen"
						})
					]
				}),
				gameState === "lose" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						background: "rgba(239, 68, 68, 0.95)",
						padding: "40px",
						borderRadius: "20px",
						color: "white",
						textAlign: "center",
						pointerEvents: "auto",
						boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
						fontFamily: "sans-serif"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							style: {
								margin: "0 0 10px 0",
								fontSize: "3rem"
							},
							children: "Falscher Wert! 😢"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							style: {
								fontSize: "1.2rem",
								margin: "0 0 20px 0"
							},
							children: [
								"Dein Ball hatte den Wert ",
								currentNumber,
								", aber ",
								TARGET_NUMBER,
								" war gefordert."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: resetGame,
							style: {
								padding: "12px 24px",
								fontSize: "18px",
								background: "white",
								color: "#dc2626",
								border: "none",
								borderRadius: "8px",
								cursor: "pointer",
								fontWeight: "bold"
							},
							children: "Neustart"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { FaskaMarbleMadness as default };
