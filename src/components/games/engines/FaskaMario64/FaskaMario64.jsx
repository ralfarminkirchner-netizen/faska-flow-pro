import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Text, Sky, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const useKeys = () => {
  const keys = useRef({ forward: false, backward: false, left: false, right: false, jump: false });
  useEffect(() => {
    const down = (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.current.forward = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.current.backward = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.current.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.current.right = true;
      if (e.code === 'Space') keys.current.jump = true;
    };
    const up = (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.current.forward = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.current.backward = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.current.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.current.right = false;
      if (e.code === 'Space') keys.current.jump = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);
  return keys;
};

function Player({ keys }) {
  const rigidBody = useRef();
  const meshGroup = useRef();
  const jumpPressed = useRef(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);

  useEffect(() => {
    const handleShake = () => setShakeIntensity(0.8);
    window.addEventListener('faska-shake', handleShake);
    return () => window.removeEventListener('faska-shake', handleShake);
  }, []);

  useFrame((state, delta) => {
    if (!rigidBody.current) return;

    const { forward, backward, left, right, jump } = keys.current;
    const velocity = rigidBody.current.linvel();
    const position = rigidBody.current.translation();

    // Movement
    const moveSpeed = 10;
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
    const sideVector = new THREE.Vector3((left ? 1 : 0) - (right ? 1 : 0), 0, 0);

    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(moveSpeed);

    // Apply movement (keep current y velocity)
    rigidBody.current.setLinvel({ x: -direction.x, y: velocity.y, z: -direction.z }, true);

    // Visual tilting & rotation
    if (meshGroup.current) {
      if (direction.lengthSq() > 0.1) {
        const targetAngle = Math.atan2(-direction.x, -direction.z);
        // Smooth rotation
        let currentAngle = meshGroup.current.rotation.y;
        // Handle wraparound
        while (targetAngle - currentAngle > Math.PI) currentAngle += Math.PI * 2;
        while (targetAngle - currentAngle < -Math.PI) currentAngle -= Math.PI * 2;
        
        meshGroup.current.rotation.y = THREE.MathUtils.lerp(currentAngle, targetAngle, 10 * delta);
        
        // Tilt while running
        meshGroup.current.rotation.x = THREE.MathUtils.lerp(meshGroup.current.rotation.x, 0.2, 5 * delta);
      } else {
        meshGroup.current.rotation.x = THREE.MathUtils.lerp(meshGroup.current.rotation.x, 0, 5 * delta);
      }
    }

    // Jumping
    const isGrounded = Math.abs(velocity.y) < 0.1;
    if (jump && isGrounded && !jumpPressed.current) {
      rigidBody.current.setLinvel({ x: velocity.x, y: 18, z: velocity.z }, true);
      jumpPressed.current = true;
    }
    if (!jump && isGrounded) {
      jumpPressed.current = false;
    }

    // Camera Follow
    const targetCameraPos = new THREE.Vector3(position.x, position.y + 6, position.z + 16);
    
    if (shakeIntensity > 0) {
      targetCameraPos.x += (Math.random() - 0.5) * shakeIntensity;
      targetCameraPos.y += (Math.random() - 0.5) * shakeIntensity;
      targetCameraPos.z += (Math.random() - 0.5) * shakeIntensity;
      setShakeIntensity(prev => Math.max(0, prev - delta * 3));
    }

    state.camera.position.lerp(targetCameraPos, 5 * delta);
    state.camera.lookAt(position.x, position.y + 2, position.z);

    // Fall out of bounds reset
    if (position.y < -20) {
      rigidBody.current.setTranslation({ x: 0, y: 10, z: 0 }, true);
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
      position={[0, 10, 0]} 
      enabledRotations={[false, false, false]}
      name="player"
    >
      <group ref={meshGroup} position={[0, -0.5, 0]}>
        {/* Character Body */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#ffccaa" />
        </mesh>
        {/* Cap */}
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
        <mesh position={[0, 1.9, 0.3]} castShadow>
          <boxGeometry args={[0.6, 0.1, 0.4]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
      </group>
    </RigidBody>
  );
}

function Level() {
  const [grassTex, wallTex] = useTexture(['/textures/grass_platform.png', '/textures/castle_wall.png']);
  grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping;
  grassTex.repeat.set(4, 4);
  wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping;
  wallTex.repeat.set(2, 2);

  return (
    <group>
      {/* Ground */}
      <RigidBody type="fixed" position={[0, -0.5, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[40, 1, 40]} />
          <meshStandardMaterial map={grassTex} color="#4ade80" />
        </mesh>
      </RigidBody>

      {/* Center pedestal / Castle base */}
      <RigidBody type="fixed" position={[0, 2, 0]}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[5, 6, 4, 32]} />
          <meshStandardMaterial map={wallTex} />
        </mesh>
      </RigidBody>

      {/* Platforms */}
      <RigidBody type="fixed" position={[-12, 5, -8]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[6, 1, 6]} />
          <meshStandardMaterial map={grassTex} color="#fb923c" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" position={[0, 8, -16]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[6, 1, 6]} />
          <meshStandardMaterial map={grassTex} color="#fb923c" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" position={[12, 5, -8]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[6, 1, 6]} />
          <meshStandardMaterial map={grassTex} color="#fb923c" />
        </mesh>
      </RigidBody>
    </group>
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
          setTimeout(() => setCollected(false), 5000);
        }
      }}
    >
      <group ref={ref}>
        <mesh castShadow>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={isCorrect ? "#fef08a" : "#e2e8f0"} emissive={isCorrect ? "#ca8a04" : "#64748b"} emissiveIntensity={0.6} metalness={0.8} roughness={0.2} />
        </mesh>
        <Text position={[0, 1.8, 0]} fontSize={1} color="white" outlineWidth={0.1} outlineColor="black" anchorX="center" anchorY="middle" fontWeight="bold">
          {text}
        </Text>
      </group>
    </RigidBody>
  );
}

function ParticleBurst({ position, color }) {
  const groupRef = useRef();
  const [particleData] = useState(() => Array.from({ length: 40 }).map(() => ({
    velocity: new THREE.Vector3((Math.random() - 0.5) * 20, (Math.random() - 0.2) * 20, (Math.random() - 0.5) * 20),
    scale: Math.random() * 0.6 + 0.2
  })));

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((mesh, i) => {
        const pd = particleData[i];
        mesh.position.addScaledVector(pd.velocity, delta);
        mesh.material.opacity = Math.max(0, mesh.material.opacity - delta * 1.5);
        if (mesh.scale.x > 0.01) mesh.scale.setScalar(mesh.scale.x * 0.92);
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

const HUD = ({ question, message, onExit }) => (
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '30px', boxSizing: 'border-box', zIndex: 10 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ pointerEvents: 'auto', flex: 1, textAlign: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.9)', padding: '20px', borderRadius: '20px', border: '5px solid #3498db', display: 'inline-block', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
          <h1 style={{ color: '#2c3e50', fontFamily: 'Impact, sans-serif', margin: '0', fontSize: '3rem' }}>{question}</h1>
        </div>
        {message && (
          <h2 style={{ color: message.includes('Richtig') ? '#2ecc71' : '#e74c3c', textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000', fontFamily: 'Impact, sans-serif', margin: '20px 0 0 0', fontSize: '4rem', animation: 'popIn 0.3s ease-out' }}>
            {message}
          </h2>
        )}
      </div>
      <button 
        onClick={onExit}
        style={{ pointerEvents: 'auto', padding: '15px 30px', fontSize: '1.5rem', fontWeight: 'bold', backgroundColor: '#e74c3c', color: 'white', border: '4px solid #c0392b', borderRadius: '15px', cursor: 'pointer', boxShadow: '0 8px 0 #c0392b', transition: 'transform 0.1s', fontFamily: 'Impact, sans-serif' }}
        onMouseDown={e => { e.currentTarget.style.transform = 'translateY(8px)'; e.currentTarget.style.boxShadow = '0 0px 0 #c0392b'; }}
        onMouseUp={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 0 #c0392b'; }}
      >BEENDEN</button>
    </div>
    <div style={{ color: 'white', fontFamily: 'Impact, sans-serif', textShadow: '2px 2px 0 #000', fontSize: '1.5rem', alignSelf: 'flex-start' }}>
      <p style={{ margin: '5px 0' }}>🏃 <b>WASD</b> - Bewegen</p>
      <p style={{ margin: '5px 0' }}>⬆️ <b>Leertaste</b> - Springen</p>
    </div>
    <style>{`@keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }`}</style>
  </div>
);

export default function FaskaMario64({ onExit }) {
  const [message, setMessage] = useState('');
  const [particles, setParticles] = useState([]);
  const keys = useKeys();

  const handleHit = (isCorrect, position) => {
    if (isCorrect) {
      setMessage('Richtig! Paris ist die Hauptstadt von Frankreich.');
      addParticles(position, '#fbbf24');
    } else {
      setMessage('Falsch! Versuche es nochmal.');
      addParticles(position, '#ef4444');
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
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, backgroundColor: '#87CEEB', overflow: 'hidden' }}>
      <HUD question="Was ist die Hauptstadt von Frankreich?" message={message} onExit={onExit} />
      
      <Canvas shadows camera={{ fov: 60, position: [0, 10, 15] }}>
        <color attach="background" args={['#87CEEB']} />
        <Sky sunPosition={[100, 20, 100]} turbidity={0.1} />
        <ambientLight intensity={0.6} />
        <directionalLight castShadow position={[10, 30, 15]} intensity={1.5} shadow-mapSize={[2048, 2048]} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={25} shadow-camera-bottom={-25} />

        <Suspense fallback={null}>
          <Physics gravity={[0, -35, 0]}>
            <Level />
            <Player keys={keys} />
            
            <Star position={[-12, 7, -8]} text="A: Berlin" isCorrect={false} onHit={handleHit} />
            <Star position={[0, 10, -16]} text="B: Paris" isCorrect={true} onHit={handleHit} />
            <Star position={[12, 7, -8]} text="C: London" isCorrect={false} onHit={handleHit} />
          </Physics>
        </Suspense>

        {particles.map(p => <ParticleBurst key={p.id} position={p.position} color={p.color} />)}
      </Canvas>
    </div>
  );
}
