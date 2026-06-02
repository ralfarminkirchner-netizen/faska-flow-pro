import { createGameStore } from '../../../../shared/useSwarmStore';

/**
 * FaskaKart Racing — Game Store
 * 
 * State: player speed/angle, lap tracking, checkpoints, boost, AI, race timer
 * Quiz triggers every 2 laps.
 */

// Oval track checkpoint positions (world-space XZ coords)
export const KART_START = { x: 0, z: -18, angle: 1.99 };

export const KART_CHECKPOINTS = [
  { x: 0, z: -18 },    // 0 — start/finish
  { x: 18, z: -10 },   // 1 — first curve exit
  { x: 18, z: 10 },    // 2 — far straight
  { x: 0, z: 18 },     // 3 — back straight
  { x: -18, z: 10 },   // 4 — second curve exit
  { x: -18, z: -10 },  // 5 — approach finish
];

export const KART_BOOST_PADS = [
  { x: 14, z: 0 },
  { x: -14, z: 0 },
];

export const KART_ITEM_BOXES = [
  { x: 15, z: -13 },
  { x: 20, z: -6 },
  { x: 13, z: 14.5 },
  { x: -13, z: 14.5 },
  { x: -20, z: -6 },
];

export const KART_STATIC_OIL_SLICKS = [
  { id: 'static-0', x: 8.8, z: 19.4 },
  { id: 'static-1', x: -9.4, z: -19.2 },
  { id: 'static-2', x: 21.2, z: 4.2 },
];

export const KART_LEARN_GATE_POSITIONS = [
  { lane: -1, x: 8.9, z: -18.4 },
  { lane: 0, x: 7.3, z: -14.8 },
  { lane: 1, x: 5.7, z: -11.1 },
];

export const KART_APEX_GATES = [
  { id: 'turn-1', label: 'A1', x: 18.3, z: -3.8, sector: 1 },
  { id: 'turn-2', label: 'A2', x: 17.4, z: 9.7, sector: 2 },
  { id: 'turn-3', label: 'A3', x: -5.2, z: 18.6, sector: 3 },
  { id: 'turn-4', label: 'A4', x: -18.2, z: 4.9, sector: 4 },
  { id: 'turn-5', label: 'A5', x: -17.2, z: -10.9, sector: 5 },
  { id: 'finish-line', label: 'A6', x: -4.7, z: -18.7, sector: 6 },
];

export const KART_SHORTCUT_GATES = [
  { id: 'cut-s1', label: 'CUT 1', x: 12.1, z: -10.4, sector: 1, reward: 105 },
  { id: 'cut-s2', label: 'CUT 2', x: 11.8, z: 11.6, sector: 2, reward: 115 },
  { id: 'cut-s4', label: 'CUT 3', x: -12.3, z: 9.7, sector: 4, reward: 120 },
  { id: 'cut-s5', label: 'CUT 4', x: -12.2, z: -11.2, sector: 5, reward: 110 },
];

export const KART_HAZARD_ZONES = [
  { id: 'mud-outside', label: 'MUD', type: 'mud', x: 21.2, z: 8.2, radius: 2.75, color: '#92400e' },
  { id: 'spark-strip', label: 'SPARK', type: 'spark', x: -18.8, z: 2.6, radius: 2.35, color: '#a855f7' },
  { id: 'water-splash', label: 'WATER', type: 'water', x: 0.6, z: 21.4, radius: 2.5, color: '#0284c7' },
  { id: 'gravel-entry', label: 'GRAVEL', type: 'gravel', x: -7.5, z: -20.2, radius: 2.55, color: '#78716c' },
];

const TOTAL_LAPS = 3;
const AI_PRESETS = [
  { id: 1, progress: 0.04, speed: 7.1, color: '#ef4444', lap: 0 },
  { id: 2, progress: 0.0, speed: 6.7, color: '#3b82f6', lap: 0 },
  { id: 3, progress: -0.04, speed: 6.35, color: '#f59e0b', lap: 0 },
];

export const KART_LEARN_GATES = [
  {
    prompt: 'Welche Wortart ist "flitzt" in: Der Kart flitzt schnell?',
    word: 'flitzt',
    answer: 'Verb',
    options: ['Nomen', 'Verb', 'Adjektiv'],
  },
  {
    prompt: 'Welche Wortart ist "runde" in: Die runde Kurve ist eng?',
    word: 'runde',
    answer: 'Adjektiv',
    options: ['Adjektiv', 'Verb', 'Artikel'],
  },
  {
    prompt: 'Welche Wortart ist "unter" in: Unter der Bruecke driftet Luna?',
    word: 'unter',
    answer: 'Praeposition',
    options: ['Nomen', 'Praeposition', 'Adverb'],
  },
  {
    prompt: 'Welche Wortart ist "drei" in: Drei Rivalen jagen dich?',
    word: 'drei',
    answer: 'Zahlwort',
    options: ['Zahlwort', 'Adjektiv', 'Verb'],
  },
];

const ITEM_SEQUENCE = ['boost', 'shield', 'rocket', 'oil'];

