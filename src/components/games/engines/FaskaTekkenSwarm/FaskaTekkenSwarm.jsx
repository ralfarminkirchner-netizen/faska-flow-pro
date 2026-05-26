import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Sphere, Sky } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

// --- CONSTANTS & DATA ---
const ELEMENTS = [
    { symbol: 'H', number: '1', name: 'Hydrogen' },
    { symbol: 'He', number: '2', name: 'Helium' },
    { symbol: 'Li', number: '3', name: 'Lithium' },
    { symbol: 'Be', number: '4', name: 'Beryllium' },
    { symbol: 'B', number: '5', name: 'Boron' },
    { symbol: 'C', number: '6', name: 'Carbon' },
    { symbol: 'N', number: '7', name: 'Nitrogen' },
    { symbol: 'O', number: '8', name: 'Oxygen' },
    { symbol: 'F', number: '9', name: 'Fluorine' }
];

// --- GLOBAL EVENT BUS ---
class EventBus {
    constructor() { this.listeners = {}; }
    on(e, cb) { if (!this.listeners[e]) this.listeners[e] = []; this.listeners[e].push(cb); }
    off(e, cb) { if (this.listeners[e]) this.listeners[e] = this.listeners[e].filter(l => l !== cb); }
    emit(e, data) { if (this.listeners[e]) this.listeners[e].forEach(cb => cb(data)); }
}
const bus = new EventBus();

const gameRefs = {
    playerPos: new THREE.Vector3(-4, 2, 0),
    aiPos: new THREE.Vector3(4, 2, 0),
};

// --- GAME COMPONENTS ---

const ParticlesManager = () => {
    const [particles, setParticles] = useState([]);
    
    useEffect(() => {
        const handleSpawn = ({ pos, color }) => {
            const id = Date.now() + Math.random().toString();
            const newParticles = Array.from({ length: 20 }).map((_, i) => ({
                id: `${id}-${i}`,
                pos: [pos.x, pos.y + 1 + (Math.random() * 1.5), pos.z + (Math.random() - 0.5)],
                vel: [(Math.random() - 0.5) * 20, Math.random() * 20, (Math.random() - 0.5) * 20],
                color
            }));
            setParticles(prev => [...prev, ...newParticles]);
            setTimeout(() => {
                setParticles(prev => prev.filter(p => !p.id.startsWith(id)));
            }, 500);
        };
        bus.on('SPAWN_PARTICLES', handleSpawn);
        return () => bus.off('SPAWN_PARTICLES', handleSpawn);
    }, []);

    return particles.map(p => (
        <Particle key={p.id} {...p} />
    ));
};

const Particle = ({ pos, vel, color }) => {
    const ref = useRef();
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.position.x += vel[0] * delta;
            ref.current.position.y += vel[1] * delta;
            ref.current.position.z += vel[2] * delta;
            ref.current.scale.multiplyScalar(0.85);
        }
    });
    return (
        <mesh ref={ref} position={pos}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshBasicMaterial color={color} />
        </mesh>
    );
};

const CameraShakeManager = () => {
    const { camera } = useThree();
    const shakeRef = useRef(0);
    const originalPos = useRef(new THREE.Vector3(0, 4, 14));

    useEffect(() => {
        const handleShake = (intensity) => { shakeRef.current = intensity; };
        bus.on('CAMERA_SHAKE', handleShake);
        return () => bus.off('CAMERA_SHAKE', handleShake);
    }, []);

    useFrame((state, delta) => {
        if (shakeRef.current > 0) {
            camera.position.x = originalPos.current.x + (Math.random() - 0.5) * shakeRef.current;
            camera.position.y = originalPos.current.y + (Math.random() - 0.5) * shakeRef.current;
            camera.position.z = originalPos.current.z + (Math.random() - 0.5) * shakeRef.current;
            shakeRef.current -= delta * 3; // decay fast
        } else {
            camera.position.lerp(originalPos.current, 0.1);
        }
        camera.lookAt(0, 2, 0);
    });
    return null;
};

