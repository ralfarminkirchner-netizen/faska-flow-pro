import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const CENTER_X = WIDTH / 2;
const ARENA = { x: 70, y: 92, w: 1140, h: 540 };

const PROMPTS = [
  {
    subject: 'Deutsch',
    sentence: 'Der Ritter oeffnet das alte Tor.',
    word: 'oeffnet',
    answer: 'Verb',
    options: ['Nomen', 'Verb', 'Adjektiv'],
  },
  {
    subject: 'Deutsch',
    sentence: 'Lumi findet einen silbernen Schluessel.',
    word: 'Schluessel',
    answer: 'Nomen',
    options: ['Nomen', 'Verb', 'Praeposition'],
  },
  {
    subject: 'Deutsch',
    sentence: 'Der dunkle Gang ist kalt.',
    word: 'dunkle',
    answer: 'Adjektiv',
    options: ['Adjektiv', 'Artikel', 'Verb'],
  },
  {
    subject: 'Deutsch',
    sentence: 'Bruno steht hinter der Mauer.',
    word: 'hinter',
    answer: 'Praeposition',
    options: ['Nomen', 'Praeposition', 'Adverb'],
  },
  {
    subject: 'Deutsch',
    sentence: 'Heute kaempfen wir mutig.',
    word: 'mutig',
    answer: 'Adverb',
    options: ['Verb', 'Adverb', 'Nomen'],
  },
  {
    subject: 'Deutsch',
    sentence: 'Der Boss bricht durch die steinerne Tuer.',
    word: 'durch',
    answer: 'Praeposition',
    options: ['Praeposition', 'Nomen', 'Adjektiv'],
  },
  {
    subject: 'Deutsch',
    sentence: 'Neun mal sechs ergibt vierundfuenfzig.',
    word: 'vierundfuenfzig',
    answer: 'Zahlwort',
    options: ['Verb', 'Zahlwort', 'Adverb'],
  },
  {
    subject: 'Englisch',
    sentence: 'The hunter moves carefully.',
    word: 'carefully',
    answer: 'Adverb',
    options: ['Adjektiv', 'Adverb', 'Nomen'],
  },
  {
    subject: 'Mathe',
    sentence: 'Der Held hat 3 Tranke und findet 2 weitere.',
    word: '3 + 2',
    answer: '5',
    options: ['4', '5', '6'],
  },
  {
    subject: 'Sachkunde',
    sentence: 'Wodurch verheilt eine Wunde schneller?',
    word: 'Wunde',
    answer: 'Ruhe',
    options: ['Ruhe', 'Laerm', 'Rauch'],
  },
  {
    subject: 'Lesen',
    sentence: 'Welches Wort passt: Die Laterne ___ hell.',
    word: '___',
    answer: 'leuchtet',
    options: ['leuchtet', 'springt', 'isst'],
  },
];

const SOULS_SIGILS = [
  { id: 'ember', label: 'Glut-Eid', x: 180, y: 505, color: '#fb7185', effect: 'damage', chargeTime: 1.35 },
  { id: 'chalice', label: 'Kelch-Eid', x: 1100, y: 505, color: '#22c55e', effect: 'heal', chargeTime: 1.45 },
  { id: 'moon', label: 'Mond-Eid', x: 640, y: 520, color: '#38bdf8', effect: 'focus', chargeTime: 1.25 },
];

const BONFIRE_SEAL = {
  x: CENTER_X,
  y: 586,
  radius: 74,
  chargeTime: 1.7,
};

const SOULS_GOALS = [
  { id: 'parry-1', label: 'Parry landen', type: 'parries', target: 1, reward: 420 },
  { id: 'block-3', label: '3 Treffer blocken', type: 'blocks', target: 3, reward: 440 },
  { id: 'counter-2', label: '2 Guard-Counter', type: 'guardCounters', target: 2, reward: 560 },
  { id: 'riposte-1', label: 'Riposte setzen', type: 'ripostes', target: 1, reward: 760 },
  { id: 'backstab-1', label: 'Backstab treffen', type: 'backstabs', target: 1, reward: 700 },
  { id: 'punish-3', label: '3 Punish-Treffer', type: 'punishHits', target: 3, reward: 680 },
  { id: 'stance-2', label: '2 Stance-Breaks', type: 'stanceBreaks', target: 2, reward: 820 },
  { id: 'dodge-2', label: 'perfekte Rollen', type: 'perfectDodges', target: 2, reward: 520 },
  { id: 'shade-3', label: '3 Schatten bannen', type: 'shades', target: 3, reward: 560 },
  { id: 'sigils-2', label: '2 Eid-Siegel entzuenden', type: 'sigils', target: 2, reward: 620 },
  { id: 'bonfire-1', label: 'Leuchtfeuer entfachen', type: 'bonfires', target: 1, reward: 520 },
  { id: 'rally-20', label: 'Rally-HP holen', type: 'rallyHealed', target: 20, reward: 460 },
  { id: 'phase-2', label: 'Phase 2 erzwingen', type: 'phases', target: 1, reward: 650 },
  { id: 'runes-3', label: 'Runen richtig', type: 'runes', target: 3, reward: 620, learnOnly: true },
];

const SOULS_CONTRACTS = [
  { id: 'hits-3', label: '3 saubere Treffer setzen', type: 'hits', target: 3, duration: 34, reward: { score: 360, focus: 18, stamina: 18 } },
  { id: 'roll-1', label: '1 perfekte Rolle lesen', type: 'perfectDodges', target: 1, duration: 32, reward: { score: 420, focus: 24, stamina: 24 } },
  { id: 'block-2', label: '2 Angriffe blocken', type: 'blocks', target: 2, duration: 38, reward: { score: 390, focus: 16, stamina: 26 } },
  { id: 'parry-1', label: '1 Parry erzwingen', type: 'parries', target: 1, duration: 44, reward: { score: 520, focus: 32, stamina: 18 } },
  { id: 'counter-1', label: '1 Guard-Counter landen', type: 'guardCounters', target: 1, duration: 40, reward: { score: 460, focus: 24, stamina: 20 } },
  { id: 'riposte-1', label: '1 Riposte oder Backstab', type: 'criticalHits', target: 1, duration: 54, reward: { score: 720, focus: 36, health: 16 } },
  { id: 'punish-2', label: '2 Punish-Treffer landen', type: 'punishHits', target: 2, duration: 42, reward: { score: 560, focus: 28, stamina: 26 } },
  { id: 'stance-1', label: '1 Stance-Break erzwingen', type: 'stanceBreaks', target: 1, duration: 58, reward: { score: 760, focus: 34, health: 14 } },
  { id: 'sigil-1', label: '1 Eid-Siegel entzuenden', type: 'sigils', target: 1, duration: 50, reward: { score: 500, focus: 28, health: 12 } },
  { id: 'shade-2', label: '2 Schatten bannen', type: 'shades', target: 2, duration: 46, reward: { score: 480, focus: 24, stamina: 24 } },
  { id: 'rally-12', label: '12 Rally-HP zurueckholen', type: 'rallyHealed', target: 12, duration: 42, reward: { score: 430, focus: 20, health: 12 } },
  { id: 'focus-1', label: '1 Focus-Schlag treffen', type: 'focusHits', target: 1, duration: 48, reward: { score: 560, focus: 20, stamina: 30 } },
  { id: 'rune-1', label: '1 Lernrune richtig lesen', type: 'runes', target: 1, duration: 52, reward: { score: 520, focus: 28, health: 16, stamina: 22 }, learnOnly: true },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const length = (x, y) => Math.hypot(x, y) || 1;

function normalize(x, y) {
  const len = length(x, y);
  return { x: x / len, y: y / len };
}

function makeInitialGame(mode = 'arcade') {
  return {
    mode,
    elapsed: 0,
    phase: 'fight',
    message: mode === 'learn' ? 'Waehle Runen fuer Kampf-Boni.' : 'Betritt den stillen Hof.',
    messageTimer: 2,
    promptIndex: 0,
    runeCooldown: mode === 'learn' ? 1.2 : 0,
    cameraShake: 0,
    sparks: [],
    hazards: [],
    sigils: createSigils(),
    bonfire: createBonfire(),
    shades: [],
    shadeIdCounter: 0,
    shadeSpawnTimer: 5.8,
    activeContract: null,
    contractIndex: 0,
    contractTimer: 0,
    contractCooldown: 1.3,
    contractSeals: 0,
    contractFails: 0,
    player: {
      x: 290,
      y: 370,
      vx: 0,
      vy: 0,
      facing: 1,
      hp: 100,
      rally: 0,
      stamina: 100,
      focus: 0,
      estus: 3,
      invuln: 0,
      rollTimer: 0,
      rollCooldown: 0,
      parryTimer: 0,
      parryCooldown: 0,
      guardCounterWindow: 0,
      attack: null,
      attackCooldown: 0,
      focusCooldown: 0,
      riposteCooldown: 0,
      lockToggleCooldown: 0,
      hurtTimer: 0,
      runeBuff: 0,
      punishWindow: 0,
      punishStacks: 0,
      punishPulse: 0,
      guard: 0,
      lockOn: true,
      score: 0,
    },
    boss: {
      x: 900,
      y: 350,
      vx: 0,
      vy: 0,
      facing: -1,
      hp: 180,
      maxHp: 180,
      phase: 1,
      posture: 100,
      rage: 0,
      windup: null,
      attack: null,
      aiTimer: 1.2,
      shadeTimer: 4.8,
      stagger: 0,
      hurtTimer: 0,
    },
    stats: {
      parries: 0,
      blocks: 0,
      guardCounters: 0,
      ripostes: 0,
      backstabs: 0,
      perfectDodges: 0,
      rallyHealed: 0,
      shades: 0,
      sigils: 0,
      phases: 0,
      runes: 0,
      hits: 0,
      focusHits: 0,
      punishHits: 0,
      stanceBreaks: 0,
      criticalHits: 0,
      rolls: 0,
      estusUsed: 0,
      bonfires: 0,
      revives: 0,
    },
    goals: SOULS_GOALS
      .filter((goal) => mode === 'learn' || !goal.learnOnly)
      .map((goal) => ({ ...goal, done: false })),
  };
}

function currentPrompt(game) {
  return PROMPTS[game.promptIndex % PROMPTS.length];
}

function statValue(game, goal) {
  return game.stats[goal.type] || 0;
}

function availableSoulsContracts(mode) {
  return SOULS_CONTRACTS.filter((contract) => mode === 'learn' || !contract.learnOnly);
}

function soulsContractProgress(game) {
  const contract = game.activeContract;
  if (!contract) return { value: 0, target: 0, ratio: 0 };
  const current = game.stats[contract.type] || 0;
  const value = clamp(current - contract.startValue, 0, contract.target);
  return {
    value,
    target: contract.target,
    ratio: contract.target > 0 ? clamp(value / contract.target, 0, 1) : 1,
  };
}

function applySoulsReward(game, reward = {}) {
  game.player.score += reward.score || 0;
  game.player.focus = clamp(game.player.focus + (reward.focus || 0), 0, 100);
  game.player.stamina = clamp(game.player.stamina + (reward.stamina || 0), 0, 100);
  game.player.hp = clamp(game.player.hp + (reward.health || 0), 0, 100);
}

function startSoulsContract(game) {
  const contracts = availableSoulsContracts(game.mode);
  if (contracts.length === 0) return;
  const contract = contracts[game.contractIndex % contracts.length];
  game.contractIndex += 1;
  game.activeContract = {
    ...contract,
    startValue: game.stats[contract.type] || 0,
  };
  game.contractTimer = contract.duration;
  game.message = `Eid: ${contract.label}`;
  game.messageTimer = 1.05;
  addFloater(game, game.player.x, game.player.y - 86, 'EID', '#fef08a');
}

function completeSoulsContract(game) {
  const contract = game.activeContract;
  if (!contract) return;
  applySoulsReward(game, contract.reward);
  game.contractSeals += 1;
  game.activeContract = null;
  game.contractTimer = 0;
  game.contractCooldown = 1.05;
  game.message = `${contract.label} erfuellt`;
  game.messageTimer = 1.05;
  addFloater(game, game.player.x, game.player.y - 86, `+${contract.reward.score || 0}`, '#86efac');
  spawnSparks(game, game.player.x, game.player.y, '#86efac', 24);
}

function failSoulsContract(game) {
  const contract = game.activeContract;
  if (!contract) return;
  game.contractFails += 1;
  game.activeContract = null;
  game.contractTimer = 0;
  game.contractCooldown = 1.35;
  game.message = `${contract.label} gebrochen`;
  game.messageTimer = 0.9;
  addFloater(game, game.player.x, game.player.y - 76, 'GEBROCHEN', '#fb7185');
}

function updateSoulsContract(game, dt) {
  if (game.phase !== 'fight') return;
  if (!game.activeContract) {
    game.contractCooldown = Math.max(0, game.contractCooldown - dt);
    if (game.contractCooldown <= 0) startSoulsContract(game);
    return;
  }

  game.contractTimer -= dt;
  const progress = soulsContractProgress(game);
  if (progress.value >= progress.target) {
    completeSoulsContract(game);
    return;
  }
  if (game.contractTimer <= 0) failSoulsContract(game);
}

function completeSoulsGoal(game, goal) {
  if (goal.done || statValue(game, goal) < goal.target) return;
  goal.done = true;
  game.player.score += goal.reward;
  game.player.focus = clamp(game.player.focus + 18, 0, 100);
  game.player.stamina = 100;
  game.message = `${goal.label} +${goal.reward}`;
  game.messageTimer = 1.05;
  addFloater(game, game.player.x, game.player.y - 74, 'MEISTERUNG', '#5eead4');
  spawnSparks(game, game.player.x, game.player.y, '#5eead4', 18);
}

function evaluateSoulsGoals(game) {
  game.goals.forEach((goal) => completeSoulsGoal(game, goal));
}

function runePositions(prompt) {
  return [
    { label: prompt.options[0], x: 410, y: 232, correct: prompt.options[0] === prompt.answer },
    { label: prompt.options[1], x: 640, y: 210, correct: prompt.options[1] === prompt.answer },
    { label: prompt.options[2], x: 1060, y: 232, correct: prompt.options[2] === prompt.answer },
  ];
}

function createSigils() {
  return SOULS_SIGILS.map((sigil) => ({
    ...sigil,
    charge: 0,
    activated: false,
    pulse: 0,
  }));
}

function createBonfire() {
  return {
    ...BONFIRE_SEAL,
    charge: 0,
    lit: false,
    spent: false,
    pulse: 0,
  };
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

function drawFittedText(ctx, text, x, y, maxWidth, font, minSize = 10) {
  let size = Number(font.match(/(\d+)px/)?.[1] || 16);
  let fittedFont = font;
  ctx.font = fittedFont;
  while (size > minSize && ctx.measureText(text).width > maxWidth) {
    size -= 1;
    fittedFont = font.replace(/\d+px/, `${size}px`);
    ctx.font = fittedFont;
  }
  ctx.fillText(text, x, y);
}

function spawnSparks(game, x, y, color, amount = 10) {
  for (let i = 0; i < amount; i += 1) {
    const angle = (Math.PI * 2 * i) / amount + game.elapsed * 0.7;
    const speed = 110 + (i % 5) * 30;
    game.sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.55,
      color,
    });
  }
}

