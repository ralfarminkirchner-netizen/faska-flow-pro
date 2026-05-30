import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier';
import * as THREE from 'three';
import useMicroStore from './GameLogic';

/**
 * World — Giant tabletop scene.
 * The track is on a huge table with everyday objects as obstacles:
 *   - Pencils = long colored cylinders
 *   - Erasers = boxes
 *   - Coins = flat shiny cylinders
 *   - Bottle caps = short cylinders
 * Track borders formed by tape strips. Checkpoints visible.
 */

// Pencil obstacle
function Pencil({ x, z, rotation, color }) {
  return (
    <group position={[x, 0.15, z]} rotation={[0, rotation, 0]}>
      {/* Body */}
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 3.5, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {/* Tip */}
      <mesh position={[1.9, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <coneGeometry args={[0.15, 0.5, 8]} />
        <meshStandardMaterial color="#f5deb3" roughness={0.6} />
      </mesh>
      {/* Eraser end */}
      <mesh position={[-1.9, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.3, 8]} />
        <meshStandardMaterial color="#ec4899" roughness={0.5} />
      </mesh>
    </group>
  );
}

// Eraser obstacle
function Eraser({ x, z, rotation, color }) {
  return (
    <mesh position={[x, 0.3, z]} rotation={[0, rotation, 0]} castShadow>
      <boxGeometry args={[1.2, 0.6, 0.8]} />
      <meshStandardMaterial
        color={color}
        roughness={0.6}
        metalness={0.05}
      />
    </mesh>
  );
}

// Coin obstacle
function Coin({ x, z }) {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={ref} position={[x, 0.08, z]} castShadow>
      <cylinderGeometry args={[0.5, 0.5, 0.08, 16]} />
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#f59e0b"
        emissiveIntensity={0.6}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
}

// Bottle cap obstacle
function BottleCap({ x, z, rotation, color }) {
  return (
    <group position={[x, 0.12, z]} rotation={[0, rotation, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Ridged edge */}
      <mesh>
        <torusGeometry args={[0.5, 0.05, 8, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
    </group>
  );
}

// Track border strip (tape)
function TrackBorder() {
  const points = useMemo(() => {
    const outer = [];
    const inner = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      outer.push({ x: Math.sin(t) * 16, z: -Math.cos(t) * 16 });
      inner.push({ x: Math.sin(t) * 8, z: -Math.cos(t) * 8 });
    }
    return { outer, inner };
  }, []);

  return (
    <group>
      {/* Outer track tape */}
      {points.outer.map((p, i) => {
        const next = points.outer[(i + 1) % points.outer.length];
        const dx = next.x - p.x;
        const dz = next.z - p.z;
        const len = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dx, -dz);
        const cx = (p.x + next.x) / 2;
        const cz = (p.z + next.z) / 2;
        return (
          <mesh key={`out-${i}`} position={[cx, 0.02, cz]} rotation={[-Math.PI / 2, 0, angle]}>
            <planeGeometry args={[0.3, len]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#ef4444' : '#f8fafc'}
              emissive={i % 2 === 0 ? '#ef4444' : '#ffffff'}
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
      {/* Inner track tape */}
      {points.inner.map((p, i) => {
        const next = points.inner[(i + 1) % points.inner.length];
        const dx = next.x - p.x;
        const dz = next.z - p.z;
        const len = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dx, -dz);
        const cx = (p.x + next.x) / 2;
        const cz = (p.z + next.z) / 2;
        return (
          <mesh key={`in-${i}`} position={[cx, 0.02, cz]} rotation={[-Math.PI / 2, 0, angle]}>
            <planeGeometry args={[0.3, len]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#3b82f6' : '#f8fafc'}
              emissive={i % 2 === 0 ? '#3b82f6' : '#ffffff'}
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Checkpoint marker (dots on the table)
function CheckpointDot({ position, isNext }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current && isNext) {
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.2);
    }
  });

  return (
    <mesh ref={ref} position={[position.x, 0.03, position.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[isNext ? 1.5 : 0.8, 16]} />
      <meshStandardMaterial
        color={isNext ? '#10b981' : '#475569'}
        emissive={isNext ? '#10b981' : '#334155'}
        emissiveIntensity={isNext ? 1.2 : 0.1}
        transparent
        opacity={isNext ? 0.6 : 0.2}
      />
    </mesh>
  );
}

// Start/Finish line
function FinishLine() {
  return (
    <group position={[0, 0.02, -12]}>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[(i - 2.5) * 0.8, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 1.5]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#ffffff' : '#0f172a'}
            emissive={i % 2 === 0 ? '#ffffff' : '#000000'}
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

// Table edge (raised wooden sides)
function TableEdge() {
  const edgeColor = '#92400e';
  const edgeSize = 24;
  
  return (
    <group>
      {/* Four edges */}
      <mesh position={[0, 0.3, -edgeSize]} castShadow>
        <boxGeometry args={[edgeSize * 2 + 1, 0.8, 0.5]} />
        <meshStandardMaterial color={edgeColor} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.3, edgeSize]} castShadow>
        <boxGeometry args={[edgeSize * 2 + 1, 0.8, 0.5]} />
        <meshStandardMaterial color={edgeColor} roughness={0.7} />
      </mesh>
      <mesh position={[-edgeSize, 0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, edgeSize * 2 + 1]} />
        <meshStandardMaterial color={edgeColor} roughness={0.7} />
      </mesh>
      <mesh position={[edgeSize, 0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, edgeSize * 2 + 1]} />
        <meshStandardMaterial color={edgeColor} roughness={0.7} />
      </mesh>
    </group>
  );
}

// Books stacked (decoration at table corners)
function BookStack({ position }) {
  const colors = ['#1e40af', '#dc2626', '#15803d', '#7c2d12'];
  return (
    <group position={position}>
      {colors.map((c, i) => (
        <mesh key={i} position={[0, i * 0.4 + 0.2, 0]} castShadow>
          <boxGeometry args={[3 + Math.random(), 0.4, 2 + Math.random()]} />
          <meshStandardMaterial color={c} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// Coffee mug (decoration)
function CoffeeMug({ position }) {
  return (
    <group position={position}>
      {/* Mug body */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[1, 0.9, 2, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Handle */}
      <mesh position={[1.1, 1, 0]}>
        <torusGeometry args={[0.4, 0.1, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Coffee inside */}
      <mesh position={[0, 1.9, 0]}>
        <circleGeometry args={[0.85, 16]} />
        <meshStandardMaterial color="#3f2305" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Ruler (decoration — long flat bar on the side)
function Ruler({ position, rotation }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <boxGeometry args={[8, 0.1, 1]} />
      <meshStandardMaterial
        color="#fbbf24"
        roughness={0.4}
        metalness={0.2}
      />
    </mesh>
  );
}

export default function World() {
  const obstacles = useMicroStore(s => s.obstacles);
  const checkpoints = useMicroStore(s => s.checkpoints);
  const nextCheckpoint = useMicroStore(s => s.nextCheckpoint);

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[15, 30, 10]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      {/* Warm indoor lighting feel */}
      <pointLight position={[0, 20, 0]} intensity={0.8} color="#fef3c7" />
      <hemisphereLight args={['#fef3c7', '#44403c', 0.3]} />

      {/* Background (room walls — very far) */}
      <fog attach="fog" args={['#fef3c7', 40, 80]} />

      {/* Table surface */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[25, 0.1, 25]} position={[0, -0.1, 0]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial
            color="#d4a574"
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
      </RigidBody>

      {/* Wood grain lines (subtle) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, 0.005, (i - 3.5) * 6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 0.15]} />
          <meshStandardMaterial
            color="#c4956a"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}

      {/* Track borders (tape) */}
      <TrackBorder />

      {/* Track surface (slightly different color ring to show the track) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[7.5, 16.5, 64]} />
        <meshStandardMaterial
          color="#c9a06c"
          roughness={0.8}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Table edges */}
      <TableEdge />

      {/* Finish line */}
      <FinishLine />

      {/* Checkpoints */}
      {checkpoints.map((cp, i) => (
        <CheckpointDot
          key={i}
          position={cp}
          isNext={i === nextCheckpoint}
        />
      ))}

      {/* Obstacles */}
      {obstacles.map((obs, i) => {
        switch (obs.type) {
          case 'pencil':
            return <Pencil key={i} {...obs} />;
          case 'eraser':
            return <Eraser key={i} {...obs} />;
          case 'coin':
            return <Coin key={i} {...obs} />;
          case 'bottlecap':
            return <BottleCap key={i} {...obs} />;
          default:
            return null;
        }
      })}

      {/* Decorations */}
      <BookStack position={[-20, 0, -20]} />
      <BookStack position={[18, 0, 18]} />
      <CoffeeMug position={[18, 0, -16]} />
      <Ruler position={[-18, 0.05, 12]} rotation={[0, 0.3, 0]} />

      {/* Paper sheet on table (decorative) */}
      <mesh position={[-6, 0.01, 16]} rotation={[-Math.PI / 2, 0, 0.15]}>
        <planeGeometry args={[6, 8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>
      {/* Pen lines on paper */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`line-${i}`} position={[-6.5 + Math.random() * 1, 0.015, 13 + i * 0.8]}
          rotation={[-Math.PI / 2, 0, 0.15]}>
          <planeGeometry args={[4 + Math.random() * 1.5, 0.05]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Tape roll (decoration) */}
      <group position={[14, 0.4, 6]}>
        <mesh castShadow>
          <torusGeometry args={[1, 0.3, 8, 24]} />
          <meshStandardMaterial
            color="#fbbf24"
            transparent
            opacity={0.7}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Paper clips scattered */}
      {[
        [-3, 0.05, -18],
        [8, 0.05, -5],
        [-10, 0.05, 8],
      ].map((pos, i) => (
        <mesh key={`clip-${i}`} position={pos} rotation={[Math.PI / 2, 0, Math.random() * Math.PI]}>
          <torusGeometry args={[0.3, 0.03, 4, 12, Math.PI * 1.5]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
