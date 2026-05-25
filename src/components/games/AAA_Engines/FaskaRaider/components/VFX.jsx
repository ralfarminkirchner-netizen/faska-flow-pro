import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  ChromaticAberration,
  Noise
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// Procedurally animated torch light for atmospheric flickering
const TorchLight = ({ position, color = "#ff7700", intensity = 2, distance = 10 }) => {
  const lightRef = useRef();
  // Random seed so multiple torches don't flicker perfectly in sync
  const randomSeed = useMemo(() => Math.random() * 100, []);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      // Subtle flickering effect using combined sine waves
      const time = clock.getElapsedTime() * 5 + randomSeed;
      const flicker = Math.sin(time) * 0.1 + Math.sin(time * 2.3) * 0.05;
      lightRef.current.intensity = intensity + flicker;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={position}
      color={color}
      intensity={intensity}
      distance={distance}
      castShadow
      shadow-bias={-0.001}
    />
  );
};

export const VFX = () => {
  return (
    <>
      {/* ======================================= */}
      {/*              SCENE LIGHTING               */}
      {/* ======================================= */}

      {/* Base ambient lighting for the tomb/ruins vibe */}
      <ambientLight intensity={0.15} color="#2b3a5c" />

      {/* Main Directional Light (Moonlight or Crevice Sunlight) */}
      <directionalLight
        castShadow
        position={[10, 20, 10]}
        intensity={1.5}
        color="#8fbcdb"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
      />

      {/* Fill Light / Hemisphere to soften pure black shadows */}
      <hemisphereLight skyColor="#8fbcdb" groundColor="#1a1a1a" intensity={0.3} />

      {/* Environmental Torches */}
      <TorchLight position={[-5, 2, -5]} color="#ff6600" intensity={3} distance={15} />
      <TorchLight position={[8, 3, 2]} color="#ff8800" intensity={2.5} distance={12} />
      <TorchLight position={[-2, 1.5, 10]} color="#ff5500" intensity={3.5} distance={18} />

      {/* ======================================= */}
      {/*             POST-PROCESSING               */}
      {/* ======================================= */}
      
      <EffectComposer disableNormalPass multisampling={4}>
        {/* Cinematic Depth of Field */}
        <DepthOfField
          focusDistance={0.02} // where to focus
          focalLength={0.15}   // focal length
          bokehScale={3}       // bokeh size
        />

        {/* Bloom for torches, magic, and specular highlights */}
        <Bloom
          blendFunction={BlendFunction.ADD}
          luminanceThreshold={0.6} // Only bloom bright things
          luminanceSmoothing={0.9}
          intensity={1.5}
        />

        {/* Subtle Chromatic Aberration for AAA lens effect */}
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0015, 0.0015]} // subtle separation
        />

        {/* Film Grain/Noise for grittiness and banding prevention */}
        <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />

        {/* Dark Vignette to frame the action (Raider/Tomb style) */}
        <Vignette
          eskil={false}
          offset={0.3}
          darkness={0.65}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
};

export default VFX;
