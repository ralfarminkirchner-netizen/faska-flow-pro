import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { RotateCw, Sparkles, Star, Trophy } from "lucide-react";
import { playCoin, playError, playJingle, playPop, playWhoosh } from "../../utils/sounds";
import { QUEST_MIXER_MODES } from "./questMixerConfig";

const MotionButton = motion.button;
const MotionDiv = motion.div;

const EMPTY_COLLECTION = { id: "empty", label: "Keine Sammlung", icon: "✦", color: "bg-slate-400", items: [] };
const HEARTS = ["♥", "♥", "♥"];
const TRAIL = ["Basis", "Pfad", "Brücke", "Lichtung", "Gipfel", "Fund", "Ziel"];

const normalizeCollections = (collections) =>
  collections
    .map((collection) => ({
      ...collection,
      items: Array.isArray(collection.items)
        ? collection.items.filter((item) => item?.prompt && item?.answer && Array.isArray(item.options))
        : [],
    }))
    .filter((collection) => collection.items.length > 0);

const makeQuestionDeck = (collections, activeCollectionId, seed) => {
  const activeCollection = collections.find((collection) => collection.id === activeCollectionId) || collections[0] || EMPTY_COLLECTION;
  const sourceItems = activeCollection.items.length ? activeCollection.items : collections.flatMap((collection) => collection.items);

  return sourceItems.map((item, index) => ({
    ...item,
    deckId: `${activeCollection.id}-${seed}-${index}`,
    collectionId: activeCollection.id,
    collectionLabel: activeCollection.label,
  }));
};

