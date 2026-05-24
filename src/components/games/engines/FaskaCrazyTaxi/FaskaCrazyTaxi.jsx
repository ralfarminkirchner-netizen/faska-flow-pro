import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const LANDMARKS = [
    { id: 1, name: 'blauen Pyramide', color: '#2196f3', type: 'pyramid', position: [-40, 0, -40] },
    { id: 2, name: 'roten Würfel', color: '#f44336', type: 'cube', position: [40, 0, -40] },
    { id: 3, name: 'grünen Kugel', color: '#4caf50', type: 'sphere', position: [-40, 0, 40] },
    { id: 4, name: 'gelben Zylinder', color: '#ffeb3b', type: 'cylinder', position: [40, 0, 40] },
];

const BUILDINGS = [];
const blockSize = 15;
const roadSize = 10;
for (let x = -40; x <= 40; x += (blockSize + roadSize)) {
    for (let z = -40; z <= 40; z += (blockSize + roadSize)) {
        if (Math.abs(x) > 30 && Math.abs(z) > 30) continue; 
        BUILDINGS.push({
            x: x + (Math.random() * 4 - 2),
            z: z + (Math.random() * 4 - 2),
            w: blockSize * (0.8 + Math.random()*0.4),
            d: blockSize * (0.8 + Math.random()*0.4),
            h: 5 + Math.random() * 20,
            color: `hsl(${Math.random() * 360}, 40%, 30%)`
        });
    }
}

function isInsideBuilding(x, z) {
    for (let b of BUILDINGS) {
        if (Math.abs(x - b.x) < b.w/2 + 3 && Math.abs(z - b.z) < b.d/2 + 3) return true;
    }
    return false;
}

function getRandomRoadPosition() {
    let x, z;
    do {
        x = (Math.random() - 0.5) * 80;
        z = (Math.random() - 0.5) * 80;
    } while (isInsideBuilding(x, z));
    return [x, 0, z];
}

const CityEnvironment = React.memo(() => {
    return (
        <group>
            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                <planeGeometry args={[120, 120]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Buildings */}
            {BUILDINGS.map((b, i) => (
                <mesh key={i} position={[b.x, b.h/2, b.z]} castShadow receiveShadow>
                    <boxGeometry args={[b.w, b.h, b.d]} />
                    <meshStandardMaterial color={b.color} />
                </mesh>
            ))}

            {/* Landmarks */}
            {LANDMARKS.map((l, i) => {
                let geometry;
                if (l.type === 'pyramid') geometry = <coneGeometry args={[5, 10, 4]} />;
                else if (l.type === 'cube') geometry = <boxGeometry args={[8, 8, 8]} />;
                else if (l.type === 'sphere') geometry = <sphereGeometry args={[5, 32, 32]} />;
                else if (l.type === 'cylinder') geometry = <cylinderGeometry args={[4, 4, 10, 32]} />;

                return (
                    <mesh key={`lm-${i}`} position={[l.position[0], 5, l.position[2]]} castShadow receiveShadow>
                        {geometry}
                        <meshStandardMaterial color={l.color} />
                    </mesh>
                );
            })}
        </group>
    );
});

