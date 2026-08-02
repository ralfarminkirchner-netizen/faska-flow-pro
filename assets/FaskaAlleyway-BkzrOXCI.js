import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaAlleyway/FaskaAlleyway.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function FaskaAlleyway({ onExit }) {
	const containerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 800,
			height: 600,
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
		let paddle;
		let ball;
		let bricks;
		let cursors;
		let gameInst;
		function preload() {
			const g = this.add.graphics();
			g.fillStyle(65484, 1);
			g.fillRoundedRect(0, 0, 100, 20, 10);
			g.generateTexture("paddle", 100, 20);
			g.clear();
			g.fillStyle(16777215, 1);
			g.fillCircle(10, 10, 10);
			g.generateTexture("ball", 20, 20);
			g.clear();
			g.fillStyle(16711765, 1);
			g.fillRoundedRect(0, 0, 60, 20, 4);
			g.generateTexture("brick_red", 60, 20);
			g.clear();
			g.fillStyle(16763904, 1);
			g.fillRoundedRect(0, 0, 60, 20, 4);
			g.generateTexture("brick_yellow", 60, 20);
			g.clear();
			g.fillStyle(22015, 1);
			g.fillRoundedRect(0, 0, 60, 20, 4);
			g.generateTexture("brick_blue", 60, 20);
			g.destroy();
		}
		function create() {
			this.physics.world.setBoundsCollision(true, true, true, false);
			bricks = this.physics.add.staticGroup();
			const colors = [
				"brick_red",
				"brick_yellow",
				"brick_blue",
				"brick_red",
				"brick_yellow",
				"brick_blue"
			];
			for (let y = 0; y < 6; y++) for (let x = 0; x < 10; x++) bricks.create(110 + x * 64, 80 + y * 24, colors[y]).refreshBody();
			paddle = this.physics.add.sprite(400, 550, "paddle").setImmovable();
			paddle.body.collideWorldBounds = true;
			ball = this.physics.add.sprite(400, 500, "ball");
			ball.setCollideWorldBounds(true);
			ball.setBounce(1, 1);
			this.physics.add.collider(ball, paddle, hitPaddle, null, this);
			this.physics.add.collider(ball, bricks, hitBrick, null, this);
			cursors = this.input.keyboard.createCursorKeys();
			this.input.on("pointermove", (pointer) => {
				paddle.x = __webpack_exports__default.Math.Clamp(pointer.x, 50, 750);
			});
			this.input.on("pointerdown", () => {
				if (ball.body.velocity.x === 0 && ball.body.velocity.y === 0) ball.setVelocity(-75, -300);
			});
			this.add.text(10, 10, "Faska Alleyway - Click to Start, Arrows/Mouse to move", {
				font: "16px Arial",
				fill: "#ffffff"
			});
			this.add.text(740, 10, "EXIT", {
				font: "bold 16px Arial",
				fill: "#ff0000"
			}).setInteractive().on("pointerdown", () => {
				if (onExit) onExit();
			});
		}
		function hitPaddle(ball, paddle) {
			let diff = 0;
			if (ball.x < paddle.x) {
				diff = paddle.x - ball.x;
				ball.setVelocityX(-10 * diff);
			} else if (ball.x > paddle.x) {
				diff = ball.x - paddle.x;
				ball.setVelocityX(10 * diff);
			} else ball.setVelocityX(2 + Math.random() * 8);
		}
		function hitBrick(ball, brick) {
			brick.disableBody(true, true);
			if (bricks.countActive() === 0) {
				ball.setVelocity(0);
				this.add.text(300, 300, "YOU WIN!", {
					font: "40px Arial",
					fill: "#00ff00"
				});
			}
		}
		function update() {
			if (cursors.left.isDown) paddle.setVelocityX(-400);
			else if (cursors.right.isDown) paddle.setVelocityX(400);
			else paddle.setVelocityX(0);
			if (ball.y > 600) {
				ball.setPosition(paddle.x, 500);
				ball.setVelocity(0);
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
export { FaskaAlleyway as default };
