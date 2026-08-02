import { n as require_react, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
import { t as PhaserWrapper } from "./PhaserWrapper-C2GMApUX.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var REGULAR_VERBS = [
	"play",
	"walk",
	"talk",
	"call",
	"look",
	"wash",
	"clean",
	"work",
	"start",
	"try",
	"cook",
	"paint",
	"help",
	"jump"
];
var IRREGULAR_VERBS = [
	"go",
	"eat",
	"see",
	"take",
	"make",
	"come",
	"know",
	"find",
	"give",
	"tell",
	"run",
	"swim",
	"fly",
	"buy"
];
var PlayScene = class extends __webpack_exports__default.Scene {
	constructor() {
		super({ key: "PlayScene" });
	}
	create() {
		this.cameras.main.setBackgroundColor("#1a1a2e");
		this.graphics = this.add.graphics();
		this.lanes = [
			200,
			300,
			400,
			500
		];
		this.drawTrack();
		this.playerGroup = this.add.group();
		this.player = {
			lane: 2,
			z: 0,
			vz: 0,
			isJumping: false,
			speed: 5,
			heat: 0,
			overheated: false,
			shadow: this.add.ellipse(150, this.lanes[2] + 20, 70, 20, 0, .6),
			sprite: this.add.rectangle(150, this.lanes[2], 70, 40, 53971),
			frontWheel: this.add.circle(180, this.lanes[2] + 20, 15, 3355443),
			backWheel: this.add.circle(120, this.lanes[2] + 20, 15, 3355443),
			rider: this.add.rectangle(140, this.lanes[2] - 25, 30, 40, 16752451)
		};
		this.player.sprite.setStrokeStyle(3, 16777215);
		this.player.frontWheel.setStrokeStyle(3, 11184810);
		this.player.backWheel.setStrokeStyle(3, 11184810);
		this.bikeParts = [
			this.player.sprite,
			this.player.frontWheel,
			this.player.backWheel,
			this.player.rider
		];
		this.obstacles = [];
		this.score = 0;
		this.scoreText = this.add.text(16, 16, "Score: 0", {
			fontSize: "32px",
			fill: "#00d2d3",
			fontStyle: "bold"
		});
		this.heatText = this.add.text(600, 16, "Heat: 0%", {
			fontSize: "28px",
			fill: "#ff9f43",
			fontStyle: "bold"
		});
		this.heatBarBg = this.add.rectangle(600, 60, 180, 25, 2236962).setOrigin(0, .5);
		this.heatBarBg.setStrokeStyle(2, 16777215);
		this.heatBar = this.add.rectangle(602, 60, 0, 21, 16752451).setOrigin(0, .5);
		this.add.text(400, 30, "Jump (SPACE) over Irregular Verbs\nDrive through Regular Verbs\nArrows UP/DOWN to switch lanes\nRight Arrow to speed up (watch HEAT!)", {
			fontSize: "18px",
			fill: "#ffffff",
			align: "center"
		}).setOrigin(.5, 0);
		this.cursors = this.input.keyboard.createCursorKeys();
		this.spawnEvent = this.time.addEvent({
			delay: 1800,
			callback: this.spawnObstacle,
			callbackScope: this,
			loop: true
		});
		this.speedLines = [];
		for (let i = 0; i < 15; i++) this.createSpeedLine();
	}
	createSpeedLine() {
		let line = this.add.rectangle(__webpack_exports__default.Math.Between(0, 800), __webpack_exports__default.Math.Between(150, 550), __webpack_exports__default.Math.Between(50, 200), 2, 16777215, .1);
		this.speedLines.push(line);
	}
	drawTrack() {
		this.graphics.clear();
		this.graphics.fillStyle(2962486, 1);
		this.graphics.fillRect(0, 150, 800, 420);
		this.graphics.lineStyle(2, 6516338, .5);
		for (let i = 0; i < this.lanes.length; i++) {
			this.graphics.beginPath();
			this.graphics.moveTo(0, this.lanes[i]);
			this.graphics.lineTo(800, this.lanes[i]);
			this.graphics.strokePath();
		}
	}
	spawnObstacle() {
		if (this.player.overheated && this.player.speed < 2) return;
		const lane = __webpack_exports__default.Math.Between(0, 3);
		const isIrregular = Math.random() > .5;
		const verb = isIrregular ? IRREGULAR_VERBS[__webpack_exports__default.Math.Between(0, IRREGULAR_VERBS.length - 1)] : REGULAR_VERBS[__webpack_exports__default.Math.Between(0, REGULAR_VERBS.length - 1)];
		const mudColor = 9127187;
		const container = this.add.container(850, this.lanes[lane]);
		const puddle = this.add.ellipse(0, 0, 140, 50, mudColor, .9);
		puddle.setStrokeStyle(3, 6040585);
		const spot1 = this.add.ellipse(-30, -10, 40, 20, 6040585, .5);
		const spot2 = this.add.ellipse(20, 15, 50, 15, 6040585, .5);
		const text = this.add.text(0, 0, verb, {
			fontSize: "26px",
			fill: "#ffffff",
			fontStyle: "bold",
			fontFamily: "Arial"
		}).setOrigin(.5);
		text.setShadow(2, 2, "#000000", 0, false, true);
		container.add([
			puddle,
			spot1,
			spot2,
			text
		]);
		container.setDepth(this.lanes[lane]);
		this.obstacles.push({
			obj: container,
			lane,
			isIrregular,
			active: true
		});
	}
	showFeedback(x, y, text, color) {
		const t = this.add.text(x, y, text, {
			fontSize: "32px",
			fill: color,
			fontStyle: "bold"
		}).setOrigin(.5);
		t.setShadow(2, 2, "#000", 2, false, true);
		t.setDepth(1e3);
		this.tweens.add({
			targets: t,
			y: y - 80,
			scale: 1.5,
			alpha: 0,
			duration: 800,
			onComplete: () => t.destroy()
		});
	}
	createSplash(x, y, color) {
		for (let i = 0; i < 15; i++) {
			let p = this.add.rectangle(x, y, 8, 8, color);
			p.setDepth(1e3);
			let vx = __webpack_exports__default.Math.Between(-150, 150);
			let vy = __webpack_exports__default.Math.Between(-250, -50);
			this.tweens.add({
				targets: p,
				x: x + vx,
				y: y + vy,
				alpha: 0,
				rotation: 10,
				duration: 600 + Math.random() * 400,
				onComplete: () => p.destroy()
			});
		}
	}
	createDust(x, y) {
		let p = this.add.rectangle(x, y, 10, 10, 12436423, .6);
		let vx = __webpack_exports__default.Math.Between(-100, -50);
		let vy = __webpack_exports__default.Math.Between(-10, 10);
		this.tweens.add({
			targets: p,
			x: x + vx,
			y: y + vy,
			scale: 3,
			alpha: 0,
			duration: 500,
			onComplete: () => p.destroy()
		});
	}
	update(time, delta) {
		if (__webpack_exports__default.Input.Keyboard.JustDown(this.cursors.up) && this.player.lane > 0 && !this.player.isJumping) {
			this.player.lane--;
			this.cameras.main.shake(50, .002);
		}
		if (__webpack_exports__default.Input.Keyboard.JustDown(this.cursors.down) && this.player.lane < 3 && !this.player.isJumping) {
			this.player.lane++;
			this.cameras.main.shake(50, .002);
		}
		if (__webpack_exports__default.Input.Keyboard.JustDown(this.cursors.space) && !this.player.isJumping && !this.player.overheated) {
			this.player.isJumping = true;
			this.player.vz = -15;
			this.cameras.main.shake(80, .005);
		}
		if (!this.player.overheated) {
			if (this.cursors.right.isDown) {
				this.player.speed = __webpack_exports__default.Math.Linear(this.player.speed, 15, .05);
				this.player.heat += .4;
				this.player.sprite.rotation = -.15;
				this.player.rider.rotation = -.15;
				this.player.frontWheel.y = this.player.shadow.y - 15 + this.player.z - 10;
			} else {
				this.player.speed = __webpack_exports__default.Math.Linear(this.player.speed, 6, .05);
				this.player.heat -= .3;
				this.player.sprite.rotation = 0;
				this.player.rider.rotation = 0;
			}
			if (this.player.heat > 100) {
				this.player.heat = 100;
				this.player.overheated = true;
				this.cameras.main.flash(500, 255, 100, 0);
				this.heatText.setText("OVERHEATED!");
				this.heatText.setColor("#ff0000");
				this.createSplash(this.player.sprite.x, this.player.sprite.y, 3355443);
			}
		} else {
			this.player.speed = __webpack_exports__default.Math.Linear(this.player.speed, 2, .1);
			this.player.heat -= .5;
			this.player.sprite.rotation = 0;
			this.player.rider.rotation = 0;
			this.player.sprite.fillColor = 15158332;
			if (Math.random() < .2) this.createDust(this.player.sprite.x, this.player.sprite.y - 20);
			if (this.player.heat <= 0) {
				this.player.overheated = false;
				this.player.heat = 0;
				this.player.sprite.fillColor = 53971;
				this.heatText.setText("Heat: 0%");
			}
		}
		this.player.heat = __webpack_exports__default.Math.Clamp(this.player.heat, 0, 100);
		this.heatBar.width = this.player.heat / 100 * 176;
		if (!this.player.overheated) {
			this.heatText.setText(`Heat: ${Math.floor(this.player.heat)}%`);
			this.heatText.setColor(this.player.heat > 80 ? "#e74c3c" : "#ff9f43");
			this.heatBar.fillColor = this.player.heat > 80 ? 15158332 : 16752451;
		}
		if (this.player.isJumping) {
			this.player.z += this.player.vz;
			this.player.vz += .8;
			if (this.player.z >= 0) {
				this.player.z = 0;
				this.player.isJumping = false;
				this.cameras.main.shake(100, .008);
				this.createSplash(this.player.sprite.x, this.player.shadow.y, 12436423);
			}
		}
		this.speedLines.forEach((line) => {
			line.x -= this.player.speed * 1.5;
			if (line.x < -100) {
				line.x = 900;
				line.y = __webpack_exports__default.Math.Between(150, 550);
			}
		});
		const targetY = this.lanes[this.player.lane];
		this.player.shadow.y = __webpack_exports__default.Math.Linear(this.player.shadow.y, targetY + 20, .2);
		this.player.shadow.setDepth(targetY);
		this.bikeParts.forEach((part) => part.setDepth(targetY + 1));
		const baseY = this.player.shadow.y - 20;
		this.player.sprite.y = baseY + this.player.z;
		this.player.rider.y = baseY - 25 + this.player.z;
		this.player.frontWheel.rotation += this.player.speed * .1;
		this.player.backWheel.rotation += this.player.speed * .1;
		if (!this.cursors.right.isDown || this.player.overheated) this.player.frontWheel.y = baseY + 20 + this.player.z;
		this.player.backWheel.y = baseY + 20 + this.player.z;
		if (this.player.speed > 3 && !this.player.isJumping && Math.random() < .2) this.createDust(this.player.backWheel.x, this.player.backWheel.y);
		this.player.shadow.scaleX = 1 - Math.abs(this.player.z) / 300;
		this.player.shadow.scaleY = 1 - Math.abs(this.player.z) / 300;
		for (let i = this.obstacles.length - 1; i >= 0; i--) {
			let obs = this.obstacles[i];
			obs.obj.x -= this.player.speed;
			if (obs.active && Math.abs(obs.obj.x - 150) < 50) {
				if (obs.lane === this.player.lane) {
					if (this.player.isJumping) if (obs.isIrregular) {
						this.score += 200;
						this.showFeedback(obs.obj.x, obs.obj.y - 50, "PERFECT JUMP!", "#00ff00");
					} else this.showFeedback(obs.obj.x, obs.obj.y - 50, "MISSED REGULAR!", "#aaaaaa");
					else if (obs.isIrregular) {
						this.player.heat += 40;
						this.player.speed = 1;
						this.cameras.main.shake(300, .03);
						this.showFeedback(obs.obj.x, obs.obj.y - 50, "CRASH!", "#ff0000");
						this.createSplash(150, obs.obj.y, 9127187);
					} else {
						this.score += 100;
						this.showFeedback(obs.obj.x, obs.obj.y - 50, "MUD SPLASH!", "#00d2d3");
						this.createSplash(150, obs.obj.y, 9127187);
					}
					this.scoreText.setText(`Score: ${this.score}`);
					obs.active = false;
					this.tweens.add({
						targets: obs.obj,
						alpha: .3,
						duration: 300
					});
				}
			}
			if (obs.obj.x < -100) {
				obs.obj.destroy();
				this.obstacles.splice(i, 1);
			}
		}
	}
};
var config = {
	type: __webpack_exports__default.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: "arcade",
		arcade: { debug: false }
	}
};
var FaskaExciteSwarm = ({ onExit }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "800px",
			height: "600px",
			margin: "0 auto",
			overflow: "hidden"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhaserWrapper, {
			config,
			sceneClass: PlayScene
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "10px",
				right: "10px",
				padding: "10px 20px",
				fontSize: "16px",
				backgroundColor: "#e74c3c",
				color: "white",
				border: "none",
				borderRadius: "5px",
				cursor: "pointer",
				zIndex: 10,
				fontWeight: "bold",
				boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
			},
			children: "Beenden"
		})]
	});
};
//#endregion
export { FaskaExciteSwarm as default };
