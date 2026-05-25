import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Environment, ContactShadows, Sky } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { create } from 'zustand';
import * as THREE from 'three';

export const useGameStore = create((set) => ({
  gameState: 'start', // start, playing, gameover
  score: 0,
  time: 60,
  trickMessage: '',
  startGame: () => set({ gameState: 'playing', score: 0, time: 60, trickMessage: '' }),
  addScore: (pts, trick) => set((state) => ({ score: state.score + pts, trickMessage: trick })),
  clearTrickMessage: () => set({ trickMessage: '' }),
  tick: () => set((state) => ({ time: Math.max(0, state.time - 1) })),
  setGameOver: () => set({ gameState: 'gameover' })
}));

const useKeys = () => {
  const keys = useRef({ forward: false, backward: false, left: false, right: false, jump: false, pump: false });
  useEffect(() => {
    const down = (e) => {
      if(e.code === 'ArrowUp' || e.code === 'KeyW') keys.current.forward = true;
      if(e.code === 'ArrowDown' || e.code === 'KeyS') keys.current.pump = true;
      if(e.code === 'ArrowLeft' || e.code === 'KeyA') keys.current.left = true;
      if(e.code === 'ArrowRight' || e.code === 'KeyD') keys.current.right = true;
      if(e.code === 'Space') keys.current.jump = true;
    };
    const up = (e) => {
      if(e.code === 'ArrowUp' || e.code === 'KeyW') keys.current.forward = false;
      if(e.code === 'ArrowDown' || e.code === 'KeyS') keys.current.pump = false;
      if(e.code === 'ArrowLeft' || e.code === 'KeyA') keys.current.left = false;
      if(e.code === 'ArrowRight' || e.code === 'KeyD') keys.current.right = false;
      if(e.code === 'Space') keys.current.jump = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);
  return keys;
};

const GameLoop = () => {
   const { gameState, tick, setGameOver, time } = useGameStore();
   useEffect(() => {
       if (gameState !== 'playing') return;
       const interval = setInterval(() => {
           tick();
       }, 1000);
       return () => clearInterval(interval);
   }, [gameState, tick]);

   useEffect(() => {
       if (time <= 0 && gameState === 'playing') {
           setGameOver();
       }
   }, [time, gameState, setGameOver]);
   return null;
};

const HUD = ({ onExit }) => {
   const { gameState, score, time, trickMessage, startGame } = useGameStore();
   
   return (
       <>
           <button onClick={onExit} className="absolute top-4 right-4 text-white font-bold z-50 bg-red-600/50 hover:bg-red-600 px-4 py-2 rounded">
               EXIT
           </button>
           {gameState === 'start' && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-40">
                   <h1 className="text-6xl font-bold mb-4 italic text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">FASKA SKATER 2</h1>
                   <p className="mb-2 text-xl font-bold text-yellow-300">CONTROLS:</p>
                   <p className="mb-1 text-lg">Left/Right Arrows: Steer sideways</p>
                   <p className="mb-1 text-lg">Down Arrow: PUMP (hold on transitions to gain speed)</p>
                   <p className="mb-1 text-lg">Space: OLLIE (Jump)</p>
                   <p className="mb-8 text-lg">Down Arrow (in air): KICKFLIP</p>
                   <button onClick={startGame} className="px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 rounded text-2xl font-bold transition-all transform hover:scale-110 shadow-[0_0_20px_rgba(255,0,255,0.6)] cursor-pointer">DROP IN</button>
               </div>
           )}
           {gameState === 'gameover' && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white z-40">
                   <h1 className="text-6xl font-bold mb-4 text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">TIME'S UP!</h1>
                   <p className="mb-8 text-4xl text-yellow-400 font-mono">Final Score: {score}</p>
                   <button onClick={startGame} className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 rounded text-2xl font-bold transition-all transform hover:scale-110 shadow-[0_0_20px_rgba(0,255,255,0.6)] cursor-pointer">PLAY AGAIN</button>
               </div>
           )}
           {gameState === 'playing' && (
               <div className="absolute inset-0 pointer-events-none z-10 p-6 flex flex-col justify-between">
                   <div className="flex justify-between items-start text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-mono">
                       <div className="text-4xl font-bold text-yellow-400">SCORE: {score}</div>
                       <div className="text-5xl font-bold text-white">{time}s</div>
                   </div>
                   <div className="flex justify-center mb-20">
                       {trickMessage && <div className="text-6xl font-bold text-fuchsia-500 italic animate-bounce drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]">{trickMessage}</div>}
                   </div>
               </div>
           )}
       </>
   );
};

