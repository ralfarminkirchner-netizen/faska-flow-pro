import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as create } from "./react-B1iXS_n6.js";
//#region src/components/games/engines/FaskaZeldaSwarm/GameLogic.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var useGameStore = create((set, get) => ({
	phase: "playing",
	playerPos: {
		x: 400,
		y: 500
	},
	health: 6,
	maxHealth: 6,
	inventory: {
		keys: 0,
		bombs: 3
	},
	doors: [{
		id: "door1",
		x: 400,
		y: 100,
		open: false
	}],
	switches: [{
		id: "switch1",
		x: 200,
		y: 300,
		active: false
	}],
	chests: [{
		id: "chest1",
		x: 600,
		y: 300,
		open: false,
		question: "Capital of France?",
		answer: "paris"
	}, {
		id: "chest2",
		x: 600,
		y: 150,
		open: false,
		question: "Capital of Japan?",
		answer: "tokyo"
	}],
	activeQuiz: null,
	movePlayer: (dx, dy) => set((state) => {
		if (state.phase !== "playing") return state;
		let nx = state.playerPos.x + dx;
		let ny = state.playerPos.y + dy;
		nx = Math.max(36, Math.min(764, nx));
		ny = Math.max(36, Math.min(564, ny));
		const door = state.doors[0];
		if (!door.open) {
			if (nx > door.x - 40 && nx < door.x + 40 && ny < door.y + 20 && ny > door.y - 20) {
				if (state.inventory.keys > 0) return {
					playerPos: {
						x: nx,
						y: ny
					},
					doors: [{
						...door,
						open: true
					}],
					inventory: {
						...state.inventory,
						keys: state.inventory.keys - 1
					}
				};
				ny = state.playerPos.y;
			}
		}
		return { playerPos: {
			x: nx,
			y: ny
		} };
	}),
	interact: () => set((state) => {
		if (state.phase !== "playing") return state;
		const px = state.playerPos.x;
		const py = state.playerPos.y;
		let newSwitches = state.switches;
		const s = state.switches.find((s) => Math.hypot(s.x - px, s.y - py) < 50);
		if (s && !s.active) newSwitches = state.switches.map((sw) => sw.id === s.id ? {
			...sw,
			active: true
		} : sw);
		const c = state.chests.find((c) => Math.hypot(c.x - px, c.y - py) < 50);
		if (c && !c.open) return {
			phase: "quiz",
			activeQuiz: c,
			switches: newSwitches
		};
		return { switches: newSwitches };
	}),
	submitQuiz: (answer) => set((state) => {
		if (state.activeQuiz && answer.toLowerCase().trim() === state.activeQuiz.answer) return {
			phase: "playing",
			activeQuiz: null,
			chests: state.chests.map((c) => c.id === state.activeQuiz.id ? {
				...c,
				open: true
			} : c),
			inventory: {
				...state.inventory,
				keys: state.inventory.keys + 1
			}
		};
		return {
			phase: "playing",
			activeQuiz: null,
			health: Math.max(0, state.health - 1)
		};
	}),
	setPhase: (phase) => set({ phase }),
	resetGame: () => set({
		phase: "playing",
		playerPos: {
			x: 400,
			y: 500
		},
		health: 6,
		inventory: {
			keys: 0,
			bombs: 3
		},
		doors: [{
			id: "door1",
			x: 400,
			y: 100,
			open: false
		}],
		switches: [{
			id: "switch1",
			x: 200,
			y: 300,
			active: false
		}],
		chests: [{
			id: "chest1",
			x: 600,
			y: 300,
			open: false,
			question: "Capital of France?",
			answer: "paris"
		}, {
			id: "chest2",
			x: 600,
			y: 150,
			open: false,
			question: "Capital of Japan?",
			answer: "tokyo"
		}],
		activeQuiz: null
	})
}));
//#endregion
//#region src/components/games/engines/FaskaZeldaSwarm/World.jsx
var import_jsx_runtime = require_jsx_runtime();
function World() {
	const { doors, switches, chests } = useGameStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			top: 0,
			left: 0,
			width: "800px",
			height: "600px",
			backgroundColor: "#16162a"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundImage: "linear-gradient(#222244 1px, transparent 1px), linear-gradient(90deg, #222244 1px, transparent 1px)",
				backgroundSize: "40px 40px",
				opacity: .3
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				top: "0",
				left: "0",
				right: "0",
				height: "20px",
				background: "#0d0d1a",
				borderBottom: "2px solid #333388"
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				bottom: "0",
				left: "0",
				right: "0",
				height: "20px",
				background: "#0d0d1a",
				borderTop: "2px solid #333388"
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				top: "0",
				bottom: "0",
				left: "0",
				width: "20px",
				background: "#0d0d1a",
				borderRight: "2px solid #333388"
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				top: "0",
				bottom: "0",
				right: "0",
				width: "20px",
				background: "#0d0d1a",
				borderLeft: "2px solid #333388"
			} }),
			doors.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					left: d.x - 40,
					top: d.y - 20,
					width: "80px",
					height: "40px",
					backgroundColor: d.open ? "#050510" : "#8b1a1a",
					border: d.open ? "2px solid #33ff99" : "2px solid #cc2222",
					zIndex: 5
				},
				children: !d.open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
					position: "absolute",
					left: "50%",
					top: "50%",
					transform: "translate(-50%, -50%)",
					width: "12px",
					height: "16px",
					background: "#ffaa00"
				} })
			}, d.id)),
			switches.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				left: s.x - 15,
				top: s.y - 15,
				width: "30px",
				height: "30px",
				backgroundColor: s.active ? "#00ff66" : "#ff3333",
				borderRadius: "50%",
				border: "3px solid #fff",
				boxShadow: s.active ? "0 0 10px #00ff66" : "0 0 10px #ff3333",
				zIndex: 5
			} }, s.id)),
			chests.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					left: c.x - 20,
					top: c.y - 15,
					width: "40px",
					height: "30px",
					backgroundColor: c.open ? "#CD853F" : "#8B4513",
					border: "2px solid #DAA520",
					borderRadius: "4px",
					zIndex: 5
				},
				children: !c.open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
					width: "12px",
					height: "8px",
					background: "gold",
					margin: "10px auto"
				} })
			}, c.id))
		]
	});
}
//#endregion
//#region src/components/games/engines/FaskaZeldaSwarm/MobileJoystick.jsx
var joystickState = {
	x: 0,
	y: 0,
	action: false
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
					backgroundColor: "rgba(0,255,0,0.5)",
					border: "2px solid rgba(0,255,0,0.8)",
					color: "white",
					fontSize: "14px",
					fontWeight: "bold",
					pointerEvents: "auto",
					touchAction: "none"
				},
				onPointerDown: (e) => {
					e.target.setPointerCapture(e.pointerId);
					joystickState.action = true;
				},
				onPointerUp: (e) => {
					e.target.releasePointerCapture(e.pointerId);
					joystickState.action = false;
				},
				onPointerCancel: (e) => {
					e.target.releasePointerCapture(e.pointerId);
					joystickState.action = false;
				},
				children: "ACTION"
			})
		})]
	});
}
//#endregion
//#region src/components/games/engines/FaskaZeldaSwarm/Player.jsx
function Player() {
	const { playerPos, movePlayer, interact } = useGameStore();
	const requestRef = (0, import_react.useRef)();
	(0, import_react.useEffect)(() => {
		const keys = {};
		const handleKeyDown = (e) => {
			keys[e.key.toLowerCase()] = true;
			if (e.key === " ") interact();
		};
		const handleKeyUp = (e) => {
			keys[e.key.toLowerCase()] = false;
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		let lastAction = false;
		const update = () => {
			const speed = 5;
			let dx = joystickState.x;
			let dy = joystickState.y;
			if (keys["w"]) dy = -1;
			if (keys["s"]) dy = 1;
			if (keys["a"]) dx = -1;
			if (keys["d"]) dx = 1;
			if (dx !== 0 || dy !== 0) {
				const len = Math.hypot(dx, dy);
				dx /= len;
				dy /= len;
				movePlayer(dx * speed, dy * speed);
			}
			if (joystickState.action && !lastAction) interact();
			lastAction = joystickState.action;
			requestRef.current = requestAnimationFrame(update);
		};
		requestRef.current = requestAnimationFrame(update);
		return () => {
			cancelAnimationFrame(requestRef.current);
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [movePlayer, interact]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
		position: "absolute",
		left: playerPos.x,
		top: playerPos.y,
		width: "32px",
		height: "32px",
		backgroundColor: "#22cc88",
		transform: "translate(-50%, -50%)",
		borderRadius: "4px",
		border: "2px solid #fff",
		zIndex: 10
	} });
}
//#endregion
//#region src/components/games/engines/FaskaZeldaSwarm/UIOverlay.jsx
function UIOverlay({ onExit }) {
	const { health, maxHealth, inventory, phase, activeQuiz, submitQuiz } = useGameStore();
	const [answer, setAnswer] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			pointerEvents: "none",
			zIndex: 100
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				justifyContent: "space-between",
				padding: "20px",
				pointerEvents: "auto"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					padding: "10px 20px",
					background: "#e11d48",
					color: "white",
					border: "2px solid #fff",
					borderRadius: "8px",
					fontWeight: "bold",
					cursor: "pointer",
					boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
				},
				children: "EXIT"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					background: "rgba(0,0,0,0.7)",
					padding: "10px 20px",
					borderRadius: "8px",
					color: "white",
					display: "flex",
					gap: "30px",
					alignItems: "center",
					border: "2px solid #444"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: {
							color: "#ef4444",
							fontSize: "24px"
						},
						children: Array.from({ length: maxHealth }).map((_, i) => i < health ? "❤️" : "🖤").join(" ")
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							fontFamily: "monospace",
							fontSize: "20px",
							color: "#ffcc00"
						},
						children: ["🔑 ", inventory.keys]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							fontFamily: "monospace",
							fontSize: "20px",
							color: "#ff8800"
						},
						children: ["💣 ", inventory.bombs]
					})
				]
			})]
		}), phase === "quiz" && activeQuiz && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				background: "rgba(0,0,30,0.95)",
				border: "4px solid #00ffcc",
				padding: "40px",
				borderRadius: "16px",
				color: "white",
				textAlign: "center",
				pointerEvents: "auto",
				boxShadow: "0 0 40px rgba(0, 255, 204, 0.4)"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					style: {
						color: "#00ffcc",
						margin: "0 0 20px 0",
						fontSize: "28px"
					},
					children: "Learncade Puzzle"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						fontSize: "24px",
						margin: "20px 0"
					},
					children: activeQuiz.question
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: answer,
					onChange: (e) => setAnswer(e.target.value),
					style: {
						padding: "12px",
						fontSize: "20px",
						width: "250px",
						borderRadius: "8px",
						border: "none",
						textAlign: "center",
						outline: "none"
					},
					autoFocus: true,
					onKeyDown: (e) => {
						if (e.key === "Enter") {
							submitQuiz(answer);
							setAnswer("");
						}
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						submitQuiz(answer);
						setAnswer("");
					},
					style: {
						marginTop: "30px",
						padding: "12px 30px",
						background: "#00ffcc",
						color: "#000",
						fontWeight: "bold",
						fontSize: "18px",
						border: "none",
						borderRadius: "8px",
						cursor: "pointer"
					},
					children: "Submit Answer"
				})
			]
		})]
	});
}
//#endregion
//#region src/components/games/engines/FaskaZeldaSwarm/FaskaZeldaSwarm.jsx
function FaskaZeldaSwarm({ onExit }) {
	const { phase, resetGame } = useGameStore();
	(0, import_react.useEffect)(() => {
		resetGame();
	}, [resetGame]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100%",
			height: "100vh",
			position: "relative",
			backgroundColor: "#050510",
			overflow: "hidden",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					width: "800px",
					height: "600px",
					position: "relative",
					overflow: "hidden",
					boxShadow: "0 0 40px rgba(0,0,0,0.8)",
					border: "4px solid #333388",
					borderRadius: "8px"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UIOverlay, { onExit }),
			phase === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileJoystick, {})
		]
	});
}
//#endregion
export { FaskaZeldaSwarm as default };
