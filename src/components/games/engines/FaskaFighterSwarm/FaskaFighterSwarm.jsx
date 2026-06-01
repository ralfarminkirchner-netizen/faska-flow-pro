import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const CENTER_X = WIDTH / 2;
const FLOOR = 558;
const GRAVITY = 1680;
const ROUND_TIME = 99;
const ROUNDS_TO_WIN = 2;

const ARENA_COLORS = {
  sky: '#101827',
  back: '#17233a',
  floor: '#243044',
  red: '#ef4444',
  blue: '#38bdf8',
  gold: '#facc15',
};

const FIGHTER_KEY_BINDINGS = new Map([
  ['ArrowLeft', 'left'], ['a', 'left'], ['A', 'left'],
  ['ArrowRight', 'right'], ['d', 'right'], ['D', 'right'],
  ['ArrowUp', 'up'], ['w', 'up'], ['W', 'up'],
  ['ArrowDown', 'down'], ['s', 'down'], ['S', 'down'],
  ['j', 'light'], ['J', 'light'],
  ['k', 'heavy'], ['K', 'heavy'],
  ['l', 'special'], ['L', 'special'],
  ['o', 'ex'], ['O', 'ex'],
  ['i', 'super'], ['I', 'super'],
  ['u', 'throw'], ['U', 'throw'],
  ['q', 'parry'], ['Q', 'parry'],
  [' ', 'block'],
  ['Shift', 'dash'],
]);

const FIGHTER_TAP_INPUTS = new Set(['light', 'heavy', 'special', 'ex', 'super', 'throw', 'parry', 'dash']);
const FIGHTER_INPUT_BUFFER_MS = 140;

const LEARN_PROMPTS = [
  {
    subject: 'Deutsch',
    sentence: 'Der schnelle Hund rennt.',
    word: 'rennt',
    instruction: 'Beruehre die richtige Wortart.',
    answer: 'Verb',
    options: ['Nomen', 'Verb', 'Adjektiv'],
  },
  {
    subject: 'Deutsch',
    sentence: 'Luna findet den Schatz.',
    word: 'Schatz',
    instruction: 'Beruehre die richtige Wortart.',
    answer: 'Nomen',
    options: ['Nomen', 'Verb', 'Praeposition'],
  },
  {
    subject: 'Deutsch',
    sentence: 'Das rote Tor leuchtet.',
    word: 'rote',
    instruction: 'Beruehre die richtige Wortart.',
    answer: 'Adjektiv',
    options: ['Verb', 'Adjektiv', 'Nomen'],
  },
  {
    subject: 'Deutsch',
    sentence: 'Bruno steht unter der Bruecke.',
    word: 'unter',
    instruction: 'Beruehre die richtige Wortart.',
    answer: 'Praeposition',
    options: ['Artikel', 'Praeposition', 'Verb'],
  },
  {
    subject: 'Deutsch',
    sentence: 'Wir spielen heute draussen.',
    word: 'heute',
    instruction: 'Beruehre die richtige Wortart.',
    answer: 'Adverb',
    options: ['Nomen', 'Adverb', 'Adjektiv'],
  },
  {
    subject: 'Deutsch',
    sentence: 'Acht mal sieben ist sechsundfuenfzig.',
    word: 'sechsundfuenfzig',
    instruction: 'Beruehre die richtige Wortart.',
    answer: 'Zahlwort',
    options: ['Verb', 'Zahlwort', 'Nomen'],
  },
  {
    subject: 'Englisch',
    sentence: 'The fighter blocks carefully.',
    word: 'carefully',
    instruction: 'Beruehre die richtige Wortart.',
    answer: 'Adverb',
    options: ['Adjektiv', 'Adverb', 'Nomen'],
  },
  {
    subject: 'Mathe',
    sentence: '14 + 27 = ?',
    word: '14 + 27',
    instruction: 'Beruehre das richtige Ergebnis.',
    answer: '41',
    options: ['39', '41', '43'],
  },
  {
    subject: 'Englisch',
    sentence: 'What means "guard"?',
    word: 'guard',
    instruction: 'Beruehre die passende Uebersetzung.',
    answer: 'Schutz',
    options: ['Sprung', 'Schutz', 'Schlag'],
  },
  {
    subject: 'Sachkunde',
    sentence: 'Welcher Sinn erkennt Geraeusche?',
    word: 'Geraeusche',
    instruction: 'Beruehre die richtige Antwort.',
    answer: 'Hoeren',
    options: ['Riechen', 'Hoeren', 'Tasten'],
  },
  {
    subject: 'Deutsch',
    sentence: 'Ein zusammengesetztes Nomen fuer Sonnen + Schirm.',
    word: 'Sonnen + Schirm',
    instruction: 'Beruehre das Kompositum.',
    answer: 'Sonnenschirm',
    options: ['Sonnenschirm', 'Schirmsonne', 'Sonnenlicht'],
  },
  {
    subject: 'Mathe',
    sentence: '3 x 8 + 4 = ?',
    word: '3 x 8 + 4',
    instruction: 'Beruehre das richtige Ergebnis.',
    answer: '28',
    options: ['24', '28', '32'],
  },
];

