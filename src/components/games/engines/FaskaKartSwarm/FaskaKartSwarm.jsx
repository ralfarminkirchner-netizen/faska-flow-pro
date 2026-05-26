import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ─── Constants ────────────────────────────────────────────────────────────────

const TRACK_RADIUS = 80;
const TRACK_WIDTH = 18;
const TRACK_SEGMENTS = 80;
const KART_COLORS = ['#e11d48', '#2563eb', '#16a34a', '#d97706'];
const KART_NAMES = ['Rosi', 'Bruno', 'Kira', 'PLAYER'];
const LAP_COUNT = 3;

const COUNTRIES = [
  { name: 'Deutschland', flag: '🇩🇪', alt: ['germany', 'deutschland', 'de'] },
  { name: 'Frankreich', flag: '🇫🇷', alt: ['france', 'frankreich', 'fr'] },
  { name: 'Japan', flag: '🇯🇵', alt: ['japan', 'jp'] },
  { name: 'Brasilien', flag: '🇧🇷', alt: ['brazil', 'brasilien', 'br'] },
  { name: 'Australien', flag: '🇦🇺', alt: ['australia', 'australien', 'au'] },
  { name: 'Mexiko', flag: '🇲🇽', alt: ['mexico', 'mexiko', 'mx'] },
  { name: 'Indien', flag: '🇮🇳', alt: ['india', 'indien', 'in'] },
  { name: 'Kanada', flag: '🇨🇦', alt: ['canada', 'kanada', 'ca'] },
  { name: 'Italien', flag: '🇮🇹', alt: ['italy', 'italien', 'it'] },
  { name: 'China', flag: '🇨🇳', alt: ['china', 'cn'] },
  { name: 'Ägypten', flag: '🇪🇬', alt: ['egypt', 'ägypten', 'aegypten', 'eg'] },
  { name: 'Argentinien', flag: '🇦🇷', alt: ['argentina', 'argentinien', 'ar'] },
];

const ITEMS = ['shell', 'boost', 'banana'];

// ─── Track Math ───────────────────────────────────────────────────────────────

// Track is a flat oval: big circle of radius TRACK_RADIUS, extruded as a ribbon
const getTrackPoint = (t) => {
  const angle = t * Math.PI * 2;
  return new THREE.Vector3(
    Math.cos(angle) * TRACK_RADIUS,
    0,
    Math.sin(angle) * TRACK_RADIUS
  );
};

const getTrackTangent = (t) => {
  const angle = t * Math.PI * 2;
  return new THREE.Vector3(
    -Math.sin(angle),
    0,
    Math.cos(angle)
  ).normalize();
};

// Project a world position onto track parameter t in [0,1)
const getTrackT = (pos) => {
  const angle = Math.atan2(pos.z, pos.x);
  let t = angle / (Math.PI * 2);
  if (t < 0) t += 1;
  return t;
};

// ─── Utility ──────────────────────────────────────────────────────────────────

const clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);
const lerp = (a, b, t) => a + (b - a) * t;

