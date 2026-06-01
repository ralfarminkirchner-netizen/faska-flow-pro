import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const WORLD_W = 1840;
const WORLD_H = 1160;
const PLAYER_R = 18;
const HITSTOP_MAX = 0.045;

const ARENA_RECTS = [
  { x: 210, y: 205, w: 170, h: 56, tone: '#243b53' },
  { x: 1450, y: 210, w: 180, h: 58, tone: '#263f5f' },
  { x: 320, y: 820, w: 210, h: 62, tone: '#2b3f58' },
  { x: 1250, y: 830, w: 220, h: 62, tone: '#263f5f' },
  { x: 790, y: 535, w: 260, h: 72, tone: '#1e3550' },
  { x: 805, y: 245, w: 230, h: 48, tone: '#263f5f' },
  { x: 805, y: 875, w: 230, h: 48, tone: '#263f5f' },
];

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "mutig"?',
    answer: 'Adjektiv',
    options: ['Nomen', 'Verb', 'Adjektiv'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welches Wort ist ein Verb?',
    answer: 'springen',
    options: ['springen', 'Stein', 'hell'],
  },
  {
    subject: 'Mathe',
    prompt: '12 x 7 = ?',
    answer: '84',
    options: ['72', '84', '96'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "shield"?',
    answer: 'Schild',
    options: ['Schwert', 'Schild', 'Schule'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Was brauchen Pflanzen zum Wachsen?',
    answer: 'Licht',
    options: ['Licht', 'Stein', 'Sanduhr'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welches Wort ist ein Nomen?',
    answer: 'Bruecke',
    options: ['Bruecke', 'laufen', 'weich'],
  },
];

const NIGHT_HUNT_GOALS = [
  { id: 'waves-3', label: '3 Wellen ueberleben', stat: 'wavesCleared', target: 3, reward: 900, mode: 'arcade' },
  { id: 'kills-18', label: '18 Gegner bezwingen', stat: 'kills', target: 18, reward: 850, mode: 'both' },
  { id: 'dodges-4', label: '4 Perfect-Dodges', stat: 'perfectDodges', target: 4, reward: 760, mode: 'arcade' },
  { id: 'parry-3', label: '3 Pistolen-Parries', stat: 'pistolParries', target: 3, reward: 780, mode: 'both' },
  { id: 'visceral-2', label: '2 Visceral-Angriffe', stat: 'viscerals', target: 2, reward: 860, mode: 'both' },
  { id: 'trick-6', label: '6 Trick-Treffer', stat: 'trickHits', target: 6, reward: 820, mode: 'both' },
  { id: 'fever-2', label: '2x Blutfieber', stat: 'bloodSurges', target: 2, reward: 900, mode: 'both' },
  { id: 'boss-1', label: '1 Nachtboss besiegen', stat: 'bosses', target: 1, reward: 1300, mode: 'both' },
  { id: 'focus-3', label: '3 Fokus-Zauber wirken', stat: 'focusCasts', target: 3, reward: 700, mode: 'both' },
  { id: 'learn-4', label: '4 Lernrunen richtig', stat: 'learnCorrect', target: 4, reward: 1200, mode: 'learn' },
  { id: 'rally-120', label: '120 Rally-Heilung', stat: 'rallyHeal', target: 120, reward: 800, mode: 'both' },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const len = (x, y) => Math.hypot(x, y) || 1;
const norm = (x, y) => {
  const l = len(x, y);
  return { x: x / l, y: y / l };
};

const NIGHT_KEY_BINDINGS = new Map([
  ['w', 'up'], ['W', 'up'], ['ArrowUp', 'up'],
  ['s', 'down'], ['S', 'down'], ['ArrowDown', 'down'],
  ['a', 'left'], ['A', 'left'], ['ArrowLeft', 'left'],
  ['d', 'right'], ['D', 'right'], ['ArrowRight', 'right'],
  ['j', 'attack'], ['J', 'attack'],
  ['e', 'cast'], ['E', 'cast'], ['l', 'cast'], ['L', 'cast'],
  [' ', 'dash'], ['Shift', 'dash'], ['k', 'dash'], ['K', 'dash'],
  ['q', 'gun'], ['Q', 'gun'],
  ['h', 'heal'], ['H', 'heal'],
  ['f', 'transform'], ['F', 'transform'],
]);

const NIGHT_TAP_INPUTS = new Set(['attack', 'dash', 'cast', 'gun', 'heal', 'transform']);
const NIGHT_INPUT_BUFFER_MS = 145;

function makeInputState() {
  return {
    up: false,
    down: false,
    left: false,
    right: false,
    attack: false,
    dash: false,
    cast: false,
    gun: false,
    heal: false,
    transform: false,
    tapUntil: {},
  };
}

function setBufferedInput(input, name, pressed) {
  if (pressed) {
    input[name] = true;
    if (NIGHT_TAP_INPUTS.has(name)) input.tapUntil[name] = performance.now() + NIGHT_INPUT_BUFFER_MS;
    return;
  }
  if (NIGHT_TAP_INPUTS.has(name) && input.tapUntil[name] > performance.now()) return;
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

function makeRuneSet(taskIndex, anchorX = WORLD_W / 2, anchorY = WORLD_H / 2 + 160) {
  const task = LEARN_TASKS[taskIndex % LEARN_TASKS.length];
  const base = [
    { x: anchorX - 190, y: anchorY - 120 },
    { x: anchorX + 190, y: anchorY - 120 },
    { x: anchorX, y: anchorY + 132 },
  ];
  return task.options.map((label, index) => ({
    id: `${taskIndex}-${label}`,
    label,
    correct: label === task.answer,
    x: clamp(base[index].x + (taskIndex % 2) * 34, 120, WORLD_W - 120),
    y: clamp(base[index].y - (taskIndex % 3) * 18, 132, WORLD_H - 132),
    r: 42,
    pulse: index * 0.7,
  }));
}

function createStats() {
  return {
    kills: 0,
    bosses: 0,
    wavesCleared: 0,
    perfectDodges: 0,
    pistolParries: 0,
    viscerals: 0,
    focusCasts: 0,
    trickHits: 0,
    bloodSurges: 0,
    learnCorrect: 0,
    rallyHeal: 0,
  };
}

function createGoals(mode) {
  return NIGHT_HUNT_GOALS
    .filter((goal) => goal.mode === 'both' || goal.mode === mode)
    .map((goal) => ({ ...goal, progress: 0, done: false }));
}

function spawnParticles(game, x, y, color, count = 10, speed = 180) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed * 0.7;
    const burst = speed * (0.55 + (i % 5) * 0.13);
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * burst,
      vy: Math.sin(angle) * burst,
      life: 0.42 + (i % 4) * 0.08,
      maxLife: 0.68,
      size: 4 + (i % 3) * 2,
      color,
    });
  }
}

function addText(game, x, y, text, color = '#facc15') {
  game.floaters.push({
    x,
    y,
    text,
    color,
    life: 0.85,
    vy: -42,
  });
}

