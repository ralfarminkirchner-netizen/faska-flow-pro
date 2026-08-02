import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaCross/FaskaCross.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FaskaCross = ({ onExit }) => {
	const containerRef = (0, import_react.useRef)(null);
	const gameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!containerRef.current) return;
		class MainScene extends __webpack_exports__default.Scene {
			constructor() {
				super({ key: "MainScene" });
				this.gridSize = 50;
				this.level = 1;
				this.adjectives = [
					"schnell",
					"groß",
					"schön",
					"klein",
					"klug",
					"laut",
					"leise",
					"stark",
					"hell",
					"dunkel",
					"kalt",
					"warm",
					"bunt",
					"rund",
					"neu",
					"alt",
					"gut"
				];
				this.others = [
					"Hund",
					"laufen",
					"Haus",
					"spielen",
					"Auto",
					"essen",
					"Baum",
					"trinken",
					"Tisch",
					"schlafen",
					"Katze",
					"lesen",
					"Buch",
					"singen",
					"Maus",
					"gehen"
				];
			}
			create() {
				this.drawBackground();
				this.createTextures();
				this.cars = this.physics.add.group();
				this.logs = this.physics.add.group();
				this.spawnEntities();
				this.player = this.physics.add.sprite(425, 575, "frog");
				this.player.body.setSize(24, 24);
				this.player.setDepth(10);
				this.cursors = this.input.keyboard.createCursorKeys();
				this.moveDelay = 150;
				this.lastMoveTime = 0;
				this.createUI();
				this.createEmitters();
			}
			drawBackground() {
				const bg = this.add.graphics();
				bg.fillStyle(2976335, 1);
				bg.fillRect(0, 550, 800, 50);
				bg.fillStyle(3355443, 1);
				bg.fillRect(0, 300, 800, 250);
				bg.fillStyle(2976335, 1);
				bg.fillRect(0, 250, 800, 50);
				bg.fillStyle(30646, 1);
				bg.fillRect(0, 50, 800, 200);
				bg.fillStyle(13938487, 1);
				bg.fillRect(0, 0, 800, 50);
				bg.lineStyle(1, 16777215, .05);
				for (let i = 0; i <= 800; i += this.gridSize) {
					bg.moveTo(i, 0);
					bg.lineTo(i, 600);
				}
				for (let i = 0; i <= 600; i += this.gridSize) {
					bg.moveTo(0, i);
					bg.lineTo(800, i);
				}
				bg.strokePath();
				bg.lineStyle(2, 16777215, .5);
				for (let y = 350; y <= 500; y += 50) for (let x = 0; x < 800; x += 40) {
					bg.moveTo(x, y);
					bg.lineTo(x + 20, y);
				}
				bg.strokePath();
			}
			createTextures() {
				let gfx = this.make.graphics();
				gfx.fillStyle(16777215, 1);
				gfx.fillCircle(4, 4, 4);
				gfx.generateTexture("particle", 8, 8);
				gfx.clear();
				gfx.fillStyle(4245824, 1);
				gfx.fillCircle(20, 20, 18);
				gfx.fillStyle(16777215, 1);
				gfx.fillCircle(12, 10, 6);
				gfx.fillCircle(28, 10, 6);
				gfx.fillStyle(0, 1);
				gfx.fillCircle(12, 8, 3);
				gfx.fillCircle(28, 8, 3);
				gfx.fillStyle(2789162, 1);
				gfx.fillCircle(8, 32, 6);
				gfx.fillCircle(32, 32, 6);
				gfx.generateTexture("frog", 40, 40);
				gfx.clear();
				gfx.fillStyle(13378082, 1);
				gfx.fillRoundedRect(2, 2, 42, 32, 4);
				gfx.fillStyle(8965375, 1);
				gfx.fillRect(8, 6, 8, 24);
				gfx.fillRect(30, 6, 8, 24);
				gfx.fillStyle(16776960, 1);
				gfx.fillRect(2, 8, 4, 6);
				gfx.fillRect(2, 22, 4, 6);
				gfx.fillStyle(16711680, 1);
				gfx.fillRect(40, 8, 4, 6);
				gfx.fillRect(40, 22, 4, 6);
				gfx.generateTexture("car", 46, 36);
				gfx.clear();
				gfx.fillStyle(9127187, 1);
				gfx.fillRoundedRect(0, 0, 120, 40, 8);
				gfx.lineStyle(2, 6041099, 1);
				gfx.beginPath();
				gfx.moveTo(10, 10);
				gfx.lineTo(110, 10);
				gfx.moveTo(5, 20);
				gfx.lineTo(115, 20);
				gfx.moveTo(10, 30);
				gfx.lineTo(110, 30);
				gfx.strokePath();
				gfx.generateTexture("log", 120, 40);
				gfx.destroy();
			}
			createUI() {
				this.levelText = this.add.text(10, 10, "Level: 1", {
					fontSize: "24px",
					fill: "#000",
					fontStyle: "bold"
				});
				this.levelText.setDepth(20);
				this.instructionText = this.add.text(400, 275, "Springe nur auf ADJEKTIVE!", {
					fontSize: "22px",
					fill: "#ffff00",
					backgroundColor: "#000000",
					padding: {
						x: 10,
						y: 5
					},
					fontStyle: "bold"
				}).setOrigin(.5);
				this.instructionText.setDepth(20);
				this.time.delayedCall(4e3, () => {
					this.instructionText.setVisible(false);
				});
			}
			createEmitters() {
				this.deathEmitter = this.add.particles(0, 0, "particle", {
					lifespan: 600,
					speed: {
						min: 50,
						max: 200
					},
					scale: {
						start: 1,
						end: 0
					},
					tint: 16711680,
					emitting: false
				});
				this.deathEmitter.setDepth(15);
				this.winEmitter = this.add.particles(0, 0, "particle", {
					lifespan: 1e3,
					speed: {
						min: 100,
						max: 300
					},
					scale: {
						start: 1,
						end: 0
					},
					tint: [
						16776960,
						65280,
						16777215
					],
					emitting: false
				});
				this.winEmitter.setDepth(15);
				this.jumpEmitter = this.add.particles(0, 0, "particle", {
					lifespan: 300,
					speed: {
						min: 20,
						max: 50
					},
					scale: {
						start: .5,
						end: 0
					},
					tint: 11184810,
					emitting: false
				});
				this.jumpEmitter.setDepth(9);
			}
			spawnEntities() {
				if (this.logs) this.logs.getChildren().forEach((log) => {
					if (log.wordText) log.wordText.destroy();
				});
				this.cars.clear(true, true);
				this.logs.clear(true, true);
				const baseSpeed = 40 + this.level * 10;
				const roadLanes = [
					{
						y: 525,
						speed: -baseSpeed,
						dir: -1
					},
					{
						y: 475,
						speed: baseSpeed * 1.2,
						dir: 1
					},
					{
						y: 425,
						speed: -baseSpeed * .8,
						dir: -1
					},
					{
						y: 375,
						speed: baseSpeed * 1.5,
						dir: 1
					},
					{
						y: 325,
						speed: -baseSpeed * 1.3,
						dir: -1
					}
				];
				const riverLanes = [
					{
						y: 225,
						speed: baseSpeed * .9,
						dir: 1
					},
					{
						y: 175,
						speed: -baseSpeed * 1.1,
						dir: -1
					},
					{
						y: 125,
						speed: baseSpeed * 1.4,
						dir: 1
					},
					{
						y: 75,
						speed: -baseSpeed * 1.2,
						dir: -1
					}
				];
				roadLanes.forEach((lane) => {
					let numCars = 3;
					let spacing = 800 / numCars;
					for (let i = 0; i < numCars; i++) {
						let x = i * spacing + __webpack_exports__default.Math.Between(0, 50);
						let car = this.cars.create(x, lane.y, "car");
						car.body.setSize(34, 26);
						car.setVelocityX(lane.speed);
						car.dir = lane.dir;
						if (lane.dir === 1) car.setFlipX(true);
					}
				});
				riverLanes.forEach((lane) => {
					let numLogs = 3;
					let spacing = 800 / numLogs;
					let guaranteedAdjIndex = __webpack_exports__default.Math.Between(0, numLogs - 1);
					for (let i = 0; i < numLogs; i++) {
						let x = i * spacing + __webpack_exports__default.Math.Between(0, 50);
						let forceAdjective = i === guaranteedAdjIndex;
						this.createLog(x, lane.y, lane.speed, lane.dir, forceAdjective);
					}
				});
			}
			createLog(x, y, speed, dir, forceAdjective = false) {
				let log = this.logs.create(x, y, "log");
				log.setVelocityX(speed);
				log.dir = dir;
				let isAdjective = forceAdjective ? true : __webpack_exports__default.Math.Between(0, 1) === 0;
				let word = isAdjective ? __webpack_exports__default.Utils.Array.GetRandom(this.adjectives) : __webpack_exports__default.Utils.Array.GetRandom(this.others);
				let text = this.add.text(x, y, word, {
					fontSize: "18px",
					fill: "#ffffff",
					fontStyle: "bold",
					stroke: "#000000",
					strokeThickness: 3
				}).setOrigin(.5);
				text.setDepth(11);
				log.wordText = text;
				log.isAdjective = isAdjective;
			}
			update(time, delta) {
				if (this.player.isDead) return;
				this.cars.getChildren().forEach((car) => {
					if (car.dir === 1 && car.x > 850) car.x = -50;
					if (car.dir === -1 && car.x < -50) car.x = 850;
				});
				this.logs.getChildren().forEach((log) => {
					if (log.dir === 1 && log.x > 860) {
						log.x = -60;
						this.reassignLogWord(log);
					}
					if (log.dir === -1 && log.x < -60) {
						log.x = 860;
						this.reassignLogWord(log);
					}
					log.wordText.setPosition(log.x, log.y);
				});
				if (time > this.lastMoveTime) {
					let dx = 0;
					let dy = 0;
					if (this.cursors.left.isDown) dx = -this.gridSize;
					else if (this.cursors.right.isDown) dx = this.gridSize;
					else if (this.cursors.up.isDown) dy = -this.gridSize;
					else if (this.cursors.down.isDown) dy = this.gridSize;
					if (dx !== 0 || dy !== 0) {
						let targetX = __webpack_exports__default.Math.Clamp(this.player.x + dx, 25, 775);
						let targetY = __webpack_exports__default.Math.Clamp(this.player.y + dy, 25, 575);
						this.player.setPosition(targetX, targetY);
						this.player.body.updateFromGameObject();
						this.lastMoveTime = time + this.moveDelay;
						this.jumpEmitter.emitParticleAt(this.player.x, this.player.y, 5);
					}
				}
				this.checkCollisions(delta);
			}
			reassignLogWord(log) {
				let isAdjective = __webpack_exports__default.Math.Between(0, 1) === 0;
				let word = isAdjective ? __webpack_exports__default.Utils.Array.GetRandom(this.adjectives) : __webpack_exports__default.Utils.Array.GetRandom(this.others);
				log.wordText.setText(word);
				log.isAdjective = isAdjective;
			}
			checkCollisions(delta) {
				let onRoad = this.player.y >= 325 && this.player.y <= 525;
				let onRiver = this.player.y >= 75 && this.player.y <= 225;
				let inGoal = this.player.y <= 25;
				if (onRoad) {
					if (this.physics.overlap(this.player, this.cars)) this.die();
				}
				if (onRiver) {
					let overlappingLog = null;
					this.physics.overlap(this.player, this.logs, (player, log) => {
						overlappingLog = log;
					});
					if (overlappingLog) if (!overlappingLog.isAdjective) this.dieWithReason(`"${overlappingLog.wordText.text}"\nist kein Adjektiv!`);
					else {
						this.player.x += overlappingLog.body.velocity.x * (delta / 1e3);
						this.player.body.updateFromGameObject();
						if (this.player.x > 800 || this.player.x < 0) this.die();
					}
					else {
						this.jumpEmitter.setTint(30646);
						this.jumpEmitter.emitParticleAt(this.player.x, this.player.y, 10);
						this.jumpEmitter.setTint(11184810);
						this.die();
					}
				}
				if (inGoal) this.winLevel();
			}
			dieWithReason(reason) {
				if (this.player.isDead) return;
				let t = this.add.text(400, 300, reason, {
					fontSize: "28px",
					fill: "#ff0000",
					backgroundColor: "#ffffff",
					padding: {
						x: 20,
						y: 20
					},
					align: "center",
					fontStyle: "bold",
					stroke: "#000000",
					strokeThickness: 2
				}).setOrigin(.5);
				t.setDepth(30);
				this.time.delayedCall(2e3, () => t.destroy());
				this.die();
			}
			die() {
				if (this.player.isDead) return;
				this.player.isDead = true;
				this.player.setVisible(false);
				this.cameras.main.shake(300, .02);
				this.cameras.main.flash(200, 255, 0, 0);
				this.deathEmitter.emitParticleAt(this.player.x, this.player.y, 30);
				this.time.delayedCall(1e3, () => {
					this.player.setPosition(425, 575);
					this.player.body.updateFromGameObject();
					this.player.setVisible(true);
					this.player.isDead = false;
				});
			}
			winLevel() {
				if (this.player.isDead) return;
				this.player.isDead = true;
				this.cameras.main.flash(300, 255, 255, 100);
				this.winEmitter.emitParticleAt(this.player.x, this.player.y, 50);
				let t = this.add.text(400, 300, "SUPER!", {
					fontSize: "56px",
					fill: "#ffff00",
					stroke: "#000",
					strokeThickness: 6
				}).setOrigin(.5);
				t.setDepth(30);
				this.time.delayedCall(1500, () => {
					t.destroy();
					this.level++;
					this.levelText.setText("Level: " + this.level);
					this.player.setPosition(425, 575);
					this.player.body.updateFromGameObject();
					this.player.isDead = false;
					this.spawnEntities();
				});
			}
		}
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 800,
			height: 600,
			parent: containerRef.current,
			physics: {
				default: "arcade",
				arcade: { debug: false }
			},
			scene: MainScene
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
			width: "800px",
			height: "600px",
			margin: "0 auto",
			border: "2px solid #333",
			borderRadius: "8px",
			overflow: "hidden",
			boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "100%",
				height: "100%"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: 15,
				right: 15,
				zIndex: 10,
				padding: "8px 16px",
				fontSize: "16px",
				fontWeight: "bold",
				background: "#ff4444",
				color: "white",
				border: "2px solid white",
				borderRadius: "8px",
				cursor: "pointer",
				boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
				transition: "transform 0.1s"
			},
			onMouseOver: (e) => {
				e.target.style.background = "#ff6666";
				e.target.style.transform = "scale(1.05)";
			},
			onMouseOut: (e) => {
				e.target.style.background = "#ff4444";
				e.target.style.transform = "scale(1)";
			},
			onMouseDown: (e) => {
				e.target.style.transform = "scale(0.95)";
			},
			onMouseUp: (e) => {
				e.target.style.transform = "scale(1.05)";
			},
			children: "Beenden"
		})]
	});
};
//#endregion
export { FaskaCross as default };
