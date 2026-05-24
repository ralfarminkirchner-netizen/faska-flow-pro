import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Text, Sky } from '@react-three/drei';
import * as THREE from 'three';

// --- Game Logic ---
function generateProblem() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const isAdd = Math.random() > 0.5;
  const answer = isAdd ? a + b : Math.abs(a - b) + 1;
  const text = isAdd ? `${a} + ${b}` : (a > b ? `${a} - ${b}` : `${b} - ${a}`);
  
  const options = [answer];
  while (options.length < 3) {
    const wrong = answer + Math.floor(Math.random() * 10) - 5;
    if (wrong !== answer && wrong >= 0 && !options.includes(wrong)) {
      options.push(wrong);
    }
  }
  options.sort(() => Math.random() - 0.5);
  
  return { text: text + ' = ?', answer, options };
}

// --- Components ---

function Environment() {
  return (
    <group>
      <Sky sunPosition={[100, 20, 100]} turbidity={0.3} rayleigh={0.5} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#223322" roughness={1} />
      </mesh>
      
      {/* Grid helper for retro feel */}
      <gridHelper args={[100, 100, '#000000', '#000000']} position={[0, 0.01, 0]} />
      
      {/* Walls */}
      <mesh position={[0, 5, -50]} receiveShadow>
        <boxGeometry args={[100, 10, 1]} />
        <meshStandardMaterial color="#444444" roughness={0.8} />
      </mesh>
      <mesh position={[0, 5, 50]} receiveShadow>
        <boxGeometry args={[100, 10, 1]} />
        <meshStandardMaterial color="#444444" roughness={0.8} />
      </mesh>
      <mesh position={[-50, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[100, 10, 1]} />
        <meshStandardMaterial color="#444444" roughness={0.8} />
      </mesh>
      <mesh position={[50, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[100, 10, 1]} />
        <meshStandardMaterial color="#444444" roughness={0.8} />
      </mesh>
      
      {/* Random pillars */}
      {[...Array(30)].map((_, i) => (
         <mesh key={i} position={[(Math.random() - 0.5) * 80, 5, (Math.random() - 0.5) * 80]} castShadow receiveShadow>
            <boxGeometry args={[2, 10, 2]} />
            <meshStandardMaterial color="#333333" />
         </mesh>
      ))}
    </group>
  );
}

function Player({ addProjectile, isLocked }) {
  const { camera } = useThree();
  const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLocked) return;
      switch(e.key.toLowerCase()) {
        case 'w': setKeys(k => ({...k, w: true})); break;
        case 'a': setKeys(k => ({...k, a: true})); break;
        case 's': setKeys(k => ({...k, s: true})); break;
        case 'd': setKeys(k => ({...k, d: true})); break;
      }
    };
    const handleKeyUp = (e) => {
      switch(e.key.toLowerCase()) {
        case 'w': setKeys(k => ({...k, w: false})); break;
        case 'a': setKeys(k => ({...k, a: false})); break;
        case 's': setKeys(k => ({...k, s: false})); break;
        case 'd': setKeys(k => ({...k, d: false})); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isLocked]);

  useFrame((state, delta) => {
    if (!isLocked) return;
    const speed = 15;
    
    const direction = new THREE.Vector3(
        Number(keys.d) - Number(keys.a),
        0,
        Number(keys.s) - Number(keys.w)
    );
    direction.normalize().multiplyScalar(speed * delta);
    
    // Apply only the Y rotation of the camera (yaw) to keep movement on the XZ plane
    const euler = new THREE.Euler(0, camera.rotation.y, 0, 'YXZ');
    direction.applyEuler(euler);
    
    camera.position.x += direction.x;
    camera.position.z += direction.z;
    camera.position.y = 1.5; // Player height
    
    // Keep player within bounds
    if(camera.position.x > 48) camera.position.x = 48;
    if(camera.position.x < -48) camera.position.x = -48;
    if(camera.position.z > 48) camera.position.z = 48;
    if(camera.position.z < -48) camera.position.z = -48;
  });

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (isLocked && e.button === 0) {
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        addProjectile(camera.position.clone(), dir);
      }
    };
    window.addEventListener('mousedown', handleMouseDown);
    return () => window.removeEventListener('mousedown', handleMouseDown);
  }, [camera, addProjectile, isLocked]);

  return <PointerLockControls />;
}