function recordStat(game, stat, amount = 1) {
  if (!game.stats || !game.goals) return;
  game.stats[stat] = (game.stats[stat] || 0) + amount;
  game.goals.forEach((goal) => {
    if (goal.stat !== stat || goal.done) return;
    goal.progress = Math.min(goal.target, Math.floor(game.stats[stat] || 0));
    if (goal.progress < goal.target) return;
    goal.done = true;
    game.score += goal.reward;
    game.missionNotice = `${goal.label} +${goal.reward}`;
    game.missionNoticeTimer = 2.4;
    game.message = 'Jagd-Ziel abgeschlossen';
    game.messageTimer = 1.25;
    addText(game, game.player.x, game.player.y - 50, `Ziel +${goal.reward}`, '#facc15');
    spawnParticles(game, game.player.x, game.player.y, '#facc15', 22, 260);
  });
}

function addBloodFever(game, amount) {
  const player = game.player;
  const before = player.bloodFever || 0;
  player.bloodFever = clamp(before + amount, 0, 100);
  if (player.bloodFever >= 80 && !player.feverPrimed) {
    player.feverPrimed = true;
    recordStat(game, 'bloodSurges');
    game.message = 'Blutfieber';
    game.messageTimer = 0.88;
    addText(game, player.x, player.y - 46, 'BLUTFIEBER', '#fb7185');
    spawnParticles(game, player.x, player.y, '#fb7185', 24, 300);
  }
  if (player.bloodFever < 52) player.feverPrimed = false;
}

function makeEnemy(type, x, y, wave) {
  const scale = 1 + wave * 0.08;
  const profiles = {
    blade: { hp: 72, speed: 116, r: 20, score: 120, color: '#fb7185', cooldown: 0.9 },
    archer: { hp: 54, speed: 86, r: 18, score: 145, color: '#38bdf8', cooldown: 1.45 },
    brute: { hp: 132, speed: 72, r: 27, score: 220, color: '#f97316', cooldown: 1.7 },
    boss: { hp: 760, speed: 78, r: 44, score: 1500, color: '#a78bfa', cooldown: 1.1 },
  };
  const profile = profiles[type];
  return {
    id: `${type}-${Date.now()}-${Math.floor(x)}-${Math.floor(y)}-${Math.random().toString(16).slice(2)}`,
    type,
    x,
    y,
    vx: 0,
    vy: 0,
    dirX: -1,
    dirY: 0,
    r: profile.r,
    hp: Math.round(profile.hp * scale),
    maxHp: Math.round(profile.hp * scale),
    speed: profile.speed,
    score: profile.score,
    color: profile.color,
    attackTimer: 0.55 + (x % 120) / 120,
    chargeTimer: 0,
    chargeCooldown: 1.2,
    cooldown: profile.cooldown,
    stun: 0,
    hitFlash: 0,
    parryWindow: 0,
    visceralWindow: 0,
    phase: 1,
  };
}

function spawnAtEdge(index, total) {
  const side = index % 4;
  const spread = (index + 1) / (total + 1);
  if (side === 0) return { x: 120 + spread * (WORLD_W - 240), y: 96 };
  if (side === 1) return { x: WORLD_W - 110, y: 130 + spread * (WORLD_H - 260) };
  if (side === 2) return { x: 120 + spread * (WORLD_W - 240), y: WORLD_H - 96 };
  return { x: 110, y: 130 + spread * (WORLD_H - 260) };
}

function spawnWave(game) {
  game.wave += 1;
  game.waveClearRecorded = false;
  const bossWave = game.wave % 4 === 0;
  if (bossWave) {
    game.enemies.push(makeEnemy('boss', WORLD_W / 2, 210, game.wave));
    game.message = `Boss-Welle ${game.wave}`;
    game.messageTimer = 1.25;
    spawnParticles(game, WORLD_W / 2, 210, '#a78bfa', 26, 260);
    return;
  }

  const count = clamp(3 + game.wave, 4, 9);
  const pattern = ['blade', 'archer', 'blade', 'brute', 'archer', 'blade', 'brute', 'blade', 'archer'];
  for (let i = 0; i < count; i += 1) {
    const pos = spawnAtEdge(i, count);
    game.enemies.push(makeEnemy(pattern[(i + game.wave) % pattern.length], pos.x, pos.y, game.wave));
  }
  game.message = `Welle ${game.wave}`;
  game.messageTimer = 0.9;
}

function makeInitialGame(mode = 'arcade') {
  const game = {
    mode,
    elapsed: 0,
    phase: 'play',
    score: 0,
    wave: 0,
    combo: 0,
    taskIndex: 0,
    runeCooldown: 0,
    nextWaveDelay: 0,
    waveClearRecorded: false,
    hitStop: 0,
    shake: 0,
    missionNotice: '',
    missionNoticeTimer: 0,
    stats: createStats(),
    goals: createGoals(mode),
    message: mode === 'learn' ? 'Beruehre die richtige Lernrune fuer Kampfboni.' : 'Ueberlebe Wellen, dashen, schlagen und zaubern.',
    messageTimer: 2,
    player: {
      x: WORLD_W / 2,
      y: WORLD_H / 2 + 210,
      r: PLAYER_R,
      vx: 0,
      vy: 0,
      hp: 160,
      maxHp: 160,
      stamina: 100,
      maxStamina: 100,
      focus: 0,
      bloodFever: 0,
      feverPrimed: false,
      bullets: 12,
      vials: 4,
      rallyPool: 0,
      rallyTimer: 0,
      xp: 0,
      nextXp: 180,
      level: 1,
      attackCooldown: 0,
      castCooldown: 0,
      gunCooldown: 0,
      healCooldown: 0,
      transformCooldown: 0,
      dashCooldown: 0,
      dashTimer: 0,
      invuln: 0,
      trickMode: 'blade',
      visceralFlash: 0,
      lastDirX: 1,
      lastDirY: 0,
      hurtFlash: 0,
    },
    camera: { x: 0, y: 0 },
    input: makeInputState(),
    mouse: { x: WORLD_W / 2 + 80, y: WORLD_H / 2, down: false, active: false },
    enemies: [],
    slashes: [],
    playerShots: [],
    enemyShots: [],
    particles: [],
    floaters: [],
    runes: mode === 'learn' ? makeRuneSet(0, WORLD_W / 2, WORLD_H / 2 + 210) : [],
    result: null,
  };
  spawnWave(game);
  return game;
}

function circleRectPush(entity, rect) {
  const cx = clamp(entity.x, rect.x, rect.x + rect.w);
  const cy = clamp(entity.y, rect.y, rect.y + rect.h);
  const dx = entity.x - cx;
  const dy = entity.y - cy;
  const d = len(dx, dy);
  const overlap = entity.r - d;
  if (overlap <= 0) return false;
  entity.x += (dx / d) * overlap;
  entity.y += (dy / d) * overlap;
  return true;
}

function collideWorld(entity) {
  entity.x = clamp(entity.x, 42 + entity.r, WORLD_W - 42 - entity.r);
  entity.y = clamp(entity.y, 42 + entity.r, WORLD_H - 42 - entity.r);
  ARENA_RECTS.forEach((rect) => circleRectPush(entity, rect));
}

function damagePlayer(game, amount, x, y, label = '') {
  const player = game.player;
  if (player.invuln > 0 || game.phase !== 'play') return;
  const feverPenalty = 1 + (player.bloodFever || 0) / 360;
  amount = Math.round(amount * feverPenalty);
  const before = player.hp;
  player.hp = Math.max(0, player.hp - amount);
  const taken = Math.max(0, before - player.hp);
  if (taken > 0) {
    player.rallyPool = Math.min(96, player.rallyPool + taken * 0.55);
    player.rallyTimer = 3.2;
  }
  player.invuln = 0.55;
  player.hurtFlash = 0.28;
  game.combo = 0;
  game.shake = 0.22;
  player.bloodFever = Math.max(0, (player.bloodFever || 0) - amount * 0.25);
  addText(game, player.x, player.y - 24, label || `-${amount}`, '#fb7185');
  spawnParticles(game, player.x, player.y, '#fb7185', 16, 220);
  const push = norm(player.x - x, player.y - y);
  player.x += push.x * 20;
  player.y += push.y * 20;
}

