import { useEffect, useRef, useState } from "react";
import { FAST_FLOW_CHALLENGES as CHALLENGES } from "./data/fastFlowChallenges";

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const ROAD_WIDTH = 88;
const MAX_DAMAGE = 100;

const SUBJECTS = {
  deutsch: { label: "Deutsch", accent: "#f59e0b" },
  mathe: { label: "Mathe", accent: "#38bdf8" },
  sach: { label: "Sachkunde", accent: "#34d399" },
  ethik: { label: "Ethik", accent: "#c084fc" },
  musik: { label: "Musik", accent: "#fb7185" },
};

const GAME_LIBRARY = {
  taxi: {
    title: "Fast Taxi City",
    tag: "Top-Down",
    description: "Abholen, fahren, ausweichen, abliefern. Im Lernmodus werden Zielzonen zu Antworten.",
  },
  ninja: {
    title: "Ninja Parkour",
    tag: "Jump'n'Run",
    description: "Springen, Münzen sammeln, Gegner treffen. Im Lernmodus zerschneidet der Shuriken die richtige Antwort.",
  },
  maze: {
    title: "Labyrinth Run",
    tag: "Dungeon",
    description: "Schlüssel suchen, Wächtern ausweichen, den Ausgang öffnen. Im Lernmodus entscheidet die richtige Antwort den Weg.",
  },
};

const PICKUPS = [
  { x: 154, y: 96, label: "Markt" },
  { x: 342, y: 252, label: "Bibliothek" },
  { x: 550, y: 416, label: "Atelier" },
  { x: 760, y: 96, label: "Bahnhof" },
  { x: 154, y: 416, label: "Schule" },
  { x: 760, y: 252, label: "Park" },
];

const CITY_DESTINATIONS = [
  { id: "schule", label: "Schule", x: 82, y: 44, w: 154, h: 54, color: "#60a5fa" },
  { id: "park", label: "Park", x: 394, y: 44, w: 154, h: 54, color: "#4ade80" },
  { id: "bahnhof", label: "Bahnhof", x: 718, y: 44, w: 168, h: 54, color: "#fbbf24" },
  { id: "bibliothek", label: "Bibliothek", x: 82, y: 444, w: 170, h: 54, color: "#a78bfa" },
  { id: "atelier", label: "Atelier", x: 394, y: 444, w: 154, h: 54, color: "#fb7185" },
  { id: "markt", label: "Markt", x: 718, y: 444, w: 168, h: 54, color: "#22d3ee" },
];

const ANSWER_ZONES = [
  { x: 82, y: 44, w: 170, h: 54, color: "#f59e0b" },
  { x: 394, y: 44, w: 170, h: 54, color: "#38bdf8" },
  { x: 708, y: 44, w: 178, h: 54, color: "#34d399" },
  { x: 394, y: 444, w: 178, h: 54, color: "#fb7185" },
];

const BUILDINGS = [
  { x: 34, y: 150, w: 174, h: 74, color: "#6d8ea5" },
  { x: 242, y: 150, w: 178, h: 74, color: "#8b7ca8" },
  { x: 460, y: 150, w: 178, h: 74, color: "#9f8267" },
  { x: 676, y: 150, w: 214, h: 74, color: "#6f9f8f" },
  { x: 34, y: 310, w: 174, h: 74, color: "#967e72" },
  { x: 242, y: 310, w: 178, h: 74, color: "#6f8aa8" },
  { x: 460, y: 310, w: 178, h: 74, color: "#8c8f63" },
  { x: 676, y: 310, w: 214, h: 74, color: "#a16f82" },
];

const TRAFFIC_SEEDS = [
  { axis: "x", lane: 76, dir: 1, speed: 92, x: 40, color: "#60a5fa" },
  { axis: "x", lane: 116, dir: -1, speed: 104, x: 740, color: "#f97316" },
  { axis: "x", lane: 244, dir: 1, speed: 86, x: 420, color: "#a78bfa" },
  { axis: "x", lane: 424, dir: -1, speed: 96, x: 850, color: "#f43f5e" },
  { axis: "y", lane: 132, dir: 1, speed: 82, y: 310, color: "#22c55e" },
  { axis: "y", lane: 174, dir: -1, speed: 90, y: 120, color: "#fbbf24" },
  { axis: "y", lane: 534, dir: 1, speed: 76, y: 44, color: "#e879f9" },
  { axis: "y", lane: 782, dir: -1, speed: 84, y: 500, color: "#38bdf8" },
];

const NINJA_WORLD_WIDTH = 2680;
const NINJA_GROUND_Y = 492;
const NINJA_PLAYER = { w: 34, h: 48 };
const NINJA_PLATFORMS = [
  { x: 0, y: NINJA_GROUND_Y, w: 540, h: 70, color: "#28405e" },
  { x: 640, y: 438, w: 270, h: 32, color: "#315f72" },
  { x: 990, y: 380, w: 270, h: 32, color: "#41556f" },
  { x: 1340, y: 430, w: 330, h: 32, color: "#52633f" },
  { x: 1770, y: 360, w: 250, h: 32, color: "#4d496b" },
  { x: 2110, y: 438, w: 470, h: 70, color: "#28405e" },
];
const NINJA_COIN_SEEDS = [
  { x: 176, y: 430 }, { x: 252, y: 430 }, { x: 720, y: 382 }, { x: 805, y: 382 },
  { x: 1068, y: 324 }, { x: 1150, y: 324 }, { x: 1432, y: 374 }, { x: 1540, y: 374 },
  { x: 1838, y: 304 }, { x: 1930, y: 304 }, { x: 2200, y: 382 }, { x: 2302, y: 382 },
];
const NINJA_ENEMY_SEEDS = [
  { x: 386, y: NINJA_GROUND_Y - 36, min: 320, max: 505, vx: 70 },
  { x: 1110, y: 380 - 36, min: 1008, max: 1228, vx: 82 },
  { x: 1500, y: 430 - 36, min: 1364, max: 1628, vx: 74 },
  { x: 2240, y: 438 - 36, min: 2160, max: 2480, vx: 88 },
];
const NINJA_ANSWER_SLOTS = [
  { x: 690, y: 382, w: 122, h: 46 },
  { x: 1060, y: 324, w: 122, h: 46 },
  { x: 1430, y: 374, w: 122, h: 46 },
  { x: 2180, y: 382, w: 122, h: 46 },
];

const MAZE_EXIT = { x: 878, y: 454, w: 54, h: 54 };
const MAZE_PLAYER = { r: 15 };
const MAZE_WALLS = [
  { x: 0, y: 0, w: 960, h: 26 },
  { x: 0, y: 514, w: 960, h: 26 },
  { x: 0, y: 0, w: 26, h: 540 },
  { x: 934, y: 0, w: 26, h: 540 },
  { x: 128, y: 72, w: 28, h: 332 },
  { x: 250, y: 26, w: 28, h: 178 },
  { x: 250, y: 310, w: 28, h: 178 },
  { x: 398, y: 92, w: 28, h: 332 },
  { x: 552, y: 26, w: 28, h: 178 },
  { x: 552, y: 306, w: 28, h: 182 },
  { x: 714, y: 92, w: 28, h: 332 },
  { x: 128, y: 146, w: 178, h: 28 },
  { x: 454, y: 146, w: 288, h: 28 },
  { x: 26, y: 254, w: 252, h: 28 },
  { x: 398, y: 254, w: 222, h: 28 },
  { x: 714, y: 254, w: 172, h: 28 },
  { x: 128, y: 382, w: 298, h: 28 },
  { x: 552, y: 382, w: 302, h: 28 },
];
const MAZE_RELIC_SEEDS = [
  { x: 84, y: 456 },
  { x: 318, y: 78 },
  { x: 482, y: 458 },
  { x: 848, y: 92 },
];
const MAZE_ANSWER_SLOTS = [
  { x: 302, y: 94, w: 116, h: 40, color: "#f59e0b" },
  { x: 602, y: 94, w: 116, h: 40, color: "#38bdf8" },
  { x: 302, y: 430, w: 116, h: 40, color: "#34d399" },
  { x: 602, y: 430, w: 116, h: 40, color: "#fb7185" },
];
const MAZE_GUARD_SEEDS = [
  { x: 330, y: 232, vx: 88, vy: 0, minX: 310, maxX: 510, minY: 232, maxY: 232, color: "#ef4444" },
  { x: 806, y: 188, vx: 0, vy: 78, minX: 806, maxX: 806, minY: 96, maxY: 338, color: "#f97316" },
  { x: 642, y: 344, vx: 92, vy: 0, minX: 604, maxX: 848, minY: 344, maxY: 344, color: "#a855f7" },
];

