import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import useZeldaStore, { roomRequiresSmallKey } from './GameLogic';

/**
 * Zelda World — Top-down room with grass, walls, bushes, pots, enemies, items
 * UPGRADED: animated grass, flower patches, swaying trees, particle effects,
 * emissive rupees, warm lighting with colored point lights near doors
 */

function LabelSprite({ text, position, color = '#f8fafc', width = 1.8, height = 0.45 }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
    ctx.fillStyle = color;
    ctx.font = '900 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const result = new THREE.CanvasTexture(canvas);
    result.magFilter = THREE.NearestFilter;
    result.minFilter = THREE.NearestFilter;
    result.generateMipmaps = false;
    result.needsUpdate = true;
    return result;
  }, [text, color]);

  return (
    <mesh position={position} rotation={[-Math.PI / 3, 0, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

function makePixelTexture(draw, size = 32) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

function PixelCreature({ kind, phaseTwo = false }) {
  const texture = useMemo(() => makePixelTexture((ctx) => {
    const p = (color, x, y, w, h) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };
    ctx.clearRect(0, 0, 32, 32);
    p('rgba(0,0,0,.32)', 8, 26, 16, 3);
    if (kind === 'bat') {
      p('#3b0764', 6, 12, 7, 7);
      p('#3b0764', 19, 12, 7, 7);
      p('#7e22ce', 11, 10, 10, 12);
      p('#f87171', 13, 14, 2, 2);
      p('#f87171', 18, 14, 2, 2);
      return;
    }
    if (kind === 'guardian') {
      p('#0f172a', 9, 8, 14, 17);
      p('#f97316', 11, 10, 10, 4);
      p('#fef3c7', 14, 16, 4, 4);
      p('#fb923c', 7, 20, 18, 3);
      return;
    }
    if (kind === 'scribe') {
      p('#1e1b4b', 9, 8, 14, 17);
      p('#a78bfa', 11, 10, 10, 4);
      p('#fef3c7', 14, 16, 4, 4);
      p('#38bdf8', 7, 20, 18, 3);
      return;
    }
    if (kind === 'boss') {
      p(phaseTwo ? '#7f1d1d' : '#334155', 8, 6, 16, 20);
      p(phaseTwo ? '#ef4444' : '#facc15', 10, 7, 12, 4);
      p('#f8fafc', 12, 14, 3, 3);
      p('#f8fafc', 18, 14, 3, 3);
      p('#e5e7eb', 22, 13, 4, 15);
      p('#cbd5e1', 24, 24, 3, 4);
      return;
    }
    p('#991b1b', 9, 12, 14, 11);
    p('#ef4444', 7, 14, 18, 8);
    p('#fef2f2', 11, 16, 3, 3);
    p('#fef2f2', 18, 16, 3, 3);
    p('#111827', 12, 17, 1, 1);
    p('#111827', 19, 17, 1, 1);
  }), [kind, phaseTwo]);

  const scale = kind === 'boss' ? [1.56, 1.86, 1] : kind === 'bat' ? [1.18, 1.02, 1] : [1.02, 1.08, 1];
  const y = kind === 'boss' ? 1.28 : kind === 'bat' ? 1.05 : 0.74;
  return (
    <sprite position={[0, y, 0]} scale={scale}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

function PixelPickupSprite({ type, value = 1 }) {
  const texture = useMemo(() => makePixelTexture((ctx) => {
    const p = (color, x, y, w, h) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };
    ctx.clearRect(0, 0, 32, 32);
    p('rgba(0,0,0,.28)', 9, 25, 14, 3);

    if (type === 'heart') {
      p('#be123c', 10, 10, 5, 5);
      p('#be123c', 17, 10, 5, 5);
      p('#f43f5e', 8, 13, 16, 6);
      p('#e11d48', 11, 19, 10, 4);
      p('#fecdd3', 12, 12, 3, 2);
      return;
    }
    if (type === 'key') {
      p('#facc15', 9, 13, 13, 4);
      p('#fde68a', 19, 10, 6, 6);
      p('#78350f', 21, 12, 2, 2);
      p('#f59e0b', 8, 17, 4, 3);
      p('#f59e0b', 8, 21, 3, 3);
      return;
    }
    if (type === 'arrow') {
      p('#f8fafc', 9, 15, 15, 3);
      p('#fb923c', 20, 12, 6, 9);
      p('#94a3b8', 7, 13, 4, 7);
      return;
    }
    if (type === 'bomb') {
      p('#020617', 10, 12, 12, 12);
      p('#334155', 12, 10, 7, 3);
      p('#f97316', 18, 8, 4, 4);
      p('#facc15', 21, 6, 2, 2);
      return;
    }

    const blue = value >= 5;
    p(blue ? '#1d4ed8' : '#15803d', 14, 7, 5, 4);
    p(blue ? '#2563eb' : '#22c55e', 11, 11, 11, 11);
    p(blue ? '#93c5fd' : '#bbf7d0', 14, 12, 4, 3);
    p(blue ? '#1e3a8a' : '#166534', 13, 22, 7, 4);
  }), [type, value]);

  const scale = type === 'heart' ? [0.72, 0.72, 1] : type === 'key' ? [0.78, 0.78, 1] : [0.68, 0.72, 1];

  return (
    <sprite position={[0, 0.34, 0]} scale={scale}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

function PixelObjectSprite({ type }) {
  const texture = useMemo(() => makePixelTexture((ctx) => {
    const p = (color, x, y, w, h) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };
    ctx.clearRect(0, 0, 32, 32);
    p('rgba(0,0,0,.24)', 7, 27, 18, 3);

    if (type === 'tree') {
      p('#78350f', 14, 19, 5, 9);
      p('#14532d', 9, 8, 14, 8);
      p('#166534', 6, 13, 20, 8);
      p('#22c55e', 10, 11, 7, 3);
      p('#052e16', 8, 20, 17, 3);
      return;
    }
    if (type === 'pot') {
      p('#7c2d12', 11, 11, 10, 4);
      p('#c2410c', 9, 14, 14, 10);
      p('#9a3412', 11, 23, 10, 3);
      p('#fed7aa', 12, 15, 3, 3);
      return;
    }

    p('#14532d', 9, 13, 14, 9);
    p('#166534', 6, 16, 20, 7);
    p('#22c55e', 10, 14, 5, 3);
    p('#0f3d22', 8, 22, 17, 3);
  }), [type]);

  const scale = type === 'tree' ? [1.35, 1.72, 1] : type === 'pot' ? [0.62, 0.7, 1] : [0.82, 0.72, 1];
  const y = type === 'tree' ? 1.02 : type === 'pot' ? 0.38 : 0.34;

  return (
    <sprite position={[0, y, 0]} scale={scale}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

// Animated grass floor with subtle color variation
function GrassFloor() {
  const materialRef = useRef();

  const pixelTiles = useMemo(() => (
    Array.from({ length: 20 * 20 }, (_, i) => {
      const x = (i % 20) - 9.5;
      const z = Math.floor(i / 20) - 9.5;
      const tone = (i * 17 + Math.floor(i / 20) * 9) % 5;
      const colors = ['#2f6f30', '#347a34', '#28642d', '#3f873a', '#24582a'];
      return { x, z, color: colors[tone] };
    })
  ), []);

  const grassPatches = useMemo(() => (
    Array.from({ length: 20 }, (_, i) => {
      const angle = i * 2.399963;
      const radius = 2.2 + (((i * 37) % 100) / 100) * 6.8;
      const hue = 108 + ((i * 17) % 24);
      const saturation = 58 + ((i * 13) % 22);
      const lightness = 30 + ((i * 11) % 16);
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        rotation: (i * 0.73) % Math.PI,
        radius: 0.3 + ((i * 19) % 30) / 100,
        color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      };
    })
  ), []);

  // Flower patches — small instanced colored spheres
  const flowerPatches = useMemo(() => (
    Array.from({ length: 30 }, (_, i) => {
      const angle = i * 3.14159 * 0.618 + i * 0.37;
      const radius = 1.5 + (((i * 41) % 100) / 100) * 7.5;
      const colors = ['#ff6b9d', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98', '#ffd700'];
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        color: colors[i % colors.length],
        size: 0.06 + ((i * 13) % 20) / 200,
        phase: i * 1.23,
      };
    })
  ), []);

  // Animate grass floor subtle color
  useFrame((state) => {
    try {
      if (materialRef.current) {
        const t = state.clock.elapsedTime;
        const r = 0.29 + Math.sin(t * 0.3) * 0.02;
        const g = 0.55 + Math.sin(t * 0.5 + 1) * 0.03;
        const b = 0.25 + Math.sin(t * 0.4 + 2) * 0.01;
        materialRef.current.color.setRGB(r, g, b);
      }
    } catch {
      // Silent
    }
  });

  return (
    <RigidBody type="fixed" position={[0, 0, 0]} colliders="cuboid">
      <mesh receiveShadow>
        <boxGeometry args={[20, 0.2, 20]} />
        <meshStandardMaterial ref={materialRef} color="#376f35" roughness={1} flatShading />
      </mesh>
      {pixelTiles.map((tile, i) => (
        <mesh key={`tile-${i}`} position={[tile.x, 0.112, tile.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.04, 1.04]} />
          <meshStandardMaterial color={tile.color} roughness={1} flatShading />
        </mesh>
      ))}
      {/* Grass detail patches */}
      {grassPatches.map((patch, i) => (
        <mesh key={i} position={[patch.x, 0.11, patch.z]} rotation={[-Math.PI / 2, 0, patch.rotation]}>
          <circleGeometry args={[patch.radius, 6]} />
          <meshStandardMaterial color={patch.color} roughness={1} />
        </mesh>
      ))}
      {/* Flower patches */}
      {flowerPatches.map((flower, i) => (
        <FlowerPatch key={`f-${i}`} flower={flower} />
      ))}
    </RigidBody>
  );
}

// Small animated flower
function FlowerPatch({ flower }) {
  const meshRef = useRef();

  useFrame((state) => {
    try {
      if (!meshRef.current) return;
      meshRef.current.position.y = 0.18 + Math.sin(state.clock.elapsedTime * 2 + flower.phase) * 0.04;
    } catch {
      // Silent
    }
  });

  return (
    <mesh ref={meshRef} position={[flower.x, 0.18, flower.z]}>
      <sphereGeometry args={[flower.size, 6, 6]} />
      <meshStandardMaterial
        color={flower.color}
        emissive={flower.color}
        emissiveIntensity={0.8}
        toneMapped={false}
      />
    </mesh>
  );
}

// Swaying tree decoration
function SwayingTree({ position }) {
  const groupRef = useRef();
  const phase = useMemo(() => {
    const seed = Math.sin(position[0] * 12.9898 + position[2] * 78.233) * 43758.5453;
    return (seed - Math.floor(seed)) * Math.PI * 2;
  }, [position]);

  useFrame((state) => {
    try {
      if (!groupRef.current) return;
      const sway = Math.sin(state.clock.elapsedTime * 1.5 + phase) * 0.03;
      groupRef.current.rotation.z = sway;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.2 + phase + 1) * 0.02;
    } catch {
      // Silent
    }
  });

  return (
    <group position={position}>
      <PixelObjectSprite type="tree" />
      <group visible={false}>
        {/* Trunk */}
        <mesh castShadow position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.15, 1, 6]} />
          <meshStandardMaterial color="#6b4423" roughness={0.9} />
        </mesh>
        {/* Cone foliage with sway */}
        <group ref={groupRef}>
          <mesh castShadow position={[0, 1.4, 0]}>
            <coneGeometry args={[0.6, 1.2, 6]} />
            <meshStandardMaterial
              color="#2d8a3e"
              emissive="#1a5c28"
              emissiveIntensity={0.15}
              roughness={0.85}
            />
          </mesh>
          <mesh castShadow position={[0, 1.9, 0]}>
            <coneGeometry args={[0.45, 0.8, 6]} />
            <meshStandardMaterial
              color="#3da854"
              emissive="#22803c"
              emissiveIntensity={0.1}
              roughness={0.8}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// Static room trees
function RoomTrees() {
  const treePositions = useMemo(() => [
    [-7.5, 0, -7.5],
    [7.5, 0, -7.5],
    [-7.5, 0, 7.5],
    [7.5, 0, 7.5],
    [-8.2, 0, 0],
    [8.2, 0, 0],
  ], []);

  return (
    <>
      {treePositions.map((pos, i) => (
        <SwayingTree key={`tree-${i}`} position={pos} />
      ))}
    </>
  );
}

// Stone walls around room
function RoomWalls() {
  const wallColor = '#7a7a6e';
  const wallHeight = 1.5;
  const roomSize = 9.5;

  return (
    <>
      {/* North wall (with gap for door) */}
      <RigidBody type="fixed" position={[-5, wallHeight / 2, -roomSize]} colliders="cuboid">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[9, wallHeight, 0.6]} />
          <meshStandardMaterial color={wallColor} roughness={0.85} metalness={0.1} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[5, wallHeight / 2, -roomSize]} colliders="cuboid">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[9, wallHeight, 0.6]} />
          <meshStandardMaterial color={wallColor} roughness={0.85} metalness={0.1} />
        </mesh>
      </RigidBody>

      {/* South wall (with gap) */}
      <RigidBody type="fixed" position={[-5, wallHeight / 2, roomSize]} colliders="cuboid">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[9, wallHeight, 0.6]} />
          <meshStandardMaterial color={wallColor} roughness={0.85} metalness={0.1} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[5, wallHeight / 2, roomSize]} colliders="cuboid">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[9, wallHeight, 0.6]} />
          <meshStandardMaterial color={wallColor} roughness={0.85} metalness={0.1} />
        </mesh>
      </RigidBody>

      {/* East wall */}
      <RigidBody type="fixed" position={[roomSize, wallHeight / 2, 0]} colliders="cuboid">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.6, wallHeight, 20]} />
          <meshStandardMaterial color={wallColor} roughness={0.85} metalness={0.1} />
        </mesh>
      </RigidBody>

      {/* West wall */}
      <RigidBody type="fixed" position={[-roomSize, wallHeight / 2, 0]} colliders="cuboid">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.6, wallHeight, 20]} />
          <meshStandardMaterial color={wallColor} roughness={0.85} metalness={0.1} />
        </mesh>
      </RigidBody>

      {/* Wall top decorations (darker stone) */}
      {[
        [-5, wallHeight + 0.15, -roomSize],
        [5, wallHeight + 0.15, -roomSize],
        [-5, wallHeight + 0.15, roomSize],
        [5, wallHeight + 0.15, roomSize],
      ].map((pos, i) => (
        <mesh key={`top-${i}`} position={pos}>
          <boxGeometry args={[9, 0.3, 0.7]} />
          <meshStandardMaterial color="#5a5a4e" roughness={0.9} />
        </mesh>
      ))}
    </>
  );
}

