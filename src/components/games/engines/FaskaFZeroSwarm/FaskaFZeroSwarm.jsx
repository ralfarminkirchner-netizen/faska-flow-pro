import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, KeyboardControls, useKeyboardControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const isPrime = (num) => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

const createHoopData = (zPos) => {
  const isP = Math.random() > 0.4;
  let num;
  do {
    num = Math.floor(Math.random() * 98) + 2;
  } while (isPrime(num) !== isP);

  return {
    x: (Math.random() - 0.5) * 30,
    z: zPos,
    number: num,
    isPrime: isP,
    hit: false,
    active: true,
    color: '#00ffff', 
  };
};

const MAX_HOOPS = 12;
const MAX_PARTICLES = 150;

const spawnParticles = (g, x, z, colorStr) => {
  const color = new THREE.Color(colorStr);
  let spawned = 0;
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const p = g.particles[i];
    if (p.life <= 0) {
      p.life = 0.5 + Math.random() * 0.8;
      p.x = x + (Math.random() - 0.5) * 3;
      p.y = 1.5 + (Math.random() - 0.5) * 3;
      p.z = z + (Math.random() - 0.5) * 3;
      const speed = 10 + Math.random() * 30;
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 2;
      p.vx = Math.cos(angle1) * Math.sin(angle2) * speed;
      p.vy = Math.sin(angle1) * speed;
      p.vz = Math.cos(angle2) * speed;
      p.color = color;
      p.scale = Math.random() * 0.8 + 0.2;
      spawned++;
      if (spawned > 30) break;
    }
  }
};