function addFloater(game, x, y, text, color = '#facc15') {
  game.sparks.push({
    x,
    y,
    vx: 0,
    vy: -52,
    life: 0.9,
    color,
    text,
  });
}

function openPunishWindow(game, source, stacks = 1, duration = 1.35) {
  const player = game.player;
  if (game.phase !== 'fight' || player.hp <= 0 || game.boss.hp <= 0) return;
  player.punishWindow = Math.max(player.punishWindow, duration);
  player.punishStacks = clamp(Math.max(player.punishStacks, stacks), 1, 3);
  player.punishPulse = 0.34;
  player.focus = clamp(player.focus + 5 + player.punishStacks * 2, 0, 100);
  game.message = `${source}: Punish-Fenster`;
  game.messageTimer = 0.72;
  addFloater(game, player.x, player.y - 66, `PUNISH x${player.punishStacks}`, '#fef08a');
}

function spawnHazard(game, x, y, radius = 62, life = 4.2) {
  game.hazards.push({
    x: clamp(x, ARENA.x + 52, ARENA.x + ARENA.w - 52),
    y: clamp(y, ARENA.y + 82, ARENA.y + ARENA.h - 52),
    radius,
    life,
    maxLife: life,
    pulse: game.elapsed,
    hitCooldown: 0,
  });
}

function spawnShade(game, x, y, type = 'hunter') {
  const profile = type === 'hound'
    ? { hp: 26, damage: 11, speed: 212, radius: 42, color: '#f97316' }
    : type === 'bell'
      ? { hp: 38, damage: 9, speed: 132, radius: 58, color: '#a78bfa' }
      : { hp: 32, damage: 13, speed: 172, radius: 48, color: '#94a3b8' };
  game.shadeIdCounter += 1;
  game.shades.push({
    kind: 'shade',
    id: game.shadeIdCounter,
    type,
    x: clamp(x, ARENA.x + 48, ARENA.x + ARENA.w - 48),
    y: clamp(y, ARENA.y + 84, ARENA.y + ARENA.h - 38),
    vx: 0,
    vy: 0,
    hp: profile.hp,
    maxHp: profile.hp,
    damage: profile.damage,
    speed: profile.speed,
    radius: profile.radius,
    color: profile.color,
    attackCooldown: 0.8,
    hurtTimer: 0,
    alive: true,
  });
  spawnSparks(game, x, y, profile.color, 12);
}

function beginPlayerAttack(player, type) {
  if (player.attack || player.attackCooldown > 0 || player.rollTimer > 0 || player.hurtTimer > 0) return false;
  const staminaCost = type === 'focus' ? 0 : type === 'riposte' || type === 'backstab' ? 18 : type === 'counter' ? 20 : type === 'heavy' ? 24 : 13;
  if (player.stamina < staminaCost) return false;
  player.stamina -= staminaCost;
  player.attack = {
    type,
    timer: 0,
    startup: type === 'focus' ? 0.22 : type === 'riposte' || type === 'backstab' ? 0.16 : type === 'counter' ? 0.12 : type === 'heavy' ? 0.2 : 0.1,
    active: type === 'focus' ? 0.22 : type === 'riposte' || type === 'backstab' ? 0.3 : type === 'counter' ? 0.22 : type === 'heavy' ? 0.18 : 0.14,
    recovery: type === 'focus' ? 0.55 : type === 'riposte' || type === 'backstab' ? 0.7 : type === 'counter' ? 0.44 : type === 'heavy' ? 0.42 : 0.24,
    damage: type === 'focus' ? 34 : type === 'riposte' ? 58 : type === 'backstab' ? 48 : type === 'counter' ? 28 : type === 'heavy' ? 20 : 11,
    range: type === 'focus' ? 150 : type === 'riposte' || type === 'backstab' ? 128 : type === 'counter' ? 112 : type === 'heavy' ? 100 : 76,
    arc: type === 'focus' ? 1.8 : type === 'riposte' || type === 'backstab' ? 1.35 : type === 'counter' ? 1.25 : type === 'heavy' ? 1.2 : 0.82,
    hasHit: false,
  };
  return true;
}

function focusBurst(game, input) {
  const player = game.player;
  if (!input.focus || player.focus < 70 || player.focusCooldown > 0 || player.attack || player.rollTimer > 0 || player.hurtTimer > 0) return false;
  player.focus -= 70;
  player.focusCooldown = 1.6;
  beginPlayerAttack(player, 'focus');
  game.message = 'Focus-Schlag';
  game.messageTimer = 0.75;
  spawnSparks(game, player.x, player.y - 14, '#38bdf8', 20);
  return true;
}

