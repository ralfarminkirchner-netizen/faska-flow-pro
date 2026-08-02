import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { $ as MathUtils, Rt as Vector3, a as useFrame, t as Canvas, xt as RepeatWrapping } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { t as Text } from "./Text-CuphjnHx.js";
import { t as useTexture } from "./Texture-BOsfVZMl.js";
//#region src/components/games/engines/FaskaMario64/FaskaMario64.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var useKeys = () => {
	const keys = (0, import_react.useRef)({
		forward: false,
		backward: false,
		left: false,
		right: false,
		jump: false
	});
	(0, import_react.useEffect)(() => {
		const down = (e) => {
			if (e.code === "KeyW" || e.code === "ArrowUp") keys.current.forward = true;
			if (e.code === "KeyS" || e.code === "ArrowDown") keys.current.backward = true;
			if (e.code === "KeyA" || e.code === "ArrowLeft") keys.current.left = true;
			if (e.code === "KeyD" || e.code === "ArrowRight") keys.current.right = true;
			if (e.code === "Space") keys.current.jump = true;
		};
		const up = (e) => {
			if (e.code === "KeyW" || e.code === "ArrowUp") keys.current.forward = false;
			if (e.code === "KeyS" || e.code === "ArrowDown") keys.current.backward = false;
			if (e.code === "KeyA" || e.code === "ArrowLeft") keys.current.left = false;
			if (e.code === "KeyD" || e.code === "ArrowRight") keys.current.right = false;
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
function Player({ keys }) {
	const rigidBody = (0, import_react.useRef)();
	const meshGroup = (0, import_react.useRef)();
	const jumpPressed = (0, import_react.useRef)(false);
	const [shakeIntensity, setShakeIntensity] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const handleShake = () => setShakeIntensity(.8);
		window.addEventListener("faska-shake", handleShake);
		return () => window.removeEventListener("faska-shake", handleShake);
	}, []);
	useFrame((state, delta) => {
		if (!rigidBody.current) return;
		const { forward, backward, left, right, jump } = keys.current;
		const velocity = rigidBody.current.linvel();
		const position = rigidBody.current.translation();
		const moveSpeed = 10;
		const direction = new Vector3();
		const frontVector = new Vector3(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
		const sideVector = new Vector3((left ? 1 : 0) - (right ? 1 : 0), 0, 0);
		direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(moveSpeed);
		rigidBody.current.setLinvel({
			x: -direction.x,
			y: velocity.y,
			z: -direction.z
		}, true);
		if (meshGroup.current) if (direction.lengthSq() > .1) {
			const targetAngle = Math.atan2(-direction.x, -direction.z);
			let currentAngle = meshGroup.current.rotation.y;
			while (targetAngle - currentAngle > Math.PI) currentAngle += Math.PI * 2;
			while (targetAngle - currentAngle < -Math.PI) currentAngle -= Math.PI * 2;
			meshGroup.current.rotation.y = MathUtils.lerp(currentAngle, targetAngle, 10 * delta);
			meshGroup.current.rotation.x = MathUtils.lerp(meshGroup.current.rotation.x, .2, 5 * delta);
		} else meshGroup.current.rotation.x = MathUtils.lerp(meshGroup.current.rotation.x, 0, 5 * delta);
		const isGrounded = Math.abs(velocity.y) < .1;
		if (jump && isGrounded && !jumpPressed.current) {
			rigidBody.current.setLinvel({
				x: velocity.x,
				y: 18,
				z: velocity.z
			}, true);
			jumpPressed.current = true;
		}
		if (!jump && isGrounded) jumpPressed.current = false;
		const targetCameraPos = new Vector3(position.x, position.y + 6, position.z + 16);
		if (shakeIntensity > 0) {
			targetCameraPos.x += (Math.random() - .5) * shakeIntensity;
			targetCameraPos.y += (Math.random() - .5) * shakeIntensity;
			targetCameraPos.z += (Math.random() - .5) * shakeIntensity;
			setShakeIntensity((prev) => Math.max(0, prev - delta * 3));
		}
		state.camera.position.lerp(targetCameraPos, 5 * delta);
		state.camera.lookAt(position.x, position.y + 2, position.z);
		if (position.y < -20) {
			rigidBody.current.setTranslation({
				x: 0,
				y: 10,
				z: 0
			}, true);
			rigidBody.current.setLinvel({
				x: 0,
				y: 0,
				z: 0
			}, true);
			window.dispatchEvent(new Event("faska-shake"));
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: rigidBody,
		colliders: "capsule",
		mass: 1,
		type: "dynamic",
		position: [
			0,
			10,
			0
		],
		enabledRotations: [
			false,
			false,
			false
		],
		name: "player",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: meshGroup,
			position: [
				0,
				-.5,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.8,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.6,
						16,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ff0000" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						1.6,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.5,
						16,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ffccaa" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						2,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.5,
						.5,
						.2,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ff0000" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						1.9,
						.3
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.6,
						.1,
						.4
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ff0000" })]
				})
			]
		})
	});
}
function Level() {
	const [grassTex, wallTex] = useTexture(["/faska-flow-pro/textures/grass_platform.png", "/faska-flow-pro/textures/castle_wall.png"]);
	grassTex.wrapS = grassTex.wrapT = RepeatWrapping;
	grassTex.repeat.set(4, 4);
	wallTex.wrapS = wallTex.wrapT = RepeatWrapping;
	wallTex.repeat.set(2, 2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				0,
				-.5,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					40,
					1,
					40
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					map: grassTex,
					color: "#4ade80"
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				0,
				2,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				receiveShadow: true,
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					5,
					6,
					4,
					32
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: wallTex })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				-12,
				5,
				-8
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				receiveShadow: true,
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					6,
					1,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					map: grassTex,
					color: "#fb923c"
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				0,
				8,
				-16
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				receiveShadow: true,
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					6,
					1,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					map: grassTex,
					color: "#fb923c"
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			position: [
				12,
				5,
				-8
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				receiveShadow: true,
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					6,
					1,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					map: grassTex,
					color: "#fb923c"
				})]
			})
		})
	] });
}
function Star({ position, text, isCorrect, onHit }) {
	const ref = (0, import_react.useRef)();
	const [collected, setCollected] = (0, import_react.useState)(false);
	useFrame((state) => {
		if (ref.current && !collected) {
			ref.current.rotation.y += .02;
			ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3 + position[0]) * .3;
		}
	});
	if (collected) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "fixed",
		colliders: "cuboid",
		position,
		sensor: true,
		onIntersectionEnter: (payload) => {
			if (payload.other.rigidBodyObject?.name === "player") {
				setCollected(true);
				onHit(isCorrect, position);
				setTimeout(() => setCollected(false), 5e3);
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("octahedronGeometry", { args: [1, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: isCorrect ? "#fef08a" : "#e2e8f0",
					emissive: isCorrect ? "#ca8a04" : "#64748b",
					emissiveIntensity: .6,
					metalness: .8,
					roughness: .2
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				position: [
					0,
					1.8,
					0
				],
				fontSize: 1,
				color: "white",
				outlineWidth: .1,
				outlineColor: "black",
				anchorX: "center",
				anchorY: "middle",
				fontWeight: "bold",
				children: text
			})]
		})
	});
}
function ParticleBurst({ position, color }) {
	const groupRef = (0, import_react.useRef)();
	const [particleData] = (0, import_react.useState)(() => Array.from({ length: 40 }).map(() => ({
		velocity: new Vector3((Math.random() - .5) * 20, (Math.random() - .2) * 20, (Math.random() - .5) * 20),
		scale: Math.random() * .6 + .2
	})));
	useFrame((state, delta) => {
		if (groupRef.current) groupRef.current.children.forEach((mesh, i) => {
			const pd = particleData[i];
			mesh.position.addScaledVector(pd.velocity, delta);
			mesh.material.opacity = Math.max(0, mesh.material.opacity - delta * 1.5);
			if (mesh.scale.x > .01) mesh.scale.setScalar(mesh.scale.x * .92);
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref: groupRef,
		position,
		children: particleData.map((pd, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			scale: pd.scale,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1,
				1,
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color,
				transparent: true,
				opacity: 1
			})]
		}, i))
	});
}
var HUD = ({ question, message, onExit }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	style: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		pointerEvents: "none",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		padding: "30px",
		boxSizing: "border-box",
		zIndex: 10
	},
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				justifyContent: "space-between",
				alignItems: "flex-start"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					pointerEvents: "auto",
					flex: 1,
					textAlign: "center"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						background: "rgba(255,255,255,0.9)",
						padding: "20px",
						borderRadius: "20px",
						border: "5px solid #3498db",
						display: "inline-block",
						boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							color: "#2c3e50",
							fontFamily: "Impact, sans-serif",
							margin: "0",
							fontSize: "3rem"
						},
						children: question
					})
				}), message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					style: {
						color: message.includes("Richtig") ? "#2ecc71" : "#e74c3c",
						textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
						fontFamily: "Impact, sans-serif",
						margin: "20px 0 0 0",
						fontSize: "4rem",
						animation: "popIn 0.3s ease-out"
					},
					children: message
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					pointerEvents: "auto",
					padding: "15px 30px",
					fontSize: "1.5rem",
					fontWeight: "bold",
					backgroundColor: "#e74c3c",
					color: "white",
					border: "4px solid #c0392b",
					borderRadius: "15px",
					cursor: "pointer",
					boxShadow: "0 8px 0 #c0392b",
					transition: "transform 0.1s",
					fontFamily: "Impact, sans-serif"
				},
				onMouseDown: (e) => {
					e.currentTarget.style.transform = "translateY(8px)";
					e.currentTarget.style.boxShadow = "0 0px 0 #c0392b";
				},
				onMouseUp: (e) => {
					e.currentTarget.style.transform = "translateY(0)";
					e.currentTarget.style.boxShadow = "0 8px 0 #c0392b";
				},
				children: "BEENDEN"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				color: "white",
				fontFamily: "Impact, sans-serif",
				textShadow: "2px 2px 0 #000",
				fontSize: "1.5rem",
				alignSelf: "flex-start"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				style: { margin: "5px 0" },
				children: [
					"🏃 ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "WASD" }),
					" - Bewegen"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				style: { margin: "5px 0" },
				children: [
					"⬆️ ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Leertaste" }),
					" - Springen"
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }` })
	]
});
function FaskaMario64({ onExit }) {
	const [message, setMessage] = (0, import_react.useState)("");
	const [particles, setParticles] = (0, import_react.useState)([]);
	const keys = useKeys();
	const handleHit = (isCorrect, position) => {
		if (isCorrect) {
			setMessage("Richtig! Paris ist die Hauptstadt von Frankreich.");
			addParticles(position, "#fbbf24");
		} else {
			setMessage("Falsch! Versuche es nochmal.");
			addParticles(position, "#ef4444");
			window.dispatchEvent(new Event("faska-shake"));
		}
		setTimeout(() => setMessage(""), 4e3);
	};
	const addParticles = (position, color) => {
		const id = Date.now() + Math.random();
		setParticles((p) => [...p, {
			id,
			position,
			color
		}]);
		setTimeout(() => setParticles((p) => p.filter((x) => x.id !== id)), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100%",
			height: "100%",
			position: "absolute",
			inset: 0,
			backgroundColor: "#87CEEB",
			overflow: "hidden"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HUD, {
			question: "Was ist die Hauptstadt von Frankreich?",
			message,
			onExit
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
			shadows: true,
			camera: {
				fov: 60,
				position: [
					0,
					10,
					15
				]
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
					attach: "background",
					args: ["#87CEEB"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, {
					sunPosition: [
						100,
						20,
						100
					],
					turbidity: .1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .6 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					castShadow: true,
					position: [
						10,
						30,
						15
					],
					intensity: 1.5,
					"shadow-mapSize": [2048, 2048],
					"shadow-camera-left": -25,
					"shadow-camera-right": 25,
					"shadow-camera-top": 25,
					"shadow-camera-bottom": -25
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: null,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
						gravity: [
							0,
							-35,
							0
						],
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Level, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, { keys }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
								position: [
									-12,
									7,
									-8
								],
								text: "A: Berlin",
								isCorrect: false,
								onHit: handleHit
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
								position: [
									0,
									10,
									-16
								],
								text: "B: Paris",
								isCorrect: true,
								onHit: handleHit
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
								position: [
									12,
									7,
									-8
								],
								text: "C: London",
								isCorrect: false,
								onHit: handleHit
							})
						]
					})
				}),
				particles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParticleBurst, {
					position: p.position,
					color: p.color
				}, p.id))
			]
		})]
	});
}
//#endregion
export { FaskaMario64 as default };
