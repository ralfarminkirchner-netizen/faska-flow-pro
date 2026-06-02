import { createGameStore } from '../../../../shared/useSwarmStore';

const LANE_COUNT = 5;
export const LANE_SPACING = 2.85;
export const LANES = [-2, -1, 0, 1, 2];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const uid = () => Math.random().toString(36).slice(2, 10);
const laneToX = (lane) => lane * LANE_SPACING;

const QUESTION_BANK = [
  {
    type: 'capital',
    prompt: 'Hauptstadt von Frankreich?',
    answer: 'Paris',
    choices: ['Paris', 'Rom', 'Madrid', 'Berlin', 'Wien'],
    subject: 'Geografie',
  },
  {
    type: 'capital',
    prompt: 'Hauptstadt von Japan?',
    answer: 'Tokio',
    choices: ['Tokio', 'Seoul', 'Peking', 'Bangkok', 'Delhi'],
    subject: 'Geografie',
  },
  {
    type: 'capital',
    prompt: 'Hauptstadt von Italien?',
    answer: 'Rom',
    choices: ['Rom', 'Paris', 'Athen', 'Bern', 'Oslo'],
    subject: 'Geografie',
  },
  {
    type: 'country',
    prompt: 'Zu welchem Land gehoert Bayern?',
    answer: 'Deutschland',
    choices: ['Deutschland', 'Oesterreich', 'Schweiz', 'Italien', 'Polen'],
    subject: 'Geografie',
  },
  {
    type: 'continent',
    prompt: 'Auf welchem Kontinent liegt Brasilien?',
    answer: 'Suedamerika',
    choices: ['Suedamerika', 'Europa', 'Afrika', 'Asien', 'Australien'],
    subject: 'Geografie',
  },
  {
    type: 'continent',
    prompt: 'Auf welchem Kontinent liegt Kenia?',
    answer: 'Afrika',
    choices: ['Afrika', 'Asien', 'Europa', 'Nordamerika', 'Suedamerika'],
    subject: 'Geografie',
  },
  {
    type: 'direction',
    prompt: 'Wo geht die Sonne auf?',
    answer: 'Osten',
    choices: ['Osten', 'Westen', 'Norden', 'Sueden', 'Mitte'],
    subject: 'Sachkunde',
  },
  {
    type: 'reading',
    prompt: 'Welches Wort passt zu Karte?',
    answer: 'Landkarte',
    choices: ['Landkarte', 'Kartoffel', 'Kartei', 'Karton', 'Kante'],
    subject: 'Deutsch',
  },
  {
    type: 'english',
    prompt: 'Was bedeutet river?',
    answer: 'Fluss',
    choices: ['Fluss', 'Berg', 'Wald', 'Insel', 'Stadt'],
    subject: 'Englisch',
  },
  {
    type: 'math',
    prompt: '7 + 8 = ?',
    answer: '15',
    choices: ['15', '14', '16', '13', '18'],
    subject: 'Mathe',
  },
  {
    type: 'math',
    prompt: '3 x 6 = ?',
    answer: '18',
    choices: ['18', '16', '12', '21', '24'],
    subject: 'Mathe',
  },
  {
    type: 'reading',
    prompt: 'Welche Wortart ist schnell?',
    answer: 'Adjektiv',
    choices: ['Adjektiv', 'Nomen', 'Verb', 'Artikel', 'Pronomen'],
    subject: 'Deutsch',
  },
];

const CONTRACTS = [
  { id: 'gates-5', label: '5 Gates sauber', stat: 'gates', target: 5, time: 36, reward: { score: 650, shield: 20 } },
  { id: 'coins-10', label: '10 Geo-Orbs sammeln', stat: 'coins', target: 10, time: 42, reward: { score: 620, turbo: 18 } },
  { id: 'jump-3', label: '3 Huerden springen', stat: 'jumpDodge', target: 3, time: 38, reward: { score: 680, shield: 18 } },
  { id: 'slide-3', label: '3 Barrieren unterlaufen', stat: 'slideDodge', target: 3, time: 38, reward: { score: 680, shield: 18 } },
  { id: 'clean-25', label: '25 Sekunden ohne Treffer', stat: 'cleanTime', target: 25, time: 30, reward: { score: 850, turbo: 25 } },
  { id: 'boost-2', label: '2 Turbos nutzen', stat: 'turboUse', target: 2, time: 48, reward: { score: 720, shield: 25 } },
  { id: 'learn-4', label: '4 Lernantworten richtig', stat: 'learnCorrect', target: 4, time: 55, mode: 'learn', reward: { score: 1050, shield: 32, turbo: 22 } },
];