const useKeys = () => {
  const keys = useRef({});
  useEffect(() => {
    const down = (e) => { keys.current[e.code] = true; };
    const up = (e) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);
  return keys;
};

// ─── Track Generation ─────────────────────────────────────────────────────────

const buildTrackGeometry = () => {
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= TRACK_SEGMENTS; i++) {
    const t = i / TRACK_SEGMENTS;
    const center = getTrackPoint(t);
    const tangent = getTrackTangent(t);
    const right = new THREE.Vector3(-tangent.z, 0, tangent.x);

    const left = center.clone().addScaledVector(right, -TRACK_WIDTH / 2);
    const rightPt = center.clone().addScaledVector(right, TRACK_WIDTH / 2);

    positions.push(left.x, 0.01, left.z);
    positions.push(rightPt.x, 0.01, rightPt.z);
    normals.push(0, 1, 0, 0, 1, 0);
    uvs.push(0, t * 10, 1, t * 10);

    if (i < TRACK_SEGMENTS) {
      const base = i * 2;
      indices.push(base, base + 1, base + 2);
      indices.push(base + 1, base + 3, base + 2);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
};

// ─── Item Box Positions ───────────────────────────────────────────────────────

const ITEM_BOX_POSITIONS = [0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map(t => {
  const p = getTrackPoint(t);
  return { t, pos: [p.x, 0.8, p.z] };
});

// ─── Track Component ──────────────────────────────────────────────────────────

const Track = () => {
  const geo = useMemo(() => buildTrackGeometry(), []);

  // Build road markings at start/finish
  return (
    <group>
      <primitive object={new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color: '#444444', roughness: 0.9, side: THREE.DoubleSide })
      )} />
      {/* Center line dashes */}
      {Array.from({ length: TRACK_SEGMENTS }).map((_, i) => {
        if (i % 4 !== 0) return null;
        const t = i / TRACK_SEGMENTS;
        const p = getTrackPoint(t);
        return (
          <mesh key={i} position={[p.x, 0.02, p.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.5, 3]} />
            <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
          </mesh>
        );
      })}
      {/* Track borders */}
      {Array.from({ length: TRACK_SEGMENTS }).map((_, i) => {
        const t = i / TRACK_SEGMENTS;
        const center = getTrackPoint(t);
        const tangent = getTrackTangent(t);
        const right = new THREE.Vector3(-tangent.z, 0, tangent.x);
        const lp = center.clone().addScaledVector(right, -TRACK_WIDTH / 2);
        const rp = center.clone().addScaledVector(right, TRACK_WIDTH / 2);
        return (
          <group key={i}>
            <mesh position={[lp.x, 0.3, lp.z]}>
              <boxGeometry args={[0.5, 0.6, 0.5]} />
              <meshStandardMaterial color={i % 6 < 3 ? '#ef4444' : '#ffffff'} />
            </mesh>
            <mesh position={[rp.x, 0.3, rp.z]}>
              <boxGeometry args={[0.5, 0.6, 0.5]} />
              <meshStandardMaterial color={i % 6 < 3 ? '#ef4444' : '#ffffff'} />
            </mesh>
          </group>
        );
      })}
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#3d7a20" roughness={1} />
      </mesh>
      {/* Decorative trees around the outside */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const r = TRACK_RADIUS + TRACK_WIDTH / 2 + 15;
        return (
          <group key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
            <mesh position={[0, 2, 0]}>
              <cylinderGeometry args={[0.4, 0.6, 4, 6]} />
              <meshStandardMaterial color="#6b3a1f" />
            </mesh>
            <mesh position={[0, 6, 0]}>
              <coneGeometry args={[3, 6, 6]} />
              <meshStandardMaterial color="#22863a" />
            </mesh>
          </group>
        );
      })}
      {/* Start/Finish banner */}
      <group position={[TRACK_RADIUS, 0, 0]}>
        <mesh position={[-TRACK_WIDTH / 2 - 1, 4, 0]}>
          <boxGeometry args={[0.4, 8, 0.4]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[TRACK_WIDTH / 2 + 1, 4, 0]}>
          <boxGeometry args={[0.4, 8, 0.4]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[0, 8.2, 0]}>
          <boxGeometry args={[TRACK_WIDTH + 2, 0.5, 0.4]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      </group>
    </group>
  );
};

// ─── Item Box Component ───────────────────────────────────────────────────────

const ItemBox = ({ pos, active, index }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 2;
      ref.current.position.y = 0.8 + Math.sin(clock.elapsedTime * 3 + index) * 0.2;
    }
  });

  if (!active) return null;

  return (
    <group ref={ref} position={pos}>
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#f59e0b"
          emissiveIntensity={0.4}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshStandardMaterial color="#ffffff" wireframe opacity={0.3} transparent />
      </mesh>
    </group>
  );
};

// ─── Projectile (Shell) ───────────────────────────────────────────────────────

const Projectile = ({ proj, onHit }) => {
  const ref = useRef();
  const vel = useRef(new THREE.Vector3(proj.vx, 0, proj.vz));
  const pos = useRef(new THREE.Vector3(proj.x, 0.5, proj.z));

  useFrame((_, delta) => {
    if (!ref.current) return;
    const dt = clamp(delta, 0.001, 0.05);
    pos.current.addScaledVector(vel.current, dt * 30);
    ref.current.position.copy(pos.current);
    ref.current.rotation.y += 0.3;

    // Check if off track (far from center)
    const distFromCenter = Math.sqrt(pos.current.x ** 2 + pos.current.z ** 2);
    if (distFromCenter > TRACK_RADIUS + TRACK_WIDTH + 5 || distFromCenter < TRACK_RADIUS - TRACK_WIDTH - 5) {
      onHit(proj.id);
    }
  });

  return (
    <mesh ref={ref} position={[proj.x, 0.5, proj.z]} castShadow>
      <sphereGeometry args={[0.4, 8, 8]} />
      <meshStandardMaterial color="#16a34a" emissive="#16a34a" emissiveIntensity={0.6} />
    </mesh>
  );
};

// ─── Banana Peel ──────────────────────────────────────────────────────────────

const BananaPeel = ({ banana }) => {
  return (
    <group position={[banana.x, 0.2, banana.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.15, 6, 12]} />
        <meshStandardMaterial color="#fde047" />
      </mesh>
    </group>
  );
};

// ─── Kart Mesh ────────────────────────────────────────────────────────────────

