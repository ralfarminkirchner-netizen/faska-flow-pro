import { lazy, Suspense, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScoreBoard from "./components/ScoreBoard";
import Mascot from "./components/Mascot";
import LumiChat from "./components/LumiChat";
import { playJingle, playPop } from "./utils/sounds";
import { loadProgress, saveProgress } from "./utils/storage";
import DailyJourney from "./components/DailyJourney";
import AdventureHud, { AchievementToast, BADGES } from "./components/AdventureHud";
import GameEngineHub from "./components/games/GameEngineHub";

const Motion = motion;

const DeutschModule = lazy(() => import("./modules/DeutschModule"));
const MatheModule = lazy(() => import("./modules/MatheModule"));
const SachunterrichtModule = lazy(() => import("./modules/SachunterrichtModule"));
const EthikModule = lazy(() => import("./modules/EthikModule"));
const MusikModule = lazy(() => import("./modules/MusikModule"));

const FAECHER = [
  {
    id: "deutsch",
    name: "Sprache",
    subtitle: "Wörter & Geschichten",
    img: "/illustrations/optimized/deutsch-240.jpg",
    gradient: "from-amber-50 via-orange-50 to-yellow-50",
    accent: "amber",
    border: "border-amber-300",
    ring: "ring-amber-300",
    dot: "bg-amber-400",
  },
  {
    id: "mathe",
    name: "Zahlen",
    subtitle: "Zählen & Rechnen",
    img: "/illustrations/optimized/mathe-240.jpg",
    gradient: "from-sky-50 via-blue-50 to-indigo-50",
    accent: "blue",
    border: "border-blue-300",
    ring: "ring-blue-300",
    dot: "bg-blue-400",
  },
  {
    id: "sachunterricht",
    name: "Welt",
    subtitle: "Natur & Tiere",
    img: "/illustrations/optimized/sach-240.jpg",
    gradient: "from-emerald-50 via-green-50 to-teal-50",
    accent: "emerald",
    border: "border-emerald-300",
    ring: "ring-emerald-300",
    dot: "bg-emerald-400",
  },
  {
    id: "ethik",
    name: "Miteinander",
    subtitle: "Gefühle & Freundschaft",
    img: "/illustrations/optimized/ethik-240.jpg",
    gradient: "from-purple-50 via-fuchsia-50 to-pink-50",
    accent: "purple",
    border: "border-purple-300",
    ring: "ring-purple-300",
    dot: "bg-purple-400",
  },
  {
    id: "musik",
    name: "Klang",
    subtitle: "Töne & Instrumente",
    img: "/illustrations/optimized/musik-240.jpg",
    gradient: "from-rose-50 via-pink-50 to-red-50",
    accent: "rose",
    border: "border-rose-300",
    ring: "ring-rose-300",
    dot: "bg-rose-400",
  },
];

const navVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
};
const navItem = {
  hidden: { y: 40, opacity: 0, scale: 0.8 },
  show: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.5 } },
};

function ModuleFallback({ fach }) {
  return (
    <div className={`min-h-[360px] rounded-3xl bg-white/65 backdrop-blur-sm border ${fach.border} shadow-sm flex flex-col items-center justify-center gap-4 px-6 py-12 text-center`}>
      <motion.img
        src={fach.img}
        alt=""
        className="w-20 h-20 rounded-3xl object-cover shadow-md"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      />
      <div>
        <p className="font-hand text-3xl font-bold text-slate-800">{fach.name} wird vorbereitet</p>
        <p className="font-sans text-sm text-slate-500 mt-1">Gleich geht es weiter.</p>
      </div>
    </div>
  );
}

