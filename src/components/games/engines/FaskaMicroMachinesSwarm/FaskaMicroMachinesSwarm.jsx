import { useCallback, useEffect, useRef, useState } from 'react';

const WIDTH = 1280;
const HEIGHT = 720;
const ROAD_WIDTH = 116;
const CAR_RADIUS = 18;
const STORAGE_KEY = 'faska-micro-rally-highscore';

const BASE_TRACK = [
  { x: 235, y: 530 },
  { x: 225, y: 326 },
  { x: 360, y: 176 },
  { x: 560, y: 138 },
  { x: 735, y: 226 },
  { x: 928, y: 148 },
  { x: 1085, y: 278 },
  { x: 1040, y: 482 },
  { x: 835, y: 580 },
  { x: 613, y: 534 },
  { x: 428, y: 594 },
];

const TRACK = BASE_TRACK.map((point) => ({
  x: Math.round(640 + (point.x - 640) * 0.78),
  y: point.y,
}));

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    prompt: 'Welche Wortart ist "rennt"?',
    choices: ['Nomen', 'Verb', 'Adjektiv'],
    correct: 'Verb',
  },
  {
    subject: 'Mathe',
    kind: 'Kopfrechnen',
    prompt: '8 + 7 = ?',
    choices: ['14', '15', '16'],
    correct: '15',
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    prompt: 'Was heisst "blau"?',
    choices: ['red', 'blue', 'green'],
    correct: 'blue',
  },
  {
    subject: 'Lesen',
    kind: 'Silben',
    prompt: 'Welche Trennung passt zu "Garten"?',
    choices: ['Ga-rten', 'Gar-ten', 'G-art-en'],
    correct: 'Gar-ten',
  },
  {
    subject: 'Sachkunde',
    kind: 'Richtung',
    prompt: 'Wo geht die Sonne auf?',
    choices: ['Westen', 'Osten', 'Norden'],
    correct: 'Osten',
  },
  {
    subject: 'Deutsch',
    kind: 'Satzglied',
    prompt: 'Wer oder was? fragt nach dem...',
    choices: ['Subjekt', 'Praedikat', 'Objekt'],
    correct: 'Subjekt',
  },
  {
    subject: 'Mathe',
    kind: 'Verdoppeln',
    prompt: 'Doppelt so viel wie 18 ist...',
    choices: ['26', '36', '38'],
    correct: '36',
  },
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    prompt: 'Welche Wortart ist "schnell"?',
    choices: ['Adjektiv', 'Verb', 'Nomen'],
    correct: 'Adjektiv',
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    prompt: 'Was heisst "rechts"?',
    choices: ['left', 'right', 'round'],
    correct: 'right',
  },
  {
    subject: 'Sachkunde',
    kind: 'Verkehr',
    prompt: 'Bei Rot an der Ampel...',
    choices: ['fahren', 'halten', 'hupen'],
    correct: 'halten',
  },
  {
    subject: 'Deutsch',
    kind: 'Lesen',
    prompt: 'Welches Wort passt zu "Auto"?',
    choices: ['fahren', 'schwimmen', 'backen'],
    correct: 'fahren',
  },
  {
    subject: 'Mathe',
    kind: 'Minus',
    prompt: '50 - 17 = ?',
    choices: ['33', '37', '43'],
    correct: '33',
  },
];

const DESK_OBSTACLES = [
  { kind: 'pencil', x: 510, y: 300, r: 22, angle: -0.45, color: '#f97316' },
  { kind: 'eraser', x: 825, y: 354, r: 30, angle: 0.18, color: '#f472b6' },
  { kind: 'cap', x: 999, y: 392, r: 27, angle: 0, color: '#38bdf8' },
  { kind: 'ruler', x: 486, y: 470, r: 26, angle: 0.58, color: '#facc15' },
  { kind: 'clip', x: 690, y: 474, r: 22, angle: -0.18, color: '#cbd5e1' },
];

const TRACK_PICKUP_PROGRESS = [
  { progress: 205, offset: -26, kind: 'coin' },
  { progress: 385, offset: 34, kind: 'boost' },
  { progress: 610, offset: -18, kind: 'coin' },
  { progress: 705, offset: 38, kind: 'item' },
  { progress: 795, offset: 32, kind: 'coin' },
  { progress: 1040, offset: -34, kind: 'boost' },
  { progress: 1265, offset: 22, kind: 'coin' },
  { progress: 1500, offset: -38, kind: 'wrench' },
  { progress: 1608, offset: 36, kind: 'item' },
  { progress: 1715, offset: 28, kind: 'coin' },
  { progress: 1940, offset: -24, kind: 'boost' },
  { progress: 2140, offset: 36, kind: 'coin' },
];

const HAZARDS = [
  { progress: 555, offset: 0, radius: 26 },
  { progress: 1320, offset: -26, radius: 24 },
  { progress: 1835, offset: 30, radius: 25 },
];

const TURBO_PAD_PROGRESS = [
  { progress: 318, offset: -32 },
  { progress: 910, offset: 28 },
  { progress: 1598, offset: -28 },
  { progress: 2068, offset: 24 },
];

const PIT_STOP_PROGRESS = [
  { progress: 1168, offset: -54 },
  { progress: 2260, offset: 54 },
];

