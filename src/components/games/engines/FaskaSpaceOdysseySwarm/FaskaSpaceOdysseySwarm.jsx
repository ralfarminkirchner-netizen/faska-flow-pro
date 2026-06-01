import { useCallback, useEffect, useRef, useState } from 'react';

const WIDTH = 1280;
const HEIGHT = 720;
const WORLD_WIDTH = 2240;
const WORLD_HEIGHT = 1560;
const STORAGE_KEY = 'faska-star-odyssey-highscore';

const PLANETS = [
  { id: 'terra', name: 'Terra', x: 300, y: 1180, r: 58, color: '#22c55e', halo: '#67e8f9', subject: 'Deutsch' },
  { id: 'nova', name: 'Nova', x: 720, y: 980, r: 48, color: '#f97316', halo: '#fde68a', subject: 'Mathe' },
  { id: 'lumen', name: 'Lumen', x: 1160, y: 1220, r: 62, color: '#38bdf8', halo: '#bae6fd', subject: 'Lesen' },
  { id: 'umbra', name: 'Umbra', x: 1505, y: 850, r: 54, color: '#a855f7', halo: '#ddd6fe', subject: 'Englisch' },
  { id: 'aurora', name: 'Aurora', x: 1840, y: 455, r: 66, color: '#facc15', halo: '#fef3c7', subject: 'Sachkunde' },
  { id: 'zenit', name: 'Zenit', x: 1090, y: 310, r: 52, color: '#14b8a6', halo: '#99f6e4', subject: 'Deutsch' },
];

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    prompt: 'Welche Wortart ist "leuchtet"?',
    choices: ['Nomen', 'Verb', 'Adjektiv'],
    correct: 'Verb',
  },
  {
    subject: 'Mathe',
    kind: 'Kopfrechnen',
    prompt: '9 + 6 = ?',
    choices: ['14', '15', '16'],
    correct: '15',
  },
  {
    subject: 'Lesen',
    kind: 'Silben',
    prompt: 'Welche Trennung passt zu "Rakete"?',
    choices: ['Ra-ke-te', 'Rak-ete', 'Ra-ket-e'],
    correct: 'Ra-ke-te',
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    prompt: 'Was heisst "Stern"?',
    choices: ['moon', 'star', 'sky'],
    correct: 'star',
  },
  {
    subject: 'Sachkunde',
    kind: 'Planeten',
    prompt: 'Welcher Planet ist der rote Planet?',
    choices: ['Mars', 'Venus', 'Jupiter'],
    correct: 'Mars',
  },
  {
    subject: 'Deutsch',
    kind: 'Satz',
    prompt: 'Was braucht ein Aussagesatz am Ende?',
    choices: ['Punkt', 'Komma', 'Doppelpunkt'],
    correct: 'Punkt',
  },
  {
    subject: 'Deutsch',
    kind: 'Kompositum',
    prompt: 'Was passt zu "Mond..."?',
    choices: ['licht', 'rennen', 'unter'],
    correct: 'licht',
  },
  {
    subject: 'Mathe',
    kind: 'Subtraktion',
    prompt: '54 - 19 = ?',
    choices: ['33', '35', '36'],
    correct: '35',
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    prompt: 'Was bedeutet "comet"?',
    choices: ['Komet', 'Kammer', 'Koffer'],
    correct: 'Komet',
  },
];

const MISSION_GOALS = [
  { id: 'scan_all', label: '6 Planeten scannen', stat: 'scans', target: 6, reward: 1600 },
  { id: 'asteroids_10', label: '10 Asteroiden sprengen', stat: 'asteroidKills', target: 10, reward: 850 },
  { id: 'drones_4', label: '4 Drohnen besiegen', stat: 'droneKills', target: 4, reward: 980 },
  { id: 'rifts_3', label: '3 Rift-Runs', stat: 'riftRuns', target: 3, reward: 760 },
  { id: 'pulse_3', label: '3 EMP-Pulse', stat: 'pulseUses', target: 3, reward: 620 },
  { id: 'capital_1', label: 'Capital-Ship stoppen', stat: 'capitalKills', target: 1, reward: 1800 },
  { id: 'learn_4', label: '4 Lern-Beacons', stat: 'learnCorrect', target: 4, reward: 1200, mode: 'learn' },
];

const NEBULAS = [
  { x: 415, y: 295, r: 360, color: 'rgba(56,189,248,.16)' },
  { x: 1320, y: 760, r: 420, color: 'rgba(168,85,247,.14)' },
  { x: 1820, y: 1180, r: 340, color: 'rgba(34,197,94,.12)' },
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
  width: 64,
  height: 54,
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,.2)',
  background: 'rgba(15,23,42,.78)',
  color: '#f8fafc',
  fontSize: 13,
  fontWeight: 900,
  touchAction: 'none',
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const angleTo = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);

function seededUnit(index, salt) {
  const value = Math.sin(index * 19.417 + salt * 83.173) * 54531.1357;
  return value - Math.floor(value);
}

const STARFIELD = Array.from({ length: 420 }, (_, index) => ({
  x: seededUnit(index, 1) * WORLD_WIDTH,
  y: seededUnit(index, 2) * WORLD_HEIGHT,
  r: 0.8 + seededUnit(index, 3) * 2.2,
  alpha: 0.28 + seededUnit(index, 4) * 0.72,
  twinkle: seededUnit(index, 5) * Math.PI * 2,
}));

function readHighScore() {
  const value = Number(localStorage.getItem(STORAGE_KEY) || 0);
  return Number.isFinite(value) ? value : 0;
}

function currentTask(game) {
  return LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
}

function createStats() {
  return {
    scans: 0,
    asteroidKills: 0,
    droneKills: 0,
    riftRuns: 0,
    pulseUses: 0,
    capitalKills: 0,
    learnCorrect: 0,
  };
}

function createGoals(mode) {
  return MISSION_GOALS
    .filter((goal) => !goal.mode || goal.mode === mode)
    .map((goal) => ({ ...goal, completed: false }));
}

function recordStat(game, stat, amount = 1) {
  game.stats[stat] = Math.max(game.stats[stat] || 0, amount === 1 ? (game.stats[stat] || 0) + 1 : amount);
  const goal = game.goals.find((candidate) => !candidate.completed && candidate.stat === stat && game.stats[stat] >= candidate.target);
  if (!goal) return;
  goal.completed = true;
  game.score += goal.reward;
  game.message = `${goal.label}: +${goal.reward}`;
  game.messageTimer = 1.15;
  addFloating(game, goal.label, game.ship.x, game.ship.y - 64, '#facc15');
}

