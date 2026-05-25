import React, { useEffect, useRef } from 'react';

const STATES = {
    IDLE: 'IDLE',
    WALK_F: 'WALK_F',
    WALK_B: 'WALK_B',
    JUMP: 'JUMP',
    PUNCH: 'PUNCH',
    KICK: 'KICK',
    HADOUKEN: 'HADOUKEN',
    HIT: 'HIT',
    KO: 'KO',
    VICTORY: 'VICTORY'
};

const STAGE_WIDTH = 1200;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;
const FLOOR_Y = 400;

export default function FaskaFighter3({ onExit }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let reqId;

        // --- CLASSES ---

        class Fighter {
            constructor(x, isPlayer, colorPrimary) {
                this.x = x;
                this.y = FLOOR_Y;
                this.vx = 0;
                this.vy = 0;
                this.isPlayer = isPlayer;
                this.facing = isPlayer ? 1 : -1;
                this.state = STATES.IDLE;
                this.stateTimer = 0;
                this.health = 100;
                this.maxHealth = 100;
                this.colorPrimary = colorPrimary;
                
                this.speed = 4;
                this.jumpForce = -12;
                this.gravity = 0.6;
                this.hasHit = false;
                this.stunTime = 0;
            }

            attack(type) {
                if (this.state === STATES.PUNCH || this.state === STATES.KICK || this.state === STATES.HADOUKEN || this.state === STATES.HIT || this.state === STATES.KO) return;
                this.state = type;
                this.stateTimer = 0;
                this.hasHit = false;
                this.vx = 0; // stop moving when attacking
            }

            update(opponent, projectiles, addParticle, addScreenShake) {
                this.stateTimer++;

                this.x += this.vx;
                this.y += this.vy;
                
                if (this.y < FLOOR_Y) {
                    this.vy += this.gravity;
                } else {
                    this.y = FLOOR_Y;
                    this.vy = 0;
                    if (this.state === STATES.JUMP) {
                        this.state = STATES.IDLE;
                    }
                }
                
                this.vx *= 0.85;

                if (this.x < 30) { this.x = 30; this.vx = 0; }
                if (this.x > STAGE_WIDTH - 30) { this.x = STAGE_WIDTH - 30; this.vx = 0; }

                // Face opponent if not attacking/hit
                if (this.state === STATES.IDLE || this.state === STATES.WALK_F || this.state === STATES.WALK_B || this.state === STATES.JUMP) {
                    this.facing = (opponent.x > this.x) ? 1 : -1;
                }

                switch(this.state) {
                    case STATES.PUNCH:
                        if (this.stateTimer === 10 && !this.hasHit) {
                            this.checkHit(opponent, 60, -90, 40, 20, 8, 5, 20, addParticle, addScreenShake);
                        }
                        if (this.stateTimer > 25) this.state = STATES.IDLE;
                        break;
                    case STATES.KICK:
                        if (this.stateTimer === 15 && !this.hasHit) {
                            this.checkHit(opponent, 70, -60, 50, 20, 12, 8, 25, addParticle, addScreenShake);
                        }
                        if (this.stateTimer > 35) this.state = STATES.IDLE;
                        break;
                    case STATES.HADOUKEN:
                        if (this.stateTimer === 15) {
                            projectiles.push(new Hadouken(this.x + this.facing * 40, this.y - 60, this.facing));
                        }
                        if (this.stateTimer > 40) this.state = STATES.IDLE;
                        break;
                    case STATES.HIT:
                        if (this.stateTimer > this.stunTime) {
                            this.state = STATES.IDLE;
                        }
                        break;
                    case STATES.KO:
                        // stay down
                        break;
                }
            }

            checkHit(opponent, reachX, offsetY, w, h, damage, knockback, stunTime, addParticle, addScreenShake) {
                let hb = {
                    l: this.facing === 1 ? this.x : this.x - reachX,
                    r: this.facing === 1 ? this.x + reachX : this.x,
                    t: this.y + offsetY - h/2,
                    b: this.y + offsetY + h/2
                };
                let hurt = {
                    l: opponent.x - 20,
                    r: opponent.x + 20,
                    t: opponent.y - 110,
                    b: opponent.y
                };

                if (hb.l < hurt.r && hb.r > hurt.l && hb.t < hurt.b && hb.b > hurt.t && opponent.state !== STATES.KO) {
                    this.hasHit = true;
                    opponent.takeDamage(damage, this.facing * knockback, stunTime, addScreenShake);
                    
                    // Hit spark effect
                    for(let i=0; i<15; i++) {
                        addParticle(opponent.x, opponent.y + offsetY, '#ffaa00');
                    }
                }
            }

            takeDamage(amount, knockback, stunTime, addScreenShake) {
                this.health -= amount;
                addScreenShake(amount > 10 ? 15 : 8);
                if (this.health <= 0) {
                    this.health = 0;
                    this.state = STATES.KO;
                    this.stateTimer = 0;
                    this.vx = knockback * 1.5;
                    this.vy = -6;
                } else {
                    this.state = STATES.HIT;
                    this.stateTimer = 0;
                    this.stunTime = stunTime;
                    this.vx = knockback;
                }
            }
        }

        class Hadouken {
            constructor(x, y, facing) {
                this.x = x;
                this.y = y;
                this.vx = facing * 10;
                this.facing = facing;
                this.active = true;
            }
            update(opponent, addParticle, addScreenShake) {
                if (!this.active) return;
                this.x += this.vx;
                
                if (this.x < 0 || this.x > STAGE_WIDTH) {
                    this.active = false;
                    return;
                }
                
                let hb = { l: this.x - 20, r: this.x + 20, t: this.y - 20, b: this.y + 20 };
                let hurt = { l: opponent.x - 20, r: opponent.x + 20, t: opponent.y - 110, b: opponent.y };
                
                if (hb.l < hurt.r && hb.r > hurt.l && hb.t < hurt.b && hb.b > hurt.t && opponent.state !== STATES.KO) {
                    this.active = false;
                    opponent.takeDamage(10, this.facing * 6, 25, addScreenShake);
                    for(let i=0; i<15; i++) {
                        addParticle(this.x, this.y, '#00ffff');
                    }
                }
            }
            draw(ctx, camX, camY) {
                if (!this.active) return;
                ctx.save();
                ctx.translate(this.x - camX, this.y - camY);
                
                let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.4, '#00ffff');
                grad.addColorStop(1, 'rgba(0, 255, 255, 0)');
                
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(0, 0, 25, 0, Math.PI * 2);
                ctx.fill();
                
                // Trail
                ctx.fillStyle = 'rgba(0, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.ellipse(-this.facing * 20, 0, 25, 12, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        }

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.life = 1.0;
                this.vx = (Math.random() - 0.5) * 12;
                this.vy = (Math.random() - 0.5) * 12;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= 0.05;
            }
            draw(ctx, camX, camY) {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = Math.max(0, this.life);
                ctx.beginPath();
                ctx.arc(this.x - camX, this.y - camY, 6 * this.life, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }

        // --- GAME STATE ---

        let p1 = new Fighter(400, true, '#ff3333');
        let p2 = new Fighter(800, false, '#3333ff');
        let projectiles = [];
        let particles = [];
        let camera = { x: 200, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT };
        let screenShake = 0;
        
        let matchState = 'START'; // START, FIGHT, ROUND_END, MATCH_OVER
        let matchTimer = 0;
        let roundTime = 99;
        let frameCount = 0;
        let p1Wins = 0;
        let p2Wins = 0;

        const addParticle = (x, y, color) => particles.push(new Particle(x, y, color));
        const addScreenShake = (amt) => { screenShake = amt; };

        function resetRound() {
            p1.health = p1.maxHealth;
            p2.health = p2.maxHealth;
            p1.x = 400;
            p2.x = 800;
            p1.state = STATES.IDLE;
            p2.state = STATES.IDLE;
            p1.vx = 0; p1.vy = 0;
            p2.vx = 0; p2.vy = 0;
            projectiles = [];
            particles = [];
            roundTime = 99;
        }

        // --- INPUT ---

        const keys = {};
        const onKeyDown = e => { 
            keys[e.code] = true; 
            if (matchState === 'FIGHT' && p1.state !== STATES.HIT && p1.state !== STATES.KO) {
                if (e.code === 'Space') p1.attack(STATES.PUNCH);
                if (e.code === 'ShiftLeft') p1.attack(STATES.KICK);
                if (e.code === 'KeyE') p1.attack(STATES.HADOUKEN);
            }
        };
        const onKeyUp = e => { keys[e.code] = false; };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        // --- AI LOGIC ---

        function updateAI(p1, p2) {
            if (p2.state === STATES.KO || p2.state === STATES.VICTORY) return;
            if (p2.state === STATES.HIT) return;
        
            let dist = p1.x - p2.x;
            let absDist = Math.abs(dist);
            
            if (p2.state !== STATES.IDLE && p2.state !== STATES.WALK_F && p2.state !== STATES.WALK_B) {
                return; // committed
            }
        
            if (Math.random() < 0.08) { // AI tick rate
                if (absDist > 300) {
                    if (Math.random() < 0.15) {
                        p2.attack(STATES.HADOUKEN);
                    } else {
                        p2.state = STATES.WALK_F;
                        p2.vx = p2.facing * p2.speed;
                    }
                } else if (absDist > 100) {
                     p2.state = STATES.WALK_F;
                     p2.vx = p2.facing * p2.speed;
                } else {
                    p2.vx = 0;
                    let r = Math.random();
                    if (r < 0.4) {
                        p2.attack(STATES.PUNCH);
                    } else if (r < 0.8) {
                        p2.attack(STATES.KICK);
                    } else {
                        p2.state = STATES.IDLE;
                    }
                }
            } else {
                if (p2.state === STATES.WALK_F) {
                    p2.vx = p2.facing * p2.speed;
                } else if (p2.state === STATES.WALK_B) {
                    p2.vx = -p2.facing * p2.speed;
                }
            }
        }

        // --- DRAWING ---

        function drawBackground(ctx, camX, camY, w, h) {
            let grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, '#0a0a2a');
            grad.addColorStop(1, '#4a1a3a');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        
            ctx.fillStyle = '#2a1030';
            ctx.beginPath();
            let mOffsetX = (camX * 0.1) % 400;
            for (let i = -1; i < 4; i++) {
                ctx.moveTo(i * 400 - mOffsetX, h);
                ctx.lineTo(i * 400 + 200 - mOffsetX, h - 180);
                ctx.lineTo(i * 400 + 400 - mOffsetX, h);
            }
            ctx.fill();
        
            ctx.fillStyle = '#111';
            let sOffsetX = (camX * 0.3) % 200;
            for (let i = -1; i < 8; i++) {
                let bx = i * 200 - sOffsetX;
                ctx.fillRect(bx + 20, h - 300, 60, 300);
                ctx.fillRect(bx + 100, h - 220, 50, 220);
                
                ctx.fillStyle = '#aa8800';
                for (let wy = h - 280; wy < h - 50; wy += 30) {
                    // pseudo-random but deterministic window lights based on position
                    if ((bx + wy) % 3 === 0) ctx.fillRect(bx + 30, wy, 10, 15);
                    if ((bx + wy) % 5 === 0) ctx.fillRect(bx + 50, wy, 10, 15);
                }
                ctx.fillStyle = '#111';
            }
        
            let floorY = FLOOR_Y;
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, floorY, w, h - floorY);
            
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 3;
            let fOffsetX = camX % 100;
            for (let i = -1; i < 10; i++) {
                ctx.beginPath();
                ctx.moveTo(i * 100 - fOffsetX, floorY);
                ctx.lineTo((i * 100 - fOffsetX) - 100, h);
                ctx.stroke();
            }
        }

        function drawFighter(ctx, f, cam) {
            ctx.save();
            ctx.translate(f.x - cam.x, f.y - cam.y);
            ctx.scale(f.facing, 1);
        
            let t = f.stateTimer;
            
            let headRot = 0;
            let torsoRot = 0;
            let armLRot = 0, elbowLRot = 0;
            let armRRot = 0, elbowRRot = 0;
            let legLRot = 0, kneeLRot = 0;
            let legRRot = 0, kneeRRot = 0;
            let bounce = 0;
        
            if (f.state === STATES.IDLE) {
                bounce = Math.sin(t * 0.1) * 2;
                armLRot = 0.1 + Math.sin(t * 0.1) * 0.05;
                armRRot = -0.1 - Math.sin(t * 0.1) * 0.05;
                elbowLRot = -0.2;
                elbowRRot = -0.2;
            } else if (f.state === STATES.WALK_F || f.state === STATES.WALK_B) {
                let speed = f.state === STATES.WALK_F ? 0.3 : 0.25;
                legLRot = Math.sin(t * speed) * 0.6;
                kneeLRot = Math.max(0, Math.sin(t * speed)) * 0.6;
                legRRot = -Math.sin(t * speed) * 0.6;
                kneeRRot = Math.max(0, -Math.sin(t * speed)) * 0.6;
                armLRot = -legLRot * 0.5;
                armRRot = -legRRot * 0.5;
                bounce = Math.abs(Math.sin(t * speed)) * -5;
            } else if (f.state === STATES.JUMP) {
                legLRot = -0.5;
                kneeLRot = 1.0;
                legRRot = 0.2;
                kneeRRot = 0.5;
                armLRot = -2.0;
                armRRot = -2.5;
            } else if (f.state === STATES.PUNCH) {
                if (t < 10) {
                    armRRot = -Math.PI / 2;
                    elbowRRot = 0;
                    torsoRot = 0.2;
                    armLRot = 0.5;
                } else {
                    armRRot = -Math.PI / 4;
                    elbowRRot = -Math.PI / 4;
                }
            } else if (f.state === STATES.KICK) {
                if (t < 15) {
                    legRRot = -Math.PI / 2 - 0.5;
                    kneeRRot = 0;
                    torsoRot = -0.3;
                    armLRot = -0.5;
                    armRRot = 0.5;
                } else {
                    legRRot = 0;
                    kneeRRot = 0;
                }
            } else if (f.state === STATES.HADOUKEN) {
                if (t < 15) {
                    armLRot = -Math.PI / 2 + 0.2;
                    armRRot = -Math.PI / 2;
                    elbowLRot = -0.2;
                    elbowRRot = -0.2;
                    torsoRot = 0.3;
                } else {
                    armLRot = -Math.PI / 2;
                    armRRot = -Math.PI / 2;
                }
            } else if (f.state === STATES.HIT) {
                torsoRot = -0.4;
                headRot = -0.3;
                armLRot = -0.8;
                armRRot = -0.8;
                legRRot = 0.2;
            } else if (f.state === STATES.KO) {
                torsoRot = -Math.PI / 2;
                headRot = -0.2;
                bounce = 15; 
                armLRot = -Math.PI;
                armRRot = -Math.PI;
                legLRot = -0.2;
                legRRot = 0.2;
            }
        
            ctx.translate(0, bounce);

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.beginPath();
            ctx.ellipse(0, -bounce, 30, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        
            const drawArm = (x, y, rot1, rot2, isFront) => {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rot1);
                ctx.fillStyle = '#ffccaa'; 
                ctx.beginPath();
                ctx.roundRect(-6, 0, 12, 25, 6);
                ctx.fill();
                ctx.translate(0, 20);
                ctx.rotate(rot2);
                ctx.beginPath();
                ctx.roundRect(-5, 0, 10, 25, 5);
                ctx.fill();
                ctx.fillStyle = isFront ? f.colorPrimary : '#880000';
                ctx.beginPath();
                ctx.arc(0, 25, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            };
        
            const drawLeg = (x, y, rot1, rot2, isFront) => {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rot1);
                ctx.fillStyle = isFront ? '#ffffff' : '#dddddd';
                ctx.beginPath();
                ctx.roundRect(-8, 0, 16, 30, 5);
                ctx.fill();
                ctx.translate(0, 25);
                ctx.rotate(rot2);
                ctx.beginPath();
                ctx.roundRect(-7, 0, 14, 30, 5);
                ctx.fill();
                ctx.fillStyle = '#ffccaa';
                ctx.beginPath();
                ctx.roundRect(-5, 25, 18, 10, 5);
                ctx.fill();
                ctx.restore();
            };
        
            // Back Arm & Leg
            drawArm(-10, -105, armLRot, elbowLRot, false);
            drawLeg(-10, -65, legLRot, kneeLRot, false);
        
            // Torso
            ctx.save();
            ctx.translate(0, -65); 
            ctx.rotate(torsoRot);
            
            let gradTorso = ctx.createLinearGradient(-15, -50, 15, 0);
            gradTorso.addColorStop(0, f.colorPrimary);
            gradTorso.addColorStop(1, '#111');
            ctx.fillStyle = gradTorso;
            ctx.beginPath();
            ctx.roundRect(-15, -50, 30, 50, 10);
            ctx.fill();
        
            // Head
            ctx.save();
            ctx.translate(0, -55);
            ctx.rotate(headRot);
            ctx.fillStyle = '#ffccaa';
            ctx.beginPath();
            ctx.arc(0, -15, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = f.colorPrimary;
            ctx.fillRect(-16, -25, 32, 6);
            ctx.fillStyle = 'black';
            ctx.fillRect(8, -20, 4, 4);
            ctx.restore(); 
        
            ctx.restore(); // end torso
        
            // Front Leg & Arm
            drawLeg(10, -65, legRRot, kneeRRot, true);
            drawArm(10, -105, armRRot, elbowRRot, true);
        
            ctx.restore();
        }

        function drawUI(ctx, w, h) {
            // Health Bars
            ctx.fillStyle = '#440000';
            ctx.fillRect(50, 30, 300, 25);
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(50, 30, Math.max(0, p1.health / p1.maxHealth) * 300, 25);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.strokeRect(50, 30, 300, 25);
        
            ctx.fillStyle = '#440000';
            ctx.fillRect(w - 350, 30, 300, 25);
            ctx.fillStyle = '#00ff00';
            const p2W = Math.max(0, p2.health / p2.maxHealth) * 300;
            ctx.fillRect(w - 350 + (300 - p2W), 30, p2W, 25);
            ctx.strokeRect(w - 350, 30, 300, 25);
        
            // Timer
            ctx.fillStyle = 'white';
            ctx.font = 'bold 48px Impact, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(Math.ceil(roundTime).toString(), w / 2, 65);
        
            // Round Dots
            ctx.fillStyle = '#ffaa00';
            for (let i = 0; i < p1Wins; i++) {
                ctx.beginPath(); ctx.arc(50 + i * 30, 75, 10, 0, Math.PI * 2); ctx.fill();
            }
            for (let i = 0; i < p2Wins; i++) {
                ctx.beginPath(); ctx.arc(w - 50 - i * 30, 75, 10, 0, Math.PI * 2); ctx.fill();
            }
        
            // Text Overlays
            if (matchState === 'START') {
                ctx.fillStyle = 'white';
                ctx.font = 'bold 80px Impact';
                if (matchTimer < 60) {
                    ctx.fillText('ROUND ' + (p1Wins + p2Wins + 1), w / 2, h / 2);
                } else {
                    ctx.fillStyle = 'yellow';
                    ctx.fillText('FIGHT!', w / 2, h / 2);
                }
            } else if (matchState === 'ROUND_END') {
                ctx.fillStyle = 'red';
                ctx.font = 'bold 100px Impact';
                ctx.fillText('K.O.', w / 2, h / 2);
            } else if (matchState === 'MATCH_OVER') {
                ctx.fillStyle = 'yellow';
                ctx.font = 'bold 80px Impact';
                let winner = p1Wins >= 2 ? 'PLAYER 1' : 'CPU';
                ctx.fillText(winner + ' WINS!', w / 2, h / 2);
            }
        }

        // --- GAME LOOP ---

        function gameLoop() {
            frameCount++;
            
            if (matchState === 'START') {
                matchTimer++;
                if (matchTimer > 90) {
                    matchState = 'FIGHT';
                    matchTimer = 0;
                }
            } else if (matchState === 'FIGHT') {
                if (frameCount % 60 === 0 && roundTime > 0) {
                    roundTime--;
                }
                
                // Input P1
                if (p1.state !== STATES.HIT && p1.state !== STATES.KO && p1.state !== STATES.PUNCH && p1.state !== STATES.KICK && p1.state !== STATES.HADOUKEN) {
                    if (keys['KeyW'] && p1.state !== STATES.JUMP) {
                        p1.state = STATES.JUMP;
                        p1.vy = p1.jumpForce;
                        p1.stateTimer = 0;
                    } else if (keys['KeyA']) {
                        p1.state = STATES.WALK_B;
                        p1.vx = -p1.speed;
                    } else if (keys['KeyD']) {
                        p1.state = STATES.WALK_F;
                        p1.vx = p1.speed;
                    } else if (p1.state !== STATES.JUMP) {
                        p1.state = STATES.IDLE;
                    }
                }
                
                updateAI(p1, p2);
                
                p1.update(p2, projectiles, addParticle, addScreenShake);
                p2.update(p1, projectiles, addParticle, addScreenShake);
                
                projectiles.forEach(p => p.update((p.facing === 1) ? p2 : p1, addParticle, addScreenShake));
                projectiles = projectiles.filter(p => p.active);
                
                particles.forEach(p => p.update());
                particles = particles.filter(p => p.life > 0);
                
                if (p1.health <= 0 || p2.health <= 0 || roundTime <= 0) {
                    matchState = 'ROUND_END';
                    matchTimer = 0;
                    if (p1.health > p2.health) p1Wins++;
                    else if (p2.health > p1.health) p2Wins++;
                }
            } else if (matchState === 'ROUND_END') {
                matchTimer++;
                p1.update(p2, projectiles, addParticle, addScreenShake);
                p2.update(p1, projectiles, addParticle, addScreenShake);
                projectiles.forEach(p => p.update((p.facing === 1) ? p2 : p1, addParticle, addScreenShake));
                particles.forEach(p => p.update());
                
                if (matchTimer > 180) {
                    if (p1Wins >= 2 || p2Wins >= 2) {
                        matchState = 'MATCH_OVER';
                        matchTimer = 0;
                    } else {
                        resetRound();
                        matchState = 'START';
                        matchTimer = 0;
                    }
                }
            } else if (matchState === 'MATCH_OVER') {
                matchTimer++;
                if (matchTimer > 200) {
                    if (onExit) onExit();
                    return; // Stop loop
                }
            }
            
            // Render
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            ctx.save();
            if (screenShake > 0) {
                ctx.translate(Math.random() * screenShake - screenShake/2, Math.random() * screenShake - screenShake/2);
                screenShake *= 0.8;
                if (screenShake < 1) screenShake = 0;
            }

            let targetX = (p1.x + p2.x) / 2 - camera.width / 2;
            camera.x += (targetX - camera.x) * 0.1;
            if (camera.x < 0) camera.x = 0;
            if (camera.x > STAGE_WIDTH - camera.width) camera.x = STAGE_WIDTH - camera.width;
            
            drawBackground(ctx, camera.x, camera.y, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            drawFighter(ctx, p1, camera);
            drawFighter(ctx, p2, camera);
            
            projectiles.forEach(p => p.draw(ctx, camera.x, camera.y));
            particles.forEach(p => p.draw(ctx, camera.x, camera.y));
            
            ctx.restore();
            
            drawUI(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            reqId = requestAnimationFrame(gameLoop);
        }

        reqId = requestAnimationFrame(gameLoop);

        return () => {
            cancelAnimationFrame(reqId);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [onExit]);

    return (
        <div style={{
            width: '100vw', 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            background: '#000',
            fontFamily: 'sans-serif'
        }}>
            <h2 style={{ color: 'white', marginBottom: '10px' }}>FASKA FIGHTER 3</h2>
            <div style={{ position: 'relative' }}>
                <canvas 
                    ref={canvasRef} 
                    width={CANVAS_WIDTH} 
                    height={CANVAS_HEIGHT} 
                    style={{ 
                        border: '4px solid #444', 
                        borderRadius: '8px',
                        boxShadow: '0 0 30px rgba(0, 200, 255, 0.2)',
                        background: '#000'
                    }} 
                />
            </div>
            <p style={{ color: '#aaa', marginTop: '15px' }}>
                <strong>Controls:</strong> W/A/D to Move & Jump. SPACE: Punch, SHIFT: Kick, E: Hadouken
            </p>
        </div>
    );
}
