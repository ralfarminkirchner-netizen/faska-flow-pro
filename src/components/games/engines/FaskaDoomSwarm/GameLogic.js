import { create } from 'zustand';

export const AMMO_TYPES = {
    NOUN: { name: 'Noun', color: '#ff0044', type: 'noun' },
    VERB: { name: 'Verb', color: '#0044ff', type: 'verb' }
};

export const WORDS = [
    { text: "Table", type: 'noun' },
    { text: "Run", type: 'verb' },
    { text: "Car", type: 'noun' },
    { text: "Jump", type: 'verb' },
    { text: "Apple", type: 'noun' },
    { text: "Eat", type: 'verb' },
    { text: "House", type: 'noun' },
    { text: "Sleep", type: 'verb' },
    { text: "Dog", type: 'noun' },
    { text: "Write", type: 'verb' },
    { text: "Mountain", type: 'noun' },
    { text: "Fight", type: 'verb' }
];

export const useGameStore = create((set, get) => ({
    ammoType: AMMO_TYPES.NOUN,
    score: 0,
    health: 100,
    hitFlash: null,
    enemies: [],
    isLocked: false,
    enemyIdCounter: 0,
    cameraShake: 0,
    joystickMove: { x: 0, y: 0 },
    isShooting: false,

    setAmmoType: (ammoType) => set({ ammoType }),
    toggleAmmo: () => set((state) => ({ ammoType: state.ammoType.type === 'noun' ? AMMO_TYPES.VERB : AMMO_TYPES.NOUN })),
    setScore: (score) => set({ score }),
    setHealth: (health) => set({ health }),
    setHitFlash: (hitFlash) => set({ hitFlash }),
    setIsLocked: (isLocked) => set({ isLocked }),
    setJoystickMove: (move) => set({ joystickMove: move }),
    setIsShooting: (isShooting) => set({ isShooting }),

    spawnEnemy: () => {
        const { isLocked, enemies, enemyIdCounter } = get();
        // Spawning works only if locked (desktop) or on mobile. Let's rely on an internal play state or just spawn if < 15.
        // Actually, on mobile isLocked might be false. Let's just check length.
        if (enemies.length >= 15) return;
        
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 15;
        const x = Math.cos(angle) * dist;
        const z = Math.sin(angle) * dist;
        
        set({
            enemies: [...enemies, {
                id: enemyIdCounter,
                type: word.type,
                word: word.text,
                position: [x, 5, z]
            }],
            enemyIdCounter: enemyIdCounter + 1
        });
    },

    handleHitEnemy: (id, enemyType, hitPoint, triggerParticles) => {
        const { ammoType, setHitFlash, enemies } = get();
        if (enemyType === ammoType.type) {
            set((state) => ({ enemies: state.enemies.filter(e => e.id !== id), score: state.score + 100, hitFlash: 'rgba(0, 255, 0, 0.2)' }));
            if (triggerParticles) triggerParticles(hitPoint, ammoType.color, 20, 15);
        } else {
            set({ hitFlash: 'rgba(255, 0, 0, 0.3)' });
            if (triggerParticles) triggerParticles(hitPoint, '#ffffff', 5, 2);
        }
        setTimeout(() => set({ hitFlash: null }), 100);
    },

    handleMelee: (id) => {
        const { enemies, health } = get();
        const newHealth = health - 20 <= 0 ? 100 : health - 20;
        set({
            enemies: enemies.filter(e => e.id !== id),
            health: newHealth,
            hitFlash: 'rgba(255, 0, 0, 0.6)',
            cameraShake: 0.3
        });
        if (health - 20 <= 0) set({ score: 0 });
        setTimeout(() => set({ hitFlash: null }), 200);
    },
    
    shakeCamera: () => set({ cameraShake: 0.3 }),
    consumeCameraShake: (amount) => set((state) => ({ cameraShake: Math.max(0, state.cameraShake - amount) }))
}));

export const globalState = {
    playerPosition: { x: 0, y: 5, z: 0 }
};
