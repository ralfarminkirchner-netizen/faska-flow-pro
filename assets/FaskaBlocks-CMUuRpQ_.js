import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaBlocks/FaskaBlocks.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FaskaBlocks = ({ onExit }) => {
	const gameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const SHAPES = [
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
		const COLORS = [
			65535,
			255,
			16753920,
			16776960,
			65280,
			8388736,
			16711680
		];
		const CELL_SIZE = 28;
		const COLS = 10;
		const ROWS = 20;
		const BOARD_X = (400 - COLS * CELL_SIZE) / 2;
		const BOARD_Y = 30;
		class MainScene extends __webpack_exports__default.Scene {
			constructor() {
				super({ key: "MainScene" });
			}
			create() {
				const g = this.make.graphics({
					x: 0,
					y: 0,
					add: false
				});
				g.fillStyle(16777215);
				g.fillCircle(4, 4, 4);
				g.generateTexture("particle", 8, 8);
				this.score = 0;
				this.gameOver = false;
				this.isResolving = false;
				this.dropInterval = 1e3;
				this.nextDropTime = this.time.now + this.dropInterval;
				this.grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
				const bg = this.add.graphics();
				bg.fillStyle(0, .8);
				bg.fillRect(BOARD_X, BOARD_Y, COLS * CELL_SIZE, ROWS * CELL_SIZE);
				bg.lineStyle(1, 16777215, .1);
				for (let i = 0; i <= COLS; i++) {
					bg.moveTo(BOARD_X + i * CELL_SIZE, BOARD_Y);
					bg.lineTo(BOARD_X + i * CELL_SIZE, BOARD_Y + ROWS * CELL_SIZE);
				}
				for (let i = 0; i <= ROWS; i++) {
					bg.moveTo(BOARD_X, BOARD_Y + i * CELL_SIZE);
					bg.lineTo(BOARD_X + COLS * CELL_SIZE, BOARD_Y + i * CELL_SIZE);
				}
				bg.strokePath();
				this.scoreText = this.add.text(10, 5, "Score: 0", {
					fontSize: "20px",
					fontFamily: "Arial",
					fill: "#fff",
					fontStyle: "bold"
				});
				this.add.text(10, 570, "Arrows: Move/Rotate | Space: Drop", {
					fontSize: "14px",
					fontFamily: "Arial",
					fill: "#aaa"
				});
				this.add.text(10, 585, "Match lines adding up to 10!", {
					fontSize: "14px",
					fontFamily: "Arial",
					fill: "#ffaa00",
					fontStyle: "bold"
				});
				this.input.keyboard.on("keydown-LEFT", () => this.movePiece(-1, 0));
				this.input.keyboard.on("keydown-RIGHT", () => this.movePiece(1, 0));
				this.input.keyboard.on("keydown-DOWN", () => this.movePiece(0, 1));
				this.input.keyboard.on("keydown-UP", () => this.rotatePiece());
				this.input.keyboard.on("keydown-SPACE", () => this.hardDrop());
				this.spawnPiece();
			}
			createBlock(x, y, value, color) {
				const container = this.add.container(BOARD_X + x * CELL_SIZE, BOARD_Y + y * CELL_SIZE);
				const bg = this.add.graphics();
				bg.fillStyle(color, 1);
				bg.fillRoundedRect(1, 1, CELL_SIZE - 2, CELL_SIZE - 2, 4);
				bg.lineStyle(2, 16777215, .4);
				bg.strokeRoundedRect(2, 2, CELL_SIZE - 4, CELL_SIZE - 4, 4);
				const text = this.add.text(CELL_SIZE / 2, CELL_SIZE / 2, value.toString(), {
					fontFamily: "Arial",
					fontSize: "18px",
					color: "#ffffff",
					fontStyle: "bold"
				}).setOrigin(.5);
				text.setShadow(1, 1, "#000000", 2);
				container.add([bg, text]);
				return {
					value,
					color,
					container,
					x,
					y
				};
			}
			spawnPiece() {
				const typeIndex = __webpack_exports__default.Math.Between(0, SHAPES.length - 1);
				const shape = SHAPES[typeIndex];
				const color = COLORS[typeIndex];
				const values = [];
				for (let r = 0; r < shape.length; r++) {
					values[r] = [];
					for (let c = 0; c < shape[r].length; c++) if (shape[r][c]) values[r][c] = __webpack_exports__default.Math.Between(1, 9);
					else values[r][c] = 0;
				}
				this.currentPiece = {
					shape,
					values,
					color,
					x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
					y: 0
				};
				this.renderCurrentPiece();
				if (!this.isValid(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
					this.gameOver = true;
					this.add.text(200, 300, "GAME OVER", {
						fontSize: "48px",
						fontFamily: "Arial",
						color: "#ff0000",
						fontStyle: "bold"
					}).setOrigin(.5).setShadow(2, 2, "#000", 4);
				}
			}
			isValid(px, py, shape) {
				for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[r].length; c++) if (shape[r][c]) {
					let nx = px + c;
					let ny = py + r;
					if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
					if (ny >= 0 && this.grid[ny][nx]) return false;
				}
				return true;
			}
			movePiece(dx, dy) {
				if (this.gameOver || !this.currentPiece || this.isResolving) return false;
				if (this.isValid(this.currentPiece.x + dx, this.currentPiece.y + dy, this.currentPiece.shape)) {
					this.currentPiece.x += dx;
					this.currentPiece.y += dy;
					this.updateCurrentPieceRender();
					return true;
				}
				return false;
			}
			rotatePiece() {
				if (this.gameOver || !this.currentPiece || this.isResolving) return;
				const { shape, values } = this.currentPiece;
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
				if (this.isValid(this.currentPiece.x, this.currentPiece.y, newShape)) {
					this.currentPiece.shape = newShape;
					this.currentPiece.values = newValues;
					this.clearCurrentPieceRender();
					this.renderCurrentPiece();
				}
			}
			renderCurrentPiece() {
				this.currentPieceBlocks = [];
				const { shape, values, color, x, y } = this.currentPiece;
				for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[r].length; c++) if (shape[r][c]) {
					let block = this.createBlock(x + c, y + r, values[r][c], color);
					this.currentPieceBlocks.push({
						r,
						c,
						block
					});
				}
			}
			updateCurrentPieceRender() {
				const { x, y } = this.currentPiece;
				for (let b of this.currentPieceBlocks) {
					b.block.container.x = BOARD_X + (x + b.c) * CELL_SIZE;
					b.block.container.y = BOARD_Y + (y + b.r) * CELL_SIZE;
				}
			}
			clearCurrentPieceRender() {
				if (this.currentPieceBlocks) {
					for (let b of this.currentPieceBlocks) b.block.container.destroy();
					this.currentPieceBlocks = [];
				}
			}
			hardDrop() {
				if (this.gameOver || this.isResolving) return;
				while (this.movePiece(0, 1));
				this.settlePiece();
				this.nextDropTime = this.time.now + this.dropInterval;
			}
			settlePiece() {
				const { x, y } = this.currentPiece;
				for (let b of this.currentPieceBlocks) {
					let gx = x + b.c;
					let gy = y + b.r;
					if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS) this.grid[gy][gx] = b.block;
					else b.block.container.destroy();
				}
				this.currentPiece = null;
				this.currentPieceBlocks = [];
				this.resolveBoard();
			}
			resolveBoard() {
				this.isResolving = true;
				let toDestroy = /* @__PURE__ */ new Set();
				for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
					if (!this.grid[y][x]) continue;
					let sum = 0;
					let seq = [];
					for (let i = x; i < COLS; i++) {
						if (!this.grid[y][i]) break;
						sum += this.grid[y][i].value;
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
					if (!this.grid[y][x]) continue;
					let sum = 0;
					let seq = [];
					for (let i = y; i < ROWS; i++) {
						if (!this.grid[i][x]) break;
						sum += this.grid[i][x].value;
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
					this.score += toDestroy.size * 10;
					this.scoreText.setText(`Score: ${this.score}`);
					this.cameras.main.shake(150, .015);
					toDestroy.forEach((posStr) => {
						let [y, x] = posStr.split(",").map(Number);
						let block = this.grid[y][x];
						this.add.particles(block.container.x + CELL_SIZE / 2, block.container.y + CELL_SIZE / 2, "particle", {
							speed: {
								min: -150,
								max: 150
							},
							angle: {
								min: 0,
								max: 360
							},
							scale: {
								start: .8,
								end: 0
							},
							blendMode: "ADD",
							lifespan: 400,
							tint: block.color
						}).explode(15);
						block.container.destroy();
						this.grid[y][x] = null;
					});
					this.time.delayedCall(300, () => {
						if (this.applyGravity()) this.time.delayedCall(300, () => {
							this.resolveBoard();
						});
						else this.resolveBoard();
					});
				} else {
					this.dropInterval = Math.max(200, this.dropInterval - 5);
					this.isResolving = false;
					this.spawnPiece();
				}
			}
			applyGravity() {
				let moved = false;
				for (let x = 0; x < COLS; x++) for (let y = ROWS - 2; y >= 0; y--) if (this.grid[y][x] && !this.grid[y + 1][x]) {
					let dropY = y;
					while (dropY < ROWS - 1 && !this.grid[dropY + 1][x]) dropY++;
					let block = this.grid[y][x];
					this.grid[dropY][x] = block;
					this.grid[y][x] = null;
					this.tweens.add({
						targets: block.container,
						y: BOARD_Y + dropY * CELL_SIZE,
						duration: 250,
						ease: "Bounce.easeOut"
					});
					moved = true;
				}
				return moved;
			}
			update(time) {
				if (this.gameOver || this.isResolving) return;
				if (time > this.nextDropTime) {
					if (!this.movePiece(0, 1)) this.settlePiece();
					this.nextDropTime = time + this.dropInterval;
				}
			}
		}
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 400,
			height: 600,
			parent: "phaser-faskablocks",
			backgroundColor: "#1a1a2e",
			scene: MainScene,
			physics: {
				default: "arcade",
				arcade: { gravity: { y: 0 } }
			}
		};
		const game = new __webpack_exports__default.Game(config);
		gameRef.current = game;
		return () => {
			game.destroy(true);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "400px",
			height: "600px",
			margin: "0 auto",
			fontFamily: "sans-serif"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "10px",
				right: "10px",
				zIndex: 10,
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
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: "phaser-faskablocks",
			style: {
				width: "100%",
				height: "100%",
				borderRadius: "8px",
				overflow: "hidden",
				boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
			}
		})]
	});
};
//#endregion
export { FaskaBlocks as default };
