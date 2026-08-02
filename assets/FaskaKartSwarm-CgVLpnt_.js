const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/World-1HW8KKCI.js","assets/jsx-runtime-Be5yPkiZ.js","assets/react-three-fiber.esm-pJsmxxS9.js","assets/scheduler-BB0Rm0r-.js","assets/vanilla-DfQi-R7-.js","assets/react-B1iXS_n6.js"])))=>i.map(i=>d[i]);
import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __vitePreload } from "./index-B5O6y7xB.js";
import { Rt as Vector3, a as useFrame, s as useThree, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as Html } from "./Html-DIjoLRaS.js";
import { t as Sky } from "./Sky-ChwVjEVv.js";
import { t as PerspectiveCamera } from "./PerspectiveCamera-DlPG4WJK.js";
import { BananaPeel, ItemBox, Particles, Projectile, Track, getTrackPoint, getTrackT, n as ITEMS, r as useGameStore, t as COUNTRIES } from "./World-1HW8KKCI.js";
//#region src/components/games/engines/FaskaKartSwarm/MobileJoystick.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var kartJoystickState = {
	steer: 0,
	accel: 0,
	item: false,
	drift: false
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
		kartJoystickState.steer = 0;
		kartJoystickState.accel = 0;
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
		kartJoystickState.steer = dx / radius;
		kartJoystickState.accel = -(dy / radius);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			bottom: "50px",
			left: "50px",
			right: "50px",
			zIndex: 1e3,
			display: "flex",
			justifyContent: "space-between",
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
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				gap: "20px",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				style: {
					width: "70px",
					height: "70px",
					borderRadius: "50%",
					backgroundColor: "rgba(255,165,0,0.5)",
					border: "2px solid rgba(255,165,0,0.8)",
					color: "white",
					fontSize: "14px",
					fontWeight: "bold",
					pointerEvents: "auto",
					touchAction: "none"
				},
				onPointerDown: (e) => {
					e.target.setPointerCapture(e.pointerId);
					kartJoystickState.drift = true;
				},
				onPointerUp: (e) => {
					e.target.releasePointerCapture(e.pointerId);
					kartJoystickState.drift = false;
				},
				onPointerCancel: (e) => {
					e.target.releasePointerCapture(e.pointerId);
					kartJoystickState.drift = false;
				},
				children: "DRIFT"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				style: {
					width: "80px",
					height: "80px",
					borderRadius: "50%",
					backgroundColor: "rgba(255,0,0,0.5)",
					border: "2px solid rgba(255,0,0,0.8)",
					color: "white",
					fontSize: "14px",
					fontWeight: "bold",
					pointerEvents: "auto",
					touchAction: "none"
				},
				onPointerDown: (e) => {
					e.target.setPointerCapture(e.pointerId);
					kartJoystickState.item = true;
				},
				onPointerUp: (e) => {
					e.target.releasePointerCapture(e.pointerId);
					kartJoystickState.item = false;
				},
				onPointerCancel: (e) => {
					e.target.releasePointerCapture(e.pointerId);
					kartJoystickState.item = false;
				},
				children: "ITEM"
			})]
		})]
	});
}
//#endregion
//#region src/components/games/engines/FaskaKartSwarm/PlayerKart.jsx
var clamp$1 = (v, mn, mx) => Math.min(Math.max(v, mn), mx);
var useKeys = () => {
	const keys = (0, import_react.useRef)({});
	(0, import_react.useEffect)(() => {
		const down = (e) => {
			keys.current[e.code] = true;
		};
		const up = (e) => {
			keys.current[e.code] = false;
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
var KartMesh = ({ color, name, isPlayer, isDrifting, isHit }) => {
	const flashRef = (0, import_react.useRef)();
	useFrame(({ clock }) => {
		if (flashRef.current) if (isHit) flashRef.current.visible = Math.sin(clock.elapsedTime * 30) > 0;
		else flashRef.current.visible = true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: flashRef,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.4,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.8,
					.7,
					3.2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color,
					metalness: .3,
					roughness: .5
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.9,
					-.3
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.4,
					.5,
					1.6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
			}),
			[
				[
					-1,
					0,
					1.2
				],
				[
					1,
					0,
					1.2
				],
				[
					-1,
					0,
					-1.2
				],
				[
					1,
					0,
					-1.2
				]
			].map(([x, y, z], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					x,
					y,
					z
				],
				rotation: [
					0,
					0,
					Math.PI / 2
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.35,
					.35,
					.25,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
			}, i)),
			isDrifting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				position: [
					0,
					.5,
					-1.5
				],
				color: "#ff6600",
				intensity: 2,
				distance: 4
			}),
			isPlayer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
				position: [
					0,
					2.2,
					0
				],
				center: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						background: "rgba(0,0,0,0.7)",
						color: "#facc15",
						padding: "2px 8px",
						borderRadius: "6px",
						fontSize: "13px",
						fontWeight: "bold",
						whiteSpace: "nowrap",
						userSelect: "none",
						pointerEvents: "none"
					},
					children: "YOU"
				})
			})
		]
	});
};
var PlayerKart = ({ isLearncade }) => {
	const { camera } = useThree();
	const keys = useKeys();
	const groupRef = (0, import_react.useRef)();
	const cameraShake = (0, import_react.useRef)(0);
	const phase = useGameStore((s) => s.phase);
	const boostTimer = useGameStore((s) => s.boostTimer);
	const updateGame = useGameStore((s) => s.updateGame);
	const itemBoxes = useGameStore((s) => s.itemBoxes);
	const setItemBoxes = useGameStore((s) => s.setItemBoxes);
	const setBananas = useGameStore((s) => s.setBananas);
	const setProjectiles = useGameStore((s) => s.setProjectiles);
	const state = (0, import_react.useRef)({
		t: 0,
		laps: 0,
		speed: 0,
		rotation: Math.PI / 2,
		x: 80,
		z: 0,
		driftTimer: 0,
		driftBoostCharge: 0,
		driftDir: 0,
		isDrifting: false,
		isHit: false,
		hitTimer: 0,
		spinTimer: 0,
		itemUseCooldown: 0
	});
	const nextT = (0, import_react.useRef)(0);
	const useItem = (item, s) => {
		if (item === "boost") {
			updateGame({
				heldItem: null,
				boostTimer: 3
			});
			cameraShake.current = .3;
		} else if (item === "shell") {
			const dir = new Vector3(Math.sin(s.rotation), 0, Math.cos(s.rotation));
			setProjectiles((prev) => [...prev, {
				id: Date.now(),
				x: s.x + dir.x * 3,
				z: s.z + dir.z * 3,
				vx: dir.x,
				vz: dir.z,
				owner: "player"
			}]);
			updateGame({ heldItem: null });
		} else if (item === "banana") {
			const dir = new Vector3(Math.sin(s.rotation), 0, Math.cos(s.rotation));
			setBananas((prev) => [...prev, {
				id: Date.now(),
				x: s.x - dir.x * 3,
				z: s.z - dir.z * 3
			}]);
			updateGame({ heldItem: null });
		}
	};
	useFrame((_, delta) => {
		if (phase !== "racing" && phase !== "quiz") return;
		let dt = clamp$1(delta, .001, .08);
		if (phase === "quiz") dt *= .15;
		const s = state.current;
		const k = keys.current;
		if (s.hitTimer > 0) {
			s.hitTimer -= dt;
			s.isHit = true;
			s.spinTimer -= dt;
			if (s.spinTimer > 0) s.rotation += 8 * dt;
			if (s.hitTimer <= 0) s.isHit = false;
		}
		const isStunned = s.hitTimer > 0;
		const maxSpeed = isStunned ? 5 : s.isDrifting ? 22 : 28;
		const accel = isStunned ? 0 : 40;
		const friction = 18;
		const bSpeed = isStunned ? 0 : boostTimer > 0 ? 15 : 0;
		const accelInput = k["KeyW"] || k["ArrowUp"] ? 1 : k["KeyS"] || k["ArrowDown"] ? -1 : kartJoystickState.accel;
		if (!isStunned) if (accelInput > .1) s.speed = Math.min(s.speed + accel * accelInput * dt, maxSpeed + bSpeed);
		else if (accelInput < -.1) s.speed = Math.max(s.speed + accel * accelInput * dt, -12);
		else s.speed = s.speed > 0 ? Math.max(0, s.speed - friction * dt) : Math.min(0, s.speed + friction * dt);
		else s.speed *= .92;
		const steerInput = k["KeyA"] || k["ArrowLeft"] ? 1 : k["KeyD"] || k["ArrowRight"] ? -1 : -kartJoystickState.steer;
		const steerFactor = clamp$1(Math.abs(s.speed) / maxSpeed, 0, 1);
		const steerSpeed = 2.8;
		if (!isStunned) s.rotation += steerInput * steerSpeed * steerFactor * dt;
		const driftKey = k["ShiftLeft"] || k["ShiftRight"] || k["Space"] || kartJoystickState.drift;
		if (driftKey && steerInput !== 0 && Math.abs(s.speed) > 10 && !isStunned) {
			s.isDrifting = true;
			s.driftDir = steerInput > 0 ? 1 : -1;
			s.driftTimer += dt;
			s.driftBoostCharge = Math.min(s.driftBoostCharge + dt * .4, 1);
			s.rotation += s.driftDir * 1.2 * steerFactor * dt;
		} else if (s.isDrifting && !driftKey) {
			if (s.driftBoostCharge > .3) {
				updateGame({ boostTimer: s.driftBoostCharge * 2.5 });
				cameraShake.current = .4;
			}
			s.isDrifting = false;
			s.driftTimer = 0;
			s.driftBoostCharge = 0;
			s.driftDir = 0;
		} else if (!driftKey) s.isDrifting = false;
		if (boostTimer > 0) {
			updateGame({ boostTimer: Math.max(0, boostTimer - dt) });
			s.speed = Math.min(s.speed + 80 * dt, 45);
		}
		if (s.itemUseCooldown > 0) s.itemUseCooldown -= dt;
		if ((k["KeyE"] || k["KeyF"] || kartJoystickState.item) && s.itemUseCooldown <= 0) {
			const gs = useGameStore.getState();
			if (gs.heldItem && !gs.pendingCountry) {
				useItem(gs.heldItem, s);
				s.itemUseCooldown = .5;
				kartJoystickState.item = false;
			}
		}
		const dir = new Vector3(Math.sin(s.rotation), 0, Math.cos(s.rotation));
		s.x += dir.x * s.speed * dt;
		s.z += dir.z * s.speed * dt;
		const distFromCenter = Math.sqrt(s.x * s.x + s.z * s.z);
		const angle = Math.atan2(s.z, s.x);
		const trackDist = distFromCenter - 80;
		if (Math.abs(trackDist) > 18 / 2) {
			const push = (Math.abs(trackDist) - 18 / 2) * 3;
			s.x -= Math.cos(angle) * Math.sign(trackDist) * push * dt;
			s.z -= Math.sin(angle) * Math.sign(trackDist) * push * dt;
			s.speed *= .85;
		}
		const curT = getTrackT(new Vector3(s.x, 0, s.z));
		if (nextT.current > .85 && curT < .15) {
			s.laps += 1;
			if (s.laps >= 3) {
				useGameStore.getState();
				updateGame({
					phase: "won",
					laps: s.laps
				});
			} else updateGame({ laps: s.laps });
		}
		nextT.current = curT;
		s.t = curT;
		let hitItemBoxIndex = -1;
		itemBoxes.forEach((box, idx) => {
			if (!box.active) return;
			const dx = s.x - box.pos[0], dz = s.z - box.pos[2];
			if (Math.sqrt(dx * dx + dz * dz) < 2.5) hitItemBoxIndex = idx;
		});
		if (hitItemBoxIndex !== -1) {
			const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
			if (isLearncade) {
				const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
				updateGame({
					heldItem: item,
					pendingCountry: country,
					countryOptions: [
						country,
						COUNTRIES[(COUNTRIES.indexOf(country) + 1) % COUNTRIES.length],
						COUNTRIES[(COUNTRIES.indexOf(country) + 2) % COUNTRIES.length]
					].sort(() => Math.random() - .5),
					showCountryModal: true,
					phase: "quiz"
				});
			} else updateGame({ heldItem: item });
			setItemBoxes((prev) => {
				const next = [...prev];
				next[hitItemBoxIndex] = {
					...next[hitItemBoxIndex],
					active: false
				};
				setTimeout(() => setItemBoxes((p) => {
					const n2 = [...p];
					if (n2[hitItemBoxIndex]) n2[hitItemBoxIndex] = {
						...n2[hitItemBoxIndex],
						active: true
					};
					return n2;
				}), 5e3);
				return next;
			});
		}
		setBananas((prev) => prev.filter((b) => {
			const dx = s.x - b.x, dz = s.z - b.z;
			if (Math.sqrt(dx * dx + dz * dz) < 1.5 && s.hitTimer <= 0) {
				s.hitTimer = 2;
				s.spinTimer = 1.5;
				s.speed *= .3;
				cameraShake.current = .5;
				return false;
			}
			return true;
		}));
		setProjectiles((prev) => prev.filter((p) => {
			const dx = s.x - p.x, dz = s.z - p.z;
			if (Math.sqrt(dx * dx + dz * dz) < 2 && p.owner !== "player" && s.hitTimer <= 0) {
				s.hitTimer = 2.5;
				s.spinTimer = 2;
				s.speed *= .2;
				cameraShake.current = .6;
				return false;
			}
			return true;
		}));
		if (groupRef.current) {
			groupRef.current.position.set(s.x, 0, s.z);
			groupRef.current.rotation.y = s.rotation;
		}
		const shake = cameraShake.current > 0 ? (Math.random() - .5) * cameraShake.current * .8 : 0;
		cameraShake.current = Math.max(0, cameraShake.current - dt * 2);
		const camOffset = new Vector3(0, 5, -14);
		camOffset.applyAxisAngle(new Vector3(0, 1, 0), s.rotation);
		const idealCamPos = new Vector3(s.x + camOffset.x + shake, camOffset.y, s.z + camOffset.z + shake);
		camera.position.lerp(idealCamPos, .12);
		camera.lookAt(s.x, 1.5, s.z);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref: groupRef,
		position: [
			80,
			0,
			0
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KartMesh, {
			color: "#d97706",
			name: "YOU",
			isPlayer: true,
			isDrifting: state.current.isDrifting,
			isHit: state.current.isHit
		})
	});
};
//#endregion
//#region src/components/games/engines/FaskaKartSwarm/AIKart.jsx
var clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);
var lerp = (a, b, t) => a + (b - a) * t;
var AIKart = ({ index, color, name }) => {
	const groupRef = (0, import_react.useRef)();
	const phase = useGameStore((s) => s.phase);
	const setBananas = useGameStore((s) => s.setBananas);
	const setProjectiles = useGameStore((s) => s.setProjectiles);
	const state = (0, import_react.useRef)({
		t: (index + 1) * .07,
		x: Math.cos((index + 1) * .07 * Math.PI * 2) * 80,
		z: Math.sin((index + 1) * .07 * Math.PI * 2) * 80,
		rotation: (index + 1) * .07 * Math.PI * 2 + Math.PI / 2,
		speed: 18 + index * 1.5,
		targetT: (index + 1) * .07 + .02,
		fireTimer: 4 + index * 2.5,
		dropTimer: 6 + index * 3
	});
	useFrame((_, delta) => {
		if (phase !== "racing" && phase !== "quiz") return;
		let dt = clamp(delta, .001, .08);
		if (phase === "quiz") dt *= .15;
		const s = state.current;
		s.targetT = (s.t + .02) % 1;
		const target = getTrackPoint(s.targetT);
		const dx = target.x - s.x;
		const dz = target.z - s.z;
		let diff = Math.atan2(dx, dz) - s.rotation;
		while (diff > Math.PI) diff -= Math.PI * 2;
		while (diff < -Math.PI) diff += Math.PI * 2;
		s.rotation += diff * 5 * dt;
		const baseSpeed = 18 + index * 1.5;
		s.speed = lerp(s.speed, baseSpeed, .02);
		const dir = new Vector3(Math.sin(s.rotation), 0, Math.cos(s.rotation));
		s.x += dir.x * s.speed * dt;
		s.z += dir.z * s.speed * dt;
		s.t = getTrackT(new Vector3(s.x, 0, s.z));
		const distC = Math.sqrt(s.x * s.x + s.z * s.z);
		if (Math.abs(distC - 80) > 4) {
			const ang = Math.atan2(s.z, s.x);
			s.x = Math.cos(ang) * 80;
			s.z = Math.sin(ang) * 80;
		}
		if (groupRef.current) {
			groupRef.current.position.set(s.x, 0, s.z);
			groupRef.current.rotation.y = s.rotation;
		}
		s.fireTimer -= dt;
		if (s.fireTimer <= 0) {
			s.fireTimer = 8 + Math.random() * 8;
			setProjectiles((prev) => [...prev, {
				id: Date.now() + index * 100,
				x: s.x + dir.x * 3,
				z: s.z + dir.z * 3,
				vx: dir.x,
				vz: dir.z,
				owner: `ai_${index}`
			}]);
		}
		s.dropTimer -= dt;
		if (s.dropTimer <= 0) {
			s.dropTimer = 10 + Math.random() * 10;
			setBananas((prev) => [...prev, {
				id: Date.now() + index * 200,
				x: s.x - dir.x * 3,
				z: s.z - dir.z * 3
			}]);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: groupRef,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KartMesh, {
			color,
			name,
			isPlayer: false,
			isDrifting: false,
			isHit: false
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
			position: [
				0,
				2.2,
				0
			],
			center: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					background: "rgba(0,0,0,0.6)",
					color: "white",
					padding: "2px 6px",
					borderRadius: "5px",
					fontSize: "12px",
					whiteSpace: "nowrap",
					userSelect: "none",
					pointerEvents: "none"
				},
				children: name
			})
		})]
	});
};
//#endregion
//#region src/components/games/engines/FaskaKartSwarm/UIOverlay.jsx
function UIOverlay({ onExit }) {
	const { phase, laps, heldItem, pendingCountry, showCountryModal, countryOptions, wrongAnswer, boostTimer, raceTime, updateGame } = useGameStore();
	const handleCountryCorrect = () => {
		updateGame({
			showCountryModal: false,
			pendingCountry: null,
			countryAnswer: "",
			wrongAnswer: false,
			phase: "racing"
		});
	};
	const handleCountryWrong = () => {
		updateGame({
			wrongAnswer: true,
			countryAnswer: ""
		});
		setTimeout(() => updateGame({ wrongAnswer: false }), 600);
	};
	const handleRestart = () => {
		window.location.reload();
	};
	const mins = String(Math.floor(raceTime / 60)).padStart(2, "0");
	const secs = String(raceTime % 60).padStart(2, "0");
	const itemEmoji = {
		shell: "🐚",
		boost: "⚡",
		banana: "🍌"
	}[heldItem] || null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			inset: 0,
			pointerEvents: "none",
			zIndex: 10,
			fontFamily: "sans-serif"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 20,
					left: 20
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						fontSize: "28px",
						fontWeight: "bold",
						fontStyle: "italic",
						color: "#facc15",
						textShadow: "2px 2px 0 #000"
					},
					children: "🏎 FaskaKart Swarm"
				}), phase === "racing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						color: "white",
						fontSize: "16px",
						textShadow: "1px 1px 0 #000",
						marginTop: "4px"
					},
					children: [
						"Runde ",
						Math.min(laps + 1, 3),
						"/3"
					]
				})]
			}),
			phase === "racing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					top: 20,
					left: "50%",
					transform: "translateX(-50%)",
					background: "rgba(0,0,0,0.7)",
					color: "white",
					padding: "8px 20px",
					borderRadius: "10px",
					fontSize: "24px",
					fontWeight: "bold",
					border: "2px solid #94a3b8"
				},
				children: [
					"⏱ ",
					mins,
					":",
					secs
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					top: 20,
					right: 20,
					pointerEvents: "auto"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					style: {
						padding: "12px 24px",
						fontSize: "18px",
						fontWeight: "bold",
						background: "#ef4444",
						color: "white",
						border: "2px solid white",
						borderRadius: "8px",
						cursor: "pointer",
						boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
						textTransform: "uppercase"
					},
					onMouseOver: (e) => e.currentTarget.style.background = "#dc2626",
					onMouseOut: (e) => e.currentTarget.style.background = "#ef4444",
					children: "Beenden"
				})
			}),
			phase === "countdown" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					inset: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						fontSize: "140px",
						fontWeight: "bold",
						color: "#facc15",
						textShadow: "0 0 30px rgba(0,0,0,0.8), 4px 4px 0 #000",
						animation: "pulse 0.3s ease-in-out"
					},
					children: raceTime === 0 && laps === 0 && boostTimer === 0 ? "READY" : ""
				})
			}),
			phase === "racing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					bottom: 180,
					left: "50%",
					transform: "translateX(-50%)",
					display: "flex",
					gap: "24px",
					alignItems: "center"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: "rgba(0,0,0,0.75)",
							color: "white",
							padding: "10px 18px",
							borderRadius: "12px",
							fontSize: "22px",
							fontWeight: "bold",
							border: "2px solid #facc15"
						},
						children: [
							"🏁 Runde ",
							Math.min(laps + 1, 3),
							"/3"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							background: "rgba(0,0,0,0.75)",
							padding: "10px 18px",
							borderRadius: "12px",
							fontSize: "36px",
							border: "2px solid #6366f1",
							minWidth: "64px",
							textAlign: "center"
						},
						children: itemEmoji || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								fontSize: "22px",
								color: "#64748b"
							},
							children: "—"
						})
					}),
					boostTimer > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							background: "rgba(251,191,36,0.9)",
							color: "#111",
							padding: "10px 18px",
							borderRadius: "12px",
							fontSize: "22px",
							fontWeight: "bold"
						},
						children: "⚡ BOOST!"
					})
				]
			}),
			showCountryModal && pendingCountry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					inset: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "rgba(0,0,0,0.4)",
					zIndex: 50,
					pointerEvents: "auto"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						background: "linear-gradient(135deg, #1e3a5f, #0f172a)",
						border: wrongAnswer ? "4px solid #ef4444" : "4px solid #facc15",
						borderRadius: "20px",
						padding: "36px 44px",
						textAlign: "center",
						boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
						maxWidth: "420px",
						width: "90%",
						transition: "border-color 0.2s"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: "90px",
								lineHeight: 1,
								textShadow: "4px 4px 0 #000"
							},
							children: pendingCountry.flag
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							style: {
								color: "#facc15",
								fontSize: "26px",
								margin: "16px 0 8px",
								textShadow: "2px 2px 0 #000"
							},
							children: [{
								shell: "🐚",
								boost: "⚡",
								banana: "🍌"
							}[heldItem] || "❓", " Item erhalten!"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								color: "#cbd5e1",
								fontSize: "18px",
								margin: "0 0 20px",
								fontWeight: "bold"
							},
							children: "Welches Land zeigt diese Flagge?"
						}),
						wrongAnswer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								color: "#ef4444",
								fontSize: "16px",
								margin: "0 0 12px",
								fontWeight: "bold"
							},
							children: "❌ Falsch! Versuche es nochmal."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								display: "flex",
								flexDirection: "column",
								gap: "10px"
							},
							children: countryOptions && countryOptions.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									if (opt.name === pendingCountry.name) handleCountryCorrect();
									else handleCountryWrong();
								},
								style: {
									padding: "16px",
									fontSize: "20px",
									fontWeight: "bold",
									background: "#2563eb",
									color: "white",
									border: "2px solid #3b82f6",
									borderRadius: "12px",
									cursor: "pointer",
									boxShadow: "0 4px 0 #1d4ed8",
									transition: "all 0.1s"
								},
								children: opt.name
							}, i))
						})
					]
				})
			}),
			phase === "won" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					inset: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					background: "rgba(0,0,0,0.8)",
					zIndex: 50,
					pointerEvents: "auto"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: { fontSize: "80px" },
						children: "🏆"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						style: {
							color: "#facc15",
							fontSize: "52px",
							margin: "16px 0 8px",
							textShadow: "3px 3px 0 #000"
						},
						children: "ZIEL ERREICHT!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						style: {
							color: "#cbd5e1",
							fontSize: "24px",
							margin: "0 0 32px"
						},
						children: [
							"Zeit: ",
							mins,
							":",
							secs,
							"s"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: "16px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleRestart,
							style: {
								padding: "14px 32px",
								fontSize: "20px",
								fontWeight: "bold",
								background: "#16a34a",
								color: "white",
								border: "2px solid white",
								borderRadius: "10px",
								cursor: "pointer"
							},
							children: "Nochmal spielen"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onExit,
							style: {
								padding: "14px 32px",
								fontSize: "20px",
								fontWeight: "bold",
								background: "#ef4444",
								color: "white",
								border: "2px solid white",
								borderRadius: "10px",
								cursor: "pointer"
							},
							children: "Beenden"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes pulse {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
      ` })
		]
	});
}
//#endregion
//#region src/components/games/engines/FaskaKartSwarm/FaskaKartSwarm.jsx
var KART_COLORS = [
	"#e11d48",
	"#2563eb",
	"#16a34a",
	"#d97706"
];
var KART_NAMES = [
	"Rosi",
	"Bruno",
	"Kira",
	"PLAYER"
];
var Scene = ({ isLearncade }) => {
	const itemBoxes = useGameStore((s) => s.itemBoxes);
	const bananas = useGameStore((s) => s.bananas);
	const projectiles = useGameStore((s) => s.projectiles);
	const particles = useGameStore((s) => s.particles);
	const setProjectiles = useGameStore((s) => s.setProjectiles);
	const setParticles = useGameStore((s) => s.setParticles);
	useGameStore((s) => s.setItemBoxes);
	(0, import_react.useEffect)(() => {}, []);
	const removeProjectile = (0, import_react.useCallback)((id) => {
		setProjectiles((prev) => {
			const proj = prev.find((p) => p.id === id);
			if (proj) {
				const burst = Array.from({ length: 8 }, (_, i) => ({
					id: Date.now() + i,
					pos: [
						proj.x,
						.5 + Math.random(),
						proj.z
					],
					scale: Math.random() * .5 + .3,
					color: [
						"#ff6600",
						"#facc15",
						"#ef4444"
					][Math.floor(Math.random() * 3)]
				}));
				setParticles((old) => [...old, ...burst]);
				setTimeout(() => setParticles((old) => old.filter((p) => !burst.find((b) => b.id === p.id))), 600);
			}
			return prev.filter((p) => p.id !== id);
		});
	}, [setProjectiles, setParticles]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Track, {}),
		itemBoxes.map((box, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemBox, {
			index: i,
			pos: box.pos,
			active: box.active
		}, i)),
		bananas.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BananaPeel, { banana: b }, b.id)),
		projectiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Projectile, {
			proj: p,
			onHit: removeProjectile
		}, p.id)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Particles, { particles }),
		[
			0,
			1,
			2
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIKart, {
			index: i,
			color: KART_COLORS[i],
			name: KART_NAMES[i]
		}, i)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerKart, { isLearncade })
	] });
};
var FaskaKartSwarm = ({ onExit, isLearncade = true }) => {
	const phase = useGameStore((s) => s.phase);
	const updateGame = useGameStore((s) => s.updateGame);
	const reset = useGameStore((s) => s.reset);
	const setItemBoxes = useGameStore((s) => s.setItemBoxes);
	(0, import_react.useEffect)(() => {
		reset();
		__vitePreload(async () => {
			const { ITEM_BOX_POSITIONS } = await import("./World-1HW8KKCI.js");
			return { ITEM_BOX_POSITIONS };
		}, __vite__mapDeps([0,1,2,3,4,5])).then(({ ITEM_BOX_POSITIONS }) => {
			setItemBoxes(ITEM_BOX_POSITIONS.map((ib) => ({
				...ib,
				active: true
			})));
		});
		let count = 3;
		const tick = () => {
			count -= 1;
			if (count === 0) updateGame({ phase: "racing" });
			else setTimeout(tick, 1e3);
		};
		const t = setTimeout(tick, 1e3);
		return () => clearTimeout(t);
	}, [
		reset,
		setItemBoxes,
		updateGame
	]);
	(0, import_react.useEffect)(() => {
		if (phase !== "racing") return;
		const id = setInterval(() => {
			useGameStore.setState((prev) => ({ raceTime: prev.raceTime + 1 }));
		}, 1e3);
		return () => clearInterval(id);
	}, [phase]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100%",
			height: "100vh",
			position: "relative",
			overflow: "hidden",
			background: "#87ceeb"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
				shadows: true,
				gl: { antialias: true },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerspectiveCamera, {
						makeDefault: true,
						position: [
							80,
							8,
							-14
						],
						fov: 65
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sky, { sunPosition: [
						100,
						30,
						50
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
						position: [
							60,
							120,
							60
						],
						castShadow: true,
						intensity: 1.2,
						"shadow-mapSize": [2048, 2048],
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("orthographicCamera", {
							attach: "shadow-camera",
							args: [
								-200,
								200,
								200,
								-200
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, { isLearncade })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UIOverlay, { onExit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileJoystick, {}),
			phase === "racing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					bottom: 180,
					right: 20,
					color: "white",
					fontFamily: "sans-serif",
					fontSize: "14px",
					textShadow: "1px 1px 0 #000",
					textAlign: "right",
					pointerEvents: "none",
					zIndex: 10,
					lineHeight: "1.8"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: "#facc15" },
						children: "W/↑"
					}),
					" Gas \xA0",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: "#facc15" },
						children: "S/↓"
					}),
					" Bremse",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: "#facc15" },
						children: "A/D"
					}),
					" Lenken \xA0",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: "#facc15" },
						children: "Shift/Leertaste"
					}),
					" Drift",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: "#facc15" },
						children: "E/F"
					}),
					" Item benutzen"
				]
			})
		]
	});
};
//#endregion
export { FaskaKartSwarm as default };
