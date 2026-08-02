import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaMotocross/FaskaMotocross.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function FaskaMotocross({ onExit }) {
	const containerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 800,
			height: 600,
			parent: containerRef.current,
			physics: {
				default: "matter",
				matter: {
					gravity: { y: 1 },
					debug: false
				}
			},
			scene: {
				preload,
				create,
				update
			}
		};
		let cursors;
		let gameInst;
		let bikeBody, frontWheel, backWheel;
		let nitro = 100;
		let nitroText;
		let isFlipped = false;
		let lastAngle = 0;
		let flips = 0;
		let flipText;
		function preload() {
			const g = this.add.graphics();
			g.fillStyle(255, 1);
			g.fillRect(0, 0, 60, 20);
			g.generateTexture("chassis", 60, 20);
			g.clear();
			g.fillStyle(3355443, 1);
			g.fillCircle(15, 15, 15);
			g.fillStyle(11184810, 1);
			g.fillCircle(15, 15, 5);
			g.generateTexture("wheel", 30, 30);
			g.destroy();
		}
		function create() {
			this.matter.world.setBounds(0, -2e3, 1e4, 2600);
			let x = 0;
			let y = 500;
			for (let i = 0; i < 50; i++) {
				let width = __webpack_exports__default.Math.Between(100, 400);
				let height = __webpack_exports__default.Math.Between(-150, 150);
				let cx = x + width / 2;
				let cy = y + height / 2;
				this.matter.add.rectangle(cx, cy + 300, width, 600, {
					isStatic: true,
					friction: .8
				});
				this.add.rectangle(cx, cy + 300, width, 600, 9127187);
				x += width;
				y += height;
			}
			bikeBody = this.matter.add.image(200, 300, "chassis");
			bikeBody.setBody({
				type: "rectangle",
				width: 60,
				height: 20
			}, { mass: 2 });
			backWheel = this.matter.add.image(170, 320, "wheel");
			backWheel.setBody({
				type: "circle",
				radius: 15
			}, {
				mass: 1,
				friction: .9,
				restitution: .1
			});
			frontWheel = this.matter.add.image(230, 320, "wheel");
			frontWheel.setBody({
				type: "circle",
				radius: 15
			}, {
				mass: 1,
				friction: .9,
				restitution: .1
			});
			this.matter.add.joint(bikeBody, backWheel, 30, .4, { pointA: {
				x: -30,
				y: 10
			} });
			this.matter.add.joint(bikeBody, frontWheel, 30, .4, { pointA: {
				x: 30,
				y: 10
			} });
			cursors = this.input.keyboard.createCursorKeys();
			this.cameras.main.startFollow(bikeBody, false, .5, .5);
			this.cameras.main.setZoom(.8);
			nitroText = this.add.text(10, 50, "Nitro: 100", {
				font: "24px Arial",
				fill: "#ff0000"
			}).setScrollFactor(0);
			flipText = this.add.text(10, 80, "Flips: 0", {
				font: "24px Arial",
				fill: "#ffff00"
			}).setScrollFactor(0);
			this.add.text(10, 110, "Arrows to drive/tilt, SPACE for Nitro", {
				font: "18px Arial",
				fill: "#fff"
			}).setScrollFactor(0);
			this.add.text(10, 10, "EXIT", {
				font: "bold 20px Arial",
				fill: "#ffffff",
				backgroundColor: "#ff0000"
			}).setInteractive().setScrollFactor(0).on("pointerdown", () => {
				if (onExit) onExit();
			});
		}
		function update() {
			if (cursors.right.isDown) backWheel.applyForce({
				x: .005,
				y: 0
			});
			if (cursors.left.isDown) backWheel.applyForce({
				x: -.005,
				y: 0
			});
			if (cursors.up.isDown) {
				bikeBody.applyForce({
					x: 0,
					y: -.005
				});
				bikeBody.setAngularVelocity(-.1);
			}
			if (cursors.down.isDown) bikeBody.setAngularVelocity(.1);
			if (cursors.space.isDown && nitro > 0) {
				bikeBody.applyForce({
					x: .02,
					y: -.005
				});
				nitro -= .5;
				nitroText.setText("Nitro: " + Math.max(0, Math.floor(nitro)));
			}
			let angle = bikeBody.angle;
			if (Math.abs(angle - lastAngle) > 180) {
				isFlipped = !isFlipped;
				if (!isFlipped) {
					flips++;
					nitro = Math.min(100, nitro + 20);
					flipText.setText("Flips: " + flips);
					nitroText.setText("Nitro: " + Math.max(0, Math.floor(nitro)));
				}
			}
			lastAngle = angle;
			if (bikeBody.y > 2500) {
				if (onExit) onExit();
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
export { FaskaMotocross as default };