function playerAttackHit(game) {
  const player = game.player;
  const boss = game.boss;
  if (!player.attack || player.attack.hasHit) return;
  const attack = player.attack;
  if (attack.timer < attack.startup || attack.timer > attack.startup + attack.active) return;

  const buff = player.runeBuff > 0 ? 1.38 : 1;
  const bossInFront = (boss.x - player.x) * player.facing > -20;
  const bossHit = distance(player, boss) <= attack.range + 58 && bossInFront;
  const punishActive = bossHit
    && player.punishWindow > 0
    && attack.type !== 'riposte'
    && attack.type !== 'backstab';
  const punishStacks = punishActive ? Math.max(1, player.punishStacks) : 0;
  let hitSomething = false;

  if (bossHit) {
    const punishDamage = punishActive ? 1 + punishStacks * 0.18 : 1;
    const damage = attack.damage * buff * (boss.stagger > 0 ? 1.45 : 1) * punishDamage;
    const postureDamage = (
      attack.type === 'riposte' || attack.type === 'backstab'
        ? 0
        : attack.type === 'focus'
          ? 42
          : attack.type === 'counter'
            ? 36
            : attack.type === 'heavy'
              ? 24
              : 12
    ) + (punishActive ? 12 + punishStacks * 8 : 0);
    boss.hp = clamp(boss.hp - damage, 0, boss.maxHp);
    boss.posture = clamp(boss.posture - postureDamage, 0, 100);
    boss.hurtTimer = 0.22;
    boss.vx += player.facing * (attack.type === 'riposte' ? 120 : attack.type === 'focus' ? 360 : attack.type === 'heavy' ? 260 : 140);
    player.focus = clamp(player.focus + (attack.type === 'focus' ? 0 : 11), 0, 100);
    player.score += Math.round(damage * 16);
    game.stats.hits += 1;
    if (attack.type === 'focus') game.stats.focusHits += 1;
    if (punishActive) {
      game.stats.punishHits += 1;
      player.focus = clamp(player.focus + 14 + punishStacks * 4, 0, 100);
      player.stamina = clamp(player.stamina + 12 + punishStacks * 4, 0, 100);
      player.score += 180 + punishStacks * 90;
      addFloater(game, boss.x, boss.y - 120, `PUNISH x${punishStacks}`, '#fef08a');
      spawnSparks(game, boss.x, boss.y - 26, '#fef08a', 12 + punishStacks * 4);
      player.punishWindow = 0;
      player.punishStacks = 0;
      player.punishPulse = 0;
    }
    hitSomething = true;
    spawnSparks(game, boss.x, boss.y - 18, attack.type === 'riposte' || attack.type === 'backstab' ? '#fef3c7' : attack.type === 'focus' ? '#38bdf8' : attack.type === 'counter' || attack.type === 'heavy' ? '#facc15' : '#93c5fd', attack.type === 'focus' || attack.type === 'riposte' || attack.type === 'backstab' ? 22 : 12);
    if (attack.type === 'counter') {
      player.stamina = clamp(player.stamina + 16, 0, 100);
      player.focus = clamp(player.focus + 22, 0, 100);
      player.score += 260;
      game.stats.guardCounters += 1;
      addFloater(game, boss.x, boss.y - 92, 'GUARD COUNTER', '#facc15');
    }
    if (attack.type === 'riposte' || attack.type === 'backstab') {
      boss.stagger = Math.max(0.55, boss.stagger * 0.35);
      boss.posture = Math.max(boss.posture, 72);
      player.hp = clamp(player.hp + 14, 0, 100);
      player.rally = 0;
      player.focus = clamp(player.focus + 26, 0, 100);
      player.score += attack.type === 'backstab' ? 440 : 520;
      if (attack.type === 'backstab') game.stats.backstabs += 1;
      else game.stats.ripostes += 1;
      game.stats.criticalHits += 1;
      addFloater(game, boss.x, boss.y - 92, attack.type === 'backstab' ? 'BACKSTAB' : 'RIPOSTE', '#fef3c7');
    }
  }

  const maxShadeHits = attack.type === 'focus' ? 4 : attack.type === 'heavy' ? 2 : 1;
  game.shades
    .filter((shade) => shade.alive)
    .sort((a, b) => distance(player, a) - distance(player, b))
    .slice(0, maxShadeHits)
    .forEach((shade) => {
      const shadeInFront = (shade.x - player.x) * player.facing > -24;
      if (!shadeInFront || distance(player, shade) > attack.range + shade.radius) return;
      const damage = attack.damage * buff * (attack.type === 'focus' ? 1.25 : 1);
      shade.hp = clamp(shade.hp - damage, 0, shade.maxHp);
      shade.hurtTimer = 0.28;
      shade.vx += player.facing * 260;
      shade.vy += normalize(shade.x - player.x, shade.y - player.y).y * 170;
      player.score += Math.round(damage * 10);
      player.focus = clamp(player.focus + 7, 0, 100);
      game.stats.hits += 1;
      if (attack.type === 'focus') game.stats.focusHits += 1;
      hitSomething = true;
      spawnSparks(game, shade.x, shade.y, shade.color, 10);
      if (attack.type === 'counter') {
        game.stats.guardCounters += 1;
        player.stamina = clamp(player.stamina + 12, 0, 100);
        addFloater(game, shade.x, shade.y - 42, 'COUNTER', '#facc15');
      }
      if (shade.hp <= 0) {
        shade.alive = false;
        game.stats.shades += 1;
        player.stamina = clamp(player.stamina + 18, 0, 100);
        player.focus = clamp(player.focus + 16, 0, 100);
        player.score += 180;
        addFloater(game, shade.x, shade.y - 42, 'Schatten', '#c4b5fd');
        spawnSparks(game, shade.x, shade.y, '#c4b5fd', 18);
      }
    });

  if (!hitSomething) return;

  if (player.rally > 0) {
    const rallyHeal = Math.min(player.rally, attack.type === 'focus' ? 18 : attack.type === 'heavy' ? 13 : 8);
    player.hp = clamp(player.hp + rallyHeal, 0, 100);
    player.rally = Math.max(0, player.rally - rallyHeal);
    game.stats.rallyHealed += rallyHeal;
    addFloater(game, player.x, player.y - 54, `rally +${Math.round(rallyHeal)}`, '#22c55e');
  }
  attack.hasHit = true;
  game.cameraShake = Math.max(game.cameraShake, attack.type === 'riposte' ? 22 : attack.type === 'focus' ? 18 : attack.type === 'heavy' ? 9 : 5);
  game.message = bossHit && boss.stagger > 0 ? 'Kritischer Treffer!' : hitSomething ? 'Treffer' : game.message;
  game.messageTimer = 0.65;
  evaluateSoulsGoals(game);

  if (bossHit && boss.posture <= 0 && attack.type !== 'riposte') {
    boss.stagger = 2.8;
    boss.posture = 65;
    boss.windup = null;
    boss.attack = null;
    game.stats.stanceBreaks += 1;
    game.message = 'Stance-Break!';
    game.messageTimer = 1.1;
    player.focus = clamp(player.focus + 30, 0, 100);
    player.stamina = clamp(player.stamina + 22, 0, 100);
    player.score += 420;
    addFloater(game, boss.x, boss.y - 118, 'STANCE BREAK', '#fef3c7');
    spawnSparks(game, boss.x, boss.y, '#fef3c7', 26);
    evaluateSoulsGoals(game);
  }
}

function rollPlayer(game, input) {
  const player = game.player;
  if (!input.roll || player.rollCooldown > 0 || player.stamina < 22 || player.rollTimer > 0 || player.hurtTimer > 0) return;
  const move = normalize((input.right ? 1 : 0) - (input.left ? 1 : 0), (input.down ? 1 : 0) - (input.up ? 1 : 0));
  player.rollTimer = 0.34;
  player.rollCooldown = 0.45;
  player.invuln = 0.38;
  player.stamina -= 22;
  game.stats.rolls += 1;
  player.vx = move.x * 620;
  player.vy = move.y * 620;
  if (Math.abs(move.x) > 0.2) player.facing = move.x > 0 ? 1 : -1;
  game.message = 'Rolle';
  game.messageTimer = 0.3;
}

function parryPlayer(game, input) {
  const player = game.player;
  if (!input.parry || player.parryCooldown > 0 || player.stamina < 18 || player.rollTimer > 0 || player.hurtTimer > 0) return;
  player.parryTimer = 0.24;
  player.parryCooldown = 0.85;
  player.stamina -= 18;
  game.message = 'Parry-Fenster';
  game.messageTimer = 0.3;
}

function drinkEstus(game, input) {
  const player = game.player;
  if (!input.estus || player.estus <= 0 || player.hp >= 100 || player.attack || player.rollTimer > 0) return;
  player.estus -= 1;
  game.stats.estusUsed += 1;
  player.hp = clamp(player.hp + 34, 0, 100);
  player.stamina = clamp(player.stamina + 12, 0, 100);
  game.message = 'Heiltrank';
  game.messageTimer = 0.72;
  spawnSparks(game, player.x, player.y, '#22c55e', 10);
}

function toggleLockOn(game, input) {
  const player = game.player;
  if (!input.lock || player.lockToggleCooldown > 0) return;
  player.lockOn = !player.lockOn;
  input.lock = false;
  player.lockToggleCooldown = 0.38;
  game.message = player.lockOn ? 'Lock-on' : 'Freie Bewegung';
  game.messageTimer = 0.52;
}

function isBehindBoss(player, boss) {
  return (player.x - boss.x) * boss.facing < -18 && distance(player, boss) < 112;
}

function tryRiposte(game, input) {
  const player = game.player;
  const boss = game.boss;
  if (!input.riposte || player.riposteCooldown > 0 || player.guard > 0 || player.attack || player.rollTimer > 0 || player.hurtTimer > 0) return false;
  const backstab = boss.stagger <= 0 && isBehindBoss(player, boss) && !boss.attack && !boss.windup;
  if ((!backstab && (boss.stagger <= 0 || distance(player, boss) > 122)) || player.stamina < 18) return false;
  player.facing = player.x <= boss.x ? 1 : -1;
  player.riposteCooldown = 1.1;
  player.vx = player.facing * 210;
  player.vy *= 0.3;
  const started = beginPlayerAttack(player, backstab ? 'backstab' : 'riposte');
  if (!started) return false;
  input.riposte = false;
  game.message = backstab ? 'Backstab' : 'Riposte';
  game.messageTimer = 0.8;
  spawnSparks(game, player.x + player.facing * 48, player.y - 18, '#fef3c7', 16);
  return true;
}

function updatePlayer(game, input, dt) {
  const player = game.player;
  const boss = game.boss;
  player.rollCooldown = Math.max(0, player.rollCooldown - dt);
  player.parryCooldown = Math.max(0, player.parryCooldown - dt);
  player.focusCooldown = Math.max(0, player.focusCooldown - dt);
  player.riposteCooldown = Math.max(0, player.riposteCooldown - dt);
  player.lockToggleCooldown = Math.max(0, player.lockToggleCooldown - dt);
  player.parryTimer = Math.max(0, player.parryTimer - dt);
  player.invuln = Math.max(0, player.invuln - dt);
  player.hurtTimer = Math.max(0, player.hurtTimer - dt);
  player.runeBuff = Math.max(0, player.runeBuff - dt);
  player.rally = Math.max(0, player.rally - 5.5 * dt);
  player.guardCounterWindow = Math.max(0, player.guardCounterWindow - dt);
  player.punishWindow = Math.max(0, player.punishWindow - dt);
  player.punishPulse = Math.max(0, player.punishPulse - dt);
  if (player.punishWindow <= 0) {
    player.punishStacks = 0;
  }

  if (player.attack) {
    player.attack.timer += dt;
    if (player.attack.timer > player.attack.startup + player.attack.active + player.attack.recovery) {
      player.attack = null;
      player.attackCooldown = 0.08;
    }
  }
  player.attackCooldown = Math.max(0, player.attackCooldown - dt);

  toggleLockOn(game, input);
  rollPlayer(game, input);
  parryPlayer(game, input);
  drinkEstus(game, input);
  focusBurst(game, input);
  player.guard = input.block && player.stamina > 4 && player.rollTimer <= 0 && !player.attack && player.hurtTimer <= 0 ? 1 : 0;

  const locked = player.rollTimer > 0 || player.attack || player.hurtTimer > 0;
  if (player.rollTimer > 0) {
    player.rollTimer = Math.max(0, player.rollTimer - dt);
  } else if (!locked) {
    const mx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const my = (input.down ? 1 : 0) - (input.up ? 1 : 0);
    const move = normalize(mx, my);
    const speed = player.guard > 0 ? 118 : player.parryTimer > 0 ? 90 : 250;
    const active = Math.abs(mx) + Math.abs(my) > 0;
    player.vx += (active ? move.x * speed : 0) * 10 * dt;
    player.vy += (active ? move.y * speed : 0) * 10 * dt;
    if (active && !player.lockOn && Math.abs(move.x) > 0.2) player.facing = move.x > 0 ? 1 : -1;
  }

  if (!locked && player.parryTimer <= 0 && player.guard <= 0) {
    if (!tryRiposte(game, input)) {
      if ((input.heavy || input.light) && player.guardCounterWindow > 0) {
        if (beginPlayerAttack(player, 'counter')) {
          player.guardCounterWindow = 0;
          game.message = 'Guard-Counter';
          game.messageTimer = 0.65;
          spawnSparks(game, player.x + player.facing * 34, player.y - 18, '#facc15', 12);
        }
      } else if (input.heavy) beginPlayerAttack(player, 'heavy');
      else if (input.light) beginPlayerAttack(player, 'light');
    }
  }

  player.vx *= Math.pow(player.rollTimer > 0 ? 0.9 : 0.78, dt * 60);
  player.vy *= Math.pow(player.rollTimer > 0 ? 0.9 : 0.78, dt * 60);
  player.x = clamp(player.x + player.vx * dt, ARENA.x + 28, ARENA.x + ARENA.w - 28);
  player.y = clamp(player.y + player.vy * dt, ARENA.y + 70, ARENA.y + ARENA.h - 34);
  player.stamina = clamp(player.stamina + (player.guard > 0 ? 7 : player.attack ? 9 : 24) * dt, 0, 100);
  if (player.lockOn || distance(player, boss) < 360) player.facing = player.x <= boss.x ? 1 : -1;
}

