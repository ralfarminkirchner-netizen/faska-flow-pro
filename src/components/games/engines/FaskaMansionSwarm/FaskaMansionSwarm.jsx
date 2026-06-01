import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const WORLD_W = 2240;
const WORLD_H = 1440;

const WALLS = [
  { x: 0, y: 0, w: WORLD_W, h: 52 },
  { x: 0, y: WORLD_H - 52, w: WORLD_W, h: 52 },
  { x: 0, y: 0, w: 52, h: WORLD_H },
  { x: WORLD_W - 52, y: 0, w: 52, h: WORLD_H },
  { x: 520, y: 52, w: 42, h: 198 },
  { x: 520, y: 384, w: 42, h: 378 },
  { x: 520, y: 910, w: 42, h: 478 },
  { x: 1036, y: 52, w: 42, h: 502 },
  { x: 1036, y: 720, w: 42, h: 250 },
  { x: 1036, y: 1126, w: 42, h: 262 },
  { x: 1562, y: 52, w: 42, h: 312 },
  { x: 1562, y: 506, w: 42, h: 392 },
  { x: 1562, y: 1058, w: 42, h: 330 },
  { x: 52, y: 352, w: 324, h: 42 },
  { x: 666, y: 352, w: 370, h: 42 },
  { x: 1078, y: 352, w: 280, h: 42 },
  { x: 1692, y: 352, w: 496, h: 42 },
  { x: 52, y: 720, w: 290, h: 42 },
  { x: 562, y: 720, w: 280, h: 42 },
  { x: 1078, y: 720, w: 322, h: 42 },
  { x: 1604, y: 720, w: 584, h: 42 },
  { x: 52, y: 1060, w: 420, h: 42 },
  { x: 650, y: 1060, w: 386, h: 42 },
  { x: 1078, y: 1060, w: 270, h: 42 },
  { x: 1750, y: 1060, w: 438, h: 42 },
  { x: 770, y: 170, w: 148, h: 34 },
  { x: 1290, y: 564, w: 190, h: 34 },
  { x: 326, y: 1210, w: 210, h: 34 },
  { x: 1810, y: 194, w: 190, h: 34 },
];

const DOORS = [
  { id: 'blue-door', label: 'BLAU', requires: 'blue', x: 520, y: 250, w: 42, h: 134, color: '#38bdf8' },
  { id: 'red-door', label: 'ROT', requires: 'red', x: 1036, y: 554, w: 42, h: 166, color: '#fb7185' },
  { id: 'archive-door', label: 'ARCHIV', requires: 'archive', x: 1562, y: 898, w: 42, h: 160, color: '#facc15' },
  { id: 'exit-door', label: 'AUSGANG', requires: 'relic', x: 1348, y: 1060, w: 402, h: 42, color: '#a78bfa' },
];

const SAFE_ROOMS = [
  { id: 'foyer', label: 'Foyer-Safe', x: 248, y: 92, w: 188, h: 210 },
  { id: 'library', label: 'Bibliothek', x: 1112, y: 420, w: 330, h: 220 },
  { id: 'chapel', label: 'Kapelle', x: 1668, y: 1124, w: 360, h: 220 },
];

const PUZZLE_STATIONS = [
  {
    id: 'fuse-box',
    label: 'Sicherungskasten',
    requires: 'fuse',
    reward: 'Stromkreis aktiv',
    x: 854,
    y: 170,
    color: '#38bdf8',
  },
  {
    id: 'boiler',
    label: 'Kesselraum',
    requires: 'valve',
    reward: 'Dampfventil geschlossen',
    x: 1422,
    y: 612,
    color: '#f97316',
  },
  {
    id: 'moon-altar',
    label: 'Mondaltar',
    requires: 'crest',
    reward: 'Archiv-Siegel geloest',
    x: 1820,
    y: 1208,
    color: '#c4b5fd',
  },
];

const LOCKED_CACHES = [
  { id: 'armory-cache', label: 'Waffenkoffer', x: 1168, y: 510, reward: 'shotgun', color: '#facc15' },
  { id: 'medical-cache', label: 'Medizinschrank', x: 1768, y: 238, reward: 'medicine', color: '#22c55e' },
  { id: 'ammo-cache', label: 'Munitionskiste', x: 366, y: 952, reward: 'ammo', color: '#fb923c' },
];

const BARRICADES = [
  { id: 'west-window', label: 'Westfenster', x: 444, y: 358, w: 84, h: 34 },
  { id: 'gallery-window', label: 'Galeriefenster', x: 1514, y: 720, w: 88, h: 34 },
  { id: 'chapel-window', label: 'Kapellenfenster', x: 1710, y: 1058, w: 84, h: 34 },
];

const TRAPS = [
  { id: 'wire-foyer', label: 'Stolperdraht', x: 782, y: 756, radius: 54 },
  { id: 'wire-archive', label: 'Archiv-Falle', x: 1628, y: 944, radius: 56 },
  { id: 'wire-chapel', label: 'Kapellen-Falle', x: 1922, y: 1182, radius: 60 },
];

const ITEMS = [
  { id: 'key-blue', kind: 'key', key: 'blue', label: 'Blaue Karte', x: 292, y: 182, color: '#38bdf8' },
  { id: 'boards-1', kind: 'boards', label: 'Bretter', x: 394, y: 198, color: '#d6a15f', amount: 2 },
  { id: 'fuse', kind: 'puzzle', puzzle: 'fuse', label: 'Sicherung', x: 440, y: 560, color: '#7dd3fc' },
  { id: 'ammo-1', kind: 'ammo', label: 'Munition', x: 246, y: 568, color: '#f59e0b', amount: 8 },
  { id: 'herb-1', kind: 'herb', label: 'Kraut', x: 736, y: 512, color: '#22c55e', amount: 1 },
  { id: 'decoy-1', kind: 'decoy', label: 'Flasche', x: 794, y: 230, color: '#fde68a', amount: 1 },
  { id: 'key-red', kind: 'key', key: 'red', label: 'Rote Karte', x: 1326, y: 238, color: '#fb7185' },
  { id: 'valve', kind: 'puzzle', puzzle: 'valve', label: 'Ventilrad', x: 1220, y: 858, color: '#fb923c' },
  { id: 'ammo-2', kind: 'ammo', label: 'Munition', x: 1274, y: 874, color: '#f59e0b', amount: 7 },
  { id: 'lockpick-1', kind: 'lockpick', label: 'Dietrich', x: 1450, y: 526, color: '#e2e8f0', amount: 1 },
  { id: 'key-archive', kind: 'key', key: 'archive', label: 'Archivkarte', x: 1848, y: 556, color: '#facc15' },
  { id: 'shells-1', kind: 'shells', label: 'Schrot', x: 1724, y: 806, color: '#fef3c7', amount: 3 },
  { id: 'crest', kind: 'puzzle', puzzle: 'crest', label: 'Mondwappen', x: 1984, y: 1012, color: '#c4b5fd' },
  { id: 'herb-2', kind: 'herb', label: 'Kraut', x: 470, y: 1284, color: '#22c55e', amount: 1 },
  { id: 'lockpick-2', kind: 'lockpick', label: 'Dietrich', x: 710, y: 1264, color: '#e2e8f0', amount: 1 },
  { id: 'relic', kind: 'relic', label: 'Siegel', x: 1840, y: 1248, color: '#c4b5fd' },
];

const ENEMIES = [
  { id: 'e-1', x: 750, y: 240, patrol: [{ x: 704, y: 208 }, { x: 940, y: 266 }], hp: 2 },
  { id: 'e-2', x: 870, y: 894, patrol: [{ x: 706, y: 860 }, { x: 970, y: 982 }], hp: 3 },
  { id: 'e-3', x: 1390, y: 484, patrol: [{ x: 1240, y: 456 }, { x: 1502, y: 620 }], hp: 3 },
  { id: 'e-4', x: 1780, y: 980, patrol: [{ x: 1690, y: 930 }, { x: 2050, y: 984 }], hp: 4 },
  { id: 'e-5', x: 1958, y: 1268, patrol: [{ x: 1790, y: 1220 }, { x: 2070, y: 1300 }], hp: 4 },
];

