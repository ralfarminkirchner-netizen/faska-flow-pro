import { useCallback, useEffect, useRef, useState } from 'react';
import GameFxOverlay from '../../../../shared/GameFxOverlay';

const WIDTH = 1280;
const HEIGHT = 720;
const GROUND_Y = 608;

const TARGET_TYPES = {
  standard: { points: 120, radius: 32, speed: 150, color: '#f97316', hp: 1 },
  quick: { points: 190, radius: 26, speed: 235, color: '#38bdf8', hp: 1 },
  armored: { points: 260, radius: 36, speed: 118, color: '#a78bfa', hp: 2 },
  bonus: { points: 420, radius: 28, speed: 180, color: '#facc15', hp: 1 },
  shield: { points: 180, radius: 30, speed: 160, color: '#22c55e', hp: 1 },
  boss: { points: 1800, radius: 58, speed: 78, color: '#7c3aed', hp: 9 },
  hazard: { points: -160, radius: 34, speed: 125, color: '#fb7185', hp: 1 },
};

const WEAPONS = [
  { id: 'marksman', label: 'MARKSMAN', ammo: 8, reload: 0.92, damage: 1, assist: 0, color: '#fef3c7' },
  { id: 'scatter', label: 'SCATTER', ammo: 6, reload: 1.08, damage: 1, assist: 24, color: '#fdba74' },
  { id: 'piercer', label: 'PIERCER', ammo: 5, reload: 1.18, damage: 2, assist: 7, color: '#a78bfa' },
];

const TARGET_RUSH_GOALS = [
  { id: 'targets_24', label: '24 Ziele treffen', stat: 'targets', target: 24, mode: 'both', reward: 900 },
  { id: 'precision_8', label: '8 Praezisionstreffer', stat: 'precisionHits', target: 8, mode: 'arcade', reward: 820 },
  { id: 'boss_1', label: '1 Bossziel knacken', stat: 'bossKills', target: 1, mode: 'arcade', reward: 1350 },
  { id: 'bonus_4', label: '4 Bonusziele', stat: 'bonusTargets', target: 4, mode: 'both', reward: 760 },
  { id: 'shield_3', label: '3 Schildziele', stat: 'shieldTargets', target: 3, mode: 'both', reward: 680 },
  { id: 'weapons_4', label: '4 Waffenwechsel', stat: 'weaponSwaps', target: 4, mode: 'both', reward: 620 },
  { id: 'learn_5', label: '5 Learn-Antworten', stat: 'learnCorrect', target: 5, mode: 'learn', reward: 1250 },
];

