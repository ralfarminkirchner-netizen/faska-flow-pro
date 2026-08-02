import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaMoorhuhn/FaskaMoorhuhn.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var WORD_GROUPS = [
	{
		name: "Früchte",
		words: [
			"Apfel",
			"Banane",
			"Kirsche",
			"Birne",
			"Orange",
			"Traube",
			"Melone",
			"Pfirsich",
			"Kiwi"
		]
	},
	{
		name: "Fahrzeuge",
		words: [
			"Auto",
			"Bus",
			"Fahrrad",
			"Zug",
			"Flugzeug",
			"Schiff",
			"LKW",
			"Traktor",
			"Roller"
		]
	},
	{
		name: "Tiere",
		words: [
			"Hund",
			"Katze",
			"Maus",
			"Elefant",
			"Tiger",
			"Bär",
			"Löwe",
			"Vogel",
			"Pferd"
		]
	},
	{
		name: "Möbel",
		words: [
			"Stuhl",
			"Tisch",
			"Bett",
			"Schrank",
			"Sofa",
			"Regal",
			"Sessel",
			"Hocker"
		]
	},
	{
		name: "Kleidung",
		words: [
			"Hose",
			"Hemd",
			"Schuh",
			"Jacke",
			"Hut",
			"Socke",
			"Kleid",
			"Pullover",
			"Mütze"
		]
	},
	{
		name: "Berufe",
		words: [
			"Arzt",
			"Lehrer",
			"Bäcker",
			"Maler",
			"Koch",
			"Bauer",
			"Polizist",
			"Friseur",
			"Pilot"
		]
	}
];
var FaskaMoorhuhnScene = class extends __webpack_exports__default.Scene {
	constructor() {
		super({ key: "FaskaMoorhuhnScene" });
		this.score = 0;
	}
	create() {
		this.generateTextures();
		const bg = this.add.graphics();
		bg.fillGradientStyle(8900331, 8900331, 2003199, 2003199, 1);
		bg.fillRect(0, 0, 800, 600);
		bg.fillStyle(16766720, 1);
		bg.fillCircle(700, 100, 50);
		bg.fillStyle(16777215, .8);
		bg.fillCircle(150, 120, 30);
		bg.fillCircle(180, 110, 40);
		bg.fillCircle(210, 120, 30);
		bg.fillCircle(550, 160, 20);
		bg.fillCircle(580, 150, 30);
		bg.fillCircle(610, 160, 20);
		bg.fillStyle(2263842, 1);
		bg.beginPath();
		bg.moveTo(0, 600);
		bg.lineTo(0, 400);
		bg.quadraticCurveTo(200, 300, 400, 450);
		bg.quadraticCurveTo(600, 550, 800, 350);
		bg.lineTo(800, 600);
		bg.fillPath();
		bg.fillStyle(3329330, 1);
		bg.beginPath();
		bg.moveTo(0, 600);
		bg.lineTo(0, 500);
		bg.quadraticCurveTo(300, 400, 600, 500);
		bg.quadraticCurveTo(700, 550, 800, 450);
		bg.lineTo(800, 600);
		bg.fillPath();
		this.scoreText = this.add.text(20, 20, "Punkte: 0", {
			fontSize: "32px",
			fontFamily: "Arial",
			fill: "#ffffff",
			fontStyle: "bold",
			stroke: "#000000",
			strokeThickness: 4
		}).setDepth(100);
		const instrBg = this.add.graphics();
		instrBg.fillStyle(0, .5);
		instrBg.fillRoundedRect(150, 10, 500, 50, 10);
		instrBg.setDepth(99);
		this.instructionText = this.add.text(400, 35, "Finde das unpassende Wort!", {
			fontSize: "26px",
			fontFamily: "Arial",
			fill: "#ffff00",
			fontStyle: "bold"
		}).setOrigin(.5, .5).setDepth(100);
		this.input.setDefaultCursor("none");
		this.crosshair = this.add.graphics().setDepth(200);
		this.drawCrosshair();
		this.input.on("pointermove", (pointer) => {
			this.crosshair.setPosition(pointer.x, pointer.y);
		});
		this.input.on("pointerdown", (pointer) => {
			this.shoot(pointer);
		});
		this.targetGroup = this.add.group();
		this.startWave();
	}
	generateTextures() {
		const p = this.make.graphics({
			x: 0,
			y: 0,
			add: false
		});
		p.fillStyle(16777215);
		p.fillCircle(8, 8, 8);
		p.generateTexture("particle", 16, 16);
	}
	drawCrosshair() {
		this.crosshair.clear();
		this.crosshair.lineStyle(3, 16711680, 1);
		this.crosshair.strokeCircle(0, 0, 15);
		this.crosshair.beginPath();
		this.crosshair.moveTo(-25, 0);
		this.crosshair.lineTo(-5, 0);
		this.crosshair.moveTo(5, 0);
		this.crosshair.lineTo(25, 0);
		this.crosshair.moveTo(0, -25);
		this.crosshair.lineTo(0, -5);
		this.crosshair.moveTo(0, 5);
		this.crosshair.lineTo(0, 25);
		this.crosshair.strokePath();
	}
	startWave() {
		this.targetGroup.clear(true, true);
		const mainGroupIdx = __webpack_exports__default.Math.Between(0, WORD_GROUPS.length - 1);
		let oddGroupIdx = __webpack_exports__default.Math.Between(0, WORD_GROUPS.length - 1);
		while (oddGroupIdx === mainGroupIdx) oddGroupIdx = __webpack_exports__default.Math.Between(0, WORD_GROUPS.length - 1);
		const mainGroup = WORD_GROUPS[mainGroupIdx];
		const oddGroup = WORD_GROUPS[oddGroupIdx];
		const mainWords = __webpack_exports__default.Utils.Array.Shuffle([...mainGroup.words]).slice(0, 4);
		const oddWord = __webpack_exports__default.Utils.Array.Shuffle([...oddGroup.words])[0];
		const waveWords = [...mainWords.map((w) => ({
			word: w,
			isOdd: false
		})), {
			word: oddWord,
			isOdd: true
		}];
		__webpack_exports__default.Utils.Array.Shuffle(waveWords);
		waveWords.forEach((item, i) => {
			this.spawnTarget(item.word, item.isOdd, i);
		});
	}
	spawnTarget(word, isOdd, index) {
		const startLeft = Math.random() > .5;
		const x = startLeft ? -100 - Math.random() * 200 : 900 + Math.random() * 200;
		const y = 150 + index * 80 + Math.random() * 40;
		const container = this.add.container(x, y);
		const colors = [
			16729156,
			4521796,
			4474111,
			16777028,
			16729343,
			4521983,
			16750848
		];
		const balloonColor = colors[__webpack_exports__default.Math.Between(0, colors.length - 1)];
		const g = this.add.graphics();
		g.fillStyle(balloonColor, 1);
		g.fillCircle(0, -40, 35);
		g.lineStyle(2, 0, 1);
		g.strokeCircle(0, -40, 35);
		g.beginPath();
		g.moveTo(-15, -10);
		g.lineTo(-15, 10);
		g.moveTo(15, -10);
		g.lineTo(15, 10);
		g.strokePath();
		g.fillStyle(9127187, 1);
		g.fillRect(-20, 10, 40, 25);
		g.strokeRect(-20, 10, 40, 25);
		g.fillStyle(16777215, .95);
		g.fillRoundedRect(-70, 40, 140, 35, 8);
		g.strokeRoundedRect(-70, 40, 140, 35, 8);
		const text = this.add.text(0, 57, word, {
			fontSize: "20px",
			fontFamily: "Arial",
			fill: "#000000",
			fontStyle: "bold"
		}).setOrigin(.5, .5);
		container.add([g, text]);
		container.setSize(140, 150);
		container.setInteractive(new __webpack_exports__default.Geom.Rectangle(-70, -75, 140, 150), __webpack_exports__default.Geom.Rectangle.Contains);
		const scale = Math.random() * .3 + .85;
		container.setScale(scale);
		container.wordData = {
			word,
			isOdd,
			baseY: y,
			speed: (Math.random() * 1.5 + 1.5) * (startLeft ? 1 : -1),
			timeOffset: Math.random() * Math.PI * 2,
			fleeing: false
		};
		this.targetGroup.add(container);
	}
	shoot(pointer) {
		this.tweens.add({
			targets: this.crosshair,
			scaleX: 1.5,
			scaleY: 1.5,
			duration: 50,
			yoyo: true
		});
		const flash = this.add.graphics();
		flash.fillStyle(16776960, .6);
		flash.fillCircle(pointer.x, pointer.y, 40);
		this.tweens.add({
			targets: flash,
			alpha: 0,
			scaleX: 2,
			scaleY: 2,
			duration: 200,
			onComplete: () => flash.destroy()
		});
		const targets = this.targetGroup.getChildren();
		for (let i = targets.length - 1; i >= 0; i--) {
			const t = targets[i];
			if (t.getBounds().contains(pointer.x, pointer.y) && !t.wordData.fleeing) {
				this.hitTarget(t);
				break;
			}
		}
	}
	hitTarget(target) {
		const isOdd = target.wordData.isOdd;
		const x = target.x;
		const y = target.y;
		target.destroy();
		if (isOdd) {
			this.cameras.main.shake(150, .015);
			this.createExplosion(x, y - 40, 65280);
			this.showFloatingText(x, y, "+10", "#00ff00");
			this.score += 10;
			this.targetGroup.getChildren().forEach((t) => {
				t.wordData.fleeing = true;
				t.wordData.speed = t.wordData.speed > 0 ? 15 : -15;
			});
			this.time.delayedCall(1500, () => {
				this.startWave();
			});
		} else {
			this.cameras.main.shake(100, .005);
			this.createExplosion(x, y - 40, 16711680);
			this.showFloatingText(x, y, "-5", "#ff0000");
			this.score = Math.max(0, this.score - 5);
		}
		this.scoreText.setText("Punkte: " + this.score);
	}
	createExplosion(x, y, colorTint) {
		const emitterConfig = {
			speed: {
				min: 100,
				max: 300
			},
			angle: {
				min: 0,
				max: 360
			},
			scale: {
				start: 1,
				end: 0
			},
			blendMode: "ADD",
			lifespan: 600,
			gravityY: 300,
			tint: colorTint
		};
		if (__webpack_exports__default.VERSION && parseInt(__webpack_exports__default.VERSION.split(".")[1]) >= 60) {
			const emitter = this.add.particles(x, y, "particle", {
				...emitterConfig,
				emitting: false
			});
			emitter.explode(40);
			this.time.delayedCall(1e3, () => emitter.destroy());
		} else {
			const particles = this.add.particles("particle");
			particles.createEmitter({
				...emitterConfig,
				on: false
			}).explode(40, x, y);
			this.time.delayedCall(1e3, () => particles.destroy());
		}
	}
	showFloatingText(x, y, msg, color) {
		const txt = this.add.text(x, y, msg, {
			fontSize: "40px",
			fontFamily: "Arial",
			fill: color,
			fontStyle: "bold",
			stroke: "#ffffff",
			strokeThickness: 4
		}).setOrigin(.5, .5).setDepth(150);
		this.tweens.add({
			targets: txt,
			y: y - 100,
			alpha: 0,
			duration: 1e3,
			ease: "Power1",
			onComplete: () => txt.destroy()
		});
	}
	update(time, delta) {
		const t = time / 1e3;
		this.targetGroup.getChildren().forEach((target) => {
			const data = target.wordData;
			target.x += data.speed;
			if (!data.fleeing) target.y = data.baseY + Math.sin(t * 3 + data.timeOffset) * 25;
			if (!data.fleeing) {
				if (data.speed > 0 && target.x > 900) target.x = -100;
				else if (data.speed < 0 && target.x < -100) target.x = 900;
			}
		});
	}
};
var FaskaMoorhuhn = ({ onExit }) => {
	const gameContainer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 800,
			height: 600,
			parent: gameContainer.current,
			backgroundColor: "#000000",
			physics: {
				default: "arcade",
				arcade: {
					gravity: { y: 0 },
					debug: false
				}
			},
			scene: FaskaMoorhuhnScene
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
			borderRadius: "10px",
			boxShadow: "0 10px 20px rgba(0,0,0,0.5)"
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
				backgroundColor: "#ff4444",
				color: "white",
				border: "3px solid #cc0000",
				borderRadius: "8px",
				cursor: "pointer",
				boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
				textTransform: "uppercase"
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
export { FaskaMoorhuhn as default };
