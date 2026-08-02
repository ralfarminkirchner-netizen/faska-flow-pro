import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, s as useThree, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { n as Cylinder, t as Box } from "./shapes-BBrczoYY.js";
//#region src/components/games/engines/FaskaRaider/FaskaRaider.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function useKeys() {
	const [keys, setKeys] = (0, import_react.useState)({
		forward: false,
		backward: false,
		left: false,
		right: false,
		jump: false
	});
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			switch (e.code) {
				case "KeyW":
				case "ArrowUp":
					setKeys((k) => ({
						...k,
						forward: true
					}));
					break;
				case "KeyS":
				case "ArrowDown":
					setKeys((k) => ({
						...k,
						backward: true
					}));
					break;
				case "KeyA":
				case "ArrowLeft":
					setKeys((k) => ({
						...k,
						left: true
					}));
					break;
				case "KeyD":
				case "ArrowRight":
					setKeys((k) => ({
						...k,
						right: true
					}));
					break;
				case "Space":
					setKeys((k) => ({
						...k,
						jump: true
					}));
					break;
				default: break;
			}
		};
		const handleKeyUp = (e) => {
			switch (e.code) {
				case "KeyW":
				case "ArrowUp":
					setKeys((k) => ({
						...k,
						forward: false
					}));
					break;
				case "KeyS":
				case "ArrowDown":
					setKeys((k) => ({
						...k,
						backward: false
					}));
					break;
				case "KeyA":
				case "ArrowLeft":
					setKeys((k) => ({
						...k,
						left: false
					}));
					break;
				case "KeyD":
				case "ArrowRight":
					setKeys((k) => ({
						...k,
						right: false
					}));
					break;
				case "Space":
					setKeys((k) => ({
						...k,
						jump: false
					}));
					break;
				default: break;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);
	return keys;
}
var Player = () => {
	const playerRef = (0, import_react.useRef)();
	const keys = useKeys();
	const { camera } = useThree();
	const moveSpeed = 6;
	const jumpForce = 8;
	const direction = new Vector3();
	const frontVector = new Vector3();
	const sideVector = new Vector3();
	useFrame(() => {
		if (!playerRef.current) return;
		const { forward, backward, left, right, jump } = keys;
		const translation = playerRef.current.translation();
		camera.position.lerp(new Vector3(translation.x, translation.y + 4, translation.z + 8), .1);
		camera.lookAt(translation.x, translation.y, translation.z);
		frontVector.set(0, 0, Number(backward) - Number(forward));
		sideVector.set(Number(left) - Number(right), 0, 0);
		direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(moveSpeed);
		const linvel = playerRef.current.linvel();
		playerRef.current.setLinvel({
			x: direction.x,
			y: linvel.y,
			z: direction.z
		}, true);
		if (jump && Math.abs(linvel.y) < .1) playerRef.current.setLinvel({
			x: linvel.x,
			y: jumpForce,
			z: linvel.z
		}, true);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: playerRef,
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
		colliders: "hull",
		mass: 1,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cylinder, {
			args: [
				.5,
				.5,
				2,
				16
			],
			castShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8B4513" })
		})
	});
};
var Scene = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, { sunPosition: [
			100,
			20,
			100
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .4 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			castShadow: true,
			position: [
				10,
				15,
				10
			],
			intensity: 1.2,
			"shadow-mapSize": [2048, 2048]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
				args: [
					100,
					1,
					100
				],
				position: [
					0,
					-.5,
					0
				],
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#2E8B57",
					roughness: .8
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			position: [
				0,
				2,
				-10
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
				args: [
					10,
					4,
					2
				],
				castShadow: true,
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#A9A9A9",
					roughness: .9
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			position: [
				5,
				1,
				-5
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
				args: [
					2,
					2,
					2
				],
				castShadow: true,
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#A9A9A9",
					roughness: .9
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			position: [
				-6,
				3,
				-15
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
				args: [
					4,
					6,
					4
				],
				castShadow: true,
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#A9A9A9",
					roughness: .9
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			position: [
				-6,
				5,
				-25
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
				args: [
					4,
					1,
					4
				],
				castShadow: true,
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#808080",
					roughness: .8
				})
			})
		})
	] });
};
function FaskaRaider({ onExit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100vw",
			height: "100vh",
			position: "relative",
			overflow: "hidden",
			backgroundColor: "#87CEEB"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
			shadows: true,
			camera: {
				position: [
					0,
					5,
					10
				],
				fov: 60
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
				gravity: [
					0,
					-20,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: 20,
				left: 20,
				zIndex: 10,
				fontFamily: "sans-serif"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					style: {
						color: "white",
						textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
						margin: 0
					},
					children: "Faska Raider"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						color: "white",
						textShadow: "1px 1px 2px rgba(0,0,0,0.8)"
					},
					children: "Explore the ruins. WASD to move, SPACE to jump."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					style: {
						padding: "10px 20px",
						backgroundColor: "rgba(0,0,0,0.6)",
						color: "white",
						border: "2px solid white",
						borderRadius: "5px",
						cursor: "pointer",
						fontWeight: "bold",
						marginTop: "10px",
						transition: "background-color 0.2s"
					},
					onMouseOver: (e) => e.target.style.backgroundColor = "rgba(0,0,0,0.8)",
					onMouseOut: (e) => e.target.style.backgroundColor = "rgba(0,0,0,0.6)",
					children: "Return to Menu"
				})
			]
		})]
	});
}
//#endregion
export { FaskaRaider as default };
