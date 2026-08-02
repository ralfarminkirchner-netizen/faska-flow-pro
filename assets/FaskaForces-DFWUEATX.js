import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { $ as MathUtils, Lt as Vector2, Rt as Vector3, a as useFrame, s as useThree, t as Canvas, yt as Raycaster } from "./react-three-fiber.esm-pJsmxxS9.js";
import { a as Physics, o as RigidBody, t as CapsuleCollider } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { t as PointerLockControls } from "./PointerLockControls-LuZl7kld.js";
import { t as Billboard } from "./Billboard-CE57c09w.js";
import { t as Text } from "./Text-CuphjnHx.js";
//#region src/components/games/engines/FaskaForces/FaskaForces.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var WORDS = [
	{
		correct: "Vielleicht",
		wrong: "Fieleicht"
	},
	{
		correct: "Maschine",
		wrong: "Maschiene"
	},
	{
		correct: "Rhythmus",
		wrong: "Rythmus"
	},
	{
		correct: "Sympathie",
		wrong: "Sympatie"
	},
	{
		correct: "nämlich",
		wrong: "nähmlich"
	},
	{
		correct: "Adresse",
		wrong: "Addresse"
	},
	{
		correct: "Galerie",
		wrong: "Gallerie"
	},
	{
		correct: "Reparatur",
		wrong: "Reperatur"
	},
	{
		correct: "Terrasse",
		wrong: "Terasse"
	},
	{
		correct: "Zucchini",
		wrong: "Zuchini"
	}
];
var MAZE_SIZE = 12;
var CELL_SIZE = 4;
var mazeWalls = [];
var emptyCells = [];
for (let i = -MAZE_SIZE / 2; i < MAZE_SIZE / 2; i++) for (let j = -MAZE_SIZE / 2; j < MAZE_SIZE / 2; j++) {
	if (Math.abs(i) <= 1 && Math.abs(j) <= 1) {
		emptyCells.push([i * CELL_SIZE, j * CELL_SIZE]);
		continue;
	}
	if (Math.random() < .25) mazeWalls.push([i * CELL_SIZE, j * CELL_SIZE]);
	else emptyCells.push([i * CELL_SIZE, j * CELL_SIZE]);
}
function usePlayerControls() {
	const [movement, setMovement] = (0, import_react.useState)({
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
					setMovement((m) => ({
						...m,
						forward: true
					}));
					break;
				case "KeyS":
				case "ArrowDown":
					setMovement((m) => ({
						...m,
						backward: true
					}));
					break;
				case "KeyA":
				case "ArrowLeft":
					setMovement((m) => ({
						...m,
						left: true
					}));
					break;
				case "KeyD":
				case "ArrowRight":
					setMovement((m) => ({
						...m,
						right: true
					}));
					break;
				case "Space":
					setMovement((m) => ({
						...m,
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
					setMovement((m) => ({
						...m,
						forward: false
					}));
					break;
				case "KeyS":
				case "ArrowDown":
					setMovement((m) => ({
						...m,
						backward: false
					}));
					break;
				case "KeyA":
				case "ArrowLeft":
					setMovement((m) => ({
						...m,
						left: false
					}));
					break;
				case "KeyD":
				case "ArrowRight":
					setMovement((m) => ({
						...m,
						right: false
					}));
					break;
				case "Space":
					setMovement((m) => ({
						...m,
						jump: false
					}));
					break;
				default: break;
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, []);
	return movement;
}
function Player({ onShoot }) {
	const body = (0, import_react.useRef)();
	const weaponRef = (0, import_react.useRef)();
	const recoil = (0, import_react.useRef)(0);
	const { camera, scene, gl } = useThree();
	const controls = usePlayerControls();
	const speed = 7;
	const direction = new Vector3();
	const frontVector = new Vector3();
	const sideVector = new Vector3();
	(0, import_react.useEffect)(() => {
		const onMouseDown = (e) => {
			if (document.pointerLockElement === gl.domElement) {
				const raycaster = new Raycaster();
				raycaster.setFromCamera(new Vector2(0, 0), camera);
				const hit = raycaster.intersectObjects(scene.children, true).find((i) => i.object.userData && i.object.userData.isTarget);
				if (hit) hit.object.userData.onHit(hit.point);
				recoil.current = .2;
				onShoot();
			}
		};
		window.addEventListener("mousedown", onMouseDown);
		return () => window.removeEventListener("mousedown", onMouseDown);
	}, [
		camera,
		scene,
		gl.domElement,
		onShoot
	]);
	useFrame(() => {
		if (!body.current) return;
		const velocity = body.current.linvel();
		const translation = body.current.translation();
		camera.position.set(translation.x, translation.y + .8, translation.z);
		frontVector.set(0, 0, (controls.backward ? 1 : 0) - (controls.forward ? 1 : 0));
		sideVector.set((controls.left ? 1 : 0) - (controls.right ? 1 : 0), 0, 0);
		direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed).applyEuler(camera.rotation);
		body.current.setLinvel({
			x: direction.x,
			y: velocity.y,
			z: direction.z
		}, true);
		if (controls.jump && Math.abs(velocity.y) < .1) body.current.setLinvel({
			x: velocity.x,
			y: 5,
			z: velocity.z
		}, true);
		if (weaponRef.current) {
			weaponRef.current.position.copy(camera.position);
			weaponRef.current.rotation.copy(camera.rotation);
			weaponRef.current.translateX(.3);
			weaponRef.current.translateY(-.3);
			weaponRef.current.translateZ(-.5 + recoil.current);
			recoil.current = MathUtils.lerp(recoil.current, 0, .2);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: body,
		colliders: false,
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
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapsuleCollider, { args: [.5, .5] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref: weaponRef,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			.1,
			.1,
			.4
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2d3748" })]
	})] });
}
function Arena() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "fixed",
		name: "floor",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-.5,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				MAZE_SIZE * CELL_SIZE + 2,
				1,
				MAZE_SIZE * CELL_SIZE + 2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#1a202c",
				roughness: .8
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		type: "fixed",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					4,
					-MAZE_SIZE * CELL_SIZE / 2 - 1
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					MAZE_SIZE * CELL_SIZE + 4,
					10,
					2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2d3748" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					4,
					MAZE_SIZE * CELL_SIZE / 2 + 1
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					MAZE_SIZE * CELL_SIZE + 4,
					10,
					2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2d3748" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-MAZE_SIZE * CELL_SIZE / 2 - 1,
					4,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					2,
					10,
					MAZE_SIZE * CELL_SIZE + 4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2d3748" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					MAZE_SIZE * CELL_SIZE / 2 + 1,
					4,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					2,
					10,
					MAZE_SIZE * CELL_SIZE + 4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2d3748" })]
			}),
			mazeWalls.map((wall, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					wall[0],
					4,
					wall[1]
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					CELL_SIZE,
					10,
					CELL_SIZE
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#4a5568" })]
			}, idx))
		]
	})] });
}
function Target({ position, word, isCorrect, onHitTarget }) {
	const meshRef = (0, import_react.useRef)();
	const [hovered, setHovered] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (meshRef.current) meshRef.current.userData = {
			isTarget: true,
			onHit: (hitPoint) => onHitTarget(isCorrect, hitPoint || position)
		};
	}, [
		isCorrect,
		onHitTarget,
		position
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		type: "fixed",
		colliders: "cuboid",
		position,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Billboard, {
			follow: true,
			lockY: false,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				ref: meshRef,
				onPointerOver: () => setHovered(true),
				onPointerOut: () => setHovered(false),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [4, 1.5] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: hovered ? "#e2e8f0" : "#cbd5e0",
						emissive: hovered ? "#2b6cb0" : "#000000"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						position: [
							0,
							0,
							.01
						],
						fontSize: .5,
						color: "#1a202c",
						font: "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxM.woff",
						children: word
					})
				]
			})
		})
	});
}
function Explosion({ position, color, onComplete }) {
	const meshRef = (0, import_react.useRef)();
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(onComplete, 400);
		return () => clearTimeout(timer);
	}, [onComplete]);
	useFrame((state, delta) => {
		if (meshRef.current) {
			meshRef.current.scale.x += delta * 15;
			meshRef.current.scale.y += delta * 15;
			meshRef.current.scale.z += delta * 15;
			meshRef.current.material.opacity = Math.max(0, meshRef.current.material.opacity - delta * 2.5);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref: meshRef,
		position,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			.5,
			16,
			16
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color,
			transparent: true,
			opacity: 1
		})]
	});
}
function Game({ onScore }) {
	const [currentWordIdx, setCurrentWordIdx] = (0, import_react.useState)(0);
	const [explosions, setExplosions] = (0, import_react.useState)([]);
	const handleHit = (isCorrect, hitPoint) => {
		setExplosions((prev) => [...prev, {
			id: Date.now(),
			position: hitPoint,
			color: isCorrect ? "#48bb78" : "#f56565"
		}]);
		if (isCorrect) onScore(1);
		else onScore(-1);
		setCurrentWordIdx((i) => (i + 1) % WORDS.length);
	};
	const removeExplosion = (id) => {
		setExplosions((prev) => prev.filter((e) => e.id !== id));
	};
	const currentPair = WORDS[currentWordIdx];
	const isCorrectLeft = (0, import_react.useMemo)(() => Math.random() > .5, [currentWordIdx]);
	const spawns = (0, import_react.useMemo)(() => {
		const shuffled = [...emptyCells].sort(() => .5 - Math.random());
		return {
			a: [
				shuffled[0][0],
				1.5,
				shuffled[0][1]
			],
			b: [
				shuffled[1][0],
				1.5,
				shuffled[1][1]
			]
		};
	}, [currentWordIdx]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
			gravity: [
				0,
				-20,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, { onShoot: () => {} }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arena, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
					position: spawns.a,
					word: isCorrectLeft ? currentPair.correct : currentPair.wrong,
					isCorrect: isCorrectLeft,
					onHitTarget: handleHit
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
					position: spawns.b,
					word: !isCorrectLeft ? currentPair.correct : currentPair.wrong,
					isCorrect: !isCorrectLeft,
					onHitTarget: handleHit
				})
			]
		}),
		explosions.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Explosion, {
			position: ex.position,
			color: ex.color,
			onComplete: () => removeExplosion(ex.id)
		}, ex.id)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PointerLockControls, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, {
			sunPosition: [
				100,
				20,
				100
			],
			turbidity: .1
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .4 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				10,
				10,
				5
			],
			intensity: 1
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
			attach: "fog",
			args: [
				"#1a202c",
				10,
				40
			]
		})
	] });
}
function FaskaForces({ onExit }) {
	const [score, setScore] = (0, import_react.useState)(0);
	const [started, setStarted] = (0, import_react.useState)(false);
	const [flash, setFlash] = (0, import_react.useState)(null);
	const handleScore = (points) => {
		setScore((s) => s + points);
		setFlash(points > 0 ? "rgba(72, 187, 120, 0.4)" : "rgba(245, 101, 101, 0.4)");
		setTimeout(() => setFlash(null), 150);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100vw",
			height: "100vh",
			position: "absolute",
			top: 0,
			left: 0,
			overflow: "hidden",
			background: "#000"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					pointerEvents: "none",
					zIndex: 10
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onExit,
						style: {
							position: "absolute",
							top: "20px",
							right: "20px",
							padding: "10px 20px",
							fontSize: "16px",
							fontWeight: "bold",
							background: "#e53e3e",
							color: "white",
							border: "none",
							borderRadius: "5px",
							cursor: "pointer",
							pointerEvents: "auto",
							boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
						},
						children: "Beenden"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							position: "absolute",
							top: "20px",
							left: "20px",
							color: "white",
							fontSize: "28px",
							fontFamily: "monospace",
							fontWeight: "bold",
							textShadow: "2px 2px 0 #000"
						},
						children: ["Score: ", score]
					}),
					started && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							position: "absolute",
							bottom: "20px",
							left: "20px",
							color: "rgba(255,255,255,0.7)",
							fontSize: "14px",
							fontFamily: "sans-serif"
						},
						children: "Klicken, um die Kamera zu steuern. ESC zum Freigeben."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						position: "absolute",
						top: "50%",
						left: "50%",
						width: "6px",
						height: "6px",
						background: "white",
						borderRadius: "50%",
						transform: "translate(-50%, -50%)",
						mixBlendMode: "difference"
					} }),
					flash && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: flash,
						transition: "background-color 0.1s"
					} })
				]
			}),
			!started && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => setStarted(true),
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					backgroundColor: "rgba(0,0,0,0.85)",
					zIndex: 50,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					color: "white",
					cursor: "pointer"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							fontSize: "64px",
							marginBottom: "20px",
							color: "#63b3ed",
							textShadow: "0 0 10px #3182ce"
						},
						children: "FaskaForces"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							fontSize: "24px",
							marginBottom: "40px",
							textAlign: "center",
							maxWidth: "600px",
							lineHeight: "1.5"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "WASD" }),
							" zum Bewegen, ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Leertaste" }),
							" zum Springen."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Finde und schieße auf das ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "richtig" }),
							" geschriebene Wort!"
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						style: {
							padding: "15px 40px",
							fontSize: "24px",
							background: "#3182ce",
							color: "white",
							border: "none",
							borderRadius: "8px",
							cursor: "pointer",
							boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
						},
						children: "Klicken zum Starten"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
				shadows: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: null,
					children: started && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Game, { onScore: handleScore })
				})
			})
		]
	});
}
//#endregion
export { FaskaForces as default };
