import { useCallback, useEffect, useRef, useState } from 'react';
import GameFxOverlay from '../../../../shared/GameFxOverlay';

const WIDTH = 1280;
const HEIGHT = 720;
const COLS = 24;
const ROWS = 18;
const CELL = 30;
const BOARD_X = 280;
const BOARD_Y = 90;
const BOARD_W = COLS * CELL;
const BOARD_H = ROWS * CELL;

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
    prompt: 'Welche Wortart ist "Stern"?',
    correct: 'Nomen',
    options: ['Artikel', 'Verb', 'Nomen', 'Adjektiv'],
  },
  {
    subject: 'Deutsch',
    kind: 'Satzbau',
    prompt: 'Was passt: Der Drache ___ langsam.',
    correct: 'schleicht',
    options: ['schleicht', 'unter', 'gruene', 'acht'],
  },
  {
    subject: 'Mathe',
    kind: 'Ergebnis',
    prompt: '8 x 7 = ?',
    correct: '56',
    options: ['48', '54', '56', '64'],
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    prompt: 'Was bedeutet "river"?',
    correct: 'Fluss',
    options: ['Fluss', 'Bruecke', 'Schwert', 'Wolke'],
  },
  {
    subject: 'Lesen',
    kind: 'Ort',
    prompt: 'Wo wartet ein Zug?',
    correct: 'Bahnhof',
    options: ['Bahnhof', 'Bibliothek', 'Park', 'Werkstatt'],
  },
  {
    subject: 'Sachkunde',
    kind: 'Kategorie',
    prompt: 'Was ist die Erde?',
    correct: 'Planet',
    options: ['Planet', 'Stern', 'Gas', 'Metall'],
  },
  {
    subject: 'Deutsch',
    kind: 'Praeposition',
    prompt: 'In "hinter dem Tor" ist "hinter" eine ...',
    correct: 'Praeposition',
    options: ['Nomen', 'Verb', 'Praeposition', 'Adjektiv'],
  },
  {
    subject: 'Lesen',
    kind: 'Erste Klasse',
    prompt: 'Finde das Wort: Die Sonne ist ...',
    correct: 'hell',
    options: ['hell', 'weich', 'leise', 'rundum'],
  },
  {
    subject: 'Deutsch',
    kind: 'Kompositum',
    prompt: 'Was passt zu "Schul..."?',
    correct: 'tasche',
    options: ['tasche', 'laufen', 'blau', 'unter'],
  },
  {
    subject: 'Deutsch',
    kind: 'Satzglied',
    prompt: 'Wer oder was? "Der Hund bellt."',
    correct: 'Der Hund',
    options: ['Der Hund', 'bellt', 'laut', 'im Hof'],
  },
  {
    subject: 'Mathe',
    kind: 'Plus',
    prompt: '37 + 18 = ?',
    correct: '55',
    options: ['45', '55', '56', '65'],
  },
  {
    subject: 'Sachkunde',
    kind: 'Natur',
    prompt: 'Was braucht eine Pflanze?',
    correct: 'Licht',
    options: ['Licht', 'Sandglas', 'Schnee', 'Rauch'],
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    prompt: 'Was bedeutet "forest"?',
    correct: 'Wald',
    options: ['Wald', 'Fenster', 'Kuchen', 'Stuhl'],
  },
];

const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const MISSION_GOALS = [
  {
    id: 'combo',
    label: 'Combo 8',
    reward: 'Schild +1',
    check: (game) => game.comboBest >= 8,
    apply: (game) => {
      game.shield = Math.min(5, game.shield + 1);
    },
  },
  {
    id: 'dash',
    label: '3 Dash-Linien',
    reward: 'Pulse +35',
    check: (game) => game.mission.dashUses >= 3,
    apply: (game) => {
      game.pulseEnergy = Math.min(100, game.pulseEnergy + 35);
    },
  },
  {
    id: 'rival',
    label: 'Rivalen 3x treffen',
    reward: 'Fever',
    check: (game) => game.mission.rivalHits >= 3,
    apply: (game) => {
      game.fever = Math.max(game.fever, 7);
    },
  },
  {
    id: 'guardian',
    label: 'Guardian besiegen',
    reward: '1200 Punkte',
    check: (game) => game.mission.guardianDefeated,
    apply: (game) => {
      game.score += 1200;
    },
  },
  {
    id: 'perfectLearn',
    label: '5 richtige ohne Fehler',
    reward: 'Extra-Leben',
    check: (game) => game.mode === 'learn' && game.correct >= 5 && game.wrong === 0,
    apply: (game) => {
      game.lives = Math.min(5, game.lives + 1);
    },
  },
];