const LEARN_TASKS = [
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist markiert?',
    sentence: 'Die Lampe flackert im Gang.',
    word: 'Lampe',
    answer: 'Nomen',
    options: ['Verb', 'Nomen', 'Adjektiv'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist markiert?',
    sentence: 'Faska schleicht leise weiter.',
    word: 'schleicht',
    answer: 'Verb',
    options: ['Nomen', 'Verb', 'Praeposition'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist markiert?',
    sentence: 'Der dunkle Raum knarrt.',
    word: 'dunkle',
    answer: 'Adjektiv',
    options: ['Adjektiv', 'Verb', 'Artikel'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart ist markiert?',
    sentence: 'Die Karte liegt unter dem Tisch.',
    word: 'unter',
    answer: 'Praeposition',
    options: ['Nomen', 'Praeposition', 'Adjektiv'],
  },
  {
    subject: 'Lesen',
    prompt: 'Welches Wort passt zum Hinweis?',
    sentence: 'Damit leuchtest du im Dunkeln.',
    word: 'Licht-Werkzeug',
    answer: 'Lampe',
    options: ['Lampe', 'Treppe', 'Kiste'],
  },
  {
    subject: 'Satzbau',
    prompt: 'Welches Wort macht den Satz sinnvoll?',
    sentence: 'Ich ___ die Tuer leise.',
    word: 'Luecke',
    answer: 'oeffne',
    options: ['oeffne', 'blau', 'unter'],
  },
  {
    subject: 'Komposita',
    prompt: 'Bilde das zusammengesetzte Wort.',
    sentence: 'Tasche + Lampe',
    word: 'Tasche + Lampe',
    answer: 'Taschenlampe',
    options: ['Lampentasche', 'Taschenlampe', 'Lampenlicht'],
  },
  {
    subject: 'Mathe',
    prompt: 'Welcher Code stimmt?',
    sentence: 'Archiv-Code: 8 + 7 = ?',
    word: '8 + 7',
    answer: '15',
    options: ['14', '15', '16'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet das Wort?',
    sentence: 'door',
    word: 'door',
    answer: 'Tuer',
    options: ['Fenster', 'Tuer', 'Lampe'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Was hilft bei Dunkelheit?',
    sentence: 'Du willst im Flur etwas sehen.',
    word: 'Hilfsmittel',
    answer: 'Licht',
    options: ['Licht', 'Eis', 'Sand'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welches Wort ist ein zusammengesetztes Nomen?',
    sentence: 'Der Sicherungskasten summt leise.',
    word: 'Sicherungskasten',
    answer: 'Sicherungskasten',
    options: ['leise', 'summt', 'Sicherungskasten'],
  },
  {
    subject: 'Lesen',
    prompt: 'Was soll zuerst benutzt werden?',
    sentence: 'Der Koffer ist verschlossen. Ein Dietrich hilft.',
    word: 'verschlossen',
    answer: 'Dietrich',
    options: ['Kraut', 'Dietrich', 'Brett'],
  },
  {
    subject: 'Mathe',
    prompt: 'Wie viele Patronen bleiben?',
    sentence: 'Du hast 6 Patronen und schiesst 2-mal.',
    word: '6 - 2',
    answer: '4',
    options: ['3', '4', '5'],
  },
  {
    subject: 'Sachkunde',
    prompt: 'Was macht ein lautes Geraeusch?',
    sentence: 'Eine Flasche zerbricht im Gang.',
    word: 'zerbricht',
    answer: 'Es lockt Gegner an',
    options: ['Es heilt dich', 'Es lockt Gegner an', 'Es oeffnet jede Tuer'],
  },
  {
    subject: 'Deutsch',
    prompt: 'Welche Wortart beschreibt "vorsichtig"?',
    sentence: 'Faska oeffnet die Tuer vorsichtig.',
    word: 'vorsichtig',
    answer: 'Adverb',
    options: ['Nomen', 'Adverb', 'Artikel'],
  },
  {
    subject: 'Englisch',
    prompt: 'Was bedeutet "key"?',
    sentence: 'key',
    word: 'key',
    answer: 'Schluessel',
    options: ['Schluessel', 'Lampe', 'Fenster'],
  },
];

const GATE_LAYOUTS = [
  { x: 640, y: 548 },
  { x: 1190, y: 430 },
  { x: 1710, y: 810 },
  { x: 654, y: 1182 },
];

const MANSION_GOALS = [
  { id: 'cards', label: '3 Karten sichern', stat: 'keys', target: 3, reward: 420 },
  { id: 'safe', label: 'Safe Room finden', stat: 'safeRooms', target: 1, reward: 260 },
  { id: 'silent', label: '2 Tueren leise oeffnen', stat: 'silentDoors', target: 2, reward: 360 },
  { id: 'light', label: '3 Fokus-Stuns', stat: 'flashStuns', target: 3, reward: 360 },
  { id: 'precision', label: '4 Praezisions-Treffer', stat: 'precisionShots', target: 4, reward: 520 },
  { id: 'perfect', label: '2 perfekte Ausweichmanoever', stat: 'perfectDodges', target: 2, reward: 540 },
  { id: 'hunters', label: '2 Gegner ausschalten', stat: 'kills', target: 2, reward: 420 },
  { id: 'puzzles', label: '2 Villa-Raetsel loesen', stat: 'puzzles', target: 2, reward: 520 },
  { id: 'barricades', label: '2 Fenster verbarrikadieren', stat: 'barricades', target: 2, reward: 440 },
  { id: 'traps', label: '2 Fallen ausloesen', stat: 'traps', target: 2, reward: 480 },
  { id: 'learn', label: '3 Learncade-Gates', stat: 'correctGates', target: 3, reward: 500, mode: 'learn' },
  { id: 'warden', label: 'Hausmeister besiegen', stat: 'bossKills', target: 1, reward: 900 },
  { id: 'relic', label: 'Siegel bergen', stat: 'relics', target: 1, reward: 700 },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const normalizeAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));
const angleDistance = (a, b) => Math.abs(normalizeAngle(a - b));

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

function makeInitialGame(mode = 'arcade') {
  return {
    mode,
    elapsed: 0,
    phase: 'run',
    message: mode === 'learn' ? 'Lies den Hinweis und waehle das richtige Gate.' : 'Finde Karten, Munition und das Siegel.',
    messageTimer: 2,
    cameraX: 0,
    cameraY: 0,
    taskIndex: 0,
    gateCooldown: 0.8,
    screenShake: 0,
    noise: 0,
    dread: 18,
    safeRoomId: null,
    safeRoomTimer: 0,
    visitedSafeRooms: [],
    lure: null,
    stats: {
      keys: 0,
      safeRooms: 0,
      flashStuns: 0,
      kills: 0,
      correctGates: 0,
      relics: 0,
      doors: 0,
      puzzles: 0,
      caches: 0,
      barricades: 0,
      traps: 0,
      precisionShots: 0,
      perfectDodges: 0,
      silentDoors: 0,
      bossKills: 0,
    },
    goals: MANSION_GOALS.map((goal) => ({ ...goal, done: false })),
    particles: [],
    player: {
      x: 150,
      y: 180,
      w: 34,
      h: 34,
      hp: 100,
      stamina: 100,
      reserveAmmo: 16,
      loadedAmmo: 6,
      magSize: 6,
      herbs: 1,
      boards: 0,
      lockpicks: 0,
      decoys: 1,
      shotgunShells: 0,
      hasShotgun: false,
      weapon: 'pistol',
      puzzleItems: [],
      reloadTimer: 0,
      flashlight: 100,
      focusing: false,
      score: 0,
      keys: [],
      hasRelic: false,
      aimX: 1,
      aimY: 0,
      fireCooldown: 0,
      dodgeTimer: 0,
      dodgePerfectWindow: 0,
      dodgeCooldown: 0,
      perfectDodgeCooldown: 0,
      invuln: 0,
      actionCooldown: 0,
    },
    doors: DOORS.map((door) => ({ ...door, open: false, pulse: 0 })),
    puzzleStations: PUZZLE_STATIONS.map((station) => ({ ...station, solved: false, pulse: 0 })),
    caches: LOCKED_CACHES.map((cache) => ({ ...cache, open: false, pulse: 0 })),
    barricades: BARRICADES.map((barricade) => ({ ...barricade, hp: 0, maxHp: 5, repaired: false, hitTimer: 0 })),
    traps: TRAPS.map((trap) => ({ ...trap, armed: false, triggered: false, pulse: 0 })),
    items: ITEMS.map((item) => ({ ...item, taken: false })),
    enemies: ENEMIES.map((enemy) => ({
      ...enemy,
      maxHp: enemy.hp,
      type: enemy.hp >= 4 ? 'hunter' : enemy.hp >= 3 ? 'stalker' : 'lurker',
      alert: 0,
      stun: 0,
      flashAwardCooldown: 0,
      targetIndex: 0,
      attackCooldown: 0,
      hitTimer: 0,
      dead: false,
    })),
    boss: {
      isBoss: true,
      active: false,
      dead: false,
      x: 1974,
      y: 1220,
      hp: 18,
      maxHp: 18,
      stun: 0,
      hitTimer: 0,
      attackCooldown: 0,
      summonCooldown: 4,
      phase: 1,
    },
    gates: mode === 'learn' ? buildGates(0) : [],
    result: null,
  };
}

function buildGates(taskIndex) {
  const task = LEARN_TASKS[taskIndex % LEARN_TASKS.length];
  const layout = GATE_LAYOUTS[taskIndex % GATE_LAYOUTS.length];
  return task.options.map((label, index) => ({
    id: `gate-${taskIndex}-${label}`,
    label,
    correct: label === task.answer,
    x: layout.x + index * 146,
    y: layout.y + (index % 2) * 34,
    w: 132,
    h: 86,
    active: true,
  }));
}

function currentTask(game) {
  return LEARN_TASKS[game.taskIndex % LEARN_TASKS.length];
}

function activeGoals(game) {
  return game.goals.filter((goal) => !goal.mode || goal.mode === game.mode);
}

function recordStat(game, stat, amount = 1) {
  game.stats[stat] = (game.stats[stat] || 0) + amount;
  let completedGoal = false;
  activeGoals(game).forEach((goal) => {
    if (goal.stat !== stat || goal.done || game.stats[stat] < goal.target) return;
    goal.done = true;
    completedGoal = true;
    game.player.score += goal.reward;
    game.message = `${goal.label} +${goal.reward}`;
    game.messageTimer = 1.15;
    spawnParticles(game, game.player.x, game.player.y, '#fef3c7', 14);
  });
  return completedGoal;
}

function currentSafeRoom(game) {
  return SAFE_ROOMS.find((room) => rectsOverlap(playerRect(game.player), room));
}

function playerRect(player) {
  return { x: player.x - player.w / 2, y: player.y - player.h / 2, w: player.w, h: player.h };
}

function enemyRect(enemy) {
  return { x: enemy.x - 24, y: enemy.y - 28, w: 48, h: 56 };
}

function bossRect(boss) {
  return { x: boss.x - 42, y: boss.y - 50, w: 84, h: 100 };
}

function isInFlashlight(game, target, rangeBonus = 0) {
  const player = game.player;
  const dx = target.x - player.x;
  const dy = target.y - player.y;
  const dist = Math.hypot(dx, dy);
  const focusRange = player.focusing ? 470 : 295;
  if (dist > focusRange + rangeBonus) return false;
  const facing = Math.atan2(player.aimY, player.aimX);
  const targetAngle = Math.atan2(dy, dx);
  const cone = player.focusing ? 0.58 : 1.05;
  return angleDistance(facing, targetAngle) < cone;
}

function hasRequirement(player, requirement) {
  if (requirement === 'relic') return player.hasRelic;
  return player.keys.includes(requirement);
}

function solidRects(game) {
  return [
    ...WALLS,
    ...game.doors.filter((door) => !door.open).map((door) => ({ x: door.x, y: door.y, w: door.w, h: door.h })),
  ];
}

function collidesWithSolid(game, rect) {
  return solidRects(game).some((solid) => rectsOverlap(rect, solid));
}

function blockingBarricade(game, rect) {
  return game.barricades.find((barricade) => barricade.repaired && barricade.hp > 0 && rectsOverlap(rect, barricade));
}

function hitBarricade(game, barricade, amount = 1) {
  barricade.hp = Math.max(0, barricade.hp - amount);
  barricade.hitTimer = 0.2;
  game.noise = clamp(game.noise + 6, 0, 100);
  if (barricade.hp <= 0) {
    barricade.repaired = false;
    game.dread = clamp(game.dread + 8, 0, 100);
    game.message = `${barricade.label} bricht`;
    game.messageTimer = 0.75;
    spawnParticles(game, barricade.x + barricade.w / 2, barricade.y + barricade.h / 2, '#d6a15f', 18);
  }
}

function spawnParticles(game, x, y, color, count = 8) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + game.elapsed * 0.7;
    const speed = 70 + (i % 5) * 24;
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.55,
      color,
    });
  }
}

function nearPlayer(player, target, radius = 74) {
  return Math.hypot(player.x - target.x, player.y - target.y) <= radius;
}

