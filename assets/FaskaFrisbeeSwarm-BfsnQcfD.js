import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaFrisbeeSwarm/FaskaFrisbeeSwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FaskaFrisbeeSwarm = ({ onExit }) => {
	const gameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		class MainScene extends __webpack_exports__default.Scene {
			constructor() {
				super({ key: "MainScene" });
			}
			init() {
				this.score = 0;
				this.wind = new __webpack_exports__default.Math.Vector2(0, 0);
				this.isAiming = false;
				this.isFlying = false;
				this.startDragPoint = new __webpack_exports__default.Math.Vector2();
				this.endDragPoint = new __webpack_exports__default.Math.Vector2();
			}
			create() {
				this.cameras.main.setBackgroundColor("#2e8b57");
				this.trees = [];
				for (let i = 0; i < 15; i++) {
					const x = __webpack_exports__default.Math.Between(0, 800);
					const y = __webpack_exports__default.Math.Between(0, 600);
					this.drawTree(x, y).setDepth(1);
				}
				this.generateTextures();
				this.target = this.physics.add.sprite(400, 100, "dogTex");
				this.target.body.setCircle(20, 5, 5);
				this.target.setDepth(3);
				this.player = this.add.sprite(400, 500, "playerTex");
				this.player.setDepth(4);
				this.frisbee = this.physics.add.sprite(400, 500, "frisbeeTex");
				this.frisbee.body.setCircle(15);
				this.frisbee.setDepth(5);
				this.frisbee.setVisible(false);
				this.uiText = this.add.text(20, 20, "", {
					font: "16px monospace",
					fill: "#ffffff",
					backgroundColor: "#000000bb",
					padding: {
						x: 15,
						y: 15
					}
				});
				this.uiText.setDepth(10);
				this.add.text(400, 570, "Tip: The wind vector adds acceleration to your frisbee. Aim against it!", {
					font: "16px Arial",
					fill: "#ffffff",
					backgroundColor: "#000000aa",
					padding: {
						x: 10,
						y: 5
					}
				}).setOrigin(.5).setDepth(10);
				this.graphics = this.add.graphics();
				this.graphics.setDepth(2);
				this.setupNewRound();
				this.input.on("pointerdown", this.onPointerDown, this);
				this.input.on("pointermove", this.onPointerMove, this);
				this.input.on("pointerup", this.onPointerUp, this);
				this.physics.add.overlap(this.frisbee, this.target, this.onHitTarget, null, this);
			}
			drawTree(x, y) {
				const tree = this.add.graphics();
				tree.fillStyle(9127187, 1);
				tree.fillRect(x - 5, y, 10, 20);
				tree.fillStyle(25600, 1);
				tree.fillCircle(x, y, 20);
				tree.fillStyle(2263842, 1);
				tree.fillCircle(x + 5, y - 5, 15);
				return tree;
			}
			generateTextures() {
				const pGr = this.add.graphics();
				pGr.fillStyle(4286945, 1);
				pGr.fillCircle(20, 20, 20);
				pGr.fillStyle(16770244, 1);
				pGr.fillCircle(20, 10, 10);
				pGr.generateTexture("playerTex", 40, 40);
				pGr.destroy();
				const fGr = this.add.graphics();
				fGr.fillStyle(16777215, 1);
				fGr.fillCircle(15, 15, 15);
				fGr.lineStyle(3, 16711680, 1);
				fGr.beginPath();
				fGr.moveTo(0, 15);
				fGr.lineTo(30, 15);
				fGr.strokePath();
				fGr.generateTexture("frisbeeTex", 30, 30);
				fGr.destroy();
				const dogGr = this.add.graphics();
				dogGr.fillStyle(9127187, 1);
				dogGr.fillEllipse(25, 25, 40, 20);
				dogGr.fillCircle(40, 15, 12);
				dogGr.fillTriangle(45, 5, 50, -5, 35, 5);
				dogGr.lineStyle(4, 9127187, 1);
				dogGr.beginPath();
				dogGr.moveTo(10, 20);
				dogGr.lineTo(0, 10);
				dogGr.strokePath();
				dogGr.generateTexture("dogTex", 50, 50);
				dogGr.destroy();
				const pt = this.add.graphics();
				pt.fillStyle(16777215, 1);
				pt.fillCircle(4, 4, 4);
				pt.generateTexture("particle", 8, 8);
				pt.destroy();
				const st = this.add.graphics();
				st.fillStyle(16777215, 1);
				st.fillCircle(8, 8, 8);
				st.generateTexture("star", 16, 16);
				st.destroy();
				this.trailEmitter = this.add.particles(0, 0, "particle", {
					speed: 10,
					scale: {
						start: .8,
						end: 0
					},
					alpha: {
						start: .6,
						end: 0
					},
					lifespan: 400,
					blendMode: "ADD"
				});
				this.trailEmitter.setDepth(4);
				this.trailEmitter.stop();
				this.explosionEmitter = this.add.particles(0, 0, "star", {
					speed: {
						min: 100,
						max: 300
					},
					scale: {
						start: 1,
						end: 0
					},
					alpha: {
						start: 1,
						end: 0
					},
					lifespan: 1e3,
					tint: [
						16776960,
						16755200,
						16711680,
						16777215
					],
					blendMode: "ADD",
					emitting: false
				});
				this.explosionEmitter.setDepth(10);
			}
			updateWindParticles() {
				if (this.windEmitter) this.windEmitter.destroy();
				this.windEmitter = this.add.particles(0, 0, "particle", {
					x: {
						min: -100,
						max: 900
					},
					y: {
						min: -100,
						max: 700
					},
					lifespan: 2e3,
					speedX: this.wind.x,
					speedY: this.wind.y,
					alpha: {
						start: .1,
						end: 0
					},
					scale: {
						start: .5,
						end: 1.5
					},
					blendMode: "ADD",
					frequency: 100
				});
				this.windEmitter.setDepth(2);
			}
			setupNewRound() {
				this.isAiming = false;
				this.isFlying = false;
				this.frisbee.setPosition(this.player.x, this.player.y);
				this.frisbee.body.setVelocity(0, 0);
				this.frisbee.body.setAcceleration(0, 0);
				this.frisbee.setVisible(true);
				this.trailEmitter.stop();
				this.trailEmitter.startFollow(this.frisbee);
				this.target.setPosition(__webpack_exports__default.Math.Between(150, 650), __webpack_exports__default.Math.Between(100, 250));
				const windX = __webpack_exports__default.Math.Between(-300, 300);
				const windY = __webpack_exports__default.Math.Between(-150, 150);
				this.wind.set(windX, windY);
				this.updateWindParticles();
				this.updateUI();
			}
			updateUI() {
				this.uiText.setText(`🏆 Score: ${this.score}\n\n💨 WIND EQUATION:\nv(t) = v₀ + a·t\na = [ ${this.wind.x.toFixed(0)}, ${this.wind.y.toFixed(0)} ] px/s²\n\nPull back to aim (v₀)`);
			}
			onPointerDown(pointer) {
				if (this.isFlying) return;
				this.isAiming = true;
				this.startDragPoint.set(pointer.x, pointer.y);
			}
			onPointerMove(pointer) {
				if (!this.isAiming) return;
				this.endDragPoint.set(pointer.x, pointer.y);
				const maxDrag = 200;
				let dx = this.startDragPoint.x - pointer.x;
				let dy = this.startDragPoint.y - pointer.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist > maxDrag) {
					dx = dx / dist * maxDrag;
					dy = dy / dist * maxDrag;
				}
				this.graphics.clear();
				this.graphics.lineStyle(2, 16777215, .5);
				this.graphics.beginPath();
				this.graphics.moveTo(this.player.x, this.player.y);
				this.graphics.lineTo(this.player.x + dx * 5, this.player.y + dy * 5);
				this.graphics.strokePath();
				this.graphics.lineStyle(4, 16755200, 1);
				this.graphics.beginPath();
				this.graphics.moveTo(this.player.x, this.player.y);
				this.graphics.lineTo(this.player.x - dx, this.player.y - dy);
				this.graphics.strokePath();
			}
			onPointerUp(pointer) {
				if (!this.isAiming) return;
				this.isAiming = false;
				this.graphics.clear();
				const maxDrag = 200;
				let dx = this.startDragPoint.x - pointer.x;
				let dy = this.startDragPoint.y - pointer.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist > maxDrag) {
					dx = dx / dist * maxDrag;
					dy = dy / dist * maxDrag;
				}
				const speedMult = 4;
				this.isFlying = true;
				this.frisbee.body.setVelocity(dx * speedMult, dy * speedMult);
				this.frisbee.body.setAcceleration(this.wind.x, this.wind.y);
				this.trailEmitter.start();
			}
			onHitTarget() {
				if (!this.isFlying) return;
				this.isFlying = false;
				this.frisbee.body.setVelocity(0, 0);
				this.frisbee.body.setAcceleration(0, 0);
				this.trailEmitter.stop();
				this.cameras.main.shake(200, .015);
				this.explosionEmitter.emitParticleAt(this.target.x, this.target.y, 50);
				this.score += 20;
				this.updateUI();
				const text = this.add.text(this.target.x, this.target.y - 30, "CATCH!", {
					font: "32px Arial",
					fill: "#00ff00",
					stroke: "#ffffff",
					strokeThickness: 4
				}).setOrigin(.5).setDepth(20);
				this.tweens.add({
					targets: text,
					y: text.y - 50,
					alpha: 0,
					scale: 1.5,
					duration: 1e3,
					onComplete: () => {
						text.destroy();
						this.setupNewRound();
					}
				});
			}
			missThrow() {
				this.isFlying = false;
				this.cameras.main.shake(150, .005);
				this.trailEmitter.stop();
				this.frisbee.body.setVelocity(0, 0);
				this.frisbee.body.setAcceleration(0, 0);
				this.score = Math.max(0, this.score - 5);
				this.updateUI();
				const text = this.add.text(this.frisbee.x, this.frisbee.y, "Miss!", {
					font: "24px Arial",
					fill: "#ff0000",
					stroke: "#ffffff",
					strokeThickness: 4
				}).setOrigin(.5).setDepth(20);
				this.tweens.add({
					targets: text,
					y: text.y - 50,
					alpha: 0,
					duration: 1e3,
					onComplete: () => {
						text.destroy();
						this.setupNewRound();
					}
				});
			}
			update(time, delta) {
				if (this.isFlying) {
					this.frisbee.rotation += .2;
					if (this.frisbee.x < -100 || this.frisbee.x > 900 || this.frisbee.y < -100 || this.frisbee.y > 700) this.missThrow();
				}
			}
		}
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
			scene: [MainScene]
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
			borderRadius: "8px",
			boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: gameRef }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "15px",
				right: "15px",
				padding: "10px 20px",
				fontSize: "16px",
				fontWeight: "bold",
				backgroundColor: "#ff4444",
				color: "white",
				border: "2px solid #fff",
				borderRadius: "8px",
				cursor: "pointer",
				zIndex: 10,
				boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
			},
			onMouseOver: (e) => e.target.style.backgroundColor = "#ff0000",
			onMouseOut: (e) => e.target.style.backgroundColor = "#ff4444",
			children: "Beenden"
		})]
	});
};
//#endregion
export { FaskaFrisbeeSwarm as default };