const initialStats = () => ({
  gates: 0,
  coins: 0,
  jumpDodge: 0,
  slideDodge: 0,
  cleanTime: 0,
  turboUse: 0,
  learnCorrect: 0,
  obstacles: 0,
});

function pickQuestion(index = 0) {
  const offset = Math.floor(Math.random() * QUESTION_BANK.length);
  const source = QUESTION_BANK[(index + offset) % QUESTION_BANK.length];
  const choices = [...source.choices]
    .sort(() => Math.random() - 0.5)
    .slice(0, LANE_COUNT);
  if (!choices.includes(source.answer)) choices[Math.floor(Math.random() * LANE_COUNT)] = source.answer;
  return { ...source, choices };
}

function makeGate(serial, mode, z, wave) {
  const lanes = [...LANES].sort(() => Math.random() - 0.5);
  const question = pickQuestion(serial + wave * 3);
  const choices = mode === 'learn'
    ? question.choices
    : ['BOOST', 'ORB', 'SAFE', 'SHIELD', 'FLOW'].sort(() => Math.random() - 0.5);
  const correctIndex = mode === 'learn'
    ? choices.indexOf(question.answer)
    : Math.floor(Math.random() * LANE_COUNT);

  return {
    id: uid(),
    kind: 'gate',
    z,
    handled: false,
    question: mode === 'learn' ? question.prompt : `Route ${wave}-${serial % 9}`,
    subject: mode === 'learn' ? question.subject : 'Arcade',
    answer: choices[correctIndex],
    doors: lanes.map((lane, index) => ({
      lane,
      label: choices[index] || choices[0],
      correct: index === correctIndex,
    })),
  };
}

function makeObstacle(serial, z, wave) {
  const obstacleKinds = ['hurdle', 'lowbar', 'blocker', 'spikes'];
  const kind = obstacleKinds[(serial + wave) % obstacleKinds.length];
  const lanes = [...LANES].sort(() => Math.random() - 0.5);
  const width = kind === 'blocker' ? 2 : 1;
  return {
    id: uid(),
    kind: 'obstacle',
    obstacle: kind,
    lanes: lanes.slice(0, width),
    z,
    handled: false,
  };
}

function makePickup(serial, z) {
  const types = ['coin', 'coin', 'coin', 'shield', 'turbo', 'magnet'];
  const type = types[serial % types.length];
  return {
    id: uid(),
    kind: 'pickup',
    pickup: type,
    lane: LANES[(serial * 2) % LANES.length],
    z,
    handled: false,
  };
}

function buildRow(serial, mode, wave) {
  const z = -76 - Math.random() * 18;
  if (serial % 5 === 0) return makeGate(serial, mode, z, wave);
  if (serial % 2 === 0) return makeObstacle(serial, z, wave);
  return makePickup(serial, z);
}

function contractPool(mode) {
  return CONTRACTS.filter((contract) => !contract.mode || contract.mode === mode);
}

function selectContract(index, mode) {
  const pool = contractPool(mode);
  return pool[index % pool.length];
}

function applyReward(draft, reward = {}) {
  draft.score += reward.score || 0;
  draft.shield = clamp(draft.shield + (reward.shield || 0), 0, draft.maxShield);
  draft.turbo = clamp(draft.turbo + (reward.turbo || 0), 0, 100);
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
  draft.contractCooldown = 4.8;
}

function progressContract(draft, stat, amount = 1) {
  if (!draft.contract || draft.contract.stat !== stat) return;
  draft.contractProgress = clamp(draft.contractProgress + amount, 0, draft.contract.target);
  if (draft.contractProgress >= draft.contract.target) {
    const done = draft.contract;
    draft.contractMedals += 1;
    applyReward(draft, done.reward);
    draft.message = `${done.label} geschafft`;
    draft.contract = null;
    draft.contractProgress = 0;
    draft.contractTimer = 0;
    draft.contractCooldown = 4.2;
  }
}

