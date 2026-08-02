import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, j as Euler, jt as TextureLoader, mt as Quaternion, t as Canvas, xt as RepeatWrapping } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Environment } from "./Environment-CqP6Yhdo.js";
import { t as OrthographicCamera } from "./OrthographicCamera-CIEeig0B.js";
//#region src/components/games/engines/FaskaRockRacing/FaskaRockRacing.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function createTextureUrl(type) {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;
	const ctx = canvas.getContext("2d");
	if (type === "rock") {
		ctx.fillStyle = "#4a4a4a";
		ctx.fillRect(0, 0, 512, 512);
		for (let i = 0; i < 3e4; i++) {
			ctx.fillStyle = Math.random() > .5 ? "#333" : "#666";
			ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 3);
		}
	} else if (type === "metal") {
		ctx.fillStyle = "#7f8c8d";
		ctx.fillRect(0, 0, 512, 512);
		for (let i = 0; i < 512; i += 16) {
			ctx.fillStyle = "#95a5a6";
			ctx.fillRect(0, i, 512, 2);
			ctx.fillRect(i, 0, 2, 512);
		}
	}
	return canvas.toDataURL();
}
function useKeys() {
	const [keys, setKeys] = (0, import_react.useState)({
		w: false,
		a: false,
		s: false,
		d: false,
		space: false
	});
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => setKeys((k) => ({
			...k,
			[e.key === " " ? "space" : e.key.toLowerCase()]: true
		}));
		const handleKeyUp = (e) => setKeys((k) => ({
			...k,
			[e.key === " " ? "space" : e.key.toLowerCase()]: false
		}));
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);
	return keys;
}
function CombatCar({ setProjectiles }) {
	const carRef = (0, import_react.useRef)();
	const keys = useKeys();
	const cameraRef = (0, import_react.useRef)();
	const [lastShot, setLastShot] = (0, import_react.useState)(0);
	useFrame((state, delta) => {
		if (!carRef.current) return;
		const body = carRef.current;
		const pos = body.translation();
		const rot = body.rotation();
		const euler = new Euler().setFromQuaternion(new Quaternion(rot.x, rot.y, rot.z, rot.w));
		const forward = new Vector3(0, 0, -1).applyEuler(euler);
		const rightVec = new Vector3(1, 0, 0).applyEuler(euler);
		const vel = body.linvel();
		const currentSpeed = new Vector3(vel.x, vel.y, vel.z).length();
		if (keys.w) body.applyImpulse({
			x: forward.x * 4,
			y: 0,
			z: forward.z * 4
		}, true);
		if (keys.s) body.applyImpulse({
			x: -forward.x * 2,
			y: 0,
			z: -forward.z * 2
		}, true);
		let turnSpeed = .08;
		if (currentSpeed > .5) {
			const dir = keys.w || !keys.w && !keys.s ? 1 : -1;
			if (keys.a) body.applyTorqueImpulse({
				x: 0,
				y: turnSpeed * dir * currentSpeed * .1,
				z: 0
			}, true);
			if (keys.d) body.applyTorqueImpulse({
				x: 0,
				y: -turnSpeed * dir * currentSpeed * .1,
				z: 0
			}, true);
		}
		const sideSpeed = rightVec.dot(new Vector3(vel.x, 0, vel.z));
		body.applyImpulse({
			x: -rightVec.x * sideSpeed * .2,
			y: 0,
			z: -rightVec.z * sideSpeed * .2
		}, true);
		body.applyImpulse({
			x: 0,
			y: -2,
			z: 0
		}, true);
		if (keys.space && state.clock.elapsedTime - lastShot > .3) {
			setLastShot(state.clock.elapsedTime);
			const spawnPos = new Vector3(pos.x, pos.y + .5, pos.z).add(forward.clone().multiplyScalar(3));
			setProjectiles((prev) => [...prev, {
				id: Date.now(),
				pos: spawnPos.toArray(),
				dir: forward.toArray()
			}]);
		}
		if (cameraRef.current) {
			const offset = new Vector3(20, 20, 20);
			const targetPos = new Vector3(pos.x, pos.y, pos.z).add(offset);
			cameraRef.current.position.lerp(targetPos, .1);
			cameraRef.current.lookAt(pos.x, pos.y, pos.z);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrthographicCamera, {
		ref: cameraRef,
		makeDefault: true,
		position: [
			20,
			20,
			20
		],
		zoom: 30,
		near: -100,
		far: 200
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: carRef,
		colliders: "cuboid",
		mass: 200,
		position: [
			0,
			2,
			0
		],
		linearDamping: 2,
		angularDamping: 4,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.8,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					2.5,
					1,
					4.5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#8e44ad",
					metalness: .6,
					roughness: .4
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					1.8,
					-.5
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.5,
					1,
					2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2c3e50" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					2.4,
					-.5
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.5,
					.6,
					.4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#34495e" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					2.4,
					-1.5
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.1,
					.1,
					2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#95a5a6",
					metalness: .8
				})]
			})
		] })
	})] });
}
function Projectile({ pos, dir }) {
	const ref = (0, import_react.useRef)();
	(0, import_react.useEffect)(() => {
		if (ref.current) ref.current.applyImpulse({
			x: dir[0] * 50,
			y: dir[1] * 50,
			z: dir[2] * 50
		}, true);
	}, [dir]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref,
		position: pos,
		colliders: "ball",
		mass: 10,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [.4] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#e74c3c",
			emissive: "#e74c3c",
			emissiveIntensity: 2
		})] })
	});
}
function Arena() {
	const rockUrl = (0, import_react.useMemo)(() => createTextureUrl("rock"), []);
	const metalUrl = (0, import_react.useMemo)(() => createTextureUrl("metal"), []);
	const rockTex = (0, import_react.useMemo)(() => {
		const tex = new TextureLoader().load(rockUrl);
		tex.wrapS = tex.wrapT = RepeatWrapping;
		tex.repeat.set(10, 10);
		return tex;
	}, [rockUrl]);
	const metalTex = (0, import_react.useMemo)(() => {
		const tex = new TextureLoader().load(metalUrl);
		tex.wrapS = tex.wrapT = RepeatWrapping;
		tex.repeat.set(5, 5);
		return tex;
	}, [metalUrl]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			friction: .5,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [100, 100] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: rockTex })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				0,
				2,
				-50
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				100,
				4,
				2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: metalTex })] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				0,
				2,
				50
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				100,
				4,
				2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: metalTex })] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				-50,
				2,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2,
				4,
				100
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: metalTex })] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				50,
				2,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2,
				4,
				100
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: metalTex })] })
		}),
		[...Array(20)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				Math.random() * 80 - 40,
				2,
				Math.random() * 80 - 40
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				4,
				4,
				4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#c0392b" })] })
		}, i)),
		[...Array(15)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			mass: 5,
			position: [
				Math.random() * 60 - 30,
				2,
				Math.random() * 60 - 30
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2,
				2,
				2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#f39c12",
				map: metalTex
			})] })
		}, `crate-${i}`))
	] });
}
function FaskaRockRacing({ onExit }) {
	const [projectiles, setProjectiles] = (0, import_react.useState)([]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100vw",
			height: "100vh",
			position: "relative",
			background: "#111"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
			shadows: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					castShadow: true,
					position: [
						20,
						50,
						20
					],
					intensity: 2,
					"shadow-camera-near": .1,
					"shadow-camera-far": 100,
					"shadow-camera-left": -50,
					"shadow-camera-right": 50,
					"shadow-camera-top": 50,
					"shadow-camera-bottom": -50
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Environment, { preset: "night" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CombatCar, { setProjectiles }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arena, {}),
					projectiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Projectile, {
						pos: p.pos,
						dir: p.dir
					}, p.id))
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: 20,
				left: 20,
				color: "#e74c3c",
				fontFamily: "monospace",
				textShadow: "2px 2px 0px #000"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					style: {
						fontSize: "2em",
						margin: "0 0 10px 0"
					},
					children: "Faska Rock Racing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: { fontSize: "1.2em" },
					children: "W/A/S/D to Drive. SPACE to Shoot."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					style: {
						padding: "10px 20px",
						fontSize: "16px",
						cursor: "pointer",
						background: "#c0392b",
						color: "white",
						border: "none",
						fontWeight: "bold"
					},
					children: "Exit Arena"
				})
			]
		})]
	});
}
//#endregion
export { FaskaRockRacing as default };
