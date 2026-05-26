import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const BLOCK_SIZE = 48;
const COLS = 15;
const ROWS = 11;
const WIDTH = COLS * BLOCK_SIZE;
const HEIGHT = ROWS * BLOCK_SIZE;
const UI_HEIGHT = 100;

class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create() {
        this.generateTextures();
        this.scene.start('MainScene');
    }

    generateTextures() {
        const g = this.add.graphics();
        
        // Hard block
        g.fillStyle(0x555555);
        g.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
        g.fillStyle(0x777777);
        g.fillRect(4, 4, BLOCK_SIZE-8, BLOCK_SIZE-8);
        g.generateTexture('hard_block', BLOCK_SIZE, BLOCK_SIZE);
        g.clear();

        // Soft block
        g.fillStyle(0x8B4513);
        g.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
        g.fillStyle(0xA0522D);
        g.fillRect(2, 2, BLOCK_SIZE-4, BLOCK_SIZE-4);
        g.lineStyle(2, 0x5c2e0b);
        g.beginPath();
        g.moveTo(0, BLOCK_SIZE/2);
        g.lineTo(BLOCK_SIZE, BLOCK_SIZE/2);
        g.moveTo(BLOCK_SIZE/2, 0);
        g.lineTo(BLOCK_SIZE/2, BLOCK_SIZE);
        g.strokePath();
        g.generateTexture('soft_block', BLOCK_SIZE, BLOCK_SIZE);
        g.clear();

        // Player
        g.fillStyle(0x0088ff);
        g.fillCircle(BLOCK_SIZE/2, BLOCK_SIZE/2, BLOCK_SIZE/2 - 4);
        g.fillStyle(0xffffff); // Eyes
        g.fillCircle(BLOCK_SIZE/2 - 6, BLOCK_SIZE/2 - 4, 4);
        g.fillCircle(BLOCK_SIZE/2 + 6, BLOCK_SIZE/2 - 4, 4);
        g.generateTexture('player', BLOCK_SIZE, BLOCK_SIZE);
        g.clear();

        // Enemy
        g.fillStyle(0xff2200);
        g.fillCircle(BLOCK_SIZE/2, BLOCK_SIZE/2, BLOCK_SIZE/2 - 4);
        g.fillStyle(0xffff00); // Eyes
        g.fillTriangle(BLOCK_SIZE/2 - 10, BLOCK_SIZE/2 - 8, BLOCK_SIZE/2 - 4, BLOCK_SIZE/2 - 2, BLOCK_SIZE/2 - 2, BLOCK_SIZE/2 - 8);
        g.fillTriangle(BLOCK_SIZE/2 + 10, BLOCK_SIZE/2 - 8, BLOCK_SIZE/2 + 4, BLOCK_SIZE/2 - 2, BLOCK_SIZE/2 + 2, BLOCK_SIZE/2 - 8);
        g.generateTexture('enemy', BLOCK_SIZE, BLOCK_SIZE);
        g.clear();

        // Bomb
        g.fillStyle(0x111111);
        g.fillCircle(BLOCK_SIZE/2, BLOCK_SIZE/2 + 4, BLOCK_SIZE/2 - 8);
        g.fillStyle(0xaaaaaa); // Wick base
        g.fillRect(BLOCK_SIZE/2 - 4, BLOCK_SIZE/2 - 12, 8, 8);
        g.lineStyle(2, 0xffaa00); // Wick
        g.beginPath();
        g.moveTo(BLOCK_SIZE/2, BLOCK_SIZE/2 - 12);
        g.lineTo(BLOCK_SIZE/2 + 6, BLOCK_SIZE/2 - 18);
        g.strokePath();
        g.generateTexture('bomb', BLOCK_SIZE, BLOCK_SIZE);
        g.clear();

        // Explosion
        g.fillStyle(0xffaa00);
        g.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
        g.fillStyle(0xff3300);
        g.fillRect(4, 4, BLOCK_SIZE-8, BLOCK_SIZE-8);
        g.generateTexture('explosion', BLOCK_SIZE, BLOCK_SIZE);
        g.clear();

        // Powerup
        g.fillStyle(0xffd700);
        g.beginPath();
        g.moveTo(BLOCK_SIZE/2, 4);
        g.lineTo(BLOCK_SIZE-4, BLOCK_SIZE/2);
        g.lineTo(BLOCK_SIZE/2, BLOCK_SIZE-4);
        g.lineTo(4, BLOCK_SIZE/2);
        g.closePath();
        g.fillPath();
        g.generateTexture('powerup', BLOCK_SIZE, BLOCK_SIZE);
        g.clear();
        
        // Particles
        g.fillStyle(0xff5500);
        g.fillCircle(4, 4, 4);
        g.generateTexture('spark', 8, 8);
        g.clear();
        
        g.destroy();
    }
}

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        this.grid = [];
        this.blocks = this.physics.add.staticGroup();
        this.softBlocks = this.physics.add.staticGroup();
        this.bombs = this.physics.add.staticGroup();
        this.explosions = this.physics.add.group();
        this.powerups = this.physics.add.group();
        
        this.activePowerups = [];
        
        this.playerBombRange = 2;
        this.playerBombMax = 1;
        this.playerBombsActive = 0;
        this.playerSpeed = 150;
        
        this.inputBuffer = "";

        // UI
        this.uiText = this.add.text(10, HEIGHT + 10, "Antwort tippen & ENTER: [ ]", {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        });
        this.infoText = this.add.text(10, HEIGHT + 50, "Bombe: SPACE, Bewegen: WASD/Pfeile", {
            fontSize: '18px',
            fill: '#aaaaaa',
            fontFamily: 'monospace'
        });
        
        // Draw grid
        for (let r = 0; r < ROWS; r++) {
            this.grid[r] = [];
            for (let c = 0; c < COLS; c++) {
                this.grid[r][c] = 0; // 0: empty, 1: hard, 2: soft
                
                const isHard = (r % 2 === 1 && c % 2 === 1);
                if (isHard) {
                    this.grid[r][c] = 1;
                    const b = this.blocks.create(c * BLOCK_SIZE + BLOCK_SIZE/2, r * BLOCK_SIZE + BLOCK_SIZE/2, 'hard_block');
                    b.gridR = r; b.gridC = c;
                } else {
                    // Start zone protection
                    const isStartP1 = (r === 0 && c <= 2) || (r <= 2 && c === 0) || (r===1 && c===1);
                    const isStartP2 = (r === ROWS-1 && c >= COLS-3) || (r >= ROWS-3 && c === COLS-1) || (r===ROWS-2 && c===COLS-2);
                    
                    if (!isStartP1 && !isStartP2) {
                        if (Phaser.Math.Between(0, 100) < 60) {
                            this.grid[r][c] = 2;
                            const sb = this.softBlocks.create(c * BLOCK_SIZE + BLOCK_SIZE/2, r * BLOCK_SIZE + BLOCK_SIZE/2, 'soft_block');
                            sb.gridR = r; sb.gridC = c;
                        }
                    }
                }
            }
        }
        
        // Player
        this.player = this.physics.add.sprite(BLOCK_SIZE/2, BLOCK_SIZE/2, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(BLOCK_SIZE - 12, BLOCK_SIZE - 12);
        
        // Enemy
        this.enemy = this.physics.add.sprite((COLS-1) * BLOCK_SIZE + BLOCK_SIZE/2, (ROWS-1) * BLOCK_SIZE + BLOCK_SIZE/2, 'enemy');
        this.enemy.setCollideWorldBounds(true);
        this.enemy.body.setSize(BLOCK_SIZE - 12, BLOCK_SIZE - 12);
        this.enemySpeed = 100;
        this.enemyBombRange = 2;
        this.enemyState = 'move';
        this.enemyMoveDir = {x: 0, y: 0};
        this.enemyMoveTimer = 0;

        // Collisions
        this.physics.add.collider(this.player, this.blocks);
        this.physics.add.collider(this.player, this.softBlocks);
        this.physics.add.collider(this.player, this.bombs);
        
        this.physics.add.collider(this.enemy, this.blocks);
        this.physics.add.collider(this.enemy, this.softBlocks);
        this.physics.add.collider(this.enemy, this.bombs);

        // Inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        };
        
        this.input.keyboard.on('keydown', this.handleTyping, this);

        this.particles = this.add.particles('spark');
        this.emitter = this.particles.createEmitter({
            speed: { min: -200, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 600,
            gravityY: 0,
            on: false
        });
        
        this.gameOver = false;
    }
    
    handleTyping(event) {
        if (this.gameOver) return;
        
        if (event.key >= '0' && event.key <= '9') {
            this.inputBuffer += event.key;
            if (this.inputBuffer.length > 5) this.inputBuffer = this.inputBuffer.slice(1);
        } else if (event.key === 'Backspace') {
            this.inputBuffer = this.inputBuffer.slice(0, -1);
        } else if (event.key === 'Enter') {
            this.checkAnswer();
        }
        
        this.uiText.setText(`Antwort tippen & ENTER: [ ${this.inputBuffer} ]`);
    }

    checkAnswer() {
        let matched = false;
        if (this.inputBuffer.trim() === "") return;

        const answerVal = parseInt(this.inputBuffer, 10);
        
        for (let i = 0; i < this.activePowerups.length; i++) {
            const p = this.activePowerups[i];
            if (p.answer === answerVal && p.active) {
                // Collect powerup!
                matched = true;
                this.collectPowerup(p);
                break; // Only collect one at a time
            }
        }
        
        if (matched) {
            this.inputBuffer = "";
            this.cameras.main.flash(200, 0, 255, 0); // Green flash
        } else {
            this.inputBuffer = ""; // Reset on wrong
            this.cameras.main.shake(100, 0.01);
            this.uiText.setColor('#ff0000');
            this.time.delayedCall(300, () => {
                this.uiText.setColor('#ffffff');
            });
        }
        this.uiText.setText(`Antwort tippen & ENTER: [ ${this.inputBuffer} ]`);
    }

    collectPowerup(p) {
        p.active = false;
        
        // Particles
        this.emitter.setPosition(p.sprite.x, p.sprite.y);
        this.emitter.explode(30);
        
        p.sprite.destroy();
        p.text.destroy();
        
        const index = this.activePowerups.indexOf(p);
        if (index > -1) this.activePowerups.splice(index, 1);
        
        // Apply effect
        const rand = Phaser.Math.Between(0, 1);
        let msg = "";
        if (rand === 0) {
            this.playerBombRange++;
            msg = "Bomben-Reichweite +1!";
        } else {
            this.playerBombMax++;
            msg = "Max Bomben +1!";
        }
        
        // Float text
        const ft = this.add.text(this.player.x, this.player.y - 30, msg, {
            fontSize: '16px', fill: '#00ff00', fontStyle: 'bold', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: ft,
            y: ft.y - 50,
            alpha: 0,
            duration: 1500,
            onComplete: () => ft.destroy()
        });
    }

    update(time, delta) {
        if (this.gameOver) return;

        // Player movement
        this.player.setVelocity(0);
        
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
        }
        
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
        }
        
        // Normalize speed
        if (this.player.body.velocity.x !== 0 && this.player.body.velocity.y !== 0) {
            this.player.body.velocity.normalize().scale(this.playerSpeed);
        }

        // Bomb drop
        if (Phaser.Input.Keyboard.JustDown(this.wasd.space)) {
            this.dropBomb(this.player, this.playerBombRange, true);
        }
        
        this.updateEnemy(time, delta);
        
        // Check explosion overlaps
        this.physics.overlap(this.player, this.explosions, this.hitPlayer, null, this);
        this.physics.overlap(this.enemy, this.explosions, this.hitEnemy, null, this);
    }
    
    updateEnemy(time, delta) {
        if (!this.enemy.active) return;
        
        this.enemy.setVelocity(0);
        
        if (time > this.enemyMoveTimer) {
            // Decide new action
            const rand = Phaser.Math.Between(0, 100);
            if (rand < 20) {
                // Drop bomb
                this.dropBomb(this.enemy, this.enemyBombRange, false);
                this.enemyMoveDir = {x: 0, y: 0};
                this.enemyMoveTimer = time + 500;
            } else {
                // Move
                const dirs = [
                    {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}
                ];
                this.enemyMoveDir = Phaser.Math.RND.pick(dirs);
                this.enemyMoveTimer = time + Phaser.Math.Between(400, 1000);
            }
        }
        
        this.enemy.setVelocityX(this.enemyMoveDir.x * this.enemySpeed);
        this.enemy.setVelocityY(this.enemyMoveDir.y * this.enemySpeed);
        
        // Slight correction if stuck
        if (this.enemy.body.velocity.x !== 0 || this.enemy.body.velocity.y !== 0) {
            if (this.enemy.body.blocked.none === false) {
                // Hit a wall, rethink immediately
                this.enemyMoveTimer = 0;
            }
        }
    }

    dropBomb(owner, range, isPlayer) {
        if (isPlayer && this.playerBombsActive >= this.playerBombMax) return;
        
        const gridC = Math.floor(owner.x / BLOCK_SIZE);
        const gridR = Math.floor(owner.y / BLOCK_SIZE);
        
        const px = gridC * BLOCK_SIZE + BLOCK_SIZE/2;
        const py = gridR * BLOCK_SIZE + BLOCK_SIZE/2;
        
        // Check if bomb already there
        let canDrop = true;
        this.bombs.children.iterate((b) => {
            if (b && b.gridC === gridC && b.gridR === gridR) canDrop = false;
        });
        
        if (!canDrop) return;
        
        if (isPlayer) this.playerBombsActive++;
        
        const bomb = this.bombs.create(px, py, 'bomb');
        bomb.gridC = gridC;
        bomb.gridR = gridR;
        bomb.range = range;
        bomb.isPlayer = isPlayer;
        
        // Tween for breathing effect
        this.tweens.add({
            targets: bomb,
            scaleX: 1.2,
            scaleY: 1.2,
            yoyo: true,
            repeat: -1,
            duration: 300
        });
        
        this.time.delayedCall(2500, () => {
            if (bomb.active) this.explodeBomb(bomb);
        });
    }

    explodeBomb(bomb) {
        if (!bomb || !bomb.active) return;
        
        if (bomb.isPlayer) this.playerBombsActive = Math.max(0, this.playerBombsActive - 1);
        
        const gc = bomb.gridC;
        const gr = bomb.gridR;
        const range = bomb.range;
        
        bomb.destroy();
        
        this.cameras.main.shake(150, 0.005);
        
        // Create explosions
        this.createExplosionEffect(gc, gr);
        
        const dirs = [ {dc: 0, dr: -1}, {dc: 0, dr: 1}, {dc: -1, dr: 0}, {dc: 1, dr: 0} ];
        
        for (let d of dirs) {
            for (let i = 1; i <= range; i++) {
                const nc = gc + d.dc * i;
                const nr = gr + d.dr * i;
                
                if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) break; // Bounds
                
                const blockType = this.grid[nr][nc];
                if (blockType === 1) break; // Hard block stops explosion
                
                this.createExplosionEffect(nc, nr);
                
                if (blockType === 2) {
                    // Soft block, destroy and stop
                    this.destroySoftBlock(nc, nr);
                    break;
                }
                
                // Chain reaction with other bombs
                this.bombs.children.iterate((b) => {
                    if (b && b.active && b.gridC === nc && b.gridR === nr) {
                        this.time.delayedCall(100, () => this.explodeBomb(b));
                    }
                });
            }
        }
    }

    createExplosionEffect(c, r) {
        const x = c * BLOCK_SIZE + BLOCK_SIZE/2;
        const y = r * BLOCK_SIZE + BLOCK_SIZE/2;
        
        const exp = this.explosions.create(x, y, 'explosion');
        
        // Visual flair
        this.tweens.add({
            targets: exp,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 300,
            onComplete: () => exp.destroy()
        });
        
        this.time.delayedCall(100, () => {
            if (exp && exp.body) exp.body.enable = false; // Disable collision after a moment
        });
    }

    destroySoftBlock(c, r) {
        this.grid[r][c] = 0; // Set to empty
        
        // Find and destroy sprite
        this.softBlocks.children.iterate((sb) => {
            if (sb && sb.gridC === c && sb.gridR === r) {
                // Particles
                this.emitter.setPosition(sb.x, sb.y);
                this.emitter.explode(10);
                sb.destroy();
                
                // Chance for powerup
                if (Phaser.Math.Between(0, 100) < 40) {
                    this.spawnPowerup(c, r);
                }
            }
        });
    }

    spawnPowerup(c, r) {
        const x = c * BLOCK_SIZE + BLOCK_SIZE/2;
        const y = r * BLOCK_SIZE + BLOCK_SIZE/2;
        
        const sprite = this.add.sprite(x, y, 'powerup');
        
        // Generate math
        const ops = ['+', '-', '*'];
        const op = Phaser.Math.RND.pick(ops);
        let n1, n2, ans;
        if (op === '+') {
            n1 = Phaser.Math.Between(1, 10);
            n2 = Phaser.Math.Between(1, 10);
            ans = n1 + n2;
        } else if (op === '-') {
            n1 = Phaser.Math.Between(5, 15);
            n2 = Phaser.Math.Between(1, n1-1);
            ans = n1 - n2;
        } else {
            n1 = Phaser.Math.Between(2, 6);
            n2 = Phaser.Math.Between(2, 5);
            ans = n1 * n2;
        }
        
        const str = `${n1}${op}${n2}`;
        
        const text = this.add.text(x, y - 10, str, {
            fontSize: '14px', fill: '#ffffff', fontStyle: 'bold', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: sprite,
            y: y - 5,
            yoyo: true,
            repeat: -1,
            duration: 800,
            ease: 'Sine.easeInOut'
        });
        this.tweens.add({
            targets: text,
            y: y - 15,
            yoyo: true,
            repeat: -1,
            duration: 800,
            ease: 'Sine.easeInOut'
        });
        
        this.activePowerups.push({
            sprite, text, answer: ans, active: true
        });
    }

    hitPlayer(player, explosion) {
        if (!explosion.body.enable) return;
        this.endGame(false);
    }
    
    hitEnemy(enemy, explosion) {
        if (!explosion.body.enable) return;
        this.endGame(true);
        enemy.destroy();
    }

    endGame(win) {
        if (this.gameOver) return;
        this.gameOver = true;
        
        this.physics.pause();
        
        const msg = win ? "GEWONNEN!" : "GAME OVER";
        const color = win ? "#00ff00" : "#ff0000";
        
        this.add.rectangle(WIDTH/2, HEIGHT/2, WIDTH, HEIGHT, 0x000000, 0.7);
        
        this.add.text(WIDTH/2, HEIGHT/2, msg, {
            fontSize: '64px', fill: color, fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(WIDTH/2, HEIGHT/2 + 60, "Klicke zum Neustarten", {
            fontSize: '24px', fill: '#ffffff'
        }).setOrigin(0.5);
        
        this.input.once('pointerdown', () => {
            this.scene.restart();
        });
    }
}

export default function FaskaBombermanSwarm({ onExit }) {
    const gameRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: WIDTH,
            height: HEIGHT + UI_HEIGHT,
            parent: containerRef.current,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [BootScene, MainScene]
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: WIDTH, height: HEIGHT + UI_HEIGHT, margin: '0 auto', backgroundColor: '#222' }}>
            <button 
                onClick={onExit} 
                style={{
                    position: 'absolute', 
                    top: 10, 
                    right: 10, 
                    zIndex: 10,
                    padding: '8px 16px',
                    fontSize: '16px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
            >
                Beenden
            </button>
            <div ref={containerRef} />
        </div>
    );
}