function makeAsteroids() {
  return Array.from({ length: 22 }, (_, index) => {
    const nearPlanet = PLANETS[index % PLANETS.length];
    const angle = seededUnit(index, 4) * Math.PI * 2;
    const radius = 170 + seededUnit(index, 5) * 310;
    return {
      id: `asteroid-${index}`,
      x: clamp(nearPlanet.x + Math.cos(angle) * radius, 120, WORLD_WIDTH - 120),
      y: clamp(nearPlanet.y + Math.sin(angle) * radius, 120, WORLD_HEIGHT - 120),
      r: 18 + seededUnit(index, 6) * 22,
      hp: 2 + Math.floor(seededUnit(index, 7) * 3),
      spin: seededUnit(index, 8) * Math.PI * 2,
      rot: seededUnit(index, 9) * Math.PI * 2,
      vx: (seededUnit(index, 10) - 0.5) * 18,
      vy: (seededUnit(index, 11) - 0.5) * 18,
      alive: true,
    };
  });
}

function makeDrones() {
  return [
    { id: 'd1', x: 860, y: 680, hp: 3, r: 22, color: '#fb7185', cooldown: 0.8 },
    { id: 'd2', x: 1370, y: 1060, hp: 3, r: 22, color: '#facc15', cooldown: 1.1 },
    { id: 'd3', x: 1720, y: 670, hp: 4, r: 24, color: '#38bdf8', cooldown: 1.4 },
  ].map((drone, index) => ({
    ...drone,
    vx: 0,
    vy: 0,
    phase: seededUnit(index, 9) * Math.PI * 2,
    alive: true,
  }));
}

function makePickups() {
  return Array.from({ length: 28 }, (_, index) => ({
    id: `pickup-${index}`,
    x: 160 + seededUnit(index, 14) * (WORLD_WIDTH - 320),
    y: 160 + seededUnit(index, 15) * (WORLD_HEIGHT - 320),
    kind: seededUnit(index, 16) > 0.7 ? 'fuel' : seededUnit(index, 17) > 0.55 ? 'shield' : 'star',
    pulse: seededUnit(index, 18) * Math.PI * 2,
    taken: false,
  }));
}

function makeRifts() {
  return [
    { id: 'rift-a', x: 520, y: 520, r: 82, angle: 0.35, used: false, pulse: 0 },
    { id: 'rift-b', x: 1450, y: 420, r: 96, angle: 1.8, used: false, pulse: 1.7 },
    { id: 'rift-c', x: 1810, y: 1190, r: 88, angle: -1.1, used: false, pulse: 3.1 },
  ];
}

function makeWormholes() {
  return [
    { id: 'worm-a', x: 420, y: 250, target: 'worm-b', cooldown: 0 },
    { id: 'worm-b', x: 1960, y: 1320, target: 'worm-a', cooldown: 0 },
    { id: 'worm-c', x: 1680, y: 230, target: 'worm-d', cooldown: 0 },
    { id: 'worm-d', x: 690, y: 1370, target: 'worm-c', cooldown: 0 },
  ];
}

function makeCapitalShip() {
  return {
    x: 1825,
    y: 760,
    vx: -18,
    vy: 0,
    hp: 34,
    maxHp: 34,
    alive: true,
    active: false,
    fireTimer: 1.3,
    beamTimer: 4.5,
    hitTimer: 0,
  };
}

function makeInitialGame(mode = 'arcade') {
  return {
    mode,
    started: false,
    finished: false,
    elapsed: 0,
    message: mode === 'learn' ? 'Lerne an jedem Planeten.' : 'Scanne alle Planeten der Route.',
    messageTimer: 1.8,
    shake: 0,
    score: 0,
    highScore: readHighScore(),
    ship: {
      x: PLANETS[0].x + 92,
      y: PLANETS[0].y + 82,
      vx: 0,
      vy: 0,
      angle: -0.55,
      fuel: 100,
      shield: 70,
      boost: 88,
      heat: 0,
      invulnerable: 0,
      emp: mode === 'learn' ? 70 : 48,
      empCooldown: 0,
      riftTimer: 0,
    },
    routeIndex: 0,
    scanned: 0,
    taskIndex: 0,
    correct: 0,
    wrong: 0,
    combo: 0,
    asteroids: makeAsteroids(),
    drones: makeDrones(),
    pickups: makePickups(),
    bullets: [],
    enemyShots: [],
    beacons: [],
    rifts: makeRifts(),
    wormholes: makeWormholes(),
    capital: makeCapitalShip(),
    stats: createStats(),
    goals: createGoals(mode),
    particles: [],
  };
}

function getCamera(game) {
  const ship = game.ship;
  return {
    x: clamp(ship.x - WIDTH / 2, 0, WORLD_WIDTH - WIDTH),
    y: clamp(ship.y - HEIGHT / 2, 0, WORLD_HEIGHT - HEIGHT),
  };
}

