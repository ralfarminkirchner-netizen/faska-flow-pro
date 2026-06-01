import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const WORLD_W = 1760;
const WORLD_H = 1160;
const PLAYER_R = 18;
const GRAVITY = 820;

const RAILS = [
  { id: 'rail-a', ax: 250, ay: 340, bx: 690, by: 270, color: '#67e8f9', label: 'Rail' },
  { id: 'rail-b', ax: 1080, ay: 300, bx: 1480, by: 435, color: '#facc15', label: 'Kink' },
  { id: 'rail-c', ax: 420, ay: 780, bx: 880, by: 905, color: '#a78bfa', label: 'Long Grind' },
  { id: 'rail-d', ax: 1050, ay: 820, bx: 1510, by: 720, color: '#5eead4', label: 'Down Rail' },
];

const RAMPS = [
  { id: 'ramp-a', x: 190, y: 190, w: 180, h: 96, angle: -0.42, boost: 470, label: 'Quarter' },
  { id: 'ramp-b', x: 1390, y: 200, w: 190, h: 110, angle: 0.42, boost: 500, label: 'Hip' },
  { id: 'ramp-c', x: 770, y: 518, w: 210, h: 122, angle: 0, boost: 540, label: 'Spine' },
  { id: 'ramp-d', x: 230, y: 880, w: 220, h: 120, angle: 0.55, boost: 500, label: 'Bank' },
  { id: 'ramp-e', x: 1280, y: 890, w: 240, h: 116, angle: -0.5, boost: 520, label: 'Transfer' },
];

const TOKENS = [
  { x: 540, y: 190, value: 80 },
  { x: 1040, y: 185, value: 80 },
  { x: 1560, y: 590, value: 100 },
  { x: 950, y: 975, value: 120 },
  { x: 315, y: 650, value: 90 },
  { x: 1190, y: 600, value: 90 },
];

const BOOST_PADS = [
  { x: 430, y: 515, angle: -0.24, power: 560, label: 'Boost' },
  { x: 875, y: 350, angle: 0.12, power: 620, label: 'Transfer' },
  { x: 1295, y: 575, angle: 0.78, power: 590, label: 'Flow' },
  { x: 580, y: 1010, angle: -0.68, power: 640, label: 'Launch' },
];

const LINE_MARKERS = [
  { x: 520, y: 430, label: 'Line 1' },
  { x: 875, y: 315, label: 'Line 2' },
  { x: 1215, y: 560, label: 'Line 3' },
  { x: 1515, y: 730, label: 'Line 4' },
];

const HAZARDS = [
  { id: 'sweeper-a', x: 820, y: 706, ax: 610, ay: 705, bx: 1035, by: 705, r: 28, speed: 0.16, label: 'Cleaner' },
  { id: 'sweeper-b', x: 1320, y: 315, ax: 1220, ay: 240, bx: 1510, by: 455, r: 30, speed: 0.2, label: 'Drone' },
  { id: 'sweeper-c', x: 405, y: 900, ax: 265, ay: 865, bx: 720, by: 990, r: 26, speed: 0.18, label: 'Barrier' },
];

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "rollt"?',
    answer: 'Verb',
    options: ['Nomen', 'Verb', 'Adjektiv'],
  },
  {
    subject: 'Mathe',
    prompt: '7 x 8 = ?',
    answer: '56',
    options: ['48', '56', '64'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "jump"?',
    answer: 'springen',
    options: ['springen', 'lesen', 'malen'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welches Wort ist ein Nomen?',
    answer: 'Rampe',
    options: ['schnell', 'Rampe', 'fahren'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Was bremst Bewegung?',
    answer: 'Reibung',
    options: ['Reibung', 'Mondlicht', 'Zucker'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Was ist ein zusammengesetztes Nomen?',
    answer: 'Skatepark',
    options: ['schnell', 'Skatepark', 'rollen'],
  },
  {
    subject: 'Mathe',
    prompt: '125 + 75 = ?',
    answer: '200',
    options: ['180', '200', '250'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "rail"?',
    answer: 'Gelaender',
    options: ['Gelaender', 'Regen', 'Rucksack'],
  },
];

const TRICKS = {
  flip: { name: 'Kickflip', key: 'J', score: 120, spin: 1.2, color: '#67e8f9' },
  grab: { name: 'Tailgrab', key: 'K', score: 150, spin: 0.65, color: '#facc15' },
  spin: { name: '360 Spin', key: 'L', score: 190, spin: 2.6, color: '#a78bfa' },
  manual: { name: 'Manual', key: 'Shift', score: 8, spin: 0, color: '#5eead4' },
};

const GOAL_DEFS = [
  { id: 'combo-1200', label: '1200er Combo landen', type: 'bestCombo', target: 1200, reward: 900 },
  { id: 'two-rails', label: '2 Rails grinden', type: 'rails', target: 2, reward: 650 },
  { id: 'four-stars', label: '4 Sterne sammeln', type: 'tokens', target: 4, reward: 560 },
  { id: 'line-one', label: '1 komplette Park-Line', type: 'lines', target: 1, reward: 780 },
  { id: 'boost-three', label: '3 Boost-Pads treffen', type: 'boosts', target: 3, reward: 560 },
  { id: 'hazard-jumps', label: '2 Hazards ueberspringen', type: 'hazardDodges', target: 2, reward: 700 },
  { id: 'learn-two', label: '2 richtige Gates', type: 'correctGates', target: 2, reward: 760, learnOnly: true },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const distance = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2);
const normalize = (x, y) => {
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
};

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

function closestPoint(px, py, ax, ay, bx, by) {
  const vx = bx - ax;
  const vy = by - ay;
  const len = vx * vx + vy * vy || 1;
  const t = clamp(((px - ax) * vx + (py - ay) * vy) / len, 0, 1);
  return { x: ax + vx * t, y: ay + vy * t, t };
}

function makeLearnGates(taskIndex, anchorX = WORLD_W / 2, anchorY = WORLD_H / 2) {
  const task = LEARN_TASKS[taskIndex % LEARN_TASKS.length];
  const spots = [
    { x: anchorX - 250, y: anchorY - 35 },
    { x: anchorX + 250, y: anchorY - 35 },
    { x: anchorX, y: anchorY + 145 },
  ];
  return task.options.map((label, index) => ({
    id: `${taskIndex}-${label}`,
    label,
    correct: label === task.answer,
    x: clamp(spots[index].x, 130, WORLD_W - 130),
    y: clamp(spots[index].y, 130, WORLD_H - 130),
    r: 56,
    active: true,
  }));
}

function spawnParticles(game, x, y, color, count = 10, speed = 170) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed;
    const burst = speed * (0.5 + (i % 5) * 0.14);
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * burst,
      vy: Math.sin(angle) * burst,
      life: 0.55,
      maxLife: 0.55,
      size: 4 + (i % 3) * 2,
      color,
    });
  }
}

