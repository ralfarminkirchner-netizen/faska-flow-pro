import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const CENTER_X = WIDTH / 2;
const HORIZON = 170;
const LOOKAHEAD = 7800;
const STRIPS = 76;
const STRIP_LENGTH = LOOKAHEAD / STRIPS;
const MAX_SPEED = 920;
const STAGE_LENGTH = 94000;
const CHECKPOINTS = [16500, 33000, 50500, 69000, 84500];
const GEAR_LIMITS = [0, 245, 420, 595, 770, MAX_SPEED + 180];
const GEAR_TORQUE = [0, 1.2, 1.08, 0.98, 0.9, 0.82];

const STAGE_EVENT_BLUEPRINTS = [
  { type: 'apex', distance: 6200, lane: -0.58, label: 'APEX L' },
  { type: 'nitro', distance: 9300, lane: 0.56, label: 'NITRO' },
  { type: 'hazard', distance: 12700, lane: 0, label: 'FELS' },
  { type: 'hairpin', distance: 15100, lane: -0.64, label: 'HAIRPIN L' },
  { type: 'jump', distance: 18400, lane: 0.2, label: 'SPRUNG' },
  { type: 'apex', distance: 22100, lane: 0.62, label: 'APEX R' },
  { type: 'water', distance: 24600, lane: 0.12, label: 'WASSER' },
  { type: 'repair', distance: 27600, lane: -0.54, label: 'SERVICE' },
  { type: 'hazard', distance: 31800, lane: -0.42, label: 'BAUM' },
  { type: 'nitro', distance: 35600, lane: 0.18, label: 'NITRO' },
  { type: 'apex', distance: 40700, lane: -0.62, label: 'APEX L' },
  { type: 'hairpin', distance: 43900, lane: 0.66, label: 'HAIRPIN R' },
  { type: 'jump', distance: 46900, lane: 0, label: 'CREST' },
  { type: 'hazard', distance: 52200, lane: 0.52, label: 'EIS' },
  { type: 'apex', distance: 57300, lane: 0.58, label: 'APEX R' },
  { type: 'repair', distance: 62800, lane: 0, label: 'SERVICE' },
  { type: 'nitro', distance: 67600, lane: -0.56, label: 'NITRO' },
  { type: 'water', distance: 70500, lane: 0.38, label: 'MATSCH' },
  { type: 'hazard', distance: 73600, lane: -0.12, label: 'FURCHE' },
  { type: 'apex', distance: 79100, lane: -0.6, label: 'APEX L' },
  { type: 'jump', distance: 84300, lane: 0.48, label: 'FINAL JUMP' },
  { type: 'apex', distance: 88900, lane: 0.58, label: 'APEX R' },
  { type: 'hairpin', distance: 91400, lane: -0.58, label: 'FINAL HAIRPIN' },
];

const RALLY_GOALS = [
  { id: 'apex-5', label: '5 Apex-Treffer', type: 'apexes', target: 5, reward: 900 },
  { id: 'drift-6', label: '6 Drift-Boosts', type: 'drifts', target: 6, reward: 820 },
  { id: 'super-2', label: '2 Super-Drifts', type: 'superDrifts', target: 2, reward: 760 },
  { id: 'overtake-5', label: '5 Ueberholungen', type: 'overtakes', target: 5, reward: 860 },
  { id: 'hairpin-3', label: '3 Hairpins', type: 'hairpins', target: 3, reward: 820 },
  { id: 'shift-5', label: '5 perfekte Schaltpunkte', type: 'perfectShifts', target: 5, reward: 780 },
  { id: 'draft-3', label: '3 Windschatten-Boosts', type: 'drafts', target: 3, reward: 760 },
  { id: 'champion-1', label: 'Champion ueberholen', type: 'championPasses', target: 1, reward: 1200 },
  { id: 'hazard-4', label: '4 Hazards meiden', type: 'hazardsAvoided', target: 4, reward: 640 },
  { id: 'checkpoint-3', label: '3 Splits erreichen', type: 'checkpoints', target: 3, reward: 720 },
  { id: 'learn-5', label: '5 Antwort-Gates', type: 'learnCorrect', target: 5, reward: 920, mode: 'learn' },
  { id: 'line-6', label: '6 Ideallinien', type: 'lineGates', target: 6, reward: 740, mode: 'arcade' },
];

const RALLY_CONTRACTS = [
  { id: 'apex-2', label: '2 Apex sauber treffen', type: 'apexes', target: 2, duration: 34, reward: { score: 420, nitro: 18, time: 2 } },
  { id: 'drift-2', label: '2 Drift-Boosts setzen', type: 'drifts', target: 2, duration: 36, reward: { score: 390, nitro: 22 } },
  { id: 'super-drift-1', label: '1 Super-Drift laden', type: 'superDrifts', target: 1, duration: 44, reward: { score: 520, nitro: 26, time: 1.5 } },
  { id: 'overtake-2', label: '2 Rivalen ueberholen', type: 'overtakes', target: 2, duration: 42, reward: { score: 460, nitro: 14, damage: -4 } },
  { id: 'hairpin-1', label: '1 Hairpin mit Handbremse', type: 'hairpins', target: 1, duration: 48, reward: { score: 500, nitro: 24, damage: -5 } },
  { id: 'shift-2', label: '2 perfekte Schaltpunkte', type: 'perfectShifts', target: 2, duration: 38, reward: { score: 430, nitro: 16 } },
  { id: 'draft-1', label: '1 Windschatten-Boost', type: 'drafts', target: 1, duration: 46, reward: { score: 470, nitro: 18, time: 1.5 } },
  { id: 'hazard-2', label: '2 Gefahren sauber meiden', type: 'hazardsAvoided', target: 2, duration: 50, reward: { score: 410, damage: -7, time: 1 } },
  { id: 'checkpoint-1', label: '1 Split erreichen', type: 'checkpoints', target: 1, duration: 58, reward: { score: 480, time: 2.5, damage: -3 } },
  { id: 'learn-1', label: '1 Antwort-Gate richtig', type: 'learnCorrect', target: 1, duration: 48, reward: { score: 520, nitro: 20, time: 2, damage: -3 }, learnOnly: true },
];

