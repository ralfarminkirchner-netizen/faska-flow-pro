import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const STAGE_W = 3300;
const FLOOR_TOP = 318;
const FLOOR_BOTTOM = 640;
const PLAYER_W = 38;
const PLAYER_H = 76;

const LANE_ZONES = [
  { id: 'upper', label: 'OBERE GASSE', x: 740, y: 382, radius: 72, color: '#67e8f9' },
  { id: 'center', label: 'MITTE', x: 1480, y: 500, radius: 82, color: '#facc15' },
  { id: 'lower', label: 'UNTERE RAMPE', x: 2360, y: 594, radius: 76, color: '#a78bfa' },
];

const WEAPON_PROFILES = {
  pipe: { label: 'Rohr', damage: 18, range: 34, width: 12, durability: 12, color: '#94a3b8' },
  bat: { label: 'Schlaeger', damage: 24, range: 42, width: 18, durability: 10, color: '#d97706' },
  chain: { label: 'Kette', damage: 14, range: 62, width: 6, durability: 14, color: '#cbd5e1' },
};

const PROP_SEEDS = [
  { kind: 'crate', x: 520, y: 585, hp: 46, reward: 'food', color: '#92400e' },
  { kind: 'barrel', x: 930, y: 408, hp: 58, reward: 'weapon:pipe', color: '#f97316' },
  { kind: 'sign', x: 1280, y: 590, hp: 42, reward: 'weapon:bat', color: '#38bdf8' },
  { kind: 'crate', x: 1820, y: 446, hp: 52, reward: 'energy', color: '#92400e' },
  { kind: 'barrel', x: 2160, y: 608, hp: 64, reward: 'weapon:chain', color: '#f97316' },
  { kind: 'crate', x: 2840, y: 510, hp: 58, reward: 'food', color: '#92400e' },
];

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "kaempft"?',
    answer: 'Verb',
    options: ['Nomen', 'Verb', 'Adjektiv'],
  },
  {
    subject: 'Mathe',
    prompt: '8 x 7 = ?',
    answer: '56',
    options: ['48', '56', '64'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "street"?',
    answer: 'Strasse',
    options: ['Stern', 'Strasse', 'Stuhl'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welches Wort ist ein Adjektiv?',
    answer: 'stark',
    options: ['stark', 'Schlag', 'springen'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Muskeln brauchen Energie aus ...',
    answer: 'Nahrung',
    options: ['Nahrung', 'Glas', 'Sand'],
  },
];

const ENEMY_TYPES = {
  grunt: { hp: 58, speed: 96, color: '#fb7185', score: 140, damage: 6, range: 46 },
  kicker: { hp: 76, speed: 84, color: '#38bdf8', score: 190, damage: 8, range: 58 },
  brute: { hp: 150, speed: 58, color: '#f97316', score: 360, damage: 13, range: 62 },
  knife: { hp: 66, speed: 106, color: '#facc15', score: 220, damage: 8, range: 54 },
  thrower: { hp: 70, speed: 72, color: '#22c55e', score: 230, damage: 7, range: 210 },
  medic: { hp: 82, speed: 78, color: '#f0abfc', score: 260, damage: 5, range: 46 },
  boss: { hp: 760, speed: 68, color: '#a78bfa', score: 1900, damage: 18, range: 82 },
};

const BRAWLER_GOALS = [
  { id: 'wave_3', label: '3 Wellen klaeren', stat: 'wavesCleared', target: 3, mode: 'arcade', reward: 900 },
  { id: 'combo_12', label: '12er Combo', stat: 'bestCombo', target: 12, mode: 'both', reward: 800 },
  { id: 'parry_4', label: '4 Parries', stat: 'parries', target: 4, mode: 'both', reward: 700 },
  { id: 'throw_3', label: '3 Wuerfe', stat: 'throws', target: 3, mode: 'arcade', reward: 650 },
  { id: 'super_2', label: '2 Supers', stat: 'supers', target: 2, mode: 'both', reward: 900 },
  { id: 'weapon_10', label: '10 Waffen-Treffer', stat: 'weaponHits', target: 10, mode: 'both', reward: 850 },
  { id: 'props_5', label: '5 Objekte zerstoeren', stat: 'propsBroken', target: 5, mode: 'both', reward: 650 },
  { id: 'zones_3', label: '3 Lanes sichern', stat: 'zonesCaptured', target: 3, mode: 'both', reward: 900 },
  { id: 'juggle_5', label: '5 Juggle-Treffer', stat: 'juggleHits', target: 5, mode: 'both', reward: 700 },
  { id: 'learn_3', label: '3 Learncade-Stelen', stat: 'learnCorrect', target: 3, mode: 'learn', reward: 1200 },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

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

function makeLearnShrines(taskIndex, anchorX) {
  const task = LEARN_TASKS[taskIndex % LEARN_TASKS.length];
  const lanes = [390, 480, 570];
  return task.options.map((label, index) => ({
    id: `${taskIndex}-${label}`,
    label,
    correct: label === task.answer,
    x: clamp(anchorX + index * 150, 360, STAGE_W - 360),
    y: lanes[index],
    w: 112,
    h: 58,
    resolved: false,
    pulse: index * 0.8,
  }));
}

function createStats() {
  return {
    wavesCleared: 0,
    bestCombo: 0,
    parries: 0,
    throws: 0,
    supers: 0,
    learnCorrect: 0,
    defeats: 0,
    weaponHits: 0,
    propsBroken: 0,
    zonesCaptured: 0,
    juggleHits: 0,
  };
}

function createGoals(mode) {
  const weight = goal => (goal.mode === mode ? 0 : goal.mode === 'both' ? 1 : 2);
  return BRAWLER_GOALS
    .filter(goal => goal.mode === 'both' || goal.mode === mode)
    .sort((a, b) => weight(a) - weight(b))
    .map(goal => ({ ...goal, completed: false }));
}

function recordStat(game, stat, amount = 1, absolute = false) {
  const current = game.stats[stat] || 0;
  game.stats[stat] = absolute ? Math.max(current, amount) : current + amount;
  const completed = game.goals.find(goal => !goal.completed && goal.stat === stat && game.stats[stat] >= goal.target);
  if (!completed) return;
  completed.completed = true;
  game.score += completed.reward;
  game.goalNotice = `${completed.label} +${completed.reward}`;
  game.goalNoticeTimer = 2.2;
  game.message = `Mission geschafft: ${completed.label}`;
  game.messageTimer = 1.35;
}

function makeEnemy(type, x, y, wave) {
  const profile = ENEMY_TYPES[type];
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    x,
    y,
    vx: 0,
    hp: Math.round(profile.hp * (1 + wave * 0.06)),
    maxHp: Math.round(profile.hp * (1 + wave * 0.06)),
    speed: profile.speed,
    color: profile.color,
    score: profile.score,
    damage: profile.damage,
    range: profile.range,
    facing: -1,
    attackTimer: 0.9 + Math.random() * 0.65,
    specialTimer: type === 'medic' ? 1.2 : type === 'boss' ? 1.8 : 0.8,
    windup: 0,
    stun: 0,
    airborne: 0,
    enrage: false,
    hitFlash: 0,
  };
}

function makeProp(seed, index = 0) {
  return {
    ...seed,
    id: `${seed.kind}-${index}`,
    maxHp: seed.hp,
    broken: false,
    hitFlash: 0,
  };
}

function makeStageProps() {
  return PROP_SEEDS.map((seed, index) => makeProp(seed, index));
}

function spawnDrop(game, x, y, kind) {
  game.drops.push({
    id: `drop-${kind}-${game.elapsed}-${game.drops.length}`,
    x,
    y,
    kind,
    life: 12,
    pulse: 0,
  });
}

function spawnWave(game) {
  game.wave += 1;
  const bossWave = game.wave % 4 === 0;
  if (bossWave) {
    game.enemies.push(makeEnemy('boss', game.player.x + 620, 458, game.wave));
    game.message = `Boss-Welle ${game.wave}`;
    game.messageTimer = 1.2;
    return;
  }
  const count = game.wave === 1 ? 3 : clamp(3 + game.wave, 4, 9);
  const pattern = ['grunt', 'kicker', 'knife', 'thrower', 'grunt', 'brute', 'medic', 'kicker', 'knife'];
  for (let i = 0; i < count; i += 1) {
    const side = game.wave === 1 ? 1 : i % 2 === 0 ? 1 : -1;
    let x = clamp(game.player.x + side * (540 + i * 82), 160, STAGE_W - 160);
    if (Math.abs(x - game.player.x) < 360) x = clamp(game.player.x + Math.sign(side || 1) * 380, 160, STAGE_W - 160);
    const y = 360 + (i % 4) * 74;
    game.enemies.push(makeEnemy(pattern[(i + game.wave) % pattern.length], x, y, game.wave));
  }
  game.message = `Welle ${game.wave}`;
  game.messageTimer = 0.85;
}

function spawnParticles(game, x, y, color, count = 10, speed = 180) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed;
    const burst = speed * (0.45 + (i % 5) * 0.14);
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * burst,
      vy: Math.sin(angle) * burst,
      life: 0.52,
      maxLife: 0.52,
      size: 4 + (i % 3) * 2,
      color,
    });
  }
}