function damagePlayer(game, amount, knockX = 0, knockY = 0) {
  const player = game.player;
  if (player.invuln > 0) {
    const isPerfectDodge = player.dodgePerfectWindow > 0 && player.perfectDodgeCooldown <= 0;
    if (isPerfectDodge) {
      player.perfectDodgeCooldown = 0.55;
      player.stamina = clamp(player.stamina + 14, 0, 100);
      player.score += 120;
      game.dread = Math.max(8, game.dread - 7);
      game.noise = Math.max(0, game.noise - 10);
      game.screenShake = Math.max(game.screenShake, 0.12);
      const completed = recordStat(game, 'perfectDodges');
      if (!completed) {
        game.message = 'Perfekt ausgewichen';
        game.messageTimer = 0.7;
      }
      spawnParticles(game, player.x, player.y, '#93c5fd', 14);
    }
    return;
  }
  player.hp = clamp(player.hp - amount, 0, 100);
  player.invuln = 0.9;
  player.stamina = Math.max(0, player.stamina - 12);
  player.x = clamp(player.x + knockX, 76, WORLD_W - 76);
  player.y = clamp(player.y + knockY, 76, WORLD_H - 76);
  game.screenShake = 0.22;
  game.message = amount >= 18 ? 'Schwerer Treffer' : 'Getroffen';
  game.messageTimer = 0.65;
  spawnParticles(game, player.x, player.y, '#fb7185', 10);
}

function damageHostile(game, hostile, amount, knockX = 0, knockY = 0) {
  hostile.hp -= amount;
  hostile.hitTimer = 0.2;
  hostile.stun = Math.max(hostile.stun || 0, hostile.isBoss ? 0.12 : 0.28);
  hostile.x += knockX;
  hostile.y += knockY;
  spawnParticles(game, hostile.x, hostile.y, hostile.isBoss ? '#c4b5fd' : '#f87171', hostile.isBoss ? 16 : 10);

  if (hostile.hp > 0) return;

  if (hostile.isBoss) {
    hostile.dead = true;
    hostile.active = false;
    game.player.score += 1300;
    game.dread = Math.max(18, game.dread - 38);
    recordStat(game, 'bossKills');
    game.message = 'Hausmeister faellt - der Ausgang ist frei';
    game.messageTimer = 1.3;
    spawnParticles(game, hostile.x, hostile.y, '#fef3c7', 30);
    return;
  }

  hostile.dead = true;
  game.player.score += 260;
  recordStat(game, 'kills');
  spawnParticles(game, hostile.x, hostile.y, '#fde68a', 18);
}

function updateDoors(game) {
  const player = game.player;
  game.doors.forEach((door) => {
    door.pulse += 0.04;
    if (door.open) return;
    const nearDoor = {
      x: door.x - 24,
      y: door.y - 24,
      w: door.w + 48,
      h: door.h + 48,
    };
    if (!rectsOverlap(playerRect(player), nearDoor)) return;
    if (hasRequirement(player, door.requires)) {
      door.open = true;
      const quietOpen = game.noise < 26 && !player.focusing && player.reloadTimer <= 0;
      player.score += quietOpen ? 330 : 240;
      recordStat(game, 'doors');
      if (quietOpen) {
        const completed = recordStat(game, 'silentDoors');
        game.noise = clamp(game.noise + 4, 0, 100);
        if (!completed) game.message = `${door.label} leise offen`;
      } else {
        game.noise = clamp(game.noise + 16, 0, 100);
        game.dread = clamp(game.dread + 2, 0, 100);
        game.message = `${door.label} geoeffnet`;
      }
      game.messageTimer = 0.8;
      spawnParticles(game, door.x + door.w / 2, door.y + door.h / 2, door.color, 14);
    } else {
      game.message = door.requires === 'relic' ? 'Erst das Siegel finden' : `${door.label}-Karte fehlt`;
      game.messageTimer = Math.max(game.messageTimer, 0.35);
    }
  });
}

function updateSafeRooms(game, dt) {
  const room = currentSafeRoom(game);
  if (!room) {
    game.safeRoomId = null;
    game.safeRoomTimer = 0;
    return;
  }

  if (game.safeRoomId !== room.id) {
    game.safeRoomId = room.id;
    game.safeRoomTimer = 0;
    game.message = `${room.label}: kurz durchatmen`;
    game.messageTimer = 1.1;
    if (!game.visitedSafeRooms.includes(room.id)) {
      game.visitedSafeRooms.push(room.id);
      recordStat(game, 'safeRooms');
    }
  }

  game.safeRoomTimer += dt;
  game.noise = Math.max(0, game.noise - 42 * dt);
  game.dread = Math.max(8, game.dread - 18 * dt);
  game.player.stamina = clamp(game.player.stamina + 30 * dt, 0, 100);
  game.player.flashlight = clamp(game.player.flashlight + 17 * dt, 0, 100);
  if (game.player.hp < 72 && game.safeRoomTimer > 0.7) {
    game.player.hp = clamp(game.player.hp + 4 * dt, 0, 72);
  }
  if (game.player.reloadTimer > 0) {
    const wasReloading = game.player.reloadTimer > 0;
    game.player.reloadTimer = Math.max(0, game.player.reloadTimer - 0.55 * dt);
    if (wasReloading && game.player.reloadTimer <= 0) finishReload(game);
  }
}

function moveAxis(game, axis, amount) {
  if (!amount) return;
  const player = game.player;
  player[axis] += amount;
  if (collidesWithSolid(game, playerRect(player))) player[axis] -= amount;
}

function updatePlayer(game, input, dt) {
  const player = game.player;
  const wasReloading = player.reloadTimer > 0;
  player.fireCooldown = Math.max(0, player.fireCooldown - dt);
  player.dodgeCooldown = Math.max(0, player.dodgeCooldown - dt);
  player.dodgePerfectWindow = Math.max(0, player.dodgePerfectWindow - dt);
  player.perfectDodgeCooldown = Math.max(0, player.perfectDodgeCooldown - dt);
  player.invuln = Math.max(0, player.invuln - dt);
  player.reloadTimer = Math.max(0, player.reloadTimer - dt);
  player.actionCooldown = Math.max(0, player.actionCooldown - dt);
  if (wasReloading && player.reloadTimer <= 0) finishReload(game);
  player.focusing = input.focus && player.flashlight > 0;
  if (player.focusing) player.flashlight = Math.max(0, player.flashlight - 10 * dt);
  else player.flashlight = clamp(player.flashlight + 5 * dt, 0, 100);
  if (input.reload) reloadWeapon(game);

  const axisX = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const axisY = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  const len = Math.hypot(axisX, axisY) || 1;
  const nx = axisX / len;
  const ny = axisY / len;
  if (axisX || axisY) {
    player.aimX = nx;
    player.aimY = ny;
  }

  const running = input.run && player.stamina > 8 && !player.focusing && player.reloadTimer <= 0;
  const speed = player.reloadTimer > 0 ? 92 : player.focusing ? 116 : running ? 232 : 158;
  if (running && (axisX || axisY)) player.stamina = Math.max(0, player.stamina - 28 * dt);
  else player.stamina = clamp(player.stamina + 20 * dt, 0, 100);
  if (running && (axisX || axisY)) game.noise = clamp(game.noise + 22 * dt, 0, 100);

  if (input.dodge && player.dodgeCooldown <= 0 && player.stamina >= 24) {
    player.dodgeTimer = 0.18;
    player.dodgePerfectWindow = 0.34;
    player.dodgeCooldown = 0.9;
    player.invuln = 0.25;
    player.stamina -= 24;
    spawnParticles(game, player.x, player.y, '#93c5fd', 8);
  }

  const dodgeBoost = player.dodgeTimer > 0 ? 2.25 : 1;
  player.dodgeTimer = Math.max(0, player.dodgeTimer - dt);
  moveAxis(game, 'x', nx * speed * dodgeBoost * dt);
  moveAxis(game, 'y', ny * speed * dodgeBoost * dt);
  player.x = clamp(player.x, 72, WORLD_W - 72);
  player.y = clamp(player.y, 72, WORLD_H - 72);
}

function reloadWeapon(game) {
  const player = game.player;
  if (player.reloadTimer > 0 || player.loadedAmmo >= player.magSize || player.reserveAmmo <= 0) return false;
  const enemiesNear = game.enemies.some((enemy) => !enemy.dead && distance(enemy, player) < 280);
  const bossNear = game.boss.active && !game.boss.dead && distance(game.boss, player) < 360;
  const dangerReload = !game.safeRoomId && (enemiesNear || bossNear || game.dread > 68);
  player.reloadTimer = game.safeRoomId ? 0.68 : dangerReload ? 1.08 : 0.82;
  game.noise = clamp(game.noise + (dangerReload ? 18 : 8), 0, 100);
  if (dangerReload) {
    player.stamina = Math.max(0, player.stamina - 8);
    game.dread = clamp(game.dread + 6, 0, 100);
  }
  game.message = dangerReload ? 'Panik-Reload' : 'Nachladen';
  game.messageTimer = 0.55;
  return true;
}

function finishReload(game) {
  const player = game.player;
  const needed = player.magSize - player.loadedAmmo;
  const taken = Math.min(needed, player.reserveAmmo);
  if (taken <= 0) return;
  player.loadedAmmo += taken;
  player.reserveAmmo -= taken;
  game.message = `Magazin ${player.loadedAmmo}/${player.magSize}`;
  game.messageTimer = 0.55;
}

function consumeHerb(game) {
  const player = game.player;
  if (player.actionCooldown > 0) return;
  player.actionCooldown = 0.28;
  if (player.herbs <= 0) {
    game.message = 'Kein Kraut';
    game.messageTimer = 0.55;
    return;
  }
  if (player.hp >= 98) {
    game.message = 'Schon stabil';
    game.messageTimer = 0.55;
    return;
  }
  player.herbs -= 1;
  player.hp = clamp(player.hp + 38, 0, 100);
  player.score += 70;
  game.dread = Math.max(8, game.dread - 6);
  game.message = 'Kraut benutzt';
  game.messageTimer = 0.7;
  spawnParticles(game, player.x, player.y, '#86efac', 14);
}

function cycleWeapon(game) {
  const player = game.player;
  if (player.actionCooldown > 0) return;
  player.actionCooldown = 0.22;
  if (!player.hasShotgun) {
    game.message = 'Nur Pistole';
    game.messageTimer = 0.55;
    return;
  }
  player.weapon = player.weapon === 'pistol' ? 'shotgun' : 'pistol';
  game.message = player.weapon === 'shotgun' ? 'Schrotflinte bereit' : 'Pistole bereit';
  game.messageTimer = 0.55;
}

function throwLure(game) {
  const player = game.player;
  if (player.actionCooldown > 0) return;
  player.actionCooldown = 0.35;
  if (player.decoys <= 0) {
    game.message = 'Keine Flasche';
    game.messageTimer = 0.55;
    return;
  }
  player.decoys -= 1;
  game.lure = {
    x: clamp(player.x + player.aimX * 210, 80, WORLD_W - 80),
    y: clamp(player.y + player.aimY * 210, 80, WORLD_H - 80),
    timer: 4.2,
    pulse: 0,
  };
  game.noise = clamp(game.noise + 36, 0, 100);
  game.message = 'Flasche geworfen';
  game.messageTimer = 0.6;
  spawnParticles(game, game.lure.x, game.lure.y, '#fef3c7', 10);
}