const STYLE_GOALS = [
  { id: 'combo-3', label: 'Hit-Combo', type: 'bestCombo', target: 3, reward: 420 },
  { id: 'parry-1', label: 'Perfect Parry', type: 'parries', target: 1, reward: 360 },
  { id: 'throw-1', label: 'Wurf landen', type: 'throws', target: 1, reward: 300 },
  { id: 'tech-1', label: 'Wurf-Tech', type: 'throwTechs', target: 1, reward: 340 },
  { id: 'whiff-2', label: '2 Whiff-Punishes', type: 'whiffPunishes', target: 2, reward: 520 },
  { id: 'launcher-1', label: 'Launcher landen', type: 'launchers', target: 1, reward: 380 },
  { id: 'wall-1', label: 'Wall-Splat', type: 'wallSplats', target: 1, reward: 460 },
  { id: 'counter-2', label: '2 Counter-Hits', type: 'counters', target: 2, reward: 420 },
  { id: 'break-1', label: 'Guard Break', type: 'guardBreaks', target: 1, reward: 500 },
  { id: 'cancel-2', label: '2 Special-Cancels', type: 'cancels', target: 2, reward: 520 },
  { id: 'ex-1', label: 'EX-Technik', type: 'exMoves', target: 1, reward: 540 },
  { id: 'super-1', label: 'Super landen', type: 'supers', target: 1, reward: 640 },
  { id: 'learn-2', label: 'Lernfragen sichern', type: 'learns', target: 2, reward: 460, learnOnly: true },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function makeInputState() {
  return {
    left: false,
    right: false,
    up: false,
    down: false,
    light: false,
    heavy: false,
    special: false,
    ex: false,
    super: false,
    throw: false,
    parry: false,
    block: false,
    dash: false,
    tapUntil: {},
  };
}

function setBufferedInput(input, name, pressed) {
  if (pressed) {
    input[name] = true;
    if (FIGHTER_TAP_INPUTS.has(name)) input.tapUntil[name] = performance.now() + FIGHTER_INPUT_BUFFER_MS;
    return;
  }
  if (FIGHTER_TAP_INPUTS.has(name) && input.tapUntil[name] > performance.now()) return;
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

function makeFighter(id, x, facing, palette) {
  return {
    id,
    x,
    y: FLOOR,
    vx: 0,
    vy: 0,
    facing,
    width: 56,
    height: 142,
    health: 100,
    stamina: 100,
    meter: 0,
    combo: 0,
    score: 0,
    grounded: true,
    crouch: 0,
    guard: 0,
    hitstun: 0,
    invuln: 0,
    dashCooldown: 0,
    attack: null,
    attackCooldown: 0,
    throwCooldown: 0,
    hitFreeze: 0,
    cancelWindow: 0,
    cancelFlash: 0,
    parryTimer: 0,
    parryCooldown: 0,
    parryFlash: 0,
    counterTimer: 0,
    knowledge: 0,
    palette,
  };
}

function makeInitialGame(mode = 'arcade') {
  return {
    mode,
    time: ROUND_TIME,
    elapsed: 0,
    phase: 'fight',
    message: mode === 'learn' ? 'Sammle die richtige Wortart fuer Bonus-Schaden.' : 'Round 1 - Fight!',
    messageTimer: 2.2,
    player: makeFighter('player', 360, 1, {
      suit: '#2563eb',
      accent: '#67e8f9',
      skin: '#f8caa7',
      name: 'Faska',
    }),
    enemy: makeFighter('enemy', 920, -1, {
      suit: '#dc2626',
      accent: '#fca5a5',
      skin: '#e8b892',
      name: 'Kuro',
    }),
    cameraShake: 0,
    hitStop: 0,
    sparks: [],
    promptIndex: 0,
    orbCooldown: mode === 'learn' ? 1.25 : 0,
    aiTimer: 0,
    round: 1,
    playerRounds: 0,
    enemyRounds: 0,
    roundPause: 0,
    lastRoundWinner: null,
    stats: {
      bestCombo: 0,
      parries: 0,
      throws: 0,
      throwTechs: 0,
      whiffPunishes: 0,
      launchers: 0,
      wallSplats: 0,
      counters: 0,
      guardBreaks: 0,
      cancels: 0,
      exMoves: 0,
      supers: 0,
      learns: 0,
    },
    goals: STYLE_GOALS
      .filter((goal) => mode === 'learn' || !goal.learnOnly)
      .map((goal) => ({ ...goal, done: false })),
  };
}

function currentPrompt(game) {
  return LEARN_PROMPTS[game.promptIndex % LEARN_PROMPTS.length];
}

function statValue(game, goal) {
  return game.stats[goal.type] || 0;
}

function completeStyleGoal(game, goal) {
  if (goal.done || statValue(game, goal) < goal.target) return;
  goal.done = true;
  game.player.score += goal.reward;
  game.player.meter = clamp(game.player.meter + 18, 0, 100);
  game.player.stamina = 100;
  game.message = `${goal.label} +${goal.reward}`;
  game.messageTimer = 1.0;
  addFloater(game, game.player.x, game.player.y - 172, 'MISSION', '#5eead4');
  spawnSpark(game, game.player.x, game.player.y - 100, '#5eead4', 16);
}

function evaluateStyleGoals(game) {
  game.goals.forEach((goal) => completeStyleGoal(game, goal));
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

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function fighterBody(fighter) {
  const h = fighter.height - fighter.crouch * 42;
  return {
    x: fighter.x - fighter.width / 2,
    y: fighter.y - h,
    w: fighter.width,
    h,
  };
}

function attackHitbox(fighter) {
  if (!fighter.attack || fighter.attack.hasHit) return null;
  const attack = fighter.attack;
  if (attack.timer < attack.startup || attack.timer > attack.startup + attack.active) return null;
  const body = fighterBody(fighter);
  const y = body.y + (attack.low ? 78 : 36);
  return {
    x: fighter.facing > 0 ? body.x + body.w - 6 : body.x - attack.range + 6,
    y,
    w: attack.range,
    h: attack.low ? 46 : 58,
    damage: attack.damage,
    knockback: attack.knockback,
    stun: attack.stun,
    kind: attack.kind,
    low: attack.low === true,
    overhead: attack.overhead === true,
    launcher: attack.launcher === true,
    armorBreak: attack.armorBreak === true,
  };
}

function beginAttack(fighter, type, options = {}) {
  const cancel = options.cancel === true;
  if ((!cancel && fighter.attack) || fighter.attackCooldown > 0 || fighter.hitstun > 0) return false;
  const staminaCosts = {
    light: 7,
    low: 9,
    sweep: 14,
    heavy: 15,
    air: 12,
    launcher: 26,
    special: 28,
    ex: 24,
    super: 36,
  };
  const meterCosts = { light: 0, low: 0, sweep: 0, heavy: 0, air: 0, launcher: 8, special: 12, ex: 34, super: 60 };
  if (fighter.stamina < staminaCosts[type]) return false;
  if (fighter.meter < meterCosts[type]) return false;

  const attacks = {
    light: {
      kind: 'light',
      startup: 0.08,
      active: 0.13,
      recovery: 0.22,
      damage: 7,
      range: 76,
      knockback: 180,
      stun: 0.22,
      low: false,
      hasHit: false,
      timer: 0,
    },
    low: {
      kind: 'low',
      startup: 0.1,
      active: 0.14,
      recovery: 0.25,
      damage: 8,
      range: 74,
      knockback: 155,
      stun: 0.26,
      low: true,
      hasHit: false,
      timer: 0,
    },
    sweep: {
      kind: 'sweep',
      startup: 0.14,
      active: 0.16,
      recovery: 0.34,
      damage: 11,
      range: 100,
      knockback: 210,
      stun: 0.38,
      low: true,
      sweep: true,
      hasHit: false,
      timer: 0,
    },
    heavy: {
      kind: 'heavy',
      startup: 0.15,
      active: 0.16,
      recovery: 0.35,
      damage: 13,
      range: 96,
      knockback: 270,
      stun: 0.34,
      low: false,
      overhead: true,
      hasHit: false,
      timer: 0,
    },
    air: {
      kind: 'air',
      startup: 0.09,
      active: 0.18,
      recovery: 0.24,
      damage: 10,
      range: 88,
      knockback: 230,
      stun: 0.3,
      low: false,
      air: true,
      hasHit: false,
      timer: 0,
    },
    launcher: {
      kind: 'launcher',
      startup: 0.18,
      active: 0.18,
      recovery: 0.42,
      damage: 15,
      range: 118,
      knockback: 165,
      stun: 0.5,
      low: false,
      launcher: true,
      armorBreak: true,
      hasHit: false,
      timer: 0,
    },
    special: {
      kind: 'special',
      startup: 0.2,
      active: 0.2,
      recovery: 0.48,
      damage: 18,
      range: 146,
      knockback: 360,
      stun: 0.44,
      low: false,
      armorBreak: true,
      hasHit: false,
      timer: 0,
    },
    ex: {
      kind: 'ex',
      startup: 0.11,
      active: 0.22,
      recovery: 0.36,
      damage: 22,
      range: 174,
      knockback: 430,
      stun: 0.5,
      low: false,
      armorBreak: true,
      hasHit: false,
      timer: 0,
    },
    super: {
      kind: 'super',
      startup: 0.18,
      active: 0.24,
      recovery: 0.64,
      damage: 30,
      range: 214,
      knockback: 520,
      stun: 0.58,
      low: false,
      hasHit: false,
      timer: 0,
    },
  };

  fighter.attack = attacks[type];
  fighter.attack.cancel = cancel;
  fighter.stamina -= staminaCosts[type];
  fighter.meter = clamp(fighter.meter - meterCosts[type] + (type === 'special' || type === 'ex' || type === 'super' ? 2 : 7), 0, 100);
  if (cancel) {
    fighter.cancelWindow = 0;
    fighter.cancelFlash = 0.28;
  }
  return true;
}

function tryCancelAttack(game, fighter, type) {
  if (fighter.cancelWindow <= 0 || fighter.hitstun > 0) return false;
  if (!fighter.attack || fighter.attack.kind === 'special' || fighter.attack.kind === 'ex' || fighter.attack.kind === 'super') return false;
  const started = beginAttack(fighter, type, { cancel: true });
  if (!started) return false;
  game.hitStop = Math.max(game.hitStop, type === 'super' ? 0.08 : 0.045);
  game.message = type === 'super' ? 'Super Cancel!' : type === 'ex' ? 'EX Cancel!' : 'Special Cancel!';
  game.messageTimer = 0.78;
  addFloater(game, fighter.x, fighter.y - 170, type === 'super' ? 'SUPER CANCEL' : type === 'ex' ? 'EX CANCEL' : 'CANCEL', '#facc15');
  spawnSpark(game, fighter.x + fighter.facing * 46, fighter.y - 92, '#facc15', 12);
  if (fighter.id === 'player') {
    game.stats.cancels += 1;
    fighter.score += type === 'super' ? 260 : type === 'ex' ? 210 : 150;
    evaluateStyleGoals(game);
  }
  return true;
}

function spawnSpark(game, x, y, color, count = 8) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed;
    const speed = 120 + (i % 4) * 36;
    game.sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 40,
      life: 0.45,
      color,
    });
  }
}

