import { create } from 'zustand';

const isPrime = (num) => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

export const createHoopData = (zPos) => {
  const isP = Math.random() > 0.4;
  let num;
  do {
    num = Math.floor(Math.random() * 98) + 2;
  } while (isPrime(num) !== isP);

  return {
    x: (Math.random() - 0.5) * 30,
    z: zPos,
    number: num,
    isPrime: isP,
    hit: false,
    active: true,
    color: '#00ffff', 
  };
};

const MAX_PARTICLES = 150;

export const spawnParticles = (particles, x, z, colorStr) => {
  let spawned = 0;
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const p = particles[i];
    if (p.life <= 0) {
      p.life = 0.5 + Math.random() * 0.8;
      p.x = x + (Math.random() - 0.5) * 3;
      p.y = 1.5 + (Math.random() - 0.5) * 3;
      p.z = z + (Math.random() - 0.5) * 3;
      const speed = 10 + Math.random() * 30;
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 2;
      p.vx = Math.cos(angle1) * Math.sin(angle2) * speed;
      p.vy = Math.sin(angle1) * speed;
      p.vz = Math.cos(angle2) * speed;
      p.colorStr = colorStr; 
      p.scale = Math.random() * 0.8 + 0.2;
      spawned++;
      if (spawned > 30) break;
    }
  }
};

const useGameStore = create((set, get) => ({
  x: 0,
  speed: 60,
  targetSpeed: 60,
  score: 0,
  lap: 0,
  shake: 0,
  flash: 0,
  hoops: [],
  particles: [],
  boost: 0,
  controls: {
    forward: false,
    backward: false,
    left: false,
    right: false,
  },
  setControls: (controls) => set((state) => ({ controls: { ...state.controls, ...controls } })),
  updateGame: (data) => set((state) => ({ ...state, ...data })),
  initHoops: (hoops) => set({ hoops }),
  initParticles: (particles) => set({ particles })
}));

export default useGameStore;
