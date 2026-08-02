import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { $ as MathUtils, Rt as Vector3, a as useFrame, s as useThree, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { n as Cylinder, r as Sphere, t as Box } from "./shapes-BBrczoYY.js";
//#region node_modules/@react-three/drei/core/Float.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var Float = /* @__PURE__ */ import_react.forwardRef(({ children, enabled = true, speed = 1, rotationIntensity = 1, floatIntensity = 1, floatingRange = [-.1, .1], autoInvalidate = false, ...props }, forwardRef) => {
	const ref = import_react.useRef(null);
	import_react.useImperativeHandle(forwardRef, () => ref.current, []);
	const offset = import_react.useRef(Math.random() * 1e4);
	useFrame((state) => {
		var _floatingRange$, _floatingRange$2;
		if (!enabled || speed === 0) return;
		if (autoInvalidate) state.invalidate();
		const t = offset.current + state.clock.elapsedTime;
		ref.current.rotation.x = Math.cos(t / 4 * speed) / 8 * rotationIntensity;
		ref.current.rotation.y = Math.sin(t / 4 * speed) / 8 * rotationIntensity;
		ref.current.rotation.z = Math.sin(t / 4 * speed) / 20 * rotationIntensity;
		let yPosition = Math.sin(t / 4 * speed) / 10;
		yPosition = MathUtils.mapLinear(yPosition, -.1, .1, (_floatingRange$ = floatingRange == null ? void 0 : floatingRange[0]) !== null && _floatingRange$ !== void 0 ? _floatingRange$ : -.1, (_floatingRange$2 = floatingRange == null ? void 0 : floatingRange[1]) !== null && _floatingRange$2 !== void 0 ? _floatingRange$2 : .1);
		ref.current.position.y = yPosition * floatIntensity;
		ref.current.updateMatrix();
	});
	return /* @__PURE__ */ import_react.createElement("group", props, /* @__PURE__ */ import_react.createElement("group", {
		ref,
		matrixAutoUpdate: false
	}, children));
});
//#endregion
//#region src/components/games/engines/FaskaKazooie/FaskaKazooie.jsx
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
var Collectible = ({ position, onCollect }) => {
	const [collected, setCollected] = (0, import_react.useState)(false);
	if (collected) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "fixed",
		colliders: "ball",
		position,
		sensor: true,
		onIntersectionEnter: () => {
			setCollected(true);
			onCollect();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Float, {
			speed: 3,
			rotationIntensity: 2,
			floatIntensity: 1,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sphere, {
				args: [
					.5,
					16,
					16
				],
				castShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#FFD700",
					emissive: "#FF8C00",
					emissiveIntensity: .5,
					roughness: .1,
					metalness: .9
				})
			})
		})
	});
};
var Player = () => {
	const playerRef = (0, import_react.useRef)();
	const keys = useKeys();
	const { camera } = useThree();
	const moveSpeed = 8;
	const jumpForce = 14;
	const direction = new Vector3();
	const frontVector = new Vector3();
	const sideVector = new Vector3();
	useFrame(() => {
		if (!playerRef.current) return;
		const { forward, backward, left, right, jump } = keys;
		const translation = playerRef.current.translation();
		camera.position.lerp(new Vector3(translation.x, translation.y + 5, translation.z + 10), .1);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		ref: playerRef,
		position: [
			0,
			3,
			0
		],
		enabledRotations: [
			false,
			false,
			false
		],
		colliders: "ball",
		mass: 1,
		friction: 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sphere, {
			args: [
				.8,
				32,
				32
			],
			castShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#FF8C00",
				roughness: .4
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sphere, {
			args: [
				.4,
				16,
				16
			],
			position: [
				0,
				.6,
				-.6
			],
			castShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#DC143C",
				roughness: .4
			})
		})]
	});
};
var Scene = ({ onCollect }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, {
			sunPosition: [
				100,
				20,
				100
			],
			turbidity: .1,
			rayleigh: .5
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .6 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			castShadow: true,
			position: [
				20,
				30,
				10
			],
			intensity: 1.5,
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
					color: "#7CFC00",
					roughness: 1
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			position: [
				5,
				1,
				-10
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cylinder, {
				args: [
					3,
					3,
					2,
					16
				],
				castShadow: true,
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8B4513" })
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			position: [
				12,
				3,
				-15
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cylinder, {
				args: [
					3,
					3,
					2,
					16
				],
				castShadow: true,
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8B4513" })
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			position: [
				0,
				5,
				-25
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
				args: [
					8,
					1,
					8
				],
				castShadow: true,
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#D2B48C" })
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collectible, {
			position: [
				5,
				3,
				-10
			],
			onCollect
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collectible, {
			position: [
				12,
				5,
				-15
			],
			onCollect
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collectible, {
			position: [
				0,
				7,
				-25
			],
			onCollect
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collectible, {
			position: [
				-10,
				1,
				-5
			],
			onCollect
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collectible, {
			position: [
				-15,
				1,
				-15
			],
			onCollect
		})
	] });
};
function FaskaKazooie({ onExit }) {
	const [score, setScore] = (0, import_react.useState)(0);
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
					6,
					12
				],
				fov: 60
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
				gravity: [
					0,
					-30,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, { onCollect: () => setScore((s) => s + 1) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: 20,
				left: 20,
				zIndex: 10,
				fontFamily: "Comic Sans MS, sans-serif"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					style: {
						color: "#FFD700",
						textShadow: "2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000",
						margin: 0,
						fontSize: "3rem"
					},
					children: "Faska Kazooie"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					style: {
						color: "white",
						textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
					},
					children: [
						"Jiggies: ",
						score,
						" / 5"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						color: "white",
						textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
						fontSize: "1.2rem"
					},
					children: "WASD to move, SPACE to jump!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					style: {
						padding: "10px 20px",
						backgroundColor: "#FF4500",
						color: "white",
						border: "3px solid white",
						borderRadius: "15px",
						cursor: "pointer",
						fontWeight: "bold",
						fontSize: "1.1rem",
						marginTop: "10px",
						boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
						transition: "transform 0.1s"
					},
					onMouseDown: (e) => e.target.style.transform = "scale(0.95)",
					onMouseUp: (e) => e.target.style.transform = "scale(1)",
					children: "Exit World"
				})
			]
		})]
	});
}
//#endregion
export { FaskaKazooie as default };
