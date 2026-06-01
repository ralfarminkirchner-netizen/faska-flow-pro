import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const CENTER_X = WIDTH / 2;
const WORLD_WIDTH = 3860;
const GRAVITY = 1960;
const FLOOR_Y = 624;

const PLATFORMS = [
  { x: 0, y: FLOOR_Y, w: 540, h: 96, type: 'stone' },
  { x: 620, y: 548, w: 260, h: 34, type: 'grass' },
  { x: 1010, y: 475, w: 260, h: 34, type: 'stone' },
  { x: 1410, y: 408, w: 220, h: 34, type: 'bounce' },
  { x: 1740, y: 514, w: 310, h: 34, type: 'ice' },
  { x: 2180, y: 456, w: 270, h: 34, type: 'grass' },
  { x: 2620, y: 382, w: 250, h: 34, type: 'stone' },
  { x: 3020, y: 514, w: 280, h: 34, type: 'bounce' },
  { x: 3400, y: 608, w: 460, h: 112, type: 'stone' },
  { x: 860, y: 650, w: 150, h: 70, type: 'lava' },
  { x: 2050, y: 650, w: 140, h: 70, type: 'lava' },
  { x: 2880, y: 650, w: 170, h: 70, type: 'lava' },
];

const COINS = [
  { x: 710, y: 492 }, { x: 804, y: 492 }, { x: 1080, y: 420 }, { x: 1198, y: 420 },
  { x: 1492, y: 350 }, { x: 1834, y: 458 }, { x: 1948, y: 458 }, { x: 2290, y: 398 },
  { x: 2398, y: 398 }, { x: 2728, y: 326 }, { x: 3130, y: 458 }, { x: 3238, y: 458 },
  { x: 3520, y: 548 },
];

const ENEMIES = [
  { x: 1080, y: 430, min: 1010, max: 1250, dir: -1, type: 'roller' },
  { x: 1810, y: 468, min: 1740, max: 2010, dir: 1, type: 'roller' },
  { x: 2270, y: 410, min: 2180, max: 2428, dir: -1, type: 'flyer' },
  { x: 3090, y: 468, min: 3020, max: 3260, dir: 1, type: 'roller' },
];

const FLOW_RINGS = [
  { x: 870, y: 424, r: 46, boostX: 420, boostY: -640, label: 'Vault' },
  { x: 1304, y: 360, r: 42, boostX: 500, boostY: -560, label: 'Aerial' },
  { x: 1668, y: 310, r: 44, boostX: 430, boostY: -680, label: 'Launch' },
  { x: 2136, y: 390, r: 42, boostX: 470, boostY: -580, label: 'Thread' },
  { x: 2552, y: 294, r: 44, boostX: 520, boostY: -600, label: 'Apex' },
  { x: 2978, y: 430, r: 48, boostX: 560, boostY: -610, label: 'Rocket' },
  { x: 3334, y: 506, r: 44, boostX: 430, boostY: -520, label: 'Finish' },
];

const CHECKPOINTS = [
  { x: 1428, y: 336, label: 'Kamm' },
  { x: 2448, y: 384, label: 'Bruecke' },
  { x: 3238, y: 454, label: 'Finale' },
];

const MOVING_PLATFORMS = [
  { x: 1288, y: 326, w: 184, h: 28, type: 'moving', ax: 1180, bx: 1555, speed: 0.22, phase: 0.15, label: 'Lift' },
  { x: 2480, y: 292, w: 178, h: 28, type: 'moving', ax: 2380, bx: 2760, speed: 0.2, phase: 0.62, label: 'Runner' },
  { x: 3185, y: 398, w: 172, h: 28, type: 'moving', ax: 3090, bx: 3400, speed: 0.24, phase: 0.35, label: 'Final Lift' },
];

const GRAPPLE_POINTS = [
  { x: 770, y: 312, r: 28, label: 'Hook' },
  { x: 1575, y: 246, r: 30, label: 'Swing' },
  { x: 2310, y: 304, r: 30, label: 'Latch' },
  { x: 2940, y: 260, r: 32, label: 'Sky Hook' },
];

const SHARDS = [
  { x: 1348, y: 278, label: 'Rune A' },
  { x: 2538, y: 248, label: 'Rune B' },
  { x: 3370, y: 346, label: 'Rune C' },
];

const PARKOUR_GOALS = [
  { id: 'finish', label: 'Portal erreichen', stat: 'finish', target: 1, mode: 'both', reward: 1200 },
  { id: 'coins_10', label: '10 Muenzen sammeln', stat: 'coins', target: 10, mode: 'both', reward: 620 },
  { id: 'rings_5', label: '5 Flow-Ringe', stat: 'rings', target: 5, mode: 'both', reward: 760 },
  { id: 'dash_6', label: '6 Dashs sauber landen', stat: 'dashes', target: 6, mode: 'arcade', reward: 540 },
  { id: 'defeats_4', label: '4 Gegner besiegen', stat: 'defeats', target: 4, mode: 'arcade', reward: 700 },
  { id: 'hooks_3', label: '3 Hook-Schwuenge', stat: 'hooks', target: 3, mode: 'both', reward: 660 },
  { id: 'moving_2', label: '2 Moving-Plattformen nutzen', stat: 'movingPlatforms', target: 2, mode: 'both', reward: 560 },
  { id: 'shards_3', label: '3 Runen-Scherben sammeln', stat: 'shards', target: 3, mode: 'both', reward: 820 },
  { id: 'boss_1', label: 'Portal-Waechter besiegen', stat: 'boss', target: 1, mode: 'both', reward: 1000 },
  { id: 'learn_3', label: '3 Wortart-Gates', stat: 'learnCorrect', target: 3, mode: 'learn', reward: 1000 },
  { id: 'double_3', label: '3 Doppeljumps nutzen', stat: 'doubleJumps', target: 3, mode: 'both', reward: 520 },
];

