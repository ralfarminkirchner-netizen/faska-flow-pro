import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, s as useThree, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, n as CuboidCollider, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { r as Sphere, t as Box } from "./shapes-BBrczoYY.js";
//#region src/components/games/engines/FaskaTekkenSwarm/FaskaTekkenSwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var ELEMENTS = [
	{
		symbol: "H",
		number: "1",
		name: "Hydrogen"
	},
	{
		symbol: "He",
		number: "2",
		name: "Helium"
	},
	{
		symbol: "Li",
		number: "3",
		name: "Lithium"
	},
	{
		symbol: "Be",
		number: "4",
		name: "Beryllium"
	},
	{
		symbol: "B",
		number: "5",
		name: "Boron"
	},
	{
		symbol: "C",
		number: "6",
		name: "Carbon"
	},
	{
		symbol: "N",
		number: "7",
		name: "Nitrogen"
	},
	{
		symbol: "O",
		number: "8",
		name: "Oxygen"
	},
	{
		symbol: "F",
		number: "9",
		name: "Fluorine"
	}
];
var EventBus = class {
	constructor() {
		this.listeners = {};
	}
	on(e, cb) {
		if (!this.listeners[e]) this.listeners[e] = [];
		this.listeners[e].push(cb);
	}
	off(e, cb) {
		if (this.listeners[e]) this.listeners[e] = this.listeners[e].filter((l) => l !== cb);
	}
	emit(e, data) {
		if (this.listeners[e]) this.listeners[e].forEach((cb) => cb(data));
	}
};
var bus = new EventBus();
var gameRefs = {
	playerPos: new Vector3(-4, 2, 0),
	aiPos: new Vector3(4, 2, 0)
};
var ParticlesManager = () => {
	const [particles, setParticles] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const handleSpawn = ({ pos, color }) => {
			const id = Date.now() + Math.random().toString();
			const newParticles = Array.from({ length: 20 }).map((_, i) => ({
				id: `${id}-${i}`,
				pos: [
					pos.x,
					pos.y + 1 + Math.random() * 1.5,
					pos.z + (Math.random() - .5)
				],
				vel: [
					(Math.random() - .5) * 20,
					Math.random() * 20,
					(Math.random() - .5) * 20
				],
				color
			}));
			setParticles((prev) => [...prev, ...newParticles]);
			setTimeout(() => {
				setParticles((prev) => prev.filter((p) => !p.id.startsWith(id)));
			}, 500);
		};
		bus.on("SPAWN_PARTICLES", handleSpawn);
		return () => bus.off("SPAWN_PARTICLES", handleSpawn);
	}, []);
	return particles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Particle, { ...p }, p.id));
};
var Particle = ({ pos, vel, color }) => {
	const ref = (0, import_react.useRef)();
	useFrame((state, delta) => {
		if (ref.current) {
			ref.current.position.x += vel[0] * delta;
			ref.current.position.y += vel[1] * delta;
			ref.current.position.z += vel[2] * delta;
			ref.current.scale.multiplyScalar(.85);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref,
		position: pos,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			.4,
			.4,
			.4
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color })]
	});
};
var CameraShakeManager = () => {
	const { camera } = useThree();
	const shakeRef = (0, import_react.useRef)(0);
	const originalPos = (0, import_react.useRef)(new Vector3(0, 4, 14));
	(0, import_react.useEffect)(() => {
		const handleShake = (intensity) => {
			shakeRef.current = intensity;
		};
		bus.on("CAMERA_SHAKE", handleShake);
		return () => bus.off("CAMERA_SHAKE", handleShake);
	}, []);
	useFrame((state, delta) => {
		if (shakeRef.current > 0) {
			camera.position.x = originalPos.current.x + (Math.random() - .5) * shakeRef.current;
			camera.position.y = originalPos.current.y + (Math.random() - .5) * shakeRef.current;
			camera.position.z = originalPos.current.z + (Math.random() - .5) * shakeRef.current;
			shakeRef.current -= delta * 3;
		} else camera.position.lerp(originalPos.current, .1);
		camera.lookAt(0, 2, 0);
	});
	return null;
};
var Player = ({ status }) => {
	const rb = (0, import_react.useRef)();
	const [keys, setKeys] = (0, import_react.useState)({
		a: false,
		d: false,
		w: false,
		s: false,
		space: false
	});
	const isAttacking = (0, import_react.useRef)(false);
	const blockRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.code === "KeyA") setKeys((k) => ({
				...k,
				a: true
			}));
			if (e.code === "KeyD") setKeys((k) => ({
				...k,
				d: true
			}));
			if (e.code === "KeyW") setKeys((k) => ({
				...k,
				w: true
			}));
			if (e.code === "KeyS") setKeys((k) => ({
				...k,
				s: true
			}));
			if (e.code === "Space") setKeys((k) => ({
				...k,
				space: true
			}));
		};
		const handleKeyUp = (e) => {
			if (e.code === "KeyA") setKeys((k) => ({
				...k,
				a: false
			}));
			if (e.code === "KeyD") setKeys((k) => ({
				...k,
				d: false
			}));
			if (e.code === "KeyW") setKeys((k) => ({
				...k,
				w: false
			}));
			if (e.code === "KeyS") setKeys((k) => ({
				...k,
				s: false
			}));
			if (e.code === "Space") setKeys((k) => ({
				...k,
				space: false
			}));
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const onQteSuccess = () => {
			isAttacking.current = true;
			const p = rb.current.translation();
			const aiP = gameRefs.aiPos;
			const dir = Math.sign(aiP.x - p.x);
			rb.current.setLinvel({
				x: dir * 25,
				y: 0,
				z: 0
			}, true);
			setTimeout(() => {
				isAttacking.current = false;
				bus.emit("PLAYER_HIT_AI", 35);
				bus.emit("SPAWN_PARTICLES", {
					pos: gameRefs.aiPos,
					color: "cyan"
				});
				bus.emit("CAMERA_SHAKE", 1);
				rb.current.setLinvel({
					x: -dir * 10,
					y: 5,
					z: 0
				}, true);
			}, 150);
		};
		const onQteFail = () => {
			const p = rb.current.translation();
			const aiP = gameRefs.aiPos;
			const dir = Math.sign(p.x - aiP.x);
			rb.current.setLinvel({
				x: dir * 15,
				y: 8,
				z: 0
			}, true);
			bus.emit("AI_HIT_PLAYER", 15);
			bus.emit("CAMERA_SHAKE", .5);
			bus.emit("SPAWN_PARTICLES", {
				pos: rb.current.translation(),
				color: "red"
			});
		};
		const onAiAttack = (data) => {
			if (blockRef.current) {
				bus.emit("SPAWN_PARTICLES", {
					pos: rb.current.translation(),
					color: "white"
				});
				const dir = Math.sign(rb.current.translation().x - gameRefs.aiPos.x);
				rb.current.setLinvel({
					x: dir * 8,
					y: 0,
					z: 0
				}, true);
			} else {
				bus.emit("AI_HIT_PLAYER", data.damage);
				bus.emit("SPAWN_PARTICLES", {
					pos: rb.current.translation(),
					color: "red"
				});
				bus.emit("CAMERA_SHAKE", .5);
				const dir = Math.sign(rb.current.translation().x - gameRefs.aiPos.x);
				rb.current.setLinvel({
					x: dir * 15,
					y: 8,
					z: 0
				}, true);
			}
		};
		bus.on("QTE_SUCCESS", onQteSuccess);
		bus.on("QTE_FAIL", onQteFail);
		bus.on("AI_ATTACK_HIT", onAiAttack);
		return () => {
			bus.off("QTE_SUCCESS", onQteSuccess);
			bus.off("QTE_FAIL", onQteFail);
			bus.off("AI_ATTACK_HIT", onAiAttack);
		};
	}, []);
	useFrame(() => {
		if (!rb.current) return;
		const pos = rb.current.translation();
		gameRefs.playerPos.copy(pos);
		blockRef.current = keys.s && status === "playing";
		if (Math.abs(pos.z) > .05) rb.current.setTranslation({
			x: pos.x,
			y: pos.y,
			z: 0
		}, true);
		if (status === "playing" && !isAttacking.current) {
			let vx = 0;
			if (keys.a) vx = -8;
			if (keys.d) vx = 8;
			if (keys.s) vx = 0;
			const vel = rb.current.linvel();
			if (keys.w && Math.abs(vel.y) < .1) rb.current.setLinvel({
				x: vx,
				y: 15,
				z: 0
			}, true);
			else rb.current.setLinvel({
				x: vx !== 0 ? vx : vel.x * .8,
				y: vel.y,
				z: 0
			}, true);
			if (keys.space) {
				if (Math.abs(pos.x - gameRefs.aiPos.x) < 5) {
					setKeys((k) => ({
						...k,
						space: false
					}));
					bus.emit("QTE_START");
				}
			}
		} else if (status === "qte") rb.current.setLinvel({
			x: 0,
			y: 0,
			z: 0
		}, true);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		ref: rb,
		position: [
			-5,
			2,
			0
		],
		lockRotations: true,
		enabledRotations: [
			false,
			false,
			false
		],
		mass: 1,
		friction: 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
			args: [
				1.2,
				2.2,
				1.2
			],
			castShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: blockRef.current ? "#888" : "#0055ff" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sphere, {
			args: [.5],
			position: [
				0,
				1.6,
				0
			],
			castShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "cyan" })
		})]
	});
};
var AI = ({ status }) => {
	const rb = (0, import_react.useRef)();
	const attackTimer = (0, import_react.useRef)(0);
	const isAttacking = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const onPlayerHit = () => {
			const p = rb.current.translation();
			const pP = gameRefs.playerPos;
			const dir = Math.sign(p.x - pP.x);
			rb.current.setLinvel({
				x: dir * 18,
				y: 10,
				z: 0
			}, true);
		};
		bus.on("PLAYER_HIT_AI", onPlayerHit);
		return () => bus.off("PLAYER_HIT_AI", onPlayerHit);
	}, []);
	useFrame((state, delta) => {
		if (!rb.current) return;
		const pos = rb.current.translation();
		gameRefs.aiPos.copy(pos);
		if (Math.abs(pos.z) > .05) rb.current.setTranslation({
			x: pos.x,
			y: pos.y,
			z: 0
		}, true);
		if (status === "playing" && !isAttacking.current) {
			const pP = gameRefs.playerPos;
			const dist = Math.abs(pos.x - pP.x);
			const dir = Math.sign(pP.x - pos.x);
			let vx = 0;
			if (dist > 3) vx = dir * 4;
			else {
				attackTimer.current += delta;
				if (attackTimer.current > 1.2) {
					attackTimer.current = 0;
					isAttacking.current = true;
					rb.current.setLinvel({
						x: -dir * 3,
						y: 6,
						z: 0
					}, true);
					setTimeout(() => {
						if (status === "playing" && rb.current) {
							rb.current.setLinvel({
								x: dir * 20,
								y: 0,
								z: 0
							}, true);
							setTimeout(() => {
								isAttacking.current = false;
								if (Math.abs(gameRefs.aiPos.x - gameRefs.playerPos.x) < 3.5 && status === "playing") bus.emit("AI_ATTACK_HIT", { damage: 15 });
							}, 150);
						} else isAttacking.current = false;
					}, 400);
				}
			}
			const vel = rb.current.linvel();
			if (!isAttacking.current) rb.current.setLinvel({
				x: vx !== 0 ? vx : vel.x * .8,
				y: vel.y,
				z: 0
			}, true);
		} else if (status === "qte") rb.current.setLinvel({
			x: 0,
			y: 0,
			z: 0
		}, true);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		ref: rb,
		position: [
			5,
			2,
			0
		],
		lockRotations: true,
		enabledRotations: [
			false,
			false,
			false
		],
		mass: 1.5,
		friction: 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
			args: [
				1.4,
				2.4,
				1.4
			],
			castShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: isAttacking.current ? "#ffcc00" : "#ff3300" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sphere, {
			args: [.55],
			position: [
				0,
				1.7,
				0
			],
			castShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#330000" })
		})]
	});
};
var GameScene = ({ status }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .6 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				5,
				12,
				8
			],
			intensity: 1.5,
			castShadow: true
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, {
			sunPosition: [
				5,
				10,
				-10
			],
			turbidity: .1,
			rayleigh: .5
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
			gravity: [
				0,
				-40,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, { status }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AI, { status }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
					type: "fixed",
					friction: 1,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
						args: [
							50,
							2,
							10
						],
						position: [
							0,
							-1,
							0
						],
						receiveShadow: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
					type: "fixed",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
						args: [
							1,
							20,
							5
						],
						position: [
							-18,
							10,
							0
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
						args: [
							1,
							20,
							5
						],
						position: [
							18,
							10,
							0
						]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParticlesManager, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraShakeManager, {})
	] });
};
function FaskaTekkenSwarm({ onExit }) {
	const [playerHealth, setPlayerHealth] = (0, import_react.useState)(100);
	const [aiHealth, setAiHealth] = (0, import_react.useState)(100);
	const [status, setStatus] = (0, import_react.useState)("playing");
	const [qte, setQte] = (0, import_react.useState)(null);
	const [gameId, setGameId] = (0, import_react.useState)(0);
	const qteRef = (0, import_react.useRef)(qte);
	(0, import_react.useEffect)(() => {
		qteRef.current = qte;
	}, [qte]);
	const resetGame = () => {
		setPlayerHealth(100);
		setAiHealth(100);
		setStatus("playing");
		setQte(null);
		setGameId((id) => id + 1);
	};
	(0, import_react.useEffect)(() => {
		const handleQteStart = () => {
			setQte({
				sequence: Array.from({ length: 3 }).map(() => ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)]),
				index: 0,
				timeLeft: 4.5
			});
			setStatus("qte");
		};
		const handlePlayerHit = (damage) => setAiHealth((h) => Math.max(0, h - damage));
		const handleAiHit = (damage) => setPlayerHealth((h) => Math.max(0, h - damage));
		bus.on("QTE_START", handleQteStart);
		bus.on("PLAYER_HIT_AI", handlePlayerHit);
		bus.on("AI_HIT_PLAYER", handleAiHit);
		return () => {
			bus.off("QTE_START", handleQteStart);
			bus.off("PLAYER_HIT_AI", handlePlayerHit);
			bus.off("AI_HIT_PLAYER", handleAiHit);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (playerHealth <= 0 && status !== "gameover") setStatus("gameover");
		if (aiHealth <= 0 && status !== "victory") setStatus("victory");
	}, [
		playerHealth,
		aiHealth,
		status
	]);
	(0, import_react.useEffect)(() => {
		if (status !== "qte") return;
		const timer = setInterval(() => {
			setQte((q) => {
				if (!q) return null;
				const newTime = q.timeLeft - .1;
				if (newTime <= 0) {
					bus.emit("QTE_FAIL");
					setStatus("playing");
					return null;
				}
				return {
					...q,
					timeLeft: newTime
				};
			});
		}, 100);
		const handleKeyDown = (e) => {
			const currentQte = qteRef.current;
			if (!currentQte || status !== "qte") return;
			if (!/^[1-9]$/.test(e.key)) return;
			const currentElement = currentQte.sequence[currentQte.index];
			if (e.key === currentElement.number) {
				const newIndex = currentQte.index + 1;
				if (newIndex >= currentQte.sequence.length) {
					bus.emit("QTE_SUCCESS");
					setStatus("playing");
					setQte(null);
				} else setQte({
					...currentQte,
					index: newIndex
				});
			} else {
				bus.emit("QTE_FAIL");
				setStatus("playing");
				setQte(null);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			clearInterval(timer);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [status]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100vw",
			height: "100vh",
			position: "relative",
			overflow: "hidden",
			background: "#111",
			fontFamily: "sans-serif"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					top: 20,
					left: "50%",
					transform: "translateX(-50%)",
					zIndex: 1e3,
					padding: "10px 30px",
					fontSize: 18,
					fontWeight: "bold",
					background: "#ff3333",
					color: "white",
					border: "2px solid white",
					borderRadius: 8,
					cursor: "pointer",
					boxShadow: "0 4px 6px rgba(0,0,0,0.5)"
				},
				children: "Beenden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					inset: 0,
					pointerEvents: "none",
					zIndex: 10
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							position: "absolute",
							top: 20,
							left: 30
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "white",
								fontSize: 24,
								fontWeight: "900",
								textShadow: "2px 2px 0 #000"
							},
							children: "PLAYER"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								width: 300,
								height: 24,
								background: "#333",
								border: "3px solid white",
								borderRadius: 4,
								overflow: "hidden",
								boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
								width: `${playerHealth}%`,
								height: "100%",
								background: playerHealth > 25 ? "#00ff00" : "#ff0000",
								transition: "width 0.2s ease-out"
							} })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							position: "absolute",
							top: 20,
							right: 30
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								color: "white",
								fontSize: 24,
								fontWeight: "900",
								textAlign: "right",
								textShadow: "2px 2px 0 #000"
							},
							children: "AI BOSS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								width: 300,
								height: 24,
								background: "#333",
								border: "3px solid white",
								borderRadius: 4,
								overflow: "hidden",
								boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
								float: "right"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
								width: `${aiHealth}%`,
								height: "100%",
								background: "#ff3300",
								float: "right",
								transition: "width 0.2s ease-out"
							} })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							position: "absolute",
							bottom: 30,
							width: "100%",
							textAlign: "center",
							color: "white",
							fontSize: 18,
							fontWeight: "bold",
							textShadow: "1px 1px 2px black"
						},
						children: "Move: A / D \xA0|\xA0 Jump: W \xA0|\xA0 Block: S \xA0|\xA0 Combo Attack (When Close): SPACE"
					})
				]
			}),
			status === "qte" && qte && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					inset: 0,
					zIndex: 20,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					background: "rgba(0,0,0,0.7)",
					backdropFilter: "blur(4px)"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							color: "#ffcc00",
							fontSize: 64,
							textShadow: "4px 4px 0 #000",
							margin: 0,
							paddingBottom: 20
						},
						children: "COMBO ATTACK!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: "white",
							fontSize: 24,
							fontWeight: "bold",
							marginBottom: 40
						},
						children: "Type the Atomic Numbers!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							gap: 30
						},
						children: qte.sequence.map((el, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								width: 140,
								height: 160,
								background: idx < qte.index ? "#00aa00" : idx === qte.index ? "#ff8800" : "#222",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								border: `6px solid ${idx === qte.index ? "white" : "#555"}`,
								borderRadius: 16,
								boxShadow: idx === qte.index ? "0 0 30px #ffaa00" : "none",
								transform: idx === qte.index ? "scale(1.1)" : "scale(1)",
								transition: "all 0.1s"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										fontSize: 18,
										color: "#ddd",
										fontWeight: "bold"
									},
									children: el.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										fontSize: 64,
										fontWeight: "900",
										color: "white",
										lineHeight: "1.2"
									},
									children: el.symbol
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									style: {
										fontSize: 16,
										color: "#0ff",
										fontWeight: "bold",
										marginTop: 10
									},
									children: ["Key: ", el.number]
								})
							]
						}, idx))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							marginTop: 60,
							width: 600,
							height: 16,
							background: "#440000",
							border: "3px solid white",
							borderRadius: 8,
							overflow: "hidden"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
							width: `${qte.timeLeft / 4.5 * 100}%`,
							height: "100%",
							background: "#ff3333"
						} })
					})
				]
			}),
			status === "gameover" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					inset: 0,
					zIndex: 100,
					background: "rgba(0,0,0,0.85)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					style: {
						color: "#ff3333",
						fontSize: 80,
						textShadow: "4px 4px 0 #000",
						margin: 0
					},
					children: "DEFEATED"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: resetGame,
					style: {
						marginTop: 40,
						padding: "15px 50px",
						fontSize: 24,
						fontWeight: "bold",
						background: "white",
						color: "black",
						border: "none",
						borderRadius: 8,
						cursor: "pointer"
					},
					children: "Retry"
				})]
			}),
			status === "victory" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					inset: 0,
					zIndex: 100,
					background: "rgba(0,0,0,0.85)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					style: {
						color: "#00ffcc",
						fontSize: 80,
						textShadow: "4px 4px 0 #000",
						margin: 0
					},
					children: "VICTORY!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: resetGame,
					style: {
						marginTop: 40,
						padding: "15px 50px",
						fontSize: 24,
						fontWeight: "bold",
						background: "white",
						color: "black",
						border: "none",
						borderRadius: 8,
						cursor: "pointer"
					},
					children: "Play Again"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
				camera: {
					position: [
						0,
						4,
						15
					],
					fov: 50
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
						attach: "background",
						args: ["#1a1a2e"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
						attach: "fog",
						args: [
							"#1a1a2e",
							10,
							40
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
						fallback: null,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameScene, { status }, gameId)
					})
				]
			})
		]
	});
}
//#endregion
export { FaskaTekkenSwarm as default };
