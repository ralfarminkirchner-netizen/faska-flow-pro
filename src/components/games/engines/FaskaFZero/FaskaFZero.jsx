import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, useTexture, Stars } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

// --- Custom Hooks ---
const useKeys = () => {
  const keys = useRef({ left: false, right: false, up: false, down: false });
  useEffect(() => {
    const down = (e) => {
      if (e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') keys.current.right = true;
      if (e.key.toLowerCase() === 'w' || e.key === 'ArrowUp') keys.current.up = true;
      if (e.key.toLowerCase() === 's' || e.key === 'ArrowDown') keys.current.down = true;
    };
    const up = (e) => {
      if (e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') keys.current.right = false;
      if (e.key.toLowerCase() === 'w' || e.key === 'ArrowUp') keys.current.up = false;
      if (e.key.toLowerCase() === 's' || e.key === 'ArrowDown') keys.current.down = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);
  return keys;
};

// --- Subcomponents ---

function HoverShip({ keys, speed, targetMol, onHit, shakeRef, onWin }) {
  const rb = useRef();
  const shipMesh = useRef();
  const [shipTex] = useTexture(['/textures/fzero_ship.png']);
  const engineGlow = useRef();

  useFrame((state, delta) => {
    if (!rb.current) return;
    const pos = rb.current.translation();
    const vel = rb.current.linvel();

    if (pos.z < -20000 + 100) {
      onWin();
    }

    // Advanced Momentum & Hover Physics
    const thrust = 150;
    const maxSpeed = speed;
    let targetVelX = 0;
    let targetVelZ = -speed; // Base forward speed
    
    if (keys.current.left) targetVelX = -thrust;
    if (keys.current.right) targetVelX = thrust;
    
    // Free flight acceleration
    if (keys.current.up) targetVelZ -= 50; 
    if (keys.current.down) targetVelZ += 50;

    // Apply forces smoothly for that floaty, high-speed flight feeling
    rb.current.setLinvel({
      x: THREE.MathUtils.lerp(vel.x, targetVelX, 2 * delta),
      y: Math.sin(state.clock.elapsedTime * 4) * 0.5, // Hover bobbing
      z: THREE.MathUtils.lerp(vel.z, targetVelZ, 2 * delta)
    }, true);

    // Visual Banking / Rolling
    if (shipMesh.current) {
      const bankAngle = (vel.x / thrust) * (Math.PI / 3);
      const pitchAngle = (vel.z + speed) / 50 * (Math.PI / 12);
      shipMesh.current.rotation.z = THREE.MathUtils.lerp(shipMesh.current.rotation.z, -bankAngle, 5 * delta);
      shipMesh.current.rotation.x = THREE.MathUtils.lerp(shipMesh.current.rotation.x, pitchAngle, 5 * delta);
    }

    // Engine flicker
    if (engineGlow.current) {
      engineGlow.current.intensity = 2 + Math.random() * 2;
    }

    // Dynamic Camera Tracking (follows momentum and speed)
    const baseFov = 75;
    const fovOffset = Math.abs(vel.z) > speed ? 15 : 0;
    state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, baseFov + fovOffset, delta * 5);
    state.camera.updateProjectionMatrix();

    const targetCamPos = new THREE.Vector3(pos.x * 0.8, 6 + Math.abs(vel.x) * 0.02, pos.z + 18);
    if (shakeRef.current > 0) {
      targetCamPos.x += (Math.random() - 0.5) * 3.0;
      targetCamPos.y += (Math.random() - 0.5) * 3.0;
      shakeRef.current -= delta;
    }
    state.camera.position.lerp(targetCamPos, 8 * delta);
    state.camera.lookAt(pos.x * 0.3, 1, pos.z - 60);
  });

  return (
    <RigidBody 
      ref={rb} 
      position={[0, 2, 0]} 
      type="dynamic" 
      enabledRotations={[false, false, false]} 
      linearDamping={0.5}
      name="player"
    >
      <group ref={shipMesh}>
        {/* Sleek Ship Body */}
        <mesh castShadow position={[0,0,0]}>
          <coneGeometry args={[2.5, 8, 3]} />
          <meshStandardMaterial map={shipTex} roughness={0.2} metalness={0.8} color="#ffffff" />
        </mesh>
        {/* Wings */}
        <mesh position={[-2, -0.5, 2]} rotation={[0, 0, Math.PI/4]}>
          <boxGeometry args={[4, 0.2, 2]} />
          <meshStandardMaterial map={shipTex} roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[2, -0.5, 2]} rotation={[0, 0, -Math.PI/4]}>
          <boxGeometry args={[4, 0.2, 2]} />
          <meshStandardMaterial map={shipTex} roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Thrusters */}
        <pointLight ref={engineGlow} position={[0, 0, 4]} color="#00ffff" intensity={4} distance={20} />
        <mesh position={[0, 0, 4]}>
          <cylinderGeometry args={[1, 0.5, 2]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
      </group>
    </RigidBody>
  );
}

function TrackEnvironment() {
  const [trackTex] = useTexture(['/textures/fzero_track.png']);
  trackTex.wrapS = trackTex.wrapT = THREE.RepeatWrapping;
  trackTex.repeat.set(4, 1000); // Stretch heavily along Z

  return (
    <RigidBody type="fixed">
      {/* Massive seamless race track */}
      <mesh position={[0, 0, -10000]} receiveShadow>
        <planeGeometry args={[100, 20000]} />
        <meshStandardMaterial map={trackTex} roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Invisible walls to keep player on track */}
      <mesh position={[-50, 10, -10000]} visible={false}><boxGeometry args={[2, 20, 20000]} /></mesh>
      <mesh position={[50, 10, -10000]} visible={false}><boxGeometry args={[2, 20, 20000]} /></mesh>
    </RigidBody>
  );
}

const MOLECULES = [
  { formula: 'H2O', name: 'Wasser', color: '#00ccff' },
  { formula: 'CO2', name: 'Kohlenstoffdioxid', color: '#ff3333' },
  { formula: 'O2', name: 'Sauerstoff', color: '#ffffff' },
  { formula: 'NaCl', name: 'Salz', color: '#dddddd' },
  { formula: 'C6H12O6', name: 'Glucose', color: '#ffaa00' },
  { formula: 'N2', name: 'Stickstoff', color: '#aa44ff' },
];

function ObstacleGate({ position, molecule, onHit }) {
  const [collected, setCollected] = useState(false);
  const meshRef = useRef();

  useFrame((state) => {
    if (!collected && meshRef.current) {
      meshRef.current.position.y = 3 + Math.sin(state.clock.elapsedTime * 2 + position[2]) * 1;
      meshRef.current.rotation.y += 0.03;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime + position[2]) * 0.2;
    }
  });

  if (collected) return null;

  return (
    <RigidBody 
      position={position} 
      type="fixed" 
      sensor 
      onIntersectionEnter={(p) => {
        if(p.other.rigidBodyObject?.name === "player") {
          setCollected(true);
          onHit(molecule);
        }
      }}
    >
      <group ref={meshRef}>
        <mesh castShadow>
          <torusGeometry args={[3, 0.5, 16, 32]} />
          <meshStandardMaterial color={molecule.color} emissive={molecule.color} emissiveIntensity={2} />
        </mesh>
        <Text 
          position={[0, 4.5, 0]} 
          fontSize={2} 
          color="white" 
          outlineWidth={0.15} 
          outlineColor="black" 
          fontWeight="900"
        >
          {molecule.formula}
        </Text>
      </group>
    </RigidBody>
  );
}