export default function App() {
  const initialProgress = loadProgress() || {};
  const [activeSubject, setActiveSubject] = useState("deutsch");
  const [globalPoints, setGlobalPoints] = useState(initialProgress.points || 0);
  const [streak, setStreak] = useState(initialProgress.streak || 0);
  const [floatingStars, setFloatingStars] = useState([]);
  const [mascotMood, setMascotMood] = useState("idle");
  const [unlockedBadge, setUnlockedBadge] = useState(null);
  const [showGameHub, setShowGameHub] = useState(false);
  const badgeTimeoutRef = useRef(null);

  // Sync with storage on changes
  useEffect(() => {
    saveProgress({ points: globalPoints, streak });
  }, [globalPoints, streak]);

  const activeFach = FAECHER.find(f => f.id === activeSubject);

  const handleCorrect = (pts = 1) => {
    setGlobalPoints(p => {
      const nextPoints = p + pts;
      const badge = BADGES.find((item) => p < item.points && nextPoints >= item.points);
      if (badge) {
        setUnlockedBadge(badge);
        playJingle("badge");
        if (badgeTimeoutRef.current) clearTimeout(badgeTimeoutRef.current);
        badgeTimeoutRef.current = setTimeout(() => setUnlockedBadge(null), 3200);
      }
      return nextPoints;
    });
    setStreak(s => s + 1);
    setMascotMood("correct");
    setTimeout(() => setMascotMood("idle"), 3000);
    const id = Date.now();
    setFloatingStars(prev => [...prev, id]);
    setTimeout(() => setFloatingStars(prev => prev.filter(s => s !== id)), 1200);
  };
  const handleWrong = () => {
    setStreak(0);
    setMascotMood("wrong");
    setTimeout(() => setMascotMood("idle"), 3000);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${activeFach.gradient} transition-colors duration-700 flex justify-center overflow-x-hidden relative paper-texture`}>

      {/* Mascot Integration */}
      <Mascot mood={mascotMood} />
      
      {/* Interactive Chat Companion */}
      <LumiChat setMood={setMascotMood} />

      <div
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 12% 12%, rgba(255,255,255,.62), transparent 28%), radial-gradient(circle at 90% 18%, rgba(255,255,255,.46), transparent 24%), radial-gradient(circle at 50% 94%, rgba(255,255,255,.38), transparent 30%)",
        }}
      />

      <AchievementToast badge={unlockedBadge} />

      {/* Retro Arcade Hub Overlay */}
      <AnimatePresence>
        {showGameHub && (
          <GameEngineHub onExit={() => setShowGameHub(false)} />
        )}
      </AnimatePresence>

      {/* Floating star feedback */}
      <AnimatePresence>
        {floatingStars.map(id => (
          <motion.div key={id} className="fixed z-50 pointer-events-none text-3xl font-bold text-amber-400"
            style={{ bottom: "4rem", right: "2rem" }}
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{ y: -160, opacity: 0, scale: 2 }}
            transition={{ duration: 1.1, ease: "easeOut" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Score HUD */}
      <ScoreBoard points={globalPoints} streak={streak} />

      <div className="w-full max-w-6xl px-4 md:px-8 py-8 relative z-10 flex flex-col gap-8">

        {/* ── HERO HEADER ── */}
        <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
          className="flex flex-col lg:flex-row items-center gap-8 pt-4"
        >
          {/* Hero Header Left */}
          <div className="flex flex-col md:flex-row items-center gap-8 pt-4 flex-1">
            {/* Illustration */}
            <motion.div
              className="w-56 h-56 md:w-72 md:h-72 flex-shrink-0 relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <div className="absolute inset-0 rounded-full bg-white/50 blur-2xl scale-110" />
              <img
                src="/illustrations/optimized/hero-640.jpg"
                alt="Kinder lernen gemeinsam"
                className="relative w-full h-full object-cover rounded-[60%_40%_55%_45%/45%_55%_40%_60%] shadow-2xl"
                decoding="async"
                fetchPriority="high"
              />
            </motion.div>

            <div className="text-center md:text-left">
              <motion.h1
                className="font-hand text-6xl md:text-7xl font-bold leading-tight"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #db2777, #d97706)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                FASKA flow!
              </motion.h1>
              {/* Decorative plants row */}
              <motion.div className="flex gap-4 mt-5 justify-center md:justify-start"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                {[
                  <svg key="leaf1" width="28" height="32" viewBox="0 0 28 32" fill="none"><path d="M14 30C14 30 2 22 2 12C2 5.373 7.373 0 14 0C20.627 0 26 5.373 26 12C26 22 14 30 14 30Z" fill="#86efac"/><line x1="14" y1="28" x2="14" y2="10" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/><path d="M14 20 Q10 16 6 17" stroke="#16a34a" strokeWidth="1" fill="none" strokeLinecap="round"/><path d="M14 15 Q18 12 22 14" stroke="#16a34a" strokeWidth="1" fill="none" strokeLinecap="round"/></svg>,
                  <svg key="flower1" width="28" height="32" viewBox="0 0 28 32" fill="none"><circle cx="14" cy="12" r="4" fill="#fde68a"/>{[0,60,120,180,240,300].map((a,i) => (<ellipse key={i} cx={14 + 7*Math.sin(a*Math.PI/180)} cy={12 - 7*Math.cos(a*Math.PI/180)} rx="3.5" ry="2" transform={`rotate(${a},${14 + 7*Math.sin(a*Math.PI/180)},${12 - 7*Math.cos(a*Math.PI/180)})`} fill="#f9a8d4"/>))}<line x1="14" y1="16" x2="14" y2="30" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/></svg>,
                  <svg key="tree" width="28" height="32" viewBox="0 0 28 32" fill="none"><ellipse cx="14" cy="13" rx="10" ry="8" fill="#86efac"/><ellipse cx="9" cy="16" rx="7" ry="6" fill="#4ade80"/><ellipse cx="19" cy="16" rx="7" ry="6" fill="#4ade80"/><rect x="12" y="22" width="4" height="9" rx="2" fill="#92400e"/></svg>,
                  <svg key="leaf2" width="24" height="28" viewBox="0 0 24 28" fill="none"><path d="M12 26C12 26 1 18 3 9C5 2 12 0 18 4C22 7 23 14 20 20C17 26 12 26 12 26Z" fill="#6ee7b7"/><line x1="12" y1="24" x2="12" y2="6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/></svg>,
                ]}
              </motion.div>
            </div>
          </div>

          {/* Daily Journey Card & Arcade Button */}
          <div className="w-full md:w-auto flex flex-col gap-4">
            <DailyJourney onTaskClick={(subj) => { playPop(); setActiveSubject(subj); }} />
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { playPop(); setShowGameHub(true); }}
              className="w-full bg-slate-900 text-white rounded-3xl p-4 flex items-center justify-between shadow-xl border-2 border-slate-700 hover:border-slate-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🕹️</span>
                <div className="text-left">
                  <p className="font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-pink-500 uppercase text-sm">Pro Level</p>
                  <p className="font-bold text-lg leading-none mt-1">Retro Arcade</p>
                </div>
              </div>
              <span className="text-slate-400 text-2xl">➔</span>
            </motion.button>
          </div>
        </motion.header>

        {/* ── SUBJECT NAVIGATION ── */}
        <motion.nav variants={navVariants} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {FAECHER.map((fach) => {
            const isActive = activeSubject === fach.id;
            return (
              <motion.button
                key={fach.id}
                variants={navItem}
                whileHover={{ y: -8, scale: 1.04, transition: { type: "spring", stiffness: 500 } }}
                whileTap={{ scale: 0.93 }}
                onClick={() => { playPop(); setActiveSubject(fach.id); }}
                className={`relative group flex flex-col items-center gap-3 p-4 rounded-3xl border-2 bg-white/70 backdrop-blur-md transition-all duration-300 overflow-hidden
                  ${isActive ? `${fach.border} shadow-xl ring-4 ${fach.ring} ring-offset-2` : "border-white/60 shadow-md hover:shadow-lg hover:bg-white/90"}`}
              >
                {/* Glow bg */}
                {isActive && (
                  <motion.div layoutId="navGlow"
                    className={`absolute inset-0 bg-gradient-to-br ${fach.gradient} opacity-80`}
                    transition={{ type: "spring", stiffness: 200, damping: 30 }}
                  />
                )}
                <div className="relative z-10 w-16 h-16 overflow-hidden rounded-2xl shadow-md">
                  <motion.img
                    src={fach.img}
                    alt={fach.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div className="relative z-10 text-center">
                  <p className="font-hand font-bold text-xl text-slate-800 leading-tight">{fach.name}</p>
                  <p className="font-sans text-xs text-slate-500 leading-snug mt-0.5">{fach.subtitle}</p>
                </div>
                {isActive && (
                  <motion.div layoutId="navDot"
                    className={`absolute bottom-2 w-2 h-2 rounded-full ${fach.dot}`}
                    transition={{ type: "spring" }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.nav>

        <AdventureHud
          points={globalPoints}
          streak={streak}
          activeSubject={activeSubject}
          onSubjectClick={(subject) => { playPop(); setActiveSubject(subject); }}
        />

        {/* ── ACTIVE SUBJECT HERO STRIP ── */}
        <AnimatePresence mode="wait">
          <motion.div key={activeSubject + "-strip"}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-5 px-6 py-4 rounded-3xl bg-white/60 backdrop-blur-sm border ${activeFach.border} shadow-sm`}
          >
            <motion.img
              src={activeFach.img}
              alt=""
              className="w-14 h-14 rounded-2xl object-cover shadow-md flex-shrink-0"
              loading="lazy"
              decoding="async"
            />
            <div>
              <p className="font-hand text-3xl font-bold text-slate-800">{activeFach.name} · <span className="font-normal text-slate-500">{activeFach.subtitle}</span></p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── MODULE CONTENT ── */}
        <main className="pb-24">
          <AnimatePresence mode="wait">
            <motion.div key={activeSubject}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <Suspense fallback={<ModuleFallback fach={activeFach} />}>
                {activeSubject === "deutsch"        && <DeutschModule onCorrect={handleCorrect} onWrong={handleWrong} />}
                {activeSubject === "mathe"          && <MatheModule onCorrect={handleCorrect} onWrong={handleWrong} />}
                {activeSubject === "sachunterricht" && <SachunterrichtModule onCorrect={handleCorrect} onWrong={handleWrong} />}
                {activeSubject === "ethik"          && <EthikModule onCorrect={handleCorrect} onWrong={handleWrong} />}
                {activeSubject === "musik"          && <MusikModule onCorrect={handleCorrect} onWrong={handleWrong} />}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}
