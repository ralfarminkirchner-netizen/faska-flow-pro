import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { KeyboardControls, useKeyboardControls, Text, Sky } from '@react-three/drei';
import * as THREE from 'three';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
];

function Player() {
  const rigidBody = useRef();
  const meshGroup = useRef();
  const [, get] = useKeyboardControls();
  const jumpPressed = useRef(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);

  useEffect(() => {
    const handleShake = () => setShakeIntensity(0.8);
    window.addEventListener('faska-shake', handleShake);
    return () => window.removeEventListener('faska-shake', handleShake);
  }, []);

  useFrame((state, delta) => {
    if (!rigidBody.current) return;

    const { forward, backward, left, right, jump } = get();
    const velocity = rigidBody.current.linvel();
    const position = rigidBody.current.translation();

    // Movement
    const moveSpeed = 8;
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
    const sideVector = new THREE.Vector3((left ? 1 : 0) - (right ? 1 : 0), 0, 0);

    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(moveSpeed);

    // Apply movement (keep current y velocity)
    rigidBody.current.setLinvel({ x: -direction.x, y: velocity.y, z: -direction.z }, true);

    // Visual tilting
    if (meshGroup.current) {
      meshGroup.current.rotation.z = THREE.MathUtils.lerp(meshGroup.current.rotation.z, -direction.x * 0.04, 0.15);
      meshGroup.current.rotation.x = THREE.MathUtils.lerp(meshGroup.current.rotation.x, direction.z * 0.04, 0.15);
    }

    // Jumping
    const isGrounded = Math.abs(velocity.y) < 0.1;
    if (jump && isGrounded && !jumpPressed.current) {
      rigidBody.current.setLinvel({ x: velocity.x, y: 14, z: velocity.z }, true);
      jumpPressed.current = true;
    }
    if (!jump && isGrounded) {
      jumpPressed.current = false;
    }

    // Camera Follow
    const targetCameraPos = new THREE.Vector3(position.x, position.y + 4, position.z + 12);
    
    if (shakeIntensity > 0) {
      targetCameraPos.x += (Math.random() - 0.5) * shakeIntensity;
      targetCameraPos.y += (Math.random() - 0.5) * shakeIntensity;
      targetCameraPos.z += (Math.random() - 0.5) * shakeIntensity;
      setShakeIntensity(prev => Math.max(0, prev - delta * 3));
    }

    state.camera.position.lerp(targetCameraPos, 0.1);
    state.camera.lookAt(position.x, position.y + 1, position.z);

    // Fall out of bounds reset
    if (position.y < -15) {
      rigidBody.current.setTranslation({ x: 0, y: 5, z: 0 }, true);
      rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      window.dispatchEvent(new Event('faska-shake'));
    }
  });

  return (
    <RigidBody 
      ref={rigidBody} 
      colliders="capsule" 
      mass={1} 
      type="dynamic" 
      position={[0, 5, 0]} 
      enabledRotations={[false, false, false]}
      name="player"
    >
      <group ref={meshGroup}>
        <mesh castShadow>
          <capsuleGeometry args={[0.5, 1, 4, 16]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} /> {/* Mario Red! */}
        </mesh>
        {/* Simple face / eyes for character */}
        <mesh position={[-0.2, 0.3, -0.45]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0.2, 0.3, -0.45]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>
    </RigidBody>
  );
}

function Level() {
  return (
    <>
      {/* Ground */}
      <RigidBody type="fixed" position={[0, -0.5, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[30, 1, 30]} />
          <meshStandardMaterial color="#4ade80" />
        </mesh>
      </RigidBody>

      {/* Center pedestal */}
      <RigidBody type="fixed" position={[0, 1, 0]}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[3, 3, 2, 16]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      </RigidBody>

      {/* Platforms */}
      <RigidBody type="fixed" position={[-8, 3, -6]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[4, 1, 4]} />
          <meshStandardMaterial color="#fb923c" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" position={[0, 5, -12]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[4, 1, 4]} />
          <meshStandardMaterial color="#fb923c" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" position={[8, 3, -6]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[4, 1, 4]} />
          <meshStandardMaterial color="#fb923c" />
        </mesh>
      </RigidBody>
    </>
  );
}

function Star({ position, text, isCorrect, onHit }) {
  const ref = useRef();
  const [collected, setCollected] = useState(false);

  useFrame((state) => {
    if (ref.current && !collected) {
      ref.current.rotation.y += 0.02;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3 + position[0]) * 0.3;
    }
  });

  if (collected) return null;

  return (
    <RigidBody 
      type="fixed" 
      colliders="cuboid" 
      position={position} 
      sensor 
      onIntersectionEnter={(payload) => {
        if (payload.other.rigidBodyObject?.name === 'player') {
          setCollected(true);
          onHit(isCorrect, position);
          // Respawn star after a while so user can try again or see it again
          setTimeout(() => setCollected(false), 5000);
        }
      }}
    >
      <group ref={ref}>
        <mesh castShadow>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial 
            color={isCorrect ? "#fef08a" : "#e2e8f0"} 
            emissive={isCorrect ? "#ca8a04" : "#64748b"} 
            emissiveIntensity={0.6} 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <Text 
          position={[0, 1.2, 0]} 
          fontSize={0.6} 
          color="white" 
          outlineWidth={0.06} 
          outlineColor="black"
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
      </group>
    </RigidBody>
  );
}