const LEARN_TASKS = [
  {
    sentence: 'Der flinke Faska springt weit.',
    word: 'springt',
    answer: 'Verb',
    options: ['Nomen', 'Verb', 'Adjektiv'],
  },
  {
    sentence: 'Die goldene Muenze funkelt.',
    word: 'Muenze',
    answer: 'Nomen',
    options: ['Nomen', 'Verb', 'Adverb'],
  },
  {
    sentence: 'Das blaue Portal wartet.',
    word: 'blaue',
    answer: 'Adjektiv',
    options: ['Praeposition', 'Adjektiv', 'Nomen'],
  },
  {
    sentence: 'Faska rennt ueber die Bruecke.',
    word: 'ueber',
    answer: 'Praeposition',
    options: ['Verb', 'Praeposition', 'Adjektiv'],
  },
  {
    sentence: 'Lumi sammelt drei leuchtende Runen.',
    word: 'leuchtende',
    answer: 'Adjektiv',
    options: ['Nomen', 'Verb', 'Adjektiv'],
  },
  {
    sentence: 'Der Waechter bewacht das Portal.',
    word: 'bewacht',
    answer: 'Verb',
    options: ['Verb', 'Nomen', 'Praeposition'],
  },
  {
    sentence: 'Unter der Plattform glitzert Eis.',
    word: 'unter',
    answer: 'Praeposition',
    options: ['Adjektiv', 'Praeposition', 'Verb'],
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function createStats() {
  return {
    finish: 0,
    coins: 0,
    rings: 0,
    dashes: 0,
    defeats: 0,
    learnCorrect: 0,
    doubleJumps: 0,
    hooks: 0,
    movingPlatforms: 0,
    shards: 0,
    boss: 0,
  };
}

function createGoals(mode) {
  const weight = goal => (goal.mode === mode ? 0 : goal.mode === 'both' ? 1 : 2);
  return PARKOUR_GOALS
    .filter(goal => goal.mode === 'both' || goal.mode === mode)
    .sort((a, b) => weight(a) - weight(b))
    .map(goal => ({ ...goal, completed: false }));
}

function recordStat(game, stat, amount = 1) {
  game.stats[stat] = (game.stats[stat] || 0) + amount;
  const completed = game.goals.find(goal => !goal.completed && goal.stat === stat && game.stats[stat] >= goal.target);
  if (!completed) return;
  completed.completed = true;
  game.player.score += completed.reward;
  game.missionNotice = `${completed.label} +${completed.reward}`;
  game.missionNoticeTimer = 2.2;
  game.message = `Mission geschafft: ${completed.label}`;
  game.messageTimer = 1.25;
}

function makeInitialGame(mode = 'arcade') {
  return {
    mode,
    elapsed: 0,
    phase: 'run',
    cameraX: 0,
    message: mode === 'learn' ? 'Springe durch das richtige Wortart-Gate.' : 'Erreiche das Portal.',
    messageTimer: 2,
    missionNotice: '',
    missionNoticeTimer: 0,
    stats: createStats(),
    goals: createGoals(mode),
    activeCheckpoint: { x: 96, y: 520, label: 'Start' },
    shake: 0,
    taskIndex: 0,
    gateCooldown: mode === 'learn' ? 1.1 : 0,
    particles: [],
    player: {
      x: 96,
      y: 520,
      w: 42,
      h: 66,
      vx: 0,
      vy: 0,
      facing: 1,
      hp: 100,
      stamina: 100,
      grounded: false,
      coyote: 0,
      jumpBuffer: 0,
      dashTimer: 0,
      dashCooldown: 0,
      attackTimer: 0,
      attackCooldown: 0,
      hookCooldown: 0,
      grapple: null,
      invuln: 0,
      wallDir: 0,
      airJumps: 1,
      flow: 0,
      score: 0,
      combo: 0,
    },
    coins: COINS.map((coin, index) => ({ ...coin, id: `coin-${index}`, taken: false })),
    rings: FLOW_RINGS.map((ring, index) => ({ ...ring, id: `ring-${index}`, taken: false, pulse: index * 0.7 })),
    checkpoints: CHECKPOINTS.map((checkpoint, index) => ({ ...checkpoint, id: `checkpoint-${index}`, active: false })),
    movingPlatforms: MOVING_PLATFORMS.map((platform, index) => ({
      ...platform,
      id: `moving-${index}`,
      t: platform.phase,
      dir: index % 2 ? -1 : 1,
      dx: 0,
    })),
    hooks: GRAPPLE_POINTS.map((hook, index) => ({ ...hook, id: `hook-${index}`, pulse: index * 0.6 })),
    shards: SHARDS.map((shard, index) => ({ ...shard, id: `shard-${index}`, taken: false, pulse: index * 0.9 })),
    enemies: ENEMIES.map((enemy, index) => ({ ...enemy, id: `enemy-${index}`, hp: enemy.type === 'flyer' ? 2 : 1, hitTimer: 0 })),
    boss: { x: WORLD_WIDTH - 420, y: FLOOR_Y - 92, w: 78, h: 92, hp: 6, maxHp: 6, hitTimer: 0, pulseTimer: 1.3, defeated: false },
    shockwaves: [],
    gates: mode === 'learn' ? buildGates(0) : [],
    result: null,
  };
}

function buildGates(taskIndex) {
  const task = LEARN_TASKS[taskIndex % LEARN_TASKS.length];
  return task.options.map((label, index) => ({
    id: `gate-${taskIndex}-${label}`,
    label,
    correct: label === task.answer,
    x: 1510 + taskIndex * 520 + index * 116,
    y: 312 - (index % 2) * 34,
    w: 98,
    h: 88,
    active: true,
  }));
}

function currentTask(game) {
  return LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
}

function playerRect(player) {
  return { x: player.x, y: player.y, w: player.w, h: player.h };
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
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

function spawnParticles(game, x, y, color, count = 8) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed;
    const speed = 120 + (i % 4) * 44;
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 70,
      life: 0.55,
      color,
    });
  }
}

function allPlatforms(game) {
  return [...PLATFORMS, ...game.movingPlatforms];
}

function damagePlayer(game, amount) {
  const player = game.player;
  if (player.invuln > 0) return;
  player.hp = clamp(player.hp - amount, 0, 100);
  player.invuln = 0.85;
  player.vx = -player.facing * 340;
  player.vy = -420;
  player.combo = 0;
  game.message = 'Autsch';
  game.messageTimer = 0.65;
  spawnParticles(game, player.x + player.w / 2, player.y + player.h / 2, '#fb7185', 10);
}