function Projectile({ id, position, direction, removeProjectile, registerProjectile, isLocked }) {
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
       registerProjectile(id, meshRef);
    }
    return () => registerProjectile(id, null);
  }, [id, registerProjectile]);

  useFrame((state, delta) => {
    if (!isLocked || !meshRef.current) return;
    meshRef.current.position.add(direction.clone().multiplyScalar(50 * delta));
    // Remove if it goes too far
    if (meshRef.current.position.length() > 100) {
      removeProjectile(id);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshBasicMaterial color="#ffff00" />
      <pointLight color="#ffff00" intensity={2} distance={5} />
    </mesh>
  );
}

function Enemy({ id, initialPosition, number, isCorrect, registerEnemy, isLocked }) {
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
       registerEnemy(id, meshRef, isCorrect);
    }
    return () => registerEnemy(id, null);
  }, [id, isCorrect, registerEnemy]);

  useFrame((state, delta) => {
    if (!isLocked || !meshRef.current) return;
    
    // Move towards player
    const dir = new THREE.Vector3().subVectors(state.camera.position, meshRef.current.position);
    dir.y = 0; // keep on ground plane roughly
    dir.normalize();
    meshRef.current.position.add(dir.multiplyScalar(4 * delta));
    meshRef.current.lookAt(state.camera.position);
    
    // Floating effect
    meshRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 3 + parseFloat(id)) * 0.5;
  });

  return (
    <group ref={meshRef} position={initialPosition}>
      <mesh castShadow>
        <octahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#aa3333" roughness={0.4} metalness={0.6} />
      </mesh>
      <Text position={[0, 2.5, 0]} fontSize={1.5} color="#ffffff" outlineWidth={0.1} outlineColor="#000000">
        {number.toString()}
      </Text>
    </group>
  );
}

const ResetCamera = ({ started }) => {
  const { camera } = useThree();
  useEffect(() => {
    if (started) {
      camera.position.set(0, 1.5, 0);
      camera.rotation.set(0, 0, 0);
    }
  }, [started, camera]);
  return null;
};

// --- Main App Component ---

const btnStyle = {
  padding: '15px 30px',
  fontSize: '24px',
  backgroundColor: '#cc0000',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
  textTransform: 'uppercase',
  pointerEvents: 'auto'
};

