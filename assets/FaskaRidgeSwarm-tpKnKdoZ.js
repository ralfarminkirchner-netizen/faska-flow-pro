import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Lt as Vector2, Rt as Vector3, S as Color, a as useFrame, lt as Object3D, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as create } from "./react-B1iXS_n6.js";
import { t as Text } from "./Text-CuphjnHx.js";
//#region src/components/games/engines/FaskaRidgeSwarm/FaskaRidgeSwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var facts = [
	{
		text: "French Revolution began",
		correct: "1789",
		options: [
			"1776",
			"1789",
			"1812"
		]
	},
	{
		text: "First Moon Landing",
		correct: "1969",
		options: [
			"1957",
			"1969",
			"1972"
		]
	},
	{
		text: "End of World War II",
		correct: "1945",
		options: [
			"1939",
			"1918",
			"1945"
		]
	},
	{
		text: "Fall of the Berlin Wall",
		correct: "1989",
		options: [
			"1991",
			"1986",
			"1989"
		]
	},
	{
		text: "Invention of Printing Press",
		correct: "1440",
		options: [
			"1350",
			"1440",
			"1520"
		]
	},
	{
		text: "Columbus reached America",
		correct: "1492",
		options: [
			"1492",
			"1504",
			"1420"
		]
	},
	{
		text: "Magna Carta signed",
		correct: "1215",
		options: [
			"1180",
			"1215",
			"1250"
		]
	},
	{
		text: "Wright Brothers First Flight",
		correct: "1903",
		options: [
			"1898",
			"1903",
			"1910"
		]
	},
	{
		text: "Chernobyl Disaster",
		correct: "1986",
		options: [
			"1981",
			"1986",
			"1990"
		]
	},
	{
		text: "Sinking of the Titanic",
		correct: "1912",
		options: [
			"1905",
			"1912",
			"1920"
		]
	}
];
var useStore = create((set) => ({
	score: 0,
	currentFactIndex: 0,
	targetZ: -300,
	hitEvent: null,
	incScore: (pos) => set((state) => ({
		score: state.score + 100,
		hitEvent: {
			time: Date.now(),
			type: "correct",
			pos
		}
	})),
	wrongAnswer: (pos) => set((state) => ({ hitEvent: {
		time: Date.now(),
		type: "wrong",
		pos
	} })),
	nextFact: (playerZ) => set((state) => ({
		currentFactIndex: (state.currentFactIndex + 1) % facts.length,
		targetZ: playerZ - 500
	})),
	reset: () => set({
		score: 0,
		currentFactIndex: 0,
		targetZ: -300,
		hitEvent: null
	})
}));
function getTrackCenter(z) {
	return Math.sin(z / 150) * 80 + Math.sin(z / 300) * 60;
}
function useKeys() {
	const [keys, setKeys] = (0, import_react.useState)({
		w: false,
		a: false,
		s: false,
		d: false,
		space: false
	});
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			const code = e.code;
			if (code === "KeyW" || code === "ArrowUp") setKeys((k) => ({
				...k,
				w: true
			}));
			if (code === "KeyA" || code === "ArrowLeft") setKeys((k) => ({
				...k,
				a: true
			}));
			if (code === "KeyS" || code === "ArrowDown") setKeys((k) => ({
				...k,
				s: true
			}));
			if (code === "KeyD" || code === "ArrowRight") setKeys((k) => ({
				...k,
				d: true
			}));
			if (code === "Space") setKeys((k) => ({
				...k,
				space: true
			}));
		};
		const handleKeyUp = (e) => {
			const code = e.code;
			if (code === "KeyW" || code === "ArrowUp") setKeys((k) => ({
				...k,
				w: false
			}));
			if (code === "KeyA" || code === "ArrowLeft") setKeys((k) => ({
				...k,
				a: false
			}));
			if (code === "KeyS" || code === "ArrowDown") setKeys((k) => ({
				...k,
				s: false
			}));
			if (code === "KeyD" || code === "ArrowRight") setKeys((k) => ({
				...k,
				d: false
			}));
			if (code === "Space") setKeys((k) => ({
				...k,
				space: false
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
}
function Ground({ playerPos }) {
	const gridRef = (0, import_react.useRef)();
	useFrame(() => {
		if (gridRef.current) {
			gridRef.current.position.x = Math.floor(playerPos.current.x / 10) * 10;
			gridRef.current.position.z = Math.floor(playerPos.current.z / 10) * 10;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("gridHelper", {
		ref: gridRef,
		args: [
			1e3,
			100,
			"#ff00ff",
			"#001133"
		],
		position: [
			0,
			-.1,
			0
		]
	});
}
function EdgeMarkers({ playerPos }) {
	const count = 150;
	const spacing = 10;
	const meshRef = (0, import_react.useRef)();
	const dummy = (0, import_react.useMemo)(() => new Object3D(), []);
	useFrame(() => {
		if (!meshRef.current) return;
		const startZ = Math.floor(playerPos.current.z / spacing) * spacing;
		for (let i = 0; i < count; i++) {
			const z = startZ - i * spacing + 300;
			const x = getTrackCenter(z);
			dummy.position.set(x - 30, .5, z);
			dummy.updateMatrix();
			meshRef.current.setMatrixAt(i * 2, dummy.matrix);
			dummy.position.set(x + 30, .5, z);
			dummy.updateMatrix();
			meshRef.current.setMatrixAt(i * 2 + 1, dummy.matrix);
		}
		meshRef.current.instanceMatrix.needsUpdate = true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: meshRef,
		args: [
			void 0,
			void 0,
			count * 2
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			1,
			1,
			6
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#00ffff",
			emissive: "#00ffff",
			emissiveIntensity: 2
		})]
	});
}
function Environment({ playerPos }) {
	const count = 100;
	const range = 1500;
	const buildings = (0, import_react.useMemo)(() => {
		return Array.from({ length: count }, () => ({
			x: (Math.random() > .5 ? 1 : -1) * (Math.random() * 200 + 100),
			yScale: Math.random() * 80 + 30,
			zOffset: Math.random() * range,
			scaleX: Math.random() * 25 + 10,
			scaleZ: Math.random() * 25 + 10,
			color: Math.random() > .5 ? new Color("#ff00ff") : new Color("#00ffff")
		}));
	}, []);
	const meshRef = (0, import_react.useRef)();
	const dummy = (0, import_react.useMemo)(() => new Object3D(), []);
	useFrame(() => {
		if (!meshRef.current) return;
		buildings.forEach((b, i) => {
			let z = b.zOffset + playerPos.current.z % range;
			if (z > playerPos.current.z + 300) z -= range;
			if (z < playerPos.current.z - range + 300) z += range;
			dummy.position.set(b.x, b.yScale / 2, z);
			dummy.scale.set(b.scaleX, b.yScale, b.scaleZ);
			dummy.updateMatrix();
			meshRef.current.setMatrixAt(i, dummy.matrix);
			meshRef.current.setColorAt(i, b.color);
		});
		meshRef.current.instanceMatrix.needsUpdate = true;
		if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: meshRef,
		args: [
			void 0,
			void 0,
			count
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			1,
			1,
			1
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			wireframe: true,
			emissive: "#ffffff",
			emissiveIntensity: .2,
			color: "#ffffff"
		})]
	});
}
function Car({ playerPos }) {
	const keys = useKeys();
	const velocity = (0, import_react.useRef)(new Vector2(0, -50));
	const heading = (0, import_react.useRef)(0);
	const carRef = (0, import_react.useRef)();
	const hitEvent = useStore((state) => state.hitEvent);
	const screenShake = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (hitEvent) if (hitEvent.type === "wrong") {
			screenShake.current = 1;
			velocity.current.multiplyScalar(.4);
		} else {
			const currentDir = velocity.current.clone().normalize();
			const speed = velocity.current.length();
			velocity.current.copy(currentDir).multiplyScalar(Math.max(speed + 50, 100));
		}
	}, [hitEvent]);
	useFrame((state, delta) => {
		const dt = Math.min(delta, .1);
		const isDrifting = keys.space;
		const turnAmount = (keys.a ? 1 : 0) - (keys.d ? 1 : 0);
		heading.current += turnAmount * (isDrifting ? 3 : 1.5) * dt;
		const forward = new Vector2(-Math.sin(heading.current), -Math.cos(heading.current));
		if (keys.w) velocity.current.add(forward.clone().multiplyScalar(150 * dt));
		else if (keys.s) velocity.current.sub(forward.clone().multiplyScalar(80 * dt));
		const xCenter = getTrackCenter(playerPos.current.z);
		const friction = Math.abs(playerPos.current.x - xCenter) < 30 ? .98 : .9;
		velocity.current.multiplyScalar(friction);
		const currentSpeed = velocity.current.length();
		if (currentSpeed > 250) velocity.current.multiplyScalar(250 / currentSpeed);
		const currentDir = velocity.current.clone().normalize();
		if (currentSpeed > .1) {
			const grip = isDrifting ? .02 : .15;
			const newDir = currentDir.lerp(forward, grip).normalize();
			velocity.current.copy(newDir).multiplyScalar(currentSpeed);
		}
		playerPos.current.x += velocity.current.x * dt;
		playerPos.current.z += velocity.current.y * dt;
		if (carRef.current) {
			carRef.current.position.set(playerPos.current.x, 0, playerPos.current.z);
			carRef.current.rotation.y = heading.current;
			carRef.current.rotation.z = turnAmount * .1;
		}
		const back = forward.clone().multiplyScalar(-15);
		const cameraOffset = new Vector3(back.x, 7, back.y);
		const targetCamPos = playerPos.current.clone().add(cameraOffset);
		if (screenShake.current > 0) {
			targetCamPos.x += (Math.random() - .5) * screenShake.current * 4;
			targetCamPos.y += (Math.random() - .5) * screenShake.current * 4;
			screenShake.current -= dt * 3;
		}
		state.camera.position.lerp(targetCamPos, .1);
		const lookDir = currentSpeed > 10 ? velocity.current.clone().normalize() : forward;
		const lookAtPoint = playerPos.current.clone().add(new Vector3(lookDir.x * 30, -2, lookDir.y * 30));
		state.camera.lookAt(lookAtPoint);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: carRef,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.8,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					2.2,
					1,
					4.5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#ff00ff",
					emissive: "#aa00aa",
					emissiveIntensity: .2
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					1.5,
					.5
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.8,
					.8,
					2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#00ffff",
					emissive: "#00aaaa",
					emissiveIntensity: .1
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.8,
					.8,
					-2.3
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.5,
					.3,
					.1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#ffffff" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.8,
					.8,
					-2.3
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.5,
					.3,
					.1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#ffffff" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.8,
					.8,
					2.3
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.5,
					.3,
					.1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#ff0000" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.8,
					.8,
					2.3
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.5,
					.3,
					.1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#ff0000" })]
			}),
			[-1, 1].map((x) => [-1.4, 1.4].map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					x * 1.3,
					.4,
					z
				],
				rotation: [
					0,
					0,
					Math.PI / 2
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.5,
					.5,
					.4,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111111" })]
			}, `${x}-${z}`)))
		]
	});
}
function Token({ option, position }) {
	const meshRef = (0, import_react.useRef)();
	const groupRef = (0, import_react.useRef)();
	useFrame((state, delta) => {
		if (meshRef.current) {
			meshRef.current.rotation.y += delta;
			meshRef.current.rotation.x += delta * .5;
		}
		if (groupRef.current) groupRef.current.position.y = 3 + Math.sin(state.clock.elapsedTime * 3 + position[0]) * 1;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: groupRef,
		position,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				ref: meshRef,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					6,
					6,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#00ffff",
					emissive: "#00aaaa",
					emissiveIntensity: .5,
					wireframe: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				5.8,
				5.8,
				5.8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#000" })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				position: [
					0,
					0,
					3.1
				],
				fontSize: 2.5,
				color: "#ffffff",
				anchorX: "center",
				anchorY: "middle",
				children: option
			})
		]
	});
}
function Tokens({ z, playerPos }) {
	const xCenter = getTrackCenter(z);
	const fact = facts[useStore((state) => state.currentFactIndex)];
	const nextFact = useStore((state) => state.nextFact);
	const incScore = useStore((state) => state.incScore);
	const wrongAnswer = useStore((state) => state.wrongAnswer);
	const options = fact.options;
	const positions = [
		-20,
		0,
		20
	];
	const collidedTarget = (0, import_react.useRef)(0);
	useFrame(() => {
		if (playerPos.current.z < z && collidedTarget.current !== z) {
			collidedTarget.current = z;
			const carX = playerPos.current.x;
			let hitIndex = -1;
			for (let i = 0; i < 3; i++) {
				const tokenX = xCenter + positions[i];
				if (Math.abs(carX - tokenX) < 8) {
					hitIndex = i;
					break;
				}
			}
			const pos = [
				playerPos.current.x,
				playerPos.current.y,
				playerPos.current.z
			];
			if (hitIndex !== -1) if (options[hitIndex] === fact.correct) incScore(pos);
			else wrongAnswer(pos);
			else wrongAnswer(pos);
			nextFact(playerPos.current.z);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		position: [
			0,
			0,
			z
		],
		children: options.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Token, {
			option: opt,
			position: [
				xCenter + positions[i],
				0,
				0
			]
		}, i))
	});
}
function Billboard({ z }) {
	const x = getTrackCenter(z);
	const x2 = getTrackCenter(z - 10);
	const angle = Math.atan2(x - x2, 10);
	const fact = facts[useStore((state) => state.currentFactIndex)];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			x,
			15,
			z
		],
		rotation: [
			0,
			angle,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-15,
					-7.5,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.5,
					.5,
					15
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					15,
					-7.5,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.5,
					.5,
					15
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					44,
					15,
					2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#000",
					emissive: "#001122",
					emissiveIntensity: 1
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				position: [
					0,
					2,
					1.1
				],
				fontSize: 3,
				color: "#00ffff",
				anchorX: "center",
				anchorY: "middle",
				maxWidth: 40,
				textAlign: "center",
				children: fact.text
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				position: [
					0,
					-3,
					1.1
				],
				fontSize: 4,
				color: "#ffff00",
				anchorX: "center",
				anchorY: "middle",
				children: "[ YEAR ]"
			})
		]
	});
}
function Particles() {
	const hitEvent = useStore((state) => state.hitEvent);
	const meshRef = (0, import_react.useRef)();
	const particles = (0, import_react.useRef)(Array.from({ length: 60 }, () => ({
		pos: new Vector3(0, -1e3, 0),
		vel: new Vector3(),
		life: 0,
		type: "correct"
	})));
	(0, import_react.useEffect)(() => {
		if (hitEvent) {
			let spawned = 0;
			for (let i = 0; i < particles.current.length; i++) {
				const p = particles.current[i];
				if (p.life <= 0) {
					p.pos.fromArray(hitEvent.pos);
					p.vel.set((Math.random() - .5) * 50, Math.random() * 30 + 10, (Math.random() - .5) * 50);
					p.life = 1;
					p.type = hitEvent.type;
					spawned++;
					if (spawned >= 30) break;
				}
			}
		}
	}, [hitEvent]);
	const dummy = (0, import_react.useMemo)(() => new Object3D(), []);
	const colorCorrect = (0, import_react.useMemo)(() => new Color("#00ff00"), []);
	const colorWrong = (0, import_react.useMemo)(() => new Color("#ff0000"), []);
	useFrame((state, delta) => {
		if (!meshRef.current) return;
		const dt = Math.min(delta, .1);
		particles.current.forEach((p, i) => {
			if (p.life > 0) {
				p.pos.add(p.vel.clone().multiplyScalar(dt));
				p.vel.y -= 50 * dt;
				p.life -= dt;
				dummy.position.copy(p.pos);
				dummy.scale.setScalar(Math.max(0, p.life));
				dummy.updateMatrix();
				meshRef.current.setMatrixAt(i, dummy.matrix);
				meshRef.current.setColorAt(i, p.type === "correct" ? colorCorrect : colorWrong);
			} else {
				dummy.position.set(0, -1e3, 0);
				dummy.updateMatrix();
				meshRef.current.setMatrixAt(i, dummy.matrix);
			}
		});
		meshRef.current.instanceMatrix.needsUpdate = true;
		if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: meshRef,
		args: [
			void 0,
			void 0,
			60
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			1.5,
			1.5,
			1.5
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {})]
	});
}
function GameLoop() {
	const targetZ = useStore((state) => state.targetZ);
	const playerPos = (0, import_react.useRef)(new Vector3(0, 0, 0));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: ["#00020a"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
			attach: "fog",
			args: [
				"#00020a",
				50,
				400
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				100,
				200,
				50
			],
			intensity: 1
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { playerPos }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tokens, {
			z: targetZ,
			playerPos
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Billboard, { z: targetZ - 50 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EdgeMarkers, { playerPos }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Environment, { playerPos }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ground, { playerPos }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Particles, {})
	] });
}
function ScreenFlash() {
	const hitEvent = useStore((state) => state.hitEvent);
	const [flash, setFlash] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (hitEvent) {
			setFlash(hitEvent.type);
			const timer = setTimeout(() => setFlash(null), 300);
			return () => clearTimeout(timer);
		}
	}, [hitEvent]);
	if (!flash) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		backgroundColor: flash === "correct" ? "rgba(0, 255, 0, 0.3)" : "rgba(255, 0, 0, 0.5)",
		pointerEvents: "none",
		zIndex: 10
	} });
}
function UI({ onExit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			pointerEvents: "none",
			padding: "20px",
			boxSizing: "border-box"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					color: "#0ff",
					fontSize: "36px",
					fontFamily: "monospace",
					textShadow: "0 0 10px #0ff",
					fontWeight: "bold"
				},
				children: ["SCORE: ", useStore((state) => state.score)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					bottom: "20px",
					left: "20px",
					color: "#f0f",
					fontSize: "18px",
					fontFamily: "monospace",
					background: "rgba(0,0,0,0.6)",
					padding: "15px",
					borderRadius: "8px",
					border: "1px solid #f0f"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						style: { color: "#fff" },
						children: "CONTROLS:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"W/A/S/D or Arrows : Drive & Steer",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"SPACE : Drift"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					top: "20px",
					right: "20px",
					pointerEvents: "auto",
					padding: "10px 20px",
					fontSize: "18px",
					fontWeight: "bold",
					backgroundColor: "#ff00ff",
					color: "#fff",
					border: "2px solid #fff",
					borderRadius: "5px",
					cursor: "pointer",
					fontFamily: "monospace",
					textTransform: "uppercase",
					boxShadow: "0 0 15px #ff00ff"
				},
				children: "Beenden"
			})
		]
	});
}
function FaskaRidgeSwarm({ onExit }) {
	(0, import_react.useEffect)(() => {
		useStore.getState().reset();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100%",
			height: "100vh",
			position: "relative",
			overflow: "hidden",
			backgroundColor: "#000"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
				shadows: true,
				camera: {
					position: [
						0,
						10,
						20
					],
					fov: 60
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameLoop, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenFlash, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UI, { onExit })
		]
	});
}
//#endregion
export { FaskaRidgeSwarm as default };
