import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const WORLD_W = 2440;
const WORLD_H = 1640;

const WALLS = [
  { x: 0, y: 0, w: WORLD_W, h: 56 },
  { x: 0, y: WORLD_H - 56, w: WORLD_W, h: 56 },
  { x: 0, y: 0, w: 56, h: WORLD_H },
  { x: WORLD_W - 56, y: 0, w: 56, h: WORLD_H },
  { x: 420, y: 56, w: 50, h: 340 },
  { x: 420, y: 550, w: 50, h: 500 },
  { x: 420, y: 1200, w: 50, h: 384 },
  { x: 880, y: 56, w: 50, h: 560 },
  { x: 880, y: 770, w: 50, h: 370 },
  { x: 880, y: 1280, w: 50, h: 304 },
  { x: 1360, y: 56, w: 50, h: 300 },
  { x: 1360, y: 510, w: 50, h: 450 },
  { x: 1360, y: 1110, w: 50, h: 474 },
  { x: 1840, y: 56, w: 50, h: 540 },
  { x: 1840, y: 760, w: 50, h: 350 },
  { x: 1840, y: 1280, w: 50, h: 304 },
  { x: 56, y: 420, w: 250, h: 50 },
  { x: 470, y: 420, w: 410, h: 50 },
  { x: 930, y: 420, w: 320, h: 50 },
  { x: 1410, y: 420, w: 250, h: 50 },
  { x: 1890, y: 420, w: 494, h: 50 },
  { x: 56, y: 820, w: 364, h: 50 },
  { x: 560, y: 820, w: 320, h: 50 },
  { x: 930, y: 820, w: 300, h: 50 },
  { x: 1410, y: 820, w: 430, h: 50 },
  { x: 1990, y: 820, w: 394, h: 50 },
  { x: 56, y: 1220, w: 420, h: 50 },
  { x: 610, y: 1220, w: 270, h: 50 },
  { x: 930, y: 1220, w: 430, h: 50 },
  { x: 1510, y: 1220, w: 330, h: 50 },
  { x: 2010, y: 1220, w: 374, h: 50 },
  { x: 670, y: 230, w: 90, h: 90 },
  { x: 1130, y: 620, w: 110, h: 110 },
  { x: 1630, y: 1020, w: 120, h: 120 },
  { x: 2130, y: 235, w: 110, h: 110 },
];

const DOORS = [
  { id: 'blue-door', label: 'BLAU', kind: 'blueKey', x: 420, y: 396, w: 50, h: 154, color: '#38bdf8' },
  { id: 'red-door', label: 'ROT', kind: 'redKey', x: 880, y: 616, w: 50, h: 154, color: '#fb7185' },
  { id: 'sun-door', label: 'SONNE', kind: 'sunSwitch', x: 1360, y: 960, w: 50, h: 150, color: '#facc15' },
  { id: 'moon-door', label: 'MOND', kind: 'moonSwitch', x: 1840, y: 1110, w: 50, h: 170, color: '#a78bfa' },
  { id: 'boss-door', label: 'BOSS', kind: 'bossKey', x: 1840, y: 596, w: 50, h: 164, color: '#f97316' },
];

const ITEMS = [
  { id: 'blue-key', kind: 'blueKey', label: 'Blaue Rune', x: 260, y: 250, color: '#38bdf8' },
  { id: 'bow', kind: 'bow', label: 'Bogen', x: 650, y: 680, color: '#facc15' },
  { id: 'bombs', kind: 'bombs', label: 'Bombentasche', x: 1120, y: 260, color: '#f97316' },
  { id: 'red-key', kind: 'redKey', label: 'Rote Rune', x: 1160, y: 1040, color: '#fb7185' },
  { id: 'hookshot', kind: 'hookshot', label: 'Hookshot', x: 1640, y: 650, color: '#a78bfa' },
  { id: 'boss-key', kind: 'bossKey', label: 'Boss-Schluessel', x: 2120, y: 1040, color: '#f97316' },
  { id: 'heart-1', kind: 'heart', label: 'Herz', x: 630, y: 1030, color: '#22c55e' },
  { id: 'heart-2', kind: 'heart', label: 'Herz', x: 2180, y: 1450, color: '#22c55e' },
  { id: 'rupee-1', kind: 'rupee', label: 'Rupie', x: 250, y: 610, color: '#5eead4' },
  { id: 'rupee-2', kind: 'rupee', label: 'Rupie', x: 1530, y: 250, color: '#5eead4' },
  { id: 'rupee-3', kind: 'rupee', label: 'Rupie', x: 2020, y: 620, color: '#5eead4' },
];

const SWITCHES = [
  { id: 'sunSwitch', x: 1540, y: 1020, color: '#facc15', label: 'SUN' },
  { id: 'moonSwitch', x: 2190, y: 620, color: '#a78bfa', label: 'MOON' },
];

const PULL_BLOCKS = [
  { id: 'pull-1', x: 650, y: 1330, targetX: 735, targetY: 1330, solved: false },
  { id: 'pull-2', x: 1560, y: 1450, targetX: 1705, targetY: 1450, solved: false },
];

const TRAPS = [
  { id: 'spike-a', kind: 'spikes', x: 610, y: 455, w: 122, h: 74, cycle: 1.6, offset: 0.1, damage: 11 },
  { id: 'spike-b', kind: 'spikes', x: 1060, y: 895, w: 138, h: 82, cycle: 1.35, offset: 0.65, damage: 13 },
  { id: 'spike-c', kind: 'spikes', x: 1506, y: 1298, w: 152, h: 84, cycle: 1.75, offset: 0.3, damage: 12 },
  { id: 'fire-a', kind: 'fire', x: 1932, y: 250, w: 188, h: 38, cycle: 2.1, offset: 0.35, damage: 15 },
  { id: 'fire-b', kind: 'fire', x: 1452, y: 650, w: 38, h: 188, cycle: 2.35, offset: 0.9, damage: 15 },
];

const CRACKED_WALLS = [
  { id: 'secret-rupees', x: 880, y: 1140, w: 50, h: 140, reward: 'rupees', color: '#5eead4' },
  { id: 'secret-boss-shortcut', x: 1840, y: 1110, w: 50, h: 170, reward: 'arrows', color: '#facc15' },
];

const CHESTS = [
  { id: 'chest-arrows', x: 735, y: 1330, reward: 'arrows', color: '#facc15' },
  { id: 'chest-bombs', x: 1705, y: 1450, reward: 'bombs', color: '#f97316' },
  { id: 'chest-heart', x: 1520, y: 280, reward: 'heart', color: '#22c55e' },
  { id: 'chest-map', x: 2060, y: 250, reward: 'map', color: '#a78bfa' },
];

const ROOM_TRIALS = [
  { id: 'bow-eye', label: 'AUGE', tool: 'bow', x: 1240, y: 260, color: '#facc15' },
  { id: 'bomb-seal', label: 'SIEGEL', tool: 'bombs', x: 1518, y: 1040, color: '#f97316' },
  { id: 'hook-anchor', label: 'ANKER', tool: 'hookshot', x: 2050, y: 1450, color: '#a78bfa' },
];

