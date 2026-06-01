import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const ARENA_W = 2260;
const ARENA_H = 1460;

const OBSTACLES = [
  { x: 360, y: 270, w: 260, h: 58 },
  { x: 820, y: 150, w: 78, h: 250 },
  { x: 1250, y: 320, w: 360, h: 62 },
  { x: 1760, y: 180, w: 72, h: 310 },
  { x: 210, y: 690, w: 330, h: 66 },
  { x: 850, y: 720, w: 260, h: 66 },
  { x: 1470, y: 690, w: 290, h: 66 },
  { x: 640, y: 1080, w: 80, h: 240 },
  { x: 1180, y: 1080, w: 370, h: 62 },
  { x: 1840, y: 1030, w: 82, h: 260 },
];

const JUMP_PADS = [
  { id: 'north-pad', label: 'PAD N', x: 690, y: 470, dx: 1, dy: -0.62, color: '#67e8f9' },
  { id: 'east-pad', label: 'PAD E', x: 1680, y: 520, dx: -0.42, dy: 1, color: '#a78bfa' },
  { id: 'south-pad', label: 'PAD S', x: 1050, y: 1192, dx: 0.82, dy: -0.72, color: '#facc15' },
  { id: 'west-pad', label: 'PAD W', x: 330, y: 920, dx: 1, dy: 0.35, color: '#34d399' },
];

const CONTROL_NODES = [
  { id: 'alpha', label: 'ALPHA', x: 712, y: 604, radius: 74, color: '#facc15' },
  { id: 'beta', label: 'BETA', x: 1350, y: 870, radius: 74, color: '#67e8f9' },
  { id: 'gamma', label: 'GAMMA', x: 1876, y: 624, radius: 74, color: '#a78bfa' },
];

const POWERUP_SPAWNS = [
  { id: 'mega', label: 'MEGA', kind: 'mega', x: 1136, y: 560, respawn: 14, color: '#22c55e' },
  { id: 'quad', label: 'QUAD', kind: 'quad', x: 1940, y: 1150, respawn: 18, color: '#c084fc' },
  { id: 'armor', label: 'ARMOR', kind: 'armor', x: 438, y: 1160, respawn: 12, color: '#38bdf8' },
  { id: 'rocket-cache', label: 'ROCKET', kind: 'rocketAmmo', x: 1548, y: 242, respawn: 10, color: '#fb923c' },
];

const WEAPONS = [
  { id: 'pulse', label: 'Pulse', cooldown: 0.14, speed: 780, damage: 1, ammo: 1, heat: 5, color: '#fef3c7', radius: 5, spread: 0, pierce: 0 },
  { id: 'scatter', label: 'Scatter', cooldown: 0.34, speed: 640, damage: 1, ammo: 2, heat: 12, color: '#fb7185', radius: 5, spread: 0.26, pierce: 0 },
  { id: 'rail', label: 'Rail', cooldown: 0.52, speed: 1120, damage: 3, ammo: 3, heat: 18, color: '#67e8f9', radius: 6, spread: 0, pierce: 2 },
  { id: 'rocket', label: 'Rocket', cooldown: 0.64, speed: 540, damage: 2, ammo: 4, heat: 24, color: '#fb923c', radius: 9, spread: 0, pierce: 0, explosive: true },
];

