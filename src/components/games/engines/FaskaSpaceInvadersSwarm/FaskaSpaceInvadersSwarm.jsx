import { useCallback, useEffect, useRef, useState } from 'react';

const WIDTH = 1280;
const HEIGHT = 720;
const PLAYER_Y = 636;

const ENEMY_TYPES = {
  scout: { hp: 1, points: 90, color: '#22d3ee', radius: 20, fire: 1 },
  crab: { hp: 2, points: 150, color: '#f97316', radius: 23, fire: 1.2 },
  manta: { hp: 3, points: 240, color: '#a78bfa', radius: 26, fire: 1.45 },
  hunter: { hp: 3, points: 320, color: '#f43f5e', radius: 24, fire: 1.7 },
  sentinel: { hp: 4, points: 420, color: '#facc15', radius: 28, fire: 1.9 },
};

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    prompt: 'Welche Wortart ist "rennt"?',
    correct: 'Verb',
    options: ['Verb', 'Nomen', 'Adjektiv', 'Praeposition'],
  },
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    prompt: 'Welche Wortart ist "Schluessel"?',
    correct: 'Nomen',
    options: ['Nomen', 'Verb', 'Adjektiv', 'Artikel'],
  },
  {
    subject: 'Deutsch',
    kind: 'Satzbau',
    prompt: 'Was steht am Satzanfang?',
    correct: 'Heute',
    options: ['Heute', 'leise', 'unter', 'klein'],
  },
  {
    subject: 'Lesen',
    kind: 'Sinnwort',
    prompt: 'Wohin passt das Wort "Bibliothek"?',
    correct: 'Ort',
    options: ['Ort', 'Tier', 'Farbe', 'Zahl'],
  },
  {
    subject: 'Mathe',
    kind: 'Ergebnis',
    prompt: '6 x 7 = ?',
    correct: '42',
    options: ['42', '36', '48', '56'],
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    prompt: 'Was bedeutet "shield"?',
    correct: 'Schild',
    options: ['Schild', 'Stern', 'Schiff', 'Schuss'],
  },
  {
    subject: 'Sachkunde',
    kind: 'Kategorie',
    prompt: 'Wozu gehoert Sauerstoff?',
    correct: 'Gas',
    options: ['Gas', 'Metall', 'Planet', 'Geraeusch'],
  },
  {
    subject: 'Deutsch',
    kind: 'Praeposition',
    prompt: 'In "unter dem Tisch" ist "unter" eine ...',
    correct: 'Praeposition',
    options: ['Praeposition', 'Nomen', 'Verb', 'Zahl'],
  },
  {
    subject: 'Deutsch',
    kind: 'Kompositum',
    prompt: 'Was passt zu "Stern..."?',
    correct: 'warte',
    options: ['warte', 'rennen', 'leise', 'unter'],
  },
  {
    subject: 'Deutsch',
    kind: 'Satzglied',
    prompt: 'Mila liest ein Buch. Wer liest?',
    correct: 'Mila',
    options: ['Mila', 'liest', 'ein Buch', 'heute'],
  },
  {
    subject: 'Mathe',
    kind: 'Ergebnis',
    prompt: '84 - 29 = ?',
    correct: '55',
    options: ['45', '55', '56', '65'],
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    prompt: 'Was bedeutet "thunder"?',
    correct: 'Donner',
    options: ['Donner', 'Wasser', 'Fenster', 'Kette'],
  },
];

const INVADER_GOALS = [
  { id: 'waves_3', label: '3 Wellen klaeren', stat: 'wavesCleared', target: 3, mode: 'arcade', reward: 900 },
  { id: 'kills_35', label: '35 Invader zerlegen', stat: 'kills', target: 35, mode: 'both', reward: 850 },
  { id: 'combo_12', label: '12er Combo halten', stat: 'comboPeak', target: 12, mode: 'arcade', reward: 760 },
  { id: 'boss_1', label: '1 Boss knacken', stat: 'bosses', target: 1, mode: 'both', reward: 1200 },
  { id: 'powerups_3', label: '3 Powerups sichern', stat: 'powerups', target: 3, mode: 'both', reward: 520 },
  { id: 'overdrive_2', label: '2 Overdrives starten', stat: 'overdrives', target: 2, mode: 'arcade', reward: 700 },
  { id: 'charged_5', label: '5 Charge-Schuesse', stat: 'chargedShots', target: 5, mode: 'both', reward: 780 },
  { id: 'barriers_2', label: '2 Barrieren retten', stat: 'barrierSaves', target: 2, mode: 'both', reward: 640 },
  { id: 'drones_2', label: '2 Drohnen sichern', stat: 'drones', target: 2, mode: 'both', reward: 680 },
  { id: 'learn_5', label: '5 Lernziele richtig', stat: 'learnCorrect', target: 5, mode: 'learn', reward: 1300 },
  { id: 'learn_streak_3', label: '3er Lernserie', stat: 'learnStreakPeak', target: 3, mode: 'learn', reward: 720 },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function seededUnit(index, salt) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function createStats() {
  return {
    wavesCleared: 0,
    kills: 0,
    comboPeak: 0,
    bosses: 0,
    powerups: 0,
    overdrives: 0,
    chargedShots: 0,
    barrierSaves: 0,
    drones: 0,
    learnCorrect: 0,
    learnStreakPeak: 0,
  };
}

function createGoals(mode) {
  const weight = goal => (goal.mode === mode ? 0 : goal.mode === 'both' ? 1 : 2);
  return INVADER_GOALS
    .filter(goal => goal.mode === 'both' || goal.mode === mode)
    .sort((a, b) => weight(a) - weight(b))
    .map(goal => ({ ...goal, completed: false }));
}

function recordStat(game, stat, amount = 1) {
  game.stats[stat] = Math.max(game.stats[stat] || 0, amount === 1 ? (game.stats[stat] || 0) + 1 : amount);
  const completed = game.goals.find(goal => !goal.completed && goal.stat === stat && game.stats[stat] >= goal.target);
  if (!completed) return;
  completed.completed = true;
  game.score += completed.reward;
  game.goalNotice = `${completed.label} +${completed.reward}`;
  game.goalNoticeTimer = 2.2;
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

function makeStars() {
  return Array.from({ length: 120 }, (_, index) => ({
    x: seededUnit(index, 3) * WIDTH,
    y: seededUnit(index, 9) * HEIGHT,
    size: 1 + seededUnit(index, 12) * 2.2,
    speed: 18 + seededUnit(index, 21) * 62,
    alpha: 0.22 + seededUnit(index, 31) * 0.7,
  }));
}

function makeBarriers(wave = 1) {
  const barrierCount = 4;
  return Array.from({ length: barrierCount }, (_, barrierIndex) => {
    const x = 214 + barrierIndex * 284;
    const y = 548;
    return {
      id: `barrier_${barrierIndex}`,
      x,
      y,
      repairPulse: 0,
      cells: Array.from({ length: 10 }, (_, cellIndex) => ({
        x: x + (cellIndex % 5) * 28 - 56,
        y: y + Math.floor(cellIndex / 5) * 22,
        hp: 2 + Math.floor(wave / 4),
        maxHp: 2 + Math.floor(wave / 4),
      })),
    };
  });
}

function makeEnemies(wave) {
  const columns = Math.min(10, 7 + Math.floor(wave / 2));
  const rows = Math.min(5, 3 + Math.floor(wave / 3));
  const startX = WIDTH / 2 - ((columns - 1) * 82) / 2;
  const startY = 104;
  const enemies = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const type = row === 0 && wave > 5
        ? 'sentinel'
        : row === 0 && wave > 2
          ? 'manta'
          : row === 1 && wave > 3
            ? 'hunter'
            : row < 2
              ? 'crab'
              : 'scout';
      const spec = ENEMY_TYPES[type];
      const elite = wave >= 4 && (row + col + wave) % 7 === 0;
      enemies.push({
        id: `w${wave}_${row}_${col}`,
        x: startX + col * 82,
        y: startY + row * 62,
        baseX: startX + col * 82,
        baseY: startY + row * 62,
        type,
        hp: spec.hp + Math.floor(wave / 5) + (elite ? 2 : 0),
        maxHp: spec.hp + Math.floor(wave / 5) + (elite ? 2 : 0),
        points: spec.points + wave * 12 + (elite ? 140 : 0),
        color: elite ? '#fef08a' : spec.color,
        radius: spec.radius + (elite ? 4 : 0),
        fire: spec.fire + (elite ? 0.45 : 0),
        elite,
        phase: seededUnit(row * 17 + col, wave) * Math.PI * 2,
        label: '',
        correct: false,
        hitTimer: 0,
      });
    }
  }

  return enemies;
}

