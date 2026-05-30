import { create } from 'zustand';

const STAGE_WIDTH = 1200;
const FLOOR_Y = 400;

export const STATES = {
    IDLE: 'IDLE', WALK_F: 'WALK_F', WALK_B: 'WALK_B', JUMP: 'JUMP',
    PUNCH: 'PUNCH', KICK: 'KICK', HADOUKEN: 'HADOUKEN', HIT: 'HIT', KO: 'KO', VICTORY: 'VICTORY'
};

const createFighter = (x, isPlayer) => ({
    x, y: FLOOR_Y, vx: 0, vy: 0, 
    isPlayer, facing: isPlayer ? 1 : -1, 
    state: STATES.IDLE, stateTimer: 0, 
    health: 100, maxHealth: 100, 
    hasHit: false, stunTime: 0,
    speed: 4, jumpForce: -12, gravity: 0.6
});

export const useGameStore = create((set, get) => ({
    p1: createFighter(400, true),
    p2: createFighter(800, false),
    camera: { x: 200, y: 0, width: 800, height: 450 },
    projectiles: [],
    particles: [],
    screenShake: 0,
    matchState: 'START', // START, FIGHT, ROUND_END, MATCH_OVER
    matchTimer: 0,
    roundTime: 99,
    frameCount: 0,
    p1Wins: 0,
    p2Wins: 0,
    keys: {},
    joystickState: { left: false, right: false, up: false },

    setKey: (code, isDown) => set(state => ({ keys: { ...state.keys, [code]: isDown } })),
    setJoystick: (stateUpdate) => set(state => ({ joystickState: { ...state.joystickState, ...stateUpdate } })),

    triggerAttack: (type) => set(state => {
        if (state.matchState !== 'FIGHT') return state;
        let p1 = { ...state.p1 };
        if ([STATES.PUNCH, STATES.KICK, STATES.HADOUKEN, STATES.HIT, STATES.KO].includes(p1.state)) return state;
        p1.state = STATES[type];
        p1.stateTimer = 0;
        p1.hasHit = false;
        p1.vx = 0;
        return { p1 };
    }),

    tick: () => set(state => {
        let { p1, p2, projectiles, particles, screenShake, matchState, matchTimer, roundTime, frameCount, p1Wins, p2Wins, keys, joystickState, camera } = state;
        
        p1 = { ...p1 };
        p2 = { ...p2 };
        projectiles = projectiles.map(p => ({...p}));
        particles = particles.map(p => ({...p}));
        
        frameCount++;

        const addParticle = (x, y, color) => {
            particles.push({
                x, y, color, life: 1.0, 
                vx: (Math.random() - 0.5) * 12, 
                vy: (Math.random() - 0.5) * 12
            });
        };

        const applyPhysics = (f, opponent) => {
            f.stateTimer++;
            f.x += f.vx;
            f.y += f.vy;

            if (f.y < FLOOR_Y) {
                f.vy += f.gravity;
            } else {
                f.y = FLOOR_Y;
                f.vy = 0;
                if (f.state === STATES.JUMP) f.state = STATES.IDLE;
            }
            f.vx *= 0.85;

            if (f.x < 30) { f.x = 30; f.vx = 0; }
            if (f.x > STAGE_WIDTH - 30) { f.x = STAGE_WIDTH - 30; f.vx = 0; }

            if ([STATES.IDLE, STATES.WALK_F, STATES.WALK_B, STATES.JUMP].includes(f.state)) {
                f.facing = (opponent.x > f.x) ? 1 : -1;
            }
        };

        const applyAttackLogic = (f, opponent) => {
            const checkHit = (reachX, offsetY, w, h, damage, knockback, stunTime) => {
                let hb = {
                    l: f.facing === 1 ? f.x : f.x - reachX,
                    r: f.facing === 1 ? f.x + reachX : f.x,
                    t: f.y + offsetY - h/2,
                    b: f.y + offsetY + h/2
                };
                let hurt = { l: opponent.x - 20, r: opponent.x + 20, t: opponent.y - 110, b: opponent.y };

                if (hb.l < hurt.r && hb.r > hurt.l && hb.t < hurt.b && hb.b > hurt.t && opponent.state !== STATES.KO) {
                    f.hasHit = true;
                    opponent.health -= damage;
                    screenShake = damage > 10 ? 15 : 8;
                    if (opponent.health <= 0) {
                        opponent.health = 0;
                        opponent.state = STATES.KO;
                        opponent.stateTimer = 0;
                        opponent.vx = f.facing * knockback * 1.5;
                        opponent.vy = -6;
                    } else {
                        opponent.state = STATES.HIT;
                        opponent.stateTimer = 0;
                        opponent.stunTime = stunTime;
                        opponent.vx = f.facing * knockback;
                    }
                    for(let i=0; i<15; i++) addParticle(opponent.x, opponent.y + offsetY, '#ffaa00');
                }
            };

            switch(f.state) {
                case STATES.PUNCH:
                    if (f.stateTimer === 10 && !f.hasHit) checkHit(60, -90, 40, 20, 8, 5, 20);
                    if (f.stateTimer > 25) f.state = STATES.IDLE;
                    break;
                case STATES.KICK:
                    if (f.stateTimer === 15 && !f.hasHit) checkHit(70, -60, 50, 20, 12, 8, 25);
                    if (f.stateTimer > 35) f.state = STATES.IDLE;
                    break;
                case STATES.HADOUKEN:
                    if (f.stateTimer === 15) {
                        projectiles.push({
                            x: f.x + f.facing * 40, y: f.y - 60, 
                            vx: f.facing * 10, facing: f.facing, active: true
                        });
                    }
                    if (f.stateTimer > 40) f.state = STATES.IDLE;
                    break;
                case STATES.HIT:
                    if (f.stateTimer > f.stunTime) f.state = STATES.IDLE;
                    break;
            }
        };

        const updateAI = (ai, player) => {
            if (ai.state === STATES.KO || ai.state === STATES.VICTORY || ai.state === STATES.HIT) return;
            let dist = player.x - ai.x;
            let absDist = Math.abs(dist);

            if (ai.state !== STATES.IDLE && ai.state !== STATES.WALK_F && ai.state !== STATES.WALK_B) return;

            if (Math.random() < 0.08) {
                if (absDist > 300) {
                    if (Math.random() < 0.15) {
                        ai.state = STATES.HADOUKEN; ai.stateTimer = 0; ai.vx = 0; ai.hasHit = false;
                    } else {
                        ai.state = STATES.WALK_F; ai.vx = ai.facing * ai.speed;
                    }
                } else if (absDist > 100) {
                    ai.state = STATES.WALK_F; ai.vx = ai.facing * ai.speed;
                } else {
                    ai.vx = 0;
                    let r = Math.random();
                    if (r < 0.4) { ai.state = STATES.PUNCH; ai.stateTimer = 0; ai.hasHit = false; }
                    else if (r < 0.8) { ai.state = STATES.KICK; ai.stateTimer = 0; ai.hasHit = false; }
                    else ai.state = STATES.IDLE;
                }
            } else {
                if (ai.state === STATES.WALK_F) ai.vx = ai.facing * ai.speed;
                else if (ai.state === STATES.WALK_B) ai.vx = -ai.facing * ai.speed;
            }
        };

        if (matchState === 'START') {
            matchTimer++;
            if (matchTimer > 90) { matchState = 'FIGHT'; matchTimer = 0; }
        } else if (matchState === 'FIGHT') {
            if (frameCount % 60 === 0 && roundTime > 0) roundTime--;

            // P1 Input
            if (![STATES.HIT, STATES.KO, STATES.PUNCH, STATES.KICK, STATES.HADOUKEN].includes(p1.state)) {
                if ((keys['KeyW'] || joystickState.up) && p1.state !== STATES.JUMP) {
                    p1.state = STATES.JUMP; p1.vy = p1.jumpForce; p1.stateTimer = 0;
                } else if (keys['KeyA'] || joystickState.left) {
                    p1.state = STATES.WALK_B; p1.vx = -p1.speed;
                } else if (keys['KeyD'] || joystickState.right) {
                    p1.state = STATES.WALK_F; p1.vx = p1.speed;
                } else if (p1.state !== STATES.JUMP) {
                    p1.state = STATES.IDLE;
                }
            }

            updateAI(p2, p1);

            applyPhysics(p1, p2);
            applyPhysics(p2, p1);
            applyAttackLogic(p1, p2);
            applyAttackLogic(p2, p1);

            // Projectiles
            projectiles.forEach(p => {
                if (!p.active) return;
                p.x += p.vx;
                if (p.x < 0 || p.x > STAGE_WIDTH) { p.active = false; return; }
                
                let target = p.facing === 1 ? p2 : p1;
                let hb = { l: p.x - 20, r: p.x + 20, t: p.y - 20, b: p.y + 20 };
                let hurt = { l: target.x - 20, r: target.x + 20, t: target.y - 110, b: target.y };
                
                if (hb.l < hurt.r && hb.r > hurt.l && hb.t < hurt.b && hb.b > hurt.t && target.state !== STATES.KO) {
                    p.active = false;
                    target.health -= 10;
                    screenShake = 15;
                    if (target.health <= 0) {
                        target.health = 0;
                        target.state = STATES.KO;
                        target.stateTimer = 0;
                        target.vx = p.facing * 6 * 1.5;
                        target.vy = -6;
                    } else {
                        target.state = STATES.HIT;
                        target.stateTimer = 0;
                        target.stunTime = 25;
                        target.vx = p.facing * 6;
                    }
                    for(let i=0; i<15; i++) addParticle(p.x, p.y, '#00ffff');
                }
            });
            projectiles = projectiles.filter(p => p.active);

            if (p1.health <= 0 || p2.health <= 0 || roundTime <= 0) {
                matchState = 'ROUND_END'; matchTimer = 0;
                if (p1.health > p2.health) p1Wins++;
                else if (p2.health > p1.health) p2Wins++;
            }
        } else if (matchState === 'ROUND_END') {
            matchTimer++;
            applyPhysics(p1, p2);
            applyPhysics(p2, p1);
            if (matchTimer > 180) {
                if (p1Wins >= 2 || p2Wins >= 2) {
                    matchState = 'MATCH_OVER'; matchTimer = 0;
                } else {
                    p1 = createFighter(400, true);
                    p2 = createFighter(800, false);
                    projectiles = [];
                    particles = [];
                    roundTime = 99;
                    matchState = 'START';
                    matchTimer = 0;
                }
            }
        } else if (matchState === 'MATCH_OVER') {
            matchTimer++;
        }

        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.life -= 0.05;
        });
        particles = particles.filter(p => p.life > 0);

        if (screenShake > 0) {
            screenShake *= 0.8;
            if (screenShake < 1) screenShake = 0;
        }
        let targetX = (p1.x + p2.x) / 2 - camera.width / 2;
        let camX = camera.x + (targetX - camera.x) * 0.1;
        if (camX < 0) camX = 0;
        if (camX > STAGE_WIDTH - camera.width) camX = STAGE_WIDTH - camera.width;

        return { 
            p1, p2, projectiles, particles, screenShake, matchState, 
            matchTimer, roundTime, frameCount, p1Wins, p2Wins,
            camera: { ...camera, x: camX }
        };
    })
}));