function normalizeSubject(subject) {
  if (subject === "sachunterricht") return "sach";
  return SUBJECTS[subject] ? subject : "deutsch";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

const challengeBags = {};

function takeChallenge(subject) {
  const key = CHALLENGES[subject] ? subject : "deutsch";
  if (!challengeBags[key] || challengeBags[key].length === 0) {
    challengeBags[key] = shuffle(CHALLENGES[key]);
  }
  return challengeBags[key].pop();
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function circleRectHit(circle, rect, radius) {
  const nearestX = clamp(circle.x, rect.x, rect.x + rect.w);
  const nearestY = clamp(circle.y, rect.y, rect.y + rect.h);
  return Math.hypot(circle.x - nearestX, circle.y - nearestY) < radius;
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function playerRect(player) {
  return { x: player.x - NINJA_PLAYER.w / 2, y: player.y - NINJA_PLAYER.h, w: NINJA_PLAYER.w, h: NINJA_PLAYER.h };
}

function createChallenge(subject) {
  const challenge = takeChallenge(subject);
  return { ...challenge, options: shuffle(challenge.options) };
}

function createMission(mode, subject) {
  const pickup = pick(PICKUPS);

  if (mode === "learn") {
    const challenge = createChallenge(subject);
    return {
      mode,
      pickup,
      challenge,
      passengerOnBoard: false,
      zones: ANSWER_ZONES.map((zone, index) => ({ ...zone, label: challenge.options[index] })),
      message: `Hole "${challenge.term}" ab.`,
    };
  }

  const destination = pick(CITY_DESTINATIONS);
  return {
    mode,
    pickup,
    destination,
    passengerOnBoard: false,
    zones: [destination],
    message: `Hole den Fahrgast am ${pickup.label} ab.`,
  };
}

function createTaxiState(mode, subject) {
  return {
    car: { x: 154, y: 252, angle: 0, speed: 0, radius: 21 },
    mission: createMission(mode, subject),
    traffic: TRAFFIC_SEEDS.map((traffic, index) => ({
      ...traffic,
      id: index,
      x: traffic.axis === "x" ? traffic.x : traffic.lane,
      y: traffic.axis === "x" ? traffic.lane : traffic.y,
    })),
    particles: [],
    score: 0,
    combo: 0,
    damage: 0,
    timeLeft: 95,
    nextMissionAt: 0,
    feedback: "Pfeiltasten oder WASD fahren. Space bremst.",
    lastRewardAt: 0,
  };
}

function drawRoundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawLabel(ctx, text, x, y, color = "#ffffff", bg = "rgba(15,23,42,.72)") {
  ctx.save();
  ctx.font = "700 14px system-ui, sans-serif";
  const width = Math.max(56, ctx.measureText(text).width + 18);
  drawRoundRect(ctx, x - width / 2, y - 16, width, 26, 9);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y - 3);
  ctx.restore();
}

function drawCity(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  sky.addColorStop(0, "#172033");
  sky.addColorStop(1, "#101820");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = "#1f7a57";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const roads = [
    { x: 110, y: 0, w: ROAD_WIDTH, h: CANVAS_HEIGHT },
    { x: 320, y: 0, w: ROAD_WIDTH, h: CANVAS_HEIGHT },
    { x: 510, y: 0, w: ROAD_WIDTH, h: CANVAS_HEIGHT },
    { x: 738, y: 0, w: ROAD_WIDTH, h: CANVAS_HEIGHT },
    { x: 0, y: 52, w: CANVAS_WIDTH, h: ROAD_WIDTH },
    { x: 0, y: 208, w: CANVAS_WIDTH, h: ROAD_WIDTH },
    { x: 0, y: 376, w: CANVAS_WIDTH, h: ROAD_WIDTH },
  ];

  ctx.fillStyle = "#2b3440";
  roads.forEach((road) => ctx.fillRect(road.x, road.y, road.w, road.h));

  ctx.save();
  ctx.strokeStyle = "rgba(248,250,252,.44)";
  ctx.lineWidth = 3;
  ctx.setLineDash([24, 22]);
  [154, 364, 554, 782].forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  });
  [96, 252, 420].forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  });
  ctx.restore();

  BUILDINGS.forEach((building, index) => {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.34)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 7;
    drawRoundRect(ctx, building.x, building.y, building.w, building.h, 10);
    ctx.fillStyle = building.color;
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "rgba(255,255,255,.34)";
    for (let x = building.x + 16; x < building.x + building.w - 10; x += 30) {
      for (let y = building.y + 14; y < building.y + building.h - 10; y += 24) {
        ctx.fillRect(x, y, 12, 8);
      }
    }

    const names = ["Lesen", "Zahlen", "Welt", "Klang", "Team", "Werk", "Labor", "Atelier"];
    drawLabel(ctx, names[index], building.x + building.w / 2, building.y + building.h / 2 + 5, "#e2e8f0", "rgba(15,23,42,.52)");
  });

  ctx.fillStyle = "rgba(20,83,45,.7)";
  for (let i = 0; i < 22; i += 1) {
    const x = 26 + ((i * 83) % 910);
    const y = 24 + ((i * 61) % 492);
    if (BUILDINGS.some((building) => circleRectHit({ x, y }, building, 24))) continue;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(15,23,42,.24)";
    ctx.fillRect(x - 3, y + 8, 6, 12);
    ctx.fillStyle = "rgba(20,83,45,.7)";
  }
}

function drawZone(ctx, zone, active, correct) {
  ctx.save();
  const pulse = active ? 0.9 + Math.sin(performance.now() / 160) * 0.1 : 0.45;
  ctx.globalAlpha = active ? 1 : 0.58;
  ctx.shadowColor = zone.color;
  ctx.shadowBlur = active ? 20 : 5;
  drawRoundRect(ctx, zone.x, zone.y, zone.w, zone.h, 12);
  ctx.fillStyle = active ? zone.color : "#64748b";
  ctx.fill();
  ctx.globalAlpha = pulse;
  ctx.lineWidth = active ? 4 : 2;
  ctx.strokeStyle = correct ? "#fef3c7" : "#e2e8f0";
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#0f172a";
  ctx.font = "900 18px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(zone.label, zone.x + zone.w / 2, zone.y + zone.h / 2);
  ctx.restore();
}

function drawPickup(ctx, mission) {
  const pickup = mission.pickup;
  const label = mission.mode === "learn" ? mission.challenge.term : pickup.label;
  const pulse = 30 + Math.sin(performance.now() / 130) * 5;
  ctx.save();
  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 5;
  ctx.globalAlpha = 0.86;
  ctx.beginPath();
  ctx.arc(pickup.x, pickup.y, pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.arc(pickup.x, pickup.y, 10, 0, Math.PI * 2);
  ctx.fill();
  drawLabel(ctx, label, pickup.x, pickup.y - 40, "#fefce8", "rgba(113,63,18,.8)");
  ctx.restore();
}

function drawTrafficCar(ctx, car) {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.axis === "x" ? 0 : Math.PI / 2);
  ctx.shadowColor = "rgba(0,0,0,.3)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;
  drawRoundRect(ctx, -20, -11, 40, 22, 6);
  ctx.fillStyle = car.color;
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.65)";
  ctx.fillRect(-5, -8, 12, 16);
  ctx.fillStyle = "#111827";
  ctx.fillRect(-15, -13, 8, 3);
  ctx.fillRect(8, -13, 8, 3);
  ctx.fillRect(-15, 10, 8, 3);
  ctx.fillRect(8, 10, 8, 3);
  ctx.restore();
}

function drawTaxi(ctx, car) {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle);
  ctx.shadowColor = "rgba(0,0,0,.45)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 7;
  drawRoundRect(ctx, -26, -16, 52, 32, 8);
  ctx.fillStyle = "#facc15";
  ctx.fill();
  ctx.fillStyle = "#111827";
  ctx.fillRect(-19, -19, 11, 5);
  ctx.fillRect(8, -19, 11, 5);
  ctx.fillRect(-19, 14, 11, 5);
  ctx.fillRect(8, 14, 11, 5);
  ctx.fillStyle = "#0f172a";
  drawRoundRect(ctx, -5, -12, 18, 24, 5);
  ctx.fill();
  ctx.fillStyle = "#fef3c7";
  ctx.fillRect(-25, -4, 10, 8);
  ctx.fillStyle = "#111827";
  ctx.font = "900 9px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("FF", 4, 0);
  ctx.restore();
}

function drawArrow(ctx, car, target, color) {
  const angle = Math.atan2(target.y - car.y, target.x - car.x);
  const x = car.x + Math.cos(angle) * 42;
  const y = car.y + Math.sin(angle) * 42;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.92;
  ctx.beginPath();
  ctx.moveTo(18, 0);
  ctx.lineTo(-8, -10);
  ctx.lineTo(-2, 0);
  ctx.lineTo(-8, 10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawParticles(ctx, particles) {
  particles.forEach((particle) => {
    ctx.save();
    ctx.globalAlpha = clamp(particle.life, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function addBurst(state, x, y, color, count = 12) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 50 + Math.random() * 120;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      size: 2 + Math.random() * 4,
      color,
    });
  }
}

function playTone(kind) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = kind === "hit" ? "sawtooth" : "triangle";
    oscillator.frequency.value = kind === "success" ? 740 : kind === "wrong" ? 180 : 92;
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.18);
  } catch {
    // Browser audio policies can block short generated sounds before a user gesture.
  }
}

