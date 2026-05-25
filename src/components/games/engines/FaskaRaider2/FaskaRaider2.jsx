import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls, KeyboardControls } from '@react-three/drei';
import { Physics, RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { create } from 'zustand';

// --- State Store ---
const useStore = create((set) => ({
    gameState: 'START', // START, PLAYING, ARTIFACT_FOUND, GAMEOVER, ESCAPED
    artifactFound: false,
    playCount: 0,
    setGameState: (state) => set({ gameState: state }),
    collectArtifact: () => set({ artifactFound: true, gameState: 'ARTIFACT_FOUND' }),
    restart: () => set((state) => ({ gameState: 'PLAYING', artifactFound: false, playCount: state.playCount + 1 }))
}));

const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] }
];

// --- Player Controller ---
function Player({ startPos }) {
    const rb = useRef();
    const meshRef = useRef();
    const [, get] = useKeyboardControls();
    const { camera } = useThree();
    const { world, rapier } = useRapier();
    
    const rotationY = useRef(0);
    const playerSpeed = 10;
    const jumpForce = 12;
    const gameState = useStore(state => state.gameState);

    useFrame((state, delta) => {
        if (!rb.current) return;
        
        const translation = rb.current.translation();
        
        // Death by falling
        if (translation.y < -10 && gameState !== 'GAMEOVER') {
            useStore.getState().setGameState('GAMEOVER');
        }

        if (gameState !== 'PLAYING' && gameState !== 'ARTIFACT_FOUND') return;
        
        const { forward, backward, left, right, jump } = get();
        const velocity = rb.current.linvel();

        // Ground check
        let isGrounded = false;
        const rayOrigin = { x: translation.x, y: translation.y - 0.5, z: translation.z };
        const rayDir = { x: 0, y: -1, z: 0 };
        const ray = new rapier.Ray(rayOrigin, rayDir);
        const hit = world.castRay(ray, 0.6, true, undefined, undefined, rb.current.collider(0));
        
        if (hit && hit.toi < 0.6) {
            isGrounded = true;
        }

        // Tank controls rotation
        if (left) rotationY.current += 3.5 * delta;
        if (right) rotationY.current -= 3.5 * delta;

        // Visual wobble and rotation
        if (meshRef.current) {
            meshRef.current.rotation.y = rotationY.current;
            if (isGrounded && (forward || backward)) {
                const time = state.clock.getElapsedTime();
                meshRef.current.rotation.z = Math.sin(time * 15) * 0.1;
                meshRef.current.position.y = Math.abs(Math.sin(time * 15)) * 0.1;
            } else {
                meshRef.current.rotation.z = 0;
                meshRef.current.position.y = 0;
            }
        }

        // Movement direction
        const dir = new THREE.Vector3(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
        let speedMultiplier = 1.0;
        if (backward) speedMultiplier = 0.5;

        if (dir.lengthSq() > 0) dir.normalize();
        dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY.current);
        dir.multiplyScalar(playerSpeed * speedMultiplier);

        // Apply velocity (preserve Y for gravity)
        rb.current.setLinvel({ x: dir.x, y: velocity.y, z: dir.z }, true);

        // Jump
        if (jump && isGrounded) {
            rb.current.setLinvel({ x: dir.x, y: jumpForce, z: dir.z }, true);
        }

        // Camera follow (3rd person)
        const idealOffset = new THREE.Vector3(0, 3, 5);
        idealOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY.current);
        idealOffset.add(translation);

        camera.position.lerp(idealOffset, 0.1);
        const lookTarget = new THREE.Vector3(translation.x, translation.y + 1, translation.z);
        camera.lookAt(lookTarget);
    });

    return (
        <RigidBody 
            ref={rb} 
            position={startPos} 
            colliders={false} 
            enabledRotations={[false, false, false]} 
            mass={10} 
            friction={0}
            onCollisionEnter={(e) => {
                const rbName = e.rigidBodyObject?.name;
                if (rbName === 'trap' && useStore.getState().gameState !== 'GAMEOVER') {
                    useStore.getState().setGameState('GAMEOVER');
                }
            }}
        >
            <CapsuleCollider args={[0.5, 0.5]} name="player" />
            <group ref={meshRef}>
                <mesh castShadow receiveShadow position={[0, 0, 0]}>
                    <capsuleGeometry args={[0.5, 1, 16, 16]} />
                    <meshStandardMaterial color="#3a86ff" roughness={0.4} />
                </mesh>
                {/* Face indicator */}
                <mesh position={[0, 0.5, -0.4]}>
                    <boxGeometry args={[0.6, 0.2, 0.2]} />
                    <meshStandardMaterial color="white" />
                </mesh>
                <mesh position={[0, 0.5, -0.5]}>
                    <boxGeometry args={[0.2, 0.1, 0.1]} />
                    <meshStandardMaterial color="black" />
                </mesh>
            </group>
        </RigidBody>
    );
}

