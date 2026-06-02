import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIDTH = 1280;
const HEIGHT = 720;
const CENTER_X = WIDTH / 2;
const WORLD_W = 2480;
const WORLD_H = 1680;
const ROAD_HALF = 66;
const CAR_W = 44;
const CAR_H = 78;

const ROAD_X = [170, 420, 710, 980, 1260, 1560, 1860, 2200];
const ROAD_Y = [150, 390, 640, 900, 1170, 1470];
const PLAYER_START = { x: 170, y: 1040, angle: Math.PI };

const ARCADE_JOBS = [
  {
    pickup: 'Luna',
    cargo: 'Fahrgast',
    target: 'Bibliothek',
    hint: 'Hole Luna ab und bring sie schnell zur Bibliothek.',
    from: { x: 170, y: 1170 },
    to: { x: 2200, y: 150 },
    color: '#38bdf8',
    reward: 380,
  },
  {
    pickup: 'Bruno',
    cargo: 'Werkzeug',
    target: 'Werkstatt',
    hint: 'Werkzeug abholen, sauber durch die Stadt liefern.',
    from: { x: 1560, y: 1170 },
    to: { x: 710, y: 150 },
    color: '#f97316',
    reward: 420,
  },
  {
    pickup: 'Mika',
    cargo: 'Eilfahrt',
    target: 'Bahnhof',
    hint: 'Zeitbonus fuer eine schnelle, schadensarme Fahrt.',
    from: { x: 980, y: 150 },
    to: { x: 2200, y: 1470 },
    color: '#22c55e',
    reward: 460,
  },
  {
    pickup: 'Roni',
    cargo: 'Kurier',
    target: 'Theater',
    hint: 'Kurierfahrt mit enger Kurve durch die Innenstadt.',
    from: { x: 170, y: 1470 },
    to: { x: 1560, y: 640 },
    color: '#a78bfa',
    reward: 440,
  },
  {
    pickup: 'Noah',
    cargo: 'Pizza',
    target: 'Park',
    hint: 'Lieferung durch den Verkehr, ohne den Boost zu verschwenden.',
    from: { x: 1860, y: 390 },
    to: { x: 420, y: 1470 },
    color: '#facc15',
    reward: 400,
  },
];

const LEARN_JOBS = [
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    pickup: 'rennt',
    cargo: 'rennt',
    target: 'Verb',
    choices: ['Nomen', 'Verb', 'Adjektiv'],
    revealTarget: false,
    hint: 'Der Hund ___ schnell. Welche Wortart ist "rennt"?',
    from: { x: 170, y: 1170 },
    color: '#a855f7',
    reward: 520,
  },
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    pickup: 'Schule',
    cargo: 'Schule',
    target: 'Nomen',
    choices: ['Nomen', 'Verb', 'Praeposition'],
    revealTarget: false,
    hint: 'Die ___ ist heute offen. Welche Wortart ist "Schule"?',
    from: { x: 1560, y: 390 },
    color: '#06b6d4',
    reward: 500,
  },
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    pickup: 'gelb',
    cargo: 'gelb',
    target: 'Adjektiv',
    choices: ['Verb', 'Adjektiv', 'Nomen'],
    revealTarget: false,
    hint: 'Das Taxi ist ___. Welche Wortart ist "gelb"?',
    from: { x: 2200, y: 900 },
    color: '#f97316',
    reward: 500,
  },
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    pickup: 'unter',
    cargo: 'unter',
    target: 'Praeposition',
    choices: ['Artikel', 'Praeposition', 'Verb'],
    revealTarget: false,
    hint: 'Die Katze liegt ___ dem Tisch. Welche Wortart ist "unter"?',
    from: { x: 710, y: 1170 },
    color: '#14b8a6',
    reward: 540,
  },
  {
    subject: 'Mathe',
    kind: 'Ergebnis',
    pickup: '42',
    cargo: '42',
    target: '42',
    choices: ['36', '42', '48'],
    revealTarget: false,
    hint: '6 x 7 = ? Fahre zum richtigen Ergebnis.',
    from: { x: 1860, y: 1470 },
    color: '#facc15',
    reward: 560,
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    pickup: 'street',
    cargo: 'street',
    target: 'Strasse',
    choices: ['Schlag', 'Strasse', 'Schule'],
    revealTarget: false,
    hint: 'Was bedeutet "street"?',
    from: { x: 980, y: 640 },
    color: '#fb7185',
    reward: 560,
  },
  {
    subject: 'Lesen',
    kind: 'Ort lesen',
    pickup: 'Bibliothek',
    cargo: 'Bibliothek',
    target: 'Bibliothek',
    revealTarget: true,
    hint: 'Lies das Wort und fahre zum Ort: Bibliothek.',
    from: { x: 170, y: 900 },
    color: '#38bdf8',
    reward: 580,
  },
  {
    subject: 'Satzbau',
    kind: 'Satzposition',
    pickup: 'Heute',
    cargo: 'Heute',
    target: 'Satzanfang',
    choices: ['Satzanfang', 'Satzmitte', 'Satzende'],
    revealTarget: false,
    hint: '___ fahren wir Taxi. Wo passt "Heute"?',
    from: { x: 1260, y: 390 },
    color: '#22c55e',
    reward: 600,
  },
  {
    subject: 'Satzbau',
    kind: 'Satzposition',
    pickup: 'leise',
    cargo: 'leise',
    target: 'Satzmitte',
    choices: ['Satzanfang', 'Satzmitte', 'Satzende'],
    revealTarget: false,
    hint: 'Wir fahren ___ weiter. Wo passt "leise"?',
    from: { x: 420, y: 900 },
    color: '#a78bfa',
    reward: 620,
  },
  {
    subject: 'Lesen',
    kind: 'Ort lesen',
    pickup: 'Park',
    cargo: 'Park',
    target: 'Park',
    revealTarget: true,
    hint: 'Lies das Zielwort und fahre zum Park.',
    from: { x: 1560, y: 900 },
    color: '#84cc16',
    reward: 580,
  },
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    pickup: 'frohlich',
    cargo: 'frohlich',
    target: 'Adjektiv',
    choices: ['Adjektiv', 'Adverb', 'Nomen'],
    revealTarget: false,
    hint: 'Das Kind lacht frohlich. Welche Wortart ist "frohlich"?',
    from: { x: 980, y: 1170 },
    color: '#fb7185',
    reward: 560,
  },
  {
    subject: 'Deutsch',
    kind: 'Wortart',
    pickup: 'und',
    cargo: 'und',
    target: 'Konjunktion',
    choices: ['Artikel', 'Konjunktion', 'Praeposition'],
    revealTarget: false,
    hint: 'Luna und Bruno fahren. Welche Wortart ist "und"?',
    from: { x: 1860, y: 150 },
    color: '#e879f9',
    reward: 620,
  },
  {
    subject: 'Mathe',
    kind: 'Ergebnis',
    pickup: '41',
    cargo: '41',
    target: '41',
    choices: ['39', '41', '43'],
    revealTarget: false,
    hint: '14 + 27 = ? Fahre zum richtigen Ergebnis.',
    from: { x: 1260, y: 1170 },
    color: '#facc15',
    reward: 600,
  },
  {
    subject: 'Englisch',
    kind: 'Wortschatz',
    pickup: 'book',
    cargo: 'book',
    target: 'Buch',
    choices: ['Buch', 'Baum', 'Ball'],
    revealTarget: false,
    hint: 'Was bedeutet "book"?',
    from: { x: 710, y: 640 },
    color: '#38bdf8',
    reward: 580,
  },
  {
    subject: 'Deutsch',
    kind: 'Kompositum',
    pickup: 'Sonnen + Schirm',
    cargo: 'Sonnen + Schirm',
    target: 'Sonnenschirm',
    choices: ['Sonnenlicht', 'Sonnenschirm', 'Schirmsonne'],
    revealTarget: false,
    hint: 'Welches zusammengesetzte Nomen passt?',
    from: { x: 2200, y: 640 },
    color: '#f97316',
    reward: 640,
  },
];

const LEARN_DESTINATIONS = [
  { label: 'Nomen', x: 710, y: 640, color: '#06b6d4' },
  { label: 'Verb', x: 1260, y: 640, color: '#a855f7' },
  { label: 'Adjektiv', x: 1560, y: 640, color: '#f97316' },
  { label: 'Praeposition', x: 710, y: 900, color: '#14b8a6' },
  { label: 'Artikel', x: 1260, y: 900, color: '#e879f9' },
  { label: 'Adverb', x: 1860, y: 900, color: '#22c55e' },
  { label: 'Konjunktion', x: 1560, y: 1170, color: '#f43f5e' },
  { label: '36', x: 980, y: 900, color: '#f59e0b' },
  { label: '39', x: 710, y: 1170, color: '#f59e0b' },
  { label: '41', x: 1260, y: 900, color: '#facc15' },
  { label: '42', x: 1560, y: 1170, color: '#facc15' },
  { label: '43', x: 1860, y: 900, color: '#facc15' },
  { label: '48', x: 980, y: 1470, color: '#f59e0b' },
  { label: 'Strasse', x: 710, y: 390, color: '#fb7185' },
  { label: 'Schlag', x: 980, y: 390, color: '#fb7185' },
  { label: 'Bibliothek', x: 2200, y: 390, color: '#38bdf8' },
  { label: 'Schule', x: 170, y: 900, color: '#38bdf8' },
  { label: 'Park', x: 420, y: 1170, color: '#84cc16' },
  { label: 'Buch', x: 1860, y: 390, color: '#38bdf8' },
  { label: 'Baum', x: 1260, y: 640, color: '#38bdf8' },
  { label: 'Ball', x: 1560, y: 640, color: '#38bdf8' },
  { label: 'Satzanfang', x: 980, y: 150, color: '#22c55e' },
  { label: 'Satzmitte', x: 1260, y: 1470, color: '#a78bfa' },
  { label: 'Satzende', x: 1860, y: 1170, color: '#f43f5e' },
  { label: 'Sonnenlicht', x: 710, y: 900, color: '#f97316' },
  { label: 'Sonnenschirm', x: 1560, y: 900, color: '#f97316' },
  { label: 'Schirmsonne', x: 2200, y: 1170, color: '#f97316' },
];

const TRAFFIC_SEEDS = [
  { lane: 'h', y: 150, x: 180, speed: 140, color: '#ef4444', phase: 0 },
  { lane: 'h', y: 390, x: 940, speed: -118, color: '#22c55e', phase: 130 },
  { lane: 'h', y: 640, x: 1460, speed: 165, color: '#38bdf8', phase: 310 },
  { lane: 'h', y: 900, x: 2040, speed: -152, color: '#f59e0b', phase: 70 },
  { lane: 'h', y: 1170, x: 520, speed: 124, color: '#a78bfa', phase: 210 },
  { lane: 'h', y: 1470, x: 1600, speed: -136, color: '#f43f5e', phase: 40 },
  { lane: 'v', x: 170, y: 720, speed: -126, color: '#14b8a6', phase: 80 },
  { lane: 'v', x: 420, y: 290, speed: 154, color: '#f97316', phase: 180 },
  { lane: 'v', x: 710, y: 1120, speed: -142, color: '#8b5cf6', phase: 360 },
  { lane: 'v', x: 980, y: 520, speed: 128, color: '#06b6d4', phase: 260 },
  { lane: 'v', x: 1260, y: 1440, speed: -150, color: '#ef4444', phase: 120 },
  { lane: 'v', x: 1560, y: 250, speed: 132, color: '#22c55e', phase: 300 },
  { lane: 'v', x: 1860, y: 860, speed: -118, color: '#facc15', phase: 40 },
  { lane: 'v', x: 2200, y: 1220, speed: 144, color: '#38bdf8', phase: 220 },
];

const BUILDINGS = [
  { x: 40, y: 250, w: 230, h: 94, color: '#1e293b', name: 'Cafe' },
  { x: 520, y: 35, w: 120, h: 86, color: '#26344c', name: 'Bank' },
  { x: 1110, y: 230, w: 220, h: 108, color: '#23324a', name: 'Kino' },
  { x: 1660, y: 245, w: 118, h: 94, color: '#28384f', name: 'Post' },
  { x: 480, y: 505, w: 154, h: 84, color: '#1d3143', name: 'Markt' },
  { x: 800, y: 500, w: 112, h: 94, color: '#273449', name: 'Hotel' },
  { x: 1355, y: 508, w: 128, h: 88, color: '#1f2a44', name: 'Studio' },
  { x: 1960, y: 520, w: 120, h: 82, color: '#293548', name: 'Shop' },
  { x: 255, y: 770, w: 112, h: 92, color: '#23324a', name: 'Schule' },
  { x: 510, y: 760, w: 120, h: 96, color: '#203044', name: 'Werk' },
  { x: 1100, y: 760, w: 130, h: 96, color: '#293548', name: 'Theater' },
  { x: 1680, y: 760, w: 130, h: 96, color: '#26344c', name: 'Arena' },
  { x: 520, y: 1020, w: 124, h: 96, color: '#1e293b', name: 'Museum' },
  { x: 1320, y: 1020, w: 145, h: 96, color: '#273449', name: 'Depot' },
  { x: 1955, y: 1020, w: 138, h: 96, color: '#1d3143', name: 'Buehne' },
  { x: 40, y: 1285, w: 230, h: 92, color: '#26344c', name: 'Parkhaus' },
  { x: 800, y: 1285, w: 120, h: 92, color: '#28384f', name: 'Labor' },
  { x: 1120, y: 1300, w: 170, h: 88, color: '#203044', name: 'Garage' },
  { x: 1650, y: 1295, w: 128, h: 90, color: '#23324a', name: 'Dock' },
];

const PARKS = [
  { x: 1390, y: 1240, w: 130, h: 130 },
  { x: 1980, y: 235, w: 140, h: 122 },
  { x: 300, y: 1035, w: 95, h: 95 },
];

const SERVICE_STATIONS = [
  { id: 'repair', label: 'REPAIR', x: 980, y: 1170, color: '#22c55e', cost: 160 },
  { id: 'boost', label: 'BOOST', x: 1860, y: 640, color: '#38bdf8', cost: 110 },
];