function makeBoss(wave) {
  return {
    x: WIDTH / 2,
    y: 116,
    vx: 90 + wave * 6,
    hp: 22 + wave * 6,
    maxHp: 22 + wave * 6,
    fireTimer: 1.2,
    laserTimer: 2.8,
    hitTimer: 0,
  };
}

function makeInitialGame(mode = 'arcade') {
  const game = {
    mode,
    started: false,
    finished: false,
    stars: makeStars(),
    player: {
      x: WIDTH / 2,
      y: PLAYER_Y,
      vx: 0,
      width: 64,
      lives: 4,
      shield: mode === 'learn' ? 80 : 55,
      invulnerable: 0,
      dashTimer: 0,
      dashCooldown: 0,
      heat: 0,
      overheated: false,
      multishot: 0,
      overdrive: mode === 'learn' ? 28 : 0,
      overdriveTimer: 0,
      charge: 0,
      chargeCooldown: 0,
    },
    bullets: [],
    enemyBullets: [],
    enemies: makeEnemies(1),
    boss: null,
    barriers: makeBarriers(1),
    drones: [],
    powerups: [],
    particles: [],
    floaters: [],
    wave: 1,
    score: 0,
    highScore: readHighScore(),
    combo: 0,
    comboTimer: 0,
    stats: createStats(),
    goals: createGoals(mode),
    goalNotice: '',
    goalNoticeTimer: 0,
    formationDir: 1,
    formationSpeed: 34,
    enemyFireTimer: 1.1,
    droneFireTimer: 0.24,
    spawnBossNext: false,
    learnIndex: 0,
    learnStreak: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    message: mode === 'learn'
      ? 'Triff die richtige Antwort auf einem Invader.'
      : 'Verteidige die Stadt gegen die Angriffswellen.',
    messageTimer: 2.5,
    elapsed: 0,
    shake: 0,
  };

  if (mode === 'learn') assignLearnTargets(game);
  return game;
}

function readHighScore() {
  try {
    return Number(window.localStorage.getItem('faska_invaders_highscore') || 0);
  } catch {
    return 0;
  }
}

function writeHighScore(score) {
  try {
    const previous = readHighScore();
    if (score > previous) window.localStorage.setItem('faska_invaders_highscore', String(score));
  } catch {
    // localStorage can be unavailable in private contexts.
  }
}

function currentTask(game) {
  return LEARN_TASKS[game.learnIndex % LEARN_TASKS.length];
}

function assignLearnTargets(game) {
  if (game.mode !== 'learn') return;
  const alive = game.enemies.filter((enemy) => enemy.hp > 0);
  if (alive.length === 0) return;

  alive.forEach((enemy) => {
    enemy.label = '';
    enemy.correct = false;
  });

  const task = currentTask(game);
  const targets = [...alive]
    .sort((a, b) => a.y - b.y || Math.abs(a.x - game.player.x) - Math.abs(b.x - game.player.x))
    .slice(0, Math.min(task.options.length, alive.length));

  task.options.forEach((option, index) => {
    const target = targets[index % targets.length];
    target.label = option;
    target.correct = option === task.correct;
    target.color = option === task.correct ? '#22c55e' : '#a78bfa';
  });
}

function addFloater(game, x, y, text, color = '#facc15') {
  game.floaters.push({ x, y, text, color, life: 0.95, maxLife: 0.95, vy: -46 });
}

function spawnParticles(game, x, y, color, count = 12, speed = 150) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed * 2.1;
    const burst = speed * (0.38 + (i % 5) * 0.13);
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * burst,
      vy: Math.sin(angle) * burst,
      size: 2.5 + (i % 4) * 1.5,
      color,
      life: 0.55,
      maxLife: 0.55,
    });
  }
}

function repairBarriers(game, amount = 1) {
  game.barriers.forEach((barrier) => {
    barrier.repairPulse = 0.8;
    barrier.cells.forEach((cell) => {
      if (cell.hp <= 0 && seededUnit(cell.x + game.wave, cell.y + game.elapsed) > 0.52) {
        cell.hp = 1;
      } else {
        cell.hp = Math.min(cell.maxHp, cell.hp + amount);
      }
    });
  });
  recordStat(game, 'barrierSaves');
}

