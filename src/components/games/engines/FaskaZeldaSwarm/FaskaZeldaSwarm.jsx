import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

/* ─────────────────────────────────────────────
   FaskaZeldaSwarm – Top-down Action RPG
   Zelda: A Link to the Past style
   Educational: Geography quiz on each chest
───────────────────────────────────────────── */

const GEOGRAPHY_QUESTIONS = [
  { q: 'Capital of France?',       a: 'paris' },
  { q: 'Capital of Japan?',        a: 'tokyo' },
  { q: 'Capital of Germany?',      a: 'berlin' },
  { q: 'Capital of Brazil?',       a: 'brasilia' },
  { q: 'Capital of Australia?',    a: 'canberra' },
  { q: 'Capital of Canada?',       a: 'ottawa' },
  { q: 'Capital of Spain?',        a: 'madrid' },
  { q: 'Capital of Italy?',        a: 'rome' },
  { q: 'Capital of Egypt?',        a: 'cairo' },
  { q: 'Capital of China?',        a: 'beijing' },
  { q: 'Capital of India?',        a: 'new delhi' },
  { q: 'Capital of Russia?',       a: 'moscow' },
  { q: 'Capital of Mexico?',       a: 'mexico city' },
  { q: 'Capital of Argentina?',    a: 'buenos aires' },
  { q: 'Capital of South Korea?',  a: 'seoul' },
  { q: 'Capital of Turkey?',       a: 'ankara' },
  { q: 'Capital of Nigeria?',      a: 'abuja' },
  { q: 'Capital of Sweden?',       a: 'stockholm' },
  { q: 'Capital of Portugal?',     a: 'lisbon' },
  { q: 'Capital of Thailand?',     a: 'bangkok' },
];

const TILE = 40;
const COLS = 20;
const ROWS = 15;

