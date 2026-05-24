import { motion, AnimatePresence } from "framer-motion";

// SVG star icon – no emoji
const StarIcon = ({ size = 20, filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "none"} stroke="#f59e0b" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

// SVG flame icon – no emoji
const FlameIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2C12 2 9 7 9 11C9 12.5 9.7 13.8 11 14.5C10.5 13 11 12 12 11.5C12.5 13 14 14 14 16C15.5 15 16 13 16 11C16 8 14 5 14 5C14 5 16 8 16 11C16 13 15 15 13.5 16C14.5 14.5 14 13 13 12C13 12 15 9.5 15 7C15 4.5 12 2 12 2Z" fill="#f97316"/>
    <path d="M9 16C9 18.8 10.3 21 12 21C13.7 21 15 18.8 15 16C15 14.5 14.3 13 13 12C13 13.5 12 14.5 11 15C11.5 13.5 11 12.5 10 12C9.4 13 9 14.5 9 16Z" fill="#dc2626"/>
  </svg>
);

export default function ScoreBoard({ points = 0, streak = 0 }) {
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring" }}
      className="fixed top-4 right-4 z-40 flex gap-2 items-center"
    >
      <AnimatePresence>
        {streak >= 2 && (
          <motion.div
            key={streak}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", bounce: 0.6 }}
            className="flex items-center gap-1.5 bg-orange-50 border-2 border-orange-200 rounded-2xl px-4 py-2 shadow-lg"
          >
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
              <FlameIcon size={18} />
            </motion.div>
            <span className="font-hand font-bold text-orange-600 text-xl">{streak}x</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-amber-200 rounded-2xl px-4 py-2 shadow-lg"
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          key={points}
          initial={{ rotate: 180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", bounce: 0.7 }}
        >
          <StarIcon size={20} />
        </motion.div>
        <span className="font-hand font-bold text-amber-700 text-xl">{points}</span>
      </motion.div>
    </motion.div>
  );
}