const SHOOTING_CONTRACTS = [
  {
    id: 'hotStreak',
    label: '6 Trefferkette',
    stat: 'hit',
    target: 6,
    seconds: 28,
    reward: { score: 720, focus: 14, time: 3 },
  },
  {
    id: 'precisionRun',
    label: '3 Praezisionstreffer',
    stat: 'precision',
    target: 3,
    seconds: 34,
    reward: { score: 840, focus: 20, fever: 3.5 },
  },
  {
    id: 'bonusSweep',
    label: '2 Bonusziele',
    stat: 'bonus',
    target: 2,
    seconds: 38,
    reward: { score: 780, time: 4, fever: 3 },
  },
  {
    id: 'shieldWork',
    label: '2 Schildziele',
    stat: 'shield',
    target: 2,
    seconds: 42,
    reward: { score: 680, shield: 45, focus: 10 },
  },
  {
    id: 'weaponCraft',
    label: '2 Waffenwechsel-Treffer',
    stat: 'weaponHit',
    target: 2,
    seconds: 40,
    reward: { score: 760, focus: 16, ammo: 3 },
  },
  {
    id: 'bossCrack',
    label: '1 Boss knacken',
    stat: 'boss',
    target: 1,
    seconds: 58,
    reward: { score: 1450, fever: 5, shield: 30 },
  },
  {
    id: 'cleanHands',
    label: 'Kein Gefahrenziel',
    stat: 'clean',
    target: 18,
    seconds: 32,
    reward: { score: 900, focus: 18, time: 3 },
  },
  {
    id: 'learnAnswer',
    label: '3 richtige Antworten',
    stat: 'learn',
    target: 3,
    seconds: 46,
    mode: 'learn',
    reward: { score: 1050, focus: 18, time: 5, fever: 4 },
  },
];

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    prompt: 'Welche Wortart ist "springt"?',
    correct: 'Verb',
    options: ['Verb', 'Nomen', 'Adjektiv', 'Artikel'],
  },
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    prompt: 'Welche Wortart ist "Muenze"?',
    correct: 'Nomen',
    options: ['Nomen', 'Verb', 'Adjektiv', 'Praeposition'],
  },
  {
    subject: 'Deutsch',
    kind: 'Satzbau',
    prompt: 'Was passt in die Luecke: Der Ninja ___ leise.',
    correct: 'schleicht',
    options: ['schleicht', 'blaue', 'unter', 'vier'],
  },
  {
    subject: 'Lesen',
    kind: 'Ort lesen',
    prompt: 'Triff den Ort, an dem man Buecher leiht.',
    correct: 'Bibliothek',
    options: ['Bibliothek', 'Werkstatt', 'Arena', 'Bahnhof'],
  },
  {
    subject: 'Mathe',
    kind: 'Ergebnis',
    prompt: '7 x 8 = ?',
    correct: '56',
    options: ['56', '48', '64', '54'],
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    prompt: 'Was bedeutet "target"?',
    correct: 'Ziel',
    options: ['Ziel', 'Schild', 'Schatz', 'Weg'],
  },
  {
    subject: 'Sachkunde',
    kind: 'Kategorie',
    prompt: 'Was ist die Sonne?',
    correct: 'Stern',
    options: ['Stern', 'Planet', 'Wolke', 'Stein'],
  },
  {
    subject: 'Deutsch',
    kind: 'Praeposition',
    prompt: 'In "unter dem Tor" ist "unter" eine ...',
    correct: 'Praeposition',
    options: ['Praeposition', 'Nomen', 'Verb', 'Zahlwort'],
  },
  {
    subject: 'Mathe',
    kind: 'Zahlzerlegung',
    prompt: 'Welche Aufgabe ergibt 100?',
    correct: '4 x 25',
    options: ['4 x 25', '6 x 12', '90 - 8', '33 + 44'],
  },
  {
    subject: 'Deutsch',
    kind: 'Adjektiv',
    prompt: 'Welches Wort beschreibt eine Eigenschaft?',
    correct: 'mutig',
    options: ['mutig', 'rennen', 'Turm', 'unter'],
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    prompt: 'Was bedeutet "shield"?',
    correct: 'Schild',
    options: ['Schild', 'Baum', 'Schnee', 'Stuhl'],
  },
  {
    subject: 'Sachkunde',
    kind: 'Koerper',
    prompt: 'Womit sehen Menschen?',
    correct: 'Augen',
    options: ['Augen', 'Knie', 'Haare', 'Fuesse'],
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function seededUnit(index, salt) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
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

function makeClouds() {
  return Array.from({ length: 9 }, (_, index) => ({
    x: seededUnit(index, 1) * WIDTH,
    y: 58 + seededUnit(index, 2) * 160,
    scale: 0.7 + seededUnit(index, 3) * 0.85,
    speed: 12 + seededUnit(index, 4) * 24,
    alpha: 0.22 + seededUnit(index, 5) * 0.28,
  }));
}

function readHighScore() {
  try {
    return Number(window.localStorage.getItem('faska_target_highscore') || 0);
  } catch {
    return 0;
  }
}

function writeHighScore(score) {
  try {
    if (score > readHighScore()) window.localStorage.setItem('faska_target_highscore', String(score));
  } catch {
    // Private contexts can block localStorage.
  }
}

function currentTask(game) {
  return LEARN_TASKS[game.learnIndex % LEARN_TASKS.length];
}

function currentWeapon(game) {
  return WEAPONS[game.weaponIndex % WEAPONS.length];
}

function createStats() {
  return {
    targets: 0,
    precisionHits: 0,
    bossKills: 0,
    bonusTargets: 0,
    shieldTargets: 0,
    weaponSwaps: 0,
    learnCorrect: 0,
  };
}

function createGoals(mode) {
  const weight = goal => (goal.mode === mode ? 0 : goal.mode === 'both' ? 1 : 2);
  return TARGET_RUSH_GOALS
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
  game.message = `Mission: ${completed.label} +${completed.reward}`;
  game.messageTimer = 1.15;
}

function startNextContract(game) {
  const candidates = SHOOTING_CONTRACTS.filter((contract) => {
    if (contract.mode && contract.mode !== game.mode) return false;
    if (contract.id === 'bossCrack' && game.mode !== 'arcade') return false;
    return true;
  });
  if (candidates.length === 0) return;
  game.contractIndex += 1;
  game.contract = candidates[game.contractIndex % candidates.length];
  game.contractProgress = 0;
  game.contractTimer = game.contract.seconds + Math.min(14, game.level * 1.2);
  game.message = `Auftrag: ${game.contract.label}`;
  game.messageTimer = 1.05;
}

function advanceContract(game, stat, amount = 1, x = game.reticle.x, y = game.reticle.y) {
  if (!game.contract || game.contract.stat !== stat) return;
  game.contractProgress = Math.min(game.contract.target, game.contractProgress + Math.max(1, amount));
  if (game.contractProgress < game.contract.target) return;
  completeContract(game, x, y);
}

function completeContract(game, x = game.reticle.x, y = game.reticle.y) {
  if (!game.contract) return;
  const reward = game.contract.reward;
  const bonus = reward.score + game.level * 60 + game.contractMedals * 85;
  game.score += bonus;
  game.focus = Math.min(100, game.focus + (reward.focus || 0));
  game.time = Math.min(game.mode === 'learn' ? 112 : 92, game.time + (reward.time || 0));
  game.fever = Math.max(game.fever, reward.fever || 0);
  game.shield = Math.min(100, game.shield + (reward.shield || 0));
  game.ammo = Math.min(game.maxAmmo, game.ammo + (reward.ammo || 0));
  game.contractMedals += 1;
  addFloater(game, x, y - 16, `Auftrag +${bonus}`, '#facc15');
  spawnParticles(game, x, y, '#facc15', 24, 260);
  game.message = `${game.contract.label}: geschafft`;
  game.messageTimer = 1.15;
  game.contract = null;
  game.contractProgress = 0;
  game.contractTimer = 0;
  game.contractCooldown = 1.9;
}

function failContract(game) {
  if (!game.contract) return;
  game.contractFails += 1;
  game.focus = Math.max(0, game.focus - 10);
  game.message = `${game.contract.label}: verpasst`;
  game.messageTimer = 0.9;
  game.contract = null;
  game.contractProgress = 0;
  game.contractTimer = 0;
  game.contractCooldown = 1.4;
}

function updateContract(game, dt) {
  if (game.contract) {
    game.contractTimer = Math.max(0, game.contractTimer - dt);
    if (game.contractTimer <= 0) failContract(game);
    return;
  }
  game.contractCooldown = Math.max(0, game.contractCooldown - dt);
  if (game.contractCooldown <= 0) startNextContract(game);
}

function makeTarget(game, type = 'standard', overrides = {}) {
  const spec = TARGET_TYPES[type];
  const fromLeft = seededUnit(game.spawnSeed, 9) > 0.5;
  const lane = overrides.lane ?? Math.floor(seededUnit(game.spawnSeed, 7) * 4);
  const laneY = [192, 276, 362, 454][lane] + seededUnit(game.spawnSeed, 11) * 18;
  const radius = overrides.radius ?? spec.radius;
  const direction = fromLeft ? 1 : -1;
  const speed = (overrides.speed ?? spec.speed) * (1 + game.level * 0.035) * direction;
  const depth = overrides.depth ?? (0.72 + seededUnit(game.spawnSeed, 13) * 0.42);
  game.spawnSeed += 1;

  return {
    id: `target_${game.nextId}`,
    type,
    x: overrides.x ?? (fromLeft ? -80 : WIDTH + 80),
    y: overrides.y ?? laneY,
    vx: overrides.vx ?? speed,
    vy: overrides.vy ?? (Math.sin(game.spawnSeed) * 12),
    baseY: overrides.y ?? laneY,
    radius,
    depth,
    hp: overrides.hp ?? spec.hp,
    maxHp: overrides.hp ?? spec.hp,
    color: overrides.color ?? spec.color,
    points: overrides.points ?? spec.points,
    label: overrides.label ?? '',
    correct: Boolean(overrides.correct),
    life: overrides.life ?? 9,
    wobble: seededUnit(game.spawnSeed, 17) * Math.PI * 2,
    hitTimer: 0,
    escaped: false,
  };
}

function makeInitialGame(mode = 'arcade') {
  const game = {
    mode,
    started: false,
    finished: false,
    elapsed: 0,
    clouds: makeClouds(),
    targets: [],
    flakes: [],
    particles: [],
    floaters: [],
    shotTrails: [],
    nextId: 1,
    spawnSeed: 1,
    spawnTimer: 0.25,
    waveTimer: 0,
    bossTimer: mode === 'learn' ? 999 : 14,
    time: mode === 'learn' ? 92 : 76,
    score: 0,
    highScore: readHighScore(),
    level: 1,
    combo: 0,
    comboTimer: 0,
    ammo: 8,
    maxAmmo: 8,
    weaponIndex: 0,
    powerShot: false,
    reloadTimer: 0,
    lives: 5,
    shield: 0,
    focus: mode === 'learn' ? 75 : 50,
    streak: 0,
    fever: 0,
    learnIndex: 0,
    correct: 0,
    wrong: 0,
    shots: 0,
    hits: 0,
    reticle: { x: WIDTH / 2, y: HEIGHT / 2 },
    wind: 0,
    contract: null,
    contractIndex: -1,
    contractProgress: 0,
    contractTimer: 0,
    contractCooldown: 0.7,
    contractMedals: 0,
    contractFails: 0,
    lastWeaponIndex: 0,
    swappedSinceHit: false,
    stats: createStats(),
    goals: createGoals(mode),
    message: mode === 'learn'
      ? 'Triff das Ziel mit der richtigen Antwort.'
      : 'Trefferketten, Praezision und Auftraege sauber spielen.',
    messageTimer: 2.4,
    shake: 0,
  };

  seedInitialTargets(game);
  return game;
}

function seedInitialTargets(game) {
  game.targets = [];
  game.nextId = 1;
  if (game.mode === 'learn') {
    spawnAnswerSet(game);
  } else {
    for (let i = 0; i < 5; i += 1) {
      game.targets.push(makeTarget(game, i === 2 ? 'quick' : 'standard', {
        x: 190 + i * 210,
        y: [214, 314, 420, 270, 376][i],
        vx: (i % 2 === 0 ? 1 : -1) * (80 + i * 18),
      }));
      game.nextId += 1;
    }
  }
}

function spawnAnswerSet(game) {
  const task = currentTask(game);
  const orderOffset = Math.floor(seededUnit(game.learnIndex + 1, game.spawnSeed + 3) * task.options.length);
  const options = task.options.map((_, index) => task.options[(index + orderOffset) % task.options.length]);
  const positions = [
    { x: 225, y: 242, vx: 58 },
    { x: 485, y: 332, vx: -48 },
    { x: 750, y: 248, vx: 52 },
    { x: 1015, y: 402, vx: -58 },
  ];

  options.forEach((option, index) => {
    const position = positions[index];
    const target = makeTarget(game, option === task.correct ? 'bonus' : 'armored', {
      x: position.x,
      y: position.y,
      vx: position.vx + (game.learnIndex % 2 === 0 ? 1 : -1) * game.level * 5,
      label: option,
      correct: option === task.correct,
      color: option === task.correct ? '#22c55e' : '#475569',
      points: option === task.correct ? 520 : -180,
      hp: 1,
      radius: option.length > 9 ? 40 : 36,
      depth: 1,
      life: 10,
    });
    game.targets.push(target);
    game.nextId += 1;
  });
}

function addFloater(game, x, y, text, color = '#facc15') {
  game.floaters.push({ x, y, text, color, life: 1, maxLife: 1, vy: -48 });
}

function spawnParticles(game, x, y, color, count = 14, speed = 170) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed * 2;
    const burst = speed * (0.32 + (i % 5) * 0.13);
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * burst,
      vy: Math.sin(angle) * burst,
      size: 3 + (i % 4),
      color,
      life: 0.55,
      maxLife: 0.55,
    });
  }
}

