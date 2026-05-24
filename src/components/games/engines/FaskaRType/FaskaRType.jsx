import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const statements = [
    { text: 'Die Erde ist rund', isTrue: true },
    { text: 'Wasser kocht bei 100°C', isTrue: true },
    { text: 'Ein Jahr hat 12 Monate', isTrue: true },
    { text: 'Fische leben im Wasser', isTrue: true },
    { text: 'Der Mond kreist um die Erde', isTrue: true },
    { text: 'Pflanzen brauchen Licht', isTrue: true },
    { text: 'Schweine können fliegen', isTrue: false },
    { text: 'Die Sonne ist kalt', isTrue: false },
    { text: 'Ein Tag hat 10 Stunden', isTrue: false },
    { text: 'Kühe legen Eier', isTrue: false },
    { text: 'Der Mond ist aus Käse', isTrue: false },
    { text: 'Zitronen sind süß', isTrue: false }
];

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        this.score = 0;
        this.health = 3;
        this.gameOver = false;

        // Background stars
        this.stars = this.add.graphics();
        this.starData = [];
        for (let i = 0; i < 100; i++) {
            this.starData.push({
                x: Phaser.Math.Between(0, 800),
                y: Phaser.Math.Between(0, 600),
                speed: Phaser.Math.FloatBetween(0.5, 2.5),
                radius: Phaser.Math.FloatBetween(0.5, 1.5)
            });
        }

        // Generate textures via Graphics API
        this.generateTextures();

        this.player = this.physics.add.sprite(100, 300, 'playerShip');
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.lastFired = 0;
        this.lastEnginePart = 0;

        this.lasers = this.physics.add.group();
        this.enemies = this.physics.add.group();

        this.scoreText = this.add.text(10, 10, 'Punkte: 0', { fontSize: '20px', fill: '#fff' });
        this.healthText = this.add.text(10, 40, 'Leben: 3', { fontSize: '20px', fill: '#ff4444' });

        this.spawnTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.lasers, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.crashEnemy, null, this);
    }

    generateTextures() {
        // Player Ship
        const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        playerGraphics.lineStyle(2, 0x00ffff);
        playerGraphics.fillStyle(0x004444);
        playerGraphics.beginPath();
        playerGraphics.moveTo(0, 0);
        playerGraphics.lineTo(40, 15);
        playerGraphics.lineTo(0, 30);
        playerGraphics.lineTo(10, 15);
        playerGraphics.closePath();
        playerGraphics.fillPath();
        playerGraphics.strokePath();
        playerGraphics.generateTexture('playerShip', 40, 30);

        // Laser
        const laserGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        laserGraphics.fillStyle(0xffff00);
        laserGraphics.fillRect(0, 0, 20, 4);
        laserGraphics.generateTexture('laser', 20, 4);

        // Asteroid/Enemy
        const astGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        astGraphics.lineStyle(2, 0xffaa00);
        astGraphics.fillStyle(0x442200);
        astGraphics.beginPath();
        const points = 8;
        const radius = 30;
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const r = radius + Phaser.Math.Between(-10, 10);
            const px = 40 + Math.cos(angle) * r; 
            const py = 40 + Math.sin(angle) * r;
            if (i === 0) astGraphics.moveTo(px, py);
            else astGraphics.lineTo(px, py);
        }
        astGraphics.closePath();
        astGraphics.fillPath();
        astGraphics.strokePath();
        astGraphics.generateTexture('asteroid', 80, 80);

        // Particles
        const partGraphics1 = this.make.graphics({ x: 0, y: 0, add: false });
        partGraphics1.fillStyle(0xffaa00);
        partGraphics1.fillCircle(4, 4, 4);
        partGraphics1.generateTexture('partGood', 8, 8);

        const partGraphics2 = this.make.graphics({ x: 0, y: 0, add: false });
        partGraphics2.fillStyle(0xff0000);
        partGraphics2.fillCircle(4, 4, 4);
        partGraphics2.generateTexture('partBad', 8, 8);

        const partGraphics3 = this.make.graphics({ x: 0, y: 0, add: false });
        partGraphics3.fillStyle(0x00ffff);
        partGraphics3.fillRect(0, 0, 4, 4);
        partGraphics3.generateTexture('partEngine', 4, 4);
    }

    spawnEnemy() {
        if (this.gameOver) return;

        const y = Phaser.Math.Between(80, 520);
        const enemy = this.enemies.create(850, y, 'asteroid');
        
        const statement = Phaser.Utils.Array.GetRandom(statements);
        enemy.isTrue = statement.isTrue;
        
        const speed = Phaser.Math.Between(-80, -150);
        enemy.setVelocityX(speed);
        enemy.setAngularVelocity(Phaser.Math.Between(-50, 50));
        
        const text = this.add.text(850, y - 40, statement.text, {
            fontSize: '18px',
            fontFamily: 'sans-serif',
            fill: '#ffffff',
            backgroundColor: '#000000aa',
            padding: { x: 6, y: 4 },
            stroke: '#000000',
            strokeThickness: 2
        });
        text.setOrigin(0.5);
        enemy.textLabel = text;
    }

    createExplosion(x, y, texture) {
        // Fallback-safe "particle" explosion using sprites to avoid API versioning issues
        for (let i = 0; i < 20; i++) {
            const part = this.physics.add.sprite(x, y, texture);
            part.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
            this.tweens.add({
                targets: part,
                scale: 0,
                alpha: 0,
                duration: 600,
                onComplete: () => part.destroy()
            });
        }
    }

    showFeedback(x, y, msg, colorHex) {
        const fb = this.add.text(x, y, msg, {
            fontSize: '24px',
            fontFamily: 'sans-serif',
            fontStyle: 'bold',
            fill: colorHex,
            stroke: '#000',
            strokeThickness: 4
        });
        fb.setOrigin(0.5);
        this.tweens.add({
            targets: fb,
            y: y - 50,
            alpha: 0,
            duration: 1200,
            onComplete: () => fb.destroy()
        });
    }

    hitEnemy(laser, enemy) {
        laser.destroy();
        
        if (enemy.isTrue) {
            // Bad: Shot a TRUE statement
            this.health--;
            this.healthText.setText('Leben: ' + this.health);
            this.cameras.main.shake(200, 0.02);
            this.createExplosion(enemy.x, enemy.y, 'partBad');
            this.showFeedback(enemy.x, enemy.y, "FALSCH!\nDas stimmt doch!", '#ff0000');
        } else {
            // Good: Shot a FALSE statement
            this.score += 10;
            this.scoreText.setText('Punkte: ' + this.score);
            this.cameras.main.shake(100, 0.01);
            this.createExplosion(enemy.x, enemy.y, 'partGood');
            this.showFeedback(enemy.x, enemy.y, "RICHTIG!", '#00ff00');
        }

        if (enemy.textLabel) enemy.textLabel.destroy();
        enemy.destroy();

        if (this.health <= 0) {
            this.doGameOver();
        }
    }

    crashEnemy(player, enemy) {
        this.health--;
        this.healthText.setText('Leben: ' + this.health);
        this.cameras.main.shake(300, 0.03);
        this.createExplosion(enemy.x, enemy.y, 'partBad');
        
        if (enemy.textLabel) enemy.textLabel.destroy();
        enemy.destroy();

        if (this.health <= 0) {
            this.doGameOver();
        }
    }

    doGameOver() {
        this.gameOver = true;
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.spawnTimer.remove();
        
        const goText = this.add.text(400, 300, 'GAME OVER\nKlicke zum Neustart', {
            fontSize: '48px',
            fontFamily: 'sans-serif',
            fontStyle: 'bold',
            fill: '#ffffff',
            align: 'center',
            backgroundColor: '#000000cc',
            padding: { x: 20, y: 20 }
        });
        goText.setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.restart();
        });
    }

    update(time, delta) {
        if (this.gameOver) return;

        // Animate background stars
        this.stars.clear();
        this.stars.fillStyle(0xffffff, 0.8);
        for (const star of this.starData) {
            star.x -= star.speed;
            if (star.x < 0) {
                star.x = 800;
                star.y = Phaser.Math.Between(0, 600);
            }
            this.stars.fillCircle(star.x, star.y, star.radius);
        }

        // Engine particles (Sprite-based to avoid API version breaks)
        if (time > this.lastEnginePart) {
            const part = this.physics.add.sprite(this.player.x - 15, this.player.y + Phaser.Math.Between(-5, 5), 'partEngine');
            part.setVelocity(Phaser.Math.Between(-150, -50), Phaser.Math.Between(-20, 20));
            this.tweens.add({
                targets: part,
                scale: 0,
                alpha: 0,
                duration: 300,
                onComplete: () => part.destroy()
            });
            this.lastEnginePart = time + 30;
        }

        // Player movement
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-300);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(300);
        }

        // Shooting
        if (this.spaceKey.isDown && time > this.lastFired) {
            const laser = this.lasers.create(this.player.x + 20, this.player.y, 'laser');
            laser.setVelocityX(600);
            this.lastFired = time + 250;
        }

        // Update enemy text positions and clean up out-of-bounds
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.textLabel) {
                enemy.textLabel.x = enemy.x;
                enemy.textLabel.y = enemy.y - 45;
            }
            if (enemy.x < -150) {
                if (enemy.textLabel) enemy.textLabel.destroy();
                
                if (!enemy.isTrue) {
                    // Missed a FALSE statement
                    this.showFeedback(100, enemy.y, "Verpasst!", '#ffa500');
                    this.score = Math.max(0, this.score - 5);
                    this.scoreText.setText('Punkte: ' + this.score);
                } else {
                    // Let a TRUE statement pass (Good!)
                    this.score += 5;
                    this.scoreText.setText('Punkte: ' + this.score);
                    this.showFeedback(100, enemy.y, "Richtig erkannt!", '#00ff00');
                }
                
                enemy.destroy();
            }
        });

        // Cleanup out-of-bounds lasers
        this.lasers.getChildren().forEach(laser => {
            if (laser.x > 850) {
                laser.destroy();
            }
        });
    }
}

export default function FaskaRType({ onExit }) {
    const gameRef = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'phaser-faskartype-container',
            backgroundColor: '#000000',
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
            scene: MainScene
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;

        return () => {
            game.destroy(true);
        };
    }, []);

    return (
        <div style={{
            position: 'relative',
            width: '800px',
            height: '600px',
            margin: '0 auto',
            border: '2px solid #333',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            backgroundColor: '#000'
        }}>
            <div id="phaser-faskartype-container" style={{ width: '100%', height: '100%' }}></div>
            
            <button 
                onClick={onExit}
                style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: '2px solid #aa0000',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
                onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#ff6666';
                    e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#ff4444';
                    e.target.style.transform = 'scale(1)';
                }}
            >
                Beenden
            </button>

            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                color: '#aaa',
                fontSize: '14px',
                fontFamily: 'sans-serif',
                pointerEvents: 'none'
            }}>
                Steuerung: PFEILTASTEN = Bewegen | LEERTASTE = Schießen<br/>
                Ziel: Zerstöre FALSCHE Aussagen. Lass WAHRE Aussagen passieren!
            </div>
        </div>
    );
}