function updateSimulation(state, input, pointerTarget, dt, mode, subject, callbacks) {
  const car = state.car;
  const previous = { x: car.x, y: car.y };
  const now = performance.now();

  if (state.damage >= MAX_DAMAGE || state.timeLeft <= 0) {
    if (now > state.nextMissionAt) {
      const savedScore = state.score;
      Object.assign(state, createTaxiState(mode, subject));
      state.score = Math.max(0, Math.floor(savedScore * 0.45));
      state.feedback = "Taxi repariert. Neue Runde.";
      state.nextMissionAt = now + 900;
    }
    return;
  }

  state.timeLeft -= dt;

  const forward = input.up || input.w;
  const backward = input.down || input.s;
  let steer = (input.right || input.d ? 1 : 0) - (input.left || input.a ? 1 : 0);
  let throttle = (forward ? 1 : 0) - (backward ? 0.62 : 0);

  if (pointerTarget.active) {
    const desired = Math.atan2(pointerTarget.y - car.y, pointerTarget.x - car.x);
    let diff = desired - car.angle;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    steer += clamp(diff * 1.8, -1, 1);
    throttle = distance(car, pointerTarget) > 45 ? 0.85 : -0.25;
  }

  car.speed += throttle * 245 * dt;
  if (input.space) car.speed *= 1 - 4.6 * dt;
  car.speed *= Math.pow(0.985, dt * 60);
  car.speed = clamp(car.speed, -120, 265);

  const steerStrength = 2.55 * dt * (0.38 + Math.min(Math.abs(car.speed) / 230, 1));
  car.angle += steer * steerStrength * (car.speed >= 0 ? 1 : -1);
  car.x += Math.cos(car.angle) * car.speed * dt;
  car.y += Math.sin(car.angle) * car.speed * dt;
  car.x = clamp(car.x, 18, CANVAS_WIDTH - 18);
  car.y = clamp(car.y, 18, CANVAS_HEIGHT - 18);

  const buildingHit = BUILDINGS.some((building) => circleRectHit(car, building, car.radius));
  if (buildingHit) {
    car.x = previous.x;
    car.y = previous.y;
    car.speed *= -0.32;
    state.damage = clamp(state.damage + 7, 0, MAX_DAMAGE);
    state.combo = 0;
    state.feedback = "Gebäude touchiert.";
    addBurst(state, car.x, car.y, "#fb7185", 8);
    playTone("hit");
  }

  state.traffic.forEach((traffic) => {
    if (traffic.axis === "x") {
      traffic.x += traffic.dir * traffic.speed * dt;
      if (traffic.dir > 0 && traffic.x > CANVAS_WIDTH + 35) traffic.x = -35;
      if (traffic.dir < 0 && traffic.x < -35) traffic.x = CANVAS_WIDTH + 35;
    } else {
      traffic.y += traffic.dir * traffic.speed * dt;
      if (traffic.dir > 0 && traffic.y > CANVAS_HEIGHT + 35) traffic.y = -35;
      if (traffic.dir < 0 && traffic.y < -35) traffic.y = CANVAS_HEIGHT + 35;
    }

    if (distance(car, traffic) < 33) {
      const angle = Math.atan2(car.y - traffic.y, car.x - traffic.x);
      car.x += Math.cos(angle) * 18;
      car.y += Math.sin(angle) * 18;
      car.speed *= -0.24;
      state.damage = clamp(state.damage + 5.5, 0, MAX_DAMAGE);
      state.combo = 0;
      state.feedback = "Verkehr getroffen.";
      addBurst(state, car.x, car.y, "#f97316", 9);
      playTone("hit");
    }
  });

  state.particles = state.particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * dt,
      y: particle.y + particle.vy * dt,
      vy: particle.vy + 120 * dt,
      life: particle.life - dt * 1.8,
    }))
    .filter((particle) => particle.life > 0);

  if (now < state.nextMissionAt) return;

  const mission = state.mission;
  if (!mission.passengerOnBoard) {
    if (distance(car, mission.pickup) < 36) {
      mission.passengerOnBoard = true;
      state.feedback = mission.mode === "learn" ? mission.challenge.prompt : `Fahre zum Ziel: ${mission.destination.label}.`;
      addBurst(state, mission.pickup.x, mission.pickup.y, "#facc15", 16);
      playTone("success");
    }
    return;
  }

  const hitZone = mission.zones.find((zone) => circleRectHit(car, zone, car.radius + 4));
  if (!hitZone) return;

  const correct = mission.mode !== "learn" || hitZone.label === mission.challenge.correct;
  if (correct) {
    const base = mission.mode === "learn" ? 75 : 45;
    const cleanBonus = Math.max(0, 30 - Math.floor(state.damage / 3));
    state.combo += 1;
    state.score += base + cleanBonus + state.combo * 8;
    state.timeLeft = clamp(state.timeLeft + 10, 0, 125);
    state.feedback = mission.mode === "learn" ? `Richtig: ${mission.challenge.term} -> ${hitZone.label}` : `Fahrt beendet: ${hitZone.label}`;
    addBurst(state, hitZone.x + hitZone.w / 2, hitZone.y + hitZone.h / 2, "#86efac", 24);
    playTone("success");
    callbacks.onCorrect?.(mission.mode === "learn" ? 5 : 2);
  } else {
    state.combo = 0;
    state.damage = clamp(state.damage + 12, 0, MAX_DAMAGE);
    state.feedback = `Noch einmal: "${mission.challenge.term}" passt nicht zu "${hitZone.label}".`;
    addBurst(state, hitZone.x + hitZone.w / 2, hitZone.y + hitZone.h / 2, "#fb7185", 18);
    playTone("wrong");
    callbacks.onWrong?.();
  }

  state.mission = createMission(mode, subject);
  state.nextMissionAt = now + 720;
}

function renderTaxiGame(ctx, state, mode, subject) {
  drawCity(ctx);

  const mission = state.mission;
  const activeZones = mission.passengerOnBoard;
  mission.zones.forEach((zone) => {
    const correct = mode !== "learn" || zone.label === mission.challenge?.correct;
    drawZone(ctx, zone, activeZones, correct);
  });

  if (!mission.passengerOnBoard) {
    drawPickup(ctx, mission);
    drawArrow(ctx, state.car, mission.pickup, "#facc15");
  } else {
    const target = mode === "learn"
      ? mission.zones.find((zone) => zone.label === mission.challenge.correct) || mission.zones[0]
      : mission.destination;
    drawArrow(ctx, state.car, { x: target.x + target.w / 2, y: target.y + target.h / 2 }, SUBJECTS[subject].accent);
  }

  state.traffic.forEach((traffic) => drawTrafficCar(ctx, traffic));
  drawParticles(ctx, state.particles);
  drawTaxi(ctx, state.car);

  ctx.save();
  ctx.fillStyle = "rgba(15,23,42,.72)";
  drawRoundRect(ctx, 18, CANVAS_HEIGHT - 72, 516, 50, 12);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "800 16px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const prompt = mode === "learn" ? `${mission.challenge.term}: ${mission.challenge.prompt}` : mission.message;
  ctx.fillText(prompt, 36, CANVAS_HEIGHT - 48);
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "600 12px system-ui, sans-serif";
  ctx.fillText(state.feedback, 36, CANVAS_HEIGHT - 28);
  ctx.restore();
}

function makeHud(state, mode) {
  const mission = state.mission;
  const objective = mission.passengerOnBoard
    ? mode === "learn"
      ? `Ziel: ${mission.challenge.correct}`
      : `Ziel: ${mission.destination.label}`
    : `Abholen: ${mode === "learn" ? mission.challenge.term : mission.pickup.label}`;

  return {
    score: Math.floor(state.score),
    combo: state.combo,
    damage: Math.floor(state.damage),
    time: Math.max(0, Math.ceil(state.timeLeft)),
    objective,
    feedback: state.feedback,
  };
}