function addFloater(game, x, y, text, color = '#facc15') {
  game.floaters.push({ x, y, text, color, life: 0.95, vy: -44 });
}

function goalProgress(game, goal) {
  if (goal.type === 'bestCombo') return game.stats.bestCombo;
  return game.stats[goal.type] || 0;
}

function completeGoal(game, goal) {
  if (goal.done || goalProgress(game, goal) < goal.target) return;
  goal.done = true;
  game.score += goal.reward;
  game.special = clamp(game.special + 24, 0, 100);
  game.message = `${goal.label} +${goal.reward}`;
  game.messageTimer = 1.15;
  addFloater(game, game.player.x, game.player.y - 72, 'Mission complete', '#5eead4');
  spawnParticles(game, game.player.x, game.player.y, '#5eead4', 22, 230);
}

function evaluateGoals(game) {
  game.goals.forEach((goal) => completeGoal(game, goal));
}

function activateSpecial(game) {
  if (game.special < 100 || game.specialTimer > 0 || game.player.bailTimer > 0) return false;
  game.special = 0;
  game.specialTimer = 8;
  game.stats.specials += 1;
  game.player.comboTimer = Math.max(game.player.comboTimer, 4);
  game.player.comboMult = clamp(game.player.comboMult + 1.15, 1, 10);
  game.message = 'FLOW STATE';
  game.messageTimer = 1;
  addFloater(game, game.player.x, game.player.y - 88, 'SPECIAL', '#facc15');
  spawnParticles(game, game.player.x, game.player.y, '#facc15', 28, 260);
  return true;
}

function makeHazards() {
  return HAZARDS.map((hazard, index) => ({ ...hazard, t: index % 2 ? 0.7 : 0.15, dir: index % 2 ? -1 : 1, hitCooldown: 0 }));
}

function makeInitialGame(mode = 'arcade') {
  return {
    mode,
    elapsed: 0,
    phase: 'play',
    timer: 105,
    score: 0,
    bestCombo: 0,
    special: 0,
    specialTimer: 0,
    taskIndex: 0,
    learnCooldown: 0,
    lineIndex: 0,
    lineTimer: 0,
    camera: { x: 0, y: 0 },
    message: mode === 'learn' ? 'Fahre durch Antwort-Gates und lande Combos.' : 'Tricks, Grinds und saubere Landungen geben Punkte.',
    messageTimer: 2,
    player: {
      x: 300,
      y: 580,
      vx: 0,
      vy: 0,
      z: 0,
      vz: 0,
      angle: 0,
      boardAngle: 0,
      balance: 1,
      manual: 0,
      grindRail: null,
      grindT: 0,
      grindDir: 1,
      airtime: 0,
      speed: 0,
      trickScore: 0,
      comboScore: 0,
      comboMult: 1,
      comboTimer: 0,
      bailTimer: 0,
      trickText: '',
      trickSpin: 0,
      lastRamp: null,
      trickLocks: {
        flip: 0,
        grab: 0,
        spin: 0,
      },
    },
    stats: {
      rails: 0,
      ramps: 0,
      tokens: 0,
      correctGates: 0,
      bestCombo: 0,
      bails: 0,
      specials: 0,
      lines: 0,
      boosts: 0,
      hazardDodges: 0,
      hazardHits: 0,
    },
    goals: GOAL_DEFS
      .filter((goal) => mode === 'learn' || !goal.learnOnly)
      .map((goal) => ({ ...goal, done: false })),
    input: {
      up: false,
      down: false,
      left: false,
      right: false,
      jump: false,
      flip: false,
      grab: false,
      spin: false,
      manual: false,
      special: false,
    },
    tokens: TOKENS.map((token, index) => ({ ...token, id: `token-${index}`, taken: false })),
    boostPads: BOOST_PADS.map((pad, index) => ({ ...pad, id: `boost-${index}`, cooldown: 0 })),
    lineMarkers: LINE_MARKERS.map((marker, index) => ({ ...marker, id: `line-${index}`, index, active: index === 0, cleared: false })),
    hazards: makeHazards(),
    gates: mode === 'learn' ? makeLearnGates(0, 880, 820) : [],
    particles: [],
    floaters: [],
    result: null,
  };
}

