import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playPop, playSparkle, playError } from "../../utils/sounds";

// Reim-Daten: statisch aus public/rap/kid-rhymes.json (sauber/strict) bzw.
// kid-rhymes-pro.json (Profi/balanced, mehr + Slang). Erzeugt von
// scripts/generate_kid_rhymes.py via REIMWERKER-Engine. Kein Backend zur Laufzeit.

const STARTER = ["Hund", "Katze", "Maus", "Baum", "Stern", "Sonne", "Ball", "Fisch", "Herz", "Tier", "Nacht", "blau"];
const DRAFT_KEY = "faska-rap-draft";
const SAVED_KEY = "faska-rap-saved";
const BPMS = [{ label: "🐢", bpm: 70 }, { label: "🚶", bpm: 90 }, { label: "🐇", bpm: 112 }];

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
    /* optional */
  }
}

function readStore(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "null");
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* z.B. privater Modus */
  }
}

export default function RapStudio({ onCorrect = () => {}, onWrong = () => {} }) {
  const [pro, setPro] = useState(false);
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [typed, setTyped] = useState("");
  const [lookup, setLookup] = useState("");
  const [lines, setLines] = useState(() => {
    const d = readStore(DRAFT_KEY, null);
    return Array.isArray(d) && d.length >= 2 ? d : ["", "", "", ""];
  });
  const [saved, setSaved] = useState(() => readStore(SAVED_KEY, []));
  const [shared, setShared] = useState(false);
  const [beat, setBeat] = useState(0); // 0 = aus, sonst BPM
  const rewarded = useRef(new Set());
  const dataCache = useRef({});

  // ── Reim-Daten laden (je nach Modus) ──
  useEffect(() => {
    const file = pro ? "/rap/kid-rhymes-pro.json" : "/rap/kid-rhymes.json";
    if (dataCache.current[file]) {
      setData(dataCache.current[file]);
      return;
    }
    let alive = true;
    fetch(file)
      .then((r) => r.json())
      .then((j) => {
        if (alive) {
          dataCache.current[file] = j;
          setData(j);
        }
      })
      .catch(() => alive && setLoadError(true));
    return () => {
      alive = false;
    };
  }, [pro]);

  const index = useMemo(() => {
    const idx = {};
    if (data?.rhymes) for (const [k, v] of Object.entries(data.rhymes)) idx[k.toLowerCase()] = v;
    return idx;
  }, [data]);
  const getRhymes = (w) => index[norm(w)] || [];

  // ── Entwurf automatisch sichern ──
  useEffect(() => writeStore(DRAFT_KEY, lines), [lines]);

  const couplet = (a, b) => {
    const wa = norm(lastWord(a));
    const wb = norm(lastWord(b));
    if (!wa || !wb || wa === wb) return false;
    return getRhymes(wa).map(norm).includes(wb) || getRhymes(wb).map(norm).includes(wa);
  };

  const pairKeys = useMemo(() => Array.from({ length: Math.floor(lines.length / 2) }, (_, i) => i * 2), [lines.length]);
  const pairs = useMemo(() => {
    const res = {};
    for (const i of pairKeys) res[i] = couplet(lines[i], lines[i + 1]);
    return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, index]);

  useEffect(() => {
    for (const i of pairKeys) {
      if (pairs[i] && !rewarded.current.has(i)) {
        rewarded.current.add(i);
        playSparkle();
        confetti({ particleCount: 55, spread: 70, origin: { y: 0.7 } });
        onCorrect(5);
      } else if (!pairs[i]) {
        rewarded.current.delete(i);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairs]);

  const setLine = (i, val) => setLines((ls) => ls.map((l, j) => (j === i ? val : l)));

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

  const dropIntoRap = (word) => {
    setLines((ls) => {
      let target = ls.map((l, i) => (norm(lastWord(l)) === norm(lookup) ? i + 1 : -1)).find((i) => i >= 0 && i < ls.length);
      if (target == null) target = ls.findIndex((l) => !l.trim());
      if (target == null || target < 0 || target >= ls.length) return ls;
      const sep = ls[target].trim() ? " " : "";
      return ls.map((l, j) => (j === target ? `${l}${sep}${word}` : l));
    });
    playPop();
    speak(word);
  };

  const randomWord = () => {
    const keys = Object.keys(index);
    if (!keys.length) return;
    const w = keys[Math.floor(Math.random() * keys.length)];
    setTyped(w);
    doLookup(w);
  };

  const rapText = lines.filter((l) => l.trim()).join("\n");

  const saveRap = () => {
    if (!rapText.trim()) return;
    const entry = { id: String(Date.now()), lines: [...lines] };
    const next = [entry, ...saved].slice(0, 12);
    setSaved(next);
    writeStore(SAVED_KEY, next);
    playSparkle();
  };
  const loadRap = (entry) => {
    setLines(entry.lines?.length ? entry.lines : ["", "", "", ""]);
    rewarded.current.clear();
    playPop();
  };
  const delRap = (id) => {
    const next = saved.filter((e) => e.id !== id);
    setSaved(next);
    writeStore(SAVED_KEY, next);
  };

  const shareRap = async () => {
    if (!rapText.trim()) return;
    const text = `🎤 Mein Rap:\n${rapText}`;
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        setShared(true);
        setTimeout(() => setShared(false), 1500);
      }
      playPop();
    } catch {
      /* abgebrochen */
    }
  };

  const addCouplet = () => lines.length < 8 && setLines((ls) => [...ls, "", ""]);

  // ── Beat-Engine (Web Audio, ohne Assets) ──
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const stepRef = useRef(0);
  const noiseRef = useRef(null);

  const getCtx = () => {
    if (!audioRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioRef.current = new AC();
    }
    return audioRef.current;
  };
  const getNoise = (ctx) => {
    if (!noiseRef.current) {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      noiseRef.current = buf;
    }
    return noiseRef.current;
  };
  const kick = (ctx, t) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(165, t);
    o.frequency.exponentialRampToValueAtTime(48, t + 0.13);
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.22);
  };
  const hat = (ctx, t) => {
    const s = ctx.createBufferSource();
    s.buffer = getNoise(ctx);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.28, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    s.connect(hp).connect(g).connect(ctx.destination);
    s.start(t);
    s.stop(t + 0.06);
  };
  const snare = (ctx, t) => {
    const s = ctx.createBufferSource();
    s.buffer = getNoise(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = "highpass";
    bp.frequency.value = 1800;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    s.connect(bp).connect(g).connect(ctx.destination);
    s.start(t);
    s.stop(t + 0.16);
  };

  const stopBeat = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    stepRef.current = 0;
  };
  const startBeat = (bpm) => {
    stopBeat();
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();
    const stepMs = 60000 / bpm / 2; // Achtelschritte
    timerRef.current = setInterval(() => {
      const t = ctx.currentTime + 0.03;
      const s = stepRef.current % 8;
      if (s === 0 || s === 3 || s === 4) kick(ctx, t); // Boom-bap-Kick
      if (s === 2 || s === 6) snare(ctx, t);
      hat(ctx, t);
      stepRef.current++;
    }, stepMs);
  };
  const toggleBeat = (bpm) => {
    if (beat === bpm) {
      setBeat(0);
      stopBeat();
    } else {
      setBeat(bpm);
      startBeat(bpm);
    }
  };
  useEffect(() => () => {
    stopBeat();
    try {
      audioRef.current?.close();
    } catch {
      /* egal */
    }
  }, []);

  const currentRhymes = lookup ? getRhymes(lookup) : [];

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-5 py-6">
      <div className="text-center">
        <h2 className="font-hand text-5xl font-bold text-slate-800">🎤 Reim-Studio</h2>
        <p className="font-hand text-2xl text-slate-500">Finde Reime, leg einen Beat auf und bau deinen Rap!</p>
      </div>

      {/* ── Leiste: Profi + Beat ── */}
      <div className="flex w-full flex-wrap items-center justify-center gap-3 rounded-3xl bg-slate-100 p-3">
        <button
          onClick={() => {
            setPro((p) => !p);
            playPop();
          }}
          className={`rounded-2xl px-5 py-2.5 font-hand text-2xl font-bold shadow-md transition active:scale-95 ${
            pro ? "bg-orange-500 text-white" : "bg-white text-slate-400"
          }`}
        >
          {pro ? "🔥 Profi an" : "🔥 Profi aus"}
        </button>
        <span className="font-hand text-2xl text-slate-400">|</span>
        <span className="font-hand text-2xl font-bold text-slate-500">🥁 Beat:</span>
        {BPMS.map((b) => (
          <button
            key={b.bpm}
            onClick={() => toggleBeat(b.bpm)}
            className={`rounded-2xl px-4 py-2.5 font-hand text-2xl font-bold shadow-md transition active:scale-95 ${
              beat === b.bpm ? "bg-violet-600 text-white" : "bg-white text-slate-400"
            }`}
          >
            {b.label}
          </button>
        ))}
        {beat > 0 && (
          <button onClick={() => toggleBeat(beat)} className="rounded-2xl bg-rose-400 px-4 py-2.5 font-hand text-2xl font-bold text-white shadow-md active:scale-95">
            ⏹ Stop
          </button>
        )}
      </div>

      {loadError && <p className="font-hand text-xl text-rose-500">Ups – die Reime laden gerade nicht. Lade die Seite neu. 🔄</p>}

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
            className="min-w-[160px] flex-1 rounded-2xl border-4 border-rose-200 bg-white px-4 py-3 font-hand text-3xl text-slate-700 outline-none focus:border-rose-400"
          />
          <button type="submit" className="rounded-2xl bg-rose-400 px-6 py-3 font-hand text-2xl font-bold text-white shadow-md transition hover:bg-rose-500 active:scale-95">
            Reime finden
          </button>
          <button type="button" onClick={randomWord} className="rounded-2xl bg-amber-400 px-5 py-3 font-hand text-2xl font-bold text-white shadow-md transition hover:bg-amber-500 active:scale-95">
            🎲
          </button>
        </form>

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

        <AnimatePresence mode="wait">
          {lookup && (
            <motion.div key={lookup + String(pro)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-4 rounded-2xl bg-white/70 p-4">
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
                        transition={{ delay: i * 0.04 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dropIntoRap(r)}
                        title="Antippen: vorlesen + in den Rap"
                        className="rounded-2xl border-2 border-rose-200 bg-rose-100 px-4 py-2 font-hand text-2xl font-bold text-rose-600 shadow-sm transition hover:bg-rose-200 active:scale-90"
                      >
                        {r}
                      </motion.button>
                    ))}
                  </div>
                  <p className="mt-2 font-sans text-xs font-bold uppercase tracking-wider text-slate-400">Tipp: Reim antippen → vorgelesen + kommt in deinen Rap</p>
                </>
              ) : (
                <p className="font-hand text-2xl text-slate-500">
                  Hmm, auf <span className="font-bold text-rose-500">{lookup}</span> kenne ich noch keinen Reim – probier ein anderes Wort
                  {pro ? "" : " (oder schalt 🔥 Profi an)"}! 🙂
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mein Rap ── */}
      <div className="w-full rounded-[34px] border-4 border-violet-200 bg-violet-50/70 p-5 shadow-inner">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-hand text-3xl font-bold text-violet-500">2 · Mein Rap</h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => rapText && speak(rapText)} className="rounded-2xl bg-violet-500 px-4 py-2.5 font-hand text-2xl font-bold text-white shadow-md transition hover:bg-violet-600 active:scale-95">
              🎤 Vorlesen
            </button>
            <button onClick={saveRap} className="rounded-2xl bg-emerald-500 px-4 py-2.5 font-hand text-2xl font-bold text-white shadow-md transition hover:bg-emerald-600 active:scale-95">
              💾 Merken
            </button>
            <button onClick={shareRap} className="rounded-2xl bg-sky-500 px-4 py-2.5 font-hand text-2xl font-bold text-white shadow-md transition hover:bg-sky-600 active:scale-95">
              {shared ? "✓ kopiert" : "📤 Teilen"}
            </button>
            <button
              onClick={() => {
                setLines(lines.map(() => ""));
                rewarded.current.clear();
                playPop();
              }}
              className="rounded-2xl bg-white/80 px-4 py-2.5 font-hand text-2xl font-bold text-slate-400 shadow-sm transition hover:bg-white active:scale-95"
            >
              🧹 Neu
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {lines.map((line, i) => {
            const isSecond = i % 2 === 1;
            const rhymes = pairs[i - 1];
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="w-7 shrink-0 text-center font-hand text-2xl font-bold text-violet-300">{i + 1}</span>
                <input
                  value={line}
                  onChange={(e) => setLine(i, e.target.value)}
                  placeholder={i === 0 ? "Ich hab einen Hund…" : i === 1 ? "…und der ist bunt" : "schreib weiter…"}
                  className="flex-1 rounded-2xl border-4 border-violet-200 bg-white px-4 py-2.5 font-hand text-2xl text-slate-700 outline-none focus:border-violet-400"
                />
                {isSecond && (line || lines[i - 1]) && (
                  <span className={`shrink-0 font-hand text-2xl font-bold ${rhymes ? "text-emerald-500" : "text-slate-300"}`}>{rhymes ? "✓ reimt!" : "💡"}</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400">Jede 2. Zeile reimt sich mit der Zeile darüber.</p>
          {lines.length < 8 && (
            <button onClick={addCouplet} className="rounded-xl bg-violet-200 px-3 py-1.5 font-hand text-xl font-bold text-violet-600 transition hover:bg-violet-300 active:scale-95">
              + 2 Zeilen
            </button>
          )}
        </div>
      </div>

      {/* ── Gemerkte Raps ── */}
      {saved.length > 0 && (
        <div className="w-full rounded-[34px] border-4 border-amber-200 bg-amber-50/70 p-5 shadow-inner">
          <h3 className="mb-3 font-hand text-3xl font-bold text-amber-500">⭐ Meine Raps</h3>
          <div className="flex flex-col gap-2">
            {saved.map((entry) => (
              <div key={entry.id} className="flex items-center gap-2 rounded-2xl bg-white/80 p-2">
                <button onClick={() => loadRap(entry)} className="flex-1 truncate text-left font-hand text-xl text-slate-600 hover:text-slate-900">
                  {entry.lines.filter((l) => l.trim()).join(" / ") || "(leer)"}
                </button>
                <button onClick={() => speak(entry.lines.filter((l) => l.trim()).join("\n"))} className="rounded-lg px-2 py-1 text-xl active:scale-90" title="Vorlesen">
                  🔊
                </button>
                <button onClick={() => delRap(entry.id)} className="rounded-lg px-2 py-1 text-xl text-slate-300 hover:text-rose-400 active:scale-90" title="Löschen">
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