function FastTaxiGame({ mode, subject, onCorrect, onWrong }) {
  const canvasRef = useRef(null);
  const inputRef = useRef({});
  const pointerRef = useRef({ active: false, x: 0, y: 0 });
  const callbacksRef = useRef({ onCorrect, onWrong });
  const [hud, setHud] = useState({
    score: 0,
    combo: 0,
    damage: 0,
    time: 95,
    objective: "Abholen",
    feedback: "Pfeiltasten oder WASD fahren. Space bremst.",
  });

  useEffect(() => {
    callbacksRef.current = { onCorrect, onWrong };
  }, [onCorrect, onWrong]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.touchAction = "none";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const state = createTaxiState(mode, subject);
    let rafId = 0;
    let lastTime = performance.now();
    let lastHud = 0;

    const setKey = (event, pressed) => {
      const key = event.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "w", "a", "s", "d"].includes(key)) {
        event.preventDefault();
      }
      if (key === "arrowup") inputRef.current.up = pressed;
      if (key === "arrowdown") inputRef.current.down = pressed;
      if (key === "arrowleft") inputRef.current.left = pressed;
      if (key === "arrowright") inputRef.current.right = pressed;
      if (key === " ") inputRef.current.space = pressed;
      if (key === "w" || key === "a" || key === "s" || key === "d") inputRef.current[key] = pressed;
    };

    const keyDown = (event) => setKey(event, true);
    const keyUp = (event) => setKey(event, false);

    const pointerPosition = (event) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
        y: ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
      };
    };

    const pointerDown = (event) => {
      event.preventDefault();
      pointerRef.current = { active: true, ...pointerPosition(event) };
      canvas.focus();
    };
    const pointerMove = (event) => {
      if (!pointerRef.current.active) return;
      if (event.cancelable) event.preventDefault();
      pointerRef.current = { active: true, ...pointerPosition(event) };
    };
    const pointerUp = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);
    window.addEventListener("pointercancel", pointerUp);

    const frame = (time) => {
      const dt = clamp((time - lastTime) / 1000, 0, 0.04);
      lastTime = time;
      updateSimulation(state, inputRef.current, pointerRef.current, dt, mode, subject, callbacksRef.current);
      renderTaxiGame(ctx, state, mode, subject);
      if (time - lastHud > 120) {
        setHud(makeHud(state, mode));
        lastHud = time;
      }
      rafId = window.requestAnimationFrame(frame);
    };

    renderTaxiGame(ctx, state, mode, subject);
    rafId = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", pointerUp);
      inputRef.current = {};
      pointerRef.current.active = false;
    };
  }, [mode, subject]);

  const press = (key, value) => {
    inputRef.current[key] = value;
  };

  return (
    <div className="relative min-h-0">
      <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
        <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-slate-950 shadow-2xl">
          <canvas
            ref={canvasRef}
            tabIndex={0}
            aria-label="Fast Taxi Spielfeld"
            className="block aspect-video w-full bg-slate-950 outline-none"
          />
          <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.18em] text-white">
            <span className="rounded-full bg-slate-950/80 px-3 py-2 shadow-lg">Score {hud.score}</span>
            <span className="rounded-full bg-slate-950/80 px-3 py-2 shadow-lg">Zeit {hud.time}</span>
            <span className="rounded-full bg-slate-950/80 px-3 py-2 shadow-lg">Combo x{hud.combo}</span>
            <span className={`rounded-full px-3 py-2 shadow-lg ${hud.damage > 70 ? "bg-rose-700/90" : "bg-slate-950/80"}`}>
              Schaden {hud.damage}%
            </span>
          </div>
        </div>

        <aside className="rounded-[28px] border border-white/12 bg-slate-900/84 p-4 text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Mission</p>
          <h2 className="mt-2 text-2xl font-black leading-tight">{hud.objective}</h2>
          <p className="mt-3 min-h-12 text-sm font-semibold leading-relaxed text-slate-300">{hud.feedback}</p>

          <div className="mt-5 grid grid-cols-3 gap-2 text-sm font-black">
            <button
              type="button"
              aria-label="Links lenken"
              onPointerDown={() => press("left", true)}
              onPointerUp={() => press("left", false)}
              onPointerLeave={() => press("left", false)}
              className="rounded-2xl bg-slate-800 px-3 py-4 text-white shadow-inner"
            >
              Links
            </button>
            <button
              type="button"
              aria-label="Gas geben"
              onPointerDown={() => press("up", true)}
              onPointerUp={() => press("up", false)}
              onPointerLeave={() => press("up", false)}
              className="rounded-2xl bg-emerald-500 px-3 py-4 text-slate-950 shadow-inner"
            >
              Gas
            </button>
            <button
              type="button"
              aria-label="Rechts lenken"
              onPointerDown={() => press("right", true)}
              onPointerUp={() => press("right", false)}
              onPointerLeave={() => press("right", false)}
              className="rounded-2xl bg-slate-800 px-3 py-4 text-white shadow-inner"
            >
              Rechts
            </button>
            <button
              type="button"
              aria-label="Rückwärts fahren"
              onPointerDown={() => press("down", true)}
              onPointerUp={() => press("down", false)}
              onPointerLeave={() => press("down", false)}
              className="col-span-2 rounded-2xl bg-slate-800 px-3 py-4 text-white shadow-inner"
            >
              Zurück
            </button>
            <button
              type="button"
              aria-label="Bremse"
              onPointerDown={() => press("space", true)}
              onPointerUp={() => press("space", false)}
              onPointerLeave={() => press("space", false)}
              className="rounded-2xl bg-amber-400 px-3 py-4 text-slate-950 shadow-inner"
            >
              Bremse
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function createNinjaCrates(challenge, mode) {
  if (mode === "learn") {
    return NINJA_ANSWER_SLOTS.map((slot, index) => ({
      ...slot,
      label: challenge.options[index],
      answer: challenge.options[index],
      broken: false,
      flash: 0,
      color: challenge.options[index] === challenge.correct ? "#22c55e" : "#f59e0b",
    }));
  }

  return [
    { x: 688, y: 392, w: 58, h: 46, label: "Kiste", broken: false, color: "#b45309" },
    { x: 1118, y: 334, w: 58, h: 46, label: "Kiste", broken: false, color: "#b45309" },
    { x: 1488, y: 384, w: 58, h: 46, label: "Kiste", broken: false, color: "#b45309" },
    { x: 2252, y: 392, w: 58, h: 46, label: "Kiste", broken: false, color: "#b45309" },
  ];
}

function createNinjaState(mode, subject) {
  const challenge = createChallenge(subject);
  return {
    player: {
      x: 74,
      y: NINJA_GROUND_Y,
      vx: 0,
      vy: 0,
      facing: 1,
      onGround: false,
      jumpHeld: false,
      lastAttack: 0,
      hurtUntil: 0,
    },
    challenge,
    crates: createNinjaCrates(challenge, mode),
    coins: NINJA_COIN_SEEDS.map((coin, index) => ({ ...coin, id: index, taken: false })),
    enemies: NINJA_ENEMY_SEEDS.map((enemy, index) => ({ ...enemy, id: index, alive: true, w: 34, h: 36 })),
    projectiles: [],
    particles: [],
    cameraX: 0,
    score: 0,
    combo: 0,
    hp: 100,
    timeLeft: 115,
    finishCooldown: 0,
    feedback: mode === "learn" ? `Triff die Antwort auf "${challenge.term}".` : "Erreiche das Tor. Sammle Münzen, wirf Shuriken mit K.",
  };
}

function drawNinjaBackground(ctx, cameraX) {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, "#111827");
  gradient.addColorStop(0.56, "#172554");
  gradient.addColorStop(1, "#08111f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.save();
  ctx.translate(-cameraX * 0.22, 0);
  for (let i = -1; i < 8; i += 1) {
    const x = i * 420;
    ctx.fillStyle = "rgba(59,130,246,.18)";
    ctx.beginPath();
    ctx.moveTo(x, 408);
    ctx.lineTo(x + 210, 118);
    ctx.lineTo(x + 440, 408);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(14,165,233,.12)";
    ctx.beginPath();
    ctx.moveTo(x + 160, 408);
    ctx.lineTo(x + 350, 188);
    ctx.lineTo(x + 560, 408);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(-cameraX * 0.55, 0);
  for (let i = -1; i < 12; i += 1) {
    const x = i * 260;
    ctx.fillStyle = "rgba(15,23,42,.62)";
    drawRoundRect(ctx, x + 30, 330, 64, 150, 8);
    ctx.fill();
    drawRoundRect(ctx, x + 126, 292, 84, 190, 8);
    ctx.fill();
  }
  ctx.restore();
}

function drawNinjaPlatform(ctx, platform) {
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.36)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 8;
  drawRoundRect(ctx, platform.x, platform.y, platform.w, platform.h, 12);
  ctx.fillStyle = platform.color;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,.18)";
  ctx.fillRect(platform.x + 12, platform.y + 8, platform.w - 24, 4);
  ctx.fillStyle = "rgba(15,23,42,.28)";
  for (let x = platform.x + 18; x < platform.x + platform.w - 14; x += 48) {
    ctx.fillRect(x, platform.y + platform.h - 14, 26, 5);
  }
  ctx.restore();
}

function drawNinjaPlayer(ctx, player, time) {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.scale(player.facing, 1);
  const hurt = time < player.hurtUntil;
  ctx.globalAlpha = hurt ? 0.62 + Math.sin(time / 42) * 0.25 : 1;
  ctx.fillStyle = "#0f172a";
  drawRoundRect(ctx, -15, -42, 30, 38, 10);
  ctx.fill();
  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(0, -48, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(2, -52, 10, 3);
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(-7, -45);
  ctx.lineTo(-34, -36 + Math.sin(time / 90) * 5);
  ctx.lineTo(-7, -34);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(12, -31);
  ctx.lineTo(33, -43);
  ctx.stroke();
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-8, -6);
  ctx.lineTo(-16, 0);
  ctx.moveTo(9, -6);
  ctx.lineTo(17, 0);
  ctx.stroke();
  ctx.restore();
}

function drawNinjaCoin(ctx, coin, time) {
  if (coin.taken) return;
  ctx.save();
  ctx.translate(coin.x, coin.y + Math.sin(time / 170 + coin.id) * 4);
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fef3c7";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawNinjaEnemy(ctx, enemy) {
  if (!enemy.alive) return;
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  ctx.fillStyle = "#7f1d1d";
  drawRoundRect(ctx, -17, 0, 34, 36, 9);
  ctx.fill();
  ctx.fillStyle = "#fecaca";
  ctx.fillRect(-8, 9, 16, 4);
  ctx.strokeStyle = "#fca5a5";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(enemy.vx > 0 ? 12 : -12, 19);
  ctx.lineTo(enemy.vx > 0 ? 30 : -30, 13);
  ctx.stroke();
  ctx.restore();
}

function drawNinjaCrate(ctx, crate, mode) {
  if (crate.broken) return;
  ctx.save();
  ctx.globalAlpha = crate.flash > 0 ? 0.72 + Math.sin(performance.now() / 36) * 0.2 : 1;
  ctx.shadowColor = mode === "learn" ? "#facc15" : "rgba(0,0,0,.36)";
  ctx.shadowBlur = mode === "learn" ? 16 : 6;
  drawRoundRect(ctx, crate.x, crate.y, crate.w, crate.h, 8);
  ctx.fillStyle = crate.color || "#b45309";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.42)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = mode === "learn" ? "#111827" : "#fef3c7";
  ctx.font = mode === "learn" ? "900 14px system-ui, sans-serif" : "900 11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(crate.label, crate.x + crate.w / 2, crate.y + crate.h / 2);
  ctx.restore();
}

function drawNinjaProjectile(ctx, projectile) {
  ctx.save();
  ctx.translate(projectile.x, projectile.y);
  ctx.rotate(projectile.spin);
  ctx.strokeStyle = "#e0f2fe";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-9, 0);
  ctx.lineTo(9, 0);
  ctx.moveTo(0, -9);
  ctx.lineTo(0, 9);
  ctx.stroke();
  ctx.restore();
}

