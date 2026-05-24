import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { playInstrumentTone, playJingle, playPop } from "../../utils/sounds";

const NOTES = [
  { name: "C", freq: 261.63, color: "#fca5a5", key: "a" },
  { name: "D", freq: 293.66, color: "#fcd34d", key: "s" },
  { name: "E", freq: 329.63, color: "#6ee7b7", key: "d" },
  { name: "F", freq: 349.23, color: "#60a5fa", key: "f" },
  { name: "G", freq: 392.0, color: "#c084fc", key: "g" },
  { name: "A", freq: 440.0, color: "#f472b6", key: "h" },
  { name: "B", freq: 493.88, color: "#fb923c", key: "j" },
  { name: "C5", freq: 523.25, color: "#fca5a5", key: "k" },
];

const INSTRUMENTS = [
  { id: "piano", name: "Klavier", icon: "🎹", color: "#6366f1", hint: "weich und klar" },
  { id: "glockenspiel", name: "Glockenspiel", icon: "🔔", color: "#f59e0b", hint: "hell und funkelnd" },
  { id: "floete", name: "Flöte", icon: "🪈", color: "#14b8a6", hint: "luftig und sanft" },
  { id: "geige", name: "Geige", icon: "🎻", color: "#ef4444", hint: "warm gestrichen" },
  { id: "gitarre", name: "Gitarre", icon: "🎸", color: "#d97706", hint: "gezupft" },
  { id: "bass", name: "Kontrabass", icon: "🎻", color: "#475569", hint: "tief und rund" },
  { id: "orgel", name: "Orgel", icon: "⛪", color: "#8b5cf6", hint: "voll und tragend" },
  { id: "xylophon", name: "Xylophon", icon: "🪵", color: "#22c55e", hint: "kurz und hüpfend" },
  { id: "kalimba", name: "Kalimba", icon: "🫧", color: "#06b6d4", hint: "kleine Tropfen" },
  { id: "trompete", name: "Trompete", icon: "🎺", color: "#f97316", hint: "mutig und hell" },
  { id: "chor", name: "Chor", icon: "🎶", color: "#ec4899", hint: "weich schwebend" },
  { id: "traum", name: "Traum-Synth", icon: "✨", color: "#a855f7", hint: "schimmernd" },
];

const OCTAVES = [
  { id: "low", label: "tief", factor: 0.5 },
  { id: "middle", label: "mittel", factor: 1 },
  { id: "high", label: "hoch", factor: 2 },
];

export default function FreePlay() {
  const [activeNote, setActiveNote] = useState(null);
  const [activeInstrument, setActiveInstrument] = useState(INSTRUMENTS[0]);
  const [activeOctave, setActiveOctave] = useState(OCTAVES[1]);

  const triggerNote = useCallback((note) => {
    setActiveNote(note.name);
    setTimeout(() => setActiveNote(null), 220);
    try {
      playInstrumentTone(activeInstrument.id, note.freq * activeOctave.factor, { velocity: 0.95, send: 0.24 });
    } catch (e) { console.log(e); }
  }, [activeInstrument, activeOctave]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat) return;
      const key = event.key.toLowerCase();
      const note = NOTES.find((item) => item.key === key);
      if (!note) return;
      event.preventDefault();
      triggerNote(note);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerNote]);

  const selectInstrument = (instrument) => {
    playInstrumentTone(instrument.id, 329.63, { velocity: 0.7, send: 0.2 });
    setActiveInstrument(instrument);
  };

  const selectOctave = (octave) => {
    playJingle("start");
    setActiveOctave(octave);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto items-center">
      <div className="text-center space-y-4">
        <h2 className="font-hand text-4xl font-bold text-slate-800">Freies Instrumenten-Spiel</h2>
        <p className="font-hand text-2xl text-slate-500">Wähle ein Instrument und spiele mit Tasten oder Computertastatur (A-K).</p>
      </div>

      <div className="w-full bg-white/60 backdrop-blur-md rounded-[46px] p-6 border-4 border-white shadow-2xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-[26px] border-4 border-white shadow-lg flex items-center justify-center text-5xl" style={{ backgroundColor: `${activeInstrument.color}22` }}>
              {activeInstrument.icon}
            </div>
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">Aktives Instrument</p>
              <h3 className="font-hand text-4xl font-bold text-slate-800">{activeInstrument.name}</h3>
              <p className="font-hand text-xl text-slate-500">{activeInstrument.hint}</p>
            </div>
          </div>

          <div className="flex gap-2 bg-white/70 rounded-full p-2 border-2 border-white shadow-inner w-fit">
            {OCTAVES.map((octave) => (
              <button
                key={octave.id}
                onClick={() => selectOctave(octave)}
                className={`px-5 py-2 rounded-full font-hand text-xl font-bold transition-all ${
                  activeOctave.id === octave.id ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:bg-white"
                }`}
              >
                {octave.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {INSTRUMENTS.map((instrument) => {
            const isActive = activeInstrument.id === instrument.id;
            return (
              <motion.button
                key={instrument.id}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectInstrument(instrument)}
                className={`min-h-28 rounded-[28px] border-4 p-3 shadow-md flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive ? "border-white ring-4 ring-white scale-[1.02]" : "border-white/70 bg-white/65 hover:bg-white"
                }`}
                style={{ backgroundColor: isActive ? `${instrument.color}22` : undefined }}
              >
                <span className="text-4xl">{instrument.icon}</span>
                <span className="font-hand text-2xl font-bold text-slate-700 leading-none">{instrument.name}</span>
                <span className="font-sans text-[10px] uppercase tracking-wide text-slate-400 text-center">{instrument.hint}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex gap-2 p-4 bg-slate-800 rounded-3xl shadow-inner w-full justify-between overflow-x-auto relative">
          {NOTES.map(n => (
            <motion.div
              key={n.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95, y: 10 }}
              onClick={() => { playPop(); triggerNote(n); }}
              className={`relative flex flex-col justify-end pb-8 items-center w-20 md:w-28 h-64 rounded-b-2xl cursor-pointer shadow-lg transition-colors border-2
                ${activeNote === n.name ? 'border-white brightness-110' : 'border-transparent'}`}
              style={{ 
                backgroundColor: n.color,
                boxShadow: activeNote === n.name ? `0 0 30px ${n.color}` : 'none'
              }}
            >
              <span className="font-hand text-3xl font-bold text-white drop-shadow-md">{n.name}</span>
              <span className="absolute bottom-2 font-sans text-xs font-bold text-white/50 uppercase">{n.key}</span>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Visualizer Background Effect */}
      {activeNote && (
         <div 
           className="fixed inset-0 pointer-events-none z-[-1] opacity-20 transition-colors duration-300"
           style={{ backgroundColor: activeInstrument.color || NOTES.find(n => n.name === activeNote)?.color || 'transparent' }}
         />
      )}
    </div>
  );
}