const FaskaZeldaSwarm = ({ onExit }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    class DungeonScene extends Phaser.Scene {
      constructor() { super({ key: 'DungeonScene' }); }

      preload() {
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xffffff); g.fillCircle(4, 4, 4);
        g.generateTexture('dot', 8, 8);
        g.destroy();
      }

      create() {
        this.cameras.main.setBackgroundColor('#0a0a15');
        // State
        this.playerHP       = 6;
        this.maxHP          = 6;
        this.bombs          = 3;
        this.keysCount      = 0;
        this.currentRoom    = 0;
        this.shielding      = false;
        this.swinging       = false;
        this.swingCooldown  = 0;
        this.bombCooldown   = 0;
        this.playerInvTime  = 0;
        this.quizActive     = false;
        this.quizAnswer     = '';
        this.quizCorrectAns = '';
        this.bossHP         = 20;
        this.bossActive     = false;
        this.gameOver       = false;
        this.victory        = false;
        this.playerFacing   = 'down';
        this.bombList       = [];
        this.bossObj        = null;
        this.bossHitTime    = 0;
        this.bossPhase      = 1;
        this.bossAngle      = 0;
        this.bossShootTimer = 0;
        this._flashMsg      = null;
        this.northDoor      = null;

        this._buildTextures();
        this._createGroups();
        this._buildRoom(this.currentRoom);
        this._createPlayer();
        this._createUI();
        this._createInputs();
        this._createColliders();
        this._startAmbient();
      }

      // ══════════════════════════════════════════
      // TEXTURE GENERATION
      // ══════════════════════════════════════════
      _buildTextures() {
        const g = this.make.graphics({ x: 0, y: 0, add: false });

        // Player (green hero)
        g.clear();
        g.fillStyle(0x22cc88); g.fillRect(4, 8, 24, 20);
        g.fillStyle(0xffcc88); g.fillCircle(16, 8, 10);
        g.fillStyle(0x228800); g.fillRect(6, 0, 20, 7);
        g.fillStyle(0xddddff); g.fillRect(28, 10, 4, 16);
        g.generateTexture('player', 32, 32);

        // Slime enemy
        g.clear();
        g.fillStyle(0x22ff44); g.fillEllipse(16, 18, 30, 24);
        g.fillStyle(0x00cc33); g.fillEllipse(16, 14, 20, 14);
        g.fillStyle(0x000000); g.fillCircle(11, 13, 3); g.fillCircle(21, 13, 3);
        g.fillStyle(0xffffff); g.fillCircle(12, 12, 1); g.fillCircle(22, 12, 1);
        g.generateTexture('slime', 32, 32);

        // Chest closed
        g.clear();
        g.fillStyle(0x8B4513); g.fillRect(2, 8, 28, 20);
        g.fillStyle(0xCD853F); g.fillRect(4, 10, 24, 16);
        g.fillStyle(0xffcc00); g.fillRect(2, 6, 28, 6);
        g.fillStyle(0xffaa00); g.fillRect(12, 14, 8, 8);
        g.fillStyle(0xddaa00); g.fillCircle(16, 16, 3);
        g.generateTexture('chest_closed', 32, 32);

        // Chest open
        g.clear();
        g.fillStyle(0x8B4513); g.fillRect(2, 14, 28, 16);
        g.fillStyle(0xCD853F); g.fillRect(4, 16, 24, 12);
        g.fillStyle(0x8B4513); g.fillRect(2, 6, 28, 8);
        g.fillStyle(0xCD853F); g.fillRect(4, 8, 24, 4);
        g.fillStyle(0xffee00); g.fillCircle(16, 16, 5);
        g.generateTexture('chest_open', 32, 32);

        // Key item
        g.clear();
        g.fillStyle(0xffdd00); g.fillCircle(8, 8, 7);
        g.fillStyle(0xffee88); g.fillCircle(8, 8, 4);
        g.fillStyle(0xffdd00); g.fillRect(12, 6, 14, 5);
        g.fillRect(20, 11, 4, 4); g.fillRect(24, 11, 3, 3);
        g.generateTexture('key_item', 32, 24);

        // Boss sprite
        g.clear();
        g.fillStyle(0xaa0000); g.fillEllipse(40, 44, 72, 60);
        g.fillStyle(0xcc1111); g.fillEllipse(40, 24, 60, 44);
        g.fillStyle(0x880000);
        g.fillTriangle(10, 20, 20, 2, 28, 18);
        g.fillTriangle(52, 20, 60, 2, 70, 18);
        g.fillStyle(0xffff00); g.fillEllipse(26, 22, 16, 14); g.fillEllipse(54, 22, 16, 14);
        g.fillStyle(0x000000); g.fillCircle(26, 22, 5); g.fillCircle(54, 22, 5);
        g.fillStyle(0xff0000); g.fillCircle(27, 21, 2); g.fillCircle(55, 21, 2);
        g.fillStyle(0x000000); g.fillRect(18, 35, 44, 8);
        g.fillStyle(0xffffff);
        for (let i = 0; i < 5; i++) g.fillRect(20 + i * 8, 35, 4, 6);
        g.generateTexture('boss', 80, 80);

        // Door locked
        g.clear();
        g.fillStyle(0x8b1a1a); g.fillRect(0, 0, TILE * 2, TILE);
        g.fillStyle(0xcc2222); g.fillRect(2, 2, TILE * 2 - 4, TILE - 4);
        g.fillStyle(0xff4444); g.fillCircle(TILE, TILE / 2, 10);
        g.fillStyle(0xffaa00); g.fillRect(TILE - 4, TILE / 2 - 6, 8, 12);
        g.generateTexture('door_locked', TILE * 2, TILE);

        // Door open
        g.clear();
        g.fillStyle(0x050510); g.fillRect(0, 0, TILE * 2, TILE);
        g.lineStyle(3, 0x33ff99); g.strokeRect(1, 1, TILE * 2 - 2, TILE - 2);
        g.generateTexture('door_open', TILE * 2, TILE);

        // Boss door
        g.clear();
        g.fillStyle(0x1a0000); g.fillRect(0, 0, TILE * 2, TILE);
        g.fillStyle(0x550000); g.fillRect(2, 2, TILE * 2 - 4, TILE - 4);
        g.fillStyle(0xaa0000);
        for (let i = 0; i < 4; i++) g.fillCircle(16 + i * 20, TILE / 2, 6);
        g.lineStyle(3, 0xff0000); g.strokeRect(1, 1, TILE * 2 - 2, TILE - 2);
        g.generateTexture('door_boss', TILE * 2, TILE);

        // Sword swing arc
        g.clear();
        g.fillStyle(0xddeeff, 0.85);
        g.fillTriangle(0, 16, 32, 0, 32, 32);
        g.lineStyle(2, 0xffffff);
        g.strokeTriangle(0, 16, 32, 0, 32, 32);
        g.generateTexture('sword_swing', 32, 32);

        // Bomb
        g.clear();
        g.fillStyle(0x222222); g.fillCircle(12, 14, 10);
        g.fillStyle(0x555555); g.fillCircle(14, 12, 3);
        g.fillStyle(0xff8800); g.fillRect(11, 2, 3, 7);
        g.generateTexture('bomb_obj', 24, 24);

        // Explosion
        g.clear();
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const r = 22;
          g.fillStyle(0xff8800, 0.9);
          g.fillCircle(30 + Math.cos(angle) * r, 30 + Math.sin(angle) * r, 10);
        }
        g.fillStyle(0xffff00, 0.8); g.fillCircle(30, 30, 18);
        g.fillStyle(0xffffff, 0.6); g.fillCircle(30, 30, 8);
        g.generateTexture('explosion', 60, 60);

        // Shield
        g.clear();
        g.fillStyle(0x2244cc); g.fillRoundedRect(0, 0, 16, 22, 3);
        g.fillStyle(0x4488ff); g.fillRect(4, 4, 8, 10);
        g.fillStyle(0xffffff); g.fillCircle(8, 8, 2);
        g.generateTexture('shield_vis', 16, 22);

        // Projectile
        g.clear();
        g.fillStyle(0xff4400); g.fillCircle(6, 6, 6);
        g.fillStyle(0xff8800); g.fillCircle(6, 6, 3);
        g.generateTexture('projectile', 12, 12);

        g.destroy();
      }

      // ══════════════════════════════════════════
      // GROUPS
      // ══════════════════════════════════════════
      _createGroups() {
        this.wallGroup   = this.physics.add.staticGroup();
        this.enemyGroup  = this.physics.add.group();
        this.chestGroup  = this.physics.add.staticGroup();
        this.doorGroup   = this.physics.add.staticGroup();
        this.bombGroup   = this.physics.add.group();
        this.swordGroup  = this.physics.add.group();
        this.projGroup   = this.physics.add.group();
      }

      // ══════════════════════════════════════════
      // ROOM BUILDER
      // ══════════════════════════════════════════
      _buildRoom(roomIndex) {
        this.wallGroup.clear(true, true);
        this.enemyGroup.clear(true, true);
        this.chestGroup.clear(true, true);
        this.doorGroup.clear(true, true);
        this.projGroup.clear(true, true);
        this.bombList.forEach(b => { if (b && b.active) b.destroy(); });
        this.bombList = [];
        if (this.mapLayer) { this.mapLayer.destroy(); this.mapLayer = null; }
        if (this.bossObj) { this.bossObj.destroy(); this.bossObj = null; }
        if (this.bossAura) { this.bossAura.destroy(); this.bossAura = null; }
        if (this.bossGlow) { this.bossGlow.destroy(); this.bossGlow = null; }
        this.bossActive = false;
        this.northDoor  = null;

        const W = COLS * TILE;
        const H = ROWS * TILE;

        // Floor
        const floorGfx = this.add.graphics().setDepth(0);
        this.mapLayer = floorGfx;
        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            const isEdge = (row === 0 || row === ROWS - 1 || col === 0 || col === COLS - 1);
            floorGfx.fillStyle(isEdge ? 0x0d0d1a : 0x16162a);
            floorGfx.fillRect(col * TILE, row * TILE, TILE, TILE);
            if (!isEdge) {
              floorGfx.lineStyle(1, 0x222244, 0.35);
              floorGfx.strokeRect(col * TILE, row * TILE, TILE, TILE);
            }
          }
        }

        // Helper to add wall
        const addWall = (x, y, w, h) => {
          const wall = this.add.rectangle(x, y, w, h, 0x0d0d1a).setDepth(1);
          wall.setStrokeStyle(2, 0x333388);
          this.physics.add.existing(wall, true);
          this.wallGroup.add(wall);
        };

        const MID_X = W / 2;
        const GAP   = TILE * 2;

        // Outer walls with north/south door gap
        // Top wall – left segment
        addWall((MID_X - GAP) / 2, TILE / 2, MID_X - GAP, TILE);
        // Top wall – right segment
        addWall(MID_X + GAP + (W - MID_X - GAP) / 2, TILE / 2, W - MID_X - GAP, TILE);
        // Bottom wall
        addWall(W / 2, H - TILE / 2, W, TILE);
        // Left wall
        addWall(TILE / 2, H / 2, TILE, H);
        // Right wall
        addWall(W - TILE / 2, H / 2, TILE, H);

        // Interior layout
        const layout = this._getRoomLayout(roomIndex);
        layout.walls.forEach(([col, row, wC, hR]) => {
          addWall(col * TILE + (wC * TILE) / 2, row * TILE + (hR * TILE) / 2, wC * TILE, hR * TILE);
        });

        // North door
        const isBossRoom = roomIndex === 4;
        if (!isBossRoom) {
          const doorTex = roomIndex === 3 ? 'door_boss' : 'door_locked';
          const nd = this.add.image(MID_X, TILE / 2, doorTex).setDepth(2).setOrigin(0.5, 0.5);
          this.physics.add.existing(nd, true);
          nd.body.setSize(GAP, TILE);
          nd.doorType = 'north';
          this.doorGroup.add(nd);
          this.northDoor = nd;
        }

        // Chest
        if (!isBossRoom && layout.chest) {
          const [cx, cy] = layout.chest;
          const chest = this.add.image(cx * TILE + TILE / 2, cy * TILE + TILE / 2, 'chest_closed')
            .setDepth(5).setScale(1.1);
          this.physics.add.existing(chest, true);
          chest.body.setSize(28, 28);
          chest.isOpen = false;
          chest.qIndex = Phaser.Math.Between(0, GEOGRAPHY_QUESTIONS.length - 1);
          this.chestGroup.add(chest);
          this.tweens.add({
            targets: chest, alpha: { from: 0.85, to: 1 },
            yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut'
          });
        }

        // Enemies
        layout.enemies.forEach(([ex, ey]) => this._spawnSlime(ex * TILE + TILE / 2, ey * TILE + TILE / 2));

        // Boss
        if (isBossRoom) this._spawnBoss();

        // Decor
        this._addDecor(roomIndex, W, H);
      }

      _getRoomLayout(roomIndex) {
        const layouts = [
          { // Room 0 – pillars
            walls:   [[4,4,2,2],[14,4,2,2],[4,9,2,2],[14,9,2,2]],
            chest:   [10,7],
            enemies: [[6,6],[12,6],[9,10]],
          },
          { // Room 1 – corridors
            walls:   [[3,3,4,1],[13,3,4,1],[3,11,4,1],[13,11,4,1],[8,6,1,3]],
            chest:   [16,7],
            enemies: [[5,5],[15,5],[5,10],[15,10]],
          },
          { // Room 2 – maze
            walls:   [[2,5,1,5],[7,3,6,1],[7,11,6,1],[17,5,1,5],[10,5,1,5]],
            chest:   [3,7],
            enemies: [[12,7],[6,7],[15,7],[10,3],[10,11]],
          },
          { // Room 3 – arena
            walls:   [[5,5,1,1],[14,5,1,1],[5,9,1,1],[14,9,1,1],[9,6,2,1],[9,8,2,1]],
            chest:   [9,7],
            enemies: [[4,4],[15,4],[4,11],[15,11],[7,7],[12,7]],
          },
          { // Boss arena
            walls:   [[2,2,1,1],[17,2,1,1],[2,12,1,1],[17,12,1,1]],
            chest:   null,
            enemies: [],
          },
        ];
        return layouts[Math.min(roomIndex, 4)];
      }

      _addDecor(roomIndex, W, H) {
        // Corner torches
        [[TILE * 1.5, TILE * 1.5],[W - TILE * 1.5, TILE * 1.5],
         [TILE * 1.5, H - TILE * 1.5],[W - TILE * 1.5, H - TILE * 1.5]].forEach(([tx, ty]) => {
          const t = this.add.graphics().setDepth(3);
          t.fillStyle(0xffaa00, 0.9); t.fillRect(-4, -10, 8, 14);
          t.fillStyle(0xff6600);      t.fillRect(-3, -14, 6, 6);
          t.fillStyle(0xffff00);      t.fillCircle(0, -16, 4);
          t.setPosition(tx, ty);
          this.tweens.add({
            targets: t, alpha: { from: 0.7, to: 1 }, scaleX: { from: 0.9, to: 1.1 },
            yoyo: true, repeat: -1, duration: 280 + Math.random() * 180, ease: 'Sine.easeInOut'
          });
          const glow = this.add.graphics().setDepth(2);
          glow.fillStyle(0xffaa00, 0.06); glow.fillCircle(tx, ty, 55);
        });

        const labels = ['Room 1', 'Room 2', 'Room 3', 'Room 4 – Boss Entrance', '☠ Boss Chamber'];
        const lbl = this.add.text(W / 2, TILE * 1.1, labels[Math.min(roomIndex, 4)], {
          fontSize: '13px', fill: '#555588', fontFamily: 'monospace'
        }).setOrigin(0.5, 0).setDepth(4);
        this.tweens.add({ targets: lbl, alpha: 0, delay: 3000, duration: 1200 });
      }

      // ══════════════════════════════════════════
      // PLAYER
      // ══════════════════════════════════════════
      _createPlayer() {
        const W = COLS * TILE, H = ROWS * TILE;
        this.player = this.physics.add.sprite(W / 2, H - TILE * 2, 'player').setDepth(10);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(22, 22).setOffset(5, 8);

        this.playerTrail = this.add.particles(0, 0, 'dot', {
          speed: 0, scale: { start: 0.5, end: 0 },
          alpha: { start: 0.35, end: 0 },
          lifespan: 320, blendMode: 'ADD', tint: 0x22ff88, frequency: 55,
        }).setDepth(9);
        this.playerTrail.startFollow(this.player);

        this.shieldSprite = this.add.image(0, 0, 'shield_vis').setVisible(false).setDepth(11);
      }

      // ══════════════════════════════════════════
      // UI
      // ══════════════════════════════════════════
      _createUI() {
        this.uiCont = this.add.container(0, 0).setDepth(100);

        // HP bg
        const hpBg = this.add.graphics();
        hpBg.fillStyle(0x000000, 0.6);
        hpBg.fillRoundedRect(6, 6, 200, 38, 6);
        this.uiCont.add(hpBg);

        // Hearts
        this.heartGfx = [];
        for (let i = 0; i < this.maxHP; i++) {
          const hg = this.add.graphics();
          this._drawHeart(hg, 14 + i * 30, 12, true);
          this.uiCont.add(hg);
          this.heartGfx.push(hg);
        }

        // Bomb / key text
        this.bombText = this.add.text(8, 52, '💣 3', {
          fontSize: '15px', fill: '#ffcc00', fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
        });
        this.keyText = this.add.text(80, 52, '🔑 0/4', {
          fontSize: '15px', fill: '#ffdd00', fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
        });
        this.uiCont.add([this.bombText, this.keyText]);

        // Boss HP
        this.bossHPBg  = this.add.graphics().setVisible(false);
        this.bossHPBar = this.add.graphics().setVisible(false);
        this.bossLabel = this.add.text(COLS * TILE / 2, 10, '☠ DUNGEON LORD', {
          fontSize: '13px', fill: '#ff4444', fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5, 0).setVisible(false);
        this.uiCont.add([this.bossHPBg, this.bossHPBar, this.bossLabel]);

        // Banner graphics & text
        this.bannerGfx       = this.add.graphics().setDepth(199);
        this.bannerTxt       = this.add.text(COLS * TILE / 2, ROWS * TILE / 2, '', {
          fontSize: '20px', fill: '#ffffff', fontFamily: 'monospace',
          stroke: '#000', strokeThickness: 4, align: 'center', wordWrap: { width: 520 }
        }).setOrigin(0.5).setDepth(200).setVisible(false);
        this.quizInputTxt    = this.add.text(COLS * TILE / 2, ROWS * TILE / 2 + 70, '', {
          fontSize: '24px', fill: '#00ffcc', fontFamily: 'monospace', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(201).setVisible(false);

        // Instructions
        this.add.text(COLS * TILE / 2, ROWS * TILE - 18,
          'WASD: Move  |  Z/Space: Sword  |  X: Shield (hold)  |  C: Bomb',
          { fontSize: '12px', fill: '#445566', fontFamily: 'monospace' }
        ).setOrigin(0.5, 1).setDepth(5);
      }

      _drawHeart(gfx, x, y, filled) {
        gfx.clear();
        gfx.fillStyle(filled ? 0xff2244 : 0x331122);
        gfx.fillCircle(x + 5,  y + 5, 5);
        gfx.fillCircle(x + 15, y + 5, 5);
        gfx.fillTriangle(x, y + 8, x + 20, y + 8, x + 10, y + 22);
        if (filled) { gfx.fillStyle(0xff6677, 0.6); gfx.fillCircle(x + 7, y + 4, 2); }
      }

      _updateUI() {
        for (let i = 0; i < this.maxHP; i++)
          this._drawHeart(this.heartGfx[i], 14 + i * 30, 12, i < this.playerHP);
        this.bombText.setText(`💣 ${this.bombs}`);
        this.keyText.setText(`🔑 ${this.keysCount}/4`);

        if (this.bossActive) {
          const bx = COLS * TILE / 2 - 110;
          const frac = Math.max(0, this.bossHP / 20);
          this.bossHPBg.setVisible(true).clear();
          this.bossHPBg.fillStyle(0x000000, 0.7);
          this.bossHPBg.fillRoundedRect(bx - 10, 8, 240, 30, 6);
          this.bossHPBar.setVisible(true).clear();
          this.bossHPBar.fillStyle(0x440000);
          this.bossHPBar.fillRoundedRect(bx, 14, 220, 16, 4);
          this.bossHPBar.fillStyle(0xff2222);
          this.bossHPBar.fillRoundedRect(bx, 14, 220 * frac, 16, 4);
          this.bossLabel.setVisible(true);
        }
      }

      _showBanner(msg, duration, color) {
        color = color || '#ffffff';
        const W = COLS * TILE, H = ROWS * TILE;
        this.bannerGfx.clear();
        this.bannerGfx.fillStyle(0x000020, 0.88);
        this.bannerGfx.fillRoundedRect(W / 2 - 310, H / 2 - 95, 620, 190, 14);
        this.bannerGfx.lineStyle(4, 0x0066cc);
        this.bannerGfx.strokeRoundedRect(W / 2 - 310, H / 2 - 95, 620, 190, 14);
        this.bannerTxt.setText(msg).setColor(color).setVisible(true);
        if (duration > 0) {
          this.time.delayedCall(duration, () => {
            this.bannerGfx.clear();
            this.bannerTxt.setVisible(false);
          });
        }
      }

      _flashMessage(msg) {
        if (this._flashMsg && this._flashMsg.active) return;
        const W = COLS * TILE;
        const g = this.add.graphics().setDepth(150);
        g.fillStyle(0x000000, 0.75); g.fillRoundedRect(W / 2 - 190, 78, 380, 46, 8);
        const t = this.add.text(W / 2, 100, msg, {
          fontSize: '16px', fill: '#ffcc00', fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(151);
        this._flashMsg = t;
        this.tweens.add({
          targets: [g, t], alpha: 0, delay: 1800, duration: 400,
          onComplete: () => { g.destroy(); t.destroy(); }
        });
      }

      // ══════════════════════════════════════════
      // INPUTS
      // ══════════════════════════════════════════
      _createInputs() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
          up:    Phaser.Input.Keyboard.KeyCodes.W,
          down:  Phaser.Input.Keyboard.KeyCodes.S,
          left:  Phaser.Input.Keyboard.KeyCodes.A,
          right: Phaser.Input.Keyboard.KeyCodes.D,
        });
        this.keyZ     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyX     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.keyC     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.input.keyboard.on('keydown', (event) => {
          if (!this.quizActive) return;
          if (event.key === 'Enter') {
            this._submitAnswer();
          } else if (event.key === 'Backspace') {
            this.quizAnswer = this.quizAnswer.slice(0, -1);
            this.quizInputTxt.setText(this.quizAnswer + '█');
          } else if (event.key.length === 1 && this.quizAnswer.length < 30) {
            this.quizAnswer += event.key;
            this.quizInputTxt.setText(this.quizAnswer + '█');
          }
        });
      }

      // ══════════════════════════════════════════
      // COLLIDERS
      // ══════════════════════════════════════════
      _createColliders() {
        this.physics.add.collider(this.player, this.wallGroup);
        this.physics.add.collider(this.enemyGroup, this.wallGroup);
        this.physics.add.collider(this.enemyGroup, this.enemyGroup);
        this.physics.add.collider(this.bombGroup, this.wallGroup);

        this.physics.add.overlap(this.player, this.enemyGroup, (_p, enemy) => {
          this._playerHitByEnemy(enemy);
        });
        this.physics.add.overlap(this.swordGroup, this.enemyGroup, (_s, enemy) => {
          this._swordHitEnemy(enemy);
        });
        this.physics.add.overlap(this.player, this.doorGroup, (_p, door) => {
          this._playerTouchDoor(door);
        });
        this.physics.add.overlap(this.player, this.chestGroup, (_p, chest) => {
          if (!chest.isOpen && !this.quizActive) this._openChest(chest);
        });
        this.physics.add.overlap(this.player, this.projGroup, (_p, proj) => {
          if (!proj.active) return;
          proj.destroy();
          this._damagePlayer(1);
        });
      }

      // ══════════════════════════════════════════
      // AMBIENT
      // ══════════════════════════════════════════
      _startAmbient() {
        this.add.particles(0, 0, 'dot', {
          x: { min: 0, max: COLS * TILE }, y: { min: 0, max: ROWS * TILE },
          speed: { min: 10, max: 25 },
          angle: { min: 200, max: 340 },
          scale: { start: 0.35, end: 0 },
          alpha: { start: 0.12, end: 0 },
          lifespan: 4500,
          tint: [0x4444ff, 0x8844ff, 0x4488ff],
          frequency: 220,
        }).setDepth(3);
      }

      // ══════════════════════════════════════════
      // SLIME ENEMY
      // ══════════════════════════════════════════
      _spawnSlime(x, y) {
        const slime = this.physics.add.sprite(x, y, 'slime').setDepth(8);
        slime.setCollideWorldBounds(true);
        slime.body.setSize(24, 18).setOffset(4, 10);
        slime.hp           = 3;
        slime.hitTime      = 0;
        slime.patrolTarget = { x, y };
        slime.patrolTimer  = 0;

        this.tweens.add({
          targets: slime, scaleY: 0.8, scaleX: 1.15,
          yoyo: true, repeat: -1, duration: 380 + Math.random() * 180, ease: 'Sine.easeInOut'
        });

        const trail = this.add.particles(0, 0, 'dot', {
          speed: 0, scale: { start: 0.6, end: 0 },
          alpha: { start: 0.5, end: 0 },
          lifespan: 380, blendMode: 'ADD', tint: 0x00ff66, frequency: 80,
        }).setDepth(7);
        trail.startFollow(slime);
        slime.trail = trail;

        this.enemyGroup.add(slime);
        return slime;
      }

      // ══════════════════════════════════════════
      // BOSS
      // ══════════════════════════════════════════
      _spawnBoss() {
        const W = COLS * TILE;
        this.bossObj = this.physics.add.sprite(W / 2, ROWS * TILE / 3, 'boss')
          .setDepth(8).setScale(1.4);
        this.bossObj.setCollideWorldBounds(true);
        this.bossObj.body.setSize(60, 60).setOffset(10, 16);
        this.bossHP    = 20;
        this.bossHitTime = 0;
        this.bossPhase = 1;
        this.bossAngle = 0;
        this.bossActive = true;

        this.bossGlow = this.add.graphics().setDepth(7);
        this.bossGlow.fillStyle(0xff0000, 0.1);
        this.bossGlow.fillCircle(W / 2, ROWS * TILE / 3, 80);

        this.tweens.add({
          targets: this.bossObj, scaleX: 1.5, scaleY: 1.3,
          yoyo: true, repeat: -1, duration: 800, ease: 'Sine.easeInOut'
        });

        this.bossAura = this.add.particles(0, 0, 'dot', {
          speed: { min: 50, max: 90 }, angle: { min: 0, max: 360 },
          scale: { start: 1.2, end: 0 }, alpha: { start: 0.7, end: 0 },
          lifespan: 600, blendMode: 'ADD', tint: [0xff0000, 0xff4400, 0xaa0000], frequency: 40,
        }).setDepth(9);
        this.bossAura.startFollow(this.bossObj);

        this.physics.add.overlap(this.swordGroup, this.bossObj, () => this._swordHitBoss());
        this.physics.add.overlap(this.player, this.bossObj, () => this._playerHitByEnemy(this.bossObj));

        this._showBanner('☠ DUNGEON LORD AWAKENS!\nUse your sword! Block with X!\nType geography answers to earn keys!', 3500, '#ff4444');
      }

      // ══════════════════════════════════════════
      // SWORD
      // ══════════════════════════════════════════
      _swingSword() {
        if (this.swingCooldown > 0 || this.swinging || this.quizActive) return;
        this.swinging = true;
        this.swingCooldown = 380;

        const OFFSETS = {
          right: { ox: 28,  oy: 0,   angle: 0   },
          left:  { ox: -28, oy: 0,   angle: 180 },
          up:    { ox: 0,   oy: -28, angle: -90 },
          down:  { ox: 0,   oy: 28,  angle: 90  },
        };
        const off = OFFSETS[this.playerFacing];
        const sx = this.player.x + off.ox;
        const sy = this.player.y + off.oy;

        const sword = this.physics.add.image(sx, sy, 'sword_swing')
          .setAngle(off.angle).setDepth(12).setScale(1.4);
        sword.body.setSize(28, 28);
        this.swordGroup.add(sword);

        this.tweens.add({
          targets: sword, angle: off.angle + 90,
          alpha: { from: 1, to: 0 }, duration: 260, ease: 'Quad.easeOut',
          onComplete: () => { sword.destroy(); this.swinging = false; }
        });

        this.cameras.main.shake(70, 0.003);

        // Spark
        const flash = this.add.graphics().setDepth(13);
        flash.fillStyle(0xddeeff, 0.55);
        flash.fillCircle(sx, sy, 20);
        this.tweens.add({ targets: flash, alpha: 0, duration: 180, onComplete: () => flash.destroy() });
      }

      // ══════════════════════════════════════════
      // BOMB
      // ══════════════════════════════════════════
      _placeBomb() {
        if (this.bombs <= 0 || this.bombCooldown > 0 || this.quizActive) return;
        this.bombs--;
        this.bombCooldown = 1200;

        const bomb = this.physics.add.image(this.player.x, this.player.y, 'bomb_obj')
          .setDepth(6);
        bomb.body.setSize(20, 20).setImmovable(true);
        this.bombList.push(bomb);

        this.tweens.add({
          targets: bomb, alpha: { from: 1, to: 0.2 },
          yoyo: true, repeat: 5, duration: 175,
          onComplete: () => { if (bomb.active) this._explodeBomb(bomb); }
        });
      }

      _explodeBomb(bomb) {
        const ex = bomb.x, ey = bomb.y;
        if (bomb.active) bomb.destroy();

        const expl = this.add.image(ex, ey, 'explosion').setDepth(15);
        this.cameras.main.shake(280, 0.022);
        this._spawnParticles(ex, ey, 0xff8800, 38);
        this._spawnParticles(ex, ey, 0xffff00, 18);

        this.enemyGroup.getChildren().forEach(e => {
          if (Phaser.Math.Distance.Between(ex, ey, e.x, e.y) < 80) this._killEnemy(e, true);
        });
        if (this.bossObj && this.bossActive) {
          if (Phaser.Math.Distance.Between(ex, ey, this.bossObj.x, this.bossObj.y) < 100) this._hitBoss(3);
        }
        if (Phaser.Math.Distance.Between(ex, ey, this.player.x, this.player.y) < 58) this._damagePlayer(1);

        this.tweens.add({
          targets: expl, scale: 2.4, alpha: 0, duration: 480, ease: 'Expo.easeOut',
          onComplete: () => expl.destroy()
        });
      }

      // ══════════════════════════════════════════
      // ENEMY HIT / KILL
      // ══════════════════════════════════════════
      _swordHitEnemy(enemy) {
        if (!enemy.active || (enemy.hitTime || 0) > 0) return;
        enemy.hitTime = 580;
        enemy.hp--;

        enemy.setTint(0xffffff);
        this.time.delayedCall(140, () => enemy.active && enemy.clearTint());

        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
        enemy.body.setVelocity(Math.cos(angle) * 280, Math.sin(angle) * 280);
        this.time.delayedCall(200, () => enemy.active && enemy.body.setVelocity(0, 0));

        this._spawnParticles(enemy.x, enemy.y, 0x00ff66, 10);
        this.cameras.main.shake(90, 0.007);

        if (enemy.hp <= 0) this._killEnemy(enemy, false);
      }

      _killEnemy(enemy, fromBomb) {
        if (!enemy.active) return;
        if (enemy.trail) { enemy.trail.destroy(); enemy.trail = null; }
        this._spawnParticles(enemy.x, enemy.y, fromBomb ? 0xff6600 : 0x00ff88, 24);
        this.cameras.main.shake(120, 0.009);
        enemy.destroy();
      }

      _swordHitBoss() {
        if (!this.bossActive || this.bossHitTime > 0) return;
        this._hitBoss(1);
      }

      _hitBoss(dmg) {
        if (!this.bossActive) return;
        this.bossHitTime = 380;
        this.bossHP = Math.max(0, this.bossHP - dmg);

        this.bossObj.setTint(0xffffff);
        this.time.delayedCall(180, () => this.bossObj && this.bossObj.active && this.bossObj.clearTint());
        this._spawnParticles(this.bossObj.x, this.bossObj.y, 0xff0000, 14);
        this.cameras.main.shake(190, 0.014);

        if (this.bossHP <= 10 && this.bossPhase === 1) {
          this.bossPhase = 2;
          this._showBanner('☠ DUNGEON LORD ENRAGES!\nPhase 2 – Dodge the projectiles!', 2200, '#ff6600');
          if (this.bossObj.active) this.bossObj.setTint(0xff4400);
        }

        if (this.bossHP <= 0) this._defeatBoss();
      }

      _defeatBoss() {
        this.bossActive = false;
        this.victory = true;

        this._spawnParticles(this.bossObj.x, this.bossObj.y, 0xffff00, 80);
        this._spawnParticles(this.bossObj.x, this.bossObj.y, 0xff4400, 55);
        this.cameras.main.shake(600, 0.04);
        this.cameras.main.flash(1000, 255, 200, 0);

        if (this.bossAura) { this.bossAura.destroy(); this.bossAura = null; }
        if (this.bossGlow) { this.bossGlow.destroy(); this.bossGlow = null; }
        this.bossObj.destroy(); this.bossObj = null;

        const W = COLS * TILE, H = ROWS * TILE;
        this.bannerGfx.clear();
        this.bannerGfx.fillStyle(0x001100, 0.9);
        this.bannerGfx.fillRoundedRect(W / 2 - 300, H / 2 - 80, 600, 160, 14);
        this.bannerGfx.lineStyle(5, 0xffdd00);
        this.bannerGfx.strokeRoundedRect(W / 2 - 300, H / 2 - 80, 600, 160, 14);
        this.bannerTxt.setText('🏆 VICTORY!\nThe Dungeon Lord is defeated!\nYour geography knowledge saved the realm!')
          .setColor('#ffdd00').setVisible(true);

        this.add.particles(W / 2, -20, 'dot', {
          speed: { min: 100, max: 350 }, angle: { min: 60, max: 120 },
          scale: { start: 1.8, end: 0.2 }, lifespan: 3200,
          tint: [0xffdd00, 0xff6600, 0x00ffcc, 0xff00ff], frequency: 45,
        }).setDepth(500);
      }

      // ══════════════════════════════════════════
      // PLAYER DAMAGE
      // ══════════════════════════════════════════
      _playerHitByEnemy(enemy) {
        if (this.playerInvTime > 0 || this.gameOver || this.victory) return;
        if (this.shielding) {
          this._spawnParticles(this.player.x, this.player.y, 0x4488ff, 12);
          this.cameras.main.shake(70, 0.005);
          return;
        }
        this._damagePlayer(1);
        if (enemy && enemy.active) {
          const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
          this.player.body.setVelocity(Math.cos(angle) * 380, Math.sin(angle) * 380);
          this.time.delayedCall(240, () => this.player.active && this.player.body.setVelocity(0, 0));
        }
      }

      _damagePlayer(dmg) {
        if (this.playerInvTime > 0 || this.gameOver) return;
        this.playerHP -= dmg;
        this.playerInvTime = 1400;
        this.cameras.main.shake(200, 0.02);
        this._spawnParticles(this.player.x, this.player.y, 0xff2244, 14);
        this.tweens.add({
          targets: this.player, alpha: 0.2, yoyo: true, repeat: 6, duration: 95,
          onComplete: () => this.player.active && this.player.setAlpha(1)
        });
        if (this.playerHP <= 0) { this.playerHP = 0; this._gameOver(); }
      }

      _gameOver() {
        this.gameOver = true;
        this.player.setTint(0xff0000);
        this.cameras.main.shake(500, 0.04);
        this.cameras.main.flash(600, 255, 0, 0);

        const W = COLS * TILE, H = ROWS * TILE;
        this.bannerGfx.clear();
        this.bannerGfx.fillStyle(0x1a0000, 0.9);
        this.bannerGfx.fillRoundedRect(W / 2 - 260, H / 2 - 65, 520, 130, 12);
        this.bannerGfx.lineStyle(4, 0xff2222);
        this.bannerGfx.strokeRoundedRect(W / 2 - 260, H / 2 - 65, 520, 130, 12);
        this.bannerTxt.setText('💀 GAME OVER\nThe dungeon claimed your soul!\nPress R to restart')
          .setColor('#ff4444').setVisible(true);

        this.input.keyboard.once('keydown-R', () => this.scene.restart());
      }

      // ══════════════════════════════════════════
      // DOOR LOGIC
      // ══════════════════════════════════════════
      _playerTouchDoor(door) {
        if (!door.doorType || this.quizActive) return;
        if (door.doorType === 'north') {
          if (this.enemyGroup.getLength() > 0) {
            this._flashMessage('Defeat all enemies first!');
            return;
          }
          if (this.currentRoom === 3 && this.keysCount < 4) {
            this._flashMessage(`Need 4 keys! (${this.keysCount}/4)`);
            return;
          }
          this._goNextRoom();
        }
      }

      _goNextRoom() {
        if (this._transitioning) return;
        this._transitioning = true;
        this.cameras.main.flash(350, 255, 255, 255);
        this.time.delayedCall(280, () => {
          this._transitioning = false;
          this.currentRoom++;
          this._buildRoom(this.currentRoom);
          this.player.setPosition(COLS * TILE / 2, ROWS * TILE - TILE * 2);
          this.player.setAlpha(0);
          this.tweens.add({ targets: this.player, alpha: 1, duration: 450 });
          this._createColliders();
        });
      }

      // ══════════════════════════════════════════
      // CHEST & QUIZ
      // ══════════════════════════════════════════
      _openChest(chest) {
        if (chest.isOpen || this.quizActive) return;
        chest.isOpen = true;
        chest.setTexture('chest_open');

        const qData = GEOGRAPHY_QUESTIONS[chest.qIndex];
        this.quizActive     = true;
        this.quizAnswer     = '';
        this.quizCorrectAns = qData.a;

        const W = COLS * TILE, H = ROWS * TILE;
        this.bannerGfx.clear();
        this.bannerGfx.fillStyle(0x000020, 0.9);
        this.bannerGfx.fillRoundedRect(W / 2 - 310, H / 2 - 100, 620, 200, 14);
        this.bannerGfx.lineStyle(4, 0x00ccff);
        this.bannerGfx.strokeRoundedRect(W / 2 - 310, H / 2 - 100, 620, 200, 14);

        this.bannerTxt.setText(`📦 CHEST UNLOCKED — GEOGRAPHY QUIZ\n\n❓ ${qData.q}\n\nType your answer then press ENTER`)
          .setColor('#00ccff').setVisible(true);
        this.quizInputTxt.setText('█').setVisible(true);

        this._spawnParticles(chest.x, chest.y, 0xffdd00, 22);
        this.cameras.main.shake(140, 0.01);

        this.enemyGroup.getChildren().forEach(e => e.body && e.body.setVelocity(0, 0));
      }

      _submitAnswer() {
        if (!this.quizActive) return;
        const typed = this.quizAnswer.trim().toLowerCase();

        if (typed === this.quizCorrectAns) {
          this.quizActive = false;
          this.bannerGfx.clear();
          this.bannerTxt.setVisible(false);
          this.quizInputTxt.setVisible(false);

          this.keysCount++;
          this.cameras.main.shake(240, 0.014);
          this.cameras.main.flash(350, 0, 180, 100);
          this._spawnParticles(this.player.x, this.player.y, 0xffdd00, 35);
          this._spawnParticles(this.player.x, this.player.y, 0x00ffcc, 18);

          const kp = this.add.image(this.player.x, this.player.y - 28, 'key_item').setDepth(50).setScale(1.5);
          this.tweens.add({
            targets: kp, y: this.player.y - 85, alpha: 0, duration: 1100, ease: 'Quad.easeOut',
            onComplete: () => kp.destroy()
          });

          this._showBanner(`✅ CORRECT! "${this.quizCorrectAns.toUpperCase()}"\n🔑 Key acquired! (${this.keysCount}/4)\n${this.keysCount < 4 ? `Find ${4 - this.keysCount} more key(s)!` : '🚪 Boss door is unlocked!'}`,
            3000, '#00ffcc');
          this.quizAnswer = '';
        } else {
          // Wrong
          this.cameras.main.shake(280, 0.024);
          this._spawnParticles(this.player.x, this.player.y, 0xff2244, 18);
          for (let i = 0; i < 2; i++) {
            const ex = Phaser.Math.Between(TILE * 3, (COLS - 3) * TILE);
            const ey = Phaser.Math.Between(TILE * 3, (ROWS - 3) * TILE);
            this._spawnSlime(ex, ey);
          }
          this._createColliders();
          this.bannerTxt.setColor('#ff4444');
          this.time.delayedCall(350, () => this.bannerTxt.setColor('#00ccff'));
          this.quizAnswer = '';
          this.quizInputTxt.setText('❌ Wrong! Try again → █');
        }
      }

      // ══════════════════════════════════════════
      // PARTICLES
      // ══════════════════════════════════════════
      _spawnParticles(x, y, color, count) {
        const em = this.add.particles(x, y, 'dot', {
          speed: { min: 80, max: 310 }, angle: { min: 0, max: 360 },
          scale: { start: 1.5, end: 0 }, alpha: { start: 1, end: 0 },
          lifespan: 680, blendMode: 'ADD', tint: color, quantity: count,
        }).setDepth(20);
        em.explode(count, x, y);
        this.time.delayedCall(750, () => em.destroy());
      }

      // ══════════════════════════════════════════
      // BOSS SHOOT
      // ══════════════════════════════════════════
      _bossShoot() {
        if (!this.bossObj || !this.bossObj.active) return;
        const angle = Phaser.Math.Angle.Between(this.bossObj.x, this.bossObj.y, this.player.x, this.player.y);
        [-0.35, 0, 0.35].forEach(offset => {
          const proj = this.physics.add.image(this.bossObj.x, this.bossObj.y, 'projectile')
            .setScale(2.2).setDepth(15);
          const spd = 190;
          proj.body.setVelocity(Math.cos(angle + offset) * spd, Math.sin(angle + offset) * spd);
          this.projGroup.add(proj);
          this.time.delayedCall(2400, () => proj.active && proj.destroy());
        });
      }

      // ══════════════════════════════════════════
      // UPDATE
      // ══════════════════════════════════════════
      update(time, delta) {
        if (this.gameOver || this.victory) return;

        this.swingCooldown = Math.max(0, this.swingCooldown - delta);
        this.bombCooldown  = Math.max(0, this.bombCooldown - delta);
        this.playerInvTime = Math.max(0, this.playerInvTime - delta);
        this.bossHitTime   = Math.max(0, this.bossHitTime - delta);

        // Player movement
        if (!this.quizActive) {
          const speed = 220;
          let vx = 0, vy = 0;
          if (this.cursors.left.isDown  || this.wasd.left.isDown)  { vx = -speed; this.playerFacing = 'left'; }
          if (this.cursors.right.isDown || this.wasd.right.isDown) { vx =  speed; this.playerFacing = 'right'; }
          if (this.cursors.up.isDown    || this.wasd.up.isDown)    { vy = -speed; this.playerFacing = 'up'; }
          if (this.cursors.down.isDown  || this.wasd.down.isDown)  { vy =  speed; this.playerFacing = 'down'; }
          if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }

          this.shielding = this.keyX.isDown;
          this.shieldSprite.setVisible(this.shielding);
          if (this.shielding) {
            const SO = { right: [20, 0], left: [-20, 0], up: [0, -20], down: [0, 20] };
            const [sox, soy] = SO[this.playerFacing];
            this.shieldSprite.setPosition(this.player.x + sox, this.player.y + soy);
            vx *= 0.4; vy *= 0.4;
          }

          this.player.body.setVelocity(vx, vy);
          if (vx < 0) this.player.setFlipX(true);
          else if (vx > 0) this.player.setFlipX(false);

          // Sword
          if (Phaser.Input.Keyboard.JustDown(this.keyZ) || Phaser.Input.Keyboard.JustDown(this.keySPACE)) {
            if (!this.shielding) this._swingSword();
          }
          // Bomb
          if (Phaser.Input.Keyboard.JustDown(this.keyC)) this._placeBomb();
        } else {
          this.player.body.setVelocity(0, 0);
        }

        // Enemy AI
        this.enemyGroup.getChildren().forEach(enemy => {
          if (!enemy.active || this.quizActive) return;
          enemy.hitTime = Math.max(0, (enemy.hitTime || 0) - delta);
          const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
          if (dist < 260) {
            this.physics.moveToObject(enemy, this.player, 75 + this.currentRoom * 12);
          } else {
            enemy.patrolTimer = (enemy.patrolTimer || 0) - delta;
            if (enemy.patrolTimer <= 0) {
              enemy.patrolTimer = 1400 + Math.random() * 900;
              enemy.patrolTarget = {
                x: Phaser.Math.Clamp(enemy.x + Phaser.Math.Between(-100, 100), TILE * 2, (COLS - 2) * TILE),
                y: Phaser.Math.Clamp(enemy.y + Phaser.Math.Between(-100, 100), TILE * 2, (ROWS - 2) * TILE),
              };
            }
            this.physics.moveTo(enemy, enemy.patrolTarget.x, enemy.patrolTarget.y, 45);
          }
        });

        // Boss AI
        if (this.bossActive && this.bossObj && this.bossObj.active) {
          this.bossAngle += delta * 0.0018;
          const spd = this.bossPhase === 2 ? 135 : 75;
          if (this.bossPhase === 1) {
            const cx = this.player.x + Math.cos(this.bossAngle) * 175;
            const cy = this.player.y + Math.sin(this.bossAngle) * 175;
            this.physics.moveTo(this.bossObj, cx, cy, spd);
          } else {
            this.physics.moveToObject(this.bossObj, this.player, spd);
            this.bossShootTimer -= delta;
            if (this.bossShootTimer <= 0) {
              this.bossShootTimer = 1150;
              this._bossShoot();
            }
          }
          if (this.bossGlow) this.bossGlow.setPosition(this.bossObj.x, this.bossObj.y);
        }

        // Door unlock indicator
        if (this.northDoor && this.northDoor.active) {
          const canOpen = this.enemyGroup.getLength() === 0 &&
            (this.currentRoom < 3 || this.keysCount >= 4);
          if (canOpen) this.northDoor.setTexture('door_open');
        }

        this._updateUI();
      }
    }

    // ══════════════════════════════════════════
    // PHASER GAME CONFIG
    // ══════════════════════════════════════════
    const config = {
      type:            Phaser.AUTO,
      width:           COLS * TILE,
      height:          ROWS * TILE,
      parent:          gameRef.current,
      backgroundColor: '#0a0a15',
      physics: {
        default: 'arcade',
        arcade:  { gravity: { y: 0 }, debug: false },
      },
      scene: [DungeonScene],
    };

    const game = new Phaser.Game(config);
    return () => { game.destroy(true); };
  }, []);

  return (
    <div style={{
      position:     'relative',
      width:        `${COLS * TILE}px`,
      height:       `${ROWS * TILE}px`,
      margin:       '0 auto',
      boxShadow:    '0 0 40px rgba(30,30,120,0.8), 0 0 80px rgba(0,0,60,0.6)',
      borderRadius: '6px',
      overflow:     'hidden',
      border:       '2px solid #222255',
    }}>
      <div ref={gameRef} />
      <button
        onClick={onExit}
        style={{
          position:        'absolute',
          top:             '12px',
          right:           '12px',
          padding:         '7px 16px',
          fontSize:        '13px',
          fontWeight:      'bold',
          fontFamily:      'monospace',
          backgroundColor: '#cc2222',
          color:           '#ffffff',
          border:          '2px solid #ff6666',
          borderRadius:    '5px',
          cursor:          'pointer',
          zIndex:          1000,
          textTransform:   'uppercase',
          letterSpacing:   '1px',
          boxShadow:       '0 0 12px rgba(255,0,0,0.4)',
          transition:      'background-color 0.15s, box-shadow 0.15s',
        }}
        onMouseOver={e => {
          e.currentTarget.style.backgroundColor = '#ff3333';
          e.currentTarget.style.boxShadow = '0 0 22px rgba(255,0,0,0.75)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.backgroundColor = '#cc2222';
          e.currentTarget.style.boxShadow = '0 0 12px rgba(255,0,0,0.4)';
        }}
      >
        ✖ Beenden
      </button>
    </div>
  );
};

export default FaskaZeldaSwarm;