const ENEMIES = [
  { id: 'bat-1', x: 650, y: 245, type: 'bat', hp: 2 },
  { id: 'slime-1', x: 680, y: 1010, type: 'slime', hp: 3 },
  { id: 'eye-1', x: 1110, y: 650, type: 'eye', hp: 3 },
  { id: 'guard-1', x: 1550, y: 260, type: 'guard', hp: 5 },
  { id: 'eye-2', x: 1620, y: 1030, type: 'eye', hp: 4 },
  { id: 'guard-2', x: 2100, y: 640, type: 'guard', hp: 6 },
  { id: 'boss', x: 2140, y: 1450, type: 'boss', hp: 22 },
];

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "Tempel"?',
    answer: 'Nomen',
    options: ['Verb', 'Nomen', 'Adjektiv'],
  },
  {
    subject: 'Mathe',
    prompt: '15 - 7 = ?',
    answer: '8',
    options: ['7', '8', '9'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "key"?',
    answer: 'Schluessel',
    options: ['Tuer', 'Schluessel', 'Bruecke'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Was braucht Feuer?',
    answer: 'Sauerstoff',
    options: ['Sand', 'Sauerstoff', 'Eis'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "leuchtet"?',
    answer: 'Verb',
    options: ['Verb', 'Artikel', 'Nomen'],
  },
];

const ALTAR_SETS = [
  [{ x: 250, y: 500 }, { x: 340, y: 610 }, { x: 190, y: 620 }],
  [{ x: 1010, y: 590 }, { x: 1160, y: 590 }, { x: 1310, y: 590 }],
  [{ x: 1495, y: 560 }, { x: 1635, y: 560 }, { x: 1775, y: 560 }],
  [{ x: 1970, y: 940 }, { x: 2120, y: 940 }, { x: 2270, y: 940 }],
  [{ x: 980, y: 1440 }, { x: 1130, y: 1440 }, { x: 1280, y: 1440 }],
];

const RELICS = [
  { id: 'relic-1', x: 350, y: 350, label: 'Mut' },
  { id: 'relic-2', x: 720, y: 720, label: 'Klang' },
  { id: 'relic-3', x: 1080, y: 940, label: 'Schatten' },
  { id: 'relic-4', x: 1515, y: 700, label: 'Sonne' },
  { id: 'relic-5', x: 1760, y: 1385, label: 'Mond' },
  { id: 'relic-6', x: 2190, y: 1265, label: 'Siegel' },
];

const TEMPLE_GOALS = [
  { id: 'tools_3', label: '3 Werkzeuge sichern', stat: 'tools', target: 3, mode: 'both', reward: 700 },
  { id: 'doors_4', label: '4 Siegel-Tueren oeffnen', stat: 'doors', target: 4, mode: 'both', reward: 850 },
  { id: 'relics_5', label: '5 Relikt-Splitter', stat: 'relics', target: 5, mode: 'both', reward: 760 },
  { id: 'defeats_6', label: '6 Gegner besiegen', stat: 'defeats', target: 6, mode: 'both', reward: 820 },
  { id: 'boss_1', label: 'Tempelwaechter besiegen', stat: 'bosses', target: 1, mode: 'both', reward: 1400 },
  { id: 'learn_3', label: '3 Altare richtig', stat: 'learnCorrect', target: 3, mode: 'learn', reward: 1150 },
  { id: 'blocks_2', label: '2 Hookshot-Raetsel', stat: 'blocks', target: 2, mode: 'arcade', reward: 600 },
  { id: 'traps_3', label: '3 Fallen meistern', stat: 'traps', target: 3, mode: 'both', reward: 720 },
  { id: 'secrets_2', label: '2 Geheimwaende sprengen', stat: 'secrets', target: 2, mode: 'both', reward: 900 },
  { id: 'chests_3', label: '3 Truhen bergen', stat: 'chests', target: 3, mode: 'both', reward: 720 },
  { id: 'trials_3', label: '3 Werkzeug-Pruefungen', stat: 'trials', target: 3, mode: 'both', reward: 980 },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function createStats() {
  return {
    tools: 0,
    doors: 0,
    relics: 0,
    defeats: 0,
    bosses: 0,
    learnCorrect: 0,
    blocks: 0,
    traps: 0,
    secrets: 0,
    chests: 0,
    trials: 0,
  };
}

function createGoals(mode) {
  const weight = goal => (goal.mode === mode ? 0 : goal.mode === 'both' ? 1 : 2);
  return TEMPLE_GOALS
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
  game.missionNotice = `${completed.label} +${completed.reward}`;
  game.missionNoticeTimer = 2.2;
  game.message = `Mission geschafft: ${completed.label}`;
  game.messageTimer = 1.25;
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

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function playerRect(player) {
  return { x: player.x - player.w / 2, y: player.y - player.h / 2, w: player.w, h: player.h };
}

function enemyRect(enemy) {
  const size = enemy.type === 'boss' ? 92 : enemy.type === 'guard' ? 52 : 42;
  return { x: enemy.x - size / 2, y: enemy.y - size / 2, w: size, h: size };
}

function makeInitialGame(mode = 'arcade') {
  return {
    mode,
    elapsed: 0,
    phase: 'run',
    cameraX: 0,
    cameraY: 0,
    score: 0,
    message: mode === 'learn' ? 'Loese Runen-Altare und oeffne den Tempel.' : 'Finde Items, Schluessel und oeffne den Bossraum.',
    messageTimer: 2,
    missionNotice: '',
    missionNoticeTimer: 0,
    stats: createStats(),
    goals: createGoals(mode),
    altarCooldown: mode === 'learn' ? 0.8 : 0,
    taskIndex: 0,
    screenShake: 0,
    player: {
      x: 210,
      y: 210,
      w: 38,
      h: 38,
      vx: 0,
      vy: 0,
      dirX: 1,
      dirY: 0,
      hp: 100,
      stamina: 100,
      arrows: 16,
      bombs: 3,
      rupees: 0,
      hasBow: false,
      hasBombs: false,
      hasHookshot: false,
      keys: [],
      switches: [],
      invuln: 0,
      rollTimer: 0,
      rollCooldown: 0,
      swordTimer: 0,
      swordCooldown: 0,
      bowCooldown: 0,
      bombCooldown: 0,
      hookTimer: 0,
      hookTarget: null,
    },
    doors: DOORS.map((door) => ({ ...door, open: false })),
    items: ITEMS.map((item) => ({ ...item, taken: false })),
    relics: RELICS.map((relic, index) => ({ ...relic, taken: false, pulse: index * 0.7 })),
    switches: SWITCHES.map((trigger) => ({ ...trigger, active: false })),
    pullBlocks: PULL_BLOCKS.map((block) => ({ ...block })),
    traps: TRAPS.map((trap) => ({ ...trap, disabled: false, pulse: 0, awardReady: true })),
    crackedWalls: CRACKED_WALLS.map((wall) => ({ ...wall, open: false, hitTimer: 0 })),
    chests: CHESTS.map((chest) => ({ ...chest, open: false, pulse: 0 })),
    roomTrials: ROOM_TRIALS.map((trial) => ({ ...trial, solved: false, pulse: 0 })),
    enemies: ENEMIES.map((enemy) => ({
      ...enemy,
      maxHp: enemy.hp,
      hitTimer: 0,
      attackCooldown: 0.8,
      shotCooldown: 1.1,
      dead: false,
      phase: 1,
      baseX: enemy.x,
      baseY: enemy.y,
    })),
    arrows: [],
    bombsList: [],
    enemyShots: [],
    altars: mode === 'learn' ? buildAltars(0) : [],
    particles: [],
    result: null,
  };
}

function buildAltars(taskIndex) {
  const task = LEARN_TASKS[taskIndex % LEARN_TASKS.length];
  const positions = ALTAR_SETS[taskIndex % ALTAR_SETS.length];
  return task.options.map((label, index) => ({
    id: `altar-${taskIndex}-${label}`,
    label,
    correct: label === task.answer,
    x: positions[index].x,
    y: positions[index].y,
    active: true,
    pulse: index * 0.6,
  }));
}

function currentTask(game) {
  return LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
}

function hasDoorRequirement(player, door) {
  if (door.kind === 'sunSwitch' || door.kind === 'moonSwitch') return player.switches.includes(door.kind);
  return player.keys.includes(door.kind);
}

function solidRects(game) {
  return [
    ...WALLS,
    ...game.doors.filter((door) => !door.open).map((door) => ({ x: door.x, y: door.y, w: door.w, h: door.h })),
    ...game.pullBlocks.map((block) => ({ x: block.x - 28, y: block.y - 28, w: 56, h: 56 })),
    ...game.crackedWalls.filter((wall) => !wall.open).map((wall) => ({ x: wall.x, y: wall.y, w: wall.w, h: wall.h })),
  ];
}

function collides(game, rect) {
  return solidRects(game).some((solid) => rectsOverlap(rect, solid));
}

function spawnParticles(game, x, y, color, count = 8, power = 1) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed;
    const speed = (70 + (i % 5) * 24) * power;
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.58,
      color,
      size: 4 + (i % 3) * 2,
    });
  }
}

