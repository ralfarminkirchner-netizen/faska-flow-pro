import { useEffect, useMemo, useRef, useState } from 'react';

const W = 960;
const H = 540;
const STORAGE_KEY = 'faska-core-arcade-best-v1';

const GAMES = [
  { id: 'taxi', label: 'Taxi Rush', icon: '🚕', hint: 'Fahren, abholen, richtig abliefern.' },
  { id: 'snake', label: 'Snake Trail', icon: '🐍', hint: 'Wachsen, ausweichen, Ziel einsammeln.' },
  { id: 'breakout', label: 'Breakout Grid', icon: '🧱', hint: 'Paddle, Ball, klare Treffer.' },
  { id: 'shooter', label: 'Star Defender', icon: '🚀', hint: 'Zielen, schiessen, ausweichen.' },
  { id: 'maze', label: 'Maze Runner', icon: '🧭', hint: 'Wege lesen, Ausgang finden.' },
  { id: 'runner', label: 'Lane Runner', icon: '🏁', hint: 'Spurwechsel, Tempo, Reaktion.' },
];

const SUBJECTS = {
  deutsch: {
    label: 'Deutsch',
    color: '#fb923c',
    challenges: [
      { prompt: 'Welche Wortart ist "rennt"?', answer: 'Verb', options: ['Verb', 'Nomen', 'Artikel', 'Adjektiv'] },
      { prompt: 'Welcher Artikel passt zu "Baum"?', answer: 'Der', options: ['Der', 'Die', 'Das', 'Eine'] },
      { prompt: 'Welche Wortart ist "hell"?', answer: 'Adjektiv', options: ['Verb', 'Nomen', 'Adjektiv', 'Praeposition'] },
      { prompt: 'Was reimt sich auf "Haus"?', answer: 'Maus', options: ['Maus', 'Hund', 'Wiese', 'Brot'] },
      { prompt: 'Welche Silbe beginnt "Trommel"?', answer: 'Trom', options: ['Trom', 'mel', 'Ta', 'Tru'] },
      { prompt: 'Was ist ein Nomen?', answer: 'Stern', options: ['Stern', 'rennt', 'gelb', 'unter'] },
    ],
  },
  mathe: {
    label: 'Mathe',
    color: '#38bdf8',
    challenges: [
      { prompt: '7 + 5 = ?', answer: '12', options: ['12', '10', '13', '9'] },
      { prompt: '3 x 4 = ?', answer: '12', options: ['7', '12', '14', '9'] },
      { prompt: '20 - 6 = ?', answer: '14', options: ['14', '16', '12', '8'] },
      { prompt: 'Welche Zahl ist gerade?', answer: '18', options: ['17', '21', '18', '25'] },
      { prompt: '5 Zehner und 3 Einer', answer: '53', options: ['35', '53', '8', '503'] },
      { prompt: 'Haelfte von 16', answer: '8', options: ['6', '7', '8', '9'] },
    ],
  },
  sach: {
    label: 'Sachkunde',
    color: '#34d399',
    challenges: [
      { prompt: 'Wo lebt ein Fisch?', answer: 'Wasser', options: ['Wasser', 'Wolke', 'Sand', 'Baum'] },
      { prompt: 'Was braucht eine Pflanze?', answer: 'Licht', options: ['Licht', 'Limo', 'Stein', 'Rauch'] },
      { prompt: 'Welches Tier ist nachtaktiv?', answer: 'Eule', options: ['Eule', 'Biene', 'Huhn', 'Kuh'] },
      { prompt: 'Was schuetzt bei Regen?', answer: 'Jacke', options: ['Jacke', 'Sonne', 'Sandale', 'Kerze'] },
      { prompt: 'Was gehoert zum Wetter?', answer: 'Wind', options: ['Wind', 'Tisch', 'Bleistift', 'Trommel'] },
      { prompt: 'Was ist ein Lebensraum?', answer: 'Wald', options: ['Wald', 'Lineal', 'Tasse', 'Tuer'] },
    ],
  },
  musik: {
    label: 'Musik',
    color: '#c084fc',
    challenges: [
      { prompt: 'Welches Instrument hat Tasten?', answer: 'Klavier', options: ['Klavier', 'Trommel', 'Geige', 'Floete'] },
      { prompt: 'Was bedeutet piano?', answer: 'leise', options: ['leise', 'schnell', 'laut', 'hoch'] },
      { prompt: 'Was ist ein Rhythmus?', answer: 'Muster', options: ['Muster', 'Farbe', 'Geruch', 'Zahl'] },
      { prompt: 'Welches Instrument wird geschlagen?', answer: 'Trommel', options: ['Trommel', 'Floete', 'Geige', 'Harfe'] },
      { prompt: 'Was bedeutet forte?', answer: 'laut', options: ['laut', 'leise', 'kurz', 'tief'] },
      { prompt: 'Was klingt hoch?', answer: 'Pfeife', options: ['Pfeife', 'Bass', 'Donner', 'Pauke'] },
    ],
  },
};

