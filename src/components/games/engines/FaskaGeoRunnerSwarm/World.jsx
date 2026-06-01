import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Text, Box, Cylinder, Stars, Float } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useRunnerStore } from './GameLogic';
import * as THREE from 'three';

export default function World() {
  const gridRef = useRef();
  const speed = useRunnerStore(s => s.speed);

  useFrame((_, dt) => {
    if (gridRef.current) {
      gridRef.current.position.z = (gridRef.current.position.z + speed * dt) % 10;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade />
      <fog attach="fog" args={['#0a0a1a', 15, 70]} />

      <Grid
        ref={gridRef}
        position={[0, -1, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={1}
        cellColor="#00ffff"
        sectionSize={10}
        sectionThickness={2}
        sectionColor="#ff00ff"
        fadeDistance={80}
        fadeStrength={1}
      />

      <Player />
      <Gates />
      <GameLoop />
    </>
  );
}

function Player() {
  const lane = useRunnerStore(s => s.playerLane);
  const playerRef = useRef();
  const tiltRef = useRef(0);
  
  useFrame((_, dt) => {
    try {
      if (playerRef.current) {
        const targetX = lane * 3.5;
        const currentX = playerRef.current.translation().x;
        const newX = THREE.MathUtils.lerp(currentX, targetX, 10 * dt);
        
        const diff = newX - currentX;
        tiltRef.current = THREE.MathUtils.lerp(tiltRef.current, -diff * 3, 10 * dt);
        
        // Wrap Rapier interactions in try/catch as per rules
        playerRef.current.setNextKinematicTranslation({ x: newX, y: 0.5, z: 0 });
        
        const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, tiltRef.current));
        playerRef.current.setNextKinematicRotation(quat);
      }
    } catch (e) {
      console.error('Player physics error:', e);
    }
  });

  return (
    <RigidBody ref={playerRef} type="kinematicPosition" position={[0, 0.5, 0]}>
      <group>
        <Box args={[1.2, 0.4, 2]} castShadow>
          <meshStandardMaterial color="#0a0a1a" emissive="#00ffff" emissiveIntensity={0.8} />
        </Box>
        <Cylinder args={[0.2, 0.2, 2.2]} position={[-0.7, 0, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1} />
        </Cylinder>
        <Cylinder args={[0.2, 0.2, 2.2]} position={[0.7, 0, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1} />
        </Cylinder>
      </group>
    </RigidBody>
  );
}

function Gates() {
  const gates = useRunnerStore(s => s.gates);
  const currentQuestion = useRunnerStore(s => s.currentQuestion);
  const gatesRef = useRef();

  useFrame(() => {
    if (gatesRef.current) {
      gatesRef.current.children.forEach((child, i) => {
        const gateData = gates[i];
        if (gateData) {
          child.position.z = gateData.z;
        }
      });
    }
  });

  return (
    <>
      {currentQuestion && (
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
          <Text
            position={[0, 8, -40]}
            fontSize={4}
            color="#ffffff"
            outlineWidth={0.1}
            outlineColor="#ff00ff"
            anchorX="center"
            anchorY="middle"
            maxWidth={30}
            textAlign="center"
          >
            {currentQuestion}
          </Text>
        </Float>
      )}

      <group ref={gatesRef}>
        {gates.map(gate => (
          <group key={gate.id} position={[0, 0, gate.z]}>
            <Box position={[-5, 3, 0]} args={[0.5, 6, 0.5]} castShadow>
              <meshStandardMaterial color="#0a0a1a" emissive="#ff00ff" emissiveIntensity={1.5} />
            </Box>
            <Box position={[5, 3, 0]} args={[0.5, 6, 0.5]} castShadow>
              <meshStandardMaterial color="#0a0a1a" emissive="#ff00ff" emissiveIntensity={1.5} />
            </Box>
            <Box position={[0, 6, 0]} args={[10.5, 0.5, 0.5]} castShadow>
              <meshStandardMaterial color="#0a0a1a" emissive="#ff00ff" emissiveIntensity={1.5} />
            </Box>

            {gate.doors.map((door, i) => (
              <group key={i} position={[door.lane * 3.5, 1.5, 0]}>
                <Box args={[2.8, 3, 0.2]} receiveShadow>
                  <meshStandardMaterial color="#111" transparent opacity={0.6} emissive="#00ffff" emissiveIntensity={0.2} />
                </Box>
                <Text position={[0, 0, 0.15]} fontSize={2} anchorX="center" anchorY="middle">
                  {door.flag}
                </Text>
              </group>
            ))}
          </group>
        ))}
      </group>
    </>
  );
}

function GameLoop() {
  const update = useRunnerStore(s => s.update);
  useFrame((_, dt) => {
    try {
      update(dt);
    } catch (e) {
      console.error('GameLoop error:', e);
    }
  });
  return null;
}
