import { createGameStore } from '../../../../shared/useSwarmStore';

export const LANES = [-2, -1, 0, 1, 2];
export const LANE_SPACING = 2.9;
export const laneToX = (lane) => lane * LANE_SPACING;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const uid = () => Math.random().toString(36).slice(2, 10);
const clean = (value) => `${value}`.toUpperCase().replace(/[^A-Z0-9]/g, '');

const ARCADE_WORDS = [
  'BLITZ', 'TURBO', 'PORTAL', 'LASER', 'ORBIT', 'NINJA', 'DRACHE', 'KOMET',
  'GALAXIE', 'ROCKET', 'STERN', 'RHYTHMUS', 'FOKUS', 'TEMPEL', 'KATANA',
  'SCHILD', 'ARENA', 'BOSS', 'PIXEL', 'QUEST', 'SPRUNG', 'BOOST', 'LEVEL',
  'MAGNET', 'PHOENIX', 'SPUR', 'TAKTIK', 'KOMBO', 'TYPEN', 'FLOW',
];

const LEARN_TASKS = [
  { subject: 'Deutsch', prompt: 'Wortart von laufen?', answer: 'VERB', label: 'Verb' },
  { subject: 'Deutsch', prompt: 'Wortart von schnell?', answer: 'ADJEKTIV', label: 'Adjektiv' },
  { subject: 'Deutsch', prompt: 'Artikel von Sonne?', answer: 'DIE', label: 'die' },
  { subject: 'Deutsch', prompt: 'Mehrzahl von Baum?', answer: 'BAEUME', label: 'Baeume' },
  { subject: 'Deutsch', prompt: 'Kompositum: Haus + Tuer', answer: 'HAUSTUER', label: 'Haustuer' },
  { subject: 'Deutsch', prompt: 'Silben: Scho-ko-la-de', answer: '4', label: '4' },
  { subject: 'Mathe', prompt: '8 + 7', answer: '15', label: '15' },
  { subject: 'Mathe', prompt: '6 x 4', answer: '24', label: '24' },
  { subject: 'Mathe', prompt: 'Haelfte von 18', answer: '9', label: '9' },
  { subject: 'Englisch', prompt: 'cat heisst?', answer: 'KATZE', label: 'Katze' },
  { subject: 'Englisch', prompt: 'blue heisst?', answer: 'BLAU', label: 'blau' },
  { subject: 'Sachkunde', prompt: 'Kontinent von Japan?', answer: 'ASIEN', label: 'Asien' },
  { subject: 'Geografie', prompt: 'Hauptstadt von Italien?', answer: 'ROM', label: 'Rom' },
  { subject: 'Geografie', prompt: 'Hauptstadt von Frankreich?', answer: 'PARIS', label: 'Paris' },
];

const KIND_CONFIG = {
  word: { label: 'Wort', color: '#22d3ee', speed: 8.2, hp: 1, score: 90, damage: 14, weight: 44 },
  fast: { label: 'Blitz', color: '#facc15', speed: 12.4, hp: 1, score: 135, damage: 16, weight: 16 },
  heavy: { label: 'Panzerwort', color: '#a78bfa', speed: 6.4, hp: 2, score: 210, damage: 22, weight: 11 },
  bonus: { label: 'Bonus', color: '#34d399', speed: 7.4, hp: 1, score: 80, damage: 0, weight: 7 },
  math: { label: 'Mathe', color: '#60a5fa', speed: 7.6, hp: 1, score: 125, damage: 15, weight: 8 },
  learn: { label: 'Lernen', color: '#fb7185', speed: 7.2, hp: 1, score: 150, damage: 17, weight: 10 },
  boss: { label: 'Bosskette', color: '#f97316', speed: 4.7, hp: 5, score: 520, damage: 35, weight: 0 },
};

