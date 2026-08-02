import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Lt as Vector2, Rt as Vector3, a as useFrame, j as Euler, s as useThree, t as Canvas, yt as Raycaster } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as create } from "./react-B1iXS_n6.js";
import { a as Physics, o as RigidBody, t as CapsuleCollider } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { t as PointerLockControls } from "./PointerLockControls-LuZl7kld.js";
import { t as Billboard } from "./Billboard-CE57c09w.js";
import { t as Text } from "./Text-CuphjnHx.js";
//#region src/components/games/engines/FaskaDoomSwarm/GameLogic.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var AMMO_TYPES = {
	NOUN: {
		name: "Noun",
		color: "#ff0044",
		type: "noun"
	},
	VERB: {
		name: "Verb",
		color: "#0044ff",
		type: "verb"
	}
};
var WORDS = [
	{
		text: "Table",
		type: "noun"
	},
	{
		text: "Run",
		type: "verb"
	},
	{
		text: "Car",
		type: "noun"
	},
	{
		text: "Jump",
		type: "verb"
	},
	{
		text: "Apple",
		type: "noun"
	},
	{
		text: "Eat",
		type: "verb"
	},
	{
		text: "House",
		type: "noun"
	},
	{
		text: "Sleep",
		type: "verb"
	},
	{
		text: "Dog",
		type: "noun"
	},
	{
		text: "Write",
		type: "verb"
	},
	{
		text: "Mountain",
		type: "noun"
	},
	{
		text: "Fight",
		type: "verb"
	}
];
var useGameStore = create((set, get) => ({
	ammoType: AMMO_TYPES.NOUN,
	score: 0,
	health: 100,
	hitFlash: null,
	enemies: [],
	isLocked: false,
	enemyIdCounter: 0,
	cameraShake: 0,
	joystickMove: {
		x: 0,
		y: 0
	},
	isShooting: false,
	setAmmoType: (ammoType) => set({ ammoType }),
	toggleAmmo: () => set((state) => ({ ammoType: state.ammoType.type === "noun" ? AMMO_TYPES.VERB : AMMO_TYPES.NOUN })),
	setScore: (score) => set({ score }),
	setHealth: (health) => set({ health }),
	setHitFlash: (hitFlash) => set({ hitFlash }),
	setIsLocked: (isLocked) => set({ isLocked }),
	setJoystickMove: (move) => set({ joystickMove: move }),
	setIsShooting: (isShooting) => set({ isShooting }),
	spawnEnemy: () => {
		const { isLocked, enemies, enemyIdCounter } = get();
		if (enemies.length >= 15) return;
		const word = WORDS[Math.floor(Math.random() * WORDS.length)];
		const angle = Math.random() * Math.PI * 2;
		const dist = 30 + Math.random() * 15;
		const x = Math.cos(angle) * dist;
		const z = Math.sin(angle) * dist;
		set({
			enemies: [...enemies, {
				id: enemyIdCounter,
				type: word.type,
				word: word.text,
				position: [
					x,
					5,
					z
				]
			}],
			enemyIdCounter: enemyIdCounter + 1
		});
	},
	handleHitEnemy: (id, enemyType, hitPoint, triggerParticles) => {
		const { ammoType, setHitFlash, enemies } = get();
		if (enemyType === ammoType.type) {
			set((state) => ({
				enemies: state.enemies.filter((e) => e.id !== id),
				score: state.score + 100,
				hitFlash: "rgba(0, 255, 0, 0.2)"
			}));
			if (triggerParticles) triggerParticles(hitPoint, ammoType.color, 20, 15);
		} else {
			set({ hitFlash: "rgba(255, 0, 0, 0.3)" });
			if (triggerParticles) triggerParticles(hitPoint, "#ffffff", 5, 2);
		}
		setTimeout(() => set({ hitFlash: null }), 100);
	},
	handleMelee: (id) => {
		const { enemies, health } = get();
		const newHealth = health - 20 <= 0 ? 100 : health - 20;
		set({
			enemies: enemies.filter((e) => e.id !== id),
			health: newHealth,
			hitFlash: "rgba(255, 0, 0, 0.6)",
			cameraShake: .3
		});
		if (health - 20 <= 0) set({ score: 0 });
		setTimeout(() => set({ hitFlash: null }), 200);
	},
	shakeCamera: () => set({ cameraShake: .3 }),
	consumeCameraShake: (amount) => set((state) => ({ cameraShake: Math.max(0, state.cameraShake - amount) }))
}));
var globalState = { playerPosition: {
	x: 0,
	y: 5,
	z: 0
} };
//#endregion
//#region src/components/games/engines/FaskaDoomSwarm/Player.jsx
var import_jsx_runtime = require_jsx_runtime();
var PLAYER_SPEED = 18;
var JUMP_FORCE = 12;
var useKeys = () => {
	const [keys, setKeys] = import_react.useState({
		w: false,
		a: false,
		s: false,
		d: false,
		space: false
	});
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			const k = e.key.toLowerCase();
			if (k === " ") setKeys((p) => ({
				...p,
				space: true
			}));
			if ([
				"w",
				"a",
				"s",
				"d"
			].includes(k)) setKeys((p) => ({
				...p,
				[k]: true
			}));
		};
		const handleKeyUp = (e) => {
			const k = e.key.toLowerCase();
			if (k === " ") setKeys((p) => ({
				...p,
				space: false
			}));
			if ([
				"w",
				"a",
				"s",
				"d"
			].includes(k)) setKeys((p) => ({
				...p,
				[k]: false
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
function Player() {
	const ref = (0, import_react.useRef)();
	const { camera } = useThree();
	const keys = useKeys();
	const cameraShake = useGameStore((state) => state.cameraShake);
	const consumeCameraShake = useGameStore((state) => state.consumeCameraShake);
	const joystickMove = useGameStore((state) => state.joystickMove);
	useFrame(() => {
		if (!ref.current) return;
		const velocity = ref.current.linvel();
		const pos = ref.current.translation();
		globalState.playerPosition = {
			x: pos.x,
			y: pos.y,
			z: pos.z
		};
		let moveForward = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
		let moveRight = (keys.a ? 1 : 0) - (keys.d ? 1 : 0);
		if (Math.abs(joystickMove.y) > .05 || Math.abs(joystickMove.x) > .05) {
			moveForward = joystickMove.y;
			moveRight = joystickMove.x;
		}
		const frontVector = new Vector3(0, 0, moveForward);
		const sideVector = new Vector3(moveRight, 0, 0);
		const direction = new Vector3().subVectors(frontVector, sideVector).normalize().multiplyScalar(PLAYER_SPEED);
		const euler = new Euler(0, camera.rotation.y, 0, "YXZ");
		direction.applyEuler(euler);
		ref.current.setLinvel({
			x: direction.x,
			y: velocity.y,
			z: direction.z
		}, true);
		if (keys.space && Math.abs(velocity.y) < .1) ref.current.applyImpulse({
			x: 0,
			y: JUMP_FORCE,
			z: 0
		}, true);
		let shakeX = 0;
		let shakeY = 0;
		if (cameraShake > 0) {
			shakeX = (Math.random() - .5) * cameraShake;
			shakeY = (Math.random() - .5) * cameraShake;
			consumeCameraShake(.02);
		}
		camera.position.set(pos.x + shakeX, pos.y + .6 + shakeY, pos.z);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref,
		colliders: false,
		mass: 1,
		position: [
			0,
			10,
			0
		],
		lockRotations: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CapsuleCollider, { args: [.5, .5] })
	});
}
//#endregion
//#region src/components/games/engines/FaskaDoomSwarm/World.jsx
var ENEMY_SPEED = 6;
function Enemy({ data }) {
	const ref = (0, import_react.useRef)();
	const handleMelee = useGameStore((state) => state.handleMelee);
	useFrame(() => {
		if (!ref.current) return;
		const pos = ref.current.translation();
		const playerPos = globalState.playerPosition;
		const target = new Vector3(playerPos.x, pos.y, playerPos.z);
		const currentPos = new Vector3(pos.x, pos.y, pos.z);
		if (currentPos.distanceTo(target) < 2) {
			handleMelee(data.id);
			return;
		}
		const direction = new Vector3().subVectors(target, currentPos).normalize();
		const currentVel = ref.current.linvel();
		ref.current.setLinvel({
			x: direction.x * ENEMY_SPEED,
			y: currentVel.y,
			z: direction.z * ENEMY_SPEED
		}, true);
	});
	const color = data.type === "noun" ? AMMO_TYPES.NOUN.color : AMMO_TYPES.VERB.color;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		ref,
		position: data.position,
		colliders: "hull",
		lockRotations: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				userData: {
					isEnemy: true,
					id: data.id,
					type: data.type
				},
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					1.5,
					16,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color,
					transparent: true,
					opacity: .4,
					emissive: color,
					emissiveIntensity: .8
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1,
					1,
					1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111111" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Billboard, {
				position: [
					0,
					2,
					0
				],
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					fontSize: .8,
					color,
					outlineWidth: .05,
					outlineColor: "#000",
					fontWeight: "bold",
					children: data.word
				})
			})
		]
	});
}
function Particle({ data, onRemove }) {
	const ref = (0, import_react.useRef)();
	const materialRef = (0, import_react.useRef)();
	useFrame((_, delta) => {
		if (!ref.current) return;
		ref.current.position.add(data.velocity.clone().multiplyScalar(delta));
		data.life -= delta;
		if (data.life <= 0) onRemove();
		else if (materialRef.current) materialRef.current.opacity = data.life / data.maxLife;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref,
		position: data.position,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			.3,
			.3,
			.3
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			ref: materialRef,
			color: data.color,
			transparent: true,
			emissive: data.color,
			emissiveIntensity: 2
		})]
	});
}
var ParticleSystem = (0, import_react.forwardRef)((props, ref) => {
	const [particles, setParticles] = (0, import_react.useState)([]);
	const particleIdCounter = (0, import_react.useRef)(0);
	(0, import_react.useImperativeHandle)(ref, () => ({ trigger: (position, color, count, speed) => {
		const newParticles = [];
		for (let i = 0; i < count; i++) newParticles.push({
			id: particleIdCounter.current++,
			position: position.clone(),
			velocity: new Vector3((Math.random() - .5) * speed, (Math.random() - .5) * speed + speed * .5, (Math.random() - .5) * speed),
			color,
			life: .2 + Math.random() * .4,
			maxLife: .6
		});
		setParticles((prev) => [...prev, ...newParticles]);
	} }));
	const removeParticle = (0, import_react.useCallback)((id) => {
		setParticles((prev) => prev.filter((p) => p.id !== id));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: particles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Particle, {
		data: p,
		onRemove: () => removeParticle(p.id)
	}, p.id)) });
});
function Level() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-1,
					0
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					100,
					2,
					100
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#2a2a2a",
					roughness: .9
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					2,
					-20
				],
				receiveShadow: true,
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					10,
					4,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#444444" })]
			})
		}),
		[...Array(8)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					i * .5 - .25,
					-14 + i * .75
				],
				receiveShadow: true,
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					4,
					.5,
					2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#555555" })]
			})
		}, `stair-${i}`)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-30,
					8,
					-30
				],
				receiveShadow: true,
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					20,
					16,
					20
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#223344" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					20,
					4,
					-10
				],
				receiveShadow: true,
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					2,
					8,
					30
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#442222" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			position: [
				0,
				10,
				-50
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				100,
				20,
				2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			position: [
				0,
				10,
				50
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				100,
				20,
				2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			position: [
				-50,
				10,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2,
				20,
				100
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			position: [
				50,
				10,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2,
				20,
				100
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })] })
		})
	] });
}
function Shooter({ particleSystemRef }) {
	const { camera, scene } = useThree();
	const isLocked = useGameStore((state) => state.isLocked);
	useGameStore((state) => state.ammoType);
	const handleHitEnemy = useGameStore((state) => state.handleHitEnemy);
	const shakeCamera = useGameStore((state) => state.shakeCamera);
	const isShooting = useGameStore((state) => state.isShooting);
	const setIsShooting = useGameStore((state) => state.setIsShooting);
	const fire = (0, import_react.useCallback)(() => {
		const raycaster = new Raycaster();
		raycaster.setFromCamera(new Vector2(0, 0), camera);
		shakeCamera();
		camera.rotation.x += .02;
		const intersects = raycaster.intersectObjects(scene.children, true);
		const hitObj = intersects.find((hit) => hit.object.userData?.isEnemy);
		const triggerParticles = (pos, col, c, s) => {
			if (particleSystemRef.current) particleSystemRef.current.trigger(pos, col, c, s);
		};
		if (hitObj) {
			const enemyData = hitObj.object.userData;
			handleHitEnemy(enemyData.id, enemyData.type, hitObj.point, triggerParticles);
		} else if (intersects.length > 0) triggerParticles(intersects[0].point, "#ffffff", 5, 5);
	}, [
		camera,
		scene,
		shakeCamera,
		handleHitEnemy,
		particleSystemRef
	]);
	(0, import_react.useEffect)(() => {
		if (isShooting) {
			fire();
			setIsShooting(false);
		}
	}, [
		isShooting,
		fire,
		setIsShooting
	]);
	(0, import_react.useEffect)(() => {
		const handleMouseDown = (e) => {
			if (!isLocked) return;
			if (e.button !== 0) return;
			fire();
		};
		window.addEventListener("mousedown", handleMouseDown);
		return () => window.removeEventListener("mousedown", handleMouseDown);
	}, [isLocked, fire]);
	return null;
}
function World() {
	const enemies = useGameStore((state) => state.enemies);
	const particleSystemRef = (0, import_react.useRef)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Level, {}),
		enemies.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Enemy, { data: e }, e.id)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParticleSystem, { ref: particleSystemRef }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shooter, { particleSystemRef })
	] });
}
//#endregion
//#region src/components/games/engines/FaskaDoomSwarm/UIOverlay.jsx
function UIOverlay({ onExit }) {
	const score = useGameStore((state) => state.score);
	const health = useGameStore((state) => state.health);
	const ammoType = useGameStore((state) => state.ammoType);
	const isLocked = useGameStore((state) => state.isLocked);
	const hitFlash = useGameStore((state) => state.hitFlash);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		hitFlash && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
			position: "absolute",
			inset: 0,
			backgroundColor: hitFlash,
			pointerEvents: "none",
			zIndex: 10
		} }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				pointerEvents: "none",
				zIndex: 20
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				width: 8,
				height: 8,
				backgroundColor: ammoType.color,
				borderRadius: "50%",
				boxShadow: "0 0 8px white"
			} })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: 20,
				left: 20,
				color: "white",
				zIndex: 30,
				fontFamily: "monospace",
				textShadow: "2px 2px 4px #000",
				pointerEvents: "none"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					style: {
						margin: "0 0 10px 0",
						fontSize: "32px",
						color: "#ffcc00"
					},
					children: "FaskaDoomSwarm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					style: {
						margin: "5px 0",
						fontSize: "24px"
					},
					children: ["Score: ", score]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					style: {
						margin: "5px 0",
						fontSize: "24px",
						color: health > 30 ? "#00ff00" : "#ff0000"
					},
					children: ["Health: ", health]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					style: {
						margin: "15px 0 5px 0",
						fontSize: "22px",
						color: ammoType.color,
						fontWeight: "bold",
						backgroundColor: "rgba(0,0,0,0.5)",
						padding: "5px",
						borderRadius: "4px",
						display: "inline-block"
					},
					children: [
						"Ammo: ",
						ammoType.name,
						" (Q to swap)"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						margin: "5px 0",
						fontSize: "14px",
						opacity: .9
					},
					children: "Match ammo color to enemy shield color!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						margin: "5px 0",
						fontSize: "14px",
						opacity: .7
					},
					children: "WASD: Move | SPACE: Jump | Click: Shoot"
				})
			]
		}),
		!isLocked && !("ontouchstart" in window) && !(navigator.maxTouchPoints > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				inset: 0,
				pointerEvents: "none",
				backgroundColor: "rgba(0,0,0,0.6)",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 25,
				color: "white",
				fontFamily: "monospace"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				style: {
					fontSize: "48px",
					margin: "0 0 20px 0",
					textShadow: "2px 2px 0 #f00"
				},
				children: "CLICK TO START"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: { fontSize: "20px" },
				children: "Press ESC to pause and show mouse"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			style: {
				position: "absolute",
				top: 20,
				right: 20,
				zIndex: 40,
				padding: "12px 24px",
				fontSize: "18px",
				fontWeight: "bold",
				backgroundColor: "#ff2222",
				color: "white",
				border: "2px solid white",
				borderRadius: "8px",
				cursor: "pointer",
				boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
				fontFamily: "monospace",
				pointerEvents: "auto"
			},
			children: "Beenden"
		})
	] });
}
//#endregion
//#region src/components/games/engines/FaskaDoomSwarm/MobileJoystick.jsx
function MobileJoystick() {
	const setJoystickMove = useGameStore((state) => state.setJoystickMove);
	const setIsShooting = useGameStore((state) => state.setIsShooting);
	const toggleAmmo = useGameStore((state) => state.toggleAmmo);
	const setIsLocked = useGameStore((state) => state.setIsLocked);
	const joystickRef = (0, import_react.useRef)(null);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [stickPos, setStickPos] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const maxRadius = 40;
	(0, import_react.useEffect)(() => {
		if ("ontouchstart" in window || navigator.maxTouchPoints > 0) setIsLocked(true);
	}, [setIsLocked]);
	const handleTouchStart = (e) => {
		setIsDragging(true);
		updateStickPosition(e.touches[0]);
	};
	const handleTouchMove = (e) => {
		if (!isDragging) return;
		updateStickPosition(e.touches[0]);
	};
	const handleTouchEnd = () => {
		setIsDragging(false);
		setStickPos({
			x: 0,
			y: 0
		});
		setJoystickMove({
			x: 0,
			y: 0
		});
	};
	const updateStickPosition = (touch) => {
		if (!joystickRef.current) return;
		const rect = joystickRef.current.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		let deltaX = touch.clientX - centerX;
		let deltaY = touch.clientY - centerY;
		const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		if (distance > maxRadius) {
			deltaX = deltaX / distance * maxRadius;
			deltaY = deltaY / distance * maxRadius;
		}
		setStickPos({
			x: deltaX,
			y: deltaY
		});
		setJoystickMove({
			x: -(deltaX / maxRadius),
			y: deltaY / maxRadius
		});
	};
	const [isTouchDevice, setIsTouchDevice] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
	}, []);
	if (!isTouchDevice) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			bottom: 20,
			left: 20,
			right: 20,
			zIndex: 50,
			display: "flex",
			justifyContent: "space-between",
			pointerEvents: "none"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: joystickRef,
			onTouchStart: handleTouchStart,
			onTouchMove: handleTouchMove,
			onTouchEnd: handleTouchEnd,
			onTouchCancel: handleTouchEnd,
			style: {
				width: 120,
				height: 120,
				borderRadius: "50%",
				backgroundColor: "rgba(255,255,255,0.2)",
				position: "relative",
				pointerEvents: "auto",
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				width: 50,
				height: 50,
				borderRadius: "50%",
				backgroundColor: "rgba(255,255,255,0.6)",
				transform: `translate(${stickPos.x}px, ${stickPos.y}px)`
			} })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				gap: "10px",
				alignItems: "flex-end",
				pointerEvents: "auto"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => toggleAmmo(),
				style: {
					width: 70,
					height: 70,
					borderRadius: "50%",
					backgroundColor: "rgba(0,0,255,0.5)",
					color: "white",
					fontWeight: "bold",
					border: "2px solid white"
				},
				children: "SWAP"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onTouchStart: (e) => {
					e.preventDefault();
					setIsShooting(true);
				},
				onClick: () => setIsShooting(true),
				style: {
					width: 90,
					height: 90,
					borderRadius: "50%",
					backgroundColor: "rgba(255,0,0,0.5)",
					color: "white",
					fontWeight: "bold",
					border: "2px solid white"
				},
				children: "FIRE"
			})]
		})]
	});
}
//#endregion
//#region src/components/games/engines/FaskaDoomSwarm/FaskaDoomSwarm.jsx
function FaskaDoomSwarm({ onExit }) {
	const setIsLocked = useGameStore((state) => state.setIsLocked);
	const setAmmoType = useGameStore((state) => state.setAmmoType);
	const spawnEnemy = useGameStore((state) => state.spawnEnemy);
	const toggleAmmo = useGameStore((state) => state.toggleAmmo);
	(0, import_react.useEffect)(() => {
		const interval = setInterval(() => {
			spawnEnemy();
		}, 1500);
		return () => clearInterval(interval);
	}, [spawnEnemy]);
	(0, import_react.useEffect)(() => {
		const handleSwitch = (e) => {
			const k = e.key.toLowerCase();
			if (k === "1") setAmmoType(AMMO_TYPES.NOUN);
			if (k === "2") setAmmoType(AMMO_TYPES.VERB);
			if (k === "q") toggleAmmo();
		};
		window.addEventListener("keydown", handleSwitch);
		return () => window.removeEventListener("keydown", handleSwitch);
	}, [setAmmoType, toggleAmmo]);
	const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100%",
			height: "100vh",
			overflow: "hidden",
			backgroundColor: "#000",
			userSelect: "none"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
				shadows: true,
				camera: { fov: 80 },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, {
						sunPosition: [
							100,
							20,
							100
						],
						turbidity: .1,
						rayleigh: .1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .4 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
						position: [
							20,
							30,
							20
						],
						intensity: 1.5,
						castShadow: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
						gravity: [
							0,
							-30,
							0
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {})]
					}),
					!isTouch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PointerLockControls, {
						onLock: () => setIsLocked(true),
						onUnlock: () => setIsLocked(false)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UIOverlay, { onExit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileJoystick, {})
		]
	});
}
//#endregion
export { FaskaDoomSwarm as default };