function addTrick(game, trickKey) {
  const player = game.player;
  const trick = TRICKS[trickKey];
  if (!trick || player.bailTimer > 0) return;
  if (trickKey !== 'manual' && player.trickLocks[trickKey] > 0) return;
  const airborne = player.z > 8;
  if (!airborne && trickKey !== 'manual') return;
  if (trickKey === 'manual' && player.z > 4) return;
  const speedBonus = Math.round(Math.hypot(player.vx, player.vy) * 0.08);
  const gained = trickKey === 'manual'
    ? Math.round(trick.score * (0.5 + player.manual))
    : trick.score + speedBonus;
  player.trickScore += gained;
  player.comboScore += gained * player.comboMult;
  player.comboTimer = 3.0;
  player.comboMult = clamp(player.comboMult + (trickKey === 'manual' ? 0.02 : 0.22), 1, game.specialTimer > 0 ? 10 : 8);
  player.trickText = trick.name;
  player.trickSpin += trick.spin;
  game.special = clamp(game.special + (trickKey === 'manual' ? 0.35 : 2.8), 0, 100);
  if (trickKey !== 'manual') {
    player.trickLocks[trickKey] = trickKey === 'spin' ? 0.5 : 0.34;
  }
  addFloater(game, player.x, player.y - player.z - 36, `${trick.name} +${gained}`, trick.color);
  spawnParticles(game, player.x, player.y - player.z, trick.color, 8, 135);
}

function bankCombo(game, clean = true) {
  const player = game.player;
  if (player.comboScore <= 0) {
    if (!clean) {
      game.stats.bails += 1;
      game.special = Math.max(0, game.special - 12);
      addFloater(game, player.x, player.y - 42, 'Bail!', '#fb7185');
      spawnParticles(game, player.x, player.y, '#fb7185', 18, 210);
    }
    return;
  }
  if (clean) {
    const banked = Math.round(player.comboScore);
    game.score += banked;
    game.bestCombo = Math.max(game.bestCombo, banked);
    game.stats.bestCombo = Math.max(game.stats.bestCombo, banked);
    game.special = clamp(game.special + Math.min(22, banked / 140), 0, 100);
    evaluateGoals(game);
    addFloater(game, player.x, player.y - 42, `Landed ${banked}`, '#5eead4');
    spawnParticles(game, player.x, player.y, '#5eead4', 18, 210);
  } else {
    game.stats.bails += 1;
    game.special = Math.max(0, game.special - 18);
    addFloater(game, player.x, player.y - 42, 'Bail!', '#fb7185');
    spawnParticles(game, player.x, player.y, '#fb7185', 24, 240);
  }
  player.trickScore = 0;
  player.comboScore = 0;
  player.comboMult = 1;
  player.comboTimer = 0;
  player.trickText = '';
}

function resolveGate(game, gate) {
  const task = LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
  game.learnCooldown = 0.8;
  if (gate.correct) {
    const bonus = 700 + game.taskIndex * 60;
    game.score += bonus;
    game.player.comboScore += 240;
    game.player.comboTimer = 3.2;
    game.player.comboMult = clamp(game.player.comboMult + 0.65, 1, game.specialTimer > 0 ? 10 : 8);
    game.stats.correctGates += 1;
    game.special = clamp(game.special + 12, 0, 100);
    game.message = `${task.subject}: richtig - Combo Boost`;
    game.messageTimer = 1.15;
    addFloater(game, gate.x, gate.y - 50, `${gate.label} +${bonus}`, '#5eead4');
    spawnParticles(game, gate.x, gate.y, '#5eead4', 24, 230);
    game.taskIndex += 1;
    evaluateGoals(game);
  } else {
    game.message = `${gate.label} war falsch. Richtig: ${task.answer}`;
    game.messageTimer = 1.35;
    game.player.balance = Math.max(0.24, game.player.balance - 0.38);
    game.special = Math.max(0, game.special - 10);
    addFloater(game, gate.x, gate.y - 50, 'falsch', '#fb7185');
    spawnParticles(game, gate.x, gate.y, '#fb7185', 18, 210);
  }
  game.gates = makeLearnGates(game.taskIndex, game.player.x, game.player.y);
}

function triggerBail(game, reason = 'Bail!') {
  const player = game.player;
  if (player.bailTimer > 0) return;
  player.bailTimer = 1.05;
  player.balance = 0.36;
  player.vx *= -0.22;
  player.vy *= -0.22;
  game.stats.hazardHits += reason === 'Hazard!' ? 1 : 0;
  game.lineIndex = 0;
  game.lineTimer = 0;
  game.lineMarkers = game.lineMarkers.map((marker, index) => ({ ...marker, active: index === 0, cleared: false }));
  game.message = reason;
  game.messageTimer = 0.9;
  bankCombo(game, false);
}

function completeLineMarker(game, marker) {
  const player = game.player;
  marker.active = false;
  marker.cleared = true;
  player.comboScore += 260 * player.comboMult;
  player.comboTimer = 3.4;
  player.comboMult = clamp(player.comboMult + 0.42, 1, game.specialTimer > 0 ? 10 : 8);
  game.special = clamp(game.special + 8, 0, 100);
  game.lineTimer = 8;
  addFloater(game, marker.x, marker.y - 42, marker.label, '#5eead4');
  spawnParticles(game, marker.x, marker.y, '#5eead4', 20, 220);
  game.lineIndex += 1;
  if (game.lineIndex >= game.lineMarkers.length) {
    game.stats.lines += 1;
    game.score += 950;
    game.message = 'Park-Line komplett';
    game.messageTimer = 1.1;
    game.lineIndex = 0;
    game.lineTimer = 0;
    game.lineMarkers = game.lineMarkers.map((candidate, index) => ({ ...candidate, active: index === 0, cleared: false }));
    evaluateGoals(game);
    return;
  }
  game.lineMarkers = game.lineMarkers.map((candidate, index) => ({
    ...candidate,
    active: index === game.lineIndex,
    cleared: index < game.lineIndex,
  }));
}