const TURBO_PADS = [
  { id: 'turbo-mid', label: 'TURBO', x: 1260, y: 640, angle: Math.PI / 2, color: '#38bdf8' },
  { id: 'turbo-dock', label: 'TURBO', x: 1860, y: 1170, angle: Math.PI / 2, color: '#a78bfa' },
  { id: 'turbo-west', label: 'TURBO', x: 420, y: 390, angle: 0, color: '#22c55e' },
  { id: 'turbo-north', label: 'TURBO', x: 980, y: 150, angle: Math.PI / 2, color: '#facc15' },
];

const ROADWORKS = [
  { id: 'work-bank', label: 'BAU', x: 710, y: 390, w: 168, h: 48, angle: 0.02, color: '#f97316' },
  { id: 'work-theater', label: 'BAU', x: 1560, y: 900, w: 146, h: 50, angle: -0.08, color: '#fb7185' },
  { id: 'work-dock', label: 'BAU', x: 2200, y: 1170, w: 52, h: 154, angle: 0.04, color: '#f59e0b' },
  { id: 'work-school', label: 'BAU', x: 420, y: 1170, w: 150, h: 46, angle: 0.1, color: '#f97316' },
];

const STUNT_RAMPS = [
  { id: 'ramp-hotel', label: 'JUMP', x: 980, y: 640, angle: Math.PI / 2, color: '#facc15', power: 1.05 },
  { id: 'ramp-dock', label: 'JUMP', x: 1860, y: 1170, angle: Math.PI / 2, color: '#38bdf8', power: 1.18 },
  { id: 'ramp-west', label: 'JUMP', x: 420, y: 900, angle: 0, color: '#a78bfa', power: 1.0 },
];

const SPEED_GATES = [
  { id: 'camera-north', label: '120+', x: 710, y: 150, angle: Math.PI / 2, targetSpeed: 270, color: '#22c55e' },
  { id: 'camera-mid', label: '160+', x: 1560, y: 640, angle: Math.PI / 2, targetSpeed: 330, color: '#67e8f9' },
  { id: 'camera-south', label: '140+', x: 1260, y: 1470, angle: Math.PI / 2, targetSpeed: 300, color: '#f97316' },
];

const SHORTCUTS = [
  { id: 'alley-bank', label: 'ALLEY', x: 560, y: 260, w: 58, h: 240, angle: -0.62, minSpeed: 240, color: '#5eead4', reward: 180 },
  { id: 'market-cut', label: 'CUT', x: 1120, y: 520, w: 58, h: 280, angle: 0.88, minSpeed: 270, color: '#fef08a', reward: 210 },
  { id: 'park-gap', label: 'GAP', x: 320, y: 1128, w: 54, h: 230, angle: -0.14, minSpeed: 230, color: '#86efac', reward: 170 },
  { id: 'dock-cut', label: 'DOCK', x: 2020, y: 1040, w: 62, h: 310, angle: 0.38, minSpeed: 300, color: '#67e8f9', reward: 250 },
];

const CITY_PICKUPS = [
  { id: 'coin-market', type: 'coin', label: 'Muenze', x: 420, y: 640, color: '#facc15', value: 180 },
  { id: 'coin-arena', type: 'coin', label: 'Muenze', x: 1860, y: 900, color: '#facc15', value: 180 },
  { id: 'clock-north', type: 'time', label: '+Zeit', x: 1260, y: 150, color: '#67e8f9', value: 9 },
  { id: 'clock-park', type: 'time', label: '+Zeit', x: 170, y: 640, color: '#67e8f9', value: 8 },
  { id: 'boost-hotel', type: 'boost', label: 'Boost', x: 980, y: 900, color: '#a78bfa', value: 32 },
  { id: 'repair-south', type: 'repair', label: 'Fix', x: 1260, y: 1470, color: '#22c55e', value: 20 },
];

const RIVAL_SEEDS = [
  {
    id: 'rival-red',
    label: 'R1',
    color: '#ef4444',
    x: 2200,
    y: 390,
    speed: 266,
    route: [
      { x: 2200, y: 390 },
      { x: 1560, y: 390 },
      { x: 1560, y: 1170 },
      { x: 710, y: 1170 },
      { x: 710, y: 390 },
    ],
  },
  {
    id: 'rival-blue',
    label: 'R2',
    color: '#38bdf8',
    x: 170,
    y: 150,
    speed: 236,
    route: [
      { x: 170, y: 150 },
      { x: 980, y: 150 },
      { x: 980, y: 900 },
      { x: 1860, y: 900 },
      { x: 1860, y: 150 },
    ],
  },
  {
    id: 'rival-purple',
    label: 'R3',
    color: '#a78bfa',
    x: 420,
    y: 1470,
    speed: 248,
    route: [
      { x: 420, y: 1470 },
      { x: 420, y: 640 },
      { x: 1260, y: 640 },
      { x: 2200, y: 640 },
      { x: 2200, y: 1470 },
    ],
  },
];

const TAXI_GOALS = [
  { id: 'deliveries-2', label: 'Lieferungen', type: 'deliveries', target: 2, reward: 520 },
  { id: 'clean-1', label: 'Clean Delivery', type: 'cleanDeliveries', target: 1, reward: 420 },
  { id: 'route-8', label: '8 Route-Gates', type: 'routeGates', target: 8, reward: 360 },
  { id: 'shortcuts-2', label: '2 Risk-Shortcuts', type: 'shortcuts', target: 2, reward: 500 },
  { id: 'style-tip-2', label: '2 Style-Tips', type: 'styleTips', target: 2, reward: 540 },
  { id: 'rush-6', label: '6 Rush-Ketten', type: 'rushChains', target: 6, reward: 560 },
  { id: 'drift-3', label: '3s Drift', type: 'driftSeconds', target: 3, reward: 320 },
  { id: 'turbo-3', label: '3 Turbo-Pads', type: 'turboPads', target: 3, reward: 360 },
  { id: 'pickups-4', label: '4 Street-Boni', type: 'pickups', target: 4, reward: 440 },
  { id: 'rivals-2', label: '2 Rivalen-Passes', type: 'rivalPasses', target: 2, reward: 520 },
  { id: 'jumps-2', label: '2 Spruenge', type: 'stuntJumps', target: 2, reward: 460 },
  { id: 'speed-3', label: '3 Speed-Gates', type: 'speedGates', target: 3, reward: 430 },
  { id: 'perfect-2', label: '2 perfekte Dropoffs', type: 'perfectDropoffs', target: 2, reward: 560 },
  { id: 'shift-streak-3', label: '3er Schichtserie', type: 'bestShiftStreak', target: 3, reward: 720 },
  { id: 'learn-3', label: 'richtige Woerter', type: 'learnCorrect', target: 3, reward: 620, learnOnly: true },
];