const KartMesh = ({ color, name, isPlayer, isDrifting, isHit }) => {
  const flashRef = useRef();
  useFrame(({ clock }) => {
    if (flashRef.current) {
      if (isHit) {
        flashRef.current.visible = Math.sin(clock.elapsedTime * 30) > 0;
      } else {
        flashRef.current.visible = true;
      }
    }
  });

  return (
    <group ref={flashRef}>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.8, 0.7, 3.2]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Cockpit */}
      <mesh position={[0, 0.9, -0.3]} castShadow>
        <boxGeometry args={[1.4, 0.5, 1.6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Wheels */}
      {[[-1, 0, 1.2], [1, 0, 1.2], [-1, 0, -1.2], [1, 0, -1.2]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 10]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
      {/* Drift particles indicator */}
      {isDrifting && (
        <pointLight position={[0, 0.5, -1.5]} color="#ff6600" intensity={2} distance={4} />
      )}
      {/* Name tag */}
      {isPlayer && (
        <Html position={[0, 2.2, 0]} center>
          <div style={{
            background: 'rgba(0,0,0,0.7)', color: '#facc15',
            padding: '2px 8px', borderRadius: '6px',
            fontSize: '13px', fontWeight: 'bold',
            whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none'
          }}>YOU</div>
        </Html>
      )}
    </group>
  );
};

// ─── Player Kart ──────────────────────────────────────────────────────────────