function updateLineMarkers(game, dt) {
  if (game.player.bailTimer > 0) return;
  if (game.lineTimer > 0) {
    game.lineTimer = Math.max(0, game.lineTimer - dt);
    if (game.lineTimer === 0 && game.lineIndex > 0) {
      game.lineIndex = 0;
      game.lineMarkers = game.lineMarkers.map((marker, index) => ({ ...marker, active: index === 0, cleared: false }));
      game.message = 'Line neu starten';
      game.messageTimer = 0.8;
    }
  }
  const active = game.lineMarkers.find((marker) => marker.active);
  if (active && distance(game.player.x, game.player.y, active.x, active.y) < 52 + game.player.z * 0.02) {
    completeLineMarker(game, active);
  }
}

function updateBoostPads(game, dt) {
  const player = game.player;
  if (player.bailTimer > 0) return;
  game.boostPads.forEach((pad) => {
    pad.cooldown = Math.max(0, pad.cooldown - dt);
    if (pad.cooldown > 0 || distance(player.x, player.y, pad.x, pad.y) > 52 || player.z > 18) return;
    pad.cooldown = 3.2;
    player.vx += Math.cos(pad.angle) * pad.power;
    player.vy += Math.sin(pad.angle) * pad.power;
    player.speed = Math.hypot(player.vx, player.vy);
    player.comboScore += 120 * player.comboMult;
    player.comboTimer = 2.8;
    game.stats.boosts += 1;
    game.special = clamp(game.special + 5, 0, 100);
    evaluateGoals(game);
    game.message = pad.label;
    game.messageTimer = 0.65;
    addFloater(game, pad.x, pad.y - 34, pad.label, '#67e8f9');
    spawnParticles(game, pad.x, pad.y, '#67e8f9', 18, 260);
  });
}

function updateHazards(game, dt) {
  const player = game.player;
  game.hazards.forEach((hazard) => {
    hazard.hitCooldown = Math.max(0, hazard.hitCooldown - dt);
    hazard.t += hazard.dir * hazard.speed * dt;
    if (hazard.t <= 0 || hazard.t >= 1) {
      hazard.t = clamp(hazard.t, 0, 1);
      hazard.dir *= -1;
    }
    hazard.x = lerp(hazard.ax, hazard.bx, hazard.t);
    hazard.y = lerp(hazard.ay, hazard.by, hazard.t);
    if (player.bailTimer > 0) return;
    const gap = distance(player.x, player.y, hazard.x, hazard.y);
    if (gap < hazard.r + PLAYER_R + 6 && hazard.hitCooldown <= 0) {
      hazard.hitCooldown = 1.2;
      if (player.z > 32) {
        game.stats.hazardDodges += 1;
        player.comboScore += 180 * player.comboMult;
        player.comboTimer = 3.1;
        game.special = clamp(game.special + 6, 0, 100);
        evaluateGoals(game);
        addFloater(game, hazard.x, hazard.y - 40, 'Clean jump', '#facc15');
        spawnParticles(game, hazard.x, hazard.y, '#facc15', 16, 220);
      } else {
        triggerBail(game, 'Hazard!');
      }
    }
  });
}

