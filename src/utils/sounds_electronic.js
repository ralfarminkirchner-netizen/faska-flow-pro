/* global voice, noiseBurst, createOutput, withSound */

// ==========================================
// ELECTRONIC & EDM DRUMS
// ==========================================

export const playKickEDM = ({ volume = 1, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  // Punchy, clicky kick
  voice({ freq: 280, type: "sine", attack: 0.001, hold: 0.02, release: 0.35, gain: 0.8, destination: out.input, bendTo: 45, bendTime: 0.1 });
  voice({ freq: 150, type: "triangle", attack: 0.001, hold: 0.01, release: 0.2, gain: 0.3, destination: out.input, bendTo: 30, bendTime: 0.08 });
  noiseBurst({ duration: 0.03, gain: 0.15, frequency: 4000, filterType: "highpass", output: out.input });
});

export const playKickDeep = ({ volume = 1, pan = 0, send = 0.05 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  // Massive sub kick
  voice({ freq: 120, type: "sine", attack: 0.01, hold: 0.05, release: 0.8, gain: 0.9, destination: out.input, bendTo: 35, bendTime: 0.25 });
  voice({ freq: 80, type: "triangle", attack: 0.01, hold: 0.05, release: 0.7, gain: 0.4, destination: out.input, bendTo: 35, bendTime: 0.2 });
});

export const playSnareClap = ({ volume = 0.85, pan = 0, send = 0.15 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  // Body of snare
  voice({ freq: 220, type: "triangle", attack: 0.002, hold: 0.04, release: 0.2, gain: 0.25, destination: out.input, bendTo: 160, bendTime: 0.1 });
  // Clap noise burst layered
  [0, 0.015, 0.03].forEach((startDelay, index) => {
    noiseBurst({ start: startDelay, duration: 0.15 + index * 0.03, attack: 0.002, release: 0.15, gain: 0.25 - index * 0.04, frequency: 2200 + index * 400, filterType: "bandpass", q: 1.5, output: out.input });
  });
  // High noise tail
  noiseBurst({ start: 0.01, duration: 0.25, attack: 0.005, release: 0.2, gain: 0.3, frequency: 3500, filterType: "highpass", output: out.input });
});

export const playHatEDM = ({ volume = 0.7, pan = 0, send = 0.08 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  // Metallic oscillators
  const ratios = [2.5, 3.8, 4.9, 6.1];
  ratios.forEach((ratio, index) => {
    voice({ freq: 300 * ratio, type: "square", start: index * 0.002, attack: 0.001, hold: 0.02, release: 0.08, gain: 0.03, destination: out.input, filter: { type: "highpass", frequency: 8000 } });
  });
  // Sharp noise
  noiseBurst({ duration: 0.06, attack: 0.001, release: 0.05, gain: 0.25, frequency: 10000, filterType: "highpass", output: out.input });
});

export const playCymbalReverse = ({ volume = 0.6, pan = 0, send = 0.3 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  // Reverse envelope simulated with a long attack and instant release
  const attackTime = 0.6;
  const ratios = [2.2, 3.5, 4.8, 5.9];
  ratios.forEach((ratio) => {
    voice({ freq: 150 * ratio, type: "square", start: 0, attack: attackTime, hold: 0.02, release: 0.05, gain: 0.04, destination: out.input, filter: { type: "highpass", frequency: 4000 } });
  });
  noiseBurst({ start: 0, duration: attackTime + 0.05, attack: attackTime, release: 0.05, gain: 0.2, frequency: 6000, filterType: "highpass", output: out.input });
});

export const playPercFM = ({ volume = 0.8, pan = 0, send = 0.1 } = {}) => withSound(() => {
  const out = createOutput({ volume, pan, send });
  if (!out) return;
  // A metallic FM-like percussion hit
  voice({ freq: 440, type: "sine", attack: 0.002, hold: 0.03, release: 0.15, gain: 0.4, destination: out.input, bendTo: 110, bendTime: 0.1 });
  voice({ freq: 880, type: "square", attack: 0.002, hold: 0.02, release: 0.1, gain: 0.15, destination: out.input, filter: { type: "bandpass", frequency: 1200, q: 3 } });
  voice({ freq: 1760, type: "triangle", attack: 0.005, hold: 0.05, release: 0.2, gain: 0.1, destination: out.input });
});


// ==========================================
// MELODIC SYNTHS
// ==========================================

