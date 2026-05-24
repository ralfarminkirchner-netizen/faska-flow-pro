import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Eye,
  Lightbulb,
  Puzzle,
  RotateCw,
  Search,
  ShieldCheck,
  Star,
  Wand2,
} from "lucide-react";
import { ANIMAL_FRIENDS } from "../../data/animalFriends";
import { getDeepLearningPack } from "../../data/deepLearningContentPack";
import { SUBJECT_VARIANT_CONTENT } from "../../data/learningContent";
import { withPremiumCollections } from "../../data/premiumGamePack";
import { playCoin, playError, playJingle, playPop, playWhoosh } from "../../utils/sounds";

const MotionButton = motion.button;

const SUBJECT_THEMES = {
  deutsch: {
    title: "Sprach-Detektiv",
    kicker: "Wörter, Sätze, Bedeutung",
    background: "/premium-sky/backgrounds/sky-morning.jpg",
    sprite: "/premium-sky/sprites/story-book.png",
    accent: "#f59e0b",
    dark: "#7c2d12",
    glow: "rgba(245, 158, 11, .28)",
    gradient: "from-amber-50 via-white to-cyan-50",
    companionOffset: 7,
    method: "Lies langsam. Prüfe Wort, Klang und Sinn im ganzen Satz.",
    transfer: "Ich kann meine Antwort mit Wort, Satz und Spur begründen.",
    wrongTransfers: ["Ich rate schnell und wechsle sofort.", "Ich schaue nur auf die schönste Karte."],
  },
  mathe: {
    title: "Zahlen-Architekt",
    kicker: "Material, Muster, Beweis",
    background: "/premium-sky/backgrounds/sky-rainbow.jpg",
    sprite: "/premium-sky/sprites/number-balloon.png",
    accent: "#0ea5e9",
    dark: "#075985",
    glow: "rgba(14, 165, 233, .3)",
    gradient: "from-sky-50 via-white to-amber-50",
    companionOffset: 2,
    method: "Lege die Menge in Gedanken. Suche Schritt, Stelle oder Muster.",
    transfer: "Ich kann zeigen, welcher Rechenschritt die Lösung trägt.",
    wrongTransfers: ["Ich nehme die größte Zahl.", "Ich wähle, was am lautesten aussieht."],
  },
  sachunterricht: {
    title: "Forscher-Lupe",
    kicker: "Beobachten, erklären, schützen",
    background: "/premium-sky/backgrounds/sky-rain.jpg",
    sprite: "/premium-sky/sprites/leaf-glider.png",
    accent: "#10b981",
    dark: "#065f46",
    glow: "rgba(16, 185, 129, .3)",
    gradient: "from-emerald-50 via-white to-sky-50",
    companionOffset: 8,
    method: "Beobachte ruhig. Verbinde Körper, Ort, Wetter und Verhalten.",
    transfer: "Ich kann erklären, welche Beobachtung zur Antwort passt.",
    wrongTransfers: ["Ich fasse alles sofort an.", "Ich entscheide ohne Hinsehen."],
  },
  ethik: {
    title: "Herz-Kompass",
    kicker: "Gefühl, Grenze, nächster Schritt",
    background: "/premium-sky/backgrounds/sky-sunset.jpg",
    sprite: "/premium-sky/sprites/heart-balloon.png",
    accent: "#ec4899",
    dark: "#831843",
    glow: "rgba(236, 72, 153, .26)",
    gradient: "from-pink-50 via-white to-indigo-50",
    companionOffset: 4,
    method: "Spüre: Was ist sicher, freundlich und klar für alle Beteiligten?",
    transfer: "Ich kann einen ruhigen, sicheren nächsten Schritt wählen.",
    wrongTransfers: ["Ich dränge, bis alle nachgeben.", "Ich tue so, als gäbe es kein Gefühl."],
  },
  musik: {
    title: "Klang-Labor",
    kicker: "Hören, Muster, Ausdruck",
    background: "/premium-sky/backgrounds/sky-aurora.jpg",
    sprite: "/premium-sky/sprites/music-notes.png",
    accent: "#a855f7",
    dark: "#581c87",
    glow: "rgba(168, 85, 247, .28)",
    gradient: "from-fuchsia-50 via-white to-cyan-50",
    companionOffset: 1,
    method: "Höre in Gedanken: Material, Bewegung, Tempo und Klangfarbe.",
    transfer: "Ich kann Klang, Instrument oder Muster mit einem Merkmal begründen.",
    wrongTransfers: ["Ich nehme immer das gleiche Instrument.", "Ich wähle nur nach Farbe."],
  },
};