const PlayerKart = ({
  gameStateRef, updateGame, itemBoxes, setItemBoxes,
  setBananas, bananas, projectiles, setProjectiles,
  onLapComplete
}) => {
  const { camera } = useThree();
  const keys = useKeys();
  const groupRef = useRef();
  const cameraShake = useRef(0);

  const state = useRef({
    t: 0,             // track progress [0,1)
    laps: 0,
    speed: 0,
    rotation: Math.PI / 2, // yaw
    x: TRACK_RADIUS,
    z: 0,
    driftTimer: 0,
    driftBoostCharge: 0,  // 0..1
    driftDir: 0,
    isDrifting: false,
    isHit: false,
    hitTimer: 0,
    spinTimer: 0,
    position: 1,   // race position
    itemUseCooldown: 0,
  });

  const nextT = useRef(0); // for lap detection

  useFrame((_, delta) => {
    if (gameStateRef.current.phase !== 'racing') return;
    const dt = clamp(delta, 0.001, 0.08);
    const s = state.current;
    const k = keys.current;

    // Hit / spin stun
    if (s.hitTimer > 0) {
      s.hitTimer -= dt;
      s.isHit = true;
      s.spinTimer -= dt;
      if (s.spinTimer > 0) {
        s.rotation += 8 * dt;
      }
      if (s.hitTimer <= 0) s.isHit = false;
    }

    const isStunned = s.hitTimer > 0;
    const maxSpeed = isStunned ? 5 : (s.isDrifting ? 22 : 28);
    const accel = isStunned ? 0 : 40;
    const friction = 18;
    const boostSpeed = isStunned ? 0 : (gameStateRef.current.boostTimer > 0 ? 15 : 0);

    // Throttle
    if (!isStunned) {
      if (k['KeyW'] || k['ArrowUp']) {
        s.speed = Math.min(s.speed + accel * dt, maxSpeed + boostSpeed);
      } else if (k['KeyS'] || k['ArrowDown']) {
        s.speed = Math.max(s.speed - accel * dt, -12);
      } else {
        s.speed = s.speed > 0
          ? Math.max(0, s.speed - friction * dt)
          : Math.min(0, s.speed + friction * dt);
      }
    } else {
      s.speed *= 0.92;
    }

    // Steering
    const turning = (k['KeyA'] || k['ArrowLeft']) ? 1 : (k['KeyD'] || k['ArrowRight']) ? -1 : 0;
    const steerFactor = clamp(Math.abs(s.speed) / maxSpeed, 0, 1);
    const steerSpeed = 2.8;

    if (!isStunned) s.rotation += turning * steerSpeed * steerFactor * dt;

    // Drift
    const driftKey = k['ShiftLeft'] || k['ShiftRight'] || k['Space'];
    if (driftKey && turning !== 0 && Math.abs(s.speed) > 10 && !isStunned) {
      s.isDrifting = true;
      s.driftDir = turning;
      s.driftTimer += dt;
      s.driftBoostCharge = Math.min(s.driftBoostCharge + dt * 0.4, 1);
      // Extra angular rotation during drift
      s.rotation += s.driftDir * 1.2 * steerFactor * dt;
    } else if (s.isDrifting && !driftKey) {
      // Release drift - apply boost
      if (s.driftBoostCharge > 0.3) {
        updateGame({ boostTimer: s.driftBoostCharge * 2.5 });
        cameraShake.current = 0.4;
      }
      s.isDrifting = false;
      s.driftTimer = 0;
      s.driftBoostCharge = 0;
      s.driftDir = 0;
    } else if (!driftKey) {
      s.isDrifting = false;
    }

    // Boost timer
    if (gameStateRef.current.boostTimer > 0) {
      updateGame({ boostTimer: Math.max(0, gameStateRef.current.boostTimer - dt) });
      s.speed = Math.min(s.speed + 80 * dt, 45);
    }

    // Item use cooldown
    if (s.itemUseCooldown > 0) s.itemUseCooldown -= dt;

    // Use item
    if ((k['KeyE'] || k['KeyF']) && s.itemUseCooldown <= 0) {
      const gs = gameStateRef.current;
      if (gs.heldItem && !gs.pendingCountry) {
        useItem(gs.heldItem, s);
        s.itemUseCooldown = 0.5;
      }
    }

    // Movement
    const dir = new THREE.Vector3(Math.sin(s.rotation), 0, Math.cos(s.rotation));
    s.x += dir.x * s.speed * dt;
    s.z += dir.z * s.speed * dt;

    // Keep on track (soft constraint)
    const distFromCenter = Math.sqrt(s.x * s.x + s.z * s.z);
    const angle = Math.atan2(s.z, s.x);
    const trackDist = distFromCenter - TRACK_RADIUS;
    if (Math.abs(trackDist) > TRACK_WIDTH / 2) {
      const push = (Math.abs(trackDist) - TRACK_WIDTH / 2) * 3;
      s.x -= Math.cos(angle) * Math.sign(trackDist) * push * dt;
      s.z -= Math.sin(angle) * Math.sign(trackDist) * push * dt;
      s.speed *= 0.85;
    }

    // Track progress
    const curT = getTrackT(new THREE.Vector3(s.x, 0, s.z));
    // Lap detection: crossing t=0
    const prevT = nextT.current;
    if (prevT > 0.85 && curT < 0.15) {
      s.laps += 1;
      onLapComplete(s.laps);
    }
    nextT.current = curT;
    s.t = curT;

    // Item boxes collision
    itemBoxes.forEach((box, idx) => {
      if (!box.active) return;
      const dx = s.x - box.pos[0];
      const dz = s.z - box.pos[2];
      if (Math.sqrt(dx * dx + dz * dz) < 2.5) {
        const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
        const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        updateGame({
          heldItem: item,
          pendingCountry: country,
          showCountryModal: true,
          countryAnswer: ''
        });
        setItemBoxes(prev => {
          const next = [...prev];
          next[idx] = { ...next[idx], active: false };
          // Respawn after 5s
          setTimeout(() => setItemBoxes(p => {
            const n2 = [...p];
            n2[idx] = { ...n2[idx], active: true };
            return n2;
          }), 5000);
          return next;
        });
      }
    });

    // Banana collision
    setBananas(prev => prev.filter(b => {
      const dx = s.x - b.x;
      const dz = s.z - b.z;
      if (Math.sqrt(dx * dx + dz * dz) < 1.5 && s.hitTimer <= 0) {
        s.hitTimer = 2;
        s.spinTimer = 1.5;
        s.speed *= 0.3;
        cameraShake.current = 0.5;
        return false;
      }
      return true;
    }));

    // Shell collision (incoming from AI)
    setProjectiles(prev => prev.filter(p => {
      const dx = s.x - p.x;
      const dz = s.z - p.z;
      if (Math.sqrt(dx * dx + dz * dz) < 2 && p.owner !== 'player' && s.hitTimer <= 0) {
        s.hitTimer = 2.5;
        s.spinTimer = 2;
        s.speed *= 0.2;
        cameraShake.current = 0.6;
        return false;
      }
      return true;
    }));

    // Mesh update
    if (groupRef.current) {
      groupRef.current.position.set(s.x, 0, s.z);
      groupRef.current.rotation.y = s.rotation;
    }

    // Camera follow
    const shake = cameraShake.current > 0
      ? (Math.random() - 0.5) * cameraShake.current * 0.8
      : 0;
    cameraShake.current = Math.max(0, cameraShake.current - dt * 2);

    const camOffset = new THREE.Vector3(0, 5, -14);
    camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), s.rotation);
    const idealCamPos = new THREE.Vector3(s.x + camOffset.x + shake, camOffset.y, s.z + camOffset.z + shake);
    camera.position.lerp(idealCamPos, 0.12);
    camera.lookAt(s.x, 1.5, s.z);
  });

  const useItem = (item, s) => {
    if (item === 'boost') {
      updateGame({ heldItem: null, boostTimer: 3 });
      cameraShake.current = 0.3;
    } else if (item === 'shell') {
      const dir = new THREE.Vector3(Math.sin(s.rotation), 0, Math.cos(s.rotation));
      setProjectiles(prev => [...prev, {
        id: Date.now(),
        x: s.x + dir.x * 3,
        z: s.z + dir.z * 3,
        vx: dir.x,
        vz: dir.z,
        owner: 'player'
      }]);
      updateGame({ heldItem: null });
    } else if (item === 'banana') {
      const dir = new THREE.Vector3(Math.sin(s.rotation), 0, Math.cos(s.rotation));
      setBananas(prev => [...prev, {
        id: Date.now(),
        x: s.x - dir.x * 3,
        z: s.z - dir.z * 3
      }]);
      updateGame({ heldItem: null });
    }
  };

  const s = state.current;
  return (
    <group ref={groupRef} position={[TRACK_RADIUS, 0, 0]}>
      <KartMesh
        color={KART_COLORS[3]}
        name="YOU"
        isPlayer
        isDrifting={state.current.isDrifting}
        isHit={state.current.isHit}
      />
    </group>
  );
};

// ─── AI Kart ──────────────────────────────────────────────────────────────────

