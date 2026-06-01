import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const CENTER_X = WIDTH / 2;
const WORLD_WIDTH = 4680;
const GRAVITY = 1820;
const FLOOR_Y = 628;

const PLATFORMS = [
  { x: 0, y: FLOOR_Y, w: 620, h: 92, type: 'metal' },
  { x: 720, y: 560, w: 230, h: 34, type: 'grass' },
  { x: 1070, y: 480, w: 250, h: 34, type: 'metal' },
  { x: 1470, y: 392, w: 220, h: 34, type: 'boost' },
  { x: 1840, y: 524, w: 300, h: 34, type: 'ice' },
  { x: 2280, y: 452, w: 255, h: 34, type: 'grass' },
  { x: 2660, y: 366, w: 230, h: 34, type: 'metal' },
  { x: 3030, y: 492, w: 320, h: 34, type: 'boost' },
  { x: 3520, y: 420, w: 270, h: 34, type: 'metal' },
  { x: 3990, y: 586, w: 690, h: 134, type: 'metal' },
  { x: 620, y: 660, w: 120, h: 60, type: 'acid' },
  { x: 1700, y: 660, w: 150, h: 60, type: 'acid' },
  { x: 2870, y: 660, w: 170, h: 60, type: 'acid' },
  { x: 3790, y: 660, w: 190, h: 60, type: 'acid' },
];

const ANCHORS = [
  { x: 930, y: 238 },
  { x: 1510, y: 202 },
  { x: 2220, y: 258 },
  { x: 2810, y: 190 },
  { x: 3360, y: 246 },
  { x: 3950, y: 282 },
];

const BOLTS = [
  { x: 790, y: 504 }, { x: 874, y: 504 }, { x: 1128, y: 424 }, { x: 1258, y: 424 },
  { x: 1528, y: 334 }, { x: 1904, y: 466 }, { x: 2048, y: 466 }, { x: 2344, y: 394 },
  { x: 2468, y: 394 }, { x: 2738, y: 308 }, { x: 3114, y: 434 }, { x: 3266, y: 434 },
  { x: 3608, y: 364 }, { x: 4102, y: 526 }, { x: 4272, y: 526 },
];

const CRATES = [
  { x: 410, y: FLOOR_Y - 50, kind: 'ammo' },
  { x: 820, y: 508, kind: 'bolts' },
  { x: 1218, y: 428, kind: 'energy' },
  { x: 1582, y: 340, kind: 'bolts' },
  { x: 2008, y: 472, kind: 'ammo' },
  { x: 2478, y: 400, kind: 'bolts' },
  { x: 3186, y: 440, kind: 'energy' },
  { x: 3654, y: 368, kind: 'ammo' },
  { x: 4188, y: 536, kind: 'bolts' },
];

const GADGET_TRIALS = [
  { id: 'hover-ring', label: 'HOVER-LINIE', require: 'hover', x: 1686, y: 274, color: '#67e8f9' },
  { id: 'grapple-core', label: 'GRAPPLE-KERN', require: 'grapple', x: 2220, y: 224, color: '#c4b5fd' },
  { id: 'dash-gate', label: 'DASH-GATE', require: 'dash', x: 3076, y: 404, color: '#facc15' },
  { id: 'over-node', label: 'OVERCHARGE', require: 'overcharge', x: 3556, y: 318, color: '#22d3ee' },
];

const ENEMIES = [
  { x: 1130, y: 438, min: 1070, max: 1290, type: 'drone' },
  { x: 1900, y: 480, min: 1840, max: 2110, type: 'roller' },
  { x: 2380, y: 410, min: 2290, max: 2500, type: 'drone' },
  { x: 3160, y: 448, min: 3040, max: 3320, type: 'roller' },
  { x: 3560, y: 378, min: 3520, max: 3760, type: 'turret' },
  { x: 4320, y: 536, min: 4120, max: 4520, type: 'boss' },
];

const UPGRADE_STATIONS = [
  { id: 'blaster', label: 'BLASTER+', x: 570, y: FLOOR_Y - 88, cost: 5, color: '#facc15' },
  { id: 'hover', label: 'HOVER+', x: 1540, y: 332, cost: 9, color: '#67e8f9' },
  { id: 'dash', label: 'DASH+', x: 2910, y: 306, cost: 13, color: '#a78bfa' },
];

