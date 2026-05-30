import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  phase: 'countdown', // 'countdown' | 'racing' | 'quiz' | 'won'
  laps: 0,
  heldItem: null,
  pendingCountry: null,
  showCountryModal: false,
  countryOptions: [],
  countryAnswer: '',
  boostTimer: 0,
  raceTime: 0,
  wrongAnswer: false,

  // Item systems
  itemBoxes: [],
  bananas: [],
  projectiles: [],
  particles: [],

  updateGame: (updates) => set((state) => ({ ...state, ...updates })),

  setItemBoxes: (updater) => set((state) => ({
    itemBoxes: typeof updater === 'function' ? updater(state.itemBoxes) : updater
  })),

  setBananas: (updater) => set((state) => ({
    bananas: typeof updater === 'function' ? updater(state.bananas) : updater
  })),

  setProjectiles: (updater) => set((state) => ({
    projectiles: typeof updater === 'function' ? updater(state.projectiles) : updater
  })),

  setParticles: (updater) => set((state) => ({
    particles: typeof updater === 'function' ? updater(state.particles) : updater
  })),

  reset: () => set({
    phase: 'countdown',
    laps: 0,
    heldItem: null,
    pendingCountry: null,
    showCountryModal: false,
    countryOptions: [],
    countryAnswer: '',
    boostTimer: 0,
    raceTime: 0,
    wrongAnswer: false,
    itemBoxes: [],
    bananas: [],
    projectiles: [],
    particles: []
  }),
}));

export const ITEMS = ['shell', 'boost', 'banana'];
export const LAP_COUNT = 3;

export const COUNTRIES = [
  { name: 'Deutschland', flag: '🇩🇪', alt: ['germany', 'deutschland', 'de'] },
  { name: 'Frankreich', flag: '🇫🇷', alt: ['france', 'frankreich', 'fr'] },
  { name: 'Japan', flag: '🇯🇵', alt: ['japan', 'jp'] },
  { name: 'Brasilien', flag: '🇧🇷', alt: ['brazil', 'brasilien', 'br'] },
  { name: 'Australien', flag: '🇦🇺', alt: ['australia', 'australien', 'au'] },
  { name: 'Mexiko', flag: '🇲🇽', alt: ['mexico', 'mexiko', 'mx'] },
  { name: 'Indien', flag: '🇮🇳', alt: ['india', 'indien', 'in'] },
  { name: 'Kanada', flag: '🇨🇦', alt: ['canada', 'kanada', 'ca'] },
  { name: 'Italien', flag: '🇮🇹', alt: ['italy', 'italien', 'it'] },
  { name: 'China', flag: '🇨🇳', alt: ['china', 'cn'] },
  { name: 'Ägypten', flag: '🇪🇬', alt: ['egypt', 'ägypten', 'aegypten', 'eg'] },
  { name: 'Argentinien', flag: '🇦🇷', alt: ['argentina', 'argentinien', 'ar'] },
];
