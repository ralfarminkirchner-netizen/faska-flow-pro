import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { create } from 'zustand';

// --- Data ---
const facts = [
  { text: "French Revolution began", correct: "1789", options: ["1776", "1789", "1812"] },
  { text: "First Moon Landing", correct: "1969", options: ["1957", "1969", "1972"] },
  { text: "End of World War II", correct: "1945", options: ["1939", "1918", "1945"] },
  { text: "Fall of the Berlin Wall", correct: "1989", options: ["1991", "1986", "1989"] },
  { text: "Invention of Printing Press", correct: "1440", options: ["1350", "1440", "1520"] },
  { text: "Columbus reached America", correct: "1492", options: ["1492", "1504", "1420"] },
  { text: "Magna Carta signed", correct: "1215", options: ["1180", "1215", "1250"] },
  { text: "Wright Brothers First Flight", correct: "1903", options: ["1898", "1903", "1910"] },
  { text: "Chernobyl Disaster", correct: "1986", options: ["1981", "1986", "1990"] },
  { text: "Sinking of the Titanic", correct: "1912", options: ["1905", "1912", "1920"] },
];

// --- Store ---
const useStore = create((set) => ({
  score: 0,
  currentFactIndex: 0,
  targetZ: -300,
  hitEvent: null, // { time, type: 'correct'|'wrong', pos: [x,y,z] }
  incScore: (pos) => set((state) => ({ score: state.score + 100, hitEvent: { time: Date.now(), type: 'correct', pos } })),
  wrongAnswer: (pos) => set((state) => ({ hitEvent: { time: Date.now(), type: 'wrong', pos } })),
  nextFact: (playerZ) => set((state) => ({
    currentFactIndex: (state.currentFactIndex + 1) % facts.length,
    targetZ: playerZ - 500,
  })),
  reset: () => set({ score: 0, currentFactIndex: 0, targetZ: -300, hitEvent: null })
}));

// --- Utils ---
function getTrackCenter(z) {
  return Math.sin(z / 150) * 80 + Math.sin(z / 300) * 60;
}

function useKeys() {
  const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false, space: false });
  useEffect(() => {
    const handleKeyDown = (e) => {
      const code = e.code;
      if(code === 'KeyW' || code === 'ArrowUp') setKeys(k => ({...k, w: true}));
      if(code === 'KeyA' || code === 'ArrowLeft') setKeys(k => ({...k, a: true}));
      if(code === 'KeyS' || code === 'ArrowDown') setKeys(k => ({...k, s: true}));
      if(code === 'KeyD' || code === 'ArrowRight') setKeys(k => ({...k, d: true}));
      if(code === 'Space') setKeys(k => ({...k, space: true}));
    };
    const handleKeyUp = (e) => {
      const code = e.code;
      if(code === 'KeyW' || code === 'ArrowUp') setKeys(k => ({...k, w: false}));
      if(code === 'KeyA' || code === 'ArrowLeft') setKeys(k => ({...k, a: false}));
      if(code === 'KeyS' || code === 'ArrowDown') setKeys(k => ({...k, s: false}));
      if(code === 'KeyD' || code === 'ArrowRight') setKeys(k => ({...k, d: false}));
      if(code === 'Space') setKeys(k => ({...k, space: false}));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  return keys;
}

// --- Components ---
function Ground({ playerPos }) {
  const gridRef = useRef();
  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.position.x = Math.floor(playerPos.current.x / 10) * 10;
      gridRef.current.position.z = Math.floor(playerPos.current.z / 10) * 10;
    }
  });
  return (
    <gridHelper ref={gridRef} args={[1000, 100, '#ff00ff', '#001133']} position={[0, -0.1, 0]} />
  );
}

function EdgeMarkers({ playerPos }) {
  const count = 150;
  const spacing = 10;
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    const startZ = Math.floor(playerPos.current.z / spacing) * spacing;
    
    for (let i = 0; i < count; i++) {
      const z = startZ - i * spacing + 300; 
      const x = getTrackCenter(z);
      
      // Left
      dummy.position.set(x - 30, 0.5, z);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i * 2, dummy.matrix);
      
      // Right
      dummy.position.set(x + 30, 0.5, z);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i * 2 + 1, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count * 2]}>
      <boxGeometry args={[1, 1, 6]} />
      <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
    </instancedMesh>
  );
}

