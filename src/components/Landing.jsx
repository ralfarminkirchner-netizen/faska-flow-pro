import { motion } from "framer-motion";
import { playPop } from "../utils/sounds";

const cardBase =
  "relative group flex flex-col items-center justify-end text-center overflow-hidden rounded-[2rem] border-2 shadow-xl cursor-pointer p-6 md:p-8 min-h-[260px] md:min-h-[340px] transition-all";

export default function Landing({ onSelectFlow, onSelectArcade }) {
  const choose = (fn) => () => {
    playPop();
    fn();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50 paper-texture px-4 py-10 relative overflow-hidden">
      {/* soft glows */}
      <div className="absolute top-1/4 -left-10 w-80 h-80 bg-amber-200 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-10 w-80 h-80 bg-purple-200 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <motion.h1
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
        className="font-hand text-5xl md:text-7xl font-bold mb-2 relative z-10"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #db2777, #d97706)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        FASKA flow!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-sans text-slate-500 text-lg md:text-xl mb-10 relative z-10"
      >
        Was möchtest du heute machen?
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 w-full max-w-3xl relative z-10">
        {/* ── FASKA Flow: Lernen ── */}
        <motion.button
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
          whileHover={{ y: -8, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={choose(onSelectFlow)}
          className={`${cardBase} border-amber-200 bg-gradient-to-br from-amber-100 to-rose-100`}
        >
          <img
            src="/animal-friends/luna-hase.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-contain object-center opacity-90 p-6 transition-transform group-hover:scale-105"
            loading="eager"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/90 to-transparent" />
          <div className="relative z-10">
            <span className="text-4xl">🌸</span>
            <p className="font-hand text-3xl md:text-4xl font-bold text-slate-800 mt-1">FASKA Flow</p>
            <p className="font-sans text-sm md:text-base text-slate-600 mt-1">Lernen, Musik & Gefühle</p>
          </div>
        </motion.button>

        {/* ── Retro Arcade: Spielen ── */}
        <motion.button
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, type: "spring", bounce: 0.4 }}
          whileHover={{ y: -8, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={choose(onSelectArcade)}
          className={`${cardBase} border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900`}
        >
          <img
            src="/animal-friends/bruno-baer.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-contain object-center opacity-90 p-6 transition-transform group-hover:scale-105"
            loading="eager"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/95 to-transparent" />
          <div className="relative z-10">
            <span className="text-4xl">🕹️</span>
            <p className="font-hand text-3xl md:text-4xl font-bold text-white mt-1">Retro Arcade</p>
            <p className="font-sans text-sm md:text-base text-slate-300 mt-1">Spielen & Spaß haben</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