function addShotTrail(game, fromX, fromY, toX, toY, color = '#fef3c7') {
  game.shotTrails.push({ fromX, fromY, toX, toY, color, life: 0.18, maxLife: 0.18 });
}

function reload(game) {
  if (game.reloadTimer > 0 || game.ammo === game.maxAmmo) return;
  game.reloadTimer = game.fever > 0 ? currentWeapon(game).reload * 0.62 : currentWeapon(game).reload;
  game.message = 'Nachladen';
  game.messageTimer = 0.45;
}

function cycleWeapon(game, explicitIndex = null) {
  const nextIndex = explicitIndex === null ? (game.weaponIndex + 1) % WEAPONS.length : explicitIndex % WEAPONS.length;
  if (nextIndex === game.weaponIndex) return;
  game.weaponIndex = nextIndex;
  game.lastWeaponIndex = nextIndex;
  game.swappedSinceHit = true;
  game.maxAmmo = WEAPONS[nextIndex].ammo + Math.max(0, Math.floor((game.level - 1) / 3));
  game.ammo = Math.min(game.ammo, game.maxAmmo);
  if (game.ammo <= 0) game.ammo = Math.ceil(game.maxAmmo / 2);
  recordStat(game, 'weaponSwaps');
  game.message = `Waffe: ${currentWeapon(game).label}`;
  game.messageTimer = 0.8;
}

function finishGame(game, message) {
  game.finished = true;
  game.started = false;
  game.message = message;
  game.messageTimer = 4;
  writeHighScore(game.score);
  game.highScore = Math.max(game.highScore, game.score);
}