const FALLBACK_THEME = SUBJECT_THEMES.deutsch;
const EMPTY_COLLECTION = { id: "empty", label: "Leere Sammlung", icon: "✦", color: "bg-slate-500", items: [] };

const normalizeText = (value) => String(value ?? "").trim();

const unique = (items) => Array.from(new Set(items.map(normalizeText).filter(Boolean)));

const shuffleBySeed = (items, seed) =>
  [...items]
    .map((item, index) => ({ item, sortKey: (index * 37 + seed * 17 + normalizeText(item?.id || item).length * 11) % 101 }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ item }) => item);

const normalizeCollections = (collections = []) =>
  collections
    .map((collection, collectionIndex) => ({
      id: collection?.id || `collection-${collectionIndex}`,
      label: collection?.label || collection?.title || `Sammlung ${collectionIndex + 1}`,
      icon: collection?.icon || "✦",
      color: collection?.color || "bg-slate-600",
      items: Array.isArray(collection?.items)
        ? collection.items
            .filter((item) => item?.prompt && item?.answer)
            .map((item, itemIndex) => {
              const answer = normalizeText(item.answer);
              const options = unique([answer, ...(Array.isArray(item.options) ? item.options : [])]).slice(0, 4);
              return {
                ...item,
                id: item.id || `${collection?.id || collectionIndex}-${itemIndex}`,
                answer,
                options: options.length >= 2 ? options : [answer],
              };
            })
        : [],
    }))
    .filter((collection) => collection.items.length > 0);

const makeDeck = (collection, seed) =>
  shuffleBySeed(collection?.items || [], seed).map((item, index) => ({
    ...item,
    deckId: `${collection.id}-${seed}-${item.id || index}`,
    collectionLabel: collection.label,
  }));

const subjectFallbackPrompt = (subject) => {
  switch (subject) {
    case "mathe":
      return "Welche Zahl, Form oder Struktur passt wirklich?";
    case "sachunterricht":
      return "Welche Beobachtung erklärt die Situation am besten?";
    case "ethik":
      return "Welcher Schritt ist klar, freundlich und sicher?";
    case "musik":
      return "Welcher Klang oder welches Muster passt?";
    case "deutsch":
    default:
      return "Welche Antwort passt zu Wort, Satz und Bedeutung?";
  }
};

const buildClues = (challenge, collection, theme, subject) => {
  const support = normalizeText(challenge?.support) || subjectFallbackPrompt(subject);
  const example = normalizeText(challenge?.example);
  const imageCue = normalizeText(challenge?.imageCue || challenge?.scene);
  const collectionLine = `${collection.icon} ${collection.label}: ${challenge.collectionLabel || collection.label}`;

  return [
    {
      id: "trace",
      label: "Spur",
      icon: Search,
      text: support,
    },
    {
      id: "picture",
      label: imageCue ? "Bild" : "Feld",
      icon: Eye,
      text: imageCue ? `Stell dir vor: ${imageCue}.` : collectionLine,
    },
    {
      id: "method",
      label: example ? "Probe" : "Werkzeug",
      icon: Lightbulb,
      text: example || theme.method,
    },
  ];
};

const buildTransferChoices = (theme, challenge, seed) => {
  const support = normalizeText(challenge?.support);
  const answer = normalizeText(challenge?.answer);
  const correct = support
    ? `Ich begründe mit der Spur: ${support}`
    : `Ich begründe: ${answer} passt zur Aufgabe.`;

  return shuffleBySeed(
    [
      { id: "correct", text: correct, correct: true },
      { id: "subject", text: theme.transfer, correct: true },
      ...theme.wrongTransfers.map((text, index) => ({ id: `wrong-${index}`, text, correct: false })),
    ].slice(0, 4),
    seed + answer.length
  );
};