const CameraController = ({ playerRef }) => {
   const { camera } = useThree();
   useFrame(() => {
       if (!playerRef.current) return;
       const pos = playerRef.current.translation();
       const targetPos = new THREE.Vector3(pos.x, pos.y + 4, pos.z + 10);
       camera.position.lerp(targetPos, 0.1);
       camera.lookAt(pos.x, pos.y, pos.z);
   });
   return null;
};

const Halfpipe = () => {
    const geometry = useMemo(() => {
        const shape = new THREE.Shape();
        const flatWidth = 6;
        const radius = 8;
        const height = 12; // Higher walls
        
        shape.moveTo(-flatWidth/2 - radius, height);
        shape.lineTo(-flatWidth/2 - radius, radius);
        shape.absarc(-flatWidth/2, radius, radius, Math.PI, Math.PI*1.5, false);
        shape.lineTo(flatWidth/2, 0);
        shape.absarc(flatWidth/2, radius, radius, Math.PI*1.5, Math.PI*2, false);
        shape.lineTo(flatWidth/2 + radius, height);
        
        const thickness = 2;
        shape.lineTo(flatWidth/2 + radius + thickness, height);
        shape.lineTo(flatWidth/2 + radius + thickness, -thickness);
        shape.lineTo(-flatWidth/2 - radius - thickness, -thickness);
        shape.lineTo(-flatWidth/2 - radius - thickness, height);
        
        const extrudeSettings = { steps: 1, depth: 80, bevelEnabled: false };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.translate(0, 0, -40); // Center along Z
        return geom;
    }, []);

    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#444444';
        ctx.fillRect(0, 0, 1024, 1024);
        
        // Add noise
        for(let i=0; i<50000; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? '#333333' : '#555555';
            ctx.fillRect(Math.random()*1024, Math.random()*1024, 3, 3);
        }
        
        // Graffiti
        const colors = ['#ff0055', '#00ffcc', '#eeff00', '#aa00ff'];
        for(let i=0; i<40; i++) {
            ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
            ctx.lineWidth = 4 + Math.random() * 15;
            ctx.beginPath();
            ctx.moveTo(Math.random()*1024, Math.random()*1024);
            ctx.bezierCurveTo(
                Math.random()*1024, Math.random()*1024,
                Math.random()*1024, Math.random()*1024,
                Math.random()*1024, Math.random()*1024
            );
            ctx.stroke();
        }
        
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(4, 10);
        return tex;
    }, []);

    return (
        <RigidBody type="fixed" colliders="trimesh" friction={0.05} restitution={0}>
            <mesh geometry={geometry} castShadow receiveShadow>
                <meshStandardMaterial map={texture} roughness={0.9} />
            </mesh>
        </RigidBody>
    );
};