// Door indicators (N and S) with colored point lights
function DoorIndicators() {
  const currentRoom = useZeldaStore((s) => s.currentRoom);
  const totalRooms = useZeldaStore((s) => s.totalRooms);
  const keys = useZeldaStore((s) => s.keys);
  const openedKeyRooms = useZeldaStore((s) => s.openedKeyRooms);
  const doorLightRef = useRef();
  const nextRoom = currentRoom + 1;
  const northNeedsKey = currentRoom < totalRooms - 1
    && roomRequiresSmallKey(nextRoom)
    && !openedKeyRooms.includes(nextRoom);
  const northDoorReady = !northNeedsKey || keys > 0;

  useFrame((state) => {
    try {
      if (doorLightRef.current) {
        doorLightRef.current.intensity = 3 + Math.sin(state.clock.elapsedTime * 3) * 1.5;
      }
    } catch {
      // Silent
    }
  });

  return (
    <>
      {/* North door (forward) */}
      {currentRoom < totalRooms - 1 && (
        <group position={[0, 0.1, -9.5]}>
          <mesh>
            <boxGeometry args={[1.5, 0.05, 0.8]} />
            <meshStandardMaterial
              color={northNeedsKey ? '#92400e' : '#8B6914'}
              emissive={northNeedsKey ? '#facc15' : '#ffcc44'}
              emissiveIntensity={northNeedsKey ? 1.15 : 0.8}
              toneMapped={false}
            />
          </mesh>
          {/* Arrow indicator */}
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.3, 0.5, 3]} />
            <meshStandardMaterial
              color={northDoorReady ? '#ffdd44' : '#fb923c'}
              emissive={northDoorReady ? '#ffdd44' : '#fb923c'}
              emissiveIntensity={northNeedsKey ? 1.5 : 1.2}
              toneMapped={false}
              transparent
              opacity={0.7}
            />
          </mesh>
          {northNeedsKey && (
            <LabelSprite
              text={northDoorReady ? 'KEY READY' : 'SMALL KEY'}
              position={[0, 1.05, 0.2]}
              color={northDoorReady ? '#fef08a' : '#fb923c'}
              width={2.35}
            />
          )}
          <pointLight ref={doorLightRef} color={northDoorReady ? '#ffaa33' : '#fb923c'} intensity={northNeedsKey ? 5 : 4} distance={6} decay={2} />
        </group>
      )}

      {/* South door (backward) */}
      {currentRoom > 0 && (
        <group position={[0, 0.1, 9.5]}>
          <mesh>
            <boxGeometry args={[1.5, 0.05, 0.8]} />
            <meshStandardMaterial
              color="#8B6914"
              emissive="#ffcc44"
              emissiveIntensity={0.6}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, Math.PI]}>
            <coneGeometry args={[0.3, 0.5, 3]} />
            <meshStandardMaterial
              color="#ffdd44"
              emissive="#ffdd44"
              emissiveIntensity={1.0}
              toneMapped={false}
              transparent
              opacity={0.6}
            />
          </mesh>
          <pointLight color="#ffaa33" intensity={3} distance={5} decay={2} />
        </group>
      )}
    </>
  );
}

