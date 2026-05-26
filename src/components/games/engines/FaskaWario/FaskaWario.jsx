import React, { useEffect, useRef, useState } from 'react';

const FaskaWario = ({ onExit }) => {
    const canvasRef = useRef(null);
    const [uiState, setUiState] = useState('START');
    const [finalScore, setFinalScore] = useState(0);

    const engineRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let lastTime = performance.now();

        const engine = {
            width: 800,
            height: 600,
            keys: {},
            keysJustPressed: {},
            mouse: { x: 0, y: 0, clicked: false, down: false },
            data: {},
            state: 'START',
            score: 0,
            lives: 4,
            timer: 0,
            transitionTimer: 0,
            resultStatus: '',
            win: () => {
                if (engine.state !== 'PLAYING') return;
                engine.resultStatus = 'WIN';
                engine.state = 'RESULT';
                engine.transitionTimer = 1.5;
            },
            lose: () => {
                if (engine.state !== 'PLAYING') return;
                engine.resultStatus = 'LOSE';
                engine.state = 'RESULT';
                engine.transitionTimer = 1.5;
                engine.lives--;
            }
        };
        engineRef.current = engine;

        const MICROGAMES = [
            {
                name: 'MathTarget',
                instruction: 'Rechne!',
                duration: 5,
                type: 'task',
                init: (eng) => {
                    const a = Math.floor(Math.random() * 5) + 1;
                    const b = Math.floor(Math.random() * 5) + 1;
                    eng.data.problem = `${a} + ${b}`;
                    const ans = a + b;
                    eng.data.targets = [
                        { id: 1, x: 200, y: 200, vx: 180, vy: 120, text: ans.toString(), correct: true, r: 45, color: '#4ADE80' },
                        { id: 2, x: 400, y: 400, vx: -150, vy: 200, text: (ans + 1).toString(), correct: false, r: 45, color: '#F87171' },
                        { id: 3, x: 600, y: 200, vx: 220, vy: -150, text: (ans - 1).toString(), correct: false, r: 45, color: '#60A5FA' }
                    ];
                },
                update: (eng, dt) => {
                    eng.data.targets.forEach(t => {
                        t.x += t.vx * dt;
                        t.y += t.vy * dt;
                        if (t.x - t.r < 0 || t.x + t.r > eng.width) t.vx *= -1;
                        if (t.y - t.r < 0 || t.y + t.r > eng.height) t.vy *= -1;
                    });
            
                    if (eng.mouse.clicked) {
                        eng.data.targets.forEach(t => {
                            const dx = eng.mouse.x - t.x;
                            const dy = eng.mouse.y - t.y;
                            if (dx*dx + dy*dy <= t.r*t.r) {
                                if (t.correct) eng.win();
                                else eng.lose();
                            }
                        });
                    }
                },
                draw: (eng, ctx) => {
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 48px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#fff';
                    ctx.fillText(eng.data.problem, eng.width / 2, 80);
                    ctx.shadowBlur = 0;
            
                    eng.data.targets.forEach(t => {
                        ctx.beginPath();
                        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
                        ctx.fillStyle = t.color;
                        ctx.shadowBlur = 20;
                        ctx.shadowColor = t.color;
                        ctx.fill();
                        ctx.shadowBlur = 0;
                        
                        ctx.strokeStyle = '#fff';
                        ctx.lineWidth = 4;
                        ctx.stroke();
            
                        ctx.fillStyle = '#000';
                        ctx.font = 'bold 28px sans-serif';
                        ctx.fillText(t.text, t.x, t.y + 10);
                    });
                }
            },
            {
                name: 'BalloonPump',
                instruction: 'Pumpe! (Leerzeichen)',
                duration: 5,
                type: 'task',
                init: (eng) => {
                    eng.data.pumps = 0;
                    eng.data.targetPumps = 12;
                },
                update: (eng, dt) => {
                    if (eng.keysJustPressed[' ']) {
                        eng.data.pumps++;
                        if (eng.data.pumps >= eng.data.targetPumps) {
                            eng.win();
                        }
                    }
                },
                draw: (eng, ctx) => {
                    const progress = Math.min(1, eng.data.pumps / eng.data.targetPumps);
                    const radius = 30 + progress * 150;
                    
                    ctx.beginPath();
                    ctx.arc(eng.width/2, eng.height/2, radius, 0, Math.PI * 2);
                    ctx.fillStyle = '#F472B6';
                    ctx.shadowBlur = 25;
                    ctx.shadowColor = '#F472B6';
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = '#BE185D';
                    ctx.stroke();
            
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 32px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(`Pumps: ${eng.data.pumps} / ${eng.data.targetPumps}`, eng.width/2, eng.height - 60);
                }
            },
            {
                name: 'DontClick',
                instruction: 'NICHT KLICKEN!',
                duration: 5,
                type: 'survival',
                init: (eng) => {
                    eng.data.wobble = 0;
                },
                update: (eng, dt) => {
                    eng.data.wobble += dt * 15;
                    if (eng.mouse.clicked || eng.keysJustPressed[' ']) {
                        eng.lose();
                    }
                },
                draw: (eng, ctx) => {
                    const offset = Math.sin(eng.data.wobble) * 15;
                    
                    ctx.beginPath();
                    ctx.arc(eng.width/2 + offset, eng.height/2, 100, 0, Math.PI * 2);
                    ctx.fillStyle = '#EF4444';
                    ctx.shadowBlur = 30;
                    ctx.shadowColor = '#EF4444';
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    
                    ctx.lineWidth = 8;
                    ctx.strokeStyle = '#7F1D1D';
                    ctx.stroke();
            
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 36px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('NICHT', eng.width/2 + offset, eng.height/2 - 10);
                    ctx.fillText('KLICKEN', eng.width/2 + offset, eng.height/2 + 30);
                }
            }
        ];

        const BOSS_GAME = {
            name: 'Boss',
            instruction: 'BOSS: Klicke 1 bis 5!',
            duration: 10,
            type: 'task',
            init: (eng) => {
                eng.data.nextNum = 1;
                eng.data.nodes = [];
                for (let i = 1; i <= 5; i++) {
                    eng.data.nodes.push({
                        num: i,
                        x: 100 + Math.random() * (eng.width - 200),
                        y: 150 + Math.random() * (eng.height - 300),
                        r: 40,
                        clicked: false
                    });
                }
            },
            update: (eng, dt) => {
                if (eng.mouse.clicked) {
                    let hitNode = false;
                    for (let i = 0; i < eng.data.nodes.length; i++) {
                        const node = eng.data.nodes[i];
                        if (node.clicked) continue;
                        const dx = eng.mouse.x - node.x;
                        const dy = eng.mouse.y - node.y;
                        if (dx*dx + dy*dy <= node.r*node.r) {
                            hitNode = true;
                            if (node.num === eng.data.nextNum) {
                                node.clicked = true;
                                eng.data.nextNum++;
                                if (eng.data.nextNum > 5) {
                                    eng.win();
                                }
                            } else {
                                eng.lose();
                            }
                            break;
                        }
                    }
                }
            },
            draw: (eng, ctx) => {
                eng.data.nodes.forEach(node => {
                    if (node.clicked) return;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
                    ctx.fillStyle = '#A78BFA';
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#A78BFA';
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = '#fff';
                    ctx.stroke();
        
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 28px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(node.num.toString(), node.x, node.y + 10);
                });
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 36px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`Finde: ${eng.data.nextNum}`, eng.width/2, 60);
            }
        };

        let currentMicrogame = null;

        const onKeyDown = (e) => {
            if (e.repeat) return;
            if (!engine.keys[e.key]) {
                engine.keysJustPressed[e.key] = true;
            }
            engine.keys[e.key] = true;
        };
        const onKeyUp = (e) => {
            engine.keys[e.key] = false;
        };
        const onMouseDown = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            engine.mouse.x = (e.clientX - rect.left) * scaleX;
            engine.mouse.y = (e.clientY - rect.top) * scaleY;
            engine.mouse.clicked = true;
            engine.mouse.down = true;
        };
        const onMouseUp = (e) => {
            engine.mouse.down = false;
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        canvas.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        const drawBackground = () => {
            ctx.fillStyle = '#1e1b4b';
            ctx.fillRect(0, 0, engine.width, engine.height);
            
            ctx.strokeStyle = '#312e81';
            ctx.lineWidth = 2;
            for(let i=0; i<engine.width; i+=50) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, engine.height); ctx.stroke();
            }
            for(let i=0; i<engine.height; i+=50) {
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(engine.width, i); ctx.stroke();
            }
        };

        const drawUI = () => {
            if (engine.state === 'PLAYING' && currentMicrogame) {
                const barWidth = engine.width * (engine.timer / currentMicrogame.duration);
                ctx.fillStyle = engine.timer < 1.5 ? '#EF4444' : '#10B981';
                ctx.fillRect(0, engine.height - 15, barWidth, 15);
            }

            if (engine.state !== 'START' && engine.state !== 'GAMEOVER' && engine.state !== 'WIN_GAME') {
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(`Leben: ${engine.lives}`, 20, 30);
                
                ctx.textAlign = 'right';
                ctx.fillText(`Score: ${engine.score}`, engine.width - 20, 30);
            }
        };

        const loop = (time) => {
            const dt = Math.min((time - lastTime) / 1000, 0.1);
            lastTime = time;

            if (engine.state !== 'START' && engine.state !== 'GAMEOVER' && engine.state !== 'WIN_GAME') {
                if (engine.state === 'TRANSITION') {
                    engine.transitionTimer -= dt;
                    if (engine.transitionTimer <= 0) {
                        engine.state = 'PLAYING';
                        if (engine.score === 5) {
                            currentMicrogame = BOSS_GAME;
                        } else {
                            currentMicrogame = MICROGAMES[Math.floor(Math.random() * MICROGAMES.length)];
                        }
                        engine.timer = currentMicrogame.duration;
                        currentMicrogame.init(engine);
                    }
                } else if (engine.state === 'PLAYING') {
                    engine.timer -= dt;
                    currentMicrogame.update(engine, dt);
                    
                    if (engine.state === 'PLAYING' && engine.timer <= 0) {
                        if (currentMicrogame.type === 'task') engine.lose();
                        else if (currentMicrogame.type === 'survival') engine.win();
                    }
                } else if (engine.state === 'RESULT') {
                    engine.transitionTimer -= dt;
                    if (engine.transitionTimer <= 0) {
                        if (engine.lives <= 0) {
                            engine.state = 'GAMEOVER';
                            setFinalScore(engine.score);
                            setUiState('GAMEOVER');
                        } else if (engine.score === 5 && engine.resultStatus === 'WIN') {
                            engine.score++;
                            engine.state = 'WIN_GAME';
                            setFinalScore(engine.score);
                            setUiState('WIN_GAME');
                        } else {
                            if (engine.resultStatus === 'WIN') engine.score++;
                            engine.state = 'TRANSITION';
                            engine.transitionTimer = 1.5;
                        }
                    }
                }

                drawBackground();
                
                if (engine.state === 'TRANSITION') {
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 48px sans-serif';
                    ctx.textAlign = 'center';
                    let instruction = 'Bereit?';
                    if (engine.score === 5) instruction = BOSS_GAME.instruction;
                    else instruction = 'Schnell!';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#fff';
                    ctx.fillText(instruction, engine.width/2, engine.height/2);
                    ctx.shadowBlur = 0;
                } else if (engine.state === 'PLAYING') {
                    currentMicrogame.draw(engine, ctx);
                } else if (engine.state === 'RESULT') {
                    ctx.fillStyle = engine.resultStatus === 'WIN' ? '#4ADE80' : '#EF4444';
                    ctx.font = 'bold 64px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = engine.resultStatus === 'WIN' ? '#4ADE80' : '#EF4444';
                    ctx.fillText(engine.resultStatus === 'WIN' ? 'ERFOLG!' : 'FEHLSCHLAG!', engine.width/2, engine.height/2);
                    ctx.shadowBlur = 0;
                }
                
                drawUI();
            }

            engine.mouse.clicked = false;
            engine.keysJustPressed = {};

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            if (canvas) canvas.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const startGame = () => {
        if (engineRef.current) {
            engineRef.current.state = 'TRANSITION';
            engineRef.current.score = 0;
            engineRef.current.lives = 4;
            engineRef.current.transitionTimer = 1.5;
            setUiState('PLAYING');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.exitBtn} onClick={onExit}>Beenden</button>
                <h1 style={styles.title}>FaskaWario</h1>
            </div>

            <div style={styles.gameArea}>
                <canvas 
                    ref={canvasRef} 
                    width={800} 
                    height={600} 
                    style={styles.canvas}
                />

                {uiState === 'START' && (
                    <div style={styles.overlay}>
                        <h2 style={styles.overlayTitle}>Willkommen bei FaskaWario!</h2>
                        <p style={styles.overlayText}>Bestehe die rasanten Mikro-Spiele. Schaffst du den Boss?</p>
                        <button style={styles.playBtn} onClick={startGame}>Starten</button>
                    </div>
                )}

                {uiState === 'GAMEOVER' && (
                    <div style={styles.overlay}>
                        <h2 style={{...styles.overlayTitle, color: '#EF4444'}}>Game Over!</h2>
                        <p style={styles.overlayText}>Score: {finalScore}</p>
                        <button style={styles.playBtn} onClick={startGame}>Nochmal spielen</button>
                    </div>
                )}

                {uiState === 'WIN_GAME' && (
                    <div style={styles.overlay}>
                        <h2 style={{...styles.overlayTitle, color: '#4ADE80'}}>Boss besiegt!</h2>
                        <p style={styles.overlayText}>Fantastisch, du hast gewonnen!</p>
                        <p style={styles.overlayText}>Score: {finalScore}</p>
                        <button style={styles.playBtn} onClick={startGame}>Nochmal spielen</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        color: 'white',
        padding: '20px',
        boxSizing: 'border-box'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '800px',
        marginBottom: '20px'
    },
    title: {
        margin: 0,
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#fbbf24',
        textShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
    },
    exitBtn: {
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        fontSize: '1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        transition: 'background 0.2s'
    },
    gameArea: {
        position: 'relative',
        width: '800px',
        height: '600px',
        boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
        borderRadius: '12px',
        overflow: 'hidden'
    },
    canvas: {
        display: 'block',
        width: '100%',
        height: '100%',
        backgroundColor: '#1e1b4b'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
    },
    overlayTitle: {
        fontSize: '3rem',
        marginBottom: '10px',
        color: '#f8fafc',
        textAlign: 'center'
    },
    overlayText: {
        fontSize: '1.5rem',
        marginBottom: '30px',
        color: '#cbd5e1',
        textAlign: 'center'
    },
    playBtn: {
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        padding: '15px 40px',
        fontSize: '1.5rem',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.5)',
        transition: 'transform 0.1s, background 0.2s'
    }
};

export default FaskaWario;
