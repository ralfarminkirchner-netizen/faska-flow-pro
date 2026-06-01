import { useCallback, useEffect, useRef, useState } from 'react';

const WIDTH = 1280;
const HEIGHT = 720;
const COLS = 10;
const ROWS = 20;
const CELL = 28;
const BOARD_X = 456;
const BOARD_Y = 78;
const BOARD_W = COLS * CELL;
const BOARD_H = ROWS * CELL;

const SHAPES = {
  I: { color: '#22d3ee', blocks: [[0, 1], [1, 1], [2, 1], [3, 1]] },
  O: { color: '#facc15', blocks: [[0, 0], [0, 1], [1, 0], [1, 1]] },
  T: { color: '#a78bfa', blocks: [[0, 1], [1, 0], [1, 1], [1, 2]] },
  S: { color: '#22c55e', blocks: [[0, 1], [0, 2], [1, 0], [1, 1]] },
  Z: { color: '#fb7185', blocks: [[0, 0], [0, 1], [1, 1], [1, 2]] },
  J: { color: '#60a5fa', blocks: [[0, 0], [1, 0], [1, 1], [1, 2]] },
  L: { color: '#fb923c', blocks: [[0, 2], [1, 0], [1, 1], [1, 2]] },
};

const SHAPE_KEYS = Object.keys(SHAPES);

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    prompt: 'springt',
    sentence: 'Der Fuchs ___ ueber den Baumstamm.',
    correct: 'Verb',
    options: ['Nomen', 'Verb', 'Adjektiv', 'Praeposition'],
  },
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    prompt: 'Schluessel',
    sentence: 'Der ___ oeffnet die Truhe.',
    correct: 'Nomen',
    options: ['Nomen', 'Verb', 'Adjektiv', 'Artikel'],
  },
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    prompt: 'mutig',
    sentence: 'Die Heldin geht ___ voran.',
    correct: 'Adjektiv',
    options: ['Verb', 'Nomen', 'Adjektiv', 'Praeposition'],
  },
  {
    subject: 'Deutsch',
    kind: 'Praeposition',
    prompt: 'unter',
    sentence: 'Der Ball liegt ___ dem Tisch.',
    correct: 'Praeposition',
    options: ['Nomen', 'Verb', 'Adjektiv', 'Praeposition'],
  },
  {
    subject: 'Mathe',
    kind: 'Ergebnis',
    prompt: '9 x 6',
    sentence: 'Lege den Stein in das richtige Ergebnis-Feld.',
    correct: '54',
    options: ['45', '54', '63', '72'],
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    prompt: 'bridge',
    sentence: 'bridge bedeutet ...',
    correct: 'Bruecke',
    options: ['Bruecke', 'Burg', 'Baum', 'Brot'],
  },
  {
    subject: 'Lesen',
    kind: 'Ort',
    prompt: 'Bibliothek',
    sentence: 'Wo leiht man Buecher?',
    correct: 'Bibliothek',
    options: ['Schule', 'Bibliothek', 'Werkstatt', 'Arena'],
  },
  {
    subject: 'Sachkunde',
    kind: 'Kategorie',
    prompt: 'Sauerstoff',
    sentence: 'Sauerstoff ist ein ...',
    correct: 'Gas',
    options: ['Gas', 'Metall', 'Planet', 'Geraeusch'],
  },
  {
    subject: 'Deutsch',
    kind: 'Kompositum',
    prompt: 'Regen...',
    sentence: 'Welches Wort bildet ein sinnvolles zusammengesetztes Wort?',
    correct: 'bogen',
    options: ['bogen', 'laufen', 'unter', 'schnell'],
  },
  {
    subject: 'Deutsch',
    kind: 'Satzglied',
    prompt: 'Mila malt ein Bild.',
    sentence: 'Wer oder was malt?',
    correct: 'Mila',
    options: ['Mila', 'malt', 'ein Bild', 'heute'],
  },
  {
    subject: 'Mathe',
    kind: 'Subtraktion',
    prompt: '83 - 27',
    sentence: 'Lege den Stein in das richtige Ergebnis-Feld.',
    correct: '56',
    options: ['46', '54', '56', '66'],
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    prompt: 'quiet',
    sentence: 'quiet bedeutet ...',
    correct: 'leise',
    options: ['leise', 'hell', 'schnell', 'warm'],
  },
];

const MODIFIERS = {
  bomb: { label: 'B', name: 'Bomb', color: '#fb923c' },
  laser: { label: 'L', name: 'Laser', color: '#38bdf8' },
  prism: { label: 'P', name: 'Prisma', color: '#e879f9' },
};