const AIKart = ({ index, color, name, setBananas, setProjectiles, gameStateRef }) => {
  const groupRef = useRef();

  const state = useRef({
    t: (index + 1) * 0.07,
    x: Math.cos((index + 1) * 0.07 * Math.PI * 2) * TRACK_RADIUS,
    z: Math.sin((index + 1) * 0.07 * Math.PI * 2) * TRACK_RADIUS,
    rotation: (index + 1) * 0.07 * Math.PI * 2 + Math.PI / 2,
    speed: 18 + index * 1.5,
    targetT: (index + 1) * 0.07 + 0.02,
    fireTimer: 4 + index * 2.5,
    dropTimer: 6 + index * 3,
  });

  useFrame((_, delta) => {
    if (gameStateRef.current.phase !== 'racing') return;
    const dt = clamp(delta, 0.001, 0.08);
    const s = state.current;

    // AI follows track centerline
    s.targetT = (s.t + 0.02) % 1;
    const target = getTrackPoint(s.targetT);
    const dx = target.x - s.x;
    const dz = target.z - s.z;
    const targetAngle = Math.atan2(dx, dz);

    // Smooth rotation toward target
    let diff = targetAngle - s.rotation;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    s.rotation += diff * 5 * dt;

    const baseSpeed = 18 + index * 1.5;
    s.speed = lerp(s.speed, baseSpeed, 0.02);

    const dir = new THREE.Vector3(Math.sin(s.rotation), 0, Math.cos(s.rotation));
    s.x += dir.x * s.speed * dt;
    s.z += dir.z * s.speed * dt;
    s.t = getTrackT(new THREE.Vector3(s.x, 0, s.z));

    // Snap to track
    const distC = Math.sqrt(s.x * s.x + s.z * s.z);
    if (Math.abs(distC - TRACK_RADIUS) > 4) {
      const ang = Math.atan2(s.z, s.x);
      s.x = Math.cos(ang) * TRACK_RADIUS;
      s.z = Math.sin(ang) * TRACK_RADIUS;
    }

    if (groupRef.current) {
      groupRef.current.position.set(s.x, 0, s.z);
      groupRef.current.rotation.y = s.rotation;
    }

    // AI fire shell occasionally
    s.fireTimer -= dt;
    if (s.fireTimer <= 0) {
      s.fireTimer = 8 + Math.random() * 8;
      setProjectiles(prev => [...prev, {
        id: Date.now() + index * 100,
        x: s.x + dir.x * 3,
        z: s.z + dir.z * 3,
        vx: dir.x,
        vz: dir.z,
        owner: `ai_${index}`
      }]);
    }

    // AI drop banana occasionally
    s.dropTimer -= dt;
    if (s.dropTimer <= 0) {
      s.dropTimer = 10 + Math.random() * 10;
      setBananas(prev => [...prev, {
        id: Date.now() + index * 200,
        x: s.x - dir.x * 3,
        z: s.z - dir.z * 3
      }]);
    }
  });

  return (
    <group ref={groupRef}>
      <KartMesh color={color} name={name} isPlayer={false} isDrifting={false} isHit={false} />
      <Html position={[0, 2.2, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.6)', color: 'white',
          padding: '2px 6px', borderRadius: '5px',
          fontSize: '12px', whiteSpace: 'nowrap',
          userSelect: 'none', pointerEvents: 'none'
        }}>{name}</div>
      </Html>
    </group>
  );
};

// ─── Particle Explosion ───────────────────────────────────────────────────────

const Particles = ({ particles }) => {
  return (
    <>
      {particles.map(p => (
        <mesh key={p.id} position={p.pos} scale={p.scale}>
          <sphereGeometry args={[0.3, 4, 4]} />
          <meshBasicMaterial color={p.color} />
        </mesh>
      ))}
    </>
  );
};

// ─── Scene ────────────────────────────────────────────────────────────────────

const Scene = ({ gameStateRef, updateGame, onLapComplete }) => {
  const [itemBoxes, setItemBoxes] = useState(
    ITEM_BOX_POSITIONS.map(ib => ({ ...ib, active: true }))
  );
  const [bananas, setBananas] = useState([]);
  const [projectiles, setProjectiles] = useState([]);
  const [particles, setParticles] = useState([]);

  const removeProjectile = useCallback((id) => {
    // Spawn particles at last known position
    setProjectiles(prev => {
      const proj = prev.find(p => p.id === id);
      if (proj) {
        const burst = Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          pos: [proj.x, 0.5 + Math.random(), proj.z],
          scale: Math.random() * 0.5 + 0.3,
          color: ['#ff6600', '#facc15', '#ef4444'][Math.floor(Math.random() * 3)]
        }));
        setParticles(old => [...old, ...burst]);
        setTimeout(() => setParticles(old => old.filter(p => !burst.find(b => b.id === p.id))), 600);
      }
      return prev.filter(p => p.id !== id);
    });
  }, []);

  return (
    <>
      <Track />
      {itemBoxes.map((box, i) => (
        <ItemBox key={i} index={i} pos={box.pos} active={box.active} />
      ))}
      {bananas.map(b => <BananaPeel key={b.id} banana={b} />)}
      {projectiles.map(p => (
        <Projectile key={p.id} proj={p} onHit={removeProjectile} />
      ))}
      <Particles particles={particles} />
      {[0, 1, 2].map(i => (
        <AIKart
          key={i}
          index={i}
          color={KART_COLORS[i]}
          name={KART_NAMES[i]}
          setBananas={setBananas}
          setProjectiles={setProjectiles}
          gameStateRef={gameStateRef}
        />
      ))}
      <PlayerKart
        gameStateRef={gameStateRef}
        updateGame={updateGame}
        itemBoxes={itemBoxes}
        setItemBoxes={setItemBoxes}
        bananas={bananas}
        setBananas={setBananas}
        projectiles={projectiles}
        setProjectiles={setProjectiles}
        onLapComplete={onLapComplete}
      />
    </>
  );
};