function drawNinjaFinish(ctx) {
  ctx.save();
  ctx.translate(NINJA_WORLD_WIDTH - 132, NINJA_GROUND_Y);
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(-4, -128, 8, 128);
  ctx.fillStyle = "#22d3ee";
  ctx.beginPath();
  ctx.moveTo(4, -128);
  ctx.lineTo(88, -104);
  ctx.lineTo(4, -80);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "900 16px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Tor", 44, -101);
  ctx.restore();
}

function renderNinjaGame(ctx, state, mode, subject) {
  const time = performance.now();
  drawNinjaBackground(ctx, state.cameraX);
  ctx.save();
  ctx.translate(-state.cameraX, 0);

  NINJA_PLATFORMS.forEach((platform) => drawNinjaPlatform(ctx, platform));
  drawNinjaFinish(ctx);
  state.coins.forEach((coin) => drawNinjaCoin(ctx, coin, time));
  state.crates.forEach((crate) => drawNinjaCrate(ctx, crate, mode));
  state.enemies.forEach((enemy) => drawNinjaEnemy(ctx, enemy));
  state.projectiles.forEach((projectile) => drawNinjaProjectile(ctx, projectile));
  drawParticles(ctx, state.particles);
  drawNinjaPlayer(ctx, state.player, time);
  ctx.restore();

  ctx.save();
  const prompt = mode === "learn" ? `${state.challenge.term}: ${state.challenge.prompt}` : "Parkour bis zum Tor. K oder Enter wirft Shuriken.";
  ctx.fillStyle = "rgba(15,23,42,.74)";
  drawRoundRect(ctx, 18, CANVAS_HEIGHT - 72, 580, 50, 12);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "800 16px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(prompt, 36, CANVAS_HEIGHT - 48);
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "600 12px system-ui, sans-serif";
  ctx.fillText(state.feedback, 36, CANVAS_HEIGHT - 28);
  ctx.fillStyle = SUBJECTS[subject].accent;
  ctx.fillRect(36, CANVAS_HEIGHT - 18, clamp(state.player.x / (NINJA_WORLD_WIDTH - 170), 0, 1) * 520, 4);
  ctx.restore();
}

function launchShuriken(state, time) {
  const player = state.player;
  if (time - player.lastAttack < 230) return;
  player.lastAttack = time;
  state.projectiles.push({
    x: player.x + player.facing * 22,
    y: player.y - 31,
    vx: player.facing * 620,
    spin: 0,
    life: 0.95,
  });
  playTone("success");
}

function updateNinjaSimulation(state, input, dt, mode, subject, callbacks) {
  const time = performance.now();
  const player = state.player;

  if (state.hp <= 0 || state.timeLeft <= 0) {
    const savedScore = state.score;
    Object.assign(state, createNinjaState(mode, subject));
    state.score = Math.max(0, Math.floor(savedScore * 0.5));
    state.feedback = "Neustart am Dojo.";
    return;
  }

  state.timeLeft -= dt;
  state.finishCooldown = Math.max(0, state.finishCooldown - dt);

  const movingLeft = input.left || input.a;
  const movingRight = input.right || input.d;
  const jumpPressed = input.up || input.w || input.space;
  const attackPressed = input.attack || input.k || input.j || input.x || input.enter;
  const acceleration = player.onGround ? 2200 : 1450;

  if (movingLeft) {
    player.vx -= acceleration * dt;
    player.facing = -1;
  }
  if (movingRight) {
    player.vx += acceleration * dt;
    player.facing = 1;
  }
  if (!movingLeft && !movingRight) {
    player.vx *= Math.pow(player.onGround ? 0.82 : 0.94, dt * 60);
  }
  player.vx = clamp(player.vx, -310, 310);

  if (jumpPressed && player.onGround && !player.jumpHeld) {
    player.vy = -650;
    player.onGround = false;
    playTone("success");
  }
  player.jumpHeld = Boolean(jumpPressed);

  if (attackPressed) launchShuriken(state, time);

  const previousY = player.y;
  player.vy += 1780 * dt;
  player.x += player.vx * dt;
  player.y += player.vy * dt;
  player.x = clamp(player.x, 28, NINJA_WORLD_WIDTH - 72);
  player.onGround = false;

  const rect = playerRect(player);
  NINJA_PLATFORMS.forEach((platform) => {
    const wasAbove = previousY <= platform.y + 4;
    const horizontal = rect.x < platform.x + platform.w && rect.x + rect.w > platform.x;
    if (player.vy >= 0 && wasAbove && horizontal && player.y >= platform.y && player.y <= platform.y + 34) {
      player.y = platform.y;
      player.vy = 0;
      player.onGround = true;
    }
  });

  if (player.y > CANVAS_HEIGHT + 80) {
    player.x = Math.max(74, player.x - 210);
    player.y = 120;
    player.vx = 0;
    player.vy = 0;
    state.hp = clamp(state.hp - 18, 0, 100);
    state.combo = 0;
    state.feedback = "Sturz abgefangen.";
    callbacks.onWrong?.();
  }

  state.coins.forEach((coin) => {
    if (!coin.taken && distance({ x: player.x, y: player.y - 28 }, coin) < 25) {
      coin.taken = true;
      state.score += 15 + state.combo;
      addBurst(state, coin.x, coin.y, "#facc15", 8);
      playTone("success");
    }
  });

  state.enemies.forEach((enemy) => {
    if (!enemy.alive) return;
    enemy.x += enemy.vx * dt;
    if (enemy.x < enemy.min || enemy.x > enemy.max) {
      enemy.vx *= -1;
      enemy.x = clamp(enemy.x, enemy.min, enemy.max);
    }
    const enemyRect = { x: enemy.x - enemy.w / 2, y: enemy.y, w: enemy.w, h: enemy.h };
    if (rectsOverlap(playerRect(player), enemyRect) && time > player.hurtUntil) {
      player.hurtUntil = time + 900;
      player.vx = enemy.x > player.x ? -220 : 220;
      player.vy = -260;
      state.hp = clamp(state.hp - 14, 0, 100);
      state.combo = 0;
      state.feedback = "Treffer vom Wächter.";
      addBurst(state, player.x, player.y - 26, "#fb7185", 12);
      playTone("hit");
      callbacks.onWrong?.();
    }
  });

  state.projectiles = state.projectiles
    .map((projectile) => ({
      ...projectile,
      x: projectile.x + projectile.vx * dt,
      spin: projectile.spin + 18 * dt,
      life: projectile.life - dt,
    }))
    .filter((projectile) => projectile.life > 0 && projectile.x > 0 && projectile.x < NINJA_WORLD_WIDTH);

  state.projectiles.forEach((projectile) => {
    if (projectile.used) return;
    const projectileRect = { x: projectile.x - 10, y: projectile.y - 10, w: 20, h: 20 };

    state.enemies.forEach((enemy) => {
      if (!enemy.alive || projectile.used) return;
      const enemyRect = { x: enemy.x - enemy.w / 2, y: enemy.y, w: enemy.w, h: enemy.h };
      if (rectsOverlap(projectileRect, enemyRect)) {
        enemy.alive = false;
        projectile.used = true;
        state.score += 55 + state.combo * 5;
        state.combo += 1;
        state.feedback = "Wächter entwaffnet.";
        addBurst(state, enemy.x, enemy.y + 16, "#38bdf8", 16);
        playTone("success");
      }
    });

    state.crates.forEach((crate) => {
      if (crate.broken || projectile.used) return;
      if (!rectsOverlap(projectileRect, crate)) return;
      projectile.used = true;
      if (mode === "learn") {
        if (crate.answer === state.challenge.correct) {
          crate.broken = true;
          state.score += 110 + state.combo * 12;
          state.combo += 1;
          state.timeLeft = clamp(state.timeLeft + 9, 0, 135);
          state.feedback = `Richtig: ${state.challenge.term} -> ${crate.answer}`;
          addBurst(state, crate.x + crate.w / 2, crate.y + crate.h / 2, "#86efac", 22);
          state.challenge = createChallenge(subject);
          state.crates = createNinjaCrates(state.challenge, mode);
          callbacks.onCorrect?.(5);
          playTone("success");
        } else {
          crate.flash = 0.45;
          state.hp = clamp(state.hp - 10, 0, 100);
          state.combo = 0;
          state.feedback = `"${crate.answer}" ist hier nicht die passende Antwort.`;
          addBurst(state, crate.x + crate.w / 2, crate.y + crate.h / 2, "#fb7185", 16);
          callbacks.onWrong?.();
          playTone("wrong");
        }
      } else {
        crate.broken = true;
        state.score += 35 + state.combo * 4;
        state.combo += 1;
        state.feedback = "Kiste zerschlagen.";
        addBurst(state, crate.x + crate.w / 2, crate.y + crate.h / 2, "#fbbf24", 16);
        playTone("success");
      }
    });
  });

  state.projectiles = state.projectiles.filter((projectile) => !projectile.used);
  state.crates.forEach((crate) => {
    crate.flash = Math.max(0, crate.flash - dt);
  });

  state.particles = state.particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * dt,
      y: particle.y + particle.vy * dt,
      vy: particle.vy + 120 * dt,
      life: particle.life - dt * 1.8,
    }))
    .filter((particle) => particle.life > 0);

  if (player.x > NINJA_WORLD_WIDTH - 148 && state.finishCooldown <= 0) {
    state.finishCooldown = 2.4;
    state.score += 160 + state.combo * 10;
    state.combo += 1;
    state.timeLeft = clamp(state.timeLeft + 14, 0, 140);
    state.feedback = mode === "learn" ? "Parkour geschafft. Neue Antwort-Runde." : "Tor erreicht. Neue Runde läuft.";
    addBurst(state, player.x, player.y - 36, "#22d3ee", 28);
    callbacks.onCorrect?.(mode === "learn" ? 4 : 2);
    player.x = 74;
    player.y = NINJA_GROUND_Y;
    player.vx = 0;
    player.vy = 0;
    state.coins = NINJA_COIN_SEEDS.map((coin, index) => ({ ...coin, id: index, taken: false }));
    state.enemies = NINJA_ENEMY_SEEDS.map((enemy, index) => ({ ...enemy, id: index, alive: true, w: 34, h: 36 }));
  }

  state.cameraX = clamp(player.x - 360, 0, NINJA_WORLD_WIDTH - CANVAS_WIDTH);
}