const COURSE_ZONES = [
  { from: 0, to: 14500, name: 'Tarmac Sprint', surface: 'Asphalt', grip: 1, road: '#334155', shoulder: '#92400e', sky: '#0e7490' },
  { from: 14500, to: 29500, name: 'Forest Gravel', surface: 'Schotter', grip: 0.78, road: '#4b5563', shoulder: '#713f12', sky: '#166534' },
  { from: 29500, to: 46500, name: 'Rain Ridge', surface: 'Nass', grip: 0.68, road: '#334155', shoulder: '#1e3a8a', sky: '#155e75' },
  { from: 46500, to: 63500, name: 'Snow Crest', surface: 'Schnee', grip: 0.56, road: '#cbd5e1', shoulder: '#64748b', sky: '#0369a1' },
  { from: 63500, to: 80500, name: 'Canyon Dirt', surface: 'Lehm', grip: 0.72, road: '#78350f', shoulder: '#451a03', sky: '#b45309' },
  { from: 80500, to: STAGE_LENGTH + 2000, name: 'Finale Asphalt', surface: 'Asphalt', grip: 1.02, road: '#303846', shoulder: '#7c2d12', sky: '#7c3aed' },
];

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "flitzt"?',
    answer: 'Verb',
    options: ['Nomen', 'Verb', 'Adjektiv'],
  },
  {
    subject: 'Mathe',
    prompt: '7 + 6 = ?',
    answer: '13',
    options: ['12', '13', '14'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Wasser gefriert bei ...',
    answer: '0 C',
    options: ['0 C', '20 C', '100 C'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "bridge"?',
    answer: 'Bruecke',
    options: ['Bruecke', 'Baum', 'Wolke'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "schnell"?',
    answer: 'Adjektiv',
    options: ['Verb', 'Nomen', 'Adjektiv'],
  },
  {
    subject: 'Mathe',
    prompt: '3 x 8 = ?',
    answer: '24',
    options: ['21', '24', '28'],
  },
];

const CAR_COLORS = ['#ef4444', '#22d3ee', '#f97316', '#a855f7', '#22c55e'];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;

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

function roadCurveAt(distance) {
  return Math.sin(distance * 0.00012) * 0.86 + Math.sin(distance * 0.000047 + 1.2) * 0.58;
}

function hillAt(distance) {
  return Math.sin(distance * 0.000085 + 0.6) * 36 + Math.sin(distance * 0.00019) * 18;
}

function zoneAt(distance) {
  return COURSE_ZONES.find((zone) => distance >= zone.from && distance < zone.to) || COURSE_ZONES[COURSE_ZONES.length - 1];
}

function paceNoteAt(distance) {
  const nearCurve = roadCurveAt(distance + 1000);
  const farCurve = roadCurveAt(distance + 2800);
  const curve = Math.abs(farCurve) > Math.abs(nearCurve) ? farCurve : nearCurve;
  const strength = Math.abs(curve);
  const direction = curve >= 0 ? 'rechts' : 'links';
  const turn = strength > 1.12 ? 'Haarnadel' : strength > 0.78 ? 'scharf' : strength > 0.42 ? 'mittel' : 'leicht';
  const crest = Math.abs(hillAt(distance + 1800) - hillAt(distance + 3200)) > 32 ? ' ueber Kuppe' : '';
  const zone = zoneAt(distance + 1800);
  return `${turn} ${direction}${crest} · ${zone.surface}`;
}

function laneIndex(lane) {
  if (lane < -0.34) return 0;
  if (lane > 0.34) return 2;
  return 1;
}

function laneName(index) {
  if (index === 0) return 'links';
  if (index === 2) return 'rechts';
  return 'mitte';
}

function makeRallyStats() {
  return {
    apexes: 0,
    drifts: 0,
    superDrifts: 0,
    overtakes: 0,
    hairpins: 0,
    perfectShifts: 0,
    drafts: 0,
    championPasses: 0,
    hazardsAvoided: 0,
    checkpoints: 0,
    learnCorrect: 0,
    lineGates: 0,
    jumps: 0,
    nitroPickups: 0,
    repairs: 0,
  };
}

function makeRallyGoals(mode) {
  return RALLY_GOALS
    .filter((goal) => !goal.mode || goal.mode === mode)
    .sort((a, b) => Number(b.mode === mode) - Number(a.mode === mode))
    .map((goal) => ({ ...goal, progress: 0, done: false }));
}

function buildStageEvents() {
  return STAGE_EVENT_BLUEPRINTS.map((event, index) => ({
    ...event,
    id: `stage-event-${index}`,
    active: true,
  }));
}

function recordGoal(game, type, amount = 1) {
  game.stats[type] = (game.stats[type] || 0) + amount;
  game.goals.forEach((goal) => {
    goal.progress = Math.min(goal.target, game.stats[goal.type] || 0);
    if (!goal.done && goal.progress >= goal.target) {
      goal.done = true;
      game.score += goal.reward;
      game.message = `${goal.label} +${goal.reward}`;
      game.messageTimer = 1.25;
      addFloater(game, CENTER_X, 210, `Meisterung +${goal.reward}`, '#fde68a');
    }
  });
}

function availableRallyContracts(mode) {
  return RALLY_CONTRACTS.filter((contract) => mode === 'learn' || !contract.learnOnly);
}

function rallyContractProgress(game) {
  if (!game.activeContract) return 0;
  const current = game.stats[game.activeContract.type] || 0;
  return clamp(current - game.activeContract.startValue, 0, game.activeContract.target);
}

function applyRallyReward(game, reward = {}) {
  if (reward.score) game.score += reward.score;
  if (reward.nitro) game.nitro = clamp(game.nitro + reward.nitro, 0, 100);
  if (reward.time) game.timeLeft = clamp(game.timeLeft + reward.time, 0, 165);
  if (reward.damage) game.damage = clamp(game.damage + reward.damage, 0, 100);
  if (reward.speed) game.speed = clamp(game.speed + reward.speed, 0, MAX_SPEED + 180);
  game.combo = clamp(game.combo + 0.18, 1, 5);
  game.bestCombo = Math.max(game.bestCombo, game.combo);
}

function startRallyContract(game) {
  const contracts = availableRallyContracts(game.mode);
  if (!contracts.length) return;
  const template = contracts[game.contractIndex % contracts.length];
  game.contractIndex += 1;
  game.activeContract = {
    ...template,
    startValue: game.stats[template.type] || 0,
  };
  game.contractTimer = template.duration;
  game.message = `Auftrag: ${template.label}`;
  game.messageTimer = 1.1;
  addFloater(game, CENTER_X, 190, 'ETAPPEN-AUFTRAG', '#bae6fd');
}

function completeRallyContract(game) {
  const contract = game.activeContract;
  if (!contract) return;
  applyRallyReward(game, contract.reward);
  game.contractMedals += 1;
  game.activeContract = null;
  game.contractTimer = 0;
  game.contractCooldown = 3.4;
  game.message = `Auftrag geschafft: ${contract.label}`;
  game.messageTimer = 1.25;
  addFloater(game, CENTER_X, 206, `Auftrag +${contract.reward.score || 0}`, '#fde68a');
  spawnParticles(game, CENTER_X, HEIGHT - 120, '#facc15', 18);
}

function failRallyContract(game) {
  const contract = game.activeContract;
  if (!contract) return;
  game.contractFails += 1;
  game.activeContract = null;
  game.contractTimer = 0;
  game.contractCooldown = 3.8;
  game.damage = clamp(game.damage + 3, 0, 100);
  game.combo = 1;
  game.message = `Auftrag verpasst: ${contract.label}`;
  game.messageTimer = 1.05;
  addFloater(game, CENTER_X, 206, 'Auftrag verpasst', '#fecaca');
}

function updateRallyContract(game, dt) {
  if (game.phase !== 'race') return;

  if (!game.activeContract) {
    game.contractCooldown = Math.max(0, game.contractCooldown - dt);
    if (game.contractCooldown <= 0) startRallyContract(game);
    return;
  }

  game.contractTimer = Math.max(0, game.contractTimer - dt);
  if (rallyContractProgress(game) >= game.activeContract.target) {
    completeRallyContract(game);
  } else if (game.contractTimer <= 0) {
    failRallyContract(game);
  }
}

function buildGates(mode) {
  const gates = [];
  for (let index = 0; index < 13; index += 1) {
    const distance = 4700 + index * 6400;
    if (mode === 'learn') {
      const task = LEARN_TASKS[index % LEARN_TASKS.length];
      gates.push({
        id: `learn-${index}`,
        distance,
        mode,
        subject: task.subject,
        prompt: task.prompt,
        answer: task.answer,
        options: task.options,
        targetIndex: task.options.indexOf(task.answer),
        active: true,
      });
    } else {
      const targetIndex = index % 3;
      gates.push({
        id: `sector-${index}`,
        distance,
        mode,
        subject: 'Rally',
        prompt: `Sektor ${index + 1}: saubere ${laneName(targetIndex)}e Linie`,
        answer: laneName(targetIndex),
        options: ['Links', 'Mitte', 'Rechts'],
        targetIndex,
        active: true,
      });
    }
  }
  return gates;
}

function makeRivals() {
  return Array.from({ length: 7 }, (_, index) => ({
    id: `rival-${index}`,
    distance: index === 6 ? 7600 : 2300 + index * 4100,
    lane: [-0.58, 0, 0.56, -0.18, 0.22, -0.72, 0.7][index],
    speed: index === 6 ? 710 : 520 + index * 24,
    color: index === 6 ? '#facc15' : CAR_COLORS[index % CAR_COLORS.length],
    wobble: index * 1.8,
    hitTimer: 0,
    draftTimer: 0,
    passed: false,
    champion: index === 6,
  }));
}

function makeInitialGame(mode = 'arcade') {
  return {
    mode,
    elapsed: 0,
    phase: 'race',
    distance: 0,
    speed: 0,
    gear: 1,
    rpm: 0,
    shiftCooldown: 0,
    perfectShiftTimer: 0,
    lane: 0,
    steerVisual: 0,
    drift: 0,
    handbrake: 0,
    traction: 1,
    draft: 0,
    nitro: 55,
    damage: 0,
    timeLeft: mode === 'learn' ? 132 : 118,
    checkpointIndex: 0,
    currentSplitStart: 0,
    lastSplit: null,
    splitTimes: [],
    paceNote: paceNoteAt(0),
    rank: 8,
    overtakes: 0,
    cleanGates: 0,
    mistakes: 0,
    score: 0,
    combo: 1,
    bestCombo: 1,
    sector: 1,
    driftCharge: 0,
    wasDrifting: false,
    driftReleaseTimer: 0,
    driftReleaseText: '',
    bestSpeed: 0,
    message: mode === 'learn' ? 'Lenke durch die richtige Antwortspur.' : 'Fahre saubere Sektoren und ueberhole Rivalen.',
    messageTimer: 2,
    screenShake: 0,
    particles: [],
    gates: buildGates(mode),
    stageEvents: buildStageEvents(),
    goals: makeRallyGoals(mode),
    stats: makeRallyStats(),
    activeContract: null,
    contractIndex: 0,
    contractTimer: 0,
    contractCooldown: 1.2,
    contractMedals: 0,
    contractFails: 0,
    rivals: makeRivals(),
    result: null,
  };
}

function spawnParticles(game, x, y, color, count = 8) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.PI + (i / Math.max(1, count - 1)) * Math.PI;
    const speed = 90 + (i % 5) * 30;
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 28,
      life: 0.55,
      color,
    });
  }
}

