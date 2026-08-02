import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaSpaceInvaders/FaskaSpaceInvaders.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FaskaSpaceInvaders = ({ onExit }) => {
	const gameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 800,
			height: 600,
			parent: gameRef.current,
			backgroundColor: "#000022",
			physics: {
				default: "arcade",
				arcade: {
					gravity: { y: 0 },
					debug: false
				}
			},
			scene: {
				preload,
				create,
				update
			}
		};
		const game = new __webpack_exports__default.Game(config);
		let player;
		let cursors;
		let spacebar;
		let lasers;
		let aliens;
		let stars;
		let texts = [];
		let score = 0;
		let scoreText;
		let targetNumberText;
		let targetNumber = 24;
		let alienDirection = 1;
		let alienSpeed = 50;
		let lastFired = 0;
		let explosionParticles;
		let wrongParticles;
		let thrustParticles;
		let gameOverState = false;
		function preload() {}
		function create() {
			const pg = this.add.graphics();
			pg.fillStyle(65535, 1);
			pg.fillTriangle(16, 0, 32, 32, 0, 32);
			pg.generateTexture("player", 32, 32);
			pg.destroy();
			const ag = this.add.graphics();
			ag.fillStyle(16711935, 1);
			ag.fillRect(0, 0, 32, 32);
			ag.fillStyle(16777215, 1);
			ag.fillRect(4, 4, 8, 8);
			ag.fillRect(20, 4, 8, 8);
			ag.fillStyle(0, 1);
			ag.fillRect(6, 6, 4, 4);
			ag.fillRect(22, 6, 4, 4);
			ag.fillRect(8, 22, 16, 4);
			ag.generateTexture("alien", 32, 32);
			ag.destroy();
			const lg = this.add.graphics();
			lg.fillStyle(16776960, 1);
			lg.fillRect(0, 0, 4, 16);
			lg.generateTexture("laser", 4, 16);
			lg.destroy();
			const partG = this.add.graphics();
			partG.fillStyle(16777215, 1);
			partG.fillRect(0, 0, 6, 6);
			partG.generateTexture("particle", 6, 6);
			partG.destroy();
			stars = this.physics.add.group();
			for (let i = 0; i < 100; i++) {
				let star = this.add.rectangle(__webpack_exports__default.Math.Between(0, 800), __webpack_exports__default.Math.Between(0, 600), 2, 2, 16777215);
				star.alpha = __webpack_exports__default.Math.FloatBetween(.2, .8);
				this.physics.add.existing(star);
				star.body.setVelocityY(__webpack_exports__default.Math.Between(10, 40));
				stars.add(star);
			}
			scoreText = this.add.text(16, 16, "Punkte: 0", {
				fontSize: "24px",
				fill: "#00ffff",
				fontStyle: "bold"
			});
			targetNumberText = this.add.text(16, 50, "Ziel: " + targetNumber, {
				fontSize: "28px",
				fill: "#00ff00",
				fontStyle: "bold"
			});
			this.add.text(580, 16, "Schieße Teiler!", {
				fontSize: "22px",
				fill: "#ff00ff",
				fontStyle: "bold"
			});
			player = this.physics.add.sprite(400, 550, "player");
			player.setCollideWorldBounds(true);
			thrustParticles = this.add.particles(0, 0, "particle", {
				speed: {
					min: 50,
					max: 150
				},
				angle: {
					min: 80,
					max: 100
				},
				scale: {
					start: .8,
					end: 0
				},
				alpha: {
					start: 1,
					end: 0
				},
				blendMode: "ADD",
				lifespan: 400,
				tint: 43775
			});
			thrustParticles.startFollow(player, 0, 16);
			cursors = this.input.keyboard.createCursorKeys();
			spacebar = this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.SPACE);
			lasers = this.physics.add.group();
			aliens = this.physics.add.group();
			explosionParticles = this.add.particles(0, 0, "particle", {
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
				blendMode: "ADD",
				tint: 65280,
				lifespan: 600,
				emitting: false
			});
			wrongParticles = this.add.particles(0, 0, "particle", {
				speed: {
					min: -200,
					max: 200
				},
				angle: {
					min: 0,
					max: 360
				},
				scale: {
					start: 1.5,
					end: 0
				},
				blendMode: "ADD",
				tint: 16711680,
				lifespan: 800,
				emitting: false
			});
			this.physics.add.overlap(lasers, aliens, hitAlien, null, this);
			this.physics.add.overlap(player, aliens, gameOver, null, this);
			startLevel(this);
		}
		function startLevel(scene) {
			aliens.clear(true, true);
			texts.forEach((t) => t.destroy());
			texts = [];
			targetNumber = __webpack_exports__default.Math.RND.pick([
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
			]);
			targetNumberText.setText("Ziel: " + targetNumber);
			alienDirection = 1;
			player.setX(400);
			for (let y = 0; y < 4; y++) for (let x = 0; x < 10; x++) {
				let alien = aliens.create(90 + x * 65, 80 + y * 60, "alien");
				let num = __webpack_exports__default.Math.Between(2, 10);
				alien.numberValue = num;
				let text = scene.add.text(alien.x, alien.y - 25, num.toString(), {
					fontSize: "16px",
					fill: "#ffffff",
					fontStyle: "bold",
					stroke: "#000000",
					strokeThickness: 3
				});
				text.setOrigin(.5);
				alien.alienText = text;
				texts.push(text);
			}
			aliens.setVelocityX(alienSpeed * alienDirection);
		}
		function hitAlien(laser, alien) {
			laser.destroy();
			if (targetNumber % alien.numberValue === 0) {
				score += 10;
				this.cameras.main.shake(150, .005);
				explosionParticles.explode(30, alien.x, alien.y);
				scoreText.setText("Punkte: " + score);
				scoreText.setTint(65280);
				this.time.delayedCall(300, () => scoreText.setTint(65535));
			} else {
				score -= 5;
				this.cameras.main.shake(250, .015);
				wrongParticles.explode(40, alien.x, alien.y);
				scoreText.setText("Punkte: " + score);
				scoreText.setTint(16711680);
				this.time.delayedCall(500, () => scoreText.setTint(65535));
			}
			if (alien.alienText) alien.alienText.destroy();
			alien.destroy();
			if (aliens.countActive(true) === 0) {
				alienSpeed += 10;
				startLevel(this);
			} else {
				let hasCorrect = false;
				aliens.children.iterate((a) => {
					if (a && targetNumber % a.numberValue === 0) hasCorrect = true;
				});
				if (!hasCorrect) {
					score += 50;
					scoreText.setText("Punkte: " + score);
					this.cameras.main.flash(500, 0, 255, 0);
					alienSpeed += 5;
					startLevel(this);
				}
			}
		}
		function gameOver(player, alien) {
			if (gameOverState) return;
			gameOverState = true;
			this.physics.pause();
			player.setTint(16711680);
			thrustParticles.stop();
			this.cameras.main.shake(500, .02);
			this.add.rectangle(400, 300, 800, 600, 0, .7);
			this.add.text(400, 250, "GAME OVER", {
				fontSize: "64px",
				fill: "#ff0000",
				fontStyle: "bold"
			}).setOrigin(.5);
			this.add.text(400, 330, "Endpunktzahl: " + score, {
				fontSize: "32px",
				fill: "#ffffff"
			}).setOrigin(.5);
			const restartText = this.add.text(400, 400, "Klicke zum Neustart", {
				fontSize: "24px",
				fill: "#00ffff"
			}).setOrigin(.5);
			restartText.setInteractive({ useHandCursor: true });
			restartText.on("pointerdown", () => {
				score = 0;
				scoreText.setText("Punkte: 0");
				alienSpeed = 50;
				gameOverState = false;
				player.clearTint();
				this.physics.resume();
				thrustParticles.start();
				startLevel(this);
			});
		}
		function update(time, delta) {
			if (gameOverState) return;
			if (cursors.left.isDown) player.setVelocityX(-350);
			else if (cursors.right.isDown) player.setVelocityX(350);
			else player.setVelocityX(0);
			if (spacebar.isDown && time > lastFired) {
				let laser = this.physics.add.sprite(player.x, player.y - 20, "laser");
				lasers.add(laser);
				laser.setVelocityY(-500);
				laser.setBlendMode("ADD");
				lastFired = time + 300;
				player.y = 555;
				this.time.delayedCall(50, () => {
					if (player && !gameOverState) player.y = 550;
				});
			}
			aliens.children.iterate((alien) => {
				if (alien && alien.alienText) {
					alien.alienText.x = alien.x;
					alien.alienText.y = alien.y - 25;
				}
			});
			let toDestroyLasers = [];
			lasers.children.iterate((laser) => {
				if (laser && laser.y < -20) toDestroyLasers.push(laser);
			});
			toDestroyLasers.forEach((l) => l.destroy());
			stars.children.iterate((star) => {
				if (star && star.y > 600) {
					star.y = 0;
					star.x = __webpack_exports__default.Math.Between(0, 800);
				}
			});
			let hitBound = false;
			aliens.children.iterate((alien) => {
				if (alien) {
					if (alienDirection === 1 && alien.x > 768) hitBound = true;
					if (alienDirection === -1 && alien.x < 32) hitBound = true;
					if (alien.y > 520) gameOver.call(this, player, alien);
				}
			});
			if (hitBound) {
				alienDirection *= -1;
				aliens.setVelocityX(alienSpeed * alienDirection);
				aliens.children.iterate((alien) => {
					if (alien) {
						alien.y += 30;
						this.tweens.add({
							targets: alien,
							y: alien.y + 10,
							duration: 100,
							yoyo: true
						});
					}
				});
			}
		}
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
			boxShadow: "0 0 20px rgba(0,255,255,0.2)"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "15px",
				right: "15px",
				zIndex: 10,
				padding: "10px 20px",
				backgroundColor: "rgba(255, 0, 50, 0.8)",
				color: "white",
				border: "2px solid white",
				borderRadius: "8px",
				cursor: "pointer",
				fontWeight: "bold",
				fontSize: "16px",
				transition: "all 0.2s",
				textTransform: "uppercase",
				letterSpacing: "1px"
			},
			onMouseOver: (e) => e.target.style.backgroundColor = "rgba(255, 0, 50, 1)",
			onMouseOut: (e) => e.target.style.backgroundColor = "rgba(255, 0, 50, 0.8)",
			children: "Beenden"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: gameRef })]
	});
};
//#endregion
export { FaskaSpaceInvaders as default };
