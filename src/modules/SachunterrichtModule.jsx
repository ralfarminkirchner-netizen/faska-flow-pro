import { lazy, Suspense, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../utils/sounds";
import SpurenDetektiv from "../components/games/SpurenDetektiv";
import WetterAtelier from "../components/games/WetterAtelier";
import Jahreskreis from "../components/games/Jahreskreis";
import VariantStudio from "../components/games/VariantStudio";
import ActionArena from "../components/games/ActionArena";
import GameWorld from "../components/games/GameWorld";
import QuestMixer from "../components/games/QuestMixer";
import { SUBJECT_VARIANT_CONTENT, WORLD_CONTENT } from "../data/learningContent";

const SubjectPremiumAtelier = lazy(() => import("../components/games/SubjectPremiumAtelier"));
const SkyWonderland = lazy(() => import("../components/games/SkyWonderland"));
const DeepLearningQuest = lazy(() => import("../components/games/DeepLearningQuest"));
const LearningArcade = lazy(() => import("../components/games/LearningArcade"));

// ==========================================
// 1. ÖKOSYSTEM SANDBOX (TERRAIN BUILDER)
// ==========================================
const terrainTypes = WORLD_CONTENT.terrainTypes;

const sandboxAnimals = WORLD_CONTENT.sandboxAnimals;

function EcosystemSandbox() {
  const [grid, setGrid] = useState(Array(16).fill("gras"));
  const [activeTool, setActiveTool] = useState("wasser");
  const [placedAnimals, setPlacedAnimals] = useState({}); // { cellIndex: animalObj }
  
  const paintCell = (index) => {
    playPop();
    const newGrid = [...grid];
    newGrid[index] = activeTool;
    setGrid(newGrid);
  };

  const handleAnimalDrop = (animal, info) => {
    // simplified drop calculation based on rough coordinates
    const elements = document.elementsFromPoint(info.point.x, info.point.y);
    const dropCell = elements.find(el => el.getAttribute("data-cell-index"));
    
    if (dropCell) {
      const idx = dropCell.getAttribute("data-cell-index");
      setPlacedAnimals(prev => ({ ...prev, [idx]: animal }));
      playPop();
    }
  };

  const AnimalWidget = ({ animal, cellTerrain }) => {
    const isHappy = animal.habitat === cellTerrain;
    return (
      <motion.div 
        initial={{ scale: 0 }} animate={{ scale: 1, rotate: isHappy ? [0, -10, 10, 0] : 0 }} 
        transition={{ loop: isHappy ? Infinity : 0, duration: 2 }}
        className="absolute inset-0 flex items-center justify-center text-5xl pointer-events-none"
      >
        {animal.emoji}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: -20 }}
          className="absolute -top-4 text-2xl"
        >
          {isHappy ? "❤️" : "💦"}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white/60 backdrop-blur-md p-6 rounded-[30px] border-2 border-white shadow-xl flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <span className="font-hand text-xl font-bold text-slate-500 mr-2">Pinsel:</span>
          {terrainTypes.map(t => (
            <motion.button
              key={t.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTool(t.id)}
              className={`p-4 rounded-xl text-3xl transition-all ${activeTool === t.id ? "ring-4 ring-slate-400 shadow-lg scale-110" : "opacity-60"}`}
              style={{ backgroundColor: t.color }}
            >
              {t.icon}
            </motion.button>
          ))}
        </div>
        <button onClick={() => {setGrid(Array(16).fill("gras")); setPlacedAnimals({});}} className="px-6 py-3 bg-red-400 text-white rounded-xl font-bold font-hand hover:bg-red-500">Reset Welt</button>
      </div>

      <div className="flex gap-8">
        <div className="w-2/3 grid grid-cols-4 gap-2 bg-slate-200 p-4 rounded-[40px] shadow-inner">
          {grid.map((terrainId, idx) => {
            const terrain = terrainTypes.find(t => t.id === terrainId);
            return (
              <div 
                key={idx}
                data-cell-index={idx}
                onClick={() => paintCell(idx)}
                onDragOver={(e) => e.preventDefault()}
                className="aspect-square rounded-2xl relative cursor-pointer overflow-hidden shadow-sm hover:ring-4 ring-white transition-all watercolor-effect"
                style={{ backgroundColor: terrain.color }}
              >
                {placedAnimals[idx] && <AnimalWidget animal={placedAnimals[idx]} cellTerrain={terrainId} />}
              </div>
            )
          })}
        </div>

        <div className="w-1/3 bg-white/60 p-6 rounded-[40px] flex flex-wrap gap-4 content-start border-2 border-white">
          <p className="w-full font-hand text-xl font-bold text-slate-500 border-b pb-2 mb-2">Tiere (zieh mich)</p>
          {sandboxAnimals.map(animal => (
            <motion.div
              key={animal.id} drag dragSnapToOrigin
              onDragEnd={(e, info) => handleAnimalDrop(animal, info)}
              whileDrag={{ scale: 1.5, zIndex: 100 }}
              className="text-5xl cursor-grab active:cursor-grabbing hover:scale-110 transition-transform bg-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-md border border-slate-100"
            >
              {animal.emoji}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}


// ==========================================
// 2. NAHRUNGSKETTEN SPIEL (FOOD CHAIN)
// ==========================================
const chainItems = WORLD_CONTENT.foodChainItems;

function FoodChainGame({ onCorrect }) {
  const [slots, setSlots] = useState({ slot1: null, slot2: null, slot3: null });
  const [inventory, setInventory] = useState(chainItems);
  const [feedback, setFeedback] = useState(null);
  const slotsRef = useRef({});

  const expectedOrder = ["plant", "herbivore", "carnivore"];

  const handleDragEnd = (item, point) => {
    let droppedSlot = null;
    Object.keys(slotsRef.current).forEach(slotName => {
      const el = slotsRef.current[slotName];
      if (el) {
        const rect = el.getBoundingClientRect();
        const rL = rect.left + window.scrollX;
        const rR = rect.right + window.scrollX;
        const rT = rect.top + window.scrollY;
        const rB = rect.bottom + window.scrollY;
        if (point.x >= rL - 20 && point.x <= rR + 20 && point.y >= rT - 20 && point.y <= rB + 20) {
          droppedSlot = slotName;
        }
      }
    });

    if (droppedSlot) {
      playPop();
      setSlots(prev => ({ ...prev, [droppedSlot]: item }));
      setInventory(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const check = () => {
    const currentOrder = [slots.slot1?.type, slots.slot2?.type, slots.slot3?.type];
    if (currentOrder.join(",") === expectedOrder.join(",")) {
      playSparkle(); setFeedback("richtig"); onCorrect(5); confetti();
    } else {
      playError(); setFeedback("falsch"); setTimeout(() => setFeedback(null), 3000);
    }
  };

  const reset = () => {
    playPop();
    setSlots({ slot1: null, slot2: null, slot3: null });
    setInventory(chainItems);
    setFeedback(null);
  };

  return (
    <div className="flex flex-col items-center gap-10 py-8">
      <p className="font-hand text-2xl text-slate-500">Wer isst wen? Bilde die richtige Reihenfolge!</p>
      
      <div className="flex gap-8 items-center bg-emerald-50/50 p-8 rounded-[40px] border-4 border-dashed border-emerald-200">
        {[1, 2, 3].map((num) => {
          const slotName = `slot${num}`;
          const item = slots[slotName];
          return (
            <div key={num} className="flex items-center gap-8">
              <div 
                ref={el => slotsRef.current[slotName] = el}
                className="w-32 h-32 bg-white rounded-full border-4 border-emerald-100 shadow-inner flex items-center justify-center text-6xl relative"
              >
                {item && <motion.div initial={{scale:0}} animate={{scale:1}}>{item.emoji}</motion.div>}
                {!item && <span className="text-xl text-emerald-200 font-hand">{num}</span>}
              </div>
              {num < 3 && <div className="text-4xl text-emerald-300">➜</div>}
            </div>
          )
        })}
      </div>

      <div className="flex gap-6 p-6 bg-white/60 rounded-[30px] border-2 border-white shadow-xl min-h-[120px]">
        <AnimatePresence>
          {inventory.map(item => (
            <motion.div
              key={item.id} drag dragSnapToOrigin
              onDragEnd={(e, info) => handleDragEnd(item, info.point)}
              whileDrag={{ scale: 1.3, zIndex: 100 }}
              initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}
              className="w-24 h-24 bg-white rounded-2xl shadow-lg border-2 border-slate-100 flex flex-col items-center justify-center text-5xl cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
            >
              {item.emoji}
              <span className="text-xs font-hand text-slate-400 mt-1">{item.name}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        <button onClick={reset} className="px-6 py-3 bg-slate-200 text-slate-600 rounded-xl font-hand text-xl hover:bg-slate-300">Nochmal</button>
        <motion.button onClick={check} className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-xl hover:bg-emerald-600 shadow-lg" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Kette prüfen!</motion.button>
      </div>
      {feedback === "falsch" && <p className="font-hand text-2xl text-red-500">Irgendetwas stimmt hier nicht ganz...</p>}
      {feedback === "richtig" && <p className="font-hand text-3xl text-emerald-500">Perfekt! Der Kreislauf der Natur.</p>}
    </div>
  );
}


// ==========================================
// 3. LEBENSZYKLUS (LIFE CYCLE)
// ==========================================
const frogCycle = WORLD_CONTENT.lifeCycles[0].stages;

function LifeCycleGame({ onCorrect }) {
  const [slots, setSlots] = useState({ s1: null, s2: null, s3: null, s4: null });
  const [inventory, setInventory] = useState([...frogCycle].sort(() => Math.random() - 0.5));
  const [feedback, setFeedback] = useState(null);
  const slotsRef = useRef({});

  const handleDragEnd = (item, point) => {
    let droppedSlot = null;
    Object.keys(slotsRef.current).forEach(slotName => {
      const el = slotsRef.current[slotName];
      if (el) {
        const rect = el.getBoundingClientRect();
        const rL = rect.left + window.scrollX;
        const rR = rect.right + window.scrollX;
        const rT = rect.top + window.scrollY;
        const rB = rect.bottom + window.scrollY;
        if (point.x >= rL - 20 && point.x <= rR + 20 && point.y >= rT - 20 && point.y <= rB + 20) {
          droppedSlot = slotName;
        }
      }
    });

    if (droppedSlot) {
      playPop();
      setSlots(prev => ({ ...prev, [droppedSlot]: item }));
      setInventory(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const check = () => {
    const isCorrect = 
      slots.s1?.stage === 1 && slots.s2?.stage === 2 && 
      slots.s3?.stage === 3 && slots.s4?.stage === 4;
      
    if (isCorrect) {
      playSparkle(); setFeedback("richtig"); onCorrect(5); confetti();
    } else {
      playError(); setFeedback("falsch"); setTimeout(() => setFeedback(null), 3000);
    }
  };

  const reset = () => {
    playPop();
    setSlots({ s1: null, s2: null, s3: null, s4: null });
    setInventory([...frogCycle].sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  return (
    <div className="flex flex-col items-center gap-10 py-8">
      <p className="font-hand text-2xl text-slate-500">Wie wächst ein Frosch? Sortiere den Lebenszyklus!</p>
      
      <div className="relative w-96 h-96 bg-blue-50/50 rounded-full border-4 border-dashed border-blue-200 shadow-inner flex items-center justify-center">
        {/* Helper Arrows */}
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 border-t-4 border-blue-200 border-dashed rounded-full h-full pointer-events-none opacity-50" />
        
        {[{id:"s1", pos:"-top-12 left-1/2 -translate-x-1/2"}, {id:"s2", pos:"top-1/2 -right-12 -translate-y-1/2"}, {id:"s3", pos:"-bottom-12 left-1/2 -translate-x-1/2"}, {id:"s4", pos:"top-1/2 -left-12 -translate-y-1/2"}].map((slot, i) => {
          const item = slots[slot.id];
          return (
            <div 
              key={slot.id}
              ref={el => slotsRef.current[slot.id] = el}
              className={`absolute ${slot.pos} w-28 h-28 bg-white rounded-full border-4 border-blue-100 shadow-xl flex items-center justify-center text-5xl`}
            >
              {item ? <motion.div initial={{scale:0}} animate={{scale:1}}>{item.emoji}</motion.div> : <span className="text-xl text-blue-200 font-hand">{i+1}</span>}
            </div>
          )
        })}
      </div>

      <div className="flex gap-6 mt-10">
        <AnimatePresence>
          {inventory.map(item => (
            <motion.div
              key={item.id} drag dragSnapToOrigin
              onDragEnd={(e, info) => handleDragEnd(item, info.point)}
              whileDrag={{ scale: 1.3, zIndex: 100 }}
              initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}
              className="w-24 h-24 bg-white rounded-3xl shadow-lg border-2 border-slate-100 flex flex-col items-center justify-center text-5xl cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
            >
              {item.emoji}
              <span className="text-xs font-hand text-slate-400 mt-1">{item.name}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        <button onClick={reset} className="px-6 py-3 bg-slate-200 text-slate-600 rounded-xl font-hand text-xl hover:bg-slate-300">Nochmal</button>
        <motion.button onClick={check} className="px-10 py-4 bg-blue-500 text-white rounded-2xl font-bold text-xl hover:bg-blue-600 shadow-lg" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Kreislauf prüfen!</motion.button>
      </div>
      {feedback === "falsch" && <p className="font-hand text-2xl text-red-500">Die Reihenfolge passt noch nicht...</p>}
      {feedback === "richtig" && <p className="font-hand text-3xl text-emerald-500">Wunderbar! Ein neuer Frosch!</p>}
    </div>
  )
}


// ==========================================
// MAIN WRAPPER: Sachunterricht Module
// ==========================================
export default function SachunterrichtModule({ onCorrect = () => {}, onWrong = () => {} }) {
  const [activeTab, setActiveTab] = useState("himmelwelt");

  const tabs = [
    { id: "himmelwelt", label: "Himmelswelt", color: "bg-sky-500" },
    { id: "arcade", label: "Arcade-Welt", color: "bg-orange-500" },
    { id: "sinn", label: "Denk-Abenteuer", color: "bg-slate-900" },
    { id: "sandbox", label: "Die Welt-Sandbox", color: "bg-emerald-400" },
    { id: "wetter", label: "Wetter-Atelier", color: "bg-sky-400" },
    { id: "jahreskreis", label: "Jahreskreis", color: "bg-orange-400" },
    { id: "chain", label: "Nahrungskette", color: "bg-amber-400" },
    { id: "cycle", label: "Lebenszyklus", color: "bg-blue-400" },
    { id: "spuren", label: "Spuren-Detektiv", color: "bg-lime-400" },
    { id: "spielwelt", label: "Spielwelt", color: "bg-fuchsia-500" },
    { id: "quest", label: "Quest-Mixer", color: "bg-teal-500" },
    { id: "premium", label: "Premium-Atelier", color: "bg-amber-500" },
    { id: "action", label: "Forscher-Fangspiel", color: "bg-orange-500" },
    { id: "varianten", label: "Mega-Auswahl", color: "bg-slate-800" }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-20">
      
      <div className="text-center space-y-4">
        <h2 className="font-hand text-5xl font-bold text-slate-800 tracking-wide">Natur & Welt</h2>
        <p className="font-hand text-2xl text-slate-500">Erforsche die Geheimnisse der Natur.</p>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap justify-center gap-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => { playPop(); setActiveTab(tab.id); }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-full font-hand text-xl font-bold transition-all shadow-md ${isActive ? `${tab.color} text-white` : "bg-white text-slate-400 border-2 border-slate-100 hover:border-slate-300"}`}
            >
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      {/* CONTENT */}
      <div className="bg-white/50 backdrop-blur-xl rounded-[50px] p-8 border-4 border-white shadow-2xl relative overflow-hidden min-h-[500px]">
         <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {activeTab === "himmelwelt" && (
                <Suspense fallback={<div className="min-h-[620px] rounded-[34px] bg-sky-100/80 border-4 border-white shadow-lg" />}>
                  <SkyWonderland title="Himmelswunderland" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "arcade" && (
                <Suspense fallback={<div className="min-h-[660px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" />}>
                  <LearningArcade subject="sachunterricht" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "sinn" && (
                <Suspense fallback={<div className="min-h-[640px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" />}>
                  <DeepLearningQuest subject="sachunterricht" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "sandbox" && <EcosystemSandbox />}
              {activeTab === "wetter" && <WetterAtelier onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "jahreskreis" && <Jahreskreis onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "chain" && <FoodChainGame onCorrect={onCorrect} />}
              {activeTab === "cycle" && <LifeCycleGame onCorrect={onCorrect} />}
              {activeTab === "spuren" && <SpurenDetektiv onCorrect={onCorrect} onWrong={onWrong} />}
              {activeTab === "spielwelt" && (
                <GameWorld
                  title="Forscher-Spielwelt"
                  intro="Acht Spielarten mit Expedition, Atelier, Puzzle und erweitertem Premium-Forscherpool."
                  collections={SUBJECT_VARIANT_CONTENT.sachunterricht}
                  accent="bg-emerald-500"
                  scene="world"
                  onCorrect={onCorrect}
                  onWrong={onWrong}
                />
              )}
              {activeTab === "quest" && (
                <QuestMixer
                  title="Forscher-Quest-Mixer"
                  intro="Expedition, Puzzle, Sternenlauf und Kartenwirbel für Lebensräume, Wetter, Experimente und Naturpflege."
                  collections={SUBJECT_VARIANT_CONTENT.sachunterricht}
                  accent="bg-emerald-500"
                  onCorrect={onCorrect}
                  onWrong={onWrong}
                />
              )}
                            {activeTab === "premium" && (
                <Suspense fallback={<div className="min-h-[360px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" />}>
                  <SubjectPremiumAtelier subject="sachunterricht" onCorrect={onCorrect} onWrong={onWrong} />
                </Suspense>
              )}
              {activeTab === "action" && (
                <ActionArena
                  title="Forscher-Fangspiel"
                  intro="Fang die richtige Naturantwort, bevor die Runde abläuft."
                  collections={SUBJECT_VARIANT_CONTENT.sachunterricht}
                  accent="bg-emerald-500"
                  onCorrect={onCorrect}
                  onWrong={onWrong}
                />
              )}
              {activeTab === "varianten" && (
                <VariantStudio
                  title="Welt-Mega-Auswahl"
                  intro="Viele Lebensraum-, Wetter-, Jahreszeiten-, Experiment- und Naturpflegekarten zum Forschen und Variieren."
                  collections={SUBJECT_VARIANT_CONTENT.sachunterricht}
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
