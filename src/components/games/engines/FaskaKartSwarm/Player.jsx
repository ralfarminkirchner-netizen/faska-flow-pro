import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import useKartStore, {
  KART_APEX_GATES,
  KART_BOOST_PADS,
  KART_HAZARD_ZONES,
  KART_ITEM_BOXES,
  KART_LEARN_GATE_POSITIONS,
  KART_SHORTCUT_GATES,
  KART_START,
  KART_STATIC_OIL_SLICKS,
} from './GameLogic';

/**
 * Player Kart — A colorful box-body car with 4 cylinder wheels.
 * Uses Rapier kinematic body for arcade-style racing.
 * Third-person chase camera follows behind the kart.
 */

// Kart body colors
const BODY_COLOR = '#7c3aed';
const BODY_EMISSIVE = '#4c1d95';
const WHEEL_COLOR = '#1e293b';
const TRACK_RADIUS = 17;

function ovalProgressFromPosition(x, z) {
  const angle = Math.atan2(x, -z);
  return (angle < 0 ? angle + Math.PI * 2 : angle) / (Math.PI * 2);
}

function aiTrackPosition(progress) {
  const t = progress * Math.PI * 2;
  return {
    x: Math.sin(t) * TRACK_RADIUS,
    z: -Math.cos(t) * TRACK_RADIUS,
  };
}

function Wheel({ position }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.3, 0.3, 0.2, 12]} />
      <meshStandardMaterial color={WHEEL_COLOR} roughness={0.4} />
    </mesh>
  );
}

