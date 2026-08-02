import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as create } from "./react-B1iXS_n6.js";
//#region src/components/games/engines/FaskaFighter3/GameLogic.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var STAGE_WIDTH = 1200;
var FLOOR_Y = 400;
var STATES = {
	IDLE: "IDLE",
	WALK_F: "WALK_F",
	WALK_B: "WALK_B",
	JUMP: "JUMP",
	PUNCH: "PUNCH",
	KICK: "KICK",
	HADOUKEN: "HADOUKEN",
	HIT: "HIT",
	KO: "KO",
	VICTORY: "VICTORY"
};
var createFighter = (x, isPlayer) => ({
	x,
	y: FLOOR_Y,
	vx: 0,
	vy: 0,
	isPlayer,
	facing: isPlayer ? 1 : -1,
	state: STATES.IDLE,
	stateTimer: 0,
	health: 100,
	maxHealth: 100,
	hasHit: false,
	stunTime: 0,
	speed: 4,
	jumpForce: -12,
	gravity: .6
});
var useGameStore = create((set, get) => ({
	p1: createFighter(400, true),
	p2: createFighter(800, false),
	camera: {
		x: 200,
		y: 0,
		width: 800,
		height: 450
	},
	projectiles: [],
	particles: [],
	screenShake: 0,
	matchState: "START",
	matchTimer: 0,
	roundTime: 99,
	frameCount: 0,
	p1Wins: 0,
	p2Wins: 0,
	keys: {},
	joystickState: {
		left: false,
		right: false,
		up: false
	},
	setKey: (code, isDown) => set((state) => ({ keys: {
		...state.keys,
		[code]: isDown
	} })),
	setJoystick: (stateUpdate) => set((state) => ({ joystickState: {
		...state.joystickState,
		...stateUpdate
	} })),
	triggerAttack: (type) => set((state) => {
		if (state.matchState !== "FIGHT") return state;
		let p1 = { ...state.p1 };
		if ([
			STATES.PUNCH,
			STATES.KICK,
			STATES.HADOUKEN,
			STATES.HIT,
			STATES.KO
		].includes(p1.state)) return state;
		p1.state = STATES[type];
		p1.stateTimer = 0;
		p1.hasHit = false;
		p1.vx = 0;
		return { p1 };
	}),
	tick: () => set((state) => {
		let { p1, p2, projectiles, particles, screenShake, matchState, matchTimer, roundTime, frameCount, p1Wins, p2Wins, keys, joystickState, camera } = state;
		p1 = { ...p1 };
		p2 = { ...p2 };
		projectiles = projectiles.map((p) => ({ ...p }));
		particles = particles.map((p) => ({ ...p }));
		frameCount++;
		const addParticle = (x, y, color) => {
			particles.push({
				x,
				y,
				color,
				life: 1,
				vx: (Math.random() - .5) * 12,
				vy: (Math.random() - .5) * 12
			});
		};
		const applyPhysics = (f, opponent) => {
			f.stateTimer++;
			f.x += f.vx;
			f.y += f.vy;
			if (f.y < FLOOR_Y) f.vy += f.gravity;
			else {
				f.y = FLOOR_Y;
				f.vy = 0;
				if (f.state === STATES.JUMP) f.state = STATES.IDLE;
			}
			f.vx *= .85;
			if (f.x < 30) {
				f.x = 30;
				f.vx = 0;
			}
			if (f.x > STAGE_WIDTH - 30) {
				f.x = STAGE_WIDTH - 30;
				f.vx = 0;
			}
			if ([
				STATES.IDLE,
				STATES.WALK_F,
				STATES.WALK_B,
				STATES.JUMP
			].includes(f.state)) f.facing = opponent.x > f.x ? 1 : -1;
		};
		const applyAttackLogic = (f, opponent) => {
			const checkHit = (reachX, offsetY, w, h, damage, knockback, stunTime) => {
				let hb = {
					l: f.facing === 1 ? f.x : f.x - reachX,
					r: f.facing === 1 ? f.x + reachX : f.x,
					t: f.y + offsetY - h / 2,
					b: f.y + offsetY + h / 2
				};
				let hurt = {
					l: opponent.x - 20,
					r: opponent.x + 20,
					t: opponent.y - 110,
					b: opponent.y
				};
				if (hb.l < hurt.r && hb.r > hurt.l && hb.t < hurt.b && hb.b > hurt.t && opponent.state !== STATES.KO) {
					f.hasHit = true;
					opponent.health -= damage;
					screenShake = damage > 10 ? 15 : 8;
					if (opponent.health <= 0) {
						opponent.health = 0;
						opponent.state = STATES.KO;
						opponent.stateTimer = 0;
						opponent.vx = f.facing * knockback * 1.5;
						opponent.vy = -6;
					} else {
						opponent.state = STATES.HIT;
						opponent.stateTimer = 0;
						opponent.stunTime = stunTime;
						opponent.vx = f.facing * knockback;
					}
					for (let i = 0; i < 15; i++) addParticle(opponent.x, opponent.y + offsetY, "#ffaa00");
				}
			};
			switch (f.state) {
				case STATES.PUNCH:
					if (f.stateTimer === 10 && !f.hasHit) checkHit(60, -90, 40, 20, 8, 5, 20);
					if (f.stateTimer > 25) f.state = STATES.IDLE;
					break;
				case STATES.KICK:
					if (f.stateTimer === 15 && !f.hasHit) checkHit(70, -60, 50, 20, 12, 8, 25);
					if (f.stateTimer > 35) f.state = STATES.IDLE;
					break;
				case STATES.HADOUKEN:
					if (f.stateTimer === 15) projectiles.push({
						x: f.x + f.facing * 40,
						y: f.y - 60,
						vx: f.facing * 10,
						facing: f.facing,
						active: true
					});
					if (f.stateTimer > 40) f.state = STATES.IDLE;
					break;
				case STATES.HIT:
					if (f.stateTimer > f.stunTime) f.state = STATES.IDLE;
					break;
			}
		};
		const updateAI = (ai, player) => {
			if (ai.state === STATES.KO || ai.state === STATES.VICTORY || ai.state === STATES.HIT) return;
			let dist = player.x - ai.x;
			let absDist = Math.abs(dist);
			if (ai.state !== STATES.IDLE && ai.state !== STATES.WALK_F && ai.state !== STATES.WALK_B) return;
			if (Math.random() < .08) if (absDist > 300) if (Math.random() < .15) {
				ai.state = STATES.HADOUKEN;
				ai.stateTimer = 0;
				ai.vx = 0;
				ai.hasHit = false;
			} else {
				ai.state = STATES.WALK_F;
				ai.vx = ai.facing * ai.speed;
			}
			else if (absDist > 100) {
				ai.state = STATES.WALK_F;
				ai.vx = ai.facing * ai.speed;
			} else {
				ai.vx = 0;
				let r = Math.random();
				if (r < .4) {
					ai.state = STATES.PUNCH;
					ai.stateTimer = 0;
					ai.hasHit = false;
				} else if (r < .8) {
					ai.state = STATES.KICK;
					ai.stateTimer = 0;
					ai.hasHit = false;
				} else ai.state = STATES.IDLE;
			}
			else if (ai.state === STATES.WALK_F) ai.vx = ai.facing * ai.speed;
			else if (ai.state === STATES.WALK_B) ai.vx = -ai.facing * ai.speed;
		};
		if (matchState === "START") {
			matchTimer++;
			if (matchTimer > 90) {
				matchState = "FIGHT";
				matchTimer = 0;
			}
		} else if (matchState === "FIGHT") {
			if (frameCount % 60 === 0 && roundTime > 0) roundTime--;
			if (![
				STATES.HIT,
				STATES.KO,
				STATES.PUNCH,
				STATES.KICK,
				STATES.HADOUKEN
			].includes(p1.state)) {
				if ((keys["KeyW"] || joystickState.up) && p1.state !== STATES.JUMP) {
					p1.state = STATES.JUMP;
					p1.vy = p1.jumpForce;
					p1.stateTimer = 0;
				} else if (keys["KeyA"] || joystickState.left) {
					p1.state = STATES.WALK_B;
					p1.vx = -p1.speed;
				} else if (keys["KeyD"] || joystickState.right) {
					p1.state = STATES.WALK_F;
					p1.vx = p1.speed;
				} else if (p1.state !== STATES.JUMP) p1.state = STATES.IDLE;
			}
			updateAI(p2, p1);
			applyPhysics(p1, p2);
			applyPhysics(p2, p1);
			applyAttackLogic(p1, p2);
			applyAttackLogic(p2, p1);
			projectiles.forEach((p) => {
				if (!p.active) return;
				p.x += p.vx;
				if (p.x < 0 || p.x > STAGE_WIDTH) {
					p.active = false;
					return;
				}
				let target = p.facing === 1 ? p2 : p1;
				let hb = {
					l: p.x - 20,
					r: p.x + 20,
					t: p.y - 20,
					b: p.y + 20
				};
				let hurt = {
					l: target.x - 20,
					r: target.x + 20,
					t: target.y - 110,
					b: target.y
				};
				if (hb.l < hurt.r && hb.r > hurt.l && hb.t < hurt.b && hb.b > hurt.t && target.state !== STATES.KO) {
					p.active = false;
					target.health -= 10;
					screenShake = 15;
					if (target.health <= 0) {
						target.health = 0;
						target.state = STATES.KO;
						target.stateTimer = 0;
						target.vx = p.facing * 6 * 1.5;
						target.vy = -6;
					} else {
						target.state = STATES.HIT;
						target.stateTimer = 0;
						target.stunTime = 25;
						target.vx = p.facing * 6;
					}
					for (let i = 0; i < 15; i++) addParticle(p.x, p.y, "#00ffff");
				}
			});
			projectiles = projectiles.filter((p) => p.active);
			if (p1.health <= 0 || p2.health <= 0 || roundTime <= 0) {
				matchState = "ROUND_END";
				matchTimer = 0;
				if (p1.health > p2.health) p1Wins++;
				else if (p2.health > p1.health) p2Wins++;
			}
		} else if (matchState === "ROUND_END") {
			matchTimer++;
			applyPhysics(p1, p2);
			applyPhysics(p2, p1);
			if (matchTimer > 180) if (p1Wins >= 2 || p2Wins >= 2) {
				matchState = "MATCH_OVER";
				matchTimer = 0;
			} else {
				p1 = createFighter(400, true);
				p2 = createFighter(800, false);
				projectiles = [];
				particles = [];
				roundTime = 99;
				matchState = "START";
				matchTimer = 0;
			}
		} else if (matchState === "MATCH_OVER") matchTimer++;
		particles.forEach((p) => {
			p.x += p.vx;
			p.y += p.vy;
			p.life -= .05;
		});
		particles = particles.filter((p) => p.life > 0);
		if (screenShake > 0) {
			screenShake *= .8;
			if (screenShake < 1) screenShake = 0;
		}
		let targetX = (p1.x + p2.x) / 2 - camera.width / 2;
		let camX = camera.x + (targetX - camera.x) * .1;
		if (camX < 0) camX = 0;
		if (camX > STAGE_WIDTH - camera.width) camX = STAGE_WIDTH - camera.width;
		return {
			p1,
			p2,
			projectiles,
			particles,
			screenShake,
			matchState,
			matchTimer,
			roundTime,
			frameCount,
			p1Wins,
			p2Wins,
			camera: {
				...camera,
				x: camX
			}
		};
	})
}));
//#endregion
//#region src/components/games/engines/FaskaFighter3/Arena.jsx
var import_jsx_runtime = require_jsx_runtime();
function Arena() {
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const bgImg = new Image();
		bgImg.src = "/faska-flow-pro/textures/fighter_bg.png";
		const ctx = canvasRef.current.getContext("2d");
		let reqId;
		const render = () => {
			const { camera, screenShake } = useGameStore.getState();
			ctx.clearRect(0, 0, 800, 450);
			let shakeX = 0;
			let shakeY = 0;
			if (screenShake > 0) {
				shakeX = Math.random() * screenShake - screenShake / 2;
				shakeY = Math.random() * screenShake - screenShake / 2;
			}
			if (bgImg.complete && bgImg.naturalHeight !== 0) ctx.drawImage(bgImg, -camera.x + shakeX, -camera.y + shakeY, 1200, 450);
			else {
				ctx.save();
				ctx.translate(shakeX, shakeY);
				let grad = ctx.createLinearGradient(0, 0, 0, 450);
				grad.addColorStop(0, "#0a0a2a");
				grad.addColorStop(1, "#4a1a3a");
				ctx.fillStyle = grad;
				ctx.fillRect(0, 0, 800, 450);
				ctx.fillStyle = "#1a1a1a";
				ctx.fillRect(0, 400 - camera.y, 800, 50);
				ctx.restore();
			}
			reqId = requestAnimationFrame(render);
		};
		render();
		return () => cancelAnimationFrame(reqId);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		width: 800,
		height: 450,
		style: {
			position: "absolute",
			left: 0,
			top: 0,
			zIndex: 1
		}
	});
}
//#endregion
//#region src/components/games/engines/FaskaFighter3/Fighters.jsx
function Fighters() {
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const playerImg = new Image();
		playerImg.src = "/faska-flow-pro/textures/fighter_player.png";
		const enemyImg = new Image();
		enemyImg.src = "/faska-flow-pro/textures/fighter_enemy.png";
		const ctx = canvasRef.current.getContext("2d");
		let reqId;
		const render = () => {
			const { p1, p2, camera, projectiles, particles, screenShake } = useGameStore.getState();
			ctx.clearRect(0, 0, 800, 450);
			let shakeX = 0;
			let shakeY = 0;
			if (screenShake > 0) {
				shakeX = Math.random() * screenShake - screenShake / 2;
				shakeY = Math.random() * screenShake - screenShake / 2;
			}
			const drawFighter = (f, img, isP1) => {
				ctx.save();
				ctx.translate(f.x - camera.x + shakeX, f.y - camera.y + shakeY);
				ctx.scale(f.facing, 1);
				let bounce = 0;
				let rot = 0;
				if (f.state === STATES.IDLE) bounce = Math.sin(f.stateTimer * .1) * 2;
				else if (f.state === STATES.WALK_F || f.state === STATES.WALK_B) bounce = Math.abs(Math.sin(f.stateTimer * .3)) * -5;
				else if (f.state === STATES.HIT) rot = -.3;
				else if (f.state === STATES.KO) {
					rot = -Math.PI / 2;
					bounce = 15;
				}
				ctx.translate(0, bounce);
				ctx.rotate(rot);
				if (img.complete && img.naturalHeight !== 0) ctx.drawImage(img, -50, -130, 100, 150);
				else {
					ctx.fillStyle = isP1 ? "#ff3333" : "#3333ff";
					ctx.fillRect(-20, -100, 40, 100);
					ctx.fillStyle = "white";
					ctx.fillRect(10, -90, 10, 20);
				}
				if (f.state === STATES.PUNCH) {
					ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
					ctx.fillRect(20, -90, 40, 20);
				} else if (f.state === STATES.KICK) {
					ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
					ctx.fillRect(20, -60, 50, 20);
				}
				ctx.restore();
			};
			drawFighter(p1, playerImg, true);
			drawFighter(p2, enemyImg, false);
			projectiles.forEach((p) => {
				ctx.save();
				ctx.translate(p.x - camera.x + shakeX, p.y - camera.y + shakeY);
				let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
				grad.addColorStop(0, "#ffffff");
				grad.addColorStop(.4, "#00ffff");
				grad.addColorStop(1, "rgba(0, 255, 255, 0)");
				ctx.fillStyle = grad;
				ctx.beginPath();
				ctx.arc(0, 0, 25, 0, Math.PI * 2);
				ctx.fill();
				ctx.restore();
			});
			particles.forEach((p) => {
				ctx.fillStyle = p.color;
				ctx.globalAlpha = Math.max(0, p.life);
				ctx.beginPath();
				ctx.arc(p.x - camera.x + shakeX, p.y - camera.y + shakeY, 6 * p.life, 0, Math.PI * 2);
				ctx.fill();
				ctx.globalAlpha = 1;
			});
			reqId = requestAnimationFrame(render);
		};
		render();
		return () => cancelAnimationFrame(reqId);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		width: 800,
		height: 450,
		style: {
			position: "absolute",
			left: 0,
			top: 0,
			zIndex: 2
		}
	});
}
//#endregion
//#region src/components/games/engines/FaskaFighter3/UIOverlay.jsx
function UIOverlay({ onExit }) {
	const p1 = useGameStore((s) => s.p1);
	const p2 = useGameStore((s) => s.p2);
	const roundTime = useGameStore((s) => s.roundTime);
	const matchState = useGameStore((s) => s.matchState);
	const p1Wins = useGameStore((s) => s.p1Wins);
	const p2Wins = useGameStore((s) => s.p2Wins);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			pointerEvents: "none",
			zIndex: 3
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					justifyContent: "space-between",
					padding: "20px 50px"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							width: "300px",
							height: "25px",
							background: "#440000",
							border: "3px solid white",
							position: "relative"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
							width: `${Math.max(0, p1.health / p1.maxHealth * 100)}%`,
							height: "100%",
							background: "#00ff00",
							transition: "width 0.1s"
						} })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "white",
							fontSize: "48px",
							fontWeight: "bold",
							fontFamily: "Impact, sans-serif",
							marginTop: "-10px"
						},
						children: Math.ceil(roundTime)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							width: "300px",
							height: "25px",
							background: "#440000",
							border: "3px solid white",
							position: "relative",
							display: "flex",
							justifyContent: "flex-end"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
							width: `${Math.max(0, p2.health / p2.maxHealth * 100)}%`,
							height: "100%",
							background: "#00ff00",
							transition: "width 0.1s"
						} })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					justifyContent: "space-between",
					padding: "0 50px"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						gap: "10px"
					},
					children: [...Array(p1Wins)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						width: 20,
						height: 20,
						borderRadius: "50%",
						background: "#ffaa00"
					} }, i))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						gap: "10px"
					},
					children: [...Array(p2Wins)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						width: 20,
						height: 20,
						borderRadius: "50%",
						background: "#ffaa00"
					} }, i))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					textAlign: "center"
				},
				children: [
					matchState === "START" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							color: "yellow",
							fontSize: "80px",
							fontFamily: "Impact",
							margin: 0,
							textShadow: "2px 2px 10px #000"
						},
						children: "FIGHT!"
					}),
					matchState === "ROUND_END" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							color: "red",
							fontSize: "100px",
							fontFamily: "Impact",
							margin: 0,
							textShadow: "2px 2px 10px #000"
						},
						children: "K.O."
					}),
					matchState === "MATCH_OVER" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						style: {
							color: "yellow",
							fontSize: "80px",
							fontFamily: "Impact",
							margin: 0,
							textShadow: "2px 2px 10px #000"
						},
						children: [p1Wins >= 2 ? "PLAYER 1" : "CPU", " WINS!"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					top: "20px",
					left: "50%",
					transform: "translateX(-50%)",
					padding: "5px 15px",
					background: "rgba(0,0,0,0.5)",
					color: "white",
					border: "1px solid white",
					cursor: "pointer",
					pointerEvents: "auto"
				},
				children: "Exit Game"
			})
		]
	});
}
//#endregion
//#region src/components/games/engines/FaskaFighter3/MobileJoystick.jsx
function MobileJoystick() {
	const setJoystick = useGameStore((s) => s.setJoystick);
	const triggerAttack = useGameStore((s) => s.triggerAttack);
	const btnStyle = {
		padding: "20px",
		fontSize: "20px",
		borderRadius: "10px",
		border: "2px solid #555",
		background: "#333",
		color: "white",
		cursor: "pointer",
		touchAction: "none"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			display: "flex",
			justifyContent: "space-between",
			width: "800px",
			marginTop: "20px",
			userSelect: "none"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				gap: "10px"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onPointerDown: () => setJoystick({ left: true }),
					onPointerUp: () => setJoystick({ left: false }),
					onPointerLeave: () => setJoystick({ left: false }),
					style: btnStyle,
					children: "◀"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onPointerDown: () => setJoystick({ right: true }),
					onPointerUp: () => setJoystick({ right: false }),
					onPointerLeave: () => setJoystick({ right: false }),
					style: btnStyle,
					children: "▶"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onPointerDown: () => setJoystick({ up: true }),
					onPointerUp: () => setJoystick({ up: false }),
					onPointerLeave: () => setJoystick({ up: false }),
					style: btnStyle,
					children: "▲"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				gap: "10px"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onPointerDown: () => triggerAttack("PUNCH"),
					style: {
						...btnStyle,
						background: "#a00"
					},
					children: "PUNCH"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onPointerDown: () => triggerAttack("KICK"),
					style: {
						...btnStyle,
						background: "#00a"
					},
					children: "KICK"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onPointerDown: () => triggerAttack("HADOUKEN"),
					style: {
						...btnStyle,
						background: "#0aa"
					},
					children: "SPECIAL"
				})
			]
		})]
	});
}
//#endregion
//#region src/components/games/engines/FaskaFighter3/FaskaFighter3.jsx
function FaskaFighter3({ onExit }) {
	const tick = useGameStore((s) => s.tick);
	const setKey = useGameStore((s) => s.setKey);
	const triggerAttack = useGameStore((s) => s.triggerAttack);
	(0, import_react.useEffect)(() => {
		let reqId;
		const loop = () => {
			tick();
			reqId = requestAnimationFrame(loop);
		};
		reqId = requestAnimationFrame(loop);
		const onKeyDown = (e) => {
			setKey(e.code, true);
			if (e.code === "Space") triggerAttack("PUNCH");
			if (e.code === "ShiftLeft") triggerAttack("KICK");
			if (e.code === "KeyE") triggerAttack("HADOUKEN");
		};
		const onKeyUp = (e) => {
			setKey(e.code, false);
		};
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);
		return () => {
			cancelAnimationFrame(reqId);
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
		};
	}, [
		tick,
		setKey,
		triggerAttack
	]);
	const matchState = useGameStore((s) => s.matchState);
	const matchTimer = useGameStore((s) => s.matchTimer);
	(0, import_react.useEffect)(() => {
		if (matchState === "MATCH_OVER" && matchTimer > 200) {
			if (onExit) onExit();
		}
	}, [
		matchState,
		matchTimer,
		onExit
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100vw",
			height: "100vh",
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			background: "#000",
			fontFamily: "sans-serif"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				style: {
					color: "white",
					marginBottom: "10px"
				},
				children: "FASKA FIGHTER 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "relative",
					width: 800,
					height: 450,
					border: "4px solid #444",
					borderRadius: "8px",
					overflow: "hidden",
					background: "#000"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arena, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fighters, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UIOverlay, { onExit })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				style: {
					color: "#aaa",
					marginTop: "15px"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Controls:" }), " W/A/D to Move & Jump. SPACE: Punch, SHIFT: Kick, E: Hadouken"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileJoystick, {})
		]
	});
}
//#endregion
export { FaskaFighter3 as default };