const MODE_META = {
  arcade: { label: 'Normal', color: '#f59e0b' },
  learn: { label: 'Lernen', color: '#ec4899' },
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const rectHit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const choose = (items, index) => items[index % items.length];
const shuffle = (items, seed) =>
  [...items]
    .map((item, index) => ({ item, key: (index * 73 + seed * 41 + String(item).length * 19) % 997 }))
    .sort((a, b) => a.key - b.key)
    .map(({ item }) => item);

const drawRoundRect = (ctx, x, y, w, h, r) => {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const drawLabelBox = (ctx, box, text, color, active = false) => {
  ctx.save();
  ctx.fillStyle = active ? color : 'rgba(255,255,255,.9)';
  ctx.strokeStyle = active ? '#fff' : 'rgba(15,23,42,.18)';
  ctx.lineWidth = active ? 5 : 3;
  ctx.shadowColor = 'rgba(15,23,42,.28)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;
  drawRoundRect(ctx, box.x, box.y, box.w, box.h, 16);
  ctx.fill();
  ctx.stroke();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = active ? '#fff' : '#111827';
  ctx.font = `800 ${box.w > 140 ? 24 : 20}px Nunito, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, box.x + box.w / 2, box.y + box.h / 2);
  ctx.restore();
};

function ControlButton({ code, label, onHold }) {
  return (
    <button
      type="button"
      onPointerDown={(event) => {
        event.preventDefault();
        onHold(code, true);
      }}
      onPointerUp={() => onHold(code, false)}
      onPointerCancel={() => onHold(code, false)}
      onPointerLeave={() => onHold(code, false)}
      className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white/10 font-black text-white shadow-lg active:bg-white/25"
      style={{ touchAction: 'none' }}
    >
      {label}
    </button>
  );
}

const challengeFor = (subject, seed) => {
  const bank = SUBJECTS[subject].challenges;
  const base = choose(bank, seed);
  return { ...base, options: shuffle(base.options, seed).slice(0, 4) };
};

const createBaseState = (gameId, variant, subject, level, score) => {
  const challenge = challengeFor(subject, level + score + gameId.length);
  const state = {
    gameId,
    variant,
    subject,
    challenge,
    score,
    level,
    lives: 3,
    combo: 0,
    timer: 75,
    message: variant === 'learn' ? challenge.prompt : 'Los gehts.',
    flash: 0,
    particles: [],
  };

  if (gameId === 'taxi') {
    state.car = { x: 480, y: 270, angle: -Math.PI / 2, speed: 0, w: 42, h: 26 };
    state.pickup = { x: 110, y: 110, r: 28, taken: false, label: variant === 'learn' ? 'Frage' : 'Gast' };
    state.targets = (variant === 'learn' ? challenge.options : ['Museum', 'Park', 'Bahnhof', 'Schule']).map((label, i) => ({
      label,
      x: [76, 710, 710, 76][i],
      y: [378, 76, 378, 76][i],
      w: 170,
      h: 70,
      correct: variant === 'arcade' || label === challenge.answer,
    }));
  }

  if (gameId === 'snake') {
    state.cell = 24;
    state.cols = 40;
    state.rows = 21;
    state.stepTimer = 0;
    state.dir = { x: 1, y: 0 };
    state.nextDir = { x: 1, y: 0 };
    state.snake = [{ x: 10, y: 11 }, { x: 9, y: 11 }, { x: 8, y: 11 }];
    const labels = variant === 'learn' ? challenge.options : ['★', '●', '◆', '■'];
    state.food = labels.map((label, i) => ({
      label,
      x: 16 + ((i * 8 + level * 3) % 20),
      y: 5 + ((i * 5 + level * 2) % 13),
      correct: variant === 'arcade' || label === challenge.answer,
    }));
  }

  if (gameId === 'breakout') {
    state.paddle = { x: 420, y: 492, w: 130, h: 18 };
    state.ball = { x: 485, y: 464, vx: 230, vy: -260, r: 10, held: true };
    const labels = variant === 'learn' ? challenge.options : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    state.bricks = labels.concat(variant === 'learn' ? [] : ['I', 'J', 'K', 'L']).map((label, i) => ({
      label,
      x: 92 + (i % 4) * 194,
      y: 92 + Math.floor(i / 4) * 70,
      w: 156,
      h: 42,
      alive: true,
      correct: variant === 'arcade' || label === challenge.answer,
    }));
  }

  if (gameId === 'shooter') {
    state.player = { x: 465, y: 475, w: 46, h: 34, cooldown: 0 };
    const labels = variant === 'learn' ? challenge.options : ['10', '20', '30', '40'];
    state.targets = labels.map((label, i) => ({
      label,
      x: 120 + i * 205,
      y: 70 + (i % 2) * 45,
      vx: i % 2 ? 70 : -55,
      vy: 18 + level * 2,
      w: 116,
      h: 48,
      correct: variant === 'arcade' || label === challenge.answer,
    }));
    state.bullets = [];
  }

  if (gameId === 'maze') {
    state.cell = 48;
    state.mazeCols = 20;
    state.mazeRows = 11;
    state.player = { x: 1, y: 9, moveTimer: 0 };
    state.exits = (variant === 'learn' ? challenge.options : ['Nord', 'Ost', 'Sued', 'West']).map((label, i) => ({
      label,
      x: [18, 18, 10, 1][i],
      y: [1, 9, 1, 1][i],
      correct: variant === 'arcade' || label === challenge.answer,
    }));
  }

  if (gameId === 'runner') {
    state.lanes = [150, 320, 490, 660];
    state.player = { lane: 1, y: 442, invincible: 0 };
    const labels = variant === 'learn' ? challenge.options : ['Boost', 'Ring', 'Stern', 'Punkt'];
    state.gates = labels.map((label, i) => ({
      label,
      lane: i,
      y: -i * 92 - 40,
      speed: 170 + level * 12,
      correct: variant === 'arcade' || label === challenge.answer,
    }));
  }

  return state;
};

export default function FaskaCoreArcade({ onExit, isLearncade = false }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const keysRef = useRef({});
  const pointerRef = useRef({ active: false, x: W / 2, y: H / 2 });
  const controlsRef = useRef({ left: false, right: false, up: false, down: false, fire: false });
  const [gameId, setGameId] = useState('taxi');
  const [variant, setVariant] = useState(() => (isLearncade ? 'learn' : 'arcade'));
  const [subject, setSubject] = useState('deutsch');
  const [hud, setHud] = useState({ score: 0, lives: 3, combo: 0, level: 1, timer: 75, message: 'Bereit.', prompt: '' });
  const [best, setBest] = useState(() => Number(localStorage.getItem(STORAGE_KEY) || 0));

  const activeGame = useMemo(() => GAMES.find((game) => game.id === gameId) || GAMES[0], [gameId]);
  const activeSubject = SUBJECTS[subject];

  useEffect(() => {
    const next = createBaseState(gameId, variant, subject, 1, 0);
    stateRef.current = next;
  }, [gameId, variant, subject]);

  useEffect(() => {
    const down = (event) => {
      const key = event.key.toLowerCase();
      keysRef.current[key] = true;
      if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) event.preventDefault();
    };
    const up = (event) => {
      keysRef.current[event.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;
    let last = performance.now();
    let hudTimer = 0;

    const addParticles = (x, y, color, count = 18) => {
      const state = stateRef.current;
      if (!state) return;
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count;
        state.particles.push({
          x,
          y,
          vx: Math.cos(angle) * (80 + (i % 4) * 28),
          vy: Math.sin(angle) * (80 + (i % 5) * 22),
          life: 0.7,
          color,
        });
      }
    };

    const completeTarget = (state, correct, x, y) => {
      if (correct) {
        state.score += 100 + state.combo * 20;
        state.combo += 1;
        state.level += state.combo % 4 === 0 ? 1 : 0;
        state.message = state.variant === 'learn' ? `Richtig: ${state.challenge.answer}` : 'Treffer.';
        state.flash = 0.25;
        addParticles(x, y, '#34d399', 24);
        const nextState = createBaseState(state.gameId, state.variant, state.subject, state.level, state.score);
        nextState.lives = state.lives;
        nextState.combo = state.combo;
        nextState.timer = Math.min(99, state.timer + 8);
        stateRef.current = nextState;
        if (nextState.score > best) {
          localStorage.setItem(STORAGE_KEY, String(nextState.score));
          setBest(nextState.score);
        }
      } else {
        state.lives -= 1;
        state.combo = 0;
        state.message = state.variant === 'learn' ? `Falsche Antwort. Ziel: ${state.challenge.answer}` : 'Aua. Weiter.';
        state.flash = 0.4;
        addParticles(x, y, '#fb7185', 16);
        if (state.lives <= 0) {
          const reset = createBaseState(state.gameId, state.variant, state.subject, 1, 0);
          reset.message = 'Neue Runde. Ruhig bleiben.';
          stateRef.current = reset;
        }
      }
    };

    const getInput = () => {
      const keys = keysRef.current;
      const buttons = controlsRef.current;
      return {
        left: keys.a || keys.arrowleft || buttons.left,
        right: keys.d || keys.arrowright || buttons.right,
        up: keys.w || keys.arrowup || buttons.up,
        down: keys.s || keys.arrowdown || buttons.down,
        fire: keys[' '] || keys.enter || buttons.fire,
      };
    };

    const updateTaxi = (state, dt, input) => {
      const car = state.car;
      if (input.up) car.speed += 230 * dt;
      if (input.down) car.speed -= 190 * dt;
      car.speed *= 0.982;
      car.speed = clamp(car.speed, -140, 260);
      if (Math.abs(car.speed) > 8) {
        const turn = car.speed > 0 ? 1 : -1;
        if (input.left) car.angle -= 3.2 * dt * turn;
        if (input.right) car.angle += 3.2 * dt * turn;
      }
      if (pointerRef.current.active) {
        const dx = pointerRef.current.x - car.x;
        const dy = pointerRef.current.y - car.y;
        if (Math.hypot(dx, dy) > 18) {
          car.angle = Math.atan2(dy, dx);
          car.speed = Math.max(car.speed, 120);
        }
      }
      car.x = clamp(car.x + Math.cos(car.angle) * car.speed * dt, 28, W - 28);
      car.y = clamp(car.y + Math.sin(car.angle) * car.speed * dt, 86, H - 30);

      if (!state.pickup.taken && dist(car, state.pickup) < state.pickup.r + 24) {
        state.pickup.taken = true;
        state.message = state.variant === 'learn' ? state.challenge.prompt : 'Fahr zum Ziel.';
        addParticles(state.pickup.x, state.pickup.y, '#facc15', 20);
      }
      if (state.pickup.taken) {
        const hit = state.targets.find((target) => rectHit({ x: car.x - 20, y: car.y - 14, w: 40, h: 28 }, target));
        if (hit) completeTarget(state, hit.correct, hit.x + hit.w / 2, hit.y + hit.h / 2);
      }
    };

    const updateSnake = (state, dt, input) => {
      if (input.left && state.dir.x !== 1) state.nextDir = { x: -1, y: 0 };
      if (input.right && state.dir.x !== -1) state.nextDir = { x: 1, y: 0 };
      if (input.up && state.dir.y !== 1) state.nextDir = { x: 0, y: -1 };
      if (input.down && state.dir.y !== -1) state.nextDir = { x: 0, y: 1 };
      state.stepTimer += dt;
      if (state.stepTimer < Math.max(0.075, 0.16 - state.level * 0.006)) return;
      state.stepTimer = 0;
      state.dir = state.nextDir;
      const head = state.snake[0];
      const next = { x: head.x + state.dir.x, y: head.y + state.dir.y };
      if (next.x < 0 || next.x >= state.cols || next.y < 3 || next.y >= state.rows || state.snake.some((seg) => seg.x === next.x && seg.y === next.y)) {
        completeTarget(state, false, head.x * state.cell, head.y * state.cell);
        return;
      }
      state.snake.unshift(next);
      const food = state.food.find((item) => item.x === next.x && item.y === next.y);
      if (food) {
        completeTarget(state, food.correct, food.x * state.cell + 12, food.y * state.cell + 12);
      } else {
        state.snake.pop();
      }
    };

    const updateBreakout = (state, dt, input) => {
      const paddle = state.paddle;
      const ball = state.ball;
      if (input.left) paddle.x -= 520 * dt;
      if (input.right) paddle.x += 520 * dt;
      if (pointerRef.current.active) paddle.x = pointerRef.current.x - paddle.w / 2;
      paddle.x = clamp(paddle.x, 20, W - paddle.w - 20);
      if (ball.held) {
        ball.x = paddle.x + paddle.w / 2;
        ball.y = paddle.y - 18;
        if (input.fire || input.up || pointerRef.current.active) ball.held = false;
        return;
      }
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      if (ball.x < ball.r || ball.x > W - ball.r) ball.vx *= -1;
      if (ball.y < 76 + ball.r) ball.vy *= -1;
      if (ball.y > H + 30) {
        completeTarget(state, false, paddle.x + paddle.w / 2, paddle.y);
        return;
      }
      if (rectHit({ x: ball.x - ball.r, y: ball.y - ball.r, w: ball.r * 2, h: ball.r * 2 }, paddle) && ball.vy > 0) {
        ball.vy = -Math.abs(ball.vy) * 1.02;
        ball.vx += ((ball.x - (paddle.x + paddle.w / 2)) / paddle.w) * 260;
      }
      const brick = state.bricks.find((item) => item.alive && rectHit({ x: ball.x - ball.r, y: ball.y - ball.r, w: ball.r * 2, h: ball.r * 2 }, item));
      if (brick) {
        brick.alive = false;
        ball.vy *= -1;
        completeTarget(state, brick.correct, brick.x + brick.w / 2, brick.y + brick.h / 2);
      }
      if (state.variant === 'arcade' && state.bricks.every((brickItem) => !brickItem.alive)) {
        completeTarget(state, true, W / 2, 180);
      }
    };

    const updateShooter = (state, dt, input) => {
      const player = state.player;
      if (input.left) player.x -= 420 * dt;
      if (input.right) player.x += 420 * dt;
      if (pointerRef.current.active) player.x = pointerRef.current.x - player.w / 2;
      player.x = clamp(player.x, 28, W - player.w - 28);
      player.cooldown = Math.max(0, player.cooldown - dt);
      if ((input.fire || input.up || pointerRef.current.active) && player.cooldown <= 0) {
        state.bullets.push({ x: player.x + player.w / 2 - 3, y: player.y - 8, w: 6, h: 18, vy: -520 });
        player.cooldown = 0.22;
      }
      state.bullets.forEach((bullet) => {
        bullet.y += bullet.vy * dt;
      });
      state.bullets = state.bullets.filter((bullet) => bullet.y > 72);
      state.targets.forEach((target) => {
        target.x += target.vx * dt;
        target.y += target.vy * dt;
        if (target.x < 35 || target.x + target.w > W - 35) target.vx *= -1;
        if (target.y > H - 100) {
          target.y = 82;
          target.x = 70 + ((target.x + 177) % 700);
          completeTarget(state, false, target.x, target.y);
        }
      });
      for (const bullet of state.bullets) {
        const hit = state.targets.find((target) => rectHit(bullet, target));
        if (hit) {
          completeTarget(state, hit.correct, hit.x + hit.w / 2, hit.y + hit.h / 2);
          break;
        }
      }
    };

    const mazeWall = (x, y) => {
      if (x < 0 || y < 0 || x >= 20 || y >= 11) return true;
      if (y === 0 || y === 10 || x === 0 || x === 19) return true;
      if (x === 4 && y < 8) return true;
      if (x === 8 && y > 2) return true;
      if (x === 12 && y < 8) return true;
      if (x === 16 && y > 2) return true;
      if (y === 4 && x > 2 && x < 17) return x !== 6 && x !== 14;
      if (y === 7 && x > 1 && x < 18) return x !== 10;
      return false;
    };

    const updateMaze = (state, dt, input) => {
      const player = state.player;
      player.moveTimer -= dt;
      if (player.moveTimer <= 0) {
        const dx = input.left ? -1 : input.right ? 1 : 0;
        const dy = input.up ? -1 : input.down ? 1 : 0;
        if ((dx || dy) && !mazeWall(player.x + dx, player.y + dy)) {
          player.x += dx;
          player.y += dy;
          player.moveTimer = 0.11;
        }
      }
      const exit = state.exits.find((item) => item.x === player.x && item.y === player.y);
      if (exit) completeTarget(state, exit.correct, exit.x * state.cell + 24, exit.y * state.cell + 24);
    };

    const updateRunner = (state, dt, input) => {
      const player = state.player;
      player.invincible = Math.max(0, player.invincible - dt);
      if ((input.left || input.right) && player.invincible <= 0) {
        player.lane = clamp(player.lane + (input.left ? -1 : 1), 0, state.lanes.length - 1);
        player.invincible = 0.16;
      }
      state.gates.forEach((gate) => {
        gate.y += gate.speed * dt;
        if (gate.y > H + 30) {
          gate.y = -80;
          if (!gate.correct && state.variant === 'learn') return;
          completeTarget(state, false, state.lanes[gate.lane], H - 80);
        }
        if (gate.lane === player.lane && Math.abs(gate.y - player.y) < 38) {
          completeTarget(state, gate.correct, state.lanes[gate.lane], gate.y);
        }
      });
    };

    const updateParticles = (state, dt) => {
      state.particles = state.particles.filter((particle) => {
        particle.life -= dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vy += 160 * dt;
        return particle.life > 0;
      });
    };

    const drawBack = (state) => {
      const gradient = ctx.createLinearGradient(0, 0, W, H);
      gradient.addColorStop(0, '#07111f');
      gradient.addColorStop(0.55, '#111827');
      gradient.addColorStop(1, '#24122f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 76);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 76; y < H; y += 48) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(0,0,0,.48)';
      ctx.fillRect(0, 0, W, 72);
      ctx.fillStyle = '#fff';
      ctx.font = '900 20px Nunito, sans-serif';
      ctx.textAlign = 'left';
      const currentGame = GAMES.find((game) => game.id === state.gameId) || GAMES[0];
      ctx.fillText(`${currentGame.label} · ${MODE_META[state.variant].label}`, 22, 28);
      ctx.font = '800 15px Nunito, sans-serif';
      ctx.fillStyle = state.variant === 'learn' ? SUBJECTS[state.subject].color : '#fbbf24';
      ctx.fillText(state.message, 22, 54);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#e5e7eb';
      ctx.fillText(`Score ${state.score}   Leben ${state.lives}   Combo ${state.combo}x`, W - 22, 28);
      ctx.fillText(`Level ${state.level}   Zeit ${Math.ceil(state.timer)}`, W - 22, 54);
      if (state.flash > 0) {
        ctx.fillStyle = `rgba(251, 113, 133, ${Math.min(0.28, state.flash)})`;
        ctx.fillRect(0, 72, W, H - 72);
      }
    };

    const drawTaxi = (state) => {
      ctx.fillStyle = 'rgba(148,163,184,.26)';
      for (let i = 0; i < 8; i += 1) {
        drawRoundRect(ctx, 80 + (i % 4) * 210, 104 + Math.floor(i / 4) * 180, 120, 72, 10);
        ctx.fill();
      }
      ctx.strokeStyle = 'rgba(250,204,21,.8)';
      ctx.lineWidth = 4;
      ctx.setLineDash([30, 24]);
      ctx.beginPath();
      ctx.moveTo(0, 270);
      ctx.lineTo(W, 270);
      ctx.moveTo(480, 72);
      ctx.lineTo(480, H);
      ctx.stroke();
      ctx.setLineDash([]);
      state.targets.forEach((target) => drawLabelBox(ctx, target, target.label, SUBJECTS[state.subject].color, target.correct && state.variant === 'learn'));
      if (!state.pickup.taken) {
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(state.pickup.x, state.pickup.y, state.pickup.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#111827';
        ctx.font = '900 18px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(state.pickup.label, state.pickup.x, state.pickup.y + 6);
      }
      const car = state.car;
      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.angle);
      drawRoundRect(ctx, -car.w / 2, -car.h / 2, car.w, car.h, 8);
      ctx.fillStyle = '#facc15';
      ctx.fill();
      ctx.fillStyle = '#111827';
      ctx.fillRect(-6, -10, 16, 20);
      ctx.restore();
    };

    const drawSnake = (state) => {
      state.food.forEach((food) => {
        drawLabelBox(ctx, { x: food.x * state.cell + 3, y: food.y * state.cell + 3, w: state.cell * 3, h: state.cell - 5 }, food.label, SUBJECTS[state.subject].color, food.correct);
      });
      state.snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#f8fafc' : '#22c55e';
        drawRoundRect(ctx, seg.x * state.cell + 2, seg.y * state.cell + 2, state.cell - 4, state.cell - 4, 7);
        ctx.fill();
      });
    };

    const drawBreakout = (state) => {
      state.bricks.filter((brick) => brick.alive).forEach((brick) => drawLabelBox(ctx, brick, brick.label, SUBJECTS[state.subject].color, brick.correct));
      ctx.fillStyle = '#38bdf8';
      drawRoundRect(ctx, state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h, 9);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(state.ball.x, state.ball.y, state.ball.r, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawShooter = (state) => {
      state.targets.forEach((target) => drawLabelBox(ctx, target, target.label, SUBJECTS[state.subject].color, target.correct));
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(state.player.x + state.player.w / 2, state.player.y);
      ctx.lineTo(state.player.x, state.player.y + state.player.h);
      ctx.lineTo(state.player.x + state.player.w, state.player.y + state.player.h);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#facc15';
      state.bullets.forEach((bullet) => {
        drawRoundRect(ctx, bullet.x, bullet.y, bullet.w, bullet.h, 3);
        ctx.fill();
      });
    };

    const drawMaze = (state) => {
      for (let y = 0; y < state.mazeRows; y += 1) {
        for (let x = 0; x < state.mazeCols; x += 1) {
          if (mazeWall(x, y)) {
            ctx.fillStyle = '#0f766e';
            drawRoundRect(ctx, x * state.cell, y * state.cell + 72, state.cell - 2, state.cell - 2, 7);
            ctx.fill();
          }
        }
      }
      state.exits.forEach((exit) => drawLabelBox(ctx, { x: exit.x * state.cell + 3, y: exit.y * state.cell + 76, w: state.cell * 3, h: state.cell - 8 }, exit.label, SUBJECTS[state.subject].color, exit.correct));
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(state.player.x * state.cell + 24, state.player.y * state.cell + 96, 17, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawRunner = (state) => {
      state.lanes.forEach((x) => {
        ctx.strokeStyle = 'rgba(255,255,255,.2)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x, 76);
        ctx.lineTo(x, H);
        ctx.stroke();
      });
      state.gates.forEach((gate) => drawLabelBox(ctx, { x: state.lanes[gate.lane] - 64, y: gate.y, w: 128, h: 50 }, gate.label, SUBJECTS[state.subject].color, gate.correct));
      ctx.fillStyle = '#facc15';
      drawRoundRect(ctx, state.lanes[state.player.lane] - 26, state.player.y, 52, 38, 12);
      ctx.fill();
    };

    const drawParticles = (state) => {
      state.particles.forEach((particle) => {
        ctx.globalAlpha = clamp(particle.life / 0.7, 0, 1);
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };

    const loop = (now) => {
      const state = stateRef.current;
      if (!state) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      const input = getInput();
      state.timer -= dt;
      state.flash = Math.max(0, state.flash - dt);
      if (state.timer <= 0) completeTarget(state, false, W / 2, H / 2);
      if (stateRef.current === state) {
        if (state.gameId === 'taxi') updateTaxi(state, dt, input);
        if (state.gameId === 'snake') updateSnake(state, dt, input);
        if (state.gameId === 'breakout') updateBreakout(state, dt, input);
        if (state.gameId === 'shooter') updateShooter(state, dt, input);
        if (state.gameId === 'maze') updateMaze(state, dt, input);
        if (state.gameId === 'runner') updateRunner(state, dt, input);
        updateParticles(state, dt);
      }
      const latest = stateRef.current || state;
      drawBack(latest);
      if (latest.gameId === 'taxi') drawTaxi(latest);
      if (latest.gameId === 'snake') drawSnake(latest);
      if (latest.gameId === 'breakout') drawBreakout(latest);
      if (latest.gameId === 'shooter') drawShooter(latest);
      if (latest.gameId === 'maze') drawMaze(latest);
      if (latest.gameId === 'runner') drawRunner(latest);
      drawParticles(latest);
      hudTimer += dt;
      if (hudTimer > 0.12) {
        hudTimer = 0;
        setHud({
          score: latest.score,
          lives: latest.lives,
          combo: latest.combo,
          level: latest.level,
          timer: Math.ceil(latest.timer),
          message: latest.message,
          prompt: latest.challenge?.prompt || '',
        });
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [best]);

  const resetGame = () => {
    stateRef.current = createBaseState(gameId, variant, subject, 1, 0);
  };

  const holdControl = (key, active) => {
    controlsRef.current[key] = active;
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-x-0 top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/88 px-4 py-3 backdrop-blur">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.22em] text-white/45">Stabile Referenz-Engine</p>
          <h2 className="text-2xl font-black leading-none md:text-4xl">FASKA Core Arcade</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(MODE_META).map(([id, meta]) => (
            <button
              key={id}
              type="button"
              onClick={() => setVariant(id)}
              className={`rounded-2xl px-4 py-2 text-sm font-black transition ${variant === id ? 'text-slate-950' : 'bg-white/10 text-white hover:bg-white/15'}`}
              style={{ backgroundColor: variant === id ? meta.color : undefined }}
            >
              {meta.label}
            </button>
          ))}
          <select
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="rounded-2xl border border-white/15 bg-slate-900 px-3 py-2 text-sm font-bold text-white"
            disabled={variant !== 'learn'}
          >
            {Object.entries(SUBJECTS).map(([id, item]) => (
              <option key={id} value={id}>{item.label}</option>
            ))}
          </select>
          <button type="button" onClick={resetGame} className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-black hover:bg-white/15">Reset</button>
          <button type="button" onClick={onExit} className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-black text-white shadow-lg">Beenden</button>
        </div>
      </div>

      <div className="absolute left-0 top-[76px] z-10 flex h-[calc(100%-76px)] w-52 flex-col gap-2 overflow-y-auto border-r border-white/10 bg-slate-950/72 p-3 backdrop-blur">
        {GAMES.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => setGameId(game.id)}
            className={`rounded-2xl border p-3 text-left transition ${gameId === game.id ? 'border-amber-300 bg-amber-300 text-slate-950' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
          >
            <span className="text-2xl">{game.icon}</span>
            <span className="mt-1 block text-sm font-black">{game.label}</span>
            <span className={`mt-1 block text-[10px] font-bold leading-tight ${gameId === game.id ? 'text-slate-700' : 'text-white/45'}`}>{game.hint}</span>
          </button>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pl-52 pt-[76px]">
        <div className="relative aspect-[16/9] w-[min(calc(100vw-14rem),calc((100vh-7rem)*1.777))] overflow-hidden rounded-[28px] border border-white/15 bg-black shadow-2xl">
          <canvas
            ref={canvasRef}
            className="block h-full w-full touch-none"
            onPointerDown={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              pointerRef.current = {
                active: true,
                x: ((event.clientX - rect.left) / rect.width) * W,
                y: ((event.clientY - rect.top) / rect.height) * H,
              };
            }}
            onPointerMove={(event) => {
              if (!pointerRef.current.active) return;
              const rect = event.currentTarget.getBoundingClientRect();
              pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * W;
              pointerRef.current.y = ((event.clientY - rect.top) / rect.height) * H;
            }}
            onPointerUp={() => {
              pointerRef.current.active = false;
            }}
            onPointerCancel={() => {
              pointerRef.current.active = false;
            }}
            style={{ touchAction: 'none' }}
            aria-label={`${activeGame.label} ${MODE_META[variant].label}`}
          />
          {variant === 'learn' && (
            <div className="pointer-events-none absolute left-5 right-5 top-20 rounded-2xl border border-white/10 bg-slate-950/72 px-4 py-3 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[.18em] text-white/45">{activeSubject.label}</p>
              <p className="text-xl font-black text-white">{hud.prompt || 'Frage wird geladen.'}</p>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 left-56 z-20 grid grid-cols-[48px_48px_48px] gap-2 md:hidden">
        <span />
        <ControlButton code="up" label="▲" onHold={holdControl} />
        <span />
        <ControlButton code="left" label="◀" onHold={holdControl} />
        <ControlButton code="down" label="▼" onHold={holdControl} />
        <ControlButton code="right" label="▶" onHold={holdControl} />
      </div>
      <div className="absolute bottom-4 right-4 z-20 md:hidden">
        <ControlButton code="fire" label="●" onHold={holdControl} />
      </div>

      <div
        className="absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 gap-3 rounded-2xl border border-white/10 bg-slate-950/72 px-4 py-3 text-sm font-black shadow-xl backdrop-blur md:flex"
      >
        <span>Score {hud.score}</span>
        <span className="text-white/30">|</span>
        <span>Leben {hud.lives}</span>
        <span className="text-white/30">|</span>
        <span>Combo {hud.combo}x</span>
        <span className="text-white/30">|</span>
        <span>Best {best}</span>
        <span className="text-white/30">|</span>
        <span>WASD/Pfeile, Space/Enter</span>
      </div>
    </div>
  );
}
