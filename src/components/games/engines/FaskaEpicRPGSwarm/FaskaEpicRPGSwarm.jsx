import { useCallback, useEffect, useRef, useState } from 'react';

const WIDTH = 1280;
const HEIGHT = 720;
const WORLD_WIDTH = 1920;
const WORLD_HEIGHT = 1280;
const STORAGE_KEY = 'faska-bruno-luna-quest-highscore';

const HEROES = {
  luna: {
    name: 'Luna',
    color: '#a78bfa',
    accent: '#f0abfc',
    speed: 276,
    maxHp: 88,
    damage: 15,
    range: 360,
    cooldown: 0.34,
    type: 'ranged',
  },
  bruno: {
    name: 'Bruno',
    color: '#f59e0b',
    accent: '#fde68a',
    speed: 230,
    maxHp: 122,
    damage: 28,
    range: 82,
    cooldown: 0.48,
    type: 'melee',
  },
};

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    prompt: 'Welche Wortart ist "mutig"?',
    choices: ['Nomen', 'Verb', 'Adjektiv'],
    correct: 'Adjektiv',
  },
  {
    subject: 'Mathe',
    kind: 'Kopfrechnen',
    prompt: '6 x 4 = ?',
    choices: ['20', '24', '28'],
    correct: '24',
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    prompt: 'Was heisst "Wald"?',
    choices: ['forest', 'river', 'mountain'],
    correct: 'forest',
  },
  {
    subject: 'Lesen',
    kind: 'Silben',
    prompt: 'Welche Trennung passt zu "Abenteuer"?',
    choices: ['A-ben-teu-er', 'Ab-ent-euer', 'Abe-nteu-er'],
    correct: 'A-ben-teu-er',
  },
  {
    subject: 'Sachkunde',
    kind: 'Natur',
    prompt: 'Was brauchen Pflanzen zum Wachsen?',
    choices: ['Licht', 'Stein', 'Sand allein'],
    correct: 'Licht',
  },
  {
    subject: 'Deutsch',
    kind: 'Satzglied',
    prompt: 'Wer handelt in "Luna schuetzt Bruno"?',
    choices: ['Luna', 'schuetzt', 'Bruno'],
    correct: 'Luna',
  },
  {
    subject: 'Mathe',
    kind: 'Kopfrechnen',
    prompt: '45 + 27 = ?',
    choices: ['62', '72', '82'],
    correct: '72',
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    prompt: 'Was heisst "courage"?',
    choices: ['Mut', 'Wolke', 'Schloss'],
    correct: 'Mut',
  },
];

const SHRINES = [
  { id: 's1', x: 520, y: 920, color: '#38bdf8' },
  { id: 's2', x: 960, y: 770, color: '#a78bfa' },
  { id: 's3', x: 1320, y: 980, color: '#facc15' },
  { id: 's4', x: 1485, y: 470, color: '#22c55e' },
  { id: 's5', x: 820, y: 340, color: '#f97316' },
];

const OBSTACLES = [
  { kind: 'tree', x: 260, y: 290, r: 48 },
  { kind: 'tree', x: 420, y: 720, r: 42 },
  { kind: 'tree', x: 1510, y: 820, r: 46 },
  { kind: 'tree', x: 1690, y: 300, r: 50 },
  { kind: 'rock', x: 710, y: 655, r: 36 },
  { kind: 'rock', x: 1110, y: 450, r: 38 },
  { kind: 'rock', x: 1215, y: 1090, r: 42 },
  { kind: 'crate', x: 585, y: 1080, r: 32 },
  { kind: 'crate', x: 1370, y: 650, r: 32 },
  { kind: 'crate', x: 1010, y: 220, r: 30 },
  { kind: 'pond', x: 300, y: 1040, r: 62 },
  { kind: 'pond', x: 1610, y: 1040, r: 76 },
];

const PICKUP_SPOTS = [
  { x: 420, y: 1010, type: 'crystal' },
  { x: 760, y: 940, type: 'coin' },
  { x: 1090, y: 960, type: 'crystal' },
  { x: 1520, y: 980, type: 'heart' },
  { x: 1560, y: 585, type: 'coin' },
  { x: 1190, y: 360, type: 'crystal' },
  { x: 760, y: 500, type: 'coin' },
  { x: 500, y: 420, type: 'heart' },
  { x: 1695, y: 430, type: 'crystal' },
  { x: 930, y: 1120, type: 'coin' },
];

const RELICS = [
  { id: 'moon-bow', x: 690, y: 990, type: 'luna', label: 'Mondbogen', color: '#c4b5fd' },
  { id: 'sun-hammer', x: 1280, y: 715, type: 'bruno', label: 'Sonnenhammer', color: '#fde68a' },
  { id: 'forest-heart', x: 1645, y: 545, type: 'shared', label: 'Waldherz', color: '#86efac' },
];

const MISSION_GOALS = [
  { id: 'crystals-4', label: '4 Kristalle sichern', stat: 'crystals', target: 4, reward: 500 },
  { id: 'relics-3', label: '3 Relikte finden', stat: 'relics', target: 3, reward: 760 },
  { id: 'specials-3', label: '3 Spezialfaehigkeiten', stat: 'specials', target: 3, reward: 680 },
  { id: 'boss-phases', label: '2 Boss-Phasen brechen', stat: 'bossPhases', target: 2, reward: 900 },
  { id: 'shrines-5', label: '5 Lern-Schreine', stat: 'shrines', target: 5, reward: 1000, learnOnly: true },
];

const ACTIVE_CONTRACTS = [
  { id: 'hero-switches', label: '4 Bruno/Luna-Wechsel', stat: 'heroSwitches', target: 4, time: 38, reward: { score: 520, energy: 24 } },
  { id: 'dash-flow', label: '5 Dashes ausfuehren', stat: 'dashes', target: 5, time: 42, reward: { score: 620, energy: 20 } },
  { id: 'moon-hits', label: '5 Luna-Treffer landen', stat: 'projectileHits', target: 5, time: 46, reward: { score: 720, energy: 28 } },
  { id: 'bruno-combo', label: '3 Bruno-Nahkampf-Treffer', stat: 'meleeHits', target: 3, time: 45, reward: { score: 680, hp: 18 } },
  { id: 'enemy-clear', label: '3 Gegner besiegen', stat: 'defeats', target: 3, time: 58, reward: { score: 840, hp: 22, energy: 18 } },
  { id: 'special-burst', label: '2 Spezialfaehigkeiten', stat: 'specials', target: 2, time: 56, reward: { score: 780, energy: 34 } },
  { id: 'crystal-route', label: '2 Kristalle sichern', stat: 'crystals', target: 2, time: 62, reward: { score: 640, hp: 18 } },
  { id: 'coin-route', label: '3 Muenzen sammeln', stat: 'coins', target: 3, time: 58, reward: { score: 560, energy: 18 } },
  { id: 'relic-scout', label: '1 Relikt bergen', stat: 'relics', target: 1, time: 70, reward: { score: 900, energy: 36, potions: 1 } },
  { id: 'boss-break', label: '1 Boss-Phase brechen', stat: 'bossPhases', target: 1, time: 76, reward: { score: 1050, hp: 28, energy: 40 } },
  { id: 'learn-shrines', label: '3 Schreine loesen', stat: 'shrines', target: 3, time: 82, reward: { score: 1100, hp: 28, energy: 36 }, mode: 'learn' },
];

