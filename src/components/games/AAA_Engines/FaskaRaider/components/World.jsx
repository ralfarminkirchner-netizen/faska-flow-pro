import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Torus } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

export default function World() {
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const altarRef = useRef();

  useFrame((state, delta) => {
    if (puzzleSolved && altarRef.current) {
      // Smoothly raise the altar kinematically
      const currentPos = altarRef.current.translation();
      if (currentPos.y < 3) {
        altarRef.current.setNextKinematicTranslation(
          new THREE.Vector3(currentPos.x, currentPos.y + delta * 2, currentPos.z)
        );
      }
    }
  });

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 30, 10]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[0, 5, -20]} intensity={2} color="#ffaa00" />
      
      {/* STARTING AREA (Safe Zone) */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, -1, 15]}>
        <Box args={[20, 2, 20]} receiveShadow>
          <meshStandardMaterial color="#3a403a" roughness={0.9} />
        </Box>
      </RigidBody>

      {/* DEATH PIT & BROKEN BRIDGE */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, -25, 0]}>
        <Box args={[100, 2, 100]} receiveShadow>
          <meshStandardMaterial color="#1a0000" emissive="#ff1100" emissiveIntensity={0.5} />
        </Box>
      </RigidBody>

      {/* Stepping Stones / Broken Bridge */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, -1, 5]}>
        <Box args={[4, 2, 4]} castShadow receiveShadow>
          <meshStandardMaterial color="#4a504a" />
        </Box>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid" position={[-4, -1, 0]}>
        <Box args={[4, 2, 4]} castShadow receiveShadow>
          <meshStandardMaterial color="#4a504a" />
        </Box>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid" position={[4, -1, -5]}>
        <Box args={[4, 2, 4]} castShadow receiveShadow>
          <meshStandardMaterial color="#4a504a" />
        </Box>
      </RigidBody>

      {/* MAIN TEMPLE RUINS (Across the pit) */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, -1, -25]}>
        <Box args={[40, 2, 30]} receiveShadow>
          <meshStandardMaterial color="#3a403a" roughness={0.9} />
        </Box>
      </RigidBody>

      {/* Temple Pillars */}
      {[-15, -5, 5, 15].map((x) => 
        [-15, -25, -35].map((z) => (
          <RigidBody key={`pillar-${x}-${z}`} type="fixed" colliders="cuboid" position={[x, 4, z]}>
            <Cylinder args={[1, 1.2, 10, 8]} castShadow receiveShadow>
              <meshStandardMaterial color="#505550" />
            </Cylinder>
          </RigidBody>
        ))
      )}

      {/* INTERACTIVE PUZZLE */}
      <RigidBody type="dynamic" colliders="cuboid" position={[-8, 2, -20]} mass={5} lockRotations>
        <Box args={[3, 3, 3]} castShadow receiveShadow>
          <meshStandardMaterial color="#6b5c47" roughness={0.7} />
        </Box>
      </RigidBody>

      <RigidBody type="dynamic" colliders="cuboid" position={[8, 2, -20]} mass={5} lockRotations>
        <Box args={[3, 3, 3]} castShadow receiveShadow>
          <meshStandardMaterial color="#6b5c47" roughness={0.7} />
        </Box>
      </RigidBody>

      {/* Pressure Plates (Sensors) */}
      <RigidBody 
        type="fixed" 
        colliders="cuboid" 
        position={[-10, 0.1, -30]} 
        sensor
        onIntersectionEnter={() => setPuzzleSolved(true)}
      >
        <Box args={[4, 0.2, 4]} receiveShadow>
          <meshStandardMaterial color={puzzleSolved ? "#00ff00" : "#ffaa00"} emissive={puzzleSolved ? "#00ff00" : "#ffaa00"} emissiveIntensity={0.5} />
        </Box>
      </RigidBody>

      <RigidBody 
        type="fixed" 
        colliders="cuboid" 
        position={[10, 0.1, -30]} 
        sensor
        onIntersectionEnter={() => setPuzzleSolved(true)}
      >
        <Box args={[4, 0.2, 4]} receiveShadow>
          <meshStandardMaterial color={puzzleSolved ? "#00ff00" : "#ffaa00"} emissive={puzzleSolved ? "#00ff00" : "#ffaa00"} emissiveIntensity={0.5} />
        </Box>
      </RigidBody>

      {/* REWARD / ALTAR */}
      <RigidBody 
        ref={altarRef} 
        type="kinematicPosition" 
        colliders="cuboid" 
        position={[0, 0.5, -30]}
      >
        <group>
          <Box args={[6, 1, 6]} castShadow receiveShadow>
            <meshStandardMaterial color="#7a7a7a" />
          </Box>
          <Torus args={[1, 0.2, 16, 32]} position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} emissive="#ffd700" emissiveIntensity={puzzleSolved ? 1 : 0} />
          </Torus>
        </group>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" colliders="cuboid" position={[-20, 5, -25]}>
        <Box args={[2, 12, 30]} castShadow receiveShadow>
          <meshStandardMaterial color="#2a302a" />
        </Box>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid" position={[20, 5, -25]}>
        <Box args={[2, 12, 30]} castShadow receiveShadow>
          <meshStandardMaterial color="#2a302a" />
        </Box>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid" position={[0, 5, -40]}>
        <Box args={[40, 12, 2]} castShadow receiveShadow>
          <meshStandardMaterial color="#2a302a" />
        </Box>
      </RigidBody>

    </group>
  );
}