function recordStat(draft, stat, amount = 1) {
  draft.stats = { ...draft.stats, [stat]: (draft.stats[stat] || 0) + amount };
  progressContract(draft, stat, amount);
}

function updateContract(draft, dt) {
  if (draft.contract) {
    draft.contractTimer -= dt;
    if (draft.contract.stat === 'cleanTime') {
      progressContract(draft, 'cleanTime', dt);
    }
    if (draft.contractTimer <= 0) failContract(draft, 'Zeit abgelaufen');
    return;
  }
  draft.contractCooldown -= dt;
  if (draft.contractCooldown <= 0 && draft.isPlaying && !draft.isGameOver) startNextContract(draft);
}

function damagePlayer(draft, amount, message) {
  if (draft.invincibleTimer > 0) return;
  if (draft.shield > 0) {
    draft.shield = Math.max(0, draft.shield - amount);
    draft.invincibleTimer = 0.9;
    draft.combo = 0;
    draft.message = `${message} - Schild haelt`;
    failContract(draft, 'Treffer');
    return;
  }

  draft.lives -= 1;
  draft.invincibleTimer = 1.3;
  draft.combo = 0;
  draft.message = message;
  failContract(draft, 'Treffer');
  if (draft.lives <= 0) {
    draft.isPlaying = false;
    draft.isGameOver = true;
    draft.highScore = Math.max(draft.highScore, draft.score);
    draft.message = 'Run beendet';
  }
}

function resolveGate(draft, gate) {
  const door = gate.doors.find((candidate) => candidate.lane === draft.playerLane);
  if (door?.correct) {
    draft.combo += 1;
    draft.bestCombo = Math.max(draft.bestCombo, draft.combo);
    draft.score += 180 + draft.combo * 22 + (draft.mode === 'learn' ? 90 : 0);
    draft.turbo = clamp(draft.turbo + 6, 0, 100);
    recordStat(draft, 'gates');
    if (draft.mode === 'learn') recordStat(draft, 'learnCorrect');
    draft.message = draft.mode === 'learn'
      ? `Richtig: ${gate.answer}`
      : `${door.label}-Gate getroffen`;
    return;
  }
  damagePlayer(draft, 24, draft.mode === 'learn' ? `Falsch: gesucht war ${gate.answer}` : 'Falsches Gate');
}

function resolveObstacle(draft, obstacle) {
  const inLane = obstacle.lanes.includes(draft.playerLane);
  if (!inLane) {
    draft.score += 45;
    return;
  }

  if (obstacle.obstacle === 'hurdle' && draft.playerY > 0.9) {
    draft.score += 160 + draft.combo * 12;
    draft.combo += 1;
    recordStat(draft, 'jumpDodge');
    draft.message = 'Huerde sauber gesprungen';
    return;
  }
  if (obstacle.obstacle === 'lowbar' && draft.slideTimer > 0) {
    draft.score += 160 + draft.combo * 12;
    draft.combo += 1;
    recordStat(draft, 'slideDodge');
    draft.message = 'Unter Barriere durch';
    return;
  }
  if (obstacle.obstacle === 'spikes' && draft.shield > 0) {
    draft.score += 120;
    draft.shield = Math.max(0, draft.shield - 15);
    draft.message = 'Spikes mit Schild geblockt';
    return;
  }

  recordStat(draft, 'obstacles');
  damagePlayer(draft, obstacle.obstacle === 'spikes' ? 34 : 28, 'Hindernis getroffen');
}

function collectPickup(draft, pickup) {
  if (pickup.lane !== draft.playerLane && draft.magnetTimer <= 0) return;

  if (pickup.pickup === 'coin') {
    draft.score += 80 + draft.combo * 8;
    recordStat(draft, 'coins');
    draft.message = 'Geo-Orb gesammelt';
  } else if (pickup.pickup === 'shield') {
    draft.shield = clamp(draft.shield + 24, 0, draft.maxShield);
    draft.score += 120;
    draft.message = 'Schild-Kapsel';
  } else if (pickup.pickup === 'turbo') {
    draft.turbo = clamp(draft.turbo + 28, 0, 100);
    draft.score += 120;
    draft.message = 'Turbo-Kapsel';
  } else if (pickup.pickup === 'magnet') {
    draft.magnetTimer = 5.5;
    draft.score += 120;
    draft.message = 'Magnet aktiv';
  }
  pickup.handled = true;
}