function gainXp(game, amount) {
  const player = game.player;
  player.xp += amount;
  if (player.xp < player.nextXp) return;
  player.xp -= player.nextXp;
  player.level += 1;
  player.nextXp = Math.round(player.nextXp * 1.32);
  player.maxHp += 14;
  player.maxStamina += 8;
  player.focus = Math.min(100, player.focus + 28);
  player.hp = Math.min(player.maxHp, player.hp + 42);
  player.stamina = player.maxStamina;
  game.message = `Level ${player.level}`;
  game.messageTimer = 1.1;
  spawnParticles(game, player.x, player.y, '#facc15', 26, 280);
}

function damageEnemy(game, enemy, amount, dirX, dirY, source = 'Hit') {
  if (enemy.hp <= 0) return;
  const player = game.player;
  const feverBonus = 1 + (player.bloodFever || 0) / 260;
  const finalAmount = Math.round(amount * feverBonus);
  enemy.hp -= finalAmount;
  enemy.vx += dirX * 220;
  enemy.vy += dirY * 220;
  enemy.stun = Math.max(enemy.stun, 0.16);
  enemy.hitFlash = 0.16;
  game.hitStop = HITSTOP_MAX;
  game.shake = Math.max(game.shake, enemy.type === 'boss' ? 0.16 : 0.08);
  addText(game, enemy.x, enemy.y - enemy.r - 8, `${source} ${finalAmount}`, '#fef3c7');
  spawnParticles(game, enemy.x, enemy.y, enemy.color, enemy.type === 'boss' ? 16 : 9, 190);
  player.focus = Math.min(100, player.focus + (enemy.type === 'boss' ? 7 : 4));
  addBloodFever(game, source === 'Visceral' ? 20 : source === 'Trick-Split' ? 14 : source === 'Peitsche' || source === 'Klinge' ? 7 : 4);
  if (player.rallyPool > 0 && player.rallyTimer > 0) {
    const heal = Math.min(player.rallyPool, finalAmount * 0.24, player.maxHp - player.hp);
    if (heal > 0) {
      player.hp += heal;
      player.rallyPool -= heal;
      recordStat(game, 'rallyHeal', heal);
      addText(game, player.x, player.y - 38, `Rally +${Math.round(heal)}`, '#86efac');
    }
  }
  if (enemy.hp <= 0) {
    enemy.hp = 0;
    game.score += Math.round(enemy.score * (1 + game.combo * 0.04));
    game.combo += 1;
    recordStat(game, 'kills');
    if (enemy.type === 'boss') recordStat(game, 'bosses');
    addBloodFever(game, enemy.type === 'boss' ? 18 : 8);
    gainXp(game, enemy.type === 'boss' ? 180 : 48);
    spawnParticles(game, enemy.x, enemy.y, '#facc15', enemy.type === 'boss' ? 34 : 18, 300);
  }
}

function consumeBloodVial(game) {
  const player = game.player;
  if (player.vials <= 0 || player.healCooldown > 0 || player.hp >= player.maxHp) return;
  player.vials -= 1;
  player.healCooldown = 1.35;
  const heal = Math.min(player.maxHp - player.hp, 52 + player.level * 4);
  player.hp += heal;
  player.rallyPool = 0;
  player.rallyTimer = 0;
  game.message = `Blutvial +${Math.round(heal)}`;
  game.messageTimer = 0.82;
  addText(game, player.x, player.y - 38, `+${Math.round(heal)}`, '#86efac');
  spawnParticles(game, player.x, player.y, '#86efac', 18, 230);
}

function toggleTrickWeapon(game) {
  const player = game.player;
  if (player.transformCooldown > 0 || player.stamina < 12) return;
  player.trickMode = player.trickMode === 'blade' ? 'cane' : 'blade';
  player.transformCooldown = 0.5;
  player.stamina = Math.max(0, player.stamina - 12);
  game.message = player.trickMode === 'blade' ? 'Saegeschwert' : 'Peitschenstock';
  game.messageTimer = 0.55;
  addBloodFever(game, 8);
  const trickCane = player.trickMode === 'cane';
  game.slashes.push({
    x: player.x,
    y: player.y,
    dirX: player.lastDirX,
    dirY: player.lastDirY,
    age: 0,
    duration: 0.28,
    range: trickCane ? 164 : 118,
    arc: trickCane ? 0.24 : 0.46,
    trickCane,
    transformStrike: true,
    hit: new Set(),
  });
  spawnParticles(game, player.x, player.y, player.trickMode === 'blade' ? '#e0f2fe' : '#c084fc', 12, 190);
}

function fireHunterPistol(game) {
  const player = game.player;
  if (player.gunCooldown > 0) return;
  if (player.bullets <= 0) {
    if (player.hp <= 28) return;
    player.hp = Math.max(1, player.hp - 16);
    player.rallyPool = Math.min(96, player.rallyPool + 12);
    player.rallyTimer = 3.2;
    player.bullets = 5;
    player.gunCooldown = 0.24;
    addBloodFever(game, 18);
    game.message = 'Blutkugeln';
    game.messageTimer = 0.72;
    addText(game, player.x, player.y - 38, '+Blutkugeln', '#fca5a5');
    spawnParticles(game, player.x, player.y, '#fb7185', 16, 230);
    return;
  }
  player.bullets -= 1;
  player.gunCooldown = 0.42;
  player.focus = Math.min(100, player.focus + 5);
  const originX = player.x + player.lastDirX * 28;
  const originY = player.y + player.lastDirY * 28;
  game.playerShots.push({
    x: originX,
    y: originY,
    vx: player.lastDirX * 920,
    vy: player.lastDirY * 920,
    life: 0.42,
    r: 7,
    damage: 18 + player.level * 2,
    pistol: true,
  });
  const aimEnemy = game.enemies
    .filter((enemy) => enemy.hp > 0)
    .map((enemy) => {
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const d = len(dx, dy);
      const forward = (dx / d) * player.lastDirX + (dy / d) * player.lastDirY;
      return { enemy, d, forward };
    })
    .filter(({ d, forward }) => d < 310 && forward > 0.78)
    .sort((a, b) => b.forward - a.forward || a.d - b.d)[0]?.enemy;
  if (aimEnemy?.parryWindow > 0) {
    aimEnemy.stun = Math.max(aimEnemy.stun, aimEnemy.type === 'boss' ? 0.7 : 1.25);
    aimEnemy.visceralWindow = aimEnemy.type === 'boss' ? 1.15 : 1.8;
    aimEnemy.attackTimer = Math.max(aimEnemy.attackTimer, 0.55);
    game.score += aimEnemy.type === 'boss' ? 180 : 120;
    recordStat(game, 'pistolParries');
    game.message = 'Pistolen-Parry!';
    game.messageTimer = 0.8;
    addText(game, aimEnemy.x, aimEnemy.y - aimEnemy.r - 26, 'PARRY', '#facc15');
    spawnParticles(game, aimEnemy.x, aimEnemy.y, '#facc15', 20, 260);
  } else {
    game.message = 'Pistole';
    game.messageTimer = 0.28;
  }
}

