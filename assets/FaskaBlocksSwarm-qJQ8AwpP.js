import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as create } from "./react-B1iXS_n6.js";
import { t as Text } from "./Text-CuphjnHx.js";
//#region src/components/games/engines/FaskaBlocksSwarm/GameLogic.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var SHAPES = [
	[[
		1,
		1,
		1,
		1
	]],
	[[
		1,
		0,
		0
	], [
		1,
		1,
		1
	]],
	[[
		0,
		0,
		1
	], [
		1,
		1,
		1
	]],
	[[1, 1], [1, 1]],
	[[
		0,
		1,
		1
	], [
		1,
		1,
		0
	]],
	[[
		0,
		1,
		0
	], [
		1,
		1,
		1
	]],
	[[
		1,
		1,
		0
	], [
		0,
		1,
		1
	]]
];
var COLORS = [
	"#00FFFF",
	"#0000FF",
	"#FFA500",
	"#FFFF00",
	"#00FF00",
	"#800080",
	"#FF0000"
];
var COLS = 10;
var ROWS = 20;
var useGameStore = create((set, get) => ({
	grid: Array(ROWS).fill(null).map(() => Array(COLS).fill(null)),
	currentPiece: null,
	score: 0,
	gameOver: false,
	isResolving: false,
	isPlaying: false,
	startGame: () => {
		set({
			grid: Array(ROWS).fill(null).map(() => Array(COLS).fill(null)),
			score: 0,
			gameOver: false,
			isResolving: false,
			isPlaying: true
		});
		get().spawnPiece();
	},
	exitGame: () => {
		set({
			isPlaying: false,
			gameOver: false,
			currentPiece: null
		});
	},
	spawnPiece: () => {
		const typeIndex = Math.floor(Math.random() * SHAPES.length);
		const shape = SHAPES[typeIndex];
		const color = COLORS[typeIndex];
		const newPiece = {
			shape,
			values: shape.map((row) => row.map((cell) => cell ? Math.floor(Math.random() * 9) + 1 : 0)),
			color,
			x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
			y: 0
		};
		if (!get().isValid(newPiece.x, newPiece.y, newPiece.shape)) set({
			gameOver: true,
			isPlaying: false
		});
		else set({ currentPiece: newPiece });
	},
	isValid: (px, py, shape) => {
		const { grid } = get();
		for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[r].length; c++) if (shape[r][c]) {
			let nx = px + c;
			let ny = py + r;
			if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
			if (ny >= 0 && grid[ny][nx]) return false;
		}
		return true;
	},
	movePiece: (dx, dy) => {
		const { currentPiece, gameOver, isResolving, isValid } = get();
		if (gameOver || !currentPiece || isResolving) return false;
		if (isValid(currentPiece.x + dx, currentPiece.y + dy, currentPiece.shape)) {
			set((state) => ({ currentPiece: {
				...state.currentPiece,
				x: state.currentPiece.x + dx,
				y: state.currentPiece.y + dy
			} }));
			return true;
		}
		return false;
	},
	rotatePiece: () => {
		const { currentPiece, gameOver, isResolving, isValid } = get();
		if (gameOver || !currentPiece || isResolving) return;
		const { shape, values } = currentPiece;
		const newShape = [];
		const newValues = [];
		const rows = shape.length;
		const cols = shape[0].length;
		for (let c = 0; c < cols; c++) {
			newShape[c] = [];
			newValues[c] = [];
			for (let r = 0; r < rows; r++) {
				newShape[c][rows - 1 - r] = shape[r][c];
				newValues[c][rows - 1 - r] = values[r][c];
			}
		}
		if (isValid(currentPiece.x, currentPiece.y, newShape)) set((state) => ({ currentPiece: {
			...state.currentPiece,
			shape: newShape,
			values: newValues
		} }));
	},
	hardDrop: () => {
		const { gameOver, isResolving } = get();
		if (gameOver || isResolving) return;
		while (get().movePiece(0, 1));
		get().settlePiece();
	},
	settlePiece: () => {
		const { currentPiece, grid, resolveBoard } = get();
		if (!currentPiece) return;
		const newGrid = grid.map((row) => [...row]);
		const { x, y, shape, values, color } = currentPiece;
		for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[r].length; c++) if (shape[r][c]) {
			let gx = x + c;
			let gy = y + r;
			if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS) newGrid[gy][gx] = {
				value: values[r][c],
				color
			};
		}
		set({
			grid: newGrid,
			currentPiece: null
		});
		resolveBoard();
	},
	resolveBoard: () => {
		set({ isResolving: true });
		const { grid } = get();
		let toDestroy = /* @__PURE__ */ new Set();
		for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
			if (!grid[y][x]) continue;
			let sum = 0;
			let seq = [];
			for (let i = x; i < COLS; i++) {
				if (!grid[y][i]) break;
				sum += grid[y][i].value;
				seq.push({
					y,
					x: i
				});
				if (sum === 10) {
					seq.forEach((pos) => toDestroy.add(`${pos.y},${pos.x}`));
					break;
				} else if (sum > 10) break;
			}
		}
		for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS; y++) {
			if (!grid[y][x]) continue;
			let sum = 0;
			let seq = [];
			for (let i = y; i < ROWS; i++) {
				if (!grid[i][x]) break;
				sum += grid[i][x].value;
				seq.push({
					y: i,
					x
				});
				if (sum === 10) {
					seq.forEach((pos) => toDestroy.add(`${pos.y},${pos.x}`));
					break;
				} else if (sum > 10) break;
			}
		}
		if (toDestroy.size > 0) {
			const newGrid = grid.map((row) => [...row]);
			toDestroy.forEach((posStr) => {
				let [y, x] = posStr.split(",").map(Number);
				newGrid[y][x] = null;
			});
			set((state) => ({
				score: state.score + toDestroy.size * 10,
				grid: newGrid
			}));
			setTimeout(() => {
				get().applyGravity();
			}, 300);
		} else {
			set({ isResolving: false });
			get().spawnPiece();
		}
	},
	applyGravity: () => {
		const { grid, resolveBoard } = get();
		const newGrid = grid.map((row) => [...row]);
		let moved = false;
		for (let x = 0; x < COLS; x++) for (let y = ROWS - 2; y >= 0; y--) if (newGrid[y][x] && !newGrid[y + 1][x]) {
			let dropY = y;
			while (dropY < ROWS - 1 && !newGrid[dropY + 1][x]) dropY++;
			newGrid[dropY][x] = newGrid[y][x];
			newGrid[y][x] = null;
			moved = true;
		}
		set({ grid: newGrid });
		if (moved) setTimeout(() => {
			resolveBoard();
		}, 300);
		else resolveBoard();
	},
	tick: () => {
		if (!get().movePiece(0, 1)) get().settlePiece();
	}
}));
//#endregion
//#region src/components/games/engines/FaskaBlocksSwarm/World.jsx
var import_jsx_runtime = require_jsx_runtime();
var World = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				10,
				10,
				5
			],
			intensity: 1,
			castShadow: true
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				4.5,
				-9.5,
				-.5
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				10,
				20,
				.5
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2a2a3a" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-.5,
				-9.5,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1,
				20,
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#444" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				9.5,
				-9.5,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1,
				20,
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#444" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				4.5,
				-20,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				11,
				1,
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#444" })]
		})
	] });
};
//#endregion
//#region src/components/games/engines/FaskaBlocksSwarm/Blocks.jsx
var Block = ({ x, y, value, color }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			x,
			-y,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.9,
				.9,
				.9
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .2,
				metalness: .1
			})]
		}), value > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			position: [
				0,
				0,
				.46
			],
			fontSize: .6,
			color: "white",
			anchorX: "center",
			anchorY: "middle",
			children: value
		})]
	});
};
var Blocks = () => {
	const grid = useGameStore((state) => state.grid);
	const currentPiece = useGameStore((state) => state.currentPiece);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [grid.map((row, y) => row.map((cell, x) => cell ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
		x,
		y,
		value: cell.value,
		color: cell.color
	}, `fixed-${x}-${y}`) : null)), currentPiece && currentPiece.shape.map((row, r) => row.map((cell, c) => cell ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
		x: currentPiece.x + c,
		y: currentPiece.y + r,
		value: currentPiece.values[r][c],
		color: currentPiece.color
	}, `curr-${c}-${r}`) : null))] });
};
//#endregion
//#region src/components/games/engines/FaskaBlocksSwarm/UIOverlay.jsx
var UIOverlay = ({ onExit }) => {
	const { score, gameOver, isPlaying, startGame } = useGameStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			pointerEvents: "none",
			display: "flex",
			flexDirection: "column"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					padding: "20px",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start",
					pointerEvents: "auto"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						color: "white",
						fontSize: "24px",
						fontWeight: "bold",
						textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
					},
					children: ["Score: ", score]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					style: {
						padding: "8px 16px",
						backgroundColor: "#e94560",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
						fontWeight: "bold",
						boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
					},
					children: "Beenden"
				})]
			}),
			!isPlaying && !gameOver && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					flex: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					pointerEvents: "auto"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: startGame,
					style: {
						padding: "15px 40px",
						fontSize: "24px",
						fontWeight: "bold",
						backgroundColor: "#4caf50",
						color: "white",
						border: "none",
						borderRadius: "8px",
						cursor: "pointer"
					},
					children: "Start Game"
				})
			}),
			gameOver && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					flex: 1,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					pointerEvents: "auto"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						fontSize: "48px",
						color: "#ff4444",
						fontWeight: "bold",
						marginBottom: "20px",
						textShadow: "2px 2px 4px #000"
					},
					children: "GAME OVER"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: startGame,
					style: {
						padding: "15px 40px",
						fontSize: "24px",
						fontWeight: "bold",
						backgroundColor: "#4caf50",
						color: "white",
						border: "none",
						borderRadius: "8px",
						cursor: "pointer"
					},
					children: "Play Again"
				})]
			})
		]
	});
};
//#endregion
//#region src/components/games/engines/FaskaBlocksSwarm/MobileJoystick.jsx
var JoystickButton = ({ label, onClick, style }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
	onClick,
	style: {
		width: "60px",
		height: "60px",
		borderRadius: "30px",
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		border: "2px solid rgba(255, 255, 255, 0.5)",
		color: "white",
		fontWeight: "bold",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		userSelect: "none",
		touchAction: "none",
		...style
	},
	children: label
});
var MobileJoystick = () => {
	const { movePiece, rotatePiece, hardDrop, isPlaying } = useGameStore();
	if (!isPlaying) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			bottom: "20px",
			left: "0",
			width: "100%",
			pointerEvents: "none",
			display: "flex",
			justifyContent: "space-between",
			padding: "0 20px",
			boxSizing: "border-box"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "grid",
				gridTemplateColumns: "60px 60px 60px",
				gap: "10px",
				pointerEvents: "auto"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoystickButton, {
					label: "ROT",
					onClick: rotatePiece
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoystickButton, {
					label: "LT",
					onClick: () => movePiece(-1, 0)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoystickButton, {
					label: "DN",
					onClick: () => movePiece(0, 1)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoystickButton, {
					label: "RT",
					onClick: () => movePiece(1, 0)
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				display: "flex",
				alignItems: "flex-end",
				gap: "10px",
				pointerEvents: "auto"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoystickButton, {
				label: "DROP",
				onClick: hardDrop,
				style: {
					width: "80px",
					height: "80px",
					borderRadius: "40px"
				}
			})
		})]
	});
};
//#endregion
//#region src/components/games/engines/FaskaBlocksSwarm/FaskaBlocksSwarm.jsx
var GameTicker = () => {
	const tick = useGameStore((state) => state.tick);
	const isPlaying = useGameStore((state) => state.isPlaying);
	const gameOver = useGameStore((state) => state.gameOver);
	(0, import_react.useEffect)(() => {
		if (!isPlaying || gameOver) return;
		const interval = setInterval(() => {
			tick();
		}, 1e3);
		return () => clearInterval(interval);
	}, [
		isPlaying,
		gameOver,
		tick
	]);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (!useGameStore.getState().isPlaying || useGameStore.getState().gameOver) return;
			switch (e.key) {
				case "ArrowLeft":
					useGameStore.getState().movePiece(-1, 0);
					break;
				case "ArrowRight":
					useGameStore.getState().movePiece(1, 0);
					break;
				case "ArrowDown":
					useGameStore.getState().movePiece(0, 1);
					break;
				case "ArrowUp":
					useGameStore.getState().rotatePiece();
					break;
				case " ":
					useGameStore.getState().hardDrop();
					break;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
	return null;
};
var FaskaBlocksSwarm = ({ onExit }) => {
	const exitGame = useGameStore((state) => state.exitGame);
	const handleExit = () => {
		exitGame();
		if (onExit) onExit();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100%",
			height: "100vh",
			backgroundColor: "#1a1a2e",
			overflow: "hidden"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
				shadows: true,
				camera: {
					position: [
						4.5,
						-9.5,
						18
					],
					fov: 60
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameTicker, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Blocks, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UIOverlay, { onExit: handleExit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileJoystick, {})
		]
	});
};
//#endregion
export { FaskaBlocksSwarm as default };
