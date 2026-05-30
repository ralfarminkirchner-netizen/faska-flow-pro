import { create } from 'zustand';

const WORD_GROUPS = [
    { name: "Früchte", words: ["Apfel", "Banane", "Kirsche", "Birne", "Orange", "Traube", "Melone", "Pfirsich", "Kiwi"] },
    { name: "Fahrzeuge", words: ["Auto", "Bus", "Fahrrad", "Zug", "Flugzeug", "Schiff", "LKW", "Traktor", "Roller"] },
    { name: "Tiere", words: ["Hund", "Katze", "Maus", "Elefant", "Tiger", "Bär", "Löwe", "Vogel", "Pferd"] },
    { name: "Möbel", words: ["Stuhl", "Tisch", "Bett", "Schrank", "Sofa", "Regal", "Sessel", "Hocker"] },
    { name: "Kleidung", words: ["Hose", "Hemd", "Schuh", "Jacke", "Hut", "Socke", "Kleid", "Pullover", "Mütze"] },
    { name: "Berufe", words: ["Arzt", "Lehrer", "Bäcker", "Maler", "Koch", "Bauer", "Polizist", "Friseur", "Pilot"] }
];

export const useGameStore = create((set, get) => ({
    score: 0,
    targets: [],
    instruction: "Finde das unpassende Wort!",
    hitTarget: (id, isOdd) => set((state) => {
        const newTargets = state.targets.filter(t => t.id !== id);
        if (isOdd) {
            setTimeout(() => get().startWave(), 1500);
            return { 
                score: state.score + 10, 
                targets: newTargets.map(t => ({...t, fleeing: true})) 
            };
        } else {
            return { 
                score: Math.max(0, state.score - 5), 
                targets: newTargets 
            };
        }
    }),
    startWave: () => {
        const mainGroupIdx = Math.floor(Math.random() * WORD_GROUPS.length);
        let oddGroupIdx = Math.floor(Math.random() * WORD_GROUPS.length);
        while (oddGroupIdx === mainGroupIdx) {
            oddGroupIdx = Math.floor(Math.random() * WORD_GROUPS.length);
        }

        const mainGroup = WORD_GROUPS[mainGroupIdx];
        const oddGroup = WORD_GROUPS[oddGroupIdx];

        const shuffle = (array) => [...array].sort(() => 0.5 - Math.random());

        const mainWords = shuffle(mainGroup.words).slice(0, 4);
        const oddWord = shuffle(oddGroup.words)[0];

        const waveWords = [...mainWords.map(w => ({ word: w, isOdd: false })), { word: oddWord, isOdd: true }];
        const shuffledWave = shuffle(waveWords);

        const newTargets = shuffledWave.map((item, i) => ({
            id: `target_${Date.now()}_${i}`,
            word: item.word,
            isOdd: item.isOdd,
            position: [
                (Math.random() - 0.5) * 40, 
                Math.random() * 10 + 5, 
                -(Math.random() * 20 + 20)
            ],
            speed: (Math.random() * 2 + 2) * (Math.random() > 0.5 ? 1 : -1),
            fleeing: false
        }));

        set({ targets: newTargets });
    }
}));
