import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaSoccerSwarm/FaskaSoccerSwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var makeTextures = (scene) => {
	const gfx = scene.add.graphics();
	gfx.clear();
	gfx.fillStyle(35071, .3);
	gfx.fillCircle(25, 25, 25);
	gfx.fillStyle(35071, 1);
	gfx.fillCircle(25, 25, 18);
	gfx.lineStyle(2, 16777215, 1);
	gfx.strokeCircle(25, 25, 18);
	gfx.fillStyle(65535, 1);
	gfx.fillCircle(38, 25, 6);
	gfx.generateTexture("player", 50, 50);
	gfx.clear();
	gfx.fillStyle(16724787, .3);
	gfx.fillCircle(25, 25, 25);
	gfx.fillStyle(16724787, 1);
	gfx.fillCircle(25, 25, 18);
	gfx.lineStyle(2, 16777215, 1);
	gfx.strokeCircle(25, 25, 18);
	gfx.fillStyle(16755200, 1);
	gfx.fillCircle(38, 25, 6);
	gfx.generateTexture("opponent", 50, 50);
	gfx.clear();
	gfx.fillStyle(16777215, 1);
	gfx.fillCircle(18, 18, 18);
	gfx.lineStyle(2, 0, 1);
	gfx.strokeCircle(18, 18, 18);
	gfx.beginPath();
	gfx.moveTo(12, 6);
	gfx.lineTo(24, 6);
	gfx.lineTo(30, 18);
	gfx.lineTo(24, 30);
	gfx.lineTo(12, 30);
	gfx.lineTo(6, 18);
	gfx.closePath();
	gfx.strokePath();
	gfx.beginPath();
	gfx.moveTo(18, 18);
	gfx.lineTo(6, 18);
	gfx.moveTo(18, 18);
	gfx.lineTo(26, 10);
	gfx.moveTo(18, 18);
	gfx.lineTo(26, 26);
	gfx.strokePath();
	gfx.generateTexture("ball", 36, 36);
	gfx.clear();
	gfx.fillStyle(16777215, 1);
	gfx.fillCircle(6, 6, 6);
	gfx.lineStyle(2, 11184810, 1);
	gfx.strokeCircle(6, 6, 6);
	gfx.generateTexture("post", 12, 12);
	gfx.clear();
	gfx.fillStyle(16777215, 1);
	gfx.fillCircle(4, 4, 4);
	gfx.generateTexture("particle", 8, 8);
	gfx.destroy();
};
var MainScene = class extends __webpack_exports__default.Scene {
	constructor() {
		super({ key: "MainScene" });
	}
	create() {
		makeTextures(this);
		this.playerScore = 0;
		this.aiScore = 0;
		this.isScoring = false;
		for (let i = 0; i < 600; i += 50) this.add.rectangle(400, i + 25, 800, 50, i / 50 % 2 === 0 ? 2263842 : 1998110);
		const lines = this.add.graphics();
		lines.lineStyle(4, 16777215, .6);
		lines.beginPath();
		lines.moveTo(400, 0);
		lines.lineTo(400, 600);
		lines.strokePath();
		lines.strokeCircle(400, 300, 70);
		lines.strokeRect(0, 150, 150, 300);
		lines.strokeRect(650, 150, 150, 300);
		const leftNet = this.add.graphics();
		leftNet.lineStyle(2, 16777215, .3);
		for (let i = 230; i <= 370; i += 12) {
			leftNet.moveTo(0, i);
			leftNet.lineTo(50, i);
		}
		for (let i = 0; i <= 50; i += 12) {
			leftNet.moveTo(i, 230);
			leftNet.lineTo(i, 370);
		}
		leftNet.strokePath();
		const rightNet = this.add.graphics();
		rightNet.lineStyle(2, 16777215, .3);
		for (let i = 230; i <= 370; i += 12) {
			rightNet.moveTo(750, i);
			rightNet.lineTo(800, i);
		}
		for (let i = 750; i <= 800; i += 12) {
			rightNet.moveTo(i, 230);
			rightNet.lineTo(i, 370);
		}
		rightNet.strokePath();
		this.add.text(400, 300, "FASKA SOCCER SWARM", {
			fontSize: "50px",
			fill: "#ffffff",
			fontStyle: "bold",
			alpha: .1
		}).setOrigin(.5);
		this.physics.world.setBounds(0, 0, 800, 600);
		const netWalls = this.physics.add.staticGroup();
		const makeNetWall = (x, y, w, h) => {
			const wall = this.add.rectangle(x, y, w, h, 0, 0);
			this.physics.add.existing(wall, true);
			netWalls.add(wall);
		};
		makeNetWall(25, 225, 50, 10);
		makeNetWall(25, 375, 50, 10);
		makeNetWall(775, 225, 50, 10);
		makeNetWall(775, 375, 50, 10);
		this.posts = this.physics.add.staticGroup();
		this.posts.create(50, 230, "post").setCircle(6);
		this.posts.create(50, 370, "post").setCircle(6);
		this.posts.create(750, 230, "post").setCircle(6);
		this.posts.create(750, 370, "post").setCircle(6);
		this.player = this.physics.add.sprite(200, 300, "player");
		this.player.setCircle(18, 7, 7);
		this.player.setCollideWorldBounds(true);
		this.player.setDrag(1200);
		this.player.setMaxVelocity(280);
		this.player.setBounce(.2);
		this.ai = this.physics.add.sprite(600, 300, "opponent");
		this.ai.setCircle(18, 7, 7);
		this.ai.setCollideWorldBounds(true);
		this.ai.setDrag(1200);
		this.ai.setMaxVelocity(200);
		this.ai.setBounce(.2);
		this.ball = this.physics.add.sprite(400, 300, "ball");
		this.ball.setCircle(18);
		this.ball.setCollideWorldBounds(true);
		this.ball.setBounce(.8, .8);
		this.ball.setDrag(150, 150);
		this.ball.setAngularDrag(200);
		this.physics.add.collider(this.player, this.ball);
		this.physics.add.collider(this.ai, this.ball);
		this.physics.add.collider(this.player, this.ai);
		const walls = [netWalls, this.posts];
		this.physics.add.collider(this.ball, walls);
		this.physics.add.collider(this.player, walls);
		this.physics.add.collider(this.ai, walls);
		this.leftGoalArea = this.add.rectangle(25, 300, 40, 130, 16777215, 0);
		this.physics.add.existing(this.leftGoalArea, true);
		this.rightGoalArea = this.add.rectangle(775, 300, 40, 130, 16777215, 0);
		this.physics.add.existing(this.rightGoalArea, true);
		this.physics.add.overlap(this.ball, this.leftGoalArea, this.scoreGoalLeft, null, this);
		this.physics.add.overlap(this.ball, this.rightGoalArea, this.scoreGoalRight, null, this);
		this.leftGoalText = this.add.text(100, 300, "", {
			fontSize: "36px",
			fill: "#ffff00",
			fontStyle: "bold",
			stroke: "#000",
			strokeThickness: 6
		}).setOrigin(.5);
		this.rightGoalText = this.add.text(700, 300, "", {
			fontSize: "36px",
			fill: "#ffff00",
			fontStyle: "bold",
			stroke: "#000",
			strokeThickness: 6
		}).setOrigin(.5);
		this.ballTextBg = this.add.circle(400, 300, 16, 0, .6);
		this.ballText = this.add.text(400, 300, "", {
			fontSize: "20px",
			fill: "#ffffff",
			fontStyle: "bold"
		}).setOrigin(.5);
		this.add.rectangle(400, 40, 240, 70, 0, .7).setStrokeStyle(4, 16777215);
		this.scoreText = this.add.text(400, 45, "0 - 0", {
			fontSize: "40px",
			fill: "#ffffff",
			fontStyle: "bold"
		}).setOrigin(.5);
		this.add.text(310, 15, "PLAYER", {
			fontSize: "16px",
			fill: "#0088ff",
			fontStyle: "bold"
		}).setOrigin(.5);
		this.add.text(490, 15, "AI", {
			fontSize: "16px",
			fill: "#ff3333",
			fontStyle: "bold"
		}).setOrigin(.5);
		this.particles = this.add.particles(0, 0, "particle", {
			speed: {
				min: 100,
				max: 300
			},
			scale: {
				start: 1,
				end: 0
			},
			lifespan: 600,
			blendMode: "ADD",
			emitting: false
		});
		this.ballTrail = this.add.particles(0, 0, "particle", {
			scale: {
				start: .6,
				end: 0
			},
			alpha: {
				start: .4,
				end: 0
			},
			lifespan: 300,
			blendMode: "ADD",
			emitting: false
		});
		this.ballTrail.startFollow(this.ball);
		this.cursors = this.input.keyboard.addKeys("W,A,S,D,SPACE");
		this.generateMath();
	}
	generateMath() {
		const a = __webpack_exports__default.Math.Between(1, 10);
		const b = __webpack_exports__default.Math.Between(1, 10);
		const isAddition = __webpack_exports__default.Math.Between(0, 1) === 0;
		let equation = "";
		let answer = 0;
		if (isAddition) {
			equation = `${a}+${b}`;
			answer = a + b;
		} else {
			const max = Math.max(a, b);
			const min = Math.min(a, b);
			equation = `${max}-${min}`;
			answer = max - min;
		}
		let wrongAnswer = answer + __webpack_exports__default.Math.Between(1, 4) * (__webpack_exports__default.Math.Between(0, 1) === 0 ? 1 : -1);
		if (wrongAnswer === answer) wrongAnswer += 1;
		this.currentEquation = equation;
		this.currentAnswer = answer;
		this.ballText.setText(equation);
		if (__webpack_exports__default.Math.Between(0, 1) === 0) {
			this.leftGoalAnswer = answer;
			this.rightGoalAnswer = wrongAnswer;
		} else {
			this.leftGoalAnswer = wrongAnswer;
			this.rightGoalAnswer = answer;
		}
		this.leftGoalText.setText(this.leftGoalAnswer);
		this.rightGoalText.setText(this.rightGoalAnswer);
		this.resetPositions();
	}
	resetPositions() {
		this.ball.setPosition(400, 300);
		this.ball.setVelocity(0, 0);
		this.ball.setAngularVelocity(0);
		this.player.setPosition(200, 300);
		this.player.setVelocity(0, 0);
		this.ai.setPosition(600, 300);
		this.ai.setVelocity(0, 0);
		this.isScoring = false;
	}
	scoreGoalLeft() {
		if (this.isScoring) return;
		this.isScoring = true;
		this.handleScore(this.leftGoalAnswer === this.currentAnswer, 25, 300);
	}
	scoreGoalRight() {
		if (this.isScoring) return;
		this.isScoring = true;
		this.handleScore(this.rightGoalAnswer === this.currentAnswer, 775, 300);
	}
	handleScore(isCorrect, x, y) {
		this.cameras.main.shake(300, .02);
		this.particles.emitParticleAt(x, y, 60);
		this.ball.setVelocity(0, 0);
		this.player.setVelocity(0, 0);
		this.ai.setVelocity(0, 0);
		if (isCorrect) {
			this.playerScore++;
			this.soundAlert("PUNKT FÜR DICH!", 65280, 400, 200);
		} else {
			this.aiScore++;
			this.soundAlert("PUNKT FÜR AI!", 16711680, 400, 200);
		}
		this.scoreText.setText(`${this.playerScore} - ${this.aiScore}`);
		this.time.delayedCall(2e3, () => {
			this.generateMath();
		});
	}
	soundAlert(text, color, x, y) {
		const t = this.add.text(x, y, text, {
			fontSize: "48px",
			fill: "#fff",
			fontStyle: "bold",
			stroke: "#000",
			strokeThickness: 8
		}).setOrigin(.5);
		t.setTint(color);
		this.tweens.add({
			targets: t,
			y: y - 100,
			alpha: 0,
			duration: 1500,
			ease: "Power2",
			onComplete: () => t.destroy()
		});
	}
	update(time, delta) {
		this.ballTextBg.setPosition(this.ball.x, this.ball.y);
		this.ballText.setPosition(this.ball.x, this.ball.y);
		if (this.ball.body.velocity.length() > 150) this.ballTrail.emitting = true;
		else this.ballTrail.emitting = false;
		if (this.isScoring) return;
		const speed = 250;
		let vx = 0;
		let vy = 0;
		if (this.cursors.W.isDown) vy = -speed;
		if (this.cursors.S.isDown) vy = speed;
		if (this.cursors.A.isDown) vx = -speed;
		if (this.cursors.D.isDown) vx = speed;
		this.player.setAcceleration(vx * 6, vy * 6);
		if (vx !== 0 || vy !== 0) this.player.setRotation(Math.atan2(vy, vx));
		if (__webpack_exports__default.Input.Keyboard.JustDown(this.cursors.SPACE)) {
			if (__webpack_exports__default.Math.Distance.Between(this.player.x, this.player.y, this.ball.x, this.ball.y) < 65) {
				const angle = __webpack_exports__default.Math.Angle.Between(this.player.x, this.player.y, this.ball.x, this.ball.y);
				this.ball.setVelocity(Math.cos(angle) * 700, Math.sin(angle) * 700);
				this.cameras.main.shake(150, .01);
				this.particles.emitParticleAt(this.ball.x, this.ball.y, 15);
				this.player.setTintFill(16777215);
				this.time.delayedCall(100, () => this.player.clearTint());
			}
		}
		const distToBall = __webpack_exports__default.Math.Distance.Between(this.ai.x, this.ai.y, this.ball.x, this.ball.y);
		const aiSpeed = 200;
		let aiTargetGoalX = this.leftGoalAnswer === this.currentAnswer ? 775 : 25;
		let targetX = this.ball.x;
		let targetY = this.ball.y;
		if (distToBall > 45) {
			const angleToGoal = __webpack_exports__default.Math.Angle.Between(this.ball.x, this.ball.y, aiTargetGoalX, 300);
			targetX = this.ball.x - Math.cos(angleToGoal) * 40;
			targetY = this.ball.y - Math.sin(angleToGoal) * 40;
		}
		const aiAngle = __webpack_exports__default.Math.Angle.Between(this.ai.x, this.ai.y, targetX, targetY);
		if (__webpack_exports__default.Math.Distance.Between(this.ai.x, this.ai.y, targetX, targetY) > 15) {
			this.ai.setAcceleration(Math.cos(aiAngle) * aiSpeed * 5, Math.sin(aiAngle) * aiSpeed * 5);
			this.ai.setRotation(aiAngle);
		} else this.ai.setAcceleration(0, 0);
		if (distToBall < 60 && Math.random() < .04) {
			const angleToGoal = __webpack_exports__default.Math.Angle.Between(this.ai.x, this.ai.y, aiTargetGoalX, 300);
			this.ball.setVelocity(Math.cos(angleToGoal) * 550, Math.sin(angleToGoal) * 550);
			this.cameras.main.shake(100, .005);
			this.particles.emitParticleAt(this.ball.x, this.ball.y, 10);
			this.ai.setTintFill(16777215);
			this.time.delayedCall(100, () => this.ai.clearTint());
		}
	}
};
var FaskaSoccerSwarm = ({ onExit }) => {
	const gameRef = (0, import_react.useRef)(null);
	const gameInstanceRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
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
			scene: MainScene
		};
		gameInstanceRef.current = new __webpack_exports__default.Game(config);
		return () => {
			if (gameInstanceRef.current) gameInstanceRef.current.destroy(true);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "800px",
			height: "600px",
			margin: "0 auto",
			fontFamily: "sans-serif"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "15px",
				right: "15px",
				zIndex: 10,
				padding: "10px 20px",
				fontSize: "18px",
				fontWeight: "bold",
				backgroundColor: "#ff3333",
				color: "white",
				border: "3px solid #aa0000",
				borderRadius: "8px",
				cursor: "pointer",
				boxShadow: "0 6px 10px rgba(0,0,0,0.5)",
				textTransform: "uppercase"
			},
			onMouseOver: (e) => e.currentTarget.style.transform = "scale(1.05)",
			onMouseOut: (e) => e.currentTarget.style.transform = "scale(1)",
			children: "Beenden"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: gameRef,
			style: {
				borderRadius: "10px",
				overflow: "hidden",
				boxShadow: "0 10px 30px rgba(0,0,0,0.8)"
			}
		})]
	});
};
//#endregion
export { FaskaSoccerSwarm as default };