// Bush component
function Bush({ bush }) {
  if (bush.destroyed) return null;

  return (
    <group position={bush.position}>
      <PixelObjectSprite type="bush" />
      <group visible={false}>
        <mesh castShadow>
          <sphereGeometry args={[0.35, 8, 6]} />
          <meshStandardMaterial
            color="#2d7a2d"
            roughness={0.9}
          />
        </mesh>
        {/* Lighter leaves on top */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.25, 6, 6]} />
          <meshStandardMaterial color="#3d9a3d" roughness={0.85} />
        </mesh>
        {/* Shadow */}
        <mesh position={[0, -0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.3, 8]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.2} />
        </mesh>
      </group>
    </group>
  );
}

// Pot component
function Pot({ pot }) {
  if (pot.destroyed) return null;

  return (
    <group position={pot.position}>
      <PixelObjectSprite type="pot" />
      <group visible={false}>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
          <meshStandardMaterial
            color="#c4956a"
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
        {/* Rim */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.22, 0.2, 0.05, 8]} />
          <meshStandardMaterial color="#a07850" roughness={0.6} />
        </mesh>
        {/* Shadow */}
        <mesh position={[0, -0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.22, 8]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.2} />
        </mesh>
      </group>
    </group>
  );
}

// Rupee item — enhanced emissive glow
function Rupee({ item }) {
  const meshRef = useRef();
  const lightRef = useRef();

  useFrame((state, delta) => {
    try {
      if (!meshRef.current || item.collected) return;
      meshRef.current.rotation.y += delta * 3;
      meshRef.current.position.y = item.position[1] + Math.sin(Date.now() * 0.003) * 0.1;
      // Pulse the point light
      if (lightRef.current) {
        lightRef.current.intensity = 3 + Math.sin(state.clock.elapsedTime * 5) * 1.5;
      }
    } catch {
      // Silent
    }
  });

  if (item.collected) return null;

  const isBlue = item.value >= 5;
  const color = isBlue ? '#2244ff' : '#00ff66';
  const emissive = isBlue ? '#3355ff' : '#00ff88';

  return (
    <group ref={meshRef} position={item.position}>
      <PixelPickupSprite type="rupee" value={item.value} />
      <group visible={false}>
        {/* Octahedron shape for rupee */}
        <mesh castShadow>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={2.5}
            metalness={0.8}
            roughness={0.1}
            transparent
            opacity={0.92}
            toneMapped={false}
          />
        </mesh>
      </group>
      <pointLight ref={lightRef} color={emissive} intensity={4} distance={4} decay={2} />
    </group>
  );
}

