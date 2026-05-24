import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const MESSAGES = {
  idle: ["Ich bin Lumi!", "Was lernst du heute?", "Du schaffst das!", "Neugierig sein ist super!", "Lass uns gemeinsam spielen!"],
  correct: ["Wunderbar!", "Spitze gemacht!", "Toll! Weiter so!", "Super! Du bist ein Profi!", "Das hast du ganz toll gelöst!", "Juhu! Geschafft!"],
  wrong: ["Fast! Versuch's nochmal", "Nicht schlimm! Fehler sind okay", "Du schaffst das! Probier nochmal", "Gleich hast du es!"],
  thinking: ["Hmm...", "Lass mich nachdenken...", "Gute Frage!", "Interessant...", "Ganz konzentriert..."],
  proud: ["Ich bin so stolz auf dich!", "Du hast ein großes Herz!", "Das war sehr mutig von dir!", "Du bist ein wahrer Freund!"],
  gentle: ["Atme tief ein...", "Du bist wertvoll.", "Hab Geduld mit dir selbst.", "Jeder Tag ist ein neues Abenteuer."],
};

const LUMI_COLORS = {
  primary: "#fde68a", // Soft Yellow
  accent: "#f59e0b",  // Warm Amber
  glow: "#fef3c7",   // Very light yellow
};

export const LumiSvg = ({ mood = "idle" }) => {
  // Ensure we have a valid mood string
  const activeMood = mood || "idle";
  
  const isHappy = activeMood === "correct" || activeMood === "proud";
  const isThinking = activeMood === "thinking";
  const isSad = activeMood === "wrong";
  const isGentle = activeMood === "gentle";
  const isProud = activeMood === "proud";

  // Path constants for stability
  const PATHS = {
    happy: "M40 10 C55 10 70 25 70 45 C70 65 55 75 40 75 C25 75 10 65 10 45 C10 25 25 10 40 10 Z",
    thinking: "M40 15 C52 15 65 22 65 42 C65 62 52 70 40 70 C28 70 15 62 15 42 C15 22 28 15 40 15 Z",
    gentle: "M40 14 C52 14 65 25 65 45 C65 65 52 72 40 72 C28 72 15 65 15 45 C15 25 28 14 40 14 Z",
    sad: "M40 12 C55 12 68 25 68 45 C68 65 55 72 40 72 C25 72 12 65 12 45 C12 25 25 12 40 12 Z",
    idle: "M40 12 C55 12 68 25 68 45 C68 65 55 72 40 72 C25 72 12 65 12 45 C12 25 25 12 40 12 Z"
  };

  const currentPath = isHappy || isProud 
    ? PATHS.happy 
    : isThinking 
      ? PATHS.thinking 
      : isGentle 
        ? PATHS.gentle 
        : isSad 
          ? PATHS.sad 
          : PATHS.idle;

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="drop-shadow-lg">
      <defs>
        <radialGradient id="lumiGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={LUMI_COLORS.glow} />
          <stop offset="100%" stopColor={LUMI_COLORS.primary} />
        </radialGradient>
        <filter id="softBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
        </filter>
      </defs>
      
      {/* Body - Soft Blob Shape */}
      <motion.path
        className="watercolor-effect"
        initial={{ d: PATHS.idle }}
        animate={{ d: currentPath }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        fill="url(#lumiGradient)"
        stroke={LUMI_COLORS.accent}
        strokeWidth="2"
      />

      {/* Eyes */}
      <g className="eyes rough-edge">
        {isProud ? (
          // Proud Eyes (Stars)
          <>
            <path d="M28 42 L31 38 L34 42 L29 39 L33 39 Z" fill={LUMI_COLORS.accent} />
            <path d="M46 42 L49 38 L52 42 L47 39 L51 39 Z" fill={LUMI_COLORS.accent} />
          </>
        ) : isHappy ? (
          // Happy Eyes (curved lines)
          <>
            <path d="M28 40 Q33 35 38 40" stroke={LUMI_COLORS.accent} strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M42 40 Q47 35 52 40" stroke={LUMI_COLORS.accent} strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : isThinking ? (
          // Thinking Eyes (dots looking up)
          <motion.g animate={{ scaleY: [1, 1, 1, 1, 0.1, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.8, 0.9, 0.95, 1] }}>
            <circle cx="33" cy="35" r="3" fill={LUMI_COLORS.accent} />
            <circle cx="47" cy="35" r="3" fill={LUMI_COLORS.accent} />
          </motion.g>
        ) : isSad ? (
          // Sad/Encouraging Eyes
          <>
            <path d="M28 45 Q33 48 38 45" stroke={LUMI_COLORS.accent} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M42 45 Q47 48 52 45" stroke={LUMI_COLORS.accent} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : isGentle ? (
          // Gentle Eyes (Half closed)
          <>
             <path d="M28 42 Q33 40 38 42" stroke={LUMI_COLORS.accent} strokeWidth="2" strokeLinecap="round" fill="none" />
             <path d="M42 42 Q47 40 52 42" stroke={LUMI_COLORS.accent} strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        ) : (
          // Idle Eyes
          <motion.g animate={{ scaleY: [1, 1, 1, 1, 0.1, 1] }} transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.2, 0.8, 0.9, 0.95, 1] }}>
            <circle cx="33" cy="42" r="3.5" fill={LUMI_COLORS.accent} />
            <circle cx="47" cy="42" r="3.5" fill={LUMI_COLORS.accent} />
          </motion.g>
        )}
      </g>

      {/* Mouth */}
      <g className="rough-edge">
        {isHappy || isProud ? (
          <path d="M35 55 Q40 60 45 55" stroke={LUMI_COLORS.accent} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : isThinking ? (
          <circle cx="40" cy="55" r="1.5" fill={LUMI_COLORS.accent} />
        ) : isGentle ? (
          <path d="M37 55 Q40 56 43 55" stroke={LUMI_COLORS.accent} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M36 55 Q40 57 44 55" stroke={LUMI_COLORS.accent} strokeWidth="2" strokeLinecap="round" fill="none" />
        )}
      </g>

      {/* Cheeks */}
      <circle cx="25" cy="48" r="4" fill="#fca5a5" opacity="0.4" filter="url(#softBlur)" />
      <circle cx="55" cy="48" r="4" fill="#fca5a5" opacity="0.4" filter="url(#softBlur)" />
    </svg>
  );
};