// --- Environment Components ---

function Platform({ position, size }) {
    return (
        <RigidBody type="fixed" position={position} colliders="cuboid">
            <mesh castShadow receiveShadow>
                <boxGeometry args={size} />
                <meshStandardMaterial color="#333" roughness={0.9} />
            </mesh>
        </RigidBody>
    );
}

function Wall({ position, size, rotation=[0,0,0] }) {
    return (
        <RigidBody type="fixed" position={position} rotation={rotation} colliders="cuboid">
            <mesh castShadow receiveShadow>
                <boxGeometry args={size} />
                <meshStandardMaterial color="#1a1a1a" roughness={1} />
            </mesh>
        </RigidBody>
    );
}

function PushableBlock({ position }) {
    return (
        <RigidBody position={position} mass={2} friction={1} enabledRotations={[false, false, false]} colliders="cuboid">
            <mesh castShadow receiveShadow>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="#5c4a3d" roughness={0.9} />
            </mesh>
            {/* Indication that it's movable */}
            <mesh position={[0, 1.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
                <planeGeometry args={[1.5, 1.5]} />
                <meshBasicMaterial color="#7a6250" />
            </mesh>
        </RigidBody>
    );
}

function Torch({ position }) {
    return (
        <group position={position}>
            <pointLight color="#ffaa00" intensity={3} distance={15} castShadow />
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.2, 0.5, 0.2]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
                <coneGeometry args={[0.15, 0.4, 8]} />
                <meshBasicMaterial color="#ffaa00" />
            </mesh>
        </group>
    );
}

function SwingingBlade({ position, rotation=[0,0,0], speed=2 }) {
    const bladeRef = useRef();

    useFrame((state) => {
        if (!bladeRef.current) return;
        const time = state.clock.getElapsedTime();
        const angle = Math.sin(time * speed) * (Math.PI / 2.5);
        
        const quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
        const baseQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation));
        baseQuat.multiply(quat);

        bladeRef.current.setNextKinematicRotation(baseQuat);
    });

    return (
        <RigidBody name="trap" ref={bladeRef} type="kinematicPosition" position={position} colliders="trimesh">
            <group>
                <mesh position={[0, -2, 0]} castShadow>
                    <boxGeometry args={[0.1, 4, 1]} />
                    <meshStandardMaterial color="#444" />
                </mesh>
                <mesh position={[0, -4.5, 0]} castShadow>
                    <boxGeometry args={[0.2, 1, 3]} />
                    <meshStandardMaterial color="#aaa" metalness={0.8} />
                </mesh>
            </group>
        </RigidBody>
    );
}

function BoulderTrap() {
    const gameState = useStore(state => state.gameState);
    const boulderRef = useRef();

    useEffect(() => {
        if (gameState === 'ARTIFACT_FOUND' && boulderRef.current) {
            boulderRef.current.applyImpulse({ x: 0, y: -20, z: 1500 }, true);
        }
    }, [gameState]);

    if (gameState !== 'ARTIFACT_FOUND') return null;

    return (
        <RigidBody ref={boulderRef} position={[0, 8, -82]} mass={100} colliders="ball" name="trap">
            <mesh castShadow>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshStandardMaterial color="#222" roughness={0.9} />
            </mesh>
        </RigidBody>
    );
}

