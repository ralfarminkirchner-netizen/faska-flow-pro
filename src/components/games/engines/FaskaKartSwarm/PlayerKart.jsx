import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useGameStore, ITEMS, COUNTRIES } from './GameLogic';
import { TRACK_RADIUS, TRACK_WIDTH, getTrackT } from './World';
import { kartJoystickState } from './MobileJoystick';
import { LAP_COUNT } from './GameLogic';

const clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);

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

export const KartMesh = ({ color, name, isPlayer, isDrifting, isHit }) => {
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
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.8, 0.7, 3.2]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.9, -0.3]} castShadow>
        <boxGeometry args={[1.4, 0.5, 1.6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {[[-1, 0, 1.2], [1, 0, 1.2], [-1, 0, -1.2], [1, 0, -1.2]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 10]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
      {isDrifting && (
        <pointLight position={[0, 0.5, -1.5]} color="#ff6600" intensity={2} distance={4} />
      )}
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

export const PlayerKart = ({ isLearncade }) => {
  const { camera } = useThree();
  const keys = useKeys();
  const groupRef = useRef();
  const cameraShake = useRef(0);

  const phase = useGameStore(s => s.phase);
  const boostTimer = useGameStore(s => s.boostTimer);
  const updateGame = useGameStore(s => s.updateGame);
  const itemBoxes = useGameStore(s => s.itemBoxes);
  const setItemBoxes = useGameStore(s => s.setItemBoxes);
  const setBananas = useGameStore(s => s.setBananas);
  const setProjectiles = useGameStore(s => s.setProjectiles);

  const state = useRef({
    t: 0, laps: 0, speed: 0, rotation: Math.PI / 2, x: TRACK_RADIUS, z: 0,
    driftTimer: 0, driftBoostCharge: 0, driftDir: 0, isDrifting: false,
    isHit: false, hitTimer: 0, spinTimer: 0, itemUseCooldown: 0,
  });

  const nextT = useRef(0);

  const useItem = (item, s) => {
    if (item === 'boost') {
      updateGame({ heldItem: null, boostTimer: 3 });
      cameraShake.current = 0.3;
    } else if (item === 'shell') {
      const dir = new THREE.Vector3(Math.sin(s.rotation), 0, Math.cos(s.rotation));
      setProjectiles(prev => [...prev, {
        id: Date.now(), x: s.x + dir.x * 3, z: s.z + dir.z * 3,
        vx: dir.x, vz: dir.z, owner: 'player'
      }]);
      updateGame({ heldItem: null });
    } else if (item === 'banana') {
      const dir = new THREE.Vector3(Math.sin(s.rotation), 0, Math.cos(s.rotation));
      setBananas(prev => [...prev, { id: Date.now(), x: s.x - dir.x * 3, z: s.z - dir.z * 3 }]);
      updateGame({ heldItem: null });
    }
  };

  useFrame((_, delta) => {
    if (phase !== 'racing' && phase !== 'quiz') return;
    let dt = clamp(delta, 0.001, 0.08);
    if (phase === 'quiz') dt *= 0.15;
    const s = state.current;
    const k = keys.current;

    if (s.hitTimer > 0) {
      s.hitTimer -= dt;
      s.isHit = true;
      s.spinTimer -= dt;
      if (s.spinTimer > 0) s.rotation += 8 * dt;
      if (s.hitTimer <= 0) s.isHit = false;
    }

    const isStunned = s.hitTimer > 0;
    const maxSpeed = isStunned ? 5 : (s.isDrifting ? 22 : 28);
    const accel = isStunned ? 0 : 40;
    const friction = 18;
    const bSpeed = isStunned ? 0 : (boostTimer > 0 ? 15 : 0);

    const accelInput = k['KeyW'] || k['ArrowUp'] ? 1 : k['KeyS'] || k['ArrowDown'] ? -1 : kartJoystickState.accel;
    
    if (!isStunned) {
      if (accelInput > 0.1) {
        s.speed = Math.min(s.speed + accel * accelInput * dt, maxSpeed + bSpeed);
      } else if (accelInput < -0.1) {
        s.speed = Math.max(s.speed + accel * accelInput * dt, -12);
      } else {
        s.speed = s.speed > 0 ? Math.max(0, s.speed - friction * dt) : Math.min(0, s.speed + friction * dt);
      }
    } else {
      s.speed *= 0.92;
    }

    const steerInput = k['KeyA'] || k['ArrowLeft'] ? 1 : k['KeyD'] || k['ArrowRight'] ? -1 : -kartJoystickState.steer;
    const steerFactor = clamp(Math.abs(s.speed) / maxSpeed, 0, 1);
    const steerSpeed = 2.8;

    if (!isStunned) s.rotation += steerInput * steerSpeed * steerFactor * dt;

    const driftKey = k['ShiftLeft'] || k['ShiftRight'] || k['Space'] || kartJoystickState.drift;
    if (driftKey && steerInput !== 0 && Math.abs(s.speed) > 10 && !isStunned) {
      s.isDrifting = true;
      s.driftDir = steerInput > 0 ? 1 : -1;
      s.driftTimer += dt;
      s.driftBoostCharge = Math.min(s.driftBoostCharge + dt * 0.4, 1);
      s.rotation += s.driftDir * 1.2 * steerFactor * dt;
    } else if (s.isDrifting && !driftKey) {
      if (s.driftBoostCharge > 0.3) {
        updateGame({ boostTimer: s.driftBoostCharge * 2.5 });
        cameraShake.current = 0.4;
      }
      s.isDrifting = false; s.driftTimer = 0; s.driftBoostCharge = 0; s.driftDir = 0;
    } else if (!driftKey) {
      s.isDrifting = false;
    }

    if (boostTimer > 0) {
      updateGame({ boostTimer: Math.max(0, boostTimer - dt) });
      s.speed = Math.min(s.speed + 80 * dt, 45);
    }

    if (s.itemUseCooldown > 0) s.itemUseCooldown -= dt;

    const useItemInput = k['KeyE'] || k['KeyF'] || kartJoystickState.item;
    if (useItemInput && s.itemUseCooldown <= 0) {
      const gs = useGameStore.getState();
      if (gs.heldItem && !gs.pendingCountry) {
        useItem(gs.heldItem, s);
        s.itemUseCooldown = 0.5;
        kartJoystickState.item = false;
      }
    }

    const dir = new THREE.Vector3(Math.sin(s.rotation), 0, Math.cos(s.rotation));
    s.x += dir.x * s.speed * dt;
    s.z += dir.z * s.speed * dt;

    const distFromCenter = Math.sqrt(s.x * s.x + s.z * s.z);
    const angle = Math.atan2(s.z, s.x);
    const trackDist = distFromCenter - TRACK_RADIUS;
    if (Math.abs(trackDist) > TRACK_WIDTH / 2) {
      const push = (Math.abs(trackDist) - TRACK_WIDTH / 2) * 3;
      s.x -= Math.cos(angle) * Math.sign(trackDist) * push * dt;
      s.z -= Math.sin(angle) * Math.sign(trackDist) * push * dt;
      s.speed *= 0.85;
    }

    const curT = getTrackT(new THREE.Vector3(s.x, 0, s.z));
    const prevT = nextT.current;
    if (prevT > 0.85 && curT < 0.15) {
      s.laps += 1;
      if (s.laps >= LAP_COUNT) {
        const tGame = useGameStore.getState();
        updateGame({ phase: 'won', laps: s.laps });
      } else {
        updateGame({ laps: s.laps });
      }
    }
    nextT.current = curT;
    s.t = curT;

    let hitItemBoxIndex = -1;
    itemBoxes.forEach((box, idx) => {
      if (!box.active) return;
      const dx = s.x - box.pos[0], dz = s.z - box.pos[2];
      if (Math.sqrt(dx * dx + dz * dz) < 2.5) hitItemBoxIndex = idx;
    });

    if (hitItemBoxIndex !== -1) {
      const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      if (isLearncade) {
        const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
        const wrong1 = COUNTRIES[(COUNTRIES.indexOf(country) + 1) % COUNTRIES.length];
        const wrong2 = COUNTRIES[(COUNTRIES.indexOf(country) + 2) % COUNTRIES.length];
        const options = [country, wrong1, wrong2].sort(() => Math.random() - 0.5);
        updateGame({ heldItem: item, pendingCountry: country, countryOptions: options, showCountryModal: true, phase: 'quiz' });
      } else {
        updateGame({ heldItem: item });
      }
      setItemBoxes(prev => {
        const next = [...prev];
        next[hitItemBoxIndex] = { ...next[hitItemBoxIndex], active: false };
        setTimeout(() => setItemBoxes(p => {
          const n2 = [...p];
          if (n2[hitItemBoxIndex]) n2[hitItemBoxIndex] = { ...n2[hitItemBoxIndex], active: true };
          return n2;
        }), 5000);
        return next;
      });
    }

    setBananas(prev => prev.filter(b => {
      const dx = s.x - b.x, dz = s.z - b.z;
      if (Math.sqrt(dx * dx + dz * dz) < 1.5 && s.hitTimer <= 0) {
        s.hitTimer = 2; s.spinTimer = 1.5; s.speed *= 0.3; cameraShake.current = 0.5;
        return false;
      }
      return true;
    }));

    setProjectiles(prev => prev.filter(p => {
      const dx = s.x - p.x, dz = s.z - p.z;
      if (Math.sqrt(dx * dx + dz * dz) < 2 && p.owner !== 'player' && s.hitTimer <= 0) {
        s.hitTimer = 2.5; s.spinTimer = 2; s.speed *= 0.2; cameraShake.current = 0.6;
        return false;
      }
      return true;
    }));

    if (groupRef.current) {
      groupRef.current.position.set(s.x, 0, s.z);
      groupRef.current.rotation.y = s.rotation;
    }

    const shake = cameraShake.current > 0 ? (Math.random() - 0.5) * cameraShake.current * 0.8 : 0;
    cameraShake.current = Math.max(0, cameraShake.current - dt * 2);

    const camOffset = new THREE.Vector3(0, 5, -14);
    camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), s.rotation);
    const idealCamPos = new THREE.Vector3(s.x + camOffset.x + shake, camOffset.y, s.z + camOffset.z + shake);
    camera.position.lerp(idealCamPos, 0.12);
    camera.lookAt(s.x, 1.5, s.z);
  });

  return (
    <group ref={groupRef} position={[TRACK_RADIUS, 0, 0]}>
      <KartMesh
        color="#d97706"
        name="YOU"
        isPlayer
        isDrifting={state.current.isDrifting}
        isHit={state.current.isHit}
      />
    </group>
  );
};