const MISSION_GOALS = [
  {
    id: 'tetris',
    label: '1 Tetra-Line',
    reward: 'Blast +35',
    check: (game) => game.tetras >= 1,
    apply: (game) => {
      game.blastCharge = Math.min(100, game.blastCharge + 35);
    },
  },
  {
    id: 'hold',
    label: '3x Hold nutzen',
    reward: 'Fokus +20',
    check: (game) => game.mission.holdUses >= 3,
    apply: (game) => {
      game.focus = Math.min(100, game.focus + 20);
    },
  },
  {
    id: 'special',
    label: '4 Spezialsteine',
    reward: 'Fever',
    check: (game) => game.mission.specialsUsed >= 4,
    apply: (game) => {
      game.fever = Math.max(game.fever, 7);
    },
  },
  {
    id: 'blast',
    label: '2x Board-Blast',
    reward: 'Schildreihe',
    check: (game) => game.mission.blasts >= 2,
    apply: (game) => {
      game.blastCharge = Math.min(100, game.blastCharge + 25);
      game.focus = Math.min(100, game.focus + 15);
    },
  },
  {
    id: 'learnStreak',
    label: '4 Lern-Treffer',
    reward: 'Extra-Punkte',
    check: (game) => game.mode === 'learn' && game.correctStreak >= 4,
    apply: (game) => {
      game.score += 1000;
    },
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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

function createGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function countDangerRows(grid) {
  return grid.filter((row) => row.some((cell) => cell?.type === 'garbage')).length;
}

function readHighScore() {
  try {
    return Number(window.localStorage.getItem('faska_blocks_highscore') || 0);
  } catch {
    return 0;
  }
}

function writeHighScore(score) {
  try {
    if (score > readHighScore()) window.localStorage.setItem('faska_blocks_highscore', String(score));
  } catch {
    // localStorage can be unavailable in private contexts.
  }
}

function rotateBlocks(blocks) {
  const rotated = blocks.map(([row, col]) => [col, -row]);
  const minRow = Math.min(...rotated.map(([row]) => row));
  const minCol = Math.min(...rotated.map(([, col]) => col));
  return rotated.map(([row, col]) => [row - minRow, col - minCol]);
}

function makeRotations(blocks) {
  const rotations = [blocks];
  for (let i = 1; i < 4; i += 1) rotations.push(rotateBlocks(rotations[i - 1]));
  return rotations;
}

const ROTATIONS = SHAPE_KEYS.reduce((acc, key) => {
  acc[key] = makeRotations(SHAPES[key].blocks);
  return acc;
}, {});

function seededUnit(index, salt) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function makePiece(game, type = null) {
  const key = type || SHAPE_KEYS[Math.floor(seededUnit(game.seed, game.level + 4) * SHAPE_KEYS.length)];
  const specialRoll = seededUnit(game.seed + game.nextId, game.level + (game.mode === 'learn' ? 19 : 13));
  const modifier = specialRoll > 0.92
    ? 'bomb'
    : specialRoll > 0.84
      ? 'laser'
      : specialRoll > 0.76
        ? 'prism'
        : null;
  game.seed += 1;
  const task = game.mode === 'learn' ? LEARN_TASKS[game.learnIndex % LEARN_TASKS.length] : null;
  return {
    id: `piece_${game.nextId}`,
    type: key,
    color: SHAPES[key].color,
    row: -1,
    col: key === 'I' ? 3 : 4,
    rotation: 0,
    task,
    modifier,
  };
}

function blocksFor(piece, rotation = piece.rotation, row = piece.row, col = piece.col) {
  return ROTATIONS[piece.type][rotation % 4].map(([r, c]) => ({
    row: row + r,
    col: col + c,
  }));
}

function isValid(game, piece, row = piece.row, col = piece.col, rotation = piece.rotation) {
  return blocksFor(piece, rotation, row, col).every((block) => {
    if (block.col < 0 || block.col >= COLS || block.row >= ROWS) return false;
    if (block.row < 0) return true;
    return game.grid[block.row][block.col] === null;
  });
}

function ghostRow(game, piece) {
  let row = piece.row;
  while (isValid(game, piece, row + 1, piece.col, piece.rotation)) row += 1;
  return row;
}

function currentTask(game) {
  return LEARN_TASKS[game.learnIndex % LEARN_TASKS.length];
}

function zoneForCol(options, col) {
  const index = clamp(Math.floor((col / COLS) * options.length), 0, options.length - 1);
  return options[index];
}

function makeInitialGame(mode = 'arcade') {
  const game = {
    mode,
    started: false,
    finished: false,
    grid: createGrid(),
    current: null,
    queue: [],
    hold: null,
    canHold: true,
    nextId: 1,
    seed: 1,
    score: 0,
    highScore: readHighScore(),
    level: 1,
    lines: 0,
    combo: 0,
    comboBest: 0,
    tetras: 0,
    dropTimer: 0,
    lockTimer: 0,
    softDrop: false,
    message: mode === 'learn'
      ? 'Lege den Wort-Stein in das richtige Antwortfeld.'
      : 'Raeume Linien, halte Combo und nutze Hold/Ghost.',
    messageTimer: 2.5,
    particles: [],
    floaters: [],
    clearedRows: [],
    clearTimer: 0,
    learnIndex: 0,
    correct: 0,
    wrong: 0,
    correctStreak: 0,
    focus: mode === 'learn' ? 70 : 45,
    fever: 0,
    blastCharge: mode === 'learn' ? 70 : 45,
    blastCooldown: 0,
    blastQueued: false,
    pressure: 0,
    pressureTimer: 0,
    dangerRows: 0,
    allClears: 0,
    mission: {
      holdUses: 0,
      hardDrops: 0,
      specialsUsed: 0,
      blasts: 0,
      rewards: [],
    },
    elapsed: 0,
    shake: 0,
  };
  refillQueue(game);
  spawnPiece(game);
  return game;
}

function refillQueue(game) {
  while (game.queue.length < 5) {
    game.queue.push(makePiece(game));
    game.nextId += 1;
  }
}

function spawnPiece(game) {
  refillQueue(game);
  game.current = game.queue.shift();
  if (game.mode === 'learn') game.current.task = currentTask(game);
  game.canHold = true;
  game.lockTimer = 0;
  refillQueue(game);
  if (!isValid(game, game.current)) finishGame(game, 'Blockstapel voll');
}

function addFloater(game, x, y, text, color = '#facc15') {
  game.floaters.push({ x, y, text, color, life: 1, maxLife: 1, vy: -46 });
}

function spawnParticles(game, x, y, color, count = 12, speed = 160) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed;
    const burst = speed * (0.38 + (i % 5) * 0.13);
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

function finishGame(game, message) {
  game.finished = true;
  game.started = false;
  game.message = message;
  game.messageTimer = 4;
  writeHighScore(game.score);
  game.highScore = Math.max(game.highScore, game.score);
}

function movePiece(game, dx) {
  if (!game.current || game.clearTimer > 0) return;
  if (isValid(game, game.current, game.current.row, game.current.col + dx, game.current.rotation)) {
    game.current.col += dx;
    game.lockTimer = 0;
  }
}

function rotatePiece(game, dir = 1) {
  if (!game.current || game.clearTimer > 0) return;
  const nextRotation = (game.current.rotation + dir + 4) % 4;
  const kicks = [0, -1, 1, -2, 2];
  for (const kick of kicks) {
    if (isValid(game, game.current, game.current.row, game.current.col + kick, nextRotation)) {
      game.current.col += kick;
      game.current.rotation = nextRotation;
      game.lockTimer = 0;
      return;
    }
  }
}

function holdPiece(game) {
  if (!game.current || !game.canHold || game.clearTimer > 0) return;
  const previous = game.hold;
  game.hold = { ...game.current, row: -1, col: 4, rotation: 0 };
  if (previous) {
    game.current = { ...previous, row: -1, col: previous.type === 'I' ? 3 : 4, rotation: 0 };
    if (game.mode === 'learn') game.current.task = currentTask(game);
  } else {
    spawnPiece(game);
  }
  game.canHold = false;
  game.mission.holdUses += 1;
  game.focus = Math.min(100, game.focus + 3);
  game.message = `Hold: ${game.hold.type}`;
  game.messageTimer = 0.6;
}

function hardDrop(game) {
  if (!game.current || game.clearTimer > 0) return;
  const targetRow = ghostRow(game, game.current);
  const distance = targetRow - game.current.row;
  game.current.row = targetRow;
  game.score += Math.max(0, distance) * 3;
  game.mission.hardDrops += 1;
  game.blastCharge = Math.min(100, game.blastCharge + Math.min(8, Math.max(0, distance)));
  lockPiece(game);
}

function addGarbageRow(game) {
  const gap = Math.floor(seededUnit(game.seed, game.lines + 9) * COLS);
  game.seed += 1;
  game.grid.shift();
  game.grid.push(Array.from({ length: COLS }, (_, col) => (col === gap ? null : { color: '#334155', type: 'garbage' })));
  game.dangerRows = countDangerRows(game.grid);
  game.shake = 0.15;
}

function evaluateLearnPlacement(game, piece, placedBlocks) {
  if (game.mode !== 'learn' || !piece.task) return;
  const avgCol = placedBlocks.reduce((sum, block) => sum + block.col, 0) / placedBlocks.length;
  const answer = zoneForCol(piece.task.options, avgCol);
  if (answer === piece.task.correct) {
    game.correct += 1;
    game.correctStreak += 1;
    game.learnIndex += 1;
    game.focus = Math.min(100, game.focus + 16);
    game.blastCharge = Math.min(100, game.blastCharge + 10);
    game.fever = Math.max(game.fever, 5);
    game.score += 550 + game.correct * 35;
    game.message = `${piece.task.prompt}: ${piece.task.correct}`;
    game.messageTimer = 1.2;
    addFloater(game, BOARD_X + avgCol * CELL, BOARD_Y + 80, 'richtig', '#22c55e');
  } else {
    game.wrong += 1;
    game.correctStreak = 0;
    game.combo = 0;
    game.focus = Math.max(0, game.focus - 18);
    game.score = Math.max(0, game.score - 180);
    game.message = `${answer} passt nicht. Gesucht: ${piece.task.correct}`;
    game.messageTimer = 1.4;
    addGarbageRow(game);
  }
}

function applySpecialModifier(game, piece, placedBlocks) {
  if (!piece.modifier) return;
  const center = placedBlocks.reduce((best, block) => (block.row > best.row ? block : best), placedBlocks[0]);
  let removed = 0;

  if (piece.modifier === 'bomb') {
    for (let row = center.row - 1; row <= center.row + 1; row += 1) {
      for (let col = center.col - 1; col <= center.col + 1; col += 1) {
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS || !game.grid[row][col]) continue;
        game.grid[row][col] = null;
        removed += 1;
        spawnParticles(game, BOARD_X + col * CELL + CELL / 2, BOARD_Y + row * CELL + CELL / 2, MODIFIERS.bomb.color, 8, 190);
      }
    }
    game.message = `Bomb-Block: ${removed} Felder`;
  }

  if (piece.modifier === 'laser') {
    const col = clamp(Math.round(placedBlocks.reduce((sum, block) => sum + block.col, 0) / placedBlocks.length), 0, COLS - 1);
    for (let row = 0; row < ROWS; row += 1) {
      if (!game.grid[row][col]) continue;
      game.grid[row][col] = null;
      removed += 1;
      spawnParticles(game, BOARD_X + col * CELL + CELL / 2, BOARD_Y + row * CELL + CELL / 2, MODIFIERS.laser.color, 5, 210);
    }
    game.message = `Laser-Spalte: ${removed} Felder`;
  }

  if (piece.modifier === 'prism') {
    const candidates = [];
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        if (game.grid[row][col] && game.grid[row][col].type === 'garbage') candidates.push({ row, col });
      }
    }
    candidates.slice(0, 4).forEach(({ row, col }) => {
      game.grid[row][col] = null;
      removed += 1;
      spawnParticles(game, BOARD_X + col * CELL + CELL / 2, BOARD_Y + row * CELL + CELL / 2, MODIFIERS.prism.color, 7, 170);
    });
    game.focus = Math.min(100, game.focus + 10);
    game.message = removed > 0 ? `Prisma reinigt ${removed} Garbage` : 'Prisma-Fokus';
  }

  game.mission.specialsUsed += 1;
  game.score += removed * 90 + 220;
  game.blastCharge = Math.min(100, game.blastCharge + 14);
  game.dangerRows = countDangerRows(game.grid);
  game.messageTimer = 0.95;
  addFloater(game, BOARD_X + center.col * CELL + CELL / 2, BOARD_Y + center.row * CELL, MODIFIERS[piece.modifier].name, MODIFIERS[piece.modifier].color);
}

