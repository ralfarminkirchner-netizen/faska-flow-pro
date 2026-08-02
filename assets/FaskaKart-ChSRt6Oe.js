import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { $ as MathUtils, Rt as Vector3, S as Color, a as useFrame, lt as Object3D, s as useThree, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { t as Text } from "./Text-CuphjnHx.js";
//#region src/components/games/engines/FaskaKart/FaskaKart.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var VERBS = [
	"laufen",
	"spielen",
	"lachen",
	"denken",
	"lesen",
	"schwimmen",
	"kochen",
	"tanzen",
	"arbeiten",
	"schreiben"
];
var NOUNS = [
	"Hund",
	"Haus",
	"Baum",
	"Tisch",
	"Stuhl",
	"Auto",
	"Blume",
	"Vogel",
	"Katze",
	"Apfel"
];
var ADJECTIVES = [
	"schnell",
	"schön",
	"groß",
	"klein",
	"kalt",
	"warm",
	"hell",
	"dunkel",
	"stark",
	"schwach"
];
function generateRow(z) {
	const correctLane = Math.floor(Math.random() * 3);
	const words = [];
	for (let i = 0; i < 3; i++) if (i === correctLane) words.push({
		text: VERBS[Math.floor(Math.random() * VERBS.length)],
		type: "verb"
	});
	else if (Math.random() > .5) words.push({
		text: NOUNS[Math.floor(Math.random() * NOUNS.length)],
		type: "noun"
	});
	else words.push({
		text: ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)],
		type: "adjective"
	});
	return {
		id: Math.random(),
		z,
		words,
		correctLane
	};
}
function Kart({ laneRef, playingRef }) {
	const meshRef = (0, import_react.useRef)();
	useFrame((state, delta) => {
		if (!playingRef.current || !meshRef.current) return;
		const targetX = laneRef.current * 4;
		meshRef.current.position.x = MathUtils.lerp(meshRef.current.position.x, targetX, 10 * delta);
		const tilt = (meshRef.current.position.x - targetX) * .1;
		meshRef.current.rotation.z = tilt;
		meshRef.current.rotation.y = -tilt * .5;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: meshRef,
		position: [
			0,
			.5,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				position: [
					0,
					.2,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.6,
					.8,
					2.6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#FF3366",
					roughness: .4,
					metalness: .2
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				position: [
					0,
					.8,
					1.1
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.8,
					.1,
					.4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				position: [
					-.6,
					.4,
					1.1
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.1,
					.8,
					.3
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				position: [
					.6,
					.4,
					1.1
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.1,
					.8,
					.3
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
			}),
			[
				[
					-.9,
					-.2,
					.9
				],
				[
					.9,
					-.2,
					.9
				],
				[
					-.9,
					-.2,
					-.9
				],
				[
					.9,
					-.2,
					-.9
				]
			].map((pos, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				position: pos,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", {
					args: [
						.4,
						.4,
						.4,
						16
					],
					rotation: [
						0,
						0,
						Math.PI / 2
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#111",
					roughness: .9
				})]
			}, i))
		]
	});
}
function Ground({ speedRef, playingRef }) {
	const gridRef = (0, import_react.useRef)();
	useFrame((state, delta) => {
		if (!playingRef.current || !gridRef.current) return;
		gridRef.current.position.z += speedRef.current * delta;
		gridRef.current.position.z = gridRef.current.position.z % 1;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				-.5,
				-50
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [200, 300] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#4CAF50",
				roughness: 1
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				-.45,
				-50
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [12, 300] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#333",
				roughness: .8
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("gridHelper", {
			ref: gridRef,
			args: [
				12,
				12,
				"#ffffff",
				"#555555"
			],
			position: [
				0,
				-.44,
				0
			]
		})
	] });
}
function Scenery({ speedRef, playingRef }) {
	const meshRef = (0, import_react.useRef)();
	const [objects] = (0, import_react.useState)(() => {
		return Array.from({ length: 50 }).map(() => ({
			x: (Math.random() > .5 ? 1 : -1) * (Math.random() * 30 + 8),
			y: Math.random() * 3 + 2,
			z: -Math.random() * 250,
			scale: Math.random() * 1.5 + 1
		}));
	});
	const dummy = (0, import_react.useMemo)(() => new Object3D(), []);
	useFrame((state, delta) => {
		if (!playingRef.current || !meshRef.current) return;
		objects.forEach((obj, i) => {
			obj.z += speedRef.current * delta;
			if (obj.z > 20) obj.z -= 250;
			dummy.position.set(obj.x, obj.y - .5, obj.z);
			dummy.scale.set(obj.scale, obj.y, obj.scale);
			dummy.updateMatrix();
			meshRef.current.setMatrixAt(i, dummy.matrix);
		});
		meshRef.current.instanceMatrix.needsUpdate = true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: meshRef,
		args: [
			null,
			null,
			50
		],
		castShadow: true,
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
			1,
			2,
			8
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#2E8B57",
			roughness: .8
		})]
	});
}
function GateRow({ initialZ, speedRef, playingRef, laneRef, onHit }) {
	const groupRef = (0, import_react.useRef)();
	const [data, setData] = (0, import_react.useState)(() => generateRow(initialZ));
	const passedRef = (0, import_react.useRef)(false);
	useFrame((state, delta) => {
		if (!playingRef.current || !groupRef.current) return;
		groupRef.current.position.z += speedRef.current * delta;
		if (groupRef.current.position.z > 0 && !passedRef.current) {
			passedRef.current = true;
			const playerLaneIndex = laneRef.current + 1;
			onHit(playerLaneIndex === data.correctLane, groupRef.current.position.clone(), playerLaneIndex);
		}
		if (groupRef.current.position.z > 20) {
			groupRef.current.position.z -= 200;
			setData(generateRow(groupRef.current.position.z));
			passedRef.current = false;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref: groupRef,
		position: [
			0,
			0,
			initialZ
		],
		children: data.words.map((wordObj, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				(i - 1) * 4,
				1.8,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						0,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						3.6,
						2.5,
						.4
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#111",
						transparent: true,
						opacity: .7
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						1.3,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						3.8,
						.2,
						.6
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#FFD700" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-1.8,
						0,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.2,
						2.6,
						.6
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#FFD700" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						1.8,
						0,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.2,
						2.6,
						.6
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#FFD700" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						0,
						0,
						.21
					],
					fontSize: .7,
					color: "white",
					anchorX: "center",
					anchorY: "middle",
					outlineWidth: .03,
					outlineColor: "#000",
					children: wordObj.text
				})
			]
		}, i))
	});
}
function Particles({ particlesRef }) {
	const meshRef = (0, import_react.useRef)();
	const dummy = (0, import_react.useMemo)(() => new Object3D(), []);
	(0, import_react.useLayoutEffect)(() => {
		if (meshRef.current) {
			for (let i = 0; i < 500; i++) meshRef.current.setColorAt(i, new Color("white"));
			meshRef.current.instanceColor.needsUpdate = true;
		}
	}, []);
	useFrame((state, delta) => {
		if (!meshRef.current) return;
		let count = 0;
		const particles = particlesRef.current;
		for (let i = 0; i < particles.length; i++) {
			const p = particles[i];
			if (p.life > 0) {
				p.life -= delta;
				p.pos.add(p.vel.clone().multiplyScalar(delta));
				p.vel.y -= 25 * delta;
				dummy.position.copy(p.pos);
				const scale = Math.max(0, p.life / p.maxLife);
				dummy.scale.set(scale, scale, scale);
				dummy.rotation.x += p.rotSpeed.x * delta;
				dummy.rotation.y += p.rotSpeed.y * delta;
				dummy.updateMatrix();
				meshRef.current.setMatrixAt(count, dummy.matrix);
				meshRef.current.setColorAt(count, p.color);
				count++;
			}
		}
		meshRef.current.count = count;
		meshRef.current.instanceMatrix.needsUpdate = true;
		if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
		if (particles.length > 400) particlesRef.current = particles.filter((p) => p.life > 0);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: meshRef,
		args: [
			null,
			null,
			500
		],
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			.3,
			.3,
			.3
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			roughness: .2,
			metalness: .1
		})]
	});
}
function CameraController({ shakeRef, playingRef }) {
	const { camera } = useThree();
	const basePos = (0, import_react.useMemo)(() => new Vector3(0, 5, 10), []);
	useFrame((state, delta) => {
		camera.position.copy(basePos);
		if (shakeRef.current > 0) {
			camera.position.x += (Math.random() - .5) * shakeRef.current;
			camera.position.y += (Math.random() - .5) * shakeRef.current;
			shakeRef.current -= delta * 5;
		}
		camera.lookAt(0, 0, -20);
	});
	return null;
}
function FaskaKart({ onExit }) {
	const [gameState, setGameState] = (0, import_react.useState)("start");
	const [score, setScore] = (0, import_react.useState)(0);
	const [health, setHealth] = (0, import_react.useState)(3);
	const [flash, setFlash] = (0, import_react.useState)({
		color: "transparent",
		opacity: 0
	});
	const [gameKey, setGameKey] = (0, import_react.useState)(0);
	const laneRef = (0, import_react.useRef)(0);
	const speedRef = (0, import_react.useRef)(30);
	const playingRef = (0, import_react.useRef)(false);
	const shakeRef = (0, import_react.useRef)(0);
	const particlesRef = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		playingRef.current = gameState === "playing";
	}, [gameState]);
	const startGame = () => {
		setScore(0);
		setHealth(3);
		laneRef.current = 0;
		speedRef.current = 40;
		particlesRef.current = [];
		setGameKey((k) => k + 1);
		setGameState("playing");
	};
	const triggerFlash = (isSuccess) => {
		setFlash({
			color: isSuccess ? "rgba(0, 255, 0, 0.4)" : "rgba(255, 0, 0, 0.6)",
			opacity: 1
		});
		setTimeout(() => setFlash((prev) => ({
			...prev,
			opacity: 0
		})), 150);
	};
	const emitParticles = (origin, colorHex) => {
		const color = new Color(colorHex);
		for (let i = 0; i < 40; i++) particlesRef.current.push({
			pos: origin.clone().add(new Vector3((Math.random() - .5) * 3, (Math.random() - .5) * 3, 0)),
			vel: new Vector3((Math.random() - .5) * 20, Math.random() * 20 + 5, (Math.random() - .5) * 20),
			rotSpeed: new Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10),
			life: .8 + Math.random() * .4,
			maxLife: 1.2,
			color
		});
	};
	const onHit = (isCorrect, gatePos, hitLaneIndex) => {
		const hitOrigin = new Vector3((hitLaneIndex - 1) * 4, 2, gatePos.z);
		if (isCorrect) {
			setScore((s) => s + 10);
			speedRef.current = Math.min(speedRef.current + 1, 80);
			emitParticles(hitOrigin, "#00ff00");
			triggerFlash(true);
		} else {
			setHealth((h) => {
				const newHealth = h - 1;
				if (newHealth <= 0) {
					setGameState("gameover");
					speedRef.current = 0;
				}
				return newHealth;
			});
			shakeRef.current = 2;
			emitParticles(hitOrigin, "#ff0000");
			triggerFlash(false);
			speedRef.current = Math.max(speedRef.current - 10, 30);
		}
	};
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (gameState !== "playing") return;
			if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") laneRef.current = Math.max(-1, laneRef.current - 1);
			else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") laneRef.current = Math.min(1, laneRef.current + 1);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [gameState]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100%",
			height: "100vh",
			overflow: "hidden",
			backgroundColor: "#87CEEB"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: flash.color,
				opacity: flash.opacity,
				pointerEvents: "none",
				transition: "opacity 0.15s ease-out",
				zIndex: 5
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 20,
					left: 20,
					zIndex: 10,
					color: "white",
					textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
					fontFamily: "sans-serif"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					style: {
						margin: 0,
						fontSize: "32px"
					},
					children: ["Score: ", score]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					style: {
						margin: 0,
						fontSize: "32px",
						color: health <= 1 ? "#ff4444" : "white"
					},
					children: ["Health: ", "❤️".repeat(Math.max(0, health))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					top: 20,
					right: 20,
					zIndex: 10
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					style: {
						padding: "10px 20px",
						fontSize: "18px",
						backgroundColor: "#333",
						color: "white",
						border: "2px solid white",
						borderRadius: "8px",
						cursor: "pointer"
					},
					children: "Beenden"
				})
			}),
			gameState === "start" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "rgba(0,0,0,0.6)",
					zIndex: 20,
					color: "white",
					fontFamily: "sans-serif"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							fontSize: "64px",
							marginBottom: "10px",
							textShadow: "2px 2px 8px #000"
						},
						children: "FaskaKart"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						style: {
							fontSize: "24px",
							marginBottom: "30px",
							textAlign: "center",
							textShadow: "1px 1px 4px #000"
						},
						children: [
							"Steer with A/D or Left/Right.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Drive through the gates with VERBS!"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: startGame,
						style: {
							padding: "15px 40px",
							fontSize: "24px",
							backgroundColor: "#4CAF50",
							color: "white",
							border: "none",
							borderRadius: "8px",
							cursor: "pointer",
							boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
						},
						children: "Start Game"
					})
				]
			}),
			gameState === "gameover" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "rgba(0,0,0,0.8)",
					zIndex: 20,
					color: "white",
					fontFamily: "sans-serif"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							fontSize: "64px",
							color: "#ff4444",
							marginBottom: "10px",
							textShadow: "2px 2px 8px #000"
						},
						children: "GAME OVER"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						style: {
							fontSize: "32px",
							marginBottom: "30px"
						},
						children: ["Final Score: ", score]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: startGame,
						style: {
							padding: "15px 40px",
							fontSize: "24px",
							backgroundColor: "#4CAF50",
							color: "white",
							border: "none",
							borderRadius: "8px",
							cursor: "pointer",
							boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
						},
						children: "Try Again"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
				shadows: true,
				camera: {
					position: [
						0,
						5,
						10
					],
					fov: 60
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
						attach: "fog",
						args: [
							"#87CEEB",
							30,
							150
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
						position: [
							20,
							30,
							10
						],
						intensity: 1.5,
						castShadow: true,
						"shadow-mapSize": [1024, 1024],
						"shadow-camera-far": 200,
						"shadow-camera-left": -20,
						"shadow-camera-right": 20,
						"shadow-camera-top": 20,
						"shadow-camera-bottom": -20
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, { sunPosition: [
						100,
						20,
						100
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraController, {
						shakeRef,
						playingRef
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kart, {
							laneRef,
							playingRef
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ground, {
							speedRef,
							playingRef
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scenery, {
							speedRef,
							playingRef
						}),
						[
							-50,
							-100,
							-150,
							-200,
							-250
						].map((z, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GateRow, {
							initialZ: z,
							speedRef,
							playingRef,
							laneRef,
							onHit
						}, i)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Particles, { particlesRef })
					] }, gameKey)
				]
			})
		]
	});
}
//#endregion
export { FaskaKart as default };
