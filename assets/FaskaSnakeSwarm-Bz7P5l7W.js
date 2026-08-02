import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as create } from "./react-B1iXS_n6.js";
import { a as Physics } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Environment } from "./Environment-CqP6Yhdo.js";
import { t as Text } from "./Text-CuphjnHx.js";
import { r as Sphere } from "./shapes-BBrczoYY.js";
import { i as wt, n as dt, r as qt } from "./dist-DaAzX60v.js";
//#region src/components/games/engines/FaskaSnakeSwarm/GameLogic.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var WORDS = [
	"HUND",
	"KATZE",
	"MAUS",
	"BAUM",
	"AUTO",
	"SONNE",
	"MOND",
	"STERN",
	"APFEL",
	"VOGEL",
	"FISCH"
];
var useGameStore = create((set, get) => ({
	snake: [
		{
			x: 0,
			z: 0
		},
		{
			x: -1,
			z: 0
		},
		{
			x: -2,
			z: 0
		}
	],
	dir: {
		x: 1,
		z: 0
	},
	nextDir: {
		x: 1,
		z: 0
	},
	letters: [],
	targetWord: WORDS[0],
	targetIndex: 0,
	wordCount: 1,
	gameOver: false,
	moveDelay: 150,
	score: 0,
	isPaused: false,
	initGame: () => {
		const word = WORDS[Math.floor(Math.random() * WORDS.length)];
		set({
			snake: [
				{
					x: 0,
					z: 0
				},
				{
					x: -1,
					z: 0
				},
				{
					x: -2,
					z: 0
				}
			],
			dir: {
				x: 1,
				z: 0
			},
			nextDir: {
				x: 1,
				z: 0
			},
			targetWord: word,
			targetIndex: 0,
			wordCount: 1,
			gameOver: false,
			moveDelay: 200,
			score: 0,
			isPaused: false
		});
		get().spawnLetters();
	},
	setDir: (x, z) => {
		const { dir } = get();
		if (dir.x !== 0 && x === -dir.x) return;
		if (dir.z !== 0 && z === -dir.z) return;
		set({ nextDir: {
			x,
			z
		} });
	},
	setPaused: (p) => set({ isPaused: p }),
	spawnLetters: () => {
		const { snake, targetWord, targetIndex } = get();
		const letters = [];
		const getFreePos = () => {
			let x, z;
			while (true) {
				x = Math.floor(Math.random() * 20) - 10;
				z = Math.floor(Math.random() * 20) - 10;
				let ok = true;
				for (let s of snake) if (s.x === x && s.z === z) ok = false;
				for (let l of letters) if (l.x === x && l.z === z) ok = false;
				if (ok) return {
					x,
					z
				};
			}
		};
		const targetChar = targetWord[targetIndex];
		if (targetChar) {
			const p = getFreePos();
			letters.push({
				x: p.x,
				z: p.z,
				char: targetChar,
				isTarget: true,
				id: Date.now()
			});
			const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			for (let i = 0; i < 4; i++) {
				const rp = getFreePos();
				let randomChar = alphabet[Math.floor(Math.random() * 26)];
				while (randomChar === targetChar) randomChar = alphabet[Math.floor(Math.random() * 26)];
				letters.push({
					x: rp.x,
					z: rp.z,
					char: randomChar,
					isTarget: false,
					id: Date.now() + i + 1
				});
			}
		}
		set({ letters });
	},
	tick: () => {
		const state = get();
		if (state.gameOver || state.isPaused) return;
		const { snake, nextDir, letters, targetWord, targetIndex, wordCount, moveDelay } = state;
		const dir = { ...nextDir };
		const head = snake[0];
		const nx = head.x + dir.x;
		const nz = head.z + dir.z;
		if (nx < -15 || nx > 15 || nz < -15 || nz > 15) {
			set({ gameOver: true });
			return;
		}
		for (let i = 0; i < snake.length; i++) if (snake[i].x === nx && snake[i].z === nz) {
			set({ gameOver: true });
			return;
		}
		const newSnake = [{
			x: nx,
			z: nz
		}, ...snake];
		let ate = false;
		let newLetters = [...letters];
		let newTargetIndex = targetIndex;
		let newTargetWord = targetWord;
		let newWordCount = wordCount;
		let newMoveDelay = moveDelay;
		let newScore = state.score;
		const hitIdx = newLetters.findIndex((l) => l.x === nx && l.z === nz);
		if (hitIdx !== -1) {
			const hitLetter = newLetters[hitIdx];
			newLetters.splice(hitIdx, 1);
			ate = true;
			if (hitLetter.isTarget) {
				newScore += 10;
				newTargetIndex++;
				if (newTargetIndex >= targetWord.length) {
					newWordCount++;
					newTargetWord = WORDS[Math.floor(Math.random() * WORDS.length)];
					newTargetIndex = 0;
					newMoveDelay = Math.max(80, moveDelay - 10);
					newScore += 50;
				}
			} else {
				newScore -= 5;
				newSnake.pop();
				if (newSnake.length > 2) newSnake.pop();
				else {
					set({
						gameOver: true,
						score: newScore
					});
					return;
				}
			}
		} else newSnake.pop();
		set({
			snake: newSnake,
			dir,
			letters: newLetters,
			targetIndex: newTargetIndex,
			targetWord: newTargetWord,
			wordCount: newWordCount,
			moveDelay: newMoveDelay,
			score: newScore
		});
		if (ate) get().spawnLetters();
	}
}));
//#endregion
//#region src/components/games/engines/FaskaSnakeSwarm/World.jsx
var import_jsx_runtime = require_jsx_runtime();
var LetterNode = ({ letter }) => {
	const ref = (0, import_react.useRef)();
	useFrame((state) => {
		if (ref.current) {
			ref.current.position.y = Math.sin(state.clock.elapsedTime * 4 + letter.id) * .2 + .5;
			ref.current.rotation.y = state.clock.elapsedTime;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			letter.x,
			0,
			letter.z
		],
		ref,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sphere, {
			args: [
				.4,
				16,
				16
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: letter.isTarget ? "#00ffff" : "#ff5555",
				emissive: letter.isTarget ? "#00aaaa" : "#aa0000",
				emissiveIntensity: .5,
				wireframe: !letter.isTarget
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			position: [
				0,
				.7,
				0
			],
			fontSize: .8,
			color: letter.isTarget ? "white" : "#ffcccc",
			outlineWidth: .05,
			outlineColor: "black",
			font: "https://fonts.gstatic.com/s/pressstart2p/v14/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff",
			children: letter.char
		})]
	});
};
var World = () => {
	const letters = useGameStore((state) => state.letters);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				10,
				20,
				10
			],
			intensity: 1.5,
			castShadow: true
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Environment, { preset: "night" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			receiveShadow: true,
			position: [
				0,
				-.5,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				31,
				1,
				31
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#1a1a2e",
				roughness: .8,
				metalness: .2
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("gridHelper", {
			args: [
				31,
				31,
				4473958,
				2236996
			],
			position: [
				0,
				.01,
				0
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.5,
				-16
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				32,
				2,
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3a3a5e" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.5,
				16
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				32,
				2,
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3a3a5e" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-16,
				.5,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1,
				2,
				32
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3a3a5e" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				16,
				.5,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1,
				2,
				32
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3a3a5e" })]
		}),
		letters.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LetterNode, { letter: l }, l.id))
	] });
};
//#endregion
//#region src/components/games/engines/FaskaSnakeSwarm/Player.jsx
var SnakeSegment = ({ pos, isHead, index, total }) => {
	const ref = (0, import_react.useRef)();
	useFrame((state, delta) => {
		if (ref.current) ref.current.position.lerp(new Vector3(pos.x, .5, pos.z), delta * 15);
	});
	const scale = isHead ? 1 : Math.max(.4, 1 - index / total * .5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref,
		position: [
			pos.x,
			.5,
			pos.z
		],
		scale,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.9,
				.9,
				.9
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: isHead ? "#ffffff" : "#00ff00",
				emissive: isHead ? "#444444" : "#004400",
				roughness: .2,
				metalness: .8
			}),
			isHead && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				position: [
					0,
					.5,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.25,
						0,
						-.25
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.2,
						.1,
						.2
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "black" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.25,
						0,
						-.25
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.2,
						.1,
						.2
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "black" })]
				})]
			})
		]
	});
};
var Player = () => {
	const snake = useGameStore((state) => state.snake);
	const tick = useGameStore((state) => state.tick);
	const moveDelay = useGameStore((state) => state.moveDelay);
	const gameOver = useGameStore((state) => state.gameOver);
	const setDir = useGameStore((state) => state.setDir);
	const isPaused = useGameStore((state) => state.isPaused);
	const lastTickRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (gameOver || isPaused) return;
			switch (e.key.toLowerCase()) {
				case "w":
				case "arrowup":
					setDir(0, -1);
					break;
				case "s":
				case "arrowdown":
					setDir(0, 1);
					break;
				case "a":
				case "arrowleft":
					setDir(-1, 0);
					break;
				case "d":
				case "arrowright":
					setDir(1, 0);
					break;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		setDir,
		gameOver,
		isPaused
	]);
	useFrame((state) => {
		const time = state.clock.getElapsedTime() * 1e3;
		if (time - lastTickRef.current > moveDelay) {
			lastTickRef.current = time;
			tick();
		}
		if (snake.length > 0 && !gameOver) {
			const head = snake[0];
			const targetCamPos = new Vector3(head.x * .3, 15, head.z * .3 + 15);
			state.camera.position.lerp(targetCamPos, .05);
			state.camera.lookAt(head.x * .2, 0, head.z * .2);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: snake.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnakeSegment, {
		pos: s,
		isHead: i === 0,
		index: i,
		total: snake.length
	}, `${i}-${s.x}-${s.z}`)) });
};
//#endregion
//#region src/components/games/engines/FaskaSnakeSwarm/UIOverlay.jsx
var UIOverlay = ({ onExit }) => {
	const { targetWord, targetIndex, wordCount, score, gameOver, initGame } = useGameStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			pointerEvents: "none",
			display: "flex",
			flexDirection: "column",
			fontFamily: "monospace"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					justifyContent: "space-between",
					padding: "20px",
					background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
					pointerEvents: "auto"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						gap: "20px",
						alignItems: "center"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: {
							fontSize: "24px",
							fontWeight: "bold",
							color: "#aaaaaa"
						},
						children: "ZIEL:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							gap: "10px"
						},
						children: targetWord.split("").map((char, i) => {
							let color = "#555555";
							let scale = 1;
							if (i < targetIndex) color = "#00ff00";
							else if (i === targetIndex) {
								color = "#00ffff";
								scale = 1.2;
							}
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: {
									fontSize: "28px",
									fontWeight: "bold",
									color,
									transform: `scale(${scale})`,
									transition: "all 0.2s",
									textShadow: i === targetIndex ? "0 0 10px #00ffff" : "none"
								},
								children: char
							}, i);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
						gap: "5px"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							fontSize: "24px",
							fontWeight: "bold",
							color: "white"
						},
						children: ["WORT: ", wordCount]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							fontSize: "20px",
							fontWeight: "bold",
							color: "#ffd700"
						},
						children: ["SCORE: ", score]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					bottom: "20px",
					right: "20px",
					pointerEvents: "auto",
					padding: "10px 20px",
					backgroundColor: "#ff3333",
					color: "white",
					border: "none",
					borderRadius: "8px",
					fontWeight: "bold",
					cursor: "pointer",
					boxShadow: "0 4px 6px rgba(0,0,0,0.5)",
					textTransform: "uppercase"
				},
				children: "Beenden"
			}),
			gameOver && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					backgroundColor: "rgba(0,0,0,0.8)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					pointerEvents: "auto",
					backdropFilter: "blur(5px)"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							fontSize: "64px",
							color: "#ff0000",
							margin: "0 0 20px 0",
							textShadow: "0 0 20px #ff0000"
						},
						children: "GAME OVER"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						style: {
							fontSize: "32px",
							color: "#ffd700",
							margin: "0 0 40px 0"
						},
						children: ["Final Score: ", score]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: initGame,
						style: {
							padding: "15px 40px",
							fontSize: "24px",
							backgroundColor: "#00ffff",
							color: "black",
							border: "none",
							borderRadius: "12px",
							fontWeight: "bold",
							cursor: "pointer",
							boxShadow: "0 0 20px rgba(0,255,255,0.4)",
							transition: "transform 0.1s"
						},
						onMouseDown: (e) => e.currentTarget.style.transform = "scale(0.95)",
						onMouseUp: (e) => e.currentTarget.style.transform = "scale(1)",
						children: "Neustart"
					})
				]
			})
		]
	});
};
//#endregion
//#region src/components/games/engines/FaskaSnakeSwarm/MobileJoystick.jsx
var MobileJoystick = () => {
	const setDir = useGameStore((state) => state.setDir);
	const isPaused = useGameStore((state) => state.isPaused);
	const gameOver = useGameStore((state) => state.gameOver);
	if (isPaused || gameOver) return null;
	const btnStyle = {
		width: "60px",
		height: "60px",
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		border: "2px solid rgba(255, 255, 255, 0.5)",
		borderRadius: "50%",
		color: "white",
		fontSize: "24px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		userSelect: "none",
		touchAction: "none"
	};
	const handleDir = (x, z) => (e) => {
		e.preventDefault();
		setDir(x, z);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			bottom: "40px",
			left: "40px",
			display: "grid",
			gridTemplateColumns: "repeat(3, 60px)",
			gridTemplateRows: "repeat(3, 60px)",
			gap: "10px",
			pointerEvents: "auto"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: btnStyle,
				onPointerDown: handleDir(0, -1),
				children: "↑"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: btnStyle,
				onPointerDown: handleDir(-1, 0),
				children: "←"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: btnStyle,
				onPointerDown: handleDir(0, 1),
				children: "↓"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: btnStyle,
				onPointerDown: handleDir(1, 0),
				children: "→"
			})
		]
	});
};
//#endregion
//#region src/components/games/engines/FaskaSnakeSwarm/FaskaSnakeSwarm.jsx
var FaskaSnakeSwarm = ({ onExit }) => {
	const initGame = useGameStore((state) => state.initGame);
	(0, import_react.useEffect)(() => {
		initGame();
	}, [initGame]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100%",
			height: "100%",
			backgroundColor: "#0a0a1a",
			overflow: "hidden"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
				shadows: true,
				camera: {
					position: [
						0,
						15,
						20
					],
					fov: 50
				},
				style: {
					width: "100%",
					height: "100%"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Suspense, {
					fallback: null,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
						gravity: [
							0,
							-30,
							0
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(dt, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(wt, {
						luminanceThreshold: .5,
						luminanceSmoothing: .9,
						intensity: 1.5
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(qt, {
						eskil: false,
						offset: .1,
						darkness: 1.1
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UIOverlay, { onExit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileJoystick, {})
			})
		]
	});
};
//#endregion
export { FaskaSnakeSwarm as default };
