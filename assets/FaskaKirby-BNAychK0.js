import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaKirby/FaskaKirby.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function FaskaKirby({ onExit }) {
	const containerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 800,
			height: 600,
			parent: containerRef.current,
			physics: {
				default: "arcade",
				arcade: {
					gravity: { y: 600 },
					debug: false
				}
			},
			scene: {
				preload,
				create,
				update
			}
		};
		let player;
		let platforms;
		let cursors;
		let enemies;
		let door;
		let gameInst;
		function preload() {
			const g = this.add.graphics();
			g.fillStyle(16758465, 1);
			g.fillCircle(16, 16, 16);
			g.fillStyle(0, 1);
			g.fillCircle(10, 10, 2);
			g.fillCircle(22, 10, 2);
			g.generateTexture("kirby", 32, 32);
			g.clear();
			g.fillStyle(16711680, 1);
			g.fillRect(0, 0, 32, 32);
			g.generateTexture("enemy", 32, 32);
			g.clear();
			g.fillStyle(9127187, 1);
			g.fillRect(0, 0, 400, 32);
			g.generateTexture("platform", 400, 32);
			g.clear();
			g.fillStyle(9127187, 1);
			g.fillRect(0, 0, 100, 32);
			g.generateTexture("platform_small", 100, 32);
			g.clear();
			g.fillStyle(0, 1);
			g.fillRect(0, 0, 40, 60);
			g.fillStyle(8947848, 1);
			g.fillCircle(30, 30, 4);
			g.generateTexture("door", 40, 60);
			g.destroy();
		}
		function create() {
			this.physics.world.setBounds(0, 0, 1600, 600);
			this.add.rectangle(0, 0, 1600, 600, 8900331).setOrigin(0, 0);
			platforms = this.physics.add.staticGroup();
			for (let i = 0; i < 4; i++) platforms.create(200 + i * 400, 584, "platform");
			platforms.create(400, 450, "platform_small");
			platforms.create(600, 350, "platform_small");
			platforms.create(850, 250, "platform_small");
			platforms.create(1100, 400, "platform_small");
			door = this.physics.add.staticSprite(1400, 530, "door");
			player = this.physics.add.sprite(100, 450, "kirby");
			player.setBounce(.1);
			player.setCollideWorldBounds(true);
			player.body.setGravityY(200);
			enemies = this.physics.add.group();
			enemies.create(500, 550, "enemy").setVelocityX(50);
			enemies.create(900, 550, "enemy").setVelocityX(-50);
			enemies.children.iterate((child) => {
				child.setCollideWorldBounds(true);
				child.setBounce(1);
			});
			this.physics.add.collider(player, platforms);
			this.physics.add.collider(enemies, platforms);
			this.physics.add.overlap(player, door, reachDoor, null, this);
			this.physics.add.collider(player, enemies, hitEnemy, null, this);
			cursors = this.input.keyboard.createCursorKeys();
			this.cameras.main.setBounds(0, 0, 1600, 600);
			this.cameras.main.startFollow(player);
			this.add.text(10, 10, "Faska Kirby - Arrows to move, UP to float", {
				font: "16px Arial",
				fill: "#000"
			}).setScrollFactor(0);
			this.add.text(740, 10, "EXIT", {
				font: "bold 16px Arial",
				fill: "#ff0000"
			}).setInteractive().setScrollFactor(0).on("pointerdown", () => {
				if (onExit) onExit();
			});
		}
		function hitEnemy(player, enemy) {
			if (player.body.velocity.y > 0 && player.y < enemy.y - 16) {
				enemy.destroy();
				player.setVelocityY(-300);
			} else {
				player.setTint(16711680);
				player.setVelocity(0, -200);
				this.physics.pause();
				setTimeout(() => {
					if (onExit) onExit();
				}, 1500);
			}
		}
		function reachDoor(player, door) {
			this.physics.pause();
			this.add.text(player.x - 50, player.y - 50, "LEVEL CLEAR!", {
				font: "24px Arial",
				fill: "#ffff00"
			});
		}
		function update() {
			if (cursors.left.isDown) {
				player.setVelocityX(-200);
				player.flipX = true;
			} else if (cursors.right.isDown) {
				player.setVelocityX(200);
				player.flipX = false;
			} else player.setVelocityX(0);
			if (__webpack_exports__default.Input.Keyboard.JustDown(cursors.up)) player.setVelocityY(-300);
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
export { FaskaKirby as default };
