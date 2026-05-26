import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const GameContext = createContext();

const dates = [
  { year: "1492", text: "Columbus reaches the Americas", pos: [-8, 0, -8] },
  { year: "1789", text: "French Revolution", pos: [8, 0, -8] },
  { year: "1914", text: "Start of WWI", pos: [8, 0, 8] },
  { year: "1945", text: "End of WWII", pos: [-8, 0, 8] },
  { year: "1969", text: "Moon Landing", pos: [0, 0, 0] }
];

const crates = [
  [-4, 1, -4],
  [4, 1, -4],
  [-4, 1, 4],
  [4, 1, 4],
  [0, 1, -6],
  [0, 1, 6],
  [-6, 1, 0],
  [6, 1, 0],
  [-10, 1, 0],
  [10, 1, 0]
];

const guardPaths = [
  [[-6, 0, -4], [-6, 0, 4]],
  [[6, 0, 4], [6, 0, -4]],
  [[-2, 0, 2], [2, 0, 2]],
  [[-8, 0, -2], [-10, 0, -2]]
];

// Custom Hook for WASD / Arrow Keys
function useKeys() {
  const [keys, setKeys] = useState({ forward: false, backward: false, left: false, right: false });
  
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'w' || e.key === 'ArrowUp') setKeys(k => ({...k, forward: true}));
      if (e.key === 's' || e.key === 'ArrowDown') setKeys(k => ({...k, backward: true}));
      if (e.key === 'a' || e.key === 'ArrowLeft') setKeys(k => ({...k, left: true}));
      if (e.key === 'd' || e.key === 'ArrowRight') setKeys(k => ({...k, right: true}));
    };
    const up = (e) => {
      if (e.key === 'w' || e.key === 'ArrowUp') setKeys(k => ({...k, forward: false}));
      if (e.key === 's' || e.key === 'ArrowDown') setKeys(k => ({...k, backward: false}));
      if (e.key === 'a' || e.key === 'ArrowLeft') setKeys(k => ({...k, left: false}));
      if (e.key === 'd' || e.key === 'ArrowRight') setKeys(k => ({...k, right: false}));
    };
    
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { 
      window.removeEventListener('keydown', down); 
      window.removeEventListener('keyup', up); 
    }
  }, []);
  
  return keys;
}

// Player Component
const Player = ({ startPos }) => {
  const ref = useRef();
  const keys = useKeys();
  const { setPlayerPos, gameState } = useContext(GameContext);

  useFrame(() => {
    if (!ref.current || gameState !== 'playing') return;
    
    const speed = 6;
    const linvel = ref.current.linvel();
    let dx = 0;
    let dz = 0;
    
    if (keys.forward) dz -= 1;
    if (keys.backward) dz += 1;
    if (keys.left) dx -= 1;
    if (keys.right) dx += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dz !== 0) {
      const length = Math.sqrt(dx*dx + dz*dz);
      dx /= length;
      dz /= length;
    }

    ref.current.setLinvel({ x: dx * speed, y: linvel.y, z: dz * speed }, true);
    setPlayerPos(ref.current.translation());
  });

  return (
    <RigidBody ref={ref} position={startPos} lockRotations type="dynamic" colliders="ball" name="player">
      <mesh castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#0088ff" />
      </mesh>
    </RigidBody>
  );
};