function firePlayerBullet(game) {
  const player = game.player;
  if (player.overheated) return;

  const overdrive = player.overdriveTimer > 0;
  player.heat = Math.min(100, player.heat + (overdrive ? 2.2 : player.multishot > 0 ? 9 : 7));
  if (player.heat >= 98) {
    player.overheated = true;
    game.message = 'Kanone ueberhitzt';
    game.messageTimer = 0.75;
  }

  const spread = overdrive ? [-0.34, -0.17, 0, 0.17, 0.34] : player.multishot > 0 ? [-0.24, 0, 0.24] : [0];
  spread.forEach((angle) => {
    game.bullets.push({
      x: player.x,
      y: player.y - 34,
      vx: Math.sin(angle) * 310,
      vy: -620,
      radius: angle === 0 ? 6 : 5,
      color: angle === 0 ? '#e0f2fe' : '#fef08a',
      life: 1.4,
      damage: 1,
      pierce: 0,
    });
  });
}

function fireChargedShot(game) {
  const player = game.player;
  if (player.charge < 70 || player.chargeCooldown > 0 || player.overheated) return;
  const fullCharge = player.charge >= 100;
  player.charge = 0;
  player.chargeCooldown = 1.2;
  player.heat = Math.min(100, player.heat + (fullCharge ? 18 : 12));
  game.bullets.push({
    x: player.x,
    y: player.y - 44,
    vx: 0,
    vy: -760,
    radius: fullCharge ? 12 : 10,
    color: fullCharge ? '#fef08a' : '#67e8f9',
    life: 1.35,
    damage: fullCharge ? 4 : 3,
    pierce: fullCharge ? 5 : 3,
    charged: true,
  });
  game.shake = 0.11;
  recordStat(game, 'chargedShots');
  spawnParticles(game, player.x, player.y - 28, fullCharge ? '#fef08a' : '#67e8f9', 18, 230);
}

function activateOverdrive(game) {
  const player = game.player;
  if (player.overdrive < 100 || player.overdriveTimer > 0 || game.finished || !game.started) return;
  player.overdrive = 0;
  player.overdriveTimer = 3.8;
  player.multishot = Math.max(player.multishot, 3.8);
  player.heat = 0;
  player.overheated = false;
  game.enemyBullets = [];
  game.shake = 0.22;
  recordStat(game, 'overdrives');
  game.message = 'OVERDRIVE';
  game.messageTimer = 1.0;
  spawnParticles(game, player.x, player.y - 18, '#facc15', 38, 280);
}

function enemyShoot(game, enemy, aimed = false) {
  const player = game.player;
  const dx = aimed ? clamp((player.x - enemy.x) / 260, -0.85, 0.85) : 0;
  game.enemyBullets.push({
    x: enemy.x,
    y: enemy.y + enemy.radius + 4,
    vx: dx * 145,
    vy: 250 + game.wave * 10,
    radius: enemy.type === 'manta' ? 7 : 5,
    color: enemy.correct ? '#22c55e' : enemy.color,
    damage: enemy.type === 'manta' ? 24 : 18,
  });
}

function bossShoot(game, spread = 0) {
  if (!game.boss) return;
  const count = spread ? 7 : 3;
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0 : i / (count - 1);
    const angle = (t - 0.5) * (spread ? 1.15 : 0.42);
    game.enemyBullets.push({
      x: game.boss.x,
      y: game.boss.y + 58,
      vx: Math.sin(angle) * 235,
      vy: 250 + Math.cos(angle) * 100,
      radius: spread ? 7 : 8,
      color: spread ? '#f97316' : '#fb7185',
      damage: spread ? 18 : 28,
    });
  }
}

function damagePlayer(game, amount) {
  const player = game.player;
  if (player.invulnerable > 0) return;

  if (player.shield > 0) {
    const absorbed = Math.min(player.shield, amount);
    player.shield -= absorbed;
    amount -= absorbed;
  }

  if (amount > 0) {
    player.lives -= 1;
    player.invulnerable = 1.15;
    player.heat = Math.min(96, player.heat + 20);
    game.combo = 0;
    game.shake = 0.25;
    game.message = player.lives > 0 ? 'Treffer am Schiff' : 'Basis verloren';
    game.messageTimer = 1.1;
    spawnParticles(game, player.x, player.y, '#fb7185', 26, 260);
  } else {
    player.invulnerable = 0.25;
    game.shake = 0.12;
    spawnParticles(game, player.x, player.y - 8, '#38bdf8', 14, 190);
  }

  if (player.lives <= 0) finishGame(game, 'Game Over');
}

function finishGame(game, message) {
  game.finished = true;
  game.started = false;
  game.message = message;
  game.messageTimer = 4;
  writeHighScore(game.score);
  game.highScore = Math.max(game.highScore, game.score);
}

function applyPowerup(game, powerup) {
  const player = game.player;
  if (powerup.kind === 'shield') {
    player.shield = Math.min(100, player.shield + 34);
    addFloater(game, player.x, player.y - 46, 'Schild +', '#38bdf8');
  } else if (powerup.kind === 'cool') {
    player.heat = Math.max(0, player.heat - 55);
    player.overheated = false;
    addFloater(game, player.x, player.y - 46, 'Kuehlung', '#67e8f9');
  } else if (powerup.kind === 'repair') {
    repairBarriers(game, 2);
    addFloater(game, player.x, player.y - 46, 'Barriere +', '#86efac');
  } else if (powerup.kind === 'drone') {
    const side = game.drones.length % 2 === 0 ? -1 : 1;
    game.drones.push({
      x: player.x + side * 54,
      y: player.y - 30,
      side,
      life: 14,
      fireTimer: 0.2,
    });
    recordStat(game, 'drones');
    addFloater(game, player.x, player.y - 46, 'Drohne', '#c084fc');
  } else {
    player.multishot = Math.max(player.multishot, 8);
    addFloater(game, player.x, player.y - 46, 'Dreifach', '#facc15');
  }
  player.overdrive = Math.min(100, player.overdrive + 14);
  recordStat(game, 'powerups');
  spawnParticles(game, player.x, player.y - 20, powerup.color, 18, 210);
}

function maybeDropPowerup(game, x, y) {
  const chance = game.mode === 'learn' ? 0.26 : 0.18;
  if (seededUnit(Math.round(game.elapsed * 1000 + x), y) > chance) return;
  const roll = seededUnit(Math.round(x + y), game.wave);
  const kind = roll > 0.86 ? 'drone' : roll > 0.7 ? 'repair' : roll > 0.5 ? 'multi' : roll > 0.25 ? 'shield' : 'cool';
  game.powerups.push({
    x,
    y,
    vy: 92,
    kind,
    color: kind === 'multi' ? '#facc15' : kind === 'shield' ? '#38bdf8' : kind === 'repair' ? '#86efac' : kind === 'drone' ? '#c084fc' : '#67e8f9',
    radius: 15,
  });
}