function isTrapActive(game, trap) {
  if (trap.disabled) return false;
  const phase = ((game.elapsed + trap.offset) % trap.cycle) / trap.cycle;
  return trap.kind === 'fire' ? phase > 0.42 && phase < 0.72 : phase > 0.52;
}

function openChest(game, chest) {
  if (chest.open) return;
  chest.open = true;
  game.score += 220;
  recordStat(game, 'chests');
  if (chest.reward === 'arrows') {
    game.player.arrows += 10;
    game.message = '+10 Pfeile';
  } else if (chest.reward === 'bombs') {
    game.player.hasBombs = true;
    game.player.bombs += 4;
    game.message = '+4 Bomben';
  } else if (chest.reward === 'heart') {
    game.player.hp = clamp(game.player.hp + 45, 0, 100);
    game.message = 'Herztrank';
  } else {
    game.player.rupees += 8;
    game.message = 'Tempelkarte +8 Rupien';
  }
  game.messageTimer = 0.85;
  spawnParticles(game, chest.x, chest.y, chest.color, 18, 1.25);
}

function breakCrackedWall(game, wall) {
  if (wall.open) return;
  wall.open = true;
  wall.hitTimer = 0.25;
  game.score += 360;
  recordStat(game, 'secrets');
  if (wall.reward === 'rupees') game.player.rupees += 12;
  if (wall.reward === 'arrows') game.player.arrows += 8;
  game.message = wall.reward === 'rupees' ? 'Geheimkammer +12 Rupien' : 'Geheimwand: +8 Pfeile';
  game.messageTimer = 0.9;
  spawnParticles(game, wall.x + wall.w / 2, wall.y + wall.h / 2, wall.color, 24, 1.5);
}

function solveRoomTrial(game, trial) {
  if (trial.solved) return;
  trial.solved = true;
  game.score += 420;
  recordStat(game, 'trials');
  if (trial.tool === 'bow') game.player.arrows += 4;
  if (trial.tool === 'bombs') game.player.bombs += 2;
  if (trial.tool === 'hookshot') game.player.stamina = 100;
  game.message = `${trial.label}-Pruefung geloest`;
  game.messageTimer = 0.9;
  spawnParticles(game, trial.x, trial.y, trial.color, 22, 1.35);
}

function damagePlayer(game, amount, source) {
  const player = game.player;
  if (player.invuln > 0) return;
  player.hp = clamp(player.hp - amount, 0, 100);
  player.invuln = 0.75;
  player.stamina = Math.max(0, player.stamina - 10);
  game.screenShake = 0.2;
  if (source) {
    const dx = player.x - source.x;
    const dy = player.y - source.y;
    const len = Math.hypot(dx, dy) || 1;
    player.vx += (dx / len) * 260;
    player.vy += (dy / len) * 260;
  }
  game.message = 'Treffer';
  game.messageTimer = 0.55;
  spawnParticles(game, player.x, player.y, '#fb7185', 10);
}

function moveActor(game, actor, axis, amount) {
  if (!amount) return;
  actor[axis] += amount;
  const rect = actor === game.player ? playerRect(actor) : enemyRect(actor);
  if (collides(game, rect)) actor[axis] -= amount;
}

function updateDoors(game) {
  const player = game.player;
  game.doors.forEach((door) => {
    if (door.open) return;
    const nearDoor = { x: door.x - 24, y: door.y - 24, w: door.w + 48, h: door.h + 48 };
    if (!rectsOverlap(playerRect(player), nearDoor)) return;
    if (hasDoorRequirement(player, door)) {
      door.open = true;
      game.score += 260;
      recordStat(game, 'doors');
      game.message = `${door.label} geoeffnet`;
      game.messageTimer = 0.8;
      spawnParticles(game, door.x + door.w / 2, door.y + door.h / 2, door.color, 14);
    } else {
      game.message = door.kind.includes('Switch') ? `${door.label}-Schalter fehlt` : `${door.label}-Schluessel fehlt`;
      game.messageTimer = Math.max(game.messageTimer, 0.35);
    }
  });
}

function updatePlayer(game, input, dt) {
  const player = game.player;
  const axisX = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const axisY = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  const len = Math.hypot(axisX, axisY) || 1;
  const nx = axisX / len;
  const ny = axisY / len;
  if (axisX || axisY) {
    player.dirX = nx;
    player.dirY = ny;
  }

  player.invuln = Math.max(0, player.invuln - dt);
  player.rollCooldown = Math.max(0, player.rollCooldown - dt);
  player.rollTimer = Math.max(0, player.rollTimer - dt);
  player.swordCooldown = Math.max(0, player.swordCooldown - dt);
  player.swordTimer = Math.max(0, player.swordTimer - dt);
  player.bowCooldown = Math.max(0, player.bowCooldown - dt);
  player.bombCooldown = Math.max(0, player.bombCooldown - dt);
  player.hookTimer = Math.max(0, player.hookTimer - dt);
  player.stamina = clamp(player.stamina + 20 * dt, 0, 100);

  if (input.roll && player.rollCooldown <= 0 && player.stamina >= 20) {
    player.rollTimer = 0.2;
    player.rollCooldown = 0.75;
    player.invuln = 0.22;
    player.stamina -= 20;
    spawnParticles(game, player.x, player.y, '#93c5fd', 8);
  }

  const speed = player.rollTimer > 0 ? 430 : 190;
  player.vx += nx * speed * 9 * dt;
  player.vy += ny * speed * 9 * dt;
  player.vx *= Math.pow(player.rollTimer > 0 ? 0.9 : 0.8, dt * 60);
  player.vy *= Math.pow(player.rollTimer > 0 ? 0.9 : 0.8, dt * 60);
  const velocity = Math.hypot(player.vx, player.vy) || 1;
  const maxSpeed = player.rollTimer > 0 ? 430 : 210;
  if (velocity > maxSpeed) {
    player.vx = (player.vx / velocity) * maxSpeed;
    player.vy = (player.vy / velocity) * maxSpeed;
  }
  moveActor(game, player, 'x', player.vx * dt);
  moveActor(game, player, 'y', player.vy * dt);
  player.x = clamp(player.x, 76, WORLD_W - 76);
  player.y = clamp(player.y, 76, WORLD_H - 76);
}

function swordAttack(game) {
  const player = game.player;
  if (player.swordCooldown > 0 || player.stamina < 8) return;
  player.swordTimer = 0.22;
  player.swordCooldown = 0.32;
  player.stamina -= 8;
  const box = {
    x: player.x + player.dirX * 42 - 34,
    y: player.y + player.dirY * 42 - 34,
    w: 68,
    h: 68,
  };
  game.enemies.forEach((enemy) => {
    if (enemy.dead || !rectsOverlap(box, enemyRect(enemy))) return;
    enemy.hp -= enemy.type === 'boss' ? 1 : 2;
    enemy.hitTimer = 0.2;
    enemy.x += player.dirX * 34;
    enemy.y += player.dirY * 34;
    game.score += 90;
    spawnParticles(game, enemy.x, enemy.y, '#fef3c7', 10);
  });

  game.roomTrials.forEach((trial) => {
    if (trial.solved || trial.tool !== 'bow') return;
    const trialRect = { x: trial.x - 34, y: trial.y - 34, w: 68, h: 68 };
    if (rectsOverlap(box, trialRect)) solveRoomTrial(game, trial);
  });
}

function shootArrow(game) {
  const player = game.player;
  if (!player.hasBow || player.bowCooldown > 0) return;
  if (player.arrows <= 0) {
    game.message = 'Keine Pfeile';
    game.messageTimer = 0.45;
    return;
  }
  player.arrows -= 1;
  player.bowCooldown = 0.32;
  game.arrows.push({
    id: `arrow-${game.elapsed}-${game.arrows.length}`,
    x: player.x + player.dirX * 24,
    y: player.y + player.dirY * 24,
    vx: player.dirX * 520,
    vy: player.dirY * 520,
    life: 0.9,
    damage: 2,
  });
  spawnParticles(game, player.x + player.dirX * 28, player.y + player.dirY * 28, '#facc15', 4);
}