function addFloater(game, x, y, text, color = '#facc15') {
  game.sparks.push({
    x,
    y,
    vx: 0,
    vy: -58,
    life: 0.85,
    color,
    text,
  });
}

function tryThrow(game, attacker, defender) {
  if (attacker.attack || attacker.throwCooldown > 0 || attacker.hitstun > 0 || !attacker.grounded) return false;
  if (attacker.stamina < 22) return false;
  const close = Math.abs(attacker.x - defender.x) < 72 && Math.abs(attacker.y - defender.y) < 22;
  if (!close || defender.invuln > 0) return false;
  attacker.throwCooldown = 0.85;
  attacker.attackCooldown = 0.22;
  const playerTechInput = defender.id === 'player'
    && defender.stamina >= 12
    && game.currentInput
    && (game.currentInput.throw || game.currentInput.parry || game.currentInput.dash);
  const enemyTechRead = defender.id === 'enemy'
    && defender.stamina >= 18
    && (defender.parryTimer > 0 || (defender.guard > 0 && Math.sin(game.elapsed * 8.9) > 0.25));

  if (playerTechInput || enemyTechRead) {
    attacker.stamina -= 16;
    defender.stamina -= defender.id === 'player' ? 12 : 18;
    attacker.hitstun = Math.max(attacker.hitstun, 0.18);
    defender.hitstun = Math.max(defender.hitstun, 0.14);
    attacker.vx = -attacker.facing * 260;
    defender.vx = attacker.facing * 260;
    game.cameraShake = Math.max(game.cameraShake, 8);
    game.hitStop = Math.max(game.hitStop, 0.055);
    game.message = 'Throw Tech!';
    game.messageTimer = 0.72;
    addFloater(game, defender.x, defender.y - 154, 'TECH', '#67e8f9');
    spawnSpark(game, (attacker.x + defender.x) / 2, defender.y - 96, '#67e8f9', 12);
    if (defender.id === 'player') {
      game.stats.throwTechs += 1;
      defender.score += 150;
      defender.meter = clamp(defender.meter + 18, 0, 100);
      evaluateStyleGoals(game);
    }
    return true;
  }

  attacker.stamina -= 22;
  attacker.combo += 1;
  attacker.meter = clamp(attacker.meter + 14, 0, 100);
  defender.health = clamp(defender.health - (attacker.knowledge > 0 ? 14 : 10), 0, 100);
  defender.hitstun = 0.5;
  defender.vx = attacker.facing * 420;
  defender.vy = -230;
  defender.grounded = false;
  game.cameraShake = Math.max(game.cameraShake, 11);
  game.message = 'Wurf!';
  game.messageTimer = 0.78;
  if (attacker.id === 'player') {
    attacker.score += 170 + attacker.combo * 24;
    game.stats.throws += 1;
    evaluateStyleGoals(game);
  }
  spawnSpark(game, defender.x, defender.y - 92, '#facc15', 14);
  return true;
}

function startParry(fighter) {
  if (fighter.attack || fighter.hitstun > 0 || fighter.parryCooldown > 0 || fighter.stamina < 12) return false;
  fighter.parryTimer = 0.18;
  fighter.parryCooldown = 0.82;
  fighter.parryFlash = 0.2;
  fighter.guard = 0;
  fighter.stamina -= 12;
  return true;
}