function Artifact({ position }) {
    const artifactRef = useRef();
    const gameState = useStore(state => state.gameState);

    useFrame((state) => {
        if (!artifactRef.current) return;
        artifactRef.current.rotation.y += 0.05;
        artifactRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    });

    if (gameState === 'ARTIFACT_FOUND' || gameState === 'ESCAPED') return null;

    return (
        <group position={position}>
            <RigidBody type="fixed" colliders="ball" sensor onIntersectionEnter={(e) => {
                if (e.colliderObject?.name === 'player' && gameState === 'PLAYING') {
                    useStore.getState().collectArtifact();
                }
            }}>
                <mesh ref={artifactRef}>
                    <octahedronGeometry args={[0.6, 0]} />
                    <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={1} />
                </mesh>
            </RigidBody>
            <pointLight color="#ffd700" intensity={5} distance={15} />
        </group>
    );
}

function ExitPortal({ position }) {
    const gameState = useStore(state => state.gameState);
    const portalRef = useRef();
    
    useFrame((state) => {
        if (portalRef.current) {
            portalRef.current.rotation.y += 0.02;
            portalRef.current.rotation.x += 0.01;
        }
    });

    if (gameState !== 'ARTIFACT_FOUND') return null;

    return (
        <group position={position}>
            <RigidBody type="fixed" colliders="ball" sensor onIntersectionEnter={(e) => {
                if (e.colliderObject?.name === 'player') {
                    useStore.getState().setGameState('ESCAPED');
                }
            }}>
                <mesh ref={portalRef}>
                    <torusGeometry args={[1.5, 0.2, 16, 100]} />
                    <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} />
                </mesh>
            </RigidBody>
            <pointLight color="#00ffcc" intensity={5} distance={15} />
        </group>
    );
}

function EnvironmentGeometry() {
    return (
        <group>
            {/* Start Platform */}
            <Platform position={[0, -1, 0]} size={[16, 2, 16]} />
            <Wall position={[-8, 4, 0]} size={[1, 10, 16]} />
            <Wall position={[8, 4, 0]} size={[1, 10, 16]} />
            <Wall position={[0, 4, 8]} size={[16, 10, 1]} />
            
            {/* Corridor with blades */}
            <Platform position={[0, -1, -18]} size={[8, 2, 20]} />
            <Wall position={[-4, 4, -18]} size={[1, 10, 20]} />
            <Wall position={[4, 4, -18]} size={[1, 10, 20]} />

            <SwingingBlade position={[0, 4, -12]} speed={2.0} />
            <SwingingBlade position={[0, 4, -18]} speed={2.5} rotation={[0, Math.PI, 0]} />
            <SwingingBlade position={[0, 4, -24]} speed={2.2} />

            {/* Gap to jump */}
            <Platform position={[0, -1, -34]} size={[6, 2, 6]} />

            {/* Pushable Block Area */}
            <Platform position={[0, -1, -48]} size={[16, 2, 16]} />
            <Wall position={[-8, 4, -48]} size={[1, 10, 16]} />
            <Wall position={[8, 4, -48]} size={[1, 10, 16]} />
            <PushableBlock position={[0, 2, -48]} />
            
            {/* High ledge that needs the block to climb */}
            <Platform position={[0, 1, -60]} size={[16, 6, 8]} />
            <Wall position={[-8, 6, -60]} size={[1, 12, 8]} />
            <Wall position={[8, 6, -60]} size={[1, 12, 8]} />

            {/* Artifact Room */}
            <Platform position={[0, 3, -74]} size={[20, 2, 20]} />
            <Wall position={[-10, 8, -74]} size={[1, 12, 20]} />
            <Wall position={[10, 8, -74]} size={[1, 12, 20]} />
            <Wall position={[0, 8, -84]} size={[20, 12, 1]} />

            <Artifact position={[0, 5.5, -78]} />

            {/* Torches */}
            <Torch position={[-7, 2, 0]} />
            <Torch position={[7, 2, 0]} />
            <Torch position={[-3.5, 2, -12]} />
            <Torch position={[3.5, 2, -24]} />
            <Torch position={[-7, 3, -48]} />
            <Torch position={[7, 3, -48]} />
            <Torch position={[-7, 7, -60]} />
            <Torch position={[7, 7, -60]} />
            <Torch position={[-9, 7, -74]} />
            <Torch position={[9, 7, -74]} />
            
            {/* Death Pit Floor */}
            <mesh position={[0, -15, -40]} rotation={[-Math.PI/2, 0, 0]}>
                <planeGeometry args={[200, 200]} />
                <meshBasicMaterial color="#020101" />
            </mesh>
        </group>
    )
}

