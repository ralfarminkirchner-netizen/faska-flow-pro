import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Brush,
  Compass,
  Gem,
  Grid3X3,
  Image,
  Map,
  RotateCw,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { playCoin, playError, playJingle, playPop, playWhoosh } from "../../utils/sounds";

const MotionButton = motion.button;
const MotionDiv = motion.div;

const EMPTY_COLLECTION = { id: "leer", label: "Keine Sammlung", icon: "✦", color: "bg-slate-500", items: [] };
const HEARTS = ["♥", "♥", "♥"];
const PATH_CELLS = ["Start", "Spur", "Tor", "Fund", "Brücke", "Licht", "Zelt", "Kompass", "Ziel"];

const MODES = [
  {
    id: "imageSearch",
    label: "Bild-Suche",
    short: "Finde die Spur",
    icon: Image,
    tint: "from-sky-100 via-white to-emerald-50",
    color: "bg-sky-500",
  },
  {
    id: "expedition",
    label: "Expedition",
    short: "Folge dem Pfad",
    icon: Compass,
    tint: "from-emerald-100 via-white to-amber-50",
    color: "bg-emerald-500",
  },
  {
    id: "memory",
    label: "Paare",
    short: "Dreh zwei Karten",
    icon: Grid3X3,
    tint: "from-violet-100 via-white to-rose-50",
    color: "bg-violet-500",
  },
  {
    id: "atelier",
    label: "Atelier",
    short: "Baue die Lösung",
    icon: Brush,
    tint: "from-amber-100 via-white to-pink-50",
    color: "bg-amber-500",
  },
  {
    id: "starCombo",
    label: "Sternencombo",
    short: "Halte die Serie",
    icon: Star,
    tint: "from-fuchsia-100 via-white to-cyan-50",
    color: "bg-fuchsia-500",
  },
];

const normalizeText = (value) => String(value ?? "").trim();

const normalizeCollections = (collections) =>
  (Array.isArray(collections) ? collections : [])
    .map((collection, collectionIndex) => ({
      id: collection?.id || `collection-${collectionIndex}`,
      label: collection?.label || collection?.title || `Sammlung ${collectionIndex + 1}`,
      icon: collection?.icon || "✦",
      color: collection?.color || "bg-slate-600",
      items: Array.isArray(collection?.items)
        ? collection.items
            .filter((item) => item?.prompt && item?.answer)
            .map((item, itemIndex) => ({
              ...item,
              id: item.id || `${collection?.id || collectionIndex}-${itemIndex}`,
              answer: normalizeText(item.answer),
              options: buildOptions(item),
            }))
        : [],
    }))
    .filter((collection) => collection.items.length > 0);

const buildOptions = (item) => {
  const answer = normalizeText(item?.answer);
  const options = Array.isArray(item?.options) ? item.options.map(normalizeText).filter(Boolean) : [];
  return Array.from(new Set([answer, ...options])).filter(Boolean).slice(0, 6);
};

const getItemCue = (item, fallback = "✦") => item?.imageCue || item?.scene || item?.icon || fallback;

const getSceneLabel = (scene) => {
  if (!scene) return "Premium Quest";
  if (typeof scene === "string") return scene;
  return scene.label || scene.title || scene.name || "Premium Quest";
};

const makeDeck = (collection, roundSeed) =>
  (collection?.items || []).map((item, index) => ({
    ...item,
    deckId: `${collection.id}-${roundSeed}-${item.id || index}`,
    collectionLabel: collection.label,
  }));

const makeMemoryCards = (challenge, seed) => {
  const options = challenge.options.slice(0, 4);
  const baseCards = options.flatMap((option, index) => {
    const correct = option === challenge.answer;
    return [
      {
        id: `${seed}-${index}-a`,
        value: option,
        label: correct ? getItemCue(challenge, option) : option,
        kind: "cue",
      },
      {
        id: `${seed}-${index}-b`,
        value: option,
        label: option,
        kind: "answer",
      },
    ];
  });

  return baseCards
    .map((card, index) => ({ ...card, sortKey: (index * 17 + seed * 11) % 29 }))
    .sort((a, b) => a.sortKey - b.sortKey);
};