function resolvePlatforms(game, previousY) {
  const player = game.player;
  player.grounded = false;
  player.wallDir = 0;
  const rect = playerRect(player);

  allPlatforms(game).forEach((platform) => {
    if (platform.type === 'lava') {
      if (rectsOverlap(rect, platform)) damagePlayer(game, 28);
      return;
    }
    if (!rectsOverlap(rect, platform)) return;

    const prevBottom = previousY + player.h;
    const fromTop = prevBottom <= platform.y + 12 && player.vy >= 0;
    const fromBottom = previousY >= platform.y + platform.h - 8 && player.vy < 0;

    if (fromTop) {
      player.y = platform.y - player.h;
      player.vy = platform.type === 'bounce' ? -880 : 0;
      player.grounded = true;
      player.coyote = 0.11;
      if (platform.type === 'moving') {
        player.x += platform.dx || 0;
        if (player.lastMovingPlatform !== platform.id) {
          player.lastMovingPlatform = platform.id;
          recordStat(game, 'movingPlatforms');
          game.message = platform.label;
          game.messageTimer = 0.55;
        }
      }
      if (platform.type === 'bounce') {
        game.message = 'Sprungfeder';
        game.messageTimer = 0.4;
        spawnParticles(game, player.x + player.w / 2, platform.y, '#5eead4', 8);
      }
      if (platform.type === 'ice') player.vx *= 1.04;
      if (platform.type !== 'moving') player.lastMovingPlatform = null;
    } else if (fromBottom) {
      player.y = platform.y + platform.h;
      player.vy = Math.max(0, player.vy);
    } else if (player.x + player.w / 2 < platform.x + platform.w / 2) {
      player.x = platform.x - player.w;
      player.vx = Math.min(0, player.vx);
      player.wallDir = -1;
    } else {
      player.x = platform.x + platform.w;
      player.vx = Math.max(0, player.vx);
      player.wallDir = 1;
    }
  });
}

function updateMovingPlatforms(game, dt) {
  game.movingPlatforms.forEach((platform) => {
    const previousX = platform.x;
    platform.t += platform.dir * platform.speed * dt;
    if (platform.t <= 0 || platform.t >= 1) {
      platform.t = clamp(platform.t, 0, 1);
      platform.dir *= -1;
    }
    platform.x = platform.ax + (platform.bx - platform.ax) * platform.t;
    platform.dx = platform.x - previousX;
  });
}

function nearestHook(game) {
  const player = game.player;
  const cx = player.x + player.w / 2;
  const cy = player.y + player.h / 2;
  return game.hooks
    .map((hook) => ({ hook, distance: Math.hypot(cx - hook.x, cy - hook.y) }))
    .filter(({ distance }) => distance < 210)
    .sort((a, b) => a.distance - b.distance)[0]?.hook || null;
}

function startGrapple(game) {
  const player = game.player;
  if (player.hookCooldown > 0 || player.grounded) return false;
  const hook = nearestHook(game);
  if (!hook) return false;
  player.grapple = hook.id;
  player.hookCooldown = 0.55;
  player.stamina = clamp(player.stamina - 8, 0, 100);
  player.flow = clamp(player.flow + 12, 0, 100);
  recordStat(game, 'hooks');
  game.message = hook.label;
  game.messageTimer = 0.55;
  spawnParticles(game, hook.x, hook.y, '#67e8f9', 12);
  return true;
}

function updateGrapple(game, input, dt, previousY) {
  const player = game.player;
  const hook = game.hooks.find((candidate) => candidate.id === player.grapple);
  if (!hook) {
    player.grapple = null;
    return false;
  }
  const cx = player.x + player.w / 2;
  const cy = player.y + player.h / 2;
  const dx = hook.x - cx;
  const dy = hook.y - cy;
  const dist = Math.hypot(dx, dy) || 1;
  const pull = 2350;
  player.vx += (dx / dist) * pull * dt;
  player.vy += (dy / dist) * pull * dt;
  player.vx = clamp(player.vx, -820, 820);
  player.vy = clamp(player.vy, -940, 620);
  player.x += player.vx * dt;
  player.y += player.vy * dt;
  player.x = clamp(player.x, 0, WORLD_WIDTH - player.w);
  resolvePlatforms(game, previousY);
  if (dist < 42 || input.jump || input.dash) {
    player.grapple = null;
    player.vx += player.facing * 270;
    player.vy = Math.min(player.vy, -460);
    player.airJumps = 1;
    spawnParticles(game, cx, cy, '#bfdbfe', 10);
  }
  return true;
}

function updatePlayer(game, input, dt) {
  const player = game.player;
  const previousY = player.y;
  const axis = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const maxSpeed = input.down ? 210 : 335;
  const accel = player.grounded ? 2800 : 1900;
  const friction = player.grounded ? 0.78 : 0.94;

  player.jumpBuffer = input.jump ? 0.12 : Math.max(0, player.jumpBuffer - dt);
  player.coyote = player.grounded ? 0.11 : Math.max(0, player.coyote - dt);
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
  player.attackCooldown = Math.max(0, player.attackCooldown - dt);
  player.attackTimer = Math.max(0, player.attackTimer - dt);
  player.hookCooldown = Math.max(0, player.hookCooldown - dt);
  player.invuln = Math.max(0, player.invuln - dt);
  player.flow = clamp(player.flow - dt * 9, 0, 100);
  if (player.grounded) player.airJumps = 1;

  if (player.grapple && updateGrapple(game, input, dt, previousY)) {
    player.stamina = clamp(player.stamina + 12 * dt, 0, 100);
    return;
  }

  if (axis) {
    player.vx += axis * accel * dt;
    player.facing = axis > 0 ? 1 : -1;
  } else {
    player.vx *= Math.pow(friction, dt * 60);
  }
  player.vx = clamp(player.vx, -maxSpeed, maxSpeed);

  if (player.jumpBuffer > 0 && player.coyote > 0) {
    player.vy = -720;
    player.grounded = false;
    player.coyote = 0;
    player.jumpBuffer = 0;
    spawnParticles(game, player.x + player.w / 2, player.y + player.h, '#bfdbfe', 7);
  } else if (player.jumpBuffer > 0 && player.wallDir !== 0 && !player.grounded) {
    player.vy = -650;
    player.vx = -player.wallDir * 470;
    player.facing = player.wallDir < 0 ? 1 : -1;
    player.jumpBuffer = 0;
    spawnParticles(game, player.x + player.w / 2, player.y + player.h / 2, '#93c5fd', 8);
  } else if (player.jumpBuffer > 0 && player.airJumps > 0) {
    player.airJumps -= 1;
    player.vy = -610;
    player.jumpBuffer = 0;
    player.flow = clamp(player.flow + 14, 0, 100);
    recordStat(game, 'doubleJumps');
    spawnParticles(game, player.x + player.w / 2, player.y + player.h / 2, '#c4b5fd', 10);
  }

  if (input.dash && player.dashCooldown <= 0 && player.stamina >= 22) {
    player.dashTimer = 0.18;
    player.dashCooldown = 0.72;
    player.stamina -= 22;
    player.vx = player.facing * 760;
    player.vy *= 0.35;
    player.flow = clamp(player.flow + 10, 0, 100);
    recordStat(game, 'dashes');
    spawnParticles(game, player.x + player.w / 2, player.y + player.h / 2, '#facc15', 10);
  }
  if (player.dashTimer > 0) {
    player.dashTimer = Math.max(0, player.dashTimer - dt);
  } else {
    player.vy += GRAVITY * dt;
  }

  if (input.attack && startGrapple(game)) {
    input.attack = false;
  } else if (input.attack && player.attackCooldown <= 0 && player.stamina >= 12) {
    player.attackTimer = 0.22;
    player.attackCooldown = 0.32;
    player.stamina -= 12;
  }

  player.x += player.vx * dt;
  player.y += player.vy * dt;
  player.x = clamp(player.x, 0, WORLD_WIDTH - player.w);
  resolvePlatforms(game, previousY);
  player.stamina = clamp(player.stamina + (player.grounded ? 26 : 15) * dt, 0, 100);

  if (player.y > HEIGHT + 180) {
    player.x = game.activeCheckpoint.x;
    player.y = game.activeCheckpoint.y;
    player.vx = 0;
    player.vy = 0;
    player.airJumps = 1;
    damagePlayer(game, 30);
  }
}