function ParticleBurst({ position, color }) {
  const groupRef = useRef();
  
  const [particleData] = useState(() => {
    return Array.from({ length: 40 }).map(() => ({
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.2) * 20,
        (Math.random() - 0.5) * 20
      ),
      scale: Math.random() * 0.6 + 0.2
    }));
  });

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((mesh, i) => {
        const pd = particleData[i];
        mesh.position.add(pd.velocity.clone().multiplyScalar(delta));
        mesh.material.opacity = Math.max(0, mesh.material.opacity - delta * 1.5);
        if (mesh.scale.x > 0.01) {
          mesh.scale.setScalar(mesh.scale.x * 0.92);
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {particleData.map((pd, i) => (
        <mesh key={i} scale={pd.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={color} transparent opacity={1} />
        </mesh>
      ))}
    </group>
  );
}

function HUD({ question, message, onExit }) {
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '30px',
      boxSizing: 'border-box',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ pointerEvents: 'auto', flex: 1, textAlign: 'center' }}>
          <h1 style={{ 
            color: 'white', 
            textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
            fontFamily: 'system-ui, sans-serif',
            margin: '0 0 10px 0',
            fontSize: '2.5rem'
          }}>
            {question}
          </h1>
          {message && (
            <h2 style={{
              color: message.includes('Richtig') ? '#4ade80' : '#f87171',
              textShadow: '2px 2px 0 #000',
              fontFamily: 'system-ui, sans-serif',
              margin: 0,
              fontSize: '1.8rem',
              animation: 'popIn 0.3s ease-out'
            }}>
              {message}
            </h2>
          )}
        </div>
        <button 
          onClick={onExit}
          style={{
            pointerEvents: 'auto',
            padding: '12px 24px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            backgroundColor: '#ef4444',
            color: 'white',
            border: '3px solid #7f1d1d',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 6px 0 #7f1d1d, 0 10px 10px rgba(0,0,0,0.3)',
            transition: 'transform 0.1s, box-shadow 0.1s',
            fontFamily: 'system-ui, sans-serif'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(6px)';
            e.currentTarget.style.boxShadow = '0 0px 0 #7f1d1d, 0 4px 4px rgba(0,0,0,0.3)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 0 #7f1d1d, 0 10px 10px rgba(0,0,0,0.3)';
          }}
        >
          Beenden
        </button>
      </div>
      
      <div style={{
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        textShadow: '2px 2px 0 #000',
        fontSize: '1.2rem',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: '15px',
        borderRadius: '10px',
        alignSelf: 'flex-start'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Steuerung</h3>
        <p style={{ margin: '5px 0' }}>🏃 <b>WASD / Pfeile</b> - Bewegen</p>
        <p style={{ margin: '5px 0' }}>⬆️ <b>Leertaste</b> - Springen</p>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function FaskaMario64({ onExit }) {
  const [message, setMessage] = useState('');
  const [particles, setParticles] = useState([]);

  const handleHit = (isCorrect, position) => {
    if (isCorrect) {
      setMessage('Richtig! Paris ist die Hauptstadt von Frankreich.');
      addParticles(position, '#fbbf24'); // gold
    } else {
      setMessage('Falsch! Versuche es nochmal.');
      addParticles(position, '#ef4444'); // red
      window.dispatchEvent(new Event('faska-shake'));
    }
    setTimeout(() => setMessage(''), 4000);
  };

  const addParticles = (position, color) => {
    const id = Date.now() + Math.random();
    setParticles(p => [...p, { id, position, color }]);
    setTimeout(() => setParticles(p => p.filter(x => x.id !== id)), 2000);
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', backgroundColor: '#87CEEB', overflow: 'hidden' }}>
      <HUD 
        question="Was ist die Hauptstadt von Frankreich?" 
        message={message} 
        onExit={onExit} 
      />
      
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows camera={{ fov: 60, position: [0, 5, 10] }}>
          <color attach="background" args={['#87CEEB']} />
          <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
          <ambientLight intensity={0.6} />
          <directionalLight 
            castShadow 
            position={[10, 20, 15]} 
            intensity={1.5} 
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            shadow-bias={-0.0001}
          />

          <Physics gravity={[0, -25, 0]}>
            <Level />
            <Player />
            
            {/* Stars on platforms */}
            <Star position={[-8, 4.5, -6]} text="A: Berlin" isCorrect={false} onHit={handleHit} />
            <Star position={[0, 6.5, -12]} text="B: Paris" isCorrect={true} onHit={handleHit} />
            <Star position={[8, 4.5, -6]} text="C: London" isCorrect={false} onHit={handleHit} />
          </Physics>

          {particles.map(p => (
            <ParticleBurst key={p.id} position={p.position} color={p.color} />
          ))}
        </Canvas>
      </KeyboardControls>
    </div>
  );
}
