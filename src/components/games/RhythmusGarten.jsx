import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError, playKick, playSnare, playHiHat } from "../../utils/sounds";
import { MUSIC_RHYTHM_PATTERNS } from "../../data/learningContent";

const BEATS = {
  stampf: { label: "Stampf", icon: "🦶", sound: playKick, color: "bg-amber-100 border-amber-200 text-amber-700" },
  klatsch: { label: "Klatsch", icon: "👏", sound: playSnare, color: "bg-rose-100 border-rose-200 text-rose-700" },
  zisch: { label: "Zisch", icon: "✨", sound: playHiHat, color: "bg-sky-100 border-sky-200 text-sky-700" },
};

const PATTERNS = MUSIC_RHYTHM_PATTERNS;

export default function RhythmusGarten({ onCorrect = () => {}, onWrong = () => {} }) {
  const [patternIndex, setPatternIndex] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const pattern = PATTERNS[patternIndex];

  const addBeat = (id) => {
    if (feedback === "richtig") return;
    BEATS[id].sound();
    const next = [...sequence, id].slice(0, pattern.pattern.length);
    setSequence(next);
    if (next.length === pattern.pattern.length) {
      const correct = next.join(",") === pattern.pattern.join(",");
      if (correct) {
        setFeedback("richtig");
        playSparkle();
        onCorrect(5);
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.75 } });
      } else {
        setFeedback("falsch");
        playError();
        onWrong();
        setTimeout(() => {
          setSequence([]);
          setFeedback(null);
        }, 1200);
      }
    }
  };

  const playPattern = () => {
    playPop();
    pattern.pattern.forEach((id, index) => {
      setTimeout(() => BEATS[id].sound(), index * 360);
    });
  };

  const next = () => {
    playPop();
    setPatternIndex((patternIndex + 1) % PATTERNS.length);
    setSequence([]);
    setFeedback(null);
  };

  const clear = () => {
    playPop();
    setSequence([]);
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 flex flex-col gap-8">
      <div className="text-center">
        <h2 className="font-hand text-5xl font-bold text-slate-800">Rhythmus-Garten</h2>
        <p className="font-hand text-2xl text-slate-500 mt-2">Höre oder lies den Rhythmus und spiele ihn nach.</p>
      </div>

      <div className="bg-amber-50/70 rounded-[56px] border-4 border-white shadow-2xl p-8 paper-texture">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
          <div>
            <p className="font-sans text-xs uppercase tracking-widest font-bold text-amber-600">Pattern</p>
            <h3 className="font-hand text-4xl font-bold text-slate-700">{pattern.title}</h3>
          </div>
          <button onClick={playPattern} className="px-7 py-3 bg-amber-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg">
            Anhören
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 md:gap-5">
          {pattern.pattern.map((id, index) => (
            <motion.div
              key={`${patternIndex}-${index}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.08 }}
              className={`min-h-28 rounded-[30px] border-4 shadow-md flex flex-col items-center justify-center ${BEATS[id].color}`}
            >
              <span className="text-5xl">{BEATS[id].icon}</span>
              <span className="font-hand text-xl font-bold">{BEATS[id].label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {Object.entries(BEATS).map(([id, beat]) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => addBeat(id)}
            className={`w-32 h-32 rounded-[36px] border-4 shadow-lg flex flex-col items-center justify-center ${beat.color}`}
          >
            <span className="text-6xl">{beat.icon}</span>
            <span className="font-hand text-2xl font-bold">{beat.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="bg-white/65 rounded-[36px] border-4 border-white shadow-lg p-5 min-h-28">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Dein Rhythmus</p>
        <div className="flex flex-wrap gap-3">
          {sequence.length === 0 && <span className="font-hand text-2xl text-slate-400">Tippe die Klangsteine an.</span>}
          <AnimatePresence>
            {sequence.map((id, index) => (
              <motion.span
                key={`${id}-${index}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={`px-4 py-2 rounded-2xl border-2 font-hand text-2xl font-bold ${BEATS[id].color}`}
              >
                {BEATS[id].icon} {BEATS[id].label}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="min-h-20 text-center">
        {feedback === "falsch" && <p className="font-hand text-3xl font-bold text-rose-500">Der Rhythmus stolpert noch. Versuch ihn langsam.</p>}
        {feedback === "richtig" ? (
          <div className="flex flex-col items-center gap-4">
            <p className="font-hand text-3xl font-bold text-emerald-600">Das groovt.</p>
            <button onClick={next} className="px-8 py-3 bg-emerald-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg">
              Neuer Rhythmus
            </button>
          </div>
        ) : (
          sequence.length > 0 && <button onClick={clear} className="px-7 py-3 bg-white text-slate-500 rounded-full font-hand text-2xl font-bold shadow-md border-2 border-slate-100">Leeren</button>
        )}
      </div>
    </div>
  );
}