const ENEMY_TEMPLATES = {
  slime: { hp: 32, damage: 8, speed: 78, r: 22, color: '#22c55e', xp: 18, score: 80 },
  bat: { hp: 24, damage: 10, speed: 132, r: 18, color: '#8b5cf6', xp: 22, score: 100 },
  guard: { hp: 55, damage: 14, speed: 86, r: 25, color: '#64748b', xp: 35, score: 150 },
  boss: { hp: 260, damage: 22, speed: 62, r: 44, color: '#ef4444', xp: 150, score: 900 },
};

const ENEMY_SPAWNS = [
  { type: 'slime', x: 740, y: 840 },
  { type: 'slime', x: 820, y: 1070 },
  { type: 'bat', x: 1060, y: 840 },
  { type: 'guard', x: 1330, y: 820 },
  { type: 'bat', x: 1480, y: 560 },
  { type: 'slime', x: 910, y: 420 },
  { type: 'guard', x: 600, y: 360 },
  { type: 'boss', x: 1580, y: 260 },
];

const buttonBase = {
  border: '1px solid rgba(255,255,255,.22)',
  borderRadius: 13,
  padding: '11px 20px',
  color: '#f8fafc',
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 900,
  cursor: 'pointer',
  boxShadow: '0 14px 30px rgba(0,0,0,.25)',
  backdropFilter: 'blur(12px)',
};

const touchButton = {
  width: 64,
  height: 54,
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,.2)',
  background: 'rgba(15,23,42,.78)',
  color: '#f8fafc',
  fontSize: 13,
  fontWeight: 900,
  touchAction: 'none',
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const angleTo = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);

function readHighScore() {
  const value = Number(localStorage.getItem(STORAGE_KEY) || 0);
  return Number.isFinite(value) ? value : 0;
}

function seededUnit(index, salt) {
  const value = Math.sin(index * 17.719 + salt * 71.533) * 23457.991;
  return value - Math.floor(value);
}

function currentHero(game) {
  return HEROES[game.player.hero];
}

function currentTask(game) {
  return LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
}

function hasRelic(game, id) {
  return game.relics.some((relic) => relic.id === id && relic.taken);
}

function makeEnemies() {
  return ENEMY_SPAWNS.map((spawn, index) => {
    const template = ENEMY_TEMPLATES[spawn.type];
    return {
      id: `enemy-${index}`,
      ...template,
      type: spawn.type,
      x: spawn.x,
      y: spawn.y,
      maxHp: template.hp,
      vx: 0,
      vy: 0,
      attackCd: 0.6 + seededUnit(index, 2),
      hit: 0,
      alive: true,
      phase: seededUnit(index, 4) * Math.PI * 2,
    };
  });
}

function makePickups() {
  return PICKUP_SPOTS.map((spot, index) => ({
    id: `pickup-${index}`,
    ...spot,
    taken: false,
    pulse: seededUnit(index, 8) * Math.PI * 2,
  }));
}

function makeShrines() {
  return SHRINES.map((shrine, index) => ({
    ...shrine,
    solved: false,
    index,
  }));
}

function createStats() {
  return {
    crystals: 0,
    relics: 0,
    specials: 0,
    bossPhases: 0,
    shrines: 0,
    coins: 0,
    hearts: 0,
    defeats: 0,
    bossKills: 0,
    heroSwitches: 0,
    dashes: 0,
    potions: 0,
    meleeHits: 0,
    projectileHits: 0,
  };
}

function createGoals(mode) {
  return MISSION_GOALS
    .filter((goal) => mode === 'learn' || !goal.learnOnly)
    .map((goal) => ({ ...goal, done: false }));
}

function availableContracts(mode) {
  return ACTIVE_CONTRACTS.filter((contract) => !contract.mode || contract.mode === mode);
}

function applyContractReward(game, reward) {
  const player = game.player;
  game.score += reward.score || 0;
  if (reward.hp) player.hp = clamp(player.hp + reward.hp, 0, player.maxHp);
  if (reward.energy) player.energy = clamp(player.energy + reward.energy, 0, 100);
  if (reward.potions) player.potions = clamp(player.potions + reward.potions, 0, 5);
}

function startNextContract(game) {
  const pool = availableContracts(game.mode);
  if (pool.length === 0) return;
  const contract = pool[game.contractIndex % pool.length];
  game.contractIndex += 1;
  game.contract = { ...contract };
  game.contractProgress = 0;
  game.contractTimer = contract.time;
  game.message = `Zeitauftrag: ${contract.label}`;
  game.messageTimer = 1.35;
  addFloating(game, 'AUFTRAG', game.player.x, game.player.y - 62, '#facc15');
}

function completeContract(game) {
  const contract = game.contract;
  if (!contract) return;
  applyContractReward(game, contract.reward);
  game.contractMedals += 1;
  game.message = `Auftrag geschafft +${contract.reward.score || 0}`;
  game.messageTimer = 1.35;
  addFloating(game, 'ZEITBONUS', game.player.x, game.player.y - 68, '#fde68a');
  addBurst(game, game.player.x, game.player.y, '#fde68a', 20);
  game.contract = null;
  game.contractProgress = 0;
  game.contractTimer = 0;
  game.contractCooldown = 3.2;
}

function failContract(game) {
  const contract = game.contract;
  if (!contract) return;
  game.contractFails += 1;
  game.message = `Auftrag verpasst: ${contract.label}`;
  game.messageTimer = 1.2;
  addFloating(game, 'ZEIT ABGELAUFEN', game.player.x, game.player.y - 62, '#fb7185');
  game.contract = null;
  game.contractProgress = 0;
  game.contractTimer = 0;
  game.contractCooldown = 2.4;
}

function progressContract(game, stat, amount = 1) {
  if (!game.started || game.finished || !game.contract || game.contract.stat !== stat) return;
  game.contractProgress = Math.min(game.contract.target, game.contractProgress + amount);
  if (game.contractProgress >= game.contract.target) completeContract(game);
}

function updateContract(game, dt) {
  if (!game.started || game.finished) return;
  if (!game.contract) {
    game.contractCooldown = Math.max(0, game.contractCooldown - dt);
    if (game.contractCooldown <= 0) startNextContract(game);
    return;
  }
  game.contractTimer = Math.max(0, game.contractTimer - dt);
  if (game.contractTimer <= 0) failContract(game);
}

function recordStat(game, stat, amount = 1) {
  game.stats[stat] = (game.stats[stat] || 0) + amount;
  progressContract(game, stat, amount);
  const completed = game.goals.find((goal) => !goal.done && goal.stat === stat && game.stats[stat] >= goal.target);
  if (!completed) return;
  completed.done = true;
  game.score += completed.reward;
  game.message = `${completed.label} +${completed.reward}`;
  game.messageTimer = 1.45;
  addFloating(game, 'MISSION', game.player.x, game.player.y - 60, '#5eead4');
  addBurst(game, game.player.x, game.player.y, '#5eead4', 22);
}

