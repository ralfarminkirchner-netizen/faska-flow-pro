import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaDigDug/FaskaDigDug.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function FaskaDigDug({ onExit }) {
	const gameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		class MainScene extends __webpack_exports__default.Scene {
			constructor() {
				super("MainScene");
			}
			create() {
				this.score = 0;
				this.lives = 3;
				this.generateTextures();
				this.cameras.main.setBackgroundColor("#2E1A0F");
				this.dirtGroup = this.physics.add.staticGroup();
				this.enemies = this.physics.add.group();
				for (let y = 3; y < 15; y++) for (let x = 0; x < 20; x++) {
					if (x === 10 && y < 8) continue;
					this.dirtGroup.create(x * 40 + 20, y * 40 + 20, "dirt");
				}
				this.player = this.physics.add.sprite(420, 100, "player_down");
				this.player.setCollideWorldBounds(true);
				this.player.body.setSize(24, 24);
				this.facing = "down";
				this.spawnEnemies();
				this.cursors = this.input.keyboard.createCursorKeys();
				this.spaceKey = this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.SPACE);
				this.uiText = this.add.text(10, 10, "Besiege alle Säugetiere! (Nur Säugetiere aufpumpen)", {
					fontSize: "20px",
					fill: "#FFF",
					fontStyle: "bold",
					stroke: "#000",
					strokeThickness: 3
				});
				this.scoreText = this.add.text(10, 40, "Punkte: 0", {
					fontSize: "18px",
					fill: "#FFF",
					stroke: "#000",
					strokeThickness: 2
				});
				this.healthText = this.add.text(150, 40, "Leben: 3", {
					fontSize: "18px",
					fill: "#FFF",
					stroke: "#000",
					strokeThickness: 2
				});
				this.pumpGraphics = this.add.graphics();
				this.pumpingEnemy = null;
				this.physics.add.collider(this.enemies, this.dirtGroup);
				this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, null, this);
			}
			generateTextures() {
				const g = this.make.graphics({
					x: 0,
					y: 0,
					add: false
				});
				g.fillStyle(9127187, 1);
				g.fillRect(0, 0, 40, 40);
				g.lineStyle(1, 6044193, 1);
				g.strokeRect(0, 0, 40, 40);
				g.fillStyle(6044193, 1);
				g.fillRect(8, 8, 4, 4);
				g.fillRect(28, 12, 4, 4);
				g.fillRect(16, 28, 4, 4);
				g.generateTexture("dirt", 40, 40);
				g.clear();
				g.fillStyle(16766720, 1);
				g.fillRect(0, 0, 32, 32);
				g.generateTexture("player_up", 32, 32);
				g.clear();
				g.fillStyle(16766720, 1);
				g.fillRect(0, 0, 32, 32);
				g.fillStyle(3355443, 1);
				g.fillRect(6, 6, 6, 6);
				g.fillRect(20, 6, 6, 6);
				g.generateTexture("player_down", 32, 32);
				g.clear();
				g.fillStyle(16766720, 1);
				g.fillRect(0, 0, 32, 32);
				g.fillStyle(3355443, 1);
				g.fillRect(6, 6, 6, 6);
				g.fillRect(6, 20, 6, 6);
				g.generateTexture("player_left", 32, 32);
				g.clear();
				g.fillStyle(16766720, 1);
				g.fillRect(0, 0, 32, 32);
				g.fillStyle(3355443, 1);
				g.fillRect(20, 6, 6, 6);
				g.fillRect(20, 20, 6, 6);
				g.generateTexture("player_right", 32, 32);
				g.clear();
				g.fillStyle(16729156, 1);
				g.fillCircle(16, 16, 16);
				g.fillStyle(16777215, 1);
				g.fillCircle(10, 12, 4);
				g.fillCircle(22, 12, 4);
				g.generateTexture("enemy", 32, 32);
			}
			spawnEnemies() {
				const animals = [
					{
						name: "Hund",
						mammal: true
					},
					{
						name: "Katze",
						mammal: true
					},
					{
						name: "Wal",
						mammal: true
					},
					{
						name: "Bär",
						mammal: true
					},
					{
						name: "Hai",
						mammal: false
					},
					{
						name: "Adler",
						mammal: false
					},
					{
						name: "Frosch",
						mammal: false
					},
					{
						name: "Spinne",
						mammal: false
					}
				];
				[
					{
						x: 3,
						y: 12
					},
					{
						x: 16,
						y: 11
					},
					{
						x: 7,
						y: 13
					},
					{
						x: 14,
						y: 6
					}
				].forEach((p) => {
					this.dirtGroup.getChildren().forEach((d) => {
						if (Math.abs(d.x - (p.x * 40 + 20)) <= 40 && Math.abs(d.y - (p.y * 40 + 20)) <= 40) d.destroy();
					});
					let animal = __webpack_exports__default.Math.RND.pick(animals);
					let e = this.enemies.create(p.x * 40 + 20, p.y * 40 + 20, "enemy");
					e.setTint(animal.mammal ? 16759739 : 12320699);
					e.animalData = animal;
					e.textObj = this.add.text(e.x, e.y - 22, animal.name, {
						fontSize: "14px",
						fill: "#FFF",
						stroke: "#000",
						strokeThickness: 3
					}).setOrigin(.5);
					e.inflation = 0;
					e.setCollideWorldBounds(true);
					e.setBounce(1);
					e.body.setSize(24, 24);
					this.pickRandomDirection(e);
				});
			}
			pickRandomDirection(enemy) {
				if (enemy.inflation > 0) return;
				const speed = 60;
				let dir = __webpack_exports__default.Math.RND.pick([
					{
						x: 0,
						y: -1
					},
					{
						x: 0,
						y: 1
					},
					{
						x: -1,
						y: 0
					},
					{
						x: 1,
						y: 0
					}
				]);
				enemy.setVelocity(dir.x * speed, dir.y * speed);
			}
			update(time, delta) {
				if (this.lives <= 0) return;
				this.handlePlayerMovement(time);
				if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) this.physics.overlap(this.player, this.dirtGroup, (player, dirt) => {
					this.createParticles(dirt.x, dirt.y, 9127187, 5);
					dirt.destroy();
				});
				this.enemies.getChildren().forEach((e) => {
					e.textObj.setPosition(e.x, e.y - 22 - e.inflation * 5);
					if (e !== this.pumpingEnemy && e.inflation > 0) {
						if (time > e.lastPumpTime + 1e3) {
							e.inflation = 0;
							e.setScale(1);
							this.pickRandomDirection(e);
						}
					}
				});
			}
			handlePlayerMovement(time) {
				if (this.pumpingEnemy) {
					if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown) {
						this.breakPump();
						return;
					}
					if (__webpack_exports__default.Input.Keyboard.JustDown(this.spaceKey)) this.pumpEnemy(this.pumpingEnemy, time);
					if (this.pumpingEnemy) {
						this.pumpGraphics.clear();
						this.pumpGraphics.lineStyle(4, 14540253, 1);
						this.pumpGraphics.strokeLineShape(new __webpack_exports__default.Geom.Line(this.player.x, this.player.y, this.pumpingEnemy.x, this.pumpingEnemy.y));
						if (time > this.pumpingEnemy.lastPumpTime + 1500) this.breakPump();
					}
				} else {
					this.player.setVelocity(0);
					const speed = 120;
					if (this.cursors.left.isDown) {
						this.player.setVelocityX(-speed);
						this.facing = "left";
						this.player.setTexture("player_left");
					} else if (this.cursors.right.isDown) {
						this.player.setVelocityX(speed);
						this.facing = "right";
						this.player.setTexture("player_right");
					} else if (this.cursors.up.isDown) {
						this.player.setVelocityY(-speed);
						this.facing = "up";
						this.player.setTexture("player_up");
					} else if (this.cursors.down.isDown) {
						this.player.setVelocityY(speed);
						this.facing = "down";
						this.player.setTexture("player_down");
					}
					if (__webpack_exports__default.Input.Keyboard.JustDown(this.spaceKey)) this.shootPump(time);
				}
			}
			shootPump(time) {
				let dx = 0, dy = 0;
				if (this.facing === "left") dx = -1;
				if (this.facing === "right") dx = 1;
				if (this.facing === "up") dy = -1;
				if (this.facing === "down") dy = 1;
				const MAX_DIST = 160;
				const STEP = 5;
				let hitEnemy = null;
				let hitDist = MAX_DIST;
				for (let dist = 10; dist <= MAX_DIST; dist += STEP) {
					let px = this.player.x + dx * dist;
					let py = this.player.y + dy * dist;
					let hitDirt = false;
					let dirtKids = this.dirtGroup.getChildren();
					for (let i = 0; i < dirtKids.length; i++) {
						let d = dirtKids[i];
						if (Math.abs(d.x - px) < 20 && Math.abs(d.y - py) < 20) {
							hitDirt = true;
							break;
						}
					}
					if (hitDirt) {
						hitDist = dist;
						break;
					}
					let enemyKids = this.enemies.getChildren();
					for (let i = 0; i < enemyKids.length; i++) {
						let e = enemyKids[i];
						if (Math.abs(e.x - px) < 16 && Math.abs(e.y - py) < 16) {
							hitEnemy = e;
							hitDist = dist;
							break;
						}
					}
					if (hitEnemy) break;
				}
				let pLine = new __webpack_exports__default.Geom.Line(this.player.x, this.player.y, this.player.x + dx * hitDist, this.player.y + dy * hitDist);
				if (hitEnemy) {
					this.pumpingEnemy = hitEnemy;
					this.pumpEnemy(hitEnemy, time);
				} else {
					this.pumpGraphics.clear();
					this.pumpGraphics.lineStyle(4, 14540253, 1);
					this.pumpGraphics.strokeLineShape(pLine);
					this.time.delayedCall(150, () => {
						if (!this.pumpingEnemy) this.pumpGraphics.clear();
					});
				}
			}
			pumpEnemy(enemy, time) {
				enemy.inflation = (enemy.inflation || 0) + 1;
				enemy.lastPumpTime = time;
				enemy.setScale(1 + enemy.inflation * .3);
				enemy.setVelocity(0, 0);
				if (enemy.inflation >= 4) this.popEnemy(enemy);
			}
			breakPump() {
				this.pumpingEnemy = null;
				this.pumpGraphics.clear();
			}
			popEnemy(enemy) {
				this.createParticles(enemy.x, enemy.y, 16711680, 30);
				this.cameras.main.shake(200, .015);
				if (enemy.animalData.mammal) {
					this.score += 100;
					this.scoreText.setText("Punkte: " + this.score);
					this.showFloatingText(enemy.x, enemy.y, "+100", "#0F0");
				} else this.takeDamage("Falsch! " + enemy.animalData.name + " ist kein Säugetier!");
				enemy.textObj.destroy();
				enemy.destroy();
				this.pumpingEnemy = null;
				this.pumpGraphics.clear();
				this.checkWinCondition();
			}
			hitPlayer(player, enemy) {
				if (enemy.inflation === 0) {
					this.takeDamage("Ein Tier hat dich erwischt!");
					player.setPosition(420, 100);
				}
			}
			takeDamage(reason) {
				this.lives--;
				this.healthText.setText("Leben: " + this.lives);
				this.cameras.main.flash(200, 255, 0, 0);
				this.cameras.main.shake(300, .02);
				if (reason) {
					let info = this.add.text(400, 300, reason, {
						fontSize: "24px",
						fill: "#FFF",
						backgroundColor: "#F00",
						padding: 10
					}).setOrigin(.5);
					this.time.delayedCall(2e3, () => info.destroy());
				}
				if (this.lives <= 0) {
					this.add.text(400, 300, "Game Over!\nSpiel startet neu...", {
						fontSize: "32px",
						fill: "#FFF",
						backgroundColor: "#000",
						padding: 20,
						align: "center"
					}).setOrigin(.5);
					this.physics.pause();
					this.time.delayedCall(3e3, () => {
						this.scene.restart();
					});
				}
			}
			checkWinCondition() {
				if (this.enemies.getChildren().filter((e) => e.animalData.mammal).length === 0) {
					this.add.text(400, 300, "Gewonnen!\nAlle Säugetiere besiegt!\nNächstes Level...", {
						fontSize: "32px",
						fill: "#FFF",
						backgroundColor: "#0A0",
						padding: 20,
						align: "center"
					}).setOrigin(.5);
					this.physics.pause();
					this.time.delayedCall(3e3, () => {
						this.scene.restart();
					});
				}
			}
			showFloatingText(x, y, message, color) {
				let t = this.add.text(x, y, message, {
					fontSize: "20px",
					fill: color,
					stroke: "#000",
					strokeThickness: 3
				}).setOrigin(.5);
				this.tweens.add({
					targets: t,
					y: y - 50,
					alpha: 0,
					duration: 1500,
					ease: "Power1",
					onComplete: () => t.destroy()
				});
			}
			createParticles(x, y, color, quantity) {
				for (let i = 0; i < quantity; i++) {
					let particle = this.add.rectangle(x, y, 6, 6, color);
					let angle = __webpack_exports__default.Math.Between(0, 360) * (Math.PI / 180);
					let speed = __webpack_exports__default.Math.Between(50, 150);
					this.tweens.add({
						targets: particle,
						x: x + Math.cos(angle) * speed,
						y: y + Math.sin(angle) * speed,
						scaleX: 0,
						scaleY: 0,
						duration: 600,
						ease: "Power2",
						onComplete: () => particle.destroy()
					});
				}
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
					gravity: { y: 0 },
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
			width: 800,
			height: 600,
			margin: "0 auto"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: gameRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: 10,
				right: 10,
				padding: "8px 16px",
				fontSize: "16px",
				backgroundColor: "#ff4444",
				color: "white",
				border: "none",
				borderRadius: "4px",
				cursor: "pointer",
				zIndex: 10
			},
			children: "Beenden"
		})]
	});
}
//#endregion
export { FaskaDigDug as default };
