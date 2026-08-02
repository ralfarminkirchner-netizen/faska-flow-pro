import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaRockRacingSwarm/FaskaRockRacingSwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function FaskaRockRacingSwarm({ onExit }) {
	const gameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		class MainScene extends __webpack_exports__default.Scene {
			constructor() {
				super("MainScene");
				this.sequence = [
					"G",
					"G",
					"G",
					"Eb",
					"F",
					"F",
					"F",
					"D"
				];
				this.seqIndex = 0;
				this.weaponLevel = 1;
				this.score = 0;
				this.aiCars = [];
				this.segments = [
					{
						p1: {
							x: 0,
							y: -1100
						},
						p2: {
							x: 1466,
							y: 0
						}
					},
					{
						p1: {
							x: 1466,
							y: 0
						},
						p2: {
							x: 0,
							y: 1100
						}
					},
					{
						p1: {
							x: 0,
							y: 1100
						},
						p2: {
							x: -1466,
							y: 0
						}
					},
					{
						p1: {
							x: -1466,
							y: 0
						},
						p2: {
							x: 0,
							y: -1100
						}
					}
				];
			}
			create() {
				this.generateTextures();
				this.createTrack();
				this.flareEmitter = this.add.particles(0, 0, "flare", {
					speed: {
						min: 100,
						max: 300
					},
					lifespan: 600,
					blendMode: "ADD",
					scale: {
						start: 1,
						end: 0
					},
					emitting: false
				});
				this.player = this.matter.add.image(0, -1100, "player_car");
				this.player.setFrictionAir(.05);
				this.player.setFriction(.2);
				this.player.setBounce(.5);
				this.player.body.label = "player";
				for (let i = 0; i < 6; i++) this.spawnAI();
				this.notesGroup = this.add.group();
				for (let i = 0; i < 25; i++) this.spawnNote();
				this.updateNotesAppearance();
				this.cursors = this.input.keyboard.createCursorKeys();
				this.spaceBar = this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.SPACE);
				this.shiftKey = this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.SHIFT);
				this.wasd = {
					w: this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.W),
					a: this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.A),
					s: this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.S),
					d: this.input.keyboard.addKey(__webpack_exports__default.Input.Keyboard.KeyCodes.D)
				};
				this.cameras.main.startFollow(this.player, true, .1, .1);
				this.cameras.main.setZoom(.8);
				this.uiContainer = this.add.container(0, 0);
				this.uiContainer.setScrollFactor(0);
				this.uiContainer.setScale(1.25);
				this.uiBg = this.add.rectangle(0, 0, 4e3, 100, 0, .7).setOrigin(0, 0);
				this.uiContainer.add(this.uiBg);
				this.seqText = this.add.text(20, 15, "", {
					fontSize: "24px",
					color: "#fff",
					fontStyle: "bold"
				});
				this.uiContainer.add(this.seqText);
				this.msgText = this.add.text(window.innerWidth / 2, window.innerHeight / 3, "RACE AND COLLECT NOTES!", {
					fontSize: "48px",
					color: "#ffff00",
					fontStyle: "bold",
					stroke: "#000",
					strokeThickness: 6
				}).setOrigin(.5);
				this.uiContainer.add(this.msgText);
				this.time.delayedCall(3e3, () => {
					this.tweens.add({
						targets: this.msgText,
						alpha: 0,
						duration: 500
					});
				});
				this.updateUIText();
				this.matter.world.on("collisionstart", this.handleCollisions, this);
			}
			update(time, delta) {
				if (!this.player || !this.player.active) return;
				this.updatePlayer();
				this.updateAI();
				if (__webpack_exports__default.Input.Keyboard.JustDown(this.spaceBar)) this.fireProjectile();
				if (__webpack_exports__default.Input.Keyboard.JustDown(this.shiftKey)) this.dropMine();
			}
			updatePlayer() {
				const up = this.cursors.up.isDown || this.wasd.w.isDown;
				const down = this.cursors.down.isDown || this.wasd.s.isDown;
				const left = this.cursors.left.isDown || this.wasd.a.isDown;
				const right = this.cursors.right.isDown || this.wasd.d.isDown;
				if (up) {
					this.player.applyForce({
						x: Math.cos(this.player.rotation) * .002,
						y: Math.sin(this.player.rotation) * .002
					});
					if (Math.random() < .3) {
						this.flareEmitter.setParticleTint(16746496);
						this.flareEmitter.emitParticleAt(this.player.x - Math.cos(this.player.rotation) * 25, this.player.y - Math.sin(this.player.rotation) * 25);
					}
				} else if (down) this.player.applyForce({
					x: -Math.cos(this.player.rotation) * .001,
					y: -Math.sin(this.player.rotation) * .001
				});
				if (Math.sqrt(this.player.body.velocity.x ** 2 + this.player.body.velocity.y ** 2) > .5) {
					let steer = 0;
					if (left) steer = -.06;
					if (right) steer = .06;
					if (this.player.body.velocity.x * Math.cos(this.player.rotation) + this.player.body.velocity.y * Math.sin(this.player.rotation) < 0) steer *= -1;
					this.player.setAngularVelocity(steer);
				} else this.player.setAngularVelocity(0);
				this.applyGrip(this.player, .85);
			}
			updateAI() {
				this.aiCars.forEach((ai) => {
					if (!ai.active || ai.speedMultiplier <= 0) return;
					const wp = this.segments[ai.waypointIndex].p1;
					if (__webpack_exports__default.Math.Distance.Between(ai.x, ai.y, wp.x, wp.y) < 300) ai.waypointIndex = (ai.waypointIndex + 1) % 4;
					const angleToWp = __webpack_exports__default.Math.Angle.Between(ai.x, ai.y, wp.x, wp.y);
					let diff = __webpack_exports__default.Math.Angle.Wrap(angleToWp - ai.rotation);
					if (diff > .1) ai.setAngularVelocity(.04);
					else if (diff < -.1) ai.setAngularVelocity(-.04);
					else ai.setAngularVelocity(0);
					const force = .0015 * ai.speedMultiplier;
					ai.applyForce({
						x: Math.cos(ai.rotation) * force,
						y: Math.sin(ai.rotation) * force
					});
					this.applyGrip(ai, .9);
					if (Math.abs(ai.body.velocity.x) < .2 && Math.abs(ai.body.velocity.y) < .2) {
						ai.stuckTimer = (ai.stuckTimer || 0) + 1;
						if (ai.stuckTimer > 60) {
							ai.applyForce({
								x: -Math.cos(ai.rotation) * .01,
								y: -Math.sin(ai.rotation) * .01
							});
							ai.stuckTimer = 0;
							ai.waypointIndex = (ai.waypointIndex + 1) % 4;
						}
					} else ai.stuckTimer = 0;
				});
			}
			applyGrip(car, gripFactor) {
				if (!car.body) return;
				const vel = car.body.velocity;
				const angle = car.rotation;
				const lx = -Math.sin(angle);
				const ly = Math.cos(angle);
				const lateralDot = vel.x * lx + vel.y * ly;
				car.setVelocity(vel.x - lx * lateralDot * gripFactor, vel.y - ly * lateralDot * gripFactor);
			}
			fireProjectile() {
				const angle = this.player.rotation;
				const speed = 25;
				const numProj = this.weaponLevel > 1 ? this.weaponLevel > 2 ? 5 : 3 : 1;
				const spread = .15;
				for (let i = 0; i < numProj; i++) {
					let a = angle;
					if (numProj === 3) {
						if (i === 0) a -= spread;
						if (i === 2) a += spread;
					} else if (numProj === 5) a += (i - 2) * spread;
					const x = this.player.x + Math.cos(a) * 30;
					const y = this.player.y + Math.sin(a) * 30;
					const p = this.matter.add.image(x, y, "flare");
					p.setTint(16776960);
					p.setCircle(8);
					p.setFrictionAir(0);
					p.setBounce(1);
					p.body.label = "projectile";
					p.setVelocity(Math.cos(a) * speed, Math.sin(a) * speed);
					this.time.delayedCall(1500, () => {
						if (p && p.active) p.destroy();
					});
				}
			}
			dropMine() {
				const x = this.player.x - Math.cos(this.player.rotation) * 40;
				const y = this.player.y - Math.sin(this.player.rotation) * 40;
				const m = this.matter.add.image(x, y, "flare");
				m.setTint(16711680);
				m.setScale(1.5);
				m.setCircle(12);
				m.setStatic(true);
				m.setSensor(true);
				m.body.label = "mine";
				this.tweens.add({
					targets: m,
					alpha: .2,
					yoyo: true,
					repeat: -1,
					duration: 300
				});
			}
			handleCollisions(event) {
				event.pairs.forEach((pair) => {
					const goA = pair.bodyA.gameObject;
					const goB = pair.bodyB.gameObject;
					if (!goA || !goB) return;
					const lA = pair.bodyA.label;
					const lB = pair.bodyB.label;
					if (lA === "player" && lB === "note") this.collectNote(goB);
					else if (lB === "player" && lA === "note") this.collectNote(goA);
					if (lA === "projectile" && lB === "ai") this.hitAI(goB, goA);
					else if (lB === "projectile" && lA === "ai") this.hitAI(goA, goB);
					if (lA === "mine" && lB === "ai") this.hitAI(goB, goA, true);
					else if (lB === "mine" && lA === "ai") this.hitAI(goA, goB, true);
				});
			}
			collectNote(noteContainer) {
				if (noteContainer.collected) return;
				noteContainer.collected = true;
				if (noteContainer.letter === this.sequence[this.seqIndex]) {
					this.seqIndex++;
					this.score += 100;
					this.flareEmitter.setParticleTint(65280);
					this.flareEmitter.explode(30, noteContainer.x, noteContainer.y);
					this.cameras.main.shake(100, .01);
					this.showMessage("PERFECT!", "#00ff00");
					if (this.seqIndex >= this.sequence.length) {
						this.weaponLevel = Math.min(this.weaponLevel + 1, 3);
						this.seqIndex = 0;
						this.showMessage("WEAPON UPGRADED!\nROCK N ROLL!", "#ff00ff", 3e3);
						this.score += 1e3;
					}
				} else {
					this.flareEmitter.setParticleTint(16711680);
					this.flareEmitter.explode(20, noteContainer.x, noteContainer.y);
					this.showMessage("WRONG NOTE!", "#ff0000");
					this.cameras.main.shake(200, .02);
				}
				this.updateUIText();
				noteContainer.destroy();
				this.spawnNote();
				this.updateNotesAppearance();
			}
			hitAI(ai, weapon, isMine = false) {
				if (!ai.active) return;
				if (weapon && weapon.active) weapon.destroy();
				this.flareEmitter.setParticleTint(16746496);
				this.flareEmitter.explode(40, ai.x, ai.y);
				this.cameras.main.shake(150, .015);
				ai.setAngularVelocity(.5);
				ai.setVelocity(0, 0);
				ai.speedMultiplier = 0;
				this.time.delayedCall(2e3, () => {
					if (ai && ai.active) ai.speedMultiplier = __webpack_exports__default.Math.RND.realInRange(.8, 1.2);
				});
			}
			spawnAI() {
				const seg = __webpack_exports__default.Math.RND.pick(this.segments);
				const ai = this.matter.add.image(seg.p1.x, seg.p1.y, "ai_car");
				ai.setFrictionAir(.05);
				ai.setFriction(.2);
				ai.setBounce(.5);
				ai.body.label = "ai";
				ai.waypointIndex = __webpack_exports__default.Math.RND.between(0, 3);
				ai.speedMultiplier = __webpack_exports__default.Math.RND.realInRange(.8, 1.2);
				this.aiCars.push(ai);
			}
			spawnNote() {
				const seg = __webpack_exports__default.Math.RND.pick(this.segments);
				const t = __webpack_exports__default.Math.RND.frac();
				const x = seg.p1.x + (seg.p2.x - seg.p1.x) * t + __webpack_exports__default.Math.RND.between(-120, 120);
				const y = seg.p1.y + (seg.p2.y - seg.p1.y) * t + __webpack_exports__default.Math.RND.between(-120, 120);
				const letter = __webpack_exports__default.Math.RND.pick([
					"G",
					"Eb",
					"F",
					"D",
					"A",
					"C",
					"B"
				]);
				const circle = this.add.circle(0, 0, 30, 65535);
				circle.setStrokeStyle(4, 16777215);
				const text = this.add.text(0, 0, letter, {
					fontSize: "28px",
					color: "#000",
					fontStyle: "bold"
				}).setOrigin(.5);
				const container = this.add.container(x, y, [circle, text]);
				this.matter.add.gameObject(container, {
					isSensor: true,
					isStatic: true,
					circleRadius: 30
				});
				container.body.label = "note";
				container.letter = letter;
				this.notesGroup.add(container);
				this.tweens.add({
					targets: container,
					y: y - 15,
					yoyo: true,
					repeat: -1,
					duration: 800 + Math.random() * 400,
					ease: "Sine.easeInOut"
				});
			}
			updateNotesAppearance() {
				const required = this.sequence[this.seqIndex];
				let correctCount = 0;
				const children = this.notesGroup.getChildren();
				children.forEach((container) => {
					const circle = container.list[0];
					if (container.letter === required) {
						circle.setFillStyle(16776960);
						correctCount++;
					} else circle.setFillStyle(65535);
				});
				if (correctCount < 5) {
					let needed = 5 - correctCount;
					for (let i = 0; i < children.length && needed > 0; i++) {
						const container = children[i];
						if (container.letter !== required) {
							container.letter = required;
							container.list[1].setText(required);
							container.list[0].setFillStyle(16776960);
							needed--;
						}
					}
				}
			}
			updateUIText() {
				const collected = this.sequence.slice(0, this.seqIndex).join(" ");
				const next = this.sequence[this.seqIndex] || "";
				const remaining = this.sequence.slice(this.seqIndex + 1).join(" ");
				this.seqText.setText(`Melody: ${this.sequence.join(" ")}\nProgress: ${collected} [${next}] ${remaining}\nScore: ${this.score} | Weapon LVL: ${this.weaponLevel}`);
			}
			showMessage(text, color, duration = 1500) {
				this.msgText.setText(text);
				this.msgText.setColor(color);
				this.msgText.setAlpha(1);
				this.msgText.setScale(.5);
				this.tweens.killTweensOf(this.msgText);
				this.tweens.add({
					targets: this.msgText,
					scale: 1.2,
					duration: 300,
					yoyo: true,
					ease: "Back.easeOut"
				});
				if (this.msgTimer) this.msgTimer.remove();
				this.msgTimer = this.time.delayedCall(duration, () => {
					this.tweens.add({
						targets: this.msgText,
						alpha: 0,
						duration: 300
					});
				});
			}
			createTrack() {
				const O0 = {
					x: 0,
					y: -2e3
				};
				const O1 = {
					x: 2666,
					y: 0
				};
				const O2 = {
					x: 0,
					y: 2e3
				};
				const O3 = {
					x: -2666,
					y: 0
				};
				const I0 = {
					x: 0,
					y: -800
				};
				const I1 = {
					x: 1066,
					y: 0
				};
				const I2 = {
					x: 0,
					y: 800
				};
				const I3 = {
					x: -1066,
					y: 0
				};
				const buildWall = (p1, p2) => {
					const cx = (p1.x + p2.x) / 2;
					const cy = (p1.y + p2.y) / 2;
					const len = __webpack_exports__default.Math.Distance.Between(p1.x, p1.y, p2.x, p2.y);
					const ang = __webpack_exports__default.Math.Angle.Between(p1.x, p1.y, p2.x, p2.y);
					const rect = this.add.rectangle(cx, cy, len + 150, 150, 3355443);
					rect.setStrokeStyle(4, 16755200);
					this.matter.add.gameObject(rect, {
						isStatic: true,
						angle: ang,
						restitution: .5,
						friction: .1
					});
				};
				buildWall(O0, O1);
				buildWall(O1, O2);
				buildWall(O2, O3);
				buildWall(O3, O0);
				buildWall(I0, I1);
				buildWall(I1, I2);
				buildWall(I2, I3);
				buildWall(I3, I0);
				const g = this.add.graphics();
				g.lineStyle(2, 5592405, .3);
				for (let i = -3e3; i <= 3e3; i += 200) {
					g.moveTo(i, -2e3);
					g.lineTo(i, 2e3);
					g.moveTo(-3e3, i);
					g.lineTo(3e3, i);
				}
				g.setDepth(-1);
			}
			generateTextures() {
				const gCar = this.make.graphics({
					x: 0,
					y: 0,
					add: false
				});
				gCar.fillStyle(22015);
				gCar.fillRoundedRect(0, 0, 50, 26, 6);
				gCar.fillStyle(43775);
				gCar.fillRoundedRect(12, 3, 24, 20, 4);
				gCar.fillStyle(16776960);
				gCar.fillRect(45, 3, 5, 6);
				gCar.fillRect(45, 17, 5, 6);
				gCar.fillStyle(16711680);
				gCar.fillRect(0, 3, 4, 6);
				gCar.fillRect(0, 17, 4, 6);
				gCar.generateTexture("player_car", 50, 26);
				const gAi = this.make.graphics({
					x: 0,
					y: 0,
					add: false
				});
				gAi.fillStyle(16711680);
				gAi.fillRoundedRect(0, 0, 50, 26, 6);
				gAi.fillStyle(16733525);
				gAi.fillRoundedRect(12, 3, 24, 20, 4);
				gAi.fillStyle(16776960);
				gAi.fillRect(45, 3, 5, 6);
				gAi.fillRect(45, 17, 5, 6);
				gAi.fillStyle(16711680);
				gAi.fillRect(0, 3, 4, 6);
				gAi.fillRect(0, 17, 4, 6);
				gAi.generateTexture("ai_car", 50, 26);
				const gFlare = this.make.graphics({
					x: 0,
					y: 0,
					add: false
				});
				gFlare.fillStyle(16777215, 1);
				gFlare.fillCircle(16, 16, 16);
				gFlare.generateTexture("flare", 32, 32);
			}
		}
		const config = {
			type: __webpack_exports__default.AUTO,
			width: window.innerWidth,
			height: window.innerHeight,
			parent: "phaser-container",
			physics: {
				default: "matter",
				matter: {
					gravity: { y: 0 },
					debug: false
				}
			},
			scene: [MainScene],
			scale: {
				mode: __webpack_exports__default.Scale.RESIZE,
				autoCenter: __webpack_exports__default.Scale.CENTER_BOTH
			}
		};
		gameRef.current = new __webpack_exports__default.Game(config);
		return () => {
			if (gameRef.current) gameRef.current.destroy(true);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100vw",
			height: "100vh",
			overflow: "hidden",
			backgroundColor: "#111"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: "phaser-container",
			style: {
				width: "100%",
				height: "100%"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "20px",
				right: "20px",
				padding: "10px 20px",
				fontSize: "18px",
				backgroundColor: "#ff3333",
				color: "white",
				border: "none",
				borderRadius: "5px",
				cursor: "pointer",
				zIndex: 100,
				boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
			},
			children: "Beenden"
		})]
	});
}
//#endregion
export { FaskaRockRacingSwarm as default };
