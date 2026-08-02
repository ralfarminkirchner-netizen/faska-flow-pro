import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { a as useFrame, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as create } from "./react-B1iXS_n6.js";
import { t as Text } from "./Text-CuphjnHx.js";
//#region src/components/games/engines/FaskaSpaceInvadersSwarm/GameLogic.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var TARGET_NUMBERS = [
	12,
	18,
	20,
	24,
	30,
	36,
	40,
	42,
	48,
	50
];
var useGameStore = create((set, get) => ({
	score: 0,
	targetNumber: 24,
	gameOverState: false,
	alienSpeed: 2,
	alienDirection: 1,
	lasers: [],
	aliens: [],
	playerX: 0,
	initLevel: () => {
		const targetNumber = TARGET_NUMBERS[Math.floor(Math.random() * TARGET_NUMBERS.length)];
		const aliens = [];
		for (let y = 0; y < 4; y++) for (let x = 0; x < 10; x++) aliens.push({
			id: `alien_${Date.now()}_${x}_${y}`,
			x: -4.5 + x * 1,
			z: -6 + y * 1,
			numberValue: Math.floor(Math.random() * 9) + 2
		});
		set({
			targetNumber,
			aliens,
			lasers: [],
			alienDirection: 1,
			playerX: 0
		});
	},
	restartGame: () => {
		set({
			score: 0,
			alienSpeed: 2,
			gameOverState: false
		});
		get().initLevel();
	},
	setPlayerX: (x) => set({ playerX: x }),
	fireLaser: () => {
		if (get().gameOverState) return;
		set((state) => ({ lasers: [...state.lasers, {
			id: Date.now() + Math.random(),
			x: state.playerX,
			z: 4
		}] }));
	},
	updateGameState: (delta) => {
		if (get().gameOverState) return;
		set((state) => {
			const newLasers = state.lasers.map((l) => ({
				...l,
				z: l.z - 15 * delta
			})).filter((l) => l.z > -10);
			let hitBound = false;
			let newAliens = state.aliens.map((a) => {
				const nextX = a.x + state.alienSpeed * state.alienDirection * delta;
				if (nextX > 5 || nextX < -5) hitBound = true;
				return {
					...a,
					x: nextX
				};
			});
			let nextDirection = state.alienDirection;
			if (hitBound) {
				nextDirection *= -1;
				newAliens = newAliens.map((a) => ({
					...a,
					z: a.z + .5
				}));
			}
			let currentScore = state.score;
			let isGameOver = false;
			const survivingLasers = [];
			const survivingAliens = [...newAliens];
			newLasers.forEach((laser) => {
				let hit = false;
				for (let i = survivingAliens.length - 1; i >= 0; i--) {
					const a = survivingAliens[i];
					if (Math.sqrt(Math.pow(laser.x - a.x, 2) + Math.pow(laser.z - a.z, 2)) < .8) {
						hit = true;
						if (state.targetNumber % a.numberValue === 0) currentScore += 10;
						else currentScore -= 5;
						survivingAliens.splice(i, 1);
						break;
					}
				}
				if (!hit) survivingLasers.push(laser);
			});
			survivingAliens.forEach((a) => {
				if (a.z > 3.5) isGameOver = true;
			});
			let levelComplete = false;
			let nextSpeed = state.alienSpeed;
			if (survivingAliens.length === 0) levelComplete = true;
			else if (!survivingAliens.some((a) => state.targetNumber % a.numberValue === 0)) {
				currentScore += 50;
				levelComplete = true;
			}
			if (levelComplete) {
				setTimeout(() => get().initLevel(), 0);
				nextSpeed += .5;
			}
			return {
				lasers: survivingLasers,
				aliens: survivingAliens,
				alienDirection: nextDirection,
				score: currentScore,
				gameOverState: isGameOver,
				alienSpeed: nextSpeed
			};
		});
	}
}));
//#endregion
//#region src/components/games/engines/FaskaSpaceInvadersSwarm/World.jsx
var import_jsx_runtime = require_jsx_runtime();
var Alien = ({ position, numberValue }) => {
	const ref = (0, import_react.useRef)();
	useFrame((state, delta) => {
		ref.current.rotation.y += delta;
		ref.current.rotation.x += delta * .5;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.6,
				.6,
				.6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ff00ff" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			position: [
				0,
				.6,
				0
			],
			fontSize: .4,
			color: "white",
			outlineWidth: .05,
			outlineColor: "black",
			rotation: [
				-Math.PI / 4,
				0,
				0
			],
			children: numberValue
		})]
	});
};
var World = () => {
	const updateGameState = useGameStore((state) => state.updateGameState);
	const aliens = useGameStore((state) => state.aliens);
	const lasers = useGameStore((state) => state.lasers);
	useFrame((state, delta) => {
		updateGameState(delta);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				10,
				10,
				10
			],
			intensity: 1
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-1,
				0
			],
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [50, 50] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#000022" })]
		}),
		aliens.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Alien, {
			position: [
				a.x,
				0,
				a.z
			],
			numberValue: a.numberValue
		}, a.id)),
		lasers.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				l.x,
				0,
				l.z
			],
			rotation: [
				Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.05,
				.05,
				.4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#ffff00" })]
		}, l.id))
	] });
};
//#endregion
//#region src/components/games/engines/FaskaSpaceInvadersSwarm/Ship.jsx
var Ship = () => {
	const meshRef = (0, import_react.useRef)();
	const playerX = useGameStore((state) => state.playerX);
	useFrame(() => {
		if (meshRef.current) meshRef.current.position.x += (playerX - meshRef.current.position.x) * .2;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref: meshRef,
		position: [
			0,
			0,
			4
		],
		rotation: [
			-Math.PI / 2,
			0,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
			.5,
			1,
			16
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#00ffff" })]
	});
};
//#endregion
//#region src/components/games/engines/FaskaSpaceInvadersSwarm/UIOverlay.jsx
var UIOverlay = ({ onExit }) => {
	const score = useGameStore((state) => state.score);
	const targetNumber = useGameStore((state) => state.targetNumber);
	const gameOverState = useGameStore((state) => state.gameOverState);
	const restartGame = useGameStore((state) => state.restartGame);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			pointerEvents: "none",
			fontFamily: "sans-serif"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 20,
					left: 20,
					color: "#00ffff",
					fontSize: 24,
					fontWeight: "bold"
				},
				children: ["Punkte: ", score]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 50,
					left: 20,
					color: "#00ff00",
					fontSize: 28,
					fontWeight: "bold"
				},
				children: ["Ziel: ", targetNumber]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					top: 20,
					right: 150,
					color: "#ff00ff",
					fontSize: 22,
					fontWeight: "bold"
				},
				children: "Schieße Teiler!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					top: "15px",
					right: "15px",
					padding: "10px 20px",
					backgroundColor: "rgba(255, 0, 50, 0.8)",
					color: "white",
					border: "2px solid white",
					borderRadius: "8px",
					cursor: "pointer",
					fontWeight: "bold",
					fontSize: "16px",
					pointerEvents: "auto"
				},
				children: "Beenden"
			}),
			gameOverState && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					textAlign: "center",
					backgroundColor: "rgba(0,0,0,0.8)",
					padding: 40,
					borderRadius: 20,
					pointerEvents: "auto"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							color: "red",
							fontSize: 48,
							margin: 0
						},
						children: "GAME OVER"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						style: { color: "white" },
						children: ["Endpunktzahl: ", score]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: restartGame,
						style: {
							padding: "10px 20px",
							fontSize: 24,
							backgroundColor: "#00ffff",
							border: "none",
							borderRadius: 8,
							cursor: "pointer",
							marginTop: 20
						},
						children: "Neustart"
					})
				]
			})
		]
	});
};
//#endregion
//#region src/components/games/engines/FaskaSpaceInvadersSwarm/MobileJoystick.jsx
var MobileJoystick = () => {
	const setPlayerX = useGameStore((state) => state.setPlayerX);
	const fireLaser = useGameStore((state) => state.fireLaser);
	const playerXRef = (0, import_react.useRef)(0);
	const keys = (0, import_react.useRef)({
		left: false,
		right: false,
		space: false
	});
	const lastFired = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "ArrowLeft") keys.current.left = true;
			if (e.key === "ArrowRight") keys.current.right = true;
			if (e.key === " ") keys.current.space = true;
		};
		const handleKeyUp = (e) => {
			if (e.key === "ArrowLeft") keys.current.left = false;
			if (e.key === "ArrowRight") keys.current.right = false;
			if (e.key === " ") keys.current.space = false;
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		let frameId;
		const loop = (time) => {
			let speed = .15;
			if (keys.current.left) playerXRef.current -= speed;
			if (keys.current.right) playerXRef.current += speed;
			playerXRef.current = Math.max(-4.5, Math.min(4.5, playerXRef.current));
			setPlayerX(playerXRef.current);
			if (keys.current.space && time - lastFired.current > 300) {
				fireLaser();
				lastFired.current = time;
			}
			frameId = requestAnimationFrame(loop);
		};
		frameId = requestAnimationFrame(loop);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			cancelAnimationFrame(frameId);
		};
	}, [setPlayerX, fireLaser]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			bottom: 20,
			width: "100%",
			display: "flex",
			justifyContent: "space-between",
			padding: "0 20px",
			boxSizing: "border-box",
			pointerEvents: "none"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				gap: 10,
				pointerEvents: "auto"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onPointerDown: () => keys.current.left = true,
				onPointerUp: () => keys.current.left = false,
				onPointerLeave: () => keys.current.left = false,
				style: {
					width: 60,
					height: 60,
					borderRadius: 30,
					background: "rgba(255,255,255,0.2)",
					border: "2px solid white",
					color: "white",
					fontSize: 24,
					touchAction: "none",
					cursor: "pointer"
				},
				children: "←"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onPointerDown: () => keys.current.right = true,
				onPointerUp: () => keys.current.right = false,
				onPointerLeave: () => keys.current.right = false,
				style: {
					width: 60,
					height: 60,
					borderRadius: 30,
					background: "rgba(255,255,255,0.2)",
					border: "2px solid white",
					color: "white",
					fontSize: 24,
					touchAction: "none",
					cursor: "pointer"
				},
				children: "→"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onPointerDown: () => {
				const time = performance.now();
				if (time - lastFired.current > 300) {
					fireLaser();
					lastFired.current = time;
				}
				keys.current.space = true;
			},
			onPointerUp: () => keys.current.space = false,
			onPointerLeave: () => keys.current.space = false,
			style: {
				width: 80,
				height: 80,
				borderRadius: 40,
				background: "rgba(255,0,0,0.5)",
				border: "2px solid red",
				color: "white",
				fontSize: 20,
				pointerEvents: "auto",
				touchAction: "none",
				cursor: "pointer"
			},
			children: "FIRE"
		})]
	});
};
//#endregion
//#region src/components/games/engines/FaskaSpaceInvadersSwarm/FaskaSpaceInvadersSwarm.jsx
var FaskaSpaceInvadersSwarm = ({ onExit }) => {
	const initLevel = useGameStore((state) => state.initLevel);
	(0, import_react.useEffect)(() => {
		initLevel();
	}, [initLevel]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "800px",
			height: "600px",
			margin: "0 auto",
			boxShadow: "0 0 20px rgba(0,255,255,0.2)"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
				camera: {
					position: [
						0,
						8,
						8
					],
					fov: 50
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
					rotation: [
						-Math.PI / 4,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ship, {})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UIOverlay, { onExit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileJoystick, {})
		]
	});
};
//#endregion
export { FaskaSpaceInvadersSwarm as default };