function dropBomb(game) {
  const player = game.player;
  if (!player.hasBombs || player.bombCooldown > 0) return;
  if (player.bombs <= 0) {
    game.message = 'Keine Bomben';
    game.messageTimer = 0.45;
    return;
  }
  player.bombs -= 1;
  player.bombCooldown = 0.9;
  game.bombsList.push({
    id: `bomb-${game.elapsed}-${game.bombsList.length}`,
    x: player.x,
    y: player.y,
    timer: 1.05,
    exploded: false,
  });
  spawnParticles(game, player.x, player.y, '#f97316', 6);
}

function activateHookshot(game) {
  const player = game.player;
  if (!player.hasHookshot || player.hookTimer > 0 || player.stamina < 14) return;
  player.hookTimer = 0.5;
  player.stamina -= 14;
  let targetBlock = null;
  let targetDistance = Infinity;
  game.pullBlocks.forEach((block) => {
    const dx = block.x - player.x;
    const dy = block.y - player.y;
    const along = dx * player.dirX + dy * player.dirY;
    const perp = Math.abs(dx * player.dirY - dy * player.dirX);
    if (along > 0 && along < 360 && perp < 46 && along < targetDistance) {
      targetBlock = block;
      targetDistance = along;
    }
  });
  if (targetBlock) {
    targetBlock.x = targetBlock.targetX;
    targetBlock.y = targetBlock.targetY;
    targetBlock.solved = true;
    game.score += 300;
    recordStat(game, 'blocks');
    game.message = 'Block gezogen';
    game.messageTimer = 0.8;
    spawnParticles(game, targetBlock.x, targetBlock.y, '#a78bfa', 14);
  } else {
    const trial = game.roomTrials.find((candidate) => !candidate.solved && candidate.tool === 'hookshot' && distance(candidate, player) < 430);
    if (trial) {
      solveRoomTrial(game, trial);
      player.vx += player.dirX * 280;
      player.vy += player.dirY * 280;
      return;
    }
    spawnParticles(game, player.x + player.dirX * 120, player.y + player.dirY * 120, '#a78bfa', 6);
  }
}

function updateItems(game) {
  const player = game.player;
  game.items.forEach((item) => {
    if (item.taken) return;
    if (distance(player, item) > 40) return;
    item.taken = true;
    if (item.kind === 'blueKey' || item.kind === 'redKey' || item.kind === 'bossKey') player.keys.push(item.kind);
    if (item.kind === 'bow') player.hasBow = true;
    if (item.kind === 'bombs') {
      player.hasBombs = true;
      player.bombs += 5;
    }
    if (item.kind === 'hookshot') player.hasHookshot = true;
    if (item.kind === 'heart') player.hp = clamp(player.hp + 35, 0, 100);
    if (item.kind === 'rupee') player.rupees += 1;
    if (item.kind === 'bow' || item.kind === 'bombs' || item.kind === 'hookshot') recordStat(game, 'tools');
    if (item.kind !== 'heart' && item.kind !== 'rupee') game.message = item.label;
    else game.message = item.kind === 'heart' ? 'Herz' : 'Rupie';
    game.messageTimer = 0.75;
    game.score += item.kind === 'rupee' ? 80 : 260;
    spawnParticles(game, item.x, item.y, item.color, 12);
  });
}

function updateRelics(game) {
  const player = game.player;
  game.relics.forEach((relic) => {
    if (relic.taken) return;
    relic.pulse += 0.08;
    if (distance(player, relic) > 42) return;
    relic.taken = true;
    player.rupees += 3;
    player.stamina = 100;
    game.score += 180;
    recordStat(game, 'relics');
    game.message = `Relikt: ${relic.label}`;
    game.messageTimer = 0.75;
    spawnParticles(game, relic.x, relic.y, '#facc15', 18, 1.2);
  });
}

function updateSwitches(game) {
  const player = game.player;
  game.switches.forEach((trigger) => {
    if (trigger.active) return;
    if (distance(player, trigger) > 46) return;
    trigger.active = true;
    player.switches.push(trigger.id);
    game.score += 340;
    game.message = `${trigger.label}-Schalter`;
    game.messageTimer = 0.8;
    spawnParticles(game, trigger.x, trigger.y, trigger.color, 16);
  });
}

function updateChests(game) {
  const player = game.player;
  game.chests.forEach((chest) => {
    chest.pulse += 0.06;
    if (chest.open || distance(player, chest) > 48) return;
    openChest(game, chest);
  });
}

function updateTraps(game, dt) {
  const player = game.player;
  const playerBox = playerRect(player);
  game.traps.forEach((trap) => {
    trap.pulse += dt * 5;
    if (trap.disabled) return;
    const trapRect = { x: trap.x, y: trap.y, w: trap.w, h: trap.h };
    const active = isTrapActive(game, trap);
    if (!active) {
      if (trap.awardReady && rectsOverlap(playerBox, trapRect)) {
        trap.awardReady = false;
        game.score += 70;
        recordStat(game, 'traps');
        spawnParticles(game, trap.x + trap.w / 2, trap.y + trap.h / 2, '#93c5fd', 8);
      } else if (!rectsOverlap(playerBox, trapRect)) {
        trap.awardReady = true;
      }
      return;
    }
    if (rectsOverlap(playerBox, trapRect)) damagePlayer(game, trap.damage, { x: trap.x + trap.w / 2, y: trap.y + trap.h / 2 });
    game.enemies.forEach((enemy) => {
      if (enemy.dead || !rectsOverlap(enemyRect(enemy), trapRect)) return;
      enemy.hp -= trap.kind === 'fire' ? 0.7 : 0.45;
      enemy.hitTimer = Math.max(enemy.hitTimer, 0.08);
    });
  });
}

function updateArrows(game, dt) {
  game.arrows = game.arrows
    .map((arrow) => ({
      ...arrow,
      x: arrow.x + arrow.vx * dt,
      y: arrow.y + arrow.vy * dt,
      life: arrow.life - dt,
    }))
    .filter((arrow) => {
      if (arrow.life <= 0) return false;
      const arrowRect = { x: arrow.x - 5, y: arrow.y - 5, w: 10, h: 10 };
      if (collides(game, arrowRect)) return false;
      const hit = game.enemies.find((enemy) => !enemy.dead && rectsOverlap(arrowRect, enemyRect(enemy)));
      if (hit) {
        hit.hp -= arrow.damage;
        hit.hitTimer = 0.2;
        game.score += 80;
        spawnParticles(game, arrow.x, arrow.y, '#f87171', 8);
        return false;
      }
      const trial = game.roomTrials.find((candidate) => !candidate.solved && candidate.tool === 'bow' && distance(candidate, arrow) < 44);
      if (trial) {
        solveRoomTrial(game, trial);
        return false;
      }
      return true;
    });

  game.enemyShots = game.enemyShots
    .map((shot) => ({
      ...shot,
      x: shot.x + shot.vx * dt,
      y: shot.y + shot.vy * dt,
      life: shot.life - dt,
    }))
    .filter((shot) => {
      if (shot.life <= 0) return false;
      const shotRect = { x: shot.x - 7, y: shot.y - 7, w: 14, h: 14 };
      if (collides(game, shotRect)) return false;
      if (rectsOverlap(shotRect, playerRect(game.player))) {
        damagePlayer(game, shot.damage, shot);
        return false;
      }
      return true;
    });
}