const RALLY_GOALS = [
  { id: 'gates_8', label: '8 Gates sauber', stat: 'gates', target: 8, mode: 'both', reward: 760 },
  { id: 'pickups_8', label: '8 Pickups sammeln', stat: 'pickups', target: 8, mode: 'both', reward: 700 },
  { id: 'drift_6', label: '6 Drift-Boni', stat: 'driftBonuses', target: 6, mode: 'arcade', reward: 850 },
  { id: 'draft_4', label: '4 Windschatten-Boni', stat: 'draftBonuses', target: 4, mode: 'arcade', reward: 820 },
  { id: 'turbo_4', label: '4 Turbo-Pads', stat: 'turboPads', target: 4, mode: 'both', reward: 720 },
  { id: 'pit_2', label: '2 Boxenstopps', stat: 'pitStops', target: 2, mode: 'both', reward: 680 },
  { id: 'learn_4', label: '4 Learn-Gates', stat: 'learnCorrect', target: 4, mode: 'learn', reward: 1100 },
  { id: 'item_3', label: '3 Items nutzen', stat: 'itemsUsed', target: 3, mode: 'both', reward: 780 },
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
  width: 62,
  height: 54,
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,.2)',
  background: 'rgba(15,23,42,.78)',
  color: '#f8fafc',
  fontSize: 14,
  fontWeight: 900,
  touchAction: 'none',
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function readHighScore() {
  const value = Number(localStorage.getItem(STORAGE_KEY) || 0);
  return Number.isFinite(value) ? value : 0;
}

function buildSegments(points) {
  const segments = [];
  let total = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    segments.push({ a, b, length, start: total, index: i });
    total += length;
  }
  return { segments, total };
}

const TRACK_DATA = buildSegments(TRACK);

function seededUnit(index, salt) {
  const value = Math.sin(index * 14.381 + salt * 91.17) * 9175.234;
  return value - Math.floor(value);
}

function progressPoint(progress, lateral = 0) {
  const wrapped = ((progress % TRACK_DATA.total) + TRACK_DATA.total) % TRACK_DATA.total;
  const segment = TRACK_DATA.segments.find((candidate) => wrapped <= candidate.start + candidate.length) || TRACK_DATA.segments[0];
  const t = clamp((wrapped - segment.start) / segment.length, 0, 1);
  const x = lerp(segment.a.x, segment.b.x, t);
  const y = lerp(segment.a.y, segment.b.y, t);
  const angle = Math.atan2(segment.b.y - segment.a.y, segment.b.x - segment.a.x);
  return {
    x: x + Math.cos(angle + Math.PI / 2) * lateral,
    y: y + Math.sin(angle + Math.PI / 2) * lateral,
    angle,
    progress: wrapped,
  };
}

function nearestTrackPoint(x, y) {
  let best = { distance: Infinity, progress: 0, x: TRACK[0].x, y: TRACK[0].y, segmentIndex: 0 };
  for (const segment of TRACK_DATA.segments) {
    const vx = segment.b.x - segment.a.x;
    const vy = segment.b.y - segment.a.y;
    const wx = x - segment.a.x;
    const wy = y - segment.a.y;
    const c1 = vx * wx + vy * wy;
    const c2 = vx * vx + vy * vy;
    const t = clamp(c1 / c2, 0, 1);
    const px = segment.a.x + vx * t;
    const py = segment.a.y + vy * t;
    const distance = Math.hypot(x - px, y - py);
    if (distance < best.distance) {
      best = {
        distance,
        progress: segment.start + segment.length * t,
        x: px,
        y: py,
        segmentIndex: segment.index,
      };
    }
  }
  return best;
}

function currentTask(game) {
  return LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
}

function makePickups() {
  return TRACK_PICKUP_PROGRESS.map((pickup, index) => {
    const point = progressPoint(pickup.progress, pickup.offset);
    return {
      id: `pickup-${index}`,
      x: point.x,
      y: point.y,
      kind: pickup.kind,
      taken: false,
      pulse: seededUnit(index, 4) * Math.PI * 2,
    };
  });
}

function makeHazards() {
  return HAZARDS.map((hazard, index) => {
    const point = progressPoint(hazard.progress, hazard.offset);
    return {
      id: `hazard-${index}`,
      x: point.x,
      y: point.y,
      radius: hazard.radius,
      spin: seededUnit(index, 7) * Math.PI * 2,
    };
  });
}

function makeTurboPads() {
  return TURBO_PAD_PROGRESS.map((pad, index) => ({
    id: `turbo-${index}`,
    ...progressPoint(pad.progress, pad.offset),
    pulse: seededUnit(index, 11) * Math.PI * 2,
    cooldown: 0,
  }));
}

function makePitStops() {
  return PIT_STOP_PROGRESS.map((pit, index) => ({
    id: `pit-${index}`,
    ...progressPoint(pit.progress, pit.offset),
    pulse: seededUnit(index, 13) * Math.PI * 2,
    cooldown: 0,
  }));
}

function makeOpponents() {
  return [
    { id: 'r1', progress: 120, speed: 146, color: '#ef4444', name: 'R1' },
    { id: 'r2', progress: 430, speed: 138, color: '#38bdf8', name: 'R2' },
    { id: 'r3', progress: 870, speed: 132, color: '#facc15', name: 'R3' },
  ];
}

function createStats() {
  return {
    gates: 0,
    pickups: 0,
    driftBonuses: 0,
    draftBonuses: 0,
    turboPads: 0,
    pitStops: 0,
    learnCorrect: 0,
    itemsUsed: 0,
  };
}

function createGoals(mode) {
  const weight = goal => (goal.mode === mode ? 0 : goal.mode === 'both' ? 1 : 2);
  return RALLY_GOALS
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
  game.message = `Mission: ${completed.label} +${completed.reward}`;
  game.messageTimer = 1.25;
}

