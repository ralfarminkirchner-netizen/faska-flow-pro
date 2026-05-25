import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody, CylinderCollider } from '@react-three/rapier';
import { Text, Line, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function GameScene({ setGameState, setStrokes, gameState }) {
  const ballRef = useRef();
  const { camera } = useThree();

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(new THREE.Vector3());
  const [dragCurrent, setDragCurrent] = useState(new THREE.Vector3());
  const [ballPos, setBallPos] = useState(new THREE.Vector3(4, 0.5, 0));

  const [flash, setFlash] = useState(false);
  const [shake, setShake] = useState(0);

  // Default camera setup
  const baseCameraPos = new THREE.Vector3(0, 14, 12);
  const lookAtTarget = new THREE.Vector3(0, 0, 2);

  useFrame((state, delta) => {
    // Camera Shake & Position update
    if (shake > 0) {
      state.camera.position.x = baseCameraPos.x + (Math.random() - 0.5) * 0.5;
      state.camera.position.y = baseCameraPos.y + (Math.random() - 0.5) * 0.5;
      state.camera.position.z = baseCameraPos.z + (Math.random() - 0.5) * 0.5;
      setShake((s) => s - delta);
    } else {
      state.camera.position.copy(baseCameraPos);
    }
    state.camera.lookAt(lookAtTarget);

    // Track ball position for aim line and general logic
    if (ballRef.current) {
      const t = ballRef.current.translation();
      setBallPos(new THREE.Vector3(t.x, t.y, t.z));
    }
  });

  const handlePointerDown = (e) => {
    if (gameState === 'won') return;
    e.stopPropagation();
    setIsDragging(true);
    setDragStart(e.point.clone());
    setDragCurrent(e.point.clone());
  };

  const handlePointerMove = (e) => {
    if (isDragging) setDragCurrent(e.point.clone());
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      const impulse = new THREE.Vector3().subVectors(dragStart, dragCurrent);
      impulse.y = 0; // Lock to horizontal plane
      
      if (impulse.length() > 0.1) {
        // Apply impulse backwards (slingshot mechanic)
        ballRef.current.applyImpulse(impulse.multiplyScalar(1.2), true);
        setStrokes((s) => s + 1);
      }
    }
  };

  const dragVector = new THREE.Vector3().subVectors(dragStart, dragCurrent).setY(0);

  return (
    <group>
      {/* Invisible Interaction Plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => setIsDragging(false)}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Aim Line visualization */}
      {isDragging && gameState !== 'won' && dragVector.length() > 0.1 && (
        <Line
          points={[
            ballPos,
            new THREE.Vector3().copy(ballPos).add(dragVector)
          ]}
          color="white"
          lineWidth={4}
        />
      )}

      {/* The Golf Ball */}
      <RigidBody
        ref={ballRef}
        position={[4, 0.5, 0]}
        colliders="ball"
        restitution={0.8}
        friction={0.2}
        linearDamping={0.4}
        angularDamping={0.4}
        onCollisionEnter={(e) => {
          if (e.other.rigidBodyObject?.name === 'wall') {
            setFlash(true);
            setShake(0.15); // Add Screen shake juice
            setTimeout(() => setFlash(false), 150);
          }
        }}
      >
        <mesh castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={flash ? "#FFD700" : "#FFFFFF"} />
        </mesh>
      </RigidBody>

      {/* Green Floor */}
      <RigidBody type="fixed" restitution={0.2} friction={0.5}>
        <mesh receiveShadow position={[0, -0.5, 2]}>
          <boxGeometry args={[20, 1, 20]} />
          <meshStandardMaterial color="#2E8B57" />
        </mesh>
      </RigidBody>

      {/* Middle Wall (Blocks direct path between start and hole) */}
      <RigidBody type="fixed" restitution={1} friction={0} name="wall">
        <mesh position={[0, 0.5, 1.5]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 1, 5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </RigidBody>

      {/* Bounce Wall (Top) */}
      <RigidBody type="fixed" restitution={1} friction={0} name="wall">
        <mesh position={[0, 0.5, -4.5]} castShadow receiveShadow>
          <boxGeometry args={[12, 1, 1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </RigidBody>

      {/* Boundary Walls */}
      <RigidBody type="fixed" restitution={1} friction={0} name="wall">
        <mesh position={[0, 0.5, 7.5]} castShadow receiveShadow>
          <boxGeometry args={[12, 1, 1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" restitution={1} friction={0} name="wall">
        <mesh position={[-6.5, 0.5, 1.5]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 13]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" restitution={1} friction={0} name="wall">
        <mesh position={[6.5, 0.5, 1.5]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 13]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </RigidBody>

      {/* Educational Target 45° (Correct reflection point) */}
      <Text position={[0, 0.5, -3.9]} fontSize={0.7} color="white" anchorX="center" anchorY="middle">
        45°
      </Text>
      <mesh position={[0, 0.02, -3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
      </mesh>

      {/* Educational Target 90° (Incorrect reflection point) */}
      <Text position={[3, 0.5, -3.9]} fontSize={0.7} color="white" anchorX="center" anchorY="middle">
        90°
      </Text>
      <mesh position={[3, 0.02, -3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial color="#FF4500" transparent opacity={0.3} />
      </mesh>

      {/* The Hole (Visual) */}
      <mesh position={[-4, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Hole Sensor Trigger */}
      <RigidBody
        type="fixed"
        position={[-4, 0.2, 0]}
        sensor
        onIntersectionEnter={() => setGameState('won')}
      >
        <CylinderCollider args={[0.2, 0.4]} />
      </RigidBody>

      {/* Win Particles (Juice) */}
      {gameState === 'won' && (
        <Sparkles position={[-4, 0.5, 0]} count={100} scale={4} size={6} speed={3} color="#FFD700" />
      )}
    </group>
  );
}

export default function FaskaGolf({ onExit }) {
  const [gameState, setGameState] = useState('playing');
  const [strokes, setStrokes] = useState(0);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#87CEEB' }}>
      {/* UI HUD Overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, padding: '20px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
        color: 'white', zIndex: 10, fontFamily: 'sans-serif', pointerEvents: 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          FaskaGolf: Geometrie-Putt
        </h1>
        <p style={{ margin: 0, fontSize: '18px', maxWidth: '600px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          <strong>Einfallswinkel = Ausfallswinkel.</strong><br/>
          Das Loch ist hinter der Wand versteckt. Welcher Winkel ist richtig: <strong>45°</strong> oder <strong>90°</strong>?<br/>
          <span style={{ fontSize: '14px', color: '#ddd' }}>Klicken und ziehen (wie ein Slingshot), um zu zielen! Schläge: {strokes}</span>
        </p>

        {gameState === 'won' && (
          <div style={{
            marginTop: '30px', padding: '15px 30px',
            background: 'rgba(76, 175, 80, 0.95)', borderRadius: '15px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)', pointerEvents: 'auto',
            animation: 'popIn 0.5s ease-out'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Perfekt versenkt! 🎉</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white' }}>
              Richtig! 45° ist der korrekte Reflexionswinkel, um das Ziel zu erreichen.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Exit Button */}
      <button
        onClick={onExit}
        style={{
          position: 'absolute', top: '20px', right: '20px', zIndex: 20,
          padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
          cursor: 'pointer', backgroundColor: '#f44336', color: 'white',
          border: '2px solid white', borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)', transition: 'transform 0.1s'
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Beenden
      </button>

      {/* 3D Scene */}
      <Canvas shadows>
        <color attach="background" args={['#87CEEB']} />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 15, 10]}
          castShadow
          intensity={1.2}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        <React.Suspense fallback={null}>
          <Physics>
            <GameScene setGameState={setGameState} setStrokes={setStrokes} gameState={gameState} />
          </Physics>
        </React.Suspense>
      </Canvas>
    </div>
  );
}