function addFloater(game, x, y, text, color = '#facc15') {
  game.floaters.push({ x, y, text, color, life: 0.9, vy: -44 });
}

function makeInitialGame(mode = 'arcade') {
  const game = {
    mode,
    elapsed: 0,
    phase: 'play',
    score: 0,
    wave: 0,
    combo: 0,
    bestCombo: 0,
    taskIndex: 0,
    nextWaveDelay: 0,
    shrineCooldown: 0,
    shake: 0,
    hitStop: 0,
    goalNotice: '',
    goalNoticeTimer: 0,
    stats: createStats(),
    goals: createGoals(mode),
    message: mode === 'learn' ? 'Kaempfe und triff die richtige Learncade-Stele fuer Kampfboni.' : 'Schlaege, Tritte, Dash und Spezialangriff gegen Wellen.',
    messageTimer: 2,
    player: {
      x: 260,
      y: 500,
      vx: 0,
      vy: 0,
      hp: 220,
      maxHp: 220,
      energy: 100,
      facing: 1,
      attackCooldown: 0,
      attackWindow: 0,
      attackKind: 'jab',
      dashTimer: 0,
      dashCooldown: 0,
      guardTimer: 0,
      guardCooldown: 0,
      parryWindow: 0,
      guardHeld: false,
      grabCooldown: 0,
      superCooldown: 0,
      superTimer: 0,
      invuln: 1.1,
      hurtFlash: 0,
      comboStep: 0,
      weapon: null,
      pickupCooldown: 0,
      laneBoostTimer: 0,
    },
    camera: { x: 0 },
    input: {
      up: false,
      down: false,
      left: false,
      right: false,
      punch: false,
      kick: false,
      dash: false,
      special: false,
      guard: false,
      grab: false,
      super: false,
      pickup: false,
    },
    enemies: [],
    props: makeStageProps(),
    drops: [],
    projectiles: [],
    zones: LANE_ZONES.map((zone) => ({ ...zone, capture: 0, owner: 'neutral', pulse: 0 })),
    shrines: mode === 'learn' ? makeLearnShrines(0, 580) : [],
    particles: [],
    floaters: [],
    result: null,
  };
  spawnWave(game);
  return game;
}

function hitPlayer(game, enemy) {
  const player = game.player;
  if (player.invuln > 0 || game.phase !== 'play') return;
  const isFacingThreat = (enemy.x - player.x) * player.facing > -16;
  if (isFacingThreat && player.guardTimer > 0 && player.energy > 4) {
    if (player.parryWindow > 0) {
      enemy.stun = Math.max(enemy.stun, 0.62);
      enemy.vx -= enemy.facing * 360;
      player.energy = Math.min(100, player.energy + 26);
      player.invuln = 0.16;
      game.combo += 2;
      game.bestCombo = Math.max(game.bestCombo, game.combo);
      game.shake = 0.16;
      game.hitStop = 0.05;
      recordStat(game, 'parries');
      recordStat(game, 'bestCombo', game.bestCombo, true);
      addFloater(game, player.x + player.facing * 44, player.y - 86, 'PARRY', '#67e8f9');
      spawnParticles(game, player.x + player.facing * 38, player.y - 54, '#67e8f9', 22, 300);
      return;
    }
    const blocked = Math.ceil(enemy.damage * 0.28);
    player.hp -= blocked;
    player.energy = Math.max(0, player.energy - 12);
    player.invuln = 0.22;
    game.shake = 0.05;
    addFloater(game, player.x + player.facing * 30, player.y - 74, 'Guard', '#bfdbfe');
    spawnParticles(game, player.x + player.facing * 30, player.y - 54, '#bfdbfe', 10, 170);
    if (player.hp <= 0) {
      player.hp = 0;
      game.phase = 'result';
      game.result = { title: 'Kampf verloren', score: game.score, wave: game.wave };
    }
    return;
  }
  player.hp -= enemy.damage;
  player.invuln = 0.82;
  player.hurtFlash = 0.22;
  player.comboStep = 0;
  game.combo = 0;
  game.shake = 0.18;
  player.x += enemy.facing * 22;
  addFloater(game, player.x, player.y - 68, `-${enemy.damage}`, '#fb7185');
  spawnParticles(game, player.x, player.y - 42, '#fb7185', 14, 210);
  if (player.hp <= 0) {
    player.hp = 0;
    game.phase = 'result';
    game.result = { title: 'Kampf verloren', score: game.score, wave: game.wave };
  }
}