function makeNinjaHud(state, mode) {
  const objective = mode === "learn"
    ? `Triff: ${state.challenge.correct}`
    : `Tor: ${Math.max(0, Math.round(NINJA_WORLD_WIDTH - 132 - state.player.x))} m`;

  return {
    score: Math.floor(state.score),
    combo: state.combo,
    damage: 100 - Math.floor(state.hp),
    time: Math.max(0, Math.ceil(state.timeLeft)),
    objective,
    feedback: state.feedback,
  };
}

function FastNinjaRunGame({ mode, subject, onCorrect, onWrong }) {
  const canvasRef = useRef(null);
  const inputRef = useRef({});
  const callbacksRef = useRef({ onCorrect, onWrong });
  const [hud, setHud] = useState({
    score: 0,
    combo: 0,
    damage: 0,
    time: 115,
    objective: "Tor erreichen",
    feedback: "Pfeiltasten oder WASD. Space springt. K wirft.",
  });

  useEffect(() => {
    callbacksRef.current = { onCorrect, onWrong };
  }, [onCorrect, onWrong]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.touchAction = "none";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const state = createNinjaState(mode, subject);
    let rafId = 0;
    let lastTime = performance.now();
    let lastHud = 0;

    const setKey = (event, pressed) => {
      const key = event.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "w", "a", "s", "d", "k", "j", "x", "enter"].includes(key)) {
        event.preventDefault();
      }
      if (key === "arrowup") inputRef.current.up = pressed;
      if (key === "arrowdown") inputRef.current.down = pressed;
      if (key === "arrowleft") inputRef.current.left = pressed;
      if (key === "arrowright") inputRef.current.right = pressed;
      if (key === " ") inputRef.current.space = pressed;
      if (key === "enter") inputRef.current.enter = pressed;
      if (["w", "a", "s", "d", "k", "j", "x"].includes(key)) inputRef.current[key] = pressed;
    };
    const keyDown = (event) => setKey(event, true);
    const keyUp = (event) => setKey(event, false);
    const focusCanvas = (event) => {
      event.preventDefault();
      canvas.focus();
    };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    canvas.addEventListener("pointerdown", focusCanvas);

    const frame = (time) => {
      const dt = clamp((time - lastTime) / 1000, 0, 0.04);
      lastTime = time;
      updateNinjaSimulation(state, inputRef.current, dt, mode, subject, callbacksRef.current);
      renderNinjaGame(ctx, state, mode, subject);
      if (time - lastHud > 120) {
        setHud(makeNinjaHud(state, mode));
        lastHud = time;
      }
      rafId = window.requestAnimationFrame(frame);
    };

    renderNinjaGame(ctx, state, mode, subject);
    rafId = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      canvas.removeEventListener("pointerdown", focusCanvas);
      inputRef.current = {};
    };
  }, [mode, subject]);

  const press = (key, value) => {
    inputRef.current[key] = value;
  };

  return (
    <div className="relative min-h-0">
      <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
        <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-slate-950 shadow-2xl">
          <canvas
            ref={canvasRef}
            tabIndex={0}
            aria-label="Ninja Parkour Spielfeld"
            className="block aspect-video w-full bg-slate-950 outline-none"
          />
          <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.18em] text-white">
            <span className="rounded-full bg-slate-950/80 px-3 py-2 shadow-lg">Score {hud.score}</span>
            <span className="rounded-full bg-slate-950/80 px-3 py-2 shadow-lg">Zeit {hud.time}</span>
            <span className="rounded-full bg-slate-950/80 px-3 py-2 shadow-lg">Combo x{hud.combo}</span>
            <span className={`rounded-full px-3 py-2 shadow-lg ${hud.damage > 70 ? "bg-rose-700/90" : "bg-slate-950/80"}`}>
              Schaden {hud.damage}%
            </span>
          </div>
        </div>

        <aside className="rounded-[28px] border border-white/12 bg-slate-900/84 p-4 text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Mission</p>
          <h2 className="mt-2 text-2xl font-black leading-tight">{hud.objective}</h2>
          <p className="mt-3 min-h-12 text-sm font-semibold leading-relaxed text-slate-300">{hud.feedback}</p>

          <div className="mt-5 grid grid-cols-3 gap-2 text-sm font-black">
            <button
              type="button"
              aria-label="Links laufen"
              onPointerDown={() => press("left", true)}
              onPointerUp={() => press("left", false)}
              onPointerLeave={() => press("left", false)}
              className="rounded-2xl bg-slate-800 px-3 py-4 text-white shadow-inner"
            >
              Links
            </button>
            <button
              type="button"
              aria-label="Springen"
              onPointerDown={() => press("space", true)}
              onPointerUp={() => press("space", false)}
              onPointerLeave={() => press("space", false)}
              className="rounded-2xl bg-emerald-500 px-3 py-4 text-slate-950 shadow-inner"
            >
              Sprung
            </button>
            <button
              type="button"
              aria-label="Rechts laufen"
              onPointerDown={() => press("right", true)}
              onPointerUp={() => press("right", false)}
              onPointerLeave={() => press("right", false)}
              className="rounded-2xl bg-slate-800 px-3 py-4 text-white shadow-inner"
            >
              Rechts
            </button>
            <button
              type="button"
              aria-label="Shuriken werfen"
              onPointerDown={() => press("attack", true)}
              onPointerUp={() => press("attack", false)}
              onPointerLeave={() => press("attack", false)}
              className="col-span-3 rounded-2xl bg-amber-400 px-3 py-4 text-slate-950 shadow-inner"
            >
              Shuriken
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function createMazeGates(challenge, mode) {
  if (mode === "learn") {
    return MAZE_ANSWER_SLOTS.map((slot, index) => ({
      ...slot,
      label: challenge.options[index],
      answer: challenge.options[index],
      solved: false,
      flash: 0,
    }));
  }

  return MAZE_ANSWER_SLOTS.map((slot, index) => ({
    ...slot,
    label: `Rune ${index + 1}`,
    answer: null,
    solved: false,
    flash: 0,
  }));
}

function createMazeState(mode, subject) {
  const challenge = createChallenge(subject);
  return {
    player: { x: 66, y: 64, vx: 0, vy: 0, hurtUntil: 0 },
    challenge,
    gates: createMazeGates(challenge, mode),
    relics: MAZE_RELIC_SEEDS.map((relic, index) => ({ ...relic, id: index, taken: false })),
    guards: MAZE_GUARD_SEEDS.map((guard, index) => ({ ...guard, id: index })),
    particles: [],
    score: 0,
    combo: 0,
    keys: 0,
    hp: 100,
    timeLeft: 125,
    exitOpen: false,
    choiceCooldown: 0,
    feedback: mode === "learn" ? `Finde die richtige Antwort auf "${challenge.term}".` : "Sammle drei Schlüssel und erreiche das Tor.",
  };
}

function mazeBlocked(x, y, radius) {
  return MAZE_WALLS.some((wall) => circleRectHit({ x, y }, wall, radius));
}

function resetMazeRound(state, mode, subject, message) {
  const score = state.score;
  const combo = state.combo;
  Object.assign(state, createMazeState(mode, subject));
  state.score = score;
  state.combo = combo;
  state.feedback = message;
}

function drawMazeBackground(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, "#102033");
  gradient.addColorStop(1, "#07111d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.save();
  ctx.strokeStyle = "rgba(148,163,184,.1)";
  ctx.lineWidth = 1;
  for (let x = 40; x < CANVAS_WIDTH; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }
  for (let y = 40; y < CANVAS_HEIGHT; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawMazeWall(ctx, wall) {
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.4)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 5;
  drawRoundRect(ctx, wall.x, wall.y, wall.w, wall.h, 8);
  ctx.fillStyle = "#243044";
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,.1)";
  ctx.fillRect(wall.x + 6, wall.y + 5, Math.max(0, wall.w - 12), 3);
  ctx.restore();
}

function drawMazeExit(ctx, open) {
  ctx.save();
  ctx.shadowColor = open ? "#22d3ee" : "rgba(0,0,0,.35)";
  ctx.shadowBlur = open ? 24 : 8;
  drawRoundRect(ctx, MAZE_EXIT.x, MAZE_EXIT.y, MAZE_EXIT.w, MAZE_EXIT.h, 12);
  ctx.fillStyle = open ? "#22d3ee" : "#475569";
  ctx.fill();
  ctx.strokeStyle = "#e0f2fe";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#0f172a";
  ctx.font = "900 13px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(open ? "Tor" : "Zu", MAZE_EXIT.x + MAZE_EXIT.w / 2, MAZE_EXIT.y + MAZE_EXIT.h / 2);
  ctx.restore();
}

