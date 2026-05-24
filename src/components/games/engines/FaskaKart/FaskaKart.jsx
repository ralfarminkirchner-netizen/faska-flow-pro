import React, { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Sky } from '@react-three/drei';
import * as THREE from 'three';

const VERBS = ['laufen', 'spielen', 'lachen', 'denken', 'lesen', 'schwimmen', 'kochen', 'tanzen', 'arbeiten', 'schreiben'];
const NOUNS = ['Hund', 'Haus', 'Baum', 'Tisch', 'Stuhl', 'Auto', 'Blume', 'Vogel', 'Katze', 'Apfel'];
const ADJECTIVES = ['schnell', 'schön', 'groß', 'klein', 'kalt', 'warm', 'hell', 'dunkel', 'stark', 'schwach'];

function generateRow(z) {
  const correctLane = Math.floor(Math.random() * 3);
  const words = [];
  for (let i = 0; i < 3; i++) {
    if (i === correctLane) {
      words.push({ text: VERBS[Math.floor(Math.random() * VERBS.length)], type: 'verb' });
    } else {
      const isNoun = Math.random() > 0.5;
      if (isNoun) {
        words.push({ text: NOUNS[Math.floor(Math.random() * NOUNS.length)], type: 'noun' });
      } else {
        words.push({ text: ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)], type: 'adjective' });
      }
    }
  }
  return { id: Math.random(), z, words, correctLane };
}