function lockPiece(game) {
  if (!game.current) return;
  const piece = game.current;
  const placedBlocks = blocksFor(piece);
  for (const block of placedBlocks) {
    if (block.row < 0) {
      finishGame(game, 'Blockstapel voll');
      return;
    }
    game.grid[block.row][block.col] = {
      color: piece.color,
      type: piece.type,
      task: piece.task,
      modifier: piece.modifier,
    };
  }

  evaluateLearnPlacement(game, piece, placedBlocks);
  applySpecialModifier(game, piece, placedBlocks);

  const fullRows = [];
  for (let row = 0; row < ROWS; row += 1) {
    if (game.grid[row].every(Boolean)) fullRows.push(row);
  }

  game.current = null;
  if (fullRows.length > 0) {
    game.clearedRows = fullRows;
    game.clearTimer = 0.28;
    game.combo += 1;
    game.comboBest = Math.max(game.comboBest, game.combo);
    if (fullRows.length >= 4) game.tetras += 1;
    const table = [0, 120, 360, 620, 1000];
    const points = (table[fullRows.length] || 1200) * game.level + game.combo * 85;
    game.score += game.fever > 0 ? Math.round(points * 1.25) : points;
    game.lines += fullRows.length;
    game.level = 1 + Math.floor(game.lines / 8);
    game.focus = Math.min(100, game.focus + fullRows.length * 4);
    game.blastCharge = Math.min(100, game.blastCharge + fullRows.length * 12);
    game.pressureTimer = Math.max(0, game.pressureTimer - fullRows.length * 3);
    game.message = fullRows.length === 4 ? 'TETRA BLOCK!' : `${fullRows.length} Linien`;
    game.messageTimer = 0.9;
    fullRows.forEach((row) => spawnParticles(game, BOARD_X + BOARD_W / 2, BOARD_Y + row * CELL + CELL / 2, '#facc15', 18, 210));
  } else {
    game.combo = 0;
    spawnPiece(game);
  }
}

