import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playPop, playSparkle } from "../../utils/sounds";

export default function LyricsEditor() {
  const [lyrics, setLyrics] = useState("");
  const [savedSongs, setSavedSongs] = useState([]);
  const [title, setTitle] = useState("Mein neuer Song");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const saveSong = () => {
    if (lyrics.trim() === "") return;
    playSparkle();
    setSavedSongs([{ title, lyrics, date: new Date().toLocaleDateString() }, ...savedSongs]);
    setLyrics("");
    setTitle("Mein neuer Song");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Editor Area */}
      <div className="lg:w-2/3 flex flex-col gap-6">
        <div className="bg-[#fdfbf7] rounded-[40px] border-4 border-slate-200 shadow-xl overflow-hidden paper-texture p-8 min-h-[500px] flex flex-col">
          {/* Title Edit */}
          <div className="flex items-center gap-4 mb-8 border-b-2 border-slate-200 pb-4">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
                className="font-hand text-4xl font-bold text-slate-800 bg-transparent border-none outline-none w-full"
              />
            ) : (
              <h3 
                className="font-hand text-4xl font-bold text-slate-800 cursor-pointer hover:text-rose-500 transition-colors flex items-center gap-4"
                onClick={() => { playPop(); setIsEditingTitle(true); }}
              >
                {title} <span className="text-2xl text-slate-400">✎</span>
              </h3>
            )}
          </div>

          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Schreibe deinen Songtext hier..."
            className="w-full flex-grow font-hand text-3xl leading-relaxed text-slate-700 bg-transparent border-none outline-none resize-none placeholder:opacity-30"
            style={{ 
              backgroundImage: 'linear-gradient(transparent, transparent 38px, #e2e8f0 38px, #e2e8f0 40px)',
              backgroundSize: '100% 40px',
              lineHeight: '40px'
            }}
          />
        </div>

        <div className="flex justify-end">
           <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={saveSong}
              className="px-8 py-3 bg-fuchsia-500 text-white font-sans font-bold text-xl rounded-full shadow-lg hover:bg-fuchsia-600 transition-all flex items-center gap-2"
           >
              <span>💾</span> Speichern
           </motion.button>
        </div>
      </div>

      {/* Saved Songs Sidebar */}
      <div className="lg:w-1/3 bg-white/60 backdrop-blur-md rounded-3xl p-6 border-2 border-white shadow-xl flex flex-col gap-6 max-h-[600px] overflow-y-auto">
        <h4 className="font-hand text-3xl font-bold text-slate-700 border-b pb-2">Meine Hits</h4>
        {savedSongs.length === 0 ? (
          <p className="font-hand text-xl text-slate-400 opacity-60 text-center mt-10">Noch keine Songs gespeichert.</p>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {savedSongs.map((song, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                     playPop();
                     setTitle(song.title);
                     setLyrics(song.lyrics);
                  }}
                >
                  <p className="font-hand text-xl font-bold text-slate-700">{song.title}</p>
                  <p className="text-xs font-sans text-slate-400 mt-1">{song.date}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
}