function Environment({ playerPos }) {
  const count = 100;
  const range = 1500;
  
  const buildings = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 200 + 100),
      yScale: Math.random() * 80 + 30,
      zOffset: Math.random() * range,
      scaleX: Math.random() * 25 + 10,
      scaleZ: Math.random() * 25 + 10,
      color: Math.random() > 0.5 ? new THREE.Color('#ff00ff') : new THREE.Color('#00ffff')
    }));
  }, []);
  
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    buildings.forEach((b, i) => {
      let z = (b.zOffset + (playerPos.current.z % range));
      if (z > playerPos.current.z + 300) z -= range;
      if (z < playerPos.current.z - range + 300) z += range;
      
      dummy.position.set(b.x, b.yScale / 2, z);
      dummy.scale.set(b.scaleX, b.yScale, b.scaleZ);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, b.color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial wireframe={true} emissive="#ffffff" emissiveIntensity={0.2} color="#ffffff" />
    </instancedMesh>
  );
}

function Car({ playerPos }) {
  const keys = useKeys();
  const velocity = useRef(new THREE.Vector2(0, -50)); 
  const heading = useRef(0);
  const carRef = useRef();
  
  const hitEvent = useStore(state => state.hitEvent);
  const screenShake = useRef(0);

  useEffect(() => {
    if (hitEvent) {
      if (hitEvent.type === 'wrong') {
        screenShake.current = 1.0;
        velocity.current.multiplyScalar(0.4); 
      } else {
        const currentDir = velocity.current.clone().normalize();
        const speed = velocity.current.length();
        velocity.current.copy(currentDir).multiplyScalar(Math.max(speed + 50, 100));
      }
    }
  }, [hitEvent]);
  
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    
    const isDrifting = keys.space;
    const turnAmount = (keys.a ? 1 : 0) - (keys.d ? 1 : 0);
    heading.current += turnAmount * (isDrifting ? 3.0 : 1.5) * dt;
    
    const forward = new THREE.Vector2(-Math.sin(heading.current), -Math.cos(heading.current));
    
    if (keys.w) velocity.current.add(forward.clone().multiplyScalar(150 * dt));
    else if (keys.s) velocity.current.sub(forward.clone().multiplyScalar(80 * dt));
    
    const xCenter = getTrackCenter(playerPos.current.z);
    const distFromCenter = Math.abs(playerPos.current.x - xCenter);
    const isOnTrack = distFromCenter < 30;
    
    const friction = isOnTrack ? 0.98 : 0.90;
    velocity.current.multiplyScalar(friction);
    
    const currentSpeed = velocity.current.length();
    if (currentSpeed > 250) velocity.current.multiplyScalar(250 / currentSpeed);
    
    const currentDir = velocity.current.clone().normalize();
    if (currentSpeed > 0.1) {
      const grip = isDrifting ? 0.02 : 0.15; 
      const newDir = currentDir.lerp(forward, grip).normalize();
      velocity.current.copy(newDir).multiplyScalar(currentSpeed);
    }
    
    playerPos.current.x += velocity.current.x * dt;
    playerPos.current.z += velocity.current.y * dt;
    
    if (carRef.current) {
      carRef.current.position.set(playerPos.current.x, 0, playerPos.current.z);
      carRef.current.rotation.y = heading.current;
      carRef.current.rotation.z = turnAmount * 0.1;
    }
    
    const back = forward.clone().multiplyScalar(-15);
    const cameraOffset = new THREE.Vector3(back.x, 7, back.y);
    const targetCamPos = playerPos.current.clone().add(cameraOffset);
    
    if (screenShake.current > 0) {
      targetCamPos.x += (Math.random() - 0.5) * screenShake.current * 4;
      targetCamPos.y += (Math.random() - 0.5) * screenShake.current * 4;
      screenShake.current -= dt * 3;
    }
    
    state.camera.position.lerp(targetCamPos, 0.1);
    
    const lookDir = currentSpeed > 10 ? velocity.current.clone().normalize() : forward;
    const lookAtPoint = playerPos.current.clone().add(new THREE.Vector3(lookDir.x * 30, -2, lookDir.y * 30));
    state.camera.lookAt(lookAtPoint);
  });
  
  return (
    <group ref={carRef}>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2.2, 1, 4.5]} />
        <meshStandardMaterial color="#ff00ff" emissive="#aa00aa" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 1.5, 0.5]}>
        <boxGeometry args={[1.8, 0.8, 2]} />
        <meshStandardMaterial color="#00ffff" emissive="#00aaaa" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[-0.8, 0.8, -2.3]}>
        <boxGeometry args={[0.5, 0.3, 0.1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.8, 0.8, -2.3]}>
        <boxGeometry args={[0.5, 0.3, 0.1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.8, 0.8, 2.3]}>
        <boxGeometry args={[0.5, 0.3, 0.1]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0.8, 0.8, 2.3]}>
        <boxGeometry args={[0.5, 0.3, 0.1]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      {[-1, 1].map((x) => 
        [-1.4, 1.4].map((z) => (
          <mesh key={`${x}-${z}`} position={[x * 1.3, 0.4, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.5, 0.5, 0.4, 16]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
        ))
      )}
    </group>
  );
}

