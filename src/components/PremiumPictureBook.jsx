import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getPremiumPictureBookScene } from "./PremiumPictureBookData";

const MotionFigure = motion.figure;
const MotionDiv = motion.div;

export default function PremiumPictureBook({
  scene = "abenteuer",
  title,
  subtitle,
  className = "",
  imageClassName = "",
  showTokens = true,
  children,
}) {
  const labelId = useId();
  const shouldReduceMotion = useReducedMotion();
  const cfg = getPremiumPictureBookScene(scene);
  const displayTitle = title || cfg.title;
  const displaySubtitle = subtitle || cfg.subtitle;

  return (
    <MotionFigure
      className={`relative isolate overflow-hidden rounded-[28px] border border-white/80 bg-[#fffaf0] shadow-[0_24px_70px_rgba(91,73,48,0.18)] ${className}`}
      aria-labelledby={labelId}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative aspect-[16/10] min-h-56 overflow-hidden">
        <img
          className={`h-full w-full object-cover ${imageClassName}`}
          src={cfg.image}
          alt={`${displaySubtitle}: ${displayTitle}`}
          loading="lazy"
          draggable="false"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fffaf0]/96 via-[#fffaf0]/56 to-transparent" />
      </div>

      <figcaption className="relative z-10 -mt-14 flex flex-wrap items-end justify-between gap-4 px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="min-w-0">
          <p className="font-sans text-[10px] font-black uppercase tracking-[0.24em]" style={{ color: cfg.accent }}>
            {displaySubtitle}
          </p>
          <h3 id={labelId} className="font-hand text-4xl font-black leading-none text-[#3e3c38] sm:text-5xl">
            {displayTitle}
          </h3>
        </div>

        {showTokens ? (
          <div className="flex max-w-full flex-wrap justify-end gap-2">
            {cfg.tokens.map((token, index) => (
              <MotionDiv
                key={token}
                className="grid h-10 min-w-10 place-items-center rounded-full border-2 border-white bg-white/82 px-3 text-sm font-black shadow-sm"
                style={{ color: cfg.ink }}
                animate={shouldReduceMotion ? { y: 0 } : { y: [0, -4, 0] }}
                transition={{ duration: 2.8 + index * 0.22, repeat: shouldReduceMotion ? 0 : 2, ease: "easeInOut" }}
              >
                {token}
              </MotionDiv>
            ))}
          </div>
        ) : null}
      </figcaption>

      {children ? <div className="relative z-10 px-5 pb-5 sm:px-6 sm:pb-6">{children}</div> : null}
    </MotionFigure>
  );
}