function applyHit(game, attacker, defender, hitbox) {
  if (defender.invuln > 0) return;
  const juggleHit = !defender.grounded && defender.hitstun > 0;
  if (defender.hitstun > 0 && !juggleHit) return;

  const facingDefense = defender.facing === -attacker.facing;
  if (defender.parryTimer > 0 && facingDefense && defender.stamina > 0) {
    defender.parryTimer = 0;
    defender.parryCooldown = 0.36;
    defender.parryFlash = 0.34;
    defender.meter = clamp(defender.meter + 22, 0, 100);
    defender.stamina = clamp(defender.stamina + 18, 0, 100);
    attacker.hitstun = Math.max(attacker.hitstun, 0.3);
    attacker.vx = -attacker.facing * 190;
    attacker.attack = null;
    game.cameraShake = Math.max(game.cameraShake, 10);
    game.message = 'Perfect Parry!';
    game.messageTimer = 0.72;
    addFloater(game, defender.x, defender.y - 162, 'PARRY', '#67e8f9');
    spawnSpark(game, defender.x, defender.y - 96, '#67e8f9', 14);
    if (defender.id === 'player') {
      game.stats.parries += 1;
      defender.score += 120;
      evaluateStyleGoals(game);
    }
    attacker.attack = null;
    return;
  }

  const facingBlock = defender.guard > 0 && facingDefense && defender.stamina > 4;
  const blockHeightMatches = hitbox.low ? defender.crouch > 0.5 : hitbox.overhead ? defender.crouch < 0.45 : true;
  const blocking = facingBlock && blockHeightMatches;
  const knowledgeBonus = attacker.knowledge > 0 ? 1.35 : 1;
  const enemyScale = attacker.id === 'enemy' ? 0.58 : 1;
  const counterHit = defender.attack && defender.attack.timer < defender.attack.startup + defender.attack.active && !blocking;
  const whiffPunish = defender.attack
    && !defender.attack.hasHit
    && defender.attack.timer > defender.attack.startup + defender.attack.active
    && !blocking;
  const projectedX = defender.x + attacker.facing * hitbox.knockback * 0.16;
  const wallSplat = !blocking
    && ['heavy', 'launcher', 'special', 'ex', 'super'].includes(hitbox.kind)
    && (projectedX < 102 || projectedX > WIDTH - 102);
  let damage = hitbox.damage * knowledgeBonus * enemyScale;
  let stun = hitbox.stun;
  if (counterHit) {
    damage *= 1.24;
    stun += 0.12;
  }
  if (whiffPunish) {
    damage *= 1.18;
    stun += 0.1;
  }
  if (juggleHit) {
    damage *= 0.72;
    stun *= 0.78;
  }
  if (wallSplat) {
    damage += attacker.id === 'enemy' ? 2 : 4;
    stun += 0.18;
  }

  if (blocking) {
    const guardCost = hitbox.kind === 'super' ? 38 : hitbox.kind === 'ex' ? 30 : hitbox.kind === 'special' ? 24 : hitbox.kind === 'heavy' ? 17 : 11;
    damage *= 0.22;
    stun *= 0.35;
    defender.health = clamp(defender.health - damage, 0, 100);
    defender.hitstun = Math.max(defender.hitstun, stun);
    defender.stamina = Math.max(0, defender.stamina - guardCost);
    attacker.meter = clamp(attacker.meter + 4, 0, 100);
    if (defender.stamina <= 1 && (hitbox.armorBreak || hitbox.kind === 'heavy' || hitbox.kind === 'super')) {
      defender.hitstun = 0.72;
      defender.invuln = 0.08;
      defender.vx = attacker.facing * 300;
      game.message = 'Guard Break!';
      game.cameraShake = Math.max(game.cameraShake, 12);
      addFloater(game, defender.x, defender.y - 154, 'BREAK', '#facc15');
      if (attacker.id === 'player') {
        game.stats.guardBreaks += 1;
        attacker.score += 160;
        evaluateStyleGoals(game);
      }
    } else {
      game.message = 'Block!';
    }
    game.messageTimer = 0.45;
    spawnSpark(game, defender.x, defender.y - 92, '#93c5fd', 5);
  } else {
    defender.health = clamp(defender.health - damage, 0, 100);
    defender.hitstun = stun;
    defender.invuln = 0.08;
    defender.hitFreeze = Math.max(defender.hitFreeze, hitbox.kind === 'super' ? 0.13 : hitbox.kind === 'ex' ? 0.105 : hitbox.kind === 'special' ? 0.09 : 0.055);
    attacker.hitFreeze = Math.max(attacker.hitFreeze, hitbox.kind === 'super' ? 0.11 : hitbox.kind === 'ex' ? 0.09 : hitbox.kind === 'special' ? 0.075 : 0.045);
    defender.vx = wallSplat ? -attacker.facing * 260 : attacker.facing * hitbox.knockback;
    defender.vy = hitbox.launcher
      ? -610
      : wallSplat
        ? -360
        : hitbox.kind === 'heavy' || hitbox.kind === 'special' || hitbox.kind === 'ex' || hitbox.kind === 'super'
          ? -280
          : hitbox.kind === 'sweep'
            ? -90
            : -130;
    defender.grounded = false;
    attacker.combo += 1;
    attacker.cancelWindow = hitbox.kind === 'light' || hitbox.kind === 'low' || hitbox.kind === 'heavy' || hitbox.kind === 'air' ? 0.28 : 0;
    if (attacker.id === 'player') {
      game.stats.bestCombo = Math.max(game.stats.bestCombo, attacker.combo);
      if (hitbox.launcher) game.stats.launchers += 1;
      if (wallSplat) game.stats.wallSplats += 1;
      if (counterHit) game.stats.counters += 1;
      if (whiffPunish) game.stats.whiffPunishes += 1;
      if (hitbox.kind === 'ex') game.stats.exMoves += 1;
      if (hitbox.kind === 'super') game.stats.supers += 1;
      evaluateStyleGoals(game);
    }
    attacker.score += Math.round(damage * 12) + attacker.combo * 18;
    attacker.meter = clamp(attacker.meter + (hitbox.kind === 'special' || hitbox.kind === 'ex' || hitbox.kind === 'super' ? 9 : 13), 0, 100);
    game.message = wallSplat
      ? 'Wall-Splat!'
      : hitbox.launcher
        ? 'Launcher!'
        : whiffPunish
          ? 'Whiff Punish!'
        : hitbox.kind === 'ex'
          ? 'EX Treffer!'
        : juggleHit
          ? `${attacker.combo} Hit Juggle`
          : counterHit ? 'Counter Hit!' : attacker.combo > 1 ? `${attacker.combo} Hit Combo` : 'Treffer!';
    game.messageTimer = 0.72;
    game.cameraShake = Math.max(game.cameraShake, hitbox.kind === 'super' ? 22 : hitbox.kind === 'ex' ? 18 : hitbox.kind === 'special' ? 14 : 8);
    game.hitStop = Math.max(game.hitStop, hitbox.kind === 'super' ? 0.11 : hitbox.kind === 'ex' ? 0.09 : hitbox.kind === 'special' ? 0.075 : 0.045);
    if (counterHit) {
      defender.counterTimer = 0.45;
      addFloater(game, defender.x, defender.y - 162, 'COUNTER', '#facc15');
    }
    if (whiffPunish) addFloater(game, defender.x, defender.y - 146, 'PUNISH', '#fef08a');
    if (wallSplat) addFloater(game, defender.x, defender.y - 190, 'WALL', '#fef08a');
    if (hitbox.launcher) addFloater(game, defender.x, defender.y - 178, 'LAUNCH', '#67e8f9');
    spawnSpark(game, defender.x, defender.y - 94, hitbox.kind === 'super' ? '#fef08a' : hitbox.kind === 'ex' ? '#5eead4' : hitbox.kind === 'special' ? '#facc15' : '#f87171', hitbox.kind === 'super' || hitbox.kind === 'ex' ? 18 : 10);
  }

  attacker.attack.hasHit = true;
}

function updateFighterPhysics(fighter, dt) {
  fighter.hitstun = Math.max(0, fighter.hitstun - dt);
  fighter.invuln = Math.max(0, fighter.invuln - dt);
  fighter.dashCooldown = Math.max(0, fighter.dashCooldown - dt);
  fighter.attackCooldown = Math.max(0, fighter.attackCooldown - dt);
  fighter.throwCooldown = Math.max(0, fighter.throwCooldown - dt);
  fighter.hitFreeze = Math.max(0, fighter.hitFreeze - dt);
  fighter.cancelWindow = Math.max(0, fighter.cancelWindow - dt);
  fighter.cancelFlash = Math.max(0, fighter.cancelFlash - dt);
  fighter.parryTimer = Math.max(0, fighter.parryTimer - dt);
  fighter.parryCooldown = Math.max(0, fighter.parryCooldown - dt);
  fighter.parryFlash = Math.max(0, fighter.parryFlash - dt);
  fighter.counterTimer = Math.max(0, fighter.counterTimer - dt);
  fighter.knowledge = Math.max(0, fighter.knowledge - dt);

  if (fighter.attack) {
    fighter.attack.timer += dt;
    if (fighter.attack.timer > fighter.attack.startup + fighter.attack.active + fighter.attack.recovery) {
      fighter.attack = null;
      fighter.attackCooldown = 0.04;
    }
  }

  if (fighter.hitFreeze > 0) return;

  fighter.vy += GRAVITY * dt;
  fighter.x += fighter.vx * dt;
  fighter.y += fighter.vy * dt;
  fighter.vx *= Math.pow(fighter.grounded ? 0.82 : 0.94, dt * 60);
  fighter.x = clamp(fighter.x, 74, WIDTH - 74);

  if (fighter.y >= FLOOR) {
    fighter.y = FLOOR;
    fighter.vy = 0;
    fighter.grounded = true;
  } else {
    fighter.grounded = false;
  }

  fighter.stamina = clamp(fighter.stamina + (fighter.guard > 0 ? 9 : 22) * dt, 0, 100);
  if (!fighter.attack && fighter.hitstun <= 0) fighter.combo = 0;
}

