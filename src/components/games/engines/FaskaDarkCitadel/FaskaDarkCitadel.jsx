import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ARENA_LIMIT = 18;
const STORAGE_KEY = 'faska-dark-citadel-best-v1';

const SUBJECTS = {
  deutsch: {
    label: 'Deutsch',
    color: '#f97316',
    challenges: [
      { prompt: 'Welche Wortart ist "kaempft"?', answer: 'Verb', options: ['Verb', 'Nomen', 'Artikel', 'Adjektiv'] },
      { prompt: 'Welcher Artikel passt zu "Burg"?', answer: 'Die', options: ['Der', 'Die', 'Das', 'Ein'] },
      { prompt: 'Was ist ein Adjektiv?', answer: 'dunkel', options: ['dunkel', 'laufen', 'Schwert', 'unter'] },
      { prompt: 'Was ist ein Nomen?', answer: 'Tor', options: ['Tor', 'springt', 'leise', 'auf'] },
      { prompt: 'Welche Silbe beginnt "Ritter"?', answer: 'Rit', options: ['Rit', 'ter', 'Ra', 'Rei'] },
      { prompt: 'Was reimt sich auf "Licht"?', answer: 'Sicht', options: ['Sicht', 'Burg', 'Stein', 'Weg'] },
    ],
  },
  mathe: {
    label: 'Mathe',
    color: '#38bdf8',
    challenges: [
      { prompt: '9 + 6 = ?', answer: '15', options: ['15', '14', '16', '13'] },
      { prompt: '4 x 7 = ?', answer: '28', options: ['24', '28', '32', '21'] },
      { prompt: '36 : 6 = ?', answer: '6', options: ['5', '6', '7', '8'] },
      { prompt: 'Welche Zahl ist ungerade?', answer: '17', options: ['16', '20', '22', '17'] },
      { prompt: '3 Zehner und 9 Einer', answer: '39', options: ['93', '39', '12', '309'] },
      { prompt: 'Doppelte von 11', answer: '22', options: ['21', '22', '20', '24'] },
    ],
  },
  sach: {
    label: 'Sachkunde',
    color: '#22c55e',
    challenges: [
      { prompt: 'Was braucht Feuer?', answer: 'Sauerstoff', options: ['Sauerstoff', 'Sand', 'Eis', 'Glas'] },
      { prompt: 'Was ist ein Planet?', answer: 'Erde', options: ['Erde', 'Kerze', 'Lineal', 'Trommel'] },
      { prompt: 'Was gehoert zum Wetter?', answer: 'Nebel', options: ['Nebel', 'Teller', 'Stuhl', 'Buch'] },
      { prompt: 'Wo speichern Pflanzen Wasser?', answer: 'Wurzeln', options: ['Wurzeln', 'Fenster', 'Schrauben', 'Wolken'] },
      { prompt: 'Was ist magnetisch?', answer: 'Eisen', options: ['Eisen', 'Holz', 'Wasser', 'Papier'] },
      { prompt: 'Was ist ein Lebensraum?', answer: 'Teich', options: ['Teich', 'Tasse', 'Lampe', 'Stift'] },
    ],
  },
  musik: {
    label: 'Musik',
    color: '#c084fc',
    challenges: [
      { prompt: 'Was bedeutet forte?', answer: 'laut', options: ['laut', 'leise', 'langsam', 'tief'] },
      { prompt: 'Was bedeutet piano?', answer: 'leise', options: ['leise', 'schnell', 'laut', 'hoch'] },
      { prompt: 'Welches Instrument hat Saiten?', answer: 'Gitarre', options: ['Gitarre', 'Trommel', 'Floete', 'Triangel'] },
      { prompt: 'Was ist ein Takt?', answer: 'Ordnung', options: ['Ordnung', 'Farbe', 'Geruch', 'Gewicht'] },
      { prompt: 'Was klingt tief?', answer: 'Bass', options: ['Bass', 'Pfeife', 'Glocke', 'Piccolo'] },
      { prompt: 'Was gehoert zum Rhythmus?', answer: 'Pause', options: ['Pause', 'Wolke', 'Winkel', 'Blatt'] },
    ],
  },
};

const ENEMY_TYPES = {
  hunter: { name: 'Ash Hunter', color: '#991b1b', hp: 42, speed: 3.7, damage: 8, range: 1.45, radius: 0.52 },
  knight: { name: 'Iron Warden', color: '#475569', hp: 68, speed: 2.8, damage: 12, range: 1.65, radius: 0.62 },
  caster: { name: 'Veil Seer', color: '#7c3aed', hp: 36, speed: 2.2, damage: 6, range: 5.2, radius: 0.48 },
  boss: { name: 'Citadel Saint', color: '#111827', hp: 260, speed: 2.35, damage: 18, range: 2.2, radius: 1.05 },
};