function Scene() {
    const { scene } = useThree();
    const gameState = useStore(state => state.gameState);
    
    useEffect(() => {
        scene.fog = new THREE.FogExp2('#050302', 0.04);
        if (gameState === 'ARTIFACT_FOUND') {
            scene.fog.color.set('#220505');
            scene.background = new THREE.Color('#220505');
        } else {
            scene.fog.color.set('#050302');
            scene.background = new THREE.Color('#050302');
        }
    }, [gameState, scene]);

    return (
        <Suspense fallback={null}>
            <Physics gravity={[0, -20, 0]}>
                <Player startPos={[0, 2, 0]} />
                <EnvironmentGeometry />
                <ExitPortal position={[0, 1, 0]} />
                <BoulderTrap />
            </Physics>
            <ambientLight intensity={0.05} />
        </Suspense>
    );
}

// --- UI Overlay ---
function UI({ onExit }) {
    const gameState = useStore(state => state.gameState);
    const restart = useStore(state => state.restart);
    const setGameState = useStore(state => state.setGameState);

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 10, fontFamily: 'sans-serif' }}>
            {gameState === 'START' && (
                <div style={{ pointerEvents: 'auto', background: 'rgba(0,0,0,0.8)', padding: '40px', borderRadius: '10px', textAlign: 'center', color: 'white', border: '2px solid #ffaa00' }}>
                    <h1 style={{ fontSize: '3rem', color: '#ffaa00', margin: '0 0 20px 0' }}>Faska Raider II</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Navigate the tomb. Find the artifact. Escape.</p>
                    <p style={{ color: '#aaa', marginBottom: '30px' }}>Controls: WASD/Arrows to Move, SPACE to Jump</p>
                    <button onClick={() => setGameState('PLAYING')} style={{ padding: '15px 30px', fontSize: '1.2rem', cursor: 'pointer', background: '#ffaa00', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Enter Tomb</button>
                    <button onClick={onExit} style={{ marginTop: '15px', display: 'block', width: '100%', padding: '15px 30px', fontSize: '1.2rem', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>Exit Game</button>
                </div>
            )}
            {gameState === 'PLAYING' && (
                <div style={{ position: 'absolute', top: '20px', left: '20px', color: 'white', fontSize: '1.2rem', textShadow: '2px 2px 4px #000' }}>
                    Objective: Find the Golden Artifact
                </div>
            )}
            {gameState === 'ARTIFACT_FOUND' && (
                <div style={{ position: 'absolute', top: '20px', left: '20px', color: '#ff4444', fontSize: '1.5rem', fontWeight: 'bold', textShadow: '2px 2px 4px #000', animation: 'pulse 1s infinite' }}>
                    RUN BACK TO THE START!
                </div>
            )}
            {gameState === 'GAMEOVER' && (
                <div style={{ pointerEvents: 'auto', background: 'rgba(50,0,0,0.9)', padding: '40px', borderRadius: '10px', textAlign: 'center', color: 'white', border: '2px solid #ff4444' }}>
                    <h1 style={{ fontSize: '4rem', color: '#ff4444', margin: '0 0 20px 0' }}>YOU DIED</h1>
                    <button onClick={restart} style={{ padding: '15px 30px', fontSize: '1.2rem', cursor: 'pointer', background: '#ff4444', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Try Again</button>
                    <button onClick={onExit} style={{ marginTop: '15px', display: 'block', width: '100%', padding: '15px 30px', fontSize: '1.2rem', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>Quit</button>
                </div>
            )}
            {gameState === 'ESCAPED' && (
                <div style={{ pointerEvents: 'auto', background: 'rgba(0,50,0,0.9)', padding: '40px', borderRadius: '10px', textAlign: 'center', color: 'white', border: '2px solid #44ff44' }}>
                    <h1 style={{ fontSize: '3rem', color: '#44ff44', margin: '0 0 20px 0' }}>TOMB CONQUERED!</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>You escaped with the artifact!</p>
                    <button onClick={restart} style={{ padding: '15px 30px', fontSize: '1.2rem', cursor: 'pointer', background: '#44ff44', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Play Again</button>
                    <button onClick={onExit} style={{ marginTop: '15px', display: 'block', width: '100%', padding: '15px 30px', fontSize: '1.2rem', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>Quit</button>
                </div>
            )}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
