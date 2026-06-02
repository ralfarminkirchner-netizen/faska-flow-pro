import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2 + 8;
const FOV = 520;
const TUNNEL_RADIUS = 230;

const LEARN_GATES = [
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist markiert?',
    sentence: 'Der Pilot sammelt Energie.',
    word: 'sammelt',
    answer: 'Verb',
    options: ['Nomen', 'Verb', 'Adjektiv'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist markiert?',
    sentence: 'Die Station blinkt hell.',
    word: 'Station',
    answer: 'Nomen',
    options: ['Nomen', 'Verb', 'Adverb'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist markiert?',
    sentence: 'Das schnelle Schiff dreht ab.',
    word: 'schnelle',
    answer: 'Adjektiv',
    options: ['Artikel', 'Adjektiv', 'Verb'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist markiert?',
    sentence: 'Wir fliegen durch den Tunnel.',
    word: 'durch',
    answer: 'Praeposition',
    options: ['Praeposition', 'Nomen', 'Adjektiv'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist markiert?',
    sentence: 'Der Reaktor summt leise.',
    word: 'leise',
    answer: 'Adverb',
    options: ['Nomen', 'Adverb', 'Verb'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist markiert?',
    sentence: 'Acht plus sieben ergibt fuenfzehn.',
    word: 'fuenfzehn',
    answer: 'Zahlwort',
    options: ['Adjektiv', 'Zahlwort', 'Praeposition'],
  },
  {
    subject: 'Englisch',
    prompt: 'Welche Wortart ist markiert?',
    sentence: 'The tunnel bends sharply.',
    word: 'sharply',
    answer: 'Adverb',
    options: ['Verb', 'Nomen', 'Adverb'],
  },
  {
    subject: 'Mathe',
    prompt: 'Welcher Schild-Code stimmt?',
    sentence: '18 - 7 = ?',
    word: '18 - 7',
    answer: '11',
    options: ['9', '11', '12'],
  },
  {
    subject: 'Satzbau',
    prompt: 'Welches Wort passt in die Luecke?',
    sentence: 'Der Pilot ___ die Rakete.',
    word: 'Luecke',
    answer: 'startet',
    options: ['schnell', 'startet', 'unter'],
  },
  {
    subject: 'Komposita',
    prompt: 'Bilde das zusammengesetzte Wort.',
    sentence: 'Tunnel + Karte',
    word: 'Tunnel + Karte',
    answer: 'Tunnelkarte',
    options: ['Kartentunnel', 'Tunnelkarte', 'Tunneltor'],
  },
  {
    subject: 'Lesen',
    prompt: 'Welches Wort passt zum Hinweis?',
    sentence: 'Damit reparierst du den Schild.',
    word: 'Schild-Hilfe',
    answer: 'Energie',
    options: ['Energie', 'Nebel', 'Stein'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Was ist ein Reaktor im Spiel?',
    sentence: 'Er liefert Energie fuer die Station.',
    word: 'Reaktor',
    answer: 'Energiequelle',
    options: ['Energiequelle', 'Fenster', 'Landkarte'],
  },
];

const WEAPON_ORDER = ['laser', 'spread', 'rail'];

const DESCENT_KEY_BINDINGS = new Map([
  ['ArrowLeft', 'left'], ['a', 'left'], ['A', 'left'],
  ['ArrowRight', 'right'], ['d', 'right'], ['D', 'right'],
  ['ArrowUp', 'up'], ['w', 'up'], ['W', 'up'],
  ['ArrowDown', 'down'], ['s', 'down'], ['S', 'down'],
  ['j', 'fire'], ['J', 'fire'], [' ', 'fire'],
  ['Shift', 'boost'],
  ['e', 'evade'], ['E', 'evade'],
  ['k', 'lock'], ['K', 'lock'],
  ['l', 'missile'], ['L', 'missile'],
  ['x', 'pulse'], ['X', 'pulse'],
]);

const DESCENT_TAP_INPUTS = new Set(['evade', 'lock', 'missile', 'pulse']);
const DESCENT_INPUT_BUFFER_MS = 150;

const WEAPONS = {
  laser: {
    label: 'Pulse Laser',
    short: 'LASER',
    heat: 8,
    cooldown: 0.1,
    speed: 30,
    damage: 12,
    color: '#fef08a',
    pattern: [
      { x: -0.08, y: 0.04, vx: 0 },
      { x: 0.08, y: 0.04, vx: 0 },
    ],
  },
  spread: {
    label: 'Scatter Blaster',
    short: 'SPREAD',
    heat: 13,
    cooldown: 0.18,
    speed: 25,
    damage: 9,
    color: '#fb923c',
    pattern: [
      { x: -0.13, y: 0.03, vx: -0.78 },
      { x: 0, y: 0.07, vx: 0 },
      { x: 0.13, y: 0.03, vx: 0.78 },
    ],
  },
  rail: {
    label: 'Rail Lance',
    short: 'RAIL',
    heat: 24,
    cooldown: 0.5,
    speed: 42,
    damage: 32,
    color: '#67e8f9',
    pattern: [
      { x: 0, y: 0.06, vx: 0 },
    ],
  },
};

const DESCENT_GOALS = [
  { id: 'combo-8', label: '8er Trefferkette', type: 'bestCombo', target: 8, reward: 520 },
  { id: 'sentinel-4', label: '4 Sentinels knacken', type: 'sentinels', target: 4, reward: 600 },
  { id: 'roll-3', label: '3 perfekte Rollen', type: 'perfectEvades', target: 3, reward: 640 },
  { id: 'rollshot-4', label: '4 Roll-Shots', type: 'rollShots', target: 4, reward: 720 },
  { id: 'rail-3', label: '3 Rail-Lance-Treffer', type: 'railHits', target: 3, reward: 660 },
  { id: 'lock-3', label: '3 volle Lock-Treffer', type: 'lockHits', target: 3, reward: 680 },
  { id: 'flow-4', label: '4 Flow-Ringe', type: 'rings', target: 4, reward: 560 },
  { id: 'pulse-4', label: '4 Schuesse pulsen', type: 'pulseClears', target: 4, reward: 520 },
  { id: 'hazard-4', label: '4 Rift-Luecken treffen', type: 'hazards', target: 4, reward: 620 },
  { id: 'missile-3', label: '3 Raketen-Treffer', type: 'missileHits', target: 3, reward: 560 },
  { id: 'pickups-5', label: '5 Versorgungskapseln', type: 'pickups', target: 5, reward: 480 },
  { id: 'gates-3', label: '3 Learncade-Gates', type: 'gates', target: 3, reward: 700, learnOnly: true },
];

const DESCENT_CONTRACTS = [
  { id: 'targets-4', label: '4 Ziele abschiessen', type: 'targets', target: 4, duration: 34, reward: { score: 360, shield: 12, boost: 12 } },
  { id: 'combo-5', label: '5er Trefferkette halten', type: 'bestCombo', target: 5, duration: 38, reward: { score: 420, overdrive: 1.6, heat: -18 } },
  { id: 'flow-2', label: '2 Flow-Ringe sauber nehmen', type: 'rings', target: 2, duration: 36, reward: { score: 390, boost: 26, threat: -8 } },
  { id: 'rift-2', label: '2 Rift-Luecken treffen', type: 'hazards', target: 2, duration: 42, reward: { score: 430, boost: 18, heat: -18 } },
  { id: 'roll-1', label: '1 perfekte Ausweichrolle', type: 'perfectEvades', target: 1, duration: 34, reward: { score: 440, boost: 22, shield: 10 } },
  { id: 'rollshot-2', label: '2 Roll-Shots landen', type: 'rollShots', target: 2, duration: 40, reward: { score: 460, heat: -20, overdrive: 1.2 } },
  { id: 'rail-2', label: '2 Rail-Lance-Treffer', type: 'railHits', target: 2, duration: 44, reward: { score: 470, heat: -24, shield: 10 } },
  { id: 'lock-1', label: '1 voller Lock-Raketenhit', type: 'lockHits', target: 1, duration: 46, reward: { score: 520, missiles: 2, overdrive: 1.5 } },
  { id: 'pulse-2', label: '2 Feindschuesse pulsen', type: 'pulseClears', target: 2, duration: 38, reward: { score: 360, shield: 18, heat: -16 } },
  { id: 'pickup-2', label: '2 Versorgungskapseln sammeln', type: 'pickups', target: 2, duration: 44, reward: { score: 320, shield: 18, missiles: 1 } },
  { id: 'gate-1', label: '1 Learncade-Gate richtig fliegen', type: 'gates', target: 1, duration: 50, reward: { score: 520, shield: 24, heat: -28, missiles: 1 }, learnOnly: true },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const distance2 = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const normalizeAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));
const angleDistance = (a, b) => Math.abs(normalizeAngle(a - b));

function makeInputState() {
  return {
    left: false,
    right: false,
    up: false,
    down: false,
    fire: false,
    boost: false,
    lock: false,
    missile: false,
    evade: false,
    pulse: false,
    tapUntil: {},
  };
}

function setBufferedInput(input, name, pressed) {
  if (pressed) {
    input[name] = true;
    if (DESCENT_TAP_INPUTS.has(name)) input.tapUntil[name] = performance.now() + DESCENT_INPUT_BUFFER_MS;
    return;
  }
  if (DESCENT_TAP_INPUTS.has(name) && input.tapUntil[name] > performance.now()) return;
  input[name] = false;
  delete input.tapUntil[name];
}

function expireBufferedInputs(input, now) {
  Object.entries(input.tapUntil).forEach(([name, until]) => {
    if (until > now) return;
    input[name] = false;
    delete input.tapUntil[name];
  });
}

function projectPoint(x, y, z) {
  const scale = FOV / Math.max(0.1, z);
  return {
    x: CENTER_X + x * scale,
    y: CENTER_Y + y * scale,
    scale,
  };
}

function makeEnemy(index, z, type = 'drone') {
  const angle = index * 1.91;
  const radius = type === 'core' ? 0.05 : type === 'mine' ? 0.72 : 0.55 + (index % 3) * 0.16;
  const hp = type === 'core' ? 110 : type === 'ace' ? 44 : type === 'sentinel' ? 28 : type === 'mine' ? 12 : 16;
  return {
    id: `enemy-${index}-${Math.round(z * 10)}`,
    type,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle * 0.8) * radius,
    z,
    vx: Math.sin(angle) * 0.11,
    vy: Math.cos(angle * 0.7) * 0.1,
    hp,
    maxHp: hp,
    shotTimer: 1.2 + (index % 4) * 0.42,
    wobble: index * 0.8,
    lockable: type !== 'mine',
  };
}

function makeGate(index, z) {
  const prompt = LEARN_GATES[index % LEARN_GATES.length];
  return {
    id: `gate-${index}`,
    z,
    prompt,
    options: prompt.options.map((label, optionIndex) => ({
      label,
      correct: label === prompt.answer,
      x: [-1.02, 0, 1.02][optionIndex],
      y: 0.08,
    })),
    resolved: false,
  };
}

function makePickup(index, z) {
  const types = ['shield', 'coolant', 'missile', 'overdrive'];
  const type = types[index % types.length];
  const angle = index * 2.37;
  return {
    id: `pickup-${index}-${Math.round(z * 10)}`,
    type,
    x: Math.cos(angle) * (0.28 + (index % 3) * 0.16),
    y: Math.sin(angle * 0.82) * (0.18 + (index % 2) * 0.22),
    z,
    pulse: index * 0.6,
  };
}

function makeHazard(index, z) {
  const angle = index * 2.17;
  return {
    id: `hazard-${index}-${Math.round(z * 10)}`,
    z,
    gapAngle: angle,
    spin: index % 2 === 0 ? 0.72 : -0.58,
    gapWidth: 0.9 - (index % 3) * 0.08,
    radiusX: 0.58 + (index % 2) * 0.08,
    radiusY: 0.44 + (index % 3) * 0.04,
    resolved: false,
    pulse: index * 0.4,
  };
}

function makeFlowRing(index, z) {
  const angle = index * 2.43;
  return {
    id: `flow-${index}-${Math.round(z * 10)}`,
    x: Math.cos(angle) * (0.22 + (index % 3) * 0.16),
    y: Math.sin(angle * 0.78) * (0.16 + (index % 2) * 0.18),
    z,
    radius: 0.24 + (index % 2) * 0.04,
    rollBonus: index % 3 === 1,
    pulse: index * 0.5,
    resolved: false,
  };
}

function makeInitialGame(mode = 'arcade') {
  return {
    mode,
    elapsed: 0,
    phase: 'run',
    distance: 0,
    sector: 1,
    score: 0,
    combo: 0,
    message: mode === 'learn' ? 'Fliege durch das richtige Learncade-Gate.' : 'Tunnel gestartet.',
    messageTimer: 2,
    tunnelRotation: 0,
    nextEnemyIndex: 7,
    nextGateIndex: 2,
    nextPickupIndex: 4,
    nextHazardIndex: 3,
    nextFlowRingIndex: 3,
    threat: 16,
    activeContract: null,
    contractIndex: 0,
    contractTimer: 0,
    contractCooldown: 1.25,
    contractMedals: 0,
    contractFails: 0,
    player: {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      hp: 100,
      shield: 100,
      heat: 0,
      boost: 100,
      missiles: 5,
      lockTargetId: null,
      lockTimer: 0,
      lockCooldown: 0,
      overdrive: 0,
      fireCooldown: 0,
      activeWeapon: 'laser',
      evadeCooldown: 0,
      evadeTimer: 0,
      barrelRoll: 0,
      shieldFlash: 0,
      invuln: 0,
      pulseCooldown: 0,
      pulseTimer: 0,
    },
    enemies: [
      makeEnemy(1, 8, 'drone'),
      makeEnemy(2, 12, 'sentinel'),
      makeEnemy(3, 17, 'drone'),
      makeEnemy(4, 23, 'drone'),
      makeEnemy(5, 31, 'sentinel'),
    ],
    gates: mode === 'learn' ? [makeGate(0, 10), makeGate(1, 21)] : [],
    pickups: [makePickup(0, 14), makePickup(1, 28), makePickup(2, 39)],
    shots: [],
    enemyShots: [],
    missiles: [],
    hazards: [makeHazard(0, 18), makeHazard(1, 34)],
    flowRings: [makeFlowRing(0, 11), makeFlowRing(1, 27)],
    sparks: [],
    core: makeEnemy(99, 42, 'core'),
    corePhase: 1,
    gateStreak: 0,
    stats: {
      bestCombo: 0,
      sentinels: 0,
      perfectEvades: 0,
      pickups: 0,
      rings: 0,
      pulseClears: 0,
      gates: 0,
      hazards: 0,
      missileHits: 0,
      railHits: 0,
      railPierces: 0,
      rollShots: 0,
      lockHits: 0,
      phases: 0,
      targets: 0,
    },
    goals: DESCENT_GOALS
      .filter((goal) => mode === 'learn' || !goal.learnOnly)
      .map((goal) => ({ ...goal, complete: false })),
    result: null,
  };
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function spawnSpark(game, x, y, z, color, amount = 8) {
  for (let i = 0; i < amount; i += 1) {
    const angle = (Math.PI * 2 * i) / amount + game.elapsed;
    const speed = 0.35 + (i % 4) * 0.12;
    game.sparks.push({
      x,
      y,
      z,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      vz: -0.7 - (i % 3) * 0.12,
      life: 0.55,
      color,
    });
  }
}

function statValue(game, goal) {
  return game.stats?.[goal.type] || 0;
}

function completeGoal(game, goal) {
  if (goal.complete) return;
  goal.complete = true;
  game.score += goal.reward;
  game.player.shield = clamp(game.player.shield + 18, 0, 100);
  game.player.boost = clamp(game.player.boost + 18, 0, 100);
  game.player.overdrive = Math.max(game.player.overdrive, 2.2);
  game.message = `${goal.label} +${goal.reward}`;
  game.messageTimer = 1.2;
  spawnSpark(game, game.player.x, game.player.y, 1.3, '#a7f3d0', 22);
}

function evaluateGoals(game) {
  if (!game.goals) return;
  game.goals.forEach((goal) => {
    if (!goal.complete && statValue(game, goal) >= goal.target) completeGoal(game, goal);
  });
}

function availableDescentContracts(mode) {
  return DESCENT_CONTRACTS.filter((contract) => mode === 'learn' || !contract.learnOnly);
}

function descentContractProgress(game) {
  const contract = game.activeContract;
  if (!contract) return { value: 0, target: 0, ratio: 0 };
  const current = game.stats[contract.type] || 0;
  const value = clamp(current - contract.startValue, 0, contract.target);
  return {
    value,
    target: contract.target,
    ratio: contract.target > 0 ? clamp(value / contract.target, 0, 1) : 1,
  };
}

function applyDescentReward(game, reward = {}) {
  const player = game.player;
  game.score += reward.score || 0;
  player.shield = clamp(player.shield + (reward.shield || 0), 0, 100);
  player.boost = clamp(player.boost + (reward.boost || 0), 0, 100);
  player.heat = clamp(player.heat + (reward.heat || 0), 0, 100);
  player.missiles = clamp(player.missiles + (reward.missiles || 0), 0, 10);
  player.overdrive = Math.max(player.overdrive, reward.overdrive || 0);
  game.threat = clamp(game.threat + (reward.threat || 0), 0, 100);
}

function startDescentContract(game) {
  const contracts = availableDescentContracts(game.mode);
  if (contracts.length === 0) return;
  const contract = contracts[game.contractIndex % contracts.length];
  game.contractIndex += 1;
  game.activeContract = {
    ...contract,
    startValue: game.stats[contract.type] || 0,
  };
  game.contractTimer = contract.duration;
  game.message = `Einsatz: ${contract.label}`;
  game.messageTimer = 1.0;
  spawnSpark(game, game.player.x, game.player.y, 1.2, '#fef08a', 18);
}

function completeDescentContract(game) {
  const contract = game.activeContract;
  if (!contract) return;
  applyDescentReward(game, contract.reward);
  game.contractMedals += 1;
  game.activeContract = null;
  game.contractTimer = 0;
  game.contractCooldown = 1.0;
  game.message = `${contract.label} abgeschlossen`;
  game.messageTimer = 1.05;
  spawnSpark(game, game.player.x, game.player.y, 1.2, '#86efac', 24);
}

function failDescentContract(game) {
  const contract = game.activeContract;
  if (!contract) return;
  game.contractFails += 1;
  game.activeContract = null;
  game.contractTimer = 0;
  game.contractCooldown = 1.35;
  game.message = `${contract.label} verpasst`;
  game.messageTimer = 0.85;
  recordThreat(game, 6);
  spawnSpark(game, game.player.x, game.player.y, 1.1, '#fb7185', 12);
}

function updateDescentContract(game, dt) {
  if (game.phase !== 'run') return;
  if (!game.activeContract) {
    game.contractCooldown = Math.max(0, game.contractCooldown - dt);
    if (game.contractCooldown <= 0) startDescentContract(game);
    return;
  }

  game.contractTimer -= dt;
  const progress = descentContractProgress(game);
  if (progress.value >= progress.target) {
    completeDescentContract(game);
    return;
  }
  if (game.contractTimer <= 0) failDescentContract(game);
}

function firePlayer(game) {
  const player = game.player;
  const weapon = WEAPONS[player.activeWeapon] || WEAPONS.laser;
  if (player.fireCooldown > 0 || player.heat > 94) return;
  const rollShot = player.evadeTimer > 0 || Math.abs(player.barrelRoll) > 0.28;
  const lockedShot = player.lockTimer > 0 && Boolean(player.lockTargetId);
  player.fireCooldown = weapon.cooldown * (player.overdrive > 0 ? 0.72 : 1);
  player.heat = clamp(player.heat + weapon.heat * (player.overdrive > 0 ? 0.58 : 1), 0, 100);
  const speed = weapon.speed * (player.overdrive > 0 ? 1.18 : 1);
  weapon.pattern.forEach((muzzle) => {
    game.shots.push({
      x: player.x + muzzle.x,
      y: player.y + muzzle.y,
      z: 1.1,
      vx: muzzle.vx,
      vy: 0,
      vz: speed,
      life: player.activeWeapon === 'rail' ? 1.15 : 0.8,
      damage: weapon.damage,
      color: weapon.color,
      weapon: player.activeWeapon,
      rollShot,
      lockedShot,
      hitIds: [],
    });
  });
}

function targetPool(game) {
  const targets = game.enemies.filter((enemy) => enemy.lockable !== false && enemy.z > 2);
  if (game.distance > 780 && game.core.hp > 0) targets.push(game.core);
  return targets;
}

function findLockTarget(game) {
  const player = game.player;
  return targetPool(game)
    .map((target) => ({
      target,
      score: Math.hypot(target.x - player.x, target.y - player.y) + Math.abs(target.z - 12) * 0.03,
    }))
    .sort((a, b) => a.score - b.score)[0]?.target || null;
}

function recordThreat(game, amount) {
  game.threat = clamp(game.threat + amount, 0, 100);
}

function fireMissile(game) {
  const player = game.player;
  if (player.missiles <= 0 || player.lockCooldown > 0) return;
  const target = targetPool(game).find((candidate) => candidate.id === player.lockTargetId) || findLockTarget(game);
  if (!target) {
    game.message = 'Kein Ziel';
    game.messageTimer = 0.45;
    return;
  }
  const hadFullLock = player.lockTimer > 0 && target.id === player.lockTargetId;
  player.missiles -= 1;
  player.lockCooldown = 0.45;
  player.lockTargetId = target.id;
  player.lockTimer = 1.2;
  const lockQuality = hadFullLock ? 1 : 0.55;
  game.missiles.push({
    x: player.x,
    y: player.y + 0.05,
    z: 1.05,
    vx: 0,
    vy: 0,
    vz: 19,
    life: 2.2,
    targetId: target.id,
    weapon: 'missile',
    lockBonus: lockQuality >= 1,
    lockQuality,
    trail: [],
  });
  game.message = 'Rakete gestartet';
  game.messageTimer = 0.45;
}

function cycleWeapon(game) {
  const currentIndex = WEAPON_ORDER.indexOf(game.player.activeWeapon);
  const nextWeapon = WEAPON_ORDER[(currentIndex + 1) % WEAPON_ORDER.length];
  selectWeapon(game, nextWeapon);
}

function selectWeapon(game, nextWeapon) {
  if (!WEAPONS[nextWeapon]) return;
  const player = game.player;
  player.activeWeapon = nextWeapon;
  player.fireCooldown = Math.max(player.fireCooldown, 0.12);
  game.message = WEAPONS[nextWeapon].label;
  game.messageTimer = 0.65;
}

function triggerEvade(game, mx, my) {
  const player = game.player;
  if (player.evadeCooldown > 0 || player.boost < 16) return;
  const directionX = mx || (player.vx >= 0 ? 1 : -1);
  const directionY = my || 0;
  const len = Math.hypot(directionX, directionY) || 1;
  player.vx += (directionX / len) * 3.4;
  player.vy += (directionY / len) * 2.6;
  player.boost = clamp(player.boost - 16, 0, 100);
  player.evadeCooldown = 0.82;
  player.evadeTimer = 0.26;
  player.barrelRoll = directionX >= 0 ? 1 : -1;
  player.invuln = Math.max(player.invuln, 0.26);
  game.message = 'Ausweichrolle';
  game.messageTimer = 0.42;
  spawnSpark(game, player.x, player.y, 1.1, '#93c5fd', 12);
}

function triggerShieldPulse(game) {
  const player = game.player;
  if (player.pulseCooldown > 0 || player.shield < 18) return;
  player.shield = clamp(player.shield - 18, 0, 100);
  player.pulseCooldown = 1.55;
  player.pulseTimer = 0.32;
  player.invuln = Math.max(player.invuln, 0.18);
  let cleared = 0;
  game.enemyShots.forEach((shot) => {
    if (shot.z > 11 || distance2(shot, player) > 0.46) return;
    shot.life = 0;
    cleared += 1;
    spawnSpark(game, shot.x, shot.y, shot.z, '#67e8f9', 6);
  });
  game.enemyShots = game.enemyShots.filter((shot) => shot.life > 0);
  if (cleared > 0) {
    game.stats.pulseClears += cleared;
    game.score += 120 * cleared + game.combo * 18;
    game.player.heat = Math.max(0, game.player.heat - 12 * cleared);
    game.message = `Shield-Pulse x${cleared}`;
  } else {
    game.message = 'Shield-Pulse';
  }
  game.messageTimer = 0.65;
  spawnSpark(game, player.x, player.y, 1.1, '#67e8f9', 18);
  evaluateGoals(game);
}

function damagePlayer(game, amount) {
  const player = game.player;
  if (player.invuln > 0) return;
  const shieldDamage = Math.min(player.shield, amount);
  player.shield -= shieldDamage;
  player.hp = clamp(player.hp - (amount - shieldDamage) * 1.35, 0, 100);
  player.shieldFlash = 0.35;
  player.invuln = 0.14;
  game.combo = 0;
  recordThreat(game, amount * 0.8);
  game.message = player.shield > 0 ? 'Schild getroffen' : 'Huellenschaden';
  game.messageTimer = 0.65;
  spawnSpark(game, player.x, player.y, 1.2, '#fb7185', 10);
}

function rewardPerfectEvade(game, threat) {
  if (game.player.evadeTimer <= 0 || threat.evaded) return;
  threat.evaded = true;
  game.stats.perfectEvades += 1;
  game.score += 180 + game.stats.perfectEvades * 20;
  game.player.boost = clamp(game.player.boost + 8, 0, 100);
  game.message = 'Perfekte Rolle';
  game.messageTimer = 0.6;
  spawnSpark(game, game.player.x, game.player.y, 1.2, '#bfdbfe', 14);
  evaluateGoals(game);
}

function updatePlayer(game, input, dt) {
  const player = game.player;
  const mx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const my = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  const boost = input.boost && player.boost > 0;
  if (input.evade) triggerEvade(game, mx, my);
  const speed = boost ? 4.25 : 2.65;
  player.vx += mx * speed * dt;
  player.vy += my * speed * dt;
  player.vx *= Math.pow(0.82, dt * 60);
  player.vy *= Math.pow(0.82, dt * 60);
  player.x = clamp(player.x + player.vx * dt, -0.82, 0.82);
  player.y = clamp(player.y + player.vy * dt, -0.62, 0.62);
  player.fireCooldown = Math.max(0, player.fireCooldown - dt);
  player.lockCooldown = Math.max(0, player.lockCooldown - dt);
  player.lockTimer = Math.max(0, player.lockTimer - dt);
  player.overdrive = Math.max(0, player.overdrive - dt);
  player.evadeCooldown = Math.max(0, player.evadeCooldown - dt);
  player.evadeTimer = Math.max(0, player.evadeTimer - dt);
  player.pulseCooldown = Math.max(0, player.pulseCooldown - dt);
  player.pulseTimer = Math.max(0, player.pulseTimer - dt);
  player.barrelRoll *= Math.pow(0.86, dt * 60);
  player.invuln = Math.max(0, player.invuln - dt);
  player.shieldFlash = Math.max(0, player.shieldFlash - dt);
  player.heat = clamp(player.heat - (input.fire ? 8 : player.overdrive > 0 ? 36 : 24) * dt, 0, 100);
  if (input.fire && player.heat > 94 && game.messageTimer <= 0.1) {
    recordThreat(game, 2 * dt);
    game.message = 'Waffe ueberhitzt';
    game.messageTimer = 0.28;
  }
  player.shield = clamp(player.shield + 7 * dt, 0, 100);
  player.boost = clamp(player.boost + (boost ? -30 : 13) * dt, 0, 100);
  if (input.lock) {
    const target = findLockTarget(game);
    if (target) {
      player.lockTargetId = target.id;
      player.lockTimer = 1.25;
    }
  }
  if (input.fire) firePlayer(game);
  if (input.missile) fireMissile(game);
  if (input.pulse) triggerShieldPulse(game);
}

function updateEnemies(game, dt, speed) {
  const player = game.player;
  const threatBoost = 1 + game.threat / 260;
  game.enemies.forEach((enemy) => {
    enemy.z -= speed * dt;
    enemy.wobble += dt;
    enemy.x += Math.sin(enemy.wobble * 1.5) * enemy.vx * dt;
    enemy.y += Math.cos(enemy.wobble * 1.3) * enemy.vy * dt;
    enemy.x = clamp(enemy.x, -0.82, 0.82);
    enemy.y = clamp(enemy.y, -0.62, 0.62);
    enemy.shotTimer -= dt;
    if (enemy.type !== 'mine' && enemy.z < 18 && enemy.z > 3 && enemy.shotTimer <= 0) {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const len = Math.hypot(dx, dy) || 1;
      const burst = enemy.type === 'ace' ? 2 : 1;
      for (let shotIndex = 0; shotIndex < burst; shotIndex += 1) {
        const spread = (shotIndex - (burst - 1) / 2) * 0.16;
        const sx = dx / len + spread;
        const sy = dy / len - spread;
        game.enemyShots.push({
          x: enemy.x,
          y: enemy.y,
          z: enemy.z,
          vx: sx * (enemy.type === 'ace' ? 1.35 : 1.1),
          vy: sy * (enemy.type === 'ace' ? 1.35 : 1.1),
          vz: enemy.type === 'ace' ? -12.5 : -10.5,
          life: 2,
        });
      }
      enemy.shotTimer = (enemy.type === 'ace' ? 0.85 : enemy.type === 'sentinel' ? 1.1 : 1.6) / threatBoost;
    }
    if (enemy.z < 0.85 && distance2(enemy, player) < 0.28) {
      if (player.evadeTimer > 0 || player.invuln > 0) rewardPerfectEvade(game, enemy);
      else damagePlayer(game, enemy.type === 'mine' ? 30 : enemy.type === 'sentinel' ? 24 : 16);
      enemy.hp = 0;
    }
  });
  game.enemies = game.enemies.filter((enemy) => enemy.hp > 0 && enemy.z > 0.35);

  while (game.enemies.length < (game.threat > 70 ? 7 : game.threat > 42 ? 6 : 5) && game.distance < 800) {
    const index = game.nextEnemyIndex;
    game.nextEnemyIndex += 1;
    const type = index % 9 === 0 ? 'ace' : index % 6 === 0 ? 'mine' : index % 4 === 0 ? 'sentinel' : 'drone';
    game.enemies.push(makeEnemy(index, 25 + (index % 5) * 4, type));
  }
}

function updateCore(game, dt, speed) {
  const core = game.core;
  if (game.distance < 780 || core.hp <= 0) return;
  if (core.hp < core.maxHp * 0.45 && game.corePhase === 1) {
    game.corePhase = 2;
    game.stats.phases += 1;
    core.shotTimer = 0.2;
    game.message = 'Kernphase 2';
    game.messageTimer = 1.1;
    spawnSpark(game, core.x, core.y, core.z, '#fb7185', 28);
    evaluateGoals(game);
  }
  core.z = Math.max(5.2, core.z - speed * dt * 0.35);
  core.shotTimer -= dt;
  if (core.shotTimer <= 0) {
    const count = game.corePhase === 2 ? 8 : 5;
    for (let i = 0; i < count; i += 1) {
      const angle = game.elapsed * (game.corePhase === 2 ? 2.3 : 1.7) + i * ((Math.PI * 2) / count);
      game.enemyShots.push({
        x: core.x + Math.cos(angle) * 0.22,
        y: core.y + Math.sin(angle) * 0.22,
        z: core.z,
        vx: Math.cos(angle) * (game.corePhase === 2 ? 1.15 : 0.95),
        vy: Math.sin(angle) * (game.corePhase === 2 ? 1.15 : 0.95),
        vz: game.corePhase === 2 ? -10.8 : -9,
        life: 2.3,
      });
    }
    if (game.corePhase === 2) {
      const mine = makeEnemy(game.nextEnemyIndex, core.z + 4, 'mine');
      game.nextEnemyIndex += 1;
      mine.x = clamp(core.x + Math.sin(game.elapsed * 3) * 0.55, -0.78, 0.78);
      mine.y = clamp(core.y + Math.cos(game.elapsed * 2.4) * 0.46, -0.6, 0.6);
      game.enemies.push(mine);
    }
    core.shotTimer = game.corePhase === 2 ? 0.62 : 0.9;
  }
}

function hitTarget(game, target, damage, shot) {
  const wasAlive = target.hp > 0;
  target.hp -= damage;
  if (shot.weapon === 'rail') {
    shot.hitIds = Array.from(new Set([...(shot.hitIds || []), target.id]));
    if (shot.hitIds.length > 1) game.stats.railPierces += 1;
    shot.damage = Math.max(12, (shot.damage || damage) * 0.7);
    if (shot.hitIds.length >= 3 || target.type === 'core') shot.life = 0;
  } else {
    shot.life = 0;
  }
  game.combo += 1;
  game.stats.bestCombo = Math.max(game.stats.bestCombo, game.combo);
  game.score += Math.round(damage * 20 + game.combo * 12);
  if (shot.weapon === 'missile') game.stats.missileHits += 1;
  if (shot.weapon === 'rail') game.stats.railHits += 1;
  if (shot.weapon === 'missile' && shot.lockBonus) {
    game.stats.lockHits += 1;
    game.score += Math.round(160 + (shot.lockQuality || 1) * 80);
    game.player.overdrive = Math.max(game.player.overdrive, 1.2);
  }
  if (shot.rollShot) {
    game.stats.rollShots += 1;
    game.score += 120 + game.stats.rollShots * 12;
    game.player.boost = clamp(game.player.boost + 5, 0, 100);
    game.player.heat = Math.max(0, game.player.heat - 5);
  }
  recordThreat(game, target.type === 'core' ? 1.8 : 0.6);
  game.message = shot.rollShot
    ? `Roll-Shot x${game.stats.rollShots}`
    : shot.weapon === 'missile' && shot.lockBonus
      ? `Lock-Treffer x${game.stats.lockHits}`
      : game.combo > 2 ? `${game.combo} Treffer-Kette` : 'Treffer';
  game.messageTimer = 0.55;
  spawnSpark(game, target.x, target.y, target.z, target.type === 'core' ? '#facc15' : '#67e8f9', 12);
  if (wasAlive && target.hp <= 0 && target.type === 'sentinel') {
    game.stats.sentinels += 1;
  }
  if (wasAlive && target.hp <= 0 && target.type !== 'core') {
    game.stats.targets += 1;
  }
  evaluateGoals(game);
}

function updateMissiles(game, dt) {
  game.missiles.forEach((missile) => {
    let target = targetPool(game).find((candidate) => candidate.id === missile.targetId);
    if (!target) target = findLockTarget(game);
    if (target) {
      missile.targetId = target.id;
      const dx = target.x - missile.x;
      const dy = target.y - missile.y;
      const dz = target.z - missile.z;
      const len = Math.hypot(dx, dy, dz) || 1;
      missile.vx += (dx / len) * 9.8 * dt;
      missile.vy += (dy / len) * 9.8 * dt;
      missile.vz += (dz / len) * 11.4 * dt;
      if (Math.abs(target.z - missile.z) < 0.9 && distance2(missile, target) < (target.type === 'core' ? 0.45 : 0.32)) {
        hitTarget(game, target, target.type === 'core' ? 32 : 42, missile);
        spawnSpark(game, target.x, target.y, target.z, '#facc15', 20);
      }
    }
    missile.trail.push({ x: missile.x, y: missile.y, z: missile.z, life: 0.35 });
    if (missile.trail.length > 8) missile.trail.shift();
    missile.x += missile.vx * dt;
    missile.y += missile.vy * dt;
    missile.z += missile.vz * dt;
    missile.life -= dt;
  });
  game.missiles = game.missiles.filter((missile) => missile.life > 0 && missile.z > 0.2 && missile.z < 48);
}

function updateShots(game, dt) {
  game.shots.forEach((shot) => {
    shot.z += shot.vz * dt;
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.life -= dt;
    game.enemies.forEach((enemy) => {
      if (shot.life <= 0 || Math.abs(shot.z - enemy.z) > 0.65) return;
      if (shot.hitIds?.includes(enemy.id)) return;
      if (distance2(shot, enemy) < (enemy.type === 'sentinel' ? 0.25 : 0.2)) {
        hitTarget(game, enemy, shot.damage || 12, shot);
      }
    });
    if (
      game.distance > 780
      && game.core.hp > 0
      && !shot.hitIds?.includes(game.core.id)
      && Math.abs(shot.z - game.core.z) < 0.9
      && distance2(shot, game.core) < 0.36
    ) {
      hitTarget(game, game.core, Math.max(10, (shot.damage || 10) * 0.82), shot);
    }
  });
  game.shots = game.shots.filter((shot) => shot.life > 0 && shot.z < 44);

  game.enemyShots.forEach((shot) => {
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.z += shot.vz * dt;
    shot.life -= dt;
    if (shot.z < 1.1 && shot.life > 0 && distance2(shot, game.player) < 0.24) {
      if (game.player.evadeTimer > 0 || game.player.invuln > 0) rewardPerfectEvade(game, shot);
      else damagePlayer(game, 14);
      shot.life = 0;
    }
  });
  game.enemyShots = game.enemyShots.filter((shot) => shot.life > 0 && shot.z > 0.2);
}

function updateHazards(game, dt, speed) {
  game.hazards.forEach((hazard) => {
    hazard.z -= speed * dt;
    hazard.gapAngle = normalizeAngle(hazard.gapAngle + hazard.spin * dt);
    hazard.pulse += dt * 4;
    if (hazard.z < 1.35 && !hazard.resolved) {
      hazard.resolved = true;
      const safeX = Math.cos(hazard.gapAngle) * hazard.radiusX;
      const safeY = Math.sin(hazard.gapAngle) * hazard.radiusY;
      const laneDistance = Math.hypot(game.player.x - safeX, game.player.y - safeY);
      const angularSafe = angleDistance(Math.atan2(game.player.y, game.player.x), hazard.gapAngle) < hazard.gapWidth * 0.46
        && Math.hypot(game.player.x, game.player.y) > 0.28;
      if (laneDistance < 0.34 || angularSafe) {
        game.stats.hazards += 1;
        game.score += 210 + game.stats.hazards * 18;
        game.player.boost = clamp(game.player.boost + 10, 0, 100);
        game.player.heat = Math.max(0, game.player.heat - 10);
        game.message = 'Rift-Luecke sauber';
        game.messageTimer = 0.62;
        spawnSpark(game, game.player.x, game.player.y, 1.2, '#67e8f9', 16);
        evaluateGoals(game);
      } else if (game.player.evadeTimer > 0 || game.player.invuln > 0) {
        rewardPerfectEvade(game, hazard);
      } else {
        damagePlayer(game, 20);
        game.message = 'Rift-Barriere';
        game.messageTimer = 0.75;
      }
    }
  });
  game.hazards = game.hazards.filter((hazard) => hazard.z > 0.18 && !hazard.resolved);
  while (game.hazards.length < 2 && game.distance < 760) {
    const index = game.nextHazardIndex;
    game.nextHazardIndex += 1;
    game.hazards.push(makeHazard(index, 26 + (index % 4) * 6));
  }
}

function updateFlowRings(game, dt, speed) {
  game.flowRings.forEach((ring) => {
    ring.z -= speed * dt;
    ring.pulse += dt * 4;
    if (ring.z < 1.38 && !ring.resolved) {
      ring.resolved = true;
      const d = distance2(ring, game.player);
      const clean = d < ring.radius;
      const rollBonus = !ring.rollBonus || game.player.evadeTimer > 0 || game.player.invuln > 0;
      if (clean && rollBonus) {
        game.stats.rings += 1;
        game.combo += 1;
        game.stats.bestCombo = Math.max(game.stats.bestCombo, game.combo);
        game.score += 230 + game.stats.rings * 24 + (ring.rollBonus ? 120 : 0);
        game.player.boost = clamp(game.player.boost + 12, 0, 100);
        game.player.overdrive = Math.max(game.player.overdrive, ring.rollBonus ? 1.6 : 0.9);
        game.threat = clamp(game.threat - 4, 0, 100);
        game.message = ring.rollBonus ? 'Roll-Flow!' : 'Flow-Ring';
        game.messageTimer = 0.62;
        spawnSpark(game, ring.x, ring.y, 1.2, ring.rollBonus ? '#c084fc' : '#5eead4', 18);
        evaluateGoals(game);
      } else if (!clean) {
        recordThreat(game, 5);
        game.message = 'Flow-Ring verpasst';
        game.messageTimer = 0.45;
      } else {
        game.player.boost = Math.max(0, game.player.boost - 10);
        recordThreat(game, 7);
        game.message = 'Roll-Ring braucht Ausweichrolle';
        game.messageTimer = 0.72;
      }
    }
  });
  game.flowRings = game.flowRings.filter((ring) => ring.z > 0.2 && !ring.resolved);
  while (game.flowRings.length < 2 && game.distance < 760) {
    const index = game.nextFlowRingIndex;
    game.nextFlowRingIndex += 1;
    game.flowRings.push(makeFlowRing(index, 20 + (index % 4) * 6));
  }
}

function updateGates(game, dt, speed) {
  if (game.mode !== 'learn') return;
  const player = game.player;
  game.gates.forEach((gate) => {
    gate.z -= speed * dt;
    if (gate.z < 1.5 && !gate.resolved) {
      const best = gate.options.reduce((closest, option) => {
        const d = Math.hypot(player.x - option.x, player.y - option.y);
        return d < closest.distance ? { option, distance: d } : closest;
      }, { option: gate.options[0], distance: 999 });
      gate.resolved = true;
      if (best.distance < 0.42 && best.option.correct) {
        game.gateStreak += 1;
        game.stats.gates += 1;
        game.score += 360 + game.gateStreak * 80;
        game.combo += 2;
        game.stats.bestCombo = Math.max(game.stats.bestCombo, game.combo);
        player.shield = clamp(player.shield + 28, 0, 100);
        player.heat = Math.max(0, player.heat - 36);
        player.missiles = Math.min(9, player.missiles + (game.gateStreak % 2 === 0 ? 2 : 1));
        player.overdrive = Math.max(player.overdrive, 2.8 + game.gateStreak * 0.2);
        game.message = `${gate.prompt.subject}: ${gate.prompt.word} -> ${gate.prompt.answer}`;
        game.messageTimer = 1.15;
        spawnSpark(game, best.option.x, best.option.y, 1.4, '#5eead4', 18);
        evaluateGoals(game);
      } else {
        game.gateStreak = 0;
        damagePlayer(game, best.distance < 0.42 ? 12 : 18);
        const mine = makeEnemy(game.nextEnemyIndex, 8.5, 'mine');
        game.nextEnemyIndex += 1;
        mine.x = best.option.x;
        mine.y = best.option.y + 0.04;
        game.enemies.push(mine);
        recordThreat(game, 12);
        game.message = best.distance < 0.42 ? `${gate.prompt.word} ist nicht ${best.option.label}` : 'Gate verfehlt';
        game.messageTimer = 1.1;
      }
    }
  });
  game.gates = game.gates.filter((gate) => gate.z > 0.25 && !gate.resolved);
  while (game.gates.length < 2 && game.distance < 760) {
    const index = game.nextGateIndex;
    game.nextGateIndex += 1;
    game.gates.push(makeGate(index, 22 + (index % 2) * 9));
  }
}

function applyPickup(game, pickup) {
  const player = game.player;
  if (pickup.type === 'shield') {
    player.shield = clamp(player.shield + 34, 0, 100);
    game.message = 'Schildkapsel';
  } else if (pickup.type === 'coolant') {
    player.heat = clamp(player.heat - 52, 0, 100);
    game.message = 'Kuehlung';
  } else if (pickup.type === 'missile') {
    player.missiles = Math.min(10, player.missiles + 2);
    game.message = 'Raketen +2';
  } else {
    player.overdrive = Math.max(player.overdrive, 3.4);
    game.message = 'Overdrive';
  }
  game.stats.pickups += 1;
  game.score += 160 + game.stats.pickups * 12;
  game.messageTimer = 0.82;
  spawnSpark(game, pickup.x, pickup.y, 1.4, '#86efac', 18);
  evaluateGoals(game);
}

function updatePickups(game, dt, speed) {
  game.pickups.forEach((pickup) => {
    pickup.z -= speed * dt;
    pickup.pulse += dt * 4;
    if (pickup.z < 1.35 && !pickup.collected && distance2(pickup, game.player) < 0.32) {
      pickup.collected = true;
      applyPickup(game, pickup);
    }
  });
  game.pickups = game.pickups.filter((pickup) => pickup.z > 0.25 && !pickup.collected);
  while (game.pickups.length < 3 && game.distance < 760) {
    const index = game.nextPickupIndex;
    game.nextPickupIndex += 1;
    game.pickups.push(makePickup(index, 24 + (index % 4) * 5.5));
  }
}

function updateSparks(game, dt) {
  game.sparks = game.sparks
    .map((spark) => ({
      ...spark,
      x: spark.x + spark.vx * dt,
      y: spark.y + spark.vy * dt,
      z: spark.z + spark.vz * dt,
      life: spark.life - dt,
    }))
    .filter((spark) => spark.life > 0 && spark.z > 0.1);
}

function updateGame(game, input, dt, onFinish) {
  if (game.phase !== 'run') return;
  const speed = input.boost && game.player.boost > 0 ? 12.5 : 8.2;
  game.elapsed += dt;
  game.distance += speed * dt;
  game.sector = Math.max(1, Math.floor(game.distance / 180) + 1);
  game.tunnelRotation += (0.25 + Math.abs(game.player.vx) * 0.2) * dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.threat = clamp(game.threat + (game.distance > 620 ? 4.5 : 1.8) * dt - (game.combo > 4 ? 2.2 * dt : 0), 12, 100);

  updatePlayer(game, input, dt);
  updateEnemies(game, dt, speed);
  updateCore(game, dt, speed);
  updateShots(game, dt);
  updateMissiles(game, dt);
  updateFlowRings(game, dt, speed);
  updateHazards(game, dt, speed);
  updateGates(game, dt, speed);
  updatePickups(game, dt, speed);
  updateDescentContract(game, dt);
  updateSparks(game, dt);

  if (game.player.hp <= 0 || game.core.hp <= 0) {
    const won = game.core.hp <= 0;
    game.phase = 'result';
    const result = won ? 'Tunnelkern zerstoert' : 'Schiff verloren';
    game.result = {
      result,
      score: game.score + (won ? 1500 : 0),
      distance: Math.round(game.distance),
    };
    onFinish(game.result);
  }
}

function drawTunnel(ctx, game) {
  const gradient = ctx.createRadialGradient(CENTER_X, CENTER_Y, 20, CENTER_X, CENTER_Y, 620);
  gradient.addColorStop(0, '#111827');
  gradient.addColorStop(0.7, '#07111f');
  gradient.addColorStop(1, '#020617');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.translate(CENTER_X, CENTER_Y);
  ctx.rotate(game.tunnelRotation);
  for (let ring = 2; ring < 28; ring += 1) {
    const z = ring * 1.45 + (game.distance % 1.45);
    const scale = FOV / z;
    const radius = TUNNEL_RADIUS * scale * 0.08;
    ctx.strokeStyle = ring % 2 === 0 ? 'rgba(56,189,248,.18)' : 'rgba(168,85,247,.14)';
    ctx.lineWidth = Math.max(1, 7 * scale * 0.02);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let spoke = 0; spoke < 16; spoke += 1) {
    const angle = (Math.PI * 2 * spoke) / 16;
    ctx.strokeStyle = spoke % 2 === 0 ? 'rgba(148,163,184,.16)' : 'rgba(56,189,248,.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * 44, Math.sin(angle) * 44);
    ctx.lineTo(Math.cos(angle) * 620, Math.sin(angle) * 620);
    ctx.stroke();
  }
  ctx.restore();
}

function drawHud(ctx, game) {
  const player = game.player;
  const weapon = WEAPONS[player.activeWeapon] || WEAPONS.laser;
  const contractProgress = descentContractProgress(game);
  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, 34, 26, 408, 152, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 24px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Learncade Descent Pro' : 'Faska Descent Pro', 56, 58);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '800 14px Outfit, sans-serif';
  ctx.fillText(`Sektor ${game.sector} · Distanz ${Math.round(game.distance)}`, 56, 84);
  drawMeter(ctx, 56, 104, 146, 12, player.hp, '#22c55e', 'HULL');
  drawMeter(ctx, 224, 104, 146, 12, player.shield, '#38bdf8', 'SHIELD');
  drawMeter(ctx, 56, 132, 146, 10, player.heat, player.heat > 82 ? '#ef4444' : '#f97316', 'HEAT');
  drawMeter(ctx, 224, 132, 146, 10, player.boost, '#facc15', 'BOOST');
  drawMeter(ctx, 56, 166, 146, 8, game.threat, game.threat > 70 ? '#ef4444' : '#c084fc', 'THREAT');
  ctx.fillStyle = weapon.color;
  ctx.font = '900 13px Outfit, sans-serif';
  ctx.fillText(`${weapon.short} · Rolle ${player.evadeCooldown > 0 ? player.evadeCooldown.toFixed(1) : 'bereit'} · Pulse ${player.pulseCooldown > 0 ? player.pulseCooldown.toFixed(1) : 'bereit'}`, 224, 174);

  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, WIDTH - 408, 26, 374, 426, 18);
  ctx.fill();
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 24px Outfit, sans-serif';
  ctx.fillText(`Score ${game.score}`, WIDTH - 56, 60);
  ctx.fillStyle = '#67e8f9';
  ctx.font = '900 20px Outfit, sans-serif';
  ctx.fillText(`Combo x${Math.max(1, game.combo)}`, WIDTH - 56, 90);
  const lockedTarget = targetPool(game).find((candidate) => candidate.id === player.lockTargetId);
  const lockText = player.lockTimer > 0 && lockedTarget ? `LOCK ${lockedTarget.type.toUpperCase()}` : 'LOCK BEREIT';
  ctx.fillStyle = player.lockTimer > 0 && lockedTarget ? '#facc15' : '#cbd5e1';
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.fillText(`Raketen ${player.missiles} · ${lockText}`, WIDTH - 56, 118);
  ctx.fillStyle = game.threat > 70 ? '#fca5a5' : '#c4b5fd';
  ctx.fillText(`Threat ${Math.round(game.threat)}% · Rifts ${game.stats.hazards} · Flow ${game.stats.rings}`, WIDTH - 56, 144);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillText(`Rail ${game.stats.railHits} · Roll-Shots ${game.stats.rollShots} · Lock ${game.stats.lockHits}`, WIDTH - 56, 166);
  if (player.overdrive > 0) {
    ctx.fillStyle = '#5eead4';
    ctx.fillText(`OVERDRIVE ${player.overdrive.toFixed(1)}s`, WIDTH - 56, 188);
  }
  let missionY = 210;
  if (game.distance > 760) {
    drawMeter(ctx, WIDTH - 374, missionY, 318, 10, game.core.hp, game.core.maxHp, '#ef4444', 'CORE');
    missionY += 28;
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fef08a';
  ctx.font = '900 11px Outfit, sans-serif';
  ctx.fillText(`EINSATZ ${game.contractMedals} OK · ${game.contractFails} FAIL`, WIDTH - 374, missionY);
  ctx.fillStyle = game.activeContract ? '#f8fafc' : '#94a3b8';
  ctx.font = '900 13px Outfit, sans-serif';
  drawFittedText(ctx, game.activeContract ? game.activeContract.label : `naechster Einsatz ${game.contractCooldown.toFixed(1)}s`, WIDTH - 374, missionY + 22, 306, 13, 9);
  ctx.fillStyle = 'rgba(148,163,184,.22)';
  drawRoundedRect(ctx, WIDTH - 374, missionY + 36, 318, 9, 5);
  ctx.fill();
  ctx.fillStyle = game.activeContract ? '#86efac' : '#475569';
  drawRoundedRect(ctx, WIDTH - 374, missionY + 36, 318 * contractProgress.ratio, 9, 5);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 11px Outfit, sans-serif';
  ctx.fillText(
    game.activeContract ? `${contractProgress.value}/${contractProgress.target} · ${Math.ceil(game.contractTimer)}s` : 'bereitmachen',
    WIDTH - 374,
    missionY + 64,
  );

  ctx.fillStyle = '#94a3b8';
  ctx.font = '900 11px Outfit, sans-serif';
  ctx.fillText('MEISTERUNGEN', WIDTH - 374, missionY + 88);
  game.goals.slice(0, 5).forEach((goal, index) => {
    const y = missionY + 108 + index * 18;
    const value = Math.min(goal.target, statValue(game, goal));
    ctx.fillStyle = goal.complete ? '#86efac' : '#cbd5e1';
    ctx.font = '800 12px Outfit, sans-serif';
    ctx.fillText(`${goal.complete ? 'OK' : value + '/' + goal.target} ${goal.label}`, WIDTH - 374, y);
  });
  if (game.distance > 760) {
    ctx.textAlign = 'right';
  }

  ctx.textAlign = 'center';
  ctx.strokeStyle = game.player.heat > 90 ? '#ef4444' : '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(CENTER_X - 18, CENTER_Y);
  ctx.lineTo(CENTER_X - 6, CENTER_Y);
  ctx.moveTo(CENTER_X + 6, CENTER_Y);
  ctx.lineTo(CENTER_X + 18, CENTER_Y);
  ctx.moveTo(CENTER_X, CENTER_Y - 18);
  ctx.lineTo(CENTER_X, CENTER_Y - 6);
  ctx.moveTo(CENTER_X, CENTER_Y + 6);
  ctx.lineTo(CENTER_X, CENTER_Y + 18);
  ctx.stroke();

  if (game.mode === 'learn') {
    const gate = game.gates.find((candidate) => candidate.z > 4);
    if (gate) {
      const promptY = 88;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(2,6,23,.74)';
      drawRoundedRect(ctx, CENTER_X - 330, promptY, 660, 76, 18);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '900 20px Outfit, sans-serif';
      drawFittedText(ctx, gate.prompt.sentence, CENTER_X, promptY + 26, 590, 20, 12);
      ctx.fillStyle = '#67e8f9';
      drawFittedText(ctx, gate.prompt.prompt, CENTER_X, promptY + 50, 590, 15, 11, 800);
      ctx.fillStyle = '#fef3c7';
      drawFittedText(ctx, `${gate.prompt.subject}: ${gate.prompt.word}`, CENTER_X, promptY + 68, 590, 13, 10, 800);
    }
  }

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.68)';
    drawRoundedRect(ctx, CENTER_X - 230, HEIGHT - 118, 460, 54, 18);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 25px Outfit, sans-serif';
    ctx.fillText(game.message, CENTER_X, HEIGHT - 83);
  }
  ctx.restore();
}

function drawMeter(ctx, x, y, w, h, value, maxOrColor, maybeColor, label) {
  const max = typeof maxOrColor === 'number' ? maxOrColor : 100;
  const color = typeof maxOrColor === 'number' ? maybeColor : maxOrColor;
  const meterLabel = typeof maxOrColor === 'number' ? label : maybeColor;
  ctx.fillStyle = 'rgba(255,255,255,.14)';
  drawRoundedRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.fillStyle = color;
  drawRoundedRect(ctx, x, y, w * clamp(value / max, 0, 1), h, h / 2);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '800 10px Outfit, sans-serif';
  ctx.fillText(meterLabel, x, y - 4);
}

function drawFittedText(ctx, text, x, y, maxWidth, maxSize = 16, minSize = 10, weight = 900) {
  let size = maxSize;
  do {
    ctx.font = `${weight} ${size}px Outfit, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth || size <= minSize) break;
    size -= 1;
  } while (size >= minSize);
  ctx.fillText(text, x, y);
}

function drawEnemy(ctx, enemy, game) {
  const p = projectPoint(enemy.x, enemy.y, enemy.z);
  const rawSize = (enemy.type === 'core' ? 132 : enemy.type === 'sentinel' ? 62 : 44) * p.scale * 0.08;
  const size = clamp(rawSize, enemy.type === 'core' ? 38 : 14, enemy.type === 'core' ? 128 : enemy.type === 'sentinel' ? 72 : 54);
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.globalAlpha = clamp(1.2 - enemy.z / 46, 0.35, 1);
  ctx.shadowColor = enemy.type === 'core' ? '#facc15' : enemy.type === 'sentinel' ? '#fb7185' : '#38bdf8';
  ctx.shadowBlur = 20;
  ctx.fillStyle = enemy.type === 'core' ? '#7c2d12' : enemy.type === 'sentinel' ? '#991b1b' : '#0f766e';
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const angle = game.elapsed * 1.8 + (Math.PI * 2 * i) / 6;
    const r = size * (i % 2 === 0 ? 1 : 0.68);
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = Math.max(1, size * 0.08);
  ctx.stroke();
  if (enemy.type !== 'drone') {
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.24, 0, Math.PI * 2);
    ctx.fill();
  }
  if (game.player.lockTimer > 0 && game.player.lockTargetId === enemy.id) {
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 24;
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = Math.max(3, size * 0.08);
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.72);
    ctx.lineTo(size * 0.22, -size * 1.38);
    ctx.lineTo(-size * 0.22, -size * 1.38);
    ctx.closePath();
    ctx.fillStyle = '#facc15';
    ctx.fill();
  }
  ctx.restore();
}

function drawHazard(ctx, hazard) {
  const p = projectPoint(0, 0, hazard.z);
  const radius = clamp(TUNNEL_RADIUS * p.scale * 0.052, 78, 520);
  const alpha = clamp(1.22 - hazard.z / 30, 0.18, 0.92);
  ctx.save();
  ctx.translate(CENTER_X, CENTER_Y);
  ctx.rotate(hazard.gapAngle);
  ctx.globalAlpha = alpha;
  ctx.shadowColor = '#fb7185';
  ctx.shadowBlur = 24;
  ctx.strokeStyle = 'rgba(248,113,113,.78)';
  ctx.lineWidth = clamp(18 * p.scale * 0.03, 8, 24);
  ctx.beginPath();
  ctx.arc(0, 0, radius, hazard.gapWidth / 2, Math.PI * 2 - hazard.gapWidth / 2);
  ctx.stroke();
  ctx.shadowColor = '#67e8f9';
  ctx.strokeStyle = 'rgba(103,232,249,.92)';
  ctx.lineWidth = clamp(11 * p.scale * 0.03, 5, 15);
  ctx.beginPath();
  ctx.arc(0, 0, radius, -hazard.gapWidth / 2, hazard.gapWidth / 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(103,232,249,.28)';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, radius + 18, -hazard.gapWidth / 2, hazard.gapWidth / 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFlowRing(ctx, ring) {
  const p = projectPoint(ring.x, ring.y, ring.z);
  const radius = clamp((ring.radius * 270) * p.scale * 0.04, 24, 118);
  const alpha = clamp(1.2 - ring.z / 34, 0.22, 0.96);
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(ring.pulse * (ring.rollBonus ? 1.2 : 0.65));
  ctx.globalAlpha = alpha;
  ctx.shadowColor = ring.rollBonus ? '#c084fc' : '#5eead4';
  ctx.shadowBlur = 28;
  ctx.strokeStyle = ring.rollBonus ? 'rgba(192,132,252,.95)' : 'rgba(94,234,212,.95)';
  ctx.lineWidth = clamp(9 * p.scale * 0.04, 4, 13);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([16, 12]);
  ctx.strokeStyle = 'rgba(248,250,252,.74)';
  ctx.lineWidth = Math.max(2, radius * 0.035);
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.68, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = ring.rollBonus ? '#f5d0fe' : '#ccfbf1';
  ctx.font = `900 ${clamp(radius * 0.28, 10, 17)}px Outfit, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(ring.rollBonus ? 'ROLL' : 'FLOW', 0, 0);
  ctx.restore();
}

function drawGate(ctx, gate, isPrimary) {
  gate.options.forEach((option) => {
    const p = projectPoint(option.x, option.y, gate.z);
    const w = isPrimary ? clamp(132 * p.scale * 0.036, 58, 100) : clamp(80 * p.scale * 0.028, 24, 58);
    const h = isPrimary ? clamp(70 * p.scale * 0.038, 34, 62) : clamp(40 * p.scale * 0.028, 14, 30);
    ctx.save();
    ctx.globalAlpha = isPrimary ? clamp(1.18 - gate.z / 28, 0.32, 0.94) : clamp(0.62 - gate.z / 54, 0.12, 0.42);
    ctx.shadowColor = isPrimary ? '#67e8f9' : 'transparent';
    ctx.shadowBlur = isPrimary ? 12 : 0;
    ctx.fillStyle = 'rgba(79,70,229,.62)';
    drawRoundedRect(ctx, p.x - w / 2, p.y - h / 2, w, h, Math.max(8, h * 0.18));
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = isPrimary ? 3 : 1.5;
    ctx.stroke();
    if (isPrimary) {
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawFittedText(ctx, option.label, p.x, p.y, w - 10, clamp(16 * p.scale * 0.042, 10, 16), 8);
    }
    ctx.restore();
  });
}

function drawPickup(ctx, pickup) {
  const p = projectPoint(pickup.x, pickup.y, pickup.z);
  const size = clamp(44 * p.scale * 0.055, 15, 46);
  const colors = {
    shield: '#38bdf8',
    coolant: '#5eead4',
    missile: '#facc15',
    overdrive: '#c084fc',
  };
  const labels = {
    shield: 'S',
    coolant: 'C',
    missile: 'M',
    overdrive: 'O',
  };
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(pickup.pulse * 0.7);
  ctx.globalAlpha = clamp(1.18 - pickup.z / 34, 0.32, 1);
  ctx.shadowColor = colors[pickup.type];
  ctx.shadowBlur = 22;
  ctx.fillStyle = 'rgba(15,23,42,.84)';
  drawRoundedRect(ctx, -size, -size, size * 2, size * 2, size * 0.26);
  ctx.fill();
  ctx.strokeStyle = colors[pickup.type];
  ctx.lineWidth = Math.max(2, size * 0.12);
  ctx.stroke();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = colors[pickup.type];
  ctx.font = `900 ${clamp(size * 0.9, 12, 28)}px Outfit, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(labels[pickup.type], 0, 1);
  ctx.restore();
}

function drawShot(ctx, shot, color, radius) {
  const p = projectPoint(shot.x, shot.y, shot.z);
  const r = clamp(radius * p.scale * 0.035, 2, 24);
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, Math.max(2, r), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMissile(ctx, missile) {
  missile.trail.forEach((trailPoint, index) => {
    const alpha = (index + 1) / Math.max(1, missile.trail.length);
    const point = projectPoint(trailPoint.x, trailPoint.y, trailPoint.z);
    const radius = clamp(20 * point.scale * 0.025 * alpha, 2, 14);
    ctx.save();
    ctx.globalAlpha = alpha * 0.58;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  drawShot(ctx, missile, '#facc15', 28);
}

function drawPlayerShip(ctx, player) {
  const x = CENTER_X + player.x * 320;
  const y = CENTER_Y + player.y * 260;
  ctx.save();
  ctx.translate(x, y + 186);
  ctx.rotate(player.vx * 0.08 + player.barrelRoll * 0.42);
  ctx.shadowColor = player.overdrive > 0 ? '#5eead4' : '#facc15';
  ctx.shadowBlur = player.overdrive > 0 ? 24 : 12;
  ctx.fillStyle = player.shieldFlash > 0 ? '#93c5fd' : '#facc15';
  ctx.beginPath();
  ctx.moveTo(0, -38);
  ctx.lineTo(-34, 34);
  ctx.lineTo(0, 18);
  ctx.lineTo(34, 34);
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fillStyle = player.activeWeapon === 'rail' ? '#67e8f9' : player.activeWeapon === 'spread' ? '#fb923c' : '#fef08a';
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(-10, 14);
  ctx.lineTo(0, 9);
  ctx.lineTo(10, 14);
  ctx.closePath();
  ctx.fill();
  if (player.shieldFlash > 0) {
    ctx.strokeStyle = 'rgba(147,197,253,.7)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, 58, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (player.pulseTimer > 0) {
    ctx.strokeStyle = `rgba(103,232,249,${0.32 + player.pulseTimer})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 66 + (0.32 - player.pulseTimer) * 220, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function renderGame(ctx, game) {
  drawTunnel(ctx, game);
  game.pickups.slice().sort((a, b) => b.z - a.z).forEach((pickup) => drawPickup(ctx, pickup));
  game.flowRings.slice().sort((a, b) => b.z - a.z).forEach((ring) => drawFlowRing(ctx, ring));
  game.hazards.slice().sort((a, b) => b.z - a.z).forEach((hazard) => drawHazard(ctx, hazard));
  if (game.distance > 760 && game.core.hp > 0) drawEnemy(ctx, game.core, game);
  game.enemies.slice().sort((a, b) => b.z - a.z).forEach((enemy) => drawEnemy(ctx, enemy, game));
  const primaryGateId = game.gates
    .filter((gate) => gate.z > 1.1)
    .sort((a, b) => a.z - b.z)[0]?.id;
  game.gates.slice().sort((a, b) => b.z - a.z).forEach((gate) => drawGate(ctx, gate, gate.id === primaryGateId));
  game.shots.forEach((shot) => drawShot(ctx, shot, shot.color || '#fef08a', shot.weapon === 'rail' ? 26 : 20));
  game.missiles.forEach((missile) => drawMissile(ctx, missile));
  game.enemyShots.forEach((shot) => drawShot(ctx, shot, '#fb7185', 22));
  game.sparks.forEach((spark) => drawShot(ctx, spark, spark.color, 18 * clamp(spark.life / 0.55, 0, 1)));
  drawPlayerShip(ctx, game.player);
  drawHud(ctx, game);
}

export default function FaskaDescentSwarm() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameRef = useRef(makeInitialGame('arcade'));
  const inputRef = useRef(makeInputState());
  const modeRef = useRef('arcade');
  const [mode, setMode] = useState('arcade');
  const [result, setResult] = useState(null);

  const clearInput = useCallback(() => {
    inputRef.current = makeInputState();
  }, []);

  const restart = useCallback(() => {
    clearInput();
    setResult(null);
    gameRef.current = makeInitialGame(modeRef.current);
  }, [clearInput]);

  const setGameMode = useCallback((nextMode) => {
    modeRef.current = nextMode;
    setMode(nextMode);
    clearInput();
    setResult(null);
    gameRef.current = makeInitialGame(nextMode);
  }, [clearInput]);

  const setVirtualInput = useCallback((name, pressed) => {
    setBufferedInput(inputRef.current, name, pressed);
  }, []);

  const holdButton = useCallback((name) => ({
    onPointerDown: (event) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      setVirtualInput(name, true);
    },
    onPointerUp: (event) => {
      event.preventDefault();
      setVirtualInput(name, false);
    },
    onPointerCancel: () => setVirtualInput(name, false),
    onPointerLeave: () => setVirtualInput(name, false),
  }), [setVirtualInput]);

  const selectWeaponButton = useCallback((weaponId) => ({
    onPointerDown: (event) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      selectWeapon(gameRef.current, weaponId);
    },
    onPointerUp: (event) => event.preventDefault(),
    onPointerCancel: (event) => event.preventDefault(),
  }), []);

  const handleCanvasKeyDown = useCallback((event) => {
    const mapped = DESCENT_KEY_BINDINGS.get(event.key);
    if (mapped) {
      setBufferedInput(inputRef.current, mapped, true);
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.key === 'q' || event.key === 'Q') {
      event.preventDefault();
      event.stopPropagation();
      cycleWeapon(gameRef.current);
    }
    if (['1', '2', '3'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      selectWeapon(gameRef.current, WEAPON_ORDER[Number(event.key) - 1]);
    }
    if (event.key === 'm' || event.key === 'M') {
      event.preventDefault();
      event.stopPropagation();
      setGameMode(modeRef.current === 'learn' ? 'arcade' : 'learn');
    }
    if (event.key === 'r' || event.key === 'R') {
      event.preventDefault();
      event.stopPropagation();
      restart();
    }
  }, [restart, setGameMode]);

  const handleCanvasKeyUp = useCallback((event) => {
    const mapped = DESCENT_KEY_BINDINGS.get(event.key);
    if (!mapped) return;
    setBufferedInput(inputRef.current, mapped, false);
    event.preventDefault();
    event.stopPropagation();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;
    canvas.focus?.();
    let raf = 0;
    let last = performance.now();
    const keyDown = (event) => {
      const mapped = DESCENT_KEY_BINDINGS.get(event.key);
      if (mapped) {
        setBufferedInput(inputRef.current, mapped, true);
        event.preventDefault();
      }
      if (event.key === 'q' || event.key === 'Q') cycleWeapon(gameRef.current);
      if (['1', '2', '3'].includes(event.key)) selectWeapon(gameRef.current, WEAPON_ORDER[Number(event.key) - 1]);
      if (event.key === 'm' || event.key === 'M') setGameMode(modeRef.current === 'learn' ? 'arcade' : 'learn');
      if (event.key === 'r' || event.key === 'R') restart();
    };
    const keyUp = (event) => {
      const mapped = DESCENT_KEY_BINDINGS.get(event.key);
      if (mapped) {
        setBufferedInput(inputRef.current, mapped, false);
        event.preventDefault();
      }
    };
    const loop = (now) => {
      const dt = Math.min(0.033, (now - last) / 1000 || 0);
      last = now;
      expireBufferedInputs(inputRef.current, now);
      try {
        updateGame(gameRef.current, inputRef.current, dt, setResult);
        renderGame(ctx, gameRef.current);
      } catch (err) {
        console.error("Game loop error:", err);
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
    };
  }, [restart, setGameMode]);

  const canvasTopChrome = 'max(12px, calc((100vh - min(100vh, calc(100vw * 9 / 16))) / 2 - 62px))';
  const canvasBottomChrome = 'calc((100vh - min(100vh, calc(100vw * 9 / 16))) / 2 + 24px)';
  const padButton = {
    width: 62,
    height: 62,
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,.2)',
    background: 'rgba(15,23,42,.76)',
    color: '#f8fafc',
    font: '900 18px Outfit, sans-serif',
    touchAction: 'none',
    userSelect: 'none',
    boxShadow: '0 12px 32px rgba(0,0,0,.3)',
  };
  const actionButton = {
    ...padButton,
    width: 90,
    height: 64,
    fontSize: 13,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#020617', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
      <canvas
        className="descent-canvas"
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        tabIndex={0}
        aria-label="Faska Descent Pro Spielfeld"
        onPointerDown={(event) => event.currentTarget.focus()}
        onKeyDown={handleCanvasKeyDown}
        onKeyUp={handleCanvasKeyUp}
        style={{
          position: 'absolute',
          inset: 0,
          margin: 'auto',
          width: 'min(100vw, calc(100vh * 16 / 9))',
          height: 'min(100vh, calc(100vw * 9 / 16))',
          display: 'block',
          outline: 'none',
          touchAction: 'none',
          boxShadow: '0 0 140px rgba(99,102,241,.22), inset 0 0 90px rgba(34,211,238,.10), 0 0 90px rgba(0,0,0,.55)',
        }}
      />

      {/* Post-processing vignette overlay */}
      <div className="descent-vignette" style={{
        position: 'absolute',
        inset: 0,
        margin: 'auto',
        width: 'min(100vw, calc(100vh * 16 / 9))',
        height: 'min(100vh, calc(100vw * 9 / 16))',
        pointerEvents: 'none',
        zIndex: 1,
        boxShadow: 'inset 0 0 150px 60px rgba(0,0,0,.45), inset 0 0 80px 30px rgba(99,102,241,.14)',
        borderRadius: 2,
      }} />

      <div className="descent-modebar" style={{ position: 'fixed', top: canvasTopChrome, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.55 }}>
          Normal
        </button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.55 }}>
          Learncade
        </button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      <div className="descent-touch-controls" style={{
        position: 'fixed', left: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'grid', gridTemplateColumns: '62px 62px 62px', gridTemplateRows: '62px 62px',
        gap: 8, touchAction: 'none',
      }}>
        <div />
        <button aria-label="Hoch" style={padButton} {...holdButton('up')}>↑</button>
        <div />
        <button aria-label="Links" style={padButton} {...holdButton('left')}>←</button>
        <button aria-label="Runter" style={padButton} {...holdButton('down')}>↓</button>
        <button aria-label="Rechts" style={padButton} {...holdButton('right')}>→</button>
      </div>

      <div className="descent-touch-controls descent-actions" style={{
        position: 'fixed', right: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'flex', gap: 10, alignItems: 'flex-end', touchAction: 'none',
      }}>
        <button aria-label="Feuern" style={{ ...actionButton, width: 98, height: 78, background: 'rgba(250,204,21,.84)', color: '#111827' }} {...holdButton('fire')}>
          FIRE
        </button>
        <button aria-label="Pulse Laser" style={{ ...actionButton, background: 'rgba(250,250,150,.74)', color: '#111827' }} {...selectWeaponButton('laser')}>LASER</button>
        <button aria-label="Scatter Blaster" style={{ ...actionButton, background: 'rgba(251,146,60,.82)', color: '#111827' }} {...selectWeaponButton('spread')}>SPREAD</button>
        <button aria-label="Rail Lance" style={{ ...actionButton, background: 'rgba(103,232,249,.82)', color: '#082f49' }} {...selectWeaponButton('rail')}>RAIL</button>
        <button aria-label="Ausweichrolle" style={{ ...actionButton, background: 'rgba(124,58,237,.82)' }} {...holdButton('evade')}>ROLL</button>
        <button aria-label="Shield Pulse" style={{ ...actionButton, background: 'rgba(103,232,249,.78)', color: '#082f49' }} {...holdButton('pulse')}>PULSE</button>
        <button aria-label="Ziel aufschalten" style={actionButton} {...holdButton('lock')}>LOCK</button>
        <button aria-label="Rakete" style={{ ...actionButton, background: 'rgba(15,118,110,.82)' }} {...holdButton('missile')}>MISSILE</button>
        <button aria-label="Boost" style={actionButton} {...holdButton('boost')}>BOOST</button>
      </div>

      {result && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2,6,23,.74)', zIndex: 20, flexDirection: 'column', gap: 16,
        }}>
          <div style={{ fontSize: 54, fontWeight: 900, color: '#f8fafc' }}>{result.result}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#facc15' }}>Score {result.score}</div>
          <div style={{ fontSize: 15, color: '#cbd5e1' }}>Distanz {result.distance}</div>
          <button className="btn-primary" onClick={restart}>Neuer Run</button>
        </div>
      )}

      <style>{`
        @media (pointer: fine), (min-width: 900px) {
          .descent-touch-controls {
            display: none !important;
          }
        }
        @media (max-width: 899px) and (orientation: portrait) {
          .descent-canvas,
          .descent-vignette {
            width: 100dvw !important;
            height: 100dvh !important;
          }
          .descent-modebar {
            top: max(8px, env(safe-area-inset-top)) !important;
            width: min(96dvw, 560px);
            flex-wrap: wrap;
            justify-content: center;
            gap: 6px !important;
          }
          .descent-modebar .btn-primary {
            padding: 8px 11px;
            font-size: 11px;
          }
          .descent-touch-controls {
            bottom: max(12px, env(safe-area-inset-bottom)) !important;
          }
          .descent-actions {
            right: 8px !important;
            gap: 6px !important;
            flex-wrap: wrap;
            justify-content: flex-end;
            max-width: 166px;
          }
          .descent-actions button {
            width: 72px !important;
            height: 42px !important;
            font-size: 9px !important;
            border-radius: 12px !important;
            padding: 0 !important;
          }
          .descent-actions button:first-child {
            width: 80px !important;
            height: 48px !important;
          }
          .descent-touch-controls:not(.descent-actions) button {
            width: 48px !important;
            height: 48px !important;
          }
        }
      `}</style>
    </div>
  );
}
