import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, lt as Object3D, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { t as Text } from "./Text-CuphjnHx.js";
//#region src/components/games/engines/FaskaRallySwarm/FaskaRallySwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var vocabulary = [
	{
		singular: "Auto",
		plural: "Autos",
		wrong: "Auten"
	},
	{
		singular: "Haus",
		plural: "Häuser",
		wrong: "Hausen"
	},
	{
		singular: "Hund",
		plural: "Hunde",
		wrong: "Hünds"
	},
	{
		singular: "Maus",
		plural: "Mäuse",
		wrong: "Mausen"
	},
	{
		singular: "Kind",
		plural: "Kinder",
		wrong: "Kinds"
	},
	{
		singular: "Wald",
		plural: "Wälder",
		wrong: "Walde"
	},
	{
		singular: "Stadt",
		plural: "Städte",
		wrong: "Stadts"
	},
	{
		singular: "Buch",
		plural: "Bücher",
		wrong: "Buchs"
	},
	{
		singular: "Frau",
		plural: "Frauen",
		wrong: "Fräulein"
	},
	{
		singular: "Mann",
		plural: "Männer",
		wrong: "Manns"
	},
	{
		singular: "Vogel",
		plural: "Vögel",
		wrong: "Vogels"
	},
	{
		singular: "Baum",
		plural: "Bäume",
		wrong: "Baums"
	}
];
var segmentIdCounter = 0;
function createRandomSegment(z) {
	const word = vocabulary[Math.floor(Math.random() * vocabulary.length)];
	const swap = Math.random() > .5;
	const rocks = [];
	for (let i = 0; i < 15; i++) {
		const side = Math.random() > .5 ? 1 : -1;
		rocks.push({
			x: side * (22 + Math.random() * 30),
			z: z - Math.random() * 200,
			scale: 1 + Math.random() * 3
		});
	}
	return {
		id: segmentIdCounter++,
		z,
		question: word.singular,
		leftOption: swap ? word.wrong : word.plural,
		rightOption: swap ? word.plural : word.wrong,
		correctAnswer: word.plural,
		passed: false,
		rocks
	};
}
var useKeyboard = () => {
	const [keys, setKeys] = (0, import_react.useState)({
		forward: false,
		backward: false,
		left: false,
		right: false
	});
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			const key = e.key.toLowerCase();
			if (key === "arrowup" || key === "w") setKeys((k) => ({
				...k,
				forward: true
			}));
			if (key === "arrowdown" || key === "s") setKeys((k) => ({
				...k,
				backward: true
			}));
			if (key === "arrowleft" || key === "a") setKeys((k) => ({
				...k,
				left: true
			}));
			if (key === "arrowright" || key === "d") setKeys((k) => ({
				...k,
				right: true
			}));
		};
		const handleKeyUp = (e) => {
			const key = e.key.toLowerCase();
			if (key === "arrowup" || key === "w") setKeys((k) => ({
				...k,
				forward: false
			}));
			if (key === "arrowdown" || key === "s") setKeys((k) => ({
				...k,
				backward: false
			}));
			if (key === "arrowleft" || key === "a") setKeys((k) => ({
				...k,
				left: false
			}));
			if (key === "arrowright" || key === "d") setKeys((k) => ({
				...k,
				right: false
			}));
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
var CarVisuals = import_react.forwardRef((props, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.75,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					2,
					.5,
					4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#d12a2a" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					1.25,
					-.2
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.6,
					.6,
					1.5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.7,
					.75,
					-2.05
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.4,
					.2,
					.1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "white",
					emissive: "white",
					emissiveIntensity: .8
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.7,
					.75,
					-2.05
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.4,
					.2,
					.1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "white",
					emissive: "white",
					emissiveIntensity: .8
				})]
			}),
			[-1.1, 1.1].map((x) => [-1.2, 1.2].map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					x,
					.4,
					z
				],
				rotation: [
					0,
					0,
					Math.PI / 2
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.5,
					.5,
					.4,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
			}, `${x}-${z}`)))
		]
	});
});
var LightSetup = ({ carRef }) => {
	const lightRef = (0, import_react.useRef)();
	useFrame(() => {
		if (carRef.current && lightRef.current) {
			lightRef.current.position.set(carRef.current.position.x + 50, 50, carRef.current.position.z + 50);
			lightRef.current.target.position.copy(carRef.current.position);
			lightRef.current.target.updateMatrixWorld();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
		ref: lightRef,
		intensity: 1.2,
		castShadow: true,
		"shadow-mapSize": [1024, 1024],
		"shadow-camera-far": 200,
		"shadow-camera-left": -60,
		"shadow-camera-right": 60,
		"shadow-camera-top": 60,
		"shadow-camera-bottom": -60
	});
};
var Ground = ({ carRef }) => {
	const groundRef = (0, import_react.useRef)();
	useFrame(() => {
		if (carRef.current && groundRef.current) groundRef.current.position.z = carRef.current.position.z;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref: groundRef,
		rotation: [
			-Math.PI / 2,
			0,
			0
		],
		position: [
			0,
			-.1,
			0
		],
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1e3, 1e3] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#e6d3a8",
			roughness: 1
		})]
	});
};
var Track = ({ segments }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: segments.map((seg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				0,
				seg.z - 100
			],
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [40, 200] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#c2a77a",
				roughness: .9
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1,
				seg.z - 140
			],
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2,
				2,
				80
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#b35900",
				roughness: .6
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				-10,
				0,
				seg.z - 120
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						2,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.2,
						.2,
						4
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#555" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						4,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						10,
						3,
						.5
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#1a5276" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						0,
						4,
						.26
					],
					fontSize: 1.5,
					color: "white",
					anchorX: "center",
					anchorY: "middle",
					children: seg.leftOption
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				10,
				0,
				seg.z - 120
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						2,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.2,
						.2,
						4
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#555" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						4,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						10,
						3,
						.5
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#1a5276" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					position: [
						0,
						4,
						.26
					],
					fontSize: 1.5,
					color: "white",
					anchorX: "center",
					anchorY: "middle",
					children: seg.rightOption
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.01,
				seg.z - 120
			],
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [40, 1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "white",
				transparent: true,
				opacity: .6
			})]
		}),
		seg.rocks.map((rock, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				rock.x,
				rock.scale / 2,
				rock.z
			],
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dodecahedronGeometry", { args: [rock.scale] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#8b5a2b",
				roughness: .9
			})]
		}, idx))
	] }, seg.id)) });
};
var Scene = ({ setScore, segments, setSegments, onFlash }) => {
	const carRef = (0, import_react.useRef)();
	const keys = useKeyboard();
	const velocity = (0, import_react.useRef)(new Vector3());
	const rotation = (0, import_react.useRef)(0);
	const speed = (0, import_react.useRef)(0);
	const dustMeshRef = (0, import_react.useRef)();
	const dummy = (0, import_react.useMemo)(() => new Object3D(), []);
	const particles = (0, import_react.useRef)(Array.from({ length: 150 }, () => ({
		active: false,
		position: new Vector3(),
		velocity: new Vector3(),
		life: 0
	})));
	let pIdx = (0, import_react.useRef)(0);
	useFrame((state, delta) => {
		if (!carRef.current) return;
		const dt = Math.min(delta, .1);
		const maxSpeed = 60;
		const accel = 35;
		const decel = 15;
		const turnSpeed = 2.5;
		if (keys.forward) speed.current = Math.min(speed.current + accel * dt, maxSpeed);
		else if (keys.backward) speed.current = Math.max(speed.current - accel * dt, -maxSpeed / 2);
		else {
			if (speed.current > 0) speed.current = Math.max(0, speed.current - decel * dt);
			if (speed.current < 0) speed.current = Math.min(0, speed.current + decel * dt);
		}
		const speedFactor = Math.abs(speed.current) / maxSpeed;
		if (keys.left) rotation.current += turnSpeed * dt * Math.max(.3, speedFactor);
		if (keys.right) rotation.current -= turnSpeed * dt * Math.max(.3, speedFactor);
		const desiredVelocity = new Vector3(-Math.sin(rotation.current), 0, -Math.cos(rotation.current)).multiplyScalar(speed.current);
		velocity.current.lerp(desiredVelocity, 4 * dt);
		carRef.current.position.add(velocity.current.clone().multiplyScalar(dt));
		carRef.current.rotation.y = rotation.current;
		if (carRef.current.position.x < -20) {
			carRef.current.position.x = -20;
			speed.current *= .9;
		}
		if (carRef.current.position.x > 20) {
			carRef.current.position.x = 20;
			speed.current *= .9;
		}
		const cx = carRef.current.position.x;
		const cz = carRef.current.position.z;
		segments.forEach((seg) => {
			if (cz < seg.z - 100 && cz > seg.z - 180) {
				if (cx > -2.5 && cx < 2.5) {
					if (cx > 0) {
						carRef.current.position.x = 2.5;
						velocity.current.x = Math.max(0, velocity.current.x);
					} else {
						carRef.current.position.x = -2.5;
						velocity.current.x = Math.min(0, velocity.current.x);
					}
					speed.current *= .6;
				}
			}
			if (!seg.passed && cz < seg.z - 120) {
				seg.passed = true;
				if (((cx < 0 ? "left" : "right") === "left" ? seg.leftOption : seg.rightOption) === seg.correctAnswer) {
					setScore((s) => s + 10);
					onFlash("rgba(0, 255, 0, 0.4)");
				} else {
					setScore((s) => Math.max(0, s - 5));
					onFlash("rgba(255, 0, 0, 0.4)");
					speed.current *= .5;
				}
			}
		});
		const lastSeg = segments[segments.length - 1];
		if (cz < lastSeg.z - 50) setSegments((prev) => {
			const newSegs = prev.filter((s) => s.z < cz + 300);
			newSegs.push(createRandomSegment(lastSeg.z - 200));
			return newSegs;
		});
		const idealPos = carRef.current.position.clone().add(new Vector3(0, 12, 30));
		state.camera.position.lerp(idealPos, 6 * dt);
		const lookAtPos = carRef.current.position.clone().add(new Vector3(0, 0, -10));
		state.camera.lookAt(lookAtPos);
		if (Math.abs(speed.current) > 10 && dustMeshRef.current) for (let i = 0; i < 2; i++) {
			const p = particles.current[pIdx.current];
			p.active = true;
			p.life = 1;
			p.position.copy(carRef.current.position);
			p.position.y = .2;
			p.position.x += (Math.random() - .5) * 2;
			p.position.z += (Math.random() - .5) * 2;
			p.velocity.set((Math.random() - .5) * 3, Math.random() * 2 + 1, (Math.random() - .5) * 3);
			pIdx.current = (pIdx.current + 1) % 150;
		}
		if (dustMeshRef.current) {
			particles.current.forEach((p, i) => {
				if (p.active) {
					p.life -= dt * 2;
					p.position.addScaledVector(p.velocity, dt);
					if (p.life <= 0) p.active = false;
					if (p.active) {
						dummy.position.copy(p.position);
						dummy.scale.setScalar(p.life * 1.5);
						dummy.updateMatrix();
						dustMeshRef.current.setMatrixAt(i, dummy.matrix);
					} else {
						dummy.scale.setScalar(0);
						dummy.updateMatrix();
						dustMeshRef.current.setMatrixAt(i, dummy.matrix);
					}
				}
			});
			dustMeshRef.current.instanceMatrix.needsUpdate = true;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, {
			sunPosition: [
				100,
				20,
				100
			],
			turbidity: .3,
			rayleigh: .5
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LightSetup, { carRef }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarVisuals, { ref: carRef }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ground, { carRef }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Track, { segments }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
			ref: dustMeshRef,
			args: [
				null,
				null,
				150
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.5,
				8,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#e6d3a8",
				transparent: true,
				opacity: .5
			})]
		})
	] });
};
function FaskaRallySwarm({ onExit }) {
	const [score, setScore] = (0, import_react.useState)(0);
	const [segments, setSegments] = (0, import_react.useState)(() => [
		createRandomSegment(0),
		createRandomSegment(-200),
		createRandomSegment(-400)
	]);
	const [flash, setFlash] = (0, import_react.useState)(null);
	const currentSeg = segments.find((s) => !s.passed) || segments[0];
	const handleFlash = (color) => {
		setFlash(color);
		setTimeout(() => setFlash(null), 300);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100vw",
			height: "100vh",
			position: "relative",
			overflow: "hidden",
			backgroundColor: "#87CEEB"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				backgroundColor: flash || "transparent",
				pointerEvents: "none",
				zIndex: 5,
				transition: "background-color 0.1s"
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					pointerEvents: "none",
					zIndex: 10
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						justifyContent: "space-between",
						padding: "20px"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onExit,
							style: {
								pointerEvents: "auto",
								padding: "12px 24px",
								fontSize: "18px",
								background: "#ff4444",
								color: "white",
								border: "none",
								borderRadius: "8px",
								cursor: "pointer",
								fontWeight: "bold",
								boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
								height: "fit-content"
							},
							children: "Beenden"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								background: "rgba(0,0,0,0.8)",
								color: "white",
								padding: "15px 40px",
								borderRadius: "12px",
								textAlign: "center",
								boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
								border: "2px solid rgba(255,255,255,0.2)"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: "18px",
										opacity: .9,
										marginBottom: "5px"
									},
									children: "Finde die Mehrzahl von:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: "40px",
										fontWeight: "900",
										textTransform: "uppercase",
										letterSpacing: "2px"
									},
									children: currentSeg.question
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: "14px",
										marginTop: "10px",
										color: "#ffcc00"
									},
									children: "Nutze W A S D oder Pfeiltasten"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								background: "rgba(0,0,0,0.8)",
								color: "white",
								padding: "15px 30px",
								borderRadius: "12px",
								fontSize: "28px",
								fontWeight: "bold",
								boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
								height: "fit-content",
								border: "2px solid rgba(255,255,255,0.2)"
							},
							children: ["Punkte: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: { color: "#44ff44" },
								children: score
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
				shadows: true,
				camera: {
					fov: 60,
					position: [
						0,
						15,
						30
					]
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {
					setScore,
					segments,
					setSegments,
					onFlash: handleFlash
				})
			})
		]
	});
}
//#endregion
export { FaskaRallySwarm as default };
