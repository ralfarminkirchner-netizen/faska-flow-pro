import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Sky, Text } from '@react-three/drei';
import { Physics, RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';

const BLOCK_SIZE = 4;
const MAP = [
  "WWWWWWWWWW",
  "W P W    W",
  "W   W  C W",
  "WW WWW   W",
  "W  E W   W",
  "W WWWW   W",
  "W    W E W",
  "WWWW W   W",
  "WX D     W",
  "WWWWWWWWWW"
];

// --- Procedural Textures --- //

function generateBrickTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  
  // Base color
  ctx.fillStyle = '#5c4033'; 
  ctx.fillRect(0, 0, 128, 128);
  
  // Mortar lines
  ctx.fillStyle = '#b0a090';
  for (let y = 0; y < 128; y += 32) {
    ctx.fillRect(0, y, 128, 2); // Horizontal lines
    const offset = (y / 32) % 2 === 0 ? 0 : 32;
    for (let x = 0; x < 128; x += 64) {
      let vx = x + offset;
      if (vx > 128) vx -= 128;
      ctx.fillRect(vx, y, 2, 32); // Vertical lines
    }
  }
  
  // Noise
  for (let i = 0; i < 500; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.15})`;
    ctx.fillRect(Math.random() * 128, Math.random() * 128, 2, 2);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  return texture;
}

function generateFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#223322';
  ctx.fillRect(0, 0, 128, 128);
  
  for (let i = 0; i < 800; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.3})`;
    ctx.fillRect(Math.random() * 128, Math.random() * 128, 4, 4);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  return texture;
}

function generateEnemyTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  
  // Transparent background
  ctx.clearRect(0, 0, 128, 128);
  
  // Body
  ctx.fillStyle = '#2a4a2a';
  ctx.beginPath();
  ctx.arc(64, 80, 40, 0, Math.PI * 2);
  ctx.fill();
  
  // Head
  ctx.fillStyle = '#3a6a3a';
  ctx.beginPath();
  ctx.arc(64, 48, 30, 0, Math.PI * 2);
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = '#ff2222';
  ctx.beginPath();
  ctx.arc(50, 45, 6, 0, Math.PI * 2);
  ctx.arc(78, 45, 6, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  ctx.fillStyle = '#000';
  ctx.fillRect(54, 60, 20, 4);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  return texture;
}


// --- Game Components --- //