function openCache(game, cache) {
  const player = game.player;
  if (cache.open) return true;
  if (player.lockpicks <= 0) {
    game.message = `${cache.label}: Dietrich fehlt`;
    game.messageTimer = 0.65;
    return false;
  }
  player.lockpicks -= 1;
  cache.open = true;
  recordStat(game, 'caches');
  player.score += 220;
  if (cache.reward === 'shotgun') {
    player.hasShotgun = true;
    player.weapon = 'shotgun';
    player.shotgunShells = Math.max(player.shotgunShells, 4);
    game.message = 'Waffenkoffer offen: Schrotflinte';
  } else if (cache.reward === 'medicine') {
    player.herbs = Math.min(5, player.herbs + 2);
    player.flashlight = 100;
    game.message = 'Medizinschrank offen: Kraeuter';
  } else {
    player.reserveAmmo = Math.min(30, player.reserveAmmo + 10);
    player.shotgunShells = Math.min(12, player.shotgunShells + 2);
    game.message = 'Munitionskiste offen';
  }
  game.messageTimer = 0.85;
  spawnParticles(game, cache.x, cache.y, cache.color, 18);
  return true;
}

function solvePuzzleStation(game, station) {
  const player = game.player;
  if (station.solved) return true;
  if (!player.puzzleItems.includes(station.requires)) {
    game.message = `${station.label}: ${station.requires.toUpperCase()} fehlt`;
    game.messageTimer = 0.65;
    return false;
  }
  station.solved = true;
  player.score += 340;
  recordStat(game, 'puzzles');
  game.dread = Math.max(8, game.dread - 14);
  game.noise = Math.max(0, game.noise - 20);
  if (station.id === 'fuse-box') player.flashlight = 100;
  if (station.id === 'boiler') {
    player.reserveAmmo = Math.min(30, player.reserveAmmo + 4);
    game.doors.find((door) => door.id === 'red-door').pulse = 3;
  }
  if (station.id === 'moon-altar') {
    const archiveDoor = game.doors.find((door) => door.id === 'archive-door');
    if (archiveDoor) archiveDoor.open = true;
  }
  game.message = station.reward;
  game.messageTimer = 0.9;
  spawnParticles(game, station.x, station.y, station.color, 22);
  return true;
}

function repairBarricade(game, barricade) {
  const player = game.player;
  if (barricade.repaired && barricade.hp > 0) {
    game.message = `${barricade.label} haelt`;
    game.messageTimer = 0.55;
    return true;
  }
  if (player.boards <= 0) {
    game.message = 'Keine Bretter';
    game.messageTimer = 0.55;
    return false;
  }
  player.boards -= 1;
  barricade.repaired = true;
  barricade.hp = barricade.maxHp;
  barricade.hitTimer = 0.25;
  player.score += 120;
  recordStat(game, 'barricades');
  game.message = `${barricade.label} verbarrikadiert`;
  game.messageTimer = 0.7;
  spawnParticles(game, barricade.x + barricade.w / 2, barricade.y + barricade.h / 2, '#d6a15f', 14);
  return true;
}

function armTrap(game, trap) {
  if (trap.triggered) {
    game.message = `${trap.label} ist verbraucht`;
    game.messageTimer = 0.55;
    return false;
  }
  if (trap.armed) {
    game.message = `${trap.label} ist scharf`;
    game.messageTimer = 0.55;
    return true;
  }
  trap.armed = true;
  game.player.score += 100;
  game.message = `${trap.label} gespannt`;
  game.messageTimer = 0.65;
  spawnParticles(game, trap.x, trap.y, '#fef3c7', 10);
  return true;
}

function interact(game) {
  const player = game.player;
  if (player.actionCooldown > 0) return;
  player.actionCooldown = 0.32;

  const station = game.puzzleStations.find((candidate) => nearPlayer(player, candidate, 82) && !candidate.solved);
  if (station) {
    solvePuzzleStation(game, station);
    return;
  }

  const cache = game.caches.find((candidate) => nearPlayer(player, candidate, 80) && !candidate.open);
  if (cache) {
    openCache(game, cache);
    return;
  }

  const barricade = game.barricades.find((candidate) => {
    const center = { x: candidate.x + candidate.w / 2, y: candidate.y + candidate.h / 2 };
    return nearPlayer(player, center, 86) && (!candidate.repaired || candidate.hp <= 0);
  });
  if (barricade) {
    repairBarricade(game, barricade);
    return;
  }

  const trap = game.traps.find((candidate) => nearPlayer(player, candidate, candidate.radius + 18) && !candidate.triggered && !candidate.armed);
  if (trap) {
    armTrap(game, trap);
    return;
  }

  game.message = 'Nichts zum Benutzen';
  game.messageTimer = 0.5;
}

function fireWeapon(game) {
  const player = game.player;
  if (player.fireCooldown > 0 || player.reloadTimer > 0) return;

  const usingShotgun = player.weapon === 'shotgun' && player.hasShotgun;
  player.fireCooldown = usingShotgun ? 0.74 : 0.22;
  if (player.flashlight <= 0 && player.focusing) {
    game.message = 'Lampe leer';
    game.messageTimer = 0.5;
    return;
  }
  if (usingShotgun) {
    if (player.shotgunShells <= 0) {
      game.message = 'Keine Schrotpatronen';
      game.messageTimer = 0.55;
      return;
    }
    player.shotgunShells -= 1;
  } else {
    if (player.loadedAmmo <= 0) {
      if (player.reserveAmmo > 0) reloadWeapon(game);
      else {
        game.message = 'Keine Munition';
        game.messageTimer = 0.5;
      }
      return;
    }
    player.loadedAmmo -= 1;
  }
  game.noise = clamp(game.noise + (usingShotgun ? 68 : 45), 0, 100);
  game.dread = clamp(game.dread + (usingShotgun ? 5 : 3), 0, 100);
  game.screenShake = usingShotgun ? 0.17 : 0.09;

  const hostiles = [
    ...game.enemies.filter((enemy) => !enemy.dead),
    ...(game.boss.active && !game.boss.dead ? [game.boss] : []),
  ];

  if (usingShotgun) {
    let hits = 0;
    let precisionHits = 0;
    hostiles.forEach((hostile) => {
      const dx = hostile.x - player.x;
      const dy = hostile.y - player.y;
      const along = dx * player.aimX + dy * player.aimY;
      if (along < 0 || along > 330) return;
      const perp = Math.abs(dx * player.aimY - dy * player.aimX);
      const cone = Math.max(34, 108 - along * 0.16);
      if (perp > cone) return;
      const precisionHit = player.focusing && isInFlashlight(game, hostile, 52) && along < 255;
      if (precisionHit) {
        precisionHits += 1;
        player.flashlight = Math.max(0, player.flashlight - 5);
      }
      const knock = hostile.isBoss ? 0.14 : 0.42;
      damageHostile(game, hostile, precisionHit ? 5 : player.focusing ? 4 : 3, player.aimX * along * knock, player.aimY * along * knock);
      hits += 1;
    });
    if (hits === 0) spawnParticles(game, player.x + player.aimX * 106, player.y + player.aimY * 106, '#fef3c7', 8);
    else {
      player.score += 150 * hits + precisionHits * 120;
      let completed = false;
      for (let i = 0; i < precisionHits; i += 1) completed = recordStat(game, 'precisionShots') || completed;
      if (!completed) {
        game.message = precisionHits ? `${precisionHits} Fokus-Schrot` : `${hits} Treffer mit Schrot`;
        game.messageTimer = 0.55;
      }
    }
    return;
  }

  let best = null;
  let bestAlong = Infinity;
  hostiles.forEach((hostile) => {
    const dx = hostile.x - player.x;
    const dy = hostile.y - player.y;
    const along = dx * player.aimX + dy * player.aimY;
    if (along < 0 || along > (hostile.isBoss ? 500 : 420)) return;
    const perp = Math.abs(dx * player.aimY - dy * player.aimX);
    const precision = hostile.isBoss ? (player.focusing ? 70 : 58) : (player.focusing ? 42 : 32);
    if (perp < precision && along < bestAlong) {
      best = hostile;
      bestAlong = along;
    }
  });

  if (best) {
    const precisionHit = player.focusing && isInFlashlight(game, best, 40);
    const damage = precisionHit ? 2 : 1;
    best.alert = 2.5;
    player.score += precisionHit ? 220 : 90 * damage;
    if (precisionHit) {
      player.flashlight = Math.max(0, player.flashlight - 4);
      game.dread = Math.max(8, game.dread - 2.5);
      const completed = recordStat(game, 'precisionShots');
      if (!completed) {
        game.message = best.isBoss ? 'Fokus-Treffer am Boss' : 'Praezisions-Treffer';
        game.messageTimer = 0.55;
      }
    }
    damageHostile(game, best, damage);
  } else {
    spawnParticles(game, player.x + player.aimX * 84, player.y + player.aimY * 84, '#facc15', 4);
  }
}

function updateItems(game) {
  const player = game.player;
  game.items.forEach((item) => {
    if (item.taken) return;
    const itemRect = { x: item.x - 20, y: item.y - 20, w: 40, h: 40 };
    if (!rectsOverlap(playerRect(player), itemRect)) return;
    item.taken = true;
    if (item.kind === 'key') {
      player.keys.push(item.key);
      player.score += 300;
      recordStat(game, 'keys');
      game.message = `${item.label} genommen`;
    } else if (item.kind === 'ammo') {
      const before = player.reserveAmmo;
      player.reserveAmmo = Math.min(30, player.reserveAmmo + item.amount);
      player.score += 110;
      game.message = player.reserveAmmo > before ? `+${player.reserveAmmo - before} Reserve` : 'Tasche voll';
    } else if (item.kind === 'shells') {
      player.shotgunShells = Math.min(12, player.shotgunShells + item.amount);
      player.score += 140;
      game.message = `+${item.amount} Schrot`;
    } else if (item.kind === 'shotgun') {
      player.hasShotgun = true;
      player.weapon = 'shotgun';
      player.shotgunShells = Math.max(player.shotgunShells, 3);
      player.score += 360;
      game.message = 'Schrotflinte ausgeruestet';
    } else if (item.kind === 'boards') {
      player.boards = Math.min(6, player.boards + item.amount);
      player.score += 90;
      game.message = `+${item.amount} Bretter`;
    } else if (item.kind === 'lockpick') {
      player.lockpicks = Math.min(4, player.lockpicks + item.amount);
      player.score += 90;
      game.message = 'Dietrich genommen';
    } else if (item.kind === 'decoy') {
      player.decoys = Math.min(4, player.decoys + item.amount);
      player.score += 80;
      game.message = 'Ablenk-Flasche';
    } else if (item.kind === 'puzzle') {
      if (!player.puzzleItems.includes(item.puzzle)) player.puzzleItems.push(item.puzzle);
      player.score += 160;
      game.message = `${item.label} im Inventar`;
    } else if (item.kind === 'herb') {
      player.herbs = Math.min(5, player.herbs + item.amount);
      player.score += 120;
      game.message = 'Kraut eingesteckt';
    } else if (item.kind === 'relic') {
      player.hasRelic = true;
      game.boss.active = true;
      game.noise = clamp(game.noise + 55, 0, 100);
      game.dread = clamp(game.dread + 34, 0, 100);
      game.enemies.forEach((enemy) => {
        if (!enemy.dead) enemy.alert = Math.max(enemy.alert, 5);
      });
      player.score += 600;
      recordStat(game, 'relics');
      game.message = 'Siegel gefunden - der Hausmeister erwacht';
    }
    game.messageTimer = 0.8;
    spawnParticles(game, item.x, item.y, item.color, 14);
  });
}