function addFloater(game, x, y, text, color = '#facc15') {
  game.particles.push({
    x,
    y,
    vx: 0,
    vy: -44,
    life: 0.95,
    color,
    text,
  });
}

function projectPoint(game, ahead) {
  const depth = clamp(ahead / LOOKAHEAD, 0, 1);
  const near = 1 - depth;
  const roadW = 76 + 1040 * near ** 1.34;
  const curve = roadCurveAt(game.distance + ahead);
  const hill = hillAt(game.distance + ahead) * (0.2 + depth);
  const center = CENTER_X + curve * roadW * 0.22 - game.lane * roadW * 0.36;
  const y = HORIZON + hill + (HEIGHT - HORIZON) * near ** 2.18;
  return { x: center, y, roadW, near, depth };
}

function updateGates(game) {
  game.gates.forEach((gate) => {
    if (!gate.active || game.distance < gate.distance) return;
    gate.active = false;
    const chosenIndex = laneIndex(game.lane);
    const chosen = gate.options[chosenIndex];
    const correct = chosenIndex === gate.targetIndex;
    if (correct) {
      const bonus = game.mode === 'learn' ? 850 : 520;
      game.score += Math.round(bonus * game.combo);
      game.combo = clamp(game.combo + 0.25, 1, 5);
      game.bestCombo = Math.max(game.bestCombo, game.combo);
      game.cleanGates += 1;
      game.nitro = clamp(game.nitro + 18, 0, 100);
      game.speed = clamp(game.speed + 80, 0, MAX_SPEED + 160);
      game.timeLeft = clamp(game.timeLeft + (game.mode === 'learn' ? 2.5 : 1.4), 0, 160);
      game.message = game.mode === 'learn'
        ? `${gate.subject}: ${gate.answer}`
        : `Saubere Linie: ${gate.answer}`;
      recordGoal(game, game.mode === 'learn' ? 'learnCorrect' : 'lineGates');
      spawnParticles(game, CENTER_X, HEIGHT - 120, '#5eead4', 14);
    } else {
      game.combo = 1;
      game.mistakes += 1;
      game.cleanGates = 0;
      game.damage = clamp(game.damage + 8, 0, 100);
      game.timeLeft = Math.max(0, game.timeLeft - (game.mode === 'learn' ? 5 : 3));
      game.speed *= 0.86;
      game.message = game.mode === 'learn'
        ? `${chosen} war falsch. Richtig: ${gate.answer}`
        : `Linie verpasst: ${gate.answer}`;
      spawnParticles(game, CENTER_X, HEIGHT - 120, '#fb7185', 12);
    }
    game.messageTimer = 1.25;
    game.sector = Math.min(game.sector + 1, game.gates.length + 1);
  });
}

function shiftGear(game, direction) {
  if (game.phase !== 'race' || game.shiftCooldown > 0) return;
  const nextGear = clamp(game.gear + direction, 1, 5);
  if (nextGear === game.gear) return;
  const perfect = direction > 0 && game.rpm > 0.64 && game.rpm < 0.9;
  game.gear = nextGear;
  game.shiftCooldown = perfect ? 0.12 : 0.22;
  if (perfect) {
    game.perfectShiftTimer = 0.9;
    game.speed = clamp(game.speed + 56, 0, MAX_SPEED + 180);
    game.nitro = clamp(game.nitro + 7, 0, 100);
    game.combo = clamp(game.combo + 0.16, 1, 5);
    recordGoal(game, 'perfectShifts');
    game.message = `Perfekter Schaltpunkt · Gang ${game.gear}`;
    game.messageTimer = 0.9;
    addFloater(game, CENTER_X - 210, HEIGHT - 145, 'Perfect Shift', '#bfdbfe');
  } else {
    game.message = `Gang ${game.gear}`;
    game.messageTimer = 0.42;
  }
}

function updateRivals(game, dt) {
  game.rivals.forEach((rival) => {
    rival.hitTimer = Math.max(0, rival.hitTimer - dt);
    rival.draftTimer = Math.max(0, rival.draftTimer - dt);
    rival.distance += rival.speed * dt;
    rival.lane += Math.sin(game.elapsed * 1.4 + rival.wobble) * 0.05 * dt;
    rival.lane = clamp(rival.lane, -0.88, 0.88);

    if (rival.distance < game.distance - 900) {
      rival.distance = game.distance + 7200 + rival.wobble * 710;
      rival.lane = clamp(Math.sin(game.elapsed + rival.wobble) * 0.75, -0.85, 0.85);
      rival.speed = rival.champion ? 700 + Math.sin(game.elapsed * 0.2) * 26 : 540 + (rival.wobble % 4) * 46;
      rival.passed = false;
      rival.draftTimer = 0;
    }

    const relative = rival.distance - game.distance;
    if (relative > 115 && relative < 1050 && Math.abs(rival.lane - game.lane) < 0.26 && game.speed > 330) {
      rival.draftTimer += dt;
      game.draft = clamp(game.draft + (rival.champion ? 34 : 24) * dt, 0, 100);
      game.speed = clamp(game.speed + (rival.champion ? 84 : 58) * dt, 0, MAX_SPEED + 180);
      if (game.draft >= 100) {
        game.draft = 0;
        game.speed = clamp(game.speed + 112, 0, MAX_SPEED + 180);
        game.nitro = clamp(game.nitro + 12, 0, 100);
        game.score += Math.round(260 * game.combo);
        game.message = rival.champion ? 'Champion-Windschatten' : 'Windschatten-Boost';
        game.messageTimer = 0.75;
        recordGoal(game, 'drafts');
        spawnParticles(game, CENTER_X, HEIGHT - 92, '#bae6fd', 16);
      }
    }

    if (relative > -65 && relative < 155 && Math.abs(rival.lane - game.lane) < 0.18 && game.speed > 180) {
      rival.hitTimer = 0.3;
      game.speed *= 0.58;
      game.damage = clamp(game.damage + 13, 0, 100);
      game.combo = 1;
      game.screenShake = 0.28;
      game.message = 'Kontakt';
      game.messageTimer = 0.55;
      spawnParticles(game, CENTER_X, HEIGHT - 118, '#f87171', 12);
    }

    if (!rival.passed && relative < -110) {
      rival.passed = true;
      game.overtakes += 1;
      game.rank = Math.max(1, game.rank - 1);
      recordGoal(game, 'overtakes');
      if (rival.champion) recordGoal(game, 'championPasses');
      const passBonus = Math.round(260 * game.combo);
      game.score += passBonus;
      addFloater(game, CENTER_X + 210, HEIGHT - 150, rival.champion ? `Champion +${passBonus + 500}` : `Ueberholt +${passBonus}`, '#a7f3d0');
      if (rival.champion) game.score += 500;
      if (game.messageTimer <= 0.2) {
        game.message = rival.champion ? 'Champion ueberholt' : 'Sauber ueberholt';
        game.messageTimer = 0.65;
      }
    }
  });
}