const Ship = ({ gameRef }) => {
  const shipMesh = useRef();
  const [, get] = useKeyboardControls();

  useFrame((state, delta) => {
    const keys = get();
    const g = gameRef.current;

    let ax = 0;
    if (keys.left) ax = -1;
    if (keys.right) ax = 1;

    g.x += ax * 40 * delta;
    g.x = THREE.MathUtils.clamp(g.x, -18, 18); 

    if (shipMesh.current) {
      shipMesh.current.position.x = THREE.MathUtils.lerp(shipMesh.current.position.x, g.x, 15 * delta);
      shipMesh.current.rotation.z = THREE.MathUtils.lerp(shipMesh.current.rotation.z, -ax * 0.7, 10 * delta);
      shipMesh.current.rotation.y = THREE.MathUtils.lerp(shipMesh.current.rotation.y, -ax * 0.3, 10 * delta);
      shipMesh.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.1;
    }
    
    if (keys.up) g.targetSpeed = 100 + g.boost;
    else if (keys.down) g.targetSpeed = 30 + g.boost;
    else g.targetSpeed = 60 + g.boost;

    g.speed = THREE.MathUtils.lerp(g.speed, g.targetSpeed, 3 * delta);
    if (g.boost > 0) {
      g.boost -= 15 * delta; 
    }
  });

  return (
    <group ref={shipMesh} position={[0, 1, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.2, 4, 3]} />
        <meshStandardMaterial color="#ff0055" metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[-0.8, -0.3, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.8, -0.3, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[-0.8, -0.3, -2.1]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      <mesh position={[0.8, -0.3, -2.1]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
    </group>
  );
};

const Hoop = ({ index, gameRef }) => {
  const groupRef = useRef();
  const textRef = useRef();
  const [data, setData] = useState({ number: 0, color: 'white', visible: false });

  useFrame(() => {
    const g = gameRef.current;
    const hoop = g.hoops[index];
    if (!hoop) return;
    
    if (groupRef.current) {
      groupRef.current.position.set(hoop.x, 1.5, hoop.z);
      
      if (data.number !== hoop.number || data.visible !== hoop.active) {
        setData({ number: hoop.number, color: hoop.color, visible: hoop.active });
      }
    }
  });

  if (!data.visible) return null;

  return (
    <group ref={groupRef}>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[3.5, 0.3, 16, 32]} />
        <meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.8} />
      </mesh>
      <mesh rotation={[0, 0, 0]} position={[0,0,-0.5]}>
         <circleGeometry args={[3.4, 32]} />
         <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>
      <Text 
        ref={textRef}
        position={[0, 0, 0]} 
        fontSize={2.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {data.number}
      </Text>
    </group>
  );
};

const GameLogic = ({ gameRef }) => {
  useFrame((state, delta) => {
    const g = gameRef.current;
    
    g.hoops.forEach(hoop => {
      if (hoop.active) {
        hoop.z += g.speed * delta;
        
        if (hoop.z > -1 && hoop.z < 2 && !hoop.hit) {
          const dx = Math.abs(hoop.x - g.x);
          if (dx < 4.0) {
            hoop.hit = true;
            hoop.active = false; 
            
            if (hoop.isPrime) {
              g.score += 10;
              g.boost = 60;
              spawnParticles(g, hoop.x, hoop.z, '#00ff00');
            } else {
              g.score -= 5;
              g.speed = Math.max(10, g.speed - 50); 
              g.shake = 0.6;
              g.flash = 1.0;
              spawnParticles(g, hoop.x, hoop.z, '#ff0000');
            }
          }
        }
        
        if (hoop.z > 15) {
           hoop.active = false;
        }
      } else {
        const activeZ = g.hoops.filter(h => h.active).map(h => h.z);
        const minZ = activeZ.length > 0 ? Math.min(...activeZ) : -100;
        Object.assign(hoop, createHoopData(minZ - 60 - Math.random() * 20)); 
      }
    });
    
    g.particles.forEach(p => {
       if (p.life > 0) {
         p.life -= delta;
         p.x += p.vx * delta;
         p.y += p.vy * delta;
         p.z += p.vz * delta;
         p.z += g.speed * delta; 
       }
    });
  });
  return null;
};

const HoopManager = ({ gameRef }) => {
  useEffect(() => {
    const g = gameRef.current;
    if (g.hoops.length === 0) {
      for (let i = 0; i < MAX_HOOPS; i++) {
         g.hoops.push(createHoopData(i * -60 - 100));
      }
    }
  }, []);

  return (
    <>
      {Array.from({ length: MAX_HOOPS }).map((_, i) => (
        <Hoop key={i} index={i} gameRef={gameRef} />
      ))}
      <GameLogic gameRef={gameRef} />
    </>
  );
};

const Particles = ({ gameRef }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const g = gameRef.current;
    if (g.particles.length === 0) {
      for (let i = 0; i < MAX_PARTICLES; i++) {
        g.particles.push({ life: 0, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, scale: 1, color: new THREE.Color() });
      }
    }
  }, []);

  useFrame(() => {
    const g = gameRef.current;
    if (!meshRef.current) return;
    
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = g.particles[i];
      if (p.life > 0) {
        dummy.position.set(p.x, p.y, p.z);
        const s = p.scale * (p.life); 
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        meshRef.current.setColorAt(i, p.color);
      } else {
        dummy.position.set(0, -1000, 0); 
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, MAX_PARTICLES]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
};

const Track = ({ gameRef }) => {
  const gridRef = useRef();
  
  useFrame((state, delta) => {
    const g = gameRef.current;
    if (gridRef.current) {
      gridRef.current.position.z += g.speed * delta;
      if (gridRef.current.position.z > 20) {
        gridRef.current.position.z -= 20; 
      }
    }
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -200]}>
        <planeGeometry args={[120, 600]} />
        <meshStandardMaterial color="#050510" />
      </mesh>
      
      <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -200]}>
        <planeGeometry args={[60, 600, 12, 120]} />
        <meshBasicMaterial color="#ff0055" wireframe={true} transparent opacity={0.2} />
      </mesh>
      
      <mesh position={[-30, 5, -200]}>
         <boxGeometry args={[2, 10, 600]} />
         <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[30, 5, -200]}>
         <boxGeometry args={[2, 10, 600]} />
         <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
};

