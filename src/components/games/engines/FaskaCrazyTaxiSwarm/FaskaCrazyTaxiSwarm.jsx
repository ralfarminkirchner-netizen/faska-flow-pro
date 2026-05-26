import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const DESTINATIONS = [
  { country: 'France', flag: '🇫🇷', landmark: 'Eiffel Tower', color: '#3b82f6' },
  { country: 'USA', flag: '🇺🇸', landmark: 'Statue of Liberty', color: '#ef4444' },
  { country: 'Japan', flag: '🇯🇵', landmark: 'Tokyo Tower', color: '#f8fafc' },
  { country: 'Italy', flag: '🇮🇹', landmark: 'Colosseum', color: '#22c55e' },
  { country: 'UK', flag: '🇬🇧', landmark: 'Big Ben', color: '#1e3a8a' },
  { country: 'Brazil', flag: '🇧🇷', landmark: 'Christ the Redeemer', color: '#eab308' },
  { country: 'Egypt', flag: '🇪🇬', landmark: 'Pyramids', color: '#f59e0b' },
  { country: 'Germany', flag: '🇩🇪', landmark: 'Brandenburg Gate', color: '#64748b' }
];

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const useKeys = () => {
  const [keys, setKeys] = useState({});
  useEffect(() => {
    const handleKeyDown = (e) => setKeys((k) => ({ ...k, [e.code]: true }));
    const handleKeyUp = (e) => setKeys((k) => ({ ...k, [e.code]: false }));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  return keys;
};

const spawnPassenger = (buildings) => {
  const destBuildings = buildings.filter(b => b.isDestination);
  const target = destBuildings[Math.floor(Math.random() * destBuildings.length)];
  
  const isXRoad = Math.random() > 0.5;
  const roadPos = [-80, -40, 0, 40, 80][Math.floor(Math.random() * 5)];
  const crossPos = (Math.random() - 0.5) * 200;
  
  let px, pz;
  if (isXRoad) {
    px = crossPos;
    pz = roadPos;
  } else {
    px = roadPos;
    pz = crossPos;
  }
  
  return {
    position: [px, 1, pz],
    targetData: target.destData,
    targetBuildingId: target.id,
    active: true,
  };
};

const generateMap = () => {
  const buildings = [];
  const ramps = [];
  let destIndex = 0;
  
  for (let x = -100; x <= 100; x += 40) {
    for (let z = -100; z <= 100; z += 40) {
      if (Math.random() < 0.2 && x !== 0 && z !== 0) {
        // spawn a jump pad / ramp
        ramps.push({
          position: [x, 0, z],
          rotation: [0, 0, 0], // simplified pad
        });
        continue;
      }
      
      const width = 20 + Math.random() * 10;
      const depth = 20 + Math.random() * 10;
      const height = 15 + Math.random() * 40;
      
      let isDestination = false;
      let destData = null;
      // Guarantee all destinations are placed
      if ((Math.random() < 0.3 || x === 100) && destIndex < DESTINATIONS.length) {
        isDestination = true;
        destData = DESTINATIONS[destIndex];
        destIndex++;
      }
      
      buildings.push({
        id: `b_${x}_${z}`,
        position: [x, height / 2, z],
        size: [width, height, depth],
        isDestination,
        destData
      });
    }
  }
  
  while (destIndex < DESTINATIONS.length) {
    const b = buildings[Math.floor(Math.random() * buildings.length)];
    if (!b.isDestination) {
      b.isDestination = true;
      b.destData = DESTINATIONS[destIndex];
      destIndex++;
    }
  }
  
  return { buildings, ramps };
};

const Car = ({ mapData, gameStateRef, updateGameState }) => {
  const meshRef = useRef();
  const keys = useKeys();
  const { camera } = useThree();
  
  const state = useRef({
    pos: new THREE.Vector3(0, 1, 0),
    vel: new THREE.Vector3(0, 0, 0),
    rotation: 0,
    speed: 0,
    isOnGround: true,
  });
  
  useFrame((_, delta) => {
    if (gameStateRef.current.gameOver) return;
    const dt = clamp(delta, 0.001, 0.1);
    
    const accel = 60;
    const maxSpeed = 45;
    const maxReverse = 25;
    const friction = 25;
    const steerSpeed = 3.5;
    const gravity = -60;
    const jumpForce = 20;
    
    let forward = 0;
    if (keys['KeyW'] || keys['ArrowUp']) forward += 1;
    if (keys['KeyS'] || keys['ArrowDown']) forward -= 1;
    
    let turn = 0;
    if (keys['KeyA'] || keys['ArrowLeft']) turn += 1;
    if (keys['KeyD'] || keys['ArrowRight']) turn -= 1;
    
    if (forward > 0) {
      state.current.speed += accel * dt;
    } else if (forward < 0) {
      state.current.speed -= accel * dt;
    } else {
      if (state.current.speed > 0) {
        state.current.speed -= friction * dt;
        if (state.current.speed < 0) state.current.speed = 0;
      } else if (state.current.speed < 0) {
        state.current.speed += friction * dt;
        if (state.current.speed > 0) state.current.speed = 0;
      }
    }
    
    state.current.speed = clamp(state.current.speed, -maxReverse, maxSpeed);
    
    if (Math.abs(state.current.speed) > 1) {
       const turnDir = state.current.speed > 0 ? 1 : -1;
       state.current.rotation += turn * steerSpeed * turnDir * dt * (Math.abs(state.current.speed)/maxSpeed * 0.5 + 0.5);
    }
    
    const dir = new THREE.Vector3(Math.sin(state.current.rotation), 0, Math.cos(state.current.rotation));
    
    state.current.pos.x += dir.x * state.current.speed * dt;
    state.current.pos.z += dir.z * state.current.speed * dt;
    
    if (state.current.isOnGround) {
      if (keys['Space']) {
        state.current.vel.y = jumpForce;
        state.current.isOnGround = false;
      } else {
        state.current.vel.y = 0;
      }
    } else {
      state.current.vel.y += gravity * dt;
    }
    
    state.current.pos.y += state.current.vel.y * dt;
    if (state.current.pos.y < 1) {
      state.current.pos.y = 1;
      state.current.isOnGround = true;
    }
    
    // Building collision
    mapData.buildings.forEach(b => {
      const hw = b.size[0] / 2;
      const hd = b.size[2] / 2;
      const dx = state.current.pos.x - b.position[0];
      const dz = state.current.pos.z - b.position[2];
      
      if (Math.abs(dx) < hw + 1.5 && Math.abs(dz) < hd + 1.5 && state.current.pos.y < b.size[1]) {
        const penX = (hw + 1.5) - Math.abs(dx);
        const penZ = (hd + 1.5) - Math.abs(dz);
        if (penX < penZ) {
          state.current.pos.x += Math.sign(dx) * penX;
          state.current.speed *= 0.5;
        } else {
          state.current.pos.z += Math.sign(dz) * penZ;
          state.current.speed *= 0.5;
        }
      }
    });
    
    // Jump pads
    mapData.ramps.forEach(r => {
       const dx = state.current.pos.x - r.position[0];
       const dz = state.current.pos.z - r.position[2];
       if (Math.abs(dx) < 6 && Math.abs(dz) < 6 && state.current.isOnGround) {
          state.current.vel.y = 25;
          state.current.isOnGround = false;
          state.current.speed = Math.max(state.current.speed + 10, 35);
       }
    });
    
    // Passenger logic
    if (mapData.passenger.active && !gameStateRef.current.hasPassenger) {
      const p = mapData.passenger;
      const dist = Math.hypot(state.current.pos.x - p.position[0], state.current.pos.z - p.position[2]);
      if (dist < 5) {
        mapData.passenger.active = false;
        updateGameState({
          hasPassenger: true,
          message: "Passenger picked up! Hurry to the destination!",
          passengerMsg: `Take me to the ${p.targetData.landmark}! (${p.targetData.country})`
        });
      }
    } else if (gameStateRef.current.hasPassenger) {
       const p = mapData.passenger;
       const targetBldg = mapData.buildings.find(b => b.id === p.targetBuildingId);
       if (targetBldg) {
         const dx = state.current.pos.x - targetBldg.position[0];
         const dz = state.current.pos.z - targetBldg.position[2];
         if (Math.abs(dx) < targetBldg.size[0]/2 + 10 && Math.abs(dz) < targetBldg.size[2]/2 + 10) {
           updateGameState({
             hasPassenger: false,
             score: gameStateRef.current.score + 50,
             time: gameStateRef.current.time + 20,
             message: "Dropped off! +$50, +20s",
             passengerMsg: ""
           });
           
           setTimeout(() => {
             if (!gameStateRef.current.gameOver) {
               mapData.spawnNewPassenger();
               updateGameState({ message: "Find a new passenger!" });
             }
           }, 2000);
         }
       }
    }
    
    state.current.pos.x = clamp(state.current.pos.x, -145, 145);
    state.current.pos.z = clamp(state.current.pos.z, -145, 145);
    
    meshRef.current.position.copy(state.current.pos);
    meshRef.current.rotation.y = state.current.rotation;
    
    const idealOffset = new THREE.Vector3(0, 6, -15);
    idealOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), state.current.rotation);
    idealOffset.add(state.current.pos);
    
    camera.position.lerp(idealOffset, 0.1);
    camera.lookAt(state.current.pos.x, state.current.pos.y + 2, state.current.pos.z);
  });
  
  return (
    <group ref={meshRef}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 4]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
      <mesh position={[0, 1.25, -0.5]} castShadow>
        <boxGeometry args={[1.8, 0.8, 2]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.7, 0.5, 2.01]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position={[-0.7, 0.5, 2.01]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshBasicMaterial color="white" />
      </mesh>
      {gameStateRef.current.hasPassenger && (
        <Html position={[0, 3, 0]} center>
          <div style={{ background: 'white', padding: '2px 5px', borderRadius: '5px', fontSize: '20px' }}>
            🚕
          </div>
        </Html>
      )}
    </group>
  );
};