export default function Player() {
  const rigidBodyRef = useRef();
  const kartGroupRef = useRef();
  const { camera } = useThree();

  // Store selectors
  const raceStarted = useKartStore(s => s.raceStarted);
  const finished = useKartStore(s => s.finished);
  const isPaused = useKartStore(s => s.isPaused);
  const quizActive = useKartStore(s => s.quizActive);
  const boostActive = useKartStore(s => s.boostActive);
  const driftActive = useKartStore(s => s.driftActive);
  const offroad = useKartStore(s => s.offroad);
  const shieldTimer = useKartStore(s => s.shieldTimer);
  const slipTimer = useKartStore(s => s.slipTimer);
  const countdownActive = useKartStore(s => s.countdownActive);

  // Refs for smooth camera
  const posRef = useRef(new THREE.Vector3(KART_START.x, 0.5, KART_START.z));
  const angleRef = useRef(KART_START.angle);
  const speedRef = useRef(0);
  const cameraTargetRef = useRef(new THREE.Vector3());
  const cameraLookRef = useRef(new THREE.Vector3());

  // Track checkpoint zones for detection
  const checkpoints = useKartStore(s => s.checkpoints);
  const lastCpRef = useRef(-1);

  const lastBoostRef = useRef(-1);
  const lastItemRef = useRef(-1);
  const lastOilRef = useRef(new Set());
  const lastGateRef = useRef('');
  const lastApexRef = useRef(new Set());
  const lastShortcutRef = useRef(new Set());
  const lastHazardRef = useRef(new Set());

  useEffect(() => {
    if (!countdownActive) return;
    posRef.current.set(KART_START.x, 0.5, KART_START.z);
    angleRef.current = KART_START.angle;
    speedRef.current = 0;
    lastCpRef.current = -1;
    lastBoostRef.current = -1;
    lastItemRef.current = -1;
    lastOilRef.current.clear();
    lastGateRef.current = '';
    lastApexRef.current.clear();
    lastShortcutRef.current.clear();
    lastHazardRef.current.clear();
    try {
      if (rigidBodyRef.current) {
        rigidBodyRef.current.setTranslation({ x: KART_START.x, y: 0.5, z: KART_START.z }, true);
        const quat = new THREE.Quaternion();
        quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), KART_START.angle);
        rigidBodyRef.current.setRotation({ x: quat.x, y: quat.y, z: quat.z, w: quat.w }, true);
      }
    } catch {
      // Rapier safety during scene startup.
    }
  }, [countdownActive]);

  useFrame((state, delta) => {
    if (!raceStarted || finished || isPaused || quizActive) return;

    const dt = Math.min(delta, 0.05);
    const store = useKartStore.getState();
    const { input, actions } = store;

    // Steering
    if (input.dx !== 0) {
      store.steer(-input.dx, dt);
    }

    const radialDistance = Math.sqrt(posRef.current.x ** 2 + posRef.current.z ** 2);
    const onTrack = radialDistance >= 11 && radialDistance <= 23;
    const idealGrip = Math.max(0, 1 - Math.abs(radialDistance - 17) / 6);
    store.updateSurface(dt, onTrack, idealGrip);

    const wantsDrift = actions.A && actions.B && Math.abs(input.dx) > 0.22 && Math.abs(store.playerSpeed) > 4.5;
    if (wantsDrift) {
      store.startDrift();
      store.updateDrift(dt, Math.abs(input.dx), onTrack);
    } else if (store.driftActive) {
      store.releaseDrift();
    }

    // Acceleration / Braking
    if (actions.A) {
      store.accelerate(dt);
    } else if (actions.B && !store.driftActive) {
      store.brake(dt);
    } else {
      store.decelerate(dt);
    }

    // Boost button (X)
    if (actions.X) {
      store.useBoost();
      store.setAction('X', false); // one-shot
    }

    if (actions.Y) {
      const dropDistance = 1.9;
      const angle = store.playerAngle;
      store.useItem({
        x: posRef.current.x - Math.sin(angle) * dropDistance,
        z: posRef.current.z + Math.cos(angle) * dropDistance,
      });
      store.setAction('Y', false);
    }

    if (store.slipTimer > 0) {
      const wobble = Math.sin(state.clock.elapsedTime * 17) * 0.85;
      store.steer(wobble, dt * 0.7);
    }

    store.updateBoost(dt);
    store.updateRaceTime(dt);
    store.updateAI(dt);

    // Get current values
    const angle = store.playerAngle;
    const speed = store.playerSpeed;
    angleRef.current = angle;
    speedRef.current = speed;

    // Move position
    const dx = Math.sin(angle) * speed * dt;
    const dz = -Math.cos(angle) * speed * dt;
    posRef.current.x += dx;
    posRef.current.z += dz;
    const playerProgress = ovalProgressFromPosition(posRef.current.x, posRef.current.z);
    store.updatePlayerProgress(playerProgress);

    // Boundary clamp (keep on track area)
    const trackDist = Math.sqrt(posRef.current.x ** 2 + posRef.current.z ** 2);
    if (trackDist > 0.001 && (trackDist < 10.2 || trackDist > 23.8)) {
      const targetRadius = trackDist < 10.2 ? 10.9 : 23.1;
      const correctionScale = THREE.MathUtils.lerp(1, targetRadius / trackDist, 0.14);
      posRef.current.x *= correctionScale;
      posRef.current.z *= correctionScale;
      if (Math.abs(speed) > 5.4) {
        useKartStore.setState({ playerSpeed: Math.sign(speed) * 5.4 });
      }
    }

    const maxRadius = 28;
    const dist = Math.sqrt(posRef.current.x ** 2 + posRef.current.z ** 2);
    if (dist > maxRadius) {
      posRef.current.x *= maxRadius / dist;
      posRef.current.z *= maxRadius / dist;
      // Slow down when hitting boundary
      useKartStore.setState({ playerSpeed: speed * 0.5 });
    }

    // Update rigid body position
    try {
      if (rigidBodyRef.current) {
        rigidBodyRef.current.setTranslation(
          { x: posRef.current.x, y: 0.5, z: posRef.current.z },
          true
        );
        // Build quaternion from angle
        const quat = new THREE.Quaternion();
        quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        rigidBodyRef.current.setRotation(
          { x: quat.x, y: quat.y, z: quat.z, w: quat.w },
          true
        );
      }
    } catch {
      // Rapier safety
    }

    // Checkpoint detection
    const cp = checkpoints[store.nextCheckpoint];
    if (cp) {
      const cpDist = Math.sqrt(
        (posRef.current.x - cp.x) ** 2 + (posRef.current.z - cp.z) ** 2
      );
      if (cpDist < 5 && lastCpRef.current !== store.nextCheckpoint) {
        lastCpRef.current = store.nextCheckpoint;
        store.passCheckpoint(store.nextCheckpoint);
      }
    }

    // Boost pad detection
    for (let i = 0; i < KART_BOOST_PADS.length; i++) {
      const bp = KART_BOOST_PADS[i];
      const bpDist = Math.sqrt(
        (posRef.current.x - bp.x) ** 2 + (posRef.current.z - bp.z) ** 2
      );
      if (bpDist < 3 && lastBoostRef.current !== i) {
        lastBoostRef.current = i;
        store.collectBoostPad();
        setTimeout(() => { lastBoostRef.current = -1; }, 3000);
      }
    }

    // Reward clean racing line hits through apex gates.
    for (const apex of KART_APEX_GATES) {
      const apexKey = `${store.lap}:${apex.id}`;
      const apexDist = Math.sqrt(
        (posRef.current.x - apex.x) ** 2 + (posRef.current.z - apex.z) ** 2
      );
      if (apexDist < 2.25 && Math.abs(speed) > 5.4 && !lastApexRef.current.has(apexKey)) {
        lastApexRef.current.add(apexKey);
        store.hitApexGate(apex);
      }
    }

    // Shortcuts reward a risky inner racing line without teleporting the player.
    for (const shortcut of KART_SHORTCUT_GATES) {
      const shortcutKey = `${store.lap}:${shortcut.id}`;
      const shortcutDist = Math.sqrt(
        (posRef.current.x - shortcut.x) ** 2 + (posRef.current.z - shortcut.z) ** 2
      );
      if (shortcutDist < 2.45 && Math.abs(speed) > 5.1 && !lastShortcutRef.current.has(shortcutKey)) {
        lastShortcutRef.current.add(shortcutKey);
        store.hitShortcutGate(shortcut);
      }
    }

    // Item boxes
    for (let i = 0; i < KART_ITEM_BOXES.length; i++) {
      const box = KART_ITEM_BOXES[i];
      const boxDist = Math.sqrt(
        (posRef.current.x - box.x) ** 2 + (posRef.current.z - box.z) ** 2
      );
      if (boxDist < 2.25 && lastItemRef.current !== i) {
        lastItemRef.current = i;
        store.collectItemBox();
        setTimeout(() => { lastItemRef.current = -1; }, 1800);
      }
    }

    // Oil slicks, including player-dropped traps.
    const oils = [...KART_STATIC_OIL_SLICKS, ...store.droppedOils];
    for (const oil of oils) {
      const oilKey = oil.id ?? `${oil.x}:${oil.z}`;
      const oilDist = Math.sqrt(
        (posRef.current.x - oil.x) ** 2 + (posRef.current.z - oil.z) ** 2
      );
      if (oilDist < 1.65 && !lastOilRef.current.has(oilKey)) {
        lastOilRef.current.add(oilKey);
        store.hitOilSlick();
        setTimeout(() => { lastOilRef.current.delete(oilKey); }, 2200);
      }
    }

    for (const hazard of KART_HAZARD_ZONES) {
      const hazardKey = `${store.lap}:${hazard.id}`;
      const hazardDist = Math.sqrt(
        (posRef.current.x - hazard.x) ** 2 + (posRef.current.z - hazard.z) ** 2
      );
      if (hazardDist < hazard.radius && !lastHazardRef.current.has(hazardKey)) {
        lastHazardRef.current.add(hazardKey);
        store.hitHazardZone(hazard);
        setTimeout(() => { lastHazardRef.current.delete(hazardKey); }, 1800);
      }
    }

    if (store.mode === 'learn' && store.learnGateCooldown <= 0) {
      const task = store.getCurrentLearnGate();
      for (let i = 0; i < KART_LEARN_GATE_POSITIONS.length; i++) {
        const gate = KART_LEARN_GATE_POSITIONS[i];
        const label = task.options[i];
        const gateKey = `${store.learnGateIndex}:${label}`;
        const gateDist = Math.sqrt(
          (posRef.current.x - gate.x) ** 2 + (posRef.current.z - gate.z) ** 2
        );
        if (gateDist < 2.45 && lastGateRef.current !== gateKey) {
          lastGateRef.current = gateKey;
          store.passLearnGate(label);
          setTimeout(() => { lastGateRef.current = ''; }, 2600);
        }
      }
    }

    let slipstreamIntensity = 0;
    const playerTotal = store.lap + playerProgress;
    for (const ai of store.aiKarts) {
      const aiPos = aiTrackPosition(ai.progress);
      const rivalDist = Math.sqrt(
        (posRef.current.x - aiPos.x) ** 2 + (posRef.current.z - aiPos.z) ** 2
      );
      const aiTotal = ai.lap + ai.progress;
      const progressGap = aiTotal - playerTotal;
      if (progressGap > 0.004 && progressGap < 0.09 && rivalDist < 7.2) {
        const distanceFactor = 1 - rivalDist / 7.2;
        const gapFactor = 1 - progressGap / 0.09;
        slipstreamIntensity = Math.max(slipstreamIntensity, distanceFactor * 0.55 + gapFactor * 0.45);
      }
      if (rivalDist < 1.65) {
        store.bumpRival(ai.id);
        break;
      }
    }
    store.updateSlipstream(dt, slipstreamIntensity);

    if (kartGroupRef.current) {
      const surfaceWobble = store.slipTimer > 0
        ? Math.sin(state.clock.elapsedTime * 20) * 0.38
        : offroad
          ? Math.sin(state.clock.elapsedTime * 18) * 0.035
          : 0;
      const targetLean = store.driftActive ? input.dx * -0.18 : surfaceWobble;
      kartGroupRef.current.rotation.z = THREE.MathUtils.lerp(kartGroupRef.current.rotation.z, targetLean, 0.16);
      kartGroupRef.current.rotation.x = THREE.MathUtils.lerp(kartGroupRef.current.rotation.x, store.driftActive ? -0.04 : 0, 0.12);
    }

    // Chase camera
    const camDist = 8;
    const camHeight = 4;
    const camX = posRef.current.x - Math.sin(angle) * camDist;
    const camZ = posRef.current.z + Math.cos(angle) * camDist;

    cameraTargetRef.current.set(camX, camHeight, camZ);
    cameraLookRef.current.set(posRef.current.x, 1, posRef.current.z);

    camera.position.lerp(cameraTargetRef.current, 0.08);
    camera.lookAt(cameraLookRef.current);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      position={[KART_START.x, 0.5, KART_START.z]}
      colliders={false}
    >
      <CuboidCollider args={[0.6, 0.3, 1]} />
      <group ref={kartGroupRef}>
        {/* Kart Body */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[1.2, 0.5, 2]} />
          <meshStandardMaterial
            color={BODY_COLOR}
            emissive={boostActive ? '#ff6600' : BODY_EMISSIVE}
            emissiveIntensity={boostActive ? 1.5 : 0.3}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>

        {/* Cockpit */}
        <mesh position={[0, 0.45, -0.1]} castShadow>
          <boxGeometry args={[0.8, 0.3, 0.8]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#0891b2"
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>

        {/* Front spoiler */}
        <mesh position={[0, 0, 1.1]}>
          <boxGeometry args={[1.4, 0.1, 0.3]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.5} />
        </mesh>

        {/* Rear wing */}
        <mesh position={[0, 0.6, -1]}>
          <boxGeometry args={[1.3, 0.08, 0.3]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
        </mesh>
        {/* Wing supports */}
        <mesh position={[0.5, 0.4, -1]}>
          <boxGeometry args={[0.08, 0.3, 0.08]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[-0.5, 0.4, -1]}>
          <boxGeometry args={[0.08, 0.3, 0.08]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>

        {/* Wheels */}
        <Wheel position={[0.7, -0.15, 0.65]} />
        <Wheel position={[-0.7, -0.15, 0.65]} />
        <Wheel position={[0.7, -0.15, -0.65]} />
        <Wheel position={[-0.7, -0.15, -0.65]} />

        {/* Headlights */}
        <mesh position={[0.35, 0.1, 1.05]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial emissive="#fef08a" emissiveIntensity={2} color="#fef9c3" />
        </mesh>
        <mesh position={[-0.35, 0.1, 1.05]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial emissive="#fef08a" emissiveIntensity={2} color="#fef9c3" />
        </mesh>

        {/* Boost flame effect */}
        {boostActive && (
          <mesh position={[0, 0.1, -1.4]}>
            <coneGeometry args={[0.3, 1.2, 8]} />
            <meshStandardMaterial
              color="#ff4400"
              emissive="#ff6600"
              emissiveIntensity={3}
              transparent
              opacity={0.8}
            />
          </mesh>
        )}

        {shieldTimer > 0 && (
          <mesh position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.35, 0.045, 8, 40]} />
            <meshStandardMaterial
              color="#67e8f9"
              emissive="#0891b2"
              emissiveIntensity={2}
              transparent
              opacity={0.72}
            />
          </mesh>
        )}

        {slipTimer > 0 && (
          <group>
            <mesh position={[0.72, -0.08, 0.1]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.28, 0.04, 8, 16]} />
              <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={1.1} transparent opacity={0.6} />
            </mesh>
            <mesh position={[-0.72, -0.08, -0.1]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.28, 0.04, 8, 16]} />
              <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={1.1} transparent opacity={0.6} />
            </mesh>
          </group>
        )}

        {/* Drift sparks */}
        {driftActive && (
          <group>
            <mesh position={[0.82, -0.15, -0.58]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.12, 0.7, 7]} />
              <meshStandardMaterial color="#fbbf24" emissive="#f97316" emissiveIntensity={2.2} transparent opacity={0.82} />
            </mesh>
            <mesh position={[-0.82, -0.15, -0.58]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.12, 0.7, 7]} />
              <meshStandardMaterial color="#fbbf24" emissive="#f97316" emissiveIntensity={2.2} transparent opacity={0.82} />
            </mesh>
          </group>
        )}

        {/* Grass/dirt shake marker */}
        {offroad && (
          <mesh position={[0, -0.18, -1.15]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.35, 0.72, 18]} />
            <meshStandardMaterial color="#a3e635" emissive="#65a30d" emissiveIntensity={0.6} transparent opacity={0.45} />
          </mesh>
        )}
      </group>
    </RigidBody>
  );
}
