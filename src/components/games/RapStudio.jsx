import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../../utils/sounds";

// Reim-Daten werden statisch aus public/rap/kid-rhymes.json geladen
// (erzeugt von scripts/generate_kid_rhymes.py via REIMWERKER-Engine,
//  Vokabular = Korpus -> kindersicher by design). Kein Backend zur Laufzeit.

const STARTER = ["Hund", "Katze", "Maus", "Baum", "Stern", "Sonne", "Ball", "Fisch", "Herz", "Tier", "Licht", "blau"];

const norm = (w) => (w || "").trim().toLowerCase().replace(/[.,!?;:]+$/u, "");
const lastWord = (line) => {
  const parts = (line || "").trim().split(/\s+/u).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "";
};

function speak(text) {
  try {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE";
    u.rate = 0.95;
    u.pitch = 1.08;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    /* Sprachausgabe optional */
  }
}

export default function RapStudio({ onCorrect = () => {}, onWrong = () => {} }) {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [typed, setTyped] = useState("");
  const [lookup, setLookup] = useState("");
  const [lines, setLines] = useState(["", "", "", ""]);
  const rewarded = useRef(new Set());

  useEffect(() => {
    let alive = true;
    fetch("/rap/kid-rhymes.json")
      .then((r) => r.json())
      .then((j) => alive && setData(j))
      .catch(() => alive && setLoadError(true));
    return () => {
      alive = false;
    };
  }, []);

  // Kleinschreib-Index: wort -> [reime]
  const index = useMemo(() => {
    const idx = {};
    if (data?.rhymes) {
      for (const [k, v] of Object.entries(data.rhymes)) idx[k.toLowerCase()] = v;
    }
    return idx;
  }, [data]);

  const getRhymes = (w) => index[norm(w)] || [];

  const doLookup = (w) => {
    const word = norm(w);
    if (!word) return;
    setLookup(word);
    if (getRhymes(word).length) {
      playPop();
      speak(word);
    } else {
      playError();
    }
  };

  // Reimt sich Zeile a mit Zeile b? (beidseitig im Lexikon prüfen)
  const couplet = (a, b) => {
    const wa = norm(lastWord(a));
    const wb = norm(lastWord(b));
    if (!wa || !wb || wa === wb) return false;
    return getRhymes(wa).map(norm).includes(wb) || getRhymes(wb).map(norm).includes(wa);
  };

  const pairs = useMemo(
    () => ({ "0-1": couplet(lines[0], lines[1]), "2-3": couplet(lines[2], lines[3]) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lines, index],
  );

  // Belohnung, wenn ein Paar NEU passt
  useEffect(() => {
    for (const key of ["0-1", "2-3"]) {
      if (pairs[key] && !rewarded.current.has(key)) {
        rewarded.current.add(key);
        playSparkle();
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
        onCorrect(5);
      } else if (!pairs[key]) {
        rewarded.current.delete(key);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairs]);

  const setLine = (i, val) => setLines((ls) => ls.map((l, j) => (j === i ? val : l)));

  // Reim ans Ende der ersten passenden Zeile setzen (die noch nicht reimt)
  const dropIntoRap = (word) => {
    setLines((ls) => {
      const targets = lookup
        ? // Zeile finden, deren letztes Wort = lookup, dann in die FOLGEzeile
          ls.map((l, i) => (norm(lastWord(l)) === norm(lookup) ? i + 1 : -1)).filter((i) => i >= 0 && i < ls.length)
        : [];
      const target = targets.length ? targets[0] : ls.findIndex((l) => !l.trim());
      if (target < 0 || target >= ls.length) return ls;
      const sep = ls[target].trim() ? " " : "";
      return ls.map((l, j) => (j === target ? `${l}${sep}${word}` : l));
    });
    playPop();
    speak(word);
  };

  const randomWord = () => {
    const keys = Object.keys(index);
    if (!keys.length) return;
    const w = keys[Math.floor(((Date.now() % keys.length) + keys.length * Math.random()) % keys.length)];
    setTyped(w);
    doLookup(w);
  };

  const rapText = lines.filter((l) => l.trim()).join(",\n");
  const currentRhymes = lookup ? getRhymes(lookup) : [];

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-6 py-6">
      <div className="text-center">
        <h2 className="font-hand text-5xl font-bold text-slate-800">🎤 Reim-Studio</h2>
        <p className="font-hand text-2xl text-slate-500">Finde Reime und bau deinen eigenen Rap!</p>
      </div>

      {loadError && (
        <p className="font-hand text-xl text-rose-500">Ups – die Reime laden gerade nicht. Lade die Seite neu. 🔄</p>
      )}

      {/* ── Reim-Finder ── */}
      <div className="w-full rounded-[34px] border-4 border-rose-200 bg-rose-50/70 p-5 shadow-inner">
        <h3 className="mb-3 font-hand text-3xl font-bold text-rose-500">1 · Reim-Finder</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            doLookup(typed);
          }}
          className="flex flex-wrap items-center gap-3"
        >
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Schreib ein Wort…"
            className="min-w-[180px] flex-1 rounded-2xl border-4 border-rose-200 bg-white px-4 py-3 font-hand text-3xl text-slate-700 outline-none focus:border-rose-400"
          />
          <button
            type="submit"
            className="rounded-2xl bg-rose-400 px-6 py-3 font-hand text-2xl font-bold text-white shadow-md transition hover:bg-rose-500 active:scale-95"
          >
            Reime finden
          </button>
          <button
            type="button"
            onClick={randomWord}
            className="rounded-2xl bg-amber-400 px-5 py-3 font-hand text-2xl font-bold text-white shadow-md transition hover:bg-amber-500 active:scale-95"
          >
            🎲 Würfeln
          </button>
        </form>

        {/* Starter-Wörter */}
        <div className="mt-3 flex flex-wrap gap-2">
          {STARTER.map((w) => (
            <button
              key={w}
              onClick={() => {
                setTyped(w);
                doLookup(w);
              }}
              className="rounded-full bg-white/80 px-4 py-1.5 font-hand text-xl font-bold text-rose-400 shadow-sm transition hover:bg-white active:scale-95"
            >
              {w}
            </button>
          ))}
        </div>

        {/* Ergebnis */}
        <AnimatePresence mode="wait">
          {lookup && (
            <motion.div
              key={lookup}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 rounded-2xl bg-white/70 p-4"
            >
              {currentRhymes.length ? (
                <>
                  <p className="font-hand text-2xl text-slate-600">
                    Reime auf <span className="font-bold text-rose-500">{lookup}</span>:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentRhymes.map((r, i) => (
                      <motion.button
                        key={r}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dropIntoRap(r)}
                        title="Antippen: vorlesen + in den Rap"
                        className="rounded-2xl border-2 border-rose-200 bg-rose-100 px-4 py-2 font-hand text-2xl font-bold text-rose-600 shadow-sm transition hover:bg-rose-200 active:scale-90"
                      >
                        {r}
                      </motion.button>
                    ))}
                  </div>
                  <p className="mt-2 font-sans text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tipp: Reim antippen → er wird vorgelesen und kommt in deinen Rap
                  </p>
                </>
              ) : (
                <p className="font-hand text-2xl text-slate-500">
                  Hmm, auf <span className="font-bold text-rose-500">{lookup}</span> kenne ich noch keinen Reim –
                  probier ein anderes Wort! 🙂
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mein Rap ── */}
      <div className="w-full rounded-[34px] border-4 border-violet-200 bg-violet-50/70 p-5 shadow-inner">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-hand text-3xl font-bold text-violet-500">2 · Mein Rap</h3>
          <div className="flex gap-2">
            <button
              onClick={() => rapText && speak(rapText)}
              className="rounded-2xl bg-violet-500 px-5 py-2.5 font-hand text-2xl font-bold text-white shadow-md transition hover:bg-violet-600 active:scale-95"
            >
              🎤 Vorlesen
            </button>
            <button
              onClick={() => {
                setLines(["", "", "", ""]);
                rewarded.current.clear();
                playPop();
              }}
              className="rounded-2xl bg-white/80 px-5 py-2.5 font-hand text-2xl font-bold text-slate-400 shadow-sm transition hover:bg-white active:scale-95"
            >
              🧹 Neu
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {lines.map((line, i) => {
            const pairKey = i < 2 ? "0-1" : "2-3";
            const isSecond = i === 1 || i === 3;
            const rhymes = pairs[pairKey];
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="w-7 shrink-0 text-center font-hand text-2xl font-bold text-violet-300">{i + 1}</span>
                <input
                  value={line}
                  onChange={(e) => setLine(i, e.target.value)}
                  placeholder={i === 0 ? "Ich hab einen Hund…" : "…und der ist bunt"}
                  className="flex-1 rounded-2xl border-4 border-violet-200 bg-white px-4 py-2.5 font-hand text-2xl text-slate-700 outline-none focus:border-violet-400"
                />
                {isSecond && (line || lines[i - 1]) && (
                  <span className={`shrink-0 font-hand text-2xl font-bold ${rhymes ? "text-emerald-500" : "text-slate-300"}`}>
                    {rhymes ? "✓ reimt sich!" : "💡 noch nicht"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-3 font-sans text-xs font-bold uppercase tracking-wider text-slate-400">
          Jede 2. Zeile soll sich mit der Zeile darüber reimen. Brauchst du Hilfe? Nutz den Reim-Finder oben! 🔝
        </p>
      </div>
    </div>
  );
}