// Heart pickup
function HeartPickup({ item }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    try {
      if (!meshRef.current || item.collected) return;
      meshRef.current.rotation.y += delta * 2;
      meshRef.current.position.y = item.position[1] + Math.sin(Date.now() * 0.004) * 0.12;
    } catch {
      // Silent
    }
  });

  if (item.collected) return null;

  return (
    <group ref={meshRef} position={item.position}>
      <PixelPickupSprite type="heart" />
      <group visible={false}>
        {/* Heart shape (two spheres + cone) */}
        <mesh position={[-0.08, 0.08, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color="#ff2255"
            emissive="#ff0044"
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0.08, 0.08, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color="#ff2255"
            emissive="#ff0044"
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, -0.05, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.14, 0.2, 4]} />
          <meshStandardMaterial
            color="#ff2255"
            emissive="#ff0044"
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
      </group>
      <pointLight color="#ff2255" intensity={3} distance={4} decay={2} />
    </group>
  );
}

function KeyPickup({ item }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    try {
      if (!meshRef.current || item.collected) return;
      meshRef.current.rotation.y += delta * 2.4;
      meshRef.current.position.y = item.position[1] + Math.sin(Date.now() * 0.004 + item.id) * 0.1;
    } catch {
      // Silent
    }
  });

  if (item.collected) return null;

  return (
    <group ref={meshRef} position={item.position}>
      <PixelPickupSprite type="key" />
      <group visible={false}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.12, 0.42, 0.08]} />
          <meshStandardMaterial color="#facc15" emissive="#ffdd33" emissiveIntensity={1.5} metalness={0.8} roughness={0.2} toneMapped={false} />
        </mesh>
        <mesh position={[0.22, 0, 0]}>
          <torusGeometry args={[0.13, 0.025, 8, 20]} />
          <meshStandardMaterial color="#fde68a" emissive="#facc15" emissiveIntensity={1.2} metalness={0.8} roughness={0.2} toneMapped={false} />
        </mesh>
      </group>
      <pointLight color="#facc15" intensity={3} distance={5} decay={2} />
    </group>
  );
}

function ArrowPickup({ item }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    try {
      if (!meshRef.current || item.collected) return;
      meshRef.current.rotation.y += delta * 1.6;
    } catch {
      // Silent
    }
  });

  if (item.collected) return null;

  return (
    <group ref={meshRef} position={item.position}>
      <PixelPickupSprite type="arrow" />
      <group visible={false}>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.62, 8]} />
          <meshStandardMaterial color="#d6d3d1" metalness={0.2} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.18, 8]} />
          <meshStandardMaterial color="#f97316" emissive="#ff8833" emissiveIntensity={1.0} toneMapped={false} />
        </mesh>
      </group>
      <pointLight color="#f97316" intensity={2} distance={3} decay={2} />
    </group>
  );
}

function BombPickup({ item }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    try {
      if (!meshRef.current || item.collected) return;
      meshRef.current.rotation.y += delta * 2.2;
      meshRef.current.position.y = item.position[1] + Math.sin(Date.now() * 0.004 + item.id) * 0.08;
    } catch {
      // Silent
    }
  });

  if (item.collected) return null;

  return (
    <group ref={meshRef} position={item.position}>
      <PixelPickupSprite type="bomb" />
      <group visible={false}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 12, 10]} />
          <meshStandardMaterial color="#111827" emissive="#f97316" emissiveIntensity={0.28} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.22, 0]} rotation={[0.7, 0, 0.4]}>
          <cylinderGeometry args={[0.025, 0.025, 0.22, 6]} />
          <meshStandardMaterial color="#92400e" emissive="#f59e0b" emissiveIntensity={0.35} />
        </mesh>
      </group>
      <pointLight color="#f97316" intensity={1.8} distance={3.5} decay={2} />
    </group>
  );
}

