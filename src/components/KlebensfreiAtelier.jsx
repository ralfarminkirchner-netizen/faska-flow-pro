import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { KLEBENSFREI_SHOWCASE } from "../data/klebensfreiAssets";

const Motion = motion;

export default function KlebensfreiAtelier({ onOpenDeutsch = () => {} }) {
  return (
    <Motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22, duration: 0.36, ease: "easeOut" }}
      className="overflow-hidden rounded-[34px] border-2 border-white bg-white/58 p-4 shadow-lg backdrop-blur-sm"
    >
      <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center">
        <button
          type="button"
          onClick={onOpenDeutsch}
          className="flex min-h-24 items-center gap-4 rounded-[28px] bg-slate-900 px-5 py-4 text-left text-white shadow-xl transition hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/14">
            <Sparkles size={22} />
          </span>
          <span>
            <span className="block font-sans text-[10px] font-black uppercase tracking-[.22em] text-white/55">KLEBENSFREi</span>
            <span className="block font-hand text-4xl font-bold leading-none">Begleiter-Atelier</span>
          </span>
        </button>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {KLEBENSFREI_SHOWCASE.map((item, index) => (
            <Motion.button
              key={item.id}
              type="button"
              onClick={onOpenDeutsch}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + index * 0.04, duration: 0.28 }}
              className="group min-h-44 overflow-hidden rounded-[26px] border-2 border-white bg-white/76 p-3 text-center shadow-md transition hover:-translate-y-1 hover:bg-white active:scale-[0.98]"
            >
              <span className="relative mx-auto grid h-28 place-items-end">
                <span className="absolute bottom-2 h-7 w-20 rounded-full blur-lg" style={{ backgroundColor: `${item.color}44` }} />
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  className="relative max-h-28 max-w-full object-contain drop-shadow-md transition duration-300 group-hover:scale-105"
                />
              </span>
              <span className="mt-2 block font-hand text-3xl font-bold leading-none text-slate-800">{item.name}</span>
              <span className="mt-1 block font-sans text-[10px] font-black uppercase tracking-[.16em] text-slate-400">{item.gift}</span>
            </Motion.button>
          ))}
        </div>
      </div>
    </Motion.section>
  );
}