function startBossWindup(game, type) {
  const boss = game.boss;
  const player = game.player;
  boss.windup = {
    type,
    timer: 0,
    duration: type === 'eruption' ? 1.05 : type === 'slam' ? 0.9 : type === 'lunge' ? 0.64 : 0.72,
    targetX: player.x,
    targetY: player.y,
  };
  game.message = type === 'eruption' ? 'Blutflammen steigen' : type === 'slam' ? 'Boss hebt die Klinge' : type === 'lunge' ? 'Boss stuermt' : 'Boss schwingt aus';
  game.messageTimer = 0.6;
}

function triggerBossAttack(game) {
  const boss = game.boss;
  if (!boss.windup) return;
  const windup = boss.windup;
  boss.attack = {
    type: windup.type,
    timer: 0,
    active: windup.type === 'slam' ? 0.3 : 0.24,
    targetX: windup.targetX,
    targetY: windup.targetY,
    hasHit: false,
  };
  if (windup.type === 'lunge') {
    const dir = normalize(windup.targetX - boss.x, windup.targetY - boss.y);
    boss.vx = dir.x * 610;
    boss.vy = dir.y * 610;
    boss.facing = dir.x >= 0 ? 1 : -1;
  }
  if (windup.type === 'eruption') {
    spawnHazard(game, windup.targetX, windup.targetY, boss.phase >= 3 ? 86 : 72, boss.phase >= 3 ? 5.2 : 4.2);
    spawnHazard(game, boss.x + boss.facing * 120, boss.y, 56, 3.5);
  }
  boss.windup = null;
}

function updateBoss(game, dt) {
  const boss = game.boss;
  const player = game.player;
  boss.stagger = Math.max(0, boss.stagger - dt);
  boss.hurtTimer = Math.max(0, boss.hurtTimer - dt);
  if (boss.hp <= 0 || boss.stagger > 0) {
    boss.vx *= Math.pow(0.82, dt * 60);
    boss.vy *= Math.pow(0.82, dt * 60);
    boss.x = clamp(boss.x + boss.vx * dt, ARENA.x + 70, ARENA.x + ARENA.w - 70);
    boss.y = clamp(boss.y + boss.vy * dt, ARENA.y + 92, ARENA.y + ARENA.h - 62);
    return;
  }

  if (boss.hp < boss.maxHp * 0.52 && boss.phase === 1) {
    boss.phase = 2;
    game.stats.phases += 1;
    boss.posture = 100;
    boss.aiTimer = 0.35;
    game.message = 'Phase 2';
    game.messageTimer = 1.3;
    spawnShade(game, boss.x - 126, boss.y + 58, 'hunter');
    spawnShade(game, boss.x + 118, boss.y - 42, 'hound');
    spawnSparks(game, boss.x, boss.y, '#ef4444', 24);
    evaluateSoulsGoals(game);
  }
  if (boss.hp < boss.maxHp * 0.26 && boss.phase === 2) {
    boss.phase = 3;
    game.stats.phases += 1;
    boss.rage = 1;
    boss.posture = 100;
    boss.aiTimer = 0.25;
    game.message = 'Phase 3: Blutmond';
    game.messageTimer = 1.3;
    spawnHazard(game, player.x, player.y, 72, 4.8);
    spawnShade(game, boss.x - 140, boss.y, 'bell');
    spawnShade(game, boss.x + 132, boss.y + 70, 'hound');
    spawnSparks(game, boss.x, boss.y, '#f43f5e', 32);
    evaluateSoulsGoals(game);
  }

  if (boss.phase >= 2) {
    boss.shadeTimer = Math.max(0, boss.shadeTimer - dt);
    const livingShades = game.shades.filter((shade) => shade.alive).length;
    if (boss.shadeTimer <= 0 && livingShades < (boss.phase >= 3 ? 4 : 2)) {
      const angle = game.elapsed * 1.7 + livingShades;
      const radius = boss.phase >= 3 ? 168 : 138;
      spawnShade(
        game,
        boss.x + Math.cos(angle) * radius,
        boss.y + Math.sin(angle) * radius,
        boss.phase >= 3 && livingShades % 2 === 0 ? 'bell' : 'hunter'
      );
      boss.shadeTimer = boss.phase >= 3 ? 5.1 : 7.2;
    }
  }

  boss.facing = boss.x <= player.x ? 1 : -1;
  if (boss.windup) {
    boss.windup.timer += dt;
    if (boss.windup.timer >= boss.windup.duration) triggerBossAttack(game);
  } else if (boss.attack) {
    boss.attack.timer += dt;
    if (boss.attack.timer >= boss.attack.active) {
      boss.attack = null;
      boss.aiTimer = boss.phase >= 3 ? 0.44 : boss.phase === 2 ? 0.56 : 0.86;
    }
  } else {
    boss.aiTimer -= dt;
    const d = distance(boss, player);
    const dir = normalize(player.x - boss.x, player.y - boss.y);
    if (d > 142) {
      const speed = boss.phase >= 3 ? 178 : boss.phase === 2 ? 145 : 112;
      boss.vx += dir.x * speed * 3.8 * dt;
      boss.vy += dir.y * speed * 3.8 * dt;
    }
    if (boss.aiTimer <= 0) {
      const type = boss.phase >= 3 && game.elapsed % 3 > 1.55 ? 'eruption' : d < 118 ? 'sweep' : boss.phase >= 2 && game.elapsed % 2 > 1 ? 'slam' : 'lunge';
      startBossWindup(game, type);
      boss.aiTimer = 2;
    }
  }

  boss.vx *= Math.pow(0.83, dt * 60);
  boss.vy *= Math.pow(0.83, dt * 60);
  boss.x = clamp(boss.x + boss.vx * dt, ARENA.x + 70, ARENA.x + ARENA.w - 70);
  boss.y = clamp(boss.y + boss.vy * dt, ARENA.y + 92, ARENA.y + ARENA.h - 62);
  boss.posture = clamp(boss.posture + (boss.phase >= 3 ? 12 : 8) * dt, 0, 100);
}

function bossAttackHits(game) {
  const boss = game.boss;
  const player = game.player;
  if (!boss.attack || boss.attack.hasHit || player.invuln > 0) return;

  let hit = false;
  let damage = boss.phase >= 3 ? 26 : boss.phase === 2 ? 22 : 17;
  if (boss.attack.type === 'eruption') {
    hit = distance(player, { x: boss.attack.targetX, y: boss.attack.targetY }) < 118;
    damage += 10;
  } else if (boss.attack.type === 'sweep') {
    hit = distance(player, boss) < 122 && (player.x - boss.x) * boss.facing > -40;
  } else if (boss.attack.type === 'lunge') {
    hit = distance(player, boss) < 96;
    damage += 3;
  } else if (boss.attack.type === 'slam') {
    hit = distance(player, { x: boss.attack.targetX, y: boss.attack.targetY }) < 104;
    damage += 8;
  }
  if (!hit) return;

  if (player.parryTimer > 0 && boss.attack.type !== 'slam') {
    boss.stagger = 2.4;
    boss.posture = 45;
    boss.attack = null;
    player.focus = clamp(player.focus + 34, 0, 100);
    player.score += 280;
    game.stats.parries += 1;
    game.stats.stanceBreaks += 1;
    game.cameraShake = 12;
    openPunishWindow(game, 'Parry', 3, 1.45);
    spawnSparks(game, player.x, player.y - 10, '#93c5fd', 20);
    evaluateSoulsGoals(game);
    return;
  }

  if (player.guard > 0 && player.stamina > 0) {
    const guardCost = damage * (boss.attack.type === 'slam' ? 1.75 : boss.attack.type === 'eruption' ? 1.45 : 1.2);
    const broken = player.stamina <= guardCost;
    player.stamina = Math.max(0, player.stamina - guardCost);
    if (!broken) {
      const chip = Math.max(2, damage * 0.18);
      player.hp = clamp(player.hp - chip, 0, 100);
      player.rally = clamp(player.rally + chip * 0.5, 0, 24);
      player.hurtTimer = 0.12;
      player.invuln = 0.18;
      const dir = normalize(player.x - boss.x, player.y - boss.y);
      player.vx = dir.x * 260;
      player.vy = dir.y * 260;
      player.focus = clamp(player.focus + 8, 0, 100);
      player.guardCounterWindow = 0.8;
      player.score += 90;
      game.stats.blocks += 1;
      boss.attack.hasHit = true;
      game.cameraShake = Math.max(game.cameraShake, 8);
      game.message = 'Geblockt';
      game.messageTimer = 0.62;
      spawnSparks(game, player.x, player.y - 8, '#facc15', 12);
      evaluateSoulsGoals(game);
      return;
    }
    player.guard = 0;
    player.hurtTimer = 0.5;
    player.punishWindow = 0;
    player.punishStacks = 0;
    player.punishPulse = 0;
    game.message = 'Guard Break';
    game.messageTimer = 0.75;
    spawnSparks(game, player.x, player.y, '#fb7185', 16);
  }

  const previousHp = player.hp;
  player.hp = clamp(player.hp - damage, 0, 100);
  player.rally = clamp(player.rally + Math.min(previousHp, damage) * 0.72, 0, 34);
  player.hurtTimer = 0.38;
  player.invuln = 0.55;
  player.punishWindow = 0;
  player.punishStacks = 0;
  player.punishPulse = 0;
  const dir = normalize(player.x - boss.x, player.y - boss.y);
  player.vx = dir.x * 440;
  player.vy = dir.y * 440;
  boss.attack.hasHit = true;
  game.cameraShake = Math.max(game.cameraShake, 14);
  game.message = 'Getroffen';
  game.messageTimer = 0.7;
  spawnSparks(game, player.x, player.y, '#fb7185', 16);
}

function rewardPerfectDodge(game) {
  const boss = game.boss;
  const player = game.player;
  if (!boss.attack || boss.attack.hasHit || player.invuln <= 0 || player.rollTimer <= 0) return;
  const near = boss.attack.type === 'slam' || boss.attack.type === 'eruption'
    ? distance(player, { x: boss.attack.targetX, y: boss.attack.targetY }) < 132
    : distance(player, boss) < 132;
  if (!near) return;
  boss.attack.hasHit = true;
  player.focus = clamp(player.focus + 18, 0, 100);
  player.stamina = clamp(player.stamina + 16, 0, 100);
  player.score += 140;
  game.stats.perfectDodges += 1;
  openPunishWindow(game, 'Perfekte Rolle', 1, 1.25);
  addFloater(game, player.x, player.y - 52, '+Fokus', '#38bdf8');
  spawnSparks(game, player.x, player.y, '#38bdf8', 14);
  evaluateSoulsGoals(game);
}