function makeInitialGame(mode = 'arcade') {
  return {
    mode,
    started: false,
    finished: false,
    elapsed: 0,
    raceTime: 0,
    message: mode === 'learn' ? 'Fahre durch die richtige Antwort.' : 'Mini-Rennen auf dem Schreibtisch.',
    messageTimer: 1.8,
    shake: 0,
    score: 0,
    highScore: readHighScore(),
    lap: 0,
    totalLaps: mode === 'learn' ? 2 : 3,
    nextGate: 1,
    gateCombo: 0,
    car: {
      x: TRACK[0].x,
      y: TRACK[0].y,
      angle: -Math.PI / 2,
      speed: 0,
      boost: 72,
      damage: 0,
      drift: 0,
      driftCharge: 0,
      draft: 0,
      grip: 1,
      shield: 0,
      item: null,
      itemCooldown: 0,
    },
    opponents: makeOpponents(),
    pickups: makePickups(),
    hazards: makeHazards(),
    turboPads: makeTurboPads(),
    pitStops: makePitStops(),
    learnTokens: [],
    taskIndex: 0,
    correct: 0,
    wrong: 0,
    itemHeld: false,
    stats: createStats(),
    goals: createGoals(mode),
    particles: [],
    skidMarks: [],
  };
}

function spawnLearnTokens(game) {
  const task = currentTask(game);
  const gate = TRACK[game.nextGate];
  const before = TRACK[(game.nextGate + TRACK.length - 1) % TRACK.length];
  const after = TRACK[(game.nextGate + 1) % TRACK.length];
  const angle = Math.atan2(after.y - before.y, after.x - before.x);
  const normal = { x: Math.cos(angle + Math.PI / 2), y: Math.sin(angle + Math.PI / 2) };
  const offsets = [-42, 0, 42];
  game.learnTokens = task.choices.map((choice, index) => ({
    id: `${game.nextGate}-${game.taskIndex}-${choice}`,
    ...placeLearnToken(gate, normal, offsets[index], index),
    label: choice,
    correct: choice === task.correct,
    taken: false,
    gate: game.nextGate,
  }));
}

function placeLearnToken(gate, normal, offset, index) {
  if (gate.x < 320 && gate.y < 410) {
    return { x: 326 + index * 72, y: gate.y + (index - 1) * 22 };
  }
  if (gate.x > 980 && gate.y < 330) {
    return { x: 954 - index * 72, y: gate.y + (index - 1) * 22 };
  }
  if (gate.y > 620 && gate.x < 650) {
    return { x: gate.x + (index - 1) * 74, y: 624 };
  }
  return {
    x: gate.x + normal.x * offset,
    y: gate.y + normal.y * offset,
  };
}

function addFloating(game, text, x, y, color = '#f8fafc') {
  game.particles.push({
    kind: 'text',
    text,
    x,
    y,
    vx: 0,
    vy: -34,
    life: 1.05,
    maxLife: 1.05,
    color,
  });
}

function addBurst(game, x, y, color, amount = 14) {
  for (let i = 0; i < amount; i += 1) {
    const angle = seededUnit(game.elapsed * 100 + i, 3) * Math.PI * 2;
    const speed = 70 + seededUnit(game.elapsed * 100 + i, 9) * 120;
    game.particles.push({
      kind: 'spark',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.55,
      maxLife: 0.55,
      color,
      size: 3 + seededUnit(i, 10) * 4,
    });
  }
}

function passGate(game, learned = false) {
  if (game.finished) return;
  const gate = game.nextGate;
  game.gateCombo += 1;
  recordStat(game, 'gates');
  if (learned) recordStat(game, 'learnCorrect');
  game.score += learned ? 230 + game.gateCombo * 35 : 120 + game.gateCombo * 18;
  game.car.boost = clamp(game.car.boost + (learned ? 20 : 10), 0, 100);

  if (gate === 0) {
    game.lap += 1;
    addFloating(game, `RUNDE ${game.lap}/${game.totalLaps}`, TRACK[0].x, TRACK[0].y - 38, '#facc15');
    if (game.lap >= game.totalLaps) {
      game.finished = true;
      game.car.speed *= 0.35;
      game.message = game.mode === 'learn' ? 'Learn-Rennen geschafft.' : 'Rennen geschafft.';
      game.messageTimer = 4;
      game.score += Math.max(0, Math.round(3600 - game.raceTime * 18));
      const nextHigh = Math.max(game.highScore, game.score);
      game.highScore = nextHigh;
      localStorage.setItem(STORAGE_KEY, String(nextHigh));
      return;
    }
    game.nextGate = 1;
  } else {
    game.nextGate = (gate + 1) % TRACK.length;
  }

  game.message = game.mode === 'learn'
    ? `${currentTask(game).subject}: richtig. Naechstes Gate!`
    : `Gate ${gate} sauber. Combo x${game.gateCombo}`;
  game.messageTimer = 1.2;
  if (game.mode === 'learn') spawnLearnTokens(game);
}

function hitPenalty(game, text = 'Kollision') {
  if (game.car.shield > 0) {
    game.car.shield = Math.max(0, game.car.shield - 34);
    game.car.speed *= 0.72;
    game.shake = Math.max(game.shake, 0.14);
    game.message = 'Schild absorbiert Treffer';
    game.messageTimer = 0.8;
    addBurst(game, game.car.x, game.car.y, '#a78bfa', 12);
    return;
  }
  game.car.speed *= -0.18;
  game.car.damage = clamp(game.car.damage + 13, 0, 100);
  game.gateCombo = 0;
  game.shake = Math.max(game.shake, 0.35);
  game.message = text;
  game.messageTimer = 1.0;
  addBurst(game, game.car.x, game.car.y, '#fb7185', 10);
  if (game.car.damage >= 100) {
    game.finished = true;
    game.message = 'Auto kaputt. Restart druecken.';
    game.messageTimer = 4;
  }
}

