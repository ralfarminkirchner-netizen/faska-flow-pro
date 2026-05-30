import React, { useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const FLAT_WIDTH = 4;
const R = 8;
const MAX_X = FLAT_WIDTH + R;

function getRampY(x) {
  const ax = Math.abs(x);
  if (ax <= FLAT_WIDTH) return 0;
  if (ax >= MAX_X) return R;
  const xp = ax - FLAT_WIDTH;
  return R - Math.sqrt(R * R - xp * xp);
}

export default function World() {
  const concreteTexture = useTexture('/textures/skate_concrete.png');
  concreteTexture.wrapS = concreteTexture.wrapT = THREE.RepeatWrapping;
  concreteTexture.repeat.set(4, 4);

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-MAX_X - 2, R);
    for(let i=0; i<=30; i++) {
       const t = i/30;
       const x = -MAX_X + t * R; 
       const y = getRampY(x);
       s.lineTo(x, y);
    }
    s.lineTo(FLAT_WIDTH, 0);
    for(let i=0; i<=30; i++) {
       const t = i/30;
       const x = FLAT_WIDTH + t * R;
       const y = getRampY(x);
       s.lineTo(x, y);
    }
    s.lineTo(MAX_X + 2, R);
    s.lineTo(MAX_X + 2, -2);
    s.lineTo(-MAX_X - 2, -2);
    s.lineTo(-MAX_X - 2, R);
    return s;
  }, []);

  return (
    <group>
      {/* Deep Background Floor */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0a0515" />
      </mesh>

      {/* The Halfpipe */}
      <RigidBody type="fixed" colliders="trimesh" position={[0, 0, -5]}>
        <mesh receiveShadow castShadow>
          <extrudeGeometry args={[shape, { depth: 10, bevelEnabled: false }]} />
          <meshStandardMaterial map={concreteTexture} color="#888888" roughness={0.8} />
        </mesh>
      </RigidBody>
    </group>
  );
}
