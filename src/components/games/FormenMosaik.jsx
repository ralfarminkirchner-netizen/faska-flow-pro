import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../../utils/sounds";

const SHAPES = {
  circle: { label: "Kreis", color: "#fb7185", icon: "●" },
  square: { label: "Quadrat", color: "#60a5fa", icon: "■" },
  triangle: { label: "Dreieck", color: "#facc15", icon: "▲" },
  diamond: { label: "Raute", color: "#34d399", icon: "◆" },
};

const PUZZLES = [
  { title: "Mosaik-Rand", pattern: ["circle", "square", "circle", null, "circle", "square"], answer: "square", options: ["triangle", "square", "diamond", "circle"] },
  { title: "Dach und Fenster", pattern: ["triangle", "square", "triangle", "square", null, "square"], answer: "triangle", options: ["circle", "diamond", "triangle", "square"] },
  { title: "Glitzersteine", pattern: ["diamond", "circle", "square", "diamond", "circle", null], answer: "square", options: ["square", "triangle", "diamond", "circle"] },
  { title: "Ruhiger Teppich", pattern: ["square", "square", "circle", "square", "square", null], answer: "circle", options: ["triangle", "circle", "diamond", "square"] },
];

function ShapeTile({ shapeId, blank = false }) {
  if (blank) {
    return <span className="font-hand text-6xl text-violet-400">?</span>;
  }
  const shape = SHAPES[shapeId];
  return (
    <span className="text-6xl drop-shadow-sm" style={{ color: shape.color }}>
      {shape.icon}
    </span>
  );
}

export default function FormenMosaik({ onCorrect = () => {}, onWrong = () => {} }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const puzzle = PUZZLES[puzzleIndex];

  const choose = (shapeId) => {
    if (feedback === "richtig") return;
    setSelected(shapeId);
    playPop();

    if (shapeId === puzzle.answer) {
      setFeedback("richtig");
      playSparkle();
      onCorrect(5);
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.72 } });
    } else {
      setFeedback("falsch");
      playError();
      onWrong();
      setTimeout(() => {
        setSelected(null);
        setFeedback(null);
      }, 1200);
    }
  };

  const next = () => {
    playPop();
    setPuzzleIndex((puzzleIndex + 1) % PUZZLES.length);
    setSelected(null);
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 flex flex-col gap-8">
      <div className="text-center">
        <h2 className="font-hand text-5xl font-bold text-slate-800">Formen-Mosaik</h2>
        <p className="font-hand text-2xl text-slate-500 mt-2">Setze das Muster mit der richtigen Form fort.</p>
      </div>

      <div className="bg-violet-50/70 rounded-[56px] border-4 border-white shadow-2xl p-8 paper-texture">
        <div className="mb-7 text-center">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-600">Mosaik</p>
          <h3 className="font-hand text-4xl font-bold text-slate-700">{puzzle.title}</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {puzzle.pattern.map((shapeId, index) => {
            const blank = shapeId === null;
            return (
              <motion.div
                key={`${puzzleIndex}-${index}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: index % 2 === 0 ? -1 : 1 }}
                transition={{ delay: index * 0.06 }}
                className={`aspect-square rounded-[34px] border-4 shadow-lg flex items-center justify-center ${
                  blank ? "bg-amber-50 border-dashed border-violet-300" : "bg-white/85 border-white"
                }`}
              >
                <AnimatePresence mode="wait">
                  {blank && selected ? (
                    <motion.div key={selected} initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <ShapeTile shapeId={selected} />
                    </motion.div>
                  ) : (
                    <motion.div key={shapeId ?? "blank"} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <ShapeTile shapeId={shapeId} blank={blank} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {puzzle.options.map((shapeId) => (
          <motion.button
            key={shapeId}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => choose(shapeId)}
            className={`w-28 h-28 rounded-[32px] border-4 bg-white shadow-lg flex flex-col items-center justify-center transition-all ${
              selected === shapeId ? "border-violet-300 ring-4 ring-violet-100" : "border-white hover:border-violet-100"
            }`}
          >
            <ShapeTile shapeId={shapeId} />
            <span className="font-hand text-xl font-bold text-slate-600">{SHAPES[shapeId].label}</span>
          </motion.button>
        ))}
      </div>

      <div className="min-h-20 text-center">
        {feedback === "falsch" && <p className="font-hand text-3xl font-bold text-rose-500">Schau auf die Reihenfolge der Formen.</p>}
        {feedback === "richtig" && (
          <div className="flex flex-col items-center gap-4">
            <p className="font-hand text-3xl font-bold text-violet-700">Das Mosaik ist vollständig.</p>
            <button onClick={next} className="px-8 py-3 bg-violet-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg">
              Neues Mosaik
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