function finishClear(game) {
  if (game.clearedRows.length === 0) return;
  const rowsToClear = new Set(game.clearedRows);
  const kept = game.grid.filter((_, row) => !rowsToClear.has(row));
  while (kept.length < ROWS) kept.unshift(Array(COLS).fill(null));
  game.grid = kept;
  game.dangerRows = countDangerRows(game.grid);
  if (game.grid.every((row) => row.every((cell) => cell === null))) {
    game.allClears += 1;
    game.score += 1600;
    game.blastCharge = 100;
    game.message = 'All Clear!';
    game.messageTimer = 1.1;
  }
  game.clearedRows = [];
  game.clearTimer = 0;
  spawnPiece(game);
}

function softDropPiece(game) {
  if (!game.current || game.clearTimer > 0) return;
  if (isValid(game, game.current, game.current.row + 1, game.current.col, game.current.rotation)) {
    game.current.row += 1;
    game.score += 1;
  } else {
    lockPiece(game);
  }
}

function activateBoardBlast(game) {
  if (game.blastCooldown > 0 || game.blastCharge < 50) {
    game.message = game.blastCooldown > 0 ? 'Blast laedt noch' : 'Zu wenig Blast-Energie';
    game.messageTimer = 0.8;
    return;
  }

  let targetRow = -1;
  let bestFilled = -1;
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    const filled = game.grid[row].filter(Boolean).length + (game.grid[row].some((cell) => cell?.type === 'garbage') ? 3 : 0);
    if (filled > bestFilled) {
      bestFilled = filled;
      targetRow = row;
    }
  }

  if (targetRow < 0 || bestFilled <= 0) {
    game.message = 'Kein Ziel fuer Blast';
    game.messageTimer = 0.7;
    return;
  }

  game.grid[targetRow].forEach((cell, col) => {
    if (!cell) return;
    spawnParticles(game, BOARD_X + col * CELL + CELL / 2, BOARD_Y + targetRow * CELL + CELL / 2, '#f472b6', 8, 220);
  });
  game.grid[targetRow] = Array(COLS).fill(null);
  game.blastCharge -= 50;
  game.blastCooldown = 4.2;
  game.mission.blasts += 1;
  game.score += 520 + bestFilled * 35;
  game.focus = Math.min(100, game.focus + 8);
  game.dangerRows = countDangerRows(game.grid);
  game.shake = 0.16;
  game.message = `Board-Blast Reihe ${targetRow + 1}`;
  game.messageTimer = 1;
}

