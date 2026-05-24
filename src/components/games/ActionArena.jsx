import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playCoin, playError, playJingle, playWhoosh } from "../../utils/sounds";

const MotionButton = motion.button;

const ORB_MOTIONS = [
  { x: [0, 18, -10, 0], y: [0, -18, 12, 0], rotate: [0, 5, -4, 0] },
  { x: [0, -16, 12, 0], y: [0, 14, -16, 0], rotate: [0, -6, 5, 0] },
  { x: [0, 12, 22, 0], y: [0, -12, 18, 0], rotate: [0, 4, 8, 0] },
  { x: [0, -20, 8, 0], y: [0, 18, -10, 0], rotate: [0, -5, 4, 0] },
];

const HEARTS = ["♥", "♥", "♥"];

export default function ActionArena({
  title = "Action-Spiel",
  intro = "Fang die richtige Antwort, bevor die Zeit abläuft.",
  collections = [],
  accent = "bg-fuchsia-500",
  onCorrect = () => {},
  onWrong = () => {},
}) {
  const [activeCollectionId, setActiveCollectionId] = useState(collections[0]?.id);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(0);
  const [arenaScore, setArenaScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [roundComplete, setRoundComplete] = useState(false);
  const [fieldSeed, setFieldSeed] = useState(0);

  const activeCollection = collections.find((collection) => collection.id === activeCollectionId) || collections[0];
  const challenges = activeCollection?.items || [];
  const challenge = challenges[challengeIndex % Math.max(1, challenges.length)];
  const totalVariants = useMemo(() => collections.reduce((sum, collection) => sum + collection.items.length, 0), [collections]);

  useEffect(() => {
    if (!running || roundComplete) return undefined;
    const timer = setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          setRoundComplete(true);
          setRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, roundComplete]);

  const resetRound = (start = true) => {
    playJingle(start ? "start" : "calm");
    setRunning(start);
    setTimeLeft(45);
    setHearts(3);
    setCombo(0);
    setArenaScore(0);
    setSelected(null);
    setFeedback(null);
    setRoundComplete(false);
    setFieldSeed((seed) => seed + 1);
  };

  const selectCollection = (id) => {
    playWhoosh();
    setActiveCollectionId(id);
    setChallengeIndex(0);
    setRunning(false);
    setTimeLeft(45);
    setHearts(3);
    setCombo(0);
    setArenaScore(0);
    setSelected(null);
    setFeedback(null);
    setRoundComplete(false);
    setFieldSeed((seed) => seed + 1);
  };

  const nextChallenge = () => {
    setChallengeIndex((index) => (index + 1) % Math.max(1, challenges.length));
    setSelected(null);
    setFeedback(null);
    setFieldSeed((seed) => seed + 1);
  };

  const choose = (option) => {
    if (!running || roundComplete || feedback) return;
    setSelected(option);

    if (option === challenge.answer) {
      const nextCombo = combo + 1;
      const bonus = 8 + Math.min(nextCombo, 8) * 2;
      setCombo(nextCombo);
      setArenaScore((score) => score + bonus);
      setFeedback("richtig");
      if (nextCombo % 4 === 0) playJingle("combo");
      else playCoin();
      onCorrect(2 + Math.min(nextCombo, 4));
      if (nextCombo % 4 === 0) confetti({ particleCount: 80, spread: 85, origin: { y: 0.75 } });
      setTimeout(nextChallenge, 780);
    } else {
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      setCombo(0);
      setFeedback("falsch");
      playError();
      onWrong();
      setTimeout(() => {
        setSelected(null);
        setFeedback(null);
        if (nextHearts <= 0) {
          setRoundComplete(true);
          setRunning(false);
        }
      }, 850);
    }
  };

  if (!activeCollection || !challenge) return null;

  return (
    <div className="w-full max-w-6xl mx-auto py-8 flex flex-col gap-7">
      <div className="text-center space-y-3">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">{totalVariants} Aufgaben im Action-Pool</p>
        <h2 className="font-hand text-5xl font-bold text-slate-800">{title}</h2>
        <p className="font-hand text-2xl text-slate-500">{intro}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {collections.map((collection) => {
          const active = collection.id === activeCollection.id;
          return (
            <motion.button
              key={collection.id}
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => selectCollection(collection.id)}
              className={`px-5 py-3 rounded-full border-2 font-hand text-xl font-bold shadow-md flex items-center gap-2 transition-all ${
                active ? `${collection.color} text-white border-white ring-4 ring-white` : "bg-white/75 text-slate-500 border-white hover:bg-white"
              }`}
            >
              <span>{collection.icon}</span>
              {collection.label}
            </motion.button>
          );
        })}
      </div>

      <div className="bg-white/65 rounded-[56px] border-4 border-white shadow-2xl p-5 md:p-7 overflow-hidden relative paper-texture">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/80 rounded-3xl p-4 border-2 border-white shadow-inner">
            <p className="font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400">Zeit</p>
            <p className="font-hand text-4xl font-bold text-slate-800">{timeLeft}s</p>
          </div>
          <div className="bg-white/80 rounded-3xl p-4 border-2 border-white shadow-inner">
            <p className="font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400">Herzen</p>
            <p className="font-hand text-4xl font-bold text-rose-500">{HEARTS.map((heart, index) => <span key={index} className={index < hearts ? "" : "opacity-20"}>{heart}</span>)}</p>
          </div>
          <div className="bg-white/80 rounded-3xl p-4 border-2 border-white shadow-inner">
            <p className="font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400">Combo</p>
            <p className="font-hand text-4xl font-bold text-orange-500">{combo}x</p>
          </div>
          <div className="bg-white/80 rounded-3xl p-4 border-2 border-white shadow-inner">
            <p className="font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400">Arena</p>
            <p className="font-hand text-4xl font-bold text-emerald-600">{arenaScore}</p>
          </div>
        </div>

        <div className="relative min-h-[430px] rounded-[44px] border-4 border-white bg-gradient-to-br from-white via-slate-50 to-amber-50 shadow-inner overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-50"
            animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(251,191,36,.25), transparent 22%), radial-gradient(circle at 80% 30%, rgba(96,165,250,.22), transparent 24%), radial-gradient(circle at 50% 85%, rgba(244,114,182,.18), transparent 28%)", backgroundSize: "140% 140%" }}
          />

          <div className="relative z-10 p-5 md:p-7">
            <div className="bg-white/80 rounded-[34px] border-4 border-white shadow-lg p-5 mb-7">
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">{activeCollection.label}</p>
              <h3 className="font-hand text-4xl md:text-5xl font-bold text-slate-800 leading-tight">{challenge.prompt}</h3>
              {challenge.support && <p className="font-hand text-2xl text-slate-500 mt-2">{challenge.support}</p>}
              {challenge.example && <p className="font-hand text-2xl font-bold text-slate-700 mt-2">{challenge.example}</p>}
            </div>

            {!running && !roundComplete && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/55 backdrop-blur-sm">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => resetRound(true)}
                  className={`px-10 py-5 ${accent} text-white rounded-full font-hand text-4xl font-bold shadow-2xl border-4 border-white`}
                >
                  Runde starten
                </motion.button>
              </div>
            )}

            {roundComplete && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.86, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[44px] border-4 border-white shadow-2xl p-8 text-center max-w-md">
                  <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">Runde beendet</p>
                  <h3 className="font-hand text-5xl font-bold text-slate-800">{arenaScore} Arena-Punkte</h3>
                  <p className="font-hand text-2xl text-slate-500 mt-2">Starte neu und versuche eine längere Combo.</p>
                  <button onClick={() => resetRound(true)} className={`mt-5 px-8 py-3 ${accent} text-white rounded-full font-hand text-2xl font-bold shadow-lg`}>
                    Nochmal spielen
                  </button>
                </motion.div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 min-h-56 items-center">
              {challenge.options.map((option, index) => {
                const motionPath = ORB_MOTIONS[index % ORB_MOTIONS.length];
                const isSelected = selected === option;
                const correct = option === challenge.answer;
                return (
                  <motion.button
                    key={`${fieldSeed}-${option}`}
                    initial={{ opacity: 0, scale: 0.6, y: 30 }}
                    animate={{
                      opacity: running || roundComplete ? 1 : 0.45,
                      scale: 1,
                      x: motionPath.x,
                      y: motionPath.y,
                      rotate: motionPath.rotate,
                    }}
                    transition={{
                      opacity: { duration: 0.25 },
                      scale: { type: "spring", bounce: 0.45 },
                      x: { duration: 3 + index * 0.4, repeat: Infinity, ease: "easeInOut" },
                      y: { duration: 3.4 + index * 0.35, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 3.2 + index * 0.25, repeat: Infinity, ease: "easeInOut" },
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => choose(option)}
                    className={`min-h-36 rounded-[38px] border-4 shadow-xl p-5 font-hand text-3xl font-bold transition-colors ${
                      isSelected && feedback === "richtig" && correct
                        ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                        : isSelected && feedback === "falsch"
                          ? "bg-rose-100 border-rose-300 text-rose-800"
                          : "bg-white/90 border-white text-slate-700"
                    }`}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {feedback === "richtig" && (
              <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl">
                Treffer! Combo {combo + 1}
              </motion.div>
            )}
            {feedback === "falsch" && (
              <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-rose-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl">
                Fast. Neues Ziel suchen.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
