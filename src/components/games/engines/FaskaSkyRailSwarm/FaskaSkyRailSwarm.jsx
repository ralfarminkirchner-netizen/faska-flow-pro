import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const FOCAL = 520;
const LANES = [-0.48, 0, 0.48];
const LOCK_TIERS = [
  { charge: 0.22, count: 1, label: 'Lock' },
  { charge: 0.58, count: 3, label: 'Multi-Lock' },
  { charge: 0.92, count: 5, label: 'Full Salvo' },
];

const SKY_RAIL_GOALS = [
  { id: 'waves_3', label: '3 Wellen klaeren', stat: 'wavesCleared', target: 3, mode: 'arcade', reward: 900 },
  { id: 'targets_18', label: '18 Ziele zerstoeren', stat: 'targets', target: 18, mode: 'both', reward: 850 },
  { id: 'locks_5', label: '5 Lock-on Treffer', stat: 'lockHits', target: 5, mode: 'both', reward: 700 },
  { id: 'wing_8', label: '8 Wingman-Treffer', stat: 'wingHits', target: 8, mode: 'both', reward: 780 },
  { id: 'rings_5', label: '5 Apex-Ringe', stat: 'rings', target: 5, mode: 'both', reward: 700 },
  { id: 'hazards_5', label: '5 Gefahren entschärfen', stat: 'hazardsCleared', target: 5, mode: 'both', reward: 860 },
  { id: 'supplies_3', label: '3 Supply-Pods sichern', stat: 'supplies', target: 3, mode: 'both', reward: 760 },
  { id: 'boss_phase_2', label: '2 Bossphasen brechen', stat: 'bossPhases', target: 2, mode: 'arcade', reward: 1200 },
  { id: 'evade_3', label: '3 Perfect-Evades', stat: 'perfectEvades', target: 3, mode: 'arcade', reward: 750 },
  { id: 'learn_3', label: '3 Learncade-Gates', stat: 'learnCorrect', target: 3, mode: 'learn', reward: 1200 },
];

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "fliegt"?',
    answer: 'Verb',
    options: ['Nomen', 'Verb', 'Adjektiv'],
  },
  {
    subject: 'Mathe',
    prompt: '15 + 27 = ?',
    answer: '42',
    options: ['32', '42', '52'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "sky"?',
    answer: 'Himmel',
    options: ['Himmel', 'Stein', 'Tasche'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Ein Planet kreist um ...',
    answer: 'eine Sonne',
    options: ['eine Sonne', 'eine Kerze', 'ein Buch'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welches Wort ist ein Adjektiv?',
    answer: 'schnell',
    options: ['schnell', 'Raum', 'fliegen'],
  },
  {
    subject: 'Mathe',
    prompt: 'Welche Zahl ist gerade?',
    answer: '48',
    options: ['35', '48', '71'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welches Wort ist ein Nomen?',
    answer: 'Rakete',
    options: ['Rakete', 'hell', 'schwebt'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "wing"?',
    answer: 'Fluegel',
    options: ['Fluegel', 'Wolke', 'Lampe'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Womit atmen Menschen?',
    answer: 'Lunge',
    options: ['Lunge', 'Lenker', 'Leiter'],
  },
  {
    subject: 'Musik',
    prompt: 'Welche Note liegt nach C?',
    answer: 'D',
    options: ['A', 'D', 'H'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Was ist das Gegenteil von "laut"?',
    answer: 'leise',
    options: ['leise', 'rund', 'kurz'],
  },
  {
    subject: 'Mathe',
    prompt: '6 x 7 = ?',
    answer: '42',
    options: ['36', '42', '49'],
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const seededUnit = (index, salt) => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const STARS = Array.from({ length: 170 }, (_, index) => ({
  x: seededUnit(index, 1) * 2 - 1,
  y: seededUnit(index, 2) * 1.6 - 0.8,
  z: seededUnit(index, 3),
  size: seededUnit(index, 4) * 1.8 + 0.6,
  color: index % 5 === 0 ? '#67e8f9' : index % 7 === 0 ? '#facc15' : '#e0f2fe',
}));

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

function project(x, y, z) {
  const depth = Math.max(0.08, z);
  const scale = FOCAL / (FOCAL * depth + 120);
  return {
    x: CENTER_X + x * 430 * scale,
    y: CENTER_Y + y * 260 * scale,
    scale,
  };
}

function makeTaskGates(taskIndex) {
  const task = LEARN_TASKS[taskIndex % LEARN_TASKS.length];
  return task.options.map((label, index) => ({
    id: `${taskIndex}-${label}`,
    label,
    correct: label === task.answer,
    x: LANES[index],
    y: 0.42,
    z: 1.45,
    w: 0.28,
    h: 0.36,
    resolved: false,
  }));
}

function spawnParticles(game, x, y, color, count = 10, speed = 160) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed;
    const burst = speed * (0.45 + (i % 5) * 0.16);
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * burst,
      vy: Math.sin(angle) * burst,
      size: 4 + (i % 3) * 2,
      life: 0.55,
      maxLife: 0.55,
      color,
    });
  }
}

function addFloater(game, x, y, text, color = '#facc15') {
  game.floaters.push({ x, y, text, color, life: 0.85, vy: -42 });
}

function createStats() {
  return {
    wavesCleared: 0,
    targets: 0,
    lockHits: 0,
    wingHits: 0,
    rings: 0,
    hazardsCleared: 0,
    supplies: 0,
    bossPhases: 0,
    perfectEvades: 0,
    novas: 0,
    learnCorrect: 0,
  };
}

function createGoals(mode) {
  const weight = goal => (goal.mode === mode ? 0 : goal.mode === 'both' ? 1 : 2);
  return SKY_RAIL_GOALS
    .filter(goal => goal.mode === 'both' || goal.mode === mode)
    .sort((a, b) => weight(a) - weight(b))
    .map(goal => ({ ...goal, completed: false }));
}

function recordStat(game, stat, amount = 1) {
  game.stats[stat] = (game.stats[stat] || 0) + amount;
  const completed = game.goals.find(goal => !goal.completed && goal.stat === stat && game.stats[stat] >= goal.target);
  if (!completed) return;
  completed.completed = true;
  game.score += completed.reward;
  game.goalNotice = `${completed.label} +${completed.reward}`;
  game.goalNoticeTimer = 2.2;
  game.message = `Mission geschafft: ${completed.label}`;
  game.messageTimer = 1.25;
}

function makeBonusRing(index, wave) {
  const lane = LANES[(index + wave) % LANES.length];
  return {
    id: `ring-${wave}-${index}-${Date.now()}`,
    x: lane + (seededUnit(index, wave + 1) - 0.5) * 0.18,
    y: -0.12 + seededUnit(index + wave, 3) * 0.58,
    z: 1.5,
    kind: index % 3 === 0 ? 'shield' : 'apex',
    pulse: seededUnit(index, 8) * Math.PI * 2,
    collected: false,
  };
}

function makeEnemy(type, lane, wave) {
  const profiles = {
    drone: { hp: 34, score: 100, speed: 0.32, r: 0.06, color: '#38bdf8', fire: 1.2 },
    slicer: { hp: 48, score: 140, speed: 0.44, r: 0.075, color: '#fb7185', fire: 0.95 },
    cruiser: { hp: 120, score: 340, speed: 0.24, r: 0.11, color: '#f97316', fire: 1.7 },
    boss: { hp: 760, score: 2100, speed: 0.18, r: 0.2, color: '#a78bfa', fire: 0.72 },
  };
  const profile = profiles[type];
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    x: lane + (Math.random() - 0.5) * 0.14,
    y: -0.28 + Math.random() * 0.58,
    z: 1.25 + Math.random() * 0.35,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.16,
    hp: Math.round(profile.hp * (1 + wave * 0.06)),
    maxHp: Math.round(profile.hp * (1 + wave * 0.06)),
    score: profile.score,
    speed: profile.speed,
    r: profile.r,
    color: profile.color,
    fireTimer: Math.random() * profile.fire + 0.35,
    fireCadence: profile.fire,
    hitFlash: 0,
    phase: Math.random() * Math.PI * 2,
    phaseLevel: 1,
  };
}

function getLockTier(charge) {
  return [...LOCK_TIERS].reverse().find(tier => charge >= tier.charge) || LOCK_TIERS[0];
}

function pickLockTargets(game, count) {
  const targets = [...game.enemies]
    .filter(enemy => enemy.hp > 0 && enemy.z > 0.08)
    .sort((a, b) => {
      if (a.type === 'boss' && b.type !== 'boss') return -1;
      if (b.type === 'boss' && a.type !== 'boss') return 1;
      return a.z - b.z;
    });
  if (targets.length === 0) return [];
  return Array.from({ length: count }, (_, index) => targets[index % targets.length]);
}

function makeWingmen() {
  return [
    { id: 'wing-left', side: -1, x: -0.18, y: 0.55, z: 0.13, cooldown: 0.55, pulse: 0 },
    { id: 'wing-right', side: 1, x: 0.18, y: 0.55, z: 0.13, cooldown: 0.74, pulse: Math.PI },
  ];
}

function makeHazard(index, wave) {
  const kind = ['mine', 'storm', 'turret'][(index + wave) % 3];
  const profiles = {
    mine: { hp: 42, r: 0.085, damage: 22, color: '#fb7185', speed: 0.44 },
    storm: { hp: 999, r: 0.15, damage: 16, color: '#22d3ee', speed: 0.35 },
    turret: { hp: 62, r: 0.105, damage: 18, color: '#f97316', speed: 0.28 },
  };
  const profile = profiles[kind];
  return {
    id: `${kind}-${wave}-${index}-${Date.now()}`,
    kind,
    x: LANES[(index + wave) % LANES.length] + (seededUnit(index, wave + 12) - 0.5) * 0.14,
    y: -0.42 + seededUnit(index + 3, wave + 4) * 0.92,
    z: 1.35 + seededUnit(index + 8, wave + 2) * 0.35,
    hp: profile.hp,
    maxHp: profile.hp,
    r: profile.r,
    damage: profile.damage,
    color: profile.color,
    speed: profile.speed,
    pulse: seededUnit(index, wave + 9) * Math.PI * 2,
    scored: false,
  };
}

function makeSupplyPod(index, wave) {
  const kind = ['repair', 'coolant', 'ordnance'][(index + wave) % 3];
  const colors = { repair: '#86efac', coolant: '#67e8f9', ordnance: '#facc15' };
  return {
    id: `supply-${wave}-${index}-${Date.now()}`,
    kind,
    x: LANES[(index + 1) % LANES.length] + (seededUnit(index, wave + 23) - 0.5) * 0.16,
    y: -0.36 + seededUnit(index + 5, wave + 6) * 0.78,
    z: 1.42,
    r: 0.095,
    color: colors[kind],
    pulse: seededUnit(index, wave + 13) * Math.PI * 2,
    collected: false,
  };
}

function makeInitialGame(mode = 'arcade') {
  const game = {
    mode,
    elapsed: 0,
    phase: 'play',
    score: 0,
    wave: 0,
    combo: 0,
    multiplier: 1,
    taskIndex: 0,
    taskCooldown: mode === 'learn' ? 1.2 : 999,
    gateCooldown: 0,
    speed: 1,
    shake: 0,
    hitStop: 0,
    ringTimer: 0.8,
    routeTimer: 1.3,
    waveClearRecorded: false,
    goalNotice: '',
    goalNoticeTimer: 0,
    stats: createStats(),
    goals: createGoals(mode),
    message: mode === 'learn' ? 'Fliege durch das richtige Antwort-Gate.' : 'Zerstoere Wellen, halte Lock-on und ueberlebe den Boss.',
    messageTimer: 2,
    player: {
      x: 0,
      y: 0.48,
      vx: 0,
      vy: 0,
      hp: 140,
      maxHp: 140,
      shield: 90,
      heat: 0,
      lockCharge: 0,
      lockHolding: false,
      rollTimer: 0,
      rollCooldown: 0,
      missileCooldown: 0,
      novaCooldown: 0,
      assistCooldown: 0,
      fireCooldown: 0,
      invuln: 0,
    },
    input: {
      up: false,
      down: false,
      left: false,
      right: false,
      fire: false,
      roll: false,
      missile: false,
      assist: false,
      boost: false,
      nova: false,
    },
    wingmen: makeWingmen(),
    enemies: [],
    playerShots: [],
    missiles: [],
    enemyShots: [],
    hazards: [],
    supplies: [],
    rings: [],
    gates: mode === 'learn' ? makeTaskGates(0) : [],
    particles: [],
    floaters: [],
    result: null,
  };
  spawnWave(game);
  return game;
}

function spawnWave(game) {
  game.wave += 1;
  game.waveClearRecorded = false;
  const bossWave = game.wave % 4 === 0;
  if (bossWave) {
    game.enemies.push(makeEnemy('boss', 0, game.wave));
    game.hazards.push(makeHazard(game.wave * 2, game.wave));
    game.supplies.push(makeSupplyPod(game.wave, game.wave));
    game.message = `Boss im Anflug - Welle ${game.wave}`;
    game.messageTimer = 1.4;
    return;
  }
  const count = clamp(4 + game.wave, 5, 11);
  const types = ['drone', 'slicer', 'drone', 'cruiser', 'drone', 'slicer', 'drone'];
  for (let i = 0; i < count; i += 1) {
    const lane = LANES[i % LANES.length];
    const enemy = makeEnemy(types[(i + game.wave) % types.length], lane, game.wave);
    enemy.z += i * 0.055;
    game.enemies.push(enemy);
  }
  game.message = `Welle ${game.wave}`;
  game.messageTimer = 0.85;
  game.rings.push(makeBonusRing(game.wave, game.wave));
  if (game.hazards.length < 3) game.hazards.push(makeHazard(game.wave, game.wave));
  if (game.wave % 2 === 1 && game.supplies.length < 2) game.supplies.push(makeSupplyPod(game.wave, game.wave));
}

function damagePlayer(game, amount, sx = CENTER_X, sy = CENTER_Y) {
  const player = game.player;
  if (player.invuln > 0 || player.rollTimer > 0) return;
  const shieldHit = Math.min(player.shield, amount);
  player.shield -= shieldHit;
  player.hp -= amount - shieldHit;
  player.invuln = 0.42;
  game.combo = 0;
  game.multiplier = 1;
  game.shake = 0.22;
  addFloater(game, sx, sy, `-${amount}`, '#fb7185');
  spawnParticles(game, sx, sy, '#fb7185', 16, 220);
}

function damageEnemy(game, enemy, amount, label = 'Hit') {
  enemy.hp -= amount;
  enemy.hitFlash = 0.14;
  game.hitStop = 0.03;
  const pos = project(enemy.x, enemy.y, enemy.z);
  spawnParticles(game, pos.x, pos.y, enemy.color, enemy.type === 'boss' ? 18 : 9, 190);
  addFloater(game, pos.x, pos.y - 18, `${label} ${amount}`, '#fef3c7');
  if (enemy.hp <= 0) {
    game.combo += 1;
    recordStat(game, 'targets');
    game.score += Math.round(enemy.score * game.multiplier * (1 + game.combo * 0.035));
    if (game.combo % 5 === 0) game.multiplier = clamp(game.multiplier + 1, 1, 5);
    spawnParticles(game, pos.x, pos.y, '#facc15', enemy.type === 'boss' ? 34 : 18, 300);
    addFloater(game, pos.x, pos.y, enemy.type === 'boss' ? 'BOSS DOWN' : `Combo ${game.combo}`, '#facc15');
  }
}

function damageHazard(game, hazard, amount, label = 'Hit') {
  if (hazard.kind === 'storm' || hazard.hp <= 0) return;
  hazard.hp -= amount;
  const pos = project(hazard.x, hazard.y, hazard.z);
  spawnParticles(game, pos.x, pos.y, hazard.color, 8, 150);
  addFloater(game, pos.x, pos.y - 18, `${label} ${amount}`, '#fef3c7');
  if (hazard.hp <= 0 && !hazard.scored) {
    hazard.scored = true;
    game.score += Math.round((hazard.kind === 'turret' ? 280 : 180) * game.multiplier);
    game.combo += 1;
    recordStat(game, 'hazardsCleared');
    spawnParticles(game, pos.x, pos.y, '#facc15', 18, 250);
    addFloater(game, pos.x, pos.y, hazard.kind === 'turret' ? 'Turret Down' : 'Mine Clear', '#facc15');
  }
}

function collectSupply(game, supply) {
  if (supply.collected) return;
  supply.collected = true;
  const pos = project(supply.x, supply.y, Math.max(0.16, supply.z));
  if (supply.kind === 'repair') {
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + 24);
    game.player.shield = Math.min(100, game.player.shield + 32);
  } else if (supply.kind === 'coolant') {
    game.player.heat = Math.max(0, game.player.heat - 48);
    game.player.novaCooldown = Math.max(0, game.player.novaCooldown - 1.25);
  } else {
    game.player.missileCooldown = 0;
    game.player.lockCharge = Math.max(game.player.lockCharge, 0.58);
    game.player.assistCooldown = Math.max(0, game.player.assistCooldown - 1.1);
  }
  game.score += Math.round(260 * game.multiplier);
  game.combo += 1;
  recordStat(game, 'supplies');
  addFloater(game, pos.x, pos.y, supply.kind === 'repair' ? 'Repair Pod' : supply.kind === 'coolant' ? 'Coolant Pod' : 'Ordnance Pod', supply.color);
  spawnParticles(game, pos.x, pos.y, supply.color, 22, 230);
}

function fireLockSalvo(game) {
  const player = game.player;
  if (player.missileCooldown > 0 || player.lockCharge < LOCK_TIERS[0].charge || game.enemies.length === 0) {
    player.lockCharge = 0;
    player.lockHolding = false;
    return;
  }
  const tier = getLockTier(player.lockCharge);
  const targets = pickLockTargets(game, tier.count);
  if (targets.length === 0) {
    player.lockCharge = 0;
    player.lockHolding = false;
    return;
  }
  player.missileCooldown = 0.72 + tier.count * 0.13;
  player.heat = Math.min(100, player.heat + 6 + tier.count * 4);
  targets.forEach((target, index) => {
    game.missiles.push({
      x: player.x + (index - (targets.length - 1) / 2) * 0.035,
      y: player.y,
      z: 0.08,
      targetId: target.id,
      speed: 1.28 + tier.count * 0.04,
      damage: tier.count >= 5 ? 66 : 58,
      life: 2.6,
    });
  });
  game.message = `${tier.label}: ${targets.length} Ziel${targets.length === 1 ? '' : 'e'}`;
  game.messageTimer = 0.7;
  player.lockCharge = 0;
  player.lockHolding = false;
}

function fireWingShot(game, wing, target, damage = 24) {
  game.playerShots.push({
    x: wing.x,
    y: wing.y,
    z: wing.z,
    vx: 0,
    vy: 0,
    speed: 2.25,
    damage,
    r: 0.026,
    source: 'wing',
    targetId: target.id,
  });
}

function fireWingVolley(game, forced = false) {
  const player = game.player;
  if (player.assistCooldown > 0 || game.enemies.length === 0) return false;
  const targets = pickLockTargets(game, forced ? 4 : 2);
  if (targets.length === 0) return false;
  player.assistCooldown = forced ? 2.6 : 1.35;
  if (forced) player.shield = Math.max(0, player.shield - 8);
  game.wingmen.forEach((wing, index) => {
    fireWingShot(game, wing, targets[index % targets.length], forced ? 34 : 24);
    if (forced && targets[index + 2]) fireWingShot(game, wing, targets[index + 2], 28);
    wing.cooldown = forced ? 0.55 : 0.85;
  });
  if (forced) {
    game.message = 'Wingmen greifen an';
    game.messageTimer = 0.75;
  }
  return true;
}

function updatePlayer(game, dt) {
  const player = game.player;
  const input = game.input;
  const mx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const my = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  const boost = input.boost && player.heat < 82 ? 1.4 : 1;
  game.speed = lerp(game.speed, boost, 0.08);
  if (boost > 1) player.heat += dt * 22;
  player.heat = Math.max(0, player.heat - dt * (boost > 1 ? 5 : 18));
  player.shield = Math.min(100, player.shield + dt * 3.4);
  player.fireCooldown = Math.max(0, player.fireCooldown - dt);
  player.missileCooldown = Math.max(0, player.missileCooldown - dt);
  player.novaCooldown = Math.max(0, player.novaCooldown - dt);
  player.assistCooldown = Math.max(0, player.assistCooldown - dt);
  player.rollCooldown = Math.max(0, player.rollCooldown - dt);
  player.rollTimer = Math.max(0, player.rollTimer - dt);
  player.invuln = Math.max(0, player.invuln - dt);

  if (input.roll && player.rollCooldown <= 0) {
    player.rollCooldown = 0.72;
    player.rollTimer = 0.34;
    player.invuln = 0.34;
    game.shake = 0.08;
    const sp = project(player.x, player.y, 0.18);
    spawnParticles(game, sp.x, sp.y, '#67e8f9', 10, 170);
  }

  if (input.nova && player.novaCooldown <= 0 && player.shield >= 42) {
    player.novaCooldown = 4.2;
    player.shield -= 42;
    game.shake = 0.22;
    game.hitStop = 0.08;
    recordStat(game, 'novas');
    const sp = project(player.x, player.y, 0.16);
    spawnParticles(game, sp.x, sp.y, '#a78bfa', 34, 300);
    game.enemyShots = [];
    game.enemies.forEach((enemy) => {
      if (enemy.hp <= 0 || enemy.z > 1.25) return;
      damageEnemy(game, enemy, enemy.type === 'boss' ? 72 : 96, 'Nova');
    });
    game.hazards.forEach((hazard) => {
      if (hazard.kind === 'storm' || hazard.hp <= 0 || hazard.z > 1.18) return;
      damageHazard(game, hazard, 80, 'Nova');
    });
    game.message = 'Nova Burst';
    game.messageTimer = 0.85;
  }

  const control = 1.95 * (player.rollTimer > 0 ? 1.35 : 1);
  player.vx = lerp(player.vx, mx * control, 0.18);
  player.vy = lerp(player.vy, my * control, 0.18);
  player.x = clamp(player.x + player.vx * dt, -0.84, 0.84);
  player.y = clamp(player.y + player.vy * dt, -0.62, 0.66);

  if (input.fire && player.fireCooldown <= 0 && player.heat < 96) {
    player.fireCooldown = 0.09;
    player.heat += 3.8;
    for (let side = -1; side <= 1; side += 2) {
      game.playerShots.push({
        x: player.x + side * 0.035,
        y: player.y - 0.025,
        z: 0.08,
        vx: side * 0.025,
        vy: -0.02,
        speed: 2.8,
        damage: 18,
        r: 0.025,
      });
    }
  }

  if (input.assist && player.assistCooldown <= 0 && player.shield >= 8) {
    fireWingVolley(game, true);
  }

  if (input.missile && player.missileCooldown <= 0 && game.enemies.length > 0) {
    const heatPenalty = player.heat > 78 ? 0.46 : 1;
    player.lockHolding = true;
    player.lockCharge = clamp(player.lockCharge + dt * 1.35 * heatPenalty, 0, 1);
    if (player.lockCharge >= 1) fireLockSalvo(game);
  } else if (!input.missile && player.lockHolding) {
    fireLockSalvo(game);
  } else if (player.missileCooldown > 0) {
    player.lockCharge = Math.max(0, player.lockCharge - dt * 1.8);
  }
}

function updateWingmen(game, dt) {
  const player = game.player;
  game.wingmen.forEach((wing) => {
    wing.pulse += dt * 4.6;
    wing.cooldown = Math.max(0, wing.cooldown - dt);
    wing.x = lerp(wing.x, player.x + wing.side * 0.22, 0.12);
    wing.y = lerp(wing.y, player.y + 0.09 + Math.sin(wing.pulse) * 0.018, 0.12);
    if (wing.cooldown <= 0 && game.combo >= 3 && game.enemies.length > 0 && player.heat < 92) {
      const target = pickLockTargets(game, 1)[0];
      if (target) {
        fireWingShot(game, wing, target, 22);
        wing.cooldown = 0.9;
      }
    }
  });
}

function updateEnemies(game, dt) {
  game.enemies.forEach((enemy) => {
    if (enemy.hp <= 0) return;
    enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
    const bossPhase = enemy.type === 'boss' ? enemy.phaseLevel : 1;
    enemy.phase += dt * (enemy.type === 'boss' ? 1.15 + bossPhase * 0.22 : 2.3);
    if (enemy.type === 'boss') {
      const ratio = enemy.hp / enemy.maxHp;
      const nextPhase = ratio < 0.34 ? 3 : ratio < 0.67 ? 2 : 1;
      if (nextPhase > enemy.phaseLevel) {
        enemy.phaseLevel = nextPhase;
        recordStat(game, 'bossPhases');
        game.message = `Bossphase ${nextPhase}: Musterwechsel`;
        game.messageTimer = 1.05;
        game.shake = 0.2;
        game.hazards.push(makeHazard(Math.floor(game.elapsed * 10) + nextPhase, game.wave));
        spawnParticles(game, project(enemy.x, enemy.y, enemy.z).x, project(enemy.x, enemy.y, enemy.z).y, '#c4b5fd', 26, 260);
      }
    }
    const phaseSpeed = enemy.type === 'boss' ? 1 + (enemy.phaseLevel - 1) * 0.18 : 1;
    enemy.z -= dt * enemy.speed * game.speed * phaseSpeed;
    enemy.x += (Math.sin(enemy.phase) * (enemy.type === 'boss' ? 0.12 + enemy.phaseLevel * 0.025 : 0.1) + enemy.vx) * dt;
    enemy.y += (Math.cos(enemy.phase * 0.8) * (enemy.type === 'boss' ? 0.08 + enemy.phaseLevel * 0.02 : 0.07) + enemy.vy) * dt;
    enemy.x = clamp(enemy.x, -0.88, 0.88);
    enemy.y = clamp(enemy.y, -0.62, 0.58);
    enemy.fireTimer -= dt;
    if (enemy.fireTimer <= 0 && enemy.z < 1.12) {
      enemy.fireTimer = enemy.fireCadence * (enemy.type === 'boss' ? 1 - (enemy.phaseLevel - 1) * 0.16 : 1);
      const count = enemy.type === 'boss' ? 3 + enemy.phaseLevel * 2 : 1;
      for (let i = 0; i < count; i += 1) {
        const spread = i - (count - 1) / 2;
        const swirl = enemy.type === 'boss' ? Math.sin(enemy.phase + i * 0.9) * 0.035 * enemy.phaseLevel : 0;
        game.enemyShots.push({
          x: enemy.x + spread * 0.052,
          y: enemy.y,
          z: enemy.z,
          vx: (game.player.x - enemy.x) * 0.18 + spread * 0.038 + swirl,
          vy: (game.player.y - enemy.y) * 0.18 + (enemy.type === 'boss' ? Math.cos(enemy.phase + i) * 0.018 * enemy.phaseLevel : 0),
          speed: 0.9 + game.wave * 0.025 + (enemy.type === 'boss' ? enemy.phaseLevel * 0.05 : 0),
          damage: enemy.type === 'boss' ? 13 + enemy.phaseLevel * 3 : 11,
          r: enemy.type === 'boss' ? 0.04 : 0.03,
          color: enemy.type === 'boss' ? '#c4b5fd' : '#38bdf8',
        });
      }
    }
    if (enemy.z < 0.04) {
      const pos = project(enemy.x, enemy.y, 0.08);
      damagePlayer(game, enemy.type === 'boss' ? 32 : 18, pos.x, pos.y);
      enemy.hp = 0;
    }
  });
  game.enemies = game.enemies.filter((enemy) => enemy.hp > 0);
  if (game.enemies.length === 0) {
    if (!game.waveClearRecorded) {
      recordStat(game, 'wavesCleared');
      game.waveClearRecorded = true;
    }
    game.nextWave = (game.nextWave || 0) + dt;
    if (game.nextWave > 1.1) {
      game.nextWave = 0;
      spawnWave(game);
    }
  }
}

function updateRings(game, dt) {
  game.ringTimer -= dt;
  if (game.ringTimer <= 0) {
    game.ringTimer = 2.6 + seededUnit(Math.floor(game.elapsed * 10), game.wave) * 1.2;
    if (game.rings.length < 4) {
      game.rings.push(makeBonusRing(Math.floor(game.elapsed * 11), game.wave));
    }
  }
  game.rings.forEach((ring) => {
    if (ring.collected) return;
    ring.z -= dt * 0.42 * game.speed;
    ring.pulse += dt * 4;
    if (ring.z < 0.22) {
      const inside = Math.abs(game.player.x - ring.x) < 0.16 && Math.abs(game.player.y - ring.y) < 0.18;
      if (inside) {
        ring.collected = true;
        const pos = project(ring.x, ring.y, 0.2);
        const gain = ring.kind === 'shield' ? 190 : 260;
        game.score += Math.round(gain * game.multiplier);
        game.combo += 1;
        game.player.shield = Math.min(100, game.player.shield + (ring.kind === 'shield' ? 30 : 14));
        game.player.heat = Math.max(0, game.player.heat - 18);
        recordStat(game, 'rings');
        addFloater(game, pos.x, pos.y, ring.kind === 'shield' ? 'Shield Ring' : 'Apex Ring', '#5eead4');
        spawnParticles(game, pos.x, pos.y, ring.kind === 'shield' ? '#67e8f9' : '#facc15', 22, 240);
      }
    }
  });
  game.rings = game.rings.filter((ring) => !ring.collected && ring.z > -0.05);
}

function updateRouteEvents(game, dt) {
  game.routeTimer -= dt;
  if (game.routeTimer > 0) return;
  game.routeTimer = 2.1 + seededUnit(Math.floor(game.elapsed * 7), game.wave + 4) * 1.4;
  const index = Math.floor(game.elapsed * 10) + game.wave;
  if (game.hazards.length < 4) game.hazards.push(makeHazard(index, game.wave));
  if (game.supplies.length < 2 && (game.player.hp < 96 || game.player.heat > 55 || game.wave % 2 === 0)) {
    game.supplies.push(makeSupplyPod(index, game.wave));
  }
}

function updateHazards(game, dt) {
  game.hazards.forEach((hazard) => {
    hazard.z -= dt * hazard.speed * game.speed;
    hazard.pulse += dt * (hazard.kind === 'storm' ? 2.5 : 4.5);
    if (hazard.kind === 'turret' && hazard.hp > 0 && hazard.z < 1.05 && Math.sin(hazard.pulse) > 0.985) {
      game.enemyShots.push({
        x: hazard.x,
        y: hazard.y,
        z: hazard.z,
        vx: (game.player.x - hazard.x) * 0.2,
        vy: (game.player.y - hazard.y) * 0.2,
        speed: 1.02,
        damage: 12,
        r: 0.028,
        color: '#fdba74',
      });
    }
    if (hazard.z < 0.2 && hazard.hp > 0) {
      const distance = Math.hypot(game.player.x - hazard.x, game.player.y - hazard.y);
      const dangerRadius = hazard.r + 0.11;
      if (distance < dangerRadius) {
        const pos = project(hazard.x, hazard.y, 0.18);
        damagePlayer(game, hazard.damage, pos.x, pos.y);
        if (hazard.kind !== 'storm') hazard.hp = 0;
      } else if (!hazard.scored && distance < dangerRadius + 0.16 && (game.player.rollTimer > 0 || game.speed > 1.2)) {
        hazard.scored = true;
        game.score += Math.round(210 * game.multiplier);
        game.combo += 1;
        recordStat(game, 'perfectEvades');
        const pos = project(game.player.x, game.player.y, 0.16);
        addFloater(game, pos.x, pos.y - 28, 'Needle Thread', '#67e8f9');
        spawnParticles(game, pos.x, pos.y, '#67e8f9', 12, 170);
      }
    }
  });
  game.hazards = game.hazards.filter(hazard => hazard.z > -0.08 && (hazard.kind === 'storm' || hazard.hp > 0));
}

function updateSupplies(game, dt) {
  game.supplies.forEach((supply) => {
    supply.z -= dt * 0.38 * game.speed;
    supply.pulse += dt * 4;
    if (!supply.collected && supply.z < 0.22) {
      const distance = Math.hypot(game.player.x - supply.x, game.player.y - supply.y);
      if (distance < supply.r + 0.14) collectSupply(game, supply);
    }
  });
  game.supplies = game.supplies.filter(supply => !supply.collected && supply.z > -0.08);
}

function updatePlayerShots(game, dt) {
  game.playerShots.forEach((shot) => {
    const target = shot.targetId ? game.enemies.find(enemy => enemy.id === shot.targetId && enemy.hp > 0) : null;
    if (target) {
      shot.x = lerp(shot.x, target.x, 0.1);
      shot.y = lerp(shot.y, target.y, 0.1);
      shot.z = lerp(shot.z, target.z, 0.08) + shot.speed * dt;
    } else {
      shot.x += shot.vx * dt;
      shot.y += shot.vy * dt;
      shot.z += shot.speed * dt;
    }
    game.enemies.forEach((enemy) => {
      if (enemy.hp <= 0 || shot.z <= 0) return;
      const dz = Math.abs(enemy.z - shot.z);
      const dx = enemy.x - shot.x;
      const dy = enemy.y - shot.y;
      if (dz < 0.075 && Math.hypot(dx, dy) < enemy.r + shot.r) {
        shot.z = -1;
        damageEnemy(game, enemy, shot.damage, 'Laser');
        if (shot.source === 'wing') recordStat(game, 'wingHits');
      }
    });
    game.hazards.forEach((hazard) => {
      if (shot.z <= 0 || hazard.hp <= 0 || hazard.kind === 'storm') return;
      const dz = Math.abs(hazard.z - shot.z);
      if (dz < 0.08 && Math.hypot(hazard.x - shot.x, hazard.y - shot.y) < hazard.r + shot.r) {
        shot.z = -1;
        damageHazard(game, hazard, shot.source === 'wing' ? 18 : shot.damage, shot.source === 'wing' ? 'Wing' : 'Laser');
        if (shot.source === 'wing') recordStat(game, 'wingHits');
      }
    });
  });
  game.playerShots = game.playerShots.filter((shot) => shot.z > 0 && shot.z < 1.6);

  game.missiles.forEach((missile) => {
    missile.life -= dt;
    const target = game.enemies.find((enemy) => enemy.id === missile.targetId && enemy.hp > 0);
    if (target) {
      missile.x = lerp(missile.x, target.x, 0.08);
      missile.y = lerp(missile.y, target.y, 0.08);
      missile.z = lerp(missile.z, target.z, 0.08) + dt * missile.speed;
      if (Math.abs(target.z - missile.z) < 0.09 && Math.hypot(target.x - missile.x, target.y - missile.y) < target.r + 0.07) {
        missile.life = 0;
        damageEnemy(game, target, missile.damage, 'Lock');
        recordStat(game, 'lockHits');
      }
    } else {
      missile.z += dt * missile.speed;
    }
  });
  game.missiles = game.missiles.filter((missile) => missile.life > 0 && missile.z < 1.7);
}

function updateEnemyShots(game, dt) {
  game.enemyShots.forEach((shot) => {
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.z -= shot.speed * dt;
    if (shot.z < 0.1) {
      const hitRadius = 0.105 + shot.r;
      if (Math.hypot(game.player.x - shot.x, game.player.y - shot.y) < hitRadius) {
        const pos = project(game.player.x, game.player.y, 0.16);
        damagePlayer(game, shot.damage, pos.x, pos.y);
        shot.z = -1;
      } else if (game.player.rollTimer > 0 && Math.hypot(game.player.x - shot.x, game.player.y - shot.y) < hitRadius + 0.12) {
        const pos = project(game.player.x, game.player.y, 0.16);
        game.score += Math.round(180 * game.multiplier);
        game.combo += 1;
        recordStat(game, 'perfectEvades');
        addFloater(game, pos.x, pos.y - 28, 'Perfect Evade', '#67e8f9');
        spawnParticles(game, pos.x, pos.y, '#67e8f9', 14, 180);
        shot.z = -1;
      }
    }
  });
  game.enemyShots = game.enemyShots.filter((shot) => shot.z > 0 && shot.z < 1.5);
}

function resolveGate(game, gate) {
  const task = LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
  gate.resolved = true;
  game.gateCooldown = 0.65;
  const sp = project(gate.x, gate.y, 0.18);
  if (gate.correct) {
    game.score += 650 * game.multiplier;
    game.combo += 2;
    game.multiplier = clamp(game.multiplier + 1, 1, 5);
    game.player.shield = Math.min(100, game.player.shield + 26);
    game.player.heat = Math.max(0, game.player.heat - 32);
    game.message = `${task.subject}: richtig - Schild aufgeladen`;
    game.messageTimer = 1.15;
    recordStat(game, 'learnCorrect');
    addFloater(game, sp.x, sp.y, gate.label, '#5eead4');
    spawnParticles(game, sp.x, sp.y, '#5eead4', 24, 240);
    game.taskIndex += 1;
  } else {
    game.combo = 0;
    game.multiplier = 1;
    game.message = `${gate.label} war falsch. Richtig: ${task.answer}`;
    game.messageTimer = 1.25;
    damagePlayer(game, 17, sp.x, sp.y);
  }
  game.gates = makeTaskGates(game.taskIndex);
  game.taskCooldown = 7.2;
}

function updateGates(game, dt) {
  if (game.mode !== 'learn') return;
  game.taskCooldown = Math.max(0, game.taskCooldown - dt);
  game.gateCooldown = Math.max(0, game.gateCooldown - dt);
  if (game.gates.length === 0 && game.taskCooldown <= 0) {
    game.gates = makeTaskGates(game.taskIndex);
  }
  game.gates.forEach((gate) => {
    gate.z -= dt * 0.36 * game.speed;
    if (!gate.resolved && gate.z < 0.2 && game.gateCooldown <= 0) {
      const insideX = Math.abs(game.player.x - gate.x) < gate.w;
      const insideY = Math.abs(game.player.y - gate.y) < gate.h;
      if (insideX && insideY) resolveGate(game, gate);
    }
  });
  if (game.gates.some((gate) => gate.z < -0.05 && !gate.resolved)) {
    const task = LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
    game.message = `Gate verpasst. Richtig waere: ${task.answer}`;
    game.messageTimer = 1.0;
    game.gates = [];
    game.taskCooldown = 4.2;
    game.combo = 0;
  }
  game.gates = game.gates.filter((gate) => gate.z > -0.08 && !gate.resolved);
}

function updateParticles(game, dt) {
  game.particles = game.particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * dt,
      y: particle.y + particle.vy * dt,
      vx: particle.vx * Math.pow(0.88, dt * 60),
      vy: particle.vy * Math.pow(0.88, dt * 60),
      life: particle.life - dt,
    }))
    .filter((particle) => particle.life > 0);
  game.floaters = game.floaters
    .map((floater) => ({ ...floater, y: floater.y + floater.vy * dt, life: floater.life - dt }))
    .filter((floater) => floater.life > 0);
}