function updateStageEvents(game) {
  game.stageEvents.forEach((event) => {
    if (!event.active || game.distance < event.distance) return;
    event.active = false;
    const laneDelta = Math.abs(game.lane - event.lane);
    const onLine = laneDelta < (event.type === 'hazard' ? 0.22 : 0.28);

    if (event.type === 'hazard') {
      if (onLine) {
        game.speed *= 0.7;
        game.damage = clamp(game.damage + 14, 0, 100);
        game.combo = 1;
        game.screenShake = 0.38;
        game.message = `${event.label} getroffen`;
        game.messageTimer = 0.9;
        spawnParticles(game, CENTER_X, HEIGHT - 118, '#fb7185', 16);
      } else {
        game.score += Math.round(220 * game.combo);
        game.combo = clamp(game.combo + 0.12, 1, 5);
        game.bestCombo = Math.max(game.bestCombo, game.combo);
        game.message = `${event.label} sauber gemieden`;
        game.messageTimer = 0.75;
        recordGoal(game, 'hazardsAvoided');
        addFloater(game, CENTER_X - 190, HEIGHT - 150, 'Avoid +220', '#bfdbfe');
      }
      return;
    }

    if (event.type === 'hairpin') {
      const committed = onLine && (game.handbrake > 0.45 || game.driftCharge > 0.36) && game.speed > 260;
      if (committed) {
        const hairpinBonus = Math.round(430 * game.combo);
        game.score += hairpinBonus;
        game.combo = clamp(game.combo + 0.3, 1, 5);
        game.bestCombo = Math.max(game.bestCombo, game.combo);
        game.nitro = clamp(game.nitro + 22, 0, 100);
        game.speed = clamp(game.speed + 74, 0, MAX_SPEED + 180);
        game.message = `${event.label} Handbremse sauber`;
        game.messageTimer = 0.9;
        recordGoal(game, 'hairpins');
        addFloater(game, CENTER_X, HEIGHT - 154, `Hairpin +${hairpinBonus}`, '#fef08a');
        spawnParticles(game, CENTER_X, HEIGHT - 104, '#facc15', 18);
      } else {
        game.speed *= 0.76;
        game.damage = clamp(game.damage + 9, 0, 100);
        game.combo = 1;
        game.message = `${event.label}: Handbremse verpasst`;
        game.messageTimer = 0.9;
        game.screenShake = 0.24;
        spawnParticles(game, CENTER_X, HEIGHT - 108, '#fb7185', 14);
      }
      return;
    }

    if (event.type === 'water') {
      if (onLine) {
        game.speed *= 0.9;
        game.score += Math.round(180 * game.combo);
        game.message = `${event.label}: sauber durch`;
        game.messageTimer = 0.72;
        spawnParticles(game, CENTER_X, HEIGHT - 105, '#67e8f9', 20);
      } else {
        game.damage = clamp(game.damage + 4, 0, 100);
        game.speed *= 0.96;
      }
      return;
    }

    if (!onLine) {
      if (event.type === 'apex') {
        game.combo = Math.max(1, game.combo - 0.15);
      }
      return;
    }

    if (event.type === 'apex') {
      const apexBonus = Math.round(360 * game.combo);
      game.score += apexBonus;
      game.combo = clamp(game.combo + 0.22, 1, 5);
      game.bestCombo = Math.max(game.bestCombo, game.combo);
      game.nitro = clamp(game.nitro + 16, 0, 100);
      game.speed = clamp(game.speed + 48, 0, MAX_SPEED + 180);
      game.message = `${event.label} sauber`;
      game.messageTimer = 0.8;
      recordGoal(game, 'apexes');
      addFloater(game, CENTER_X, HEIGHT - 154, `Apex +${apexBonus}`, '#fde68a');
      spawnParticles(game, CENTER_X, HEIGHT - 112, '#facc15', 12);
    } else if (event.type === 'nitro') {
      game.nitro = clamp(game.nitro + 34, 0, 100);
      game.score += 180;
      game.message = 'Nitro aufgenommen';
      game.messageTimer = 0.7;
      recordGoal(game, 'nitroPickups');
      spawnParticles(game, CENTER_X, HEIGHT - 104, '#fef08a', 14);
    } else if (event.type === 'repair') {
      game.damage = Math.max(0, game.damage - 18);
      game.score += 160;
      game.message = 'Service: Schaden runter';
      game.messageTimer = 0.85;
      recordGoal(game, 'repairs');
      spawnParticles(game, CENTER_X, HEIGHT - 104, '#86efac', 14);
    } else if (event.type === 'jump') {
      game.speed = clamp(game.speed + 86, 0, MAX_SPEED + 180);
      game.score += Math.round(280 * game.combo);
      game.screenShake = 0.22;
      game.message = `${event.label} gelandet`;
      game.messageTimer = 0.8;
      recordGoal(game, 'jumps');
      spawnParticles(game, CENTER_X, HEIGHT - 122, '#93c5fd', 14);
    }
  });
}

function updateParticles(game, dt) {
  game.particles = game.particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * dt,
      y: particle.y + particle.vy * dt,
      vy: particle.vy + 280 * dt,
      life: particle.life - dt,
    }))
    .filter((particle) => particle.life > 0);
}