const CONTROL_HELP = [
  'WASD bewegen',
  'Q/E Kamera',
  'J/Click Schlag',
  'K Schwer',
  'Space Ausweichen',
  'L Lock-on',
];

const tmpVector = new THREE.Vector3();
const tmpVectorB = new THREE.Vector3();

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function choose(items, seed) {
  return items[Math.abs(seed) % items.length];
}

function shuffle(items, seed) {
  return [...items]
    .map((item, index) => ({ item, order: (index * 91 + seed * 53 + String(item).length * 17) % 997 }))
    .sort((a, b) => a.order - b.order)
    .map(({ item }) => item);
}

function challengeFor(subject, seed) {
  const bank = SUBJECTS[subject].challenges;
  const base = choose(bank, seed);
  return { ...base, options: shuffle(base.options, seed).slice(0, 4) };
}

function flatDistance(a, b) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.hypot(dx, dz);
}

function yawTo(from, to) {
  return Math.atan2(to.x - from.x, -(to.z - from.z));
}

function forwardFromYaw(yaw) {
  return tmpVector.set(Math.sin(yaw), 0, -Math.cos(yaw)).clone();
}

function angleDelta(a, b) {
  let diff = ((a - b + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return diff;
}

function spawnWave(level, learnMode, subject, score) {
  const challenge = challengeFor(subject, level + score);
  const bossWave = level > 1 && level % 3 === 0;
  const baseOptions = learnMode ? challenge.options : ['Ember', 'Ash', 'Iron', 'Veil'];
  const angles = bossWave ? [Math.PI] : [-2.4, -0.8, 0.8, 2.4];
  const enemies = angles.map((angle, index) => {
    const type = bossWave ? 'boss' : choose(['hunter', 'knight', 'caster', 'hunter'], level + index);
    const template = ENEMY_TYPES[type];
    const label = bossWave ? (learnMode ? challenge.answer : template.name) : baseOptions[index % baseOptions.length];
    return {
      id: `${level}-${index}-${type}`,
      type,
      label,
      correct: !learnMode || label === challenge.answer,
      pos: new THREE.Vector3(Math.sin(angle) * (bossWave ? 12 : 14.5), 0, Math.cos(angle) * (bossWave ? 12 : 14.5)),
      yaw: angle + Math.PI,
      hp: Math.round(template.hp + level * (bossWave ? 22 : 7)),
      maxHp: Math.round(template.hp + level * (bossWave ? 22 : 7)),
      cooldown: 2.8 + index * 0.65,
      windup: 0,
      stun: 0,
      deadTimer: 0,
      attackFlash: 0,
    };
  });
  return { enemies, challenge, bossWave };
}

function createGameState({ learnMode, subject, best }) {
  const wave = spawnWave(1, learnMode, subject, 0);
  return {
    learnMode,
    subject,
    best,
    level: 1,
    score: 0,
    xp: 0,
    player: {
      pos: new THREE.Vector3(0, 0, 7),
      yaw: Math.PI,
      hp: 120,
      maxHp: 120,
      stamina: 100,
      maxStamina: 100,
      invincible: 0,
      dodge: 0,
      attackTimer: 0,
      heavyTimer: 0,
      attackCooldown: 0,
      hitStop: 0,
    },
    cameraYaw: Math.PI,
    lockOn: true,
    lockTargetId: wave.enemies[0]?.id || null,
    enemies: wave.enemies,
    challenge: wave.challenge,
    bossWave: wave.bossWave,
    particles: [],
    projectiles: [],
    message: learnMode ? 'Triff die richtige Antwort.' : 'Brich die erste Wache.',
    phase: 'playing',
  };
}

function makeSnapshot(state) {
  return {
    learnMode: state.learnMode,
    score: state.score,
    xp: state.xp,
    level: state.level,
    hp: Math.round(state.player.hp),
    maxHp: state.player.maxHp,
    stamina: Math.round(state.player.stamina),
    maxStamina: state.player.maxStamina,
    lockOn: state.lockOn,
    message: state.message,
    prompt: state.learnMode ? state.challenge.prompt : '',
    answer: state.learnMode ? state.challenge.answer : '',
    bossWave: state.bossWave,
    enemies: state.enemies.map((enemy) => ({
      id: enemy.id,
      type: enemy.type,
      label: enemy.label,
      correct: enemy.correct,
      hp: enemy.hp,
      maxHp: enemy.maxHp,
      dead: enemy.hp <= 0,
    })),
  };
}

function useCombatInput() {
  const inputRef = useRef({ keys: {}, pressed: {}, pointerHeld: false });

  useEffect(() => {
    const down = (event) => {
      const key = event.key.toLowerCase();
      if (!inputRef.current.keys[key]) inputRef.current.pressed[key] = true;
      inputRef.current.keys[key] = true;
      if ([' ', 'tab', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) event.preventDefault();
    };
    const up = (event) => {
      inputRef.current.keys[event.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return inputRef;
}

function consume(input, names) {
  for (const name of names) {
    if (input.pressed[name]) {
      input.pressed[name] = false;
      return true;
    }
  }
  return false;
}

function damageEnemy(state, enemy, damage, heavy) {
  if (enemy.hp <= 0) return;
  const player = state.player;
  if (state.learnMode && !enemy.correct) {
    player.hp = Math.max(0, player.hp - (heavy ? 14 : 8));
    player.stamina = Math.max(0, player.stamina - 16);
    player.hitStop = 0.08;
    state.message = `Falsche Antwort. Ziel: ${state.challenge.answer}`;
    state.particles.push({ pos: enemy.pos.clone().add(new THREE.Vector3(0, 1.2, 0)), color: '#fb7185', life: 0.55, size: 0.35 });
    return;
  }
  enemy.hp = Math.max(0, enemy.hp - damage);
  enemy.stun = heavy ? 0.55 : 0.32;
  enemy.attackFlash = 0.16;
  player.hitStop = heavy ? 0.09 : 0.045;
  const bonus = state.learnMode ? 22 : 12;
  state.score += bonus;
  state.xp += heavy ? 6 : 4;
  state.message = state.learnMode ? `Richtig: ${state.challenge.answer}` : 'Treffer sitzt.';
  state.particles.push({ pos: enemy.pos.clone().add(new THREE.Vector3(0, 1.35, 0)), color: heavy ? '#fbbf24' : '#93c5fd', life: 0.55, size: heavy ? 0.5 : 0.34 });
  if (enemy.hp <= 0) {
    enemy.deadTimer = 0.8;
    state.score += enemy.type === 'boss' ? 260 : 80;
    state.xp += enemy.type === 'boss' ? 45 : 14;
    state.message = enemy.type === 'boss' ? 'Boss gebrochen. Neue Ebene offen.' : `${enemy.label} faellt.`;
    state.particles.push({ pos: enemy.pos.clone().add(new THREE.Vector3(0, 1.4, 0)), color: '#34d399', life: 0.9, size: 0.72 });
  }
}

function tryPlayerAttack(state, heavy) {
  const player = state.player;
  const cost = heavy ? 34 : 18;
  if (player.attackCooldown > 0 || player.stamina < cost) return;
  player.stamina -= cost;
  player.attackCooldown = heavy ? 0.86 : 0.42;
  player.attackTimer = heavy ? 0 : 0.28;
  player.heavyTimer = heavy ? 0.48 : 0;
  const range = heavy ? 3.0 : 2.25;
  const arc = heavy ? 1.18 : 0.88;
  const damage = heavy ? 42 : 24;
  const target = state.lockOn ? state.enemies.find((enemy) => enemy.id === state.lockTargetId && enemy.hp > 0) : null;
  if (target) player.yaw = yawTo(player.pos, target.pos);

  let hit = false;
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;
    const distance = flatDistance(player.pos, enemy.pos);
    const angle = Math.abs(angleDelta(player.yaw, yawTo(player.pos, enemy.pos)));
    if (distance <= range + ENEMY_TYPES[enemy.type].radius && angle <= arc) {
      damageEnemy(state, enemy, damage, heavy);
      hit = true;
    }
  }
  if (!hit) state.message = heavy ? 'Schwerer Schlag geht ins Leere.' : 'Schlag verfehlt.';
}

function updatePlayer(state, input, dt) {
  const player = state.player;
  player.invincible = Math.max(0, player.invincible - dt);
  player.dodge = Math.max(0, player.dodge - dt);
  player.attackTimer = Math.max(0, player.attackTimer - dt);
  player.heavyTimer = Math.max(0, player.heavyTimer - dt);
  player.attackCooldown = Math.max(0, player.attackCooldown - dt);
  player.hitStop = Math.max(0, player.hitStop - dt);
  player.stamina = Math.min(player.maxStamina, player.stamina + (player.dodge > 0 ? 5 : 24) * dt);

  if (consume(input, ['l', 'tab'])) {
    state.lockOn = !state.lockOn;
    state.message = state.lockOn ? 'Lock-on aktiv.' : 'Lock-on geloest.';
  }

  if (consume(input, ['j', 'mouse0'])) tryPlayerAttack(state, false);
  if (consume(input, ['k', 'mouse2'])) tryPlayerAttack(state, true);

  const turn = (input.keys.q || input.keys.arrowleft ? 1 : 0) - (input.keys.e || input.keys.arrowright ? 1 : 0);
  if (turn) state.cameraYaw += turn * dt * 2.6;

  const x = (input.keys.d ? 1 : 0) - (input.keys.a ? 1 : 0);
  const z = (input.keys.w || input.keys.arrowup ? 1 : 0) - (input.keys.s || input.keys.arrowdown ? 1 : 0);
  const movement = tmpVector.set(0, 0, 0);
  if (x || z) {
    const forward = new THREE.Vector3(Math.sin(state.cameraYaw), 0, -Math.cos(state.cameraYaw));
    const right = new THREE.Vector3(Math.cos(state.cameraYaw), 0, Math.sin(state.cameraYaw));
    movement.addScaledVector(forward, z).addScaledVector(right, x).normalize();
  }

  if (consume(input, [' ', 'shift']) && player.stamina >= 28) {
    const dodgeDir = movement.lengthSq() > 0 ? movement.clone() : forwardFromYaw(player.yaw);
    player.dodge = 0.32;
    player.invincible = 0.44;
    player.stamina -= 28;
    player.pos.addScaledVector(dodgeDir, 2.35);
    player.yaw = Math.atan2(dodgeDir.x, -dodgeDir.z);
    state.particles.push({ pos: player.pos.clone().add(new THREE.Vector3(0, 0.5, 0)), color: '#d946ef', life: 0.35, size: 0.28 });
  }

  if (movement.lengthSq() > 0 && player.dodge <= 0 && player.attackCooldown < 0.36) {
    const speed = player.stamina < 12 ? 3.2 : 5.7;
    player.pos.addScaledVector(movement, speed * dt);
    player.yaw = Math.atan2(movement.x, -movement.z);
  }
  player.pos.x = clamp(player.pos.x, -ARENA_LIMIT, ARENA_LIMIT);
  player.pos.z = clamp(player.pos.z, -ARENA_LIMIT, ARENA_LIMIT);
}

function updateEnemies(state, dt) {
  const player = state.player;
  const aliveEnemies = state.enemies.filter((enemy) => enemy.hp > 0);
  if (state.lockOn) {
    const current = aliveEnemies.find((enemy) => enemy.id === state.lockTargetId);
    if (!current && aliveEnemies.length) {
      aliveEnemies.sort((a, b) => flatDistance(player.pos, a.pos) - flatDistance(player.pos, b.pos));
      state.lockTargetId = aliveEnemies[0].id;
    }
  }

  for (const enemy of state.enemies) {
    const template = ENEMY_TYPES[enemy.type];
    enemy.attackFlash = Math.max(0, enemy.attackFlash - dt);
    if (enemy.hp <= 0) {
      enemy.deadTimer = Math.max(0, enemy.deadTimer - dt);
      continue;
    }
    enemy.cooldown = Math.max(0, enemy.cooldown - dt);
    enemy.stun = Math.max(0, enemy.stun - dt);
    if (enemy.stun > 0 || player.hitStop > 0) continue;

    const distance = flatDistance(enemy.pos, player.pos);
    enemy.yaw = yawTo(enemy.pos, player.pos);
    if (enemy.type === 'caster' && distance < 4.4) {
      const away = tmpVectorB.set(enemy.pos.x - player.pos.x, 0, enemy.pos.z - player.pos.z).normalize();
      enemy.pos.addScaledVector(away, template.speed * 0.55 * dt);
    } else if (distance > template.range + 0.32) {
      const dir = tmpVectorB.set(player.pos.x - enemy.pos.x, 0, player.pos.z - enemy.pos.z).normalize();
      enemy.pos.addScaledVector(dir, template.speed * dt);
    }
    enemy.pos.x = clamp(enemy.pos.x, -ARENA_LIMIT + 1, ARENA_LIMIT - 1);
    enemy.pos.z = clamp(enemy.pos.z, -ARENA_LIMIT + 1, ARENA_LIMIT - 1);

    if (enemy.cooldown <= 0 && distance <= template.range + (enemy.type === 'caster' ? 4.5 : 0.25)) {
      enemy.windup = enemy.type === 'boss' ? 0.62 : 0.42;
      enemy.cooldown = enemy.type === 'boss' ? 2.55 : enemy.type === 'caster' ? 2.35 : 1.9;
      enemy.attackFlash = enemy.windup;
    }
    if (enemy.windup > 0) {
      enemy.windup -= dt;
      if (enemy.windup <= 0) {
        const hitRange = template.range + (enemy.type === 'caster' ? 4.5 : 0.35);
        if (flatDistance(enemy.pos, player.pos) <= hitRange && player.invincible <= 0) {
          player.hp = Math.max(0, player.hp - template.damage);
          player.hitStop = 0.08;
          state.message = `${template.name} trifft.`;
          state.particles.push({ pos: player.pos.clone().add(new THREE.Vector3(0, 1.2, 0)), color: '#ef4444', life: 0.45, size: 0.42 });
        } else {
          state.message = 'Ausgewichen.';
        }
      }
    }
  }
}

function updateWave(state, setBest) {
  if (state.player.hp <= 0) {
    const restart = createGameState({ learnMode: state.learnMode, subject: state.subject, best: state.best });
    restart.message = 'Du bist gefallen. Neue Runde.';
    restart.best = Math.max(state.best, state.score);
    setBest(restart.best);
    localStorage.setItem(STORAGE_KEY, String(restart.best));
    Object.assign(state, restart);
    return;
  }

  if (state.enemies.some((enemy) => enemy.hp > 0)) return;
  state.best = Math.max(state.best, state.score);
  setBest(state.best);
  localStorage.setItem(STORAGE_KEY, String(state.best));
  state.level += 1;
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + 24);
  state.player.stamina = state.player.maxStamina;
  const wave = spawnWave(state.level, state.learnMode, state.subject, state.score);
  state.challenge = wave.challenge;
  state.enemies = wave.enemies;
  state.bossWave = wave.bossWave;
  state.lockTargetId = state.enemies[0]?.id || null;
  state.message = wave.bossWave ? 'Boss-Welle. Ruhig bleiben.' : (state.learnMode ? 'Neue Frage. Neue Ziele.' : 'Neue Welle.');
}

function updateParticles(state, dt) {
  state.particles = state.particles
    .map((particle) => ({ ...particle, life: particle.life - dt, size: particle.size + dt * 0.55 }))
    .filter((particle) => particle.life > 0);
}

function ThirdPersonCamera({ stateRef, inputRef }) {
  const { camera } = useThree();
  useFrame((_, delta) => {
    const state = stateRef.current;
    if (!state) return;
    const target = state.enemies.find((enemy) => enemy.id === state.lockTargetId && enemy.hp > 0);
    if (state.lockOn && target) {
      state.cameraYaw = THREE.MathUtils.lerp(state.cameraYaw, yawTo(state.player.pos, target.pos), Math.min(1, delta * 3.4));
    } else {
      const input = inputRef.current;
      const turn = (input.keys.q || input.keys.arrowleft ? 1 : 0) - (input.keys.e || input.keys.arrowright ? 1 : 0);
      if (turn) state.cameraYaw += turn * delta * 1.8;
    }
    const forward = forwardFromYaw(state.cameraYaw);
    const desired = state.player.pos.clone().addScaledVector(forward, -8.4).add(new THREE.Vector3(0, 4.6, 0));
    camera.position.lerp(desired, Math.min(1, delta * 5.5));
    camera.lookAt(state.player.pos.x, state.player.pos.y + 1.45, state.player.pos.z);
  });
  return null;
}

function PlayerActor({ stateRef }) {
  const groupRef = useRef(null);
  const swordRef = useRef(null);
  const cloakRef = useRef(null);

  useFrame((clockState) => {
    const state = stateRef.current;
    if (!state || !groupRef.current) return;
    const { player } = state;
    groupRef.current.position.copy(player.pos);
    groupRef.current.rotation.y = player.yaw;
    const pulse = Math.sin(clockState.clock.elapsedTime * 11) * 0.04;
    groupRef.current.scale.setScalar(player.invincible > 0 ? 1 + pulse : 1);
    if (swordRef.current) {
      const swing = player.heavyTimer > 0 ? player.heavyTimer / 0.48 : player.attackTimer / 0.28;
      swordRef.current.rotation.x = -0.8 + (1 - swing) * 1.55;
      swordRef.current.rotation.z = player.heavyTimer > 0 ? -0.75 : -0.35;
    }
    if (cloakRef.current) cloakRef.current.rotation.x = -0.12 + Math.sin(clockState.clock.elapsedTime * 5) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow position={[0, 0.78, 0]}>
        <capsuleGeometry args={[0.42, 0.92, 8, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.15} roughness={0.62} />
      </mesh>
      <mesh castShadow position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.32, 18, 18]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.48} />
      </mesh>
      <mesh ref={cloakRef} castShadow position={[0, 0.98, 0.22]}>
        <boxGeometry args={[0.92, 1.25, 0.08]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.8} />
      </mesh>
      <group ref={swordRef} position={[0.68, 1.02, -0.2]}>
        <mesh castShadow position={[0, 0.45, -0.02]}>
          <boxGeometry args={[0.12, 1.45, 0.08]} />
          <meshStandardMaterial color="#dbeafe" metalness={0.8} roughness={0.22} emissive="#1e3a8a" emissiveIntensity={0.15} />
        </mesh>
        <mesh castShadow position={[0, -0.28, 0]}>
          <boxGeometry args={[0.48, 0.08, 0.1]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.55} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}

function EnemyActor({ enemyView, stateRef, learnMode }) {
  const groupRef = useRef(null);
  const bodyRef = useRef(null);

  useFrame((clockState, delta) => {
    const state = stateRef.current;
    const enemy = state?.enemies.find((item) => item.id === enemyView.id);
    if (!enemy || !groupRef.current) return;
    groupRef.current.visible = enemy.deadTimer > 0 || enemy.hp > 0;
    groupRef.current.position.lerp(enemy.pos, Math.min(1, delta * 12));
    groupRef.current.rotation.y = enemy.yaw;
    const aliveScale = enemy.hp > 0 ? 1 : Math.max(0.04, enemy.deadTimer / 0.8);
    const typeScale = enemy.type === 'boss' ? 1.7 : enemy.type === 'knight' ? 1.15 : 1;
    groupRef.current.scale.set(typeScale, typeScale * aliveScale, typeScale);
    if (bodyRef.current) {
      bodyRef.current.position.y = 0.75 + Math.sin(clockState.clock.elapsedTime * 4 + enemy.pos.x) * 0.035;
    }
  });

  const type = ENEMY_TYPES[enemyView.type];
  const labelColor = learnMode ? (enemyView.correct ? '#bbf7d0' : '#fee2e2') : '#e5e7eb';
  const hpRatio = enemyView.maxHp > 0 ? enemyView.hp / enemyView.maxHp : 0;

  return (
    <group ref={groupRef}>
      <mesh ref={bodyRef} castShadow position={[0, 0.78, 0]}>
        <capsuleGeometry args={[type.radius, enemyView.type === 'boss' ? 1.6 : 0.9, 8, 16]} />
        <meshStandardMaterial color={type.color} roughness={0.65} metalness={enemyView.type === 'knight' ? 0.55 : 0.12} emissive={enemyView.correct && learnMode ? '#064e3b' : '#000000'} emissiveIntensity={enemyView.correct && learnMode ? 0.25 : 0} />
      </mesh>
      <mesh castShadow position={[0, enemyView.type === 'boss' ? 2.1 : 1.55, 0]}>
        <sphereGeometry args={[enemyView.type === 'boss' ? 0.42 : 0.26, 16, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.45} />
      </mesh>
      <mesh position={[0, enemyView.type === 'boss' ? 2.85 : 2.25, 0]}>
        <boxGeometry args={[1.28, 0.1, 0.08]} />
        <meshBasicMaterial color="#111827" />
      </mesh>
      <mesh position={[-0.64 + hpRatio * 0.64, enemyView.type === 'boss' ? 2.86 : 2.26, 0.01]}>
        <boxGeometry args={[1.28 * hpRatio, 0.12, 0.09]} />
        <meshBasicMaterial color={enemyView.type === 'boss' ? '#dc2626' : '#f59e0b'} />
      </mesh>
      <LabelSprite text={enemyView.label} color={labelColor} position={[0, enemyView.type === 'boss' ? 3.25 : 2.58, 0]} size={enemyView.type === 'boss' ? 0.72 : 0.48} />
    </group>
  );
}

function CitadelWorld() {
  const columns = [-13, -7, 7, 13].flatMap((x) => [-13, 13].map((z) => ({ x, z })));
  const torches = [
    [-15, -15],
    [15, -15],
    [-15, 15],
    [15, 15],
    [0, -17],
    [0, 17],
  ];

  return (
    <>
      <fog attach="fog" args={['#020617', 18, 48]} />
      <color attach="background" args={['#07111f']} />
      <ambientLight intensity={0.62} />
      <hemisphereLight args={['#dbeafe', '#450a0a', 1.15]} />
      <directionalLight position={[-8, 12, 6]} intensity={2.1} />
      {torches.map(([x, z]) => (
        <pointLight key={`${x}-${z}`} position={[x, 2.7, z]} color="#fb7185" intensity={3.4} distance={13} />
      ))}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[22, 96]} />
        <meshStandardMaterial color="#263244" roughness={0.82} metalness={0.08} emissive="#0f172a" emissiveIntensity={0.18} />
      </mesh>
      <mesh receiveShadow position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.5, 22.2, 96]} />
        <meshStandardMaterial color="#374151" roughness={0.92} metalness={0.04} emissive="#111827" emissiveIntensity={0.16} />
      </mesh>
      <mesh receiveShadow position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.65, 64]} />
        <meshStandardMaterial color="#be123c" emissive="#7f1d1d" emissiveIntensity={0.75} roughness={0.55} />
      </mesh>
      {columns.map(({ x, z }) => (
        <group key={`${x}-${z}`} position={[x, 0, z]}>
          <mesh castShadow receiveShadow position={[0, 1.65, 0]}>
            <cylinderGeometry args={[0.55, 0.72, 3.3, 12]} />
            <meshStandardMaterial color="#334155" roughness={0.76} />
          </mesh>
          <mesh castShadow position={[0, 3.55, 0]}>
            <boxGeometry args={[1.35, 0.45, 1.35]} />
            <meshStandardMaterial color="#475569" roughness={0.7} />
          </mesh>
        </group>
      ))}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rotation) => (
        <group key={rotation} rotation={[0, rotation, 0]} position={[0, 0, 0]}>
          <mesh castShadow receiveShadow position={[0, 1.1, -21.4]}>
            <boxGeometry args={[13, 2.2, 0.75]} />
            <meshStandardMaterial color="#0f172a" roughness={0.88} />
          </mesh>
          <mesh castShadow receiveShadow position={[-7.8, 2.7, -21.4]}>
            <boxGeometry args={[2, 5.4, 1.15]} />
            <meshStandardMaterial color="#1e293b" roughness={0.82} />
          </mesh>
          <mesh castShadow receiveShadow position={[7.8, 2.7, -21.4]}>
            <boxGeometry args={[2, 5.4, 1.15]} />
            <meshStandardMaterial color="#1e293b" roughness={0.82} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function ParticleField({ stateRef }) {
  const [particles, setParticles] = useState([]);
  const timerRef = useRef(0);

  useFrame((_, delta) => {
    timerRef.current += delta;
    if (timerRef.current > 0.05) {
      timerRef.current = 0;
      setParticles(stateRef.current?.particles.map((particle, index) => ({ ...particle, id: index })) || []);
    }
  });

  return (
    <group>
      {particles.map((particle) => (
        <mesh key={particle.id} position={particle.pos}>
          <sphereGeometry args={[particle.size, 12, 12]} />
          <meshBasicMaterial color={particle.color} transparent opacity={Math.max(0, particle.life)} />
        </mesh>
      ))}
    </group>
  );
}

function GameLoop({ stateRef, inputRef, setView, setBest }) {
  const viewTimer = useRef(0);

  useFrame((_, delta) => {
    const state = stateRef.current;
    if (!state) return;
    const dt = Math.min(delta, 0.033);
    const input = inputRef.current;
    updatePlayer(state, input, dt);
    updateEnemies(state, dt);
    updateParticles(state, dt);
    updateWave(state, setBest);
    viewTimer.current += dt;
    if (viewTimer.current > 0.08) {
      viewTimer.current = 0;
      setView(makeSnapshot(state));
    }
  });

  return null;
}

function DarkCitadelScene({ stateRef, inputRef, view, setView, setBest }) {
  return (
    <>
      <CitadelWorld />
      <ThirdPersonCamera stateRef={stateRef} inputRef={inputRef} />
      <GameLoop stateRef={stateRef} inputRef={inputRef} setView={setView} setBest={setBest} />
      <PlayerActor stateRef={stateRef} />
      {view.enemies.map((enemy) => (
        <EnemyActor key={enemy.id} enemyView={enemy} stateRef={stateRef} learnMode={view.learnMode} />
      ))}
      <ParticleField stateRef={stateRef} />
    </>
  );
}

function Bar({ label, value, max, color }) {
  const ratio = max > 0 ? clamp(value / max, 0, 1) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-[10px] font-black uppercase tracking-[.16em] text-white/45">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full transition-all" style={{ width: `${ratio * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function LabelSprite({ text, color = '#ffffff', position, size = 1 }) {
  const spriteRef = useRef(null);
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(2, 6, 23, 0.82)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(12, 22, 488, 84, 26);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = '900 42px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64, 440);
    const nextTexture = new THREE.CanvasTexture(canvas);
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.needsUpdate = true;
    return nextTexture;
  }, [text, color]);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(({ camera }) => {
    if (spriteRef.current) spriteRef.current.lookAt(camera.position);
  });

  return (
    <sprite ref={spriteRef} position={position} scale={[size * 3.8, size * 0.95, 1]}>
      <spriteMaterial map={texture} transparent depthTest={false} />
    </sprite>
  );
}

export default function FaskaDarkCitadel({ onExit, isLearncade = false }) {
  const [learnMode, setLearnMode] = useState(isLearncade);
  const [subject, setSubject] = useState('deutsch');
  const [best, setBest] = useState(() => Number(localStorage.getItem(STORAGE_KEY) || 0));
  const bestRef = useRef(best);
  const inputRef = useCombatInput();
  const [initialState] = useState(() => createGameState({ learnMode: isLearncade, subject: 'deutsch', best: Number(localStorage.getItem(STORAGE_KEY) || 0) }));
  const stateRef = useRef(initialState);
  const [view, setView] = useState(() => makeSnapshot(initialState));

  useEffect(() => {
    bestRef.current = best;
  }, [best]);

  useEffect(() => {
    const next = createGameState({ learnMode, subject, best: bestRef.current });
    stateRef.current = next;
    const frame = requestAnimationFrame(() => setView(makeSnapshot(next)));
    return () => cancelAnimationFrame(frame);
  }, [learnMode, subject]);

  const reset = () => {
    const next = createGameState({ learnMode, subject, best: bestRef.current });
    stateRef.current = next;
    setView(makeSnapshot(next));
  };

  const markPointerAttack = (button) => {
    if (button === 2) inputRef.current.pressed.mouse2 = true;
    else inputRef.current.pressed.mouse0 = true;
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-black text-white" onContextMenu={(event) => event.preventDefault()}>
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 4.5, 12], fov: 58, near: 0.1, far: 120 }}
        onPointerDown={(event) => markPointerAttack(event.button)}
        style={{ touchAction: 'none' }}
      >
        <DarkCitadelScene stateRef={stateRef} inputRef={inputRef} view={view} setView={setView} setBest={setBest} />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/80 to-transparent px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.24em] text-rose-300/70">Premium Combat Vertical</p>
            <h2 className="text-3xl font-black leading-none md:text-5xl">FASKA Dark Citadel</h2>
            <p className="mt-2 max-w-xl text-sm font-bold text-white/62">{view.message}</p>
          </div>
          <div className="pointer-events-auto flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setLearnMode(false)} className={`rounded-2xl px-4 py-2 text-sm font-black transition ${!learnMode ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white hover:bg-white/15'}`}>
              Normal
            </button>
            <button type="button" onClick={() => setLearnMode(true)} className={`rounded-2xl px-4 py-2 text-sm font-black transition ${learnMode ? 'bg-pink-500 text-white' : 'bg-white/10 text-white hover:bg-white/15'}`}>
              Lernen
            </button>
            <select
              value={subject}
              disabled={!learnMode}
              onChange={(event) => setSubject(event.target.value)}
              className="rounded-2xl border border-white/15 bg-slate-950 px-3 py-2 text-sm font-bold text-white"
            >
              {Object.entries(SUBJECTS).map(([id, item]) => (
                <option key={id} value={id}>{item.label}</option>
              ))}
            </select>
            <button type="button" onClick={reset} className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-black hover:bg-white/15">
              Reset
            </button>
            <button type="button" onClick={onExit} className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-black text-white shadow-lg shadow-rose-950/40 hover:bg-rose-500">
              Beenden
            </button>
          </div>
        </div>
      </div>

      {learnMode && (
        <div className="pointer-events-none absolute left-1/2 top-28 z-20 w-[min(760px,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-950/78 px-5 py-3 text-center shadow-2xl backdrop-blur">
          <p className="text-[10px] font-black uppercase tracking-[.22em]" style={{ color: SUBJECTS[subject].color }}>{SUBJECTS[subject].label}</p>
          <p className="text-xl font-black text-white md:text-2xl">{view.prompt}</p>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-4 left-4 z-20 grid w-[min(360px,calc(100vw-2rem))] gap-3 rounded-2xl border border-white/10 bg-slate-950/72 p-4 shadow-2xl backdrop-blur">
        <Bar label="Leben" value={view.hp} max={view.maxHp} color="#ef4444" />
        <Bar label="Stamina" value={view.stamina} max={view.maxStamina} color="#22c55e" />
        <div className="grid grid-cols-3 gap-2 text-xs font-black text-white/70">
          <span>Level {view.level}</span>
          <span>Score {view.score}</span>
          <span>Best {Math.max(best, view.score)}</span>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 z-20 hidden max-w-xl flex-wrap justify-end gap-2 md:flex">
        {CONTROL_HELP.map((item) => (
          <span key={item} className="rounded-full border border-white/10 bg-slate-950/62 px-3 py-1 text-[11px] font-black text-white/58 backdrop-blur">
            {item}
          </span>
        ))}
      </div>

      {view.bossWave && (
        <div className="pointer-events-none absolute inset-x-0 top-24 z-10 text-center">
          <p className="text-sm font-black uppercase tracking-[.36em] text-rose-300">Boss</p>
        </div>
      )}
    </div>
  );
}
