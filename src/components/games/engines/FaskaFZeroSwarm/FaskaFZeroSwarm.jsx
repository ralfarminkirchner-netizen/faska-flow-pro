import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, KeyboardControls, PerspectiveCamera } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';

import useGameStore, { createHoopData, spawnParticles } from './GameLogic';
import World from './World';
import Player from './Player';
import UIOverlay from './UIOverlay';
import MobileJoystick from './MobileJoystick';

const MAX_HOOPS = 12;
const MAX_PARTICLES = 150;

const Hoop = ({ index }) => {
  const groupRef = useRef();
  const textRef = useRef();
  const [data, setData] = useState({ number: 0, color: 'white', visible: false });

  useFrame(() => {
    const hoops = useGameStore.getState().hoops;
    const hoop = hoops[index];
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

const GameEngineUpdater = () => {
  useFrame((state, delta) => {
    const g = useGameStore.getState();
    
    g.hoops.forEach(hoop => {
      if (hoop.active) {
        hoop.z += g.speed * delta;
        
        if (hoop.z > -1 && hoop.z < 2 && !hoop.hit) {
          const dx = Math.abs(hoop.x - g.x);
          if (dx < 4.0) {
            hoop.hit = true;
            hoop.active = false; 
            
            if (hoop.isPrime) {
              useGameStore.setState({ 
                score: g.score + 10,
                boost: 60
              });
              spawnParticles(g.particles, hoop.x, hoop.z, '#00ff00');
            } else {
              useGameStore.setState({ 
                score: g.score - 5,
                speed: Math.max(10, g.speed - 50),
                shake: 0.6,
                flash: 1.0
              });
              spawnParticles(g.particles, hoop.x, hoop.z, '#ff0000');
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

const HoopManager = () => {
  const hoops = useGameStore(state => state.hoops);

  useEffect(() => {
    const newHoops = [];
    for (let i = 0; i < MAX_HOOPS; i++) {
       newHoops.push(createHoopData(i * -60 - 100));
    }
    useGameStore.setState({ hoops: newHoops });
  }, []);

  return (
    <>
      {hoops.length > 0 && Array.from({ length: MAX_HOOPS }).map((_, i) => (
        <Hoop key={i} index={i} />
      ))}
      {hoops.length > 0 && <GameEngineUpdater />}
    </>
  );
};

const Particles = () => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const particles = useGameStore(state => state.particles);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      newParticles.push({ life: 0, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, scale: 1, colorStr: '#ffffff' });
    }
    useGameStore.setState({ particles: newParticles });
  }, []);

  useFrame(() => {
    const g = useGameStore.getState();
    if (!meshRef.current || g.particles.length === 0) return;
    
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = g.particles[i];
      if (p.life > 0) {
        dummy.position.set(p.x, p.y, p.z);
        const s = p.scale * (p.life); 
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        tempColor.set(p.colorStr);
        meshRef.current.setColorAt(i, tempColor);
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

const CameraManager = () => {
  const cameraRef = useRef();
  
  useFrame((state, delta) => {
    const g = useGameStore.getState();
    
    let shake = g.shake;
    if (shake > 0) {
      shake -= delta;
      if (shake < 0) shake = 0;
      useGameStore.setState({ shake });
    }
    
    if (cameraRef.current) {
      const targetX = g.x * 0.4;
      const targetY = 4 + (g.speed / 100) * 1.5;
      const targetZ = 12;
      
      cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, targetX, 5 * delta);
      cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, targetY, 5 * delta);
      cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, 5 * delta);
      
      if (shake > 0) {
        const shakeIntensity = shake * 2;
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

const PostEffects = () => {
  const lightRef = useRef();
  
  useFrame((state, delta) => {
    const g = useGameStore.getState();
    let flash = g.flash;
    if (flash > 0) {
      flash -= delta * 3;
      if (flash < 0) flash = 0;
      useGameStore.setState({ flash });
    }
    
    if (lightRef.current) {
       lightRef.current.intensity = flash * 10;
    }
  });

  return <pointLight ref={lightRef} position={[0, 5, 5]} color="#ff0000" intensity={0} distance={50} />;
};

const Scene = () => {
  return (
    <>
      <color attach="background" args={['#020205']} />
      <fog attach="fog" args={['#020205', 40, 250]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 5]} intensity={1.5} color="#aaaaff" />
      
      <CameraManager />
      
      <Physics>
        <Player />
      </Physics>
      
      <World />
      <HoopManager />
      <Particles />
      <PostEffects />
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
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#000', fontFamily: 'sans-serif' }}>
       <UIOverlay onExit={onExit} />
       <MobileJoystick />
       
       <KeyboardControls map={keyboardMap}>
         <Canvas shadows>
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
         </Canvas>
       </KeyboardControls>
    </div>
  );
}
