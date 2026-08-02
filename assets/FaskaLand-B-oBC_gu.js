import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaLand/FaskaLand.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PALETTE = {
	LIGHTEST: 10206223,
	LIGHT: 9153551,
	DARK: 3170864,
	DARKEST: 997391,
	STR_LIGHTEST: "#9bbc0f",
	STR_LIGHT: "#8bac0f",
	STR_DARK: "#306230",
	STR_DARKEST: "#0f380f"
};
function FaskaLand({ onExit }) {
	const gameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		class MainScene extends __webpack_exports__default.Scene {
			constructor() {
				super({ key: "MainScene" });
				this.score = 0;
				this.equation = {
					a: 0,
					b: 0,
					answer: 0
				};
			}
			preload() {
				const g = this.add.graphics();
				g.fillStyle(PALETTE.DARKEST);
				g.fillRect(0, 0, 24, 24);
				g.fillStyle(PALETTE.LIGHTEST);
				g.fillRect(4, 4, 6, 6);
				g.generateTexture("player", 24, 24);
				g.clear();
				g.fillStyle(PALETTE.DARK);
				g.fillRect(0, 0, 32, 32);
				g.lineStyle(2, PALETTE.DARKEST);
				g.strokeRect(0, 0, 32, 32);
				g.generateTexture("platform", 32, 32);
				g.clear();
				g.fillStyle(PALETTE.DARKEST);
				g.fillRect(0, 0, 20, 20);
				g.fillStyle(PALETTE.LIGHTEST);
				g.fillRect(4, 4, 4, 4);
				g.fillRect(12, 4, 4, 4);
				g.generateTexture("enemy", 20, 20);
				g.clear();
				g.lineStyle(2, PALETTE.DARKEST);
				g.fillStyle(PALETTE.LIGHT);
				g.fillRect(0, 0, 32, 32);
				g.strokeRect(0, 0, 32, 32);
				g.generateTexture("answerBox", 32, 32);
				g.clear();
				g.fillStyle(PALETTE.DARKEST);
				g.fillRect(0, 0, 4, 4);
				g.generateTexture("particle", 4, 4);
				g.clear();
			}
			create() {
				this.cameras.main.setBackgroundColor(PALETTE.LIGHTEST);
				this.physics.world.setBounds(0, 0, 800, 600);
				this.platforms = this.physics.add.staticGroup();
				for (let i = 0; i < 800; i += 32) this.platforms.create(i + 16, 584, "platform");
				[
					[200, 450],
					[232, 450],
					[264, 450],
					[550, 350],
					[582, 350],
					[614, 350],
					[100, 300],
					[132, 300],
					[164, 300],
					[350, 250],
					[382, 250],
					[414, 250]
				].forEach((c) => this.platforms.create(c[0], c[1], "platform"));
				this.player = this.physics.add.sprite(50, 500, "player");
				this.player.setBounce(0);
				this.player.setCollideWorldBounds(true);
				this.physics.add.collider(this.player, this.platforms);
				this.enemies = this.physics.add.group();
				this.spawnEnemy(400, 500);
				this.spawnEnemy(600, 500);
				this.spawnEnemy(400, 200);
				this.physics.add.collider(this.enemies, this.platforms);
				this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this);
				this.answerBoxes = this.physics.add.staticGroup();
				this.physics.add.overlap(this.player, this.answerBoxes, this.collectAnswer, null, this);
				this.cursors = this.input.keyboard.createCursorKeys();
				this.scoreText = this.add.text(16, 16, "Punkte: 0", {
					fontSize: "20px",
					fill: PALETTE.STR_DARKEST,
					fontFamily: "monospace"
				});
				this.equationText = this.add.text(400, 32, "", {
					fontSize: "24px",
					fill: PALETTE.STR_DARKEST,
					fontFamily: "monospace",
					fontStyle: "bold"
				}).setOrigin(.5, .5);
				this.generateEquation();
				try {
					this.particles = this.add.particles(0, 0, "particle", {
						speed: {
							min: -150,
							max: 150
						},
						angle: {
							min: 0,
							max: 360
						},
						scale: {
							start: 1,
							end: 0
						},
						blendMode: "NORMAL",
						lifespan: 600,
						gravityY: 400,
						emitting: false
					});
				} catch (e) {
					this.particles = this.add.particles("particle").createEmitter({
						speed: {
							min: -150,
							max: 150
						},
						angle: {
							min: 0,
							max: 360
						},
						scale: {
							start: 1,
							end: 0
						},
						blendMode: "NORMAL",
						lifespan: 600,
						gravityY: 400,
						on: false
					});
				}
			}
			emitParticles(x, y, count) {
				if (this.particles.emitParticleAt) this.particles.emitParticleAt(x, y, count);
				else if (this.particles.explode) this.particles.explode(count, x, y);
			}
			spawnEnemy(x, y) {
				const enemy = this.enemies.create(x, y, "enemy");
				enemy.setBounce(0);
				enemy.setVelocityX(50);
				enemy.direction = 1;
			}
			generateEquation() {
				this.equation.a = __webpack_exports__default.Math.Between(1, 9);
				this.equation.b = __webpack_exports__default.Math.Between(1, 9);
				this.equation.answer = this.equation.a + this.equation.b;
				this.equationText.setText(`${this.equation.a} + ${this.equation.b} = ?`);
				this.answerBoxes.getChildren().forEach((b) => {
					if (b.textRef) b.textRef.destroy();
				});
				this.answerBoxes.clear(true, true);
				const answers = [this.equation.answer];
				while (answers.length < 3) {
					const wrong = __webpack_exports__default.Math.Between(2, 18);
					if (!answers.includes(wrong)) answers.push(wrong);
				}
				__webpack_exports__default.Utils.Array.Shuffle(answers);
				const positions = [
					{
						x: 232,
						y: 380
					},
					{
						x: 582,
						y: 280
					},
					{
						x: 132,
						y: 230
					},
					{
						x: 382,
						y: 180
					},
					{
						x: 400,
						y: 500
					}
				];
				__webpack_exports__default.Utils.Array.Shuffle(positions);
				for (let i = 0; i < 3; i++) {
					const pos = positions[i];
					const box = this.answerBoxes.create(pos.x, pos.y, "answerBox");
					box.answerValue = answers[i];
					box.textRef = this.add.text(pos.x, pos.y, answers[i].toString(), {
						fontSize: "16px",
						fill: PALETTE.STR_DARKEST,
						fontFamily: "monospace",
						fontStyle: "bold"
					}).setOrigin(.5, .5);
				}
			}
			hitEnemy(player, enemy) {
				if (player.body.velocity.y > 0 && player.y < enemy.y - 10) {
					enemy.destroy();
					player.setVelocityY(-350);
					this.cameras.main.shake(100, .01);
					this.emitParticles(enemy.x, enemy.y, 15);
					this.time.delayedCall(1e3, () => {
						this.spawnEnemy(__webpack_exports__default.Math.Between(100, 700), 50);
					});
				} else {
					player.setTint(PALETTE.DARK);
					this.cameras.main.shake(200, .02);
					this.score = Math.max(0, this.score - 5);
					this.scoreText.setText("Punkte: " + this.score);
					player.setPosition(50, 500);
					setTimeout(() => {
						if (player && player.active) player.clearTint();
					}, 500);
				}
			}
			collectAnswer(player, box) {
				if (box.answerValue === this.equation.answer) {
					this.score += 10;
					this.scoreText.setText("Punkte: " + this.score);
					this.cameras.main.shake(150, .01);
					this.emitParticles(box.x, box.y, 40);
					const flash = this.add.rectangle(400, 300, 800, 600, PALETTE.LIGHTEST);
					this.tweens.add({
						targets: flash,
						alpha: 0,
						duration: 300,
						onComplete: () => flash.destroy()
					});
					this.generateEquation();
				} else {
					this.score = Math.max(0, this.score - 5);
					this.scoreText.setText("Punkte: " + this.score);
					this.cameras.main.shake(200, .02);
					box.setTint(PALETTE.DARKEST);
					if (box.textRef) box.textRef.destroy();
					box.destroy();
					this.emitParticles(box.x, box.y, 10);
				}
			}
			update() {
				if (!this.player.active) return;
				if (this.cursors.left.isDown) this.player.setVelocityX(-200);
				else if (this.cursors.right.isDown) this.player.setVelocityX(200);
				else this.player.setVelocityX(0);
				if (this.cursors.up.isDown && this.player.body.touching.down) this.player.setVelocityY(-450);
				this.enemies.getChildren().forEach((enemy) => {
					if (enemy.body.blocked.right) {
						enemy.direction = -1;
						enemy.setVelocityX(-50);
					} else if (enemy.body.blocked.left) {
						enemy.direction = 1;
						enemy.setVelocityX(50);
					} else enemy.setVelocityX(50 * enemy.direction);
				});
			}
		}
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 800,
			height: 600,
			parent: gameRef.current,
			physics: {
				default: "arcade",
				arcade: {
					gravity: { y: 800 },
					debug: false
				}
			},
			scene: [MainScene]
		};
		const game = new __webpack_exports__default.Game(config);
		return () => {
			game.destroy(true);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "800px",
			height: "600px",
			margin: "0 auto",
			overflow: "hidden",
			borderRadius: "8px",
			boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "16px",
				right: "16px",
				zIndex: 10,
				padding: "8px 16px",
				backgroundColor: "#0f380f",
				color: "#9bbc0f",
				border: "2px solid #306230",
				borderRadius: "4px",
				fontFamily: "monospace",
				fontSize: "16px",
				fontWeight: "bold",
				cursor: "pointer",
				boxShadow: "2px 2px 0px #306230"
			},
			onMouseOver: (e) => {
				e.target.style.backgroundColor = "#306230";
				e.target.style.color = "#9bbc0f";
			},
			onMouseOut: (e) => {
				e.target.style.backgroundColor = "#0f380f";
				e.target.style.color = "#9bbc0f";
			},
			children: "Beenden"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: gameRef,
			style: {
				width: "100%",
				height: "100%"
			}
		})]
	});
}
//#endregion
export { FaskaLand as default };
