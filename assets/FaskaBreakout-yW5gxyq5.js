import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaBreakout/FaskaBreakout.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FaskaBreakout = ({ onExit }) => {
	const gameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 800,
			height: 600,
			parent: "phaser-faskabreakout",
			backgroundColor: "#000000",
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
		const EVENT_POOL = [
			{
				text: "Pyramiden",
				year: -2500
			},
			{
				text: "Rom gegr.",
				year: -753
			},
			{
				text: "Kolumbus",
				year: 1492
			},
			{
				text: "Buchdruck",
				year: 1440
			},
			{
				text: "Mondlandung",
				year: 1969
			},
			{
				text: "Mauerfall",
				year: 1989
			},
			{
				text: "Internet",
				year: 1991
			},
			{
				text: "Smartphones",
				year: 2007
			},
			{
				text: "Franz. Rev.",
				year: 1789
			},
			{
				text: "1. Weltkrieg",
				year: 1914
			},
			{
				text: "2. Weltkrieg",
				year: 1939
			},
			{
				text: "Römisches Reich",
				year: 27
			},
			{
				text: "Völkerwanderung",
				year: 375
			},
			{
				text: "Reformation",
				year: 1517
			}
		];
		let paddle;
		let ball;
		let bricks;
		let cursors;
		let targetIndex = 0;
		let activeEvents = [];
		let sortedEvents = [];
		let promptText;
		let scoreText;
		let score = 0;
		let particles;
		let trail;
		function preload() {
			const graphics = this.add.graphics();
			graphics.fillStyle(16777215, 1);
			graphics.fillRect(0, 0, 8, 8);
			graphics.generateTexture("particle", 8, 8);
			graphics.clear();
			graphics.fillStyle(65484, 1);
			graphics.fillCircle(10, 10, 10);
			graphics.lineStyle(2, 16777215, 1);
			graphics.strokeCircle(10, 10, 10);
			graphics.generateTexture("ball", 20, 20);
			graphics.clear();
			graphics.fillStyle(43775, 1);
			graphics.fillRoundedRect(0, 0, 120, 20, 10);
			graphics.lineStyle(2, 16777215, 1);
			graphics.strokeRoundedRect(0, 0, 120, 20, 10);
			graphics.generateTexture("paddle", 120, 20);
			graphics.clear();
			graphics.fillStyle(8913151, 1);
			graphics.fillRoundedRect(0, 0, 160, 50, 8);
			graphics.lineStyle(2, 13404415, 1);
			graphics.strokeRoundedRect(0, 0, 160, 50, 8);
			graphics.generateTexture("brick", 160, 50);
			graphics.destroy();
		}
		function create() {
			const bg = this.add.graphics();
			bg.fillGradientStyle(34, 34, 68, 68, 1);
			bg.fillRect(0, 0, 800, 600);
			bg.lineStyle(1, 16777215, .05);
			for (let i = 0; i < 800; i += 50) {
				bg.moveTo(i, 0);
				bg.lineTo(i, 600);
			}
			for (let i = 0; i < 600; i += 50) {
				bg.moveTo(0, i);
				bg.lineTo(800, i);
			}
			bg.strokePath();
			this.physics.world.setBoundsCollision(true, true, true, false);
			particles = this.add.particles(0, 0, "particle", {
				speed: {
					min: 100,
					max: 300
				},
				scale: {
					start: 1,
					end: 0
				},
				blendMode: "ADD",
				lifespan: 800,
				tint: [
					16711935,
					65535,
					16777215
				],
				emitting: false
			});
			paddle = this.physics.add.image(400, 550, "paddle").setImmovable();
			paddle.body.setCollideWorldBounds(true);
			ball = this.physics.add.image(400, 500, "ball");
			ball.setCollideWorldBounds(true);
			ball.setBounce(1, 1);
			ball.setData("onPaddle", true);
			trail = this.add.particles(0, 0, "particle", {
				speed: 0,
				scale: {
					start: 1.5,
					end: 0
				},
				blendMode: "ADD",
				lifespan: 300,
				alpha: {
					start: .5,
					end: 0
				},
				tint: 65484
			});
			trail.startFollow(ball);
			__webpack_exports__default.Utils.Array.Shuffle(EVENT_POOL);
			activeEvents = EVENT_POOL.slice(0, 8);
			sortedEvents = [...activeEvents].sort((a, b) => a.year - b.year);
			bricks = this.physics.add.staticGroup();
			const cols = 4;
			const offsetX = 140;
			const offsetY = 120;
			const spacingX = 175;
			const spacingY = 70;
			activeEvents.forEach((event, i) => {
				const x = offsetX + i % cols * spacingX;
				const y = offsetY + Math.floor(i / cols) * spacingY;
				const brick = bricks.create(x, y, "brick");
				brick.setData("event", event);
				brick.setData("targetRank", sortedEvents.findIndex((e) => e.text === event.text));
				const text = this.add.text(x, y, event.text, {
					fontSize: "16px",
					fill: "#ffffff",
					fontStyle: "bold",
					align: "center"
				}).setOrigin(.5);
				brick.setData("textObj", text);
			});
			this.physics.add.collider(ball, paddle, hitPaddle, null, this);
			this.physics.add.collider(ball, bricks, hitBrick, null, this);
			cursors = this.input.keyboard.createCursorKeys();
			this.input.on("pointermove", (pointer) => {
				paddle.x = __webpack_exports__default.Math.Clamp(pointer.x, 60, 740);
				if (ball.getData("onPaddle")) ball.x = paddle.x;
			});
			this.input.on("pointerup", () => {
				if (ball.getData("onPaddle")) {
					ball.setData("onPaddle", false);
					ball.setVelocity(-150, -350);
				}
			});
			const topBar = this.add.graphics();
			topBar.fillStyle(0, .7);
			topBar.fillRect(0, 0, 800, 60);
			promptText = this.add.text(400, 30, "Zerstöre das älteste Ereignis zuerst!", {
				fontSize: "24px",
				fill: "#ffff00",
				fontStyle: "bold"
			}).setOrigin(.5);
			scoreText = this.add.text(20, 30, "Punkte: 0", {
				fontSize: "20px",
				fill: "#ffffff",
				fontStyle: "bold"
			}).setOrigin(0, .5);
		}
		function hitPaddle(ball, paddle) {
			let diff = 0;
			if (ball.x < paddle.x) {
				diff = paddle.x - ball.x;
				ball.setVelocityX(-10 * diff);
			} else if (ball.x > paddle.x) {
				diff = ball.x - paddle.x;
				ball.setVelocityX(10 * diff);
			} else ball.setVelocityX(2 + Math.random() * 8);
			this.tweens.add({
				targets: paddle,
				y: 555,
				duration: 50,
				yoyo: true
			});
		}
		function hitBrick(ball, brick) {
			const targetRank = brick.getData("targetRank");
			const event = brick.getData("event");
			if (targetRank === targetIndex) {
				particles.emitParticleAt(brick.x, brick.y, 40);
				this.cameras.main.shake(100, .01);
				brick.getData("textObj").destroy();
				brick.destroy();
				score += 100;
				scoreText.setText("Punkte: " + score);
				targetIndex++;
				let yearStr = event.year < 0 ? Math.abs(event.year) + " v.Chr." : event.year;
				const floatText = this.add.text(brick.x, brick.y, `${yearStr}\n+100`, {
					fontSize: "22px",
					fill: "#00ff00",
					align: "center",
					fontStyle: "bold"
				}).setOrigin(.5);
				this.tweens.add({
					targets: floatText,
					y: brick.y - 60,
					alpha: 0,
					duration: 1200,
					onComplete: () => floatText.destroy()
				});
				const v = ball.body.velocity;
				ball.setVelocity(v.x * 1.05, v.y * 1.05);
				if (targetIndex >= activeEvents.length) {
					promptText.setText("Historisch perfekt! Klicke zum Neustart.");
					ball.setVelocity(0, 0);
					ball.setData("onPaddle", true);
					this.input.once("pointerup", () => {
						this.scene.restart();
						targetIndex = 0;
						score = 0;
					});
				} else {
					promptText.setText("Sehr gut! Finde das nächst älteste.");
					promptText.setFill("#00ff00");
					this.time.delayedCall(1500, () => {
						if (targetIndex < activeEvents.length) {
							promptText.setText("Zerstöre das älteste verbleibende Ereignis!");
							promptText.setFill("#ffff00");
						}
					});
				}
			} else {
				this.cameras.main.shake(150, .02);
				score = Math.max(0, score - 50);
				scoreText.setText("Punkte: " + score);
				promptText.setText("Falsche Epoche! Zu neu!");
				promptText.setFill("#ff0000");
				this.time.delayedCall(1500, () => {
					if (targetIndex < activeEvents.length) {
						promptText.setText("Zerstöre das älteste verbleibende Ereignis!");
						promptText.setFill("#ffff00");
					}
				});
				brick.setTint(16711680);
				const textObj = brick.getData("textObj");
				textObj.setTint(16711680);
				this.time.delayedCall(300, () => {
					if (brick.active) {
						brick.clearTint();
						textObj.clearTint();
					}
				});
				particles.emitParticleAt(brick.x, brick.y, 10, { tint: 16711680 });
			}
		}
		function update() {
			if (ball.y > 600) {
				ball.setData("onPaddle", true);
				ball.setPosition(paddle.x, 500);
				ball.setVelocity(0, 0);
				score = Math.max(0, score - 100);
				scoreText.setText("Punkte: " + score);
				this.cameras.main.shake(200, .03);
			}
			if (cursors.left.isDown) paddle.x -= 8;
			else if (cursors.right.isDown) paddle.x += 8;
			paddle.x = __webpack_exports__default.Math.Clamp(paddle.x, 60, 740);
			if (ball.getData("onPaddle")) ball.x = paddle.x;
		}
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
			margin: "0 auto",
			fontFamily: "sans-serif"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "10px",
				right: "10px",
				padding: "8px 16px",
				fontSize: "16px",
				fontWeight: "bold",
				backgroundColor: "#ff3333",
				color: "white",
				border: "2px solid #ffffff",
				borderRadius: "8px",
				cursor: "pointer",
				zIndex: 10,
				boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
				transition: "transform 0.1s"
			},
			onMouseOver: (e) => e.target.style.transform = "scale(1.05)",
			onMouseOut: (e) => e.target.style.transform = "scale(1)",
			children: "Beenden"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: "phaser-faskabreakout",
			style: {
				border: "4px solid #444",
				borderRadius: "12px",
				overflow: "hidden",
				boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
			}
		})]
	});
};
//#endregion
export { FaskaBreakout as default };
