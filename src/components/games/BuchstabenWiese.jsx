import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../../utils/sounds";
import { DEUTSCH_CONTENT } from "../../data/learningContent";

const ROUNDS = DEUTSCH_CONTENT.letterRounds;

export default function BuchstabenWiese({ onCorrect = () => {}, onWrong = () => {} }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const round = ROUNDS[roundIndex];

  const choose = (id) => {
    if (feedback === "richtig") return;
    setPicked(id);
    playPop();

    if (id === round.answer) {
      setFeedback("richtig");
      playSparkle();
      onCorrect(4);
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.7 } });
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
    setRoundIndex((roundIndex + 1) % ROUNDS.length);
    setPicked(null);
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 flex flex-col gap-8 items-center">
      <div className="text-center">
        <h2 className="font-hand text-5xl font-bold text-slate-800">Buchstaben-Wiese</h2>
        <p className="font-hand text-2xl text-slate-500 mt-2">Hör den Anfangslaut und finde das passende Bild.</p>
      </div>

      <div className="w-full bg-lime-50/70 rounded-[54px] border-4 border-white shadow-2xl p-8 paper-texture">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <motion.div
            key={round.letter}
            initial={{ rotate: -8, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            className="w-44 h-44 bg-white/90 rounded-[44px] border-4 border-lime-200 shadow-xl flex flex-col items-center justify-center"
          >
            <span className="font-hand text-8xl font-bold text-lime-700">{round.letter}</span>
            <span className="font-hand text-2xl text-lime-600">{round.sound}</span>
          </motion.div>
          <div className="text-center md:text-left max-w-xl">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-lime-700">Lauschfrage</p>
            <p className="font-hand text-4xl font-bold text-slate-700 leading-tight">
              Welches Wort beginnt mit {round.letter}?
            </p>
            <p className="font-hand text-2xl text-slate-500 mt-3">Sprich die Wörter langsam. Der erste Klang hilft dir.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {round.options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => choose(option.id)}
            className={`bg-white/85 rounded-[34px] border-4 p-5 shadow-lg flex flex-col items-center gap-3 transition-all ${
              picked === option.id ? "border-lime-300 ring-4 ring-lime-100" : "border-white hover:border-lime-100"
            }`}
          >
            <span className="text-6xl md:text-7xl">{option.icon}</span>
            <span className="font-hand text-3xl font-bold text-slate-700">{option.word}</span>
          </motion.button>
        ))}
      </div>

      <div className="min-h-20 text-center">
        <AnimatePresence mode="wait">
          {feedback === "falsch" && (
            <motion.p key="wrong" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-hand text-3xl font-bold text-rose-500">
              Fast. Hör noch einmal auf den ersten Laut.
            </motion.p>
          )}
          {feedback === "richtig" && (
            <motion.div key="right" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
              <p className="font-hand text-3xl font-bold text-lime-700">Ja. Du hast den Anfang gehört.</p>
              <button onClick={next} className="px-8 py-3 bg-lime-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg">
                Nächster Laut
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
