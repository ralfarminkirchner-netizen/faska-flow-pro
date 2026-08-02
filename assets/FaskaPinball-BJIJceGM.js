import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaPinball/FaskaPinball.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FaskaPinball = ({ onExit }) => {
	const gameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		class PinballScene extends __webpack_exports__default.Scene {
			constructor() {
				super("PinballScene");
			}
			preload() {
				const gfx = this.add.graphics();
				gfx.fillStyle(16777215, 1);
				gfx.fillCircle(16, 16, 12);
				gfx.fillStyle(11197951, .5);
				gfx.fillCircle(16, 16, 16);
				gfx.generateTexture("ball", 32, 32);
				gfx.clear();
				gfx.fillStyle(2236979, 1);
				gfx.fillCircle(40, 40, 38);
				gfx.lineStyle(6, 65535);
				gfx.strokeCircle(40, 40, 36);
				gfx.generateTexture("bumper", 80, 80);
				gfx.clear();
				gfx.fillStyle(16724838, 1);
				gfx.fillRoundedRect(0, 0, 120, 24, 12);
				gfx.generateTexture("flipper", 120, 24);
				gfx.clear();
				gfx.fillStyle(3359846, 1);
				gfx.fillRect(0, 0, 300, 20);
				gfx.generateTexture("wall", 300, 20);
				gfx.clear();
				gfx.fillStyle(16777215, 1);
				gfx.fillCircle(4, 4, 4);
				gfx.generateTexture("particle", 8, 8);
				gfx.clear();
			}
			create() {
				this.score = 0;
				this.multiplier = 1;
				this.add.grid(300, 400, 600, 800, 40, 40, 0, 0, 65535, .05);
				this.scoreText = this.add.text(20, 20, "SCORE: 0", {
					fontSize: "28px",
					fill: "#fff",
					fontStyle: "bold",
					fontFamily: "Arial"
				}).setDepth(100);
				this.multiText = this.add.text(20, 56, "MULT: x1", {
					fontSize: "22px",
					fill: "#0ff",
					fontStyle: "bold",
					fontFamily: "Arial"
				}).setDepth(100);
				this.add.text(300, 770, "← L-Flipper   R-Flipper →", {
					fontSize: "18px",
					fill: "#888",
					fontFamily: "Arial"
				}).setOrigin(.5).setDepth(100);
				this.add.text(300, 20, "Nomen = Gut, Verben/Adjektive = Schlecht", {
					fontSize: "16px",
					fill: "#aaa",
					fontFamily: "Arial"
				}).setOrigin(.5, 0).setDepth(100);
				const COLLISION_BALL = 1;
				const COLLISION_STOPPER = 2;
				const COLLISION_FLIPPER = 4;
				this.matter.world.setBounds(0, 0, 600, 800, 200, true, true, true, false);
				this.matter.add.image(70, 660, "wall", null, {
					isStatic: true,
					angle: Math.PI / 5,
					collisionFilter: {
						category: COLLISION_BALL,
						mask: 65535
					}
				});
				this.matter.add.image(530, 660, "wall", null, {
					isStatic: true,
					angle: -Math.PI / 5,
					collisionFilter: {
						category: COLLISION_BALL,
						mask: 65535
					}
				});
				this.matter.add.image(100, 50, "wall", null, {
					isStatic: true,
					angle: -Math.PI / 8
				});
				this.matter.add.image(500, 50, "wall", null, {
					isStatic: true,
					angle: Math.PI / 8
				});
				const flipperOptions = {
					density: .1,
					friction: 0,
					restitution: .2,
					collisionFilter: {
						category: COLLISION_FLIPPER,
						mask: 65535
					}
				};
				const stopperOptions = {
					isStatic: true,
					render: { visible: false },
					collisionFilter: {
						category: COLLISION_STOPPER,
						mask: COLLISION_FLIPPER
					}
				};
				this.leftFlipper = this.matter.add.image(200, 720, "flipper", null, flipperOptions);
				this.matter.add.constraint(this.matter.add.rectangle(150, 720, 2, 2, {
					isStatic: true,
					isSensor: true
				}), this.leftFlipper.body, 0, 1, {
					pointA: {
						x: 0,
						y: 0
					},
					pointB: {
						x: -50,
						y: 0
					}
				});
				this.matter.add.circle(240, 680, 10, stopperOptions);
				this.matter.add.circle(240, 740, 10, stopperOptions);
				this.rightFlipper = this.matter.add.image(400, 720, "flipper", null, flipperOptions);
				this.matter.add.constraint(this.matter.add.rectangle(450, 720, 2, 2, {
					isStatic: true,
					isSensor: true
				}), this.rightFlipper.body, 0, 1, {
					pointA: {
						x: 0,
						y: 0
					},
					pointB: {
						x: 50,
						y: 0
					}
				});
				this.matter.add.circle(360, 680, 10, stopperOptions);
				this.matter.add.circle(360, 740, 10, stopperOptions);
				this.bumpers = [];
				const bumperPositions = [
					{
						x: 300,
						y: 180
					},
					{
						x: 180,
						y: 280
					},
					{
						x: 420,
						y: 280
					},
					{
						x: 230,
						y: 420
					},
					{
						x: 370,
						y: 420
					},
					{
						x: 300,
						y: 540
					}
				];
				const nouns = [
					"Apfel",
					"Baum",
					"Haus",
					"Katze",
					"Hund",
					"Auto",
					"Schule",
					"Mond",
					"Buch",
					"Tisch",
					"Feuer",
					"Wasser",
					"Stern",
					"Berg"
				];
				const others = [
					"laufen",
					"spielen",
					"schnell",
					"groß",
					"singen",
					"blau",
					"kalt",
					"lachen",
					"schön",
					"tanzen",
					"lesen",
					"klein",
					"heiß",
					"laut"
				];
				bumperPositions.forEach((pos) => {
					const isNoun = Math.random() > .5;
					const wordList = isNoun ? nouns : others;
					const word = wordList[Math.floor(Math.random() * wordList.length)];
					const bumper = this.matter.add.image(pos.x, pos.y, "bumper", null, {
						isStatic: true,
						restitution: 1.6,
						label: "bumper",
						collisionFilter: {
							category: COLLISION_BALL,
							mask: 65535
						}
					});
					bumper.setCircle(38);
					bumper.wordData = {
						isNoun,
						textObj: this.add.text(pos.x, pos.y, word, {
							fontSize: "16px",
							fill: "#fff",
							fontStyle: "bold",
							fontFamily: "Arial"
						}).setOrigin(.5)
					};
					this.bumpers.push(bumper);
				});
				this.ball = this.matter.add.image(300, 50, "ball", null, {
					restitution: .6,
					friction: .001,
					frictionAir: .001,
					density: .05,
					label: "ball",
					collisionFilter: {
						category: COLLISION_BALL,
						mask: 65535 ^ COLLISION_STOPPER
					}
				});
				this.ball.setCircle(14);
				this.add.particles(0, 0, "particle", {
					speed: 0,
					lifespan: 300,
					scale: {
						start: 1,
						end: 0
					},
					alpha: {
						start: .5,
						end: 0
					},
					blendMode: "ADD",
					follow: this.ball
				});
				this.particles = this.add.particles(0, 0, "particle", {
					lifespan: 800,
					speed: {
						min: 100,
						max: 400
					},
					scale: {
						start: 1,
						end: 0
					},
					blendMode: "ADD",
					emitting: false
				});
				this.cursors = this.input.keyboard.createCursorKeys();
				this.matter.world.on("collisionstart", (event) => {
					event.pairs.forEach((pair) => {
						const { bodyA, bodyB } = pair;
						let bumperBody = null;
						if (bodyA.label === "bumper" && bodyB.label === "ball") bumperBody = bodyA;
						if (bodyB.label === "bumper" && bodyA.label === "ball") bumperBody = bodyB;
						if (bumperBody && bumperBody.gameObject && bumperBody.gameObject.wordData) this.hitBumper(bumperBody.gameObject);
					});
				});
			}
			hitBumper(bumper) {
				const data = bumper.wordData;
				if (data.isNoun) {
					this.multiplier = Math.min(20, this.multiplier + 1);
					this.score += 100 * this.multiplier;
					this.multiText.setText("MULT: x" + this.multiplier);
					this.multiText.setColor("#0f0");
					this.cameras.main.shake(150, .008);
					this.particles.setParticleTint(65280);
					this.particles.emitParticleAt(bumper.x, bumper.y, 20);
					bumper.setTint(65280);
					this.time.delayedCall(200, () => bumper.clearTint());
				} else {
					this.multiplier = 1;
					this.score += 10;
					this.multiText.setText("MULT: x1");
					this.multiText.setColor("#f00");
					this.cameras.main.shake(100, .004);
					this.particles.setParticleTint(16711680);
					this.particles.emitParticleAt(bumper.x, bumper.y, 10);
					bumper.setTint(16711680);
					this.time.delayedCall(200, () => bumper.clearTint());
				}
				this.scoreText.setText("SCORE: " + this.score);
				this.tweens.add({
					targets: [bumper, data.textObj],
					scale: 1.3,
					duration: 100,
					yoyo: true
				});
				const nouns = [
					"Apfel",
					"Baum",
					"Haus",
					"Katze",
					"Hund",
					"Auto",
					"Schule",
					"Mond",
					"Buch",
					"Tisch",
					"Feuer",
					"Wasser",
					"Stern",
					"Berg"
				];
				const others = [
					"laufen",
					"spielen",
					"schnell",
					"groß",
					"singen",
					"blau",
					"kalt",
					"lachen",
					"schön",
					"tanzen",
					"lesen",
					"klein",
					"heiß",
					"laut"
				];
				this.time.delayedCall(500, () => {
					const isNoun = Math.random() > .5;
					const wordList = isNoun ? nouns : others;
					const word = wordList[Math.floor(Math.random() * wordList.length)];
					data.isNoun = isNoun;
					data.textObj.setText(word);
				});
			}
			update() {
				if (this.cursors.left.isDown) this.leftFlipper.setAngularVelocity(-.35);
				else this.leftFlipper.setAngularVelocity(.15);
				if (this.cursors.right.isDown) this.rightFlipper.setAngularVelocity(.35);
				else this.rightFlipper.setAngularVelocity(-.15);
				if (this.ball.y > 850) {
					this.ball.setPosition(300, 50);
					this.ball.setVelocity(0, 0);
					this.multiplier = 1;
					this.multiText.setText("MULT: x1");
					this.multiText.setColor("#0ff");
					this.cameras.main.shake(300, .015);
				}
			}
		}
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 600,
			height: 800,
			parent: gameRef.current,
			backgroundColor: "#0a0a1a",
			physics: {
				default: "matter",
				matter: {
					gravity: { y: 2.5 },
					debug: false
				}
			},
			scene: PinballScene
		};
		const game = new __webpack_exports__default.Game(config);
		return () => {
			game.destroy(true);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "600px",
			height: "800px",
			margin: "0 auto",
			fontFamily: "Arial, sans-serif"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: "15px",
				right: "15px",
				zIndex: 10,
				padding: "8px 16px",
				fontSize: "16px",
				fontWeight: "bold",
				backgroundColor: "#ff3366",
				color: "white",
				border: "2px solid #fff",
				borderRadius: "8px",
				cursor: "pointer",
				boxShadow: "0 0 10px rgba(255,51,102,0.5)",
				textTransform: "uppercase"
			},
			onMouseOver: (e) => e.target.style.transform = "scale(1.05)",
			onMouseOut: (e) => e.target.style.transform = "scale(1)",
			children: "Beenden"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: gameRef,
			style: {
				width: "100%",
				height: "100%",
				borderRadius: "10px",
				overflow: "hidden",
				boxShadow: "0 0 30px rgba(0,255,255,0.2)"
			}
		})]
	});
};
//#endregion
export { FaskaPinball as default };