const Player = ({ status }) => {
    const rb = useRef();
    const [keys, setKeys] = useState({ a: false, d: false, w: false, s: false, space: false });
    const isAttacking = useRef(false);
    const blockRef = useRef(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'KeyA') setKeys(k => ({...k, a: true}));
            if (e.code === 'KeyD') setKeys(k => ({...k, d: true}));
            if (e.code === 'KeyW') setKeys(k => ({...k, w: true}));
            if (e.code === 'KeyS') setKeys(k => ({...k, s: true}));
            if (e.code === 'Space') setKeys(k => ({...k, space: true}));
        };
        const handleKeyUp = (e) => {
            if (e.code === 'KeyA') setKeys(k => ({...k, a: false}));
            if (e.code === 'KeyD') setKeys(k => ({...k, d: false}));
            if (e.code === 'KeyW') setKeys(k => ({...k, w: false}));
            if (e.code === 'KeyS') setKeys(k => ({...k, s: false}));
            if (e.code === 'Space') setKeys(k => ({...k, space: false}));
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        const onQteSuccess = () => {
            isAttacking.current = true;
            const p = rb.current.translation();
            const aiP = gameRefs.aiPos;
            const dir = Math.sign(aiP.x - p.x);
            rb.current.setLinvel({ x: dir * 25, y: 0, z: 0 }, true);
            
            setTimeout(() => {
                isAttacking.current = false;
                bus.emit('PLAYER_HIT_AI', 35);
                bus.emit('SPAWN_PARTICLES', { pos: gameRefs.aiPos, color: 'cyan' });
                bus.emit('CAMERA_SHAKE', 1.0);
                rb.current.setLinvel({ x: -dir * 10, y: 5, z: 0 }, true);
            }, 150);
        };
        const onQteFail = () => {
            const p = rb.current.translation();
            const aiP = gameRefs.aiPos;
            const dir = Math.sign(p.x - aiP.x);
            rb.current.setLinvel({ x: dir * 15, y: 8, z: 0 }, true);
            bus.emit('AI_HIT_PLAYER', 15);
            bus.emit('CAMERA_SHAKE', 0.5);
            bus.emit('SPAWN_PARTICLES', { pos: rb.current.translation(), color: 'red' });
        };
        const onAiAttack = (data) => {
            if (blockRef.current) {
                bus.emit('SPAWN_PARTICLES', { pos: rb.current.translation(), color: 'white' });
                const dir = Math.sign(rb.current.translation().x - gameRefs.aiPos.x);
                rb.current.setLinvel({ x: dir * 8, y: 0, z: 0 }, true);
            } else {
                bus.emit('AI_HIT_PLAYER', data.damage);
                bus.emit('SPAWN_PARTICLES', { pos: rb.current.translation(), color: 'red' });
                bus.emit('CAMERA_SHAKE', 0.5);
                const dir = Math.sign(rb.current.translation().x - gameRefs.aiPos.x);
                rb.current.setLinvel({ x: dir * 15, y: 8, z: 0 }, true);
            }
        };

        bus.on('QTE_SUCCESS', onQteSuccess);
        bus.on('QTE_FAIL', onQteFail);
        bus.on('AI_ATTACK_HIT', onAiAttack);
        return () => {
            bus.off('QTE_SUCCESS', onQteSuccess);
            bus.off('QTE_FAIL', onQteFail);
            bus.off('AI_ATTACK_HIT', onAiAttack);
        };
    }, []);

    useFrame(() => {
        if (!rb.current) return;
        const pos = rb.current.translation();
        gameRefs.playerPos.copy(pos);
        blockRef.current = keys.s && status === 'playing';

        // Lock to Z=0 plane
        if (Math.abs(pos.z) > 0.05) rb.current.setTranslation({ x: pos.x, y: pos.y, z: 0 }, true);

        if (status === 'playing' && !isAttacking.current) {
            let vx = 0;
            if (keys.a) vx = -8;
            if (keys.d) vx = 8;
            if (keys.s) vx = 0;

            const vel = rb.current.linvel();
            
            // Jump
            if (keys.w && Math.abs(vel.y) < 0.1) {
                rb.current.setLinvel({ x: vx, y: 15, z: 0 }, true);
            } else {
                rb.current.setLinvel({ x: vx !== 0 ? vx : vel.x * 0.8, y: vel.y, z: 0 }, true);
            }

            // Combo Initiation
            if (keys.space) {
                const dist = Math.abs(pos.x - gameRefs.aiPos.x);
                if (dist < 5) {
                    setKeys(k => ({...k, space: false}));
                    bus.emit('QTE_START');
                }
            }
        } else if (status === 'qte') {
            rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true); // Freeze mid-air
        }
    });

    return (
        <RigidBody ref={rb} position={[-5, 2, 0]} lockRotations enabledRotations={[false, false, false]} mass={1} friction={0}>
            <Box args={[1.2, 2.2, 1.2]} castShadow>
                <meshStandardMaterial color={blockRef.current ? "#888" : "#0055ff"} />
            </Box>
            <Sphere args={[0.5]} position={[0, 1.6, 0]} castShadow>
                <meshStandardMaterial color="cyan" />
            </Sphere>
        </RigidBody>
    );
};

