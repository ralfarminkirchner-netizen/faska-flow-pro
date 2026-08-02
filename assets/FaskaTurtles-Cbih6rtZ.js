import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaTurtles/FaskaTurtles.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function FaskaTurtles({ onExit }) {
	const gameContainer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		class TurtlesScene extends __webpack_exports__default.Scene {
			constructor() {
				super({ key: "TurtlesScene" });
				this.score = 0;
				this.playerHp = 100;
				this.correctAnswer = 0;
			}
			preload() {}
			create() {
				this.physics.world.setBounds(0, 200, 800, 400);
				this.createBackground();
				this.generateTextures();
				this.allies = this.add.group();
				this.enemies = this.add.group();
				this.player = this.createEntity(400, 400, "turtle_0x0000ff", false, null, true);
				this.player.hp = 100;
				this.allies.add(this.player);
				this.allies.add(this.createEntity(300, 350, "turtle_0xff0000", false));
				this.allies.add(this.createEntity(500, 450, "turtle_0xff8800", false));
				this.allies.add(this.createEntity(350, 450, "turtle_0x800080", false));
				this.createUI();
				this.cursors = this.input.keyboard.createCursorKeys();
				this.keys = this.input.keyboard.addKeys("W,A,S,D,SPACE");
				this.generateMathProblem();
			}
			createBackground() {
				this.add.rectangle(400, 100, 800, 200, 1710628);
				this.add.circle(400, 150, 40, 8704);
				this.add.rectangle(400, 180, 20, 60, 65280).setAlpha(.5);
				this.add.rectangle(400, 400, 800, 400, 2899536);
				const g = this.add.graphics();
				g.lineStyle(2, 2042936);
				for (let i = 0; i <= 800; i += 50) {
					g.moveTo(i, 200);
					g.lineTo(i, 600);
				}
				g.moveTo(0, 200);
				g.lineTo(800, 200);
			}
			generateTextures() {
				const makeChar = (key, bodyColor, maskColor) => {
					const g = this.add.graphics();
					g.fillStyle(bodyColor);
					g.fillRect(0, 0, 30, 40);
					g.fillStyle(maskColor);
					g.fillRect(0, 10, 30, 8);
					g.fillStyle(16777215);
					g.fillRect(18, 12, 4, 4);
					g.fillRect(24, 12, 4, 4);
					g.fillStyle(0);
					g.fillRect(20, 13, 2, 2);
					g.fillRect(26, 13, 2, 2);
					g.generateTexture(key, 30, 40);
					g.destroy();
				};
				makeChar("turtle_0x0000ff", 2263074, 255);
				makeChar("turtle_0xff0000", 2263074, 16711680);
				makeChar("turtle_0xff8800", 2263074, 16746496);
				makeChar("turtle_0x800080", 2263074, 8388736);
				makeChar("enemy", 5592422, 8912896);
				const g2 = this.add.graphics();
				g2.fillStyle(0, .4);
				g2.fillEllipse(15, 5, 30, 10);
				g2.generateTexture("shadow", 30, 10);
				g2.destroy();
				const g3 = this.add.graphics();
				g3.fillStyle(16777215);
				g3.fillRect(0, 0, 4, 4);
				g3.generateTexture("particle", 4, 4);
				g3.destroy();
			}
			createUI() {
				this.add.rectangle(400, 25, 800, 50, 0, .8).setDepth(1e4);
				this.problemText = this.add.text(400, 25, "Solve: ?", {
					fontSize: "24px",
					fill: "#fff",
					fontStyle: "bold"
				}).setOrigin(.5).setDepth(10001);
				this.scoreText = this.add.text(20, 10, "Score: 0", {
					fontSize: "20px",
					fill: "#0f0",
					fontStyle: "bold"
				}).setDepth(10001);
				this.add.text(20, 35, "HP:", {
					fontSize: "16px",
					fill: "#f00",
					fontStyle: "bold"
				}).setDepth(10001);
				this.hpBar = this.add.rectangle(60, 42, 100, 10, 16711680).setOrigin(0, .5).setDepth(10001);
			}
			createEntity(x, y, tex, isEnemy, number = null, isPlayer = false) {
				const container = this.add.container(x, y);
				container.setSize(30, 40);
				this.physics.world.enable(container);
				container.body.setCollideWorldBounds(true);
				container.body.setDrag(800, 800);
				const shadow = this.add.sprite(0, 0, "shadow").setOrigin(.5, .5);
				const sprite = this.add.sprite(0, -20, tex).setOrigin(.5, .5);
				container.add(shadow);
				container.add(sprite);
				container.sprite = sprite;
				container.shadow = shadow;
				container.zPos = 0;
				container.zVel = 0;
				container.isEnemy = isEnemy;
				container.isPlayer = isPlayer;
				container.facing = 1;
				container.cooldown = 0;
				container.hp = 30;
				container.stunTimer = 0;
				if (number !== null) {
					const txt = this.add.text(0, -60, number.toString(), {
						fontSize: "20px",
						color: "#fff",
						fontStyle: "bold",
						backgroundColor: "#000",
						padding: {
							x: 4,
							y: 2
						}
					}).setOrigin(.5);
					container.add(txt);
					container.number = number;
					container.txt = txt;
				}
				return container;
			}
			generateMathProblem() {
				this.enemies.getChildren().slice().forEach((e) => this.killEntity(e, false));
				const op = [
					"+",
					"*",
					"-"
				][__webpack_exports__default.Math.Between(0, 2)];
				let num1, num2, ans;
				if (op === "+") {
					num1 = __webpack_exports__default.Math.Between(1, 20);
					num2 = __webpack_exports__default.Math.Between(1, 20);
					ans = num1 + num2;
				} else if (op === "*") {
					num1 = __webpack_exports__default.Math.Between(2, 9);
					num2 = __webpack_exports__default.Math.Between(2, 9);
					ans = num1 * num2;
				} else {
					num1 = __webpack_exports__default.Math.Between(10, 30);
					num2 = __webpack_exports__default.Math.Between(1, num1);
					ans = num1 - num2;
				}
				this.correctAnswer = ans;
				this.problemText.setText(`Solve: ${num1} ${op} ${num2} = ?`);
				const answers = [ans];
				while (answers.length < 4) {
					const wrong = ans + __webpack_exports__default.Math.Between(-10, 10);
					if (!answers.includes(wrong) && wrong >= 0) answers.push(wrong);
				}
				__webpack_exports__default.Utils.Array.Shuffle(answers);
				answers.forEach((val) => {
					const x = __webpack_exports__default.Math.Between(100, 700);
					const y = __webpack_exports__default.Math.Between(250, 550);
					const enemy = this.createEntity(x, y, "enemy", true, val);
					this.enemies.add(enemy);
					enemy.zPos = 200;
					enemy.zVel = -5;
				});
			}
			update() {
				if (this.playerHp <= 0) return;
				this.handlePlayerInput();
				this.allies.getChildren().concat(this.enemies.getChildren()).forEach((entity) => {
					if (entity.isDead) return;
					entity.depth = entity.y;
					if (entity.zPos > 0 || entity.zVel !== 0) {
						entity.zPos += entity.zVel;
						entity.zVel -= 1;
						if (entity.zPos <= 0) {
							entity.zPos = 0;
							entity.zVel = 0;
						}
					}
					entity.sprite.y = -20 - entity.zPos;
					if (entity.txt) entity.txt.y = -60 - entity.zPos;
					if (entity.stunTimer > 0) {
						entity.stunTimer--;
						return;
					}
					if (!entity.isPlayer) this.updateAI(entity);
				});
			}
			handlePlayerInput() {
				if (this.player.stunTimer > 0) return;
				let vx = 0, vy = 0;
				const speed = 160;
				if (this.cursors.left.isDown || this.keys.A.isDown) vx = -speed;
				if (this.cursors.right.isDown || this.keys.D.isDown) vx = speed;
				if (this.cursors.up.isDown || this.keys.W.isDown) vy = -speed;
				if (this.cursors.down.isDown || this.keys.S.isDown) vy = speed;
				this.player.body.setVelocity(vx, vy);
				if (vx !== 0) {
					this.player.facing = Math.sign(vx);
					this.player.sprite.setFlipX(this.player.facing < 0);
				}
				if ((__webpack_exports__default.Input.Keyboard.JustDown(this.cursors.up) || __webpack_exports__default.Input.Keyboard.JustDown(this.keys.W)) && this.player.zPos === 0) {}
				if (__webpack_exports__default.Input.Keyboard.JustDown(this.keys.SPACE)) {
					if ((vx !== 0 || vy !== 0) && this.player.zPos === 0) this.player.zVel = 12;
					this.attack(this.player);
				}
			}
			updateAI(ai) {
				ai.cooldown--;
				const targets = ai.isEnemy ? this.allies.getChildren() : this.enemies.getChildren();
				if (targets.length === 0) {
					ai.body.setVelocity(0, 0);
					return;
				}
				let closest = null;
				let minDist = Infinity;
				targets.forEach((t) => {
					const d = __webpack_exports__default.Math.Distance.Between(ai.x, ai.y, t.x, t.y);
					if (d < minDist) {
						minDist = d;
						closest = t;
					}
				});
				if (closest) {
					const dx = closest.x - ai.x;
					const dy = closest.y - ai.y;
					if (minDist > 50) {
						const angle = Math.atan2(dy, dx);
						const speed = ai.isEnemy ? 60 : 90;
						ai.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
						ai.facing = Math.sign(dx) || 1;
						ai.sprite.setFlipX(ai.facing < 0);
					} else {
						ai.body.setVelocity(0, 0);
						ai.facing = Math.sign(dx) || 1;
						ai.sprite.setFlipX(ai.facing < 0);
						if (ai.cooldown <= 0 && ai.zPos === 0) {
							if (Math.random() > .5) ai.zVel = 8;
							this.attack(ai);
							ai.cooldown = ai.isEnemy ? 100 : 60;
						}
					}
				}
			}
			attack(attacker) {
				if (attacker.isPlayer && attacker.cooldown > 0) return;
				if (attacker.isPlayer) attacker.cooldown = 20;
				const arc = this.add.graphics();
				arc.lineStyle(4, 16777215, 1);
				arc.beginPath();
				arc.arc(0, 0, 30, __webpack_exports__default.Math.DegToRad(-45), __webpack_exports__default.Math.DegToRad(45), false);
				arc.strokePath();
				const swingSprite = this.add.container(attacker.x, attacker.y - 20 - attacker.zPos);
				swingSprite.add(arc);
				swingSprite.rotation = attacker.facing === 1 ? 0 : Math.PI;
				swingSprite.depth = attacker.depth + 1;
				this.tweens.add({
					targets: swingSprite,
					alpha: 0,
					scaleX: 1.5,
					scaleY: 1.5,
					duration: 150,
					onComplete: () => swingSprite.destroy()
				});
				(attacker.isEnemy ? this.allies.getChildren() : this.enemies.getChildren()).forEach((t) => {
					if (t.isDead) return;
					const dx = t.x - attacker.x;
					const dy = t.y - attacker.y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					const zDiff = Math.abs(t.zPos - attacker.zPos);
					if (dist < 60 && zDiff < 30 && Math.sign(dx) === attacker.facing) this.handleHit(attacker, t);
				});
			}
			handleHit(attacker, target) {
				if (attacker.isPlayer) if (target.number === this.correctAnswer) {
					this.cameras.main.shake(150, .02);
					this.createExplosion(target.x, target.y - 20 - target.zPos);
					this.showPopup("COWABUNGA!", target.x, target.y - 50, "#00ff00");
					let pts = 10;
					if (attacker.zPos > 0) {
						this.showPopup("JUMP ATTACK!", target.x, target.y - 70, "#ffff00");
						pts += 5;
					}
					this.score += pts;
					this.scoreText.setText("Score: " + this.score);
					this.killEntity(target, true);
					this.generateMathProblem();
				} else {
					this.cameras.main.shake(100, .01);
					this.showPopup("WRONG!", target.x, target.y - 50, "#ff0000");
					this.knockback(attacker, -attacker.facing, 300);
					this.takeDamage(attacker, 10);
				}
				else if (!attacker.isEnemy && target.isEnemy) if (target.number === this.correctAnswer) {
					this.showPopup("Good Job!", target.x, target.y - 50, "#00ff00");
					this.createExplosion(target.x, target.y - 20 - target.zPos);
					this.score += 5;
					this.scoreText.setText("Score: " + this.score);
					this.killEntity(target, true);
					this.generateMathProblem();
				} else this.knockback(attacker, -attacker.facing, 200);
				else if (attacker.isEnemy && !target.isEnemy) {
					this.showPopup("OUCH!", target.x, target.y - 40, "#ff0000");
					this.knockback(target, attacker.facing, 200);
					this.takeDamage(target, 5);
				}
			}
			takeDamage(entity, amount) {
				entity.sprite.setTint(16711680);
				this.time.delayedCall(200, () => {
					if (!entity.isDead) entity.sprite.clearTint();
				});
				if (entity.isPlayer) {
					this.playerHp -= amount;
					if (this.playerHp < 0) this.playerHp = 0;
					this.hpBar.width = this.playerHp;
					if (this.playerHp === 0) {
						this.problemText.setText("GAME OVER");
						this.problemText.setColor("#ff0000");
						this.player.isDead = true;
						this.player.sprite.setAngle(90);
						this.physics.pause();
					}
				}
			}
			knockback(entity, dirX, power) {
				entity.body.setVelocity(dirX * power, 0);
				entity.stunTimer = 15;
			}
			killEntity(entity, juice) {
				entity.isDead = true;
				entity.body.enable = false;
				if (juice) {
					this.tweens.add({
						targets: entity.sprite,
						y: entity.sprite.y - 100,
						angle: 360,
						alpha: 0,
						duration: 500,
						onComplete: () => entity.destroy()
					});
					if (entity.txt) this.tweens.add({
						targets: entity.txt,
						y: entity.txt.y - 100,
						alpha: 0,
						duration: 500
					});
				} else entity.destroy();
			}
			createExplosion(x, y) {
				const particles = this.add.particles(x, y, "particle", {
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
					lifespan: 400,
					tint: [
						16755200,
						16711680,
						16776960
					],
					quantity: 20
				});
				this.time.delayedCall(500, () => particles.destroy());
			}
			showPopup(text, x, y, color) {
				const txt = this.add.text(x, y, text, {
					fontSize: "20px",
					fill: color,
					fontStyle: "bold",
					stroke: "#000",
					strokeThickness: 4
				}).setOrigin(.5).setDepth(10005);
				this.tweens.add({
					targets: txt,
					y: y - 40,
					alpha: 0,
					duration: 800,
					onComplete: () => txt.destroy()
				});
			}
		}
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 800,
			height: 600,
			parent: gameContainer.current,
			physics: {
				default: "arcade",
				arcade: {
					debug: false,
					gravity: { y: 0 }
				}
			},
			scene: TurtlesScene
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
			border: "4px solid #1a1a1a",
			borderRadius: "8px",
			overflow: "hidden",
			backgroundColor: "#000"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: gameContainer,
				style: {
					width: "100%",
					height: "100%"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					top: "15px",
					right: "15px",
					padding: "10px 20px",
					backgroundColor: "#e74c3c",
					color: "white",
					border: "2px solid #fff",
					borderRadius: "8px",
					fontSize: "16px",
					fontWeight: "bold",
					cursor: "pointer",
					boxShadow: "0 4px 6px rgba(0,0,0,0.5)",
					zIndex: 20,
					textTransform: "uppercase"
				},
				children: "Beenden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					bottom: "10px",
					left: "10px",
					color: "rgba(255,255,255,0.7)",
					fontSize: "12px",
					fontFamily: "sans-serif",
					zIndex: 20,
					pointerEvents: "none"
				},
				children: "CONTROLS: WASD to Move, SPACE to Attack. Hit the enemy with the correct math answer!"
			})
		]
	});
}
//#endregion
export { FaskaTurtles as default };
