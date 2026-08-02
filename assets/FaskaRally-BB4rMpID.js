import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, j as Euler, jt as TextureLoader, mt as Quaternion, s as useThree, t as Canvas, xt as RepeatWrapping } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Environment } from "./Environment-CqP6Yhdo.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
//#region src/components/games/engines/FaskaRally/FaskaRally.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function createTextureUrl(type) {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;
	const ctx = canvas.getContext("2d");
	if (type === "dirt") {
		ctx.fillStyle = "#6b4d2e";
		ctx.fillRect(0, 0, 512, 512);
		for (let i = 0; i < 2e4; i++) {
			ctx.fillStyle = Math.random() > .5 ? "#573d23" : "#805f3b";
			ctx.fillRect(Math.random() * 512, Math.random() * 512, 4, 4);
		}
	} else if (type === "grass") {
		ctx.fillStyle = "#2b7539";
		ctx.fillRect(0, 0, 512, 512);
		for (let i = 0; i < 2e4; i++) {
			ctx.fillStyle = Math.random() > .5 ? "#1f5e2b" : "#39944a";
			ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 3);
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
function RallyCar() {
	const carRef = (0, import_react.useRef)();
	const keys = useKeys();
	const { camera } = useThree();
	const [smoothedCamPos] = (0, import_react.useState)(() => new Vector3(0, 5, 10));
	const [smoothedCamTarget] = (0, import_react.useState)(() => new Vector3(0, 0, 0));
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
			x: forward.x * 3,
			y: 0,
			z: forward.z * 3
		}, true);
		if (keys.s) body.applyImpulse({
			x: -forward.x * 2,
			y: 0,
			z: -forward.z * 2
		}, true);
		let turnSpeed = .05;
		if (currentSpeed > 1) {
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
		let grip = .08;
		if (keys.space) grip = .01;
		body.applyImpulse({
			x: -rightVec.x * sideSpeed * grip,
			y: 0,
			z: -rightVec.z * sideSpeed * grip
		}, true);
		body.applyImpulse({
			x: 0,
			y: -1,
			z: 0
		}, true);
		const idealOffset = new Vector3(0, 5, 14).applyEuler(euler);
		const idealLookAt = new Vector3(0, 0, -10).applyEuler(euler).add(pos);
		const targetPos = new Vector3(pos.x, pos.y, pos.z).add(idealOffset);
		smoothedCamPos.lerp(targetPos, .1);
		smoothedCamTarget.lerp(idealLookAt, .1);
		camera.position.copy(smoothedCamPos);
		camera.lookAt(smoothedCamTarget);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: carRef,
		colliders: "cuboid",
		mass: 120,
		position: [
			0,
			5,
			0
		],
		linearDamping: 1,
		angularDamping: 3,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.6,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					2.2,
					.9,
					4.2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#2980b9",
					roughness: .4
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					1.4,
					-.1
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.6,
					.7,
					2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#ecf0f1",
					roughness: .1,
					metalness: .5
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					1.2,
					1.8
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					2.2,
					.1,
					.5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e74c3c" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.9,
					.9,
					1.8
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.1,
					.6,
					.4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e74c3c" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.9,
					.9,
					1.8
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.1,
					.6,
					.4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e74c3c" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.6,
					.7,
					-2.11
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.2,
					.2,
					.1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#f1c40f",
					emissive: "#f1c40f",
					emissiveIntensity: 3
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.6,
					.7,
					-2.11
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.2,
					.2,
					.1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#f1c40f",
					emissive: "#f1c40f",
					emissiveIntensity: 3
				})]
			})
		] })
	});
}
function RallyTrack() {
	const dirtUrl = (0, import_react.useMemo)(() => createTextureUrl("dirt"), []);
	const grassUrl = (0, import_react.useMemo)(() => createTextureUrl("grass"), []);
	const dirtTex = (0, import_react.useMemo)(() => {
		const tex = new TextureLoader().load(dirtUrl);
		tex.wrapS = tex.wrapT = RepeatWrapping;
		tex.repeat.set(20, 200);
		return tex;
	}, [dirtUrl]);
	const grassTex = (0, import_react.useMemo)(() => {
		const tex = new TextureLoader().load(grassUrl);
		tex.wrapS = tex.wrapT = RepeatWrapping;
		tex.repeat.set(100, 100);
		return tex;
	}, [grassUrl]);
	const segments = [];
	let zOffset = 0;
	for (let i = 0; i < 50; i++) {
		const length = 40;
		const isRamp = i % 10 === 5;
		const isDip = i % 10 === 8;
		let yPos = 0;
		let rotX = 0;
		if (isRamp) {
			yPos = 2;
			rotX = -Math.PI / 16;
		} else if (isDip) {
			yPos = -1;
			rotX = Math.PI / 16;
		}
		segments.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				0,
				yPos,
				-zOffset - length / 2
			],
			rotation: [
				rotX,
				0,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				40,
				2,
				length
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: dirtTex })] })
		}, `seg-${i}`));
		segments.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				-20,
				yPos + 2,
				-zOffset - length / 2
			],
			rotation: [
				rotX,
				0,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2,
				4,
				length
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#d35400" })] })
		}, `bar-l-${i}`));
		segments.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				20,
				yPos + 2,
				-zOffset - length / 2
			],
			rotation: [
				rotX,
				0,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2,
				4,
				length
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#d35400" })] })
		}, `bar-r-${i}`));
		zOffset += length;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "fixed",
		position: [
			0,
			-2,
			0
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1e3, 2e3] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: grassTex })]
		})
	}), segments] });
}
function FaskaRally({ onExit }) {
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
					5,
					10
				],
				fov: 60
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, {
					sunPosition: [
						100,
						10,
						10
					],
					turbidity: 10,
					rayleigh: 2,
					mieCoefficient: .005,
					mieDirectionalG: .8
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .4 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					castShadow: true,
					position: [
						50,
						50,
						50
					],
					intensity: 1.5
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Environment, { preset: "park" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RallyCar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RallyTrack, {})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: 20,
				left: 20,
				color: "white",
				fontFamily: "sans-serif",
				textShadow: "2px 2px 4px #000"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					style: { color: "#f1c40f" },
					children: "Faska Rally"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "W/A/S/D to Drive. Watch out for jumps!" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					style: {
						padding: "10px 20px",
						fontSize: "16px",
						cursor: "pointer",
						background: "rgba(0,0,0,0.7)",
						color: "#f1c40f",
						border: "2px solid #f1c40f",
						fontWeight: "bold"
					},
					children: "Exit Game"
				})
			]
		})]
	});
}
//#endregion
export { FaskaRally as default };
