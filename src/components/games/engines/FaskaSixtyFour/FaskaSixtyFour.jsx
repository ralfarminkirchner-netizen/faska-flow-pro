import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, Text } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

// --- Constants & Data ---
const CONTINENTS = [
  { name: 'Africa', color: '#ffcc00', pos: [10, 5, -10] },
  { name: 'Antarctica', color: '#ffffff', pos: [-15, 2, -20] },
  { name: 'Asia', color: '#ff3333', pos: [20, 8, -5] },
  { name: 'Australia', color: '#cc66ff', pos: [25, 4, 15] },
  { name: 'Europe', color: '#3366ff', pos: [5, 12, 10] },
  { name: 'North America', color: '#33cc33', pos: [-10, 6, 15] },
  { name: 'South America', color: '#ff9933', pos: [-5, 3, 25] },
];

// --- Input Hook ---
function usePlayerControls() {
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false, jump: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': setMovement((m) => ({ ...m, forward: true })); break;
        case 'KeyS': case 'ArrowDown': setMovement((m) => ({ ...m, backward: true })); break;
        case 'KeyA': case 'ArrowLeft': setMovement((m) => ({ ...m, left: true })); break;
        case 'KeyD': case 'ArrowRight': setMovement((m) => ({ ...m, right: true })); break;
        case 'Space': setMovement((m) => ({ ...m, jump: true })); break;
        default: break;
      }
    };
    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': setMovement((m) => ({ ...m, forward: false })); break;
        case 'KeyS': case 'ArrowDown': setMovement((m) => ({ ...m, backward: false })); break;
        case 'KeyA': case 'ArrowLeft': setMovement((m) => ({ ...m, left: false })); break;
        case 'KeyD': case 'ArrowRight': setMovement((m) => ({ ...m, right: false })); break;
        case 'Space': setMovement((m) => ({ ...m, jump: false })); break;
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

