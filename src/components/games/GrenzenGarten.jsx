import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../../utils/sounds";

const SCENES = [
  {
    title: "Zu nah",
    text: "Jemand möchte dich kitzeln, obwohl du gerade nicht willst.",
    answer: "stop",
    options: [
      { id: "laugh", label: "Einfach lachen, obwohl es blöd ist", icon: "😬" },
      { id: "stop", label: "Stopp. Ich möchte das nicht.", icon: "✋" },
      { id: "hide", label: "Nichts sagen und wegschauen", icon: "🙈" },
    ],
    wisdom: "Dein Körper gehört dir. Ein klares Stopp ist erlaubt.",
  },
  {
    title: "Schweres Geheimnis",
    text: "Ein Geheimnis fühlt sich im Bauch schwer und komisch an.",
    answer: "tell",
    options: [
      { id: "tell", label: "Es einem sicheren Erwachsenen erzählen", icon: "🗣️" },
      { id: "keep", label: "Es für immer behalten", icon: "🤐" },
      { id: "joke", label: "Einen Witz daraus machen", icon: "🎭" },
    ],
    wisdom: "Schwere Geheimnisse darf man erzählen. Hilfe holen ist mutig.",
  },
  {
    title: "Nein sagen",
    text: "Du sollst etwas machen, das sich für dich nicht richtig anfühlt.",
    answer: "pause",
    options: [
      { id: "pause", label: "Ich brauche kurz Zeit. Ich frage erst nach.", icon: "🧭" },
      { id: "rush", label: "Schnell ja sagen", icon: "🏃" },
      { id: "angry", label: "Sofort schreien", icon: "🌋" },
    ],
    wisdom: "Ein langsames Nein oder eine Pause kann sehr klug sein.",
  },
  {
    title: "Freundschaft",
    text: "Ein Freund will nur spielen, wenn immer er bestimmen darf.",
    answer: "fair",
    options: [
      { id: "fair", label: "Lass uns abwechseln.", icon: "🔁" },
      { id: "giveup", label: "Immer nachgeben", icon: "🫥" },
      { id: "leave", label: "Nie wieder reden", icon: "🚪" },
    ],
    wisdom: "Gute Freundschaft hat Platz für beide Stimmen.",
  },
];

export default function GrenzenGarten({ onCorrect = () => {}, onWrong = () => {} }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const scene = SCENES[sceneIndex];

  const choose = (id) => {
    if (feedback === "richtig") return;
    setPicked(id);
    playPop();
    if (id === scene.answer) {
      setFeedback("richtig");
      playSparkle();
      onCorrect(5);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.75 } });
    } else {
      setFeedback("falsch");
      playError();
      onWrong();
      setTimeout(() => {
        setPicked(null);
        setFeedback(null);
      }, 1400);
    }
  };

  const next = () => {
    playPop();
    setSceneIndex((sceneIndex + 1) % SCENES.length);
    setPicked(null);
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 flex flex-col gap-8">
      <div className="text-center">
        <h3 className="font-hand text-5xl font-bold text-slate-800">Grenzen-Garten</h3>
        <p className="font-hand text-2xl text-slate-500 mt-2">Übe klare, freundliche und sichere Sätze.</p>
      </div>

      <div className="bg-rose-50/70 rounded-[56px] border-4 border-white shadow-2xl p-8 paper-texture">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-rose-600">Szene {sceneIndex + 1}</p>
        <h4 className="font-hand text-5xl font-bold text-slate-800 mt-1">{scene.title}</h4>
        <p className="font-hand text-3xl text-slate-600 mt-4 leading-snug">{scene.text}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scene.options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => choose(option.id)}
            className={`bg-white/85 rounded-[34px] border-4 p-5 shadow-lg text-left flex flex-col gap-4 transition-all min-h-52 ${
              picked === option.id ? "border-rose-300 ring-4 ring-rose-100" : "border-white hover:border-rose-100"
            }`}
          >
            <span className="text-6xl">{option.icon}</span>
            <span className="font-hand text-3xl font-bold text-slate-700 leading-tight">{option.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="min-h-28 text-center">
        <AnimatePresence mode="wait">
          {feedback === "falsch" && (
            <motion.p key="wrong" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-hand text-3xl font-bold text-rose-500">
              Such den Satz, der dich schützt und ruhig klar bleibt.
            </motion.p>
          )}
          {feedback === "richtig" && (
            <motion.div key="right" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
              <p className="font-hand text-3xl font-bold text-rose-700 max-w-3xl">{scene.wisdom}</p>
              <button onClick={next} className="px-8 py-3 bg-rose-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg">
                Nächste Szene
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
