import { voice, noiseBurst, createOutput, withSound } from './sounds.js';

export const playKickAcoustic = ({ volume = 1, pan = 0, send = 0.05 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  voice({ freq: 110, type: "sine", attack: 0.002, hold: 0.03, release: 0.35, gain: 0.6, destination: out.input, bendTo: 45, bendTime: 0.1 });
  voice({ freq: 140, type: "triangle", attack: 0.002, hold: 0.02, release: 0.15, gain: 0.2, destination: out.input, bendTo: 60, bendTime: 0.05 });
  noiseBurst({ duration: 0.02, attack: 0.001, release: 0.015, gain: 0.1, frequency: 3000, filterType: "bandpass", q: 1, output: out.input });
});

export const playSnareAcoustic = ({ volume = 0.9, pan = 0, send = 0.08 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  voice({ freq: 190, type: "sine", attack: 0.002, hold: 0.04, release: 0.15, gain: 0.3, destination: out.input, bendTo: 160, bendTime: 0.05 });
  voice({ freq: 320, type: "triangle", attack: 0.002, hold: 0.02, release: 0.25, gain: 0.1, destination: out.input });
  noiseBurst({ duration: 0.25, attack: 0.005, release: 0.2, gain: 0.35, frequency: 2400, filterType: "bandpass", q: 0.8, output: out.input });
});

export const playTomLowAcoustic = ({ volume = 0.85, pan = -0.2, send = 0.08 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  voice({ freq: 90, type: "sine", attack: 0.005, hold: 0.08, release: 0.45, gain: 0.5, destination: out.input, bendTo: 60, bendTime: 0.15 });
  voice({ freq: 140, type: "triangle", attack: 0.003, hold: 0.04, release: 0.2, gain: 0.15, destination: out.input, bendTo: 80, bendTime: 0.1 });
  noiseBurst({ duration: 0.05, gain: 0.05, frequency: 1500, filterType: "bandpass", q: 1, output: out.input });
});

export const playTomHighAcoustic = ({ volume = 0.85, pan = 0.2, send = 0.08 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  voice({ freq: 150, type: "sine", attack: 0.004, hold: 0.06, release: 0.35, gain: 0.45, destination: out.input, bendTo: 100, bendTime: 0.1 });
  voice({ freq: 220, type: "triangle", attack: 0.003, hold: 0.03, release: 0.15, gain: 0.15, destination: out.input, bendTo: 130, bendTime: 0.08 });
  noiseBurst({ duration: 0.04, gain: 0.05, frequency: 2000, filterType: "bandpass", q: 1, output: out.input });
});

export const playCrashAcoustic = ({ volume = 0.6, pan = 0.3, send = 0.25 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  const ratios = [1.8, 2.4, 3.1, 4.0, 5.2, 6.5, 7.8, 9.1];
  ratios.forEach((ratio, index) => {
    voice({ freq: 130 * ratio, type: "square", start: index * 0.001, attack: 0.005, hold: 0.1, release: 1.2 + (index * 0.1), gain: 0.015, destination: out.input, filter: { type: "highpass", frequency: 4000 } });
  });
  noiseBurst({ duration: 1.5, attack: 0.005, release: 1.2, gain: 0.2, frequency: 8000, filterType: "highpass", output: out.input });
  noiseBurst({ duration: 1.0, attack: 0.01, release: 0.8, gain: 0.1, frequency: 4000, filterType: "bandpass", q: 0.5, output: out.input });
});

export const playRideAcoustic = ({ volume = 0.65, pan = -0.3, send = 0.15 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  const ratios = [2.2, 3.5, 4.8, 6.1, 7.5];
  ratios.forEach((ratio) => {
    voice({ freq: 280 * ratio, type: "square", start: 0, attack: 0.002, hold: 0.05, release: 1.5, gain: 0.01, destination: out.input, filter: { type: "highpass", frequency: 5000 } });
  });
  
  voice({ freq: 3200, type: "sine", attack: 0.001, hold: 0.01, release: 0.3, gain: 0.05, destination: out.input });
  noiseBurst({ duration: 1.5, attack: 0.005, release: 1.2, gain: 0.08, frequency: 7000, filterType: "highpass", output: out.input });
});

export const playHiHatClosedAcoustic = ({ volume = 0.7, pan = 0.1, send = 0.05 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  const ratios = [2.5, 3.8, 4.9, 6.2];
  ratios.forEach((ratio) => {
    voice({ freq: 150 * ratio, type: "square", start: 0, attack: 0.001, hold: 0.01, release: 0.06, gain: 0.02, destination: out.input, filter: { type: "highpass", frequency: 6000 } });
  });
  noiseBurst({ duration: 0.06, attack: 0.001, release: 0.05, gain: 0.15, frequency: 9500, filterType: "highpass", output: out.input });
});