export default function Mascot({ mood = "idle", visible = true }) {
  const [msg, setMsg] = useState(MESSAGES.idle[0]);
  const [clickMood, setClickMood] = useState(null);

  const displayMood = clickMood || mood;

  useEffect(() => {
    const msgs = MESSAGES[displayMood] || MESSAGES.idle;
    setMsg(msgs[Math.floor(Math.random() * msgs.length)]);
  }, [displayMood]);

  const handleLumiClick = () => {
    setClickMood("correct");
    setTimeout(() => setClickMood(null), 3000); // Back to normal after 3s
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
        >
          {/* Speech bubble */}
          <motion.div
            key={msg}
            initial={{ scale: 0, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="bg-white/90 backdrop-blur-sm border-2 border-amber-200 rounded-[20px_20px_5px_20px] px-5 py-3 shadow-xl max-w-[190px] text-right watercolor-effect"
          >
            <p className="font-hand text-xl text-slate-700 leading-snug">{msg}</p>
          </motion.div>

          {/* Character Wrapper */}
          <motion.div
            onClick={handleLumiClick}
            animate={{
              y: [0, -10, 0],
              rotate: displayMood === "correct" ? [0, 5, -5, 0] : [0, 2, -2, 0],
            }}
            transition={{ 
              duration: displayMood === "correct" ? 0.6 : 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="cursor-pointer select-none relative wiggle"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Glow Aura / Splash */}
            <motion.div 
              className={`absolute inset-0 bg-yellow-200/40 blur-2xl rounded-full ${displayMood === 'correct' ? 'watercolor-effect scale-150' : ''}`}
              animate={{ 
                scale: displayMood === "correct" ? [1.2, 1.8, 1.5] : [1, 1.3, 1],
                opacity: displayMood === "correct" ? [0.6, 0.9, 0.6] : [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <LumiSvg mood={displayMood} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