const Passenger = ({ passengerData, isPickedUp }) => {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    if (ref.current && passengerData.active) {
      ref.current.position.y = 1 + Math.sin(clock.elapsedTime * 5) * 0.2;
      ref.current.rotation.y += 0.05;
    }
  });
  
  if (!passengerData.active || isPickedUp) return null;
  
  return (
    <group ref={ref} position={passengerData.position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 8]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      <Html position={[0, 1.5, 0]} center>
        <div style={{ fontSize: '32px' }}>🙋</div>
      </Html>
      <Html position={[0, 2.5, 0]} center>
        <div style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '14px', whiteSpace: 'nowrap' }}>
          Taxi!
        </div>
      </Html>
    </group>
  );
};

const Buildings = ({ buildings }) => {
  return (
    <group>
      {buildings.map(b => (
        <group key={b.id} position={b.position}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={b.size} />
            <meshStandardMaterial color={b.isDestination ? b.destData.color : '#333333'} />
          </mesh>
          {b.isDestination && (
            <Html position={[0, b.size[1]/2 + 3, 0]} center zIndexRange={[100, 0]}>
              <div style={{
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '28px',
                textAlign: 'center',
                border: `3px solid ${b.destData.color}`,
                userSelect: 'none',
                pointerEvents: 'none',
                minWidth: '120px'
              }}>
                {b.destData.flag}<br/>
                <span style={{fontSize: '14px', fontWeight: 'bold'}}>{b.destData.country}</span>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
};

const Ramps = ({ ramps }) => {
  return (
    <group>
      {ramps.map((r, i) => (
        <mesh key={i} position={[r.position[0], 0.2, r.position[2]]} receiveShadow>
          <boxGeometry args={[12, 0.4, 12]} />
          <meshStandardMaterial color="#ff5500" emissive="#ff5500" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
};

const FaskaCrazyTaxiSwarm = ({ onExit }) => {
  const [gameState, setGameState] = useState({
    score: 0,
    time: 90,
    message: "Find a passenger!",
    passengerMsg: "",
    hasPassenger: false,
    gameOver: false,
  });
  
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  
  const mapDataRef = useRef(null);
  if (!mapDataRef.current) {
    const data = generateMap();
    data.spawnNewPassenger = () => {
      data.passenger = spawnPassenger(data.buildings);
    };
    data.spawnNewPassenger();
    mapDataRef.current = data;
  }
  
  const updateGameState = useCallback((updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.gameOver) {
          clearInterval(timer);
          return prev;
        }
        if (prev.time <= 1) {
          clearInterval(timer);
          return { ...prev, time: 0, gameOver: true, message: "Game Over! Out of time.", passengerMsg: "" };
        }
        return { ...prev, time: prev.time - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', background: '#87ceeb' }}>
      <Canvas shadows>
         <PerspectiveCamera makeDefault position={[0, 10, -20]} fov={60} />
         <Sky sunPosition={[100, 20, 100]} />
         <ambientLight intensity={0.4} />
         <directionalLight position={[50, 100, 50]} castShadow intensity={1} shadow-mapSize={[2048, 2048]}>
            <orthographicCamera attach="shadow-camera" args={[-150, 150, 150, -150]} />
         </directionalLight>
         
         <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
           <planeGeometry args={[300, 300]} />
           <meshStandardMaterial color="#222" />
         </mesh>
         
         <Buildings buildings={mapDataRef.current.buildings} />
         <Ramps ramps={mapDataRef.current.ramps} />
         <Passenger passengerData={mapDataRef.current.passenger} isPickedUp={gameState.hasPassenger} />
         
         <Car mapData={mapDataRef.current} gameStateRef={gameStateRef} updateGameState={updateGameState} />
      </Canvas>
      
      <div style={{
        position: 'absolute', top: 20, left: 20, 
        color: 'white', fontFamily: 'sans-serif',
        textShadow: '2px 2px 0 #000',
        pointerEvents: 'none',
        zIndex: 10
      }}>
        <h1 style={{ margin: 0, fontSize: '36px', color: '#facc15', textTransform: 'uppercase', fontStyle: 'italic' }}>
          Faska Crazy Taxi
        </h1>
        <div style={{ fontSize: '28px', marginTop: '10px', fontWeight: 'bold' }}>
           Time: <span style={{ color: gameState.time <= 10 ? '#ef4444' : 'white' }}>{gameState.time}s</span>
        </div>
        <div style={{ fontSize: '28px', marginTop: '5px', fontWeight: 'bold' }}>
           Cash: <span style={{ color: '#4ade80' }}>${gameState.score}</span>
        </div>
        
        <div style={{ marginTop: '20px', fontSize: '22px', fontWeight: 'bold', color: '#facc15' }}>
           {gameState.message}
        </div>
        
        {gameState.passengerMsg && (
          <div style={{
            marginTop: '15px', padding: '15px', background: 'rgba(255,255,255,0.95)', 
            color: '#111', borderRadius: '12px', border: '4px solid #3b82f6',
            textShadow: 'none', fontSize: '22px', fontWeight: 'bold',
            maxWidth: '400px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
          }}>
            💬 "{gameState.passengerMsg}"
          </div>
        )}
        
        {gameState.gameOver && (
          <div style={{
            marginTop: '30px', padding: '20px', background: 'rgba(0,0,0,0.8)',
            border: '4px solid #ef4444', borderRadius: '12px',
            fontSize: '32px', color: '#ef4444', fontWeight: 'bold',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
            GAME OVER!<br/>
            <span style={{ color: 'white', fontSize: '24px' }}>Final Score: ${gameState.score}</span>
          </div>
        )}
      </div>
      
      <button 
        onClick={onExit}
        style={{
          position: 'absolute', top: 20, right: 20,
          padding: '12px 24px', fontSize: '20px',
          fontWeight: 'bold', background: '#ef4444', color: 'white',
          border: '2px solid white', borderRadius: '8px', cursor: 'pointer',
          zIndex: 20, boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
          textTransform: 'uppercase'
        }}
        onMouseOver={e => e.target.style.background = '#dc2626'}
        onMouseOut={e => e.target.style.background = '#ef4444'}
      >
        Beenden
      </button>
      
      <div style={{
        position: 'absolute', bottom: 20, right: 20,
        color: 'white', fontFamily: 'sans-serif',
        textShadow: '2px 2px 0 #000',
        pointerEvents: 'none', zIndex: 10,
        textAlign: 'right', fontSize: '18px', fontWeight: 'bold'
      }}>
        <span style={{ color: '#facc15' }}>W A S D</span> / <span style={{ color: '#facc15' }}>Arrows</span> to Drive<br/>
        <span style={{ color: '#facc15' }}>SPACE</span> to Jump / Trick
      </div>
    </div>
  );
};

export default FaskaCrazyTaxiSwarm;