function updateCoins(game) {
  const player = game.player;
  game.coins.forEach((coin) => {
    if (coin.taken) return;
    const coinRect = { x: coin.x - 18, y: coin.y - 18, w: 36, h: 36 };
    if (!rectsOverlap(playerRect(player), coinRect)) return;
    coin.taken = true;
    player.score += 80 + player.combo * 10;
    player.combo += 1;
    player.flow = clamp(player.flow + 4, 0, 100);
    recordStat(game, 'coins');
    game.message = player.combo > 3 ? `${player.combo}er Muenzen-Kette` : 'Muenze';
    game.messageTimer = 0.45;
    spawnParticles(game, coin.x, coin.y, '#facc15', 8);
  });
}

function updateFlowRings(game, input, dt) {
  const player = game.player;
  const centerX = player.x + player.w / 2;
  const centerY = player.y + player.h / 2;
  game.rings.forEach((ring) => {
    if (ring.taken) return;
    ring.pulse += dt * 5;
    const distance = Math.hypot(centerX - ring.x, centerY - ring.y);
    if (distance > ring.r + 18) return;
    ring.taken = true;
    const direction = input.left ? -1 : 1;
    player.vx = direction * ring.boostX;
    player.vy = ring.boostY;
    player.stamina = clamp(player.stamina + 26, 0, 100);
    player.flow = clamp(player.flow + 22, 0, 100);
    player.combo += 1;
    player.score += 260 + player.combo * 22;
    recordStat(game, 'rings');
    game.message = `${ring.label}-Ring`;
    game.messageTimer = 0.7;
    game.shake = 0.08;
    spawnParticles(game, ring.x, ring.y, '#facc15', 18);
  });
}

function updateShards(game) {
  const player = game.player;
  game.shards.forEach((shard) => {
    if (shard.taken) return;
    shard.pulse += 0.08;
    const shardRect = { x: shard.x - 18, y: shard.y - 22, w: 36, h: 44 };
    if (!rectsOverlap(playerRect(player), shardRect)) return;
    shard.taken = true;
    player.score += 340;
    player.stamina = 100;
    player.flow = clamp(player.flow + 18, 0, 100);
    recordStat(game, 'shards');
    game.message = shard.label;
    game.messageTimer = 0.75;
    spawnParticles(game, shard.x, shard.y, '#a78bfa', 18);
  });
}

function updateCheckpoints(game) {
  const player = game.player;
  game.checkpoints.forEach((checkpoint) => {
    if (checkpoint.active || player.x < checkpoint.x) return;
    checkpoint.active = true;
    game.activeCheckpoint = { x: checkpoint.x - 74, y: checkpoint.y, label: checkpoint.label };
    game.message = `Checkpoint: ${checkpoint.label}`;
    game.messageTimer = 0.9;
    spawnParticles(game, checkpoint.x, checkpoint.y + 34, '#67e8f9', 14);
  });
}

function updateEnemies(game, dt) {
  const player = game.player;
  const attackBox = player.attackTimer > 0
    ? { x: player.facing > 0 ? player.x + player.w - 4 : player.x - 52, y: player.y + 14, w: 58, h: 42 }
    : null;

  game.enemies.forEach((enemy) => {
    if (enemy.hp <= 0) return;
    enemy.hitTimer = Math.max(0, enemy.hitTimer - dt);
    const speed = enemy.type === 'flyer' ? 96 : 72;
    enemy.x += enemy.dir * speed * dt;
    if (enemy.x < enemy.min || enemy.x > enemy.max) enemy.dir *= -1;
    if (enemy.type === 'flyer') enemy.y += Math.sin(game.elapsed * 4 + enemy.x * 0.01) * 34 * dt;
    const enemyRect = { x: enemy.x - 24, y: enemy.y - 34, w: 48, h: 48 };

    if (attackBox && enemy.hitTimer <= 0 && rectsOverlap(attackBox, enemyRect)) {
      enemy.hp -= 1;
      enemy.hitTimer = 0.25;
      player.score += 150;
      player.combo += 1;
      player.flow = clamp(player.flow + 10, 0, 100);
      player.vx += player.facing * 90;
      game.message = 'Treffer';
      game.messageTimer = 0.45;
      spawnParticles(game, enemy.x, enemy.y, '#f87171', 10);
      if (enemy.hp <= 0) recordStat(game, 'defeats');
    } else if (rectsOverlap(playerRect(player), enemyRect)) {
      const stomp = player.vy > 160 && player.y + player.h - enemyRect.y < 28;
      if (stomp) {
        enemy.hp = 0;
        player.vy = -560;
        player.score += 220;
        player.combo += 1;
        player.flow = clamp(player.flow + 16, 0, 100);
        recordStat(game, 'defeats');
        game.message = 'Stomp';
        game.messageTimer = 0.45;
        spawnParticles(game, enemy.x, enemy.y, '#5eead4', 10);
      } else {
        damagePlayer(game, enemy.type === 'flyer' ? 14 : 18);
      }
    }
  });
}

