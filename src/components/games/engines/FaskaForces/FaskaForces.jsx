import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Billboard, Text, Sky } from '@react-three/drei';
import { Physics, RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';

const WORDS = [
  { correct: 'Vielleicht', wrong: 'Fieleicht' },
  { correct: 'Maschine', wrong: 'Maschiene' },
  { correct: 'Rhythmus', wrong: 'Rythmus' },
  { correct: 'Sympathie', wrong: 'Sympatie' },
  { correct: 'nämlich', wrong: 'nähmlich' },
  { correct: 'Adresse', wrong: 'Addresse' },
  { correct: 'Galerie', wrong: 'Gallerie' },
  { correct: 'Reparatur', wrong: 'Reperatur' },
  { correct: 'Terrasse', wrong: 'Terasse' },
  { correct: 'Zucchini', wrong: 'Zuchini' }
];

const MAZE_SIZE = 12;
const CELL_SIZE = 4;
const mazeWalls = [];
const emptyCells = [];

// Procedurally generate the maze layout once
for (let i = -MAZE_SIZE/2; i < MAZE_SIZE/2; i++) {
  for (let j = -MAZE_SIZE/2; j < MAZE_SIZE/2; j++) {
    // Keep the center area open for the player spawn point
    if (Math.abs(i) <= 1 && Math.abs(j) <= 1) {
      emptyCells.push([i * CELL_SIZE, j * CELL_SIZE]);
      continue;
    }
    // Random procedural walls
    if (Math.random() < 0.25) {
      mazeWalls.push([i * CELL_SIZE, j * CELL_SIZE]);
    } else {
      emptyCells.push([i * CELL_SIZE, j * CELL_SIZE]);
    }
  }
}

function usePlayerControls() {
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false, jump: false });
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.code) {
        case 'KeyW': case 'ArrowUp': setMovement(m => ({...m, forward: true})); break;
        case 'KeyS': case 'ArrowDown': setMovement(m => ({...m, backward: true})); break;
        case 'KeyA': case 'ArrowLeft': setMovement(m => ({...m, left: true})); break;
        case 'KeyD': case 'ArrowRight': setMovement(m => ({...m, right: true})); break;
        case 'Space': setMovement(m => ({...m, jump: true})); break;
        default: break;
      }
    };
    const handleKeyUp = (e) => {
      switch(e.code) {
        case 'KeyW': case 'ArrowUp': setMovement(m => ({...m, forward: false})); break;
        case 'KeyS': case 'ArrowDown': setMovement(m => ({...m, backward: false})); break;
        case 'KeyA': case 'ArrowLeft': setMovement(m => ({...m, left: false})); break;
        case 'KeyD': case 'ArrowRight': setMovement(m => ({...m, right: false})); break;
        case 'Space': setMovement(m => ({...m, jump: false})); break;
        default: break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  return movement;
}

function Player({ onShoot }) {
  const body = useRef();
  const weaponRef = useRef();
  const recoil = useRef(0);
  const { camera, scene, gl } = useThree();
  const controls = usePlayerControls();
  const speed = 7;

  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();

  useEffect(() => {
    const onMouseDown = (e) => {
      // Only shoot if pointer is locked
      if (document.pointerLockElement === gl.domElement) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        const hit = intersects.find(i => i.object.userData && i.object.userData.isTarget);
        if (hit) {
          hit.object.userData.onHit(hit.point);
        }
        
        recoil.current = 0.2;
        onShoot(); // Trigger screen effect / sound
      }
    };
    window.addEventListener('mousedown', onMouseDown);
    return () => window.removeEventListener('mousedown', onMouseDown);
  }, [camera, scene, gl.domElement, onShoot]);

  useFrame(() => {
    if (!body.current) return;
    
    const velocity = body.current.linvel();
    const translation = body.current.translation();
    
    // Position camera at player's head
    camera.position.set(translation.x, translation.y + 0.8, translation.z);
    
    // Movement calculation relative to camera rotation
    frontVector.set(0, 0, (controls.backward ? 1 : 0) - (controls.forward ? 1 : 0));
    sideVector.set((controls.left ? 1 : 0) - (controls.right ? 1 : 0), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed).applyEuler(camera.rotation);
    
    body.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);
    
    // Jump
    if (controls.jump && Math.abs(velocity.y) < 0.1) {
      body.current.setLinvel({ x: velocity.x, y: 5, z: velocity.z }, true);
    }

    // Weapon animation
    if (weaponRef.current) {
      weaponRef.current.position.copy(camera.position);
      weaponRef.current.rotation.copy(camera.rotation);
      
      weaponRef.current.translateX(0.3);
      weaponRef.current.translateY(-0.3);
      weaponRef.current.translateZ(-0.5 + recoil.current);
      
      // Decay recoil smoothly
      recoil.current = THREE.MathUtils.lerp(recoil.current, 0, 0.2);
    }
  });

  return (
    <>
      <RigidBody ref={body} colliders={false} mass={1} type="dynamic" position={[0, 2, 0]} enabledRotations={[false, false, false]}>
        <CapsuleCollider args={[0.5, 0.5]} />
      </RigidBody>
      <mesh ref={weaponRef}>
        <boxGeometry args={[0.1, 0.1, 0.4]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
    </>
  );
}