function updateHazards(game, dt) {
  const player = game.player;
  game.hazards = game.hazards
    .map((hazard) => ({
      ...hazard,
      life: hazard.life - dt,
      hitCooldown: Math.max(0, hazard.hitCooldown - dt),
    }))
    .filter((hazard) => hazard.life > 0);

  game.hazards.forEach((hazard) => {
    if (hazard.hitCooldown > 0 || player.invuln > 0 || player.hurtTimer > 0) return;
    if (distance(player, hazard) > hazard.radius * 0.82) return;
    player.hp = clamp(player.hp - 8, 0, 100);
    player.rally = clamp(player.rally + 5, 0, 34);
    player.stamina = Math.max(0, player.stamina - 12);
    player.hurtTimer = 0.22;
    player.punishWindow = 0;
    player.punishStacks = 0;
    player.punishPulse = 0;
    hazard.hitCooldown = 0.85;
    game.cameraShake = Math.max(game.cameraShake, 7);
    game.message = 'Blutflamme';
    game.messageTimer = 0.55;
    spawnSparks(game, player.x, player.y, '#fb7185', 10);
  });
}

function updateShades(game, dt) {
  const player = game.player;
  game.shades.forEach((shade) => {
    if (!shade.alive) return;
    shade.hurtTimer = Math.max(0, shade.hurtTimer - dt);
    shade.attackCooldown = Math.max(0, shade.attackCooldown - dt);
    const d = distance(player, shade);
    const dir = normalize(player.x - shade.x, player.y - shade.y);

    if (shade.hurtTimer <= 0 && d > shade.radius) {
      shade.vx += dir.x * shade.speed * 4.6 * dt;
      shade.vy += dir.y * shade.speed * 4.6 * dt;
    }

    if (d <= shade.radius + 24 && shade.attackCooldown <= 0 && player.invuln <= 0 && player.hurtTimer <= 0) {
      shade.attackCooldown = shade.type === 'hound' ? 0.9 : 1.25;
      if (player.rollTimer > 0) {
        game.stats.perfectDodges += 1;
        player.focus = clamp(player.focus + 12, 0, 100);
        player.stamina = clamp(player.stamina + 12, 0, 100);
        player.score += 90;
        openPunishWindow(game, 'Schatten-Dodge', 1, 1.05);
        spawnSparks(game, player.x, player.y, '#38bdf8', 10);
        evaluateSoulsGoals(game);
      } else if (player.parryTimer > 0) {
        shade.hp = 0;
        shade.alive = false;
        game.stats.parries += 1;
        game.stats.shades += 1;
        player.focus = clamp(player.focus + 28, 0, 100);
        player.score += 240;
        openPunishWindow(game, 'Schatten-Parry', 2, 1.2);
        spawnSparks(game, shade.x, shade.y, '#93c5fd', 18);
        evaluateSoulsGoals(game);
      } else if (player.guard > 0 && player.stamina > shade.damage * 1.1) {
        player.stamina = Math.max(0, player.stamina - shade.damage * 1.1);
        player.focus = clamp(player.focus + 6, 0, 100);
        player.guardCounterWindow = 0.55;
        player.score += 60;
        shade.vx -= dir.x * 260;
        shade.vy -= dir.y * 260;
        shade.hurtTimer = 0.22;
        game.stats.blocks += 1;
        game.message = 'Schatten geblockt';
        game.messageTimer = 0.5;
        spawnSparks(game, player.x, player.y, '#facc15', 8);
        evaluateSoulsGoals(game);
      } else {
        player.hp = clamp(player.hp - shade.damage, 0, 100);
        player.rally = clamp(player.rally + shade.damage * 0.55, 0, 34);
        player.hurtTimer = 0.28;
        player.invuln = 0.38;
        player.punishWindow = 0;
        player.punishStacks = 0;
        player.punishPulse = 0;
        player.vx -= dir.x * 320;
        player.vy -= dir.y * 320;
        game.cameraShake = Math.max(game.cameraShake, 8);
        game.message = 'Schattenbiss';
        game.messageTimer = 0.55;
        spawnSparks(game, player.x, player.y, '#fb7185', 10);
      }
    }

    shade.vx *= Math.pow(0.78, dt * 60);
    shade.vy *= Math.pow(0.78, dt * 60);
    shade.x = clamp(shade.x + shade.vx * dt, ARENA.x + 38, ARENA.x + ARENA.w - 38);
    shade.y = clamp(shade.y + shade.vy * dt, ARENA.y + 76, ARENA.y + ARENA.h - 32);
  });
  game.shades = game.shades.filter((shade) => shade.alive || shade.hurtTimer > 0);
}

function updateSigils(game, dt) {
  const player = game.player;
  game.sigils.forEach((sigil) => {
    sigil.pulse += dt * 3.2;
    if (sigil.activated) return;
    const close = distance(player, sigil) < 72;
    sigil.charge = clamp(sigil.charge + (close ? dt * (player.parryTimer > 0 ? 1.8 : 1) : -dt * 0.55), 0, sigil.chargeTime);
    if (sigil.charge < sigil.chargeTime) return;

    sigil.activated = true;
    game.stats.sigils += 1;
    player.score += 360;
    player.stamina = 100;
    if (sigil.effect === 'damage') {
      player.runeBuff = Math.max(player.runeBuff, 8.5);
      player.focus = clamp(player.focus + 16, 0, 100);
    } else if (sigil.effect === 'heal') {
      player.hp = clamp(player.hp + 22, 0, 100);
      player.estus = Math.min(4, player.estus + 1);
    } else {
      player.focus = clamp(player.focus + 38, 0, 100);
      player.rally = 0;
    }
    game.message = `${sigil.label} entzuendet`;
    game.messageTimer = 1.05;
    spawnSparks(game, sigil.x, sigil.y, sigil.color, 20);
    addFloater(game, sigil.x, sigil.y - 48, 'EID', sigil.color);
    if (game.mode === 'learn') game.runeCooldown = Math.max(0.15, game.runeCooldown * 0.5);
    evaluateSoulsGoals(game);
  });
}

function updateBonfire(game, dt) {
  const bonfire = game.bonfire;
  const player = game.player;
  const boss = game.boss;
  bonfire.pulse += dt * 3.4;
  if (bonfire.lit || bonfire.spent || boss.hp <= 0) return;

  const close = distance(player, bonfire) < bonfire.radius;
  const vulnerable = player.attack || player.rollTimer > 0 || player.hurtTimer > 0 || boss.windup || boss.attack;
  bonfire.charge = clamp(bonfire.charge + (close && !vulnerable ? dt : -dt * 0.7), 0, bonfire.chargeTime);
  if (bonfire.charge < bonfire.chargeTime) {
    if (close && !vulnerable) {
      game.message = 'Leuchtfeuer halten';
      game.messageTimer = Math.max(game.messageTimer, 0.18);
    }
    return;
  }

  bonfire.lit = true;
  bonfire.charge = bonfire.chargeTime;
  game.stats.bonfires += 1;
  player.hp = clamp(player.hp + 24, 0, 100);
  player.stamina = 100;
  player.focus = clamp(player.focus + 28, 0, 100);
  player.estus = Math.min(4, player.estus + 1);
  player.score += 360;
  boss.posture = clamp(boss.posture + 18, 0, 100);
  game.message = 'Leuchtfeuer entfacht';
  game.messageTimer = 1.15;
  addFloater(game, bonfire.x, bonfire.y - 56, 'CHECKPOINT', '#facc15');
  spawnSparks(game, bonfire.x, bonfire.y, '#facc15', 30);
  evaluateSoulsGoals(game);
}

function reviveAtBonfire(game) {
  const bonfire = game.bonfire;
  const player = game.player;
  const boss = game.boss;
  if (!bonfire.lit || bonfire.spent || boss.hp <= 0) return false;

  bonfire.spent = true;
  player.x = bonfire.x;
  player.y = bonfire.y - 78;
  player.vx = 0;
  player.vy = -80;
  player.hp = 56;
  player.rally = 0;
  player.stamina = 100;
  player.focus = Math.max(player.focus, 36);
  player.estus = Math.max(player.estus, 1);
  player.invuln = 1.55;
  player.rollTimer = 0;
  player.hurtTimer = 0;
  player.attack = null;
  player.guard = 0;
  player.parryTimer = 0;
  player.punishWindow = 0;
  player.punishStacks = 0;
  player.punishPulse = 0;
  game.hazards = [];
  game.stats.revives += 1;
  boss.posture = 100;
  boss.stagger = 0;
  boss.windup = null;
  boss.attack = null;
  boss.aiTimer = 0.82;
  if (boss.phase >= 2) {
    spawnShade(game, bonfire.x - 118, bonfire.y - 96, boss.phase >= 3 ? 'bell' : 'hunter');
    spawnShade(game, bonfire.x + 128, bonfire.y - 88, 'hound');
  }
  game.cameraShake = Math.max(game.cameraShake, 18);
  game.message = 'Am Leuchtfeuer erwacht';
  game.messageTimer = 1.45;
  addFloater(game, bonfire.x, bonfire.y - 62, 'REVIVE', '#facc15');
  spawnSparks(game, bonfire.x, bonfire.y, '#facc15', 38);
  return true;
}

function updateRunes(game, dt) {
  if (game.mode !== 'learn' || game.phase !== 'fight') return;
  game.runeCooldown = Math.max(0, game.runeCooldown - dt);
  if (game.runeCooldown > 0) return;
  const prompt = currentPrompt(game);
  const player = game.player;

  runePositions(prompt).forEach((rune) => {
    if (distance(player, rune) > 54) return;
    if (rune.correct) {
      player.runeBuff = 7.5;
      player.focus = clamp(player.focus + 25, 0, 100);
      player.stamina = clamp(player.stamina + 22, 0, 100);
      player.score += 220;
      game.stats.runes += 1;
      game.promptIndex += 1;
      game.message = `${prompt.word}: ${prompt.answer}`;
      game.messageTimer = 1.25;
      spawnSparks(game, rune.x, rune.y, '#5eead4', 18);
      evaluateSoulsGoals(game);
    } else {
      player.stamina = Math.max(0, player.stamina - 26);
      player.focus = Math.max(0, player.focus - 14);
      spawnHazard(game, rune.x, rune.y + 42, 52, 3.4);
      game.message = `${prompt.word} ist nicht ${rune.label}`;
      game.messageTimer = 1.05;
      spawnSparks(game, rune.x, rune.y, '#f97316', 10);
    }
    game.runeCooldown = 1.05;
  });
}

