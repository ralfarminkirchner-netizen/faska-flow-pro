import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaRTypeSwarm/FaskaRTypeSwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var VIRUS_TYPES = [
	{
		id: 0,
		virus: "Influenza",
		vaccine: "Flu Shot",
		color: 16729156
	},
	{
		id: 1,
		virus: "SARS-CoV-2",
		vaccine: "mRNA-1273",
		color: 4521796
	},
	{
		id: 2,
		virus: "Rabies",
		vaccine: "Rabies Ig",
		color: 4474111
	},
	{
		id: 3,
		virus: "Hepatitis B",
		vaccine: "HepB",
		color: 16777028
	}
];
var MainScene = class extends __webpack_exports__default.Scene {
	constructor() {
		super({ key: "MainScene" });
		this.score = 0;
		this.lives = 3;
		this.currentVaccineId = -1;
		this.lastFired = 0;
	}
	preload() {
		const graphics = this.make.graphics({
			x: 0,
			y: 0,
			add: false
		});
		graphics.fillStyle(65535, 1);
		graphics.beginPath();
		graphics.moveTo(0, 0);
		graphics.lineTo(40, 20);
		graphics.lineTo(0, 40);
		graphics.lineTo(10, 20);
		graphics.closePath();
		graphics.fillPath();
		graphics.generateTexture("ship", 40, 40);
		graphics.clear();
		graphics.fillStyle(16777215, 1);
		graphics.fillRect(0, 0, 20, 6);
		graphics.generateTexture("laser", 20, 6);
		graphics.clear();
		graphics.fillStyle(16777215, 1);
		graphics.fillRoundedRect(0, 0, 40, 20, 10);
		graphics.fillStyle(52479, 1);
		graphics.fillRoundedRect(20, 0, 20, 20, {
			tr: 10,
			br: 10,
			tl: 0,
			bl: 0
		});
		graphics.generateTexture("vaccine_tex", 40, 20);
		graphics.clear();
		graphics.fillStyle(16777215, 1);
		graphics.fillCircle(25, 25, 15);
		for (let i = 0; i < 12; i++) {
			const angle = i / 12 * Math.PI * 2;
			graphics.fillCircle(25 + Math.cos(angle) * 20, 25 + Math.sin(angle) * 20, 4);
		}
		graphics.generateTexture("virus_tex", 50, 50);
		graphics.clear();
		graphics.fillStyle(16777215, 1);
		graphics.fillRect(0, 0, 6, 6);
		graphics.generateTexture("particle", 6, 6);
		graphics.clear();
	}
	create() {
		this.score = 0;
		this.lives = 3;
		this.currentVaccineId = -1;
		this.stars = [];
		for (let i = 0; i < 150; i++) {
			const x = __webpack_exports__default.Math.Between(0, 800);
			const y = __webpack_exports__default.Math.Between(0, 600);
			const size = __webpack_exports__default.Math.FloatBetween(1, 3);
			const alpha = __webpack_exports__default.Math.FloatBetween(.2, .8);
			const speed = __webpack_exports__default.Math.FloatBetween(.5, 3.5);
			const rect = this.add.rectangle(x, y, size, size, 16777215, alpha);
			this.stars.push({
				rect,
				speed
			});
		}
		this.engineParticles = this.add.particles(0, 0, "particle", {
			speed: {
				min: 20,
				max: 60
			},
			angle: {
				min: 160,
				max: 200
			},
			scale: {
				start: .6,
				end: 0
			},
			lifespan: 400,
			blendMode: "ADD",
			tint: 65535
		});
		this.player = this.physics.add.sprite(100, 300, "ship");
		this.player.setCollideWorldBounds(true);
		this.player.body.setSize(30, 20);
		this.engineParticles.startFollow(this.player, -20, 0);
		this.lasers = this.physics.add.group();
		this.viruses = this.physics.add.group();
		this.vaccines = this.physics.add.group();
		this.virusLabels = this.add.group();
		this.vaccineLabels = this.add.group();
		this.scoreText = this.add.text(20, 20, "Score: 0", {
			fontSize: "24px",
			fill: "#fff",
			fontStyle: "bold",
			stroke: "#000",
			strokeThickness: 4
		});
		this.livesText = this.add.text(20, 50, "Lives: 3", {
			fontSize: "24px",
			fill: "#ff4444",
			fontStyle: "bold",
			stroke: "#000",
			strokeThickness: 4
		});
		this.vaccineUI = this.add.text(400, 560, "NO VACCINE EQUIPPED", {
			fontSize: "22px",
			fill: "#888",
			fontStyle: "bold",
			stroke: "#000",
			strokeThickness: 4
		}).setOrigin(.5);
		this.cursors = this.input.keyboard.createCursorKeys();
		this.spaceBar = this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.SPACE);
		this.wasd = {
			up: this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.W),
			down: this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.S),
			left: this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.A),
			right: this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.D)
		};
		this.time.addEvent({
			delay: 1800,
			callback: this.spawnVirus,
			callbackScope: this,
			loop: true
		});
		this.time.addEvent({
			delay: 5e3,
			callback: this.spawnVaccine,
			callbackScope: this,
			loop: true
		});
		this.physics.add.overlap(this.lasers, this.viruses, this.hitVirus, null, this);
		this.physics.add.overlap(this.player, this.vaccines, this.collectVaccine, null, this);
		this.physics.add.overlap(this.player, this.viruses, this.playerHit, null, this);
		this.particles = this.add.particles(0, 0, "particle", {
			speed: {
				min: 50,
				max: 250
			},
			angle: {
				min: 0,
				max: 360
			},
			scale: {
				start: 1.5,
				end: 0
			},
			lifespan: 600,
			blendMode: "ADD",
			emitting: false
		});
	}
	spawnVirus() {
		const y = __webpack_exports__default.Math.Between(80, 520);
		const type = __webpack_exports__default.Math.RND.pick(VIRUS_TYPES);
		const virus = this.viruses.create(850, y, "virus_tex");
		virus.setTint(type.color);
		virus.virusData = type;
		virus.setVelocityX(__webpack_exports__default.Math.Between(-180, -120));
		virus.body.setCircle(18, 7, 7);
		virus.startY = y;
		virus.timeOffset = __webpack_exports__default.Math.FloatBetween(0, Math.PI * 2);
		const label = this.add.text(850, y - 35, type.virus, {
			fontSize: "16px",
			fill: "#fff",
			fontStyle: "bold",
			stroke: "#000",
			strokeThickness: 3
		}).setOrigin(.5);
		label.virusRef = virus;
		this.virusLabels.add(label);
	}
	spawnVaccine() {
		const y = __webpack_exports__default.Math.Between(80, 520);
		const type = __webpack_exports__default.Math.RND.pick(VIRUS_TYPES);
		const vaccine = this.vaccines.create(850, y, "vaccine_tex");
		vaccine.vaccineData = type;
		vaccine.setVelocityX(-90);
		this.tweens.add({
			targets: vaccine,
			scaleX: 1.1,
			scaleY: 1.1,
			yoyo: true,
			repeat: -1,
			duration: 600
		});
		const label = this.add.text(850, y - 30, type.vaccine, {
			fontSize: "16px",
			fill: "#00ffff",
			fontStyle: "bold",
			stroke: "#000",
			strokeThickness: 3
		}).setOrigin(.5);
		label.vaccineRef = vaccine;
		this.vaccineLabels.add(label);
	}
	update(time, delta) {
		if (this.lives <= 0) return;
		this.stars.forEach((star) => {
			star.rect.x -= star.speed;
			if (star.rect.x < 0) {
				star.rect.x = 800;
				star.rect.y = __webpack_exports__default.Math.Between(0, 600);
			}
		});
		let speed = 350;
		let vx = 0;
		let vy = 0;
		if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -speed;
		else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = speed;
		if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -speed;
		else if (this.cursors.down.isDown || this.wasd.down.isDown) vy = speed;
		this.player.setVelocity(vx, vy);
		this.player.setAngle(vy < 0 ? -15 : vy > 0 ? 15 : 0);
		if (this.spaceBar.isDown && time > this.lastFired) {
			const laser = this.lasers.create(this.player.x + 20, this.player.y, "laser");
			laser.setVelocityX(700);
			laser.vaccineId = this.currentVaccineId;
			if (this.currentVaccineId !== -1) {
				const currentType = VIRUS_TYPES.find((v) => v.id === this.currentVaccineId);
				laser.setTint(currentType.color);
			} else laser.setTint(11184810);
			this.lastFired = time + 200;
		}
		this.virusLabels.children.iterate((label) => {
			if (label && label.virusRef) if (!label.virusRef.active) label.destroy();
			else {
				const v = label.virusRef;
				v.rotation += .03;
				v.y = v.startY + Math.sin(time / 400 + v.timeOffset) * 60;
				label.x = v.x;
				label.y = v.y - 35;
				if (v.x < -50) v.destroy();
			}
		});
		this.vaccineLabels.children.iterate((label) => {
			if (label && label.vaccineRef) if (!label.vaccineRef.active) label.destroy();
			else {
				label.x = label.vaccineRef.x;
				label.y = label.vaccineRef.y - 30;
				if (label.vaccineRef.x < -50) label.vaccineRef.destroy();
			}
		});
		this.lasers.children.iterate((laser) => {
			if (laser && laser.x > 850) laser.destroy();
		});
	}
	hitVirus(laser, virus) {
		if (laser.vaccineId === virus.virusData.id) {
			laser.destroy();
			this.particles.setParticleTint(virus.virusData.color);
			this.particles.explode(40, virus.x, virus.y);
			virus.destroy();
			this.score += 100;
			this.scoreText.setText(`Score: ${this.score}`);
			this.cameras.main.shake(150, .015);
		} else {
			laser.destroy();
			const text = this.add.text(virus.x, virus.y - 20, "IMMUNE!", {
				fontSize: "18px",
				fill: "#fff",
				fontStyle: "bold",
				stroke: "#f00",
				strokeThickness: 4
			}).setOrigin(.5);
			this.tweens.add({
				targets: text,
				y: text.y - 40,
				alpha: 0,
				duration: 600,
				onComplete: () => text.destroy()
			});
			this.particles.setParticleTint(16777215);
			this.particles.explode(5, laser.x, laser.y);
		}
	}
	collectVaccine(player, vaccine) {
		this.currentVaccineId = vaccine.vaccineData.id;
		const hexColor = `#${vaccine.vaccineData.color.toString(16).padStart(6, "0")}`;
		this.vaccineUI.setText(`EQUIPPED: ${vaccine.vaccineData.vaccine.toUpperCase()}`);
		this.vaccineUI.setFill(hexColor);
		this.tweens.add({
			targets: this.vaccineUI,
			scaleX: 1.2,
			scaleY: 1.2,
			yoyo: true,
			duration: 150
		});
		this.particles.setParticleTint(vaccine.vaccineData.color);
		this.particles.explode(20, vaccine.x, vaccine.y);
		vaccine.destroy();
		this.cameras.main.flash(200, 0, 255, 255, .15);
	}
	playerHit(player, virus) {
		virus.destroy();
		this.lives -= 1;
		this.livesText.setText(`Lives: ${this.lives}`);
		this.cameras.main.shake(300, .03);
		this.particles.setParticleTint(16711680);
		this.particles.explode(50, player.x, player.y);
		if (this.lives <= 0) {
			this.physics.pause();
			this.player.setTint(16711680);
			this.engineParticles.stop();
			this.add.text(400, 260, "GAME OVER", {
				fontSize: "64px",
				fill: "#ff0000",
				fontStyle: "bold",
				stroke: "#000",
				strokeThickness: 8
			}).setOrigin(.5);
			const restartText = this.add.text(400, 340, "Click to Restart", {
				fontSize: "28px",
				fill: "#fff",
				fontStyle: "bold",
				stroke: "#000",
				strokeThickness: 4
			}).setOrigin(.5);
			this.tweens.add({
				targets: restartText,
				alpha: 0,
				yoyo: true,
				repeat: -1,
				duration: 800
			});
			restartText.setInteractive();
			this.input.once("pointerdown", () => {
				this.scene.restart();
			});
		} else {
			this.player.setAlpha(.5);
			this.physics.world.disable(this.player);
			this.time.delayedCall(1500, () => {
				if (this.lives > 0) {
					this.player.setAlpha(1);
					this.physics.world.enable(this.player);
				}
			});
		}
	}
};
var FaskaRTypeSwarm = ({ onExit }) => {
	const gameRef = (0, import_react.useRef)(null);
	const gameInstance = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!gameRef.current) return;
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 800,
			height: 600,
			parent: gameRef.current,
			physics: {
				default: "arcade",
				arcade: { debug: false }
			},
			scene: MainScene
		};
		gameInstance.current = new __webpack_exports__default.Game(config);
		return () => {
			if (gameInstance.current) gameInstance.current.destroy(true);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "800px",
			height: "600px",
			margin: "0 auto",
			background: "#000",
			overflow: "hidden",
			borderRadius: "8px",
			boxShadow: "0 10px 30px rgba(0,0,0,0.8)"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: gameRef }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "15px",
				right: "15px",
				padding: "10px 24px",
				fontSize: "18px",
				fontWeight: "bold",
				backgroundColor: "#e74c3c",
				color: "white",
				border: "3px solid #c0392b",
				borderRadius: "8px",
				cursor: "pointer",
				zIndex: 10,
				textTransform: "uppercase",
				boxShadow: "0 4px 6px rgba(0,0,0,0.5)",
				transition: "transform 0.1s"
			},
			onMouseDown: (e) => e.target.style.transform = "scale(0.95)",
			onMouseUp: (e) => e.target.style.transform = "scale(1)",
			onMouseLeave: (e) => e.target.style.transform = "scale(1)",
			children: "Beenden"
		})]
	});
};
//#endregion
export { FaskaRTypeSwarm as default };
