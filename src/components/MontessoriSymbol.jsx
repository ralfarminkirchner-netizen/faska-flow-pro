import { motion } from "framer-motion";

const symbols = {
  nomen: (size) => (
    <motion.polygon
      points="20,4 36,36 4,36"
      fill="#27272a"
      stroke="#18181b"
      strokeWidth={2}
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  ),
  verb: (size) => (
    <motion.circle
      cx="20"
      cy="20"
      r="16"
      fill="#ef4444"
      stroke="#dc2626"
      strokeWidth={2}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
    />
  ),
  adjektiv: (size) => (
    <motion.polygon
      points="20,4 36,36 4,36"
      fill="#3b82f6"
      stroke="#2563eb"
      strokeWidth={2}
      strokeLinejoin="round"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.5 }}
    />
  ),
  artikel: (size) => (
    <motion.polygon
      points="20,10 30,34 10,34"
      fill="#93c5fd"
      stroke="#60a5fa"
      strokeWidth={2}
      strokeLinejoin="round"
      initial={{ rotate: -180, scale: 0 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    />
  ),
  pronomen: (size) => (
    <motion.polygon
      points="20,4 34,36 6,36"
      fill="#a855f7"
      stroke="#9333ea"
      strokeWidth={2}
      strokeLinejoin="round"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring" }}
    />
  ),
  adverb: (size) => (
    <motion.circle
      cx="20"
      cy="20"
      r="12"
      fill="#f97316"
      stroke="#ea580c"
      strokeWidth={2}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", delay: 0.1 }}
    />
  ),
  praeposition: (size) => (
    <motion.path
      d="M8,30 Q20,2 32,30"
      fill="none"
      stroke="#22c55e"
      strokeWidth="6"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
  ),
  konjunktion: (size) => (
    <motion.rect
      x="8"
      y="14"
      width="24"
      height="12"
      rx="6"
      fill="#ec4899"
      stroke="#db2777"
      strokeWidth={2}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ type: "spring", bounce: 0.4 }}
    />
  ),
  interjektion: (size) => (
    <motion.path
      d="M20,6 C28,6 30,12 30,18 C30,24 24,28 24,32 L20,36 L16,32 C16,28 10,24 10,18 C10,12 12,6 20,6Z"
      fill="#eab308"
      stroke="#ca8a04"
      strokeWidth={2}
      strokeLinejoin="round"
      initial={{ scale: 0, rotate: 45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring" }}
    />
  ),
  numerale: (size) => (
    <g>
      <motion.circle
        cx="20"
        cy="20"
        r="16"
        fill="none"
        stroke="#22c55e"
        strokeWidth="3"
        strokeDasharray="4 4"
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.text
        x="20"
        y="25"
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
        fill="#22c55e"
        className="font-hand"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        1
      </motion.text>
    </g>
  ),
};

const names = {
  nomen: "Nomen",
  verb: "Verb",
  adjektiv: "Adjektiv",
  artikel: "Artikel",
  pronomen: "Pronomen",
  adverb: "Adverb",
  praeposition: "Präposition",
  konjunktion: "Konjunktion",
  interjektion: "Interjektion",
  numerale: "Numerale",
};

export default function MontessoriSymbol({ type, size = 40, label = false, layoutId }) {
  return (
    <motion.div
      layoutId={layoutId}
      className="flex flex-col items-center justify-center gap-1.5"
      whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0] }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        className="overflow-visible filter drop-shadow-sm"
      >
        {symbols[type] ? symbols[type](size) : null}
      </motion.svg>
      {label && (
        <span className="text-[11px] font-bold text-slate-500 font-sans tracking-wide">
          {names[type]}
        </span>
      )}
    </motion.div>
  );
}