function handleLearnHit(game, enemy) {
  const task = currentTask(game);
  if (!enemy.label) return;

  if (enemy.correct) {
    game.learnStreak += 1;
    game.correctAnswers += 1;
    recordStat(game, 'learnCorrect');
    recordStat(game, 'learnStreakPeak', game.learnStreak);
    game.score += 420 + game.learnStreak * 80;
    game.player.shield = Math.min(100, game.player.shield + 18);
    game.player.multishot = Math.max(game.player.multishot, 3.5);
    game.player.overdrive = Math.min(100, game.player.overdrive + 18);
    game.message = `${task.correct} stimmt`;
    game.messageTimer = 1;
    addFloater(game, enemy.x, enemy.y - 26, `richtig x${game.learnStreak}`, '#22c55e');
  } else {
    game.learnStreak = 0;
    game.wrongAnswers += 1;
    game.player.heat = Math.min(100, game.player.heat + 24);
    game.player.shield = Math.max(0, game.player.shield - 12);
    game.message = `${enemy.label} passt nicht. Gesucht: ${task.correct}`;
    game.messageTimer = 1.25;
    addFloater(game, enemy.x, enemy.y - 26, 'falsch', '#fb7185');
    enemyShoot(game, enemy, true);
  }

  game.learnIndex += 1;
  assignLearnTargets(game);
}

function destroyEnemy(game, enemy) {
  enemy.hp = 0;
  game.combo += 1;
  game.comboTimer = 2.2;
  recordStat(game, 'kills');
  recordStat(game, 'comboPeak', game.combo);
  game.player.overdrive = Math.min(100, game.player.overdrive + (enemy.type === 'manta' ? 8 : 5));
  const comboBonus = Math.min(700, game.combo * 28);
  game.score += enemy.points + comboBonus;
  spawnParticles(game, enemy.x, enemy.y, enemy.color, 18, 220);
  addFloater(game, enemy.x, enemy.y - 18, `+${enemy.points + comboBonus}`, '#facc15');
  maybeDropPowerup(game, enemy.x, enemy.y);
}

function nextWave(game) {
  recordStat(game, 'wavesCleared');
  game.wave += 1;
  game.formationDir = game.wave % 2 === 0 ? -1 : 1;
  game.formationSpeed = 34 + game.wave * 4.6;
  game.enemyFireTimer = 0.9;
  game.bullets = [];
  game.enemyBullets = [];
  game.powerups = [];
  game.player.shield = Math.min(100, game.player.shield + 18);
  game.player.heat = Math.max(0, game.player.heat - 30);
  game.player.overheated = false;
  repairBarriers(game, game.wave % 3 === 0 ? 2 : 1);

  if (game.wave % 3 === 0) {
    game.boss = makeBoss(game.wave);
    game.enemies = makeEnemies(game.wave).slice(0, 18);
    game.message = `Boss-Welle ${game.wave}`;
  } else {
    game.boss = null;
    game.enemies = makeEnemies(game.wave);
    game.message = `Welle ${game.wave}`;
  }
  game.messageTimer = 1.4;
  if (game.mode === 'learn') assignLearnTargets(game);
}

function updateStars(game, dt) {
  game.stars.forEach((star) => {
    star.y += star.speed * dt;
    if (star.y > HEIGHT + 8) {
      star.y = -8;
      star.x = seededUnit(Math.round(game.elapsed * 1000 + star.x), star.speed) * WIDTH;
    }
  });
}