const GOAL_DEFS = [
  { id: 'bolts-12', label: '12 Bolts sammeln', type: 'bolts', target: 12, reward: 700 },
  { id: 'enemies-3', label: '3 Gegner ausschalten', type: 'enemies', target: 3, reward: 850 },
  { id: 'upgrade-1', label: '1 Upgrade kaufen', type: 'upgrades', target: 1, reward: 900 },
  { id: 'crates-5', label: '5 Kisten knacken', type: 'crates', target: 5, reward: 620 },
  { id: 'trials-3', label: '3 Gadget-Pruefungen', type: 'trials', target: 3, reward: 980 },
  { id: 'terminals-2', label: '2 Terminals richtig', type: 'terminals', target: 2, reward: 780, learnOnly: true },
];

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist markiert?',
    sentence: 'Die mutige Pilotin baut einen Roboter.',
    word: 'mutige',
    answer: 'Adjektiv',
    options: ['Nomen', 'Adjektiv', 'Verb'],
  },
  {
    subject: 'Mathe',
    prompt: 'Welcher Code stimmt?',
    sentence: '12 - 5 = ?',
    word: '12 - 5',
    answer: '7',
    options: ['6', '7', '8'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet das Wort?',
    sentence: 'rocket',
    word: 'rocket',
    answer: 'Rakete',
    options: ['Rakete', 'Roboter', 'Regen'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Welches Wort passt?',
    sentence: 'Womit atmen Fische?',
    word: 'Fische',
    answer: 'Kiemen',
    options: ['Lungen', 'Kiemen', 'Federn'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist markiert?',
    sentence: 'Faska baut eine Bruecke.',
    word: 'baut',
    answer: 'Verb',
    options: ['Verb', 'Nomen', 'Adjektiv'],
  },
  {
    subject: 'Satzbau',
    prompt: 'Welches Wort passt in die Luecke?',
    sentence: 'Der Hover-Antrieb ___ leise.',
    word: 'Luecke',
    answer: 'summt',
    options: ['summt', 'blau', 'unter'],
  },
  {
    subject: 'Komposita',
    prompt: 'Bilde das zusammengesetzte Wort.',
    sentence: 'Werkzeug + Kiste',
    word: 'Werkzeug + Kiste',
    answer: 'Werkzeugkiste',
    options: ['Kistenwerk', 'Werkzeugkiste', 'Zeugkiste'],
  },
  {
    subject: 'Lesen',
    prompt: 'Welches Wort passt zum Hinweis?',
    sentence: 'Damit ziehst du dich zu einem Anker.',
    word: 'Gadget',
    answer: 'Grapple',
    options: ['Grapple', 'Bolzen', 'Wolke'],
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function gameView(game) {
  const width = game.viewWidth || WIDTH;
  const height = game.viewHeight || HEIGHT;
  return { width, height, centerX: width / 2 };
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
  return { x: player.x, y: player.y, w: player.w, h: player.h };
}

function crateRect(crate) {
  return { x: crate.x, y: crate.y, w: 46, h: 46 };
}

function upgradeStationRect(station) {
  return { x: station.x - 42, y: station.y - 58, w: 118, h: 104 };
}

function makeInitialGame(mode = 'arcade') {
  return {
    mode,
    elapsed: 0,
    phase: 'run',
    viewWidth: WIDTH,
    viewHeight: HEIGHT,
    mobilePortrait: false,
    cameraX: 0,
    score: 0,
    message: mode === 'learn' ? 'Loese Terminals, um Energie und Bolts zu bekommen.' : 'Sammle Bolts und erreiche das Sternentor.',
    messageTimer: 2,
    taskIndex: 0,
    terminalCooldown: mode === 'learn' ? 1 : 0,
    screenShake: 0,
    particles: [],
    bolts: BOLTS.map((bolt, index) => ({ ...bolt, id: `bolt-${index}`, taken: false })),
    enemies: ENEMIES.map((enemy, index) => ({
      ...enemy,
      id: `enemy-${index}`,
      hp: enemy.type === 'boss' ? 14 : enemy.type === 'turret' ? 4 : 2,
      maxHp: enemy.type === 'boss' ? 14 : enemy.type === 'turret' ? 4 : 2,
      dir: index % 2 ? 1 : -1,
      shotCooldown: 0.6 + index * 0.2,
      hitTimer: 0,
      dead: false,
    })),
    shots: [],
    enemyShots: [],
    crates: CRATES.map((crate, index) => ({
      ...crate,
      id: `crate-${index}`,
      hp: crate.kind === 'energy' ? 3 : 2,
      broken: false,
      hitTimer: 0,
    })),
    trials: GADGET_TRIALS.map((trial) => ({ ...trial, complete: false, pulse: 0 })),
    terminals: mode === 'learn' ? buildTerminals(0) : [],
    upgradeStations: UPGRADE_STATIONS.map((station) => ({ ...station, purchased: false, cooldown: 0 })),
    stats: {
      bolts: 0,
      enemies: 0,
      upgrades: 0,
      crates: 0,
      trials: 0,
      terminals: 0,
    },
    goals: GOAL_DEFS
      .filter((goal) => mode === 'learn' || !goal.learnOnly)
      .map((goal) => ({ ...goal, done: false })),
    player: {
      x: 108,
      y: 520,
      w: 42,
      h: 66,
      vx: 0,
      vy: 0,
      facing: 1,
      hp: 100,
      energy: 100,
      ammo: 30,
      bolts: 0,
      score: 0,
      upgrades: {
        blaster: 0,
        hover: 0,
        dash: 0,
      },
      grounded: false,
      coyote: 0,
      jumpBuffer: 0,
      jumpCount: 0,
      hoverFuel: 100,
      hoverTimer: 0,
      hookTarget: null,
      hookTimer: 0,
      fireCooldown: 0,
      wrenchTimer: 0,
      wrenchCooldown: 0,
      dashCooldown: 0,
      dashTimer: 0,
      overchargeCooldown: 0,
      invuln: 0,
      trickWindow: 0,
      gadgetCombo: 0,
    },
    result: null,
  };
}

function buildTerminals(taskIndex) {
  const task = LEARN_TASKS[taskIndex % LEARN_TASKS.length];
  const baseX = 1420 + taskIndex * 560;
  return task.options.map((label, index) => ({
    id: `terminal-${taskIndex}-${label}`,
    label,
    correct: label === task.answer,
    x: baseX + index * 146,
    y: 278 + (index % 2) * 46,
    w: 132,
    h: 82,
    active: true,
  })).filter((terminal) => terminal.x < WORLD_WIDTH - 380);
}

function currentTask(game) {
  return LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
}

function statValue(game, goal) {
  return game.stats[goal.type] || 0;
}

function completeGoal(game, goal) {
  if (goal.done || statValue(game, goal) < goal.target) return;
  goal.done = true;
  game.score += goal.reward;
  game.player.energy = 100;
  game.player.ammo += 5;
  game.message = `${goal.label} +${goal.reward}`;
  game.messageTimer = 1.1;
  spawnParticles(game, game.player.x + game.player.w / 2, game.player.y + 20, '#5eead4', 18, 1.3);
}

function evaluateGoals(game) {
  game.goals.forEach((goal) => completeGoal(game, goal));
}

function addBolts(game, amount, x, y, message = 'Bolts') {
  game.player.bolts += amount;
  game.stats.bolts += amount;
  game.player.score += amount * 82;
  game.message = amount > 1 ? `+${amount} ${message}` : message;
  game.messageTimer = 0.55;
  spawnParticles(game, x, y, '#facc15', Math.min(20, 6 + amount));
  evaluateGoals(game);
}

function breakCrate(game, crate, power = 1) {
  if (crate.broken) return;
  crate.hp -= power;
  crate.hitTimer = 0.2;
  spawnParticles(game, crate.x + 23, crate.y + 24, '#fbbf24', 5);
  if (crate.hp > 0) return;
  crate.broken = true;
  game.stats.crates += 1;
  game.score += 140;
  if (crate.kind === 'ammo') {
    game.player.ammo += 5;
    addBolts(game, 2, crate.x + 23, crate.y + 24, 'Kisten-Bolts');
    game.message = '+5 Energiezellen';
  } else if (crate.kind === 'energy') {
    game.player.energy = 100;
    game.player.hp = clamp(game.player.hp + 16, 0, 100);
    addBolts(game, 2, crate.x + 23, crate.y + 24, 'Kisten-Bolts');
    game.message = 'Energie-Kiste';
  } else {
    addBolts(game, 4, crate.x + 23, crate.y + 24, 'Kisten-Bolts');
  }
  game.messageTimer = 0.7;
  spawnParticles(game, crate.x + 23, crate.y + 24, '#fde68a', 16, 1.25);
  evaluateGoals(game);
}

function completeTrial(game, trial) {
  if (trial.complete) return;
  trial.complete = true;
  game.stats.trials += 1;
  game.player.gadgetCombo += 1;
  game.player.trickWindow = 1.6;
  game.score += 340 + game.player.gadgetCombo * 80;
  game.player.energy = clamp(game.player.energy + 28, 0, 100);
  game.player.hoverFuel = clamp(game.player.hoverFuel + 30, 0, 100);
  addBolts(game, 3 + game.player.gadgetCombo, trial.x, trial.y, 'Trial-Bolts');
  game.message = `${trial.label} +${340 + game.player.gadgetCombo * 80}`;
  game.messageTimer = 0.9;
  spawnParticles(game, trial.x, trial.y, trial.color, 22, 1.35);
  evaluateGoals(game);
}

function spawnParticles(game, x, y, color, count = 8, power = 1) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed;
    const speed = (90 + (i % 5) * 28) * power;
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 40,
      life: 0.58,
      color,
      size: 4 + (i % 3) * 2,
    });
  }
}

function damagePlayer(game, amount, source) {
  const player = game.player;
  if (player.invuln > 0) return;
  player.hp = clamp(player.hp - amount, 0, 100);
  player.invuln = 0.8;
  player.hookTarget = null;
  player.hookTimer = 0;
  game.screenShake = 0.22;
  if (source) {
    const dx = player.x + player.w / 2 - source.x;
    const dy = player.y + player.h / 2 - source.y;
    const len = Math.hypot(dx, dy) || 1;
    player.vx += (dx / len) * 280;
    player.vy += (dy / len) * 240 - 160;
  }
  game.message = 'Treffer';
  game.messageTimer = 0.55;
  spawnParticles(game, player.x + player.w / 2, player.y + player.h / 2, '#fb7185', 10);
}

function resolvePlatforms(game, previousY) {
  const player = game.player;
  player.grounded = false;
  const rect = playerRect(player);

  PLATFORMS.forEach((platform) => {
    if (platform.type === 'acid') {
      if (rectsOverlap(rect, platform)) damagePlayer(game, 26, { x: platform.x + platform.w / 2, y: platform.y });
      return;
    }
    if (!rectsOverlap(rect, platform)) return;
    const prevBottom = previousY + player.h;
    const fromTop = prevBottom <= platform.y + 14 && player.vy >= 0;
    const fromBottom = previousY >= platform.y + platform.h - 8 && player.vy < 0;
    if (fromTop) {
      player.y = platform.y - player.h;
      player.vy = platform.type === 'boost' ? -900 : 0;
      player.grounded = true;
      player.coyote = 0.12;
      player.jumpCount = 0;
      player.hoverFuel = clamp(player.hoverFuel + 46 + player.upgrades.hover * 18, 0, 100);
      if (platform.type === 'boost') {
        game.message = 'Boost-Plattform';
        game.messageTimer = 0.45;
        spawnParticles(game, player.x + player.w / 2, platform.y, '#a78bfa', 10);
      }
      if (platform.type === 'ice') player.vx *= 1.04;
    } else if (fromBottom) {
      player.y = platform.y + platform.h;
      player.vy = Math.max(0, player.vy);
    } else if (player.x + player.w / 2 < platform.x + platform.w / 2) {
      player.x = platform.x - player.w;
      player.vx = Math.min(0, player.vx);
    } else {
      player.x = platform.x + platform.w;
      player.vx = Math.max(0, player.vx);
    }
  });
}

