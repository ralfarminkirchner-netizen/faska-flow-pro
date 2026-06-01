import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const TABLE_X = 360;
const TABLE_Y = 44;
const TABLE_W = 560;
const TABLE_H = 640;
const LEFT_WALL = TABLE_X + 36;
const RIGHT_WALL = TABLE_X + TABLE_W - 36;
const TOP_WALL = TABLE_Y + 40;
const DRAIN_Y = TABLE_Y + TABLE_H + 44;
const GRAVITY = 820;
const MAGNET_LOCK = { x: 640, y: 282, r: 32 };

const BUMPERS = [
  { id: 'b1', x: 520, y: 230, r: 34, value: 220, color: '#22d3ee' },
  { id: 'b2', x: 640, y: 170, r: 37, value: 260, color: '#facc15' },
  { id: 'b3', x: 760, y: 230, r: 34, value: 220, color: '#fb7185' },
  { id: 'b4', x: 640, y: 340, r: 42, value: 320, color: '#a78bfa' },
];

const NORMAL_TARGETS = [
  { id: 'lane-l', label: 'L', x: 470, y: 114, w: 58, h: 34, value: 180, lit: false },
  { id: 'lane-e', label: 'E', x: 566, y: 108, w: 58, h: 34, value: 180, lit: false },
  { id: 'lane-a', label: 'A', x: 662, y: 108, w: 58, h: 34, value: 180, lit: false },
  { id: 'lane-r', label: 'R', x: 758, y: 114, w: 58, h: 34, value: 180, lit: false },
  { id: 'orbit-l', label: '2X', x: 420, y: 330, w: 48, h: 84, value: 360, lit: false },
  { id: 'orbit-r', label: 'BALL', x: 812, y: 330, w: 48, h: 84, value: 520, lit: false },
];

const SKILL_SHOT_IDS = ['lane-l', 'lane-e', 'lane-a', 'lane-r'];

const DROP_TARGETS = [
  { id: 'drop-f', label: 'F', x: 498, y: 294, w: 42, h: 54, value: 340 },
  { id: 'drop-a', label: 'A', x: 568, y: 276, w: 42, h: 54, value: 340 },
  { id: 'drop-s', label: 'S', x: 670, y: 276, w: 42, h: 54, value: 340 },
  { id: 'drop-k', label: 'K', x: 740, y: 294, w: 42, h: 54, value: 340 },
];

const RAMP_ZONES = [
  { id: 'left-ramp', label: 'Orbit', x: 404, y: 428, w: 68, h: 142, dir: -1, value: 520 },
  { id: 'right-ramp', label: 'Ramp', x: 808, y: 428, w: 68, h: 142, dir: 1, value: 620 },
];