function updateGame(game, input, dt, onFinish) {
  if (game.phase !== 'race') return;
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.screenShake = Math.max(0, game.screenShake - dt);
  game.timeLeft = Math.max(0, game.timeLeft - dt);
  game.driftReleaseTimer = Math.max(0, game.driftReleaseTimer - dt);
  game.shiftCooldown = Math.max(0, game.shiftCooldown - dt);
  game.perfectShiftTimer = Math.max(0, game.perfectShiftTimer - dt);
  game.draft = Math.max(0, game.draft - 10 * dt);

  const zone = zoneAt(game.distance);
  const steering = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const accelerating = input.up;
  const braking = input.down;
  const handbraking = input.handbrake && game.speed > 220;
  const drifting = (input.drift || handbraking) && Math.abs(steering) > 0 && game.speed > 260;
  const boosting = input.boost && game.nitro > 0 && game.speed > 120;
  const gearLow = GEAR_LIMITS[game.gear - 1] || 0;
  const gearHigh = GEAR_LIMITS[game.gear] || GEAR_LIMITS[GEAR_LIMITS.length - 1];
  const gearSpan = Math.max(1, gearHigh - gearLow);
  game.rpm = clamp((game.speed - gearLow) / gearSpan, 0.05, 1);
  const bogPenalty = game.speed < gearLow * 0.7 ? 0.68 : 1;
  const limiterPenalty = game.rpm > 0.94 ? 0.58 : 1;
  const torque = GEAR_TORQUE[game.gear] * bogPenalty * limiterPenalty * (game.perfectShiftTimer > 0 ? 1.12 : 1);

  if (accelerating) game.speed += 520 * zone.grip * torque * dt;
  else game.speed -= 130 * dt;
  if (braking) game.speed -= 720 * dt;
  if (boosting) {
    game.speed += 620 * zone.grip * dt;
    game.nitro = Math.max(0, game.nitro - 34 * dt);
    spawnParticles(game, CENTER_X, HEIGHT - 72, '#facc15', 1);
  }

  const curve = roadCurveAt(game.distance);
  const steerPower = drifting ? (handbraking ? 2.2 : 1.72) : 1;
  game.lane += steering * steerPower * (0.56 + game.speed / MAX_SPEED) * dt * (0.76 + zone.grip * 0.28);
  game.lane -= curve * (game.speed / MAX_SPEED) * 0.34 * dt;
  game.lane = clamp(game.lane, -1.38, 1.38);
  game.steerVisual = lerp(game.steerVisual, steering + curve * 0.38, 0.12);
  game.drift = lerp(game.drift, drifting ? 1 : 0, 0.16);
  game.handbrake = lerp(game.handbrake, handbraking ? 1 : 0, 0.18);

  if (drifting) {
    game.speed -= (handbraking ? 145 : 45) * dt;
    game.nitro = clamp(game.nitro + (handbraking ? 24 : 18) * dt, 0, 100);
    game.driftCharge = clamp(game.driftCharge + ((handbraking ? 0.52 : 0.38) + game.speed / MAX_SPEED * 0.58) * dt, 0, 1);
    game.score += Math.round(18 * dt * game.combo);
    spawnParticles(game, CENTER_X - steering * 42, HEIGHT - 78, handbraking ? '#facc15' : '#93c5fd', 1);
  } else if (game.wasDrifting && game.driftCharge > 0.22) {
    const superDrift = game.driftCharge > 0.72;
    const boost = superDrift ? 170 : 92;
    game.speed = clamp(game.speed + boost, 0, MAX_SPEED + 180);
    game.combo = clamp(game.combo + (superDrift ? 0.35 : 0.18), 1, 5);
    game.bestCombo = Math.max(game.bestCombo, game.combo);
    game.score += Math.round((superDrift ? 240 : 120) * game.combo);
    game.driftReleaseText = superDrift ? 'SUPER DRIFT BOOST' : 'DRIFT BOOST';
    game.driftReleaseTimer = 1;
    game.message = game.driftReleaseText;
    game.messageTimer = 0.85;
    recordGoal(game, 'drifts');
    if (superDrift) recordGoal(game, 'superDrifts');
    spawnParticles(game, CENTER_X, HEIGHT - 84, superDrift ? '#facc15' : '#93c5fd', superDrift ? 18 : 10);
    game.driftCharge = 0;
  } else if (!drifting) {
    game.driftCharge = Math.max(0, game.driftCharge - dt * 0.8);
  }
  game.wasDrifting = drifting;

  if (zone.grip < 0.72 && game.speed > 470 && Math.abs(steering) > 0) {
    game.lane += Math.sin(game.elapsed * 9.5) * (1 - zone.grip) * 0.012;
    game.damage = clamp(game.damage + (1 - zone.grip) * 1.9 * dt, 0, 100);
  }

  const offroad = Math.max(0, Math.abs(game.lane) - 1);
  game.traction = clamp(zone.grip - offroad * 0.18 - game.handbrake * 0.08, 0.34, 1.12);
  if (offroad > 0) {
    game.speed -= (360 + offroad * 520) * dt * (1.06 - zone.grip * 0.28);
    game.damage = clamp(game.damage + offroad * 9 * dt, 0, 100);
    game.combo = 1;
    if (game.messageTimer <= 0) {
      game.message = 'Schotter bremst';
      game.messageTimer = 0.35;
    }
  }

  const gearSpeedLimit = gearHigh + (boosting ? 150 : 40) + (game.perfectShiftTimer > 0 ? 60 : 0);
  if (game.speed > gearSpeedLimit) {
    game.speed -= (game.speed - gearSpeedLimit) * 2.4 * dt;
  }
  game.speed = clamp(game.speed, 0, Math.min(boosting ? MAX_SPEED + 180 : MAX_SPEED, gearSpeedLimit + 70));
  if (accelerating && game.gear < 5 && game.speed > GEAR_LIMITS[game.gear] * 0.985 && game.shiftCooldown <= 0) {
    game.gear += 1;
    game.shiftCooldown = 0.24;
  } else if ((braking || !accelerating) && game.gear > 1 && game.speed < GEAR_LIMITS[game.gear - 1] * 0.58 && game.shiftCooldown <= 0) {
    game.gear -= 1;
    game.shiftCooldown = 0.18;
  }
  const updatedLow = GEAR_LIMITS[game.gear - 1] || 0;
  const updatedHigh = GEAR_LIMITS[game.gear] || GEAR_LIMITS[GEAR_LIMITS.length - 1];
  game.rpm = clamp((game.speed - updatedLow) / Math.max(1, updatedHigh - updatedLow), 0.05, 1);
  game.bestSpeed = Math.max(game.bestSpeed, game.speed);
  game.distance += game.speed * dt;
  game.score += Math.round(game.speed * dt * 0.04 * game.combo);
  game.paceNote = paceNoteAt(game.distance);
  updateRivals(game, dt);
  updateGates(game);
  updateStageEvents(game);

  while (game.checkpointIndex < CHECKPOINTS.length && game.distance >= CHECKPOINTS[game.checkpointIndex]) {
    const addTime = Math.round(11 + game.cleanGates * 0.8 + (game.mode === 'learn' ? 2 : 0));
    const split = game.elapsed - game.currentSplitStart;
    game.currentSplitStart = game.elapsed;
    game.lastSplit = split;
    game.splitTimes.push(split);
    game.timeLeft = clamp(game.timeLeft + addTime, 0, 165);
    game.score += 650 + game.checkpointIndex * 120;
    game.checkpointIndex += 1;
    recordGoal(game, 'checkpoints');
    game.message = `Split ${split.toFixed(1)}s · +${addTime}s`;
    game.messageTimer = 1.05;
    spawnParticles(game, CENTER_X, HEIGHT - 120, '#facc15', 22);
  }

  updateRallyContract(game, dt);
  updateParticles(game, dt);

  if (game.distance >= STAGE_LENGTH || game.damage >= 100 || game.timeLeft <= 0) {
    const won = game.damage < 100 && game.timeLeft > 0;
    game.phase = 'result';
    game.result = {
      title: won ? 'Etappe geschafft' : game.damage >= 100 ? 'Wagen zerstoert' : 'Zeit abgelaufen',
      score: game.score + (won ? Math.round((100 - game.damage) * 30 + game.nitro * 12 + game.timeLeft * 24) : 0),
      damage: Math.round(game.damage),
      distance: Math.round(Math.min(game.distance, STAGE_LENGTH)),
      rank: game.rank,
      overtakes: game.overtakes,
      mistakes: game.mistakes,
      bestCombo: game.bestCombo.toFixed(2),
      bestSpeed: Math.round(game.bestSpeed * 0.38),
      contractMedals: game.contractMedals,
      contractFails: game.contractFails,
      goalsDone: game.goals.filter((goal) => goal.done).length,
      goalsTotal: game.goals.length,
    };
    onFinish(game.result);
  }
}