function updatePressure(game, dt) {
  if (game.clearTimer > 0) return;
  const threshold = game.mode === 'learn'
    ? clamp(28 - game.level * 1.5 + game.focus / 12, 16, 34)
    : clamp(30 - game.level * 2, 14, 30);
  game.pressureTimer += dt;
  game.pressure = clamp((game.pressureTimer / threshold) * 100, 0, 100);
  if (game.pressureTimer < threshold) return;
  game.pressureTimer = 0;
  game.pressure = 0;
  addGarbageRow(game);
  game.focus = Math.max(0, game.focus - 5);
  game.message = game.mode === 'learn' ? 'Druckreihe - Fokus halten' : 'Garbage-Rush steigt';
  game.messageTimer = 1;
}

function refreshMissions(game) {
  MISSION_GOALS.forEach((goal) => {
    if (game.mission.rewards.includes(goal.id) || !goal.check(game)) return;
    game.mission.rewards.push(goal.id);
    goal.apply(game);
    game.score += 350;
    game.message = `${goal.label}: ${goal.reward}`;
    game.messageTimer = 1.2;
    addFloater(game, BOARD_X + BOARD_W / 2, BOARD_Y + 80, goal.reward, '#facc15');
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

function updateGame(game, controls, dt) {
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.fever = Math.max(0, game.fever - dt);
  game.blastCooldown = Math.max(0, game.blastCooldown - dt);
  game.shake = Math.max(0, game.shake - dt);
  updateEffects(game, dt);

  if (!game.started || game.finished) return;
  updatePressure(game, dt);

  if (game.clearTimer > 0) {
    game.clearTimer -= dt;
    if (game.clearTimer <= 0) finishClear(game);
    return;
  }

  if (controls.leftPressed) movePiece(game, -1);
  if (controls.rightPressed) movePiece(game, 1);
  if (controls.rotatePressed) rotatePiece(game, 1);
  if (controls.holdPressed) holdPiece(game);
  if (controls.hardPressed) hardDrop(game);
  if (controls.blastPressed) activateBoardBlast(game);

  game.softDrop = controls.down;
  const interval = game.softDrop ? 0.045 : clamp(0.82 - game.level * 0.055, 0.16, 0.82);
  game.dropTimer += dt;
  while (game.dropTimer >= interval && game.current && !game.finished) {
    game.dropTimer -= interval;
    softDropPiece(game);
  }
  refreshMissions(game);
}

function drawBackground(ctx) {
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, '#020617');
  bg.addColorStop(0.52, '#101a35');
  bg.addColorStop(1, '#111827');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.globalAlpha = 0.24;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
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
  ctx.restore();

  const glow = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 80, WIDTH / 2, HEIGHT / 2, 520);
  glow.addColorStop(0, 'rgba(124,58,237,.22)');
  glow.addColorStop(1, 'rgba(2,6,23,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawCell(ctx, x, y, color, alpha = 1, label = '') {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fillStyle = color;
  drawRoundedRect(ctx, x + 2, y + 2, CELL - 4, CELL - 4, 6);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = 'rgba(255,255,255,.22)';
  ctx.fillRect(x + 6, y + 5, CELL - 12, 4);
  if (label) {
    ctx.fillStyle = '#020617';
    ctx.font = '900 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + CELL / 2, y + CELL / 2 + 1);
  }
  ctx.restore();
}

function drawBoard(ctx, game) {
  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, BOARD_X - 18, BOARD_Y - 18, BOARD_W + 36, BOARD_H + 36, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(226,232,240,.22)';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (game.mode === 'learn') {
    const task = game.current?.task || currentTask(game);
    const zoneW = BOARD_W / task.options.length;
    task.options.forEach((option, index) => {
      const x = BOARD_X + zoneW * index;
      const correct = option === task.correct;
      ctx.fillStyle = correct ? 'rgba(34,197,94,.2)' : 'rgba(148,163,184,.1)';
      ctx.fillRect(x, BOARD_Y, zoneW, BOARD_H);
      ctx.fillStyle = correct ? '#bbf7d0' : '#cbd5e1';
      ctx.font = option.length > 10 ? '900 11px Outfit, sans-serif' : '900 13px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(option, x + zoneW / 2, BOARD_Y + BOARD_H - 10, zoneW - 8);
    });
  }

  ctx.strokeStyle = 'rgba(148,163,184,.18)';
  ctx.lineWidth = 1;
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

  game.grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell) return;
      const clearing = game.clearedRows.includes(rowIndex);
      const label = cell.modifier ? MODIFIERS[cell.modifier]?.label : '';
      drawCell(ctx, BOARD_X + colIndex * CELL, BOARD_Y + rowIndex * CELL, clearing ? '#fef3c7' : cell.color, clearing ? 0.8 : 1, label);
    });
  });

  if (game.current) {
    const ghost = ghostRow(game, game.current);
    blocksFor(game.current, game.current.rotation, ghost, game.current.col).forEach((block) => {
      if (block.row >= 0) drawCell(ctx, BOARD_X + block.col * CELL, BOARD_Y + block.row * CELL, game.current.color, 0.22);
    });
    blocksFor(game.current).forEach((block) => {
      const label = game.current.modifier ? MODIFIERS[game.current.modifier]?.label : game.mode === 'learn' ? game.current.type : '';
      if (block.row >= 0) drawCell(ctx, BOARD_X + block.col * CELL, BOARD_Y + block.row * CELL, game.current.color, 1, label);
    });
  }

  ctx.restore();
}