function scoreTarget(game, target, hitX, hitY) {
  const centerDistance = distance({ x: hitX, y: hitY }, target);
  const precision = clamp(1 - centerDistance / Math.max(1, target.radius), 0, 1);
  const precisionBonus = Math.round(precision * 120);
  game.combo += 1;
  game.comboTimer = 2.1;
  game.streak += 1;
  game.hits += 1;
  game.focus = Math.min(100, game.focus + 7 + precision * 6);
  advanceContract(game, 'hit', 1, target.x, target.y);
  advanceContract(game, 'clean', 1, target.x, target.y);
  if (precision > 0.72) advanceContract(game, 'precision', 1, target.x, target.y);
  if (game.swappedSinceHit) {
    advanceContract(game, 'weaponHit', 1, target.x, target.y);
    game.swappedSinceHit = false;
  }

  let points = Math.round(target.points + game.combo * 38 + precisionBonus + game.level * 24);
  if (game.fever > 0) points = Math.round(points * 1.35);
  game.score += points;
  addFloater(game, target.x, target.y - target.radius - 12, `+${points}`, '#facc15');
  spawnParticles(game, target.x, target.y, target.color, target.type === 'bonus' ? 28 : 18, 220);

  if (target.type === 'bonus') {
    recordStat(game, 'bonusTargets');
    advanceContract(game, 'bonus', 1, target.x, target.y);
    game.time = Math.min(game.mode === 'learn' ? 110 : 86, game.time + 3.5);
    game.fever = Math.max(game.fever, 4);
  }
  if (target.type === 'shield') {
    recordStat(game, 'shieldTargets');
    advanceContract(game, 'shield', 1, target.x, target.y);
    game.shield = Math.min(100, game.shield + 42);
    game.focus = Math.min(100, game.focus + 16);
    addFloater(game, target.x, target.y + target.radius + 24, 'SCHILD', '#22c55e');
  }
  if (target.type === 'boss') {
    recordStat(game, 'bossKills');
    advanceContract(game, 'boss', 1, target.x, target.y);
    game.time = Math.min(game.mode === 'learn' ? 110 : 92, game.time + 7);
    game.fever = Math.max(game.fever, 7);
    game.shield = Math.min(100, game.shield + 35);
  }
  recordStat(game, 'targets');
  if (precision > 0.72) recordStat(game, 'precisionHits');

  if (game.score >= game.level * 1500) {
    game.level += 1;
    game.maxAmmo = Math.min(14, currentWeapon(game).ammo + Math.floor(game.level / 3));
    game.ammo = game.maxAmmo;
    game.time = Math.min(game.mode === 'learn' ? 110 : 86, game.time + 5);
    game.message = `Level ${game.level}`;
    game.messageTimer = 1;
  }
}

function handleLearnTarget(game, target, hitX, hitY) {
  const task = currentTask(game);
  if (target.correct) {
    game.correct += 1;
    game.learnIndex += 1;
    recordStat(game, 'learnCorrect');
    advanceContract(game, 'learn', 1, target.x, target.y);
    game.message = `${task.correct} stimmt`;
    game.messageTimer = 1;
    scoreTarget(game, target, hitX, hitY);
    game.targets = game.targets.filter((candidate) => !candidate.label || candidate.id === target.id);
    spawnAnswerSet(game);
    return;
  }

  game.wrong += 1;
  game.combo = 0;
  game.streak = 0;
  game.focus = Math.max(0, game.focus - 16);
  game.score = Math.max(0, game.score - 180);
  game.time = Math.max(8, game.time - 4);
  if (game.contract?.stat === 'learn') failContract(game);
  game.message = `${target.label} passt nicht. Gesucht: ${task.correct}`;
  game.messageTimer = 1.25;
  addFloater(game, target.x, target.y - target.radius - 12, 'falsch', '#fb7185');
  spawnParticles(game, target.x, target.y, '#fb7185', 18, 210);
}

function fireAt(game, x, y) {
  if (!game.started || game.finished) {
    game.started = true;
    game.finished = false;
    game.message = game.mode === 'learn'
      ? 'Triff die richtige Antwort im Feld.'
      : 'Ziele schnell und halte die Combo.';
    game.messageTimer = 1.4;
    return;
  }
  if (game.reloadTimer > 0) return;
  if (game.ammo <= 0) {
    reload(game);
    return;
  }

  const weapon = currentWeapon(game);
  const charged = game.powerShot && game.focus >= 38;
  const driftX = game.wind * 18 * (1 - game.focus / 140);
  const aim = { x: x + driftX, y };
  game.ammo -= 1;
  game.shots += 1;
  if (charged) {
    game.focus = Math.max(0, game.focus - 38);
    game.powerShot = false;
  }
  addShotTrail(game, WIDTH / 2, HEIGHT + 40, aim.x, aim.y, charged ? '#a78bfa' : weapon.color);
  game.shake = charged ? 0.09 : 0.04;

  const sorted = [...game.targets]
    .filter((target) => !target.escaped)
    .sort((a, b) => b.depth - a.depth);
  const target = sorted.find((candidate) => distance(aim, candidate) <= candidate.radius * candidate.depth + weapon.assist + (charged ? 16 : 0));

  if (!target) {
    game.combo = 0;
    game.streak = 0;
    if (['hit', 'precision', 'weaponHit'].includes(game.contract?.stat)) game.contractProgress = 0;
    game.focus = Math.max(0, game.focus - 4);
    addFloater(game, aim.x, aim.y - 14, 'daneben', '#cbd5e1');
    spawnParticles(game, aim.x, aim.y, '#e2e8f0', 6, 90);
    if (game.ammo <= 0) reload(game);
    return;
  }

  target.hp -= weapon.damage + (charged ? 1 : 0);
  target.hitTimer = 0.12;
  spawnParticles(game, aim.x, aim.y, charged ? '#a78bfa' : '#fef3c7', charged ? 14 : 8, 120);

  if (target.type === 'hazard') {
    game.combo = 0;
    game.streak = 0;
    if (['hit', 'precision', 'weaponHit'].includes(game.contract?.stat)) game.contractProgress = 0;
    if (game.contract?.stat === 'clean') failContract(game);
    game.score = Math.max(0, game.score - 240);
    if (game.shield > 0) game.shield = Math.max(0, game.shield - 42);
    else game.lives -= 1;
    game.focus = Math.max(0, game.focus - 22);
    game.message = game.shield > 0 ? 'Schild blockt Gefahr' : 'Gefahrenziel getroffen';
    game.messageTimer = 0.85;
    target.hp = 0;
    spawnParticles(game, target.x, target.y, '#fb7185', 22, 240);
    if (game.lives <= 0) finishGame(game, 'Mission verloren');
  } else if (target.hp <= 0) {
    if (game.mode === 'learn' && target.label) handleLearnTarget(game, target, aim.x, aim.y);
    else scoreTarget(game, target, aim.x, aim.y);
  }

  game.targets = game.targets.filter((candidate) => candidate.hp > 0);
  if (game.ammo <= 0) reload(game);
}

