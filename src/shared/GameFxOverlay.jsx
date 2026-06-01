import { useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PostProcessingStack from './PostProcessingStack';
import InstancedParticles from './ParticleSystem';
import { useScreenShake } from './ScreenShake';

/**
 * GlowSource — Invisible emissive mesh placed at a position to
 * create bloom glow at that screen location. Used to make the
 * 2D canvas game elements appear to glow through the post-processing.
 */
function GlowSource({ position, color, intensity = 3, size = 0.3, visible = true }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.material.emissiveIntensity = intensity + Math.sin(state.clock.elapsedTime * 4) * 0.5;
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 6, 6]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
        transparent
        opacity={0.0}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * AmbientGlow — Soft ambient screen-space glow for atmosphere.
 */
function AmbientGlow({ color = '#7c3aed', intensity = 0.8 }) {
  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[20, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
        transparent
        opacity={0.02}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * FxScene — The inner R3F scene with particles, shake, and glow sources.
 */
function FxScene({
  preset,
  damageFlash,
  boostActive,
  glowSources,
  ambientGlowColor,
  ambientGlowIntensity,
  particleRef,
  particleColor,
  particleCount,
  onShakeRef,
}) {
  const { shake, ShakeUpdater } = useScreenShake();

  // Expose shake function to parent via ref
  if (onShakeRef) {
    onShakeRef.current = shake;
  }

  return (
    <>
      {/* Minimal lighting so emissive materials work */}
      <ambientLight intensity={0.05} />

      {/* Ambient background glow */}
      <AmbientGlow color={ambientGlowColor} intensity={ambientGlowIntensity} />

      {/* Dynamic glow sources from game events */}
      {glowSources && glowSources.map((src, i) => (
        <GlowSource
          key={`glow-${i}`}
          position={src.position}
          color={src.color}
          intensity={src.intensity || 3}
          size={src.size || 0.3}
          visible={src.visible !== false}
        />
      ))}

      {/* Instanced Particles */}
      <InstancedParticles
        particleRef={particleRef}
        count={particleCount || 80}
        color={particleColor || '#ffaa00'}
        size={0.08}
        emissiveIntensity={3}
      />

      {/* Screen Shake */}
      <ShakeUpdater />

      {/* Post Processing — LAST child inside Canvas */}
      <PostProcessingStack
        preset={preset || 'arcade'}
        damageFlash={damageFlash || 0}
        boostActive={boostActive || false}
      />
    </>
  );
}

/**
 * GameFxOverlay — Transparent R3F Canvas overlay for 2D games.
 *
 * Ref API:
 *   emitParticles(screenX, screenY, opts) — Convert screen coords to 3D and emit particles
 *   shake(intensity, durationMs)         — Trigger screen shake
 *   setGlowSources(sources)              — Update dynamic glow source positions
 *
 * Props:
 *   preset           — PostProcessingStack preset
 *   damageFlash      — 0-1 damage flash intensity
 *   boostActive      — Boolean for racing boost
 *   ambientGlowColor — Color for ambient background glow
 *   particleColor    — Default particle color
 *   particleCount    — Max particle count
 *   canvasWidth      — Width of the underlying 2D canvas
 *   canvasHeight     — Height of the underlying 2D canvas
 */
const GameFxOverlay = forwardRef(function GameFxOverlay({
  preset = 'arcade',
  damageFlash = 0,
  boostActive = false,
  ambientGlowColor = '#7c3aed',
  ambientGlowIntensity = 0.8,
  particleColor = '#ffaa00',
  particleCount = 80,
  glowSources = [],
  canvasWidth = 1280,
  canvasHeight = 720,
}, ref) {
  const particleRef = useRef();
  const shakeRef = useRef(null);

  // Convert 2D screen coordinates to 3D world coords for the overlay camera
  const screenTo3D = useMemo(() => {
    const aspect = canvasWidth / canvasHeight;
    const fov = 50;
    const dist = 5; // camera z distance
    const halfH = Math.tan((fov * Math.PI) / 360) * dist;
    const halfW = halfH * aspect;
    return (sx, sy) => ({
      x: ((sx / canvasWidth) * 2 - 1) * halfW,
      y: (-(sy / canvasHeight) * 2 + 1) * halfH,
      z: 0,
    });
  }, [canvasWidth, canvasHeight]);

  useImperativeHandle(ref, () => ({
    emitParticles: (screenX, screenY, opts = {}) => {
      if (!particleRef.current) return;
      const pos = screenTo3D(screenX, screenY);
      particleRef.current.emit(
        pos,
        { x: 0, y: 1, z: 0 },
        {
          count: opts.count || 12,
          spread: opts.spread || 2,
          speed: opts.speed || 4,
          lifetime: opts.lifetime || 0.8,
          color: opts.color,
        }
      );
    },
    shake: (intensity = 0.5, durationMs = 200) => {
      if (shakeRef.current) {
        shakeRef.current(intensity, durationMs);
      }
    },
    clearParticles: () => {
      if (particleRef.current) particleRef.current.clear();
    },
  }), [screenTo3D]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
        dpr={[1, 1.5]}
      >
        <FxScene
          preset={preset}
          damageFlash={damageFlash}
          boostActive={boostActive}
          glowSources={glowSources}
          ambientGlowColor={ambientGlowColor}
          ambientGlowIntensity={ambientGlowIntensity}
          particleRef={particleRef}
          particleColor={particleColor}
          particleCount={particleCount}
          onShakeRef={shakeRef}
        />
      </Canvas>
    </div>
  );
});

export default GameFxOverlay;