function drawMiniPiece(ctx, piece, x, y, title) {
  ctx.fillStyle = '#94a3b8';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText(title, x, y);
  if (!piece) return;
  ROTATIONS[piece.type][0].forEach(([row, col]) => {
    drawCell(ctx, x + col * 20, y + 18 + row * 20, piece.color, 1, piece.modifier ? MODIFIERS[piece.modifier]?.label : '');
  });
}

function drawSidePanels(ctx, game) {
  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,.76)';
  drawRoundedRect(ctx, 40, 42, 350, game.mode === 'learn' ? 330 : 278, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 28px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Faska Learn Blocks' : 'Faska Blocks Pro', 66, 84);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText(`Score ${game.score}`, 66, 118);
  ctx.fillText(`Linien ${game.lines}  Level ${game.level}`, 66, 146);
  ctx.fillText(`Combo x${Math.max(1, game.combo)}  High ${Math.max(game.highScore, game.score)}`, 66, 174);
  ctx.fillText(`Tetras ${game.tetras}  Garbage ${game.dangerRows}`, 66, 202);
  if (game.mode === 'learn') {
    const task = game.current?.task || currentTask(game);
    ctx.fillStyle = '#67e8f9';
    ctx.fillText(`${task.subject} - ${task.kind}`, 66, 236);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 17px Outfit, sans-serif';
    ctx.fillText(`"${task.prompt}"`, 66, 266);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '800 13px Outfit, sans-serif';
    ctx.fillText(task.sentence, 66, 290, 290);
  } else {
    drawGauge(ctx, 66, 220, 180, 'PRESSURE', game.pressure, '#f472b6');
  }

  ctx.fillStyle = 'rgba(2,6,23,.76)';
  drawRoundedRect(ctx, 888, 42, 350, 456, 18);
  ctx.fill();
  drawMiniPiece(ctx, game.queue[0], 922, 80, 'NAECHSTER STEIN');
  drawMiniPiece(ctx, game.hold, 922, 190, 'HOLD');
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 16px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? `Richtig ${game.correct}  Fehler ${game.wrong}` : 'Hold: C/Shift', 1044, 98);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText('Pfeile/A-D bewegen', 1044, 132);
  ctx.fillText('W/Up drehen', 1044, 158);
  ctx.fillText('S/Down weich fallen', 1044, 184);
  ctx.fillText('Space harter Fall', 1044, 210);
  ctx.fillText('X/F Board-Blast', 1044, 236);
  drawGauge(ctx, 1044, 238, 150, 'FOKUS', game.focus, game.focus > 45 ? '#22c55e' : '#f97316');
  drawGauge(ctx, 1044, 282, 150, 'FEVER', Math.min(100, game.fever * 20), '#facc15');
  drawGauge(ctx, 1044, 326, 150, 'BLAST', game.blastCharge, '#f472b6');
  drawGauge(ctx, 1044, 370, 150, 'PRESSURE', game.pressure, '#38bdf8');
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText('Missionen', 1044, 414);
  ctx.font = '800 10px Outfit, sans-serif';
  MISSION_GOALS.slice(0, 3).forEach((goal, index) => {
    const done = game.mission.rewards.includes(goal.id);
    ctx.fillStyle = done ? '#86efac' : '#94a3b8';
    ctx.fillText(`${done ? 'OK' : '--'} ${goal.label}`, 1044, 434 + index * 16);
  });
  ctx.restore();
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