function Token({ option, position }) {
  const meshRef = useRef();
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
      meshRef.current.rotation.x += delta * 0.5;
    }
    if (groupRef.current) {
      groupRef.current.position.y = 3 + Math.sin(state.clock.elapsedTime * 3 + position[0]) * 1;
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[6, 6, 6]} />
        <meshStandardMaterial color="#00ffff" emissive="#00aaaa" emissiveIntensity={0.5} wireframe />
      </mesh>
      <mesh>
        <boxGeometry args={[5.8, 5.8, 5.8]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <Text position={[0, 0, 3.1]} fontSize={2.5} color="#ffffff" anchorX="center" anchorY="middle">
        {option}
      </Text>
    </group>
  );
}

function Tokens({ z, playerPos }) {
  const xCenter = getTrackCenter(z);
  
  const factIndex = useStore(state => state.currentFactIndex);
  const fact = facts[factIndex];
  const nextFact = useStore(state => state.nextFact);
  const incScore = useStore(state => state.incScore);
  const wrongAnswer = useStore(state => state.wrongAnswer);
  
  const options = fact.options;
  const positions = [-20, 0, 20];
  const collidedTarget = useRef(0);
  
  useFrame(() => {
    if (playerPos.current.z < z && collidedTarget.current !== z) {
      collidedTarget.current = z;
      
      const carX = playerPos.current.x;
      let hitIndex = -1;
      for (let i = 0; i < 3; i++) {
        const tokenX = xCenter + positions[i];
        if (Math.abs(carX - tokenX) < 8) {
          hitIndex = i;
          break;
        }
      }
      
      const pos = [playerPos.current.x, playerPos.current.y, playerPos.current.z];
      if (hitIndex !== -1) {
        if (options[hitIndex] === fact.correct) {
          incScore(pos);
        } else {
          wrongAnswer(pos);
        }
      } else {
        wrongAnswer(pos);
      }
      
      nextFact(playerPos.current.z);
    }
  });
  
  return (
    <group position={[0, 0, z]}>
      {options.map((opt, i) => (
        <Token key={i} option={opt} position={[xCenter + positions[i], 0, 0]} />
      ))}
    </group>
  );
}

function Billboard({ z }) {
  const x = getTrackCenter(z);
  const x2 = getTrackCenter(z - 10);
  const angle = Math.atan2(x - x2, 10);
  
  const factIndex = useStore(state => state.currentFactIndex);
  const fact = facts[factIndex];
  
  return (
    <group position={[x, 15, z]} rotation={[0, angle, 0]}>
      <mesh position={[-15, -7.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 15]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[15, -7.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 15]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[44, 15, 2]} />
        <meshStandardMaterial color="#000" emissive="#001122" emissiveIntensity={1} />
      </mesh>
      <Text position={[0, 2, 1.1]} fontSize={3} color="#00ffff" anchorX="center" anchorY="middle" maxWidth={40} textAlign="center">
        {fact.text}
      </Text>
      <Text position={[0, -3, 1.1]} fontSize={4} color="#ffff00" anchorX="center" anchorY="middle">
        [ YEAR ]
      </Text>
    </group>
  );
}

