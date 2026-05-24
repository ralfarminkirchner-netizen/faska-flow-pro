import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../../utils/sounds";

const FLOWERS = {
  rose: { name: "Rosenblume", petal: "#fb7185", center: "#fef08a", leaf: "#86efac" },
  sun: { name: "Sonnenblume", petal: "#facc15", center: "#92400e", leaf: "#65a30d" },
  sky: { name: "Himmelblume", petal: "#60a5fa", center: "#dbeafe", leaf: "#22c55e" },
  violet: { name: "Lila Blume", petal: "#a78bfa", center: "#fbcfe8", leaf: "#34d399" },
  coral: { name: "Korallenblume", petal: "#fb923c", center: "#fde68a", leaf: "#84cc16" },
};

const ROUNDS = [
  {
    title: "Zwei Farben tanzen",
    hint: "Rot, Gelb, Rot, Gelb ...",
    pattern: ["rose", "sun", "rose", "sun"],
    answer: "rose",
    options: ["rose", "sun", "sky", "violet"],
  },
  {
    title: "Immer ein blauer Stern",
    hint: "Gelb, Blau, Rot, Gelb, Blau, Rot ...",
    pattern: ["sun", "sky", "rose", "sun", "sky"],
    answer: "rose",
    options: ["rose", "coral", "violet", "sun"],
  },
  {
    title: "Doppelte Freunde",
    hint: "Lila, Lila, Rot, Lila, Lila, Rot ...",
    pattern: ["violet", "violet", "rose", "violet", "violet"],
    answer: "rose",
    options: ["rose", "sky", "sun", "coral"],
  },
  {
    title: "Warmer Gartenweg",
    hint: "Orange, Gelb, Gelb, Orange, Gelb, Gelb ...",
    pattern: ["coral", "sun", "sun", "coral", "sun"],
    answer: "sun",
    options: ["sky", "sun", "rose", "violet"],
  },
];

function Flower({ kind, muted = false, small = false }) {
  const flower = FLOWERS[kind] || FLOWERS.rose;
  const size = small ? 72 : 96;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={`drop-shadow-md ${muted ? "opacity-35" : ""}`}>
      <g className="watercolor-effect">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx="60"
            cy="42"
            rx="16"
            ry="28"
            fill={flower.petal}
            opacity="0.82"
            stroke="#ffffff"
            strokeWidth="2"
            transform={`rotate(${deg} 60 60)`}
          />
        ))}
        <circle cx="60" cy="60" r="17" fill={flower.center} stroke="#fff7ed" strokeWidth="3" />
        <path d="M60 76 C60 90 56 101 47 112" stroke={flower.leaf} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M58 92 C43 85 34 87 28 98 C42 100 51 99 58 92Z" fill={flower.leaf} opacity="0.72" />
      </g>
    </svg>
  );
}

export default function MusterGarten({ onCorrect = () => {}, onWrong = () => {} }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const round = ROUNDS[roundIndex];

  const chooseFlower = (kind) => {
    if (feedback === "richtig") return;
    setSelected(kind);
    playPop();

    if (kind === round.answer) {
      setFeedback("richtig");
      playSparkle();
      onCorrect(5);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.72 } });
    } else {
      setFeedback("falsch");
      playError();
      onWrong();
      setTimeout(() => {
        setFeedback(null);
        setSelected(null);
      }, 1300);
    }
  };

  const nextRound = () => {
    playPop();
    setRoundIndex((roundIndex + 1) % ROUNDS.length);
    setSelected(null);
    setFeedback(null);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8 w-full max-w-5xl mx-auto">
      <div className="text-center">
        <h2 className="font-hand text-5xl font-bold text-slate-800">Muster-Garten</h2>
        <p className="font-hand text-2xl text-slate-500 mt-2">Welche Blume wächst als Nächstes?</p>
      </div>

      <div className="w-full bg-emerald-50/70 rounded-[50px] border-4 border-white shadow-2xl p-8 paper-texture">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-emerald-600">Runde {roundIndex + 1}</p>
            <h3 className="font-hand text-4xl font-bold text-slate-700">{round.title}</h3>
          </div>
          <p className="font-hand text-2xl text-emerald-700 bg-white/70 px-5 py-3 rounded-[24px] border-2 border-emerald-100">
            {round.hint}
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-end gap-3 md:gap-6 bg-white/60 rounded-[40px] border-4 border-dashed border-emerald-200 px-4 py-10">
          {round.pattern.map((kind, index) => (
            <motion.div key={`${kind}-${index}`} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: index * 0.06 }}>
              <Flower kind={kind} />
            </motion.div>
          ))}

          <motion.div
            animate={feedback === "richtig" ? { scale: [1, 1.12, 1], rotate: [0, -2, 2, 0] } : {}}
            className="w-28 h-28 md:w-32 md:h-32 rounded-[34px] border-4 border-dashed border-amber-300 bg-amber-50/80 flex items-center justify-center shadow-inner"
          >
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Flower kind={selected} small />
                </motion.div>
              ) : (
                <motion.span key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-hand text-6xl text-amber-500">?</motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
        {round.options.map((kind) => {
          const isChosen = selected === kind;
          return (
            <motion.button
              key={kind}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => chooseFlower(kind)}
              className={`bg-white/80 rounded-[30px] border-4 p-4 shadow-lg flex flex-col items-center gap-2 transition-all ${
                isChosen ? "border-emerald-300 ring-4 ring-emerald-100" : "border-white hover:border-emerald-100"
              }`}
            >
              <Flower kind={kind} small />
              <span className="font-hand text-xl font-bold text-slate-600">{FLOWERS[kind].name}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="min-h-20 flex flex-col items-center gap-4">
        {feedback === "falsch" && <p className="font-hand text-3xl font-bold text-rose-500">Fast. Schau noch einmal auf den Rhythmus der Blumen.</p>}
        {feedback === "richtig" && (
          <>
            <p className="font-hand text-3xl font-bold text-emerald-600">Genau. Das Muster wächst weiter.</p>
            <button onClick={nextRound} className="px-8 py-3 bg-emerald-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg">
              Weiterpflanzen
            </button>
          </>
        )}
      </div>
    </div>
  );
}
