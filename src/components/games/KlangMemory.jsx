import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError, playSynth } from "../../utils/sounds";
import { MUSIC_MEMORY_INSTRUMENTS } from "../../data/learningContent";

const INSTRUMENTS = MUSIC_MEMORY_INSTRUMENTS;

const shuffle = (items) =>
  [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);

function makeDeck() {
  const roundInstruments = shuffle(INSTRUMENTS).slice(0, 6);
  return shuffle(
    roundInstruments.flatMap((instrument) => [
      { cardId: `${instrument.id}-icon`, pairId: instrument.id, kind: "icon", label: instrument.icon, freq: instrument.freq },
      { cardId: `${instrument.id}-word`, pairId: instrument.id, kind: "word", label: instrument.word, freq: instrument.freq },
    ])
  );
}

export default function KlangMemory({ onCorrect = () => {}, onWrong = () => {} }) {
  const [seed, setSeed] = useState(0);
  const deck = useMemo(() => makeDeck(), [seed]);
  const pairCount = deck.length / 2;
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  const [locked, setLocked] = useState(false);

  const choose = (card) => {
    if (locked || open.includes(card.cardId) || matched.includes(card.pairId)) return;
    playPop();
    if (card.kind === "icon") playSynth(card.freq);
    const nextOpen = [...open, card.cardId];
    setOpen(nextOpen);

    if (nextOpen.length === 2) {
      const selected = deck.filter((item) => nextOpen.includes(item.cardId));
      setLocked(true);
      if (selected[0].pairId === selected[1].pairId) {
        setTimeout(() => {
          const nextMatched = [...matched, selected[0].pairId];
          setMatched(nextMatched);
          setOpen([]);
          setLocked(false);
          playSparkle();
          onCorrect(4);
          if (nextMatched.length === pairCount) confetti({ particleCount: 150, spread: 100, origin: { y: 0.75 } });
        }, 650);
      } else {
        setTimeout(() => {
          playError();
          onWrong();
          setOpen([]);
          setLocked(false);
        }, 850);
      }
    }
  };

  const reset = () => {
    playPop();
    setOpen([]);
    setMatched([]);
    setSeed((value) => value + 1);
  };

  const isVisible = (card) => open.includes(card.cardId) || matched.includes(card.pairId);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 flex flex-col gap-8">
      <div className="text-center">
        <h2 className="font-hand text-5xl font-bold text-slate-800">Klang-Memory</h2>
        <p className="font-hand text-2xl text-slate-500 mt-2">Finde Instrument und Namen. Bildkarten klingen kurz an.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-fuchsia-50/70 rounded-[54px] border-4 border-white shadow-2xl p-6 paper-texture">
        {deck.map((card) => {
          const visible = isVisible(card);
          const done = matched.includes(card.pairId);
          return (
            <motion.button
              key={card.cardId}
              whileHover={{ scale: done ? 1 : 1.04, y: done ? 0 : -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => choose(card)}
              className={`aspect-square rounded-[32px] border-4 shadow-lg flex items-center justify-center transition-all ${
                done ? "bg-emerald-50 border-emerald-200" : visible ? "bg-white border-fuchsia-200" : "bg-white/70 border-white"
              }`}
            >
              <AnimatePresence mode="wait">
                {visible ? (
                  <motion.span
                    key="front"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    className={card.kind === "icon" ? "text-6xl" : "font-hand text-3xl font-bold text-slate-700"}
                  >
                    {card.label}
                  </motion.span>
                ) : (
                  <motion.span key="back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-hand text-6xl text-fuchsia-300">
                    ♪
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <div className="min-h-20 flex flex-col items-center gap-4">
        <p className="font-hand text-2xl text-slate-500">{matched.length} von {pairCount} Klängen gefunden · {INSTRUMENTS.length} Instrumente im Pool</p>
        {matched.length === pairCount && <p className="font-hand text-3xl font-bold text-emerald-600">Deine Ohren haben gut gesucht.</p>}
        <button onClick={reset} className="px-7 py-3 bg-fuchsia-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg">
          Neu mischen
        </button>
      </div>
    </div>
  );
}