function damageEnemy(game, enemy, amount, knock, label, options = {}) {
  if (enemy.hp <= 0) return;
  if (enemy.airborne > 0) recordStat(game, 'juggleHits');
  enemy.hp -= amount;
  enemy.stun = Math.max(enemy.stun, 0.16);
  enemy.airborne = Math.max(enemy.airborne || 0, options.launch || 0);
  enemy.hitFlash = 0.14;
  enemy.vx += knock * 230;
  if (options.weapon) recordStat(game, 'weaponHits');
  game.shake = Math.max(game.shake, enemy.type === 'boss' ? 0.13 : 0.07);
  game.combo += 1;
  game.bestCombo = Math.max(game.bestCombo, game.combo);
  recordStat(game, 'bestCombo', game.bestCombo, true);
  addFloater(game, enemy.x, enemy.y - 72, `${label} ${amount}`, '#fef3c7');
  spawnParticles(game, enemy.x, enemy.y - 42, enemy.color, enemy.type === 'boss' ? 16 : 9, 180);
  if (enemy.type === 'boss' && !enemy.enrage && enemy.hp > 0 && enemy.hp < enemy.maxHp * 0.48) {
    enemy.enrage = true;
    enemy.speed *= 1.28;
    enemy.damage += 7;
    enemy.stun = 0.55;
    game.message = 'Boss Phase 2';
    game.messageTimer = 1;
    spawnParticles(game, enemy.x, enemy.y - 70, '#f0abfc', 38, 330);
  }
  if (enemy.hp <= 0) {
    enemy.hp = 0;
    const gain = Math.round(enemy.score * (1 + game.combo * 0.035));
    game.score += gain;
    game.player.energy = Math.min(100, game.player.energy + (enemy.type === 'boss' ? 38 : 18));
    recordStat(game, 'defeats');
    addFloater(game, enemy.x, enemy.y - 92, `+${gain}`, '#facc15');
    spawnParticles(game, enemy.x, enemy.y - 42, '#facc15', enemy.type === 'boss' ? 30 : 18, 260);
  }
}

function breakProp(game, prop) {
  if (prop.broken) return;
  prop.broken = true;
  recordStat(game, 'propsBroken');
  game.score += 90;
  addFloater(game, prop.x, prop.y - 48, '+90', '#facc15');
  spawnParticles(game, prop.x, prop.y - 28, prop.color, 18, 230);
  if (prop.reward === 'food') spawnDrop(game, prop.x, prop.y, 'food');
  else if (prop.reward === 'energy') spawnDrop(game, prop.x, prop.y, 'energy');
  else if (prop.reward?.startsWith('weapon:')) spawnDrop(game, prop.x, prop.y, prop.reward.split(':')[1]);
}

function damageProp(game, prop, amount, label = 'Hit') {
  if (prop.broken) return;
  prop.hp -= amount;
  prop.hitFlash = 0.16;
  addFloater(game, prop.x, prop.y - 44, label, '#fef3c7');
  if (prop.hp <= 0) breakProp(game, prop);
  else spawnParticles(game, prop.x, prop.y - 24, prop.color, 7, 120);
}

function performAttack(game, kind) {
  const player = game.player;
  if (player.attackCooldown > 0) return;
  if (kind === 'special' && player.energy < 36) return;
  const weapon = player.weapon ? WEAPON_PROFILES[player.weapon.id] : null;
  const table = {
    jab: { damage: 24 + player.comboStep * 4, range: 84, cooldown: 0.24, width: 46, label: 'Jab', cost: 0 },
    kick: { damage: 36, range: 108, cooldown: 0.38, width: 58, label: 'Kick', cost: 0 },
    special: { damage: 68, range: 146, cooldown: 0.68, width: 88, label: 'Burst', cost: 36 },
  };
  const attack = { ...table[kind] };
  if (weapon && kind !== 'special') {
    attack.damage += weapon.damage;
    attack.range += weapon.range;
    attack.width += weapon.width;
    attack.label = weapon.label;
    attack.cooldown += 0.06;
  }
  player.energy = Math.max(0, player.energy - attack.cost);
  player.attackCooldown = attack.cooldown;
  player.attackWindow = 0.13;
  player.attackKind = kind;
  player.comboStep = kind === 'jab' ? (player.comboStep + 1) % 3 : 0;
  const hitX = player.x + player.facing * attack.range * 0.5;
  spawnParticles(game, hitX, player.y - 46, kind === 'special' ? '#a78bfa' : '#e0f2fe', kind === 'special' ? 18 : 8, 160);
  game.enemies.forEach((enemy) => {
    if (enemy.hp <= 0) return;
    const ahead = (enemy.x - player.x) * player.facing;
    const lane = Math.abs(enemy.y - player.y);
    if (ahead > -24 && ahead < attack.range && lane < attack.width) {
      damageEnemy(game, enemy, attack.damage, player.facing, attack.label, {
        weapon: !!weapon,
        launch: kind === 'kick' ? 0.36 : kind === 'special' ? 0.48 : 0,
      });
      if (weapon) {
        player.weapon.durability -= 1;
        if (player.weapon.durability <= 0) {
          addFloater(game, player.x, player.y - 92, `${weapon.label} bricht`, '#fca5a5');
          spawnParticles(game, player.x + player.facing * 56, player.y - 44, weapon.color, 16, 220);
          player.weapon = null;
        }
      }
    }
  });
  game.props.forEach((prop) => {
    if (prop.broken) return;
    const ahead = (prop.x - player.x) * player.facing;
    const lane = Math.abs(prop.y - player.y);
    if (ahead > -24 && ahead < attack.range + 10 && lane < attack.width + 20) {
      damageProp(game, prop, Math.round(attack.damage * 0.7), attack.label);
    }
  });
}

