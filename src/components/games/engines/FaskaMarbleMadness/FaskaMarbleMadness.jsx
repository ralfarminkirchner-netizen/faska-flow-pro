import React, { useState, useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Text } from '@react-three/drei';

// --- CUSTOM HOOKS ---
function usePlayerControls() {
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': setMovement((m) => ({ ...m, forward: true })); break;
        case 'KeyS': case 'ArrowDown': setMovement((m) => ({ ...m, backward: true })); break;
        case 'KeyA': case 'ArrowLeft': setMovement((m) => ({ ...m, left: true })); break;
        case 'KeyD': case 'ArrowRight': setMovement((m) => ({ ...m, right: true })); break;
        default: break;
      }
    };
    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': setMovement((m) => ({ ...m, forward: false })); break;
        case 'KeyS': case 'ArrowDown': setMovement((m) => ({ ...m, backward: false })); break;
        case 'KeyA': case 'ArrowLeft': setMovement((m) => ({ ...m, left: false })); break;
        case 'KeyD': case 'ArrowRight': setMovement((m) => ({ ...m, right: false })); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  return movement;
}

// --- COMPONENTS ---

function Marble({ onFall, resetCounter, currentNumber, gameState }) {
  const bodyRef = useRef();
  const textRef = useRef();
  const controls = usePlayerControls();
  const { camera } = useThree();

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.setTranslation({ x: 0, y: 2, z: 0 }, true);
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  }, [resetCounter]);

  useFrame((state, delta) => {
    if (!bodyRef.current) return;
    
    const pos = bodyRef.current.translation();
    
    if (textRef.current) {
      textRef.current.position.set(pos.x, pos.y + 1.2, pos.z);
    }

    if (gameState === 'playing') {
      const { forward, backward, left, right } = controls;
      const impulseStrength = 0.8 * delta * 60;
      const torqueStrength = 0.4 * delta * 60;

      if (forward) {
        bodyRef.current.applyImpulse({ x: 0, y: 0, z: -impulseStrength }, true);
        bodyRef.current.applyTorqueImpulse({ x: -torqueStrength, y: 0, z: 0 }, true);
      }
      if (backward) {
        bodyRef.current.applyImpulse({ x: 0, y: 0, z: impulseStrength }, true);
        bodyRef.current.applyTorqueImpulse({ x: torqueStrength, y: 0, z: 0 }, true);
      }
      if (left) {
        bodyRef.current.applyImpulse({ x: -impulseStrength, y: 0, z: 0 }, true);
        bodyRef.current.applyTorqueImpulse({ x: 0, y: 0, z: torqueStrength }, true);
      }
      if (right) {
        bodyRef.current.applyImpulse({ x: impulseStrength, y: 0, z: 0 }, true);
        bodyRef.current.applyTorqueImpulse({ x: 0, y: 0, z: -torqueStrength }, true);
      }
    }

    if (pos.y < -15 && gameState === 'playing') {
      onFall();
    } else {
      // Smooth Camera Follow
      const targetCamPos = new THREE.Vector3(pos.x, pos.y + 6, pos.z + 10);
      camera.position.lerp(targetCamPos, 0.1);
      camera.lookAt(pos.x, pos.y - 2, pos.z - 4);
    }
  });

  return (
    <>
      <RigidBody 
        ref={bodyRef} 
        position={[0, 2, 0]} 
        colliders="ball" 
        mass={1} 
        restitution={0.4} 
        friction={1}
        linearDamping={1.5}
        angularDamping={1.5}
      >
        <mesh castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.1} metalness={0.5} />
        </mesh>
      </RigidBody>
      <Text ref={textRef} fontSize={0.8} color="white" outlineColor="black" outlineWidth={0.05}>
        {currentNumber}
      </Text>
    </>
  );
}

function MathZone({ zone, active, onEnter }) {
  const { position, size, operation, value, section } = zone;
  const symbol = operation === 'add' ? '+' : operation === 'sub' ? '-' : operation === 'mul' ? '×' : '÷';
  const color = active ? '#22c55e' : '#64748b'; 
  
  return (
    <group position={position}>
      <RigidBody 
        type="fixed" 
        colliders="cuboid" 
        sensor 
        onIntersectionEnter={() => {
          if (active) onEnter(section, operation, value);
        }}
      >
        <mesh>
          <boxGeometry args={size} />
          <meshStandardMaterial color={color} transparent opacity={active ? 0.3 : 0.1} />
        </mesh>
      </RigidBody>
      <Text position={[0, size[1]/2 + 0.5, 0]} fontSize={1.5} color="white" outlineColor="black" outlineWidth={0.1}>
        {`${symbol} ${value}`}
      </Text>
    </group>
  );
}