function drawMessage(ctx, game) {
  if (game.messageTimer <= 0 && game.started && !game.finished) return;
  ctx.save();
  ctx.textAlign = 'center';
  if (!game.started || game.finished) {
    ctx.fillStyle = 'rgba(2,6,23,.7)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 50px Outfit, sans-serif';
    ctx.fillText(game.finished ? game.message : 'FASKA BLOCKS PRO', WIDTH / 2, 254);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '800 18px Outfit, sans-serif';
    ctx.fillText(game.finished ? `Score ${game.score} - Highscore ${Math.max(game.highScore, game.score)}` : 'Falling-Blocks-Pro mit Hold, Ghost, Bomb/Laser/Prisma-Steinen, Board-Blast, Drucksystem und Learncade-Zonen.', WIDTH / 2, 296);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '900 16px Outfit, sans-serif';
    ctx.fillText('Oben Normal oder Learncade waehlen. X/F = Board-Blast.', WIDTH / 2, 330);
  } else {
    ctx.fillStyle = 'rgba(2,6,23,.74)';
    drawRoundedRect(ctx, WIDTH / 2 - 250, 32, 500, 48, 16);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 20px Outfit, sans-serif';
    ctx.fillText(game.message, WIDTH / 2, 64);
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
  drawBackground(ctx);
  drawBoard(ctx, game);
  drawSidePanels(ctx, game);
  drawEffects(ctx, game);
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
  width: 66,
  height: 56,
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,.2)',
  background: 'rgba(15,23,42,.76)',
  color: '#f8fafc',
  fontSize: 15,
  fontWeight: 900,
  touchAction: 'none',
};