function updateEnemies(game, dt) {
  const player = game.player;
  game.enemies.forEach((enemy) => {
    if (enemy.dead) return;
    enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
    enemy.hitTimer = Math.max(0, enemy.hitTimer - dt);
    enemy.alert = Math.max(0, enemy.alert - dt);
    enemy.stun = Math.max(0, enemy.stun - dt);
    enemy.flashAwardCooldown = Math.max(0, enemy.flashAwardCooldown - dt);

    const playerDistance = distance(enemy, player);
    if (game.noise > 42 && playerDistance < 560) enemy.alert = Math.max(enemy.alert, 1.6);
    if (isInFlashlight(game, enemy) && player.focusing) {
      enemy.alert = Math.max(enemy.alert, 0.9);
      enemy.stun = Math.max(enemy.stun, enemy.type === 'hunter' ? 0.08 : 0.18);
      if (enemy.flashAwardCooldown <= 0) {
        enemy.flashAwardCooldown = 1.15;
        recordStat(game, 'flashStuns');
        spawnParticles(game, enemy.x, enemy.y, '#93c5fd', 8);
      }
    }
    const lureActive = game.lure && game.lure.timer > 0 && distance(enemy, game.lure) < 760;
    const chasing = lureActive || playerDistance < 300 + game.noise * 3.1 || enemy.alert > 0 || player.hasRelic;
    const target = lureActive ? game.lure : chasing ? player : enemy.patrol[enemy.targetIndex];
    const dx = target.x - enemy.x;
    const dy = target.y - enemy.y;
    const len = Math.hypot(dx, dy) || 1;
    const baseSpeed = enemy.type === 'hunter' ? 116 : enemy.type === 'stalker' ? 96 : 82;
    const dreadBoost = 1 + game.dread / 360 + (player.hasRelic ? 0.1 : 0);
    const speed = (chasing ? baseSpeed : 54) * dreadBoost * (enemy.stun > 0 ? 0.48 : 1);
    const oldX = enemy.x;
    const oldY = enemy.y;
    enemy.x += (dx / len) * speed * dt;
    if (collidesWithSolid(game, enemyRect(enemy))) enemy.x = oldX;
    const barricadeX = blockingBarricade(game, enemyRect(enemy));
    if (barricadeX) {
      enemy.x = oldX;
      if (enemy.attackCooldown <= 0) {
        enemy.attackCooldown = 0.7;
        hitBarricade(game, barricadeX, enemy.type === 'hunter' ? 2 : 1);
      }
    }
    enemy.y += (dy / len) * speed * dt;
    if (collidesWithSolid(game, enemyRect(enemy))) enemy.y = oldY;
    const barricadeY = blockingBarricade(game, enemyRect(enemy));
    if (barricadeY) {
      enemy.y = oldY;
      if (enemy.attackCooldown <= 0) {
        enemy.attackCooldown = 0.7;
        hitBarricade(game, barricadeY, enemy.type === 'hunter' ? 2 : 1);
      }
    }
    if (!chasing && distance(enemy, target) < 20) enemy.targetIndex = (enemy.targetIndex + 1) % enemy.patrol.length;

    game.traps.forEach((trap) => {
      if (!trap.armed || trap.triggered || distance(enemy, trap) > trap.radius) return;
      trap.triggered = true;
      trap.armed = false;
      enemy.stun = Math.max(enemy.stun, 1.15);
      damageHostile(game, enemy, enemy.type === 'hunter' ? 3 : 2);
      recordStat(game, 'traps');
      game.screenShake = Math.max(game.screenShake, 0.16);
      game.message = `${trap.label} trifft`;
      game.messageTimer = 0.8;
      spawnParticles(game, trap.x, trap.y, '#fef3c7', 24);
    });
    if (enemy.dead) return;

    if (rectsOverlap(playerRect(player), enemyRect(enemy)) && enemy.attackCooldown <= 0) {
      enemy.attackCooldown = 0.95;
      const pushX = (player.x - enemy.x) * 0.18;
      const pushY = (player.y - enemy.y) * 0.18;
      damagePlayer(game, enemy.type === 'hunter' ? 22 : enemy.type === 'stalker' ? 17 : 12, pushX, pushY);
    }
  });
}

function updateBoss(game, dt) {
  const boss = game.boss;
  if (!boss.active || boss.dead) return;
  const player = game.player;
  boss.attackCooldown = Math.max(0, boss.attackCooldown - dt);
  boss.hitTimer = Math.max(0, boss.hitTimer - dt);
  boss.stun = Math.max(0, boss.stun - dt);
  boss.summonCooldown = Math.max(0, boss.summonCooldown - dt);
  boss.phase = boss.hp <= boss.maxHp * 0.5 ? 2 : 1;

  if (isInFlashlight(game, boss, 110) && player.focusing) {
    boss.stun = Math.max(boss.stun, 0.08);
    game.dread = Math.max(8, game.dread - 2 * dt);
  }

  const lureActive = game.lure && game.lure.timer > 0 && distance(boss, game.lure) < 820;
  const target = lureActive ? game.lure : player;
  const dx = target.x - boss.x;
  const dy = target.y - boss.y;
  const len = Math.hypot(dx, dy) || 1;
  const oldX = boss.x;
  const oldY = boss.y;
  const speed = (boss.phase === 2 ? 128 : 104) * (boss.stun > 0 ? 0.55 : 1);
  boss.x += (dx / len) * speed * dt;
  if (collidesWithSolid(game, bossRect(boss))) boss.x = oldX;
  boss.y += (dy / len) * speed * dt;
  if (collidesWithSolid(game, bossRect(boss))) boss.y = oldY;

  const barricade = blockingBarricade(game, bossRect(boss));
  if (barricade) {
    boss.x = oldX;
    boss.y = oldY;
    if (boss.attackCooldown <= 0) {
      boss.attackCooldown = 0.85;
      hitBarricade(game, barricade, boss.phase === 2 ? 3 : 2);
      game.screenShake = Math.max(game.screenShake, 0.18);
    }
  }

  game.traps.forEach((trap) => {
    if (!trap.armed || trap.triggered || distance(boss, trap) > trap.radius + 22) return;
    trap.triggered = true;
    trap.armed = false;
    boss.stun = Math.max(boss.stun, 1.05);
    damageHostile(game, boss, 4);
    recordStat(game, 'traps');
    game.screenShake = Math.max(game.screenShake, 0.2);
    game.message = `${trap.label} stoppt den Hausmeister`;
    game.messageTimer = 0.9;
    spawnParticles(game, trap.x, trap.y, '#fef3c7', 28);
  });

  if (!boss.dead && rectsOverlap(playerRect(player), bossRect(boss)) && boss.attackCooldown <= 0) {
    boss.attackCooldown = boss.phase === 2 ? 0.75 : 1;
    const pushX = (player.x - boss.x) * 0.24;
    const pushY = (player.y - boss.y) * 0.24;
    damagePlayer(game, boss.phase === 2 ? 27 : 22, pushX, pushY);
  }

  if (boss.summonCooldown <= 0 && boss.phase === 2) {
    boss.summonCooldown = 5.8;
    const wounded = game.enemies.find((enemy) => enemy.dead);
    if (wounded) {
      wounded.dead = false;
      wounded.hp = Math.max(1, Math.floor(wounded.maxHp * 0.7));
      wounded.x = clamp(boss.x - 140 + Math.random() * 280, 80, WORLD_W - 80);
      wounded.y = clamp(boss.y - 110 + Math.random() * 220, 80, WORLD_H - 80);
      wounded.alert = 4;
      wounded.stun = 0.35;
      game.message = 'Der Hausmeister ruft Schatten';
      game.messageTimer = 0.9;
      spawnParticles(game, wounded.x, wounded.y, '#c084fc', 18);
    }
  }
}

function updateLearnGates(game, dt) {
  if (game.mode !== 'learn') return;
  game.gateCooldown = Math.max(0, game.gateCooldown - dt);
  if (game.gateCooldown > 0) return;
  const player = game.player;
  game.gates.forEach((gate) => {
    if (!gate.active) return;
    if (!rectsOverlap(playerRect(player), gate)) return;
    const task = currentTask(game);
    gate.active = false;
    if (gate.correct) {
      player.score += 420;
      player.reserveAmmo = Math.min(30, player.reserveAmmo + 2);
      player.stamina = 100;
      player.flashlight = clamp(player.flashlight + 18, 0, 100);
      game.noise = Math.max(0, game.noise - 18);
      game.dread = Math.max(0, game.dread - 10);
      recordStat(game, 'correctGates');
      game.taskIndex += 1;
      game.gates = buildGates(game.taskIndex);
      game.message = `${task.subject}: ${task.word} -> ${task.answer}`;
      spawnParticles(game, gate.x + gate.w / 2, gate.y + gate.h / 2, '#5eead4', 18);
    } else {
      damagePlayer(game, 15);
      game.noise = clamp(game.noise + 25, 0, 100);
      game.dread = clamp(game.dread + 14, 0, 100);
      game.message = `${task.word} ist nicht ${gate.label}`;
    }
    game.messageTimer = 1.1;
    game.gateCooldown = 0.9;
  });
}

function updateParticles(game, dt) {
  game.particles = game.particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * dt,
      y: particle.y + particle.vy * dt,
      life: particle.life - dt,
    }))
    .filter((particle) => particle.life > 0);
}

function updateWorldDevices(game, dt) {
  if (game.lure) {
    game.lure.timer -= dt;
    game.lure.pulse += dt * 8;
    if (game.lure.timer <= 0) game.lure = null;
  }
  game.puzzleStations.forEach((station) => {
    station.pulse += dt * (station.solved ? 2.5 : 4.5);
  });
  game.caches.forEach((cache) => {
    cache.pulse += dt * (cache.open ? 2 : 4);
  });
  game.barricades.forEach((barricade) => {
    barricade.hitTimer = Math.max(0, barricade.hitTimer - dt);
  });
  game.traps.forEach((trap) => {
    trap.pulse += dt * 5;
  });
}

function updateCamera(game) {
  const player = game.player;
  game.screenShake = Math.max(0, game.screenShake - 0.016);
  game.cameraX = clamp(player.x - CENTER_X, 0, WORLD_W - WIDTH);
  game.cameraY = clamp(player.y - CENTER_Y, 0, WORLD_H - HEIGHT);
}

