import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../../utils/sounds";
import { WORLD_WEATHER_ROUNDS } from "../../data/learningContent";

const WEATHER = WORLD_WEATHER_ROUNDS;

export default function WetterAtelier({ onCorrect = () => {}, onWrong = () => {} }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const round = WEATHER[roundIndex];

  const choose = (id) => {
    if (feedback === "richtig") return;
    setPicked(id);
    playPop();
    if (id === round.answer) {
      setFeedback("richtig");
      playSparkle();
      onCorrect(4);
      confetti({ particleCount: 90, spread: 90, origin: { y: 0.72 } });
    } else {
      setFeedback("falsch");
      playError();
      onWrong();
      setTimeout(() => {
        setPicked(null);
        setFeedback(null);
      }, 1200);
    }
  };

  const next = () => {
    playPop();
    setRoundIndex((roundIndex + 1) % WEATHER.length);
    setPicked(null);
    setFeedback(null);
  };

  return (
    <div className="flex flex-col gap-8 py-6">
      <div className="text-center">
        <h3 className="font-hand text-5xl font-bold text-slate-800">Wetter-Atelier</h3>
        <p className="font-hand text-2xl text-slate-500 mt-2">Was passt zu diesem Wetter?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-sky-50 via-white to-amber-50 rounded-[52px] border-4 border-white shadow-2xl p-8 paper-texture flex flex-col items-center justify-center min-h-96">
          <motion.div
            key={round.title}
            initial={{ scale: 0.7, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-9xl mb-5 drop-shadow-md"
          >
            {round.sky}
          </motion.div>
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-sky-600">Heute</p>
          <h4 className="font-hand text-5xl font-bold text-slate-700">{round.title}</h4>
          <p className="font-hand text-2xl text-slate-500 mt-4 text-center">{round.clue}</p>
        </div>

        <div className="bg-white/60 rounded-[52px] border-4 border-white shadow-2xl p-6 flex flex-col gap-4 justify-center">
          {round.options.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.03, x: 4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => choose(option.id)}
              className={`bg-white/85 rounded-[30px] border-4 p-5 shadow-md flex items-center gap-5 text-left transition-all ${
                picked === option.id ? "border-sky-300 ring-4 ring-sky-100" : "border-white hover:border-sky-100"
              }`}
            >
              <span className="text-6xl">{option.icon}</span>
              <span className="font-hand text-3xl font-bold text-slate-700">{option.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="min-h-20 text-center">
        <AnimatePresence mode="wait">
          {feedback === "falsch" && <motion.p key="wrong" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-hand text-3xl font-bold text-rose-500">Das passt heute nicht so gut.</motion.p>}
          {feedback === "richtig" && (
            <motion.div key="right" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
              <p className="font-hand text-3xl font-bold text-sky-700">Gut vorbereitet.</p>
              <button onClick={next} className="px-8 py-3 bg-sky-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg">
                Nächstes Wetter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