function nearestAnchor(player) {
  const center = { x: player.x + player.w / 2, y: player.y + player.h / 2 };
  return ANCHORS
    .map((anchor) => ({ ...anchor, dist: distance(center, anchor) }))
    .filter((anchor) => anchor.dist < 420 && anchor.x > player.x - 40 && anchor.x < player.x + 680)
    .sort((a, b) => a.dist - b.dist)[0] || null;
}

function updatePlayer(game, input, dt) {
  const player = game.player;
  const previousY = player.y;
  const axis = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const accel = player.grounded ? 2850 : 2050;
  const friction = player.grounded ? 0.78 : 0.94;

  player.jumpBuffer = input.jump ? 0.12 : Math.max(0, player.jumpBuffer - dt);
  player.coyote = player.grounded ? 0.12 : Math.max(0, player.coyote - dt);
  player.fireCooldown = Math.max(0, player.fireCooldown - dt);
  player.wrenchCooldown = Math.max(0, player.wrenchCooldown - dt);
  player.wrenchTimer = Math.max(0, player.wrenchTimer - dt);
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
  player.dashTimer = Math.max(0, player.dashTimer - dt);
  player.overchargeCooldown = Math.max(0, player.overchargeCooldown - dt);
  player.invuln = Math.max(0, player.invuln - dt);
  player.trickWindow = Math.max(0, player.trickWindow - dt);
  if (player.trickWindow <= 0 && player.grounded) player.gadgetCombo = 0;
  player.energy = clamp(player.energy + 17 * dt, 0, 100);

  if (axis) {
    player.vx += axis * accel * dt;
    player.facing = axis > 0 ? 1 : -1;
  } else {
    player.vx *= Math.pow(friction, dt * 60);
  }
  const maxRunSpeed = 365 + player.upgrades.dash * 42;
  player.vx = clamp(player.vx, -maxRunSpeed, maxRunSpeed);

  if (player.jumpBuffer > 0 && (player.coyote > 0 || player.jumpCount < 2)) {
    player.vy = player.jumpCount === 0 ? -720 : -640;
    player.grounded = false;
    player.coyote = 0;
    player.jumpBuffer = 0;
    player.jumpCount += 1;
    spawnParticles(game, player.x + player.w / 2, player.y + player.h, player.jumpCount > 1 ? '#facc15' : '#bfdbfe', 8);
  }

  if (input.hover && !player.grounded && player.hoverFuel > 0 && player.vy > -120) {
    player.hoverTimer = 0.12;
    player.vy = Math.min(player.vy, 85);
    const hoverDrain = 42 * (1 - player.upgrades.hover * 0.24);
    player.hoverFuel = Math.max(0, player.hoverFuel - hoverDrain * dt);
    spawnParticles(game, player.x + player.w / 2, player.y + player.h + 2, '#67e8f9', 1);
  } else {
    player.hoverTimer = Math.max(0, player.hoverTimer - dt);
  }

  if (input.grapple && !player.hookTarget && player.energy >= 18) {
    const anchor = nearestAnchor(player);
    if (anchor) {
      player.hookTarget = anchor;
      player.hookTimer = 0.75;
      player.energy -= 18;
      player.trickWindow = 1.1;
      spawnParticles(game, player.x + player.w / 2, player.y + 18, '#c4b5fd', 6);
    }
  }
  if (!input.grapple || player.hookTimer <= 0) {
    player.hookTarget = null;
  }
  if (player.hookTarget) {
    player.hookTimer -= dt;
    const centerX = player.x + player.w / 2;
    const centerY = player.y + player.h / 2;
    const dx = player.hookTarget.x - centerX;
    const dy = player.hookTarget.y - centerY;
    const len = Math.hypot(dx, dy) || 1;
    player.vx += (dx / len) * 1900 * dt;
    player.vy += (dy / len) * 1900 * dt;
    player.vx = clamp(player.vx, -760, 760);
    player.vy = clamp(player.vy, -760, 760);
    if (len < 70) {
      player.hookTarget = null;
      player.vy = -360;
    }
  }

  const dashCost = Math.max(15, 24 - player.upgrades.dash * 5);
  if (input.dash && player.dashCooldown <= 0 && player.energy >= dashCost) {
    player.dashTimer = 0.16;
    player.dashCooldown = Math.max(0.46, 0.7 - player.upgrades.dash * 0.12);
    player.energy -= dashCost;
    player.vx = player.facing * (760 + player.upgrades.dash * 90);
    player.vy *= 0.4;
    player.trickWindow = 1.0;
    spawnParticles(game, player.x + player.w / 2, player.y + player.h / 2, '#facc15', 11);
  }

  if (player.dashTimer <= 0 && !player.hookTarget && player.hoverTimer <= 0) {
    player.vy += GRAVITY * dt;
  } else if (player.hoverTimer > 0) {
    player.vy += GRAVITY * 0.18 * dt;
  }

  player.x += player.vx * dt;
  player.y += player.vy * dt;
  player.x = clamp(player.x, 0, WORLD_WIDTH - player.w);
  resolvePlatforms(game, previousY);

  if (player.y > HEIGHT + 210) {
    player.x = Math.max(90, game.cameraX + 120);
    player.y = 410;
    player.vx = 0;
    player.vy = 0;
    damagePlayer(game, 28);
  }
}

function fireBlaster(game) {
  const player = game.player;
  if (player.fireCooldown > 0) return;
  player.fireCooldown = Math.max(0.12, 0.18 - player.upgrades.blaster * 0.03);
  if (player.ammo <= 0) {
    game.message = 'Keine Energiezellen';
    game.messageTimer = 0.45;
    return;
  }
  player.ammo -= 1;
  const blasterLevel = player.upgrades.blaster;
  game.shots.push({
    id: `shot-${game.elapsed}-${game.shots.length}`,
    x: player.x + player.w / 2 + player.facing * 26,
    y: player.y + 26,
    vx: player.facing * (820 + blasterLevel * 90),
    vy: -20,
    life: 0.8 + blasterLevel * 0.08,
    damage: 1 + blasterLevel,
    radius: 5 + blasterLevel * 1.6,
    pierce: blasterLevel > 0 ? 1 : 0,
    color: blasterLevel > 0 ? '#fde68a' : '#fef3c7',
    glow: blasterLevel > 0 ? '#f97316' : '#facc15',
  });
  spawnParticles(game, player.x + player.w / 2 + player.facing * 32, player.y + 26, '#facc15', 4);
}

function fireOvercharge(game) {
  const player = game.player;
  if (player.overchargeCooldown > 0) return;
  if (player.energy < 34 || player.ammo < 3) {
    player.overchargeCooldown = 0.25;
    game.message = 'Overcharge braucht 34 Energie und 3 Zellen';
    game.messageTimer = 0.6;
    return;
  }
  player.energy -= 34;
  player.ammo -= 3;
  player.overchargeCooldown = 1.1;
  game.screenShake = Math.max(game.screenShake, 0.18);
  game.shots.push({
    id: `overcharge-${game.elapsed}-${game.shots.length}`,
    x: player.x + player.w / 2 + player.facing * 34,
    y: player.y + 24,
    vx: player.facing * (1050 + player.upgrades.blaster * 100),
    vy: -8,
    life: 1.0,
    damage: 3 + player.upgrades.blaster,
    radius: 12,
    pierce: 2 + player.upgrades.blaster,
    color: '#cffafe',
    glow: '#22d3ee',
    overcharge: true,
  });
  game.message = 'OVERCHARGE';
  game.messageTimer = 0.45;
  spawnParticles(game, player.x + player.w / 2 + player.facing * 36, player.y + 26, '#67e8f9', 18, 1.35);
}

