import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaTennisSwarm/FaskaTennisSwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FaskaTennisSwarm = ({ onExit }) => {
	const gameContainer = (0, import_react.useRef)(null);
	const gameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 800,
			height: 600,
			parent: gameContainer.current,
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
			},
			backgroundColor: "#050510"
		};
		gameRef.current = new __webpack_exports__default.Game(config);
		let ball, player, ai;
		let scorePlayer = 0;
		let scoreAI = 0;
		let scoreText;
		let questionText;
		let zones = [];
		let currentQuestionIndex = 0;
		let baseBallSpeed = 350;
		let currentBallSpeed = baseBallSpeed;
		let emitterPlayer, emitterAI;
		let isScoring = false;
		const questions = [
			{
				q: "Wann fiel die Berliner Mauer?",
				a: [
					"1989",
					"1990",
					"1961"
				],
				c: 0
			},
			{
				q: "Gründung der BRD?",
				a: [
					"1949",
					"1945",
					"1955"
				],
				c: 0
			},
			{
				q: "Wiedervereinigung Deutschlands?",
				a: [
					"1990",
					"1989",
					"1991"
				],
				c: 0
			},
			{
				q: "Ende des Zweiten Weltkriegs?",
				a: [
					"1945",
					"1939",
					"1918"
				],
				c: 0
			},
			{
				q: "Bau der Berliner Mauer?",
				a: [
					"1961",
					"1950",
					"1970"
				],
				c: 0
			}
		];
		function preload() {
			const g = this.add.graphics();
			g.fillStyle(16777215, 1);
			g.fillCircle(15, 15, 15);
			g.generateTexture("ball", 30, 30);
			g.clear();
			g.fillStyle(0, 1);
			g.fillRoundedRect(2, 2, 96, 16, 8);
			g.lineStyle(3, 65280, 1);
			g.strokeRoundedRect(2, 2, 96, 16, 8);
			g.generateTexture("playerPaddle", 100, 20);
			g.clear();
			g.fillStyle(0, 1);
			g.fillRoundedRect(2, 2, 76, 16, 8);
			g.lineStyle(3, 16711765, 1);
			g.strokeRoundedRect(2, 2, 76, 16, 8);
			g.generateTexture("aiPaddle", 80, 20);
			g.clear();
			g.fillStyle(65280, 1);
			g.fillCircle(6, 6, 6);
			g.generateTexture("particle", 12, 12);
			g.clear();
			g.fillStyle(16711765, 1);
			g.fillCircle(6, 6, 6);
			g.generateTexture("particleAi", 12, 12);
			g.destroy();
		}
		function create() {
			const grid = this.add.graphics();
			grid.lineStyle(1, 2232644, .5);
			for (let i = 0; i < 800; i += 40) {
				grid.moveTo(i, 0);
				grid.lineTo(i, 600);
			}
			for (let i = 0; i < 600; i += 40) {
				grid.moveTo(0, i);
				grid.lineTo(800, i);
			}
			grid.strokePath();
			const court = this.add.graphics();
			court.fillStyle(657962, .8);
			court.beginPath();
			court.moveTo(200, 150);
			court.lineTo(600, 150);
			court.lineTo(750, 550);
			court.lineTo(50, 550);
			court.closePath();
			court.fillPath();
			court.lineStyle(4, 65535, .8);
			court.strokePath();
			court.lineStyle(2, 16777215, .3);
			court.beginPath();
			court.moveTo(125, 350);
			court.lineTo(675, 350);
			court.strokePath();
			const zoneY = 500;
			const zoneWidth = 140;
			[
				200,
				400,
				600
			].forEach((x) => {
				const zContainer = this.add.container(0, 0);
				const zg = this.add.graphics();
				zg.fillStyle(0, .7);
				zg.lineStyle(2, 65535, 1);
				zg.fillRect(x - zoneWidth / 2, zoneY - 30, zoneWidth, 60);
				zg.strokeRect(x - zoneWidth / 2, zoneY - 30, zoneWidth, 60);
				zg.lineStyle(6, 65535, .3);
				zg.strokeRect(x - zoneWidth / 2, zoneY - 30, zoneWidth, 60);
				zg.setBlendMode(__webpack_exports__default.BlendModes.ADD);
				const text = this.add.text(x, zoneY, "", {
					fontFamily: "monospace",
					fontSize: "28px",
					color: "#00ffff",
					fontStyle: "bold"
				}).setOrigin(.5);
				zContainer.add([zg, text]);
				zones.push({
					x,
					text,
					graphics: zg,
					bounds: {
						min: x - zoneWidth / 2,
						max: x + zoneWidth / 2
					}
				});
			});
			scoreText = this.add.text(20, 20, "SPIELER: 0   KI: 0", {
				fontFamily: "monospace",
				fontSize: "20px",
				fill: "#00ffff"
			});
			questionText = this.add.text(400, 60, "", {
				fontFamily: "sans-serif",
				fontSize: "26px",
				fill: "#ffcc00",
				fontStyle: "bold"
			}).setOrigin(.5);
			questionText.setShadow(2, 2, "#000000", 4, true, true);
			ai = this.physics.add.sprite(400, 150, "aiPaddle");
			ai.setImmovable(true);
			ai.setScale(.6);
			player = this.physics.add.sprite(400, 550, "playerPaddle");
			player.setImmovable(true);
			ball = this.physics.add.sprite(400, 350, "ball");
			ball.setCircle(15);
			ball.setBounce(1, 1);
			try {
				emitterPlayer = this.add.particles(0, 0, "particle", {
					lifespan: 800,
					speed: {
						min: 200,
						max: 500
					},
					scale: {
						start: 1,
						end: 0
					},
					alpha: {
						start: 1,
						end: 0
					},
					blendMode: "ADD",
					emitting: false
				});
				emitterAI = this.add.particles(0, 0, "particleAi", {
					lifespan: 500,
					speed: {
						min: 100,
						max: 300
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
					emitting: false
				});
			} catch (e) {
				emitterPlayer = this.add.particles("particle").createEmitter({
					lifespan: 800,
					speed: {
						min: 200,
						max: 500
					},
					scale: {
						start: 1,
						end: 0
					},
					alpha: {
						start: 1,
						end: 0
					},
					blendMode: "ADD",
					on: false
				});
				emitterAI = this.add.particles("particleAi").createEmitter({
					lifespan: 500,
					speed: {
						min: 100,
						max: 300
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
					on: false
				});
			}
			this.input.on("pointermove", (pointer) => {
				player.x = __webpack_exports__default.Math.Clamp(pointer.x, 50, 750);
			});
			this.physics.add.collider(ball, player, hitPlayer, null, this);
			this.physics.add.collider(ball, ai, hitAI, null, this);
			loadQuestion();
			serveBall();
		}
		function loadQuestion() {
			const q = questions[currentQuestionIndex % questions.length];
			questionText.setText(q.q);
			const shuffledAnswers = [...q.a].map((ans, i) => ({
				ans,
				isCorrect: i === q.c
			}));
			__webpack_exports__default.Utils.Array.Shuffle(shuffledAnswers);
			zones.forEach((z, i) => {
				z.text.setText(shuffledAnswers[i].ans);
				z.text.setColor("#00ffff");
				z.isCorrect = shuffledAnswers[i].isCorrect;
			});
			currentBallSpeed = baseBallSpeed;
		}
		function serveBall() {
			isScoring = false;
			ball.setPosition(400, 350);
			ball.setScale(.8);
			ball.setVisible(true);
			const dir = (Math.random() > .5 ? 1 : -1) * (Math.random() * 100 + 50);
			ball.setVelocity(dir, currentBallSpeed);
		}
		function scorePoint(isPlayer, scene) {
			if (isPlayer) {
				scorePlayer++;
				currentQuestionIndex++;
				loadQuestion();
			} else {
				scoreAI++;
				currentBallSpeed = baseBallSpeed;
			}
			scoreText.setText(`SPIELER: ${scorePlayer}   KI: ${scoreAI}`);
			serveBall();
		}
		function hitPlayer(b, p) {
			if (isScoring) return;
			let activeZone = null;
			zones.forEach((z) => {
				if (b.x >= z.bounds.min && b.x <= z.bounds.max) activeZone = z;
			});
			let diff = b.x - p.x;
			if (activeZone) if (activeZone.isCorrect) {
				isScoring = true;
				b.scene.cameras.main.shake(300, .02);
				emitterPlayer.explode(40, b.x, b.y);
				activeZone.text.setColor("#00ff00");
				b.setVelocity(0, 0);
				b.setVisible(false);
				b.scene.time.delayedCall(1e3, () => {
					scorePoint(true, b.scene);
				});
				return;
			} else {
				b.scene.cameras.main.shake(100, .01);
				currentBallSpeed += 40;
				activeZone.text.setColor("#ff0000");
				b.scene.time.delayedCall(500, () => {
					if (activeZone.text.style.color === "#ff0000") activeZone.text.setColor("#00ffff");
				});
			}
			else currentBallSpeed += 15;
			b.setVelocityY(-currentBallSpeed);
			b.setVelocityX(diff * 5);
		}
		function hitAI(b, a) {
			if (isScoring) return;
			let targetX = __webpack_exports__default.Math.Between(150, 650);
			let time = 400 / currentBallSpeed;
			let reqVx = (targetX - b.x) / time;
			b.setVelocityY(currentBallSpeed);
			b.setVelocityX(reqVx);
			emitterAI.explode(5, b.x, b.y);
		}
		function update(time, delta) {
			if (isScoring) return;
			let t = __webpack_exports__default.Math.Clamp((ball.y - 150) / 400, 0, 1);
			let scale = __webpack_exports__default.Math.Linear(.3, 1.2, t);
			ball.setScale(scale);
			ball.setDepth(t);
			if (ball.body.velocity.y < 0) {
				let aiSpeed = 1e3;
				if (ai.x < ball.x - 5) ai.setVelocityX(aiSpeed);
				else if (ai.x > ball.x + 5) ai.setVelocityX(-aiSpeed);
				else ai.setVelocityX(0);
				if (ai.x < 200) {
					ai.x = 200;
					ai.setVelocityX(0);
				}
				if (ai.x > 600) {
					ai.x = 600;
					ai.setVelocityX(0);
				}
			} else if (ai.x < 390) ai.setVelocityX(150);
			else if (ai.x > 410) ai.setVelocityX(-150);
			else ai.setVelocityX(0);
			if (ball.y > 600) {
				isScoring = true;
				this.cameras.main.shake(200, .02);
				emitterAI.explode(30, ball.x, ball.y);
				this.time.delayedCall(1e3, () => {
					scorePoint(false, this);
				});
			} else if (ball.y < 50) {
				isScoring = true;
				this.time.delayedCall(500, () => {
					scorePoint(true, this);
				});
			}
			let leftBound = __webpack_exports__default.Math.Linear(200, 50, t);
			let rightBound = __webpack_exports__default.Math.Linear(600, 750, t);
			if (ball.x < leftBound + 15) {
				ball.x = leftBound + 15;
				ball.setVelocityX(Math.abs(ball.body.velocity.x));
			} else if (ball.x > rightBound - 15) {
				ball.x = rightBound - 15;
				ball.setVelocityX(-Math.abs(ball.body.velocity.x));
			}
		}
		return () => {
			if (gameRef.current) gameRef.current.destroy(true);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "800px",
			height: "600px",
			margin: "0 auto"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: gameContainer,
			style: {
				width: "100%",
				height: "100%",
				overflow: "hidden",
				borderRadius: "8px",
				boxShadow: "0 0 20px rgba(0,255,255,0.2)"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "15px",
				right: "15px",
				padding: "10px 20px",
				backgroundColor: "rgba(255, 0, 85, 0.8)",
				color: "#fff",
				border: "2px solid #ff0055",
				borderRadius: "4px",
				fontSize: "16px",
				fontWeight: "bold",
				cursor: "pointer",
				zIndex: 10,
				textTransform: "uppercase",
				boxShadow: "0 0 10px rgba(255,0,85,0.5)"
			},
			onMouseOver: (e) => e.currentTarget.style.backgroundColor = "rgba(255, 0, 85, 1)",
			onMouseOut: (e) => e.currentTarget.style.backgroundColor = "rgba(255, 0, 85, 0.8)",
			children: "Beenden"
		})]
	});
};
//#endregion
export { FaskaTennisSwarm as default };