function CarAndGameLogic({ setScore, setTimeLeft, setMission, setGameState, isPlaying }) {
    const carRef = useRef();
    const passengerMeshRef = useRef();
    const targetIndicatorRef = useRef();
    
    const speed = useRef(0);
    const rotation = useRef(0);
    const passengerActive = useRef(false);
    const passengerPos = useRef(getRandomRoadPosition());
    const currentTarget = useRef(null);
    const timeRef = useRef(60);
    const shakeRef = useRef(0);

    const keys = useRef({ w: false, a: false, s: false, d: false });

    useEffect(() => {
        const handleKeyDown = (e) => { 
            const key = e.key.toLowerCase();
            if(keys.current.hasOwnProperty(key)) keys.current[key] = true; 
        }
        const handleKeyUp = (e) => { 
            const key = e.key.toLowerCase();
            if(keys.current.hasOwnProperty(key)) keys.current[key] = false; 
        }
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }
    }, []);

    useFrame((state, delta) => {
        if (!isPlaying || !carRef.current) return;

        // update time
        timeRef.current -= delta;
        setTimeLeft(Math.max(0, timeRef.current));
        if (timeRef.current <= 0) {
            setGameState(2); // GAMEOVER
            return;
        }

        // Handle Movement
        const accel = 25;
        const maxSpeed = 35;
        const friction = 0.96;
        const turnSpeed = 3.0;

        if (keys.current.w) speed.current += accel * delta;
        if (keys.current.s) speed.current -= accel * delta;
        speed.current *= friction;
        if (speed.current > maxSpeed) speed.current = maxSpeed;
        if (speed.current < -maxSpeed/2) speed.current = -maxSpeed/2;

        if (Math.abs(speed.current) > 0.1) {
            const dir = speed.current > 0 ? 1 : -1;
            if (keys.current.a) rotation.current += turnSpeed * delta * dir;
            if (keys.current.d) rotation.current -= turnSpeed * delta * dir;
        }

        carRef.current.rotation.y = rotation.current;

        const dx = Math.sin(rotation.current) * speed.current * delta;
        const dz = Math.cos(rotation.current) * speed.current * delta;

        let newX = carRef.current.position.x + dx;
        let newZ = carRef.current.position.z + dz;

        // Collision with city bounds
        if (newX > 58) { newX = 58; speed.current *= -0.5; shakeRef.current = 0.5; }
        if (newX < -58) { newX = -58; speed.current *= -0.5; shakeRef.current = 0.5; }
        if (newZ > 58) { newZ = 58; speed.current *= -0.5; shakeRef.current = 0.5; }
        if (newZ < -58) { newZ = -58; speed.current *= -0.5; shakeRef.current = 0.5; }

        // Collision with buildings
        let collided = false;
        for (let b of BUILDINGS) {
             if (Math.abs(newX - b.x) < (b.w/2 + 1.5) && Math.abs(newZ - b.z) < (b.d/2 + 1.5)) {
                 speed.current = -speed.current * 0.5;
                 newX = carRef.current.position.x;
                 newZ = carRef.current.position.z;
                 collided = true;
             }
        }
        if (collided) {
            shakeRef.current = 0.4;
        }

        carRef.current.position.set(newX, 0, newZ);

        // Game Logic Update
        const carPos = carRef.current.position;

        if (!passengerActive.current) {
            // Check pickup
            const pX = passengerPos.current[0];
            const pZ = passengerPos.current[2];
            const dist = Math.hypot(carPos.x - pX, carPos.z - pZ);
            if (dist < 4) {
                passengerActive.current = true;
                const targetIndex = Math.floor(Math.random() * LANDMARKS.length);
                currentTarget.current = LANDMARKS[targetIndex];
                setMission(currentTarget.current.name);
                timeRef.current += 15; // bonus time
            }
        } else {
            // Check dropoff
            const tX = currentTarget.current.position[0];
            const tZ = currentTarget.current.position[2];
            const dist = Math.hypot(carPos.x - tX, carPos.z - tZ);
            if (dist < 8) { 
                passengerActive.current = false;
                setScore(s => s + 1);
                setMission(null);
                timeRef.current += 20; // bonus time
                passengerPos.current = getRandomRoadPosition();
            }
        }

        // Update passenger mesh
        if (passengerMeshRef.current) {
            passengerMeshRef.current.visible = !passengerActive.current;
            if (!passengerActive.current) {
                passengerMeshRef.current.position.set(
                    passengerPos.current[0], 
                    1 + Math.sin(state.clock.elapsedTime * 5) * 0.5, 
                    passengerPos.current[2]
                );
                passengerMeshRef.current.rotation.y += delta * 2;
            }
        }

        // Target Indicator
        if (passengerActive.current && currentTarget.current && targetIndicatorRef.current) {
            targetIndicatorRef.current.visible = true;
            targetIndicatorRef.current.position.copy(carRef.current.position);
            targetIndicatorRef.current.position.y += 3.5 + Math.sin(state.clock.elapsedTime * 10) * 0.2;
            targetIndicatorRef.current.lookAt(currentTarget.current.position[0], 3.5, currentTarget.current.position[2]);
        } else if (targetIndicatorRef.current) {
            targetIndicatorRef.current.visible = false;
        }

        // Camera Follow with shake
        const cameraOffset = new THREE.Vector3(0, 8, -12);
        cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current);
        const targetCamPos = carRef.current.position.clone().add(cameraOffset);
        
        if (shakeRef.current > 0) {
            targetCamPos.x += (Math.random() - 0.5) * shakeRef.current;
            targetCamPos.y += (Math.random() - 0.5) * shakeRef.current;
            shakeRef.current -= delta * 2;
        }

        // Smooth camera interpolation
        state.camera.position.lerp(targetCamPos, 0.1);
        state.camera.lookAt(carRef.current.position);
    });

    return (
        <>
            <group ref={carRef} position={[0,0,0]}>
                <mesh position={[0, 0.6, 0]} castShadow>
                    <boxGeometry args={[2, 0.8, 4]} />
                    <meshStandardMaterial color="#ffc107" />
                </mesh>
                <mesh position={[0, 1.3, -0.5]} castShadow>
                    <boxGeometry args={[1.6, 0.7, 2]} />
                    <meshStandardMaterial color="#222" />
                </mesh>
                <mesh position={[-1, 0.3, -1.2]} rotation={[0, 0, Math.PI/2]} castShadow>
                    <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                <mesh position={[1, 0.3, -1.2]} rotation={[0, 0, Math.PI/2]} castShadow>
                    <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                <mesh position={[-1, 0.3, 1.2]} rotation={[0, 0, Math.PI/2]} castShadow>
                    <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                <mesh position={[1, 0.3, 1.2]} rotation={[0, 0, Math.PI/2]} castShadow>
                    <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
            </group>

            <mesh ref={passengerMeshRef} castShadow>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.8} />
            </mesh>

            <group ref={targetIndicatorRef} visible={false}>
                <mesh rotation={[-Math.PI/2, 0, 0]}>
                    <coneGeometry args={[0.8, 2, 4]} />
                    <meshBasicMaterial color="#ff0000" />
                </mesh>
            </group>
        </>
    );
}