function updatePlayer(game, input, dt) {
  const player = game.player;
  const enemy = game.enemy;
  if (player.cancelWindow > 0) {
    if (input.super && tryCancelAttack(game, player, 'super')) return;
    if (input.ex && tryCancelAttack(game, player, 'ex')) return;
    if (input.special && tryCancelAttack(game, player, 'special')) return;
  }
  const locked = player.hitstun > 0 || player.attack?.kind === 'special' || player.attack?.kind === 'super';
  const axis = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  player.facing = player.x <= enemy.x ? 1 : -1;
  if (input.parry) startParry(player);
  player.guard = input.block && player.parryTimer <= 0 && player.grounded && player.stamina > 3 ? 1 : 0;
  player.crouch = input.down && player.grounded ? 1 : 0;

  if (!locked && player.guard <= 0) {
    const speed = player.crouch ? 120 : 260;
    player.vx += axis * speed * 7 * dt;
    player.vx = clamp(player.vx, -speed, speed);
    if (input.up && player.grounded) {
      player.vy = -650;
      player.grounded = false;
    }
    if (input.dash && player.dashCooldown <= 0 && player.stamina >= 18) {
      const dashDir = axis !== 0 ? axis : player.facing;
      player.vx = dashDir * (dashDir === player.facing ? 680 : 520);
      player.invuln = dashDir === player.facing ? 0.14 : 0.2;
      player.dashCooldown = 0.48;
      player.stamina -= 18;
      game.message = dashDir === player.facing ? 'Dash!' : 'Backdash!';
      game.messageTimer = 0.35;
    }
  }

  if (!locked && player.guard <= 0) {
    if (input.throw) tryThrow(game, player, enemy);
    else if (input.super) beginAttack(player, 'super');
    else if (input.ex) beginAttack(player, 'ex');
    else if (input.special) beginAttack(player, player.crouch ? 'launcher' : 'special');
    else if (input.heavy) beginAttack(player, player.grounded ? (player.crouch ? 'sweep' : 'heavy') : 'air');
    else if (input.light) beginAttack(player, player.grounded ? (player.crouch ? 'low' : 'light') : 'air');
  }
}

function updateEnemyAI(game, dt) {
  const enemy = game.enemy;
  const player = game.player;
  if (enemy.health <= 0 || enemy.hitstun > 0 || game.elapsed < 2.2) {
    enemy.guard = 0;
    return;
  }

  enemy.facing = enemy.x <= player.x ? 1 : -1;
  game.aiTimer -= dt;
  const distance = Math.abs(player.x - enemy.x);
  const playerThreat = player.attack && distance < 140;
  if (playerThreat && enemy.parryCooldown <= 0 && enemy.stamina > 44 && Math.sin(game.elapsed * 9.7) > 0.55) {
    startParry(enemy);
  }
  enemy.guard = playerThreat && enemy.parryTimer <= 0 && enemy.stamina > 28 ? 1 : 0;
  enemy.crouch = 0;

  if (!enemy.attack && enemy.guard <= 0) {
    if (distance > 138) {
      enemy.vx += enemy.facing * 210 * 4.4 * dt;
      enemy.vx = clamp(enemy.vx, -210, 210);
    } else if (distance < 64) {
      if (enemy.stamina > 46 && game.aiTimer <= 0 && Math.sin(game.elapsed * 3.1) > 0.15) {
        tryThrow(game, enemy, player);
        game.aiTimer = 1.35;
      } else {
        enemy.vx -= enemy.facing * 180 * 4.2 * dt;
      }
    } else if (game.aiTimer <= 0) {
      const guardedPlayer = player.guard > 0 && player.stamina > 15;
      const choice = enemy.meter > 76 && game.time < 62
        ? 'super'
        : enemy.meter > 46 && distance < 154 && Math.sin(game.elapsed * 2.7) > 0.2
          ? 'ex'
        : guardedPlayer && enemy.stamina > 54
          ? 'launcher'
          : player.crouch > 0.5 && enemy.stamina > 46
            ? 'heavy'
            : enemy.stamina > 76 && game.time < 70
              ? 'special'
              : distance < 82 && enemy.stamina > 38
                ? 'sweep'
                : distance < 92 ? 'light' : 'special';
      beginAttack(enemy, choice);
      game.aiTimer = 1.08 + (game.elapsed % 0.44);
    }
  }
}

function resolveFighterPushback(game) {
  const player = game.player;
  const enemy = game.enemy;
  const minDistance = 82;
  const delta = enemy.x - player.x || 1;
  const overlap = minDistance - Math.abs(delta);
  if (overlap <= 0) return;
  const dir = delta > 0 ? 1 : -1;
  const playerCanMove = player.hitstun <= 0 || player.grounded;
  const enemyCanMove = enemy.hitstun <= 0 || enemy.grounded;
  if (playerCanMove) player.x -= dir * overlap * 0.5;
  if (enemyCanMove) enemy.x += dir * overlap * 0.5;
  player.x = clamp(player.x, 74, WIDTH - 74);
  enemy.x = clamp(enemy.x, 74, WIDTH - 74);
  player.facing = player.x <= enemy.x ? 1 : -1;
  enemy.facing = enemy.x <= player.x ? 1 : -1;
}

function optionPositions(prompt) {
  const xs = [240, 640, 1040];
  return prompt.options.map((label, index) => ({
    label,
    x: xs[index],
    y: 414,
    correct: label === prompt.answer,
  }));
}

function updateLearnOrbs(game, dt) {
  if (game.mode !== 'learn' || game.phase !== 'fight') return;
  game.orbCooldown = Math.max(0, game.orbCooldown - dt);
  if (game.orbCooldown > 0) return;
  const playerBody = fighterBody(game.player);
  const prompt = currentPrompt(game);

  optionPositions(prompt).forEach((orb) => {
    const orbBody = { x: orb.x - 48, y: orb.y - 48, w: 96, h: 96 };
    if (!rectsOverlap(playerBody, orbBody)) return;

    if (orb.correct) {
      game.player.knowledge = 6;
      game.player.meter = clamp(game.player.meter + 22, 0, 100);
      game.player.stamina = clamp(game.player.stamina + 24, 0, 100);
      game.player.score += 160;
      game.stats.learns += 1;
      game.promptIndex += 1;
      game.message = `${prompt.word}: ${prompt.answer}`;
      game.messageTimer = 1.35;
      spawnSpark(game, orb.x, orb.y, '#5eead4', 12);
      evaluateStyleGoals(game);
    } else {
      game.player.stamina = Math.max(0, game.player.stamina - 22);
      game.message = `${prompt.word} ist nicht ${orb.label}`;
      game.messageTimer = 1.1;
      spawnSpark(game, orb.x, orb.y, '#fb7185', 8);
    }
    game.orbCooldown = 0.95;
  });
}

function resetFighterForRound(fighter, x, facing) {
  fighter.x = x;
  fighter.y = FLOOR;
  fighter.vx = 0;
  fighter.vy = 0;
  fighter.facing = facing;
  fighter.health = 100;
  fighter.stamina = 100;
  fighter.combo = 0;
  fighter.grounded = true;
  fighter.crouch = 0;
  fighter.guard = 0;
  fighter.hitstun = 0;
  fighter.invuln = 0;
  fighter.dashCooldown = 0;
  fighter.attack = null;
  fighter.attackCooldown = 0;
  fighter.throwCooldown = 0;
  fighter.hitFreeze = 0;
  fighter.cancelWindow = 0;
  fighter.cancelFlash = 0;
  fighter.parryTimer = 0;
  fighter.parryCooldown = 0;
  fighter.parryFlash = 0;
  fighter.counterTimer = 0;
  fighter.knowledge = 0;
}

function startNextRound(game) {
  game.phase = 'fight';
  game.round += 1;
  game.time = ROUND_TIME;
  game.elapsed = 0;
  game.message = `Round ${game.round} - Fight!`;
  game.messageTimer = 1.7;
  game.cameraShake = 0;
  game.hitStop = 0;
  game.sparks = [];
  game.orbCooldown = game.mode === 'learn' ? 1.0 : 0;
  game.aiTimer = 0.5;
  resetFighterForRound(game.player, 360, 1);
  resetFighterForRound(game.enemy, 920, -1);
}

