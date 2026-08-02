import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { $ as MathUtils, S as Color, a as useFrame, lt as Object3D, t as Canvas, xt as RepeatWrapping } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as create } from "./react-B1iXS_n6.js";
import { n as useKeyboardControls, t as KeyboardControls } from "./KeyboardControls-e2HMFd2c.js";
import { a as Physics, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Text } from "./Text-CuphjnHx.js";
import { t as useTexture } from "./Texture-BOsfVZMl.js";
import { t as PerspectiveCamera } from "./PerspectiveCamera-DlPG4WJK.js";
//#region src/components/games/engines/FaskaFZeroSwarm/GameLogic.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var isPrime = (num) => {
	if (num <= 1) return false;
	if (num <= 3) return true;
	if (num % 2 === 0 || num % 3 === 0) return false;
	for (let i = 5; i * i <= num; i += 6) if (num % i === 0 || num % (i + 2) === 0) return false;
	return true;
};
var createHoopData = (zPos) => {
	const isP = Math.random() > .4;
	let num;
	do
		num = Math.floor(Math.random() * 98) + 2;
	while (isPrime(num) !== isP);
	return {
		x: (Math.random() - .5) * 30,
		z: zPos,
		number: num,
		isPrime: isP,
		hit: false,
		active: true,
		color: "#00ffff"
	};
};
var MAX_PARTICLES$1 = 150;
var spawnParticles = (particles, x, z, colorStr) => {
	let spawned = 0;
	for (let i = 0; i < MAX_PARTICLES$1; i++) {
		const p = particles[i];
		if (p.life <= 0) {
			p.life = .5 + Math.random() * .8;
			p.x = x + (Math.random() - .5) * 3;
			p.y = 1.5 + (Math.random() - .5) * 3;
			p.z = z + (Math.random() - .5) * 3;
			const speed = 10 + Math.random() * 30;
			const angle1 = Math.random() * Math.PI * 2;
			const angle2 = Math.random() * Math.PI * 2;
			p.vx = Math.cos(angle1) * Math.sin(angle2) * speed;
			p.vy = Math.sin(angle1) * speed;
			p.vz = Math.cos(angle2) * speed;
			p.colorStr = colorStr;
			p.scale = Math.random() * .8 + .2;
			spawned++;
			if (spawned > 30) break;
		}
	}
};
var useGameStore = create((set, get) => ({
	x: 0,
	speed: 60,
	targetSpeed: 60,
	score: 0,
	lap: 0,
	shake: 0,
	flash: 0,
	hoops: [],
	particles: [],
	boost: 0,
	controls: {
		forward: false,
		backward: false,
		left: false,
		right: false
	},
	setControls: (controls) => set((state) => ({ controls: {
		...state.controls,
		...controls
	} })),
	updateGame: (data) => set((state) => ({
		...state,
		...data
	})),
	initHoops: (hoops) => set({ hoops }),
	initParticles: (particles) => set({ particles })
}));
//#endregion
//#region src/components/games/engines/FaskaFZeroSwarm/World.jsx
var import_jsx_runtime = require_jsx_runtime();
function World() {
	const gridRef = (0, import_react.useRef)();
	const trackTexture = useTexture("/faska-flow-pro/textures/fzero_track.png");
	trackTexture.wrapS = trackTexture.wrapT = RepeatWrapping;
	trackTexture.repeat.set(1, 10);
	useFrame((state, delta) => {
		const speed = useGameStore.getState().speed;
		if (gridRef.current) {
			gridRef.current.position.z += speed * delta;
			if (gridRef.current.position.z > 20) gridRef.current.position.z -= 20;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				0,
				-200
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [120, 600] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				map: trackTexture,
				color: "#050510"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: gridRef,
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				.05,
				-200
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [
				60,
				600,
				12,
				120
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#ff0055",
				wireframe: true,
				transparent: true,
				opacity: .2
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-30,
				5,
				-200
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2,
				10,
				600
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				30,
				5,
				-200
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2,
				10,
				600
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
		})
	] });
}
//#endregion
//#region src/components/games/engines/FaskaFZeroSwarm/Player.jsx
function Player() {
	const shipMesh = (0, import_react.useRef)();
	const bodyRef = (0, import_react.useRef)();
	const [, get] = useKeyboardControls();
	const shipTexture = useTexture("/faska-flow-pro/textures/fzero_ship.png");
	useFrame((state, delta) => {
		const keys = get();
		const gameStore = useGameStore.getState();
		const { controls } = gameStore;
		let ax = 0;
		if (keys.left || controls.left) ax = -1;
		if (keys.right || controls.right) ax = 1;
		let x = gameStore.x + ax * 40 * delta;
		x = MathUtils.clamp(x, -18, 18);
		useGameStore.setState({ x });
		if (shipMesh.current) {
			shipMesh.current.position.x = MathUtils.lerp(shipMesh.current.position.x, x, 15 * delta);
			shipMesh.current.rotation.z = MathUtils.lerp(shipMesh.current.rotation.z, -ax * .7, 10 * delta);
			shipMesh.current.rotation.y = MathUtils.lerp(shipMesh.current.rotation.y, -ax * .3, 10 * delta);
			shipMesh.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 8) * .1;
		}
		try {
			if (bodyRef.current) {
				const position = bodyRef.current.translation();
				bodyRef.current.setNextKinematicTranslation({
					x: shipMesh.current ? shipMesh.current.position.x : position.x,
					y: position.y,
					z: position.z
				});
			}
		} catch (error) {
			console.warn("Physics body update failed", error);
		}
		let targetSpeed = 60 + gameStore.boost;
		if (keys.up || controls.forward) targetSpeed = 100 + gameStore.boost;
		else if (keys.down || controls.backward) targetSpeed = 30 + gameStore.boost;
		const speed = MathUtils.lerp(gameStore.speed, targetSpeed, 3 * delta);
		useGameStore.setState({
			speed,
			targetSpeed
		});
		if (gameStore.boost > 0) useGameStore.setState({ boost: gameStore.boost - 15 * delta });
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: bodyRef,
		type: "kinematicPosition",
		position: [
			0,
			1,
			0
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: shipMesh,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					rotation: [
						-Math.PI / 2,
						0,
						0
					],
					castShadow: true,
					receiveShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
						1.2,
						4,
						3
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						map: shipTexture,
						color: "#ff0055",
						metalness: .6,
						roughness: .2
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.8,
						-.3,
						-1.5
					],
					rotation: [
						Math.PI / 2,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.4,
						.4,
						1,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.8,
						-.3,
						-1.5
					],
					rotation: [
						Math.PI / 2,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.4,
						.4,
						1,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.8,
						-.3,
						-2.1
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.3,
						8,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#00ffff" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.8,
						-.3,
						-2.1
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.3,
						8,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#00ffff" })]
				})
			]
		})
	});
}
//#endregion
//#region src/components/games/engines/FaskaFZeroSwarm/UIOverlay.jsx
function UIOverlay({ onExit }) {
	const [uiState, setUiState] = (0, import_react.useState)({
		score: 0,
		speed: 60,
		lap: 0
	});
	(0, import_react.useEffect)(() => {
		const interval = setInterval(() => {
			const state = useGameStore.getState();
			setUiState({
				score: state.score,
				speed: Math.floor(state.speed),
				lap: state.lap
			});
		}, 100);
		return () => clearInterval(interval);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			top: 20,
			left: 20,
			color: "#00ffff",
			zIndex: 10,
			textShadow: "0 0 10px #00ffff",
			pointerEvents: "none"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					fontSize: "32px",
					fontWeight: "bold"
				},
				children: ["SCORE: ", uiState.score]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: { fontSize: "24px" },
				children: [
					"SPEED: ",
					uiState.speed,
					" KM/H"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: { fontSize: "24px" },
				children: ["LAP: ", uiState.lap]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					marginTop: "10px",
					fontSize: "16px",
					color: "#fff",
					textShadow: "none"
				},
				children: [
					"Fly through ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						style: { color: "#00ff00" },
						children: "PRIME NUMBERS"
					}),
					"!",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"Dodge composites."
				]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: onExit,
		style: {
			position: "absolute",
			top: 20,
			right: 20,
			zIndex: 10,
			padding: "12px 24px",
			fontSize: "18px",
			fontWeight: "bold",
			cursor: "pointer",
			backgroundColor: "#ff0055",
			color: "white",
			border: "none",
			borderRadius: "8px",
			boxShadow: "0 4px 15px rgba(255,0,85,0.5)",
			textTransform: "uppercase"
		},
		children: "Beenden"
	})] });
}
//#endregion
//#region src/components/games/engines/FaskaFZeroSwarm/MobileJoystick.jsx
function MobileJoystick() {
	const setControls = useGameStore((state) => state.setControls);
	const handleTouchStart = (dir) => (e) => {
		e.preventDefault();
		setControls({ [dir]: true });
	};
	const handleTouchEnd = (dir) => (e) => {
		e.preventDefault();
		setControls({ [dir]: false });
	};
	const btnStyle = {
		padding: "20px",
		background: "rgba(255, 255, 255, 0.2)",
		border: "none",
		borderRadius: "50%",
		color: "white",
		userSelect: "none",
		touchAction: "none"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			bottom: 20,
			right: 20,
			zIndex: 10,
			display: "flex",
			gap: "10px"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onTouchStart: handleTouchStart("left"),
				onTouchEnd: handleTouchEnd("left"),
				onMouseDown: handleTouchStart("left"),
				onMouseUp: handleTouchEnd("left"),
				style: btnStyle,
				children: "Left"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onTouchStart: handleTouchStart("right"),
				onTouchEnd: handleTouchEnd("right"),
				onMouseDown: handleTouchStart("right"),
				onMouseUp: handleTouchEnd("right"),
				style: btnStyle,
				children: "Right"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onTouchStart: handleTouchStart("forward"),
				onTouchEnd: handleTouchEnd("forward"),
				onMouseDown: handleTouchStart("forward"),
				onMouseUp: handleTouchEnd("forward"),
				style: btnStyle,
				children: "Accel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onTouchStart: handleTouchStart("backward"),
				onTouchEnd: handleTouchEnd("backward"),
				onMouseDown: handleTouchStart("backward"),
				onMouseUp: handleTouchEnd("backward"),
				style: btnStyle,
				children: "Brake"
			})
		]
	});
}
//#endregion
//#region src/components/games/engines/FaskaFZeroSwarm/FaskaFZeroSwarm.jsx
var MAX_HOOPS = 12;
var MAX_PARTICLES = 150;
var Hoop = ({ index }) => {
	const groupRef = (0, import_react.useRef)();
	const textRef = (0, import_react.useRef)();
	const [data, setData] = (0, import_react.useState)({
		number: 0,
		color: "white",
		visible: false
	});
	useFrame(() => {
		const hoop = useGameStore.getState().hoops[index];
		if (!hoop) return;
		if (groupRef.current) {
			groupRef.current.position.set(hoop.x, 1.5, hoop.z);
			if (data.number !== hoop.number || data.visible !== hoop.active) setData({
				number: hoop.number,
				color: hoop.color,
				visible: hoop.active
			});
		}
	});
	if (!data.visible) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: groupRef,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					0,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					3.5,
					.3,
					16,
					32
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: data.color,
					emissive: data.color,
					emissiveIntensity: .8
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					0,
					0,
					0
				],
				position: [
					0,
					0,
					-.5
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [3.4, 32] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color: "#000000",
					transparent: true,
					opacity: .5
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				ref: textRef,
				position: [
					0,
					0,
					0
				],
				fontSize: 2.5,
				color: "white",
				anchorX: "center",
				anchorY: "middle",
				children: data.number
			})
		]
	});
};
var GameEngineUpdater = () => {
	useFrame((state, delta) => {
		const g = useGameStore.getState();
		g.hoops.forEach((hoop) => {
			if (hoop.active) {
				hoop.z += g.speed * delta;
				if (hoop.z > -1 && hoop.z < 2 && !hoop.hit) {
					if (Math.abs(hoop.x - g.x) < 4) {
						hoop.hit = true;
						hoop.active = false;
						if (hoop.isPrime) {
							useGameStore.setState({
								score: g.score + 10,
								boost: 60
							});
							spawnParticles(g.particles, hoop.x, hoop.z, "#00ff00");
						} else {
							useGameStore.setState({
								score: g.score - 5,
								speed: Math.max(10, g.speed - 50),
								shake: .6,
								flash: 1
							});
							spawnParticles(g.particles, hoop.x, hoop.z, "#ff0000");
						}
					}
				}
				if (hoop.z > 15) hoop.active = false;
			} else {
				const activeZ = g.hoops.filter((h) => h.active).map((h) => h.z);
				const minZ = activeZ.length > 0 ? Math.min(...activeZ) : -100;
				Object.assign(hoop, createHoopData(minZ - 60 - Math.random() * 20));
			}
		});
		g.particles.forEach((p) => {
			if (p.life > 0) {
				p.life -= delta;
				p.x += p.vx * delta;
				p.y += p.vy * delta;
				p.z += p.vz * delta;
				p.z += g.speed * delta;
			}
		});
	});
	return null;
};
var HoopManager = () => {
	const hoops = useGameStore((state) => state.hoops);
	(0, import_react.useEffect)(() => {
		const newHoops = [];
		for (let i = 0; i < MAX_HOOPS; i++) newHoops.push(createHoopData(i * -60 - 100));
		useGameStore.setState({ hoops: newHoops });
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [hoops.length > 0 && Array.from({ length: MAX_HOOPS }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoop, { index: i }, i)), hoops.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameEngineUpdater, {})] });
};
var Particles = () => {
	const meshRef = (0, import_react.useRef)();
	const dummy = (0, import_react.useMemo)(() => new Object3D(), []);
	const tempColor = (0, import_react.useMemo)(() => new Color(), []);
	useGameStore((state) => state.particles);
	(0, import_react.useEffect)(() => {
		const newParticles = [];
		for (let i = 0; i < MAX_PARTICLES; i++) newParticles.push({
			life: 0,
			x: 0,
			y: 0,
			z: 0,
			vx: 0,
			vy: 0,
			vz: 0,
			scale: 1,
			colorStr: "#ffffff"
		});
		useGameStore.setState({ particles: newParticles });
	}, []);
	useFrame(() => {
		const g = useGameStore.getState();
		if (!meshRef.current || g.particles.length === 0) return;
		for (let i = 0; i < MAX_PARTICLES; i++) {
			const p = g.particles[i];
			if (p.life > 0) {
				dummy.position.set(p.x, p.y, p.z);
				const s = p.scale * p.life;
				dummy.scale.set(s, s, s);
				dummy.updateMatrix();
				meshRef.current.setMatrixAt(i, dummy.matrix);
				tempColor.set(p.colorStr);
				meshRef.current.setColorAt(i, tempColor);
			} else {
				dummy.position.set(0, -1e3, 0);
				dummy.updateMatrix();
				meshRef.current.setMatrixAt(i, dummy.matrix);
			}
		}
		meshRef.current.instanceMatrix.needsUpdate = true;
		if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: meshRef,
		args: [
			null,
			null,
			MAX_PARTICLES
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			.5,
			.5,
			.5
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { toneMapped: false })]
	});
};
var CameraManager = () => {
	const cameraRef = (0, import_react.useRef)();
	useFrame((state, delta) => {
		const g = useGameStore.getState();
		let shake = g.shake;
		if (shake > 0) {
			shake -= delta;
			if (shake < 0) shake = 0;
			useGameStore.setState({ shake });
		}
		if (cameraRef.current) {
			const targetX = g.x * .4;
			const targetY = 4 + g.speed / 100 * 1.5;
			const targetZ = 12;
			cameraRef.current.position.x = MathUtils.lerp(cameraRef.current.position.x, targetX, 5 * delta);
			cameraRef.current.position.y = MathUtils.lerp(cameraRef.current.position.y, targetY, 5 * delta);
			cameraRef.current.position.z = MathUtils.lerp(cameraRef.current.position.z, targetZ, 5 * delta);
			if (shake > 0) {
				const shakeIntensity = shake * 2;
				cameraRef.current.position.x += (Math.random() - .5) * shakeIntensity;
				cameraRef.current.position.y += (Math.random() - .5) * shakeIntensity;
			}
			cameraRef.current.lookAt(g.x * .2, 0, -30);
			const targetFov = 75 + g.speed / 120 * 15;
			cameraRef.current.fov = MathUtils.lerp(cameraRef.current.fov, targetFov, 5 * delta);
			cameraRef.current.updateProjectionMatrix();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerspectiveCamera, {
		ref: cameraRef,
		makeDefault: true,
		position: [
			0,
			4,
			12
		],
		fov: 75
	});
};
var PostEffects = () => {
	const lightRef = (0, import_react.useRef)();
	useFrame((state, delta) => {
		let flash = useGameStore.getState().flash;
		if (flash > 0) {
			flash -= delta * 3;
			if (flash < 0) flash = 0;
			useGameStore.setState({ flash });
		}
		if (lightRef.current) lightRef.current.intensity = flash * 10;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
		ref: lightRef,
		position: [
			0,
			5,
			5
		],
		color: "#ff0000",
		intensity: 0,
		distance: 50
	});
};
var Scene = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: ["#020205"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
			attach: "fog",
			args: [
				"#020205",
				40,
				250
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .4 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				10,
				20,
				5
			],
			intensity: 1.5,
			color: "#aaaaff"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraManager, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Physics, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoopManager, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Particles, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostEffects, {})
	] });
};
var keyboardMap = [
	{
		name: "left",
		keys: ["ArrowLeft", "KeyA"]
	},
	{
		name: "right",
		keys: ["ArrowRight", "KeyD"]
	},
	{
		name: "up",
		keys: ["ArrowUp", "KeyW"]
	},
	{
		name: "down",
		keys: ["ArrowDown", "KeyS"]
	}
];
function FaskaFZeroSwarm({ onExit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100vw",
			height: "100vh",
			position: "relative",
			overflow: "hidden",
			backgroundColor: "#000",
			fontFamily: "sans-serif"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UIOverlay, { onExit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileJoystick, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyboardControls, {
				map: keyboardMap,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
					shadows: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
						fallback: null,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {})
					})
				})
			})
		]
	});
}
//#endregion
export { FaskaFZeroSwarm as default };
