import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { a as useFrame, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as create } from "./react-B1iXS_n6.js";
import { n as useKeyboardControls, t as KeyboardControls } from "./KeyboardControls-e2HMFd2c.js";
import { a as Physics, n as CuboidCollider, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as useTexture } from "./Texture-BOsfVZMl.js";
import { t as Stars } from "./Stars-7m8Mrcxr.js";
//#region src/components/games/engines/FaskaSpaceOdyssey/GameLogic.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var useGameLogic = create((set, get) => ({
	gameState: "menu",
	score: 0,
	health: 100,
	bossHealth: 1e3,
	playerPosition: [
		0,
		0,
		0
	],
	enemies: [],
	projectiles: [],
	bossProjectiles: [],
	startGame: () => set({
		gameState: "playing",
		score: 0,
		health: 100,
		enemies: [],
		projectiles: [],
		bossProjectiles: []
	}),
	resetGame: () => set({
		gameState: "menu",
		score: 0,
		health: 100,
		bossHealth: 1e3
	}),
	setPlayerPosition: (pos) => set({ playerPosition: pos }),
	spawnEnemy: () => {
		const { gameState, enemies } = get();
		if (gameState !== "playing") return;
		const newEnemy = {
			id: Math.random().toString(36),
			position: [
				(Math.random() - .5) * 40,
				(Math.random() - .5) * 20,
				-50
			]
		};
		set({ enemies: [...enemies, newEnemy] });
	},
	spawnProjectile: (pos) => {
		const { gameState, projectiles } = get();
		if (gameState !== "playing" && gameState !== "boss") return;
		const newProjectile = {
			id: Math.random().toString(36),
			position: [...pos]
		};
		set({ projectiles: [...projectiles, newProjectile] });
	},
	updateProjectiles: () => {
		const { projectiles } = get();
		set({ projectiles: projectiles.map((p) => ({
			...p,
			position: [
				p.position[0],
				p.position[1],
				p.position[2] - 1
			]
		})).filter((p) => p.position[2] > -100) });
	},
	updateEnemies: () => {
		const { enemies, gameState } = get();
		if (gameState !== "playing") return;
		set({ enemies: enemies.map((e) => ({
			...e,
			position: [
				e.position[0],
				e.position[1],
				e.position[2] + .2
			]
		})).filter((e) => e.position[2] < 20) });
	},
	damagePlayer: (amount) => {
		const { health } = get();
		const newHealth = health - amount;
		if (newHealth <= 0) set({
			health: 0,
			gameState: "gameover"
		});
		else set({ health: newHealth });
	},
	damageEnemy: (id) => {
		const { enemies, score } = get();
		const newScore = score + 100;
		set({
			enemies: enemies.filter((e) => e.id !== id),
			score: newScore,
			gameState: newScore >= 1e3 ? "boss" : get().gameState
		});
	},
	damageBoss: () => {
		const { bossHealth, score } = get();
		const newHealth = bossHealth - 50;
		if (newHealth <= 0) set({
			bossHealth: 0,
			gameState: "victory",
			score: score + 5e3
		});
		else set({
			bossHealth: newHealth,
			score: score + 50
		});
	}
}));
//#endregion
//#region src/components/games/engines/FaskaSpaceOdyssey/Player.jsx
var import_jsx_runtime = require_jsx_runtime();
var Player = () => {
	const [, getKeys] = useKeyboardControls();
	const playerRef = (0, import_react.useRef)();
	const { setPlayerPosition, spawnProjectile } = useGameLogic();
	const lastShootTime = (0, import_react.useRef)(0);
	const texture = useTexture("/faska-flow-pro/textures/fzero_ship.png");
	useFrame(({ clock }) => {
		if (!playerRef.current) return;
		const keys = getKeys();
		const pos = playerRef.current.translation();
		const speed = .5;
		if (keys.forward && pos.y < 10) pos.y += speed;
		if (keys.backward && pos.y > -10) pos.y -= speed;
		if (keys.left && pos.x > -20) pos.x -= speed;
		if (keys.right && pos.x < 20) pos.x += speed;
		playerRef.current.setNextKinematicTranslation(pos);
		setPlayerPosition([
			pos.x,
			pos.y,
			pos.z
		]);
		if (keys.shoot && clock.elapsedTime - lastShootTime.current > .2) {
			spawnProjectile([
				pos.x,
				pos.y,
				pos.z - 2
			]);
			lastShootTime.current = clock.elapsedTime;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		ref: playerRef,
		type: "kinematicPosition",
		position: [
			0,
			0,
			5
		],
		name: "player",
		colliders: false,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			2,
			.5,
			3
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: texture })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				0,
				1.6
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1,
				.3,
				.2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#00f3ff",
				emissive: "#00f3ff",
				emissiveIntensity: 2
			})]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, { args: [
			1,
			.25,
			1.5
		] })]
	});
};
//#endregion
//#region src/components/games/engines/FaskaSpaceOdyssey/World.jsx
var Enemy = ({ id, position }) => {
	const { damagePlayer, damageEnemy } = useGameLogic();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		type: "kinematicPosition",
		position,
		onIntersectionEnter: ({ other }) => {
			if (other.rigidBodyObject?.name === "projectile") damageEnemy(id);
			else if (other.rigidBodyObject?.name === "player") {
				damagePlayer(20);
				damageEnemy(id);
			}
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: (0, import_react.useRef)(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dodecahedronGeometry", { args: [1, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "red",
				emissive: "darkred",
				emissiveIntensity: .5,
				wireframe: true
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
			args: [
				1,
				1,
				1
			],
			sensor: true
		})]
	});
};
var Projectile = ({ id, position }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		type: "kinematicPosition",
		position,
		name: "projectile",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			.1,
			.1,
			1
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#00f3ff",
			emissive: "#00f3ff",
			emissiveIntensity: 2
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
			args: [
				.2,
				.2,
				1
			],
			sensor: true
		})]
	});
};
var Boss = () => {
	const { damageBoss, damagePlayer } = useGameLogic();
	const meshRef = (0, import_react.useRef)();
	useFrame(({ clock }) => {
		if (meshRef.current) {
			meshRef.current.position.x = Math.sin(clock.elapsedTime * 2) * 15;
			meshRef.current.rotation.y += .01;
			meshRef.current.rotation.z = Math.sin(clock.elapsedTime) * .2;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		type: "kinematicPosition",
		position: [
			0,
			0,
			-30
		],
		onIntersectionEnter: ({ other }) => {
			if (other.rigidBodyObject?.name === "projectile") damageBoss();
			else if (other.rigidBodyObject?.name === "player") damagePlayer(50);
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: meshRef,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("octahedronGeometry", { args: [5, 1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "purple",
				emissive: "magenta",
				emissiveIntensity: .5,
				wireframe: true
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					0,
					1
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					2,
					16,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "red",
					emissive: "darkred",
					emissiveIntensity: 1
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
			args: [
				5,
				5,
				5
			],
			sensor: true
		})]
	});
};
var World = () => {
	const { gameState, enemies, projectiles, spawnEnemy, updateProjectiles, updateEnemies } = useGameLogic();
	useFrame(() => {
		updateProjectiles();
		updateEnemies();
		if (gameState === "playing" && Math.random() < .02) spawnEnemy();
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {}),
		enemies.map((enemy) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Enemy, {
			id: enemy.id,
			position: enemy.position
		}, enemy.id)),
		projectiles.map((proj) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Projectile, {
			id: proj.id,
			position: proj.position
		}, proj.id)),
		gameState === "boss" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boss, {})
	] });
};
//#endregion
//#region src/components/games/engines/FaskaSpaceOdyssey/FaskaSpaceOdyssey.jsx
var FaskaSpaceOdyssey = () => {
	const { gameState, score, health, resetGame, startGame } = useGameLogic();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100%",
			height: "100vh",
			position: "relative",
			background: "black",
			overflow: "hidden"
		},
		children: [
			gameState === "menu" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					zIndex: 10,
					color: "white",
					textAlign: "center"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					style: {
						fontSize: "4rem",
						marginBottom: "1rem",
						color: "#00f3ff"
					},
					children: "Faska Space Odyssey"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: startGame,
					style: {
						padding: "10px 20px",
						fontSize: "1.5rem",
						background: "#00f3ff",
						color: "black",
						border: "none",
						cursor: "pointer",
						borderRadius: "5px"
					},
					children: "Start Mission"
				})]
			}),
			gameState === "gameover" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					zIndex: 10,
					color: "white",
					textAlign: "center"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							fontSize: "4rem",
							color: "red"
						},
						children: "GAME OVER"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: ["Final Score: ", score] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: resetGame,
						style: {
							padding: "10px 20px",
							fontSize: "1.5rem",
							background: "red",
							color: "white",
							border: "none",
							cursor: "pointer",
							borderRadius: "5px"
						},
						children: "Try Again"
					})
				]
			}),
			gameState === "victory" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					zIndex: 10,
					color: "white",
					textAlign: "center"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							fontSize: "4rem",
							color: "green"
						},
						children: "VICTORY!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: ["Final Score: ", score] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: resetGame,
						style: {
							padding: "10px 20px",
							fontSize: "1.5rem",
							background: "green",
							color: "white",
							border: "none",
							cursor: "pointer",
							borderRadius: "5px"
						},
						children: "Play Again"
					})
				]
			}),
			(gameState === "playing" || gameState === "boss") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 20,
					left: 20,
					zIndex: 10,
					color: "#00f3ff",
					fontFamily: "monospace",
					fontSize: "1.2rem",
					pointerEvents: "none"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["SCORE: ", score] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						"SHIELD: ",
						health,
						"%"
					] }),
					gameState === "boss" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "red",
							marginTop: "10px",
							fontSize: "1.5rem",
							fontWeight: "bold"
						},
						children: "BOSS APPROACHING!"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyboardControls, {
				map: [
					{
						name: "forward",
						keys: ["ArrowUp", "KeyW"]
					},
					{
						name: "backward",
						keys: ["ArrowDown", "KeyS"]
					},
					{
						name: "left",
						keys: ["ArrowLeft", "KeyA"]
					},
					{
						name: "right",
						keys: ["ArrowRight", "KeyD"]
					},
					{
						name: "shoot",
						keys: ["Space"]
					}
				],
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
					camera: {
						position: [
							0,
							5,
							10
						],
						fov: 60
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
							attach: "background",
							args: ["#000005"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
							radius: 100,
							depth: 50,
							count: 5e3,
							factor: 4,
							saturation: 0,
							fade: true,
							speed: 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
							position: [
								10,
								10,
								10
							],
							intensity: 1.5,
							color: "#ffffff"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
							position: [
								-10,
								-10,
								-10
							],
							intensity: .5,
							color: "#00f3ff"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Physics, {
							gravity: [
								0,
								0,
								0
							],
							children: gameState !== "menu" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {})
						})
					]
				})
			})
		]
	});
};
//#endregion
export { FaskaSpaceOdyssey as default };
