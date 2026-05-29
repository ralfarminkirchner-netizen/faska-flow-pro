const fs = require('fs');

const soundsFile = './src/utils/sounds.js';
let soundsCode = fs.readFileSync(soundsFile, 'utf8');

// 1. Extract Acoustic Drums
const acousticCode = fs.readFileSync('./src/utils/sounds_acoustic.js', 'utf8');
const acousticDrums = acousticCode.split('export const getMelodicSynthCases')[0].replace(/import .*;/g, '').trim();

// 2. Extract Electronic Drums
const electronicCode = fs.readFileSync('./src/utils/sounds_electronic.js', 'utf8');
const electronicDrums = electronicCode.split('export const _melodicSynthCases')[0].replace(/\/\* global .* \*\//g, '').trim();

// 3. Append drums to sounds.js
soundsCode += '\n\n// --- Acoustic Drums ---\n' + acousticDrums;
soundsCode += '\n\n// --- Electronic Drums ---\n' + electronicDrums;

// 4. Inject Melodic Synths into switch
const acousticSynths = `
    case "strings_orchestral":
      voice({ freq, type: "sawtooth", start, attack: 0.25, hold: 0.5, release: 0.8, gain: 0.15, sustain: 0.12, detune: -6, destination: input, filter: { type: "lowpass", frequency: 1500, to: 2500, time: 0.4 } });
      voice({ freq: freq * 1.005, type: "sawtooth", start, attack: 0.3, hold: 0.45, release: 0.85, gain: 0.15, sustain: 0.12, detune: 5, destination: input, filter: { type: "lowpass", frequency: 1600, to: 2400, time: 0.4 } });
      voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.2, hold: 0.5, release: 0.9, gain: 0.08, sustain: 0.06, detune: -2, destination: input, filter: { type: "lowpass", frequency: 800 } });
      break;
    case "flute_wooden": {
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
    }
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
`;
const electronicSynths = `
    case "lead_saw":
      voice({ freq, type: "sawtooth", start, attack: 0.015, hold: 0.2, release: 0.4, gain: 0.22, sustain: 0.18, detune: 0, destination: input, filter: { type: "lowpass", frequency: 4500, to: 1800, time: 0.25 } });
      voice({ freq, type: "sawtooth", start, attack: 0.02, hold: 0.2, release: 0.4, gain: 0.2, sustain: 0.16, detune: 14, destination: input, filter: { type: "lowpass", frequency: 4500, to: 1800, time: 0.25 } });
      voice({ freq, type: "sawtooth", start, attack: 0.02, hold: 0.2, release: 0.4, gain: 0.2, sustain: 0.16, detune: -14, destination: input, filter: { type: "lowpass", frequency: 4500, to: 1800, time: 0.25 } });
      voice({ freq: freq * 2, type: "square", start, attack: 0.01, hold: 0.15, release: 0.3, gain: 0.08, sustain: 0.06, destination: input });
      break;
    case "pad_warm":
      voice({ freq, type: "sine", start, attack: 0.4, hold: 1.0, release: 1.5, gain: 0.28, sustain: 0.22, destination: input, filter: { type: "lowpass", frequency: 800, to: 1200, time: 1.0 } });
      voice({ freq: freq * 1.006, type: "triangle", start, attack: 0.5, hold: 0.9, release: 1.4, gain: 0.18, sustain: 0.14, detune: 8, destination: input });
      voice({ freq: freq * 0.994, type: "sawtooth", start, attack: 0.6, hold: 0.8, release: 1.3, gain: 0.12, sustain: 0.08, detune: -8, destination: input, filter: { type: "lowpass", frequency: 600, to: 1000, time: 0.8 } });
      break;
    case "arp_pluck":
      voice({ freq, type: "square", start, attack: 0.005, hold: 0.05, release: 0.2, gain: 0.2, sustain: 0.04, destination: input, filter: { type: "lowpass", frequency: 3500, to: 400, time: 0.12 } });
      voice({ freq, type: "sawtooth", start, attack: 0.005, hold: 0.05, release: 0.15, gain: 0.18, sustain: 0.04, detune: 5, destination: input, filter: { type: "lowpass", frequency: 4000, to: 500, time: 0.1 } });
      noiseBurst({ start, duration: 0.02, gain: 0.04, frequency: 3000, filterType: "highpass", output: input });
      break;
    case "bass_fm":
      voice({ freq: freq * 0.5, type: "sine", start, attack: 0.01, hold: 0.15, release: 0.4, gain: 0.4, sustain: 0.25, destination: input });
      voice({ freq: freq, type: "triangle", start, attack: 0.01, hold: 0.1, release: 0.3, gain: 0.25, sustain: 0.1, detune: 0, destination: input, bendTo: freq * 0.98, bendTime: 0.15 });
      voice({ freq: freq * 2, type: "square", start, attack: 0.01, hold: 0.05, release: 0.2, gain: 0.1, sustain: 0.04, destination: input, filter: { type: "bandpass", frequency: freq * 4, q: 2, to: freq * 2, time: 0.1 } });
      break;
    case "wobble_bass":
      voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.02, hold: 0.3, release: 0.4, gain: 0.3, sustain: 0.2, detune: -9, destination: input, filter: { type: "lowpass", frequency: 200, to: 2200, time: 0.15 } });
      voice({ freq: freq * 0.5, type: "sawtooth", start, attack: 0.02, hold: 0.3, release: 0.4, gain: 0.3, sustain: 0.2, detune: 9, destination: input, filter: { type: "lowpass", frequency: 200, to: 2200, time: 0.15 } });
      voice({ freq: freq * 0.25, type: "square", start, attack: 0.02, hold: 0.3, release: 0.4, gain: 0.25, sustain: 0.2, destination: input, filter: { type: "lowpass", frequency: 1000, to: 300, time: 0.25 } });
      break;
`;

soundsCode = soundsCode.replace('case "piano":', acousticSynths + electronicSynths + '\n    case "piano":');

fs.writeFileSync(soundsFile, soundsCode);
console.log('Merged successfully.');