export const useRunnerStore = createGameStore(
  {
    mode: 'arcade',
    playerLane: 0,
    playerY: 0,
    playerVelocityY: 0,
    slideTimer: 0,
    invincibleTimer: 0,
    shieldBurstCooldown: 0,
    magnetTimer: 0,
    boostTimer: 0,
    rows: [],
    currentQuestion: '',
    currentAnswer: '',
    currentSubject: '',
    distance: 0,
    wave: 1,
    baseSpeed: 24,
    speed: 24,
    spawnSerial: 0,
    rowTimer: 0,
    maxShield: 100,
    shield: 55,
    turbo: 0,
    combo: 0,
    bestCombo: 0,
    stats: initialStats(),
    contract: null,
    contractIndex: 0,
    contractProgress: 0,
    contractTimer: 0,
    contractCooldown: 3,
    contractMedals: 0,
    contractFails: 0,
    message: 'Normalmodus: Gates, Orbs und Hindernisse im Flow lesen.',
  },
  (set, get) => ({
    startGame: (nextMode) => {
      const mode = nextMode || get().mode || 'arcade';
      const firstRows = [
        makePickup(1, -24),
        makeObstacle(2, -42, 1),
        makeGate(5, mode, -64, 1),
      ];
      set({
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
        score: 0,
        highScore: get().highScore,
        lives: 3,
        level: 1,
        quizActive: false,
        quizScore: 0,
        quizStreak: 0,
        mode,
        playerLane: 0,
        playerY: 0,
        playerVelocityY: 0,
        slideTimer: 0,
        invincibleTimer: 0,
        shieldBurstCooldown: 0,
        magnetTimer: 0,
        boostTimer: 0,
        rows: firstRows,
        currentQuestion: mode === 'learn' ? firstRows[2].question : 'Finde den sicheren Flow',
        currentAnswer: mode === 'learn' ? firstRows[2].answer : '',
        currentSubject: mode === 'learn' ? firstRows[2].subject : 'Arcade',
        distance: 0,
        wave: 1,
        baseSpeed: 24,
        speed: 24,
        spawnSerial: 6,
        rowTimer: 0,
        shield: mode === 'learn' ? 70 : 55,
        turbo: 0,
        combo: 0,
        bestCombo: 0,
        stats: initialStats(),
        contract: null,
        contractIndex: 0,
        contractProgress: 0,
        contractTimer: 0,
        contractCooldown: 3,
        contractMedals: 0,
        contractFails: 0,
        message: mode === 'learn'
          ? 'Lernmodus: durch die richtige Antwort laufen.'
          : 'Normalmodus: Gates, Orbs und Hindernisse im Flow lesen.',
      });
    },

    moveLeft: () => {
      const state = get();
      if (!state.isPlaying || state.isGameOver || state.isPaused) return;
      set({ playerLane: clamp(state.playerLane - 1, -2, 2) });
    },

    moveRight: () => {
      const state = get();
      if (!state.isPlaying || state.isGameOver || state.isPaused) return;
      set({ playerLane: clamp(state.playerLane + 1, -2, 2) });
    },

    jump: () => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.isGameOver) return;
      if (state.playerY <= 0.04) set({ playerVelocityY: 8.8, slideTimer: 0 });
    },

    slide: () => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.isGameOver || state.playerY > 0.05) return;
      set({ slideTimer: 0.72 });
    },

    useTurbo: () => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.isGameOver || state.turbo < 100) return;
      const draft = { ...state, turbo: 0, boostTimer: 3.8, message: 'Turbo-Run' };
      recordStat(draft, 'turboUse');
      set(draft);
    },

    spawnRow: () => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.isGameOver) return;
      const serial = state.spawnSerial + 1;
      const row = buildRow(serial, state.mode, state.wave);
      set({
        spawnSerial: serial,
        rows: [...state.rows, row],
        currentQuestion: row.kind === 'gate' ? row.question : state.currentQuestion,
        currentAnswer: row.kind === 'gate' ? row.answer : state.currentAnswer,
        currentSubject: row.kind === 'gate' ? row.subject : state.currentSubject,
      });
    },

    update: (dt) => {
      const state = get();
      if (!state.isPlaying || state.isGameOver || state.isPaused || state.quizActive) return;

      const cappedDt = Math.min(dt, 0.05);
      const draft = { ...state, rows: state.rows.map((row) => ({ ...row, doors: row.doors ? row.doors.map((door) => ({ ...door })) : undefined })) };
      const actions = state.actions || {};

      draft.slideTimer = Math.max(0, draft.slideTimer - cappedDt);
      draft.invincibleTimer = Math.max(0, draft.invincibleTimer - cappedDt);
      draft.shieldBurstCooldown = Math.max(0, draft.shieldBurstCooldown - cappedDt);
      draft.magnetTimer = Math.max(0, draft.magnetTimer - cappedDt);
      draft.boostTimer = Math.max(0, draft.boostTimer - cappedDt);

      if (actions.A && draft.playerY <= 0.04) {
        draft.playerVelocityY = 8.8;
        draft.slideTimer = 0;
      }
      if (actions.B && draft.playerY <= 0.05) {
        draft.slideTimer = Math.max(draft.slideTimer, 0.72);
      }
      if (actions.X && draft.shield >= 18 && draft.shieldBurstCooldown <= 0) {
        draft.shield -= 18;
        draft.invincibleTimer = 0.95;
        draft.shieldBurstCooldown = 1.4;
        draft.message = 'Schild-Burst aktiv';
      }
      if (actions.Y && draft.turbo >= 100 && draft.boostTimer <= 0) {
        draft.turbo = 0;
        draft.boostTimer = 3.8;
        draft.message = 'Turbo-Run';
        recordStat(draft, 'turboUse');
      }

      if (draft.playerY > 0 || draft.playerVelocityY > 0) {
        draft.playerVelocityY -= 24 * cappedDt;
        draft.playerY = Math.max(0, draft.playerY + draft.playerVelocityY * cappedDt);
        if (draft.playerY <= 0) draft.playerVelocityY = 0;
      }

      const targetSpeed = draft.baseSpeed + draft.wave * 1.35 + (draft.boostTimer > 0 ? 15 : 0);
      draft.speed = targetSpeed;
      draft.distance += draft.speed * cappedDt;
      draft.rowTimer += cappedDt;

      const nextWave = Math.floor(draft.distance / 520) + 1;
      if (nextWave > draft.wave) {
        draft.wave = nextWave;
        draft.level = nextWave;
        draft.baseSpeed += 1.4;
        draft.shield = clamp(draft.shield + 14, 0, draft.maxShield);
        draft.message = `Zone ${nextWave}: schneller lesen`;
      }

      updateContract(draft, cappedDt);

      const spawnInterval = Math.max(0.88, 1.72 - draft.wave * 0.07);
      if (draft.rowTimer >= spawnInterval && draft.rows.length < 9) {
        draft.rowTimer = 0;
        const serial = draft.spawnSerial + 1;
        const row = buildRow(serial, draft.mode, draft.wave);
        draft.spawnSerial = serial;
        draft.rows.push(row);
        if (row.kind === 'gate') {
          draft.currentQuestion = row.question;
          draft.currentAnswer = row.answer;
          draft.currentSubject = row.subject;
        }
      }

      draft.rows.forEach((row) => {
        row.z += draft.speed * cappedDt;
        if (row.kind === 'pickup' && row.z > -2.4 && row.z < 2.1 && !row.handled) collectPickup(draft, row);
        if (row.kind === 'gate' && row.z > -1.25 && row.z < 1.2 && !row.handled) {
          row.handled = true;
          resolveGate(draft, row);
        }
        if (row.kind === 'obstacle' && row.z > -1.2 && row.z < 1.2 && !row.handled) {
          row.handled = true;
          resolveObstacle(draft, row);
        }
      });

      draft.rows = draft.rows.filter((row) => row.z < 14 && !row.handled);
      if (draft.score > draft.highScore) draft.highScore = draft.score;
      set(draft);
    },

    resetInput: () => set({ input: { dx: 0, dy: 0 }, actions: { A: false, B: false, X: false, Y: false } }),
  }),
);

export { laneToX };
