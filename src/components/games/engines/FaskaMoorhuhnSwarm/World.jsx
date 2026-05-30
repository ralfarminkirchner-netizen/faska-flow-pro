import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Tree — Simple tree: cone on cylinder trunk.
 */
function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 6]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <coneGeometry args={[0.7, 1.4, 7]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>
      <mesh position={[0, 2.3, 0]} castShadow>
        <coneGeometry args={[0.5, 1.0, 7]} />
        <meshStandardMaterial color="#388e3c" />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow>
        <coneGeometry args={[0.3, 0.7, 6]} />
        <meshStandardMaterial color="#43a047" />
      </mesh>
    </group>
  );
}

/**
 * Bush — Low sphere cluster for foreground.
 */
function Bush({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.4, 6, 6]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>
      <mesh position={[0.3, 0.1, 0.1]} castShadow>
        <sphereGeometry args={[0.3, 6, 6]} />
        <meshStandardMaterial color="#388e3c" />
      </mesh>
      <mesh position={[-0.25, 0.05, -0.15]} castShadow>
        <sphereGeometry args={[0.32, 6, 6]} />
        <meshStandardMaterial color="#1b5e20" />
      </mesh>
    </group>
  );
}

/**
 * Cloud — Cluster of white spheres floating across.
 */
function Cloud({ position, speed = 0.3 }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x += speed * delta;
    if (ref.current.position.x > 25) ref.current.position.x = -25;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[1.0, 8, 6]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.9, 0.1, 0]}>
        <sphereGeometry args={[0.8, 8, 6]} />
        <meshStandardMaterial color="#f0f0f0" transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.7, -0.1, 0.2]}>
        <sphereGeometry args={[0.7, 8, 6]} />
        <meshStandardMaterial color="#f8f8f8" transparent opacity={0.82} />
      </mesh>
      <mesh position={[0.3, 0.3, -0.3]}>
        <sphereGeometry args={[0.6, 8, 6]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.75} />
      </mesh>
    </group>
  );
}

/**
 * RollingHill — Custom curved ground geometry.
 */
function RollingHill({ position, color, width = 30, depth = 12, heightScale = 1 }) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, depth, 60, 30);
    const posAttr = geo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      // Gentle rolling hills
      const z = (
        Math.sin(x * 0.3) * 0.5 +
        Math.sin(x * 0.7 + 1) * 0.3 +
        Math.cos(y * 0.5) * 0.4
      ) * heightScale;
      posAttr.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [width, depth, heightScale]);

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  );
}

/**
 * Fence post with rails — foreground decoration.
 */
function Fence({ position }) {
  return (
    <group position={position}>
      {/* Posts */}
      {[-1.5, 0, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 0.4, 0]} castShadow>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial color="#795548" />
        </mesh>
      ))}
      {/* Rails */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[3.2, 0.06, 0.06]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[3.2, 0.06, 0.06]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
    </group>
  );
}

/**
 * World — Beautiful outdoor scene for Moorhuhn shooting gallery.
 */
export default function World() {
  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.5} color="#b3d9ff" />
      <directionalLight
        position={[8, 12, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={15}
        shadow-camera-bottom={-5}
        color="#fff5e6"
      />
      <directionalLight position={[-5, 8, -3]} intensity={0.3} color="#88aaff" />

      {/* Sky gradient - large sphere */}
      <mesh position={[0, 0, -20]}>
        <sphereGeometry args={[40, 32, 16]} />
        <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} />
      </mesh>

      {/* Sun */}
      <mesh position={[10, 11, -18]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="#FFF59D" />
      </mesh>
      <pointLight position={[10, 11, -18]} intensity={0.8} color="#FFF59D" distance={30} />

      {/* Background mountains (far) */}
      <mesh position={[-8, 2.5, -14]} rotation={[0, 0.2, 0]}>
        <coneGeometry args={[6, 5, 5]} />
        <meshStandardMaterial color="#7986CB" flatShading />
      </mesh>
      <mesh position={[5, 3.5, -16]} rotation={[0, -0.1, 0]}>
        <coneGeometry args={[8, 7, 5]} />
        <meshStandardMaterial color="#5C6BC0" flatShading />
      </mesh>
      <mesh position={[0, 2, -13]} rotation={[0, 0.3, 0]}>
        <coneGeometry args={[5, 4, 5]} />
        <meshStandardMaterial color="#9FA8DA" flatShading />
      </mesh>
      {/* Snow caps */}
      <mesh position={[5, 6, -16]}>
        <coneGeometry args={[2.5, 1.5, 5]} />
        <meshStandardMaterial color="#e8eaf6" flatShading />
      </mesh>

      {/* Rolling hills — layered */}
      <RollingHill position={[0, 0, -8]} color="#558B2F" width={40} depth={10} heightScale={0.8} />
      <RollingHill position={[0, -0.2, -3]} color="#689F38" width={40} depth={8} heightScale={0.5} />
      <RollingHill position={[0, -0.5, 1]} color="#7CB342" width={40} depth={8} heightScale={0.3} />

      {/* Ground plane */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 30]} />
        <meshStandardMaterial color="#8BC34A" />
      </mesh>

      {/* Trees — scattered in background */}
      <Tree position={[-10, -0.2, -7]} scale={1.2} />
      <Tree position={[-7, -0.1, -9]} scale={0.9} />
      <Tree position={[-4, 0, -8]} scale={1.0} />
      <Tree position={[3, -0.1, -9]} scale={1.1} />
      <Tree position={[7, 0, -7]} scale={0.8} />
      <Tree position={[10, -0.2, -8]} scale={1.3} />
      <Tree position={[13, -0.1, -9]} scale={0.7} />
      <Tree position={[-13, 0, -8]} scale={1.0} />

      {/* Mid-ground trees */}
      <Tree position={[-12, -0.4, -4]} scale={1.5} />
      <Tree position={[11, -0.3, -5]} scale={1.4} />
      <Tree position={[-6, -0.3, -5]} scale={0.7} />
      <Tree position={[8, -0.4, -4]} scale={0.9} />

      {/* Bushes — foreground */}
      <Bush position={[-8, -0.3, -1]} />
      <Bush position={[-3, -0.4, 0]} />
      <Bush position={[5, -0.3, -1]} />
      <Bush position={[9, -0.4, 0.5]} />
      <Bush position={[-11, -0.4, 0.5]} />

      {/* Fences */}
      <Fence position={[-5, -0.3, 0.5]} />
      <Fence position={[2, -0.3, 0.5]} />
      <Fence position={[8, -0.3, 0.5]} />

      {/* Clouds */}
      <Cloud position={[-10, 9, -12]} speed={0.2} />
      <Cloud position={[5, 10, -14]} speed={0.15} />
      <Cloud position={[-3, 8.5, -11]} speed={0.25} />
      <Cloud position={[12, 9.5, -13]} speed={0.18} />

      {/* Atmospheric fog */}
      <fog attach="fog" args={['#87CEEB', 15, 40]} />
    </group>
  );
}
