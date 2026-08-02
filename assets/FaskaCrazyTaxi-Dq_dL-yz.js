import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
//#region src/components/games/engines/FaskaCrazyTaxi/FaskaCrazyTaxi.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var LANDMARKS = [
	{
		id: 1,
		name: "blauen Pyramide",
		color: "#2196f3",
		type: "pyramid",
		position: [
			-40,
			0,
			-40
		]
	},
	{
		id: 2,
		name: "roten Würfel",
		color: "#f44336",
		type: "cube",
		position: [
			40,
			0,
			-40
		]
	},
	{
		id: 3,
		name: "grünen Kugel",
		color: "#4caf50",
		type: "sphere",
		position: [
			-40,
			0,
			40
		]
	},
	{
		id: 4,
		name: "gelben Zylinder",
		color: "#ffeb3b",
		type: "cylinder",
		position: [
			40,
			0,
			40
		]
	}
];
var BUILDINGS = [];
var blockSize = 15;
var roadSize = 10;
for (let x = -40; x <= 40; x += blockSize + roadSize) for (let z = -40; z <= 40; z += blockSize + roadSize) {
	if (Math.abs(x) > 30 && Math.abs(z) > 30) continue;
	BUILDINGS.push({
		x: x + (Math.random() * 4 - 2),
		z: z + (Math.random() * 4 - 2),
		w: blockSize * (.8 + Math.random() * .4),
		d: blockSize * (.8 + Math.random() * .4),
		h: 5 + Math.random() * 20,
		color: `hsl(${Math.random() * 360}, 40%, 30%)`
	});
}
function isInsideBuilding(x, z) {
	for (let b of BUILDINGS) if (Math.abs(x - b.x) < b.w / 2 + 3 && Math.abs(z - b.z) < b.d / 2 + 3) return true;
	return false;
}
function getRandomRoadPosition() {
	let x, z;
	do {
		x = (Math.random() - .5) * 80;
		z = (Math.random() - .5) * 80;
	} while (isInsideBuilding(x, z));
	return [
		x,
		0,
		z
	];
}
var CityEnvironment = import_react.memo(() => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
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
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [120, 120] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#333" })]
		}),
		BUILDINGS.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				b.x,
				b.h / 2,
				b.z
			],
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				b.w,
				b.h,
				b.d
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: b.color })]
		}, i)),
		LANDMARKS.map((l, i) => {
			let geometry;
			if (l.type === "pyramid") geometry = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
				5,
				10,
				4
			] });
			else if (l.type === "cube") geometry = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				8,
				8,
				8
			] });
			else if (l.type === "sphere") geometry = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				5,
				32,
				32
			] });
			else if (l.type === "cylinder") geometry = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				4,
				4,
				10,
				32
			] });
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					l.position[0],
					5,
					l.position[2]
				],
				castShadow: true,
				receiveShadow: true,
				children: [geometry, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: l.color })]
			}, `lm-${i}`);
		})
	] });
});
function CarAndGameLogic({ setScore, setTimeLeft, setMission, setGameState, isPlaying }) {
	const carRef = (0, import_react.useRef)();
	const passengerMeshRef = (0, import_react.useRef)();
	const targetIndicatorRef = (0, import_react.useRef)();
	const speed = (0, import_react.useRef)(0);
	const rotation = (0, import_react.useRef)(0);
	const passengerActive = (0, import_react.useRef)(false);
	const passengerPos = (0, import_react.useRef)(getRandomRoadPosition());
	const currentTarget = (0, import_react.useRef)(null);
	const timeRef = (0, import_react.useRef)(60);
	const shakeRef = (0, import_react.useRef)(0);
	const keys = (0, import_react.useRef)({
		w: false,
		a: false,
		s: false,
		d: false
	});
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			const key = e.key.toLowerCase();
			if (keys.current.hasOwnProperty(key)) keys.current[key] = true;
		};
		const handleKeyUp = (e) => {
			const key = e.key.toLowerCase();
			if (keys.current.hasOwnProperty(key)) keys.current[key] = false;
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);
	useFrame((state, delta) => {
		if (!isPlaying || !carRef.current) return;
		timeRef.current -= delta;
		setTimeLeft(Math.max(0, timeRef.current));
		if (timeRef.current <= 0) {
			setGameState(2);
			return;
		}
		const accel = 25;
		const maxSpeed = 35;
		const friction = .96;
		const turnSpeed = 3;
		if (keys.current.w) speed.current += accel * delta;
		if (keys.current.s) speed.current -= accel * delta;
		speed.current *= friction;
		if (speed.current > maxSpeed) speed.current = maxSpeed;
		if (speed.current < -maxSpeed / 2) speed.current = -maxSpeed / 2;
		if (Math.abs(speed.current) > .1) {
			const dir = speed.current > 0 ? 1 : -1;
			if (keys.current.a) rotation.current += turnSpeed * delta * dir;
			if (keys.current.d) rotation.current -= turnSpeed * delta * dir;
		}
		carRef.current.rotation.y = rotation.current;
		const dx = Math.sin(rotation.current) * speed.current * delta;
		const dz = Math.cos(rotation.current) * speed.current * delta;
		let newX = carRef.current.position.x + dx;
		let newZ = carRef.current.position.z + dz;
		if (newX > 58) {
			newX = 58;
			speed.current *= -.5;
			shakeRef.current = .5;
		}
		if (newX < -58) {
			newX = -58;
			speed.current *= -.5;
			shakeRef.current = .5;
		}
		if (newZ > 58) {
			newZ = 58;
			speed.current *= -.5;
			shakeRef.current = .5;
		}
		if (newZ < -58) {
			newZ = -58;
			speed.current *= -.5;
			shakeRef.current = .5;
		}
		let collided = false;
		for (let b of BUILDINGS) if (Math.abs(newX - b.x) < b.w / 2 + 1.5 && Math.abs(newZ - b.z) < b.d / 2 + 1.5) {
			speed.current = -speed.current * .5;
			newX = carRef.current.position.x;
			newZ = carRef.current.position.z;
			collided = true;
		}
		if (collided) shakeRef.current = .4;
		carRef.current.position.set(newX, 0, newZ);
		const carPos = carRef.current.position;
		if (!passengerActive.current) {
			const pX = passengerPos.current[0];
			const pZ = passengerPos.current[2];
			if (Math.hypot(carPos.x - pX, carPos.z - pZ) < 4) {
				passengerActive.current = true;
				currentTarget.current = LANDMARKS[Math.floor(Math.random() * LANDMARKS.length)];
				setMission(currentTarget.current.name);
				timeRef.current += 15;
			}
		} else {
			const tX = currentTarget.current.position[0];
			const tZ = currentTarget.current.position[2];
			if (Math.hypot(carPos.x - tX, carPos.z - tZ) < 8) {
				passengerActive.current = false;
				setScore((s) => s + 1);
				setMission(null);
				timeRef.current += 20;
				passengerPos.current = getRandomRoadPosition();
			}
		}
		if (passengerMeshRef.current) {
			passengerMeshRef.current.visible = !passengerActive.current;
			if (!passengerActive.current) {
				passengerMeshRef.current.position.set(passengerPos.current[0], 1 + Math.sin(state.clock.elapsedTime * 5) * .5, passengerPos.current[2]);
				passengerMeshRef.current.rotation.y += delta * 2;
			}
		}
		if (passengerActive.current && currentTarget.current && targetIndicatorRef.current) {
			targetIndicatorRef.current.visible = true;
			targetIndicatorRef.current.position.copy(carRef.current.position);
			targetIndicatorRef.current.position.y += 3.5 + Math.sin(state.clock.elapsedTime * 10) * .2;
			targetIndicatorRef.current.lookAt(currentTarget.current.position[0], 3.5, currentTarget.current.position[2]);
		} else if (targetIndicatorRef.current) targetIndicatorRef.current.visible = false;
		const cameraOffset = new Vector3(0, 8, -12);
		cameraOffset.applyAxisAngle(new Vector3(0, 1, 0), rotation.current);
		const targetCamPos = carRef.current.position.clone().add(cameraOffset);
		if (shakeRef.current > 0) {
			targetCamPos.x += (Math.random() - .5) * shakeRef.current;
			targetCamPos.y += (Math.random() - .5) * shakeRef.current;
			shakeRef.current -= delta * 2;
		}
		state.camera.position.lerp(targetCamPos, .1);
		state.camera.lookAt(carRef.current.position);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: carRef,
			position: [
				0,
				0,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.6,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						2,
						.8,
						4
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ffc107" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						1.3,
						-.5
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						1.6,
						.7,
						2
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-1,
						.3,
						-1.2
					],
					rotation: [
						0,
						0,
						Math.PI / 2
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.4,
						.4,
						.3,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						1,
						.3,
						-1.2
					],
					rotation: [
						0,
						0,
						Math.PI / 2
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.4,
						.4,
						.3,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-1,
						.3,
						1.2
					],
					rotation: [
						0,
						0,
						Math.PI / 2
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.4,
						.4,
						.3,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						1,
						.3,
						1.2
					],
					rotation: [
						0,
						0,
						Math.PI / 2
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.4,
						.4,
						.3,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: passengerMeshRef,
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				1,
				16,
				16
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#00e5ff",
				emissive: "#00e5ff",
				emissiveIntensity: .8
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: targetIndicatorRef,
			visible: false,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
					.8,
					2,
					4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#ff0000" })]
			})
		})
	] });
}
function FaskaCrazyTaxi({ onExit }) {
	const [gameState, setGameState] = (0, import_react.useState)(0);
	const [score, setScore] = (0, import_react.useState)(0);
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(60);
	const [mission, setMission] = (0, import_react.useState)(null);
	const startGame = () => {
		setScore(0);
		setTimeLeft(60);
		setMission(null);
		setGameState(1);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100%",
			height: "100vh",
			position: "relative",
			overflow: "hidden",
			backgroundColor: "#87CEEB",
			fontFamily: "sans-serif"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
				shadows: true,
				camera: {
					position: [
						0,
						10,
						-15
					],
					fov: 60
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .6 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
						position: [
							30,
							50,
							-30
						],
						intensity: 1.5,
						castShadow: true,
						"shadow-mapSize": [2048, 2048],
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("orthographicCamera", {
							attach: "shadow-camera",
							args: [
								-70,
								70,
								70,
								-70
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CityEnvironment, {}),
					gameState === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarAndGameLogic, {
						isPlaying: gameState === 1,
						setScore,
						setTimeLeft,
						setMission,
						setGameState
					})
				]
			}),
			gameState === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: overlayStyle,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					style: titleStyle,
					children: "Faska Crazy Taxi"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: panelStyle,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								fontSize: "20px",
								marginBottom: "10px",
								fontWeight: "bold"
							},
							children: "Anleitung:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							style: {
								fontSize: "18px",
								marginBottom: "5px"
							},
							children: ["🚗 Fahre mit ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "W A S D" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								fontSize: "18px",
								marginBottom: "5px"
							},
							children: "🧍 Sammle Fahrgäste ein (die leuchtenden blauen Kugeln)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								fontSize: "18px",
								marginBottom: "30px"
							},
							children: "🎯 Bringe sie schnell zu der gewünschten geometrischen Form!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: startGame,
							style: btnStyle,
							children: "Spiel Starten"
						})
					]
				})]
			}),
			gameState === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: overlayStyle,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					style: titleStyle,
					children: "Zeit abgelaufen!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: panelStyle,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						style: {
							fontSize: "28px",
							marginBottom: "30px",
							fontWeight: "bold"
						},
						children: ["Dein Score: ", score]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: startGame,
						style: btnStyle,
						children: "Nochmal Spielen"
					})]
				})]
			}),
			gameState === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 20,
					left: 20,
					color: "white",
					fontSize: "28px",
					fontWeight: "bold",
					textShadow: "2px 2px 4px #000"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Score: ", score] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: { color: timeLeft <= 10 ? "#f44336" : "#4caf50" },
					children: [
						"Zeit: ",
						Math.ceil(timeLeft),
						"s"
					]
				})]
			}), mission && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 20,
					left: "50%",
					transform: "translateX(-50%)",
					backgroundColor: "rgba(0,0,0,0.8)",
					color: "#ffc107",
					padding: "15px 30px",
					borderRadius: "12px",
					fontSize: "24px",
					fontWeight: "bold",
					border: "3px solid #ffc107",
					boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
					textAlign: "center",
					pointerEvents: "none"
				},
				children: [
					"Fahrgast: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					" \"Bringe mich zur ",
					mission,
					"!\""
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					...btnStyle,
					position: "absolute",
					top: 20,
					right: 20,
					padding: "10px 20px",
					fontSize: "16px",
					backgroundColor: "#f44336",
					color: "white",
					border: "2px solid #b71c1c",
					boxShadow: "none"
				},
				children: "Beenden"
			})
		]
	});
}
var overlayStyle = {
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	backgroundColor: "rgba(0,0,0,0.7)",
	zIndex: 10
};
var titleStyle = {
	fontSize: "64px",
	color: "#ffc107",
	textShadow: "4px 4px 0 #000",
	marginBottom: "20px",
	fontStyle: "italic",
	textAlign: "center"
};
var panelStyle = {
	backgroundColor: "rgba(255,255,255,0.9)",
	color: "#333",
	padding: "40px",
	borderRadius: "16px",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
	textAlign: "center"
};
var btnStyle = {
	padding: "15px 40px",
	fontSize: "24px",
	backgroundColor: "#ffc107",
	color: "#000",
	border: "none",
	borderRadius: "8px",
	cursor: "pointer",
	fontWeight: "bold",
	boxShadow: "0 6px 0 #b38705, 0 10px 10px rgba(0,0,0,0.3)",
	transition: "all 0.1s",
	textTransform: "uppercase"
};
//#endregion
export { FaskaCrazyTaxi as default };