function drawBackground(ctx, game) {
  const zone = zoneAt(game.distance);
  const sky = ctx.createLinearGradient(0, 0, 0, HORIZON + 120);
  sky.addColorStop(0, '#0f172a');
  sky.addColorStop(0.45, zone.sky);
  sky.addColorStop(1, '#fbbf24');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const sunX = WIDTH - 190 + Math.sin(game.elapsed * 0.3) * 20;
  ctx.save();
  ctx.shadowColor = '#fef3c7';
  ctx.shadowBlur = 28;
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(sunX, 88, 44, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  for (let layer = 0; layer < 3; layer += 1) {
    const offset = (game.distance * [0.015, 0.026, 0.041][layer]) % 240;
    ctx.fillStyle = [`rgba(30,41,59,.52)`, `rgba(15,23,42,.62)`, `rgba(6,78,59,.58)`][layer];
    ctx.beginPath();
    ctx.moveTo(0, HORIZON + 110 + layer * 46);
    for (let x = -260; x <= WIDTH + 260; x += 180) {
      const px = x - offset;
      const peak = HORIZON + 24 + layer * 44 + Math.sin((x + layer * 50) * 0.02) * 18;
      ctx.lineTo(px + 90, peak);
      ctx.lineTo(px + 180, HORIZON + 118 + layer * 46);
    }
    ctx.lineTo(WIDTH, HEIGHT);
    ctx.lineTo(0, HEIGHT);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = '#14532d';
  ctx.fillRect(0, HORIZON + 112, WIDTH, HEIGHT - HORIZON - 112);
}

function drawRoad(ctx, game) {
  for (let i = STRIPS - 1; i >= 0; i -= 1) {
    const far = projectPoint(game, (i + 1) * STRIP_LENGTH);
    const near = projectPoint(game, i * STRIP_LENGTH);
    const stripIndex = Math.floor((game.distance + i * STRIP_LENGTH) / 520);
    const zone = zoneAt(game.distance + i * STRIP_LENGTH);
    const asphalt = stripIndex % 2 === 0 ? zone.road : '#293447';
    const dirt = stripIndex % 2 === 0 ? zone.shoulder : '#7c2d12';

    ctx.fillStyle = dirt;
    ctx.beginPath();
    ctx.moveTo(far.x - far.roadW * 0.68, far.y);
    ctx.lineTo(far.x + far.roadW * 0.68, far.y);
    ctx.lineTo(near.x + near.roadW * 0.68, near.y);
    ctx.lineTo(near.x - near.roadW * 0.68, near.y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = asphalt;
    ctx.beginPath();
    ctx.moveTo(far.x - far.roadW * 0.5, far.y);
    ctx.lineTo(far.x + far.roadW * 0.5, far.y);
    ctx.lineTo(near.x + near.roadW * 0.5, near.y);
    ctx.lineTo(near.x - near.roadW * 0.5, near.y);
    ctx.closePath();
    ctx.fill();

    if (i % 4 === 0) {
      ctx.strokeStyle = 'rgba(254,243,199,.72)';
      ctx.lineWidth = Math.max(2, near.near * 8);
      [-0.18, 0.18].forEach((lane) => {
        ctx.beginPath();
        ctx.moveTo(far.x + lane * far.roadW, far.y);
        ctx.lineTo(near.x + lane * near.roadW, near.y);
        ctx.stroke();
      });
    }

    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = Math.max(1, near.near * 5);
    ctx.beginPath();
    ctx.moveTo(far.x - far.roadW * 0.5, far.y);
    ctx.lineTo(near.x - near.roadW * 0.5, near.y);
    ctx.moveTo(far.x + far.roadW * 0.5, far.y);
    ctx.lineTo(near.x + near.roadW * 0.5, near.y);
    ctx.stroke();
  }
}

function drawGatePanel(ctx, x, y, w, h, label, active) {
  ctx.save();
  ctx.globalAlpha = active ? 0.96 : 0.35;
  ctx.fillStyle = active ? 'rgba(15,23,42,.86)' : 'rgba(71,85,105,.55)';
  ctx.strokeStyle = active ? '#67e8f9' : '#64748b';
  ctx.lineWidth = Math.max(2, h * 0.08);
  ctx.shadowColor = active ? '#22d3ee' : 'transparent';
  ctx.shadowBlur = active ? 16 : 0;
  drawRoundedRect(ctx, x - w / 2, y - h, w, h, 10);
  ctx.fill();
  ctx.stroke();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#f8fafc';
  ctx.font = `900 ${clamp(h * 0.28, 11, 20)}px Outfit, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y - h / 2);
  ctx.restore();
}

function drawGates(ctx, game) {
  game.gates.forEach((gate) => {
    const ahead = gate.distance - game.distance;
    if (ahead < -260 || ahead > LOOKAHEAD) return;
    const p = projectPoint(game, Math.max(40, ahead));
    const panelW = clamp(p.roadW * 0.23, 54, 150);
    const panelH = clamp(22 + p.near * 88, 26, 96);
    ctx.save();
    ctx.strokeStyle = gate.active ? 'rgba(224,242,254,.55)' : 'rgba(100,116,139,.35)';
    ctx.lineWidth = Math.max(3, p.near * 10);
    ctx.beginPath();
    ctx.moveTo(p.x - p.roadW * 0.49, p.y);
    ctx.lineTo(p.x + p.roadW * 0.49, p.y);
    ctx.stroke();
    gate.options.forEach((option, index) => {
      const lane = [-0.58, 0, 0.58][index];
      drawGatePanel(ctx, p.x + lane * p.roadW * 0.55, p.y - p.near * 14, panelW, panelH, option, gate.active);
    });
    ctx.restore();
  });
}

function drawStageEvent(ctx, game, event) {
  const ahead = event.distance - game.distance;
  if (!event.active || ahead < -240 || ahead > LOOKAHEAD) return;
  const p = projectPoint(game, Math.max(40, ahead));
  const x = p.x + event.lane * p.roadW * 0.36;
  const size = clamp(18 + p.near * 82, 18, 94);
  const y = p.y - size * 0.42;
  const palette = {
    apex: ['#facc15', '#713f12'],
    nitro: ['#38bdf8', '#0f172a'],
	    repair: ['#86efac', '#052e16'],
	    jump: ['#c4b5fd', '#312e81'],
	    hazard: ['#fb7185', '#450a0a'],
	    hairpin: ['#f97316', '#431407'],
	    water: ['#67e8f9', '#083344'],
	  }[event.type] || ['#f8fafc', '#0f172a'];

  ctx.save();
  ctx.globalAlpha = clamp(0.28 + p.near * 0.95, 0.35, 1);
  ctx.translate(x, y);
  ctx.shadowColor = palette[0];
  ctx.shadowBlur = 14 + p.near * 18;

  if (event.type === 'hazard') {
    ctx.fillStyle = palette[0];
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.54);
    ctx.lineTo(size * 0.43, size * 0.42);
    ctx.lineTo(-size * 0.43, size * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fef2f2';
    ctx.fillRect(-size * 0.06, -size * 0.18, size * 0.12, size * 0.38);
  } else if (event.type === 'jump') {
    ctx.fillStyle = palette[1];
    ctx.beginPath();
    ctx.moveTo(-size * 0.62, size * 0.38);
    ctx.lineTo(size * 0.62, size * 0.38);
    ctx.lineTo(size * 0.34, -size * 0.38);
    ctx.lineTo(-size * 0.42, -size * 0.08);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = palette[0];
    ctx.lineWidth = Math.max(2, size * 0.06);
    ctx.stroke();
  } else {
    ctx.fillStyle = palette[0];
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = palette[1];
    ctx.font = `900 ${clamp(size * 0.21, 10, 18)}px Outfit, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
	    ctx.fillText(event.type === 'apex' ? 'A' : event.type === 'repair' ? '+' : event.type === 'hairpin' ? 'H' : event.type === 'water' ? 'W' : 'N', 0, 0);
  }

  ctx.shadowColor = 'transparent';
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, -size * 0.78, size * 0.5, size * 1.56, size * 0.34, size * 0.08);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = `900 ${clamp(size * 0.13, 8, 13)}px Outfit, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(event.label, 0, size * 0.67);
  ctx.restore();
}

function drawStageEvents(ctx, game) {
  [...game.stageEvents]
    .sort((a, b) => (b.distance - game.distance) - (a.distance - game.distance))
    .forEach((event) => drawStageEvent(ctx, game, event));
}

function drawRivalCar(ctx, x, y, size, color, hitTimer, champion = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = hitTimer > 0 ? '#fecaca' : champion ? '#fde68a' : color;
  ctx.shadowBlur = hitTimer > 0 ? 22 : champion ? 20 : 10;
  ctx.fillStyle = hitTimer > 0 ? '#fecaca' : color;
  drawRoundedRect(ctx, -size * 0.48, -size * 0.9, size * 0.96, size * 1.45, size * 0.14);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  drawRoundedRect(ctx, -size * 0.32, -size * 0.66, size * 0.64, size * 0.36, size * 0.08);
  ctx.fill();
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(-size * 0.34, size * 0.28, size * 0.18, size * 0.1);
  ctx.fillRect(size * 0.16, size * 0.28, size * 0.18, size * 0.1);
  if (champion) {
    ctx.fillStyle = '#111827';
    ctx.font = `900 ${Math.max(9, size * 0.18)}px Outfit, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('1', 0, -size * 0.04);
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.moveTo(-size * 0.22, -size * 1.04);
    ctx.lineTo(-size * 0.08, -size * 1.22);
    ctx.lineTo(size * 0.04, -size * 1.04);
    ctx.lineTo(size * 0.2, -size * 1.22);
    ctx.lineTo(size * 0.27, -size * 1.02);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawRivals(ctx, game) {
  const visible = [...game.rivals]
    .map((rival) => ({ ...rival, ahead: rival.distance - game.distance }))
    .filter((rival) => rival.ahead > -30 && rival.ahead < LOOKAHEAD)
    .sort((a, b) => b.ahead - a.ahead);

  visible.forEach((rival) => {
    const p = projectPoint(game, Math.max(40, rival.ahead));
	    const x = p.x + rival.lane * p.roadW * 0.36;
	    const size = clamp(18 + p.near * 88, 16, 110);
	    drawRivalCar(ctx, x, p.y - size * 0.22, size, rival.color, rival.hitTimer, rival.champion);
	  });
}

function drawPlayerCar(ctx, game) {
  const x = CENTER_X;
  const y = HEIGHT - 94;
  const shake = game.screenShake > 0 ? Math.sin(game.elapsed * 95) * game.screenShake * 22 : 0;
  ctx.save();
  ctx.translate(x + shake, y);
  ctx.rotate(game.steerVisual * 0.1);
  ctx.shadowColor = game.drift > 0.2 ? '#93c5fd' : '#22d3ee';
  ctx.shadowBlur = game.drift > 0.2 ? 28 : 16;
  ctx.fillStyle = '#2563eb';
  drawRoundedRect(ctx, -45, -70, 90, 126, 18);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  drawRoundedRect(ctx, -31, -43, 62, 38, 10);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-36, 28, 20, 10);
  ctx.fillRect(16, 28, 20, 10);
  ctx.fillStyle = '#111827';
  ctx.fillRect(-52, -46, 12, 36);
  ctx.fillRect(40, -46, 12, 36);
  ctx.fillRect(-52, 20, 12, 34);
  ctx.fillRect(40, 20, 12, 34);
  if (game.nitro > 0 && game.speed > MAX_SPEED * 0.72) {
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-24, 58);
    ctx.lineTo(-8, 106 + Math.sin(game.elapsed * 30) * 8);
    ctx.lineTo(8, 58);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(16, 58);
    ctx.lineTo(30, 96 + Math.cos(game.elapsed * 31) * 8);
    ctx.lineTo(38, 58);
    ctx.fill();
  }
  ctx.restore();
}