function finishRound(game, onFinish) {
  const playerWon = game.enemy.health <= 0 || (game.time <= 0 && game.player.health >= game.enemy.health);
  const draw = game.time <= 0 && Math.abs(game.player.health - game.enemy.health) < 2;
  if (!draw) {
    if (playerWon) game.playerRounds += 1;
    else game.enemyRounds += 1;
  }
  game.lastRoundWinner = draw ? 'draw' : playerWon ? 'player' : 'enemy';
  game.phase = game.playerRounds >= ROUNDS_TO_WIN || game.enemyRounds >= ROUNDS_TO_WIN ? 'result' : 'roundOver';
  game.roundPause = 2.2;
  game.message = draw ? 'Doppel-K.O.' : playerWon ? 'Runde an Faska' : 'Runde an Kuro';
  game.messageTimer = 2.2;
  game.cameraShake = Math.max(game.cameraShake, 12);

  if (game.phase === 'result') {
    const playerMatchWon = game.playerRounds > game.enemyRounds;
    const result = playerMatchWon ? 'Sieg!' : game.playerRounds === game.enemyRounds ? 'Unentschieden' : 'Niederlage';
    onFinish({
      result,
      score: game.player.score + (playerMatchWon ? 1000 + Math.round(game.player.health * 8) : 0),
      playerHealth: Math.round(game.player.health),
      enemyHealth: Math.round(game.enemy.health),
      playerRounds: game.playerRounds,
      enemyRounds: game.enemyRounds,
      round: game.round,
    });
  }
}

function updateGame(game, input, dt, onFinish) {
  game.currentInput = input;
  if (game.phase === 'roundOver') {
    game.elapsed += dt;
    game.roundPause -= dt;
    game.messageTimer = Math.max(0, game.messageTimer - dt);
    updateFighterPhysics(game.player, dt);
    updateFighterPhysics(game.enemy, dt);
    if (game.roundPause <= 0) startNextRound(game);
    return;
  }
  if (game.phase !== 'fight') return;
  game.elapsed += dt;
  game.time -= dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.cameraShake = Math.max(0, game.cameraShake - 36 * dt);
  game.hitStop = Math.max(0, game.hitStop - dt);
  const simDt = game.hitStop > 0 ? dt * 0.18 : dt;

  updatePlayer(game, input, simDt);
  updateEnemyAI(game, simDt);
  updateFighterPhysics(game.player, simDt);
  updateFighterPhysics(game.enemy, simDt);
  resolveFighterPushback(game);

  const playerHit = attackHitbox(game.player);
  const enemyHit = attackHitbox(game.enemy);
  if (playerHit && rectsOverlap(playerHit, fighterBody(game.enemy))) applyHit(game, game.player, game.enemy, playerHit);
  if (enemyHit && rectsOverlap(enemyHit, fighterBody(game.player))) applyHit(game, game.enemy, game.player, enemyHit);

  updateLearnOrbs(game, dt);

  game.sparks = game.sparks
    .map((spark) => ({
      ...spark,
      x: spark.x + spark.vx * simDt,
      y: spark.y + spark.vy * simDt,
      vy: spark.vy + 480 * simDt,
      life: spark.life - dt,
    }))
    .filter((spark) => spark.life > 0);

  if (game.player.health <= 0 || game.enemy.health <= 0 || game.time <= 0) finishRound(game, onFinish);
}