const DISPATCH_CONTRACTS = [
  { id: 'dispatch-drift', label: '2s Drift fahren', type: 'driftSeconds', target: 2, duration: 30, reward: { score: 260, boost: 26, time: 3 } },
  { id: 'dispatch-route', label: '3 Route-Gates treffen', type: 'routeGates', target: 3, duration: 36, reward: { score: 300, boost: 18, time: 4 } },
  { id: 'dispatch-near', label: '2 Near Misses', type: 'nearMiss', target: 2, duration: 32, reward: { score: 340, boost: 22, reputation: 1 } },
  { id: 'dispatch-turbo', label: '1 Turbo-Pad nehmen', type: 'turboPads', target: 1, duration: 26, reward: { score: 220, boost: 34 } },
  { id: 'dispatch-jump', label: '1 Sprung schaffen', type: 'stuntJumps', target: 1, duration: 36, reward: { score: 360, boost: 16, time: 3 } },
  { id: 'dispatch-speed', label: '1 Speed-Gate', type: 'speedGates', target: 1, duration: 34, reward: { score: 330, boost: 20, reputation: 1 } },
  { id: 'dispatch-rush', label: '3 Rush-Ketten fahren', type: 'rushChains', target: 3, duration: 42, reward: { score: 520, boost: 30, time: 5, reputation: 1 } },
  { id: 'dispatch-shortcut', label: '1 Shortcut nutzen', type: 'shortcuts', target: 1, duration: 45, reward: { score: 420, boost: 22, time: 5 } },
  { id: 'dispatch-pickups', label: '2 Street-Boni sammeln', type: 'pickups', target: 2, duration: 38, reward: { score: 280, repair: 8, boost: 14 } },
  { id: 'dispatch-rival', label: '1 Rivalen-Pass', type: 'rivalPasses', target: 1, duration: 42, reward: { score: 390, boost: 28, reputation: 1 } },
  { id: 'dispatch-clean', label: '1 saubere Lieferung', type: 'cleanDeliveries', target: 1, duration: 68, reward: { score: 520, repair: 14, reputation: 2 } },
  { id: 'dispatch-perfect', label: '1 perfekter Dropoff', type: 'perfectDropoffs', target: 1, duration: 82, reward: { score: 640, boost: 32, time: 8, reputation: 2 } },
  { id: 'dispatch-streak', label: '2 Serienfahrten halten', type: 'shiftStreak', target: 2, duration: 96, reward: { score: 720, boost: 32, time: 8, reputation: 2 } },
  { id: 'dispatch-learn', label: '1 richtiges Wort liefern', type: 'learnCorrect', target: 1, duration: 64, reward: { score: 560, boost: 24, time: 7, reputation: 1 }, learnOnly: true },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const angleTo = (from, to) => Math.atan2(to.x - from.x, -(to.y - from.y));

function isPointInRotatedBox(point, box, radius = 0) {
  const dx = point.x - box.x;
  const dy = point.y - box.y;
  const cos = Math.cos(-box.angle);
  const sin = Math.sin(-box.angle);
  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;
  return Math.abs(localX) <= box.w / 2 + radius && Math.abs(localY) <= box.h / 2 + radius;
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

function drawFittedText(ctx, text, x, y, maxWidth, maxSize = 18, minSize = 10, weight = 900) {
  let size = maxSize;
  do {
    ctx.font = `${weight} ${size}px Outfit, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth || size <= minSize) break;
    size -= 1;
  } while (size >= minSize);
  ctx.fillText(text, x, y);
}

function getJobs(mode) {
  return mode === 'learn' ? LEARN_JOBS : ARCADE_JOBS;
}

function currentJob(game) {
  const jobs = getJobs(game.mode);
  return jobs[game.jobIndex % jobs.length];
}

function getLearnDestination(label) {
  return LEARN_DESTINATIONS.find((destination) => destination.label === label) || LEARN_DESTINATIONS[0];
}

function shouldRevealTarget(job) {
  return job.revealTarget !== false;
}

function getLearnChoiceDestinations(game) {
  const job = currentJob(game);
  if (!game.carrying || shouldRevealTarget(job) || !job.choices) return LEARN_DESTINATIONS;
  return LEARN_DESTINATIONS.filter((destination) => job.choices.includes(destination.label));
}

function getActiveTarget(game) {
  const job = currentJob(game);
  if (!game.carrying) return job.from;
  if (game.mode !== 'learn') return job.to;
  if (!shouldRevealTarget(job)) return null;
  return getLearnDestination(job.target);
}

function getVisibleRouteGates(game) {
  const job = currentJob(game);
  if (game.carrying) return game.routeGates;
  return buildRouteGates(game.player, job.from, '#facc15').map((gate) => ({ ...gate, preview: true }));
}

function addSegmentGates(gates, from, to, color) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length < 120) return;
  const count = Math.max(1, Math.floor(length / 360));
  for (let i = 1; i <= count; i += 1) {
    const t = i / (count + 1);
    gates.push({
      x: lerp(from.x, to.x, t),
      y: lerp(from.y, to.y, t),
      collected: false,
      color,
    });
  }
}

function buildRouteGates(from, to, color) {
  const gates = [];
  const turnA = { x: to.x, y: from.y };
  const turnB = { x: from.x, y: to.y };
  const useA = isOnRoad(turnA.x, turnA.y) && distance(from, turnA) + distance(turnA, to) <= distance(from, turnB) + distance(turnB, to);
  const turn = useA ? turnA : turnB;
  addSegmentGates(gates, from, turn, color);
  if (distance(from, turn) > 110 && distance(turn, to) > 110) {
    gates.push({
      x: turn.x,
      y: turn.y,
      collected: false,
      color,
      turn: true,
    });
  }
  addSegmentGates(gates, turn, to, color);
  return gates.map((gate, index) => ({ ...gate, id: `gate_${index}`, index }));
}

function isOnRoad(x, y) {
  return ROAD_X.some((roadX) => Math.abs(x - roadX) < ROAD_HALF) || ROAD_Y.some((roadY) => Math.abs(y - roadY) < ROAD_HALF);
}

function makeTraffic() {
  return TRAFFIC_SEEDS.map((seed, index) => ({
    ...seed,
    id: index,
    x: seed.lane === 'h' ? seed.x + seed.phase : seed.x,
    y: seed.lane === 'v' ? seed.y + seed.phase : seed.y,
    nearAwarded: false,
  }));
}

function makeRivals() {
  return RIVAL_SEEDS.map((rival) => ({
    ...rival,
    waypoint: 1,
    angle: 0,
    nearAwarded: false,
  }));
}

function makeCityPickups() {
  return CITY_PICKUPS.map((pickup) => ({ ...pickup, collected: false, bob: 0 }));
}

function makeInitialGame(mode = 'arcade') {
  return {
    mode,
    player: {
      ...PLAYER_START,
      speed: 0,
      boost: 100,
      damage: 0,
      drift: 0,
      driftCharge: 0,
      driftBoostTimer: 0,
      airTimer: 0,
      airMax: 0,
      jumpCooldown: 0,
      grip: 1,
      impactTimer: 0,
    },
    camera: { x: 0, y: 0 },
    jobIndex: 0,
    carrying: false,
    score: 0,
    combo: 0,
    deliveries: 0,
    targetDeliveries: mode === 'learn' ? 8 : 6,
    time: mode === 'learn' ? 115 : 95,
    elapsed: 0,
    nearMiss: 0,
    nearMissCooldown: 0,
    rivalPassCooldown: 0,
    turboCooldown: 0,
    pickupCooldown: 0,
    hazardCooldown: 0,
    speedGateCooldown: 0,
    shortcutCooldown: 0,
    routeGates: [],
    routeGatesCollected: 0,
    passengerMood: 100,
    fareHeat: 0,
    rushChain: 0,
    rushTimer: 0,
    rushPeak: 0,
    rushSource: '',
    rushPulseTimer: 0,
    fareIncidents: 0,
    pickupDamage: 0,
    wrongPads: 0,
    wrongPadCooldown: 0,
    reputation: 0,
    shiftStreak: 0,
    crashCooldown: 0,
    activeContract: null,
    contractIndex: 0,
    contractTimer: 0,
    contractCooldown: 2.1,
    contractMedals: 0,
    contractFails: 0,
    stats: {
      deliveries: 0,
      cleanDeliveries: 0,
      routeGates: 0,
      driftSeconds: 0,
      learnCorrect: 0,
      nearMiss: 0,
      turboPads: 0,
      pickups: 0,
      rivalPasses: 0,
      stuntJumps: 0,
      airSeconds: 0,
      speedGates: 0,
      shortcuts: 0,
      styleTips: 0,
      rushChains: 0,
      bestRushChain: 0,
      perfectDropoffs: 0,
      shiftStreak: 0,
      bestShiftStreak: 0,
      streakBreaks: 0,
    },
    goals: TAXI_GOALS
      .filter((goal) => mode === 'learn' || !goal.learnOnly)
      .map((goal) => ({ ...goal, done: false })),
    serviceCooldown: 0,
    previousBrake: false,
    message: mode === 'learn' ? 'Wort abholen und zum richtigen Tor fahren.' : 'Fahrgast abholen, Rivalen schneiden, Boni sammeln.',
    messageTimer: 2,
    finished: false,
    traffic: makeTraffic(),
    rivals: makeRivals(),
    cityPickups: makeCityPickups(),
    skidMarks: [],
    particles: [],
    floaters: [],
  };
}

function statValue(game, goal) {
  return game.stats[goal.type] || 0;
}

function availableDispatchContracts(mode) {
  return DISPATCH_CONTRACTS.filter((contract) => mode === 'learn' || !contract.learnOnly);
}

function dispatchProgress(game) {
  if (!game.activeContract) return 0;
  return Math.max(0, (game.stats[game.activeContract.type] || 0) - (game.activeContract.startValue || 0));
}

function applyDispatchReward(game, reward) {
  game.score += reward.score || 0;
  game.player.boost = clamp(game.player.boost + (reward.boost || 0), 0, 100);
  game.time = Math.min(game.mode === 'learn' ? 136 : 116, game.time + (reward.time || 0));
  game.player.damage = Math.max(0, game.player.damage - (reward.repair || 0));
  game.reputation += reward.reputation || 0;
}

function startDispatchContract(game) {
  const pool = availableDispatchContracts(game.mode);
  if (pool.length === 0) return;
  const contract = pool[game.contractIndex % pool.length];
  game.contractIndex += 1;
  game.activeContract = { ...contract, startValue: game.stats[contract.type] || 0 };
  game.contractTimer = contract.duration;
  game.message = `Dispatch: ${contract.label}`;
  game.messageTimer = 1.05;
  addFloater(game, game.player.x, game.player.y - 92, 'DISPATCH', '#fde68a');
}

function completeDispatchContract(game) {
  const contract = game.activeContract;
  if (!contract) return;
  applyDispatchReward(game, contract.reward || {});
  game.contractMedals += 1;
  game.activeContract = null;
  game.contractTimer = 0;
  game.contractCooldown = 3.2;
  game.message = `Dispatch geschafft +${contract.reward?.score || 0}`;
  game.messageTimer = 1.1;
  addFloater(game, game.player.x, game.player.y - 96, 'MEDAILLE', '#fde68a');
  spawnParticles(game, game.player.x, game.player.y, '#fde68a', 22, 260);
}

function failDispatchContract(game) {
  const contract = game.activeContract;
  if (!contract) return;
  game.contractFails += 1;
  game.activeContract = null;
  game.contractTimer = 0;
  game.contractCooldown = 2.6;
  game.message = `Dispatch verpasst: ${contract.label}`;
  game.messageTimer = 1.0;
  addFloater(game, game.player.x, game.player.y - 86, 'zu spaet', '#fb7185');
}

function updateDispatchContract(game, dt) {
  if (game.finished) return;
  if (!game.activeContract) {
    game.contractCooldown = Math.max(0, game.contractCooldown - dt);
    if (game.contractCooldown <= 0) startDispatchContract(game);
    return;
  }
  if (dispatchProgress(game) >= game.activeContract.target) {
    completeDispatchContract(game);
    return;
  }
  game.contractTimer = Math.max(0, game.contractTimer - dt);
  if (game.contractTimer <= 0) failDispatchContract(game);
}

function completeTaxiGoal(game, goal) {
  if (goal.done || statValue(game, goal) < goal.target) return;
  goal.done = true;
  game.score += goal.reward;
  game.player.boost = Math.min(100, game.player.boost + 24);
  game.reputation += 1;
  game.message = `${goal.label} +${goal.reward}`;
  game.messageTimer = 1.0;
  addFloater(game, game.player.x, game.player.y - 80, 'MISSION', '#5eead4');
  spawnParticles(game, game.player.x, game.player.y, '#5eead4', 18, 240);
}

function evaluateTaxiGoals(game) {
  game.goals.forEach((goal) => completeTaxiGoal(game, goal));
}

function addFloater(game, x, y, text, color = '#facc15') {
  game.floaters.push({ x, y, text, color, life: 1, maxLife: 1, vy: -45 });
}

function spawnParticles(game, x, y, color, count = 10, speed = 170) {
  for (let i = 0; i < count; i += 1) {
    const angle = game.elapsed * 7 + (Math.PI * 2 * i) / count;
    const burst = speed * (0.45 + (i % 4) * 0.18);
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * burst,
      vy: Math.sin(angle) * burst,
      life: 0.45,
      maxLife: 0.45,
      color,
      size: 4 + (i % 3) * 2,
    });
  }
}

function addFareHeat(game, amount, label, color = '#fef08a') {
  if (!game.carrying) return;
  const before = game.fareHeat;
  game.fareHeat = clamp(game.fareHeat + amount, 0, 120);
  game.passengerMood = Math.min(100, game.passengerMood + amount * 0.08);
  if (label && Math.floor(before / 30) < Math.floor(game.fareHeat / 30)) {
    addFloater(game, game.player.x, game.player.y - 74, label, color);
  }
}

function registerRushAction(game, source, heat = 8, color = '#fef08a') {
  if (!game.carrying || game.finished) return;
  const chained = game.rushTimer > 0 && game.rushChain > 0;
  const nextChain = chained ? game.rushChain + 1 : 1;
  game.rushChain = nextChain;
  game.rushTimer = 3.4;
  game.rushPeak = Math.max(game.rushPeak, nextChain);
  game.stats.bestRushChain = Math.max(game.stats.bestRushChain, nextChain);
  game.rushSource = source;
  game.rushPulseTimer = 0.38;
  game.fareHeat = clamp(game.fareHeat + heat + Math.min(18, nextChain * 1.8), 0, 150);
  game.passengerMood = Math.min(100, game.passengerMood + 1.5 + nextChain * 0.45);
  game.player.boost = Math.min(100, game.player.boost + 3 + nextChain * 0.9);

  if (chained) {
    game.stats.rushChains += 1;
    game.combo += 1;
    const bonus = Math.round(55 + nextChain * 28 + heat * 3);
    game.score += bonus;
    if (nextChain >= 4) game.time = Math.min(game.mode === 'learn' ? 136 : 116, game.time + 0.9);
    addFloater(game, game.player.x, game.player.y - 122, `RUSH x${nextChain}`, color);
    if (nextChain >= 3) {
      game.message = `Rush-Kette x${nextChain}: ${source}`;
      game.messageTimer = 0.78;
      spawnParticles(game, game.player.x, game.player.y, color, 10 + Math.min(nextChain, 7) * 2, 240);
    }
    evaluateTaxiGoals(game);
  }
}

function breakShiftStreak(game, label = 'Serie gebrochen') {
  if (!game.carrying || game.shiftStreak <= 0) return;
  game.shiftStreak = 0;
  game.stats.shiftStreak = 0;
  game.stats.streakBreaks += 1;
  game.rushChain = 0;
  game.rushTimer = 0;
  game.rushSource = '';
  addFloater(game, game.player.x, game.player.y - 92, label, '#fb7185');
}

function advanceShiftStreak(game, cleanFare) {
  const strongDelivery = cleanFare && game.passengerMood >= 70;
  if (!strongDelivery) {
    breakShiftStreak(game, 'Serie weg');
    return 0;
  }

  game.shiftStreak += 1;
  game.stats.shiftStreak = game.shiftStreak;
  game.stats.bestShiftStreak = Math.max(game.stats.bestShiftStreak, game.shiftStreak);
  const streakBonus = Math.round(120 + game.shiftStreak * 95 + game.passengerMood * 0.55 + game.routeGatesCollected * 28);
  game.reputation += game.shiftStreak >= 3 ? 1 : 0;
  addFloater(game, game.player.x, game.player.y - 112, `SERIE x${game.shiftStreak}`, '#fef08a');
  spawnParticles(game, game.player.x, game.player.y, '#fef08a', 18 + Math.min(game.shiftStreak, 5) * 3, 260);
  return streakBonus;
}

function recordFareIncident(game, amount = 1) {
  if (!game.carrying) return;
  game.fareIncidents += amount;
  game.rushChain = 0;
  game.rushTimer = 0;
  game.rushSource = '';
  breakShiftStreak(game);
}

function pushSkid(game, x, y, angle, alpha) {
  game.skidMarks.push({ x, y, angle, life: 1.45, maxLife: 1.45, alpha });
  if (game.skidMarks.length > 90) game.skidMarks.shift();
}

function resolveBuildingCollision(game, previousX, previousY) {
  const player = game.player;
  const margin = 24;
  const hit = BUILDINGS.find((building) => (
    player.x > building.x - margin
    && player.x < building.x + building.w + margin
    && player.y > building.y - margin
    && player.y < building.y + building.h + margin
  ));
  if (!hit) return;
  player.x = previousX;
  player.y = previousY;
  player.speed *= -0.18;
  player.impactTimer = 0.18;
  game.combo = 0;
  if (game.crashCooldown <= 0) {
    player.damage = Math.min(100, player.damage + 7);
    recordFareIncident(game);
    game.passengerMood = Math.max(0, game.passengerMood - (game.carrying ? 10 : 4));
    game.crashCooldown = 0.42;
    game.message = `Crash an ${hit.name}`;
    game.messageTimer = 0.7;
    spawnParticles(game, player.x, player.y, '#f97316', 14, 220);
  }
}

function scoreDelivery(game, job, cleanBonus) {
  game.deliveries += 1;
  game.stats.deliveries += 1;
  const damageDelta = Math.max(0, game.player.damage - game.pickupDamage);
  const cleanFare = game.fareIncidents === 0 && damageDelta < 12;
  if (cleanBonus >= 140 || cleanFare) game.stats.cleanDeliveries += 1;
  if (game.passengerMood >= 92 && cleanFare && game.routeGatesCollected >= Math.min(3, game.routeGates.length)) {
    game.stats.perfectDropoffs += 1;
    cleanBonus += 120;
    addFloater(game, game.player.x, game.player.y - 78, 'PERFECT', '#86efac');
  }
  const styleTip = Math.round(game.fareHeat * (game.mode === 'learn' ? 2.15 : 1.75) + Math.max(0, game.combo) * 28 + Math.max(0, game.time) * 0.45);
  if (styleTip >= 180) {
    game.stats.styleTips += 1;
    addFloater(game, game.player.x, game.player.y - 104, `TIP +${styleTip}`, '#fef08a');
  }
  if (game.mode === 'learn') game.stats.learnCorrect += 1;
  game.combo += 1;
  const timeBonus = Math.max(20, Math.round(game.time * 2.6));
  const comboBonus = game.combo * 70;
  const routeBonus = game.routeGates.filter((gate) => gate.collected).length * 55;
  const moodBonus = Math.round(game.passengerMood * (game.mode === 'learn' ? 1.8 : 1.25));
  const rushBonus = Math.round(game.rushPeak * 58 + game.fareHeat * 0.72);
  const streakBonus = advanceShiftStreak(game, cleanFare);
  const reward = job.reward + timeBonus + comboBonus + cleanBonus + routeBonus + moodBonus + styleTip + rushBonus + streakBonus;
  game.score += reward;
  game.reputation += Math.round((game.passengerMood / 100) * 2 + (cleanBonus > 100 ? 1 : 0));
  game.jobIndex += 1;
  game.carrying = false;
  game.routeGates = [];
  game.routeGatesCollected = 0;
  game.passengerMood = 100;
  game.fareHeat = 0;
  game.rushChain = 0;
  game.rushTimer = 0;
  game.rushPeak = 0;
  game.rushSource = '';
  game.rushPulseTimer = 0;
  game.fareIncidents = 0;
  game.pickupDamage = game.player.damage;
  game.time = Math.min(game.mode === 'learn' ? 130 : 112, game.time + (game.mode === 'learn' ? 18 : 15));
  game.player.boost = Math.min(100, game.player.boost + 34);
  game.message = game.mode === 'learn'
    ? `Richtig: ${job.cargo} -> ${job.target}${rushBonus > 0 ? ` · Rush +${rushBonus}` : ''}${streakBonus > 0 ? ` · Serie x${game.shiftStreak}` : ''}`
    : `${job.target} erreicht${rushBonus > 0 ? ` · Rush +${rushBonus}` : ''}${streakBonus > 0 ? ` · Serie x${game.shiftStreak}` : ''}`;
  game.messageTimer = 1.2;
  addFloater(game, game.player.x, game.player.y - 48, `+${reward}`, '#facc15');
  spawnParticles(game, game.player.x, game.player.y, job.color, 24, 280);
  evaluateTaxiGoals(game);
  if (game.deliveries >= game.targetDeliveries) {
    game.finished = true;
    game.message = game.mode === 'learn' ? 'Learncade-Schicht geschafft' : 'Schicht geschafft';
    game.messageTimer = 3;
  }
}

function resolveLearnPad(game, pad) {
  const job = currentJob(game);
  if (!game.carrying) return;
  if (pad.label === job.target) {
    scoreDelivery(game, job, game.player.damage < 12 ? 180 : 60);
    return;
  }
  if (game.wrongPadCooldown > 0) return;
  game.combo = 0;
  game.wrongPads += 1;
  recordFareIncident(game);
  game.wrongPadCooldown = 1.05;
  game.time = Math.max(4, game.time - 8);
  game.player.damage = Math.min(100, game.player.damage + 8);
  game.player.boost = Math.max(0, game.player.boost - 20);
  game.passengerMood = Math.max(0, game.passengerMood - 18);
  game.message = `${pad.label} passt nicht. Gesucht: ${job.target}`;
  game.messageTimer = 1.35;
  addFloater(game, pad.x, pad.y - 52, 'falsch', '#fb7185');
  spawnParticles(game, pad.x, pad.y, '#fb7185', 16, 220);
}

function updateRouteGates(game) {
  if (!game.carrying || game.routeGates.length === 0) return;
  const nextGate = game.routeGates.find((gate) => !gate.collected);
  if (!nextGate || distance(game.player, nextGate) > 62) return;
  nextGate.collected = true;
  game.routeGatesCollected += 1;
  game.stats.routeGates += 1;
  game.score += 45 + game.combo * 10;
  game.player.boost = Math.min(100, game.player.boost + 8);
  game.passengerMood = Math.min(100, game.passengerMood + 4);
  addFareHeat(game, nextGate.turn ? 10 : 7, nextGate.turn ? 'turn route' : null, '#67e8f9');
  registerRushAction(game, nextGate.turn ? 'Route-Turn' : 'Route-Gate', nextGate.turn ? 9 : 5, '#67e8f9');
  addFloater(game, nextGate.x, nextGate.y - 42, 'route +', '#67e8f9');
  spawnParticles(game, nextGate.x, nextGate.y, nextGate.color, 10, 170);
  evaluateTaxiGoals(game);
}

function updateTraffic(game, dt) {
  const player = game.player;
  const trafficPace = 1 + game.deliveries * 0.035 + (game.mode === 'learn' ? 0.02 : 0);
  const airborne = player.airTimer > 0.08;
  game.traffic.forEach((car) => {
    if (car.lane === 'h') {
      car.x += car.speed * trafficPace * dt;
      if (car.x < -95) car.x = WORLD_W + 95;
      if (car.x > WORLD_W + 95) car.x = -95;
    } else {
      car.y += car.speed * trafficPace * dt;
      if (car.y < -95) car.y = WORLD_H + 95;
      if (car.y > WORLD_H + 95) car.y = -95;
    }

    const d = distance(player, car);
    if (airborne && d < 72 && Math.abs(player.speed) > 210 && game.nearMissCooldown <= 0 && !car.nearAwarded) {
      car.nearAwarded = true;
      game.nearMiss += 1;
      game.stats.nearMiss += 1;
      game.score += 90 + game.combo * 12;
      addFareHeat(game, 10, 'air weave', '#facc15');
      registerRushAction(game, 'Air-Weave', 13, '#facc15');
      game.nearMissCooldown = 0.34;
      addFloater(game, player.x, player.y - 54, 'over traffic', '#facc15');
      return;
    }
    if (airborne) return;
    if (d < 50) {
      if (game.crashCooldown <= 0) {
        player.damage = Math.min(100, player.damage + (game.carrying ? 18 : 12));
        recordFareIncident(game);
        if (game.carrying) game.passengerMood = Math.max(0, game.passengerMood - 13);
        game.crashCooldown = 0.55;
        game.message = 'Crash!';
        game.messageTimer = 0.45;
        spawnParticles(game, player.x, player.y, '#f43f5e', 12, 180);
      }
      player.speed *= Math.pow(0.9, dt * 60);
      player.impactTimer = 0.16;
      game.combo = 0;
      car.nearAwarded = true;
    } else if (d < 88 && Math.abs(player.speed) > 180 && game.nearMissCooldown <= 0 && !car.nearAwarded) {
      car.nearAwarded = true;
      game.nearMiss += 1;
      game.stats.nearMiss += 1;
      game.score += 45 + game.combo * 8;
      addFareHeat(game, 6, 'near miss', '#67e8f9');
      registerRushAction(game, 'Near-Miss', 8, '#67e8f9');
      if (game.carrying) game.passengerMood = Math.max(0, game.passengerMood - 4);
      game.nearMissCooldown = 0.42;
      addFloater(game, player.x, player.y - 44, 'near +45', '#67e8f9');
    } else if (d > 140) {
      car.nearAwarded = false;
    }
  });
}

function updateServiceStations(game, dt) {
  game.serviceCooldown = Math.max(0, game.serviceCooldown - dt);
  if (game.serviceCooldown > 0) return;
  const station = SERVICE_STATIONS.find((candidate) => distance(game.player, candidate) < 66);
  if (!station) return;
  if (station.id === 'repair') {
    if (game.player.damage < 10) return;
    game.player.damage = Math.max(0, game.player.damage - 34);
    game.passengerMood = Math.min(100, game.passengerMood + 12);
    game.score = Math.max(0, game.score - station.cost);
    game.message = 'Repair-Stop';
    addFloater(game, station.x, station.y - 54, `-${station.cost}`, '#22c55e');
  } else {
    if (game.player.boost > 85) return;
    game.player.boost = 100;
    game.time = Math.max(6, game.time - 2);
    game.score = Math.max(0, game.score - station.cost);
    game.message = 'Boost-Tank voll';
    addFloater(game, station.x, station.y - 54, `-${station.cost}`, '#38bdf8');
  }
  game.serviceCooldown = 1.1;
  game.messageTimer = 0.9;
  spawnParticles(game, station.x, station.y, station.color, 16, 210);
}

function updateTurboPads(game) {
  if (game.turboCooldown > 0 || game.player.damage >= 96) return;
  const pad = TURBO_PADS.find((candidate) => distance(game.player, candidate) < 76);
  if (!pad || Math.abs(game.player.speed) < 130) return;
  game.player.driftBoostTimer = Math.max(game.player.driftBoostTimer, 1.1);
  game.player.boost = Math.min(100, game.player.boost + 12);
  game.stats.turboPads += 1;
  game.score += 80 + Math.max(0, game.combo) * 16;
  addFareHeat(game, 9, 'turbo tip', pad.color);
  registerRushAction(game, 'Turbo-Pad', 10, pad.color);
  game.turboCooldown = 0.72;
  game.message = 'Turbo-Pad';
  game.messageTimer = 0.62;
  addFloater(game, pad.x, pad.y - 54, 'TURBO', pad.color);
  spawnParticles(game, pad.x, pad.y, pad.color, 20, 280);
  evaluateTaxiGoals(game);
}

function updateStuntRamps(game) {
  const player = game.player;
  if (player.jumpCooldown > 0 || player.damage >= 98) return;
  const ramp = STUNT_RAMPS.find((candidate) => distance(player, candidate) < 72);
  if (!ramp || Math.abs(player.speed) < 210) return;
  const speedFactor = clamp(Math.abs(player.speed) / 520, 0.55, 1.25);
  const airTime = (0.48 + speedFactor * 0.5) * ramp.power;
  player.airTimer = Math.max(player.airTimer, airTime);
  player.airMax = Math.max(player.airMax, airTime);
  player.jumpCooldown = 1.25;
  player.driftBoostTimer = Math.max(player.driftBoostTimer, 0.42);
  player.boost = Math.min(100, player.boost + 10);
  game.combo += 1;
  game.stats.stuntJumps += 1;
  game.score += 170 + game.combo * 35 + Math.round(speedFactor * 70);
  addFareHeat(game, 16, 'stunt tip', ramp.color);
  registerRushAction(game, 'Stunt-Jump', 18, ramp.color);
  game.message = 'Stunt-Sprung';
  game.messageTimer = 0.8;
  addFloater(game, ramp.x, ramp.y - 58, `jump x${Math.max(1, game.combo)}`, ramp.color);
  spawnParticles(game, ramp.x, ramp.y, ramp.color, 24, 300);
  evaluateTaxiGoals(game);
}

function updateSpeedGates(game) {
  if (game.speedGateCooldown > 0) return;
  const player = game.player;
  const gate = SPEED_GATES.find((candidate) => distance(player, candidate) < 70);
  if (!gate) return;
  const speed = Math.abs(player.speed);
  game.speedGateCooldown = 0.62;
  if (speed >= gate.targetSpeed) {
    game.combo += 1;
    game.stats.speedGates += 1;
    game.score += 120 + game.combo * 24;
    addFareHeat(game, 12, 'speed tip', gate.color);
    registerRushAction(game, 'Speed-Gate', 14, gate.color);
    game.player.boost = Math.min(100, game.player.boost + 14);
    game.message = `${gate.label} Speed-Gate`;
    game.messageTimer = 0.7;
    addFloater(game, gate.x, gate.y - 52, 'speed +', gate.color);
    spawnParticles(game, gate.x, gate.y, gate.color, 18, 230);
    evaluateTaxiGoals(game);
  } else {
    addFloater(game, gate.x, gate.y - 52, `${Math.round(speed)}/${gate.targetSpeed}`, '#94a3b8');
  }
}

function updateShortcuts(game) {
  if (game.shortcutCooldown > 0) return;
  const player = game.player;
  const shortcut = SHORTCUTS.find((candidate) => isPointInRotatedBox(player, candidate, 28));
  if (!shortcut) return;
  const speed = Math.abs(player.speed);
  game.shortcutCooldown = 0.95;
  if (!game.carrying || speed < shortcut.minSpeed) {
    addFloater(game, shortcut.x, shortcut.y - 54, game.carrying ? `${Math.round(speed)}/${shortcut.minSpeed}` : 'leer', '#94a3b8');
    return;
  }
  game.combo += 1;
  game.stats.shortcuts += 1;
  game.score += shortcut.reward + game.combo * 32;
  game.time = Math.min(game.mode === 'learn' ? 135 : 116, game.time + 1.8);
  game.player.boost = Math.min(100, game.player.boost + 18);
  game.passengerMood = Math.min(100, game.passengerMood + 8);
  addFareHeat(game, 22, 'shortcut tip', shortcut.color);
  registerRushAction(game, 'Risk-Shortcut', 24, shortcut.color);
  game.message = `${shortcut.label} Shortcut`;
  game.messageTimer = 0.75;
  addFloater(game, shortcut.x, shortcut.y - 54, `+${shortcut.reward}`, shortcut.color);
  spawnParticles(game, shortcut.x, shortcut.y, shortcut.color, 22, 270);
  evaluateTaxiGoals(game);
}

function updateCityPickups(game) {
  if (game.pickupCooldown > 0) return;
  const pickup = game.cityPickups.find((candidate) => !candidate.collected && distance(game.player, candidate) < 52);
  if (!pickup) return;
  pickup.collected = true;
  game.pickupCooldown = 0.16;
  game.stats.pickups += 1;
  if (pickup.type === 'coin') {
    game.score += pickup.value;
  } else if (pickup.type === 'time') {
    game.time = Math.min(game.mode === 'learn' ? 135 : 116, game.time + pickup.value);
  } else if (pickup.type === 'boost') {
    game.player.boost = Math.min(100, game.player.boost + pickup.value);
  } else if (pickup.type === 'repair') {
    game.player.damage = Math.max(0, game.player.damage - pickup.value);
    game.passengerMood = Math.min(100, game.passengerMood + 8);
  }
  game.score += pickup.type === 'coin' ? 0 : 90;
  game.message = pickup.label;
  game.messageTimer = 0.72;
  addFloater(game, pickup.x, pickup.y - 48, pickup.label, pickup.color);
  spawnParticles(game, pickup.x, pickup.y, pickup.color, 18, 230);
  evaluateTaxiGoals(game);
}

function updateRoadworks(game) {
  if (game.hazardCooldown > 0) return;
  if (game.player.airTimer > 0.08) return;
  const roadwork = ROADWORKS.find((candidate) => isPointInRotatedBox(game.player, candidate, 30));
  if (!roadwork) return;
  game.player.speed *= -0.22;
  game.player.damage = Math.min(100, game.player.damage + (game.carrying ? 12 : 8));
  game.player.impactTimer = 0.2;
  recordFareIncident(game);
  game.passengerMood = Math.max(0, game.passengerMood - (game.carrying ? 14 : 5));
  game.combo = 0;
  game.hazardCooldown = 0.75;
  game.message = 'Baustelle!';
  game.messageTimer = 0.8;
  addFloater(game, roadwork.x, roadwork.y - 48, 'Aua', '#fb7185');
  spawnParticles(game, game.player.x, game.player.y, roadwork.color, 16, 220);
}

function updateRivals(game, dt) {
  const player = game.player;
  const pace = 1 + game.deliveries * 0.025;
  const airborne = player.airTimer > 0.08;
  game.rivals.forEach((rival) => {
    const target = rival.route[rival.waypoint % rival.route.length];
    const dToTarget = distance(rival, target);
    if (dToTarget < 54) {
      rival.waypoint = (rival.waypoint + 1) % rival.route.length;
    }
    const nextTarget = rival.route[rival.waypoint % rival.route.length];
    rival.angle = angleTo(rival, nextTarget);
    rival.x += Math.sin(rival.angle) * rival.speed * pace * dt;
    rival.y -= Math.cos(rival.angle) * rival.speed * pace * dt;

    const d = distance(player, rival);
    if (airborne && d < 88 && Math.abs(player.speed) > 230 && game.rivalPassCooldown <= 0 && !rival.nearAwarded) {
      rival.nearAwarded = true;
      game.rivalPassCooldown = 0.38;
      game.stats.rivalPasses += 1;
      game.score += 150 + game.combo * 20;
      game.player.boost = Math.min(100, game.player.boost + 16);
      addFareHeat(game, 14, 'air pass', '#fef08a');
      registerRushAction(game, 'Air-Rival', 17, '#fef08a');
      addFloater(game, player.x, player.y - 62, 'air pass', '#fef08a');
      evaluateTaxiGoals(game);
      return;
    }
    if (airborne) return;
    if (d < 56) {
      if (game.crashCooldown <= 0) {
        player.damage = Math.min(100, player.damage + (game.carrying ? 16 : 10));
        recordFareIncident(game);
        player.speed *= -0.12;
        player.impactTimer = 0.18;
        game.passengerMood = Math.max(0, game.passengerMood - (game.carrying ? 12 : 4));
        game.combo = 0;
        game.crashCooldown = 0.52;
        game.message = 'Rivalen-Crash';
        game.messageTimer = 0.62;
        spawnParticles(game, player.x, player.y, rival.color, 14, 230);
      }
      rival.nearAwarded = true;
    } else if (d < 104 && Math.abs(player.speed) > 260 && game.rivalPassCooldown <= 0 && !rival.nearAwarded) {
      rival.nearAwarded = true;
      game.rivalPassCooldown = 0.48;
      game.stats.rivalPasses += 1;
      game.score += 100 + game.combo * 18;
      game.player.boost = Math.min(100, game.player.boost + 12);
      addFareHeat(game, 11, 'rival pass', '#fef08a');
      registerRushAction(game, 'Rival-Pass', 13, '#fef08a');
      addFloater(game, player.x, player.y - 54, 'Rival +', '#fef08a');
      evaluateTaxiGoals(game);
    } else if (d > 150) {
      rival.nearAwarded = false;
    }
  });
}

function updateEffects(game, dt) {
  game.particles = game.particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * dt,
      y: particle.y + particle.vy * dt,
      vx: particle.vx * Math.pow(0.86, dt * 60),
      vy: particle.vy * Math.pow(0.86, dt * 60),
      life: particle.life - dt,
    }))
    .filter((particle) => particle.life > 0);

  game.floaters = game.floaters
    .map((floater) => ({ ...floater, y: floater.y + floater.vy * dt, life: floater.life - dt }))
    .filter((floater) => floater.life > 0);

  game.skidMarks = game.skidMarks
    .map((mark) => ({ ...mark, life: mark.life - dt }))
    .filter((mark) => mark.life > 0);
}

function updateGame(game, keys, dt) {
  game.elapsed += dt;
  game.messageTimer = Math.max(0, game.messageTimer - dt);
  game.nearMissCooldown = Math.max(0, game.nearMissCooldown - dt);
  game.rivalPassCooldown = Math.max(0, game.rivalPassCooldown - dt);
  game.turboCooldown = Math.max(0, game.turboCooldown - dt);
  game.pickupCooldown = Math.max(0, game.pickupCooldown - dt);
  game.hazardCooldown = Math.max(0, game.hazardCooldown - dt);
  game.speedGateCooldown = Math.max(0, game.speedGateCooldown - dt);
  game.shortcutCooldown = Math.max(0, game.shortcutCooldown - dt);
  game.wrongPadCooldown = Math.max(0, game.wrongPadCooldown - dt);
  game.crashCooldown = Math.max(0, game.crashCooldown - dt);
  game.rushTimer = Math.max(0, game.rushTimer - dt);
  game.rushPulseTimer = Math.max(0, game.rushPulseTimer - dt);
  if (game.rushTimer <= 0) {
    game.rushChain = 0;
    game.rushSource = '';
  }
  game.player.impactTimer = Math.max(0, game.player.impactTimer - dt);
  game.player.driftBoostTimer = Math.max(0, game.player.driftBoostTimer - dt);
  game.player.jumpCooldown = Math.max(0, game.player.jumpCooldown - dt);
  if (game.player.airTimer > 0) {
    game.player.airTimer = Math.max(0, game.player.airTimer - dt);
    game.stats.airSeconds += dt;
    if (game.player.airTimer <= 0) {
      const landingScore = Math.round(80 + game.player.airMax * 120 + Math.abs(game.player.speed) * 0.12);
      game.score += landingScore;
      game.player.boost = Math.min(100, game.player.boost + 8);
      game.message = 'Saubere Landung';
      game.messageTimer = 0.58;
      addFloater(game, game.player.x, game.player.y - 56, `land +${landingScore}`, '#fef08a');
      spawnParticles(game, game.player.x, game.player.y, '#fef08a', 12, 180);
      game.player.airMax = 0;
    }
  }
  updateEffects(game, dt);
  if (game.finished) return;
  updateDispatchContract(game, dt);

  const player = game.player;
  const previousX = player.x;
  const previousY = player.y;
  const onRoad = isOnRoad(player.x, player.y);
  player.grip = lerp(player.grip, onRoad ? 1 : 0.58, 0.08);
  if (game.carrying) {
    const speedStress = Math.max(0, Math.abs(player.speed) - 430) * 0.015;
    game.passengerMood = clamp(game.passengerMood - (onRoad ? 0.8 : 5.8) * dt - speedStress * dt, 0, 100);
  }

  const throttle = keys.up ? 1 : keys.down ? -0.65 : 0;
  const steer = (keys.left ? -1 : 0) + (keys.right ? 1 : 0);
  const braking = keys.brake || (keys.down && player.speed > 80);
  const manualBoost = keys.boost && player.boost > 0 && player.damage < 94 && onRoad;
  const driftBoost = player.driftBoostTimer > 0 && player.damage < 96;
  const boostPressed = manualBoost || driftBoost;
  const accel = driftBoost ? 720 : boostPressed ? 600 : 430;
  const maxSpeed = driftBoost ? 620 : boostPressed ? 560 : 370;
  const reverseLimit = -190;

  if (throttle !== 0) {
    player.speed += throttle * accel * dt;
  } else {
    player.speed *= Math.pow(onRoad ? 0.982 : 0.952, dt * 60);
  }

  if (braking) {
    player.speed -= Math.sign(player.speed) * Math.min(Math.abs(player.speed), 560 * dt);
  }

  player.speed = clamp(player.speed, reverseLimit, maxSpeed * player.grip);
  const speedFactor = clamp(Math.abs(player.speed) / 360, 0, 1.25);
  const steeringDirection = player.speed >= 0 ? 1 : -1;
  player.angle += steer * steeringDirection * (1.55 + speedFactor * 1.45) * dt * player.grip;

  const lateralSlip = Math.abs(steer) * speedFactor * (braking ? 1.35 : 0.8) + (onRoad ? 0 : 0.3);
  player.drift = lerp(player.drift, clamp(lateralSlip, 0, 1), 0.16);
  const chargingDrift = braking && Math.abs(steer) > 0 && onRoad && Math.abs(player.speed) > 190;
  if (chargingDrift) {
    player.driftCharge = clamp(player.driftCharge + (18 + speedFactor * 34) * dt, 0, 100);
    game.stats.driftSeconds += dt;
    evaluateTaxiGoals(game);
  } else if (game.previousBrake && player.driftCharge > 22) {
    const charge = player.driftCharge;
    player.driftBoostTimer = clamp(0.28 + charge / 120, 0.35, 1.18);
    player.boost = Math.min(100, player.boost + charge * 0.18);
    game.score += Math.round(charge * 3.2);
    addFareHeat(game, 8 + charge * 0.06, 'drift tip', '#67e8f9');
    registerRushAction(game, charge > 72 ? 'Power-Drift' : 'Drift-Boost', 8 + charge * 0.05, '#67e8f9');
    game.message = 'Drift-Boost';
    game.messageTimer = 0.55;
    addFloater(game, player.x, player.y - 52, `drift +${Math.round(charge * 3.2)}`, '#67e8f9');
    spawnParticles(game, player.x, player.y, '#67e8f9', 14, 210);
    player.driftCharge = 0;
  } else if (!chargingDrift) {
    player.driftCharge = Math.max(0, player.driftCharge - 34 * dt);
  }
  game.previousBrake = braking;
  const wobble = Math.sin(game.elapsed * 18) * player.drift * 0.012;
  player.x += Math.sin(player.angle + wobble) * player.speed * dt;
  player.y -= Math.cos(player.angle + wobble) * player.speed * dt;
  player.x = clamp(player.x, 38, WORLD_W - 38);
  player.y = clamp(player.y, 38, WORLD_H - 38);

  const roadX = ROAD_X.reduce((best, roadXValue) => (Math.abs(player.x - roadXValue) < Math.abs(player.x - best) ? roadXValue : best), ROAD_X[0]);
  const roadY = ROAD_Y.reduce((best, roadYValue) => (Math.abs(player.y - roadYValue) < Math.abs(player.y - best) ? roadYValue : best), ROAD_Y[0]);
  const roadDx = Math.abs(player.x - roadX);
  const roadDy = Math.abs(player.y - roadY);
  const nearIntersection = roadDx < ROAD_HALF * 0.9 && roadDy < ROAD_HALF * 0.9;
  if (onRoad && !nearIntersection && player.drift < 0.58 && Math.abs(player.speed) > 80) {
    const assist = clamp(Math.abs(player.speed) / 460, 0.08, 0.22) * dt * 4;
    if (roadDx < roadDy) player.x = lerp(player.x, roadX, assist);
    else player.y = lerp(player.y, roadY, assist);
  }

  if (player.drift > 0.36 && Math.abs(player.speed) > 135) {
    const rearX = player.x - Math.sin(player.angle) * 32;
    const rearY = player.y + Math.cos(player.angle) * 32;
    pushSkid(game, rearX, rearY, player.angle, player.drift);
  }

  if (boostPressed) {
    if (manualBoost) player.boost = Math.max(0, player.boost - 33 * dt);
    if (game.elapsed % 0.06 < dt) {
      spawnParticles(game, player.x - Math.sin(player.angle) * 40, player.y + Math.cos(player.angle) * 40, driftBoost ? '#67e8f9' : '#fef08a', 3, 150);
    }
  } else {
    player.boost = Math.min(100, player.boost + (onRoad ? 9 : 4) * dt);
  }

  if (!onRoad && Math.abs(player.speed) > 210) {
    player.damage = Math.min(100, player.damage + 2.4 * dt);
  }

  resolveBuildingCollision(game, previousX, previousY);
  updateTraffic(game, dt);
  updateRivals(game, dt);
  updateRoadworks(game);
  updateTurboPads(game);
  updateStuntRamps(game);
  updateSpeedGates(game);
  updateShortcuts(game);
  updateCityPickups(game);
  updateServiceStations(game, dt);

  const job = currentJob(game);
  if (!game.carrying && distance(player, job.from) < 58) {
    const activeTarget = getActiveTarget({ ...game, carrying: true });
    game.carrying = true;
    game.passengerMood = 100;
    game.fareHeat = 0;
    game.fareIncidents = 0;
    game.pickupDamage = player.damage;
    game.routeGates = activeTarget ? buildRouteGates(job.from, activeTarget, job.color) : [];
    game.routeGatesCollected = 0;
    game.message = game.mode === 'learn' ? `Wort geladen: ${job.cargo}` : `${job.pickup} an Bord`;
    game.messageTimer = 1.05;
    addFloater(game, job.from.x, job.from.y - 48, game.mode === 'learn' ? job.cargo : job.cargo, '#fef3c7');
    spawnParticles(game, job.from.x, job.from.y, job.color, 18, 220);
  }

  updateRouteGates(game);

  if (game.carrying) {
    if (game.mode === 'learn') {
      const pad = getLearnChoiceDestinations(game).find((candidate) => distance(player, candidate) < 64);
      if (pad) resolveLearnPad(game, pad);
    } else if (distance(player, job.to) < 64) {
      const cleanBonus = player.damage < 12 ? 140 : player.damage < 35 ? 60 : 0;
      scoreDelivery(game, job, cleanBonus);
    }
  }

  game.time -= dt;
  if (player.damage >= 100 || game.time <= 0) {
    game.finished = true;
    game.message = player.damage >= 100 ? 'Taxi kaputt' : 'Zeit abgelaufen';
    game.messageTimer = 3;
  }

  game.camera.x = lerp(game.camera.x, clamp(player.x - WIDTH * 0.5, 0, WORLD_W - WIDTH), 0.12);
  game.camera.y = lerp(game.camera.y, clamp(player.y - HEIGHT * 0.54, 0, WORLD_H - HEIGHT), 0.12);
}

function drawRoads(ctx) {
  ctx.fillStyle = '#172033';
  ROAD_X.forEach((x) => ctx.fillRect(x - ROAD_HALF, 0, ROAD_HALF * 2, WORLD_H));
  ROAD_Y.forEach((y) => ctx.fillRect(0, y - ROAD_HALF, WORLD_W, ROAD_HALF * 2));

  ctx.strokeStyle = 'rgba(255,255,255,.18)';
  ctx.lineWidth = 4;
  ctx.setLineDash([28, 26]);
  ROAD_X.forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, WORLD_H);
    ctx.stroke();
  });
  ROAD_Y.forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WORLD_W, y);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  ctx.fillStyle = 'rgba(248,250,252,.18)';
  ROAD_X.forEach((x) => {
    ROAD_Y.forEach((y) => {
      for (let i = -2; i <= 2; i += 1) {
        ctx.fillRect(x - ROAD_HALF + 12, y - 30 + i * 13, ROAD_HALF * 2 - 24, 5);
      }
    });
  });
}

function drawCity(ctx, game) {
  const bg = ctx.createLinearGradient(0, 0, 0, WORLD_H);
  bg.addColorStop(0, '#07111f');
  bg.addColorStop(0.5, '#0e1f35');
  bg.addColorStop(1, '#061016');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  PARKS.forEach((park) => {
    ctx.fillStyle = '#14532d';
    drawRoundedRect(ctx, park.x, park.y, park.w, park.h, 22);
    ctx.fill();
    ctx.fillStyle = 'rgba(187,247,208,.32)';
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.arc(park.x + 24 + i * 22, park.y + 28 + (i % 2) * 34, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  drawRoads(ctx);

  BUILDINGS.forEach((building, index) => {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.32)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = building.color;
    drawRoundedRect(ctx, building.x, building.y, building.w, building.h, 12);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'rgba(255,255,255,.09)';
    for (let x = building.x + 18; x < building.x + building.w - 18; x += 32) {
      for (let y = building.y + 18; y < building.y + building.h - 16; y += 28) {
        ctx.fillRect(x, y + (index % 2) * 3, 12, 12);
      }
    }
    ctx.fillStyle = 'rgba(226,232,240,.48)';
    ctx.font = '800 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(building.name, building.x + building.w / 2, building.y + building.h - 13);
    ctx.restore();
  });

  if (game.mode === 'learn') {
    const job = currentJob(game);
    const reveal = shouldRevealTarget(job);
    const visibleDestinations = game.carrying && !reveal ? getLearnChoiceDestinations(game) : LEARN_DESTINATIONS;
    visibleDestinations.forEach((destination) => {
      const active = game.carrying && reveal && destination.label === job.target;
      const choice = game.carrying && !reveal;
      ctx.save();
      ctx.globalAlpha = active ? 0.98 : choice ? 0.94 : 0.38;
      ctx.shadowColor = active || choice ? destination.color : 'transparent';
      ctx.shadowBlur = active ? 24 : choice ? 16 : 0;
      ctx.fillStyle = active ? destination.color : choice ? 'rgba(30,41,59,.96)' : 'rgba(51,65,85,.72)';
      drawRoundedRect(ctx, destination.x - 80, destination.y - 42, 160, 84, 18);
      ctx.fill();
      ctx.strokeStyle = active ? '#f8fafc' : choice ? destination.color : 'rgba(226,232,240,.24)';
      ctx.lineWidth = active ? 5 : choice ? 4 : 2;
      ctx.stroke();
      ctx.fillStyle = active ? '#020617' : '#f8fafc';
      ctx.font = destination.label.length > 12 ? '900 15px Outfit, sans-serif' : '900 20px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(destination.label, destination.x, destination.y, 140);
      ctx.restore();
    });
  }
}

function drawServiceStations(ctx, game) {
  SERVICE_STATIONS.forEach((station) => {
    const active = distance(game.player, station) < 86;
    ctx.save();
    ctx.globalAlpha = active ? 1 : 0.86;
    ctx.shadowColor = active ? station.color : 'rgba(0,0,0,.22)';
    ctx.shadowBlur = active ? 24 : 8;
    ctx.fillStyle = 'rgba(15,23,42,.9)';
    drawRoundedRect(ctx, station.x - 62, station.y - 38, 124, 76, 18);
    ctx.fill();
    ctx.strokeStyle = station.color;
    ctx.lineWidth = active ? 5 : 3;
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = station.color;
    ctx.font = '900 18px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(station.label, station.x, station.y - 6);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '800 11px Outfit, sans-serif';
    ctx.fillText(station.id === 'repair' ? 'Schaden runter' : 'Boost voll', station.x, station.y + 16);
    ctx.fillStyle = '#fde68a';
    ctx.fillText(`${station.cost} Score`, station.x, station.y + 32);
    ctx.restore();
  });
}

function drawTurboPads(ctx, game) {
  TURBO_PADS.forEach((pad, index) => {
    const active = distance(game.player, pad) < 95;
    const pulse = 1 + Math.sin(game.elapsed * 7 + index) * 0.06;
    ctx.save();
    ctx.translate(pad.x, pad.y);
    ctx.rotate(pad.angle);
    ctx.scale(pulse, pulse);
    ctx.shadowColor = active ? pad.color : 'rgba(0,0,0,.24)';
    ctx.shadowBlur = active ? 28 : 12;
    ctx.fillStyle = 'rgba(15,23,42,.88)';
    drawRoundedRect(ctx, -78, -28, 156, 56, 16);
    ctx.fill();
    ctx.strokeStyle = pad.color;
    ctx.lineWidth = active ? 5 : 3;
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = pad.color;
    ctx.globalAlpha = 0.72;
    ctx.beginPath();
    ctx.moveTo(-46, -13);
    ctx.lineTo(-16, 0);
    ctx.lineTo(-46, 13);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-6, -13);
    ctx.lineTo(24, 0);
    ctx.lineTo(-6, 13);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(34, -13);
    ctx.lineTo(64, 0);
    ctx.lineTo(34, 13);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pad.label, 0, -34);
    ctx.restore();
  });
}

function drawStuntRamps(ctx, game) {
  STUNT_RAMPS.forEach((ramp, index) => {
    const active = distance(game.player, ramp) < 88;
    const pulse = 1 + Math.sin(game.elapsed * 6 + index) * 0.04;
    ctx.save();
    ctx.translate(ramp.x, ramp.y);
    ctx.rotate(ramp.angle);
    ctx.scale(pulse, pulse);
    ctx.shadowColor = active ? ramp.color : 'rgba(0,0,0,.25)';
    ctx.shadowBlur = active ? 26 : 10;
    ctx.fillStyle = 'rgba(30,41,59,.94)';
    drawRoundedRect(ctx, -70, -28, 140, 56, 14);
    ctx.fill();
    ctx.strokeStyle = ramp.color;
    ctx.lineWidth = active ? 5 : 3;
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = ramp.color;
    ctx.beginPath();
    ctx.moveTo(-42, 18);
    ctx.lineTo(0, -20);
    ctx.lineTo(42, 18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#020617';
    ctx.font = '900 14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ramp.label, 0, 6);
    ctx.restore();
  });
}

function drawSpeedGates(ctx, game) {
  SPEED_GATES.forEach((gate, index) => {
    const active = distance(game.player, gate) < 92;
    ctx.save();
    ctx.translate(gate.x, gate.y);
    ctx.rotate(gate.angle);
    ctx.globalAlpha = active ? 1 : 0.74;
    ctx.shadowColor = active ? gate.color : 'rgba(0,0,0,.18)';
    ctx.shadowBlur = active ? 22 : 8;
    ctx.strokeStyle = gate.color;
    ctx.lineWidth = active ? 7 : 4;
    ctx.beginPath();
    ctx.moveTo(-64, -36);
    ctx.lineTo(-64, 36);
    ctx.moveTo(64, -36);
    ctx.lineTo(64, 36);
    ctx.moveTo(-64, -36);
    ctx.lineTo(64, -36);
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'rgba(2,6,23,.82)';
    drawRoundedRect(ctx, -38, -58, 76, 28, 10);
    ctx.fill();
    ctx.fillStyle = gate.color;
    ctx.font = '900 14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(gate.label, 0, -44);
    ctx.globalAlpha = 0.26 + Math.sin(game.elapsed * 7 + index) * 0.09;
    ctx.fillStyle = gate.color;
    ctx.fillRect(-64, -3, 128, 6);
    ctx.restore();
  });
}

function drawShortcuts(ctx, game) {
  SHORTCUTS.forEach((shortcut, index) => {
    const active = isPointInRotatedBox(game.player, shortcut, 48);
    ctx.save();
    ctx.translate(shortcut.x, shortcut.y);
    ctx.rotate(shortcut.angle);
    ctx.globalAlpha = active ? 0.98 : 0.58;
    ctx.shadowColor = active ? shortcut.color : 'rgba(0,0,0,.18)';
    ctx.shadowBlur = active ? 24 : 8;
    ctx.fillStyle = active ? 'rgba(20,184,166,.24)' : 'rgba(15,23,42,.5)';
    drawRoundedRect(ctx, -shortcut.w / 2, -shortcut.h / 2, shortcut.w, shortcut.h, 16);
    ctx.fill();
    ctx.strokeStyle = shortcut.color;
    ctx.lineWidth = active ? 5 : 3;
    ctx.setLineDash([16, 10]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = shortcut.color;
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(shortcut.label, 0, -shortcut.h / 2 - 12);
    ctx.globalAlpha = 0.28 + Math.sin(game.elapsed * 6 + index) * 0.08;
    ctx.fillStyle = shortcut.color;
    ctx.fillRect(-shortcut.w / 2 + 10, -shortcut.h / 2 + 10, shortcut.w - 20, shortcut.h - 20);
    ctx.restore();
  });
}

function drawRoadworks(ctx) {
  ROADWORKS.forEach((roadwork) => {
    ctx.save();
    ctx.translate(roadwork.x, roadwork.y);
    ctx.rotate(roadwork.angle);
    ctx.shadowColor = 'rgba(0,0,0,.36)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(30,41,59,.9)';
    drawRoundedRect(ctx, -roadwork.w / 2, -roadwork.h / 2, roadwork.w, roadwork.h, 12);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = roadwork.color;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.lineWidth = 8;
    ctx.strokeStyle = roadwork.color;
    for (let x = -roadwork.w / 2 + 18; x < roadwork.w / 2; x += 34) {
      ctx.beginPath();
      ctx.moveTo(x, -roadwork.h / 2 + 6);
      ctx.lineTo(x + 18, roadwork.h / 2 - 6);
      ctx.stroke();
    }
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(roadwork.label, 0, 0);
    ctx.restore();
  });
}

function drawCityPickups(ctx, game) {
  game.cityPickups.forEach((pickup, index) => {
    if (pickup.collected) return;
    const bob = Math.sin(game.elapsed * 5 + index) * 5;
    ctx.save();
    ctx.translate(pickup.x, pickup.y + bob);
    ctx.shadowColor = pickup.color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = pickup.color;
    if (pickup.type === 'coin') {
      ctx.beginPath();
      ctx.arc(0, 0, 21, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#78350f';
      ctx.font = '900 22px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 1);
    } else {
      drawRoundedRect(ctx, -28, -22, 56, 44, 14);
      ctx.fill();
      ctx.fillStyle = '#020617';
      ctx.font = '900 14px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pickup.label, 0, 1, 48);
    }
    ctx.restore();
  });
}

function drawJobMarker(ctx, game) {
  const job = currentJob(game);
  const target = getActiveTarget(game);
  if (!target) {
    return;
  }
  const label = game.carrying ? job.target : job.pickup;
  const radius = 33 + Math.sin(game.elapsed * 7) * 4;
  ctx.save();
  ctx.translate(target.x, target.y);
  ctx.shadowColor = job.color;
  ctx.shadowBlur = 24;
  ctx.fillStyle = game.carrying ? 'rgba(34,197,94,.88)' : 'rgba(250,204,21,.92)';
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 16px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 0, 0);
  ctx.restore();
}

function drawRouteGates(ctx, game) {
  const gates = getVisibleRouteGates(game);
  if (gates.length === 0) return;
  ctx.save();
  ctx.strokeStyle = game.carrying ? 'rgba(103,232,249,.48)' : 'rgba(250,204,21,.48)';
  ctx.lineWidth = game.carrying ? 8 : 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.setLineDash(game.carrying ? [] : [18, 16]);
  ctx.beginPath();
  let started = false;
  gates.forEach((gate) => {
    if (gate.collected) return;
    if (!started) {
      ctx.moveTo(gate.x, gate.y);
      started = true;
    }
    else ctx.lineTo(gate.x, gate.y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
  gates.forEach((gate) => {
    if (gate.collected) return;
    const pulse = 1 + Math.sin(game.elapsed * 5 + gate.index) * 0.08;
    ctx.save();
    ctx.translate(gate.x, gate.y);
    ctx.scale(pulse, pulse);
    ctx.globalAlpha = gate.preview ? 0.62 : 1;
    ctx.shadowColor = gate.color;
    ctx.shadowBlur = gate.preview ? 11 : 18;
    ctx.strokeStyle = gate.color;
    ctx.lineWidth = gate.preview ? 5 : 7;
    ctx.beginPath();
    ctx.arc(0, 0, gate.preview ? 25 : 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = gate.preview ? 'rgba(250,204,21,.86)' : 'rgba(2,6,23,.82)';
    ctx.beginPath();
    ctx.arc(0, 0, gate.preview ? 7 : 20, 0, Math.PI * 2);
    ctx.fill();
    if (!gate.preview) {
      ctx.fillStyle = '#f8fafc';
      ctx.font = '900 15px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${gate.index + 1}`, 0, 0);
    }
    ctx.restore();
  });
}