export default function FaskaCrazyTaxi({ onExit }) {
    const [gameState, setGameState] = useState(0); 
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [mission, setMission] = useState(null);

    const startGame = () => {
        setScore(0);
        setTimeLeft(60);
        setMission(null);
        setGameState(1);
    };

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#87CEEB', fontFamily: 'sans-serif' }}>
            <Canvas shadows camera={{ position: [0, 10, -15], fov: 60 }}>
                <ambientLight intensity={0.6} />
                <directionalLight 
                    position={[30, 50, -30]} 
                    intensity={1.5} 
                    castShadow 
                    shadow-mapSize={[2048, 2048]}
                >
                    <orthographicCamera attach="shadow-camera" args={[-70, 70, 70, -70]} />
                </directionalLight>
                
                <CityEnvironment />

                {gameState === 1 && (
                    <CarAndGameLogic 
                        isPlaying={gameState === 1}
                        setScore={setScore}
                        setTimeLeft={setTimeLeft}
                        setMission={setMission}
                        setGameState={setGameState}
                    />
                )}
            </Canvas>

            {/* Overlays */}
            {gameState === 0 && (
                <div style={overlayStyle}>
                    <h1 style={titleStyle}>Faska Crazy Taxi</h1>
                    <div style={panelStyle}>
                        <p style={{fontSize: '20px', marginBottom: '10px', fontWeight: 'bold'}}>Anleitung:</p>
                        <p style={{fontSize: '18px', marginBottom: '5px'}}>🚗 Fahre mit <strong>W A S D</strong></p>
                        <p style={{fontSize: '18px', marginBottom: '5px'}}>🧍 Sammle Fahrgäste ein (die leuchtenden blauen Kugeln)</p>
                        <p style={{fontSize: '18px', marginBottom: '30px'}}>🎯 Bringe sie schnell zu der gewünschten geometrischen Form!</p>
                        <button onClick={startGame} style={btnStyle}>Spiel Starten</button>
                    </div>
                </div>
            )}

            {gameState === 2 && (
                <div style={overlayStyle}>
                    <h1 style={titleStyle}>Zeit abgelaufen!</h1>
                    <div style={panelStyle}>
                        <p style={{fontSize: '28px', marginBottom: '30px', fontWeight: 'bold'}}>Dein Score: {score}</p>
                        <button onClick={startGame} style={btnStyle}>Nochmal Spielen</button>
                    </div>
                </div>
            )}

            {gameState === 1 && (
                <>
                    <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontSize: '28px', fontWeight: 'bold', textShadow: '2px 2px 4px #000' }}>
                        <div>Score: {score}</div>
                        <div style={{color: timeLeft <= 10 ? '#f44336' : '#4caf50'}}>Zeit: {Math.ceil(timeLeft)}s</div>
                    </div>
                    {mission && (
                        <div style={{ 
                            position: 'absolute', 
                            top: 20, 
                            left: '50%', 
                            transform: 'translateX(-50%)', 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            color: '#ffc107', 
                            padding: '15px 30px', 
                            borderRadius: '12px',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            border: '3px solid #ffc107',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                            textAlign: 'center',
                            pointerEvents: 'none'
                        }}>
                            Fahrgast: <br/> "Bringe mich zur {mission}!"
                        </div>
                    )}
                </>
            )}

            <button onClick={onExit} style={{...btnStyle, position: 'absolute', top: 20, right: 20, padding: '10px 20px', fontSize: '16px', backgroundColor: '#f44336', color: 'white', border: '2px solid #b71c1c', boxShadow: 'none'}}>
                Beenden
            </button>
        </div>
    );
}

const overlayStyle = {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10
};

const titleStyle = {
    fontSize: '64px', 
    color: '#ffc107', 
    textShadow: '4px 4px 0 #000',
    marginBottom: '20px',
    fontStyle: 'italic',
    textAlign: 'center'
};

const panelStyle = {
    backgroundColor: 'rgba(255,255,255,0.9)',
    color: '#333',
    padding: '40px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    textAlign: 'center'
};

const btnStyle = {
    padding: '15px 40px',
    fontSize: '24px',
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 6px 0 #b38705, 0 10px 10px rgba(0,0,0,0.3)',
    transition: 'all 0.1s',
    textTransform: 'uppercase'
};