function drawArena(ctx, game) {
  const shakeX = game.cameraShake > 0 ? Math.sin(game.elapsed * 82) * game.cameraShake : 0;
  const shakeY = game.cameraShake > 0 ? Math.cos(game.elapsed * 73) * game.cameraShake * 0.4 : 0;
  ctx.save();
  ctx.translate(shakeX, shakeY);

  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, ARENA_COLORS.sky);
  gradient.addColorStop(0.6, '#162235');
  gradient.addColorStop(1, '#0b1020');
  ctx.fillStyle = gradient;
  ctx.fillRect(-40, -40, WIDTH + 80, HEIGHT + 80);

  ctx.fillStyle = 'rgba(56,189,248,.09)';
  for (let i = 0; i < 7; i += 1) {
    drawRoundedRect(ctx, 80 + i * 180, 116 + (i % 2) * 34, 94, 240, 16);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(2,6,23,.45)';
  drawRoundedRect(ctx, 70, 356, WIDTH - 140, 82, 24);
  ctx.fill();
  for (let i = 0; i < 18; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(148,163,184,.26)' : 'rgba(56,189,248,.18)';
    ctx.beginPath();
    ctx.arc(104 + i * 62, 410 + Math.sin(game.elapsed * 2 + i) * 7, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = ARENA_COLORS.floor;
  ctx.fillRect(-40, FLOOR, WIDTH + 80, HEIGHT - FLOOR + 40);
  ctx.strokeStyle = 'rgba(255,255,255,.16)';
  ctx.lineWidth = 4;
  for (let x = -60; x < WIDTH + 80; x += 96) {
    ctx.beginPath();
    ctx.moveTo(x, FLOOR + 10);
    ctx.lineTo(x + 56, HEIGHT + 20);
    ctx.stroke();
  }
  ctx.strokeStyle = '#67e8f9';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, FLOOR);
  ctx.lineTo(WIDTH, FLOOR);
  ctx.stroke();

  [
    { x: 34, label: 'WALL' },
    { x: WIDTH - 114, label: 'WALL' },
  ].forEach((zone) => {
    ctx.fillStyle = 'rgba(250,204,21,.11)';
    drawRoundedRect(ctx, zone.x, FLOOR - 198, 80, 198, 18);
    ctx.fill();
    ctx.strokeStyle = 'rgba(250,204,21,.45)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = 'rgba(254,240,138,.7)';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(zone.label, zone.x + 40, FLOOR - 172);
  });

  if (game.mode === 'learn') drawLearnOrbs(ctx, game);
  ctx.restore();
}

function drawHealthBar(ctx, x, y, w, h, value, color, alignRight = false) {
  ctx.fillStyle = 'rgba(2,6,23,.72)';
  drawRoundedRect(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.14)';
  drawRoundedRect(ctx, x + 5, y + 5, w - 10, h - 10, 7);
  ctx.fill();
  const fillW = (w - 10) * clamp(value / 100, 0, 1);
  ctx.fillStyle = color;
  if (alignRight) drawRoundedRect(ctx, x + w - 5 - fillW, y + 5, fillW, h - 10, 7);
  else drawRoundedRect(ctx, x + 5, y + 5, fillW, h - 10, 7);
  ctx.fill();
}

function drawHud(ctx, game) {
  ctx.save();
  drawHealthBar(ctx, 38, 30, 438, 34, game.player.health, ARENA_COLORS.blue);
  drawHealthBar(ctx, WIDTH - 476, 30, 438, 34, game.enemy.health, ARENA_COLORS.red, true);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 22px Outfit, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(game.player.palette.name, 42, 88);
  ctx.textAlign = 'right';
  ctx.fillText(game.enemy.palette.name, WIDTH - 42, 88);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#facc15';
  ctx.font = '900 46px Outfit, sans-serif';
  ctx.fillText(`${Math.ceil(game.time)}`, WIDTH / 2, 68);
  ctx.font = '800 14px Outfit, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`${game.mode === 'learn' ? 'LEARNCADE FIGHTER PRO' : 'FASKA FIGHTER PRO'} · ROUND ${game.round}`, WIDTH / 2, 94);

  [0, 1].forEach((index) => {
    ctx.fillStyle = index < game.playerRounds ? ARENA_COLORS.blue : 'rgba(148,163,184,.22)';
    ctx.beginPath();
    ctx.arc(64 + index * 25, 96, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = index < game.enemyRounds ? ARENA_COLORS.red : 'rgba(148,163,184,.22)';
    ctx.beginPath();
    ctx.arc(WIDTH - 64 - index * 25, 96, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  drawHealthBar(ctx, 38, 106, 220, 16, game.player.stamina, '#22c55e');
  drawHealthBar(ctx, 38, 130, 220, 12, game.player.meter, ARENA_COLORS.gold);
  drawHealthBar(ctx, WIDTH - 258, 106, 220, 16, game.enemy.stamina, '#22c55e', true);
  drawHealthBar(ctx, WIDTH - 258, 130, 220, 12, game.enemy.meter, ARENA_COLORS.gold, true);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 11px Outfit, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Combo ${game.player.combo} · Best ${game.stats.bestCombo} · Wall ${game.stats.wallSplats} · EX ${game.stats.exMoves} · Score ${game.player.score}`, 38, 160);
  ctx.fillStyle = game.player.parryCooldown <= 0 ? '#67e8f9' : '#94a3b8';
  ctx.fillText(`Parry ${game.player.parryCooldown <= 0 ? 'ready' : game.player.parryCooldown.toFixed(1)}`, 38, 178);
  ctx.fillStyle = '#fef08a';
  ctx.fillText(`Counter ${game.stats.counters} · Whiff ${game.stats.whiffPunishes} · Tech ${game.stats.throwTechs} · Break ${game.stats.guardBreaks}`, 38, 196);
  ctx.textAlign = 'right';
  ctx.fillText(`Combo ${game.enemy.combo}`, WIDTH - 38, 160);

  const missionX = game.isPortraitTouch ? CENTER_X - 190 : WIDTH - 404;
  const missionY = game.isPortraitTouch ? HEIGHT - 222 : HEIGHT - 230;
  const missionW = game.isPortraitTouch ? 380 : 366;
  const missionRows = game.isPortraitTouch ? 7 : 10;
  ctx.fillStyle = 'rgba(2,6,23,.72)';
  drawRoundedRect(ctx, missionX, missionY, missionW, game.isPortraitTouch ? 152 : 190, 16);
  ctx.fill();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '900 13px Outfit, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('STYLE-MISSIONEN', missionX + 22, missionY + 26);
  game.goals.slice(0, missionRows).forEach((goal, index) => {
    const progress = clamp(statValue(game, goal), 0, goal.target);
    ctx.fillStyle = goal.done ? '#86efac' : '#cbd5e1';
    ctx.fillText(`${goal.done ? 'OK' : `${progress}/${goal.target}`} ${goal.label}`, missionX + 22, missionY + 48 + index * 16);
  });

  if (game.mode === 'learn') {
    const prompt = currentPrompt(game);
    ctx.fillStyle = 'rgba(2,6,23,.72)';
    drawRoundedRect(ctx, WIDTH / 2 - 330, 116, 660, 74, 18);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '900 20px Outfit, sans-serif';
    ctx.fillText(prompt.sentence, WIDTH / 2, 146);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 15px Outfit, sans-serif';
    ctx.fillText(`${prompt.subject}: ${prompt.instruction} "${prompt.word}"`, WIDTH / 2, 172);
  }

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.68)';
    drawRoundedRect(ctx, WIDTH / 2 - 220, 202, 440, 56, 18);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 28px Outfit, sans-serif';
    ctx.fillText(game.message, WIDTH / 2, 239);
  }

  ctx.restore();
}

function drawLearnOrbs(ctx, game) {
  const prompt = currentPrompt(game);
  optionPositions(prompt).forEach((orb, index) => {
    const pulse = Math.sin(game.elapsed * 4 + index) * 4;
    ctx.save();
    ctx.globalAlpha = game.orbCooldown > 0 ? 0.42 : 0.92;
    ctx.shadowColor = '#a78bfa';
    ctx.shadowBlur = 22;
    ctx.fillStyle = index % 2 === 0 ? 'rgba(79,70,229,.84)' : 'rgba(37,99,235,.84)';
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, 44 + pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 17px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(orb.label, orb.x, orb.y);
    ctx.restore();
  });
}

function drawFighter(ctx, fighter, game) {
  const body = fighterBody(fighter);
  const facing = fighter.facing;
  const attack = fighter.attack;
  const punch = attack ? Math.sin(Math.min(1, attack.timer / Math.max(0.01, attack.startup + attack.active)) * Math.PI) : 0;
  const guardOffset = fighter.guard > 0 ? 14 : 0;
  const glow = fighter.cancelFlash > 0 ? '#facc15' : fighter.knowledge > 0 ? '#5eead4' : fighter.invuln > 0 ? '#facc15' : null;

  ctx.save();
  if (glow) {
    ctx.shadowColor = glow;
    ctx.shadowBlur = 26;
  }
  ctx.translate(fighter.x, fighter.y);
  ctx.scale(facing, 1);

  ctx.fillStyle = 'rgba(0,0,0,.34)';
  ctx.beginPath();
  ctx.ellipse(0, 8, 48, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = fighter.palette.suit;
  drawRoundedRect(ctx, -30, -118 + fighter.crouch * 26, 60, 74 - fighter.crouch * 18, 16);
  ctx.fill();

  ctx.fillStyle = fighter.palette.skin;
  ctx.beginPath();
  ctx.arc(0, -142 + fighter.crouch * 34, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111827';
  ctx.fillRect(8, -148 + fighter.crouch * 34, 6, 6);

  ctx.strokeStyle = fighter.palette.accent;
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-20, -52 + fighter.crouch * 14);
  ctx.lineTo(-26, -8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(18, -52 + fighter.crouch * 14);
  ctx.lineTo(24, -8);
  ctx.stroke();

  ctx.strokeStyle = attack ? '#fef3c7' : fighter.palette.accent;
  ctx.lineWidth = 11;
  ctx.beginPath();
  ctx.moveTo(-26, -100 + fighter.crouch * 24);
  ctx.lineTo(-48 - guardOffset, -78 + fighter.crouch * 20);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(24, -100 + fighter.crouch * 24);
  ctx.lineTo(
    42 + punch * (attack?.kind === 'super' ? 126 : attack?.kind === 'special' ? 92 : attack?.kind === 'heavy' ? 62 : 38),
    attack?.kind === 'low' ? -48 + fighter.crouch * 20 : -86 + fighter.crouch * 20,
  );
  ctx.stroke();

  if (attack?.kind === 'sweep') {
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(24 + punch * 34, -22, 46, 0.15, 1.85);
    ctx.stroke();
  }

  if (attack?.kind === 'launcher') {
    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(40, -48);
    ctx.lineTo(74 + punch * 34, -132 - punch * 42);
    ctx.stroke();
  }

  if (fighter.guard > 0) {
    ctx.strokeStyle = 'rgba(147,197,253,.78)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(44, -90, 44, -1.2, 1.2);
    ctx.stroke();
  }

  if (fighter.parryTimer > 0 || fighter.parryFlash > 0) {
    ctx.strokeStyle = fighter.parryTimer > 0 ? 'rgba(103,232,249,.95)' : 'rgba(103,232,249,.55)';
    ctx.lineWidth = fighter.parryTimer > 0 ? 9 : 5;
    ctx.beginPath();
    ctx.arc(26, -92, fighter.parryTimer > 0 ? 58 : 46, -1.45, 1.45);
    ctx.stroke();
  }

  if (attack?.kind === 'special' || attack?.kind === 'ex' || attack?.kind === 'super') {
    ctx.strokeStyle = attack.kind === 'super' ? 'rgba(254,240,138,.9)' : attack.kind === 'ex' ? 'rgba(94,234,212,.9)' : 'rgba(250,204,21,.82)';
    ctx.lineWidth = attack.kind === 'super' ? 12 : attack.kind === 'ex' ? 10 : 8;
    ctx.beginPath();
    ctx.arc(72, -88, (attack.kind === 'super' ? 54 : attack.kind === 'ex' ? 46 : 38) + punch * (attack.kind === 'super' ? 82 : attack.kind === 'ex' ? 68 : 54), -0.65, 0.65);
    ctx.stroke();
  }

  if (fighter.cancelWindow > 0) {
    ctx.strokeStyle = 'rgba(250,204,21,.7)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, -88, 72 + Math.sin(game.elapsed * 18) * 6, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();

  const hitbox = attackHitbox(fighter);
  if (hitbox && game.mode === 'learn') {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#fde68a';
    drawRoundedRect(ctx, hitbox.x, hitbox.y, hitbox.w, hitbox.h, 10);
    ctx.fill();
    ctx.restore();
  }

  if (fighter.hitstun > 0) {
    ctx.save();
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 22px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(fighter.counterTimer > 0 ? 'COUNTER' : 'HIT', fighter.x, body.y - 16);
    ctx.restore();
  }
}

function drawSparks(ctx, sparks) {
  sparks.forEach((spark) => {
    ctx.save();
    ctx.globalAlpha = clamp(spark.life / (spark.text ? 0.85 : 0.45), 0, 1);
    if (spark.text) {
      ctx.fillStyle = spark.color;
      ctx.font = '900 20px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(spark.text, spark.x, spark.y);
    } else {
      ctx.fillStyle = spark.color;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, 5 + spark.life * 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawArena(ctx, game);
  drawFighter(ctx, game.player, game);
  drawFighter(ctx, game.enemy, game);
  drawSparks(ctx, game.sparks);
  drawHud(ctx, game);
}

export default function FaskaFighterSwarm() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameRef = useRef(makeInitialGame('arcade'));
  const inputRef = useRef(makeInputState());
  const modeRef = useRef('arcade');
  const [mode, setMode] = useState('arcade');
  const [result, setResult] = useState(null);

  const clearInput = useCallback(() => {
    inputRef.current = makeInputState();
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
    setBufferedInput(inputRef.current, name, pressed);
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

  const handleCanvasKeyDown = useCallback((event) => {
    const mapped = FIGHTER_KEY_BINDINGS.get(event.key);
    if (mapped) {
      setBufferedInput(inputRef.current, mapped, true);
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
    const mapped = FIGHTER_KEY_BINDINGS.get(event.key);
    if (!mapped) return;
    setBufferedInput(inputRef.current, mapped, false);
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

    const keyDown = (event) => {
      const mapped = FIGHTER_KEY_BINDINGS.get(event.key);
      if (mapped) {
        setBufferedInput(inputRef.current, mapped, true);
        event.preventDefault();
      }
      if (event.key === 'm' || event.key === 'M') setGameMode(modeRef.current === 'learn' ? 'arcade' : 'learn');
      if (event.key === 'r' || event.key === 'R') restart();
    };
    const keyUp = (event) => {
      const mapped = FIGHTER_KEY_BINDINGS.get(event.key);
      if (mapped) {
        setBufferedInput(inputRef.current, mapped, false);
        event.preventDefault();
      }
    };
    const finish = (summary) => setResult(summary);
    const loop = (now) => {
      const dt = Math.min(0.033, (now - last) / 1000 || 0);
      last = now;
      expireBufferedInputs(inputRef.current, now);
      try {
        gameRef.current.isPortraitTouch = window.matchMedia('(max-width: 700px) and (orientation: portrait)').matches;
        updateGame(gameRef.current, inputRef.current, dt, finish);
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

  const canvasTopChrome = 'max(8px, calc((100vh - min(100vh, calc(100vw * 9 / 16))) / 2 - 36px))';
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
    boxShadow: '0 12px 32px rgba(0,0,0,.3)',
  };
  const actionButton = {
    ...padButton,
    width: 78,
    height: 62,
    fontSize: 13,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#070b16', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
      <canvas
        className="fighter-canvas"
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        tabIndex={0}
        aria-label="Faska Fighter Pro Spielfeld"
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

      <div className="fighter-modebar" style={{ position: 'fixed', top: canvasTopChrome, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.55 }}>
          Normal
        </button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.55 }}>
          Learncade
        </button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      <div className="fighter-touch-controls fighter-stick-controls" style={{
        position: 'fixed', left: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'grid', gridTemplateColumns: '62px 62px 62px', gridTemplateRows: '62px 62px',
        gap: 8, touchAction: 'none',
      }}>
        <div />
        <button aria-label="Dash" style={padButton} {...holdButton('dash')}>↔</button>
        <div />
        <button aria-label="Links" style={padButton} {...holdButton('left')}>←</button>
        <button aria-label="Ducken" style={padButton} {...holdButton('down')}>↓</button>
        <button aria-label="Rechts" style={padButton} {...holdButton('right')}>→</button>
      </div>

      <div className="fighter-touch-controls fighter-action-controls" style={{
        position: 'fixed', right: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'flex', gap: 10, alignItems: 'flex-end', touchAction: 'none',
      }}>
        <button aria-label="Block" style={actionButton} {...holdButton('block')}>BLOCK</button>
        <button aria-label="Parry" style={{ ...actionButton, background: 'rgba(103,232,249,.78)', color: '#082f49' }} {...holdButton('parry')}>PARRY</button>
        <button aria-label="Springen" style={actionButton} {...holdButton('up')}>JUMP</button>
        <button aria-label="Leicht" style={actionButton} {...holdButton('light')}>LIGHT</button>
        <button aria-label="Hart" style={actionButton} {...holdButton('heavy')}>HEAVY</button>
        <button aria-label="Wurf" style={actionButton} {...holdButton('throw')}>THROW</button>
        <button aria-label="EX-Technik" style={{ ...actionButton, background: 'rgba(94,234,212,.82)', color: '#042f2e' }} {...holdButton('ex')}>EX</button>
        <button aria-label="Spezial" style={{ ...actionButton, width: 92, height: 76, background: 'rgba(250,204,21,.84)', color: '#111827' }} {...holdButton('special')}>
          SPECIAL
        </button>
        <button aria-label="Super" style={{ ...actionButton, width: 82, height: 76, background: 'rgba(20,184,166,.82)' }} {...holdButton('super')}>
          SUPER
        </button>
      </div>

      {result && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2,6,23,.72)', zIndex: 20, flexDirection: 'column', gap: 16,
        }}>
          <div style={{ fontSize: 58, fontWeight: 900, color: '#f8fafc' }}>{result.result}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#facc15' }}>Score {result.score}</div>
          <div style={{ fontSize: 15, color: '#cbd5e1' }}>
            Runden {result.playerRounds}:{result.enemyRounds} · Kampf {result.round} · Faska {result.playerHealth} HP · Kuro {result.enemyHealth} HP
          </div>
          <button className="btn-primary" onClick={restart}>Noch eine Runde</button>
        </div>
      )}

      <style>{`
        @media (max-width: 700px) and (orientation: portrait) {
          .fighter-canvas {
            width: 190vw !important;
            height: calc(190vw * 9 / 16) !important;
            left: 50% !important;
            right: auto !important;
            top: 70px !important;
            bottom: auto !important;
            margin: 0 auto !important;
            transform: translateX(-50%) !important;
          }

          .fighter-modebar {
            top: 10px !important;
            transform: translateX(-50%) scale(.82) !important;
            transform-origin: top center !important;
          }

          .fighter-touch-controls {
            bottom: 14px !important;
          }

          .fighter-stick-controls {
            left: 2px !important;
            transform: scale(.68) !important;
            transform-origin: bottom left !important;
          }

          .fighter-action-controls {
            right: 4px !important;
            display: grid !important;
            grid-template-columns: repeat(3, 58px) !important;
            gap: 6px !important;
            align-items: end !important;
            transform: none !important;
            transform-origin: bottom right !important;
          }

          .fighter-action-controls button {
            width: 58px !important;
            height: 50px !important;
            min-width: 0 !important;
            border-radius: 12px !important;
            font-size: 9px !important;
            padding: 0 !important;
          }
        }

        @media (pointer: fine), (min-width: 900px) {
          .fighter-touch-controls {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
