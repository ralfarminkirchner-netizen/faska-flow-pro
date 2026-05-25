import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, Grid, Stars } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

// --- Game Constants & Data ---
const MOLECULES = [
  { formula: 'H2O', name: 'Wasser', color: '#00ccff' },
  { formula: 'CO2', name: 'Kohlenstoffdioxid', color: '#ff3333' },
  { formula: 'O2', name: 'Sauerstoff', color: '#ffffff' },
  { formula: 'NaCl', name: 'Salz', color: '#dddddd' },
  { formula: 'C6H12O6', name: 'Glucose', color: '#ffaa00' },
  { formula: 'N2', name: 'Stickstoff', color: '#aa44ff' },
];

const TRACK_LENGTH = 20000;
const TRACK_WIDTH = 40;
const OBSTACLE_COUNT = 400;

// --- Custom Hooks ---
const useKeys = () => {
  const keys = useRef({ left: false, right: false });
  useEffect(() => {
    const down = (e) => {
      if (e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') keys.current.right = true;
    };
    const up = (e) => {
      if (e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') keys.current.right = false;
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

const Player = ({ speed, keys, shakeRef, onWin }) => {
  const rb = useRef();

  useFrame((state, delta) => {
    if (!rb.current) return;
    const pos = rb.current.translation();

    // End game condition (Win)
    if (pos.z < -TRACK_LENGTH + 100) {
      onWin();
    }

    // Movement Logic
    let velX = 0;
    if (keys.current.left) velX = -40;
    if (keys.current.right) velX = 40;

    rb.current.setLinvel({ x: velX, y: 0, z: -speed }, true);

    // Camera Follow & Juice
    const targetCamPos = new THREE.Vector3(pos.x * 0.4, 5, pos.z + 15);

    // Screen Shake effect
    if (shakeRef.current > 0) {
      targetCamPos.x += (Math.random() - 0.5) * 2.0;
      targetCamPos.y += (Math.random() - 0.5) * 2.0;
      shakeRef.current -= delta;
    }

    state.camera.position.lerp(targetCamPos, 0.15);
    state.camera.lookAt(pos.x * 0.1, 1, pos.z - 40);
  });

  return (
    <RigidBody 
      ref={rb} 
      position={[0, 1, 0]} 
      type="dynamic" 
      enabledRotations={[false, false, false]} 
      enabledTranslations={[true, false, true]}
    >
      <Box args={[3, 0.5, 5]}>
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.8} />
      </Box>
      {/* Engine flames */}
      <Box args={[1.5, 0.2, 1]} position={[0, 0, 2.6]}>
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
      </Box>
      <pointLight position={[0, 1, 3]} color="#ff00ff" intensity={3} distance={15} />
    </RigidBody>
  );
};

const ObstacleBox = ({ position, molecule, onHit }) => {
  const [collected, setCollected] = useState(false);
  const meshRef = useRef();

  useFrame((state) => {
    if (!collected && meshRef.current) {
      // Gentle floating and spinning animation
      meshRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 3 + position[2]) * 0.5;
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x += 0.01;
    }
  });

  if (collected) return null;

  return (
    <RigidBody 
      position={position} 
      type="fixed" 
      sensor 
      onIntersectionEnter={() => {
        setCollected(true);
        onHit(molecule);
      }}
    >
      <group ref={meshRef}>
        <Box args={[3, 3, 3]}>
          <meshStandardMaterial 
            color={molecule.color} 
            emissive={molecule.color} 
            emissiveIntensity={0.8} 
            wireframe 
          />
        </Box>
        <Text 
          position={[0, 3.5, 0]} 
          fontSize={1.8} 
          color="white" 
          outlineWidth={0.1} 
          outlineColor="black" 
          fontWeight="bold"
        >
          {molecule.formula}
        </Text>
      </group>
    </RigidBody>
  );
};

// --- Main Engine Component ---

export default function FaskaFZero({ onExit }) {
  const [gameState, setGameState] = useState('playing'); // playing, gameover, win
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(100);
  const [targetMol, setTargetMol] = useState(MOLECULES[0]);
  const [flash, setFlash] = useState(null); // 'green' | 'red'

  const keys = useKeys();
  const shakeRef = useRef(0);

  // Generate track obstacles once
  const obstaclesData = useMemo(() => {
    const obs = [];
    for (let i = 0; i < OBSTACLE_COUNT; i++) {
      const z = -100 - i * 50; // Spaced every 50 units
      const x = (Math.random() - 0.5) * (TRACK_WIDTH - 8); // Random strafe pos
      const mol = MOLECULES[Math.floor(Math.random() * MOLECULES.length)];
      obs.push({ id: i, position: [x, 0, z], molecule: mol });
    }
    return obs;
  }, []);

  // Handle hit logic
  const handleHit = (mol) => {
    if (gameState !== 'playing') return;

    if (mol.formula === targetMol.formula) {
      // Correct Molecule
      setScore(s => s + 50);
      setHealth(h => Math.min(100, h + 10));
      setSpeed(s => Math.min(250, s + 15)); // Boost
      setFlash('green');
      shakeRef.current = 0.2;
      setTimeout(() => setFlash(null), 300);
      
      // Pick a new target
      setTargetMol(MOLECULES[Math.floor(Math.random() * MOLECULES.length)]);
    } else {
      // Wrong Molecule
      setHealth(h => h - 20);
      setSpeed(s => Math.max(50, s - 30)); // Penalty slow down
      setFlash('red');
      shakeRef.current = 0.4;
      setTimeout(() => setFlash(null), 300);
    }
  };

  // Check Game Over
  useEffect(() => {
    if (health <= 0 && gameState === 'playing') {
      setGameState('gameover');
      setSpeed(0);
    }
  }, [health, gameState]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#000' }}>
      
      {/* 3D Canvas */}
      <Canvas shadows>
        <color attach="background" args={['#02020a']} />
        <fog attach="fog" args={['#02020a', 50, 400]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} color="#ffffff" />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={2} />

        <Physics gravity={[0, -30, 0]}>
          {gameState === 'playing' && (
            <Player 
              speed={speed} 
              keys={keys} 
              shakeRef={shakeRef} 
              onWin={() => setGameState('win')} 
            />
          )}

          {/* Floor & Track Walls */}
          <RigidBody type="fixed">
            <Box args={[TRACK_WIDTH, 1, TRACK_LENGTH]} position={[0, -0.5, -TRACK_LENGTH / 2]}>
              <meshStandardMaterial color="#050505" />
            </Box>
            {/* Left Wall */}
            <Box args={[2, 10, TRACK_LENGTH]} position={[-TRACK_WIDTH / 2 - 1, 4, -TRACK_LENGTH / 2]}>
              <meshStandardMaterial color="#111" emissive="#ff00ff" emissiveIntensity={0.2} />
            </Box>
            {/* Right Wall */}
            <Box args={[2, 10, TRACK_LENGTH]} position={[TRACK_WIDTH / 2 + 1, 4, -TRACK_LENGTH / 2]}>
              <meshStandardMaterial color="#111" emissive="#00ffff" emissiveIntensity={0.2} />
            </Box>
          </RigidBody>

          {/* Neon Grid Floor */}
          <Grid
            position={[0, 0.01, 0]}
            args={[TRACK_WIDTH, 10000]}
            cellSize={2}
            cellThickness={1}
            cellColor="#00ffff"
            sectionSize={10}
            sectionThickness={1.5}
            sectionColor="#ff00ff"
            fadeDistance={300}
            fadeStrength={1}
            followCamera={true}
          />

          {/* Obstacles */}
          {obstaclesData.map((obs) => (
            <ObstacleBox 
              key={obs.id} 
              position={obs.position} 
              molecule={obs.molecule} 
              onHit={handleHit} 
            />
          ))}
        </Physics>
      </Canvas>

      {/* HUD & Overlays */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 10,
        boxSizing: 'border-box', padding: '20px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
      }}>
        
        {/* Flash Effect Layer */}
        {flash && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: flash === 'green' ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.3)',
            zIndex: -1
          }} />
        )}

        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Health & Target */}
          <div style={{ background: 'rgba(0,0,0,0.7)', padding: '15px', borderRadius: '10px', border: '2px solid #00ffff' }}>
            <h2 style={{ margin: '0 0 10px 0', color: 'white', fontFamily: 'monospace', textShadow: '0 0 5px #00ffff' }}>
              Sammle: {targetMol.name} <span style={{ color: targetMol.color }}>({targetMol.formula})</span>
            </h2>
            <div style={{ width: '300px', height: '20px', background: '#333', borderRadius: '10px', overflow: 'hidden', border: '1px solid #fff' }}>
              <div style={{
                width: `${Math.max(0, health)}%`, height: '100%',
                background: health > 50 ? '#00ff00' : health > 25 ? '#ffff00' : '#ff0000',
                transition: 'width 0.2s ease, background 0.2s ease'
              }} />
            </div>
          </div>

          {/* Score & Speed */}
          <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.7)', padding: '15px', borderRadius: '10px', border: '2px solid #ff00ff' }}>
            <h1 style={{ margin: 0, color: '#ff00ff', fontFamily: 'monospace', textShadow: '0 0 5px #ff00ff' }}>
              SCORE: {score}
            </h1>
            <h3 style={{ margin: '5px 0 0 0', color: 'white', fontFamily: 'monospace' }}>
              SPEED: {Math.floor(speed)} km/h
            </h3>
          </div>
        </div>

        {/* Bottom Bar: Exit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={onExit}
            style={{
              pointerEvents: 'auto',
              padding: '15px 30px', fontSize: '1.2rem', fontWeight: 'bold',
              background: 'transparent', color: '#ff0055', border: '2px solid #ff0055',
              cursor: 'pointer', borderRadius: '5px',
              textShadow: '0 0 5px #ff0055', boxShadow: '0 0 10px #ff0055 inset'
            }}
          >
            Beenden
          </button>
        </div>
      </div>

      {/* Game Over / Win Screens */}
      {gameState !== 'playing' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0, 0, 0, 0.85)', zIndex: 20, pointerEvents: 'auto',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontFamily: 'monospace'
        }}>
          <h1 style={{ fontSize: '4rem', margin: '0 0 20px 0', color: gameState === 'win' ? '#00ffff' : '#ff0000', textShadow: `0 0 20px ${gameState === 'win' ? '#00ffff' : '#ff0000'}` }}>
            {gameState === 'win' ? 'ZIEL ERREICHT!' : 'SYSTEMVERSAGEN'}
          </h1>
          <h2 style={{ fontSize: '2rem', marginBottom: '40px' }}>Endstand: {score}</h2>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <button 
              onClick={() => window.location.reload()} // Hacky reload for simple resetting
              style={{
                padding: '15px 30px', fontSize: '1.5rem', background: '#00ffff', color: 'black',
                border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '5px'
              }}
            >
              Neustart
            </button>
            <button 
              onClick={onExit}
              style={{
                padding: '15px 30px', fontSize: '1.5rem', background: 'transparent', color: '#fff',
                border: '2px solid #fff', cursor: 'pointer', fontWeight: 'bold', borderRadius: '5px'
              }}
            >
              Beenden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