function Arena() {
  return (
    <group>
      {/* Floor */}
      <RigidBody type="fixed" name="floor">
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[MAZE_SIZE * CELL_SIZE + 2, 1, MAZE_SIZE * CELL_SIZE + 2]} />
          <meshStandardMaterial color="#1a202c" roughness={0.8} />
        </mesh>
      </RigidBody>
      
      {/* Walls */}
      <RigidBody type="fixed">
        <mesh position={[0, 4, -MAZE_SIZE*CELL_SIZE/2 - 1]}>
          <boxGeometry args={[MAZE_SIZE*CELL_SIZE + 4, 10, 2]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
        <mesh position={[0, 4, MAZE_SIZE*CELL_SIZE/2 + 1]}>
          <boxGeometry args={[MAZE_SIZE*CELL_SIZE + 4, 10, 2]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
        <mesh position={[-MAZE_SIZE*CELL_SIZE/2 - 1, 4, 0]}>
          <boxGeometry args={[2, 10, MAZE_SIZE*CELL_SIZE + 4]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
        <mesh position={[MAZE_SIZE*CELL_SIZE/2 + 1, 4, 0]}>
          <boxGeometry args={[2, 10, MAZE_SIZE*CELL_SIZE + 4]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
        
        {/* Procedural Maze Blocks */}
        {mazeWalls.map((wall, idx) => (
          <mesh key={idx} position={[wall[0], 4, wall[1]]}>
            <boxGeometry args={[CELL_SIZE, 10, CELL_SIZE]} />
            <meshStandardMaterial color="#4a5568" />
          </mesh>
        ))}
      </RigidBody>
    </group>
  );
}

function Target({ position, word, isCorrect, onHitTarget }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData = {
        isTarget: true,
        onHit: (hitPoint) => onHitTarget(isCorrect, hitPoint || position)
      };
    }
  }, [isCorrect, onHitTarget, position]);

  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      <Billboard follow lockY={false}>
        <mesh 
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[4, 1.5]} />
          <meshStandardMaterial color={hovered ? "#e2e8f0" : "#cbd5e0"} emissive={hovered ? "#2b6cb0" : "#000000"} />
          <Text position={[0, 0, 0.01]} fontSize={0.5} color="#1a202c" font="https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxM.woff">
            {word}
          </Text>
        </mesh>
      </Billboard>
    </RigidBody>
  );
}

