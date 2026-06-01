import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const CENTER_X = WIDTH / 2;
const TILE = 58;
const COLS = 14;
const ROWS = 9;
const BOARD_X = 186;
const BOARD_Y = 102;
const BOARD_W = COLS * TILE;
const BOARD_H = ROWS * TILE;

const TERRAIN = [
  '..............',
  '..#...C....#..',
  '..#..H....C...',
  '.....##.......',
  '..C.....#..H..',
  '.......##.....',
  '...H....C..#..',
  '..#....C...#..',
  '..............',
];

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "klug"?',
    answer: 'Adjektiv',
    options: ['Nomen', 'Verb', 'Adjektiv'],
  },
  {
    subject: 'Mathe',
    prompt: '8 x 7 = ?',
    answer: '56',
    options: ['54', '56', '64'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "castle"?',
    answer: 'Burg',
    options: ['Burg', 'Bruecke', 'Baum'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Pflanzen brauchen Licht und ...',
    answer: 'Wasser',
    options: ['Sand', 'Wasser', 'Metall'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "kaempft"?',
    answer: 'Verb',
    options: ['Verb', 'Nomen', 'Adjektiv'],
  },
  {
    subject: 'Deutsch',
    prompt: 'In "Der Ritter schuetzt Lumi": Wer ist das Subjekt?',
    answer: 'Der Ritter',
    options: ['Der Ritter', 'schuetzt', 'Lumi'],
  },
  {
    subject: 'Mathe',
    prompt: '36 : 6 = ?',
    answer: '6',
    options: ['5', '6', '7'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "shield"?',
    answer: 'Schild',
    options: ['Schild', 'Schwert', 'Schuh'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Welche Energie kommt von der Sonne?',
    answer: 'Licht',
    options: ['Licht', 'Eis', 'Stein'],
  },
];

const OBJECTIVE_TILES = [
  { id: 'relais-a', x: 3, y: 6, label: 'Relais', reward: 320, focus: 1 },
  { id: 'relais-b', x: 6, y: 1, label: 'Archiv', reward: 360, focus: 1 },
  { id: 'relais-c', x: 10, y: 5, label: 'Signal', reward: 420, focus: 2 },
];

const TRAP_TILES = [
  { id: 'trap-a', x: 5, y: 3, label: 'Rune' },
  { id: 'trap-b', x: 8, y: 5, label: 'Spike' },
  { id: 'trap-c', x: 11, y: 2, label: 'Shock' },
];

const MISSION_GOALS = [
  { id: 'captures-2', label: '2 Kartenziele sichern', stat: 'captures', target: 2, reward: 700 },
  { id: 'kills-5', label: '5 Gegner ausschalten', stat: 'kills', target: 5, reward: 860 },
  { id: 'guard-2', label: '2 Overwatch-Treffer', stat: 'guardShots', target: 2, reward: 620 },
  { id: 'focus-3', label: '3 Fokus-Skills nutzen', stat: 'focusSkills', target: 3, reward: 720 },
  { id: 'flank-2', label: '2 Flankenangriffe', stat: 'flankHits', target: 2, reward: 660 },
  { id: 'trap-2', label: '2 Gegner in Fallen locken', stat: 'enemyTrapHits', target: 2, reward: 780 },
  { id: 'learn-3', label: '3 Antwortzonen sichern', stat: 'learnCorrect', target: 3, reward: 900, learnOnly: true },
  { id: 'survivors-2', label: 'Mit 2 Helden gewinnen', stat: 'survivors', target: 2, reward: 720 },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const gridKey = (x, y) => `${x},${y}`;

function createStats() {
  return {
    captures: 0,
    kills: 0,
    guardShots: 0,
    focusSkills: 0,
    flankHits: 0,
    enemyTrapHits: 0,
    learnCorrect: 0,
    survivors: 0,
  };
}

function createGoals(mode) {
  return MISSION_GOALS
    .filter((goal) => mode === 'learn' || !goal.learnOnly)
    .map((goal) => ({ ...goal, completed: false }));
}

function completeMatchingGoal(game, stat) {
  const completed = game.goals.find((goal) => !goal.completed && goal.stat === stat && (game.stats[stat] || 0) >= goal.target);
  if (!completed) return;
  completed.completed = true;
  game.score += completed.reward;
  game.missionNotice = `${completed.label} +${completed.reward}`;
  game.missionNoticeTimer = 2.1;
  game.message = `Mission geschafft: ${completed.label}`;
  game.messageTimer = 1.25;
}

function recordStat(game, stat, amount = 1) {
  game.stats[stat] = (game.stats[stat] || 0) + amount;
  completeMatchingGoal(game, stat);
}

function setStat(game, stat, value) {
  game.stats[stat] = Math.max(game.stats[stat] || 0, value);
  completeMatchingGoal(game, stat);
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

function tileAt(x, y) {
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return '#';
  return TERRAIN[y][x];
}

function isBlocked(game, x, y) {
  if (tileAt(x, y) === '#') return true;
  return game.units.some((unit) => unit.hp > 0 && unit.x === x && unit.y === y);
}

function cellCenter(x, y) {
  return {
    x: BOARD_X + x * TILE + TILE / 2,
    y: BOARD_Y + y * TILE + TILE / 2,
  };
}

function makeUnit(id, team, type, name, x, y) {
  const stats = {
    scout: { hp: 42, move: 5, range: 5, power: 11, color: '#38bdf8' },
    knight: { hp: 64, move: 4, range: 1, power: 16, color: '#2563eb' },
    mage: { hp: 38, move: 4, range: 3, power: 13, color: '#a855f7' },
    slime: { hp: 26, move: 3, range: 1, power: 9, color: '#84cc16' },
    archer: { hp: 30, move: 3, range: 4, power: 10, color: '#f97316' },
    brute: { hp: 48, move: 3, range: 1, power: 14, color: '#ef4444' },
    assassin: { hp: 34, move: 5, range: 1, power: 18, color: '#f43f5e' },
    shaman: { hp: 36, move: 3, range: 3, power: 8, color: '#14b8a6' },
    boss: { hp: 92, move: 3, range: 3, power: 16, color: '#991b1b' },
  }[type];
  return {
    id,
    team,
    type,
    name,
    x,
    y,
    hp: stats.hp,
    maxHp: stats.hp,
    move: stats.move,
    range: stats.range,
    power: stats.power,
    color: stats.color,
    ap: team === 'hero' ? 2 : 1,
    acted: false,
    moved: false,
    guarding: false,
    marked: 0,
    shielded: 0,
    slowed: 0,
    enraged: false,
    guardFlash: 0,
    hitTimer: 0,
  };
}

function buildAnswerTiles(taskIndex) {
  const task = LEARN_TASKS[taskIndex % LEARN_TASKS.length];
  const positions = [
    { x: 4, y: 1 },
    { x: 7, y: 4 },
    { x: 10, y: 7 },
  ];
  return task.options.map((label, index) => ({
    id: `answer-${taskIndex}-${label}`,
    label,
    x: positions[index].x,
    y: positions[index].y,
    correct: label === task.answer,
    active: true,
    pulse: index * 0.7,
  }));
}

function makeInitialGame(mode = 'arcade') {
  const units = [
    makeUnit('hero-scout', 'hero', 'scout', 'Mika Scout', 1, 7),
    makeUnit('hero-knight', 'hero', 'knight', 'Faska Guard', 1, 5),
    makeUnit('hero-mage', 'hero', 'mage', 'Lumi Mage', 2, 6),
    makeUnit('enemy-slime-a', 'enemy', 'slime', 'Splitterschleim', 9, 1),
    makeUnit('enemy-archer', 'enemy', 'archer', 'Runenbogner', 11, 3),
    makeUnit('enemy-shaman', 'enemy', 'shaman', 'Runenheiler', 12, 5),
    makeUnit('enemy-brute', 'enemy', 'brute', 'Wuchtwache', 8, 6),
    makeUnit('enemy-assassin', 'enemy', 'assassin', 'Schattenlaeufer', 10, 5),
    makeUnit('enemy-slime-b', 'enemy', 'slime', 'Moorschleim', 12, 7),
    makeUnit('enemy-boss', 'enemy', 'boss', 'Taktikboss', 12, 1),
  ];
  return {
    mode,
    elapsed: 0,
    phase: 'player',
    turn: 1,
    selectedId: 'hero-scout',
    hoverCell: null,
    message: mode === 'learn' ? 'Besetze die richtige Antwortzone fuer Fokus.' : 'Plane Bewegung, Deckung und Angriffe.',
    messageTimer: 2,
    taskIndex: 0,
    answerCooldown: mode === 'learn' ? 0.8 : 0,
    focus: mode === 'learn' ? 1 : 0,
    score: 0,
    missionNotice: '',
    missionNoticeTimer: 0,
    stats: createStats(),
    goals: createGoals(mode),
    particles: [],
    units,
    objectives: OBJECTIVE_TILES.map((objective, index) => ({ ...objective, capturedBy: null, pulse: index * 0.45 })),
    traps: TRAP_TILES.map((trap, index) => ({ ...trap, active: true, pulse: index * 0.8 })),
    answerTiles: mode === 'learn' ? buildAnswerTiles(0) : [],
    moveHistory: [],
    reinforced: false,
    result: null,
  };
}

function liveUnits(game, team) {
  return game.units.filter((unit) => unit.team === team && unit.hp > 0);
}

function selectedUnit(game) {
  return game.units.find((unit) => unit.id === game.selectedId && unit.hp > 0);
}

function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function terrainDefense(x, y) {
  const tile = tileAt(x, y);
  if (tile === 'C') return 4;
  if (tile === 'H') return 2;
  return 0;
}

function isFlanked(game, attacker, defender) {
  if (!attacker || !defender) return false;
  return game.units.some((unit) => (
    unit.hp > 0
    && unit.team === attacker.team
    && unit.id !== attacker.id
    && manhattan(unit, defender) <= 1
  ));
}

function getReachable(game, unit) {
  if (!unit || unit.ap <= 0 || unit.moved) return new Set();
  const moveBudget = Math.max(2, unit.move - (unit.slowed > 0 ? 2 : 0));
  const start = { x: unit.x, y: unit.y, cost: 0 };
  const open = [start];
  const seen = new Map([[gridKey(unit.x, unit.y), 0]]);
  while (open.length) {
    const current = open.shift();
    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];
    neighbors.forEach((next) => {
      const key = gridKey(next.x, next.y);
      const nextCost = current.cost + (tileAt(next.x, next.y) === 'H' ? 2 : 1);
      if (nextCost > moveBudget || tileAt(next.x, next.y) === '#') return;
      if (game.units.some((other) => other.hp > 0 && other.id !== unit.id && other.x === next.x && other.y === next.y)) return;
      if (seen.has(key) && seen.get(key) <= nextCost) return;
      seen.set(key, nextCost);
      open.push({ ...next, cost: nextCost });
    });
  }
  seen.delete(gridKey(unit.x, unit.y));
  return new Set(seen.keys());
}

function spawnParticles(game, x, y, color, count = 8) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed;
    const speed = 70 + (i % 5) * 28;
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

function snapshotMove(game, unit) {
  game.moveHistory.push({
    id: unit.id,
    x: unit.x,
    y: unit.y,
    hp: unit.hp,
    ap: unit.ap,
    moved: unit.moved,
    guarding: unit.guarding,
    score: game.score,
    focus: game.focus,
    taskIndex: game.taskIndex,
    answerCooldown: game.answerCooldown,
    answerTiles: game.answerTiles.map((answer) => ({ ...answer })),
    objectives: game.objectives.map((objective) => ({ ...objective })),
    traps: game.traps.map((trap) => ({ ...trap })),
    stats: { ...game.stats },
    goals: game.goals.map((goal) => ({ ...goal })),
    missionNotice: game.missionNotice,
    missionNoticeTimer: game.missionNoticeTimer,
  });
  if (game.moveHistory.length > 8) game.moveHistory.shift();
}

function attackUnit(game, attacker, defender, skill = false) {
  if (!attacker || !defender || attacker.ap <= 0 || attacker.acted) return false;
  const dist = manhattan(attacker, defender);
  if (dist > attacker.range + (skill && attacker.type === 'mage' ? 1 : 0)) {
    game.message = 'Ziel ausser Reichweite';
    game.messageTimer = 0.7;
    return false;
  }
  const highGround = tileAt(attacker.x, attacker.y) === 'H' ? 3 : 0;
  const defense = terrainDefense(defender.x, defender.y);
  const focusBonus = skill ? game.focus * 3 : 0;
  const markedBonus = defender.marked > 0 ? 5 : 0;
  const flankBonus = isFlanked(game, attacker, defender) ? 5 : 0;
  const shieldReduction = defender.shielded > 0 ? 5 : 0;
  const wasAlive = defender.hp > 0;
  const damage = clamp(attacker.power + highGround + focusBonus + markedBonus + flankBonus - defense - shieldReduction, 4, 46);
  defender.hp = clamp(defender.hp - damage, 0, defender.maxHp);
  if (attacker.type === 'scout' && defender.hp > 0) defender.marked = Math.max(defender.marked, 2);
  defender.hitTimer = 0.3;
  attacker.ap -= 1;
  attacker.acted = true;
  attacker.guarding = false;
  game.moveHistory = game.moveHistory.filter((entry) => entry.id !== attacker.id);
  game.score += damage * 12 + (defender.hp <= 0 ? 280 : 0);
  if (flankBonus > 0) recordStat(game, 'flankHits');
  if (wasAlive && defender.hp <= 0 && attacker.team === 'hero') recordStat(game, 'kills');
  if (skill) game.focus = Math.max(0, game.focus - 1);
  const center = cellCenter(defender.x, defender.y);
  spawnParticles(game, center.x, center.y, defender.hp <= 0 ? '#facc15' : '#fb7185', defender.hp <= 0 ? 16 : 9);
  game.message = defender.hp <= 0
    ? `${defender.name} besiegt`
    : `${damage} Schaden${flankBonus ? ' + Flanke' : ''}${markedBonus ? ' + Markierung' : ''}`;
  game.messageTimer = 0.8;
  return true;
}

function moveUnit(game, unit, x, y) {
  if (!unit || unit.ap <= 0 || unit.moved) return false;
  const reachable = getReachable(game, unit);
  if (!reachable.has(gridKey(x, y))) {
    game.message = 'Feld nicht erreichbar';
    game.messageTimer = 0.6;
    return false;
  }
  snapshotMove(game, unit);
  unit.x = x;
  unit.y = y;
  unit.moved = true;
  unit.guarding = false;
  unit.ap -= 1;
  game.score += tileAt(x, y) === 'H' ? 30 : 18;
  const center = cellCenter(x, y);
  spawnParticles(game, center.x, center.y, '#67e8f9', 6);
  return true;
}

function undoLastMove(game) {
  if (game.phase !== 'player') return false;
  while (game.moveHistory.length) {
    const previous = game.moveHistory.pop();
    const unit = game.units.find((candidate) => candidate.id === previous.id);
    if (!unit) continue;
    if (unit.acted) {
      game.message = 'Nach einem Angriff kein Undo';
      game.messageTimer = 0.85;
      return false;
    }
    unit.x = previous.x;
    unit.y = previous.y;
    unit.hp = previous.hp;
    unit.ap = previous.ap;
    unit.moved = previous.moved;
    unit.guarding = previous.guarding;
    unit.hitTimer = 0;
    game.score = previous.score;
    game.focus = previous.focus;
    game.taskIndex = previous.taskIndex;
    game.answerCooldown = previous.answerCooldown;
    game.answerTiles = previous.answerTiles.map((answer) => ({ ...answer }));
    game.objectives = previous.objectives.map((objective) => ({ ...objective }));
    game.traps = previous.traps.map((trap) => ({ ...trap }));
    game.stats = { ...previous.stats };
    game.goals = previous.goals.map((goal) => ({ ...goal }));
    game.missionNotice = previous.missionNotice;
    game.missionNoticeTimer = previous.missionNoticeTimer;
    game.selectedId = unit.id;
    game.message = `${unit.name} zurueckgesetzt`;
    game.messageTimer = 0.85;
    spawnParticles(game, cellCenter(unit.x, unit.y).x, cellCenter(unit.x, unit.y).y, '#facc15', 8);
    return true;
  }
  game.message = 'Kein Zug zum Zuruecknehmen';
  game.messageTimer = 0.75;
  return false;
}

function resolveGuardFire(game, enemy) {
  if (!enemy || enemy.hp <= 0) return false;
  const defender = liveUnits(game, 'hero')
    .filter((hero) => hero.guarding && manhattan(hero, enemy) <= Math.max(2, hero.range))
    .sort((a, b) => manhattan(a, enemy) - manhattan(b, enemy))[0];
  if (!defender) return false;
  const highGround = tileAt(defender.x, defender.y) === 'H' ? 3 : 0;
  const damage = clamp(defender.power + highGround - terrainDefense(enemy.x, enemy.y), 5, 26);
  const wasAlive = enemy.hp > 0;
  defender.guarding = false;
  defender.guardFlash = 0.45;
  enemy.hp = clamp(enemy.hp - damage, 0, enemy.maxHp);
  enemy.hitTimer = 0.35;
  game.score += damage * 10 + (enemy.hp <= 0 ? 260 : 0);
  recordStat(game, 'guardShots');
  if (wasAlive && enemy.hp <= 0) recordStat(game, 'kills');
  const center = cellCenter(enemy.x, enemy.y);
  spawnParticles(game, center.x, center.y, enemy.hp <= 0 ? '#facc15' : '#38bdf8', enemy.hp <= 0 ? 15 : 9);
  game.message = enemy.hp <= 0 ? `${defender.name} stoppt ${enemy.name}` : `${defender.name} deckt ${damage}`;
  game.messageTimer = 0.9;
  return enemy.hp <= 0;
}

function setGuard(game) {
  if (game.phase !== 'player') return false;
  const unit = selectedUnit(game);
  if (!unit || unit.ap <= 0 || unit.acted) {
    game.message = 'Guard nicht moeglich';
    game.messageTimer = 0.7;
    return false;
  }
  unit.ap -= 1;
  unit.acted = true;
  unit.moved = true;
  unit.guarding = true;
  unit.guardFlash = 0.7;
  game.moveHistory = game.moveHistory.filter((entry) => entry.id !== unit.id);
  game.score += 25;
  game.message = `${unit.name} sichert den Bereich`;
  game.messageTimer = 0.85;
  spawnParticles(game, cellCenter(unit.x, unit.y).x, cellCenter(unit.x, unit.y).y, '#a7f3d0', 10);
  return true;
}

function resolveAnswerTile(game, unit) {
  if (game.mode !== 'learn' || unit.team !== 'hero') return;
  if (game.answerCooldown > 0) return;
  const tile = game.answerTiles.find((answer) => answer.active && answer.x === unit.x && answer.y === unit.y);
  if (!tile) return;
  const task = LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
  tile.active = false;
  if (tile.correct) {
    game.focus = clamp(game.focus + 2, 0, 5);
    unit.ap = Math.min(2, unit.ap + 1);
    game.score += 520;
    recordStat(game, 'learnCorrect');
    game.message = `${task.subject}: ${task.answer}`;
    spawnParticles(game, cellCenter(tile.x, tile.y).x, cellCenter(tile.x, tile.y).y, '#5eead4', 18);
  } else {
    unit.hp = clamp(unit.hp - 8, 0, unit.maxHp);
    game.focus = Math.max(0, game.focus - 1);
    game.message = `${tile.label} war falsch. Richtig: ${task.answer}`;
    spawnParticles(game, cellCenter(tile.x, tile.y).x, cellCenter(tile.x, tile.y).y, '#fb7185', 12);
  }
  game.messageTimer = 1.1;
  game.taskIndex += 1;
  game.answerTiles = buildAnswerTiles(game.taskIndex);
  game.answerCooldown = 1;
}

function resolveObjectiveTile(game, unit) {
  if (unit.team !== 'hero') return;
  const objective = game.objectives.find((target) => !target.capturedBy && target.x === unit.x && target.y === unit.y);
  if (!objective) return;
  objective.capturedBy = unit.id;
  game.focus = clamp(game.focus + objective.focus, 0, 6);
  unit.hp = clamp(unit.hp + 8, 0, unit.maxHp);
  unit.ap = Math.min(2, unit.ap + 1);
  game.score += objective.reward;
  recordStat(game, 'captures');
  game.message = `${objective.label} gesichert`;
  game.messageTimer = 1;
  spawnParticles(game, cellCenter(objective.x, objective.y).x, cellCenter(objective.x, objective.y).y, '#22c55e', 20);
}

function resolveTrapTile(game, unit) {
  const trap = game.traps.find((candidate) => candidate.active && candidate.x === unit.x && candidate.y === unit.y);
  if (!trap) return;
  trap.active = false;
  const damage = unit.team === 'enemy' ? 22 : 12;
  unit.hp = clamp(unit.hp - damage, 0, unit.maxHp);
  unit.slowed = Math.max(unit.slowed, 2);
  unit.hitTimer = 0.35;
  if (unit.team === 'enemy') {
    game.score += 180;
    recordStat(game, 'enemyTrapHits');
    if (unit.hp <= 0) recordStat(game, 'kills');
  }
  game.message = `${trap.label}-Falle trifft ${unit.name}`;
  game.messageTimer = 0.95;
  spawnParticles(game, cellCenter(trap.x, trap.y).x, cellCenter(trap.x, trap.y).y, '#fb7185', 18);
}

function resolveBoardEffects(game, unit) {
  resolveTrapTile(game, unit);
  if (unit.hp <= 0) return;
  resolveObjectiveTile(game, unit);
  resolveAnswerTile(game, unit);
}

function nearestHero(game, enemy) {
  return liveUnits(game, 'hero').sort((a, b) => manhattan(enemy, a) - manhattan(enemy, b))[0];
}

function enemyStepToward(game, enemy, target) {
  if (!target || enemy.ap <= 0) return;
  const candidates = [
    { x: enemy.x + 1, y: enemy.y },
    { x: enemy.x - 1, y: enemy.y },
    { x: enemy.x, y: enemy.y + 1 },
    { x: enemy.x, y: enemy.y - 1 },
  ]
    .filter((cell) => !isBlocked(game, cell.x, cell.y) && tileAt(cell.x, cell.y) !== '#')
    .sort((a, b) => manhattan(a, target) - manhattan(b, target));
  const next = candidates[0];
  if (!next) return;
  enemy.x = next.x;
  enemy.y = next.y;
  enemy.ap -= 1;
  resolveTrapTile(game, enemy);
}

function tryEnemySupport(game, enemy) {
  if (enemy.type !== 'shaman' || enemy.ap <= 0) return false;
  const wounded = liveUnits(game, 'enemy')
    .filter((ally) => ally.id !== enemy.id && ally.hp < ally.maxHp && manhattan(enemy, ally) <= 3)
    .sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
  if (!wounded) return false;
  wounded.hp = clamp(wounded.hp + 16, 0, wounded.maxHp);
  wounded.marked = Math.max(0, wounded.marked - 1);
  enemy.ap = 0;
  game.message = `${enemy.name} heilt ${wounded.name}`;
  game.messageTimer = 0.8;
  spawnParticles(game, cellCenter(wounded.x, wounded.y).x, cellCenter(wounded.x, wounded.y).y, '#5eead4', 14);
  return true;
}

function maybeSpawnReinforcement(game) {
  const boss = game.units.find((unit) => unit.type === 'boss' && unit.hp > 0);
  if (!boss || game.reinforced || !(game.turn >= 4 || boss.hp <= boss.maxHp * 0.55)) return;
  game.reinforced = true;
  boss.enraged = true;
  boss.power += 4;
  boss.range = Math.max(boss.range, 4);
  const spawns = [
    makeUnit('enemy-reinforce-a', 'enemy', 'assassin', 'Riftklinge', 13, 8),
    makeUnit('enemy-reinforce-b', 'enemy', 'archer', 'Hochwache', 11, 8),
  ];
  spawns.forEach((unit) => {
    if (!isBlocked(game, unit.x, unit.y)) {
      game.units.push(unit);
      spawnParticles(game, cellCenter(unit.x, unit.y).x, cellCenter(unit.x, unit.y).y, '#f43f5e', 16);
    }
  });
  game.message = 'Boss ruft Verstaerkung';
  game.messageTimer = 1.1;
}

function runEnemyTurn(game) {
  game.phase = 'enemy';
  game.moveHistory = [];
  maybeSpawnReinforcement(game);
  game.units.forEach((unit) => {
    if (unit.team === 'enemy' && unit.hp > 0) {
      unit.ap = 1;
      unit.acted = false;
      unit.moved = false;
    }
  });
  liveUnits(game, 'enemy').forEach((enemy) => {
    const target = nearestHero(game, enemy);
    if (!target) return;
    if (tryEnemySupport(game, enemy)) return;
    if (manhattan(enemy, target) > enemy.range) enemyStepToward(game, enemy, target);
    if (enemy.hp <= 0) return;
    if (resolveGuardFire(game, enemy)) return;
    if (manhattan(enemy, target) <= enemy.range && enemy.ap > 0) {
      const shieldReduction = target.shielded > 0 ? 6 : 0;
      const markPenalty = enemy.marked > 0 ? 3 : 0;
      const assassinBonus = enemy.type === 'assassin' && target.hp < target.maxHp * 0.55 ? 5 : 0;
      const damage = clamp(enemy.power + assassinBonus - terrainDefense(target.x, target.y) - shieldReduction - markPenalty, 3, 36);
      target.hp = clamp(target.hp - damage, 0, target.maxHp);
      target.hitTimer = 0.3;
      enemy.ap = 0;
      const center = cellCenter(target.x, target.y);
      spawnParticles(game, center.x, center.y, '#fb7185', 10);
    }
  });
  liveUnits(game, 'hero').forEach((unit) => {
    unit.ap = 2;
    unit.acted = false;
    unit.moved = false;
    unit.guarding = false;
  });
  game.units.forEach((unit) => {
    unit.marked = Math.max(0, unit.marked - 1);
    unit.shielded = Math.max(0, unit.shielded - 1);
    unit.slowed = Math.max(0, unit.slowed - 1);
  });
  const nextHero = liveUnits(game, 'hero')[0];
  game.selectedId = nextHero?.id || null;
  game.turn += 1;
  game.phase = 'player';
  game.message = `Runde ${game.turn}`;
  game.messageTimer = 0.9;
}

function endTurn(game) {
  if (game.phase !== 'player') return;
  runEnemyTurn(game);
}

function updateWinLoss(game, onFinish) {
  const heroes = liveUnits(game, 'hero');
  const enemies = liveUnits(game, 'enemy');
  if (heroes.length === 0 || enemies.length === 0 || game.turn > 14) {
    const won = enemies.length === 0;
    if (won) setStat(game, 'survivors', heroes.length);
    game.phase = 'result';
    game.result = {
      title: won ? 'Mission gewonnen' : 'Mission verloren',
      score: game.score + (won ? 1600 + heroes.reduce((sum, unit) => sum + unit.hp, 0) * 8 : 0),
      turn: game.turn,
    };
    onFinish(game.result);
  }
}

function updateGame(game, dt, onFinish) {
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.missionNoticeTimer = Math.max(0, game.missionNoticeTimer - dt);
  game.answerCooldown = Math.max(0, game.answerCooldown - dt);
  game.units.forEach((unit) => {
    unit.hitTimer = Math.max(0, unit.hitTimer - dt);
    unit.guardFlash = Math.max(0, unit.guardFlash - dt);
  });
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
  if (game.phase !== 'result') updateWinLoss(game, onFinish);
}

function cellFromPoint(clientX, clientY, canvas) {
  const rect = canvas.getBoundingClientRect();
  const sx = WIDTH / rect.width;
  const sy = HEIGHT / rect.height;
  const x = (clientX - rect.left) * sx;
  const y = (clientY - rect.top) * sy;
  const col = Math.floor((x - BOARD_X) / TILE);
  const row = Math.floor((y - BOARD_Y) / TILE);
  if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return null;
  return { x: col, y: row };
}

function handleCell(game, cell) {
  if (!cell || game.phase !== 'player') return;
  const clickedUnit = game.units.find((unit) => unit.hp > 0 && unit.x === cell.x && unit.y === cell.y);
  if (clickedUnit?.team === 'hero') {
    game.selectedId = clickedUnit.id;
    game.message = clickedUnit.name;
    game.messageTimer = 0.6;
    return;
  }
  const unit = selectedUnit(game);
  if (!unit) return;
  if (clickedUnit?.team === 'enemy') {
    attackUnit(game, unit, clickedUnit, false);
    return;
  }
  if (moveUnit(game, unit, cell.x, cell.y)) resolveBoardEffects(game, unit);
}

function triggerFocusSkill(game) {
  const unit = selectedUnit(game);
  if (!unit || game.focus <= 0 || unit.ap <= 0 || unit.acted) {
    game.message = 'Kein Fokus';
    game.messageTimer = 0.6;
    return;
  }
  const target = liveUnits(game, 'enemy').sort((a, b) => manhattan(unit, a) - manhattan(unit, b))[0];
  if (!target) return;
  if (unit.type !== 'mage' && unit.type !== 'knight' && manhattan(unit, target) > unit.range + 2) {
    game.message = 'Mark Shot ausser Reichweite';
    game.messageTimer = 0.8;
    return;
  }
  unit.ap -= 1;
  unit.acted = true;
  unit.guarding = false;
  game.moveHistory = game.moveHistory.filter((entry) => entry.id !== unit.id);
  game.focus = Math.max(0, game.focus - 1);
  recordStat(game, 'focusSkills');
  if (unit.type === 'mage') {
    liveUnits(game, 'enemy').forEach((enemy) => {
      if (manhattan(target, enemy) <= 1) {
        const wasAlive = enemy.hp > 0;
        enemy.hp = clamp(enemy.hp - 16, 0, enemy.maxHp);
        enemy.hitTimer = 0.3;
        game.score += 160;
        enemy.marked = Math.max(enemy.marked, 1);
        if (wasAlive && enemy.hp <= 0) recordStat(game, 'kills');
        const center = cellCenter(enemy.x, enemy.y);
        spawnParticles(game, center.x, center.y, '#a855f7', 10);
      }
    });
    game.message = 'Runensturm';
    game.messageTimer = 0.8;
  } else if (unit.type === 'knight') {
    unit.shielded = Math.max(unit.shielded, 2);
    unit.guarding = true;
    liveUnits(game, 'enemy').forEach((enemy) => {
      if (manhattan(unit, enemy) <= 1) {
        const wasAlive = enemy.hp > 0;
        enemy.hp = clamp(enemy.hp - 18, 0, enemy.maxHp);
        enemy.slowed = Math.max(enemy.slowed, 1);
        enemy.hitTimer = 0.35;
        game.score += 190;
        if (wasAlive && enemy.hp <= 0) recordStat(game, 'kills');
        spawnParticles(game, cellCenter(enemy.x, enemy.y).x, cellCenter(enemy.x, enemy.y).y, '#facc15', 12);
      }
    });
    spawnParticles(game, cellCenter(unit.x, unit.y).x, cellCenter(unit.x, unit.y).y, '#a7f3d0', 16);
    game.message = 'Schildwall-Bash';
    game.messageTimer = 0.9;
  } else {
    const wasAlive = target.hp > 0;
    target.marked = Math.max(target.marked, 3);
    target.slowed = Math.max(target.slowed, 2);
    target.hp = clamp(target.hp - 14, 0, target.maxHp);
    target.hitTimer = 0.35;
    game.score += 210;
    if (wasAlive && target.hp <= 0) recordStat(game, 'kills');
    spawnParticles(game, cellCenter(target.x, target.y).x, cellCenter(target.x, target.y).y, '#38bdf8', 14);
    game.message = 'Mark Shot';
    game.messageTimer = 0.9;
  }
}

function restartUnits(game) {
  liveUnits(game, 'hero').forEach((unit) => {
    unit.ap = 2;
    unit.acted = false;
    unit.moved = false;
    unit.guarding = false;
  });
}

function getThreatenedCells(game) {
  const cells = new Set();
  liveUnits(game, 'enemy').forEach((enemy) => {
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        if (tileAt(x, y) !== '#' && manhattan(enemy, { x, y }) <= enemy.range) cells.add(gridKey(x, y));
      }
    }
  });
  return cells;
}

function drawGrid(ctx, game) {
  ctx.save();
  ctx.fillStyle = '#111827';
  drawRoundedRect(ctx, BOARD_X - 10, BOARD_Y - 10, BOARD_W + 20, BOARD_H + 20, 18);
  ctx.fill();
  const selected = selectedUnit(game);
  const reachable = getReachable(game, selected);
  const threatened = getThreatenedCells(game);
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const px = BOARD_X + x * TILE;
      const py = BOARD_Y + y * TILE;
      const tile = tileAt(x, y);
      ctx.fillStyle = tile === '#'
        ? '#020617'
        : tile === 'C'
          ? '#334155'
          : tile === 'H'
            ? '#164e63'
            : (x + y) % 2 === 0 ? '#1e293b' : '#223047';
      drawRoundedRect(ctx, px + 2, py + 2, TILE - 4, TILE - 4, 8);
      ctx.fill();
      if (reachable.has(gridKey(x, y))) {
        ctx.fillStyle = 'rgba(34,211,238,.22)';
        drawRoundedRect(ctx, px + 6, py + 6, TILE - 12, TILE - 12, 8);
        ctx.fill();
      }
      if (threatened.has(gridKey(x, y))) {
        ctx.fillStyle = 'rgba(239,68,68,.13)';
        drawRoundedRect(ctx, px + 9, py + 9, TILE - 18, TILE - 18, 8);
        ctx.fill();
      }
      if (tile === 'C') {
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(px + 16, py + 18, TILE - 32, 8);
        ctx.fillRect(px + 16, py + 32, TILE - 32, 8);
      }
      if (tile === 'H') {
        ctx.fillStyle = '#67e8f9';
        ctx.beginPath();
        ctx.moveTo(px + TILE / 2, py + 14);
        ctx.lineTo(px + TILE - 16, py + TILE - 14);
        ctx.lineTo(px + 16, py + TILE - 14);
        ctx.closePath();
        ctx.fill();
      }
      ctx.strokeStyle = 'rgba(148,163,184,.12)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 2, py + 2, TILE - 4, TILE - 4);
      if (game.hoverCell?.x === x && game.hoverCell?.y === y) {
        ctx.strokeStyle = 'rgba(250,204,21,.72)';
        ctx.lineWidth = 3;
        ctx.strokeRect(px + 7, py + 7, TILE - 14, TILE - 14);
      }
    }
  }
  ctx.restore();
}

function drawObjectives(ctx, game) {
  game.objectives.forEach((objective) => {
    const center = cellCenter(objective.x, objective.y);
    ctx.save();
    ctx.globalAlpha = objective.capturedBy ? 0.58 : 1;
    ctx.shadowColor = objective.capturedBy ? '#22c55e' : '#facc15';
    ctx.shadowBlur = objective.capturedBy ? 12 : 22;
    ctx.fillStyle = objective.capturedBy ? 'rgba(34,197,94,.82)' : 'rgba(250,204,21,.82)';
    ctx.beginPath();
    ctx.arc(center.x, center.y, 20 + Math.sin(game.elapsed * 4 + objective.pulse) * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#020617';
    ctx.font = '900 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(objective.capturedBy ? 'OK' : 'OBJ', center.x, center.y);
    ctx.restore();
  });

  game.traps.forEach((trap) => {
    if (!trap.active) return;
    const center = cellCenter(trap.x, trap.y);
    ctx.save();
    ctx.shadowColor = '#fb7185';
    ctx.shadowBlur = 18;
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y - 22);
    ctx.lineTo(center.x + 22, center.y + 20);
    ctx.lineTo(center.x - 22, center.y + 20);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'rgba(251,113,133,.24)';
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#fecaca';
    ctx.font = '900 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TRAP', center.x, center.y + 36);
    ctx.restore();
  });
}