function updateBombs(game, dt) {
  game.bombsList = game.bombsList
    .map((bomb) => ({ ...bomb, timer: bomb.timer - dt }))
    .filter((bomb) => {
      if (bomb.timer > 0) return true;
      const blast = { x: bomb.x - 94, y: bomb.y - 94, w: 188, h: 188 };
      game.screenShake = 0.24;
      game.enemies.forEach((enemy) => {
        if (enemy.dead || !rectsOverlap(blast, enemyRect(enemy))) return;
        enemy.hp -= enemy.type === 'boss' ? 4 : 5;
        enemy.hitTimer = 0.3;
        game.score += 120;
      });
      game.pullBlocks.forEach((block) => {
        if (block.solved) return;
        if (distance(block, bomb) < 125) {
          block.x = block.targetX;
          block.y = block.targetY;
          block.solved = true;
          game.score += 250;
        }
      });
      game.crackedWalls.forEach((wall) => {
        if (wall.open) return;
        if (rectsOverlap(blast, { x: wall.x, y: wall.y, w: wall.w, h: wall.h })) breakCrackedWall(game, wall);
      });
      game.roomTrials.forEach((trial) => {
        if (trial.solved || trial.tool !== 'bombs') return;
        if (distance(trial, bomb) < 150) solveRoomTrial(game, trial);
      });
      spawnParticles(game, bomb.x, bomb.y, '#f97316', 24, 1.6);
      return false;
    });
}

function updateEnemies(game, dt) {
  const player = game.player;
  game.enemies.forEach((enemy) => {
    if (enemy.dead) return;
    enemy.hitTimer = Math.max(0, enemy.hitTimer - dt);
    enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
    enemy.shotCooldown = Math.max(0, enemy.shotCooldown - dt);
    if (enemy.type === 'boss' && enemy.phase === 1 && enemy.hp < enemy.maxHp * 0.52) {
      enemy.phase = 2;
      enemy.shotCooldown = 0.15;
      game.screenShake = 0.28;
      game.message = 'Tempelwaechter Phase 2';
      game.messageTimer = 1.1;
      spawnParticles(game, enemy.x, enemy.y, '#f97316', 36, 1.8);
    }
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const len = Math.hypot(dx, dy) || 1;
    const active = len < (enemy.type === 'boss' ? 560 : 380);
    if (active && enemy.type !== 'eye') {
      const speed = enemy.type === 'bat' ? 122 : enemy.type === 'slime' ? 72 : enemy.type === 'boss' ? (enemy.phase === 2 ? 116 : 82) : 94;
      moveActor(game, enemy, 'x', (dx / len) * speed * dt);
      moveActor(game, enemy, 'y', (dy / len) * speed * dt);
    } else if (!active) {
      enemy.x += Math.sin(game.elapsed * 1.3 + enemy.baseX) * 18 * dt;
      enemy.y += Math.cos(game.elapsed * 1.1 + enemy.baseY) * 18 * dt;
    }

    if ((enemy.type === 'eye' || enemy.type === 'boss') && enemy.shotCooldown <= 0 && len < 620) {
      enemy.shotCooldown = enemy.type === 'boss' ? (enemy.phase === 2 ? 0.52 : 0.75) : 1.25;
      const spread = enemy.type === 'boss' && enemy.phase === 2 ? [-0.22, 0, 0.22] : [0];
      spread.forEach((angle, index) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const vx = (dx / len) * cos - (dy / len) * sin;
        const vy = (dx / len) * sin + (dy / len) * cos;
        game.enemyShots.push({
          id: `enemy-shot-${enemy.id}-${game.elapsed}-${index}`,
          x: enemy.x,
          y: enemy.y,
          vx: vx * (enemy.type === 'boss' ? (enemy.phase === 2 ? 390 : 340) : 250),
          vy: vy * (enemy.type === 'boss' ? (enemy.phase === 2 ? 390 : 340) : 250),
          damage: enemy.type === 'boss' ? (enemy.phase === 2 ? 10 : 12) : 8,
          life: 2.4,
        });
      });
    }

    if (rectsOverlap(playerRect(player), enemyRect(enemy)) && enemy.attackCooldown <= 0) {
      enemy.attackCooldown = enemy.type === 'boss' ? 0.6 : 0.9;
      damagePlayer(game, enemy.type === 'boss' ? 16 : 10, enemy);
    }

    if (enemy.hp <= 0) {
      enemy.dead = true;
      game.score += enemy.type === 'boss' ? 1800 : 320;
      player.rupees += enemy.type === 'boss' ? 12 : 2;
      recordStat(game, enemy.type === 'boss' ? 'bosses' : 'defeats');
      spawnParticles(game, enemy.x, enemy.y, enemy.type === 'boss' ? '#f97316' : '#f87171', enemy.type === 'boss' ? 30 : 16, 1.35);
    }
  });
}

function updateAltars(game, dt) {
  if (game.mode !== 'learn') return;
  game.altarCooldown = Math.max(0, game.altarCooldown - dt);
  if (game.altarCooldown > 0) return;
  const player = game.player;
  game.altars.forEach((altar) => {
    if (!altar.active) return;
    if (distance(player, altar) > 52) return;
    const task = currentTask(game);
    altar.active = false;
    if (altar.correct) {
      game.score += 620;
      player.stamina = 100;
      player.hp = clamp(player.hp + 16, 0, 100);
      if (!player.keys.includes('blueKey')) player.keys.push('blueKey');
      recordStat(game, 'learnCorrect');
      game.message = `${task.subject}: ${task.answer}`;
      spawnParticles(game, altar.x, altar.y, '#5eead4', 18, 1.25);
    } else {
      damagePlayer(game, 14, altar);
      game.message = `${altar.label} war falsch. Richtig: ${task.answer}`;
      spawnParticles(game, altar.x, altar.y, '#fb7185', 14);
    }
    game.messageTimer = 1.1;
    game.taskIndex += 1;
    game.altars = buildAltars(game.taskIndex);
    game.altarCooldown = 1.0;
  });
}

function updateParticles(game, dt) {
  game.particles = game.particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * dt,
      y: particle.y + particle.vy * dt,
      vx: particle.vx * Math.pow(0.9, dt * 60),
      vy: particle.vy * Math.pow(0.9, dt * 60),
      life: particle.life - dt,
    }))
    .filter((particle) => particle.life > 0);
}

function updateGame(game, input, dt, onFinish) {
  if (game.phase !== 'run') return;
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.missionNoticeTimer = Math.max(0, game.missionNoticeTimer - dt);
  game.screenShake = Math.max(0, game.screenShake - dt);
  updateDoors(game);
  updatePlayer(game, input, dt);
  if (input.sword) swordAttack(game);
  if (input.bow) shootArrow(game);
  if (input.bomb) dropBomb(game);
  if (input.hookshot) activateHookshot(game);
  updateItems(game);
  updateRelics(game);
  updateSwitches(game);
  updateChests(game);
  updateTraps(game, dt);
  updateArrows(game, dt);
  updateBombs(game, dt);
  updateEnemies(game, dt);
  updateAltars(game, dt);
  updateParticles(game, dt);
  const shake = game.screenShake > 0 ? Math.sin(game.elapsed * 90) * game.screenShake * 16 : 0;
  game.cameraX = clamp(game.player.x - CENTER_X + shake, 0, WORLD_W - WIDTH);
  game.cameraY = clamp(game.player.y - CENTER_Y - shake * 0.4, 0, WORLD_H - HEIGHT);

  const exit = { x: 2240, y: 1390, w: 100, h: 130 };
  const bossDead = game.enemies.find((enemy) => enemy.id === 'boss')?.dead;
  if ((rectsOverlap(playerRect(game.player), exit) && bossDead) || game.player.hp <= 0) {
    const won = game.player.hp > 0;
    game.phase = 'result';
    game.result = {
      title: won ? 'Tempel gereinigt' : 'Tempel verloren',
      score: game.score + (won ? 1800 + game.player.rupees * 20 : 0),
      rupees: game.player.rupees,
    };
    onFinish(game.result);
  }
}

function worldToScreen(game, x, y) {
  return { x: x - game.cameraX, y: y - game.cameraY };
}