const CONTRACTS = [
  { id: 'perfect-10', label: '10 perfekte Anschlaege', stat: 'perfectKeys', target: 10, time: 32, reward: { score: 620, overdrive: 18 } },
  { id: 'words-6', label: '6 Karten loeschen', stat: 'cards', target: 6, time: 42, reward: { score: 740, health: 16 } },
  { id: 'combo-5', label: '5er Combo halten', stat: 'combo', target: 5, time: 38, reward: { score: 820, overdrive: 24 } },
  { id: 'bonus-2', label: '2 Bonuskarten', stat: 'bonus', target: 2, time: 42, reward: { score: 600, freeze: 1 } },
  { id: 'boss-1', label: '1 Bosskette brechen', stat: 'boss', target: 1, time: 60, reward: { score: 1250, health: 24, overdrive: 36 } },
  { id: 'overdrive-1', label: '1 Overdrive sauber', stat: 'overdrive', target: 1, time: 55, reward: { score: 900, freeze: 1 } },
  { id: 'learn-5', label: '5 Lernkarten richtig', stat: 'learn', target: 5, time: 56, mode: 'learn', reward: { score: 1150, health: 28, overdrive: 24 } },
];

const initialStats = () => ({
  perfectKeys: 0,
  cards: 0,
  combo: 0,
  bonus: 0,
  boss: 0,
  overdrive: 0,
  learn: 0,
  misses: 0,
});