const ARSENAL_GOALS = [
  { id: 'waves_3', label: '3 Wellen klaeren', stat: 'wavesCleared', target: 3, mode: 'arcade', reward: 900 },
  { id: 'kills_14', label: '14 Takedowns', stat: 'kills', target: 14, mode: 'both', reward: 850 },
  { id: 'grenades_3', label: '3 Granaten-Treffer', stat: 'grenadeHits', target: 3, mode: 'both', reward: 700 },
  { id: 'drone_5', label: '5 Drohnen-Treffer', stat: 'droneHits', target: 5, mode: 'both', reward: 700 },
  { id: 'weapon_5', label: '5 Waffenwechsel', stat: 'weaponSwaps', target: 5, mode: 'arcade', reward: 550 },
  { id: 'rocket_6', label: '6 Rocket-Treffer', stat: 'rocketHits', target: 6, mode: 'both', reward: 850 },
  { id: 'rocket_jump_2', label: '2 Rocket-Jumps', stat: 'rocketJumps', target: 2, mode: 'arcade', reward: 760 },
  { id: 'airshot_4', label: '4 Airshot-Treffer', stat: 'airShots', target: 4, mode: 'both', reward: 840 },
  { id: 'rail_4', label: '4 Rail-Treffer', stat: 'railHits', target: 4, mode: 'both', reward: 780 },
  { id: 'nodes_3', label: '3 Kontrollpunkte sichern', stat: 'nodesCaptured', target: 3, mode: 'both', reward: 900 },
  { id: 'quad_8', label: '8 Quad-Takedowns', stat: 'quadKills', target: 8, mode: 'both', reward: 1000 },
  { id: 'pads_4', label: '4 Jump-Pad-Angriffe', stat: 'padShots', target: 4, mode: 'arcade', reward: 650 },
  { id: 'learn_3', label: '3 Wissens-Saeulen', stat: 'learnCorrect', target: 3, mode: 'learn', reward: 1200 },
];

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "mutig"?',
    answer: 'Adjektiv',
    options: ['Nomen', 'Verb', 'Adjektiv'],
  },
  {
    subject: 'Mathe',
    prompt: '9 + 8 = ?',
    answer: '17',
    options: ['16', '17', '18'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "shield"?',
    answer: 'Schild',
    options: ['Schild', 'Schwert', 'Stern'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Welcher Planet ist rot?',
    answer: 'Mars',
    options: ['Mars', 'Venus', 'Neptun'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist "rennt"?',
    answer: 'Verb',
    options: ['Verb', 'Nomen', 'Artikel'],
  },
  {
    subject: 'Mathe',
    prompt: '6 x 7 = ?',
    answer: '42',
    options: ['36', '42', '48'],
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const rotateVector = (x, y, angle) => ({
  x: x * Math.cos(angle) - y * Math.sin(angle),
  y: x * Math.sin(angle) + y * Math.cos(angle),
});

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

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function createStats() {
  return {
    wavesCleared: 0,
    kills: 0,
    grenadeHits: 0,
    droneHits: 0,
    weaponSwaps: 0,
    learnCorrect: 0,
    rocketHits: 0,
    rocketJumps: 0,
    airShots: 0,
    railHits: 0,
    nodesCaptured: 0,
    quadKills: 0,
    padShots: 0,
  };
}

function createGoals(mode) {
  const weight = goal => (goal.mode === mode ? 0 : goal.mode === 'both' ? 1 : 2);
  return ARSENAL_GOALS
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
  game.goalNotice = `${completed.label} +${completed.reward}`;
  game.goalNoticeTimer = 2.2;
  game.message = `Mission geschafft: ${completed.label}`;
  game.messageTimer = 1.25;
}

function makeInitialGame(mode = 'arcade') {
  return {
    mode,
    elapsed: 0,
    phase: 'run',
    cameraX: 0,
    cameraY: 0,
    score: 0,
    combo: 1,
    wave: 1,
    waveTimer: 3.4,
    waveActive: false,
    message: mode === 'learn' ? 'Aktiviere die richtige Wissens-Saeule.' : 'Ueberlebe die Arena-Wellen.',
    messageTimer: 2,
    screenShake: 0,
    taskIndex: 0,
    answerCooldown: 0.8,
    goalNotice: '',
    goalNoticeTimer: 0,
    stats: createStats(),
    goals: createGoals(mode),
    player: {
      x: 690,
      y: 620,
      w: 42,
      h: 42,
      vx: 0,
      vy: 0,
      aimX: 1,
      aimY: 0,
      hp: 110,
      shield: 120,
      energy: 72,
      ammo: 38,
      xp: 0,
      level: 1,
      weaponIndex: 0,
      heat: 0,
      overheat: 0,
      quadTimer: 0,
      megaTimer: 0,
      flow: 0,
      airTimer: 0,
      padBoostTimer: 0,
      switchHeld: false,
      fireCooldown: 0,
      meleeTimer: 0,
      meleeCooldown: 0,
      dashTimer: 0,
      dashCooldown: 0,
      grenadeCooldown: 0,
      grenadeHeld: false,
      droneCooldown: 0,
      droneTimer: 0,
      droneFireCooldown: 0,
      droneHeld: false,
      gadgetCooldown: 0,
      invuln: 1.25,
    },
    enemies: [],
    bullets: [],
    enemyShots: [],
    pickups: [],
    powerups: POWERUP_SPAWNS.map((spawn) => ({ ...spawn, active: true, respawnTimer: 0, pulse: 0 })),
    controlNodes: CONTROL_NODES.map((node, index) => ({ ...node, owner: 'neutral', capture: 0, pulse: 0, spawnCooldown: 2 + index })),
    pylons: mode === 'learn' ? buildPylons(0) : [],
    particles: [],
    result: null,
  };
}

function buildPylons(taskIndex) {
  const task = LEARN_TASKS[taskIndex % LEARN_TASKS.length];
  const positions = [
    { x: 560, y: 500 },
    { x: 1130, y: 390 },
    { x: 1640, y: 860 },
  ];
  return task.options.map((label, index) => ({
    id: `pylon-${taskIndex}-${label}`,
    label,
    correct: label === task.answer,
    x: positions[index].x,
    y: positions[index].y,
    active: true,
    pulse: index * 0.7,
  }));
}

function currentTask(game) {
  return LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
}

function playerRect(player) {
  return { x: player.x - player.w / 2, y: player.y - player.h / 2, w: player.w, h: player.h };
}

function enemyRect(enemy) {
  return { x: enemy.x - enemy.size / 2, y: enemy.y - enemy.size / 2, w: enemy.size, h: enemy.size };
}

function collidesWithObstacle(rect) {
  return OBSTACLES.some((obstacle) => rectsOverlap(rect, obstacle));
}

function spawnParticles(game, x, y, color, count = 8, burst = 1) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed * 0.9;
    const speed = (80 + (i % 5) * 28) * burst;
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

function addAirshotText(game, x, y) {
  game.message = 'Airshot!';
  game.messageTimer = 0.48;
  spawnParticles(game, x, y, '#fef08a', 12, 1.25);
}

function spawnPickup(game, x, y, kind) {
  const color = kind === 'ammo' ? '#facc15' : kind === 'shield' ? '#38bdf8' : kind === 'rocketAmmo' ? '#fb923c' : '#22c55e';
  game.pickups.push({
    id: `pickup-${game.elapsed}-${kind}-${game.pickups.length}`,
    x,
    y,
    kind,
    color,
    life: 9,
  });
}

function spawnExplosion(game, x, y, radius, damage, owner = 'player') {
  let hits = 0;
  if (owner === 'player') {
    game.enemies.forEach((enemy) => {
      if (enemy.dead) return;
      const dist = distance({ x, y }, enemy);
      if (dist > radius + enemy.size * 0.35) return;
      const falloff = clamp(1 - dist / (radius + enemy.size * 0.35), 0.25, 1);
      const finalDamage = Math.max(1, Math.round(damage * falloff));
      enemy.hp -= finalDamage;
      enemy.hitTimer = 0.26;
      enemy.x += Math.sign(enemy.x - x || 1) * 54 * falloff;
      enemy.y += Math.sign(enemy.y - y || 1) * 54 * falloff;
      hits += 1;
    });
    if (hits) {
      game.score += Math.round(hits * 105 * game.combo);
      recordStat(game, 'rocketHits', hits);
      if (game.player.airTimer > 0 || game.player.padBoostTimer > 0) recordStat(game, 'airShots', hits);
    }
  }

  if (distance({ x, y }, game.player) < radius * 0.72) {
    const player = game.player;
    const dx = player.x - x;
    const dy = player.y - y;
    const len = Math.hypot(dx, dy) || 1;
    player.vx += (dx / len) * 510;
    player.vy += (dy / len) * 510;
    player.energy = clamp(player.energy + 8, 0, 100);
    player.airTimer = Math.max(player.airTimer, owner === 'player' ? 0.86 : 0.44);
    player.padBoostTimer = Math.max(player.padBoostTimer, 0.35);
    if (owner === 'player') {
      recordStat(game, 'rocketJumps');
      player.flow = clamp(player.flow + 28, 0, 100);
      game.combo = clamp(game.combo + 0.16, 1, 5);
      game.message = 'Rocket Jump';
      game.messageTimer = 0.55;
    }
    if (owner !== 'player') damagePlayer(game, 11, { x, y });
  }

  game.screenShake = Math.max(game.screenShake, 0.18);
  spawnParticles(game, x, y, '#fb923c', 28, 2.0);
  return hits;
}

function spawnEnemy(game, type, x, y) {
  const stats = {
    runner: { hp: 2, size: 38, speed: 160, color: '#fb7185' },
    tank: { hp: 6, size: 58, speed: 78, color: '#f97316' },
    turret: { hp: 3, size: 46, speed: 36, color: '#a855f7' },
    strafe: { hp: 4, size: 42, speed: 138, color: '#22d3ee' },
    bruiser: { hp: 9, size: 66, speed: 68, color: '#facc15' },
    boss: { hp: 24, size: 86, speed: 92, color: '#dc2626' },
  }[type];
  game.enemies.push({
    id: `enemy-${game.wave}-${game.elapsed}-${game.enemies.length}`,
    type,
    x,
    y,
    hp: stats.hp,
    maxHp: stats.hp,
    size: stats.size,
    speed: stats.speed,
    color: stats.color,
    attackCooldown: 0.8 + game.enemies.length * 0.12,
    hitTimer: 0,
    strafeDir: Math.random() > 0.5 ? 1 : -1,
    chargeTimer: type === 'bruiser' ? 1.4 : 0,
    dead: false,
  });
}

function spawnWave(game) {
  const wave = game.wave;
  game.waveActive = true;
  const points = [
    { x: 360, y: 1180 },
    { x: 1960, y: 320 },
    { x: 1880, y: 1160 },
    { x: 980, y: 250 },
    { x: 420, y: 560 },
  ];
  const count = 2 + wave;
  for (let i = 0; i < count; i += 1) {
    const point = points[(i + wave) % points.length];
    const type = wave >= 5 && i === 0 ? 'boss' : wave >= 4 && i % 4 === 1 ? 'bruiser' : wave >= 3 && i % 3 === 1 ? 'strafe' : i % 5 === 0 ? 'tank' : i % 3 === 0 ? 'turret' : 'runner';
    spawnEnemy(game, type, point.x + (i % 2) * 70, point.y + Math.floor(i / 2) * 42);
  }
  game.message = wave >= 5 ? 'Boss-Welle' : `Welle ${wave}`;
  game.messageTimer = 1;
}

function damagePlayer(game, amount, source) {
  const player = game.player;
  if (player.invuln > 0) return;
  let remaining = amount;
  if (player.shield > 0) {
    const shieldHit = Math.min(player.shield, remaining);
    player.shield -= shieldHit;
    remaining -= shieldHit;
  }
  player.hp = clamp(player.hp - remaining, 0, 100);
  player.invuln = 0.78;
  game.combo = 1;
  game.screenShake = 0.22;
  if (source) {
    const dx = player.x - source.x;
    const dy = player.y - source.y;
    const len = Math.hypot(dx, dy) || 1;
    player.vx += (dx / len) * 240;
    player.vy += (dy / len) * 240;
  }
  game.message = remaining > 0 ? 'Treffer' : 'Schild absorbiert';
  game.messageTimer = 0.5;
  spawnParticles(game, player.x, player.y, '#fb7185', 10);
}

function selectWeapon(game, index) {
  const player = game.player;
  const nextIndex = clamp(index, 0, WEAPONS.length - 1);
  if (player.weaponIndex === nextIndex) return;
  player.weaponIndex = nextIndex;
  player.heat = Math.max(0, player.heat - 10);
  game.message = `${WEAPONS[player.weaponIndex].label} bereit`;
  game.messageTimer = 0.45;
  recordStat(game, 'weaponSwaps');
}

function resolvePlayerMovement(game, axis, amount) {
  if (!amount) return;
  const player = game.player;
  player[axis] += amount;
  if (collidesWithObstacle(playerRect(player))) player[axis] -= amount;
}

function updatePlayer(game, input, dt) {
  const player = game.player;
  player.fireCooldown = Math.max(0, player.fireCooldown - dt);
  player.meleeCooldown = Math.max(0, player.meleeCooldown - dt);
  player.meleeTimer = Math.max(0, player.meleeTimer - dt);
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
  player.dashTimer = Math.max(0, player.dashTimer - dt);
  player.grenadeCooldown = Math.max(0, player.grenadeCooldown - dt);
  player.droneCooldown = Math.max(0, player.droneCooldown - dt);
  player.droneTimer = Math.max(0, player.droneTimer - dt);
  player.droneFireCooldown = Math.max(0, player.droneFireCooldown - dt);
  player.gadgetCooldown = Math.max(0, player.gadgetCooldown - dt);
  player.invuln = Math.max(0, player.invuln - dt);
  player.overheat = Math.max(0, player.overheat - dt);
  player.quadTimer = Math.max(0, player.quadTimer - dt);
  player.megaTimer = Math.max(0, player.megaTimer - dt);
  player.airTimer = Math.max(0, player.airTimer - dt);
  player.padBoostTimer = Math.max(0, player.padBoostTimer - dt);
  player.heat = clamp(player.heat - (player.overheat > 0 ? 44 : 28) * dt, 0, 100);

  const axisX = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const axisY = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  const len = Math.hypot(axisX, axisY) || 1;
  const nx = axisX / len;
  const ny = axisY / len;
  if (axisX || axisY) {
    player.aimX = nx;
    player.aimY = ny;
  }
  const lateral = Math.abs(nx * -player.aimY + ny * player.aimX);
  if (axisX || axisY) player.flow = clamp(player.flow + (0.16 + lateral * 0.42) * dt * 60, 0, 100);
  else player.flow = clamp(player.flow - 42 * dt, 0, 100);

  if (input.weaponNext && !player.switchHeld) {
    selectWeapon(game, (player.weaponIndex + 1) % WEAPONS.length);
    player.switchHeld = true;
  } else if (!input.weaponNext) {
    player.switchHeld = false;
  }

  if (input.grenade && !player.grenadeHeld) {
    throwGrenade(game);
    player.grenadeHeld = true;
  } else if (!input.grenade) {
    player.grenadeHeld = false;
  }

  if (input.drone && !player.droneHeld) {
    deployDrone(game);
    player.droneHeld = true;
  } else if (!input.drone) {
    player.droneHeld = false;
  }

  if (input.dash && player.dashCooldown <= 0 && player.energy >= 24) {
    player.dashTimer = 0.18;
    player.dashCooldown = 0.78;
    player.invuln = 0.2;
    player.energy -= 24;
    player.vx = player.aimX * 660;
    player.vy = player.aimY * 660;
    spawnParticles(game, player.x, player.y, '#67e8f9', 10);
  }

  const flowBoost = 1 + player.flow / 420 + (player.padBoostTimer > 0 ? 0.35 : 0);
  const accel = (player.dashTimer > 0 ? 400 : 2100) * flowBoost;
  player.vx += nx * accel * dt;
  player.vy += ny * accel * dt;
  player.vx *= Math.pow(player.dashTimer > 0 ? 0.95 : 0.82, dt * 60);
  player.vy *= Math.pow(player.dashTimer > 0 ? 0.95 : 0.82, dt * 60);
  const maxSpeed = (player.dashTimer > 0 ? 650 : 270) * flowBoost;
  const velocity = Math.hypot(player.vx, player.vy) || 1;
  if (velocity > maxSpeed) {
    player.vx = (player.vx / velocity) * maxSpeed;
    player.vy = (player.vy / velocity) * maxSpeed;
  }

  resolvePlayerMovement(game, 'x', player.vx * dt);
  resolvePlayerMovement(game, 'y', player.vy * dt);
  player.x = clamp(player.x, 64, ARENA_W - 64);
  player.y = clamp(player.y, 64, ARENA_H - 64);
  player.energy = clamp(player.energy + 22 * dt, 0, 100);
  player.shield = clamp(player.shield + 5 * dt, 0, 100);
  if (player.megaTimer > 0) player.hp = clamp(player.hp + 2.5 * dt, 0, 125);
}

function fireWeapon(game) {
  const player = game.player;
  const weapon = WEAPONS[player.weaponIndex] || WEAPONS[0];
  if (player.fireCooldown > 0 || player.overheat > 0) return;
  if (player.ammo < weapon.ammo) {
    game.message = 'Keine Munition';
    game.messageTimer = 0.42;
    return;
  }
  player.fireCooldown = weapon.cooldown;
  player.ammo -= weapon.ammo;
  player.heat = clamp(player.heat + weapon.heat, 0, 100);
  if (player.heat >= 100) {
    player.overheat = 1.15;
    game.message = 'Waffe ueberhitzt';
    game.messageTimer = 0.6;
  }
  const angles = weapon.spread ? [-weapon.spread, 0, weapon.spread] : [0];
  angles.forEach((angle, index) => {
    const dir = rotateVector(player.aimX, player.aimY, angle);
    game.bullets.push({
      id: `bullet-${game.elapsed}-${game.bullets.length}-${index}`,
      x: player.x + dir.x * 28,
      y: player.y + dir.y * 28,
      vx: dir.x * weapon.speed,
      vy: dir.y * weapon.speed,
      damage: Math.round(weapon.damage * (player.quadTimer > 0 ? 2.2 : 1)),
      life: weapon.id === 'rail' ? 0.62 : 0.82,
      pierce: weapon.pierce,
      radius: weapon.radius,
      color: weapon.color,
      weaponId: weapon.id,
      explosive: !!weapon.explosive,
      blastRadius: weapon.explosive ? 145 : 0,
      fromPad: player.padBoostTimer > 0,
      fromAir: player.airTimer > 0 || player.padBoostTimer > 0,
    });
  });
  if (weapon.explosive) {
    player.vx -= player.aimX * 170;
    player.vy -= player.aimY * 170;
  }
  if (player.padBoostTimer > 0) recordStat(game, 'padShots');
  spawnParticles(game, player.x + player.aimX * 34, player.y + player.aimY * 34, weapon.color, weapon.id === 'scatter' ? 7 : 4);
}

function throwGrenade(game) {
  const player = game.player;
  if (player.grenadeCooldown > 0 || player.energy < 34) return;
  player.grenadeCooldown = 1.8;
  player.energy -= 34;
  game.screenShake = 0.2;
  const blast = {
    x: clamp(player.x + player.aimX * 190, 80, ARENA_W - 80),
    y: clamp(player.y + player.aimY * 190, 80, ARENA_H - 80),
  };
  let hits = 0;
  game.enemies.forEach((enemy) => {
    if (enemy.dead || distance(blast, enemy) > 155) return;
    enemy.hp -= enemy.type === 'boss' ? 5 : 7;
    enemy.hitTimer = 0.35;
    enemy.x += Math.sign(enemy.x - blast.x || 1) * 42;
    enemy.y += Math.sign(enemy.y - blast.y || 1) * 42;
    hits += 1;
  });
  if (hits) {
    game.score += Math.round(hits * 140 * game.combo);
    recordStat(game, 'grenadeHits', hits);
  }
  spawnParticles(game, blast.x, blast.y, '#fb923c', 34, 2.2);
  game.message = hits ? `Granate x${hits}` : 'Granate';
  game.messageTimer = 0.6;
}

function deployDrone(game) {
  const player = game.player;
  if (player.droneCooldown > 0 || player.energy < 58) return;
  player.droneCooldown = 6.2;
  player.droneTimer = 5.0;
  player.droneFireCooldown = 0.25;
  player.energy -= 58;
  game.message = 'Drohne online';
  game.messageTimer = 0.75;
  spawnParticles(game, player.x, player.y, '#38bdf8', 20, 1.6);
}

function meleeAttack(game) {
  const player = game.player;
  if (player.meleeCooldown > 0 || player.energy < 10) return;
  player.meleeTimer = 0.18;
  player.meleeCooldown = 0.32;
  player.energy -= 10;
  game.enemies.forEach((enemy) => {
    if (enemy.dead) return;
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const along = dx * player.aimX + dy * player.aimY;
    const perp = Math.abs(dx * player.aimY - dy * player.aimX);
    if (along > -10 && along < 96 && perp < 58) {
      enemy.hp -= 2;
      enemy.hitTimer = 0.2;
      enemy.x += player.aimX * 42;
      enemy.y += player.aimY * 42;
      game.score += Math.round(95 * game.combo);
      spawnParticles(game, enemy.x, enemy.y, '#fef3c7', 10);
    }
  });
}

function triggerGadget(game) {
  const player = game.player;
  if (player.gadgetCooldown > 0 || player.energy < 38) return;
  player.gadgetCooldown = 3.8;
  player.energy -= 38;
  game.screenShake = 0.14;
  game.enemies.forEach((enemy) => {
    if (enemy.dead) return;
    const hit = distance(player, enemy) < 210;
    if (hit) {
      enemy.hp -= enemy.type === 'boss' ? 3 : 4;
      enemy.hitTimer = 0.35;
      game.score += Math.round(120 * game.combo);
      spawnParticles(game, enemy.x, enemy.y, '#a78bfa', 12);
    }
  });
  spawnParticles(game, player.x, player.y, '#a78bfa', 24, 1.6);
}

function updateDrone(game, dt) {
  const player = game.player;
  if (player.droneTimer <= 0) return;
  player.droneFireCooldown = Math.max(0, player.droneFireCooldown - dt);
  if (player.droneFireCooldown > 0) return;
  const target = game.enemies
    .filter(enemy => !enemy.dead)
    .sort((a, b) => distance(player, a) - distance(player, b))[0];
  if (!target || distance(player, target) > 620) return;
  player.droneFireCooldown = 0.32;
  target.hp -= target.type === 'boss' ? 1 : 2;
  target.hitTimer = 0.18;
  game.score += Math.round(75 * game.combo);
  recordStat(game, 'droneHits');
  game.bullets.push({
    id: `drone-${game.elapsed}-${game.bullets.length}`,
    x: player.x - player.aimY * 44,
    y: player.y + player.aimX * 44,
    vx: (target.x - player.x) * 4,
    vy: (target.y - player.y) * 4,
    damage: 0,
    life: 0.08,
    pierce: -1,
    radius: 4,
    color: '#67e8f9',
  });
  spawnParticles(game, target.x, target.y, '#67e8f9', 5, 0.9);
}

function updateBullets(game, dt) {
  game.bullets = game.bullets
    .map((bullet) => ({
      ...bullet,
      x: bullet.x + bullet.vx * dt,
      y: bullet.y + bullet.vy * dt,
      life: bullet.life - dt,
    }))
    .filter((bullet) => {
      if (bullet.life <= 0 || bullet.x < 0 || bullet.y < 0 || bullet.x > ARENA_W || bullet.y > ARENA_H) {
        if (bullet.explosive) spawnExplosion(game, bullet.x, bullet.y, bullet.blastRadius, bullet.damage + 3);
        return false;
      }
      const bulletRect = { x: bullet.x - 5, y: bullet.y - 5, w: 10, h: 10 };
      if (collidesWithObstacle(bulletRect)) {
        if (bullet.explosive) spawnExplosion(game, bullet.x, bullet.y, bullet.blastRadius, bullet.damage + 3);
        else spawnParticles(game, bullet.x, bullet.y, '#94a3b8', 4);
        return false;
      }
      const hitEnemy = game.enemies.find((enemy) => !enemy.dead && rectsOverlap(bulletRect, enemyRect(enemy)));
      if (hitEnemy) {
        if (bullet.explosive) {
          spawnExplosion(game, bullet.x, bullet.y, bullet.blastRadius, bullet.damage + 3);
          return false;
        }
        hitEnemy.hp -= bullet.damage;
        hitEnemy.hitTimer = 0.2;
        game.score += Math.round(55 * game.combo * (game.player.quadTimer > 0 ? 1.5 : 1));
        if (bullet.weaponId === 'rail') recordStat(game, 'railHits');
        if (bullet.fromAir) {
          recordStat(game, 'airShots');
          game.combo = clamp(game.combo + 0.12, 1, 5);
          addAirshotText(game, hitEnemy.x, hitEnemy.y);
        }
        spawnParticles(game, bullet.x, bullet.y, bullet.color || '#f87171', 6);
        bullet.pierce -= 1;
        return bullet.pierce >= 0;
      }
      return true;
    });

  game.enemyShots = game.enemyShots
    .map((shot) => ({
      ...shot,
      x: shot.x + shot.vx * dt,
      y: shot.y + shot.vy * dt,
      life: shot.life - dt,
    }))
    .filter((shot) => {
      if (shot.life <= 0 || shot.x < 0 || shot.y < 0 || shot.x > ARENA_W || shot.y > ARENA_H) return false;
      const shotRect = { x: shot.x - 7, y: shot.y - 7, w: 14, h: 14 };
      if (collidesWithObstacle(shotRect)) return false;
      if (rectsOverlap(shotRect, playerRect(game.player))) {
        damagePlayer(game, shot.damage, shot);
        return false;
      }
      return true;
    });
}

function updateEnemies(game, dt) {
  const player = game.player;
  game.enemies.forEach((enemy) => {
    if (enemy.dead) return;
    enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
    enemy.hitTimer = Math.max(0, enemy.hitTimer - dt);
    enemy.chargeTimer = Math.max(0, (enemy.chargeTimer || 0) - dt);
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const len = Math.hypot(dx, dy) || 1;
    const chase = enemy.type !== 'turret' || len > 260;
    const oldX = enemy.x;
    const oldY = enemy.y;
    if (chase) {
      const sidestep = enemy.type === 'strafe' && len < 520 ? enemy.strafeDir : 0;
      const chargeBoost = enemy.type === 'bruiser' && enemy.chargeTimer <= 0 && len < 420 ? 2.15 : 1;
      const moveX = (dx / len) + (-dy / len) * sidestep * 0.62;
      const moveY = (dy / len) + (dx / len) * sidestep * 0.62;
      const moveLen = Math.hypot(moveX, moveY) || 1;
      enemy.x += (moveX / moveLen) * enemy.speed * chargeBoost * dt;
      if (collidesWithObstacle(enemyRect(enemy))) enemy.x = oldX;
      enemy.y += (moveY / moveLen) * enemy.speed * chargeBoost * dt;
      if (collidesWithObstacle(enemyRect(enemy))) enemy.y = oldY;
      if (enemy.type === 'bruiser' && chargeBoost > 1) enemy.chargeTimer = 2.8;
    }

    if (len < enemy.size / 2 + player.w / 2 && enemy.attackCooldown <= 0) {
      enemy.attackCooldown = enemy.type === 'boss' ? 0.9 : 1.15;
      damagePlayer(game, enemy.type === 'boss' ? 14 : enemy.type === 'bruiser' ? 9 : 6, enemy);
    } else if ((enemy.type === 'turret' || enemy.type === 'boss' || enemy.type === 'strafe') && enemy.attackCooldown <= 0 && len < 660) {
      enemy.attackCooldown = enemy.type === 'boss' ? 0.48 : enemy.type === 'strafe' ? 0.9 : 1.25;
      const shotSpeed = enemy.type === 'boss' ? 330 : enemy.type === 'strafe' ? 360 : 260;
      game.enemyShots.push({
        id: `eshot-${enemy.id}-${game.elapsed}`,
        x: enemy.x,
        y: enemy.y,
        vx: (dx / len) * shotSpeed,
        vy: (dy / len) * shotSpeed,
        damage: enemy.type === 'boss' ? 7 : enemy.type === 'strafe' ? 5 : 5,
        life: 2.2,
      });
    }

    if (enemy.hp <= 0) {
      enemy.dead = true;
      game.combo = clamp(game.combo + 0.08, 1, 5);
      game.score += Math.round((enemy.maxHp * 90 + 80) * game.combo);
      player.xp += enemy.maxHp * 8;
      recordStat(game, 'kills');
      if (player.quadTimer > 0) recordStat(game, 'quadKills');
      spawnParticles(game, enemy.x, enemy.y, enemy.color, 18, 1.25);
      if (Math.random() < 0.38) spawnPickup(game, enemy.x, enemy.y, enemy.type === 'tank' || enemy.type === 'bruiser' ? 'shield' : enemy.type === 'boss' ? 'health' : 'ammo');
      if (player.xp >= player.level * 55) {
        player.xp = 0;
        player.level += 1;
        player.hp = clamp(player.hp + 18, 0, 100);
        player.energy = 100;
        game.message = `Level ${player.level}`;
        game.messageTimer = 0.9;
      }
    }
  });
}

function updatePickups(game, dt) {
  const player = game.player;
  game.pickups = game.pickups
    .map((pickup) => ({ ...pickup, life: pickup.life - dt }))
    .filter((pickup) => {
      if (pickup.life <= 0) return false;
      if (distance(player, pickup) > 46) return true;
      if (pickup.kind === 'ammo') player.ammo += 10;
      if (pickup.kind === 'rocketAmmo') player.ammo += 16;
      if (pickup.kind === 'shield') player.shield = clamp(player.shield + 28, 0, 100);
      if (pickup.kind === 'health') player.hp = clamp(player.hp + 24, 0, 100);
      game.score += 80;
      spawnParticles(game, pickup.x, pickup.y, pickup.color, 8);
      return false;
    });
}

function updatePowerups(game, dt) {
  const player = game.player;
  game.powerups.forEach((powerup) => {
    powerup.pulse += dt * 4;
    if (!powerup.active) {
      powerup.respawnTimer = Math.max(0, powerup.respawnTimer - dt);
      if (powerup.respawnTimer <= 0) powerup.active = true;
      return;
    }
    if (distance(player, powerup) > 52) return;
    powerup.active = false;
    powerup.respawnTimer = powerup.respawn;
    if (powerup.kind === 'mega') {
      player.hp = 125;
      player.megaTimer = 8;
      game.message = 'Mega Health';
    } else if (powerup.kind === 'quad') {
      player.quadTimer = 8.5;
      game.combo = clamp(game.combo + 0.5, 1, 5);
      game.message = 'Quad Damage';
    } else if (powerup.kind === 'armor') {
      player.shield = 130;
      game.message = 'Mega Armor';
    } else {
      player.ammo += 22;
      game.message = 'Rocket Cache';
    }
    game.score += 120;
    game.messageTimer = 0.9;
    spawnParticles(game, powerup.x, powerup.y, powerup.color, 24, 1.5);
  });
}

function updateJumpPads(game) {
  const player = game.player;
  JUMP_PADS.forEach((pad) => {
    if (distance(player, pad) > 50 || player.padBoostTimer > 0.08) return;
    const len = Math.hypot(pad.dx, pad.dy) || 1;
    player.vx = (pad.dx / len) * 760;
    player.vy = (pad.dy / len) * 760;
    player.airTimer = Math.max(player.airTimer, 0.95);
    player.padBoostTimer = 0.85;
    player.energy = clamp(player.energy + 16, 0, 100);
    game.message = `${pad.label} Boost`;
    game.messageTimer = 0.5;
    spawnParticles(game, pad.x, pad.y, pad.color, 18, 1.4);
  });
}

function updateControlNodes(game, dt) {
  const player = game.player;
  game.controlNodes.forEach((node) => {
    node.pulse += dt * 3;
    node.spawnCooldown = Math.max(0, node.spawnCooldown - dt);
    const near = distance(player, node) < node.radius;
    const enemiesNear = game.enemies.some((enemy) => !enemy.dead && distance(enemy, node) < node.radius + 30);
    if (near && !enemiesNear) {
      node.capture = clamp(node.capture + 36 * dt, 0, 100);
      if (node.capture >= 100 && node.owner !== 'player') {
        node.owner = 'player';
        recordStat(game, 'nodesCaptured');
        game.score += 280;
        game.combo = clamp(game.combo + 0.22, 1, 5);
        game.message = `${node.label} gesichert`;
        game.messageTimer = 0.8;
        spawnParticles(game, node.x, node.y, node.color, 22, 1.3);
      }
    } else if (enemiesNear) {
      node.capture = clamp(node.capture - 32 * dt, 0, 100);
      if (node.capture <= 0) node.owner = 'neutral';
    } else {
      node.capture = clamp(node.capture - (node.owner === 'player' ? 1.5 : 9) * dt, 0, 100);
    }

    if (node.owner === 'player') {
      player.energy = clamp(player.energy + 3.5 * dt, 0, 100);
      if (node.spawnCooldown <= 0 && game.pickups.length < 10) {
        node.spawnCooldown = 5.5;
        spawnPickup(game, node.x, node.y, Math.random() > 0.55 ? 'ammo' : 'shield');
      }
    }
  });
}

function updatePylons(game, dt) {
  if (game.mode !== 'learn') return;
  game.answerCooldown = Math.max(0, game.answerCooldown - dt);
  game.pylons.forEach((pylon) => {
    pylon.pulse += dt;
    if (!pylon.active || game.answerCooldown > 0) return;
    if (distance(game.player, pylon) > 60) return;
    const task = currentTask(game);
    pylon.active = false;
    if (pylon.correct) {
      game.score += Math.round(720 * game.combo);
      game.combo = clamp(game.combo + 0.3, 1, 5);
      game.player.energy = 100;
      game.player.shield = clamp(game.player.shield + 35, 0, 100);
      game.message = `${task.subject}: ${task.answer}`;
      recordStat(game, 'learnCorrect');
      spawnParticles(game, pylon.x, pylon.y, '#5eead4', 18, 1.25);
    } else {
      damagePlayer(game, 16, pylon);
      game.message = `${pylon.label} war falsch. Richtig: ${task.answer}`;
      spawnParticles(game, pylon.x, pylon.y, '#fb7185', 14);
    }
    game.messageTimer = 1.2;
    game.taskIndex += 1;
    game.pylons = buildPylons(game.taskIndex);
    game.answerCooldown = 1.2;
  });
}

function updateWave(game, dt) {
  if (game.enemies.some((enemy) => !enemy.dead)) return;
  if (game.waveActive) {
    recordStat(game, 'wavesCleared');
    game.waveActive = false;
  }
  game.waveTimer -= dt;
  if (game.waveTimer > 0) return;
  if (game.wave > 5) {
    game.phase = 'result';
    game.result = {
      title: 'Arena geschafft',
      score: game.score + Math.round(game.player.hp * 12 + game.player.shield * 8),
      wave: game.wave - 1,
    };
    return;
  }
  spawnWave(game);
  game.wave += 1;
  game.waveTimer = 1.3;
}

function updateParticles(game, dt) {
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

function updateCamera(game) {
  const shake = game.screenShake > 0 ? Math.sin(game.elapsed * 90) * game.screenShake * 18 : 0;
  game.screenShake = Math.max(0, game.screenShake - 0.016);
  game.cameraX = clamp(game.player.x - CENTER_X + shake, 0, ARENA_W - WIDTH);
  game.cameraY = clamp(game.player.y - CENTER_Y - shake * 0.4, 0, ARENA_H - HEIGHT);
}

function updateGame(game, input, dt, onFinish) {
  if (game.phase !== 'run') return;
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.goalNoticeTimer = Math.max(0, game.goalNoticeTimer - dt);
  updatePlayer(game, input, dt);
  if (input.fire) fireWeapon(game);
  if (input.melee) meleeAttack(game);
  if (input.gadget) triggerGadget(game);
  updateDrone(game, dt);
  updateBullets(game, dt);
  updateEnemies(game, dt);
  updatePickups(game, dt);
  updatePowerups(game, dt);
  updateJumpPads(game);
  updateControlNodes(game, dt);
  updatePylons(game, dt);
  updateWave(game, dt);
  updateParticles(game, dt);
  updateCamera(game);
  if (game.player.hp <= 0) {
    game.phase = 'result';
    game.result = {
      title: 'Arena verloren',
      score: game.score,
      wave: game.wave - 1,
    };
  }
  if (game.result) onFinish(game.result);
}

function worldToScreen(game, x, y) {
  return { x: x - game.cameraX, y: y - game.cameraY };
}

function drawBackground(ctx, game) {
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#08111f');
  gradient.addColorStop(0.55, '#11213a');
  gradient.addColorStop(1, '#050816');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.translate(-game.cameraX % 64, -game.cameraY % 64);
  ctx.strokeStyle = 'rgba(103,232,249,.08)';
  ctx.lineWidth = 1;
  for (let x = -64; x <= WIDTH + 64; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, -64);
    ctx.lineTo(x, HEIGHT + 64);
    ctx.stroke();
  }
  for (let y = -64; y <= HEIGHT + 64; y += 64) {
    ctx.beginPath();
    ctx.moveTo(-64, y);
    ctx.lineTo(WIDTH + 64, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawObstacles(ctx, game) {
  OBSTACLES.forEach((obstacle) => {
    const p = worldToScreen(game, obstacle.x, obstacle.y);
    if (p.x + obstacle.w < -80 || p.x > WIDTH + 80 || p.y + obstacle.h < -80 || p.y > HEIGHT + 80) return;
    ctx.save();
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, p.x, p.y, obstacle.w, obstacle.h, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(103,232,249,.18)';
    ctx.fillRect(p.x + 10, p.y + 8, obstacle.w - 20, 5);
    ctx.restore();
  });
}

function drawJumpPads(ctx, game) {
  JUMP_PADS.forEach((pad) => {
    const p = worldToScreen(game, pad.x, pad.y);
    if (p.x < -80 || p.x > WIDTH + 80 || p.y < -80 || p.y > HEIGHT + 80) return;
    const len = Math.hypot(pad.dx, pad.dy) || 1;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(Math.atan2(pad.dy / len, pad.dx / len));
    ctx.shadowColor = pad.color;
    ctx.shadowBlur = 22;
    ctx.fillStyle = 'rgba(15,23,42,.88)';
    drawRoundedRect(ctx, -44, -28, 88, 56, 16);
    ctx.fill();
    ctx.strokeStyle = pad.color;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = pad.color;
    ctx.beginPath();
    ctx.moveTo(26, 0);
    ctx.lineTo(-12, -16);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-12, 16);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function drawControlNodes(ctx, game) {
  game.controlNodes.forEach((node) => {
    const p = worldToScreen(game, node.x, node.y);
    if (p.x < -110 || p.x > WIDTH + 110 || p.y < -110 || p.y > HEIGHT + 110) return;
    const playerOwned = node.owner === 'player';
    ctx.save();
    ctx.globalAlpha = playerOwned ? 0.88 : 0.62;
    ctx.strokeStyle = playerOwned ? '#bbf7d0' : node.color;
    ctx.lineWidth = playerOwned ? 5 : 3;
    ctx.shadowColor = playerOwned ? '#22c55e' : node.color;
    ctx.shadowBlur = playerOwned ? 28 : 12;
    ctx.beginPath();
    ctx.arc(p.x, p.y, node.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = playerOwned ? 'rgba(34,197,94,.2)' : 'rgba(15,23,42,.32)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, node.radius - 7, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(node.capture / 100, 0, 1));
    ctx.lineTo(p.x, p.y);
    ctx.closePath();
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = playerOwned ? '#dcfce7' : '#f8fafc';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(node.label, p.x, p.y + 4);
    ctx.restore();
  });
}

function drawPowerups(ctx, game) {
  game.powerups.forEach((powerup) => {
    const p = worldToScreen(game, powerup.x, powerup.y + Math.sin(powerup.pulse) * 5);
    if (p.x < -80 || p.x > WIDTH + 80 || p.y < -80 || p.y > HEIGHT + 80) return;
    ctx.save();
    ctx.globalAlpha = powerup.active ? 1 : 0.26;
    ctx.shadowColor = powerup.active ? powerup.color : 'transparent';
    ctx.shadowBlur = powerup.active ? 24 : 0;
    ctx.fillStyle = powerup.active ? powerup.color : '#475569';
    ctx.beginPath();
    ctx.arc(p.x, p.y, powerup.kind === 'quad' ? 26 : 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#020617';
    ctx.font = '900 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(powerup.active ? powerup.label : Math.ceil(powerup.respawnTimer), p.x, p.y);
    ctx.restore();
  });
}

function drawPylons(ctx, game) {
  if (game.mode !== 'learn') return;
  game.pylons.forEach((pylon) => {
    if (!pylon.active) return;
    const p = worldToScreen(game, pylon.x, pylon.y);
    if (p.x < -90 || p.x > WIDTH + 90 || p.y < -90 || p.y > HEIGHT + 90) return;
    ctx.save();
    const pulse = 1 + Math.sin(game.elapsed * 4 + pylon.pulse) * 0.08;
    ctx.translate(p.x, p.y);
    ctx.scale(pulse, pulse);
    ctx.shadowColor = pylon.correct ? '#5eead4' : '#818cf8';
    ctx.shadowBlur = 24;
    ctx.fillStyle = pylon.correct ? 'rgba(20,184,166,.86)' : 'rgba(79,70,229,.82)';
    drawRoundedRect(ctx, -52, -48, 104, 96, 18);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 16px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pylon.label, 0, 0);
    ctx.restore();
  });
}

function drawPickups(ctx, game) {
  game.pickups.forEach((pickup) => {
    const p = worldToScreen(game, pickup.x, pickup.y + Math.sin(game.elapsed * 5 + pickup.x) * 4);
    if (p.x < -50 || p.x > WIDTH + 50 || p.y < -50 || p.y > HEIGHT + 50) return;
    ctx.save();
    ctx.shadowColor = pickup.color;
    ctx.shadowBlur = 16;
    ctx.fillStyle = pickup.color;
    drawRoundedRect(ctx, p.x - 15, p.y - 15, 30, 30, 8);
    ctx.fill();
    ctx.fillStyle = '#020617';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pickup.kind === 'ammo' ? 'A' : pickup.kind === 'shield' ? 'S' : pickup.kind === 'rocketAmmo' ? 'R' : '+', p.x, p.y);
    ctx.restore();
  });
}

function drawEnemies(ctx, game) {
  game.enemies.forEach((enemy) => {
    if (enemy.dead) return;
    const p = worldToScreen(game, enemy.x, enemy.y);
    if (p.x < -90 || p.x > WIDTH + 90 || p.y < -90 || p.y > HEIGHT + 90) return;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.shadowColor = enemy.hitTimer > 0 ? '#fecaca' : enemy.color;
    ctx.shadowBlur = enemy.hitTimer > 0 ? 24 : 14;
    ctx.fillStyle = enemy.hitTimer > 0 ? '#fecaca' : enemy.color;
    if (enemy.type === 'runner') {
      ctx.beginPath();
      ctx.moveTo(0, -enemy.size / 2);
      ctx.lineTo(enemy.size / 2, enemy.size / 2);
      ctx.lineTo(-enemy.size / 2, enemy.size / 2);
      ctx.closePath();
      ctx.fill();
    } else {
      drawRoundedRect(ctx, -enemy.size / 2, -enemy.size / 2, enemy.size, enemy.size, enemy.type === 'boss' ? 22 : 12);
      ctx.fill();
    }
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#020617';
    ctx.fillRect(-enemy.size * 0.16, -enemy.size * 0.1, enemy.size * 0.12, enemy.size * 0.12);
    ctx.fillRect(enemy.size * 0.08, -enemy.size * 0.1, enemy.size * 0.12, enemy.size * 0.12);
    ctx.fillStyle = 'rgba(2,6,23,.78)';
    drawRoundedRect(ctx, -enemy.size / 2, -enemy.size / 2 - 14, enemy.size, 7, 4);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    drawRoundedRect(ctx, -enemy.size / 2, -enemy.size / 2 - 14, enemy.size * clamp(enemy.hp / enemy.maxHp, 0, 1), 7, 4);
    ctx.fill();
    ctx.restore();
  });
}

function drawPlayer(ctx, game) {
  const player = game.player;
  const p = worldToScreen(game, player.x, player.y);
  const angle = Math.atan2(player.aimY, player.aimX);
  ctx.save();
  if (player.droneTimer > 0) {
    const orbit = game.elapsed * 4.2;
    const droneX = p.x + Math.cos(orbit) * 54;
    const droneY = p.y + Math.sin(orbit) * 34;
    ctx.save();
    ctx.shadowColor = '#67e8f9';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#0e7490';
    drawRoundedRect(ctx, droneX - 13, droneY - 10, 26, 20, 8);
    ctx.fill();
    ctx.strokeStyle = '#cffafe';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }
  ctx.translate(p.x, p.y);
  ctx.rotate(angle);
  ctx.globalAlpha = player.invuln > 0 && Math.sin(game.elapsed * 42) > 0 ? 0.56 : 1;
  ctx.shadowColor = player.dashTimer > 0 ? '#facc15' : '#22d3ee';
  ctx.shadowBlur = player.dashTimer > 0 ? 26 : 16;
  ctx.fillStyle = '#2563eb';
  drawRoundedRect(ctx, -21, -22, 42, 44, 12);
  ctx.fill();
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(16, 0, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = player.meleeTimer > 0 ? '#fef3c7' : '#c7d2fe';
  ctx.lineWidth = player.meleeTimer > 0 ? 12 : 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(27, 0);
  ctx.lineTo(player.meleeTimer > 0 ? 78 : 52, 0);
  ctx.stroke();
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.arc(20, -4, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawShots(ctx, game) {
  game.bullets.forEach((bullet) => {
    const p = worldToScreen(game, bullet.x, bullet.y);
    ctx.save();
    ctx.shadowColor = bullet.color || '#facc15';
    ctx.shadowBlur = 14;
    ctx.fillStyle = bullet.color || '#fef3c7';
    ctx.beginPath();
    ctx.arc(p.x, p.y, bullet.radius || 5, 0, Math.PI * 2);
    ctx.fill();
    if (bullet.explosive) {
      ctx.strokeStyle = 'rgba(251,146,60,.42)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 18 + Math.sin(game.elapsed * 18) * 4, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  });
  game.enemyShots.forEach((shot) => {
    const p = worldToScreen(game, shot.x, shot.y);
    ctx.save();
    ctx.shadowColor = '#fb7185';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawParticles(ctx, game) {
  game.particles.forEach((particle) => {
    const p = worldToScreen(game, particle.x, particle.y);
    ctx.save();
    ctx.globalAlpha = clamp(particle.life / 0.58, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, particle.size + particle.life * 8, 0, Math.PI * 2);
    ctx.fill();
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

function drawHud(ctx, game) {
  const player = game.player;
  ctx.save();
  ctx.fillStyle = '#020617';
  drawRoundedRect(ctx, 28, 22, 454, 162, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 25px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Learncade Arsenal Pro' : 'Faska Arsenal Pro', 52, 58);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 15px Outfit, sans-serif';
  ctx.fillText(`Welle ${Math.max(1, game.wave - 1)}/5 · Level ${player.level} · Ammo ${player.ammo} · ${WEAPONS[player.weaponIndex].label}`, 52, 88);
  drawMeter(ctx, 52, 116, 92, 12, player.hp, '#22c55e', 'HP');
  drawMeter(ctx, 160, 116, 92, 12, player.shield, '#38bdf8', 'SCHILD');
  drawMeter(ctx, 268, 116, 84, 12, player.energy, '#facc15', 'ENERGIE');
  drawMeter(ctx, 368, 116, 70, 12, player.heat, player.overheat > 0 ? '#fb7185' : '#f97316', 'HEAT');
  drawMeter(ctx, 52, 154, 116, 10, player.flow, '#a78bfa', 'FLOW');
  drawMeter(ctx, 188, 154, 96, 10, player.quadTimer * 12, '#c084fc', 'QUAD');
  drawMeter(ctx, 304, 154, 96, 10, Math.max(player.padBoostTimer * 120, player.airTimer * 100), '#67e8f9', 'AIR');
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 12px Outfit, sans-serif';
  ctx.fillText(`Nodes ${game.stats.nodesCaptured}/3 · Rocket ${game.stats.rocketHits}/6 · Air ${game.stats.airShots}/4`, 52, 178);

  if (game.mode === 'learn') {
    const task = currentTask(game);
    ctx.fillStyle = '#020617';
    drawRoundedRect(ctx, 506, 78, 424, 96, 18);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '900 18px Outfit, sans-serif';
    ctx.fillText(task.prompt, 718, 111);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 14px Outfit, sans-serif';
    ctx.fillText(`${task.subject} · beruehre die richtige Saeule`, 718, 140);
  }

  ctx.textAlign = 'right';
  ctx.fillStyle = '#020617';
  drawRoundedRect(ctx, WIDTH - 356, 22, 328, 238, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 24px Outfit, sans-serif';
  ctx.fillText(`Score ${game.score}`, WIDTH - 52, 58);
  ctx.fillStyle = '#a7f3d0';
  ctx.font = '900 16px Outfit, sans-serif';
  ctx.fillText(`Combo x${game.combo.toFixed(2)}`, WIDTH - 52, 86);
  ctx.fillStyle = '#93c5fd';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText('MISSIONEN', WIDTH - 52, 116);
  game.goals.slice(0, 7).forEach((goal, index) => {
    const y = 140 + index * 16;
    const progress = Math.min(game.stats[goal.stat] || 0, goal.target);
    ctx.textAlign = 'left';
    ctx.fillStyle = goal.completed ? '#bbf7d0' : '#e2e8f0';
    ctx.fillText(`${goal.completed ? '✓ ' : ''}${goal.label}`, WIDTH - 330, y);
    ctx.textAlign = 'right';
    ctx.fillText(`${progress}/${goal.target}`, WIDTH - 52, y);
  });

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(2,6,23,.78)';
    drawRoundedRect(ctx, CENTER_X - 260, HEIGHT - 112, 520, 56, 18);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 24px Outfit, sans-serif';
    ctx.fillText(game.message, CENTER_X, HEIGHT - 76);
  }

  if (game.goalNoticeTimer > 0 && game.goalNotice) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(20,83,45,.84)';
    drawRoundedRect(ctx, CENTER_X - 210, HEIGHT - 168, 420, 42, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(134,239,172,.5)';
    ctx.stroke();
    ctx.fillStyle = '#dcfce7';
    ctx.font = '900 18px Outfit, sans-serif';
    ctx.fillText(`Mission: ${game.goalNotice}`, CENTER_X, HEIGHT - 141);
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.76)';
  drawRoundedRect(ctx, 34, HEIGHT - 48, 1052, 36, 12);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText('WASD bewegen · Maus zielt/feuert · 1-4 direkte Waffen · Space Feuer · Q Waffe · F Granate · C Drohne · J Nahkampf · Shift Dash · E Pulse · Jump-Pads/Rocket-Jumps/Airshots', 54, HEIGHT - 25);
  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawBackground(ctx, game);
  drawObstacles(ctx, game);
  drawControlNodes(ctx, game);
  drawJumpPads(ctx, game);
  drawPowerups(ctx, game);
  drawPylons(ctx, game);
  drawPickups(ctx, game);
  drawEnemies(ctx, game);
  drawShots(ctx, game);
  drawPlayer(ctx, game);
  drawParticles(ctx, game);
  drawHud(ctx, game);
}

export default function FaskaArsenalSwarm() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameRef = useRef(makeInitialGame('arcade'));
  const inputRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false,
    melee: false,
    dash: false,
    gadget: false,
    grenade: false,
    drone: false,
    weaponNext: false,
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
      fire: false,
      melee: false,
      dash: false,
      gadget: false,
      grenade: false,
      drone: false,
      weaponNext: false,
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
    const updateAimFromPointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      const screenX = (event.clientX - rect.left) * (WIDTH / rect.width);
      const screenY = (event.clientY - rect.top) * (HEIGHT / rect.height);
      const game = gameRef.current;
      const worldX = screenX + game.cameraX;
      const worldY = screenY + game.cameraY;
      const dx = worldX - game.player.x;
      const dy = worldY - game.player.y;
      const aimLen = Math.hypot(dx, dy) || 1;
      game.player.aimX = dx / aimLen;
      game.player.aimY = dy / aimLen;
    };
    const keyMap = new Map([
      ['ArrowUp', 'up'], ['w', 'up'], ['W', 'up'],
      ['ArrowDown', 'down'], ['s', 'down'], ['S', 'down'],
      ['ArrowLeft', 'left'], ['a', 'left'], ['A', 'left'],
      ['ArrowRight', 'right'], ['d', 'right'], ['D', 'right'],
      [' ', 'fire'],
      ['j', 'melee'], ['J', 'melee'],
      ['Shift', 'dash'],
      ['e', 'gadget'], ['E', 'gadget'],
      ['f', 'grenade'], ['F', 'grenade'],
      ['c', 'drone'], ['C', 'drone'],
      ['q', 'weaponNext'], ['Q', 'weaponNext'],
    ]);

    const keyDown = (event) => {
      if (['1', '2', '3', '4'].includes(event.key)) {
        selectWeapon(gameRef.current, Number(event.key) - 1);
        event.preventDefault();
        return;
      }
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
    const pointerMove = (event) => updateAimFromPointer(event);
    const pointerDown = (event) => {
      canvas.focus?.();
      updateAimFromPointer(event);
      inputRef.current.fire = true;
      event.preventDefault();
    };
    const pointerUp = () => {
      inputRef.current.fire = false;
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
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointerup', pointerUp);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerdown', pointerDown);
      window.removeEventListener('pointerup', pointerUp);
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
    width: 90,
    height: 64,
    fontSize: 12,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#020617', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
      <canvas
        className="arsenal-canvas"
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        tabIndex={0}
        aria-label="Faska Arsenal Pro Spielfeld"
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
      <div className="arsenal-vignette" style={{
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

      <div className="arsenal-modebar" style={{ position: 'fixed', top: canvasTopChrome, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.55 }}>
          Normal
        </button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.55 }}>
          Learncade
        </button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      <div className="arsenal-touch-controls arsenal-stick-controls" style={{
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

      <div className="arsenal-touch-controls arsenal-action-controls" style={{
        position: 'fixed', right: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'flex', gap: 8, alignItems: 'flex-end', touchAction: 'none',
      }}>
        <button aria-label="Waffe" style={{ ...actionButton, background: 'rgba(14,165,233,.78)' }} {...holdButton('weaponNext')}>WEAPON</button>
        <button aria-label="Granate" style={{ ...actionButton, background: 'rgba(251,146,60,.86)', color: '#111827' }} {...holdButton('grenade')}>GRENADE</button>
        <button aria-label="Drohne" style={{ ...actionButton, background: 'rgba(34,211,238,.78)' }} {...holdButton('drone')}>DRONE</button>
        <button aria-label="Nahkampf" style={actionButton} {...holdButton('melee')}>MELEE</button>
        <button aria-label="Dash" style={actionButton} {...holdButton('dash')}>DASH</button>
        <button aria-label="Gadget" style={actionButton} {...holdButton('gadget')}>PULSE</button>
        <button aria-label="Schiessen" style={{ ...actionButton, width: 96, height: 74, background: 'rgba(250,204,21,.86)', color: '#111827' }} {...holdButton('fire')}>
          FIRE
        </button>
      </div>

      {result && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2,6,23,.78)', zIndex: 20, flexDirection: 'column', gap: 16,
        }}>
          <div style={{ fontSize: 54, fontWeight: 900, color: '#f8fafc' }}>{result.title}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#facc15' }}>Score {result.score}</div>
          <div style={{ fontSize: 15, color: '#cbd5e1' }}>Welle {result.wave}/5</div>
          <button className="btn-primary" onClick={restart}>Neuer Lauf</button>
        </div>
      )}

      <style>{`
        @media (max-width: 700px) and (orientation: portrait) {
          .arsenal-canvas,
          .arsenal-vignette {
            width: 160vw !important;
            height: calc(160vw * 9 / 16) !important;
            left: 50% !important;
            right: auto !important;
            top: 106px !important;
            bottom: auto !important;
            margin: 0 auto !important;
            transform: translateX(-50%) !important;
          }

          .arsenal-modebar {
            top: 10px !important;
            transform: translateX(-50%) scale(.82) !important;
            transform-origin: top center !important;
          }

          .arsenal-touch-controls {
            bottom: 14px !important;
          }

          .arsenal-stick-controls {
            left: 2px !important;
            transform: scale(.68) !important;
            transform-origin: bottom left !important;
          }

          .arsenal-action-controls {
            right: 4px !important;
            display: grid !important;
            grid-template-columns: repeat(3, 58px) !important;
            gap: 6px !important;
            align-items: end !important;
            transform: none !important;
            transform-origin: bottom right !important;
          }

          .arsenal-action-controls button {
            width: 58px !important;
            height: 50px !important;
            min-width: 0 !important;
            border-radius: 12px !important;
            font-size: 9px !important;
            padding: 0 !important;
          }
        }

        @media (pointer: fine), (min-width: 900px) {
          .arsenal-touch-controls {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
