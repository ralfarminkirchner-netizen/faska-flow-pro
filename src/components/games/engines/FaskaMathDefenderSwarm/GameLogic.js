import { createGameStore } from '../../../../shared/useSwarmStore';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const uid = () => Math.random().toString(36).slice(2, 10);

const TYPE_CONFIG = {
  meteor: {
    label: 'Meteor',
    color: '#94a3b8',
    emissive: '#1e293b',
    hp: 1,
    speed: 3.1,
    score: 120,
    radius: 1.35,
    damage: 24,
    weight: 44,
  },
  fast: {
    label: 'Runner',
    color: '#38bdf8',
    emissive: '#0ea5e9',
    hp: 1,
    speed: 5.2,
    score: 180,
    radius: 1.05,
    damage: 22,
    weight: 18,
  },
  shield: {
    label: 'Schild',
    color: '#a78bfa',
    emissive: '#7c3aed',
    hp: 2,
    speed: 2.55,
    score: 260,
    radius: 1.45,
    damage: 30,
    weight: 14,
  },
  splitter: {
    label: 'Splitter',
    color: '#f97316',
    emissive: '#ea580c',
    hp: 1,
    speed: 3.55,
    score: 210,
    radius: 1.25,
    damage: 26,
    weight: 12,
  },
  bomb: {
    label: 'Bombe',
    color: '#fb7185',
    emissive: '#e11d48',
    hp: 1,
    speed: 3.3,
    score: 300,
    radius: 1.28,
    damage: 42,
    weight: 7,
  },
  supply: {
    label: 'Supply',
    color: '#34d399',
    emissive: '#059669',
    hp: 1,
    speed: 2.65,
    score: 90,
    radius: 1.1,
    damage: 0,
    weight: 5,
  },
  boss: {
    label: 'Boss',
    color: '#facc15',
    emissive: '#ca8a04',
    hp: 7,
    speed: 1.35,
    score: 950,
    radius: 2.05,
    damage: 58,
    weight: 0,
  },
};

const CONTRACTS = [
  { id: 'chain-8', label: '8er Trefferkette', stat: 'comboHit', target: 8, time: 30, reward: { score: 760, overdrive: 18 } },
  { id: 'fast-3', label: '3 Runner stoppen', stat: 'fast', target: 3, time: 34, reward: { score: 720, shield: 22 } },
  { id: 'shield-2', label: '2 Schildziele knacken', stat: 'shield', target: 2, time: 44, reward: { score: 820, flak: 1 } },
  { id: 'supply-2', label: '2 Supply-Kapseln retten', stat: 'supply', target: 2, time: 42, reward: { score: 640, shield: 28, pulse: 1 } },
  { id: 'overdrive-1', label: '1 Overdrive sauber', stat: 'overdrive', target: 1, time: 52, reward: { score: 950, shield: 18, flak: 1 } },
  { id: 'boss-1', label: 'Boss-Schild brechen', stat: 'boss', target: 1, time: 68, reward: { score: 1500, overdrive: 35, shield: 35 } },
  { id: 'learn-5', label: '5 Lernziele loesen', stat: 'learn', target: 5, time: 60, mode: 'learn', reward: { score: 1100, shield: 30, pulse: 1 } },
  { id: 'perfect-6', label: '6 Treffer ohne Fehleingabe', stat: 'perfect', target: 6, time: 36, reward: { score: 860, overdrive: 22 } },
];

const initialStats = () => ({
  comboHit: 0,
  fast: 0,
  shield: 0,
  supply: 0,
  overdrive: 0,
  boss: 0,
  learn: 0,
  perfect: 0,
});