function drawParticles(ctx, game) {
  game.particles.forEach((particle) => {
    ctx.save();
    ctx.globalAlpha = clamp(particle.life / 0.55, 0, 1);
    if (particle.text) {
      ctx.fillStyle = particle.color;
      ctx.font = '900 18px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(particle.text, particle.x, particle.y);
    } else {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 4 + particle.life * 12, 0, Math.PI * 2);
      ctx.fill();
    }
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

function drawGoalList(ctx, game, x, y, w) {
  const goals = game.goals.slice(0, 5);
  const rowH = 23;
  const h = 34 + goals.length * rowH;
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, x, y, w, h, 16);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '900 11px Outfit, sans-serif';
  ctx.fillText('RALLY-MEISTERUNG', x + 18, y + 22);

  goals.forEach((goal, index) => {
    const rowY = y + 40 + index * rowH;
    const progress = clamp(goal.progress / goal.target, 0, 1);
    ctx.fillStyle = goal.done ? '#86efac' : '#e2e8f0';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.fillText(goal.label, x + 18, rowY);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`${goal.progress}/${goal.target}`, x + w - 18, rowY);
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(51,65,85,.9)';
    drawRoundedRect(ctx, x + 18, rowY + 8, w - 36, 5, 3);
    ctx.fill();
    ctx.fillStyle = goal.done ? '#22c55e' : '#38bdf8';
    drawRoundedRect(ctx, x + 18, rowY + 8, (w - 36) * progress, 5, 3);
    ctx.fill();
  });
}

function nextActiveGate(game) {
  return game.gates.find((gate) => gate.active);
}