const Player = ({ startPos, doorPos, winPos, setNearDoor, gameState, gameStateRef }) => {
  const bodyRef = useRef();
  const { camera } = useThree();
  const speed = 15;
  const moveState = useRef({ forward: false, backward: false, left: false, right: false });
  const [recoil, setRecoil] = useState(0);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (gameStateRef.current !== 'playing') return;
      switch(e.code) {
        case 'KeyW': moveState.current.forward = true; break;
        case 'KeyS': moveState.current.backward = true; break;
        case 'KeyA': moveState.current.left = true; break;
        case 'KeyD': moveState.current.right = true; break;
      }
    };
    const onKeyUp = (e) => {
      switch(e.code) {
        case 'KeyW': moveState.current.forward = false; break;
        case 'KeyS': moveState.current.backward = false; break;
        case 'KeyA': moveState.current.left = false; break;
        case 'KeyD': moveState.current.right = false; break;
      }
    };
    const onMouseDown = () => {
      if (gameStateRef.current === 'playing') {
        setRecoil(0.15); // Screen shake juice
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [gameStateRef]);

  const nearDoorRef = useRef(false);

  useFrame(() => {
    if (!bodyRef.current) return;
    const p = bodyRef.current.translation();
    
    // Check distance to door
    const distToDoor = Math.hypot(p.x - doorPos[0], p.z - doorPos[2]);
    const isNearDoor = distToDoor < 5;
    if (isNearDoor !== nearDoorRef.current) {
      nearDoorRef.current = isNearDoor;
      setNearDoor(isNearDoor);
    }
    
    // Check win condition
    const distToWin = Math.hypot(p.x - winPos[0], p.z - winPos[2]);
    if (distToWin < 3 && gameStateRef.current === 'playing') {
      document.dispatchEvent(new CustomEvent('GAME_WON'));
    }

    if (gameStateRef.current !== 'playing') {
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    // Movement
    const velocity = bodyRef.current.linvel();
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    const cameraRight = new THREE.Vector3().crossVectors(camera.up, cameraDirection).normalize();
    
    const moveDir = new THREE.Vector3();
    if (moveState.current.forward) moveDir.add(cameraDirection);
    if (moveState.current.backward) moveDir.sub(cameraDirection);
    if (moveState.current.left) moveDir.add(cameraRight);
    if (moveState.current.right) moveDir.sub(cameraRight);
    
    if (moveDir.lengthSq() > 0) {
      moveDir.normalize().multiplyScalar(speed);
    }
    
    bodyRef.current.setLinvel({ x: moveDir.x, y: velocity.y, z: moveDir.z }, true);
    
    // Apply recoil / screen shake
    let shakeOffset = 0;
    if (recoil > 0) {
      shakeOffset = (Math.random() - 0.5) * recoil;
      setRecoil(r => (r * 0.8 < 0.01 ? 0 : r * 0.8));
    }
    
    camera.position.set(p.x, p.y + 0.8 + shakeOffset, p.z);
  });

  return (
    <RigidBody ref={bodyRef} position={startPos} colliders={false} mass={1} type="dynamic" enabledRotations={[false, false, false]}>
      {/* Rapier CapsuleCollider args: [halfHeight, radius] */}
      <CapsuleCollider args={[0.7, 0.4]} />
    </RigidBody>
  );
};

const Clue = ({ position }) => {
  return (
    <group position={position}>
      <RigidBody type="fixed">
        <mesh position={[0, BLOCK_SIZE/2, 0]}>
          <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]} />
          <meshStandardMaterial color="#444" />
        </mesh>
      </RigidBody>
      <group position={[0, BLOCK_SIZE/2, 0]}>
        {/* +Z Face */}
        <Text position={[0, 0.5, BLOCK_SIZE/2 + 0.01]} fontSize={0.4} color="yellow">Rome fell in</Text>
        <Text position={[0, -0.5, BLOCK_SIZE/2 + 0.01]} fontSize={0.8} color="yellow">476</Text>
        {/* -Z Face */}
        <Text position={[0, 0.5, -BLOCK_SIZE/2 - 0.01]} fontSize={0.4} color="yellow" rotation={[0, Math.PI, 0]}>Rome fell in</Text>
        <Text position={[0, -0.5, -BLOCK_SIZE/2 - 0.01]} fontSize={0.8} color="yellow" rotation={[0, Math.PI, 0]}>476</Text>
        {/* +X Face */}
        <Text position={[BLOCK_SIZE/2 + 0.01, 0.5, 0]} fontSize={0.4} color="yellow" rotation={[0, Math.PI/2, 0]}>Rome fell in</Text>
        <Text position={[BLOCK_SIZE/2 + 0.01, -0.5, 0]} fontSize={0.8} color="yellow" rotation={[0, Math.PI/2, 0]}>476</Text>
        {/* -X Face */}
        <Text position={[-BLOCK_SIZE/2 - 0.01, 0.5, 0]} fontSize={0.4} color="yellow" rotation={[0, -Math.PI/2, 0]}>Rome fell in</Text>
        <Text position={[-BLOCK_SIZE/2 - 0.01, -0.5, 0]} fontSize={0.8} color="yellow" rotation={[0, -Math.PI/2, 0]}>476</Text>
      </group>
    </group>
  );
};

