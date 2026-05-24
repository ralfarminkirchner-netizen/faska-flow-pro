import { lazy, Suspense, useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { playInstrumentTone, playJingle, playPop, getAudioContext } from "../utils/sounds";
import BeatMaker from "../components/BeatMaker/BeatMaker";
import LyricsEditor from "../components/Musik/LyricsEditor";
import FreePlay from "../components/Musik/FreePlay";
import KlangMemory from "../components/games/KlangMemory";
import RhythmusGarten from "../components/games/RhythmusGarten";
import VariantStudio from "../components/games/VariantStudio";
import ActionArena from "../components/games/ActionArena";
import GameWorld from "../components/games/GameWorld";
import QuestMixer from "../components/games/QuestMixer";
import { SUBJECT_VARIANT_CONTENT } from "../data/learningContent";

const SubjectPremiumAtelier = lazy(() => import("../components/games/SubjectPremiumAtelier"));
const SkyWonderland = lazy(() => import("../components/games/SkyWonderland"));
const DeepLearningQuest = lazy(() => import("../components/games/DeepLearningQuest"));
const LearningArcade = lazy(() => import("../components/games/LearningArcade"));

const NOTE_COLORS = ["#fca5a5", "#fcd34d", "#6ee7b7", "#60a5fa", "#c084fc", "#f472b6"];
const NOTES = [
  { name: "C", freq: 261.63, color: "#fca5a5", y: 80 },
  { name: "D", freq: 293.66, color: "#fcd34d", y: 70 },
  { name: "E", freq: 329.63, color: "#6ee7b7", y: 60 },
  { name: "F", freq: 349.23, color: "#60a5fa", y: 50 },
  { name: "G", freq: 392.0, color: "#c084fc", y: 40 },
  { name: "A", freq: 440.0, color: "#f472b6", y: 30 },
];

const InstrumentIcon = ({ type, color = "currentColor", size = 48 }) => {
  const commonProps = {
    stroke: color, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round",
    fill: "none", className: "watercolor-effect wiggle"
  };
  switch (type) {
    case "tasten": return <svg width={size} height={size} viewBox="0 0 48 48" {...commonProps}><path d="M6 10 C6 8 8 6 10 6 H38 C40 6 42 8 42 10 V38 C42 40 40 42 38 42 H10 C8 42 6 40 6 38 Z" fill={color + "20"} /><path d="M12 6v24 M18 6v24 M24 6v24 M30 6v24 M36 6v24" /><path d="M6 30 Q24 28 42 30" /><path d="M15 6v14 M21 6v14 M33 6v14 M39 6v14" strokeWidth="4" /></svg>;
    default: return null;
  }
};

export default function MusikModule({ onCorrect = () => {}, onWrong = () => {} }) {
  const [placedNotes, setPlacedNotes] = useState([]); // { id, note, x, y }
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("himmelwelt");
  const [playheadX, setPlayheadX] = useState(0);
  const boardRef = useRef(null);
  const sweepControls = useAnimationControls();

  // --- Audio ---
  const triggerNote = useCallback((freq) => {
    try {
      playInstrumentTone("traum", freq, { velocity: 0.72, send: 0.28 });
    } catch (e) { console.log("Audio Error:", e); }
  }, []);

  const handleDragEndFromPalette = (note, point) => {
    if (!boardRef.current) return;
    const board = boardRef.current.getBoundingClientRect();
    
    // Convert board (viewport-relative) to page-relative to match Framer's `point`
    const boardLeft = board.left + window.scrollX;
    const boardRight = board.right + window.scrollX;
    const boardTop = board.top + window.scrollY;
    const boardBottom = board.bottom + window.scrollY;
    
    // Add a small buffer so it's easier for kids to drop
    const buffer = 30;

    if (
      point.x >= boardLeft - buffer && 
      point.x <= boardRight + buffer && 
      point.y >= boardTop - buffer && 
      point.y <= boardBottom + buffer
    ) {
      playPop();
      
      const x = point.x - boardLeft - 24; // Center logic
      const yRelative = point.y - boardTop;
      
      const closestNote = NOTES.reduce((prev, curr) => (
        Math.abs(curr.y*4.5 - yRelative) < Math.abs(prev.y*4.5 - yRelative) ? curr : prev
      ));
      
      setPlacedNotes(prev => [...prev, { 
        id: Date.now(), 
        freq: closestNote.freq, 
        color: closestNote.color, 
        x: Math.max(0, Math.min(x, board.width - 48)), 
        y: closestNote.y*4.5 - 24, 
        name: closestNote.name 
      }]);
    }
  };

  const removeItem = (id) => { playPop(); setPlacedNotes(prev => prev.filter(n => n.id !== id)); };

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now();
      const duration = 4000; // 4 seconds for full sweep
      const triggeredRef = new Set();

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed % duration) / duration;
        const currentX = progress * 100;
        setPlayheadX(currentX);

        placedNotes.forEach(note => {
          const noteProgress = (note.x / (boardRef.current.clientWidth)) * 100;
          if (Math.abs(currentX - noteProgress) < 1 && !triggeredRef.has(note.id)) {
            triggerNote(note.freq);
            triggeredRef.add(note.id);
            setTimeout(() => triggeredRef.delete(note.id), 200); // Debounce
          }
        });
      }, 16);
      return () => clearInterval(interval);
    } else {
      setPlayheadX(0);
    }
  }, [isPlaying, placedNotes, triggerNote]);

  return (
    <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto pb-20">
      <div className="text-center space-y-4">
        <h2 className="font-hand text-4xl font-bold text-slate-800">Klang & Instrumente</h2>
        <p className="font-hand text-2xl text-slate-500">Hören, bauen, vergleichen.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {[
          { id: "himmelwelt", label: "Himmelswelt", icon: "🌤️" },
          { id: "arcade", label: "Arcade-Welt", icon: "🎮" },
          { id: "sinn", label: "Denk-Abenteuer", icon: "🧭" },
          { id: "melodie", label: "Zauber-Melodie", icon: "🎵" },
          { id: "rhythmus", label: "Rhythmus-Garten", icon: "🌿" },
          { id: "klangmemory", label: "Klang-Memory", icon: "🔔" },
          { id: "beat", label: "Beat Studio", icon: "🥁" },
          { id: "lyrics", label: "Songtexte", icon: "📝" },
          { id: "freeplay", label: "Freies Spielen", icon: "🎹" },
          { id: "spielwelt", label: "Spielwelt", icon: "🎲" },
          { id: "quest", label: "Quest-Mixer", icon: "🧭" },
          { id: "premium", label: "Premium-Atelier", icon: "✨" },
          { id: "action", label: "Klang-Fangspiel", icon: "💫" },
          { id: "klanglabor", label: "Mega-Auswahl", icon: "🧭" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { playPop(); setActiveTab(tab.id); }}
            className={`px-6 py-3 rounded-full font-sans font-bold text-lg transition-all flex items-center gap-2 ${
              activeTab === tab.id 
                ? "bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/40 transform scale-105" 
                : "bg-white/60 text-slate-500 hover:bg-white/80"
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "himmelwelt" && (
        <Suspense fallback={<div className="min-h-[620px] rounded-[34px] bg-sky-100/80 border-4 border-white shadow-lg" />}>
          <SkyWonderland title="Klang-Himmel" onCorrect={onCorrect} onWrong={onWrong} />
        </Suspense>
      )}

      {activeTab === "arcade" && (
        <Suspense fallback={<div className="min-h-[660px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" />}>
          <LearningArcade subject="musik" onCorrect={onCorrect} onWrong={onWrong} />
        </Suspense>
      )}

      {activeTab === "sinn" && (
        <Suspense fallback={<div className="min-h-[640px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" />}>
          <DeepLearningQuest subject="musik" onCorrect={onCorrect} onWrong={onWrong} />
        </Suspense>
      )}

      {activeTab === "melodie" && (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* PALETTE */}
        <div className="lg:w-1/4 bg-white/60 backdrop-blur-md rounded-3xl p-6 border-2 border-white shadow-xl relative z-50 flex flex-col gap-6">
          <h3 className="font-hand text-2xl font-bold text-slate-700 border-b pb-2">Notenschrank</h3>
          <div className="flex flex-wrap lg:flex-col gap-4 justify-center items-center">
            {NOTES.map(n => (
              <motion.div
                key={n.name}
                drag
                dragSnapToOrigin={true}
                dragConstraints={null}
                onDragEnd={(e, info) => handleDragEndFromPalette(n, info.point)}
                whileDrag={{ scale: 1.3, zIndex: 100 }}
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg border-2 border-white text-white font-hand text-2xl font-bold hover:drag-shadow active:drag-shadow transition-shadow"
                style={{ backgroundColor: n.color }}
              >
                {n.name}
              </motion.div>
            ))}
          </div>
        </div>

        {/* COMPOSER BOARD */}
        <div className="lg:w-3/4 flex flex-col gap-6">
          <div 
            ref={boardRef}
            className="music-drop-zone relative h-[450px] bg-white rounded-[40px] border-4 border-slate-100 shadow-2xl overflow-hidden paper-texture"
          >
            {/* Staff Lines */}
            <div className="absolute inset-0 flex flex-col justify-around py-20 pointer-events-none opacity-20">
              {[1, 2, 3, 4, 5].map(l => <div key={l} className="h-0.5 bg-slate-800 w-full" />)}
            </div>

            {/* Playhead */}
            {isPlaying && (
              <motion.div 
                className="absolute top-0 bottom-0 w-1 bg-rose-400 z-50 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                style={{ left: `${playheadX}%` }}
              />
            )}

            {/* Placed Notes */}
            <AnimatePresence>
              {placedNotes.map(n => (
                <motion.div
                  key={n.id}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute w-12 h-12 rounded-full cursor-pointer flex items-center justify-center text-white font-hand text-xl font-bold shadow-md z-10 watercolor-effect hover:drag-shadow active:drag-shadow transition-shadow"
                  style={{ left: n.x, top: n.y, backgroundColor: n.color }}
                  onDoubleClick={() => removeItem(n.id)}
                  whileHover={{ scale: 1.1 }}
                >
                  {n.name}
                </motion.div>
              ))}
            </AnimatePresence>

            {placedNotes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <p className="font-hand text-5xl text-slate-800 rotate-[-2deg]">Schreibe dein Lied...</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm p-6 rounded-[30px] border-2 border-white shadow-lg">
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const nextState = !isPlaying;
                  if (nextState) {
                    const ctx = getAudioContext();
                    if (ctx?.state === 'suspended') ctx.resume();
                    playJingle("start");
                  }
                  setIsPlaying(nextState);
                }}
                className={`px-12 py-4 rounded-2xl font-sans font-bold text-xl shadow-lg transition-all flex items-center gap-3
                  ${isPlaying ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}`}
              >
                {isPlaying ? (
                  <><div className="w-4 h-4 bg-white rounded-sm" /> Stop</>
                ) : (
                  <><div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent" /> Lied abspielen</>
                )}
              </motion.button>
              <button onClick={() => setPlacedNotes([])} className="font-hand text-2xl text-slate-400 px-4">Alles löschen</button>
            </div>
            
            <div className="text-right">
              <p className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest">Töne im Lied</p>
              <p className="font-hand text-4xl text-slate-800 font-bold">{placedNotes.length}</p>
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === "rhythmus" && <RhythmusGarten onCorrect={onCorrect} onWrong={onWrong} />}
      {activeTab === "klangmemory" && <KlangMemory onCorrect={onCorrect} onWrong={onWrong} />}
      {activeTab === "beat" && <BeatMaker />}
      {activeTab === "lyrics" && <LyricsEditor />}
      {activeTab === "freeplay" && <FreePlay />}
      {activeTab === "spielwelt" && (
        <GameWorld
          title="Klang-Spielwelt"
          intro="Acht Spielarten für Instrumente, Rhythmus, Klangfarben, Tempo und Premium-Orchesterkarten."
          collections={SUBJECT_VARIANT_CONTENT.musik}
          accent="bg-fuchsia-500"
          scene="music"
          onCorrect={onCorrect}
          onWrong={onWrong}
        />
      )}
      {activeTab === "quest" && (
        <QuestMixer
          title="Klang-Quest-Mixer"
          intro="Expedition, Puzzle, Sternenlauf und Kartenwirbel für Instrumente, Tempo, Klangfarben und Orchesterwissen."
          collections={SUBJECT_VARIANT_CONTENT.musik}
          accent="bg-emerald-500"
          onCorrect={onCorrect}
          onWrong={onWrong}
        />
      )}
            {activeTab === "premium" && (
        <Suspense fallback={<div className="min-h-[360px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" />}>
          <SubjectPremiumAtelier subject="musik" onCorrect={onCorrect} onWrong={onWrong} />
        </Suspense>
      )}
      {activeTab === "action" && (
        <ActionArena
          title="Klang-Fangspiel"
          intro="Fang Instrumente, Muster und Klangwörter mit Zeit, Herzen und Combo."
          collections={SUBJECT_VARIANT_CONTENT.musik}
          accent="bg-fuchsia-500"
          onCorrect={onCorrect}
          onWrong={onWrong}
        />
      )}
      {activeTab === "klanglabor" && (
        <VariantStudio
          title="Klang-Mega-Auswahl"
          intro="Viele Instrumenten-, Rhythmus-, Tempo-, Dynamik-, Orchester- und Klangfarbenkarten zum Hören, Denken und Spielen."
          collections={SUBJECT_VARIANT_CONTENT.musik}
          onCorrect={onCorrect}
          onWrong={onWrong}
        />
      )}
    </div>
  );
}