function spawnArcadeTarget(game) {
  const roll = seededUnit(game.spawnSeed, game.level);
  const type = roll > 0.94 ? 'shield' : roll > 0.88 ? 'bonus' : roll > 0.76 ? 'hazard' : roll > 0.58 ? 'quick' : roll > 0.36 ? 'armored' : 'standard';
  const target = makeTarget(game, type);
  game.targets.push(target);
  game.nextId += 1;
}

function spawnBossWave(game) {
  if (game.targets.some(target => target.type === 'boss')) return;
  const boss = makeTarget(game, 'boss', {
    x: WIDTH + 120,
    y: 258 + seededUnit(game.level, 22) * 120,
    vx: -72 - game.level * 5,
    vy: 0,
    life: 18,
    depth: 1.08,
    label: 'BOSS',
  });
  game.targets.push(boss);
  game.nextId += 1;
  for (let i = 0; i < 2; i += 1) {
    game.targets.push(makeTarget(game, i === 0 ? 'shield' : 'quick', {
      x: WIDTH + 170 + i * 80,
      y: 170 + i * 210,
      vx: -110 - i * 32,
      life: 12,
    }));
    game.nextId += 1;
  }
  game.message = 'Bosswelle: Schilde nutzen, Kern knacken';
  game.messageTimer = 1.3;
}

function updateTargets(game, dt) {
  game.targets.forEach((target) => {
    target.hitTimer = Math.max(0, target.hitTimer - dt);
    target.life -= dt;
    target.x += (target.vx + game.wind * 18) * dt;
    target.y = target.baseY + Math.sin(game.elapsed * 3.2 + target.wobble) * 14 * target.depth + target.vy * dt;
    if (target.x < -140 || target.x > WIDTH + 140 || target.life <= 0) target.escaped = true;
  });

  const escapedScoringTargets = game.targets.filter((target) => target.escaped && target.type !== 'hazard' && target.type !== 'bonus');
  if (game.started && escapedScoringTargets.length > 0 && game.mode === 'arcade') {
    game.lives = Math.max(0, game.lives - escapedScoringTargets.length);
    game.combo = 0;
    game.focus = Math.max(0, game.focus - 8 * escapedScoringTargets.length);
    game.message = escapedScoringTargets.length > 1 ? 'Ziele entkommen' : 'Ziel entkommen';
    game.messageTimer = 0.8;
    if (game.lives <= 0) finishGame(game, 'Mission verloren');
  }

  game.targets = game.targets.filter((target) => !target.escaped);

  if (game.mode === 'learn') {
    const labelled = game.targets.filter((target) => target.label);
    if (labelled.length === 0) spawnAnswerSet(game);
  }
}

function updateEffects(game, dt) {
  game.clouds.forEach((cloud) => {
    cloud.x += cloud.speed * dt;
    if (cloud.x > WIDTH + 130) cloud.x = -130;
  });

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

  game.shotTrails = game.shotTrails
    .map((trail) => ({ ...trail, life: trail.life - dt }))
    .filter((trail) => trail.life > 0);
}

function updateGame(game, dt) {
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.comboTimer = Math.max(0, game.comboTimer - dt);
  game.shake = Math.max(0, game.shake - dt);
  game.fever = Math.max(0, game.fever - dt);
  game.shield = Math.max(0, game.shield - dt * 2.2);
  if (game.comboTimer <= 0) game.combo = 0;
  game.wind = lerp(game.wind, Math.sin(game.elapsed * 0.8 + game.level) * 0.8, 0.01);

  updateEffects(game, dt);
  if (!game.started || game.finished) return;
  updateContract(game, dt);

  game.time -= dt;
  if (game.time <= 0) {
    finishGame(game, game.mode === 'learn' ? 'Learncade-Runde beendet' : 'Zeit vorbei');
    return;
  }

  if (game.reloadTimer > 0) {
    game.reloadTimer -= dt;
    if (game.reloadTimer <= 0) {
      game.reloadTimer = 0;
      game.ammo = game.maxAmmo;
    }
  }

  if (game.mode === 'arcade') {
    game.bossTimer -= dt;
    if (game.bossTimer <= 0) {
      game.bossTimer = clamp(24 - game.level * 1.2, 12, 24);
      spawnBossWave(game);
    }
    game.spawnTimer -= dt;
    if (game.spawnTimer <= 0) {
      spawnArcadeTarget(game);
      game.spawnTimer = clamp(1.0 - game.level * 0.055, 0.36, 1);
    }
  } else {
    game.waveTimer += dt;
    if (game.waveTimer > 5.5 && game.targets.filter((target) => target.label).length < 4) {
      game.waveTimer = 0;
      spawnAnswerSet(game);
    }
  }

  updateTargets(game, dt);
}

