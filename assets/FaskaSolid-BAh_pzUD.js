import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, s as useThree, t as Canvas, yt as Raycaster } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Text } from "./Text-CuphjnHx.js";
//#region src/components/games/engines/FaskaSolid/FaskaSolid.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var GameContext = (0, import_react.createContext)();
var dates = [
	{
		year: "1492",
		text: "Columbus reaches the Americas",
		pos: [
			-8,
			0,
			-8
		]
	},
	{
		year: "1789",
		text: "French Revolution",
		pos: [
			8,
			0,
			-8
		]
	},
	{
		year: "1914",
		text: "Start of WWI",
		pos: [
			8,
			0,
			8
		]
	},
	{
		year: "1945",
		text: "End of WWII",
		pos: [
			-8,
			0,
			8
		]
	},
	{
		year: "1969",
		text: "Moon Landing",
		pos: [
			0,
			0,
			0
		]
	}
];
var crates = [
	[
		-4,
		1,
		-4
	],
	[
		4,
		1,
		-4
	],
	[
		-4,
		1,
		4
	],
	[
		4,
		1,
		4
	],
	[
		0,
		1,
		-6
	],
	[
		0,
		1,
		6
	],
	[
		-6,
		1,
		0
	],
	[
		6,
		1,
		0
	],
	[
		-10,
		1,
		0
	],
	[
		10,
		1,
		0
	]
];
var guardPaths = [
	[[
		-6,
		0,
		-4
	], [
		-6,
		0,
		4
	]],
	[[
		6,
		0,
		4
	], [
		6,
		0,
		-4
	]],
	[[
		-2,
		0,
		2
	], [
		2,
		0,
		2
	]],
	[[
		-8,
		0,
		-2
	], [
		-10,
		0,
		-2
	]]
];
function useKeys() {
	const [keys, setKeys] = (0, import_react.useState)({
		forward: false,
		backward: false,
		left: false,
		right: false
	});
	(0, import_react.useEffect)(() => {
		const down = (e) => {
			if (e.key === "w" || e.key === "ArrowUp") setKeys((k) => ({
				...k,
				forward: true
			}));
			if (e.key === "s" || e.key === "ArrowDown") setKeys((k) => ({
				...k,
				backward: true
			}));
			if (e.key === "a" || e.key === "ArrowLeft") setKeys((k) => ({
				...k,
				left: true
			}));
			if (e.key === "d" || e.key === "ArrowRight") setKeys((k) => ({
				...k,
				right: true
			}));
		};
		const up = (e) => {
			if (e.key === "w" || e.key === "ArrowUp") setKeys((k) => ({
				...k,
				forward: false
			}));
			if (e.key === "s" || e.key === "ArrowDown") setKeys((k) => ({
				...k,
				backward: false
			}));
			if (e.key === "a" || e.key === "ArrowLeft") setKeys((k) => ({
				...k,
				left: false
			}));
			if (e.key === "d" || e.key === "ArrowRight") setKeys((k) => ({
				...k,
				right: false
			}));
		};
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
		};
	}, []);
	return keys;
}
var Player = ({ startPos }) => {
	const ref = (0, import_react.useRef)();
	const keys = useKeys();
	const { setPlayerPos, gameState } = (0, import_react.useContext)(GameContext);
	useFrame(() => {
		if (!ref.current || gameState !== "playing") return;
		const speed = 6;
		const linvel = ref.current.linvel();
		let dx = 0;
		let dz = 0;
		if (keys.forward) dz -= 1;
		if (keys.backward) dz += 1;
		if (keys.left) dx -= 1;
		if (keys.right) dx += 1;
		if (dx !== 0 && dz !== 0) {
			const length = Math.sqrt(dx * dx + dz * dz);
			dx /= length;
			dz /= length;
		}
		ref.current.setLinvel({
			x: dx * speed,
			y: linvel.y,
			z: dz * speed
		}, true);
		setPlayerPos(ref.current.translation());
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref,
		position: startPos,
		lockRotations: true,
		type: "dynamic",
		colliders: "ball",
		name: "player",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.5,
				32,
				32
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#0088ff" })]
		})
	});
};
var Guard = ({ path }) => {
	const groupRef = (0, import_react.useRef)();
	const [targetIdx, setTargetIdx] = (0, import_react.useState)(0);
	const { playerPos, onCaught, gameState } = (0, import_react.useContext)(GameContext);
	const { scene } = useThree();
	useFrame((state, delta) => {
		if (!groupRef.current || gameState !== "playing") return;
		const pos = groupRef.current.position;
		const target = path[targetIdx];
		const dir = new Vector3(target[0] - pos.x, 0, target[2] - pos.z);
		if (dir.length() < .1) setTargetIdx((targetIdx + 1) % path.length);
		else {
			dir.normalize();
			pos.add(dir.clone().multiplyScalar(3 * delta));
			const angle = Math.atan2(dir.x, dir.z);
			groupRef.current.rotation.y = angle;
		}
		if (!playerPos) return;
		const pPos = new Vector3(playerPos.x, playerPos.y, playerPos.z);
		const gPos = groupRef.current.position.clone().add(new Vector3(0, 1, 0));
		pPos.y = 1;
		const distToPlayer = gPos.distanceTo(pPos);
		if (distToPlayer < 7) {
			const dirToPlayer = pPos.clone().sub(gPos).normalize();
			if (new Vector3(0, 0, 1).applyEuler(groupRef.current.rotation).normalize().angleTo(dirToPlayer) < Math.PI / 4) {
				const intersects = new Raycaster(gPos, dirToPlayer, 0, distToPlayer).intersectObjects(scene.children, true);
				let sightBlocked = false;
				for (let hit of intersects) if (hit.object.userData?.isObstacle) {
					sightBlocked = true;
					break;
				}
				if (!sightBlocked) onCaught();
			}
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: groupRef,
		position: path[0],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					1,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.5,
					.5,
					2,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#cc0000" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					1.5,
					.4
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.6,
					.2,
					.2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					1,
					3.5
				],
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
					3.5,
					7,
					16,
					1,
					true
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color: "red",
					transparent: true,
					opacity: .15,
					side: 2
				})]
			})
		]
	});
};
var DatePad = ({ dateInfo, index }) => {
	const { currentObjective, onDateCollected } = (0, import_react.useContext)(GameContext);
	const isTarget = currentObjective === index;
	const isCollected = currentObjective > index;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: dateInfo.pos,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				colliders: "cuboid",
				sensor: true,
				onIntersectionEnter: (e) => {
					if (e.other.rigidBodyObject?.name === "player" && isTarget) onDateCollected(index);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.1,
						0
					],
					receiveShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						2,
						.2,
						2
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: isCollected ? "#555" : isTarget ? "#00ffaa" : "#aaaaaa" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				position: [
					0,
					.25,
					0
				],
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				fontSize: .4,
				color: "black",
				anchorX: "center",
				anchorY: "middle",
				children: dateInfo.year
			}),
			isTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				position: [
					0,
					1.5,
					0
				],
				fontSize: .3,
				color: "white",
				outlineColor: "black",
				outlineWidth: .05,
				children: "TARGET"
			})
		]
	});
};
var CameraFollow = () => {
	const { playerPos } = (0, import_react.useContext)(GameContext);
	const vec = new Vector3();
	useFrame((state) => {
		if (playerPos) {
			const targetPos = vec.set(playerPos.x, playerPos.y + 14, playerPos.z + 12);
			state.camera.position.lerp(targetPos, .1);
			state.camera.lookAt(playerPos.x, playerPos.y, playerPos.z);
		}
	});
	return null;
};
function FaskaSolid({ onExit }) {
	const [gameState, setGameState] = (0, import_react.useState)("playing");
	const [currentObjective, setCurrentObjective] = (0, import_react.useState)(0);
	const [playerPos, setPlayerPos] = (0, import_react.useState)({
		x: 0,
		y: 2,
		z: 12
	});
	const onCaught = () => {
		if (gameState === "playing") setGameState("caught");
	};
	const onDateCollected = (index) => {
		if (index === currentObjective) if (index === dates.length - 1) setGameState("won");
		else setCurrentObjective((idx) => idx + 1);
	};
	const resetGame = () => {
		setGameState("playing");
		setCurrentObjective(0);
		setPlayerPos({
			x: 0,
			y: 2,
			z: 12
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100vw",
			height: "100vh",
			position: "relative",
			overflow: "hidden",
			backgroundColor: "#111"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 20,
					left: 20,
					zIndex: 10,
					color: "white",
					fontFamily: "monospace",
					textShadow: "1px 1px 2px black"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							margin: 0,
							color: "#00ffcc"
						},
						children: "FaskaSolid"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sneak past the guards and learn history!" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							marginTop: 10,
							padding: 15,
							background: "rgba(0,0,0,0.7)",
							borderRadius: 8,
							border: "1px solid #333"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							style: {
								margin: "0 0 10px 0",
								color: "#aaa"
							},
							children: "Current Objective:"
						}), currentObjective < dates.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							style: {
								margin: 0,
								fontSize: 18,
								color: "#00ffaa",
								fontWeight: "bold"
							},
							children: [
								"Find ",
								dates[currentObjective].year,
								": ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										color: "white",
										fontSize: 14
									},
									children: dates[currentObjective].text
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								margin: 0,
								fontSize: 20,
								color: "gold",
								fontWeight: "bold"
							},
							children: "All Dates Collected!"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					top: 20,
					right: 20,
					zIndex: 10,
					padding: "10px 20px",
					fontSize: "16px",
					fontWeight: "bold",
					backgroundColor: "#ff3333",
					color: "white",
					border: "none",
					borderRadius: "5px",
					cursor: "pointer",
					boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
				},
				children: "Beenden"
			}),
			gameState === "caught" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					backgroundColor: "rgba(200, 0, 0, 0.6)",
					zIndex: 20,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					style: {
						fontSize: "6rem",
						color: "white",
						textShadow: "4px 4px 0 #000",
						margin: 0
					},
					children: "CAUGHT!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: resetGame,
					style: {
						marginTop: 30,
						padding: "15px 30px",
						fontSize: "20px",
						fontWeight: "bold",
						cursor: "pointer",
						border: "none",
						borderRadius: 8,
						backgroundColor: "white",
						color: "red"
					},
					children: "Restart Mission"
				})]
			}),
			gameState === "won" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					backgroundColor: "rgba(0, 200, 0, 0.6)",
					zIndex: 20,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							fontSize: "5rem",
							color: "white",
							textShadow: "4px 4px 0 #000",
							margin: 0
						},
						children: "MISSION ACCOMPLISHED"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: "white",
							fontSize: "1.5rem",
							background: "rgba(0,0,0,0.8)",
							padding: 15,
							borderRadius: 8,
							marginTop: 20
						},
						children: "History secured. Excellent work, agent."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: resetGame,
						style: {
							marginTop: 30,
							padding: "15px 30px",
							fontSize: "20px",
							fontWeight: "bold",
							cursor: "pointer",
							border: "none",
							borderRadius: 8,
							backgroundColor: "white",
							color: "green"
						},
						children: "Play Again"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameContext.Provider, {
				value: {
					gameState,
					currentObjective,
					playerPos,
					setPlayerPos,
					onCaught,
					onDateCollected
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
					camera: {
						position: [
							0,
							15,
							15
						],
						fov: 50
					},
					children: [
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, { children: [
							gameState === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, { startPos: [
								0,
								2,
								12
							] }),
							gameState === "playing" && guardPaths.map((path, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Guard, { path }, `guard-${i}`)),
							crates.map((pos, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
								type: "fixed",
								colliders: "cuboid",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
									position: pos,
									userData: { isObstacle: true },
									castShadow: true,
									receiveShadow: true,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
										2,
										2,
										2
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8B4513" })]
								})
							}, `crate-${i}`)),
							dates.map((date, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePad, {
								dateInfo: date,
								index: i
							}, `date-${i}`)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
								type: "fixed",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
									rotation: [
										-Math.PI / 2,
										0,
										0
									],
									receiveShadow: true,
									userData: { isObstacle: true },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [40, 40] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2a2a2a" })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
								type: "fixed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
										position: [
											0,
											2,
											-15
										],
										userData: { isObstacle: true },
										receiveShadow: true,
										castShadow: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
											30,
											4,
											1
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#444" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
										position: [
											0,
											2,
											15
										],
										userData: { isObstacle: true },
										receiveShadow: true,
										castShadow: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
											30,
											4,
											1
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#444" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
										position: [
											-15,
											2,
											0
										],
										userData: { isObstacle: true },
										receiveShadow: true,
										castShadow: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
											1,
											4,
											30
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#444" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
										position: [
											15,
											2,
											0
										],
										userData: { isObstacle: true },
										receiveShadow: true,
										castShadow: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
											1,
											4,
											30
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#444" })]
									})
								]
							})
						] }, gameState === "playing" ? "playing" : "stopped"),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraFollow, {})
					]
				})
			})
		]
	});
}
//#endregion
export { FaskaSolid as default };
