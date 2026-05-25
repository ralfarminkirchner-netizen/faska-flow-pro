import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const FaskaSnake = ({ onExit }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    const CELL = 25;
    const COLS = 32;
    const ROWS = 24;
    const HUD_ROWS = 2;

    class SnakeScene extends Phaser.Scene {
      constructor() {
        super({ key: 'SnakeScene' });
      }

      create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');

        this.wordCount = 1;
        this.words = ['HUND', 'KATZE', 'MAUS', 'BAUM', 'AUTO', 'SONNE', 'MOND', 'STERN', 'APFEL', 'VOGEL', 'FISCH'];
        this.targetWord = Phaser.Utils.Array.GetRandom(this.words);
        this.targetIndex = 0;
        this.gameOver = false;
        this.moveDelay = 150;
        this.moveTimer = 0;

        this.snake = [
          { x: 10, y: 12 },
          { x: 9, y: 12 },
          { x: 8, y: 12 }
        ];
        this.dir = { x: 1, y: 0 };
        this.nextDir = { x: 1, y: 0 };
        this.letters = [];
        this.graphics = this.add.graphics();
        this.hudGroup = this.add.group();

        this.drawHUD();
        this.spawnLetters();
        this.drawSnake();
      }

      spawnLetters() {
        this.letters.forEach(l => l.textObj.destroy());
        this.letters = [];

        const getFreePos = () => {
          let x, y;
          while (true) {
            x = Phaser.Math.Between(0, COLS - 1);
            y = Phaser.Math.Between(HUD_ROWS, ROWS - 1);
            let ok = true;
            for (let s of this.snake) {
              if (s.x === x && s.y === y) ok = false;
            }
            for (let l of this.letters) {
              if (l.x === x && l.y === y) ok = false;
            }
            if (ok) return { x, y };
          }
        };

        const targetChar = this.targetWord[this.targetIndex];
        const p = getFreePos();
        this.addLetter(p.x, p.y, targetChar, true);

        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = 0; i < 4; i++) {
          const rp = getFreePos();
          let randomChar = alphabet[Phaser.Math.Between(0, 25)];
          while (randomChar === targetChar) {
            randomChar = alphabet[Phaser.Math.Between(0, 25)];
          }
          this.addLetter(rp.x, rp.y, randomChar, false);
        }
      }

      addLetter(x, y, char, isTarget) {
        const px = x * CELL + CELL / 2;
        const py = y * CELL + CELL / 2;
        const color = isTarget ? '#00ffff' : '#ff5555';
        
        const txt = this.add.text(px, py, char, {
          fontFamily: 'monospace',
          fontSize: '22px',
          color: color,
          fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(10);

        this.tweens.add({
          targets: txt,
          y: py - 4,
          duration: 600,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });

        this.letters.push({ x, y, char, textObj: txt, isTarget });
      }

      update(time, delta) {
        if (this.gameOver) return;

        if ((this.cursors.left.isDown || this.wasd.A.isDown) && this.dir.x !== 1) {
          this.nextDir = { x: -1, y: 0 };
        } else if ((this.cursors.right.isDown || this.wasd.D.isDown) && this.dir.x !== -1) {
          this.nextDir = { x: 1, y: 0 };
        } else if ((this.cursors.up.isDown || this.wasd.W.isDown) && this.dir.y !== 1) {
          this.nextDir = { x: 0, y: -1 };
        } else if ((this.cursors.down.isDown || this.wasd.S.isDown) && this.dir.y !== -1) {
          this.nextDir = { x: 0, y: 1 };
        }

        this.moveTimer += delta;
        if (this.moveTimer >= this.moveDelay) {
          this.moveTimer -= this.moveDelay;
          this.tick();
        }
      }

      tick() {
        this.dir = { ...this.nextDir };
        const head = this.snake[0];
        const nx = head.x + this.dir.x;
        const ny = head.y + this.dir.y;

        if (nx < 0 || nx >= COLS || ny < HUD_ROWS || ny >= ROWS) {
          this.die();
          return;
        }

        for (let i = 0; i < this.snake.length; i++) {
          if (this.snake[i].x === nx && this.snake[i].y === ny) {
            this.die();
            return;
          }
        }

        const newHead = { x: nx, y: ny };
        this.snake.unshift(newHead);

        const hitIdx = this.letters.findIndex(l => l.x === nx && l.y === ny);
        if (hitIdx !== -1) {
          const hitLetter = this.letters[hitIdx];
          hitLetter.textObj.destroy();
          this.letters.splice(hitIdx, 1);

          if (hitLetter.isTarget) {
            this.emitJuice(nx, ny, 0x00ffff);
            this.cameras.main.shake(150, 0.005);
            
            this.targetIndex++;
            if (this.targetIndex >= this.targetWord.length) {
              this.nextWord();
            } else {
              this.spawnLetters();
            }
            this.drawHUD();
            // Do not pop tail -> snake grows
          } else {
            this.emitJuice(nx, ny, 0xff0000);
            this.cameras.main.shake(300, 0.015);
            
            // Penalty shrink
            this.snake.pop(); // Standard move pop
            if (this.snake.length > 2) {
              const dropped = this.snake.pop(); // Penalty pop
              this.emitJuice(dropped.x, dropped.y, 0xff0000);
            } else {
              this.die();
              return;
            }
            this.spawnLetters();
          }
        } else {
          // Standard move pop
          this.snake.pop();
        }

        if (!this.gameOver) {
          this.drawSnake();
        }
      }

      emitJuice(gx, gy, color) {
        const px = gx * CELL + CELL / 2;
        const py = gy * CELL + CELL / 2;

        for (let i = 0; i < 15; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 80 + 20;
          const tx = px + Math.cos(angle) * speed;
          const ty = py + Math.sin(angle) * speed;

          const shape = this.add.rectangle(px, py, 6, 6, color);
          shape.setBlendMode(Phaser.BlendModes.ADD);
          shape.setDepth(20);

          this.tweens.add({
            targets: shape,
            x: tx,
            y: ty,
            scale: 0,
            alpha: 0,
            angle: 360,
            duration: 400 + Math.random() * 300,
            ease: 'Power2',
            onComplete: () => shape.destroy()
          });
        }
      }

      drawSnake() {
        this.graphics.clear();

        // Background grid lines
        this.graphics.lineStyle(1, 0x333333, 0.4);
        for (let x = 0; x <= COLS; x++) {
          this.graphics.moveTo(x * CELL, HUD_ROWS * CELL);
          this.graphics.lineTo(x * CELL, ROWS * CELL);
        }
        for (let y = HUD_ROWS; y <= ROWS; y++) {
          this.graphics.moveTo(0, y * CELL);
          this.graphics.lineTo(COLS * CELL, y * CELL);
        }
        this.graphics.strokePath();

        // Snake segments
        for (let i = 0; i < this.snake.length; i++) {
          const seg = this.snake[i];
          const isHead = i === 0;

          // Fade tail slightly based on position
          const alpha = Math.max(0.3, 1 - (i / (this.snake.length * 1.5)));
          const color = isHead ? 0xffffff : 0x00ff00;

          this.graphics.fillStyle(color, alpha);
          this.graphics.fillRoundedRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, 6);

          if (isHead) {
            this.graphics.fillStyle(0x000000, 1);
            const cx = seg.x * CELL;
            const cy = seg.y * CELL;
            
            // Simple directional eyes
            if (this.dir.x === 1) { // Right
              this.graphics.fillRect(cx + 16, cy + 6, 4, 4);
              this.graphics.fillRect(cx + 16, cy + 15, 4, 4);
            } else if (this.dir.x === -1) { // Left
              this.graphics.fillRect(cx + 5, cy + 6, 4, 4);
              this.graphics.fillRect(cx + 5, cy + 15, 4, 4);
            } else if (this.dir.y === 1) { // Down
              this.graphics.fillRect(cx + 6, cy + 16, 4, 4);
              this.graphics.fillRect(cx + 15, cy + 16, 4, 4);
            } else { // Up
              this.graphics.fillRect(cx + 6, cy + 5, 4, 4);
              this.graphics.fillRect(cx + 15, cy + 5, 4, 4);
            }
          }
        }
      }

      drawHUD() {
        this.hudGroup.clear(true, true);

        const startX = 20;
        const y = 25;

        const title = this.add.text(startX, y, 'ZIEL: ', {
          fontFamily: 'monospace',
          fontSize: '24px',
          fill: '#aaaaaa',
          fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        this.hudGroup.add(title);

        let cx = startX + 90;
        for (let i = 0; i < this.targetWord.length; i++) {
          let color = i < this.targetIndex ? '#00ff00' : (i === this.targetIndex ? '#00ffff' : '#555555');
          let scale = i === this.targetIndex ? '32px' : '26px';
          
          let t = this.add.text(cx, y, this.targetWord[i], {
            fontFamily: 'monospace',
            fontSize: scale,
            fill: color,
            fontStyle: 'bold'
          }).setOrigin(0.5, 0.5);
          
          if (i === this.targetIndex) {
            this.tweens.add({
              targets: t,
              scale: 1.2,
              duration: 400,
              yoyo: true,
              repeat: -1
            });
          }

          this.hudGroup.add(t);
          cx += 35;
        }

        const score = this.add.text(COLS * CELL - 20, y, `WORT: ${this.wordCount}`, {
          fontFamily: 'monospace',
          fontSize: '24px',
          fill: '#ffffff',
          fontStyle: 'bold'
        }).setOrigin(1, 0.5);
        this.hudGroup.add(score);
      }

      nextWord() {
        this.wordCount++;
        this.targetWord = Phaser.Utils.Array.GetRandom(this.words);
        this.targetIndex = 0;
        
        this.cameras.main.flash(400, 0, 255, 255);
        this.moveDelay = Math.max(60, this.moveDelay - 5);
        this.spawnLetters();
      }

      die() {
        this.gameOver = true;
        this.cameras.main.shake(600, 0.03);
        
        this.time.delayedCall(500, () => {
          const cx = (COLS * CELL) / 2;
          const cy = (ROWS * CELL) / 2;
          
          const overlay = this.add.rectangle(cx, cy, COLS * CELL, ROWS * CELL, 0x000000, 0.8).setDepth(99);
          
          this.add.text(cx, cy - 40, 'GAME OVER', {
            fontFamily: 'monospace',
            fontSize: '56px',
            fill: '#ff0000',
            fontStyle: 'bold'
          }).setOrigin(0.5).setDepth(100);

          const restartBtn = this.add.text(cx, cy + 40, '> Klicken für Neustart <', {
            fontFamily: 'monospace',
            fontSize: '24px',
            fill: '#ffffff'
          }).setOrigin(0.5).setDepth(100);

          this.tweens.add({
            targets: restartBtn,
            alpha: 0.2,
            duration: 800,
            yoyo: true,
            repeat: -1
          });

          this.input.once('pointerdown', () => {
            this.scene.restart();
          });
        });
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#1a1a2e',
      physics: {
        default: 'arcade'
      },
      scene: [SnakeScene]
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: '#0f0f1a',
      padding: '20px'
    }}>
      <div style={{
        position: 'relative',
        width: '800px',
        height: '600px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
        border: '4px solid #2a2a4a'
      }}>
        <button 
          onClick={onExit} 
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 100,
            padding: '8px 16px',
            backgroundColor: '#ff3333',
            color: '#fff',
            border: '2px solid #ffaaaa',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            boxShadow: '0 4px 6px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#ff0000';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#ff3333';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Beenden
        </button>
        <div ref={gameRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default FaskaSnake;