function updateGame(game, input, dt, onFinish) {
  if (game.phase !== 'run') return;
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.noise = Math.max(0, game.noise - dt * 15);
  game.dread = clamp(
    game.dread
      + (game.noise > 58 ? 7 * dt : -2.2 * dt)
      + (game.player.hasRelic ? 6 * dt : 0)
      + (game.player.hp < 34 ? 2.5 * dt : 0),
    8,
    100,
  );
  updateDoors(game);
  updatePlayer(game, input, dt);
  updateSafeRooms(game, dt);
  if (input.fire) fireWeapon(game);
  if (input.use) {
    interact(game);
    input.use = false;
  }
  if (input.heal) {
    consumeHerb(game);
    input.heal = false;
  }
  if (input.lure) {
    throwLure(game);
    input.lure = false;
  }
  if (input.weapon) {
    cycleWeapon(game);
    input.weapon = false;
  }
  updateItems(game);
  updateWorldDevices(game, dt);
  updateEnemies(game, dt);
  updateBoss(game, dt);
  updateLearnGates(game, dt);
  updateParticles(game, dt);
  updateCamera(game);

  const exit = { x: 2072, y: 1180, w: 96, h: 170 };
  if (rectsOverlap(playerRect(game.player), exit) && game.player.hasRelic && (!game.boss.active || game.boss.dead)) {
    game.phase = 'result';
    game.result = {
      title: 'Villa verlassen',
      score: game.player.score + 1600 + Math.round(game.player.hp * 8),
      hp: Math.round(game.player.hp),
    };
    onFinish(game.result);
  } else if (rectsOverlap(playerRect(game.player), exit) && game.player.hasRelic) {
    game.message = 'Der Hausmeister blockiert den Ausgang';
    game.messageTimer = Math.max(game.messageTimer, 0.45);
  } else if (game.player.hp <= 0) {
    game.phase = 'result';
    game.result = {
      title: 'Run verloren',
      score: game.player.score,
      hp: 0,
    };
    onFinish(game.result);
  }
}

function worldToScreen(game, x, y) {
  const shake = game.screenShake > 0 ? Math.sin(game.elapsed * 80) * game.screenShake * 16 : 0;
  return { x: x - game.cameraX + shake, y: y - game.cameraY - shake * 0.5 };
}

function drawBackground(ctx, game) {
  const floor = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  floor.addColorStop(0, '#18202c');
  floor.addColorStop(0.55, '#253348');
  floor.addColorStop(1, '#111827');
  ctx.fillStyle = floor;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.translate(-game.cameraX % 64, -game.cameraY % 64);
  ctx.strokeStyle = 'rgba(148,163,184,.08)';
  ctx.lineWidth = 1;
  for (let x = -64; x < WIDTH + 64; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, -64);
    ctx.lineTo(x, HEIGHT + 64);
    ctx.stroke();
  }
  for (let y = -64; y < HEIGHT + 64; y += 64) {
    ctx.beginPath();
    ctx.moveTo(-64, y);
    ctx.lineTo(WIDTH + 64, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSafeRooms(ctx, game) {
  SAFE_ROOMS.forEach((room) => {
    const p = worldToScreen(game, room.x, room.y);
    if (p.x + room.w < -80 || p.x > WIDTH + 80 || p.y + room.h < -80 || p.y > HEIGHT + 80) return;
    const active = game.safeRoomId === room.id;
    ctx.save();
    ctx.globalAlpha = active ? 0.82 : 0.46;
    ctx.shadowColor = active ? '#5eead4' : 'transparent';
    ctx.shadowBlur = active ? 28 : 0;
    ctx.fillStyle = active ? 'rgba(20,184,166,.18)' : 'rgba(15,23,42,.32)';
    drawRoundedRect(ctx, p.x, p.y, room.w, room.h, 22);
    ctx.fill();
    ctx.strokeStyle = active ? '#67e8f9' : 'rgba(125,211,252,.24)';
    ctx.lineWidth = active ? 4 : 2;
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = active ? '#cffafe' : '#7dd3fc';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(room.label.toUpperCase(), p.x + room.w / 2, p.y + 28);
    ctx.restore();
  });
}

function drawMap(ctx, game) {
  WALLS.forEach((wall) => {
    const p = worldToScreen(game, wall.x, wall.y);
    if (p.x + wall.w < -80 || p.x > WIDTH + 80 || p.y + wall.h < -80 || p.y > HEIGHT + 80) return;
    ctx.fillStyle = '#0f172a';
    drawRoundedRect(ctx, p.x, p.y, wall.w, wall.h, 5);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.06)';
    ctx.fillRect(p.x + 5, p.y + 5, Math.max(0, wall.w - 10), 5);
  });

  game.doors.forEach((door) => {
    const p = worldToScreen(game, door.x, door.y);
    if (p.x + door.w < -80 || p.x > WIDTH + 80 || p.y + door.h < -80 || p.y > HEIGHT + 80) return;
    ctx.save();
    ctx.globalAlpha = door.open ? 0.25 : 1;
    ctx.fillStyle = door.open ? 'rgba(148,163,184,.22)' : door.color;
    ctx.shadowColor = door.color;
    ctx.shadowBlur = door.open ? 0 : 18;
    drawRoundedRect(ctx, p.x, p.y, door.w, door.h, 6);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#020617';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.save();
    ctx.translate(p.x + door.w / 2, p.y + door.h / 2);
    if (door.h > door.w) ctx.rotate(-Math.PI / 2);
    ctx.fillText(door.open ? 'OFFEN' : door.label, 0, 0);
    ctx.restore();
    ctx.restore();
  });
}

function drawItems(ctx, game) {
  game.items.forEach((item) => {
    if (item.taken) return;
    const p = worldToScreen(game, item.x, item.y + Math.sin(game.elapsed * 4 + item.x) * 4);
    if (p.x < -60 || p.x > WIDTH + 60 || p.y < -60 || p.y > HEIGHT + 60) return;
    ctx.save();
    ctx.shadowColor = item.color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = item.color;
    if (item.kind === 'herb') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#052e16';
      ctx.fillRect(p.x - 4, p.y - 13, 8, 26);
      ctx.fillRect(p.x - 13, p.y - 4, 26, 8);
    } else if (item.kind === 'boards') {
      ctx.save();
      ctx.rotate(-0.22);
      drawRoundedRect(ctx, p.x - 22, p.y - 5, 44, 10, 4);
      ctx.fill();
      ctx.rotate(0.44);
      drawRoundedRect(ctx, p.x - 22, p.y - 5, 44, 10, 4);
      ctx.fill();
      ctx.restore();
    } else if (item.kind === 'ammo') {
      drawRoundedRect(ctx, p.x - 18, p.y - 12, 36, 24, 6);
      ctx.fill();
      ctx.fillStyle = '#451a03';
      ctx.fillRect(p.x - 10, p.y - 4, 20, 8);
    } else if (item.kind === 'shells') {
      ctx.fillStyle = '#fef3c7';
      drawRoundedRect(ctx, p.x - 18, p.y - 14, 36, 28, 7);
      ctx.fill();
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(p.x - 11, p.y - 8, 7, 16);
      ctx.fillRect(p.x + 3, p.y - 8, 7, 16);
    } else if (item.kind === 'lockpick') {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x - 18, p.y + 10);
      ctx.lineTo(p.x + 15, p.y - 10);
      ctx.lineTo(p.x + 22, p.y - 2);
      ctx.stroke();
    } else if (item.kind === 'decoy') {
      ctx.fillStyle = '#fef3c7';
      drawRoundedRect(ctx, p.x - 9, p.y - 20, 18, 40, 7);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(p.x - 5, p.y - 22, 10, 7);
    } else if (item.kind === 'shotgun') {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x - 24, p.y + 12);
      ctx.lineTo(p.x + 22, p.y - 12);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 20);
      ctx.lineTo(p.x + 19, p.y);
      ctx.lineTo(p.x, p.y + 20);
      ctx.lineTo(p.x - 19, p.y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.shadowColor = 'transparent';
    ctx.restore();
  });
}

function drawPuzzleStations(ctx, game) {
  game.puzzleStations.forEach((station) => {
    const p = worldToScreen(game, station.x, station.y);
    if (p.x < -80 || p.x > WIDTH + 80 || p.y < -80 || p.y > HEIGHT + 80) return;
    ctx.save();
    const pulse = 0.5 + Math.sin(station.pulse) * 0.18;
    ctx.shadowColor = station.solved ? '#5eead4' : station.color;
    ctx.shadowBlur = station.solved ? 24 : 14;
    ctx.fillStyle = station.solved ? 'rgba(20,184,166,.78)' : 'rgba(15,23,42,.86)';
    drawRoundedRect(ctx, p.x - 34, p.y - 28, 68, 56, 14);
    ctx.fill();
    ctx.strokeStyle = station.solved ? '#ccfbf1' : station.color;
    ctx.lineWidth = station.solved ? 4 : 2 + pulse;
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = station.solved ? '#ecfeff' : '#e2e8f0';
    ctx.font = '900 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(station.solved ? 'OK' : station.requires.toUpperCase(), p.x, p.y + 4);
    ctx.restore();
  });
}

function drawCaches(ctx, game) {
  game.caches.forEach((cache) => {
    const p = worldToScreen(game, cache.x, cache.y);
    if (p.x < -80 || p.x > WIDTH + 80 || p.y < -80 || p.y > HEIGHT + 80) return;
    ctx.save();
    ctx.globalAlpha = cache.open ? 0.45 : 1;
    ctx.shadowColor = cache.open ? 'transparent' : cache.color;
    ctx.shadowBlur = cache.open ? 0 : 16 + Math.sin(cache.pulse) * 5;
    ctx.fillStyle = cache.open ? 'rgba(100,116,139,.7)' : '#111827';
    drawRoundedRect(ctx, p.x - 38, p.y - 24, 76, 48, 10);
    ctx.fill();
    ctx.strokeStyle = cache.open ? '#64748b' : cache.color;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = cache.open ? '#94a3b8' : '#f8fafc';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(cache.open ? 'OFFEN' : 'LOCK', p.x, p.y + 4);
    ctx.restore();
  });
}

function drawBarricades(ctx, game) {
  game.barricades.forEach((barricade) => {
    const p = worldToScreen(game, barricade.x, barricade.y);
    if (p.x + barricade.w < -80 || p.x > WIDTH + 80 || p.y + barricade.h < -80 || p.y > HEIGHT + 80) return;
    ctx.save();
    ctx.globalAlpha = barricade.repaired ? 1 : 0.34;
    ctx.shadowColor = barricade.hitTimer > 0 ? '#fef3c7' : 'transparent';
    ctx.shadowBlur = barricade.hitTimer > 0 ? 22 : 0;
    ctx.fillStyle = barricade.repaired ? '#92400e' : 'rgba(146,64,14,.36)';
    drawRoundedRect(ctx, p.x, p.y, barricade.w, barricade.h, 6);
    ctx.fill();
    ctx.strokeStyle = barricade.repaired ? '#fbbf24' : 'rgba(251,191,36,.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p.x + 8, p.y + barricade.h - 8);
    ctx.lineTo(p.x + barricade.w - 8, p.y + 8);
    ctx.moveTo(p.x + 8, p.y + 8);
    ctx.lineTo(p.x + barricade.w - 8, p.y + barricade.h - 8);
    ctx.stroke();
    if (barricade.repaired) {
      ctx.fillStyle = 'rgba(15,23,42,.82)';
      drawRoundedRect(ctx, p.x + 8, p.y - 10, barricade.w - 16, 6, 3);
      ctx.fill();
      ctx.fillStyle = '#facc15';
      drawRoundedRect(ctx, p.x + 8, p.y - 10, (barricade.w - 16) * clamp(barricade.hp / barricade.maxHp, 0, 1), 6, 3);
      ctx.fill();
    }
    ctx.restore();
  });
}

