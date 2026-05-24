import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../../utils/sounds";
import { WORLD_SEASON_CARDS } from "../../data/learningContent";

const SEASONS = {
  fruehling: { label: "Frühling", icon: "🌷", color: "bg-pink-100 border-pink-200 text-pink-700" },
  sommer: { label: "Sommer", icon: "☀️", color: "bg-yellow-100 border-yellow-200 text-yellow-700" },
  herbst: { label: "Herbst", icon: "🍂", color: "bg-orange-100 border-orange-200 text-orange-700" },
  winter: { label: "Winter", icon: "❄️", color: "bg-sky-100 border-sky-200 text-sky-700" },
};

const CARDS = WORLD_SEASON_CARDS;

export default function Jahreskreis({ onCorrect = () => {}, onWrong = () => {} }) {
  const [cardIndex, setCardIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const card = CARDS[cardIndex];

  const choose = (season) => {
    if (feedback === "richtig") return;
    setPicked(season);
    playPop();
    if (season === card.answer) {
      setFeedback("richtig");
      playSparkle();
      onCorrect(4);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.72 } });
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
    setCardIndex((cardIndex + 1) % CARDS.length);
    setPicked(null);
    setFeedback(null);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <div className="text-center">
        <h3 className="font-hand text-5xl font-bold text-slate-800">Jahreskreis</h3>
        <p className="font-hand text-2xl text-slate-500 mt-2">Welche Jahreszeit passt zu diesem Bild?</p>
      </div>

      <div className="w-full max-w-4xl bg-white/60 rounded-[56px] border-4 border-white shadow-2xl p-8 paper-texture">
        <motion.div
          key={card.id}
          initial={{ scale: 0.85, rotate: -2, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          className="bg-gradient-to-br from-white to-amber-50 rounded-[44px] border-4 border-white shadow-inner min-h-72 flex flex-col items-center justify-center text-center p-8"
        >
          <span className="text-9xl drop-shadow-md mb-5">{card.icon}</span>
          <h4 className="font-hand text-5xl font-bold text-slate-700">{card.title}</h4>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
        {Object.entries(SEASONS).map(([id, season]) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => choose(id)}
            className={`rounded-[34px] border-4 p-5 shadow-lg flex flex-col items-center gap-2 transition-all ${season.color} ${
              picked === id ? "ring-4 ring-white scale-105" : "hover:bg-white"
            }`}
          >
            <span className="text-6xl">{season.icon}</span>
            <span className="font-hand text-3xl font-bold">{season.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="min-h-20 text-center">
        {feedback === "falsch" && <p className="font-hand text-3xl font-bold text-rose-500">Schau auf Temperatur, Pflanzen und Licht.</p>}
        {feedback === "richtig" && (
          <div className="flex flex-col items-center gap-4">
            <p className="font-hand text-3xl font-bold text-emerald-600">Ja, das passt in den {SEASONS[card.answer].label}.</p>
            <button onClick={next} className="px-8 py-3 bg-emerald-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg">
              Weiter im Kreis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