function tryVisceral(game) {
  const player = game.player;
  const target = game.enemies
    .filter((enemy) => enemy.hp > 0 && enemy.visceralWindow > 0)
    .map((enemy) => ({ enemy, d: len(enemy.x - player.x, enemy.y - player.y) }))
    .filter(({ d, enemy }) => d < enemy.r + PLAYER_R + 58)
    .sort((a, b) => a.d - b.d)[0]?.enemy;
  if (!target) return false;
  const dir = norm(target.x - player.x, target.y - player.y);
  const damage = target.type === 'boss' ? 150 + player.level * 8 : 140 + player.level * 12;
  target.visceralWindow = 0;
  player.visceralFlash = 0.38;
  player.invuln = Math.max(player.invuln, 0.35);
  player.focus = Math.min(100, player.focus + 22);
  player.bullets = Math.min(20, player.bullets + 1);
  game.combo += 2;
  game.score += 360 + game.combo * 24;
  recordStat(game, 'viscerals');
  damageEnemy(game, target, damage, dir.x, dir.y, 'Visceral');
  game.message = 'Visceral!';
  game.messageTimer = 0.92;
  spawnParticles(game, target.x, target.y, '#fef08a', 34, 360);
  return true;
}

function resolveRune(game, rune) {
  const task = LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
  game.runeCooldown = 0.75;
  if (rune.correct) {
    game.score += 480 + game.wave * 40;
    game.combo += 2;
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + 28);
    game.player.stamina = game.player.maxStamina;
    game.message = `${task.subject}: richtig - Kraftschub`;
    game.messageTimer = 1.15;
    addText(game, rune.x, rune.y - 44, task.answer, '#5eead4');
    spawnParticles(game, rune.x, rune.y, '#5eead4', 24, 260);
    game.taskIndex += 1;
    game.runes = makeRuneSet(game.taskIndex, game.player.x, game.player.y);
    recordStat(game, 'learnCorrect');
    game.enemies.forEach((enemy) => {
      const push = norm(enemy.x - rune.x, enemy.y - rune.y);
      damageEnemy(game, enemy, 18, push.x, push.y, 'Rune');
    });
  } else {
    game.combo = 0;
    game.player.stamina = Math.max(0, game.player.stamina - 28);
    damagePlayer(game, 10, rune.x, rune.y, 'falsch');
    game.message = `${rune.label} war falsch. Richtig: ${task.answer}`;
    game.messageTimer = 1.4;
    const pos = spawnAtEdge(game.enemies.length + 1, 5);
    game.enemies.push(makeEnemy('archer', pos.x, pos.y, game.wave));
    game.runes = makeRuneSet(game.taskIndex, game.player.x, game.player.y);
    spawnParticles(game, rune.x, rune.y, '#fb7185', 20, 260);
  }
}

function updatePlayer(game, dt) {
  const player = game.player;
  const input = game.input;
  const mx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const my = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  const move = norm(mx, my);
  const moving = Math.abs(mx) + Math.abs(my) > 0;
  if (moving) {
    player.lastDirX = move.x;
    player.lastDirY = move.y;
  }

  player.attackCooldown = Math.max(0, player.attackCooldown - dt);
  player.castCooldown = Math.max(0, player.castCooldown - dt);
  player.gunCooldown = Math.max(0, player.gunCooldown - dt);
  player.healCooldown = Math.max(0, player.healCooldown - dt);
  player.transformCooldown = Math.max(0, player.transformCooldown - dt);
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
  player.invuln = Math.max(0, player.invuln - dt);
  player.visceralFlash = Math.max(0, player.visceralFlash - dt);
  player.hurtFlash = Math.max(0, player.hurtFlash - dt);
  player.rallyTimer = Math.max(0, player.rallyTimer - dt);
  if (player.rallyTimer <= 0) player.rallyPool = Math.max(0, player.rallyPool - dt * 22);
  player.bloodFever = Math.max(0, (player.bloodFever || 0) - dt * (player.rallyTimer > 0 ? 3 : 7));
  if (player.bloodFever < 52) player.feverPrimed = false;
  player.stamina = Math.min(player.maxStamina, player.stamina + dt * 22);

  const aim = norm(game.mouse.x - player.x, game.mouse.y - player.y);
  if (game.mouse.active && Number.isFinite(aim.x)) {
    player.lastDirX = aim.x;
    player.lastDirY = aim.y;
  }

  if (input.dash && player.dashCooldown <= 0 && player.stamina >= 24) {
    const dashDir = moving ? move : norm(player.lastDirX, player.lastDirY);
    player.dashTimer = 0.17;
    player.dashCooldown = 0.48;
    player.invuln = 0.24;
    player.stamina -= 24;
    player.vx = dashDir.x * 780;
    player.vy = dashDir.y * 780;
    spawnParticles(game, player.x, player.y, '#67e8f9', 12, 210);
  }

  if (input.transform) {
    toggleTrickWeapon(game);
    input.transform = false;
    delete input.tapUntil.transform;
  }
  if (input.heal) {
    consumeBloodVial(game);
    input.heal = false;
    delete input.tapUntil.heal;
  }
  if (input.gun) {
    fireHunterPistol(game);
    input.gun = false;
    delete input.tapUntil.gun;
  }

  if (game.mouse.down || input.attack) {
    if (player.attackCooldown <= 0) {
      if (tryVisceral(game)) {
        player.attackCooldown = 0.56;
        return;
      }
      const trickCane = player.trickMode === 'cane';
      player.attackCooldown = 0.32;
      player.stamina = Math.max(0, player.stamina - (trickCane ? 11 : 7));
      game.slashes.push({
        x: player.x,
        y: player.y,
        dirX: player.lastDirX,
        dirY: player.lastDirY,
        age: 0,
        duration: trickCane ? 0.24 : 0.16,
        range: (trickCane ? 132 : 86) + player.level * 2,
        arc: trickCane ? 0.36 : 0.62,
        trickCane,
        hit: new Set(),
      });
      spawnParticles(game, player.x + player.lastDirX * 32, player.y + player.lastDirY * 32, trickCane ? '#c084fc' : '#e0f2fe', 7, 150);
    }
  }

  if (input.cast && player.castCooldown <= 0 && player.stamina >= 18) {
    const focusShot = player.focus >= 35;
    player.castCooldown = 0.55;
    player.stamina -= 18;
    if (focusShot) {
      player.focus -= 35;
      recordStat(game, 'focusCasts');
      spawnParticles(game, player.x, player.y, '#c084fc', 16, 240);
      addText(game, player.x, player.y - 30, 'Fokus', '#e9d5ff');
    }
    game.playerShots.push({
      x: player.x + player.lastDirX * 26,
      y: player.y + player.lastDirY * 26,
      vx: player.lastDirX * (focusShot ? 760 : 620),
      vy: player.lastDirY * (focusShot ? 760 : 620),
      life: focusShot ? 1.05 : 0.8,
      r: focusShot ? 15 : 9,
      damage: (focusShot ? 66 : 34) + player.level * (focusShot ? 4 : 3),
      focusShot,
    });
  }

  if (player.dashTimer > 0) {
    player.dashTimer -= dt;
    player.x += player.vx * dt;
    player.y += player.vy * dt;
    player.vx *= Math.pow(0.74, dt * 60);
    player.vy *= Math.pow(0.74, dt * 60);
  } else {
    const feverSpeed = 1 + (player.bloodFever || 0) / 520;
    const speed = (185 + player.level * 4) * feverSpeed;
    player.vx = lerp(player.vx, moving ? move.x * speed : 0, 0.22);
    player.vy = lerp(player.vy, moving ? move.y * speed : 0, 0.22);
    player.x += player.vx * dt;
    player.y += player.vy * dt;
  }
  collideWorld(player);
}