function updateMovement(game, dt) {
  const player = game.player;
  const input = game.input;
  const flow = game.specialTimer > 0;
  if (player.bailTimer > 0) {
    player.bailTimer = Math.max(0, player.bailTimer - dt);
    player.vx *= Math.pow(0.88, dt * 60);
    player.vy *= Math.pow(0.88, dt * 60);
    player.x += player.vx * dt;
    player.y += player.vy * dt;
    return;
  }

  const turn = ((input.right ? 1 : 0) - (input.left ? 1 : 0)) * 3.2;
  const push = (input.up ? 1 : 0) - (input.down ? 0.65 : 0);
  player.angle += turn * dt * (input.down ? 0.7 : 1);
  const dirX = Math.cos(player.angle);
  const dirY = Math.sin(player.angle);
  const acceleration = push > 0 ? 520 : push < 0 ? -300 : 0;
  player.vx += dirX * acceleration * dt;
  player.vy += dirY * acceleration * dt;
  player.vx *= Math.pow(input.down ? 0.86 : 0.982, dt * 60);
  player.vy *= Math.pow(input.down ? 0.86 : 0.982, dt * 60);
  player.speed = Math.hypot(player.vx, player.vy);

  if (player.grindRail) {
    const rail = RAILS.find((candidate) => candidate.id === player.grindRail);
    if (rail) {
      const railLen = distance(rail.ax, rail.ay, rail.bx, rail.by);
      player.grindT += player.grindDir * dt * (0.24 + player.speed / Math.max(railLen, 1));
      const t = clamp(player.grindT, 0, 1);
      player.x = lerp(rail.ax, rail.bx, t);
      player.y = lerp(rail.ay, rail.by, t);
      player.z = 18;
      player.vz = 0;
      player.comboScore += 62 * dt * player.comboMult;
      player.comboTimer = 2.8;
      player.comboMult = clamp(player.comboMult + dt * (flow ? 0.85 : 0.5), 1, flow ? 10 : 8);
      player.balance -= dt * ((flow ? 0.07 : 0.16) + player.speed / (flow ? 5200 : 3200));
      player.balance += ((input.left ? 1 : 0) - (input.right ? 1 : 0)) * dt * 0.05;
      if (player.balance <= 0 || player.grindT <= 0 || player.grindT >= 1 || input.jump) {
        const cleanExit = player.balance > 0.05;
        player.grindRail = null;
        player.vx = Math.cos(player.angle) * Math.max(player.speed, 340);
        player.vy = Math.sin(player.angle) * Math.max(player.speed, 340);
        player.vz = input.jump ? 450 : 220;
        if (!cleanExit) {
          player.bailTimer = 1.1;
          bankCombo(game, false);
        }
      }
      return;
    }
  }

  player.x += player.vx * dt;
  player.y += player.vy * dt;
  player.x = clamp(player.x, 46, WORLD_W - 46);
  player.y = clamp(player.y, 46, WORLD_H - 46);

  if (player.z <= 0 && input.jump && player.speed > 90) {
    player.z = 1;
    player.vz = 360 + clamp(player.speed * 0.32, 0, 210);
    player.airtime = 0;
    spawnParticles(game, player.x, player.y, '#e0f2fe', 8, 120);
  }

  let touchedRamp = false;
  RAMPS.forEach((ramp) => {
    const inRamp = player.x > ramp.x && player.x < ramp.x + ramp.w && player.y > ramp.y && player.y < ramp.y + ramp.h;
    if (inRamp && player.z <= 2 && player.speed > 135) {
      touchedRamp = true;
      player.z = 2;
      player.vz = Math.max(player.vz, ramp.boost + player.speed * 0.24);
      player.angle = lerp(player.angle, ramp.angle, 0.08);
      if (player.lastRamp !== ramp.id) {
        player.lastRamp = ramp.id;
        game.stats.ramps += 1;
        game.special = clamp(game.special + 2.5, 0, 100);
        addFloater(game, player.x, player.y - 36, ramp.label, '#facc15');
        spawnParticles(game, player.x, player.y, '#facc15', 10, 150);
      }
    }
  });
  if (!touchedRamp && player.z <= 0) player.lastRamp = null;

  if (player.z > 0) {
    player.airtime += dt;
    player.z += player.vz * dt;
    player.vz -= GRAVITY * dt;
    if (player.z <= 0) {
      const risky = Math.abs(Math.sin(player.trickSpin)) > 0.82 && player.trickScore > 240;
      player.z = 0;
      player.vz = 0;
      if (risky && player.balance < 0.48) {
        player.bailTimer = 1.0;
        bankCombo(game, false);
      } else {
        bankCombo(game, true);
        player.balance = clamp(player.balance + 0.24, 0, 1);
      }
      player.trickSpin = 0;
    }
  }

  if (player.z <= 0) {
    const nearRail = RAILS
      .map((rail) => ({ rail, point: closestPoint(player.x, player.y, rail.ax, rail.ay, rail.bx, rail.by) }))
      .find(({ point }) => distance(player.x, player.y, point.x, point.y) < 30 && player.speed > 210);
    if (nearRail && input.jump) {
      const rail = nearRail.rail;
      const railDir = normalize(rail.bx - rail.ax, rail.by - rail.ay);
      const moveDir = normalize(player.vx, player.vy);
      player.grindRail = rail.id;
      player.grindT = nearRail.point.t;
      player.grindDir = railDir.x * moveDir.x + railDir.y * moveDir.y >= 0 ? 1 : -1;
      player.balance = clamp(player.balance + 0.18, 0, 1);
      player.comboTimer = 3;
      player.comboMult = clamp(player.comboMult + 0.3, 1, flow ? 10 : 8);
      player.trickText = rail.label;
      game.stats.rails += 1;
      game.special = clamp(game.special + 7, 0, 100);
      evaluateGoals(game);
      addFloater(game, player.x, player.y - 34, rail.label, rail.color);
      spawnParticles(game, player.x, player.y, rail.color, 14, 160);
    }
  }
}

function updateGame(game, dt, onFinish) {
  if (game.phase !== 'play') return;
  game.elapsed += dt;
  game.timer = Math.max(0, game.timer - dt);
  game.specialTimer = Math.max(0, game.specialTimer - dt);
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.learnCooldown = Math.max(0, game.learnCooldown - dt);
  const player = game.player;
  Object.keys(player.trickLocks).forEach((key) => {
    player.trickLocks[key] = Math.max(0, player.trickLocks[key] - dt);
  });

  updateMovement(game, dt);
  updateBoostPads(game, dt);
  updateLineMarkers(game, dt);
  updateHazards(game, dt);

  if (game.input.flip) addTrick(game, 'flip');
  if (game.input.grab) addTrick(game, 'grab');
  if (game.input.spin) addTrick(game, 'spin');
  if (game.input.special) {
    activateSpecial(game);
    game.input.special = false;
  }
  if (game.input.manual && player.z <= 0 && !player.grindRail && player.speed > 120) {
    player.manual = clamp(player.manual + dt * 0.85, 0, 1);
    player.balance -= dt * 0.19;
    addTrick(game, 'manual');
  } else {
    player.manual = Math.max(0, player.manual - dt * 1.5);
    player.balance = clamp(player.balance + dt * 0.08, 0, 1);
  }
  if (player.balance <= 0 && player.bailTimer <= 0) {
    triggerBail(game, 'Bail!');
  }

  player.comboTimer = Math.max(0, player.comboTimer - dt);
  if (player.comboTimer <= 0 && player.comboScore > 0 && player.z <= 0 && !player.grindRail) {
    bankCombo(game, true);
  }

  game.tokens.forEach((token) => {
    if (!token.taken && distance(player.x, player.y, token.x, token.y) < 46 + player.z * 0.03) {
      token.taken = true;
      const gain = token.value * Math.max(1, Math.round(player.comboMult));
      game.score += gain;
      game.stats.tokens += 1;
      game.special = clamp(game.special + 4, 0, 100);
      evaluateGoals(game);
      addFloater(game, token.x, token.y - 34, `+${gain}`, '#facc15');
      spawnParticles(game, token.x, token.y, '#facc15', 16, 180);
    }
  });

  if (game.mode === 'learn' && game.learnCooldown <= 0) {
    const gate = game.gates.find((candidate) => candidate.active && distance(player.x, player.y, candidate.x, candidate.y) < candidate.r + PLAYER_R);
    if (gate) resolveGate(game, gate);
  }

  game.camera.x = lerp(game.camera.x, clamp(player.x - WIDTH / 2, 0, WORLD_W - WIDTH), 0.12);
  game.camera.y = lerp(game.camera.y, clamp(player.y - HEIGHT / 2, 0, WORLD_H - HEIGHT), 0.12);

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

  if (game.timer <= 0) {
    game.phase = 'result';
    bankCombo(game, true);
    game.result = { title: 'Run beendet', score: game.score, bestCombo: game.bestCombo };
    onFinish(game.result);
  }
}