const KART_GOALS = [
  { id: 'mini-5', label: '5 Mini-Turbos', type: 'miniTurbos', target: 5, reward: 420 },
  { id: 'super-2', label: '2 Super-Drifts', type: 'superMiniTurbos', target: 2, reward: 520 },
  { id: 'apex-6', label: '6 Apex-Gates', type: 'apexHits', target: 6, reward: 460 },
  { id: 'clean-4', label: '4 saubere Sektoren', type: 'cleanSectors', target: 4, reward: 520 },
  { id: 'slip-4', label: '4 Windschatten', type: 'slipstreams', target: 4, reward: 500 },
  { id: 'cut-3', label: '3 Shortcuts', type: 'shortcuts', target: 3, reward: 520 },
  { id: 'chain-6', label: '6 Turbo-Ketten', type: 'turboChains', target: 6, reward: 560 },
  { id: 'hazard-3', label: '3 Hazards blocken', type: 'hazardEvades', target: 3, reward: 480 },
  { id: 'rivals-2', label: '2 Rivalen stoeren', type: 'rivalHits', target: 2, reward: 480 },
  { id: 'boost-4', label: '4 Boost-Pads', type: 'boostPads', target: 4, reward: 360 },
  { id: 'learn-3', label: '3 Wort-Gates', type: 'learnCorrect', target: 3, reward: 520, mode: 'learn' },
];

const KART_CONTRACTS = [
  { id: 'mini-2', label: '2 Mini-Turbos setzen', type: 'miniTurbos', target: 2, duration: 34, reward: { score: 360, boost: 1, racecraft: 8 } },
  { id: 'super-1', label: '1 Super-Drift laden', type: 'superMiniTurbos', target: 1, duration: 42, reward: { score: 460, boost: 1, racecraft: 12 } },
  { id: 'apex-3', label: '3 Apex-Gates treffen', type: 'apexHits', target: 3, duration: 38, reward: { score: 420, boostTimer: 0.7, racecraft: 10 } },
  { id: 'clean-2', label: '2 saubere Sektoren', type: 'cleanSectors', target: 2, duration: 46, reward: { score: 440, boost: 1, racecraft: 12 } },
  { id: 'draft-1', label: '1 Windschatten-Schub', type: 'slipstreams', target: 1, duration: 48, reward: { score: 430, boostTimer: 0.9, racecraft: 9 } },
  { id: 'shortcut-1', label: '1 Shortcut nehmen', type: 'shortcuts', target: 1, duration: 44, reward: { score: 390, boostTimer: 0.85, racecraft: 8 } },
  { id: 'chain-3', label: '3 Turbo-Ketten verbinden', type: 'turboChains', target: 3, duration: 46, reward: { score: 520, boostTimer: 1.1, racecraft: 14 } },
  { id: 'hazard-1', label: '1 Hazard blocken', type: 'hazardEvades', target: 1, duration: 52, reward: { score: 400, shield: 2, racecraft: 10 } },
  { id: 'rival-1', label: '1 Rivalen stoeren', type: 'rivalHits', target: 1, duration: 50, reward: { score: 430, boost: 1, racecraft: 10 } },
  { id: 'pad-2', label: '2 Boost-Pads treffen', type: 'boostPads', target: 2, duration: 40, reward: { score: 320, boost: 1, racecraft: 7 } },
  { id: 'learn-1', label: '1 Wort-Gate richtig', type: 'learnCorrect', target: 1, duration: 44, reward: { score: 480, boost: 1, racecraft: 12 }, learnOnly: true },
];

const createAIKarts = () => AI_PRESETS.map((kart) => ({ ...kart }));
const createKartStats = () => ({
  miniTurbos: 0,
  superMiniTurbos: 0,
  apexHits: 0,
  cleanSectors: 0,
  rivalHits: 0,
  boostPads: 0,
  learnCorrect: 0,
  cleanLaps: 0,
  slipstreams: 0,
  shortcuts: 0,
  turboChains: 0,
  hazardEvades: 0,
});
const createKartGoals = (mode) => KART_GOALS
  .filter((goal) => !goal.mode || goal.mode === mode)
  .sort((a, b) => Number(b.mode === mode) - Number(a.mode === mode))
  .map((goal) => ({ ...goal, progress: 0, done: false }));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const availableKartContracts = (state) => KART_CONTRACTS.filter((contract) => state.mode === 'learn' || !contract.learnOnly);
const kartContractProgress = (state) => {
  if (!state.activeContract) return 0;
  return clamp(
    (state.stats?.[state.activeContract.type] ?? 0) - state.activeContract.startValue,
    0,
    state.activeContract.target,
  );
};

