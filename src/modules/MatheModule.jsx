import { lazy, Suspense, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../utils/sounds";
import MusterGarten from "../components/games/MusterGarten";
import ZahlenFluss from "../components/games/ZahlenFluss";
import FormenMosaik from "../components/games/FormenMosaik";
import VariantStudio from "../components/games/VariantStudio";
import ActionArena from "../components/games/ActionArena";
import GameWorld from "../components/games/GameWorld";
import QuestMixer from "../components/games/QuestMixer";
import { SUBJECT_VARIANT_CONTENT } from "../data/learningContent";

const SubjectPremiumAtelier = lazy(() => import("../components/games/SubjectPremiumAtelier"));
const SkyWonderland = lazy(() => import("../components/games/SkyWonderland"));
const DeepLearningQuest = lazy(() => import("../components/games/DeepLearningQuest"));
const LearningArcade = lazy(() => import("../components/games/LearningArcade"));

// --- Constants & Styles ---
const BEAD_COLORS = { unit: "#fbbf24", ten: "#fbbf24", hundred: "#fbbf24" };

// --- Sub-Components ---
const WatercolorBead = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" className={`${className}`}>
    <path d="M15 3 C22 3 27 8 27 15 C27 22 22 27 15 27 C8 27 3 22 3 15 C3 8 8 3 15 3 Z" fill={BEAD_COLORS.unit} stroke="#b45309" strokeWidth="1" />
    <ellipse cx="11" cy="11" rx="3" ry="2" fill="white" opacity="0.4" />
  </svg>
);

const TenBar = () => (
  <div className="flex flex-col gap-0.5 p-1 bg-amber-50/50 rounded-full border border-amber-200/50 shadow-sm">
    {Array.from({ length: 10 }).map((_, i) => <WatercolorBead key={i} size={18} />)}
  </div>
);

const HundredSquare = () => (
  <div className="grid grid-cols-10 gap-0.5 p-1.5 bg-amber-100/30 rounded-xl border border-amber-200 shadow-md">
    {Array.from({ length: 100 }).map((_, i) => <WatercolorBead key={i} size={14} />)}
  </div>
);

const ThousandCube = () => (
  <div className="relative w-28 h-28">
    <div className="absolute inset-0 bg-amber-200/40 rounded-xl border-2 border-amber-400 rotate-3 translate-x-2 translate-y-2 shadow-sm flex items-center justify-center">
      <HundredSquare />
    </div>
    <div className="absolute inset-0 bg-amber-200/60 rounded-xl border-2 border-amber-400 -rotate-2 -translate-x-1 -translate-y-1 shadow-md flex items-center justify-center">
      <HundredSquare />
    </div>
    <div className="absolute inset-2 bg-amber-500/20 blur-xl rounded-full" />
  </div>
);

const DraggableItem = ({ type, onDragEnd, containerRef }) => (
  <motion.div
    drag dragConstraints={containerRef} dragElastic={0.1} dragMomentum={false}
    onDragEnd={(e, info) => onDragEnd(type, info.point)}
    whileDrag={{ scale: 1.1, zIndex: 100 }} whileHover={{ scale: 1.05 }}
    className="inline-block touch-none cursor-grab active:cursor-grabbing"
  >
    <div className="hover:drag-shadow active:drag-shadow transition-shadow duration-200 flex flex-col items-center gap-1">
      {type === "unit" && <WatercolorBead size={32} className="drop-shadow-sm" />}
      {type === "ten" && <TenBar />}
      {type === "hundred" && <HundredSquare />}
      {type === "thousand" && <ThousandCube />}
      <span className="font-hand text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
        {type === "unit" ? "1" : type === "ten" ? "10" : type === "hundred" ? "100" : "1000"}
      </span>
    </div>
  </motion.div>
);

