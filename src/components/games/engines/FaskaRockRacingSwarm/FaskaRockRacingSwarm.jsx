import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function FaskaRockRacingSwarm({ onExit }) {
    const gameRef = useRef(null);

    useEffect(() => {
        class MainScene extends Phaser.Scene {
            constructor() {
                super('MainScene');
                this.sequence = ['G', 'G', 'G', 'Eb', 'F', 'F', 'F', 'D'];
                this.seqIndex = 0;
                this.weaponLevel = 1;
                this.score = 0;
                this.aiCars = [];
                // Path segments for AI and Note spawning (Center of track)
                this.segments = [
                    {p1: {x: 0, y: -1100}, p2: {x: 1466, y: 0}},
                    {p1: {x: 1466, y: 0}, p2: {x: 0, y: 1100}},
                    {p1: {x: 0, y: 1100}, p2: {x: -1466, y: 0}},
                    {p1: {x: -1466, y: 0}, p2: {x: 0, y: -1100}},
                ];
            }

            create() {
                this.generateTextures();
                this.createTrack();

                this.flareEmitter = this.add.particles(0, 0, 'flare', {
                    speed: { min: 100, max: 300 },
                    lifespan: 600,
                    blendMode: 'ADD',
                    scale: { start: 1, end: 0 },
                    emitting: false
                });

                this.player = this.matter.add.image(0, -1100, 'player_car');
                this.player.setFrictionAir(0.05);
                this.player.setFriction(0.2);
                this.player.setBounce(0.5);
                this.player.body.label = 'player';
                
                for(let i=0; i<6; i++) {
                    this.spawnAI();
                }

                this.notesGroup = this.add.group();
                for(let i=0; i<25; i++) {
                    this.spawnNote();
                }
                this.updateNotesAppearance();

                this.cursors = this.input.keyboard.createCursorKeys();
                this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
                this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
                this.wasd = {
                    w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                    a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                    s: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                    d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
                };

                this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
                this.cameras.main.setZoom(0.8);

                this.uiContainer = this.add.container(0, 0);
                this.uiContainer.setScrollFactor(0);
                this.uiContainer.setScale(1.25); // Inverse of camera zoom 0.8
                
                this.uiBg = this.add.rectangle(0, 0, 4000, 100, 0x000000, 0.7).setOrigin(0,0);
                this.uiContainer.add(this.uiBg);
                
                this.seqText = this.add.text(20, 15, '', { fontSize: '24px', color: '#fff', fontStyle: 'bold' });
                this.uiContainer.add(this.seqText);
                
                this.msgText = this.add.text(window.innerWidth/2, window.innerHeight/3, 'RACE AND COLLECT NOTES!', { 
                    fontSize: '48px', color: '#ffff00', fontStyle: 'bold', stroke: '#000', strokeThickness: 6 
                }).setOrigin(0.5);
                this.uiContainer.add(this.msgText);
                
                this.time.delayedCall(3000, () => { 
                    this.tweens.add({ targets: this.msgText, alpha: 0, duration: 500 });
                });

                this.updateUIText();

                this.matter.world.on('collisionstart', this.handleCollisions, this);
            }

            update(time, delta) {
                if (!this.player || !this.player.active) return;
                
                this.updatePlayer();
                this.updateAI();

                if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
                    this.fireProjectile();
                }
                if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
                    this.dropMine();
                }
            }

            updatePlayer() {
                const up = this.cursors.up.isDown || this.wasd.w.isDown;
                const down = this.cursors.down.isDown || this.wasd.s.isDown;
                const left = this.cursors.left.isDown || this.wasd.a.isDown;
                const right = this.cursors.right.isDown || this.wasd.d.isDown;

                if (up) {
                    this.player.applyForce({
                        x: Math.cos(this.player.rotation) * 0.002,
                        y: Math.sin(this.player.rotation) * 0.002
                    });
                    
                    if (Math.random() < 0.3) {
                        this.flareEmitter.setParticleTint(0xff8800);
                        this.flareEmitter.emitParticleAt(
                            this.player.x - Math.cos(this.player.rotation)*25,
                            this.player.y - Math.sin(this.player.rotation)*25
                        );
                    }
                } else if (down) {
                    this.player.applyForce({
                        x: -Math.cos(this.player.rotation) * 0.001,
                        y: -Math.sin(this.player.rotation) * 0.001
                    });
                }

                const speed = Math.sqrt(this.player.body.velocity.x**2 + this.player.body.velocity.y**2);
                if (speed > 0.5) {
                    let steer = 0;
                    if (left) steer = -0.06;
                    if (right) steer = 0.06;
                    
                    const fwdDot = this.player.body.velocity.x * Math.cos(this.player.rotation) + this.player.body.velocity.y * Math.sin(this.player.rotation);
                    if (fwdDot < 0) steer *= -1;

                    this.player.setAngularVelocity(steer);
                } else {
                    this.player.setAngularVelocity(0);
                }

                this.applyGrip(this.player, 0.85);
            }

            updateAI() {
                this.aiCars.forEach(ai => {
                    if (!ai.active || ai.speedMultiplier <= 0) return;
                    
                    const wp = this.segments[ai.waypointIndex].p1;
                    const dist = Phaser.Math.Distance.Between(ai.x, ai.y, wp.x, wp.y);
                    
                    if (dist < 300) {
                        ai.waypointIndex = (ai.waypointIndex + 1) % 4;
                    }

                    const angleToWp = Phaser.Math.Angle.Between(ai.x, ai.y, wp.x, wp.y);
                    let diff = Phaser.Math.Angle.Wrap(angleToWp - ai.rotation);
                    
                    if (diff > 0.1) ai.setAngularVelocity(0.04);
                    else if (diff < -0.1) ai.setAngularVelocity(-0.04);
                    else ai.setAngularVelocity(0);

                    const force = 0.0015 * ai.speedMultiplier;
                    ai.applyForce({
                        x: Math.cos(ai.rotation) * force,
                        y: Math.sin(ai.rotation) * force
                    });

                    this.applyGrip(ai, 0.9);

                    // Anti-stuck logic
                    if (Math.abs(ai.body.velocity.x) < 0.2 && Math.abs(ai.body.velocity.y) < 0.2) {
                        ai.stuckTimer = (ai.stuckTimer || 0) + 1;
                        if (ai.stuckTimer > 60) {
                            ai.applyForce({
                                x: -Math.cos(ai.rotation) * 0.01,
                                y: -Math.sin(ai.rotation) * 0.01
                            });
                            ai.stuckTimer = 0;
                            // Randomize waypoint slightly to force steering out of corner
                            ai.waypointIndex = (ai.waypointIndex + 1) % 4;
                        }
                    } else {
                        ai.stuckTimer = 0;
                    }
                });
            }

            applyGrip(car, gripFactor) {
                if (!car.body) return;
                const vel = car.body.velocity;
                const angle = car.rotation;
                const lx = -Math.sin(angle);
                const ly = Math.cos(angle);
                const lateralDot = vel.x * lx + vel.y * ly;
                
                car.setVelocity(
                    vel.x - lx * lateralDot * gripFactor,
                    vel.y - ly * lateralDot * gripFactor
                );
            }

            fireProjectile() {
                const angle = this.player.rotation;
                const speed = 25;
                const numProj = this.weaponLevel > 1 ? (this.weaponLevel > 2 ? 5 : 3) : 1;
                const spread = 0.15;

                for (let i = 0; i < numProj; i++) {
                    let a = angle;
                    if (numProj === 3) {
                        if (i === 0) a -= spread;
                        if (i === 2) a += spread;
                    } else if (numProj === 5) {
                        a += (i - 2) * spread;
                    }

                    const x = this.player.x + Math.cos(a)*30;
                    const y = this.player.y + Math.sin(a)*30;
                    
                    const p = this.matter.add.image(x, y, 'flare');
                    p.setTint(0xffff00);
                    p.setCircle(8);
                    p.setFrictionAir(0);
                    p.setBounce(1);
                    p.body.label = 'projectile';
                    p.setVelocity(Math.cos(a)*speed, Math.sin(a)*speed);
                    
                    this.time.delayedCall(1500, () => {
                        if (p && p.active) p.destroy();
                    });
                }
            }

            dropMine() {
                const x = this.player.x - Math.cos(this.player.rotation)*40;
                const y = this.player.y - Math.sin(this.player.rotation)*40;
                
                const m = this.matter.add.image(x, y, 'flare');
                m.setTint(0xff0000);
                m.setScale(1.5);
                m.setCircle(12);
                m.setStatic(true);
                m.setSensor(true);
                m.body.label = 'mine';

                this.tweens.add({
                    targets: m,
                    alpha: 0.2,
                    yoyo: true,
                    repeat: -1,
                    duration: 300
                });
            }

            handleCollisions(event) {
                event.pairs.forEach(pair => {
                    const goA = pair.bodyA.gameObject;
                    const goB = pair.bodyB.gameObject;
                    if (!goA || !goB) return;

                    const lA = pair.bodyA.label;
                    const lB = pair.bodyB.label;

                    if (lA === 'player' && lB === 'note') this.collectNote(goB);
                    else if (lB === 'player' && lA === 'note') this.collectNote(goA);

                    if (lA === 'projectile' && lB === 'ai') this.hitAI(goB, goA);
                    else if (lB === 'projectile' && lA === 'ai') this.hitAI(goA, goB);

                    if (lA === 'mine' && lB === 'ai') this.hitAI(goB, goA, true);
                    else if (lB === 'mine' && lA === 'ai') this.hitAI(goA, goB, true);
                });
            }

            collectNote(noteContainer) {
                if (noteContainer.collected) return;
                noteContainer.collected = true;

                const letter = noteContainer.letter;
                const required = this.sequence[this.seqIndex];

                if (letter === required) {
                    this.seqIndex++;
                    this.score += 100;
                    this.flareEmitter.setParticleTint(0x00ff00);
                    this.flareEmitter.explode(30, noteContainer.x, noteContainer.y);
                    this.cameras.main.shake(100, 0.01);
                    this.showMessage("PERFECT!", '#00ff00');

                    if (this.seqIndex >= this.sequence.length) {
                        this.weaponLevel = Math.min(this.weaponLevel + 1, 3);
                        this.seqIndex = 0;
                        this.showMessage("WEAPON UPGRADED!\nROCK N ROLL!", '#ff00ff', 3000);
                        this.score += 1000;
                    }
                } else {
                    this.flareEmitter.setParticleTint(0xff0000);
                    this.flareEmitter.explode(20, noteContainer.x, noteContainer.y);
                    this.showMessage("WRONG NOTE!", '#ff0000');
                    this.cameras.main.shake(200, 0.02);
                }

                this.updateUIText();
                noteContainer.destroy();
                this.spawnNote();
                this.updateNotesAppearance();
            }

            hitAI(ai, weapon, isMine = false) {
                if (!ai.active) return;
                if (weapon && weapon.active) weapon.destroy();
                
                this.flareEmitter.setParticleTint(0xff8800);
                this.flareEmitter.explode(40, ai.x, ai.y);
                this.cameras.main.shake(150, 0.015);
                
                ai.setAngularVelocity(0.5);
                ai.setVelocity(0, 0);
                
                ai.speedMultiplier = 0;
                this.time.delayedCall(2000, () => {
                    if (ai && ai.active) {
                        ai.speedMultiplier = Phaser.Math.RND.realInRange(0.8, 1.2);
                    }
                });
            }

            spawnAI() {
                const seg = Phaser.Math.RND.pick(this.segments);
                const ai = this.matter.add.image(seg.p1.x, seg.p1.y, 'ai_car');
                ai.setFrictionAir(0.05);
                ai.setFriction(0.2);
                ai.setBounce(0.5);
                ai.body.label = 'ai';
                
                ai.waypointIndex = Phaser.Math.RND.between(0, 3);
                ai.speedMultiplier = Phaser.Math.RND.realInRange(0.8, 1.2);
                
                this.aiCars.push(ai);
            }

            spawnNote() {
                const seg = Phaser.Math.RND.pick(this.segments);
                const t = Phaser.Math.RND.frac();
                const x = seg.p1.x + (seg.p2.x - seg.p1.x) * t + Phaser.Math.RND.between(-120, 120);
                const y = seg.p1.y + (seg.p2.y - seg.p1.y) * t + Phaser.Math.RND.between(-120, 120);

                const possible = ['G', 'Eb', 'F', 'D', 'A', 'C', 'B'];
                const letter = Phaser.Math.RND.pick(possible);

                const circle = this.add.circle(0, 0, 30, 0x00ffff);
                circle.setStrokeStyle(4, 0xffffff);
                const text = this.add.text(0, 0, letter, { fontSize: '28px', color: '#000', fontStyle: 'bold' }).setOrigin(0.5);
                
                const container = this.add.container(x, y, [circle, text]);
                this.matter.add.gameObject(container, { isSensor: true, isStatic: true, circleRadius: 30 });
                container.body.label = 'note';
                container.letter = letter;
                
                this.notesGroup.add(container);
                
                this.tweens.add({
                    targets: container,
                    y: y - 15,
                    yoyo: true,
                    repeat: -1,
                    duration: 800 + Math.random()*400,
                    ease: 'Sine.easeInOut'
                });
            }

            updateNotesAppearance() {
                const required = this.sequence[this.seqIndex];
                let correctCount = 0;
                
                const children = this.notesGroup.getChildren();
                children.forEach(container => {
                    const circle = container.list[0];
                    if (container.letter === required) {
                        circle.setFillStyle(0xffff00);
                        correctCount++;
                    } else {
                        circle.setFillStyle(0x00ffff);
                    }
                });

                if (correctCount < 5) {
                    let needed = 5 - correctCount;
                    for (let i = 0; i < children.length && needed > 0; i++) {
                        const container = children[i];
                        if (container.letter !== required) {
                            container.letter = required;
                            container.list[1].setText(required);
                            container.list[0].setFillStyle(0xffff00);
                            needed--;
                        }
                    }
                }
            }

            updateUIText() {
                const collected = this.sequence.slice(0, this.seqIndex).join(' ');
                const next = this.sequence[this.seqIndex] || '';
                const remaining = this.sequence.slice(this.seqIndex + 1).join(' ');
                
                this.seqText.setText(
                    `Melody: ${this.sequence.join(' ')}\n` +
                    `Progress: ${collected} [${next}] ${remaining}\n` + 
                    `Score: ${this.score} | Weapon LVL: ${this.weaponLevel}`
                );
            }

            showMessage(text, color, duration = 1500) {
                this.msgText.setText(text);
                this.msgText.setColor(color);
                this.msgText.setAlpha(1);
                this.msgText.setScale(0.5);
                
                this.tweens.killTweensOf(this.msgText);
                this.tweens.add({
                    targets: this.msgText,
                    scale: 1.2,
                    duration: 300,
                    yoyo: true,
                    ease: 'Back.easeOut'
                });
                
                if (this.msgTimer) this.msgTimer.remove();
                this.msgTimer = this.time.delayedCall(duration, () => {
                    this.tweens.add({
                        targets: this.msgText,
                        alpha: 0,
                        duration: 300
                    });
                });
            }

            createTrack() {
                const O0 = {x: 0, y: -2000};
                const O1 = {x: 2666, y: 0};
                const O2 = {x: 0, y: 2000};
                const O3 = {x: -2666, y: 0};

                const I0 = {x: 0, y: -800};
                const I1 = {x: 1066, y: 0};
                const I2 = {x: 0, y: 800};
                const I3 = {x: -1066, y: 0};

                const buildWall = (p1, p2) => {
                    const cx = (p1.x + p2.x) / 2;
                    const cy = (p1.y + p2.y) / 2;
                    const len = Phaser.Math.Distance.Between(p1.x, p1.y, p2.x, p2.y);
                    const ang = Phaser.Math.Angle.Between(p1.x, p1.y, p2.x, p2.y);
                    
                    const rect = this.add.rectangle(cx, cy, len + 150, 150, 0x333333);
                    rect.setStrokeStyle(4, 0xffaa00);
                    this.matter.add.gameObject(rect, { isStatic: true, angle: ang, restitution: 0.5, friction: 0.1 });
                };

                buildWall(O0, O1); buildWall(O1, O2); buildWall(O2, O3); buildWall(O3, O0);
                buildWall(I0, I1); buildWall(I1, I2); buildWall(I2, I3); buildWall(I3, I0);
                
                const g = this.add.graphics();
                g.lineStyle(2, 0x555555, 0.3);
                for(let i=-3000; i<=3000; i+=200) {
                    g.moveTo(i, -2000); g.lineTo(i, 2000);
                    g.moveTo(-3000, i); g.lineTo(3000, i);
                }
                g.setDepth(-1);
            }

            generateTextures() {
                const gCar = this.make.graphics({x:0, y:0, add:false});
                gCar.fillStyle(0x0055ff);
                gCar.fillRoundedRect(0, 0, 50, 26, 6);
                gCar.fillStyle(0x00aaff);
                gCar.fillRoundedRect(12, 3, 24, 20, 4);
                gCar.fillStyle(0xffff00);
                gCar.fillRect(45, 3, 5, 6);
                gCar.fillRect(45, 17, 5, 6);
                gCar.fillStyle(0xff0000);
                gCar.fillRect(0, 3, 4, 6);
                gCar.fillRect(0, 17, 4, 6);
                gCar.generateTexture('player_car', 50, 26);

                const gAi = this.make.graphics({x:0, y:0, add:false});
                gAi.fillStyle(0xff0000);
                gAi.fillRoundedRect(0, 0, 50, 26, 6);
                gAi.fillStyle(0xff5555);
                gAi.fillRoundedRect(12, 3, 24, 20, 4);
                gAi.fillStyle(0xffff00);
                gAi.fillRect(45, 3, 5, 6);
                gAi.fillRect(45, 17, 5, 6);
                gAi.fillStyle(0xff0000);
                gAi.fillRect(0, 3, 4, 6);
                gAi.fillRect(0, 17, 4, 6);
                gAi.generateTexture('ai_car', 50, 26);

                const gFlare = this.make.graphics({x:0, y:0, add:false});
                gFlare.fillStyle(0xffffff, 1);
                gFlare.fillCircle(16, 16, 16);
                gFlare.generateTexture('flare', 32, 32);
            }
        }

        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: 'phaser-container',
            physics: {
                default: 'matter',
                matter: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [MainScene],
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
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
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#111' }}>
            <div id="phaser-container" style={{ width: '100%', height: '100%' }}></div>
            <button 
                onClick={onExit}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '10px 20px',
                    fontSize: '18px',
                    backgroundColor: '#ff3333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 100,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
            >
                Beenden
            </button>
        </div>
    );
}
