import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
import { t as PhaserWrapper } from "./PhaserWrapper-C2GMApUX.js";
//#region src/components/games/engines/FaskaBombermanSwarm/FaskaBombermanSwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var BLOCK_SIZE = 48;
var COLS = 15;
var ROWS = 11;
var WIDTH = COLS * BLOCK_SIZE;
var HEIGHT = ROWS * BLOCK_SIZE;
var BootScene = class extends __webpack_exports__default.Scene {
	constructor() {
		super("BootScene");
	}
	create() {
		this.generateTextures();
		this.scene.start("MainScene");
	}
	generateTextures() {
		const g = this.add.graphics();
		g.fillStyle(5592405);
		g.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
		g.fillStyle(7829367);
		g.fillRect(4, 4, BLOCK_SIZE - 8, BLOCK_SIZE - 8);
		g.generateTexture("hard_block", BLOCK_SIZE, BLOCK_SIZE);
		g.clear();
		g.fillStyle(9127187);
		g.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
		g.fillStyle(10506797);
		g.fillRect(2, 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
		g.lineStyle(2, 6041099);
		g.beginPath();
		g.moveTo(0, BLOCK_SIZE / 2);
		g.lineTo(BLOCK_SIZE, BLOCK_SIZE / 2);
		g.moveTo(BLOCK_SIZE / 2, 0);
		g.lineTo(BLOCK_SIZE / 2, BLOCK_SIZE);
		g.strokePath();
		g.generateTexture("soft_block", BLOCK_SIZE, BLOCK_SIZE);
		g.clear();
		g.fillStyle(35071);
		g.fillCircle(BLOCK_SIZE / 2, BLOCK_SIZE / 2, BLOCK_SIZE / 2 - 4);
		g.fillStyle(16777215);
		g.fillCircle(BLOCK_SIZE / 2 - 6, BLOCK_SIZE / 2 - 4, 4);
		g.fillCircle(BLOCK_SIZE / 2 + 6, BLOCK_SIZE / 2 - 4, 4);
		g.generateTexture("player", BLOCK_SIZE, BLOCK_SIZE);
		g.clear();
		g.fillStyle(16720384);
		g.fillCircle(BLOCK_SIZE / 2, BLOCK_SIZE / 2, BLOCK_SIZE / 2 - 4);
		g.fillStyle(16776960);
		g.fillTriangle(BLOCK_SIZE / 2 - 10, BLOCK_SIZE / 2 - 8, BLOCK_SIZE / 2 - 4, BLOCK_SIZE / 2 - 2, BLOCK_SIZE / 2 - 2, BLOCK_SIZE / 2 - 8);
		g.fillTriangle(BLOCK_SIZE / 2 + 10, BLOCK_SIZE / 2 - 8, BLOCK_SIZE / 2 + 4, BLOCK_SIZE / 2 - 2, BLOCK_SIZE / 2 + 2, BLOCK_SIZE / 2 - 8);
		g.generateTexture("enemy", BLOCK_SIZE, BLOCK_SIZE);
		g.clear();
		g.fillStyle(1118481);
		g.fillCircle(BLOCK_SIZE / 2, BLOCK_SIZE / 2 + 4, BLOCK_SIZE / 2 - 8);
		g.fillStyle(11184810);
		g.fillRect(BLOCK_SIZE / 2 - 4, BLOCK_SIZE / 2 - 12, 8, 8);
		g.lineStyle(2, 16755200);
		g.beginPath();
		g.moveTo(BLOCK_SIZE / 2, BLOCK_SIZE / 2 - 12);
		g.lineTo(BLOCK_SIZE / 2 + 6, BLOCK_SIZE / 2 - 18);
		g.strokePath();
		g.generateTexture("bomb", BLOCK_SIZE, BLOCK_SIZE);
		g.clear();
		g.fillStyle(16755200);
		g.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
		g.fillStyle(16724736);
		g.fillRect(4, 4, BLOCK_SIZE - 8, BLOCK_SIZE - 8);
		g.generateTexture("explosion", BLOCK_SIZE, BLOCK_SIZE);
		g.clear();
		g.fillStyle(16766720);
		g.beginPath();
		g.moveTo(BLOCK_SIZE / 2, 4);
		g.lineTo(BLOCK_SIZE - 4, BLOCK_SIZE / 2);
		g.lineTo(BLOCK_SIZE / 2, BLOCK_SIZE - 4);
		g.lineTo(4, BLOCK_SIZE / 2);
		g.closePath();
		g.fillPath();
		g.generateTexture("powerup", BLOCK_SIZE, BLOCK_SIZE);
		g.clear();
		g.fillStyle(16733440);
		g.fillCircle(4, 4, 4);
		g.generateTexture("spark", 8, 8);
		g.clear();
		g.destroy();
	}
};
var MainScene = class extends __webpack_exports__default.Scene {
	constructor() {
		super("MainScene");
	}
	create() {
		this.grid = [];
		this.blocks = this.physics.add.staticGroup();
		this.softBlocks = this.physics.add.staticGroup();
		this.bombs = this.physics.add.staticGroup();
		this.explosions = this.physics.add.group();
		this.powerups = this.physics.add.group();
		this.activePowerups = [];
		this.playerBombRange = 2;
		this.playerBombMax = 1;
		this.playerBombsActive = 0;
		this.playerSpeed = 150;
		this.cursors = this.input.keyboard.createCursorKeys();
		this.wasd = {
			up: this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.W),
			down: this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.S),
			left: this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.A),
			right: this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.D),
			space: this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.SPACE)
		};
		for (let r = 0; r < ROWS; r++) {
			this.grid[r] = [];
			for (let c = 0; c < COLS; c++) {
				this.grid[r][c] = 0;
				if (r % 2 === 1 && c % 2 === 1) {
					this.grid[r][c] = 1;
					const b = this.blocks.create(c * BLOCK_SIZE + BLOCK_SIZE / 2, r * BLOCK_SIZE + BLOCK_SIZE / 2, "hard_block");
					b.gridR = r;
					b.gridC = c;
				} else {
					const isStartP1 = r === 0 && c <= 2 || r <= 2 && c === 0 || r === 1 && c === 1;
					const isStartP2 = r === ROWS - 1 && c >= COLS - 3 || r >= ROWS - 3 && c === COLS - 1 || r === ROWS - 2 && c === COLS - 2;
					if (!isStartP1 && !isStartP2) {
						if (__webpack_exports__default.Math.Between(0, 100) < 60) {
							this.grid[r][c] = 2;
							const sb = this.softBlocks.create(c * BLOCK_SIZE + BLOCK_SIZE / 2, r * BLOCK_SIZE + BLOCK_SIZE / 2, "soft_block");
							sb.gridR = r;
							sb.gridC = c;
						}
					}
				}
			}
		}
		this.player = this.physics.add.sprite(BLOCK_SIZE / 2, BLOCK_SIZE / 2, "player");
		this.player.setCollideWorldBounds(true);
		this.player.body.setSize(BLOCK_SIZE - 12, BLOCK_SIZE - 12);
		this.enemy = this.physics.add.sprite((COLS - 1) * BLOCK_SIZE + BLOCK_SIZE / 2, (ROWS - 1) * BLOCK_SIZE + BLOCK_SIZE / 2, "enemy");
		this.enemy.setCollideWorldBounds(true);
		this.enemy.body.setSize(BLOCK_SIZE - 12, BLOCK_SIZE - 12);
		this.enemySpeed = 100;
		this.enemyBombRange = 2;
		this.enemyState = "move";
		this.enemyMoveDir = {
			x: 0,
			y: 0
		};
		this.enemyMoveTimer = 0;
		this.physics.add.collider(this.player, this.blocks);
		this.physics.add.collider(this.player, this.softBlocks);
		this.physics.add.collider(this.player, this.bombs);
		this.physics.add.collider(this.enemy, this.blocks);
		this.physics.add.collider(this.enemy, this.softBlocks);
		this.physics.add.overlap(this.player, this.powerups, this.touchPowerup, null, this);
		this._quizCloseHandler = (e) => {
			if (!this.activeQuizPowerup) return;
			const success = e.detail.success;
			this.scene.resume();
			if (success) this.collectPowerup(this.activeQuizPowerup);
			else this.destroyPowerup(this.activeQuizPowerup);
			this.activeQuizPowerup = null;
		};
		window.addEventListener("BOMBERMAN_QUIZ_CLOSE", this._quizCloseHandler);
		this.events.once("destroy", () => {
			window.removeEventListener("BOMBERMAN_QUIZ_CLOSE", this._quizCloseHandler);
		});
		this.particles = this.add.particles("spark");
		this.emitter = this.particles.createEmitter({
			speed: {
				min: -200,
				max: 200
			},
			angle: {
				min: 0,
				max: 360
			},
			scale: {
				start: 1,
				end: 0
			},
			blendMode: "ADD",
			lifespan: 600,
			gravityY: 0,
			on: false
		});
		this.gameOver = false;
	}
	touchPowerup(player, sprite) {
		if (this.activeQuizPowerup) return;
		const p = this.activePowerups.find((p) => p.sprite === sprite);
		if (!p || !p.active) return;
		this.activeQuizPowerup = p;
		this.scene.pause();
		window.dispatchEvent(new CustomEvent("BOMBERMAN_QUIZ_OPEN", { detail: {
			q: p.str,
			a: p.answer
		} }));
	}
	destroyPowerup(p) {
		p.active = false;
		this.emitter.setPosition(p.sprite.x, p.sprite.y);
		this.emitter.explode(20);
		p.sprite.destroy();
		p.text.destroy();
		const index = this.activePowerups.indexOf(p);
		if (index > -1) this.activePowerups.splice(index, 1);
	}
	collectPowerup(p) {
		p.active = false;
		this.emitter.setPosition(p.sprite.x, p.sprite.y);
		this.emitter.explode(30);
		p.sprite.destroy();
		p.text.destroy();
		const index = this.activePowerups.indexOf(p);
		if (index > -1) this.activePowerups.splice(index, 1);
		const rand = __webpack_exports__default.Math.Between(0, 1);
		let msg = "";
		if (rand === 0) {
			this.playerBombRange++;
			msg = "Bomben-Reichweite +1!";
		} else {
			this.playerBombMax++;
			msg = "Max Bomben +1!";
		}
		const ft = this.add.text(this.player.x, this.player.y - 30, msg, {
			fontSize: "16px",
			fill: "#00ff00",
			fontStyle: "bold",
			stroke: "#000",
			strokeThickness: 4
		}).setOrigin(.5);
		this.tweens.add({
			targets: ft,
			y: ft.y - 50,
			alpha: 0,
			duration: 1500,
			onComplete: () => ft.destroy()
		});
	}
	update(time, delta) {
		if (this.gameOver) return;
		this.player.setVelocity(0);
		if (this.cursors.left.isDown || this.wasd.left.isDown) this.player.setVelocityX(-this.playerSpeed);
		else if (this.cursors.right.isDown || this.wasd.right.isDown) this.player.setVelocityX(this.playerSpeed);
		if (this.cursors.up.isDown || this.wasd.up.isDown) this.player.setVelocityY(-this.playerSpeed);
		else if (this.cursors.down.isDown || this.wasd.down.isDown) this.player.setVelocityY(this.playerSpeed);
		if (this.player.body.velocity.x !== 0 && this.player.body.velocity.y !== 0) this.player.body.velocity.normalize().scale(this.playerSpeed);
		if (__webpack_exports__default.Input.Keyboard.JustDown(this.wasd.space)) this.dropBomb(this.player, this.playerBombRange, true);
		this.updateEnemy(time, delta);
		this.physics.overlap(this.player, this.explosions, this.hitPlayer, null, this);
		this.physics.overlap(this.enemy, this.explosions, this.hitEnemy, null, this);
	}
	updateEnemy(time, delta) {
		if (!this.enemy.active) return;
		this.enemy.setVelocity(0);
		if (time > this.enemyMoveTimer) if (__webpack_exports__default.Math.Between(0, 100) < 20) {
			this.dropBomb(this.enemy, this.enemyBombRange, false);
			this.enemyMoveDir = {
				x: 0,
				y: 0
			};
			this.enemyMoveTimer = time + 500;
		} else {
			this.enemyMoveDir = __webpack_exports__default.Math.RND.pick([
				{
					x: -1,
					y: 0
				},
				{
					x: 1,
					y: 0
				},
				{
					x: 0,
					y: -1
				},
				{
					x: 0,
					y: 1
				}
			]);
			this.enemyMoveTimer = time + __webpack_exports__default.Math.Between(400, 1e3);
		}
		this.enemy.setVelocityX(this.enemyMoveDir.x * this.enemySpeed);
		this.enemy.setVelocityY(this.enemyMoveDir.y * this.enemySpeed);
		if (this.enemy.body.velocity.x !== 0 || this.enemy.body.velocity.y !== 0) {
			if (this.enemy.body.blocked.none === false) this.enemyMoveTimer = 0;
		}
	}
	dropBomb(owner, range, isPlayer) {
		if (isPlayer && this.playerBombsActive >= this.playerBombMax) return;
		const gridC = Math.floor(owner.x / BLOCK_SIZE);
		const gridR = Math.floor(owner.y / BLOCK_SIZE);
		const px = gridC * BLOCK_SIZE + BLOCK_SIZE / 2;
		const py = gridR * BLOCK_SIZE + BLOCK_SIZE / 2;
		let canDrop = true;
		this.bombs.children.iterate((b) => {
			if (b && b.gridC === gridC && b.gridR === gridR) canDrop = false;
		});
		if (!canDrop) return;
		if (isPlayer) this.playerBombsActive++;
		const bomb = this.bombs.create(px, py, "bomb");
		bomb.gridC = gridC;
		bomb.gridR = gridR;
		bomb.range = range;
		bomb.isPlayer = isPlayer;
		this.tweens.add({
			targets: bomb,
			scaleX: 1.2,
			scaleY: 1.2,
			yoyo: true,
			repeat: -1,
			duration: 300
		});
		this.time.delayedCall(2500, () => {
			if (bomb.active) this.explodeBomb(bomb);
		});
	}
	explodeBomb(bomb) {
		if (!bomb || !bomb.active) return;
		if (bomb.isPlayer) this.playerBombsActive = Math.max(0, this.playerBombsActive - 1);
		const gc = bomb.gridC;
		const gr = bomb.gridR;
		const range = bomb.range;
		bomb.destroy();
		this.cameras.main.shake(150, .005);
		this.createExplosionEffect(gc, gr);
		for (let d of [
			{
				dc: 0,
				dr: -1
			},
			{
				dc: 0,
				dr: 1
			},
			{
				dc: -1,
				dr: 0
			},
			{
				dc: 1,
				dr: 0
			}
		]) for (let i = 1; i <= range; i++) {
			const nc = gc + d.dc * i;
			const nr = gr + d.dr * i;
			if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) break;
			const blockType = this.grid[nr][nc];
			if (blockType === 1) break;
			this.createExplosionEffect(nc, nr);
			if (blockType === 2) {
				this.destroySoftBlock(nc, nr);
				break;
			}
			this.bombs.children.iterate((b) => {
				if (b && b.active && b.gridC === nc && b.gridR === nr) this.time.delayedCall(100, () => this.explodeBomb(b));
			});
		}
	}
	createExplosionEffect(c, r) {
		const x = c * BLOCK_SIZE + BLOCK_SIZE / 2;
		const y = r * BLOCK_SIZE + BLOCK_SIZE / 2;
		const exp = this.explosions.create(x, y, "explosion");
		this.tweens.add({
			targets: exp,
			alpha: 0,
			scaleX: .5,
			scaleY: .5,
			duration: 300,
			onComplete: () => exp.destroy()
		});
		this.time.delayedCall(100, () => {
			if (exp && exp.body) exp.body.enable = false;
		});
	}
	destroySoftBlock(c, r) {
		this.grid[r][c] = 0;
		this.softBlocks.children.iterate((sb) => {
			if (sb && sb.gridC === c && sb.gridR === r) {
				this.emitter.setPosition(sb.x, sb.y);
				this.emitter.explode(10);
				sb.destroy();
				if (__webpack_exports__default.Math.Between(0, 100) < 40) this.spawnPowerup(c, r);
			}
		});
	}
	spawnPowerup(c, r) {
		const x = c * BLOCK_SIZE + BLOCK_SIZE / 2;
		const y = r * BLOCK_SIZE + BLOCK_SIZE / 2;
		const sprite = this.powerups.create(x, y, "powerup");
		sprite.body.setSize(BLOCK_SIZE - 12, BLOCK_SIZE - 12);
		const op = __webpack_exports__default.Math.RND.pick([
			"+",
			"-",
			"*"
		]);
		let n1, n2, ans;
		if (op === "+") {
			n1 = __webpack_exports__default.Math.Between(1, 10);
			n2 = __webpack_exports__default.Math.Between(1, 10);
			ans = n1 + n2;
		} else if (op === "-") {
			n1 = __webpack_exports__default.Math.Between(5, 15);
			n2 = __webpack_exports__default.Math.Between(1, n1 - 1);
			ans = n1 - n2;
		} else {
			n1 = __webpack_exports__default.Math.Between(2, 6);
			n2 = __webpack_exports__default.Math.Between(2, 5);
			ans = n1 * n2;
		}
		const str = `${n1} ${op} ${n2} = ?`;
		const text = this.add.text(x, y - 10, str, {
			fontSize: "14px",
			fill: "#ffffff",
			fontStyle: "bold",
			stroke: "#000",
			strokeThickness: 3
		}).setOrigin(.5);
		this.tweens.add({
			targets: sprite,
			y: y - 5,
			yoyo: true,
			repeat: -1,
			duration: 800,
			ease: "Sine.easeInOut"
		});
		this.tweens.add({
			targets: text,
			y: y - 15,
			yoyo: true,
			repeat: -1,
			duration: 800,
			ease: "Sine.easeInOut"
		});
		this.activePowerups.push({
			sprite,
			text,
			answer: ans,
			str,
			active: true
		});
	}
	hitPlayer(player, explosion) {
		if (!explosion.body.enable) return;
		this.endGame(false);
	}
	hitEnemy(enemy, explosion) {
		if (!explosion.body.enable) return;
		this.endGame(true);
		enemy.destroy();
	}
	endGame(win) {
		if (this.gameOver) return;
		this.gameOver = true;
		this.physics.pause();
		const msg = win ? "GEWONNEN!" : "GAME OVER";
		const color = win ? "#00ff00" : "#ff0000";
		this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0, .7);
		this.add.text(WIDTH / 2, HEIGHT / 2, msg, {
			fontSize: "64px",
			fill: color,
			fontStyle: "bold"
		}).setOrigin(.5);
		this.add.text(WIDTH / 2, HEIGHT / 2 + 60, "Klicke zum Neustarten", {
			fontSize: "24px",
			fill: "#ffffff"
		}).setOrigin(.5);
		this.input.once("pointerdown", () => {
			this.scene.restart();
		});
	}
};
function FaskaBombermanSwarm({ onExit }) {
	const [quizData, setQuizData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const handleQuizOpen = (e) => setQuizData(e.detail);
		const handleQuizClose = () => setQuizData(null);
		window.addEventListener("BOMBERMAN_QUIZ_OPEN", handleQuizOpen);
		window.addEventListener("BOMBERMAN_QUIZ_CLOSE", handleQuizClose);
		return () => {
			window.removeEventListener("BOMBERMAN_QUIZ_OPEN", handleQuizOpen);
			window.removeEventListener("BOMBERMAN_QUIZ_CLOSE", handleQuizClose);
		};
	}, []);
	const config = {
		type: __webpack_exports__default.AUTO,
		width: WIDTH,
		height: HEIGHT,
		backgroundColor: "#222",
		physics: {
			default: "arcade",
			arcade: {
				gravity: { y: 0 },
				debug: false
			}
		},
		scene: [BootScene, MainScene]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: WIDTH,
			height: HEIGHT,
			margin: "0 auto",
			backgroundColor: "#222",
			borderRadius: "8px",
			overflow: "hidden",
			boxShadow: "0 0 30px rgba(0,0,0,0.8)"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhaserWrapper, {
				config,
				sceneClass: null
			}),
			quizData && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					inset: 0,
					zIndex: 500,
					backgroundColor: "rgba(0,0,0,0.85)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backdropFilter: "blur(3px)"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						backgroundColor: "#0f172a",
						border: "2px solid #f59e0b",
						padding: "2rem",
						borderRadius: "12px",
						boxShadow: "0 0 30px rgba(245,158,11,0.4)",
						textAlign: "center",
						width: "100%",
						maxWidth: "24rem"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							style: {
								fontSize: "1.5rem",
								fontWeight: "bold",
								color: "#fcd34d",
								marginBottom: "1rem"
							},
							children: "Math Power-Up!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								fontSize: "2rem",
								color: "#ffffff",
								marginBottom: "2rem",
								letterSpacing: "2px"
							},
							children: quizData.q
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: (e) => {
								e.preventDefault();
								const success = parseInt(e.target.elements.answer.value, 10) === quizData.a;
								window.dispatchEvent(new CustomEvent("BOMBERMAN_QUIZ_CLOSE", { detail: { success } }));
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "answer",
								type: "number",
								autoFocus: true,
								autoComplete: "off",
								style: {
									width: "100%",
									backgroundColor: "#1e293b",
									border: "1px solid #f59e0b",
									borderRadius: "4px",
									padding: "0.75rem",
									color: "#ffffff",
									fontSize: "1.5rem",
									outline: "none",
									marginBottom: "1rem",
									textAlign: "center"
								},
								placeholder: "Type answer..."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								style: {
									width: "100%",
									backgroundColor: "#d97706",
									color: "#ffffff",
									fontWeight: "bold",
									padding: "0.75rem",
									borderRadius: "4px",
									cursor: "pointer",
									transition: "background-color 0.2s",
									border: "none",
									fontSize: "1.125rem"
								},
								children: "Unlock"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					top: 10,
					right: 10,
					zIndex: 1e3,
					padding: "8px 16px",
					fontSize: "14px",
					fontWeight: "bold",
					fontFamily: "monospace",
					backgroundColor: "#ff4444",
					color: "white",
					border: "none",
					borderRadius: "4px",
					cursor: "pointer",
					boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
					textTransform: "uppercase"
				},
				children: "✖ Beenden"
			})
		]
	});
}
//#endregion
export { FaskaBombermanSwarm as default };