function updateGame(game, input, dt, onFinish) {
  if (game.phase !== 'fight') return;
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.cameraShake = Math.max(0, game.cameraShake - 32 * dt);

  updatePlayer(game, input, dt);
  updateBoss(game, dt);
  updateShades(game, dt);
  playerAttackHit(game);
  rewardPerfectDodge(game);
  bossAttackHits(game);
  updateHazards(game, dt);
  updateSigils(game, dt);
  updateBonfire(game, dt);
  updateRunes(game, dt);
  updateSoulsContract(game, dt);

  game.sparks = game.sparks
    .map((spark) => ({
      ...spark,
      x: spark.x + spark.vx * dt,
      y: spark.y + spark.vy * dt,
      vx: spark.vx * Math.pow(0.93, dt * 60),
      vy: spark.vy * Math.pow(0.93, dt * 60),
      life: spark.life - dt,
    }))
    .filter((spark) => spark.life > 0);

  if (game.player.hp <= 0 && reviveAtBonfire(game)) return;

  if (game.player.hp <= 0 || game.boss.hp <= 0) {
    game.phase = 'result';
    const won = game.boss.hp <= 0;
    const result = won ? 'Boss besiegt' : 'Du bist gefallen';
    onFinish({
      result,
      score: game.player.score + (won ? 1500 : 0),
      playerHp: Math.round(game.player.hp),
      bossHp: Math.round(game.boss.hp),
      revives: game.stats.revives,
    });
  }
}