function drawTraps(ctx, game) {
  game.traps.forEach((trap) => {
    const p = worldToScreen(game, trap.x, trap.y);
    if (p.x < -90 || p.x > WIDTH + 90 || p.y < -90 || p.y > HEIGHT + 90) return;
    ctx.save();
    ctx.globalAlpha = trap.triggered ? 0.18 : trap.armed ? 0.72 : 0.32;
    ctx.strokeStyle = trap.armed ? '#fef3c7' : '#94a3b8';
    ctx.lineWidth = trap.armed ? 3 : 2;
    ctx.setLineDash(trap.armed ? [8, 5] : [4, 8]);
    ctx.beginPath();
    ctx.arc(p.x, p.y, trap.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = trap.armed ? '#facc15' : '#64748b';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 7 + Math.sin(trap.pulse) * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawLure(ctx, game) {
  if (!game.lure) return;
  const p = worldToScreen(game, game.lure.x, game.lure.y);
  ctx.save();
  ctx.globalAlpha = clamp(game.lure.timer / 4.2, 0, 1);
  ctx.shadowColor = '#fef3c7';
  ctx.shadowBlur = 24;
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.arc(p.x, p.y, 12 + Math.sin(game.lure.pulse) * 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(254,243,199,.5)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 42 + Math.sin(game.lure.pulse * 0.7) * 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawEnemies(ctx, game) {
  game.enemies.forEach((enemy) => {
    if (enemy.dead) return;
    const p = worldToScreen(game, enemy.x, enemy.y);
    if (p.x < -80 || p.x > WIDTH + 80 || p.y < -80 || p.y > HEIGHT + 80) return;
    ctx.save();
    ctx.translate(p.x, p.y);
    const bodyColor = enemy.type === 'hunter' ? '#7f1d1d' : enemy.type === 'stalker' ? '#581c87' : '#312e81';
    ctx.shadowColor = enemy.hitTimer > 0 ? '#fecaca' : enemy.stun > 0 ? '#93c5fd' : bodyColor;
    ctx.shadowBlur = enemy.hitTimer > 0 ? 24 : enemy.alert > 0 ? 20 : 12;
    ctx.fillStyle = enemy.hitTimer > 0 ? '#fecaca' : enemy.stun > 0 ? '#60a5fa' : bodyColor;
    drawRoundedRect(ctx, -21, -30, 42, enemy.type === 'hunter' ? 64 : 56, 13);
    ctx.fill();
    ctx.fillStyle = '#a3e635';
    ctx.beginPath();
    ctx.arc(-7, -14, 4, 0, Math.PI * 2);
    ctx.arc(8, -14, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = enemy.type === 'hunter' ? '#fca5a5' : '#c084fc';
    ctx.lineWidth = enemy.type === 'hunter' ? 9 : 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-19, 2);
    ctx.lineTo(-34, 20 + Math.sin(game.elapsed * 8 + enemy.x) * 5);
    ctx.moveTo(19, 2);
    ctx.lineTo(34, 20 + Math.cos(game.elapsed * 8 + enemy.y) * 5);
    ctx.stroke();
    ctx.fillStyle = 'rgba(15,23,42,.86)';
    drawRoundedRect(ctx, -24, -44, 48, 7, 4);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    drawRoundedRect(ctx, -24, -44, 48 * clamp(enemy.hp / enemy.maxHp, 0, 1), 7, 4);
    ctx.fill();
    if (enemy.alert > 0) {
      ctx.fillStyle = '#fef3c7';
      ctx.font = '900 14px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', 0, -52);
    }
    ctx.restore();
  });
}

function drawBoss(ctx, game) {
  const boss = game.boss;
  if (!boss.active || boss.dead) return;
  const p = worldToScreen(game, boss.x, boss.y);
  if (p.x < -120 || p.x > WIDTH + 120 || p.y < -120 || p.y > HEIGHT + 120) return;
  ctx.save();
  ctx.translate(p.x, p.y);
  const angry = boss.phase === 2;
  ctx.shadowColor = boss.hitTimer > 0 ? '#fef3c7' : angry ? '#fb7185' : '#a78bfa';
  ctx.shadowBlur = boss.hitTimer > 0 ? 32 : 28;
  ctx.fillStyle = boss.hitTimer > 0 ? '#fde68a' : angry ? '#7f1d1d' : '#3b0764';
  drawRoundedRect(ctx, -42, -54, 84, 104, 20);
  ctx.fill();
  ctx.fillStyle = angry ? '#fecaca' : '#ddd6fe';
  ctx.beginPath();
  ctx.arc(-14, -25, 6, 0, Math.PI * 2);
  ctx.arc(15, -25, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = angry ? '#fca5a5' : '#c4b5fd';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-36, -2);
  ctx.lineTo(-60, 25 + Math.sin(game.elapsed * 9) * 8);
  ctx.moveTo(36, -2);
  ctx.lineTo(62, 25 + Math.cos(game.elapsed * 9) * 8);
  ctx.stroke();
  ctx.fillStyle = 'rgba(2,6,23,.9)';
  drawRoundedRect(ctx, -58, -78, 116, 10, 5);
  ctx.fill();
  ctx.fillStyle = angry ? '#fb7185' : '#a78bfa';
  drawRoundedRect(ctx, -58, -78, 116 * clamp(boss.hp / boss.maxHp, 0, 1), 10, 5);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(angry ? 'HAUSMEISTER II' : 'HAUSMEISTER', 0, -88);
  ctx.restore();
}

function drawGates(ctx, game) {
  if (game.mode !== 'learn') return;
  game.gates.forEach((gate) => {
    if (!gate.active) return;
    const p = worldToScreen(game, gate.x, gate.y);
    if (p.x + gate.w < -80 || p.x > WIDTH + 80 || p.y + gate.h < -80 || p.y > HEIGHT + 80) return;
    ctx.save();
    ctx.globalAlpha = game.gateCooldown > 0 ? 0.55 : 0.94;
    ctx.shadowColor = '#818cf8';
    ctx.shadowBlur = 18;
    ctx.fillStyle = 'rgba(67,56,202,.74)';
    drawRoundedRect(ctx, p.x, p.y, gate.w, gate.h, 16);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawFittedText(ctx, gate.label, p.x + gate.w / 2, p.y + gate.h / 2, gate.w - 16);
    ctx.restore();
  });
}

function drawPlayer(ctx, game) {
  const player = game.player;
  const p = worldToScreen(game, player.x, player.y);
  const angle = Math.atan2(player.aimY, player.aimX);
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(angle);
  ctx.globalAlpha = player.invuln > 0 && Math.sin(game.elapsed * 45) > 0 ? 0.55 : 1;
  ctx.shadowColor = player.dodgeTimer > 0 ? '#93c5fd' : '#38bdf8';
  ctx.shadowBlur = player.dodgeTimer > 0 ? 24 : 13;
  ctx.fillStyle = '#1d4ed8';
  drawRoundedRect(ctx, -16, -18, 34, 36, 10);
  ctx.fill();
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(12, 0, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(22, 0);
  ctx.lineTo(48, 0);
  ctx.stroke();
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.arc(17, -4, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawExit(ctx, game) {
  const exit = { x: 2072, y: 1180, w: 96, h: 170 };
  const p = worldToScreen(game, exit.x, exit.y);
  ctx.save();
  ctx.shadowColor = game.player.hasRelic ? '#a78bfa' : '#475569';
  ctx.shadowBlur = game.player.hasRelic ? 28 : 0;
  ctx.fillStyle = game.player.hasRelic ? 'rgba(167,139,250,.32)' : 'rgba(71,85,105,.28)';
  drawRoundedRect(ctx, p.x, p.y, exit.w, exit.h, 16);
  ctx.fill();
  ctx.strokeStyle = game.player.hasRelic ? '#c4b5fd' : '#64748b';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('EXIT', p.x + exit.w / 2, p.y + 30);
  ctx.restore();
}

function drawParticles(ctx, game) {
  game.particles.forEach((particle) => {
    const p = worldToScreen(game, particle.x, particle.y);
    ctx.save();
    ctx.globalAlpha = clamp(particle.life / 0.55, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4 + particle.life * 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawDarkness(ctx, game) {
  const player = game.player;
  const p = worldToScreen(game, player.x, player.y);
  const angle = Math.atan2(player.aimY, player.aimX);
  const coneRange = player.focusing ? 470 : 300;
  const coneWidth = player.focusing ? 0.54 : 0.95;
  const batteryScale = clamp(player.flashlight / 100, 0.35, 1);
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.68)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.globalCompositeOperation = 'destination-out';
  const glow = ctx.createRadialGradient(p.x, p.y, 34, p.x, p.y, 190 + 40 * batteryScale);
  glow.addColorStop(0, 'rgba(255,255,255,.95)');
  glow.addColorStop(0.48, 'rgba(255,255,255,.48)');
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 230 + 45 * batteryScale, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.arc(p.x, p.y, coneRange * batteryScale, angle - coneWidth, angle + coneWidth);
  ctx.closePath();
  ctx.clip();
  const beam = ctx.createRadialGradient(p.x, p.y, 40, p.x, p.y, coneRange * batteryScale);
  beam.addColorStop(0, 'rgba(255,255,255,.9)');
  beam.addColorStop(0.5, 'rgba(255,255,255,.42)');
  beam.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = beam;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();
  if (player.focusing) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = 'rgba(147,197,253,.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + Math.cos(angle - coneWidth) * coneRange, p.y + Math.sin(angle - coneWidth) * coneRange);
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + Math.cos(angle + coneWidth) * coneRange, p.y + Math.sin(angle + coneWidth) * coneRange);
    ctx.stroke();
  }
  ctx.restore();
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

function drawFittedText(ctx, text, x, y, maxWidth, maxSize = 16, minSize = 10, weight = 900) {
  let size = maxSize;
  do {
    ctx.font = `${weight} ${size}px Outfit, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth || size <= minSize) break;
    size -= 1;
  } while (size >= minSize);
  ctx.fillText(text, x, y);
}

function drawHud(ctx, game) {
  const player = game.player;
  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,.82)';
  drawRoundedRect(ctx, 28, 22, 448, 314, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 24px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Learncade Mansion Pro' : 'Faska Mansion Pro', 50, 58);
  drawMeter(ctx, 52, 92, 140, 13, player.hp, '#22c55e', 'HP');
  drawMeter(ctx, 220, 92, 140, 13, player.stamina, '#facc15', 'STAMINA');
  drawMeter(ctx, 52, 136, 140, 12, player.flashlight, '#93c5fd', 'LIGHT');
  drawMeter(ctx, 220, 136, 140, 12, game.noise, '#fb7185', 'NOISE');
  drawMeter(ctx, 52, 180, 140, 12, game.dread, '#c084fc', 'DREAD');
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '800 13px Outfit, sans-serif';
  const keys = player.keys.length ? player.keys.map((key) => key.toUpperCase()).join(' ') : 'keine';
  const weaponLabel = player.weapon === 'shotgun' && player.hasShotgun ? `Schrot ${player.shotgunShells}/12` : `Pistole ${player.loadedAmmo}/${player.magSize}`;
  ctx.fillText(`${weaponLabel} · Reserve ${player.reserveAmmo}/30`, 220, 184);
  ctx.fillText(`Karten ${keys}`, 52, 216);
  ctx.fillStyle = game.safeRoomId ? '#67e8f9' : '#94a3b8';
  ctx.fillText(game.safeRoomId ? 'Safe Room aktiv' : 'Kein Safe Room', 220, 216);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(`Kraut ${player.herbs} · Bretter ${player.boards} · Dietriche ${player.lockpicks}`, 52, 244);
  ctx.fillText(`Flaschen ${player.decoys} · Schrot ${player.shotgunShells}/12 · Raetsel ${game.stats.puzzles}/3`, 52, 268);
  ctx.fillStyle = '#93c5fd';
  ctx.fillText(`Praezise ${game.stats.precisionShots} · Perfekt ${game.stats.perfectDodges} · leise Tueren ${game.stats.silentDoors}`, 52, 294);
  if (player.reloadTimer > 0) {
    ctx.fillStyle = '#fef3c7';
    ctx.fillText(`Reload ${(player.reloadTimer).toFixed(1)}s`, 278, 166);
  }

  if (game.mode === 'learn') {
    const task = currentTask(game);
    ctx.fillStyle = 'rgba(2,6,23,.82)';
    drawRoundedRect(ctx, 480, 78, 400, 104, 18);
    ctx.fill();
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.font = '900 18px Outfit, sans-serif';
    drawFittedText(ctx, task.sentence, 680, 110, 350, 18, 12);
    ctx.fillStyle = '#67e8f9';
    drawFittedText(ctx, task.prompt, 680, 136, 350, 14, 11, 800);
    ctx.fillStyle = '#fef3c7';
    drawFittedText(ctx, `Hinweis: ${task.word}`, 680, 160, 350, 13, 10, 800);
  }

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(2,6,23,.82)';
  drawRoundedRect(ctx, WIDTH - 336, 22, 308, 150, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 24px Outfit, sans-serif';
  ctx.fillText(`Score ${player.score}`, WIDTH - 52, 58);
  ctx.fillStyle = player.hasRelic ? '#c4b5fd' : '#94a3b8';
  ctx.font = '800 14px Outfit, sans-serif';
  ctx.fillText(player.hasRelic ? 'Siegel: ja' : 'Siegel: fehlt', WIDTH - 52, 86);
  ctx.fillStyle = '#fca5a5';
  ctx.font = '800 13px Outfit, sans-serif';
  ctx.fillText(`${game.enemies.filter((enemy) => !enemy.dead).length} Gegner · ${player.focusing ? 'Fokuslicht' : 'Weitwinkel'}`, WIDTH - 52, 116);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(`${Math.round(game.dread)}% Druck · ${Math.round(game.noise)}% Laerm`, WIDTH - 52, 140);
  if (game.boss.active && !game.boss.dead) {
    ctx.fillStyle = game.boss.phase === 2 ? '#fca5a5' : '#ddd6fe';
    ctx.fillText(`Hausmeister ${Math.max(0, game.boss.hp)}/${game.boss.maxHp}`, WIDTH - 52, 154);
  }

  const goals = activeGoals(game).slice(0, 5);
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, WIDTH - 336, 166, 308, 164, 18);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 13px Outfit, sans-serif';
  ctx.fillText('MISSIONEN', WIDTH - 314, 194);
  goals.forEach((goal, index) => {
    const progress = Math.min(game.stats[goal.stat] || 0, goal.target);
    const y = 218 + index * 23;
    ctx.fillStyle = goal.done ? '#5eead4' : '#cbd5e1';
    ctx.font = '800 12px Outfit, sans-serif';
    ctx.fillText(goal.done ? 'OK' : `${progress}/${goal.target}`, WIDTH - 314, y);
    ctx.fillStyle = goal.done ? '#ccfbf1' : '#94a3b8';
    drawFittedText(ctx, goal.label, WIDTH - 268, y, 214, 12, 10, 800);
  });

  if (game.messageTimer > 0) {
    ctx.textAlign = 'center';
    const messageY = game.mode === 'learn' ? 196 : HEIGHT - 360;
    ctx.fillStyle = 'rgba(2,6,23,.78)';
    drawRoundedRect(ctx, CENTER_X - 250, messageY, 500, 56, 18);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    drawFittedText(ctx, game.message, CENTER_X, messageY + 36, 440, game.isPortraitTouch ? 18 : 24, game.isPortraitTouch ? 10 : 14);
  }

  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawBackground(ctx, game);
  drawSafeRooms(ctx, game);
  drawExit(ctx, game);
  drawMap(ctx, game);
  drawBarricades(ctx, game);
  drawTraps(ctx, game);
  drawPuzzleStations(ctx, game);
  drawCaches(ctx, game);
  drawItems(ctx, game);
  drawEnemies(ctx, game);
  drawBoss(ctx, game);
  drawDarkness(ctx, game);
  drawLure(ctx, game);
  drawGates(ctx, game);
  drawPlayer(ctx, game);
  drawParticles(ctx, game);
  drawHud(ctx, game);
}

export default function FaskaMansionSwarm() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameRef = useRef(makeInitialGame('arcade'));
  const inputRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
    run: false,
    dodge: false,
    fire: false,
    reload: false,
    focus: false,
    use: false,
    heal: false,
    lure: false,
    weapon: false,
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
      run: false,
      dodge: false,
      fire: false,
      reload: false,
      focus: false,
      use: false,
      heal: false,
      lure: false,
      weapon: false,
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

    const keyMap = new Map([
      ['ArrowUp', 'up'], ['w', 'up'], ['W', 'up'],
      ['ArrowDown', 'down'], ['s', 'down'], ['S', 'down'],
      ['ArrowLeft', 'left'], ['a', 'left'], ['A', 'left'],
      ['ArrowRight', 'right'], ['d', 'right'], ['D', 'right'],
      ['Shift', 'run'],
      ['q', 'dodge'], ['Q', 'dodge'],
      ['e', 'reload'], ['E', 'reload'],
      ['f', 'focus'], ['F', 'focus'],
      ['x', 'use'], ['X', 'use'], ['Enter', 'use'],
      ['h', 'heal'], ['H', 'heal'],
      ['g', 'lure'], ['G', 'lure'],
      ['b', 'weapon'], ['B', 'weapon'],
      [' ', 'fire'], ['Space', 'fire'],
    ]);
    let raf = 0;
    let last = performance.now();

    const keyDown = (event) => {
      const mapped = keyMap.get(event.key);
      if (mapped) {
        inputRef.current[mapped] = true;
        if (mapped === 'fire') fireWeapon(gameRef.current);
        if (mapped === 'reload') reloadWeapon(gameRef.current);
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
        gameRef.current.isPortraitTouch = window.matchMedia('(max-width: 899px) and (orientation: portrait)').matches;
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
    width: 78,
    height: 58,
    fontSize: 11,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#030712', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
      <canvas
        className="mansion-canvas"
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
      <div className="mansion-vignette" style={{
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

      <div className="mansion-modebar" style={{ position: 'fixed', top: canvasTopChrome, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.55 }}>
          Normal
        </button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.55 }}>
          Learncade
        </button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>

      <div className="mansion-touch-controls" style={{
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

      <div className="mansion-touch-controls mansion-actions" style={{
        position: 'fixed', right: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'flex', gap: 8, alignItems: 'flex-end', touchAction: 'none', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 360,
      }}>
        <button aria-label="Ausweichen" style={actionButton} {...holdButton('dodge')}>DODGE</button>
        <button aria-label="Nachladen" style={actionButton} {...holdButton('reload')}>RELOAD</button>
        <button aria-label="Benutzen" style={actionButton} {...holdButton('use')}>USE</button>
        <button aria-label="Heilen" style={actionButton} {...holdButton('heal')}>HEAL</button>
        <button aria-label="Ablenken" style={actionButton} {...holdButton('lure')}>LURE</button>
        <button aria-label="Waffe wechseln" style={actionButton} {...holdButton('weapon')}>WPN</button>
        <button aria-label="Fokuslicht" style={actionButton} {...holdButton('focus')}>AIM</button>
        <button aria-label="Rennen" style={actionButton} {...holdButton('run')}>RUN</button>
        <button aria-label="Schiessen" style={{ ...actionButton, width: 92, height: 70, background: 'rgba(248,113,113,.84)' }} {...holdButton('fire')}>
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
          <div style={{ fontSize: 15, color: '#cbd5e1' }}>HP {result.hp}</div>
          <button className="btn-primary" onClick={restart}>Neuer Lauf</button>
        </div>
      )}

      <style>{`
        @media (pointer: fine), (min-width: 900px) {
          .mansion-touch-controls {
            display: none !important;
          }
        }
        @media (max-width: 899px) and (orientation: portrait) {
          .mansion-canvas,
          .mansion-vignette {
            top: 0 !important;
            bottom: 0 !important;
            left: 50% !important;
            right: auto !important;
            margin: 0 !important;
            width: max(100dvw, calc(100dvh * 16 / 9)) !important;
            height: 100dvh !important;
            transform: translateX(-50%) !important;
          }
          .mansion-modebar {
            top: max(8px, env(safe-area-inset-top)) !important;
            width: min(96dvw, 560px);
            flex-wrap: wrap;
            justify-content: center;
            gap: 6px !important;
          }
          .mansion-modebar .btn-primary {
            padding: 8px 11px;
            font-size: 11px;
          }
          .mansion-touch-controls {
            bottom: max(12px, env(safe-area-inset-bottom)) !important;
          }
          .mansion-actions {
            right: 10px !important;
            gap: 6px !important;
            flex-wrap: wrap;
            justify-content: flex-end;
            width: 150px !important;
            max-width: 150px !important;
          }
          .mansion-actions button {
            width: 70px !important;
            height: 50px !important;
            border-radius: 12px !important;
            font-size: 10px !important;
          }
          .mansion-actions button[aria-label="Schiessen"] {
            width: 146px !important;
            height: 58px !important;
          }
        }
      `}</style>
    </div>
  );
}