function Explosion({ position, color, onComplete }) {
  const meshRef = useRef();
  
  useEffect(() => {
    const timer = setTimeout(onComplete, 400);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.scale.x += delta * 15;
      meshRef.current.scale.y += delta * 15;
      meshRef.current.scale.z += delta * 15;
      meshRef.current.material.opacity = Math.max(0, meshRef.current.material.opacity - delta * 2.5);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={1} />
    </mesh>
  );
}

function Game({ onScore }) {
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [explosions, setExplosions] = useState([]);
  
  const handleHit = (isCorrect, hitPoint) => {
    // Add juice: explosion effect where hit
    setExplosions(prev => [
      ...prev, 
      { id: Date.now(), position: hitPoint, color: isCorrect ? '#48bb78' : '#f56565' }
    ]);
    
    if (isCorrect) {
      onScore(1);
    } else {
      onScore(-1);
    }
    
    // Cycle to next pair
    setCurrentWordIdx(i => (i + 1) % WORDS.length);
  };

  const removeExplosion = (id) => {
    setExplosions(prev => prev.filter(e => e.id !== id));
  };
  
  const currentPair = WORDS[currentWordIdx];
  const isCorrectLeft = useMemo(() => Math.random() > 0.5, [currentWordIdx]);
  
  // Pick two new random empty spots for the words
  const spawns = useMemo(() => {
    const shuffled = [...emptyCells].sort(() => 0.5 - Math.random());
    return {
      a: [shuffled[0][0], 1.5, shuffled[0][1]],
      b: [shuffled[1][0], 1.5, shuffled[1][1]]
    };
  }, [currentWordIdx]);

  return (
    <>
      <Physics gravity={[0, -20, 0]}>
        <Player onShoot={() => {}} />
        <Arena />
        
        <Target 
          position={spawns.a} 
          word={isCorrectLeft ? currentPair.correct : currentPair.wrong} 
          isCorrect={isCorrectLeft} 
          onHitTarget={handleHit} 
        />
        <Target 
          position={spawns.b} 
          word={!isCorrectLeft ? currentPair.correct : currentPair.wrong} 
          isCorrect={!isCorrectLeft} 
          onHitTarget={handleHit} 
        />
      </Physics>
      
      {explosions.map(ex => (
        <Explosion 
          key={ex.id} 
          position={ex.position} 
          color={ex.color} 
          onComplete={() => removeExplosion(ex.id)} 
        />
      ))}

      <PointerLockControls />
      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Fog for a more atmospheric Doom/FPS vibe */}
      <fog attach="fog" args={['#1a202c', 10, 40]} />
    </>
  );
}

export default function FaskaForces({ onExit }) {
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [flash, setFlash] = useState(null);

  const handleScore = (points) => {
    setScore(s => s + points);
    setFlash(points > 0 ? 'rgba(72, 187, 120, 0.4)' : 'rgba(245, 101, 101, 0.4)');
    setTimeout(() => setFlash(null), 150);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, overflow: 'hidden', background: '#000' }}>
      {/* UI Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
        
        {/* Beenden Button */}
        <button
          onClick={onExit}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            background: '#e53e3e',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            pointerEvents: 'auto',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}
        >
          Beenden
        </button>

        {/* Score HUD */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: 'white',
          fontSize: '28px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textShadow: '2px 2px 0 #000'
        }}>
          Score: {score}
        </div>
        
        {/* Instructions Hint */}
        {started && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px',
            fontFamily: 'sans-serif'
          }}>
            Klicken, um die Kamera zu steuern. ESC zum Freigeben.
          </div>
        )}

        {/* Crosshair */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '6px',
          height: '6px',
          background: 'white',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference'
        }} />

        {/* Screen Flash (Hit Juice) */}
        {flash && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: flash,
            transition: 'background-color 0.1s'
          }} />
        )}
      </div>

      {/* Start Screen */}
      {!started && (
        <div 
          onClick={() => setStarted(true)}
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          <h1 style={{ fontSize: '64px', marginBottom: '20px', color: '#63b3ed', textShadow: '0 0 10px #3182ce' }}>FaskaForces</h1>
          <div style={{ fontSize: '24px', marginBottom: '40px', textAlign: 'center', maxWidth: '600px', lineHeight: '1.5' }}>
            <p><strong>WASD</strong> zum Bewegen, <strong>Leertaste</strong> zum Springen.</p>
            <p>Finde und schieße auf das <strong>richtig</strong> geschriebene Wort!</p>
          </div>
          <button style={{ 
            padding: '15px 40px', 
            fontSize: '24px', 
            background: '#3182ce', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}>
            Klicken zum Starten
          </button>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas shadows>
        <Suspense fallback={null}>
           {started && <Game onScore={handleScore} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