function Kart({ laneRef, playingRef }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (!playingRef.current || !meshRef.current) return;
    const targetX = laneRef.current * 4;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 10 * delta);
    
    const tilt = (meshRef.current.position.x - targetX) * 0.1;
    meshRef.current.rotation.z = tilt;
    meshRef.current.rotation.y = -tilt * 0.5;
  });

  return (
    <group ref={meshRef} position={[0, 0.5, 0]}>
      <mesh castShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[1.6, 0.8, 2.6]} />
        <meshStandardMaterial color="#FF3366" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Spoiler */}
      <mesh castShadow position={[0, 0.8, 1.1]}>
         <boxGeometry args={[1.8, 0.1, 0.4]} />
         <meshStandardMaterial color="#222" />
      </mesh>
      <mesh castShadow position={[-0.6, 0.4, 1.1]}>
         <boxGeometry args={[0.1, 0.8, 0.3]} />
         <meshStandardMaterial color="#222" />
      </mesh>
      <mesh castShadow position={[0.6, 0.4, 1.1]}>
         <boxGeometry args={[0.1, 0.8, 0.3]} />
         <meshStandardMaterial color="#222" />
      </mesh>
      {/* Wheels */}
      {[[-0.9, -0.2, 0.9], [0.9, -0.2, 0.9], [-0.9, -0.2, -0.9], [0.9, -0.2, -0.9]].map((pos, i) => (
        <mesh key={i} castShadow position={pos}>
          <cylinderGeometry args={[0.4, 0.4, 0.4, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Ground({ speedRef, playingRef }) {
  const gridRef = useRef();
  
  useFrame((state, delta) => {
    if (!playingRef.current || !gridRef.current) return;
    gridRef.current.position.z += speedRef.current * delta;
    gridRef.current.position.z = gridRef.current.position.z % 1; 
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -50]} receiveShadow>
        <planeGeometry args={[200, 300]} />
        <meshStandardMaterial color="#4CAF50" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, -50]} receiveShadow>
        <planeGeometry args={[12, 300]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      <gridHelper ref={gridRef} args={[12, 12, '#ffffff', '#555555']} position={[0, -0.44, 0]} />
    </group>
  );
}

function Scenery({ speedRef, playingRef }) {
  const meshRef = useRef();
  const [objects] = useState(() => {
    return Array.from({ length: 50 }).map(() => ({
      x: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 30 + 8),
      y: Math.random() * 3 + 2,
      z: -Math.random() * 250,
      scale: Math.random() * 1.5 + 1
    }));
  });
  
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!playingRef.current || !meshRef.current) return;
    
    objects.forEach((obj, i) => {
      obj.z += speedRef.current * delta;
      if (obj.z > 20) {
        obj.z -= 250;
      }
      dummy.position.set(obj.x, obj.y - 0.5, obj.z);
      dummy.scale.set(obj.scale, obj.y, obj.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, 50]} castShadow receiveShadow>
      <coneGeometry args={[1, 2, 8]} />
      <meshStandardMaterial color="#2E8B57" roughness={0.8} />
    </instancedMesh>
  );
}

function GateRow({ initialZ, speedRef, playingRef, laneRef, onHit }) {
  const groupRef = useRef();
  const [data, setData] = useState(() => generateRow(initialZ));
  const passedRef = useRef(false);

  useFrame((state, delta) => {
    if (!playingRef.current || !groupRef.current) return;
    
    groupRef.current.position.z += speedRef.current * delta;

    if (groupRef.current.position.z > 0 && !passedRef.current) {
        passedRef.current = true;
        const playerLaneIndex = laneRef.current + 1;
        onHit(playerLaneIndex === data.correctLane, groupRef.current.position.clone(), playerLaneIndex);
    }

    if (groupRef.current.position.z > 20) {
      groupRef.current.position.z -= 200;
      setData(generateRow(groupRef.current.position.z));
      passedRef.current = false;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, initialZ]}>
      {data.words.map((wordObj, i) => (
        <group key={i} position={[(i - 1) * 4, 1.8, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[3.6, 2.5, 0.4]} />
            <meshStandardMaterial color="#111" transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, 1.3, 0]} castShadow>
            <boxGeometry args={[3.8, 0.2, 0.6]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
          <mesh position={[-1.8, 0, 0]} castShadow>
            <boxGeometry args={[0.2, 2.6, 0.6]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
          <mesh position={[1.8, 0, 0]} castShadow>
            <boxGeometry args={[0.2, 2.6, 0.6]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
          <Text position={[0, 0, 0.21]} fontSize={0.7} color="white" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000">
            {wordObj.text}
          </Text>
        </group>
      ))}
    </group>
  );
}

function Particles({ particlesRef }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useLayoutEffect(() => {
    if (meshRef.current) {
      for(let i=0; i<500; i++) {
         meshRef.current.setColorAt(i, new THREE.Color('white'));
      }
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    let count = 0;
    const particles = particlesRef.current;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.life > 0) {
        p.life -= delta;
        p.pos.add(p.vel.clone().multiplyScalar(delta));
        p.vel.y -= 25 * delta;
        
        dummy.position.copy(p.pos);
        const scale = Math.max(0, p.life / p.maxLife);
        dummy.scale.set(scale, scale, scale);
        dummy.rotation.x += p.rotSpeed.x * delta;
        dummy.rotation.y += p.rotSpeed.y * delta;
        dummy.updateMatrix();
        
        meshRef.current.setMatrixAt(count, dummy.matrix);
        meshRef.current.setColorAt(count, p.color);
        count++;
      }
    }
    meshRef.current.count = count;
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    
    if (particles.length > 400) {
      particlesRef.current = particles.filter(p => p.life > 0);
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, 500]} castShadow>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial roughness={0.2} metalness={0.1} />
    </instancedMesh>
  );
}

function CameraController({ shakeRef, playingRef }) {
  const { camera } = useThree();
  const basePos = useMemo(() => new THREE.Vector3(0, 5, 10), []);
  
  useFrame((state, delta) => {
    camera.position.copy(basePos);
    if (shakeRef.current > 0) {
      camera.position.x += (Math.random() - 0.5) * shakeRef.current;
      camera.position.y += (Math.random() - 0.5) * shakeRef.current;
      shakeRef.current -= delta * 5;
    }
    camera.lookAt(0, 0, -20);
  });
  return null;
}

export default function FaskaKart({ onExit }) {
  const [gameState, setGameState] = useState('start'); 
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [flash, setFlash] = useState({ color: 'transparent', opacity: 0 });
  const [gameKey, setGameKey] = useState(0);
  
  const laneRef = useRef(0);
  const speedRef = useRef(30);
  const playingRef = useRef(false);
  const shakeRef = useRef(0);
  const particlesRef = useRef([]);

  useEffect(() => {
    playingRef.current = gameState === 'playing';
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setHealth(3);
    laneRef.current = 0;
    speedRef.current = 40;
    particlesRef.current = [];
    setGameKey(k => k + 1);
    setGameState('playing');
  };

  const triggerFlash = (isSuccess) => {
    setFlash({ color: isSuccess ? 'rgba(0, 255, 0, 0.4)' : 'rgba(255, 0, 0, 0.6)', opacity: 1 });
    setTimeout(() => setFlash(prev => ({ ...prev, opacity: 0 })), 150);
  };

  const emitParticles = (origin, colorHex) => {
    const color = new THREE.Color(colorHex);
    for (let i = 0; i < 40; i++) {
      particlesRef.current.push({
        pos: origin.clone().add(new THREE.Vector3((Math.random()-0.5)*3, (Math.random()-0.5)*3, 0)),
        vel: new THREE.Vector3((Math.random() - 0.5) * 20, Math.random() * 20 + 5, (Math.random() - 0.5) * 20),
        rotSpeed: new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10),
        life: 0.8 + Math.random() * 0.4,
        maxLife: 1.2,
        color: color
      });
    }
  };

  const onHit = (isCorrect, gatePos, hitLaneIndex) => {
    const xPos = (hitLaneIndex - 1) * 4;
    const hitOrigin = new THREE.Vector3(xPos, 2, gatePos.z);
    
    if (isCorrect) {
      setScore(s => s + 10);
      speedRef.current = Math.min(speedRef.current + 1, 80);
      emitParticles(hitOrigin, '#00ff00');
      triggerFlash(true);
    } else {
      setHealth(h => {
        const newHealth = h - 1;
        if (newHealth <= 0) {
          setGameState('gameover');
          speedRef.current = 0;
        }
        return newHealth;
      });
      shakeRef.current = 2.0;
      emitParticles(hitOrigin, '#ff0000');
      triggerFlash(false);
      speedRef.current = Math.max(speedRef.current - 10, 30);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        laneRef.current = Math.max(-1, laneRef.current - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        laneRef.current = Math.min(1, laneRef.current + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#87CEEB' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: flash.color, opacity: flash.opacity,
        pointerEvents: 'none', transition: 'opacity 0.15s ease-out', zIndex: 5
      }} />

      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)', fontFamily: 'sans-serif' }}>
        <h2 style={{ margin: 0, fontSize: '32px' }}>Score: {score}</h2>
        <h2 style={{ margin: 0, fontSize: '32px', color: health <= 1 ? '#ff4444' : 'white' }}>Health: {'❤️'.repeat(Math.max(0, health))}</h2>
      </div>

      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <button 
          onClick={onExit}
          style={{ padding: '10px 20px', fontSize: '18px', backgroundColor: '#333', color: 'white', border: '2px solid white', borderRadius: '8px', cursor: 'pointer' }}
        >
          Beenden
        </button>
      </div>

      {gameState === 'start' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 20, color: 'white', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: '64px', marginBottom: '10px', textShadow: '2px 2px 8px #000' }}>FaskaKart</h1>
          <p style={{ fontSize: '24px', marginBottom: '30px', textAlign: 'center', textShadow: '1px 1px 4px #000' }}>
            Steer with A/D or Left/Right.<br/>Drive through the gates with VERBS!
          </p>
          <button onClick={startGame} style={{ padding: '15px 40px', fontSize: '24px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>Start Game</button>
        </div>
      )}

      {gameState === 'gameover' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 20, color: 'white', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: '64px', color: '#ff4444', marginBottom: '10px', textShadow: '2px 2px 8px #000' }}>GAME OVER</h1>
          <h2 style={{ fontSize: '32px', marginBottom: '30px' }}>Final Score: {score}</h2>
          <button onClick={startGame} style={{ padding: '15px 40px', fontSize: '24px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>Try Again</button>
        </div>
      )}

      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <fog attach="fog" args={['#87CEEB', 30, 150]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[20, 30, 10]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-far={200} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} />
        
        <Sky sunPosition={[100, 20, 100]} />
        <CameraController shakeRef={shakeRef} playingRef={playingRef} />
        
        <group key={gameKey}>
          <Kart laneRef={laneRef} playingRef={playingRef} />
          <Ground speedRef={speedRef} playingRef={playingRef} />
          <Scenery speedRef={speedRef} playingRef={playingRef} />
          
          {[-50, -100, -150, -200, -250].map((z, i) => (
            <GateRow key={i} initialZ={z} speedRef={speedRef} playingRef={playingRef} laneRef={laneRef} onHit={onHit} />
          ))}

          <Particles particlesRef={particlesRef} />
        </group>
      </Canvas>
    </div>
  );
}
