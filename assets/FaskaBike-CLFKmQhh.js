import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaBike/FaskaBike.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function FaskaBike({ onExit }) {
	const containerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 800,
			height: 400,
			parent: containerRef.current,
			physics: {
				default: "arcade",
				arcade: { debug: false }
			},
			scene: {
				preload,
				create,
				update
			}
		};
		let player;
		let obstacles;
		let cursors;
		let gameInst;
		let tempBar;
		let speed = 0;
		let temperature = 0;
		let isOverheated = false;
		let lane = 1;
		let z = 0;
		let zVelocity = 0;
		let distance = 0;
		let distanceText;
		const lanesY = [
			250,
			290,
			330,
			370
		];
		function preload() {
			const g = this.add.graphics();
			g.fillStyle(16711680, 1);
			g.fillRect(0, 10, 40, 20);
			g.fillStyle(0, 1);
			g.fillCircle(10, 30, 10);
			g.fillCircle(30, 30, 10);
			g.fillStyle(16777215, 1);
			g.fillRect(25, 0, 10, 10);
			g.generateTexture("bike", 40, 40);
			g.clear();
			g.fillStyle(16753920, 1);
			g.beginPath();
			g.moveTo(0, 40);
			g.lineTo(60, 40);
			g.lineTo(60, 10);
			g.closePath();
			g.fillPath();
			g.generateTexture("ramp", 60, 40);
			g.clear();
			g.fillStyle(9127187, .8);
			g.fillEllipse(40, 20, 80, 40);
			g.generateTexture("mud", 80, 40);
			g.destroy();
		}
		function create() {
			this.add.rectangle(0, 0, 800, 400, 8900331).setOrigin(0, 0);
			this.add.rectangle(0, 200, 800, 200, 2263842).setOrigin(0, 0);
			this.add.rectangle(0, 230, 800, 170, 13808780).setOrigin(0, 0);
			for (let i = 0; i < 4; i++) this.add.rectangle(0, lanesY[i] + 15, 800, 2, 16777215).setOrigin(0, 0).setAlpha(.3);
			obstacles = this.physics.add.group();
			player = this.add.sprite(100, lanesY[lane], "bike");
			tempBar = this.add.rectangle(400, 30, 200, 20, 65280);
			distanceText = this.add.text(600, 20, "Dist: 0", {
				font: "20px Arial",
				fill: "#000"
			});
			cursors = this.input.keyboard.createCursorKeys();
			this.add.text(10, 10, "EXIT", {
				font: "bold 16px Arial",
				fill: "#ffffff",
				backgroundColor: "#ff0000"
			}).setInteractive().on("pointerdown", () => {
				if (onExit) onExit();
			});
			this.time.addEvent({
				delay: 1500,
				loop: true,
				callback: () => {
					if (speed > 5) {
						const obsLane = __webpack_exports__default.Math.Between(0, 3);
						const type = __webpack_exports__default.Math.Between(0, 1) === 0 ? "ramp" : "mud";
						const obs = obstacles.create(850, lanesY[obsLane], type);
						obs.obsLane = obsLane;
						obs.typeStr = type;
					}
				}
			});
		}
		function update() {
			if (isOverheated) {
				speed *= .95;
				temperature -= 2;
				if (temperature <= 0) {
					temperature = 0;
					isOverheated = false;
				}
			} else if (cursors.right.isDown) {
				speed += .5;
				temperature += .5;
			} else if (cursors.left.isDown) {
				speed -= .5;
				temperature -= 1;
			} else {
				speed -= .2;
				temperature -= .5;
			}
			if (temperature > 200) {
				isOverheated = true;
				temperature = 200;
				speed = speed / 2;
			}
			speed = __webpack_exports__default.Math.Clamp(speed, 0, 25);
			temperature = __webpack_exports__default.Math.Clamp(temperature, 0, 200);
			tempBar.width = temperature;
			tempBar.fillColor = temperature > 150 ? 16711680 : temperature > 100 ? 16776960 : 65280;
			distance += speed * .1;
			distanceText.setText("Dist: " + Math.floor(distance));
			if (z > 0) {
				zVelocity -= 1;
				z += zVelocity;
				if (z <= 0) {
					z = 0;
					zVelocity = 0;
					player.angle = 0;
				} else {
					if (cursors.left.isDown) player.angle -= 2;
					if (cursors.right.isDown) player.angle += 2;
				}
			} else if (__webpack_exports__default.Input.Keyboard.JustDown(cursors.up) && lane > 0) lane--;
			else if (__webpack_exports__default.Input.Keyboard.JustDown(cursors.down) && lane < 3) lane++;
			player.y = lanesY[lane] - z;
			obstacles.children.iterate((obs) => {
				if (obs) {
					obs.x -= speed;
					if (obs.x < -100) obs.destroy();
					else if (obs.obsLane === lane && Math.abs(obs.x - player.x) < 30 && z === 0) {
						if (obs.typeStr === "ramp") {
							zVelocity = 15;
							z = 1;
						} else if (obs.typeStr === "mud") speed *= .8;
					}
				}
			});
			if (z === 0 && player.angle !== 0) {
				if (Math.abs(player.angle) > 30) {
					speed = 0;
					temperature = 200;
					isOverheated = true;
				}
				player.angle = 0;
			}
		}
		gameInst = new __webpack_exports__default.Game(config);
		return () => {
			gameInst.destroy(true);
		};
	}, [onExit]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		className: "w-full h-full flex justify-center items-center bg-black"
	});
}
//#endregion
export { FaskaBike as default };