function drawBackground(ctx, game) {
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, '#0f172a');
  sky.addColorStop(0.45, '#155e75');
  sky.addColorStop(1, '#14532d');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.globalAlpha = 0.38;
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.arc(1030, 118, 54, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  game.clouds.forEach((cloud) => {
    ctx.save();
    ctx.globalAlpha = cloud.alpha;
    ctx.translate(cloud.x, cloud.y);
    ctx.scale(cloud.scale, cloud.scale);
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.arc(-34, 8, 28, 0, Math.PI * 2);
    ctx.arc(0, -4, 38, 0, Math.PI * 2);
    ctx.arc(40, 10, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(0, 356);
  for (let x = 0; x <= WIDTH; x += 130) {
    ctx.lineTo(x, 350 + Math.sin(x * 0.012) * 38);
  }
  ctx.lineTo(WIDTH, HEIGHT);
  ctx.lineTo(0, HEIGHT);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#166534';
  ctx.beginPath();
  ctx.moveTo(0, 450);
  for (let x = 0; x <= WIDTH; x += 96) {
    ctx.lineTo(x, 448 + Math.sin(x * 0.018 + 1) * 28);
  }
  ctx.lineTo(WIDTH, HEIGHT);
  ctx.lineTo(0, HEIGHT);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#14532d';
  ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);
  ctx.strokeStyle = 'rgba(187,247,208,.18)';
  ctx.lineWidth = 2;
  for (let x = -40; x < WIDTH; x += 82) {
    ctx.beginPath();
    ctx.moveTo(x, GROUND_Y);
    ctx.lineTo(x + 160, HEIGHT);
    ctx.stroke();
  }
  for (let y = GROUND_Y + 18; y < HEIGHT; y += 26) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
}

function drawTarget(ctx, target, elapsed) {
  const wobble = Math.sin(elapsed * 5 + target.wobble) * 0.08;
  const scale = target.depth * (1 + wobble);
  ctx.save();
  ctx.translate(target.x, target.y);
  ctx.scale(scale, scale);
  ctx.shadowColor = target.hitTimer > 0 ? '#fef3c7' : target.color;
  ctx.shadowBlur = target.hitTimer > 0 ? 28 : 18;

  if (target.type === 'hazard') {
    ctx.fillStyle = target.hitTimer > 0 ? '#fef3c7' : '#7f1d1d';
    drawRoundedRect(ctx, -target.radius, -target.radius, target.radius * 2, target.radius * 2, 12);
    ctx.fill();
    ctx.strokeStyle = '#fecaca';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-16, -16);
    ctx.lineTo(16, 16);
    ctx.moveTo(16, -16);
    ctx.lineTo(-16, 16);
    ctx.stroke();
  } else if (target.type === 'boss') {
    ctx.fillStyle = target.hitTimer > 0 ? '#fef3c7' : target.color;
    drawRoundedRect(ctx, -target.radius * 1.25, -target.radius * 0.78, target.radius * 2.5, target.radius * 1.56, 18);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#312e81';
    drawRoundedRect(ctx, -target.radius * 0.48, -target.radius * 0.28, target.radius * 0.96, target.radius * 0.56, 10);
    ctx.fill();
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, target.radius * 0.62, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(2,6,23,.72)';
    drawRoundedRect(ctx, -54, target.radius + 12, 108, 8, 4);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    drawRoundedRect(ctx, -54, target.radius + 12, 108 * (target.hp / target.maxHp), 8, 4);
    ctx.fill();
  } else {
    ctx.fillStyle = target.hitTimer > 0 ? '#fef3c7' : target.color;
    ctx.beginPath();
    ctx.arc(0, 0, target.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, target.radius * 0.72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(15,23,42,.55)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-target.radius * 0.9, 0);
    ctx.lineTo(target.radius * 0.9, 0);
    ctx.moveTo(0, -target.radius * 0.9);
    ctx.lineTo(0, target.radius * 0.9);
    ctx.stroke();
    if (target.maxHp > 1) {
      ctx.fillStyle = 'rgba(2,6,23,.7)';
      drawRoundedRect(ctx, -28, target.radius + 10, 56, 6, 3);
      ctx.fill();
      ctx.fillStyle = '#fef3c7';
      drawRoundedRect(ctx, -28, target.radius + 10, 56 * (target.hp / target.maxHp), 6, 3);
      ctx.fill();
    }
  }

  if (target.label) {
    ctx.fillStyle = target.correct ? 'rgba(34,197,94,.94)' : 'rgba(15,23,42,.88)';
    drawRoundedRect(ctx, -64, -16, 128, 32, 12);
    ctx.fill();
    ctx.fillStyle = target.correct ? '#052e16' : '#f8fafc';
    ctx.font = target.label.length > 10 ? '900 12px Outfit, sans-serif' : '900 15px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(target.label, 0, 1, 116);
  }

  ctx.restore();
}

function drawTrails(ctx, game) {
  game.shotTrails.forEach((trail) => {
    ctx.save();
    ctx.globalAlpha = clamp(trail.life / trail.maxLife, 0, 1);
    ctx.strokeStyle = trail.color;
    ctx.shadowColor = trail.color;
    ctx.shadowBlur = 14;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(trail.fromX, trail.fromY);
    ctx.lineTo(trail.toX, trail.toY);
    ctx.stroke();
    ctx.restore();
  });
}

function drawEffects(ctx, game) {
  game.particles.forEach((particle) => {
    ctx.save();
    ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  game.floaters.forEach((floater) => {
    ctx.save();
    ctx.globalAlpha = clamp(floater.life / floater.maxLife, 0, 1);
    ctx.fillStyle = floater.color;
    ctx.font = '900 18px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(floater.text, floater.x, floater.y);
    ctx.restore();
  });
}

function drawReticle(ctx, game) {
  const { x, y } = game.reticle;
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = game.reloadTimer > 0 ? '#fb7185' : '#f8fafc';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0, 0, 17, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-30, 0);
  ctx.lineTo(-9, 0);
  ctx.moveTo(9, 0);
  ctx.lineTo(30, 0);
  ctx.moveTo(0, -30);
  ctx.lineTo(0, -9);
  ctx.moveTo(0, 9);
  ctx.lineTo(0, 30);
  ctx.stroke();
  ctx.restore();
}

function drawAmmo(ctx, game) {
  const startX = WIDTH / 2 - (game.maxAmmo * 16) / 2;
  for (let i = 0; i < game.maxAmmo; i += 1) {
    ctx.fillStyle = i < game.ammo ? '#facc15' : 'rgba(148,163,184,.28)';
    drawRoundedRect(ctx, startX + i * 16, HEIGHT - 44, 9, 30, 4);
    ctx.fill();
  }
  if (game.reloadTimer > 0) {
    ctx.fillStyle = 'rgba(2,6,23,.8)';
    drawRoundedRect(ctx, WIDTH / 2 - 92, HEIGHT - 88, 184, 28, 10);
    ctx.fill();
    ctx.fillStyle = '#fb7185';
    ctx.font = '900 14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NACHLADEN', WIDTH / 2, HEIGHT - 68);
  }
}

function drawGauge(ctx, x, y, w, label, value, color) {
  ctx.fillStyle = 'rgba(148,163,184,.18)';
  drawRoundedRect(ctx, x, y + 18, w, 10, 5);
  ctx.fill();
  ctx.fillStyle = color;
  drawRoundedRect(ctx, x, y + 18, w * clamp(value / 100, 0, 1), 10, 5);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '800 11px Outfit, sans-serif';
  ctx.fillText(label, x, y + 10);
}

function drawHud(ctx, game) {
  const weapon = currentWeapon(game);
  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, 24, 22, 468, game.mode === 'learn' ? 200 : 164, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 25px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Faska Learn Target Rush' : 'Faska Target Rush Pro', 48, 58);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.fillText(`Score ${game.score}  High ${Math.max(game.highScore, game.score)}  Level ${game.level}`, 48, 88);
  ctx.fillStyle = '#a7f3d0';
  ctx.fillText(`Waffe ${weapon.label}  Schild ${Math.round(game.shield)}  Power ${game.powerShot ? 'bereit' : '-'}`, 48, 116);
  ctx.fillStyle = '#fef3c7';
  ctx.fillText(`Auftraege ${game.contractMedals}  Verpasst ${game.contractFails}`, 48, 144);
  if (game.mode === 'learn') {
    const task = currentTask(game);
    ctx.fillStyle = '#67e8f9';
    ctx.fillText(`${task.subject} - ${task.kind}`, 48, 166);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 16px Outfit, sans-serif';
    ctx.fillText(task.prompt, 48, 192, 390);
  }

  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, WIDTH - 430, 22, 406, 326, 18);
  ctx.fill();
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 21px Outfit, sans-serif';
  ctx.fillText(`${Math.ceil(game.time)}s  Leben ${game.lives}`, WIDTH - 48, 58);
  ctx.fillStyle = '#facc15';
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText(`Combo x${Math.max(1, game.combo)}  Treffer ${game.hits}/${game.shots || 0}`, WIDTH - 48, 86);
  ctx.fillStyle = '#67e8f9';
  ctx.fillText(game.mode === 'learn' ? `Richtig ${game.correct}  Fehler ${game.wrong}  Serie ${game.streak}` : `Wind ${game.wind > 0 ? '>' : '<'}  Fever ${Math.ceil(game.fever)}`, WIDTH - 48, 114);
  ctx.textAlign = 'left';
  drawGauge(ctx, WIDTH - 392, 126, 150, 'FOKUS', game.focus, game.focus > 45 ? '#22c55e' : '#f97316');
  drawGauge(ctx, WIDTH - 210, 126, 162, 'FEVER', Math.min(100, game.fever * 20), '#facc15');
  drawGauge(ctx, WIDTH - 392, 166, 150, 'SCHILD', game.shield, '#a78bfa');
  ctx.fillStyle = '#93c5fd';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText('AKTIVER AUFTRAG', WIDTH - 210, 176);
  if (game.contract) {
    const ratio = game.contractProgress / Math.max(1, game.contract.target);
    ctx.fillStyle = '#fef3c7';
    ctx.fillText(game.contract.label, WIDTH - 392, 198, 350);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(`${game.contractProgress}/${game.contract.target} · ${Math.ceil(game.contractTimer)}s`, WIDTH - 392, 216);
    ctx.fillStyle = 'rgba(148,163,184,.22)';
    drawRoundedRect(ctx, WIDTH - 392, 228, 322, 10, 5);
    ctx.fill();
    ctx.fillStyle = '#22d3ee';
    drawRoundedRect(ctx, WIDTH - 392, 228, 322 * clamp(ratio, 0, 1), 10, 5);
    ctx.fill();
  } else {
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Naechstes Ziel wird vorbereitet', WIDTH - 392, 198, 350);
  }
  ctx.fillStyle = '#93c5fd';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText('MISSIONEN', WIDTH - 210, 260);
  game.goals.slice(0, 4).forEach((goal, index) => {
    const progress = Math.min(game.stats[goal.stat] || 0, goal.target);
    const y = 282 + index * 15;
    ctx.fillStyle = goal.completed ? '#bbf7d0' : '#e2e8f0';
    ctx.fillText(`${progress}/${goal.target} ${goal.label}`, WIDTH - 392, y);
  });

  ctx.fillStyle = 'rgba(2,6,23,.72)';
  drawRoundedRect(ctx, 24, HEIGHT - 58, 580, 38, 14);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText('Maus/Touch zielen - Klick schiessen - R nachladen - Q/1/2/3 Waffe - F Powerschuss - M Modus', 44, HEIGHT - 34);
  ctx.restore();
}