const Skater = ({ playerRef }) => {
    const keys = useKeys();
    const visualGroup = useRef();
    const forwardRef = useRef(new THREE.Vector3(1, 0, 0));
    const stateRef = useRef({ wasGrounded: true, airTime: 0, trickRot: 0 });
    const { addScore, gameState } = useGameStore();

    useEffect(() => {
        if (gameState === 'playing' && playerRef.current) {
            playerRef.current.setTranslation({ x: -10, y: 10, z: 0 }, true);
            playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            playerRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
            stateRef.current = { wasGrounded: true, airTime: 0, trickRot: 0 };
            forwardRef.current.set(1, 0, 0);
        }
    }, [gameState, playerRef]);

    useFrame((state, delta) => {
        if (!playerRef.current || gameState !== 'playing') return;

        const pos = playerRef.current.translation();
        const vel = playerRef.current.linvel();
        
        // Mathematical surface check
        const flatWidth = 6;
        const radius = 8;
        let surfY = 0;
        let normal = new THREE.Vector3(0, 1, 0);
        
        if (pos.x > flatWidth/2) {
            let dx = pos.x - flatWidth/2;
            if (dx > radius) dx = radius;
            const dy = -Math.sqrt(Math.max(0, radius*radius - dx*dx));
            surfY = radius + dy;
            normal.set(-dx, -dy, 0).normalize();
        } else if (pos.x < -flatWidth/2) {
            let dx = pos.x - (-flatWidth/2);
            if (dx < -radius) dx = -radius;
            const dy = -Math.sqrt(Math.max(0, radius*radius - dx*dx));
            surfY = radius + dy;
            normal.set(-dx, -dy, 0).normalize();
        }

        const sphereRadius = 0.5;
        const isGrounded = pos.y <= surfY + sphereRadius + 0.5; // 0.5 tolerance for smoother landings

        if (isGrounded) {
            // Apply steering
            const steerForce = 25;
            if (keys.current.left) playerRef.current.applyImpulse({ x: 0, y: 0, z: -steerForce * delta }, true);
            if (keys.current.right) playerRef.current.applyImpulse({ x: 0, y: 0, z: steerForce * delta }, true);
            
            // Pump logic
            if (keys.current.pump) {
                const pumpForce = 20;
                if (pos.x > 0) {
                    playerRef.current.applyImpulse({ x: -pumpForce * delta, y: -pumpForce * delta, z: 0 }, true);
                } else {
                    playerRef.current.applyImpulse({ x: pumpForce * delta, y: -pumpForce * delta, z: 0 }, true);
                }
            }

            // Jump
            if (keys.current.jump) {
                playerRef.current.applyImpulse({ x: normal.x * 5, y: 12, z: normal.z * 5 }, true);
                keys.current.jump = false;
            }

            // Visuals alignment
            const targetUp = normal.clone();
            let moveDir = new THREE.Vector3(vel.x, vel.y, vel.z);
            if (moveDir.lengthSq() > 2.0) {
                moveDir.normalize();
                if (moveDir.dot(forwardRef.current) < -0.4) {
                    moveDir.negate(); // Ride fakie
                }
                forwardRef.current.copy(moveDir);
            }
            
            let forward = forwardRef.current.clone();
            forward.projectOnPlane(targetUp).normalize();
            
            const matrix = new THREE.Matrix4().lookAt(new THREE.Vector3(0,0,0), forward, targetUp);
            const targetQuat = new THREE.Quaternion().setFromRotationMatrix(matrix);
            visualGroup.current.quaternion.slerp(targetQuat, 15 * delta);

            // Landed trick
            if (!stateRef.current.wasGrounded && stateRef.current.airTime > 0.3) {
                const points = Math.floor(stateRef.current.airTime * 150) + Math.floor(stateRef.current.trickRot) * 30;
                if (points > 100) {
                    addScore(points, stateRef.current.trickRot > 15 ? 'SICK TRICK!' : 'HUGE AIR!');
                    setTimeout(useGameStore.getState().clearTrickMessage, 2000);
                }
                stateRef.current.trickRot = 0;
            }
            stateRef.current.airTime = 0;
            
        } else {
            // In air
            stateRef.current.airTime += delta;
            
            // Keep looking natural based on velocity
            const targetUp = new THREE.Vector3(0, 1, 0); // Straight up in air
            let forward = forwardRef.current.clone();
            forward.projectOnPlane(targetUp).normalize();
            const matrix = new THREE.Matrix4().lookAt(new THREE.Vector3(0,0,0), forward, targetUp);
            const targetQuat = new THREE.Quaternion().setFromRotationMatrix(matrix);
            visualGroup.current.quaternion.slerp(targetQuat, 2 * delta); // Slower uprighting in air
            
            if (keys.current.pump) { // Kickflip
                stateRef.current.trickRot += 25 * delta;
                visualGroup.current.rotateZ(25 * delta);
            }
        }
        
        // Prevent falling off Z edges
        if (pos.z > 38) playerRef.current.setTranslation({ x: pos.x, y: pos.y, z: 38 }, true);
        if (pos.z < -38) playerRef.current.setTranslation({ x: pos.x, y: pos.y, z: -38 }, true);
        
        stateRef.current.wasGrounded = isGrounded;
    });

    return (
        <RigidBody
            ref={playerRef}
            colliders="ball"
            mass={1}
            friction={0.0}
            restitution={0}
            canSleep={false}
            enabledRotations={[false, false, false]}
            linearDamping={0.1}
            position={[0, 2, 0]}
        >
            <group ref={visualGroup}>
                {/* Skateboard */}
                <mesh position={[0, -0.4, 0]}>
                    <boxGeometry args={[0.4, 0.08, 1.2]} />
                    <meshStandardMaterial color="#ff0055" />
                </mesh>
                {/* Wheels */}
                <mesh position={[-0.15, -0.45, 0.4]} rotation={[0, 0, Math.PI/2]}>
                    <cylinderGeometry args={[0.05, 0.05, 0.1]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                <mesh position={[0.15, -0.45, 0.4]} rotation={[0, 0, Math.PI/2]}>
                    <cylinderGeometry args={[0.05, 0.05, 0.1]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                <mesh position={[-0.15, -0.45, -0.4]} rotation={[0, 0, Math.PI/2]}>
                    <cylinderGeometry args={[0.05, 0.05, 0.1]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                <mesh position={[0.15, -0.45, -0.4]} rotation={[0, 0, Math.PI/2]}>
                    <cylinderGeometry args={[0.05, 0.05, 0.1]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                {/* Body */}
                <mesh position={[0, 0.2, 0]}>
                    <capsuleGeometry args={[0.25, 0.6]} />
                    <meshStandardMaterial color="#00ffff" />
                </mesh>
                {/* Head */}
                <mesh position={[0, 0.8, 0]}>
                    <sphereGeometry args={[0.2]} />
                    <meshStandardMaterial color="#ffcc00" />
                </mesh>
                {/* Visor */}
                <mesh position={[0, 0.85, -0.15]}>
                    <boxGeometry args={[0.3, 0.1, 0.15]} />
                    <meshStandardMaterial color="#222" />
                </mesh>
            </group>
        </RigidBody>
    );
};

const Effects = () => (
    <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.4} mipmapBlur intensity={1.2} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
);

export default function FaskaSkater2({ onExit }) {
    const playerRef = useRef();

    return (
        <div className="w-full h-screen bg-black overflow-hidden relative">
            <HUD onExit={onExit} />
            <GameLoop />
            
            <Canvas shadows camera={{ position: [0, 5, 15], fov: 60 }}>
                <color attach="background" args={['#0a0a1a']} />
                <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
                <ambientLight intensity={0.5} />
                <directionalLight 
                    position={[10, 20, 10]} 
                    intensity={1.5} 
                    castShadow 
                    shadow-mapSize={[2048, 2048]}
                />
                
                <Physics gravity={[0, -25, 0]}>
                    <Halfpipe />
                    <Skater playerRef={playerRef} />
                </Physics>
                
                <CameraController playerRef={playerRef} />
                <Effects />
            </Canvas>
        </div>
    );
}