function updateSlashes(game, dt) {
  game.slashes.forEach((slash) => {
    slash.age += dt;
    if (!slash.bossSlash) {
      slash.x = game.player.x;
      slash.y = game.player.y;
    }
    if (slash.bossSlash) return;
    game.enemies.forEach((enemy) => {
      if (enemy.hp <= 0 || slash.hit.has(enemy.id)) return;
      const dx = enemy.x - slash.x;
      const dy = enemy.y - slash.y;
      const d = len(dx, dy);
      if (d > slash.range + enemy.r) return;
      const forward = (dx / d) * slash.dirX + (dy / d) * slash.dirY;
      if (forward < slash.arc) return;
      slash.hit.add(enemy.id);
      if (slash.transformStrike) {
        recordStat(game, 'trickHits');
        if (enemy.parryWindow > 0) {
          enemy.visceralWindow = Math.max(enemy.visceralWindow, enemy.type === 'boss' ? 1.05 : 1.65);
          enemy.stun = Math.max(enemy.stun, enemy.type === 'boss' ? 0.5 : 0.95);
          addText(game, enemy.x, enemy.y - enemy.r - 26, 'TRICK BREAK', '#fef08a');
          spawnParticles(game, enemy.x, enemy.y, '#fef08a', 14, 260);
        }
      }
      const baseDamage = slash.transformStrike
        ? 46 + game.player.level * 5
        : (slash.trickCane ? 24 : 31) + game.player.level * (slash.trickCane ? 3 : 4);
      damageEnemy(game, enemy, baseDamage, dx / d, dy / d, slash.transformStrike ? 'Trick-Split' : slash.trickCane ? 'Peitsche' : 'Klinge');
    });
  });
  game.slashes = game.slashes.filter((slash) => slash.age < slash.duration);
}

function updateProjectiles(game, dt) {
  game.playerShots.forEach((shot) => {
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.life -= dt;
    game.enemies.forEach((enemy) => {
      if (enemy.hp <= 0 || shot.life <= 0) return;
      const dx = enemy.x - shot.x;
      const dy = enemy.y - shot.y;
      const d = len(dx, dy);
      if (d < enemy.r + shot.r) {
        shot.life = 0;
        damageEnemy(game, enemy, shot.damage, dx / d, dy / d, shot.pistol ? 'Pistole' : 'Impuls');
      }
    });
  });
  game.playerShots = game.playerShots.filter((shot) => shot.life > 0 && shot.x > 0 && shot.y > 0 && shot.x < WORLD_W && shot.y < WORLD_H);

  game.enemyShots.forEach((shot) => {
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.life -= dt;
    const dx = game.player.x - shot.x;
    const dy = game.player.y - shot.y;
    const distance = len(dx, dy);
    if (distance < PLAYER_R + shot.r) {
      shot.life = 0;
      damagePlayer(game, shot.damage, shot.x, shot.y);
    } else if (game.player.dashTimer > 0 && !shot.evaded && distance < PLAYER_R + shot.r + 44) {
      shot.evaded = true;
      game.score += 90 + game.wave * 8;
      game.combo += 1;
      game.player.focus = Math.min(100, game.player.focus + 18);
      recordStat(game, 'perfectDodges');
      addText(game, game.player.x, game.player.y - 42, 'Perfect Dodge', '#67e8f9');
      spawnParticles(game, game.player.x, game.player.y, '#67e8f9', 12, 220);
    }
  });
  game.enemyShots = game.enemyShots.filter((shot) => shot.life > 0 && shot.x > 0 && shot.y > 0 && shot.x < WORLD_W && shot.y < WORLD_H);
}

function enemyShoot(game, enemy, count = 1) {
  const base = Math.atan2(game.player.y - enemy.y, game.player.x - enemy.x);
  for (let i = 0; i < count; i += 1) {
    const offset = count === 1 ? 0 : (i - (count - 1) / 2) * 0.26;
    const angle = base + offset;
    game.enemyShots.push({
      x: enemy.x + Math.cos(angle) * enemy.r,
      y: enemy.y + Math.sin(angle) * enemy.r,
      vx: Math.cos(angle) * (220 + game.wave * 9),
      vy: Math.sin(angle) * (220 + game.wave * 9),
      r: enemy.type === 'boss' ? 10 : 7,
      damage: enemy.type === 'boss' ? 18 : 12,
      life: 3,
      color: enemy.type === 'boss' ? '#c4b5fd' : '#38bdf8',
    });
  }
}

function updateEnemy(game, enemy, dt) {
  if (enemy.hp <= 0) return;
  enemy.attackTimer -= dt;
  enemy.chargeCooldown -= dt;
  enemy.stun = Math.max(0, enemy.stun - dt);
  enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
  enemy.parryWindow = Math.max(0, enemy.parryWindow - dt);
  enemy.visceralWindow = Math.max(0, enemy.visceralWindow - dt);
  const dx = game.player.x - enemy.x;
  const dy = game.player.y - enemy.y;
  const d = len(dx, dy);
  const dir = norm(dx, dy);
  enemy.dirX = dir.x;
  enemy.dirY = dir.y;

  let desiredX = 0;
  let desiredY = 0;
  if (enemy.type === 'archer') {
    if (d > 390) {
      desiredX = dir.x;
      desiredY = dir.y;
    } else if (d < 265) {
      desiredX = -dir.x;
      desiredY = -dir.y;
    }
    if (enemy.attackTimer <= 0) {
      enemy.attackTimer = enemy.cooldown;
      enemy.parryWindow = 0.16;
      enemyShoot(game, enemy);
    }
  } else if (enemy.type === 'brute') {
    if (enemy.chargeTimer > 0) {
      enemy.chargeTimer -= dt;
      enemy.parryWindow = Math.max(enemy.parryWindow, 0.12);
      desiredX = enemy.dirX * 2.8;
      desiredY = enemy.dirY * 2.8;
    } else {
      desiredX = dir.x;
      desiredY = dir.y;
      if (enemy.chargeCooldown <= 0 && d < 500) {
        enemy.chargeCooldown = 2.2;
        enemy.chargeTimer = 0.44;
        spawnParticles(game, enemy.x, enemy.y, '#f97316', 9, 180);
      }
    }
    if (d < enemy.r + PLAYER_R + 10) damagePlayer(game, 17, enemy.x, enemy.y, 'Stoß');
  } else if (enemy.type === 'boss') {
    desiredX = dir.x;
    desiredY = dir.y;
    if (enemy.phase === 1 && enemy.hp < enemy.maxHp * 0.52) {
      enemy.phase = 2;
      enemy.speed *= 1.18;
      enemy.cooldown *= 0.82;
      game.message = 'Nachtboss: Blutmond';
      game.messageTimer = 1.2;
      spawnParticles(game, enemy.x, enemy.y, '#c084fc', 34, 320);
      for (let i = 0; i < 3; i += 1) {
        const pos = spawnAtEdge(i + game.enemies.length, 6);
        game.enemies.push(makeEnemy(i % 2 === 0 ? 'blade' : 'archer', pos.x, pos.y, game.wave));
      }
    }
    if (enemy.attackTimer <= 0) {
      enemy.attackTimer = d < 150 ? (enemy.phase === 2 ? 0.62 : 0.8) : (enemy.phase === 2 ? 0.92 : 1.25);
      if (d < 160) {
        enemy.parryWindow = 0.22;
        game.slashes.push({
          x: enemy.x,
          y: enemy.y,
          dirX: dir.x,
          dirY: dir.y,
          age: 0,
          duration: 0.18,
          range: 110,
          arc: 0.35,
          bossSlash: true,
          hit: new Set(),
        });
        if (d < 118) damagePlayer(game, 24, enemy.x, enemy.y, 'Boss');
      } else {
        enemy.parryWindow = 0.18;
        enemyShoot(game, enemy, enemy.phase === 2 ? 6 : enemy.hp < enemy.maxHp * 0.45 ? 5 : 3);
      }
    }
  } else {
    desiredX = dir.x;
    desiredY = dir.y;
    if (d < enemy.r + PLAYER_R + 8 && enemy.attackTimer <= 0) {
      enemy.attackTimer = enemy.cooldown;
      enemy.parryWindow = 0.2;
      damagePlayer(game, 13, enemy.x, enemy.y, 'Treffer');
    }
  }

  const speed = enemy.speed * (enemy.stun > 0 ? 0.22 : 1);
  enemy.vx = lerp(enemy.vx, desiredX * speed, 0.12);
  enemy.vy = lerp(enemy.vy, desiredY * speed, 0.12);
  enemy.x += enemy.vx * dt;
  enemy.y += enemy.vy * dt;
  collideWorld(enemy);
}