function makeInitialGame(mode = 'arcade') {
  return {
    mode,
    started: false,
    finished: false,
    elapsed: 0,
    message: mode === 'learn' ? 'Loese Schreine, finde Relikte und kaempfe dich vor.' : 'Sammle Kristalle, Relikte und besiege den Boss.',
    messageTimer: 1.8,
    shake: 0,
    score: 0,
    highScore: readHighScore(),
    stats: createStats(),
    goals: createGoals(mode),
    contract: null,
    contractIndex: 0,
    contractProgress: 0,
    contractTimer: 0,
    contractCooldown: 1.4,
    contractMedals: 0,
    contractFails: 0,
    player: {
      x: 405,
      y: 940,
      vx: 0,
      vy: 0,
      r: 22,
      hero: 'luna',
      hp: HEROES.luna.maxHp,
      maxHp: HEROES.luna.maxHp,
      level: 1,
      xp: 0,
      nextXp: 80,
      coins: 0,
      crystals: 0,
      potions: 2,
      facing: -0.35,
      attackCd: 0,
      dashCd: 0,
      itemCd: 0,
      specialCd: 0,
      energy: 55,
      invulnerable: 0,
      attackFlash: 0,
      specialFlash: 0,
    },
    quest: {
      crystalsTarget: mode === 'learn' ? 0 : 4,
      enemiesTarget: mode === 'learn' ? 5 : 7,
      shrinesTarget: mode === 'learn' ? SHRINES.length : 0,
    },
    enemies: makeEnemies(),
    pickups: makePickups(),
    relics: RELICS.map((relic) => ({ ...relic, taken: false, pulse: seededUnit(relic.x, relic.y) * Math.PI * 2 })),
    shrines: makeShrines(),
    answers: [],
    currentShrine: 0,
    taskIndex: 0,
    correct: 0,
    wrong: 0,
    defeated: 0,
    projectiles: [],
    hostileProjectiles: [],
    particles: [],
  };
}

function getCamera(game) {
  return {
    x: clamp(game.player.x - WIDTH / 2, 0, WORLD_WIDTH - WIDTH),
    y: clamp(game.player.y - HEIGHT / 2, 0, WORLD_HEIGHT - HEIGHT),
  };
}