function EnemyPostureCue({ enemy, width = 0.62, y = 0.74 }) {
  const maxPosture = enemy.maxPosture || 1;
  const postureRatio = Math.max(0, Math.min(1, (enemy.posture ?? maxPosture) / maxPosture));
  const showPosture = enemy.alive && (enemy.stunned > 0 || postureRatio < 0.98);

  if (!showPosture) return null;

  return (
    <group position={[0, y, 0]}>
      <mesh>
        <planeGeometry args={[width, 0.05]} />
        <meshBasicMaterial color="#172554" transparent opacity={0.9} />
      </mesh>
      <mesh position={[-((width / 2) * (1 - postureRatio)), 0, 0.002]}>
        <planeGeometry args={[width * postureRatio, 0.05]} />
        <meshBasicMaterial color={enemy.stunned > 0 ? '#fef08a' : '#38bdf8'} />
      </mesh>
      {enemy.stunned > 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -y + 0.04, 0]}>
          <ringGeometry args={[0.62, 0.82, 24]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.48} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// Slime enemy — with death animation
function SlimeEnemy({ enemy, particleRef }) {
  const meshRef = useRef();
  const deathRef = useRef({ dying: false, scale: 1 });

  useFrame((_, delta) => {
    try {
      if (!meshRef.current) return;

      // Death animation: scale to 0
      if (!enemy.alive && !deathRef.current.dying) {
        deathRef.current.dying = true;
        deathRef.current.scale = 1;
        // Emit death particles
        try {
          particleRef?.current?.emit(
            { x: enemy.position[0], y: enemy.position[1] + 0.3, z: enemy.position[2] },
            { x: 0, y: 1, z: 0 },
            { count: 16, spread: 2, speed: 4, color: '#ff4444' }
          );
        } catch {
          // Silent
        }
      }

      if (deathRef.current.dying) {
        deathRef.current.scale = Math.max(0, deathRef.current.scale - delta * 3.3);
        meshRef.current.scale.setScalar(deathRef.current.scale);
        if (deathRef.current.scale <= 0) return;
      }

      if (enemy.alive) {
        meshRef.current.position.set(
          enemy.position[0],
          enemy.position[1] + Math.abs(Math.sin(enemy.bouncePhase)) * 0.2,
          enemy.position[2]
        );
        // Squash and stretch
        const squash = 1 + Math.sin(enemy.bouncePhase) * 0.15;
        meshRef.current.scale.set(1 / squash, squash, 1 / squash);
      }
    } catch {
      // Silent
    }
  });

  if (!enemy.alive) return null;

  return (
    <group ref={meshRef} position={enemy.position}>
      <PixelCreature kind="slime" />
      <group visible={false}>
        {/* Slime body — squashed sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.35, 8, 6]} />
          <meshStandardMaterial
            color="#cc2222"
            emissive="#ff3333"
            emissiveIntensity={0.5}
            transparent
            opacity={0.85}
            roughness={0.3}
            metalness={0.1}
            toneMapped={false}
          />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.1, 0.15, 0.25]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.1, 0.15, 0.25]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Pupils */}
        <mesh position={[0.1, 0.15, 0.3]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        <mesh position={[-0.1, 0.15, 0.3]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        {/* Shadow */}
        <mesh position={[0, -0.29, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.25, 8]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.3} />
        </mesh>
      </group>
      {/* Health bar */}
      {enemy.alive && enemy.health < enemy.maxHealth && (
        <group position={[0, 0.6, 0]}>
          <mesh>
            <planeGeometry args={[0.6, 0.06]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
          <mesh position={[-(0.3 * (1 - enemy.health / enemy.maxHealth)), 0, 0.001]}>
            <planeGeometry args={[0.6 * (enemy.health / enemy.maxHealth), 0.06]} />
            <meshBasicMaterial color="#ff2222" />
          </mesh>
        </group>
      )}
      <EnemyPostureCue enemy={enemy} y={0.74} width={0.62} />
    </group>
  );
}

// Bat enemy — with death particles
function BatEnemy({ enemy, particleRef }) {
  const meshRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();
  const wingPhase = useRef(((enemy.id * 1973) % 6283) / 1000);
  const deathRef = useRef({ dying: false, scale: 1 });

  useFrame((_, delta) => {
    try {
      if (!meshRef.current) return;

      if (!enemy.alive && !deathRef.current.dying) {
        deathRef.current.dying = true;
        deathRef.current.scale = 1;
        try {
          particleRef?.current?.emit(
            { x: enemy.position[0], y: enemy.position[1] + 0.5, z: enemy.position[2] },
            { x: 0, y: 1, z: 0 },
            { count: 14, spread: 2.5, speed: 5, color: '#8844ff' }
          );
        } catch {
          // Silent
        }
      }

      if (deathRef.current.dying) {
        deathRef.current.scale = Math.max(0, deathRef.current.scale - delta * 3.3);
        meshRef.current.scale.setScalar(deathRef.current.scale);
        if (deathRef.current.scale <= 0) return;
      }

      if (enemy.alive) {
        meshRef.current.position.set(
          enemy.position[0],
          enemy.position[1] + 0.5 + Math.sin(enemy.bouncePhase) * 0.3,
          enemy.position[2]
        );
        wingPhase.current += delta * 15;
        const wingAngle = Math.sin(wingPhase.current) * 0.5;
        if (leftWingRef.current) leftWingRef.current.rotation.z = wingAngle;
        if (rightWingRef.current) rightWingRef.current.rotation.z = -wingAngle;
      }
    } catch {
      // Silent
    }
  });

  if (!enemy.alive) return null;

  return (
    <group ref={meshRef} position={enemy.position}>
      <PixelCreature kind="bat" />
      <group visible={false}>
        {/* Body */}
        <mesh castShadow>
          <sphereGeometry args={[0.15, 6, 6]} />
          <meshStandardMaterial color="#4422aa" emissive="#6633ff" emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
        {/* Wings */}
        <mesh ref={leftWingRef} position={[0.25, 0.05, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.2]} />
          <meshStandardMaterial color="#553399" transparent opacity={0.7} />
        </mesh>
        <mesh ref={rightWingRef} position={[-0.25, 0.05, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.2]} />
          <meshStandardMaterial color="#553399" transparent opacity={0.7} />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.05, 0.05, 0.12]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#ff4444" emissive="#ff4444" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        <mesh position={[-0.05, 0.05, 0.12]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#ff4444" emissive="#ff4444" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        {/* Shadow */}
        <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.15, 8]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function GuardianEnemy({ enemy, particleRef }) {
  const meshRef = useRef();
  const deathRef = useRef({ dying: false, scale: 1 });

  useFrame((_, delta) => {
    try {
      if (!meshRef.current) return;

      if (!enemy.alive && !deathRef.current.dying) {
        deathRef.current.dying = true;
        deathRef.current.scale = 1;
        try {
          particleRef?.current?.emit(
            { x: enemy.position[0], y: enemy.position[1] + 0.3, z: enemy.position[2] },
            { x: 0, y: 1.5, z: 0 },
            { count: 20, spread: 2, speed: 5, color: enemy.type === 'scribe' ? '#a855f7' : '#ff8833' }
          );
        } catch {
          // Silent
        }
      }

      if (deathRef.current.dying) {
        deathRef.current.scale = Math.max(0, deathRef.current.scale - delta * 3.3);
        meshRef.current.scale.setScalar(deathRef.current.scale);
        if (deathRef.current.scale <= 0) return;
      }

      if (enemy.alive) {
        meshRef.current.position.set(
          enemy.position[0],
          enemy.position[1] + Math.sin(enemy.bouncePhase) * 0.08,
          enemy.position[2]
        );
        meshRef.current.rotation.y += delta * 0.8;
      }
    } catch {
      // Silent
    }
  });

  if (!enemy.alive) return null;

  const scribe = enemy.type === 'scribe';
  const color = scribe ? '#7c3aed' : '#f97316';

  return (
    <group ref={meshRef} position={enemy.position}>
      <PixelCreature kind={scribe ? 'scribe' : 'guardian'} />
      <group visible={false}>
        <mesh castShadow>
          <octahedronGeometry args={[0.48, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} metalness={0.7} roughness={0.22} toneMapped={false} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.46, 0]}>
          <torusGeometry args={[0.58, 0.035, 8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.58} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.03, 0.42]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#fef3c7" />
        </mesh>
      </group>
      {enemy.alive && enemy.health < enemy.maxHealth && (
        <group position={[0, 0.82, 0]}>
          <mesh>
            <planeGeometry args={[0.8, 0.07]} />
            <meshBasicMaterial color="#1f2937" />
          </mesh>
          <mesh position={[-(0.4 * (1 - enemy.health / enemy.maxHealth)), 0, 0.001]}>
            <planeGeometry args={[0.8 * (enemy.health / enemy.maxHealth), 0.07]} />
            <meshBasicMaterial color="#f97316" />
          </mesh>
        </group>
      )}
      <EnemyPostureCue enemy={enemy} y={0.96} width={0.84} />
      <pointLight color={color} intensity={3.2} distance={5} decay={2} />
    </group>
  );
}

function TempleKnightEnemy({ enemy, particleRef }) {
  const meshRef = useRef();
  const phaseTwo = enemy.phase === 2;
  const deathRef = useRef({ dying: false, scale: 1 });

  useFrame((_, delta) => {
    try {
      if (!meshRef.current) return;

      if (!enemy.alive && !deathRef.current.dying) {
        deathRef.current.dying = true;
        deathRef.current.scale = 1;
        try {
          particleRef?.current?.emit(
            { x: enemy.position[0], y: enemy.position[1] + 0.5, z: enemy.position[2] },
            { x: 0, y: 2, z: 0 },
            { count: 30, spread: 3, speed: 6, color: '#facc15' }
          );
        } catch {
          // Silent
        }
      }

      if (deathRef.current.dying) {
        deathRef.current.scale = Math.max(0, deathRef.current.scale - delta * 3.3);
        meshRef.current.scale.setScalar(deathRef.current.scale);
        if (deathRef.current.scale <= 0) return;
      }

      if (enemy.alive) {
        meshRef.current.position.set(
          enemy.position[0],
          enemy.position[1] + Math.sin(enemy.bouncePhase) * 0.05,
          enemy.position[2]
        );
        meshRef.current.rotation.y += delta * (phaseTwo ? 0.75 : 0.45);
      }
    } catch {
      // Silent
    }
  });

  if (!enemy.alive) return null;

  const color = phaseTwo ? '#ef4444' : '#facc15';

  return (
    <group ref={meshRef} position={enemy.position}>
      <PixelCreature kind="boss" phaseTwo={phaseTwo} />
      <group visible={false}>
        <mesh castShadow position={[0, 0.42, 0]}>
          <capsuleGeometry args={[0.42, 0.88, 6, 12]} />
          <meshStandardMaterial color="#334155" emissive={color} emissiveIntensity={phaseTwo ? 1.2 : 0.6} metalness={0.55} roughness={0.24} toneMapped={false} />
        </mesh>
        <mesh castShadow position={[0, 1.04, 0]}>
          <sphereGeometry args={[0.36, 14, 12]} />
          <meshStandardMaterial color="#0f172a" emissive={color} emissiveIntensity={0.8} metalness={0.65} roughness={0.18} toneMapped={false} />
        </mesh>
        <mesh position={[0.64, 0.42, 0.08]} rotation={[0, 0.12, 0.75]}>
          <boxGeometry args={[0.12, 0.08, 1.18]} />
          <meshStandardMaterial color="#e5e7eb" emissive="#93c5fd" emissiveIntensity={0.5} metalness={0.92} roughness={0.12} toneMapped={false} />
        </mesh>
        <mesh position={[-0.55, 0.46, 0.18]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.46, 0.58, 0.08]} />
          <meshStandardMaterial color="#1d4ed8" emissive={enemy.attackWindup > 0 ? '#facc15' : '#172554'} emissiveIntensity={enemy.attackWindup > 0 ? 1.5 : 0.4} metalness={0.55} roughness={0.25} toneMapped={false} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]}>
          <ringGeometry args={[0.72, enemy.attackWindup > 0 ? 1.8 : 1.06, 40]} />
          <meshBasicMaterial color={color} transparent opacity={enemy.attackWindup > 0 ? 0.34 : 0.18} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group position={[0, 1.52, 0]}>
        <mesh>
          <planeGeometry args={[1.5, 0.09]} />
          <meshBasicMaterial color="#111827" />
        </mesh>
        <mesh position={[-(0.75 * (1 - enemy.health / enemy.maxHealth)), 0, 0.002]}>
          <planeGeometry args={[1.5 * (enemy.health / enemy.maxHealth), 0.09]} />
          <meshBasicMaterial color={phaseTwo ? '#ef4444' : '#facc15'} />
        </mesh>
      </group>
      <EnemyPostureCue enemy={enemy} y={1.66} width={1.5} />
      <pointLight color={color} intensity={phaseTwo ? 6 : 4} distance={7} decay={2} />
    </group>
  );
}

