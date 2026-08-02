import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, s as useThree, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { t as OrbitControls } from "./OrbitControls-CpCcNDu_.js";
import { t as Text } from "./Text-CuphjnHx.js";
import { n as Cylinder, r as Sphere, t as Box } from "./shapes-BBrczoYY.js";
//#region src/components/games/engines/FaskaAstroSwarm/FaskaAstroSwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var GRAVITY = -30;
var JUMP_VELOCITY = 12;
var HOVER_GRAVITY = -5;
var MAX_HOVER_TIME = 1;
var MOVE_SPEED = 8;
var PLAYER_RADIUS = .4;
var MAX_PARTICLES = 50;
var getInitialState = () => ({
	player: {
		position: new Vector3(0, 3, 0),
		velocity: new Vector3(0, 0, 0),
		rotationY: 0,
		isGrounded: false,
		hoverTime: MAX_HOVER_TIME
	},
	keys: {},
	elements: {
		H: 0,
		O: 0,
		C: 0
	},
	status: "playing",
	enemies: [
		{
			id: 1,
			position: new Vector3(0, 1.5, -15),
			startX: 0,
			range: 4,
			dir: 1,
			alive: true
		},
		{
			id: 2,
			position: new Vector3(10, 5.5, -15),
			startX: 10,
			range: 3,
			dir: 1,
			alive: true
		},
		{
			id: 3,
			position: new Vector3(10, 7.5, -30),
			startX: 10,
			range: 4,
			dir: 1,
			alive: true
		}
	],
	coins: [
		{
			id: 1,
			position: new Vector3(0, 1.5, -8),
			type: "H",
			collected: false
		},
		{
			id: 2,
			position: new Vector3(-3, 3, -15),
			type: "O",
			collected: false
		},
		{
			id: 3,
			position: new Vector3(5, 5.5, -15),
			type: "C",
			collected: false
		},
		{
			id: 4,
			position: new Vector3(10, 8, -23),
			type: "H",
			collected: false
		},
		{
			id: 5,
			position: new Vector3(14, 9, -30),
			type: "C",
			collected: false
		}
	],
	platforms: [
		{
			position: new Vector3(0, 0, 0),
			size: new Vector3(10, 1, 10)
		},
		{
			position: new Vector3(0, 0, -8),
			size: new Vector3(2, 1, 6)
		},
		{
			position: new Vector3(0, 1, -15),
			size: new Vector3(10, 1, 10)
		},
		{
			position: new Vector3(5, 3, -15),
			size: new Vector3(3, 1, 3)
		},
		{
			position: new Vector3(10, 5, -15),
			size: new Vector3(8, 1, 8)
		},
		{
			position: new Vector3(10, 6, -23),
			size: new Vector3(2, 1, 6)
		},
		{
			position: new Vector3(10, 7, -30),
			size: new Vector3(12, 1, 12)
		}
	],
	exit: { position: new Vector3(10, 8, -34) },
	particles: Array.from({ length: MAX_PARTICLES }).map(() => ({
		active: false,
		pos: new Vector3(),
		vel: new Vector3(),
		life: 0
	})),
	hoverParticles: Array.from({ length: 20 }).map(() => ({
		active: false,
		pos: new Vector3(),
		vel: new Vector3(),
		life: 0
	}))
});
var PlayerMesh = import_react.forwardRef((props, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
				args: [
					.8,
					.8,
					.8
				],
				position: [
					0,
					-.1,
					0
				],
				castShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "white" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sphere, {
				args: [.4],
				position: [
					0,
					.5,
					0
				],
				castShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#00ffff" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
				args: [
					.1,
					.05,
					.1
				],
				position: [
					-.15,
					.5,
					.35
				],
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "black" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
				args: [
					.1,
					.05,
					.1
				],
				position: [
					.15,
					.5,
					.35
				],
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "black" })
			})
		]
	});
});
var EnemyMesh = import_react.forwardRef((props, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cylinder, {
			args: [
				.5,
				.5,
				1,
				8
			],
			position: [
				0,
				.5,
				0
			],
			castShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ff4444" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cylinder, {
			args: [
				0,
				.2,
				.5,
				4
			],
			position: [
				0,
				1.25,
				0
			],
			castShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#880000" })
		})]
	});
});
var ElementMesh = import_react.forwardRef(({ type, ...props }, ref) => {
	const color = type === "H" ? "#44aaff" : type === "O" ? "#ff4444" : "#aaaaaa";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sphere, {
			args: [
				.4,
				16,
				16
			],
			castShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				metalness: .5,
				roughness: .2
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			position: [
				0,
				0,
				.41
			],
			fontSize: .4,
			color: "white",
			anchorX: "center",
			anchorY: "middle",
			children: type
		})]
	});
});
var GameScene = ({ stateRef }) => {
	const { camera } = useThree();
	const controlsRef = (0, import_react.useRef)();
	const playerRef = (0, import_react.useRef)();
	const enemiesRef = (0, import_react.useRef)([]);
	const coinsRef = (0, import_react.useRef)([]);
	const particlesRef = (0, import_react.useRef)([]);
	const hoverParticlesRef = (0, import_react.useRef)([]);
	const exitMatRef = (0, import_react.useRef)();
	(0, import_react.useEffect)(() => {
		const handleDown = (e) => {
			stateRef.current.keys[e.code] = true;
		};
		const handleUp = (e) => {
			stateRef.current.keys[e.code] = false;
		};
		window.addEventListener("keydown", handleDown);
		window.addEventListener("keyup", handleUp);
		return () => {
			window.removeEventListener("keydown", handleDown);
			window.removeEventListener("keyup", handleUp);
		};
	}, [stateRef]);
	useFrame((state, delta) => {
		const game = stateRef.current;
		const dt = Math.min(delta, .1);
		if (controlsRef.current) {
			controlsRef.current.target.lerp(game.player.position, 1 - Math.pow(.001, dt));
			controlsRef.current.update();
		}
		if (game.status !== "playing") return;
		const keys = game.keys;
		const moveDir = new Vector3(0, 0, 0);
		const camForward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
		camForward.y = 0;
		if (camForward.lengthSq() < .001) camForward.set(0, 0, -1);
		camForward.normalize();
		const camRight = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
		camRight.y = 0;
		if (camRight.lengthSq() < .001) camRight.set(1, 0, 0);
		camRight.normalize();
		if (keys["KeyW"] || keys["ArrowUp"]) moveDir.add(camForward);
		if (keys["KeyS"] || keys["ArrowDown"]) moveDir.sub(camForward);
		if (keys["KeyA"] || keys["ArrowLeft"]) moveDir.sub(camRight);
		if (keys["KeyD"] || keys["ArrowRight"]) moveDir.add(camRight);
		if (moveDir.lengthSq() > 0) moveDir.normalize();
		game.player.velocity.x = moveDir.x * MOVE_SPEED;
		game.player.velocity.z = moveDir.z * MOVE_SPEED;
		if (moveDir.lengthSq() > .001) {
			let diff = Math.atan2(moveDir.x, moveDir.z) - game.player.rotationY;
			while (diff < -Math.PI) diff += Math.PI * 2;
			while (diff > Math.PI) diff -= Math.PI * 2;
			game.player.rotationY += diff * 10 * dt;
		}
		if (keys["Space"]) if (game.player.isGrounded) {
			game.player.velocity.y = JUMP_VELOCITY;
			game.player.isGrounded = false;
		} else if (game.player.velocity.y < 0 && game.player.hoverTime > 0) {
			game.player.velocity.y += (HOVER_GRAVITY - GRAVITY) * dt;
			game.player.hoverTime -= dt;
			const hp = game.hoverParticles.find((p) => !p.active);
			if (hp) {
				hp.active = true;
				hp.pos.copy(game.player.position);
				hp.pos.y -= .3;
				hp.pos.x += (Math.random() - .5) * .5;
				hp.pos.z += (Math.random() - .5) * .5;
				hp.vel.set((Math.random() - .5) * 1, -Math.random() * 4, (Math.random() - .5) * 1);
				hp.life = .3 + Math.random() * .3;
			}
		} else game.player.velocity.y += GRAVITY * dt;
		else if (!game.player.isGrounded) game.player.velocity.y += GRAVITY * dt;
		const p = game.player.position;
		const v = game.player.velocity;
		p.addScaledVector(v, dt);
		game.player.isGrounded = false;
		let standingOnPlatform = false;
		for (let plat of game.platforms) {
			const minX = plat.position.x - plat.size.x / 2;
			const maxX = plat.position.x + plat.size.x / 2;
			const minZ = plat.position.z - plat.size.z / 2;
			const maxZ = plat.position.z + plat.size.z / 2;
			const platY = plat.position.y + plat.size.y / 2;
			if (p.x >= minX - PLAYER_RADIUS && p.x <= maxX + PLAYER_RADIUS && p.z >= minZ - PLAYER_RADIUS && p.z <= maxZ + PLAYER_RADIUS) {
				if (p.y - PLAYER_RADIUS <= platY + .2 && p.y - PLAYER_RADIUS >= platY - .5 && v.y <= 0) {
					p.y = platY + PLAYER_RADIUS;
					v.y = 0;
					game.player.isGrounded = true;
					game.player.hoverTime = MAX_HOVER_TIME;
					standingOnPlatform = true;
				}
			}
		}
		if (!standingOnPlatform && v.y !== 0) game.player.isGrounded = false;
		if (p.y < -10) game.status = "dead";
		game.enemies.forEach((e) => {
			if (!e.alive) return;
			e.position.x += e.dir * 2 * dt;
			if (Math.abs(e.position.x - e.startX) > e.range) e.dir *= -1;
			if (e.position.distanceTo(p) < 1) if (v.y < -1 && p.y > e.position.y + .5) {
				e.alive = false;
				v.y = JUMP_VELOCITY * .8;
				for (let i = 0; i < 15; i++) {
					const pt = game.particles.find((px) => !px.active);
					if (pt) {
						pt.active = true;
						pt.pos.copy(e.position);
						pt.vel.set((Math.random() - .5) * 10, Math.random() * 10, (Math.random() - .5) * 10);
						pt.life = .5 + Math.random() * .5;
					}
				}
			} else game.status = "dead";
		});
		game.coins.forEach((c) => {
			if (c.collected) return;
			if (c.position.distanceTo(p) < 1.5) {
				c.collected = true;
				game.elements[c.type]++;
				for (let i = 0; i < 5; i++) {
					const pt = game.particles.find((px) => !px.active);
					if (pt) {
						pt.active = true;
						pt.pos.copy(c.position);
						pt.vel.set((Math.random() - .5) * 5, Math.random() * 5, (Math.random() - .5) * 5);
						pt.life = .5;
					}
				}
			}
		});
		if (game.exit.position.distanceTo(p) < 3) {
			if (game.elements.H >= 2 && game.elements.O >= 1) game.status = "won";
		}
		game.particles.forEach((pt) => {
			if (!pt.active) return;
			pt.pos.addScaledVector(pt.vel, dt);
			pt.vel.y += GRAVITY * dt;
			pt.life -= dt;
			if (pt.life <= 0) pt.active = false;
		});
		game.hoverParticles.forEach((hp) => {
			if (!hp.active) return;
			hp.pos.addScaledVector(hp.vel, dt);
			hp.life -= dt;
			if (hp.life <= 0) hp.active = false;
		});
		if (playerRef.current) {
			playerRef.current.position.copy(p);
			playerRef.current.rotation.y = game.player.rotationY;
		}
		game.enemies.forEach((e, i) => {
			if (enemiesRef.current[i]) {
				enemiesRef.current[i].position.copy(e.position);
				enemiesRef.current[i].visible = e.alive;
			}
		});
		game.coins.forEach((c, i) => {
			if (coinsRef.current[i]) {
				coinsRef.current[i].position.copy(c.position);
				coinsRef.current[i].visible = !c.collected;
				coinsRef.current[i].rotation.y += delta;
			}
		});
		game.particles.forEach((pt, i) => {
			if (particlesRef.current[i]) {
				particlesRef.current[i].position.copy(pt.pos);
				particlesRef.current[i].scale.setScalar(Math.max(.01, pt.life));
				particlesRef.current[i].visible = pt.active;
			}
		});
		game.hoverParticles.forEach((hp, i) => {
			if (hoverParticlesRef.current[i]) {
				hoverParticlesRef.current[i].position.copy(hp.pos);
				hoverParticlesRef.current[i].scale.setScalar(Math.max(.01, hp.life * 2));
				hoverParticlesRef.current[i].visible = hp.active;
			}
		});
		if (exitMatRef.current) {
			if (game.elements.H >= 2 && game.elements.O >= 1) {
				exitMatRef.current.color.set("lightgreen");
				exitMatRef.current.opacity = .8;
			}
		}
	});
	const game = stateRef.current;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, { sunPosition: [
			100,
			20,
			100
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				10,
				20,
				10
			],
			intensity: 1.5,
			castShadow: true,
			"shadow-mapSize": [1024, 1024]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
			ref: controlsRef,
			makeDefault: true,
			enablePan: false,
			minDistance: 4,
			maxDistance: 12,
			maxPolarAngle: Math.PI / 2 - .1
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerMesh, { ref: playerRef }),
		game.platforms.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
			position: p.position,
			args: p.size.toArray(),
			receiveShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#445566" })
		}, `plat-${i}`)),
		game.enemies.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnemyMesh, {
			ref: (el) => enemiesRef.current[i] = el,
			position: e.position
		}, `enemy-${i}`)),
		game.coins.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ElementMesh, {
			type: c.type,
			ref: (el) => coinsRef.current[i] = el,
			position: c.position
		}, `coin-${i}`)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: game.exit.position,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
					args: [
						4,
						4,
						.5
					],
					position: [
						0,
						2,
						0
					],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						ref: exitMatRef,
						color: "gray",
						transparent: true,
						opacity: .5
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
					args: [
						4.4,
						4.4,
						.6
					],
					position: [
						0,
						2,
						0
					],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "darkgray",
						wireframe: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						0,
						4.5,
						0
					],
					fontSize: .6,
					color: "white",
					anchorX: "center",
					anchorY: "bottom",
					children: "H2O EXHAUST"
				})
			]
		}),
		game.particles.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
			ref: (el) => particlesRef.current[i] = el,
			args: [
				.2,
				.2,
				.2
			],
			visible: false,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "yellow" })
		}, `part-${i}`)),
		game.hoverParticles.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
			ref: (el) => hoverParticlesRef.current[i] = el,
			args: [
				.1,
				.1,
				.1
			],
			visible: false,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "cyan",
				transparent: true,
				opacity: .6
			})
		}, `hov-${i}`))
	] });
};
function FaskaAstroSwarm({ onExit }) {
	const stateRef = (0, import_react.useRef)(getInitialState());
	const [hud, setHud] = (0, import_react.useState)({
		H: 0,
		O: 0,
		C: 0,
		status: "playing"
	});
	(0, import_react.useEffect)(() => {
		const interval = setInterval(() => {
			if (stateRef.current) setHud({
				H: stateRef.current.elements.H,
				O: stateRef.current.elements.O,
				C: stateRef.current.elements.C,
				status: stateRef.current.status
			});
		}, 100);
		return () => clearInterval(interval);
	}, []);
	const handleRestart = () => {
		stateRef.current = getInitialState();
		setHud({
			H: 0,
			O: 0,
			C: 0,
			status: "playing"
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100%",
			height: "100vh",
			position: "relative",
			overflow: "hidden"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				style: {
					position: "absolute",
					top: 20,
					right: 20,
					zIndex: 100,
					padding: "10px 20px",
					fontSize: "16px",
					background: "#e74c3c",
					color: "white",
					border: "none",
					borderRadius: "5px",
					cursor: "pointer"
				},
				onClick: onExit,
				children: "Beenden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 20,
					left: 20,
					zIndex: 100,
					color: "white",
					background: "rgba(0,0,0,0.6)",
					padding: "15px",
					borderRadius: "8px",
					fontFamily: "sans-serif",
					pointerEvents: "none"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						style: { margin: "0 0 10px 0" },
						children: "FaskaAstroSwarm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: { margin: "0 0 5px 0" },
						children: "Ziel: Sammle 2x H und 1x O für H2O, dann ab zum Exit!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							margin: "0 0 10px 0",
							fontSize: "0.9em",
							color: "#ccc"
						},
						children: "Steuerung: WASD/Pfeile zum Bewegen, Leertaste für Sprung. Leertaste halten für Hover!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						style: {
							margin: "0",
							fontWeight: "bold"
						},
						children: [
							"Elemente: H: ",
							hud.H,
							"/2 | O: ",
							hud.O,
							"/1 | C: ",
							hud.C
						]
					}),
					hud.status === "dead" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							marginTop: "15px",
							pointerEvents: "auto"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							style: {
								color: "#ff6b6b",
								margin: "0 0 10px 0"
							},
							children: "Game Over!"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleRestart,
							style: {
								padding: "8px 16px",
								cursor: "pointer"
							},
							children: "Neustart"
						})]
					}),
					hud.status === "won" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							marginTop: "15px",
							pointerEvents: "auto"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							style: {
								color: "#51cf66",
								margin: "0 0 10px 0"
							},
							children: "Gewonnen! Wasser gebildet!"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleRestart,
							style: {
								padding: "8px 16px",
								cursor: "pointer"
							},
							children: "Nochmal spielen"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
				shadows: true,
				camera: {
					position: [
						0,
						5,
						10
					],
					fov: 50
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameScene, { stateRef })
			})
		]
	});
}
//#endregion
export { FaskaAstroSwarm as default };
