import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const FaskaBomberman = ({ onExit }) => {
  const gameContainerRef = useRef(null);

  useEffect(() => {
    // ---------------------------------------------------------
    // Phaser Scene
    // ---------------------------------------------------------
    class MainScene extends Phaser.Scene {
      constructor() {
        super('MainScene');
        this.tileSize = 48;
        this.gridWidth = 15;
        this.gridHeight = 11;
        this.offsetX = (800 - this.gridWidth * this.tileSize) / 2;
        this.offsetY = (600 - this.gridHeight * this.tileSize) / 2 + 20;

        this.questions = [
          { country: 'Italien', capital: 'Rom' },
          { country: 'Frankreich', capital: 'Paris' },
          { country: 'Deutschland', capital: 'Berlin' },
          { country: 'Spanien', capital: 'Madrid' },
          { country: 'Österreich', capital: 'Wien' },
          { country: 'Schweiz', capital: 'Bern' },
          { country: 'Japan', capital: 'Tokio' },
          { country: 'Großbritannien', capital: 'London' }
        ];

        this.currentQuestion = null;
        this.health = 3;
        this.score = 0;
        this.isMoving = false;
        
        // Data structures
        this.grid = []; // 0 = empty, 1 = hard, 2 = soft
        this.softBlocks = {}; // key: "x,y", value: { sprite, text, isCorrect }
        this.bombs = {};
        this.explosions = [];
      }

      preload() {
        // Hard Block
        const gHard = this.make.graphics({ x: 0, y: 0, add: false });
        gHard.fillStyle(0x333333);
        gHard.fillRect(0, 0, this.tileSize, this.tileSize);
        gHard.lineStyle(2, 0x111111);
        gHard.strokeRect(0, 0, this.tileSize, this.tileSize);
        gHard.generateTexture('hardBlock', this.tileSize, this.tileSize);

        // Soft Block
        const gSoft = this.make.graphics({ x: 0, y: 0, add: false });
        gSoft.fillStyle(0x8B4513);
        gSoft.fillRect(0, 0, this.tileSize, this.tileSize);
        gSoft.lineStyle(2, 0x5C2E0B);
        gSoft.strokeRect(0, 0, this.tileSize, this.tileSize);
        gSoft.generateTexture('softBlock', this.tileSize, this.tileSize);

        // Player
        const gPlayer = this.make.graphics({ x: 0, y: 0, add: false });
        gPlayer.fillStyle(0x00FFFF);
        gPlayer.fillCircle(this.tileSize/2, this.tileSize/2, this.tileSize/2 - 4);
        gPlayer.lineStyle(2, 0xFFFFFF);
        gPlayer.strokeCircle(this.tileSize/2, this.tileSize/2, this.tileSize/2 - 4);
        gPlayer.generateTexture('player', this.tileSize, this.tileSize);

        // Bomb
        const gBomb = this.make.graphics({ x: 0, y: 0, add: false });
        gBomb.fillStyle(0x111111);
        gBomb.fillCircle(this.tileSize/2, this.tileSize/2, this.tileSize/2 - 6);
        gBomb.fillStyle(0xFF0000); // fuse
        gBomb.fillRect(this.tileSize/2 - 2, 4, 4, 8);
        gBomb.generateTexture('bomb', this.tileSize, this.tileSize);

        // Explosion center
        const gExplosion = this.make.graphics({ x: 0, y: 0, add: false });
        gExplosion.fillStyle(0xFFFF00);
        gExplosion.fillRect(0, 0, this.tileSize, this.tileSize);
        gExplosion.fillStyle(0xFF0000);
        gExplosion.fillRect(8, 8, this.tileSize - 16, this.tileSize - 16);
        gExplosion.generateTexture('explosion', this.tileSize, this.tileSize);

        // Particle
        const gParticle = this.make.graphics({ x: 0, y: 0, add: false });
        gParticle.fillStyle(0xFFA500);
        gParticle.fillCircle(4, 4, 4);
        gParticle.generateTexture('particle', 8, 8);
      }

      create() {
        this.createLevel();

        // Particles setup (supports both Phaser 3 older and newer APIs safely)
        try {
            // Newer phaser API
            this.emitter = this.add.particles(0, 0, 'particle', {
                speed: { min: -100, max: 100 },
                angle: { min: 0, max: 360 },
                scale: { start: 1, end: 0 },
                blendMode: 'ADD',
                lifespan: 600,
                gravityY: 200,
                emitting: false
            });
        } catch(e) {
            // Fallback for older Phaser versions
            const particles = this.add.particles('particle');
            this.emitter = particles.createEmitter({
                speed: { min: -100, max: 100 },
                angle: { min: 0, max: 360 },
                scale: { start: 1, end: 0 },
                blendMode: 'ADD',
                lifespan: 600,
                gravityY: 200,
                on: false
            });
        }

        // Player setup
        this.playerGridX = 1;
        this.playerGridY = 1;
        const px = this.offsetX + this.playerGridX * this.tileSize + this.tileSize/2;
        const py = this.offsetY + this.playerGridY * this.tileSize + this.tileSize/2;
        this.playerSprite = this.add.sprite(px, py, 'player');
        this.playerSprite.setDepth(10);

        // Inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // UI
        this.hudQuestion = this.add.text(400, 30, '', { font: '26px Arial', fill: '#FFFFFF', fontStyle: 'bold', stroke: '#000000', strokeThickness: 4 }).setOrigin(0.5, 0.5);
        this.hudStats = this.add.text(20, 20, '', { font: '22px Arial', fill: '#00FF00', fontStyle: 'bold', stroke: '#000000', strokeThickness: 3 });
        
        this.setNewQuestion();
        this.updateHUD();

        this.input.keyboard.on('keydown-SPACE', this.placeBomb, this);
      }

      createLevel() {
        for (let y = 0; y < this.gridHeight; y++) {
          this.grid[y] = [];
          for (let x = 0; x < this.gridWidth; x++) {
            if (x === 0 || x === this.gridWidth - 1 || y === 0 || y === this.gridHeight - 1 || (x % 2 === 0 && y % 2 === 0)) {
              // Hard Wall
              this.grid[y][x] = 1;
              const wx = this.offsetX + x * this.tileSize + this.tileSize/2;
              const wy = this.offsetY + y * this.tileSize + this.tileSize/2;
              this.add.sprite(wx, wy, 'hardBlock');
            } else {
              this.grid[y][x] = 0;
            }
          }
        }

        // Spawn soft blocks initially
        this.spawnSoftBlocks();
      }

      spawnSoftBlocks() {
        // Clear existing
        for (let key in this.softBlocks) {
          this.softBlocks[key].sprite.destroy();
          if (this.softBlocks[key].textObj) this.softBlocks[key].textObj.destroy();
          this.grid[this.softBlocks[key].y][this.softBlocks[key].x] = 0;
        }
        this.softBlocks = {};

        for (let y = 1; y < this.gridHeight - 1; y++) {
          for (let x = 1; x < this.gridWidth - 1; x++) {
            if (this.grid[y][x] === 0) {
              // Safe zone top-left
              if ((x === 1 && y === 1) || (x === 1 && y === 2) || (x === 2 && y === 1)) {
                continue;
              }
              if (Math.random() < 0.6) {
                this.addSoftBlock(x, y);
              }
            }
          }
        }
      }

      addSoftBlock(x, y) {
        this.grid[y][x] = 2;
        const wx = this.offsetX + x * this.tileSize + this.tileSize/2;
        const wy = this.offsetY + y * this.tileSize + this.tileSize/2;
        const sprite = this.add.sprite(wx, wy, 'softBlock');
        sprite.setDepth(5);
        this.softBlocks[`${x},${y}`] = { sprite, text: null, textObj: null, isCorrect: false, x, y };
      }

      setNewQuestion() {
        this.currentQuestion = Phaser.Utils.Array.GetRandom(this.questions);
        this.hudQuestion.setText(`Spreng die Hauptstadt von ${this.currentQuestion.country}!`);

        let blocks = Object.keys(this.softBlocks);
        if (blocks.length < 5) {
          this.spawnSoftBlocks();
          blocks = Object.keys(this.softBlocks);
        }

        for (let key in this.softBlocks) {
          const b = this.softBlocks[key];
          if (b.textObj) {
            b.textObj.destroy();
            b.textObj = null;
          }
          b.text = null;
          b.isCorrect = false;
        }

        Phaser.Utils.Array.Shuffle(blocks);

        if (blocks.length > 0) {
          this.assignTextToBlock(blocks[0], this.currentQuestion.capital, true);
        }

        let wrongAnswers = this.questions.filter(q => q.capital !== this.currentQuestion.capital).map(q => q.capital);
        
        for (let i = 1; i < Math.min(8, blocks.length); i++) {
           const wrongAns = Phaser.Utils.Array.GetRandom(wrongAnswers);
           this.assignTextToBlock(blocks[i], wrongAns, false);
        }
      }

      assignTextToBlock(key, text, isCorrect) {
        const b = this.softBlocks[key];
        b.text = text;
        b.isCorrect = isCorrect;
        
        b.textObj = this.add.text(b.sprite.x, b.sprite.y, text, {
          font: '14px Arial',
          fill: '#FFFF00',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 3
        }).setOrigin(0.5, 0.5);
        b.textObj.setDepth(6);
      }

      updateHUD() {
        let heartStr = '';
        for(let i=0; i<this.health; i++) heartStr += '❤';
        this.hudStats.setText(`Leben: ${heartStr} | Punkte: ${this.score}`);
        if (this.health <= 0) {
          this.scene.pause();
          this.add.text(400, 300, 'GAME OVER', { font: '64px Arial', fill: '#FF0000', fontStyle: 'bold', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5, 0.5);
        }
      }

      update() {
        if (this.health <= 0) return;
        this.handleMovement();
      }

      handleMovement() {
        if (this.isMoving) return;

        let dx = 0;
        let dy = 0;

        if (this.cursors.left.isDown) dx = -1;
        else if (this.cursors.right.isDown) dx = 1;
        else if (this.cursors.up.isDown) dy = -1;
        else if (this.cursors.down.isDown) dy = 1;

        if (dx !== 0 || dy !== 0) {
          const nextX = this.playerGridX + dx;
          const nextY = this.playerGridY + dy;

          if (this.grid[nextY][nextX] === 0) {
            const bombKey = `${nextX},${nextY}`;
            if (this.bombs[bombKey]) return; // block moving into bomb

            this.isMoving = true;
            this.playerGridX = nextX;
            this.playerGridY = nextY;

            const targetX = this.offsetX + this.playerGridX * this.tileSize + this.tileSize/2;
            const targetY = this.offsetY + this.playerGridY * this.tileSize + this.tileSize/2;

            this.tweens.add({
              targets: this.playerSprite,
              x: targetX,
              y: targetY,
              duration: 150,
              onComplete: () => {
                this.isMoving = false;
              }
            });
          }
        }
      }

      placeBomb() {
        if (this.health <= 0) return;
        const key = `${this.playerGridX},${this.playerGridY}`;
        if (this.bombs[key]) return;

        const bx = this.offsetX + this.playerGridX * this.tileSize + this.tileSize/2;
        const by = this.offsetY + this.playerGridY * this.tileSize + this.tileSize/2;

        const bombSprite = this.add.sprite(bx, by, 'bomb');
        bombSprite.setDepth(4);

        this.tweens.add({
          targets: bombSprite,
          scaleX: 1.2,
          scaleY: 1.2,
          yoyo: true,
          repeat: -1,
          duration: 300
        });

        this.bombs[key] = { sprite: bombSprite, x: this.playerGridX, y: this.playerGridY };

        this.time.delayedCall(3000, () => {
          this.explodeBomb(key);
        });
      }

      explodeBomb(key) {
        if (!this.bombs[key]) return;
        const bomb = this.bombs[key];
        bomb.sprite.destroy();
        delete this.bombs[key];

        const reach = 2;
        const cells = [{x: bomb.x, y: bomb.y}];

        const dirs = [
          {dx: 1, dy: 0},
          {dx: -1, dy: 0},
          {dx: 0, dy: 1},
          {dx: 0, dy: -1}
        ];

        for (let d of dirs) {
          for (let i = 1; i <= reach; i++) {
            const nx = bomb.x + d.dx * i;
            const ny = bomb.y + d.dy * i;
            
            if (this.grid[ny][nx] === 1) break; // hard wall stops explosion
            
            cells.push({x: nx, y: ny});
            
            if (this.grid[ny][nx] === 2) {
              this.destroySoftBlock(nx, ny);
              break; // soft wall absorbs
            }
          }
        }

        this.cameras.main.shake(150, 0.015);
        
        let playerHit = false;

        cells.forEach(c => {
          const ex = this.offsetX + c.x * this.tileSize + this.tileSize/2;
          const ey = this.offsetY + c.y * this.tileSize + this.tileSize/2;
          
          const expSprite = this.add.sprite(ex, ey, 'explosion');
          expSprite.setDepth(15);
          
          this.tweens.add({
            targets: expSprite,
            alpha: 0,
            duration: 500,
            onComplete: () => expSprite.destroy()
          });

          if (c.x === this.playerGridX && c.y === this.playerGridY) {
            playerHit = true;
          }
        });

        if (playerHit) {
          this.takeDamage();
        }
      }

      destroySoftBlock(x, y) {
        const key = `${x},${y}`;
        const block = this.softBlocks[key];
        if (!block) return;

        if (this.emitter.explode) {
            this.emitter.explode(20, block.sprite.x, block.sprite.y);
        }

        this.grid[y][x] = 0;
        block.sprite.destroy();
        if (block.textObj) {
            block.textObj.destroy();
        }

        if (block.text) {
          if (block.isCorrect) {
            this.score += 100;
            this.cameras.main.flash(300, 0, 255, 0); // Green
            this.setNewQuestion();
          } else {
            this.takeDamage();
            this.cameras.main.shake(300, 0.04);
            this.cameras.main.flash(300, 255, 0, 0); // Red
          }
        }

        delete this.softBlocks[key];
        this.updateHUD();
      }

      takeDamage() {
        this.health -= 1;
        this.updateHUD();
        
        this.playerSprite.setTint(0xFF0000);
        this.tweens.add({
          targets: this.playerSprite,
          alpha: 0.2,
          yoyo: true,
          repeat: 3,
          duration: 100,
          onComplete: () => {
            this.playerSprite.clearTint();
            this.playerSprite.alpha = 1;
          }
        });
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainerRef.current,
      backgroundColor: '#2E8B57',
      scene: [MainScene],
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <button
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          zIndex: 100,
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          transition: 'transform 0.1s'
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        Beenden
      </button>
      <div 
        ref={gameContainerRef} 
        style={{ 
          width: '800px', 
          height: '600px', 
          borderRadius: '12px', 
          overflow: 'hidden', 
          boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
          border: '4px solid #111'
        }} 
      />
    </div>
  );
};

export default FaskaBomberman;