function updateRunes(game, dt) {
  if (game.mode !== 'learn') return;
  game.runeCooldown = Math.max(0, game.runeCooldown - dt);
  if (game.runeCooldown > 0) return;
  const player = game.player;
  const rune = game.runes.find((candidate) => len(player.x - candidate.x, player.y - candidate.y) < PLAYER_R + candidate.r);
  if (rune) resolveRune(game, rune);
}

function updateCamera(game) {
  const targetX = clamp(game.player.x - WIDTH / 2, 0, WORLD_W - WIDTH);
  const targetY = clamp(game.player.y - HEIGHT / 2, 0, WORLD_H - HEIGHT);
  const shakeX = game.shake > 0 ? Math.sin(game.elapsed * 94) * game.shake * 18 : 0;
  const shakeY = game.shake > 0 ? Math.cos(game.elapsed * 71) * game.shake * 14 : 0;
  game.camera.x = lerp(game.camera.x, targetX + shakeX, 0.14);
  game.camera.y = lerp(game.camera.y, targetY + shakeY, 0.14);
}

function updateGame(game, dt, onFinish) {
  if (game.phase !== 'play') return;
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.missionNoticeTimer = Math.max(0, game.missionNoticeTimer - dt);
  game.shake = Math.max(0, game.shake - dt);
  if (game.hitStop > 0) {
    game.hitStop = Math.max(0, game.hitStop - dt);
    dt *= 0.22;
  }

  updatePlayer(game, dt);
  updateSlashes(game, dt);
  updateProjectiles(game, dt);
  game.enemies.forEach((enemy) => updateEnemy(game, enemy, dt));
  game.enemies = game.enemies.filter((enemy) => enemy.hp > 0);
  updateRunes(game, dt);

  if (game.enemies.length === 0) {
    if (!game.waveClearRecorded) {
      game.waveClearRecorded = true;
      game.score += 120 + game.wave * 25;
      game.player.focus = Math.min(100, game.player.focus + 14);
      recordStat(game, 'wavesCleared');
      addText(game, game.player.x, game.player.y - 44, 'Welle gereinigt', '#facc15');
      spawnParticles(game, game.player.x, game.player.y, '#facc15', 15, 220);
    }
    game.nextWaveDelay += dt;
    if (game.nextWaveDelay > 1.0) {
      game.nextWaveDelay = 0;
      spawnWave(game);
    }
  } else {
    game.nextWaveDelay = 0;
  }

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

  if (game.player.hp <= 0) {
    game.player.hp = 0;
    game.phase = 'result';
    game.result = { title: 'Jagd beendet', score: game.score, wave: game.wave };
    onFinish(game.result);
  }
  updateCamera(game);
}