export const playHiHatOpenAcoustic = ({ volume = 0.7, pan = 0.1, send = 0.08 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  
  const ratios = [2.5, 3.8, 4.9, 6.2, 7.5];
  ratios.forEach((ratio) => {
    voice({ freq: 150 * ratio, type: "square", start: 0, attack: 0.005, hold: 0.1, release: 0.35, gain: 0.015, destination: out.input, filter: { type: "highpass", frequency: 5000 } });
  });
  noiseBurst({ duration: 0.45, attack: 0.005, release: 0.35, gain: 0.18, frequency: 8000, filterType: "highpass", output: out.input });
});

// ============================================================================
// Melodic Synths (cases for playInstrumentTone)
// Dump these directly into the switch(instrumentId) statement in sounds.js
// ============================================================================

export const getMelodicSynthCases = (instrumentId, freq, start, input, ctx, now) => {
  switch (instrumentId) {
    case "strings_orchestral":
      voice({ freq, type: "sawtooth", start, attack: 0.25, hold: 0.5, release: 0.8, gain: 0.15, sustain: 0.12, detune: -6, destination: input, filter: { type: "lowpass", frequency: 1500, to: 2500, time: 0.4 } });
      voice({ freq: freq * 1.005, type: "sawtooth", start, attack: 0.3, hold: 0.45, release: 0.85, gain: 0.15, sustain: 0.12, detune: 5, destination: input, filter: { type: "lowpass", frequency: 1600, to: 2400, time: 0.4 } });
      voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.2, hold: 0.5, release: 0.9, gain: 0.08, sustain: 0.06, detune: -2, destination: input, filter: { type: "lowpass", frequency: 800 } });
      break;

    case "flute_wooden":
      noiseBurst({ start, duration: 0.6, attack: 0.1, release: 0.3, gain: 0.03, frequency: 3000, filterType: "bandpass", q: 2, output: input });
      const fluteOsc = voice({ freq, type: "sine", start, attack: 0.15, hold: 0.4, release: 0.35, gain: 0.35, sustain: 0.25, destination: input });
      voice({ freq: freq * 2, type: "sine", start, attack: 0.15, hold: 0.35, release: 0.3, gain: 0.05, sustain: 0.03, destination: input });
      if (fluteOsc && ctx) {
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        vibrato.frequency.setValueAtTime(5.5, now);
        vibratoGain.gain.setValueAtTime(4, now);
        vibrato.connect(vibratoGain);
        vibratoGain.connect(fluteOsc.frequency);
        vibrato.start(now + 0.2); 
        vibrato.stop(now + 1.2);
      }
      break;

    case "piano_grand":
      voice({ freq, type: "triangle", start, attack: 0.005, hold: 0.15, release: 1.5, gain: 0.35, sustain: 0.15, destination: input, filter: { type: "lowpass", frequency: 2500 } });
      voice({ freq: freq * 1.002, type: "triangle", start, attack: 0.005, hold: 0.15, release: 1.4, gain: 0.25, sustain: 0.1, detune: 3, destination: input });
      voice({ freq: freq * 2, type: "sine", start, attack: 0.005, hold: 0.1, release: 0.8, gain: 0.1, sustain: 0.05, destination: input });
      voice({ freq: freq * 3.01, type: "sine", start, attack: 0.005, hold: 0.05, release: 0.5, gain: 0.05, sustain: 0.02, destination: input });
      noiseBurst({ start, duration: 0.03, gain: 0.02, frequency: 500, filterType: "lowpass", output: input });
      break;

    case "upright_bass":
      voice({ freq: freq * 0.5, type: "triangle", start, attack: 0.01, hold: 0.2, release: 0.8, gain: 0.45, sustain: 0.15, destination: input, filter: { type: "lowpass", frequency: 800, to: 300, time: 0.4 } });
      voice({ freq: freq * 0.5, type: "sine", start, attack: 0.015, hold: 0.25, release: 1.0, gain: 0.55, sustain: 0.2, destination: input, bendTo: freq * 0.495, bendTime: 0.5 }); 
      voice({ freq, type: "sine", start, attack: 0.005, hold: 0.1, release: 0.4, gain: 0.1, sustain: 0.05, destination: input });
      noiseBurst({ start, duration: 0.04, attack: 0.002, release: 0.03, gain: 0.04, frequency: 1200, filterType: "bandpass", q: 1, output: input });
      break;
  }
};