function weightedKind(wave, mode, serial) {
  if (serial > 0 && serial % 18 === 0) return 'boss';
  if (mode === 'learn' && serial % 3 === 0) return 'learn';
  const entries = Object.entries(KIND_CONFIG)
    .filter(([kind]) => kind !== 'boss' && (mode === 'learn' || kind !== 'learn'))
    .map(([kind, config]) => {
      let weight = config.weight;
      if (kind === 'fast') weight += wave * 1.1;
      if (kind === 'heavy') weight += Math.max(0, wave - 2);
      if (kind === 'math') weight += mode === 'learn' ? 5 : Math.max(0, wave - 1);
      return [kind, weight];
    });
  let roll = Math.random() * entries.reduce((sum, [, weight]) => sum + weight, 0);
  for (const [kind, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return kind;
  }
  return 'word';
}

function makeMathTask(wave) {
  const a = Math.floor(Math.random() * Math.min(9 + wave, 18)) + 2;
  const b = Math.floor(Math.random() * Math.min(8 + wave, 12)) + 2;
  if (wave > 3 && Math.random() > 0.55) {
    return { subject: 'Mathe', prompt: `${a} x ${b}`, answer: `${a * b}`, label: `${a * b}` };
  }
  return { subject: 'Mathe', prompt: `${a + b} - ${a}`, answer: `${b}`, label: `${b}` };
}

function taskForKind(kind, wave, serial, mode) {
  if (kind === 'learn') return LEARN_TASKS[(serial + wave * 2) % LEARN_TASKS.length];
  if (kind === 'math') return makeMathTask(wave);
  if (kind === 'bonus') {
    const word = ['FOKUS', 'BONUS', 'HEAL', 'MAGNET'][serial % 4];
    return { subject: 'Bonus', prompt: 'Bonuskarte', answer: word, label: word };
  }
  if (kind === 'boss') {
    const word = ['BOSS', 'KOMBO', 'DRACHE', 'MEISTER', 'FINALE'][(serial + wave) % 5];
    return { subject: 'Boss', prompt: 'Bosskette', answer: word, label: word };
  }
  const word = ARCADE_WORDS[(serial * 5 + wave * 3) % ARCADE_WORDS.length];
  return {
    subject: mode === 'learn' ? 'Lesen' : 'Arcade',
    prompt: kind === 'heavy' ? 'Zweimal tippen' : 'Tippe die Karte',
    answer: word,
    label: word,
  };
}

function makeCard(serial, mode, wave, forcedKind) {
  const kind = forcedKind || weightedKind(wave, mode, serial);
  const config = KIND_CONFIG[kind];
  const task = taskForKind(kind, wave, serial, mode);
  return {
    id: uid(),
    kind,
    subject: task.subject,
    prompt: task.prompt,
    display: task.label,
    answer: clean(task.answer),
    typed: '',
    hp: config.hp + (kind === 'boss' ? Math.floor(wave / 4) : 0),
    maxHp: config.hp + (kind === 'boss' ? Math.floor(wave / 4) : 0),
    lane: LANES[(serial * 2 + wave) % LANES.length],
    z: -48 - Math.random() * 18,
    y: 1.5 + (serial % 3) * 0.16,
    speed: config.speed + wave * 0.38 + Math.random() * 0.9,
    color: config.color,
    score: config.score,
    damage: config.damage,
    flash: 0,
  };
}

function retaskCard(card, wave, serial, mode) {
  const task = taskForKind(card.kind, wave, serial, mode);
  return {
    ...card,
    subject: task.subject,
    prompt: task.prompt,
    display: task.label,
    answer: clean(task.answer),
    typed: '',
    flash: 0.16,
  };
}

function applyReward(draft, reward = {}) {
  draft.score += reward.score || 0;
  draft.health = clamp(draft.health + (reward.health || 0), 0, draft.maxHealth);
  draft.overdrive = clamp(draft.overdrive + (reward.overdrive || 0), 0, 100);
  draft.freezeCharges = clamp(draft.freezeCharges + (reward.freeze || 0), 0, 5);
}

function contractPool(mode) {
  return CONTRACTS.filter((contract) => !contract.mode || contract.mode === mode);
}

function startNextContract(draft) {
  const pool = contractPool(draft.mode);
  const contract = pool[draft.contractIndex % pool.length];
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
  draft.contractCooldown = 5;
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
    draft.contractCooldown = 4.4;
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

function addLaser(draft, card, color = '#22d3ee') {
  draft.lasers = [
    ...draft.lasers,
    {
      id: uid(),
      target: [laneToX(card.lane), card.y, card.z],
      color,
      life: 0.2,
      maxLife: 0.2,
    },
  ];
}

function damageBase(draft, card, reason) {
  draft.health -= card.damage;
  draft.combo = 0;
  draft.activeCardId = null;
  draft.currentInput = '';
  draft.shake = 0.8;
  draft.message = reason || `${card.display} erreicht die Basis`;
  failContract(draft, 'Basis getroffen');
  if (draft.health <= 0) {
    draft.health = 0;
    draft.lives = 0;
    draft.isGameOver = true;
    draft.isPlaying = false;
    draft.highScore = Math.max(draft.highScore, draft.score);
    draft.message = 'Typing-Core ueberrannt';
  } else {
    draft.lives = Math.max(1, Math.ceil(draft.health / 34));
  }
}

function completeCard(draft, card, power = 1) {
  addLaser(draft, card, card.kind === 'boss' ? '#f97316' : '#22d3ee');
  const nextHp = card.hp - power;

  if (nextHp > 0) {
    const nextCard = retaskCard({ ...card, hp: nextHp }, draft.wave, draft.spawnSerial + nextHp, draft.mode);
    draft.cards = draft.cards.map((candidate) => (candidate.id === card.id ? nextCard : candidate));
    draft.activeCardId = card.id;
    draft.currentInput = '';
    draft.score += 80;
    draft.overdrive = clamp(draft.overdrive + 5, 0, 100);
    draft.message = `${card.kind === 'boss' ? 'Boss' : 'Panzerwort'} getroffen`;
    return;
  }

  draft.cards = draft.cards.filter((candidate) => candidate.id !== card.id);
  draft.destroyedEvent = { id: uid(), position: [laneToX(card.lane), card.y, card.z], color: card.color, kind: card.kind };
  draft.activeCardId = null;
  draft.currentInput = '';
  draft.combo += 1;
  draft.bestCombo = Math.max(draft.bestCombo, draft.combo);
  draft.cardsCleared += 1;
  draft.score += card.score + card.answer.length * 12 + draft.combo * 24;
  draft.overdrive = clamp(draft.overdrive + (card.kind === 'boss' ? 28 : 8), 0, 100);
  if (card.kind === 'bonus') {
    draft.health = clamp(draft.health + 18, 0, draft.maxHealth);
    draft.freezeCharges = clamp(draft.freezeCharges + 1, 0, 5);
    recordStat(draft, 'bonus');
  }
  if (card.kind === 'boss') recordStat(draft, 'boss');
  if (card.kind === 'learn' || draft.mode === 'learn') recordStat(draft, 'learn');
  recordStat(draft, 'cards');
  progressContract(draft, 'combo', draft.combo >= draft.contract?.target ? draft.contract.target : 0);
  draft.message = `${card.display} geloescht`;
}

function miss(draft, message = 'Fehltaste') {
  draft.combo = 0;
  draft.shake = 0.45;
  draft.currentInput = '';
  draft.activeCardId = null;
  recordStat(draft, 'misses');
  failContract(draft, message);
  draft.message = `${message} - neu zielen`;
}

function closestCards(cards, count = 1) {
  return [...cards].sort((a, b) => b.z - a.z).slice(0, count);
}

export const useGameStore = createGameStore(
  {
    mode: 'arcade',
    cards: [],
    activeCardId: null,
    currentInput: '',
    lasers: [],
    destroyedEvent: null,
    health: 100,
    maxHealth: 100,
    wave: 1,
    elapsed: 0,
    spawnSerial: 0,
    spawnTimer: 0,
    freezeTimer: 0,
    freezeCharges: 2,
    overdrive: 0,
    combo: 0,
    bestCombo: 0,
    cardsCleared: 0,
    shake: 0,
    stats: initialStats(),
    contract: null,
    contractIndex: 0,
    contractProgress: 0,
    contractTimer: 0,
    contractCooldown: 3,
    contractMedals: 0,
    contractFails: 0,
    message: 'Normalmodus: Tippe Karten, bevor sie den Core erreichen.',
  },
  (set, get) => ({
    startGame: (nextMode) => {
      const mode = nextMode || get().mode || 'arcade';
      const firstCards = [
        makeCard(1, mode, 1, mode === 'learn' ? 'learn' : 'word'),
        makeCard(2, mode, 1, 'fast'),
        makeCard(3, mode, 1, 'bonus'),
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
        cards: firstCards,
        activeCardId: null,
        currentInput: '',
        lasers: [],
        destroyedEvent: null,
        health: mode === 'learn' ? 115 : 100,
        maxHealth: mode === 'learn' ? 115 : 100,
        wave: 1,
        elapsed: 0,
        spawnSerial: 4,
        spawnTimer: 0,
        freezeTimer: 0,
        freezeCharges: 2,
        overdrive: 0,
        combo: 0,
        bestCombo: 0,
        cardsCleared: 0,
        shake: 0,
        stats: initialStats(),
        contract: null,
        contractIndex: 0,
        contractProgress: 0,
        contractTimer: 0,
        contractCooldown: 3,
        contractMedals: 0,
        contractFails: 0,
        message: mode === 'learn'
          ? 'Lernmodus: Tippe Antworten zu Deutsch, Mathe, Englisch und Sachkunde.'
          : 'Normalmodus: Tippe Karten, bevor sie den Core erreichen.',
      });
    },

    handleKey: (key) => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.isGameOver || state.quizActive) return;

      if (key === 'Backspace') {
        set({ currentInput: state.currentInput.slice(0, -1) });
        return;
      }
      if (key === 'Escape') {
        set({ activeCardId: null, currentInput: '' });
        return;
      }
      if (key === ' ' || key === 'Enter') {
        get().activateOverdrive();
        return;
      }
      if (key === 'Shift') {
        get().activateFreeze();
        return;
      }

      const typedKey = clean(key);
      if (typedKey.length !== 1 || !/^[A-Z0-9]$/.test(typedKey)) return;

      const draft = { ...state, cards: state.cards.map((card) => ({ ...card })), lasers: [...state.lasers] };
      let target = draft.activeCardId
        ? draft.cards.find((card) => card.id === draft.activeCardId)
        : null;

      if (!target) {
        const matches = closestCards(draft.cards.filter((card) => card.answer.startsWith(typedKey) && card.typed.length === 0), 1);
        target = matches[0];
        if (!target) {
          miss(draft, 'Kein passendes Ziel');
          set(draft);
          return;
        }
        draft.activeCardId = target.id;
      }

      const expected = target.answer[target.typed.length];
      if (typedKey !== expected) {
        miss(draft, 'Fehltaste');
        set(draft);
        return;
      }

      target.typed += typedKey;
      draft.currentInput = target.typed;
      draft.score += 8 + draft.combo;
      draft.overdrive = clamp(draft.overdrive + 1.6, 0, 100);
      recordStat(draft, 'perfectKeys');
      addLaser(draft, target, '#67e8f9');

      if (target.typed === target.answer) completeCard(draft, target, 1);
      else {
        draft.cards = draft.cards.map((card) => (card.id === target.id ? target : card));
        draft.message = `${target.display}: ${target.typed}/${target.answer}`;
      }

      if (draft.score > draft.highScore) draft.highScore = draft.score;
      set(draft);
    },

    activateFreeze: () => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.isGameOver || state.freezeCharges <= 0) return;
      set({
        freezeCharges: state.freezeCharges - 1,
        freezeTimer: 4.2,
        message: 'Freeze-Fokus aktiv',
      });
    },

    activateOverdrive: () => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.isGameOver || state.overdrive < 100 || state.cards.length === 0) return;
      const draft = { ...state, overdrive: 0, cards: state.cards.map((card) => ({ ...card })), lasers: [...state.lasers] };
      closestCards(draft.cards, 5).forEach((card) => completeCard(draft, card, card.kind === 'boss' ? 2 : 4));
      recordStat(draft, 'overdrive');
      draft.message = 'Overdrive schreibt die Front frei';
      set(draft);
    },

    updateGame: (dt) => {
      const state = get();
      if (!state.isPlaying || state.isPaused || state.isGameOver || state.quizActive) return;

      const cappedDt = Math.min(dt, 0.05);
      const draft = { ...state, cards: state.cards.map((card) => ({ ...card })), lasers: [...state.lasers] };
      draft.elapsed += cappedDt;
      draft.spawnTimer += cappedDt;
      draft.freezeTimer = Math.max(0, draft.freezeTimer - cappedDt);
      draft.shake = Math.max(0, draft.shake - cappedDt * 2.8);

      const nextWave = Math.floor(draft.elapsed / 28) + 1;
      if (nextWave > draft.wave) {
        draft.wave = nextWave;
        draft.level = nextWave;
        draft.health = clamp(draft.health + 8, 0, draft.maxHealth);
        draft.message = `Welle ${nextWave}: schneller tippen`;
      }

      updateContract(draft, cappedDt);

      const slow = draft.freezeTimer > 0 ? 0.38 : 1;
      draft.cards.forEach((card) => {
        card.z += card.speed * slow * cappedDt;
        card.flash = Math.max(0, card.flash - cappedDt);
      });

      const reached = draft.cards.filter((card) => card.z > 8.5);
      if (reached.length) {
        reached.forEach((card) => damageBase(draft, card));
        const reachedIds = new Set(reached.map((card) => card.id));
        draft.cards = draft.cards.filter((card) => !reachedIds.has(card.id));
      }

      const spawnInterval = Math.max(0.72, 2.05 - draft.wave * 0.1);
      if (draft.spawnTimer >= spawnInterval && draft.cards.length < 9) {
        draft.spawnTimer = 0;
        const serial = draft.spawnSerial + 1;
        draft.spawnSerial = serial;
        draft.cards.push(makeCard(serial, draft.mode, draft.wave));
      }

      draft.lasers = draft.lasers
        .map((laser) => ({ ...laser, life: laser.life - cappedDt }))
        .filter((laser) => laser.life > 0);

      if (draft.score > draft.highScore) draft.highScore = draft.score;
      set(draft);
    },

    clearDestroyedEvent: () => set({ destroyedEvent: null }),
  }),
);