function collectPickups(game) {
  for (const pickup of game.pickups) {
    if (pickup.taken || dist(pickup, game.car) > 30) continue;
    pickup.taken = true;
    recordStat(game, 'pickups');
    if (pickup.kind === 'coin') {
      game.score += 70 + game.gateCombo * 8;
      addFloating(game, '+70', pickup.x, pickup.y, '#facc15');
      addBurst(game, pickup.x, pickup.y, '#facc15', 8);
    } else if (pickup.kind === 'boost') {
      game.car.boost = clamp(game.car.boost + 34, 0, 100);
      addFloating(game, 'BOOST', pickup.x, pickup.y, '#38bdf8');
      addBurst(game, pickup.x, pickup.y, '#38bdf8', 10);
    } else if (pickup.kind === 'wrench') {
      game.car.damage = Math.max(0, game.car.damage - 24);
      addFloating(game, 'REPAIR', pickup.x, pickup.y, '#22c55e');
      addBurst(game, pickup.x, pickup.y, '#22c55e', 10);
    } else {
      game.car.item = game.car.item || (seededUnit(game.score + game.taskIndex, 17) > 0.5 ? 'shield' : 'pulse');
      addFloating(game, game.car.item === 'shield' ? 'SHIELD' : 'PULSE', pickup.x, pickup.y, '#a78bfa');
      addBurst(game, pickup.x, pickup.y, '#a78bfa', 12);
    }
  }
}

function collectLearnTokens(game) {
  if (game.mode !== 'learn' || game.finished) return;
  if (game.learnTokens.length === 0) spawnLearnTokens(game);
  for (const token of game.learnTokens) {
    if (token.taken || token.gate !== game.nextGate || dist(token, game.car) > 36) continue;
    token.taken = true;
    const task = currentTask(game);
    if (token.correct) {
      game.correct += 1;
      game.taskIndex += 1;
      addFloating(game, 'RICHTIG', token.x, token.y, '#22c55e');
      addBurst(game, token.x, token.y, '#22c55e', 16);
      passGate(game, true);
    } else {
      game.wrong += 1;
      game.car.speed *= 0.42;
      game.car.damage = clamp(game.car.damage + 10, 0, 100);
      game.gateCombo = 0;
      game.shake = Math.max(game.shake, 0.25);
      game.message = `${token.label} passt nicht. Gesucht: ${task.correct}`;
      game.messageTimer = 1.5;
      addFloating(game, 'FALSCH', token.x, token.y, '#fb7185');
      addBurst(game, token.x, token.y, '#fb7185', 10);
    }
    return;
  }
}

function activateItem(game) {
  const car = game.car;
  if (!car.item || car.itemCooldown > 0) {
    if (!car.item && game.messageTimer <= 0.05) {
      game.message = 'Kein Item geladen';
      game.messageTimer = 0.55;
    }
    return;
  }
  recordStat(game, 'itemsUsed');
  if (car.item === 'shield') {
    car.shield = 100;
    addFloating(game, 'SCHILD', car.x, car.y - 32, '#a78bfa');
    addBurst(game, car.x, car.y, '#a78bfa', 18);
  } else {
    addFloating(game, 'PULSE', car.x, car.y - 32, '#facc15');
    addBurst(game, car.x, car.y, '#facc15', 22);
    for (const opponent of game.opponents) {
      if (dist(opponent, car) < 132) {
        opponent.speed *= 0.72;
        game.score += 90;
      }
    }
    for (const hazard of game.hazards) {
      if (dist(hazard, car) < 118) hazard.disabled = true;
    }
  }
  car.item = null;
  car.itemCooldown = 1.4;
}

function updateTrackSystems(game, dt, nearest) {
  const car = game.car;
  car.itemCooldown = Math.max(0, car.itemCooldown - dt);
  car.shield = Math.max(0, car.shield - dt * 8);

  for (const pad of game.turboPads) {
    pad.cooldown = Math.max(0, pad.cooldown - dt);
    if (pad.cooldown <= 0 && dist(pad, car) < 35) {
      pad.cooldown = 1.6;
      car.speed = Math.max(car.speed, 260);
      car.speed += 150;
      car.boost = clamp(car.boost + 18, 0, 100);
      game.score += 110 + game.gateCombo * 12;
      recordStat(game, 'turboPads');
      addFloating(game, 'TURBO', pad.x, pad.y, '#38bdf8');
      addBurst(game, pad.x, pad.y, '#38bdf8', 14);
    }
  }

  for (const pit of game.pitStops) {
    pit.cooldown = Math.max(0, pit.cooldown - dt);
    if (pit.cooldown <= 0 && dist(pit, car) < 38 && Math.abs(car.speed) < 115) {
      pit.cooldown = 4.2;
      car.damage = Math.max(0, car.damage - 38);
      car.boost = clamp(car.boost + 26, 0, 100);
      game.score += 120;
      recordStat(game, 'pitStops');
      addFloating(game, 'BOXENSTOPP', pit.x, pit.y, '#22c55e');
      addBurst(game, pit.x, pit.y, '#22c55e', 16);
    }
  }

  const drafting = game.opponents.some((opponent) => {
    const delta = ((opponent.progress - nearest.progress + TRACK_DATA.total) % TRACK_DATA.total);
    return delta > 18 && delta < 142 && dist(opponent, car) < 92 && car.speed > 120;
  });
  if (drafting) {
    car.draft = clamp(car.draft + dt * 42, 0, 100);
    car.boost = clamp(car.boost + dt * 7, 0, 100);
    if (car.draft >= 100) {
      car.draft = 0;
      car.speed += 95;
      game.score += 240;
      recordStat(game, 'draftBonuses');
      addFloating(game, 'WINDSCHATTEN', car.x, car.y - 34, '#67e8f9');
      addBurst(game, car.x, car.y, '#67e8f9', 14);
    }
  } else {
    car.draft = Math.max(0, car.draft - dt * 24);
  }
}

