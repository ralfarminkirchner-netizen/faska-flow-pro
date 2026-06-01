import { EffectComposer, Bloom, Vignette, ChromaticAberration, ToneMapping, SSAO, Noise } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import { Vector2 } from 'three';

/**
 * PostProcessingStack — Genre-specific post-processing presets.
 * 
 * Presets:
 *   action    — Heavy Bloom, Vignette, ChromaticAberration (Doom, Brawler, Fighter)
 *   adventure — Soft Bloom, ToneMapping, subtle Vignette (Zelda, RPG, Mansion)
 *   arcade    — Bright Bloom, optional scanlines (Snake, Blocks, Invaders)
 *   racing    — Bloom on boost, subtle motion hint (Kart, Rally, MicroMachines)
 *   space     — Deep Bloom, God Rays feel, nebula (Odyssey, Descent)
 *   flagship  — Everything maxed (Faska64 PC exclusive)
 *
 * Props:
 *   preset         — One of the above presets (default: 'arcade')
 *   damageFlash    — 0-1, triggers ChromaticAberration on damage
 *   boostActive    — Boolean, intensifies bloom for racing
 *   bloomIntensity — Override bloom intensity
 */
export default function PostProcessingStack({ 
  preset = 'arcade', 
  damageFlash = 0,
  boostActive = false,
  bloomIntensity: bloomOverride,
}) {
  const presets = {
    action: {
      bloom: 1.5,
      bloomThreshold: 0.6,
      bloomRadius: 0.8,
      vignette: 0.45,
      vignetteOffset: 0.3,
      chromatic: damageFlash > 0 ? 0.008 * damageFlash : 0,
      ssao: true,
      noise: 0.03,
      toneMapping: ToneMappingMode.ACES_FILMIC,
    },
    adventure: {
      bloom: 0.6,
      bloomThreshold: 0.8,
      bloomRadius: 0.6,
      vignette: 0.25,
      vignetteOffset: 0.4,
      chromatic: 0,
      ssao: false,
      noise: 0,
      toneMapping: ToneMappingMode.ACES_FILMIC,
    },
    arcade: {
      bloom: 1.2,
      bloomThreshold: 0.5,
      bloomRadius: 0.7,
      vignette: 0.2,
      vignetteOffset: 0.5,
      chromatic: 0,
      ssao: false,
      noise: 0,
      toneMapping: ToneMappingMode.ACES_FILMIC,
    },
    racing: {
      bloom: boostActive ? 2.0 : 0.8,
      bloomThreshold: boostActive ? 0.3 : 0.7,
      bloomRadius: 0.8,
      vignette: boostActive ? 0.5 : 0.2,
      vignetteOffset: 0.3,
      chromatic: boostActive ? 0.003 : 0,
      ssao: false,
      noise: 0,
      toneMapping: ToneMappingMode.ACES_FILMIC,
    },
    space: {
      bloom: 2.0,
      bloomThreshold: 0.3,
      bloomRadius: 1.0,
      vignette: 0.35,
      vignetteOffset: 0.25,
      chromatic: 0.001,
      ssao: false,
      noise: 0.015,
      toneMapping: ToneMappingMode.ACES_FILMIC,
    },
    flagship: {
      bloom: 1.8,
      bloomThreshold: 0.5,
      bloomRadius: 0.9,
      vignette: 0.3,
      vignetteOffset: 0.35,
      chromatic: damageFlash > 0 ? 0.006 * damageFlash : 0,
      ssao: true,
      noise: 0.01,
      toneMapping: ToneMappingMode.ACES_FILMIC,
    },
  };

  const p = presets[preset] || presets.arcade;
  const finalBloom = bloomOverride ?? p.bloom;

  return (
    <EffectComposer multisampling={0}>
      <Bloom 
        intensity={finalBloom}
        luminanceThreshold={p.bloomThreshold}
        luminanceSmoothing={0.4}
        mipmapBlur
        radius={p.bloomRadius}
      />
      <ToneMapping mode={p.toneMapping} />
      {p.vignette > 0 && (
        <Vignette 
          offset={p.vignetteOffset}
          darkness={p.vignette}
          blendFunction={BlendFunction.NORMAL}
        />
      )}
      {p.chromatic > 0 && (
        <ChromaticAberration 
          offset={new Vector2(p.chromatic, p.chromatic)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
        />
      )}
      {p.noise > 0 && (
        <Noise 
          premultiply
          blendFunction={BlendFunction.ADD}
          opacity={p.noise}
        />
      )}
    </EffectComposer>
  );
}