// Guard Component
const Guard = ({ path }) => {
  const groupRef = useRef();
  const [targetIdx, setTargetIdx] = useState(0);
  const { playerPos, onCaught, gameState } = useContext(GameContext);
  const { scene } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current || gameState !== 'playing') return;
    
    const pos = groupRef.current.position;
    const target = path[targetIdx];
    const dir = new THREE.Vector3(target[0] - pos.x, 0, target[2] - pos.z);
    const dist = dir.length();
    
    if (dist < 0.1) {
      setTargetIdx((targetIdx + 1) % path.length);
    } else {
      dir.normalize();
      pos.add(dir.clone().multiplyScalar(3 * delta)); // Guard speed
      const angle = Math.atan2(dir.x, dir.z);
      groupRef.current.rotation.y = angle;
    }

    if (!playerPos) return;

    // Vision Raycasting Logic
    const pPos = new THREE.Vector3(playerPos.x, playerPos.y, playerPos.z);
    const gPos = groupRef.current.position.clone().add(new THREE.Vector3(0, 1, 0)); // Guard eye level
    pPos.y = 1; // Target player's center height
    
    const distToPlayer = gPos.distanceTo(pPos);
    
    // Check if player is within vision distance
    if (distToPlayer < 7) {
      const dirToPlayer = pPos.clone().sub(gPos).normalize();
      const gDir = new THREE.Vector3(0, 0, 1).applyEuler(groupRef.current.rotation).normalize();
      const angleToPlayer = gDir.angleTo(dirToPlayer);
      
      // Check if player is within the cone angle
      if (angleToPlayer < Math.PI / 4) { // 45 degree half-angle
        const raycaster = new THREE.Raycaster(gPos, dirToPlayer, 0, distToPlayer);
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        let sightBlocked = false;
        for (let hit of intersects) {
           // Check against crates/walls tagged with isObstacle
           if (hit.object.userData?.isObstacle) {
             sightBlocked = true;
             break;
           }
        }
        
        if (!sightBlocked) {
          onCaught();
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={path[0]}>
      {/* Body */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 2, 16]} />
        <meshStandardMaterial color="#cc0000" />
      </mesh>
      {/* Visor/Eyes */}
      <mesh position={[0, 1.5, 0.4]}>
         <boxGeometry args={[0.6, 0.2, 0.2]} />
         <meshStandardMaterial color="#111" />
      </mesh>
      {/* Vision Cone Visualization */}
      <mesh position={[0, 1, 3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[3.5, 7, 16, 1, true]} />
        <meshBasicMaterial color="red" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// Educational Date Pad Component
const DatePad = ({ dateInfo, index }) => {
  const { currentObjective, onDateCollected } = useContext(GameContext);
  const isTarget = currentObjective === index;
  const isCollected = currentObjective > index;

  return (
    <group position={dateInfo.pos}>
      <RigidBody type="fixed" colliders="cuboid" sensor onIntersectionEnter={(e) => {
        // Collect if player steps on it and it's the current target
        if (e.other.rigidBodyObject?.name === 'player' && isTarget) {
          onDateCollected(index);
        }
      }}>
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[2, 0.2, 2]} />
          <meshStandardMaterial color={isCollected ? '#555' : (isTarget ? '#00ffaa' : '#aaaaaa')} />
        </mesh>
      </RigidBody>
      
      {/* Date Text */}
      <Text position={[0, 0.25, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.4} color="black" anchorX="center" anchorY="middle">
        {dateInfo.year}
      </Text>
      
      {/* Target Marker */}
      {isTarget && (
        <Text position={[0, 1.5, 0]} fontSize={0.3} color="white" outlineColor="black" outlineWidth={0.05}>
          TARGET
        </Text>
      )}
    </group>
  );
};

// Camera Controller
const CameraFollow = () => {
  const { playerPos } = useContext(GameContext);
  const vec = new THREE.Vector3();
  
  useFrame((state) => {
    if (playerPos) {
      // Keep a top-down isometric offset
      const targetPos = vec.set(playerPos.x, playerPos.y + 14, playerPos.z + 12);
      state.camera.position.lerp(targetPos, 0.1);
      state.camera.lookAt(playerPos.x, playerPos.y, playerPos.z);
    }
  });
  
  return null;
};

// Main Entry Component
export default function FaskaSolid({ onExit }) {
  const [gameState, setGameState] = useState('playing'); // 'playing', 'caught', 'won'
  const [currentObjective, setCurrentObjective] = useState(0);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 2, z: 12 });

  const onCaught = () => {
    if (gameState === 'playing') {
      setGameState('caught');
    }
  };

  const onDateCollected = (index) => {
    if (index === currentObjective) {
      if (index === dates.length - 1) {
        setGameState('won');
      } else {
        setCurrentObjective(idx => idx + 1);
      }
    }
  };

  const resetGame = () => {
    setGameState('playing');
    setCurrentObjective(0);
    setPlayerPos({ x: 0, y: 2, z: 12 });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#111' }}>
      
      {/* UI Overlay */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, color: 'white', fontFamily: 'monospace', textShadow: '1px 1px 2px black' }}>
        <h1 style={{ margin: 0, color: '#00ffcc' }}>FaskaSolid</h1>
        <p>Sneak past the guards and learn history!</p>
        <div style={{ marginTop: 10, padding: 15, background: 'rgba(0,0,0,0.7)', borderRadius: 8, border: '1px solid #333' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#aaa' }}>Current Objective:</h3>
          {currentObjective < dates.length ? (
            <p style={{ margin: 0, fontSize: 18, color: '#00ffaa', fontWeight: 'bold' }}>
              Find {dates[currentObjective].year}: <br/>
              <span style={{color: 'white', fontSize: 14}}>{dates[currentObjective].text}</span>
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: 20, color: 'gold', fontWeight: 'bold' }}>All Dates Collected!</p>
          )}
        </div>
      </div>

      {/* Exit Button */}
      <button
        onClick={onExit}
        style={{
          position: 'absolute', top: 20, right: 20, zIndex: 10,
          padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
          backgroundColor: '#ff3333', color: 'white', border: 'none',
          borderRadius: '5px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}
      >
        Beenden
      </button>

      {/* Game Over Overlay */}
      {gameState === 'caught' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(200, 0, 0, 0.6)', zIndex: 20,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '6rem', color: 'white', textShadow: '4px 4px 0 #000', margin: 0 }}>CAUGHT!</h1>
          <button onClick={resetGame} style={{ 
            marginTop: 30, padding: '15px 30px', fontSize: '20px', fontWeight: 'bold',
            cursor: 'pointer', border: 'none', borderRadius: 8, backgroundColor: 'white', color: 'red'
          }}>
            Restart Mission
          </button>
        </div>
      )}

      {/* Victory Overlay */}
      {gameState === 'won' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 200, 0, 0.6)', zIndex: 20,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '5rem', color: 'white', textShadow: '4px 4px 0 #000', margin: 0 }}>MISSION ACCOMPLISHED</h1>
          <p style={{ color: 'white', fontSize: '1.5rem', background: 'rgba(0,0,0,0.8)', padding: 15, borderRadius: 8, marginTop: 20 }}>
            History secured. Excellent work, agent.
          </p>
          <button onClick={resetGame} style={{ 
            marginTop: 30, padding: '15px 30px', fontSize: '20px', fontWeight: 'bold',
            cursor: 'pointer', border: 'none', borderRadius: 8, backgroundColor: 'white', color: 'green'
          }}>
            Play Again
          </button>
        </div>
      )}

      {/* 3D Scene */}
      <GameContext.Provider value={{ gameState, currentObjective, playerPos, setPlayerPos, onCaught, onDateCollected }}>
        <Canvas camera={{ position: [0, 15, 15], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
          
          <Physics key={gameState === 'playing' ? 'playing' : 'stopped'}>
            
            {/* Player Instance */}
            {gameState === 'playing' && <Player startPos={[0, 2, 12]} />}

            {/* Guard Instances */}
            {gameState === 'playing' && guardPaths.map((path, i) => (
              <Guard key={`guard-${i}`} path={path} />
            ))}

            {/* Stealth Crates / Obstacles */}
            {crates.map((pos, i) => (
              <RigidBody key={`crate-${i}`} type="fixed" colliders="cuboid">
                {/* Notice the userData={isObstacle} for raycaster line-of-sight checking */}
                <mesh position={pos} userData={{ isObstacle: true }} castShadow receiveShadow>
                  <boxGeometry args={[2, 2, 2]} />
                  <meshStandardMaterial color="#8B4513" />
                </mesh>
              </RigidBody>
            ))}

            {/* Checkpoint Dates */}
            {dates.map((date, i) => (
              <DatePad key={`date-${i}`} dateInfo={date} index={i} />
            ))}

            {/* Level Floor */}
            <RigidBody type="fixed">
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow userData={{ isObstacle: true }}>
                <planeGeometry args={[40, 40]} />
                <meshStandardMaterial color="#2a2a2a" />
              </mesh>
            </RigidBody>

            {/* Level Boundaries */}
            <RigidBody type="fixed">
              <mesh position={[0, 2, -15]} userData={{ isObstacle: true }} receiveShadow castShadow>
                <boxGeometry args={[30, 4, 1]} />
                <meshStandardMaterial color="#444" />
              </mesh>
              <mesh position={[0, 2, 15]} userData={{ isObstacle: true }} receiveShadow castShadow>
                <boxGeometry args={[30, 4, 1]} />
                <meshStandardMaterial color="#444" />
              </mesh>
              <mesh position={[-15, 2, 0]} userData={{ isObstacle: true }} receiveShadow castShadow>
                <boxGeometry args={[1, 4, 30]} />
                <meshStandardMaterial color="#444" />
              </mesh>
              <mesh position={[15, 2, 0]} userData={{ isObstacle: true }} receiveShadow castShadow>
                <boxGeometry args={[1, 4, 30]} />
                <meshStandardMaterial color="#444" />
              </mesh>
            </RigidBody>

          </Physics>

          <CameraFollow />
        </Canvas>
      </GameContext.Provider>
    </div>
  );
}