// Enemies manager
function EnemiesManager({ particleRef }) {
  const enemies = useZeldaStore((s) => s.enemies);
  const updateEnemies = useZeldaStore((s) => s.updateEnemies);
  const playerPosition = useZeldaStore((s) => s.playerPosition);

  useFrame((_, delta) => {
    try {
      updateEnemies(playerPosition, Math.min(delta, 0.05));
    } catch (error) {
      console.warn('[EnemiesManager] error:', error);
    }
  });

  return (
    <>
	      {enemies.map((enemy) => {
	        if (enemy.type === 'bat') return <BatEnemy key={enemy.id} enemy={enemy} particleRef={particleRef} />;
	        if (enemy.type === 'boss') return <TempleKnightEnemy key={enemy.id} enemy={enemy} particleRef={particleRef} />;
	        if (enemy.type === 'guardian' || enemy.type === 'scribe') return <GuardianEnemy key={enemy.id} enemy={enemy} particleRef={particleRef} />;
        return <SlimeEnemy key={enemy.id} enemy={enemy} particleRef={particleRef} />;
      })}
    </>
  );
}

// All items
function ItemsManager() {
  const items = useZeldaStore((s) => s.items);

  return (
    <>
      {items.map((item) => {
	        if (item.type === 'heart') return <HeartPickup key={item.id} item={item} />;
	        if (item.type === 'key') return <KeyPickup key={item.id} item={item} />;
	        if (item.type === 'arrow') return <ArrowPickup key={item.id} item={item} />;
	        if (item.type === 'bomb') return <BombPickup key={item.id} item={item} />;
	        return <Rupee key={item.id} item={item} />;
      })}
    </>
  );
}