// --- Speed Lines Effect ---
function SpeedLines({ speed }) {
  const linesRef = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for(let i=0; i<100; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 80,
        y: Math.random() * 20,
        z: (Math.random() - 0.5) * 100
      });
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if(linesRef.current) {
      linesRef.current.children.forEach(mesh => {
        mesh.position.z += speed * delta * 2;
        if (mesh.position.z > 20) {
          mesh.position.z -= 100;
        }
      });
    }
  });

  return (
    <group ref={linesRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <boxGeometry args={[0.1, 0.1, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function FaskaFZero({ onExit }) {
  const [gameState, setGameState] = useState('playing'); 
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(200);
  const [targetMol, setTargetMol] = useState(MOLECULES[0]);
  const [flash, setFlash] = useState(null);

  const keys = useKeys();
  const shakeRef = useRef(0);

  const obstaclesData = useMemo(() => {
    const obs = [];
    for (let i = 0; i < 400; i++) {
      const z = -150 - i * 50; 
      const x = (Math.random() - 0.5) * 80; 
      const mol = MOLECULES[Math.floor(Math.random() * MOLECULES.length)];
      obs.push({ id: i, position: [x, 0, z], molecule: mol });
    }
    return obs;
  }, []);

  const handleHit = (mol) => {
    if (gameState !== 'playing') return;

    if (mol.formula === targetMol.formula) {
      setScore(s => s + 50);
      setHealth(h => Math.min(100, h + 10));
      setSpeed(s => Math.min(400, s + 20)); 
      setFlash('green');
      shakeRef.current = 0.3;
      setTimeout(() => setFlash(null), 200);
      setTargetMol(MOLECULES[Math.floor(Math.random() * MOLECULES.length)]);
    } else {
      setHealth(h => h - 25);
      setSpeed(s => Math.max(100, s - 50)); 
      setFlash('red');
      shakeRef.current = 0.6;
      setTimeout(() => setFlash(null), 300);
    }
  };

  useEffect(() => {
    if (health <= 0 && gameState === 'playing') {
      setGameState('gameover');
      setSpeed(0);
    }
  }, [health, gameState]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#000' }}>
      <Canvas shadows camera={{ fov: 75 }}>
        <color attach="background" args={['#020012']} />
        <fog attach="fog" args={['#020012', 20, 200]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[20, 50, -20]} intensity={2} color="#ffffff" castShadow />
        
        <Stars radius={150} depth={50} count={5000} factor={6} saturation={1} fade speed={3} />
        <SpeedLines speed={speed} />

        <Physics gravity={[0, -40, 0]}>
          {gameState === 'playing' && (
            <HoverShip 
              keys={keys} 
              speed={speed} 
              targetMol={targetMol} 
              onHit={handleHit} 
              shakeRef={shakeRef} 
              onWin={() => setGameState('win')} 
            />
          )}
          <TrackEnvironment />

          {obstaclesData.map((obs) => (
            <ObstacleGate 
              key={obs.id} 
              position={obs.position} 
              molecule={obs.molecule} 
              onHit={handleHit} 
            />
          ))}
        </Physics>
      </Canvas>

      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 10,
        boxSizing: 'border-box', padding: '20px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
      }}>
        {flash && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: flash === 'green' ? 'rgba(0, 255, 128, 0.2)' : 'rgba(255, 0, 80, 0.3)',
            zIndex: -1
          }} />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(10,0,30,0.8)', padding: '20px', borderRadius: '15px', border: '3px solid #00ffff', boxShadow: '0 0 20px rgba(0,255,255,0.4)' }}>
            <h2 style={{ margin: '0 0 10px 0', color: 'white', fontFamily: 'Impact, sans-serif', fontSize: '2rem', letterSpacing: '2px' }}>
              ZIEL: <span style={{ color: targetMol.color }}>{targetMol.formula}</span> ({targetMol.name})
            </h2>
            <div style={{ width: '350px', height: '25px', background: '#222', borderRadius: '12px', border: '2px solid #fff', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.max(0, health)}%`, height: '100%',
                background: health > 50 ? 'linear-gradient(90deg, #00ff00, #00ffff)' : health > 25 ? '#ffff00' : '#ff0000',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
          </div>

          <div style={{ textAlign: 'right', background: 'rgba(10,0,30,0.8)', padding: '20px', borderRadius: '15px', border: '3px solid #ff00ff', boxShadow: '0 0 20px rgba(255,0,255,0.4)' }}>
            <h1 style={{ margin: 0, color: '#ff00ff', fontFamily: 'Impact, sans-serif', fontSize: '3rem', letterSpacing: '3px' }}>
              {score} PTS
            </h1>
            <h3 style={{ margin: '5px 0 0 0', color: 'white', fontFamily: 'monospace', fontSize: '1.5rem' }}>
              {Math.floor(speed)} KM/H
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={onExit}
            style={{
              pointerEvents: 'auto', padding: '15px 40px', fontSize: '1.5rem', fontWeight: '900',
              background: 'rgba(255,0,80,0.2)', color: '#ff0055', border: '3px solid #ff0055',
              cursor: 'pointer', borderRadius: '10px', textTransform: 'uppercase',
              textShadow: '0 0 10px #ff0055', boxShadow: '0 0 20px #ff0055 inset',
              fontFamily: 'Impact, sans-serif'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,0,80,0.5)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,0,80,0.2)'}
          >
            Zurück
          </button>
        </div>
      </div>

      {gameState !== 'playing' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0, 5, 20, 0.9)', zIndex: 20, pointerEvents: 'auto',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontFamily: 'Impact, sans-serif'
        }}>
          <h1 style={{ fontSize: '6rem', margin: '0 0 20px 0', color: gameState === 'win' ? '#00ffff' : '#ff0055', textShadow: `0 0 40px ${gameState === 'win' ? '#00ffff' : '#ff0055'}` }}>
            {gameState === 'win' ? 'STRECKE BEENDET!' : 'CRASH!'}
          </h1>
          <h2 style={{ fontSize: '3rem', marginBottom: '50px', fontWeight: 'normal' }}>SCORE: {score}</h2>
          
          <div style={{ display: 'flex', gap: '30px' }}>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                padding: '20px 50px', fontSize: '2rem', background: '#00ffff', color: '#000',
                border: 'none', cursor: 'pointer', fontWeight: '900', borderRadius: '15px',
                boxShadow: '0 0 30px #00ffff'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              REMATCH
            </button>
            <button 
              onClick={onExit}
              style={{
                padding: '20px 50px', fontSize: '2rem', background: 'transparent', color: '#fff',
                border: '3px solid #fff', cursor: 'pointer', fontWeight: '900', borderRadius: '15px'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              BEENDEN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