export default function FaskaDoom({ onExit }) {
  const [health, setHealth] = useState(3);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState(null);
  const [enemies, setEnemies] = useState([]);
  const [projectiles, setProjectiles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [flash, setFlash] = useState(null);

  const collisionState = useRef({
    enemies: new Map(), // id -> { ref, isCorrect }
    projectiles: new Map() // id -> ref
  });

  // Track pointer lock state
  useEffect(() => {
    const handleLockChange = () => {
      setIsLocked(!!document.pointerLockElement);
    };
    document.addEventListener('pointerlockchange', handleLockChange);
    return () => document.removeEventListener('pointerlockchange', handleLockChange);
  }, []);

  // Unlock when game over
  useEffect(() => {
    if (gameOver && document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, [gameOver]);

  // Spawn enemies when problem changes
  useEffect(() => {
    if (problem && !gameOver) {
       const newEnemies = problem.options.map(opt => {
          const angle = Math.random() * Math.PI * 2;
          const distance = 25 + Math.random() * 15;
          return {
             id: Math.random().toString(),
             number: opt,
             isCorrect: opt === problem.answer,
             initialPosition: [Math.cos(angle) * distance, 1.5, Math.sin(angle) * distance]
          };
       });
       setEnemies(newEnemies);
    }
  }, [problem, gameOver]);

  const startGame = () => {
    setStarted(true);
    setHealth(3);
    setScore(0);
    setGameOver(false);
    setProblem(generateProblem());
  };

  const registerProjectile = useCallback((id, ref) => {
    if (ref) collisionState.current.projectiles.set(id, ref);
    else collisionState.current.projectiles.delete(id);
  }, []);

  const registerEnemy = useCallback((id, ref, isCorrect) => {
    if (ref) collisionState.current.enemies.set(id, { ref, isCorrect });
    else collisionState.current.enemies.delete(id);
  }, []);

  const removeProjectile = useCallback((id) => {
    setProjectiles(prev => prev.filter(x => x.id !== id));
  }, []);

  const addProjectile = useCallback((position, direction) => {
    const id = Math.random().toString();
    setProjectiles(prev => [...prev, { id, position, direction }]);
  }, []);

  const handleHit = useCallback((enemyId, projectileId, isCorrect) => {
    collisionState.current.projectiles.delete(projectileId);
    if (isCorrect) {
       collisionState.current.enemies.clear();
    } else {
       collisionState.current.enemies.delete(enemyId);
    }
    
    setProjectiles(prev => prev.filter(p => p.id !== projectileId));
    setFlash(isCorrect ? 'green' : 'red');
    setTimeout(() => setFlash(null), 200);
    
    if (isCorrect) {
       setScore(s => s + 10);
       setEnemies([]);
       setTimeout(() => {
          setProblem(generateProblem());
       }, 1000);
    } else {
       setHealth(h => {
         if (h - 1 <= 0) setGameOver(true);
         return h - 1;
       });
       setEnemies(prev => prev.filter(e => e.id !== enemyId));
    }
  }, []);

  const handlePlayerHit = useCallback((enemyId) => {
    collisionState.current.enemies.delete(enemyId);
    
    setFlash('red');
    setTimeout(() => setFlash(null), 200);

    setHealth(h => {
       if (h - 1 <= 0) setGameOver(true);
       return h - 1;
    });
    setEnemies(prev => prev.filter(e => e.id !== enemyId));
  }, []);

  const CollisionSystem = () => {
    const { camera } = useThree();
    useFrame(() => {
      if (!isLocked) return;

      const eMap = collisionState.current.enemies;
      const pMap = collisionState.current.projectiles;

      let hitEnemyId = null;
      let hitProjectileId = null;
      let hitCorrect = false;

      // Projectile -> Enemy collision
      for (const [pId, pRef] of pMap.entries()) {
        if (!pRef || !pRef.current) continue;
        for (const [eId, eData] of eMap.entries()) {
          if (!eData.ref || !eData.ref.current) continue;
          
          const dist = pRef.current.position.distanceTo(eData.ref.current.position);
          if (dist < 2.0) {
             hitEnemyId = eId;
             hitProjectileId = pId;
             hitCorrect = eData.isCorrect;
             break;
          }
        }
        if (hitEnemyId) break;
      }

      if (hitEnemyId) {
        handleHit(hitEnemyId, hitProjectileId, hitCorrect);
      }
      
      // Enemy -> Player collision
      let playerHitId = null;
      for (const [eId, eData] of eMap.entries()) {
        if (!eData.ref || !eData.ref.current) continue;
        const dist = camera.position.distanceTo(eData.ref.current.position);
        if (dist < 2.0) {
           playerHitId = eId;
           break;
        }
      }
      
      if (playerHitId) {
        handlePlayerHit(playerHitId);
      }
    });
    return null;
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
      <Canvas shadows camera={{ fov: 75 }}>
        <ResetCamera started={started} />
        <Environment />
        {started && !gameOver && (
          <>
            <Player addProjectile={addProjectile} isLocked={isLocked} />
            {projectiles.map(p => (
               <Projectile key={p.id} {...p} registerProjectile={registerProjectile} removeProjectile={removeProjectile} isLocked={isLocked} />
            ))}
            {enemies.map(e => (
               <Enemy key={e.id} {...e} registerEnemy={registerEnemy} isLocked={isLocked} />
            ))}
            <CollisionSystem />
          </>
        )}
      </Canvas>

      {/* Fullscreen UI Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
        
        {/* Hit Flash */}
        <div style={{
           position: 'absolute', inset: 0, 
           backgroundColor: flash === 'red' ? 'rgba(255,0,0,0.4)' : flash === 'green' ? 'rgba(0,255,0,0.4)' : 'transparent',
           transition: 'background-color 0.1s'
        }} />

        {/* HUD */}
        {started && !gameOver && (
          <>
             <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontSize: '32px', fontFamily: 'monospace', textShadow: '2px 2px 0 #000' }}>
                Health: {'❤️'.repeat(health)}
             </div>
             <div style={{ position: 'absolute', top: 20, right: 150, color: 'white', fontSize: '32px', fontFamily: 'monospace', textShadow: '2px 2px 0 #000' }}>
                Score: {score}
             </div>
             {problem && (
                <div style={{ 
                   position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', 
                   color: '#ffcc00', fontSize: '64px', fontWeight: 'bold', fontFamily: 'sans-serif', 
                   textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                   textAlign: 'center'
                }}>
                   {problem.text}
                </div>
             )}
             
             {/* Crosshair */}
             <div style={{ 
                 position: 'absolute', top: '50%', left: '50%', width: '10px', height: '10px', 
                 backgroundColor: 'white', borderRadius: '50%', transform: 'translate(-50%, -50%)', 
                 mixBlendMode: 'difference' 
             }} />

             <div style={{ position: 'absolute', bottom: 20, right: 20, color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>
                (ESC drücken für Menü)
             </div>
          </>
        )}
      </div>

      {/* Interactive Menus */}
      {!started && !gameOver && (
         <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 20 }}>
            <h1 style={{ color: 'white', fontSize: '80px', marginBottom: '40px', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '4px' }}>FaskaDoom</h1>
            <p style={{ color: '#ccc', marginBottom: '40px', fontSize: '24px' }}>WASD zum Bewegen. Klicken zum Schießen. Löse die Matheaufgaben!</p>
            <button onClick={startGame} style={btnStyle}>Spiel Starten</button>
         </div>
      )}

      {gameOver && (
         <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(150,0,0,0.8)', zIndex: 20 }}>
            <h1 style={{ color: 'white', fontSize: '80px', marginBottom: '20px', fontFamily: 'sans-serif', textTransform: 'uppercase' }}>Game Over</h1>
            <p style={{ color: 'white', fontSize: '40px', marginBottom: '40px' }}>Final Score: {score}</p>
            <button onClick={startGame} style={btnStyle}>Nochmal Spielen</button>
         </div>
      )}

      {started && !gameOver && !isLocked && (
         <div style={{ 
             position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', 
             backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 15, pointerEvents: 'none' 
         }}>
            <div style={{ color: 'white', fontSize: '40px', padding: '30px', border: '4px solid white', backgroundColor: 'black', textTransform: 'uppercase' }}>
               Klicken um fortzufahren
            </div>
         </div>
      )}

      {/* Exit Button */}
      <button onClick={() => {
          if (document.pointerLockElement) document.exitPointerLock();
          if (onExit) onExit();
      }} style={{ ...btnStyle, position: 'absolute', top: 20, right: 20, fontSize: '16px', padding: '10px 20px', zIndex: 50 }}>
         Beenden
      </button>
    </div>
  );
}
