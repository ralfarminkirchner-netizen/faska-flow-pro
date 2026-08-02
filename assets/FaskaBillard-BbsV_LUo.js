import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, a as useFrame, t as Canvas } from "./react-three-fiber.esm-pJsmxxS9.js";
import { n as Line, t as Sparkles } from "./Sparkles-DQajTpFP.js";
import { a as Physics, o as RigidBody, r as CylinderCollider } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Environment } from "./Environment-CqP6Yhdo.js";
import { t as Text } from "./Text-CuphjnHx.js";
//#region src/components/games/engines/FaskaBillard/FaskaBillard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var BALL_RADIUS = .3;
var TABLE_WIDTH = 8;
var TABLE_LENGTH = 16;
var WALL_THICKNESS = .5;
var WALL_HEIGHT = .6;
var POCKET_RADIUS = .6;
var generateRack = () => {
	const positions = [];
	const letters = [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F"
	];
	const colors = [
		"#e74c3c",
		"#3498db",
		"#2ecc71",
		"#f1c40f",
		"#e67e22",
		"#9b59b6"
	];
	let idx = 0;
	const startZ = -4;
	const spacing = BALL_RADIUS * 2.05;
	for (let row = 0; row < 3; row++) for (let col = 0; col <= row; col++) {
		const x = (col - row / 2) * spacing;
		const z = startZ - row * spacing * .866;
		positions.push({
			id: letters[idx],
			letter: letters[idx],
			color: colors[idx],
			position: [
				x,
				BALL_RADIUS,
				z
			]
		});
		idx++;
	}
	return positions;
};
var ColoredBall = ({ position, color, letter }) => {
	const bodyRef = (0, import_react.useRef)();
	const textRef = (0, import_react.useRef)();
	useFrame(() => {
		if (bodyRef.current && textRef.current) {
			const pos = bodyRef.current.translation();
			textRef.current.position.set(pos.x, pos.y + BALL_RADIUS + .1, pos.z);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: bodyRef,
		position,
		colliders: "ball",
		restitution: .9,
		friction: .2,
		linearDamping: .8,
		angularDamping: .8,
		name: `ball-${letter}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				BALL_RADIUS,
				32,
				32
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .2,
				metalness: .1
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
		ref: textRef,
		fontSize: .4,
		color: "white",
		outlineWidth: .04,
		outlineColor: "black",
		rotation: [
			-Math.PI / 2,
			0,
			0
		],
		children: letter
	})] });
};
var CueBall = ({ cueBallRef, cuePosRef }) => {
	useFrame(() => {
		if (cueBallRef.current && cuePosRef.current) cuePosRef.current.copy(cueBallRef.current.translation());
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
		ref: cueBallRef,
		position: [
			0,
			BALL_RADIUS,
			4
		],
		colliders: "ball",
		restitution: .9,
		friction: .2,
		linearDamping: .8,
		angularDamping: .8,
		name: "cue",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				BALL_RADIUS,
				32,
				32
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "white",
				roughness: .2,
				metalness: .1
			})]
		})
	});
};
var AimLine = ({ dragStartRef, dragCurrentRef, cuePosRef }) => {
	const ref = (0, import_react.useRef)();
	useFrame(() => {
		if (dragStartRef.current && dragCurrentRef.current && cuePosRef.current && ref.current) {
			const dir = new Vector3().subVectors(dragStartRef.current, dragCurrentRef.current);
			dir.y = 0;
			const dist = dir.length();
			if (dist > .5) {
				dir.normalize().multiplyScalar(Math.min(dist * 2, 8));
				const start = cuePosRef.current.clone();
				start.y += BALL_RADIUS + .1;
				const end = start.clone().add(dir);
				ref.current.geometry.setPositions([
					start.x,
					start.y,
					start.z,
					end.x,
					end.y,
					end.z
				]);
				ref.current.visible = true;
			} else ref.current.visible = false;
		} else if (ref.current) ref.current.visible = false;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
		ref,
		points: [[
			0,
			0,
			0
		], [
			0,
			0,
			1
		]],
		color: "white",
		lineWidth: 3,
		dashed: true
	});
};
function FaskaBillard({ onExit }) {
	const [activeBalls, setActiveBalls] = (0, import_react.useState)(generateRack());
	const [nextLetter, setNextLetter] = (0, import_react.useState)("A");
	const [message, setMessage] = (0, import_react.useState)("Pot ball A!");
	const [explosions, setExplosions] = (0, import_react.useState)([]);
	const dragStartRef = (0, import_react.useRef)(null);
	const dragCurrentRef = (0, import_react.useRef)(null);
	const cueBallRef = (0, import_react.useRef)();
	const cuePosRef = (0, import_react.useRef)(new Vector3(0, BALL_RADIUS, 4));
	const nextLetterRef = (0, import_react.useRef)(nextLetter);
	(0, import_react.useEffect)(() => {
		nextLetterRef.current = nextLetter;
	}, [nextLetter]);
	const activeBallsRef = (0, import_react.useRef)(activeBalls);
	(0, import_react.useEffect)(() => {
		activeBallsRef.current = activeBalls;
	}, [activeBalls]);
	const triggerJuice = (type, position) => {
		const id = Date.now() + Math.random();
		const color = type === "success" ? "#2ecc71" : "#e74c3c";
		setExplosions((prev) => [...prev, {
			id,
			position,
			color
		}]);
		setTimeout(() => {
			setExplosions((prev) => prev.filter((e) => e.id !== id));
		}, 1e3);
	};
	const handlePocket = (e) => {
		const body = e.other.rigidBody;
		const name = e.other.rigidBodyObject?.name;
		if (!body || !name) return;
		if (name === "cue") {
			setMessage("Oops! Cue ball potted.");
			body.setTranslation({
				x: 0,
				y: BALL_RADIUS * 2,
				z: 4
			}, true);
			body.setLinvel({
				x: 0,
				y: 0,
				z: 0
			}, true);
			body.setAngvel({
				x: 0,
				y: 0,
				z: 0
			}, true);
			triggerJuice("error", body.translation());
			return;
		}
		if (name.startsWith("ball-")) {
			const letter = name.split("-")[1];
			if (activeBallsRef.current.find((b) => b.letter === letter)) if (letter === nextLetterRef.current) {
				setMessage(`Nice! Potted ${letter}.`);
				body.setTranslation({
					x: 100,
					y: -100,
					z: 100
				}, true);
				setActiveBalls((prev) => prev.filter((b) => b.letter !== letter));
				setNextLetter((prev) => {
					const nextCode = prev.charCodeAt(0) + 1;
					if (nextCode > "F".charCodeAt(0)) {
						setMessage("YOU WIN! Play again?");
						return "WIN";
					}
					return String.fromCharCode(nextCode);
				});
				triggerJuice("success", body.translation());
			} else {
				setMessage(`Wrong! You needed ${nextLetterRef.current}, not ${letter}.`);
				body.setTranslation({
					x: 0,
					y: BALL_RADIUS * 2,
					z: -2
				}, true);
				body.setLinvel({
					x: 0,
					y: 0,
					z: 0
				}, true);
				body.setAngvel({
					x: 0,
					y: 0,
					z: 0
				}, true);
				triggerJuice("error", body.translation());
			}
		}
	};
	const handleShoot = (start, end) => {
		if (!start || !end) return;
		const dir = new Vector3().subVectors(start, end);
		dir.y = 0;
		const dist = dir.length();
		if (dist < .5) return;
		let power = dist * 5;
		if (power > 30) power = 30;
		dir.normalize();
		if (cueBallRef.current) cueBallRef.current.applyImpulse({
			x: dir.x * power,
			y: 0,
			z: dir.z * power
		}, true);
	};
	const walls = (0, import_react.useMemo)(() => [
		{
			position: [
				0,
				WALL_HEIGHT / 2,
				-8.25
			],
			size: [
				6.4,
				WALL_HEIGHT,
				WALL_THICKNESS
			]
		},
		{
			position: [
				0,
				WALL_HEIGHT / 2,
				8.25
			],
			size: [
				6.4,
				WALL_HEIGHT,
				WALL_THICKNESS
			]
		},
		{
			position: [
				-4.25,
				WALL_HEIGHT / 2,
				-4
			],
			size: [
				WALL_THICKNESS,
				WALL_HEIGHT,
				6.4
			]
		},
		{
			position: [
				-4.25,
				WALL_HEIGHT / 2,
				4
			],
			size: [
				WALL_THICKNESS,
				WALL_HEIGHT,
				6.4
			]
		},
		{
			position: [
				4.25,
				WALL_HEIGHT / 2,
				-4
			],
			size: [
				WALL_THICKNESS,
				WALL_HEIGHT,
				6.4
			]
		},
		{
			position: [
				4.25,
				WALL_HEIGHT / 2,
				4
			],
			size: [
				WALL_THICKNESS,
				WALL_HEIGHT,
				6.4
			]
		}
	], []);
	const pockets = (0, import_react.useMemo)(() => [
		[
			-4,
			0,
			-8
		],
		[
			4,
			0,
			-8
		],
		[
			-4,
			0,
			0
		],
		[
			4,
			0,
			0
		],
		[
			-4,
			0,
			8
		],
		[
			4,
			0,
			8
		]
	], []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100%",
			height: "100vh",
			position: "relative",
			background: "#111"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
			shadows: true,
			camera: {
				position: [
					0,
					22,
					5
				],
				fov: 45,
				rotation: [
					-Math.PI / 2.5,
					0,
					0
				]
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
					attach: "background",
					args: ["#1a1a1a"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					position: [
						5,
						10,
						5
					],
					intensity: 1,
					castShadow: true,
					"shadow-mapSize": [2048, 2048]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Environment, { preset: "city" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: null,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
						gravity: [
							0,
							-20,
							0
						],
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
								type: "fixed",
								friction: .2,
								restitution: .5,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
									position: [
										0,
										-.25,
										0
									],
									receiveShadow: true,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
										TABLE_WIDTH + 1,
										.5,
										TABLE_LENGTH + 1
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#27ae60" })]
								})
							}),
							walls.map((wall, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
								type: "fixed",
								position: wall.position,
								restitution: .6,
								friction: .1,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
									receiveShadow: true,
									castShadow: true,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: wall.size }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2c3e50" })]
								})
							}, `wall-${i}`)),
							pockets.map((pos, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
								type: "fixed",
								position: pos,
								colliders: false,
								sensor: true,
								onIntersectionEnter: handlePocket,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CylinderCollider, {
									args: [.5, POCKET_RADIUS],
									position: [
										0,
										0,
										0
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
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
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [POCKET_RADIUS, 32] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#000" })]
								})]
							}, `pocket-${i}`)),
							activeBalls.map((ball) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColoredBall, { ...ball }, ball.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CueBall, {
								cueBallRef,
								cuePosRef
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					rotation: [
						-Math.PI / 2,
						0,
						0
					],
					position: [
						0,
						BALL_RADIUS,
						0
					],
					onPointerDown: (e) => {
						e.stopPropagation();
						dragStartRef.current = e.point.clone();
						dragCurrentRef.current = e.point.clone();
					},
					onPointerMove: (e) => {
						if (dragStartRef.current) {
							e.stopPropagation();
							dragCurrentRef.current = e.point.clone();
						}
					},
					onPointerUp: (e) => {
						if (dragStartRef.current) {
							e.stopPropagation();
							handleShoot(dragStartRef.current, e.point);
							dragStartRef.current = null;
							dragCurrentRef.current = null;
						}
					},
					onPointerOut: (e) => {
						if (dragStartRef.current) {
							e.stopPropagation();
							handleShoot(dragStartRef.current, dragCurrentRef.current);
							dragStartRef.current = null;
							dragCurrentRef.current = null;
						}
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [100, 100] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
						transparent: true,
						opacity: 0
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AimLine, {
					dragStartRef,
					dragCurrentRef,
					cuePosRef
				}),
				explosions.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
					position: [
						ex.position.x,
						ex.position.y + .5,
						ex.position.z
					],
					count: 50,
					scale: 2,
					color: ex.color,
					size: 4,
					speed: 2,
					opacity: 1,
					fade: true
				}, ex.id))
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				pointerEvents: "none",
				padding: "20px",
				boxSizing: "border-box",
				display: "flex",
				justifyContent: "space-between",
				fontFamily: "sans-serif"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { pointerEvents: "auto" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					style: {
						padding: "10px 20px",
						fontSize: "18px",
						cursor: "pointer",
						background: "#e74c3c",
						color: "white",
						border: "none",
						borderRadius: "5px",
						fontWeight: "bold",
						boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
					},
					children: "Beenden"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					textAlign: "center",
					background: "rgba(0,0,0,0.7)",
					padding: "15px 25px",
					borderRadius: "10px",
					color: "white",
					boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					style: {
						margin: 0,
						fontSize: "24px"
					},
					children: ["Target: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: "#f1c40f" },
						children: nextLetter === "WIN" ? "🏆" : nextLetter
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						margin: "8px 0 0 0",
						fontSize: "16px"
					},
					children: message
				})]
			})]
		})]
	});
}
//#endregion
export { FaskaBillard as default };