function Particles() {
  const hitEvent = useStore(state => state.hitEvent);
  const meshRef = useRef();
  
  const particles = useRef(Array.from({ length: 60 }, () => ({
    pos: new THREE.Vector3(0, -1000, 0),
    vel: new THREE.Vector3(),
    life: 0,
    type: 'correct'
  })));
  
  useEffect(() => {
    if (hitEvent) {
      let spawned = 0;
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        if (p.life <= 0) {
          p.pos.fromArray(hitEvent.pos);
          p.vel.set((Math.random()-0.5)*50, Math.random()*30 + 10, (Math.random()-0.5)*50);
          p.life = 1.0;
          p.type = hitEvent.type;
          spawned++;
          if (spawned >= 30) break;
        }
      }
    }
  }, [hitEvent]);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorCorrect = useMemo(() => new THREE.Color("#00ff00"), []);
  const colorWrong = useMemo(() => new THREE.Color("#ff0000"), []);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.1);
    
    particles.current.forEach((p, i) => {
      if (p.life > 0) {
        p.pos.add(p.vel.clone().multiplyScalar(dt));
        p.vel.y -= 50 * dt; 
        p.life -= dt;
        
        dummy.position.copy(p.pos);
        dummy.scale.setScalar(Math.max(0, p.life));
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        meshRef.current.setColorAt(i, p.type === 'correct' ? colorCorrect : colorWrong);
      } else {
        dummy.position.set(0, -1000, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 60]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshBasicMaterial />
    </instancedMesh>
  );
}

function GameLoop() {
  const targetZ = useStore(state => state.targetZ);
  const playerPos = useRef(new THREE.Vector3(0, 0, 0));
  
  return (
    <>
      <color attach="background" args={['#00020a']} />
      <fog attach="fog" args={['#00020a', 50, 400]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[100, 200, 50]} intensity={1} />
      
      <Car playerPos={playerPos} />
      
      <Tokens z={targetZ} playerPos={playerPos} />
      <Billboard z={targetZ - 50} />
      
      <EdgeMarkers playerPos={playerPos} />
      <Environment playerPos={playerPos} />
      <Ground playerPos={playerPos} />
      <Particles />
    </>
  );
}

function ScreenFlash() {
  const hitEvent = useStore(state => state.hitEvent);
  const [flash, setFlash] = useState(null);
  
  useEffect(() => {
    if (hitEvent) {
      setFlash(hitEvent.type);
      const timer = setTimeout(() => setFlash(null), 300);
      return () => clearTimeout(timer);
    }
  }, [hitEvent]);
  
  if (!flash) return null;
  
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: flash === 'correct' ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.5)',
      pointerEvents: 'none',
      zIndex: 10
    }} />
  );
}

function UI({ onExit }) {
  const score = useStore(state => state.score);
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', padding: '20px', boxSizing: 'border-box' }}>
      <div style={{ color: '#0ff', fontSize: '36px', fontFamily: 'monospace', textShadow: '0 0 10px #0ff', fontWeight: 'bold' }}>
        SCORE: {score}
      </div>
      
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#f0f', fontSize: '18px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '8px', border: '1px solid #f0f' }}>
        <strong style={{ color: '#fff' }}>CONTROLS:</strong><br/>
        W/A/S/D or Arrows : Drive & Steer<br/>
        SPACE : Drift
      </div>
      
      <button 
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          pointerEvents: 'auto',
          padding: '10px 20px',
          fontSize: '18px',
          fontWeight: 'bold',
          backgroundColor: '#ff00ff',
          color: '#fff',
          border: '2px solid #fff',
          borderRadius: '5px',
          cursor: 'pointer',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          boxShadow: '0 0 15px #ff00ff'
        }}
      >
        Beenden
      </button>
    </div>
  );
}

export default function FaskaRidgeSwarm({ onExit }) {
  useEffect(() => {
    useStore.getState().reset();
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>
      <Canvas shadows camera={{ position: [0, 10, 20], fov: 60 }}>
        <GameLoop />
      </Canvas>
      <ScreenFlash />
      <UI onExit={onExit} />
    </div>
  );
}