function SwitchPlate({ button }) {
  const profiles = {
    blade: { color: '#facc15', dark: '#78350f', icon: 'BLADE' },
    arrow: { color: '#38bdf8', dark: '#164e63', icon: 'ARROW' },
    bomb: { color: '#fb923c', dark: '#7c2d12', icon: 'BOMB' },
    shield: { color: '#a78bfa', dark: '#4c1d95', icon: 'GUARD' },
  };
  const profile = profiles[button.kind || 'blade'] || profiles.blade;

  if (button.active) {
    return (
      <group position={button.position}>
        <mesh>
          <cylinderGeometry args={[0.52, 0.52, 0.12, 24]} />
          <meshStandardMaterial color="#22c55e" emissive="#22ff55" emissiveIntensity={1.2} roughness={0.4} flatShading toneMapped={false} />
        </mesh>
        <LabelSprite text="OPEN" position={[0, 0.62, 0]} color="#86efac" width={1.2} />
        <pointLight color="#22c55e" intensity={3} distance={5} decay={2} />
      </group>
    );
  }

  return (
    <group position={button.position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.56, 0.56, 0.18, 24]} />
        <meshStandardMaterial color={profile.dark} emissive={profile.color} emissiveIntensity={0.28} roughness={0.45} flatShading />
      </mesh>
      <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.62, 0.08, 0.62]} />
        <meshStandardMaterial color={profile.color} emissive={profile.color} emissiveIntensity={0.65} flatShading toneMapped={false} />
      </mesh>
      <LabelSprite text={button.label || profile.icon} position={[0, 0.62, 0]} color={profile.color} width={1.25} />
    </group>
  );
}

function Shrine({ shrine }) {
  const color = shrine.solved ? '#22c55e' : shrine.failed ? '#ef4444' : '#38bdf8';
  return (
    <group position={shrine.position}>
      <mesh castShadow>
        <boxGeometry args={[1.1, 0.42, 0.8]} />
        <meshStandardMaterial color="#334155" emissive={color} emissiveIntensity={shrine.solved || shrine.failed ? 0.6 : 0.3} roughness={0.35} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <octahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} metalness={0.45} roughness={0.25} toneMapped={false} />
      </mesh>
      <LabelSprite text={shrine.label} position={[0, 0.92, 0]} color={color} width={1.55} />
      <pointLight color={color} intensity={3} distance={5} decay={2} />
    </group>
  );
}

function PuzzleManager() {
  const switches = useZeldaStore((s) => s.switches);
  const shrines = useZeldaStore((s) => s.shrines);

  return (
    <>
      {switches.map((button) => (
        <SwitchPlate key={button.id} button={button} />
      ))}
      {shrines.map((shrine) => (
        <Shrine key={shrine.id} shrine={shrine} />
      ))}
    </>
  );
}

function ArrowProjectile({ arrow }) {
  const angle = Math.atan2(arrow.velocity[0], arrow.velocity[2]);

  return (
    <group position={arrow.position} rotation={[0, angle, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.035, 0.035, 0.7, 8]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.25} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <coneGeometry args={[0.09, 0.18, 8]} />
        <meshStandardMaterial color="#facc15" emissive="#ffcc33" emissiveIntensity={1.0} toneMapped={false} />
      </mesh>
    </group>
  );
}

