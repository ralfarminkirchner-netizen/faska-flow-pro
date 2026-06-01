import { createGameStore } from '../../../../shared/useSwarmStore';
import { Vector3 } from 'three';

const WORDS = [
  "APPLE", "APFEL", "ROBOT", "MASCHINE", "LASER", "GEHIRN", "GALAXY", "STERN", 
  "FAST", "SCHNELL", "CODE", "PROGRAM", "HACKER", "NEURON", "LOGIC", "DATA", 
  "DATEN", "SYSTEM", "NETWORK", "NETZWERK", "REACT", "FIBER", "ZUSTAND", "RAPIER",
  "CYBER", "PUNK", "FUTURE", "ZUKUNFT", "SWARM", "SCHWARM"
];

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useGameStore = createGameStore((set, get) => ({
  score: 0,
  health: 100,
  enemies: [],
  targetEnemyId: null,
  lasers: [],
  shake: 0,

  initGame: () => {
    set({ score: 0, health: 100, enemies: [], targetEnemyId: null, lasers: [], shake: 0 });
  },

  spawnEnemy: () => {
    const angle = Math.random() * Math.PI * 2;
    // Spawn enemies in a circle around the player
    const distance = 40 + Math.random() * 20;
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    
    set((state) => ({
      enemies: [...state.enemies, {
        id: generateId(),
        word,
        typed: "",
        position: [x, 1.5, z],
        // Speed increases slightly as score goes up
        speed: 3 + Math.random() * 4 + (state.score / 400)
      }]
    }));
  },

  updateEnemies: (dt) => {
    set((state) => {
      if (state.health <= 0) return state; // Game over state

      let newHealth = state.health;
      let newShake = state.shake;
      let targetLost = false;

      const updatedEnemies = state.enemies.map(enemy => {
        const pos = new Vector3(...enemy.position);
        // Move towards center (0,0,0)
        const dir = pos.clone().negate().normalize();
        pos.add(dir.multiplyScalar(enemy.speed * dt));
        return { ...enemy, position: [pos.x, pos.y, pos.z] };
      }).filter(enemy => {
        const dist = new Vector3(...enemy.position).length();
        if (dist < 2.5) {
          // Reached player
          newHealth -= 15;
          newShake = 1.5;
          if (state.targetEnemyId === enemy.id) targetLost = true;
          return false; // Remove enemy
        }
        return true;
      });

      return {
        enemies: updatedEnemies,
        health: Math.max(0, newHealth),
        shake: newShake > 0 ? newShake - dt * 3 : 0,
        targetEnemyId: targetLost ? null : state.targetEnemyId
      };
    });
  },

  handleKey: (key) => {
    const k = key.toUpperCase();
    if (!/^[A-Z]$/.test(k)) return;
    
    const state = get();
    if (state.health <= 0) return;
    
    if (state.targetEnemyId) {
      // Player is locked onto an enemy
      const target = state.enemies.find(e => e.id === state.targetEnemyId);
      if (target) {
        const nextChar = target.word[target.typed.length];
        if (k === nextChar) {
          const newTyped = target.typed + k;
          
          // Fire a laser visually
          set(s => ({
            lasers: [...s.lasers, { id: generateId(), targetPos: target.position, time: 0.15 }]
          }));

          if (newTyped === target.word) {
            // Word completely typed! Destroy enemy
            set(s => ({
              score: s.score + target.word.length * 10,
              enemies: s.enemies.filter(e => e.id !== target.id),
              targetEnemyId: null
            }));
          } else {
            // Update typed letters
            set(s => ({
              enemies: s.enemies.map(e => e.id === target.id ? { ...e, typed: newTyped } : e)
            }));
          }
        } else {
          // Wrong key pressed
          set({ shake: 0.5 });
        }
      } else {
        // Target is suddenly missing, unlock
        set({ targetEnemyId: null });
      }
    } else {
      // Find a new target starting with the typed letter
      const potentialTargets = state.enemies.filter(e => e.word.startsWith(k) && e.typed === "");
      if (potentialTargets.length > 0) {
        // Pick the closest matching enemy
        potentialTargets.sort((a, b) => {
          const da = new Vector3(...a.position).lengthSq();
          const db = new Vector3(...b.position).lengthSq();
          return da - db;
        });
        const target = potentialTargets[0];
        
        set(s => ({
          lasers: [...s.lasers, { id: generateId(), targetPos: target.position, time: 0.15 }]
        }));
        
        if (target.word.length === 1) { // Rare case: 1-letter word
            set(s => ({
              score: s.score + 10,
              enemies: s.enemies.filter(e => e.id !== target.id),
              targetEnemyId: null
            }));
        } else {
            set(s => ({
              targetEnemyId: target.id,
              enemies: s.enemies.map(e => e.id === target.id ? { ...e, typed: k } : e)
            }));
        }
      } else {
        // Wrong key, no matching enemy
        set({ shake: 0.3 });
      }
    }
  },

  updateLasers: (dt) => {
    set((state) => ({
      lasers: state.lasers.map(l => ({ ...l, time: l.time - dt })).filter(l => l.time > 0)
    }));
  }
}));