function updateEffects(game, dt) {
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

function updatePlayer(game, input, dt) {
  const player = game.player;
  const move = (input.left ? -1 : 0) + (input.right ? 1 : 0);
  if (input.special) activateOverdrive(game);
  if (input.charge) {
    player.charge = Math.min(100, player.charge + (player.overdriveTimer > 0 ? 115 : 72) * dt);
  } else if (player.charge >= 70) {
    fireChargedShot(game);
  } else {
    player.charge = Math.max(0, player.charge - 80 * dt);
  }
  const dashPressed = input.dash && player.dashCooldown <= 0 && Math.abs(move) > 0;
  if (dashPressed) {
    player.dashTimer = 0.16;
    player.dashCooldown = 1.1;
    player.vx = move * 820;
    game.shake = 0.08;
    spawnParticles(game, player.x, player.y + 16, '#38bdf8', 14, 200);
  }

  const accel = player.dashTimer > 0 ? 0 : 2050;
  const maxSpeed = player.dashTimer > 0 ? 820 : 420;
  player.vx += move * accel * dt;
  if (move === 0 && player.dashTimer <= 0) player.vx *= Math.pow(0.82, dt * 60);
  player.vx = clamp(player.vx, -maxSpeed, maxSpeed);
  player.x += player.vx * dt;
  player.x = clamp(player.x, 50, WIDTH - 50);

  player.invulnerable = Math.max(0, player.invulnerable - dt);
  player.dashTimer = Math.max(0, player.dashTimer - dt);
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
  player.multishot = Math.max(0, player.multishot - dt);
  player.overdriveTimer = Math.max(0, player.overdriveTimer - dt);
  player.chargeCooldown = Math.max(0, player.chargeCooldown - dt);

  const cooling = player.overdriveTimer > 0 ? 70 : input.fire || input.charge ? 12 : 34;
  player.heat = Math.max(0, player.heat - cooling * dt);
  if (player.overheated && player.heat < 42) player.overheated = false;
}

function updateBullets(game, input, dt) {
  const player = game.player;
  player.fireCooldown = Math.max(0, (player.fireCooldown || 0) - dt);
  if (input.fire && player.fireCooldown <= 0 && !game.finished) {
    firePlayerBullet(game);
    player.fireCooldown = player.multishot > 0 ? 0.12 : 0.16;
  }

  game.bullets = game.bullets
    .map((bullet) => ({ ...bullet, x: bullet.x + bullet.vx * dt, y: bullet.y + bullet.vy * dt, life: bullet.life - dt }))
    .filter((bullet) => bullet.y > -40 && bullet.life > 0);

  game.enemyBullets = game.enemyBullets
    .map((bullet) => ({ ...bullet, x: bullet.x + bullet.vx * dt, y: bullet.y + bullet.vy * dt }))
    .filter((bullet) => bullet.y < HEIGHT + 50 && bullet.x > -80 && bullet.x < WIDTH + 80);
}

function updateDrones(game, dt) {
  const player = game.player;
  game.drones.forEach((drone, index) => {
    const targetX = player.x + drone.side * (58 + index * 10);
    const targetY = player.y - 42 - (index % 2) * 14;
    drone.x = lerp(drone.x, targetX, clamp(dt * 8, 0, 1));
    drone.y = lerp(drone.y, targetY, clamp(dt * 8, 0, 1));
    drone.life -= dt;
    drone.fireTimer -= dt;
    if (drone.fireTimer <= 0) {
      drone.fireTimer = 0.42;
      game.bullets.push({
        x: drone.x,
        y: drone.y - 10,
        vx: drone.side * 42,
        vy: -560,
        radius: 4,
        color: '#c084fc',
        life: 1.15,
        damage: 1,
        pierce: 0,
        drone: true,
      });
    }
  });
  game.drones = game.drones.filter((drone) => drone.life > 0);
}

function updateEnemies(game, dt) {
  let hitEdge = false;
  game.enemies.forEach((enemy) => {
    if (enemy.hp <= 0) return;
    enemy.hitTimer = Math.max(0, enemy.hitTimer - dt);
    const strafe = enemy.type === 'hunter' ? Math.sin(game.elapsed * 4.2 + enemy.phase) * 46 : 0;
    enemy.x += game.formationDir * game.formationSpeed * dt + strafe * dt;
    enemy.y = enemy.baseY + Math.sin(game.elapsed * (enemy.elite ? 3.5 : 2.6) + enemy.baseX * 0.01) * (enemy.elite ? 12 : 6) + (game.wave - 1) * 4;
    if (enemy.x < 58 || enemy.x > WIDTH - 58) hitEdge = true;
  });

  if (hitEdge) {
    game.formationDir *= -1;
    game.enemies.forEach((enemy) => {
      enemy.baseY += 22;
      enemy.y += 22;
    });
  }

  game.enemyFireTimer -= dt;
  if (game.enemyFireTimer <= 0) {
    const shooters = game.enemies.filter((enemy) => enemy.hp > 0);
    if (shooters.length > 0) {
      const index = Math.floor(seededUnit(Math.round(game.elapsed * 100), game.wave) * shooters.length);
      const shooter = shooters[index];
      enemyShoot(game, shooter, game.wave > 2 || shooter.type === 'hunter' || shooter.elite);
      if (shooter.type === 'sentinel' || shooter.elite) enemyShoot(game, shooter, true);
    }
    game.enemyFireTimer = clamp(1.25 - game.wave * 0.05, 0.42, 1.25);
  }

  if (game.enemies.some((enemy) => enemy.hp > 0 && enemy.y > PLAYER_Y - 80)) {
    damagePlayer(game, 120);
    game.enemies.forEach((enemy) => {
      enemy.baseY = Math.max(80, enemy.baseY - 90);
    });
  }
}

function updateBoss(game, dt) {
  const boss = game.boss;
  if (!boss || boss.hp <= 0) return;

  boss.hitTimer = Math.max(0, boss.hitTimer - dt);
  boss.x += boss.vx * dt;
  if (boss.x < 170 || boss.x > WIDTH - 170) {
    boss.vx *= -1;
    boss.x = clamp(boss.x, 170, WIDTH - 170);
  }
  boss.y = 118 + Math.sin(game.elapsed * 1.7) * 18;

  boss.fireTimer -= dt;
  boss.laserTimer -= dt;
  if (boss.fireTimer <= 0) {
    bossShoot(game, 0);
    boss.fireTimer = 0.75;
  }
  if (boss.laserTimer <= 0) {
    bossShoot(game, 1);
    boss.laserTimer = 3.2;
    game.message = 'Boss-Salve';
    game.messageTimer = 0.6;
  }
}

function barrierCellAt(game, projectile) {
  for (const barrier of game.barriers) {
    for (const cell of barrier.cells) {
      if (cell.hp <= 0) continue;
      if (Math.abs(projectile.x - cell.x) < 18 + projectile.radius && Math.abs(projectile.y - cell.y) < 14 + projectile.radius) {
        return { barrier, cell };
      }
    }
  }
  return null;
}

function resolveCollisions(game) {
  const player = game.player;

  game.bullets.forEach((bullet) => {
    if (bullet.hit) return;

    const boss = game.boss;
    if (boss && boss.hp > 0 && Math.abs(bullet.x - boss.x) < 116 && Math.abs(bullet.y - boss.y) < 56) {
      bullet.hit = true;
      boss.hp -= bullet.damage || 1;
      boss.hitTimer = 0.08;
      game.score += bullet.charged ? 54 + game.combo * 3 : 18 + game.combo * 2;
      spawnParticles(game, bullet.x, bullet.y, '#fef3c7', 5, 110);
      if (boss.hp <= 0) {
      game.score += 1700 + game.wave * 160;
      game.combo += 8;
      recordStat(game, 'bosses');
      recordStat(game, 'comboPeak', game.combo);
      game.player.overdrive = Math.min(100, game.player.overdrive + 45);
      game.message = 'Boss zerlegt';
        game.messageTimer = 1.5;
        spawnParticles(game, boss.x, boss.y, '#fb7185', 42, 330);
        maybeDropPowerup(game, boss.x, boss.y);
      }
      return;
    }

    const enemy = game.enemies.find((candidate) => candidate.hp > 0 && distance(bullet, candidate) < candidate.radius + bullet.radius);
    if (!enemy) return;
    bullet.pierce = Math.max(0, (bullet.pierce || 0) - 1);
    enemy.hp -= bullet.damage || 1;
    bullet.hit = enemy.hp > 0 || bullet.pierce <= 0;
    enemy.hitTimer = 0.1;
    spawnParticles(game, bullet.x, bullet.y, '#e0f2fe', 6, 120);
    if (enemy.hp <= 0) {
      if (game.mode === 'learn') handleLearnHit(game, enemy);
      destroyEnemy(game, enemy);
    }
  });

  game.bullets = game.bullets.filter((bullet) => !bullet.hit);
  game.enemies = game.enemies.filter((enemy) => enemy.hp > 0);

  game.enemyBullets.forEach((bullet) => {
    const barrierHit = barrierCellAt(game, bullet);
    if (barrierHit) {
      bullet.hit = true;
      barrierHit.cell.hp -= bullet.damage > 24 ? 2 : 1;
      barrierHit.barrier.repairPulse = 0.2;
      spawnParticles(game, barrierHit.cell.x, barrierHit.cell.y, '#86efac', 6, 120);
      return;
    }
    if (distance(bullet, player) < bullet.radius + 30) {
      bullet.hit = true;
      damagePlayer(game, bullet.damage);
    }
  });
  game.enemyBullets = game.enemyBullets.filter((bullet) => !bullet.hit);

  game.powerups.forEach((powerup) => {
    if (distance(powerup, player) < powerup.radius + 34) {
      powerup.collected = true;
      applyPowerup(game, powerup);
    }
  });
  game.powerups = game.powerups.filter((powerup) => !powerup.collected && powerup.y < HEIGHT + 40);

  if (game.enemies.length === 0 && (!game.boss || game.boss.hp <= 0) && !game.finished) {
    nextWave(game);
  }
}

function updatePowerups(game, dt) {
  game.powerups.forEach((powerup) => {
    powerup.y += powerup.vy * dt;
    powerup.x += Math.sin(game.elapsed * 5 + powerup.y * 0.02) * 18 * dt;
  });
}

function updateGame(game, input, dt) {
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.goalNoticeTimer = Math.max(0, game.goalNoticeTimer - dt);
  game.comboTimer = Math.max(0, game.comboTimer - dt);
  game.shake = Math.max(0, game.shake - dt);
  if (game.comboTimer <= 0) game.combo = 0;

  updateStars(game, dt);
  updateEffects(game, dt);

  if (!game.started || game.finished) return;
  updatePlayer(game, input, dt);
  updateBullets(game, input, dt);
  updateDrones(game, dt);
  game.barriers.forEach((barrier) => {
    barrier.repairPulse = Math.max(0, barrier.repairPulse - dt);
  });
  updateEnemies(game, dt);
  updateBoss(game, dt);
  updatePowerups(game, dt);
  resolveCollisions(game);
}

function drawBackground(ctx, game) {
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, '#020617');
  bg.addColorStop(0.48, '#071326');
  bg.addColorStop(1, '#0a1020');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.globalAlpha = 0.45;
  const nebula = ctx.createRadialGradient(WIDTH * 0.7, 140, 40, WIDTH * 0.7, 140, 460);
  nebula.addColorStop(0, 'rgba(124,58,237,.58)');
  nebula.addColorStop(0.42, 'rgba(14,165,233,.18)');
  nebula.addColorStop(1, 'rgba(2,6,23,0)');
  ctx.fillStyle = nebula;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();

  game.stars.forEach((star) => {
    ctx.fillStyle = `rgba(226,232,240,${star.alpha})`;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });

  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  for (let x = 0; x <= WIDTH; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, HEIGHT - 116);
    ctx.lineTo(lerp(WIDTH / 2, x, 1.8), HEIGHT);
    ctx.stroke();
  }
  for (let y = HEIGHT - 116; y < HEIGHT; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPlayer(ctx, game) {
  const player = game.player;
  const flicker = player.invulnerable > 0 && Math.floor(game.elapsed * 18) % 2 === 0;
  if (flicker) return;

  ctx.save();
  ctx.translate(player.x, player.y);
  if (player.dashTimer > 0) ctx.scale(1.16, 0.92);
  if (player.overdriveTimer > 0) {
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 36;
    ctx.strokeStyle = 'rgba(250,204,21,.72)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, -4, 58 + Math.sin(game.elapsed * 18) * 5, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.shadowColor = player.shield > 0 ? '#38bdf8' : '#facc15';
  ctx.shadowBlur = player.shield > 0 ? 26 : 14;
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.moveTo(0, -40);
  ctx.lineTo(34, 30);
  ctx.lineTo(12, 20);
  ctx.lineTo(0, 38);
  ctx.lineTo(-12, 20);
  ctx.lineTo(-34, 30);
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#0f172a';
  drawRoundedRect(ctx, -13, -6, 26, 24, 6);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-28, 22, 10, 8);
  ctx.fillRect(18, 22, 10, 8);
  if (player.shield > 0) {
    ctx.strokeStyle = `rgba(56,189,248,${0.35 + player.shield / 180})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, -2, 48, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawEnemy(ctx, enemy, elapsed) {
  const pulse = Math.sin(elapsed * 5 + enemy.x * 0.02) * 0.08;
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  ctx.scale(1 + pulse, 1 - pulse * 0.5);
  ctx.shadowColor = enemy.hitTimer > 0 ? '#fef3c7' : enemy.color;
  ctx.shadowBlur = enemy.hitTimer > 0 ? 26 : 12;
  ctx.fillStyle = enemy.hitTimer > 0 ? '#fef3c7' : enemy.color;
  ctx.beginPath();
  if (enemy.type === 'manta') {
    ctx.moveTo(0, -enemy.radius);
    ctx.lineTo(enemy.radius + 14, 8);
    ctx.lineTo(16, enemy.radius);
    ctx.lineTo(0, 14);
    ctx.lineTo(-16, enemy.radius);
    ctx.lineTo(-enemy.radius - 14, 8);
  } else {
    ctx.ellipse(0, 0, enemy.radius + 8, enemy.radius, 0, 0, Math.PI * 2);
  }
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.arc(-9, -4, 4, 0, Math.PI * 2);
  ctx.arc(9, -4, 4, 0, Math.PI * 2);
  ctx.fill();
  if (enemy.maxHp > 1) {
    ctx.fillStyle = 'rgba(2,6,23,.55)';
    drawRoundedRect(ctx, -22, enemy.radius + 8, 44, 5, 3);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    drawRoundedRect(ctx, -22, enemy.radius + 8, 44 * (enemy.hp / enemy.maxHp), 5, 3);
    ctx.fill();
  }
  if (enemy.elite) {
    ctx.strokeStyle = 'rgba(254,240,138,.9)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, enemy.radius + 14, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (enemy.label) {
    ctx.fillStyle = enemy.correct ? 'rgba(34,197,94,.92)' : 'rgba(51,65,85,.92)';
    drawRoundedRect(ctx, -46, -12, 92, 24, 9);
    ctx.fill();
    ctx.fillStyle = enemy.correct ? '#052e16' : '#f8fafc';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(enemy.label, 0, 0, 84);
  }
  ctx.restore();
}

function drawBoss(ctx, boss) {
  if (!boss || boss.hp <= 0) return;
  ctx.save();
  ctx.translate(boss.x, boss.y);
  ctx.shadowColor = boss.hitTimer > 0 ? '#fef3c7' : '#fb7185';
  ctx.shadowBlur = boss.hitTimer > 0 ? 32 : 24;
  ctx.fillStyle = boss.hitTimer > 0 ? '#fef3c7' : '#7f1d1d';
  drawRoundedRect(ctx, -120, -42, 240, 84, 30);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(-116, 0);
  ctx.lineTo(-172, 38);
  ctx.lineTo(-92, 28);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(116, 0);
  ctx.lineTo(172, 38);
  ctx.lineTo(92, 28);
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.arc(-42, -4, 11, 0, Math.PI * 2);
  ctx.arc(42, -4, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(2,6,23,.65)';
  drawRoundedRect(ctx, -122, 58, 244, 12, 6);
  ctx.fill();
  ctx.fillStyle = '#fb7185';
  drawRoundedRect(ctx, -122, 58, 244 * (boss.hp / boss.maxHp), 12, 6);
  ctx.fill();
  ctx.restore();
}

function drawBarriers(ctx, game) {
  game.barriers.forEach((barrier) => {
    barrier.cells.forEach((cell) => {
      if (cell.hp <= 0) return;
      const ratio = cell.hp / cell.maxHp;
      ctx.save();
      ctx.globalAlpha = 0.42 + ratio * 0.52;
      ctx.shadowColor = barrier.repairPulse > 0 ? '#bbf7d0' : '#38bdf8';
      ctx.shadowBlur = barrier.repairPulse > 0 ? 20 : 10;
      ctx.fillStyle = ratio > 0.55 ? '#38bdf8' : '#64748b';
      drawRoundedRect(ctx, cell.x - 13, cell.y - 10, 26, 20, 6);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = 'rgba(2,6,23,.35)';
      ctx.fillRect(cell.x - 8, cell.y - 6, 16, 4);
      ctx.restore();
    });
  });
}

function drawDrones(ctx, game) {
  game.drones.forEach((drone) => {
    ctx.save();
    ctx.translate(drone.x, drone.y);
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(248,250,252,.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 18 + Math.sin(game.elapsed * 8 + drone.side) * 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
}

function drawProjectiles(ctx, game) {
  game.bullets.forEach((bullet) => {
    ctx.save();
    ctx.shadowColor = bullet.color;
    ctx.shadowBlur = bullet.charged ? 30 : 16;
    ctx.fillStyle = bullet.color;
    drawRoundedRect(ctx, bullet.x - bullet.radius, bullet.y - (bullet.charged ? 24 : 16), bullet.radius * 2, bullet.charged ? 44 : 28, bullet.radius);
    ctx.fill();
    ctx.restore();
  });

  game.enemyBullets.forEach((bullet) => {
    ctx.save();
    ctx.shadowColor = bullet.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawPowerups(ctx, game) {
  game.powerups.forEach((powerup) => {
    ctx.save();
    ctx.translate(powerup.x, powerup.y);
    ctx.shadowColor = powerup.color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = powerup.color;
    ctx.beginPath();
    ctx.arc(0, 0, powerup.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#020617';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(powerup.kind === 'multi' ? '3' : powerup.kind === 'shield' ? 'S' : powerup.kind === 'repair' ? 'R' : powerup.kind === 'drone' ? 'D' : 'C', 0, 1);
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
    ctx.font = '900 17px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(floater.text, floater.x, floater.y);
    ctx.restore();
  });
}

function drawGauge(ctx, x, y, w, label, value, color) {
  ctx.fillStyle = 'rgba(148,163,184,.16)';
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
  const player = game.player;
  const activeGoals = game.goals.slice(0, 4);
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, 24, 22, 430, game.mode === 'learn' ? 154 : 124, 18);
  ctx.fill();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '900 24px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Invaders Pro: Learncade' : 'Faska Invaders Pro', 48, 58);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '800 14px Outfit, sans-serif';
  ctx.fillText(`Welle ${game.wave}  Score ${game.score}  High ${Math.max(game.highScore, game.score)}`, 48, 86);

  if (game.mode === 'learn') {
    const task = currentTask(game);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.fillText(`${task.subject} - ${task.kind}`, 48, 112);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 16px Outfit, sans-serif';
    ctx.fillText(task.prompt, 48, 136, 374);
  }

  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, WIDTH - 448, 22, 424, 254, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 18px Outfit, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`Leben ${player.lives}  Combo x${Math.max(1, game.combo)}`, WIDTH - 48, 58);
  ctx.fillStyle = '#67e8f9';
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? `Richtig ${game.correctAnswers}  Fehler ${game.wrongAnswers}  Serie ${game.learnStreak}` : 'Space Feuer  X Charge  Shift Dash  E Overdrive', WIDTH - 48, 86);
  ctx.textAlign = 'left';
  drawGauge(ctx, WIDTH - 420, 101, 92, 'HITZE', player.heat, player.overheated ? '#ef4444' : '#f97316');
  drawGauge(ctx, WIDTH - 310, 101, 92, 'SCHILD', player.shield, '#38bdf8');
  drawGauge(ctx, WIDTH - 200, 101, 68, 'DASH', player.dashCooldown <= 0 ? 100 : (1 - player.dashCooldown / 1.1) * 100, '#facc15');
  drawGauge(ctx, WIDTH - 116, 101, 68, 'OD', player.overdriveTimer > 0 ? 100 : player.overdrive, player.overdriveTimer > 0 ? '#fef08a' : '#a78bfa');
  drawGauge(ctx, WIDTH - 420, 139, 118, 'CHARGE', player.charge, '#67e8f9');
  drawGauge(ctx, WIDTH - 284, 139, 118, 'BARRIER', game.barriers.reduce((sum, barrier) => sum + barrier.cells.filter((cell) => cell.hp > 0).length, 0) / Math.max(1, game.barriers.reduce((sum, barrier) => sum + barrier.cells.length, 0)) * 100, '#86efac');
  ctx.fillStyle = '#c4b5fd';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText(`Drohnen ${game.drones.length}`, WIDTH - 146, 166);
  activeGoals.forEach((goal, index) => {
    const y = 188 + index * 18;
    const value = Math.min(game.stats[goal.stat] || 0, goal.target);
    ctx.fillStyle = goal.completed ? '#86efac' : '#e2e8f0';
    ctx.font = '800 12px Outfit, sans-serif';
    ctx.fillText(`${goal.completed ? 'DONE' : `${value}/${goal.target}`}  ${goal.label}`, WIDTH - 420, y);
  });

  if (game.goalNoticeTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(15,23,42,.82)';
    drawRoundedRect(ctx, WIDTH / 2 - 244, 166, 488, 46, 16);
    ctx.fill();
    ctx.fillStyle = '#86efac';
    ctx.font = '900 19px Outfit, sans-serif';
    ctx.fillText(game.goalNotice, WIDTH / 2, 194);
  }

  ctx.fillStyle = 'rgba(2,6,23,.72)';
  drawRoundedRect(ctx, 24, HEIGHT - 58, 766, 38, 14);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText('A/D oder Pfeile bewegen - Space Feuer - X/F Charge-Shot - Shift Dash - E Overdrive - M Normal/Learncade', 44, HEIGHT - 34);
  ctx.restore();
}

function drawStartOverlay(ctx, game) {
  if (game.started && !game.finished) return;
  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,.72)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 52px Outfit, sans-serif';
  ctx.fillText(game.finished ? game.message : 'FASKA INVADERS PRO', WIDTH / 2, 262);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '800 18px Outfit, sans-serif';
  const subline = game.finished
    ? `Score ${game.score} - Highscore ${Math.max(game.highScore, game.score)}`
    : 'Wellen-Shooter mit Bossen, Deckungsbarrieren, Drohnen, Charge-Shots, Overdrive, Missionen und Learncade-Variante.';
  ctx.fillText(subline, WIDTH / 2, 302);
  if (!game.finished) {
    ctx.fillStyle = '#67e8f9';
    ctx.font = '900 16px Outfit, sans-serif';
    ctx.fillText('Waehle oben Normal oder Learncade. X/F laedt den Charge-Shot.', WIDTH / 2, 334);
  }
  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  if (game.shake > 0) {
    const amount = game.shake * 22;
    ctx.translate((seededUnit(Math.round(game.elapsed * 1000), 1) - 0.5) * amount, (seededUnit(Math.round(game.elapsed * 1000), 2) - 0.5) * amount);
  }
  drawBackground(ctx, game);
  game.enemies.forEach((enemy) => drawEnemy(ctx, enemy, game.elapsed));
  drawBoss(ctx, game.boss);
  drawBarriers(ctx, game);
  drawPowerups(ctx, game);
  drawProjectiles(ctx, game);
  drawDrones(ctx, game);
  drawPlayer(ctx, game);
  drawEffects(ctx, game);
  ctx.restore();
  drawHud(ctx, game);

  if (game.messageTimer > 0 && (game.started || game.finished)) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.68)';
    drawRoundedRect(ctx, WIDTH / 2 - 308, HEIGHT / 2 - 34, 616, 54, 18);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 24px Outfit, sans-serif';
    ctx.fillText(game.message, WIDTH / 2, HEIGHT / 2);
    ctx.restore();
  }

  drawStartOverlay(ctx, game);
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

const touchButton = {
  width: 72,
  height: 64,
  borderRadius: 18,
  border: '1px solid rgba(255,255,255,.2)',
  background: 'rgba(15,23,42,.76)',
  color: '#f8fafc',
  fontSize: 20,
  fontWeight: 900,
  touchAction: 'none',
};

export default function FaskaSpaceInvadersSwarm() {
  const canvasRef = useRef(null);
  const modeRef = useRef('arcade');
  const gameRef = useRef(makeInitialGame('arcade'));
  const keysRef = useRef({ left: false, right: false, fire: false, dash: false, special: false, charge: false });
  const touchRef = useRef({ left: false, right: false, fire: false, dash: false, special: false, charge: false });
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
      ? 'Richtige Antwort-Invader treffen, Barrieren schuetzen.'
      : 'Wellen ueberleben, Charge-Shots und Drohnen nutzen.';
    gameRef.current.messageTimer = 2.1;
    syncUi();
  }, [syncUi]);

  const restartGame = useCallback(() => {
    startGame(modeRef.current);
  }, [startGame]);

  const exitGame = useCallback(() => {
    window.history.back();
  }, []);

  const setMode = useCallback((nextMode) => {
    startGame(nextMode);
  }, [startGame]);

  useEffect(() => {
    const down = (event) => {
      const key = event.key.toLowerCase();
      if (['arrowleft', 'arrowright', 'a', 'd', ' ', 'shift', 'e', 'x', 'f', 'm'].includes(key)) event.preventDefault();
      if (key === 'arrowleft' || key === 'a') keysRef.current.left = true;
      if (key === 'arrowright' || key === 'd') keysRef.current.right = true;
      if (key === ' ') keysRef.current.fire = true;
      if (key === 'shift') keysRef.current.dash = true;
      if (key === 'e') keysRef.current.special = true;
      if (key === 'x' || key === 'f') keysRef.current.charge = true;
      if (key === 'm') startGame(modeRef.current === 'learn' ? 'arcade' : 'learn');
    };
    const up = (event) => {
      const key = event.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') keysRef.current.left = false;
      if (key === 'arrowright' || key === 'd') keysRef.current.right = false;
      if (key === ' ') keysRef.current.fire = false;
      if (key === 'shift') keysRef.current.dash = false;
      if (key === 'e') keysRef.current.special = false;
      if (key === 'x' || key === 'f') keysRef.current.charge = false;
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
      const keys = keysRef.current;
      const touch = touchRef.current;
      updateGame(gameRef.current, {
        left: keys.left || touch.left,
        right: keys.right || touch.right,
        fire: keys.fire || touch.fire,
        dash: keys.dash || touch.dash,
        special: keys.special || touch.special,
        charge: keys.charge || touch.charge,
      }, dt);
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
      touchRef.current[key] = true;
    },
    onPointerUp: (event) => {
      event.preventDefault();
      touchRef.current[key] = false;
    },
    onPointerCancel: () => {
      touchRef.current[key] = false;
    },
    onPointerLeave: () => {
      touchRef.current[key] = false;
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

      <div className="invaders-touch-controls" style={{
        position: 'fixed',
        left: 22,
        bottom: 22,
        display: 'flex',
        gap: 12,
        zIndex: 6,
      }}>
        <button type="button" aria-label="Links" style={touchButton} {...holdButton('left')}>L</button>
        <button type="button" aria-label="Rechts" style={touchButton} {...holdButton('right')}>R</button>
      </div>
      <div className="invaders-touch-controls" style={{
        position: 'fixed',
        right: 22,
        bottom: 22,
        display: 'flex',
        gap: 12,
        zIndex: 6,
      }}>
        <button type="button" aria-label="Overdrive" style={{ ...touchButton, background: 'rgba(168,85,247,.78)', color: '#f8fafc' }} {...holdButton('special')}>OD</button>
        <button type="button" aria-label="Charge" style={{ ...touchButton, background: 'rgba(103,232,249,.78)', color: '#082f49' }} {...holdButton('charge')}>Chg</button>
        <button type="button" aria-label="Dash" style={{ ...touchButton, background: 'rgba(250,204,21,.76)', color: '#111827' }} {...holdButton('dash')}>Dash</button>
        <button type="button" aria-label="Feuer" style={{ ...touchButton, background: 'rgba(34,197,94,.82)', color: '#052e16' }} {...holdButton('fire')}>Fire</button>
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
        }}>
          <button type="button" onClick={() => setMode('arcade')} style={{ ...buttonBase, padding: '15px 30px', background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
            Normal starten
          </button>
          <button type="button" onClick={() => setMode('learn')} style={{ ...buttonBase, padding: '15px 30px', background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
            Learncade starten
          </button>
        </div>
      )}

      <style>{`
        @media (pointer: fine), (min-width: 900px) {
          .invaders-touch-controls {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
