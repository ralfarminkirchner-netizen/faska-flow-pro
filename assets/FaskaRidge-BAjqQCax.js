import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, j as Euler, jt as TextureLoader, mt as Quaternion, s as useThree, t as Canvas, xt as RepeatWrapping } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Environment } from "./Environment-CqP6Yhdo.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { t as Stars } from "./Stars-7m8Mrcxr.js";
//#region src/components/games/engines/FaskaRidge/FaskaRidge.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function createTextureUrl(type) {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;
	const ctx = canvas.getContext("2d");
	if (type === "asphalt") {
		ctx.fillStyle = "#222";
		ctx.fillRect(0, 0, 512, 512);
		for (let i = 0; i < 2e4; i++) {
			ctx.fillStyle = Math.random() > .5 ? "#111" : "#333";
			ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
		}
	} else if (type === "checker") for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
		ctx.fillStyle = (x + y) % 2 === 0 ? "#ff0000" : "#ffffff";
		ctx.fillRect(x * 32, y * 32, 32, 32);
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
function Car() {
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
			x: forward.x * 2.5,
			y: 0,
			z: forward.z * 2.5
		}, true);
		if (keys.s) body.applyImpulse({
			x: -forward.x * 1.5,
			y: 0,
			z: -forward.z * 1.5
		}, true);
		let turnSpeed = .04;
		if (keys.space) turnSpeed = .08;
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
		let grip = .2;
		if (keys.space) grip = .02;
		body.applyImpulse({
			x: -rightVec.x * sideSpeed * grip,
			y: 0,
			z: -rightVec.z * sideSpeed * grip
		}, true);
		body.applyImpulse({
			x: 0,
			y: -.5,
			z: 0
		}, true);
		const idealOffset = new Vector3(0, 4, 12).applyEuler(euler);
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
		mass: 100,
		position: [
			0,
			1,
			0
		],
		linearDamping: 1,
		angularDamping: 2,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.5,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					2,
					.8,
					4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#e74c3c",
					roughness: .1,
					metalness: .8
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					1.2,
					-.2
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.6,
					.6,
					2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#2c3e50",
					roughness: .1,
					metalness: 1
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.7,
					.6,
					-2.01
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.4,
					.2,
					.1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#f1c40f",
					emissive: "#f1c40f",
					emissiveIntensity: 2
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.7,
					.6,
					-2.01
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.4,
					.2,
					.1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#f1c40f",
					emissive: "#f1c40f",
					emissiveIntensity: 2
				})]
			})
		] })
	});
}
function Track() {
	const asphaltUrl = (0, import_react.useMemo)(() => createTextureUrl("asphalt"), []);
	(0, import_react.useMemo)(() => createTextureUrl("checker"), []);
	const asphaltTex = (0, import_react.useMemo)(() => {
		const tex = new TextureLoader().load(asphaltUrl);
		tex.wrapS = tex.wrapT = RepeatWrapping;
		tex.repeat.set(50, 50);
		return tex;
	}, [asphaltUrl]);
	const walls = [];
	const radius = 100;
	for (let i = 0; i < 72; i++) {
		const angle = i / 72 * Math.PI * 2;
		walls.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				Math.cos(angle) * (radius + 15),
				2,
				Math.sin(angle) * (radius + 15)
			],
			rotation: [
				0,
				-angle,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				10,
				4,
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: i % 2 === 0 ? "red" : "white" })] })
		}, `out-${i}`));
		walls.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				Math.cos(angle) * (radius - 15),
				2,
				Math.sin(angle) * (radius - 15)
			],
			rotation: [
				0,
				-angle,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				10,
				4,
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: i % 2 === 0 ? "red" : "white" })] })
		}, `in-${i}`));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "fixed",
		friction: .5,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [400, 400] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: asphaltTex })]
		})
	}), walls] });
}
function FaskaRidge({ onExit }) {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, { sunPosition: [
					100,
					20,
					100
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
					radius: 100,
					depth: 50,
					count: 5e3,
					factor: 4,
					saturation: 0,
					fade: true,
					speed: 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					castShadow: true,
					position: [
						50,
						50,
						50
					],
					intensity: 1.5
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Environment, { preset: "city" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Track, {})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: 20,
				left: 20,
				color: "white",
				fontFamily: "sans-serif"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Faska Ridge" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "W/A/S/D to Drive. SPACE to Drift!" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					style: {
						padding: "10px 20px",
						fontSize: "16px",
						cursor: "pointer",
						background: "rgba(0,0,0,0.5)",
						color: "white",
						border: "1px solid white"
					},
					children: "Exit Game"
				})
			]
		})]
	});
}
//#endregion
export { FaskaRidge as default };
