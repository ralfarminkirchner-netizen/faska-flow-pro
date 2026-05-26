import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const generateMathProblem = (target) => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    if (op === '+') {
        const a = Math.floor(Math.random() * target);
        const b = target - a;
        return `${a} + ${b}`;
    } else if (op === '-') {
        const a = target + Math.floor(Math.random() * 20);
        const b = a - target;
        return `${a} - ${b}`;
    } else {
        const factors = [];
        for(let i=2; i<=target/2; i++) {
            if(target % i === 0) factors.push(i);
        }
        if (factors.length > 0) {
            const a = factors[Math.floor(Math.random() * factors.length)];
            const b = target / a;
            return `${a} x ${b}`;
        }
        const a = Math.floor(Math.random() * target);
        const b = target - a;
        return `${a} + ${b}`;
    }
};

const generateWrongProblem = (target) => {
    let wrong = target;
    while(wrong === target) {
        wrong = target + Math.floor(Math.random() * 11) - 5;
    }
    if (wrong <= 0) wrong = 1;
    return generateMathProblem(wrong);
};

class Fighter {
    constructor(scene, x, y, isPlayer, color) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
        this.isPlayer = isPlayer;
        
        this.shadow = scene.add.ellipse(0, 0, 50, 20, 0x000000, 0.4);
        this.sprite = scene.add.sprite(0, 0, 'char_idle').setTint(color);
        this.sprite.setOrigin(0.5, 0.95);
        
        this.state = 'idle'; 
        this.stateTimer = 0;
        this.facing = 1;
        this.hp = isPlayer ? 100 : 1;
        this.isCorrect = false;
        
        if (!isPlayer) {
            this.text = scene.add.text(0, 0, '', {
                fontSize: '20px',
                fill: '#ffffff',
                fontFamily: 'Impact, sans-serif',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5, 1);
        }
    }
    
    update(time, delta) {
        if (this.state === 'dead') {
            this.sprite.alpha -= 0.02;
            this.shadow.alpha -= 0.02;
            if (this.text) this.text.alpha -= 0.02;
            
            const dt = delta / 1000;
            this.x += this.vx * dt;
            if (this.z > 0 || this.vz !== 0) {
                this.vz -= 2000 * dt;
                this.z += this.vz * dt;
                if (this.z < 0) {
                    this.z = 0;
                    this.vz = 0;
                    this.vx = 0; 
                }
            }
        } else {
            const dt = delta / 1000;
            this.stateTimer -= delta;
            
            if (this.z > 0 || this.vz !== 0) {
                this.vz -= 2000 * dt;
                this.z += this.vz * dt;
                if (this.z < 0) {
                    this.z = 0;
                    this.vz = 0;
                    if (this.state === 'jump' || this.state === 'kick') {
                        this.state = 'idle';
                        this.sprite.setTexture('char_idle');
                    }
                }
            }
            
            if (this.state !== 'punch' && this.state !== 'hurt' && this.state !== 'kick') {
                this.x += this.vx * dt;
                this.y += this.vy * dt;
            } else if (this.state === 'hurt') {
                this.x += this.vx * dt;
                this.vx *= 0.9;
            }
            
            if (this.y < 350) this.y = 350;
            if (this.y > 600) this.y = 600;
            
            if ((this.state === 'idle' || this.state === 'walk') && this.z === 0) {
                if (Math.abs(this.vx) > 10 || Math.abs(this.vy) > 10) {
                    this.state = 'walk';
                    this.sprite.setTexture(time % 400 < 200 ? 'char_walk' : 'char_idle');
                } else {
                    this.state = 'idle';
                    this.sprite.setTexture('char_idle');
                }
            }
            
            if (this.state === 'hurt' && this.stateTimer <= 0) {
                this.state = 'idle';
            }
            if (this.state === 'punch' && this.stateTimer <= 0) {
                this.state = 'idle';
            }
            if (this.state === 'kick' && this.stateTimer <= 0 && this.z === 0) {
                this.state = 'idle';
            }
        }
        
        this.shadow.x = this.x;
        this.shadow.y = this.y;
        this.shadow.setDepth(this.y);
        
        this.sprite.x = this.x;
        this.sprite.y = this.y - this.z;
        this.sprite.setDepth(this.y + 1);
        this.sprite.scaleX = this.facing;
        
        if (this.text) {
            this.text.x = this.x;
            this.text.y = this.y - this.z - 100;
            this.text.setDepth(this.y + 1);
        }
    }
    