export default function FaskaBlocksSwarm() {
  const canvasRef = useRef(null);
  const modeRef = useRef('arcade');
  const gameRef = useRef(makeInitialGame('arcade'));
  const keysRef = useRef({ left: false, right: false, down: false });
  const touchRef = useRef({ left: false, right: false, down: false });
  const pulseRef = useRef({ left: false, right: false, rotate: false, hold: false, hard: false, blast: false });
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
      ? 'Lege Antwort-Steine, nutze Spezialsteine und halte Fokus.'
      : 'Raeume Linien, nutze Spezialsteine und Board-Blast.';
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
      if (['arrowleft', 'arrowright', 'arrowdown', 'arrowup', 'a', 'd', 's', 'w', ' ', 'shift', 'c', 'm'].includes(key)) event.preventDefault();
      if (key === 'arrowleft' || key === 'a') pulseRef.current.left = true;
      if (key === 'arrowright' || key === 'd') pulseRef.current.right = true;
      if (key === 'arrowdown' || key === 's') keysRef.current.down = true;
      if (key === 'arrowup' || key === 'w') pulseRef.current.rotate = true;
      if (key === ' ' || key === 'enter') pulseRef.current.hard = true;
      if (key === 'shift' || key === 'c') pulseRef.current.hold = true;
      if (key === 'x' || key === 'f') pulseRef.current.blast = true;
      if (key === 'm') startGame(modeRef.current === 'learn' ? 'arcade' : 'learn');
    };
    const up = (event) => {
      const key = event.key.toLowerCase();
      if (key === 'arrowdown' || key === 's') keysRef.current.down = false;
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
      const pulses = pulseRef.current;
      updateGame(gameRef.current, {
        leftPressed: pulses.left || touchRef.current.left,
        rightPressed: pulses.right || touchRef.current.right,
        rotatePressed: pulses.rotate,
        holdPressed: pulses.hold,
        hardPressed: pulses.hard,
        blastPressed: pulses.blast,
        down: keysRef.current.down || touchRef.current.down,
      }, dt);
      pulseRef.current = { left: false, right: false, rotate: false, hold: false, hard: false, blast: false };
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

  const holdButton = (key, mode = 'hold') => ({
    onPointerDown: (event) => {
      event.preventDefault();
      if (mode === 'pulse') pulseRef.current[key] = true;
      else touchRef.current[key] = true;
    },
    onPointerUp: (event) => {
      event.preventDefault();
      if (mode !== 'pulse') touchRef.current[key] = false;
    },
    onPointerCancel: () => {
      if (mode !== 'pulse') touchRef.current[key] = false;
    },
    onPointerLeave: () => {
      if (mode !== 'pulse') touchRef.current[key] = false;
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

      <div style={{
        position: 'fixed',
        left: 18,
        bottom: 20,
        display: 'flex',
        gap: 10,
        zIndex: 5,
      }}>
        <button type="button" aria-label="Links" style={touchButton} {...holdButton('left')}>L</button>
        <button type="button" aria-label="Rechts" style={touchButton} {...holdButton('right')}>R</button>
        <button type="button" aria-label="Runter" style={touchButton} {...holdButton('down')}>Down</button>
      </div>

      <div style={{
        position: 'fixed',
        right: 18,
        bottom: 20,
        display: 'flex',
        gap: 10,
        zIndex: 5,
      }}>
        <button type="button" aria-label="Hold" style={touchButton} {...holdButton('hold', 'pulse')}>Hold</button>
        <button type="button" aria-label="Drehen" style={touchButton} {...holdButton('rotate', 'pulse')}>Rot</button>
        <button type="button" aria-label="Blast" style={{ ...touchButton, background: 'rgba(244,114,182,.82)' }} {...holdButton('blast', 'pulse')}>Blast</button>
        <button type="button" aria-label="Drop" style={{ ...touchButton, background: 'rgba(34,197,94,.82)', color: '#052e16' }} {...holdButton('hard', 'pulse')}>Drop</button>
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
    </div>
  );
}