const makeAtelierPieces = (challenge, seed) => {
  const configured = challenge.challenge?.pieces || challenge.challenge?.parts || challenge.parts;
  const answer = normalizeText(challenge.answer);
  const pieces = Array.isArray(configured) && configured.length
    ? configured.map(normalizeText).filter(Boolean)
    : answer.includes(" ")
      ? answer.split(/\s+/)
      : answer.length > 6
        ? answer.match(/.{1,2}/g) || [answer]
        : answer.split("");

  return pieces
    .map((piece, index) => ({ id: `${seed}-${index}-${piece}`, piece, sortKey: (index * 13 + seed * 7) % 23 }))
    .sort((a, b) => a.sortKey - b.sortKey);
};

export default function PremiumQuestBoard({
  title = "Premium Quest Board",
  collections = [],
  accent = "bg-slate-900",
  scene = "Quest-Atelier",
  onCorrect = () => {},
  onWrong = () => {},
}) {
  const shouldReduceMotion = useReducedMotion();
  const playableCollections = useMemo(() => normalizeCollections(collections), [collections]);
  const [activeCollectionId, setActiveCollectionId] = useState(playableCollections[0]?.id);
  const [activeModeId, setActiveModeId] = useState(MODES[0].id);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [roundSeed, setRoundSeed] = useState(1);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [trail, setTrail] = useState(0);
  const [memoryOpen, setMemoryOpen] = useState([]);
  const [memorySolved, setMemorySolved] = useState([]);
  const [atelierBuild, setAtelierBuild] = useState([]);

  const activeCollection = playableCollections.find((collection) => collection.id === activeCollectionId) || playableCollections[0] || EMPTY_COLLECTION;
  const activeMode = MODES.find((mode) => mode.id === activeModeId) || MODES[0];
  const deck = useMemo(() => makeDeck(activeCollection, roundSeed), [activeCollection, roundSeed]);
  const challenge = deck[questionIndex % Math.max(deck.length, 1)];
  const memoryCards = useMemo(() => (challenge ? makeMemoryCards(challenge, roundSeed) : []), [challenge, roundSeed]);
  const atelierPieces = useMemo(() => (challenge ? makeAtelierPieces(challenge, roundSeed) : []), [challenge, roundSeed]);

  const clearLocalModeState = () => {
    setSelected(null);
    setFeedback(null);
    setMemoryOpen([]);
    setMemorySolved([]);
    setAtelierBuild([]);
  };

  const goNext = () => {
    setQuestionIndex((index) => index + 1);
    setTrail((value) => (activeModeId === "expedition" ? Math.min(value + 1, PATH_CELLS.length - 1) : value));
    setRoundSeed((seed) => seed + 1);
    clearLocalModeState();
  };

  const resetBoard = () => {
    playJingle("start");
    setQuestionIndex(0);
    setRoundSeed((seed) => seed + 1);
    setScore(0);
    setCombo(0);
    setHearts(3);
    setTrail(0);
    clearLocalModeState();
  };

  const switchMode = (modeId) => {
    if (modeId === activeModeId) return;
    playWhoosh();
    setActiveModeId(modeId);
    setTrail(0);
    clearLocalModeState();
    setRoundSeed((seed) => seed + 1);
  };

  const switchCollection = (collectionId) => {
    if (collectionId === activeCollection.id) return;
    playPop();
    setActiveCollectionId(collectionId);
    setQuestionIndex(0);
    setTrail(0);
    clearLocalModeState();
    setRoundSeed((seed) => seed + 1);
  };

  const markCorrect = (bonus = 5) => {
    const nextCombo = combo + 1;
    const nextScore = score + bonus + Math.min(nextCombo, 6) * 2;
    setFeedback("richtig");
    setCombo(nextCombo);
    setScore(nextScore);
    onCorrect(bonus + Math.min(nextCombo, 4));

    if (nextCombo % 4 === 0 || activeModeId === "starCombo") {
      playJingle("combo");
      confetti({ particleCount: 90, spread: 95, origin: { y: 0.74 } });
    } else {
      playCoin();
    }

    setTimeout(goNext, activeModeId === "memory" ? 900 : 720);
  };

  const markWrong = () => {
    const nextHearts = Math.max(hearts - 1, 0);
    setFeedback("falsch");
    setCombo(0);
    setHearts(nextHearts);
    playError();
    onWrong();

    setTimeout(() => {
      clearLocalModeState();
      if (nextHearts <= 0) {
        setHearts(3);
        setTrail(0);
        setQuestionIndex((index) => index + 1);
        setRoundSeed((seed) => seed + 1);
      }
    }, 900);
  };

  const chooseOption = (option) => {
    if (!challenge || feedback) return;
    setSelected(option);
    if (option === challenge.answer) {
      markCorrect(activeModeId === "starCombo" ? 8 : 5);
    } else {
      markWrong();
    }
  };

  const flipMemoryCard = (card) => {
    if (feedback || memorySolved.includes(card.id) || memoryOpen.some((openCard) => openCard.id === card.id)) return;
    playPop();
    const nextOpen = [...memoryOpen, card].slice(-2);
    setMemoryOpen(nextOpen);

    if (nextOpen.length < 2) return;

    const [first, second] = nextOpen;
    if (first.value === second.value) {
      setMemorySolved((solved) => [...solved, first.id, second.id]);
      if (first.value === challenge.answer) {
        markCorrect(7);
      } else {
        setFeedback("neutral");
        setTimeout(() => {
          setFeedback(null);
          setMemoryOpen([]);
        }, 780);
      }
      return;
    }

    markWrong();
  };

  const addAtelierPiece = (piece) => {
    if (feedback) return;
    playPop();
    const nextBuild = [...atelierBuild, piece];
    const targetLength = atelierPieces.length;
    setAtelierBuild(nextBuild);

    const joined = nextBuild.join("");
    const spaced = nextBuild.join(" ");
    if (joined === challenge.answer || spaced === challenge.answer) {
      markCorrect(8);
      return;
    }

    if (nextBuild.length >= targetLength) {
      markWrong();
    }
  };

  const removeAtelierPiece = (index) => {
    playWhoosh();
    setAtelierBuild((pieces) => pieces.filter((_, pieceIndex) => pieceIndex !== index));
  };

  if (!playableCollections.length || !challenge) {
    return (
      <div className="w-full max-w-5xl mx-auto py-8">
        <div className="bg-white/75 border-4 border-white rounded-[38px] shadow-xl p-8 text-center paper-texture">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">Premium Quest Board</p>
          <h2 className="font-hand text-5xl font-bold text-slate-800">Noch keine spielbaren Aufgaben</h2>
          <p className="font-hand text-2xl text-slate-500 mt-2">Übergebe `collections` mit `items`, `prompt`, `answer` und optional `options`.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8 flex flex-col gap-7">
      <header className="text-center space-y-2">
        <h2 className="font-hand text-5xl md:text-6xl font-bold text-slate-800 leading-tight">{title}</h2>
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2 shadow-sm border border-white">
          <Sparkles size={18} className="text-amber-500" />
          <span className="font-hand text-2xl text-slate-600">{getSceneLabel(scene)}</span>
          <Gem size={18} className="text-emerald-500" />
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const active = mode.id === activeMode.id;
          return (
            <MotionButton
              key={mode.id}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => switchMode(mode.id)}
              className={`min-h-28 rounded-[30px] border-4 p-4 shadow-md text-left transition-all ${
                active ? `${mode.color} text-white border-white ring-4 ring-white` : "bg-white/75 text-slate-600 border-white hover:bg-white"
              }`}
            >
              <Icon size={30} strokeWidth={2.4} />
              <span className="block font-hand text-3xl font-bold leading-none mt-2">{mode.label}</span>
              <span className="sr-only">{mode.short}</span>
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
              <span>{collection.label}</span>
              <span className="sr-only">{collection.items.length} Karten</span>
            </MotionButton>
          );
        })}
      </div>

      <section className="bg-white/65 rounded-[48px] border-4 border-white shadow-2xl p-5 md:p-7 overflow-hidden relative paper-texture">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <QuestStat label="Modus" value={activeMode.label} color="text-slate-800" />
          <QuestStat label="Herzen" value={HEARTS.map((heart, index) => <span key={index} className={index < hearts ? "" : "opacity-20"}>{heart}</span>)} color="text-rose-500" />
          <QuestStat label="Combo" value={`${combo}x`} color="text-fuchsia-500" />
          <QuestStat label="Punkte" value={score} color="text-emerald-600" />
        </div>

        <div className={`relative min-h-[600px] rounded-[42px] border-4 border-white bg-gradient-to-br ${activeMode.tint} shadow-inner overflow-hidden`}>
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 22%, rgba(14,165,233,.18), transparent 22%), radial-gradient(circle at 82% 24%, rgba(16,185,129,.16), transparent 24%), radial-gradient(circle at 50% 88%, rgba(244,114,182,.14), transparent 27%)",
              backgroundSize: "100% 100%",
            }}
          />

          <div className="relative z-10 p-5 md:p-7 flex flex-col gap-6">
            <QuestHeader mode={activeMode} collection={activeCollection} challenge={challenge} accent={accent} />

            <AnimatePresence mode="wait">
              <MotionDiv
                key={`${activeMode.id}-${challenge.deckId}`}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -18, scale: 0.98 }}
                transition={{ type: "spring", bounce: 0.28 }}
              >
                {activeMode.id === "imageSearch" && (
                  <ImageSearchStage challenge={challenge} selected={selected} feedback={feedback} onChoose={chooseOption} shouldReduceMotion={shouldReduceMotion} />
                )}
                {activeMode.id === "expedition" && (
                  <ExpeditionStage challenge={challenge} selected={selected} feedback={feedback} trail={trail} onChoose={chooseOption} shouldReduceMotion={shouldReduceMotion} />
                )}
                {activeMode.id === "memory" && (
                  <MemoryStage cards={memoryCards} open={memoryOpen} solved={memorySolved} answer={challenge.answer} feedback={feedback} onFlip={flipMemoryCard} />
                )}
                {activeMode.id === "atelier" && (
                  <AtelierStage pieces={atelierPieces} build={atelierBuild} feedback={feedback} onAdd={addAtelierPiece} onRemove={removeAtelierPiece} />
                )}
                {activeMode.id === "starCombo" && (
                  <StarComboStage challenge={challenge} selected={selected} feedback={feedback} combo={combo} onChoose={chooseOption} shouldReduceMotion={shouldReduceMotion} />
                )}
              </MotionDiv>
            </AnimatePresence>
          </div>

          <FeedbackToast feedback={feedback} combo={combo} />
        </div>

        <div className="flex justify-center mt-6">
          <MotionButton
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetBoard}
            className={`px-7 py-3 ${accent} text-white rounded-full font-hand text-2xl font-bold shadow-lg border-4 border-white flex items-center gap-2`}
          >
            <RotateCw size={22} />
            Neu mischen
          </MotionButton>
        </div>
      </section>
    </div>
  );
}

