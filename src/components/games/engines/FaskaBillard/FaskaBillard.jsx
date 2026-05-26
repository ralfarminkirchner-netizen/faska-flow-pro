import React, { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, CylinderCollider } from '@react-three/rapier';
import { Text, Line, Sparkles, Environment } from '@react-three/drei';
import * as THREE from 'three';

const BALL_RADIUS = 0.3;
const TABLE_WIDTH = 8;
const TABLE_LENGTH = 16;
const WALL_THICKNESS = 0.5;
const WALL_HEIGHT = 0.6;
const POCKET_RADIUS = 0.6;

// Rack generator
const generateRack = () => {
    const positions = [];
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#9b59b6'];
    let idx = 0;
    const startZ = -4;
    const spacing = BALL_RADIUS * 2.05;
    
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col <= row; col++) {
            const x = (col - row / 2) * spacing;
            const z = startZ - row * spacing * 0.866;
            positions.push({
                id: letters[idx],
                letter: letters[idx],
                color: colors[idx],
                position: [x, BALL_RADIUS, z]
            });
            idx++;
        }
    }
    return positions;
};

const ColoredBall = ({ position, color, letter }) => {
    const bodyRef = useRef();
    const textRef = useRef();
    
    useFrame(() => {
        if (bodyRef.current && textRef.current) {
            const pos = bodyRef.current.translation();
            textRef.current.position.set(pos.x, pos.y + BALL_RADIUS + 0.1, pos.z);
        }
    });
    
    return (
        <>
            <RigidBody 
                ref={bodyRef}
                position={position} 
                colliders="ball" 
                restitution={0.9} 
                friction={0.2}
                linearDamping={0.8}
                angularDamping={0.8}
                name={`ball-${letter}`}
            >
                <mesh castShadow receiveShadow>
                    <sphereGeometry args={[BALL_RADIUS, 32, 32]} />
                    <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
                </mesh>
            </RigidBody>
            <Text 
                ref={textRef}
                fontSize={0.4} 
                color="white"
                outlineWidth={0.04}
                outlineColor="black"
                rotation={[-Math.PI/2, 0, 0]}
            >
                {letter}
            </Text>
        </>
    );
};

const CueBall = ({ cueBallRef, cuePosRef }) => {
    useFrame(() => {
        if (cueBallRef.current && cuePosRef.current) {
            cuePosRef.current.copy(cueBallRef.current.translation());
        }
    });

    return (
        <RigidBody 
            ref={cueBallRef}
            position={[0, BALL_RADIUS, 4]} 
            colliders="ball" 
            restitution={0.9} 
            friction={0.2}
            linearDamping={0.8}
            angularDamping={0.8}
            name="cue"
        >
            <mesh castShadow receiveShadow>
                <sphereGeometry args={[BALL_RADIUS, 32, 32]} />
                <meshStandardMaterial color="white" roughness={0.2} metalness={0.1} />
            </mesh>
        </RigidBody>
    );
};

const AimLine = ({ dragStartRef, dragCurrentRef, cuePosRef }) => {
    const ref = useRef();
    useFrame(() => {
        if (dragStartRef.current && dragCurrentRef.current && cuePosRef.current && ref.current) {
            const dir = new THREE.Vector3().subVectors(dragStartRef.current, dragCurrentRef.current);
            dir.y = 0;
            const dist = dir.length();
            if (dist > 0.5) {
                dir.normalize().multiplyScalar(Math.min(dist * 2, 8)); 
                const start = cuePosRef.current.clone();
                start.y += BALL_RADIUS + 0.1;
                const end = start.clone().add(dir);
                
                ref.current.geometry.setPositions([start.x, start.y, start.z, end.x, end.y, end.z]);
                ref.current.visible = true;
            } else {
                ref.current.visible = false;
            }
        } else if (ref.current) {
            ref.current.visible = false;
        }
    });
    
    return <Line ref={ref} points={[[0,0,0], [0,0,1]]} color="white" lineWidth={3} dashed />
};