function updateGame(game, dt, onFinish) {
  if (game.phase !== 'play') return;
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.goalNoticeTimer = Math.max(0, game.goalNoticeTimer - dt);
  game.shake = Math.max(0, game.shake - dt);
  if (game.hitStop > 0) {
    game.hitStop = Math.max(0, game.hitStop - dt);
    dt *= 0.28;
  }
  updatePlayer(game, dt);
  updateWingmen(game, dt);
  updateEnemies(game, dt);
  updateRouteEvents(game, dt);
  updateHazards(game, dt);
  updateSupplies(game, dt);
  updateRings(game, dt);
  updatePlayerShots(game, dt);
  updateEnemyShots(game, dt);
  updateGates(game, dt);
  updateParticles(game, dt);
  if (game.player.hp <= 0) {
    game.player.hp = 0;
    game.phase = 'result';
    game.result = { title: 'Mission beendet', score: game.score, wave: game.wave };
    onFinish(game.result);
  }
}

function drawBackground(ctx, game) {
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bg.addColorStop(0, '#020617');
  bg.addColorStop(0.5, '#0b2442');
  bg.addColorStop(1, '#090a18');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const speed = 0.17 * game.speed;
  STARS.forEach((star, index) => {
    const z = ((star.z - game.elapsed * speed * (0.6 + (index % 5) * 0.08)) % 1 + 1) % 1;
    const pos = project(star.x, star.y, z + 0.1);
    ctx.globalAlpha = clamp(1 - z * 0.65, 0.25, 1);
    ctx.fillStyle = star.color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, star.size * pos.scale * 2.1, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  ctx.strokeStyle = 'rgba(103,232,249,.28)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 9; i += 1) {
    const z = ((i / 9 - game.elapsed * 0.45 * game.speed) % 1 + 1) % 1;
    const w = WIDTH * (1 - z * 0.82);
    const h = HEIGHT * (1 - z * 0.82);
    ctx.globalAlpha = 0.14 + (1 - z) * 0.18;
    drawRoundedRect(ctx, CENTER_X - w / 2, CENTER_Y - h / 2, w, h, 36);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawGates(ctx, game) {
  if (game.mode !== 'learn') return;
  game.gates.forEach((gate) => {
    const pos = project(gate.x, gate.y, gate.z);
    const w = 190 * pos.scale;
    const h = 132 * pos.scale;
    ctx.save();
    ctx.shadowColor = gate.correct ? '#5eead4' : '#818cf8';
    ctx.shadowBlur = 18 * pos.scale;
    ctx.strokeStyle = gate.correct ? '#5eead4' : '#818cf8';
    ctx.lineWidth = Math.max(3, 8 * pos.scale);
    drawRoundedRect(ctx, pos.x - w / 2, pos.y - h / 2, w, h, 18 * pos.scale);
    ctx.stroke();
    ctx.fillStyle = 'rgba(15,23,42,.72)';
    drawRoundedRect(ctx, pos.x - w / 2 + 10, pos.y - 18 * pos.scale, w - 20, 38 * pos.scale, 12 * pos.scale);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = `900 ${Math.max(13, 24 * pos.scale)}px Outfit, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(gate.label, pos.x, pos.y);
    ctx.restore();
  });
}

function drawRings(ctx, game) {
  game.rings.forEach((ring) => {
    if (ring.collected) return;
    const pos = project(ring.x, ring.y, ring.z);
    const radius = clamp(78 * pos.scale, 16, 88);
    const wobble = Math.sin(ring.pulse) * 0.08;
    const color = ring.kind === 'shield' ? '#67e8f9' : '#facc15';
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(wobble + ring.x * 0.45);
    ctx.globalAlpha = clamp(1.22 - ring.z * 0.34, 0.45, 1);
    ctx.shadowColor = color;
    ctx.shadowBlur = 18 + 16 * pos.scale;
    ctx.lineWidth = Math.max(5, 13 * pos.scale);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 0.68, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.lineWidth = Math.max(2, 4 * pos.scale);
    ctx.strokeStyle = ring.kind === 'shield' ? '#e0f2fe' : '#fef3c7';
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 0.72, radius * 0.46, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(radius * 0.78, 0, Math.max(3, 7 * pos.scale), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  ctx.globalAlpha = 1;
  ctx.shadowColor = 'transparent';
}

function drawHazards(ctx, game) {
  game.hazards.forEach((hazard) => {
    const pos = project(hazard.x, hazard.y, hazard.z);
    const size = clamp(hazard.r * 690 * pos.scale, 14, hazard.kind === 'storm' ? 116 : 82);
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(hazard.pulse * (hazard.kind === 'storm' ? 0.18 : 0.55));
    ctx.globalAlpha = clamp(1.12 - hazard.z * 0.28, 0.42, 1);
    ctx.shadowColor = hazard.color;
    ctx.shadowBlur = hazard.kind === 'storm' ? 26 : 18;
    if (hazard.kind === 'storm') {
      ctx.strokeStyle = hazard.color;
      ctx.lineWidth = Math.max(3, 9 * pos.scale);
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.48, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.62, size * 0.95, Math.PI / 3, 0, Math.PI * 2);
      ctx.stroke();
    } else if (hazard.kind === 'turret') {
      ctx.fillStyle = hazard.color;
      drawRoundedRect(ctx, -size * 0.82, -size * 0.52, size * 1.64, size * 1.04, size * 0.18);
      ctx.fill();
      ctx.fillStyle = '#431407';
      ctx.fillRect(-size * 0.22, -size * 0.16, size * 0.44, size * 0.32);
    } else {
      ctx.fillStyle = hazard.color;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fff7ed';
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(4, size * 0.18), 0, Math.PI * 2);
      ctx.fill();
    }
    if (hazard.kind !== 'storm') {
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(2,6,23,.75)';
      drawRoundedRect(ctx, -size * 0.7, -size - 13, size * 1.4, 5, 3);
      ctx.fill();
      ctx.fillStyle = '#fef3c7';
      drawRoundedRect(ctx, -size * 0.7, -size - 13, size * 1.4 * clamp(hazard.hp / hazard.maxHp, 0, 1), 5, 3);
      ctx.fill();
    }
    ctx.restore();
  });
  ctx.globalAlpha = 1;
  ctx.shadowColor = 'transparent';
}

function drawSupplies(ctx, game) {
  game.supplies.forEach((supply) => {
    const pos = project(supply.x, supply.y, supply.z);
    const size = clamp(70 * pos.scale, 18, 76);
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(Math.sin(supply.pulse) * 0.18);
    ctx.globalAlpha = clamp(1.18 - supply.z * 0.3, 0.46, 1);
    ctx.shadowColor = supply.color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = supply.color;
    drawRoundedRect(ctx, -size * 0.62, -size * 0.48, size * 1.24, size * 0.96, size * 0.18);
    ctx.fill();
    ctx.fillStyle = 'rgba(2,6,23,.74)';
    drawRoundedRect(ctx, -size * 0.36, -size * 0.19, size * 0.72, size * 0.38, size * 0.08);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = `900 ${Math.max(10, size * 0.18)}px Outfit, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(supply.kind === 'repair' ? 'HP' : supply.kind === 'coolant' ? 'ICE' : 'AMMO', 0, 0);
    ctx.restore();
  });
  ctx.globalAlpha = 1;
  ctx.shadowColor = 'transparent';
}

function drawLockReticles(ctx, game) {
  if (game.player.lockCharge < 0.05 || game.enemies.length === 0) return;
  const tier = getLockTier(game.player.lockCharge);
  const targets = pickLockTargets(game, tier.count);
  targets.forEach((target, index) => {
    const pos = project(target.x, target.y, target.z);
    const size = clamp((target.type === 'boss' ? 120 : 74) * pos.scale, 22, 130);
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(game.elapsed * 3 + index * 0.4);
    ctx.strokeStyle = game.player.lockCharge >= 0.92 ? '#facc15' : '#67e8f9';
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 16;
    ctx.lineWidth = Math.max(2, 5 * pos.scale);
    ctx.beginPath();
    ctx.arc(0, 0, size * (0.62 + game.player.lockCharge * 0.25), 0, Math.PI * 1.55);
    ctx.stroke();
    ctx.restore();
  });
  ctx.shadowColor = 'transparent';
}

function drawEnemy(ctx, enemy) {
  const pos = project(enemy.x, enemy.y, enemy.z);
  const size = Math.min(enemy.type === 'boss' ? 150 : 94, Math.max(12, enemy.r * 620 * pos.scale));
  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.shadowColor = enemy.color;
  ctx.shadowBlur = enemy.type === 'boss' ? 28 : 14;
  ctx.fillStyle = enemy.hitFlash > 0 ? '#f8fafc' : enemy.color;
  if (enemy.type === 'boss') {
    drawRoundedRect(ctx, -size, -size * 0.58, size * 2, size * 1.16, size * 0.18);
    ctx.fill();
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-size * 0.38, -size * 0.18, size * 0.76, size * 0.36);
  } else if (enemy.type === 'cruiser') {
    drawRoundedRect(ctx, -size * 0.78, -size * 0.58, size * 1.56, size * 1.16, size * 0.22);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.9, size * 0.72);
    ctx.lineTo(0, size * 0.38);
    ctx.lineTo(-size * 0.9, size * 0.72);
    ctx.closePath();
    ctx.fill();
  }
  ctx.shadowColor = 'transparent';
  const barW = enemy.type === 'boss' ? size * 2.3 : size * 1.4;
  ctx.fillStyle = 'rgba(2,6,23,.75)';
  drawRoundedRect(ctx, -barW / 2, -size - 16, barW, 6, 3);
  ctx.fill();
  ctx.fillStyle = enemy.type === 'boss' ? '#c4b5fd' : '#f87171';
  drawRoundedRect(ctx, -barW / 2, -size - 16, barW * (enemy.hp / enemy.maxHp), 6, 3);
  ctx.fill();
  if (enemy.type === 'boss') {
    ctx.fillStyle = '#f8fafc';
    ctx.font = `900 ${Math.max(10, 16 * pos.scale)}px Outfit, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`PHASE ${enemy.phaseLevel}`, 0, size * 0.78);
  }
  ctx.restore();
}

function drawProjectiles(ctx, game) {
  game.playerShots.forEach((shot) => {
    const pos = project(shot.x, shot.y, shot.z);
    const color = shot.source === 'wing' ? '#86efac' : '#67e8f9';
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, Math.max(3, 9 * pos.scale), 0, Math.PI * 2);
    ctx.fill();
  });
  game.missiles.forEach((missile) => {
    const pos = project(missile.x, missile.y, missile.z);
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, Math.max(5, 12 * pos.scale), 0, Math.PI * 2);
    ctx.fill();
  });
  game.enemyShots.forEach((shot) => {
    const pos = project(shot.x, shot.y, shot.z);
    ctx.fillStyle = shot.color;
    ctx.shadowColor = shot.color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, Math.max(4, 11 * pos.scale), 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.shadowColor = 'transparent';
}

function drawWingmen(ctx, game) {
  game.wingmen.forEach((wing) => {
    const pos = project(wing.x, wing.y, wing.z);
    const roll = Math.sin(wing.pulse) * 0.16 + wing.side * 0.08;
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(roll);
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 13;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(24, 16);
    ctx.lineTo(0, 8);
    ctx.lineTo(-24, 16);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  ctx.shadowColor = 'transparent';
}

function drawPlayer(ctx, game) {
  const player = game.player;
  const pos = project(player.x, player.y, 0.16);
  const roll = player.rollTimer > 0 ? Math.sin(game.elapsed * 42) * 0.75 : player.vx * 0.14;
  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(roll);
  ctx.shadowColor = player.rollTimer > 0 ? '#67e8f9' : '#22c55e';
  ctx.shadowBlur = player.rollTimer > 0 ? 24 : 14;
  ctx.fillStyle = player.invuln > 0 ? '#f8fafc' : '#22c55e';
  ctx.beginPath();
  ctx.moveTo(0, -34);
  ctx.lineTo(42, 30);
  ctx.lineTo(10, 18);
  ctx.lineTo(0, 44);
  ctx.lineTo(-10, 18);
  ctx.lineTo(-42, 30);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#bbf7d0';
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawParticles(ctx, game) {
  game.particles.forEach((particle) => {
    ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  game.floaters.forEach((floater) => {
    ctx.globalAlpha = clamp(floater.life, 0, 1);
    ctx.fillStyle = floater.color;
    ctx.font = '900 15px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(floater.text, floater.x, floater.y);
  });
  ctx.globalAlpha = 1;
}

function drawBar(ctx, x, y, w, value, max, color) {
  ctx.fillStyle = '#1f2937';
  drawRoundedRect(ctx, x, y, w, 10, 5);
  ctx.fill();
  ctx.fillStyle = color;
  drawRoundedRect(ctx, x, y, w * clamp(value / max, 0, 1), 10, 5);
  ctx.fill();
}

function drawHud(ctx, game) {
  const player = game.player;
  const activeGoals = game.goals.slice(0, 5);
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = 'rgba(2,6,23,.8)';
  drawRoundedRect(ctx, 28, 24, 382, 220, 20);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 27px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Sky Rail Pro: Learncade' : 'Faska Sky Rail Pro', 54, 62);
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(`Welle ${game.wave} · Score ${game.score} · x${game.multiplier}`, 54, 91);
  drawBar(ctx, 54, 108, 275, player.hp, player.maxHp, '#fb7185');
  drawBar(ctx, 54, 128, 275, player.shield, 100, '#67e8f9');
  drawBar(ctx, 54, 148, 275, 100 - player.heat, 100, '#facc15');
  drawBar(ctx, 54, 168, 275, 4.2 - player.novaCooldown, 4.2, '#a78bfa');
  drawBar(ctx, 54, 188, 275, player.lockCharge * 100, 100, '#22d3ee');
  drawBar(ctx, 54, 208, 275, 2.6 - player.assistCooldown, 2.6, '#86efac');
  ctx.textAlign = 'right';
  ctx.fillStyle = '#e0e7ff';
  ctx.font = '800 11px Outfit, sans-serif';
  ctx.fillText('HP / Schild / Hitze / Nova / Lock / Wing', 394, 232);

  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, WIDTH - 410, 24, 382, 220, 20);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 25px Outfit, sans-serif';
  ctx.fillText(`${game.enemies.length} Ziele`, WIDTH - 54, 62);
  ctx.fillStyle = '#facc15';
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText(`Combo ${game.combo} · Speed ${game.speed.toFixed(1)}`, WIDTH - 54, 94);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText(`Ringe ${game.stats.rings} · Lock ${game.stats.lockHits} · Evade ${game.stats.perfectEvades}`, WIDTH - 54, 118);
  ctx.fillText(`Wing ${game.stats.wingHits} · Gefahr ${game.stats.hazardsCleared} · Pods ${game.stats.supplies}`, WIDTH - 54, 136);
  ctx.textAlign = 'left';
  activeGoals.forEach((goal, index) => {
    const y = 162 + index * 18;
    const value = Math.min(game.stats[goal.stat] || 0, goal.target);
    ctx.fillStyle = goal.completed ? '#86efac' : '#e2e8f0';
    ctx.font = '800 12px Outfit, sans-serif';
    ctx.fillText(`${goal.completed ? 'DONE' : `${value}/${goal.target}`}  ${goal.label}`, WIDTH - 382, y);
  });

  if (game.mode === 'learn') {
    const task = LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.84)';
    drawRoundedRect(ctx, CENTER_X - 270, 106, 540, 72, 18);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 19px Outfit, sans-serif';
    ctx.fillText(task.prompt, CENTER_X, 134);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 13px Outfit, sans-serif';
    ctx.fillText(`${task.subject} - durchs richtige Gate fliegen`, CENTER_X, 158);
  }

  if (game.goalNoticeTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(15,23,42,.86)';
    drawRoundedRect(ctx, CENTER_X - 240, 188, 480, 46, 16);
    ctx.fill();
    ctx.fillStyle = '#86efac';
    ctx.font = '900 19px Outfit, sans-serif';
    ctx.fillText(game.goalNotice, CENTER_X, 216);
  }

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.78)';
    drawRoundedRect(ctx, CENTER_X - 330, HEIGHT - 94, 660, 54, 18);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 22px Outfit, sans-serif';
    ctx.fillText(game.message, CENTER_X, HEIGHT - 60);
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.74)';
  drawRoundedRect(ctx, 34, HEIGHT - 36, 1015, 28, 10);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 11px Outfit, sans-serif';
  ctx.fillText('WASD/Arrows fliegen · J/Maus Laser · E halten/loslassen Lock-on · Q Wingmen · Space rollen · Shift Boost · F Nova · M Modus · R Restart', 54, HEIGHT - 17);
  ctx.restore();
}

function renderGame(ctx, game) {
  const shakeX = game.shake > 0 ? Math.sin(game.elapsed * 80) * game.shake * 22 : 0;
  const shakeY = game.shake > 0 ? Math.cos(game.elapsed * 67) * game.shake * 16 : 0;
  ctx.save();
  ctx.translate(shakeX, shakeY);
  drawBackground(ctx, game);
  drawGates(ctx, game);
  drawRings(ctx, game);
  drawSupplies(ctx, game);
  drawHazards(ctx, game);
  [...game.enemies].sort((a, b) => b.z - a.z).forEach((enemy) => drawEnemy(ctx, enemy));
  drawLockReticles(ctx, game);
  drawProjectiles(ctx, game);
  drawWingmen(ctx, game);
  drawPlayer(ctx, game);
  drawParticles(ctx, game);
  ctx.restore();
  drawHud(ctx, game);
}

export default function FaskaSkyRailSwarm() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const modeRef = useRef('arcade');
  const gameRef = useRef(makeInitialGame('arcade'));
  const [mode, setMode] = useState('arcade');
  const [result, setResult] = useState(null);

  const restart = useCallback(() => {
    setResult(null);
    gameRef.current = makeInitialGame(modeRef.current);
  }, []);

  const setGameMode = useCallback((nextMode) => {
    modeRef.current = nextMode;
    setMode(nextMode);
    setResult(null);
    gameRef.current = makeInitialGame(nextMode);
  }, []);

  const setPressed = useCallback((name, pressed) => {
    gameRef.current.input[name] = pressed;
  }, []);

  const holdButton = useCallback((name) => ({
    onPointerDown: (event) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      setPressed(name, true);
    },
    onPointerUp: (event) => {
      event.preventDefault();
      setPressed(name, false);
    },
    onPointerCancel: () => setPressed(name, false),
    onPointerLeave: () => setPressed(name, false),
  }), [setPressed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;
    let raf = 0;
    let last = performance.now();
    const keyMap = new Map([
      ['w', 'up'], ['W', 'up'], ['ArrowUp', 'up'],
      ['s', 'down'], ['S', 'down'], ['ArrowDown', 'down'],
      ['a', 'left'], ['A', 'left'], ['ArrowLeft', 'left'],
      ['d', 'right'], ['D', 'right'], ['ArrowRight', 'right'],
      ['j', 'fire'], ['J', 'fire'], ['Control', 'fire'],
      ['e', 'missile'], ['E', 'missile'], ['l', 'missile'], ['L', 'missile'],
      ['q', 'assist'], ['Q', 'assist'], ['c', 'assist'], ['C', 'assist'],
      ['f', 'nova'], ['F', 'nova'],
      [' ', 'roll'],
      ['Shift', 'boost'],
    ]);
    const keyDown = (event) => {
      const mapped = keyMap.get(event.key);
      if (mapped) {
        gameRef.current.input[mapped] = true;
        event.preventDefault();
      }
      if (event.key === 'm' || event.key === 'M') setGameMode(modeRef.current === 'learn' ? 'arcade' : 'learn');
      if (event.key === 'r' || event.key === 'R') restart();
    };
    const keyUp = (event) => {
      const mapped = keyMap.get(event.key);
      if (mapped) {
        gameRef.current.input[mapped] = false;
        event.preventDefault();
      }
    };
    const pointerDown = (event) => {
      event.preventDefault();
      gameRef.current.input.fire = true;
    };
    const pointerUp = () => {
      gameRef.current.input.fire = false;
    };
    const blur = () => {
      Object.keys(gameRef.current.input).forEach((key) => {
        gameRef.current.input[key] = false;
      });
    };
    const loop = (now) => {
      const dt = Math.min(0.024, (now - last) / 1000 || 0);
      last = now;
      try {
        updateGame(gameRef.current, dt, setResult);
        renderGame(ctx, gameRef.current);
      } catch (err) {
        console.error("Game loop error:", err);
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    window.addEventListener('blur', blur);
    canvas.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointerup', pointerUp);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      window.removeEventListener('blur', blur);
      canvas.removeEventListener('pointerdown', pointerDown);
      window.removeEventListener('pointerup', pointerUp);
    };
  }, [restart, setGameMode]);

  const chromeTop = 'max(12px, calc((100vh - min(100vh, calc(100vw * 9 / 16))) / 2 + 8px))';
  const chromeBottom = 'calc((100vh - min(100vh, calc(100vw * 9 / 16))) / 2 + 22px)';
  const touchButton = {
    width: 70,
    height: 58,
    borderRadius: 15,
    border: '1px solid rgba(255,255,255,.18)',
    background: 'rgba(15,23,42,.78)',
    color: '#f8fafc',
    font: '900 12px Outfit, sans-serif',
    touchAction: 'none',
    userSelect: 'none',
    boxShadow: '0 12px 30px rgba(0,0,0,.32)',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#020617', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{
          position: 'absolute',
          inset: 0,
          margin: 'auto',
          width: 'min(100vw, calc(100vh * 16 / 9))',
          height: 'min(100vh, calc(100vw * 9 / 16))',
          display: 'block',
          touchAction: 'none',
          boxShadow: '0 0 140px rgba(99,102,241,.22), inset 0 0 90px rgba(34,211,238,.10), 0 0 90px rgba(0,0,0,.55)',
        }}
      />

      {/* Post-processing vignette overlay */}
      <div style={{
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

      <div style={{ position: 'fixed', top: chromeTop, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.56 }}>Normal</button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.56 }}>Learncade</button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      <div className="sky-touch-controls" style={{
        position: 'fixed',
        left: 26,
        right: 26,
        bottom: chromeBottom,
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 58px)', gap: 7, pointerEvents: 'auto' }}>
          <span />
          <button style={touchButton} {...holdButton('up')}>UP</button>
          <span />
          <button style={touchButton} {...holdButton('left')}>LEFT</button>
          <button style={touchButton} {...holdButton('down')}>DOWN</button>
          <button style={touchButton} {...holdButton('right')}>RIGHT</button>
        </div>
        <div style={{ display: 'flex', gap: 10, pointerEvents: 'auto', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 560 }}>
          <button style={{ ...touchButton, width: 82, background: 'rgba(14,165,233,.78)' }} {...holdButton('fire')}>FIRE</button>
          <button style={{ ...touchButton, width: 82, background: 'rgba(168,85,247,.78)' }} {...holdButton('missile')}>LOCK</button>
          <button style={{ ...touchButton, width: 82, background: 'rgba(34,211,238,.78)', color: '#082f49' }} {...holdButton('assist')}>WING</button>
          <button style={{ ...touchButton, width: 82, background: 'rgba(124,58,237,.84)' }} {...holdButton('nova')}>NOVA</button>
          <button style={{ ...touchButton, width: 82, background: 'rgba(34,197,94,.78)' }} {...holdButton('roll')}>ROLL</button>
          <button style={{ ...touchButton, width: 82, background: 'rgba(250,204,21,.82)', color: '#111827' }} {...holdButton('boost')}>BOOST</button>
        </div>
      </div>

      {result && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          background: 'rgba(2,6,23,.82)',
          color: '#f8fafc',
        }}>
          <div style={{ fontSize: 56, fontWeight: 900 }}>{result.title}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#facc15' }}>Welle {result.wave} · Score {result.score}</div>
          <button className="btn-primary" onClick={restart}>Neue Mission</button>
        </div>
      )}

      <style>{`
        @media (pointer: fine), (min-width: 900px) {
          .sky-touch-controls {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