function EnemyProjectile({ projectile }) {
  const color = projectile.color || '#f97316';

  return (
    <group position={projectile.position}>
      <mesh>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <pointLight color={color} intensity={4} distance={5} decay={2} />
    </group>
  );
}

function BombEntity({ bomb }) {
  const fuseRatio = Math.max(0, Math.min(1, bomb.fuse / 1.35));
  const pulse = bomb.exploding ? 1 : 1 + (1 - fuseRatio) * 0.12;

  return (
    <group position={bomb.position}>
      {bomb.exploding ? (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[bomb.radius * 0.22, bomb.radius, 48]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.36} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.34, 0]}>
            <sphereGeometry args={[bomb.radius * 0.36, 18, 14]} />
            <meshStandardMaterial color="#facc15" emissive="#ffaa00" emissiveIntensity={3} transparent opacity={0.45} toneMapped={false} />
          </mesh>
          <pointLight color="#f97316" intensity={12} distance={10} decay={2} />
        </>
      ) : (
        <>
          <mesh castShadow scale={[pulse, pulse, pulse]}>
            <sphereGeometry args={[0.22, 14, 12]} />
            <meshStandardMaterial color="#020617" emissive={bomb.fuse < 0.5 ? '#ef4444' : '#f97316'} emissiveIntensity={bomb.fuse < 0.5 ? 0.8 : 0.35} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.25, 0]} rotation={[0.7, 0, 0.4]}>
            <cylinderGeometry args={[0.028, 0.028, 0.28, 6]} />
            <meshStandardMaterial color="#92400e" emissive="#facc15" emissiveIntensity={bomb.fuse < 0.5 ? 0.75 : 0.28} />
          </mesh>
        </>
      )}
    </group>
  );
}

function LockOnReticle() {
  const targetLockId = useZeldaStore((s) => s.targetLockId);
  const enemies = useZeldaStore((s) => s.enemies);
  const target = targetLockId ? enemies.find((enemy) => enemy.id === targetLockId && enemy.alive) : null;

  if (!target) return null;

  const color = target.type === 'boss' ? '#ef4444' : '#facc15';
  return (
    <group position={[target.position[0], target.position[1] + 0.08, target.position[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.74, target.type === 'boss' ? 1.18 : 0.92, 42]} />
        <meshBasicMaterial color={color} transparent opacity={0.64} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, target.type === 'boss' ? 1.85 : 1.05, 0]}>
        <torusGeometry args={[0.34, 0.028, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function ProjectileManager() {
  const arrows = useZeldaStore((s) => s.arrowsInFlight);
  const enemyProjectiles = useZeldaStore((s) => s.enemyProjectiles);
  const bombs = useZeldaStore((s) => s.activeBombs);
  const updateArrows = useZeldaStore((s) => s.updateArrows);
  const updateBombs = useZeldaStore((s) => s.updateBombs);

  useFrame((_, delta) => {
    try {
      const clampedDelta = Math.min(delta, 0.05);
      updateArrows(clampedDelta);
      updateBombs(clampedDelta);
    } catch (error) {
      console.warn('[Zelda Projectiles] error:', error);
    }
  });

  return (
    <>
      {arrows.map((arrow) => (
        <ArrowProjectile key={arrow.id} arrow={arrow} />
      ))}
	      {enemyProjectiles.map((projectile) => (
	        <EnemyProjectile key={projectile.id} projectile={projectile} />
	      ))}
	      {bombs.map((bomb) => (
	        <BombEntity key={bomb.id} bomb={bomb} />
	      ))}
	    </>
	  );
}

// Bushes & pots
function DecorationManager() {
  const bushes = useZeldaStore((s) => s.bushes);
  const pots = useZeldaStore((s) => s.pots);

  return (
    <>
      {bushes.map((bush) => (
        <Bush key={bush.id} bush={bush} />
      ))}
      {pots.map((pot) => (
        <Pot key={pot.id} pot={pot} />
      ))}
    </>
  );
}

// Enhanced lighting — warm sunlight + colored point lights near doors
function ZeldaLighting() {
  return (
    <>
      <ambientLight intensity={0.35} color="#ffeedd" />
      <directionalLight
        position={[8, 15, 5]}
        intensity={1.4}
        color="#fff5e0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      {/* Warm fill light */}
      <pointLight position={[0, 8, 0]} color="#ffeecc" intensity={5} distance={25} decay={2} />
      {/* Colored atmospheric point lights near doors */}
      <pointLight position={[0, 2, -9]} color="#ffcc66" intensity={3} distance={8} decay={2} />
      <pointLight position={[0, 2, 9]} color="#66ccff" intensity={2.5} distance={7} decay={2} />
      {/* Corner accent lights */}
      <pointLight position={[-8, 3, -8]} color="#88ff88" intensity={1.5} distance={6} decay={2} />
      <pointLight position={[8, 3, -8]} color="#ff8888" intensity={1.5} distance={6} decay={2} />
    </>
  );
}

// Room transition overlay visual effect
function TransitionOverlay() {
  const transitioning = useZeldaStore((s) => s.transitioning);
  const meshRef = useRef();

  useFrame(() => {
    try {
      if (meshRef.current) {
        meshRef.current.material.opacity = transitioning ? 0.8 : 0;
      }
    } catch {
      // Silent
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshBasicMaterial color="#000000" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

export default function World({ particleRef }) {
  return (
    <>
      <color attach="background" args={['#172d16']} />
      <fog attach="fog" args={['#172d16', 20, 40]} />
      <ZeldaLighting />
      <GrassFloor />
      <RoomWalls />
      <RoomTrees />
      <DoorIndicators />
	      <PuzzleManager />
	      <DecorationManager />
	      <EnemiesManager particleRef={particleRef} />
	      <LockOnReticle />
	      <ItemsManager />
      <ProjectileManager />
      <TransitionOverlay />
    </>
  );
}