export default function QuestMixer({
  title = "Abenteuer-Mixer",
  collections = [],
  modes = QUEST_MIXER_MODES,
  initialMode = "expedition",
  accent = "bg-slate-900",
  roundHearts = 3,
  onCorrect = () => {},
  onWrong = () => {},
  onComplete = () => {},
}) {
  const shouldReduceMotion = useReducedMotion();
  const playableCollections = useMemo(() => normalizeCollections(collections), [collections]);
  const availableModes = modes.length ? modes : QUEST_MIXER_MODES;
  const [activeModeId, setActiveModeId] = useState(availableModes.some((mode) => mode.id === initialMode) ? initialMode : availableModes[0].id);
  const [activeCollectionId, setActiveCollectionId] = useState(playableCollections[0]?.id);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(roundHearts);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const [seed, setSeed] = useState(1);

  const activeMode = availableModes.find((mode) => mode.id === activeModeId) || availableModes[0];
  const activeCollection = playableCollections.find((collection) => collection.id === activeCollectionId) || playableCollections[0] || EMPTY_COLLECTION;
  const deck = useMemo(() => makeQuestionDeck(playableCollections, activeCollection.id, seed), [activeCollection.id, playableCollections, seed]);
  const challenge = deck[questionIndex % Math.max(deck.length, 1)];
  const modeTarget = activeMode.target || 6;
  const completionRatio = Math.min(progress / modeTarget, 1);

  const resetRound = (nextModeId = activeModeId, nextCollectionId = activeCollection.id) => {
    const nextCollection = playableCollections.find((collection) => collection.id === nextCollectionId) || playableCollections[0];
    playJingle("start");
    setActiveModeId(nextModeId);
    setActiveCollectionId(nextCollection?.id);
    setQuestionIndex(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setStreak(0);
    setHearts(roundHearts);
    setProgress(0);
    setFinished(false);
    setSeed((value) => value + 1);
  };

  const switchMode = (modeId) => {
    if (modeId === activeModeId) return;
    playWhoosh();
    resetRound(modeId, activeCollection.id);
  };

  const switchCollection = (collectionId) => {
    if (collectionId === activeCollection.id) return;
    playPop();
    resetRound(activeModeId, collectionId);
  };

  const completeRound = (nextScore, nextProgress) => {
    setFinished(true);
    setScore(nextScore);
    setProgress(nextProgress);
    playJingle("levelUp");
    onComplete({ mode: activeMode.id, collection: activeCollection.id, score: nextScore, progress: nextProgress });
    confetti({ particleCount: 130, spread: 100, origin: { y: 0.72 } });
  };

  const nextQuestion = () => {
    setQuestionIndex((index) => index + 1);
    setSelected(null);
    setFeedback(null);
    setSeed((value) => value + 1);
  };

  const choose = (option) => {
    if (!challenge || feedback || finished) return;

    setSelected(option);
    if (option === challenge.answer) {
      const nextStreak = streak + 1;
      const nextProgress = progress + 1;
      const nextScore = score + 10 + Math.min(nextStreak, 5) * 3;
      setFeedback("richtig");
      setStreak(nextStreak);
      setScore(nextScore);
      setProgress(nextProgress);
      onCorrect(3 + Math.min(nextStreak, 4));
      if (nextStreak % 3 === 0) playJingle("combo");
      else playCoin();

      if (nextProgress >= modeTarget) {
        setTimeout(() => completeRound(nextScore, nextProgress), 560);
      } else {
        setTimeout(nextQuestion, activeMode.id === "kartenwirbel" ? 500 : 700);
      }
      return;
    }

    const nextHearts = hearts - 1;
    setFeedback("falsch");
    setStreak(0);
    setHearts(nextHearts);
    playError();
    onWrong();

    setTimeout(() => {
      setSelected(null);
      setFeedback(null);
      if (nextHearts <= 0) {
        setFinished(true);
        playJingle("try");
      } else if (activeMode.id === "kartenwirbel") {
        nextQuestion();
      }
    }, 780);
  };

  if (!playableCollections.length || !challenge) {
    return (
      <div className="w-full max-w-5xl mx-auto py-8">
        <div className="bg-white/75 border-4 border-white rounded-[38px] shadow-xl p-8 text-center paper-texture">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">Abenteuer-Mixer</p>
          <h2 className="font-hand text-5xl font-bold text-slate-800">Noch keine spielbaren Aufgaben</h2>
          <p className="font-hand text-2xl text-slate-500 mt-2">Übergebe Collections mit `items`, `prompt`, `answer` und `options`.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 flex flex-col gap-7">
      <div className="text-center space-y-2">
        <h2 className="font-hand text-5xl md:text-6xl font-bold text-slate-800">{title}</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {availableModes.map((mode) => {
          const ModeIcon = mode.icon || Sparkles;
          const active = mode.id === activeMode.id;
          return (
            <MotionButton
              key={mode.id}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => switchMode(mode.id)}
              className={`min-h-28 rounded-[28px] border-4 p-4 shadow-md text-left transition-all ${
                active ? `${mode.color} text-white border-white ring-4 ring-white` : "bg-white/75 text-slate-600 border-white hover:bg-white"
              }`}
            >
              <ModeIcon size={32} strokeWidth={2.5} />
              <span className="block font-hand text-3xl font-bold leading-none mt-2">{mode.label}</span>
              <span className="sr-only">{mode.description}</span>
            </MotionButton>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {playableCollections.map((collection) => {
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

      <div className="bg-white/65 rounded-[48px] border-4 border-white shadow-2xl p-5 md:p-7 overflow-hidden relative paper-texture">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <QuestStat label="Fortschritt" value={`${progress}/${modeTarget}`} color="text-slate-800" />
          <QuestStat label="Herzen" value={HEARTS.map((heart, index) => <span key={index} className={index < hearts ? "" : "opacity-20"}>{heart}</span>)} color="text-rose-500" />
          <QuestStat label="Serie" value={`${streak}x`} color="text-orange-500" />
          <QuestStat label="Punkte" value={score} color="text-emerald-600" />
        </div>

        <div className="relative min-h-[530px] rounded-[38px] border-4 border-white bg-gradient-to-br from-white via-lime-50 to-sky-50 shadow-inner overflow-hidden">
          <div
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage:
                "linear-gradient(120deg, rgba(255,255,255,.6), transparent 36%), radial-gradient(circle at 16% 22%, rgba(16,185,129,.18), transparent 20%), radial-gradient(circle at 88% 28%, rgba(14,165,233,.2), transparent 25%), radial-gradient(circle at 48% 88%, rgba(244,114,182,.16), transparent 24%)",
              backgroundSize: "100% 100%",
            }}
          />

          <div className="relative z-10 p-5 md:p-7 flex flex-col gap-6">
            <ModeProgress modeId={activeMode.id} progress={progress} target={modeTarget} ratio={completionRatio} />

            <MotionDiv
              key={`${seed}-${challenge.deckId}-prompt`}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.35 }}
              className="bg-white/88 rounded-[32px] border-4 border-white shadow-lg p-5"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">
                    {activeMode.label} · {activeCollection.label}
                  </p>
                  <h3 className="font-hand text-4xl md:text-5xl font-bold text-slate-800 leading-tight">{challenge.prompt}</h3>
                  {challenge.support && <p className="font-hand text-2xl text-slate-500 mt-2">{challenge.support}</p>}
                  {challenge.example && <p className="font-hand text-2xl font-bold text-slate-700 mt-2">{challenge.example}</p>}
                </div>
                <div className={`${activeMode.color} text-white rounded-3xl p-4 shadow-lg border-4 border-white`}>
                  <Trophy size={38} />
                </div>
              </div>
            </MotionDiv>

            <AnswerStage modeId={activeMode.id} options={challenge.options} selected={selected} feedback={feedback} answer={challenge.answer} seed={seed} onChoose={choose} shouldReduceMotion={shouldReduceMotion} />
          </div>

          <AnimatePresence>
            {feedback === "richtig" && (
              <MotionDiv initial={{ opacity: 0, scale: 0.84, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl z-20">
                Treffer! Serie {streak + 1}
              </MotionDiv>
            )}
            {feedback === "falsch" && (
              <MotionDiv initial={{ opacity: 0, scale: 0.84, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-rose-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl z-20">
                Noch einmal genau schauen.
              </MotionDiv>
            )}
          </AnimatePresence>

          {finished && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/74 backdrop-blur-sm p-5">
              <MotionDiv initial={{ scale: 0.86, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[38px] border-4 border-white shadow-2xl p-8 text-center max-w-md">
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">{activeMode.label} beendet</p>
                <h3 className="font-hand text-5xl font-bold text-slate-800">{score} Punkte</h3>
                <p className="font-hand text-2xl text-slate-500 mt-2">{progress >= modeTarget ? "Die Runde ist vollständig." : "Starte neu und sammle die fehlenden Stationen."}</p>
                <button onClick={() => resetRound()} className={`mt-5 px-8 py-3 ${accent} text-white rounded-full font-hand text-2xl font-bold shadow-lg`}>
                  Neue Runde
                </button>
              </MotionDiv>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestStat({ label, value, color }) {
  return (
    <div className="bg-white/80 rounded-3xl p-4 border-2 border-white shadow-inner">
      <p className="font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400">{label}</p>
      <p className={`font-hand text-3xl md:text-4xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function ModeProgress({ modeId, progress, target, ratio }) {
  if (modeId === "expedition") return <ExpeditionProgress progress={progress} />;
  if (modeId === "puzzle") return <PuzzleProgress progress={progress} target={target} />;
  if (modeId === "sternenlauf") return <StarRunProgress progress={progress} target={target} />;
  return <WhirlProgress ratio={ratio} progress={progress} target={target} />;
}

function ExpeditionProgress({ progress }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="bg-white/70 border-2 border-white rounded-[30px] p-4 shadow-inner">
      <div className="grid grid-cols-7 gap-2">
        {TRAIL.map((label, index) => {
          const active = index <= progress;
          return (
            <MotionDiv
              key={label}
              animate={{ y: active && index === progress && !shouldReduceMotion ? [0, -7, 0] : 0, scale: active ? 1.04 : 1 }}
              transition={{ duration: 0.8, repeat: active && index === progress && !shouldReduceMotion ? 2 : 0 }}
              className={`min-h-14 rounded-2xl border-2 flex flex-col items-center justify-center px-2 ${
                active ? "bg-emerald-400 border-white text-white shadow-lg" : "bg-white/80 border-white text-slate-300"
              }`}
            >
              <span className="font-hand text-xl font-bold leading-none">{index + 1}</span>
              <span className="font-sans text-[9px] uppercase tracking-wide truncate max-w-full">{label}</span>
            </MotionDiv>
          );
        })}
      </div>
    </div>
  );
}

function PuzzleProgress({ progress, target }) {
  return (
    <div className="bg-white/70 border-2 border-white rounded-[30px] p-4 shadow-inner">
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: target }, (_, index) => {
          const active = index < progress;
          return (
            <MotionDiv
              key={index}
              animate={{ rotate: active ? [0, -2, 2, 0] : 0, scale: active ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.6 }}
              className={`aspect-square rounded-xl border-2 ${active ? "bg-amber-300 border-white shadow-md" : "bg-white/80 border-white"}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function StarRunProgress({ progress, target }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="flex justify-center gap-2 bg-white/70 border-2 border-white rounded-[30px] p-4 shadow-inner">
      {Array.from({ length: target }, (_, index) => {
        const active = index < progress;
        return (
          <MotionDiv key={index} animate={{ scale: active && !shouldReduceMotion ? [1, 1.22, 1] : 1, rotate: active && !shouldReduceMotion ? [0, 8, -8, 0] : 0 }} transition={{ duration: 1.1, repeat: active && !shouldReduceMotion ? 1 : 0 }} className={active ? "text-fuchsia-500 drop-shadow-sm" : "text-slate-200"}>
            <Star size={34} fill="currentColor" />
          </MotionDiv>
        );
      })}
    </div>
  );
}

function WhirlProgress({ ratio, progress, target }) {
  return (
    <div className="bg-white/70 border-2 border-white rounded-[30px] p-4 shadow-inner">
      <div className="flex items-center gap-4">
        <RotateCw className="text-sky-500" size={34} />
        <div className="h-5 flex-1 bg-white rounded-full border-2 border-white overflow-hidden">
          <MotionDiv className="h-full bg-sky-400 rounded-full" animate={{ width: `${ratio * 100}%` }} />
        </div>
        <span className="font-hand text-3xl font-bold text-slate-700">{progress}/{target}</span>
      </div>
    </div>
  );
}

function AnswerStage({ modeId, options, selected, feedback, answer, seed, onChoose, shouldReduceMotion }) {
  const layoutClass =
    modeId === "puzzle"
      ? "grid grid-cols-2 lg:grid-cols-4 gap-4 min-h-64"
      : modeId === "kartenwirbel"
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 min-h-72 items-center"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 min-h-60 items-center";

  return (
    <div className={layoutClass}>
      {options.map((option, index) => {
        const isSelected = selected === option;
        const isCorrect = option === answer;
        const whirl = modeId === "kartenwirbel";
        const puzzle = modeId === "puzzle";

        return (
          <MotionButton
            key={`${seed}-${option}-${index}`}
            initial={{ opacity: 0, y: whirl ? -80 : 28, rotate: whirl ? -10 + index * 6 : puzzle ? -2 + index : 0, scale: 0.84 }}
            animate={{
              opacity: 1,
              y: whirl && !shouldReduceMotion ? [0, 12, -8, 0] : 0,
              rotate: whirl && !shouldReduceMotion ? [-2, 3, -3, -2] : 0,
              scale: 1,
            }}
            transition={{
              opacity: { duration: 0.2, delay: index * 0.04 },
              scale: { type: "spring", bounce: 0.42, delay: index * 0.04 },
              y: whirl && !shouldReduceMotion ? { duration: 2.4 + index * 0.22, repeat: 2, ease: "easeInOut" } : { duration: 0.25 },
              rotate: whirl && !shouldReduceMotion ? { duration: 2.7 + index * 0.2, repeat: 2, ease: "easeInOut" } : { duration: 0.2 },
            }}
            whileHover={{ scale: 1.07, y: -4 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onChoose(option)}
            className={`min-h-32 rounded-[30px] border-4 shadow-xl p-5 font-hand text-3xl font-bold transition-colors ${
              isSelected && feedback === "richtig" && isCorrect
                ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                : isSelected && feedback === "falsch"
                  ? "bg-rose-100 border-rose-300 text-rose-800"
                  : puzzle
                    ? "bg-white/92 border-amber-100 text-slate-700"
                    : whirl
                      ? "bg-white/92 border-sky-100 text-slate-700"
                      : "bg-white/92 border-white text-slate-700"
            }`}
          >
            {whirl && <span className="block font-sans text-[10px] uppercase tracking-widest text-slate-400 mb-1">Karte {index + 1}</span>}
            {puzzle && <span className="block font-sans text-[10px] uppercase tracking-widest text-amber-500 mb-1">Teil {index + 1}</span>}
            {option}
          </MotionButton>
        );
      })}
    </div>
  );
}
