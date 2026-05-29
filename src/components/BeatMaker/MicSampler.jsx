import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playPop, getAudioContext, playMicSample, generateWaveform, timeStretchBuffer } from "../../utils/sounds";

export default function MicSampler({ onSamplesUpdate, bpm = 120 }) {
  const [samples, setSamples] = useState([]);
  const [status, setStatus] = useState("idle"); 
  const [errorMsg, setErrorMsg] = useState("");
  const [editingSample, setEditingSample] = useState(null); // The sample currently being edited
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Sync with parent
  useEffect(() => {
    onSamplesUpdate(samples);
  }, [samples, onSamplesUpdate]);

  const startRecording = async () => {
    try {
      playPop();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = processAudio;
      mediaRecorderRef.current.start();
      setStatus("recording");
    } catch (err) {
      setStatus("error");
      setErrorMsg("Bitte Mikrofon-Zugriff erlauben!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && status === "recording") {
      playPop();
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setStatus("processing");
    }
  };

  const processAudio = async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioCtx = getAudioContext();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      
      const newSample = {
        id: `mic_${Date.now()}`,
        name: `Sample ${samples.length + 1}`,
        buffer: audioBuffer,
        originalDuration: audioBuffer.duration,
        trimStart: 0,
        trimEnd: audioBuffer.duration,
        waveform: generateWaveform(audioBuffer, 50),
        color: ["bg-teal-500", "bg-rose-500", "bg-amber-500", "bg-purple-500"][samples.length % 4],
        shadow: ["shadow-teal-500/50", "shadow-rose-500/50", "shadow-amber-500/50", "shadow-purple-500/50"][samples.length % 4]
      };

      setSamples(prev => [...prev, newSample]);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg("Fehler beim Verarbeiten.");
    }
  };

  const deleteSample = (id) => {
    playPop();
    setSamples(prev => prev.filter(s => s.id !== id));
  };

  const copySample = (sample) => {
    playPop();
    const copy = { ...sample, id: `mic_${Date.now()}`, name: `${sample.name} (Kopie)` };
    setSamples(prev => [...prev, copy]);
  };

  const playPreview = (sample) => {
    playMicSample(sample.buffer, sample.trimStart, sample.trimEnd - sample.trimStart);
  };

  const saveEdit = (updatedSample) => {
    playPop();
    setSamples(prev => prev.map(s => s.id === updatedSample.id ? updatedSample : s));
    setEditingSample(null);
  };

  const autoSyncSample = async (sample) => {
    setStatus("processing");
    try {
      const buffer = sample.buffer;
      const data = buffer.getChannelData(0);
      const threshold = 0.015;
      
      let startIdx = 0;
      for (let i = 0; i < data.length; i++) {
        if (Math.abs(data[i]) > threshold) {
          startIdx = i;
          break;
        }
      }
      
      let endIdx = data.length - 1;
      for (let i = data.length - 1; i >= 0; i--) {
        if (Math.abs(data[i]) > threshold) {
          endIdx = i;
          break;
        }
      }
      
      const trimStart = Math.max(0, (startIdx / buffer.sampleRate) - 0.05); // 50ms pre-roll
      const trimEnd = Math.min(buffer.duration, (endIdx / buffer.sampleRate) + 0.05);
      const duration = trimEnd - trimStart;
      
      // Calculate target duration based on DAW BPM
      const beatSecs = 60 / bpm;
      const possibleTargets = [beatSecs, beatSecs * 2, beatSecs * 4, beatSecs * 8];
      let targetDuration = possibleTargets[0];
      let minDiff = Math.abs(duration - targetDuration);
      for (let i = 1; i < possibleTargets.length; i++) {
        const diff = Math.abs(duration - possibleTargets[i]);
        if (diff < minDiff) {
          minDiff = diff;
          targetDuration = possibleTargets[i];
        }
      }
      
      const audioCtx = getAudioContext();
      const trimmedLen = Math.floor(duration * audioCtx.sampleRate);
      const trimmedBuffer = audioCtx.createBuffer(buffer.numberOfChannels, trimmedLen, audioCtx.sampleRate);
      for(let c=0; c<buffer.numberOfChannels; c++) {
        const inData = buffer.getChannelData(c);
        const outData = trimmedBuffer.getChannelData(c);
        const offset = Math.floor(trimStart * audioCtx.sampleRate);
        for(let i=0; i<trimmedLen; i++) {
           if (offset + i < inData.length) {
             outData[i] = inData[offset + i];
           }
        }
      }
      
      const stretchedBuffer = await timeStretchBuffer(audioCtx, trimmedBuffer, targetDuration);
      
      setEditingSample(prev => ({
        ...prev,
        buffer: stretchedBuffer,
        originalDuration: stretchedBuffer.duration,
        trimStart: 0,
        trimEnd: stretchedBuffer.duration,
        waveform: generateWaveform(stretchedBuffer, 50)
      }));
      setStatus("idle");
      playPop();
    } catch(err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("Time-Stretch Error");
    }
  };

  return (
    <div className="flex gap-4 items-stretch h-full">
      {/* Record Box */}
      <div className="bg-slate-800/80 p-4 rounded-3xl border border-slate-700 shadow-xl flex flex-col items-center justify-center gap-3 w-40">
        <h3 className="font-hand text-xl font-bold tracking-wider uppercase text-center w-full min-h-[1.5rem] mb-1">
           {status === "idle" && <span className="text-white">Studio</span>}
           {status === "recording" && <span className="text-red-400 animate-pulse">Aufnahme...</span>}
           {status === "processing" && <span className="text-amber-400">Lädt...</span>}
           {status === "error" && <span className="text-red-500 text-xs">{errorMsg}</span>}
        </h3>

        {status !== "recording" ? (
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startRecording} className="w-16 h-16 bg-red-500 rounded-full border-4 border-slate-700 shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center justify-center transition-colors hover:bg-red-400">
            <div className="w-5 h-5 bg-white rounded-full"></div>
          </motion.button>
        ) : (
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={stopRecording} className="w-16 h-16 bg-slate-700 rounded-lg border-4 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center justify-center animate-pulse">
            <div className="w-5 h-5 bg-red-500 rounded-sm"></div>
          </motion.button>
        )}
      </div>

      {/* Library Box */}
      {samples.length > 0 && (
        <div className="flex flex-col gap-2 max-h-32 overflow-y-auto w-64 pr-2">
          <AnimatePresence>
            {samples.map(sample => (
              <motion.div key={sample.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center justify-between bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-inner">
                 <div className="flex items-center gap-2 overflow-hidden cursor-pointer" onClick={() => playPreview(sample)}>
                    <div className={`w-3 h-3 rounded-full ${sample.color} shrink-0`} />
                    <span className="font-sans text-xs font-bold text-slate-300 truncate">{sample.name}</span>
                 </div>
                 <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button onClick={() => playPreview(sample)} className="text-emerald-400 hover:text-emerald-300 text-xs p-1">▶</button>
                    <button onClick={() => setEditingSample(sample)} className="text-sky-400 hover:text-sky-300 text-xs p-1">✂️</button>
                    <button onClick={() => copySample(sample)} className="text-amber-400 hover:text-amber-300 text-xs p-1">📄</button>
                    <button onClick={() => deleteSample(sample.id)} className="text-red-400 hover:text-red-300 text-xs p-1">✖</button>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Sample Editor Modal */}
      {editingSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-800 rounded-3xl p-8 border-4 border-slate-700 shadow-2xl w-full max-w-2xl relative">
             <h2 className="font-hand text-4xl font-bold text-white mb-6">Sample Editor: {editingSample.name}</h2>
             
             {/* Waveform Visualization */}
             <div className="w-full h-32 bg-slate-900 rounded-xl border-2 border-slate-700 p-4 relative flex items-center justify-between gap-[2px]">
               {editingSample.waveform.map((val, i) => {
                 const pct = i / 50;
                 const isActive = pct >= (editingSample.trimStart / editingSample.originalDuration) && 
                                  pct <= (editingSample.trimEnd / editingSample.originalDuration);
                 return (
                   <div key={i} className="flex-1 rounded-sm transition-all" style={{ height: `${Math.max(5, val * 100)}%`, backgroundColor: isActive ? '#38bdf8' : '#334155' }} />
                 );
               })}
             </div>

             <div className="mt-8 flex flex-col gap-6">
                <div>
                  <label className="text-slate-400 font-sans text-xs font-bold uppercase tracking-widest mb-2 block">
                    Start ({(editingSample.trimStart).toFixed(2)}s)
                  </label>
                  <input type="range" min="0" max={editingSample.trimEnd - 0.05} step="0.01" value={editingSample.trimStart} 
                    onChange={e => setEditingSample(prev => ({...prev, trimStart: parseFloat(e.target.value)}))}
                    className="w-full accent-emerald-500" />
                </div>
                <div>
                  <label className="text-slate-400 font-sans text-xs font-bold uppercase tracking-widest mb-2 block">
                    Ende ({(editingSample.trimEnd).toFixed(2)}s)
                  </label>
                  <input type="range" min={editingSample.trimStart + 0.05} max={editingSample.originalDuration} step="0.01" value={editingSample.trimEnd} 
                    onChange={e => setEditingSample(prev => ({...prev, trimEnd: parseFloat(e.target.value)}))}
                    className="w-full accent-rose-500" />
                </div>
             </div>

             <div className="flex justify-between items-center mt-8">
               <button onClick={() => autoSyncSample(editingSample)} className="px-4 py-3 bg-fuchsia-600/20 text-fuchsia-300 rounded-xl font-bold border border-fuchsia-500/50 hover:bg-fuchsia-500/30 transition-colors flex items-center gap-2">🪄 Auto-Sync & Stretch</button>
               <div className="flex gap-4">
                 <button onClick={() => playPreview(editingSample)} className="px-6 py-3 bg-slate-700 text-white rounded-xl font-bold shadow-md hover:bg-slate-600 transition-colors">▶ Vorschau</button>
                 <button onClick={() => setEditingSample(null)} className="px-6 py-3 bg-transparent text-slate-400 rounded-xl font-bold hover:text-white transition-colors">Abbrechen</button>
                 <button onClick={() => saveEdit(editingSample)} className="px-8 py-3 bg-sky-500 text-white rounded-xl font-bold shadow-lg hover:bg-sky-400 shadow-sky-500/40 transition-colors">Speichern</button>
               </div>
             </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