function performThrow(game) {
  const player = game.player;
  if (player.grabCooldown > 0) return;
  player.grabCooldown = 0.58;
  player.attackWindow = 0.18;
  player.attackKind = 'throw';
  const target = game.enemies.find((enemy) => {
    if (enemy.hp <= 0 || enemy.type === 'boss') return false;
    const ahead = (enemy.x - player.x) * player.facing;
    return ahead > -14 && ahead < 72 && Math.abs(enemy.y - player.y) < 48;
  });
  if (!target) {
    addFloater(game, player.x + player.facing * 42, player.y - 62, 'Grab', '#cbd5e1');
    spawnParticles(game, player.x + player.facing * 52, player.y - 48, '#94a3b8', 8, 130);
    return;
  }
  target.stun = 0.72;
  target.vx = player.facing * 620;
  target.y = clamp(target.y + (target.y > player.y ? 22 : -22), FLOOR_TOP + 48, FLOOR_BOTTOM - 22);
  player.invuln = 0.22;
  damageEnemy(game, target, 54, player.facing * 1.4, 'Wurf');
  recordStat(game, 'throws');
  spawnParticles(game, target.x, target.y - 44, '#facc15', 20, 260);
}

function pickupOrUseDrop(game) {
  const player = game.player;
  if (player.pickupCooldown > 0) return;
  player.pickupCooldown = 0.3;
  const drop = game.drops.find((candidate) => dist(player.x, player.y, candidate.x, candidate.y) < 58);
  if (!drop) {
    addFloater(game, player.x + player.facing * 42, player.y - 66, 'Nichts', '#94a3b8');
    return;
  }
  drop.life = 0;
  if (drop.kind === 'food') {
    player.hp = Math.min(player.maxHp, player.hp + 44);
    addFloater(game, player.x, player.y - 82, '+HP', '#86efac');
    spawnParticles(game, player.x, player.y - 42, '#86efac', 14, 170);
    return;
  }
  if (drop.kind === 'energy') {
    player.energy = 100;
    addFloater(game, player.x, player.y - 82, 'ENERGIE', '#67e8f9');
    spawnParticles(game, player.x, player.y - 42, '#67e8f9', 14, 170);
    return;
  }
  const profile = WEAPON_PROFILES[drop.kind];
  if (profile) {
    player.weapon = { id: drop.kind, durability: profile.durability };
    addFloater(game, player.x, player.y - 82, profile.label, profile.color);
    spawnParticles(game, player.x, player.y - 42, profile.color, 14, 170);
  }
}

function performSuper(game) {
  const player = game.player;
  if (player.superCooldown > 0 || player.energy < 100) return;
  player.energy = 0;
  player.superCooldown = 1.4;
  player.superTimer = 0.38;
  player.invuln = 0.62;
  player.attackWindow = 0.32;
  player.attackKind = 'super';
  game.shake = 0.35;
  game.hitStop = 0.08;
  game.message = 'Super Art';
  game.messageTimer = 0.9;
  recordStat(game, 'supers');
  spawnParticles(game, player.x, player.y - 56, '#a78bfa', 36, 360);
  game.enemies.forEach((enemy) => {
    if (enemy.hp <= 0) return;
    const ahead = (enemy.x - player.x) * player.facing;
    const lane = Math.abs(enemy.y - player.y);
    if (ahead > -64 && ahead < 260 && lane < 128) {
      damageEnemy(game, enemy, enemy.type === 'boss' ? 120 : 160, player.facing * 1.8, 'SUPER');
    }
  });
}

function resolveShrine(game, shrine) {
  if (shrine.resolved) return;
  const task = LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
  shrine.resolved = true;
  game.shrineCooldown = 0.7;
  if (shrine.correct) {
    game.score += 620 + game.taskIndex * 55;
    game.player.energy = 100;
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + 26);
    game.combo += 2;
    game.message = `${task.subject}: richtig - Spezial voll`;
    game.messageTimer = 1.1;
    recordStat(game, 'learnCorrect');
    addFloater(game, shrine.x, shrine.y - 62, shrine.label, '#5eead4');
    spawnParticles(game, shrine.x, shrine.y, '#5eead4', 24, 240);
    game.taskIndex += 1;
  } else {
    game.combo = 0;
    game.player.energy = Math.max(0, game.player.energy - 32);
    game.message = `${shrine.label} war falsch. Richtig: ${task.answer}`;
    game.messageTimer = 1.35;
    addFloater(game, shrine.x, shrine.y - 62, 'falsch', '#fb7185');
    spawnParticles(game, shrine.x, shrine.y, '#fb7185', 18, 220);
    const x = clamp(game.player.x + 420, 180, STAGE_W - 180);
    game.enemies.push(makeEnemy('kicker', x, shrine.y, game.wave));
  }
  game.shrines = makeLearnShrines(game.taskIndex, game.player.x + 420);
}

function updatePlayer(game, dt) {
  const player = game.player;
  const input = game.input;
  const moveX = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const moveY = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  if (moveX !== 0) player.facing = moveX;
  player.attackCooldown = Math.max(0, player.attackCooldown - dt);
  player.attackWindow = Math.max(0, player.attackWindow - dt);
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
  player.dashTimer = Math.max(0, player.dashTimer - dt);
  player.guardCooldown = Math.max(0, player.guardCooldown - dt);
  player.parryWindow = Math.max(0, player.parryWindow - dt);
  player.grabCooldown = Math.max(0, player.grabCooldown - dt);
  player.superCooldown = Math.max(0, player.superCooldown - dt);
  player.superTimer = Math.max(0, player.superTimer - dt);
  player.invuln = Math.max(0, player.invuln - dt);
  player.hurtFlash = Math.max(0, player.hurtFlash - dt);
  player.pickupCooldown = Math.max(0, player.pickupCooldown - dt);
  player.laneBoostTimer = Math.max(0, player.laneBoostTimer - dt);
  player.energy = Math.min(100, player.energy + dt * 8);

  if (input.guard && !player.guardHeld && player.guardCooldown <= 0) {
    player.parryWindow = 0.18;
    player.guardCooldown = 0.22;
    player.guardHeld = true;
  } else if (!input.guard) {
    player.guardHeld = false;
  }
  player.guardTimer = input.guard && player.energy > 0 && player.dashTimer <= 0 ? Math.min(player.guardTimer + dt, 1) : 0;
  if (player.guardTimer > 0) {
    player.energy = Math.max(0, player.energy - dt * 4.5);
  }

  if (input.dash && player.dashCooldown <= 0 && player.guardTimer <= 0) {
    player.dashCooldown = 0.54;
    player.dashTimer = 0.16;
    player.invuln = 0.2;
    player.vx = player.facing * 780;
    spawnParticles(game, player.x, player.y - 30, '#67e8f9', 10, 170);
  }

  if (input.super) performSuper(game);
  else if (input.pickup) pickupOrUseDrop(game);
  else if (input.grab) performThrow(game);
  else if (input.special && player.guardTimer <= 0) performAttack(game, 'special');
  else if (input.kick && player.guardTimer <= 0) performAttack(game, 'kick');
  else if (input.punch && player.guardTimer <= 0) performAttack(game, 'jab');

  if (player.dashTimer <= 0) {
    const speedBoost = player.laneBoostTimer > 0 ? 1.14 : 1;
    player.vx = lerp(player.vx, moveX * (player.guardTimer > 0 ? 112 : 230) * speedBoost, 0.18);
  } else {
    player.vx *= Math.pow(0.78, dt * 60);
  }
  player.vy = lerp(player.vy, moveY * 168, 0.2);
  player.x = clamp(player.x + player.vx * dt, 80, STAGE_W - 80);
  player.y = clamp(player.y + player.vy * dt, FLOOR_TOP + 48, FLOOR_BOTTOM - 22);

  if (game.mode === 'learn') {
    game.shrineCooldown = Math.max(0, game.shrineCooldown - dt);
    if (game.shrineCooldown <= 0) {
      const shrine = game.shrines.find((candidate) => !candidate.resolved && dist(player.x, player.y - 34, candidate.x, candidate.y) < 62);
      if (shrine) resolveShrine(game, shrine);
    }
  }
}

