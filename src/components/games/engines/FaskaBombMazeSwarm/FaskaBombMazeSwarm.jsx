import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const COLS = 23;
const ROWS = 15;
const TILE = 36;
const BOARD_W = COLS * TILE;
const BOARD_H = ROWS * TILE;
const ORIGIN_X = Math.round((WIDTH - BOARD_W) / 2);
const ORIGIN_Y = 138;
const KEY_SHARD_SPOTS = [
  { gx: 3, gy: 7 },
  { gx: 11, gy: 3 },
  { gx: 19, gy: 13 },
  { gx: 15, gy: 11 },
];
const HAZARD_SPOTS = [
  { gx: 9, gy: 3, kind: 'spikes' },
  { gx: 13, gy: 3, kind: 'flame' },
  { gx: 5, gy: 9, kind: 'spikes' },
  { gx: 11, gy: 9, kind: 'flame' },
  { gx: 17, gy: 5, kind: 'spikes' },
  { gx: 7, gy: 13, kind: 'flame' },
];

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "explodiert"?',
    answer: 'Verb',
    options: ['Nomen', 'Verb', 'Adjektiv'],
  },
  {
    subject: 'Mathe',
    prompt: '36 : 6 = ?',
    answer: '6',
    options: ['5', '6', '8'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "wall"?',
    answer: 'Wand',
    options: ['Wald', 'Wand', 'Welle'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welches Wort ist ein Nomen?',
    answer: 'Labyrinth',
    options: ['Labyrinth', 'schnell', 'suchen'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Feuer braucht ...',
    answer: 'Sauerstoff',
    options: ['Sauerstoff', 'Stein', 'Schnee'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welches Wort ist ein Adjektiv?',
    answer: 'mutig',
    options: ['mutig', 'Mauer', 'rollen'],
  },
  {
    subject: 'Mathe',
    prompt: '7 + 8 + 5 = ?',
    answer: '20',
    options: ['18', '20', '22'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "key"?',
    answer: 'Schluessel',
    options: ['Schluessel', 'Kiste', 'Kerze'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "vorsichtig"?',
    answer: 'Adjektiv',
    options: ['Verb', 'Nomen', 'Adjektiv'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Was hilft gegen Feuer?',
    answer: 'Wasser',
    options: ['Wasser', 'Papier', 'Wind'],
  },
];

const POWERUPS = {
  fire: { label: 'FIRE+', color: '#fb7185' },
  bomb: { label: 'BOMB+', color: '#facc15' },
  speed: { label: 'FAST', color: '#67e8f9' },
  heart: { label: 'HP', color: '#5eead4' },
  remote: { label: 'REMOTE', color: '#a78bfa' },
  kick: { label: 'KICK', color: '#fb923c' },
};

const BOMB_MAZE_GOALS = [
  { id: 'crates_18', label: '18 Kisten sprengen', stat: 'crates', target: 18, mode: 'arcade', reward: 700 },
  { id: 'enemies_4', label: '4 Gegner sprengen', stat: 'enemies', target: 4, mode: 'both', reward: 900 },
  { id: 'remote_3', label: '3 Remote-Zuendungen', stat: 'remoteDetonations', target: 3, mode: 'both', reward: 650 },
  { id: 'kick_3', label: '3 Bomben kicken', stat: 'bombKicks', target: 3, mode: 'both', reward: 650 },
  { id: 'keys_2', label: '2 Schluesselsplitter', stat: 'keys', target: 2, mode: 'both', reward: 720 },
  { id: 'hazards_4', label: '4 Fallen entschaerfen', stat: 'hazardsDisabled', target: 4, mode: 'both', reward: 760 },
  { id: 'dash_4', label: '4 sichere Dashes', stat: 'dashes', target: 4, mode: 'both', reward: 560 },
  { id: 'guardian_1', label: 'Guardian besiegen', stat: 'guardianDefeated', target: 1, mode: 'arcade', reward: 1300 },
  { id: 'chain_2', label: '2 Kettenreaktionen', stat: 'chainReactions', target: 2, mode: 'arcade', reward: 750 },
  { id: 'learn_3', label: '3 Antwort-Kacheln', stat: 'learnCorrect', target: 3, mode: 'learn', reward: 1100 },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const keyOf = (gx, gy) => `${gx},${gy}`;
const seededUnit = (index, salt) => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};
const cellToScreen = (gx, gy) => ({
  x: ORIGIN_X + gx * TILE + TILE / 2,
  y: ORIGIN_Y + gy * TILE + TILE / 2,
});

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

function isSolidWall(gx, gy) {
  return gx < 0 || gy < 0 || gx >= COLS || gy >= ROWS || gx === 0 || gy === 0 || gx === COLS - 1 || gy === ROWS - 1 || (gx % 2 === 0 && gy % 2 === 0);
}

function isSpawnSafe(gx, gy) {
  return (gx <= 3 && gy <= 3) || (gx >= COLS - 4 && gy >= ROWS - 4);
}

function createCrates() {
  const crates = new Map();
  for (let gy = 1; gy < ROWS - 1; gy += 1) {
    for (let gx = 1; gx < COLS - 1; gx += 1) {
      if (isSolidWall(gx, gy) || isSpawnSafe(gx, gy)) continue;
      const seed = seededUnit(gx * 31 + gy * 17, 4);
      if (seed > 0.37) crates.set(keyOf(gx, gy), { gx, gy, hp: 1 });
    }
  }
  [
    [6, 2], [7, 2], [15, 2], [16, 3],
    [5, 7], [17, 7], [8, 12], [14, 12],
    ...KEY_SHARD_SPOTS.map(spot => [spot.gx, spot.gy]),
    ...HAZARD_SPOTS.map(spot => [spot.gx, spot.gy]),
  ].forEach(([gx, gy]) => crates.delete(keyOf(gx, gy)));
  return crates;
}

function makeGates(taskIndex) {
  const task = LEARN_TASKS[taskIndex % LEARN_TASKS.length];
  const spots = [
    { gx: 7, gy: 5 },
    { gx: 11, gy: 7 },
    { gx: 15, gy: 9 },
  ];
  return task.options.map((label, index) => ({
    id: `${taskIndex}-${label}`,
    label,
    correct: label === task.answer,
    gx: spots[index].gx,
    gy: spots[index].gy,
    pulse: index * 0.8,
  }));
}

function makeEnemy(type, gx, gy, level = 1) {
  const profiles = {
    chaser: { hp: 1, speed: 4.8, color: '#fb7185', score: 180 },
    patrol: { hp: 1, speed: 3.4, color: '#38bdf8', score: 130 },
    brute: { hp: 2, speed: 2.7, color: '#f97316', score: 300 },
    guardian: { hp: 7, speed: 2.55, color: '#a78bfa', score: 1600 },
  };
  const profile = profiles[type];
  return {
    id: `${type}-${gx}-${gy}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    gx,
    gy,
    x: gx,
    y: gy,
    targetGx: gx,
    targetGy: gy,
    dirX: -1,
    dirY: 0,
    hp: profile.hp + (type === 'brute' && level > 2 ? 1 : 0),
    speed: profile.speed,
    color: profile.color,
    score: profile.score,
    turnTimer: 0,
    stun: 0,
    phaseLevel: 1,
  };
}

function createHazards() {
  return HAZARD_SPOTS.map((spot, index) => ({
    id: `hazard-${index}`,
    ...spot,
    disabled: false,
    pulse: index * 0.9,
    cooldown: 0,
  }));
}

function createKeyShards() {
  return KEY_SHARD_SPOTS.map((spot, index) => ({
    id: `key-${index}`,
    ...spot,
    collected: false,
    pulse: index * 0.75,
  }));
}

function createStats() {
  return {
    crates: 0,
    enemies: 0,
    remoteDetonations: 0,
    bombKicks: 0,
    keys: 0,
    hazardsDisabled: 0,
    dashes: 0,
    guardianDefeated: 0,
    chainReactions: 0,
    learnCorrect: 0,
  };
}

function createGoals(mode) {
  const weight = goal => (goal.mode === mode ? 0 : goal.mode === 'both' ? 1 : 2);
  return BOMB_MAZE_GOALS
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
  game.goalNoticeTimer = 2.1;
  game.message = `Mission geschafft: ${completed.label}`;
  game.messageTimer = 1.25;
}

function makeInitialGame(mode = 'arcade') {
  const crates = createCrates();
  const exit = { gx: COLS - 2, gy: ROWS - 2, open: false };
  return {
    mode,
    elapsed: 0,
    phase: 'play',
    score: 0,
    level: 1,
    cratesDestroyed: 0,
    taskIndex: 0,
    gateCooldown: 0,
    shake: 0,
    combo: 1,
    bossSpawned: false,
    guardianPhaseNotice: false,
    goalNotice: '',
    goalNoticeTimer: 0,
    stats: createStats(),
    goals: createGoals(mode),
    message: mode === 'learn' ? 'Lege Bomben, oeffne Wege und tritt auf die richtige Antwort-Kachel.' : 'Sprenge Kisten, besiege Gegner und finde den Ausgang.',
    messageTimer: 2,
    player: {
      gx: 1,
      gy: 1,
      x: 1,
      y: 1,
      targetGx: 1,
      targetGy: 1,
      dirX: 1,
      dirY: 0,
      moving: false,
      hp: 3,
      maxHp: 3,
      bombs: 1,
      range: 2,
      speed: 7.6,
      remoteUnlocked: true,
      kickUnlocked: true,
      remoteCooldown: 0,
      remoteHeld: false,
      kickCooldown: 0,
      kickHeld: false,
      dashCooldown: 0,
      dashHeld: false,
      invuln: 0,
      placeCooldown: 0,
      exitTimer: 0,
    },
    input: {
      up: false,
      down: false,
      left: false,
      right: false,
      bomb: false,
      remote: false,
      kick: false,
      dash: false,
    },
    crates,
    exit,
    hazards: createHazards(),
    keyShards: createKeyShards(),
    bombs: [],
    explosions: [],
    enemies: [
      makeEnemy('patrol', 19, 1),
      makeEnemy('chaser', 17, 11),
      makeEnemy('brute', 5, 13),
      makeEnemy('patrol', 13, 5),
    ],
    gates: mode === 'learn' ? makeGates(0) : [],
    powerups: [],
    particles: [],
    floaters: [],
    result: null,
  };
}

function spawnParticles(game, gx, gy, color, count = 10, speed = 125) {
  const pos = cellToScreen(gx, gy);
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed;
    const burst = speed * (0.5 + (i % 5) * 0.15);
    game.particles.push({
      x: pos.x,
      y: pos.y,
      vx: Math.cos(angle) * burst,
      vy: Math.sin(angle) * burst,
      life: 0.52,
      maxLife: 0.52,
      size: 4 + (i % 3) * 2,
      color,
    });
  }
}

function addFloater(game, gx, gy, text, color = '#facc15') {
  const pos = cellToScreen(gx, gy);
  game.floaters.push({ x: pos.x, y: pos.y - 18, text, color, life: 0.9, vy: -42 });
}

function cellBlocked(game, gx, gy, ignoreBombAtPlayer = false) {
  if (isSolidWall(gx, gy)) return true;
  if (game.crates.has(keyOf(gx, gy))) return true;
  if (game.bombs.some((bomb) => bomb.gx === gx && bomb.gy === gy && !(ignoreBombAtPlayer && game.player.gx === gx && game.player.gy === gy))) return true;
  return false;
}

function computeExplosionCells(game, bomb) {
  const cells = [{ gx: bomb.gx, gy: bomb.gy }];
  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  dirs.forEach((dir) => {
    for (let step = 1; step <= bomb.range; step += 1) {
      const gx = bomb.gx + dir.x * step;
      const gy = bomb.gy + dir.y * step;
      if (isSolidWall(gx, gy)) break;
      cells.push({ gx, gy });
      if (game.crates.has(keyOf(gx, gy))) break;
    }
  });
  return cells;
}

function revealPowerup(game, gx, gy) {
  const roll = seededUnit(gx * 41 + gy * 29 + game.level, 7);
  if (roll < 0.22) return;
  const types = ['fire', 'bomb', 'speed', 'heart', 'remote', 'kick'];
  const type = types[Math.floor(seededUnit(gx * 13 + gy * 19, 9) * types.length) % types.length];
  game.powerups.push({ id: `${type}-${gx}-${gy}`, type, gx, gy, timer: 12 });
}

function triggerBomb(game, bomb, chained = false) {
  if (bomb.exploded) return;
  bomb.exploded = true;
  const cells = computeExplosionCells(game, bomb);
  game.explosions.push({ cells, timer: 0.42, maxTimer: 0.42 });
  game.shake = Math.max(game.shake, 0.18);
  if (chained) recordStat(game, 'chainReactions');
  cells.forEach(({ gx, gy }) => {
    const crateKey = keyOf(gx, gy);
    if (game.crates.has(crateKey)) {
      game.crates.delete(crateKey);
      game.cratesDestroyed += 1;
      game.combo = clamp(game.combo + 0.06, 1, 4);
      game.score += Math.round(60 * game.combo);
      recordStat(game, 'crates');
      revealPowerup(game, gx, gy);
      spawnParticles(game, gx, gy, '#facc15', 12, 150);
    }
    game.enemies.forEach((enemy) => {
      if (enemy.hp <= 0 || Math.round(enemy.x) !== gx || Math.round(enemy.y) !== gy) return;
      enemy.hp -= 1;
      enemy.stun = 0.32;
      if (enemy.type === 'guardian' && enemy.hp <= 3 && enemy.phaseLevel === 1) {
        enemy.phaseLevel = 2;
        enemy.speed += 0.55;
        game.guardianPhaseNotice = true;
        game.message = 'Guardian-Phase 2: schneller und aggressiver.';
        game.messageTimer = 1.3;
        game.enemies.push(makeEnemy('chaser', 3, 13, game.level));
        game.enemies.push(makeEnemy('patrol', 19, 3, game.level));
        spawnParticles(game, gx, gy, '#a78bfa', 22, 210);
      }
      if (enemy.hp <= 0) {
        game.combo = clamp(game.combo + 0.18, 1, 4);
        game.score += Math.round(enemy.score * game.combo);
        recordStat(game, 'enemies');
        if (enemy.type === 'guardian') recordStat(game, 'guardianDefeated');
        addFloater(game, gx, gy, `+${enemy.score}`, '#facc15');
        spawnParticles(game, gx, gy, enemy.color, 16, 170);
      }
    });
    game.hazards.forEach((hazard) => {
      if (!hazard.disabled && hazard.gx === gx && hazard.gy === gy) disableHazard(game, hazard);
    });
    game.bombs.forEach((other) => {
      if (!other.exploded && other.gx === gx && other.gy === gy) {
        other.timer = Math.min(other.timer, 0.04);
        other.chained = true;
      }
    });
  });
}

function damagePlayer(game, amount = 1) {
  const player = game.player;
  if (player.invuln > 0 || game.phase !== 'play') return;
  player.hp -= amount;
  player.invuln = 1.15;
  game.shake = 0.18;
  addFloater(game, player.gx, player.gy, '-HP', '#fb7185');
  spawnParticles(game, player.gx, player.gy, '#fb7185', 14, 150);
  if (player.hp <= 0) {
    game.phase = 'result';
    game.result = { title: 'Maze gescheitert', score: game.score, level: game.level };
  }
}

function applyPowerup(game, powerup) {
  const player = game.player;
  if (powerup.type === 'fire') player.range = clamp(player.range + 1, 2, 6);
  if (powerup.type === 'bomb') player.bombs = clamp(player.bombs + 1, 1, 5);
  if (powerup.type === 'speed') player.speed = clamp(player.speed + 0.8, 7.6, 11.4);
  if (powerup.type === 'heart') player.hp = Math.min(player.maxHp, player.hp + 1);
  if (powerup.type === 'remote') player.remoteUnlocked = true;
  if (powerup.type === 'kick') player.kickUnlocked = true;
  game.score += 120;
  addFloater(game, powerup.gx, powerup.gy, POWERUPS[powerup.type].label, POWERUPS[powerup.type].color);
  spawnParticles(game, powerup.gx, powerup.gy, POWERUPS[powerup.type].color, 16, 160);
}

function collectKeyShard(game, shard) {
  if (shard.collected) return;
  shard.collected = true;
  game.score += 360 + game.stats.keys * 80;
  recordStat(game, 'keys');
  addFloater(game, shard.gx, shard.gy, 'KEY', '#facc15');
  spawnParticles(game, shard.gx, shard.gy, '#facc15', 22, 190);
  if (game.mode === 'learn') {
    game.message = 'Schluesselsplitter: Exit-Lock wird schwaecher.';
  } else {
    game.message = 'Schluesselsplitter gefunden.';
  }
  game.messageTimer = 1.0;
}

function disableHazard(game, hazard) {
  if (hazard.disabled) return;
  hazard.disabled = true;
  game.score += Math.round(160 * game.combo);
  recordStat(game, 'hazardsDisabled');
  addFloater(game, hazard.gx, hazard.gy, 'Falle aus', '#5eead4');
  spawnParticles(game, hazard.gx, hazard.gy, '#5eead4', 18, 170);
}

function resolveGate(game, gate) {
  const task = LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
  game.gateCooldown = 0.75;
  if (gate.correct) {
    game.score += 520 + game.taskIndex * 40;
    game.player.range = clamp(game.player.range + 1, 2, 6);
    game.player.bombs = clamp(game.player.bombs + 1, 1, 5);
    const hiddenShard = game.keyShards.find(shard => !shard.collected);
    if (hiddenShard && game.taskIndex % 2 === 1) collectKeyShard(game, hiddenShard);
    game.message = `${task.subject}: richtig - Bomben staerker`;
    game.messageTimer = 1.15;
    recordStat(game, 'learnCorrect');
    addFloater(game, gate.gx, gate.gy, gate.label, '#5eead4');
    spawnParticles(game, gate.gx, gate.gy, '#5eead4', 22, 190);
    game.taskIndex += 1;
  } else {
    game.message = `${gate.label} war falsch. Richtig: ${task.answer}`;
    game.messageTimer = 1.35;
    damagePlayer(game, 1);
    const spawn = [
      { gx: 19, gy: 3 },
      { gx: 3, gy: 13 },
      { gx: 19, gy: 11 },
    ][game.taskIndex % 3];
    game.enemies.push(makeEnemy('chaser', spawn.gx, spawn.gy, game.level));
  }
  game.gates = makeGates(game.taskIndex);
}

function detonateRemoteBomb(game) {
  const player = game.player;
  if (!player.remoteUnlocked || player.remoteCooldown > 0) return;
  const bomb = game.bombs.find(item => !item.exploded && item.timer > 0.18);
  if (!bomb) {
    addFloater(game, player.gx, player.gy, 'kein Ziel', '#94a3b8');
    player.remoteCooldown = 0.25;
    return;
  }
  bomb.timer = 0.03;
  player.remoteCooldown = 0.42;
  recordStat(game, 'remoteDetonations');
  addFloater(game, bomb.gx, bomb.gy, 'REMOTE', '#a78bfa');
  spawnParticles(game, bomb.gx, bomb.gy, '#a78bfa', 12, 160);
}

function kickBomb(game) {
  const player = game.player;
  if (!player.kickUnlocked || player.kickCooldown > 0) return;
  const targetGx = player.gx + player.dirX;
  const targetGy = player.gy + player.dirY;
  const bomb = game.bombs.find(item => !item.exploded && item.gx === targetGx && item.gy === targetGy);
  if (!bomb) {
    addFloater(game, player.gx, player.gy, 'Kick', '#94a3b8');
    player.kickCooldown = 0.18;
    return;
  }
  const nextGx = bomb.gx + player.dirX;
  const nextGy = bomb.gy + player.dirY;
  if (cellBlocked(game, nextGx, nextGy)) {
    player.kickCooldown = 0.22;
    addFloater(game, bomb.gx, bomb.gy, 'blockiert', '#fb7185');
    return;
  }
  bomb.gx = nextGx;
  bomb.gy = nextGy;
  bomb.slideX = player.dirX;
  bomb.slideY = player.dirY;
  bomb.slideTimer = 0.18;
  bomb.timer = Math.max(bomb.timer, 0.35);
  player.kickCooldown = 0.34;
  recordStat(game, 'bombKicks');
  addFloater(game, bomb.gx, bomb.gy, 'KICK', '#fb923c');
  spawnParticles(game, bomb.gx, bomb.gy, '#fb923c', 10, 150);
}

function dashPlayer(game) {
  const player = game.player;
  if (player.dashCooldown > 0 || player.moving) return;
  let steps = 0;
  let nextGx = player.gx;
  let nextGy = player.gy;
  for (let step = 0; step < 2; step += 1) {
    const testGx = nextGx + player.dirX;
    const testGy = nextGy + player.dirY;
    if (cellBlocked(game, testGx, testGy, true)) break;
    nextGx = testGx;
    nextGy = testGy;
    steps += 1;
  }
  if (steps === 0) {
    player.dashCooldown = 0.18;
    addFloater(game, player.gx, player.gy, 'blockiert', '#94a3b8');
    return;
  }
  player.gx = nextGx;
  player.gy = nextGy;
  player.x = nextGx;
  player.y = nextGy;
  player.targetGx = nextGx;
  player.targetGy = nextGy;
  player.moving = false;
  player.invuln = Math.max(player.invuln, 0.28);
  player.dashCooldown = 1.15;
  game.shake = Math.max(game.shake, 0.06);
  game.score += 35 * steps;
  recordStat(game, 'dashes');
  addFloater(game, player.gx, player.gy, 'DASH', '#67e8f9');
  spawnParticles(game, player.gx, player.gy, '#67e8f9', 14, 180);
}

function updatePlayer(game, dt) {
  const player = game.player;
  player.invuln = Math.max(0, player.invuln - dt);
  player.placeCooldown = Math.max(0, player.placeCooldown - dt);
  player.remoteCooldown = Math.max(0, player.remoteCooldown - dt);
  player.kickCooldown = Math.max(0, player.kickCooldown - dt);
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);

  if (player.moving) {
    const speed = player.speed * dt;
    player.x = lerp(player.x, player.targetGx, clamp(speed, 0, 1));
    player.y = lerp(player.y, player.targetGy, clamp(speed, 0, 1));
    if (Math.abs(player.x - player.targetGx) + Math.abs(player.y - player.targetGy) < 0.03) {
      player.x = player.targetGx;
      player.y = player.targetGy;
      player.gx = player.targetGx;
      player.gy = player.targetGy;
      player.moving = false;
    }
  } else {
    const dir = { x: 0, y: 0 };
    if (game.input.left) dir.x = -1;
    else if (game.input.right) dir.x = 1;
    else if (game.input.up) dir.y = -1;
    else if (game.input.down) dir.y = 1;
    if (dir.x !== 0 || dir.y !== 0) {
      player.dirX = dir.x;
      player.dirY = dir.y;
      const nextGx = player.gx + dir.x;
      const nextGy = player.gy + dir.y;
      if (!cellBlocked(game, nextGx, nextGy, true)) {
        player.targetGx = nextGx;
        player.targetGy = nextGy;
        player.moving = true;
      }
    }
  }

  if (game.input.bomb && player.placeCooldown <= 0) {
    const active = game.bombs.filter((bomb) => !bomb.exploded).length;
    if (active < player.bombs && !game.bombs.some((bomb) => bomb.gx === player.gx && bomb.gy === player.gy)) {
      player.placeCooldown = 0.32;
      game.bombs.push({ gx: player.gx, gy: player.gy, timer: 1.75, range: player.range, exploded: false, chained: false, slideTimer: 0 });
      addFloater(game, player.gx, player.gy, 'BOMB', '#facc15');
    }
  }

  if (game.input.remote && !player.remoteHeld) {
    detonateRemoteBomb(game);
    player.remoteHeld = true;
  } else if (!game.input.remote) {
    player.remoteHeld = false;
  }

  if (game.input.kick && !player.kickHeld) {
    kickBomb(game);
    player.kickHeld = true;
  } else if (!game.input.kick) {
    player.kickHeld = false;
  }

  if (game.input.dash && !player.dashHeld) {
    dashPlayer(game);
    player.dashHeld = true;
  } else if (!game.input.dash) {
    player.dashHeld = false;
  }

  game.powerups = game.powerups.filter((powerup) => {
    powerup.timer -= dt;
    if (powerup.gx === player.gx && powerup.gy === player.gy) {
      applyPowerup(game, powerup);
      return false;
    }
    return powerup.timer > 0;
  });

  game.keyShards.forEach((shard) => {
    if (!shard.collected && shard.gx === player.gx && shard.gy === player.gy) collectKeyShard(game, shard);
  });

  if (game.mode === 'learn' && game.gateCooldown <= 0) {
    const gate = game.gates.find((candidate) => candidate.gx === player.gx && candidate.gy === player.gy);
    if (gate) resolveGate(game, gate);
  }

  const exitOpen = game.exit.open;
  if (exitOpen && player.gx === game.exit.gx && player.gy === game.exit.gy) {
    player.exitTimer += dt;
    if (player.exitTimer > 0.5) {
      game.level += 1;
      game.phase = 'result';
      game.result = { title: 'Maze geloest', score: game.score + game.level * 500, level: game.level };
      game.score += game.level * 500;
    }
  } else {
    player.exitTimer = 0;
  }
}

function chooseEnemyDirection(game, enemy) {
  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ].filter((dir) => !cellBlocked(game, enemy.gx + dir.x, enemy.gy + dir.y));

  if (dirs.length === 0) return { x: 0, y: 0 };
  if (enemy.type === 'chaser' || enemy.type === 'guardian') {
    dirs.sort((a, b) => {
      const da = Math.abs(game.player.gx - (enemy.gx + a.x)) + Math.abs(game.player.gy - (enemy.gy + a.y));
      const db = Math.abs(game.player.gx - (enemy.gx + b.x)) + Math.abs(game.player.gy - (enemy.gy + b.y));
      return da - db;
    });
    return dirs[0];
  }
  const index = Math.floor(seededUnit(enemy.gx * 17 + enemy.gy * 29 + game.elapsed * 10, enemy.speed) * dirs.length) % dirs.length;
  return dirs[index];
}

function updateEnemies(game, dt) {
  game.enemies.forEach((enemy) => {
    if (enemy.hp <= 0) return;
    enemy.stun = Math.max(0, enemy.stun - dt);
    if (enemy.stun > 0) return;
    if (Math.abs(enemy.x - enemy.targetGx) + Math.abs(enemy.y - enemy.targetGy) < 0.04) {
      enemy.x = enemy.targetGx;
      enemy.y = enemy.targetGy;
      enemy.gx = enemy.targetGx;
      enemy.gy = enemy.targetGy;
      enemy.turnTimer -= dt;
      if (enemy.turnTimer <= 0) {
        const dir = chooseEnemyDirection(game, enemy);
        enemy.dirX = dir.x;
        enemy.dirY = dir.y;
        enemy.targetGx = enemy.gx + dir.x;
        enemy.targetGy = enemy.gy + dir.y;
        enemy.turnTimer = enemy.type === 'patrol' ? 0.12 : 0.04;
      }
    } else {
      const step = clamp(enemy.speed * dt, 0, 1);
      enemy.x = lerp(enemy.x, enemy.targetGx, step);
      enemy.y = lerp(enemy.y, enemy.targetGy, step);
    }

    if (Math.round(enemy.x) === game.player.gx && Math.round(enemy.y) === game.player.gy) {
      damagePlayer(game, 1);
    }
  });
  game.enemies = game.enemies.filter((enemy) => enemy.hp > 0);
}

function updateHazards(game, dt) {
  game.hazards.forEach((hazard) => {
    if (hazard.disabled) return;
    hazard.pulse += dt * (hazard.kind === 'flame' ? 5.2 : 3.6);
    hazard.cooldown = Math.max(0, hazard.cooldown - dt);
    const active = hazard.kind === 'flame'
      ? Math.sin(hazard.pulse) > 0.34
      : Math.sin(hazard.pulse) > 0.72;
    if (!active || hazard.cooldown > 0) return;
    if (game.player.gx === hazard.gx && game.player.gy === hazard.gy) {
      damagePlayer(game, 1);
      hazard.cooldown = 0.55;
    }
    game.enemies.forEach((enemy) => {
      if (enemy.hp <= 0 || Math.round(enemy.x) !== hazard.gx || Math.round(enemy.y) !== hazard.gy) return;
      enemy.stun = Math.max(enemy.stun, 0.45);
      enemy.hp -= hazard.kind === 'flame' ? 1 : 0;
      if (enemy.hp <= 0) {
        game.score += Math.round(enemy.score * game.combo);
        recordStat(game, 'enemies');
        if (enemy.type === 'guardian') recordStat(game, 'guardianDefeated');
        addFloater(game, hazard.gx, hazard.gy, 'Fallen-KO', '#facc15');
        spawnParticles(game, hazard.gx, hazard.gy, hazard.kind === 'flame' ? '#fb7185' : '#94a3b8', 16, 170);
      }
    });
    hazard.cooldown = 0.55;
  });
  game.enemies = game.enemies.filter((enemy) => enemy.hp > 0);
}

function updateObjectives(game) {
  const requiredKeys = game.mode === 'learn' ? 1 : 2;
  const readyForGuardian = !game.bossSpawned && game.cratesDestroyed >= 8 && (game.stats.keys || 0) >= 1 && game.elapsed > 8;
  if (readyForGuardian) {
    game.bossSpawned = true;
    game.enemies.push(makeEnemy('guardian', 21, 13, game.level));
    game.message = 'Guardian erwacht: erst besiegen, dann Exit oeffnen.';
    game.messageTimer = 1.6;
    game.shake = 0.22;
  }
  const guardianAlive = game.enemies.some(enemy => enemy.type === 'guardian' && enemy.hp > 0);
  const guardianCleared = game.bossSpawned && !guardianAlive && (game.stats.guardianDefeated || 0) > 0;
  game.exit.open = game.enemies.length === 0
    && game.cratesDestroyed >= 10
    && (game.stats.keys || 0) >= requiredKeys
    && guardianCleared;
}

function updateBombs(game, dt) {
  game.bombs.forEach((bomb) => {
    if (bomb.slideTimer > 0) {
      bomb.slideTimer = Math.max(0, bomb.slideTimer - dt);
      if (bomb.slideTimer <= 0) {
        const nextGx = bomb.gx + (bomb.slideX || 0);
        const nextGy = bomb.gy + (bomb.slideY || 0);
        if ((bomb.slideX || bomb.slideY) && !cellBlocked(game, nextGx, nextGy)) {
          bomb.gx = nextGx;
          bomb.gy = nextGy;
          bomb.slideTimer = 0.18;
        } else {
          bomb.slideX = 0;
          bomb.slideY = 0;
        }
      }
    }
    bomb.timer -= dt;
    if (bomb.timer <= 0) triggerBomb(game, bomb, bomb.chained);
  });
  game.bombs = game.bombs.filter((bomb) => !bomb.exploded || bomb.timer > -0.05);

  game.explosions.forEach((explosion) => {
    explosion.timer -= dt;
    explosion.cells.forEach(({ gx, gy }) => {
      if (game.player.gx === gx && game.player.gy === gy) damagePlayer(game, 1);
    });
  });
  game.explosions = game.explosions.filter((explosion) => explosion.timer > 0);
}

function updateEffects(game, dt) {
  game.gateCooldown = Math.max(0, game.gateCooldown - dt);
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.shake = Math.max(0, game.shake - dt);
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
  updatePlayer(game, dt);
  updateEnemies(game, dt);
  updateHazards(game, dt);
  updateBombs(game, dt);
  updateObjectives(game);
  updateEffects(game, dt);
  if (game.result) onFinish(game.result);
}

function drawBoard(ctx, game) {
  const shakeX = game.shake > 0 ? Math.sin(game.elapsed * 80) * game.shake * 18 : 0;
  const shakeY = game.shake > 0 ? Math.cos(game.elapsed * 70) * game.shake * 12 : 0;
  ctx.save();
  ctx.translate(shakeX, shakeY);
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bg.addColorStop(0, '#07111f');
  bg.addColorStop(0.55, '#10243e');
  bg.addColorStop(1, '#050816');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = '#102033';
  drawRoundedRect(ctx, ORIGIN_X - 16, ORIGIN_Y - 16, BOARD_W + 32, BOARD_H + 32, 26);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5;
  ctx.stroke();

  for (let gy = 0; gy < ROWS; gy += 1) {
    for (let gx = 0; gx < COLS; gx += 1) {
      const x = ORIGIN_X + gx * TILE;
      const y = ORIGIN_Y + gy * TILE;
      ctx.fillStyle = (gx + gy) % 2 === 0 ? '#13233a' : '#162a43';
      ctx.fillRect(x, y, TILE, TILE);
      ctx.strokeStyle = 'rgba(148,163,184,.08)';
      ctx.strokeRect(x, y, TILE, TILE);
      if (isSolidWall(gx, gy)) {
        ctx.fillStyle = '#334155';
        drawRoundedRect(ctx, x + 4, y + 4, TILE - 8, TILE - 8, 10);
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }

  game.crates.forEach((crate) => {
    const x = ORIGIN_X + crate.gx * TILE;
    const y = ORIGIN_Y + crate.gy * TILE;
    ctx.fillStyle = '#92400e';
    drawRoundedRect(ctx, x + 6, y + 6, TILE - 12, TILE - 12, 8);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  const exitPos = cellToScreen(game.exit.gx, game.exit.gy);
  ctx.save();
  ctx.shadowColor = game.exit.open ? '#5eead4' : '#64748b';
  ctx.shadowBlur = game.exit.open ? 22 : 6;
  ctx.fillStyle = game.exit.open ? '#14b8a6' : '#475569';
  drawRoundedRect(ctx, exitPos.x - 18, exitPos.y - 18, 36, 36, 10);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 10px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(game.exit.open ? 'EXIT' : 'LOCK', exitPos.x, exitPos.y + 4);
  ctx.restore();
  ctx.restore();
}

function drawGates(ctx, game) {
  if (game.mode !== 'learn') return;
  game.gates.forEach((gate) => {
    const pos = cellToScreen(gate.gx, gate.gy);
    const pulse = 1 + Math.sin(game.elapsed * 4 + gate.pulse) * 0.08;
    ctx.save();
    ctx.shadowColor = gate.correct ? '#5eead4' : '#818cf8';
    ctx.shadowBlur = 16;
    ctx.fillStyle = gate.correct ? 'rgba(20,184,166,.86)' : 'rgba(79,70,229,.82)';
    drawRoundedRect(ctx, pos.x - 19 * pulse, pos.y - 19 * pulse, 38 * pulse, 38 * pulse, 10);
    ctx.fill();
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(gate.label.slice(0, 8), pos.x, pos.y);
    ctx.restore();
  });
}

function drawKeysAndHazards(ctx, game) {
  game.hazards.forEach((hazard) => {
    const pos = cellToScreen(hazard.gx, hazard.gy);
    const active = !hazard.disabled && (
      hazard.kind === 'flame' ? Math.sin(hazard.pulse) > 0.34 : Math.sin(hazard.pulse) > 0.72
    );
    ctx.save();
    ctx.globalAlpha = hazard.disabled ? 0.35 : 1;
    ctx.shadowColor = active ? (hazard.kind === 'flame' ? '#fb7185' : '#e2e8f0') : '#64748b';
    ctx.shadowBlur = active ? 18 : 6;
    ctx.fillStyle = hazard.disabled ? '#334155' : hazard.kind === 'flame' ? '#7f1d1d' : '#475569';
    drawRoundedRect(ctx, pos.x - 17, pos.y - 17, 34, 34, 10);
    ctx.fill();
    if (hazard.kind === 'flame') {
      ctx.fillStyle = active ? '#fb923c' : '#f97316';
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y - 13);
      ctx.lineTo(pos.x + 12, pos.y + 12);
      ctx.lineTo(pos.x, pos.y + 6);
      ctx.lineTo(pos.x - 12, pos.y + 12);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.strokeStyle = active ? '#f8fafc' : '#94a3b8';
      ctx.lineWidth = 3;
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath();
        ctx.moveTo(pos.x - 12, pos.y + i * 8);
        ctx.lineTo(pos.x + 12, pos.y - i * 8);
        ctx.stroke();
      }
    }
    ctx.restore();
  });

  game.keyShards.forEach((shard) => {
    if (shard.collected) return;
    const pos = cellToScreen(shard.gx, shard.gy);
    const pulse = 1 + Math.sin(game.elapsed * 4 + shard.pulse) * 0.12;
    ctx.save();
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y - 15 * pulse);
    ctx.lineTo(pos.x + 13 * pulse, pos.y);
    ctx.lineTo(pos.x, pos.y + 15 * pulse);
    ctx.lineTo(pos.x - 13 * pulse, pos.y);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#78350f';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('K', pos.x, pos.y + 1);
    ctx.restore();
  });
  ctx.globalAlpha = 1;
}

function drawBlastPreview(ctx, game) {
  game.bombs.forEach((bomb) => {
    if (bomb.exploded) return;
    const cells = computeExplosionCells(game, bomb);
    const alpha = bomb.timer < 0.55 ? 0.23 : 0.11;
    cells.forEach(({ gx, gy }) => {
      const pos = cellToScreen(gx, gy);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = bomb.chained ? '#a78bfa' : '#fb923c';
      drawRoundedRect(ctx, pos.x - 16, pos.y - 16, 32, 32, 8);
      ctx.fill();
      ctx.restore();
    });
  });
  ctx.globalAlpha = 1;
}

function drawBombs(ctx, game) {
  game.powerups.forEach((powerup) => {
    const pos = cellToScreen(powerup.gx, powerup.gy);
    ctx.save();
    ctx.shadowColor = POWERUPS[powerup.type].color;
    ctx.shadowBlur = 16;
    ctx.fillStyle = POWERUPS[powerup.type].color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111827';
    ctx.font = '900 8px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(POWERUPS[powerup.type].label, pos.x, pos.y + 3);
    ctx.restore();
  });

  game.bombs.forEach((bomb) => {
    const pos = cellToScreen(
      bomb.gx - (bomb.slideX || 0) * (bomb.slideTimer || 0) / 0.18,
      bomb.gy - (bomb.slideY || 0) * (bomb.slideTimer || 0) / 0.18,
    );
    const pulse = 1 + Math.sin(game.elapsed * 18) * (bomb.timer < 0.55 ? 0.22 : 0.08);
    ctx.save();
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = bomb.timer < 0.55 ? 22 : 12;
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 16 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(pos.x + 5, pos.y - 6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  game.explosions.forEach((explosion) => {
    const alpha = clamp(explosion.timer / explosion.maxTimer, 0, 1);
    explosion.cells.forEach(({ gx, gy }) => {
      const pos = cellToScreen(gx, gy);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = '#fb7185';
      ctx.shadowBlur = 24;
      ctx.fillStyle = '#f97316';
      drawRoundedRect(ctx, pos.x - 18, pos.y - 18, 36, 36, 12);
      ctx.fill();
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8 + (1 - alpha) * 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  });
  ctx.globalAlpha = 1;
}

function drawActors(ctx, game) {
  game.enemies.forEach((enemy) => {
    const pos = cellToScreen(enemy.x, enemy.y);
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(Math.atan2(enemy.dirY, enemy.dirX));
    ctx.shadowColor = enemy.color;
    ctx.shadowBlur = 14;
    ctx.fillStyle = enemy.color;
    if (enemy.type === 'guardian') {
      ctx.shadowBlur = 24;
      drawRoundedRect(ctx, -22, -22, 44, 44, 12);
      ctx.fill();
      ctx.fillStyle = '#312e81';
      drawRoundedRect(ctx, -10, -9, 20, 18, 5);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '900 10px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`P${enemy.phaseLevel}`, 0, 4);
    } else if (enemy.type === 'brute') {
      drawRoundedRect(ctx, -17, -17, 34, 34, 9);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(-12, -14);
      ctx.lineTo(-7, 0);
      ctx.lineTo(-12, 14);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  });

  const player = game.player;
  const pos = cellToScreen(player.x, player.y);
  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(Math.atan2(player.dirY, player.dirX));
  ctx.shadowColor = player.invuln > 0 ? '#f8fafc' : '#22c55e';
  ctx.shadowBlur = player.invuln > 0 ? 20 : 12;
  ctx.fillStyle = player.invuln > 0 ? '#f8fafc' : '#22c55e';
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(-13, -16);
  ctx.lineTo(-7, 0);
  ctx.lineTo(-13, 16);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#bbf7d0';
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawEffects(ctx, game) {
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
    ctx.font = '900 14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(floater.text, floater.x, floater.y);
  });
  ctx.globalAlpha = 1;
}

function drawHud(ctx, game) {
  const player = game.player;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = 'rgba(2,6,23,.82)';
  drawRoundedRect(ctx, 28, 18, 352, 128, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 26px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Learncade Bomb Maze Pro' : 'Faska Bomb Maze Pro', 54, 54);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.fillText(`Score ${game.score} · Level ${game.level} · Combo x${game.combo.toFixed(2)}`, 54, 84);
  ctx.fillStyle = '#67e8f9';
  ctx.fillText(`HP ${player.hp}/${player.maxHp} · Bomben ${player.bombs} · Feuer ${player.range} · Dash ${player.dashCooldown <= 0 ? 'bereit' : player.dashCooldown.toFixed(1)}`, 54, 112);
  ctx.fillStyle = '#facc15';
  ctx.fillText(`Keys ${game.stats.keys}/${game.mode === 'learn' ? 1 : 2} · Fallen ${game.stats.hazardsDisabled} · Guardian ${game.bossSpawned ? game.stats.guardianDefeated : 'schlaeft'}`, 54, 134);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, WIDTH - 390, 18, 362, 210, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 24px Outfit, sans-serif';
  ctx.fillText(`${game.enemies.length} Gegner`, WIDTH - 54, 54);
  ctx.fillStyle = game.exit.open ? '#5eead4' : '#facc15';
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText(game.exit.open ? 'Exit offen' : 'Exit: 10 Kisten + Keys + Guardian', WIDTH - 54, 86);
  ctx.fillStyle = '#93c5fd';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText('MISSIONEN', WIDTH - 54, 116);
  game.goals.slice(0, 5).forEach((goal, index) => {
    const progress = Math.min(game.stats[goal.stat] || 0, goal.target);
    const y = 140 + index * 15;
    ctx.textAlign = 'left';
    ctx.fillStyle = goal.completed ? '#bbf7d0' : '#e2e8f0';
    ctx.fillText(`${goal.completed ? '✓ ' : ''}${goal.label}`, WIDTH - 368, y);
    ctx.textAlign = 'right';
    ctx.fillText(`${progress}/${goal.target}`, WIDTH - 54, y);
  });

  if (game.mode === 'learn') {
    const task = LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.84)';
    drawRoundedRect(ctx, WIDTH / 2 - 270, 104, 540, 70, 18);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 19px Outfit, sans-serif';
    ctx.fillText(task.prompt, WIDTH / 2, 132);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 13px Outfit, sans-serif';
    ctx.fillText(`${task.subject} - richtige Antwort-Kachel betreten`, WIDTH / 2, 154);
  }

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.78)';
    drawRoundedRect(ctx, WIDTH / 2 - 330, HEIGHT - 74, 660, 46, 16);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 20px Outfit, sans-serif';
    ctx.fillText(game.message, WIDTH / 2, HEIGHT - 45);
  }

  if (game.goalNoticeTimer > 0 && game.goalNotice) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(20,83,45,.84)';
    drawRoundedRect(ctx, WIDTH / 2 - 210, HEIGHT - 128, 420, 42, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(134,239,172,.5)';
    ctx.stroke();
    ctx.fillStyle = '#dcfce7';
    ctx.font = '900 18px Outfit, sans-serif';
    ctx.fillText(`Mission: ${game.goalNotice}`, WIDTH / 2, HEIGHT - 101);
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.74)';
  drawRoundedRect(ctx, 38, HEIGHT - 34, 960, 26, 10);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 12px Outfit, sans-serif';
  ctx.fillText('WASD/Arrows bewegen · Space/B Bombe · E Remote · K Kick · Shift/C Dash · Keys sammeln · Fallen sprengen · M Modus · R Restart', 56, HEIGHT - 16);
  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawBoard(ctx, game);
  drawKeysAndHazards(ctx, game);
  drawGates(ctx, game);
  drawBlastPreview(ctx, game);
  drawBombs(ctx, game);
  drawActors(ctx, game);
  drawEffects(ctx, game);
  drawHud(ctx, game);
}

export default function FaskaBombMazeSwarm() {
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
    if (gameRef.current.input[name] !== undefined) {
      gameRef.current.input[name] = pressed;
    }
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
      [' ', 'bomb'], ['b', 'bomb'], ['B', 'bomb'],
      ['e', 'remote'], ['E', 'remote'],
      ['k', 'kick'], ['K', 'kick'],
      ['c', 'dash'], ['C', 'dash'], ['Shift', 'dash'],
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
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      window.removeEventListener('blur', blur);
    };
  }, [restart, setGameMode]);

  const chromeTop = 'max(12px, calc((100vh - min(100vh, calc(100vw * 9 / 16))) / 2 + 8px))';
  const chromeBottom = 'calc((100vh - min(100vh, calc(100vw * 9 / 16))) / 2 + 22px)';
  const touchButton = {
    width: 68,
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
          boxShadow: '0 0 120px rgba(220,38,38,.18), inset 0 0 80px rgba(251,146,60,.08), 0 0 90px rgba(0,0,0,.55)',
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
        boxShadow: 'inset 0 0 150px 60px rgba(0,0,0,.45), inset 0 0 80px 30px rgba(220,38,38,.12)',
        borderRadius: 2,
      }} />

      <div style={{ position: 'fixed', top: chromeTop, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.56 }}>Normal</button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.56 }}>Learncade</button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      <div className="bomb-touch-controls" style={{
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
        <div style={{ display: 'flex', gap: 8, pointerEvents: 'auto', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 420 }}>
          <button style={{ ...touchButton, width: 92, height: 70, background: 'rgba(250,204,21,.84)', color: '#111827' }} {...holdButton('bomb')}>BOMB</button>
          <button style={{ ...touchButton, width: 92, height: 70, background: 'rgba(168,85,247,.82)' }} {...holdButton('remote')}>REMOTE</button>
          <button style={{ ...touchButton, width: 92, height: 70, background: 'rgba(251,146,60,.84)', color: '#111827' }} {...holdButton('kick')}>KICK</button>
          <button style={{ ...touchButton, width: 92, height: 70, background: 'rgba(14,165,233,.82)' }} {...holdButton('dash')}>DASH</button>
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
          <div style={{ fontSize: 24, fontWeight: 800, color: '#facc15' }}>Level {result.level} · Score {result.score}</div>
          <button className="btn-primary" onClick={restart}>Neues Labyrinth</button>
        </div>
      )}

      <style>{`
        @media (pointer: fine), (min-width: 900px) {
          .bomb-touch-controls {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