function updateOpponents(game, dt) {
  for (const opponent of game.opponents) {
    opponent.progress = (opponent.progress + opponent.speed * dt) % TRACK_DATA.total;
    const position = progressPoint(opponent.progress, opponent.id === 'r2' ? -25 : 25);
    opponent.x = position.x;
    opponent.y = position.y;
    opponent.angle = position.angle;
    if (dist(opponent, game.car) < 34) {
      game.car.speed *= 0.82;
      opponent.speed *= 0.985;
      game.shake = Math.max(game.shake, 0.2);
    }
  }
}

function updateParticles(game, dt) {
  for (const particle of game.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
  }
  game.particles = game.particles.filter((particle) => particle.life > 0);
  game.skidMarks = game.skidMarks
    .map((mark) => ({ ...mark, life: mark.life - dt * 0.35 }))
    .filter((mark) => mark.life > 0);
}

function updateGame(game, controls, dt) {
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.shake = Math.max(0, game.shake - dt * 2.3);
  updateParticles(game, dt);
  updateOpponents(game, dt);
  if (!game.started || game.finished) {
    game.car.speed *= Math.pow(0.04, dt);
    return;
  }

  game.raceTime += dt;
  const car = game.car;
  const nearest = nearestTrackPoint(car.x, car.y);
  const offroad = nearest.distance > ROAD_WIDTH * 0.5;
  car.grip = offroad ? 0.46 : 1;
  updateTrackSystems(game, dt, nearest);

  const steering = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
  const throttle = controls.up || controls.accel;
  const brake = controls.down || controls.brake;
  const boosting = controls.boost && car.boost > 0 && car.speed > 60;
  const maxSpeed = boosting ? 430 : 330;

  if (throttle) car.speed += 260 * car.grip * dt;
  if (brake) car.speed -= car.speed > 30 ? 390 * dt : 190 * dt;
  if (!throttle && !brake) car.speed *= Math.pow(0.18, dt);
  if (offroad) car.speed *= Math.pow(0.34, dt);
  if (boosting) {
    car.speed += 250 * dt;
    car.boost = Math.max(0, car.boost - 38 * dt);
    if (game.particles.length < 80) addBurst(game, car.x - Math.cos(car.angle) * 18, car.y - Math.sin(car.angle) * 18, '#38bdf8', 2);
  } else {
    car.boost = clamp(car.boost + 4 * dt, 0, 100);
  }
  car.speed = clamp(car.speed, -115, maxSpeed);

  const speedTurn = clamp(Math.abs(car.speed) / 170, 0.15, 1.25);
  car.angle += steering * (2.7 + speedTurn * 1.25) * speedTurn * car.grip * dt * (car.speed >= 0 ? 1 : -0.55);
  car.drift = steering !== 0 && Math.abs(car.speed) > 155
    ? clamp(car.drift + dt * 2.8, 0, 1)
    : Math.max(0, car.drift - dt * 3.8);
  if (car.drift > 0.62 && !offroad) {
    car.driftCharge += dt * Math.abs(car.speed) * 0.22;
    if (car.driftCharge >= 100) {
      car.driftCharge = 0;
      car.boost = clamp(car.boost + 18, 0, 100);
      game.score += 180 + game.gateCombo * 10;
      recordStat(game, 'driftBonuses');
      addFloating(game, 'DRIFT', car.x, car.y - 34, '#f59e0b');
      addBurst(game, car.x, car.y, '#f59e0b', 10);
    }
  } else {
    car.driftCharge = Math.max(0, car.driftCharge - dt * 35);
  }

  const slip = car.drift * steering * 0.45;
  car.x += Math.cos(car.angle + slip) * car.speed * dt;
  car.y += Math.sin(car.angle + slip) * car.speed * dt;

  if (car.drift > 0.45 && game.skidMarks.length < 90) {
    game.skidMarks.push({
      x: car.x - Math.cos(car.angle) * 18,
      y: car.y - Math.sin(car.angle) * 18,
      angle: car.angle,
      life: 1,
    });
  }

  if (car.x < 54 || car.x > WIDTH - 54 || car.y < 54 || car.y > HEIGHT - 54) {
    car.x = clamp(car.x, 54, WIDTH - 54);
    car.y = clamp(car.y, 54, HEIGHT - 54);
    hitPenalty(game, 'Tischkante!');
  }

  for (const obstacle of DESK_OBSTACLES) {
    if (dist(obstacle, car) < obstacle.r + CAR_RADIUS && Math.abs(car.speed) > 45) {
      hitPenalty(game, 'Schreibtisch-Hindernis!');
      const pushAngle = Math.atan2(car.y - obstacle.y, car.x - obstacle.x);
      car.x += Math.cos(pushAngle) * 18;
      car.y += Math.sin(pushAngle) * 18;
      break;
    }
  }

  for (const hazard of game.hazards) {
    if (hazard.disabled) continue;
    if (dist(hazard, car) < hazard.radius + CAR_RADIUS) {
      car.speed *= 0.965;
      car.angle += Math.sin(game.elapsed * 18) * 0.018;
      if (game.messageTimer <= 0.05) {
        game.message = 'Oelfleck: weniger Grip';
        game.messageTimer = 0.6;
      }
    }
  }

  collectPickups(game);
  collectLearnTokens(game);

  if (controls.item && !game.itemHeld) {
    activateItem(game);
    game.itemHeld = true;
  } else if (!controls.item) {
    game.itemHeld = false;
  }

  if (game.mode === 'arcade') {
    const gate = TRACK[game.nextGate];
    if (dist(gate, car) < 54) passGate(game, false);
  }
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

function drawBackground(ctx, game) {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, '#1f2937');
  gradient.addColorStop(0.55, '#5b3a22');
  gradient.addColorStop(1, '#7c4a23');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.globalAlpha = 0.18;
  for (let y = -20; y < HEIGHT; y += 54) {
    ctx.strokeStyle = y % 108 === 0 ? '#f8fafc' : '#facc15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(game.elapsed + y) * 4);
    ctx.bezierCurveTo(360, y + 20, 760, y - 18, WIDTH, y + 8);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.fillStyle = 'rgba(15,23,42,.18)';
  drawRoundedRect(ctx, 28, 30, WIDTH - 56, HEIGHT - 60, 28);
  ctx.fill();
  ctx.restore();
}

function drawTrackPath(ctx, width, color, dash = []) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(TRACK[0].x, TRACK[0].y);
  for (let i = 1; i < TRACK.length; i += 1) ctx.lineTo(TRACK[i].x, TRACK[i].y);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawTrack(ctx, game) {
  drawTrackPath(ctx, ROAD_WIDTH + 30, 'rgba(15,23,42,.74)');
  drawTrackPath(ctx, ROAD_WIDTH + 16, '#a16207');
  drawTrackPath(ctx, ROAD_WIDTH, '#273449');
  drawTrackPath(ctx, 6, 'rgba(248,250,252,.38)', [24, 28]);

  ctx.save();
  ctx.font = '900 13px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < TRACK.length; i += 1) {
    const point = TRACK[i];
    const isNext = i === game.nextGate;
    ctx.fillStyle = isNext ? 'rgba(34,211,238,.24)' : 'rgba(148,163,184,.12)';
    ctx.strokeStyle = isNext ? '#67e8f9' : 'rgba(226,232,240,.35)';
    ctx.lineWidth = isNext ? 3 : 1;
    drawRoundedRect(ctx, point.x - 43, point.y - 22, 86, 44, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = isNext ? '#e0f2fe' : '#94a3b8';
    ctx.fillText(i === 0 ? 'START' : `G${i}`, point.x, point.y);
  }
  ctx.restore();

  ctx.save();
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(TRACK[0].x - 44, TRACK[0].y - 7, 88, 14);
  ctx.fillStyle = '#0f172a';
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 2; j += 1) {
      if ((i + j) % 2 === 0) ctx.fillRect(TRACK[0].x - 44 + i * 11, TRACK[0].y - 7 + j * 7, 11, 7);
    }
  }
  ctx.restore();
}