const ARENA_CONTRACTS = [
  {
    id: 'foodSprint',
    label: '4 Futter in Serie',
    stat: 'food',
    target: 4,
    seconds: 36,
    reward: { score: 720, pulse: 18, magnet: 2.5 },
  },
  {
    id: 'comboFlow',
    label: 'Combo 6 halten',
    stat: 'combo',
    target: 6,
    seconds: 46,
    reward: { score: 900, shield: 1, fever: 3.5 },
  },
  {
    id: 'dashLine',
    label: '2 Dash-Linien',
    stat: 'dash',
    target: 2,
    seconds: 42,
    reward: { score: 760, pulse: 24 },
  },
  {
    id: 'pulseStrike',
    label: '3 Pulse-Treffer',
    stat: 'pulse',
    target: 3,
    seconds: 52,
    reward: { score: 850, fever: 3, slowmo: 3 },
  },
  {
    id: 'hazardSweep',
    label: '2 Felder entschärfen',
    stat: 'hazard',
    target: 2,
    seconds: 48,
    reward: { score: 680, pulse: 22, shield: 1 },
  },
  {
    id: 'rivalHunt',
    label: '2 Rivalen-Treffer',
    stat: 'rival',
    target: 2,
    seconds: 50,
    reward: { score: 980, fever: 4 },
  },
  {
    id: 'guardianRaid',
    label: '3 Guardian-Treffer',
    stat: 'guardian',
    target: 3,
    seconds: 62,
    reward: { score: 1300, shield: 2, pulse: 18 },
  },
  {
    id: 'learnClean',
    label: '3 richtige Antworten',
    stat: 'learn',
    target: 3,
    seconds: 52,
    mode: 'learn',
    reward: { score: 1050, shield: 1, pulse: 22, fever: 4 },
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const sameCell = (a, b) => a.x === b.x && a.y === b.y;
const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const isProtectedStartLane = (cell) => cell.y === 9 && cell.x >= 9 && cell.x <= 18;

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

function seededUnit(index, salt) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function readHighScore() {
  try {
    return Number(window.localStorage.getItem('faska_snake_highscore') || 0);
  } catch {
    return 0;
  }
}

function writeHighScore(score) {
  try {
    if (score > readHighScore()) window.localStorage.setItem('faska_snake_highscore', String(score));
  } catch {
    // localStorage can be unavailable in private contexts.
  }
}

function currentTask(game) {
  return LEARN_TASKS[game.learnIndex % LEARN_TASKS.length];
}

function occupiedSet(game, includeSnake = true) {
  const set = new Set();
  if (includeSnake) game.snake.forEach((part) => set.add(`${part.x},${part.y}`));
  game.walls.forEach((wall) => set.add(`${wall.x},${wall.y}`));
  game.foods.forEach((food) => set.add(`${food.x},${food.y}`));
  game.hazards?.forEach((hazard) => set.add(`${hazard.x},${hazard.y}`));
  game.rivals?.forEach((rival) => rival.body.forEach((part) => set.add(`${part.x},${part.y}`)));
  if (game.guardian?.alive) game.guardian.body.forEach((part) => set.add(`${part.x},${part.y}`));
  return set;
}

function randomFreeCell(game, salt = 1) {
  const occupied = occupiedSet(game);
  for (let attempts = 0; attempts < 180; attempts += 1) {
    const x = 1 + Math.floor(seededUnit(game.seed + attempts, salt) * (COLS - 2));
    const y = 1 + Math.floor(seededUnit(game.seed + attempts, salt + 3) * (ROWS - 2));
    if (!occupied.has(`${x},${y}`)) {
      game.seed += attempts + 1;
      return { x, y };
    }
  }
  return { x: 2, y: 2 };
}

function makeWalls(level = 1) {
  const walls = [];
  if (level >= 2) {
    for (let y = 4; y < ROWS - 4; y += 1) {
      if (y !== 8 && y !== 9) walls.push({ x: 7, y });
    }
  }
  if (level >= 3) {
    for (let x = 12; x < COLS - 3; x += 1) {
      if (x !== 16 && x !== 17) walls.push({ x, y: 5 });
    }
  }
  if (level >= 5) {
    for (let y = 7; y < ROWS - 2; y += 1) {
      if (y !== 11) walls.push({ x: 18, y });
    }
  }
  return walls;
}

function makeHazards(level = 1) {
  const hazards = [];
  if (level >= 2) {
    for (let x = 10; x <= 14; x += 1) {
      hazards.push({
        x,
        y: 12,
        type: 'pulse',
        phase: x * 0.17,
        period: 1.7,
        active: false,
        disabled: 0,
      });
    }
  }
  if (level >= 3) {
    for (let y = 3; y <= 8; y += 1) {
      if (y !== 6) {
        hazards.push({
          x: 20,
          y,
          type: 'laser',
          phase: y * 0.19,
          period: 2.1,
          active: false,
          disabled: 0,
        });
      }
    }
  }
  if (level >= 5) {
    for (let x = 3; x <= 7; x += 1) {
      hazards.push({
        x,
        y: 3,
        type: 'shock',
        phase: x * 0.23,
        period: 1.45,
        active: false,
        disabled: 0,
      });
    }
  }
  return hazards;
}

function makeRivals(level = 1, mode = 'arcade') {
  const rivals = [{
    id: 'rival_alpha',
    name: mode === 'learn' ? 'Quiz-Waechter' : 'Rival Snake',
    body: [
      { x: 21, y: 14 },
      { x: 22, y: 14 },
      { x: 23, y: 14 },
      { x: 23, y: 15 },
    ],
    direction: 'left',
    hp: mode === 'learn' ? 2 : 4,
    freeze: 0,
    moveEvery: mode === 'learn' ? 0.52 : 0.42,
    moveTimer: 0,
    color: mode === 'learn' ? '#38bdf8' : '#fb7185',
  }];

  if (level >= 4) {
    rivals.push({
      id: 'rival_beta',
      name: 'Gold-Schatten',
      body: [
        { x: 4, y: 15 },
        { x: 3, y: 15 },
        { x: 2, y: 15 },
      ],
      direction: 'right',
      hp: 3,
      freeze: 0,
      moveEvery: 0.48,
      moveTimer: 0,
      color: '#facc15',
    });
  }

  return rivals;
}

function makeGuardian(level = 1) {
  if (level < 4) return null;
  return {
    alive: true,
    hp: 7,
    maxHp: 7,
    direction: 'left',
    moveEvery: 0.62,
    moveTimer: 0,
    freeze: 0,
    body: [
      { x: 21, y: 4 },
      { x: 22, y: 4 },
      { x: 22, y: 5 },
      { x: 22, y: 6 },
      { x: 21, y: 6 },
    ],
  };
}

function makeInitialGame(mode = 'arcade') {
  const game = {
    mode,
    started: false,
    finished: false,
    elapsed: 0,
    snake: [
      { x: 8, y: 9 },
      { x: 7, y: 9 },
      { x: 6, y: 9 },
      { x: 5, y: 9 },
    ],
    direction: 'right',
    pendingDirection: 'right',
    foods: [],
    walls: [],
    hazards: [],
    rivals: [],
    guardian: null,
    particles: [],
    floaters: [],
    seed: 1,
    score: 0,
    highScore: readHighScore(),
    level: 1,
    targetFood: mode === 'learn' ? 18 : 28,
    eaten: 0,
    combo: 0,
    comboBest: 0,
    moveTimer: 0,
    moveInterval: mode === 'learn' ? 0.15 : 0.13,
    shield: mode === 'learn' ? 2 : 1,
    slowmo: 0,
    magnet: 0,
    fever: 0,
    dashQueued: false,
    dashActive: false,
    dashCooldown: 0,
    pulseQueued: false,
    pulseCooldown: 0,
    pulseEnergy: mode === 'learn' ? 65 : 45,
    foodDriftTimer: 0,
    lives: 3,
    learnIndex: 0,
    correct: 0,
    wrong: 0,
    contract: null,
    contractIndex: -1,
    contractProgress: 0,
    contractTimer: 0,
    contractCooldown: 0.8,
    contractMedals: 0,
    contractFails: 0,
    mission: {
      dashUses: 0,
      rivalHits: 0,
      hazardsCleared: 0,
      guardianDefeated: false,
      rewards: [],
    },
    message: mode === 'learn'
      ? 'Sammle richtige Antworten und erfuell Arena-Auftraege.'
      : 'Sammle Futter, erfuell Auftraege und bezwinge die Arena.',
    messageTimer: 2.2,
    shake: 0,
  };
  game.walls = makeWalls(game.level);
  game.hazards = makeHazards(game.level);
  game.rivals = makeRivals(game.level, game.mode);
  game.guardian = makeGuardian(game.level);
  spawnFoods(game);
  return game;
}

function spawnFoods(game) {
  game.foods = [];
  if (game.mode === 'learn') {
    const task = currentTask(game);
    const offset = Math.floor(seededUnit(game.learnIndex + 4, game.seed + 2) * task.options.length);
    task.options.forEach((_, index) => {
      const label = task.options[(index + offset) % task.options.length];
      let cell = randomFreeCell(game, index + 12);
      for (let retry = 0; retry < 8 && isProtectedStartLane(cell); retry += 1) {
        cell = randomFreeCell(game, index + 32 + retry);
      }
      game.foods.push({
        ...cell,
        id: `food_${game.seed}_${index}`,
        kind: label === task.correct ? 'correct' : 'wrong',
        label,
        correct: label === task.correct,
        color: label === task.correct ? '#22c55e' : '#64748b',
        points: label === task.correct ? 500 : -160,
      });
    });
    return;
  }

  const normalCount = clamp(3 + Math.floor(game.level / 2), 3, 7);
  for (let i = 0; i < normalCount; i += 1) {
    const cell = randomFreeCell(game, i + 20);
    const roll = seededUnit(game.seed + i, game.level + 9);
    const kind = roll > 0.93 ? 'pulse' : roll > 0.84 ? 'dash' : roll > 0.74 ? 'portal' : roll > 0.6 ? 'power' : roll > 0.44 ? 'bonus' : 'normal';
    game.foods.push({
      ...cell,
      id: `food_${game.seed}_${i}`,
      kind,
      label: kind === 'portal' ? 'P' : kind === 'power' ? 'S' : kind === 'bonus' ? 'B' : kind === 'dash' ? 'D' : kind === 'pulse' ? 'X' : '',
      color: kind === 'portal' ? '#a78bfa' : kind === 'power' ? '#38bdf8' : kind === 'bonus' ? '#facc15' : kind === 'dash' ? '#fb923c' : kind === 'pulse' ? '#f472b6' : '#22c55e',
      points: kind === 'bonus' ? 260 : kind === 'pulse' ? 220 : kind === 'dash' ? 180 : kind === 'power' ? 140 : kind === 'portal' ? 80 : 100,
    });
  }
}

function addFloater(game, cell, text, color = '#facc15') {
  game.floaters.push({
    x: BOARD_X + cell.x * CELL + CELL / 2,
    y: BOARD_Y + cell.y * CELL,
    text,
    color,
    life: 1,
    maxLife: 1,
    vy: -44,
  });
}

function spawnParticles(game, cell, color, count = 12, speed = 150) {
  const x = BOARD_X + cell.x * CELL + CELL / 2;
  const y = BOARD_Y + cell.y * CELL + CELL / 2;
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed;
    const burst = speed * (0.36 + (i % 4) * 0.14);
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

function isActiveHazard(hazard) {
  return hazard.active && hazard.disabled <= 0;
}

function cellIsStaticBlocked(game, cell) {
  if (cell.x < 0 || cell.x >= COLS || cell.y < 0 || cell.y >= ROWS) return true;
  if (game.walls.some((wall) => sameCell(wall, cell))) return true;
  return game.hazards.some((hazard) => isActiveHazard(hazard) && sameCell(hazard, cell));
}

function canHoldFood(game, cell, movingFood) {
  if (cell.x < 0 || cell.x >= COLS || cell.y < 0 || cell.y >= ROWS) return false;
  if (game.snake.some((part) => sameCell(part, cell))) return false;
  if (game.walls.some((wall) => sameCell(wall, cell))) return false;
  if (game.hazards.some((hazard) => isActiveHazard(hazard) && sameCell(hazard, cell))) return false;
  if (game.rivals.some((rival) => rival.body.some((part) => sameCell(part, cell)))) return false;
  if (game.guardian?.alive && game.guardian.body.some((part) => sameCell(part, cell))) return false;
  return !game.foods.some((food) => food !== movingFood && sameCell(food, cell));
}

function chooseDirectionToward(game, head, target, currentDirection, salt) {
  const reverse = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
  }[currentDirection];
  const options = Object.entries(DIRECTIONS)
    .filter(([direction]) => direction !== reverse)
    .map(([direction, vector], index) => {
      const next = { x: head.x + vector.x, y: head.y + vector.y };
      return {
        direction,
        next,
        score: manhattan(next, target) + seededUnit(game.seed + index, salt) * 0.35,
      };
    })
    .filter((option) => !cellIsStaticBlocked(game, option.next))
    .sort((a, b) => a.score - b.score);
  return options[0] || {
    direction: currentDirection,
    next: { ...head },
  };
}

function damageRival(game, rival, amount, sourceCell) {
  if (rival.defeated) return;
  rival.hp -= amount;
  rival.freeze = Math.max(rival.freeze, 0.9);
  game.mission.rivalHits += 1;
  advanceContract(game, 'rival', amount, sourceCell);
  game.score += 220 * amount;
  game.pulseEnergy = Math.min(100, game.pulseEnergy + 8);
  spawnParticles(game, sourceCell, rival.color, 20, 220);
  addFloater(game, sourceCell, '-HP', rival.color);
  if (rival.hp <= 0) {
    rival.defeated = true;
    game.score += 650;
    game.fever = Math.max(game.fever, 4);
    game.message = `${rival.name} besiegt`;
    game.messageTimer = 1.1;
  }
}

function damageGuardian(game, amount, sourceCell) {
  const guardian = game.guardian;
  if (!guardian?.alive) return;
  guardian.hp -= amount;
  guardian.freeze = Math.max(guardian.freeze, 0.8);
  advanceContract(game, 'guardian', amount, sourceCell);
  game.score += 320 * amount;
  spawnParticles(game, sourceCell, '#f97316', 28, 260);
  addFloater(game, sourceCell, `Guardian -${amount}`, '#f97316');
  if (guardian.hp <= 0) {
    guardian.alive = false;
    game.mission.guardianDefeated = true;
    game.score += 1400;
    game.shield = Math.min(5, game.shield + 2);
    game.message = 'Guardian besiegt - Arena offen';
    game.messageTimer = 1.5;
    spawnParticles(game, sourceCell, '#facc15', 44, 320);
  }
}

function activatePulse(game) {
  if (game.pulseCooldown > 0 || game.pulseEnergy < 35) {
    game.message = game.pulseCooldown > 0 ? 'Pulse laedt noch' : 'Zu wenig Pulse-Energie';
    game.messageTimer = 0.75;
    return;
  }

  const head = game.snake[0];
  game.pulseEnergy -= 35;
  game.pulseCooldown = 3.4;
  game.shake = 0.12;
  let hits = 0;

  game.hazards.forEach((hazard) => {
    if (manhattan(head, hazard) <= 3) {
      hazard.disabled = Math.max(hazard.disabled, 2.7);
      hazard.active = false;
      hits += 1;
      advanceContract(game, 'hazard', 1, hazard);
      game.mission.hazardsCleared += 1;
      spawnParticles(game, hazard, '#38bdf8', 10, 160);
    }
  });

  game.rivals.forEach((rival) => {
    const nearest = rival.body.reduce((best, part) => (manhattan(head, part) < manhattan(head, best) ? part : best), rival.body[0]);
    if (nearest && manhattan(head, nearest) <= 5) {
      damageRival(game, rival, 1, nearest);
      hits += 1;
    }
  });

  if (game.guardian?.alive) {
    const nearestGuardian = game.guardian.body.reduce((best, part) => (manhattan(head, part) < manhattan(head, best) ? part : best), game.guardian.body[0]);
    if (nearestGuardian && manhattan(head, nearestGuardian) <= 5) {
      damageGuardian(game, 1, nearestGuardian);
      hits += 1;
    }
  }

  spawnParticles(game, head, '#38bdf8', 38, 290);
  if (hits > 0) advanceContract(game, 'pulse', hits, head);
  addFloater(game, head, hits > 0 ? `Pulse x${hits}` : 'Pulse', '#38bdf8');
  game.message = hits > 0 ? `Pulse trifft ${hits} Ziele` : 'Pulse-Welle aktiviert';
  game.messageTimer = 0.9;
  game.rivals = game.rivals.filter((rival) => !rival.defeated);
}

function updateHazards(game, dt) {
  game.hazards.forEach((hazard) => {
    hazard.disabled = Math.max(0, hazard.disabled - dt);
    const phase = ((game.elapsed + hazard.phase) % hazard.period) / hazard.period;
    hazard.active = hazard.disabled <= 0 && phase > 0.48;
  });
}

function moveRivals(game, dt) {
  const head = game.snake[0];
  game.rivals.forEach((rival, index) => {
    rival.freeze = Math.max(0, rival.freeze - dt);
    rival.moveTimer += dt;
    if (rival.freeze > 0 || rival.moveTimer < rival.moveEvery) return;
    rival.moveTimer = 0;
    const choice = chooseDirectionToward(game, rival.body[0], head, rival.direction, 17 + index);
    rival.direction = choice.direction;
    rival.body = [choice.next, ...rival.body.slice(0, -1)];
    if (rival.body.some((part) => game.snake.some((snakePart) => sameCell(part, snakePart)))) {
      handleCrash(game, head, `${rival.name} beruehrt`);
    }
  });
  game.rivals = game.rivals.filter((rival) => !rival.defeated);
}

function moveGuardian(game, dt) {
  const guardian = game.guardian;
  if (!guardian?.alive) return;
  guardian.freeze = Math.max(0, guardian.freeze - dt);
  guardian.moveTimer += dt;
  if (guardian.freeze > 0 || guardian.moveTimer < guardian.moveEvery) return;
  guardian.moveTimer = 0;
  const head = game.snake[0];
  const choice = chooseDirectionToward(game, guardian.body[0], head, guardian.direction, 49);
  guardian.direction = choice.direction;
  guardian.body = [choice.next, ...guardian.body.slice(0, -1)];
  if (guardian.body.some((part) => game.snake.some((snakePart) => sameCell(part, snakePart)))) {
    handleCrash(game, head, 'Guardian-Kiefer');
  }
}

function driftFoodWithMagnet(game, dt) {
  if (game.magnet <= 0 || game.foods.length === 0) return;
  game.foodDriftTimer += dt;
  if (game.foodDriftTimer < 0.18) return;
  game.foodDriftTimer = 0;
  const head = game.snake[0];
  game.foods.forEach((food) => {
    if (food.kind === 'wrong' || manhattan(food, head) > 7) return;
    const step = {
      x: food.x + Math.sign(head.x - food.x),
      y: food.y + Math.sign(head.y - food.y),
    };
    if (canHoldFood(game, step, food)) {
      food.x = step.x;
      food.y = step.y;
    }
  });
}

function startNextContract(game) {
  const candidates = ARENA_CONTRACTS.filter((contract) => {
    if (contract.mode && contract.mode !== game.mode) return false;
    if (contract.id === 'guardianRaid' && !game.guardian?.alive) return false;
    if (contract.id === 'rivalHunt' && game.rivals.length === 0) return false;
    if (contract.id === 'hazardSweep' && game.hazards.length === 0) return false;
    return true;
  });
  if (candidates.length === 0) return;
  game.contractIndex += 1;
  game.contract = candidates[game.contractIndex % candidates.length];
  game.contractProgress = 0;
  game.contractTimer = game.contract.seconds + Math.min(18, game.level * 1.5);
  game.message = `Arena-Auftrag: ${game.contract.label}`;
  game.messageTimer = 1.1;
}

function advanceContract(game, stat, amount = 1, cell = game.snake[0]) {
  if (!game.contract || game.contract.stat !== stat) return;
  game.contractProgress = Math.min(game.contract.target, game.contractProgress + Math.max(1, amount));
  if (game.contractProgress < game.contract.target) return;
  completeContract(game, cell);
}

function completeContract(game, cell = game.snake[0]) {
  if (!game.contract) return;
  const reward = game.contract.reward;
  const bonus = reward.score + game.level * 70 + game.contractMedals * 95;
  game.score += bonus;
  game.pulseEnergy = Math.min(100, game.pulseEnergy + (reward.pulse || 0));
  game.shield = Math.min(5, game.shield + (reward.shield || 0));
  game.fever = Math.max(game.fever, reward.fever || 0);
  game.magnet = Math.max(game.magnet, reward.magnet || 0);
  game.slowmo = Math.max(game.slowmo, reward.slowmo || 0);
  game.contractMedals += 1;
  addFloater(game, cell, `Auftrag +${bonus}`, '#facc15');
  spawnParticles(game, cell, '#facc15', 26, 260);
  game.message = `${game.contract.label}: geschafft`;
  game.messageTimer = 1.15;
  game.contract = null;
  game.contractProgress = 0;
  game.contractTimer = 0;
  game.contractCooldown = 2.0;
}

function failContract(game) {
  if (!game.contract) return;
  game.contractFails += 1;
  game.pulseEnergy = Math.max(0, game.pulseEnergy - 10);
  game.combo = 0;
  game.message = `${game.contract.label}: verpasst`;
  game.messageTimer = 0.95;
  game.contract = null;
  game.contractProgress = 0;
  game.contractTimer = 0;
  game.contractCooldown = 1.6;
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

function refreshMissions(game) {
  MISSION_GOALS.forEach((goal) => {
    if (game.mission.rewards.includes(goal.id) || !goal.check(game)) return;
    game.mission.rewards.push(goal.id);
    goal.apply(game);
    game.score += 300;
    game.message = `${goal.label}: ${goal.reward}`;
    game.messageTimer = 1.25;
    addFloater(game, game.snake[0], goal.reward, '#facc15');
  });
}

function finishGame(game, message) {
  game.finished = true;
  game.started = false;
  game.message = message;
  game.messageTimer = 4;
  writeHighScore(game.score);
  game.highScore = Math.max(game.highScore, game.score);
}

function setDirection(game, direction) {
  const current = DIRECTIONS[game.direction];
  const next = DIRECTIONS[direction];
  if (!next || (current.x + next.x === 0 && current.y + next.y === 0)) return;
  game.pendingDirection = direction;
}

function handleCrash(game, cell, reason) {
  if (game.shield > 0) {
    game.shield -= 1;
    game.combo = 0;
    game.shake = 0.12;
    game.message = `${reason} - Schild verbraucht`;
    game.messageTimer = 0.9;
    spawnParticles(game, game.snake[0], '#38bdf8', 16, 180);
    return false;
  }

  game.lives -= 1;
  game.combo = 0;
  game.shake = 0.22;
  game.message = reason;
  game.messageTimer = 1.1;
  spawnParticles(game, cell, '#fb7185', 24, 230);
  if (game.lives <= 0) {
    finishGame(game, 'Snake gestoppt');
  } else {
    const length = Math.max(4, Math.floor(game.snake.length * 0.65));
    game.snake = game.snake.slice(0, length);
    game.direction = 'right';
    game.pendingDirection = 'right';
    game.shield = 1;
  }
  return true;
}

function eatFood(game, food) {
  if (game.mode === 'learn') {
    const task = currentTask(game);
    if (!food.correct) {
      game.wrong += 1;
      game.score = Math.max(0, game.score - 180);
      game.combo = 0;
      game.message = `${food.label} passt nicht. Gesucht: ${task.correct}`;
      game.messageTimer = 1.25;
      game.shake = 0.12;
      if (game.contract?.stat === 'learn') failContract(game);
      spawnParticles(game, food, '#fb7185', 18, 200);
      addFloater(game, food, 'falsch', '#fb7185');
      game.foods = game.foods.filter((candidate) => candidate.id !== food.id);
      if (game.foods.filter((candidate) => candidate.correct).length === 0) spawnFoods(game);
      return false;
    }

    game.correct += 1;
    game.learnIndex += 1;
    game.combo += 1;
    game.comboBest = Math.max(game.comboBest, game.combo);
    advanceContract(game, 'learn', 1, food);
    if (game.combo >= 6) {
      advanceContract(game, 'combo', 6 - game.contractProgress, food);
    }
    game.eaten += 1;
    const points = food.points + game.combo * 70;
    game.score += points;
    game.fever = Math.max(game.fever, 4);
    game.magnet = Math.max(game.magnet, 2.6);
    game.message = `${task.prompt}: ${task.correct}`;
    game.messageTimer = 1.1;
    spawnParticles(game, food, '#22c55e', 20, 210);
    addFloater(game, food, `+${points}`, '#22c55e');
    game.foods = [];
    spawnFoods(game);
    return true;
  }

  game.combo += 1;
  game.comboBest = Math.max(game.comboBest, game.combo);
  advanceContract(game, 'food', 1, food);
  if (game.combo >= 6) {
    advanceContract(game, 'combo', 6 - game.contractProgress, food);
  }
  game.eaten += 1;
  const points = food.points + game.combo * 35 + game.level * 18;
  game.score += game.fever > 0 ? Math.round(points * 1.3) : points;
  if (food.kind === 'power') {
    game.shield = Math.min(4, game.shield + 1);
    game.slowmo = Math.max(game.slowmo, 4);
  }
  if (food.kind === 'bonus') game.fever = Math.max(game.fever, 5);
  if (food.kind === 'dash') {
    game.dashCooldown = Math.min(game.dashCooldown, 0.3);
    game.pulseEnergy = Math.min(100, game.pulseEnergy + 12);
    game.message = 'Dash-Kern bereit';
    game.messageTimer = 0.75;
  }
  if (food.kind === 'pulse') {
    game.pulseEnergy = Math.min(100, game.pulseEnergy + 32);
    game.pulseCooldown = Math.min(game.pulseCooldown, 0.5);
    game.message = 'Pulse-Energie geladen';
    game.messageTimer = 0.75;
  }
  if (food.kind === 'portal') {
    const exit = randomFreeCell(game, 77);
    game.snake[0] = exit;
    game.message = 'Portal-Sprung';
    game.messageTimer = 0.65;
  }
  spawnParticles(game, food, food.color, food.kind === 'bonus' ? 24 : 14, 180);
  addFloater(game, food, `+${points}`, '#facc15');
  game.foods = game.foods.filter((candidate) => candidate.id !== food.id);
  if (game.foods.length < 3) spawnFoods(game);
  return true;
}

function levelUpIfNeeded(game) {
  const nextLevel = 1 + Math.floor(game.eaten / 5);
  if (nextLevel <= game.level) return;
  game.level = nextLevel;
  game.walls = makeWalls(game.level);
  game.hazards = makeHazards(game.level);
  makeRivals(game.level, game.mode).forEach((nextRival) => {
    if (!game.rivals.some((rival) => rival.id === nextRival.id) && !nextRival.defeated) {
      game.rivals.push(nextRival);
    }
  });
  if (game.level >= 4 && !game.guardian && !game.mission.guardianDefeated) {
    game.guardian = makeGuardian(game.level);
  }
  game.moveInterval = clamp(game.moveInterval - 0.01, 0.075, 0.18);
  game.shield = Math.min(4, game.shield + 1);
  game.message = `Level ${game.level}`;
  game.messageTimer = 0.9;
}

function stepSnake(game) {
  game.direction = game.pendingDirection;
  const dir = DIRECTIONS[game.direction];
  const head = game.snake[0];
  let next = { x: head.x + dir.x, y: head.y + dir.y };

  if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) {
    if (game.mode === 'arcade') {
      next = { x: (next.x + COLS) % COLS, y: (next.y + ROWS) % ROWS };
      game.score += 20;
    } else {
      handleCrash(game, head, 'Wand beruehrt');
      return false;
    }
  }

  const selfHit = game.snake.some((part, index) => index > 0 && sameCell(part, next));
  if (selfHit) {
    handleCrash(game, next, 'Eigene Spur getroffen');
    return false;
  }

  const wallHit = game.walls.some((wall) => sameCell(wall, next));
  if (wallHit) {
    if (game.dashActive && game.mode === 'arcade') {
      game.walls = game.walls.filter((wall) => !sameCell(wall, next));
      game.score += 180;
      game.pulseEnergy = Math.min(100, game.pulseEnergy + 8);
      advanceContract(game, 'dash', 1, next);
      game.message = 'Dash bricht Barriere';
      game.messageTimer = 0.75;
      spawnParticles(game, next, '#fb923c', 22, 220);
      addFloater(game, next, '+Bruch', '#fb923c');
    } else {
      handleCrash(game, next, 'Hindernis getroffen');
      return false;
    }
  }

  const hazardHit = game.hazards.find((hazard) => isActiveHazard(hazard) && sameCell(hazard, next));
  if (hazardHit) {
    handleCrash(game, next, hazardHit.type === 'laser' ? 'Laserfeld' : 'Schockfeld');
    return false;
  }

  const rivalHit = game.rivals.find((rival) => rival.body.some((part) => sameCell(part, next)));
  if (rivalHit) {
    if (game.dashActive || game.fever > 0) {
      damageRival(game, rivalHit, game.dashActive ? 2 : 1, next);
      game.rivals = game.rivals.filter((rival) => !rival.defeated);
      return false;
    }
    handleCrash(game, next, `${rivalHit.name} getroffen`);
    return false;
  }

  const guardianHit = game.guardian?.alive && game.guardian.body.some((part) => sameCell(part, next));
  if (guardianHit) {
    if (game.dashActive || game.fever > 0) {
      damageGuardian(game, game.dashActive ? 2 : 1, next);
      return false;
    }
    handleCrash(game, next, 'Guardian getroffen');
    return false;
  }

  const food = game.foods.find((candidate) => sameCell(candidate, next));
  let grow = false;
  game.snake.unshift(next);
  if (food) grow = eatFood(game, food);
  if (!grow) game.snake.pop();
  levelUpIfNeeded(game);
  return true;
}

function moveSnake(game) {
  if (!game.started || game.finished) return;
  const canDash = game.dashQueued && game.dashCooldown <= 0;
  const steps = canDash ? 3 : 1;
  game.dashQueued = false;
  game.dashActive = canDash;
  if (canDash) {
    game.dashCooldown = 3.2;
    game.mission.dashUses += 1;
    advanceContract(game, 'dash', 1, game.snake[0]);
    game.pulseEnergy = Math.min(100, game.pulseEnergy + 5);
    game.message = 'Dash-Linie';
    game.messageTimer = 0.55;
    spawnParticles(game, game.snake[0], '#fb923c', 18, 250);
  }

  for (let step = 0; step < steps && !game.finished; step += 1) {
    const moved = stepSnake(game);
    if (!moved) break;
  }
  game.dashActive = false;

  if (game.eaten >= game.targetFood && (game.mode === 'learn' || !game.guardian?.alive)) {
    finishGame(game, game.mode === 'learn' ? 'Learncade-Schlange geschafft' : 'Arena geschafft');
  } else if (game.eaten >= game.targetFood && game.guardian?.alive) {
    game.message = 'Noch den Guardian besiegen';
    game.messageTimer = 1;
  }
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

function updateGame(game, controls, dt) {
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.fever = Math.max(0, game.fever - dt);
  game.slowmo = Math.max(0, game.slowmo - dt);
  game.magnet = Math.max(0, game.magnet - dt);
  game.dashCooldown = Math.max(0, game.dashCooldown - dt);
  game.pulseCooldown = Math.max(0, game.pulseCooldown - dt);
  game.shake = Math.max(0, game.shake - dt);
  updateEffects(game, dt);

  if (!game.started || game.finished) return;
  updateContract(game, dt);
  updateHazards(game, dt);
  moveRivals(game, dt);
  moveGuardian(game, dt);
  driftFoodWithMagnet(game, dt);
  if (controls.up) setDirection(game, 'up');
  if (controls.down) setDirection(game, 'down');
  if (controls.left) setDirection(game, 'left');
  if (controls.right) setDirection(game, 'right');
  if (game.pulseQueued) {
    game.pulseQueued = false;
    activatePulse(game);
  }

  const interval = clamp(game.moveInterval + (game.slowmo > 0 ? 0.055 : 0), 0.065, 0.22);
  game.moveTimer += dt;
  while (game.moveTimer >= interval && !game.finished) {
    game.moveTimer -= interval;
    moveSnake(game);
  }
  refreshMissions(game);
}

function drawBackground(ctx, elapsed) {
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, '#020617');
  bg.addColorStop(0.4, '#0a0e2a');
  bg.addColorStop(0.7, '#0c1631');
  bg.addColorStop(1, '#061224');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Pulsing neon center glow
  const pulseAlpha = 0.12 + Math.sin((elapsed || 0) * 1.5) * 0.04;
  const glow = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 40, WIDTH / 2, HEIGHT / 2, 560);
  glow.addColorStop(0, `rgba(6,182,212,${pulseAlpha})`);
  glow.addColorStop(0.35, `rgba(124,58,237,${pulseAlpha * 0.6})`);
  glow.addColorStop(0.7, 'rgba(14,165,233,.04)');
  glow.addColorStop(1, 'rgba(2,6,23,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // TRON-style emissive grid lines
  ctx.save();
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 0.5;
  const gridPulse = 0.15 + Math.sin((elapsed || 0) * 0.8) * 0.05;
  ctx.globalAlpha = gridPulse;
  for (let x = 0; x <= WIDTH; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y <= HEIGHT; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
  // Brighter grid intersections
  ctx.globalAlpha = gridPulse * 1.5;
  ctx.fillStyle = '#06b6d4';
  for (let x = 0; x <= WIDTH; x += 64) {
    for (let y = 0; y <= HEIGHT; y += 64) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function cellToPixel(cell) {
  return {
    x: BOARD_X + cell.x * CELL + CELL / 2,
    y: BOARD_Y + cell.y * CELL + CELL / 2,
  };
}

function drawBoard(ctx, game) {
  ctx.save();
  // Dark board with emissive border glow
  ctx.fillStyle = 'rgba(2,6,23,.85)';
  drawRoundedRect(ctx, BOARD_X - 18, BOARD_Y - 18, BOARD_W + 36, BOARD_H + 36, 22);
  ctx.fill();
  // Neon border glow
  ctx.shadowColor = '#7c3aed';
  ctx.shadowBlur = 20;
  ctx.strokeStyle = 'rgba(124,58,237,.5)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.shadowColor = 'transparent';

  // Emissive grid lines on the board
  const gridPulse = 0.12 + Math.sin(game.elapsed * 1.2) * 0.04;
  ctx.strokeStyle = `rgba(6,182,212,${gridPulse})`;
  ctx.lineWidth = 0.5;
  for (let col = 0; col <= COLS; col += 1) {
    ctx.beginPath();
    ctx.moveTo(BOARD_X + col * CELL, BOARD_Y);
    ctx.lineTo(BOARD_X + col * CELL, BOARD_Y + BOARD_H);
    ctx.stroke();
  }
  for (let row = 0; row <= ROWS; row += 1) {
    ctx.beginPath();
    ctx.moveTo(BOARD_X, BOARD_Y + row * CELL);
    ctx.lineTo(BOARD_X + BOARD_W, BOARD_Y + row * CELL);
    ctx.stroke();
  }

  // Walls with emissive edge glow
  game.walls.forEach((wall) => {
    const x = BOARD_X + wall.x * CELL;
    const y = BOARD_Y + wall.y * CELL;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#1e1b4b';
    drawRoundedRect(ctx, x + 3, y + 3, CELL - 6, CELL - 6, 6);
    ctx.fill();
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.shadowColor = 'transparent';
  });
  ctx.restore();
}

function drawHazards(ctx, game) {
  game.hazards.forEach((hazard) => {
    const pos = cellToPixel(hazard);
    const active = isActiveHazard(hazard);
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.globalAlpha = active ? 0.95 : 0.28;
    ctx.shadowColor = active ? '#fb7185' : '#38bdf8';
    ctx.shadowBlur = active ? 22 : 8;
    ctx.fillStyle = active ? 'rgba(248,113,113,.95)' : 'rgba(56,189,248,.35)';
    if (hazard.type === 'laser') {
      drawRoundedRect(ctx, -CELL * 0.43, -CELL * 0.12, CELL * 0.86, CELL * 0.24, 6);
      ctx.fill();
      ctx.rotate(Math.PI / 2);
      drawRoundedRect(ctx, -CELL * 0.38, -CELL * 0.08, CELL * 0.76, CELL * 0.16, 4);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -CELL * 0.42);
      ctx.lineTo(CELL * 0.38, CELL * 0.36);
      ctx.lineTo(-CELL * 0.38, CELL * 0.36);
      ctx.closePath();
      ctx.fill();
    }
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = active ? '#450a0a' : '#082f49';
    ctx.font = '900 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(active ? '!' : '...', 0, 1);
    ctx.restore();
  });
}

function drawFoods(ctx, game) {
  game.foods.forEach((food) => {
    const pos = cellToPixel(food);
    const pulse = 1 + Math.sin(game.elapsed * 6 + food.x) * 0.12;
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.scale(pulse, pulse);
    // Strong neon glow on food
    ctx.shadowColor = food.color;
    ctx.shadowBlur = food.correct || food.kind === 'bonus' ? 32 : 18;
    ctx.fillStyle = food.color;
    ctx.beginPath();
    ctx.arc(0, 0, CELL * 0.38, 0, Math.PI * 2);
    ctx.fill();
    // Inner highlight ring
    ctx.strokeStyle = 'rgba(255,255,255,.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, CELL * 0.28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = food.correct ? '#052e16' : '#020617';
    ctx.font = food.label.length > 10 ? '900 9px Outfit, sans-serif' : '900 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(food.label || food.kind[0].toUpperCase(), 0, 1, CELL + 16);
    ctx.restore();
  });
}

function drawRivals(ctx, game) {
  const drawSegment = (part, index, color, isHead, alpha = 1) => {
    const pos = cellToPixel(part);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(pos.x, pos.y);
    ctx.shadowColor = color;
    ctx.shadowBlur = isHead ? 24 : 12;
    ctx.fillStyle = isHead ? color : 'rgba(15,23,42,.96)';
    drawRoundedRect(ctx, -CELL * 0.42, -CELL * 0.42, CELL * 0.84, CELL * 0.84, isHead ? 12 : 8);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = isHead ? 2.5 : 1.4;
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    if (isHead) {
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(-5, -3, 3, 0, Math.PI * 2);
      ctx.arc(5, -3, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '900 9px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`HP${Math.max(0, index)}`, 0, 10);
    }
    ctx.restore();
  };

  game.rivals.forEach((rival) => {
    rival.body.forEach((part, index) => drawSegment(part, rival.hp, rival.color, index === 0, rival.freeze > 0 ? 0.55 : 1));
  });

  if (game.guardian?.alive) {
    game.guardian.body.forEach((part, index) => {
      const pos = cellToPixel(part);
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.globalAlpha = game.guardian.freeze > 0 ? 0.62 : 1;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = index === 0 ? 32 : 16;
      ctx.fillStyle = index === 0 ? '#f97316' : '#7c2d12';
      drawRoundedRect(ctx, -CELL * 0.48, -CELL * 0.48, CELL * 0.96, CELL * 0.96, 10);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = index === 0 ? 2.5 : 1.3;
      ctx.stroke();
      ctx.shadowColor = 'transparent';
      if (index === 0) {
        ctx.fillStyle = '#431407';
        ctx.font = '900 10px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`G${game.guardian.hp}`, 0, 1);
      }
      ctx.restore();
    });
  }
}

function drawSnake(ctx, game) {
  const snakeLen = game.snake.length;
  game.snake.forEach((part, index) => {
    const pos = cellToPixel(part);
    const isHead = index === 0;
    // Purple→Cyan gradient along body
    const t = snakeLen > 1 ? index / (snakeLen - 1) : 0;
    const r = Math.round(124 + (6 - 124) * t);
    const g = Math.round(58 + (182 - 58) * t);
    const b = Math.round(237 + (212 - 237) * t);
    const bodyColor = isHead ? '#facc15' : `rgb(${r},${g},${b})`;
    const glowColor = isHead ? '#facc15' : `rgba(${r},${g},${b},0.9)`;
    ctx.save();
    ctx.translate(pos.x, pos.y);
    // Strong neon glow — head has lens-flare-style intense glow
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = isHead ? 35 : 14 - t * 6;
    ctx.fillStyle = bodyColor;
    if (isHead) {
      // Head is a circle for lens flare feel
      ctx.beginPath();
      ctx.arc(0, 0, CELL * 0.44, 0, Math.PI * 2);
      ctx.fill();
      // Extra glow ring
      ctx.strokeStyle = 'rgba(250,204,21,.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, CELL * 0.52, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      drawRoundedRect(ctx, -CELL * 0.42, -CELL * 0.42, CELL * 0.84, CELL * 0.84, 8);
      ctx.fill();
    }
    ctx.shadowColor = 'transparent';
    if (isHead) {
      const dir = DIRECTIONS[game.direction];
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(dir.x * 6 - 4 * Math.abs(dir.y), dir.y * 6 - 4 * Math.abs(dir.x), 3, 0, Math.PI * 2);
      ctx.arc(dir.x * 6 + 4 * Math.abs(dir.y), dir.y * 6 + 4 * Math.abs(dir.x), 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
}

function drawEffects(ctx, game) {
  game.particles.forEach((particle) => {
    ctx.save();
    const alpha = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 8 * alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  game.floaters.forEach((floater) => {
    ctx.save();
    const alpha = clamp(floater.life / floater.maxLife, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.shadowColor = floater.color;
    ctx.shadowBlur = 12 * alpha;
    ctx.fillStyle = floater.color;
    ctx.font = '900 18px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(floater.text, floater.x, floater.y);
    ctx.restore();
  });
}

function drawGauge(ctx, x, y, w, label, value, color) {
  ctx.fillStyle = 'rgba(148,163,184,.18)';
  drawRoundedRect(ctx, x, y + 16, w, 10, 5);
  ctx.fill();
  ctx.fillStyle = color;
  drawRoundedRect(ctx, x, y + 16, w * clamp(value / 100, 0, 1), 10, 5);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '800 11px Outfit, sans-serif';
  ctx.fillText(label, x, y + 9);
}

function drawHud(ctx, game) {
  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, 38, 42, 224, game.mode === 'learn' ? 392 : 326, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 27px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Learn Snake' : 'Snake Pro', 62, 82);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.fillText(`Score ${game.score}`, 62, 116);
  ctx.fillText(`Laenge ${game.snake.length}  Ziel ${game.eaten}/${game.targetFood}`, 62, 144);
  ctx.fillText(`Level ${game.level}  Combo x${Math.max(1, game.combo)}`, 62, 172);
  ctx.fillText(`Leben ${game.lives}  Schild ${game.shield}`, 62, 200);
  ctx.fillText(`Rivalen ${game.rivals.length}  Pulse ${Math.round(game.pulseEnergy)}%`, 62, 228);
  ctx.fillText(`Auftraege ${game.contractMedals}  Verpasst ${game.contractFails}`, 62, 256);
  drawGauge(ctx, 62, 278, 158, 'DASH', game.dashCooldown <= 0 ? 100 : 100 - game.dashCooldown * 31, '#fb923c');
  if (game.mode === 'learn') {
    const task = currentTask(game);
    ctx.fillStyle = '#67e8f9';
    ctx.fillText(`${task.subject} - ${task.kind}`, 62, 334);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 14px Outfit, sans-serif';
    ctx.fillText(task.prompt, 62, 362, 172);
  }

  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, 1014, 42, 230, 458, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 17px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? `Richtig ${game.correct} Fehler ${game.wrong}` : 'Powerups', 1044, 82);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText('Pfeile / WASD steuern', 1044, 116);
  ctx.fillText('Space Dash  X Pulse', 1044, 142);
  ctx.fillText('M Modus wechseln', 1044, 168);
  ctx.fillText(game.mode === 'arcade' ? 'Rand = Warp' : 'Rand = Gefahr', 1044, 194);
  drawGauge(ctx, 1044, 222, 160, 'FEVER', Math.min(100, game.fever * 20), '#facc15');
  drawGauge(ctx, 1044, 264, 160, 'MAGNET', Math.min(100, game.magnet * 35), '#38bdf8');
  drawGauge(ctx, 1044, 306, 160, 'PULSE', game.pulseEnergy, '#f472b6');
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText('Aktiver Auftrag', 1044, 350);
  ctx.font = '800 10px Outfit, sans-serif';
  if (game.contract) {
    const ratio = game.contractProgress / Math.max(1, game.contract.target);
    ctx.fillStyle = '#fef3c7';
    ctx.fillText(game.contract.label, 1044, 370, 160);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`${game.contractProgress}/${game.contract.target} · ${Math.ceil(game.contractTimer)}s`, 1044, 386);
    ctx.fillStyle = 'rgba(148,163,184,.2)';
    drawRoundedRect(ctx, 1044, 396, 160, 10, 5);
    ctx.fill();
    ctx.fillStyle = '#22d3ee';
    drawRoundedRect(ctx, 1044, 396, 160 * clamp(ratio, 0, 1), 10, 5);
    ctx.fill();
  } else {
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Naechstes Ziel wird vorbereitet', 1044, 370, 160);
  }
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText('Bonus-Missionen', 1044, 430);
  ctx.font = '800 10px Outfit, sans-serif';
  MISSION_GOALS.slice(0, 3).forEach((goal, index) => {
    const done = game.mission.rewards.includes(goal.id);
    ctx.fillStyle = done ? '#86efac' : '#94a3b8';
    ctx.fillText(`${done ? 'OK' : '--'} ${goal.label}`, 1044, 450 + index * 16);
  });

  ctx.fillStyle = 'rgba(2,6,23,.72)';
  drawRoundedRect(ctx, 38, HEIGHT - 58, 640, 38, 14);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText('WASD/Pfeile bewegen - Space Dash - X Pulse - gruenes Futter sammeln - M Normal/Learncade', 58, HEIGHT - 34);
  ctx.restore();
}

function drawMessage(ctx, game) {
  if (game.messageTimer <= 0 && game.started && !game.finished) return;
  ctx.save();
  ctx.textAlign = 'center';
  if (!game.started || game.finished) {
    ctx.fillStyle = 'rgba(2,6,23,.68)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 50px Outfit, sans-serif';
    ctx.fillText(game.finished ? game.message : 'FASKA SNAKE ARENA', WIDTH / 2, 260);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '800 18px Outfit, sans-serif';
    ctx.fillText(game.finished ? `Score ${game.score} - Highscore ${Math.max(game.highScore, game.score)}` : 'Arena-Snake mit Dash, Pulse, Rivalen, Guardian, Gefahrenfeldern, Zeit-Auftraegen und Learncade-Futter.', WIDTH / 2, 304);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '900 16px Outfit, sans-serif';
    ctx.fillText('Oben Normal oder Learncade waehlen. Space = Dash, X = Pulse.', WIDTH / 2, 338);
  } else {
    ctx.fillStyle = 'rgba(2,6,23,.74)';
    drawRoundedRect(ctx, WIDTH / 2 - 290, 84, 580, 50, 16);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 21px Outfit, sans-serif';
    ctx.fillText(game.message, WIDTH / 2, 117);
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
  drawBackground(ctx, game.elapsed);
  drawBoard(ctx, game);
  drawHazards(ctx, game);
  drawFoods(ctx, game);
  drawRivals(ctx, game);
  drawSnake(ctx, game);
  drawEffects(ctx, game);
  drawHud(ctx, game);
  drawMessage(ctx, game);
  ctx.restore();
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
  width: 62,
  height: 54,
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,.2)',
  background: 'rgba(15,23,42,.76)',
  color: '#f8fafc',
  fontSize: 15,
  fontWeight: 900,
  touchAction: 'none',
};

export default function FaskaSnakeSwarm() {
  const canvasRef = useRef(null);
  const modeRef = useRef('arcade');
  const gameRef = useRef(makeInitialGame('arcade'));
  const controlsRef = useRef({ up: false, down: false, left: false, right: false });
  const fxRef = useRef(null);
  const [damageFlash, setDamageFlash] = useState(0);
  const [ui, setUi] = useState(() => ({
    mode: 'arcade',
    started: false,
    finished: false,
    score: 0,
    highScore: readHighScore(),
  }));
  const [showTouchControls, setShowTouchControls] = useState(false);

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
      ? 'Sammle die richtige Antwort und halte Waechter fern.'
      : 'Sammle Futter, dash durch Luecken und pulse Gegner weg.';
    gameRef.current.messageTimer = 1.6;
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
    const down = (event) => {
      const key = event.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'm', 'x', 'k', ' '].includes(key)) event.preventDefault();
      if (key === 'arrowup' || key === 'w') controlsRef.current.up = true;
      if (key === 'arrowdown' || key === 's') controlsRef.current.down = true;
      if (key === 'arrowleft' || key === 'a') controlsRef.current.left = true;
      if (key === 'arrowright' || key === 'd') controlsRef.current.right = true;
      if (key === ' ') gameRef.current.dashQueued = true;
      if (key === 'x' || key === 'k') gameRef.current.pulseQueued = true;
      if (key === 'm') startGame(modeRef.current === 'learn' ? 'arcade' : 'learn');
    };
    const up = (event) => {
      const key = event.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') controlsRef.current.up = false;
      if (key === 'arrowdown' || key === 's') controlsRef.current.down = false;
      if (key === 'arrowleft' || key === 'a') controlsRef.current.left = false;
      if (key === 'arrowright' || key === 'd') controlsRef.current.right = false;
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
    let prevEaten = gameRef.current.eaten;
    let prevLives = gameRef.current.lives;
    let prevShield = gameRef.current.shield;

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      updateGame(gameRef.current, controlsRef.current, dt);
      renderGame(ctx, gameRef.current);

      // FX overlay triggers
      const game = gameRef.current;
      if (game.eaten > prevEaten && fxRef.current) {
        const head = game.snake[0];
        if (head) {
          const px = BOARD_X + head.x * CELL + CELL / 2;
          const py = BOARD_Y + head.y * CELL + CELL / 2;
          fxRef.current.emitParticles(px, py, {
            count: 16, spread: 2.5, speed: 5, color: '#22c55e',
          });
        }
      }
      if (game.lives < prevLives && fxRef.current) {
        fxRef.current.shake(0.6, 300);
        setDamageFlash(1);
        setTimeout(() => setDamageFlash(0), 300);
      }
      if (game.shield < prevShield && fxRef.current) {
        fxRef.current.shake(0.3, 150);
      }
      prevEaten = game.eaten;
      prevLives = game.lives;
      prevShield = game.shield;

      if (now - lastUi > 220) {
        lastUi = now;
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

  useEffect(() => {
    const pointerQuery = window.matchMedia?.('(pointer: coarse)');
    const updateTouchControls = () => setShowTouchControls(Boolean(pointerQuery?.matches));
    updateTouchControls();
    pointerQuery?.addEventListener?.('change', updateTouchControls);
    return () => pointerQuery?.removeEventListener?.('change', updateTouchControls);
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

      <GameFxOverlay
        ref={fxRef}
        preset="arcade"
        damageFlash={damageFlash}
        ambientGlowColor="#06b6d4"
        ambientGlowIntensity={0.6}
        particleColor="#22c55e"
        particleCount={80}
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
            bottom: 20,
            display: 'grid',
            gridTemplateColumns: '62px 62px 62px',
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
            display: 'flex',
            gap: 10,
            zIndex: 5,
          }}>
            <button
              type="button"
              aria-label="Dash"
              style={{ ...touchButton, width: 78, background: 'rgba(251,146,60,.78)' }}
              onPointerDown={(event) => {
                event.preventDefault();
                gameRef.current.dashQueued = true;
              }}
            >
              Dash
            </button>
            <button
              type="button"
              aria-label="Pulse"
              style={{ ...touchButton, width: 78, background: 'rgba(244,114,182,.78)' }}
              onPointerDown={(event) => {
                event.preventDefault();
                gameRef.current.pulseQueued = true;
              }}
            >
              Pulse
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