function drawBackground(ctx, game) {
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(0.55, '#1e293b');
  gradient.addColorStop(1, '#0f3f2e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.translate(-game.cameraX % 72, -game.cameraY % 72);
  ctx.strokeStyle = 'rgba(250,204,21,.08)';
  ctx.lineWidth = 1;
  for (let x = -72; x < WIDTH + 72; x += 72) {
    ctx.beginPath();
    ctx.moveTo(x, -72);
    ctx.lineTo(x, HEIGHT + 72);
    ctx.stroke();
  }
  for (let y = -72; y < HEIGHT + 72; y += 72) {
    ctx.beginPath();
    ctx.moveTo(-72, y);
    ctx.lineTo(WIDTH + 72, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawWalls(ctx, game) {
  WALLS.forEach((wall) => {
    const p = worldToScreen(game, wall.x, wall.y);
    if (p.x + wall.w < -80 || p.x > WIDTH + 80 || p.y + wall.h < -80 || p.y > HEIGHT + 80) return;
    ctx.fillStyle = '#111827';
    drawRoundedRect(ctx, p.x, p.y, wall.w, wall.h, 7);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.07)';
    ctx.fillRect(p.x + 7, p.y + 7, Math.max(0, wall.w - 14), 5);
  });

  game.doors.forEach((door) => {
    const p = worldToScreen(game, door.x, door.y);
    if (p.x + door.w < -80 || p.x > WIDTH + 80 || p.y + door.h < -80 || p.y > HEIGHT + 80) return;
    ctx.save();
    ctx.globalAlpha = door.open ? 0.25 : 1;
    ctx.shadowColor = door.color;
    ctx.shadowBlur = door.open ? 0 : 18;
    ctx.fillStyle = door.open ? 'rgba(100,116,139,.35)' : door.color;
    drawRoundedRect(ctx, p.x, p.y, door.w, door.h, 6);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#020617';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.save();
    ctx.translate(p.x + door.w / 2, p.y + door.h / 2);
    if (door.h > door.w) ctx.rotate(-Math.PI / 2);
    ctx.fillText(door.open ? 'OFFEN' : door.label, 0, 0);
    ctx.restore();
    ctx.restore();
  });

  game.pullBlocks.forEach((block) => {
    const p = worldToScreen(game, block.x, block.y);
    ctx.save();
    ctx.shadowColor = block.solved ? '#5eead4' : '#a78bfa';
    ctx.shadowBlur = 10;
    ctx.fillStyle = block.solved ? '#0f766e' : '#334155';
    drawRoundedRect(ctx, p.x - 28, p.y - 28, 56, 56, 10);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  });

  game.crackedWalls.forEach((wall) => {
    if (wall.open) return;
    const p = worldToScreen(game, wall.x, wall.y);
    if (p.x + wall.w < -80 || p.x > WIDTH + 80 || p.y + wall.h < -80 || p.y > HEIGHT + 80) return;
    ctx.save();
    ctx.shadowColor = wall.hitTimer > 0 ? '#fef3c7' : wall.color;
    ctx.shadowBlur = wall.hitTimer > 0 ? 24 : 12;
    ctx.fillStyle = '#1f2937';
    drawRoundedRect(ctx, p.x, p.y, wall.w, wall.h, 7);
    ctx.fill();
    ctx.strokeStyle = wall.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p.x + 8, p.y + 14);
    ctx.lineTo(p.x + wall.w - 8, p.y + wall.h - 18);
    ctx.moveTo(p.x + wall.w - 9, p.y + 26);
    ctx.lineTo(p.x + 9, p.y + wall.h - 12);
    ctx.stroke();
    ctx.restore();
  });
}

function drawTraps(ctx, game) {
  game.traps.forEach((trap) => {
    if (trap.disabled) return;
    const p = worldToScreen(game, trap.x, trap.y);
    if (p.x + trap.w < -80 || p.x > WIDTH + 80 || p.y + trap.h < -80 || p.y > HEIGHT + 80) return;
    const active = isTrapActive(game, trap);
    ctx.save();
    ctx.globalAlpha = active ? 0.92 : 0.38;
    ctx.shadowColor = active ? (trap.kind === 'fire' ? '#fb923c' : '#e2e8f0') : 'transparent';
    ctx.shadowBlur = active ? 22 : 0;
    ctx.fillStyle = trap.kind === 'fire' ? 'rgba(251,146,60,.72)' : 'rgba(148,163,184,.42)';
    drawRoundedRect(ctx, p.x, p.y, trap.w, trap.h, 10);
    ctx.fill();
    ctx.strokeStyle = active ? '#fef3c7' : '#64748b';
    ctx.lineWidth = active ? 4 : 2;
    if (trap.kind === 'spikes') {
      for (let x = p.x + 14; x < p.x + trap.w - 8; x += 22) {
        ctx.beginPath();
        ctx.moveTo(x, p.y + trap.h - 10);
        ctx.lineTo(x + 10, active ? p.y + 12 : p.y + trap.h / 2);
        ctx.lineTo(x + 20, p.y + trap.h - 10);
        ctx.stroke();
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(p.x + 8, p.y + trap.h / 2);
      ctx.lineTo(p.x + trap.w - 8, p.y + trap.h / 2);
      ctx.stroke();
    }
    ctx.restore();
  });
}

function drawChestsAndTrials(ctx, game) {
  game.chests.forEach((chest) => {
    const p = worldToScreen(game, chest.x, chest.y + Math.sin(chest.pulse) * 3);
    if (p.x < -70 || p.x > WIDTH + 70 || p.y < -70 || p.y > HEIGHT + 70) return;
    ctx.save();
    ctx.globalAlpha = chest.open ? 0.42 : 1;
    ctx.shadowColor = chest.open ? 'transparent' : chest.color;
    ctx.shadowBlur = chest.open ? 0 : 18;
    ctx.fillStyle = chest.open ? '#475569' : '#78350f';
    drawRoundedRect(ctx, p.x - 28, p.y - 22, 56, 44, 9);
    ctx.fill();
    ctx.strokeStyle = chest.open ? '#64748b' : chest.color;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = chest.open ? '#94a3b8' : '#fef3c7';
    ctx.font = '900 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(chest.open ? 'OPEN' : 'CHEST', p.x, p.y + 4);
    ctx.restore();
  });

  game.roomTrials.forEach((trial) => {
    const p = worldToScreen(game, trial.x, trial.y);
    if (p.x < -80 || p.x > WIDTH + 80 || p.y < -80 || p.y > HEIGHT + 80) return;
    trial.pulse += 0.03;
    ctx.save();
    ctx.globalAlpha = trial.solved ? 0.44 : 0.9;
    ctx.shadowColor = trial.solved ? '#5eead4' : trial.color;
    ctx.shadowBlur = trial.solved ? 16 : 22;
    ctx.fillStyle = trial.solved ? 'rgba(20,184,166,.42)' : 'rgba(15,23,42,.82)';
    drawRoundedRect(ctx, p.x - 42, p.y - 32, 84, 64, 15);
    ctx.fill();
    ctx.strokeStyle = trial.solved ? '#5eead4' : trial.color;
    ctx.lineWidth = trial.solved ? 3 : 5;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(trial.solved ? 'OK' : trial.label, p.x, p.y + 4);
    ctx.restore();
  });
}

function drawItems(ctx, game) {
  game.items.forEach((item) => {
    if (item.taken) return;
    const p = worldToScreen(game, item.x, item.y + Math.sin(game.elapsed * 4 + item.x) * 4);
    if (p.x < -50 || p.x > WIDTH + 50 || p.y < -50 || p.y > HEIGHT + 50) return;
    ctx.save();
    ctx.shadowColor = item.color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = item.color;
    if (item.kind === 'heart') {
      ctx.beginPath();
      ctx.arc(p.x - 8, p.y - 4, 10, 0, Math.PI * 2);
      ctx.arc(p.x + 8, p.y - 4, 10, 0, Math.PI * 2);
      ctx.lineTo(p.x, p.y + 18);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 20);
      ctx.lineTo(p.x + 20, p.y);
      ctx.lineTo(p.x, p.y + 20);
      ctx.lineTo(p.x - 20, p.y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  });
}

function drawRelics(ctx, game) {
  game.relics.forEach((relic) => {
    if (relic.taken) return;
    const p = worldToScreen(game, relic.x, relic.y);
    if (p.x < -60 || p.x > WIDTH + 60 || p.y < -60 || p.y > HEIGHT + 60) return;
    const pulse = 1 + Math.sin(game.elapsed * 5 + relic.pulse) * 0.1;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(pulse, pulse);
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 22;
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(18, -5);
    ctx.lineTo(11, 20);
    ctx.lineTo(-11, 20);
    ctx.lineTo(-18, -5);
    ctx.closePath();
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#020617';
    ctx.font = '900 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(relic.label.slice(0, 3).toUpperCase(), 0, 4);
    ctx.restore();
  });
}

function drawSwitches(ctx, game) {
  game.switches.forEach((trigger) => {
    const p = worldToScreen(game, trigger.x, trigger.y);
    ctx.save();
    ctx.globalAlpha = trigger.active ? 1 : 0.75;
    ctx.shadowColor = trigger.color;
    ctx.shadowBlur = trigger.active ? 22 : 10;
    ctx.fillStyle = trigger.active ? trigger.color : 'rgba(148,163,184,.7)';
    drawRoundedRect(ctx, p.x - 35, p.y - 22, 70, 44, 12);
    ctx.fill();
    ctx.fillStyle = '#020617';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(trigger.label, p.x, p.y);
    ctx.restore();
  });
}

function drawAltars(ctx, game) {
  if (game.mode !== 'learn') return;
  game.altars.forEach((altar) => {
    if (!altar.active) return;
    const p = worldToScreen(game, altar.x, altar.y);
    if (p.x < -80 || p.x > WIDTH + 80 || p.y < -80 || p.y > HEIGHT + 80) return;
    const pulse = 1 + Math.sin(game.elapsed * 5 + altar.pulse) * 0.08;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(pulse, pulse);
    ctx.globalAlpha = game.altarCooldown > 0 ? 0.55 : 0.95;
    ctx.shadowColor = altar.correct ? '#5eead4' : '#a78bfa';
    ctx.shadowBlur = 22;
    ctx.fillStyle = altar.correct ? 'rgba(20,184,166,.84)' : 'rgba(79,70,229,.82)';
    drawRoundedRect(ctx, -52, -44, 104, 88, 16);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 15px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(altar.label, 0, 0);
    ctx.restore();
  });
}

function drawEnemies(ctx, game) {
  game.enemies.forEach((enemy) => {
    if (enemy.dead) return;
    const p = worldToScreen(game, enemy.x, enemy.y);
    if (p.x < -90 || p.x > WIDTH + 90 || p.y < -90 || p.y > HEIGHT + 90) return;
    const size = enemy.type === 'boss' ? 92 : enemy.type === 'guard' ? 52 : 42;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.shadowColor = enemy.hitTimer > 0 ? '#fecaca' : enemy.type === 'boss' ? '#f97316' : '#ef4444';
    ctx.shadowBlur = enemy.hitTimer > 0 ? 24 : 12;
    ctx.fillStyle = enemy.hitTimer > 0 ? '#fecaca' : enemy.type === 'boss' ? '#7c2d12' : enemy.type === 'eye' ? '#7c3aed' : enemy.type === 'bat' ? '#0f172a' : '#991b1b';
    if (enemy.type === 'bat') {
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(28, 12);
      ctx.lineTo(8, 22);
      ctx.lineTo(0, 12);
      ctx.lineTo(-8, 22);
      ctx.lineTo(-28, 12);
      ctx.closePath();
      ctx.fill();
    } else if (enemy.type === 'eye') {
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(0, 0, size / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(4, 0, size / 9, 0, Math.PI * 2);
      ctx.fill();
    } else {
      drawRoundedRect(ctx, -size / 2, -size / 2, size, size, enemy.type === 'boss' ? 22 : 12);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(size * 0.08, -size * 0.12, size * 0.11, size * 0.11);
    }
    ctx.fillStyle = 'rgba(2,6,23,.82)';
    drawRoundedRect(ctx, -size / 2, -size / 2 - 14, size, 7, 4);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    drawRoundedRect(ctx, -size / 2, -size / 2 - 14, size * clamp(enemy.hp / enemy.maxHp, 0, 1), 7, 4);
    ctx.fill();
    ctx.restore();
  });
}

function drawProjectiles(ctx, game) {
  game.arrows.forEach((arrow) => {
    const p = worldToScreen(game, arrow.x, arrow.y);
    const angle = Math.atan2(arrow.vy, arrow.vx);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(angle);
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(12, 0);
    ctx.stroke();
    ctx.restore();
  });
  game.enemyShots.forEach((shot) => {
    const p = worldToScreen(game, shot.x, shot.y);
    ctx.save();
    ctx.shadowColor = '#fb7185';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  game.bombsList.forEach((bomb) => {
    const p = worldToScreen(game, bomb.x, bomb.y);
    ctx.save();
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 14;
    ctx.fillStyle = bomb.timer < 0.35 && Math.sin(game.elapsed * 30) > 0 ? '#fef3c7' : '#0f172a';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
  });
}

function drawPlayer(ctx, game) {
  const player = game.player;
  const p = worldToScreen(game, player.x, player.y);
  const angle = Math.atan2(player.dirY, player.dirX);
  ctx.save();
  if (player.hookTimer > 0) {
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + player.dirX * 120, p.y + player.dirY * 120);
    ctx.stroke();
  }
  ctx.translate(p.x, p.y);
  ctx.rotate(angle);
  ctx.globalAlpha = player.invuln > 0 && Math.sin(game.elapsed * 42) > 0 ? 0.56 : 1;
  ctx.shadowColor = player.rollTimer > 0 ? '#93c5fd' : '#22d3ee';
  ctx.shadowBlur = player.rollTimer > 0 ? 24 : 13;
  ctx.fillStyle = '#2563eb';
  drawRoundedRect(ctx, -19, -20, 38, 40, 11);
  ctx.fill();
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(14, 0, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = player.swordTimer > 0 ? '#fef3c7' : '#bfdbfe';
  ctx.lineWidth = player.swordTimer > 0 ? 11 : 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(26, 0);
  ctx.lineTo(player.swordTimer > 0 ? 82 : 50, 0);
  ctx.stroke();
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.arc(18, -4, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawExit(ctx, game) {
  const bossDead = game.enemies.find((enemy) => enemy.id === 'boss')?.dead;
  const exit = { x: 2240, y: 1390, w: 100, h: 130 };
  const p = worldToScreen(game, exit.x, exit.y);
  ctx.save();
  ctx.shadowColor = bossDead ? '#5eead4' : '#64748b';
  ctx.shadowBlur = bossDead ? 24 : 0;
  ctx.fillStyle = bossDead ? 'rgba(20,184,166,.32)' : 'rgba(71,85,105,.35)';
  drawRoundedRect(ctx, p.x, p.y, exit.w, exit.h, 16);
  ctx.fill();
  ctx.strokeStyle = bossDead ? '#5eead4' : '#64748b';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('EXIT', p.x + exit.w / 2, p.y + 32);
  ctx.restore();
}

function drawParticles(ctx, game) {
  game.particles.forEach((particle) => {
    const p = worldToScreen(game, particle.x, particle.y);
    ctx.save();
    ctx.globalAlpha = clamp(particle.life / 0.58, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, particle.size + particle.life * 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawMeter(ctx, x, y, w, h, value, color, label) {
  ctx.fillStyle = 'rgba(255,255,255,.16)';
  drawRoundedRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.fillStyle = color;
  drawRoundedRect(ctx, x, y, w * clamp(value / 100, 0, 1), h, h / 2);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '800 10px Outfit, sans-serif';
  ctx.fillText(label, x, y - 4);
}

function drawHud(ctx, game) {
  const player = game.player;
  const activeGoals = game.goals.slice(0, 4);
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.88)';
  drawRoundedRect(ctx, 28, 22, 436, 132, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 25px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Temple Quest Pro: Learncade' : 'Faska Temple Quest Pro', 52, 58);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 14px Outfit, sans-serif';
  const inventory = [
    player.hasBow ? 'Bogen' : null,
    player.hasBombs ? `Bomben ${player.bombs}` : null,
    player.hasHookshot ? 'Hookshot' : null,
  ].filter(Boolean).join(' · ') || 'Schwert';
  ctx.fillText(`${inventory} · Pfeile ${player.arrows} · Score ${game.score}`, 52, 88);
  drawMeter(ctx, 52, 118, 118, 12, player.hp, '#22c55e', 'HP');
  drawMeter(ctx, 198, 118, 118, 12, player.stamina, '#facc15', 'STAMINA');
  ctx.fillStyle = '#67e8f9';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText(`Keys ${player.keys.length} · Switch ${player.switches.length} · Truhen ${game.stats.chests}/4`, 340, 129);

  if (game.mode === 'learn') {
    const task = currentTask(game);
    const taskX = 490;
    const taskY = 132;
    const taskW = 390;
    ctx.fillStyle = '#020617';
    drawRoundedRect(ctx, taskX, taskY, taskW, 84, 18);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '900 17px Outfit, sans-serif';
    ctx.fillText(task.prompt, taskX + taskW / 2, taskY + 31, taskW - 34);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 14px Outfit, sans-serif';
    ctx.fillText(`${task.subject} · tritt auf den richtigen Altar`, taskX + taskW / 2, taskY + 58);
  }

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(2,6,23,.88)';
  drawRoundedRect(ctx, WIDTH - 382, 22, 354, 172, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 24px Outfit, sans-serif';
  ctx.fillText(`Raum ${Math.floor(player.x / 480) + 1}-${Math.floor(player.y / 400) + 1}`, WIDTH - 52, 58);
  ctx.fillStyle = '#a7f3d0';
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText(`Boss ${game.enemies.find((enemy) => enemy.id === 'boss')?.dead ? 'besiegt' : 'wartet'} · Relikte ${game.stats.relics}/${RELICS.length}`, WIDTH - 52, 86);
  ctx.fillStyle = '#fef3c7';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText(`Fallen ${game.stats.traps} · Secrets ${game.stats.secrets} · Pruefungen ${game.stats.trials}`, WIDTH - 52, 104);
  ctx.textAlign = 'left';
  activeGoals.forEach((goal, index) => {
    const value = Math.min(game.stats[goal.stat] || 0, goal.target);
    ctx.fillStyle = goal.completed ? '#86efac' : '#e2e8f0';
    ctx.font = '800 12px Outfit, sans-serif';
    ctx.fillText(`${goal.completed ? 'DONE' : `${value}/${goal.target}`}  ${goal.label}`, WIDTH - 352, 124 + index * 18);
  });

  if (game.missionNoticeTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(15,23,42,.86)';
    drawRoundedRect(ctx, CENTER_X - 240, 140, 480, 46, 16);
    ctx.fill();
    ctx.fillStyle = '#86efac';
    ctx.font = '900 19px Outfit, sans-serif';
    ctx.fillText(game.missionNotice, CENTER_X, 168);
  }

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.78)';
    drawRoundedRect(ctx, CENTER_X - 270, HEIGHT - 112, 540, 56, 18);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 24px Outfit, sans-serif';
    ctx.fillText(game.message, CENTER_X, HEIGHT - 76);
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.76)';
  drawRoundedRect(ctx, 34, HEIGHT - 44, 842, 32, 12);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText('WASD bewegen · Space Schwert · J Bogen · K Bombe · E Hookshot · Shift Rolle · M Modus · R Restart', 54, HEIGHT - 23);
  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawBackground(ctx, game);
  drawExit(ctx, game);
  drawTraps(ctx, game);
  drawWalls(ctx, game);
  drawChestsAndTrials(ctx, game);
  drawItems(ctx, game);
  drawRelics(ctx, game);
  drawSwitches(ctx, game);
  drawAltars(ctx, game);
  drawEnemies(ctx, game);
  drawProjectiles(ctx, game);
  drawPlayer(ctx, game);
  drawParticles(ctx, game);
  drawHud(ctx, game);
}

export default function FaskaTempleQuestSwarm() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameRef = useRef(makeInitialGame('arcade'));
  const inputRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
    sword: false,
    bow: false,
    bomb: false,
    hookshot: false,
    roll: false,
  });
  const modeRef = useRef('arcade');
  const [mode, setMode] = useState('arcade');
  const [result, setResult] = useState(null);

  const clearInput = useCallback(() => {
    inputRef.current = {
      up: false,
      down: false,
      left: false,
      right: false,
      sword: false,
      bow: false,
      bomb: false,
      hookshot: false,
      roll: false,
    };
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
    inputRef.current[name] = pressed;
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;
    let raf = 0;
    let last = performance.now();
    const keyMap = new Map([
      ['ArrowUp', 'up'], ['w', 'up'], ['W', 'up'],
      ['ArrowDown', 'down'], ['s', 'down'], ['S', 'down'],
      ['ArrowLeft', 'left'], ['a', 'left'], ['A', 'left'],
      ['ArrowRight', 'right'], ['d', 'right'], ['D', 'right'],
      [' ', 'sword'],
      ['j', 'bow'], ['J', 'bow'],
      ['k', 'bomb'], ['K', 'bomb'],
      ['e', 'hookshot'], ['E', 'hookshot'],
      ['Shift', 'roll'],
    ]);
    const keyDown = (event) => {
      const mapped = keyMap.get(event.key);
      if (mapped) {
        inputRef.current[mapped] = true;
        event.preventDefault();
      }
      if (event.key === 'm' || event.key === 'M') setGameMode(modeRef.current === 'learn' ? 'arcade' : 'learn');
      if (event.key === 'r' || event.key === 'R') restart();
    };
    const keyUp = (event) => {
      const mapped = keyMap.get(event.key);
      if (mapped) {
        inputRef.current[mapped] = false;
        event.preventDefault();
      }
    };
    const loop = (now) => {
      const dt = Math.min(0.033, (now - last) / 1000 || 0);
      last = now;
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
    boxShadow: '0 12px 32px rgba(0,0,0,.32)',
  };
  const actionButton = {
    ...padButton,
    width: 90,
    height: 64,
    fontSize: 12,
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
          boxShadow: '0 0 100px rgba(34,197,94,.14), inset 0 0 60px rgba(250,204,21,.06), 0 0 90px rgba(0,0,0,.55)',
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
        boxShadow: 'inset 0 0 150px 60px rgba(0,0,0,.45), inset 0 0 80px 30px rgba(34,197,94,.08)',
        borderRadius: 2,
      }} />

      <div style={{ position: 'fixed', top: canvasTopChrome, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.55 }}>
          Normal
        </button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.55 }}>
          Learncade
        </button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      <div className="temple-touch-controls" style={{
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

      <div className="temple-touch-controls" style={{
        position: 'fixed', right: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'flex', gap: 10, alignItems: 'flex-end', touchAction: 'none',
      }}>
        <button aria-label="Bogen" style={actionButton} {...holdButton('bow')}>BOW</button>
        <button aria-label="Bombe" style={actionButton} {...holdButton('bomb')}>BOMB</button>
        <button aria-label="Hookshot" style={actionButton} {...holdButton('hookshot')}>HOOK</button>
        <button aria-label="Rolle" style={actionButton} {...holdButton('roll')}>ROLL</button>
        <button aria-label="Schwert" style={{ ...actionButton, width: 96, height: 74, background: 'rgba(250,204,21,.86)', color: '#111827' }} {...holdButton('sword')}>
          SWORD
        </button>
      </div>

      {result && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2,6,23,.78)', zIndex: 20, flexDirection: 'column', gap: 16,
        }}>
          <div style={{ fontSize: 54, fontWeight: 900, color: '#f8fafc' }}>{result.title}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#facc15' }}>Score {result.score}</div>
          <div style={{ fontSize: 15, color: '#cbd5e1' }}>Rupien {result.rupees}</div>
          <button className="btn-primary" onClick={restart}>Neuer Tempel</button>
        </div>
      )}

      <style>{`
        @media (pointer: fine), (min-width: 900px) {
          .temple-touch-controls {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