export default function FaskaBillard({ onExit }) {
    const [activeBalls, setActiveBalls] = useState(generateRack());
    const [nextLetter, setNextLetter] = useState('A');
    const [message, setMessage] = useState('Pot ball A!');
    const [explosions, setExplosions] = useState([]);
    
    const dragStartRef = useRef(null);
    const dragCurrentRef = useRef(null);
    
    const cueBallRef = useRef();
    const cuePosRef = useRef(new THREE.Vector3(0, BALL_RADIUS, 4));

    const nextLetterRef = useRef(nextLetter);
    useEffect(() => { nextLetterRef.current = nextLetter; }, [nextLetter]);

    const activeBallsRef = useRef(activeBalls);
    useEffect(() => { activeBallsRef.current = activeBalls; }, [activeBalls]);

    const triggerJuice = (type, position) => {
        const id = Date.now() + Math.random();
        const color = type === 'success' ? '#2ecc71' : '#e74c3c';
        setExplosions(prev => [...prev, { id, position, color }]);
        setTimeout(() => {
            setExplosions(prev => prev.filter(e => e.id !== id));
        }, 1000);
    };

    const handlePocket = (e) => {
        const body = e.other.rigidBody;
        const name = e.other.rigidBodyObject?.name;
        
        if (!body || !name) return;
        
        if (name === 'cue') {
            setMessage('Oops! Cue ball potted.');
            body.setTranslation({x: 0, y: BALL_RADIUS * 2, z: 4}, true);
            body.setLinvel({x: 0, y: 0, z: 0}, true);
            body.setAngvel({x: 0, y: 0, z: 0}, true);
            triggerJuice('error', body.translation());
            return;
        }
        
        if (name.startsWith('ball-')) {
            const letter = name.split('-')[1];
            
            if (activeBallsRef.current.find(b => b.letter === letter)) {
                if (letter === nextLetterRef.current) {
                    setMessage(`Nice! Potted ${letter}.`);
                    body.setTranslation({x: 100, y: -100, z: 100}, true);
                    setActiveBalls(prev => prev.filter(b => b.letter !== letter));
                    
                    setNextLetter(prev => {
                        const nextCode = prev.charCodeAt(0) + 1;
                        if (nextCode > 'F'.charCodeAt(0)) {
                            setMessage('YOU WIN! Play again?');
                            return 'WIN';
                        }
                        return String.fromCharCode(nextCode);
                    });
                    triggerJuice('success', body.translation());
                } else {
                    setMessage(`Wrong! You needed ${nextLetterRef.current}, not ${letter}.`);
                    body.setTranslation({x: 0, y: BALL_RADIUS * 2, z: -2}, true);
                    body.setLinvel({x: 0, y: 0, z: 0}, true);
                    body.setAngvel({x: 0, y: 0, z: 0}, true);
                    triggerJuice('error', body.translation());
                }
            }
        }
    };

    const handleShoot = (start, end) => {
        if (!start || !end) return;
        const dir = new THREE.Vector3().subVectors(start, end);
        dir.y = 0;
        const dist = dir.length();
        if (dist < 0.5) return;
        
        let power = dist * 5;
        if (power > 30) power = 30;
        dir.normalize();
        
        if (cueBallRef.current) {
            cueBallRef.current.applyImpulse({ x: dir.x * power, y: 0, z: dir.z * power }, true);
        }
    };

    const walls = useMemo(() => [
        { position: [0, WALL_HEIGHT/2, -8.25], size: [6.4, WALL_HEIGHT, WALL_THICKNESS] },
        { position: [0, WALL_HEIGHT/2, 8.25], size: [6.4, WALL_HEIGHT, WALL_THICKNESS] },
        { position: [-4.25, WALL_HEIGHT/2, -4], size: [WALL_THICKNESS, WALL_HEIGHT, 6.4] },
        { position: [-4.25, WALL_HEIGHT/2, 4], size: [WALL_THICKNESS, WALL_HEIGHT, 6.4] },
        { position: [4.25, WALL_HEIGHT/2, -4], size: [WALL_THICKNESS, WALL_HEIGHT, 6.4] },
        { position: [4.25, WALL_HEIGHT/2, 4], size: [WALL_THICKNESS, WALL_HEIGHT, 6.4] },
    ], []);

    const pockets = useMemo(() => [
        [-4, 0, -8], [4, 0, -8],
        [-4, 0, 0],  [4, 0, 0],
        [-4, 0, 8],  [4, 0, 8]
    ], []);

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#111' }}>
            <Canvas shadows camera={{ position: [0, 22, 5], fov: 45, rotation: [-Math.PI / 2.5, 0, 0] }}>
                <color attach="background" args={['#1a1a1a']} />
                <ambientLight intensity={0.5} />
                <directionalLight 
                    position={[5, 10, 5]} 
                    intensity={1} 
                    castShadow 
                    shadow-mapSize={[2048, 2048]}
                />
                <Environment preset="city" />

                <Suspense fallback={null}>
                    <Physics gravity={[0, -20, 0]}>
                        {/* Table Floor */}
                        <RigidBody type="fixed" friction={0.2} restitution={0.5}>
                            <mesh position={[0, -0.25, 0]} receiveShadow>
                                <boxGeometry args={[TABLE_WIDTH + 1, 0.5, TABLE_LENGTH + 1]} />
                                <meshStandardMaterial color="#27ae60" />
                            </mesh>
                        </RigidBody>

                        {/* Walls */}
                        {walls.map((wall, i) => (
                            <RigidBody key={`wall-${i}`} type="fixed" position={wall.position} restitution={0.6} friction={0.1}>
                                <mesh receiveShadow castShadow>
                                    <boxGeometry args={wall.size} />
                                    <meshStandardMaterial color="#2c3e50" />
                                </mesh>
                            </RigidBody>
                        ))}

                        {/* Pockets */}
                        {pockets.map((pos, i) => (
                            <RigidBody 
                                key={`pocket-${i}`} 
                                type="fixed" 
                                position={pos} 
                                colliders={false}
                                sensor 
                                onIntersectionEnter={handlePocket}
                            >
                                <CylinderCollider args={[0.5, POCKET_RADIUS]} position={[0, 0, 0]} />
                                <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.01, 0]}>
                                    <circleGeometry args={[POCKET_RADIUS, 32]} />
                                    <meshBasicMaterial color="#000" />
                                </mesh>
                            </RigidBody>
                        ))}

                        {/* Balls */}
                        {activeBalls.map(ball => (
                            <ColoredBall key={ball.id} {...ball} />
                        ))}
                        <CueBall cueBallRef={cueBallRef} cuePosRef={cuePosRef} />
                    </Physics>
                </Suspense>

                {/* Aiming Plane */}
                <mesh 
                    rotation={[-Math.PI/2, 0, 0]} 
                    position={[0, BALL_RADIUS, 0]} 
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        dragStartRef.current = e.point.clone();
                        dragCurrentRef.current = e.point.clone();
                    }}
                    onPointerMove={(e) => {
                        if (dragStartRef.current) {
                            e.stopPropagation();
                            dragCurrentRef.current = e.point.clone();
                        }
                    }}
                    onPointerUp={(e) => {
                        if (dragStartRef.current) {
                            e.stopPropagation();
                            handleShoot(dragStartRef.current, e.point);
                            dragStartRef.current = null;
                            dragCurrentRef.current = null;
                        }
                    }}
                    onPointerOut={(e) => {
                        if (dragStartRef.current) {
                            e.stopPropagation();
                            handleShoot(dragStartRef.current, dragCurrentRef.current);
                            dragStartRef.current = null;
                            dragCurrentRef.current = null;
                        }
                    }}
                >
                    <planeGeometry args={[100, 100]} />
                    <meshBasicMaterial transparent opacity={0} />
                </mesh>

                {/* Aim Line */}
                <AimLine dragStartRef={dragStartRef} dragCurrentRef={dragCurrentRef} cuePosRef={cuePosRef} />

                {/* Explosions */}
                {explosions.map(ex => (
                    <Sparkles 
                        key={ex.id}
                        position={[ex.position.x, ex.position.y + 0.5, ex.position.z]} 
                        count={50} 
                        scale={2} 
                        color={ex.color} 
                        size={4} 
                        speed={2} 
                        opacity={1}
                        fade
                    />
                ))}
            </Canvas>

            {/* UI Overlay */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none', padding: '20px', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
                <div style={{ pointerEvents: 'auto' }}>
                    <button 
                        onClick={onExit} 
                        style={{ 
                            padding: '10px 20px', 
                            fontSize: '18px', 
                            cursor: 'pointer', 
                            background: '#e74c3c', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                        }}
                    >
                        Beenden
                    </button>
                </div>
                <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.7)', padding: '15px 25px', borderRadius: '10px', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                    <h2 style={{ margin: 0, fontSize: '24px' }}>Target: <span style={{ color: '#f1c40f' }}>{nextLetter === 'WIN' ? '🏆' : nextLetter}</span></h2>
                    <p style={{ margin: '8px 0 0 0', fontSize: '16px' }}>{message}</p>
                </div>
            </div>
        </div>
    );
}