function spawnEnemyProjectile(game, enemy, speed = 330) {
  const player = game.player;
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const len = Math.hypot(dx, dy) || 1;
  game.projectiles.push({
    id: `knife-${enemy.id}-${game.elapsed}`,
    x: enemy.x,
    y: enemy.y - 42,
    vx: (dx / len) * speed,
    vy: (dy / len) * speed,
    damage: enemy.damage,
    life: 1.65,
    color: enemy.type === 'boss' ? '#f0abfc' : '#facc15',
  });
}

function updateProjectiles(game, dt) {
  const player = game.player;
  game.projectiles = game.projectiles
    .map((projectile) => ({
      ...projectile,
      x: projectile.x + projectile.vx * dt,
      y: projectile.y + projectile.vy * dt,
      life: projectile.life - dt,
    }))
    .filter((projectile) => {
      if (projectile.life <= 0) return false;
      if (Math.abs(projectile.x - player.x) < 34 && Math.abs(projectile.y - (player.y - 42)) < 44) {
        hitPlayer(game, { ...projectile, x: projectile.x, y: projectile.y, facing: projectile.vx > 0 ? 1 : -1, damage: projectile.damage });
        spawnParticles(game, projectile.x, projectile.y, projectile.color, 10, 160);
        return false;
      }
      return true;
    });
}

function updateDrops(game, dt) {
  game.drops = game.drops
    .map((drop) => ({ ...drop, life: drop.life - dt, pulse: drop.pulse + dt * 5 }))
    .filter((drop) => drop.life > 0);
  game.props.forEach((prop) => {
    prop.hitFlash = Math.max(0, prop.hitFlash - dt);
  });
}

function updateZones(game, dt) {
  const player = game.player;
  game.zones.forEach((zone) => {
    zone.pulse += dt * 4;
    const playerNear = dist(player.x, player.y, zone.x, zone.y) < zone.radius;
    const contested = game.enemies.some((enemy) => enemy.hp > 0 && dist(enemy.x, enemy.y, zone.x, zone.y) < zone.radius + 24);
    if (playerNear && !contested) {
      zone.capture = clamp(zone.capture + 42 * dt, 0, 100);
      if (zone.capture >= 100 && zone.owner !== 'player') {
        zone.owner = 'player';
        player.energy = 100;
        player.laneBoostTimer = 5;
        game.score += 240;
        recordStat(game, 'zonesCaptured');
        game.message = `${zone.label} gesichert`;
        game.messageTimer = 0.8;
        addFloater(game, zone.x, zone.y - 76, 'LANE', zone.color);
        spawnParticles(game, zone.x, zone.y - 30, zone.color, 22, 220);
      }
    } else if (contested) {
      zone.capture = clamp(zone.capture - 36 * dt, 0, 100);
      if (zone.capture <= 0) zone.owner = 'neutral';
    } else {
      zone.capture = clamp(zone.capture - (zone.owner === 'player' ? 1.5 : 8) * dt, 0, 100);
    }
    if (zone.owner === 'player') {
      player.energy = Math.min(100, player.energy + dt * 5);
    }
  });
}

function updateEnemy(game, enemy, dt) {
  if (enemy.hp <= 0) return;
  enemy.stun = Math.max(0, enemy.stun - dt);
  enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
  enemy.attackTimer = Math.max(0, enemy.attackTimer - dt);
  enemy.specialTimer = Math.max(0, enemy.specialTimer - dt);
  enemy.airborne = Math.max(0, (enemy.airborne || 0) - dt);
  const player = game.player;
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  enemy.facing = dx >= 0 ? 1 : -1;
  const laneDistance = Math.abs(dy);
  const xDistance = Math.abs(dx);
  if (enemy.type === 'medic' && enemy.specialTimer <= 0) {
    const ally = game.enemies
      .filter((candidate) => candidate !== enemy && candidate.hp > 0 && candidate.hp < candidate.maxHp && dist(enemy.x, enemy.y, candidate.x, candidate.y) < 230)
      .sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
    if (ally) {
      ally.hp = Math.min(ally.maxHp, ally.hp + 32);
      enemy.specialTimer = 2.4;
      addFloater(game, ally.x, ally.y - 96, '+32', '#f0abfc');
      spawnParticles(game, ally.x, ally.y - 50, '#f0abfc', 14, 170);
    }
  }

  if ((enemy.type === 'thrower' || enemy.type === 'boss') && enemy.specialTimer <= 0 && xDistance < enemy.range + 170 && laneDistance < 92) {
    spawnEnemyProjectile(game, enemy, enemy.type === 'boss' ? 410 : 330);
    enemy.specialTimer = enemy.type === 'boss' ? (enemy.enrage ? 0.72 : 1.15) : 1.35;
    enemy.attackTimer = Math.max(enemy.attackTimer, 0.3);
    spawnParticles(game, enemy.x + enemy.facing * 26, enemy.y - 50, enemy.color, 8, 140);
  }

  if (enemy.type === 'boss' && enemy.enrage && enemy.specialTimer <= 0.05 && xDistance < 260 && laneDistance < 120) {
    game.shake = Math.max(game.shake, 0.18);
  }

  if (enemy.stun <= 0) {
    const preferRange = enemy.type === 'thrower' ? 145 : enemy.range * 0.75;
    const chaseX = xDistance > preferRange ? Math.sign(dx) * enemy.speed : enemy.type === 'thrower' && xDistance < 110 ? -Math.sign(dx) * enemy.speed * 0.75 : 0;
    const chaseY = laneDistance > 14 ? Math.sign(dy) * enemy.speed * 0.72 : 0;
    enemy.vx = lerp(enemy.vx, chaseX, 0.1);
    enemy.y = clamp(enemy.y + chaseY * dt, FLOOR_TOP + 48, FLOOR_BOTTOM - 22);
  }
  enemy.x = clamp(enemy.x + enemy.vx * dt, 80, STAGE_W - 80);
  enemy.vx *= Math.pow(0.88, dt * 60);
  if (xDistance < enemy.range && laneDistance < 46 && enemy.attackTimer <= 0 && enemy.stun <= 0) {
    enemy.attackTimer = enemy.type === 'boss' ? 0.74 : 0.95;
    hitPlayer(game, enemy);
  }
}