// ─── Country Modal ────────────────────────────────────────────────────────────

const CountryModal = ({ pendingCountry, heldItem, countryAnswer, setCountryAnswer, onCorrect, onWrong }) => {
  const itemEmoji = { shell: '🐚', boost: '⚡', banana: '🍌' }[heldItem] || '❓';

  const handleSubmit = () => {
    const ans = countryAnswer.trim().toLowerCase();
    const correct = [pendingCountry.name.toLowerCase(), ...pendingCountry.alt].some(a => ans === a);
    if (correct) {
      onCorrect();
    } else {
      onWrong();
    }
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.65)', zIndex: 50,
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
        border: '4px solid #facc15',
        borderRadius: '20px',
        padding: '36px 44px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        maxWidth: '420px',
        width: '90%'
      }}>
        <div style={{ fontSize: '80px', lineHeight: 1 }}>{pendingCountry.flag}</div>
        <h2 style={{ color: '#facc15', fontSize: '22px', margin: '16px 0 8px' }}>
          {itemEmoji} Item erhalten!
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '16px', margin: '0 0 20px' }}>
          Welches Land zeigt diese Flagge?<br />
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>
            (Tippe den Namen, um das Item freizuschalten)
          </span>
        </p>
        <input
          autoFocus
          type="text"
          value={countryAnswer}
          onChange={e => setCountryAnswer(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Land eingeben…"
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '18px',
            borderRadius: '10px',
            border: '2px solid #3b82f6',
            background: '#1e293b',
            color: 'white',
            outline: 'none',
            boxSizing: 'border-box',
            marginBottom: '16px'
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            width: '100%', padding: '12px',
            fontSize: '18px', fontWeight: 'bold',
            background: '#2563eb', color: 'white',
            border: 'none', borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          Bestätigen ✓
        </button>
      </div>
    </div>
  );
};

// ─── HUD ──────────────────────────────────────────────────────────────────────

const HUD = ({ gameState }) => {
  const itemEmoji = { shell: '🐚', boost: '⚡', banana: '🍌' }[gameState.heldItem] || null;

  return (
    <div style={{
      position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: '24px', alignItems: 'center',
      fontFamily: 'sans-serif', pointerEvents: 'none', zIndex: 10
    }}>
      {/* Laps */}
      <div style={{
        background: 'rgba(0,0,0,0.75)', color: 'white',
        padding: '10px 18px', borderRadius: '12px',
        fontSize: '22px', fontWeight: 'bold',
        border: '2px solid #facc15'
      }}>
        🏁 Runde {Math.min(gameState.laps + 1, LAP_COUNT)}/{LAP_COUNT}
      </div>
      {/* Item */}
      <div style={{
        background: 'rgba(0,0,0,0.75)',
        padding: '10px 18px', borderRadius: '12px',
        fontSize: '36px',
        border: '2px solid #6366f1',
        minWidth: '64px', textAlign: 'center'
      }}>
        {itemEmoji || <span style={{ fontSize: '22px', color: '#64748b' }}>—</span>}
      </div>
      {/* Boost indicator */}
      {gameState.boostTimer > 0 && (
        <div style={{
          background: 'rgba(251,191,36,0.9)', color: '#111',
          padding: '10px 18px', borderRadius: '12px',
          fontSize: '22px', fontWeight: 'bold',
        }}>
          ⚡ BOOST!
        </div>
      )}
    </div>
  );
};

// ─── Countdown ────────────────────────────────────────────────────────────────

const Countdown = ({ count }) => (
  <div style={{
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    pointerEvents: 'none', zIndex: 20
  }}>
    <div style={{
      fontSize: count === 'GO!' ? '100px' : '140px',
      fontWeight: 'bold',
      color: count === 'GO!' ? '#4ade80' : '#facc15',
      textShadow: '0 0 30px rgba(0,0,0,0.8), 4px 4px 0 #000',
      fontFamily: 'sans-serif',
      animation: 'pulse 0.3s ease-in-out'
    }}>
      {count}
    </div>
  </div>
);

// ─── Win Screen ───────────────────────────────────────────────────────────────

