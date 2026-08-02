import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/components/games/engines/FaskaUno/FaskaUno.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var COLORS = {
	Red: 16729156,
	Blue: 4474111,
	Green: 4521796,
	Yellow: 16763904
};
var SHAPES = [
	"Circle",
	"Square",
	"Triangle"
];
var NUMBERS = [
	1,
	2,
	3,
	4,
	5
];
var MainScene = class extends __webpack_exports__default.Scene {
	constructor() {
		super("MainScene");
	}
	create() {
		this.cameras.main.setBackgroundColor("#2d6a4f");
		const g = this.make.graphics({
			x: 0,
			y: 0
		}, false);
		g.fillStyle(16777215);
		g.fillCircle(4, 4, 4);
		g.generateTexture("particle", 8, 8);
		g.destroy();
		this.deck = this.generateDeck();
		this.shuffleDeck(this.deck);
		this.playerHand = [];
		this.aiHand = [];
		this.discardPile = [];
		for (let i = 0; i < 7; i++) {
			this.playerHand.push(this.deck.pop());
			this.aiHand.push(this.deck.pop());
		}
		this.discardPile.push(this.deck.pop());
		this.turn = "player";
		this.playerHandGroup = this.add.group();
		this.aiHandGroup = this.add.group();
		this.createDeckVisual();
		this.updateBoard();
		this.turnText = this.add.text(400, 300, "Dein Zug", {
			fontSize: "48px",
			fill: "#ffffff",
			fontStyle: "bold",
			stroke: "#000000",
			strokeThickness: 4
		}).setOrigin(.5).setAlpha(0);
		this.showTurnText();
	}
	generateDeck() {
		let deck = [];
		for (let i = 0; i < 2; i++) Object.keys(COLORS).forEach((colorName) => {
			SHAPES.forEach((shape) => {
				NUMBERS.forEach((number) => {
					deck.push({
						colorName,
						color: COLORS[colorName],
						shape,
						number
					});
				});
			});
		});
		return deck;
	}
	shuffleDeck(deck) {
		for (let i = deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[deck[i], deck[j]] = [deck[j], deck[i]];
		}
	}
	createDeckVisual() {
		this.drawPileArea = this.add.rectangle(250, 300, 80, 120, 1127202).setStrokeStyle(4, 0).setInteractive();
		this.add.text(250, 300, "ZIEHEN", {
			fill: "#ffffff",
			fontSize: "16px",
			fontStyle: "bold"
		}).setOrigin(.5);
		this.drawPileArea.on("pointerdown", () => {
			if (this.turn === "player") this.drawCard("player");
		});
		this.drawPileArea.on("pointerover", () => {
			if (this.turn === "player") this.drawPileArea.setStrokeStyle(4, 16776960);
		});
		this.drawPileArea.on("pointerout", () => {
			this.drawPileArea.setStrokeStyle(4, 0);
		});
	}
	drawCard(who) {
		if (this.deck.length === 0) {
			const top = this.discardPile.pop();
			this.deck = this.discardPile;
			this.shuffleDeck(this.deck);
			this.discardPile = [top];
			if (this.deck.length === 0) return;
		}
		const card = this.deck.pop();
		if (who === "player") {
			this.playerHand.push(card);
			this.updateBoard();
			this.turn = "ai";
			this.time.delayedCall(1e3, () => this.playAITurn());
		} else {
			this.aiHand.push(card);
			this.updateBoard();
			this.turn = "player";
			this.showTurnText();
		}
	}
	isValidPlay(card, topCard) {
		let matches = 0;
		if (card.colorName === topCard.colorName) matches++;
		if (card.shape === topCard.shape) matches++;
		if (card.number === topCard.number) matches++;
		return matches >= 2;
	}
	updateBoard() {
		this.playerHandGroup.clear(true, true);
		this.aiHandGroup.clear(true, true);
		const topCard = this.discardPile[this.discardPile.length - 1];
		if (this.topCardVisual) this.topCardVisual.destroy();
		this.topCardVisual = this.createCardVisual(450, 300, topCard, false);
		const maxHandWidth = 700;
		const pSpacing = Math.min(80, maxHandWidth / Math.max(1, this.playerHand.length));
		const pStartX = 400 - (this.playerHand.length - 1) * pSpacing / 2;
		this.playerHand.forEach((card, index) => {
			const cardObj = this.createCardVisual(pStartX + index * pSpacing, 520, card, true);
			if (this.turn === "player") if (this.isValidPlay(card, topCard)) {
				const glow = this.add.rectangle(0, 0, 88, 128).setStrokeStyle(4, 16776960).setAlpha(.6);
				this.tweens.add({
					targets: glow,
					alpha: 1,
					yoyo: true,
					repeat: -1,
					duration: 800
				});
				cardObj.addAt(glow, 0);
				cardObj.setInteractive(new __webpack_exports__default.Geom.Rectangle(-40, -60, 80, 120), __webpack_exports__default.Geom.Rectangle.Contains);
				cardObj.on("pointerdown", () => this.playCard(index, "player"));
				cardObj.on("pointerover", () => {
					cardObj.y -= 20;
				});
				cardObj.on("pointerout", () => {
					cardObj.y += 20;
				});
			} else {
				cardObj.setAlpha(.6);
				cardObj.setInteractive(new __webpack_exports__default.Geom.Rectangle(-40, -60, 80, 120), __webpack_exports__default.Geom.Rectangle.Contains);
				cardObj.on("pointerdown", () => {
					this.cameras.main.shake(100, .005);
				});
			}
			this.playerHandGroup.add(cardObj);
		});
		const aSpacing = Math.min(40, maxHandWidth / Math.max(1, this.aiHand.length));
		const aStartX = 400 - (this.aiHand.length - 1) * aSpacing / 2;
		this.aiHand.forEach((card, index) => {
			const cardObj = this.createCardBackVisual(aStartX + index * aSpacing, 80);
			this.aiHandGroup.add(cardObj);
		});
	}
	createCardVisual(x, y, cardData, isInteractive) {
		const container = this.add.container(x, y);
		const bg = this.add.rectangle(0, 0, 80, 120, 16777215).setStrokeStyle(2, 0);
		const innerBg = this.add.rectangle(0, 0, 70, 110, cardData.color);
		let shape;
		if (cardData.shape === "Circle") shape = this.add.circle(0, 0, 20, 16777215);
		else if (cardData.shape === "Square") shape = this.add.rectangle(0, 0, 36, 36, 16777215);
		else if (cardData.shape === "Triangle") {
			shape = this.add.triangle(0, 0, 0, 40, 20, 0, 40, 40, 16777215);
			shape.setOrigin(.5, .6);
		}
		const numTextTL = this.add.text(-30, -50, cardData.number.toString(), {
			fontSize: "20px",
			fill: "#ffffff",
			fontStyle: "bold",
			stroke: "#000000",
			strokeThickness: 2
		});
		const numTextBR = this.add.text(30, 50, cardData.number.toString(), {
			fontSize: "20px",
			fill: "#ffffff",
			fontStyle: "bold",
			stroke: "#000000",
			strokeThickness: 2
		}).setOrigin(1);
		container.add([
			bg,
			innerBg,
			shape,
			numTextTL,
			numTextBR
		]);
		if (isInteractive) container.setSize(80, 120);
		return container;
	}
	createCardBackVisual(x, y) {
		const container = this.add.container(x, y);
		const bg = this.add.rectangle(0, 0, 80, 120, 16777215).setStrokeStyle(2, 0);
		const innerBg = this.add.rectangle(0, 0, 70, 110, 2236962);
		const text = this.add.text(0, 0, "FASKA\nUNO", {
			align: "center",
			fill: "#ff4444",
			fontStyle: "bold",
			fontSize: "14px"
		}).setOrigin(.5);
		container.add([
			bg,
			innerBg,
			text
		]);
		return container;
	}
	playCard(index, who) {
		let card, startX, startY;
		if (who === "player") {
			card = this.playerHand.splice(index, 1)[0];
			const pSpacing = Math.min(80, 700 / Math.max(1, this.playerHand.length + 1));
			startX = 400 - this.playerHand.length * pSpacing / 2 + index * pSpacing;
			startY = 520;
		} else {
			card = this.aiHand.splice(index, 1)[0];
			const aSpacing = Math.min(40, 700 / Math.max(1, this.aiHand.length + 1));
			startX = 400 - this.aiHand.length * aSpacing / 2 + index * aSpacing;
			startY = 80;
		}
		this.discardPile.push(card);
		this.playerHandGroup.clear(true, true);
		this.aiHandGroup.clear(true, true);
		const flyingCard = this.createCardVisual(startX, startY, card, false);
		this.tweens.add({
			targets: flyingCard,
			x: 450,
			y: 300,
			angle: __webpack_exports__default.Math.Between(-15, 15),
			duration: 300,
			ease: "Back.easeOut",
			onComplete: () => {
				flyingCard.destroy();
				this.cameras.main.shake(150, .015);
				try {
					this.add.particles(450, 300, "particle", {
						speed: {
							min: 100,
							max: 300
						},
						angle: {
							min: 0,
							max: 360
						},
						scale: {
							start: 1,
							end: 0
						},
						tint: card.color,
						lifespan: 600,
						blendMode: "ADD",
						emitting: false
					}).explode(40);
				} catch (e) {
					this.add.particles("particle").createEmitter({
						x: 450,
						y: 300,
						speed: {
							min: 100,
							max: 300
						},
						angle: {
							min: 0,
							max: 360
						},
						scale: {
							start: 1,
							end: 0
						},
						tint: card.color,
						lifespan: 600,
						blendMode: "ADD",
						on: false
					}).explode(40, 450, 300);
				}
				if (this.checkWin()) return;
				if (who === "player") {
					this.turn = "ai";
					this.updateBoard();
					this.time.delayedCall(1200, () => this.playAITurn());
				} else {
					this.turn = "player";
					this.updateBoard();
					this.showTurnText();
				}
			}
		});
	}
	playAITurn() {
		if (this.turn !== "ai") return;
		const topCard = this.discardPile[this.discardPile.length - 1];
		let validIndex = -1;
		for (let i = 0; i < this.aiHand.length; i++) if (this.isValidPlay(this.aiHand[i], topCard)) {
			validIndex = i;
			break;
		}
		if (validIndex !== -1) this.playCard(validIndex, "ai");
		else this.drawCard("ai");
	}
	showTurnText() {
		this.turnText.setText("Dein Zug!");
		this.turnText.setAlpha(1);
		this.turnText.y = 350;
		this.tweens.add({
			targets: this.turnText,
			y: 300,
			alpha: 0,
			duration: 1500,
			ease: "Power2"
		});
	}
	checkWin() {
		if (this.playerHand.length === 0) {
			this.endGame("DU HAST GEWONNEN!");
			return true;
		} else if (this.aiHand.length === 0) {
			this.endGame("KI HAT GEWONNEN!");
			return true;
		}
		return false;
	}
	endGame(message) {
		this.turn = "none";
		this.add.rectangle(400, 300, 800, 600, 0, .85);
		const text = this.add.text(400, 300, message, {
			fontSize: "48px",
			fill: "#ffff00",
			fontStyle: "bold",
			stroke: "#ff0000",
			strokeThickness: 6
		}).setOrigin(.5);
		this.tweens.add({
			targets: text,
			scale: {
				from: .8,
				to: 1.2
			},
			yoyo: true,
			repeat: -1,
			duration: 800,
			ease: "Sine.easeInOut"
		});
	}
};
var FaskaUno = ({ onExit }) => {
	const containerRef = (0, import_react.useRef)(null);
	const gameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!containerRef.current) return;
		const config = {
			type: __webpack_exports__default.AUTO,
			width: 800,
			height: 600,
			parent: containerRef.current,
			scene: [MainScene],
			pixelArt: false,
			scale: {
				mode: __webpack_exports__default.Scale.FIT,
				autoCenter: __webpack_exports__default.Scale.CENTER_BOTH
			}
		};
		gameRef.current = new __webpack_exports__default.Game(config);
		return () => {
			if (gameRef.current) {
				gameRef.current.destroy(true);
				gameRef.current = null;
			}
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			position: "relative",
			width: "100%",
			height: "100%",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "#1a1a1a"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "relative",
				width: "800px",
				maxWidth: "100%"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				style: {
					position: "absolute",
					top: "15px",
					right: "15px",
					zIndex: 100,
					padding: "10px 20px",
					fontSize: "18px",
					fontWeight: "bold",
					backgroundColor: "#ff4444",
					color: "white",
					border: "2px solid #aa0000",
					borderRadius: "8px",
					cursor: "pointer",
					boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
					textTransform: "uppercase"
				},
				onMouseOver: (e) => e.target.style.backgroundColor = "#ff6666",
				onMouseOut: (e) => e.target.style.backgroundColor = "#ff4444",
				children: "Beenden"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: containerRef,
				style: {
					borderRadius: "8px",
					overflow: "hidden",
					boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
				}
			})]
		})
	});
};
//#endregion
export { FaskaUno as default };