function GoalZone({ currentNumber, targetNumber, gameState, onWin, onLose }) {
  return (
    <group position={[0, -3.5, -40]}>
      <RigidBody 
        type="fixed" 
        colliders="cuboid" 
        sensor
        onIntersectionEnter={() => {
          if (gameState !== 'playing') return;
          if (currentNumber === targetNumber) {
            onWin();
          } else {
            onLose();
          }
        }}
      >
        <mesh>
          <boxGeometry args={[8, 4, 8]} />
          <meshStandardMaterial color={currentNumber === targetNumber ? '#10b981' : '#ef4444'} transparent opacity={0.3} />
        </mesh>
      </RigidBody>
      <Text position={[0, 3, 0]} fontSize={2} color="white" outlineColor="black" outlineWidth={0.1}>
        ZIEL: {targetNumber}
      </Text>
    </group>
  );
}

function TrackWalls() {
  const wallMat = <meshStandardMaterial color="#94a3b8" transparent opacity={0.3} />;
  return (
    <group>
      {/* Start walls */}
      <RigidBody type="fixed">
        <mesh position={[-4, 0, 0]}><boxGeometry args={[0.5, 2, 8]}/>{wallMat}</mesh>
        <mesh position={[4, 0, 0]}><boxGeometry args={[0.5, 2, 8]}/>{wallMat}</mesh>
        <mesh position={[0, 0, 4]}><boxGeometry args={[8, 2, 0.5]}/>{wallMat}</mesh>
      </RigidBody>
      
      {/* Ramp 1 walls */}
      <RigidBody type="fixed">
        <mesh position={[-4, -1, -10]} rotation={[0.1, 0, 0]}><boxGeometry args={[0.5, 2, 12]}/>{wallMat}</mesh>
        <mesh position={[4, -1, -10]} rotation={[0.1, 0, 0]}><boxGeometry args={[0.5, 2, 12]}/>{wallMat}</mesh>
      </RigidBody>

      {/* Platform 2 walls */}
      <RigidBody type="fixed">
        <mesh position={[-4, -2, -20]}><boxGeometry args={[0.5, 2, 8]}/>{wallMat}</mesh>
        <mesh position={[4, -2, -20]}><boxGeometry args={[0.5, 2, 8]}/>{wallMat}</mesh>
      </RigidBody>
      
      {/* Ramp 2 walls */}
      <RigidBody type="fixed">
        <mesh position={[-4, -3, -30]} rotation={[0.1, 0, 0]}><boxGeometry args={[0.5, 2, 12]}/>{wallMat}</mesh>
        <mesh position={[4, -3, -30]} rotation={[0.1, 0, 0]}><boxGeometry args={[0.5, 2, 12]}/>{wallMat}</mesh>
      </RigidBody>
      
      {/* Goal walls */}
      <RigidBody type="fixed">
        <mesh position={[-4, -4, -40]}><boxGeometry args={[0.5, 2, 8]}/>{wallMat}</mesh>
        <mesh position={[4, -4, -40]}><boxGeometry args={[0.5, 2, 8]}/>{wallMat}</mesh>
        <mesh position={[0, -4, -44]}><boxGeometry args={[8, 2, 0.5]}/>{wallMat}</mesh>
      </RigidBody>
    </group>
  );
}