const CameraManager = ({ gameRef }) => {
  const cameraRef = useRef();
  
  useFrame((state, delta) => {
    const g = gameRef.current;
    
    if (g.shake > 0) {
      g.shake -= delta;
      if (g.shake < 0) g.shake = 0;
    }
    
    if (cameraRef.current) {
      const targetX = g.x * 0.4;
      const targetY = 4 + (g.speed / 100) * 1.5;
      const targetZ = 12;
      
      cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, targetX, 5 * delta);
      cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, targetY, 5 * delta);
      cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, 5 * delta);
      
      if (g.shake > 0) {
        const shakeIntensity = g.shake * 2;
        cameraRef.current.position.x += (Math.random() - 0.5) * shakeIntensity;
        cameraRef.current.position.y += (Math.random() - 0.5) * shakeIntensity;
      }
      
      cameraRef.current.lookAt(g.x * 0.2, 0, -30); 
      
      const targetFov = 75 + (g.speed / 120) * 15;
      cameraRef.current.fov = THREE.MathUtils.lerp(cameraRef.current.fov, targetFov, 5 * delta);
      cameraRef.current.updateProjectionMatrix();
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 4, 12]} fov={75} />;
};

const PostEffects = ({ gameRef }) => {
  const lightRef = useRef();
  
  useFrame((state, delta) => {
    const g = gameRef.current;
    if (g.flash > 0) {
      g.flash -= delta * 3;
      if (g.flash < 0) g.flash = 0;
    }
    
    if (lightRef.current) {
       lightRef.current.intensity = g.flash * 10;
    }
  });

  return <pointLight ref={lightRef} position={[0, 5, 5]} color="#ff0000" intensity={0} distance={50} />;
};

const Scene = ({ gameRef }) => {
  return (
    <>
      <color attach="background" args={['#020205']} />
      <fog attach="fog" args={['#020205', 40, 250]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 5]} intensity={1.5} color="#aaaaff" />
      
      <CameraManager gameRef={gameRef} />
      <Ship gameRef={gameRef} />
      <Track gameRef={gameRef} />
      <HoopManager gameRef={gameRef} />
      <Particles gameRef={gameRef} />
      <PostEffects gameRef={gameRef} />
    </>
  );
};

const keyboardMap = [
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'up', keys: ['ArrowUp', 'KeyW'] },
  { name: 'down', keys: ['ArrowDown', 'KeyS'] },
];

export default function FaskaFZeroSwarm({ onExit }) {
  const gameRef = useRef({
    x: 0,
    speed: 60,
    targetSpeed: 60,
    score: 0,
    shake: 0,
    flash: 0,
    hoops: [],
    particles: [],
    boost: 0,
  });

  const [uiState, setUiState] = useState({ score: 0, speed: 60 });

  useEffect(() => {
    const interval = setInterval(() => {
      setUiState({
        score: gameRef.current.score,
        speed: Math.floor(gameRef.current.speed)
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#000', fontFamily: 'sans-serif' }}>
       <div style={{ position: 'absolute', top: 20, left: 20, color: '#00ffff', zIndex: 10, textShadow: '0 0 10px #00ffff' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>SCORE: {uiState.score}</div>
          <div style={{ fontSize: '24px' }}>SPEED: {uiState.speed} KM/H</div>
          <div style={{ marginTop: '10px', fontSize: '16px', color: '#fff', textShadow: 'none' }}>
            Fly through <strong style={{color:'#00ff00'}}>PRIME NUMBERS</strong>!<br/>
            Dodge composites.
          </div>
       </div>

       <button 
         onClick={onExit}
         style={{ 
           position: 'absolute', top: 20, right: 20, zIndex: 10, 
           padding: '12px 24px', fontSize: '18px', fontWeight: 'bold',
           cursor: 'pointer', backgroundColor: '#ff0055', color: 'white', 
           border: 'none', borderRadius: '8px',
           boxShadow: '0 4px 15px rgba(255,0,85,0.5)',
           textTransform: 'uppercase'
         }}
       >
         Beenden
       </button>
       
       <KeyboardControls map={keyboardMap}>
         <Canvas shadows>
            <Scene gameRef={gameRef} />
         </Canvas>
       </KeyboardControls>
    </div>
  );
}