// --- Player Component ---
function Player() {
  const rigidBody = useRef();
  const { forward, backward, left, right, jump } = usePlayerControls();
  const { camera } = useThree();
  
  // Jump state
  const jumpState = useRef({
    isGrounded: true,
    jumpCount: 0,
    lastLandedTime: 0,
    jumpPressed: false
  });

  const speed = 10;
  const jumpForce = [10, 14, 18]; // Single, Double, Triple jump forces

  useFrame((state) => {
    if (!rigidBody.current) return;

    const t = state.clock.getElapsedTime();
    const position = rigidBody.current.translation();
    const velocity = rigidBody.current.linvel();

    // Movement
    const frontVector = new THREE.Vector3(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
    const sideVector = new THREE.Vector3((left ? 1 : 0) - (right ? 1 : 0), 0, 0);
    
    const direction = new THREE.Vector3();
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed);
    
    // Camera follow (3rd person)
    const cameraOffset = new THREE.Vector3(0, 5, 10);
    const targetCameraPos = new THREE.Vector3(position.x, position.y, position.z).add(cameraOffset);
    
    camera.position.lerp(targetCameraPos, 0.1);
    camera.lookAt(position.x, position.y + 1, position.z);

    // Apply horizontal movement (keep vertical velocity)
    rigidBody.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

    // Simple grounded check: y velocity near 0
    const isGrounded = Math.abs(velocity.y) < 0.1;
    
    if (isGrounded && !jumpState.current.isGrounded) {
      jumpState.current.isGrounded = true;
      jumpState.current.lastLandedTime = t;
    } else if (!isGrounded) {
      jumpState.current.isGrounded = false;
    }

    // Reset jump count if grounded for too long
    if (jumpState.current.isGrounded && t - jumpState.current.lastLandedTime > 0.3) {
      jumpState.current.jumpCount = 0;
    }

    // Handle Jump
    if (jump && !jumpState.current.jumpPressed && jumpState.current.isGrounded) {
      const jCount = jumpState.current.jumpCount;
      const force = jumpForce[Math.min(jCount, 2)];
      
      rigidBody.current.setLinvel({ x: velocity.x, y: force, z: velocity.z }, true);
      
      jumpState.current.jumpCount++;
      jumpState.current.isGrounded = false;
      jumpState.current.jumpPressed = true;
    }
    
    if (!jump) {
      jumpState.current.jumpPressed = false;
    }
    
    // Death plane (falling off)
    if (position.y < -20) {
      rigidBody.current.setTranslation({ x: 0, y: 10, z: 0 }, true);
      rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  return (
    <RigidBody ref={rigidBody} colliders="capsule" mass={1} type="dynamic" position={[0, 5, 0]} enabledRotations={[false, false, false]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      {/* Eyes to show direction */}
      <mesh position={[0.2, 0.5, -0.4]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.2, 0.5, -0.4]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </RigidBody>
  );
}

// --- Environment & Platforms ---
function Platform({ position, args, color = 'green' }) {
  return (
    <RigidBody type="fixed" position={position}>
      <mesh receiveShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}

function Level() {
  return (
    <>
      {/* Main Island */}
      <Platform position={[0, 0, 0]} args={[15, 2, 15]} color="#4caf50" />
      
      {/* Floating Islands */}
      <Platform position={[10, 3, -10]} args={[5, 1, 5]} color="#8bc34a" />
      <Platform position={[-15, 0, -20]} args={[8, 1, 8]} color="#cddc39" />
      <Platform position={[20, 6, -5]} args={[4, 1, 4]} color="#ffeb3b" />
      <Platform position={[25, 2, 15]} args={[6, 1, 6]} color="#ffc107" />
      <Platform position={[5, 10, 10]} args={[4, 1, 4]} color="#ff9800" />
      <Platform position={[-10, 4, 15]} args={[5, 1, 5]} color="#ff5722" />
      <Platform position={[-5, 1, 25]} args={[6, 1, 6]} color="#795548" />
      
      {/* Connecting steps */}
      <Platform position={[5, 1, -5]} args={[2, 0.5, 2]} color="#9e9e9e" />
      <Platform position={[15, 4.5, -7]} args={[2, 0.5, 2]} color="#9e9e9e" />
      <Platform position={[-8, 2, -5]} args={[2, 0.5, 2]} color="#9e9e9e" />
      <Platform position={[2, 6, 5]} args={[2, 0.5, 2]} color="#9e9e9e" />
    </>
  );
}

// --- Collectible ---
function Star({ continent, onCollect }) {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.05;
      // Animate up and down locally relative to original pos
    }
  });

  return (
    <group position={continent.pos}>
      {/* We separate visual and physics so rotation doesn't mess with sensor position too weirdly */}
      <RigidBody type="fixed" colliders="ball" sensor onIntersectionEnter={() => onCollect(continent.name)}>
        <mesh ref={ref} castShadow>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color={continent.color} emissive={continent.color} emissiveIntensity={0.5} wireframe />
          <Text position={[0, 1.5, 0]} fontSize={0.5} color="white" outlineWidth={0.05} outlineColor="black">
            {continent.name}
          </Text>
        </mesh>
      </RigidBody>
    </group>
  );
}

// --- Main Game Component ---
export default function FaskaSixtyFour({ onExit }) {
  const [collected, setCollected] = useState([]);

  const handleCollect = (name) => {
    if (!collected.includes(name)) {
      setCollected(prev => [...prev, name]);
    }
  };

  const isWin = collected.length === CONTINENTS.length;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#87CEEB', overflow: 'hidden' }}>
      
      {/* UI Overlay */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, color: 'white', fontFamily: 'sans-serif', textShadow: '1px 1px 2px black', pointerEvents: 'none' }}>
        <h1 style={{ margin: 0 }}>Faska 64</h1>
        <p style={{ margin: '5px 0' }}>WASD / Arrows to Move | SPACE to Jump (Try Triple Jump!)</p>
        <p style={{ margin: '5px 0' }}>Find all 7 continents!</p>
        <h3>Collected: {collected.length} / {CONTINENTS.length}</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {CONTINENTS.map(c => (
            <li key={c.name} style={{ color: collected.includes(c.name) ? c.color : '#aaa', fontWeight: 'bold' }}>
              {collected.includes(c.name) ? '✓ ' : '○ '} {c.name}
            </li>
          ))}
        </ul>
      </div>

      {isWin && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, textAlign: 'center', color: 'white', textShadow: '2px 2px 4px black', pointerEvents: 'none' }}>
          <h1 style={{ fontSize: '4rem', margin: 0, color: '#ffcc00' }}>YOU WIN!</h1>
          <p style={{ fontSize: '1.5rem' }}>All Continents Discovered!</p>
        </div>
      )}

      {/* Exit Button */}
      <button 
        onClick={onExit}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10,
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}
      >
        Beenden
      </button>

      <Canvas shadows camera={{ fov: 60 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} castShadow intensity={1} shadow-mapSize={[2048, 2048]}>
          <orthographicCamera attach="shadow-camera" args={[-30, 30, 30, -30, 0.1, 100]} />
        </directionalLight>

        <Physics gravity={[0, -20, 0]}>
          <Level />
          <Player />
          
          {CONTINENTS.map(continent => (
            !collected.includes(continent.name) && (
              <Star key={continent.name} continent={continent} onCollect={handleCollect} />
            )
          ))}
        </Physics>
      </Canvas>
    </div>
  );
}