function drawMazeRelic(ctx, relic, time) {
  if (relic.taken) return;
  ctx.save();
  ctx.translate(relic.x, relic.y + Math.sin(time / 180 + relic.id) * 4);
  ctx.shadowColor = "#facc15";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(12, 0);
  ctx.lineTo(0, 14);
  ctx.lineTo(-12, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fef3c7";
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMazeGate(ctx, gate, mode) {
  ctx.save();
  const active = mode === "learn" || !gate.solved;
  ctx.globalAlpha = gate.solved ? 0.36 : 1;
  ctx.shadowColor = gate.flash > 0 ? "#fb7185" : gate.color;
  ctx.shadowBlur = active ? 18 : 4;
  drawRoundRect(ctx, gate.x, gate.y, gate.w, gate.h, 10);
  ctx.fillStyle = gate.solved ? "#475569" : gate.color;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.55)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#0f172a";
  ctx.font = "900 14px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(gate.label, gate.x + gate.w / 2, gate.y + gate.h / 2);
  ctx.restore();
}

function drawMazeGuard(ctx, guard, time) {
  ctx.save();
  ctx.translate(guard.x, guard.y);
  ctx.shadowColor = guard.color;
  ctx.shadowBlur = 12;
  ctx.fillStyle = guard.color;
  ctx.beginPath();
  ctx.arc(0, 0, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fee2e2";
  ctx.fillRect(-8, -4, 16, 4);
  ctx.strokeStyle = "rgba(254,202,202,.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 27 + Math.sin(time / 180) * 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawMazePlayer(ctx, player, time) {
  ctx.save();
  ctx.translate(player.x, player.y);
  const hurt = time < player.hurtUntil;
  ctx.globalAlpha = hurt ? 0.6 + Math.sin(time / 35) * 0.26 : 1;
  ctx.shadowColor = "#93c5fd";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#dbeafe";
  ctx.beginPath();
  ctx.arc(0, 0, MAZE_PLAYER.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1e3a8a";
  ctx.beginPath();
  ctx.arc(5, -4, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#bfdbfe";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-8, 12);
  ctx.lineTo(8, 12);
  ctx.stroke();
  ctx.restore();
}

function renderMazeGame(ctx, state, mode, subject) {
  const time = performance.now();
  drawMazeBackground(ctx);
  drawMazeExit(ctx, state.exitOpen);
  state.relics.forEach((relic) => drawMazeRelic(ctx, relic, time));
  state.gates.forEach((gate) => drawMazeGate(ctx, gate, mode));
  MAZE_WALLS.forEach((wall) => drawMazeWall(ctx, wall));
  state.guards.forEach((guard) => drawMazeGuard(ctx, guard, time));
  drawParticles(ctx, state.particles);
  drawMazePlayer(ctx, state.player, time);

  ctx.save();
  ctx.fillStyle = "rgba(15,23,42,.76)";
  drawRoundRect(ctx, 18, CANVAS_HEIGHT - 72, 592, 50, 12);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "800 16px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const prompt = mode === "learn"
    ? `${state.challenge.term}: ${state.challenge.prompt}`
    : "Sammle Schlüssel, meide Wächter, öffne das Tor.";
  ctx.fillText(prompt, 36, CANVAS_HEIGHT - 48);
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "600 12px system-ui, sans-serif";
  ctx.fillText(state.feedback, 36, CANVAS_HEIGHT - 28);
  ctx.fillStyle = SUBJECTS[subject].accent;
  ctx.fillRect(36, CANVAS_HEIGHT - 18, (state.exitOpen ? 1 : clamp(state.keys / 3, 0, 1)) * 520, 4);
  ctx.restore();
}

function updateMazeSimulation(state, input, dt, mode, subject, callbacks) {
  const time = performance.now();
  const player = state.player;

  if (state.hp <= 0 || state.timeLeft <= 0) {
    resetMazeRound(state, mode, subject, "Zurück am Eingang. Neue Runde.");
    state.score = Math.max(0, Math.floor(state.score * 0.5));
    return;
  }

  state.timeLeft -= dt;
  state.choiceCooldown = Math.max(0, state.choiceCooldown - dt);

  const dx = (input.right || input.d ? 1 : 0) - (input.left || input.a ? 1 : 0);
  const dy = (input.down || input.s ? 1 : 0) - (input.up || input.w ? 1 : 0);
  const length = Math.hypot(dx, dy) || 1;
  const speed = input.space ? 250 : 190;
  player.vx = (dx / length) * speed;
  player.vy = (dy / length) * speed;

  const nextX = player.x + player.vx * dt;
  if (!mazeBlocked(nextX, player.y, MAZE_PLAYER.r)) player.x = nextX;
  const nextY = player.y + player.vy * dt;
  if (!mazeBlocked(player.x, nextY, MAZE_PLAYER.r)) player.y = nextY;

  state.relics.forEach((relic) => {
    if (relic.taken || distance(player, relic) > 28) return;
    relic.taken = true;
    state.keys += 1;
    state.score += 30 + state.combo * 4;
    state.combo += 1;
    state.feedback = state.keys >= 3 ? "Das Tor ist offen." : `${state.keys}/3 Schlüssel gefunden.`;
    state.exitOpen = state.keys >= 3 || state.exitOpen;
    addBurst(state, relic.x, relic.y, "#facc15", 12);
    playTone("success");
  });

  state.guards.forEach((guard) => {
    guard.x += guard.vx * dt;
    guard.y += guard.vy * dt;
    if (guard.x < guard.minX || guard.x > guard.maxX) {
      guard.vx *= -1;
      guard.x = clamp(guard.x, guard.minX, guard.maxX);
    }
    if (guard.y < guard.minY || guard.y > guard.maxY) {
      guard.vy *= -1;
      guard.y = clamp(guard.y, guard.minY, guard.maxY);
    }

    if (distance(player, guard) < 33 && time > player.hurtUntil) {
      player.hurtUntil = time + 820;
      const angle = Math.atan2(player.y - guard.y, player.x - guard.x);
      const knockX = player.x + Math.cos(angle) * 42;
      const knockY = player.y + Math.sin(angle) * 42;
      if (!mazeBlocked(knockX, player.y, MAZE_PLAYER.r)) player.x = knockX;
      if (!mazeBlocked(player.x, knockY, MAZE_PLAYER.r)) player.y = knockY;
      state.hp = clamp(state.hp - 13, 0, 100);
      state.combo = 0;
      state.feedback = "Wächterkontakt.";
      addBurst(state, player.x, player.y, "#fb7185", 12);
      playTone("hit");
      callbacks.onWrong?.();
    }
  });

  if (state.choiceCooldown <= 0) {
    state.gates.forEach((gate) => {
      if (gate.solved || !circleRectHit(player, gate, MAZE_PLAYER.r)) return;
      state.choiceCooldown = 0.8;

      if (mode === "learn") {
        if (gate.answer === state.challenge.correct) {
          gate.solved = true;
          state.exitOpen = true;
          state.score += 120 + state.combo * 10;
          state.combo += 1;
          state.timeLeft = clamp(state.timeLeft + 10, 0, 145);
          state.feedback = `Richtig: ${state.challenge.term} -> ${gate.answer}. Tor offen.`;
          addBurst(state, gate.x + gate.w / 2, gate.y + gate.h / 2, "#86efac", 22);
          playTone("success");
          callbacks.onCorrect?.(5);
        } else {
          gate.flash = 0.5;
          state.hp = clamp(state.hp - 11, 0, 100);
          state.combo = 0;
          state.feedback = `"${gate.answer}" öffnet diese Tür nicht.`;
          addBurst(state, gate.x + gate.w / 2, gate.y + gate.h / 2, "#fb7185", 16);
          playTone("wrong");
          callbacks.onWrong?.();
        }
      } else {
        gate.solved = true;
        state.keys += 1;
        state.exitOpen = state.keys >= 3;
        state.score += 25 + state.combo * 4;
        state.combo += 1;
        state.feedback = state.exitOpen ? "Das Tor ist offen." : `${state.keys}/3 Runen aktiviert.`;
        addBurst(state, gate.x + gate.w / 2, gate.y + gate.h / 2, "#38bdf8", 14);
        playTone("success");
      }
    });
  }

  state.gates.forEach((gate) => {
    gate.flash = Math.max(0, gate.flash - dt);
  });

  state.particles = state.particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * dt,
      y: particle.y + particle.vy * dt,
      vy: particle.vy + 80 * dt,
      life: particle.life - dt * 1.7,
    }))
    .filter((particle) => particle.life > 0);

  if (circleRectHit(player, MAZE_EXIT, MAZE_PLAYER.r)) {
    if (state.exitOpen) {
      state.score += 160 + state.combo * 12;
      state.combo += 1;
      state.timeLeft = clamp(state.timeLeft + 12, 0, 150);
      addBurst(state, MAZE_EXIT.x + MAZE_EXIT.w / 2, MAZE_EXIT.y + MAZE_EXIT.h / 2, "#22d3ee", 30);
      callbacks.onCorrect?.(mode === "learn" ? 4 : 2);
      resetMazeRound(state, mode, subject, "Dungeon geschafft. Neue Runde.");
    } else {
      state.feedback = mode === "learn" ? "Erst die richtige Antwort finden." : "Erst drei Schlüssel oder Runen aktivieren.";
    }
  }
}

function makeMazeHud(state, mode) {
  const objective = mode === "learn"
    ? `Antwort: ${state.challenge.correct}`
    : state.exitOpen
      ? "Tor offen"
      : `Schlüssel ${state.keys}/3`;

  return {
    score: Math.floor(state.score),
    combo: state.combo,
    damage: 100 - Math.floor(state.hp),
    time: Math.max(0, Math.ceil(state.timeLeft)),
    objective,
    feedback: state.feedback,
  };
}

function FastMazeGame({ mode, subject, onCorrect, onWrong }) {
  const canvasRef = useRef(null);
  const inputRef = useRef({});
  const callbacksRef = useRef({ onCorrect, onWrong });
  const [hud, setHud] = useState({
    score: 0,
    combo: 0,
    damage: 0,
    time: 125,
    objective: "Schlüssel 0/3",
    feedback: "Pfeiltasten oder WASD. Space läuft schneller.",
  });

  useEffect(() => {
    callbacksRef.current = { onCorrect, onWrong };
  }, [onCorrect, onWrong]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.touchAction = "none";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const state = createMazeState(mode, subject);
    let rafId = 0;
    let lastTime = performance.now();
    let lastHud = 0;

    const setKey = (event, pressed) => {
      const key = event.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "w", "a", "s", "d"].includes(key)) {
        event.preventDefault();
      }
      if (key === "arrowup") inputRef.current.up = pressed;
      if (key === "arrowdown") inputRef.current.down = pressed;
      if (key === "arrowleft") inputRef.current.left = pressed;
      if (key === "arrowright") inputRef.current.right = pressed;
      if (key === " ") inputRef.current.space = pressed;
      if (["w", "a", "s", "d"].includes(key)) inputRef.current[key] = pressed;
    };
    const keyDown = (event) => setKey(event, true);
    const keyUp = (event) => setKey(event, false);
    const focusCanvas = (event) => {
      event.preventDefault();
      canvas.focus();
    };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    canvas.addEventListener("pointerdown", focusCanvas);

    const frame = (time) => {
      const dt = clamp((time - lastTime) / 1000, 0, 0.04);
      lastTime = time;
      updateMazeSimulation(state, inputRef.current, dt, mode, subject, callbacksRef.current);
      renderMazeGame(ctx, state, mode, subject);
      if (time - lastHud > 120) {
        setHud(makeMazeHud(state, mode));
        lastHud = time;
      }
      rafId = window.requestAnimationFrame(frame);
    };

    renderMazeGame(ctx, state, mode, subject);
    rafId = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      canvas.removeEventListener("pointerdown", focusCanvas);
      inputRef.current = {};
    };
  }, [mode, subject]);

  const press = (key, value) => {
    inputRef.current[key] = value;
  };

  return (
    <div className="relative min-h-0">
      <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
        <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-slate-950 shadow-2xl">
          <canvas
            ref={canvasRef}
            tabIndex={0}
            aria-label="Labyrinth Run Spielfeld"
            className="block aspect-video w-full bg-slate-950 outline-none"
          />
          <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.18em] text-white">
            <span className="rounded-full bg-slate-950/80 px-3 py-2 shadow-lg">Score {hud.score}</span>
            <span className="rounded-full bg-slate-950/80 px-3 py-2 shadow-lg">Zeit {hud.time}</span>
            <span className="rounded-full bg-slate-950/80 px-3 py-2 shadow-lg">Combo x{hud.combo}</span>
            <span className={`rounded-full px-3 py-2 shadow-lg ${hud.damage > 70 ? "bg-rose-700/90" : "bg-slate-950/80"}`}>
              Schaden {hud.damage}%
            </span>
          </div>
        </div>

        <aside className="rounded-[28px] border border-white/12 bg-slate-900/84 p-4 text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Mission</p>
          <h2 className="mt-2 text-2xl font-black leading-tight">{hud.objective}</h2>
          <p className="mt-3 min-h-12 text-sm font-semibold leading-relaxed text-slate-300">{hud.feedback}</p>

          <div className="mt-5 grid grid-cols-3 gap-2 text-sm font-black">
            <span />
            <button
              type="button"
              aria-label="Nach oben"
              onPointerDown={() => press("up", true)}
              onPointerUp={() => press("up", false)}
              onPointerLeave={() => press("up", false)}
              className="rounded-2xl bg-slate-800 px-3 py-4 text-white shadow-inner"
            >
              Hoch
            </button>
            <span />
            <button
              type="button"
              aria-label="Nach links"
              onPointerDown={() => press("left", true)}
              onPointerUp={() => press("left", false)}
              onPointerLeave={() => press("left", false)}
              className="rounded-2xl bg-slate-800 px-3 py-4 text-white shadow-inner"
            >
              Links
            </button>
            <button
              type="button"
              aria-label="Schneller laufen"
              onPointerDown={() => press("space", true)}
              onPointerUp={() => press("space", false)}
              onPointerLeave={() => press("space", false)}
              className="rounded-2xl bg-emerald-500 px-3 py-4 text-slate-950 shadow-inner"
            >
              Lauf
            </button>
            <button
              type="button"
              aria-label="Nach rechts"
              onPointerDown={() => press("right", true)}
              onPointerUp={() => press("right", false)}
              onPointerLeave={() => press("right", false)}
              className="rounded-2xl bg-slate-800 px-3 py-4 text-white shadow-inner"
            >
              Rechts
            </button>
            <span />
            <button
              type="button"
              aria-label="Nach unten"
              onPointerDown={() => press("down", true)}
              onPointerUp={() => press("down", false)}
              onPointerLeave={() => press("down", false)}
              className="rounded-2xl bg-amber-400 px-3 py-4 text-slate-950 shadow-inner"
            >
              Runter
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function FastFlowGameStudio({ activeSubject = "deutsch", onExit, onCorrect, onWrong }) {
  const [mode, setMode] = useState("normal");
  const [subject, setSubject] = useState(normalizeSubject(activeSubject));
  const [activeGame, setActiveGame] = useState("taxi");

  const subjectInfo = SUBJECTS[subject];
  const activeGameInfo = GAME_LIBRARY[activeGame];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
      return;
    }
    document.documentElement.requestFullscreen?.();
  };

  const selectGame = (id) => {
    setActiveGame(id);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  };

  const jumpToPlayfield = () => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  };

  const selectMode = (id) => {
    setMode(id);
    jumpToPlayfield();
  };

  const selectSubject = (id) => {
    setSubject(id);
    jumpToPlayfield();
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0b1018] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col gap-4 px-4 py-4 md:px-6">
        <header className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-slate-900/90 px-5 py-4 shadow-2xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">FASKA Flow Spielraum</p>
            <h1 className="mt-1 text-3xl font-black leading-tight md:text-4xl">{activeGameInfo.title}</h1>
            <p className="mt-1 max-w-3xl text-sm font-semibold text-slate-300">
              FASKA Flow-Spielkerne mit normaler Spielvariante und Lernvariante. Fachaufgaben stecken direkt in der Mechanik, nicht nur in Menüs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/16"
            >
              Vollbild
            </button>
            <button
              type="button"
              onClick={onExit}
              className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100"
            >
              Zurück zu FASKA Flow
            </button>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-[292px_minmax(0,1fr)]">
          <aside className="order-2 rounded-[28px] border border-white/10 bg-slate-900/84 p-4 shadow-xl xl:order-1">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Spiel</p>
            <div className="mt-3 grid gap-2">
              {Object.entries(GAME_LIBRARY).map(([id, game]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectGame(id)}
                  className={`rounded-3xl border p-4 text-left transition ${
                    activeGame === id
                      ? "border-cyan-300/50 bg-cyan-300/12"
                      : "border-white/10 bg-white/6 hover:bg-white/12"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">{game.tag}</span>
                  <span className="mt-1 block text-lg font-black">{game.title}</span>
                  <span className="mt-1 block text-sm font-semibold leading-relaxed text-slate-300">{game.description}</span>
                </button>
              ))}
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-slate-400">Modus</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                ["normal", "Normal"],
                ["learn", "Lernen"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectMode(id)}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    mode === id ? "bg-cyan-300 text-slate-950" : "bg-white/8 text-white hover:bg-white/14"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-slate-400">Fach</p>
            <div className="mt-3 grid gap-2">
              {Object.entries(SUBJECTS).map(([id, item]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectSubject(id)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-black transition ${
                    subject === id ? "bg-white text-slate-950" : "bg-white/8 text-white hover:bg-white/14"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="h-3 w-3 rounded-full" style={{ background: item.accent }} />
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/6 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Aktiv</p>
              <p className="mt-2 text-sm font-semibold text-slate-200">
                {mode === "learn" ? `${subjectInfo.label}-Aufgaben in ${activeGameInfo.title}` : `${activeGameInfo.title} ohne Fachabfrage`}
              </p>
            </div>
          </aside>

          <main className="order-1 min-w-0 xl:order-2">
            {activeGame === "taxi" && (
              <FastTaxiGame
                key={`taxi-${mode}-${subject}`}
                mode={mode}
                subject={subject}
                onCorrect={onCorrect}
                onWrong={onWrong}
              />
            )}
            {activeGame === "ninja" && (
              <FastNinjaRunGame
                key={`ninja-${mode}-${subject}`}
                mode={mode}
                subject={subject}
                onCorrect={onCorrect}
                onWrong={onWrong}
              />
            )}
            {activeGame === "maze" && (
              <FastMazeGame
                key={`maze-${mode}-${subject}`}
                mode={mode}
                subject={subject}
                onCorrect={onCorrect}
                onWrong={onWrong}
              />
            )}
          </main>
        </section>
      </div>
    </div>
  );
}
