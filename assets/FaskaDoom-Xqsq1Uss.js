import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, j as Euler, s as useThree, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { t as PointerLockControls } from "./PointerLockControls-LuZl7kld.js";
import { t as Text } from "./Text-CuphjnHx.js";
//#region src/components/games/engines/FaskaDoom/FaskaDoom.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function generateProblem() {
	const a = Math.floor(Math.random() * 10) + 1;
	const b = Math.floor(Math.random() * 10) + 1;
	const isAdd = Math.random() > .5;
	const answer = isAdd ? a + b : Math.abs(a - b) + 1;
	const text = isAdd ? `${a} + ${b}` : a > b ? `${a} - ${b}` : `${b} - ${a}`;
	const options = [answer];
	while (options.length < 3) {
		const wrong = answer + Math.floor(Math.random() * 10) - 5;
		if (wrong !== answer && wrong >= 0 && !options.includes(wrong)) options.push(wrong);
	}
	options.sort(() => Math.random() - .5);
	return {
		text: text + " = ?",
		answer,
		options
	};
}
function Environment() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, {
			sunPosition: [
				100,
				20,
				100
			],
			turbidity: .3,
			rayleigh: .5
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .4 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				10,
				20,
				10
			],
			intensity: 1.5,
			castShadow: true
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				0,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [100, 100] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#223322",
				roughness: 1
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("gridHelper", {
			args: [
				100,
				100,
				"#000000",
				"#000000"
			],
			position: [
				0,
				.01,
				0
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				5,
				-50
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				100,
				10,
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#444444",
				roughness: .8
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				5,
				50
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				100,
				10,
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#444444",
				roughness: .8
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-50,
				5,
				0
			],
			rotation: [
				0,
				Math.PI / 2,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				100,
				10,
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#444444",
				roughness: .8
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				50,
				5,
				0
			],
			rotation: [
				0,
				Math.PI / 2,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				100,
				10,
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#444444",
				roughness: .8
			})]
		}),
		[...Array(30)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				(Math.random() - .5) * 80,
				5,
				(Math.random() - .5) * 80
			],
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2,
				10,
				2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#333333" })]
		}, i))
	] });
}
function Player({ addProjectile, isLocked }) {
	const { camera } = useThree();
	const [keys, setKeys] = (0, import_react.useState)({
		w: false,
		a: false,
		s: false,
		d: false
	});
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (!isLocked) return;
			switch (e.key.toLowerCase()) {
				case "w":
					setKeys((k) => ({
						...k,
						w: true
					}));
					break;
				case "a":
					setKeys((k) => ({
						...k,
						a: true
					}));
					break;
				case "s":
					setKeys((k) => ({
						...k,
						s: true
					}));
					break;
				case "d":
					setKeys((k) => ({
						...k,
						d: true
					}));
					break;
			}
		};
		const handleKeyUp = (e) => {
			switch (e.key.toLowerCase()) {
				case "w":
					setKeys((k) => ({
						...k,
						w: false
					}));
					break;
				case "a":
					setKeys((k) => ({
						...k,
						a: false
					}));
					break;
				case "s":
					setKeys((k) => ({
						...k,
						s: false
					}));
					break;
				case "d":
					setKeys((k) => ({
						...k,
						d: false
					}));
					break;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [isLocked]);
	useFrame((state, delta) => {
		if (!isLocked) return;
		const speed = 15;
		const direction = new Vector3(Number(keys.d) - Number(keys.a), 0, Number(keys.s) - Number(keys.w));
		direction.normalize().multiplyScalar(speed * delta);
		const euler = new Euler(0, camera.rotation.y, 0, "YXZ");
		direction.applyEuler(euler);
		camera.position.x += direction.x;
		camera.position.z += direction.z;
		camera.position.y = 1.5;
		if (camera.position.x > 48) camera.position.x = 48;
		if (camera.position.x < -48) camera.position.x = -48;
		if (camera.position.z > 48) camera.position.z = 48;
		if (camera.position.z < -48) camera.position.z = -48;
	});
	(0, import_react.useEffect)(() => {
		const handleMouseDown = (e) => {
			if (isLocked && e.button === 0) {
				const dir = new Vector3();
				camera.getWorldDirection(dir);
				addProjectile(camera.position.clone(), dir);
			}
		};
		window.addEventListener("mousedown", handleMouseDown);
		return () => window.removeEventListener("mousedown", handleMouseDown);
	}, [
		camera,
		addProjectile,
		isLocked
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PointerLockControls, {});
}
function Projectile({ id, position, direction, removeProjectile, registerProjectile, isLocked }) {
	const meshRef = (0, import_react.useRef)();
	(0, import_react.useEffect)(() => {
		if (meshRef.current) registerProjectile(id, meshRef);
		return () => registerProjectile(id, null);
	}, [id, registerProjectile]);
	useFrame((state, delta) => {
		if (!isLocked || !meshRef.current) return;
		meshRef.current.position.add(direction.clone().multiplyScalar(50 * delta));
		if (meshRef.current.position.length() > 100) removeProjectile(id);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref: meshRef,
		position,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.2,
				8,
				8
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#ffff00" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				color: "#ffff00",
				intensity: 2,
				distance: 5
			})
		]
	});
}
function Enemy({ id, initialPosition, number, isCorrect, registerEnemy, isLocked }) {
	const meshRef = (0, import_react.useRef)();
	(0, import_react.useEffect)(() => {
		if (meshRef.current) registerEnemy(id, meshRef, isCorrect);
		return () => registerEnemy(id, null);
	}, [
		id,
		isCorrect,
		registerEnemy
	]);
	useFrame((state, delta) => {
		if (!isLocked || !meshRef.current) return;
		const dir = new Vector3().subVectors(state.camera.position, meshRef.current.position);
		dir.y = 0;
		dir.normalize();
		meshRef.current.position.add(dir.multiplyScalar(4 * delta));
		meshRef.current.lookAt(state.camera.position);
		meshRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 3 + parseFloat(id)) * .5;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: meshRef,
		position: initialPosition,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("octahedronGeometry", { args: [1.5, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#aa3333",
				roughness: .4,
				metalness: .6
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			position: [
				0,
				2.5,
				0
			],
			fontSize: 1.5,
			color: "#ffffff",
			outlineWidth: .1,
			outlineColor: "#000000",
			children: number.toString()
		})]
	});
}
var ResetCamera = ({ started }) => {
	const { camera } = useThree();
	(0, import_react.useEffect)(() => {
		if (started) {
			camera.position.set(0, 1.5, 0);
			camera.rotation.set(0, 0, 0);
		}
	}, [started, camera]);
	return null;
};
var btnStyle = {
	padding: "15px 30px",
	fontSize: "24px",
	backgroundColor: "#cc0000",
	color: "white",
	border: "none",
	borderRadius: "8px",
	cursor: "pointer",
	fontWeight: "bold",
	boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
	textTransform: "uppercase",
	pointerEvents: "auto"
};
function FaskaDoom({ onExit }) {
	const [health, setHealth] = (0, import_react.useState)(3);
	const [score, setScore] = (0, import_react.useState)(0);
	const [problem, setProblem] = (0, import_react.useState)(null);
	const [enemies, setEnemies] = (0, import_react.useState)([]);
	const [projectiles, setProjectiles] = (0, import_react.useState)([]);
	const [gameOver, setGameOver] = (0, import_react.useState)(false);
	const [started, setStarted] = (0, import_react.useState)(false);
	const [isLocked, setIsLocked] = (0, import_react.useState)(false);
	const [flash, setFlash] = (0, import_react.useState)(null);
	const collisionState = (0, import_react.useRef)({
		enemies: /* @__PURE__ */ new Map(),
		projectiles: /* @__PURE__ */ new Map()
	});
	(0, import_react.useEffect)(() => {
		const handleLockChange = () => {
			setIsLocked(!!document.pointerLockElement);
		};
		document.addEventListener("pointerlockchange", handleLockChange);
		return () => document.removeEventListener("pointerlockchange", handleLockChange);
	}, []);
	(0, import_react.useEffect)(() => {
		if (gameOver && document.pointerLockElement) document.exitPointerLock();
	}, [gameOver]);
	(0, import_react.useEffect)(() => {
		if (problem && !gameOver) setEnemies(problem.options.map((opt) => {
			const angle = Math.random() * Math.PI * 2;
			const distance = 25 + Math.random() * 15;
			return {
				id: Math.random().toString(),
				number: opt,
				isCorrect: opt === problem.answer,
				initialPosition: [
					Math.cos(angle) * distance,
					1.5,
					Math.sin(angle) * distance
				]
			};
		}));
	}, [problem, gameOver]);
	const startGame = () => {
		setStarted(true);
		setHealth(3);
		setScore(0);
		setGameOver(false);
		setProblem(generateProblem());
	};
	const registerProjectile = (0, import_react.useCallback)((id, ref) => {
		if (ref) collisionState.current.projectiles.set(id, ref);
		else collisionState.current.projectiles.delete(id);
	}, []);
	const registerEnemy = (0, import_react.useCallback)((id, ref, isCorrect) => {
		if (ref) collisionState.current.enemies.set(id, {
			ref,
			isCorrect
		});
		else collisionState.current.enemies.delete(id);
	}, []);
	const removeProjectile = (0, import_react.useCallback)((id) => {
		setProjectiles((prev) => prev.filter((x) => x.id !== id));
	}, []);
	const addProjectile = (0, import_react.useCallback)((position, direction) => {
		const id = Math.random().toString();
		setProjectiles((prev) => [...prev, {
			id,
			position,
			direction
		}]);
	}, []);
	const handleHit = (0, import_react.useCallback)((enemyId, projectileId, isCorrect) => {
		collisionState.current.projectiles.delete(projectileId);
		if (isCorrect) collisionState.current.enemies.clear();
		else collisionState.current.enemies.delete(enemyId);
		setProjectiles((prev) => prev.filter((p) => p.id !== projectileId));
		setFlash(isCorrect ? "green" : "red");
		setTimeout(() => setFlash(null), 200);
		if (isCorrect) {
			setScore((s) => s + 10);
			setEnemies([]);
			setTimeout(() => {
				setProblem(generateProblem());
			}, 1e3);
		} else {
			setHealth((h) => {
				if (h - 1 <= 0) setGameOver(true);
				return h - 1;
			});
			setEnemies((prev) => prev.filter((e) => e.id !== enemyId));
		}
	}, []);
	const handlePlayerHit = (0, import_react.useCallback)((enemyId) => {
		collisionState.current.enemies.delete(enemyId);
		setFlash("red");
		setTimeout(() => setFlash(null), 200);
		setHealth((h) => {
			if (h - 1 <= 0) setGameOver(true);
			return h - 1;
		});
		setEnemies((prev) => prev.filter((e) => e.id !== enemyId));
	}, []);
	const CollisionSystem = () => {
		const { camera } = useThree();
		useFrame(() => {
			if (!isLocked) return;
			const eMap = collisionState.current.enemies;
			const pMap = collisionState.current.projectiles;
			let hitEnemyId = null;
			let hitProjectileId = null;
			let hitCorrect = false;
			for (const [pId, pRef] of pMap.entries()) {
				if (!pRef || !pRef.current) continue;
				for (const [eId, eData] of eMap.entries()) {
					if (!eData.ref || !eData.ref.current) continue;
					if (pRef.current.position.distanceTo(eData.ref.current.position) < 2) {
						hitEnemyId = eId;
						hitProjectileId = pId;
						hitCorrect = eData.isCorrect;
						break;
					}
				}
				if (hitEnemyId) break;
			}
			if (hitEnemyId) handleHit(hitEnemyId, hitProjectileId, hitCorrect);
			let playerHitId = null;
			for (const [eId, eData] of eMap.entries()) {
				if (!eData.ref || !eData.ref.current) continue;
				if (camera.position.distanceTo(eData.ref.current.position) < 2) {
					playerHitId = eId;
					break;
				}
			}
			if (playerHitId) handlePlayerHit(playerHitId);
		});
		return null;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100vw",
			height: "100vh",
			overflow: "hidden",
			backgroundColor: "#000"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
				shadows: true,
				camera: { fov: 75 },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResetCamera, { started }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Environment, {}),
					started && !gameOver && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {
							addProjectile,
							isLocked
						}),
						projectiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Projectile, {
							...p,
							registerProjectile,
							removeProjectile,
							isLocked
						}, p.id)),
						enemies.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Enemy, {
							...e,
							registerEnemy,
							isLocked
						}, e.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollisionSystem, {})
					] })
				]
			}),
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
					position: "absolute",
					inset: 0,
					backgroundColor: flash === "red" ? "rgba(255,0,0,0.4)" : flash === "green" ? "rgba(0,255,0,0.4)" : "transparent",
					transition: "background-color 0.1s"
				} }), started && !gameOver && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							position: "absolute",
							top: 20,
							left: 20,
							color: "white",
							fontSize: "32px",
							fontFamily: "monospace",
							textShadow: "2px 2px 0 #000"
						},
						children: ["Health: ", "❤️".repeat(health)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							position: "absolute",
							top: 20,
							right: 150,
							color: "white",
							fontSize: "32px",
							fontFamily: "monospace",
							textShadow: "2px 2px 0 #000"
						},
						children: ["Score: ", score]
					}),
					problem && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							position: "absolute",
							top: "10%",
							left: "50%",
							transform: "translateX(-50%)",
							color: "#ffcc00",
							fontSize: "64px",
							fontWeight: "bold",
							fontFamily: "sans-serif",
							textShadow: "4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
							textAlign: "center"
						},
						children: problem.text
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						position: "absolute",
						top: "50%",
						left: "50%",
						width: "10px",
						height: "10px",
						backgroundColor: "white",
						borderRadius: "50%",
						transform: "translate(-50%, -50%)",
						mixBlendMode: "difference"
					} }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							position: "absolute",
							bottom: 20,
							right: 20,
							color: "rgba(255,255,255,0.5)",
							fontSize: "16px"
						},
						children: "(ESC drücken für Menü)"
					})
				] })]
			}),
			!started && !gameOver && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					inset: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "rgba(0,0,0,0.8)",
					zIndex: 20
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							color: "white",
							fontSize: "80px",
							marginBottom: "40px",
							fontFamily: "sans-serif",
							textTransform: "uppercase",
							letterSpacing: "4px"
						},
						children: "FaskaDoom"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: "#ccc",
							marginBottom: "40px",
							fontSize: "24px"
						},
						children: "WASD zum Bewegen. Klicken zum Schießen. Löse die Matheaufgaben!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: startGame,
						style: btnStyle,
						children: "Spiel Starten"
					})
				]
			}),
			gameOver && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					inset: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "rgba(150,0,0,0.8)",
					zIndex: 20
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							color: "white",
							fontSize: "80px",
							marginBottom: "20px",
							fontFamily: "sans-serif",
							textTransform: "uppercase"
						},
						children: "Game Over"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						style: {
							color: "white",
							fontSize: "40px",
							marginBottom: "40px"
						},
						children: ["Final Score: ", score]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: startGame,
						style: btnStyle,
						children: "Nochmal Spielen"
					})
				]
			}),
			started && !gameOver && !isLocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					inset: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "rgba(0,0,0,0.6)",
					zIndex: 15,
					pointerEvents: "none"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						color: "white",
						fontSize: "40px",
						padding: "30px",
						border: "4px solid white",
						backgroundColor: "black",
						textTransform: "uppercase"
					},
					children: "Klicken um fortzufahren"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					if (document.pointerLockElement) document.exitPointerLock();
					if (onExit) onExit();
				},
				style: {
					...btnStyle,
					position: "absolute",
					top: 20,
					right: 20,
					fontSize: "16px",
					padding: "10px 20px",
					zIndex: 50
				},
				children: "Beenden"
			})
		]
	});
}
//#endregion
export { FaskaDoom as default };
