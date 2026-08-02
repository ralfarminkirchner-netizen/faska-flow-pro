import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaWorld/FaskaWorld.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FaskaScene = class extends __webpack_exports__default.Scene {
	constructor() {
		super({ key: "FaskaScene" });
	}
	preload() {
		this.createTextures();
	}
	createTextures() {
		const g = this.make.graphics({
			x: 0,
			y: 0,
			add: false
		});
		g.fillStyle(16720418);
		g.fillRect(8, 0, 16, 12);
		g.fillStyle(2237183);
		g.fillRect(6, 12, 20, 14);
		g.fillStyle(0);
		g.fillRect(6, 26, 6, 6);
		g.fillRect(20, 26, 6, 6);
		g.fillStyle(16768177);
		g.fillRect(10, 4, 12, 8);
		g.generateTexture("player_idle", 32, 32);
		g.clear();
		g.fillStyle(16768256);
		g.beginPath();
		g.moveTo(0, 0);
		g.lineTo(16, 0);
		g.lineTo(24, 24);
		g.lineTo(4, 24);
		g.closePath();
		g.fillPath();
		g.generateTexture("cape", 24, 24);
		g.clear();
		g.fillStyle(3706428);
		g.fillRect(0, 0, 32, 8);
		g.fillStyle(7951688);
		g.fillRect(0, 8, 32, 24);
		g.lineStyle(2, 3046706, 1);
		g.strokeRect(0, 0, 32, 32);
		g.fillStyle(6111287);
		g.fillRect(8, 12, 4, 4);
		g.fillRect(20, 20, 4, 4);
		g.generateTexture("platform", 32, 32);
		g.clear();
		g.fillStyle(14172949);
		g.fillCircle(16, 16, 14);
		g.fillStyle(16777215);
		g.fillCircle(10, 12, 4);
		g.fillCircle(22, 12, 4);
		g.fillStyle(0);
		g.fillCircle(10, 12, 2);
		g.fillCircle(22, 12, 2);
		g.fillStyle(0);
		g.fillRect(8, 26, 6, 6);
		g.fillRect(18, 26, 6, 6);
		g.generateTexture("enemy", 32, 32);
		g.clear();
		g.fillStyle(16763432);
		g.fillRect(0, 0, 40, 40);
		g.lineStyle(4, 16777215, 1);
		g.strokeRect(2, 2, 36, 36);
		g.fillStyle(16757504);
		g.fillRect(4, 4, 32, 32);
		g.generateTexture("answer_box", 40, 40);
		g.clear();
		g.fillStyle(16777215);
		g.fillRect(0, 0, 6, 6);
		g.generateTexture("particle_white", 6, 6);
		g.clear();
		g.fillStyle(16768256);
		g.fillRect(0, 0, 6, 6);
		g.generateTexture("particle_yellow", 6, 6);
		g.clear();
		g.fillStyle(16777215, .7);
		g.fillCircle(20, 20, 20);
		g.fillCircle(40, 15, 25);
		g.fillCircle(60, 25, 15);
		g.generateTexture("cloud", 80, 50);
		g.clear();
	}
	create() {
		this.add.rectangle(0, 0, 4e3, 1200, 6600182).setOrigin(0).setScrollFactor(0);
		for (let i = 0; i < 20; i++) this.add.sprite(__webpack_exports__default.Math.Between(0, 3e3), __webpack_exports__default.Math.Between(50, 300), "cloud").setScrollFactor(.2 + Math.random() * .3).setScale(1 + Math.random());
		this.physics.world.setBounds(0, 0, 3e3, 600);
		this.platforms = this.physics.add.staticGroup();
		this.enemies = this.physics.add.group();
		this.answers = this.physics.add.group();
		for (let i = 0; i < 100; i++) {
			if (i % 12 === 0 || i % 12 === 1) continue;
			this.platforms.create(i * 32 + 16, 584, "platform");
			if (i % 8 === 0) {
				this.platforms.create(i * 32 + 16, 450, "platform");
				this.platforms.create(i * 32 + 48, 450, "platform");
			}
			if (i > 10 && Math.random() > .7 && i % 12 > 2) {
				const enemy = this.enemies.create(i * 32 + 16, 500, "enemy");
				enemy.setBounce(.1);
				enemy.setVelocityX(Math.random() > .5 ? 50 : -50);
				enemy.body.setGravityY(500);
			}
		}
		this.player = this.physics.add.sprite(100, 400, "player_idle");
		this.player.setBounce(.1);
		this.player.setCollideWorldBounds(true);
		this.player.body.setGravityY(400);
		this.cape = this.add.sprite(this.player.x, this.player.y, "cape");
		this.cape.setOrigin(.5, 0);
		this.hasCape = false;
		this.cape.visible = false;
		this.emitter = this.add.particles(0, 0, "particle_white", {
			speed: {
				min: 50,
				max: 200
			},
			angle: {
				min: 0,
				max: 360
			},
			scale: {
				start: 1,
				end: 0
			},
			lifespan: 600,
			gravityY: 400,
			blendMode: "ADD",
			emitting: false
		});
		this.starEmitter = this.add.particles(0, 0, "particle_yellow", {
			speed: {
				min: 100,
				max: 300
			},
			angle: {
				min: 0,
				max: 360
			},
			scale: {
				start: 1.5,
				end: 0
			},
			lifespan: 1e3,
			gravityY: 200,
			blendMode: "ADD",
			emitting: false
		});
		this.physics.add.collider(this.player, this.platforms);
		this.physics.add.collider(this.enemies, this.platforms);
		this.physics.add.collider(this.answers, this.platforms);
		this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
		this.physics.add.overlap(this.player, this.answers, this.handleCollectAnswer, null, this);
		this.cursors = this.input.keyboard.createCursorKeys();
		this.keys = this.input.keyboard.addKeys({
			shift: __webpack_exports__default.Input.Keyboard.KeyCodes.SHIFT,
			z: __webpack_exports__default.Input.Keyboard.KeyCodes.Z,
			x: __webpack_exports__default.Input.Keyboard.KeyCodes.X,
			space: __webpack_exports__default.Input.Keyboard.KeyCodes.SPACE
		});
		this.cameras.main.setBounds(0, 0, 3e3, 600);
		this.cameras.main.startFollow(this.player, true, .08, .08);
		this.pMeter = 0;
		this.isSpinJumping = false;
		this.isInvulnerable = false;
		this.score = 0;
		this.currentQuestion = {};
		this.uiContainer = this.add.container(0, 0).setScrollFactor(0);
		this.uiContainer.setDepth(100);
		const uiBg = this.add.rectangle(400, 30, 800, 60, 0, .6);
		this.uiContainer.add(uiBg);
		this.scoreText = this.add.text(20, 15, "SCORE: 0", {
			fontSize: "24px",
			fill: "#fff",
			fontStyle: "bold",
			fontFamily: "monospace"
		});
		this.uiContainer.add(this.scoreText);
		this.questionText = this.add.text(400, 15, "Löse die Aufgabe!", {
			fontSize: "28px",
			fill: "#ffcc00",
			fontStyle: "bold",
			fontFamily: "monospace"
		}).setOrigin(.5, 0);
		this.uiContainer.add(this.questionText);
		this.uiContainer.add(this.add.text(20, 50, "P-METER:", {
			fontSize: "14px",
			fill: "#fff",
			fontFamily: "monospace"
		}));
		this.pMeterBarBg = this.add.rectangle(90, 56, 100, 10, 3355443).setOrigin(0, .5);
		this.pMeterBar = this.add.rectangle(90, 56, 0, 10, 16711680).setOrigin(0, .5);
		this.uiContainer.add(this.pMeterBarBg);
		this.uiContainer.add(this.pMeterBar);
		this.generateMathQuestion();
		this.time.addEvent({
			delay: 4e3,
			callback: this.spawnAnswers,
			callbackScope: this,
			loop: true
		});
	}
	generateMathQuestion() {
		const op = [
			"+",
			"-",
			"*"
		][__webpack_exports__default.Math.Between(0, 2)];
		let a, b, ans;
		if (op === "+") {
			a = __webpack_exports__default.Math.Between(5, 50);
			b = __webpack_exports__default.Math.Between(5, 50);
			ans = a + b;
		} else if (op === "-") {
			a = __webpack_exports__default.Math.Between(20, 100);
			b = __webpack_exports__default.Math.Between(1, a);
			ans = a - b;
		} else {
			a = __webpack_exports__default.Math.Between(2, 10);
			b = __webpack_exports__default.Math.Between(2, 10);
			ans = a * b;
		}
		this.currentQuestion = {
			text: `${a} ${op === "*" ? "x" : op} ${b} = ?`,
			ans
		};
		this.questionText.setText(`ZIEL: ${this.currentQuestion.text}`);
		this.questionText.setScale(1.2);
		this.tweens.add({
			targets: this.questionText,
			scale: 1,
			duration: 300,
			ease: "Bounce.easeOut"
		});
	}
	spawnAnswers() {
		const spawnX = __webpack_exports__default.Math.Clamp(this.player.x + __webpack_exports__default.Math.Between(100, 400), 50, 2950);
		const spawnY = -50;
		const answersToSpawn = [this.currentQuestion.ans];
		while (answersToSpawn.length < 3) {
			const wrong = this.currentQuestion.ans + __webpack_exports__default.Math.Between(-10, 10);
			if (!answersToSpawn.includes(wrong) && wrong >= 0) answersToSpawn.push(wrong);
		}
		__webpack_exports__default.Utils.Array.Shuffle(answersToSpawn);
		answersToSpawn.forEach((ans, index) => {
			const box = this.add.sprite(0, 0, "answer_box");
			const text = this.add.text(0, 0, ans.toString(), {
				fontSize: "20px",
				fill: "#000",
				fontStyle: "bold",
				fontFamily: "monospace"
			}).setOrigin(.5);
			const container = this.add.container(spawnX + index * 60 - 60, spawnY, [box, text]);
			container.setSize(40, 40);
			this.physics.world.enable(container);
			container.body.setBounce(.8);
			container.body.setCollideWorldBounds(true);
			container.body.setVelocityX(__webpack_exports__default.Math.Between(-30, 30));
			container.answerValue = ans;
			this.answers.add(container);
			this.time.delayedCall(1e4, () => {
				if (container.active) container.destroy();
			});
		});
	}
	handlePlayerEnemyCollision(player, enemy) {
		if (this.isInvulnerable) return;
		const stompThreshold = enemy.y - 10;
		if (player.body.velocity.y > 0 && player.y < stompThreshold) {
			enemy.destroy();
			player.setVelocityY(this.isSpinJumping ? -500 : -350);
			this.cameras.main.shake(100, .005);
			this.emitter.emitParticleAt(enemy.x, enemy.y, 15);
			this.score += 50;
			this.scoreText.setText(`SCORE: ${this.score}`);
		} else this.takeDamage();
	}
	handleCollectAnswer(player, answerContainer) {
		const val = answerContainer.answerValue;
		const x = answerContainer.x;
		const y = answerContainer.y;
		answerContainer.destroy();
		if (val === this.currentQuestion.ans) {
			this.cameras.main.shake(150, .01);
			this.starEmitter.emitParticleAt(x, y, 30);
			this.score += 500;
			this.scoreText.setText(`SCORE: ${this.score}`);
			if (!this.hasCape) {
				this.hasCape = true;
				this.cape.visible = true;
				this.tweens.add({
					targets: this.player,
					alpha: 0,
					yoyo: true,
					repeat: 3,
					duration: 100
				});
			}
			this.generateMathQuestion();
		} else this.takeDamage();
	}
	takeDamage() {
		if (this.isInvulnerable) return;
		this.cameras.main.shake(200, .02);
		if (this.hasCape) {
			this.hasCape = false;
			this.cape.visible = false;
			this.isInvulnerable = true;
			this.player.setAlpha(.5);
			this.time.delayedCall(2e3, () => {
				this.isInvulnerable = false;
				this.player.setAlpha(1);
			});
			this.player.setVelocityY(-300);
			this.player.setVelocityX(this.player.flipX ? 200 : -200);
		} else this.scene.restart();
	}
	update(time, delta) {
		if (!this.player || !this.player.active) return;
		const isGrounded = this.player.body.touching.down || this.player.body.blocked.down;
		const cursors = this.cursors;
		if (cursors.left.isDown) {
			this.player.setAccelerationX(-800);
			this.player.flipX = true;
		} else if (cursors.right.isDown) {
			this.player.setAccelerationX(800);
			this.player.flipX = false;
		} else {
			this.player.setAccelerationX(0);
			this.player.setDragX(1200);
		}
		const isSprinting = this.keys.shift.isDown;
		const maxSpeed = isSprinting ? 350 : 200;
		this.player.setMaxVelocity(maxSpeed, 1e3);
		if (isSprinting && isGrounded && Math.abs(this.player.body.velocity.x) > 180) this.pMeter = Math.min(this.pMeter + delta * .1, 100);
		else if (isGrounded) this.pMeter = Math.max(this.pMeter - delta * .2, 0);
		this.pMeterBar.width = this.pMeter;
		this.pMeterBar.fillColor = this.pMeter === 100 ? 65280 : 16711680;
		if (__webpack_exports__default.Input.Keyboard.JustDown(this.keys.z) || __webpack_exports__default.Input.Keyboard.JustDown(this.keys.space)) {
			if (isGrounded) {
				let jumpVelocity = -550;
				if (this.pMeter === 100) jumpVelocity = -800;
				this.player.setVelocityY(jumpVelocity);
				this.isSpinJumping = false;
			}
		}
		if (__webpack_exports__default.Input.Keyboard.JustDown(this.keys.x) && isGrounded) {
			this.player.setVelocityY(-500);
			this.isSpinJumping = true;
		}
		if (this.hasCape && !isGrounded && this.player.body.velocity.y > 0 && (this.keys.z.isDown || this.keys.space.isDown)) {
			this.player.body.gravity.y = -700;
			this.player.setMaxVelocity(maxSpeed, 150);
		} else this.player.body.gravity.y = 0;
		if (this.isSpinJumping && !isGrounded) this.player.angle += this.player.flipX ? -20 : 20;
		else this.player.angle = 0;
		if (this.hasCape) {
			this.cape.setPosition(this.player.x + (this.player.flipX ? 8 : -8), this.player.y - 4);
			this.cape.flipX = this.player.flipX;
			if (!isGrounded && this.player.body.velocity.y > 0) this.cape.angle = this.player.flipX ? -30 : 30;
			else this.cape.angle = 0;
		}
		if (this.player.y > 600) this.scene.restart();
		this.enemies.getChildren().forEach((enemy) => {
			if (enemy.body.velocity.x === 0 && enemy.active) enemy.setVelocityX(Math.random() > .5 ? 50 : -50);
		});
	}
};
function FaskaWorld({ onExit }) {
	const gameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const config = {
			type: __webpack_exports__default.AUTO,
			parent: gameRef.current,
			width: 800,
			height: 600,
			pixelArt: true,
			backgroundColor: "#000000",
			physics: {
				default: "arcade",
				arcade: {
					gravity: { y: 1e3 },
					debug: false
				}
			},
			scene: [FaskaScene]
		};
		const game = new __webpack_exports__default.Game(config);
		return () => {
			game.destroy(true);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100%",
			maxWidth: "800px",
			margin: "0 auto",
			border: "4px solid #fff",
			borderRadius: "12px",
			overflow: "hidden",
			boxShadow: "0 0 30px rgba(0, 0, 0, 0.8)",
			backgroundColor: "#000"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "15px",
				right: "15px",
				zIndex: 1e3,
				padding: "10px 20px",
				backgroundColor: "#e74c3c",
				color: "#ffffff",
				border: "3px solid #c0392b",
				borderRadius: "6px",
				fontWeight: "900",
				fontSize: "16px",
				cursor: "pointer",
				fontFamily: "monospace",
				textTransform: "uppercase",
				boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
				transition: "all 0.1s ease"
			},
			onMouseDown: (e) => e.currentTarget.style.transform = "scale(0.95)",
			onMouseUp: (e) => e.currentTarget.style.transform = "scale(1)",
			onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)",
			children: "Beenden"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: gameRef,
			id: "faska-world-game",
			style: {
				width: "800px",
				height: "600px",
				margin: "0 auto"
			}
		})]
	});
}
//#endregion
export { FaskaWorld as default };
