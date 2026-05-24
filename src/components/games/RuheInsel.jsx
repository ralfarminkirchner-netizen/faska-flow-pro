import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../../utils/sounds";

const STEPS = [
  { id: "feet", icon: "🦶", text: "Füße spüren", detail: "Drück beide Füße sanft in den Boden." },
  { id: "breath", icon: "🌬️", text: "Lang ausatmen", detail: "Atme aus, als bewegst du eine Kerze." },
  { id: "look", icon: "👀", text: "Drei Dinge sehen", detail: "Nenne leise drei Dinge im Raum." },
  { id: "hand", icon: "🤲", text: "Hand aufs Herz", detail: "Spür: Ich bin jetzt hier." },
];

export default function RuheInsel({ onCorrect = () => {} }) {
  const [done, setDone] = useState([]);
  const [complete, setComplete] = useState(false);

  const toggle = (id) => {
    if (complete) return;
    playPop();
    setDone((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      if (next.length === STEPS.length) {
        setTimeout(() => {
          setComplete(true);
          playSparkle();
          onCorrect(5);
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.75 } });
        }, 300);
      }
      return next;
    });
  };

  const reset = () => {
    playPop();
    setDone([]);
    setComplete(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8 w-full max-w-5xl mx-auto">
      <div className="text-center">
        <h3 className="font-hand text-5xl font-bold text-slate-800">Ruhe-Insel</h3>
        <p className="font-hand text-2xl text-slate-500 mt-2">Sammle vier ruhige Anker für deinen Körper.</p>
      </div>

      <div className="relative w-full bg-gradient-to-br from-teal-50 via-white to-amber-50 rounded-[60px] border-4 border-white shadow-2xl p-8 paper-texture overflow-hidden">
        <motion.div
          animate={{ scale: complete ? [1, 1.08, 1] : [1, 1.03, 1], opacity: complete ? 0.95 : 0.65 }}
          transition={{ repeat: Infinity, duration: complete ? 3 : 4 }}
          className="absolute left-1/2 top-1/2 w-80 h-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-100/60 blur-3xl"
        />

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5">
          {STEPS.map((step) => {
            const active = done.includes(step.id);
            return (
              <motion.button
                key={step.id}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggle(step.id)}
                className={`min-h-44 rounded-[38px] border-4 p-6 shadow-lg text-left flex items-center gap-5 transition-all ${
                  active ? "bg-teal-50 border-teal-200 ring-4 ring-teal-100" : "bg-white/85 border-white hover:border-teal-100"
                }`}
              >
                <span className="text-6xl">{step.icon}</span>
                <span>
                  <span className="block font-hand text-3xl font-bold text-slate-700">{step.text}</span>
                  <span className="block font-hand text-xl text-slate-500 mt-1">{step.detail}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="min-h-20 text-center">
        <AnimatePresence mode="wait">
          {complete ? (
            <motion.div key="complete" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
              <p className="font-hand text-3xl font-bold text-teal-700">Gut. Dein Körper kennt jetzt vier Anker.</p>
              <button onClick={reset} className="px-8 py-3 bg-teal-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg">
                Noch einmal ruhig werden
              </button>
            </motion.div>
          ) : (
            <motion.p key="count" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-hand text-2xl text-slate-500">
              {done.length} von {STEPS.length} Ankern gesammelt
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
