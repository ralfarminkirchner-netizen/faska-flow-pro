import { lazy, Suspense, useState, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../utils/sounds";
import GeschichtenGarten from "../components/games/GeschichtenGarten";
import BuchstabenWiese from "../components/games/BuchstabenWiese";
import WortSchatzMemory from "../components/games/WortSchatzMemory";
import VariantStudio from "../components/games/VariantStudio";
import ActionArena from "../components/games/ActionArena";
import GameWorld from "../components/games/GameWorld";
import QuestMixer from "../components/games/QuestMixer";
import {
  DEUTSCH_CONTENT,
  LAB_DICTIONARY as WORD_LAB_DICTIONARY,
  LAB_SYLLABLES,
  SUBJECT_VARIANT_CONTENT,
} from "../data/learningContent";

const SubjectPremiumAtelier = lazy(() => import("../components/games/SubjectPremiumAtelier"));
const SkyWonderland = lazy(() => import("../components/games/SkyWonderland"));
const DeepLearningQuest = lazy(() => import("../components/games/DeepLearningQuest"));
const LearningArcade = lazy(() => import("../components/games/LearningArcade"));

// --- Game 1: Wortarten (House of Word Classes) ---
const deutschUebungen = DEUTSCH_CONTENT.wordClassExercises;

const WORD_CLASSES = {
  Artikel: { color: "#0ea5e9", bg: "bg-sky-50", border: "border-sky-300", icon: "A" },
  Nomen: { color: "#f43f5e", bg: "bg-rose-50", border: "border-rose-300", icon: "N" },
  Verb: { color: "#8b5cf6", bg: "bg-violet-50", border: "border-violet-300", icon: "V" },
  Adjektiv: { color: "#f59e0b", bg: "bg-amber-50", border: "border-amber-300", icon: "Adj" },
  Präposition: { color: "#14b8a6", bg: "bg-teal-50", border: "border-teal-300", icon: "Präp" },
};

const WordHouse = ({ type, words = [], containerRef }) => {
  const config = WORD_CLASSES[type];
  return (
    <div className={`flex-1 min-w-[140px] min-h-[180px] rounded-[30px_30px_10px_10px] border-2 border-dashed ${config.border} ${config.bg} flex flex-col items-center p-4 relative watercolor-effect transition-all`}>
      <div className="absolute -top-6 w-12 h-12 rounded-full bg-white border-2 border-inherit flex items-center justify-center shadow-md">
        <span className="font-hand text-xl font-bold" style={{ color: config.color }}>{config.icon}</span>
      </div>
      <h4 className="mt-4 font-hand text-xl font-bold mb-3" style={{ color: config.color }}>{type}</h4>
      <div className="flex flex-col gap-2 w-full">
        <AnimatePresence>
          {words.map((w, i) => (
            <motion.div key={w + i} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="bg-white px-3 py-1.5 rounded-xl shadow-sm text-center font-hand text-lg border border-slate-100">{w}</motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DraggableWord = ({ word, onDragEnd, containerRef }) => (
  <motion.div drag dragConstraints={containerRef} dragElastic={0.1} dragMomentum={false} onDragEnd={(e, info) => onDragEnd(word, info.point)} whileDrag={{ scale: 1.15, rotate: [0, -2, 2, 0], zIndex: 100 }} whileHover={{ scale: 1.05, y: -2 }} className="px-6 py-3 bg-white rounded-2xl shadow-md border-2 border-slate-100 cursor-grab active:cursor-grabbing font-hand text-3xl text-slate-700">
    {word}
  </motion.div>
);

function WortartenGame({ onCorrect, onWrong }) {
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [assigned, setAssigned] = useState({});
  const [remainingWords, setRemainingWords] = useState(deutschUebungen[0].satz);
  const [feedback, setFeedback] = useState(null);
  const containerRef = useRef(null);
  const housesRef = useRef({});
  const exercise = deutschUebungen[exerciseIdx];

  const handleDrop = (word, point) => {
    let droppedInType = null;
    Object.keys(WORD_CLASSES).forEach(type => {
      const el = housesRef.current[type];
      if (el) {
        const rect = el.getBoundingClientRect();
        const rectLeft = rect.left + window.scrollX;
        const rectRight = rect.right + window.scrollX;
        const rectTop = rect.top + window.scrollY;
        const rectBottom = rect.bottom + window.scrollY;
        // Expand hit area slightly
        if (point.x >= rectLeft - 20 && point.x <= rectRight + 20 && point.y >= rectTop - 20 && point.y <= rectBottom + 20) {
           droppedInType = type;
        }
      }
    });

    if (droppedInType) {
      playPop();
      setAssigned(prev => ({ ...prev, [droppedInType]: [...(prev[droppedInType] || []), word] }));
      setRemainingWords(prev => prev.filter(w => w !== word));
    }
  };

  const checkResult = () => {
    let isCorrect = true;
    Object.entries(assigned).forEach(([type, words]) => { words.forEach(w => { if (exercise.loesung[w] !== type) isCorrect = false; }); });
    if (isCorrect && remainingWords.length === 0) { playSparkle(); setFeedback("richtig"); onCorrect(5); confetti({ particleCount: 150 }); }
    else { playError(); setFeedback("falsch"); setTimeout(() => setFeedback(null), 3000); onWrong(); }
  };

  const reset = () => { playPop(); setAssigned({}); setRemainingWords(exercise.satz); setFeedback(null); };

  const nextExercise = () => {
    const nextIdx = (exerciseIdx + 1) % deutschUebungen.length;
    setExerciseIdx(nextIdx); reset(); setRemainingWords(deutschUebungen[nextIdx].satz);
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-10 w-full pb-20">
      <div className="text-center space-y-4">
        <h2 className="font-hand text-4xl font-bold text-slate-800">Das Haus der Wortarten</h2>
        <p className="font-hand text-2xl text-slate-500">Ziehe jedes Wort in sein richtiges Haus!</p>
      </div>
      <div className="bg-white/40 rounded-[40px] p-8 border-4 border-dashed border-white/60 min-h-[140px] flex flex-wrap justify-center items-center gap-4 relative z-50">
        <AnimatePresence>
          {remainingWords.map((w, i) => <DraggableWord key={w + i} word={w} onDragEnd={handleDrop} containerRef={containerRef} />)}
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-2 mt-8">
        {exercise.wortarten.map(type => (
          <div key={type} ref={el => housesRef.current[type] = el}>
            <WordHouse type={type} words={assigned[type]} containerRef={containerRef} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between bg-white/70 p-6 rounded-[30px] shadow-xl mt-4">
         <button onClick={reset} className="font-hand text-2xl text-slate-400 hover:text-slate-600 px-4">Nochmal sortieren</button>
         <div>
          {!feedback || feedback === "falsch" ? (
            <motion.button onClick={checkResult} disabled={remainingWords.length > 0} className="px-12 py-4 bg-violet-500 text-white font-bold text-xl rounded-2xl shadow-lg disabled:opacity-30">Kontrollieren</motion.button>
          ) : (
            <motion.button onClick={nextExercise} className="px-12 py-4 bg-emerald-500 text-white font-bold text-xl rounded-2xl shadow-lg">Nächster Satz →</motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Game 2: Silben Klatschen ---
const silbenWoerter = DEUTSCH_CONTENT.syllableWords;

function SilbenGame({ onCorrect, onWrong }) {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const current = silbenWoerter[idx];

  const check = (num) => {
    if (num === current.silben) {
      playSparkle(); setFeedback("richtig"); onCorrect(2); confetti();
      setTimeout(() => { setIdx((idx + 1) % silbenWoerter.length); setFeedback(null); }, 2000);
    } else {
      playError(); setFeedback("falsch"); onWrong(); setTimeout(() => setFeedback(null), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 py-10 w-full max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="font-hand text-5xl font-bold text-slate-800">Silben klatschen!</h2>
        <p className="font-hand text-2xl text-slate-500 mt-2">Wie oft musst du bei diesem Wort klatschen?</p>
      </div>

      <div className="bg-amber-100 rounded-[50px] p-20 shadow-inner border-4 border-amber-300 w-full flex justify-center mt-8">
        <motion.p key={current.wort} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-hand text-8xl font-bold text-amber-800 tracking-wide">
          {current.wort}
        </motion.p>
      </div>

      <div className="flex gap-6 mt-8">
        {[1, 2, 3, 4].map(num => (
          <motion.button 
            key={num} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => check(num)}
            className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-sky-300 text-5xl font-hand font-bold text-sky-600 hover:bg-sky-50"
          >
            {num}
          </motion.button>
        ))}
      </div>
      
      {feedback === "falsch" && <p className="font-hand text-3xl text-red-500 font-bold mt-4">Oh, fast! Probier nochmal!</p>}
      {feedback === "richtig" && <p className="font-hand text-3xl text-emerald-500 font-bold mt-4">Super gemacht!</p>}
    </div>
  )
}

// --- Game 3: Satzbau (Sentence Building) ---
const satzbauUebungen = DEUTSCH_CONTENT.sentenceExercises;

function SatzbauGame({ onCorrect, onWrong }) {
  const [idx, setIdx] = useState(0);
  const [words, setWords] = useState(satzbauUebungen[0].worte);
  const [feedback, setFeedback] = useState(null);

  const check = () => {
    const currentSentence = words.join(" ");
    if (currentSentence === satzbauUebungen[idx].loesung) {
      playSparkle(); setFeedback("richtig"); onCorrect(5); confetti();
      setTimeout(() => {
        const nextIdx = (idx + 1) % satzbauUebungen.length;
        setIdx(nextIdx);
        setWords(satzbauUebungen[nextIdx].worte);
        setFeedback(null);
      }, 3000);
    } else {
      playError(); setFeedback("falsch"); onWrong(); setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-10 w-full max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="font-hand text-4xl font-bold text-slate-800">Satzbaumeister</h2>
        <p className="font-hand text-2xl text-slate-500 mt-2">Bringe die Wörter in die richtige Reihenfolge!</p>
      </div>

      <div className="bg-sky-50 rounded-[40px] px-4 py-12 border-4 border-dashed border-sky-200 w-full flex justify-center shadow-inner mt-4">
        <Reorder.Group axis="x" values={words} onReorder={setWords} className="flex flex-wrap justify-center gap-4">
          {words.map((word) => (
            <Reorder.Item 
              key={word} value={word}
              className="px-6 py-4 bg-white rounded-2xl shadow-md border-2 border-slate-100 font-hand text-4xl text-slate-700 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
            >
              {word}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      <motion.button 
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
        onClick={check} 
        className="px-10 py-4 bg-sky-500 text-white font-bold text-xl rounded-2xl shadow-lg mt-4"
      >
        Satz überprüfen
      </motion.button>
      
      {feedback === "falsch" && <p className="font-hand text-2xl text-red-500 font-bold">Das klingt noch etwas komisch. Versuche es weiter!</p>}
      {feedback === "richtig" && <p className="font-hand text-2xl text-emerald-500 font-bold">Prima! Ein toller Satz.</p>}
    </div>
  );
}

// --- Game 4: Wort-Labor (Discovery Engine) ---
const LAB_DICTIONARY = WORD_LAB_DICTIONARY;
const SYLLABLES = LAB_SYLLABLES;

function WortLaborGame({ onCorrect, onWrong }) {
  const [inCauldron, setInCauldron] = useState([]);
  const [discovered, setDiscovered] = useState([]);
  const [isBrewing, setIsBrewing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const addSyllable = (s) => {
    if (isBrewing) return;
    playPop();
    setInCauldron(prev => [...prev, s]);
  };

  const clearCauldron = () => {
    playPop();
    setInCauldron([]);
    setFeedback(null);
  };

  const brew = () => {
    if (inCauldron.length === 0) return;
    setIsBrewing(true);
    const word = inCauldron.join("");
    
    setTimeout(() => {
      setIsBrewing(false);
      if (LAB_DICTIONARY[word]) {
        if (!discovered.includes(word)) {
          setDiscovered(prev => [...prev, word]);
          playSparkle();
          setFeedback({ type: "success", text: `Entdeckt: ${word} ${LAB_DICTIONARY[word]}!` });
          onCorrect(10);
          confetti({ particleCount: 100, origin: { y: 0.8 } });
        } else {
          setFeedback({ type: "info", text: "Das kennst du schon!" });
        }
      } else {
        playError();
        setFeedback({ type: "error", text: "Hm, das gibt es wohl noch nicht..." });
        onWrong();
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 items-center py-6 w-full max-w-5xl mx-auto">
      <div className="text-center">
        <h2 className="font-hand text-5xl font-bold text-slate-800">Das Wort-Labor</h2>
        <p className="font-hand text-2xl text-slate-500 mt-2">Mixe Silben im Zauberkessel und entdecke neue Wörter!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full mt-4">
        {/* Left: Ingredient Shelf */}
        <div className="bg-white/60 rounded-[40px] p-8 border-4 border-white shadow-xl">
          <h3 className="font-hand text-3xl font-bold text-slate-700 mb-6 border-b pb-2">Zutaten-Regal</h3>
          <div className="flex flex-wrap gap-3 max-h-[400px] overflow-y-auto pr-2">
            {SYLLABLES.map((s, i) => (
              <motion.button
                key={s + i} whileHover={{ scale: 1.1, rotate: 2 }} whileTap={{ scale: 0.9 }}
                onClick={() => addSyllable(s)}
                className="px-4 py-2 bg-amber-50 rounded-xl border-2 border-amber-200 font-hand text-2xl text-amber-900 shadow-sm hover:shadow-md transition-all"
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right: Cauldron Area */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Cauldron SVG */}
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
              <path d="M40 80 Q40 60 100 60 Q160 60 160 80 L170 140 Q170 180 100 180 Q30 180 30 140 Z" fill="#475569" stroke="#1e293b" strokeWidth="4" />
              <ellipse cx="100" cy="80" rx="60" ry="15" fill="#334155" />
              <path d="M50 80 Q50 75 100 75 Q150 75 150 80 Q150 85 100 85 Q50 85 50 80" fill={isBrewing ? "#8b5cf6" : "#4f46e5"} opacity="0.6">
                <animate attributeName="fill" values="#4f46e5;#8b5cf6;#4f46e5" dur="3s" repeatCount="Indefinite" />
              </path>
              {isBrewing && (
                <>
                  <circle cx="70" cy="70" r="5" fill="#a78bfa"><animate attributeName="cy" values="70;30;70" dur="1s" repeatCount="Indefinite" /><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="Indefinite" /></circle>
                  <circle cx="100" cy="65" r="8" fill="#c4b5fd"><animate attributeName="cy" values="65;20;65" dur="1.5s" repeatCount="Indefinite" /><animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="Indefinite" /></circle>
                  <circle cx="130" cy="70" r="6" fill="#ddd6fe"><animate attributeName="cy" values="70;40;70" dur="1.2s" repeatCount="Indefinite" /><animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="Indefinite" /></circle>
                </>
              )}
            </svg>
            
            {/* Content in Cauldron */}
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 text-center w-full px-4 overflow-hidden">
               <div className="flex flex-wrap justify-center gap-1">
                 {inCauldron.map((s, i) => (
                   <motion.span key={i} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-hand text-xl font-bold text-white drop-shadow-md">
                     {s}
                   </motion.span>
                 ))}
               </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={clearCauldron} className="px-6 py-2 bg-slate-200 rounded-xl font-hand text-xl text-slate-600 hover:bg-slate-300">Leeren</button>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={brew} disabled={inCauldron.length === 0 || isBrewing}
              className={`px-12 py-4 rounded-2xl font-bold text-2xl shadow-lg transition-all ${isBrewing ? "bg-purple-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
            >
              {isBrewing ? "Brodelt..." : "Brauen! ✨"}
            </motion.button>
          </div>
        </div>
      </div>

      {feedback && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`px-8 py-4 rounded-2xl font-hand text-3xl font-bold border-2 ${feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : feedback.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
          {feedback.text}
        </motion.div>
      )}

      {discovered.length > 0 && (
        <div className="w-full mt-8 bg-white/40 p-6 rounded-3xl border-2 border-white">
          <h3 className="font-hand text-2xl font-bold text-slate-600 mb-4 text-center italic">Deine Entdeckungen:</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {discovered.map(w => (
              <div key={w} className="px-4 py-2 bg-white/80 rounded-xl border border-slate-200 shadow-sm font-hand text-xl text-slate-700">
                {w} {LAB_DICTIONARY[w]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Game 5: Der Artikel-See (Der, Die, Das) ---
const ARTIKEL_WORDS = DEUTSCH_CONTENT.articleWords;

function ArtikelSeeGame({ onCorrect, onWrong }) {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const dropZoneRef = useRef(null);
  const currentWord = ARTIKEL_WORDS[idx];

  const handleDrop = (artikelArtikel) => {
    if (artikelArtikel === currentWord.artikel) {
      playSparkle(); setFeedback("richtig"); onCorrect(3); confetti();
      setTimeout(() => {
        setIdx((idx + 1) % ARTIKEL_WORDS.length);
        setFeedback(null);
      }, 2000);
    } else {
      playError(); setFeedback("falsch"); onWrong(); 
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 py-8 w-full max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="font-hand text-5xl font-bold text-slate-800">Der Artikel-See</h2>
        <p className="font-hand text-2xl text-slate-500 mt-2">Zieh den richtigen Frosch auf das Blatt!</p>
      </div>

      <div className="flex gap-6 pb-6">
        {["Der", "Die", "Das"].map(art => (
          <motion.div
            key={art} drag dragSnapToOrigin whileDrag={{ scale: 1.2, zIndex: 50 }} whileHover={{ scale: 1.1 }}
            onDragStart={(e) => e.dataTransfer?.setData("text", art)} /* Fallback if using native, but we use framer */
            onDragEnd={(e, info) => {
               if (!dropZoneRef.current) return;
               const rect = dropZoneRef.current.getBoundingClientRect();
               const rectLeft = rect.left + window.scrollX;
               const rectRight = rect.right + window.scrollX;
               const rectTop = rect.top + window.scrollY;
               const rectBottom = rect.bottom + window.scrollY;
               
               if (info.point.x >= rectLeft - 30 && info.point.x <= rectRight + 30 && 
                   info.point.y >= rectTop - 30 && info.point.y <= rectBottom + 30) {
                  handleDrop(art);
               }
            }}
            className="w-24 h-24 bg-emerald-100 rounded-full border-4 border-emerald-400 shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing relative watercolor-effect"
          >
            <span className="absolute -top-2 text-4xl">🐸</span>
            <span className="font-hand font-bold text-3xl text-emerald-800 mt-4">{art}</span>
          </motion.div>
        ))}
      </div>

      <div className="w-full h-[300px] bg-gradient-to-b from-sky-200 to-blue-400 rounded-[60px] border-8 border-sky-100 shadow-inner relative flex items-center justify-center overflow-hidden">
        {/* Ripples */}
        <div className="absolute w-[400px] h-[150px] border-4 border-white/20 rounded-[50%] animate-ping" style={{ animationDuration: '4s' }} />
        
        {/* Lily pad */}
        <motion.div 
          ref={dropZoneRef}
          key={currentWord.wort} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="w-64 h-24 bg-emerald-400 rounded-[50%] shadow-lg border-b-8 border-emerald-600 flex items-center justify-center relative"
        >
          {/* Pad cutout */}
          <div className="absolute -right-4 top-8 w-12 h-12 bg-blue-400 rounded-full transform -skew-x-12" />
          <span className={`font-hand text-4xl font-bold ${currentWord.color} bg-white/80 px-6 py-2 rounded-2xl shadow-sm z-10 -rotate-2`}>
            {currentWord.wort}
          </span>
        </motion.div>
      </div>

      <AnimatePresence>
         {feedback === "falsch" && <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="font-hand text-3xl text-red-500 font-bold bg-white/80 px-6 py-2 rounded-2xl border-2 border-red-200">Oh je, der Frosch ist ins Wasser geplumpst!</motion.p>}
         {feedback === "richtig" && <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="font-hand text-3xl text-emerald-500 font-bold bg-white/80 px-6 py-2 rounded-2xl border-2 border-emerald-200">Platsch! Genau richtig.</motion.p>}
      </AnimatePresence>
    </div>
  );
}

// --- Game 6: Die Reim-Maschine ---
// Deterministischer, stabiler Shuffle: gleiche Frage (index) -> gleiche
// Options-Reihenfolge. Verhindert das Neu-Wuerfeln bei jedem Re-Render
// (Port aus Alt-Variante "Montessori Flow").
const stableChoiceScore = (text, seed) =>
  String(text)
    .split("")
    .reduce((score, char, index) => score + char.charCodeAt(0) * (index + 7 + seed), seed * 31);

const buildStableOptions = (pairs, index) => {
  const pair = pairs[index];
  const options = [pair.b, ...pairs.filter((entry) => entry.b !== pair.b).map((entry) => entry.b)]
    .sort((a, b) => stableChoiceScore(a, index) - stableChoiceScore(b, index))
    .slice(0, 3);
  if (!options.includes(pair.b)) options[0] = pair.b;
  return options.sort((a, b) => stableChoiceScore(a, index + 17) - stableChoiceScore(b, index + 17));
};

const REIM_PAARE = DEUTSCH_CONTENT.rhymePairs;

function ReimMaschineGame({ onCorrect, onWrong }) {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  
  const pair = REIM_PAARE[idx];
  
  // Stabile, deterministische Options (kein Neu-Wuerfeln pro Render)
  const options = buildStableOptions(REIM_PAARE, idx);

  const handleSelect = (word) => {
    if (word === pair.b) {
      playSparkle(); setFeedback("richtig"); setIsSpinning(true); onCorrect(4); confetti();
      setTimeout(() => {
        setIsSpinning(false);
        setIdx((idx + 1) % REIM_PAARE.length);
        setFeedback(null);
      }, 2500);
    } else {
      playError(); setFeedback("falsch"); onWrong(); setTimeout(() => setFeedback(null), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 py-8 w-full max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="font-hand text-5xl font-bold text-slate-800">Die Reim-Maschine</h2>
        <p className="font-hand text-2xl text-slate-500 mt-2">Welches Wort reimt sich auf das linke Rad?</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12 mt-8 bg-slate-50 p-12 rounded-[50px] border-4 border-slate-200 shadow-inner w-full justify-center">
        {/* Left fixed gear */}
        <motion.div animate={{ rotate: isSpinning ? 360 : 0 }} transition={{ duration: 2, ease: "easeInOut" }} className={`w-40 h-40 rounded-full border-8 border-slate-700 flex items-center justify-center relative ${pair.color}`}>
           {/* Gear teeth */}
           {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
             <div key={deg} className="absolute w-6 h-6 bg-slate-700" style={{ transform: `rotate(${deg}deg) translateY(-22px)` }} />
           ))}
           <div className="w-full h-full bg-inherit rounded-full z-10 flex items-center justify-center border-4 border-white/50">
              <span className="font-hand text-3xl font-bold text-slate-800 bg-white/80 px-3 py-1 rounded-xl shadow-sm">{pair.a}</span>
           </div>
        </motion.div>

        {/* Separator / indicator */}
        <div className="text-5xl text-slate-300 font-bold">〰️</div>

        {/* Options */}
        <div className="flex flex-col gap-4">
           {options.map((opt, i) => (
             <motion.button key={opt + i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => !isSpinning && handleSelect(opt)}
                className={`w-40 py-4 bg-white border-4 ${isSpinning && opt === pair.b ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-slate-400'} rounded-2xl shadow-md font-hand text-2xl font-bold text-slate-700`}
             >
                {opt}
             </motion.button>
           ))}
        </div>
      </div>

      {feedback === "falsch" && <p className="font-hand text-3xl text-red-500 font-bold">Krrr... das klemmt! Versuche es nochmal.</p>}
      {feedback === "richtig" && <p className="font-hand text-3xl text-emerald-500 font-bold">Surrrr... die Räder drehen sich!</p>}
    </div>
  );
}

// --- Game 7: Der Gegenteil-Magnet ---
const GEGENTEIL_PAARE = DEUTSCH_CONTENT.antonymPairs;

function GegenteileGame({ onCorrect, onWrong }) {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [snapped, setSnapped] = useState(false);
  const pair = GEGENTEIL_PAARE[idx];

  const options = buildStableOptions(GEGENTEIL_PAARE, idx);

  const handleSelect = (word) => {
    if (word === pair.b) {
      playPop();
      setSnapped(true); setFeedback("richtig"); onCorrect(3); confetti({ particleCount: 50, spread: 60 });
      setTimeout(() => {
        setSnapped(false); setIdx((idx + 1) % GEGENTEIL_PAARE.length); setFeedback(null);
      }, 2000);
    } else {
      playError(); setFeedback("falsch"); onWrong(); setTimeout(() => setFeedback(null), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8 w-full max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="font-hand text-5xl font-bold text-slate-800">Der Gegen-Magnet</h2>
        <p className="font-hand text-2xl text-slate-500 mt-2">Gegensätze ziehen sich an! Was ist das Gegenteil?</p>
      </div>

      <div className="flex flex-col items-center gap-0 mt-8 relative">
        {/* Top Magnet Half */}
        <motion.div animate={{ y: snapped ? 20 : 0 }} className="w-64 h-32 bg-red-500 rounded-t-full border-8 border-red-700 flex items-end justify-center pb-4 shadow-xl z-20">
           <span className="font-hand text-4xl font-bold text-white bg-black/20 px-4 py-1 rounded-xl">{pair.a}</span>
        </motion.div>
        
        {/* Sparkles / Gap */}
        <div className="h-20 w-ful flex items-center justify-center" style={{ width: '100%' }}>
           {snapped && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-4xl absolute z-30">✨💥✨</motion.div>}
           {!snapped && <div className="text-3xl animate-pulse">⚡⚡⚡</div>}
        </div>

        {/* Bottom Options / Snapped Half */}
        {!snapped ? (
          <div className="flex gap-4">
             {options.map(opt => (
                <motion.button key={opt} whileHover={{ y: -5 }} onClick={() => handleSelect(opt)}
                  className="w-32 h-24 bg-blue-500 rounded-b-full border-4 border-blue-700 flex items-start justify-center pt-4 shadow-lg active:bg-blue-600"
                >
                  <span className="font-hand text-2xl font-bold text-white bg-black/20 px-2 py-1 rounded-lg">{opt}</span>
                </motion.button>
             ))}
          </div>
        ) : (
          <motion.div animate={{ y: -20 }} className="w-64 h-32 bg-blue-500 rounded-b-[60px] border-8 border-blue-700 flex items-start justify-center pt-4 shadow-xl z-20">
             <span className="font-hand text-4xl font-bold text-white bg-black/20 px-4 py-1 rounded-xl">{pair.b}</span>
          </motion.div>
        )}
      </div>
      
      {feedback === "falsch" && <p className="font-hand text-3xl text-red-500 font-bold mt-4">Abgestoßen! Falscher Pol.</p>}
    </div>
  );
}

// --- Deutsch Module Main Wrapper ---
export default function DeutschModule({ onCorrect = () => {}, onWrong = () => {} }) {
  const [activeTab, setActiveTab] = useState("himmelwelt");
  const tabs = [
    { id: "himmelwelt", label: "Himmelswelt", color: "bg-sky-500" },
    { id: "arcade", label: "Arcade-Welt", color: "bg-orange-500" },
    { id: "sinn", label: "Denk-Abenteuer", color: "bg-slate-900" },
    { id: "wortlabor", label: "Wort-Labor", color: "bg-indigo-500" },
    { id: "buchstaben", label: "Buchstaben", color: "bg-lime-500" },
    { id: "memory", label: "Wort-Memory", color: "bg-sky-400" },
    { id: "wortarten", label: "Wortarten", color: "bg-fuchsia-400" },
    { id: "silben", label: "Silben", color: "bg-amber-400" },
    { id: "satzbau", label: "Satzbau", color: "bg-sky-400" },
    { id: "geschichten", label: "Geschichten", color: "bg-orange-400" },
    { id: "artikel", label: "Artikel-See", color: "bg-emerald-400" },
    { id: "reime", label: "Reim-Maschine", color: "bg-rose-400" },
    { id: "gegenteile", label: "Gegenteile", color: "bg-violet-400" },
    { id: "spielwelt", label: "Spielwelt", color: "bg-fuchsia-500" },
    { id: "quest", label: "Quest-Mixer", color: "bg-emerald-500" },
    { id: "premium", label: "Premium-Atelier", color: "bg-amber-500" },
    { id: "action", label: "Fangspiel", color: "bg-orange-500" },
    { id: "varianten", label: "Mega-Auswahl", color: "bg-slate-800" },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto h-full">
      <div className="flex flex-wrap justify-center gap-3 p-3 bg-white/40 backdrop-blur-sm rounded-[40px] border-2 border-white shadow-inner max-w-fit mx-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-2.5 rounded-full font-hand text-2xl font-bold transition-all ${activeTab === tab.id ? `${tab.color} text-white shadow-lg scale-105` : "text-slate-500 hover:bg-white/60"}`}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1">
         <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {activeTab === "himmelwelt" && (
                <Suspense fallback={<div className="min-h-[620px] rounded-[34px] bg-sky-100/80 border-4 border-white shadow-lg" />}>
                  <SkyWonderland title="Himmelswunderland" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "arcade" && (
                <Suspense fallback={<div className="min-h-[660px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" />}>
                  <LearningArcade subject="deutsch" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "sinn" && (
                <Suspense fallback={<div className="min-h-[640px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" />}>
                  <DeepLearningQuest subject="deutsch" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "wortlabor" && <WortLaborGame onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "buchstaben" && <BuchstabenWiese onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "memory" && <WortSchatzMemory onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "wortarten" && <WortartenGame onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "silben" && <SilbenGame onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "satzbau" && <SatzbauGame onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "geschichten" && <GeschichtenGarten onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "artikel" && <ArtikelSeeGame onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "reime" && <ReimMaschineGame onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "gegenteile" && <GegenteileGame onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "spielwelt" && (
                <GameWorld
                  title="Sprach-Spielwelt"
                  intro="Acht Spielarten mit Bildwelt, Bewegung, Puzzle, Atelier und erweitertem Premium-Wortpool."
                  collections={SUBJECT_VARIANT_CONTENT.deutsch}
                  accent="bg-fuchsia-500"
                  scene="language"
                  onCorrect={onCorrect}
                  onWrong={onWrong}
                />
              )}
              {activeTab === "quest" && (
                <QuestMixer
                  title="Sprach-Quest-Mixer"
                  intro="Expedition, Puzzle, Sternenlauf und Kartenwirbel mit Premium-Wortschatz, Silben, Bildern und Reimen."
                  collections={SUBJECT_VARIANT_CONTENT.deutsch}
                  accent="bg-emerald-500"
                  onCorrect={onCorrect}
                  onWrong={onWrong}
                />
              )}
                            {activeTab === "premium" && (
                <Suspense fallback={<div className="min-h-[360px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" />}>
                  <SubjectPremiumAtelier subject="deutsch" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "action" && (
                <ActionArena
                  title="Wörter-Fangspiel"
                  intro="Fang die richtige Antwort, halte deine Herzen und baue eine Combo auf."
                  collections={SUBJECT_VARIANT_CONTENT.deutsch}
                  accent="bg-orange-500"
                  onCorrect={onCorrect}
                  onWrong={onWrong}
                />
              )}
              {activeTab === "varianten" && (
                <VariantStudio
                  title="Sprach-Mega-Auswahl"
                  intro="Viele Wortschatz-, Laut-, Artikel-, Silben-, Reim-, Bild- und Gegensatzkarten aus dem erweiterten Premium-Pool."
                  collections={SUBJECT_VARIANT_CONTENT.deutsch}
                  onCorrect={onCorrect}
                  onWrong={onWrong}
                />
              )}
            </motion.div>
         </AnimatePresence>
      </div>
    </div>
  );
}
