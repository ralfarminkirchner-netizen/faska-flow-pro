import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaMicroMachines/FaskaMicroMachines.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var MainScene = class extends __webpack_exports__default.Scene {
	constructor() {
		super({ key: "MainScene" });
	}
	create() {
		this.speed = 0;
		this.maxSpeed = 400;
		this.gateActive = false;
		this.cursors = this.input.keyboard.createCursorKeys();
		this.keys = this.input.keyboard.addKeys("W,A,S,D");
		this.createTextures();
		this.drawBackground();
		this.createTrack();
		this.createCar();
		this.createUI();
		this.skidEmitter = this.add.particles(0, 0, "particle", {
			scale: {
				start: .8,
				end: 1.5
			},
			alpha: {
				start: .3,
				end: 0
			},
			tint: 1118481,
			lifespan: 600,
			emitting: false
		});
		this.correctEmitter = this.add.particles(0, 0, "particle", {
			speed: {
				min: 100,
				max: 400
			},
			scale: {
				start: 1.5,
				end: 0
			},
			tint: 65280,
			lifespan: 800,
			blendMode: "ADD",
			emitting: false
		});
		this.wrongEmitter = this.add.particles(0, 0, "particle", {
			speed: {
				min: 100,
				max: 400
			},
			scale: {
				start: 1.5,
				end: 0
			},
			tint: 16711680,
			lifespan: 800,
			blendMode: "ADD",
			emitting: false
		});
		this.sparkEmitter = this.add.particles(0, 0, "particle", {
			speed: {
				min: 50,
				max: 200
			},
			scale: {
				start: 1,
				end: 0
			},
			tint: 16755200,
			lifespan: 400,
			blendMode: "ADD",
			emitting: false
		});
		this.generateProblem();
	}
	createTextures() {
		const g = this.make.graphics({
			x: 0,
			y: 0,
			add: false
		});
		g.fillStyle(16777215, 1);
		g.fillCircle(4, 4, 4);
		g.generateTexture("particle", 8, 8);
		g.clear();
		g.fillStyle(16724821);
		g.fillRoundedRect(0, 4, 32, 16, 4);
		g.fillStyle(1118481);
		g.fillRect(8, 6, 8, 12);
		g.fillRect(22, 6, 4, 12);
		g.fillStyle(0);
		g.fillRoundedRect(4, 0, 8, 4, 2);
		g.fillRoundedRect(20, 0, 8, 4, 2);
		g.fillRoundedRect(4, 20, 8, 4, 2);
		g.fillRoundedRect(20, 20, 8, 4, 2);
		g.fillStyle(16777130);
		g.fillCircle(30, 6, 2);
		g.fillCircle(30, 18, 2);
		g.generateTexture("carTex", 32, 24);
		g.destroy();
	}
	drawBackground() {
		this.cameras.main.setBackgroundColor("#0a0a1a");
		const bgG = this.add.graphics();
		bgG.lineStyle(1, 3359829, .2);
		for (let x = 0; x <= 1024; x += 32) {
			bgG.moveTo(x, 0);
			bgG.lineTo(x, 768);
		}
		for (let y = 0; y <= 768; y += 32) {
			bgG.moveTo(0, y);
			bgG.lineTo(1024, y);
		}
		bgG.strokePath();
	}
	createTrack() {
		const trackG = this.add.graphics();
		const drawNeonRect = (x, y, w, h, color) => {
			trackG.lineStyle(8, color, .3);
			trackG.strokeRect(x, y, w, h);
			trackG.lineStyle(4, color, .7);
			trackG.strokeRect(x, y, w, h);
			trackG.lineStyle(2, 16777215, 1);
			trackG.strokeRect(x, y, w, h);
		};
		drawNeonRect(50, 50, 924, 668, 35071);
		drawNeonRect(250, 250, 524, 268, 35071);
		drawNeonRect(400, 140, 224, 20, 16711935);
		trackG.fillStyle(16777215, .1);
		trackG.fillRect(487, 518, 50, 200);
		for (let i = 0; i < 4; i++) for (let j = 0; j < 10; j++) {
			if ((i + j) % 2 === 0) trackG.fillStyle(16777215, .6);
			else trackG.fillStyle(0, .6);
			trackG.fillRect(487 + i * 12.5, 518 + j * 20, 12.5, 20);
		}
		this.walls = this.physics.add.staticGroup();
		this.walls.create(512, 25, 1024, 50);
		this.walls.create(512, 743, 1024, 50);
		this.walls.create(25, 384, 50, 768);
		this.walls.create(999, 384, 50, 768);
		this.walls.create(512, 384, 524, 268);
		this.walls.create(512, 150, 224, 20);
		this.walls.children.iterate((child) => {
			child.setVisible(false);
		});
		this.topZone = this.add.zone(512, 95, 50, 90);
		this.physics.add.existing(this.topZone);
		this.topZone.body.setAllowGravity(false);
		this.topZone.body.moves = false;
		this.bottomZone = this.add.zone(512, 205, 50, 90);
		this.physics.add.existing(this.bottomZone);
		this.bottomZone.body.setAllowGravity(false);
		this.bottomZone.body.moves = false;
		this.checkpointZone = this.add.zone(512, 618, 50, 200);
		this.physics.add.existing(this.checkpointZone);
		this.checkpointZone.body.setAllowGravity(false);
		this.checkpointZone.body.moves = false;
	}
	createCar() {
		this.car = this.physics.add.sprite(512, 618, "carTex");
		this.car.setCollideWorldBounds(true);
		this.car.setBounce(.3);
		this.car.setAngle(180);
		this.car.body.setSize(24, 16);
		this.physics.add.collider(this.car, this.walls, () => {
			if (Math.sqrt(this.car.body.velocity.x ** 2 + this.car.body.velocity.y ** 2) > 50 && Math.abs(this.speed) > 50) {
				this.speed *= .8;
				if (!this.car.getData("wallHitCooldown")) {
					this.car.setData("wallHitCooldown", true);
					this.cameras.main.shake(50, .005);
					this.createExplosion(this.car.x, this.car.y, "spark", 5);
					this.time.delayedCall(200, () => this.car.setData("wallHitCooldown", false));
				}
			}
		});
		this.physics.add.overlap(this.car, this.topZone, () => this.hitZone("top"));
		this.physics.add.overlap(this.car, this.bottomZone, () => this.hitZone("bottom"));
		this.physics.add.overlap(this.car, this.checkpointZone, () => this.hitCheckpoint());
	}
	createUI() {
		this.problemText = this.add.text(512, 384, "", {
			fontSize: "72px",
			fill: "#fff",
			fontStyle: "bold"
		}).setOrigin(.5);
		this.problemText.setShadow(0, 0, "#0088ff", 15, true, true);
		this.topAnswerText = this.add.text(450, 95, "", {
			fontSize: "42px",
			fill: "#0ff",
			fontStyle: "bold"
		}).setOrigin(.5);
		this.topAnswerText.setShadow(0, 0, "#ff00ff", 8, true, true);
		this.bottomAnswerText = this.add.text(450, 205, "", {
			fontSize: "42px",
			fill: "#0ff",
			fontStyle: "bold"
		}).setOrigin(.5);
		this.bottomAnswerText.setShadow(0, 0, "#ff00ff", 8, true, true);
		this.feedbackText = this.add.text(512, 250, "", {
			fontSize: "56px",
			fill: "#fff",
			fontStyle: "bold"
		}).setOrigin(.5);
		this.feedbackText.setAlpha(0);
		this.add.text(512, 745, "Steuern: Pfeile L/R | Gas: Pfeil Oben | Bremsen: Pfeil Unten", {
			fontSize: "18px",
			fill: "#aaa"
		}).setOrigin(.5);
	}
	generateProblem() {
		this.gateActive = true;
		const num1 = __webpack_exports__default.Math.Between(2, 10);
		const num2 = __webpack_exports__default.Math.Between(2, 10);
		const answer = num1 * num2;
		let wrongAnswer = answer + __webpack_exports__default.Math.Between(-5, 5);
		if (wrongAnswer === answer) wrongAnswer += 2;
		if (wrongAnswer <= 0) wrongAnswer = answer + 3;
		this.correctLocation = __webpack_exports__default.Math.Between(0, 1) === 0 ? "top" : "bottom";
		this.problemText.setText(`${num1} x ${num2} = ?`);
		if (this.correctLocation === "top") {
			this.topAnswerText.setText(answer.toString());
			this.bottomAnswerText.setText(wrongAnswer.toString());
		} else {
			this.topAnswerText.setText(wrongAnswer.toString());
			this.bottomAnswerText.setText(answer.toString());
		}
		this.topAnswerText.setAlpha(1);
		this.bottomAnswerText.setAlpha(1);
		this.problemText.setScale(.5);
		this.tweens.add({
			targets: this.problemText,
			scale: 1,
			duration: 500,
			ease: "Back.out"
		});
	}
	hitZone(zoneName) {
		if (!this.gateActive) return;
		this.gateActive = false;
		if (zoneName === this.correctLocation) {
			this.speed = 800;
			this.maxSpeed = 800;
			this.cameras.main.shake(200, .015);
			this.showFeedback("RICHTIG!", 65280);
			this.createExplosion(this.car.x, this.car.y, "correct");
			this.time.delayedCall(2e3, () => {
				this.maxSpeed = 400;
			});
		} else {
			this.speed = 50;
			this.maxSpeed = 150;
			this.cameras.main.shake(400, .04);
			this.showFeedback("FALSCH!", 16711680);
			this.createExplosion(this.car.x, this.car.y, "wrong");
			this.time.delayedCall(3e3, () => {
				this.maxSpeed = 400;
			});
		}
		this.tweens.add({
			targets: [this.topAnswerText, this.bottomAnswerText],
			alpha: .2,
			duration: 300
		});
	}
	hitCheckpoint() {
		if (!this.gateActive) this.generateProblem();
	}
	showFeedback(text, color) {
		this.feedbackText.setText(text);
		this.feedbackText.setTint(color);
		this.feedbackText.setAlpha(1);
		this.feedbackText.setScale(.5);
		this.feedbackText.y = this.car.y - 60;
		this.feedbackText.x = this.car.x;
		this.tweens.add({
			targets: this.feedbackText,
			scale: 1.2,
			y: this.feedbackText.y - 60,
			alpha: 0,
			duration: 1e3,
			ease: "Power2"
		});
	}
	createExplosion(x, y, type, count = 40) {
		if (type === "correct") this.correctEmitter.emitParticleAt(x, y, count);
		else if (type === "wrong") this.wrongEmitter.emitParticleAt(x, y, count);
		else if (type === "spark") this.sparkEmitter.emitParticleAt(x, y, count);
	}
	update(time, delta) {
		const deltaSec = delta / 1e3;
		const up = this.cursors.up.isDown || this.keys.W.isDown;
		const down = this.cursors.down.isDown || this.keys.S.isDown;
		const left = this.cursors.left.isDown || this.keys.A.isDown;
		const right = this.cursors.right.isDown || this.keys.D.isDown;
		const speedRatio = Math.abs(this.speed) / 400;
		const turnSpeed = 250 * __webpack_exports__default.Math.Clamp(speedRatio, .1, 1) * deltaSec;
		if (left) this.car.angle -= turnSpeed;
		if (right) this.car.angle += turnSpeed;
		if (up) this.speed += 700 * deltaSec;
		else if (down) this.speed -= 700 * deltaSec;
		else if (this.speed > 0) {
			this.speed -= 300 * deltaSec;
			if (this.speed < 0) this.speed = 0;
		} else if (this.speed < 0) {
			this.speed += 300 * deltaSec;
			if (this.speed > 0) this.speed = 0;
		}
		this.speed = __webpack_exports__default.Math.Clamp(this.speed, -200, this.maxSpeed);
		const rotation = this.car.rotation;
		const forwardX = Math.cos(rotation) * this.speed;
		const forwardY = Math.sin(rotation) * this.speed;
		const grip = Math.min(8 * deltaSec, 1);
		this.car.body.velocity.x = __webpack_exports__default.Math.Linear(this.car.body.velocity.x, forwardX, grip);
		this.car.body.velocity.y = __webpack_exports__default.Math.Linear(this.car.body.velocity.y, forwardY, grip);
		if (__webpack_exports__default.Math.Distance.Between(this.car.body.velocity.x, this.car.body.velocity.y, forwardX, forwardY) > 80 && Math.abs(this.speed) > 150) {
			const rearX = this.car.x - Math.cos(rotation) * 12;
			const rearY = this.car.y - Math.sin(rotation) * 12;
			const normalX = Math.cos(rotation + Math.PI / 2);
			const normalY = Math.sin(rotation + Math.PI / 2);
			const wheelOffset = (Math.random() > .5 ? 1 : -1) * 8;
			this.skidEmitter.emitParticleAt(rearX + normalX * wheelOffset, rearY + normalY * wheelOffset, 1);
		}
	}
};
function FaskaMicroMachines({ onExit }) {
	const gameContainerRef = (0, import_react.useRef)(null);
	const gameInstanceRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (gameInstanceRef.current) return;
		const config = {
			type: __webpack_exports__default.AUTO,
			scale: {
				mode: __webpack_exports__default.Scale.FIT,
				autoCenter: __webpack_exports__default.Scale.CENTER_BOTH,
				width: 1024,
				height: 768
			},
			parent: gameContainerRef.current,
			physics: {
				default: "arcade",
				arcade: {
					gravity: { y: 0 },
					debug: false
				}
			},
			scene: [MainScene],
			backgroundColor: "#0a0a1a"
		};
		gameInstanceRef.current = new __webpack_exports__default.Game(config);
		return () => {
			if (gameInstanceRef.current) {
				gameInstanceRef.current.destroy(true);
				gameInstanceRef.current = null;
			}
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100%",
			height: "100%",
			minHeight: "100vh",
			background: "#000",
			display: "flex",
			justifyContent: "center",
			alignItems: "center"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: gameContainerRef,
			style: {
				width: "100%",
				height: "100%",
				maxWidth: "1024px",
				maxHeight: "768px"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "20px",
				right: "20px",
				padding: "12px 24px",
				fontSize: "18px",
				fontWeight: "bold",
				backgroundColor: "#ff3344",
				color: "white",
				border: "2px solid #fff",
				borderRadius: "8px",
				cursor: "pointer",
				zIndex: 10,
				boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
				textTransform: "uppercase",
				letterSpacing: "1px"
			},
			children: "Beenden"
		})]
	});
}
//#endregion
export { FaskaMicroMachines as default };