function swingWrench(game) {
  const player = game.player;
  if (player.wrenchCooldown > 0 || player.energy < 8) return;
  player.wrenchTimer = 0.22;
  player.wrenchCooldown = 0.34;
  player.energy -= 8;
  const box = {
    x: player.facing > 0 ? player.x + player.w - 4 : player.x - 62,
    y: player.y + 12,
    w: 66,
    h: 48,
  };
  game.enemies.forEach((enemy) => {
    if (enemy.dead) return;
    const enemyBox = { x: enemy.x - 28, y: enemy.y - 34, w: 56, h: 56 };
    if (!rectsOverlap(box, enemyBox)) return;
    enemy.hp -= 2;
    enemy.hitTimer = 0.24;
    enemy.x += player.facing * 42;
    game.score += 110;
    spawnParticles(game, enemy.x, enemy.y, '#fef3c7', 10);
  });
  game.crates.forEach((crate) => {
    if (crate.broken) return;
    if (rectsOverlap(box, crateRect(crate))) breakCrate(game, crate, 2);
  });
}

function updateShots(game, dt) {
  game.shots = game.shots
    .map((shot) => ({
      ...shot,
      x: shot.x + shot.vx * dt,
      y: shot.y + shot.vy * dt,
      life: shot.life - dt,
    }))
    .filter((shot) => {
      if (shot.life <= 0) return false;
      const radius = shot.radius || 5;
      const shotRect = { x: shot.x - radius, y: shot.y - radius, w: radius * 2, h: radius * 2 };
      const crate = game.crates.find((candidate) => !candidate.broken && rectsOverlap(shotRect, crateRect(candidate)));
      if (crate) {
        breakCrate(game, crate, shot.overcharge ? 3 : shot.damage || 1);
        if ((shot.pierce || 0) > 0) {
          shot.pierce -= 1;
          shot.x += (Math.sign(shot.vx) || 1) * (radius * 2 + 18);
          return true;
        }
        return false;
      }
      const wallHit = PLATFORMS.some((platform) => platform.type !== 'acid' && rectsOverlap(shotRect, platform));
      if (wallHit) {
        spawnParticles(game, shot.x, shot.y, '#94a3b8', 4);
        return false;
      }
      const enemy = game.enemies.find((candidate) => {
        if (candidate.dead) return false;
        return rectsOverlap(shotRect, { x: candidate.x - 26, y: candidate.y - 32, w: 52, h: 52 });
      });
      if (enemy) {
        enemy.hp -= shot.damage || 1;
        enemy.hitTimer = 0.2;
        game.score += shot.overcharge ? 110 : 60;
        spawnParticles(game, shot.x, shot.y, shot.overcharge ? '#67e8f9' : '#f87171', shot.overcharge ? 12 : 7);
        if ((shot.pierce || 0) > 0) {
          shot.pierce -= 1;
          shot.x += (Math.sign(shot.vx) || 1) * (radius * 2 + 18);
          shot.life -= 0.04;
          return true;
        }
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
      if (rectsOverlap(shotRect, playerRect(game.player))) {
        damagePlayer(game, shot.damage, shot);
        return false;
      }
      return true;
    });
}

function updateEnemies(game, dt) {
  const player = game.player;
  game.enemies.forEach((enemy) => {
    if (enemy.dead) return;
    enemy.hitTimer = Math.max(0, enemy.hitTimer - dt);
    enemy.shotCooldown = Math.max(0, enemy.shotCooldown - dt);
    if (enemy.type === 'roller' || enemy.type === 'boss') {
      enemy.x += enemy.dir * (enemy.type === 'boss' ? 58 : 80) * dt;
      if (enemy.x < enemy.min || enemy.x > enemy.max) enemy.dir *= -1;
    } else if (enemy.type === 'drone') {
      enemy.x += enemy.dir * 92 * dt;
      enemy.y += Math.sin(game.elapsed * 4 + enemy.x * 0.01) * 32 * dt;
      if (enemy.x < enemy.min || enemy.x > enemy.max) enemy.dir *= -1;
    }
    const enemyBox = { x: enemy.x - 26, y: enemy.y - 32, w: 52, h: 56 };
    if (rectsOverlap(playerRect(player), enemyBox)) {
      const stomp = player.vy > 150 && player.y + player.h - enemyBox.y < 28;
      if (stomp && enemy.type !== 'turret') {
        enemy.hp -= 2;
        player.vy = -520;
        game.score += 180;
        spawnParticles(game, enemy.x, enemy.y, '#5eead4', 10);
      } else {
        damagePlayer(game, enemy.type === 'boss' ? 18 : 13, enemy);
      }
    }
    if ((enemy.type === 'turret' || enemy.type === 'boss') && enemy.shotCooldown <= 0) {
      const dx = player.x + player.w / 2 - enemy.x;
      const dy = player.y + 28 - enemy.y;
      const len = Math.hypot(dx, dy) || 1;
      if (Math.abs(dx) < 660) {
        enemy.shotCooldown = enemy.type === 'boss' ? 0.72 : 1.35;
        game.enemyShots.push({
          id: `enemy-shot-${enemy.id}-${game.elapsed}`,
          x: enemy.x,
          y: enemy.y,
          vx: (dx / len) * (enemy.type === 'boss' ? 360 : 280),
          vy: (dy / len) * (enemy.type === 'boss' ? 360 : 280),
          damage: enemy.type === 'boss' ? 12 : 8,
          life: 2.2,
        });
      }
    }
    if (enemy.hp <= 0) {
      enemy.dead = true;
      game.score += enemy.type === 'boss' ? 1200 : 260;
      const boltReward = enemy.type === 'boss' ? 16 : 5;
      player.bolts += boltReward;
      game.stats.bolts += boltReward;
      game.stats.enemies += 1;
      player.ammo += enemy.type === 'boss' ? 8 : 2;
      spawnParticles(game, enemy.x, enemy.y, enemy.color || '#f87171', enemy.type === 'boss' ? 28 : 16, 1.4);
      evaluateGoals(game);
    }
  });
}

function updateCrates(game, dt) {
  const player = game.player;
  game.crates.forEach((crate) => {
    crate.hitTimer = Math.max(0, crate.hitTimer - dt);
    if (crate.broken) return;
    if (player.dashTimer > 0 && rectsOverlap(playerRect(player), crateRect(crate))) {
      breakCrate(game, crate, 3);
      player.vx *= 0.82;
    }
  });
}

function updateTrials(game, dt) {
  const player = game.player;
  const center = { x: player.x + player.w / 2, y: player.y + player.h / 2 };
  game.trials.forEach((trial) => {
    trial.pulse += dt * 4;
    if (trial.complete) return;
    const close = distance(center, trial) < 92;
    const matched = (
      (trial.require === 'hover' && player.hoverTimer > 0 && close)
      || (trial.require === 'grapple' && player.hookTarget && close)
      || (trial.require === 'dash' && player.dashTimer > 0 && close)
      || (trial.require === 'overcharge' && game.shots.some((shot) => shot.overcharge && distance(shot, trial) < 70))
    );
    if (matched) completeTrial(game, trial);
  });
}

function updateBolts(game) {
  const player = game.player;
  game.bolts.forEach((bolt) => {
    if (bolt.taken) return;
    const boltRect = { x: bolt.x - 18, y: bolt.y - 18, w: 36, h: 36 };
    if (!rectsOverlap(playerRect(player), boltRect)) return;
    bolt.taken = true;
    player.bolts += 1;
    game.stats.bolts += 1;
    player.score += 90 + player.bolts;
    game.message = player.bolts % 5 === 0 ? `${player.bolts} Bolts` : 'Bolt';
    game.messageTimer = 0.36;
    spawnParticles(game, bolt.x, bolt.y, '#facc15', 8);
    evaluateGoals(game);
  });
}

function updateUpgradeStations(game, dt) {
  const player = game.player;
  const rect = playerRect(player);
  game.upgradeStations.forEach((station) => {
    station.cooldown = Math.max(0, station.cooldown - dt);
    if (station.purchased || !rectsOverlap(rect, upgradeStationRect(station))) return;
    if (player.bolts < station.cost) {
      if (station.cooldown <= 0) {
        station.cooldown = 0.8;
        game.message = `${station.label} braucht ${station.cost} Bolts`;
        game.messageTimer = 0.55;
      }
      return;
    }
    player.bolts -= station.cost;
    player.upgrades[station.id] += 1;
    player.energy = 100;
    player.ammo += station.id === 'blaster' ? 8 : 4;
    station.purchased = true;
    station.cooldown = 1.2;
    game.stats.upgrades += 1;
    game.score += 420;
    game.screenShake = Math.max(game.screenShake, 0.14);
    game.message = `${station.label} installiert`;
    game.messageTimer = 1.0;
    spawnParticles(game, station.x + 16, station.y - 14, station.color, 24, 1.35);
    evaluateGoals(game);
  });
}

function updateTerminals(game, dt) {
  if (game.mode !== 'learn') return;
  game.terminalCooldown = Math.max(0, game.terminalCooldown - dt);
  if (game.terminalCooldown > 0) return;
  const player = game.player;
  game.terminals.forEach((terminal) => {
    if (!terminal.active) return;
    if (!rectsOverlap(playerRect(player), terminal)) return;
    const task = currentTask(game);
    terminal.active = false;
    if (terminal.correct) {
      game.score += 560;
      player.energy = 100;
      player.ammo += 8;
      player.bolts += 8;
      game.stats.bolts += 8;
      game.stats.terminals += 1;
      game.message = `${task.subject}: ${task.word} -> ${task.answer}`;
      spawnParticles(game, terminal.x + terminal.w / 2, terminal.y + terminal.h / 2, '#5eead4', 18);
      evaluateGoals(game);
    } else {
      damagePlayer(game, 14, { x: terminal.x + terminal.w / 2, y: terminal.y + terminal.h / 2 });
      game.message = `${terminal.label} war falsch. Richtig: ${task.answer}`;
      spawnParticles(game, terminal.x + terminal.w / 2, terminal.y + terminal.h / 2, '#fb7185', 14);
    }
    game.messageTimer = 1.1;
    game.taskIndex += 1;
    game.terminals = buildTerminals(game.taskIndex);
    game.terminalCooldown = 1.0;
  });
}

function updateParticles(game, dt) {
  game.particles = game.particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * dt,
      y: particle.y + particle.vy * dt,
      vy: particle.vy + 520 * dt,
      life: particle.life - dt,
    }))
    .filter((particle) => particle.life > 0);
}