const Door = ({ position, isUnlocked }) => {
  if (isUnlocked) return null;
  return (
    <RigidBody type="fixed" position={position}>
      <mesh position={[0, BLOCK_SIZE/2, 0]}>
        <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]} />
        <meshStandardMaterial color="#112233" />
        <Text position={[0, 0, BLOCK_SIZE/2 + 0.01]} fontSize={0.8} color="#ff4444">LOCKED</Text>
        <Text position={[0, 0, -BLOCK_SIZE/2 - 0.01]} fontSize={0.8} color="#ff4444" rotation={[0, Math.PI, 0]}>LOCKED</Text>
      </mesh>
    </RigidBody>
  );
};

const Enemy = ({ position, texture, onHit }) => {
  const [dead, setDead] = useState(false);
  const ref = useRef();
  
  useFrame((state) => {
    if (!dead && ref.current) {
      const camPos = state.camera.position;
      ref.current.lookAt(camPos.x, ref.current.position.y, camPos.z);
    }
  });

  const handleHit = (e) => {
    e.stopPropagation();
    if (!dead) {
      setDead(true);
      if (onHit) onHit(position);
    }
  };

  if (dead) return null;

  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, BLOCK_SIZE/2, 0]} visible={false}>
          <boxGeometry args={[BLOCK_SIZE*0.8, BLOCK_SIZE, BLOCK_SIZE*0.8]} />
        </mesh>
      </RigidBody>
      <mesh ref={ref} position={[0, BLOCK_SIZE/2, 0]} onPointerDown={handleHit}>
        <planeGeometry args={[BLOCK_SIZE * 0.8, BLOCK_SIZE * 0.8]} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const Level = ({ doorUnlocked, setNearDoor, gameState, gameStateRef }) => {
  const mapData = useMemo(() => {
    const data = {
      walls: [], clues: [], enemies: [],
      player: [0, 2, 0], door: [0, 0, 0], win: [0, 0, 0]
    };
    
    MAP.forEach((row, z) => {
      for (let x = 0; x < row.length; x++) {
        const char = row[x];
        const posX = x * BLOCK_SIZE;
        const posZ = z * BLOCK_SIZE;
        
        if (char === 'W') data.walls.push([posX, 0, posZ]);
        else if (char === 'P') data.player = [posX, 2, posZ];
        else if (char === 'E') data.enemies.push([posX, 0, posZ]);
        else if (char === 'C') data.clues.push([posX, 0, posZ]);
        else if (char === 'D') data.door = [posX, 0, posZ];
        else if (char === 'X') data.win = [posX, 0, posZ];
      }
    });
    return data;
  }, []);

  const brickTexture = useMemo(generateBrickTexture, []);
  
  const floorTexture = useMemo(() => {
    const tex = generateFloorTexture();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(MAP[0].length, MAP.length);
    return tex;
  }, []);

  const enemyTexture = useMemo(generateEnemyTexture, []);
  const [particles, setParticles] = useState([]);

  const handleEnemyHit = (pos) => {
    const newParts = Array.from({ length: 8 }).map(() => ({
      id: Math.random(),
      position: [
        pos[0] + (Math.random()-0.5)*2, 
        pos[1] + BLOCK_SIZE/2 + (Math.random()-0.5)*2, 
        pos[2] + (Math.random()-0.5)*2
      ]
    }));
    setParticles(prev => [...prev, ...newParts]);
  };

  const centerX = ((MAP[0].length - 1) * BLOCK_SIZE) / 2;
  const centerZ = ((MAP.length - 1) * BLOCK_SIZE) / 2;

  return (
    <Physics gravity={[0, -30, 0]}>
      {/* Floor */}
      <RigidBody type="fixed" position={[ centerX, 0, centerZ ]}>
        <mesh rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[MAP[0].length * BLOCK_SIZE, MAP.length * BLOCK_SIZE]} />
          <meshStandardMaterial map={floorTexture} />
        </mesh>
      </RigidBody>

      {/* Ceiling */}
      <mesh position={[ centerX, BLOCK_SIZE, centerZ ]} rotation={[Math.PI/2, 0, 0]}>
        <planeGeometry args={[MAP[0].length * BLOCK_SIZE, MAP.length * BLOCK_SIZE]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Walls */}
      {mapData.walls.map((pos, i) => (
        <RigidBody key={`wall-${i}`} type="fixed" position={pos}>
          <mesh position={[0, BLOCK_SIZE/2, 0]}>
            <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]} />
            <meshStandardMaterial map={brickTexture} />
          </mesh>
        </RigidBody>
      ))}

      {/* Clues */}
      {mapData.clues.map((pos, i) => (
        <Clue key={`clue-${i}`} position={pos} />
      ))}

      {/* Enemies */}
      {mapData.enemies.map((pos, i) => (
        <Enemy key={`enemy-${i}`} position={pos} texture={enemyTexture} onHit={handleEnemyHit} />
      ))}
      
      {/* Blood/Gore Particles */}
      {particles.map(p => (
        <RigidBody key={p.id} position={p.position} colliders="cuboid" mass={0.2}>
          <mesh>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#aa2222" />
          </mesh>
        </RigidBody>
      ))}

      <Door position={mapData.door} isUnlocked={doorUnlocked} />
      
      {/* Win Zone Marker */}
      <mesh position={[mapData.win[0], 0.05, mapData.win[2]]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[BLOCK_SIZE, BLOCK_SIZE]} />
        <meshStandardMaterial color="#44ff44" />
      </mesh>

      <Player 
        startPos={mapData.player} 
        doorPos={mapData.door} 
        winPos={mapData.win} 
        setNearDoor={setNearDoor}
        gameState={gameState}
        gameStateRef={gameStateRef}
      />
    </Physics>
  );
};


