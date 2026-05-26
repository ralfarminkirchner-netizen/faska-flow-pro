import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const VIRUS_TYPES = [
    { id: 0, virus: 'Influenza', vaccine: 'Flu Shot', color: 0xff4444 },
    { id: 1, virus: 'SARS-CoV-2', vaccine: 'mRNA-1273', color: 0x44ff44 },
    { id: 2, virus: 'Rabies', vaccine: 'Rabies Ig', color: 0x4444ff },
    { id: 3, virus: 'Hepatitis B', vaccine: 'HepB', color: 0xffff44 },
];

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.score = 0;
        this.lives = 3;
        this.currentVaccineId = -1;
        this.lastFired = 0;
    }

    preload() {
        // Graphics generation for offline play without assets
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Ship
        graphics.fillStyle(0x00ffff, 1);
        graphics.beginPath();
        graphics.moveTo(0, 0);
        graphics.lineTo(40, 20);
        graphics.lineTo(0, 40);
        graphics.lineTo(10, 20);
        graphics.closePath();
        graphics.fillPath();
        graphics.generateTexture('ship', 40, 40);
        graphics.clear();

        // Laser
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(0, 0, 20, 6);
        graphics.generateTexture('laser', 20, 6);
        graphics.clear();

        // Vaccine Powerup (Pill shape)
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRoundedRect(0, 0, 40, 20, 10);
        graphics.fillStyle(0x00ccff, 1);
        graphics.fillRoundedRect(20, 0, 20, 20, { tr: 10, br: 10, tl: 0, bl: 0 });
        graphics.generateTexture('vaccine_tex', 40, 20);
        graphics.clear();

        // Virus (Spiky circle)
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(25, 25, 15);
        for(let i=0; i<12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            graphics.fillCircle(25 + Math.cos(angle)*20, 25 + Math.sin(angle)*20, 4);
        }
        graphics.generateTexture('virus_tex', 50, 50);
        graphics.clear();
        
        // Particle
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(0, 0, 6, 6);
        graphics.generateTexture('particle', 6, 6);
        graphics.clear();
    }

    create() {
        this.score = 0;
        this.lives = 3;
        this.currentVaccineId = -1;

        // Background Starfield
        this.stars = [];
        for (let i = 0; i < 150; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const size = Phaser.Math.FloatBetween(1, 3);
            const alpha = Phaser.Math.FloatBetween(0.2, 0.8);
            const speed = Phaser.Math.FloatBetween(0.5, 3.5);
            const rect = this.add.rectangle(x, y, size, size, 0xffffff, alpha);
            this.stars.push({ rect, speed });
        }

        // Engine Particles
        this.engineParticles = this.add.particles(0, 0, 'particle', {
            speed: { min: 20, max: 60 },
            angle: { min: 160, max: 200 },
            scale: { start: 0.6, end: 0 },
            lifespan: 400,
            blendMode: 'ADD',
            tint: 0x00ffff
        });

        // Player
        this.player = this.physics.add.sprite(100, 300, 'ship');
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(30, 20);
        
        this.engineParticles.startFollow(this.player, -20, 0);

        // Physics Groups
        this.lasers = this.physics.add.group();
        this.viruses = this.physics.add.group();
        this.vaccines = this.physics.add.group();
        
        // Label Groups (we use normal groups for easier iteration)
        this.virusLabels = this.add.group();
        this.vaccineLabels = this.add.group();

        // UI
        this.scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '24px', fill: '#fff', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 });
        this.livesText = this.add.text(20, 50, 'Lives: 3', { fontSize: '24px', fill: '#ff4444', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 });
        this.vaccineUI = this.add.text(400, 560, 'NO VACCINE EQUIPPED', { fontSize: '22px', fill: '#888', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };

        // Spawners
        this.time.addEvent({ delay: 1800, callback: this.spawnVirus, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 5000, callback: this.spawnVaccine, callbackScope: this, loop: true });

        // Collisions
        this.physics.add.overlap(this.lasers, this.viruses, this.hitVirus, null, this);
        this.physics.add.overlap(this.player, this.vaccines, this.collectVaccine, null, this);
        this.physics.add.overlap(this.player, this.viruses, this.playerHit, null, this);

        // Explosion Particles
        this.particles = this.add.particles(0, 0, 'particle', {
            speed: { min: 50, max: 250 },
            angle: { min: 0, max: 360 },
            scale: { start: 1.5, end: 0 },
            lifespan: 600,
            blendMode: 'ADD',
            emitting: false
        });
    }

    spawnVirus() {
        const y = Phaser.Math.Between(80, 520);
        const type = Phaser.Math.RND.pick(VIRUS_TYPES);
        const virus = this.viruses.create(850, y, 'virus_tex');
        virus.setTint(type.color);
        virus.virusData = type;
        virus.setVelocityX(Phaser.Math.Between(-180, -120));
        virus.body.setCircle(18, 7, 7);
        
        virus.startY = y;
        virus.timeOffset = Phaser.Math.FloatBetween(0, Math.PI * 2);

        const label = this.add.text(850, y - 35, type.virus, { fontSize: '16px', fill: '#fff', fontStyle: 'bold', stroke: '#000', strokeThickness: 3 }).setOrigin(0.5);
        label.virusRef = virus;
        this.virusLabels.add(label);
    }

    spawnVaccine() {
        const y = Phaser.Math.Between(80, 520);
        const type = Phaser.Math.RND.pick(VIRUS_TYPES);
        const vaccine = this.vaccines.create(850, y, 'vaccine_tex');
        vaccine.vaccineData = type;
        vaccine.setVelocityX(-90);
        // Pulse effect
        this.tweens.add({
            targets: vaccine,
            scaleX: 1.1,
            scaleY: 1.1,
            yoyo: true,
            repeat: -1,
            duration: 600
        });

        const label = this.add.text(850, y - 30, type.vaccine, { fontSize: '16px', fill: '#00ffff', fontStyle: 'bold', stroke: '#000', strokeThickness: 3 }).setOrigin(0.5);
        label.vaccineRef = vaccine;
        this.vaccineLabels.add(label);
    }

    update(time, delta) {
        if (this.lives <= 0) return;

        // Background Parallax
        this.stars.forEach(star => {
            star.rect.x -= star.speed;
            if (star.rect.x < 0) {
                star.rect.x = 800;
                star.rect.y = Phaser.Math.Between(0, 600);
            }
        });

        // Player Movement
        let speed = 350;
        let vx = 0;
        let vy = 0;

        if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -speed;
        else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = speed;

        if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -speed;
        else if (this.cursors.down.isDown || this.wasd.down.isDown) vy = speed;

        this.player.setVelocity(vx, vy);
        
        // Tilt player slightly when moving up/down
        this.player.setAngle(vy < 0 ? -15 : (vy > 0 ? 15 : 0));

        // Shooting
        if (this.spaceBar.isDown && time > this.lastFired) {
            const laser = this.lasers.create(this.player.x + 20, this.player.y, 'laser');
            laser.setVelocityX(700);
            laser.vaccineId = this.currentVaccineId;
            
            if (this.currentVaccineId !== -1) {
                const currentType = VIRUS_TYPES.find(v => v.id === this.currentVaccineId);
                laser.setTint(currentType.color);
            } else {
                laser.setTint(0xaaaaaa);
            }
            this.lastFired = time + 200; // Fire rate
        }

        // Entities Update
        this.virusLabels.children.iterate((label) => {
            if (label && label.virusRef) {
                if (!label.virusRef.active) {
                    label.destroy();
                } else {
                    const v = label.virusRef;
                    v.rotation += 0.03;
                    v.y = v.startY + Math.sin(time / 400 + v.timeOffset) * 60;
                    label.x = v.x;
                    label.y = v.y - 35;
                    if (v.x < -50) v.destroy();
                }
            }
        });

        this.vaccineLabels.children.iterate((label) => {
            if (label && label.vaccineRef) {
                if (!label.vaccineRef.active) {
                    label.destroy();
                } else {
                    label.x = label.vaccineRef.x;
                    label.y = label.vaccineRef.y - 30;
                    if (label.vaccineRef.x < -50) label.vaccineRef.destroy();
                }
            }
        });

        // Cleanup offscreen lasers
        this.lasers.children.iterate((laser) => {
            if (laser && laser.x > 850) {
                laser.destroy();
            }
        });
    }

    hitVirus(laser, virus) {
        if (laser.vaccineId === virus.virusData.id) {
            laser.destroy();
            this.particles.setParticleTint(virus.virusData.color);
            this.particles.explode(40, virus.x, virus.y);
            virus.destroy();
            
            this.score += 100;
            this.scoreText.setText(`Score: ${this.score}`);
            this.cameras.main.shake(150, 0.015);
        } else {
            laser.destroy();
            const text = this.add.text(virus.x, virus.y - 20, 'IMMUNE!', { fontSize: '18px', fill: '#fff', fontStyle: 'bold', stroke: '#f00', strokeThickness: 4 }).setOrigin(0.5);
            this.tweens.add({
                targets: text,
                y: text.y - 40,
                alpha: 0,
                duration: 600,
                onComplete: () => text.destroy()
            });
            // Small deflect particle
            this.particles.setParticleTint(0xffffff);
            this.particles.explode(5, laser.x, laser.y);
        }
    }

    collectVaccine(player, vaccine) {
        this.currentVaccineId = vaccine.vaccineData.id;
        
        const hexColor = `#${vaccine.vaccineData.color.toString(16).padStart(6, '0')}`;
        this.vaccineUI.setText(`EQUIPPED: ${vaccine.vaccineData.vaccine.toUpperCase()}`);
        this.vaccineUI.setFill(hexColor);
        
        // Text pulse animation
        this.tweens.add({
            targets: this.vaccineUI,
            scaleX: 1.2,
            scaleY: 1.2,
            yoyo: true,
            duration: 150
        });
        
        this.particles.setParticleTint(vaccine.vaccineData.color);
        this.particles.explode(20, vaccine.x, vaccine.y);
        
        vaccine.destroy();
        this.cameras.main.flash(200, 0, 255, 255, 0.15);
    }

    playerHit(player, virus) {
        virus.destroy();
        this.lives -= 1;
        this.livesText.setText(`Lives: ${this.lives}`);
        this.cameras.main.shake(300, 0.03);
        
        this.particles.setParticleTint(0xff0000);
        this.particles.explode(50, player.x, player.y);

        if (this.lives <= 0) {
            this.physics.pause();
            this.player.setTint(0xff0000);
            this.engineParticles.stop();
            
            const gameOverText = this.add.text(400, 260, 'GAME OVER', { fontSize: '64px', fill: '#ff0000', fontStyle: 'bold', stroke: '#000', strokeThickness: 8 }).setOrigin(0.5);
            const restartText = this.add.text(400, 340, 'Click to Restart', { fontSize: '28px', fill: '#fff', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);
            
            this.tweens.add({
                targets: restartText,
                alpha: 0,
                yoyo: true,
                repeat: -1,
                duration: 800
            });

            restartText.setInteractive();
            this.input.once('pointerdown', () => {
                this.scene.restart();
            });
        } else {
            this.player.setAlpha(0.5);
            this.physics.world.disable(this.player);
            this.time.delayedCall(1500, () => {
                if (this.lives > 0) {
                    this.player.setAlpha(1);
                    this.physics.world.enable(this.player);
                }
            });
        }
    }
}

const FaskaRTypeSwarm = ({ onExit }) => {
    const gameRef = useRef(null);
    const gameInstance = useRef(null);

    useEffect(() => {
        if (!gameRef.current) return;

        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameRef.current,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
            scene: MainScene
        };

        gameInstance.current = new Phaser.Game(config);

        return () => {
            if (gameInstance.current) {
                gameInstance.current.destroy(true);
            }
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', background: '#000', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
            <div ref={gameRef} />
            <button 
                onClick={onExit}
                style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    padding: '10px 24px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: '3px solid #c0392b',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    zIndex: 10,
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
                    transition: 'transform 0.1s'
                }}
                onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
                Beenden
            </button>
        </div>
    );
};

export default FaskaRTypeSwarm;
