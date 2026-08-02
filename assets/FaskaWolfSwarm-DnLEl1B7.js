import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, ct as NearestFilter, s as useThree, t as Canvas, xt as RepeatWrapping, y as CanvasTexture } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, o as RigidBody, t as CapsuleCollider } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { t as PointerLockControls } from "./PointerLockControls-LuZl7kld.js";
import { t as Text } from "./Text-CuphjnHx.js";
//#region src/components/games/engines/FaskaWolfSwarm/FaskaWolfSwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var BLOCK_SIZE = 4;
var MAP = [
	"WWWWWWWWWW",
	"W P W    W",
	"W   W  C W",
	"WW WWW   W",
	"W  E W   W",
	"W WWWW   W",
	"W    W E W",
	"WWWW W   W",
	"WX D     W",
	"WWWWWWWWWW"
];
function generateBrickTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 128;
	canvas.height = 128;
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "#5c4033";
	ctx.fillRect(0, 0, 128, 128);
	ctx.fillStyle = "#b0a090";
	for (let y = 0; y < 128; y += 32) {
		ctx.fillRect(0, y, 128, 2);
		const offset = y / 32 % 2 === 0 ? 0 : 32;
		for (let x = 0; x < 128; x += 64) {
			let vx = x + offset;
			if (vx > 128) vx -= 128;
			ctx.fillRect(vx, y, 2, 32);
		}
	}
	for (let i = 0; i < 500; i++) {
		ctx.fillStyle = `rgba(0,0,0,${Math.random() * .15})`;
		ctx.fillRect(Math.random() * 128, Math.random() * 128, 2, 2);
	}
	const texture = new CanvasTexture(canvas);
	texture.magFilter = NearestFilter;
	return texture;
}
function generateFloorTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 128;
	canvas.height = 128;
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "#223322";
	ctx.fillRect(0, 0, 128, 128);
	for (let i = 0; i < 800; i++) {
		ctx.fillStyle = `rgba(0,0,0,${Math.random() * .3})`;
		ctx.fillRect(Math.random() * 128, Math.random() * 128, 4, 4);
	}
	const texture = new CanvasTexture(canvas);
	texture.magFilter = NearestFilter;
	return texture;
}
function generateEnemyTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 128;
	canvas.height = 128;
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, 128, 128);
	ctx.fillStyle = "#2a4a2a";
	ctx.beginPath();
	ctx.arc(64, 80, 40, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#3a6a3a";
	ctx.beginPath();
	ctx.arc(64, 48, 30, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#ff2222";
	ctx.beginPath();
	ctx.arc(50, 45, 6, 0, Math.PI * 2);
	ctx.arc(78, 45, 6, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#000";
	ctx.fillRect(54, 60, 20, 4);
	const texture = new CanvasTexture(canvas);
	texture.magFilter = NearestFilter;
	return texture;
}
var Player = ({ startPos, doorPos, winPos, setNearDoor, gameState, gameStateRef }) => {
	const bodyRef = (0, import_react.useRef)();
	const { camera } = useThree();
	const speed = 15;
	const moveState = (0, import_react.useRef)({
		forward: false,
		backward: false,
		left: false,
		right: false
	});
	const [recoil, setRecoil] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const onKeyDown = (e) => {
			if (gameStateRef.current !== "playing") return;
			switch (e.code) {
				case "KeyW":
					moveState.current.forward = true;
					break;
				case "KeyS":
					moveState.current.backward = true;
					break;
				case "KeyA":
					moveState.current.left = true;
					break;
				case "KeyD":
					moveState.current.right = true;
					break;
			}
		};
		const onKeyUp = (e) => {
			switch (e.code) {
				case "KeyW":
					moveState.current.forward = false;
					break;
				case "KeyS":
					moveState.current.backward = false;
					break;
				case "KeyA":
					moveState.current.left = false;
					break;
				case "KeyD":
					moveState.current.right = false;
					break;
			}
		};
		const onMouseDown = () => {
			if (gameStateRef.current === "playing") setRecoil(.15);
		};
		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("keyup", onKeyUp);
		document.addEventListener("mousedown", onMouseDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.removeEventListener("keyup", onKeyUp);
			document.removeEventListener("mousedown", onMouseDown);
		};
	}, [gameStateRef]);
	const nearDoorRef = (0, import_react.useRef)(false);
	useFrame(() => {
		if (!bodyRef.current) return;
		const p = bodyRef.current.translation();
		const isNearDoor = Math.hypot(p.x - doorPos[0], p.z - doorPos[2]) < 5;
		if (isNearDoor !== nearDoorRef.current) {
			nearDoorRef.current = isNearDoor;
			setNearDoor(isNearDoor);
		}
		if (Math.hypot(p.x - winPos[0], p.z - winPos[2]) < 3 && gameStateRef.current === "playing") document.dispatchEvent(new CustomEvent("GAME_WON"));
		if (gameStateRef.current !== "playing") {
			bodyRef.current.setLinvel({
				x: 0,
				y: 0,
				z: 0
			}, true);
			return;
		}
		const velocity = bodyRef.current.linvel();
		const cameraDirection = new Vector3();
		camera.getWorldDirection(cameraDirection);
		cameraDirection.y = 0;
		cameraDirection.normalize();
		const cameraRight = new Vector3().crossVectors(camera.up, cameraDirection).normalize();
		const moveDir = new Vector3();
		if (moveState.current.forward) moveDir.add(cameraDirection);
		if (moveState.current.backward) moveDir.sub(cameraDirection);
		if (moveState.current.left) moveDir.add(cameraRight);
		if (moveState.current.right) moveDir.sub(cameraRight);
		if (moveDir.lengthSq() > 0) moveDir.normalize().multiplyScalar(speed);
		bodyRef.current.setLinvel({
			x: moveDir.x,
			y: velocity.y,
			z: moveDir.z
		}, true);
		let shakeOffset = 0;
		if (recoil > 0) {
			shakeOffset = (Math.random() - .5) * recoil;
			setRecoil((r) => r * .8 < .01 ? 0 : r * .8);
		}
		camera.position.set(p.x, p.y + .8 + shakeOffset, p.z);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: bodyRef,
		position: startPos,
		colliders: false,
		mass: 1,
		type: "dynamic",
		enabledRotations: [
			false,
			false,
			false
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapsuleCollider, { args: [.7, .4] })
	});
};
var Clue = ({ position }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					BLOCK_SIZE / 2,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					BLOCK_SIZE,
					BLOCK_SIZE,
					BLOCK_SIZE
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#444" })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				0,
				BLOCK_SIZE / 2,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						0,
						.5,
						BLOCK_SIZE / 2 + .01
					],
					fontSize: .4,
					color: "yellow",
					children: "Rome fell in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						0,
						-.5,
						BLOCK_SIZE / 2 + .01
					],
					fontSize: .8,
					color: "yellow",
					children: "476"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						0,
						.5,
						-BLOCK_SIZE / 2 - .01
					],
					fontSize: .4,
					color: "yellow",
					rotation: [
						0,
						Math.PI,
						0
					],
					children: "Rome fell in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						0,
						-.5,
						-BLOCK_SIZE / 2 - .01
					],
					fontSize: .8,
					color: "yellow",
					rotation: [
						0,
						Math.PI,
						0
					],
					children: "476"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						BLOCK_SIZE / 2 + .01,
						.5,
						0
					],
					fontSize: .4,
					color: "yellow",
					rotation: [
						0,
						Math.PI / 2,
						0
					],
					children: "Rome fell in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						BLOCK_SIZE / 2 + .01,
						-.5,
						0
					],
					fontSize: .8,
					color: "yellow",
					rotation: [
						0,
						Math.PI / 2,
						0
					],
					children: "476"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						-BLOCK_SIZE / 2 - .01,
						.5,
						0
					],
					fontSize: .4,
					color: "yellow",
					rotation: [
						0,
						-Math.PI / 2,
						0
					],
					children: "Rome fell in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						-BLOCK_SIZE / 2 - .01,
						-.5,
						0
					],
					fontSize: .8,
					color: "yellow",
					rotation: [
						0,
						-Math.PI / 2,
						0
					],
					children: "476"
				})
			]
		})]
	});
};
var Door = ({ position, isUnlocked }) => {
	if (isUnlocked) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "fixed",
		position,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				BLOCK_SIZE / 2,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					BLOCK_SIZE,
					BLOCK_SIZE,
					BLOCK_SIZE
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#112233" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						0,
						0,
						BLOCK_SIZE / 2 + .01
					],
					fontSize: .8,
					color: "#ff4444",
					children: "LOCKED"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						0,
						0,
						-BLOCK_SIZE / 2 - .01
					],
					fontSize: .8,
					color: "#ff4444",
					rotation: [
						0,
						Math.PI,
						0
					],
					children: "LOCKED"
				})
			]
		})
	});
};
var Enemy = ({ position, texture, onHit }) => {
	const [dead, setDead] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)();
	useFrame((state) => {
		if (!dead && ref.current) {
			const camPos = state.camera.position;
			ref.current.lookAt(camPos.x, ref.current.position.y, camPos.z);
		}
	});
	const handleHit = (e) => {
		e.stopPropagation();
		if (!dead) {
			setDead(true);
			if (onHit) onHit(position);
		}
	};
	if (dead) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					BLOCK_SIZE / 2,
					0
				],
				visible: false,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					BLOCK_SIZE * .8,
					BLOCK_SIZE,
					BLOCK_SIZE * .8
				] })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref,
			position: [
				0,
				BLOCK_SIZE / 2,
				0
			],
			onPointerDown: handleHit,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [BLOCK_SIZE * .8, BLOCK_SIZE * .8] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				map: texture,
				transparent: true,
				alphaTest: .5,
				side: 2
			})]
		})]
	});
};
var Level = ({ doorUnlocked, setNearDoor, gameState, gameStateRef }) => {
	const mapData = (0, import_react.useMemo)(() => {
		const data = {
			walls: [],
			clues: [],
			enemies: [],
			player: [
				0,
				2,
				0
			],
			door: [
				0,
				0,
				0
			],
			win: [
				0,
				0,
				0
			]
		};
		MAP.forEach((row, z) => {
			for (let x = 0; x < row.length; x++) {
				const char = row[x];
				const posX = x * BLOCK_SIZE;
				const posZ = z * BLOCK_SIZE;
				if (char === "W") data.walls.push([
					posX,
					0,
					posZ
				]);
				else if (char === "P") data.player = [
					posX,
					2,
					posZ
				];
				else if (char === "E") data.enemies.push([
					posX,
					0,
					posZ
				]);
				else if (char === "C") data.clues.push([
					posX,
					0,
					posZ
				]);
				else if (char === "D") data.door = [
					posX,
					0,
					posZ
				];
				else if (char === "X") data.win = [
					posX,
					0,
					posZ
				];
			}
		});
		return data;
	}, []);
	const brickTexture = (0, import_react.useMemo)(generateBrickTexture, []);
	const floorTexture = (0, import_react.useMemo)(() => {
		const tex = generateFloorTexture();
		tex.wrapS = tex.wrapT = RepeatWrapping;
		tex.repeat.set(MAP[0].length, MAP.length);
		return tex;
	}, []);
	const enemyTexture = (0, import_react.useMemo)(generateEnemyTexture, []);
	const [particles, setParticles] = (0, import_react.useState)([]);
	const handleEnemyHit = (pos) => {
		const newParts = Array.from({ length: 8 }).map(() => ({
			id: Math.random(),
			position: [
				pos[0] + (Math.random() - .5) * 2,
				pos[1] + BLOCK_SIZE / 2 + (Math.random() - .5) * 2,
				pos[2] + (Math.random() - .5) * 2
			]
		}));
		setParticles((prev) => [...prev, ...newParts]);
	};
	const centerX = (MAP[0].length - 1) * BLOCK_SIZE / 2;
	const centerZ = (MAP.length - 1) * BLOCK_SIZE / 2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
		gravity: [
			0,
			-30,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				position: [
					centerX,
					0,
					centerZ
				],
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					rotation: [
						-Math.PI / 2,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [MAP[0].length * BLOCK_SIZE, MAP.length * BLOCK_SIZE] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: floorTexture })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					centerX,
					BLOCK_SIZE,
					centerZ
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [MAP[0].length * BLOCK_SIZE, MAP.length * BLOCK_SIZE] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#0a0a0a" })]
			}),
			mapData.walls.map((pos, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				position: pos,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						BLOCK_SIZE / 2,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						BLOCK_SIZE,
						BLOCK_SIZE,
						BLOCK_SIZE
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: brickTexture })]
				})
			}, `wall-${i}`)),
			mapData.clues.map((pos, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clue, { position: pos }, `clue-${i}`)),
			mapData.enemies.map((pos, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Enemy, {
				position: pos,
				texture: enemyTexture,
				onHit: handleEnemyHit
			}, `enemy-${i}`)),
			particles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				position: p.position,
				colliders: "cuboid",
				mass: .2,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.3,
					.3,
					.3
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#aa2222" })] })
			}, p.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Door, {
				position: mapData.door,
				isUnlocked: doorUnlocked
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					mapData.win[0],
					.05,
					mapData.win[2]
				],
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [BLOCK_SIZE, BLOCK_SIZE] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#44ff44" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {
				startPos: mapData.player,
				doorPos: mapData.door,
				winPos: mapData.win,
				setNearDoor,
				gameState,
				gameStateRef
			})
		]
	});
};
function FaskaWolfSwarm({ onExit }) {
	const [gameState, setGameState] = (0, import_react.useState)("start");
	const [isDoorUnlocked, setIsDoorUnlocked] = (0, import_react.useState)(false);
	const [nearDoor, setNearDoor] = (0, import_react.useState)(false);
	const [pinInput, setPinInput] = (0, import_react.useState)("");
	const [pinError, setPinError] = (0, import_react.useState)("");
	const gameStateRef = (0, import_react.useRef)(gameState);
	(0, import_react.useEffect)(() => {
		gameStateRef.current = gameState;
	}, [gameState]);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.code === "KeyE" && gameStateRef.current === "playing" && nearDoor && !isDoorUnlocked) {
				setGameState("pin_input");
				document.exitPointerLock();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [nearDoor, isDoorUnlocked]);
	(0, import_react.useEffect)(() => {
		const handleWin = () => {
			setGameState("won");
			document.exitPointerLock();
		};
		document.addEventListener("GAME_WON", handleWin);
		return () => document.removeEventListener("GAME_WON", handleWin);
	}, []);
	const checkPin = () => {
		if (pinInput === "476") {
			setIsDoorUnlocked(true);
			setGameState("paused");
			setPinInput("");
			setPinError("");
		} else {
			setPinError("Incorrect PIN! Try again.");
			setPinInput("");
		}
	};
	const cancelPin = () => {
		setGameState("paused");
		setPinInput("");
		setPinError("");
	};
	const overlayStyle = {
		position: "absolute",
		inset: 0,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0.75)",
		color: "white",
		zIndex: 10,
		pointerEvents: "none"
	};
	const interactiveOverlayStyle = {
		...overlayStyle,
		pointerEvents: "auto"
	};
	const btnStyle = {
		padding: "10px 25px",
		margin: "0 10px",
		fontSize: "18px",
		cursor: "pointer",
		backgroundColor: "#333",
		color: "white",
		border: "2px solid #aaa",
		borderRadius: "4px",
		textTransform: "uppercase",
		fontWeight: "bold"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100%",
			height: "100vh",
			backgroundColor: "#000",
			fontFamily: "monospace"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					inset: 0,
					pointerEvents: gameState === "pin_input" || gameState === "won" ? "none" : "auto"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, {
						sunPosition: [
							100,
							20,
							100
						],
						turbidity: 10,
						rayleigh: 2
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .6 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
						position: [
							10,
							20,
							5
						],
						intensity: 1.5
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Level, {
						doorUnlocked: isDoorUnlocked,
						setNearDoor,
						gameState,
						gameStateRef
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PointerLockControls, {
						onUnlock: () => {
							if (gameStateRef.current === "playing") setGameState("paused");
						},
						onLock: () => {
							if (gameStateRef.current === "paused" || gameStateRef.current === "start") setGameState("playing");
						}
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					top: 20,
					right: 20,
					zIndex: 1e3,
					padding: "10px 20px",
					fontSize: "16px",
					cursor: "pointer",
					backgroundColor: "#ff4444",
					color: "white",
					border: "none",
					borderRadius: "5px",
					pointerEvents: "auto",
					fontWeight: "bold"
				},
				children: "Beenden"
			}),
			gameState === "start" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: overlayStyle,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							fontSize: "64px",
							marginBottom: "10px",
							color: "#ff4444"
						},
						children: "FASKA WOLF SWARM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							fontSize: "24px",
							marginBottom: "20px"
						},
						children: "Click anywhere to Start"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							backgroundColor: "rgba(0,0,0,0.5)",
							padding: "20px",
							borderRadius: "8px",
							textAlign: "center"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "WASD" }),
								" to move, ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Mouse" }),
								" to look & shoot"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "E" }), " to interact with objects"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								style: {
									marginTop: "15px",
									color: "#aaa"
								},
								children: "Find the Clue and escape the maze."
							})
						]
					})
				]
			}),
			gameState === "paused" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: overlayStyle,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					style: { fontSize: "48px" },
					children: "PAUSED"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: { fontSize: "24px" },
					children: "Click anywhere to Resume"
				})]
			}),
			gameState === "pin_input" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: interactiveOverlayStyle,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						backgroundColor: "#222",
						padding: "40px",
						borderRadius: "10px",
						border: "2px solid #444",
						textAlign: "center"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							style: {
								fontSize: "32px",
								marginBottom: "20px"
							},
							children: "ENTER 3-DIGIT PIN"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							maxLength: 3,
							value: pinInput,
							onChange: (e) => setPinInput(e.target.value.replace(/\D/g, "")),
							style: {
								fontSize: "48px",
								padding: "10px",
								width: "120px",
								textAlign: "center",
								marginBottom: "20px",
								backgroundColor: "#000",
								color: "#fff",
								border: "2px solid #555"
							},
							autoFocus: true
						}),
						pinError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								color: "#ff4444",
								fontSize: "18px",
								marginBottom: "20px"
							},
							children: pinError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: checkPin,
							style: btnStyle,
							children: "Unlock"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: cancelPin,
							style: btnStyle,
							children: "Cancel"
						})] })
					]
				})
			}),
			gameState === "won" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: interactiveOverlayStyle,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							fontSize: "64px",
							color: "#44ff44",
							marginBottom: "10px"
						},
						children: "ESCAPE SUCCESSFUL!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							fontSize: "24px",
							marginBottom: "30px"
						},
						children: "You survived the maze."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onExit,
						style: {
							...btnStyle,
							backgroundColor: "#44ff44",
							color: "#000"
						},
						children: "Exit Game"
					})
				]
			}),
			gameState === "playing" && nearDoor && !isDoorUnlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					bottom: 100,
					left: "50%",
					transform: "translateX(-50%)",
					color: "white",
					fontSize: "24px",
					pointerEvents: "none",
					backgroundColor: "rgba(0,0,0,0.7)",
					padding: "10px 20px",
					borderRadius: "8px",
					border: "1px solid #555"
				},
				children: [
					"Press ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "'E'" }),
					" to unlock door"
				]
			}),
			gameState === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				top: "50%",
				left: "50%",
				width: 8,
				height: 8,
				backgroundColor: "rgba(255, 255, 255, 0.8)",
				borderRadius: "50%",
				transform: "translate(-50%, -50%)",
				pointerEvents: "none",
				zIndex: 5
			} })
		]
	});
}
//#endregion
export { FaskaWolfSwarm as default };