function drawMessage(ctx, game) {
  if (game.messageTimer <= 0 && game.started && !game.finished) return;
  ctx.save();
  ctx.textAlign = 'center';
  if (!game.started || game.finished) {
    ctx.fillStyle = 'rgba(2,6,23,.62)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 50px Outfit, sans-serif';
    ctx.fillText(game.finished ? game.message : 'FASKA TARGET RUSH PRO', WIDTH / 2, 264);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '800 18px Outfit, sans-serif';
    ctx.fillText(game.finished ? `Score ${game.score} - Highscore ${Math.max(game.score, game.highScore)}` : 'Schnelles Zielspiel mit Waffen, Munition, Fever, Zeit-Auftraegen und Learncade-Zielen im Spielfeld.', WIDTH / 2, 304);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '900 16px Outfit, sans-serif';
    ctx.fillText('Oben Normal oder Learncade waehlen.', WIDTH / 2, 336);
  } else {
    const messageY = 178;
    ctx.fillStyle = 'rgba(2,6,23,.7)';
    drawRoundedRect(ctx, WIDTH / 2 - 300, messageY - 40, 600, 58, 18);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 23px Outfit, sans-serif';
    ctx.fillText(game.message, WIDTH / 2, messageY - 4);
  }
  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  if (game.shake > 0) {
    const amount = game.shake * 18;
    ctx.translate((seededUnit(Math.round(game.elapsed * 1000), 1) - 0.5) * amount, (seededUnit(Math.round(game.elapsed * 1000), 2) - 0.5) * amount);
  }
  drawBackground(ctx, game);
  drawTrails(ctx, game);
  [...game.targets].sort((a, b) => a.depth - b.depth).forEach((target) => drawTarget(ctx, target, game.elapsed));
  drawEffects(ctx, game);
  drawReticle(ctx, game);
  ctx.restore();
  drawHud(ctx, game);
  drawAmmo(ctx, game);
  drawMessage(ctx, game);
}

const buttonBase = {
  border: '1px solid rgba(255,255,255,.22)',
  borderRadius: 14,
  padding: '11px 20px',
  color: '#f8fafc',
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 900,
  cursor: 'pointer',
  boxShadow: '0 14px 30px rgba(0,0,0,.25)',
  backdropFilter: 'blur(12px)',
};

