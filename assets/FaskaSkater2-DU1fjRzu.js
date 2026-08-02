import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { N as ExtrudeGeometry, Rt as Vector3, Tt as Shape, a as useFrame, mt as Quaternion, s as useThree, t as Canvas, tt as Matrix4, xt as RepeatWrapping, y as CanvasTexture } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as create } from "./react-B1iXS_n6.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { i as wt, n as dt, r as qt } from "./dist-DaAzX60v.js";
//#region src/components/games/engines/FaskaSkater2/FaskaSkater2.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var useGameStore = create((set) => ({
	gameState: "start",
	score: 0,
	time: 60,
	trickMessage: "",
	startGame: () => set({
		gameState: "playing",
		score: 0,
		time: 60,
		trickMessage: ""
	}),
	addScore: (pts, trick) => set((state) => ({
		score: state.score + pts,
		trickMessage: trick
	})),
	clearTrickMessage: () => set({ trickMessage: "" }),
	tick: () => set((state) => ({ time: Math.max(0, state.time - 1) })),
	setGameOver: () => set({ gameState: "gameover" })
}));
var useKeys = () => {
	const keys = (0, import_react.useRef)({
		forward: false,
		backward: false,
		left: false,
		right: false,
		jump: false,
		pump: false
	});
	(0, import_react.useEffect)(() => {
		const down = (e) => {
			if (e.code === "ArrowUp" || e.code === "KeyW") keys.current.forward = true;
			if (e.code === "ArrowDown" || e.code === "KeyS") keys.current.pump = true;
			if (e.code === "ArrowLeft" || e.code === "KeyA") keys.current.left = true;
			if (e.code === "ArrowRight" || e.code === "KeyD") keys.current.right = true;
			if (e.code === "Space") keys.current.jump = true;
		};
		const up = (e) => {
			if (e.code === "ArrowUp" || e.code === "KeyW") keys.current.forward = false;
			if (e.code === "ArrowDown" || e.code === "KeyS") keys.current.pump = false;
			if (e.code === "ArrowLeft" || e.code === "KeyA") keys.current.left = false;
			if (e.code === "ArrowRight" || e.code === "KeyD") keys.current.right = false;
			if (e.code === "Space") keys.current.jump = false;
		};
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
		};
	}, []);
	return keys;
};
var GameLoop = () => {
	const { gameState, tick, setGameOver, time } = useGameStore();
	(0, import_react.useEffect)(() => {
		if (gameState !== "playing") return;
		const interval = setInterval(() => {
			tick();
		}, 1e3);
		return () => clearInterval(interval);
	}, [gameState, tick]);
	(0, import_react.useEffect)(() => {
		if (time <= 0 && gameState === "playing") setGameOver();
	}, [
		time,
		gameState,
		setGameOver
	]);
	return null;
};
var HUD = ({ onExit }) => {
	const { gameState, score, time, trickMessage, startGame } = useGameStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			className: "absolute top-4 right-4 text-white font-bold z-50 bg-red-600/50 hover:bg-red-600 px-4 py-2 rounded",
			children: "EXIT"
		}),
		gameState === "start" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-6xl font-bold mb-4 italic text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]",
					children: "FASKA SKATER 2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xl font-bold text-yellow-300",
					children: "CONTROLS:"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-lg",
					children: "Left/Right Arrows: Steer sideways"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-lg",
					children: "Down Arrow: PUMP (hold on transitions to gain speed)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-lg",
					children: "Space: OLLIE (Jump)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-8 text-lg",
					children: "Down Arrow (in air): KICKFLIP"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: startGame,
					className: "px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 rounded text-2xl font-bold transition-all transform hover:scale-110 shadow-[0_0_20px_rgba(255,0,255,0.6)] cursor-pointer",
					children: "DROP IN"
				})
			]
		}),
		gameState === "gameover" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white z-40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-6xl font-bold mb-4 text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]",
					children: "TIME'S UP!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-8 text-4xl text-yellow-400 font-mono",
					children: ["Final Score: ", score]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: startGame,
					className: "px-8 py-4 bg-cyan-600 hover:bg-cyan-500 rounded text-2xl font-bold transition-all transform hover:scale-110 shadow-[0_0_20px_rgba(0,255,255,0.6)] cursor-pointer",
					children: "PLAY AGAIN"
				})
			]
		}),
		gameState === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 pointer-events-none z-10 p-6 flex flex-col justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-start text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-mono",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-4xl font-bold text-yellow-400",
					children: ["SCORE: ", score]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-5xl font-bold text-white",
					children: [time, "s"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center mb-20",
				children: trickMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-6xl font-bold text-fuchsia-500 italic animate-bounce drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]",
					children: trickMessage
				})
			})]
		})
	] });
};
var CameraController = ({ playerRef }) => {
	const { camera } = useThree();
	useFrame(() => {
		if (!playerRef.current) return;
		const pos = playerRef.current.translation();
		const targetPos = new Vector3(pos.x, pos.y + 4, pos.z + 10);
		camera.position.lerp(targetPos, .1);
		camera.lookAt(pos.x, pos.y, pos.z);
	});
	return null;
};
var Halfpipe = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "fixed",
		colliders: "trimesh",
		friction: .05,
		restitution: 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			geometry: (0, import_react.useMemo)(() => {
				const shape = new Shape();
				const flatWidth = 6;
				const radius = 8;
				const height = 12;
				shape.moveTo(-flatWidth / 2 - radius, height);
				shape.lineTo(-flatWidth / 2 - radius, radius);
				shape.absarc(-flatWidth / 2, radius, radius, Math.PI, Math.PI * 1.5, false);
				shape.lineTo(flatWidth / 2, 0);
				shape.absarc(flatWidth / 2, radius, radius, Math.PI * 1.5, Math.PI * 2, false);
				shape.lineTo(flatWidth / 2 + radius, height);
				const thickness = 2;
				shape.lineTo(flatWidth / 2 + radius + thickness, height);
				shape.lineTo(flatWidth / 2 + radius + thickness, -thickness);
				shape.lineTo(-flatWidth / 2 - radius - thickness, -thickness);
				shape.lineTo(-flatWidth / 2 - radius - thickness, height);
				const geom = new ExtrudeGeometry(shape, {
					steps: 1,
					depth: 80,
					bevelEnabled: false
				});
				geom.translate(0, 0, -40);
				return geom;
			}, []),
			castShadow: true,
			receiveShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				map: (0, import_react.useMemo)(() => {
					const canvas = document.createElement("canvas");
					canvas.width = 1024;
					canvas.height = 1024;
					const ctx = canvas.getContext("2d");
					ctx.fillStyle = "#444444";
					ctx.fillRect(0, 0, 1024, 1024);
					for (let i = 0; i < 5e4; i++) {
						ctx.fillStyle = Math.random() > .5 ? "#333333" : "#555555";
						ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 3, 3);
					}
					const colors = [
						"#ff0055",
						"#00ffcc",
						"#eeff00",
						"#aa00ff"
					];
					for (let i = 0; i < 40; i++) {
						ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
						ctx.lineWidth = 4 + Math.random() * 15;
						ctx.beginPath();
						ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
						ctx.bezierCurveTo(Math.random() * 1024, Math.random() * 1024, Math.random() * 1024, Math.random() * 1024, Math.random() * 1024, Math.random() * 1024);
						ctx.stroke();
					}
					const tex = new CanvasTexture(canvas);
					tex.wrapS = RepeatWrapping;
					tex.wrapT = RepeatWrapping;
					tex.repeat.set(4, 10);
					return tex;
				}, []),
				roughness: .9
			})
		})
	});
};
var Skater = ({ playerRef }) => {
	const keys = useKeys();
	const visualGroup = (0, import_react.useRef)();
	const forwardRef = (0, import_react.useRef)(new Vector3(1, 0, 0));
	const stateRef = (0, import_react.useRef)({
		wasGrounded: true,
		airTime: 0,
		trickRot: 0
	});
	const { addScore, gameState } = useGameStore();
	(0, import_react.useEffect)(() => {
		if (gameState === "playing" && playerRef.current) {
			playerRef.current.setTranslation({
				x: -10,
				y: 10,
				z: 0
			}, true);
			playerRef.current.setLinvel({
				x: 0,
				y: 0,
				z: 0
			}, true);
			playerRef.current.setAngvel({
				x: 0,
				y: 0,
				z: 0
			}, true);
			stateRef.current = {
				wasGrounded: true,
				airTime: 0,
				trickRot: 0
			};
			forwardRef.current.set(1, 0, 0);
		}
	}, [gameState, playerRef]);
	useFrame((state, delta) => {
		if (!playerRef.current || gameState !== "playing") return;
		const pos = playerRef.current.translation();
		const vel = playerRef.current.linvel();
		const flatWidth = 6;
		const radius = 8;
		let surfY = 0;
		let normal = new Vector3(0, 1, 0);
		if (pos.x > flatWidth / 2) {
			let dx = pos.x - flatWidth / 2;
			if (dx > radius) dx = radius;
			const dy = -Math.sqrt(Math.max(0, radius * radius - dx * dx));
			surfY = radius + dy;
			normal.set(-dx, -dy, 0).normalize();
		} else if (pos.x < -flatWidth / 2) {
			let dx = pos.x - -flatWidth / 2;
			if (dx < -radius) dx = -radius;
			const dy = -Math.sqrt(Math.max(0, radius * radius - dx * dx));
			surfY = radius + dy;
			normal.set(-dx, -dy, 0).normalize();
		}
		const isGrounded = pos.y <= surfY + .5 + .5;
		if (isGrounded) {
			const steerForce = 25;
			if (keys.current.left) playerRef.current.applyImpulse({
				x: 0,
				y: 0,
				z: -steerForce * delta
			}, true);
			if (keys.current.right) playerRef.current.applyImpulse({
				x: 0,
				y: 0,
				z: steerForce * delta
			}, true);
			if (keys.current.pump) {
				const pumpForce = 20;
				if (pos.x > 0) playerRef.current.applyImpulse({
					x: -pumpForce * delta,
					y: -pumpForce * delta,
					z: 0
				}, true);
				else playerRef.current.applyImpulse({
					x: pumpForce * delta,
					y: -pumpForce * delta,
					z: 0
				}, true);
			}
			if (keys.current.jump) {
				playerRef.current.applyImpulse({
					x: normal.x * 5,
					y: 12,
					z: normal.z * 5
				}, true);
				keys.current.jump = false;
			}
			const targetUp = normal.clone();
			let moveDir = new Vector3(vel.x, vel.y, vel.z);
			if (moveDir.lengthSq() > 2) {
				moveDir.normalize();
				if (moveDir.dot(forwardRef.current) < -.4) moveDir.negate();
				forwardRef.current.copy(moveDir);
			}
			let forward = forwardRef.current.clone();
			forward.projectOnPlane(targetUp).normalize();
			const matrix = new Matrix4().lookAt(new Vector3(0, 0, 0), forward, targetUp);
			const targetQuat = new Quaternion().setFromRotationMatrix(matrix);
			visualGroup.current.quaternion.slerp(targetQuat, 15 * delta);
			if (!stateRef.current.wasGrounded && stateRef.current.airTime > .3) {
				const points = Math.floor(stateRef.current.airTime * 150) + Math.floor(stateRef.current.trickRot) * 30;
				if (points > 100) {
					addScore(points, stateRef.current.trickRot > 15 ? "SICK TRICK!" : "HUGE AIR!");
					setTimeout(useGameStore.getState().clearTrickMessage, 2e3);
				}
				stateRef.current.trickRot = 0;
			}
			stateRef.current.airTime = 0;
		} else {
			stateRef.current.airTime += delta;
			const targetUp = new Vector3(0, 1, 0);
			let forward = forwardRef.current.clone();
			forward.projectOnPlane(targetUp).normalize();
			const matrix = new Matrix4().lookAt(new Vector3(0, 0, 0), forward, targetUp);
			const targetQuat = new Quaternion().setFromRotationMatrix(matrix);
			visualGroup.current.quaternion.slerp(targetQuat, 2 * delta);
			if (keys.current.pump) {
				stateRef.current.trickRot += 25 * delta;
				visualGroup.current.rotateZ(25 * delta);
			}
		}
		if (pos.z > 38) playerRef.current.setTranslation({
			x: pos.x,
			y: pos.y,
			z: 38
		}, true);
		if (pos.z < -38) playerRef.current.setTranslation({
			x: pos.x,
			y: pos.y,
			z: -38
		}, true);
		stateRef.current.wasGrounded = isGrounded;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: playerRef,
		colliders: "ball",
		mass: 1,
		friction: 0,
		restitution: 0,
		canSleep: false,
		enabledRotations: [
			false,
			false,
			false
		],
		linearDamping: .1,
		position: [
			0,
			2,
			0
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: visualGroup,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						-.4,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.4,
						.08,
						1.2
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ff0055" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.15,
						-.45,
						.4
					],
					rotation: [
						0,
						0,
						Math.PI / 2
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.05,
						.05,
						.1
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.15,
						-.45,
						.4
					],
					rotation: [
						0,
						0,
						Math.PI / 2
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.05,
						.05,
						.1
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.15,
						-.45,
						-.4
					],
					rotation: [
						0,
						0,
						Math.PI / 2
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.05,
						.05,
						.1
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.15,
						-.45,
						-.4
					],
					rotation: [
						0,
						0,
						Math.PI / 2
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.05,
						.05,
						.1
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.2,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [.25, .6] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#00ffff" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.8,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [.2] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ffcc00" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.85,
						-.15
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.3,
						.1,
						.15
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
				})
			]
		})
	});
};
var Effects = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(dt, {
	disableNormalPass: true,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(wt, {
		luminanceThreshold: .4,
		mipmapBlur: true,
		intensity: 1.2
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(qt, {
		eskil: false,
		offset: .1,
		darkness: 1.1
	})]
});
function FaskaSkater2({ onExit }) {
	const playerRef = (0, import_react.useRef)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full h-screen bg-black overflow-hidden relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HUD, { onExit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameLoop, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
				shadows: true,
				camera: {
					position: [
						0,
						5,
						15
					],
					fov: 60
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
						attach: "background",
						args: ["#0a0a1a"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, {
						distance: 45e4,
						sunPosition: [
							0,
							1,
							0
						],
						inclination: 0,
						azimuth: .25
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
						position: [
							10,
							20,
							10
						],
						intensity: 1.5,
						castShadow: true,
						"shadow-mapSize": [2048, 2048]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
						gravity: [
							0,
							-25,
							0
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Halfpipe, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skater, { playerRef })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraController, { playerRef }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Effects, {})
				]
			})
		]
	});
}
//#endregion
export { FaskaSkater2 as default, useGameStore };
