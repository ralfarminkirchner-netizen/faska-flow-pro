import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, s as useThree, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as Html } from "./Html-DIjoLRaS.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { t as PerspectiveCamera } from "./PerspectiveCamera-DlPG4WJK.js";
//#region src/components/games/engines/FaskaCrazyTaxiSwarm/FaskaCrazyTaxiSwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var DESTINATIONS = [
	{
		country: "France",
		flag: "🇫🇷",
		landmark: "Eiffel Tower",
		color: "#3b82f6"
	},
	{
		country: "USA",
		flag: "🇺🇸",
		landmark: "Statue of Liberty",
		color: "#ef4444"
	},
	{
		country: "Japan",
		flag: "🇯🇵",
		landmark: "Tokyo Tower",
		color: "#f8fafc"
	},
	{
		country: "Italy",
		flag: "🇮🇹",
		landmark: "Colosseum",
		color: "#22c55e"
	},
	{
		country: "UK",
		flag: "🇬🇧",
		landmark: "Big Ben",
		color: "#1e3a8a"
	},
	{
		country: "Brazil",
		flag: "🇧🇷",
		landmark: "Christ the Redeemer",
		color: "#eab308"
	},
	{
		country: "Egypt",
		flag: "🇪🇬",
		landmark: "Pyramids",
		color: "#f59e0b"
	},
	{
		country: "Germany",
		flag: "🇩🇪",
		landmark: "Brandenburg Gate",
		color: "#64748b"
	}
];
var clamp = (val, min, max) => Math.min(Math.max(val, min), max);
var useKeys = () => {
	const [keys, setKeys] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => setKeys((k) => ({
			...k,
			[e.code]: true
		}));
		const handleKeyUp = (e) => setKeys((k) => ({
			...k,
			[e.code]: false
		}));
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);
	return keys;
};
var spawnPassenger = (buildings) => {
	const destBuildings = buildings.filter((b) => b.isDestination);
	const target = destBuildings[Math.floor(Math.random() * destBuildings.length)];
	const isXRoad = Math.random() > .5;
	const roadPos = [
		-80,
		-40,
		0,
		40,
		80
	][Math.floor(Math.random() * 5)];
	const crossPos = (Math.random() - .5) * 200;
	let px, pz;
	if (isXRoad) {
		px = crossPos;
		pz = roadPos;
	} else {
		px = roadPos;
		pz = crossPos;
	}
	return {
		position: [
			px,
			1,
			pz
		],
		targetData: target.destData,
		targetBuildingId: target.id,
		active: true
	};
};
var generateMap = () => {
	const buildings = [];
	const ramps = [];
	let destIndex = 0;
	for (let x = -100; x <= 100; x += 40) for (let z = -100; z <= 100; z += 40) {
		if (Math.random() < .2 && x !== 0 && z !== 0) {
			ramps.push({
				position: [
					x,
					0,
					z
				],
				rotation: [
					0,
					0,
					0
				]
			});
			continue;
		}
		const width = 20 + Math.random() * 10;
		const depth = 20 + Math.random() * 10;
		const height = 15 + Math.random() * 40;
		let isDestination = false;
		let destData = null;
		if ((Math.random() < .3 || x === 100) && destIndex < DESTINATIONS.length) {
			isDestination = true;
			destData = DESTINATIONS[destIndex];
			destIndex++;
		}
		buildings.push({
			id: `b_${x}_${z}`,
			position: [
				x,
				height / 2,
				z
			],
			size: [
				width,
				height,
				depth
			],
			isDestination,
			destData
		});
	}
	while (destIndex < DESTINATIONS.length) {
		const b = buildings[Math.floor(Math.random() * buildings.length)];
		if (!b.isDestination) {
			b.isDestination = true;
			b.destData = DESTINATIONS[destIndex];
			destIndex++;
		}
	}
	return {
		buildings,
		ramps
	};
};
var Car = ({ mapData, gameStateRef, updateGameState }) => {
	const meshRef = (0, import_react.useRef)();
	const keys = useKeys();
	const { camera } = useThree();
	const state = (0, import_react.useRef)({
		pos: new Vector3(0, 1, 0),
		vel: new Vector3(0, 0, 0),
		rotation: 0,
		speed: 0,
		isOnGround: true
	});
	useFrame((_, delta) => {
		if (gameStateRef.current.gameOver) return;
		const dt = clamp(delta, .001, .1);
		const accel = 60;
		const maxSpeed = 45;
		const maxReverse = 25;
		const friction = 25;
		const steerSpeed = 3.5;
		const gravity = -60;
		const jumpForce = 20;
		let forward = 0;
		if (keys["KeyW"] || keys["ArrowUp"]) forward += 1;
		if (keys["KeyS"] || keys["ArrowDown"]) forward -= 1;
		let turn = 0;
		if (keys["KeyA"] || keys["ArrowLeft"]) turn += 1;
		if (keys["KeyD"] || keys["ArrowRight"]) turn -= 1;
		if (forward > 0) state.current.speed += accel * dt;
		else if (forward < 0) state.current.speed -= accel * dt;
		else if (state.current.speed > 0) {
			state.current.speed -= friction * dt;
			if (state.current.speed < 0) state.current.speed = 0;
		} else if (state.current.speed < 0) {
			state.current.speed += friction * dt;
			if (state.current.speed > 0) state.current.speed = 0;
		}
		state.current.speed = clamp(state.current.speed, -maxReverse, maxSpeed);
		if (Math.abs(state.current.speed) > 1) {
			const turnDir = state.current.speed > 0 ? 1 : -1;
			state.current.rotation += turn * steerSpeed * turnDir * dt * (Math.abs(state.current.speed) / maxSpeed * .5 + .5);
		}
		const dir = new Vector3(Math.sin(state.current.rotation), 0, Math.cos(state.current.rotation));
		state.current.pos.x += dir.x * state.current.speed * dt;
		state.current.pos.z += dir.z * state.current.speed * dt;
		if (state.current.isOnGround) if (keys["Space"]) {
			state.current.vel.y = jumpForce;
			state.current.isOnGround = false;
		} else state.current.vel.y = 0;
		else state.current.vel.y += gravity * dt;
		state.current.pos.y += state.current.vel.y * dt;
		if (state.current.pos.y < 1) {
			state.current.pos.y = 1;
			state.current.isOnGround = true;
		}
		mapData.buildings.forEach((b) => {
			const hw = b.size[0] / 2;
			const hd = b.size[2] / 2;
			const dx = state.current.pos.x - b.position[0];
			const dz = state.current.pos.z - b.position[2];
			if (Math.abs(dx) < hw + 1.5 && Math.abs(dz) < hd + 1.5 && state.current.pos.y < b.size[1]) {
				const penX = hw + 1.5 - Math.abs(dx);
				const penZ = hd + 1.5 - Math.abs(dz);
				if (penX < penZ) {
					state.current.pos.x += Math.sign(dx) * penX;
					state.current.speed *= .5;
				} else {
					state.current.pos.z += Math.sign(dz) * penZ;
					state.current.speed *= .5;
				}
			}
		});
		mapData.ramps.forEach((r) => {
			const dx = state.current.pos.x - r.position[0];
			const dz = state.current.pos.z - r.position[2];
			if (Math.abs(dx) < 6 && Math.abs(dz) < 6 && state.current.isOnGround) {
				state.current.vel.y = 25;
				state.current.isOnGround = false;
				state.current.speed = Math.max(state.current.speed + 10, 35);
			}
		});
		if (mapData.passenger.active && !gameStateRef.current.hasPassenger) {
			const p = mapData.passenger;
			if (Math.hypot(state.current.pos.x - p.position[0], state.current.pos.z - p.position[2]) < 5) {
				mapData.passenger.active = false;
				updateGameState({
					hasPassenger: true,
					message: "Passenger picked up! Hurry to the destination!",
					passengerMsg: `Take me to the ${p.targetData.landmark}! (${p.targetData.country})`
				});
			}
		} else if (gameStateRef.current.hasPassenger) {
			const p = mapData.passenger;
			const targetBldg = mapData.buildings.find((b) => b.id === p.targetBuildingId);
			if (targetBldg) {
				const dx = state.current.pos.x - targetBldg.position[0];
				const dz = state.current.pos.z - targetBldg.position[2];
				if (Math.abs(dx) < targetBldg.size[0] / 2 + 10 && Math.abs(dz) < targetBldg.size[2] / 2 + 10) {
					updateGameState({
						hasPassenger: false,
						score: gameStateRef.current.score + 50,
						time: gameStateRef.current.time + 20,
						message: "Dropped off! +$50, +20s",
						passengerMsg: ""
					});
					setTimeout(() => {
						if (!gameStateRef.current.gameOver) {
							mapData.spawnNewPassenger();
							updateGameState({ message: "Find a new passenger!" });
						}
					}, 2e3);
				}
			}
		}
		state.current.pos.x = clamp(state.current.pos.x, -145, 145);
		state.current.pos.z = clamp(state.current.pos.z, -145, 145);
		meshRef.current.position.copy(state.current.pos);
		meshRef.current.rotation.y = state.current.rotation;
		const idealOffset = new Vector3(0, 6, -15);
		idealOffset.applyAxisAngle(new Vector3(0, 1, 0), state.current.rotation);
		idealOffset.add(state.current.pos);
		camera.position.lerp(idealOffset, .1);
		camera.lookAt(state.current.pos.x, state.current.pos.y + 2, state.current.pos.z);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: meshRef,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.5,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					2,
					1,
					4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "yellow" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					1.25,
					-.5
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.8,
					.8,
					2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.7,
					.5,
					2.01
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.4, .4] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "white" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.7,
					.5,
					2.01
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.4, .4] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "white" })]
			}),
			gameStateRef.current.hasPassenger && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
				position: [
					0,
					3,
					0
				],
				center: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						background: "white",
						padding: "2px 5px",
						borderRadius: "5px",
						fontSize: "20px"
					},
					children: "🚕"
				})
			})
		]
	});
};
var Passenger = ({ passengerData, isPickedUp }) => {
	const ref = (0, import_react.useRef)();
	useFrame(({ clock }) => {
		if (ref.current && passengerData.active) {
			ref.current.position.y = 1 + Math.sin(clock.elapsedTime * 5) * .2;
			ref.current.rotation.y += .05;
		}
	});
	if (!passengerData.active || isPickedUp) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		position: passengerData.position,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.5,
					.5,
					1.5,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "hotpink" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
				position: [
					0,
					1.5,
					0
				],
				center: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: { fontSize: "32px" },
					children: "🙋"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
				position: [
					0,
					2.5,
					0
				],
				center: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						background: "rgba(0,0,0,0.7)",
						color: "white",
						padding: "4px 8px",
						borderRadius: "8px",
						fontSize: "14px",
						whiteSpace: "nowrap"
					},
					children: "Taxi!"
				})
			})
		]
	});
};
var Buildings = ({ buildings }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: buildings.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: b.position,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: b.size }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: b.isDestination ? b.destData.color : "#333333" })]
		}), b.isDestination && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
			position: [
				0,
				b.size[1] / 2 + 3,
				0
			],
			center: true,
			zIndexRange: [100, 0],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					background: "rgba(0,0,0,0.8)",
					color: "white",
					padding: "6px 12px",
					borderRadius: "8px",
					fontSize: "28px",
					textAlign: "center",
					border: `3px solid ${b.destData.color}`,
					userSelect: "none",
					pointerEvents: "none",
					minWidth: "120px"
				},
				children: [
					b.destData.flag,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: {
							fontSize: "14px",
							fontWeight: "bold"
						},
						children: b.destData.country
					})
				]
			})
		})]
	}, b.id)) });
};
var Ramps = ({ ramps }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: ramps.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			r.position[0],
			.2,
			r.position[2]
		],
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			12,
			.4,
			12
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#ff5500",
			emissive: "#ff5500",
			emissiveIntensity: .5
		})]
	}, i)) });
};
var FaskaCrazyTaxiSwarm = ({ onExit }) => {
	const [gameState, setGameState] = (0, import_react.useState)({
		score: 0,
		time: 90,
		message: "Find a passenger!",
		passengerMsg: "",
		hasPassenger: false,
		gameOver: false
	});
	const gameStateRef = (0, import_react.useRef)(gameState);
	(0, import_react.useEffect)(() => {
		gameStateRef.current = gameState;
	}, [gameState]);
	const mapDataRef = (0, import_react.useRef)(null);
	if (!mapDataRef.current) {
		const data = generateMap();
		data.spawnNewPassenger = () => {
			data.passenger = spawnPassenger(data.buildings);
		};
		data.spawnNewPassenger();
		mapDataRef.current = data;
	}
	const updateGameState = (0, import_react.useCallback)((updates) => {
		setGameState((prev) => ({
			...prev,
			...updates
		}));
	}, []);
	(0, import_react.useEffect)(() => {
		const timer = setInterval(() => {
			setGameState((prev) => {
				if (prev.gameOver) {
					clearInterval(timer);
					return prev;
				}
				if (prev.time <= 1) {
					clearInterval(timer);
					return {
						...prev,
						time: 0,
						gameOver: true,
						message: "Game Over! Out of time.",
						passengerMsg: ""
					};
				}
				return {
					...prev,
					time: prev.time - 1
				};
			});
		}, 1e3);
		return () => clearInterval(timer);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100%",
			height: "100vh",
			position: "relative",
			overflow: "hidden",
			background: "#87ceeb"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
				shadows: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerspectiveCamera, {
						makeDefault: true,
						position: [
							0,
							10,
							-20
						],
						fov: 60
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, { sunPosition: [
						100,
						20,
						100
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .4 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
						position: [
							50,
							100,
							50
						],
						castShadow: true,
						intensity: 1,
						"shadow-mapSize": [2048, 2048],
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("orthographicCamera", {
							attach: "shadow-camera",
							args: [
								-150,
								150,
								150,
								-150
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						rotation: [
							-Math.PI / 2,
							0,
							0
						],
						receiveShadow: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [300, 300] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Buildings, { buildings: mapDataRef.current.buildings }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ramps, { ramps: mapDataRef.current.ramps }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Passenger, {
						passengerData: mapDataRef.current.passenger,
						isPickedUp: gameState.hasPassenger
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, {
						mapData: mapDataRef.current,
						gameStateRef,
						updateGameState
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 20,
					left: 20,
					color: "white",
					fontFamily: "sans-serif",
					textShadow: "2px 2px 0 #000",
					pointerEvents: "none",
					zIndex: 10
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							margin: 0,
							fontSize: "36px",
							color: "#facc15",
							textTransform: "uppercase",
							fontStyle: "italic"
						},
						children: "Faska Crazy Taxi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							fontSize: "28px",
							marginTop: "10px",
							fontWeight: "bold"
						},
						children: ["Time: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							style: { color: gameState.time <= 10 ? "#ef4444" : "white" },
							children: [gameState.time, "s"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							fontSize: "28px",
							marginTop: "5px",
							fontWeight: "bold"
						},
						children: ["Cash: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							style: { color: "#4ade80" },
							children: ["$", gameState.score]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							marginTop: "20px",
							fontSize: "22px",
							fontWeight: "bold",
							color: "#facc15"
						},
						children: gameState.message
					}),
					gameState.passengerMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							marginTop: "15px",
							padding: "15px",
							background: "rgba(255,255,255,0.95)",
							color: "#111",
							borderRadius: "12px",
							border: "4px solid #3b82f6",
							textShadow: "none",
							fontSize: "22px",
							fontWeight: "bold",
							maxWidth: "400px",
							boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
						},
						children: [
							"💬 \"",
							gameState.passengerMsg,
							"\""
						]
					}),
					gameState.gameOver && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							marginTop: "30px",
							padding: "20px",
							background: "rgba(0,0,0,0.8)",
							border: "4px solid #ef4444",
							borderRadius: "12px",
							fontSize: "32px",
							color: "#ef4444",
							fontWeight: "bold",
							boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
						},
						children: [
							"GAME OVER!",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								style: {
									color: "white",
									fontSize: "24px"
								},
								children: ["Final Score: $", gameState.score]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					top: 20,
					right: 20,
					padding: "12px 24px",
					fontSize: "20px",
					fontWeight: "bold",
					background: "#ef4444",
					color: "white",
					border: "2px solid white",
					borderRadius: "8px",
					cursor: "pointer",
					zIndex: 20,
					boxShadow: "0 4px 6px rgba(0,0,0,0.5)",
					textTransform: "uppercase"
				},
				onMouseOver: (e) => e.target.style.background = "#dc2626",
				onMouseOut: (e) => e.target.style.background = "#ef4444",
				children: "Beenden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					bottom: 20,
					right: 20,
					color: "white",
					fontFamily: "sans-serif",
					textShadow: "2px 2px 0 #000",
					pointerEvents: "none",
					zIndex: 10,
					textAlign: "right",
					fontSize: "18px",
					fontWeight: "bold"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: "#facc15" },
						children: "W A S D"
					}),
					" / ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: "#facc15" },
						children: "Arrows"
					}),
					" to Drive",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: "#facc15" },
						children: "SPACE"
					}),
					" to Jump / Trick"
				]
			})
		]
	});
};
//#endregion
export { FaskaCrazyTaxiSwarm as default };
