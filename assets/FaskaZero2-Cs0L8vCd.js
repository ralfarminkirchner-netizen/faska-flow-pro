import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { N as ExtrudeGeometry, Rt as Vector3, Tt as Shape, a as useFrame, b as CatmullRomCurve3, mt as Quaternion, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as create } from "./react-B1iXS_n6.js";
import { n as useKeyboardControls, t as KeyboardControls } from "./KeyboardControls-e2HMFd2c.js";
import { a as Physics, n as CuboidCollider, o as RigidBody, s as useRapier } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Environment } from "./Environment-CqP6Yhdo.js";
import { t as Trail } from "./Trail-DGj-8YKN.js";
import { t as Stars } from "./Stars-7m8Mrcxr.js";
import { a as yt, i as wt, n as dt, r as qt } from "./dist-DaAzX60v.js";
//#region src/components/games/engines/FaskaZero2/FaskaZero2.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var useGameStore = create((set) => ({
	gameState: "START",
	lap: 1,
	time: 0,
	maxLaps: 3,
	startGame: () => set({
		gameState: "PLAYING",
		lap: 1,
		time: 0
	}),
	incrementLap: () => set((state) => {
		if (state.lap >= state.maxLaps) return {
			gameState: "GAMEOVER",
			lap: state.maxLaps
		};
		return { lap: state.lap + 1 };
	}),
	updateTime: (dt) => set((state) => ({ time: state.time + dt })),
	resetGame: () => set({
		gameState: "START",
		lap: 1,
		time: 0
	})
}));
var HOVER_HEIGHT = 1.5;
var HOVER_SPRING = 250;
var HOVER_DAMP = 15;
var THRUST = 150;
var TURN_SPEED = 3.5;
var CONTROLS = [
	{
		name: "forward",
		keys: ["ArrowUp", "KeyW"]
	},
	{
		name: "back",
		keys: ["ArrowDown", "KeyS"]
	},
	{
		name: "left",
		keys: ["ArrowLeft", "KeyA"]
	},
	{
		name: "right",
		keys: ["ArrowRight", "KeyD"]
	},
	{
		name: "boost",
		keys: ["Shift"]
	}
];
var TRACK_POINTS = [
	new Vector3(0, 0, 0),
	new Vector3(0, 0, -200),
	new Vector3(100, 20, -350),
	new Vector3(300, 50, -400),
	new Vector3(500, 20, -300),
	new Vector3(600, -20, 0),
	new Vector3(400, -40, 200),
	new Vector3(200, 0, 150)
];
var Ship = () => {
	const bodyRef = (0, import_react.useRef)(null);
	const [, getKeys] = useKeyboardControls();
	const boost = useKeyboardControls((state) => state.boost);
	const { rapier, world } = useRapier();
	const gameState = useGameStore((s) => s.gameState);
	const checkpoints = (0, import_react.useMemo)(() => TRACK_POINTS.map((p) => p.clone()), []);
	const currentCheckpointIndex = (0, import_react.useRef)(0);
	const incrementLap = useGameStore((s) => s.incrementLap);
	const rayOffsets = (0, import_react.useMemo)(() => [
		new Vector3(1, 0, 1.5),
		new Vector3(-1, 0, 1.5),
		new Vector3(1, 0, -1.5),
		new Vector3(-1, 0, -1.5)
	], []);
	useFrame((state, delta) => {
		if (gameState !== "PLAYING") return;
		if (!bodyRef.current) return;
		const body = bodyRef.current;
		const keys = getKeys();
		const pos = body.translation();
		const rot = body.rotation();
		const vel = body.linvel();
		const angVel = body.angvel();
		const quaternion = new Quaternion(rot.x, rot.y, rot.z, rot.w);
		const forward = new Vector3(0, 0, -1).applyQuaternion(quaternion);
		const up = new Vector3(0, 1, 0).applyQuaternion(quaternion);
		const right = new Vector3(1, 0, 0).applyQuaternion(quaternion);
		const rayDir = new Vector3(0, -1, 0).applyQuaternion(quaternion);
		let hitCount = 0;
		const v_ang = new Vector3(angVel.x, angVel.y, angVel.z);
		const v_lin = new Vector3(vel.x, vel.y, vel.z);
		for (let offset of rayOffsets) {
			const localOffset = offset.clone().applyQuaternion(quaternion);
			const rayOrigin = new Vector3(pos.x, pos.y, pos.z).add(localOffset);
			const ray = new rapier.Ray(rayOrigin, rayDir);
			const hit = world.castRay(ray, HOVER_HEIGHT * 2, true);
			if (hit) {
				hitCount++;
				const compression = HOVER_HEIGHT - hit.toi;
				if (compression > 0) {
					const upVelocity = v_lin.clone().add(v_ang.clone().cross(localOffset)).dot(rayDir) * -1;
					const springForce = compression * HOVER_SPRING;
					const dampForce = upVelocity * HOVER_DAMP;
					const totalForce = Math.max(0, springForce - dampForce);
					const impulse = rayDir.clone().multiplyScalar(-1).multiplyScalar(totalForce * delta);
					body.applyImpulseAtPoint(impulse, rayOrigin, true);
				}
			}
		}
		body.applyImpulse(rayDir.clone().multiplyScalar(40 * delta), true);
		if (hitCount > 0) {
			let thrustMult = keys.boost ? 1.8 : 1;
			let forwardForce = 0;
			if (keys.forward) forwardForce = THRUST * thrustMult;
			if (keys.back) forwardForce = -THRUST * .5;
			if (forwardForce !== 0) body.applyImpulse(forward.clone().multiplyScalar(forwardForce * delta), true);
			if (keys.left) body.applyTorqueImpulse(up.clone().multiplyScalar(TURN_SPEED * delta), true);
			if (keys.right) body.applyTorqueImpulse(up.clone().multiplyScalar(-TURN_SPEED * delta), true);
			const localVel = v_lin.clone().applyQuaternion(quaternion.clone().invert());
			const gripForce = -localVel.x * 25;
			body.applyImpulse(right.clone().multiplyScalar(gripForce * delta), true);
			const forwardDrag = -localVel.z * 1.5;
			body.applyImpulse(forward.clone().multiplyScalar(forwardDrag * delta), true);
			body.setAngvel({
				x: angVel.x * .9,
				y: angVel.y * .9,
				z: angVel.z * .9
			}, true);
		} else {
			body.applyImpulse(new Vector3(0, -15 * delta, 0), true);
			const worldUp = new Vector3(0, 1, 0);
			const rightingTorque = new Vector3().crossVectors(up, worldUp).multiplyScalar(10 * delta);
			body.applyTorqueImpulse(rightingTorque, true);
		}
		const currentPos = new Vector3(pos.x, pos.y, pos.z);
		if (currentPos.y < -150) {
			const cp = checkpoints[currentCheckpointIndex.current];
			const dir = checkpoints[(currentCheckpointIndex.current + 1) % checkpoints.length].clone().sub(cp).normalize();
			const q = new Quaternion().setFromUnitVectors(new Vector3(0, 0, -1), dir);
			body.setTranslation({
				x: cp.x,
				y: cp.y + 10,
				z: cp.z
			}, true);
			body.setLinvel({
				x: 0,
				y: 0,
				z: 0
			}, true);
			body.setAngvel({
				x: 0,
				y: 0,
				z: 0
			}, true);
			body.setRotation(q, true);
		}
		const nextIndex = (currentCheckpointIndex.current + 1) % checkpoints.length;
		const nextCheckpoint = checkpoints[nextIndex];
		if (currentPos.distanceTo(nextCheckpoint) < 100) {
			currentCheckpointIndex.current = nextIndex;
			if (nextIndex === 0) incrementLap();
		}
		const speedZoom = keys.boost ? 15 : 12;
		const idealOffset = forward.clone().multiplyScalar(-speedZoom).add(up.clone().multiplyScalar(5));
		const targetCamPos = currentPos.clone().add(idealOffset);
		state.camera.position.lerp(targetCamPos, .1);
		const lookAtPos = currentPos.clone().add(forward.clone().multiplyScalar(20));
		const currentLookAt = new Vector3();
		state.camera.getWorldDirection(currentLookAt);
		const targetLookAt = lookAtPos.clone().sub(state.camera.position).normalize();
		currentLookAt.lerp(targetLookAt, .1);
		state.camera.lookAt(state.camera.position.clone().add(currentLookAt));
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		ref: bodyRef,
		colliders: false,
		mass: 2,
		position: [
			0,
			10,
			-10
		],
		linearDamping: .1,
		angularDamping: .1,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
			args: [
				2.5,
				.5,
				2.5
			],
			position: [
				0,
				.25,
				0
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					2,
					.5,
					4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#00ffcc",
					metalness: .8,
					roughness: .2
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					0,
					.5
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					5,
					.1,
					1.5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#00ffcc",
					metalness: .8,
					roughness: .2
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					0,
					-2.5
				],
				rotation: [
					-Math.PI / 2,
					0,
					Math.PI / 4
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.1,
					1.414,
					1,
					4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#00ffcc",
					metalness: .8,
					roughness: .2
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.4,
					-.5
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.8,
					.4,
					1.5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#111",
					metalness: .9,
					roughness: .1
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trail, {
				width: boost ? 2 : 1,
				color: boost ? "#ff00ff" : "#00ffff",
				length: boost ? 20 : 10,
				attenuation: (t) => t * t,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.8,
						0,
						2
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [.3] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
						color: boost ? [
							10,
							0,
							10
						] : [
							0,
							5,
							10
						],
						toneMapped: false
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trail, {
				width: boost ? 2 : 1,
				color: boost ? "#ff00ff" : "#00ffff",
				length: boost ? 20 : 10,
				attenuation: (t) => t * t,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.8,
						0,
						2
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [.3] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
						color: boost ? [
							10,
							0,
							10
						] : [
							0,
							5,
							10
						],
						toneMapped: false
					})]
				})
			})
		] })]
	});
};
var Track = () => {
	const curve = (0, import_react.useMemo)(() => new CatmullRomCurve3(TRACK_POINTS, true), []);
	const shape = (0, import_react.useMemo)(() => {
		const s = new Shape();
		s.moveTo(-20, 0);
		s.lineTo(-10, 0);
		s.lineTo(0, 0);
		s.lineTo(10, 0);
		s.lineTo(20, 0);
		s.lineTo(20, -2);
		s.lineTo(-20, -2);
		s.lineTo(-20, 0);
		return s;
	}, []);
	const geometry = (0, import_react.useMemo)(() => new ExtrudeGeometry(shape, {
		extrudePath: curve,
		steps: 400,
		closed: true
	}), [shape, curve]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		type: "fixed",
		colliders: "trimesh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			geometry,
			receiveShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#111",
				roughness: .7,
				metalness: .8
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			geometry,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#00ffff",
				wireframe: true,
				transparent: true,
				opacity: .15,
				polygonOffset: true,
				polygonOffsetFactor: -1
			})
		})]
	});
};
var HUD = ({ onExit }) => {
	const { gameState, lap, time, maxLaps, startGame, resetGame } = useGameStore();
	(0, import_react.useEffect)(() => {
		let interval;
		if (gameState === "PLAYING") interval = setInterval(() => {
			useGameStore.getState().updateTime(.1);
		}, 100);
		return () => clearInterval(interval);
	}, [gameState]);
	if (gameState === "START") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 flex items-center justify-center bg-black/80 text-white z-10 flex-col font-mono",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-6xl font-bold mb-4 text-cyan-400 tracking-widest",
				style: { textShadow: "0 0 20px cyan" },
				children: "FASKA ZERO 2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-8 text-xl",
				children: "Arrows/WASD to Move | SHIFT to Boost"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: startGame,
					className: "px-8 py-4 bg-cyan-600 hover:bg-cyan-500 rounded text-xl uppercase font-bold transition-all shadow-[0_0_15px_rgba(0,255,255,0.5)] cursor-pointer",
					children: "Start Race"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					className: "px-8 py-4 bg-gray-600 hover:bg-gray-500 rounded text-xl uppercase font-bold transition-all cursor-pointer",
					children: "Exit"
				})]
			})
		]
	});
	if (gameState === "GAMEOVER") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 flex items-center justify-center bg-black/80 text-white z-10 flex-col font-mono",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-6xl font-bold mb-4 text-cyan-400",
				children: "RACE FINISHED"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-8 text-3xl",
				children: [
					"Time: ",
					time.toFixed(1),
					"s"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: resetGame,
					className: "px-8 py-4 bg-cyan-600 hover:bg-cyan-500 rounded text-xl uppercase font-bold cursor-pointer",
					children: "Play Again"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					className: "px-8 py-4 bg-gray-600 hover:bg-gray-500 rounded text-xl uppercase font-bold cursor-pointer",
					children: "Exit"
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute top-0 left-0 w-full p-8 flex justify-between text-white font-mono z-10 pointer-events-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-4xl font-bold",
			style: { textShadow: "0 0 10px cyan" },
			children: [
				"LAP ",
				lap,
				"/",
				maxLaps
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-4xl font-bold",
			style: { textShadow: "0 0 10px cyan" },
			children: [time.toFixed(1), "s"]
		})]
	});
};
function FaskaZero2({ onExit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full h-full relative bg-black",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyboardControls, {
			map: CONTROLS,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
				shadows: true,
				camera: {
					position: [
						0,
						5,
						10
					],
					fov: 75
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
						attach: "background",
						args: ["#050510"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
						position: [
							100,
							200,
							50
						],
						intensity: 2,
						castShadow: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Environment, { preset: "night" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
						radius: 100,
						depth: 50,
						count: 5e3,
						factor: 4,
						saturation: 0,
						fade: true,
						speed: 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
						fallback: null,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
							gravity: [
								0,
								0,
								0
							],
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Track, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ship, {})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(dt, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(wt, {
							luminanceThreshold: .5,
							mipmapBlur: true,
							intensity: 2
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(yt, { offset: [.002, .002] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(qt, {
							eskil: false,
							offset: .1,
							darkness: 1.1
						})
					] })
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HUD, { onExit })]
	});
}
//#endregion
export { FaskaZero2 as default };
