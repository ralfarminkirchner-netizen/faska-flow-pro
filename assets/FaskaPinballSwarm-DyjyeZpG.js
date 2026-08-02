import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaPinballSwarm/FaskaPinballSwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var W = 480;
var H = 800;
var GRAVITY = 2.8;
var MAX_BALLS = 3;
var OPERATORS = [
	"+",
	"-",
	"*",
	"/"
];
function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
var PinballSwarmScene = class extends __webpack_exports__default.Scene {
	constructor() {
		super({ key: "PinballSwarmScene" });
	}
	preload() {
		const g = this.add.graphics();
		g.clear();
		g.fillStyle(16777215, 1);
		g.fillCircle(16, 16, 13);
		g.fillStyle(8965375, .6);
		g.fillCircle(16, 16, 16);
		g.generateTexture("ball", 32, 32);
		g.clear();
		g.fillStyle(1710638, 1);
		g.fillCircle(40, 40, 38);
		g.lineStyle(5, 58879, 1);
		g.strokeCircle(40, 40, 37);
		g.lineStyle(2, 58879, .4);
		g.strokeCircle(40, 40, 30);
		g.generateTexture("bumper", 80, 80);
		g.clear();
		g.fillStyle(16723311, 1);
		g.fillRoundedRect(0, 0, 110, 22, {
			tl: 11,
			tr: 3,
			br: 3,
			bl: 11
		});
		g.lineStyle(2, 16748464, .8);
		g.strokeRoundedRect(0, 0, 110, 22, {
			tl: 11,
			tr: 3,
			br: 3,
			bl: 11
		});
		g.generateTexture("flipperL", 110, 22);
		g.clear();
		g.fillStyle(16723311, 1);
		g.fillRoundedRect(0, 0, 110, 22, {
			tl: 3,
			tr: 11,
			br: 11,
			bl: 3
		});
		g.lineStyle(2, 16748464, .8);
		g.strokeRoundedRect(0, 0, 110, 22, {
			tl: 3,
			tr: 11,
			br: 11,
			bl: 3
		});
		g.generateTexture("flipperR", 110, 22);
		g.clear();
		g.fillStyle(16777215, 1);
		g.fillCircle(4, 4, 4);
		g.generateTexture("dot", 8, 8);
		g.clear();
		g.fillStyle(3359846, 1);
		g.fillRect(0, 0, 16, 200);
		g.generateTexture("plungerWall", 16, 200);
		g.clear();
		g.fillStyle(2241365, 1);
		g.fillRect(0, 0, 400, 18);
		g.lineStyle(2, 4491468, .5);
		g.strokeRect(0, 0, 400, 18);
		g.generateTexture("wall", 400, 18);
		g.destroy();
	}
	create() {
		this.score = 0;
		this.ballsLeft = MAX_BALLS;
		this.tiltCooldown = 0;
		this.plungerCharge = 0;
		this.plungerCharging = false;
		this.ballInPlay = false;
		this.ballLost = false;
		this.chain = [];
		this.chainComplete = false;
		this.awaitingAnswer = false;
		this.correctAnswer = null;
		this.answerBuffer = "";
		this.events.on("updateUI", (data) => {
			if (this._uiBridge) this._uiBridge(data);
		});
		this._buildBackground();
		this._buildWalls();
		this._buildFlippers();
		this._buildBumpers();
		this._buildPlunger();
		this._buildSlingshots();
		this._buildTargetLights();
		this._buildUI();
		this._setupParticles();
		this._setupInput();
		this._setupCollisions();
		this._spawnBall();
		this._emitUI();
	}
	_buildBackground() {
		this.add.rectangle(W / 2, H / 2, W, H, 328975);
		const grid = this.add.graphics();
		grid.lineStyle(1, 58879, .04);
		for (let x = 0; x < W; x += 30) grid.lineBetween(x, 0, x, H);
		for (let y = 0; y < H; y += 30) grid.lineBetween(0, y, W, y);
		const border = this.add.graphics();
		border.lineStyle(3, 58879, .6);
		border.strokeRect(2, 2, W - 4, H - 4);
		border.lineStyle(1, 58879, .2);
		border.strokeRect(6, 6, W - 12, H - 12);
	}
	_buildWalls() {
		const { Bodies, World } = __webpack_exports__default.Physics.Matter.Matter;
		this.matter.world.setBounds(0, -100, W, H + 100, 60, true, true, true, false);
		this._addStaticRect(W - 32, H - 200, 4, 400, 3359846);
		this._addStaticRotatedRect(78, H - 138, 130, 14, -.58, 3364266);
		this._addStaticRotatedRect(W - 111, H - 138, 130, 14, .58, 3364266);
		this._addStaticRotatedRect(52, 130, 90, 14, .42, 3364266);
		this._addStaticRotatedRect(W - 52, 130, 90, 14, -.42, 3364266);
	}
	_addStaticRect(x, y, w, h, color) {
		const body = this.matter.add.rectangle(x, y, w, h, { isStatic: true });
		const gfx = this.add.graphics();
		gfx.fillStyle(color, 1);
		gfx.fillRect(-w / 2, -h / 2, w, h);
		gfx.x = x;
		gfx.y = y;
		return body;
	}
	_addStaticRotatedRect(x, y, w, h, angle, color) {
		const body = this.matter.add.rectangle(x, y, w, h, {
			isStatic: true,
			angle
		});
		const gfx = this.add.graphics();
		gfx.fillStyle(color, 1);
		gfx.lineStyle(2, 4491468, .6);
		gfx.fillRect(-w / 2, -h / 2, w, h);
		gfx.strokeRect(-w / 2, -h / 2, w, h);
		gfx.x = x;
		gfx.y = y;
		gfx.rotation = angle;
		return body;
	}
	_buildFlippers() {
		const flipW = 110;
		const pivotY = H - 110;
		const lPivotX = 100;
		this.leftFlipperPivot = this.matter.add.rectangle(lPivotX, pivotY, 4, 4, {
			isStatic: true,
			isSensor: true,
			label: "pivotL"
		});
		this.leftFlipper = this.matter.add.image(lPivotX + flipW / 2 - 10, pivotY, "flipperL", null, {
			friction: 0,
			restitution: .4,
			density: .4,
			label: "flipper",
			collisionFilter: {
				category: 4,
				mask: 65535
			}
		});
		this.leftFlipper.setOrigin(.1, .5);
		this.leftConstraint = this.matter.add.constraint(this.leftFlipperPivot, this.leftFlipper.body, 0, .9, {
			pointA: {
				x: 0,
				y: 0
			},
			pointB: {
				x: -flipW * .4,
				y: 0
			}
		});
		this._addStopper(lPivotX, pivotY - 28, 8);
		this._addStopper(lPivotX, pivotY + 28, 8);
		const rPivotX = W - 100;
		this.rightFlipperPivot = this.matter.add.rectangle(rPivotX, pivotY, 4, 4, {
			isStatic: true,
			isSensor: true,
			label: "pivotR"
		});
		this.rightFlipper = this.matter.add.image(rPivotX - flipW / 2 + 10, pivotY, "flipperR", null, {
			friction: 0,
			restitution: .4,
			density: .4,
			label: "flipper",
			collisionFilter: {
				category: 4,
				mask: 65535
			}
		});
		this.rightFlipper.setOrigin(.9, .5);
		this.rightConstraint = this.matter.add.constraint(this.rightFlipperPivot, this.rightFlipper.body, 0, .9, {
			pointA: {
				x: 0,
				y: 0
			},
			pointB: {
				x: flipW * .4,
				y: 0
			}
		});
		this._addStopper(rPivotX, pivotY - 28, 8);
		this._addStopper(rPivotX, pivotY + 28, 8);
		this.leftDown = false;
		this.rightDown = false;
	}
	_addStopper(x, y, r) {
		this.matter.add.circle(x, y, r, {
			isStatic: true,
			isSensor: false,
			label: "stopper",
			collisionFilter: {
				category: 2,
				mask: 4
			}
		});
	}
	_buildBumpers() {
		this.bumpers = [];
		this.bumperTexts = [];
		[
			{
				x: W / 2,
				y: 220
			},
			{
				x: W / 2 - 100,
				y: 300
			},
			{
				x: W / 2 + 100,
				y: 300
			},
			{
				x: W / 2 - 50,
				y: 390
			},
			{
				x: W / 2 + 50,
				y: 390
			},
			{
				x: W / 2,
				y: 470
			}
		].forEach((pos, i) => {
			const op = OPERATORS[i % OPERATORS.length];
			const body = this.matter.add.circle(pos.x, pos.y, 36, {
				isStatic: true,
				restitution: 1.8,
				label: "bumper",
				collisionFilter: {
					category: 1,
					mask: 65535
				}
			});
			const img = this.add.image(pos.x, pos.y, "bumper").setDepth(5);
			const txt = this.add.text(pos.x, pos.y, op, {
				fontSize: "26px",
				fontStyle: "bold",
				fontFamily: "Courier New, monospace",
				color: "#00e5ff",
				stroke: "#003355",
				strokeThickness: 3
			}).setOrigin(.5).setDepth(6);
			const glow = this.add.graphics().setDepth(4);
			glow.lineStyle(6, 58879, .3);
			glow.strokeCircle(pos.x, pos.y, 42);
			this.bumpers.push({
				body,
				img,
				txt,
				glow,
				op,
				pos,
				glowTween: null
			});
		});
	}
	_buildPlunger() {
		this.plungerLaneX = W - 48;
		this.plungerGfx = this.add.graphics().setDepth(10);
		this._drawPlunger(0);
		this.add.text(this.plungerLaneX, H - 55, "SPACE\nLAUNCH", {
			fontSize: "10px",
			color: "#4488cc",
			fontFamily: "Arial",
			align: "center"
		}).setOrigin(.5).setDepth(11);
	}
	_drawPlunger(charge) {
		const g = this.plungerGfx;
		g.clear();
		const baseY = H - 80;
		const rodLen = 40 + charge * 60;
		const x = this.plungerLaneX;
		g.lineStyle(8, 16737792, 1);
		g.lineBetween(x, baseY, x, baseY + rodLen);
		const pct = charge;
		const col = __webpack_exports__default.Display.Color.Interpolate.ColorWithColor(__webpack_exports__default.Display.Color.ValueToColor(16737792), __webpack_exports__default.Display.Color.ValueToColor(16711680), 100, pct * 100);
		g.fillStyle(__webpack_exports__default.Display.Color.ObjectToColor(col).color, 1);
		g.fillRoundedRect(x - 14, baseY + rodLen - 4, 28, 18, 6);
		if (charge > 0) {
			g.fillStyle(2236962, 1);
			g.fillRoundedRect(x - 14, baseY - 75, 28, 60, 4);
			g.fillStyle(16729088, 1);
			g.fillRoundedRect(x - 12, baseY - 73 + 58 * (1 - charge), 24, 58 * charge, 3);
		}
	}
	_buildSlingshots() {
		this._addSlingshot(90, H - 280, -.4, true);
		this._addSlingshot(W - 130, H - 280, .4, false);
	}
	_addSlingshot(x, y, angle, isLeft) {
		const w = 80, h = 14;
		const body = this.matter.add.rectangle(x, y, w, h, {
			isStatic: true,
			restitution: 1.4,
			label: "slingshot",
			angle
		});
		const gfx = this.add.graphics().setDepth(5);
		gfx.fillStyle(16737792, 1);
		gfx.lineStyle(2, 16755200, 1);
		gfx.fillRoundedRect(-w / 2, -h / 2, w, h, 7);
		gfx.strokeRoundedRect(-w / 2, -h / 2, w, h, 7);
		gfx.x = x;
		gfx.y = y;
		gfx.rotation = angle;
		this.add.text(x + (isLeft ? -30 : 30), y - 12, isLeft ? "◀" : "▶", {
			fontSize: "12px",
			color: "#ffaa00"
		}).setOrigin(.5).setDepth(6);
		return body;
	}
	_buildTargetLights() {
		this.lights = [];
		[
			80,
			160,
			240,
			320,
			400
		].forEach((x, i) => {
			const circle = this.add.graphics().setDepth(4);
			circle.fillStyle(2241365, 1);
			circle.lineStyle(2, 58879, .4);
			circle.fillCircle(0, 0, 10);
			circle.strokeCircle(0, 0, 10);
			circle.x = x;
			circle.y = 60;
			this.lights.push({
				gfx: circle,
				x,
				lit: false
			});
		});
	}
	_buildUI() {
		this.scoreLbl = this.add.text(16, 16, "SCORE", {
			fontSize: "11px",
			color: "#4488cc",
			fontFamily: "Arial",
			fontStyle: "bold"
		}).setDepth(20);
		this.scoreVal = this.add.text(16, 30, "0", {
			fontSize: "28px",
			color: "#ffffff",
			fontFamily: "Courier New, monospace",
			fontStyle: "bold"
		}).setDepth(20);
		this.ballsLbl = this.add.text(W - 16, 16, "BALLS", {
			fontSize: "11px",
			color: "#4488cc",
			fontFamily: "Arial",
			fontStyle: "bold"
		}).setOrigin(1, 0).setDepth(20);
		this.ballsVal = this.add.text(W - 16, 30, "● ● ●", {
			fontSize: "18px",
			color: "#ff2d6f",
			fontFamily: "Arial"
		}).setOrigin(1, 0).setDepth(20);
		this.chainPanel = this.add.graphics().setDepth(15);
		this._drawChainPanel();
		this.chainText = this.add.text(W / 2, H - 180, "", {
			fontSize: "20px",
			color: "#00e5ff",
			fontFamily: "Courier New, monospace",
			fontStyle: "bold",
			stroke: "#001122",
			strokeThickness: 3,
			align: "center"
		}).setOrigin(.5).setDepth(16);
		this.hintText = this.add.text(W / 2, H - 155, "Hit bumpers to build math chain!", {
			fontSize: "11px",
			color: "#4488cc",
			fontFamily: "Arial",
			align: "center"
		}).setOrigin(.5).setDepth(16);
		this.flashText = this.add.text(W / 2, H / 2 - 60, "", {
			fontSize: "36px",
			color: "#ffe000",
			fontFamily: "Courier New, monospace",
			fontStyle: "bold",
			stroke: "#000000",
			strokeThickness: 6,
			align: "center"
		}).setOrigin(.5).setDepth(30).setAlpha(0);
		this.tiltText = this.add.text(W / 2, H / 2, "TILT!", {
			fontSize: "64px",
			color: "#ff0000",
			fontFamily: "Courier New, monospace",
			fontStyle: "bold",
			stroke: "#000000",
			strokeThickness: 8
		}).setOrigin(.5).setDepth(40).setAlpha(0);
		this.gameOverText = this.add.text(W / 2, H / 2 - 40, "GAME OVER", {
			fontSize: "52px",
			color: "#ff2d6f",
			fontFamily: "Courier New, monospace",
			fontStyle: "bold",
			stroke: "#000000",
			strokeThickness: 8
		}).setOrigin(.5).setDepth(40).setAlpha(0);
		this.finalScoreText = this.add.text(W / 2, H / 2 + 30, "", {
			fontSize: "28px",
			color: "#ffffff",
			fontFamily: "Courier New, monospace"
		}).setOrigin(.5).setDepth(40).setAlpha(0);
	}
	_drawChainPanel() {
		const g = this.chainPanel;
		g.clear();
		g.fillStyle(526360, .85);
		g.lineStyle(2, 58879, .5);
		g.fillRoundedRect(20, H - 200, W - 40, 50, 8);
		g.strokeRoundedRect(20, H - 200, W - 40, 50, 8);
	}
	_setupParticles() {
		this.burstEmitter = this.add.particles(0, 0, "dot", {
			speed: {
				min: 80,
				max: 350
			},
			lifespan: {
				min: 400,
				max: 900
			},
			scale: {
				start: 1.2,
				end: 0
			},
			alpha: {
				start: 1,
				end: 0
			},
			blendMode: "ADD",
			emitting: false,
			quantity: 0
		}).setDepth(50);
		this.trailEmitter = this.add.particles(0, 0, "dot", {
			speed: 0,
			lifespan: 200,
			scale: {
				start: .6,
				end: 0
			},
			alpha: {
				start: .4,
				end: 0
			},
			tint: [
				58879,
				16723311,
				16769024
			],
			blendMode: "ADD"
		}).setDepth(8);
		this.superEmitter = this.add.particles(0, 0, "dot", {
			speed: {
				min: 200,
				max: 600
			},
			lifespan: {
				min: 600,
				max: 1400
			},
			scale: {
				start: 2,
				end: 0
			},
			alpha: {
				start: 1,
				end: 0
			},
			tint: [
				16769024,
				16746496,
				16777215
			],
			blendMode: "ADD",
			emitting: false,
			quantity: 0
		}).setDepth(50);
	}
	_setupInput() {
		this.cursors = this.input.keyboard.createCursorKeys();
		this.keyZ = this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.Z);
		this.keyX = this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.X);
		this.keySpace = this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.SPACE);
		this.keyShiftL = this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.SHIFT);
		this.input.keyboard.on("keydown", (event) => {
			if (!this.awaitingAnswer) return;
			if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode === 189 || event.keyCode === 109) {
				const ch = event.key;
				if (ch === "-" && this.answerBuffer.length === 0) this.answerBuffer = "-";
				else if (/\d/.test(ch)) this.answerBuffer += ch;
				this._emitUI();
			} else if (event.keyCode === 8) {
				this.answerBuffer = this.answerBuffer.slice(0, -1);
				this._emitUI();
			} else if (event.keyCode === 13) this._checkAnswer();
		});
	}
	_setupCollisions() {
		this.matter.world.on("collisionstart", (event) => {
			event.pairs.forEach((pair) => {
				const { bodyA, bodyB } = pair;
				this._handleCollision(bodyA, bodyB);
				this._handleCollision(bodyB, bodyA);
			});
		});
	}
	_handleCollision(a, b) {
		if (a.label === "bumper" && b.label === "ball") {
			const bumperIdx = this.bumpers.findIndex((bu) => bu.body === a);
			if (bumperIdx >= 0) this._hitBumper(bumperIdx);
		}
		if (a.label === "slingshot" && b.label === "ball") this._hitSlingshot(a);
	}
	_hitBumper(idx) {
		const bu = this.bumpers[idx];
		if (!bu) return;
		this.score += 150;
		this._updateScoreDisplay();
		this._appendChain(bu.op);
		bu.img.setTint(65535);
		this.time.delayedCall(120, () => bu.img.clearTint());
		this.tweens.add({
			targets: [bu.img, bu.txt],
			scale: 1.4,
			duration: 80,
			yoyo: true,
			ease: "Bounce.Out"
		});
		if (bu.glowTween) bu.glowTween.stop();
		bu.glow.clear();
		bu.glow.lineStyle(10, 58879, .9);
		bu.glow.strokeCircle(bu.pos.x, bu.pos.y, 42);
		bu.glowTween = this.tweens.add({
			targets: bu.glow,
			alpha: 0,
			duration: 400,
			ease: "Cubic.Out",
			onComplete: () => {
				bu.glow.setAlpha(1);
				bu.glow.clear();
				bu.glow.lineStyle(6, 58879, .3);
				bu.glow.strokeCircle(bu.pos.x, bu.pos.y, 42);
			}
		});
		this.burstEmitter.setParticleTint(58879);
		this.burstEmitter.emitParticleAt(bu.pos.x, bu.pos.y, 18);
		this.cameras.main.shake(80, .006);
		this._lightNext();
	}
	_hitSlingshot(body) {
		this.score += 50;
		this._updateScoreDisplay();
		this.cameras.main.shake(60, .004);
		this.burstEmitter.setParticleTint(16737792);
		this.burstEmitter.emitParticleAt(body.position.x, body.position.y, 8);
	}
	_appendChain(op) {
		if (this.awaitingAnswer) return;
		const len = this.chain.length;
		if (len === 0) {
			const num = randInt(1, 9);
			this.chain.push(num);
			this.chain.push(op);
		} else if (len % 2 === 1) {
			const num = randInt(1, 9);
			this.chain.push(num);
			if (this.chain.length >= 5) {
				this._completeChain();
				return;
			}
			this.chain.push(op);
		} else this.chain[this.chain.length - 1] = op;
		this._updateChainDisplay();
	}
	_completeChain() {
		const a = this.chain[0];
		const op1 = this.chain[1];
		const b = this.chain[2];
		const op2 = this.chain[3];
		const c = this.chain[4];
		let partial;
		if (op1 === "+") partial = a + b;
		else if (op1 === "-") partial = a - b;
		else if (op1 === "*") partial = a * b;
		else partial = parseFloat((a / b).toFixed(1));
		let result;
		if (op2 === "+") result = partial + c;
		else if (op2 === "-") result = partial - c;
		else if (op2 === "*") result = partial * c;
		else result = parseFloat((partial / c).toFixed(1));
		this.correctAnswer = Math.round(result);
		this.awaitingAnswer = true;
		this.answerBuffer = "";
		this._updateChainDisplay();
		this._showFlash(`= ?  Type the answer!\nPress ENTER to confirm`, 16769024, 0);
		this._emitUI();
		this.tweens.add({
			targets: this.chainText,
			scale: 1.1,
			duration: 200,
			yoyo: true,
			repeat: 3
		});
	}
	_checkAnswer() {
		if (!this.awaitingAnswer) return;
		const attempt = parseInt(this.answerBuffer, 10);
		if (isNaN(attempt)) return;
		if (attempt === this.correctAnswer) {
			const bonus = 2e3 + this.chain.length * 200;
			this.score += bonus;
			this._updateScoreDisplay();
			this._showFlash(`CORRECT! +${bonus} SUPER BONUS!`, 65416, 2e3);
			this.cameras.main.shake(300, .018);
			this.cameras.main.flash(400, 0, 255, 100);
			this.superEmitter.emitParticleAt(W / 2, H / 2, 60);
		} else {
			this._showFlash(`WRONG! Answer was ${this.correctAnswer}`, 16723311, 2e3);
			this.cameras.main.shake(200, .012);
			this.cameras.main.flash(300, 255, 0, 0);
		}
		this.chain = [];
		this.awaitingAnswer = false;
		this.correctAnswer = null;
		this.answerBuffer = "";
		this._updateChainDisplay();
		this._emitUI();
	}
	_updateChainDisplay() {
		if (this.chain.length === 0) {
			this.chainText.setText("");
			this.hintText.setText("Hit bumpers to build math chain!");
			return;
		}
		const expr = this.chain.join(" ");
		if (this.awaitingAnswer) {
			this.chainText.setText(expr + " = ?");
			this.hintText.setText(`Type your answer, then press ENTER   [${this.answerBuffer || "_"}]`);
			this.chainText.setColor("#ffe000");
		} else {
			this.chainText.setText(expr);
			this.hintText.setText("Keep hitting bumpers to complete the equation!");
			this.chainText.setColor("#00e5ff");
		}
	}
	_spawnBall() {
		if (this.ball) {
			try {
				this.matter.world.remove(this.ball.body);
			} catch (e) {}
			this.ball.destroy();
		}
		this.ball = this.matter.add.image(this.plungerLaneX, H - 140, "ball", null, {
			restitution: .55,
			friction: .001,
			frictionAir: .002,
			density: .06,
			label: "ball",
			collisionFilter: {
				category: 1,
				mask: 65533
			}
		});
		this.ball.setCircle(15);
		this.trailEmitter.startFollow(this.ball);
		this.ballInPlay = false;
		this.ballLost = false;
		this.plungerCharge = 0;
		this.plungerCharging = false;
		this._drawPlunger(0);
	}
	_launchBall(charge) {
		if (!this.ball || this.ballInPlay) return;
		const force = -.028 * (.3 + charge * .7);
		this.ball.applyForce({
			x: 0,
			y: force
		});
		this.ballInPlay = true;
		this._showFlash("LAUNCH!", 16769024, 800);
	}
	_lightNext() {
		const unlit = this.lights.filter((l) => !l.lit);
		if (unlit.length === 0) {
			this.score += 1e3;
			this._updateScoreDisplay();
			this._showFlash("ALL LIGHTS! +1000!", 16769024, 1500);
			this.lights.forEach((l) => {
				l.lit = false;
				l.gfx.clear();
				l.gfx.fillStyle(2241365, 1);
				l.gfx.lineStyle(2, 58879, .4);
				l.gfx.fillCircle(0, 0, 10);
				l.gfx.strokeCircle(0, 0, 10);
			});
			return;
		}
		const pick = unlit[Math.floor(Math.random() * unlit.length)];
		pick.lit = true;
		pick.gfx.clear();
		pick.gfx.fillStyle(16769024, 1);
		pick.gfx.fillCircle(0, 0, 10);
		pick.gfx.lineStyle(2, 16777215, .8);
		pick.gfx.strokeCircle(0, 0, 10);
	}
	_triggerTilt() {
		if (this.tiltCooldown > 0) return;
		this.tiltCooldown = 180;
		this.tiltText.setAlpha(1);
		this.tweens.add({
			targets: this.tiltText,
			alpha: 0,
			duration: 1200,
			ease: "Cubic.In"
		});
		this.matter.world.setGravity(0, GRAVITY * 2.5);
		this.time.delayedCall(800, () => {
			this.matter.world.setGravity(0, GRAVITY);
		});
		this.tiltActive = true;
		this.time.delayedCall(1500, () => {
			this.tiltActive = false;
		});
		this.cameras.main.shake(400, .022);
		this.score = Math.max(0, this.score - 200);
		this._updateScoreDisplay();
	}
	_ballLost() {
		if (this.ballLost) return;
		this.ballLost = true;
		this.ballInPlay = false;
		this.trailEmitter.stopFollow();
		this.cameras.main.shake(250, .014);
		this.cameras.main.flash(500, 255, 0, 50);
		this.ballsLeft--;
		this._updateBallsDisplay();
		if (this.chain.length > 0) {
			this.chain = [];
			this.awaitingAnswer = false;
			this.answerBuffer = "";
			this.correctAnswer = null;
			this._updateChainDisplay();
			this._emitUI();
		}
		if (this.ballsLeft <= 0) {
			this._gameOver();
			return;
		}
		this._showFlash("BALL LOST!", 16723311, 1500);
		this.time.delayedCall(1800, () => {
			this._spawnBall();
		});
	}
	_gameOver() {
		this.scene.pause();
		this.gameOverText.setAlpha(1);
		this.finalScoreText.setText(`Final Score: ${this.score.toLocaleString()}`).setAlpha(1);
		this.tweens.add({
			targets: [this.gameOverText, this.finalScoreText],
			scale: {
				from: .5,
				to: 1
			},
			alpha: {
				from: 0,
				to: 1
			},
			duration: 600,
			ease: "Back.Out"
		});
		this.superEmitter.emitParticleAt(W / 2, H / 2, 80);
		this.cameras.main.flash(1e3, 255, 0, 50);
		this._emitUI();
	}
	_showFlash(msg, color, duration = 1200) {
		this.flashText.setText(msg).setColor(__webpack_exports__default.Display.Color.ValueToColor(color).rgba).setAlpha(1);
		if (duration > 0) this.time.delayedCall(duration, () => {
			this.tweens.add({
				targets: this.flashText,
				alpha: 0,
				duration: 400
			});
		});
	}
	_updateScoreDisplay() {
		this.scoreVal.setText(this.score.toLocaleString());
	}
	_updateBallsDisplay() {
		const dots = [
			"●",
			"●",
			"●"
		].map((d, i) => i < this.ballsLeft ? d : "○").join(" ");
		this.ballsVal.setText(dots);
	}
	_emitUI() {
		this.events.emit("updateUI", {
			score: this.score,
			ballsLeft: this.ballsLeft,
			chain: [...this.chain],
			awaitingAnswer: this.awaitingAnswer,
			answerBuffer: this.answerBuffer,
			correctAnswer: this.correctAnswer,
			gameOver: this.ballsLeft <= 0
		});
	}
	update(time, delta) {
		if (!this.ball) return;
		if (!this.ballInPlay) {
			if (__webpack_exports__default.Input.Keyboard.JustDown(this.keySpace)) this.plungerCharging = true;
			if (this.plungerCharging) {
				this.plungerCharge = Math.min(1, this.plungerCharge + delta / 1200);
				this._drawPlunger(this.plungerCharge);
			}
			if (__webpack_exports__default.Input.Keyboard.JustUp(this.keySpace) && this.plungerCharging) {
				this._launchBall(this.plungerCharge);
				this.plungerCharge = 0;
				this.plungerCharging = false;
				this._drawPlunger(0);
			}
		}
		const lFlipDown = !this.tiltActive && (this.cursors.left.isDown || this.keyZ.isDown);
		const rFlipDown = !this.tiltActive && (this.cursors.right.isDown || this.keyX.isDown);
		if (lFlipDown) this.leftFlipper.setAngularVelocity(-.38);
		else this.leftFlipper.setAngularVelocity(.18);
		if (rFlipDown) this.rightFlipper.setAngularVelocity(.38);
		else this.rightFlipper.setAngularVelocity(-.18);
		if (__webpack_exports__default.Input.Keyboard.JustDown(this.keyShiftL)) this._triggerTilt();
		if (this.tiltCooldown > 0) this.tiltCooldown--;
		if (this.ballInPlay && this.ball.y > H + 30) this._ballLost();
		if (!this.ballInPlay && this.ball) {
			this.matter.body.setPosition(this.ball.body, {
				x: this.plungerLaneX,
				y: this.ball.y
			});
			this.matter.body.setVelocity(this.ball.body, {
				x: 0,
				y: 0
			});
		}
		const t = time / 2e3;
		this.bumpers.forEach((bu, i) => {
			bu.txt.setScale(1 + .05 * Math.sin(t + i));
		});
		if (this.awaitingAnswer) this._updateChainDisplay();
	}
};
var FaskaPinballSwarm = ({ onExit }) => {
	const gameRef = (0, import_react.useRef)(null);
	const phaserRef = (0, import_react.useRef)(null);
	const [uiState, setUiState] = (0, import_react.useState)({
		score: 0,
		ballsLeft: MAX_BALLS,
		chain: [],
		awaitingAnswer: false,
		answerBuffer: "",
		correctAnswer: null,
		gameOver: false
	});
	const handleRestart = (0, import_react.useCallback)(() => {
		if (phaserRef.current) {
			phaserRef.current.scene.stop("PinballSwarmScene");
			phaserRef.current.scene.start("PinballSwarmScene");
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!gameRef.current) return;
		const config = {
			type: __webpack_exports__default.AUTO,
			width: W,
			height: H,
			parent: gameRef.current,
			backgroundColor: "#05050f",
			physics: {
				default: "matter",
				matter: {
					gravity: { y: GRAVITY },
					debug: false
				}
			},
			scene: PinballSwarmScene,
			scale: {
				mode: __webpack_exports__default.Scale.FIT,
				autoCenter: __webpack_exports__default.Scale.CENTER_BOTH
			}
		};
		const game = new __webpack_exports__default.Game(config);
		phaserRef.current = game;
		game.events.on("ready", () => {
			const scene = game.scene.getScene("PinballSwarmScene");
			if (scene) scene._uiBridge = (data) => setUiState({ ...data });
		});
		return () => {
			game.destroy(true);
			phaserRef.current = null;
		};
	}, []);
	const keyHelp = "← / Z = Left Flipper   → / X = Right Flipper   SPACE = Plunger   SHIFT = Tilt   ENTER = Submit Answer";
	const chainDisplay = uiState.chain.join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: `${W}px`,
			height: `${H}px`,
			margin: "0 auto",
			fontFamily: "Courier New, monospace",
			userSelect: "none",
			background: "#05050f",
			borderRadius: "12px",
			overflow: "hidden",
			boxShadow: "0 0 60px rgba(0,229,255,0.25), 0 0 120px rgba(0,229,255,0.1)"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: gameRef,
				style: {
					width: "100%",
					height: "100%"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					top: "12px",
					right: "12px",
					zIndex: 100,
					padding: "7px 18px",
					fontSize: "14px",
					fontWeight: "bold",
					fontFamily: "Arial, sans-serif",
					background: "linear-gradient(135deg, #ff2d6f, #cc0044)",
					color: "#fff",
					border: "2px solid rgba(255,255,255,0.4)",
					borderRadius: "8px",
					cursor: "pointer",
					boxShadow: "0 0 14px rgba(255,45,111,0.6)",
					letterSpacing: "1px",
					textTransform: "uppercase",
					transition: "transform 0.1s, box-shadow 0.1s"
				},
				onMouseEnter: (e) => {
					e.currentTarget.style.transform = "scale(1.08)";
					e.currentTarget.style.boxShadow = "0 0 24px rgba(255,45,111,0.9)";
				},
				onMouseLeave: (e) => {
					e.currentTarget.style.transform = "scale(1)";
					e.currentTarget.style.boxShadow = "0 0 14px rgba(255,45,111,0.6)";
				},
				children: "Beenden"
			}),
			uiState.awaitingAnswer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					bottom: "210px",
					left: "50%",
					transform: "translateX(-50%)",
					zIndex: 90,
					background: "rgba(5,5,20,0.92)",
					border: "2px solid #ffe000",
					borderRadius: "12px",
					padding: "12px 24px",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "8px",
					boxShadow: "0 0 30px rgba(255,224,0,0.5)",
					minWidth: "260px"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#ffe000",
							fontSize: "13px",
							fontWeight: "bold",
							letterSpacing: "1px"
						},
						children: "🔢 SOLVE THE EQUATION"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							color: "#00e5ff",
							fontSize: "20px",
							fontWeight: "bold"
						},
						children: [chainDisplay, " = ?"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							background: "#0a0a1f",
							border: "2px solid #00e5ff",
							borderRadius: "8px",
							padding: "6px 18px",
							color: "#ffffff",
							fontSize: "28px",
							fontWeight: "bold",
							minWidth: "80px",
							textAlign: "center",
							letterSpacing: "2px"
						},
						children: uiState.answerBuffer || "?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#4488cc",
							fontSize: "11px"
						},
						children: "Type answer → press ENTER"
					})
				]
			}),
			uiState.gameOver && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					inset: 0,
					zIndex: 80,
					background: "rgba(5,5,20,0.75)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: "16px"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: "54px",
							fontWeight: "bold",
							color: "#ff2d6f",
							textShadow: "0 0 30px #ff2d6f",
							letterSpacing: "2px"
						},
						children: "GAME OVER"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							fontSize: "26px",
							color: "#ffffff"
						},
						children: ["Final Score: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: { color: "#ffe000" },
							children: uiState.score.toLocaleString()
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleRestart,
						style: {
							padding: "10px 32px",
							fontSize: "18px",
							fontWeight: "bold",
							background: "linear-gradient(135deg, #00e5ff, #0077ff)",
							color: "#fff",
							border: "none",
							borderRadius: "10px",
							cursor: "pointer",
							boxShadow: "0 0 20px rgba(0,229,255,0.6)",
							letterSpacing: "1px",
							marginTop: "8px"
						},
						children: "PLAY AGAIN"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onExit,
						style: {
							padding: "8px 24px",
							fontSize: "14px",
							background: "rgba(255,255,255,0.1)",
							color: "#aaa",
							border: "1px solid rgba(255,255,255,0.2)",
							borderRadius: "8px",
							cursor: "pointer"
						},
						children: "Beenden"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					zIndex: 50,
					background: "rgba(5,5,20,0.85)",
					borderTop: "1px solid rgba(0,229,255,0.2)",
					padding: "4px 8px",
					fontSize: "9px",
					color: "#4488cc",
					textAlign: "center",
					letterSpacing: "0.5px",
					fontFamily: "Arial, sans-serif"
				},
				children: keyHelp
			})
		]
	});
};
//#endregion
export { FaskaPinballSwarm as default };