function updateGame(game, input, dt, onFinish) {
  if (game.phase !== 'run') return;
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.screenShake = Math.max(0, game.screenShake - dt);
  updatePlayer(game, input, dt);
  if (input.fire) fireBlaster(game);
  if (input.overcharge) fireOvercharge(game);
  if (input.wrench) swingWrench(game);
  updateShots(game, dt);
  updateEnemies(game, dt);
  updateCrates(game, dt);
  updateTrials(game, dt);
  updateBolts(game);
  updateUpgradeStations(game, dt);
  updateTerminals(game, dt);
  updateParticles(game, dt);
  const { width: viewWidth } = gameView(game);
  const lead = game.mobilePortrait ? 0.48 : 0.35;
  game.cameraX = clamp(
    game.player.x - viewWidth * lead + (game.screenShake > 0 ? Math.sin(game.elapsed * 86) * 16 : 0),
    0,
    WORLD_WIDTH - viewWidth,
  );

  const goal = { x: WORLD_WIDTH - 230, y: FLOOR_Y - 130, w: 120, h: 130 };
  if (rectsOverlap(playerRect(game.player), goal) || game.player.hp <= 0) {
    const won = game.player.hp > 0;
    game.phase = 'result';
    game.result = {
      title: won ? 'Sternentor erreicht' : 'Mission verloren',
      score: game.player.score + game.score + (won ? 1400 + game.player.bolts * 10 : 0),
      bolts: game.player.bolts,
    };
    onFinish(game.result);
  }
}

function worldToScreen(game, x, y) {
  return { x: x - game.cameraX, y };
}

function drawBackground(ctx, game) {
  const { width: viewWidth, height: viewHeight } = gameView(game);
  const sky = ctx.createLinearGradient(0, 0, 0, viewHeight);
  sky.addColorStop(0, '#172554');
  sky.addColorStop(0.52, '#0e7490');
  sky.addColorStop(1, '#111827');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, viewWidth, viewHeight);

  for (let layer = 0; layer < 3; layer += 1) {
    const speed = [0.12, 0.28, 0.46][layer];
    const offset = (game.cameraX * speed) % 220;
    const baseY = [228, 318, 394][layer];
    ctx.fillStyle = [`rgba(30,41,59,.28)`, `rgba(8,47,73,.42)`, `rgba(15,23,42,.62)`][layer];
    ctx.beginPath();
    ctx.moveTo(0, viewHeight);
    for (let x = -260; x <= viewWidth + 280; x += 180) {
      const px = x - offset;
      ctx.lineTo(px, baseY + 80);
      ctx.lineTo(px + 90, baseY + Math.sin((x + layer * 50) * 0.02) * 36);
      ctx.lineTo(px + 180, baseY + 86);
    }
    ctx.lineTo(viewWidth, viewHeight);
    ctx.closePath();
    ctx.fill();
  }
}

function platformColor(type) {
  if (type === 'grass') return '#16a34a';
  if (type === 'ice') return '#38bdf8';
  if (type === 'boost') return '#a855f7';
  if (type === 'acid') return '#84cc16';
  return '#475569';
}