function toScreen(point, camera) {
  return { x: point.x - camera.x, y: point.y - camera.y };
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

function spawnBeacons(game) {
  if (game.mode !== 'learn' || game.routeIndex >= PLANETS.length) return;
  const planet = PLANETS[game.routeIndex];
  const task = currentTask(game);
  const angles = getBeaconAngles(planet);
  game.beacons = task.choices.map((choice, index) => {
    const angle = angles[index];
    const radius = planet.r + (planet.x < 500 || planet.x > WORLD_WIDTH - 500 ? 190 : 106);
    return {
      id: `${planet.id}-${game.taskIndex}-${choice}`,
      x: planet.x + Math.cos(angle) * radius,
      y: planet.y + Math.sin(angle) * radius,
      label: choice,
      correct: choice === task.correct,
      planet: planet.id,
      taken: false,
      pulse: index * 1.3,
    };
  });
}

function getBeaconAngles(planet) {
  if (planet.x < 500) return [-0.56, 0, 0.56];
  if (planet.x > WORLD_WIDTH - 500) return [Math.PI - 0.56, Math.PI, Math.PI + 0.56];
  if (planet.y < 360) return [1.05, Math.PI / 2, 2.09];
  if (planet.y > WORLD_HEIGHT - 360) return [-1.05, -Math.PI / 2, -2.09];
  return [-Math.PI * 0.78, -Math.PI * 0.06, Math.PI * 0.66];
}

function addFloating(game, text, x, y, color = '#f8fafc') {
  game.particles.push({
    kind: 'text',
    text,
    x,
    y,
    vx: 0,
    vy: -42,
    life: 1.1,
    maxLife: 1.1,
    color,
  });
}

function addBurst(game, x, y, color, amount = 14) {
  for (let i = 0; i < amount; i += 1) {
    const angle = seededUnit(game.elapsed * 100 + i, 5) * Math.PI * 2;
    const speed = 55 + seededUnit(game.elapsed * 100 + i, 6) * 145;
    game.particles.push({
      kind: 'spark',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.6,
      maxLife: 0.6,
      color,
      size: 2.5 + seededUnit(i, 3) * 4.5,
    });
  }
}

function damageShip(game, amount, text = 'Treffer') {
  if (game.ship.invulnerable > 0 || game.finished) return;
  game.ship.invulnerable = 0.65;
  if (game.ship.shield > 0) {
    game.ship.shield = Math.max(0, game.ship.shield - amount);
  } else {
    game.ship.fuel = Math.max(0, game.ship.fuel - amount * 0.75);
  }
  game.combo = 0;
  game.shake = Math.max(game.shake, 0.35);
  game.message = text;
  game.messageTimer = 0.95;
  addBurst(game, game.ship.x, game.ship.y, '#fb7185', 12);
  if (game.ship.fuel <= 0) {
    game.finished = true;
    game.message = 'Treibstoff leer. Restart druecken.';
    game.messageTimer = 4;
  }
}

function completePlanet(game, learned = false) {
  if (game.finished || game.routeIndex >= PLANETS.length) return;
  const planet = PLANETS[game.routeIndex];
  game.scanned += 1;
  recordStat(game, 'scans');
  if (learned) recordStat(game, 'learnCorrect');
  game.combo += 1;
  game.score += learned ? 360 + game.combo * 50 : 260 + game.combo * 32;
  game.ship.fuel = clamp(game.ship.fuel + 18, 0, 100);
  game.ship.shield = clamp(game.ship.shield + 12, 0, 100);
  addFloating(game, learned ? 'RICHTIG' : 'SCAN', planet.x, planet.y - planet.r - 28, learned ? '#22c55e' : '#67e8f9');
  addBurst(game, planet.x, planet.y, planet.halo, 18);
  game.routeIndex += 1;
  game.beacons = [];

  if (game.routeIndex >= PLANETS.length) {
    game.finished = true;
    game.message = game.mode === 'learn' ? 'Sternenroute gelernt.' : 'Odyssee abgeschlossen.';
    game.messageTimer = 4;
    game.score += Math.round(game.ship.fuel * 18 + game.ship.shield * 10);
    const nextHigh = Math.max(game.highScore, game.score);
    game.highScore = nextHigh;
    localStorage.setItem(STORAGE_KEY, String(nextHigh));
    return;
  }

  game.message = game.mode === 'learn'
    ? `${planet.subject} erledigt. Naechster Planet: ${PLANETS[game.routeIndex].name}`
    : `${planet.name} gescannt. Naechster Planet: ${PLANETS[game.routeIndex].name}`;
  game.messageTimer = 1.6;
  if (game.mode === 'learn') spawnBeacons(game);
}

function collectPickups(game) {
  for (const pickup of game.pickups) {
    if (pickup.taken || dist(pickup, game.ship) > 30) continue;
    pickup.taken = true;
    if (pickup.kind === 'star') {
      game.score += 70 + game.combo * 10;
      addFloating(game, '+70', pickup.x, pickup.y, '#facc15');
      addBurst(game, pickup.x, pickup.y, '#facc15', 9);
    } else if (pickup.kind === 'fuel') {
      game.ship.fuel = clamp(game.ship.fuel + 26, 0, 100);
      addFloating(game, 'FUEL', pickup.x, pickup.y, '#22c55e');
      addBurst(game, pickup.x, pickup.y, '#22c55e', 10);
    } else {
      game.ship.shield = clamp(game.ship.shield + 30, 0, 100);
      addFloating(game, 'SHIELD', pickup.x, pickup.y, '#38bdf8');
      addBurst(game, pickup.x, pickup.y, '#38bdf8', 10);
    }
  }
}

function collectBeacons(game) {
  if (game.mode !== 'learn' || game.finished) return;
  if (game.beacons.length === 0) spawnBeacons(game);
  for (const beacon of game.beacons) {
    if (beacon.taken || dist(beacon, game.ship) > 42) continue;
    beacon.taken = true;
    const task = currentTask(game);
    if (beacon.correct) {
      game.correct += 1;
      game.taskIndex += 1;
      completePlanet(game, true);
    } else {
      game.wrong += 1;
      game.ship.vx *= 0.45;
      game.ship.vy *= 0.45;
      damageShip(game, 12, `${beacon.label} passt nicht. Gesucht: ${task.correct}`);
      addFloating(game, 'FALSCH', beacon.x, beacon.y, '#fb7185');
    }
    return;
  }
}

function scanPlanets(game) {
  if (game.mode === 'learn' || game.finished || game.routeIndex >= PLANETS.length) return;
  const planet = PLANETS[game.routeIndex];
  if (dist(planet, game.ship) < planet.r + 48) completePlanet(game, false);
}

function fireBullet(game) {
  const ship = game.ship;
  if (ship.heat > 78) return;
  ship.heat += 16;
  game.bullets.push({
    x: ship.x + Math.cos(ship.angle) * 30,
    y: ship.y + Math.sin(ship.angle) * 30,
    vx: ship.vx + Math.cos(ship.angle) * 620,
    vy: ship.vy + Math.sin(ship.angle) * 620,
    life: 0.88,
  });
}

function activateEmp(game) {
  const ship = game.ship;
  if (ship.emp < 40 || ship.empCooldown > 0 || game.finished) {
    game.message = ship.empCooldown > 0 ? 'EMP laedt noch' : 'Zu wenig EMP-Energie';
    game.messageTimer = 0.75;
    return;
  }
  ship.emp -= 40;
  ship.empCooldown = 4.2;
  game.shake = Math.max(game.shake, 0.22);
  game.enemyShots = [];
  let hits = 0;
  for (const drone of game.drones) {
    if (!drone.alive || dist(drone, ship) > 360) continue;
    drone.hp -= 2;
    drone.cooldown += 1.8;
    hits += 1;
    addBurst(game, drone.x, drone.y, drone.color, 16);
    if (drone.hp <= 0) {
      drone.alive = false;
      game.score += 260;
      recordStat(game, 'droneKills');
    }
  }
  if (game.capital.active && game.capital.alive && dist(game.capital, ship) < 460) {
    game.capital.hp -= 3;
    game.capital.fireTimer += 1.4;
    game.capital.hitTimer = 0.3;
    hits += 1;
  }
  recordStat(game, 'pulseUses');
  addBurst(game, ship.x, ship.y, '#67e8f9', 34);
  addFloating(game, hits > 0 ? `EMP x${hits}` : 'EMP', ship.x, ship.y - 42, '#67e8f9');
}

function updateBullets(game, dt) {
  for (const bullet of game.bullets) {
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;
    for (const asteroid of game.asteroids) {
      if (!asteroid.alive || bullet.life <= 0 || dist(bullet, asteroid) > asteroid.r + 5) continue;
      bullet.life = 0;
      asteroid.hp -= 1;
      addBurst(game, bullet.x, bullet.y, '#cbd5e1', 6);
      if (asteroid.hp <= 0) {
        asteroid.alive = false;
        game.score += 130;
        game.combo += 1;
        game.ship.emp = clamp(game.ship.emp + 4, 0, 100);
        recordStat(game, 'asteroidKills');
        addFloating(game, '+130', asteroid.x, asteroid.y, '#facc15');
        addBurst(game, asteroid.x, asteroid.y, '#94a3b8', 16);
      }
    }
    for (const drone of game.drones) {
      if (!drone.alive || bullet.life <= 0 || dist(bullet, drone) > drone.r + 6) continue;
      bullet.life = 0;
      drone.hp -= 1;
      addBurst(game, bullet.x, bullet.y, drone.color, 7);
      if (drone.hp <= 0) {
        drone.alive = false;
        game.score += 220;
        game.combo += 1;
        game.ship.emp = clamp(game.ship.emp + 8, 0, 100);
        recordStat(game, 'droneKills');
        addFloating(game, '+220', drone.x, drone.y, '#facc15');
        addBurst(game, drone.x, drone.y, drone.color, 20);
      }
    }
    if (game.capital.active && game.capital.alive && bullet.life > 0 && dist(bullet, game.capital) < 84) {
      bullet.life = 0;
      game.capital.hp -= 1;
      game.capital.hitTimer = 0.12;
      game.score += 38 + game.combo * 2;
      addBurst(game, bullet.x, bullet.y, '#fef3c7', 7);
      if (game.capital.hp <= 0) {
        game.capital.alive = false;
        game.score += 1800;
        game.combo += 5;
        recordStat(game, 'capitalKills');
        addFloating(game, 'CAPITAL DOWN', game.capital.x, game.capital.y - 76, '#facc15');
        addBurst(game, game.capital.x, game.capital.y, '#fb7185', 46);
      }
    }
  }
  game.bullets = game.bullets.filter((bullet) => bullet.life > 0);
}

function updateAsteroids(game, dt) {
  for (const asteroid of game.asteroids) {
    if (!asteroid.alive) continue;
    asteroid.x += asteroid.vx * dt;
    asteroid.y += asteroid.vy * dt;
    asteroid.rot += asteroid.spin * dt * 0.2;
    if (asteroid.x < 80 || asteroid.x > WORLD_WIDTH - 80) asteroid.vx *= -1;
    if (asteroid.y < 80 || asteroid.y > WORLD_HEIGHT - 80) asteroid.vy *= -1;
    if (dist(asteroid, game.ship) < asteroid.r + 22) {
      const push = angleTo(asteroid, game.ship);
      game.ship.vx += Math.cos(push) * 80;
      game.ship.vy += Math.sin(push) * 80;
      damageShip(game, 16, 'Asteroiden-Treffer');
    }
  }
}

function updateDrones(game, dt) {
  for (const drone of game.drones) {
    if (!drone.alive) continue;
    const distance = dist(drone, game.ship);
    const desired = angleTo(drone, game.ship) + Math.sin(game.elapsed * 1.8 + drone.phase) * 0.8;
    const speed = distance < 660 ? 72 : 30;
    drone.vx += Math.cos(desired) * speed * dt;
    drone.vy += Math.sin(desired) * speed * dt;
    drone.vx *= Math.pow(0.12, dt);
    drone.vy *= Math.pow(0.12, dt);
    drone.x = clamp(drone.x + drone.vx * dt, 80, WORLD_WIDTH - 80);
    drone.y = clamp(drone.y + drone.vy * dt, 80, WORLD_HEIGHT - 80);
    drone.cooldown -= dt;
    if (distance < 520 && drone.cooldown <= 0) {
      const shotAngle = angleTo(drone, game.ship);
      game.enemyShots.push({
        x: drone.x,
        y: drone.y,
        vx: Math.cos(shotAngle) * 250,
        vy: Math.sin(shotAngle) * 250,
        life: 2.3,
        color: drone.color,
      });
      drone.cooldown = 1.6 + seededUnit(game.elapsed * 20, drone.phase) * 0.9;
    }
    if (distance < drone.r + 23) damageShip(game, 18, 'Drohnen-Kontakt');
  }

  for (const shot of game.enemyShots) {
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.life -= dt;
    if (dist(shot, game.ship) < 25) {
      shot.life = 0;
      damageShip(game, 14, 'Laser-Treffer');
    }
  }
  game.enemyShots = game.enemyShots.filter((shot) => shot.life > 0);
}

function updateRifts(game, dt) {
  const ship = game.ship;
  ship.riftTimer = Math.max(0, ship.riftTimer - dt);
  for (const rift of game.rifts) {
    const d = dist(rift, ship);
    if (d > rift.r) continue;
    const aligned = Math.cos(ship.angle - rift.angle) > 0.25;
    if (ship.riftTimer <= 0 && aligned) {
      ship.riftTimer = 1.2;
      ship.vx += Math.cos(rift.angle) * 220;
      ship.vy += Math.sin(rift.angle) * 220;
      ship.fuel = clamp(ship.fuel + 5, 0, 100);
      ship.emp = clamp(ship.emp + 7, 0, 100);
      game.score += rift.used ? 80 : 260;
      if (!rift.used) recordStat(game, 'riftRuns');
      rift.used = true;
      addFloating(game, 'RIFT RUN', ship.x, ship.y - 48, '#a78bfa');
      addBurst(game, ship.x, ship.y, '#a78bfa', 18);
    } else if (!aligned && ship.invulnerable <= 0) {
      damageShip(game, 5, 'Rift-Turbulenz');
    }
  }
}

function updateWormholes(game, dt) {
  game.wormholes.forEach((wormhole) => {
    wormhole.cooldown = Math.max(0, wormhole.cooldown - dt);
  });
  const entry = game.wormholes.find((wormhole) => wormhole.cooldown <= 0 && dist(wormhole, game.ship) < 38);
  if (!entry) return;
  const exit = game.wormholes.find((wormhole) => wormhole.id === entry.target);
  if (!exit) return;
  game.ship.x = exit.x + Math.cos(game.ship.angle) * 54;
  game.ship.y = exit.y + Math.sin(game.ship.angle) * 54;
  game.ship.vx *= 0.72;
  game.ship.vy *= 0.72;
  entry.cooldown = 3;
  exit.cooldown = 3;
  game.score += 120;
  game.message = 'Wurmloch-Sprung';
  game.messageTimer = 0.9;
  addBurst(game, entry.x, entry.y, '#c084fc', 18);
  addBurst(game, exit.x, exit.y, '#c084fc', 18);
}

function updateCapitalShip(game, dt) {
  const capital = game.capital;
  if (!capital.alive) return;
  if (!capital.active && game.routeIndex >= 3) {
    capital.active = true;
    game.message = 'Capital-Ship im Sektor';
    game.messageTimer = 1.2;
  }
  if (!capital.active) return;
  capital.hitTimer = Math.max(0, capital.hitTimer - dt);
  capital.x += capital.vx * dt;
  capital.y = clamp(capital.y + Math.sin(game.elapsed * 0.7) * 18 * dt, 170, WORLD_HEIGHT - 170);
  if (capital.x < 1240 || capital.x > WORLD_WIDTH - 170) capital.vx *= -1;
  capital.fireTimer -= dt;
  capital.beamTimer -= dt;
  const shotAngle = angleTo(capital, game.ship);
  if (capital.fireTimer <= 0) {
    capital.fireTimer = 1.1;
    [-0.18, 0, 0.18].forEach((offset) => {
      game.enemyShots.push({
        x: capital.x + Math.cos(shotAngle + offset) * 80,
        y: capital.y + Math.sin(shotAngle + offset) * 36,
        vx: Math.cos(shotAngle + offset) * 230,
        vy: Math.sin(shotAngle + offset) * 230,
        life: 2.7,
        color: '#fb7185',
      });
    });
  }
  if (capital.beamTimer <= 0) {
    capital.beamTimer = 5.2;
    game.enemyShots.push({
      x: capital.x,
      y: capital.y,
      vx: Math.cos(shotAngle) * 310,
      vy: Math.sin(shotAngle) * 310,
      life: 2.2,
      color: '#facc15',
    });
    game.message = 'Capital-Beam';
    game.messageTimer = 0.7;
  }
}

function updateParticles(game, dt) {
  for (const particle of game.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
  }
  game.particles = game.particles.filter((particle) => particle.life > 0);
}

function updateGame(game, controls, dt) {
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.shake = Math.max(0, game.shake - dt * 2.4);
  game.ship.invulnerable = Math.max(0, game.ship.invulnerable - dt);
  game.ship.heat = Math.max(0, game.ship.heat - 42 * dt);
  game.ship.empCooldown = Math.max(0, game.ship.empCooldown - dt);
  updateParticles(game, dt);
  updateAsteroids(game, dt);
  updateDrones(game, dt);
  updateCapitalShip(game, dt);
  updateBullets(game, dt);

  if (!game.started || game.finished) {
    game.ship.vx *= Math.pow(0.08, dt);
    game.ship.vy *= Math.pow(0.08, dt);
    return;
  }

  const ship = game.ship;
  const turn = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
  ship.angle += turn * 3.15 * dt;

  const thrust = controls.up || controls.thrust;
  const brake = controls.down || controls.brake;
  const boosting = controls.boost && ship.boost > 0 && ship.fuel > 0;
  const thrustPower = boosting ? 385 : 255;

  if (thrust) {
    ship.vx += Math.cos(ship.angle) * thrustPower * dt;
    ship.vy += Math.sin(ship.angle) * thrustPower * dt;
    ship.fuel = Math.max(0, ship.fuel - (boosting ? 6.8 : 2.4) * dt);
    if (game.particles.length < 90) {
      game.particles.push({
        kind: 'spark',
        x: ship.x - Math.cos(ship.angle) * 24,
        y: ship.y - Math.sin(ship.angle) * 24,
        vx: ship.vx * 0.05 - Math.cos(ship.angle) * 80,
        vy: ship.vy * 0.05 - Math.sin(ship.angle) * 80,
        life: 0.32,
        maxLife: 0.32,
        color: boosting ? '#38bdf8' : '#f97316',
        size: boosting ? 7 : 4,
      });
    }
  }
  if (brake) {
    ship.vx *= Math.pow(0.03, dt);
    ship.vy *= Math.pow(0.03, dt);
  }
  if (boosting) ship.boost = Math.max(0, ship.boost - 36 * dt);
  else ship.boost = clamp(ship.boost + 6.5 * dt, 0, 100);
  ship.emp = clamp(ship.emp + (ship.heat < 35 ? 5.2 : 2.4) * dt, 0, 100);

  const maxSpeed = boosting ? 435 : 315;
  const speed = Math.hypot(ship.vx, ship.vy);
  if (speed > maxSpeed) {
    ship.vx = (ship.vx / speed) * maxSpeed;
    ship.vy = (ship.vy / speed) * maxSpeed;
  }
  ship.vx *= Math.pow(0.42, dt);
  ship.vy *= Math.pow(0.42, dt);
  ship.x = clamp(ship.x + ship.vx * dt, 52, WORLD_WIDTH - 52);
  ship.y = clamp(ship.y + ship.vy * dt, 52, WORLD_HEIGHT - 52);

  updateRifts(game, dt);
  updateWormholes(game, dt);

  if (controls.fire) {
    controls.fireHeld += dt;
    if (!controls.lastFire || controls.fireHeld - controls.lastFire > 0.18) {
      fireBullet(game);
      controls.lastFire = controls.fireHeld;
    }
  } else {
    controls.fireHeld = 0;
    controls.lastFire = 0;
  }
  if (controls.emp) {
    activateEmp(game);
    controls.emp = false;
  }

  collectPickups(game);
  collectBeacons(game);
  scanPlanets(game);
  if (ship.fuel <= 0) damageShip(game, 8, 'Treibstoff kritisch');
}

function drawWorldBackground(ctx, game, camera) {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, '#030712');
  gradient.addColorStop(0.5, '#06142c');
  gradient.addColorStop(1, '#0f172a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (const nebula of NEBULAS) {
    const screen = toScreen(nebula, camera);
    const radial = ctx.createRadialGradient(screen.x, screen.y, 0, screen.x, screen.y, nebula.r);
    radial.addColorStop(0, nebula.color);
    radial.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, nebula.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  for (const star of STARFIELD) {
    const parallaxX = star.x - camera.x * (0.75 + star.r * 0.04);
    const parallaxY = star.y - camera.y * (0.75 + star.r * 0.04);
    const x = ((parallaxX % WORLD_WIDTH) + WORLD_WIDTH) % WORLD_WIDTH;
    const y = ((parallaxY % WORLD_HEIGHT) + WORLD_HEIGHT) % WORLD_HEIGHT;
    if (x < -8 || x > WIDTH + 8 || y < -8 || y > HEIGHT + 8) continue;
    ctx.globalAlpha = star.alpha * (0.62 + Math.sin(game.elapsed * 2 + star.twinkle) * 0.28);
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(x, y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawRoute(ctx, game, camera) {
  ctx.save();
  ctx.strokeStyle = 'rgba(103,232,249,.22)';
  ctx.lineWidth = 4;
  ctx.setLineDash([18, 18]);
  ctx.beginPath();
  for (let i = 0; i < PLANETS.length; i += 1) {
    const screen = toScreen(PLANETS[i], camera);
    if (i === 0) ctx.moveTo(screen.x, screen.y);
    else ctx.lineTo(screen.x, screen.y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawPlanets(ctx, game, camera) {
  drawRoute(ctx, game, camera);
  for (let i = 0; i < PLANETS.length; i += 1) {
    const planet = PLANETS[i];
    const screen = toScreen(planet, camera);
    if (screen.x < -180 || screen.x > WIDTH + 180 || screen.y < -180 || screen.y > HEIGHT + 180) continue;
    const active = i === game.routeIndex;
    const done = i < game.routeIndex;
    ctx.save();
    ctx.translate(screen.x, screen.y);
    ctx.shadowBlur = active ? 34 : 16;
    ctx.shadowColor = planet.halo;
    ctx.fillStyle = planet.color;
    ctx.beginPath();
    ctx.arc(0, 0, planet.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    const shade = ctx.createLinearGradient(-planet.r, -planet.r, planet.r, planet.r);
    shade.addColorStop(0, 'rgba(255,255,255,.32)');
    shade.addColorStop(0.45, 'rgba(255,255,255,.05)');
    shade.addColorStop(1, 'rgba(2,6,23,.42)');
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(0, 0, planet.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = active ? '#fef3c7' : done ? '#22c55e' : 'rgba(226,232,240,.35)';
    ctx.lineWidth = active ? 5 : 2;
    ctx.beginPath();
    ctx.arc(0, 0, planet.r + 12 + Math.sin(game.elapsed * 3) * (active ? 4 : 0), 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 15px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(planet.name, 0, planet.r + 34);
    ctx.fillStyle = active ? '#fef3c7' : '#94a3b8';
    ctx.font = '800 11px Outfit, sans-serif';
    ctx.fillText(done ? 'SCAN OK' : active ? 'ZIEL' : planet.subject, 0, planet.r + 52);
    ctx.restore();
  }
}

function drawAsteroids(ctx, game, camera) {
  for (const asteroid of game.asteroids) {
    if (!asteroid.alive) continue;
    const screen = toScreen(asteroid, camera);
    if (screen.x < -80 || screen.x > WIDTH + 80 || screen.y < -80 || screen.y > HEIGHT + 80) continue;
    ctx.save();
    ctx.translate(screen.x, screen.y);
    ctx.rotate(asteroid.rot);
    ctx.fillStyle = '#64748b';
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 4;
    ctx.beginPath();
    const points = 9;
    for (let i = 0; i < points; i += 1) {
      const angle = (i / points) * Math.PI * 2;
      const radius = asteroid.r * (0.78 + seededUnit(i, asteroid.r) * 0.35);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function drawPickups(ctx, game, camera) {
  for (const pickup of game.pickups) {
    if (pickup.taken) continue;
    const screen = toScreen(pickup, camera);
    if (screen.x < -40 || screen.x > WIDTH + 40 || screen.y < -40 || screen.y > HEIGHT + 40) continue;
    const color = pickup.kind === 'star' ? '#facc15' : pickup.kind === 'fuel' ? '#22c55e' : '#38bdf8';
    const pulse = Math.sin(game.elapsed * 5 + pickup.pulse) * 3;
    ctx.save();
    ctx.translate(screen.x, screen.y);
    ctx.shadowBlur = 18;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    if (pickup.kind === 'star') {
      ctx.beginPath();
      for (let i = 0; i < 10; i += 1) {
        const radius = i % 2 === 0 ? 17 + pulse : 8 + pulse * 0.3;
        const angle = -Math.PI / 2 + (i / 10) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, 16 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#020617';
      ctx.font = '900 13px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pickup.kind === 'fuel' ? 'F' : 'S', 0, 1);
    }
    ctx.restore();
  }
}

function drawRiftsAndWormholes(ctx, game, camera) {
  for (const rift of game.rifts) {
    const screen = toScreen(rift, camera);
    if (screen.x < -160 || screen.x > WIDTH + 160 || screen.y < -160 || screen.y > HEIGHT + 160) continue;
    const pulse = Math.sin(game.elapsed * 4 + rift.pulse);
    ctx.save();
    ctx.translate(screen.x, screen.y);
    ctx.rotate(rift.angle);
    ctx.globalAlpha = 0.55 + pulse * 0.12;
    ctx.shadowBlur = 28;
    ctx.shadowColor = '#a78bfa';
    ctx.strokeStyle = rift.used ? 'rgba(167,139,250,.45)' : 'rgba(216,180,254,.85)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0, 0, rift.r, rift.r * 0.34, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(103,232,249,.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-rift.r * 0.65, 0);
    ctx.lineTo(rift.r * 0.65, 0);
    ctx.stroke();
    ctx.restore();
  }

  for (const wormhole of game.wormholes) {
    const screen = toScreen(wormhole, camera);
    if (screen.x < -80 || screen.x > WIDTH + 80 || screen.y < -80 || screen.y > HEIGHT + 80) continue;
    ctx.save();
    ctx.translate(screen.x, screen.y);
    ctx.rotate(game.elapsed * 1.8);
    ctx.shadowBlur = 24;
    ctx.shadowColor = '#c084fc';
    ctx.strokeStyle = wormhole.cooldown > 0 ? 'rgba(148,163,184,.55)' : '#c084fc';
    ctx.lineWidth = 4;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(0, 0, 18 + i * 9 + Math.sin(game.elapsed * 4 + i) * 2, i * 0.7, Math.PI * 1.65 + i * 0.7);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawCapitalShip(ctx, game, camera) {
  const capital = game.capital;
  if (!capital.active || !capital.alive) return;
  const screen = toScreen(capital, camera);
  if (screen.x < -200 || screen.x > WIDTH + 200 || screen.y < -160 || screen.y > HEIGHT + 160) return;
  ctx.save();
  ctx.translate(screen.x, screen.y);
  ctx.shadowBlur = capital.hitTimer > 0 ? 34 : 22;
  ctx.shadowColor = capital.hitTimer > 0 ? '#fef3c7' : '#fb7185';
  ctx.fillStyle = capital.hitTimer > 0 ? '#fef3c7' : '#7f1d1d';
  drawRoundedRect(ctx, -96, -34, 192, 68, 24);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(-88, -30);
  ctx.lineTo(-142, 0);
  ctx.lineTo(-88, 30);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(88, -30);
  ctx.lineTo(142, 0);
  ctx.lineTo(88, 30);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(2,6,23,.72)';
  drawRoundedRect(ctx, -96, 52, 192, 10, 5);
  ctx.fill();
  ctx.fillStyle = '#facc15';
  drawRoundedRect(ctx, -96, 52, 192 * clamp(capital.hp / capital.maxHp, 0, 1), 10, 5);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 11px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CAPITAL', 0, -2);
  ctx.restore();
}

function drawBeacons(ctx, game, camera) {
  if (game.mode !== 'learn') return;
  if (game.beacons.length === 0) spawnBeacons(game);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const beacon of game.beacons) {
    if (beacon.taken) continue;
    const screen = toScreen(beacon, camera);
    if (screen.x < -80 || screen.x > WIDTH + 80 || screen.y < -80 || screen.y > HEIGHT + 80) continue;
    const radius = 31 + Math.sin(game.elapsed * 4 + beacon.pulse) * 2.5;
    ctx.shadowBlur = beacon.correct ? 24 : 10;
    ctx.shadowColor = beacon.correct ? '#22c55e' : '#94a3b8';
    ctx.fillStyle = beacon.correct ? 'rgba(34,197,94,.94)' : 'rgba(226,232,240,.88)';
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = beacon.correct ? '#bbf7d0' : '#64748b';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = beacon.correct ? '#052e16' : '#0f172a';
    ctx.font = beacon.label.length > 8 ? '900 11px Outfit, sans-serif' : '900 13px Outfit, sans-serif';
    ctx.fillText(beacon.label, screen.x, screen.y + 1);
  }
  ctx.restore();
}

function drawDrones(ctx, game, camera) {
  for (const drone of game.drones) {
    if (!drone.alive) continue;
    const screen = toScreen(drone, camera);
    if (screen.x < -60 || screen.x > WIDTH + 60 || screen.y < -60 || screen.y > HEIGHT + 60) continue;
    const angle = angleTo(drone, game.ship);
    ctx.save();
    ctx.translate(screen.x, screen.y);
    ctx.rotate(angle);
    ctx.shadowBlur = 15;
    ctx.shadowColor = drone.color;
    ctx.fillStyle = '#020617';
    drawRoundedRect(ctx, -24, -16, 48, 32, 8);
    ctx.fill();
    ctx.fillStyle = drone.color;
    drawRoundedRect(ctx, -13, -12, 26, 24, 7);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(14, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  for (const shot of game.enemyShots) {
    const screen = toScreen(shot, camera);
    ctx.save();
    ctx.shadowBlur = 12;
    ctx.shadowColor = shot.color;
    ctx.fillStyle = shot.color;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawBullets(ctx, game, camera) {
  ctx.save();
  ctx.strokeStyle = '#67e8f9';
  ctx.lineWidth = 4;
  ctx.shadowBlur = 14;
  ctx.shadowColor = '#67e8f9';
  for (const bullet of game.bullets) {
    const screen = toScreen(bullet, camera);
    ctx.beginPath();
    ctx.moveTo(screen.x, screen.y);
    ctx.lineTo(screen.x - bullet.vx * 0.025, screen.y - bullet.vy * 0.025);
    ctx.stroke();
  }
  ctx.restore();
}

function drawShip(ctx, game, camera) {
  const ship = game.ship;
  const screen = toScreen(ship, camera);
  ctx.save();
  ctx.translate(screen.x, screen.y);
  ctx.rotate(ship.angle);
  const blink = ship.invulnerable > 0 && Math.floor(game.elapsed * 18) % 2 === 0;
  ctx.globalAlpha = blink ? 0.48 : 1;
  ctx.shadowBlur = 22;
  ctx.shadowColor = ship.shield > 0 ? '#38bdf8' : '#f97316';
  ctx.fillStyle = '#dbeafe';
  ctx.beginPath();
  ctx.moveTo(32, 0);
  ctx.lineTo(-22, -20);
  ctx.lineTo(-10, 0);
  ctx.lineTo(-22, 20);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.moveTo(14, 0);
  ctx.lineTo(-12, -10);
  ctx.lineTo(-7, 0);
  ctx.lineTo(-12, 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f97316';
  ctx.fillRect(-25, -7, 10, 5);
  ctx.fillRect(-25, 2, 10, 5);
  if (ship.shield > 0) {
    ctx.rotate(-ship.angle);
    ctx.strokeStyle = `rgba(56,189,248,${0.24 + ship.shield / 180})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawParticles(ctx, game, camera) {
  ctx.save();
  for (const particle of game.particles) {
    const screen = toScreen(particle, camera);
    const alpha = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.globalAlpha = alpha;
    if (particle.kind === 'text') {
      ctx.fillStyle = particle.color;
      ctx.font = '900 18px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(particle.text, screen.x, screen.y);
    } else {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, particle.size * alpha, 0, Math.PI * 2);
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

function drawHud(ctx, game) {
  const target = PLANETS[game.routeIndex] || PLANETS[PLANETS.length - 1];
  const task = currentTask(game);
  const activeGoals = game.goals.slice(0, 4);
  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, 38, 42, 270, game.mode === 'learn' ? 382 : 314, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 27px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Learn Odyssey' : 'Star Odyssey', 62, 82);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.fillText(`Score ${game.score}`, 62, 116);
  ctx.fillText(`Route ${Math.min(game.routeIndex + 1, PLANETS.length)}/${PLANETS.length}: ${target.name}`, 62, 144);
  ctx.fillText(`Combo x${Math.max(1, game.combo)}`, 62, 172);
  ctx.fillText(`Highscore ${Math.max(game.highScore, game.score)}`, 62, 200);
  ctx.fillText(`Rifts ${game.stats.riftRuns}/${3}  Drones ${game.stats.droneKills}`, 62, 228);
  if (game.mode === 'learn') {
    ctx.fillStyle = '#67e8f9';
    ctx.fillText(`${task.subject} - ${task.kind}`, 62, 264);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 15px Outfit, sans-serif';
    ctx.fillText(task.prompt, 62, 294, 204);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '800 12px Outfit, sans-serif';
    ctx.fillText(`Richtig ${game.correct}  Fehler ${game.wrong}`, 62, 326);
  }
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText('Missionen', 62, game.mode === 'learn' ? 356 : 258);
  ctx.font = '800 10px Outfit, sans-serif';
  activeGoals.forEach((goal, index) => {
    const value = Math.min(game.stats[goal.stat] || 0, goal.target);
    ctx.fillStyle = goal.completed ? '#86efac' : '#94a3b8';
    ctx.fillText(`${goal.completed ? 'OK' : `${value}/${goal.target}`} ${goal.label}`, 62, (game.mode === 'learn' ? 374 : 276) + index * 16);
  });

  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, 1018, 42, 224, 304, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 18px Outfit, sans-serif';
  ctx.fillText('Cockpit', 1042, 82);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText('WASD/Pfeile fliegen', 1042, 116);
  ctx.fillText('J = Laser', 1042, 142);
  ctx.fillText('Space/K = Boost', 1042, 168);
  ctx.fillText('X/L = EMP Pulse', 1042, 194);
  ctx.fillText('M = Modus wechseln', 1042, 220);
  drawGauge(ctx, 1042, 250, 160, 'FUEL', game.ship.fuel, game.ship.fuel < 24 ? '#fb7185' : '#22c55e');
  drawGauge(ctx, 1042, 290, 160, 'SHIELD', game.ship.shield, '#38bdf8');
  drawGauge(ctx, 1042, 330, 160, 'EMP', game.ship.empCooldown > 0 ? Math.max(0, 100 - game.ship.empCooldown * 24) : game.ship.emp, '#a78bfa');

  ctx.fillStyle = 'rgba(2,6,23,.72)';
  drawRoundedRect(ctx, 42, HEIGHT - 58, 770, 38, 14);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText('Freier Raumflug: Route scannen, Rifts nutzen, Wurmloecher finden, Drohnen/Capital stoppen, X/L EMP', 62, HEIGHT - 34);
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
    ctx.fillText(game.finished ? game.message : 'FASKA STAR ODYSSEY PRO', WIDTH / 2, 250);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '800 18px Outfit, sans-serif';
    ctx.fillText(
      game.finished ? `Score ${game.score} - Highscore ${Math.max(game.highScore, game.score)}` : 'Freier Space-Run mit Flugphysik, Rifts, Wurmloechern, EMP, Capital-Ship, Missionen und Learncade-Beacons.',
      WIDTH / 2,
      294,
    );
    ctx.fillStyle = '#67e8f9';
    ctx.font = '900 16px Outfit, sans-serif';
    ctx.fillText('Normal oder Learncade starten.', WIDTH / 2, 328);
  } else {
    ctx.fillStyle = 'rgba(2,6,23,.76)';
    drawRoundedRect(ctx, WIDTH / 2 - 330, 84, 660, 50, 16);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 20px Outfit, sans-serif';
    ctx.fillText(game.message, WIDTH / 2, 117);
  }
  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  const camera = getCamera(game);
  ctx.save();
  if (game.shake > 0) {
    const amount = game.shake * 15;
    ctx.translate(
      (seededUnit(Math.round(game.elapsed * 1000), 1) - 0.5) * amount,
      (seededUnit(Math.round(game.elapsed * 1000), 2) - 0.5) * amount,
    );
  }
  drawWorldBackground(ctx, game, camera);
  drawRiftsAndWormholes(ctx, game, camera);
  drawPlanets(ctx, game, camera);
  drawPickups(ctx, game, camera);
  drawBeacons(ctx, game, camera);
  drawAsteroids(ctx, game, camera);
  drawDrones(ctx, game, camera);
  drawCapitalShip(ctx, game, camera);
  drawBullets(ctx, game, camera);
  drawShip(ctx, game, camera);
  drawParticles(ctx, game, camera);
  drawHud(ctx, game);
  drawMessage(ctx, game);
  ctx.restore();
}

export default function FaskaSpaceOdysseySwarm() {
  const canvasRef = useRef(null);
  const modeRef = useRef('arcade');
  const gameRef = useRef(makeInitialGame('arcade'));
  const controlsRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
    boost: false,
    fire: false,
    thrust: false,
    brake: false,
    fireHeld: 0,
    lastFire: 0,
    emp: false,
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
    if (nextMode === 'learn') spawnBeacons(gameRef.current);
    gameRef.current.started = true;
    gameRef.current.message = nextMode === 'learn'
      ? 'Fliege durch Antworten, nutze EMP und sichere die Route.'
      : 'Scanne Planeten, nutze Rifts und stoppe das Capital-Ship.';
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
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' ', 'j', 'k', 'x', 'l', 'm', 'r'].includes(key)) {
        event.preventDefault();
      }
      if (key === 'arrowup' || key === 'w') controlsRef.current.up = true;
      if (key === 'arrowdown' || key === 's') controlsRef.current.down = true;
      if (key === 'arrowleft' || key === 'a') controlsRef.current.left = true;
      if (key === 'arrowright' || key === 'd') controlsRef.current.right = true;
      if (key === ' ' || key === 'k') controlsRef.current.boost = true;
      if (key === 'j') controlsRef.current.fire = true;
      if (key === 'x' || key === 'l') controlsRef.current.emp = true;
      if (key === 'm') startGame(modeRef.current === 'learn' ? 'arcade' : 'learn');
      if (key === 'r') startGame(modeRef.current);
    };
    const up = (event) => {
      const key = event.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') controlsRef.current.up = false;
      if (key === 'arrowdown' || key === 's') controlsRef.current.down = false;
      if (key === 'arrowleft' || key === 'a') controlsRef.current.left = false;
      if (key === 'arrowright' || key === 'd') controlsRef.current.right = false;
      if (key === ' ' || key === 'k') controlsRef.current.boost = false;
      if (key === 'j') controlsRef.current.fire = false;
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
          gridTemplateColumns: '64px 64px 64px',
          gap: 8,
          zIndex: 5,
        }}>
          <div />
          <button type="button" aria-label="Schub" style={touchButton} {...holdButton('up')}>Schub</button>
          <div />
          <button type="button" aria-label="Links" style={touchButton} {...holdButton('left')}>L</button>
          <button type="button" aria-label="Bremse" style={touchButton} {...holdButton('down')}>Stop</button>
          <button type="button" aria-label="Rechts" style={touchButton} {...holdButton('right')}>R</button>
          <button type="button" aria-label="Laser" style={touchButton} {...holdButton('fire')}>Laser</button>
          <button type="button" aria-label="EMP" style={touchButton} {...holdButton('emp')}>EMP</button>
          <button type="button" aria-label="Boost" style={touchButton} {...holdButton('boost')}>Boost</button>
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