const PINBALL_GOALS = [
  { id: 'bumper_18', label: '18 Bumper-Hits', stat: 'bumperHits', target: 18, mode: 'both', reward: 900 },
  { id: 'drops_8', label: '8 Drop-Targets', stat: 'drops', target: 8, mode: 'both', reward: 850 },
  { id: 'ramps_5', label: '5 Ramp-/Orbit-Shots', stat: 'ramps', target: 5, mode: 'both', reward: 780 },
  { id: 'locks_2', label: '2 Magnet-Locks', stat: 'locks', target: 2, mode: 'arcade', reward: 900 },
  { id: 'multiball_1', label: '1 Multiball starten', stat: 'multiballs', target: 1, mode: 'both', reward: 1200 },
  { id: 'wizard_6', label: '6 Wizard-Shots', stat: 'wizardShots', target: 6, mode: 'arcade', reward: 1350 },
  { id: 'learn_4', label: '4 Learncade-Treffer', stat: 'learnCorrect', target: 4, mode: 'learn', reward: 1200 },
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
    prompt: '9 x 6 = ?',
    answer: '54',
    options: ['45', '54', '63'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "ball"?',
    answer: 'Ball',
    options: ['Ball', 'Bett', 'Buch'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Magnete ziehen ... an.',
    answer: 'Eisen',
    options: ['Holz', 'Eisen', 'Wasser'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "hell"?',
    answer: 'Adjektiv',
    options: ['Adjektiv', 'Verb', 'Nomen'],
  },
  {
    subject: 'Mathe',
    prompt: '72 : 8 = ?',
    answer: '9',
    options: ['8', '9', '12'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welches Wort ist ein Nomen?',
    answer: 'Flipper',
    options: ['Flipper', 'schnell', 'springt'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "score"?',
    answer: 'Punkte',
    options: ['Punkte', 'Schalter', 'Fenster'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Was zieht ein Magnet an?',
    answer: 'Metall',
    options: ['Papier', 'Metall', 'Wolle'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "rollen"?',
    answer: 'Verb',
    options: ['Verb', 'Nomen', 'Adjektiv'],
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const pickSkillShot = (seed) => SKILL_SHOT_IDS[Math.abs(seed) % SKILL_SHOT_IDS.length];

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

function makeLearnTargets(taskIndex) {
  const task = LEARN_TASKS[taskIndex % LEARN_TASKS.length];
  const positions = [
    { x: 468, y: 372 },
    { x: 594, y: 424 },
    { x: 720, y: 372 },
  ];
  return task.options.map((label, index) => ({
    id: `learn-${taskIndex}-${label}`,
    label,
    correct: label === task.answer,
    x: positions[index].x,
    y: positions[index].y,
    w: 92,
    h: 44,
    value: 620,
    lit: false,
    wrong: false,
  }));
}

function makeBall(index = 0) {
  return {
    id: `ball-${Date.now()}-${index}`,
    x: RIGHT_WALL - 30,
    y: TABLE_Y + TABLE_H - 116 - index * 24,
    vx: 0,
    vy: 0,
    r: 13,
    alive: true,
    held: true,
    rampCooldown: 0,
    lockCooldown: 0,
    trail: [],
  };
}

function createStats() {
  return {
    bumperHits: 0,
    drops: 0,
    ramps: 0,
    locks: 0,
    multiballs: 0,
    wizardShots: 0,
    learnCorrect: 0,
  };
}

function createGoals(mode) {
  const weight = goal => (goal.mode === mode ? 0 : goal.mode === 'both' ? 1 : 2);
  return PINBALL_GOALS
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
  game.messageTimer = 1.15;
}

function makeInitialGame(mode = 'arcade') {
  return {
    mode,
    elapsed: 0,
    phase: 'play',
    score: 0,
    multiplier: 1,
    ballsLeft: 3,
    ballSaver: 5,
    combo: 0,
    jackpot: 1000,
    learnStreak: 0,
    tableMode: 'qualify',
    modeTimer: 0,
    modeShots: 0,
    lockedBalls: 0,
    skillShotId: pickSkillShot(0),
    skillShotActive: true,
    nudgeCooldown: 0,
    tiltMeter: 0,
    tiltLock: 0,
    taskIndex: 0,
    message: mode === 'learn' ? 'Triff das richtige Antwort-Target.' : 'Triff Lanes, Bumper und Targets fuer Multiball.',
    messageTimer: 2,
    shake: 0,
    plunger: 0,
    leftFlipper: 0,
    rightFlipper: 0,
    input: {
      left: false,
      right: false,
      launch: false,
    },
    balls: [makeBall()],
    normalTargets: NORMAL_TARGETS.map((target) => ({ ...target })),
    dropTargets: DROP_TARGETS.map((target) => ({ ...target, lit: false })),
    learnTargets: mode === 'learn' ? makeLearnTargets(0) : [],
    bumperCooldowns: {},
    rampCooldowns: {},
    stats: createStats(),
    goals: createGoals(mode),
    particles: [],
    result: null,
  };
}

function spawnParticles(game, x, y, color, count = 8) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed;
    const speed = 90 + (i % 5) * 30;
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

function addScore(game, amount, label, x = 640, y = 280) {
  const modeBoost = game.tableMode === 'wizard' ? 1.35 : game.tableMode === 'ramp-fever' ? 1.18 : 1;
  const gain = Math.round(amount * game.multiplier * modeBoost);
  game.score += gain;
  game.combo += 1;
  game.message = `${label} +${gain}`;
  game.messageTimer = 0.75;
  if (game.combo > 4 && game.multiplier < 5) {
    game.multiplier += 1;
    game.message = `Multiplier x${game.multiplier}`;
    game.messageTimer = 0.9;
  }
  spawnParticles(game, x, y, '#facc15', 10);
}

function recordWizardShot(game, label, x, y) {
  if (game.tableMode !== 'wizard') return;
  game.modeShots += 1;
  recordStat(game, 'wizardShots');
  spawnParticles(game, x, y, '#a78bfa', 8);
  if (game.modeShots >= 8) {
    addScore(game, game.jackpot * 2, `${label} Wizard Complete`, x, y);
    game.jackpot += 2200;
    game.tableMode = 'qualify';
    game.modeTimer = 0;
    game.modeShots = 0;
    game.dropTargets.forEach((target) => { target.lit = false; });
    game.normalTargets.forEach((target) => { target.lit = false; });
  }
}

function startMultiball(game, label = 'Multiball') {
  recordStat(game, 'multiballs');
  game.ballSaver = Math.max(game.ballSaver, 10);
  game.tableMode = game.mode === 'learn' ? 'learn-multiball' : 'wizard';
  game.modeTimer = game.tableMode === 'wizard' ? 28 : 18;
  game.modeShots = 0;
  game.lockedBalls = 0;
  game.message = label;
  game.messageTimer = 1.2;
  while (game.balls.length < 3) {
    const extra = makeBall(game.balls.length);
    extra.held = false;
    extra.x = 640 + (game.balls.length - 1) * 42;
    extra.y = 522;
    extra.vx = (game.balls.length % 2 === 0 ? -1 : 1) * (220 + game.balls.length * 40);
    extra.vy = -720;
    game.balls.push(extra);
  }
  game.balls.forEach((ball, index) => {
    if (ball.held) {
      ball.held = false;
      ball.x = 640 + (index - 1) * 38;
      ball.y = 532;
      ball.vx = (index - 1) * 210;
      ball.vy = -740;
    }
  });
  spawnParticles(game, 640, 286, '#a78bfa', 26);
}

function reflectBall(ball, nx, ny, boost = 1) {
  const dot = ball.vx * nx + ball.vy * ny;
  if (dot >= 0) return;
  ball.vx -= (1.82 * dot * nx);
  ball.vy -= (1.82 * dot * ny);
  ball.vx *= boost;
  ball.vy *= boost;
}

function collideCircle(game, ball, circle) {
  const dx = ball.x - circle.x;
  const dy = ball.y - circle.y;
  const len = Math.hypot(dx, dy) || 1;
  const overlap = ball.r + circle.r - len;
  if (overlap <= 0) return false;
  const nx = dx / len;
  const ny = dy / len;
  ball.x += nx * overlap;
  ball.y += ny * overlap;
  reflectBall(ball, nx, ny, 1.05);
  ball.vx += nx * 220;
  ball.vy += ny * 220;
  const key = circle.id || `${circle.x}-${circle.y}`;
  if ((game.bumperCooldowns[key] || 0) <= 0) {
    addScore(game, circle.value, circle.id?.startsWith('post') ? 'Post' : 'Bumper', circle.x, circle.y);
    if (circle.id?.startsWith('b')) {
      recordStat(game, 'bumperHits');
      recordWizardShot(game, 'Bumper', circle.x, circle.y);
    }
    game.jackpot += circle.id?.startsWith('post') ? 25 : 60;
    game.bumperCooldowns[key] = 0.18;
  }
  game.shake = 0.12;
  return true;
}

function closestPointOnSegment(px, py, ax, ay, bx, by) {
  const vx = bx - ax;
  const vy = by - ay;
  const len = vx * vx + vy * vy || 1;
  const t = clamp(((px - ax) * vx + (py - ay) * vy) / len, 0, 1);
  return { x: ax + vx * t, y: ay + vy * t, t };
}

function collideSegment(ball, ax, ay, bx, by, power = 1, active = false) {
  const nearest = closestPointOnSegment(ball.x, ball.y, ax, ay, bx, by);
  const dx = ball.x - nearest.x;
  const dy = ball.y - nearest.y;
  const len = Math.hypot(dx, dy) || 1;
  const overlap = ball.r + 8 - len;
  if (overlap <= 0) return false;
  const nx = dx / len;
  const ny = dy / len;
  ball.x += nx * overlap;
  ball.y += ny * overlap;
  reflectBall(ball, nx, ny, active ? 1.12 : 0.98);
  if (active) {
    ball.vx += (bx - ax) * 2.6 * power;
    ball.vy -= 620 * power;
  }
  return true;
}

function flipperSegment(side, amount) {
  const left = side === 'left';
  const pivot = left ? { x: 538, y: 604 } : { x: 742, y: 604 };
  const rest = left ? -0.18 : Math.PI + 0.18;
  const up = left ? -0.68 : Math.PI + 0.68;
  const angle = rest + (up - rest) * amount;
  const length = 118;
  return {
    ax: pivot.x,
    ay: pivot.y,
    bx: pivot.x + Math.cos(angle) * length,
    by: pivot.y + Math.sin(angle) * length,
  };
}

function targetHit(ball, target) {
  return ball.x + ball.r > target.x
    && ball.x - ball.r < target.x + target.w
    && ball.y + ball.r > target.y
    && ball.y - ball.r < target.y + target.h;
}

function resolveTarget(game, ball, target, learn = false) {
  if (target.lit) return;
  if (!targetHit(ball, target)) return;
  const centerX = target.x + target.w / 2;
  const centerY = target.y + target.h / 2;
  const nx = ball.x < centerX ? -1 : 1;
  ball.vx = Math.abs(ball.vx) * nx;
  ball.vy -= 120;
  target.lit = true;

  if (learn) {
    const task = LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
    if (target.correct) {
      addScore(game, target.value, `${task.subject}: ${task.answer}`, centerX, centerY);
      game.learnStreak += 1;
      game.jackpot += 450;
      game.ballSaver = Math.max(game.ballSaver, 6);
      game.taskIndex += 1;
      game.learnTargets = makeLearnTargets(game.taskIndex);
      game.multiplier = clamp(game.multiplier + 1, 1, 5);
      recordStat(game, 'learnCorrect');
      if (game.learnStreak > 0 && game.learnStreak % 3 === 0 && game.balls.length < 3) {
        startMultiball(game, 'Learn Multiball');
      }
    } else {
      target.wrong = true;
      game.combo = 0;
      game.multiplier = 1;
      game.learnStreak = 0;
      game.message = `${target.label} war falsch. Richtig: ${task.answer}`;
      game.messageTimer = 1.1;
      spawnParticles(game, centerX, centerY, '#fb7185', 12);
    }
  } else {
    addScore(game, target.value, target.label, centerX, centerY);
    if (game.skillShotActive && target.id === game.skillShotId) {
      addScore(game, 900 + game.jackpot * 0.18, 'Skill Shot', centerX, centerY);
      game.skillShotActive = false;
      game.jackpot += 700;
      game.ballSaver = Math.max(game.ballSaver, 9);
      game.multiplier = clamp(game.multiplier + 1, 1, 6);
      spawnParticles(game, centerX, centerY, '#5eead4', 18);
    } else if (target.id?.startsWith('lane-')) {
      game.skillShotActive = false;
    }
    if (target.id === 'orbit-r' && game.balls.length < 3) {
      game.balls.push(makeBall(game.balls.length));
      game.message = 'Extra Ball';
      game.messageTimer = 1;
    }
    if (game.normalTargets.filter((candidate) => candidate.id.startsWith('lane-')).every((candidate) => candidate.lit)) {
      addScore(game, game.jackpot, 'Lane Jackpot', centerX, centerY);
      game.jackpot += 1200;
      game.ballSaver = Math.max(game.ballSaver, 8);
      if (game.balls.length < 4) {
        startMultiball(game, 'Lane Multiball');
      }
      game.normalTargets.forEach((candidate) => {
        if (candidate.id.startsWith('lane-')) candidate.lit = false;
      });
      game.skillShotId = pickSkillShot(game.combo + game.ballsLeft + game.taskIndex);
      game.skillShotActive = true;
    }
    if (game.normalTargets.every((candidate) => candidate.lit)) {
      game.normalTargets.forEach((candidate) => {
        candidate.lit = false;
      });
      game.multiplier = clamp(game.multiplier + 1, 1, 5);
      game.ballSaver = Math.max(game.ballSaver, 8);
      game.message = `Table Complete x${game.multiplier}`;
      game.messageTimer = 1.1;
      game.tableMode = 'wizard';
      game.modeTimer = 30;
      game.modeShots = 0;
    }
  }
}

function resolveDropTarget(game, ball, target) {
  if (target.lit || !targetHit(ball, target)) return;
  const centerX = target.x + target.w / 2;
  const centerY = target.y + target.h / 2;
  ball.vx += ball.x < centerX ? -120 : 120;
  ball.vy -= 170;
  target.lit = true;
  addScore(game, target.value, `Drop ${target.label}`, centerX, centerY);
  recordStat(game, 'drops');
  recordWizardShot(game, 'Drop', centerX, centerY);
  if (game.dropTargets.every((candidate) => candidate.lit)) {
    addScore(game, 1250 + game.jackpot * 0.12, 'Dropbank Complete', centerX, centerY);
    game.jackpot += 900;
    game.multiplier = clamp(game.multiplier + 1, 1, 6);
    game.ballSaver = Math.max(game.ballSaver, 7);
    if (game.tableMode !== 'wizard') {
      game.tableMode = 'ramp-fever';
      game.modeTimer = 18;
      game.modeShots = 0;
    }
    game.dropTargets.forEach((candidate) => { candidate.lit = false; });
  }
}

function resolveRamp(game, ball, ramp) {
  if (ball.rampCooldown > 0) return;
  if (!targetHit(ball, ramp) || ball.vy > 210) return;
  ball.rampCooldown = 0.8;
  ball.vx += ramp.dir * 420;
  ball.vy = -Math.abs(ball.vy) - 260;
  addScore(game, ramp.value + game.jackpot * 0.04, ramp.label, ramp.x + ramp.w / 2, ramp.y + ramp.h / 2);
  recordStat(game, 'ramps');
  recordWizardShot(game, ramp.label, ramp.x + ramp.w / 2, ramp.y + ramp.h / 2);
  game.jackpot += 260;
  if (game.tableMode === 'ramp-fever') {
    game.modeShots += 1;
    if (game.modeShots >= 3) {
      startMultiball(game, 'Ramp Fever Multiball');
    }
  }
}

function resolveMagnetLock(game, ball) {
  if (ball.held || ball.lockCooldown > 0 || game.mode === 'learn') return;
  const dx = ball.x - MAGNET_LOCK.x;
  const dy = ball.y - MAGNET_LOCK.y;
  if (Math.hypot(dx, dy) > MAGNET_LOCK.r + ball.r) return;
  ball.lockCooldown = 1.2;
  game.lockedBalls += 1;
  recordStat(game, 'locks');
  addScore(game, 760 + game.lockedBalls * 220, `Magnet Lock ${game.lockedBalls}`, MAGNET_LOCK.x, MAGNET_LOCK.y);
  game.ballSaver = Math.max(game.ballSaver, 6);
  if (game.lockedBalls >= 2) {
    startMultiball(game, 'Magnet-Lock Multiball');
    return;
  }
  ball.held = true;
  ball.x = RIGHT_WALL - 30;
  ball.y = TABLE_Y + TABLE_H - 116;
  ball.vx = 0;
  ball.vy = 0;
}

function triggerNudge(game, dx, dy) {
  if (game.phase !== 'play') return false;
  if (game.tiltLock > 0) {
    game.message = 'Tilt Lock';
    game.messageTimer = 0.6;
    return false;
  }
  if (game.nudgeCooldown > 0) return false;
  const liveBalls = game.balls.filter((ball) => ball.alive && !ball.held);
  if (liveBalls.length === 0) {
    game.message = 'Nudge nach Launch';
    game.messageTimer = 0.65;
    return false;
  }
  liveBalls.forEach((ball) => {
    ball.vx += dx * 185;
    ball.vy += dy * 135;
    ball.x += dx * 5;
    ball.y += dy * 4;
  });
  game.nudgeCooldown = 0.34;
  game.tiltMeter = clamp(game.tiltMeter + 29, 0, 110);
  game.shake = 0.2;
  if (game.tiltMeter >= 100) {
    game.tiltLock = 3.2;
    game.input.left = false;
    game.input.right = false;
    game.combo = 0;
    game.multiplier = 1;
    game.message = 'TILT';
    game.messageTimer = 1;
    spawnParticles(game, 640, 570, '#fb7185', 18);
  } else {
    game.message = 'Nudge';
    game.messageTimer = 0.45;
  }
  return true;
}

function updateBall(game, ball, dt) {
  if (!ball.alive) return;
  if (ball.held) {
    ball.x = RIGHT_WALL - 30;
    ball.y = TABLE_Y + TABLE_H - 116;
    ball.trail = [];
    return;
  }
  ball.trail.unshift({ x: ball.x, y: ball.y });
  ball.trail = ball.trail.slice(0, 8);
  ball.rampCooldown = Math.max(0, ball.rampCooldown - dt);
  ball.lockCooldown = Math.max(0, ball.lockCooldown - dt);
  ball.vy += GRAVITY * dt;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  if (ball.x - ball.r < LEFT_WALL) {
    ball.x = LEFT_WALL + ball.r;
    ball.vx = Math.abs(ball.vx) * 0.88;
  }
  if (ball.x + ball.r > RIGHT_WALL) {
    ball.x = RIGHT_WALL - ball.r;
    ball.vx = -Math.abs(ball.vx) * 0.88;
  }
  if (ball.y - ball.r < TOP_WALL) {
    ball.y = TOP_WALL + ball.r;
    ball.vy = Math.abs(ball.vy) * 0.88;
  }

  const leftInlane = { ax: LEFT_WALL, ay: 498, bx: 520, by: 612 };
  const rightInlane = { ax: RIGHT_WALL, ay: 498, bx: 760, by: 612 };
  const leftPost = { id: 'post-left', x: 500, y: 578, r: 16, value: 90, color: '#67e8f9' };
  const rightPost = { id: 'post-right', x: 780, y: 578, r: 16, value: 90, color: '#67e8f9' };

  collideSegment(ball, leftInlane.ax, leftInlane.ay, leftInlane.bx, leftInlane.by, 0.8, false);
  collideSegment(ball, rightInlane.ax, rightInlane.ay, rightInlane.bx, rightInlane.by, 0.8, false);
  collideCircle(game, ball, leftPost);
  collideCircle(game, ball, rightPost);
  BUMPERS.forEach((bumper) => collideCircle(game, ball, bumper));
  game.dropTargets.forEach((target) => resolveDropTarget(game, ball, target));
  RAMP_ZONES.forEach((ramp) => resolveRamp(game, ball, ramp));
  resolveMagnetLock(game, ball);

  const leftFlipper = flipperSegment('left', game.leftFlipper);
  const rightFlipper = flipperSegment('right', game.rightFlipper);
  if (collideSegment(ball, leftFlipper.ax, leftFlipper.ay, leftFlipper.bx, leftFlipper.by, 1.05, game.input.left)) {
    if (game.input.left) addScore(game, 35, 'Flip', ball.x, ball.y);
  }
  if (collideSegment(ball, rightFlipper.ax, rightFlipper.ay, rightFlipper.bx, rightFlipper.by, 1.05, game.input.right)) {
    if (game.input.right) addScore(game, 35, 'Flip', ball.x, ball.y);
  }

  const targets = game.mode === 'learn' ? game.learnTargets : game.normalTargets;
  targets.forEach((target) => resolveTarget(game, ball, target, game.mode === 'learn'));

  const leftOutlane = ball.x < 515 && ball.y > 652;
  const rightOutlane = ball.x > 765 && ball.y > 652;
  const centerDrain = ball.x > 540 && ball.x < 740 && ball.y > 668;
  if (ball.y > DRAIN_Y || leftOutlane || rightOutlane || centerDrain) {
    if (game.ballSaver > 0) {
      ball.x = 640;
      ball.y = 540;
      ball.vx = (Math.random() - 0.5) * 180;
      ball.vy = -720;
      game.message = 'Ball Save';
      game.messageTimer = 0.8;
      spawnParticles(game, ball.x, ball.y, '#5eead4', 12);
    } else {
      ball.alive = false;
      game.combo = 0;
      game.multiplier = 1;
      game.skillShotActive = true;
      game.skillShotId = pickSkillShot(game.ballsLeft + game.taskIndex + game.score);
      spawnParticles(game, ball.x, Math.min(ball.y, HEIGHT - 40), '#fb7185', 12);
    }
  }
}

function launchIfNeeded(game, dt) {
  const ball = game.balls.find((candidate) => candidate.alive && candidate.held);
  if (!ball) {
    game.plunger = Math.max(0, game.plunger - dt * 2.8);
    return;
  }
  if (game.input.launch) {
    game.plunger = clamp(game.plunger + dt * 1.25, 0, 1);
    return;
  }
  if (game.plunger > 0.08) {
    ball.held = false;
    ball.vy = -740 - game.plunger * 520;
    ball.vx = -70 - game.plunger * 150;
    game.skillShotActive = true;
    game.skillShotId = pickSkillShot(Math.round(game.plunger * 10) + game.taskIndex + game.ballsLeft);
    game.plunger = 0;
    game.message = 'Launch';
    game.messageTimer = 0.6;
    spawnParticles(game, ball.x, ball.y, '#facc15', 10);
    return;
  }
  game.plunger = Math.max(0, game.plunger - dt * 2.8);
}

function updateGame(game, dt, onFinish) {
  if (game.phase !== 'play') return;
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.shake = Math.max(0, game.shake - dt);
  game.ballSaver = Math.max(0, game.ballSaver - dt);
  game.nudgeCooldown = Math.max(0, game.nudgeCooldown - dt);
  game.tiltMeter = Math.max(0, game.tiltMeter - dt * 13);
  game.tiltLock = Math.max(0, game.tiltLock - dt);
  game.modeTimer = Math.max(0, game.modeTimer - dt);
  if (game.modeTimer <= 0 && (game.tableMode === 'wizard' || game.tableMode === 'ramp-fever' || game.tableMode === 'learn-multiball')) {
    game.tableMode = 'qualify';
    game.modeShots = 0;
  }
  Object.keys(game.bumperCooldowns).forEach((key) => {
    game.bumperCooldowns[key] = Math.max(0, game.bumperCooldowns[key] - dt);
  });
  const flipperAllowed = game.tiltLock <= 0;
  game.leftFlipper += (((flipperAllowed && game.input.left) ? 1 : 0) - game.leftFlipper) * 0.36;
  game.rightFlipper += (((flipperAllowed && game.input.right) ? 1 : 0) - game.rightFlipper) * 0.36;
  launchIfNeeded(game, dt);
  game.balls.forEach((ball) => updateBall(game, ball, dt));
  game.balls = game.balls.filter((ball) => ball.alive);
  if (game.balls.length === 0) {
    game.ballsLeft -= 1;
    if (game.ballsLeft <= 0) {
      game.phase = 'result';
      game.result = { title: 'Game Over', score: game.score };
      onFinish(game.result);
      return;
    }
    game.balls = [makeBall()];
    game.ballSaver = 5;
    game.message = `Ball ${4 - game.ballsLeft}`;
    game.messageTimer = 0.8;
  }
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
}

function drawTable(ctx, game) {
  const shake = game.shake > 0 ? Math.sin(game.elapsed * 90) * game.shake * 14 : 0;
  ctx.save();
  ctx.translate(shake, 0);
  const bg = ctx.createLinearGradient(TABLE_X, TABLE_Y, TABLE_X + TABLE_W, TABLE_Y + TABLE_H);
  bg.addColorStop(0, '#0f172a');
  bg.addColorStop(0.58, '#17345a');
  bg.addColorStop(1, '#07111f');
  ctx.fillStyle = bg;
  drawRoundedRect(ctx, TABLE_X, TABLE_Y, TABLE_W, TABLE_H, 32);
  ctx.fill();
  ctx.strokeStyle = '#67e8f9';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = 'rgba(15,23,42,.72)';
  drawRoundedRect(ctx, RIGHT_WALL - 50, TABLE_Y + 112, 44, TABLE_H - 158, 18);
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.stroke();
  if (game.plunger > 0) {
    const chargeH = game.plunger * 190;
    ctx.fillStyle = '#facc15';
    drawRoundedRect(ctx, RIGHT_WALL - 42, TABLE_Y + TABLE_H - 76 - chargeH, 28, chargeH, 12);
    ctx.fill();
  }

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 11;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(LEFT_WALL, 498);
  ctx.lineTo(520, 612);
  ctx.moveTo(RIGHT_WALL, 498);
  ctx.lineTo(760, 612);
  ctx.stroke();

  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.moveTo(520, 654);
  ctx.lineTo(640, 700);
  ctx.lineTo(760, 654);
  ctx.lineTo(725, 684);
  ctx.lineTo(555, 684);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawBumpers(ctx) {
  BUMPERS.forEach((bumper) => {
    ctx.save();
    ctx.shadowColor = bumper.color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = bumper.color;
    ctx.beginPath();
    ctx.arc(bumper.x, bumper.y, bumper.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'rgba(2,6,23,.7)';
    ctx.beginPath();
    ctx.arc(bumper.x, bumper.y, bumper.r * 0.48, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawModesAndMechanics(ctx, game) {
  RAMP_ZONES.forEach((ramp) => {
    ctx.save();
    ctx.globalAlpha = game.tableMode === 'ramp-fever' || game.tableMode === 'wizard' ? 0.92 : 0.62;
    ctx.shadowColor = ramp.id === 'left-ramp' ? '#22d3ee' : '#facc15';
    ctx.shadowBlur = game.tableMode === 'ramp-fever' ? 26 : 12;
    ctx.strokeStyle = ramp.id === 'left-ramp' ? '#22d3ee' : '#facc15';
    ctx.lineWidth = 7;
    drawRoundedRect(ctx, ramp.x, ramp.y, ramp.w, ramp.h, 22);
    ctx.stroke();
    ctx.fillStyle = 'rgba(2,6,23,.62)';
    drawRoundedRect(ctx, ramp.x + 10, ramp.y + ramp.h / 2 - 18, ramp.w - 20, 36, 12);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ramp.label, ramp.x + ramp.w / 2, ramp.y + ramp.h / 2 + 4);
    ctx.restore();
  });

  ctx.save();
  ctx.shadowColor = game.lockedBalls > 0 || game.tableMode === 'wizard' ? '#a78bfa' : '#64748b';
  ctx.shadowBlur = game.lockedBalls > 0 ? 28 : 14;
  ctx.strokeStyle = game.lockedBalls > 0 ? '#c4b5fd' : '#818cf8';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(MAGNET_LOCK.x, MAGNET_LOCK.y, MAGNET_LOCK.r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(49,46,129,.68)';
  ctx.beginPath();
  ctx.arc(MAGNET_LOCK.x, MAGNET_LOCK.y, MAGNET_LOCK.r * 0.68, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 10px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`LOCK ${game.lockedBalls}/2`, MAGNET_LOCK.x, MAGNET_LOCK.y + 4);
  ctx.restore();

  game.dropTargets.forEach((target) => {
    ctx.save();
    ctx.shadowColor = target.lit ? '#facc15' : '#fb7185';
    ctx.shadowBlur = target.lit ? 18 : 8;
    ctx.fillStyle = target.lit ? '#facc15' : 'rgba(185,28,28,.88)';
    drawRoundedRect(ctx, target.x, target.y, target.w, target.h, 9);
    ctx.fill();
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = target.lit ? '#111827' : '#f8fafc';
    ctx.font = '900 17px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(target.label, target.x + target.w / 2, target.y + target.h / 2);
    ctx.restore();
  });
}

function drawTargets(ctx, game) {
  const targets = game.mode === 'learn' ? game.learnTargets : game.normalTargets;
  targets.forEach((target) => {
    const skillTarget = game.mode !== 'learn' && game.skillShotActive && target.id === game.skillShotId;
    ctx.save();
    ctx.shadowColor = target.wrong ? '#fb7185' : skillTarget ? '#5eead4' : game.mode === 'learn' && target.correct ? '#5eead4' : target.lit ? '#facc15' : '#818cf8';
    ctx.shadowBlur = skillTarget ? 28 : target.lit || game.mode === 'learn' ? 18 : 8;
    ctx.fillStyle = target.lit
      ? target.wrong ? '#ef4444' : '#facc15'
      : skillTarget ? 'rgba(20,184,166,.9)'
      : game.mode === 'learn' && target.correct ? 'rgba(20,184,166,.82)' : 'rgba(79,70,229,.8)';
    drawRoundedRect(ctx, target.x, target.y, target.w, target.h, 12);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = skillTarget ? '#fef3c7' : '#e0f2fe';
    ctx.lineWidth = skillTarget ? 5 : 3;
    ctx.stroke();
    ctx.fillStyle = target.lit && !target.wrong ? '#111827' : '#f8fafc';
    ctx.font = '900 14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(target.label, target.x + target.w / 2, target.y + target.h / 2);
    if (skillTarget) {
      ctx.fillStyle = '#fef3c7';
      ctx.font = '900 8px Outfit, sans-serif';
      ctx.fillText('SKILL', target.x + target.w / 2, target.y - 8);
    }
    ctx.restore();
  });
}

function drawFlippers(ctx, game) {
  const left = flipperSegment('left', game.leftFlipper);
  const right = flipperSegment('right', game.rightFlipper);
  [
    { ...left, active: game.input.left },
    { ...right, active: game.input.right },
  ].forEach((flipper) => {
    ctx.save();
    ctx.strokeStyle = flipper.active ? '#facc15' : '#e2e8f0';
    ctx.shadowColor = flipper.active ? '#facc15' : '#38bdf8';
    ctx.shadowBlur = flipper.active ? 18 : 9;
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(flipper.ax, flipper.ay);
    ctx.lineTo(flipper.bx, flipper.by);
    ctx.stroke();
    ctx.restore();
  });
}

function drawBalls(ctx, game) {
  game.balls.forEach((ball) => {
    ball.trail.forEach((point, index) => {
      ctx.save();
      ctx.globalAlpha = (ball.trail.length - index) / ball.trail.length * 0.28;
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath();
      ctx.arc(point.x, point.y, ball.r * (1 - index * 0.06), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    ctx.save();
    ctx.shadowColor = '#f8fafc';
    ctx.shadowBlur = 16;
    const grad = ctx.createRadialGradient(ball.x - 4, ball.y - 5, 2, ball.x, ball.y, ball.r);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
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

function drawHud(ctx, game) {
  const modeLabel = game.tableMode === 'wizard'
    ? `Wizard ${game.modeShots}/8 · ${Math.ceil(game.modeTimer)}s`
    : game.tableMode === 'ramp-fever'
      ? `Ramp Fever ${game.modeShots}/3 · ${Math.ceil(game.modeTimer)}s`
      : game.tableMode === 'learn-multiball'
        ? `Learn Multiball · ${Math.ceil(game.modeTimer)}s`
        : `Locks ${game.lockedBalls}/2 · Jackpot ${game.jackpot}`;
  ctx.save();
  ctx.fillStyle = '#020617';
  drawRoundedRect(ctx, 28, 22, 352, 174, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 25px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Learncade Pinball Pro' : 'Faska Pinball Pro', 52, 58);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText(`Score ${game.score}`, 52, 88);
  ctx.fillStyle = '#67e8f9';
  ctx.fillText(`Ball ${4 - game.ballsLeft}/3 · x${game.multiplier} · Save ${Math.ceil(game.ballSaver)}`, 52, 116);
  ctx.fillStyle = '#a7f3d0';
  ctx.font = '800 12px Outfit, sans-serif';
  const skillLabel = game.skillShotId?.replace('lane-', '').toUpperCase();
  ctx.fillText(game.mode === 'learn' ? `Streak ${game.learnStreak} · Jackpot ${game.jackpot}` : `Skill ${game.skillShotActive ? skillLabel : '-'} · Jackpot ${game.jackpot}`, 52, 142);
  ctx.fillStyle = game.tableMode === 'wizard' ? '#c4b5fd' : '#facc15';
  ctx.fillText(modeLabel, 52, 166);

  if (game.mode === 'learn') {
    const task = LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
    ctx.fillStyle = '#020617';
    drawRoundedRect(ctx, 464, 82, 420, 78, 18);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '900 18px Outfit, sans-serif';
    ctx.fillText(task.prompt, 674, 112);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 14px Outfit, sans-serif';
    ctx.fillText(`${task.subject} · Ball ins richtige Target`, 674, 138);
  }

  ctx.textAlign = 'right';
  ctx.fillStyle = '#020617';
  drawRoundedRect(ctx, WIDTH - 354, 22, 326, 218, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 23px Outfit, sans-serif';
  ctx.fillText(`${game.balls.length} Ball${game.balls.length === 1 ? '' : 's'}`, WIDTH - 52, 58);
  ctx.fillStyle = '#a7f3d0';
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText(`Combo ${game.combo}`, WIDTH - 52, 88);
  ctx.fillStyle = game.tiltLock > 0 ? '#fb7185' : '#cbd5e1';
  ctx.font = '900 13px Outfit, sans-serif';
  ctx.fillText(game.tiltLock > 0 ? `TILT ${game.tiltLock.toFixed(1)}s` : `Tilt ${Math.round(game.tiltMeter)}% · Nudge ${game.nudgeCooldown > 0 ? 'wait' : 'ready'}`, WIDTH - 52, 118);
  ctx.fillStyle = '#93c5fd';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText('MISSIONEN', WIDTH - 52, 148);
  game.goals.slice(0, 5).forEach((goal, index) => {
    const progress = Math.min(game.stats[goal.stat] || 0, goal.target);
    const y = 171 + index * 14;
    ctx.textAlign = 'left';
    ctx.fillStyle = goal.completed ? '#bbf7d0' : '#e2e8f0';
    ctx.fillText(goal.label, WIDTH - 330, y);
    ctx.textAlign = 'right';
    ctx.fillText(`${progress}/${goal.target}`, WIDTH - 52, y);
  });

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.78)';
    drawRoundedRect(ctx, WIDTH / 2 - 260, HEIGHT - 86, 520, 52, 16);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 23px Outfit, sans-serif';
    ctx.fillText(game.message, WIDTH / 2, HEIGHT - 52);
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.76)';
  drawRoundedRect(ctx, 34, HEIGHT - 38, 890, 28, 10);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 12px Outfit, sans-serif';
  ctx.fillText('A/← linker Flipper · D/→ rechter Flipper · Space Launcher · Q/W/E Nudge · M Modus · R Restart', 54, HEIGHT - 19);
  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bg.addColorStop(0, '#07111f');
  bg.addColorStop(0.5, '#10284a');
  bg.addColorStop(1, '#050816');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawTable(ctx, game);
  drawModesAndMechanics(ctx, game);
  drawTargets(ctx, game);
  drawBumpers(ctx, game);
  drawFlippers(ctx, game);
  drawBalls(ctx, game);
  drawParticles(ctx, game);
  drawHud(ctx, game);
}

export default function FaskaPinballSwarm() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameRef = useRef(makeInitialGame('arcade'));
  const modeRef = useRef('arcade');
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
    if (name === 'launch' && !pressed && gameRef.current.plunger <= 0.08) {
      gameRef.current.plunger = 0.22;
    }
    gameRef.current.input[name] = pressed;
  }, []);

  const nudgeCurrent = useCallback((dx = 0, dy = -1) => {
    triggerNudge(gameRef.current, dx, dy);
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
      ['ArrowLeft', 'left'], ['a', 'left'], ['A', 'left'],
      ['ArrowRight', 'right'], ['d', 'right'], ['D', 'right'],
      [' ', 'launch'], ['Space', 'launch'], ['Spacebar', 'launch'],
    ]);
    const keyDown = (event) => {
      const mapped = keyMap.get(event.key);
      if (mapped) {
        gameRef.current.input[mapped] = true;
        event.preventDefault();
      }
      if (event.key === 'q' || event.key === 'Q') {
        nudgeCurrent(-1, -0.1);
        event.preventDefault();
      }
      if (event.key === 'w' || event.key === 'W' || event.key === 'ArrowUp') {
        nudgeCurrent(0, -1);
        event.preventDefault();
      }
      if (event.key === 'e' || event.key === 'E') {
        nudgeCurrent(1, -0.1);
        event.preventDefault();
      }
      if (event.key === 'm' || event.key === 'M') setGameMode(modeRef.current === 'learn' ? 'arcade' : 'learn');
      if (event.key === 'r' || event.key === 'R') restart();
    };
    const keyUp = (event) => {
      const mapped = keyMap.get(event.key);
      if (mapped) {
        if (mapped === 'launch' && gameRef.current.plunger <= 0.08) {
          gameRef.current.plunger = 0.22;
        }
        gameRef.current.input[mapped] = false;
        event.preventDefault();
      }
    };
    const loop = (now) => {
      const dt = Math.min(0.02, (now - last) / 1000 || 0);
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
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
    };
  }, [nudgeCurrent, restart, setGameMode]);

  const canvasTopChrome = 'max(12px, calc((100vh - min(100vh, calc(100vw * 9 / 16))) / 2 - 62px))';
  const canvasBottomChrome = 'calc((100vh - min(100vh, calc(100vw * 9 / 16))) / 2 + 24px)';
  const buttonStyle = {
    width: 88,
    height: 64,
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,.2)',
    background: 'rgba(15,23,42,.78)',
    color: '#f8fafc',
    font: '900 13px Outfit, sans-serif',
    touchAction: 'none',
    userSelect: 'none',
    boxShadow: '0 12px 32px rgba(0,0,0,.32)',
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

      <div style={{ position: 'fixed', top: canvasTopChrome, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.55 }}>
          Normal
        </button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.55 }}>
          Learncade
        </button>
        <button className="btn-primary" onClick={() => nudgeCurrent(0, -1)}>Nudge</button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      <div className="pinball-touch-controls" style={{
        position: 'fixed', left: 28, right: 28, bottom: canvasBottomChrome, zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', touchAction: 'none',
      }}>
        <button aria-label="Linker Flipper" style={{ ...buttonStyle, width: 132, height: 82 }} {...holdButton('left')}>LEFT</button>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <button aria-label="Nudge" style={{ ...buttonStyle, width: 92, height: 66 }} onPointerDown={(event) => { event.preventDefault(); nudgeCurrent(0, -1); }}>NUDGE</button>
          <button aria-label="Launcher" style={{ ...buttonStyle, width: 112, height: 72, background: 'rgba(250,204,21,.84)', color: '#111827' }} {...holdButton('launch')}>LAUNCH</button>
        </div>
        <button aria-label="Rechter Flipper" style={{ ...buttonStyle, width: 132, height: 82 }} {...holdButton('right')}>RIGHT</button>
      </div>

      {result && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2,6,23,.78)', zIndex: 20, flexDirection: 'column', gap: 16,
        }}>
          <div style={{ fontSize: 54, fontWeight: 900, color: '#f8fafc' }}>{result.title}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#facc15' }}>Score {result.score}</div>
          <button className="btn-primary" onClick={restart}>Neue Runde</button>
        </div>
      )}

      <style>{`
        @media (pointer: fine), (min-width: 900px) {
          .pinball-touch-controls {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
