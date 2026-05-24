import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { playCoin, playError, playJingle, playWhoosh } from "../../utils/sounds";
import PremiumIllustration from "../PremiumIllustration";
import PremiumScene from "../PremiumScene";

const MotionButton = motion.button;
const MotionDiv = motion.div;
const MotionSpan = motion.span;

const MODES = [
  { id: "blitz", label: "Blitzrunde", icon: "⚡", color: "bg-amber-400", prompt: "Schnell denken, ruhig bleiben." },
  { id: "schatz", label: "Schatzpfad", icon: "🗺️", color: "bg-emerald-400", prompt: "Richtige Antworten öffnen den Weg." },
  { id: "wirbel", label: "Wirbel-Sortierer", icon: "🌀", color: "bg-sky-400", prompt: "Fange die Karte ins richtige Fach." },
  { id: "meister", label: "Meisterrunde", icon: "🏆", color: "bg-fuchsia-400", prompt: "Fülle alle Lichter ohne die Ruhe zu verlieren." },
  { id: "expedition", label: "Expedition", icon: "🧭", color: "bg-teal-400", prompt: "Wandere von Station zu Station." },
  { id: "atelier", label: "Atelier", icon: "🎨", color: "bg-rose-400", prompt: "Male die Szene mit richtigen Antworten frei." },
  { id: "puzzle", label: "Puzzle-Garten", icon: "🧩", color: "bg-indigo-400", prompt: "Sammle Teile für ein großes Bild." },
  { id: "sternenlauf", label: "Sternenlauf", icon: "⭐", color: "bg-violet-400", prompt: "Verbinde Sterne mit ruhiger Combo." },
];

const FLOATERS = ["✦", "✧", "●", "◆", "○", "✺", "◇", "✶"];
const HEARTS = ["♥", "♥", "♥"];
const TARGETS = { schatz: 6, expedition: 7, atelier: 6, puzzle: 6, sternenlauf: 8, meister: 5 };

const sceneIllustrations = { language: "language", math: "numbers", world: "world", heart: "harmony", music: "music", default: "hero" };

