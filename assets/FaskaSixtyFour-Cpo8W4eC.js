import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as create } from "./react-B1iXS_n6.js";
import { a as Physics, n as CuboidCollider, o as RigidBody, s as useRapier, t as CapsuleCollider } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { i as wt, n as dt, t as It } from "./dist-DaAzX60v.js";
//#region src/components/games/engines/FaskaSixtyFour/World.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var MovingPlatform = ({ position, args = [
	4,
	.5,
	4
], color = "orange", speed = 2, range = 5, axis = "x" }) => {
	const ref = (0, import_react.useRef)();
	const [timeOffset] = (0, import_react.useState)(() => Math.random() * Math.PI * 2);
	useFrame((state) => {
		if (!ref.current) return;
		const time = state.clock.getElapsedTime() * speed + timeOffset;
		const offset = Math.sin(time) * range;
		ref.current.translation();
		if (axis === "x") ref.current.setNextKinematicTranslation({
			x: position[0] + offset,
			y: position[1],
			z: position[2]
		});
		else if (axis === "y") ref.current.setNextKinematicTranslation({
			x: position[0],
			y: position[1] + offset,
			z: position[2]
		});
		else ref.current.setNextKinematicTranslation({
			x: position[0],
			y: position[1],
			z: position[2] + offset
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "kinematicPosition",
		ref,
		position,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			receiveShadow: true,
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .4,
				metalness: .1
			})]
		})
	});
};
var NorthAmerica = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			0,
			0,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				friction: 1,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					position: [
						0,
						-.5,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						10,
						12,
						1,
						32
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3b5998" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						-5,
						.5,
						-5
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						4,
						2,
						4
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8b9dc3" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						5,
						1.5,
						5
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						3,
						4,
						3
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#dfe3ee" })]
				})
			})
		]
	});
};
var SouthAmerica = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			-25,
			0,
			10
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				friction: 1.2,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					position: [
						0,
						-.5,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						15,
						1,
						15
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2e7d32" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						0,
						.5,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						10,
						1,
						10
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#388e3c" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						0,
						1.5,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						5,
						1,
						5
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#4caf50" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						12.5,
						0,
						-5
					],
					rotation: [
						0,
						0,
						.1
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						10,
						.5,
						4
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#795548" })]
				})
			})
		]
	});
};
var Europe = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			20,
			2,
			-15
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					position: [
						0,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						12,
						1,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#5d4037" })]
				})
			}),
			[-4, 4].map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						x,
						2,
						-6
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.5,
						.5,
						4,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#d7ccc8" })]
				})
			}, `col-${i}`)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						0,
						4,
						-6
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						10,
						1,
						2
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#d7ccc8" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MovingPlatform, {
				position: [
					-12,
					-.5,
					5
				],
				color: "#8d6e63",
				axis: "x",
				range: 4,
				speed: 1.5
			})
		]
	});
};
var Africa = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			15,
			-2,
			20
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				friction: .8,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					position: [
						0,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						14,
						12,
						1,
						6
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#fbc02d",
						roughness: .9
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						3,
						1,
						-3
					],
					rotation: [
						Math.PI / 4,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						8,
						4,
						.5
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f9a825" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						-4,
						1.5,
						4
					],
					rotation: [
						-Math.PI / 6,
						Math.PI / 4,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						6,
						6,
						.5
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f57f17" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MovingPlatform, {
				position: [
					-8,
					1,
					-12
				],
				args: [
					3,
					.5,
					3
				],
				color: "#ffb300",
				axis: "y",
				range: 3,
				speed: 1
			})
		]
	});
};
var Asia = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			-20,
			5,
			-25
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					position: [
						0,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						10,
						8,
						1,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#c62828" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						0,
						2,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						6,
						8,
						3,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#b71c1c" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						0,
						5,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						3,
						5,
						3,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#ffc107" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						10,
						-2,
						10
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						2,
						.5,
						2
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8e24aa" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						6,
						-.5,
						6
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						2,
						.5,
						2
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8e24aa" })]
				})
			})
		]
	});
};
var Oceania = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			35,
			-5,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					position: [
						0,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						18,
						18,
						.5,
						32
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#00bcd4",
						transparent: true,
						opacity: .6
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						-5,
						.5,
						5
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						3,
						4,
						1,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#cddc39" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						6,
						1,
						-4
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						2,
						3,
						2,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#cddc39" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: [
						2,
						.2,
						8
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						1.5,
						2,
						.5,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#cddc39" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MovingPlatform, {
				position: [
					-15,
					0,
					0
				],
				args: [
					3,
					.5,
					3
				],
				color: "#0097a7",
				axis: "z",
				range: 8,
				speed: 1.2
			})
		]
	});
};
var Antarctica = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			0,
			-8,
			-35
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				friction: .05,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					position: [
						0,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						15,
						12,
						1,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#e0f7fa",
						roughness: .1,
						metalness: .5
					})]
				})
			}),
			[
				[
					-5,
					2,
					-5
				],
				[
					5,
					3,
					2
				],
				[
					0,
					4,
					6
				],
				[
					-8,
					2,
					3
				]
			].map((pos, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
				type: "fixed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					castShadow: true,
					position: pos,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
						1.5,
						pos[1] * 2,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#b2ebf2",
						roughness: 0,
						metalness: .8
					})]
				})
			}, `ice-${i}`)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MovingPlatform, {
				position: [
					0,
					-2,
					18
				],
				args: [
					4,
					.5,
					4
				],
				color: "#80deea",
				axis: "z",
				range: 10,
				speed: 2
			})
		]
	});
};
var World = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			castShadow: true,
			position: [
				50,
				50,
				50
			],
			intensity: 1.5,
			"shadow-mapSize": [2048, 2048],
			"shadow-camera-left": -50,
			"shadow-camera-right": 50,
			"shadow-camera-top": 50,
			"shadow-camera-bottom": -50
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NorthAmerica, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SouthAmerica, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Europe, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Africa, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Asia, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Oceania, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Antarctica, {})
	] });
};
//#endregion
//#region src/components/games/engines/FaskaSixtyFour/Effects.jsx
function Effects() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, {
			sunPosition: [
				100,
				20,
				100
			],
			turbidity: .3,
			rayleigh: .5,
			mieCoefficient: .005,
			mieDirectionalG: .8
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			castShadow: true,
			position: [
				100,
				20,
				100
			],
			intensity: 1.5,
			"shadow-mapSize-width": 1024,
			"shadow-mapSize-height": 1024,
			"shadow-camera-far": 200,
			"shadow-camera-left": -50,
			"shadow-camera-right": 50,
			"shadow-camera-top": 50,
			"shadow-camera-bottom": -50
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(dt, {
			multisampling: 0,
			disableNormalPass: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(wt, {
				luminanceThreshold: .85,
				luminanceSmoothing: .1,
				intensity: 1.2,
				mipmapBlur: true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(It, {
				samples: 9,
				radius: .1,
				intensity: 20,
				luminanceInfluence: .6,
				color: "black"
			})]
		})
	] });
}
//#endregion
//#region src/components/games/engines/FaskaSixtyFour/MobileJoystick.jsx
var joystickState = {
	x: 0,
	y: 0,
	jump: false
};
function MobileJoystick() {
	const containerRef = (0, import_react.useRef)(null);
	const [knobPos, setKnobPos] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	(0, import_react.useEffect)(() => {
		const handleTouchMove = (e) => {
			if (e.cancelable) e.preventDefault();
		};
		document.addEventListener("touchmove", handleTouchMove, { passive: false });
		return () => {
			document.removeEventListener("touchmove", handleTouchMove);
		};
	}, []);
	const handlePointerDown = (e) => {
		e.target.setPointerCapture(e.pointerId);
		updateJoystick(e);
	};
	const handlePointerMove = (e) => {
		if (e.target.hasPointerCapture(e.pointerId)) updateJoystick(e);
	};
	const handlePointerUp = (e) => {
		e.target.releasePointerCapture(e.pointerId);
		setKnobPos({
			x: 0,
			y: 0
		});
		joystickState.x = 0;
		joystickState.y = 0;
	};
	const updateJoystick = (e) => {
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		const radius = rect.width / 2;
		let dx = e.clientX - centerX;
		let dy = e.clientY - centerY;
		const distance = Math.sqrt(dx * dx + dy * dy);
		if (distance > radius) {
			dx = dx / distance * radius;
			dy = dy / distance * radius;
		}
		setKnobPos({
			x: dx,
			y: dy
		});
		joystickState.x = dx / radius;
		joystickState.y = dy / radius;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			bottom: "50px",
			left: "50px",
			zIndex: 1e3,
			display: "flex",
			gap: "40px",
			pointerEvents: "none"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: containerRef,
			style: {
				width: "120px",
				height: "120px",
				borderRadius: "50%",
				backgroundColor: "rgba(255,255,255,0.2)",
				border: "2px solid rgba(255,255,255,0.5)",
				position: "relative",
				pointerEvents: "auto",
				touchAction: "none"
			},
			onPointerDown: handlePointerDown,
			onPointerMove: handlePointerMove,
			onPointerUp: handlePointerUp,
			onPointerCancel: handlePointerUp,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				width: "60px",
				height: "60px",
				borderRadius: "50%",
				backgroundColor: "rgba(255,255,255,0.8)",
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: `translate(calc(-50% + ${knobPos.x}px), calc(-50% + ${knobPos.y}px))`
			} })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				display: "flex",
				alignItems: "center"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				style: {
					width: "80px",
					height: "80px",
					borderRadius: "50%",
					backgroundColor: "rgba(255,0,0,0.5)",
					border: "2px solid rgba(255,0,0,0.8)",
					color: "white",
					fontSize: "18px",
					fontWeight: "bold",
					pointerEvents: "auto",
					touchAction: "none"
				},
				onPointerDown: (e) => {
					e.target.setPointerCapture(e.pointerId);
					joystickState.jump = true;
				},
				onPointerUp: (e) => {
					e.target.releasePointerCapture(e.pointerId);
					joystickState.jump = false;
				},
				onPointerCancel: (e) => {
					e.target.releasePointerCapture(e.pointerId);
					joystickState.jump = false;
				},
				children: "JUMP"
			})
		})]
	});
}
//#endregion
//#region src/components/games/engines/FaskaSixtyFour/PlayerController.jsx
var useKeyboard = () => {
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
};
function PlayerController({ position = [
	0,
	5,
	0
] }) {
	const bodyRef = (0, import_react.useRef)();
	const keys = useKeyboard();
	const { rapier, world } = useRapier();
	const [jumpsLeft, setJumpsLeft] = (0, import_react.useState)(2);
	const jumpPressedRef = (0, import_react.useRef)(false);
	const targetCameraPos = (0, import_react.useRef)(new Vector3());
	const speed = 7;
	const jumpStrength = 8;
	const cameraOffset = new Vector3(0, 5, 10);
	useFrame((state, delta) => {
		if (!bodyRef.current) return;
		try {
			const body = bodyRef.current;
			const translation = body.translation();
			const velocity = body.linvel();
			if (translation.y < -20) {
				body.setTranslation({
					x: 0,
					y: 5,
					z: 0
				}, true);
				body.setLinvel({
					x: 0,
					y: 0,
					z: 0
				}, true);
				return;
			}
			const rayOrigin = {
				x: translation.x,
				y: translation.y - .9,
				z: translation.z
			};
			const ray = new rapier.Ray(rayOrigin, {
				x: 0,
				y: -1,
				z: 0
			});
			const hit = world.castRay(ray, .25, true);
			if (hit != null && hit.toi < .25 && velocity.y <= 0) {
				if (jumpsLeft !== 2) setJumpsLeft(2);
			}
			let inputX = joystickState.x;
			let inputZ = joystickState.y;
			if (keys.forward) inputZ -= 1;
			if (keys.backward) inputZ += 1;
			if (keys.left) inputX -= 1;
			if (keys.right) inputX += 1;
			const length = Math.sqrt(inputX * inputX + inputZ * inputZ);
			if (length > 1) {
				inputX /= length;
				inputZ /= length;
			}
			const moveVelocity = {
				x: inputX * speed,
				y: velocity.y,
				z: inputZ * speed
			};
			body.setLinvel(moveVelocity, true);
			const isJumpInput = keys.jump || joystickState.jump;
			if (isJumpInput && !jumpPressedRef.current && jumpsLeft > 0) {
				body.setLinvel({
					x: velocity.x,
					y: jumpStrength,
					z: velocity.z
				}, true);
				setJumpsLeft((prev) => prev - 1);
			}
			jumpPressedRef.current = isJumpInput;
			const playerPos = new Vector3(translation.x, translation.y, translation.z);
			targetCameraPos.current.copy(playerPos).add(cameraOffset);
			state.camera.position.lerp(targetCameraPos.current, 5 * delta);
			state.camera.lookAt(playerPos);
		} catch (error) {
			console.warn("PlayerController: Physics step failed", error);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		ref: bodyRef,
		colliders: false,
		position,
		enabledRotations: [
			false,
			false,
			false
		],
		friction: 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapsuleCollider, { args: [.5, .5] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
				.5,
				1,
				16,
				32
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "hotpink" })]
		})]
	});
}
//#endregion
//#region src/components/games/engines/FaskaSixtyFour/GameLogic.js
var useGameStore = create((set, get) => ({
	collectedContinents: [],
	phase: "playing",
	pendingContinent: null,
	collectStar: (continentName, isLearncade = true) => {
		const { collectedContinents, phase } = get();
		if (collectedContinents.includes(continentName) || phase !== "playing") return;
		if (isLearncade) set({
			phase: "quiz",
			pendingContinent: continentName
		});
		else set((state) => {
			const newCollected = [...state.collectedContinents, continentName];
			return {
				collectedContinents: newCollected,
				phase: newCollected.length >= 7 ? "won" : "playing"
			};
		});
	},
	answerQuiz: (isCorrect) => {
		const { pendingContinent, collectedContinents } = get();
		if (isCorrect) {
			const newCollected = [...collectedContinents, pendingContinent];
			set({
				collectedContinents: newCollected,
				phase: newCollected.length >= 7 ? "won" : "playing",
				pendingContinent: null
			});
		} else set({
			phase: "playing",
			pendingContinent: null
		});
	},
	resetGame: () => {
		set({
			collectedContinents: [],
			phase: "playing",
			pendingContinent: null
		});
	}
}));
//#endregion
//#region src/components/games/engines/FaskaSixtyFour/UIOverlay.jsx
var quizQuestions = {
	"North America": {
		question: "Which country has the largest landmass in North America?",
		options: [
			"USA",
			"Canada",
			"Mexico"
		],
		answer: "Canada"
	},
	"South America": {
		question: "Which is the longest river in South America?",
		options: [
			"Amazon",
			"Parana",
			"Orinoco"
		],
		answer: "Amazon"
	},
	"Europe": {
		question: "Which of these is the smallest country in Europe?",
		options: [
			"Monaco",
			"Vatican City",
			"San Marino"
		],
		answer: "Vatican City"
	},
	"Africa": {
		question: "What is the tallest mountain in Africa?",
		options: [
			"Mount Kilimanjaro",
			"Mount Kenya",
			"Mount Stanley"
		],
		answer: "Mount Kilimanjaro"
	},
	"Asia": {
		question: "Which is the most populous country in Asia as of 2023?",
		options: [
			"India",
			"China",
			"Indonesia"
		],
		answer: "India"
	},
	"Australia": {
		question: "Which of these animals is native to Australia?",
		options: [
			"Kangaroo",
			"Panda",
			"Tiger"
		],
		answer: "Kangaroo"
	},
	"Antarctica": {
		question: "What is the average temperature in Antarctica?",
		options: [
			"-10°C",
			"-57°C",
			"0°C"
		],
		answer: "-57°C"
	}
};
var defaultQuestion = {
	question: "What is the capital of France?",
	options: [
		"London",
		"Berlin",
		"Paris"
	],
	answer: "Paris"
};
var UIOverlay = ({ onExit }) => {
	const { collectedContinents, phase, pendingContinent, answerQuiz } = useGameStore();
	if (phase === "won") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: styles.overlay,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: styles.wonContainer,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				style: styles.wonText,
				children: "You Win!"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: styles.wonSubtext,
				children: "All 7 continents collected!"
			})]
		})
	});
	const currentQuiz = pendingContinent && quizQuestions[pendingContinent] ? quizQuestions[pendingContinent] : defaultQuestion;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: styles.overlay,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: styles.scoreContainer,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					style: styles.scoreText,
					children: [
						"Stars: ",
						collectedContinents.length,
						" / 7"
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				style: styles.exitButton,
				onClick: onExit,
				title: "Beenden",
				children: "✕"
			}),
			phase === "quiz" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: styles.quizOverlay,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: styles.quizCard,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						style: styles.questionText,
						children: currentQuiz.question
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: styles.buttonContainer,
						children: currentQuiz.options.map((option, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							style: styles.quizButton,
							onClick: () => answerQuiz(option === currentQuiz.answer),
							children: option
						}, idx))
					})]
				})
			})
		]
	});
};
var styles = {
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		pointerEvents: "none",
		display: "flex",
		flexDirection: "column",
		fontFamily: "system-ui, -apple-system, sans-serif",
		zIndex: 1e3
	},
	scoreContainer: {
		padding: "20px",
		pointerEvents: "auto"
	},
	scoreText: {
		margin: 0,
		color: "#fff",
		fontSize: "28px",
		textShadow: "0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)",
		fontWeight: "bold"
	},
	quizOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(0,0,0,0.85)",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		pointerEvents: "auto",
		backdropFilter: "blur(4px)"
	},
	quizCard: {
		backgroundColor: "#ffffff",
		padding: "30px 20px",
		borderRadius: "24px",
		width: "90%",
		maxWidth: "500px",
		textAlign: "center",
		boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
		boxSizing: "border-box"
	},
	questionText: {
		fontSize: "1.5rem",
		marginBottom: "30px",
		color: "#1a1a1a",
		fontWeight: "700",
		lineHeight: "1.4"
	},
	buttonContainer: {
		display: "flex",
		flexDirection: "column",
		gap: "16px"
	},
	quizButton: {
		padding: "18px 24px",
		fontSize: "1.125rem",
		fontWeight: "600",
		backgroundColor: "#3b82f6",
		color: "white",
		border: "none",
		borderRadius: "16px",
		cursor: "pointer",
		transition: "transform 0.1s, background-color 0.2s",
		boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
		WebkitTapHighlightColor: "transparent"
	},
	wonContainer: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.8)",
		pointerEvents: "auto",
		backdropFilter: "blur(8px)"
	},
	wonText: {
		fontSize: "4rem",
		color: "#fbbf24",
		textShadow: "0 0 20px rgba(251, 191, 36, 0.6), 0 4px 8px rgba(0,0,0,0.8)",
		margin: "0 0 16px 0",
		textAlign: "center"
	},
	wonSubtext: {
		fontSize: "1.5rem",
		color: "#f3f4f6",
		textAlign: "center",
		margin: 0
	},
	exitButton: {
		position: "absolute",
		top: "20px",
		right: "20px",
		width: "50px",
		height: "50px",
		borderRadius: "25px",
		backgroundColor: "rgba(0,0,0,0.5)",
		border: "2px solid rgba(255,255,255,0.2)",
		color: "white",
		fontSize: "24px",
		fontWeight: "bold",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		cursor: "pointer",
		pointerEvents: "auto",
		zIndex: 2e3
	}
};
//#endregion
//#region src/components/games/engines/FaskaSixtyFour/Collectibles.jsx
var CONTINENTS = [
	{
		name: "North America",
		position: [
			-15,
			1,
			-15
		]
	},
	{
		name: "South America",
		position: [
			-8,
			1,
			-5
		]
	},
	{
		name: "Europe",
		position: [
			5,
			1,
			-20
		]
	},
	{
		name: "Africa",
		position: [
			2,
			1,
			-8
		]
	},
	{
		name: "Asia",
		position: [
			18,
			1,
			-15
		]
	},
	{
		name: "Australia",
		position: [
			20,
			1,
			5
		]
	},
	{
		name: "Antarctica",
		position: [
			0,
			1,
			20
		]
	}
];
var Star = ({ position, name, isLearncade = true }) => {
	const meshRef = (0, import_react.useRef)();
	const { collectStar, collectedContinents } = useGameStore();
	const isCollected = collectedContinents.includes(name);
	useFrame((state, delta) => {
		if (meshRef.current) {
			meshRef.current.rotation.y += delta * 1.5;
			meshRef.current.rotation.x += delta * .5;
			meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * .3;
		}
	});
	if (isCollected) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		type: "fixed",
		colliders: false,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
			args: [
				1.5,
				1.5,
				1.5
			],
			sensor: true,
			position,
			onIntersectionEnter: (payload) => {
				collectStar(name, isLearncade);
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			position,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				ref: meshRef,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dodecahedronGeometry", { args: [.6] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#fbbf24",
					emissive: "#d97706",
					emissiveIntensity: .6,
					metalness: .8,
					roughness: .2
				})]
			})
		})]
	});
};
var Collectibles = ({ isLearncade = true }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: CONTINENTS.map((continent) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
		name: continent.name,
		position: continent.position,
		isLearncade
	}, continent.name)) });
};
//#endregion
//#region src/components/games/engines/FaskaSixtyFour/FaskaSixtyFour.jsx
function FaskaSixtyFour({ onExit, isLearncade = true }) {
	const { phase, resetGame } = useGameStore();
	(0, import_react.useEffect)(() => {
		resetGame();
	}, [resetGame]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100%",
			height: "100vh",
			position: "relative",
			background: "#3b82f6",
			overflow: "hidden"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UIOverlay, { onExit }),
			phase === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileJoystick, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
				shadows: true,
				camera: { fov: 60 },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Effects, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
					gravity: [
						0,
						-20,
						0
					],
					paused: phase === "quiz",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collectibles, { isLearncade }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerController, {})
					]
				})]
			})
		]
	});
}
//#endregion
export { FaskaSixtyFour as default };
