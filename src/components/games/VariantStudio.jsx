import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playCoin, playError, playJingle, playPop, playWhoosh } from "../../utils/sounds";

const MotionButton = motion.button;

const countItems = (collections) => collections.reduce((sum, collection) => sum + collection.items.length, 0);

export default function VariantStudio({
  title = "Varianten-Werkstatt",
  intro = "Wähle eine Übungswelt und entdecke immer neue Aufgaben.",
  collections = [],
  onCorrect = () => {},
  onWrong = () => {},
}) {
  const [activeCollectionId, setActiveCollectionId] = useState(collections[0]?.id);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const activeCollection = collections.find((collection) => collection.id === activeCollectionId) || collections[0];
  const challenge = activeCollection?.items[challengeIndex % activeCollection.items.length];
  const total = useMemo(() => countItems(collections), [collections]);

  const selectCollection = (id) => {
    playWhoosh();
    setActiveCollectionId(id);
    setChallengeIndex(0);
    setSelected(null);
    setFeedback(null);
  };

  const choose = (option) => {
    if (!challenge || feedback === "richtig") return;
    setSelected(option);

    if (option === challenge.answer) {
      playCoin();
      setFeedback("richtig");
      onCorrect(4);
      confetti({ particleCount: 90, spread: 90, origin: { y: 0.75 } });
    } else {
      playError();
      setFeedback("falsch");
      onWrong();
      setTimeout(() => {
        setSelected(null);
        setFeedback(null);
      }, 1300);
    }
  };

  const nextChallenge = () => {
    playPop();
    setChallengeIndex((index) => index + 1);
    setSelected(null);
    setFeedback(null);
  };

  const surprise = () => {
    if (!collections.length) return;
    playJingle("start");
    const collectionIndex = Math.floor(Math.random() * collections.length);
    const collection = collections[collectionIndex];
    setActiveCollectionId(collection.id);
    setChallengeIndex(Math.floor(Math.random() * collection.items.length));
    setSelected(null);
    setFeedback(null);
  };

  if (!activeCollection || !challenge) return null;

  return (
    <div className="w-full max-w-6xl mx-auto py-8 flex flex-col gap-8">
      <div className="text-center space-y-3">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">{total} Aufgaben im Pool</p>
        <h2 className="font-hand text-5xl font-bold text-slate-800">{title}</h2>
        <p className="font-hand text-2xl text-slate-500">{intro}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {collections.map((collection) => {
          const active = collection.id === activeCollection.id;
          return (
            <motion.button
              key={collection.id}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => selectCollection(collection.id)}
              className={`min-h-28 rounded-[30px] border-4 p-4 shadow-md flex flex-col items-center justify-center gap-1 transition-all ${
                active ? `${collection.color} text-white border-white ring-4 ring-white` : "bg-white/75 text-slate-600 border-white hover:bg-white"
              }`}
            >
              <span className="text-4xl">{collection.icon}</span>
              <span className="font-hand text-2xl font-bold leading-none">{collection.label}</span>
              <span className={`font-sans text-[10px] uppercase tracking-wide ${active ? "text-white/80" : "text-slate-400"}`}>
                {collection.items.length} Varianten
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="bg-white/65 backdrop-blur-xl rounded-[54px] border-4 border-white shadow-2xl p-6 md:p-8 paper-texture">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-7">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">{activeCollection.label}</p>
            <h3 className="font-hand text-4xl md:text-5xl font-bold text-slate-800 leading-tight">{challenge.prompt}</h3>
          </div>
          <button onClick={surprise} className="px-6 py-3 bg-slate-800 text-white rounded-full font-hand text-2xl font-bold shadow-lg w-fit">
            Zufallskarte
          </button>
        </div>

        {challenge.support && (
          <div className="mb-6 bg-white/70 rounded-[28px] border-2 border-white px-5 py-4">
            <p className="font-hand text-2xl text-slate-500">{challenge.support}</p>
            {challenge.example && <p className="mt-2 font-hand text-2xl font-bold text-slate-700">{challenge.example}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {challenge.options.map((option) => {
            const isSelected = selected === option;
            const isCorrect = option === challenge.answer;
            return (
              <motion.button
                key={option}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => choose(option)}
                className={`min-h-24 rounded-[30px] border-4 px-5 py-4 shadow-lg font-hand text-3xl font-bold transition-all ${
                  isSelected && feedback === "richtig" && isCorrect
                    ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                    : isSelected && feedback === "falsch"
                      ? "bg-rose-100 border-rose-300 text-rose-800"
                      : "bg-white/85 border-white text-slate-700 hover:border-slate-200"
                }`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="min-h-24 flex flex-col items-center gap-4 text-center">
        <AnimatePresence mode="wait">
          {feedback === "falsch" && (
            <motion.p key="wrong" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-hand text-3xl font-bold text-rose-500">
              Noch nicht ganz. Schau noch einmal auf die Spur.
            </motion.p>
          )}
          {feedback === "richtig" && (
            <motion.div key="right" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
              <p className="font-hand text-3xl font-bold text-emerald-600">Genau. Nächste Variante?</p>
              <button onClick={nextChallenge} className="px-8 py-3 bg-emerald-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg">
                Nächste Aufgabe
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
