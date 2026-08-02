import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, j as Euler, jt as TextureLoader, mt as Quaternion, s as useThree, t as Canvas, xt as RepeatWrapping } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Environment } from "./Environment-CqP6Yhdo.js";
//#region src/components/games/engines/FaskaRC/FaskaRC.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function createTextureUrl(type) {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;
	const ctx = canvas.getContext("2d");
	if (type === "carpet") {
		ctx.fillStyle = "#1e3799";
		ctx.fillRect(0, 0, 512, 512);
		for (let i = 0; i < 5e4; i++) {
			ctx.fillStyle = Math.random() > .5 ? "#0c2461" : "#4a69bd";
			ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
		}
	} else if (type === "wood") {
		ctx.fillStyle = "#d1ccc0";
		ctx.fillRect(0, 0, 512, 512);
		for (let i = 0; i < 512; i++) {
			ctx.fillStyle = `rgba(132, 129, 122, ${Math.random() * .2})`;
			ctx.fillRect(0, i, 512, 1);
		}
	}
	return canvas.toDataURL();
}
function useKeys() {
	const [keys, setKeys] = (0, import_react.useState)({
		w: false,
		a: false,
		s: false,
		d: false
	});
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => setKeys((k) => ({
			...k,
			[e.key.toLowerCase()]: true
		}));
		const handleKeyUp = (e) => setKeys((k) => ({
			...k,
			[e.key.toLowerCase()]: false
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
function RCCar() {
	const carRef = (0, import_react.useRef)();
	const keys = useKeys();
	const { camera } = useThree();
	const [smoothedCamPos] = (0, import_react.useState)(() => new Vector3(0, 30, 0));
	useFrame((state, delta) => {
		if (!carRef.current) return;
		const body = carRef.current;
		const pos = body.translation();
		const rot = body.rotation();
		const euler = new Euler().setFromQuaternion(new Quaternion(rot.x, rot.y, rot.z, rot.w));
		const forward = new Vector3(0, 0, -1).applyEuler(euler);
		const rightVec = new Vector3(1, 0, 0).applyEuler(euler);
		const vel = body.linvel();
		const currentSpeed = new Vector3(vel.x, 0, vel.z).length();
		if (keys.w) body.applyImpulse({
			x: forward.x * .4,
			y: 0,
			z: forward.z * .4
		}, true);
		if (keys.s) body.applyImpulse({
			x: -forward.x * .2,
			y: 0,
			z: -forward.z * .2
		}, true);
		if (currentSpeed > .1) {
			const dir = keys.w || !keys.w && !keys.s ? 1 : -1;
			let turnSpeed = .015;
			if (keys.a) body.applyTorqueImpulse({
				x: 0,
				y: turnSpeed * dir,
				z: 0
			}, true);
			if (keys.d) body.applyTorqueImpulse({
				x: 0,
				y: -turnSpeed * dir,
				z: 0
			}, true);
		}
		const sideSpeed = rightVec.dot(new Vector3(vel.x, 0, vel.z));
		body.applyImpulse({
			x: -rightVec.x * sideSpeed * .5,
			y: 0,
			z: -rightVec.z * sideSpeed * .5
		}, true);
		const targetPos = new Vector3(pos.x, 30, pos.z + 5);
		smoothedCamPos.lerp(targetPos, .1);
		camera.position.copy(smoothedCamPos);
		camera.lookAt(pos.x, 0, pos.z);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: carRef,
		colliders: "cuboid",
		mass: 10,
		position: [
			0,
			.5,
			0
		],
		linearDamping: 3,
		angularDamping: 6,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.2,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.8,
					.3,
					1.6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#27ae60",
					roughness: .2,
					metalness: .8
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.3,
					.8,
					.6
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.02,
					.02,
					1.2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#333" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.3,
					1.4,
					.6
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [.06] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "red" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.45,
					.1,
					-.5
				],
				rotation: [
					0,
					0,
					Math.PI / 2
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.2,
					.2,
					.15
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.45,
					.1,
					-.5
				],
				rotation: [
					0,
					0,
					Math.PI / 2
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.2,
					.2,
					.15
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.45,
					.1,
					.5
				],
				rotation: [
					0,
					0,
					Math.PI / 2
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.2,
					.2,
					.15
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.45,
					.1,
					.5
				],
				rotation: [
					0,
					0,
					Math.PI / 2
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.2,
					.2,
					.15
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
			})
		] })
	});
}
function Playroom() {
	const carpetUrl = (0, import_react.useMemo)(() => createTextureUrl("carpet"), []);
	const woodUrl = (0, import_react.useMemo)(() => createTextureUrl("wood"), []);
	const carpetTex = (0, import_react.useMemo)(() => {
		const tex = new TextureLoader().load(carpetUrl);
		tex.wrapS = tex.wrapT = RepeatWrapping;
		tex.repeat.set(20, 20);
		return tex;
	}, [carpetUrl]);
	const woodTex = (0, import_react.useMemo)(() => {
		const tex = new TextureLoader().load(woodUrl);
		tex.wrapS = tex.wrapT = RepeatWrapping;
		tex.repeat.set(2, 2);
		return tex;
	}, [woodUrl]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			friction: .8,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [100, 100] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: carpetTex })]
			})
		}),
		[...Array(30)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				Math.random() * 80 - 40,
				1,
				Math.random() * 80 - 40
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2,
				2,
				2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				map: woodTex,
				color: "#f5cd79"
			})] })
		}, i)),
		[...Array(5)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				Math.random() * 60 - 30,
				.5,
				Math.random() * 60 - 30
			],
			rotation: [
				Math.PI / 12,
				Math.random() * Math.PI,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				6,
				.5,
				4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: [
				"#e15f41",
				"#3dc1d3",
				"#f3a683"
			][i % 3] })] })
		}, `ramp-${i}`)),
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
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#fff" })] })
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
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#fff" })] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				-50,
				2,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1,
				4,
				100
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#fff" })] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				50,
				2,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1,
				4,
				100
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#fff" })] })
		})
	] });
}
function FaskaRC({ onExit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100vw",
			height: "100vh",
			position: "relative"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
			shadows: true,
			camera: {
				position: [
					0,
					30,
					10
				],
				fov: 40
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .6 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					castShadow: true,
					position: [
						10,
						30,
						10
					],
					intensity: 1.5,
					"shadow-camera-near": .1,
					"shadow-camera-far": 100,
					"shadow-camera-left": -20,
					"shadow-camera-right": 20,
					"shadow-camera-top": 20,
					"shadow-camera-bottom": -20
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Environment, { preset: "apartment" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RCCar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Playroom, {})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: 20,
				left: 20,
				color: "white",
				fontFamily: "sans-serif",
				background: "rgba(0,0,0,0.5)",
				padding: "20px",
				borderRadius: "10px"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					style: {
						margin: 0,
						color: "#27ae60"
					},
					children: "Faska RC"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "W/A/S/D to Drive the micro car!" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					style: {
						padding: "10px 20px",
						fontSize: "16px",
						cursor: "pointer",
						background: "#27ae60",
						color: "white",
						border: "none",
						borderRadius: "5px"
					},
					children: "Put Controller Down"
				})
			]
		})]
	});
}
//#endregion
export { FaskaRC as default };
