import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const FaskaRCSwarm = ({ onExit }) => {
    const gameContainer = useRef(null);

    useEffect(() => {
        if (!gameContainer.current) return;

        class MainScene extends Phaser.Scene {
            constructor() {
                super({ key: 'MainScene' });
            }

            create() {
                this.createTextures();
                
                // Arena Background
                this.add.rectangle(400, 300, 800, 600, 0x1a1a1a);
                
                // Draw Track
                let trackGraphics = this.add.graphics();
                trackGraphics.lineStyle(8, 0x00ffcc, 0.8);
                trackGraphics.strokeRect(5, 5, 790, 590);
                
                // Grid Background
                trackGraphics.lineStyle(1, 0x00ffcc, 0.1);
                for(let i = 0; i < 800; i += 40) {
                    trackGraphics.moveTo(i, 0); 
                    trackGraphics.lineTo(i, 600);
                }
                for(let i = 0; i < 600; i += 40) {
                    trackGraphics.moveTo(0, i); 
                    trackGraphics.lineTo(800, i);
                }
                trackGraphics.strokePath();

                this.currentSum = 0;
                this.baseSpeed = 250;
                this.isSpinning = false;

                this.spanners = this.physics.add.group();
                this.oils = this.physics.add.group();

                this.car = this.physics.add.sprite(400, 300, 'car');
                this.car.setCollideWorldBounds(true);
                this.car.setBounce(0.5);
                this.car.setDrag(200);

                this.cursors = this.input.keyboard.createCursorKeys();

                // UI
                this.sumText = this.add.text(20, 20, 'Sum: 0.00 / 1.00', { fontSize: '24px', fill: '#fff', fontStyle: 'bold' });
                this.sumText.setDepth(10);
                this.speedText = this.add.text(20, 50, 'Top Speed: 250', { fontSize: '20px', fill: '#0f0' });
                this.speedText.setDepth(10);
                
                this.instructionsText = this.add.text(400, 20, 'Collect fractions to exactly 1.00 for Speed Up!', { fontSize: '18px', fill: '#aaa', fontStyle: 'bold' }).setOrigin(0.5, 0);
                this.instructionsText.setDepth(10);

                this.time.addEvent({
                    delay: 2000,
                    callback: this.spawnItem,
                    callbackScope: this,
                    loop: true
                });

                this.physics.add.overlap(this.car, this.spanners, this.collectSpanner, null, this);
                this.physics.add.overlap(this.car, this.oils, this.hitOil, null, this);
            }

            createTextures() {
                let graphics = this.make.graphics();
                
                // Car (Facing Right)
                graphics.fillStyle(0xff0044, 1);
                graphics.fillRoundedRect(0, 2, 40, 20, 5); 
                graphics.fillStyle(0x222222, 1);
                graphics.fillRect(5, 0, 8, 4); // Top-left wheel
                graphics.fillRect(27, 0, 8, 4); // Top-right wheel
                graphics.fillRect(5, 20, 8, 4); // Bottom-left wheel
                graphics.fillRect(27, 20, 8, 4); // Bottom-right wheel
                graphics.fillStyle(0x00aaff, 1);
                graphics.fillRoundedRect(15, 5, 10, 14, 2); // Cockpit
                graphics.fillStyle(0xffffcc, 0.8);
                graphics.fillCircle(38, 6, 3); // Headlight L
                graphics.fillCircle(38, 18, 3); // Headlight R
                graphics.generateTexture('car', 40, 24);
                graphics.clear();
                
                // Spanner (Item)
                graphics.fillStyle(0xffcc00, 1);
                graphics.fillRect(10, 12, 15, 6);
                graphics.fillCircle(10, 15, 8);
                graphics.fillCircle(25, 15, 8);
                graphics.fillStyle(0x1a1a1a, 1);
                graphics.fillCircle(8, 15, 4);
                graphics.fillRect(25, 12, 10, 6);
                graphics.generateTexture('spanner', 35, 30);
                graphics.clear();
                
                // Oil Slick (Hazard)
                graphics.fillStyle(0x000000, 0.8);
                graphics.fillEllipse(20, 20, 30, 15);
                graphics.fillEllipse(15, 15, 20, 10);
                graphics.fillEllipse(25, 25, 15, 10);
                graphics.generateTexture('oil', 40, 40);
                graphics.destroy();
            }

            spawnItem() {
                const isOil = Phaser.Math.Between(0, 100) < 30; // 30% chance for oil
                const x = Phaser.Math.Between(50, 750);
                const y = Phaser.Math.Between(80, 550);
                
                if (isOil) {
                    let oil = this.oils.create(x, y, 'oil');
                    oil.setScale(0.5);
                    this.tweens.add({
                        targets: oil,
                        scale: 1,
                        duration: 500,
                        ease: 'Bounce'
                    });
                    
                    this.time.delayedCall(12000, () => {
                        if (oil.active) oil.destroy();
                    });
                } else {
                    const types = [
                        { text: '1/2', val: 0.5 },
                        { text: '1/4', val: 0.25 },
                        { text: '1/5', val: 0.2 }
                    ];
                    const type = Phaser.Utils.Array.GetRandom(types);
                    
                    let spanner = this.spanners.create(x, y, 'spanner');
                    spanner.fractionValue = type.val;
                    
                    let label = this.add.text(x, y - 20, type.text, { fontSize: '18px', fill: '#0ff', fontStyle: 'bold' });
                    label.setOrigin(0.5);
                    spanner.label = label;
                    
                    // Floating Animation
                    this.tweens.add({
                        targets: spanner,
                        y: y - 10,
                        duration: 1000,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                    
                    this.time.delayedCall(15000, () => {
                        if (spanner.active) {
                            spanner.destroy();
                            label.destroy();
                        }
                    });
                }
            }

            collectSpanner(car, spanner) {
                if (!spanner.active) return;
                
                const val = spanner.fractionValue;
                const textVal = spanner.label.text;
                this.currentSum += val;
                
                spanner.label.destroy();
                spanner.destroy();
                
                this.createExplosion(car.x, car.y, 0x00ffff);
                
                if (Math.abs(this.currentSum - 1.0) < 0.01) {
                    // Perfect 1.00 -> Upgrade
                    this.baseSpeed += 50;
                    this.currentSum = 0;
                    this.cameras.main.flash(300, 0, 255, 0);
                    this.updateHUD();
                    this.showFloatingText(this.car.x, this.car.y, 'SPEED UP! (= 1)', '#0f0');
                } else if (this.currentSum > 1.0) {
                    // Bust -> Penalty
                    this.currentSum = 0;
                    this.baseSpeed = Math.max(150, this.baseSpeed - 25);
                    this.cameras.main.shake(300, 0.02);
                    this.updateHUD();
                    this.showFloatingText(this.car.x, this.car.y, 'BUST! (> 1)', '#f00');
                } else {
                    // Keep collecting
                    this.updateHUD();
                    this.showFloatingText(this.car.x, this.car.y, `+${textVal}`, '#0ff');
                }
            }

            hitOil(car, oil) {
                if (this.isSpinning) return;
                
                oil.destroy();
                this.createExplosion(car.x, car.y, 0x333333);
                
                this.isSpinning = true;
                this.cameras.main.shake(200, 0.01);
                this.showFloatingText(car.x, car.y, 'SPIN OUT!', '#ffff00');
                
                // Speed penalty on hit
                this.car.body.velocity.scale(0.3);
                
                this.time.delayedCall(1200, () => {
                    this.isSpinning = false;
                });
            }

            createExplosion(x, y, color) {
                for (let i = 0; i < 15; i++) {
                    let p = this.add.rectangle(x, y, 6, 6, color);
                    let angle = Phaser.Math.Between(0, 360);
                    let speed = Phaser.Math.Between(50, 150);
                    let vec = this.physics.velocityFromAngle(angle, speed);
                    
                    this.physics.add.existing(p);
                    p.body.setVelocity(vec.x, vec.y);
                    
                    this.tweens.add({
                        targets: p,
                        alpha: 0,
                        scale: 0,
                        duration: 500,
                        onComplete: () => p.destroy()
                    });
                }
            }

            showFloatingText(x, y, message, color) {
                let t = this.add.text(x, y - 20, message, { fontSize: '24px', fill: color, fontStyle: 'bold', stroke: '#000', strokeThickness: 4 });
                t.setOrigin(0.5);
                t.setDepth(20);
                this.tweens.add({
                    targets: t,
                    y: y - 60,
                    alpha: 0,
                    duration: 1000,
                    ease: 'Power2',
                    onComplete: () => t.destroy()
                });
            }

            updateHUD() {
                this.sumText.setText(`Sum: ${this.currentSum.toFixed(2)} / 1.00`);
                this.speedText.setText(`Top Speed: ${this.baseSpeed}`);
            }

            update(time, delta) {
                if (this.isSpinning) {
                    this.car.angle += 20;
                    this.car.body.velocity.scale(0.95);
                    return;
                }

                let turnSpeed = 250;
                
                if (this.cursors.left.isDown) {
                    this.car.setAngularVelocity(-turnSpeed);
                } else if (this.cursors.right.isDown) {
                    this.car.setAngularVelocity(turnSpeed);
                } else {
                    this.car.setAngularVelocity(0);
                }
                
                if (this.cursors.up.isDown) {
                    this.physics.velocityFromRotation(this.car.rotation, 600, this.car.body.acceleration);
                } else if (this.cursors.down.isDown) {
                    this.physics.velocityFromRotation(this.car.rotation, -300, this.car.body.acceleration);
                } else {
                    this.car.setAcceleration(0);
                }
                
                // Enforce max speed
                if (this.car.body.speed > this.baseSpeed) {
                    this.car.body.velocity.normalize().scale(this.baseSpeed);
                }
                
                const speed = this.car.body.speed;
                if (speed > 0 && !this.cursors.down.isDown && !this.cursors.up.isDown) {
                    this.car.setDrag(200);
                } else {
                    this.car.setDrag(0);
                }

                // Simulate RC grip / Drifting by aligning velocity vector with rotation
                if (speed > 5) {
                    const targetVelocity = new Phaser.Math.Vector2();
                    this.physics.velocityFromRotation(this.car.rotation, speed, targetVelocity);
                    this.car.body.velocity.lerp(targetVelocity, 0.15); // Adjust lerp factor for driftiness
                }
            }
        }

        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameContainer.current,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [MainScene]
        };

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', overflow: 'hidden', borderRadius: '10px', boxShadow: '0 0 20px rgba(0,255,204,0.5)' }}>
            <button 
                onClick={onExit}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 10,
                    padding: '10px 20px',
                    backgroundColor: '#ff0044',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    transition: 'transform 0.1s'
                }}
                onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
                Beenden
            </button>
            <div ref={gameContainer} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default FaskaRCSwarm;