function drawWorld(ctx, game) {
  const { width: viewWidth } = gameView(game);
  PLATFORMS.forEach((platform) => {
    const p = worldToScreen(game, platform.x, platform.y);
    if (p.x + platform.w < -80 || p.x > viewWidth + 80) return;
    ctx.save();
    ctx.fillStyle = platformColor(platform.type);
    drawRoundedRect(ctx, p.x, p.y, platform.w, platform.h, platform.type === 'acid' ? 4 : 12);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    ctx.fillRect(p.x + 9, p.y + 8, Math.max(0, platform.w - 18), 6);
    if (platform.type === 'acid') {
      ctx.fillStyle = '#bef264';
      for (let x = 0; x < platform.w; x += 34) {
        ctx.beginPath();
        ctx.arc(p.x + x + 14, p.y + 18 + Math.sin(game.elapsed * 7 + x) * 5, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  });

  ANCHORS.forEach((anchor) => {
    const p = worldToScreen(game, anchor.x, anchor.y);
    if (p.x < -80 || p.x > viewWidth + 80) return;
    ctx.save();
    ctx.shadowColor = '#c4b5fd';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 17 + Math.sin(game.elapsed * 5 + anchor.x) * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#312e81';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawBolts(ctx, game) {
  const { width: viewWidth } = gameView(game);
  game.bolts.forEach((bolt) => {
    if (bolt.taken) return;
    const p = worldToScreen(game, bolt.x, bolt.y + Math.sin(game.elapsed * 5 + bolt.x) * 5);
    if (p.x < -50 || p.x > viewWidth + 50) return;
    ctx.save();
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI * 2 * i) / 6 + game.elapsed;
      const r = i % 2 ? 11 : 18;
      ctx.lineTo(p.x + Math.cos(angle) * r, p.y + Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function drawUpgradeStations(ctx, game) {
  const { width: viewWidth } = gameView(game);
  game.upgradeStations.forEach((station) => {
    const box = upgradeStationRect(station);
    const p = worldToScreen(game, box.x, box.y);
    if (p.x + box.w < -90 || p.x > viewWidth + 90) return;
    const pulse = station.purchased ? 0 : Math.sin(game.elapsed * 5 + station.x) * 0.08 + 0.92;
    ctx.save();
    ctx.globalAlpha = station.purchased ? 0.62 : 1;
    ctx.shadowColor = station.color;
    ctx.shadowBlur = station.purchased ? 5 : 22 * pulse;
    ctx.fillStyle = station.purchased ? 'rgba(15,23,42,.82)' : 'rgba(15,23,42,.9)';
    drawRoundedRect(ctx, p.x, p.y, box.w, box.h, 18);
    ctx.fill();
    ctx.strokeStyle = station.purchased ? 'rgba(226,232,240,.42)' : station.color;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = station.purchased ? '#94a3b8' : station.color;
    ctx.beginPath();
    ctx.arc(p.x + 28, p.y + 28, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 16px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(station.label, p.x + 48, p.y + 32);
    ctx.fillStyle = station.purchased ? '#a7f3d0' : '#fde68a';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.fillText(station.purchased ? 'INSTALLIERT' : `${station.cost} BOLTS`, p.x + 18, p.y + 70);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '800 10px Outfit, sans-serif';
    ctx.fillText(station.purchased ? 'Bonus aktiv' : 'beruehren = kaufen', p.x + 18, p.y + 88);
    ctx.restore();
  });
}

function drawTerminals(ctx, game) {
  if (game.mode !== 'learn') return;
  const { width: viewWidth } = gameView(game);
  game.terminals.forEach((terminal) => {
    if (!terminal.active) return;
    const p = worldToScreen(game, terminal.x, terminal.y);
    if (p.x + terminal.w < -80 || p.x > viewWidth + 80) return;
    ctx.save();
    ctx.globalAlpha = game.terminalCooldown > 0 ? 0.55 : 0.94;
    ctx.shadowColor = '#818cf8';
    ctx.shadowBlur = 20;
    ctx.fillStyle = 'rgba(79,70,229,.78)';
    drawRoundedRect(ctx, p.x, p.y, terminal.w, terminal.h, 18);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawFittedText(ctx, terminal.label, p.x + terminal.w / 2, p.y + terminal.h / 2, terminal.w - 14, 15, 9);
    ctx.restore();
  });
}

function drawCrates(ctx, game) {
  const { width: viewWidth } = gameView(game);
  game.crates.forEach((crate) => {
    if (crate.broken) return;
    const p = worldToScreen(game, crate.x, crate.y);
    if (p.x < -70 || p.x > viewWidth + 70) return;
    ctx.save();
    ctx.shadowColor = crate.hitTimer > 0 ? '#fef3c7' : '#f59e0b';
    ctx.shadowBlur = crate.hitTimer > 0 ? 18 : 8;
    ctx.fillStyle = crate.kind === 'energy' ? '#0f766e' : crate.kind === 'ammo' ? '#7c2d12' : '#92400e';
    drawRoundedRect(ctx, p.x, p.y, 46, 46, 8);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(2,6,23,.55)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p.x + 9, p.y + 11);
    ctx.lineTo(p.x + 37, p.y + 35);
    ctx.moveTo(p.x + 37, p.y + 11);
    ctx.lineTo(p.x + 9, p.y + 35);
    ctx.stroke();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(crate.kind === 'ammo' ? 'AM' : crate.kind === 'energy' ? 'EN' : 'BT', p.x + 23, p.y + 29);
    ctx.restore();
  });
}

function drawTrials(ctx, game) {
  const { width: viewWidth } = gameView(game);
  game.trials.forEach((trial) => {
    const p = worldToScreen(game, trial.x, trial.y);
    if (p.x < -90 || p.x > viewWidth + 90) return;
    const radius = 25 + Math.sin(trial.pulse) * 3;
    ctx.save();
    ctx.globalAlpha = trial.complete ? 0.34 : 0.96;
    ctx.shadowColor = trial.color;
    ctx.shadowBlur = trial.complete ? 8 : 24;
    ctx.strokeStyle = trial.complete ? 'rgba(226,232,240,.55)' : trial.color;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = trial.complete ? 'rgba(15,23,42,.38)' : 'rgba(15,23,42,.72)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius - 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = trial.complete ? '#a7f3d0' : '#f8fafc';
    ctx.font = '900 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(trial.require.toUpperCase(), p.x, p.y + 4);
    ctx.fillStyle = trial.color;
    ctx.font = '900 11px Outfit, sans-serif';
    ctx.fillText(trial.complete ? 'OK' : trial.label, p.x, p.y - radius - 12);
    ctx.restore();
  });
}

function drawEnemies(ctx, game) {
  const { width: viewWidth } = gameView(game);
  game.enemies.forEach((enemy) => {
    if (enemy.dead) return;
    const p = worldToScreen(game, enemy.x, enemy.y);
    if (p.x < -90 || p.x > viewWidth + 90) return;
    const size = enemy.type === 'boss' ? 72 : enemy.type === 'turret' ? 50 : 46;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.shadowColor = enemy.hitTimer > 0 ? '#fecaca' : enemy.type === 'boss' ? '#ef4444' : '#f97316';
    ctx.shadowBlur = enemy.hitTimer > 0 ? 24 : 14;
    ctx.fillStyle = enemy.hitTimer > 0 ? '#fecaca' : enemy.type === 'boss' ? '#b91c1c' : enemy.type === 'drone' ? '#ea580c' : enemy.type === 'turret' ? '#7c3aed' : '#991b1b';
    if (enemy.type === 'drone') {
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(size / 2, size / 3);
      ctx.lineTo(0, size / 2);
      ctx.lineTo(-size / 2, size / 3);
      ctx.closePath();
      ctx.fill();
    } else {
      drawRoundedRect(ctx, -size / 2, -size / 2, size, size, enemy.type === 'boss' ? 18 : 12);
      ctx.fill();
    }
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(size * 0.12, -size * 0.14, size * 0.11, size * 0.11);
    ctx.fillStyle = 'rgba(2,6,23,.82)';
    drawRoundedRect(ctx, -size / 2, -size / 2 - 13, size, 7, 4);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    drawRoundedRect(ctx, -size / 2, -size / 2 - 13, size * clamp(enemy.hp / enemy.maxHp, 0, 1), 7, 4);
    ctx.fill();
    ctx.restore();
  });
}

function drawPlayer(ctx, game) {
  const player = game.player;
  const p = worldToScreen(game, player.x, player.y);
  ctx.save();
  if (player.hookTarget) {
    const anchor = worldToScreen(game, player.hookTarget.x, player.hookTarget.y);
    ctx.strokeStyle = '#c4b5fd';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(p.x + player.w / 2, p.y + 24);
    ctx.lineTo(anchor.x, anchor.y);
    ctx.stroke();
  }
  ctx.translate(p.x + player.w / 2, p.y + player.h);
  ctx.scale(player.facing, 1);
  ctx.globalAlpha = player.invuln > 0 && Math.sin(game.elapsed * 42) > 0 ? 0.55 : 1;
  ctx.shadowColor = player.dashTimer > 0 ? '#facc15' : player.hoverTimer > 0 ? '#67e8f9' : '#38bdf8';
  ctx.shadowBlur = player.dashTimer > 0 || player.hoverTimer > 0 ? 24 : 13;
  ctx.fillStyle = '#2563eb';
  drawRoundedRect(ctx, -20, -50, 40, 48, 12);
  ctx.fill();
  ctx.fillStyle = '#f97316';
  ctx.fillRect(-17, -44, 34, 11);
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(0, -66, 19, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#020617';
  ctx.fillRect(6, -70, 5, 5);
  ctx.strokeStyle = player.wrenchTimer > 0 ? '#fef3c7' : '#bfdbfe';
  ctx.lineWidth = player.wrenchTimer > 0 ? 12 : 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(16, -37);
  ctx.lineTo(43 + (player.wrenchTimer > 0 ? 26 : 0), -45);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-14, -2);
  ctx.lineTo(-20, 20);
  ctx.moveTo(14, -2);
  ctx.lineTo(20, 20);
  ctx.stroke();
  if (player.hoverTimer > 0) {
    ctx.fillStyle = '#67e8f9';
    ctx.beginPath();
    ctx.moveTo(-18, 8);
    ctx.lineTo(-8, 42 + Math.sin(game.elapsed * 26) * 6);
    ctx.lineTo(2, 8);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(8, 8);
    ctx.lineTo(18, 40 + Math.cos(game.elapsed * 26) * 6);
    ctx.lineTo(28, 8);
    ctx.fill();
  }
  ctx.restore();
}

function drawShots(ctx, game) {
  game.shots.forEach((shot) => {
    const p = worldToScreen(game, shot.x, shot.y);
    const radius = shot.radius || 5;
    ctx.save();
    ctx.shadowColor = shot.glow || '#facc15';
    ctx.shadowBlur = shot.overcharge ? 28 : 14;
    ctx.fillStyle = shot.color || '#fef3c7';
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fill();
    if (shot.overcharge) {
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius + 7 + Math.sin(game.elapsed * 22) * 2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  });
  game.enemyShots.forEach((shot) => {
    const p = worldToScreen(game, shot.x, shot.y);
    ctx.save();
    ctx.shadowColor = '#fb7185';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawGoal(ctx, game) {
  const goal = { x: WORLD_WIDTH - 230, y: FLOOR_Y - 130, w: 120, h: 130 };
  const p = worldToScreen(game, goal.x, goal.y);
  ctx.save();
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 32;
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.ellipse(p.x + goal.w / 2, p.y + goal.h / 2, 46 + Math.sin(game.elapsed * 5) * 4, 60, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(250,204,21,.18)';
  ctx.fill();
  ctx.restore();
}

function drawParticles(ctx, game) {
  game.particles.forEach((particle) => {
    const p = worldToScreen(game, particle.x, particle.y);
    ctx.save();
    ctx.globalAlpha = clamp(particle.life / 0.58, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, particle.size + particle.life * 8, 0, Math.PI * 2);
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

function drawFittedText(ctx, text, x, y, maxWidth, maxSize = 15, minSize = 9, weight = 900) {
  let size = maxSize;
  do {
    ctx.font = `${weight} ${size}px Outfit, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth || size <= minSize) break;
    size -= 1;
  } while (size >= minSize);
  ctx.fillText(text, x, y);
}

function drawCompactHud(ctx, game) {
  const player = game.player;
  const { width: viewWidth, height: viewHeight, centerX } = gameView(game);
  const topY = 90;
  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,.82)';
  drawRoundedRect(ctx, 8, topY, viewWidth - 16, 132, 16);
  ctx.fill();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8fafc';
  drawFittedText(ctx, game.mode === 'learn' ? 'Learncade Gadget Quest' : 'Faska Gadget Quest', centerX, topY + 28, viewWidth - 36, 16, 10);
  ctx.fillStyle = '#fde68a';
  drawFittedText(
    ctx,
    `B ${player.bolts} · A ${player.ammo} · S ${game.score + player.score} · K ${game.stats.crates} · T ${game.stats.trials}`,
    centerX,
    topY + 51,
    viewWidth - 36,
    12,
    8,
    800,
  );
  ctx.textAlign = 'left';
  drawMeter(ctx, 22, topY + 72, viewWidth - 44, 8, player.hp, '#22c55e', 'HP');
  drawMeter(ctx, 22, topY + 92, viewWidth - 44, 8, player.energy, '#facc15', 'ENERGIE');
  drawMeter(ctx, 22, topY + 112, viewWidth - 44, 8, player.hoverFuel, '#67e8f9', 'HOVER');

  if (game.mode === 'learn') {
    const task = currentTask(game);
    ctx.fillStyle = 'rgba(15,23,42,.82)';
    drawRoundedRect(ctx, 8, topY + 132, viewWidth - 16, 86, 16);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e0f2fe';
    drawFittedText(ctx, task.subject, centerX, topY + 154, viewWidth - 36, 12, 9, 900);
    ctx.fillStyle = '#f8fafc';
    drawFittedText(ctx, task.sentence || task.prompt, centerX, topY + 178, viewWidth - 36, 15, 9);
    ctx.fillStyle = '#fde68a';
    drawFittedText(ctx, task.prompt, centerX, topY + 202, viewWidth - 36, 12, 8, 800);
  }

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.82)';
    drawRoundedRect(ctx, 18, viewHeight - 178, viewWidth - 36, 46, 14);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    drawFittedText(ctx, game.message, centerX, viewHeight - 150, viewWidth - 56, 16, 9);
  }
  ctx.restore();
}

function drawHud(ctx, game) {
  const player = game.player;
  if (game.mobilePortrait || (game.viewWidth || WIDTH) < 700) {
    drawCompactHud(ctx, game);
    return;
  }
  ctx.save();
  ctx.fillStyle = '#020617';
  drawRoundedRect(ctx, 28, 22, 462, 130, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 25px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Learncade Gadget Quest Pro' : 'Faska Gadget Quest Pro', 52, 58);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText(`Bolts ${player.bolts} · Ammo ${player.ammo} · Score ${game.score + player.score}`, 52, 88);
  drawMeter(ctx, 52, 116, 106, 12, player.hp, '#22c55e', 'HP');
  drawMeter(ctx, 184, 116, 104, 12, player.energy, '#facc15', 'ENERGIE');
  drawMeter(ctx, 314, 116, 104, 12, player.hoverFuel, '#67e8f9', 'HOVER');
  ctx.fillStyle = '#a7f3d0';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText(`BL ${player.upgrades.blaster} · HV ${player.upgrades.hover} · DS ${player.upgrades.dash} · Combo ${player.gadgetCombo}`, 52, 146);

  if (game.mode === 'learn') {
    const task = currentTask(game);
    ctx.fillStyle = '#020617';
    drawRoundedRect(ctx, 492, 22, 426, 96, 18);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e2e8f0';
    drawFittedText(ctx, task.sentence || task.prompt, 705, 50, 370, 18, 11);
    ctx.fillStyle = '#67e8f9';
    drawFittedText(ctx, task.prompt, 705, 76, 370, 14, 10, 800);
    ctx.fillStyle = '#fef3c7';
    drawFittedText(ctx, `${task.subject}: ${task.word}`, 705, 98, 370, 13, 10, 800);
  }

  ctx.textAlign = 'right';
  ctx.fillStyle = '#020617';
  drawRoundedRect(ctx, WIDTH - 350, 22, 322, 220, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 24px Outfit, sans-serif';
  ctx.fillText(`Distanz ${Math.round(player.x)}`, WIDTH - 52, 58);
  ctx.fillStyle = '#a7f3d0';
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText(`Grapple ${player.hookTarget ? 'aktiv' : 'bereit'}`, WIDTH - 52, 86);
  ctx.fillStyle = player.overchargeCooldown <= 0 && player.energy >= 34 && player.ammo >= 3 ? '#67e8f9' : '#cbd5e1';
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.fillText(`Overcharge ${player.overchargeCooldown <= 0 ? 'bereit' : player.overchargeCooldown.toFixed(1)}`, WIDTH - 52, 110);
  ctx.fillStyle = '#facc15';
  ctx.fillText(`Kisten ${game.stats.crates} · Trials ${game.stats.trials}`, WIDTH - 52, 134);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText('MISSIONEN', WIDTH - 328, 150);
  game.goals.slice(0, 4).forEach((goal, index) => {
    const progress = clamp(statValue(game, goal), 0, goal.target);
    const y = 172 + index * 16;
    ctx.fillStyle = goal.done ? '#86efac' : '#cbd5e1';
    ctx.fillText(`${goal.done ? 'OK' : `${progress}/${goal.target}`} ${goal.label}`, WIDTH - 328, y);
  });

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.78)';
    drawRoundedRect(ctx, CENTER_X - 260, HEIGHT - 112, 520, 56, 18);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 24px Outfit, sans-serif';
    ctx.fillText(game.message, CENTER_X, HEIGHT - 76);
  }

  ctx.restore();
}

function renderGame(ctx, game) {
  const { width: viewWidth, height: viewHeight } = gameView(game);
  ctx.clearRect(0, 0, viewWidth, viewHeight);
  drawBackground(ctx, game);
  drawWorld(ctx, game);
  drawUpgradeStations(ctx, game);
  drawTrials(ctx, game);
  drawGoal(ctx, game);
  drawTerminals(ctx, game);
  drawCrates(ctx, game);
  drawBolts(ctx, game);
  drawEnemies(ctx, game);
  drawShots(ctx, game);
  drawPlayer(ctx, game);
  drawParticles(ctx, game);
  drawHud(ctx, game);
}

export default function FaskaGadgetQuestSwarm() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameRef = useRef(makeInitialGame('arcade'));
  const inputRef = useRef({
    left: false,
    right: false,
    jump: false,
    hover: false,
    grapple: false,
    fire: false,
    overcharge: false,
    wrench: false,
    dash: false,
  });
  const modeRef = useRef('arcade');
  const [mode, setMode] = useState('arcade');
  const [result, setResult] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: WIDTH, height: HEIGHT, mobilePortrait: false });
  const viewportRef = useRef({ width: WIDTH, height: HEIGHT, mobilePortrait: false });

  const applyViewportToGame = useCallback((game, viewport = viewportRef.current) => {
    game.viewWidth = viewport.width;
    game.viewHeight = viewport.height;
    game.mobilePortrait = viewport.mobilePortrait;
    return game;
  }, []);

  const clearInput = useCallback(() => {
    inputRef.current = {
      left: false,
      right: false,
      jump: false,
      hover: false,
      grapple: false,
      fire: false,
      overcharge: false,
      wrench: false,
      dash: false,
    };
  }, []);

  const restart = useCallback(() => {
    clearInput();
    setResult(null);
    gameRef.current = applyViewportToGame(makeInitialGame(modeRef.current));
  }, [applyViewportToGame, clearInput]);

  const setGameMode = useCallback((nextMode) => {
    modeRef.current = nextMode;
    setMode(nextMode);
    clearInput();
    setResult(null);
    gameRef.current = applyViewportToGame(makeInitialGame(nextMode));
  }, [applyViewportToGame, clearInput]);

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
    const updateViewport = () => {
      const mobilePortrait = window.matchMedia('(max-width: 899px) and (orientation: portrait)').matches;
      const aspect = window.innerWidth > 0 && window.innerHeight > 0 ? window.innerWidth / window.innerHeight : WIDTH / HEIGHT;
      const next = mobilePortrait
        ? { width: Math.round(clamp(HEIGHT * aspect, 320, 540)), height: HEIGHT, mobilePortrait: true }
        : { width: WIDTH, height: HEIGHT, mobilePortrait: false };

      viewportRef.current = next;
      applyViewportToGame(gameRef.current, next);
      setCanvasSize((previous) => (
        previous.width === next.width
        && previous.height === next.height
        && previous.mobilePortrait === next.mobilePortrait
          ? previous
          : next
      ));
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, [applyViewportToGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;
    let raf = 0;
    let last = performance.now();
    const keyMap = new Map([
      ['ArrowLeft', 'left'], ['a', 'left'], ['A', 'left'],
      ['ArrowRight', 'right'], ['d', 'right'], ['D', 'right'],
      ['ArrowUp', 'jump'], ['w', 'jump'], ['W', 'jump'], [' ', 'jump'],
      ['h', 'hover'], ['H', 'hover'],
      ['e', 'grapple'], ['E', 'grapple'],
      ['j', 'fire'], ['J', 'fire'],
      ['i', 'overcharge'], ['I', 'overcharge'],
      ['k', 'wrench'], ['K', 'wrench'],
      ['Shift', 'dash'],
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
        className="gadget-canvas"
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
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

      <div className="gadget-modebar" style={{ position: 'fixed', top: canvasTopChrome, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.55 }}>
          Normal
        </button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.55 }}>
          Learncade
        </button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      <div className="gadget-touch-controls gadget-stick-controls" style={{
        position: 'fixed', left: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'grid', gridTemplateColumns: '62px 62px', gridTemplateRows: '62px',
        gap: 8, touchAction: 'none',
      }}>
        <button aria-label="Links" style={padButton} {...holdButton('left')}>←</button>
        <button aria-label="Rechts" style={padButton} {...holdButton('right')}>→</button>
      </div>

      <div className="gadget-touch-controls gadget-actions" style={{
        position: 'fixed', right: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'flex', gap: 10, alignItems: 'flex-end', touchAction: 'none',
      }}>
        <button aria-label="Springen" style={{ ...actionButton, width: 96, height: 74, background: 'rgba(56,189,248,.84)', color: '#082f49' }} {...holdButton('jump')}>JUMP</button>
        <button aria-label="Hover" style={{ ...actionButton, background: 'rgba(34,197,94,.82)', color: '#052e16' }} {...holdButton('hover')}>HOVER</button>
        <button aria-label="Grapple" style={actionButton} {...holdButton('grapple')}>GRAPPLE</button>
        <button aria-label="Wrench" style={actionButton} {...holdButton('wrench')}>WRENCH</button>
        <button aria-label="Dash" style={actionButton} {...holdButton('dash')}>DASH</button>
        <button aria-label="Overcharge" style={{ ...actionButton, background: 'rgba(34,211,238,.82)', color: '#082f49' }} {...holdButton('overcharge')}>OVER</button>
        <button aria-label="Blaster" style={{ ...actionButton, width: 96, height: 74, background: 'rgba(250,204,21,.86)', color: '#111827' }} {...holdButton('fire')}>
          BLAST
        </button>
      </div>

      {result && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2,6,23,.78)', zIndex: 20, flexDirection: 'column', gap: 16,
        }}>
          <div style={{ fontSize: 54, fontWeight: 900, color: '#f8fafc' }}>{result.title}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#facc15' }}>Score {result.score}</div>
          <div style={{ fontSize: 15, color: '#cbd5e1' }}>Bolts {result.bolts}</div>
          <button className="btn-primary" onClick={restart}>Neue Mission</button>
        </div>
      )}

      <style>{`
        @media (pointer: fine), (min-width: 900px) {
          .gadget-touch-controls {
            display: none !important;
          }
        }
        @media (max-width: 899px) and (orientation: portrait) {
          .gadget-canvas {
            inset: 0 !important;
            width: 100dvw !important;
            height: 100dvh !important;
            transform: none !important;
          }
          .gadget-modebar {
            top: max(8px, env(safe-area-inset-top)) !important;
            width: min(96dvw, 560px);
            flex-wrap: wrap;
            justify-content: center;
            gap: 6px !important;
          }
          .gadget-modebar .btn-primary {
            padding: 8px 11px;
            font-size: 11px;
          }
          .gadget-touch-controls {
            bottom: max(12px, env(safe-area-inset-bottom)) !important;
          }
          .gadget-stick-controls {
            left: 8px !important;
            grid-template-columns: repeat(2, 56px) !important;
            grid-template-rows: 56px !important;
            gap: 4px !important;
          }
          .gadget-actions {
            right: 8px !important;
            left: auto !important;
            gap: 5px !important;
            flex-wrap: wrap;
            justify-content: flex-end;
            max-width: 176px;
          }
          .gadget-actions button {
            width: 84px !important;
            height: 44px !important;
            border-radius: 12px !important;
            font-size: 9px !important;
          }
          .gadget-actions button:first-child,
          .gadget-actions button:last-child {
            width: 84px !important;
            height: 52px !important;
          }
          .gadget-touch-controls:not(.gadget-actions) button {
            width: 56px !important;
            height: 56px !important;
            border-radius: 12px !important;
            font-size: 15px !important;
          }
        }
      `}</style>
    </div>
  );
}