const WinScreen = ({ onExit, onRestart, finalTime }) => (
  <div style={{
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.8)', zIndex: 50,
    fontFamily: 'sans-serif'
  }}>
    <div style={{ fontSize: '80px' }}>🏆</div>
    <h1 style={{ color: '#facc15', fontSize: '52px', margin: '16px 0 8px', textShadow: '3px 3px 0 #000' }}>
      ZIEL ERREICHT!
    </h1>
    <p style={{ color: '#cbd5e1', fontSize: '24px', margin: '0 0 32px' }}>
      Zeit: {finalTime}s
    </p>
    <div style={{ display: 'flex', gap: '16px' }}>
      <button onClick={onRestart} style={{
        padding: '14px 32px', fontSize: '20px', fontWeight: 'bold',
        background: '#16a34a', color: 'white',
        border: '2px solid white', borderRadius: '10px', cursor: 'pointer'
      }}>
        Nochmal spielen
      </button>
      <button onClick={onExit} style={{
        padding: '14px 32px', fontSize: '20px', fontWeight: 'bold',
        background: '#ef4444', color: 'white',
        border: '2px solid white', borderRadius: '10px', cursor: 'pointer'
      }}>
        Beenden
      </button>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const FaskaKartSwarm = ({ onExit }) => {
  const [gameState, setGameState] = useState({
    phase: 'countdown',   // 'countdown' | 'racing' | 'won'
    laps: 0,
    heldItem: null,
    pendingCountry: null,
    showCountryModal: false,
    countryAnswer: '',
    boostTimer: 0,
    countdown: 3,
    raceTime: 0,
    wrongAnswer: false,
  });

  const gameStateRef = useRef(gameState);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const updateGame = useCallback((updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  const [countdownDisplay, setCountdownDisplay] = useState(3);
  const [finalTime, setFinalTime] = useState(0);

  // Countdown sequence
  useEffect(() => {
    let count = 3;
    setCountdownDisplay(3);

    const tick = () => {
      count -= 1;
      if (count === 0) {
        setCountdownDisplay('GO!');
        setTimeout(() => {
          updateGame({ phase: 'racing' });
        }, 600);
      } else {
        setCountdownDisplay(count);
        setTimeout(tick, 1000);
      }
    };

    const t = setTimeout(tick, 1000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Race timer
  useEffect(() => {
    if (gameState.phase !== 'racing') return;
    const id = setInterval(() => {
      setGameState(prev => ({ ...prev, raceTime: prev.raceTime + 1 }));
    }, 1000);
    return () => clearInterval(id);
  }, [gameState.phase]);

  const handleLapComplete = useCallback((laps) => {
    if (laps >= LAP_COUNT) {
      setFinalTime(gameStateRef.current.raceTime);
      updateGame({ phase: 'won', laps });
    } else {
      updateGame({ laps });
    }
  }, [updateGame]);

  const handleCountryCorrect = useCallback(() => {
    updateGame({
      showCountryModal: false,
      pendingCountry: null,
      countryAnswer: '',
      wrongAnswer: false
    });
  }, [updateGame]);

  const handleCountryWrong = useCallback(() => {
    updateGame({ wrongAnswer: true, countryAnswer: '' });
    setTimeout(() => updateGame({ wrongAnswer: false }), 600);
  }, [updateGame]);

  const handleRestart = useCallback(() => {
    window.location.reload();
  }, []);

  const mins = String(Math.floor(gameState.raceTime / 60)).padStart(2, '0');
  const secs = String(gameState.raceTime % 60).padStart(2, '0');

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', background: '#87ceeb' }}>
      {/* 3D Canvas */}
      <Canvas shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[TRACK_RADIUS, 8, -14]} fov={65} />
        <Sky sunPosition={[100, 30, 50]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[60, 120, 60]}
          castShadow
          intensity={1.2}
          shadow-mapSize={[2048, 2048]}
        >
          <orthographicCamera attach="shadow-camera" args={[-200, 200, 200, -200]} />
        </directionalLight>

        <Scene
          gameStateRef={gameStateRef}
          updateGame={updateGame}
          onLapComplete={handleLapComplete}
        />
      </Canvas>

      {/* Countdown */}
      {gameState.phase === 'countdown' && <Countdown count={countdownDisplay} />}

      {/* HUD */}
      {gameState.phase === 'racing' && (
        <>
          <HUD gameState={gameState} />
          {/* Timer top-center */}
          <div style={{
            position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)', color: 'white',
            padding: '8px 20px', borderRadius: '10px',
            fontFamily: 'sans-serif', fontSize: '24px', fontWeight: 'bold',
            border: '2px solid #94a3b8', pointerEvents: 'none', zIndex: 10
          }}>
            ⏱ {mins}:{secs}
          </div>
        </>
      )}

      {/* Top-left title */}
      <div style={{
        position: 'absolute', top: 20, left: 20,
        fontFamily: 'sans-serif', pointerEvents: 'none', zIndex: 10
      }}>
        <div style={{
          fontSize: '28px', fontWeight: 'bold', fontStyle: 'italic',
          color: '#facc15', textShadow: '2px 2px 0 #000'
        }}>
          🏎 FaskaKart Swarm
        </div>
        {gameState.phase === 'racing' && (
          <div style={{ color: 'white', fontSize: '16px', textShadow: '1px 1px 0 #000', marginTop: '4px' }}>
            Runde {Math.min(gameState.laps + 1, LAP_COUNT)}/{LAP_COUNT}
          </div>
        )}
      </div>

      {/* Controls hint */}
      {gameState.phase === 'racing' && (
        <div style={{
          position: 'absolute', bottom: 90, right: 20,
          color: 'white', fontFamily: 'sans-serif', fontSize: '14px',
          textShadow: '1px 1px 0 #000', textAlign: 'right',
          pointerEvents: 'none', zIndex: 10, lineHeight: '1.8'
        }}>
          <span style={{ color: '#facc15' }}>W/↑</span> Gas &nbsp;
          <span style={{ color: '#facc15' }}>S/↓</span> Bremse<br />
          <span style={{ color: '#facc15' }}>A/D</span> Lenken &nbsp;
          <span style={{ color: '#facc15' }}>Shift/Leertaste</span> Drift<br />
          <span style={{ color: '#facc15' }}>E/F</span> Item benutzen
        </div>
      )}

      {/* Country Modal */}
      {gameState.showCountryModal && gameState.pendingCountry && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.65)', zIndex: 50,
          fontFamily: 'sans-serif'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
            border: gameState.wrongAnswer ? '4px solid #ef4444' : '4px solid #facc15',
            borderRadius: '20px',
            padding: '36px 44px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            maxWidth: '420px', width: '90%',
            transition: 'border-color 0.2s'
          }}>
            <div style={{ fontSize: '90px', lineHeight: 1 }}>
              {gameState.pendingCountry.flag}
            </div>
            <h2 style={{ color: '#facc15', fontSize: '22px', margin: '16px 0 8px' }}>
              {{ shell: '🐚', boost: '⚡', banana: '🍌' }[gameState.heldItem] || '❓'} Item erhalten!
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '16px', margin: '0 0 8px' }}>
              Welches Land zeigt diese Flagge?
            </p>
            {gameState.wrongAnswer && (
              <p style={{ color: '#ef4444', fontSize: '14px', margin: '0 0 12px', fontWeight: 'bold' }}>
                ❌ Falsch! Versuche es nochmal.
              </p>
            )}
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px' }}>
              Tippe den Ländernamen und drücke Enter
            </p>
            <input
              autoFocus
              type="text"
              value={gameState.countryAnswer}
              onChange={e => updateGame({ countryAnswer: e.target.value })}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const ans = gameState.countryAnswer.trim().toLowerCase();
                  const correct = [
                    gameState.pendingCountry.name.toLowerCase(),
                    ...gameState.pendingCountry.alt
                  ].some(a => ans === a);
                  if (correct) {
                    handleCountryCorrect();
                  } else {
                    handleCountryWrong();
                  }
                }
              }}
              placeholder="Land eingeben…"
              style={{
                width: '100%', padding: '12px 16px', fontSize: '18px',
                borderRadius: '10px',
                border: gameState.wrongAnswer ? '2px solid #ef4444' : '2px solid #3b82f6',
                background: '#1e293b', color: 'white', outline: 'none',
                boxSizing: 'border-box', marginBottom: '16px',
                transition: 'border-color 0.2s'
              }}
            />
            <button
              onClick={() => {
                const ans = gameState.countryAnswer.trim().toLowerCase();
                const correct = [
                  gameState.pendingCountry.name.toLowerCase(),
                  ...gameState.pendingCountry.alt
                ].some(a => ans === a);
                if (correct) handleCountryCorrect(); else handleCountryWrong();
              }}
              style={{
                width: '100%', padding: '12px', fontSize: '18px',
                fontWeight: 'bold', background: '#2563eb', color: 'white',
                border: 'none', borderRadius: '10px', cursor: 'pointer'
              }}
            >
              Bestätigen ✓
            </button>
            <p style={{ color: '#475569', fontSize: '13px', marginTop: '12px', marginBottom: 0 }}>
              Akzeptiert: Deutsch & Englisch
            </p>
          </div>
        </div>
      )}

      {/* Win Screen */}
      {gameState.phase === 'won' && (
        <WinScreen onExit={onExit} onRestart={handleRestart} finalTime={`${mins}:${secs}`} />
      )}

      {/* Beenden Button */}
      <button
        onClick={onExit}
        style={{
          position: 'absolute', top: 20, right: 20,
          padding: '12px 24px', fontSize: '18px',
          fontWeight: 'bold', background: '#ef4444', color: 'white',
          border: '2px solid white', borderRadius: '8px', cursor: 'pointer',
          zIndex: 100, boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
          textTransform: 'uppercase', fontFamily: 'sans-serif'
        }}
        onMouseOver={e => (e.currentTarget.style.background = '#dc2626')}
        onMouseOut={e => (e.currentTarget.style.background = '#ef4444')}
      >
        Beenden
      </button>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default FaskaKartSwarm;