const getFeedbackText = (challenge, selected) => {
  if (!selected) return "";
  if (selected === challenge.answer) return `Ja: ${challenge.answer}.`;
  return `${selected} passt hier nicht tragfähig. Die Spur zeigt auf ${challenge.answer}.`;
};

function ProgressPath({ progress, accent }) {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      {Array.from({ length: 5 }, (_, index) => {
        const active = index < progress;
        return (
          <div key={index} className="flex items-center gap-2">
            <motion.div
              animate={{ scale: active ? 1.08 : 1 }}
              className="h-9 w-9 rounded-full border-2 border-white shadow-sm grid place-items-center"
              style={{ backgroundColor: active ? accent : "rgba(255,255,255,.68)", color: active ? "white" : "#94a3b8" }}
            >
              <Star size={16} fill={active ? "currentColor" : "none"} />
            </motion.div>
            {index < 4 && <div className="h-1 w-7 rounded-full bg-white/70" />}
          </div>
        );
      })}
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/80 bg-white/74 px-4 py-3 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 text-slate-400">
        <span className="font-sans text-[10px] font-bold uppercase tracking-[.18em]">{label}</span>
      </div>
      <p className="mt-1 truncate font-hand text-3xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

export default function DeepLearningQuest({
  subject = "deutsch",
  title,
  collections,
  onCorrect = () => {},
  onWrong = () => {},
}) {
  const shouldReduceMotion = useReducedMotion();
  const theme = SUBJECT_THEMES[subject] || FALLBACK_THEME;
  const baseCollections = useMemo(
    () => collections || withPremiumCollections(subject, SUBJECT_VARIANT_CONTENT[subject]),
    [collections, subject]
  );
  const sourceCollections = useMemo(
    () => [...baseCollections, ...getDeepLearningPack(subject)],
    [baseCollections, subject]
  );
  const playableCollections = useMemo(() => normalizeCollections(sourceCollections), [sourceCollections]);
  const [activeCollectionId, setActiveCollectionId] = useState(playableCollections[0]?.id);
  const [seed, setSeed] = useState(3);
  const [roundIndex, setRoundIndex] = useState(0);
  const [openedClues, setOpenedClues] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [transferFeedback, setTransferFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mastery, setMastery] = useState(0);

  const activeCollection =
    playableCollections.find((collection) => collection.id === activeCollectionId) || playableCollections[0] || EMPTY_COLLECTION;
  const deck = useMemo(() => makeDeck(activeCollection, seed), [activeCollection, seed]);
  const challenge = deck[roundIndex % Math.max(deck.length, 1)];
  const clues = useMemo(() => buildClues(challenge, activeCollection, theme, subject), [activeCollection, challenge, subject, theme]);
  const transferChoices = useMemo(() => buildTransferChoices(theme, challenge || {}, seed), [challenge, seed, theme]);
  const companion = ANIMAL_FRIENDS[(roundIndex + seed + theme.companionOffset) % ANIMAL_FRIENDS.length];
  const readyToAnswer = openedClues.length >= 2;
  const totalItems = playableCollections.reduce((sum, collection) => sum + collection.items.length, 0);

  const clearRound = () => {
    setOpenedClues([]);
    setSelectedAnswer(null);
    setAnswerFeedback(null);
    setSelectedTransfer(null);
    setTransferFeedback(null);
  };

  const switchCollection = (collectionId) => {
    if (collectionId === activeCollection.id) return;
    playWhoosh();
    setActiveCollectionId(collectionId);
    setRoundIndex(0);
    setSeed((value) => value + 5);
    clearRound();
  };

  const openClue = (id) => {
    if (openedClues.includes(id)) return;
    playPop();
    setOpenedClues((items) => [...items, id]);
  };

  const chooseAnswer = (option) => {
    if (!challenge || answerFeedback === "richtig" || !readyToAnswer) return;
    setSelectedAnswer(option);

    if (option === challenge.answer) {
      playCoin();
      setAnswerFeedback("richtig");
      return;
    }

    playError();
    setAnswerFeedback("falsch");
    setStreak(0);
    onWrong();
    setTimeout(() => {
      setSelectedAnswer(null);
      setAnswerFeedback(null);
    }, 1400);
  };

  const chooseTransfer = (choice) => {
    if (answerFeedback !== "richtig" || transferFeedback === "richtig") return;
    setSelectedTransfer(choice.id);

    if (!choice.correct) {
      playError();
      setTransferFeedback("falsch");
      onWrong();
      setTimeout(() => {
        setSelectedTransfer(null);
        setTransferFeedback(null);
      }, 1200);
      return;
    }

    const nextStreak = streak + 1;
    const gained = 8 + Math.min(nextStreak, 5) * 2 + openedClues.length;
    setTransferFeedback("richtig");
    setStreak(nextStreak);
    setScore((value) => value + gained);
    setMastery((value) => Math.min(value + 1, 5));
    onCorrect(gained);

    if (nextStreak % 3 === 0) {
      playJingle("combo");
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.72 } });
    } else {
      playJingle("success");
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.76 } });
    }

    setTimeout(() => {
      setRoundIndex((value) => value + 1);
      setSeed((value) => value + 1);
      setMastery((value) => (value >= 5 ? 0 : value));
      clearRound();
    }, 1350);
  };

  const reshuffle = () => {
    playJingle("start");
    setRoundIndex(0);
    setSeed((value) => value + 11);
    setScore(0);
    setStreak(0);
    setMastery(0);
    clearRound();
  };

  if (!challenge) return null;

  return (
    <section data-testid={`deep-learning-quest-${subject}`} className="w-full max-w-6xl mx-auto py-4 md:py-8">
      <div className="relative overflow-hidden rounded-[38px] border-4 border-white bg-white/72 shadow-2xl paper-texture">
        <div className="absolute inset-0 opacity-90" aria-hidden>
          <img src={theme.background} alt="" className="h-full w-full object-cover" loading="lazy" />
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-[.88]`} />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 18% 20%, rgba(255,255,255,.86), transparent 24%), radial-gradient(circle at 86% 16%, rgba(255,255,255,.54), transparent 18%), radial-gradient(circle at 58% 92%, rgba(255,255,255,.54), transparent 24%)",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col gap-6 p-4 md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, -6, 0], rotate: [-1.5, 1.5, -1.5] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                className="relative h-24 w-24 shrink-0 rounded-[28px] border-2 border-white/80 bg-white/54 p-2 shadow-xl backdrop-blur"
              >
                <img src={theme.sprite} alt="" className="h-full w-full object-contain drop-shadow-md" />
              </motion.div>
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-[.22em] text-slate-500">{theme.kicker}</p>
                <h2 className="font-hand text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
                  {title || theme.title}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-slate-500">
                  <span className="rounded-full bg-white/70 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[.16em]">
                    {totalItems} Karten
                  </span>
                  <span className="rounded-full bg-white/70 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[.16em]">
                    Denken · Beweisen · Übertragen
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:min-w-[410px]">
              <StatPill label="Tiefe" value={score} color={theme.dark} />
              <StatPill label="Serie" value={`${streak}x`} color="#ea580c" />
              <StatPill label="Runde" value={`${(roundIndex % activeCollection.items.length) + 1}`} color="#0f766e" />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {playableCollections.map((collection) => {
              const active = collection.id === activeCollection.id;
              return (
                <MotionButton
                  key={collection.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => switchCollection(collection.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-2xl border-2 px-4 py-3 shadow-sm transition-all ${
                    active ? `${collection.color} border-white text-white ring-2 ring-white` : "border-white/80 bg-white/70 text-slate-600 hover:bg-white"
                  }`}
                >
                  <span className="text-2xl">{collection.icon}</span>
                  <span className="font-hand text-2xl font-bold leading-none">{collection.label}</span>
                  <span className={`font-sans text-[10px] font-bold uppercase tracking-widest ${active ? "text-white/80" : "text-slate-400"}`}>
                    {collection.items.length}
                  </span>
                </MotionButton>
              );
            })}
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,.85fr)]">
            <div className="relative min-h-[600px] overflow-hidden rounded-[34px] border-4 border-white bg-white/54 shadow-inner">
              <div className="absolute inset-0" aria-hidden>
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, rgba(255,255,255,.15), rgba(255,255,255,.72)), radial-gradient(circle at 18% 70%, rgba(52,211,153,.26), transparent 28%), radial-gradient(circle at 84% 78%, rgba(14,165,233,.22), transparent 26%)",
                  }}
                />
                <motion.div
                  animate={shouldReduceMotion ? undefined : { x: [0, 18, 0], y: [0, -4, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-[8%] top-[10%] h-16 w-36 rounded-full bg-white/64 blur-sm"
                />
                <motion.div
                  animate={shouldReduceMotion ? undefined : { x: [0, -16, 0], y: [0, 6, 0] }}
                  transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-[8%] top-[18%] h-14 w-32 rounded-full bg-white/58 blur-sm"
                />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-r from-emerald-200/70 via-lime-100/70 to-sky-200/70" />
              </div>

              <div className="relative z-10 flex min-h-[600px] flex-col justify-between gap-5 p-5 md:p-7">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-2xl rounded-[30px] border-2 border-white/90 bg-white/82 p-5 shadow-lg backdrop-blur">
                    <div className="flex items-center gap-2 text-slate-400">
                      <BookOpen size={16} />
                      <span className="font-sans text-[11px] font-bold uppercase tracking-[.18em]">
                        {activeCollection.label}
                      </span>
                    </div>
                    <h3 className="mt-3 font-hand text-4xl font-bold leading-[1.05] text-slate-900 md:text-5xl">
                      {challenge.prompt}
                    </h3>
                  </div>

                  <MotionButton
                    whileHover={{ rotate: 10, scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={reshuffle}
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-white bg-slate-900 text-white shadow-lg"
                    aria-label="Neu mischen"
                  >
                    <RotateCw size={21} />
                  </MotionButton>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {clues.map((clue) => {
                    const Icon = clue.icon;
                    const open = openedClues.includes(clue.id);
                    return (
                      <MotionButton
                        key={clue.id}
                        data-testid={`deep-clue-${clue.id}`}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => openClue(clue.id)}
                        className={`min-h-36 rounded-[28px] border-2 p-4 text-left shadow-md transition-all ${
                          open ? "border-white bg-white text-slate-800" : "border-white/70 bg-white/42 text-slate-500 hover:bg-white/72"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="grid h-9 w-9 place-items-center rounded-2xl text-white shadow-sm" style={{ backgroundColor: theme.accent }}>
                              <Icon size={18} />
                            </span>
                            <span className="font-hand text-2xl font-bold">{clue.label}</span>
                          </div>
                          {open && <CheckCircle2 size={19} className="text-emerald-500" />}
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={open ? "open" : "closed"}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`mt-3 font-hand text-2xl leading-tight ${open ? "text-slate-700" : "text-slate-400"}`}
                          >
                            {open ? clue.text : "antippen"}
                          </motion.p>
                        </AnimatePresence>
                      </MotionButton>
                    );
                  })}
                </div>

                <div className="mt-auto flex items-end justify-between gap-5">
                  <motion.div
                    animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                    className="relative h-36 w-32 md:h-44 md:w-40"
                  >
                    <div className="absolute bottom-2 left-5 right-5 h-8 rounded-full blur-xl" style={{ backgroundColor: theme.glow }} />
                    <img src={companion.image} alt="" className="relative h-full w-full object-contain drop-shadow-xl" />
                  </motion.div>

                  <div className="flex min-w-0 flex-1 flex-col items-end gap-3">
                    <ProgressPath progress={mastery} accent={theme.accent} />
                    <div className="max-w-md rounded-[26px] border-2 border-white bg-white/76 px-4 py-3 text-right shadow-md backdrop-blur">
                      <p className="font-hand text-2xl font-bold text-slate-700">
                        {readyToAnswer ? "Jetzt entscheiden." : "Öffne zwei Spuren."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-[32px] border-4 border-white bg-white/72 p-5 shadow-lg backdrop-blur">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Puzzle size={20} style={{ color: theme.accent }} />
                    <h4 className="font-hand text-3xl font-bold text-slate-800">Antwort wählen</h4>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">
                    {openedClues.length}/3
                  </span>
                </div>

                <div className="grid gap-3">
                  {challenge.options.map((option, optionIndex) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === challenge.answer;
                    const locked = !readyToAnswer;
                    return (
                      <MotionButton
                        key={option}
                        data-testid={`deep-answer-${optionIndex}`}
                        whileHover={!locked ? { x: 4, scale: 1.01 } : undefined}
                        whileTap={!locked ? { scale: 0.98 } : undefined}
                        disabled={locked}
                        onClick={() => chooseAnswer(option)}
                        className={`min-h-20 rounded-[24px] border-2 px-4 py-4 text-left font-hand text-2xl font-bold leading-tight shadow-sm transition-all md:text-3xl ${
                          isSelected && answerFeedback === "richtig" && isCorrect
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : isSelected && answerFeedback === "falsch"
                              ? "border-rose-300 bg-rose-50 text-rose-800"
                              : locked
                                ? "border-white/70 bg-white/38 text-slate-300"
                                : "border-white bg-white/86 text-slate-700 hover:bg-white"
                        }`}
                      >
                        {option}
                      </MotionButton>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {selectedAnswer && (
                    <motion.div
                      key={`${selectedAnswer}-${answerFeedback}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`mt-4 rounded-[24px] border-2 px-4 py-3 ${
                        answerFeedback === "richtig" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"
                      }`}
                    >
                      <p className="font-hand text-2xl font-bold leading-tight">{getFeedbackText(challenge, selectedAnswer)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="rounded-[32px] border-4 border-white bg-white/72 p-5 shadow-lg backdrop-blur">
                <div className="mb-4 flex items-center gap-2">
                  <Brain size={20} style={{ color: theme.accent }} />
                  <h4 className="font-hand text-3xl font-bold text-slate-800">Begründung</h4>
                </div>

                <div className="grid gap-3">
                  {transferChoices.map((choice) => {
                    const active = selectedTransfer === choice.id;
                    const enabled = answerFeedback === "richtig";
                    return (
                      <MotionButton
                        key={choice.id}
                        data-testid={`deep-transfer-${choice.id}`}
                        whileHover={enabled ? { x: 4, scale: 1.01 } : undefined}
                        whileTap={enabled ? { scale: 0.98 } : undefined}
                        disabled={!enabled}
                        onClick={() => chooseTransfer(choice)}
                        className={`min-h-16 rounded-[22px] border-2 px-4 py-3 text-left font-hand text-xl font-bold leading-tight shadow-sm transition-all ${
                          !enabled
                            ? "border-white/70 bg-white/36 text-slate-300"
                            : active && transferFeedback === "richtig"
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                              : active && transferFeedback === "falsch"
                                ? "border-rose-300 bg-rose-50 text-rose-800"
                                : "border-white bg-white/84 text-slate-700 hover:bg-white"
                        }`}
                      >
                        {choice.text}
                      </MotionButton>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-[24px] border-2 border-white/80 bg-slate-900 px-4 py-3 text-white shadow-md">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={19} />
                    <span className="font-hand text-2xl font-bold">Verstehen zählt</span>
                  </div>
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          aria-hidden
          className="absolute right-5 top-5 h-16 w-16 rounded-full"
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.14, 1], rotate: [0, 8, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: `radial-gradient(circle, ${theme.glow}, transparent 68%)` }}
        />
        <Wand2 className="absolute bottom-5 right-6 text-white/70 drop-shadow" size={28} aria-hidden />
      </div>
    </section>
  );
}
