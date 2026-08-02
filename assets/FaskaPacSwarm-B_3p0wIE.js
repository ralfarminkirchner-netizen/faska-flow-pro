import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaPacSwarm/FaskaPacSwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var MAZE_COLS = 28;
var MAZE_ROWS = 31;
var TILE = 20;
var MAZE = [
	[
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1
	],
	[
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1
	],
	[
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1
	],
	[
		1,
		2,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		2,
		1
	],
	[
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1
	],
	[
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1
	],
	[
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1
	],
	[
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1
	],
	[
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		0,
		0,
		0,
		0,
		1,
		1,
		0,
		0,
		0,
		0,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		1
	],
	[
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		3,
		1,
		1,
		3,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1
	],
	[
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		3,
		3,
		3,
		3,
		3,
		3,
		3,
		3,
		3,
		3,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1
	],
	[
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		3,
		1,
		1,
		1,
		3,
		3,
		1,
		1,
		1,
		3,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1
	],
	[
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		3,
		1,
		3,
		3,
		3,
		3,
		3,
		3,
		1,
		3,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1
	],
	[
		3,
		3,
		3,
		3,
		3,
		3,
		0,
		3,
		3,
		3,
		1,
		3,
		3,
		3,
		3,
		3,
		3,
		1,
		3,
		3,
		3,
		0,
		3,
		3,
		3,
		3,
		3,
		3
	],
	[
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		3,
		1,
		3,
		3,
		3,
		3,
		3,
		3,
		1,
		3,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1
	],
	[
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		3,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		3,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1
	],
	[
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		3,
		3,
		3,
		3,
		3,
		3,
		3,
		3,
		3,
		3,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1
	],
	[
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		3,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		3,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1
	],
	[
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1
	],
	[
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1
	],
	[
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1
	],
	[
		1,
		2,
		0,
		0,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		3,
		3,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		0,
		0,
		2,
		1
	],
	[
		1,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1
	],
	[
		1,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1
	],
	[
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		0,
		0,
		0,
		0,
		1,
		1,
		0,
		0,
		0,
		0,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		1
	],
	[
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1
	],
	[
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1
	],
	[
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1
	],
	[
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1
	],
	[
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		0,
		1
	],
	[
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1
	]
];
function generateMathProblem() {
	const types = [
		() => {
			const a = __webpack_exports__default.Math.Between(2, 12), b = __webpack_exports__default.Math.Between(2, 12);
			return {
				q: `${a}×${b}=?`,
				answer: a * b
			};
		},
		() => {
			const a = __webpack_exports__default.Math.Between(10, 50), b = __webpack_exports__default.Math.Between(1, a);
			return {
				q: `${a}-${b}=?`,
				answer: a - b
			};
		},
		() => {
			const a = __webpack_exports__default.Math.Between(5, 25), b = __webpack_exports__default.Math.Between(5, 25);
			return {
				q: `${a}+${b}=?`,
				answer: a + b
			};
		},
		() => {
			const a = __webpack_exports__default.Math.Between(2, 9);
			__webpack_exports__default.Math.Between(2, 9);
			return {
				q: `${a}²=?`,
				answer: a * a
			};
		}
	];
	return types[__webpack_exports__default.Math.Between(0, types.length - 1)]();
}
function generateWrongAnswers(correct, count = 3) {
	const wrongs = /* @__PURE__ */ new Set();
	while (wrongs.size < count) {
		const candidate = correct + __webpack_exports__default.Math.Between(-15, 15);
		if (candidate !== correct && candidate > 0) wrongs.add(candidate);
	}
	return [...wrongs];
}
var GHOST_DEFS = [
	{
		color: 16711680,
		name: "Blinky",
		scatterTile: {
			col: 25,
			row: 0
		}
	},
	{
		color: 16759039,
		name: "Pinky",
		scatterTile: {
			col: 2,
			row: 0
		}
	},
	{
		color: 65535,
		name: "Inky",
		scatterTile: {
			col: 27,
			row: 30
		}
	},
	{
		color: 16758866,
		name: "Clyde",
		scatterTile: {
			col: 0,
			row: 30
		}
	}
];
var DIRS = [
	{
		dx: 1,
		dy: 0
	},
	{
		dx: -1,
		dy: 0
	},
	{
		dx: 0,
		dy: 1
	},
	{
		dx: 0,
		dy: -1
	}
];
var tileX = (col) => col * TILE + TILE / 2;
var tileY = (row) => row * TILE + TILE / 2;
function oppositeDir(dir) {
	return {
		dx: -dir.dx,
		dy: -dir.dy
	};
}
function dirsEq(a, b) {
	return a && b && a.dx === b.dx && a.dy === b.dy;
}
function canMove(col, row) {
	if (col < 0 || col >= MAZE_COLS || row < 0 || row >= MAZE_ROWS) return true;
	const cell = MAZE[row]?.[col];
	return cell !== void 0 && cell !== 1;
}
function FaskaPacSwarm({ onExit }) {
	const containerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let pacman, ghosts = [], dots = [], powerPellets = [], mathDots = [];
		let cursors;
		let score = 0, lives = 3;
		let scoreTxt, livesTxt, msgTxt;
		let activeProblem = null;
		let frightenedTimer = 0;
		let frightenedMax = 8e3;
		let gameOver = false;
		let levelComplete = false;
		let particles;
		let pacCol = 14, pacRow = 23;
		let pacDirX = 0, pacDirY = 0;
		let pacNextDirX = 0, pacNextDirY = 0;
		let pacPixelX, pacPixelY;
		let pacMoveTimer = 0;
		const PAC_SPEED = 120;
		const GHOST_STATE = {
			SCATTER: "scatter",
			CHASE: "chase",
			FRIGHTENED: "frightened",
			EATEN: "eaten"
		};
		const GHOST_SPEED = 180;
		function preload() {}
		function create() {
			const scene = this;
			scene.add.rectangle(0, 0, MAZE_COLS * TILE, MAZE_ROWS * TILE, 17).setOrigin(0, 0);
			const wallGfx = scene.add.graphics();
			wallGfx.fillStyle(1710847, 1);
			wallGfx.lineStyle(2, 4474111, 1);
			for (let row = 0; row < MAZE_ROWS; row++) for (let col = 0; col < MAZE_COLS; col++) if (MAZE[row][col] === 1) {
				wallGfx.fillRoundedRect(col * TILE + 1, row * TILE + 1, TILE - 2, TILE - 2, 3);
				wallGfx.strokeRoundedRect(col * TILE + 1, row * TILE + 1, TILE - 2, TILE - 2, 3);
			}
			const glowGfx = scene.add.graphics();
			glowGfx.lineStyle(1, 6711039, .4);
			for (let row = 0; row < MAZE_ROWS; row++) for (let col = 0; col < MAZE_COLS; col++) if (MAZE[row][col] === 1) glowGfx.strokeRect(col * TILE, row * TILE, TILE, TILE);
			const dotPositions = [];
			for (let row = 0; row < MAZE_ROWS; row++) for (let col = 0; col < MAZE_COLS; col++) {
				const cell = MAZE[row][col];
				if (cell === 2) {
					const pp = scene.add.graphics();
					pp.fillStyle(16777130, 1);
					pp.fillCircle(0, 0, 7);
					pp.x = tileX(col);
					pp.y = tileY(row);
					pp.setData("col", col);
					pp.setData("row", row);
					powerPellets.push(pp);
				} else if (cell === 0) dotPositions.push({
					col,
					row
				});
			}
			const shuffled = __webpack_exports__default.Utils.Array.Shuffle([...dotPositions]);
			const mathCount = Math.max(6, Math.floor(shuffled.length * .15));
			const mathPositions = /* @__PURE__ */ new Set();
			for (let i = 0; i < Math.min(mathCount, shuffled.length); i++) mathPositions.add(`${shuffled[i].col},${shuffled[i].row}`);
			for (const { col, row } of dotPositions) if (mathPositions.has(`${col},${row}`)) {
				const md = scene.add.graphics();
				md.fillStyle(16768256, 1);
				md.fillStar(0, 0, 5, 5, 2.5);
				md.x = tileX(col);
				md.y = tileY(row);
				md.setData("col", col);
				md.setData("row", row);
				md.setData("isMath", true);
				mathDots.push(md);
				scene.tweens.add({
					targets: md,
					scaleX: 1.3,
					scaleY: 1.3,
					duration: 500,
					yoyo: true,
					repeat: -1
				});
			} else {
				const dot = scene.add.graphics();
				dot.fillStyle(16766668, 1);
				dot.fillCircle(0, 0, 2.5);
				dot.x = tileX(col);
				dot.y = tileY(row);
				dot.setData("col", col);
				dot.setData("row", row);
				dots.push(dot);
			}
			pacPixelX = tileX(pacCol);
			pacPixelY = tileY(pacRow);
			const pg = scene.add.graphics();
			pg.fillStyle(16776960, 1);
			pg.fillCircle(TILE / 2, TILE / 2, TILE / 2 - 1);
			pg.generateTexture("pac", TILE, TILE);
			pg.destroy();
			pacman = scene.add.image(pacPixelX, pacPixelY, "pac").setDepth(5);
			const ghostStartPositions = [
				{
					col: 13,
					row: 14
				},
				{
					col: 14,
					row: 14
				},
				{
					col: 12,
					row: 12
				},
				{
					col: 15,
					row: 12
				}
			];
			GHOST_DEFS.forEach((def, i) => {
				const gg = scene.add.graphics();
				gg.fillStyle(def.color, 1);
				gg.fillRect(2, TILE / 2, TILE - 4, TILE / 2 - 2);
				gg.fillCircle(TILE / 2, TILE / 2, TILE / 2 - 2);
				for (let f = 0; f < 3; f++) gg.fillTriangle(2 + f * ((TILE - 4) / 3), TILE - 2, 2 + f * ((TILE - 4) / 3) + (TILE - 4) / 6, TILE - 7, 2 + (f + 1) * ((TILE - 4) / 3), TILE - 2);
				gg.fillStyle(16777215, 1);
				gg.fillCircle(TILE / 2 - 5, TILE / 2 - 2, 3);
				gg.fillCircle(TILE / 2 + 5, TILE / 2 - 2, 3);
				gg.fillStyle(255, 1);
				gg.fillCircle(TILE / 2 - 4, TILE / 2 - 2, 1.5);
				gg.fillCircle(TILE / 2 + 6, TILE / 2 - 2, 1.5);
				gg.generateTexture(`ghost_${i}`, TILE, TILE);
				gg.destroy();
				const fg = scene.add.graphics();
				fg.fillStyle(204, 1);
				fg.fillRect(2, TILE / 2, TILE - 4, TILE / 2 - 2);
				fg.fillCircle(TILE / 2, TILE / 2, TILE / 2 - 2);
				for (let f = 0; f < 3; f++) fg.fillTriangle(2 + f * ((TILE - 4) / 3), TILE - 2, 2 + f * ((TILE - 4) / 3) + (TILE - 4) / 6, TILE - 7, 2 + (f + 1) * ((TILE - 4) / 3), TILE - 2);
				fg.fillStyle(16777215, 1);
				fg.fillCircle(TILE / 2 - 5, TILE / 2 - 2, 3);
				fg.fillCircle(TILE / 2 + 5, TILE / 2 - 2, 3);
				fg.fillStyle(16711680, 1);
				fg.fillCircle(TILE / 2 - 4, TILE / 2 - 2, 1.5);
				fg.fillCircle(TILE / 2 + 6, TILE / 2 - 2, 1.5);
				fg.generateTexture("ghost_frightened", TILE, TILE);
				fg.destroy();
				const eg = scene.add.graphics();
				eg.fillStyle(16777215, 1);
				eg.fillCircle(TILE / 2 - 5, TILE / 2 - 2, 4);
				eg.fillCircle(TILE / 2 + 5, TILE / 2 - 2, 4);
				eg.fillStyle(255, 1);
				eg.fillCircle(TILE / 2 - 4, TILE / 2 - 2, 2);
				eg.fillCircle(TILE / 2 + 6, TILE / 2 - 2, 2);
				eg.generateTexture("ghost_eyes", TILE, TILE);
				eg.destroy();
				const startPos = ghostStartPositions[i];
				const ghost = {
					sprite: scene.add.image(tileX(startPos.col), tileY(startPos.row), `ghost_${i}`).setDepth(4),
					col: startPos.col,
					row: startPos.row,
					pixelX: tileX(startPos.col),
					pixelY: tileY(startPos.row),
					dir: DIRS[i % DIRS.length],
					prevDir: null,
					state: GHOST_STATE.SCATTER,
					moveTimer: i * 60,
					color: def.color,
					scatterTile: def.scatterTile,
					textureKey: `ghost_${i}`,
					eatScore: 200,
					releaseDelay: i * 3e3,
					released: i === 0
				};
				ghosts.push(ghost);
			});
			const pTex = scene.add.graphics();
			pTex.fillStyle(16777215, 1);
			pTex.fillCircle(4, 4, 4);
			pTex.generateTexture("particle", 8, 8);
			pTex.destroy();
			particles = scene.add.particles(0, 0, "particle", {
				speed: {
					min: 60,
					max: 200
				},
				scale: {
					start: .6,
					end: 0
				},
				lifespan: {
					min: 300,
					max: 600
				},
				quantity: 0,
				emitting: false,
				tint: [
					16776960,
					16746496,
					16711782,
					65535
				]
			});
			particles.setDepth(10);
			cursors = scene.input.keyboard.createCursorKeys();
			scene.input.keyboard.addKey("W").on("down", () => {
				pacNextDirX = 0;
				pacNextDirY = -1;
			});
			scene.input.keyboard.addKey("S").on("down", () => {
				pacNextDirX = 0;
				pacNextDirY = 1;
			});
			scene.input.keyboard.addKey("A").on("down", () => {
				pacNextDirX = -1;
				pacNextDirY = 0;
			});
			scene.input.keyboard.addKey("D").on("down", () => {
				pacNextDirX = 1;
				pacNextDirY = 0;
			});
			cursors.left.on("down", () => {
				pacNextDirX = -1;
				pacNextDirY = 0;
			});
			cursors.right.on("down", () => {
				pacNextDirX = 1;
				pacNextDirY = 0;
			});
			cursors.up.on("down", () => {
				pacNextDirX = 0;
				pacNextDirY = -1;
			});
			cursors.down.on("down", () => {
				pacNextDirX = 0;
				pacNextDirY = 1;
			});
			const uiY = MAZE_ROWS * TILE + 6;
			scene.add.text(8, uiY, "SCORE", {
				fontSize: "11px",
				fill: "#ffffff",
				fontFamily: "monospace"
			});
			scoreTxt = scene.add.text(8, uiY + 14, "0", {
				fontSize: "16px",
				fill: "#ffff00",
				fontFamily: "monospace",
				fontStyle: "bold"
			});
			scene.add.text(220, uiY, "LIVES", {
				fontSize: "11px",
				fill: "#ffffff",
				fontFamily: "monospace"
			});
			livesTxt = scene.add.text(220, uiY + 14, "♥ ♥ ♥", {
				fontSize: "16px",
				fill: "#ff4444",
				fontFamily: "monospace"
			});
			scene.add.text(400, uiY, "⭐=Math! Eat correct answer for +500", {
				fontSize: "9px",
				fill: "#ffdd00",
				fontFamily: "monospace"
			});
			msgTxt = scene.add.text(MAZE_COLS * TILE / 2, MAZE_ROWS * TILE / 2, "", {
				fontSize: "28px",
				fill: "#ffffff",
				fontFamily: "monospace",
				fontStyle: "bold",
				stroke: "#000000",
				strokeThickness: 4
			}).setOrigin(.5).setDepth(20);
			ghosts.forEach((g, i) => {
				if (i === 0) return;
				scene.time.delayedCall(g.releaseDelay, () => {
					g.released = true;
				});
			});
			const stateSeq = [
				{
					state: GHOST_STATE.SCATTER,
					dur: 7e3
				},
				{
					state: GHOST_STATE.CHASE,
					dur: 2e4
				},
				{
					state: GHOST_STATE.SCATTER,
					dur: 5e3
				},
				{
					state: GHOST_STATE.CHASE,
					dur: 2e4
				},
				{
					state: GHOST_STATE.SCATTER,
					dur: 5e3
				},
				{
					state: GHOST_STATE.CHASE,
					dur: 99999
				}
			];
			let seqIdx = 0;
			function advanceGhostState() {
				if (seqIdx >= stateSeq.length) return;
				const { state, dur } = stateSeq[seqIdx++];
				ghosts.forEach((g) => {
					if (g.state !== GHOST_STATE.FRIGHTENED && g.state !== GHOST_STATE.EATEN) g.state = state;
				});
				scene.time.delayedCall(dur, advanceGhostState);
			}
			scene.time.delayedCall(100, advanceGhostState);
			scene.cameras.main.setBackgroundColor("#000011");
		}
		function burst(scene, x, y, color, count = 20) {
			particles.setPosition(x, y);
			particles.setParticleTint(color);
			particles.explode(count, x, y);
		}
		function shake(scene, intensity = .007, duration = 200) {
			scene.cameras.main.shake(duration, intensity);
		}
		function showMathProblem(scene, originX, originY, problem) {
			if (activeProblem) dismissMathProblem();
			const { q, answer } = problem;
			const wrongs = generateWrongAnswers(answer);
			const allAnswers = __webpack_exports__default.Utils.Array.Shuffle([answer, ...wrongs]);
			const qBg = scene.add.graphics().setDepth(15);
			qBg.fillStyle(51, .92);
			qBg.fillRoundedRect(-60, -22, 120, 44, 8);
			qBg.lineStyle(2, 65535, 1);
			qBg.strokeRoundedRect(-60, -22, 120, 44, 8);
			qBg.x = originX;
			qBg.y = originY - 50;
			const qTxt = scene.add.text(originX, originY - 50, q, {
				fontSize: "18px",
				fill: "#00ffff",
				fontFamily: "monospace",
				fontStyle: "bold"
			}).setOrigin(.5).setDepth(16);
			scene.tweens.add({
				targets: [qBg, qTxt],
				y: "-=10",
				duration: 300,
				ease: "Back.Out"
			});
			const bubbles = [];
			const spread = 80;
			allAnswers.forEach((ans, idx) => {
				const angle = idx / allAnswers.length * Math.PI * 2;
				const bx = originX + Math.cos(angle) * spread;
				const by = originY + Math.sin(angle) * spread;
				const isCorrect = ans === answer;
				const col = Math.round((bx - TILE / 2) / TILE);
				const row = Math.round((by - TILE / 2) / TILE);
				const bgCircle = scene.add.graphics().setDepth(15);
				bgCircle.fillStyle(isCorrect ? 17408 : 2228224, 1);
				bgCircle.fillCircle(0, 0, 16);
				bgCircle.lineStyle(2, isCorrect ? 65416 : 16729156, 1);
				bgCircle.strokeCircle(0, 0, 16);
				bgCircle.x = bx;
				bgCircle.y = by;
				const aTxt = scene.add.text(bx, by, `${ans}`, {
					fontSize: "13px",
					fill: isCorrect ? "#00ff88" : "#ff8888",
					fontFamily: "monospace",
					fontStyle: "bold"
				}).setOrigin(.5).setDepth(16);
				scene.tweens.add({
					targets: [bgCircle, aTxt],
					scaleX: 1.15,
					scaleY: 1.15,
					duration: 600,
					yoyo: true,
					repeat: -1
				});
				bubbles.push({
					bgCircle,
					aTxt,
					isCorrect,
					col,
					row,
					bx,
					by
				});
			});
			activeProblem = {
				q,
				answer,
				wrongs,
				bubbles,
				qBg,
				qTxt
			};
		}
		function dismissMathProblem() {
			if (!activeProblem) return;
			const { bubbles, qBg, qTxt } = activeProblem;
			bubbles.forEach((b) => {
				b.bgCircle.destroy();
				b.aTxt.destroy();
			});
			qBg.destroy();
			qTxt.destroy();
			activeProblem = null;
		}
		function checkDotCollisions(scene) {
			const px = pacman.x, py = pacman.y;
			const threshold = TILE * .5;
			if (activeProblem) {
				for (const b of activeProblem.bubbles) if (Math.abs(px - b.bx) < threshold && Math.abs(py - b.by) < threshold) {
					if (b.isCorrect) {
						score += 500;
						showFloatingText(scene, px, py - 20, "+500 RICHTIG!", "#00ff88", 22);
						burst(scene, px, py, 65416, 35);
						shake(scene, .005, 150);
					} else {
						lives--;
						updateLivesDisplay();
						showFloatingText(scene, px, py - 20, "FALSCH! -Leben", "#ff4444", 20);
						burst(scene, px, py, 16729156, 20);
						shake(scene, .012, 300);
						if (lives <= 0) triggerGameOver(scene);
					}
					dismissMathProblem();
					scoreTxt.setText(`${score}`);
					return;
				}
			}
			for (let i = dots.length - 1; i >= 0; i--) {
				const d = dots[i];
				if (Math.abs(px - d.x) < threshold && Math.abs(py - d.y) < threshold) {
					score += 10;
					burst(scene, d.x, d.y, 16766668, 5);
					d.destroy();
					dots.splice(i, 1);
					scoreTxt.setText(`${score}`);
					checkWinCondition(scene);
					return;
				}
			}
			for (let i = mathDots.length - 1; i >= 0; i--) {
				const md = mathDots[i];
				if (Math.abs(px - md.x) < threshold && Math.abs(py - md.y) < threshold) {
					const problem = generateMathProblem();
					showMathProblem(scene, md.x, md.y, problem);
					burst(scene, md.x, md.y, 16768256, 10);
					md.destroy();
					mathDots.splice(i, 1);
					score += 10;
					scoreTxt.setText(`${score}`);
					checkWinCondition(scene);
					return;
				}
			}
			for (let i = powerPellets.length - 1; i >= 0; i--) {
				const pp = powerPellets[i];
				if (Math.abs(px - pp.x) < threshold && Math.abs(py - pp.y) < threshold) {
					score += 50;
					burst(scene, pp.x, pp.y, 16777130, 30);
					shake(scene, .006, 200);
					pp.destroy();
					powerPellets.splice(i, 1);
					frightenedTimer = frightenedMax;
					ghosts.forEach((g) => {
						if (g.state !== GHOST_STATE.EATEN) {
							g.state = GHOST_STATE.FRIGHTENED;
							g.eatScore = 200;
							g.sprite.setTexture("ghost_frightened");
						}
					});
					scoreTxt.setText(`${score}`);
					showFloatingText(scene, px, py - 30, "POWER!", "#ffff00", 24);
					return;
				}
			}
		}
		function checkGhostCollisions(scene) {
			const px = pacman.x, py = pacman.y;
			const threshold = TILE * .75;
			ghosts.forEach((g) => {
				if (!g.released) return;
				if (Math.abs(px - g.pixelX) < threshold && Math.abs(py - g.pixelY) < threshold) {
					if (g.state === GHOST_STATE.FRIGHTENED) {
						score += g.eatScore;
						g.eatScore = Math.min(g.eatScore * 2, 1600);
						showFloatingText(scene, g.pixelX, g.pixelY - 20, `+${g.eatScore / 2}`, "#00ffff", 20);
						burst(scene, g.pixelX, g.pixelY, g.color, 25);
						g.state = GHOST_STATE.EATEN;
						g.sprite.setTexture("ghost_eyes");
						scoreTxt.setText(`${score}`);
						scene.time.delayedCall(4e3, () => {
							g.col = 13 + ghosts.indexOf(g) % 2;
							g.row = 14;
							g.pixelX = tileX(g.col);
							g.pixelY = tileY(g.row);
							g.sprite.setPosition(g.pixelX, g.pixelY);
							g.sprite.setTexture(g.textureKey);
							g.state = GHOST_STATE.SCATTER;
						});
					} else if (g.state !== GHOST_STATE.EATEN) {
						lives--;
						updateLivesDisplay();
						burst(scene, px, py, 16776960, 40);
						shake(scene, .015, 400);
						showFloatingText(scene, px, py - 30, "AUTSCH!", "#ff4444", 26);
						dismissMathProblem();
						if (lives <= 0) triggerGameOver(scene);
						else scene.time.delayedCall(1e3, () => {
							resetPositions();
						});
					}
				}
			});
		}
		function resetPositions() {
			pacCol = 14;
			pacRow = 23;
			pacDirX = 0;
			pacDirY = 0;
			pacNextDirX = 0;
			pacNextDirY = 0;
			pacPixelX = tileX(pacCol);
			pacPixelY = tileY(pacRow);
			pacman.setPosition(pacPixelX, pacPixelY);
			const starts = [
				{
					col: 13,
					row: 14
				},
				{
					col: 14,
					row: 14
				},
				{
					col: 12,
					row: 12
				},
				{
					col: 15,
					row: 12
				}
			];
			ghosts.forEach((g, i) => {
				g.col = starts[i].col;
				g.row = starts[i].row;
				g.pixelX = tileX(g.col);
				g.pixelY = tileY(g.row);
				g.sprite.setPosition(g.pixelX, g.pixelY);
				g.sprite.setTexture(g.textureKey);
				g.state = GHOST_STATE.SCATTER;
			});
			frightenedTimer = 0;
		}
		function updateLivesDisplay() {
			livesTxt.setText("♥ ".repeat(Math.max(0, lives)).trim());
		}
		function triggerGameOver(scene) {
			gameOver = true;
			msgTxt.setText("GAME OVER\nDrücke R zum Neustart");
			msgTxt.setFill("#ff4444");
			scene.input.keyboard.addKey("R").on("down", () => {
				scene.scene.restart();
			});
			shake(scene, .02, 600);
		}
		function checkWinCondition(scene) {
			if (dots.length === 0 && mathDots.length === 0 && powerPellets.length === 0) {
				levelComplete = true;
				msgTxt.setText(`GEWONNEN! 🎉\nPunkte: ${score}`);
				msgTxt.setFill("#00ff88");
				burst(scene, MAZE_COLS * TILE / 2, MAZE_ROWS * TILE / 2, 65416, 80);
				scene.time.delayedCall(4e3, () => {
					if (onExit) onExit();
				});
			}
		}
		function showFloatingText(scene, x, y, text, color, size = 18) {
			const t = scene.add.text(x, y, text, {
				fontSize: `${size}px`,
				fill: color,
				fontFamily: "monospace",
				fontStyle: "bold",
				stroke: "#000000",
				strokeThickness: 3
			}).setOrigin(.5).setDepth(20);
			scene.tweens.add({
				targets: t,
				y: y - 50,
				alpha: 0,
				duration: 1e3,
				ease: "Power2",
				onComplete: () => t.destroy()
			});
		}
		function moveGhost(ghost, delta, scene) {
			if (!ghost.released) return;
			ghost.moveTimer += delta;
			if (ghost.moveTimer < GHOST_SPEED) return;
			ghost.moveTimer = 0;
			const { col, row } = ghost;
			let targetCol, targetRow;
			if (ghost.state === GHOST_STATE.FRIGHTENED) {
				const validDirs = DIRS.filter((d) => {
					return canMove(col + d.dx, row + d.dy) && !dirsEq(d, oppositeDir(ghost.dir));
				});
				if (validDirs.length > 0) ghost.dir = validDirs[__webpack_exports__default.Math.Between(0, validDirs.length - 1)];
			} else if (ghost.state === GHOST_STATE.EATEN) {
				targetCol = 13;
				targetRow = 14;
				chooseGhostDir(ghost, targetCol, targetRow, col, row);
			} else if (ghost.state === GHOST_STATE.SCATTER) {
				targetCol = ghost.scatterTile.col;
				targetRow = ghost.scatterTile.row;
				chooseGhostDir(ghost, targetCol, targetRow, col, row);
			} else {
				targetCol = pacCol;
				targetRow = pacRow;
				chooseGhostDir(ghost, targetCol, targetRow, col, row);
			}
			let nc = col + ghost.dir.dx;
			let nr = row + ghost.dir.dy;
			if (nc < 0) nc = MAZE_COLS - 1;
			else if (nc >= MAZE_COLS) nc = 0;
			if (canMove(nc, nr)) {
				ghost.col = nc;
				ghost.row = nr;
				ghost.pixelX = tileX(nc);
				ghost.pixelY = tileY(nr);
				ghost.sprite.setPosition(ghost.pixelX, ghost.pixelY);
			} else {
				const fallback = DIRS.filter((d) => {
					return canMove(col + d.dx, row + d.dy) && !dirsEq(d, oppositeDir(ghost.dir));
				});
				if (fallback.length > 0) ghost.dir = fallback[__webpack_exports__default.Math.Between(0, fallback.length - 1)];
			}
		}
		function chooseGhostDir(ghost, targetCol, targetRow, col, row) {
			let bestDir = ghost.dir;
			let bestDist = Infinity;
			DIRS.forEach((d) => {
				if (dirsEq(d, oppositeDir(ghost.dir))) return;
				const nc = col + d.dx, nr = row + d.dy;
				if (!canMove(nc, nr)) return;
				const dist = Math.abs(nc - targetCol) + Math.abs(nr - targetRow);
				if (dist < bestDist) {
					bestDist = dist;
					bestDir = d;
				}
			});
			ghost.dir = bestDir;
		}
		function movePacman(delta) {
			pacMoveTimer += delta;
			if (pacMoveTimer < PAC_SPEED) return;
			pacMoveTimer = 0;
			if (canMove(pacCol + pacNextDirX, pacRow + pacNextDirY)) {
				pacDirX = pacNextDirX;
				pacDirY = pacNextDirY;
			}
			let nc2 = pacCol + pacDirX;
			let nr2 = pacRow + pacDirY;
			if (nc2 < 0) nc2 = MAZE_COLS - 1;
			else if (nc2 >= MAZE_COLS) nc2 = 0;
			if (canMove(nc2, nr2)) {
				pacCol = nc2;
				pacRow = nr2;
				pacPixelX = tileX(pacCol);
				pacPixelY = tileY(pacRow);
				pacman.setPosition(pacPixelX, pacPixelY);
			}
			if (pacDirX === 1) pacman.setAngle(0);
			else if (pacDirX === -1) pacman.setAngle(180);
			else if (pacDirY === -1) pacman.setAngle(270);
			else if (pacDirY === 1) pacman.setAngle(90);
		}
		let ppFlicker = 0;
		function flickerPellets(delta) {
			ppFlicker += delta;
			if (ppFlicker > 400) {
				ppFlicker = 0;
				powerPellets.forEach((pp) => {
					pp.setVisible(!pp.visible);
				});
			}
		}
		function update(time, delta) {
			if (gameOver || levelComplete) return;
			movePacman(delta);
			flickerPellets(delta);
			if (frightenedTimer > 0) {
				frightenedTimer -= delta;
				if (frightenedTimer <= 0) {
					frightenedTimer = 0;
					ghosts.forEach((g) => {
						if (g.state === GHOST_STATE.FRIGHTENED) {
							g.state = GHOST_STATE.SCATTER;
							g.sprite.setTexture(g.textureKey);
						}
					});
				}
			}
			ghosts.forEach((g) => moveGhost(g, delta, this));
			checkDotCollisions(this);
			checkGhostCollisions(this);
		}
		const W = MAZE_COLS * TILE;
		const H = MAZE_ROWS * TILE + 44;
		const config = {
			type: __webpack_exports__default.AUTO,
			width: W,
			height: H,
			parent: containerRef.current,
			backgroundColor: "#000011",
			scene: {
				preload,
				create,
				update
			}
		};
		const game = new __webpack_exports__default.Game(config);
		return () => {
			game.destroy(true);
		};
	}, [onExit]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100vw",
			height: "100vh",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "flex-start",
			backgroundColor: "#000011",
			overflow: "hidden",
			position: "relative"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 12,
					right: 16,
					zIndex: 100,
					display: "flex",
					alignItems: "center",
					gap: 12
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: {
						color: "#ffff00",
						fontFamily: "monospace",
						fontSize: 13,
						textShadow: "0 0 8px #ffff00",
						letterSpacing: 1
					},
					children: "← ↑ → ↓ / WASD"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					style: {
						padding: "8px 20px",
						background: "transparent",
						color: "#ff4466",
						border: "2px solid #ff4466",
						borderRadius: 6,
						cursor: "pointer",
						fontWeight: "bold",
						fontSize: 14,
						fontFamily: "monospace",
						boxShadow: "0 0 12px #ff4466",
						transition: "all 0.18s",
						letterSpacing: 1
					},
					onMouseOver: (e) => {
						e.currentTarget.style.background = "#ff4466";
						e.currentTarget.style.color = "#000";
					},
					onMouseOut: (e) => {
						e.currentTarget.style.background = "transparent";
						e.currentTarget.style.color = "#ff4466";
					},
					children: "Beenden"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					color: "#ffff00",
					fontFamily: "monospace",
					fontSize: 20,
					fontWeight: "bold",
					textShadow: "0 0 14px #ffff00",
					padding: "10px 0 4px",
					letterSpacing: 3,
					flexShrink: 0
				},
				children: "★ FASKA PAC SWARM ★"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: containerRef,
				style: {
					flexShrink: 0,
					boxShadow: "0 0 40px #1a1aff, 0 0 80px #0000aa",
					border: "2px solid #1a1aff"
				}
			})
		]
	});
}
//#endregion
export { FaskaPacSwarm as default };