function updateBoss(game, dt) {
  const boss = game.boss;
  const player = game.player;
  if (boss.defeated) return;
  boss.hitTimer = Math.max(0, boss.hitTimer - dt);
  boss.pulseTimer = Math.max(0, boss.pulseTimer - dt);
  if (boss.pulseTimer <= 0) {
    boss.pulseTimer = boss.hp <= 3 ? 1.25 : 1.8;
    game.shockwaves.push({ x: boss.x + boss.w / 2, y: boss.y + boss.h - 8, r: 22, life: 1.15, hit: false });
    spawnParticles(game, boss.x + boss.w / 2, boss.y + boss.h - 8, '#fb7185', 14);
  }

  const bossRect = { x: boss.x, y: boss.y, w: boss.w, h: boss.h };
  const attackBox = player.attackTimer > 0
    ? { x: player.facing > 0 ? player.x + player.w - 4 : player.x - 52, y: player.y + 14, w: 58, h: 42 }
    : null;
  const stomp = rectsOverlap(playerRect(player), bossRect) && player.vy > 180 && player.y + player.h - boss.y < 34;
  const slash = attackBox && rectsOverlap(attackBox, bossRect) && boss.hitTimer <= 0;
  if (stomp || slash) {
    boss.hp = Math.max(0, boss.hp - (stomp ? 2 : 1));
    boss.hitTimer = 0.42;
    player.vy = stomp ? -680 : Math.min(player.vy, -320);
    player.vx = -player.facing * 260;
    player.score += 260;
    player.flow = clamp(player.flow + 20, 0, 100);
    game.shake = 0.12;
    game.message = boss.hp <= 0 ? 'Waechter besiegt' : 'Boss-Treffer';
    game.messageTimer = 0.8;
    spawnParticles(game, boss.x + boss.w / 2, boss.y + 32, '#facc15', 18);
    if (boss.hp <= 0) {
      boss.defeated = true;
      recordStat(game, 'boss');
      game.shockwaves = [];
      spawnParticles(game, boss.x + boss.w / 2, boss.y + boss.h / 2, '#5eead4', 30);
    }
  } else if (rectsOverlap(playerRect(player), bossRect)) {
    damagePlayer(game, 18);
    player.vx = player.x < boss.x ? -440 : 440;
  }
}

function updateShockwaves(game, dt) {
  const player = game.player;
  game.shockwaves = game.shockwaves
    .map((wave) => ({ ...wave, r: wave.r + 230 * dt, life: wave.life - dt }))
    .filter((wave) => wave.life > 0 && wave.r < 330);
  game.shockwaves.forEach((wave) => {
    if (wave.hit) return;
    const footX = player.x + player.w / 2;
    const footY = player.y + player.h;
    const dist = Math.hypot(footX - wave.x, footY - wave.y);
    if (Math.abs(dist - wave.r) < 20 && player.grounded) {
      wave.hit = true;
      damagePlayer(game, 16);
    }
  });
}

function updateLearnGates(game, dt) {
  if (game.mode !== 'learn') return;
  const player = game.player;
  game.gateCooldown = Math.max(0, game.gateCooldown - dt);
  if (game.gateCooldown > 0) return;

  game.gates.forEach((gate) => {
    if (!gate.active) return;
    if (!rectsOverlap(playerRect(player), gate)) return;
    const task = currentTask(game);
    gate.active = false;
    if (gate.correct) {
      player.score += 360;
      player.stamina = 100;
      player.flow = clamp(player.flow + 18, 0, 100);
      player.vy = Math.min(player.vy, -420);
      game.taskIndex += 1;
      recordStat(game, 'learnCorrect');
      game.gates = buildGates(game.taskIndex).filter((nextGate) => nextGate.x < WORLD_WIDTH - 320);
      game.message = `${task.word}: ${task.answer}`;
      game.messageTimer = 1.2;
      spawnParticles(game, gate.x + gate.w / 2, gate.y + gate.h / 2, '#5eead4', 16);
    } else {
      damagePlayer(game, 16);
      game.message = `${task.word} ist nicht ${gate.label}`;
      game.messageTimer = 1.1;
    }
    game.gateCooldown = 0.85;
  });
}

function updateParticles(game, dt) {
  game.particles = game.particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * dt,
      y: particle.y + particle.vy * dt,
      vy: particle.vy + 600 * dt,
      life: particle.life - dt,
    }))
    .filter((particle) => particle.life > 0);
}

function updateGame(game, input, dt, onFinish) {
  if (game.phase !== 'run') return;
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.missionNoticeTimer = Math.max(0, game.missionNoticeTimer - dt);
  game.shake = Math.max(0, game.shake - dt);
  updateMovingPlatforms(game, dt);
  updatePlayer(game, input, dt);
  updateCoins(game);
  updateFlowRings(game, input, dt);
  updateShards(game);
  updateCheckpoints(game);
  updateEnemies(game, dt);
  updateBoss(game, dt);
  updateShockwaves(game, dt);
  updateLearnGates(game, dt);
  updateParticles(game, dt);
  game.cameraX = clamp(game.player.x - WIDTH * 0.38, 0, WORLD_WIDTH - WIDTH);

  const portal = { x: WORLD_WIDTH - 240, y: FLOOR_Y - 124, w: 110, h: 124 };
  if (rectsOverlap(playerRect(game.player), portal) || game.player.hp <= 0) {
    const won = game.player.hp > 0;
    if (won && !game.boss.defeated) {
      game.message = 'Portal versiegelt: Waechter besiegen';
      game.messageTimer = 1;
      damagePlayer(game, 8);
      game.player.vx = -420;
      return;
    }
    if (won) recordStat(game, 'finish');
    game.phase = 'result';
    game.result = {
      result: won ? 'Portal erreicht' : 'Run verloren',
      score: game.player.score + (won ? 1200 : 0),
      coins: game.coins.filter((coin) => coin.taken).length,
    };
    onFinish(game.result);
  }
}

function worldToScreen(game, x, y) {
  return { x: x - game.cameraX, y };
}

function drawBackground(ctx, game) {
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, '#082f49');
  sky.addColorStop(0.48, '#0f766e');
  sky.addColorStop(1, '#111827');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (let layer = 0; layer < 3; layer += 1) {
    const speed = [0.18, 0.34, 0.58][layer];
    const baseY = [230, 300, 382][layer];
    ctx.fillStyle = [`rgba(15,23,42,.28)`, `rgba(15,23,42,.42)`, `rgba(15,23,42,.62)`][layer];
    ctx.beginPath();
    ctx.moveTo(0, HEIGHT);
    for (let x = -80; x <= WIDTH + 120; x += 160) {
      const worldX = x + (game.cameraX * speed) % 160;
      const peak = baseY + Math.sin((x + layer * 80) * 0.01) * 34;
      ctx.lineTo(worldX, peak);
      ctx.lineTo(worldX + 100, baseY + 60);
    }
    ctx.lineTo(WIDTH, HEIGHT);
    ctx.closePath();
    ctx.fill();
  }
}

function platformColor(type) {
  if (type === 'grass') return '#16a34a';
  if (type === 'ice') return '#38bdf8';
  if (type === 'bounce') return '#a855f7';
  if (type === 'lava') return '#ef4444';
  if (type === 'moving') return '#f59e0b';
  return '#475569';
}