function updateGame(game, dt, onFinish) {
  if (game.phase !== 'play') return;
  if (game.hitStop > 0) {
    game.hitStop = Math.max(0, game.hitStop - dt);
    game.messageTimer = Math.max(0, game.messageTimer - dt * 0.35);
    updateTransientEffects(game, dt * 0.35);
    return;
  }
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.shake = Math.max(0, game.shake - dt);
  game.goalNoticeTimer = Math.max(0, game.goalNoticeTimer - dt);
  updatePlayer(game, dt);
  game.enemies.forEach((enemy) => updateEnemy(game, enemy, dt));
  updateProjectiles(game, dt);
  updateDrops(game, dt);
  updateZones(game, dt);
  game.enemies = game.enemies.filter((enemy) => enemy.hp > 0);
  if (game.enemies.length === 0) {
    if (game.nextWaveDelay === 0) {
      recordStat(game, 'wavesCleared');
    }
    game.nextWaveDelay += dt;
    if (game.nextWaveDelay > 1.0) {
      game.nextWaveDelay = 0;
      spawnWave(game);
    }
  } else {
    game.nextWaveDelay = 0;
  }
  game.camera.x = lerp(game.camera.x, clamp(game.player.x - WIDTH * 0.44, 0, STAGE_W - WIDTH), 0.12);
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
  if (game.result) onFinish(game.result);
}

function updateTransientEffects(game, dt) {
  game.shake = Math.max(0, game.shake - dt);
  game.goalNoticeTimer = Math.max(0, game.goalNoticeTimer - dt);
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
  game.floaters = game.floaters
    .map((floater) => ({ ...floater, y: floater.y + floater.vy * dt, life: floater.life - dt }))
    .filter((floater) => floater.life > 0);
  updateDrops(game, dt);
}

function drawBackground(ctx, game) {
  const shakeX = game.shake > 0 ? Math.sin(game.elapsed * 74) * game.shake * 18 : 0;
  const shakeY = game.shake > 0 ? Math.cos(game.elapsed * 62) * game.shake * 12 : 0;
  ctx.save();
  ctx.translate(shakeX, shakeY);
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, '#07111f');
  bg.addColorStop(0.45, '#122849');
  bg.addColorStop(1, '#0b1020');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.translate(-game.camera.x, 0);

  for (let i = 0; i < 15; i += 1) {
    const x = i * 260;
    ctx.fillStyle = i % 2 === 0 ? '#1e293b' : '#24364f';
    drawRoundedRect(ctx, x, 130 + (i % 3) * 18, 180, 210, 16);
    ctx.fill();
    ctx.fillStyle = 'rgba(103,232,249,.25)';
    for (let w = 0; w < 4; w += 1) {
      ctx.fillRect(x + 28 + w * 34, 164, 18, 120);
    }
  }

  ctx.fillStyle = '#172033';
  drawRoundedRect(ctx, 0, FLOOR_TOP, STAGE_W, FLOOR_BOTTOM - FLOOR_TOP + 44, 28);
  ctx.fill();
  ctx.strokeStyle = 'rgba(148,163,184,.16)';
  for (let x = 0; x < STAGE_W; x += 82) {
    ctx.beginPath();
    ctx.moveTo(x, FLOOR_TOP);
    ctx.lineTo(x - 82, FLOOR_BOTTOM + 40);
    ctx.stroke();
  }
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, FLOOR_TOP);
  ctx.lineTo(STAGE_W, FLOOR_TOP);
  ctx.stroke();
  ctx.restore();
}

function drawShrines(ctx, game) {
  if (game.mode !== 'learn') return;
  ctx.save();
  ctx.translate(-game.camera.x, 0);
  game.shrines.forEach((shrine) => {
    if (shrine.resolved) return;
    const pulse = 1 + Math.sin(game.elapsed * 4 + shrine.pulse) * 0.08;
    ctx.save();
    ctx.shadowColor = shrine.correct ? '#5eead4' : '#818cf8';
    ctx.shadowBlur = 18;
    ctx.fillStyle = shrine.correct ? 'rgba(20,184,166,.86)' : 'rgba(79,70,229,.82)';
    drawRoundedRect(ctx, shrine.x - shrine.w / 2 * pulse, shrine.y - shrine.h / 2 * pulse, shrine.w * pulse, shrine.h * pulse, 15);
    ctx.fill();
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 15px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(shrine.label, shrine.x, shrine.y);
    ctx.restore();
  });
  ctx.restore();
}

