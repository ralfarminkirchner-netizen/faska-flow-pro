import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaZelda/FaskaZelda.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FaskaZelda = ({ onExit }) => {
	const gameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		class MainScene extends __webpack_exports__default.Scene {
			constructor() {
				super({ key: "MainScene" });
			}
			preload() {
				const gfx = this.make.graphics({
					x: 0,
					y: 0,
					add: false
				});
				gfx.fillStyle(16777215);
				gfx.fillCircle(8, 8, 8);
				gfx.generateTexture("particle", 16, 16);
				gfx.clear();
				gfx.lineStyle(1, 2236979, 1);
				gfx.strokeRect(0, 0, 40, 40);
				gfx.generateTexture("grid", 40, 40);
				gfx.destroy();
			}
			create() {
				this.cameras.main.setBackgroundColor("#11111a");
				this.add.tileSprite(400, 300, 800, 600, "grid").setAlpha(.5);
				this.walls = this.physics.add.staticGroup();
				this.keys = this.physics.add.group();
				this.enemies = this.physics.add.group();
				this.doorGroup = this.physics.add.staticGroup();
				this.buildRoom();
				this.player = this.add.rectangle(400, 500, 24, 24, 65484);
				this.physics.add.existing(this.player);
				this.player.body.setCollideWorldBounds(true);
				this.player.body.setSize(20, 20);
				this.trail = this.add.particles(0, 0, "particle", {
					speed: 0,
					scale: {
						start: .6,
						end: 0
					},
					alpha: {
						start: .3,
						end: 0
					},
					lifespan: 400,
					blendMode: "ADD",
					tint: 65484,
					frequency: 50
				});
				this.trail.startFollow(this.player);
				this.uiText = this.add.text(400, 70, "", {
					fontSize: "36px",
					fill: "#fff",
					fontStyle: "bold",
					stroke: "#000",
					strokeThickness: 4,
					shadow: {
						offsetX: 2,
						offsetY: 2,
						color: "#00ccff",
						blur: 10,
						fill: true
					}
				}).setOrigin(.5);
				this.cursors = this.input.keyboard.createCursorKeys();
				this.wasd = this.input.keyboard.addKeys({
					up: __webpack_exports__default.Input.Keyboard.KeyCodes.W,
					down: __webpack_exports__default.Input.Keyboard.KeyCodes.S,
					left: __webpack_exports__default.Input.Keyboard.KeyCodes.A,
					right: __webpack_exports__default.Input.Keyboard.KeyCodes.D
				});
				this.physics.add.collider(this.player, this.walls);
				this.physics.add.collider(this.enemies, this.walls);
				this.physics.add.collider(this.player, this.doorGroup, this.hitDoor, null, this);
				this.physics.add.overlap(this.player, this.keys, this.hitKey, null, this);
				this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
				this.generateLevel();
			}
			buildRoom() {
				this.walls.clear(true, true);
				this.doorGroup.clear(true, true);
				const wallColor = 2236979;
				const wallGlow = 4473958;
				const createWall = (x, y, w, h) => {
					const wall = this.add.rectangle(x, y, w, h, wallColor);
					wall.setStrokeStyle(2, wallGlow);
					this.walls.add(wall);
				};
				createWall(175, 20, 350, 40);
				createWall(625, 20, 350, 40);
				createWall(400, 580, 800, 40);
				createWall(20, 300, 40, 600);
				createWall(780, 300, 40, 600);
				this.door = this.add.rectangle(400, 20, 100, 40, 16724787);
				this.door.setStrokeStyle(4, 16711680);
				this.doorGroup.add(this.door);
				this.doorUnlocked = false;
			}
			generateLevel() {
				this.keys.clear(true, true);
				this.enemies.clear(true, true);
				this.doorUnlocked = false;
				this.door.setFillStyle(16724787);
				this.door.setStrokeStyle(4, 16711680);
				this.player.setPosition(400, 500);
				this.player.setScale(0);
				this.tweens.add({
					targets: this.player,
					scale: 1,
					duration: 500,
					ease: "Back.easeOut"
				});
				const num1 = __webpack_exports__default.Math.Between(5, 20);
				const num2 = __webpack_exports__default.Math.Between(5, 20);
				const correctAnswer = num1 + num2;
				this.uiText.setText(`${num1} + ${num2} = ?`);
				this.uiText.setTint(16777215);
				let answers = [
					correctAnswer,
					correctAnswer + __webpack_exports__default.Math.Between(1, 5),
					correctAnswer - __webpack_exports__default.Math.Between(1, 5)
				];
				answers = answers.sort(() => Math.random() - .5);
				const positions = [
					{
						x: 200,
						y: 300
					},
					{
						x: 400,
						y: 300
					},
					{
						x: 600,
						y: 300
					}
				];
				answers.forEach((ans, idx) => {
					const keyContainer = this.add.container(positions[idx].x, positions[idx].y);
					const bg = this.add.rectangle(0, 0, 50, 50, 52479);
					bg.setStrokeStyle(3, 16777215);
					const txt = this.add.text(0, 0, ans.toString(), {
						fontSize: "28px",
						fill: "#fff",
						fontStyle: "bold",
						stroke: "#000",
						strokeThickness: 3
					}).setOrigin(.5);
					keyContainer.add([bg, txt]);
					keyContainer.setSize(50, 50);
					this.physics.add.existing(keyContainer);
					keyContainer.body.setImmovable(true);
					keyContainer.answer = ans;
					keyContainer.isCorrect = ans === correctAnswer;
					this.tweens.add({
						targets: [bg, txt],
						y: "-=10",
						yoyo: true,
						repeat: -1,
						duration: 800 + Math.random() * 400,
						ease: "Sine.easeInOut"
					});
					this.tweens.add({
						targets: bg,
						angle: 360,
						repeat: -1,
						duration: 4e3,
						ease: "Linear"
					});
					this.keys.add(keyContainer);
				});
			}
			hitKey(player, keyContainer) {
				if (keyContainer.isCorrect) {
					this.cameras.main.shake(200, .01);
					this.spawnParticles(keyContainer.x, keyContainer.y, 65280, 40);
					this.uiText.setText("Tür geöffnet!");
					this.uiText.setTint(65280);
					this.doorUnlocked = true;
					this.door.setFillStyle(65484);
					this.door.setStrokeStyle(4, 65280);
					this.keys.getChildren().forEach((key) => {
						this.tweens.add({
							targets: key,
							scale: 0,
							alpha: 0,
							duration: 300,
							onComplete: () => key.destroy()
						});
					});
				} else {
					this.cameras.main.shake(300, .02);
					this.spawnParticles(keyContainer.x, keyContainer.y, 16711680, 30);
					this.spawnEnemy(keyContainer.x, keyContainer.y);
					keyContainer.destroy();
				}
			}
			hitDoor(player, door) {
				if (this.doorUnlocked) {
					this.cameras.main.flash(500, 255, 255, 255);
					this.generateLevel();
				}
			}
			spawnEnemy(x, y) {
				const enemy = this.add.rectangle(x, y, 24, 24, 16711935);
				enemy.setStrokeStyle(2, 16777215);
				this.physics.add.existing(enemy);
				enemy.body.setCollideWorldBounds(true);
				enemy.body.setBounce(1, 1);
				const enemyTrail = this.add.particles(0, 0, "particle", {
					speed: 0,
					scale: {
						start: .5,
						end: 0
					},
					alpha: {
						start: .5,
						end: 0
					},
					lifespan: 300,
					blendMode: "ADD",
					tint: 16711935
				});
				enemyTrail.startFollow(enemy);
				enemy.trail = enemyTrail;
				this.tweens.add({
					targets: enemy,
					angle: 360,
					repeat: -1,
					duration: 1e3,
					ease: "Linear"
				});
				this.enemies.add(enemy);
			}
			hitEnemy(player, enemy) {
				if (player.isInvulnerable) return;
				this.cameras.main.shake(200, .03);
				player.isInvulnerable = true;
				player.fillColor = 16711680;
				this.tweens.add({
					targets: player,
					alpha: .2,
					yoyo: true,
					repeat: 5,
					duration: 100,
					onComplete: () => {
						player.alpha = 1;
						player.fillColor = 65484;
						player.isInvulnerable = false;
					}
				});
				const angle = __webpack_exports__default.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
				player.body.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500);
				player.isStunned = true;
				this.time.delayedCall(300, () => {
					player.isStunned = false;
				});
				this.spawnParticles(enemy.x, enemy.y, 16711935, 20);
				if (enemy.trail) enemy.trail.destroy();
				enemy.destroy();
			}
			spawnParticles(x, y, color, count) {
				this.add.particles(x, y, "particle", {
					speed: {
						min: 100,
						max: 300
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
					lifespan: 800,
					tint: color
				}).explode(count);
			}
			update() {
				if (this.player.isStunned) return;
				const speed = 250;
				this.player.body.setVelocity(0);
				let velocityX = 0;
				let velocityY = 0;
				if (this.cursors.left.isDown || this.wasd.left.isDown) velocityX = -speed;
				else if (this.cursors.right.isDown || this.wasd.right.isDown) velocityX = speed;
				if (this.cursors.up.isDown || this.wasd.up.isDown) velocityY = -speed;
				else if (this.cursors.down.isDown || this.wasd.down.isDown) velocityY = speed;
				if (velocityX !== 0 && velocityY !== 0) {
					velocityX *= .7071;
					velocityY *= .7071;
				}
				this.player.body.setVelocity(velocityX, velocityY);
				this.enemies.getChildren().forEach((enemy) => {
					this.physics.moveToObject(enemy, this.player, 120);
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
			width: "800px",
			height: "600px",
			margin: "0 auto",
			boxShadow: "0 0 20px rgba(0,0,0,0.5)",
			borderRadius: "8px",
			overflow: "hidden"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: gameRef }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "15px",
				right: "15px",
				padding: "10px 20px",
				fontSize: "18px",
				fontWeight: "bold",
				backgroundColor: "#ff4444",
				color: "white",
				border: "2px solid #fff",
				borderRadius: "8px",
				cursor: "pointer",
				zIndex: 10,
				boxShadow: "0 4px 6px rgba(0,0,0,0.4)",
				textTransform: "uppercase"
			},
			onMouseOver: (e) => e.target.style.backgroundColor = "#ff6666",
			onMouseOut: (e) => e.target.style.backgroundColor = "#ff4444",
			children: "Beenden"
		})]
	});
};
//#endregion
export { FaskaZelda as default };