const AI = ({ status }) => {
    const rb = useRef();
    const attackTimer = useRef(0);
    const isAttacking = useRef(false);

    useEffect(() => {
        const onPlayerHit = () => {
            const p = rb.current.translation();
            const pP = gameRefs.playerPos;
            const dir = Math.sign(p.x - pP.x);
            rb.current.setLinvel({ x: dir * 18, y: 10, z: 0 }, true);
        };
        bus.on('PLAYER_HIT_AI', onPlayerHit);
        return () => bus.off('PLAYER_HIT_AI', onPlayerHit);
    }, []);

    useFrame((state, delta) => {
        if (!rb.current) return;
        const pos = rb.current.translation();
        gameRefs.aiPos.copy(pos);

        // Lock to Z=0 plane
        if (Math.abs(pos.z) > 0.05) rb.current.setTranslation({ x: pos.x, y: pos.y, z: 0 }, true);

        if (status === 'playing' && !isAttacking.current) {
            const pP = gameRefs.playerPos;
            const dist = Math.abs(pos.x - pP.x);
            const dir = Math.sign(pP.x - pos.x);

            let vx = 0;
            if (dist > 3) {
                vx = dir * 4;
            } else {
                attackTimer.current += delta;
                if (attackTimer.current > 1.2) {
                    attackTimer.current = 0;
                    isAttacking.current = true;
                    // Telegraph hop
                    rb.current.setLinvel({ x: -dir * 3, y: 6, z: 0 }, true); 
                    
                    setTimeout(() => {
                        if (status === 'playing' && rb.current) {
                            // Dash forward
                            rb.current.setLinvel({ x: dir * 20, y: 0, z: 0 }, true);
                            setTimeout(() => {
                                isAttacking.current = false;
                                const currentDist = Math.abs(gameRefs.aiPos.x - gameRefs.playerPos.x);
                                if (currentDist < 3.5 && status === 'playing') {
                                    bus.emit('AI_ATTACK_HIT', { damage: 15 });
                                }
                            }, 150);
                        } else {
                            isAttacking.current = false;
                        }
                    }, 400);
                }
            }

            const vel = rb.current.linvel();
            if (!isAttacking.current) {
                rb.current.setLinvel({ x: vx !== 0 ? vx : vel.x * 0.8, y: vel.y, z: 0 }, true);
            }

        } else if (status === 'qte') {
            rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        }
    });

    return (
        <RigidBody ref={rb} position={[5, 2, 0]} lockRotations enabledRotations={[false, false, false]} mass={1.5} friction={0}>
            <Box args={[1.4, 2.4, 1.4]} castShadow>
                <meshStandardMaterial color={isAttacking.current ? "#ffcc00" : "#ff3300"} />
            </Box>
            <Sphere args={[0.55]} position={[0, 1.7, 0]} castShadow>
                <meshStandardMaterial color="#330000" />
            </Sphere>
        </RigidBody>
    );
};

