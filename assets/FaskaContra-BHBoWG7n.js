import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaContra/FaskaContra.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var MainScene = class extends __webpack_exports__default.Scene {
	constructor() {
		super("MainScene");
	}
	create() {
		this.createTextures();
		this.health = 5;
		this.score = 0;
		this.gameOver = false;
		this.lastFired = 0;
		this.facingRight = true;
		this.add.rectangle(400, 300, 800, 600, 1710638);
		this.platforms = this.physics.add.staticGroup();
		this.platforms.create(400, 584, "ground").setScale(800 / 32, 1).refreshBody();
		this.platforms.create(400, 450, "platform").setScale(6, 1).refreshBody();
		this.platforms.create(150, 320, "platform").setScale(4, 1).refreshBody();
		this.platforms.create(650, 320, "platform").setScale(4, 1).refreshBody();
		this.platforms.create(400, 180, "platform").setScale(4, 1).refreshBody();
		this.player = this.physics.add.sprite(400, 500, "player");
		this.player.setCollideWorldBounds(true);
		this.player.setBounce(.1);
		this.player.setDragX(1e3);
		this.bullets = this.physics.add.group();
		this.enemies = this.physics.add.group();
		this.physics.add.collider(this.player, this.platforms);
		this.physics.add.collider(this.enemies, this.platforms);
		this.physics.add.collider(this.bullets, this.platforms, (bullet) => {
			this.createParticles(bullet.x, bullet.y, 16776960, 5);
			bullet.destroy();
		});
		this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
		this.physics.add.overlap(this.player, this.enemies, this.playerHitEnemy, null, this);
		this.cursors = this.input.keyboard.createCursorKeys();
		this.wasd = this.input.keyboard.addKeys({
			up: __webpack_exports__default.Input.Keyboard.KeyCodes.W,
			left: __webpack_exports__default.Input.Keyboard.KeyCodes.A,
			down: __webpack_exports__default.Input.Keyboard.KeyCodes.S,
			right: __webpack_exports__default.Input.Keyboard.KeyCodes.D,
			space: __webpack_exports__default.Input.Keyboard.KeyCodes.SPACE
		});
		this.scoreText = this.add.text(16, 16, "Punkte: 0", {
			fontSize: "24px",
			fill: "#0f0",
			fontStyle: "bold",
			stroke: "#000",
			strokeThickness: 4
		});
		this.healthText = this.add.text(16, 50, "Leben: 5", {
			fontSize: "24px",
			fill: "#f00",
			fontStyle: "bold",
			stroke: "#000",
			strokeThickness: 4
		});
		this.instructionText = this.add.text(400, 30, "Schieße auf die FALSCHE Grammatik!", {
			fontSize: "22px",
			fill: "#0ff",
			fontStyle: "bold",
			stroke: "#000",
			strokeThickness: 4
		}).setOrigin(.5);
		this.spawnTimer = this.time.addEvent({
			delay: 2500,
			callback: this.spawnEnemy,
			callbackScope: this,
			loop: true
		});
	}
	createTextures() {
		const g = this.add.graphics();
		g.fillStyle(65484, 1);
		g.fillRoundedRect(0, 0, 32, 48, 4);
		g.fillStyle(16777215, 1);
		g.fillRect(18, 10, 14, 10);
		g.fillStyle(5592405, 1);
		g.fillRect(16, 26, 20, 8);
		g.generateTexture("player", 36, 48);
		g.clear();
		g.fillStyle(15287648, 1);
		g.fillRoundedRect(0, 0, 32, 32, 4);
		g.fillStyle(0, 1);
		g.fillRect(6, 8, 6, 6);
		g.fillRect(20, 8, 6, 6);
		g.fillStyle(16777215, 1);
		g.fillRect(8, 10, 2, 2);
		g.fillRect(22, 10, 2, 2);
		g.fillStyle(0, 1);
		g.fillRect(10, 22, 12, 4);
		g.generateTexture("enemy", 32, 32);
		g.clear();
		g.fillStyle(16776960, 1);
		g.fillCircle(8, 8, 8);
		g.fillStyle(16777215, 1);
		g.fillCircle(8, 8, 4);
		g.generateTexture("bullet", 16, 16);
		g.clear();
		g.fillStyle(1450302, 1);
		g.fillRect(0, 0, 32, 32);
		g.lineStyle(2, 996448, 1);
		g.strokeRect(0, 0, 32, 32);
		g.lineStyle(2, 65484, 1);
		g.beginPath();
		g.moveTo(0, 0);
		g.lineTo(32, 0);
		g.strokePath();
		g.generateTexture("ground", 32, 32);
		g.clear();
		g.fillStyle(996448, 1);
		g.fillRect(0, 0, 32, 16);
		g.lineStyle(2, 65484, 1);
		g.strokeRect(0, 0, 32, 16);
		g.generateTexture("platform", 32, 16);
		g.clear();
		g.destroy();
	}
	spawnEnemy() {
		if (this.gameOver) return;
		const x = Math.random() > .5 ? -32 : 832;
		const enemy = this.enemies.create(x, 80, "enemy");
		enemy.setBounce(.2);
		const isCorrect = Math.random() > .5;
		enemy.isCorrect = isCorrect;
		const sentences = isCorrect ? [
			"Ich gehe nach Hause.",
			"Das ist ein Buch.",
			"Wir essen Pizza.",
			"Du bist klug.",
			"Sie liest ein Buch.",
			"Der Hund bellt.",
			"Ich mag Eis."
		] : [
			"Ich gehen nach Hause.",
			"Das sind ein Buch.",
			"Wir isst Pizza.",
			"Du bin klug.",
			"Sie lest ein Buch.",
			"Der Hunde bellt.",
			"Ich mag Eiscreme viel."
		];
		const sentence = sentences[Math.floor(Math.random() * sentences.length)];
		enemy.textLabel = this.add.text(0, 0, sentence, {
			fontSize: "16px",
			fill: "#ffffff",
			backgroundColor: "rgba(0,0,0,0.7)",
			padding: {
				x: 4,
				y: 2
			},
			stroke: "#000000",
			strokeThickness: 2
		}).setOrigin(.5, 1);
		enemy.speed = Math.random() * 50 + 50;
	}
	update(time) {
		if (this.gameOver) return;
		if (this.cursors.left.isDown || this.wasd.left.isDown) {
			this.player.setVelocityX(-250);
			this.player.flipX = true;
			this.facingRight = false;
		} else if (this.cursors.right.isDown || this.wasd.right.isDown) {
			this.player.setVelocityX(250);
			this.player.flipX = false;
			this.facingRight = true;
		} else this.player.setAccelerationX(0);
		if ((this.cursors.up.isDown || this.wasd.up.isDown) && this.player.body.touching.down) {
			this.player.setVelocityY(-650);
			this.createParticles(this.player.x, this.player.y + 24, 65484, 10);
		}
		if ((this.cursors.space.isDown || this.wasd.space.isDown) && time > this.lastFired) {
			this.shoot();
			this.lastFired = time + 250;
		}
		this.enemies.getChildren().forEach((enemy) => {
			if (enemy.x < this.player.x - 10) enemy.setVelocityX(enemy.speed);
			else if (enemy.x > this.player.x + 10) enemy.setVelocityX(-enemy.speed);
			if (enemy.body.touching.down && (enemy.body.velocity.x === 0 || Math.random() < .005)) enemy.setVelocityY(-550);
			if (enemy.y > 650) {
				if (enemy.textLabel) enemy.textLabel.destroy();
				enemy.destroy();
			}
			if (enemy.active && enemy.textLabel) enemy.textLabel.setPosition(enemy.x, enemy.y - 20);
		});
		this.bullets.getChildren().forEach((bullet) => {
			if (bullet.x < -50 || bullet.x > 850) bullet.destroy();
		});
	}
	shoot() {
		const startX = this.facingRight ? this.player.x + 20 : this.player.x - 20;
		const bullet = this.bullets.create(startX, this.player.y + 5, "bullet");
		bullet.body.allowGravity = false;
		bullet.setVelocityX(this.facingRight ? 800 : -800);
		this.cameras.main.shake(50, .002);
		this.createParticles(startX, this.player.y + 5, 16776960, 3);
	}
	hitEnemy(bullet, enemy) {
		bullet.destroy();
		if (enemy.isCorrect) this.takeDamage("Falsch! Das war korrektes Deutsch.");
		else {
			this.score += 10;
			this.scoreText.setText("Punkte: " + this.score);
			this.createParticles(enemy.x, enemy.y, 15287648, 20);
			this.cameras.main.shake(100, .01);
			const pText = this.add.text(enemy.x, enemy.y - 40, "+10", {
				fontSize: "20px",
				fill: "#0f0",
				fontStyle: "bold"
			}).setOrigin(.5);
			this.tweens.add({
				targets: pText,
				y: pText.y - 50,
				alpha: 0,
				duration: 1e3,
				onComplete: () => pText.destroy()
			});
		}
		if (enemy.textLabel) enemy.textLabel.destroy();
		enemy.destroy();
	}
	playerHitEnemy(player, enemy) {
		this.takeDamage("Ein Feind hat dich erwischt!");
		this.createParticles(enemy.x, enemy.y, 15287648, 20);
		if (enemy.textLabel) enemy.textLabel.destroy();
		enemy.destroy();
	}
	takeDamage(reason) {
		this.health -= 1;
		this.healthText.setText("Leben: " + this.health);
		this.cameras.main.shake(250, .02);
		this.cameras.main.flash(200, 255, 0, 0);
		this.createParticles(this.player.x, this.player.y, 16711680, 15);
		const rText = this.add.text(400, 200, reason, {
			fontSize: "24px",
			fill: "#fff",
			backgroundColor: "#f00",
			padding: {
				x: 10,
				y: 5
			},
			fontStyle: "bold"
		}).setOrigin(.5);
		this.tweens.add({
			targets: rText,
			y: rText.y - 50,
			alpha: 0,
			duration: 2e3,
			onComplete: () => rText.destroy()
		});
		if (this.health <= 0) this.die();
	}
	die() {
		this.gameOver = true;
		this.physics.pause();
		this.player.setTint(16711680);
		this.spawnTimer.remove();
		this.add.rectangle(400, 300, 800, 600, 0, .8);
		this.add.text(400, 250, "SPIEL VORBEI", {
			fontSize: "64px",
			fill: "#ff3366",
			fontStyle: "bold",
			stroke: "#000",
			strokeThickness: 6
		}).setOrigin(.5);
		this.add.text(400, 330, "Endstand: " + this.score, {
			fontSize: "32px",
			fill: "#00ffcc"
		}).setOrigin(.5);
		const restartBtn = this.add.text(400, 420, "Nochmal spielen", {
			fontSize: "28px",
			fill: "#ffffff",
			backgroundColor: "#0f3460",
			padding: {
				x: 20,
				y: 10
			},
			stroke: "#00ffcc",
			strokeThickness: 2
		}).setOrigin(.5).setInteractive({ useHandCursor: true }).on("pointerover", () => restartBtn.setBackgroundColor("#e94560")).on("pointerout", () => restartBtn.setBackgroundColor("#0f3460")).on("pointerdown", () => {
			this.scene.restart();
		});
	}
	createParticles(x, y, color, count) {
		for (let i = 0; i < count; i++) {
			const rect = this.add.rectangle(x, y, 6, 6, color);
			const angle = Math.random() * Math.PI * 2;
			const speed = Math.random() * 150 + 50;
			const targetX = x + Math.cos(angle) * speed;
			const targetY = y + Math.sin(angle) * speed;
			this.tweens.add({
				targets: rect,
				x: targetX,
				y: targetY,
				alpha: 0,
				scale: .5,
				duration: 800 + Math.random() * 400,
				ease: "Power2",
				onComplete: () => rect.destroy()
			});
		}
	}
};
var FaskaContra = ({ onExit }) => {
	const gameContainer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!gameContainer.current) return;
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 800,
			height: 600,
			parent: gameContainer.current,
			physics: {
				default: "arcade",
				arcade: {
					gravity: { y: 1200 },
					debug: false
				}
			},
			scene: MainScene
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
			overflow: "hidden",
			borderRadius: "12px",
			boxShadow: "0 10px 40px rgba(0,0,0,0.6)"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "15px",
				right: "15px",
				zIndex: 10,
				padding: "10px 20px",
				fontSize: "16px",
				fontWeight: "bold",
				backgroundColor: "#ff3366",
				color: "white",
				border: "2px solid white",
				borderRadius: "8px",
				cursor: "pointer",
				textTransform: "uppercase",
				boxShadow: "0 4px 0px rgba(255,255,255,0.5)",
				transition: "all 0.1s"
			},
			onMouseOver: (e) => {
				e.currentTarget.style.transform = "translateY(2px)";
				e.currentTarget.style.boxShadow = "0 2px 0px rgba(255,255,255,0.5)";
			},
			onMouseOut: (e) => {
				e.currentTarget.style.transform = "translateY(0)";
				e.currentTarget.style.boxShadow = "0 4px 0px rgba(255,255,255,0.5)";
			},
			children: "Beenden"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: gameContainer,
			style: {
				width: "100%",
				height: "100%"
			}
		})]
	});
};
//#endregion
export { FaskaContra as default };
