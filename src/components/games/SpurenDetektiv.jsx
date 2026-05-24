import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../../utils/sounds";
import { WORLD_TRACK_CASES } from "../../data/learningContent";

const CASES = WORLD_TRACK_CASES;

function Trail({ marks }) {
  return (
    <div className="relative h-64 bg-gradient-to-br from-sky-50 via-white to-emerald-50 rounded-[44px] border-4 border-white shadow-inner overflow-hidden paper-texture">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#bfdbfe_0,transparent_22%),radial-gradient(circle_at_80%_70%,#bbf7d0_0,transparent_24%)]" />
      <div className="absolute left-1/2 top-8 -translate-x-1/2 flex flex-col gap-3 rotate-[-12deg]">
        {marks.map((mark, index) => (
          <motion.span
            key={`${mark}-${index}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: index % 2 === 0 ? 1 : 0.82, x: index % 2 === 0 ? -18 : 18 }}
            transition={{ delay: index * 0.12 }}
            className="font-hand text-6xl text-slate-500 drop-shadow-sm"
          >
            {mark}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export default function SpurenDetektiv({ onCorrect = () => {}, onWrong = () => {} }) {
  const [caseIndex, setCaseIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const activeCase = CASES[caseIndex];
  const pickedOption = activeCase.options.find((option) => option.id === picked);

  const choose = (id) => {
    if (feedback === "richtig") return;
    setPicked(id);
    playPop();

    if (id === activeCase.answer) {
      setFeedback("richtig");
      playSparkle();
      onCorrect(5);
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.7 } });
    } else {
      setFeedback("falsch");
      playError();
      onWrong();
      setTimeout(() => {
        setPicked(null);
        setFeedback(null);
      }, 1300);
    }
  };

  const nextCase = () => {
    playPop();
    setCaseIndex((caseIndex + 1) % CASES.length);
    setPicked(null);
    setFeedback(null);
  };

  return (
    <div className="flex flex-col gap-8 py-6">
      <div className="text-center">
        <h3 className="font-hand text-5xl font-bold text-slate-800">Spuren-Detektiv</h3>
        <p className="font-hand text-2xl text-slate-500 mt-2">Welche Spur passt zu welchem Tier?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 rounded-[48px] border-4 border-white shadow-xl p-6">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-emerald-600">Fall {caseIndex + 1}</p>
          <h4 className="font-hand text-4xl font-bold text-slate-700 mb-4">{activeCase.title}</h4>
          <Trail marks={activeCase.trail} />
          <p className="font-hand text-2xl text-slate-600 mt-5 bg-white/70 rounded-[26px] px-5 py-3 border-2 border-emerald-100">
            {activeCase.clue}
          </p>
        </div>

        <div className="bg-emerald-50/60 rounded-[48px] border-4 border-white shadow-xl p-6 flex flex-col gap-4 justify-center">
          {activeCase.options.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.03, x: 4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => choose(option.id)}
              className={`bg-white/85 rounded-[30px] border-4 p-5 shadow-md flex items-center gap-5 text-left transition-all ${
                picked === option.id ? "border-emerald-300 ring-4 ring-emerald-100" : "border-white hover:border-emerald-100"
              }`}
            >
              <span className="text-6xl">{option.icon}</span>
              <span>
                <span className="block font-hand text-3xl font-bold text-slate-700">{option.name}</span>
                <span className="block font-hand text-xl text-slate-500">{option.place}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="min-h-24 flex justify-center">
        <AnimatePresence mode="wait">
          {feedback === "falsch" && (
            <motion.p key="wrong" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-hand text-3xl font-bold text-rose-500">
              Schau noch einmal auf Form und Größe der Spur.
            </motion.p>
          )}
          {feedback === "richtig" && pickedOption && (
            <motion.div key="right" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
              <p className="font-hand text-3xl font-bold text-emerald-600">
                Gefunden: {pickedOption.name}! Gute Beobachtung.
              </p>
              <button onClick={nextCase} className="px-8 py-3 bg-emerald-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg">
                Nächster Fall
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