const useKartStore = createGameStore(
  // Game-specific initial state
  {
    mode: 'arcade',
    // Player racing state
    playerSpeed: 0,
    playerAngle: KART_START.angle, // radians
    lap: 0,
    totalLaps: TOTAL_LAPS,
    nextCheckpoint: 1,
    checkpointsPassed: [],
    raceTime: 0,
    raceStarted: false,
    finished: false,
    boostActive: false,
    boostTimer: 0,
    boostCount: 3,
    driftActive: false,
    driftCharge: 0,
    grip: 1,
    offroad: false,
    miniTurboText: '',
    miniTurboTimer: 0,
    raceMessage: '',
    raceMessageTimer: 0,
    position: 1, // 1st through 4th
    racecraft: 0,
    playerProgress: 0,
    sector: 1,
    sectorTimer: 0,
    lastSectorTime: 0,
    lastSectorGrade: '',
    cleanSectorStreak: 0,
    sectorMistakes: 0,
    lapMistakes: 0,
    currentLapStart: 0,
    lastLapTime: 0,
    bestLapTime: 0,
    apexCombo: 0,
    turboGrade: '',
    goals: createKartGoals('arcade'),
    stats: createKartStats(),
    completedGoalNotice: '',
    completedGoalTimer: 0,
    activeContract: null,
    contractIndex: 0,
    contractTimer: 0,
    contractCooldown: 1.2,
    contractWins: 0,
    contractFails: 0,
    rivalBumpCooldown: 0,
    itemSlot: null,
    itemFlashTimer: 0,
    shieldTimer: 0,
    slipTimer: 0,
    slipstreamCharge: 0,
    slipstreamTimer: 0,
    slipstreamCooldown: 0,
    turboChain: 0,
    turboChainTimer: 0,
    turboChainPeak: 0,
    turboChainSource: '',
    turboChainPulseTimer: 0,
    shortcutCooldown: 0,
    hazardCooldown: 0,
    rivalShockTimer: 0,
    coins: 0,
    learnGateIndex: 0,
    learnGateCooldown: 0,
    learnGateStreak: 0,
    learnGateResult: null,
    droppedOils: [],
    shortcutHits: [],

    // AI state
    aiKarts: createAIKarts(),

    // Track data
    checkpoints: KART_CHECKPOINTS,
    totalCheckpoints: KART_CHECKPOINTS.length,

    // Countdown
    countdown: 3,
    countdownActive: true,
  },
  // Game-specific actions
  (set, get) => ({
    recordStat: (type, amount = 1) => {
      set((state) => {
        const stats = {
          ...state.stats,
          [type]: (state.stats?.[type] ?? 0) + amount,
        };
        let reward = 0;
        let completedGoalNotice = state.completedGoalNotice;
        let completedGoalTimer = state.completedGoalTimer;
        const goals = (state.goals ?? []).map((goal) => {
          const progress = Math.min(goal.target, stats[goal.type] ?? 0);
          if (!goal.done && progress >= goal.target) {
            reward += goal.reward;
            completedGoalNotice = `${goal.label} +${goal.reward}`;
            completedGoalTimer = 2.5;
            return { ...goal, progress, done: true };
          }
          return { ...goal, progress };
        });
        const nextScore = state.score + reward;
        return {
          stats,
          goals,
          score: nextScore,
          highScore: Math.max(state.highScore, nextScore),
          completedGoalNotice,
          completedGoalTimer,
        };
      });
    },

    startRaceContract: () => {
      const state = get();
      const contracts = availableKartContracts(state);
      if (!contracts.length) {
        set({ contractCooldown: 3 });
        return;
      }
      const template = contracts[state.contractIndex % contracts.length];
      set({
        activeContract: {
          ...template,
          startValue: state.stats?.[template.type] ?? 0,
        },
        contractIndex: state.contractIndex + 1,
        contractTimer: template.duration,
        raceMessage: `Rennauftrag: ${template.label}`,
        raceMessageTimer: 1.1,
      });
    },

    completeRaceContract: () => {
      const state = get();
      const contract = state.activeContract;
      if (!contract) return;
      const reward = contract.reward ?? {};
      const nextScore = state.score + (reward.score ?? 0);
      set({
        activeContract: null,
        contractTimer: 0,
        contractCooldown: 2.6,
        contractWins: state.contractWins + 1,
        score: nextScore,
        highScore: Math.max(state.highScore, nextScore),
        boostCount: reward.boost ? Math.min(3, state.boostCount + reward.boost) : state.boostCount,
        boostActive: reward.boostTimer ? true : state.boostActive,
        boostTimer: reward.boostTimer ? Math.max(state.boostTimer, reward.boostTimer) : state.boostTimer,
        shieldTimer: reward.shield ? Math.max(state.shieldTimer, reward.shield) : state.shieldTimer,
        racecraft: clamp(state.racecraft + (reward.racecraft ?? 0), 0, 999),
        completedGoalNotice: `Rennauftrag +${reward.score ?? 0}`,
        completedGoalTimer: 2.2,
        raceMessage: `Auftrag geschafft: ${contract.label}`,
        raceMessageTimer: 1.05,
      });
    },

    failRaceContract: () => {
      const state = get();
      const contract = state.activeContract;
      if (!contract) return;
      set({
        activeContract: null,
        contractTimer: 0,
        contractCooldown: 3.4,
        contractFails: state.contractFails + 1,
        racecraft: clamp(state.racecraft - 5, 0, 999),
        raceMessage: `Auftrag verpasst: ${contract.label}`,
        raceMessageTimer: 1,
      });
    },

    updateRaceContract: (dt) => {
      const state = get();
      if (!state.raceStarted || state.finished || state.isPaused) return;
      if (!state.activeContract) {
        const cooldown = Math.max(0, state.contractCooldown - dt);
        set({ contractCooldown: cooldown });
        if (cooldown <= 0) get().startRaceContract();
        return;
      }
      if (kartContractProgress(state) >= state.activeContract.target) {
        get().completeRaceContract();
        return;
      }
      const contractTimer = Math.max(0, state.contractTimer - dt);
      if (contractTimer <= 0) {
        get().failRaceContract();
      } else {
        set({ contractTimer });
      }
    },

    setMode: (mode) => {
      if (get().mode === mode) return;
      set({ mode, goals: createKartGoals(mode), stats: createKartStats() });
      get().startRace();
    },

    accelerate: (dt) => {
      const state = get();
      if (state.finished || !state.raceStarted || state.isPaused) return;
      const shieldBonus = state.shieldTimer > 0 ? 0.5 : 0;
      const maxSpeed = state.boostActive ? 18.5 : state.offroad ? 6.6 + shieldBonus : 10.8 + shieldBonus;
      const accel = (state.boostActive ? 14.5 : 8.2) * (state.offroad ? 0.68 : 1);
      set({ playerSpeed: Math.min(state.playerSpeed + accel * dt, maxSpeed) });
    },

    brake: (dt) => {
      const state = get();
      if (state.finished || !state.raceStarted || state.isPaused) return;
      set({ playerSpeed: Math.max(state.playerSpeed - 12 * dt, -3) });
    },

    decelerate: (dt) => {
      const state = get();
      if (state.finished || state.isPaused) return;
      // Natural drag
      const drag = 3;
      if (state.playerSpeed > 0) {
        set({ playerSpeed: Math.max(0, state.playerSpeed - drag * dt) });
      } else if (state.playerSpeed < 0) {
        set({ playerSpeed: Math.min(0, state.playerSpeed + drag * dt) });
      }
    },

    steer: (direction, dt) => {
      const state = get();
      if (state.finished || !state.raceStarted || state.isPaused) return;
      const turnRate = state.driftActive ? 3.25 : 2.2;
      const speedFactor = Math.min(1, Math.abs(state.playerSpeed) / 4);
      const gripFactor = state.driftActive ? 0.86 : state.grip;
      set({ playerAngle: state.playerAngle + direction * turnRate * speedFactor * gripFactor * dt });
    },

    useBoost: () => {
      const state = get();
      if (state.boostCount <= 0 || state.boostActive || state.finished) return;
      set({
        boostActive: true,
        boostTimer: 1.5, // seconds
        boostCount: state.boostCount - 1,
      });
      get().registerTurboChain('Hand-Turbo', { boostTimer: 0.12, score: 25 });
    },

    collectItemBox: () => {
      const state = get();
      if (state.finished || !state.raceStarted || state.itemSlot) return;
      const itemIndex = (state.lap + state.nextCheckpoint + state.coins + Math.floor(state.raceTime * 2)) % ITEM_SEQUENCE.length;
      const itemSlot = ITEM_SEQUENCE[itemIndex];
      set({
        itemSlot,
        itemFlashTimer: 0.85,
        raceMessage: itemSlot === 'boost' ? 'Turbo-Item' : itemSlot === 'shield' ? 'Schild-Item' : itemSlot === 'rocket' ? 'Rivalen-Rakete' : 'Oelfalle',
        raceMessageTimer: 1,
      });
      get().addScore(25);
    },

    useItem: (dropPosition = null) => {
      const state = get();
      if (!state.itemSlot || state.finished || !state.raceStarted || state.isPaused) return;
      if (state.itemSlot === 'boost') {
        set({
          boostActive: true,
          boostTimer: Math.max(state.boostTimer, 1.45),
          playerSpeed: Math.max(state.playerSpeed, 13.5),
          raceMessage: 'Item-Turbo',
          raceMessageTimer: 0.9,
          itemSlot: null,
        });
        get().registerTurboChain('Item-Turbo', { boostTimer: 0.22, score: 35 });
      } else if (state.itemSlot === 'shield') {
        set({
          shieldTimer: 4,
          raceMessage: 'Schild aktiv',
          raceMessageTimer: 0.9,
          itemSlot: null,
        });
      } else if (state.itemSlot === 'rocket') {
        set({
          rivalShockTimer: 2.4,
          racecraft: clamp(state.racecraft + 12, 0, 999),
          raceMessage: 'Rakete trifft Rivalen',
          raceMessageTimer: 0.9,
          itemSlot: null,
        });
        get().recordStat('rivalHits');
        get().addScore(120);
      } else if (state.itemSlot === 'oil') {
        const fallbackOil = {
          id: `oil-${Math.round(state.raceTime * 1000)}-${state.lap}-${state.nextCheckpoint}`,
          x: 0,
          z: -18,
        };
        const nextOil = {
          ...fallbackOil,
          ...dropPosition,
        };
        set({
          raceMessage: 'Oelspur gelegt',
          raceMessageTimer: 0.9,
          itemSlot: null,
          droppedOils: [...state.droppedOils.slice(-4), nextOil],
        });
        get().addScore(60);
      }
    },

    updateBoost: (dt) => {
      const state = get();
      const nextMiniTurboTimer = Math.max(0, state.miniTurboTimer - dt);
      const nextTurboChainTimer = Math.max(0, state.turboChainTimer - dt);
      const baseTimers = {
        miniTurboTimer: nextMiniTurboTimer,
        raceMessageTimer: Math.max(0, state.raceMessageTimer - dt),
        itemFlashTimer: Math.max(0, state.itemFlashTimer - dt),
        shieldTimer: Math.max(0, state.shieldTimer - dt),
        slipTimer: Math.max(0, state.slipTimer - dt),
        rivalShockTimer: Math.max(0, state.rivalShockTimer - dt),
        learnGateCooldown: Math.max(0, state.learnGateCooldown - dt),
        completedGoalTimer: Math.max(0, state.completedGoalTimer - dt),
        rivalBumpCooldown: Math.max(0, state.rivalBumpCooldown - dt),
        slipstreamCooldown: Math.max(0, state.slipstreamCooldown - dt),
        turboChainTimer: nextTurboChainTimer,
        turboChain: nextTurboChainTimer > 0 ? state.turboChain : 0,
        turboChainSource: nextTurboChainTimer > 0 ? state.turboChainSource : '',
        turboChainPulseTimer: Math.max(0, state.turboChainPulseTimer - dt),
        shortcutCooldown: Math.max(0, state.shortcutCooldown - dt),
        hazardCooldown: Math.max(0, state.hazardCooldown - dt),
      };
      get().updateRaceContract(dt);
      if (!state.boostActive) {
        set(baseTimers);
        return;
      }
      const newTimer = state.boostTimer - dt;
      if (newTimer <= 0) {
        set({ ...baseTimers, boostActive: false, boostTimer: 0 });
      } else {
        set({ ...baseTimers, boostTimer: newTimer });
      }
    },

    collectBoostPad: () => {
      const state = get();
      if (state.finished) return;
      set({
        boostActive: true,
        boostTimer: 1.0,
        boostCount: Math.min(3, state.boostCount + 1),
        racecraft: clamp(state.racecraft + 4, 0, 999),
        raceMessage: 'Boost-Pad',
        raceMessageTimer: 0.7,
      });
      get().recordStat('boostPads');
      get().registerTurboChain('Boost-Pad', { boostTimer: 0.18, score: 30 });
    },

    registerTurboChain: (source = 'Turbo', bonus = {}) => {
      const state = get();
      if (state.finished || !state.raceStarted || state.isPaused) return;
      const chained = state.turboChainTimer > 0 && state.turboChain > 0;
      const turboChain = chained ? state.turboChain + 1 : 1;
      const chainScore = chained ? 42 + turboChain * 18 + (bonus.score ?? 0) : (bonus.score ?? 0);
      const chainRacecraft = chained ? Math.min(30, 5 + turboChain * 3) : 2;
      const boostBonus = turboChain >= 3
        ? Math.min(1.05, 0.18 + turboChain * 0.08 + (bonus.boostTimer ?? 0))
        : (bonus.boostTimer ?? 0);
      const nextBoostTimer = boostBonus > 0
        ? Math.max(state.boostTimer, boostBonus)
        : state.boostTimer;
      const message = turboChain >= 2
        ? `Turbo-Kette x${turboChain}: ${source}`
        : `${source} bereit`;

      set({
        turboChain,
        turboChainTimer: 3.6,
        turboChainPeak: Math.max(state.turboChainPeak, turboChain),
        turboChainSource: source,
        turboChainPulseTimer: 0.38,
        boostActive: boostBonus > 0 ? true : state.boostActive,
        boostTimer: nextBoostTimer,
        playerSpeed: turboChain >= 3 ? Math.max(state.playerSpeed, 12.6 + turboChain * 0.35) : state.playerSpeed,
        racecraft: clamp(state.racecraft + chainRacecraft, 0, 999),
        raceMessage: message,
        raceMessageTimer: turboChain >= 2 ? 1.05 : 0.68,
      });

      if (chained) {
        get().recordStat('turboChains');
        get().addScore(chainScore);
      } else if (chainScore > 0) {
        get().addScore(chainScore);
      }
    },

    updateSlipstream: (dt, intensity = 0) => {
      const state = get();
      if (state.finished || !state.raceStarted || state.isPaused) return;
      const active = intensity > 0.08 && state.slipstreamCooldown <= 0;
      const nextTimer = active
        ? Math.min(2.2, state.slipstreamTimer + dt)
        : Math.max(0, state.slipstreamTimer - dt * 1.7);
      const nextCharge = active
        ? clamp(state.slipstreamCharge + dt * (0.52 + intensity * 1.2), 0, 1)
        : Math.max(0, state.slipstreamCharge - dt * 0.55);
      const draftPull = active && state.playerSpeed > 4
        ? Math.min(0.06, intensity * dt * 0.08)
        : 0;
      if (nextCharge >= 1) {
        set({
          slipstreamCharge: 0,
          slipstreamTimer: 0,
          slipstreamCooldown: 2.1,
          boostActive: true,
          boostTimer: Math.max(state.boostTimer, 0.92),
          playerSpeed: Math.max(state.playerSpeed + 1.2, 13.4),
          racecraft: clamp(state.racecraft + 12, 0, 999),
          raceMessage: 'Windschatten-Schub',
          raceMessageTimer: 0.95,
        });
        get().recordStat('slipstreams');
        get().registerTurboChain('Windschatten', { boostTimer: 0.2, score: 40 });
        get().addScore(130);
        return;
      }
      set({
        slipstreamCharge: nextCharge,
        slipstreamTimer: nextTimer,
        playerSpeed: draftPull ? state.playerSpeed + draftPull : state.playerSpeed,
      });
    },

    hitShortcutGate: (gate) => {
      const state = get();
      if (state.finished || !state.raceStarted || state.shortcutCooldown > 0) return;
      const gateKey = `${state.lap}:${gate.id}`;
      if (state.shortcutHits.includes(gateKey)) return;
      set({
        shortcutHits: [...state.shortcutHits.slice(-10), gateKey],
        shortcutCooldown: 0.8,
        boostActive: true,
        boostTimer: Math.max(state.boostTimer, 0.72),
        playerSpeed: Math.max(state.playerSpeed, 12.8),
        sectorMistakes: Math.max(0, state.sectorMistakes - 0.16),
        racecraft: clamp(state.racecraft + 13, 0, 999),
        raceMessage: `${gate.label} Shortcut`,
        raceMessageTimer: 0.85,
      });
      get().recordStat('shortcuts');
      get().registerTurboChain(gate.label, { boostTimer: 0.16, score: 45 });
      get().addScore(gate.reward ?? 110);
    },

    hitHazardZone: (hazard) => {
      const state = get();
      if (state.finished || !state.raceStarted || state.hazardCooldown > 0) return;
      const protectedRun = state.shieldTimer > 0 || state.boostActive;
      if (protectedRun) {
        set({
          hazardCooldown: 0.95,
          racecraft: clamp(state.racecraft + 8, 0, 999),
          raceMessage: state.shieldTimer > 0 ? `${hazard.label} geblockt` : `${hazard.label} uebersprungen`,
          raceMessageTimer: 0.9,
        });
        get().recordStat('hazardEvades');
        get().addScore(95);
        return;
      }

      const nextSlipTimer = hazard.type === 'spark' || hazard.type === 'water'
        ? Math.max(state.slipTimer, hazard.type === 'spark' ? 1.0 : 0.75)
        : state.slipTimer;
      const speedFactor = hazard.type === 'mud' ? 0.58 : hazard.type === 'gravel' ? 0.68 : 0.74;
      set({
        hazardCooldown: 1.15,
        slipTimer: nextSlipTimer,
        playerSpeed: state.playerSpeed * speedFactor,
        driftActive: false,
        driftCharge: 0,
        sectorMistakes: state.sectorMistakes + 0.45,
        lapMistakes: state.lapMistakes + 0.45,
        racecraft: clamp(state.racecraft - 9, 0, 999),
        apexCombo: 0,
        raceMessage: `${hazard.label} getroffen`,
        raceMessageTimer: 0.9,
      });
    },

    updateSurface: (dt, onTrack, idealGrip = 1) => {
      const state = get();
      const slipPenalty = state.slipTimer > 0 ? 0.34 : 0;
      const shieldHelp = state.shieldTimer > 0 ? 0.1 : 0;
      const grip = onTrack
        ? Math.max(0.42, Math.min(1, 0.68 + idealGrip * 0.32 + shieldHelp - slipPenalty))
        : Math.max(0.28, 0.38 + shieldHelp - slipPenalty);
      const speedAbs = Math.abs(state.playerSpeed);
      const nextSpeed = onTrack || speedAbs < 0.1
        ? state.playerSpeed
        : state.playerSpeed - Math.sign(state.playerSpeed) * Math.min(speedAbs, 5.6 * dt);
      const mistakeDelta = !onTrack && speedAbs > 2 ? dt : 0;
      set({
        grip,
        offroad: !onTrack,
        playerSpeed: nextSpeed,
        sectorMistakes: state.sectorMistakes + mistakeDelta,
        lapMistakes: state.lapMistakes + mistakeDelta,
        apexCombo: onTrack ? state.apexCombo : 0,
      });
    },

    startDrift: () => {
      const state = get();
      if (state.finished || !state.raceStarted || state.isPaused || Math.abs(state.playerSpeed) < 4.5) return;
      if (!state.driftActive) {
        set({ driftActive: true, driftCharge: Math.max(state.driftCharge, 0.08) });
      }
    },

    updateDrift: (dt, steerStrength, onTrack) => {
      const state = get();
      if (!state.driftActive) return;
      const gain = (0.36 + Math.min(1, steerStrength) * 0.72) * (onTrack ? 1 : 0.48);
      set({ driftCharge: Math.min(1, state.driftCharge + dt * gain) });
    },

    releaseDrift: () => {
      const state = get();
      if (!state.driftActive) return;
      const charge = state.driftCharge;
      const turboReady = charge >= 0.42;
      const superTurbo = charge > 0.78;
      const turboGrade = turboReady ? (superTurbo ? 'SUPER' : charge > 0.58 ? 'GOLD' : 'MINI') : '';
      set({
        driftActive: false,
        driftCharge: 0,
        boostActive: turboReady ? true : state.boostActive,
        boostTimer: turboReady ? 0.55 + charge * 0.85 : state.boostTimer,
        playerSpeed: turboReady ? Math.min(18, Math.max(state.playerSpeed, 9.5 + charge * 6.5)) : state.playerSpeed,
        miniTurboText: turboReady ? (superTurbo ? 'SUPER MINI-TURBO' : 'MINI-TURBO') : '',
        miniTurboTimer: turboReady ? 1.1 : 0,
        turboGrade,
        racecraft: turboReady ? clamp(state.racecraft + (superTurbo ? 18 : 9), 0, 999) : state.racecraft,
      });
      if (turboReady) {
        get().recordStat('miniTurbos');
        if (superTurbo) get().recordStat('superMiniTurbos');
        get().registerTurboChain(superTurbo ? 'Super-Drift' : 'Mini-Turbo', {
          boostTimer: superTurbo ? 0.3 : 0.14,
          score: superTurbo ? 45 : 25,
        });
        get().addScore(superTurbo ? 110 : 55);
      }
    },

    hitOilSlick: () => {
      const state = get();
      if (state.finished || state.shieldTimer > 0) {
        if (state.shieldTimer > 0) {
          set({
            raceMessage: 'Schild blockt Oel',
            raceMessageTimer: 0.8,
          });
        }
        return;
      }
      set({
        slipTimer: 1.1,
        playerSpeed: state.playerSpeed * 0.62,
        driftActive: false,
        driftCharge: 0,
        sectorMistakes: state.sectorMistakes + 0.6,
        lapMistakes: state.lapMistakes + 0.6,
        racecraft: clamp(state.racecraft - 10, 0, 999),
        apexCombo: 0,
        raceMessage: 'Oil slick',
        raceMessageTimer: 0.9,
      });
    },

    hitApexGate: (gate) => {
      const state = get();
      if (state.finished || !state.raceStarted || state.isPaused) return;
      const apexCombo = state.apexCombo + 1;
      const comboBoost = apexCombo > 0 && apexCombo % 3 === 0;
      set({
        apexCombo,
        racecraft: clamp(state.racecraft + 10 + Math.min(8, apexCombo), 0, 999),
        raceMessage: comboBoost ? `${gate.label} sauber - Apex-Kette` : `${gate.label} Apex`,
        raceMessageTimer: 0.75,
        boostActive: comboBoost ? true : state.boostActive,
        boostTimer: comboBoost ? Math.max(state.boostTimer, 0.65) : state.boostTimer,
        playerSpeed: comboBoost ? Math.max(state.playerSpeed, 12.8) : state.playerSpeed,
      });
      get().recordStat('apexHits');
      get().registerTurboChain(comboBoost ? 'Apex-Kette' : `${gate.label} Apex`, { boostTimer: comboBoost ? 0.18 : 0, score: 20 });
      get().addScore(70 + apexCombo * 12);
    },

    bumpRival: (aiId) => {
      const state = get();
      if (state.finished || state.rivalBumpCooldown > 0) return;
      const hasAdvantage = state.boostActive || state.shieldTimer > 0;
      if (hasAdvantage) {
        set({
          aiKarts: state.aiKarts.map((ai) => (
            ai.id === aiId ? { ...ai, progress: Math.max(0, ai.progress - 0.026) } : ai
          )),
          rivalShockTimer: Math.max(state.rivalShockTimer, 1.4),
          rivalBumpCooldown: 0.9,
          racecraft: clamp(state.racecraft + 14, 0, 999),
          raceMessage: 'Rivalen-Kontakt gewonnen',
          raceMessageTimer: 0.85,
        });
        get().recordStat('rivalHits');
        get().addScore(140);
      } else {
        set({
          playerSpeed: state.playerSpeed * 0.78,
          rivalBumpCooldown: 0.9,
          sectorMistakes: state.sectorMistakes + 0.35,
          lapMistakes: state.lapMistakes + 0.35,
          racecraft: clamp(state.racecraft - 8, 0, 999),
          apexCombo: 0,
          raceMessage: 'Kontakt - Speed verloren',
          raceMessageTimer: 0.85,
        });
      }
    },

    passLearnGate: (optionLabel) => {
      const state = get();
      if (state.mode !== 'learn' || state.learnGateCooldown > 0 || state.finished) return;
      const task = KART_LEARN_GATES[state.learnGateIndex % KART_LEARN_GATES.length];
      const correct = optionLabel === task.answer;
      if (correct) {
        const streak = state.learnGateStreak + 1;
        set({
          learnGateIndex: state.learnGateIndex + 1,
          learnGateCooldown: 4,
          learnGateStreak: streak,
          learnGateResult: 'correct',
          boostActive: true,
          boostTimer: Math.max(state.boostTimer, 0.85 + streak * 0.12),
          playerSpeed: Math.max(state.playerSpeed, 12.5 + streak),
          boostCount: Math.min(3, state.boostCount + 1),
          coins: state.coins + 3,
          racecraft: clamp(state.racecraft + 16 + streak * 2, 0, 999),
          raceMessage: `${task.word}: ${task.answer}`,
          raceMessageTimer: 1.35,
        });
        get().recordStat('learnCorrect');
        get().registerTurboChain('Wort-Gate', { boostTimer: 0.2, score: 55 });
        get().addScore(180 + streak * 60);
      } else {
        set({
          learnGateIndex: state.learnGateIndex + 1,
          learnGateCooldown: 4,
          learnGateStreak: 0,
          learnGateResult: 'wrong',
          slipTimer: state.shieldTimer > 0 ? 0 : 0.85,
          playerSpeed: state.shieldTimer > 0 ? state.playerSpeed : state.playerSpeed * 0.72,
          sectorMistakes: state.sectorMistakes + 0.4,
          lapMistakes: state.lapMistakes + 0.4,
          racecraft: clamp(state.racecraft - 8, 0, 999),
          apexCombo: 0,
          raceMessage: `${optionLabel} passt nicht`,
          raceMessageTimer: 1.15,
        });
      }
    },

    passCheckpoint: (cpIndex) => {
      const state = get();
      if (state.finished) return;
      if (cpIndex !== state.nextCheckpoint) return;

      const newPassed = [...state.checkpointsPassed, cpIndex];
      const nextCp = (cpIndex + 1) % state.totalCheckpoints;
      const sectorClean = state.sectorMistakes < 0.35 && state.playerSpeed > 3.5;
      const sectorFast = state.sectorTimer > 0 && state.sectorTimer < 5.8;
      const lastSectorGrade = sectorClean && sectorFast ? 'S' : sectorClean ? 'A' : state.sectorMistakes < 0.9 ? 'B' : 'C';
      const displaySector = cpIndex === 0 ? state.totalCheckpoints : cpIndex;
      const sectorUpdates = {
        sector: nextCp === 0 ? state.totalCheckpoints : nextCp,
        sectorTimer: 0,
        lastSectorTime: state.sectorTimer,
        lastSectorGrade,
        sectorMistakes: 0,
        cleanSectorStreak: sectorClean ? state.cleanSectorStreak + 1 : 0,
        racecraft: clamp(state.racecraft + (sectorClean ? 15 : -5), 0, 999),
        raceMessage: sectorClean ? `Sektor ${displaySector}: ${lastSectorGrade}` : `Sektor ${displaySector}: Linie verloren`,
        raceMessageTimer: 0.75,
      };

      // Did we complete a lap? (passed checkpoint 0 after all others)
      if (cpIndex === 0 && state.checkpointsPassed.length > 0) {
        const newLap = state.lap + 1;
        const lapTime = state.raceTime - state.currentLapStart;
        const cleanLap = state.lapMistakes < 0.75;
        
        if (newLap >= state.totalLaps) {
          // Race finished!
          set({
            ...sectorUpdates,
            finished: true,
            lap: newLap,
            nextCheckpoint: nextCp,
            checkpointsPassed: [],
            lastLapTime: lapTime,
            bestLapTime: state.bestLapTime === 0 ? lapTime : Math.min(state.bestLapTime, lapTime),
          });
          if (cleanLap) get().recordStat('cleanLaps');
          if (sectorClean) get().recordStat('cleanSectors');
          get().addScore(1000);
          return;
        }

        // Quiz trigger every 2 laps
        if (state.mode === 'learn' && newLap > 0 && newLap % 2 === 0) {
          get().triggerQuiz('german');
        }

        set({
          ...sectorUpdates,
          lap: newLap,
          nextCheckpoint: nextCp,
          checkpointsPassed: [],
          lastLapTime: lapTime,
          bestLapTime: state.bestLapTime === 0 ? lapTime : Math.min(state.bestLapTime, lapTime),
          currentLapStart: state.raceTime,
          lapMistakes: 0,
        });
        if (cleanLap) get().recordStat('cleanLaps');
        if (sectorClean) get().recordStat('cleanSectors');
        get().addScore(200);
      } else {
        set({
          ...sectorUpdates,
          nextCheckpoint: nextCp,
          checkpointsPassed: newPassed,
        });
        if (sectorClean) get().recordStat('cleanSectors');
        get().addScore(50);
      }
    },

    updatePlayerProgress: (progress) => {
      const state = get();
      if (!state.raceStarted || state.finished || state.isPaused) return;
      set({ playerProgress: progress });
    },

    updateRaceTime: (dt) => {
      const state = get();
      if (!state.raceStarted || state.finished || state.isPaused) return;
      set({
        raceTime: state.raceTime + dt,
        sectorTimer: state.sectorTimer + dt,
      });
    },

    updateAI: (dt) => {
      const state = get();
      if (!state.raceStarted || state.finished || state.isPaused) return;
      
      const playerProgress = state.playerProgress || (state.nextCheckpoint / state.totalCheckpoints);
      const playerTotal = state.lap + playerProgress;
      const newAI = state.aiKarts.map(ai => {
        const aiTotalBefore = ai.lap + ai.progress;
        const rubberBand = aiTotalBefore + 0.08 < playerTotal ? 1.13 : aiTotalBefore > playerTotal + 0.06 ? 0.92 : 1;
        const shock = state.rivalShockTimer > 0 ? 0.45 : 1;
        let newProgress = ai.progress + ai.speed * rubberBand * shock * dt * 0.08;
        let newLap = ai.lap;
        if (newProgress >= 1) {
          newProgress -= 1;
          newLap += 1;
        }
        return { ...ai, progress: newProgress, lap: newLap };
      });
      
      let pos = 1;
      for (const ai of newAI) {
        const aiTotal = ai.lap + ai.progress;
        if (aiTotal > playerTotal) pos++;
      }

      set({ aiKarts: newAI, position: pos });
    },

    getCurrentLearnGate: () => {
      const state = get();
      return KART_LEARN_GATES[state.learnGateIndex % KART_LEARN_GATES.length];
    },

    tickCountdown: () => {
      const state = get();
      if (!state.countdownActive) return;
      if (state.countdown <= 1) {
        set({ countdown: 0, countdownActive: false, raceStarted: true, isPlaying: true });
      } else {
        set({ countdown: state.countdown - 1 });
      }
    },

    startRace: () => {
      set({
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
        score: 0,
        lives: 3,
        playerSpeed: 0,
        playerAngle: KART_START.angle,
        lap: 0,
        nextCheckpoint: 1,
        checkpointsPassed: [],
        raceTime: 0,
        raceStarted: false,
        finished: false,
        boostActive: false,
        boostTimer: 0,
        boostCount: 3,
        racecraft: 0,
        playerProgress: 0,
        sector: 1,
        sectorTimer: 0,
        lastSectorTime: 0,
        lastSectorGrade: '',
        cleanSectorStreak: 0,
        sectorMistakes: 0,
        lapMistakes: 0,
        currentLapStart: 0,
        lastLapTime: 0,
        bestLapTime: 0,
        apexCombo: 0,
        turboGrade: '',
        goals: createKartGoals(get().mode),
        stats: createKartStats(),
        completedGoalNotice: '',
        completedGoalTimer: 0,
        activeContract: null,
        contractIndex: 0,
        contractTimer: 0,
        contractCooldown: 1.2,
        contractWins: 0,
        contractFails: 0,
        rivalBumpCooldown: 0,
        itemSlot: null,
        itemFlashTimer: 0,
        shieldTimer: 0,
        slipTimer: 0,
        slipstreamCharge: 0,
        slipstreamTimer: 0,
        slipstreamCooldown: 0,
        turboChain: 0,
        turboChainTimer: 0,
        turboChainPeak: 0,
        turboChainSource: '',
        turboChainPulseTimer: 0,
        shortcutCooldown: 0,
        hazardCooldown: 0,
        rivalShockTimer: 0,
        coins: 0,
        learnGateIndex: 0,
        learnGateCooldown: 0,
        learnGateStreak: 0,
        learnGateResult: null,
        droppedOils: [],
        shortcutHits: [],
        raceMessage: get().mode === 'learn' ? 'Fahre durch das richtige Wortarten-Tor.' : 'Sauber fahren, hart driften.',
        raceMessageTimer: 2,
        driftActive: false,
        driftCharge: 0,
        grip: 1,
        offroad: false,
        miniTurboText: '',
        miniTurboTimer: 0,
        position: 1,
        countdown: 3,
        countdownActive: true,
        quizActive: false,
        aiKarts: createAIKarts(),
      });
    },

    formatTime: () => {
      const t = get().raceTime;
      const mins = Math.floor(t / 60);
      const secs = Math.floor(t % 60);
      const ms = Math.floor((t * 100) % 100);
      return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    },
  })
);

export default useKartStore;