function drawArena(ctx, game) {
  const shakeX = game.cameraShake > 0 ? Math.sin(game.elapsed * 80) * game.cameraShake : 0;
  const shakeY = game.cameraShake > 0 ? Math.cos(game.elapsed * 71) * game.cameraShake * 0.45 : 0;
  ctx.save();
  ctx.translate(shakeX, shakeY);
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, '#07111f');
  bg.addColorStop(1, '#111827');
  ctx.fillStyle = bg;
  ctx.fillRect(-50, -50, WIDTH + 100, HEIGHT + 100);

  ctx.fillStyle = '#1e293b';
  drawRoundedRect(ctx, ARENA.x, ARENA.y, ARENA.w, ARENA.h, 34);
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 8;
  ctx.stroke();

  for (let x = ARENA.x + 42; x < ARENA.x + ARENA.w; x += 96) {
    for (let y = ARENA.y + 34; y < ARENA.y + ARENA.h; y += 82) {
      ctx.fillStyle = (x + y) % 3 === 0 ? '#263449' : '#202c40';
      drawRoundedRect(ctx, x, y, 58, 44, 10);
      ctx.fill();
    }
  }

  const pillars = [
    { x: 260, y: 250 }, { x: 1020, y: 250 }, { x: 260, y: 525 }, { x: 1020, y: 525 },
  ];
  pillars.forEach((pillar, index) => {
    ctx.fillStyle = '#334155';
    drawRoundedRect(ctx, pillar.x - 36, pillar.y - 46, 72, 92, 16);
    ctx.fill();
    ctx.fillStyle = index % 2 === 0 ? '#f97316' : '#38bdf8';
    ctx.globalAlpha = 0.65 + Math.sin(game.elapsed * 4 + index) * 0.18;
    ctx.beginPath();
    ctx.arc(pillar.x, pillar.y - 56, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  drawBonfire(ctx, game);
  drawSigils(ctx, game);
  if (game.mode === 'learn') drawRunes(ctx, game);
  drawHazards(ctx, game);
  ctx.restore();
}

function drawBonfire(ctx, game) {
  const bonfire = game.bonfire;
  const progress = bonfire.lit ? 1 : bonfire.charge / bonfire.chargeTime;
  const pulse = Math.sin(bonfire.pulse + game.elapsed * 3.2) * 5;
  ctx.save();
  ctx.globalAlpha = bonfire.spent ? 0.42 : 0.9;
  ctx.shadowColor = bonfire.spent ? '#64748b' : bonfire.lit ? '#facc15' : '#fb923c';
  ctx.shadowBlur = bonfire.lit ? 28 : 12 + progress * 20;
  ctx.fillStyle = bonfire.spent ? 'rgba(51,65,85,.74)' : 'rgba(120,53,15,.78)';
  ctx.beginPath();
  ctx.arc(bonfire.x, bonfire.y, 40 + pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = bonfire.lit ? '#fef08a' : '#fed7aa';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(bonfire.x, bonfire.y, 52, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
  ctx.stroke();

  ctx.strokeStyle = bonfire.spent ? '#94a3b8' : '#fde68a';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(bonfire.x - 22, bonfire.y + 16);
  ctx.lineTo(bonfire.x + 20, bonfire.y - 18);
  ctx.moveTo(bonfire.x + 22, bonfire.y + 16);
  ctx.lineTo(bonfire.x - 20, bonfire.y - 18);
  ctx.stroke();

  if (bonfire.lit && !bonfire.spent) {
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(bonfire.x, bonfire.y - 58 - pulse);
    ctx.lineTo(bonfire.x - 15, bonfire.y - 24);
    ctx.lineTo(bonfire.x + 15, bonfire.y - 24);
    ctx.closePath();
    ctx.fill();
  }

  ctx.textAlign = 'center';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillStyle = bonfire.spent ? '#94a3b8' : '#fef3c7';
  ctx.fillText(bonfire.spent ? 'Leuchtfeuer verbraucht' : bonfire.lit ? 'Leuchtfeuer bereit' : 'Leuchtfeuer', bonfire.x, bonfire.y + 74);
  ctx.restore();
}

function drawSigils(ctx, game) {
  game.sigils.forEach((sigil) => {
    const progress = sigil.activated ? 1 : sigil.charge / sigil.chargeTime;
    const pulse = Math.sin(sigil.pulse + game.elapsed * 2.8) * 4;
    ctx.save();
    ctx.globalAlpha = sigil.activated ? 0.72 : 0.9;
    ctx.shadowColor = sigil.color;
    ctx.shadowBlur = sigil.activated ? 24 : 14 + progress * 20;
    ctx.strokeStyle = sigil.activated ? '#f8fafc' : sigil.color;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(sigil.x, sigil.y, 38 + pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = sigil.color;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(sigil.x, sigil.y, 24, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = sigil.activated ? '#fef3c7' : '#e2e8f0';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(sigil.label, sigil.x, sigil.y + 58);
    ctx.restore();
  });
}

function drawHazards(ctx, game) {
  game.hazards.forEach((hazard) => {
    const alpha = clamp(hazard.life / hazard.maxLife, 0, 1);
    const pulse = Math.sin(game.elapsed * 8 + hazard.pulse) * 5;
    ctx.save();
    ctx.globalAlpha = 0.18 + alpha * 0.42;
    ctx.fillStyle = '#991b1b';
    ctx.shadowColor = '#fb7185';
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.arc(hazard.x, hazard.y, hazard.radius + pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#fecaca';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  });
}

function drawRunes(ctx, game) {
  const prompt = currentPrompt(game);
  runePositions(prompt).forEach((rune, index) => {
    const pulse = Math.sin(game.elapsed * 4.2 + index) * 4;
    ctx.save();
    ctx.globalAlpha = game.runeCooldown > 0 ? 0.46 : 0.95;
    ctx.shadowColor = '#a78bfa';
    ctx.shadowBlur = 24;
    ctx.fillStyle = 'rgba(79,70,229,.76)';
    ctx.beginPath();
    ctx.arc(rune.x, rune.y, 42 + pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 16px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(rune.label, rune.x, rune.y);
    ctx.restore();
  });
}

function drawBar(ctx, x, y, w, h, value, max, color, right = false) {
  ctx.fillStyle = 'rgba(2,6,23,.74)';
  drawRoundedRect(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.13)';
  drawRoundedRect(ctx, x + 5, y + 5, w - 10, h - 10, 7);
  ctx.fill();
  const fillW = (w - 10) * clamp(value / max, 0, 1);
  ctx.fillStyle = color;
  drawRoundedRect(ctx, right ? x + w - 5 - fillW : x + 5, y + 5, fillW, h - 10, 7);
  ctx.fill();
}

function drawHud(ctx, game) {
  const player = game.player;
  const boss = game.boss;
  const contractProgress = soulsContractProgress(game);
  const bonfire = game.bonfire;
  const bonfireText = bonfire.spent
    ? 'Leuchtfeuer verbraucht'
    : bonfire.lit
      ? 'Leuchtfeuer bereit'
      : `Leuchtfeuer ${Math.round((bonfire.charge / bonfire.chargeTime) * 100)}%`;
  const punishText = player.punishWindow > 0
    ? `Punish x${player.punishStacks} · ${player.punishWindow.toFixed(1)}s`
    : `Punish ${game.stats.punishHits} · Break ${game.stats.stanceBreaks}`;
  ctx.save();
  if (game.isPortraitTouch) {
    const panelX = CENTER_X - 320;
    const panelY = 18;
    const panelW = 640;
    const leftX = panelX + 24;
    const rightX = CENTER_X + 42;
    ctx.fillStyle = 'rgba(2,6,23,.82)';
    drawRoundedRect(ctx, panelX, panelY, panelW, 196, 18);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 18px Outfit, sans-serif';
    ctx.fillText('Faska Souls Pro', CENTER_X, panelY + 25);

    drawBar(ctx, leftX, panelY + 42, 246, 18, player.hp, 100, '#22c55e');
    drawBar(ctx, leftX, panelY + 66, 198, 10, player.stamina, 100, '#facc15');
    drawBar(ctx, leftX, panelY + 82, 168, 8, player.focus, 100, '#38bdf8');
    ctx.textAlign = 'left';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '900 12px Outfit, sans-serif';
    drawFittedText(ctx, `Held HP ${Math.round(player.hp)} · Trank ${player.estus} · ${bonfire.lit && !bonfire.spent ? 'Feuer bereit' : bonfire.spent ? 'Feuer leer' : 'Feuer laden'}`, leftX, panelY + 108, 250, '900 12px Outfit, sans-serif');
    ctx.fillStyle = player.guardCounterWindow > 0 ? '#fef08a' : '#cbd5e1';
    drawFittedText(ctx, `Counter ${game.stats.guardCounters} · Backstab ${game.stats.backstabs} · Fenster ${player.guardCounterWindow > 0 ? player.guardCounterWindow.toFixed(1) : '-'}`, leftX, panelY + 126, 260, '900 12px Outfit, sans-serif');
    ctx.fillStyle = player.punishWindow > 0 ? '#fef08a' : '#cbd5e1';
    drawFittedText(ctx, punishText, leftX, panelY + 144, 260, '900 12px Outfit, sans-serif');

    drawBar(ctx, rightX, panelY + 42, 246, 18, boss.hp, boss.maxHp, '#ef4444', true);
    drawBar(ctx, rightX + 48, panelY + 66, 198, 10, boss.posture, 100, '#a78bfa', true);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#f8fafc';
    drawFittedText(ctx, `Aschewaechter P${boss.phase}`, rightX + 246, panelY + 108, 250, '900 12px Outfit, sans-serif');
    ctx.fillStyle = '#c4b5fd';
    drawFittedText(ctx, `Block ${game.stats.blocks} · Riposte ${game.stats.ripostes} · Schatten ${game.stats.shades}`, rightX + 246, panelY + 126, 260, '900 12px Outfit, sans-serif');
    ctx.fillStyle = boss.stagger > 0 ? '#fef3c7' : '#c4b5fd';
    drawFittedText(ctx, `Stance-Breaks ${game.stats.stanceBreaks} · Posture ${Math.round(boss.posture)}`, rightX + 246, panelY + 144, 260, '900 12px Outfit, sans-serif');

    ctx.textAlign = 'center';
    ctx.fillStyle = '#cbd5e1';
    const compactGoals = game.goals.slice(0, 4).map((goal) => {
      const progress = Math.floor(clamp(statValue(game, goal), 0, goal.target));
      return `${goal.done ? 'OK' : `${progress}/${goal.target}`} ${goal.label}`;
    }).join('  |  ');
    drawFittedText(ctx, compactGoals, CENTER_X, panelY + 166, panelW - 40, '900 11px Outfit, sans-serif', 8);
    ctx.fillStyle = game.activeContract ? '#fef08a' : '#94a3b8';
    drawFittedText(ctx, game.activeContract ? `Eid ${contractProgress.value}/${contractProgress.target}: ${game.activeContract.label} · ${Math.ceil(game.contractTimer)}s` : `naechster Eid ${game.contractCooldown.toFixed(1)}s`, CENTER_X, panelY + 184, panelW - 46, '900 11px Outfit, sans-serif', 8);

    if (game.mode === 'learn') {
      const prompt = currentPrompt(game);
      ctx.fillStyle = 'rgba(2,6,23,.78)';
      drawRoundedRect(ctx, CENTER_X - 300, panelY + 208, 600, 70, 16);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      drawFittedText(ctx, prompt.sentence, CENTER_X, panelY + 236, 560, '900 17px Outfit, sans-serif', 11);
      ctx.fillStyle = '#67e8f9';
      drawFittedText(ctx, `${prompt.subject}: richtige Rune fuer "${prompt.word}"`, CENTER_X, panelY + 260, 560, '800 13px Outfit, sans-serif', 10);
    }

    if (game.messageTimer > 0) {
      ctx.fillStyle = 'rgba(2,6,23,.72)';
      drawRoundedRect(ctx, CENTER_X - 260, HEIGHT - 96, 520, 48, 18);
      ctx.fill();
      ctx.fillStyle = '#fef3c7';
      drawFittedText(ctx, game.message, CENTER_X, HEIGHT - 66, 480, '900 21px Outfit, sans-serif', 12);
    }

    ctx.restore();
    return;
  }

  drawBar(ctx, 42, 28, 358, 28, player.hp, 100, '#22c55e');
  drawBar(ctx, 42, 64, 260, 16, player.stamina, 100, '#facc15');
  drawBar(ctx, 42, 88, 220, 12, player.focus, 100, '#38bdf8');
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '900 21px Outfit, sans-serif';
  ctx.fillText(`Trank ${player.estus}`, 318, 82);
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.fillStyle = player.rally > 0 ? '#86efac' : '#94a3b8';
  ctx.fillText(`Faska Souls Pro · Rally ${Math.round(player.rally)}`, 42, 122);
  ctx.fillStyle = player.lockOn ? '#67e8f9' : '#94a3b8';
  ctx.fillText(`${player.lockOn ? 'LOCK-ON' : 'FREI'} · Blocks ${game.stats.blocks} · Ripostes ${game.stats.ripostes}`, 42, 140);
  ctx.fillStyle = player.guardCounterWindow > 0 ? '#fef08a' : '#cbd5e1';
  ctx.fillText(`Counter ${game.stats.guardCounters} · Backstab ${game.stats.backstabs} · Fenster ${player.guardCounterWindow > 0 ? player.guardCounterWindow.toFixed(1) : '-'}`, 42, 158);
  ctx.fillStyle = player.punishWindow > 0 ? '#fef08a' : '#cbd5e1';
  ctx.fillText(punishText, 42, 176);

  drawBar(ctx, WIDTH - 542, 30, 500, 30, boss.hp, boss.maxHp, '#ef4444', true);
  drawBar(ctx, WIDTH - 342, 70, 300, 14, boss.posture, 100, '#a78bfa', true);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 22px Outfit, sans-serif';
  ctx.fillText(`Aschewaechter Phase ${boss.phase}`, WIDTH - 44, 112);

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.72)';
  drawRoundedRect(ctx, 42, 182, 330, 160, 16);
  ctx.fill();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '900 13px Outfit, sans-serif';
  ctx.fillText('MEISTERUNGEN', 62, 208);
  ctx.fillStyle = '#c4b5fd';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText(`Schatten ${game.stats.shades} · Eid-Siegel ${game.stats.sigils}/${game.sigils.length}`, 62, 226);
  game.goals.slice(0, 7).forEach((goal, index) => {
    const progress = Math.floor(clamp(statValue(game, goal), 0, goal.target));
    ctx.fillStyle = goal.done ? '#86efac' : '#cbd5e1';
    ctx.fillText(`${goal.done ? 'OK' : `${progress}/${goal.target}`} ${goal.label}`, 62, 246 + index * 15);
  });

  ctx.fillStyle = 'rgba(2,6,23,.72)';
  drawRoundedRect(ctx, 42, 356, 330, 130, 16);
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.font = '900 13px Outfit, sans-serif';
  ctx.fillText(`EIDE ${game.contractSeals} erfuellt · ${game.contractFails} gebrochen`, 62, 382);
  ctx.fillStyle = game.activeContract ? '#f8fafc' : '#94a3b8';
  ctx.font = '900 14px Outfit, sans-serif';
  drawFittedText(ctx, game.activeContract ? game.activeContract.label : `naechster Eid ${game.contractCooldown.toFixed(1)}s`, 62, 406, 288, '900 14px Outfit, sans-serif', 10);
  ctx.fillStyle = 'rgba(148,163,184,.22)';
  drawRoundedRect(ctx, 62, 420, 284, 10, 5);
  ctx.fill();
  ctx.fillStyle = game.activeContract ? '#86efac' : '#475569';
  drawRoundedRect(ctx, 62, 420, 284 * contractProgress.ratio, 10, 5);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 12px Outfit, sans-serif';
  ctx.fillText(game.activeContract ? `${contractProgress.value}/${contractProgress.target} · ${Math.ceil(game.contractTimer)}s` : 'bereitmachen', 62, 450);
  ctx.fillStyle = bonfire.lit && !bonfire.spent ? '#fef08a' : bonfire.spent ? '#94a3b8' : '#fed7aa';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText(`${bonfireText} · Revives ${game.stats.revives}`, 62, 470);

  if (game.mode === 'learn') {
    const prompt = currentPrompt(game);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.76)';
    drawRoundedRect(ctx, WIDTH / 2 - 340, 112, 680, 74, 18);
    ctx.fill();
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '900 20px Outfit, sans-serif';
    ctx.fillText(prompt.sentence, WIDTH / 2, 140);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 15px Outfit, sans-serif';
    ctx.fillText(`${prompt.subject}: Beruehre die richtige Antwort fuer "${prompt.word}".`, WIDTH / 2, 166);
  }

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.72)';
    drawRoundedRect(ctx, WIDTH / 2 - 220, HEIGHT - 118, 440, 54, 18);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 25px Outfit, sans-serif';
    ctx.fillText(game.message, WIDTH / 2, HEIGHT - 83);
  }

  ctx.restore();
}

function drawPlayer(ctx, player, game) {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.scale(player.facing, 1);
  ctx.globalAlpha = player.invuln > 0 && Math.sin(game.elapsed * 45) > 0 ? 0.52 : 1;
  ctx.shadowColor = player.runeBuff > 0 ? '#5eead4' : 'transparent';
  ctx.shadowBlur = player.runeBuff > 0 ? 24 : 0;

  ctx.fillStyle = 'rgba(0,0,0,.36)';
  ctx.beginPath();
  ctx.ellipse(0, 20, 34, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  if (player.punishWindow > 0) {
    const pulse = 1 + Math.sin(game.elapsed * 22) * 0.06 + player.punishStacks * 0.035;
    ctx.save();
    ctx.scale(pulse, pulse);
    ctx.strokeStyle = player.punishPulse > 0 ? 'rgba(254,240,138,.92)' : 'rgba(254,240,138,.58)';
    ctx.lineWidth = 5 + player.punishStacks;
    ctx.beginPath();
    ctx.arc(0, -18, 62 + player.punishStacks * 6, -Math.PI * 0.9, Math.PI * 0.9);
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = player.hurtTimer > 0 ? '#93c5fd' : '#2563eb';
  drawRoundedRect(ctx, -24, -42, 48, 62, 14);
  ctx.fill();
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(0, -62, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111827';
  ctx.fillRect(7, -66, 5, 5);

  ctx.strokeStyle = player.parryTimer > 0 ? '#93c5fd' : player.guard > 0 ? '#facc15' : player.attack?.type === 'focus' ? '#38bdf8' : '#cbd5e1';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-24, -30);
  ctx.lineTo(-48, -10);
  ctx.stroke();

  const slash = player.attack ? Math.sin(Math.min(1, player.attack.timer / (player.attack.startup + player.attack.active)) * Math.PI) : 0;
  ctx.strokeStyle = player.attack?.type === 'riposte' || player.attack?.type === 'backstab' ? '#fef3c7' : player.attack?.type === 'focus' ? '#38bdf8' : player.attack?.type === 'counter' || player.attack?.type === 'heavy' ? '#facc15' : '#e2e8f0';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(20, -30);
  ctx.lineTo(52 + slash * 54, -52 + slash * 16);
  ctx.stroke();
  if (player.attack) {
    ctx.strokeStyle = 'rgba(248,250,252,.45)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(50, -34, (player.attack.type === 'focus' ? 76 : player.attack.type === 'riposte' || player.attack.type === 'backstab' ? 64 : player.attack.type === 'counter' ? 62 : 54) + slash * (player.attack.type === 'focus' ? 54 : player.attack.type === 'riposte' || player.attack.type === 'backstab' ? 64 : player.attack.type === 'counter' ? 48 : 36), -0.7, 0.9);
    ctx.stroke();
  }
  if (player.guard > 0) {
    ctx.strokeStyle = 'rgba(250,204,21,.78)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(18, -20, 52, -1.15, 1.05);
    ctx.stroke();
  }
  if (player.guardCounterWindow > 0) {
    ctx.strokeStyle = 'rgba(254,240,138,.66)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, -20, 66 + Math.sin(game.elapsed * 18) * 4, -1.35, 1.25);
    ctx.stroke();
  }
  if (player.parryTimer > 0) {
    ctx.strokeStyle = 'rgba(147,197,253,.8)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, -26, 58, -1.2, 1.2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBossTelegraph(ctx, boss) {
  if (!boss.windup) return;
  const progress = clamp(boss.windup.timer / boss.windup.duration, 0, 1);
  ctx.save();
  ctx.globalAlpha = 0.28 + progress * 0.46;
  ctx.fillStyle = '#ef4444';
  ctx.strokeStyle = '#fecaca';
  ctx.lineWidth = 4;
  if (boss.windup.type === 'eruption') {
    ctx.beginPath();
    ctx.arc(boss.windup.targetX, boss.windup.targetY, 118, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (boss.windup.type === 'slam') {
    ctx.beginPath();
    ctx.arc(boss.windup.targetX, boss.windup.targetY, 104, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (boss.windup.type === 'lunge') {
    const dir = normalize(boss.windup.targetX - boss.x, boss.windup.targetY - boss.y);
    ctx.translate(boss.x, boss.y);
    ctx.rotate(Math.atan2(dir.y, dir.x));
    drawRoundedRect(ctx, 0, -38, 260, 76, 28);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, 124, -1.2 + (boss.facing < 0 ? Math.PI : 0), 1.2 + (boss.facing < 0 ? Math.PI : 0));
    ctx.lineTo(boss.x, boss.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawBoss(ctx, boss, game) {
  ctx.save();
  ctx.translate(boss.x, boss.y);
  ctx.scale(boss.facing, 1);
  ctx.shadowColor = boss.phase >= 3 ? '#fb7185' : boss.phase === 2 ? '#ef4444' : '#7dd3fc';
  ctx.shadowBlur = boss.stagger > 0 ? 10 : 18;
  ctx.fillStyle = 'rgba(0,0,0,.38)';
  ctx.beginPath();
  ctx.ellipse(0, 26, 62, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = boss.hurtTimer > 0 ? '#fb7185' : boss.phase >= 3 ? '#581c87' : boss.phase === 2 ? '#7f1d1d' : '#334155';
  drawRoundedRect(ctx, -44, -86, 88, 112, 22);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  drawRoundedRect(ctx, -32, -128, 64, 52, 18);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(8, -110, 8, 8);
  ctx.strokeStyle = boss.windup ? '#fecaca' : '#94a3b8';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(38, -60);
  ctx.lineTo(80 + (boss.windup ? 30 : 0), -34);
  ctx.stroke();
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(74, -38);
  ctx.lineTo(130, -70);
  ctx.stroke();
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(-30, -54);
  ctx.lineTo(-70, -26);
  ctx.stroke();
  if (boss.stagger > 0) {
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, -146, 34 + Math.sin(game.elapsed * 18) * 5, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawShade(ctx, shade, game) {
  ctx.save();
  ctx.translate(shade.x, shade.y);
  const scale = shade.type === 'bell' ? 1.18 : shade.type === 'hound' ? 0.86 : 1;
  ctx.scale(scale, scale);
  ctx.shadowColor = shade.color;
  ctx.shadowBlur = shade.hurtTimer > 0 ? 22 : 12;
  ctx.fillStyle = 'rgba(0,0,0,.36)';
  ctx.beginPath();
  ctx.ellipse(0, 18, 27, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = shade.hurtTimer > 0 ? '#f8fafc' : shade.type === 'hound' ? '#7c2d12' : shade.type === 'bell' ? '#312e81' : '#1f2937';
  if (shade.type === 'hound') {
    drawRoundedRect(ctx, -30, -24, 60, 34, 14);
    ctx.fill();
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(24, -26, 16, 0, Math.PI * 2);
    ctx.fill();
  } else {
    drawRoundedRect(ctx, -24, -48, 48, 68, 16);
    ctx.fill();
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(0, -62, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = shade.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, -30, 34 + Math.sin(game.elapsed * 8 + shade.id) * 3, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (shade.hp < shade.maxHp) {
    ctx.fillStyle = 'rgba(2,6,23,.8)';
    drawRoundedRect(ctx, -30, -82, 60, 8, 4);
    ctx.fill();
    ctx.fillStyle = shade.color;
    drawRoundedRect(ctx, -28, -80, 56 * clamp(shade.hp / shade.maxHp, 0, 1), 4, 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSparks(ctx, sparks) {
  sparks.forEach((spark) => {
    ctx.save();
    ctx.globalAlpha = clamp(spark.life / (spark.text ? 0.9 : 0.55), 0, 1);
    ctx.fillStyle = spark.color;
    if (spark.text) {
      ctx.font = '900 18px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(spark.text, spark.x, spark.y);
    } else {
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, 4 + spark.life * 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
}

function drawLockOn(ctx, game) {
  if (!game.player.lockOn || game.boss.hp <= 0) return;
  const boss = game.boss;
  const pulse = Math.sin(game.elapsed * 9) * 4;
  ctx.save();
  ctx.strokeStyle = boss.stagger > 0 ? '#fef3c7' : '#67e8f9';
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.72;
  ctx.beginPath();
  ctx.arc(boss.x, boss.y - 44, 74 + pulse, -0.2, Math.PI + 0.2);
  ctx.stroke();
  ctx.fillStyle = boss.stagger > 0 ? '#fef3c7' : '#67e8f9';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(boss.stagger > 0 ? 'RIPOSTE-FENSTER' : 'LOCK', boss.x, boss.y - 136);
  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawArena(ctx, game);
  drawBossTelegraph(ctx, game.boss);
  drawLockOn(ctx, game);
  const actors = [game.player, game.boss, ...game.shades.filter((shade) => shade.alive)].sort((a, b) => a.y - b.y);
  actors.forEach((actor) => {
    if (actor === game.player) drawPlayer(ctx, game.player, game);
    else if (actor === game.boss) drawBoss(ctx, game.boss, game);
    else drawShade(ctx, actor, game);
  });
  drawSparks(ctx, game.sparks);
  drawHud(ctx, game);
}

export default function FaskaSoulsSwarm() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameRef = useRef(makeInitialGame('arcade'));
  const inputRef = useRef({
    left: false,
    right: false,
    up: false,
    down: false,
    light: false,
    heavy: false,
    focus: false,
    block: false,
    parry: false,
    roll: false,
    estus: false,
    riposte: false,
    lock: false,
  });
  const modeRef = useRef('arcade');
  const [mode, setMode] = useState('arcade');
  const [result, setResult] = useState(null);

  const clearInput = useCallback(() => {
    inputRef.current = {
      left: false,
      right: false,
      up: false,
      down: false,
      light: false,
      heavy: false,
      focus: false,
      block: false,
      parry: false,
      roll: false,
      estus: false,
      riposte: false,
      lock: false,
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;
    let raf = 0;
    let last = performance.now();
    const keyMap = new Map([
      ['ArrowLeft', 'left'], ['a', 'left'], ['A', 'left'],
      ['ArrowRight', 'right'], ['d', 'right'], ['D', 'right'],
      ['ArrowUp', 'up'], ['w', 'up'], ['W', 'up'],
      ['ArrowDown', 'down'], ['s', 'down'], ['S', 'down'],
      ['j', 'light'], ['J', 'light'],
      ['k', 'heavy'], ['K', 'heavy'],
      ['l', 'focus'], ['L', 'focus'],
      ['q', 'block'], ['Q', 'block'],
      [' ', 'parry'],
      ['Shift', 'roll'],
      ['e', 'estus'], ['E', 'estus'],
      ['u', 'riposte'], ['U', 'riposte'],
      ['o', 'lock'], ['O', 'lock'],
    ]);
    const keyDown = (event) => {
      const mapped = keyMap.get(event.key);
      if (mapped) {
        inputRef.current[mapped] = true;
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
        gameRef.current.isPortraitTouch = window.matchMedia('(max-width: 700px) and (orientation: portrait)').matches;
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
    boxShadow: '0 12px 32px rgba(0,0,0,.3)',
  };
  const actionButton = {
    ...padButton,
    width: 82,
    height: 62,
    fontSize: 13,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050a13', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
      <canvas
        className="souls-canvas"
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
          boxShadow: '0 0 120px rgba(220,38,38,.18), inset 0 0 80px rgba(251,146,60,.08), 0 0 90px rgba(0,0,0,.55)',
        }}
      />

      {/* Post-processing vignette overlay */}
      <div className="souls-vignette" style={{
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

      <div className="souls-modebar" style={{ position: 'fixed', top: canvasTopChrome, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.55 }}>
          Normal
        </button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.55 }}>
          Learncade
        </button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      <div className="souls-touch-controls souls-stick-controls" style={{
        position: 'fixed', left: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'grid', gridTemplateColumns: '62px 62px 62px', gridTemplateRows: '62px 62px',
        gap: 8, touchAction: 'none',
      }}>
        <div />
        <button aria-label="Hoch" style={padButton} {...holdButton('up')}>↑</button>
        <div />
        <button aria-label="Links" style={padButton} {...holdButton('left')}>←</button>
        <button aria-label="Runter" style={padButton} {...holdButton('down')}>↓</button>
        <button aria-label="Rechts" style={padButton} {...holdButton('right')}>→</button>
      </div>

      <div className="souls-touch-controls souls-action-controls" style={{
        position: 'fixed', right: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'flex', gap: 10, alignItems: 'flex-end', touchAction: 'none',
      }}>
        <button aria-label="Lock-on" style={actionButton} {...holdButton('lock')}>LOCK</button>
        <button aria-label="Blocken" style={actionButton} {...holdButton('block')}>BLOCK</button>
        <button aria-label="Parry" style={actionButton} {...holdButton('parry')}>PARRY</button>
        <button aria-label="Rolle" style={actionButton} {...holdButton('roll')}>ROLL</button>
        <button aria-label="Heiltrank" style={{ ...actionButton, background: 'rgba(34,197,94,.78)' }} {...holdButton('estus')}>TRANK</button>
        <button aria-label="Leichter Angriff" style={actionButton} {...holdButton('light')}>LIGHT</button>
        <button aria-label="Riposte" style={{ ...actionButton, background: 'rgba(254,243,199,.86)', color: '#111827' }} {...holdButton('riposte')}>RIPOSTE</button>
        <button aria-label="Fokus" style={{ ...actionButton, background: 'rgba(56,189,248,.78)' }} {...holdButton('focus')}>FOCUS</button>
        <button aria-label="Schwerer Angriff" style={{ ...actionButton, width: 92, height: 74, background: 'rgba(250,204,21,.84)', color: '#111827' }} {...holdButton('heavy')}>
          HEAVY
        </button>
      </div>

      {result && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2,6,23,.74)', zIndex: 20, flexDirection: 'column', gap: 16,
        }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: '#f8fafc' }}>{result.result}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#facc15' }}>Score {result.score}</div>
          <div style={{ fontSize: 15, color: '#cbd5e1' }}>Held {result.playerHp} HP · Boss {result.bossHp} HP · Revives {result.revives || 0}</div>
          <button className="btn-primary" onClick={restart}>Noch ein Versuch</button>
        </div>
      )}

      <style>{`
        @media (max-width: 700px) and (orientation: portrait) {
          .souls-canvas,
          .souls-vignette {
            width: 160vw !important;
            height: calc(160vw * 9 / 16) !important;
            left: 50% !important;
            right: auto !important;
            top: 106px !important;
            bottom: auto !important;
            margin: 0 auto !important;
            transform: translateX(-50%) !important;
          }

          .souls-modebar {
            top: 10px !important;
            transform: translateX(-50%) scale(.82) !important;
            transform-origin: top center !important;
          }

          .souls-touch-controls {
            bottom: 14px !important;
          }

          .souls-stick-controls {
            left: 2px !important;
            transform: scale(.68) !important;
            transform-origin: bottom left !important;
          }

          .souls-action-controls {
            right: 4px !important;
            display: grid !important;
            grid-template-columns: repeat(3, 58px) !important;
            gap: 6px !important;
            align-items: end !important;
            transform: none !important;
            transform-origin: bottom right !important;
          }

          .souls-action-controls button {
            width: 58px !important;
            height: 50px !important;
            min-width: 0 !important;
            border-radius: 12px !important;
            font-size: 9px !important;
            padding: 0 !important;
          }
        }

        @media (pointer: fine), (min-width: 900px) {
          .souls-touch-controls {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
