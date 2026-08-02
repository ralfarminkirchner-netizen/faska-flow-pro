import { n as require_react, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
import { t as PhaserWrapper } from "./PhaserWrapper-C2GMApUX.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;
var MainScene = class extends __webpack_exports__default.Scene {
	constructor() {
		super("MainScene");
		this.score = 0;
		this.swallowedPrefix = null;
		this.inhaling = false;
		this.wordPairs = [
			{
				prefix: "un",
				roots: [
					"happy",
					"fair",
					"kind",
					"clear",
					"safe"
				]
			},
			{
				prefix: "dis",
				roots: [
					"appear",
					"connect",
					"agree",
					"allow"
				]
			},
			{
				prefix: "re",
				roots: [
					"do",
					"build",
					"play",
					"write"
				]
			}
		];
	}
	preload() {
		const graphics = this.make.graphics();
		graphics.fillStyle(16758465, 1);
		graphics.fillCircle(25, 25, 20);
		graphics.fillStyle(0, 1);
		graphics.fillEllipse(17, 20, 4, 8);
		graphics.fillEllipse(33, 20, 4, 8);
		graphics.fillStyle(16738740, .6);
		graphics.fillCircle(10, 25, 4);
		graphics.fillCircle(40, 25, 4);
		graphics.generateTexture("player_idle", 50, 50);
		graphics.clear();
		graphics.fillStyle(16758465, 1);
		graphics.fillCircle(25, 25, 20);
		graphics.fillStyle(0, 1);
		graphics.fillRect(15, 19, 4, 2);
		graphics.fillRect(31, 19, 4, 2);
		graphics.fillStyle(4849664, 1);
		graphics.fillCircle(25, 27, 6);
		graphics.generateTexture("player_inhale", 50, 50);
		graphics.clear();
		graphics.fillStyle(16758465, 1);
		graphics.fillCircle(25, 25, 25);
		graphics.fillStyle(0, 1);
		graphics.fillEllipse(15, 23, 4, 8);
		graphics.fillEllipse(35, 23, 4, 8);
		graphics.fillStyle(16738740, .6);
		graphics.fillCircle(8, 28, 5);
		graphics.fillCircle(42, 28, 5);
		graphics.generateTexture("player_full", 50, 50);
		graphics.clear();
		graphics.fillStyle(16766720, 1);
		graphics.fillRoundedRect(0, 0, 40, 40, 8);
		graphics.lineStyle(2, 16747520, 1);
		graphics.strokeRoundedRect(0, 0, 40, 40, 8);
		graphics.generateTexture("enemy", 40, 40);
		graphics.clear();
		graphics.fillStyle(2003199, 1);
		graphics.fillRoundedRect(0, 0, 100, 40, 4);
		graphics.lineStyle(2, 128, 1);
		graphics.strokeRoundedRect(0, 0, 100, 40, 4);
		graphics.generateTexture("block", 100, 40);
		graphics.clear();
		graphics.fillStyle(16776960, 1);
		graphics.fillCircle(25, 25, 20);
		graphics.lineStyle(4, 16746496, 1);
		graphics.strokeCircle(25, 25, 20);
		graphics.generateTexture("projectile", 50, 50);
		graphics.clear();
		graphics.fillStyle(16777215, 1);
		graphics.fillCircle(4, 4, 4);
		graphics.generateTexture("particle", 8, 8);
		graphics.clear();
		graphics.fillStyle(4504882, 1);
		graphics.fillRect(0, 0, GAME_WIDTH, 40);
		graphics.generateTexture("ground", GAME_WIDTH, 40);
		graphics.clear();
		graphics.fillStyle(4504882, 1);
		graphics.fillRect(0, 0, 150, 20);
		graphics.generateTexture("platform", 150, 20);
		graphics.clear();
	}
	create() {
		let bg = this.add.graphics();
		bg.fillGradientStyle(1649238, 1649238, 2571381, 2571381, 1);
		bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
		this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
		this.createPlatforms();
		this.player = this.physics.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT - 100, "player_idle");
		this.player.setCollideWorldBounds(true);
		this.player.setBounce(.2);
		this.player.setDragX(500);
		this.player.isInvulnerable = false;
		this.jumps = 0;
		this.maxJumps = 6;
		this.scoreText = this.add.text(20, 20, "Score: 0", {
			fontSize: "28px",
			fill: "#fff",
			fontStyle: "bold"
		});
		this.statusText = this.add.text(GAME_WIDTH / 2, 30, "Prefix: None", {
			fontSize: "24px",
			fill: "#ffaaaa",
			fontStyle: "bold"
		}).setOrigin(.5);
		this.add.text(20, GAME_HEIGHT - 30, "Arrows: Move/Fly | Space: Inhale/Spit", {
			fontSize: "18px",
			fill: "#ccc"
		});
		this.enemies = this.physics.add.group();
		this.blocks = this.physics.add.staticGroup();
		this.projectiles = this.physics.add.group();
		this.spawnBlocks();
		this.time.addEvent({
			delay: 3500,
			callback: this.spawnEnemy,
			callbackScope: this,
			loop: true
		});
		for (let i = 0; i < 3; i++) this.spawnEnemy();
		this.puffEmitter = this.add.particles(0, 0, "particle", {
			lifespan: 600,
			speed: {
				min: 20,
				max: 100
			},
			scale: {
				start: 1,
				end: 0
			},
			emitting: false,
			blendMode: "ADD"
		});
		this.inhaleRight = this.add.particles(0, 0, "particle", {
			lifespan: 300,
			speedX: {
				min: -100,
				max: -300
			},
			speedY: {
				min: -50,
				max: 50
			},
			scale: {
				start: 0,
				end: 1
			},
			emitting: false
		});
		this.inhaleLeft = this.add.particles(0, 0, "particle", {
			lifespan: 300,
			speedX: {
				min: 100,
				max: 300
			},
			speedY: {
				min: -50,
				max: 50
			},
			scale: {
				start: 0,
				end: 1
			},
			emitting: false
		});
		this.cursors = this.input.keyboard.createCursorKeys();
		this.spaceKey = this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.SPACE);
		this.physics.add.collider(this.player, this.platforms);
		this.physics.add.collider(this.enemies, this.platforms);
		this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
		this.physics.add.collider(this.projectiles, this.blocks, this.hitBlock, null, this);
	}
	createPlatforms() {
		this.platforms = this.physics.add.staticGroup();
		this.platforms.create(GAME_WIDTH / 2, GAME_HEIGHT - 20, "ground");
		this.platforms.create(200, 450, "platform");
		this.platforms.create(600, 350, "platform");
		this.platforms.create(200, 200, "platform");
		this.platforms.create(600, 200, "platform");
	}
	spawnBlocks() {
		this.blockPositions = [
			{
				x: 100,
				y: 150,
				occupied: false
			},
			{
				x: 400,
				y: 120,
				occupied: false
			},
			{
				x: 700,
				y: 150,
				occupied: false
			},
			{
				x: 300,
				y: 300,
				occupied: false
			},
			{
				x: 500,
				y: 300,
				occupied: false
			}
		];
		this.blockPositions.forEach((pos) => {
			this.spawnBlocksSingleAt(pos);
		});
	}
	spawnBlocksSingleAt(pos) {
		if (pos.occupied) return;
		const roots = this.wordPairs.flatMap((p) => p.roots);
		const root = __webpack_exports__default.Math.RND.pick(roots);
		let block = this.blocks.create(pos.x, pos.y, "block");
		let text = this.add.text(pos.x, pos.y, root, {
			fontSize: "20px",
			fill: "#fff",
			fontStyle: "bold"
		}).setOrigin(.5);
		block.rootWord = root;
		block.textObj = text;
		block.posRef = pos;
		pos.occupied = true;
	}
	spawnEnemy() {
		if (this.enemies.countActive(true) > 5) return;
		let x = __webpack_exports__default.Math.Between(50, GAME_WIDTH - 50);
		const prefix = __webpack_exports__default.Math.RND.pick(this.wordPairs).prefix;
		let enemy = this.enemies.create(x, 50, "enemy");
		enemy.setBounce(.4);
		enemy.setCollideWorldBounds(true);
		enemy.setVelocity(__webpack_exports__default.Math.Between(-100, 100) > 0 ? 100 : -100, 50);
		let text = this.add.text(x, 50, prefix, {
			fontSize: "18px",
			fill: "#000",
			fontStyle: "bold"
		}).setOrigin(.5);
		enemy.prefix = prefix;
		enemy.textObj = text;
	}
	hitEnemy(player, enemy) {
		if (!this.inhaling && !player.isInvulnerable) {
			this.cameras.main.shake(150, .02);
			player.setVelocityY(-200);
			let dir = player.x < enemy.x ? -1 : 1;
			player.setVelocityX(dir * 200);
			if (this.swallowedPrefix) {
				this.swallowedPrefix = null;
				this.statusText.setText("Prefix: None");
				this.player.setTexture("player_idle");
			}
			player.isInvulnerable = true;
			player.setAlpha(.5);
			this.time.delayedCall(1e3, () => {
				player.isInvulnerable = false;
				player.setAlpha(1);
			});
		}
	}
	update(time, delta) {
		this.enemies.children.iterate((enemy) => {
			if (!enemy) return;
			if (enemy.textObj) enemy.textObj.setPosition(enemy.x, enemy.y);
			if (!this.inhaling) enemy.body.allowGravity = true;
			if (enemy.body.blocked.down || enemy.body.touching.down) {
				if (enemy.body.velocity.x === 0) enemy.setVelocityX(__webpack_exports__default.Math.Between(-100, 100) > 0 ? 100 : -100);
			}
			if (enemy.body.blocked.left) enemy.setVelocityX(100);
			if (enemy.body.blocked.right) enemy.setVelocityX(-100);
		});
		this.projectiles.children.iterate((proj) => {
			if (!proj) return;
			if (proj.textObj) proj.textObj.setPosition(proj.x, proj.y);
			if (proj.x < -100 || proj.x > GAME_WIDTH + 100) {
				if (proj.textObj) proj.textObj.destroy();
				proj.destroy();
			}
		});
		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-250);
			this.player.flipX = true;
		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(250);
			this.player.flipX = false;
		} else this.player.setAccelerationX(0);
		if (this.player.body.blocked.down || this.player.body.touching.down) this.jumps = 0;
		if (__webpack_exports__default.Input.Keyboard.JustDown(this.cursors.up) && this.jumps < this.maxJumps) {
			this.player.setVelocityY(-350);
			this.jumps++;
			this.puffEmitter.emitParticleAt(this.player.x, this.player.y + 20, 10);
			this.tweens.add({
				targets: this.player,
				scaleY: .8,
				scaleX: 1.2,
				duration: 100,
				yoyo: true,
				ease: "Sine.easeInOut"
			});
		}
		if (this.spaceKey.isDown && !this.swallowedPrefix) {
			this.inhaling = true;
			this.player.setTexture("player_inhale");
			let dir = this.player.flipX ? -1 : 1;
			if (dir === 1) {
				this.inhaleRight.emitting = true;
				this.inhaleLeft.emitting = false;
				this.inhaleRight.setPosition(this.player.x + 60, this.player.y);
			} else {
				this.inhaleLeft.emitting = true;
				this.inhaleRight.emitting = false;
				this.inhaleLeft.setPosition(this.player.x - 60, this.player.y);
			}
			this.enemies.children.iterate((enemy) => {
				if (!enemy) return;
				let dist = __webpack_exports__default.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
				if (dist < 200) {
					let dx = enemy.x - this.player.x;
					if (dir === 1 && dx > 0 || dir === -1 && dx < 0) {
						enemy.body.allowGravity = false;
						const angle = __webpack_exports__default.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
						this.physics.velocityFromRotation(angle, 400, enemy.body.velocity);
						if (dist < 40) this.swallowEnemy(enemy);
					}
				}
			});
		} else {
			this.inhaling = false;
			this.inhaleRight.emitting = false;
			this.inhaleLeft.emitting = false;
			if (!this.swallowedPrefix) this.player.setTexture("player_idle");
			if (__webpack_exports__default.Input.Keyboard.JustUp(this.spaceKey) && this.swallowedPrefix) this.spitEnemy();
		}
	}
	swallowEnemy(enemy) {
		this.swallowedPrefix = enemy.prefix;
		this.statusText.setText(`Prefix: ${this.swallowedPrefix}-`);
		this.player.setTexture("player_full");
		if (enemy.textObj) enemy.textObj.destroy();
		enemy.destroy();
		this.cameras.main.shake(100, .01);
		this.tweens.add({
			targets: this.player,
			scaleX: 1.3,
			scaleY: 1.3,
			duration: 150,
			yoyo: true
		});
	}
	spitEnemy() {
		let dir = this.player.flipX ? -1 : 1;
		let proj = this.projectiles.create(this.player.x + dir * 40, this.player.y, "projectile");
		proj.body.allowGravity = false;
		proj.setVelocityX(dir * 800);
		proj.prefix = this.swallowedPrefix;
		proj.textObj = this.add.text(proj.x, proj.y, this.swallowedPrefix, {
			fontSize: "20px",
			fill: "#000",
			fontStyle: "bold"
		}).setOrigin(.5);
		this.swallowedPrefix = null;
		this.statusText.setText("Prefix: None");
		this.player.setTexture("player_idle");
		this.cameras.main.shake(100, .015);
		this.player.setVelocityX(-dir * 200);
	}
	hitBlock(projectile, block) {
		let isValid = false;
		const prefixPair = this.wordPairs.find((p) => p.prefix === projectile.prefix);
		if (prefixPair && prefixPair.roots.includes(block.rootWord)) isValid = true;
		if (isValid) {
			this.score += 10;
			this.scoreText.setText("Score: " + this.score);
			this.cameras.main.shake(200, .03);
			const emitter = this.add.particles(block.x, block.y, "particle", {
				speed: {
					min: 100,
					max: 300
				},
				scale: {
					start: 1,
					end: 0
				},
				lifespan: 800,
				blendMode: "ADD",
				tint: [
					16776960,
					65280,
					65535,
					16777215
				]
			});
			emitter.explode(40);
			let correct = this.add.text(block.x, block.y, projectile.prefix + block.rootWord, {
				fontSize: "28px",
				fill: "#00ff00",
				fontStyle: "bold"
			}).setOrigin(.5);
			this.tweens.add({
				targets: correct,
				y: block.y - 60,
				alpha: 0,
				duration: 2e3,
				onComplete: () => correct.destroy()
			});
			if (block.textObj) block.textObj.destroy();
			block.posRef.occupied = false;
			const pos = block.posRef;
			block.destroy();
			this.time.delayedCall(1e3, () => emitter.destroy());
			this.time.delayedCall(2e3, () => this.spawnBlocksSingleAt(pos));
		} else {
			this.cameras.main.shake(100, .01);
			const emitter = this.add.particles(block.x, block.y, "particle", {
				speed: {
					min: 50,
					max: 150
				},
				scale: {
					start: 1,
					end: 0
				},
				lifespan: 400,
				tint: [16711680]
			});
			emitter.explode(15);
			let wrong = this.add.text(block.x, block.y, "INCORRECT!", {
				fontSize: "24px",
				fill: "#ff0000",
				fontStyle: "bold"
			}).setOrigin(.5);
			this.tweens.add({
				targets: wrong,
				y: block.y - 50,
				alpha: 0,
				duration: 1e3,
				onComplete: () => wrong.destroy()
			});
			this.time.delayedCall(500, () => emitter.destroy());
		}
		if (projectile.textObj) projectile.textObj.destroy();
		projectile.destroy();
	}
};
var config = {
	type: __webpack_exports__default.AUTO,
	scale: {
		mode: __webpack_exports__default.Scale.FIT,
		autoCenter: __webpack_exports__default.Scale.CENTER_BOTH,
		width: GAME_WIDTH,
		height: GAME_HEIGHT
	},
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 800 },
			debug: false
		}
	}
};
function FaskaKirbySwarm({ onExit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100%",
			height: "100vh",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "#192a56"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "20px",
				right: "20px",
				zIndex: 10,
				padding: "12px 24px",
				fontSize: "18px",
				fontWeight: "bold",
				cursor: "pointer",
				backgroundColor: "#ff4757",
				color: "#fff",
				border: "none",
				borderRadius: "8px",
				boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
			},
			children: "Beenden"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				width: GAME_WIDTH,
				height: GAME_HEIGHT,
				maxWidth: "100%",
				maxHeight: "100%"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhaserWrapper, {
				config,
				sceneClass: MainScene
			})
		})]
	});
}
//#endregion
export { FaskaKirbySwarm as default };