    takeDamage(amount, knockbackX) {
        if (this.state === 'dead') return;
        this.hp -= amount;
        
        if (this.hp <= 0) {
            this.state = 'dead';
            this.vx = knockbackX * 1.5;
            this.vz = 400; 
            this.sprite.setTexture('char_hurt'); 
            this.sprite.setTint(0x555555);
        } else {
            this.state = 'hurt';
            this.stateTimer = 400;
            this.vx = knockbackX;
            this.vy = 0;
            this.sprite.setTexture('char_idle');
            this.sprite.setTintFill(0xffffff);
            this.scene.time.delayedCall(100, () => {
                if (this.sprite && this.sprite.active && this.state !== 'dead') {
                    this.sprite.clearTint();
                    this.sprite.setTint(this.isPlayer ? 0x00ffff : 0xff0044);
                }
            });
        }
    }
    
    destroy() {
        this.sprite.destroy();
        this.shadow.destroy();
        if (this.text) this.text.destroy();
    }
}

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        let drawBody = (g) => {
            g.fillStyle(0xffffff, 1);
            g.fillCircle(50, 30, 15); 
            g.fillRoundedRect(40, 45, 20, 30, 5); 
        };
        
        let g = this.make.graphics({x: 0, y: 0, add: false});
        drawBody(g);
        g.fillRect(40, 75, 8, 20); 
        g.fillRect(52, 75, 8, 20); 
        g.fillRect(40, 45, 8, 25); 
        g.generateTexture('char_idle', 100, 100);
        g.clear();

        drawBody(g);
        g.fillRect(35, 75, 8, 20); 
        g.fillRect(57, 75, 8, 20); 
        g.generateTexture('char_walk', 100, 100);
        g.clear();

        drawBody(g);
        g.fillRect(40, 75, 8, 20); 
        g.fillRect(52, 75, 8, 20);
        g.fillRect(60, 50, 30, 8); 
        g.generateTexture('char_punch', 100, 100);
        g.clear();

        drawBody(g);
        g.fillRect(40, 75, 8, 10); 
        g.fillRect(60, 70, 30, 8); 
        g.generateTexture('char_kick', 100, 100);
        g.clear();

        g.fillStyle(0xffffff, 1);
        g.fillCircle(45, 30, 15); 
        g.fillRoundedRect(40, 45, 20, 30, 5);
        g.fillRect(35, 75, 8, 20);
        g.fillRect(50, 75, 8, 20);
        g.generateTexture('char_hurt', 100, 100);
        g.clear();

        g.fillStyle(0xffffff, 1);
        g.fillCircle(4, 4, 4);
        g.generateTexture('particle', 8, 8);
        g.clear();

        let gCity = this.make.graphics({x:0, y:0, add:false});
        gCity.fillStyle(0x111122, 1);
        gCity.fillRect(0, 0, 800, 350);
        gCity.fillStyle(0x050510, 1);
        gCity.fillRect(50, 100, 150, 250);
        gCity.fillRect(250, 150, 100, 200);
        gCity.fillRect(400, 50, 120, 300);
        gCity.fillRect(600, 120, 180, 230);
        gCity.fillStyle(0xaaaa55, 1);
        for(let wx=60; wx<180; wx+=30) {
            for(let wy=120; wy<300; wy+=40) {
                if(Math.random()>0.3) gCity.fillRect(wx, wy, 15, 20);
            }
        }
        gCity.generateTexture('city', 800, 350);
        gCity.clear();

        let gRoad = this.make.graphics({x:0, y:0, add:false});
        gRoad.fillStyle(0x222222, 1);
        gRoad.fillRect(0, 0, 800, 250);
        gRoad.fillStyle(0x444444, 1);
        gRoad.fillRect(0, 0, 800, 30); 
        gRoad.fillStyle(0x333333, 1);
        gRoad.fillRect(0, 30, 800, 5); 
        gRoad.fillStyle(0xaaaa00, 1);
        for(let i=0; i<800; i+=100) {
            gRoad.fillRect(i, 120, 60, 5);
        }
        gRoad.generateTexture('road', 800, 250);
        gRoad.clear();
    }

    create() {
        this.cityBg = this.add.tileSprite(0, 0, 800, 350, 'city').setOrigin(0, 0).setScrollFactor(0);
        this.roadBg = this.add.tileSprite(0, 350, 800, 250, 'road').setOrigin(0, 0).setScrollFactor(0);

        this.player = new Fighter(this, 200, 450, true, 0x00ffff);
        this.enemies = [];

        this.keys = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
        };

        this.score = 0;
        this.lastWaveX = 0;
        
        this.uiScore = this.add.text(10, 10, 'SCORE: 0', {
            fontSize: '24px', fontFamily: 'Impact, sans-serif', fill: '#fff', stroke: '#000', strokeThickness: 4
        }).setScrollFactor(0).setDepth(10000);

        this.uiHealth = this.add.text(10, 40, 'HP: 100', {
            fontSize: '24px', fontFamily: 'Impact, sans-serif', fill: '#0f0', stroke: '#000', strokeThickness: 4
        }).setScrollFactor(0).setDepth(10000);

        this.uiTarget = this.add.text(400, 50, 'WALK RIGHT ->', {
            fontSize: '48px', fontFamily: 'Impact, sans-serif', fill: '#ff0', stroke: '#000', strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0).setDepth(10000);

        this.uiControls = this.add.text(400, 570, 'Arrows: Move | Space: Jump | Z: Attack', {
            fontSize: '20px', fontFamily: 'Impact, sans-serif', fill: '#fff', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(10000);

        this.uiGameOver = this.add.text(400, 300, 'GAME OVER\nPress Space to Restart', {
            fontSize: '64px', fontFamily: 'Impact, sans-serif', fill: '#f00', stroke: '#000', strokeThickness: 8, align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(10000).setVisible(false);

        this.newTargetProblem();
    }

    createImpactParticles(x, y) {
        try {
            let emitter = this.add.particles(x, y, 'particle', {
                speed: { min: 100, max: 300 },
                angle: { min: 0, max: 360 },
                scale: { start: 1, end: 0 },
                lifespan: 300,
                blendMode: 'ADD',
                tint: [0xffffff, 0xffff00, 0xff0000],
                emitting: false
            });
            emitter.explode(15);
            this.time.delayedCall(500, () => emitter.destroy());
        } catch (e) {
            let manager = this.add.particles('particle');
            let emitter = manager.createEmitter({
                x: x, y: y,
                speed: { min: 100, max: 300 },
                angle: { min: 0, max: 360 },
                scale: { start: 1, end: 0 },
                lifespan: 300,
                blendMode: 'ADD',
                tint: [0xffffff, 0xffff00, 0xff0000],
                on: false
            });
            emitter.explode(15, x, y);
            this.time.delayedCall(500, () => manager.destroy());
        }
    }

    spawnExplosion(x, y) {
        try {
            let emitter = this.add.particles(x, y, 'particle', {
                speed: { min: 50, max: 500 },
                angle: { min: 0, max: 360 },
                scale: { start: 2, end: 0 },
                lifespan: 800,
                blendMode: 'ADD',
                tint: [0xffaa00, 0xff0000, 0x550000],
                gravityY: 400,
                emitting: false
            });
            emitter.explode(40);
            this.time.delayedCall(1000, () => emitter.destroy());
        } catch (e) {
            let manager = this.add.particles('particle');
            let emitter = manager.createEmitter({
                x: x, y: y,
                speed: { min: 50, max: 500 },
                angle: { min: 0, max: 360 },
                scale: { start: 2, end: 0 },
                lifespan: 800,
                blendMode: 'ADD',
                tint: [0xffaa00, 0xff0000, 0x550000],
                gravityY: 400,
                on: false
            });
            emitter.explode(40, x, y);
            this.time.delayedCall(1000, () => manager.destroy());
        }
    }

    newTargetProblem() {
        this.targetAnswer = Math.floor(Math.random() * 40) + 10;
        this.uiTarget.setText('WALK RIGHT ->');
        this.gameState = 'WALKING';
        
        this.enemies.forEach(e => {
            if(e.state !== 'dead') {
                this.spawnExplosion(e.x, e.y - e.z - 50);
                e.takeDamage(100, (Math.random() - 0.5) * 400);
            }
        });
    }

    spawnWave() {
        const numEnemies = 3 + Math.floor(this.score / 30); 
        let correctSpawned = false;
        
        for(let i=0; i<numEnemies; i++) {
            let ex = Math.random() < 0.5 ? this.cameras.main.scrollX - 50 : this.cameras.main.scrollX + 850;
            let ey = 350 + Math.random() * 250;
            
            let enemy = new Fighter(this, ex, ey, false, 0xff0044);
            
            if (!correctSpawned) {
                enemy.isCorrect = true;
                enemy.text.setText(generateMathProblem(this.targetAnswer));
                correctSpawned = true;
            } else {
                enemy.isCorrect = false;
                enemy.text.setText(generateWrongProblem(this.targetAnswer));
            }
            
            this.enemies.push(enemy);
        }
    }

    handleHit(attacker, target) {
        this.createImpactParticles(target.x, target.y - target.z - 50);
        
        if (attacker.isPlayer) {
            if (target.isCorrect) {
                this.cameras.main.flash(100, 255, 255, 255);
                this.cameras.main.shake(150, 0.03);
                target.takeDamage(100, attacker.facing * 300);
                this.score += 10;
                this.uiScore.setText('SCORE: ' + this.score);
                this.spawnExplosion(target.x, target.y - target.z - 50);
                this.newTargetProblem();
            } else {
                this.cameras.main.shake(100, 0.01);
                attacker.takeDamage(10, attacker.facing * -200); 
                this.uiHealth.setText('HP: ' + attacker.hp);
                if (attacker.hp <= 50) this.uiHealth.setColor('#ff0000');
            }
        } else {
            this.cameras.main.shake(100, 0.01);
            target.takeDamage(10, attacker.facing * 200);
            this.uiHealth.setText('HP: ' + target.hp);
            if (target.hp <= 50) this.uiHealth.setColor('#ff0000');
        }
    }

    doAttackHitbox(attacker, rangeX, rangeY) {
        let hitX = attacker.x + attacker.facing * 40; 
        let targets = attacker.isPlayer ? this.enemies : [this.player];
        
        targets.forEach(target => {
            if (target.state === 'dead' || target.state === 'hurt') return;
            
            let dx = target.x - hitX;
            let dy = target.y - attacker.y;
            let dz = target.z - attacker.z;
            
            if (Math.abs(dx) < rangeX && Math.abs(dy) < rangeY && Math.abs(dz) < 40) {
                this.handleHit(attacker, target);
            }
        });
    }

    update(time, delta) {
        if (this.player.hp <= 0 && this.gameState !== 'GAMEOVER') {
            this.gameState = 'GAMEOVER';
            this.uiGameOver.setVisible(true);
        }

        if (this.gameState === 'GAMEOVER') {
            if (Phaser.Input.Keyboard.JustDown(this.keys.jump) || Phaser.Input.Keyboard.JustDown(this.keys.attack)) {
                this.scene.restart();
            }
        }

        this.player.vx = 0;
        this.player.vy = 0;

        if (this.gameState !== 'GAMEOVER' && this.player.state !== 'punch' && this.player.state !== 'hurt' && this.player.state !== 'kick' && this.player.state !== 'dead') {
            let speed = 250;
            if (this.keys.left.isDown) this.player.vx = -speed;
            if (this.keys.right.isDown) this.player.vx = speed;
            if (this.keys.up.isDown) this.player.vy = -speed;
            if (this.keys.down.isDown) this.player.vy = speed;
            
            if (this.player.vx !== 0) {
                this.player.facing = this.player.vx > 0 ? 1 : -1;
            }
            
            if (Phaser.Input.Keyboard.JustDown(this.keys.jump) && this.player.z === 0) {
                this.player.vz = 600;
                this.player.state = 'jump';
            }
            
            if (Phaser.Input.Keyboard.JustDown(this.keys.attack) && this.player.stateTimer <= 0) {
                if (this.player.z > 0) {
                    this.player.state = 'kick';
                    this.player.sprite.setTexture('char_kick');
                    this.player.stateTimer = 500;
                    this.doAttackHitbox(this.player, 60, 25);
                } else {
                    this.player.state = 'punch';
                    this.player.sprite.setTexture('char_punch');
                    this.player.stateTimer = 200;
                    this.player.vx = 0;
                    this.player.vy = 0;
                    this.doAttackHitbox(this.player, 60, 20);
                }
            }
        }

        if (this.gameState === 'WALKING' && this.player.state !== 'dead') {
            if (this.player.x < this.cameras.main.scrollX + 50) {
                this.player.x = this.cameras.main.scrollX + 50;
            }
            if (this.player.x > this.cameras.main.scrollX + 400) {
                this.cameras.main.scrollX = this.player.x - 400;
            }
            
            if (this.cameras.main.scrollX > this.lastWaveX + 600) {
                this.lastWaveX = this.cameras.main.scrollX;
                this.gameState = 'FIGHTING';
                this.uiTarget.setText('TARGET: ' + this.targetAnswer);
                this.spawnWave();
            }
        } else if (this.gameState === 'FIGHTING' && this.player.state !== 'dead') {
            if (this.player.x < this.cameras.main.scrollX + 50) this.player.x = this.cameras.main.scrollX + 50;
            if (this.player.x > this.cameras.main.scrollX + 750) this.player.x = this.cameras.main.scrollX + 750;
        }

        this.cityBg.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.roadBg.tilePositionX = this.cameras.main.scrollX * 1.0;

        this.player.update(time, delta);
        
        this.enemies.forEach(enemy => {
            enemy.update(time, delta);
            
            if (enemy.state === 'dead' || this.gameState !== 'FIGHTING' || this.gameState === 'GAMEOVER') return;
            
            let dx = this.player.x - enemy.x;
            let dy = this.player.y - enemy.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            
            if (enemy.state !== 'punch' && enemy.state !== 'hurt' && enemy.state !== 'kick') {
                if (dist > 70) {
                    enemy.vx = (dx / dist) * (80 + Math.random() * 40); 
                    enemy.vy = (dy / dist) * (80 + Math.random() * 40);
                    enemy.facing = dx > 0 ? 1 : -1;
                } else {
                    enemy.vx = 0;
                    enemy.vy = 0;
                    if (Math.abs(dy) < 20 && Math.random() < 0.03 && this.player.state !== 'dead') {
                        enemy.state = 'punch'; 
                        enemy.sprite.setTexture('char_punch');
                        enemy.stateTimer = 400; 
                        this.time.delayedCall(200, () => {
                            if (enemy.state === 'punch' && enemy.stateTimer > 0) {
                                this.doAttackHitbox(enemy, 50, 20);
                            }
                        });
                    }
                }
            }
        });

        this.enemies = this.enemies.filter(e => {
            if (e.state === 'dead' && e.sprite.alpha <= 0) {
                e.destroy();
                return false;
            }
            return true;
        });
    }
}

const FaskaRage = ({ onExit }) => {
    const gameRef = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'phaser-faskarage-container',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: MainScene
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
            }
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', border: '2px solid #000' }}>
            <div id="phaser-faskarage-container" style={{ width: '100%', height: '100%' }} />
            <button
                onClick={onExit}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '10px 20px',
                    fontSize: '18px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: '2px solid #fff',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 10,
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
            >
                Beenden
            </button>
        </div>
    );
};

export default FaskaRage;