// --- Main Component --- //

export default function FaskaWolfSwarm({ onExit }) {
  // Game States: 'start', 'playing', 'paused', 'pin_input', 'won'
  const [gameState, setGameState] = useState('start');
  const [isDoorUnlocked, setIsDoorUnlocked] = useState(false);
  const [nearDoor, setNearDoor] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  
  const gameStateRef = useRef(gameState);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  // Handle keyboard interact event (E)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyE' && gameStateRef.current === 'playing' && nearDoor && !isDoorUnlocked) {
        setGameState('pin_input');
        document.exitPointerLock();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nearDoor, isDoorUnlocked]);

  // Listen for Win condition from Player
  useEffect(() => {
    const handleWin = () => {
      setGameState('won');
      document.exitPointerLock();
    };
    document.addEventListener('GAME_WON', handleWin);
    return () => document.removeEventListener('GAME_WON', handleWin);
  }, []);

  const checkPin = () => {
    if (pinInput === '476') {
      setIsDoorUnlocked(true);
      setGameState('paused'); // forces user to click Canvas to relock pointer
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Incorrect PIN! Try again.');
      setPinInput('');
    }
  };

  const cancelPin = () => {
    setGameState('paused');
    setPinInput('');
    setPinError('');
  };

  const overlayStyle = {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)', color: 'white',
    zIndex: 10, pointerEvents: 'none'
  };

  const interactiveOverlayStyle = {
    ...overlayStyle,
    pointerEvents: 'auto'
  };

  const btnStyle = {
    padding: '10px 25px', margin: '0 10px', fontSize: '18px', cursor: 'pointer',
    backgroundColor: '#333', color: 'white', border: '2px solid #aaa', borderRadius: '4px',
    textTransform: 'uppercase', fontWeight: 'bold'
  };

  // We only allow pointer events to canvas if we want the user to lock it.
  const canvasPointerEvents = (gameState === 'pin_input' || gameState === 'won') ? 'none' : 'auto';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#000', fontFamily: 'monospace' }}>
      
      {/* 3D Canvas Layer */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: canvasPointerEvents }}>
        <Canvas>
          <Sky sunPosition={[100, 20, 100]} turbidity={10} rayleigh={2} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 5]} intensity={1.5} />
          
          <Level 
            doorUnlocked={isDoorUnlocked} 
            setNearDoor={setNearDoor} 
            gameState={gameState} 
            gameStateRef={gameStateRef} 
          />
          
          <PointerLockControls 
            onUnlock={() => {
              if (gameStateRef.current === 'playing') setGameState('paused');
            }}
            onLock={() => {
              if (gameStateRef.current === 'paused' || gameStateRef.current === 'start') setGameState('playing');
            }}
          />
        </Canvas>
      </div>
      
      {/* Global Beenden Button */}
      <button 
        onClick={onExit}
        style={{
          position: 'absolute', top: 20, right: 20, zIndex: 1000, 
          padding: '10px 20px', fontSize: '16px', cursor: 'pointer',
          backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '5px',
          pointerEvents: 'auto', fontWeight: 'bold'
        }}>
        Beenden
      </button>
      
      {/* UI States */}
      {gameState === 'start' && (
        <div style={overlayStyle}>
          <h1 style={{ fontSize: '64px', marginBottom: '10px', color: '#ff4444' }}>FASKA WOLF SWARM</h1>
          <p style={{ fontSize: '24px', marginBottom: '20px' }}>Click anywhere to Start</p>
          <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <p><strong>WASD</strong> to move, <strong>Mouse</strong> to look & shoot</p>
            <p><strong>E</strong> to interact with objects</p>
            <p style={{ marginTop: '15px', color: '#aaa' }}>Find the Clue and escape the maze.</p>
          </div>
        </div>
      )}
      
      {gameState === 'paused' && (
        <div style={overlayStyle}>
          <h1 style={{ fontSize: '48px' }}>PAUSED</h1>
          <p style={{ fontSize: '24px' }}>Click anywhere to Resume</p>
        </div>
      )}

      {gameState === 'pin_input' && (
        <div style={interactiveOverlayStyle}>
          <div style={{ backgroundColor: '#222', padding: '40px', borderRadius: '10px', border: '2px solid #444', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>ENTER 3-DIGIT PIN</h2>
            <input 
              type="text" 
              maxLength={3} 
              value={pinInput} 
              onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))} // only numbers
              style={{ fontSize: '48px', padding: '10px', width: '120px', textAlign: 'center', marginBottom: '20px', backgroundColor: '#000', color: '#fff', border: '2px solid #555' }}
              autoFocus
            />
            {pinError && <p style={{ color: '#ff4444', fontSize: '18px', marginBottom: '20px' }}>{pinError}</p>}
            <div>
              <button onClick={checkPin} style={btnStyle}>Unlock</button>
              <button onClick={cancelPin} style={btnStyle}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'won' && (
        <div style={interactiveOverlayStyle}>
          <h1 style={{ fontSize: '64px', color: '#44ff44', marginBottom: '10px' }}>ESCAPE SUCCESSFUL!</h1>
          <p style={{ fontSize: '24px', marginBottom: '30px' }}>You survived the maze.</p>
          <button onClick={onExit} style={{ ...btnStyle, backgroundColor: '#44ff44', color: '#000' }}>Exit Game</button>
        </div>
      )}
      
      {/* HUD overlays */}
      {gameState === 'playing' && nearDoor && !isDoorUnlocked && (
        <div style={{ position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '24px', pointerEvents: 'none', backgroundColor: 'rgba(0,0,0,0.7)', padding: '10px 20px', borderRadius: '8px', border: '1px solid #555' }}>
          Press <strong>'E'</strong> to unlock door
        </div>
      )}

      {/* Crosshair */}
      {gameState === 'playing' && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', width: 8, height: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '50%',
          transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 5
        }} />
      )}
    </div>
  );
}
