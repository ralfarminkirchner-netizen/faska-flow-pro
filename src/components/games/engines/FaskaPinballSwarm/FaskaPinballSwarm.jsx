import React, { useEffect, useRef, useState, useCallback } from 'react';
import Phaser from 'phaser';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const W = 480;
const H = 800;
const GRAVITY = 2.8;
const MAX_BALLS = 3;

// Math chain config
const OPERATORS = ['+', '-', '*', '/'];
const CHAIN_LENGTH = 4; // number of bumper hits to complete a chain (yields 2 operators, 3 numbers)

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: generate a random integer in [min, max]
// ─────────────────────────────────────────────────────────────────────────────
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE
// ─────────────────────────────────────────────────────────────────────────────
class PinballSwarmScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PinballSwarmScene' });
  }

  // ── PRELOAD ─────────────────────────────────────────────────────────────────
  preload() {
    const g = this.add.graphics();

    // Ball texture
    g.clear();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(16, 16, 13);
    g.fillStyle(0x88ccff, 0.6);
    g.fillCircle(16, 16, 16);
    g.generateTexture('ball', 32, 32);

    // Bumper texture (large enough to draw on)
    g.clear();
    g.fillStyle(0x1a1a2e, 1);
    g.fillCircle(40, 40, 38);
    g.lineStyle(5, 0x00e5ff, 1);
    g.strokeCircle(40, 40, 37);
    g.lineStyle(2, 0x00e5ff, 0.4);
    g.strokeCircle(40, 40, 30);
    g.generateTexture('bumper', 80, 80);

    // Flipper texture (left)
    g.clear();
    g.fillStyle(0xff2d6f, 1);
    g.fillRoundedRect(0, 0, 110, 22, { tl: 11, tr: 3, br: 3, bl: 11 });
    g.lineStyle(2, 0xff8fb0, 0.8);
    g.strokeRoundedRect(0, 0, 110, 22, { tl: 11, tr: 3, br: 3, bl: 11 });
    g.generateTexture('flipperL', 110, 22);

    // Flipper texture (right — mirrored by flipping in-game)
    g.clear();
    g.fillStyle(0xff2d6f, 1);
    g.fillRoundedRect(0, 0, 110, 22, { tl: 3, tr: 11, br: 11, bl: 3 });
    g.lineStyle(2, 0xff8fb0, 0.8);
    g.strokeRoundedRect(0, 0, 110, 22, { tl: 3, tr: 11, br: 11, bl: 3 });
    g.generateTexture('flipperR', 110, 22);

    // Particle dot
    g.clear();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('dot', 8, 8);

    // Plunger lane wall texture
    g.clear();
    g.fillStyle(0x334466, 1);
    g.fillRect(0, 0, 16, 200);
    g.generateTexture('plungerWall', 16, 200);

    // Wall slab
    g.clear();
    g.fillStyle(0x223355, 1);
    g.fillRect(0, 0, 400, 18);
    g.lineStyle(2, 0x4488cc, 0.5);
    g.strokeRect(0, 0, 400, 18);
    g.generateTexture('wall', 400, 18);

    g.destroy();
  }

  // ── CREATE ──────────────────────────────────────────────────────────────────
  create() {
    this.score = 0;
    this.ballsLeft = MAX_BALLS;
    this.tiltCooldown = 0;
    this.plungerCharge = 0;
    this.plungerCharging = false;
    this.ballInPlay = false;
    this.ballLost = false;

    // Math chain state
    this.chain = [];          // array of numbers / operators accumulated
    this.chainComplete = false;
    this.awaitingAnswer = false;
    this.correctAnswer = null;
    this.answerBuffer = '';

    // Scored chain panel visibility handled via emitter
    this.events.on('updateUI', (data) => {
      // Phaser → React bridge
      if (this._uiBridge) this._uiBridge(data);
    });

    this._buildBackground();
    this._buildWalls();
    this._buildFlippers();
    this._buildBumpers();
    this._buildPlunger();
    this._buildSlingshots();
    this._buildTargetLights();
    this._buildUI();
    this._setupParticles();
    this._setupInput();
    this._setupCollisions();

    // Spawn ball in plunger lane
    this._spawnBall();

    // Emit initial UI state
    this._emitUI();
  }

  // ── BACKGROUND ──────────────────────────────────────────────────────────────
  _buildBackground() {
    // Deep space background
    this.add.rectangle(W / 2, H / 2, W, H, 0x05050f);

    // Grid lines
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x00e5ff, 0.04);
    for (let x = 0; x < W; x += 30) {
      grid.lineBetween(x, 0, x, H);
    }
    for (let y = 0; y < H; y += 30) {
      grid.lineBetween(0, y, W, y);
    }

    // Neon border glow
    const border = this.add.graphics();
    border.lineStyle(3, 0x00e5ff, 0.6);
    border.strokeRect(2, 2, W - 4, H - 4);
    border.lineStyle(1, 0x00e5ff, 0.2);
    border.strokeRect(6, 6, W - 12, H - 12);
  }

  // ── WALLS ───────────────────────────────────────────────────────────────────
  _buildWalls() {
    const { Bodies, World } = Phaser.Physics.Matter.Matter;

    // World bounds — no bottom (ball loss detection)
    this.matter.world.setBounds(0, -100, W, H + 100, 60, true, true, true, false);

    // Plunger lane right wall
    this._addStaticRect(W - 32, H - 200, 4, 400, 0x334466);

    // Left guide wall (angled lower-left)
    this._addStaticRotatedRect(78, H - 138, 130, 14, -0.58, 0x3355aa);
    // Right guide wall (angled lower-right)
    this._addStaticRotatedRect(W - 111, H - 138, 130, 14, 0.58, 0x3355aa);

    // Top angled deflectors
    this._addStaticRotatedRect(52, 130, 90, 14, 0.42, 0x3355aa);
    this._addStaticRotatedRect(W - 52, 130, 90, 14, -0.42, 0x3355aa);

    // Mid slingshot bumper walls (visual) done in slingshots section
  }

  _addStaticRect(x, y, w, h, color) {
    const body = this.matter.add.rectangle(x, y, w, h, { isStatic: true });
    const gfx = this.add.graphics();
    gfx.fillStyle(color, 1);
    gfx.fillRect(-w / 2, -h / 2, w, h);
    // attach visual to body via setPosition update (we do it manually in update if needed — for static it's fine)
    gfx.x = x;
    gfx.y = y;
    return body;
  }

  _addStaticRotatedRect(x, y, w, h, angle, color) {
    const body = this.matter.add.rectangle(x, y, w, h, { isStatic: true, angle });
    const gfx = this.add.graphics();
    gfx.fillStyle(color, 1);
    gfx.lineStyle(2, 0x4488cc, 0.6);
    gfx.fillRect(-w / 2, -h / 2, w, h);
    gfx.strokeRect(-w / 2, -h / 2, w, h);
    gfx.x = x;
    gfx.y = y;
    gfx.rotation = angle;
    return body;
  }

  // ── FLIPPERS ────────────────────────────────────────────────────────────────
  _buildFlippers() {
    const flipW = 110;
    const flipH = 22;
    const pivotY = H - 110;

    // ── LEFT FLIPPER ──
    // Pivot point
    const lPivotX = 100;
    this.leftFlipperPivot = this.matter.add.rectangle(lPivotX, pivotY, 4, 4, {
      isStatic: true,
      isSensor: true,
      label: 'pivotL'
    });

    this.leftFlipper = this.matter.add.image(lPivotX + flipW / 2 - 10, pivotY, 'flipperL', null, {
      friction: 0,
      restitution: 0.4,
      density: 0.4,
      label: 'flipper',
      collisionFilter: { category: 0x0004, mask: 0xFFFF }
    });
    this.leftFlipper.setOrigin(0.1, 0.5);

    this.leftConstraint = this.matter.add.constraint(
      this.leftFlipperPivot,
      this.leftFlipper.body,
      0, 0.9,
      { pointA: { x: 0, y: 0 }, pointB: { x: -flipW * 0.4, y: 0 } }
    );

    // Stoppers
    this._addStopper(lPivotX, pivotY - 28, 8);  // top stopper
    this._addStopper(lPivotX, pivotY + 28, 8);  // bottom stopper

    // ── RIGHT FLIPPER ──
    const rPivotX = W - 100;
    this.rightFlipperPivot = this.matter.add.rectangle(rPivotX, pivotY, 4, 4, {
      isStatic: true,
      isSensor: true,
      label: 'pivotR'
    });

    this.rightFlipper = this.matter.add.image(rPivotX - flipW / 2 + 10, pivotY, 'flipperR', null, {
      friction: 0,
      restitution: 0.4,
      density: 0.4,
      label: 'flipper',
      collisionFilter: { category: 0x0004, mask: 0xFFFF }
    });
    this.rightFlipper.setOrigin(0.9, 0.5);

    this.rightConstraint = this.matter.add.constraint(
      this.rightFlipperPivot,
      this.rightFlipper.body,
      0, 0.9,
      { pointA: { x: 0, y: 0 }, pointB: { x: flipW * 0.4, y: 0 } }
    );

    this._addStopper(rPivotX, pivotY - 28, 8);
    this._addStopper(rPivotX, pivotY + 28, 8);

    // Flipper state
    this.leftDown = false;
    this.rightDown = false;
  }

  _addStopper(x, y, r) {
    this.matter.add.circle(x, y, r, {
      isStatic: true,
      isSensor: false,
      label: 'stopper',
      collisionFilter: { category: 0x0002, mask: 0x0004 }
    });
  }

  // ── BUMPERS ─────────────────────────────────────────────────────────────────
  _buildBumpers() {
    this.bumpers = [];
    this.bumperTexts = [];

    // Layout: triangle + extra
    const positions = [
      { x: W / 2,       y: 220 },
      { x: W / 2 - 100, y: 300 },
      { x: W / 2 + 100, y: 300 },
      { x: W / 2 - 50,  y: 390 },
      { x: W / 2 + 50,  y: 390 },
      { x: W / 2,       y: 470 },
    ];

    positions.forEach((pos, i) => {
      const op = OPERATORS[i % OPERATORS.length];
      const body = this.matter.add.circle(pos.x, pos.y, 36, {
        isStatic: true,
        restitution: 1.8,
        label: 'bumper',
        collisionFilter: { category: 0x0001, mask: 0xFFFF }
      });

      const img = this.add.image(pos.x, pos.y, 'bumper').setDepth(5);

      const txt = this.add.text(pos.x, pos.y, op, {
        fontSize: '26px',
        fontStyle: 'bold',
        fontFamily: 'Courier New, monospace',
        color: '#00e5ff',
        stroke: '#003355',
        strokeThickness: 3,
      }).setOrigin(0.5).setDepth(6);

      // Glow ring
      const glow = this.add.graphics().setDepth(4);
      glow.lineStyle(6, 0x00e5ff, 0.3);
      glow.strokeCircle(pos.x, pos.y, 42);

      this.bumpers.push({ body, img, txt, glow, op, pos, glowTween: null });
    });
  }

  // ── PLUNGER ─────────────────────────────────────────────────────────────────
  _buildPlunger() {
    this.plungerLaneX = W - 48;

    // Visual plunger rod
    this.plungerGfx = this.add.graphics().setDepth(10);
    this._drawPlunger(0);

    // Plunger text hint
    this.add.text(this.plungerLaneX, H - 55, 'SPACE\nLAUNCH', {
      fontSize: '10px', color: '#4488cc', fontFamily: 'Arial', align: 'center'
    }).setOrigin(0.5).setDepth(11);
  }

  _drawPlunger(charge) {
    const g = this.plungerGfx;
    g.clear();
    const baseY = H - 80;
    const rodLen = 40 + charge * 60;
    const x = this.plungerLaneX;

    // Rod
    g.lineStyle(8, 0xff6600, 1);
    g.lineBetween(x, baseY, x, baseY + rodLen);

    // Plunger head
    const pct = charge;
    const col = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(0xff6600),
      Phaser.Display.Color.ValueToColor(0xff0000),
      100, pct * 100
    );
    g.fillStyle(Phaser.Display.Color.ObjectToColor(col).color, 1);
    g.fillRoundedRect(x - 14, baseY + rodLen - 4, 28, 18, 6);

    // Charge bar
    if (charge > 0) {
      g.fillStyle(0x222222, 1);
      g.fillRoundedRect(x - 14, baseY - 75, 28, 60, 4);
      g.fillStyle(0xff4400, 1);
      g.fillRoundedRect(x - 12, baseY - 73 + (58 * (1 - charge)), 24, 58 * charge, 3);
    }
  }

  // ── SLINGSHOTS ──────────────────────────────────────────────────────────────
  _buildSlingshots() {
    // Left slingshot
    this._addSlingshot(90, H - 280, -0.4, true);
    // Right slingshot
    this._addSlingshot(W - 130, H - 280, 0.4, false);
  }

  _addSlingshot(x, y, angle, isLeft) {
    const w = 80, h = 14;
    const body = this.matter.add.rectangle(x, y, w, h, {
      isStatic: true,
      restitution: 1.4,
      label: 'slingshot',
      angle
    });

    const gfx = this.add.graphics().setDepth(5);
    gfx.fillStyle(0xff6600, 1);
    gfx.lineStyle(2, 0xffaa00, 1);
    gfx.fillRoundedRect(-w / 2, -h / 2, w, h, 7);
    gfx.strokeRoundedRect(-w / 2, -h / 2, w, h, 7);
    gfx.x = x;
    gfx.y = y;
    gfx.rotation = angle;

    // Arrow indicator
    const arrow = this.add.text(x + (isLeft ? -30 : 30), y - 12, isLeft ? '◀' : '▶', {
      fontSize: '12px', color: '#ffaa00'
    }).setOrigin(0.5).setDepth(6);

    return body;
  }

  // ── TARGET LIGHTS ────────────────────────────────────────────────────────────
  _buildTargetLights() {
    this.lights = [];
    const positions = [80, 160, 240, 320, 400];
    positions.forEach((x, i) => {
      const circle = this.add.graphics().setDepth(4);
      circle.fillStyle(0x223355, 1);
      circle.lineStyle(2, 0x00e5ff, 0.4);
      circle.fillCircle(0, 0, 10);
      circle.strokeCircle(0, 0, 10);
      circle.x = x;
      circle.y = 60;
      this.lights.push({ gfx: circle, x, lit: false });
    });
  }

  // ── UI ───────────────────────────────────────────────────────────────────────
  _buildUI() {
    // Score
    this.scoreLbl = this.add.text(16, 16, 'SCORE', {
      fontSize: '11px', color: '#4488cc', fontFamily: 'Arial', fontStyle: 'bold'
    }).setDepth(20);
    this.scoreVal = this.add.text(16, 30, '0', {
      fontSize: '28px', color: '#ffffff', fontFamily: 'Courier New, monospace', fontStyle: 'bold'
    }).setDepth(20);

    // Balls
    this.ballsLbl = this.add.text(W - 16, 16, 'BALLS', {
      fontSize: '11px', color: '#4488cc', fontFamily: 'Arial', fontStyle: 'bold'
    }).setOrigin(1, 0).setDepth(20);
    this.ballsVal = this.add.text(W - 16, 30, '● ● ●', {
      fontSize: '18px', color: '#ff2d6f', fontFamily: 'Arial'
    }).setOrigin(1, 0).setDepth(20);

    // Chain display panel
    this.chainPanel = this.add.graphics().setDepth(15);
    this._drawChainPanel();

    this.chainText = this.add.text(W / 2, H - 180, '', {
      fontSize: '20px',
      color: '#00e5ff',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold',
      stroke: '#001122',
      strokeThickness: 3,
      align: 'center',
    }).setOrigin(0.5).setDepth(16);

    this.hintText = this.add.text(W / 2, H - 155, 'Hit bumpers to build math chain!', {
      fontSize: '11px', color: '#4488cc', fontFamily: 'Arial', align: 'center'
    }).setOrigin(0.5).setDepth(16);

    // Flash message
    this.flashText = this.add.text(W / 2, H / 2 - 60, '', {
      fontSize: '36px',
      color: '#ffe000',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center',
    }).setOrigin(0.5).setDepth(30).setAlpha(0);

    // Tilt warning
    this.tiltText = this.add.text(W / 2, H / 2, 'TILT!', {
      fontSize: '64px',
      color: '#ff0000',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5).setDepth(40).setAlpha(0);

    // Game over
    this.gameOverText = this.add.text(W / 2, H / 2 - 40, 'GAME OVER', {
      fontSize: '52px',
      color: '#ff2d6f',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5).setDepth(40).setAlpha(0);

    this.finalScoreText = this.add.text(W / 2, H / 2 + 30, '', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Courier New, monospace',
    }).setOrigin(0.5).setDepth(40).setAlpha(0);
  }

  _drawChainPanel() {
    const g = this.chainPanel;
    g.clear();
    g.fillStyle(0x080818, 0.85);
    g.lineStyle(2, 0x00e5ff, 0.5);
    g.fillRoundedRect(20, H - 200, W - 40, 50, 8);
    g.strokeRoundedRect(20, H - 200, W - 40, 50, 8);
  }

  // ── PARTICLES ────────────────────────────────────────────────────────────────
  _setupParticles() {
    // Hit burst particles
    this.burstEmitter = this.add.particles(0, 0, 'dot', {
      speed: { min: 80, max: 350 },
      lifespan: { min: 400, max: 900 },
      scale: { start: 1.2, end: 0 },
      alpha: { start: 1, end: 0 },
      blendMode: 'ADD',
      emitting: false,
      quantity: 0,
    }).setDepth(50);

    // Ball trail
    this.trailEmitter = this.add.particles(0, 0, 'dot', {
      speed: 0,
      lifespan: 200,
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.4, end: 0 },
      tint: [0x00e5ff, 0xff2d6f, 0xffe000],
      blendMode: 'ADD',
    }).setDepth(8);

    // Super bonus star burst
    this.superEmitter = this.add.particles(0, 0, 'dot', {
      speed: { min: 200, max: 600 },
      lifespan: { min: 600, max: 1400 },
      scale: { start: 2, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: [0xffe000, 0xff8800, 0xffffff],
      blendMode: 'ADD',
      emitting: false,
      quantity: 0,
    }).setDepth(50);
  }

  // ── INPUT ────────────────────────────────────────────────────────────────────
  _setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Tilt keys
    this.keyShiftL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    // Numeric answer input captured at game level
    this.input.keyboard.on('keydown', (event) => {
      if (!this.awaitingAnswer) return;
      if ((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode === 189 || event.keyCode === 109) {
        // digits 0–9 and minus
        const ch = event.key;
        if (ch === '-' && this.answerBuffer.length === 0) {
          this.answerBuffer = '-';
        } else if (/\d/.test(ch)) {
          this.answerBuffer += ch;
        }
        this._emitUI();
      } else if (event.keyCode === 8) {
        // backspace
        this.answerBuffer = this.answerBuffer.slice(0, -1);
        this._emitUI();
      } else if (event.keyCode === 13) {
        // enter — check answer
        this._checkAnswer();
      }
    });
  }

  // ── COLLISION ────────────────────────────────────────────────────────────────
  _setupCollisions() {
    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        this._handleCollision(bodyA, bodyB);
        this._handleCollision(bodyB, bodyA);
      });
    });
  }

  _handleCollision(a, b) {
    if (a.label === 'bumper' && b.label === 'ball') {
      const bumperIdx = this.bumpers.findIndex(bu => bu.body === a);
      if (bumperIdx >= 0) {
        this._hitBumper(bumperIdx);
      }
    }
    if (a.label === 'slingshot' && b.label === 'ball') {
      this._hitSlingshot(a);
    }
  }

  // ── BUMPER HIT ───────────────────────────────────────────────────────────────
  _hitBumper(idx) {
    const bu = this.bumpers[idx];
    if (!bu) return;

    // Base score
    this.score += 150;
    this._updateScoreDisplay();

    // Build math chain
    this._appendChain(bu.op);

    // Visual flash
    bu.img.setTint(0x00ffff);
    this.time.delayedCall(120, () => bu.img.clearTint());

    // Scale pulse tween
    this.tweens.add({
      targets: [bu.img, bu.txt],
      scale: 1.4,
      duration: 80,
      yoyo: true,
      ease: 'Bounce.Out'
    });

    // Glow ring burst
    if (bu.glowTween) bu.glowTween.stop();
    bu.glow.clear();
    bu.glow.lineStyle(10, 0x00e5ff, 0.9);
    bu.glow.strokeCircle(bu.pos.x, bu.pos.y, 42);
    bu.glowTween = this.tweens.add({
      targets: bu.glow,
      alpha: 0,
      duration: 400,
      ease: 'Cubic.Out',
      onComplete: () => {
        bu.glow.setAlpha(1);
        bu.glow.clear();
        bu.glow.lineStyle(6, 0x00e5ff, 0.3);
        bu.glow.strokeCircle(bu.pos.x, bu.pos.y, 42);
      }
    });

    // Particle burst
    this.burstEmitter.setParticleTint(0x00e5ff);
    this.burstEmitter.emitParticleAt(bu.pos.x, bu.pos.y, 18);

    // Camera shake
    this.cameras.main.shake(80, 0.006);

    // Light a top-row target
    this._lightNext();
  }

  // ── SLINGSHOT HIT ────────────────────────────────────────────────────────────
  _hitSlingshot(body) {
    this.score += 50;
    this._updateScoreDisplay();
    this.cameras.main.shake(60, 0.004);
    this.burstEmitter.setParticleTint(0xff6600);
    this.burstEmitter.emitParticleAt(body.position.x, body.position.y, 8);
  }

  // ── MATH CHAIN ───────────────────────────────────────────────────────────────
  _appendChain(op) {
    if (this.awaitingAnswer) return; // chain frozen while answering

    // The chain builds as: number op number op number = ?
    // Chain array format: [num, op, num, op, num] → length 5 for CHAIN_LENGTH=4
    // We accumulate step by step
    const len = this.chain.length;

    if (len === 0) {
      // Start chain with a random number + operator
      const num = randInt(1, 9);
      this.chain.push(num);
      this.chain.push(op);
    } else if (len % 2 === 1) {
      // Last pushed was an operator, now push number + next op
      const num = randInt(1, 9);
      this.chain.push(num);

      // Check if chain is complete (we have enough numbers)
      if (this.chain.length >= 5) {
        this._completeChain();
        return;
      }
      this.chain.push(op);
    } else {
      // Last pushed was a number; replace last operator with this new one
      this.chain[this.chain.length - 1] = op;
    }

    this._updateChainDisplay();
  }

  _completeChain() {
    // Compute correct answer from chain: chain = [a, op, b, op, c]
    const a = this.chain[0];
    const op1 = this.chain[1];
    const b = this.chain[2];
    const op2 = this.chain[3];
    const c = this.chain[4];

    let partial;
    if (op1 === '+') partial = a + b;
    else if (op1 === '-') partial = a - b;
    else if (op1 === '*') partial = a * b;
    else partial = parseFloat((a / b).toFixed(1));

    let result;
    if (op2 === '+') result = partial + c;
    else if (op2 === '-') result = partial - c;
    else if (op2 === '*') result = partial * c;
    else result = parseFloat((partial / c).toFixed(1));

    this.correctAnswer = Math.round(result);
    this.awaitingAnswer = true;
    this.answerBuffer = '';

    // Freeze flippers briefly and display
    this._updateChainDisplay();
    this._showFlash(`= ?  Type the answer!\nPress ENTER to confirm`, 0xffe000, 0);
    this._emitUI();

    // Pulse the chain display
    this.tweens.add({
      targets: this.chainText,
      scale: 1.1,
      duration: 200,
      yoyo: true,
      repeat: 3,
    });
  }

  _checkAnswer() {
    if (!this.awaitingAnswer) return;

    const attempt = parseInt(this.answerBuffer, 10);
    if (isNaN(attempt)) return;

    if (attempt === this.correctAnswer) {
      // CORRECT!
      const bonus = 2000 + this.chain.length * 200;
      this.score += bonus;
      this._updateScoreDisplay();
      this._showFlash(`CORRECT! +${bonus} SUPER BONUS!`, 0x00ff88, 2000);
      this.cameras.main.shake(300, 0.018);
      this.cameras.main.flash(400, 0, 255, 100);
      this.superEmitter.emitParticleAt(W / 2, H / 2, 60);
    } else {
      // WRONG
      this._showFlash(`WRONG! Answer was ${this.correctAnswer}`, 0xff2d6f, 2000);
      this.cameras.main.shake(200, 0.012);
      this.cameras.main.flash(300, 255, 0, 0);
    }

    // Reset chain
    this.chain = [];
    this.awaitingAnswer = false;
    this.correctAnswer = null;
    this.answerBuffer = '';
    this._updateChainDisplay();
    this._emitUI();
  }

  _updateChainDisplay() {
    if (this.chain.length === 0) {
      this.chainText.setText('');
      this.hintText.setText('Hit bumpers to build math chain!');
      return;
    }

    const expr = this.chain.join(' ');
    if (this.awaitingAnswer) {
      this.chainText.setText(expr + ' = ?');
      this.hintText.setText(`Type your answer, then press ENTER   [${this.answerBuffer || '_'}]`);
      this.chainText.setColor('#ffe000');
    } else {
      this.chainText.setText(expr);
      this.hintText.setText('Keep hitting bumpers to complete the equation!');
      this.chainText.setColor('#00e5ff');
    }
  }

  // ── PLUNGER ──────────────────────────────────────────────────────────────────
  _spawnBall() {
    if (this.ball) {
      try { this.matter.world.remove(this.ball.body); } catch (e) {}
      this.ball.destroy();
    }

    this.ball = this.matter.add.image(this.plungerLaneX, H - 140, 'ball', null, {
      restitution: 0.55,
      friction: 0.001,
      frictionAir: 0.002,
      density: 0.06,
      label: 'ball',
      collisionFilter: { category: 0x0001, mask: 0xFFFF & ~0x0002 }
    });
    this.ball.setCircle(15);

    this.trailEmitter.startFollow(this.ball);
    this.ballInPlay = false;
    this.ballLost = false;
    this.plungerCharge = 0;
    this.plungerCharging = false;
    this._drawPlunger(0);
  }

  _launchBall(charge) {
    if (!this.ball || this.ballInPlay) return;
    const force = -0.028 * (0.3 + charge * 0.7);
    this.ball.applyForce({ x: 0, y: force });
    this.ballInPlay = true;
    this._showFlash('LAUNCH!', 0xffe000, 800);
  }

  // ── TOP LIGHTS ────────────────────────────────────────────────────────────────
  _lightNext() {
    const unlit = this.lights.filter(l => !l.lit);
    if (unlit.length === 0) {
      // All lit — super bonus!
      this.score += 1000;
      this._updateScoreDisplay();
      this._showFlash('ALL LIGHTS! +1000!', 0xffe000, 1500);
      this.lights.forEach(l => {
        l.lit = false;
        l.gfx.clear();
        l.gfx.fillStyle(0x223355, 1);
        l.gfx.lineStyle(2, 0x00e5ff, 0.4);
        l.gfx.fillCircle(0, 0, 10);
        l.gfx.strokeCircle(0, 0, 10);
      });
      return;
    }
    const pick = unlit[Math.floor(Math.random() * unlit.length)];
    pick.lit = true;
    pick.gfx.clear();
    pick.gfx.fillStyle(0xffe000, 1);
    pick.gfx.fillCircle(0, 0, 10);
    pick.gfx.lineStyle(2, 0xffffff, 0.8);
    pick.gfx.strokeCircle(0, 0, 10);
  }

  // ── TILT ─────────────────────────────────────────────────────────────────────
  _triggerTilt() {
    if (this.tiltCooldown > 0) return;
    this.tiltCooldown = 180; // 3 seconds

    this.tiltText.setAlpha(1);
    this.tweens.add({
      targets: this.tiltText,
      alpha: 0,
      duration: 1200,
      ease: 'Cubic.In'
    });

    // Gravity spike
    this.matter.world.setGravity(0, GRAVITY * 2.5);
    this.time.delayedCall(800, () => {
      this.matter.world.setGravity(0, GRAVITY);
    });

    // Disable flippers briefly
    this.tiltActive = true;
    this.time.delayedCall(1500, () => {
      this.tiltActive = false;
    });

    this.cameras.main.shake(400, 0.022);
    this.score = Math.max(0, this.score - 200);
    this._updateScoreDisplay();
  }

  // ── BALL LOST ────────────────────────────────────────────────────────────────
  _ballLost() {
    if (this.ballLost) return;
    this.ballLost = true;
    this.ballInPlay = false;

    this.trailEmitter.stopFollow();

    // Drain animation
    this.cameras.main.shake(250, 0.014);
    this.cameras.main.flash(500, 255, 0, 50);

    this.ballsLeft--;
    this._updateBallsDisplay();

    // Reset chain on drain
    if (this.chain.length > 0) {
      this.chain = [];
      this.awaitingAnswer = false;
      this.answerBuffer = '';
      this.correctAnswer = null;
      this._updateChainDisplay();
      this._emitUI();
    }

    if (this.ballsLeft <= 0) {
      this._gameOver();
      return;
    }

    this._showFlash('BALL LOST!', 0xff2d6f, 1500);
    this.time.delayedCall(1800, () => {
      this._spawnBall();
    });
  }

  // ── GAME OVER ─────────────────────────────────────────────────────────────────
  _gameOver() {
    this.scene.pause();
    this.gameOverText.setAlpha(1);
    this.finalScoreText.setText(`Final Score: ${this.score.toLocaleString()}`).setAlpha(1);

    this.tweens.add({
      targets: [this.gameOverText, this.finalScoreText],
      scale: { from: 0.5, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 600,
      ease: 'Back.Out'
    });

    this.superEmitter.emitParticleAt(W / 2, H / 2, 80);
    this.cameras.main.flash(1000, 255, 0, 50);
    this._emitUI();
  }

  // ── FLASH MESSAGE ──────────────────────────────────────────────────────────────
  _showFlash(msg, color, duration = 1200) {
    this.flashText.setText(msg)
      .setColor(Phaser.Display.Color.ValueToColor(color).rgba)
      .setAlpha(1);

    if (duration > 0) {
      this.time.delayedCall(duration, () => {
        this.tweens.add({
          targets: this.flashText,
          alpha: 0,
          duration: 400,
        });
      });
    }
  }

  // ── DISPLAY UPDATES ────────────────────────────────────────────────────────────
  _updateScoreDisplay() {
    this.scoreVal.setText(this.score.toLocaleString());
  }

  _updateBallsDisplay() {
    const dots = ['●', '●', '●'].map((d, i) =>
      i < this.ballsLeft ? d : '○'
    ).join(' ');
    this.ballsVal.setText(dots);
  }

  _emitUI() {
    this.events.emit('updateUI', {
      score: this.score,
      ballsLeft: this.ballsLeft,
      chain: [...this.chain],
      awaitingAnswer: this.awaitingAnswer,
      answerBuffer: this.answerBuffer,
      correctAnswer: this.correctAnswer,
      gameOver: this.ballsLeft <= 0,
    });
  }

  // ── UPDATE ─────────────────────────────────────────────────────────────────────
  update(time, delta) {
    if (!this.ball) return;

    // ── Plunger charge / launch
    if (!this.ballInPlay) {
      if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
        this.plungerCharging = true;
      }
      if (this.plungerCharging) {
        this.plungerCharge = Math.min(1, this.plungerCharge + delta / 1200);
        this._drawPlunger(this.plungerCharge);
      }
      if (Phaser.Input.Keyboard.JustUp(this.keySpace) && this.plungerCharging) {
        this._launchBall(this.plungerCharge);
        this.plungerCharge = 0;
        this.plungerCharging = false;
        this._drawPlunger(0);
      }
    }

    // ── Flipper control (Z / Left = left flipper, X / Right = right flipper)
    const lFlipDown = !this.tiltActive && (this.cursors.left.isDown || this.keyZ.isDown);
    const rFlipDown = !this.tiltActive && (this.cursors.right.isDown || this.keyX.isDown);

    if (lFlipDown) {
      this.leftFlipper.setAngularVelocity(-0.38);
    } else {
      this.leftFlipper.setAngularVelocity(0.18);
    }

    if (rFlipDown) {
      this.rightFlipper.setAngularVelocity(0.38);
    } else {
      this.rightFlipper.setAngularVelocity(-0.18);
    }

    // ── Tilt detection — SHIFT key
    if (Phaser.Input.Keyboard.JustDown(this.keyShiftL)) {
      this._triggerTilt();
    }

    // ── Tilt cooldown
    if (this.tiltCooldown > 0) {
      this.tiltCooldown--;
    }

    // ── Ball out of bounds (lost)
    if (this.ballInPlay && this.ball.y > H + 30) {
      this._ballLost();
    }

    // ── Keep ball in plunger lane before launch
    if (!this.ballInPlay && this.ball) {
      this.matter.body.setPosition(this.ball.body, { x: this.plungerLaneX, y: this.ball.y });
      this.matter.body.setVelocity(this.ball.body, { x: 0, y: 0 });
    }

    // ── Rotate bumper labels slightly for flair
    const t = time / 2000;
    this.bumpers.forEach((bu, i) => {
      bu.txt.setScale(1 + 0.05 * Math.sin(t + i));
    });

    // ── Check if answer input active — update display
    if (this.awaitingAnswer) {
      this._updateChainDisplay();
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REACT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const FaskaPinballSwarm = ({ onExit }) => {
  const gameRef = useRef(null);
  const phaserRef = useRef(null);
  const [uiState, setUiState] = useState({
    score: 0,
    ballsLeft: MAX_BALLS,
    chain: [],
    awaitingAnswer: false,
    answerBuffer: '',
    correctAnswer: null,
    gameOver: false,
  });

  const handleRestart = useCallback(() => {
    if (phaserRef.current) {
      phaserRef.current.scene.stop('PinballSwarmScene');
      phaserRef.current.scene.start('PinballSwarmScene');
    }
  }, []);

  useEffect(() => {
    if (!gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: W,
      height: H,
      parent: gameRef.current,
      backgroundColor: '#05050f',
      physics: {
        default: 'matter',
        matter: {
          gravity: { y: GRAVITY },
          debug: false,
        },
      },
      scene: PinballSwarmScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);
    phaserRef.current = game;

    // Bridge: listen to scene events for React state
    game.events.on('ready', () => {
      const scene = game.scene.getScene('PinballSwarmScene');
      if (scene) {
        scene._uiBridge = (data) => setUiState({ ...data });
      }
    });

    return () => {
      game.destroy(true);
      phaserRef.current = null;
    };
  }, []);

  // Keyboard instructions string
  const keyHelp = '← / Z = Left Flipper   → / X = Right Flipper   SPACE = Plunger   SHIFT = Tilt   ENTER = Submit Answer';

  const chainDisplay = uiState.chain.join(' ');

  return (
    <div
      style={{
        position: 'relative',
        width: `${W}px`,
        height: `${H}px`,
        margin: '0 auto',
        fontFamily: 'Courier New, monospace',
        userSelect: 'none',
        background: '#05050f',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 0 60px rgba(0,229,255,0.25), 0 0 120px rgba(0,229,255,0.1)',
      }}
    >
      {/* Phaser canvas mount */}
      <div
        ref={gameRef}
        style={{ width: '100%', height: '100%' }}
      />

      {/* ── BEENDEN BUTTON ── */}
      <button
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 100,
          padding: '7px 18px',
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          background: 'linear-gradient(135deg, #ff2d6f, #cc0044)',
          color: '#fff',
          border: '2px solid rgba(255,255,255,0.4)',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 0 14px rgba(255,45,111,0.6)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          transition: 'transform 0.1s, box-shadow 0.1s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 0 24px rgba(255,45,111,0.9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 0 14px rgba(255,45,111,0.6)';
        }}
      >
        Beenden
      </button>

      {/* ── ANSWER INPUT OVERLAY (shown when awaiting answer) ── */}
      {uiState.awaitingAnswer && (
        <div
          style={{
            position: 'absolute',
            bottom: '210px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 90,
            background: 'rgba(5,5,20,0.92)',
            border: '2px solid #ffe000',
            borderRadius: '12px',
            padding: '12px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 30px rgba(255,224,0,0.5)',
            minWidth: '260px',
          }}
        >
          <div style={{ color: '#ffe000', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
            🔢 SOLVE THE EQUATION
          </div>
          <div style={{ color: '#00e5ff', fontSize: '20px', fontWeight: 'bold' }}>
            {chainDisplay} = ?
          </div>
          <div
            style={{
              background: '#0a0a1f',
              border: '2px solid #00e5ff',
              borderRadius: '8px',
              padding: '6px 18px',
              color: '#ffffff',
              fontSize: '28px',
              fontWeight: 'bold',
              minWidth: '80px',
              textAlign: 'center',
              letterSpacing: '2px',
            }}
          >
            {uiState.answerBuffer || '?'}
          </div>
          <div style={{ color: '#4488cc', fontSize: '11px' }}>
            Type answer → press ENTER
          </div>
        </div>
      )}

      {/* ── GAME OVER OVERLAY ── */}
      {uiState.gameOver && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 80,
            background: 'rgba(5,5,20,0.75)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <div style={{
            fontSize: '54px',
            fontWeight: 'bold',
            color: '#ff2d6f',
            textShadow: '0 0 30px #ff2d6f',
            letterSpacing: '2px',
          }}>
            GAME OVER
          </div>
          <div style={{ fontSize: '26px', color: '#ffffff' }}>
            Final Score: <span style={{ color: '#ffe000' }}>{uiState.score.toLocaleString()}</span>
          </div>
          <button
            onClick={handleRestart}
            style={{
              padding: '10px 32px',
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #00e5ff, #0077ff)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0,229,255,0.6)',
              letterSpacing: '1px',
              marginTop: '8px',
            }}
          >
            PLAY AGAIN
          </button>
          <button
            onClick={onExit}
            style={{
              padding: '8px 24px',
              fontSize: '14px',
              background: 'rgba(255,255,255,0.1)',
              color: '#aaa',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Beenden
          </button>
        </div>
      )}

      {/* ── KEYBOARD HELP BAR ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'rgba(5,5,20,0.85)',
          borderTop: '1px solid rgba(0,229,255,0.2)',
          padding: '4px 8px',
          fontSize: '9px',
          color: '#4488cc',
          textAlign: 'center',
          letterSpacing: '0.5px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {keyHelp}
      </div>
    </div>
  );
};

export default FaskaPinballSwarm;
