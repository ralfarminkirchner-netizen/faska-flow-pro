import { motion, AnimatePresence } from "framer-motion";

export const BADGES = [
  { id: "spark", name: "Erster Funke", icon: "✨", points: 20 },
  { id: "garden", name: "Wissens-Garten", icon: "🌿", points: 80 },
  { id: "bridge", name: "Brückenbauer", icon: "🌉", points: 160 },
  { id: "star", name: "Sternenpfad", icon: "⭐", points: 280 },
  { id: "flow", name: "Flow-Meister", icon: "🧭", points: 420 },
];

const SUBJECT_NODES = [
  { id: "deutsch", label: "Worte", icon: "📖", color: "bg-amber-300" },
  { id: "mathe", label: "Zahlen", icon: "🧮", color: "bg-sky-300" },
  { id: "sachunterricht", label: "Welt", icon: "🌍", color: "bg-emerald-300" },
  { id: "ethik", label: "Herz", icon: "🤝", color: "bg-fuchsia-300" },
  { id: "musik", label: "Klang", icon: "🎵", color: "bg-rose-300" },
];

export function AchievementToast({ badge }) {
  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-xl border-4 border-amber-200 rounded-[34px] shadow-2xl px-6 py-4 flex items-center gap-4"
        >
          <motion.span
            animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-5xl"
          >
            {badge.icon}
          </motion.span>
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-amber-500">Neue Auszeichnung</p>
            <p className="font-hand text-3xl font-bold text-slate-800">{badge.name}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AdventureHud({ points = 0, streak = 0, activeSubject = "deutsch", onSubjectClick = () => {} }) {
  const levelSize = 80;
  const level = Math.floor(points / levelSize) + 1;
  const levelProgress = points % levelSize;
  const levelPercent = Math.min(100, (levelProgress / levelSize) * 100);
  const unlocked = BADGES.filter((badge) => points >= badge.points);
  const nextBadge = BADGES.find((badge) => points < badge.points);

  return (
    <section className="bg-white/55 backdrop-blur-xl rounded-[42px] border-4 border-white shadow-xl p-5 md:p-6 overflow-hidden relative">
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-40"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.75), rgba(255,255,255,0))", backgroundSize: "200% 100%" }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_1.3fr_1fr] gap-5 items-center">
        <div className="bg-white/70 rounded-[30px] border-2 border-white p-4 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">Abenteuer-Level</p>
              <p className="font-hand text-4xl font-bold text-slate-800">Level {level}</p>
            </div>
            <motion.div
              key={level}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-16 h-16 rounded-2xl bg-amber-100 border-4 border-white shadow-lg flex items-center justify-center text-4xl"
            >
              🏅
            </motion.div>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-white">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-300 via-rose-300 to-fuchsia-400 rounded-full"
              initial={false}
              animate={{ width: `${levelPercent}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          <p className="font-hand text-xl text-slate-500 mt-2">{levelSize - levelProgress} Sterne bis Level {level + 1}</p>
        </div>

        <div className="relative px-2 py-3">
          <div className="absolute left-6 right-6 top-1/2 h-2 bg-white/80 rounded-full shadow-inner" />
          <div className="relative grid grid-cols-5 gap-2">
            {SUBJECT_NODES.map((node, index) => {
              const active = activeSubject === node.id;
              const reached = points >= index * 60;
              return (
                <motion.button
                  key={node.id}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => onSubjectClick(node.id)}
                  className="relative flex flex-col items-center gap-2"
                >
                  <motion.div
                    animate={active ? { y: [0, -7, 0], rotate: [0, -5, 5, 0] } : { y: 0 }}
                    transition={active ? { duration: 2, repeat: Infinity } : undefined}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-3xl ${reached ? node.color : "bg-slate-100"} ${active ? "ring-4 ring-white scale-110" : ""}`}
                  >
                    {node.icon}
                  </motion.div>
                  <span className="font-hand text-lg md:text-xl font-bold text-slate-600 leading-none">{node.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="bg-white/70 rounded-[30px] border-2 border-white p-4 shadow-inner min-h-32">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">Auszeichnungen</p>
              <p className="font-hand text-3xl font-bold text-slate-800">{unlocked.length}/{BADGES.length}</p>
            </div>
            {streak >= 3 && <span className="font-hand text-2xl text-orange-500 font-bold">{streak}er Serie</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {BADGES.map((badge) => {
              const active = points >= badge.points;
              return (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.08 }}
                  className={`w-11 h-11 rounded-2xl border-2 border-white shadow-sm flex items-center justify-center text-2xl ${active ? "bg-amber-100" : "bg-slate-100 grayscale opacity-50"}`}
                  title={badge.name}
                >
                  {badge.icon}
                </motion.div>
              );
            })}
          </div>
          <p className="font-hand text-xl text-slate-500 mt-3">
            {nextBadge ? `Nächstes Ziel: ${nextBadge.name} bei ${nextBadge.points} Sternen` : "Alle Auszeichnungen freigespielt"}
          </p>
        </div>
      </div>
    </section>
  );
}