const GameScene = ({ status }) => {
    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 12, 8]} intensity={1.5} castShadow />
            <Sky sunPosition={[5, 10, -10]} turbidity={0.1} rayleigh={0.5} />
            
            <Physics gravity={[0, -40, 0]}>
                <Player status={status} />
                <AI status={status} />
                
                {/* Arena Floor */}
                <RigidBody type="fixed" friction={1}>
                    <Box args={[50, 2, 10]} position={[0, -1, 0]} receiveShadow>
                        <meshStandardMaterial color="#222" />
                    </Box>
                </RigidBody>
                
                {/* Invisible Walls */}
                <RigidBody type="fixed">
                    <CuboidCollider args={[1, 20, 5]} position={[-18, 10, 0]} />
                    <CuboidCollider args={[1, 20, 5]} position={[18, 10, 0]} />
                </RigidBody>
            </Physics>

            <ParticlesManager />
            <CameraShakeManager />
        </>
    );
};

// --- MAIN WRAPPER ---
export default function FaskaTekkenSwarm({ onExit }) {
    const [playerHealth, setPlayerHealth] = useState(100);
    const [aiHealth, setAiHealth] = useState(100);
    const [status, setStatus] = useState('playing'); // playing, qte, gameover, victory
    const [qte, setQte] = useState(null);
    const [gameId, setGameId] = useState(0);

    const qteRef = useRef(qte);
    useEffect(() => { qteRef.current = qte; }, [qte]);

    const resetGame = () => {
        setPlayerHealth(100);
        setAiHealth(100);
        setStatus('playing');
        setQte(null);
        setGameId(id => id + 1);
    };

    useEffect(() => {
        const handleQteStart = () => {
            const seq = Array.from({length: 3}).map(() => ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)]);
            setQte({ sequence: seq, index: 0, timeLeft: 4.5 });
            setStatus('qte');
        };
        const handlePlayerHit = (damage) => setAiHealth(h => Math.max(0, h - damage));
        const handleAiHit = (damage) => setPlayerHealth(h => Math.max(0, h - damage));

        bus.on('QTE_START', handleQteStart);
        bus.on('PLAYER_HIT_AI', handlePlayerHit);
        bus.on('AI_HIT_PLAYER', handleAiHit);
        return () => {
            bus.off('QTE_START', handleQteStart);
            bus.off('PLAYER_HIT_AI', handlePlayerHit);
            bus.off('AI_HIT_PLAYER', handleAiHit);
        }
    }, []);

    useEffect(() => {
        if (playerHealth <= 0 && status !== 'gameover') setStatus('gameover');
        if (aiHealth <= 0 && status !== 'victory') setStatus('victory');
    }, [playerHealth, aiHealth, status]);

    useEffect(() => {
        if (status !== 'qte') return;

        const timer = setInterval(() => {
            setQte(q => {
                if (!q) return null;
                const newTime = q.timeLeft - 0.1;
                if (newTime <= 0) {
                    bus.emit('QTE_FAIL');
                    setStatus('playing');
                    return null;
                }
                return { ...q, timeLeft: newTime };
            });
        }, 100);

        const handleKeyDown = (e) => {
            const currentQte = qteRef.current;
            if (!currentQte || status !== 'qte') return;
            if (!/^[1-9]$/.test(e.key)) return;
            
            const currentElement = currentQte.sequence[currentQte.index];
            if (e.key === currentElement.number) {
                const newIndex = currentQte.index + 1;
                if (newIndex >= currentQte.sequence.length) {
                    bus.emit('QTE_SUCCESS');
                    setStatus('playing');
                    setQte(null);
                } else {
                    setQte({ ...currentQte, index: newIndex });
                }
            } else {
                bus.emit('QTE_FAIL');
                setStatus('playing');
                setQte(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            clearInterval(timer);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [status]);

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#111', fontFamily: 'sans-serif' }}>
            
            <button 
                onClick={onExit} 
                style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, padding: '10px 30px', fontSize: 18, fontWeight: 'bold', background: '#ff3333', color: 'white', border: '2px solid white', borderRadius: 8, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.5)' }}
            >
                Beenden
            </button>

            {/* UI Overlay */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
                {/* Health Bars */}
                <div style={{ position: 'absolute', top: 20, left: 30 }}>
                    <div style={{ color: 'white', fontSize: 24, fontWeight: '900', textShadow: '2px 2px 0 #000' }}>PLAYER</div>
                    <div style={{ width: 300, height: 24, background: '#333', border: '3px solid white', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                        <div style={{ width: `${playerHealth}%`, height: '100%', background: playerHealth > 25 ? '#00ff00' : '#ff0000', transition: 'width 0.2s ease-out' }} />
                    </div>
                </div>

                <div style={{ position: 'absolute', top: 20, right: 30 }}>
                    <div style={{ color: 'white', fontSize: 24, fontWeight: '900', textAlign: 'right', textShadow: '2px 2px 0 #000' }}>AI BOSS</div>
                    <div style={{ width: 300, height: 24, background: '#333', border: '3px solid white', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', float: 'right' }}>
                        <div style={{ width: `${aiHealth}%`, height: '100%', background: '#ff3300', float: 'right', transition: 'width 0.2s ease-out' }} />
                    </div>
                </div>

                {/* Instructions */}
                <div style={{ position: 'absolute', bottom: 30, width: '100%', textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 'bold', textShadow: '1px 1px 2px black' }}>
                    Move: A / D &nbsp;|&nbsp; Jump: W &nbsp;|&nbsp; Block: S &nbsp;|&nbsp; Combo Attack (When Close): SPACE
                </div>
            </div>

            {/* QTE Overlay */}
            {status === 'qte' && qte && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
                    <h1 style={{ color: '#ffcc00', fontSize: 64, textShadow: '4px 4px 0 #000', margin: 0, paddingBottom: 20 }}>COMBO ATTACK!</h1>
                    <p style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 40 }}>Type the Atomic Numbers!</p>
                    
                    <div style={{ display: 'flex', gap: 30 }}>
                        {qte.sequence.map((el, idx) => (
                            <div key={idx} style={{ 
                                width: 140, height: 160, 
                                background: idx < qte.index ? '#00aa00' : (idx === qte.index ? '#ff8800' : '#222'),
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                border: `6px solid ${idx === qte.index ? 'white' : '#555'}`, borderRadius: 16,
                                boxShadow: idx === qte.index ? '0 0 30px #ffaa00' : 'none',
                                transform: idx === qte.index ? 'scale(1.1)' : 'scale(1)',
                                transition: 'all 0.1s'
                            }}>
                                <span style={{ fontSize: 18, color: '#ddd', fontWeight: 'bold' }}>{el.name}</span>
                                <span style={{ fontSize: 64, fontWeight: '900', color: 'white', lineHeight: '1.2' }}>{el.symbol}</span>
                                <span style={{ fontSize: 16, color: '#0ff', fontWeight: 'bold', marginTop: 10 }}>Key: {el.number}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 60, width: 600, height: 16, background: '#440000', border: '3px solid white', borderRadius: 8, overflow: 'hidden' }}>
                        <div style={{ width: `${(qte.timeLeft / 4.5) * 100}%`, height: '100%', background: '#ff3333' }} />
                    </div>
                </div>
            )}

            {/* End Screens */}
            {status === 'gameover' && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h1 style={{ color: '#ff3333', fontSize: 80, textShadow: '4px 4px 0 #000', margin: 0 }}>DEFEATED</h1>
                    <button onClick={resetGame} style={{ marginTop: 40, padding: '15px 50px', fontSize: 24, fontWeight: 'bold', background: 'white', color: 'black', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Retry</button>
                </div>
            )}
            {status === 'victory' && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h1 style={{ color: '#00ffcc', fontSize: 80, textShadow: '4px 4px 0 #000', margin: 0 }}>VICTORY!</h1>
                    <button onClick={resetGame} style={{ marginTop: 40, padding: '15px 50px', fontSize: 24, fontWeight: 'bold', background: 'white', color: 'black', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Play Again</button>
                </div>
            )}

            {/* 3D Canvas */}
            <Canvas camera={{ position: [0, 4, 15], fov: 50 }}>
                <color attach="background" args={['#1a1a2e']} />
                <fog attach="fog" args={['#1a1a2e', 10, 40]} />
                <Suspense fallback={null}>
                    <GameScene key={gameId} status={status} />
                </Suspense>
            </Canvas>
        </div>
    );
}