function QuestStat({ label, value, color }) {
  return (
    <div className="bg-white/80 rounded-3xl p-4 border-2 border-white shadow-inner min-h-24">
      <p className="font-sans text-[10px] uppercase tracking-widest font-bold text-slate-400">{label}</p>
      <p className={`font-hand text-3xl md:text-4xl font-bold leading-tight ${color}`}>{value}</p>
    </div>
  );
}

function QuestHeader({ mode, collection, challenge, accent }) {
  const Icon = mode.icon;

  return (
    <div className="bg-white/88 rounded-[34px] border-4 border-white shadow-lg p-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">
            {mode.label} · {collection.label}
          </p>
          <h3 className="font-hand text-4xl md:text-5xl font-bold text-slate-800 leading-tight">{challenge.prompt}</h3>
          {challenge.support && <p className="font-hand text-2xl text-slate-500 mt-2">{challenge.support}</p>}
          {challenge.example && <p className="font-hand text-2xl font-bold text-slate-700 mt-2">{challenge.example}</p>}
        </div>
        <div className={`${accent} text-white rounded-3xl p-4 shadow-lg border-4 border-white flex items-center gap-3 w-fit`}>
          <Icon size={34} />
          <Gem size={24} />
        </div>
      </div>
    </div>
  );
}