function drawPark(ctx, game) {
  const cam = game.camera;
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bg.addColorStop(0, '#07111f');
  bg.addColorStop(0.52, '#12314e');
  bg.addColorStop(1, '#0b1020');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.translate(-cam.x, -cam.y);
  ctx.fillStyle = '#172033';
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  ctx.strokeStyle = 'rgba(148,163,184,.12)';
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

  RAMPS.forEach((ramp) => {
    ctx.save();
    ctx.translate(ramp.x + ramp.w / 2, ramp.y + ramp.h / 2);
    ctx.rotate(ramp.angle);
    const grad = ctx.createLinearGradient(-ramp.w / 2, -ramp.h / 2, ramp.w / 2, ramp.h / 2);
    grad.addColorStop(0, '#334155');
    grad.addColorStop(1, '#64748b');
    ctx.fillStyle = grad;
    drawRoundedRect(ctx, -ramp.w / 2, -ramp.h / 2, ramp.w, ramp.h, 18);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ramp.label, 0, 5);
    ctx.restore();
  });

  RAILS.forEach((rail) => {
    ctx.save();
    ctx.strokeStyle = rail.color;
    ctx.shadowColor = rail.color;
    ctx.shadowBlur = 14;
    ctx.lineCap = 'round';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(rail.ax, rail.ay);
    ctx.lineTo(rail.bx, rail.by);
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  });

  game.tokens.forEach((token) => {
    if (token.taken) return;
    const pulse = Math.sin(game.elapsed * 5 + token.x * 0.01) * 0.15 + 1;
    ctx.save();
    ctx.translate(token.x, token.y);
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    for (let i = 0; i < 5; i += 1) {
      const angle = -Math.PI / 2 + i * (Math.PI * 2 / 5);
      const radius = i % 2 === 0 ? 18 * pulse : 8 * pulse;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });

  game.boostPads.forEach((pad) => {
    const ready = pad.cooldown <= 0;
    ctx.save();
    ctx.translate(pad.x, pad.y);
    ctx.rotate(pad.angle);
    ctx.globalAlpha = ready ? 1 : 0.42;
    ctx.shadowColor = '#67e8f9';
    ctx.shadowBlur = ready ? 18 : 4;
    ctx.fillStyle = ready ? 'rgba(14,165,233,.78)' : 'rgba(51,65,85,.72)';
    drawRoundedRect(ctx, -52, -20, 104, 40, 14);
    ctx.fill();
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pad.label, 0, 5);
    ctx.restore();
  });

  game.lineMarkers.forEach((marker) => {
    const pulse = 1 + Math.sin(game.elapsed * 5 + marker.index) * 0.08;
    ctx.save();
    ctx.translate(marker.x, marker.y);
    ctx.globalAlpha = marker.cleared ? 0.48 : 1;
    ctx.shadowColor = marker.active ? '#5eead4' : '#94a3b8';
    ctx.shadowBlur = marker.active ? 24 : 8;
    ctx.strokeStyle = marker.active ? '#5eead4' : marker.cleared ? '#22c55e' : '#64748b';
    ctx.lineWidth = marker.active ? 7 : 4;
    ctx.beginPath();
    ctx.arc(0, 0, 29 * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = marker.active ? 'rgba(20,184,166,.82)' : 'rgba(15,23,42,.7)';
    ctx.beginPath();
    ctx.arc(0, 0, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${marker.index + 1}`, 0, 0);
    ctx.restore();
  });

  game.hazards.forEach((hazard) => {
    ctx.save();
    ctx.translate(hazard.x, hazard.y);
    ctx.shadowColor = '#fb7185';
    ctx.shadowBlur = hazard.hitCooldown > 0 ? 8 : 22;
    ctx.fillStyle = hazard.hitCooldown > 0 ? 'rgba(148,163,184,.78)' : 'rgba(244,63,94,.86)';
    ctx.beginPath();
    ctx.arc(0, 0, hazard.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fecaca';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#020617';
    ctx.font = '900 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('!', 0, 1);
    ctx.restore();
  });

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 6;
  drawRoundedRect(ctx, 30, 30, WORLD_W - 60, WORLD_H - 60, 28);
  ctx.stroke();
  ctx.restore();
}

function drawGates(ctx, game) {
  if (game.mode !== 'learn') return;
  ctx.save();
  ctx.translate(-game.camera.x, -game.camera.y);
  game.gates.forEach((gate) => {
    ctx.save();
    ctx.shadowColor = gate.correct ? '#5eead4' : '#818cf8';
    ctx.shadowBlur = 20;
    ctx.fillStyle = gate.correct ? 'rgba(20,184,166,.84)' : 'rgba(79,70,229,.82)';
    ctx.beginPath();
    ctx.arc(gate.x, gate.y, gate.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 17px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(gate.label, gate.x, gate.y);
    ctx.restore();
  });
  ctx.restore();
}

function drawPlayer(ctx, game) {
  const player = game.player;
  const cam = game.camera;
  const shadowScale = clamp(1 - player.z / 220, 0.28, 1);
  ctx.save();
  ctx.translate(player.x - cam.x, player.y - cam.y);
  ctx.fillStyle = 'rgba(2,6,23,.35)';
  ctx.beginPath();
  ctx.ellipse(0, 12, 28 * shadowScale, 12 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.translate(0, -player.z);
  ctx.rotate(player.angle + player.trickSpin * 0.2);
  if (player.bailTimer > 0) ctx.rotate(Math.sin(game.elapsed * 22) * 0.8);
  ctx.shadowColor = player.grindRail ? '#67e8f9' : player.z > 0 ? '#facc15' : '#22c55e';
  ctx.shadowBlur = player.grindRail || player.z > 0 ? 18 : 10;
  ctx.fillStyle = player.bailTimer > 0 ? '#fb7185' : '#22c55e';
  ctx.beginPath();
  ctx.arc(0, -11, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#bbf7d0';
  drawRoundedRect(ctx, -11, -2, 22, 28, 8);
  ctx.fill();
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-30, 26);
  ctx.lineTo(30, 26);
  ctx.stroke();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-23, 31, 4, 0, Math.PI * 2);
  ctx.arc(23, 31, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawEffects(ctx, game) {
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
    ctx.font = '900 16px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(floater.text, floater.x, floater.y);
  });
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawHud(ctx, game) {
  const player = game.player;
  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,.8)';
  drawRoundedRect(ctx, 28, 24, 390, 214, 20);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 27px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Learncade Trick Park Pro' : 'Faska Trick Park Pro', 54, 62);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.fillText(`Zeit ${Math.ceil(game.timer)} · Score ${game.score} · Best ${game.bestCombo}`, 54, 91);
  ctx.fillStyle = '#1f2937';
  drawRoundedRect(ctx, 54, 110, 275, 10, 5);
  ctx.fill();
  ctx.fillStyle = '#67e8f9';
  drawRoundedRect(ctx, 54, 110, 275 * clamp(player.speed / 720, 0, 1), 10, 5);
  ctx.fill();
  ctx.fillStyle = '#1f2937';
  drawRoundedRect(ctx, 54, 132, 275, 10, 5);
  ctx.fill();
  ctx.fillStyle = player.balance > 0.33 ? '#5eead4' : '#fb7185';
  drawRoundedRect(ctx, 54, 132, 275 * clamp(player.balance, 0, 1), 10, 5);
  ctx.fill();
  ctx.fillStyle = '#1f2937';
  drawRoundedRect(ctx, 54, 154, 275, 10, 5);
  ctx.fill();
  ctx.fillStyle = game.specialTimer > 0 ? '#facc15' : '#a78bfa';
  drawRoundedRect(ctx, 54, 154, 275 * clamp((game.specialTimer > 0 ? game.specialTimer / 8 : game.special / 100), 0, 1), 10, 5);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 11px Outfit, sans-serif';
  ctx.fillText(game.specialTimer > 0 ? `FLOW ${game.specialTimer.toFixed(1)}s` : `SPECIAL ${Math.round(game.special)}%`, 54, 184);
  ctx.fillStyle = '#5eead4';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText(`LINE ${game.lineIndex + 1}/${game.lineMarkers.length}${game.lineTimer > 0 ? ` · ${game.lineTimer.toFixed(1)}s` : ''}`, 54, 207);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 11px Outfit, sans-serif';
  ctx.fillText(`Boosts ${game.stats.boosts} · Hazard-Jumps ${game.stats.hazardDodges} · Bails ${game.stats.bails}`, 54, 226);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, WIDTH - 390, 24, 362, 184, 20);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 24px Outfit, sans-serif';
  ctx.fillText(player.comboScore > 0 ? `${Math.round(player.comboScore)} Combo` : 'Freeride', WIDTH - 54, 62);
  ctx.fillStyle = '#facc15';
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText(`x${player.comboMult.toFixed(1)} · ${player.trickText || 'Push & Jump'}`, WIDTH - 54, 94);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText('Missionen', WIDTH - 54, 124);
  game.goals.slice(0, 4).forEach((goal, index) => {
    const progress = Math.min(goal.target, goalProgress(game, goal));
    ctx.fillStyle = goal.done ? '#5eead4' : '#e2e8f0';
    ctx.font = '800 11px Outfit, sans-serif';
    ctx.fillText(`${goal.done ? 'OK' : `${progress}/${goal.target}`} ${goal.label}`, WIDTH - 54, 148 + index * 18);
  });

  if (game.mode === 'learn') {
    const task = LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.84)';
    drawRoundedRect(ctx, WIDTH / 2 - 280, 108, 560, 72, 18);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 20px Outfit, sans-serif';
    ctx.fillText(task.prompt, WIDTH / 2, 137);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 13px Outfit, sans-serif';
    ctx.fillText(`${task.subject} - durch das richtige Gate fahren`, WIDTH / 2, 160);
  }

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.78)';
    drawRoundedRect(ctx, WIDTH / 2 - 330, HEIGHT - 94, 660, 54, 18);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 22px Outfit, sans-serif';
    ctx.fillText(game.message, WIDTH / 2, HEIGHT - 60);
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.74)';
  drawRoundedRect(ctx, 34, HEIGHT - 36, 815, 28, 10);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 12px Outfit, sans-serif';
  ctx.fillText('WASD/Arrows fahren · Space Ollie/Grind · J Flip · K Grab · L Spin · Shift Manual · I Special · M Modus · R Restart', 54, HEIGHT - 17);
  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawPark(ctx, game);
  drawGates(ctx, game);
  drawEffects(ctx, game);
  drawPlayer(ctx, game);
  drawHud(ctx, game);
}

export default function FaskaTrickParkSwarm() {
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
    gameRef.current.input[name] = pressed;
  }, []);

  const triggerSpecial = useCallback(() => {
    activateSpecial(gameRef.current);
  }, []);

  const holdButton = useCallback((name) => ({
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;
    let raf = 0;
    let last = performance.now();
    const keyMap = new Map([
      ['w', 'up'], ['W', 'up'], ['ArrowUp', 'up'],
      ['s', 'down'], ['S', 'down'], ['ArrowDown', 'down'],
      ['a', 'left'], ['A', 'left'], ['ArrowLeft', 'left'],
      ['d', 'right'], ['D', 'right'], ['ArrowRight', 'right'],
      [' ', 'jump'],
      ['j', 'flip'], ['J', 'flip'],
      ['k', 'grab'], ['K', 'grab'],
      ['l', 'spin'], ['L', 'spin'],
      ['Shift', 'manual'],
      ['i', 'special'], ['I', 'special'],
    ]);
    const keyDown = (event) => {
      const mapped = keyMap.get(event.key);
      if (mapped) {
        gameRef.current.input[mapped] = true;
        if (mapped === 'special') activateSpecial(gameRef.current);
        event.preventDefault();
      }
      if (event.key === 'm' || event.key === 'M') setGameMode(modeRef.current === 'learn' ? 'arcade' : 'learn');
      if (event.key === 'r' || event.key === 'R') restart();
    };
    const keyUp = (event) => {
      const mapped = keyMap.get(event.key);
      if (mapped) {
        gameRef.current.input[mapped] = false;
        event.preventDefault();
      }
    };
    const blur = () => {
      Object.keys(gameRef.current.input).forEach((key) => {
        gameRef.current.input[key] = false;
      });
    };
    const loop = (now) => {
      const dt = Math.min(0.024, (now - last) / 1000 || 0);
      last = now;
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
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      window.removeEventListener('blur', blur);
    };
  }, [restart, setGameMode]);

  const chromeTop = 'max(12px, calc((100vh - min(100vh, calc(100vw * 9 / 16))) / 2 + 8px))';
  const chromeBottom = 'calc((100vh - min(100vh, calc(100vw * 9 / 16))) / 2 + 22px)';
  const touchButton = {
    width: 66,
    height: 56,
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
          boxShadow: '0 0 100px rgba(250,204,21,.14), inset 0 0 60px rgba(56,189,248,.06), 0 0 90px rgba(0,0,0,.55)',
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
        boxShadow: 'inset 0 0 150px 60px rgba(0,0,0,.45), inset 0 0 80px 30px rgba(250,204,21,.06)',
        borderRadius: 2,
      }} />

      <div style={{ position: 'fixed', top: chromeTop, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.56 }}>Normal</button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.56 }}>Learncade</button>
        <button className="btn-primary" onClick={triggerSpecial}>Special</button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      <div className="trick-touch-controls" style={{
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 58px)', gap: 7, pointerEvents: 'auto' }}>
          <span />
          <button style={touchButton} {...holdButton('up')}>UP</button>
          <span />
          <button style={touchButton} {...holdButton('left')}>LEFT</button>
          <button style={touchButton} {...holdButton('down')}>DOWN</button>
          <button style={touchButton} {...holdButton('right')}>RIGHT</button>
        </div>
        <div style={{ display: 'flex', gap: 8, pointerEvents: 'auto' }}>
          <button style={{ ...touchButton, background: 'rgba(250,204,21,.82)', color: '#111827' }} {...holdButton('jump')}>OLLIE</button>
          <button style={{ ...touchButton, background: 'rgba(14,165,233,.78)' }} {...holdButton('flip')}>FLIP</button>
          <button style={{ ...touchButton, background: 'rgba(168,85,247,.78)' }} {...holdButton('grab')}>GRAB</button>
          <button style={{ ...touchButton, background: 'rgba(250,204,21,.82)', color: '#111827' }} onPointerDown={(event) => { event.preventDefault(); triggerSpecial(); }}>SPEC</button>
          <button style={{ ...touchButton, background: 'rgba(34,197,94,.78)' }} {...holdButton('manual')}>MAN</button>
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
          <div style={{ fontSize: 24, fontWeight: 800, color: '#facc15' }}>Score {result.score} · Best Combo {result.bestCombo}</div>
          <button className="btn-primary" onClick={restart}>Neuer Run</button>
        </div>
      )}

      <style>{`
        @media (pointer: fine), (min-width: 900px) {
          .trick-touch-controls {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
