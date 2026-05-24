import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../../utils/sounds";
import { MATHE_CONTENT } from "../../data/learningContent";

const ROUNDS = MATHE_CONTENT.numberRiverRounds;

export default function ZahlenFluss({ onCorrect = () => {}, onWrong = () => {} }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const round = ROUNDS[roundIndex];

  const choose = (value) => {
    if (feedback === "richtig") return;
    setSelected(value);
    playPop();
    if (value === round.answer) {
      setFeedback("richtig");
      playSparkle();
      onCorrect(5);
      confetti({ particleCount: 110, spread: 100, origin: { y: 0.75 } });
    } else {
      setFeedback("falsch");
      playError();
      onWrong();
      setTimeout(() => {
        setSelected(null);
        setFeedback(null);
      }, 1200);
    }
  };

  const next = () => {
    playPop();
    setRoundIndex((roundIndex + 1) % ROUNDS.length);
    setSelected(null);
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 flex flex-col gap-8">
      <div className="text-center">
        <h2 className="font-hand text-5xl font-bold text-slate-800">Zahlen-Fluss</h2>
        <p className="font-hand text-2xl text-slate-500 mt-2">Springe von Stein zu Stein und finde die fehlende Zahl.</p>
      </div>

      <div className="bg-gradient-to-br from-sky-100 via-blue-50 to-emerald-50 rounded-[56px] border-4 border-white shadow-2xl p-8 paper-texture overflow-hidden">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-sky-700">Muster</p>
            <h3 className="font-hand text-4xl font-bold text-slate-700">{round.title}</h3>
          </div>
          <div className="hidden md:block font-hand text-5xl opacity-50">〰️</div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5">
          {round.river.map((value, index) => {
            const isBlank = value === null;
            return (
              <motion.div
                key={`${roundIndex}-${index}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: index % 2 === 0 ? -4 : 8, opacity: 1 }}
                transition={{ delay: index * 0.08, type: "spring" }}
                className={`w-28 h-24 md:w-36 md:h-28 rounded-[36px] border-4 shadow-lg flex items-center justify-center ${
                  isBlank ? "bg-amber-50 border-dashed border-amber-300" : "bg-white/85 border-white"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isBlank && selected ? (
                    <motion.span key="selected" initial={{ scale: 0 }} animate={{ scale: 1 }} className="font-hand text-5xl font-bold text-amber-600">
                      {selected}
                    </motion.span>
                  ) : (
                    <motion.span key={value ?? "blank"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`font-hand font-bold ${isBlank ? "text-6xl text-amber-400" : "text-5xl text-slate-700"}`}>
                      {isBlank ? "?" : value}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {round.options.map((value) => (
          <motion.button
            key={value}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => choose(value)}
            className={`w-24 h-20 rounded-[28px] border-4 bg-white shadow-lg font-hand text-4xl font-bold transition-all ${
              selected === value ? "border-sky-300 ring-4 ring-sky-100 text-sky-600" : "border-white text-slate-700 hover:border-sky-100"
            }`}
          >
            {value}
          </motion.button>
        ))}
      </div>

      <div className="min-h-20 text-center">
        {feedback === "falsch" && <p className="font-hand text-3xl font-bold text-rose-500">Der Sprung passt noch nicht.</p>}
        {feedback === "richtig" && (
          <div className="flex flex-col items-center gap-4">
            <p className="font-hand text-3xl font-bold text-sky-700">Genau. Der Fluss fließt weiter.</p>
            <button onClick={next} className="px-8 py-3 bg-sky-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg">
              Nächster Fluss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