function drawCar(ctx, car, width, height, label, color, lights = true) {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle || 0);
  ctx.shadowColor = car.impactTimer > 0 ? '#fef3c7' : 'rgba(0,0,0,.34)';
  ctx.shadowBlur = car.impactTimer > 0 ? 26 : 14;
  ctx.fillStyle = color;
  drawRoundedRect(ctx, -width / 2, -height / 2, width, height, 10);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = 'rgba(248,250,252,.86)';
  drawRoundedRect(ctx, -width / 2 + 7, -height / 2 + 10, width - 14, height * 0.28, 6);
  ctx.fill();
  ctx.fillStyle = 'rgba(15,23,42,.78)';
  drawRoundedRect(ctx, -width / 2 + 10, -3, width - 20, height * 0.24, 5);
  ctx.fill();
  if (lights) {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-width / 2 + 7, -height / 2 - 1, 10, 6);
    ctx.fillRect(width / 2 - 17, -height / 2 - 1, 10, 6);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-width / 2 + 8, height / 2 - 8, 9, 5);
    ctx.fillRect(width / 2 - 17, height / 2 - 8, 9, 5);
  }
  if (label) {
    ctx.fillStyle = '#111827';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 8);
  }
  ctx.restore();
}

function drawWorldEffects(ctx, game) {
  game.skidMarks.forEach((mark) => {
    ctx.save();
    ctx.translate(mark.x, mark.y);
    ctx.rotate(mark.angle);
    ctx.globalAlpha = clamp((mark.life / mark.maxLife) * mark.alpha, 0, 0.42);
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(16, 0);
    ctx.stroke();
    ctx.restore();
  });

  game.particles.forEach((particle) => {
    ctx.save();
    ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  game.floaters.forEach((floater) => {
    ctx.save();
    ctx.globalAlpha = clamp(floater.life / floater.maxLife, 0, 1);
    ctx.fillStyle = floater.color;
    ctx.font = '900 18px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(floater.text, floater.x, floater.y);
    ctx.restore();
  });
}

function drawDirectionArrow(ctx, game) {
  const player = game.player;
  const target = getActiveTarget(game);
  if (!target) return;
  const dx = target.x - player.x;
  const dy = target.y - player.y;
  const angle = Math.atan2(dx, -dy) - player.angle;
  const d = Math.hypot(dx, dy);
  ctx.save();
  ctx.translate(player.x, player.y - 74);
  ctx.rotate(angle);
  ctx.fillStyle = game.carrying ? '#22c55e' : '#facc15';
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.lineTo(14, 12);
  ctx.lineTo(0, 4);
  ctx.lineTo(-14, 12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,.72)';
  drawRoundedRect(ctx, player.x - 42, player.y - 128, 84, 25, 9);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.round(d)} m`, player.x, player.y - 111);
  ctx.restore();
}

function drawHud(ctx, game) {
  const player = game.player;
  const job = currentJob(game);
  const target = getActiveTarget(game);
  const reveal = game.mode !== 'learn' || shouldRevealTarget(job);
  const contract = game.activeContract;
  const contractValue = contract ? Math.min(contract.target, dispatchProgress(game)) : 0;
  const contractRatio = contract ? clamp(contractValue / contract.target, 0, 1) : 0;
  const rushActive = game.rushChain > 0;
  const rushRatio = clamp(game.rushTimer / 3.4, 0, 1);
  const rushLabel = rushActive
    ? `Rush x${game.rushChain} · ${game.rushSource}`
    : `Rush Best x${game.stats.bestRushChain || 0}`;
  const mission = game.carrying
    ? game.mode === 'learn'
      ? reveal
        ? `Lesefahrt: ${job.cargo} -> ${job.target}`
        : `Waehle: ${job.cargo} · ${job.kind}`
      : `Liefern: ${job.cargo} -> ${job.target}`
    : `Abholen: ${job.pickup}`;
  ctx.save();

  if (game.isPortraitTouch) {
    const panelX = CENTER_X - 185;
    const panelW = 370;
    const panelLeft = panelX + 18;
    const panelRight = panelX + panelW - 18;
    ctx.fillStyle = 'rgba(2,6,23,.82)';
    drawRoundedRect(ctx, panelX, 18, panelW, 126, 18);
    ctx.fill();
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'left';
    drawFittedText(ctx, game.mode === 'learn' ? 'Learn Taxi Rush' : 'Taxi Rush Pro', panelLeft, 52, 172, 21, 13);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#facc15';
    ctx.font = '900 28px Outfit, sans-serif';
    ctx.fillText(`${Math.ceil(game.time)}s`, panelRight, 52);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.fillText(`Fahrten ${game.deliveries}/${game.targetDeliveries} · Serie x${game.shiftStreak} · Rush x${game.rushChain} · Tip ${Math.round(game.fareHeat)}`, panelRight, 78);
    ctx.textAlign = 'left';
    ctx.fillStyle = job.color;
    drawFittedText(ctx, mission, panelLeft, 108, 334, 18, 11);
    ctx.fillStyle = '#94a3b8';
    drawFittedText(ctx, game.mode === 'learn' ? `${job.subject}: ${job.hint}` : job.hint, panelLeft, 130, 334, 13, 9, 800);

    ctx.fillStyle = 'rgba(2,6,23,.72)';
    drawRoundedRect(ctx, panelX, 152, panelW, 176, 18);
    ctx.fill();
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.fillText('PRO-MISSIONEN', panelLeft, 178);
    game.goals.slice(0, 4).forEach((goal, index) => {
      const progress = Math.floor(statValue(game, goal));
      ctx.fillStyle = goal.done ? '#86efac' : '#cbd5e1';
      ctx.fillText(`${goal.done ? 'OK' : `${Math.min(progress, goal.target)}/${goal.target}`} ${goal.label}`, panelLeft, 200 + index * 15);
    });
    ctx.fillStyle = '#fde68a';
    ctx.font = '900 12px Outfit, sans-serif';
    ctx.fillText('DISPATCH', panelLeft, 270);
    ctx.fillStyle = contract ? '#fef3c7' : '#cbd5e1';
    drawFittedText(ctx, contract ? contract.label : `naechster in ${Math.ceil(game.contractCooldown)}s`, panelLeft, 292, 240, 12, 9, 900);
    ctx.fillStyle = 'rgba(148,163,184,.22)';
    drawRoundedRect(ctx, panelLeft, 302, 224, 9, 5);
    ctx.fill();
    ctx.fillStyle = contract ? '#facc15' : '#64748b';
    drawRoundedRect(ctx, panelLeft, 302, 224 * (contract ? contractRatio : 1 - clamp(game.contractCooldown / 2.1, 0, 1)), 9, 5);
    ctx.fill();
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '800 10px Outfit, sans-serif';
    ctx.fillText(contract ? `${contractValue}/${contract.target} · ${Math.ceil(game.contractTimer)}s · M${game.contractMedals}` : `Medaillen ${game.contractMedals} · Serie-Best ${game.stats.bestShiftStreak}`, panelLeft, 323);

    if (rushActive) {
      ctx.fillStyle = 'rgba(120,53,15,.48)';
      drawRoundedRect(ctx, panelLeft + 246, 284, 94, 34, 10);
      ctx.fill();
      ctx.fillStyle = '#fef3c7';
      ctx.font = '900 10px Outfit, sans-serif';
      ctx.fillText(rushLabel, panelLeft + 254, 300, 82);
      ctx.fillStyle = 'rgba(15,23,42,.72)';
      drawRoundedRect(ctx, panelLeft + 254, 306, 74, 6, 3);
      ctx.fill();
      ctx.fillStyle = '#facc15';
      drawRoundedRect(ctx, panelLeft + 254, 306, 74 * rushRatio, 6, 3);
      ctx.fill();
    }

    const meterY = HEIGHT - 116;
    ctx.fillStyle = 'rgba(2,6,23,.78)';
    drawRoundedRect(ctx, panelX, meterY, panelW, 72, 16);
    ctx.fill();
    const meters = [
      ['BOOST', player.boost, '#38bdf8'],
      ['SCHADEN', player.damage, player.damage > 70 ? '#ef4444' : '#f97316'],
      ['LAUNE', game.passengerMood, game.passengerMood > 70 ? '#22c55e' : game.passengerMood > 35 ? '#facc15' : '#ef4444'],
      ['DRIFT', player.driftBoostTimer > 0 ? 100 : player.driftCharge, player.driftBoostTimer > 0 ? '#67e8f9' : '#a78bfa'],
    ];
    meters.forEach(([label, value, color], index) => {
      const x = panelLeft + index * 86;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '800 10px Outfit, sans-serif';
      ctx.fillText(label, x, meterY + 24);
      ctx.fillStyle = 'rgba(255,255,255,.18)';
      drawRoundedRect(ctx, x, meterY + 36, 72, 10, 5);
      ctx.fill();
      ctx.fillStyle = color;
      drawRoundedRect(ctx, x, meterY + 36, 72 * clamp(value / 100, 0, 1), 10, 5);
      ctx.fill();
    });
    ctx.restore();
    return;
  }

  ctx.fillStyle = 'rgba(2,6,23,.82)';
  drawRoundedRect(ctx, 22, 20, 486, 132, 18);
  ctx.fill();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '900 24px Outfit, sans-serif';
  ctx.fillText(game.mode === 'learn' ? 'Faska Learn Taxi Rush' : 'Faska Taxi Rush Pro', 44, 55);
  ctx.font = '800 14px Outfit, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(game.mode === 'learn' ? `${job.subject} · ${job.kind} · ${job.hint}` : job.hint, 44, 84, 442);
  ctx.fillStyle = job.color;
  ctx.font = '900 18px Outfit, sans-serif';
  ctx.fillText(mission, 44, 117, 442);

  ctx.fillStyle = 'rgba(2,6,23,.82)';
  drawRoundedRect(ctx, WIDTH - 432, 20, 410, 132, 18);
  ctx.fill();
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 23px Outfit, sans-serif';
  ctx.fillText(`Score ${game.score}`, WIDTH - 44, 55);
  ctx.fillStyle = '#fde68a';
  ctx.fillText(`${Math.ceil(game.time)}s`, WIDTH - 44, 84);
  ctx.fillStyle = '#67e8f9';
  ctx.font = '900 16px Outfit, sans-serif';
  ctx.fillText(`Fahrten ${game.deliveries}/${game.targetDeliveries} · Combo x${Math.max(1, game.combo)} · Serie x${game.shiftStreak} · Rep ${game.reputation}`, WIDTH - 44, 116);
  ctx.fillStyle = '#fef08a';
  ctx.font = '900 13px Outfit, sans-serif';
  ctx.fillText(`Style-Tip ${Math.round(game.fareHeat)} · ${rushLabel} · Incidents ${game.fareIncidents}`, WIDTH - 44, 138);
  if (rushActive) {
    ctx.fillStyle = 'rgba(15,23,42,.76)';
    drawRoundedRect(ctx, WIDTH - 214, 126, 170, 9, 5);
    ctx.fill();
    ctx.fillStyle = game.rushPulseTimer > 0 ? '#fef08a' : '#facc15';
    drawRoundedRect(ctx, WIDTH - 214, 126, 170 * rushRatio, 9, 5);
    ctx.fill();
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(2,6,23,.76)';
  drawRoundedRect(ctx, 22, 162, 486, 220, 18);
  ctx.fill();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '900 13px Outfit, sans-serif';
  ctx.fillText('PRO-MISSIONEN', 44, 190);
  game.goals.slice(0, 6).forEach((goal, index) => {
    const progress = goal.type === 'driftSeconds' ? Math.floor(statValue(game, goal)) : Math.floor(statValue(game, goal));
    ctx.fillStyle = goal.done ? '#86efac' : '#cbd5e1';
    ctx.fillText(`${goal.done ? 'OK' : `${Math.min(progress, goal.target)}/${goal.target}`} ${goal.label}`, 44, 212 + index * 15);
  });
  ctx.fillStyle = '#fde68a';
  ctx.font = '900 13px Outfit, sans-serif';
  ctx.fillText('DISPATCH-ZENTRALE', 44, 318);
  ctx.fillStyle = contract ? '#fef3c7' : '#cbd5e1';
  ctx.font = '900 14px Outfit, sans-serif';
  ctx.fillText(contract ? contract.label : `Naechster Auftrag in ${Math.ceil(game.contractCooldown)}s`, 44, 342, 330);
  ctx.fillStyle = 'rgba(148,163,184,.22)';
  drawRoundedRect(ctx, 44, 354, 280, 10, 5);
  ctx.fill();
  ctx.fillStyle = contract ? '#facc15' : '#64748b';
  drawRoundedRect(ctx, 44, 354, 280 * (contract ? contractRatio : 1 - clamp(game.contractCooldown / 2.1, 0, 1)), 10, 5);
  ctx.fill();
  ctx.fillStyle = contract && game.contractTimer < 8 ? '#fb7185' : '#cbd5e1';
  ctx.font = '900 12px Outfit, sans-serif';
  ctx.fillText(contract ? `${contractValue}/${contract.target} · ${Math.ceil(game.contractTimer)}s · Medaillen ${game.contractMedals}` : `Medaillen ${game.contractMedals} · Verpasst ${game.contractFails} · Serie-Best ${game.stats.bestShiftStreak}`, 44, 376);

  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, WIDTH - 640, HEIGHT - 92, 616, 66, 16);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '800 12px Outfit, sans-serif';
  ctx.fillText('BOOST', WIDTH - 612, HEIGHT - 62);
  ctx.fillText('SCHADEN', WIDTH - 460, HEIGHT - 62);
  ctx.fillText('LAUNE', WIDTH - 306, HEIGHT - 62);
  ctx.fillText('DRIFT', WIDTH - 152, HEIGHT - 62);
  if (player.airTimer > 0) {
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 16px Outfit, sans-serif';
    ctx.fillText(`AIR ${player.airTimer.toFixed(1)}s`, WIDTH - 272, HEIGHT - 104);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '800 12px Outfit, sans-serif';
  }
  ctx.fillStyle = 'rgba(255,255,255,.18)';
  drawRoundedRect(ctx, WIDTH - 612, HEIGHT - 52, 118, 12, 6);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  drawRoundedRect(ctx, WIDTH - 612, HEIGHT - 52, 118 * (player.boost / 100), 12, 6);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.18)';
  drawRoundedRect(ctx, WIDTH - 460, HEIGHT - 52, 118, 12, 6);
  ctx.fill();
  ctx.fillStyle = player.damage > 70 ? '#ef4444' : '#f97316';
  drawRoundedRect(ctx, WIDTH - 460, HEIGHT - 52, 118 * (player.damage / 100), 12, 6);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.18)';
  drawRoundedRect(ctx, WIDTH - 306, HEIGHT - 52, 118, 12, 6);
  ctx.fill();
  ctx.fillStyle = game.passengerMood > 70 ? '#22c55e' : game.passengerMood > 35 ? '#facc15' : '#ef4444';
  drawRoundedRect(ctx, WIDTH - 306, HEIGHT - 52, 118 * (game.passengerMood / 100), 12, 6);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.18)';
  drawRoundedRect(ctx, WIDTH - 152, HEIGHT - 52, 118, 12, 6);
  ctx.fill();
  ctx.fillStyle = player.driftBoostTimer > 0 ? '#67e8f9' : '#a78bfa';
  drawRoundedRect(ctx, WIDTH - 152, HEIGHT - 52, 118 * (player.driftBoostTimer > 0 ? 1 : player.driftCharge / 100), 12, 6);
  ctx.fill();

  ctx.fillStyle = 'rgba(2,6,23,.78)';
  drawRoundedRect(ctx, WIDTH - 214, 170, 190, 132, 18);
  ctx.fill();
  ctx.strokeStyle = 'rgba(226,232,240,.18)';
  ctx.stroke();
  const miniX = WIDTH - 198;
  const miniY = 186;
  const miniW = 158;
  const miniH = 94;
  ctx.fillStyle = 'rgba(15,23,42,.75)';
  drawRoundedRect(ctx, miniX, miniY, miniW, miniH, 12);
  ctx.fill();
  const sx = miniW / WORLD_W;
  const sy = miniH / WORLD_H;
  ctx.fillStyle = '#334155';
  ROAD_X.forEach((x) => ctx.fillRect(miniX + x * sx - 2, miniY, 4, miniH));
  ROAD_Y.forEach((y) => ctx.fillRect(miniX, miniY + y * sy - 2, miniW, 4));
  ctx.fillStyle = '#38bdf8';
  TURBO_PADS.forEach((pad) => {
    ctx.fillRect(miniX + pad.x * sx - 2, miniY + pad.y * sy - 2, 4, 4);
  });
  ctx.fillStyle = '#facc15';
  STUNT_RAMPS.forEach((ramp) => {
    ctx.fillRect(miniX + ramp.x * sx - 2, miniY + ramp.y * sy - 2, 4, 4);
  });
  ctx.fillStyle = '#67e8f9';
  SPEED_GATES.forEach((gate) => {
    ctx.fillRect(miniX + gate.x * sx - 2, miniY + gate.y * sy - 2, 4, 4);
  });
  ctx.fillStyle = '#5eead4';
  SHORTCUTS.forEach((shortcut) => {
    ctx.fillRect(miniX + shortcut.x * sx - 2, miniY + shortcut.y * sy - 2, 4, 4);
  });
  ctx.fillStyle = '#fb7185';
  ROADWORKS.forEach((roadwork) => {
    ctx.fillRect(miniX + roadwork.x * sx - 2, miniY + roadwork.y * sy - 2, 4, 4);
  });
  ctx.fillStyle = '#facc15';
  game.cityPickups.forEach((pickup) => {
    if (pickup.collected) return;
    ctx.fillRect(miniX + pickup.x * sx - 1.5, miniY + pickup.y * sy - 1.5, 3, 3);
  });
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(miniX + player.x * sx, miniY + player.y * sy, 4, 0, Math.PI * 2);
  ctx.fill();
  if (target) {
    ctx.fillStyle = game.carrying ? '#22c55e' : '#f97316';
    ctx.beginPath();
    ctx.arc(miniX + target.x * sx, miniY + target.y * sy, 4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#a78bfa';
    getLearnChoiceDestinations(game).forEach((destination) => {
      ctx.beginPath();
      ctx.arc(miniX + destination.x * sx, miniY + destination.y * sy, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.fillStyle = '#67e8f9';
  getVisibleRouteGates(game).forEach((gate) => {
    if (gate.collected) return;
    ctx.beginPath();
    ctx.arc(miniX + gate.x * sx, miniY + gate.y * sy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  ctx.translate(-game.camera.x, -game.camera.y);
  drawCity(ctx, game);
  drawTurboPads(ctx, game);
  drawStuntRamps(ctx, game);
  drawSpeedGates(ctx, game);
  drawShortcuts(ctx, game);
  drawRoadworks(ctx);
  drawServiceStations(ctx, game);
  drawJobMarker(ctx, game);
  drawRouteGates(ctx, game);
  drawCityPickups(ctx, game);
  drawWorldEffects(ctx, game);
  game.traffic.forEach((car) => {
    const angle = car.lane === 'h' ? (car.speed >= 0 ? Math.PI / 2 : -Math.PI / 2) : (car.speed >= 0 ? Math.PI : 0);
    drawCar(ctx, { ...car, angle }, 40, 70, '', car.color, true);
  });
  game.rivals.forEach((rival) => {
    drawCar(ctx, rival, 44, 76, rival.label, rival.color, true);
  });
  drawDirectionArrow(ctx, game);
  if (game.player.airTimer > 0) {
    const airPct = game.player.airMax > 0 ? game.player.airTimer / game.player.airMax : 0;
    ctx.save();
    ctx.globalAlpha = 0.38;
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.ellipse(game.player.x + 8, game.player.y + 36, 34 + airPct * 18, 16 + airPct * 8, game.player.angle, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  drawCar(ctx, game.player, CAR_W, CAR_H, 'TAXI', '#facc15', true);
  ctx.restore();
  drawHud(ctx, game);

  if (game.messageTimer > 0 || game.finished) {
    ctx.save();
    ctx.textAlign = 'center';
    const messageY = game.finished ? HEIGHT / 2 - 29 : game.isPortraitTouch ? 286 : 160;
    const messageW = game.isPortraitTouch ? 360 : 580;
    ctx.fillStyle = game.finished ? 'rgba(15,23,42,.84)' : 'rgba(15,23,42,.64)';
    drawRoundedRect(ctx, WIDTH / 2 - messageW / 2, messageY, messageW, 58, 18);
    ctx.fill();
    ctx.fillStyle = game.finished ? '#fecaca' : '#fef3c7';
    drawFittedText(ctx, game.message, WIDTH / 2, messageY + 37, messageW - 42, game.isPortraitTouch ? 18 : 25, game.isPortraitTouch ? 10 : 14);
    ctx.restore();
  }
}

export default function FaskaTaxiRushSwarm() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameRef = useRef(makeInitialGame('arcade'));
  const keysRef = useRef({ up: false, down: false, left: false, right: false, boost: false, brake: false });
  const modeRef = useRef('arcade');
  const [mode, setMode] = useState('arcade');
  const [endState, setEndState] = useState(null);

  const resetKeys = useCallback(() => {
    keysRef.current = { up: false, down: false, left: false, right: false, boost: false, brake: false };
  }, []);

  const setGameMode = useCallback((nextMode) => {
    resetKeys();
    modeRef.current = nextMode;
    setMode(nextMode);
    setEndState(null);
    gameRef.current = makeInitialGame(nextMode);
  }, [resetKeys]);

  const restart = useCallback(() => {
    resetKeys();
    setEndState(null);
    gameRef.current = makeInitialGame(modeRef.current);
  }, [resetKeys]);

  const triggerManualJump = useCallback(() => {
    const player = gameRef.current.player;
    if (player.jumpCooldown > 0 || Math.abs(player.speed) <= 130) return;
    player.airTimer = Math.max(player.airTimer, 0.62);
    player.airMax = Math.max(player.airMax, 0.62);
    player.jumpCooldown = 1.1;
    gameRef.current.stats.stuntJumps += 1;
    gameRef.current.score += 95;
    registerRushAction(gameRef.current, 'Hop', 9, '#38bdf8');
    gameRef.current.message = 'Hop';
    gameRef.current.messageTimer = 0.5;
    evaluateTaxiGoals(gameRef.current);
  }, []);

  const setVirtualKey = useCallback((key, pressed) => {
    keysRef.current[key] = pressed;
  }, []);

  const pressHandlers = useCallback((key) => ({
    onPointerDown: (event) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      setVirtualKey(key, true);
    },
    onPointerUp: (event) => {
      event.preventDefault();
      setVirtualKey(key, false);
    },
    onPointerCancel: () => setVirtualKey(key, false),
    onPointerLeave: () => setVirtualKey(key, false),
  }), [setVirtualKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;
    let raf = 0;
    let last = performance.now();

    const keyDown = (event) => {
      const keys = keysRef.current;
      if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') keys.up = true;
      if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') keys.down = true;
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') keys.left = true;
      if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') keys.right = true;
      if (event.key === ' ' || event.code === 'Space') keys.boost = true;
      if (event.key === 'Shift') keys.brake = true;
      if (event.key === 'j' || event.key === 'J') triggerManualJump();
      if (event.key === 'm' || event.key === 'M') setGameMode(modeRef.current === 'learn' ? 'arcade' : 'learn');
      if (event.key === 'r' || event.key === 'R') restart();
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Shift'].includes(event.key) || event.code === 'Space') {
        event.preventDefault();
      }
    };

    const keyUp = (event) => {
      const keys = keysRef.current;
      if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') keys.up = false;
      if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') keys.down = false;
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') keys.left = false;
      if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') keys.right = false;
      if (event.key === ' ' || event.code === 'Space') keys.boost = false;
      if (event.key === 'Shift') keys.brake = false;
    };

    const blur = () => resetKeys();
    const loop = (now) => {
      const dt = Math.min(0.03, (now - last) / 1000 || 0);
      last = now;
      try {
        gameRef.current.isPortraitTouch = window.matchMedia('(max-width: 700px) and (orientation: portrait)').matches;
        const wasFinished = gameRef.current.finished;
        updateGame(gameRef.current, keysRef.current, dt);
        renderGame(ctx, gameRef.current);
        if (!wasFinished && gameRef.current.finished) {
          setEndState({
            message: gameRef.current.message,
            score: gameRef.current.score,
            deliveries: gameRef.current.deliveries,
            reputation: gameRef.current.reputation,
            wrongPads: gameRef.current.wrongPads,
            bestShiftStreak: gameRef.current.stats.bestShiftStreak,
            bestRushChain: gameRef.current.stats.bestRushChain,
          });
        }
      } catch (err) {
        console.error('Game loop error:', err);
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
  }, [resetKeys, restart, setGameMode, triggerManualJump]);

  const driveButtonStyle = {
    width: 62,
    height: 62,
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,.18)',
    background: 'rgba(15,23,42,.72)',
    color: '#f8fafc',
    font: '900 18px Outfit, sans-serif',
    touchAction: 'none',
    userSelect: 'none',
    boxShadow: '0 14px 34px rgba(0,0,0,.28)',
  };
  const actionButtonStyle = {
    ...driveButtonStyle,
    width: 94,
    height: 58,
    fontSize: 13,
  };
  const canvasTopChrome = 'calc((100vh - min(100vh, calc(100vw * 9 / 16))) / 2 + 18px)';
  const canvasBottomChrome = 'calc((100vh - min(100vh, calc(100vw * 9 / 16))) / 2 + 24px)';

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#020617', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
      <canvas
        className="taxi-canvas"
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
      <div className="taxi-vignette" style={{
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
      <div className="taxi-modebar" style={{ position: 'fixed', top: canvasTopChrome, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 10 }}>
        <button className="btn-primary" onClick={() => setGameMode('arcade')} style={{ opacity: mode === 'arcade' ? 1 : 0.55 }}>
          Normal
        </button>
        <button className="btn-primary" onClick={() => setGameMode('learn')} style={{ opacity: mode === 'learn' ? 1 : 0.55 }}>
          Learncade
        </button>
        <button className="btn-primary" onClick={restart}>Restart</button>
        <button className="btn-primary" onClick={() => navigate('/')}>Exit</button>
      </div>
      <div className="taxi-touch-controls taxi-drive-controls" style={{
        position: 'fixed', left: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'grid', gridTemplateColumns: '62px 62px 62px', gridTemplateRows: '62px',
        gap: 8, touchAction: 'none',
      }}>
        <button aria-label="Links lenken" style={driveButtonStyle} {...pressHandlers('left')}>LEFT</button>
        <button aria-label="Rueckwaerts" style={driveButtonStyle} {...pressHandlers('down')}>BACK</button>
        <button aria-label="Rechts lenken" style={driveButtonStyle} {...pressHandlers('right')}>RIGHT</button>
      </div>
      <div className="taxi-touch-controls taxi-action-controls" style={{
        position: 'fixed', right: 24, bottom: canvasBottomChrome, zIndex: 10,
        display: 'grid', gridTemplateColumns: 'repeat(2, 96px)', gap: 10, alignItems: 'end', touchAction: 'none',
      }}>
        <button aria-label="Gas" style={{ ...actionButtonStyle, width: 104, height: 74, background: 'rgba(34,197,94,.82)', color: '#052e16' }} {...pressHandlers('up')}>
          GAS
        </button>
        <button aria-label="Bremse" style={actionButtonStyle} {...pressHandlers('brake')}>DRIFT</button>
        <button aria-label="Boost" style={{ ...actionButtonStyle, width: 102, height: 74, background: 'rgba(250,204,21,.82)', color: '#111827' }} {...pressHandlers('boost')}>
          BOOST
        </button>
        <button
          aria-label="Sprung"
          style={{ ...actionButtonStyle, background: 'rgba(56,189,248,.82)', color: '#082f49' }}
          onPointerDown={(event) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture?.(event.pointerId);
            triggerManualJump();
          }}
        >
          JUMP
        </button>
      </div>
      {endState && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2,6,23,.72)', zIndex: 20, flexDirection: 'column', gap: 18,
        }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: '#f8fafc' }}>{endState.message}</div>
          <div style={{ fontSize: 28, color: '#facc15', fontWeight: 900 }}>
            Score {endState.score} · Fahrten {endState.deliveries} · Rep {endState.reputation} · Serie {endState.bestShiftStreak} · Rush {endState.bestRushChain} · Fehler {endState.wrongPads}
          </div>
          <button className="btn-primary" onClick={restart}>Noch eine Fahrt</button>
        </div>
      )}
      <style>{`
        @media (max-width: 700px) and (orientation: portrait) {
          .taxi-canvas,
          .taxi-vignette {
            width: max(100dvw, calc((100dvh - 230px) * 16 / 9)) !important;
            height: calc(100dvh - 230px) !important;
            left: 50% !important;
            right: auto !important;
            top: 70px !important;
            bottom: auto !important;
            margin: 0 !important;
            transform: translateX(-50%) !important;
          }

          .taxi-modebar {
            top: 10px !important;
            transform: translateX(-50%) scale(.82) !important;
            transform-origin: top center !important;
          }

          .taxi-touch-controls {
            bottom: 14px !important;
          }

          .taxi-drive-controls {
            left: 2px !important;
            transform: scale(.82) !important;
            transform-origin: bottom left !important;
          }

          .taxi-action-controls {
            right: 4px !important;
            display: grid !important;
            grid-template-columns: repeat(2, 74px) !important;
            gap: 8px !important;
            align-items: end !important;
          }

          .taxi-action-controls button {
            width: 74px !important;
            height: 56px !important;
            min-width: 0 !important;
            border-radius: 13px !important;
            font-size: 10px !important;
            padding: 0 !important;
          }
        }

        @media (pointer: fine), (min-width: 900px) {
          .taxi-touch-controls {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
