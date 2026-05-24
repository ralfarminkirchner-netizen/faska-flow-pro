import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../../utils/sounds";
import { DEUTSCH_CONTENT } from "../../data/learningContent";

const STORIES = DEUTSCH_CONTENT.stories;

function StoryCard({ card, faded = false }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18, rotate: -1 }}
      animate={{ opacity: faded ? 0.45 : 1, y: 0, rotate: 0 }}
      className="min-h-52 bg-white/85 rounded-[36px] border-4 border-white shadow-xl p-6 flex flex-col justify-between watercolor-effect"
    >
      <span className="text-6xl md:text-7xl drop-shadow-sm">{card.icon}</span>
      <p className="font-hand text-2xl md:text-3xl font-bold leading-tight text-slate-700">{card.text}</p>
    </motion.div>
  );
}

export default function GeschichtenGarten({ onCorrect = () => {}, onWrong = () => {} }) {
  const [storyIndex, setStoryIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const story = STORIES[storyIndex];
  const pickedCard = story.options.find((option) => option.id === picked);

  const chooseCard = (id) => {
    if (feedback === "richtig") return;
    setPicked(id);
    playPop();

    if (id === story.answer) {
      setFeedback("richtig");
      playSparkle();
      onCorrect(5);
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.68 } });
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

  const nextStory = () => {
    playPop();
    setStoryIndex((storyIndex + 1) % STORIES.length);
    setPicked(null);
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 flex flex-col gap-8">
      <div className="text-center">
        <h2 className="font-hand text-5xl font-bold text-slate-800">Geschichten-Garten</h2>
        <p className="font-hand text-2xl text-slate-500 mt-2">Welche Karte erzählt die Geschichte gut weiter?</p>
      </div>

      <div className="bg-amber-50/70 rounded-[52px] border-4 border-white shadow-2xl p-8 paper-texture">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
          <div>
            <p className="font-sans text-xs uppercase font-bold tracking-widest text-amber-600">Bilderfolge</p>
            <h3 className="font-hand text-4xl font-bold text-slate-700">{story.title}</h3>
          </div>
          {feedback === "richtig" && (
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-hand text-2xl text-emerald-700 bg-white/70 px-5 py-3 rounded-[26px] border-2 border-emerald-100">
              {story.ending}
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {story.cards.map((card, index) => (
            <StoryCard key={`${story.title}-${index}`} card={card} />
          ))}

          <div className="min-h-52 bg-white/55 rounded-[36px] border-4 border-dashed border-amber-300 shadow-inner p-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {pickedCard ? (
                <StoryCard key={pickedCard.id} card={pickedCard} faded={feedback === "falsch"} />
              ) : (
                <motion.div key="blank" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <p className="font-hand text-7xl text-amber-500 mb-2">?</p>
                  <p className="font-hand text-2xl text-slate-400">Hier fehlt eine Karte.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {story.options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => chooseCard(option.id)}
            className={`bg-white/85 rounded-[32px] border-4 p-5 shadow-lg text-left flex items-center gap-4 transition-all ${
              picked === option.id ? "border-amber-300 ring-4 ring-amber-100" : "border-white hover:border-amber-100"
            }`}
          >
            <span className="text-5xl">{option.icon}</span>
            <span className="font-hand text-2xl font-bold text-slate-700 leading-tight">{option.text}</span>
          </motion.button>
        ))}
      </div>

      <div className="min-h-20 text-center">
        {feedback === "falsch" && <p className="font-hand text-3xl font-bold text-rose-500">Das passt noch nicht ganz zur Geschichte.</p>}
        {feedback === "richtig" && (
          <button onClick={nextStory} className="px-8 py-3 bg-amber-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg">
            Nächste Geschichte
          </button>
        )}
      </div>
    </div>
  );
}