// To avoid syntax errors in this isolated file, the melodic synths are wrapped in a dummy switch block.
// Copy and paste the case blocks below into the `switch (instrumentId)` block 
// of the `playInstrumentTone` function in your sounds.js file.

export const _melodicSynthCases = (freq, start, input) => {
  const instrumentId = "dummy";
  switch (instrumentId) {
    case "lead_saw":
      // Huge detuned supersaw lead
      voice({ freq, type: "sawtooth", start, attack: 0.015, hold: 0.2, release: 0.4, gain: 0.22, sustain: 0.18, detune: 0, destination: input, filter: { type: "lowpass", frequency: 4500, to: 1800, time: 0.25 } });
      voice({ freq, type: "sawtooth", start, attack: 0.02, hold: 0.2, release: 0.4, gain: 0.2, sustain: 0.16, detune: 14, destination: input, filter: { type: "lowpass", frequency: 4500, to: 1800, time: 0.25 } });
      voice({ freq, type: "sawtooth", start, attack: 0.02, hold: 0.2, release: 0.4, gain: 0.2, sustain: 0.16, detune: -14, destination: input, filter: { type: "lowpass", frequency: 4500, to: 1800, time: 0.25 } });
      voice({ freq: freq * 2, type: "square", start, attack: 0.01, hold: 0.15, release: 0.3, gain: 0.08, sustain: 0.06, destination: input });
      break;

    case "pad_warm":
      // Slow, evolving warm pad with detune
      voice({ freq, type: "sine", start, attack: 0.4, hold: 1.0, release: 1.5, gain: 0.28, sustain: 0.22, destination: input, filter: { type: "lowpass", frequency: 800, to: 1200, time: 1.0 } });
      voice({ freq: freq * 1.006, type: "triangle", start, attack: 0.5, hold: 0.9, release: 1.4, gain: 0.18, sustain: 0.14, detune: 8, destination: input });
      voice({ freq: freq * 0.994, type: "sawtooth", start, attack: 0.6, hold: 0.8, release: 1.3, gain: 0.12, sustain: 0.08, detune: -8, destination: input, filter: { type: "lowpass", frequency: 600, to: 1000, time: 0.8 } });
      break;

    case "arp_pluck":
      // Very short, snappy pluck for fast arpeggios
      voice({ freq, type: "square", start, attack: 0.005, hold: 0.05, release: 0.2, gain: 0.2, sustain: 0.04, destination: input, filter: { type: "lowpass", frequency: 3500, to: 400, time: 0.12 } });
      voice({ freq, type: "sawtooth", start, attack: 0.005, hold: 0.05, release: 0.15, gain: 0.18, sustain: 0.04, detune: 5, destination: input, filter: { type: "lowpass", frequency: 4000, to: 500, time: 0.1 } });
      noiseBurst({ start, duration: 0.02, gain: 0.04, frequency: 3000, filterType: "highpass", output: input });
      break;

    case "bass_fm":
      // Metallic FM-style bass
      voice({ freq: freq * 0.5, type: "sine", start, attack: 0.01, hold: 0.15, release: 0.4, gain: 0.4, sustain: 0.25, destination: input });
      voice({ freq: freq, type: "triangle", start, attack: 0.01, hold: 0.1, release: 0.3, gain: 0.25, sustain: 0.1, detune: 0, destination: input, bendTo: freq * 0.98, bendTime: 0.15 });
      voice({ freq: freq * 2, type: "square", start, attack: 0.01, hold: 0.05, release: 0.2, gain: 0.1, sustain: 0.04, destination: input, filter: { type: "bandpass", frequency: freq * 4, q: 2, to: freq * 2, time: 0.1 } });
      break;

    case "wobble_bass":
      // Aggressive dubstep wobble with multiple detuned saws and moving filter
      voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.02, hold: 0.3, release: 0.4, gain: 0.3, sustain: 0.2, detune: -9, destination: input, filter: { type: "lowpass", frequency: 200, to: 2200, time: 0.15 } });
      voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.02, hold: 0.3, release: 0.4, gain: 0.3, sustain: 0.2, detune: 9, destination: input, filter: { type: "lowpass", frequency: 200, to: 2200, time: 0.15 } });
      voice({ freq: freq * 0.25, type: "square", start, attack: 0.02, hold: 0.3, release: 0.4, gain: 0.25, sustain: 0.2, destination: input, filter: { type: "lowpass", frequency: 1000, to: 300, time: 0.25 } });
      break;
  }
};
