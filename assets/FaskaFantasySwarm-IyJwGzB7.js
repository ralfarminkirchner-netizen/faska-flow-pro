import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
//#region src/components/games/engines/FaskaFantasySwarm/FaskaFantasySwarm.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var WORDS = [
	"REACT",
	"CANVAS",
	"LOGIC",
	"PIXEL",
	"SWARM",
	"FASKA",
	"ROBOT",
	"MAGIC",
	"ARRAY",
	"STATE"
];
function shuffle(word) {
	let arr = word.split("");
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr.join("");
}
function FaskaFantasySwarm({ onExit }) {
	const [playerHp, setPlayerHp] = (0, import_react.useState)(100);
	const [enemyHp, setEnemyHp] = (0, import_react.useState)(300);
	const [menuState, setMenuState] = (0, import_react.useState)("main");
	const [message, setMessage] = (0, import_react.useState)("A wild SWARM BOSS appears!");
	const [anagram, setAnagram] = (0, import_react.useState)({
		word: "",
		scrambled: ""
	});
	const [inputValue, setInputValue] = (0, import_react.useState)("");
	const [screenShake, setScreenShake] = (0, import_react.useState)("");
	const [damageNumbers, setDamageNumbers] = (0, import_react.useState)([]);
	const canvasRef = (0, import_react.useRef)(null);
	const dmgIdRef = (0, import_react.useRef)(0);
	const isMounted = (0, import_react.useRef)(true);
	const timeouts = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
			timeouts.current.forEach(clearTimeout);
		};
	}, []);
	const safeTimeout = (0, import_react.useCallback)((cb, delay) => {
		const id = setTimeout(() => {
			if (isMounted.current) cb();
		}, delay);
		timeouts.current.push(id);
	}, []);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		let animationFrameId;
		const resize = () => {
			if (canvas.parentElement) {
				canvas.width = canvas.parentElement.clientWidth;
				canvas.height = canvas.parentElement.clientHeight;
			}
		};
		const observer = new ResizeObserver(() => resize());
		if (canvas.parentElement) observer.observe(canvas.parentElement);
		resize();
		const particles = Array.from({ length: 40 }).map(() => ({
			x: Math.random() * (canvas.width || 800),
			y: Math.random() * (canvas.height || 600),
			radius: Math.random() * 2 + 1,
			vx: (Math.random() - .5) * 1.5,
			vy: (Math.random() - .5) * 1.5,
			color: `hsl(${Math.random() * 60 + 200}, 100%, 60%)`
		}));
		let time = 0;
		const render = () => {
			time += .05;
			ctx.fillStyle = "rgba(10, 15, 35, 0.4)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			particles.forEach((p) => {
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
				if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
				ctx.fillStyle = p.color;
				ctx.fill();
			});
			const enemyX = canvas.width * .7;
			const enemyY = canvas.height * .4;
			ctx.save();
			ctx.translate(enemyX, enemyY + Math.sin(time) * 15);
			ctx.shadowBlur = 20;
			ctx.shadowColor = "#ff3355";
			ctx.fillStyle = "rgba(220, 40, 80, 0.9)";
			ctx.beginPath();
			ctx.arc(0, 0, 40 + Math.sin(time * 2) * 5, 0, Math.PI * 2);
			ctx.fill();
			ctx.shadowBlur = 0;
			for (let i = 0; i < 8; i++) {
				const sx = Math.cos(time * 1.5 + i * Math.PI / 4) * 80;
				const sy = Math.sin(time * 2 + i * Math.PI / 4) * 80;
				ctx.fillStyle = "#ff3355";
				ctx.beginPath();
				ctx.arc(sx, sy, 8, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.restore();
			const playerX = canvas.width * .25;
			const playerY = canvas.height * .6;
			ctx.save();
			ctx.translate(playerX, playerY + Math.cos(time) * 10);
			ctx.shadowBlur = 25;
			ctx.shadowColor = "#33ccff";
			ctx.fillStyle = "#33ccff";
			ctx.beginPath();
			ctx.moveTo(30, 0);
			ctx.lineTo(-20, -35);
			ctx.lineTo(-10, 0);
			ctx.lineTo(-20, 35);
			ctx.closePath();
			ctx.fill();
			ctx.strokeStyle = "#fff";
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.restore();
			animationFrameId = requestAnimationFrame(render);
		};
		render();
		return () => {
			observer.disconnect();
			cancelAnimationFrame(animationFrameId);
		};
	}, []);
	const spawnDamage = (amount, isPlayer, color) => {
		const id = dmgIdRef.current++;
		const x = isPlayer ? "25%" : "70%";
		const y = isPlayer ? "60%" : "40%";
		setDamageNumbers((prev) => [...prev, {
			id,
			amount,
			x,
			y,
			color
		}]);
		safeTimeout(() => {
			setDamageNumbers((prev) => prev.filter((d) => d.id !== id));
		}, 1e3);
	};
	const triggerScreenShake = (type) => {
		setScreenShake(type);
		safeTimeout(() => setScreenShake(""), 600);
	};
	const checkEndGame = (eHp, pHp) => {
		if (eHp <= 0) {
			setMenuState("game_over");
			setMessage("Victory! The Swarm is defeated.");
			return true;
		}
		if (pHp <= 0) {
			setMenuState("game_over");
			setMessage("Defeat... Faska collapsed.");
			return true;
		}
		return false;
	};
	const enemyTurn = () => {
		setMessage("Swarm Boss attacks!");
		safeTimeout(() => {
			triggerScreenShake("shake-light");
			const dmg = Math.floor(Math.random() * 15) + 10;
			setPlayerHp((prev) => {
				const next = Math.max(0, prev - dmg);
				if (!checkEndGame(enemyHp, next)) safeTimeout(() => {
					setMessage("What will Faska do?");
					setMenuState("main");
				}, 1200);
				return next;
			});
			spawnDamage(dmg, true, "#ff3333");
		}, 800);
	};
	const handleAttack = () => {
		setMenuState("enemy_turn");
		setMessage("Faska attacks!");
		triggerScreenShake("shake-light");
		safeTimeout(() => {
			const dmg = Math.floor(Math.random() * 15) + 20;
			setEnemyHp((prev) => {
				const next = Math.max(0, prev - dmg);
				if (!checkEndGame(next, playerHp)) safeTimeout(enemyTurn, 1e3);
				return next;
			});
			spawnDamage(dmg, false, "#ffffff");
		}, 500);
	};
	const startMagic = () => {
		const word = WORDS[Math.floor(Math.random() * WORDS.length)];
		let scrambled = shuffle(word);
		while (scrambled === word && word.length > 1) scrambled = shuffle(word);
		setAnagram({
			word,
			scrambled
		});
		setInputValue("");
		setMenuState("magic");
		setMessage(`Unscramble to cast magic: ${scrambled}`);
	};
	const castMagic = (e) => {
		e.preventDefault();
		if (inputValue.toUpperCase() === anagram.word) {
			setMessage(`Success! Faska casts ULTIMA!`);
			setMenuState("enemy_turn");
			triggerScreenShake("shake-heavy");
			safeTimeout(() => {
				const dmg = Math.floor(Math.random() * 25) + 60;
				setEnemyHp((prev) => {
					const next = Math.max(0, prev - dmg);
					if (!checkEndGame(next, playerHp)) safeTimeout(enemyTurn, 1500);
					return next;
				});
				spawnDamage(dmg, false, "#cc33ff");
				setPlayerHp((prev) => Math.min(100, prev + 20));
				spawnDamage("+20", true, "#33ff55");
			}, 800);
		} else {
			setMessage(`Spell failed! Incorrect word.`);
			setMenuState("enemy_turn");
			safeTimeout(enemyTurn, 1500);
		}
	};
	const handleItem = () => {
		setMenuState("enemy_turn");
		setMessage("Faska uses a Potion! Restored 40 HP.");
		safeTimeout(() => {
			setPlayerHp((prev) => Math.min(100, prev + 40));
			spawnDamage("+40", true, "#33ff55");
			safeTimeout(enemyTurn, 1e3);
		}, 500);
	};
	const resetGame = () => {
		setPlayerHp(100);
		setEnemyHp(300);
		setMenuState("main");
		setMessage("A wild SWARM BOSS appears!");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `faska-fantasy-swarm-container ${screenShake}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .faska-fantasy-swarm-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: #050510;
          font-family: "Courier New", Courier, monospace;
          user-select: none;
        }
        .faska-fantasy-swarm-container .ff-menu {
          background: linear-gradient(135deg, #000044, #000088);
          border: 3px solid #e0e0e0;
          border-radius: 6px;
          box-shadow: 0 0 0 2px #000, inset 0 0 0 2px #000;
          color: #fff;
          padding: 15px;
          box-sizing: border-box;
        }
        .faska-fantasy-swarm-container .exit-button {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 100;
          background: #cc2222;
          color: white;
          border: 2px solid white;
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: bold;
          font-family: inherit;
          cursor: pointer;
          box-shadow: 2px 2px 0 #000;
          transition: transform 0.1s;
        }
        .faska-fantasy-swarm-container .exit-button:active {
          transform: translate(2px, 2px);
          box-shadow: 0 0 0 #000;
        }
        .enemy-status {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 300px;
          z-index: 10;
        }
        .player-status {
          position: absolute;
          bottom: 160px;
          right: 20px;
          width: 250px;
          z-index: 10;
        }
        .hp-bar-bg {
          background: #333;
          height: 18px;
          width: 100%;
          border: 2px solid #111;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 8px;
        }
        .hp-bar-fill {
          background: #ff3333;
          height: 100%;
          transition: width 0.3s ease-out;
        }
        .hp-bar-fill.player-fill {
          background: #33ff55;
        }
        .bottom-ui {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 15px;
          width: 90%;
          max-width: 800px;
          z-index: 10;
        }
        .message-box {
          flex: 1;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          line-height: 1.4;
        }
        .action-menu {
          width: 200px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .action-menu button {
          background: transparent;
          border: none;
          color: white;
          text-align: left;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 5px 10px;
          font-family: inherit;
          position: relative;
        }
        .action-menu button:hover {
          background: rgba(255,255,255,0.15);
        }
        .action-menu button:before {
          content: '▶';
          position: absolute;
          left: -10px;
          opacity: 0;
        }
        .action-menu button:hover:before {
          opacity: 1;
        }
        .magic-form input {
          width: 100%;
          padding: 6px;
          margin: 10px 0;
          background: #000;
          border: 1px solid #fff;
          color: #fff;
          font-family: inherit;
          font-size: 1.2rem;
          text-transform: uppercase;
        }
        .scrambled-word {
          color: #ffcc00;
          font-weight: bold;
          letter-spacing: 2px;
        }
        .damage-number {
          position: absolute;
          font-size: 42px;
          font-weight: bold;
          animation: floatUp 1s ease-out forwards;
          pointer-events: none;
          text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000;
          z-index: 50;
        }
        @keyframes floatUp {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          20% { transform: translate(-50%, -100%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -150%) scale(1); opacity: 0; }
        }
        .shake-light {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        .shake-heavy {
          animation: shakeHeavy 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-2px, 0, 0); }
          20%, 80% { transform: translate3d(4px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-8px, 0, 0); }
          40%, 60% { transform: translate3d(8px, 0, 0); }
        }
        @keyframes shakeHeavy {
          10%, 90% { transform: translate3d(-5px, -5px, 0); }
          20%, 80% { transform: translate3d(10px, 5px, 0); }
          30%, 50%, 70% { transform: translate3d(-15px, -10px, 0); }
          40%, 60% { transform: translate3d(15px, 10px, 0); }
        }
      ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				style: {
					display: "block",
					width: "100%",
					height: "100%"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				className: "exit-button ui-element",
				children: "Beenden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "enemy-status ff-menu ui-element",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						style: { margin: "0 0 5px 0" },
						children: "SWARM BOSS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						"HP: ",
						enemyHp,
						"/300"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hp-bar-bg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hp-bar-fill",
							style: { width: `${enemyHp / 300 * 100}%` }
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "player-status ff-menu ui-element",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						style: { margin: "0 0 5px 0" },
						children: "FASKA"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						"HP: ",
						playerHp,
						"/100"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hp-bar-bg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hp-bar-fill player-fill",
							style: { width: `${playerHp / 100 * 100}%` }
						})
					})
				]
			}),
			damageNumbers.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "damage-number",
				style: {
					left: d.x,
					top: d.y,
					color: d.color
				},
				children: d.amount
			}, d.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bottom-ui ui-element",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "message-box ff-menu",
						children: message
					}),
					menuState === "main" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "action-menu ff-menu",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleAttack,
								children: "Attack"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: startMagic,
								children: "Magic"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleItem,
								children: "Item"
							})
						]
					}),
					menuState === "magic" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: castMagic,
						className: "action-menu ff-menu magic-form",
						style: { width: "250px" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									fontSize: "0.9rem",
									marginBottom: "5px"
								},
								children: ["Scrambled: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "scrambled-word",
									children: anagram.scrambled
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								autoFocus: true,
								value: inputValue,
								onChange: (e) => setInputValue(e.target.value),
								placeholder: "Type word..."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								children: "Cast!"
							})
						]
					}),
					menuState === "game_over" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "action-menu ff-menu",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: resetGame,
							children: "Replay"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onExit,
							children: "Exit"
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { FaskaFantasySwarm as default };