function weightedType(wave) {
  const entries = Object.entries(TYPE_CONFIG)
    .filter(([type]) => type !== 'boss')
    .map(([type, config]) => {
      let weight = config.weight;
      if (type === 'fast') weight += wave * 1.4;
      if (type === 'shield') weight += Math.max(0, wave - 1) * 1.3;
      if (type === 'splitter') weight += Math.max(0, wave - 2) * 1.2;
      if (type === 'bomb') weight += Math.max(0, wave - 3) * 0.8;
      if (type === 'supply') weight += wave % 3 === 0 ? 4 : 0;
      return [type, weight];
    });
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * total;
  for (const [type, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return type;
  }
  return 'meteor';
}

function makeProblem(wave, mode, type = 'meteor') {
  const maxAdd = Math.min(12 + wave * 2, 48);
  const maxMul = Math.min(5 + Math.floor(wave / 2), 12);

  if (mode === 'learn') {
    const templates = [
      () => {
        const a = Math.floor(Math.random() * 10) + 2;
        return { text: `Doppelt ${a}`, answer: `${a * 2}` };
      },
      () => {
        const a = (Math.floor(Math.random() * 9) + 2) * 2;
        return { text: `Haelfte ${a}`, answer: `${a / 2}` };
      },
      () => {
        const a = Math.floor(Math.random() * 9) + 1;
        return { text: `10er-Freund ${a}`, answer: `${10 - a}` };
      },
      () => {
        const a = Math.floor(Math.random() * 9) + 2;
        const b = Math.floor(Math.random() * 5) + 2;
        return { text: `${a} Reihen je ${b}`, answer: `${a * b}` };
      },
      () => {
        const b = Math.floor(Math.random() * maxMul) + 2;
        const answer = Math.floor(Math.random() * maxMul) + 2;
        return { text: `${b * answer} geteilt ${b}`, answer: `${answer}` };
      },
    ];
    return templates[Math.floor(Math.random() * templates.length)]();
  }

  if (type === 'fast') {
    const a = Math.floor(Math.random() * maxAdd) + 4;
    const b = Math.floor(Math.random() * 9) + 2;
    return { text: `${a} - ${b}`, answer: `${a - b}` };
  }
  if (type === 'shield' || type === 'boss') {
    const a = Math.floor(Math.random() * maxMul) + 2;
    const b = Math.floor(Math.random() * maxMul) + 2;
    return { text: `${a} x ${b}`, answer: `${a * b}` };
  }
  if (type === 'supply') {
    const a = Math.floor(Math.random() * 8) + 2;
    return { text: `${a} + ${10 - a}`, answer: '10' };
  }

  const a = Math.floor(Math.random() * maxAdd) + 1;
  const b = Math.floor(Math.random() * Math.min(maxAdd, 24)) + 1;
  return Math.random() > 0.42
    ? { text: `${a} + ${b}`, answer: `${a + b}` }
    : { text: `${Math.max(a, b)} - ${Math.min(a, b)}`, answer: `${Math.abs(a - b)}` };
}

function makeAsteroid(wave, mode, serial, forcedType) {
  const type = forcedType || weightedType(wave);
  const config = TYPE_CONFIG[type];
  const problem = makeProblem(wave, mode, type);
  const lane = ((serial * 5) % 9) - 4;
  const x = clamp(lane * 2.8 + (Math.random() - 0.5) * 1.4, -12.8, 12.8);
  const z = -7 + Math.random() * 7;

  return {
    id: uid(),
    type,
    label: config.label,
    text: problem.text,
    answer: problem.answer,
    hp: config.hp + (type === 'boss' ? Math.floor(wave / 4) : 0),
    maxHp: config.hp + (type === 'boss' ? Math.floor(wave / 4) : 0),
    color: config.color,
    emissive: config.emissive,
    radius: config.radius,
    damage: config.damage,
    position: [x, type === 'boss' ? 24.5 : 23 + Math.random() * 5, z],
    speed: config.speed + wave * 0.18 + Math.random() * 0.45,
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
    rotSpeed: [
      (Math.random() - 0.5) * (type === 'boss' ? 0.35 : 1.8),
      (Math.random() - 0.5) * (type === 'boss' ? 0.35 : 1.8),
      (Math.random() - 0.5) * (type === 'boss' ? 0.35 : 1.8),
    ],
    flash: 0,
  };
}

function selectContract(index, mode) {
  const pool = CONTRACTS.filter((contract) => !contract.mode || contract.mode === mode);
  return pool[index % pool.length];
}

function applyReward(draft, reward = {}) {
  draft.score += reward.score || 0;
  draft.baseShield = clamp(draft.baseShield + (reward.shield || 0), 0, draft.maxShield);
  draft.overdrive = clamp(draft.overdrive + (reward.overdrive || 0), 0, 100);
  draft.flakCharges = clamp(draft.flakCharges + (reward.flak || 0), 0, 5);
  draft.pulseCharges = clamp(draft.pulseCharges + (reward.pulse || 0), 0, 4);
}

function startNextContract(draft) {
  const contract = selectContract(draft.contractIndex, draft.mode);
  draft.contract = contract;
  draft.contractIndex += 1;
  draft.contractProgress = 0;
  draft.contractTimer = contract.time;
  draft.contractCooldown = 0;
  draft.message = `Auftrag: ${contract.label}`;
}

function failContract(draft, reason = 'Auftrag verpasst') {
  if (!draft.contract) return;
  draft.contractFails += 1;
  draft.message = `${reason}: ${draft.contract.label}`;
  draft.contract = null;
  draft.contractProgress = 0;
  draft.contractTimer = 0;
  draft.contractCooldown = 5.5;
}

function progressContract(draft, stat, amount = 1) {
  if (!draft.contract || draft.contract.stat !== stat) return;
  draft.contractProgress = clamp(draft.contractProgress + amount, 0, draft.contract.target);
  if (draft.contractProgress >= draft.contract.target) {
    const finished = draft.contract;
    draft.contractMedals += 1;
    applyReward(draft, finished.reward);
    draft.message = `${finished.label} erfuellt`;
    draft.contract = null;
    draft.contractProgress = 0;
    draft.contractTimer = 0;
    draft.contractCooldown = 4.5;
  }
}

function recordStat(draft, stat, amount = 1) {
  draft.stats = { ...draft.stats, [stat]: (draft.stats[stat] || 0) + amount };
  progressContract(draft, stat, amount);
}

function updateContract(draft, dt) {
  if (draft.contract) {
    draft.contractTimer -= dt;
    if (draft.contractTimer <= 0) failContract(draft, 'Zeit abgelaufen');
    return;
  }
  draft.contractCooldown -= dt;
  if (draft.contractCooldown <= 0 && draft.isPlaying && !draft.isGameOver) startNextContract(draft);
}

function baseDamage(draft, asteroid) {
  if (asteroid.type === 'supply') {
    draft.message = 'Supply verpasst';
    return;
  }
  draft.baseShield -= asteroid.damage;
  draft.combo = 0;
  draft.streakTimer = 0;
  draft.escapedCount += 1;
  draft.baseHitEvent = { id: uid(), damage: asteroid.damage };
  draft.message = `${asteroid.label} trifft die Basis`;
  failContract(draft, 'Basis getroffen');

  if (draft.baseShield <= 0) {
    draft.lives -= 1;
    if (draft.lives <= 0) {
      draft.isGameOver = true;
      draft.isPlaying = false;
      draft.message = 'Basis verloren';
      draft.highScore = Math.max(draft.highScore, draft.score);
    } else {
      draft.baseShield = draft.maxShield;
      draft.message = `Schild neu gestartet - ${draft.lives} Leben`;
    }
  }
}

function addLaser(draft, target, color = '#00ffff', life = 0.2, width = 0.1) {
  draft.lasers = [
    ...draft.lasers,
    {
      id: uid(),
      start: [0, -2, 0],
      end: [...target.position],
      color,
      life,
      maxLife: life,
      width,
    },
  ];
}

function spawnSplitters(draft, target) {
  const children = [0, 1].map((index) => ({
    ...makeAsteroid(draft.wave, draft.mode, draft.spawnSerial + index + 1, index === 0 ? 'fast' : 'meteor'),
    position: [
      target.position[0] + (index === 0 ? -1.4 : 1.4),
      target.position[1] + 1.6,
      target.position[2] + (index === 0 ? 0.4 : -0.4),
    ],
    speed: TYPE_CONFIG.fast.speed + draft.wave * 0.2,
    radius: 0.88,
    hp: 1,
    maxHp: 1,
    text: makeProblem(draft.wave, draft.mode, 'fast').text,
  }));
  children.forEach((child) => {
    const problem = makeProblem(draft.wave, draft.mode, child.type);
    child.text = problem.text;
    child.answer = problem.answer;
  });
  draft.spawnSerial += children.length;
  draft.asteroids = [...draft.asteroids, ...children];
}

function completeWaveIfNeeded(draft) {
  if (draft.waveKills < draft.waveTarget || draft.asteroids.some((asteroid) => asteroid.type === 'boss')) return;
  draft.wave += 1;
  draft.level = draft.wave;
  draft.waveKills = 0;
  draft.waveTarget = 9 + draft.wave * 3;
  draft.baseShield = clamp(draft.baseShield + 18, 0, draft.maxShield);
  draft.flakCharges = clamp(draft.flakCharges + (draft.wave % 2 === 0 ? 1 : 0), 0, 5);
  draft.message = `Welle ${draft.wave} - mehr Druck`;
}

function destroyOrDamageTarget(draft, targetId, weapon = 'laser', damage = 1) {
  const target = draft.asteroids.find((asteroid) => asteroid.id === targetId);
  if (!target) return false;

  addLaser(
    draft,
    target,
    weapon === 'overdrive' ? '#facc15' : weapon === 'flak' ? '#fb7185' : '#00ffff',
    weapon === 'overdrive' ? 0.34 : 0.22,
    weapon === 'overdrive' ? 0.2 : 0.12,
  );

  const nextHp = target.hp - damage;
  if (nextHp > 0) {
    const problem = makeProblem(draft.wave, draft.mode, target.type);
    draft.asteroids = draft.asteroids.map((asteroid) => (
      asteroid.id === target.id
        ? { ...asteroid, hp: nextHp, text: problem.text, answer: problem.answer, flash: 0.22 }
        : asteroid
    ));
    draft.score += 70;
    draft.overdrive = clamp(draft.overdrive + 3, 0, 100);
    draft.message = `${target.label} angeschlagen`;
    return true;
  }

  draft.asteroids = draft.asteroids.filter((asteroid) => asteroid.id !== target.id);
  draft.destroyedEvent = { id: uid(), position: target.position, type: target.type, color: target.color };
  draft.destroyedCount += 1;
  draft.waveKills += target.type === 'boss' ? draft.waveTarget : 1;
  draft.combo += 1;
  draft.bestCombo = Math.max(draft.bestCombo, draft.combo);
  draft.streakTimer = 3.2;
  draft.score += TYPE_CONFIG[target.type].score + draft.combo * 22 + (weapon === 'overdrive' ? 60 : 0);
  draft.overdrive = clamp(draft.overdrive + (target.type === 'boss' ? 25 : 8), 0, 100);

  if (target.type === 'supply') {
    draft.baseShield = clamp(draft.baseShield + 20, 0, draft.maxShield);
    draft.flakCharges = clamp(draft.flakCharges + 1, 0, 5);
  }
  if (target.type === 'splitter' && weapon !== 'overdrive') spawnSplitters(draft, target);
  if (draft.mode === 'learn') recordStat(draft, 'learn');
  if (target.type === 'fast') recordStat(draft, 'fast');
  if (target.type === 'shield') recordStat(draft, 'shield');
  if (target.type === 'supply') recordStat(draft, 'supply');
  if (target.type === 'boss') recordStat(draft, 'boss');
  recordStat(draft, 'comboHit');
  recordStat(draft, 'perfect');

  draft.message = `${target.label} geloest: ${target.text} = ${target.answer}`;
  completeWaveIfNeeded(draft);
  return true;
}

function nearestTargets(asteroids, count, includeBoss = true) {
  return [...asteroids]
    .filter((asteroid) => includeBoss || asteroid.type !== 'boss')
    .sort((a, b) => a.position[1] - b.position[1])
    .slice(0, count);
}

export const useMathDefenderStore = createGameStore(
  {
    asteroids: [],
    currentInput: '',
    lasers: [],
    destroyedEvent: null,
    asteroidDestroyedEvent: null,
    baseHitEvent: null,
    errorEvent: null,
    mode: 'arcade',
    wave: 1,
    waveKills: 0,
    waveTarget: 12,
    maxShield: 100,
    baseShield: 100,
    overdrive: 0,
    flakCharges: 2,
    pulseCharges: 1,
    combo: 0,
    bestCombo: 0,
    streakTimer: 0,
    freezeTimer: 0,
    spawnSerial: 0,
    destroyedCount: 0,
    escapedCount: 0,
    inputMisses: 0,
    stats: initialStats(),
    contract: null,
    contractIndex: 0,
    contractProgress: 0,
    contractTimer: 0,
    contractCooldown: 3,
    contractMedals: 0,
    contractFails: 0,
    message: 'Normalmodus: Ergebnisse tippen und die Basis verteidigen.',
  },
  (set, get) => ({
    startGame: (nextMode) => {
      const mode = nextMode || get().mode || 'arcade';
      const firstWave = [
        makeAsteroid(1, mode, 1, 'meteor'),
        makeAsteroid(1, mode, 2, 'fast'),
        makeAsteroid(1, mode, 3, mode === 'learn' ? 'supply' : 'meteor'),
      ];
      set({
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
        score: 0,
        lives: 3,
        level: 1,
        speed: 1,
        quizActive: false,
        quizScore: 0,
        quizStreak: 0,
        asteroids: firstWave,
        currentInput: '',
        lasers: [],
        destroyedEvent: null,
        asteroidDestroyedEvent: null,
        baseHitEvent: null,
        errorEvent: null,
        mode,
        wave: 1,
        waveKills: 0,
        waveTarget: 12,
        baseShield: 100,
        overdrive: 0,
        flakCharges: 2,
        pulseCharges: 1,
        combo: 0,
        bestCombo: 0,
        streakTimer: 0,
        freezeTimer: 0,
        spawnSerial: 4,
        destroyedCount: 0,
        escapedCount: 0,
        inputMisses: 0,
        stats: initialStats(),
        contract: null,
        contractIndex: 0,
        contractProgress: 0,
        contractTimer: 0,
        contractCooldown: 3,
        contractMedals: 0,
        contractFails: 0,
        message: mode === 'learn'
          ? 'Lernmodus: Kopfrechnen, Zahlbeziehungen und Rettungsauftraege.'
          : 'Normalmodus: Ergebnisse tippen, Prioritaeten setzen, Basis halten.',
      });
    },

    spawnAsteroid: () => {
      const state = get();
      if (state.isGameOver || state.isPaused || !state.isPlaying || state.quizActive) return;
      if (state.asteroids.length >= 8 + Math.floor(state.wave / 2)) return;
      const needsBoss = state.wave >= 4
        && state.wave % 4 === 0
        && state.waveKills >= Math.floor(state.waveTarget * 0.55)
        && !state.asteroids.some((asteroid) => asteroid.type === 'boss');
      const next = {
        spawnSerial: state.spawnSerial + 1,
        asteroids: [
          ...state.asteroids,
          makeAsteroid(state.wave, state.mode, state.spawnSerial, needsBoss ? 'boss' : undefined),
        ],
      };
      set(next);
    },

    handleTyping: (char) => {
      const state = get();
      if (state.lives <= 0 || state.isGameOver || state.isPaused || state.quizActive) return;

      const key = char === ' ' ? 'space' : `${char}`.toLowerCase();
      if (key === 'backspace' || key === 'delete') {
        set({ currentInput: state.currentInput.slice(0, -1) });
        return;
      }
      if (key === 'escape' || key === 'c') {
        set({ currentInput: '' });
        return;
      }
      if (key === 'f') {
        get().activateFlak();
        return;
      }
      if (key === 'x') {
        get().activateFreezePulse();
        return;
      }
      if (key === 'space' || key === 'enter') {
        get().activateOverdrive();
        return;
      }
      if (!/^[0-9]$/.test(key)) return;

      const newInput = `${state.currentInput}${key}`.replace(/^0+(?=\d)/, '');
      const exactMatches = state.asteroids
        .filter((asteroid) => asteroid.answer === newInput)
        .sort((a, b) => a.position[1] - b.position[1]);

      if (exactMatches.length > 0) {
        const draft = { ...get(), currentInput: '' };
        destroyOrDamageTarget(draft, exactMatches[0].id, 'laser', 1);
        set(draft);
        return;
      }

      const isPrefix = state.asteroids.some((asteroid) => asteroid.answer.startsWith(newInput));
      if (isPrefix && newInput.length <= 3) {
        set({ currentInput: newInput });
        return;
      }

      const draft = { ...state };
      draft.currentInput = '';
      draft.inputMisses += 1;
      draft.combo = 0;
      draft.streakTimer = 0;
      draft.errorEvent = Date.now();
      draft.message = 'Fehleingabe - neu zielen';
      failContract(draft, 'Fehleingabe');
      set(draft);
    },

    activateFlak: () => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.quizActive || state.flakCharges <= 0 || state.asteroids.length === 0) return;
      const draft = { ...state, flakCharges: state.flakCharges - 1, currentInput: '' };
      nearestTargets(draft.asteroids, 3, false).forEach((target) => destroyOrDamageTarget(draft, target.id, 'flak', 1));
      draft.message = 'Flak-Salve raeumt die Basislinie';
      set(draft);
    },

    activateFreezePulse: () => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.quizActive || state.pulseCharges <= 0) return;
      set({
        pulseCharges: state.pulseCharges - 1,
        freezeTimer: 4.2,
        currentInput: '',
        message: 'Freeze-Puls aktiv',
      });
    },

    activateOverdrive: () => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.quizActive || state.overdrive < 100 || state.asteroids.length === 0) return;
      const draft = { ...state, overdrive: 0, currentInput: '' };
      nearestTargets(draft.asteroids, 5, true).forEach((target) => destroyOrDamageTarget(draft, target.id, 'overdrive', target.type === 'boss' ? 2 : 4));
      recordStat(draft, 'overdrive');
      draft.message = 'Overdrive-Strahl abgefeuert';
      set(draft);
    },

    updateAsteroids: (dt) => {
      const state = get();
      if (state.lives <= 0 || state.isGameOver || state.isPaused || state.quizActive || !state.isPlaying) return;

      const draft = { ...state };
      draft.streakTimer = Math.max(0, draft.streakTimer - dt);
      draft.freezeTimer = Math.max(0, draft.freezeTimer - dt);
      if (draft.streakTimer <= 0) draft.combo = 0;
      updateContract(draft, dt);

      const slow = draft.freezeTimer > 0 ? 0.42 : 1;
      const escaped = [];
      draft.asteroids = draft.asteroids
        .map((asteroid) => ({
          ...asteroid,
          flash: Math.max(0, (asteroid.flash || 0) - dt),
          position: [
            asteroid.position[0],
            asteroid.position[1] - asteroid.speed * slow * dt,
            asteroid.position[2],
          ],
          rotation: [
            asteroid.rotation[0] + asteroid.rotSpeed[0] * dt,
            asteroid.rotation[1] + asteroid.rotSpeed[1] * dt,
            asteroid.rotation[2] + asteroid.rotSpeed[2] * dt,
          ],
        }))
        .filter((asteroid) => {
          if (asteroid.position[1] < -2.8) {
            escaped.push(asteroid);
            return false;
          }
          return true;
        });

      escaped.forEach((asteroid) => baseDamage(draft, asteroid));
      draft.lasers = draft.lasers
        .map((laser) => ({ ...laser, life: laser.life - dt }))
        .filter((laser) => laser.life > 0);

      if (draft.score > draft.highScore) draft.highScore = draft.score;
      set(draft);
    },

    clearEvents: () => set({
      destroyedEvent: null,
      asteroidDestroyedEvent: null,
      baseHitEvent: null,
      errorEvent: null,
    }),

    resetInput: () => set({ currentInput: '' }),
    setMode: (mode) => get().startGame(mode),
  }),
);