function drawZones(ctx, game) {
  ctx.save();
  ctx.translate(-game.camera.x, 0);
  game.zones.forEach((zone) => {
    ctx.save();
    const active = zone.owner === 'player';
    ctx.globalAlpha = active ? 0.78 : 0.44;
    ctx.shadowColor = active ? '#bbf7d0' : zone.color;
    ctx.shadowBlur = active ? 24 : 12;
    ctx.strokeStyle = active ? '#bbf7d0' : zone.color;
    ctx.lineWidth = active ? 5 : 3;
    ctx.beginPath();
    ctx.ellipse(zone.x, zone.y, zone.radius * 1.25, zone.radius * 0.52, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = active ? 'rgba(34,197,94,.18)' : 'rgba(15,23,42,.2)';
    ctx.beginPath();
    ctx.ellipse(zone.x, zone.y, zone.radius * 1.2 * clamp(zone.capture / 100, 0.16, 1), zone.radius * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = active ? '#dcfce7' : '#f8fafc';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(zone.label, zone.x, zone.y + 4);
    ctx.restore();
  });
  ctx.restore();
}

function drawPropsAndDrops(ctx, game) {
  ctx.save();
  ctx.translate(-game.camera.x, 0);
  game.props.forEach((prop) => {
    if (prop.broken) return;
    ctx.save();
    ctx.shadowColor = prop.hitFlash > 0 ? '#fef3c7' : prop.color;
    ctx.shadowBlur = prop.hitFlash > 0 ? 18 : 8;
    ctx.fillStyle = prop.hitFlash > 0 ? '#fef3c7' : prop.color;
    const w = prop.kind === 'sign' ? 70 : prop.kind === 'barrel' ? 48 : 58;
    const h = prop.kind === 'sign' ? 50 : prop.kind === 'barrel' ? 66 : 48;
    drawRoundedRect(ctx, prop.x - w / 2, prop.y - h, w, h, prop.kind === 'barrel' ? 20 : 10);
    ctx.fill();
    ctx.fillStyle = 'rgba(2,6,23,.75)';
    drawRoundedRect(ctx, prop.x - w / 2, prop.y - h - 10, w, 6, 3);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    drawRoundedRect(ctx, prop.x - w / 2, prop.y - h - 10, w * clamp(prop.hp / prop.maxHp, 0, 1), 6, 3);
    ctx.fill();
    ctx.restore();
  });

  game.drops.forEach((drop) => {
    const profile = WEAPON_PROFILES[drop.kind];
    const color = profile?.color || (drop.kind === 'food' ? '#86efac' : '#67e8f9');
    ctx.save();
    ctx.translate(drop.x, drop.y - 22 + Math.sin(drop.pulse) * 4);
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = color;
    if (profile) {
      ctx.rotate(-0.35);
      drawRoundedRect(ctx, -28, -5, 56, 10, 5);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#052e16';
      ctx.font = '900 12px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(drop.kind === 'food' ? 'HP' : 'EN', 0, 1);
    }
    ctx.restore();
  });
  ctx.restore();
}

function drawProjectiles(ctx, game) {
  ctx.save();
  ctx.translate(-game.camera.x, 0);
  game.projectiles.forEach((projectile) => {
    ctx.save();
    ctx.shadowColor = projectile.color;
    ctx.shadowBlur = 16;
    ctx.fillStyle = projectile.color;
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  ctx.restore();
}

function drawActor(ctx, actor, cameraX, player = false) {
  const height = player ? PLAYER_H : actor.type === 'boss' ? 116 : actor.type === 'brute' ? 92 : 74;
  const width = player ? PLAYER_W : actor.type === 'boss' ? 72 : actor.type === 'brute' ? 54 : 40;
  const x = actor.x - cameraX;
  const y = actor.y - (actor.airborne || 0) * 58;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(actor.facing || 1, 1);
  ctx.shadowColor = player ? (actor.invuln > 0 ? '#f8fafc' : '#22c55e') : actor.color;
  ctx.shadowBlur = player || actor.type === 'boss' ? 16 : 10;
  ctx.fillStyle = player ? (actor.hurtFlash > 0 ? '#f8fafc' : '#22c55e') : actor.hitFlash > 0 ? '#f8fafc' : actor.color;
  drawRoundedRect(ctx, -width / 2, -height, width, height, 16);
  ctx.fill();
  ctx.fillStyle = player ? '#bbf7d0' : '#111827';
  ctx.beginPath();
  ctx.arc(0, -height - 13, width * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = player ? 7 : 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(width * 0.2, -height * 0.66);
  ctx.lineTo(width * 0.72, -height * 0.48);
  ctx.stroke();
  if (player && actor.weapon) {
    const profile = WEAPON_PROFILES[actor.weapon.id];
    ctx.strokeStyle = profile.color;
    ctx.shadowColor = profile.color;
    ctx.shadowBlur = 12;
    ctx.lineWidth = actor.weapon.id === 'chain' ? 4 : 9;
    ctx.beginPath();
    ctx.moveTo(width * 0.55, -height * 0.5);
    ctx.lineTo(width * 1.35, -height * 0.56);
    ctx.stroke();
  }
  if (player && actor.attackWindow > 0) {
    ctx.strokeStyle = actor.attackKind === 'super' ? '#f0abfc' : actor.attackKind === 'throw' ? '#facc15' : actor.attackKind === 'special' ? '#a78bfa' : '#e0f2fe';
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = actor.attackKind === 'super' ? 34 : 20;
    ctx.lineWidth = actor.attackKind === 'kick' || actor.attackKind === 'throw' ? 12 : 9;
    ctx.beginPath();
    ctx.arc(42, -height * 0.52, actor.attackKind === 'super' ? 92 : actor.attackKind === 'special' ? 62 : 42, -0.6, 0.7);
    ctx.stroke();
  }
  if (player && actor.guardTimer > 0) {
    ctx.strokeStyle = actor.parryWindow > 0 ? '#67e8f9' : '#bfdbfe';
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = actor.parryWindow > 0 ? 28 : 16;
    ctx.lineWidth = actor.parryWindow > 0 ? 8 : 5;
    ctx.beginPath();
    ctx.arc(0, -height * 0.58, 52, -1.2, 1.2);
    ctx.stroke();
  }
  if (player && actor.superTimer > 0) {
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.arc(0, -height * 0.5, 128 * (actor.superTimer / 0.38), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function drawActors(ctx, game) {
  const actors = [
    ...game.enemies.map((enemy) => ({ actor: enemy, player: false })),
    { actor: game.player, player: true },
  ].sort((a, b) => a.actor.y - b.actor.y);
  actors.forEach(({ actor, player }) => drawActor(ctx, actor, game.camera.x, player));
  game.enemies.forEach((enemy) => {
    const x = enemy.x - game.camera.x;
    const y = enemy.y - (enemy.type === 'boss' ? 136 : 98);
    const w = enemy.type === 'boss' ? 92 : 52;
    ctx.fillStyle = 'rgba(2,6,23,.8)';
    drawRoundedRect(ctx, x - w / 2, y, w, 7, 4);
    ctx.fill();
    ctx.fillStyle = enemy.type === 'boss' ? '#c4b5fd' : '#fb7185';
    drawRoundedRect(ctx, x - w / 2, y, w * (enemy.hp / enemy.maxHp), 7, 4);
    ctx.fill();
  });
}

function drawEffects(ctx, game) {
  ctx.save();
  ctx.translate(-game.camera.x, 0);
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
    ctx.font = '900 15px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(floater.text, floater.x, floater.y);
  });
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawHud(ctx, game) {
  const player = game.player;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.82)';
  drawRoundedRect(ctx, 28, 24, 374, 140, 20);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 27px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Learncade Brawler Pro' : 'Faska Brawler Pro', 54, 62);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.fillText(`Welle ${game.wave} · Score ${game.score} · Best ${game.bestCombo}`, 54, 91);
  ctx.fillStyle = '#1f2937';
  drawRoundedRect(ctx, 54, 110, 270, 11, 6);
  ctx.fill();
  ctx.fillStyle = '#fb7185';
  drawRoundedRect(ctx, 54, 110, 270 * (player.hp / player.maxHp), 11, 6);
  ctx.fill();
  ctx.fillStyle = '#1f2937';
  drawRoundedRect(ctx, 54, 132, 270, 10, 5);
  ctx.fill();
  ctx.fillStyle = '#67e8f9';
  drawRoundedRect(ctx, 54, 132, 270 * (player.energy / 100), 10, 5);
  ctx.fill();
  ctx.fillStyle = player.guardTimer > 0 ? '#bfdbfe' : '#94a3b8';
  ctx.font = '900 12px Outfit, sans-serif';
  const guardText = player.parryWindow > 0 ? 'PARRY-FENSTER' : player.guardTimer > 0 ? 'GUARD' : 'H Guard';
  const weaponText = player.weapon ? `${WEAPON_PROFILES[player.weapon.id].label} ${player.weapon.durability}` : 'Faust';
  ctx.fillText(`${guardText} · Waffe ${weaponText} · O Aufheben`, 54, 154);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, WIDTH - 376, 24, 348, 206, 20);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 24px Outfit, sans-serif';
  ctx.fillText(`${game.enemies.length} Gegner`, WIDTH - 54, 62);
  ctx.fillStyle = '#facc15';
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText(`Combo ${game.combo} · Spezial ${Math.floor(player.energy)}%`, WIDTH - 54, 94);
  ctx.fillStyle = player.laneBoostTimer > 0 ? '#bbf7d0' : '#cbd5e1';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText(`Lane ${game.stats.zonesCaptured}/3 · Props ${game.stats.propsBroken}`, WIDTH - 54, 111);
  ctx.fillStyle = '#93c5fd';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText('MISSIONEN', WIDTH - 54, 128);
  game.goals.slice(0, 5).forEach((goal, index) => {
    const y = 151 + index * 16;
    const progress = Math.min(game.stats[goal.stat] || 0, goal.target);
    ctx.fillStyle = goal.completed ? '#bbf7d0' : '#e2e8f0';
    ctx.textAlign = 'left';
    ctx.fillText(`${goal.completed ? '✓ ' : ''}${goal.label}`, WIDTH - 350, y);
    ctx.textAlign = 'right';
    ctx.fillText(`${progress}/${goal.target}`, WIDTH - 54, y);
  });

  if (game.mode === 'learn') {
    const task = LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.84)';
    drawRoundedRect(ctx, WIDTH / 2 - 278, 104, 556, 72, 18);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 19px Outfit, sans-serif';
    ctx.fillText(task.prompt, WIDTH / 2, 133);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 13px Outfit, sans-serif';
    ctx.fillText(`${task.subject} - richtige Stele beruehren`, WIDTH / 2, 156);
  }

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.78)';
    drawRoundedRect(ctx, WIDTH / 2 - 330, HEIGHT - 92, 660, 52, 18);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 22px Outfit, sans-serif';
    ctx.fillText(game.message, WIDTH / 2, HEIGHT - 58);
  }

  if (game.goalNoticeTimer > 0 && game.goalNotice) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(20,83,45,.84)';
    drawRoundedRect(ctx, WIDTH / 2 - 210, HEIGHT - 148, 420, 42, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(134,239,172,.5)';
    ctx.stroke();
    ctx.fillStyle = '#dcfce7';
    ctx.font = '900 18px Outfit, sans-serif';
    ctx.fillText(`Mission: ${game.goalNotice}`, WIDTH / 2, HEIGHT - 121);
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.74)';
  drawRoundedRect(ctx, 34, HEIGHT - 40, 980, 30, 10);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 12px Outfit, sans-serif';
  ctx.fillText('WASD/Arrows bewegen · J Schlag · K Tritt · L Spezial · H Guard/Parry · U Wurf · I Super · O Aufheben · Shift/Space Dash', 54, HEIGHT - 20);
  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawBackground(ctx, game);
  drawZones(ctx, game);
  drawShrines(ctx, game);
  drawPropsAndDrops(ctx, game);
  drawProjectiles(ctx, game);
  drawActors(ctx, game);
  drawEffects(ctx, game);
  drawHud(ctx, game);
}

export default function FaskaBrawlerSwarm() {
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
      ['j', 'punch'], ['J', 'punch'],
      ['k', 'kick'], ['K', 'kick'],
      ['l', 'special'], ['L', 'special'],
      ['h', 'guard'], ['H', 'guard'],
      ['u', 'grab'], ['U', 'grab'],
      ['i', 'super'], ['I', 'super'],
      ['o', 'pickup'], ['O', 'pickup'], ['p', 'pickup'], ['P', 'pickup'],
      [' ', 'dash'], ['Shift', 'dash'],
    ]);
    const keyDown = (event) => {
      const mapped = keyMap.get(event.key);
      if (mapped) {
        gameRef.current.input[mapped] = true;
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
    width: 68,
    height: 58,
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

      <div style={{ position: 'fixed', top: chromeTop, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.56 }}>Normal</button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.56 }}>Learncade</button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      <div className="brawler-touch-controls" style={{
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
          <button style={{ ...touchButton, background: 'rgba(14,165,233,.78)' }} {...holdButton('punch')}>HIT</button>
          <button style={{ ...touchButton, background: 'rgba(250,204,21,.82)', color: '#111827' }} {...holdButton('kick')}>KICK</button>
          <button style={{ ...touchButton, background: 'rgba(168,85,247,.78)' }} {...holdButton('special')}>SPEC</button>
          <button style={{ ...touchButton, background: 'rgba(59,130,246,.78)' }} {...holdButton('guard')}>GUARD</button>
          <button style={{ ...touchButton, background: 'rgba(148,163,184,.78)' }} {...holdButton('pickup')}>PICK</button>
          <button style={{ ...touchButton, background: 'rgba(251,146,60,.84)', color: '#111827' }} {...holdButton('grab')}>GRAB</button>
          <button style={{ ...touchButton, background: 'rgba(217,70,239,.82)' }} {...holdButton('super')}>SUPER</button>
          <button style={{ ...touchButton, background: 'rgba(34,197,94,.78)' }} {...holdButton('dash')}>DASH</button>
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
          <div style={{ fontSize: 24, fontWeight: 800, color: '#facc15' }}>Welle {result.wave} · Score {result.score}</div>
          <button className="btn-primary" onClick={restart}>Neuer Kampf</button>
        </div>
      )}

      <style>{`
        @media (pointer: fine), (min-width: 900px) {
          .brawler-touch-controls {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