// --- Game 1: Perlenbank (Endlos-Engine) ---
function PerlenbankGame({ onCorrect, onWrong }) {
  const [level, setLevel] = useState(1);
  const generateTarget = (lvl) => {
    const max = lvl * 500;
    return Math.floor(Math.random() * Math.min(max, 9999)) + 1;
  };

  const [targetNumber, setTargetNumber] = useState(generateTarget(1));
  const [placedItems, setPlacedItems] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const carpetRef = useRef(null);

  const calculateTotal = () => placedItems.reduce((acc, item) => {
    if (item.type === "unit") return acc + 1;
    if (item.type === "ten") return acc + 10;
    if (item.type === "hundred") return acc + 100;
    if (item.type === "thousand") return acc + 1000;
    return acc;
  }, 0);

  const handleDragEndFromBank = (type, point) => {
    const rect = carpetRef.current.getBoundingClientRect();
    const rLeft = rect.left + window.scrollX;
    const rRight = rect.right + window.scrollX;
    const rTop = rect.top + window.scrollY;
    const rBottom = rect.bottom + window.scrollY;
    const buffer = 20;
    if (point.x >= rLeft - buffer && point.x <= rRight + buffer && point.y >= rTop - buffer && point.y <= rBottom + buffer) {
      playPop();
      setPlacedItems(prev => [...prev, { 
        id: Date.now(), 
        type, 
        x: point.x - rLeft - 20, 
        y: point.y - rTop - 20,
        rotation: (Math.random() - 0.5) * 10
      }]);
    }
  };

  const removeItem = (id) => { playPop(); setPlacedItems(prev => prev.filter(item => item.id !== id)); };

  const checkResult = () => {
    const total = calculateTotal();
    if (total === targetNumber) {
      setFeedback("richtig"); playSparkle(); onCorrect(10 + level); 
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 } });
    } else {
      setFeedback("falsch"); playError(); onWrong(); setTimeout(() => setFeedback(null), 3000);
    }
  };

  const nextLevel = () => {
    playPop();
    const newLvl = level + 1;
    setLevel(newLvl);
    setTargetNumber(generateTarget(newLvl));
    setPlacedItems([]);
    setFeedback(null);
  };

  const currentTotal = calculateTotal();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end px-4">
        <div><h2 className="font-hand text-4xl font-bold text-slate-800">Die Goldene Perlenbank</h2></div>
        <div className="bg-white/80 p-4 rounded-3xl border-2 border-amber-200 shadow-lg text-center min-w-[200px]">
          <p className="font-sans text-xs font-bold uppercase text-slate-400 mb-1">Deine Aufgabe</p>
          <p className="font-hand text-5xl font-bold text-amber-600">{targetNumber}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white/60 rounded-3xl border-2 border-white p-6 flex flex-col gap-6 shadow-xl relative z-50">
          <h3 className="font-hand text-2xl font-bold text-slate-700 text-center border-b pb-2">Die Bank</h3>
          <div className="flex flex-col items-center gap-6 py-4 overflow-y-auto max-h-[500px]">
            <DraggableItem type="thousand" onDragEnd={handleDragEndFromBank} containerRef={null} />
            <DraggableItem type="hundred" onDragEnd={handleDragEndFromBank} containerRef={null} />
            <DraggableItem type="ten" onDragEnd={handleDragEndFromBank} containerRef={null} />
            <DraggableItem type="unit" onDragEnd={handleDragEndFromBank} containerRef={null} />
          </div>
        </div>
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div ref={carpetRef} className="relative h-[450px] bg-[#f8fafc] rounded-[40px] border-4 border-dashed border-slate-200 overflow-hidden paper-texture">
            <AnimatePresence>
              {placedItems.map(item => (
                <motion.div 
                  key={item.id} 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1, x: item.x, y: item.y, rotate: item.rotation }} 
                  exit={{ scale: 0 }} 
                  drag dragConstraints={carpetRef} 
                  className="absolute cursor-grab z-10" 
                  onDoubleClick={() => removeItem(item.id)}
                >
                  {item.type === "unit" && <WatercolorBead size={32} />}
                  {item.type === "ten" && <TenBar />}
                  {item.type === "hundred" && <HundredSquare />}
                  {item.type === "thousand" && <ThousandCube />}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex justify-between items-center bg-white/50 p-4 rounded-3xl">
            <div className="flex gap-4">
              <div className="px-6 py-2 bg-slate-100 rounded-full border"><span className="font-sans text-sm font-bold text-slate-500 mr-2">ZÄHLER:</span><span className="font-hand text-3xl font-bold text-slate-800">{currentTotal}</span></div>
              <button onClick={() => setPlacedItems([])} className="text-slate-400 hover:text-red-500 font-hand text-xl">Teppich leeren</button>
            </div>
            <div className="flex gap-4">
              <motion.button whileTap={{ scale: 0.95 }} onClick={checkResult} disabled={placedItems.length === 0 || !!feedback} className={`px-10 py-3 rounded-2xl font-bold text-white shadow-lg text-xl ${feedback === "richtig" ? "bg-emerald-500" : "bg-amber-500"}`}>{feedback === "richtig" ? "Super! ✓" : "Fertig?"}</motion.button>
              {feedback === "richtig" && <motion.button onClick={nextLevel} className="px-8 py-3 rounded-2xl bg-white border-2 border-amber-200 text-amber-700 text-xl font-bold">Nächstes Level →</motion.button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Game 2: Multiplikation Brett ---
function MultiplikationGame({ onCorrect, onWrong }) {
  const [a, setA] = useState(Math.floor(Math.random() * 5) + 2);
  const [b, setB] = useState(Math.floor(Math.random() * 5) + 2);
  const target = a * b;
  const [placedDots, setPlacedDots] = useState(0);

  const addDot = () => {
    if (placedDots < target) setPlacedDots(prev => prev + 1);
  };

  const removeDot = () => {
    if (placedDots > 0) setPlacedDots(prev => prev - 1);
  }

  const check = () => {
     if (placedDots === target) {
        playSparkle(); onCorrect(3); confetti({ particleCount: 150 });
        setTimeout(() => {
           setA(Math.floor(Math.random() * 5) + 2);
           setB(Math.floor(Math.random() * 5) + 2);
           setPlacedDots(0);
        }, 3000);
     } else {
        playError(); onWrong();
     }
  }

   return (
    <div className="flex flex-col gap-6 items-center">
       <h2 className="font-hand text-4xl font-bold text-slate-800">Das Multiplikationsbrett</h2>
       <div className="bg-sky-100 rounded-2xl p-6 text-center border-4 border-sky-300">
         <p className="font-hand text-6xl font-bold mb-4">{a} × {b}</p>
         <p className="font-sans text-sky-700 font-bold uppercase tracking-widest text-sm">Lege {a} Reihen mit jeweils {b} Perlen</p>
       </div>

       <div className="flex items-center gap-6">
          <motion.button whileTap={{ scale: 0.9 }} onClick={removeDot} className="w-16 h-16 bg-red-400 rounded-full text-white text-4xl shadow">-</motion.button>
          
          <div className="grid gap-2 p-6 bg-amber-50 rounded-[40px] border-4 border-amber-200 min-h-[300px] min-w-[300px] place-content-start" style={{ gridTemplateColumns: `repeat(${b}, minmax(0, 1fr))` }}>
             {Array.from({ length: placedDots }).map((_, i) => (
               <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <WatercolorBead size={40} />
               </motion.div>
             ))}
          </div>

          <motion.button whileTap={{ scale: 0.9 }} onClick={addDot} className="w-16 h-16 bg-emerald-400 rounded-full text-white text-4xl shadow">+</motion.button>
       </div>

       <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={check} className="px-10 py-4 bg-sky-500 text-white font-bold rounded-2xl text-xl mt-4 shadow-lg">
         Abgeben
       </motion.button>
    </div>
  )
}

// --- Game 3: Geometrie (Formen Sortieren) ---
const geometryItems = [
  { id: "kreis", name: "Kreis", type: "2d", color: "#f87171" },
  { id: "quadrat", name: "Quadrat", type: "2d", color: "#60a5fa" },
  { id: "dreieck", name: "Dreieck", type: "2d", color: "#facc15" },
  { id: "wurfel", name: "Würfel", type: "3d", color: "#34d399" },
  { id: "kugel", name: "Kugel", type: "3d", color: "#c084fc" },
  { id: "zylinder", name: "Zylinder", type: "3d", color: "#fb923c" },
];

const ShapeIcon = ({ id, color, size = 60 }) => {
  const props = { width: size, height: size, fill: color, stroke: "#333", strokeWidth: 2, className: "watercolor-effect drop-shadow-md" };
  switch (id) {
    case "kreis": return <svg viewBox="0 0 100 100" {...props}><circle cx="50" cy="50" r="45" /></svg>;
    case "quadrat": return <svg viewBox="0 0 100 100" {...props}><rect x="10" y="10" width="80" height="80" rx="10" /></svg>;
    case "dreieck": return <svg viewBox="0 0 100 100" {...props}><polygon points="50,10 90,90 10,90" strokeLinejoin="round" /></svg>;
    case "wurfel": return (
      <svg viewBox="0 0 100 100" {...props}>
        <rect x="25" y="35" width="50" height="50" />
        <polygon points="25,35 45,15 95,15 75,35" fillOpacity="0.8" />
        <polygon points="75,35 95,15 95,65 75,85" fillOpacity="0.6" />
      </svg>
    );
    case "kugel": return (
      <svg viewBox="0 0 100 100" {...props}>
        <circle cx="50" cy="50" r="45" />
        <ellipse cx="35" cy="35" rx="15" ry="10" fill="white" opacity="0.5" stroke="none" transform="rotate(-45 35 35)" />
      </svg>
    );
    case "zylinder": return (
      <svg viewBox="0 0 100 100" {...props}>
        <rect x="25" y="30" width="50" height="55" />
        <ellipse cx="50" cy="30" rx="25" ry="10" fillOpacity="0.8" />
        <path d="M 25 85 A 25 10 0 0 0 75 85" fill="none" />
      </svg>
    );
    default: return null;
  }
};

function FormenGame({ onCorrect, onWrong }) {
  const [remaining, setRemaining] = useState(geometryItems);
  const [assigned, setAssigned] = useState({ "2d": [], "3d": [] });
  const [feedback, setFeedback] = useState(null);
  const containerRef = useRef(null);
  const boxesRef = useRef({});

  const handleDrop = (item, point) => {
    let target = null;
    Object.keys(boxesRef.current).forEach(type => {
      const el = boxesRef.current[type];
      if (el) {
        const rect = el.getBoundingClientRect();
        const rLeft = rect.left + window.scrollX;
        const rRight = rect.right + window.scrollX;
        const rTop = rect.top + window.scrollY;
        const rBottom = rect.bottom + window.scrollY;
        const buffer = 20;
        if (point.x >= rLeft - buffer && point.x <= rRight + buffer && point.y >= rTop - buffer && point.y <= rBottom + buffer) target = type;
      }
    });

    if (target) {
      playPop();
      setAssigned(prev => ({ ...prev, [target]: [...prev[target], item] }));
      setRemaining(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const check = () => {
    let isCorrect = true;
    Object.entries(assigned).forEach(([type, items]) => {
      items.forEach(i => { if (i.type !== type) isCorrect = false; });
    });
    if (isCorrect && remaining.length === 0) {
      playSparkle(); setFeedback("richtig"); onCorrect(5); confetti();
    } else {
      playError(); setFeedback("falsch"); onWrong(); setTimeout(() => setFeedback(null), 3000);
    }
  };

  const reset = () => { playPop(); setAssigned({ "2d": [], "3d": [] }); setRemaining(geometryItems); setFeedback(null); };

  return (
    <div ref={containerRef} className="flex flex-col gap-8 items-center w-full pb-10">
      <div className="text-center">
        <h2 className="font-hand text-4xl font-bold text-slate-800">Geometrische Körper & Flächen</h2>
        <p className="font-hand text-2xl text-slate-500">Ist es flach (2D) oder plastisch (3D)?</p>
      </div>
      
      <div className="bg-white/50 backdrop-blur rounded-[40px] p-8 border-4 border-dashed border-white/60 min-h-[140px] flex flex-wrap justify-center gap-6 shadow-inner w-full">
        <AnimatePresence>
          {remaining.map(item => (
            <motion.div key={item.id} drag dragConstraints={containerRef} dragElastic={0.1} dragMomentum={false} onDragEnd={(e, info) => handleDrop(item, info.point)} whileDrag={{ scale: 1.2, zIndex: 100 }} whileHover={{ scale: 1.1 }} className="cursor-grab active:cursor-grabbing flex flex-col items-center">
              <ShapeIcon id={item.id} color={item.color} />
              <span className="font-hand text-lg mt-1 font-bold text-slate-600">{item.name}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {remaining.length === 0 && feedback !== "richtig" && <p className="font-hand text-2xl text-slate-400">Prüfe deine Zuordnung!</p>}
      </div>

      <div className="grid grid-cols-2 gap-10 w-full mt-4">
        {["2d", "3d"].map(type => (
          <div key={type} ref={el => boxesRef.current[type] = el} className={`min-h-[250px] rounded-3xl border-4 flex flex-col p-6 items-center ${type === "2d" ? "bg-rose-50 border-rose-200" : "bg-indigo-50 border-indigo-200"}`}>
            <h3 className="font-hand text-3xl font-bold mb-4" style={{ color: type === "2d" ? "#f43f5e" : "#6366f1" }}>{type === "2d" ? "Flache Formen (2D)" : "Körper (3D)"}</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {assigned[type].map(item => (
                <motion.div key={item.id} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                  <ShapeIcon id={item.id} color={item.color} size={50} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
         <button onClick={reset} className="font-hand text-2xl text-slate-400 hover:text-slate-600 px-4">Zurücksetzen</button>
         {!feedback || feedback === "falsch" ? (
             <motion.button onClick={check} disabled={remaining.length > 0} className="px-10 py-3 bg-emerald-500 text-white font-bold text-xl rounded-2xl shadow-lg disabled:opacity-30">Kontrollieren</motion.button>
         ) : (
             <motion.div className="bg-emerald-100 text-emerald-800 px-8 py-3 rounded-2xl font-bold border border-emerald-300 text-xl font-hand">Super! Alles richtig sortiert! ✓</motion.div>
         )}
      </div>
    </div>
  );
}

// --- Mathe Module Main Wrapper ---
export default function MatheModule({ onCorrect = () => {}, onWrong = () => {} }) {
  const [activeTab, setActiveTab] = useState("himmelwelt");

  const tabs = [
    { id: "himmelwelt", label: "Himmelswelt", color: "bg-sky-500" },
    { id: "arcade", label: "Arcade-Welt", color: "bg-orange-500" },
    { id: "sinn", label: "Denk-Abenteuer", color: "bg-slate-900" },
    { id: "perlen", label: "Perlenbank", color: "bg-amber-400" },
    { id: "fluss", label: "Zahlen-Fluss", color: "bg-sky-500" },
    { id: "muster", label: "Muster-Garten", color: "bg-emerald-400" },
    { id: "mosaik", label: "Formen-Mosaik", color: "bg-violet-400" },
    { id: "multiplikation", label: "Multiplikation", color: "bg-sky-400" },
    { id: "geometrie", label: "Geometrie", color: "bg-rose-400" },
    { id: "spielwelt", label: "Spielwelt", color: "bg-fuchsia-500" },
    { id: "quest", label: "Quest-Mixer", color: "bg-emerald-500" },
    { id: "premium", label: "Premium-Atelier", color: "bg-amber-500" },
    { id: "action", label: "Zahlen-Fangspiel", color: "bg-orange-500" },
    { id: "varianten", label: "Mega-Auswahl", color: "bg-slate-800" },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto h-full">
      {/* Navigation */}
      <div className="flex flex-wrap justify-center gap-4 p-2 bg-slate-200/50 rounded-2xl w-fit mx-auto border-2 border-white shadow-inner">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-3 rounded-xl font-hand text-2xl font-bold transition-all
              ${activeTab === tab.id ? `${tab.color} text-white shadow-md scale-105` : "text-slate-500 hover:bg-white/50"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
         <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {activeTab === "himmelwelt" && (
                <Suspense fallback={<div className="min-h-[620px] rounded-[34px] bg-sky-100/80 border-4 border-white shadow-lg" />}>
                  <SkyWonderland title="Zahlen-Himmel" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "arcade" && (
                <Suspense fallback={<div className="min-h-[660px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" />}>
                  <LearningArcade subject="mathe" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "sinn" && (
                <Suspense fallback={<div className="min-h-[640px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" />}>
                  <DeepLearningQuest subject="mathe" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "perlen" && <PerlenbankGame onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "fluss" && <ZahlenFluss onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "muster" && <MusterGarten onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "mosaik" && <FormenMosaik onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "multiplikation" && <MultiplikationGame onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "geometrie" && <FormenGame onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "spielwelt" && (
                <GameWorld
                  title="Zahlen-Spielwelt"
                  intro="Acht Spielarten für Zahlenfolgen, Mal-Reihen, Zerlegen, Formenblick und Premium-Materialaufgaben."
                  collections={SUBJECT_VARIANT_CONTENT.mathe}
                  accent="bg-sky-500"
                  scene="math"
                  onCorrect={onCorrect}
                  onWrong={onWrong}
                />
              )}
              {activeTab === "quest" && (
                <QuestMixer
                  title="Zahlen-Quest-Mixer"
                  intro="Expedition, Puzzle, Sternenlauf und Kartenwirbel für Rechnen, Folgen, Formen, Messen und Montessori-Material."
                  collections={SUBJECT_VARIANT_CONTENT.mathe}
                  accent="bg-sky-500"
                  onCorrect={onCorrect}
                  onWrong={onWrong}
                />
              )}
                            {activeTab === "premium" && (
                <Suspense fallback={<div className="min-h-[360px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" />}>
                  <SubjectPremiumAtelier subject="mathe" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "action" && (
                <ActionArena
                  title="Zahlen-Fangspiel"
                  intro="Fang die passende Zahl, sammle Combo-Punkte und halte die Herzen oben."
                  collections={SUBJECT_VARIANT_CONTENT.mathe}
                  accent="bg-sky-500"
                  onCorrect={onCorrect}
                  onWrong={onWrong}
                />
              )}
              {activeTab === "varianten" && (
                <VariantStudio
                  title="Zahlen-Mega-Auswahl"
                  intro="Viele Zahlenfolgen, Mal-Reihen, Zerlegungen, Formen-, Mess- und Materialfragen in wechselnden Varianten."
                  collections={SUBJECT_VARIANT_CONTENT.mathe}
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