export default function FaskaMoorhuhnSwarm() {
  const canvasRef = useRef(null);
  const modeRef = useRef('arcade');
  const gameRef = useRef(makeInitialGame('arcade'));
  const fxRef = useRef(null);
  const [damageFlash, setDamageFlash] = useState(0);
  const [ui, setUi] = useState(() => ({
    mode: 'arcade',
    started: false,
    finished: false,
    score: 0,
    highScore: readHighScore(),
  }));

  const syncUi = useCallback(() => {
    const game = gameRef.current;
    setUi({
      mode: game.mode,
      started: game.started,
      finished: game.finished,
      score: game.score,
      highScore: Math.max(game.highScore, game.score),
    });
  }, []);

  const startGame = useCallback((nextMode = modeRef.current) => {
    modeRef.current = nextMode;
    gameRef.current = makeInitialGame(nextMode);
    gameRef.current.started = true;
    gameRef.current.message = nextMode === 'learn'
      ? 'Lies die Aufgabe, triff Antworten und erfuell Auftraege.'
      : 'Trefferketten, Praezision und Auftraege sauber spielen.';
    gameRef.current.messageTimer = 1.7;
    syncUi();
  }, [syncUi]);

  const setMode = useCallback((nextMode) => {
    startGame(nextMode);
  }, [startGame]);

  const restartGame = useCallback(() => {
    startGame(modeRef.current);
  }, [startGame]);

  const exitGame = useCallback(() => {
    window.history.back();
  }, []);

  const pointerToCanvas = useCallback((event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: WIDTH / 2, y: HEIGHT / 2 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    };
  }, []);

  const handlePointerMove = useCallback((event) => {
    const point = pointerToCanvas(event);
    gameRef.current.reticle = point;
  }, [pointerToCanvas]);

  const handlePointerDown = useCallback((event) => {
    event.preventDefault();
    const point = pointerToCanvas(event);
    gameRef.current.reticle = point;
    const prevScore = gameRef.current.score;
    fireAt(gameRef.current, point.x, point.y);
    syncUi();
    // FX: muzzle shake on every shot
    if (fxRef.current) {
      fxRef.current.shake(0.15, 80);
    }
    // FX: emit particles on hit (score increased)
    if (gameRef.current.score > prevScore && fxRef.current) {
      fxRef.current.emitParticles(point.x, point.y, {
        count: 18, spread: 3, speed: 6, lifetime: 0.6,
        color: '#f97316',
      });
    }
    // FX: big shake on hazard hit (score decreased)
    if (gameRef.current.score < prevScore && fxRef.current) {
      fxRef.current.shake(0.5, 250);
      setDamageFlash(1);
      setTimeout(() => setDamageFlash(0), 250);
    }
  }, [pointerToCanvas, syncUi]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (['r', 'm', ' ', 'q', 'f', '1', '2', '3'].includes(key)) event.preventDefault();
      if (key === 'r') {
        reload(gameRef.current);
        syncUi();
      }
      if (key === 'q') {
        cycleWeapon(gameRef.current);
        syncUi();
      }
      if (['1', '2', '3'].includes(key)) {
        cycleWeapon(gameRef.current, Number(key) - 1);
        syncUi();
      }
      if (key === 'f') {
        if (gameRef.current.focus >= 38) {
          gameRef.current.powerShot = true;
          gameRef.current.message = 'Powerschuss bereit';
          gameRef.current.messageTimer = 0.65;
        } else {
          gameRef.current.message = 'Zu wenig Fokus';
          gameRef.current.messageTimer = 0.65;
        }
      }
      if (key === 'm') startGame(modeRef.current === 'learn' ? 'arcade' : 'learn');
      if (key === ' ') {
        const { x, y } = gameRef.current.reticle;
        fireAt(gameRef.current, x, y);
        syncUi();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startGame, syncUi]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return undefined;

    let animationFrame = 0;
    let last = performance.now();
    let lastUi = 0;

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      updateGame(gameRef.current, dt);
      renderGame(ctx, gameRef.current);
      if (now - lastUi > 220) {
        lastUi = now;
        const game = gameRef.current;
        setUi((previous) => {
          const next = {
            mode: game.mode,
            started: game.started,
            finished: game.finished,
            score: game.score,
            highScore: Math.max(game.highScore, game.score),
          };
          return previous.mode === next.mode
            && previous.started === next.started
            && previous.finished === next.finished
            && previous.score === next.score
            && previous.highScore === next.highScore
            ? previous
            : next;
        });
      }
      animationFrame = requestAnimationFrame(frame);
    };

    renderGame(ctx, gameRef.current);
    animationFrame = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#020617',
      overflow: 'hidden',
      touchAction: 'none',
      userSelect: 'none',
      cursor: 'none',
    }}>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        style={{
          width: '100vw',
          height: '100vh',
          display: 'block',
        }}
      />

      <GameFxOverlay
        ref={fxRef}
        preset="adventure"
        damageFlash={damageFlash}
        ambientGlowColor="#87CEEB"
        ambientGlowIntensity={0.4}
        particleColor="#f97316"
        particleCount={100}
        canvasWidth={WIDTH}
        canvasHeight={HEIGHT}
      />

      <div style={{
        position: 'fixed',
        top: 18,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 10,
        zIndex: 5,
        cursor: 'auto',
      }}>
        <button
          type="button"
          onClick={() => setMode('arcade')}
          style={{
            ...buttonBase,
            background: ui.mode === 'arcade' ? 'linear-gradient(135deg,#2563eb,#06b6d4)' : 'rgba(15,23,42,.72)',
            opacity: ui.mode === 'arcade' ? 1 : 0.72,
          }}
        >
          Normal
        </button>
        <button
          type="button"
          onClick={() => setMode('learn')}
          style={{
            ...buttonBase,
            background: ui.mode === 'learn' ? 'linear-gradient(135deg,#7c3aed,#06b6d4)' : 'rgba(15,23,42,.72)',
            opacity: ui.mode === 'learn' ? 1 : 0.72,
          }}
        >
          Learncade
        </button>
        <button type="button" onClick={restartGame} style={{ ...buttonBase, background: 'linear-gradient(135deg,#4f46e5,#0ea5e9)' }}>
          Restart
        </button>
        <button type="button" onClick={exitGame} style={{ ...buttonBase, background: 'linear-gradient(135deg,#475569,#111827)' }}>
          Exit
        </button>
      </div>

      {!ui.started && (
        <div style={{
          position: 'fixed',
          left: '50%',
          top: '58%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 12,
          zIndex: 6,
          cursor: 'auto',
        }}>
          <button type="button" onClick={() => setMode('arcade')} style={{ ...buttonBase, padding: '15px 30px', background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
            Normal starten
          </button>
          <button type="button" onClick={() => setMode('learn')} style={{ ...buttonBase, padding: '15px 30px', background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
            Learncade starten
          </button>
        </div>
      )}
    </div>
  );
}
