import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const FaskaBlocks = ({ onExit }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    const SHAPES = [
      [[1, 1, 1, 1]], // I
      [[1, 0, 0], [1, 1, 1]], // J
      [[0, 0, 1], [1, 1, 1]], // L
      [[1, 1], [1, 1]], // O
      [[0, 1, 1], [1, 1, 0]], // S
      [[0, 1, 0], [1, 1, 1]], // T
      [[1, 1, 0], [0, 1, 1]]  // Z
    ];
    
    const COLORS = [
      0x00FFFF, 0x0000FF, 0xFFA500, 0xFFFF00, 0x00FF00, 0x800080, 0xFF0000
    ];

    const CELL_SIZE = 28;
    const COLS = 10;
    const ROWS = 20;
    const BOARD_X = (400 - COLS * CELL_SIZE) / 2;
    const BOARD_Y = 30;

    class MainScene extends Phaser.Scene {
      constructor() {
        super({ key: 'MainScene' });
      }

      create() {
        // Generate particle texture
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xffffff);
        g.fillCircle(4, 4, 4);
        g.generateTexture('particle', 8, 8);

        this.score = 0;
        this.gameOver = false;
        this.isResolving = false;
        this.dropInterval = 1000;
        this.nextDropTime = this.time.now + this.dropInterval;
        
        this.grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

        // Draw board background
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.8);
        bg.fillRect(BOARD_X, BOARD_Y, COLS * CELL_SIZE, ROWS * CELL_SIZE);

        // Draw grid
        bg.lineStyle(1, 0xffffff, 0.1);
        for (let i = 0; i <= COLS; i++) {
          bg.moveTo(BOARD_X + i * CELL_SIZE, BOARD_Y);
          bg.lineTo(BOARD_X + i * CELL_SIZE, BOARD_Y + ROWS * CELL_SIZE);
        }
        for (let i = 0; i <= ROWS; i++) {
          bg.moveTo(BOARD_X, BOARD_Y + i * CELL_SIZE);
          bg.lineTo(BOARD_X + COLS * CELL_SIZE, BOARD_Y + i * CELL_SIZE);
        }
        bg.strokePath();

        this.scoreText = this.add.text(10, 5, 'Score: 0', { 
          fontSize: '20px', 
          fontFamily: 'Arial', 
          fill: '#fff',
          fontStyle: 'bold'
        });

        // Instructions
        this.add.text(10, 570, 'Arrows: Move/Rotate | Space: Drop', {
          fontSize: '14px',
          fontFamily: 'Arial',
          fill: '#aaa'
        });
        this.add.text(10, 585, 'Match lines adding up to 10!', {
          fontSize: '14px',
          fontFamily: 'Arial',
          fill: '#ffaa00',
          fontStyle: 'bold'
        });

        this.input.keyboard.on('keydown-LEFT', () => this.movePiece(-1, 0));
        this.input.keyboard.on('keydown-RIGHT', () => this.movePiece(1, 0));
        this.input.keyboard.on('keydown-DOWN', () => this.movePiece(0, 1));
        this.input.keyboard.on('keydown-UP', () => this.rotatePiece());
        this.input.keyboard.on('keydown-SPACE', () => this.hardDrop());

        this.spawnPiece();
      }

      createBlock(x, y, value, color) {
        const container = this.add.container(BOARD_X + x * CELL_SIZE, BOARD_Y + y * CELL_SIZE);
        
        const bg = this.add.graphics();
        bg.fillStyle(color, 1);
        bg.fillRoundedRect(1, 1, CELL_SIZE - 2, CELL_SIZE - 2, 4);
        bg.lineStyle(2, 0xffffff, 0.4);
        bg.strokeRoundedRect(2, 2, CELL_SIZE - 4, CELL_SIZE - 4, 4);
        
        const text = this.add.text(CELL_SIZE / 2, CELL_SIZE / 2, value.toString(), {
          fontFamily: 'Arial',
          fontSize: '18px',
          color: '#ffffff',
          fontStyle: 'bold'
        }).setOrigin(0.5);
        text.setShadow(1, 1, '#000000', 2);
        
        container.add([bg, text]);
        return { value, color, container, x, y };
      }

      spawnPiece() {
        const typeIndex = Phaser.Math.Between(0, SHAPES.length - 1);
        const shape = SHAPES[typeIndex];
        const color = COLORS[typeIndex];
        const values = [];
        
        for (let r = 0; r < shape.length; r++) {
          values[r] = [];
          for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
              values[r][c] = Phaser.Math.Between(1, 9);
            } else {
              values[r][c] = 0;
            }
          }
        }
        
        this.currentPiece = { shape, values, color, x: Math.floor(COLS/2) - Math.floor(shape[0].length/2), y: 0 };
        this.renderCurrentPiece();
        
        if (!this.isValid(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
          this.gameOver = true;
          const goText = this.add.text(200, 300, 'GAME OVER', { 
            fontSize: '48px', 
            fontFamily: 'Arial',
            color: '#ff0000', 
            fontStyle: 'bold' 
          }).setOrigin(0.5);
          goText.setShadow(2, 2, '#000', 4);
        }
      }

      isValid(px, py, shape) {
        for (let r = 0; r < shape.length; r++) {
          for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
              let nx = px + c;
              let ny = py + r;
              if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
              if (ny >= 0 && this.grid[ny][nx]) return false;
            }
          }
        }
        return true;
      }

      movePiece(dx, dy) {
        if (this.gameOver || !this.currentPiece || this.isResolving) return false;
        if (this.isValid(this.currentPiece.x + dx, this.currentPiece.y + dy, this.currentPiece.shape)) {
          this.currentPiece.x += dx;
          this.currentPiece.y += dy;
          this.updateCurrentPieceRender();
          return true;
        }
        return false;
      }

      rotatePiece() {
        if (this.gameOver || !this.currentPiece || this.isResolving) return;
        const { shape, values } = this.currentPiece;
        const newShape = [];
        const newValues = [];
        const rows = shape.length;
        const cols = shape[0].length;
        
        for (let c = 0; c < cols; c++) {
          newShape[c] = [];
          newValues[c] = [];
          for (let r = 0; r < rows; r++) {
            newShape[c][rows - 1 - r] = shape[r][c];
            newValues[c][rows - 1 - r] = values[r][c];
          }
        }
        
        if (this.isValid(this.currentPiece.x, this.currentPiece.y, newShape)) {
          this.currentPiece.shape = newShape;
          this.currentPiece.values = newValues;
          this.clearCurrentPieceRender();
          this.renderCurrentPiece();
        }
      }

      renderCurrentPiece() {
        this.currentPieceBlocks = [];
        const { shape, values, color, x, y } = this.currentPiece;
        for (let r = 0; r < shape.length; r++) {
          for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
              let block = this.createBlock(x + c, y + r, values[r][c], color);
              this.currentPieceBlocks.push({ r, c, block });
            }
          }
        }
      }

      updateCurrentPieceRender() {
        const { x, y } = this.currentPiece;
        for (let b of this.currentPieceBlocks) {
          b.block.container.x = BOARD_X + (x + b.c) * CELL_SIZE;
          b.block.container.y = BOARD_Y + (y + b.r) * CELL_SIZE;
        }
      }

      clearCurrentPieceRender() {
        if (this.currentPieceBlocks) {
          for (let b of this.currentPieceBlocks) {
            b.block.container.destroy();
          }
          this.currentPieceBlocks = [];
        }
      }

      hardDrop() {
        if (this.gameOver || this.isResolving) return;
        while (this.movePiece(0, 1)) {}
        this.settlePiece();
        this.nextDropTime = this.time.now + this.dropInterval;
      }

      settlePiece() {
        const { x, y } = this.currentPiece;
        for (let b of this.currentPieceBlocks) {
          let gx = x + b.c;
          let gy = y + b.r;
          if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS) {
            this.grid[gy][gx] = b.block;
          } else {
            b.block.container.destroy();
          }
        }
        this.currentPiece = null;
        this.currentPieceBlocks = [];
        this.resolveBoard();
      }

      resolveBoard() {
        this.isResolving = true;
        let toDestroy = new Set();
        
        // Horizontal check
        for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < COLS; x++) {
            if (!this.grid[y][x]) continue;
            let sum = 0;
            let seq = [];
            for (let i = x; i < COLS; i++) {
              if (!this.grid[y][i]) break;
              sum += this.grid[y][i].value;
              seq.push({ y, x: i });
              if (sum === 10) {
                seq.forEach(pos => toDestroy.add(`${pos.y},${pos.x}`));
                break;
              } else if (sum > 10) {
                break;
              }
            }
          }
        }
        
        // Vertical check
        for (let x = 0; x < COLS; x++) {
          for (let y = 0; y < ROWS; y++) {
            if (!this.grid[y][x]) continue;
            let sum = 0;
            let seq = [];
            for (let i = y; i < ROWS; i++) {
              if (!this.grid[i][x]) break;
              sum += this.grid[i][x].value;
              seq.push({ y: i, x });
              if (sum === 10) {
                seq.forEach(pos => toDestroy.add(`${pos.y},${pos.x}`));
                break;
              } else if (sum > 10) {
                break;
              }
            }
          }
        }
        
        if (toDestroy.size > 0) {
          this.score += toDestroy.size * 10;
          this.scoreText.setText(`Score: ${this.score}`);
          
          this.cameras.main.shake(150, 0.015);
          
          toDestroy.forEach(posStr => {
            let [y, x] = posStr.split(',').map(Number);
            let block = this.grid[y][x];
            
            // Particles
            const particles = this.add.particles(
              block.container.x + CELL_SIZE / 2, 
              block.container.y + CELL_SIZE / 2, 
              'particle', 
              {
                speed: { min: -150, max: 150 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.8, end: 0 },
                blendMode: 'ADD',
                lifespan: 400,
                tint: block.color
              }
            );
            particles.explode(15);
            
            block.container.destroy();
            this.grid[y][x] = null;
          });
          
          this.time.delayedCall(300, () => {
            let moved = this.applyGravity();
            if (moved) {
              this.time.delayedCall(300, () => {
                this.resolveBoard();
              });
            } else {
              this.resolveBoard();
            }
          });
        } else {
          // Speed up drop interval slightly
          this.dropInterval = Math.max(200, this.dropInterval - 5);
          
          this.isResolving = false;
          this.spawnPiece();
        }
      }

      applyGravity() {
        let moved = false;
        for (let x = 0; x < COLS; x++) {
          for (let y = ROWS - 2; y >= 0; y--) {
            if (this.grid[y][x] && !this.grid[y+1][x]) {
              let dropY = y;
              while (dropY < ROWS - 1 && !this.grid[dropY+1][x]) {
                dropY++;
              }
              
              let block = this.grid[y][x];
              this.grid[dropY][x] = block;
              this.grid[y][x] = null;
              
              this.tweens.add({
                targets: block.container,
                y: BOARD_Y + dropY * CELL_SIZE,
                duration: 250,
                ease: 'Bounce.easeOut'
              });
              moved = true;
            }
          }
        }
        return moved;
      }

      update(time) {
        if (this.gameOver || this.isResolving) return;
        
        if (time > this.nextDropTime) {
          if (!this.movePiece(0, 1)) {
            this.settlePiece();
          }
          this.nextDropTime = time + this.dropInterval;
        }
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: 400,
      height: 600,
      parent: 'phaser-faskablocks',
      backgroundColor: '#1a1a2e',
      scene: MainScene,
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
      }
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '400px', height: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <button
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 10,
          padding: '8px 16px',
          backgroundColor: '#e94560',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        Beenden
      </button>
      <div id="phaser-faskablocks" style={{ width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} />
    </div>
  );
};

export default FaskaBlocks;