function drawDeskObjects(ctx) {
  for (const obstacle of DESK_OBSTACLES) {
    ctx.save();
    ctx.translate(obstacle.x, obstacle.y);
    ctx.rotate(obstacle.angle);
    if (obstacle.kind === 'pencil') {
      ctx.fillStyle = obstacle.color;
      drawRoundedRect(ctx, -58, -8, 116, 16, 8);
      ctx.fill();
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.moveTo(58, -8);
      ctx.lineTo(80, 0);
      ctx.lineTo(58, 8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.moveTo(80, 0);
      ctx.lineTo(69, -4);
      ctx.lineTo(69, 4);
      ctx.closePath();
      ctx.fill();
    } else if (obstacle.kind === 'ruler') {
      ctx.fillStyle = obstacle.color;
      drawRoundedRect(ctx, -68, -12, 136, 24, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(15,23,42,.42)';
      for (let x = -58; x < 64; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, -12);
        ctx.lineTo(x, x % 24 === 0 ? 9 : 2);
        ctx.stroke();
      }
    } else if (obstacle.kind === 'clip') {
      ctx.strokeStyle = obstacle.color;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.ellipse(0, 0, 36, 16, 0, 0, Math.PI * 1.65);
      ctx.stroke();
    } else {
      ctx.fillStyle = obstacle.color;
      drawRoundedRect(ctx, -34, -24, 68, 48, obstacle.kind === 'cap' ? 24 : 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.35)';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawPickups(ctx, game) {
  for (const hazard of game.hazards) {
    if (hazard.disabled) continue;
    ctx.save();
    ctx.translate(hazard.x, hazard.y);
    ctx.rotate(game.elapsed * 0.8 + hazard.spin);
    ctx.fillStyle = 'rgba(15,23,42,.52)';
    ctx.beginPath();
    ctx.ellipse(0, 0, hazard.radius, hazard.radius * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
  }

  for (const pad of game.turboPads) {
    const pulse = Math.sin(game.elapsed * 7 + pad.pulse) * 0.08 + 1;
    ctx.save();
    ctx.translate(pad.x, pad.y);
    ctx.rotate(pad.angle);
    ctx.globalAlpha = pad.cooldown > 0 ? 0.42 : 0.9;
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#38bdf8';
    ctx.fillStyle = '#0ea5e9';
    drawRoundedRect(ctx, -32 * pulse, -16 * pulse, 64 * pulse, 32 * pulse, 10);
    ctx.fill();
    ctx.fillStyle = '#e0f2fe';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TURBO', 0, 1);
    ctx.restore();
  }

  for (const pit of game.pitStops) {
    ctx.save();
    ctx.translate(pit.x, pit.y);
    ctx.rotate(pit.angle);
    ctx.globalAlpha = pit.cooldown > 0 ? 0.5 : 0.92;
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#22c55e';
    ctx.fillStyle = 'rgba(34,197,94,.78)';
    drawRoundedRect(ctx, -38, -17, 76, 34, 10);
    ctx.fill();
    ctx.fillStyle = '#052e16';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PIT', 0, 1);
    ctx.restore();
  }

  for (const pickup of game.pickups) {
    if (pickup.taken) continue;
    const pulse = Math.sin(game.elapsed * 5 + pickup.pulse) * 3;
    ctx.save();
    ctx.translate(pickup.x, pickup.y);
    ctx.shadowBlur = 18;
    const color = pickup.kind === 'coin' ? '#facc15' : pickup.kind === 'boost' ? '#38bdf8' : pickup.kind === 'wrench' ? '#22c55e' : '#a78bfa';
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, 16 + pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pickup.kind === 'boost' ? 'B' : pickup.kind === 'wrench' ? '+' : pickup.kind === 'item' ? '?' : '$', 0, 1);
    ctx.restore();
  }
}

function drawLearnTokens(ctx, game) {
  if (game.mode !== 'learn') return;
  if (game.learnTokens.length === 0) spawnLearnTokens(game);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const token of game.learnTokens) {
    if (token.taken) continue;
    const radius = token.correct ? 29 : 27;
    ctx.shadowBlur = token.correct ? 20 : 8;
    ctx.shadowColor = token.correct ? '#22c55e' : '#94a3b8';
    ctx.fillStyle = token.correct ? 'rgba(34,197,94,.94)' : 'rgba(226,232,240,.88)';
    ctx.beginPath();
    ctx.arc(token.x, token.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = token.correct ? '#bbf7d0' : '#64748b';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = token.correct ? '#052e16' : '#0f172a';
    ctx.font = token.label.length > 8 ? '900 11px Outfit, sans-serif' : '900 13px Outfit, sans-serif';
    ctx.fillText(token.label, token.x, token.y + 1);
  }
  ctx.restore();
}

function drawCar(ctx, car, color = '#7c3aed', label = '', isPlayer = false) {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle);
  ctx.shadowBlur = isPlayer ? 20 : 10;
  ctx.shadowColor = color;
  ctx.fillStyle = 'rgba(15,23,42,.35)';
  ctx.beginPath();
  ctx.ellipse(-2, 8, 24, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#111827';
  drawRoundedRect(ctx, -14, -23, 28, 46, 8);
  ctx.fill();
  ctx.fillStyle = color;
  drawRoundedRect(ctx, -18, -18, 36, 36, 9);
  ctx.fill();
  ctx.fillStyle = '#bae6fd';
  drawRoundedRect(ctx, -10, -13, 20, 14, 5);
  ctx.fill();
  ctx.fillStyle = '#facc15';
  ctx.fillRect(11, -4, 8, 5);
  ctx.fillRect(11, 8, 8, 5);
  ctx.fillStyle = '#020617';
  ctx.fillRect(-22, -13, 7, 12);
  ctx.fillRect(-22, 8, 7, 12);
  ctx.fillRect(15, -13, 7, 12);
  ctx.fillRect(15, 8, 7, 12);
  if (label) {
    ctx.rotate(-car.angle);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, -28);
  }
  if (isPlayer && car.shield > 0) {
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 16;
    ctx.shadowColor = '#a78bfa';
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCars(ctx, game) {
  ctx.save();
  for (const mark of game.skidMarks) {
    ctx.globalAlpha = mark.life * 0.22;
    ctx.translate(mark.x, mark.y);
    ctx.rotate(mark.angle);
    ctx.fillStyle = '#020617';
    ctx.fillRect(-18, -14, 24, 4);
    ctx.fillRect(-18, 12, 24, 4);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  ctx.restore();

  for (const opponent of game.opponents) drawCar(ctx, opponent, opponent.color, opponent.name);
  const playerColor = game.car.damage > 72 ? '#fb7185' : game.car.drift > 0.5 ? '#f59e0b' : '#8b5cf6';
  drawCar(ctx, game.car, playerColor, 'YOU', true);
}

function drawParticles(ctx, game) {
  ctx.save();
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
  drawRoundedRect(ctx, x, y + 8, width * clamp(value / 100, 0, 1), 10, 5);
  ctx.fill();
}

function formatTime(value) {
  const mins = Math.floor(value / 60);
  const secs = Math.floor(value % 60);
  const ms = Math.floor((value * 100) % 100);
  return `${mins}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

function drawHud(ctx, game) {
  const task = currentTask(game);
  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, 36, 42, 232, game.mode === 'learn' ? 312 : 244, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 27px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Learn Rally' : 'Micro Rally', 60, 82);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.fillText(`Score ${game.score}`, 60, 116);
  ctx.fillText(`Runde ${Math.min(game.lap + 1, game.totalLaps)}/${game.totalLaps}  Gate ${game.nextGate}`, 60, 144);
  ctx.fillText(`Zeit ${formatTime(game.raceTime)}`, 60, 172);
  ctx.fillText(`Combo x${Math.max(1, game.gateCombo)}`, 60, 200);
  if (game.mode === 'learn') {
    ctx.fillStyle = '#67e8f9';
    ctx.fillText(`${task.subject} - ${task.kind}`, 60, 236);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 15px Outfit, sans-serif';
    ctx.fillText(task.prompt, 60, 266, 185);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '800 12px Outfit, sans-serif';
    ctx.fillText(`Richtig ${game.correct}  Fehler ${game.wrong}`, 60, 298);
  }

  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, 1000, 42, 242, 374, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 18px Outfit, sans-serif';
  ctx.fillText('Cockpit', 1024, 82);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText('WASD/Pfeile fahren', 1024, 112);
  ctx.fillText('Space Boost · E Item', 1024, 136);
  ctx.fillText(`Item ${game.car.item ? game.car.item.toUpperCase() : '-'}`, 1024, 160);
  drawGauge(ctx, 1024, 188, 160, 'BOOST', game.car.boost, '#38bdf8');
  drawGauge(ctx, 1024, 226, 160, 'SCHADEN', game.car.damage, game.car.damage > 70 ? '#fb7185' : '#f59e0b');
  drawGauge(ctx, 1024, 264, 160, 'DRAFT', game.car.draft, '#67e8f9');
  drawGauge(ctx, 1024, 302, 160, 'SCHILD', game.car.shield, '#a78bfa');
  ctx.fillStyle = '#93c5fd';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText('MISSIONEN', 1024, 348);
  game.goals.slice(0, 3).forEach((goal, index) => {
    const progress = Math.min(game.stats[goal.stat] || 0, goal.target);
    const y = 368 + index * 15;
    ctx.fillStyle = goal.completed ? '#bbf7d0' : '#e2e8f0';
    ctx.fillText(`${progress}/${goal.target} ${goal.label}`, 1024, y);
  });

  ctx.fillStyle = 'rgba(2,6,23,.72)';
  drawRoundedRect(ctx, 42, HEIGHT - 58, 560, 38, 14);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText('Top-Down-Fahren: Ideallinie, Drift, Boost, Windschatten, Items, Turbo-Pads und Learncade-Gates', 62, HEIGHT - 34);
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
    ctx.font = '900 52px Outfit, sans-serif';
    ctx.fillText(game.finished ? game.message : 'FASKA MICRO RALLY PRO', WIDTH / 2, 250);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '800 18px Outfit, sans-serif';
    ctx.fillText(
      game.finished ? `Score ${game.score} - Highscore ${Math.max(game.highScore, game.score)}` : 'Mini-Racer im Vollbild mit Drift, Gegnern, Powerups und Learncade-Gates.',
      WIDTH / 2,
      294,
    );
    ctx.fillStyle = '#67e8f9';
    ctx.font = '900 16px Outfit, sans-serif';
    ctx.fillText('Normal oder Learncade starten.', WIDTH / 2, 328);
  } else {
    ctx.fillStyle = 'rgba(2,6,23,.76)';
    drawRoundedRect(ctx, WIDTH / 2 - 310, 84, 620, 50, 16);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 20px Outfit, sans-serif';
    ctx.fillText(game.message, WIDTH / 2, 117);
  }
  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  if (game.shake > 0) {
    const amount = game.shake * 14;
    ctx.translate(
      (seededUnit(Math.round(game.elapsed * 1000), 1) - 0.5) * amount,
      (seededUnit(Math.round(game.elapsed * 1000), 2) - 0.5) * amount,
    );
  }
  drawBackground(ctx, game);
  drawTrack(ctx, game);
  drawPickups(ctx, game);
  drawDeskObjects(ctx);
  drawLearnTokens(ctx, game);
  drawCars(ctx, game);
  drawParticles(ctx, game);
  drawHud(ctx, game);
  drawMessage(ctx, game);
  ctx.restore();
}

export default function FaskaMicroMachinesSwarm() {
  const canvasRef = useRef(null);
  const modeRef = useRef('arcade');
  const gameRef = useRef(makeInitialGame('arcade'));
  const controlsRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
    boost: false,
    accel: false,
    brake: false,
    item: false,
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
    if (nextMode === 'learn') spawnLearnTokens(gameRef.current);
    gameRef.current.started = true;
    gameRef.current.message = nextMode === 'learn'
      ? 'Fahre durch die richtige Antwort.'
      : 'Drei Runden. Gate-Reihenfolge halten.';
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
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' ', 'space', 'spacebar', 'e', 'x', 'm', 'r'].includes(key)) {
        event.preventDefault();
      }
      if (key === 'arrowup' || key === 'w') controlsRef.current.up = true;
      if (key === 'arrowdown' || key === 's') controlsRef.current.down = true;
      if (key === 'arrowleft' || key === 'a') controlsRef.current.left = true;
      if (key === 'arrowright' || key === 'd') controlsRef.current.right = true;
      if (key === ' ' || key === 'space' || key === 'spacebar') controlsRef.current.boost = true;
      if (key === 'e' || key === 'x') controlsRef.current.item = true;
      if (key === 'm') startGame(modeRef.current === 'learn' ? 'arcade' : 'learn');
      if (key === 'r') startGame(modeRef.current);
    };
    const up = (event) => {
      const key = event.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') controlsRef.current.up = false;
      if (key === 'arrowdown' || key === 's') controlsRef.current.down = false;
      if (key === 'arrowleft' || key === 'a') controlsRef.current.left = false;
      if (key === 'arrowright' || key === 'd') controlsRef.current.right = false;
      if (key === ' ' || key === 'space' || key === 'spacebar') controlsRef.current.boost = false;
      if (key === 'e' || key === 'x') controlsRef.current.item = false;
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
        <div style={{
          position: 'fixed',
          left: 18,
          bottom: 18,
          display: 'grid',
          gridTemplateColumns: '62px 62px 62px',
          gap: 8,
          zIndex: 5,
        }}>
          <div />
          <button type="button" aria-label="Gas" style={touchButton} {...holdButton('up')}>Gas</button>
          <div />
          <button type="button" aria-label="Links" style={touchButton} {...holdButton('left')}>L</button>
          <button type="button" aria-label="Bremse" style={touchButton} {...holdButton('down')}>B</button>
          <button type="button" aria-label="Rechts" style={touchButton} {...holdButton('right')}>R</button>
          <div />
          <button type="button" aria-label="Boost" style={touchButton} {...holdButton('boost')}>Boost</button>
          <button type="button" aria-label="Item" style={touchButton} {...holdButton('item')}>Item</button>
        </div>
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
