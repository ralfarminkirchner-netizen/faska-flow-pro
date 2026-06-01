import { useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * useScreenShake — Camera shake hook for impacts, explosions, shooting.
 * 
 * Usage:
 *   const { shake, ShakeUpdater } = useScreenShake();
 *   
 *   // Trigger:
 *   shake(0.5, 200);  // intensity 0-1, duration ms
 *   
 *   // In JSX (inside Canvas):
 *   <ShakeUpdater />
 */
export function useScreenShake() {
  const shakeRef = useRef({ intensity: 0, duration: 0, elapsed: 0, active: false });
  const offsetRef = useRef(new THREE.Vector3());

  const shake = useCallback((intensity = 0.5, durationMs = 200) => {
    shakeRef.current = {
      intensity: Math.min(intensity, 1),
      duration: durationMs / 1000,
      elapsed: 0,
      active: true,
    };
  }, []);

  function ShakeUpdater() {
    const { camera } = useThree();
    const originalPosRef = useRef(null);

    useFrame((_, delta) => {
      const s = shakeRef.current;
      if (!s.active) return;

      if (!originalPosRef.current) {
        originalPosRef.current = camera.position.clone();
      }

      s.elapsed += delta;
      const progress = Math.min(s.elapsed / s.duration, 1);
      const decay = 1 - progress;
      const mag = s.intensity * decay * 0.15;

      offsetRef.current.set(
        (Math.random() - 0.5) * 2 * mag,
        (Math.random() - 0.5) * 2 * mag,
        (Math.random() - 0.5) * 2 * mag * 0.3,
      );

      camera.position.add(offsetRef.current);

      if (progress >= 1) {
        s.active = false;
        if (originalPosRef.current) {
          originalPosRef.current = null;
        }
      }
    });

    return null;
  }

  return { shake, ShakeUpdater };
}

export default useScreenShake;
