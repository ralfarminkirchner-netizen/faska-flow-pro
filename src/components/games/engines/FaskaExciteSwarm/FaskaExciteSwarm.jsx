import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const REGULAR_VERBS = ['play', 'walk', 'talk', 'call', 'look', 'wash', 'clean', 'work', 'start', 'try', 'cook', 'paint', 'help', 'jump'];
const IRREGULAR_VERBS = ['go', 'eat', 'see', 'take', 'make', 'come', 'know', 'find', 'give', 'tell', 'run', 'swim', 'fly', 'buy'];

class PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Draw track lines
        this.graphics = this.add.graphics();
        this.lanes = [200, 300, 400, 500];
        
        this.drawTrack();

        this.playerGroup = this.add.group();
        
        // Player setup
        this.player = {
            lane: 2, 
            z: 0, 
            vz: 0,
            isJumping: false,
            speed: 5,
            heat: 0,
            overheated: false,
            shadow: this.add.ellipse(150, this.lanes[2] + 20, 70, 20, 0x000000, 0.6),
            sprite: this.add.rectangle(150, this.lanes[2], 70, 40, 0x00d2d3),
            frontWheel: this.add.circle(180, this.lanes[2] + 20, 15, 0x333333),
            backWheel: this.add.circle(120, this.lanes[2] + 20, 15, 0x333333),
            rider: this.add.rectangle(140, this.lanes[2] - 25, 30, 40, 0xff9f43)
        };
        
        this.player.sprite.setStrokeStyle(3, 0xffffff);
        this.player.frontWheel.setStrokeStyle(3, 0xaaaaaa);
        this.player.backWheel.setStrokeStyle(3, 0xaaaaaa);
        
        // Group rider elements to move them easily
        this.bikeParts = [this.player.sprite, this.player.frontWheel, this.player.backWheel, this.player.rider];

        this.obstacles = [];
        this.score = 0;
        
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#00d2d3', fontStyle: 'bold' });
        this.heatText = this.add.text(600, 16, 'Heat: 0%', { fontSize: '28px', fill: '#ff9f43', fontStyle: 'bold' });
        this.heatBarBg = this.add.rectangle(600, 60, 180, 25, 0x222222).setOrigin(0, 0.5);
        this.heatBarBg.setStrokeStyle(2, 0xffffff);
        this.heatBar = this.add.rectangle(602, 60, 0, 21, 0xff9f43).setOrigin(0, 0.5);

        this.add.text(400, 30, 'Jump (SPACE) over Irregular Verbs\nDrive through Regular Verbs\nArrows UP/DOWN to switch lanes\nRight Arrow to speed up (watch HEAT!)', { fontSize: '18px', fill: '#ffffff', align: 'center' }).setOrigin(0.5, 0);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.spawnEvent = this.time.addEvent({
            delay: 1800,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });
        
        // Speed lines for background
        this.speedLines = [];
        for(let i=0; i<15; i++) {
            this.createSpeedLine();
        }
    }
    
    createSpeedLine() {
        let line = this.add.rectangle(Phaser.Math.Between(0, 800), Phaser.Math.Between(150, 550), Phaser.Math.Between(50, 200), 2, 0xffffff, 0.1);
        this.speedLines.push(line);
    }
    
    drawTrack() {
        this.graphics.clear();
        
        // Draw track area
        this.graphics.fillStyle(0x2d3436, 1);
        this.graphics.fillRect(0, 150, 800, 420);
        
        this.graphics.lineStyle(2, 0x636e72, 0.5);
        for(let i=0; i<this.lanes.length; i++) {
            this.graphics.beginPath();
            this.graphics.moveTo(0, this.lanes[i]);
            this.graphics.lineTo(800, this.lanes[i]);
            this.graphics.strokePath();
        }
    }

    spawnObstacle() {
        if (this.player.overheated && this.player.speed < 2) return;
        
        const lane = Phaser.Math.Between(0, 3);
        const isIrregular = Math.random() > 0.5;
        const verb = isIrregular 
            ? IRREGULAR_VERBS[Phaser.Math.Between(0, IRREGULAR_VERBS.length - 1)]
            : REGULAR_VERBS[Phaser.Math.Between(0, REGULAR_VERBS.length - 1)];

        const mudColor = 0x8b4513; 
        
        const container = this.add.container(850, this.lanes[lane]);
        const puddle = this.add.ellipse(0, 0, 140, 50, mudColor, 0.9);
        puddle.setStrokeStyle(3, 0x5c2c09);
        
        // Add some mud spots
        const spot1 = this.add.ellipse(-30, -10, 40, 20, 0x5c2c09, 0.5);
        const spot2 = this.add.ellipse(20, 15, 50, 15, 0x5c2c09, 0.5);
        
        const text = this.add.text(0, 0, verb, { fontSize: '26px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'Arial' }).setOrigin(0.5);
        text.setShadow(2, 2, '#000000', 0, false, true);
        
        container.add([puddle, spot1, spot2, text]);
        container.setDepth(this.lanes[lane]);
        
        this.obstacles.push({
            obj: container,
            lane: lane,
            isIrregular: isIrregular,
            active: true
        });
    }
    
    showFeedback(x, y, text, color) {
        const t = this.add.text(x, y, text, { fontSize: '32px', fill: color, fontStyle: 'bold' }).setOrigin(0.5);
        t.setShadow(2, 2, '#000', 2, false, true);
        t.setDepth(1000);
        this.tweens.add({
            targets: t,
            y: y - 80,
            scale: 1.5,
            alpha: 0,
            duration: 800,
            onComplete: () => t.destroy()
        });
    }
    
    createSplash(x, y, color) {
        for(let i=0; i<15; i++) {
            let p = this.add.rectangle(x, y, 8, 8, color);
            p.setDepth(1000);
            let vx = Phaser.Math.Between(-150, 150);
            let vy = Phaser.Math.Between(-250, -50);
            this.tweens.add({
                targets: p,
                x: x + vx,
                y: y + vy,
                alpha: 0,
                rotation: 10,
                duration: 600 + Math.random()*400,
                onComplete: () => p.destroy()
            });
        }
    }
    
    createDust(x, y) {
        let p = this.add.rectangle(x, y, 10, 10, 0xbdc3c7, 0.6);
        let vx = Phaser.Math.Between(-100, -50);
        let vy = Phaser.Math.Between(-10, 10);
        this.tweens.add({
            targets: p,
            x: x + vx,
            y: y + vy,
            scale: 3,
            alpha: 0,
            duration: 500,
            onComplete: () => p.destroy()
        });
    }

    update(time, delta) {
        // Player Input
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.player.lane > 0 && !this.player.isJumping) {
            this.player.lane--;
            this.cameras.main.shake(50, 0.002);
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.down) && this.player.lane < 3 && !this.player.isJumping) {
            this.player.lane++;
            this.cameras.main.shake(50, 0.002);
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space) && !this.player.isJumping && !this.player.overheated) {
            this.player.isJumping = true;
            this.player.vz = -15; // jump strength
            this.cameras.main.shake(80, 0.005);
        }
        
        // Heat and Speed mechanics
        if (!this.player.overheated) {
            if (this.cursors.right.isDown) {
                this.player.speed = Phaser.Math.Linear(this.player.speed, 15, 0.05);
                this.player.heat += 0.4;
                
                this.player.sprite.rotation = -0.15;
                this.player.rider.rotation = -0.15;
                this.player.frontWheel.y = this.player.shadow.y - 15 + this.player.z - 10;
            } else {
                this.player.speed = Phaser.Math.Linear(this.player.speed, 6, 0.05);
                this.player.heat -= 0.3;
                this.player.sprite.rotation = 0;
                this.player.rider.rotation = 0;
            }
            
            if (this.player.heat > 100) {
                this.player.heat = 100;
                this.player.overheated = true;
                this.cameras.main.flash(500, 255, 100, 0);
                this.heatText.setText("OVERHEATED!");
                this.heatText.setColor('#ff0000');
                
                this.createSplash(this.player.sprite.x, this.player.sprite.y, 0x333333);
            }
        } else {
            this.player.speed = Phaser.Math.Linear(this.player.speed, 2, 0.1);
            this.player.heat -= 0.5;
            this.player.sprite.rotation = 0;
            this.player.rider.rotation = 0;
            
            this.player.sprite.fillColor = 0xe74c3c;
            
            if (Math.random() < 0.2) {
                this.createDust(this.player.sprite.x, this.player.sprite.y - 20);
            }
            
            if (this.player.heat <= 0) {
                this.player.overheated = false;
                this.player.heat = 0;
                this.player.sprite.fillColor = 0x00d2d3;
                this.heatText.setText("Heat: 0%");
            }
        }
        
        this.player.heat = Phaser.Math.Clamp(this.player.heat, 0, 100);
        this.heatBar.width = (this.player.heat / 100) * 176;
        if (!this.player.overheated) {
            this.heatText.setText(`Heat: ${Math.floor(this.player.heat)}%`);
            this.heatText.setColor(this.player.heat > 80 ? '#e74c3c' : '#ff9f43');
            this.heatBar.fillColor = this.player.heat > 80 ? 0xe74c3c : 0xff9f43;
        }

        // Jump physics
        if (this.player.isJumping) {
            this.player.z += this.player.vz;
            this.player.vz += 0.8;
            
            if (this.player.z >= 0) {
                this.player.z = 0;
                this.player.isJumping = false;
                this.cameras.main.shake(100, 0.008);
                this.createSplash(this.player.sprite.x, this.player.shadow.y, 0xbdc3c7);
            }
        }
        
        // Background speed lines
        this.speedLines.forEach(line => {
            line.x -= this.player.speed * 1.5;
            if (line.x < -100) {
                line.x = 900;
                line.y = Phaser.Math.Between(150, 550);
            }
        });
        
        // Update player visuals
        const targetY = this.lanes[this.player.lane];
        this.player.shadow.y = Phaser.Math.Linear(this.player.shadow.y, targetY + 20, 0.2);
        
        this.player.shadow.setDepth(targetY);
        this.bikeParts.forEach(part => part.setDepth(targetY + 1));
        
        const baseY = this.player.shadow.y - 20;
        this.player.sprite.y = baseY + this.player.z;
        this.player.rider.y = baseY - 25 + this.player.z;
        
        this.player.frontWheel.rotation += this.player.speed * 0.1;
        this.player.backWheel.rotation += this.player.speed * 0.1;
        
        if (!this.cursors.right.isDown || this.player.overheated) {
            this.player.frontWheel.y = baseY + 20 + this.player.z;
        }
        this.player.backWheel.y = baseY + 20 + this.player.z;
        
        if (this.player.speed > 3 && !this.player.isJumping && Math.random() < 0.2) {
            this.createDust(this.player.backWheel.x, this.player.backWheel.y);
        }
        
        this.player.shadow.scaleX = 1 - (Math.abs(this.player.z) / 300);
        this.player.shadow.scaleY = 1 - (Math.abs(this.player.z) / 300);
        
        // Update obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            let obs = this.obstacles[i];
            obs.obj.x -= this.player.speed;
            
            if (obs.active && Math.abs(obs.obj.x - 150) < 50) {
                if (obs.lane === this.player.lane) {
                    if (this.player.isJumping) {
                        if (obs.isIrregular) {
                            this.score += 200;
                            this.showFeedback(obs.obj.x, obs.obj.y - 50, "PERFECT JUMP!", "#00ff00");
                        } else {
                            this.showFeedback(obs.obj.x, obs.obj.y - 50, "MISSED REGULAR!", "#aaaaaa");
                        }
                    } else {
                        if (obs.isIrregular) {
                            this.player.heat += 40; 
                            this.player.speed = 1;
                            this.cameras.main.shake(300, 0.03);
                            this.showFeedback(obs.obj.x, obs.obj.y - 50, "CRASH!", "#ff0000");
                            this.createSplash(150, obs.obj.y, 0x8b4513);
                        } else {
                            this.score += 100;
                            this.showFeedback(obs.obj.x, obs.obj.y - 50, "MUD SPLASH!", "#00d2d3");
                            this.createSplash(150, obs.obj.y, 0x8b4513);
                        }
                    }
                    this.scoreText.setText(`Score: ${this.score}`);
                    obs.active = false;
                    
                    this.tweens.add({
                        targets: obs.obj,
                        alpha: 0.3,
                        duration: 300
                    });
                }
            }
            
            if (obs.obj.x < -100) {
                obs.obj.destroy();
                this.obstacles.splice(i, 1);
            }
        }
    }
}

const FaskaExciteSwarm = ({ onExit }) => {
    const gameRef = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'phaser-faska-excite-swarm',
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
            scene: PlayScene
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
        <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', overflow: 'hidden' }}>
            <div id="phaser-faska-excite-swarm" style={{ width: '100%', height: '100%' }}></div>
            <button
                onClick={onExit}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
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

export default FaskaExciteSwarm;