function drawWorld(ctx, game) {
  allPlatforms(game).forEach((platform) => {
    const p = worldToScreen(game, platform.x, platform.y);
    if (p.x + platform.w < -80 || p.x > WIDTH + 80) return;
    ctx.save();
    ctx.fillStyle = platformColor(platform.type);
    drawRoundedRect(ctx, p.x, p.y, platform.w, platform.h, platform.type === 'lava' ? 4 : 12);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.16)';
    ctx.fillRect(p.x + 8, p.y + 8, platform.w - 16, 6);
    if (platform.type === 'lava') {
      ctx.fillStyle = '#f97316';
      for (let x = 0; x < platform.w; x += 36) {
        ctx.beginPath();
        ctx.arc(p.x + x + 14, p.y + 16 + Math.sin(game.elapsed * 8 + x) * 5, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (platform.type === 'moving') {
      ctx.fillStyle = '#111827';
      ctx.font = '900 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(platform.label, p.x + platform.w / 2, p.y + 20);
    }
    ctx.restore();
  });

  game.coins.forEach((coin) => {
    if (coin.taken) return;
    const p = worldToScreen(game, coin.x, coin.y + Math.sin(game.elapsed * 5 + coin.x) * 5);
    if (p.x < -40 || p.x > WIDTH + 40) return;
    ctx.save();
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
  });
}

function drawFlowRings(ctx, game) {
  game.rings.forEach((ring) => {
    if (ring.taken) return;
    const p = worldToScreen(game, ring.x, ring.y);
    if (p.x + ring.r < -70 || p.x - ring.r > WIDTH + 70) return;
    const pulse = Math.sin(ring.pulse) * 0.08;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(pulse + ring.x * 0.002);
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 24;
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(0, 0, ring.r, ring.r * 0.66, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fef3c7';
    ctx.beginPath();
    ctx.ellipse(0, 0, ring.r * 0.72, ring.r * 0.43, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ring.label, 0, ring.r + 18);
    ctx.restore();
  });
}

function drawHooks(ctx, game) {
  game.hooks.forEach((hook) => {
    hook.pulse += 0.04;
    const p = worldToScreen(game, hook.x, hook.y);
    if (p.x < -80 || p.x > WIDTH + 80) return;
    const active = game.player.grapple === hook.id;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.shadowColor = active ? '#facc15' : '#67e8f9';
    ctx.shadowBlur = active ? 30 : 20;
    ctx.strokeStyle = active ? '#facc15' : '#67e8f9';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, hook.r + Math.sin(hook.pulse) * 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(15,23,42,.82)';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e0f2fe';
    ctx.font = '900 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('J', 0, 4);
    ctx.restore();
  });

  if (game.player.grapple) {
    const hook = game.hooks.find((candidate) => candidate.id === game.player.grapple);
    if (hook) {
      const hp = worldToScreen(game, hook.x, hook.y);
      const pp = worldToScreen(game, game.player.x + game.player.w / 2, game.player.y + game.player.h / 2);
      ctx.save();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.moveTo(pp.x, pp.y);
      ctx.lineTo(hp.x, hp.y);
      ctx.stroke();
      ctx.restore();
    }
  }
}

function drawShards(ctx, game) {
  game.shards.forEach((shard) => {
    if (shard.taken) return;
    const p = worldToScreen(game, shard.x, shard.y + Math.sin(game.elapsed * 5 + shard.pulse) * 5);
    if (p.x < -50 || p.x > WIDTH + 50) return;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.shadowColor = '#a78bfa';
    ctx.shadowBlur = 22;
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(16, 0);
    ctx.lineTo(0, 24);
    ctx.lineTo(-16, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ede9fe';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  });
}

function drawCheckpoints(ctx, game) {
  game.checkpoints.forEach((checkpoint) => {
    const p = worldToScreen(game, checkpoint.x, checkpoint.y);
    if (p.x < -80 || p.x > WIDTH + 80) return;
    ctx.save();
    ctx.strokeStyle = checkpoint.active ? '#67e8f9' : '#94a3b8';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y + 98);
    ctx.lineTo(p.x, p.y - 10);
    ctx.stroke();
    ctx.fillStyle = checkpoint.active ? '#22d3ee' : '#334155';
    ctx.beginPath();
    ctx.moveTo(p.x + 4, p.y - 10);
    ctx.lineTo(p.x + 78, p.y + 14);
    ctx.lineTo(p.x + 4, p.y + 38);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#e0f2fe';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.fillText(checkpoint.label, p.x + 10, p.y + 66);
    ctx.restore();
  });
}

function drawEnemies(ctx, game) {
  game.enemies.forEach((enemy) => {
    if (enemy.hp <= 0) return;
    const p = worldToScreen(game, enemy.x, enemy.y);
    if (p.x < -80 || p.x > WIDTH + 80) return;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.shadowColor = enemy.type === 'flyer' ? '#f97316' : '#ef4444';
    ctx.shadowBlur = 14;
    ctx.fillStyle = enemy.hitTimer > 0 ? '#fecaca' : enemy.type === 'flyer' ? '#ea580c' : '#991b1b';
    if (enemy.type === 'flyer') {
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(34, 18);
      ctx.lineTo(-34, 18);
      ctx.closePath();
      ctx.fill();
    } else {
      drawRoundedRect(ctx, -25, -36, 50, 50, 14);
      ctx.fill();
    }
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(8, -16, 7, 7);
    ctx.restore();
  });
}

function drawBoss(ctx, game) {
  const boss = game.boss;
  if (boss.defeated) return;
  const p = worldToScreen(game, boss.x, boss.y);
  if (p.x < -140 || p.x > WIDTH + 140) return;
  ctx.save();
  ctx.translate(p.x + boss.w / 2, p.y + boss.h);
  ctx.shadowColor = boss.hitTimer > 0 ? '#fecaca' : '#fb7185';
  ctx.shadowBlur = 26;
  ctx.fillStyle = boss.hitTimer > 0 ? '#fecaca' : '#7f1d1d';
  drawRoundedRect(ctx, -boss.w / 2, -boss.h, boss.w, boss.h, 18);
  ctx.fill();
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(-34, -boss.h + 10);
  ctx.lineTo(-8, -boss.h - 24);
  ctx.lineTo(10, -boss.h + 10);
  ctx.lineTo(34, -boss.h - 20);
  ctx.lineTo(30, -boss.h + 18);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(12, -58, 8, 8);
  ctx.fillStyle = 'rgba(2,6,23,.86)';
  drawRoundedRect(ctx, -42, 12, 84, 9, 5);
  ctx.fill();
  ctx.fillStyle = '#fb7185';
  drawRoundedRect(ctx, -42, 12, 84 * clamp(boss.hp / boss.maxHp, 0, 1), 9, 5);
  ctx.fill();
  ctx.restore();

  game.shockwaves.forEach((wave) => {
    const wp = worldToScreen(game, wave.x, wave.y);
    if (wp.x + wave.r < -80 || wp.x - wave.r > WIDTH + 80) return;
    ctx.save();
    ctx.globalAlpha = clamp(wave.life, 0, 1);
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(wp.x, wp.y, wave.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
}

function drawGates(ctx, game) {
  if (game.mode !== 'learn') return;
  game.gates.forEach((gate) => {
    if (!gate.active) return;
    const p = worldToScreen(game, gate.x, gate.y);
    if (p.x + gate.w < -80 || p.x > WIDTH + 80) return;
    ctx.save();
    ctx.globalAlpha = game.gateCooldown > 0 ? 0.5 : 0.92;
    ctx.shadowColor = gate.correct ? '#5eead4' : '#a78bfa';
    ctx.shadowBlur = 20;
    ctx.fillStyle = gate.correct ? 'rgba(20,184,166,.78)' : 'rgba(79,70,229,.72)';
    drawRoundedRect(ctx, p.x, p.y, gate.w, gate.h, 18);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 17px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(gate.label, p.x + gate.w / 2, p.y + gate.h / 2);
    ctx.restore();
  });
}

function drawPlayer(ctx, game) {
  const player = game.player;
  const p = worldToScreen(game, player.x, player.y);
  ctx.save();
  ctx.translate(p.x + player.w / 2, p.y + player.h);
  ctx.scale(player.facing, 1);
  ctx.globalAlpha = player.invuln > 0 && Math.sin(game.elapsed * 42) > 0 ? 0.56 : 1;
  ctx.shadowColor = player.dashTimer > 0 ? '#facc15' : '#38bdf8';
  ctx.shadowBlur = player.dashTimer > 0 ? 24 : 12;
  ctx.fillStyle = '#2563eb';
  drawRoundedRect(ctx, -20, -52, 40, 50, 12);
  ctx.fill();
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(0, -70, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111827';
  ctx.fillRect(6, -74, 5, 5);
  ctx.strokeStyle = player.attackTimer > 0 ? '#fef3c7' : '#bfdbfe';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(17, -40);
  ctx.lineTo(42 + (player.attackTimer > 0 ? 22 : 0), -50);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-14, -2);
  ctx.lineTo(-20, 20);
  ctx.moveTo(14, -2);
  ctx.lineTo(20, 20);
  ctx.stroke();
  ctx.restore();
}

function drawPortal(ctx, game) {
  const portal = { x: WORLD_WIDTH - 240, y: FLOOR_Y - 124, w: 110, h: 124 };
  const p = worldToScreen(game, portal.x, portal.y);
  ctx.save();
  const open = game.boss.defeated;
  ctx.shadowColor = open ? '#22d3ee' : '#fb7185';
  ctx.shadowBlur = 30;
  ctx.strokeStyle = open ? '#22d3ee' : '#fb7185';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.ellipse(p.x + portal.w / 2, p.y + portal.h / 2, 42 + Math.sin(game.elapsed * 5) * 5, 58, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = open ? 'rgba(34,211,238,.18)' : 'rgba(251,113,133,.16)';
  ctx.fill();
  if (!open) {
    ctx.fillStyle = '#fecaca';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LOCKED', p.x + portal.w / 2, p.y + portal.h + 22);
  }
  ctx.restore();
}

function drawParticles(ctx, game) {
  game.particles.forEach((particle) => {
    const p = worldToScreen(game, particle.x, particle.y);
    ctx.save();
    ctx.globalAlpha = clamp(particle.life / 0.55, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5 + particle.life * 8, 0, Math.PI * 2);
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
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, 32, 24, 430, 142, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 23px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Faska Parkour Pro: Learncade' : 'Faska Parkour Pro', 54, 56);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '800 14px Outfit, sans-serif';
  ctx.fillText(`Muenzen ${game.coins.filter((coin) => coin.taken).length}/${game.coins.length} · Score ${player.score}`, 54, 84);
  drawMeter(ctx, 54, 108, 156, 12, player.hp, '#22c55e', 'HP');
  drawMeter(ctx, 236, 108, 156, 12, player.stamina, '#facc15', 'STAMINA');
  drawMeter(ctx, 54, 142, 338, 12, player.flow, '#67e8f9', 'FLOW');

  if (game.mode === 'learn') {
    const task = currentTask(game);
    const taskX = 474;
    const taskW = 400;
    const taskY = 108;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.78)';
    drawRoundedRect(ctx, taskX, taskY, taskW, 74, 18);
    ctx.fill();
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '900 18px Outfit, sans-serif';
    ctx.fillText(task.sentence, taskX + taskW / 2, taskY + 28);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 15px Outfit, sans-serif';
    ctx.fillText(`Springe durch die Wortart von "${task.word}".`, taskX + taskW / 2, taskY + 54);
  }

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, WIDTH - 362, 24, 330, 182, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 24px Outfit, sans-serif';
  ctx.fillText(`Combo x${Math.max(1, player.combo)}`, WIDTH - 54, 58);
  ctx.fillStyle = '#67e8f9';
  ctx.font = '800 14px Outfit, sans-serif';
  ctx.fillText(`Distanz ${Math.round(player.x)} · CP ${game.activeCheckpoint.label}`, WIDTH - 54, 84);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText(`Ringe ${game.stats.rings} · Hooks ${game.stats.hooks} · Runen ${game.stats.shards}/${game.shards.length}`, WIDTH - 54, 108);
  ctx.fillStyle = game.boss.defeated ? '#86efac' : '#fb7185';
  ctx.fillText(game.boss.defeated ? 'Portal offen' : `Boss HP ${game.boss.hp}/${game.boss.maxHp}`, WIDTH - 54, 124);
  ctx.textAlign = 'left';
  activeGoals.forEach((goal, index) => {
    const value = Math.min(game.stats[goal.stat] || 0, goal.target);
    ctx.fillStyle = goal.completed ? '#86efac' : '#e2e8f0';
    ctx.font = '800 12px Outfit, sans-serif';
    ctx.fillText(`${goal.completed ? 'DONE' : `${value}/${goal.target}`}  ${goal.label}`, WIDTH - 332, 150 + index * 18);
  });

  if (game.missionNoticeTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(15,23,42,.82)';
    drawRoundedRect(ctx, CENTER_X - 240, 190, 480, 46, 16);
    ctx.fill();
    ctx.fillStyle = '#86efac';
    ctx.font = '900 19px Outfit, sans-serif';
    ctx.fillText(game.missionNotice, CENTER_X, 218);
  }

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.7)';
    drawRoundedRect(ctx, CENTER_X - 230, HEIGHT - 104, 460, 52, 18);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 24px Outfit, sans-serif';
    ctx.fillText(game.message, CENTER_X, HEIGHT - 70);
  }

  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  const shakeX = game.shake > 0 ? Math.sin(game.elapsed * 70) * game.shake * 34 : 0;
  const shakeY = game.shake > 0 ? Math.cos(game.elapsed * 51) * game.shake * 24 : 0;
  ctx.save();
  ctx.translate(shakeX, shakeY);
  drawBackground(ctx, game);
  drawWorld(ctx, game);
  drawCheckpoints(ctx, game);
  drawHooks(ctx, game);
  drawFlowRings(ctx, game);
  drawShards(ctx, game);
  drawGates(ctx, game);
  drawPortal(ctx, game);
  drawEnemies(ctx, game);
  drawBoss(ctx, game);
  drawPlayer(ctx, game);
  drawParticles(ctx, game);
  ctx.restore();
  drawHud(ctx, game);
}

export default function FaskaParkourSwarm() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameRef = useRef(makeInitialGame('arcade'));
  const inputRef = useRef({
    left: false,
    right: false,
    down: false,
    jump: false,
    dash: false,
    attack: false,
  });
  const modeRef = useRef('arcade');
  const [mode, setMode] = useState('arcade');
  const [result, setResult] = useState(null);

  const clearInput = useCallback(() => {
    inputRef.current = {
      left: false,
      right: false,
      down: false,
      jump: false,
      dash: false,
      attack: false,
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
      ['ArrowLeft', 'left'], ['a', 'left'], ['A', 'left'],
      ['ArrowRight', 'right'], ['d', 'right'], ['D', 'right'],
      ['ArrowDown', 'down'], ['s', 'down'], ['S', 'down'],
      ['ArrowUp', 'jump'], ['w', 'jump'], ['W', 'jump'], [' ', 'jump'],
      ['Shift', 'dash'],
      ['j', 'attack'], ['J', 'attack'],
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
    boxShadow: '0 12px 32px rgba(0,0,0,.3)',
  };
  const actionButton = {
    ...padButton,
    width: 86,
    height: 62,
    fontSize: 13,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#06111f', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
      <canvas
        className="parkour-canvas"
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
          boxShadow: '0 0 120px rgba(168,85,247,.18), inset 0 0 80px rgba(250,204,21,.08), 0 0 90px rgba(0,0,0,.55)',
        }}
      />

      {/* Post-processing vignette overlay */}
      <div className="parkour-vignette" style={{
        position: 'absolute',
        inset: 0,
        margin: 'auto',
        width: 'min(100vw, calc(100vh * 16 / 9))',
        height: 'min(100vh, calc(100vw * 9 / 16))',
        pointerEvents: 'none',
        zIndex: 1,
        boxShadow: 'inset 0 0 150px 60px rgba(0,0,0,.45), inset 0 0 80px 30px rgba(168,85,247,.10)',
        borderRadius: 2,
      }} />

      <div className="parkour-modebar" style={{ position: 'fixed', top: canvasTopChrome, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.55 }}>
          Normal
        </button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.55 }}>
          Learncade
        </button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      <div className="parkour-touch-controls parkour-stick-controls" style={{
        position: 'fixed', left: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'grid', gridTemplateColumns: '62px 62px 62px', gridTemplateRows: '62px',
        gap: 8, touchAction: 'none',
      }}>
        <button aria-label="Links" style={padButton} {...holdButton('left')}>←</button>
        <button aria-label="Ducken" style={padButton} {...holdButton('down')}>↓</button>
        <button aria-label="Rechts" style={padButton} {...holdButton('right')}>→</button>
      </div>

      <div className="parkour-touch-controls parkour-action-controls" style={{
        position: 'fixed', right: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'grid', gridTemplateColumns: 'repeat(2, 92px)', gap: 10, alignItems: 'end', touchAction: 'none',
      }}>
        <button aria-label="Springen" style={{ ...actionButton, width: 96, height: 76, background: 'rgba(56,189,248,.82)', color: '#082f49' }} {...holdButton('jump')}>
          JUMP
        </button>
        <button aria-label="Angriff" style={actionButton} {...holdButton('attack')}>ATTACK</button>
        <button aria-label="Dash" style={{ ...actionButton, width: 96, height: 74, background: 'rgba(250,204,21,.84)', color: '#111827' }} {...holdButton('dash')}>
          DASH
        </button>
      </div>

      {result && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2,6,23,.74)', zIndex: 20, flexDirection: 'column', gap: 16,
        }}>
          <div style={{ fontSize: 54, fontWeight: 900, color: '#f8fafc' }}>{result.result}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#facc15' }}>Score {result.score}</div>
          <div style={{ fontSize: 15, color: '#cbd5e1' }}>Muenzen {result.coins}/{COINS.length}</div>
          <button className="btn-primary" onClick={restart}>Neuer Lauf</button>
        </div>
      )}

      <style>{`
        @media (pointer: fine), (min-width: 900px) {
          .parkour-touch-controls {
            display: none !important;
          }
        }
        @media (max-width: 899px) and (orientation: portrait) {
          .parkour-canvas,
          .parkour-vignette {
            inset: 0 !important;
            width: 100dvw !important;
            height: 100dvh !important;
            transform: none !important;
          }
          .parkour-modebar {
            top: max(8px, env(safe-area-inset-top)) !important;
            width: min(96dvw, 560px);
            flex-wrap: wrap;
            justify-content: center;
            gap: 6px !important;
          }
          .parkour-modebar .btn-primary {
            padding: 8px 11px;
            font-size: 11px;
          }
          .parkour-touch-controls {
            bottom: max(14px, env(safe-area-inset-bottom)) !important;
          }
          .parkour-stick-controls {
            left: 8px !important;
            grid-template-columns: repeat(3, 58px) !important;
            gap: 6px !important;
          }
          .parkour-stick-controls button {
            width: 58px !important;
            height: 58px !important;
            border-radius: 13px !important;
            font-size: 18px !important;
          }
          .parkour-action-controls {
            right: 8px !important;
            grid-template-columns: repeat(2, 82px) !important;
            gap: 8px !important;
          }
          .parkour-action-controls button {
            width: 82px !important;
            height: 58px !important;
            border-radius: 14px !important;
            font-size: 11px !important;
            padding: 0 !important;
          }
          .parkour-action-controls button:first-child {
            height: 70px !important;
          }
        }
      `}</style>
    </div>
  );
}
