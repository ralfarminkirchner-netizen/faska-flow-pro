import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const FaskaTennisSwarm = ({ onExit }) => {
    const gameContainer = useRef(null);
    const gameRef = useRef(null);

    useEffect(() => {
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
            scene: {
                preload: preload,
                create: create,
                update: update
            },
            backgroundColor: '#050510'
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;

        let ball, player, ai;
        let scorePlayer = 0;
        let scoreAI = 0;
        let scoreText;
        let questionText;
        let zones = [];
        let currentQuestionIndex = 0;
        let baseBallSpeed = 350;
        let currentBallSpeed = baseBallSpeed;
        let emitterPlayer, emitterAI;
        let isScoring = false;

        const questions = [
            { q: "Wann fiel die Berliner Mauer?", a: ["1989", "1990", "1961"], c: 0 },
            { q: "Gründung der BRD?", a: ["1949", "1945", "1955"], c: 0 },
            { q: "Wiedervereinigung Deutschlands?", a: ["1990", "1989", "1991"], c: 0 },
            { q: "Ende des Zweiten Weltkriegs?", a: ["1945", "1939", "1918"], c: 0 },
            { q: "Bau der Berliner Mauer?", a: ["1961", "1950", "1970"], c: 0 }
        ];

        function preload() {
            const g = this.add.graphics();
            
            // Ball
            g.fillStyle(0xffffff, 1);
            g.fillCircle(15, 15, 15);
            g.generateTexture('ball', 30, 30);
            g.clear();

            // Player Paddle
            g.fillStyle(0x000000, 1);
            g.fillRoundedRect(2, 2, 96, 16, 8);
            g.lineStyle(3, 0x00ff00, 1);
            g.strokeRoundedRect(2, 2, 96, 16, 8);
            g.generateTexture('playerPaddle', 100, 20);
            g.clear();

            // AI Paddle
            g.fillStyle(0x000000, 1);
            g.fillRoundedRect(2, 2, 76, 16, 8);
            g.lineStyle(3, 0xff0055, 1);
            g.strokeRoundedRect(2, 2, 76, 16, 8);
            g.generateTexture('aiPaddle', 80, 20);
            g.clear();

            // Particle Player
            g.fillStyle(0x00ff00, 1);
            g.fillCircle(6, 6, 6);
            g.generateTexture('particle', 12, 12);
            g.clear();
            
            // Particle AI
            g.fillStyle(0xff0055, 1);
            g.fillCircle(6, 6, 6);
            g.generateTexture('particleAi', 12, 12);
            g.destroy();
        }

        function create() {
            // Cyberpunk Grid
            const grid = this.add.graphics();
            grid.lineStyle(1, 0x221144, 0.5);
            for (let i = 0; i < 800; i += 40) {
                grid.moveTo(i, 0); grid.lineTo(i, 600);
            }
            for (let i = 0; i < 600; i += 40) {
                grid.moveTo(0, i); grid.lineTo(800, i);
            }
            grid.strokePath();

            // Draw Court (Trapezoid)
            const court = this.add.graphics();
            court.fillStyle(0x0a0a2a, 0.8);
            court.beginPath();
            court.moveTo(200, 150);
            court.lineTo(600, 150);
            court.lineTo(750, 550);
            court.lineTo(50, 550);
            court.closePath();
            court.fillPath();

            court.lineStyle(4, 0x00ffff, 0.8);
            court.strokePath();

            // Net line
            court.lineStyle(2, 0xffffff, 0.3);
            court.beginPath();
            court.moveTo(125, 350);
            court.lineTo(675, 350);
            court.strokePath();

            // Zones
            const zoneY = 500;
            const zoneWidth = 140;
            const zonePositions = [200, 400, 600];
            
            zonePositions.forEach((x) => {
                const zContainer = this.add.container(0, 0);
                
                const zg = this.add.graphics();
                zg.fillStyle(0x000000, 0.7);
                zg.lineStyle(2, 0x00ffff, 1);
                zg.fillRect(x - zoneWidth/2, zoneY - 30, zoneWidth, 60);
                zg.strokeRect(x - zoneWidth/2, zoneY - 30, zoneWidth, 60);
                
                // Glow
                zg.lineStyle(6, 0x00ffff, 0.3);
                zg.strokeRect(x - zoneWidth/2, zoneY - 30, zoneWidth, 60);
                zg.setBlendMode(Phaser.BlendModes.ADD);
                
                const text = this.add.text(x, zoneY, '', {
                    fontFamily: 'monospace',
                    fontSize: '28px',
                    color: '#00ffff',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
                
                zContainer.add([zg, text]);
                
                zones.push({ 
                    x, 
                    text, 
                    graphics: zg,
                    bounds: { min: x - zoneWidth/2, max: x + zoneWidth/2 } 
                });
            });

            // UI Text
            scoreText = this.add.text(20, 20, 'SPIELER: 0   KI: 0', { 
                fontFamily: 'monospace', fontSize: '20px', fill: '#00ffff' 
            });
            
            questionText = this.add.text(400, 60, '', { 
                fontFamily: 'sans-serif', fontSize: '26px', fill: '#ffcc00', fontStyle: 'bold' 
            }).setOrigin(0.5);
            questionText.setShadow(2, 2, '#000000', 4, true, true);

            // Sprites
            ai = this.physics.add.sprite(400, 150, 'aiPaddle');
            ai.setImmovable(true);
            ai.setScale(0.6);

            player = this.physics.add.sprite(400, 550, 'playerPaddle');
            player.setImmovable(true);

            ball = this.physics.add.sprite(400, 350, 'ball');
            ball.setCircle(15);
            ball.setBounce(1, 1);

            // Particles compat
            try {
                emitterPlayer = this.add.particles(0, 0, 'particle', {
                    lifespan: 800, speed: { min: 200, max: 500 }, scale: { start: 1, end: 0 },
                    alpha: { start: 1, end: 0 }, blendMode: 'ADD', emitting: false
                });
                emitterAI = this.add.particles(0, 0, 'particleAi', {
                    lifespan: 500, speed: { min: 100, max: 300 }, scale: { start: 0.8, end: 0 },
                    alpha: { start: 1, end: 0 }, blendMode: 'ADD', emitting: false
                });
            } catch (e) {
                const pManager = this.add.particles('particle');
                emitterPlayer = pManager.createEmitter({
                    lifespan: 800, speed: { min: 200, max: 500 }, scale: { start: 1, end: 0 },
                    alpha: { start: 1, end: 0 }, blendMode: 'ADD', on: false
                });
                const aiManager = this.add.particles('particleAi');
                emitterAI = aiManager.createEmitter({
                    lifespan: 500, speed: { min: 100, max: 300 }, scale: { start: 0.8, end: 0 },
                    alpha: { start: 1, end: 0 }, blendMode: 'ADD', on: false
                });
            }

            // Input
            this.input.on('pointermove', (pointer) => {
                player.x = Phaser.Math.Clamp(pointer.x, 50, 750);
            });

            // Collisions
            this.physics.add.collider(ball, player, hitPlayer, null, this);
            this.physics.add.collider(ball, ai, hitAI, null, this);

            loadQuestion();
            serveBall();
        }

        function loadQuestion() {
            const q = questions[currentQuestionIndex % questions.length];
            questionText.setText(q.q);
            
            const shuffledAnswers = [...q.a].map((ans, i) => ({ ans, isCorrect: i === q.c }));
            Phaser.Utils.Array.Shuffle(shuffledAnswers);
            
            zones.forEach((z, i) => {
                z.text.setText(shuffledAnswers[i].ans);
                z.text.setColor('#00ffff');
                z.isCorrect = shuffledAnswers[i].isCorrect;
            });
            
            currentBallSpeed = baseBallSpeed;
        }

        function serveBall() {
            isScoring = false;
            ball.setPosition(400, 350);
            ball.setScale(0.8);
            ball.setVisible(true);
            const dir = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 100 + 50);
            ball.setVelocity(dir, currentBallSpeed);
        }

        function scorePoint(isPlayer, scene) {
            if (isPlayer) {
                scorePlayer++;
                currentQuestionIndex++;
                loadQuestion();
            } else {
                scoreAI++;
                currentBallSpeed = baseBallSpeed;
            }
            scoreText.setText(`SPIELER: ${scorePlayer}   KI: ${scoreAI}`);
            serveBall();
        }

        function hitPlayer(b, p) {
            if (isScoring) return;

            let activeZone = null;
            zones.forEach(z => {
                if (b.x >= z.bounds.min && b.x <= z.bounds.max) {
                    activeZone = z;
                }
            });

            let diff = b.x - p.x;

            if (activeZone) {
                if (activeZone.isCorrect) {
                    isScoring = true;
                    b.scene.cameras.main.shake(300, 0.02);
                    emitterPlayer.explode(40, b.x, b.y);
                    
                    activeZone.text.setColor('#00ff00');
                    b.setVelocity(0, 0);
                    b.setVisible(false);
                    
                    b.scene.time.delayedCall(1000, () => {
                        scorePoint(true, b.scene);
                    });
                    return;
                } else {
                    b.scene.cameras.main.shake(100, 0.01);
                    currentBallSpeed += 40;
                    
                    activeZone.text.setColor('#ff0000');
                    b.scene.time.delayedCall(500, () => {
                        if (activeZone.text.style.color === '#ff0000') {
                            activeZone.text.setColor('#00ffff');
                        }
                    });
                }
            } else {
                currentBallSpeed += 15;
            }

            b.setVelocityY(-currentBallSpeed);
            b.setVelocityX(diff * 5);
        }

        function hitAI(b, a) {
            if (isScoring) return;
            
            let targetX = Phaser.Math.Between(150, 650);
            let distance = 550 - 150;
            let time = distance / currentBallSpeed;
            let reqVx = (targetX - b.x) / time;
            
            b.setVelocityY(currentBallSpeed);
            b.setVelocityX(reqVx);

            emitterAI.explode(5, b.x, b.y);
        }

        function update(time, delta) {
            if (isScoring) return;

            let t = Phaser.Math.Clamp((ball.y - 150) / 400, 0, 1);
            let scale = Phaser.Math.Linear(0.3, 1.2, t);
            ball.setScale(scale);
            ball.setDepth(t);

            if (ball.body.velocity.y < 0) {
                let aiSpeed = 1000;
                if (ai.x < ball.x - 5) {
                    ai.setVelocityX(aiSpeed);
                } else if (ai.x > ball.x + 5) {
                    ai.setVelocityX(-aiSpeed);
                } else {
                    ai.setVelocityX(0);
                }
                
                if (ai.x < 200) { ai.x = 200; ai.setVelocityX(0); }
                if (ai.x > 600) { ai.x = 600; ai.setVelocityX(0); }
            } else {
                if (ai.x < 390) ai.setVelocityX(150);
                else if (ai.x > 410) ai.setVelocityX(-150);
                else ai.setVelocityX(0);
            }

            if (ball.y > 600) {
                isScoring = true;
                this.cameras.main.shake(200, 0.02);
                emitterAI.explode(30, ball.x, ball.y);
                this.time.delayedCall(1000, () => {
                    scorePoint(false, this);
                });
            } else if (ball.y < 50) {
                isScoring = true;
                this.time.delayedCall(500, () => {
                    scorePoint(true, this);
                });
            }

            let leftBound = Phaser.Math.Linear(200, 50, t);
            let rightBound = Phaser.Math.Linear(600, 750, t);
            
            if (ball.x < leftBound + 15) {
                ball.x = leftBound + 15;
                ball.setVelocityX(Math.abs(ball.body.velocity.x));
            } else if (ball.x > rightBound - 15) {
                ball.x = rightBound - 15;
                ball.setVelocityX(-Math.abs(ball.body.velocity.x));
            }
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
            }
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto' }}>
            <div ref={gameContainer} style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,255,255,0.2)' }} />
            <button 
                onClick={onExit}
                style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    padding: '10px 20px',
                    backgroundColor: 'rgba(255, 0, 85, 0.8)',
                    color: '#fff',
                    border: '2px solid #ff0055',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    zIndex: 10,
                    textTransform: 'uppercase',
                    boxShadow: '0 0 10px rgba(255,0,85,0.5)'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 0, 85, 1)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 0, 85, 0.8)'}
            >
                Beenden
            </button>
        </div>
    );
};

export default FaskaTennisSwarm;