export default function GameWorld({
  title = "Große Spielwelt",
  collections = [],
  accent = "bg-fuchsia-500",
  scene = "default",
  onCorrect = () => {},
  onWrong = () => {},
}) {
  const shouldReduceMotion = useReducedMotion();
  const [mode, setMode] = useState("blitz");
  const [activeCollectionId, setActiveCollectionId] = useState(collections[0]?.id);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(35);
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [pathStep, setPathStep] = useState(0);
  const [masterLights, setMasterLights] = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);
  const [seed, setSeed] = useState(0);

  const activeMode = MODES.find((item) => item.id === mode) || MODES[0];
  const activeCollection = collections.find((collection) => collection.id === activeCollectionId) || collections[0];
  const challenge = activeCollection?.items[challengeIndex % Math.max(activeCollection.items.length, 1)];
  const isTimed = mode === "blitz" || mode === "sternenlauf";
  const progressTarget = TARGETS[mode] || 0;
  const progressValue = mode === "meister" ? masterLights : pathStep;

  useEffect(() => {
    if (!running || !isTimed || roundComplete) return undefined;
    const timer = setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setRoundComplete(true);
          setRunning(false);
          playJingle("calm");
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimed, roundComplete, running]);

  const resetRound = (start = true, nextMode = mode) => {
    playJingle(start ? "start" : "calm");
    setRunning(start);
    setSeconds(nextMode === "blitz" ? 35 : nextMode === "sternenlauf" ? 45 : 60);
    setHearts(3);
    setCombo(0);
    setScore(0);
    setPathStep(0);
    setMasterLights(0);
    setChallengeIndex(0);
    setSelected(null);
    setFeedback(null);
    setRoundComplete(false);
    setSeed((value) => value + 1);
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    resetRound(false, nextMode);
  };

  const switchCollection = (id) => {
    playWhoosh();
    setActiveCollectionId(id);
    resetRound(false);
  };

  const nextChallenge = () => {
    setChallengeIndex((index) => index + 1);
    setSelected(null);
    setFeedback(null);
    setSeed((value) => value + 1);
  };

  const completeRound = (nextScore) => {
    setScore(nextScore);
    setRoundComplete(true);
    setRunning(false);
    playJingle("levelUp");
    confetti({ particleCount: 140, spread: 100, origin: { y: 0.7 } });
  };

  const choose = (option) => {
    if (!running || roundComplete || feedback || !challenge) return;
    setSelected(option);

    if (option === challenge.answer) {
      const nextCombo = combo + 1;
      const bonus = mode === "meister" ? 12 : mode === "blitz" ? 10 : 8;
      const nextScore = score + bonus + Math.min(nextCombo, 8);
      const progressMode = ["schatz", "expedition", "atelier", "puzzle", "sternenlauf"].includes(mode);
      const nextPathStep = progressMode ? pathStep + 1 : pathStep;
      const nextMasterLights = mode === "meister" ? masterLights + 1 : masterLights;

      setCombo(nextCombo);
      setScore(nextScore);
      setFeedback("richtig");
      if (nextCombo % 3 === 0) playJingle("combo");
      else playCoin();
      onCorrect(2 + Math.min(nextCombo, 5));

      if (mode === "schatz") setPathStep(nextPathStep);
      if (mode === "meister") setMasterLights(nextMasterLights);

      const shouldComplete =
        (progressMode && nextPathStep >= (TARGETS[mode] || 6)) ||
        (mode === "meister" && nextMasterLights >= TARGETS.meister);

      if (shouldComplete) {
        setTimeout(() => completeRound(nextScore), 620);
      } else {
        setTimeout(nextChallenge, mode === "wirbel" ? 520 : 720);
      }
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
          playJingle("try");
        } else if (mode === "blitz" || mode === "wirbel") {
          nextChallenge();
        }
      }, 760);
    }
  };

  if (!activeCollection || !challenge) return null;

  return (
    <div className="w-full max-w-6xl mx-auto py-8 flex flex-col gap-7">
      <div className="text-center space-y-2">
        <h2 className="font-hand text-5xl md:text-6xl font-bold text-slate-800">{title}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-stretch">
        <PremiumScene scene={scene} mode={mode} />
        <div className="bg-white/65 border-4 border-white rounded-[38px] shadow-xl p-5 flex flex-col items-center justify-center text-center overflow-hidden">
          <PremiumIllustration variant={sceneIllustrations[scene] || "hero"} size={210} title={`${title} Illustration`} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {MODES.map((item) => {
          const active = item.id === mode;
          return (
            <MotionButton
              key={item.id}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => switchMode(item.id)}
              className={`min-h-28 rounded-[30px] border-4 p-4 shadow-md text-left transition-all ${
                active ? `${item.color} text-white border-white ring-4 ring-white` : "bg-white/75 text-slate-600 border-white hover:bg-white"
              }`}
            >
              <span className="text-4xl">{item.icon}</span>
              <span className="block font-hand text-3xl font-bold leading-none mt-1">{item.label}</span>
              <span className="sr-only">{item.prompt}</span>
            </MotionButton>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {collections.map((collection) => {
          const active = collection.id === activeCollection.id;
          return (
            <MotionButton
              key={collection.id}
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => switchCollection(collection.id)}
              className={`px-5 py-3 rounded-full border-2 font-hand text-xl font-bold shadow-md flex items-center gap-2 transition-all ${
                active ? `${collection.color} text-white border-white ring-4 ring-white` : "bg-white/75 text-slate-500 border-white hover:bg-white"
              }`}
            >
              <span>{collection.icon}</span>
              {collection.label}
            </MotionButton>
          );
        })}
      </div>

      <div className="bg-white/65 rounded-[56px] border-4 border-white shadow-2xl p-5 md:p-7 overflow-hidden relative paper-texture">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Stat label={isTimed ? "Zeit" : "Runde"} value={isTimed ? `${seconds}s` : activeMode.label} color="text-slate-800" />
          <Stat label="Herzen" value={HEARTS.map((heart, index) => <span key={index} className={index < hearts ? "" : "opacity-20"}>{heart}</span>)} color="text-rose-500" />
          <Stat label="Combo" value={`${combo}x`} color="text-orange-500" />
          <Stat label="Punkte" value={score} color="text-emerald-600" />
        </div>

        <div className="relative min-h-[560px] rounded-[44px] border-4 border-white bg-gradient-to-br from-white via-amber-50 to-sky-50 shadow-inner overflow-hidden">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage: "radial-gradient(circle at 18% 20%, rgba(251,191,36,.26), transparent 20%), radial-gradient(circle at 85% 25%, rgba(14,165,233,.18), transparent 24%), radial-gradient(circle at 45% 85%, rgba(217,70,239,.16), transparent 26%)",
              backgroundSize: "100% 100%",
            }}
          />

          {FLOATERS.map((item, index) => (
            <MotionSpan
              key={`${seed}-${item}-${index}`}
              className="absolute text-2xl md:text-3xl text-white/70 drop-shadow-sm pointer-events-none"
              style={{ left: `${10 + index * 11}%`, top: `${12 + (index % 4) * 18}%` }}
              animate={shouldReduceMotion ? { y: 0, rotate: 0, scale: 1 } : { y: [0, -18, 12, 0], rotate: [0, 15, -10, 0], scale: [1, 1.18, 0.94, 1] }}
              transition={{ duration: 4 + index * 0.35, repeat: shouldReduceMotion ? 0 : 1, ease: "easeInOut" }}
            >
              {item}
            </MotionSpan>
          ))}

          {!running && !roundComplete && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/55 backdrop-blur-sm">
              <MotionButton
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => resetRound(true)}
                className={`px-10 py-5 ${accent} text-white rounded-full font-hand text-4xl font-bold shadow-2xl border-4 border-white`}
              >
                Spiel starten
              </MotionButton>
            </div>
          )}

          {roundComplete && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/72 backdrop-blur-sm">
              <MotionDiv initial={{ scale: 0.86, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[44px] border-4 border-white shadow-2xl p-8 text-center max-w-md">
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">Spiel beendet</p>
                <h3 className="font-hand text-5xl font-bold text-slate-800">{score} Punkte</h3>
                <p className="font-hand text-2xl text-slate-500 mt-2">Wähle einen Modus oder starte eine neue Runde.</p>
                <button onClick={() => resetRound(true)} className={`mt-5 px-8 py-3 ${accent} text-white rounded-full font-hand text-2xl font-bold shadow-lg`}>
                  Neue Runde
                </button>
              </MotionDiv>
            </div>
          )}

          <div className="relative z-10 p-5 md:p-7 flex flex-col gap-6">
            {mode === "schatz" && <TreasurePath step={pathStep} />}
            {mode === "meister" && <MasterLights count={masterLights} />}
            {mode === "expedition" && <ExpeditionMap step={pathStep} target={TARGETS.expedition} />}
            {mode === "atelier" && <AtelierCanvas marks={pathStep} target={TARGETS.atelier} scene={scene} />}
            {mode === "puzzle" && <PuzzleBoard pieces={pathStep} target={TARGETS.puzzle} scene={scene} />}
            {mode === "sternenlauf" && <StarRun step={pathStep} target={TARGETS.sternenlauf} />}
            {progressTarget > 0 && mode !== "meister" && mode !== "schatz" && (
              <div className="bg-white/65 border-2 border-white rounded-[28px] px-5 py-3 shadow-inner flex items-center justify-between">
                <p className="font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400">Fortschritt</p>
                <p className="font-hand text-3xl font-bold text-slate-700">{Math.min(progressValue, progressTarget)}/{progressTarget}</p>
              </div>
            )}

            <MotionDiv
              key={`${seed}-prompt`}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.35 }}
              className={`bg-white/85 rounded-[34px] border-4 border-white shadow-lg p-5 ${mode === "wirbel" ? "rotate-[-1deg]" : ""}`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">{activeCollection.label}</p>
                  <h3 className="font-hand text-4xl md:text-5xl font-bold text-slate-800 leading-tight">{challenge.prompt}</h3>
                  {challenge.support && <p className="font-hand text-2xl text-slate-500 mt-2">{challenge.support}</p>}
                  {challenge.example && <p className="font-hand text-2xl font-bold text-slate-700 mt-2">{challenge.example}</p>}
                </div>
                <div className="text-5xl">{activeMode.icon}</div>
              </div>
            </MotionDiv>

            <div className={mode === "wirbel" ? "grid grid-cols-1 md:grid-cols-2 gap-4 min-h-64" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 min-h-56 items-center"}>
              {challenge.options.map((option, index) => {
                const isSelected = selected === option;
                const isCorrect = option === challenge.answer;
                const baseDelay = mode === "wirbel" ? index * 0.05 : index * 0.08;
                return (
                  <MotionButton
                    key={`${seed}-${option}-${index}`}
                    initial={{ opacity: 0, y: mode === "wirbel" ? -70 : 28, rotate: mode === "wirbel" ? -8 + index * 4 : 0, scale: 0.82 }}
                    animate={{
                      opacity: running || roundComplete ? 1 : 0.45,
                      y: mode === "wirbel" && !shouldReduceMotion ? [0, 10, -8, 0] : 0,
                      rotate: mode === "wirbel" && !shouldReduceMotion ? [-1, 2, -2, -1] : 0,
                      scale: 1,
                    }}
                    transition={{
                      opacity: { duration: 0.2, delay: baseDelay },
                      scale: { type: "spring", bounce: 0.45, delay: baseDelay },
                      y: mode === "wirbel" && !shouldReduceMotion ? { duration: 2.4 + index * 0.25, repeat: 2, ease: "easeInOut" } : { duration: 0.25 },
                      rotate: mode === "wirbel" && !shouldReduceMotion ? { duration: 2.6 + index * 0.2, repeat: 2, ease: "easeInOut" } : { duration: 0.2 },
                    }}
                    whileHover={{ scale: 1.08, y: -4 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => choose(option)}
                    className={`min-h-32 rounded-[34px] border-4 shadow-xl p-5 font-hand text-3xl font-bold transition-colors ${
                      isSelected && feedback === "richtig" && isCorrect
                        ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                        : isSelected && feedback === "falsch"
                          ? "bg-rose-100 border-rose-300 text-rose-800"
                          : mode === "wirbel"
                            ? "bg-white/90 border-sky-100 text-slate-700"
                            : "bg-white/90 border-white text-slate-700"
                    }`}
                  >
                    {mode === "wirbel" && <span className="block font-sans text-[10px] uppercase tracking-widest text-slate-400 mb-1">Fach {index + 1}</span>}
                    {option}
                  </MotionButton>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {feedback === "richtig" && (
              <MotionDiv initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl">
                Treffer! Combo {combo + 1}
              </MotionDiv>
            )}
            {feedback === "falsch" && (
              <MotionDiv initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-rose-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl">
                Fast. Neuer Versuch.
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="bg-white/80 rounded-3xl p-4 border-2 border-white shadow-inner">
      <p className="font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400">{label}</p>
      <p className={`font-hand text-3xl md:text-4xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function TreasurePath({ step }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="bg-white/65 border-2 border-white rounded-[30px] p-4 shadow-inner">
      <div className="grid grid-cols-7 gap-2 items-center">
        {Array.from({ length: 7 }, (_, index) => {
          const active = index <= step;
          return (
            <MotionDiv
              key={index}
              animate={{ scale: active ? 1.08 : 1, y: active && index === step && !shouldReduceMotion ? [0, -6, 0] : 0 }}
              transition={{ duration: 0.7, repeat: active && index === step && !shouldReduceMotion ? 2 : 0 }}
              className={`h-14 rounded-2xl border-2 flex items-center justify-center font-hand text-2xl font-bold ${
                active ? "bg-amber-300 border-amber-100 text-white shadow-lg" : "bg-white/70 border-white text-slate-300"
              }`}
            >
              {index === 6 ? "★" : index + 1}
            </MotionDiv>
          );
        })}
      </div>
    </div>
  );
}

function MasterLights({ count }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="flex justify-center gap-3 bg-white/65 border-2 border-white rounded-[30px] p-4 shadow-inner">
      {Array.from({ length: 5 }, (_, index) => {
        const active = index < count;
        return (
          <MotionDiv
            key={index}
            animate={{ scale: active && !shouldReduceMotion ? [1, 1.2, 1] : 1, opacity: active ? 1 : 0.35 }}
            transition={{ duration: 0.8, repeat: active && !shouldReduceMotion ? 1 : 0 }}
            className={`w-14 h-14 rounded-full border-4 ${active ? "bg-fuchsia-400 border-white shadow-[0_0_28px_rgba(217,70,239,.55)]" : "bg-white border-slate-100"}`}
          />
        );
      })}
    </div>
  );
}

function ExpeditionMap({ step, target }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="bg-white/65 border-2 border-white rounded-[32px] p-4 shadow-inner overflow-hidden">
      <div className="relative h-28">
        <svg viewBox="0 0 780 120" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden>
          <path d="M28 78 C122 26 168 98 244 55 C320 12 382 104 456 60 C538 12 584 98 742 38" fill="none" stroke="rgba(255,255,255,.92)" strokeWidth="18" strokeLinecap="round" />
          <path d="M28 78 C122 26 168 98 244 55 C320 12 382 104 456 60 C538 12 584 98 742 38" fill="none" stroke="#14b8a6" strokeWidth="4" strokeDasharray="12 14" strokeLinecap="round" opacity=".55" />
        </svg>
        {Array.from({ length: target }, (_, index) => {
          const left = 5 + (index / Math.max(1, target - 1)) * 88;
          const active = index < step;
          return (
            <MotionDiv
              key={index}
              className={`absolute top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center font-hand text-2xl font-bold ${active ? "bg-teal-400 text-white" : "bg-white/80 text-slate-300"}`}
              style={{ left: `${left}%` }}
              animate={{ y: active && index === step - 1 && !shouldReduceMotion ? [0, -9, 0] : 0, rotate: active && !shouldReduceMotion ? [-2, 3, -2] : 0 }}
              transition={{ duration: 1.2, repeat: active && index === step - 1 && !shouldReduceMotion ? 2 : 0 }}
            >
              {index === target - 1 ? "🏁" : index + 1}
            </MotionDiv>
          );
        })}
      </div>
    </div>
  );
}

function AtelierCanvas({ marks, target, scene }) {
  const shouldReduceMotion = useReducedMotion();
  const palette = {
    language: ["#f97316", "#facc15", "#fb923c", "#fbbf24", "#fdba74", "#fef3c7"],
    math: ["#0ea5e9", "#60a5fa", "#2563eb", "#93c5fd", "#38bdf8", "#dbeafe"],
    world: ["#10b981", "#22c55e", "#84cc16", "#a7f3d0", "#34d399", "#ecfccb"],
    heart: ["#ec4899", "#d946ef", "#f9a8d4", "#c084fc", "#f0abfc", "#fce7f3"],
    music: ["#d946ef", "#fb7185", "#f472b6", "#fda4af", "#c084fc", "#ffe4e6"],
    default: ["#8b5cf6", "#38bdf8", "#f59e0b", "#34d399", "#f472b6", "#ddd6fe"],
  }[scene] || ["#8b5cf6", "#38bdf8", "#f59e0b", "#34d399", "#f472b6", "#ddd6fe"];

  return (
    <div className="bg-white/65 border-2 border-white rounded-[32px] p-4 shadow-inner">
      <div className="relative h-36 rounded-[28px] bg-white/75 border-4 border-white overflow-hidden">
        {Array.from({ length: target }, (_, index) => {
          const active = index < marks;
          return (
            <MotionDiv
              key={index}
              className="absolute rounded-full blur-[1px]"
              style={{
                width: `${80 + index * 11}px`,
                height: `${42 + (index % 3) * 18}px`,
                left: `${8 + (index % 3) * 27}%`,
                top: `${12 + Math.floor(index / 3) * 34}%`,
                backgroundColor: palette[index % palette.length],
                opacity: active ? 0.82 : 0.1,
              }}
              animate={active && !shouldReduceMotion ? { scale: [0.92, 1.08, 1], rotate: [-3, 4, -2] } : { scale: 1 }}
              transition={{ duration: 1.6, repeat: active && index === marks - 1 && !shouldReduceMotion ? 1 : 0 }}
            />
          );
        })}
        <div className="absolute inset-x-5 bottom-4 flex justify-between">
          {palette.slice(0, 5).map((color, index) => (
            <span key={color} className="w-10 h-10 rounded-full border-4 border-white shadow-md" style={{ backgroundColor: color, opacity: index < marks ? 1 : 0.28 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PuzzleBoard({ pieces, target, scene }) {
  const shouldReduceMotion = useReducedMotion();
  const tone = {
    language: "from-orange-100 to-amber-200",
    math: "from-sky-100 to-blue-200",
    world: "from-emerald-100 to-lime-200",
    heart: "from-pink-100 to-fuchsia-200",
    music: "from-rose-100 to-purple-200",
    default: "from-violet-100 to-sky-200",
  }[scene] || "from-violet-100 to-sky-200";

  return (
    <div className="bg-white/65 border-2 border-white rounded-[32px] p-4 shadow-inner">
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: target }, (_, index) => {
          const active = index < pieces;
          return (
            <MotionDiv
              key={index}
              className={`h-20 rounded-[22px] border-4 border-white shadow-md bg-gradient-to-br ${tone} flex items-center justify-center font-hand text-3xl font-bold ${active ? "text-slate-700" : "text-slate-300 grayscale opacity-40"}`}
              animate={active && !shouldReduceMotion ? { y: [0, -6, 0], rotate: [0, index % 2 ? 3 : -3, 0] } : { y: 0 }}
              transition={{ duration: 1.4, repeat: active && index === pieces - 1 && !shouldReduceMotion ? 1 : 0 }}
            >
              {active ? "✦" : "?"}
            </MotionDiv>
          );
        })}
      </div>
    </div>
  );
}

function StarRun({ step, target }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="bg-white/65 border-2 border-white rounded-[32px] p-4 shadow-inner">
      <div className="flex flex-wrap justify-center gap-3">
        {Array.from({ length: target }, (_, index) => {
          const active = index < step;
          return (
            <MotionDiv
              key={index}
              className={`w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center text-2xl ${active ? "bg-amber-300" : "bg-white/70 grayscale opacity-40"}`}
              animate={active && !shouldReduceMotion ? { scale: [1, 1.22, 1], rotate: [0, 16, -8, 0] } : { scale: 1 }}
              transition={{ duration: 1.15, repeat: active && index === step - 1 && !shouldReduceMotion ? 2 : 0 }}
            >
              ⭐
            </MotionDiv>
          );
        })}
      </div>
    </div>
  );
}