function drawAnswerTiles(ctx, game) {
  if (game.mode !== 'learn') return;
  game.answerTiles.forEach((answer) => {
    if (!answer.active) return;
    const center = cellCenter(answer.x, answer.y);
    ctx.save();
    ctx.shadowColor = answer.correct ? '#5eead4' : '#818cf8';
    ctx.shadowBlur = 18;
    ctx.fillStyle = answer.correct ? 'rgba(20,184,166,.74)' : 'rgba(79,70,229,.72)';
    drawRoundedRect(ctx, center.x - 48, center.y - 24, 96, 48, 13);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(answer.label, center.x, center.y);
    ctx.restore();
  });
}

function drawUnits(ctx, game) {
  game.units.forEach((unit) => {
    if (unit.hp <= 0) return;
    const center = cellCenter(unit.x, unit.y);
    const selected = unit.id === game.selectedId;
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.shadowColor = unit.hitTimer > 0 ? '#fecaca' : unit.color;
    ctx.shadowBlur = selected ? 24 : unit.hitTimer > 0 ? 20 : 10;
    ctx.fillStyle = unit.hitTimer > 0 ? '#fecaca' : unit.color;
    if (unit.team === 'enemy') {
      if (unit.type === 'boss') {
        drawRoundedRect(ctx, -24, -27, 48, 54, 16);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -23);
        ctx.lineTo(24, 18);
        ctx.lineTo(-24, 18);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      drawRoundedRect(ctx, -22, -24, 44, 48, 14);
      ctx.fill();
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(0, -30, 14, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowColor = 'transparent';
    if (unit.guarding || unit.guardFlash > 0) {
      ctx.strokeStyle = '#a7f3d0';
      ctx.lineWidth = unit.guardFlash > 0 ? 6 : 4;
      ctx.beginPath();
      ctx.arc(0, 0, 36 + unit.guardFlash * 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(2,6,23,.82)';
      drawRoundedRect(ctx, -13, -15, 26, 20, 7);
      ctx.fill();
      ctx.fillStyle = '#a7f3d0';
      ctx.font = '900 12px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('G', 0, 0);
    }
    if (selected) {
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 31, 0, Math.PI * 2);
      ctx.stroke();
    }
    const badges = [
      unit.marked > 0 ? { label: 'M', color: '#38bdf8' } : null,
      unit.shielded > 0 ? { label: 'S', color: '#a7f3d0' } : null,
      unit.slowed > 0 ? { label: '!', color: '#fb7185' } : null,
      unit.enraged ? { label: 'R', color: '#f97316' } : null,
    ].filter(Boolean);
    badges.forEach((badge, index) => {
      ctx.fillStyle = badge.color;
      ctx.beginPath();
      ctx.arc(-26 + index * 17, -40, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#020617';
      ctx.font = '900 9px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(badge.label, -26 + index * 17, -37);
    });
    ctx.fillStyle = 'rgba(2,6,23,.86)';
    drawRoundedRect(ctx, -25, 28, 50, 7, 4);
    ctx.fill();
    ctx.fillStyle = unit.team === 'hero' ? '#22c55e' : '#ef4444';
    drawRoundedRect(ctx, -25, 28, 50 * clamp(unit.hp / unit.maxHp, 0, 1), 7, 4);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${unit.ap} AP`, 0, 46);
    ctx.restore();
  });
}

function drawTargetLines(ctx, game) {
  const unit = selectedUnit(game);
  if (!unit) return;
  const start = cellCenter(unit.x, unit.y);
  ctx.save();
  liveUnits(game, 'enemy').forEach((enemy) => {
    const dist = manhattan(unit, enemy);
    if (dist > unit.range + 2) return;
    const end = cellCenter(enemy.x, enemy.y);
    ctx.strokeStyle = dist <= unit.range ? 'rgba(250,204,21,.65)' : 'rgba(56,189,248,.34)';
    ctx.lineWidth = dist <= unit.range ? 3 : 2;
    ctx.setLineDash(dist <= unit.range ? [] : [8, 8]);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  });
  ctx.restore();
}

function drawParticles(ctx, game) {
  game.particles.forEach((particle) => {
    ctx.save();
    ctx.globalAlpha = clamp(particle.life / 0.58, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size + particle.life * 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawSidePanel(ctx, game) {
  const unit = selectedUnit(game);
  const unitState = unit?.guarding ? 'Guard' : unit?.acted ? 'Aktion verbraucht' : unit?.moved ? 'bewegt' : 'bereit';
  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,.9)';
  drawRoundedRect(ctx, 28, 22, 410, 138, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 25px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Learncade Tactics Pro' : 'Faska Tactics Pro', 52, 58);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.fillText(`Runde ${game.turn} · Fokus ${game.focus} · Score ${game.score}`, 52, 88);
  ctx.fillStyle = '#67e8f9';
  ctx.fillText(unit ? `${unit.name}: HP ${unit.hp}/${unit.maxHp} · AP ${unit.ap} · ${unitState}` : 'Keine Einheit', 52, 116);
  ctx.fillStyle = '#a7f3d0';
  ctx.font = '800 12px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Ziel: Antwortzonen sichern, dann Boss brechen' : 'Ziel: Deckung nutzen, Gegner ausduennen, Boss stellen', 52, 140);

  if (game.mode === 'learn') {
    const task = LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
    ctx.fillStyle = '#020617';
    drawRoundedRect(ctx, 468, 22, 430, 96, 18);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '900 18px Outfit, sans-serif';
    ctx.fillText(task.prompt, 683, 55);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 14px Outfit, sans-serif';
    ctx.fillText(`${task.subject} · Einheit auf die richtige Zone bewegen`, 683, 84);
  }

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(2,6,23,.9)';
  drawRoundedRect(ctx, WIDTH - 326, 22, 298, 226, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 23px Outfit, sans-serif';
  ctx.fillText(`${liveUnits(game, 'hero').length} vs ${liveUnits(game, 'enemy').length}`, WIDTH - 52, 58);
  ctx.fillStyle = '#a7f3d0';
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText(game.phase === 'player' ? 'Spielerzug' : game.phase === 'enemy' ? 'Gegnerzug' : 'Ende', WIDTH - 52, 88);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 12px Outfit, sans-serif';
  ctx.fillText(`${game.moveHistory.length} Undo · ${liveUnits(game, 'hero').filter((hero) => hero.guarding).length} Guard`, WIDTH - 52, 116);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#facc15';
  ctx.font = '900 13px Outfit, sans-serif';
  ctx.fillText('Missionen', WIDTH - 304, 146);
  ctx.font = '800 11px Outfit, sans-serif';
  game.goals.slice(0, 5).forEach((goal, index) => {
    const progress = Math.min(goal.target, game.stats[goal.stat] || 0);
    ctx.fillStyle = goal.completed ? '#86efac' : '#cbd5e1';
    ctx.fillText(`${goal.completed ? 'OK' : `${progress}/${goal.target}`} ${goal.label}`, WIDTH - 304, 169 + index * 15);
  });

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.78)';
    drawRoundedRect(ctx, CENTER_X - 270, HEIGHT - 78, 540, 48, 16);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 21px Outfit, sans-serif';
    ctx.fillText(game.message, CENTER_X, HEIGHT - 47);
  }

  if (game.missionNoticeTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(20,83,45,.86)';
    drawRoundedRect(ctx, CENTER_X - 210, 126, 420, 42, 14);
    ctx.fill();
    ctx.fillStyle = '#dcfce7';
    ctx.font = '900 17px Outfit, sans-serif';
    ctx.fillText(game.missionNotice, CENTER_X, 153);
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.76)';
  drawRoundedRect(ctx, 34, HEIGHT - 38, 1018, 28, 10);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 12px Outfit, sans-serif';
  ctx.fillText('Klick: Einheit waehlen, Feld bewegen, Gegner angreifen · 1/2/3 Helden · F Skill · G Guard · U Undo · E Zugende · M Modus · R Restart', 54, HEIGHT - 19);
  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bg.addColorStop(0, '#08111f');
  bg.addColorStop(0.6, '#11213a');
  bg.addColorStop(1, '#06111f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawGrid(ctx, game);
  drawObjectives(ctx, game);
  drawAnswerTiles(ctx, game);
  drawTargetLines(ctx, game);
  drawUnits(ctx, game);
  drawParticles(ctx, game);
  drawSidePanel(ctx, game);
}

export default function FaskaTacticsSwarm() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameRef = useRef(makeInitialGame('arcade'));
  const modeRef = useRef('arcade');
  const [mode, setMode] = useState('arcade');
  const [result, setResult] = useState(null);

  const restart = useCallback(() => {
    setResult(null);
    gameRef.current = makeInitialGame(modeRef.current);
    restartUnits(gameRef.current);
  }, []);

  const setGameMode = useCallback((nextMode) => {
    modeRef.current = nextMode;
    setMode(nextMode);
    setResult(null);
    gameRef.current = makeInitialGame(nextMode);
    restartUnits(gameRef.current);
  }, []);

  const endCurrentTurn = useCallback(() => {
    endTurn(gameRef.current);
  }, []);

  const triggerSkill = useCallback(() => {
    triggerFocusSkill(gameRef.current);
  }, []);

  const guardCurrentUnit = useCallback(() => {
    setGuard(gameRef.current);
  }, []);

  const undoCurrentMove = useCallback(() => {
    undoLastMove(gameRef.current);
  }, []);

  const selectHeroByIndex = useCallback((index) => {
    const hero = liveUnits(gameRef.current, 'hero')[index];
    if (hero) gameRef.current.selectedId = hero.id;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;
    let raf = 0;
    let last = performance.now();

    const pointerDown = (event) => {
      const cell = cellFromPoint(event.clientX, event.clientY, canvas);
      handleCell(gameRef.current, cell);
    };
    const pointerMove = (event) => {
      gameRef.current.hoverCell = cellFromPoint(event.clientX, event.clientY, canvas);
    };
    const keyDown = (event) => {
      if (event.key === '1') selectHeroByIndex(0);
      if (event.key === '2') selectHeroByIndex(1);
      if (event.key === '3') selectHeroByIndex(2);
      if (event.key === 'f' || event.key === 'F') triggerSkill();
      if (event.key === 'g' || event.key === 'G') guardCurrentUnit();
      if (event.key === 'u' || event.key === 'U') undoCurrentMove();
      if (event.key === 'e' || event.key === 'E') endCurrentTurn();
      if (event.key === 'm' || event.key === 'M') setGameMode(modeRef.current === 'learn' ? 'arcade' : 'learn');
      if (event.key === 'r' || event.key === 'R') restart();
    };
    const loop = (now) => {
      const dt = Math.min(0.033, (now - last) / 1000 || 0);
      last = now;
      try {
        updateGame(gameRef.current, dt, setResult);
        renderGame(ctx, gameRef.current);
      } catch (err) {
        console.error("Game loop error:", err);
      }
      raf = requestAnimationFrame(loop);
    };

    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('pointermove', pointerMove);
    window.addEventListener('keydown', keyDown);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointermove', pointerMove);
      window.removeEventListener('keydown', keyDown);
    };
  }, [endCurrentTurn, guardCurrentUnit, restart, selectHeroByIndex, setGameMode, triggerSkill, undoCurrentMove]);

  const canvasTopChrome = 'max(12px, calc((100vh - min(100vh, calc(100vw * 9 / 16))) / 2 - 62px))';

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

      <div style={{
        position: 'fixed',
        top: canvasTopChrome,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        width: 'min(96vw, 1040px)',
        zIndex: 10,
      }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.55 }}>
          Normal
        </button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.55 }}>
          Learncade
        </button>
        <button className="btn-primary" onClick={triggerSkill}>Skill</button>
        <button className="btn-primary" onClick={guardCurrentUnit}>Guard</button>
        <button className="btn-primary" onClick={undoCurrentMove}>Undo</button>
        <button className="btn-primary" onClick={endCurrentTurn}>End Turn</button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      {result && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2,6,23,.78)', zIndex: 20, flexDirection: 'column', gap: 16,
        }}>
          <div style={{ fontSize: 54, fontWeight: 900, color: '#f8fafc' }}>{result.title}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#facc15' }}>Score {result.score}</div>
          <div style={{ fontSize: 15, color: '#cbd5e1' }}>Runde {result.turn}</div>
          <button className="btn-primary" onClick={restart}>Neue Mission</button>
        </div>
      )}
    </div>
  );
}
