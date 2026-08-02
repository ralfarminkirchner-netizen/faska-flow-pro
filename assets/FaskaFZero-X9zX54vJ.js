import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { $ as MathUtils, Rt as Vector3, a as useFrame, t as Canvas, xt as RepeatWrapping } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Text } from "./Text-CuphjnHx.js";
import { t as useTexture } from "./Texture-BOsfVZMl.js";
import { t as Stars } from "./Stars-7m8Mrcxr.js";
//#region src/components/games/engines/FaskaFZero/FaskaFZero.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var useKeys = () => {
	const keys = (0, import_react.useRef)({
		left: false,
		right: false,
		up: false,
		down: false
	});
	(0, import_react.useEffect)(() => {
		const down = (e) => {
			if (e.key.toLowerCase() === "a" || e.key === "ArrowLeft") keys.current.left = true;
			if (e.key.toLowerCase() === "d" || e.key === "ArrowRight") keys.current.right = true;
			if (e.key.toLowerCase() === "w" || e.key === "ArrowUp") keys.current.up = true;
			if (e.key.toLowerCase() === "s" || e.key === "ArrowDown") keys.current.down = true;
		};
		const up = (e) => {
			if (e.key.toLowerCase() === "a" || e.key === "ArrowLeft") keys.current.left = false;
			if (e.key.toLowerCase() === "d" || e.key === "ArrowRight") keys.current.right = false;
			if (e.key.toLowerCase() === "w" || e.key === "ArrowUp") keys.current.up = false;
			if (e.key.toLowerCase() === "s" || e.key === "ArrowDown") keys.current.down = false;
		};
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
		};
	}, []);
	return keys;
};
function HoverShip({ keys, speed, targetMol, onHit, shakeRef, onWin }) {
	const rb = (0, import_react.useRef)();
	const shipMesh = (0, import_react.useRef)();
	const [shipTex] = useTexture(["/faska-flow-pro/textures/fzero_ship.png"]);
	const engineGlow = (0, import_react.useRef)();
	useFrame((state, delta) => {
		if (!rb.current) return;
		const pos = rb.current.translation();
		const vel = rb.current.linvel();
		if (pos.z < -19900) onWin();
		const thrust = 150;
		let targetVelX = 0;
		let targetVelZ = -speed;
		if (keys.current.left) targetVelX = -thrust;
		if (keys.current.right) targetVelX = thrust;
		if (keys.current.up) targetVelZ -= 50;
		if (keys.current.down) targetVelZ += 50;
		rb.current.setLinvel({
			x: MathUtils.lerp(vel.x, targetVelX, 2 * delta),
			y: Math.sin(state.clock.elapsedTime * 4) * .5,
			z: MathUtils.lerp(vel.z, targetVelZ, 2 * delta)
		}, true);
		if (shipMesh.current) {
			const bankAngle = vel.x / thrust * (Math.PI / 3);
			const pitchAngle = (vel.z + speed) / 50 * (Math.PI / 12);
			shipMesh.current.rotation.z = MathUtils.lerp(shipMesh.current.rotation.z, -bankAngle, 5 * delta);
			shipMesh.current.rotation.x = MathUtils.lerp(shipMesh.current.rotation.x, pitchAngle, 5 * delta);
		}
		if (engineGlow.current) engineGlow.current.intensity = 2 + Math.random() * 2;
		const baseFov = 75;
		const fovOffset = Math.abs(vel.z) > speed ? 15 : 0;
		state.camera.fov = MathUtils.lerp(state.camera.fov, baseFov + fovOffset, delta * 5);
		state.camera.updateProjectionMatrix();
		const targetCamPos = new Vector3(pos.x * .8, 6 + Math.abs(vel.x) * .02, pos.z + 18);
		if (shakeRef.current > 0) {
			targetCamPos.x += (Math.random() - .5) * 3;
			targetCamPos.y += (Math.random() - .5) * 3;
			shakeRef.current -= delta;
		}
		state.camera.position.lerp(targetCamPos, 8 * delta);
		state.camera.lookAt(pos.x * .3, 1, pos.z - 60);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: rb,
		position: [
			0,
			2,
			0
		],
		type: "dynamic",
		enabledRotations: [
			false,
			false,
			false
		],
		linearDamping: .5,
		name: "player",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: shipMesh,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					castShadow: true,
					position: [
						0,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
						2.5,
						8,
						3
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						map: shipTex,
						roughness: .2,
						metalness: .8,
						color: "#ffffff"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-2,
						-.5,
						2
					],
					rotation: [
						0,
						0,
						Math.PI / 4
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						4,
						.2,
						2
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						map: shipTex,
						roughness: .2,
						metalness: .8
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						2,
						-.5,
						2
					],
					rotation: [
						0,
						0,
						-Math.PI / 4
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						4,
						.2,
						2
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						map: shipTex,
						roughness: .2,
						metalness: .8
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
					ref: engineGlow,
					position: [
						0,
						0,
						4
					],
					color: "#00ffff",
					intensity: 4,
					distance: 20
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						0,
						4
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						1,
						.5,
						2
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#00ffff" })]
				})
			]
		})
	});
}
function TrackEnvironment() {
	const [trackTex] = useTexture(["/faska-flow-pro/textures/fzero_track.png"]);
	trackTex.wrapS = trackTex.wrapT = RepeatWrapping;
	trackTex.repeat.set(4, 1e3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		type: "fixed",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					0,
					-1e4
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [100, 2e4] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					map: trackTex,
					roughness: .4,
					metalness: .5
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					-50,
					10,
					-1e4
				],
				visible: false,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					2,
					20,
					2e4
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					50,
					10,
					-1e4
				],
				visible: false,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					2,
					20,
					2e4
				] })
			})
		]
	});
}
var MOLECULES = [
	{
		formula: "H2O",
		name: "Wasser",
		color: "#00ccff"
	},
	{
		formula: "CO2",
		name: "Kohlenstoffdioxid",
		color: "#ff3333"
	},
	{
		formula: "O2",
		name: "Sauerstoff",
		color: "#ffffff"
	},
	{
		formula: "NaCl",
		name: "Salz",
		color: "#dddddd"
	},
	{
		formula: "C6H12O6",
		name: "Glucose",
		color: "#ffaa00"
	},
	{
		formula: "N2",
		name: "Stickstoff",
		color: "#aa44ff"
	}
];
function ObstacleGate({ position, molecule, onHit }) {
	const [collected, setCollected] = (0, import_react.useState)(false);
	const meshRef = (0, import_react.useRef)();
	useFrame((state) => {
		if (!collected && meshRef.current) {
			meshRef.current.position.y = 3 + Math.sin(state.clock.elapsedTime * 2 + position[2]) * 1;
			meshRef.current.rotation.y += .03;
			meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime + position[2]) * .2;
		}
	});
	if (collected) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		position,
		type: "fixed",
		sensor: true,
		onIntersectionEnter: (p) => {
			if (p.other.rigidBodyObject?.name === "player") {
				setCollected(true);
				onHit(molecule);
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: meshRef,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					3,
					.5,
					16,
					32
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: molecule.color,
					emissive: molecule.color,
					emissiveIntensity: 2
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				position: [
					0,
					4.5,
					0
				],
				fontSize: 2,
				color: "white",
				outlineWidth: .15,
				outlineColor: "black",
				fontWeight: "900",
				children: molecule.formula
			})]
		})
	});
}
function SpeedLines({ speed }) {
	const linesRef = (0, import_react.useRef)();
	const particles = (0, import_react.useMemo)(() => {
		const temp = [];
		for (let i = 0; i < 100; i++) temp.push({
			x: (Math.random() - .5) * 80,
			y: Math.random() * 20,
			z: (Math.random() - .5) * 100
		});
		return temp;
	}, []);
	useFrame((state, delta) => {
		if (linesRef.current) linesRef.current.children.forEach((mesh) => {
			mesh.position.z += speed * delta * 2;
			if (mesh.position.z > 20) mesh.position.z -= 100;
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref: linesRef,
		children: particles.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				p.x,
				p.y,
				p.z
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.1,
				.1,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#ffffff",
				transparent: true,
				opacity: .3
			})]
		}, i))
	});
}
function FaskaFZero({ onExit }) {
	const [gameState, setGameState] = (0, import_react.useState)("playing");
	const [health, setHealth] = (0, import_react.useState)(100);
	const [score, setScore] = (0, import_react.useState)(0);
	const [speed, setSpeed] = (0, import_react.useState)(200);
	const [targetMol, setTargetMol] = (0, import_react.useState)(MOLECULES[0]);
	const [flash, setFlash] = (0, import_react.useState)(null);
	const keys = useKeys();
	const shakeRef = (0, import_react.useRef)(0);
	const obstaclesData = (0, import_react.useMemo)(() => {
		const obs = [];
		for (let i = 0; i < 400; i++) {
			const z = -150 - i * 50;
			const x = (Math.random() - .5) * 80;
			const mol = MOLECULES[Math.floor(Math.random() * MOLECULES.length)];
			obs.push({
				id: i,
				position: [
					x,
					0,
					z
				],
				molecule: mol
			});
		}
		return obs;
	}, []);
	const handleHit = (mol) => {
		if (gameState !== "playing") return;
		if (mol.formula === targetMol.formula) {
			setScore((s) => s + 50);
			setHealth((h) => Math.min(100, h + 10));
			setSpeed((s) => Math.min(400, s + 20));
			setFlash("green");
			shakeRef.current = .3;
			setTimeout(() => setFlash(null), 200);
			setTargetMol(MOLECULES[Math.floor(Math.random() * MOLECULES.length)]);
		} else {
			setHealth((h) => h - 25);
			setSpeed((s) => Math.max(100, s - 50));
			setFlash("red");
			shakeRef.current = .6;
			setTimeout(() => setFlash(null), 300);
		}
	};
	(0, import_react.useEffect)(() => {
		if (health <= 0 && gameState === "playing") {
			setGameState("gameover");
			setSpeed(0);
		}
	}, [health, gameState]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100%",
			height: "100vh",
			overflow: "hidden",
			background: "#000"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
				shadows: true,
				camera: { fov: 75 },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
						attach: "background",
						args: ["#020012"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
						attach: "fog",
						args: [
							"#020012",
							20,
							200
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .4 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
						position: [
							20,
							50,
							-20
						],
						intensity: 2,
						color: "#ffffff",
						castShadow: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
						radius: 150,
						depth: 50,
						count: 5e3,
						factor: 6,
						saturation: 1,
						fade: true,
						speed: 3
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpeedLines, { speed }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
						gravity: [
							0,
							-40,
							0
						],
						children: [
							gameState === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoverShip, {
								keys,
								speed,
								targetMol,
								onHit: handleHit,
								shakeRef,
								onWin: () => setGameState("win")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackEnvironment, {}),
							obstaclesData.map((obs) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObstacleGate, {
								position: obs.position,
								molecule: obs.molecule,
								onHit: handleHit
							}, obs.id))
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					pointerEvents: "none",
					zIndex: 10,
					boxSizing: "border-box",
					padding: "20px",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between"
				},
				children: [
					flash && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						background: flash === "green" ? "rgba(0, 255, 128, 0.2)" : "rgba(255, 0, 80, 0.3)",
						zIndex: -1
					} }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-start"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								background: "rgba(10,0,30,0.8)",
								padding: "20px",
								borderRadius: "15px",
								border: "3px solid #00ffff",
								boxShadow: "0 0 20px rgba(0,255,255,0.4)"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								style: {
									margin: "0 0 10px 0",
									color: "white",
									fontFamily: "Impact, sans-serif",
									fontSize: "2rem",
									letterSpacing: "2px"
								},
								children: [
									"ZIEL: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { color: targetMol.color },
										children: targetMol.formula
									}),
									" (",
									targetMol.name,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									width: "350px",
									height: "25px",
									background: "#222",
									borderRadius: "12px",
									border: "2px solid #fff",
									overflow: "hidden"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
									width: `${Math.max(0, health)}%`,
									height: "100%",
									background: health > 50 ? "linear-gradient(90deg, #00ff00, #00ffff)" : health > 25 ? "#ffff00" : "#ff0000",
									transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
								} })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								textAlign: "right",
								background: "rgba(10,0,30,0.8)",
								padding: "20px",
								borderRadius: "15px",
								border: "3px solid #ff00ff",
								boxShadow: "0 0 20px rgba(255,0,255,0.4)"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								style: {
									margin: 0,
									color: "#ff00ff",
									fontFamily: "Impact, sans-serif",
									fontSize: "3rem",
									letterSpacing: "3px"
								},
								children: [score, " PTS"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								style: {
									margin: "5px 0 0 0",
									color: "white",
									fontFamily: "monospace",
									fontSize: "1.5rem"
								},
								children: [Math.floor(speed), " KM/H"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							justifyContent: "flex-end"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onExit,
							style: {
								pointerEvents: "auto",
								padding: "15px 40px",
								fontSize: "1.5rem",
								fontWeight: "900",
								background: "rgba(255,0,80,0.2)",
								color: "#ff0055",
								border: "3px solid #ff0055",
								cursor: "pointer",
								borderRadius: "10px",
								textTransform: "uppercase",
								textShadow: "0 0 10px #ff0055",
								boxShadow: "0 0 20px #ff0055 inset",
								fontFamily: "Impact, sans-serif"
							},
							onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,0,80,0.5)",
							onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,0,80,0.2)",
							children: "Zurück"
						})
					})
				]
			}),
			gameState !== "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					background: "rgba(0, 5, 20, 0.9)",
					zIndex: 20,
					pointerEvents: "auto",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					color: "white",
					fontFamily: "Impact, sans-serif"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							fontSize: "6rem",
							margin: "0 0 20px 0",
							color: gameState === "win" ? "#00ffff" : "#ff0055",
							textShadow: `0 0 40px ${gameState === "win" ? "#00ffff" : "#ff0055"}`
						},
						children: gameState === "win" ? "STRECKE BEENDET!" : "CRASH!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						style: {
							fontSize: "3rem",
							marginBottom: "50px",
							fontWeight: "normal"
						},
						children: ["SCORE: ", score]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: "30px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => window.location.reload(),
							style: {
								padding: "20px 50px",
								fontSize: "2rem",
								background: "#00ffff",
								color: "#000",
								border: "none",
								cursor: "pointer",
								fontWeight: "900",
								borderRadius: "15px",
								boxShadow: "0 0 30px #00ffff"
							},
							onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.05)",
							onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)",
							children: "REMATCH"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onExit,
							style: {
								padding: "20px 50px",
								fontSize: "2rem",
								background: "transparent",
								color: "#fff",
								border: "3px solid #fff",
								cursor: "pointer",
								fontWeight: "900",
								borderRadius: "15px"
							},
							onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)",
							onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
							children: "BEENDEN"
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { FaskaFZero as default };