function drawArena(ctx, game) {
  const cam = game.camera;
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bg.addColorStop(0, '#08111f');
  bg.addColorStop(0.5, '#10213b');
  bg.addColorStop(1, '#050712');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.translate(-cam.x, -cam.y);
  ctx.fillStyle = '#0b1728';
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  ctx.strokeStyle = 'rgba(148,163,184,.13)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= WORLD_W; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, WORLD_H);
    ctx.stroke();
  }
  for (let y = 0; y <= WORLD_H; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WORLD_W, y);
    ctx.stroke();
  }

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 7;
  drawRoundedRect(ctx, 32, 32, WORLD_W - 64, WORLD_H - 64, 28);
  ctx.stroke();

  ARENA_RECTS.forEach((rect) => {
    ctx.fillStyle = rect.tone;
    drawRoundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(226,232,240,.35)';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  const sigil = ctx.createRadialGradient(WORLD_W / 2, WORLD_H / 2, 20, WORLD_W / 2, WORLD_H / 2, 260);
  sigil.addColorStop(0, 'rgba(56,189,248,.22)');
  sigil.addColorStop(1, 'rgba(56,189,248,0)');
  ctx.fillStyle = sigil;
  ctx.beginPath();
  ctx.arc(WORLD_W / 2, WORLD_H / 2, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawRunes(ctx, game) {
  if (game.mode !== 'learn') return;
  ctx.save();
  ctx.translate(-game.camera.x, -game.camera.y);
  game.runes.forEach((rune) => {
    const pulse = Math.sin(game.elapsed * 4 + rune.pulse) * 0.12 + 1;
    ctx.save();
    ctx.shadowColor = rune.correct ? '#5eead4' : '#818cf8';
    ctx.shadowBlur = 22;
    ctx.fillStyle = rune.correct ? 'rgba(20,184,166,.86)' : 'rgba(79,70,229,.82)';
    ctx.beginPath();
    ctx.arc(rune.x, rune.y, rune.r * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 16px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(rune.label, rune.x, rune.y);
    ctx.restore();
  });
  ctx.restore();
}

function drawPlayer(ctx, game) {
  const player = game.player;
  ctx.save();
  ctx.translate(player.x - game.camera.x, player.y - game.camera.y);
  ctx.rotate(Math.atan2(player.lastDirY, player.lastDirX));
  ctx.shadowColor = player.visceralFlash > 0 ? '#fef08a' : player.invuln > 0 ? '#67e8f9' : player.trickMode === 'cane' ? '#c084fc' : '#22c55e';
  ctx.shadowBlur = player.visceralFlash > 0 ? 30 : player.invuln > 0 ? 20 : 10;
  ctx.fillStyle = player.hurtFlash > 0 ? '#fef2f2' : player.trickMode === 'cane' ? '#7c3aed' : '#16a34a';
  ctx.beginPath();
  ctx.moveTo(24, 0);
  ctx.lineTo(-16, -17);
  ctx.lineTo(-10, 0);
  ctx.lineTo(-16, 17);
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#bbf7d0';
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = player.trickMode === 'cane' ? 4 : 5;
  ctx.beginPath();
  ctx.moveTo(14, 0);
  ctx.lineTo(player.trickMode === 'cane' ? 58 : 42, 0);
  ctx.stroke();
  if (player.visceralFlash > 0) {
    ctx.strokeStyle = 'rgba(254,240,138,.85)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, 42 + player.visceralFlash * 44, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawEnemies(ctx, game) {
  ctx.save();
  ctx.translate(-game.camera.x, -game.camera.y);
  game.enemies.forEach((enemy) => {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.rotate(Math.atan2(enemy.dirY, enemy.dirX));
    ctx.shadowColor = enemy.color;
    ctx.shadowBlur = enemy.type === 'boss' ? 24 : 13;
    ctx.fillStyle = enemy.hitFlash > 0 ? '#f8fafc' : enemy.color;
    if (enemy.type === 'boss') {
      drawRoundedRect(ctx, -enemy.r, -enemy.r, enemy.r * 2, enemy.r * 2, 16);
      ctx.fill();
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(2, -10, 34, 20);
    } else if (enemy.type === 'brute') {
      drawRoundedRect(ctx, -enemy.r, -enemy.r, enemy.r * 2, enemy.r * 2, 8);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(enemy.r, 0);
      ctx.lineTo(-enemy.r * 0.7, -enemy.r * 0.8);
      ctx.lineTo(-enemy.r * 0.5, enemy.r * 0.8);
      ctx.closePath();
      ctx.fill();
    }
    if (enemy.parryWindow > 0) {
      ctx.strokeStyle = 'rgba(250,204,21,.86)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, enemy.r + 10, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (enemy.visceralWindow > 0) {
      ctx.strokeStyle = 'rgba(254,240,138,.95)';
      ctx.lineWidth = 6;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, enemy.r + 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#fef08a';
      ctx.font = '900 13px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VISCERAL', 0, -enemy.r - 28);
    }
    ctx.restore();

    const barW = enemy.type === 'boss' ? 94 : 48;
    ctx.fillStyle = 'rgba(2,6,23,.8)';
    drawRoundedRect(ctx, enemy.x - barW / 2, enemy.y - enemy.r - 18, barW, 7, 3);
    ctx.fill();
    ctx.fillStyle = enemy.type === 'boss' ? '#c4b5fd' : '#f87171';
    drawRoundedRect(ctx, enemy.x - barW / 2, enemy.y - enemy.r - 18, barW * (enemy.hp / enemy.maxHp), 7, 3);
    ctx.fill();
  });
  ctx.restore();
}

function drawProjectiles(ctx, game) {
  ctx.save();
  ctx.translate(-game.camera.x, -game.camera.y);
  game.playerShots.forEach((shot) => {
    ctx.fillStyle = shot.pistol ? '#fef08a' : shot.focusShot ? '#e9d5ff' : '#67e8f9';
    ctx.shadowColor = shot.pistol ? '#facc15' : shot.focusShot ? '#c084fc' : '#67e8f9';
    ctx.shadowBlur = shot.focusShot ? 28 : shot.pistol ? 22 : 18;
    ctx.beginPath();
    ctx.arc(shot.x, shot.y, shot.r, 0, Math.PI * 2);
    ctx.fill();
  });
  game.enemyShots.forEach((shot) => {
    ctx.fillStyle = shot.color;
    ctx.shadowColor = shot.color;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(shot.x, shot.y, shot.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawSlashes(ctx, game) {
  ctx.save();
  ctx.translate(-game.camera.x, -game.camera.y);
  game.slashes.forEach((slash) => {
    const alpha = 1 - slash.age / slash.duration;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = slash.bossSlash ? '#c4b5fd' : slash.transformStrike ? '#fef08a' : '#e0f2fe';
    ctx.shadowColor = slash.bossSlash ? '#a78bfa' : slash.transformStrike ? '#facc15' : '#67e8f9';
    ctx.shadowBlur = slash.transformStrike ? 28 : 20;
    ctx.lineWidth = slash.bossSlash ? 18 : slash.transformStrike ? 16 : 12;
    ctx.lineCap = 'round';
    const angle = Math.atan2(slash.dirY, slash.dirX);
    ctx.beginPath();
    ctx.arc(slash.x, slash.y, slash.range, angle - 0.72, angle + 0.72);
    ctx.stroke();
  });
  ctx.restore();
}

function drawParticles(ctx, game) {
  ctx.save();
  ctx.translate(-game.camera.x, -game.camera.y);
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
  ctx.restore();
}

function drawHudBar(ctx, x, y, w, h, pct, color, label) {
  const ratio = clamp(pct, 0, 1);
  ctx.fillStyle = '#1f2937';
  drawRoundedRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
  if (ratio > 0) {
    ctx.fillStyle = color;
    drawRoundedRect(ctx, x, y, Math.max(h, w * ratio), h, h / 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(248,250,252,.82)';
  ctx.font = '800 10px Outfit, sans-serif';
  ctx.fillText(label, x + 8, y + h - 2);
}

function drawHud(ctx, game) {
  const player = game.player;
  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,.8)';
  drawRoundedRect(ctx, 28, 24, 412, 204, 20);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 27px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Night Hunt Pro: Learncade' : 'Faska Night Hunt Pro', 54, 62);
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(`Welle ${game.wave} · Level ${player.level} · Score ${game.score}`, 54, 91);

  drawHudBar(ctx, 54, 108, 294, 12, player.hp / player.maxHp, '#fb7185', `HP ${Math.ceil(player.hp)}/${player.maxHp}`);
  drawHudBar(ctx, 54, 128, 294, 10, player.stamina / player.maxStamina, '#67e8f9', 'Ausdauer');
  drawHudBar(ctx, 54, 146, 294, 10, player.focus / 100, '#c084fc', 'Fokus');
  drawHudBar(ctx, 54, 164, 294, 10, player.rallyPool / 96, '#86efac', 'Rally');
  drawHudBar(ctx, 54, 182, 294, 10, player.bloodFever / 100, '#fb7185', 'Blutfieber');
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '800 12px Outfit, sans-serif';
  ctx.fillText(`${player.trickMode === 'cane' ? 'Peitschenstock' : 'Saegeschwert'} · Vials ${player.vials} · Kugeln ${player.bullets} · Pistole ${player.gunCooldown > 0 ? player.gunCooldown.toFixed(1) : 'bereit'}`, 54, 212);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, WIDTH - 386, 24, 358, 228, 20);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 24px Outfit, sans-serif';
  ctx.fillText(`${game.enemies.length} Gegner`, WIDTH - 54, 61);
  ctx.fillStyle = '#facc15';
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText(`Combo ${game.combo} · XP ${player.xp}/${player.nextXp}`, WIDTH - 54, 92);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText('Jagdziele', WIDTH - 342, 118);
  game.goals.slice(0, 7).forEach((goal, index) => {
    const y = 140 + index * 16;
    ctx.fillStyle = goal.done ? '#86efac' : '#e2e8f0';
    ctx.font = '800 11px Outfit, sans-serif';
    ctx.fillText(`${goal.done ? 'OK' : `${goal.progress}/${goal.target}`} ${goal.label}`, WIDTH - 342, y);
  });

  if (game.mode === 'learn') {
    const task = LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.82)';
    drawRoundedRect(ctx, WIDTH / 2 - 250, 118, 500, 70, 18);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 19px Outfit, sans-serif';
    ctx.fillText(task.prompt, WIDTH / 2, 146);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 13px Outfit, sans-serif';
    ctx.fillText(`${task.subject} - richtige Rune beruehren`, WIDTH / 2, 170);
  }

  if (game.missionNoticeTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(250,204,21,.92)';
    drawRoundedRect(ctx, WIDTH / 2 - 210, 42, 420, 42, 16);
    ctx.fill();
    ctx.fillStyle = '#111827';
    ctx.font = '900 17px Outfit, sans-serif';
    ctx.fillText(game.missionNotice, WIDTH / 2, 69);
  }

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.78)';
    drawRoundedRect(ctx, WIDTH / 2 - 310, HEIGHT - 94, 620, 54, 18);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 22px Outfit, sans-serif';
    ctx.fillText(game.message, WIDTH / 2, HEIGHT - 60);
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.74)';
  drawRoundedRect(ctx, 34, HEIGHT - 36, 1088, 28, 10);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 12px Outfit, sans-serif';
  ctx.fillText('WASD bewegen · Maus/J schlagen · Shift/Space rollen · Q Pistole/Blutkugeln · F Trick-Transform · H Vial · E/L Impuls · M Modus · R Restart', 54, HEIGHT - 17);
  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawArena(ctx, game);
  drawRunes(ctx, game);
  drawProjectiles(ctx, game);
  drawSlashes(ctx, game);
  drawEnemies(ctx, game);
  drawPlayer(ctx, game);
  drawParticles(ctx, game);
  drawHud(ctx, game);
}

export default function FaskaNightHuntSwarm() {
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
    setBufferedInput(gameRef.current.input, name, pressed);
  }, []);

  const buttonHold = useCallback((name) => ({
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

  const handleCanvasKeyDown = useCallback((event) => {
    const mapped = NIGHT_KEY_BINDINGS.get(event.key);
    if (mapped) {
      setBufferedInput(gameRef.current.input, mapped, true);
      event.preventDefault();
      event.stopPropagation();
      return;
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
    const mapped = NIGHT_KEY_BINDINGS.get(event.key);
    if (!mapped) return;
    setBufferedInput(gameRef.current.input, mapped, false);
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

    const updateMouse = (event) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = WIDTH / rect.width;
      const scaleY = HEIGHT / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;
      gameRef.current.mouse.x = x + gameRef.current.camera.x;
      gameRef.current.mouse.y = y + gameRef.current.camera.y;
      gameRef.current.mouse.active = true;
    };
    const keyDown = (event) => {
      const mapped = NIGHT_KEY_BINDINGS.get(event.key);
      if (mapped) {
        setBufferedInput(gameRef.current.input, mapped, true);
        event.preventDefault();
      }
      if (event.key === 'm' || event.key === 'M') setGameMode(modeRef.current === 'learn' ? 'arcade' : 'learn');
      if (event.key === 'r' || event.key === 'R') restart();
    };
    const keyUp = (event) => {
      const mapped = NIGHT_KEY_BINDINGS.get(event.key);
      if (mapped) {
        setBufferedInput(gameRef.current.input, mapped, false);
        event.preventDefault();
      }
    };
    const mouseDown = (event) => {
      updateMouse(event);
      gameRef.current.mouse.down = true;
    };
    const mouseUp = () => {
      gameRef.current.mouse.down = false;
    };
    const blur = () => {
      gameRef.current.input = makeInputState();
      gameRef.current.mouse.down = false;
    };
    const loop = (now) => {
      const dt = Math.min(0.024, (now - last) / 1000 || 0);
      last = now;
      expireBufferedInputs(gameRef.current.input, now);
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
    canvas.addEventListener('pointermove', updateMouse);
    canvas.addEventListener('pointerdown', mouseDown);
    window.addEventListener('pointerup', mouseUp);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      window.removeEventListener('blur', blur);
      canvas.removeEventListener('pointermove', updateMouse);
      canvas.removeEventListener('pointerdown', mouseDown);
      window.removeEventListener('pointerup', mouseUp);
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
        className="night-hunt-canvas"
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        tabIndex={0}
        aria-label="Faska Night Hunt Pro Spielfeld"
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

      <div className="hunt-modebar" style={{ position: 'fixed', top: chromeTop, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.56 }}>Normal</button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.56 }}>Learncade</button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      <div className="hunt-touch-controls" style={{
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
        <div className="hunt-stick-controls" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 58px)', gap: 7, pointerEvents: 'auto' }}>
          <span />
          <button style={touchButton} {...buttonHold('up')}>UP</button>
          <span />
          <button style={touchButton} {...buttonHold('left')}>LEFT</button>
          <button style={touchButton} {...buttonHold('down')}>DOWN</button>
          <button style={touchButton} {...buttonHold('right')}>RIGHT</button>
        </div>
        <div className="hunt-action-controls" style={{ display: 'flex', gap: 10, pointerEvents: 'auto' }}>
          <button style={{ ...touchButton, width: 86, background: 'rgba(34,197,94,.78)' }} {...buttonHold('attack')}>HIT</button>
          <button style={{ ...touchButton, width: 86, background: 'rgba(14,165,233,.78)' }} {...buttonHold('dash')}>DASH</button>
          <button style={{ ...touchButton, width: 86, background: 'rgba(250,204,21,.78)', color: '#111827' }} {...buttonHold('gun')}>GUN</button>
          <button style={{ ...touchButton, width: 86, background: 'rgba(192,132,252,.78)' }} {...buttonHold('transform')}>TRICK</button>
          <button style={{ ...touchButton, width: 86, background: 'rgba(134,239,172,.78)', color: '#052e16' }} {...buttonHold('heal')}>VIAL</button>
          <button style={{ ...touchButton, width: 86, background: 'rgba(168,85,247,.78)' }} {...buttonHold('cast')}>CAST</button>
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
          <button className="btn-primary" onClick={restart}>Neue Jagd</button>
        </div>
      )}

      <style>{`
        @media (max-width: 700px) and (orientation: portrait) {
          .night-hunt-canvas {
            width: 100vw !important;
            height: calc(100dvh - 228px) !important;
            top: 70px !important;
            bottom: auto !important;
            margin: 0 auto !important;
          }

          .hunt-modebar {
            top: 10px !important;
            transform: translateX(-50%) scale(.82) !important;
            transform-origin: top center !important;
          }

          .hunt-touch-controls {
            left: 2px !important;
            right: 4px !important;
            bottom: 14px !important;
            width: auto !important;
            transform: none !important;
            gap: 0 !important;
          }

          .hunt-action-controls {
            display: grid !important;
            grid-template-columns: repeat(3, 58px) !important;
            gap: 6px !important;
          }

          .hunt-stick-controls {
            transform: scale(.68) !important;
            transform-origin: bottom left !important;
          }

          .hunt-stick-controls button,
          .hunt-action-controls button {
            width: 58px !important;
            height: 50px !important;
            min-width: 0 !important;
            border-radius: 12px !important;
            font-size: 9px !important;
            padding: 0 !important;
          }
        }

        @media (pointer: fine), (min-width: 900px) {
          .hunt-touch-controls {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