function drawHud(ctx, game) {
  const speedKmh = Math.round(game.speed * 0.38);
  const progress = clamp((game.distance / STAGE_LENGTH) * 100, 0, 100);
  const gate = nextActiveGate(game);
  const zone = zoneAt(game.distance);
  const contract = game.activeContract;
  const contractProgress = rallyContractProgress(game);

  ctx.save();
  ctx.fillStyle = '#020617';
  drawRoundedRect(ctx, 28, 22, 426, 218, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 25px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Learncade Rally Pro' : 'Faska Rally Pro', 52, 58);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 16px Outfit, sans-serif';
  ctx.fillText(`Speed ${speedKmh} · Gang ${game.gear} · Zeit ${Math.ceil(game.timeLeft)}s · Rang ${game.rank}/8`, 52, 88);
  ctx.fillStyle = '#67e8f9';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText(`${zone.name} · ${game.paceNote}`, 52, 112);
  drawMeter(ctx, 52, 144, 156, 12, 100 - game.damage, '#22c55e', 'WAGEN');
  drawMeter(ctx, 238, 144, 146, 12, game.nitro, '#facc15', 'NITRO');
  drawMeter(ctx, 52, 176, 156, 10, game.driftCharge * 100, '#93c5fd', 'DRIFT');
  drawMeter(ctx, 238, 176, 146, 10, game.rpm * 100, game.rpm > 0.86 ? '#f97316' : '#38bdf8', 'RPM');
  drawMeter(ctx, 52, 206, 156, 10, game.draft, '#bae6fd', 'DRAFT');
  drawMeter(ctx, 238, 206, 146, 10, game.traction * 100, game.traction > 0.72 ? '#86efac' : '#fb7185', 'GRIP');
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 12px Outfit, sans-serif';
  ctx.fillText(`Split ${game.lastSplit ? `${game.lastSplit.toFixed(1)}s` : '--'} · Best Combo x${game.bestCombo.toFixed(2)}`, 52, 232);

  if (gate) {
    ctx.fillStyle = '#020617';
    drawRoundedRect(ctx, 476, 78, 448, 102, 18);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '900 18px Outfit, sans-serif';
    ctx.fillText(gate.prompt, 700, 111);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 14px Outfit, sans-serif';
    ctx.fillText(`${gate.subject} · links/mittig/rechts waehlen`, 700, 140);
    ctx.fillStyle = '#facc15';
    ctx.fillText(`Naechstes Gate: ${Math.max(0, Math.round((gate.distance - game.distance) / 100))} m`, 700, 161);
  }

  ctx.textAlign = 'right';
  ctx.fillStyle = '#020617';
  drawRoundedRect(ctx, WIDTH - 326, 22, 298, 110, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 24px Outfit, sans-serif';
  ctx.fillText(`Score ${game.score}`, WIDTH - 52, 58);
  ctx.fillStyle = '#a7f3d0';
  ctx.font = '900 16px Outfit, sans-serif';
  ctx.fillText(`Combo x${game.combo.toFixed(2)}`, WIDTH - 52, 86);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText(`${Math.round(progress)}% Etappe`, WIDTH - 52, 111);

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.76)';
  drawRoundedRect(ctx, WIDTH - 326, 150, 298, 58, 16);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '800 12px Outfit, sans-serif';
  ctx.fillText('CHECKPOINT', WIDTH - 302, 175);
  ctx.fillText(`${game.checkpointIndex}/${CHECKPOINTS.length} · Fehler ${game.mistakes}`, WIDTH - 302, 195);

  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, WIDTH - 326, 222, 298, 106, 16);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '900 11px Outfit, sans-serif';
  ctx.fillText(`ETAPPEN-AUFTRAG · ${game.contractMedals} OK · ${game.contractFails} FAIL`, WIDTH - 302, 245);
  if (contract) {
    const contractRatio = clamp(contractProgress / contract.target, 0, 1);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.fillText(contract.label, WIDTH - 302, 268);
    ctx.fillStyle = 'rgba(51,65,85,.92)';
    drawRoundedRect(ctx, WIDTH - 302, 282, 248, 10, 5);
    ctx.fill();
    ctx.fillStyle = contractRatio >= 1 ? '#22c55e' : '#facc15';
    drawRoundedRect(ctx, WIDTH - 302, 282, 248 * contractRatio, 10, 5);
    ctx.fill();
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.fillText(`${contractProgress}/${contract.target}`, WIDTH - 302, 312);
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.ceil(game.contractTimer)}s`, WIDTH - 54, 312);
    ctx.textAlign = 'left';
  } else {
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.fillText('Naechster Auftrag wird vorbereitet', WIDTH - 302, 272);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 12px Outfit, sans-serif';
    ctx.fillText(`${Math.ceil(game.contractCooldown)}s bis zur neuen Aufgabe`, WIDTH - 302, 300);
  }
  drawGoalList(ctx, game, WIDTH - 326, 344, 298);

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.74)';
    drawRoundedRect(ctx, CENTER_X - 272, HEIGHT - 218, 544, 56, 18);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 24px Outfit, sans-serif';
    ctx.fillText(game.message, CENTER_X, HEIGHT - 182);
  }

  if (game.driftReleaseTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(37,99,235,.72)';
    drawRoundedRect(ctx, CENTER_X - 172, HEIGHT - 290, 344, 42, 18);
    ctx.fill();
    ctx.fillStyle = '#dbeafe';
    ctx.font = '900 22px Outfit, sans-serif';
    ctx.fillText(game.driftReleaseText, CENTER_X, HEIGHT - 263);
  }

  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawBackground(ctx, game);
  drawRoad(ctx, game);
  drawStageEvents(ctx, game);
  drawGates(ctx, game);
  drawRivals(ctx, game);
  drawPlayerCar(ctx, game);
  drawParticles(ctx, game);
  drawHud(ctx, game);
}

export default function FaskaRallySwarm() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameRef = useRef(makeInitialGame('arcade'));
  const inputRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
    drift: false,
    handbrake: false,
    boost: false,
  });
  const modeRef = useRef('arcade');
  const [mode, setMode] = useState('arcade');
  const [result, setResult] = useState(null);

  const clearInput = useCallback(() => {
    inputRef.current = {
      up: false,
      down: false,
      left: false,
      right: false,
      drift: false,
      handbrake: false,
      boost: false,
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

  const tapShift = useCallback((direction) => ({
    onPointerDown: (event) => {
      event.preventDefault();
      shiftGear(gameRef.current, direction);
    },
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const keyMap = new Map([
      ['ArrowUp', 'up'], ['w', 'up'], ['W', 'up'],
      ['ArrowDown', 'down'], ['s', 'down'], ['S', 'down'],
      ['ArrowLeft', 'left'], ['a', 'left'], ['A', 'left'],
      ['ArrowRight', 'right'], ['d', 'right'], ['D', 'right'],
      ['Shift', 'drift'],
      ['c', 'handbrake'], ['C', 'handbrake'], ['Control', 'handbrake'],
      [' ', 'boost'],
    ]);
    let raf = 0;
    let last = performance.now();

    const keyDown = (event) => {
      const mapped = keyMap.get(event.key);
      if (mapped) {
        inputRef.current[mapped] = true;
        event.preventDefault();
      }
      if ((event.key === 'q' || event.key === 'Q') && !event.repeat) {
        shiftGear(gameRef.current, -1);
        event.preventDefault();
      }
      if ((event.key === 'e' || event.key === 'E') && !event.repeat) {
        shiftGear(gameRef.current, 1);
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
    boxShadow: '0 12px 32px rgba(0,0,0,.32)',
  };
  const actionButton = {
    ...padButton,
    width: 88,
    height: 64,
    fontSize: 12,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#020617', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
      <canvas
        className="rally-canvas"
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
          boxShadow: '0 0 120px rgba(59,130,246,.18), inset 0 0 80px rgba(250,204,21,.08), 0 0 90px rgba(0,0,0,.55)',
        }}
      />

      {/* Post-processing vignette overlay */}
      <div className="rally-vignette" style={{
        position: 'absolute',
        inset: 0,
        margin: 'auto',
        width: 'min(100vw, calc(100vh * 16 / 9))',
        height: 'min(100vh, calc(100vw * 9 / 16))',
        pointerEvents: 'none',
        zIndex: 1,
        boxShadow: 'inset 0 0 150px 60px rgba(0,0,0,.45), inset 0 0 80px 30px rgba(59,130,246,.10)',
        borderRadius: 2,
      }} />

      <div className="rally-modebar" style={{ position: 'fixed', top: canvasTopChrome, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.55 }}>
          Normal
        </button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.55 }}>
          Learncade
        </button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      <div className="rally-touch-controls rally-stick-controls" style={{
        position: 'fixed', left: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'grid', gridTemplateColumns: '62px 62px 62px', gridTemplateRows: '62px',
        gap: 8, touchAction: 'none',
      }}>
        <button aria-label="Links" style={padButton} {...holdButton('left')}>←</button>
        <button aria-label="Bremse" style={padButton} {...holdButton('down')}>↓</button>
        <button aria-label="Rechts" style={padButton} {...holdButton('right')}>→</button>
      </div>

      <div className="rally-touch-controls rally-action-controls" style={{
        position: 'fixed', right: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'grid', gridTemplateColumns: 'repeat(2, 92px)', gap: 10, alignItems: 'end', touchAction: 'none',
      }}>
        <button aria-label="Gas" style={{ ...actionButton, width: 96, height: 74, background: 'rgba(34,197,94,.84)', color: '#052e16' }} {...holdButton('up')}>GAS</button>
        <button aria-label="Handbremse" style={actionButton} {...holdButton('handbrake')}>HAND</button>
        <button aria-label="Gang hoch" style={{ ...actionButton, width: 72 }} {...tapShift(1)}>GEAR+</button>
        <button aria-label="Drift" style={actionButton} {...holdButton('drift')}>DRIFT</button>
        <button aria-label="Nitro" style={{ ...actionButton, width: 96, height: 74, background: 'rgba(250,204,21,.84)', color: '#111827' }} {...holdButton('boost')}>
          NITRO
        </button>
      </div>

      {result && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2,6,23,.78)', zIndex: 20, flexDirection: 'column', gap: 16,
        }}>
          <div style={{ fontSize: 54, fontWeight: 900, color: '#f8fafc' }}>{result.title}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#facc15' }}>Score {result.score}</div>
          <div style={{ fontSize: 15, color: '#cbd5e1' }}>
            Rang {result.rank}/8 · Ueberholungen {result.overtakes} · Fehler {result.mistakes} · Schaden {result.damage}% · Distanz {result.distance}
          </div>
          <div style={{ fontSize: 15, color: '#a7f3d0', fontWeight: 800 }}>
            Best Speed {result.bestSpeed} km/h · Best Combo x{result.bestCombo} · Auftraege {result.contractMedals}/{result.contractMedals + result.contractFails} · Meisterungen {result.goalsDone}/{result.goalsTotal}
          </div>
          <button className="btn-primary" onClick={restart}>Neue Etappe</button>
        </div>
      )}

      <style>{`
        @media (pointer: fine), (min-width: 900px) {
          .rally-touch-controls {
            display: none !important;
          }
        }
        @media (max-width: 899px) and (orientation: portrait) {
          .rally-canvas,
          .rally-vignette {
            inset: 0 !important;
            width: 100dvw !important;
            height: 100dvh !important;
            transform: none !important;
          }
          .rally-modebar {
            top: max(8px, env(safe-area-inset-top)) !important;
            width: min(96dvw, 560px);
            flex-wrap: wrap;
            justify-content: center;
            gap: 6px !important;
          }
          .rally-modebar .btn-primary {
            padding: 8px 11px;
            font-size: 11px;
          }
          .rally-touch-controls {
            bottom: max(14px, env(safe-area-inset-bottom)) !important;
          }
          .rally-stick-controls {
            left: 8px !important;
            grid-template-columns: repeat(3, 56px) !important;
            gap: 6px !important;
          }
          .rally-stick-controls button {
            width: 56px !important;
            height: 56px !important;
            border-radius: 13px !important;
            font-size: 17px !important;
          }
          .rally-action-controls {
            right: 8px !important;
            grid-template-columns: repeat(2, 82px) !important;
            gap: 8px !important;
          }
          .rally-action-controls button {
            width: 82px !important;
            height: 54px !important;
            min-width: 0 !important;
            border-radius: 13px !important;
            font-size: 10px !important;
            padding: 0 !important;
          }
          .rally-action-controls button:first-child,
          .rally-action-controls button:last-child {
            height: 64px !important;
          }
        }
      `}</style>
    </div>
  );
}