function ImageSearchStage({ challenge, selected, feedback, onChoose, shouldReduceMotion }) {
  return (
    <div className="grid lg:grid-cols-[0.9fr_1.2fr] gap-6 items-stretch">
      <div className="bg-white/76 border-4 border-white rounded-[36px] shadow-inner p-6 min-h-72 flex flex-col items-center justify-center text-center">
        <MotionDiv animate={shouldReduceMotion ? { scale: 1, rotate: 0 } : { scale: [1, 1.05, 1], rotate: [0, 1.5, -1.5, 0] }} transition={{ duration: 3.6, repeat: shouldReduceMotion ? 0 : 1 }}>
          <div className="w-40 h-40 rounded-[38px] bg-white border-4 border-sky-100 shadow-xl flex items-center justify-center text-7xl">
            {getItemCue(challenge, "🔎")}
          </div>
        </MotionDiv>
        <div className="mt-5 flex items-center justify-center gap-2 text-sky-600">
          <Search size={24} />
          <p className="font-hand text-3xl font-bold">Welche Karte passt?</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {challenge.options.slice(0, 4).map((option, index) => (
          <AnswerCard
            key={`${challenge.deckId}-image-${option}`}
            option={option}
            index={index}
            selected={selected}
            feedback={feedback}
            answer={challenge.answer}
            onChoose={onChoose}
            prefix={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

function ExpeditionStage({ challenge, selected, feedback, trail, onChoose, shouldReduceMotion }) {
  const options = challenge.options.slice(0, 4);
  return (
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
      <div className="bg-white/72 border-4 border-white rounded-[36px] shadow-inner p-4">
        <div className="grid grid-cols-3 gap-3">
          {PATH_CELLS.map((cell, index) => {
            const active = index <= trail;
            const current = index === trail;
            return (
              <MotionDiv
                key={cell}
                animate={{ y: current && !shouldReduceMotion ? [0, -8, 0] : 0, scale: active ? 1.03 : 1 }}
                transition={{ duration: 0.9, repeat: current && !shouldReduceMotion ? 2 : 0 }}
                className={`aspect-square rounded-[26px] border-4 flex flex-col items-center justify-center text-center p-2 ${
                  active ? "bg-emerald-400 border-white text-white shadow-lg" : "bg-white/75 border-white text-slate-300"
                }`}
              >
                <Map size={24} />
                <span className="font-hand text-2xl font-bold leading-none mt-1">{cell}</span>
              </MotionDiv>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, index) => (
          <AnswerCard
            key={`${challenge.deckId}-path-${option}`}
            option={option}
            index={index}
            selected={selected}
            feedback={feedback}
            answer={challenge.answer}
            onChoose={onChoose}
            prefix="Pfad"
          />
        ))}
      </div>
    </div>
  );
}

function MemoryStage({ cards, open, solved, answer, feedback, onFlip }) {
  return (
    <div className="bg-white/70 border-4 border-white rounded-[36px] shadow-inner p-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const visible = open.some((openCard) => openCard.id === card.id) || solved.includes(card.id);
          const solvedCorrect = solved.includes(card.id) && card.value === answer;
          return (
            <MotionButton
              key={card.id}
              initial={{ opacity: 0, y: 20, rotateY: 0 }}
              animate={{ opacity: 1, y: 0, rotateY: visible ? 180 : 0 }}
              transition={{ type: "spring", bounce: 0.34, delay: index * 0.03 }}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onFlip(card)}
              className={`relative min-h-36 rounded-[28px] border-4 shadow-xl p-4 font-hand text-3xl font-bold transition-colors ${
                solvedCorrect
                  ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                  : visible
                    ? "bg-white border-violet-100 text-slate-700"
                    : "bg-violet-500 border-white text-white"
              } ${feedback === "falsch" && visible ? "ring-4 ring-rose-200" : ""}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="block" style={{ transform: visible ? "rotateY(180deg)" : "none" }}>
                {visible ? card.label : "?"}
              </span>
              {visible && <span className="block font-sans text-[10px] uppercase tracking-widest text-slate-400 mt-2">{card.kind === "cue" ? "Spur" : "Antwort"}</span>}
            </MotionButton>
          );
        })}
      </div>
    </div>
  );
}

function AtelierStage({ pieces, build, feedback, onAdd, onRemove }) {
  const usedCount = (piece) => build.filter((entry) => entry === piece).length;
  const availableCount = (piece) => pieces.filter((entry) => entry.piece === piece).length;

  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
      <div className="bg-white/72 border-4 border-white rounded-[36px] shadow-inner p-5 min-h-72">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Baukasten</p>
        <div className="flex flex-wrap gap-3">
          {pieces.map((entry, index) => {
            const disabled = usedCount(entry.piece) >= availableCount(entry.piece);
            return (
              <MotionButton
                key={entry.id}
                whileHover={{ y: disabled ? 0 : -4, scale: disabled ? 1 : 1.05 }}
                whileTap={{ scale: disabled ? 1 : 0.94 }}
                onClick={() => !disabled && onAdd(entry.piece)}
                className={`min-w-16 min-h-16 px-5 rounded-[22px] border-4 shadow-lg font-hand text-3xl font-bold ${
                  disabled ? "bg-slate-100 border-white text-slate-300" : "bg-amber-100 border-white text-slate-700"
                }`}
              >
                {entry.piece}
                <span className="block font-sans text-[9px] uppercase tracking-widest text-amber-500">Teil {index + 1}</span>
              </MotionButton>
            );
          })}
        </div>
      </div>

      <div className="bg-white/82 border-4 border-white rounded-[36px] shadow-lg p-5 min-h-72">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Atelierfläche</p>
        <div className={`min-h-40 rounded-[28px] border-4 border-dashed flex flex-wrap content-center gap-3 p-4 ${
          feedback === "falsch" ? "border-rose-200 bg-rose-50" : "border-amber-200 bg-white/70"
        }`}>
          {build.length === 0 && <p className="font-hand text-3xl text-slate-300">Lege die Teile hier ab.</p>}
          {build.map((piece, index) => (
            <MotionButton
              key={`${piece}-${index}`}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onRemove(index)}
              className="min-w-16 min-h-16 px-5 rounded-[22px] bg-white border-4 border-amber-100 shadow-md font-hand text-3xl font-bold text-slate-800"
            >
              {piece}
            </MotionButton>
          ))}
        </div>
      </div>
    </div>
  );
}

function StarComboStage({ challenge, selected, feedback, combo, onChoose, shouldReduceMotion }) {
  return (
    <div className="space-y-6">
      <div className="bg-white/72 border-4 border-white rounded-[36px] shadow-inner p-5 flex flex-wrap justify-center gap-2">
        {Array.from({ length: 8 }, (_, index) => {
          const active = index < Math.min(combo, 8);
          return (
            <MotionDiv
              key={index}
              animate={{ scale: active && !shouldReduceMotion ? [1, 1.22, 1] : 1, rotate: active && !shouldReduceMotion ? [0, 8, -8, 0] : 0 }}
              transition={{ duration: 1.1, repeat: active && !shouldReduceMotion ? 2 : 0 }}
              className={active ? "text-fuchsia-500 drop-shadow-sm" : "text-slate-200"}
            >
              <Star size={38} fill="currentColor" />
            </MotionDiv>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {challenge.options.slice(0, 4).map((option, index) => (
          <AnswerCard
            key={`${challenge.deckId}-combo-${option}`}
            option={option}
            index={index}
            selected={selected}
            feedback={feedback}
            answer={challenge.answer}
            onChoose={onChoose}
            prefix={<Sparkles size={18} />}
          />
        ))}
      </div>
    </div>
  );
}

function AnswerCard({ option, index, selected, feedback, answer, onChoose, prefix }) {
  const isSelected = selected === option;
  const isCorrect = option === answer;

  return (
    <MotionButton
      initial={{ opacity: 0, y: 28, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", bounce: 0.36, delay: index * 0.04 }}
      whileHover={{ y: -4, scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => onChoose(option)}
      className={`min-h-32 rounded-[30px] border-4 shadow-xl p-5 font-hand text-3xl font-bold transition-colors ${
        isSelected && feedback === "richtig" && isCorrect
          ? "bg-emerald-100 border-emerald-300 text-emerald-800"
          : isSelected && feedback === "falsch"
            ? "bg-rose-100 border-rose-300 text-rose-800"
            : "bg-white/92 border-white text-slate-700 hover:border-slate-200"
      }`}
    >
      <span className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest text-slate-400 mb-2">
        {prefix}
      </span>
      {option}
    </MotionButton>
  );
}

function FeedbackToast({ feedback, combo }) {
  return (
    <AnimatePresence>
      {feedback === "richtig" && (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.84, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl z-20"
        >
          Treffer! Combo {combo}
        </MotionDiv>
      )}
      {feedback === "falsch" && (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.84, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-rose-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl z-20"
        >
          Noch einmal genau schauen.
        </MotionDiv>
      )}
      {feedback === "neutral" && (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.84, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-violet-500 text-white rounded-full px-7 py-3 font-hand text-3xl font-bold shadow-xl z-20"
        >
          Paar gefunden. Suche das Zielpaar.
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