function Track() {
  return (
    <group>
      <RigidBody type="fixed">
        {/* Start Platform */}
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[8, 1, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Bridge 1 */}
        <mesh position={[0, -1.5, -10]} rotation={[0.1, 0, 0]} receiveShadow>
          <boxGeometry args={[8, 1, 12]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Platform 2 */}
        <mesh position={[0, -2.5, -20]} receiveShadow>
          <boxGeometry args={[8, 1, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Bridge 2 */}
        <mesh position={[0, -3.5, -30]} rotation={[0.1, 0, 0]} receiveShadow>
          <boxGeometry args={[8, 1, 12]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Goal Platform */}
        <mesh position={[0, -4.5, -40]} receiveShadow>
          <boxGeometry args={[8, 1, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </RigidBody>

      <TrackWalls />
    </group>
  );
}

// --- MAIN GAME COMPONENT ---

export default function FaskaMarbleMadness({ onExit }) {
  const START_NUMBER = 5;
  const TARGET_NUMBER = 20;

  const [currentNumber, setCurrentNumber] = useState(START_NUMBER);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'win', 'lose'
  const [resetCounter, setResetCounter] = useState(0);
  const [activeSections, setActiveSections] = useState({ s1: true, s2: true, s3: true });

  const ZONES = [
    // Section 1: left -> 10, right -> 10
    { id: 's1_l', section: 's1', position: [-2.1, -1.5, -10], size: [3.8, 4, 4], operation: 'add', value: 5 },
    { id: 's1_r', section: 's1', position: [2.1, -1.5, -10], size: [3.8, 4, 4], operation: 'mul', value: 2 },
    // Section 2: left -> 12, right -> 8
    { id: 's2_l', section: 's2', position: [-2.1, -2.5, -20], size: [3.8, 4, 4], operation: 'add', value: 2 },
    { id: 's2_r', section: 's2', position: [2.1, -2.5, -20], size: [3.8, 4, 4], operation: 'sub', value: 2 },
    // Section 3: reach 20 from 12 (needs +8) or 8 (needs +12)
    { id: 's3_l', section: 's3', position: [-2.1, -3.5, -30], size: [3.8, 4, 4], operation: 'add', value: 8 },
    { id: 's3_r', section: 's3', position: [2.1, -3.5, -30], size: [3.8, 4, 4], operation: 'add', value: 12 },
  ];

  const handleZoneEnter = (section, operation, value) => {
    setActiveSections(prev => {
      if (!prev[section]) return prev; // Prevent double trigger
      
      setCurrentNumber(numPrev => {
        let next = numPrev;
        if (operation === 'add') next += value;
        if (operation === 'sub') next -= value;
        if (operation === 'mul') next *= value;
        if (operation === 'div') next /= value;
        return next;
      });

      return { ...prev, [section]: false };
    });
  };

  const resetGame = () => {
    setCurrentNumber(START_NUMBER);
    setActiveSections({ s1: true, s2: true, s3: true });
    setGameState('playing');
    setResetCounter(c => c + 1);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#0f172a' }}>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <color attach="background" args={['#0f172a']} />
        
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
        />
        
        <Suspense fallback={null}>
          <Physics>
            <Track />
            
            {ZONES.map(zone => (
              <MathZone 
                key={zone.id} 
                zone={zone} 
                active={activeSections[zone.section]} 
                onEnter={handleZoneEnter} 
              />
            ))}
            
            <GoalZone 
              currentNumber={currentNumber} 
              targetNumber={TARGET_NUMBER}
              gameState={gameState} 
              onWin={() => setGameState('win')} 
              onLose={() => setGameState('lose')} 
            />
            
            <Marble 
              onFall={resetGame} 
              resetCounter={resetCounter} 
              currentNumber={currentNumber} 
              gameState={gameState}
            />
          </Physics>
        </Suspense>
      </Canvas>

      {/* OVERLAY UI */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(0,0,0,0.7)', padding: '15px', borderRadius: '10px', color: 'white', fontFamily: 'sans-serif' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Zielwert: {TARGET_NUMBER}</h2>
            <h1 style={{ margin: '5px 0 0 0', fontSize: '2rem', color: currentNumber === TARGET_NUMBER ? '#4ade80' : 'white' }}>
              Aktuell: {currentNumber}
            </h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#cbd5e1' }}>Bewege dich mit WASD / Pfeiltasten</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={resetGame} 
              style={{ pointerEvents: 'auto', padding: '10px 15px', fontSize: '16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Neustart
            </button>
            <button 
              onClick={onExit} 
              style={{ pointerEvents: 'auto', padding: '10px 15px', fontSize: '16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Beenden
            </button>
          </div>
        </div>
        
        {gameState === 'win' && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(34, 197, 94, 0.95)', padding: '40px', borderRadius: '20px', color: 'white', textAlign: 'center', pointerEvents: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', fontFamily: 'sans-serif' }}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '3rem' }}>Gewonnen! 🎉</h1>
            <p style={{ fontSize: '1.2rem', margin: '0 0 20px 0' }}>Du hast den Zielwert {TARGET_NUMBER} genau erreicht!</p>
            <button onClick={resetGame} style={{ padding: '12px 24px', fontSize: '18px', background: 'white', color: '#16a34a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Nochmal Spielen
            </button>
          </div>
        )}

        {gameState === 'lose' && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(239, 68, 68, 0.95)', padding: '40px', borderRadius: '20px', color: 'white', textAlign: 'center', pointerEvents: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', fontFamily: 'sans-serif' }}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '3rem' }}>Falscher Wert! 😢</h1>
            <p style={{ fontSize: '1.2rem', margin: '0 0 20px 0' }}>Dein Ball hatte den Wert {currentNumber}, aber {TARGET_NUMBER} war gefordert.</p>
            <button onClick={resetGame} style={{ padding: '12px 24px', fontSize: '18px', background: 'white', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Neustart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
