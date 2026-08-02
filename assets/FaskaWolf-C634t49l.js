import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, t as Canvas, xt as RepeatWrapping, y as CanvasTexture } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { t as PointerLockControls } from "./PointerLockControls-LuZl7kld.js";
import { t as Stars } from "./Stars-7m8Mrcxr.js";
//#region src/components/games/engines/FaskaWolf/FaskaWolf.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function createTexture(type) {
	const canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 256;
	const ctx = canvas.getContext("2d");
	if (type === "wall") {
		ctx.fillStyle = "#6e4f3c";
		ctx.fillRect(0, 0, 256, 256);
		ctx.fillStyle = "#4f3627";
		for (let i = 0; i < 100; i++) ctx.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 20 + 10, Math.random() * 10 + 5);
	} else if (type === "floor") {
		ctx.fillStyle = "#2d3436";
		ctx.fillRect(0, 0, 256, 256);
		ctx.strokeStyle = "#1a1f22";
		ctx.lineWidth = 2;
		for (let i = 0; i < 256; i += 32) {
			ctx.beginPath();
			ctx.moveTo(i, 0);
			ctx.lineTo(i, 256);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(0, i);
			ctx.lineTo(256, i);
			ctx.stroke();
		}
	}
	const texture = new CanvasTexture(canvas);
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	if (type === "floor") texture.repeat.set(50, 50);
	return texture;
}
var wallTex = createTexture("wall");
var floorTex = createTexture("floor");
function Player({ onExit }) {
	const rigidBodyRef = (0, import_react.useRef)();
	const [movement, setMovement] = (0, import_react.useState)({
		forward: false,
		backward: false,
		left: false,
		right: false,
		jump: false
	});
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.code === "KeyW") setMovement((m) => ({
				...m,
				forward: true
			}));
			if (e.code === "KeyS") setMovement((m) => ({
				...m,
				backward: true
			}));
			if (e.code === "KeyA") setMovement((m) => ({
				...m,
				left: true
			}));
			if (e.code === "KeyD") setMovement((m) => ({
				...m,
				right: true
			}));
			if (e.code === "Space") setMovement((m) => ({
				...m,
				jump: true
			}));
		};
		const handleKeyUp = (e) => {
			if (e.code === "KeyW") setMovement((m) => ({
				...m,
				forward: false
			}));
			if (e.code === "KeyS") setMovement((m) => ({
				...m,
				backward: false
			}));
			if (e.code === "KeyA") setMovement((m) => ({
				...m,
				left: false
			}));
			if (e.code === "KeyD") setMovement((m) => ({
				...m,
				right: false
			}));
			if (e.code === "Space") setMovement((m) => ({
				...m,
				jump: false
			}));
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);
	useFrame((state) => {
		if (!rigidBodyRef.current) return;
		const velocity = rigidBodyRef.current.linvel();
		const camera = state.camera;
		const direction = new Vector3();
		const frontVector = new Vector3(0, 0, (movement.backward ? 1 : 0) - (movement.forward ? 1 : 0));
		const sideVector = new Vector3((movement.left ? 1 : 0) - (movement.right ? 1 : 0), 0, 0);
		direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(6).applyEuler(camera.rotation);
		rigidBodyRef.current.setLinvel({
			x: direction.x,
			y: velocity.y,
			z: direction.z
		});
		if (movement.jump && Math.abs(velocity.y) < .1) {
			rigidBodyRef.current.setLinvel({
				x: velocity.x,
				y: 6,
				z: velocity.z
			});
			setMovement((m) => ({
				...m,
				jump: false
			}));
		}
		const pos = rigidBodyRef.current.translation();
		camera.position.set(pos.x, pos.y + .8, pos.z);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: rigidBodyRef,
		colliders: "capsule",
		mass: 1,
		type: "dynamic",
		position: [
			0,
			2,
			0
		],
		enabledRotations: [
			false,
			false,
			false
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			visible: false,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
				.5,
				1,
				4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "red" })]
		})
	});
}
function Maze() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "fixed",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				0,
				0
			],
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [100, 100] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: floorTex })]
		})
	}), [
		{
			position: [
				0,
				2.5,
				-20
			],
			args: [
				40,
				5,
				1
			]
		},
		{
			position: [
				0,
				2.5,
				20
			],
			args: [
				40,
				5,
				1
			]
		},
		{
			position: [
				-20,
				2.5,
				0
			],
			args: [
				1,
				5,
				40
			]
		},
		{
			position: [
				20,
				2.5,
				0
			],
			args: [
				1,
				5,
				40
			]
		},
		{
			position: [
				5,
				2.5,
				-5
			],
			args: [
				8,
				5,
				8
			]
		},
		{
			position: [
				-10,
				2.5,
				10
			],
			args: [
				4,
				5,
				16
			]
		},
		{
			position: [
				10,
				2.5,
				10
			],
			args: [
				10,
				5,
				2
			]
		}
	].map((wall, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "fixed",
		position: wall.position,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: wall.args }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: wallTex })]
		})
	}, i))] });
}
function FaskaWolf({ onExit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100vw",
			height: "100vh",
			background: "black",
			position: "absolute",
			top: 0,
			left: 0,
			zIndex: 9999
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: 10,
				left: 10,
				zIndex: 10,
				color: "white",
				fontFamily: "monospace"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "FaskaWolf (FPS)" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Click inside to lock pointer. WASD to move, SPACE to jump." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Press ESC to unlock pointer, then click Exit to leave." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					style: {
						padding: "10px 20px",
						background: "#d32f2f",
						color: "#fff",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
						fontWeight: "bold"
					},
					children: "EXIT GAME"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
			shadows: true,
			camera: { fov: 75 },
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .4 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					castShadow: true,
					position: [
						20,
						40,
						20
					],
					intensity: 1.5,
					"shadow-mapSize": [2048, 2048]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
					gravity: [
						0,
						-15,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maze, {})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PointerLockControls, {})
			]
		})]
	});
}
//#endregion
export { FaskaWolf as default };