function toScreen(point, camera) {
  return { x: point.x - camera.x, y: point.y - camera.y };
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function spawnAnswers(game) {
  if (game.mode !== 'learn' || game.currentShrine >= game.shrines.length) return;
  const shrine = game.shrines[game.currentShrine];
  const task = currentTask(game);
  const angles = [-0.85, 0.05, 0.95];
  game.answers = task.choices.map((choice, index) => ({
    id: `${shrine.id}-${game.taskIndex}-${choice}`,
    x: shrine.x + Math.cos(angles[index]) * 112,
    y: shrine.y + Math.sin(angles[index]) * 88,
    label: choice,
    correct: choice === task.correct,
    taken: false,
  }));
}

function addFloating(game, text, x, y, color = '#f8fafc') {
  game.particles.push({
    kind: 'text',
    text,
    x,
    y,
    vx: 0,
    vy: -46,
    life: 1.1,
    maxLife: 1.1,
    color,
  });
}

function addBurst(game, x, y, color, amount = 14) {
  for (let i = 0; i < amount; i += 1) {
    const angle = seededUnit(game.elapsed * 100 + i, 4) * Math.PI * 2;
    const speed = 50 + seededUnit(game.elapsed * 100 + i, 9) * 145;
    game.particles.push({
      kind: 'spark',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.55,
      maxLife: 0.55,
      color,
      size: 2.5 + seededUnit(i, 5) * 5,
    });
  }
}

function updateParticles(game, dt) {
  for (const particle of game.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
  }
  game.particles = game.particles.filter((particle) => particle.life > 0);
}

function damagePlayer(game, amount, text = 'Treffer') {
  const player = game.player;
  if (player.invulnerable > 0 || game.finished) return;
  player.hp = Math.max(0, player.hp - amount);
  player.invulnerable = 0.7;
  game.shake = Math.max(game.shake, 0.28);
  game.message = text;
  game.messageTimer = 0.85;
  addBurst(game, player.x, player.y, '#fb7185', 10);
  if (player.hp <= 0) {
    game.finished = true;
    game.message = 'Bruno und Luna brauchen eine Pause. Restart druecken.';
    game.messageTimer = 4;
  }
}

function gainXp(game, amount) {
  const player = game.player;
  player.xp += amount;
  while (player.xp >= player.nextXp) {
    player.xp -= player.nextXp;
    player.level += 1;
    player.nextXp = Math.floor(player.nextXp * 1.45);
    player.maxHp += 16;
    player.hp = player.maxHp;
    addFloating(game, `LEVEL ${player.level}`, player.x, player.y - 44, '#facc15');
    addBurst(game, player.x, player.y, '#facc15', 18);
  }
}

function defeatEnemy(game, enemy) {
  enemy.alive = false;
  game.defeated += 1;
  game.score += enemy.score;
  recordStat(game, 'defeats');
  gainXp(game, enemy.xp);
  addFloating(game, `+${enemy.score}`, enemy.x, enemy.y, '#facc15');
  addBurst(game, enemy.x, enemy.y, enemy.color, enemy.type === 'boss' ? 34 : 16);
  if (enemy.type === 'boss') {
    recordStat(game, 'bossKills');
    game.score += 600;
    maybeFinishGame(game);
  }
}

function spawnBossMinions(game, boss, phase) {
  const count = phase + 1;
  for (let i = 0; i < count; i += 1) {
    const type = i % 2 === 0 ? 'bat' : 'slime';
    const template = ENEMY_TEMPLATES[type];
    const angle = (Math.PI * 2 * i) / count + game.elapsed;
    game.enemies.push({
      id: `boss-minion-${phase}-${i}-${Math.round(game.elapsed * 1000)}`,
      ...template,
      type,
      x: clamp(boss.x + Math.cos(angle) * 95, 60, WORLD_WIDTH - 60),
      y: clamp(boss.y + Math.sin(angle) * 95, 60, WORLD_HEIGHT - 60),
      maxHp: template.hp,
      vx: Math.cos(angle) * 90,
      vy: Math.sin(angle) * 90,
      attackCd: 0.9,
      hit: 0,
      alive: true,
      phase: angle,
    });
  }
  addBurst(game, boss.x, boss.y, '#fb7185', 22);
}

function damageEnemy(game, enemy, amount, sourceAngle = 0) {
  if (!enemy.alive) return;
  const previousHp = enemy.hp;
  enemy.hp -= amount;
  enemy.hit = 0.18;
  enemy.vx += Math.cos(sourceAngle) * 120;
  enemy.vy += Math.sin(sourceAngle) * 120;
  addFloating(game, String(Math.round(amount)), enemy.x, enemy.y - enemy.r, '#fee2e2');
  if (enemy.type === 'boss' && previousHp > enemy.maxHp * 0.66 && enemy.hp <= enemy.maxHp * 0.66) {
    recordStat(game, 'bossPhases');
    game.message = 'Boss-Phase 2';
    game.messageTimer = 1.2;
    spawnBossMinions(game, enemy, 2);
  }
  if (enemy.type === 'boss' && previousHp > enemy.maxHp * 0.33 && enemy.hp <= enemy.maxHp * 0.33) {
    recordStat(game, 'bossPhases');
    game.message = 'Boss-Phase 3';
    game.messageTimer = 1.2;
    spawnBossMinions(game, enemy, 3);
  }
  if (enemy.hp <= 0) defeatEnemy(game, enemy);
}

function switchHero(game) {
  const player = game.player;
  const previousRatio = player.hp / player.maxHp;
  player.hero = player.hero === 'luna' ? 'bruno' : 'luna';
  const hero = currentHero(game);
  player.maxHp = hero.maxHp + (player.level - 1) * 16;
  player.hp = Math.max(1, Math.round(player.maxHp * previousRatio));
  game.message = `${hero.name} ist dran.`;
  game.messageTimer = 1.1;
  recordStat(game, 'heroSwitches');
  addBurst(game, player.x, player.y, hero.accent, 14);
}

function drinkPotion(game) {
  const player = game.player;
  if (player.itemCd > 0 || player.potions <= 0 || player.hp >= player.maxHp) return;
  player.potions -= 1;
  player.hp = Math.min(player.maxHp, player.hp + 42);
  player.itemCd = 0.8;
  recordStat(game, 'potions');
  addFloating(game, '+HEAL', player.x, player.y - 34, '#22c55e');
  addBurst(game, player.x, player.y, '#22c55e', 12);
}

function activateSpecial(game) {
  const player = game.player;
  const hero = currentHero(game);
  if (player.specialCd > 0 || player.energy < 55 || game.finished || !game.started) return false;
  player.energy -= 55;
  player.specialCd = 3.8;
  player.specialFlash = 0.5;
  recordStat(game, 'specials');
  if (player.hero === 'luna') {
    const count = hasRelic(game, 'moon-bow') ? 10 : 7;
    for (let i = 0; i < count; i += 1) {
      const angle = player.facing - 0.75 + (1.5 * i) / Math.max(1, count - 1);
      game.projectiles.push({
        id: `special-${game.elapsed}-${i}`,
        x: player.x + Math.cos(angle) * 28,
        y: player.y + Math.sin(angle) * 28,
        vx: Math.cos(angle) * 680,
        vy: Math.sin(angle) * 680,
        damage: hero.damage + player.level * 4 + (hasRelic(game, 'moon-bow') ? 8 : 0),
        life: 0.85,
        color: '#f0abfc',
        pierce: hasRelic(game, 'moon-bow') ? 2 : 1,
      });
    }
    game.message = 'Luna: Sternenfaecher';
    game.messageTimer = 0.9;
    addBurst(game, player.x, player.y, '#f0abfc', 24);
  } else {
    const radius = hasRelic(game, 'sun-hammer') ? 188 : 138;
    for (const enemy of game.enemies) {
      if (!enemy.alive || dist(player, enemy) > radius + enemy.r) continue;
      damageEnemy(game, enemy, hero.damage + player.level * 7 + (hasRelic(game, 'sun-hammer') ? 18 : 0), angleTo(player, enemy));
      enemy.attackCd = Math.max(enemy.attackCd, 1.1);
    }
    player.invulnerable = Math.max(player.invulnerable, 0.5);
    game.shake = Math.max(game.shake, 0.45);
    game.message = 'Bruno: Schutzkreis';
    game.messageTimer = 0.9;
    addBurst(game, player.x, player.y, '#fde68a', 30);
  }
  return true;
}

function tryAttack(game, controls) {
  const player = game.player;
  const hero = currentHero(game);
  if (!controls.attack || player.attackCd > 0) return;
  player.attackCd = hero.cooldown;
  player.attackFlash = 0.18;

  if (hero.type === 'ranged') {
    game.projectiles.push({
      id: `p-${game.elapsed}-${game.projectiles.length}`,
      x: player.x + Math.cos(player.facing) * 26,
      y: player.y + Math.sin(player.facing) * 26,
      vx: Math.cos(player.facing) * 560,
      vy: Math.sin(player.facing) * 560,
      damage: hero.damage + player.level * 2,
      life: 0.9,
      color: hero.accent,
    });
    return;
  }

  let hitAny = false;
  for (const enemy of game.enemies) {
    if (!enemy.alive) continue;
    const distance = dist(player, enemy);
    const angle = angleTo(player, enemy);
    const delta = Math.atan2(Math.sin(angle - player.facing), Math.cos(angle - player.facing));
    if (distance < hero.range + enemy.r && Math.abs(delta) < 1.25) {
      hitAny = true;
      damageEnemy(game, enemy, hero.damage + player.level * 4, player.facing);
    }
  }
  if (hitAny) recordStat(game, 'meleeHits');
  addBurst(game, player.x + Math.cos(player.facing) * 52, player.y + Math.sin(player.facing) * 52, hitAny ? '#facc15' : '#f59e0b', hitAny ? 14 : 6);
}

function updateProjectiles(game, dt) {
  for (const projectile of game.projectiles) {
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.life -= dt;
    for (const enemy of game.enemies) {
      if (!enemy.alive || projectile.life <= 0 || dist(projectile, enemy) > enemy.r + 8) continue;
      projectile.pierce = (projectile.pierce || 1) - 1;
      if (projectile.pierce <= 0) projectile.life = 0;
      recordStat(game, 'projectileHits');
      damageEnemy(game, enemy, projectile.damage, Math.atan2(projectile.vy, projectile.vx));
      addBurst(game, projectile.x, projectile.y, projectile.color, 8);
    }
  }
  game.projectiles = game.projectiles.filter((projectile) => projectile.life > 0);
}

function collidesWithObstacle(x, y, radius) {
  for (const obstacle of OBSTACLES) {
    if (obstacle.kind === 'pond') {
      if (dist({ x, y }, obstacle) < obstacle.r + radius - 12) return true;
    } else if (dist({ x, y }, obstacle) < obstacle.r + radius) {
      return true;
    }
  }
  return false;
}

function movePlayer(game, dx, dy) {
  const player = game.player;
  const nextX = clamp(player.x + dx, 46, WORLD_WIDTH - 46);
  if (!collidesWithObstacle(nextX, player.y, player.r)) player.x = nextX;
  else player.vx *= -0.2;
  const nextY = clamp(player.y + dy, 46, WORLD_HEIGHT - 46);
  if (!collidesWithObstacle(player.x, nextY, player.r)) player.y = nextY;
  else player.vy *= -0.2;
}

function updatePlayer(game, controls, dt) {
  const player = game.player;
  const hero = currentHero(game);
  player.attackCd = Math.max(0, player.attackCd - dt);
  player.dashCd = Math.max(0, player.dashCd - dt);
  player.itemCd = Math.max(0, player.itemCd - dt);
  player.specialCd = Math.max(0, player.specialCd - dt);
  player.invulnerable = Math.max(0, player.invulnerable - dt);
  player.attackFlash = Math.max(0, player.attackFlash - dt);
  player.specialFlash = Math.max(0, player.specialFlash - dt);
  player.energy = clamp(player.energy + (hasRelic(game, 'forest-heart') ? 13 : 8) * dt, 0, 100);

  const axisX = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
  const axisY = (controls.down ? 1 : 0) - (controls.up ? 1 : 0);
  const length = Math.hypot(axisX, axisY) || 1;
  const moveX = axisX / length;
  const moveY = axisY / length;
  if (axisX || axisY) player.facing = Math.atan2(moveY, moveX);

  let speed = hero.speed + (player.level - 1) * 6;
  if (controls.dash && player.dashCd <= 0) {
    player.vx += Math.cos(player.facing) * 520;
    player.vy += Math.sin(player.facing) * 520;
    player.dashCd = 0.9;
    player.invulnerable = Math.max(player.invulnerable, 0.22);
    player.energy = clamp(player.energy + 4, 0, 100);
    recordStat(game, 'dashes');
    addBurst(game, player.x, player.y, hero.accent, 10);
  }
  player.vx += moveX * speed * 4.1 * dt;
  player.vy += moveY * speed * 4.1 * dt;
  const velocity = Math.hypot(player.vx, player.vy);
  if (velocity > speed * 1.45) {
    player.vx = (player.vx / velocity) * speed * 1.45;
    player.vy = (player.vy / velocity) * speed * 1.45;
  }
  player.vx *= Math.pow(0.07, dt);
  player.vy *= Math.pow(0.07, dt);
  movePlayer(game, player.vx * dt, player.vy * dt);
  tryAttack(game, controls);
}

function updateEnemies(game, dt) {
  const player = game.player;
  for (const enemy of game.enemies) {
    if (!enemy.alive) continue;
    enemy.attackCd = Math.max(0, enemy.attackCd - dt);
    enemy.hit = Math.max(0, enemy.hit - dt);
    const distance = dist(enemy, player);
    const aggro = enemy.type === 'boss' ? 760 : 500;
    if (distance < aggro) {
      const angle = angleTo(enemy, player);
      const speed = enemy.speed * (enemy.hit > 0 ? 0.25 : 1);
      enemy.vx += Math.cos(angle) * speed * 2.5 * dt;
      enemy.vy += Math.sin(angle) * speed * 2.5 * dt;
    } else {
      enemy.vx += Math.cos(game.elapsed + enemy.phase) * enemy.speed * 0.2 * dt;
      enemy.vy += Math.sin(game.elapsed * 0.8 + enemy.phase) * enemy.speed * 0.2 * dt;
    }
    enemy.vx *= Math.pow(0.11, dt);
    enemy.vy *= Math.pow(0.11, dt);
    const nextX = clamp(enemy.x + enemy.vx * dt, 50, WORLD_WIDTH - 50);
    const nextY = clamp(enemy.y + enemy.vy * dt, 50, WORLD_HEIGHT - 50);
    if (!collidesWithObstacle(nextX, enemy.y, enemy.r)) enemy.x = nextX;
    if (!collidesWithObstacle(enemy.x, nextY, enemy.r)) enemy.y = nextY;
    if (distance < enemy.r + player.r + 4 && enemy.attackCd <= 0) {
      enemy.attackCd = enemy.type === 'boss' ? 0.85 : 1.1;
      damagePlayer(game, enemy.damage, enemy.type === 'boss' ? 'Boss-Treffer' : 'Gegner-Treffer');
    }
  }
}

function updateBossBehavior(game, dt) {
  const boss = game.enemies.find((enemy) => enemy.type === 'boss' && enemy.alive);
  if (!boss) return;
  boss.spellCd = Math.max(0, (boss.spellCd || 1.1) - dt);
  if (boss.spellCd > 0) return;
  const phase = boss.hp < boss.maxHp * 0.34 ? 3 : boss.hp < boss.maxHp * 0.67 ? 2 : 1;
  boss.spellCd = phase === 3 ? 1.2 : 1.7;
  const count = phase === 3 ? 10 : phase === 2 ? 7 : 5;
  for (let i = 0; i < count; i += 1) {
    const angle = phase === 1
      ? angleTo(boss, game.player) + (i - Math.floor(count / 2)) * 0.2
      : (Math.PI * 2 * i) / count + game.elapsed * 0.3;
    game.hostileProjectiles.push({
      id: `boss-shot-${game.elapsed}-${i}`,
      x: boss.x,
      y: boss.y,
      vx: Math.cos(angle) * (phase === 3 ? 250 : 210),
      vy: Math.sin(angle) * (phase === 3 ? 250 : 210),
      r: phase === 3 ? 8 : 10,
      damage: phase === 3 ? 12 : 14,
      life: 2.4,
      color: phase === 3 ? '#f97316' : '#fb7185',
    });
  }
  addBurst(game, boss.x, boss.y, '#fb7185', 12);
}

function updateHostileProjectiles(game, dt) {
  const player = game.player;
  for (const projectile of game.hostileProjectiles) {
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.life -= dt;
    if (projectile.life > 0 && dist(projectile, player) < projectile.r + player.r) {
      projectile.life = 0;
      damagePlayer(game, projectile.damage, 'Boss-Magie');
      addBurst(game, projectile.x, projectile.y, projectile.color, 8);
    }
  }
  game.hostileProjectiles = game.hostileProjectiles.filter((projectile) => projectile.life > 0);
}

function collectPickups(game) {
  const player = game.player;
  for (const pickup of game.pickups) {
    if (pickup.taken || dist(pickup, player) > 34) continue;
    pickup.taken = true;
    if (pickup.type === 'crystal') {
      player.crystals += 1;
      game.score += 140;
      recordStat(game, 'crystals');
      addFloating(game, 'KRISTALL', pickup.x, pickup.y, '#67e8f9');
      addBurst(game, pickup.x, pickup.y, '#67e8f9', 12);
    } else if (pickup.type === 'heart') {
      player.hp = Math.min(player.maxHp, player.hp + 28);
      recordStat(game, 'hearts');
      addFloating(game, '+HP', pickup.x, pickup.y, '#22c55e');
      addBurst(game, pickup.x, pickup.y, '#22c55e', 10);
    } else {
      player.coins += 1;
      game.score += 60;
      recordStat(game, 'coins');
      addFloating(game, '+60', pickup.x, pickup.y, '#facc15');
      addBurst(game, pickup.x, pickup.y, '#facc15', 8);
    }
  }
}

function collectRelics(game) {
  const player = game.player;
  for (const relic of game.relics) {
    if (relic.taken || dist(relic, player) > 44) continue;
    relic.taken = true;
    player.energy = clamp(player.energy + 35, 0, 100);
    game.score += 260;
    recordStat(game, 'relics');
    if (relic.type === 'shared') {
      player.maxHp += 18;
      player.hp = Math.min(player.maxHp, player.hp + 28);
    }
    game.message = `${relic.label} gefunden`;
    game.messageTimer = 1.2;
    addFloating(game, relic.label, relic.x, relic.y - 52, relic.color);
    addBurst(game, relic.x, relic.y, relic.color, 18);
  }
}

function solveShrine(game) {
  const shrine = game.shrines[game.currentShrine];
  if (!shrine) return;
  shrine.solved = true;
  game.correct += 1;
  recordStat(game, 'shrines');
  game.score += 300 + game.correct * 40;
  game.taskIndex += 1;
  addFloating(game, 'RICHTIG', shrine.x, shrine.y - 54, '#22c55e');
  addBurst(game, shrine.x, shrine.y, shrine.color, 18);
  game.currentShrine += 1;
  game.answers = [];
  if (game.currentShrine < game.shrines.length) {
    game.message = `Schrein ${game.correct}/${game.quest.shrinesTarget} geloest.`;
    game.messageTimer = 1.35;
    spawnAnswers(game);
  } else {
    game.message = 'Alle Schreine leuchten. Besiege den Boss.';
    game.messageTimer = 1.8;
  }
  maybeFinishGame(game);
}

function collectAnswers(game) {
  if (game.mode !== 'learn' || game.finished) return;
  if (game.answers.length === 0 && game.currentShrine < game.shrines.length) spawnAnswers(game);
  const task = currentTask(game);
  for (const answer of game.answers) {
    if (answer.taken || dist(answer, game.player) > 38) continue;
    answer.taken = true;
    if (answer.correct) {
      solveShrine(game);
    } else {
      game.wrong += 1;
      damagePlayer(game, 10, `${answer.label} passt nicht. Gesucht: ${task.correct}`);
      addFloating(game, 'FALSCH', answer.x, answer.y, '#fb7185');
      addBurst(game, answer.x, answer.y, '#fb7185', 10);
    }
    return;
  }
}

function maybeFinishGame(game) {
  const bossDown = game.enemies.some((enemy) => enemy.type === 'boss' && !enemy.alive);
  const enoughEnemies = game.defeated >= game.quest.enemiesTarget;
  const enoughCrystals = game.player.crystals >= game.quest.crystalsTarget;
  const enoughShrines = game.mode !== 'learn' || game.correct >= game.quest.shrinesTarget;
  if (bossDown && enoughEnemies && enoughCrystals && enoughShrines) {
    game.finished = true;
    game.message = game.mode === 'learn' ? 'Waldquest gelernt und geschafft.' : 'Waldquest abgeschlossen.';
    game.messageTimer = 4;
    game.score += Math.round(game.player.hp * 8 + game.player.coins * 60);
    const nextHigh = Math.max(game.highScore, game.score);
    game.highScore = nextHigh;
    localStorage.setItem(STORAGE_KEY, String(nextHigh));
  }
}

function updateGame(game, controls, dt) {
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.shake = Math.max(0, game.shake - dt * 2.6);
  updateContract(game, dt);
  updateParticles(game, dt);
  updateProjectiles(game, dt);
  updateHostileProjectiles(game, dt);
  if (!game.started || game.finished) return;
  updatePlayer(game, controls, dt);
  updateEnemies(game, dt);
  updateBossBehavior(game, dt);
  collectPickups(game);
  collectRelics(game);
  collectAnswers(game);
  maybeFinishGame(game);
}

function drawBackground(ctx, game, camera) {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, '#123126');
  gradient.addColorStop(0.55, '#1f4b33');
  gradient.addColorStop(1, '#173321');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  ctx.fillStyle = '#244f32';
  for (let x = -60; x < WORLD_WIDTH + 80; x += 96) {
    for (let y = -60; y < WORLD_HEIGHT + 80; y += 96) {
      if ((x / 96 + y / 96) % 2 === 0) {
        ctx.globalAlpha = 0.22;
        ctx.fillRect(x, y, 96, 96);
      }
    }
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(253,230,138,.18)';
  ctx.lineWidth = 34;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(300, 1010);
  ctx.bezierCurveTo(620, 900, 700, 640, 950, 760);
  ctx.bezierCurveTo(1170, 865, 1340, 640, 1580, 265);
  ctx.stroke();
  ctx.restore();
}

function drawObstacles(ctx, camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  for (const obstacle of OBSTACLES) {
    if (obstacle.kind === 'tree') {
      ctx.fillStyle = '#5b3718';
      drawRoundedRect(ctx, obstacle.x - 10, obstacle.y - 6, 20, 42, 8);
      ctx.fill();
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.arc(obstacle.x, obstacle.y - 14, obstacle.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(74,222,128,.45)';
      ctx.beginPath();
      ctx.arc(obstacle.x - 14, obstacle.y - 28, obstacle.r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    } else if (obstacle.kind === 'pond') {
      const radial = ctx.createRadialGradient(obstacle.x, obstacle.y, 0, obstacle.x, obstacle.y, obstacle.r);
      radial.addColorStop(0, '#38bdf8');
      radial.addColorStop(1, '#075985');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.ellipse(obstacle.x, obstacle.y, obstacle.r * 1.25, obstacle.r * 0.78, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(186,230,253,.5)';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (obstacle.kind === 'crate') {
      ctx.save();
      ctx.translate(obstacle.x, obstacle.y);
      ctx.rotate(0.25);
      ctx.fillStyle = '#92400e';
      drawRoundedRect(ctx, -32, -32, 64, 64, 10);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-22, -22);
      ctx.lineTo(22, 22);
      ctx.moveTo(22, -22);
      ctx.lineTo(-22, 22);
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      for (let i = 0; i < 8; i += 1) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = obstacle.r * (0.82 + seededUnit(i, obstacle.x) * 0.28);
        const x = obstacle.x + Math.cos(angle) * radius;
        const y = obstacle.y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawShrines(ctx, game, camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  for (const shrine of game.shrines) {
    const active = game.mode === 'learn' && shrine.index === game.currentShrine;
    ctx.save();
    ctx.translate(shrine.x, shrine.y);
    ctx.shadowBlur = active ? 24 : shrine.solved ? 18 : 6;
    ctx.shadowColor = shrine.color;
    ctx.fillStyle = shrine.solved ? shrine.color : 'rgba(148,163,184,.5)';
    ctx.beginPath();
    ctx.arc(0, 0, active ? 36 + Math.sin(game.elapsed * 4) * 3 : 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(shrine.solved ? 'OK' : `S${shrine.index + 1}`, 0, 4);
    ctx.restore();
  }
  ctx.restore();
}

function drawAnswers(ctx, game, camera) {
  if (game.mode !== 'learn') return;
  if (game.answers.length === 0 && game.currentShrine < game.shrines.length) spawnAnswers(game);
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const answer of game.answers) {
    if (answer.taken) continue;
    const radius = 31 + Math.sin(game.elapsed * 4) * 2;
    ctx.shadowBlur = answer.correct ? 22 : 8;
    ctx.shadowColor = answer.correct ? '#22c55e' : '#94a3b8';
    ctx.fillStyle = answer.correct ? 'rgba(34,197,94,.94)' : 'rgba(226,232,240,.9)';
    ctx.beginPath();
    ctx.arc(answer.x, answer.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = answer.correct ? '#bbf7d0' : '#64748b';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = answer.correct ? '#052e16' : '#0f172a';
    ctx.font = answer.label.length > 9 ? '900 11px Outfit, sans-serif' : '900 13px Outfit, sans-serif';
    ctx.fillText(answer.label, answer.x, answer.y + 1);
  }
  ctx.restore();
}

function drawPickups(ctx, game, camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  for (const pickup of game.pickups) {
    if (pickup.taken) continue;
    const pulse = Math.sin(game.elapsed * 5 + pickup.pulse) * 3;
    const color = pickup.type === 'crystal' ? '#67e8f9' : pickup.type === 'heart' ? '#fb7185' : '#facc15';
    ctx.save();
    ctx.translate(pickup.x, pickup.y);
    ctx.shadowBlur = 18;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    if (pickup.type === 'crystal') {
      ctx.beginPath();
      ctx.moveTo(0, -18 - pulse);
      ctx.lineTo(16 + pulse, 0);
      ctx.lineTo(0, 18 + pulse);
      ctx.lineTo(-16 - pulse, 0);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, 16 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 13px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pickup.type === 'heart' ? '+' : '$', 0, 1);
    }
    ctx.restore();
  }
  ctx.restore();
}

function drawRelics(ctx, game, camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  for (const relic of game.relics) {
    if (relic.taken) return;
    relic.pulse += 0.04;
    const bob = Math.sin(game.elapsed * 4 + relic.pulse) * 5;
    ctx.save();
    ctx.translate(relic.x, relic.y + bob);
    ctx.shadowBlur = 24;
    ctx.shadowColor = relic.color;
    ctx.fillStyle = relic.color;
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(22, -4);
    ctx.lineTo(14, 24);
    ctx.lineTo(-14, 24);
    ctx.lineTo(-22, -4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(relic.type === 'luna' ? 'L' : relic.type === 'bruno' ? 'B' : '+', 0, 4);
    ctx.restore();
  }
  ctx.restore();
}

function drawHeroShape(ctx, x, y, heroKey, facing, scale = 1) {
  const hero = HEROES[heroKey];
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(facing);
  ctx.scale(scale, scale);
  ctx.shadowBlur = 18;
  ctx.shadowColor = hero.accent;
  ctx.fillStyle = hero.color;
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hero.accent;
  ctx.beginPath();
  if (heroKey === 'luna') {
    ctx.ellipse(-7, -23, 6, 17, -0.25, 0, Math.PI * 2);
    ctx.ellipse(8, -23, 6, 17, 0.25, 0, Math.PI * 2);
  } else {
    ctx.arc(-13, -15, 8, 0, Math.PI * 2);
    ctx.arc(13, -15, 8, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.arc(8, -5, 3, 0, Math.PI * 2);
  ctx.arc(8, 6, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(16, -5, 10, 10);
  ctx.restore();
}

function drawPlayer(ctx, game, camera) {
  const player = game.player;
  const screen = toScreen(player, camera);
  const hero = currentHero(game);
  const blink = player.invulnerable > 0 && Math.floor(game.elapsed * 18) % 2 === 0;
  ctx.save();
  ctx.globalAlpha = blink ? 0.5 : 1;
  if (player.specialFlash > 0) {
    ctx.save();
    ctx.globalAlpha = clamp(player.specialFlash * 2, 0, 1);
    ctx.strokeStyle = hero.accent;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, player.hero === 'bruno' ? 138 : 70, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  drawHeroShape(ctx, screen.x, screen.y, player.hero, player.facing);
  if (player.attackFlash > 0 && hero.type === 'melee') {
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, hero.range, player.facing - 0.7, player.facing + 0.7);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(hero.name, screen.x, screen.y - 34);
  ctx.restore();
}

function drawEnemies(ctx, game, camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  for (const enemy of game.enemies) {
    if (!enemy.alive) continue;
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.shadowBlur = enemy.type === 'boss' ? 26 : 12;
    ctx.shadowColor = enemy.color;
    ctx.fillStyle = enemy.hit > 0 ? '#fef2f2' : enemy.color;
    if (enemy.type === 'bat') {
      ctx.beginPath();
      ctx.ellipse(-12, 0, 20, 10, Math.sin(game.elapsed * 8) * 0.4, 0, Math.PI * 2);
      ctx.ellipse(12, 0, 20, 10, -Math.sin(game.elapsed * 8) * 0.4, 0, Math.PI * 2);
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fill();
    } else if (enemy.type === 'boss') {
      drawRoundedRect(ctx, -42, -38, 84, 76, 16);
      ctx.fill();
      ctx.fillStyle = '#111827';
      ctx.fillRect(-18, -8, 12, 12);
      ctx.fillRect(8, -8, 12, 12);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, enemy.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.25)';
      ctx.beginPath();
      ctx.arc(-7, -8, enemy.r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(15,23,42,.8)';
    drawRoundedRect(ctx, -enemy.r, -enemy.r - 15, enemy.r * 2, 6, 3);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    drawRoundedRect(ctx, -enemy.r, -enemy.r - 15, enemy.r * 2 * clamp(enemy.hp / enemy.maxHp, 0, 1), 6, 3);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawProjectiles(ctx, game, camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  for (const projectile of game.projectiles) {
    ctx.shadowBlur = 14;
    ctx.shadowColor = projectile.color;
    ctx.fillStyle = projectile.color;
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const projectile of game.hostileProjectiles) {
    ctx.shadowBlur = 16;
    ctx.shadowColor = projectile.color;
    ctx.fillStyle = projectile.color;
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fecaca';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();
}

function drawParticles(ctx, game, camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  for (const particle of game.particles) {
    const alpha = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.globalAlpha = alpha;
    if (particle.kind === 'text') {
      ctx.fillStyle = particle.color;
      ctx.font = '900 18px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(particle.text, particle.x, particle.y);
    } else {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawGauge(ctx, x, y, width, label, value, color) {
  ctx.fillStyle = '#94a3b8';
  ctx.font = '900 11px Outfit, sans-serif';
  ctx.fillText(label, x, y);
  ctx.fillStyle = 'rgba(148,163,184,.2)';
  drawRoundedRect(ctx, x, y + 8, width, 10, 5);
  ctx.fill();
  ctx.fillStyle = color;
  drawRoundedRect(ctx, x, y + 8, width * clamp(value, 0, 1), 10, 5);
  ctx.fill();
}

function drawHud(ctx, game) {
  const player = game.player;
  const hero = currentHero(game);
  const task = currentTask(game);
  const contract = game.contract;
  const bossAlive = game.enemies.some((enemy) => enemy.type === 'boss' && enemy.alive);
  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, 38, 42, 272, game.mode === 'learn' ? 386 : 286, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 26px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Learn Quest' : 'Bruno Luna Quest', 62, 82);
  ctx.fillStyle = hero.accent;
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText(`${hero.name}  Level ${player.level}`, 62, 114);
  drawGauge(ctx, 62, 140, 172, 'HP', player.hp / player.maxHp, player.hp < 28 ? '#fb7185' : '#22c55e');
  drawGauge(ctx, 62, 180, 172, 'XP', player.xp / player.nextXp, '#a78bfa');
  drawGauge(ctx, 62, 220, 172, 'ENERGIE', player.energy / 100, '#67e8f9');
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 13px Outfit, sans-serif';
  ctx.fillText(`Score ${game.score}  High ${Math.max(game.highScore, game.score)}`, 62, 262);
  ctx.fillText(`Kristalle ${player.crystals}/${game.quest.crystalsTarget}  Gegner ${game.defeated}/${game.quest.enemiesTarget}`, 62, 288);
  ctx.fillText(`Relikte ${game.stats.relics}/3  Trank ${player.potions}  Boss ${bossAlive ? 'lebt' : 'besiegt'}`, 62, 314);
  if (game.mode === 'learn') {
    ctx.fillStyle = '#67e8f9';
    ctx.fillText(`${task.subject} - ${task.kind}`, 62, 346);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 14px Outfit, sans-serif';
    ctx.fillText(task.prompt, 62, 372, 184);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '800 12px Outfit, sans-serif';
    ctx.fillText(`Schreine ${game.correct}/${game.quest.shrinesTarget}  Fehler ${game.wrong}`, 62, 398);
  }

  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, 982, 42, 260, 432, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 18px Outfit, sans-serif';
  ctx.fillText('Aktionen', 1032, 82);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText('WASD/Pfeile laufen', 1032, 112);
  ctx.fillText('J = Angriff  L/I = Spezial', 1032, 137);
  ctx.fillText('Space/K = Dash', 1032, 162);
  ctx.fillText('Q = Bruno/Luna', 1032, 187);
  ctx.fillText('E = Trank  M = Modus', 1032, 212);
  drawGauge(ctx, 1032, 240, 160, 'DASH', 1 - player.dashCd / 0.9, '#38bdf8');
  drawGauge(ctx, 1032, 270, 160, 'ATTACK', 1 - player.attackCd / hero.cooldown, '#facc15');
  drawGauge(ctx, 1032, 300, 160, 'SPECIAL', 1 - player.specialCd / 3.8, '#f0abfc');

  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText('Zeitauftrag', 1032, 344);
  if (contract) {
    const progress = contract.target ? game.contractProgress / contract.target : 0;
    ctx.fillStyle = '#fde68a';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.fillText(contract.label, 1032, 366);
    drawGauge(ctx, 1032, 386, 160, `${game.contractProgress}/${contract.target}`, progress, '#facc15');
    ctx.fillStyle = game.contractTimer < 10 ? '#fb7185' : '#cbd5e1';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.fillText(`${Math.ceil(game.contractTimer)}s  Medaillen ${game.contractMedals}`, 1032, 424);
  } else {
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '800 12px Outfit, sans-serif';
    ctx.fillText(`naechster in ${Math.ceil(game.contractCooldown)}s`, 1032, 366);
    ctx.fillText(`Medaillen ${game.contractMedals}  Verpasst ${game.contractFails}`, 1032, 388);
  }

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 11px Outfit, sans-serif';
  game.goals.slice(0, 3).forEach((goal, index) => {
    const value = Math.min(goal.target, game.stats[goal.stat] || 0);
    ctx.fillStyle = goal.done ? '#86efac' : '#e2e8f0';
    ctx.fillText(`${goal.done ? 'OK' : `${value}/${goal.target}`} ${goal.label}`, 1032, 446 + index * 17);
  });

  ctx.fillStyle = 'rgba(2,6,23,.72)';
  drawRoundedRect(ctx, 42, HEIGHT - 58, 642, 38, 14);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText('Top-Down-Action-RPG: wechseln, ausweichen, angreifen, Auftraege schaffen und Schreine loesen', 62, HEIGHT - 34);
  ctx.restore();
}

function drawMessage(ctx, game) {
  if (game.messageTimer <= 0 && game.started && !game.finished) return;
  ctx.save();
  ctx.textAlign = 'center';
  if (!game.started || game.finished) {
    ctx.fillStyle = 'rgba(2,6,23,.72)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 42px Outfit, sans-serif';
    ctx.fillText(game.finished ? game.message : 'FASKA BRUNO & LUNA', WIDTH / 2, game.finished ? 250 : 224);
    if (!game.finished) {
      ctx.fillText('QUEST PRO', WIDTH / 2, 274);
    }
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '800 17px Outfit, sans-serif';
    if (game.finished) {
      ctx.fillText(`Score ${game.score} - Highscore ${Math.max(game.highScore, game.score)}`, WIDTH / 2, 294);
    } else {
      ctx.fillText('Wechsel, Dash, Beute, Spezialfaehigkeiten, Zeitauftraege und Schreine.', WIDTH / 2, 318);
      ctx.fillText('Relikte, Boss-Phasen und aktive Belohnungen sind aktiv.', WIDTH / 2, 346);
    }
    ctx.fillStyle = '#67e8f9';
    ctx.font = '900 15px Outfit, sans-serif';
    ctx.fillText('Normal oder Learncade starten.', WIDTH / 2, game.finished ? 328 : 374);
  } else {
    ctx.fillStyle = 'rgba(2,6,23,.76)';
    drawRoundedRect(ctx, WIDTH / 2 - 330, 84, 660, 50, 16);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 20px Outfit, sans-serif';
    ctx.fillText(game.message, WIDTH / 2, 117);
  }
  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  const camera = getCamera(game);
  ctx.save();
  if (game.shake > 0) {
    const amount = game.shake * 16;
    ctx.translate(
      (seededUnit(Math.round(game.elapsed * 1000), 1) - 0.5) * amount,
      (seededUnit(Math.round(game.elapsed * 1000), 2) - 0.5) * amount,
    );
  }
  drawBackground(ctx, game, camera);
  drawShrines(ctx, game, camera);
  drawPickups(ctx, game, camera);
  drawRelics(ctx, game, camera);
  drawAnswers(ctx, game, camera);
  drawObstacles(ctx, camera);
  drawEnemies(ctx, game, camera);
  drawProjectiles(ctx, game, camera);
  drawPlayer(ctx, game, camera);
  drawParticles(ctx, game, camera);
  drawHud(ctx, game);
  drawMessage(ctx, game);
  ctx.restore();
}

export default function FaskaEpicRPGSwarm() {
  const canvasRef = useRef(null);
  const modeRef = useRef('arcade');
  const gameRef = useRef(makeInitialGame('arcade'));
  const controlsRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
    attack: false,
    dash: false,
  });
  const [showTouchControls, setShowTouchControls] = useState(false);
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
    if (nextMode === 'learn') spawnAnswers(gameRef.current);
    gameRef.current.started = true;
    gameRef.current.message = nextMode === 'learn'
      ? 'Loese den ersten Schrein und finde Relikte.'
      : 'Sammle Kristalle, Relikte und finde den Boss.';
    gameRef.current.messageTimer = 1.8;
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

  useEffect(() => {
    const pointerQuery = window.matchMedia?.('(pointer: coarse)');
    const updateTouchControls = () => setShowTouchControls(Boolean(pointerQuery?.matches));
    updateTouchControls();
    pointerQuery?.addEventListener?.('change', updateTouchControls);
    return () => pointerQuery?.removeEventListener?.('change', updateTouchControls);
  }, []);

  useEffect(() => {
    const down = (event) => {
      const key = event.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' ', 'j', 'k', 'l', 'i', 'q', 'e', 'm', 'r'].includes(key)) {
        event.preventDefault();
      }
      if (key === 'arrowup' || key === 'w') controlsRef.current.up = true;
      if (key === 'arrowdown' || key === 's') controlsRef.current.down = true;
      if (key === 'arrowleft' || key === 'a') controlsRef.current.left = true;
      if (key === 'arrowright' || key === 'd') controlsRef.current.right = true;
      if (key === 'j') controlsRef.current.attack = true;
      if (key === ' ' || key === 'k') controlsRef.current.dash = true;
      if ((key === 'l' || key === 'i') && gameRef.current.started && !gameRef.current.finished) activateSpecial(gameRef.current);
      if (key === 'q' && gameRef.current.started && !gameRef.current.finished) switchHero(gameRef.current);
      if (key === 'e') drinkPotion(gameRef.current);
      if (key === 'm') startGame(modeRef.current === 'learn' ? 'arcade' : 'learn');
      if (key === 'r') startGame(modeRef.current);
    };
    const up = (event) => {
      const key = event.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') controlsRef.current.up = false;
      if (key === 'arrowdown' || key === 's') controlsRef.current.down = false;
      if (key === 'arrowleft' || key === 'a') controlsRef.current.left = false;
      if (key === 'arrowright' || key === 'd') controlsRef.current.right = false;
      if (key === 'j') controlsRef.current.attack = false;
      if (key === ' ' || key === 'k') controlsRef.current.dash = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [startGame]);

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
      updateGame(gameRef.current, controlsRef.current, dt);
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

  const holdButton = (key) => ({
    onPointerDown: (event) => {
      event.preventDefault();
      controlsRef.current[key] = true;
    },
    onPointerUp: (event) => {
      event.preventDefault();
      controlsRef.current[key] = false;
    },
    onPointerCancel: () => {
      controlsRef.current[key] = false;
    },
    onPointerLeave: () => {
      controlsRef.current[key] = false;
    },
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#020617',
      overflow: 'hidden',
      touchAction: 'none',
      userSelect: 'none',
    }}>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{
          width: '100vw',
          height: '100vh',
          display: 'block',
        }}
      />

      <div style={{
        position: 'fixed',
        top: 18,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 10,
        zIndex: 5,
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

      {showTouchControls && (
        <>
          <div style={{
            position: 'fixed',
            left: 18,
            bottom: 18,
            display: 'grid',
            gridTemplateColumns: '64px 64px 64px',
            gap: 8,
            zIndex: 5,
          }}>
            <div />
            <button type="button" aria-label="Hoch" style={touchButton} {...holdButton('up')}>Up</button>
            <div />
            <button type="button" aria-label="Links" style={touchButton} {...holdButton('left')}>L</button>
            <button type="button" aria-label="Runter" style={touchButton} {...holdButton('down')}>D</button>
            <button type="button" aria-label="Rechts" style={touchButton} {...holdButton('right')}>R</button>
          </div>
          <div style={{
            position: 'fixed',
            right: 18,
            bottom: 24,
            display: 'grid',
            gridTemplateColumns: '74px 74px',
            gap: 10,
            zIndex: 5,
          }}>
            <button type="button" aria-label="Angriff" style={{ ...touchButton, width: 74, height: 62 }} {...holdButton('attack')}>Hit</button>
            <button type="button" aria-label="Dash" style={{ ...touchButton, width: 74, height: 62 }} {...holdButton('dash')}>Dash</button>
            <button
              type="button"
              aria-label="Spezial"
              style={{ ...touchButton, width: 158, height: 62, gridColumn: '1 / span 2' }}
              onPointerDown={(event) => { event.preventDefault(); activateSpecial(gameRef.current); }}
            >
              Spec
            </button>
          </div>
        </>
      )}

      {!ui.started && (
        <div style={{
          position: 'fixed',
          left: '50%',
          top: '58%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 12,
          zIndex: 6,
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
