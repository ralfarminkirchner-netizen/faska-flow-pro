import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, o as RigidBody, r as CylinderCollider } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { t as Trail } from "./Trail-DGj-8YKN.js";
//#region src/components/games/engines/FaskaGolfSwarm/FaskaGolfSwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var GameContext = import_react.createContext();
var ButtonOverlay = ({ onExit }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	style: {
		position: "absolute",
		top: 20,
		right: 20,
		zIndex: 1e3,
		pointerEvents: "auto"
	},
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: onExit,
		style: {
			padding: "10px 20px",
			fontSize: "18px",
			backgroundColor: "#ff4444",
			color: "white",
			border: "none",
			borderRadius: "5px",
			cursor: "pointer",
			boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
			fontWeight: "bold"
		},
		children: "Beenden"
	})
});
var PowerMeter = () => {
	const { store } = (0, import_react.useContext)(GameContext);
	const barRef = (0, import_react.useRef)();
	const textRef = (0, import_react.useRef)();
	(0, import_react.useEffect)(() => {
		let animationFrameId;
		const loop = () => {
			if (barRef.current && textRef.current) {
				const power = store.current.power;
				barRef.current.style.width = `${power}%`;
				barRef.current.style.backgroundColor = power > 80 ? "#ff3333" : power > 50 ? "#ffcc00" : "#33cc33";
				textRef.current.innerText = `POWER ${Math.round(power)}%`;
			}
			animationFrameId = requestAnimationFrame(loop);
		};
		loop();
		return () => cancelAnimationFrame(animationFrameId);
	}, [store]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			marginTop: "30px",
			width: "250px",
			height: "30px",
			background: "rgba(0,0,0,0.7)",
			border: "2px solid white",
			position: "relative",
			borderRadius: "15px",
			overflow: "hidden"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: barRef,
			style: {
				width: "0%",
				height: "100%",
				background: "#33cc33"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: textRef,
			style: {
				position: "absolute",
				top: "5px",
				left: "10px",
				fontWeight: "bold",
				textShadow: "1px 1px 2px black"
			},
			children: "POWER 0%"
		})]
	});
};
var UI = () => {
	const { store } = (0, import_react.useContext)(GameContext);
	const [state, setState] = (0, import_react.useState)("aiming");
	const [strokes, setStrokes] = (0, import_react.useState)(0);
	const [wind, setWind] = (0, import_react.useState)({
		x: 0,
		z: 0
	});
	(0, import_react.useEffect)(() => {
		let animationFrameId;
		let lastState = "";
		let lastStrokes = -1;
		const loop = () => {
			const s = store.current;
			if (lastState !== s.state) {
				setState(s.state);
				lastState = s.state;
			}
			if (lastStrokes !== s.strokes) {
				setStrokes(s.strokes);
				lastStrokes = s.strokes;
			}
			setWind({
				x: s.wind.x.toFixed(1),
				z: s.wind.z.toFixed(1)
			});
			animationFrameId = requestAnimationFrame(loop);
		};
		loop();
		return () => cancelAnimationFrame(animationFrameId);
	}, [store]);
	const handleRestart = () => {
		store.current.state = "aiming";
		store.current.strokes = 0;
		store.current.wind.set(Math.random() * 2 - 1, 0, Math.random() * 2 - 1);
		store.current.resetFlag = true;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			pointerEvents: "none",
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			zIndex: 10
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: 20,
				left: 20,
				color: "white",
				fontFamily: "monospace",
				fontSize: "18px",
				textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					style: {
						margin: 0,
						color: "#00ffcc"
					},
					children: "Faska Golf Swarm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					style: { margin: "5px 0" },
					children: ["Strokes: ", strokes]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					style: { margin: "5px 0" },
					children: [
						"Wind: X:",
						wind.x,
						" Z:",
						wind.z,
						" (m/s)"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						marginTop: "20px",
						padding: "15px",
						background: "rgba(0,0,0,0.6)",
						borderRadius: "8px",
						border: "1px solid #00ffcc"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							style: {
								margin: "0 0 10px 0",
								color: "#00ffcc"
							},
							children: "Hole Trajectory Math"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: { margin: "5px 0" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "x(t) = 6 * cos(t / 2)" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: { margin: "5px 0" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "z(t) = -15 + 6 * sin(t / 2)" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								margin: "10px 0 0 0",
								fontSize: "12px",
								color: "#aaa"
							},
							children: "Observe the flag's parametric movement!"
						})
					]
				}),
				state === "hole_in" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						pointerEvents: "auto",
						marginTop: "20px",
						background: "rgba(0,0,0,0.8)",
						padding: "20px",
						borderRadius: "10px",
						border: "2px solid #ffd700"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							color: "#ffd700",
							fontSize: "32px",
							fontWeight: "bold",
							marginBottom: "20px"
						},
						children: "HOLE IN! YOU WIN!"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleRestart,
						style: {
							padding: "10px 20px",
							fontSize: "18px",
							cursor: "pointer",
							backgroundColor: "#00ffcc",
							color: "black",
							border: "none",
							borderRadius: "5px",
							fontWeight: "bold"
						},
						children: "Play Again"
					})]
				}),
				(state === "aiming" || state === "power") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						marginTop: "20px",
						background: "rgba(0,0,0,0.5)",
						padding: "10px",
						borderRadius: "8px"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							margin: "0 0 5px 0",
							color: "#00ffcc"
						},
						children: "Controls:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						style: {
							margin: 0,
							paddingLeft: "20px",
							fontSize: "14px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Left / Right Arrows : Aim" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Spacebar : Hold to Power, Release to Hit" })]
					})]
				}),
				(state === "aiming" || state === "power") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PowerMeter, {})
			]
		})
	});
};
var AimIndicator = () => {
	const { store } = (0, import_react.useContext)(GameContext);
	const meshRef = (0, import_react.useRef)();
	useFrame(() => {
		if (meshRef.current) {
			const s = store.current;
			if (s.state === "aiming" || s.state === "power") {
				meshRef.current.visible = true;
				const bp = s.ballPosition;
				const angle = s.aimAngle;
				meshRef.current.position.set(bp.x - Math.sin(angle) * 2.5, bp.y, bp.z - Math.cos(angle) * 2.5);
				meshRef.current.rotation.y = angle;
			} else meshRef.current.visible = false;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref: meshRef,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			.05,
			.05,
			5
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "rgba(255, 255, 255, 0.8)",
			transparent: true
		})]
	});
};
var Hole = () => {
	const { store } = (0, import_react.useContext)(GameContext);
	const holeRef = (0, import_react.useRef)();
	useFrame(() => {
		const s = store.current;
		const hX = 0 + 6 * Math.cos(s.time * .5);
		const hZ = -15 + 6 * Math.sin(s.time * .5);
		s.holePos.set(hX, 0, hZ);
		if (holeRef.current) holeRef.current.setNextKinematicTranslation({
			x: hX,
			y: 0,
			z: hZ
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		type: "kinematicPosition",
		ref: holeRef,
		colliders: false,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CylinderCollider, {
				args: [1, 1.5],
				sensor: true,
				onIntersectionEnter: (payload) => {
					if (payload.other.rigidBodyObject?.name === "ball") store.current.state = "hole_in";
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				position: [
					0,
					.01,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
					1.2,
					1.5,
					32
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "yellow" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					2,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.05,
					.05,
					4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "white" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.5,
					3.5,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1, .6] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "red",
					side: 2
				})]
			})
		]
	});
};
var Terrain = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			friction: .8,
			restitution: .2,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				receiveShadow: true,
				position: [
					0,
					-.5,
					-10
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					40,
					1,
					60
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2E8B57" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			friction: .5,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				receiveShadow: true,
				position: [
					-8,
					0,
					-5
				],
				rotation: [
					0,
					0,
					-.2
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					10,
					1,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3CB371" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			friction: .5,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				receiveShadow: true,
				position: [
					8,
					0,
					-15
				],
				rotation: [
					.2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					10,
					1,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3CB371" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			friction: .5,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				receiveShadow: true,
				position: [
					0,
					-1,
					-25
				],
				rotation: [
					-.1,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					20,
					1,
					15
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3CB371" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			restitution: .8,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				receiveShadow: true,
				position: [
					0,
					1,
					-8
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					10,
					2,
					1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8B4513" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			restitution: .5,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				receiveShadow: true,
				position: [
					-20,
					1,
					-10
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1,
					4,
					60
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8B4513" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			restitution: .5,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				receiveShadow: true,
				position: [
					20,
					1,
					-10
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1,
					4,
					60
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8B4513" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			restitution: .5,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				receiveShadow: true,
				position: [
					0,
					1,
					-40
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					40,
					4,
					1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8B4513" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			restitution: .5,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				receiveShadow: true,
				position: [
					0,
					1,
					20
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					40,
					4,
					1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8B4513" })]
			})
		})
	] });
};
var WindParticles = () => {
	const { store } = (0, import_react.useContext)(GameContext);
	const groupRef = (0, import_react.useRef)();
	const particles = (0, import_react.useRef)(Array.from({ length: 30 }).map(() => ({
		x: (Math.random() - .5) * 40,
		y: Math.random() * 5 + 1,
		z: (Math.random() - .5) * 40,
		speedScale: Math.random() * .5 + .5
	})));
	useFrame((state, delta) => {
		const s = store.current;
		if (groupRef.current) groupRef.current.children.forEach((child, i) => {
			const p = particles.current[i];
			p.x += s.wind.x * p.speedScale * delta * 5;
			p.z += s.wind.z * p.speedScale * delta * 5;
			if (p.x > 20) p.x -= 40;
			if (p.x < -20) p.x += 40;
			if (p.z > 20) p.z -= 60;
			if (p.z < -40) p.z += 60;
			child.position.set(p.x, p.y, p.z);
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref: groupRef,
		children: particles.current.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			.2,
			.05,
			.4
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "white",
			transparent: true,
			opacity: .3
		})] }, i))
	});
};
var Scene = () => {
	const { store } = (0, import_react.useContext)(GameContext);
	const ballRef = (0, import_react.useRef)();
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			const s = store.current;
			if (s.state === "aiming") {
				if (e.code === "ArrowLeft") s.aimAngle += .1;
				else if (e.code === "ArrowRight") s.aimAngle -= .1;
				else if (e.code === "Space") {
					s.state = "power";
					s.power = 0;
					s.powerIncreasing = true;
				}
			}
		};
		const handleKeyUp = (e) => {
			const s = store.current;
			if (s.state === "power" && e.code === "Space") {
				s.state = "moving";
				s.strokes += 1;
				s.shakeTime = .2;
				if (ballRef.current) {
					const powerScaled = s.power * .3;
					const impulse = {
						x: -Math.sin(s.aimAngle) * powerScaled,
						y: .1 * powerScaled,
						z: -Math.cos(s.aimAngle) * powerScaled
					};
					ballRef.current.applyImpulse(impulse, true);
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [store]);
	useFrame((state, delta) => {
		const s = store.current;
		s.time += delta;
		if (s.resetFlag && ballRef.current) {
			ballRef.current.setTranslation({
				x: 0,
				y: 1,
				z: 5
			}, true);
			ballRef.current.setLinvel({
				x: 0,
				y: 0,
				z: 0
			}, true);
			ballRef.current.setAngvel({
				x: 0,
				y: 0,
				z: 0
			}, true);
			s.resetFlag = false;
		}
		if (s.state === "power") if (s.powerIncreasing) {
			s.power += delta * 150;
			if (s.power >= 100) {
				s.power = 100;
				s.powerIncreasing = false;
			}
		} else {
			s.power -= delta * 150;
			if (s.power <= 0) {
				s.power = 0;
				s.powerIncreasing = true;
			}
		}
		if (s.state === "moving" && ballRef.current) {
			const vel = ballRef.current.linvel();
			const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);
			ballRef.current.applyImpulse({
				x: s.wind.x * delta,
				y: 0,
				z: s.wind.z * delta
			}, true);
			if (speed < .2 && ballRef.current.translation().y <= 1) {
				s.state = "aiming";
				ballRef.current.setLinvel({
					x: 0,
					y: 0,
					z: 0
				}, true);
				ballRef.current.setAngvel({
					x: 0,
					y: 0,
					z: 0
				}, true);
			}
			if (ballRef.current.translation().y < -10) {
				ballRef.current.setTranslation({
					x: 0,
					y: 1,
					z: 5
				}, true);
				ballRef.current.setLinvel({
					x: 0,
					y: 0,
					z: 0
				}, true);
				ballRef.current.setAngvel({
					x: 0,
					y: 0,
					z: 0
				}, true);
				s.state = "aiming";
			}
		}
		if (ballRef.current) {
			const t = ballRef.current.translation();
			s.ballPosition.set(t.x, t.y, t.z);
			let camDist = 8;
			let camHeight = 4;
			let idealX, idealZ;
			if (s.state === "hole_in") {
				idealX = s.holePos.x + Math.sin(s.time) * 5;
				idealZ = s.holePos.z + Math.cos(s.time) * 5;
				state.camera.position.lerp(new Vector3(idealX, 5, idealZ), .05);
				state.camera.lookAt(s.holePos.x, 0, s.holePos.z);
			} else {
				idealX = t.x + Math.sin(s.aimAngle) * camDist;
				idealZ = t.z + Math.cos(s.aimAngle) * camDist;
				let targetCamPos = new Vector3(idealX, t.y + camHeight, idealZ);
				if (s.shakeTime > 0) {
					s.shakeTime -= delta;
					const shakeAmt = s.shakeTime * .5;
					targetCamPos.x += (Math.random() - .5) * shakeAmt;
					targetCamPos.y += (Math.random() - .5) * shakeAmt;
					targetCamPos.z += (Math.random() - .5) * shakeAmt;
				}
				state.camera.position.lerp(targetCamPos, .1);
				state.camera.lookAt(t.x, t.y, t.z);
			}
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			ref: ballRef,
			name: "ball",
			colliders: "ball",
			mass: 1,
			restitution: .5,
			friction: .8,
			position: [
				0,
				1,
				5
			],
			linearDamping: .5,
			angularDamping: .5,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trail, {
				width: .3,
				length: 8,
				color: "#ffff00",
				decay: 1,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					castShadow: true,
					receiveShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.2,
						32,
						32
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "white",
						roughness: .2
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AimIndicator, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hole, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terrain, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WindParticles, {})
	] });
};
function FaskaGolfSwarm({ onExit }) {
	const store = (0, import_react.useRef)({
		state: "aiming",
		aimAngle: 0,
		power: 0,
		powerIncreasing: true,
		strokes: 0,
		wind: new Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1),
		holePos: new Vector3(0, 0, -15),
		ballPosition: new Vector3(0, 1, 5),
		time: 0,
		shakeTime: 0,
		resetFlag: false
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameContext.Provider, {
		value: { store },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				width: "100vw",
				height: "100vh",
				overflow: "hidden",
				background: "#87CEEB",
				position: "relative"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ButtonOverlay, { onExit }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UI, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
					shadows: true,
					camera: {
						position: [
							0,
							5,
							10
						],
						fov: 50
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
							attach: "background",
							args: ["#87CEEB"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, { sunPosition: [
							100,
							20,
							100
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
							castShadow: true,
							position: [
								10,
								20,
								10
							],
							intensity: 1.5,
							"shadow-mapSize-width": 2048,
							"shadow-mapSize-height": 2048
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Physics, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {}) })
					]
				})
			]
		})
	});
}
//#endregion
export { FaskaGolfSwarm as default };
