import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * InstancedParticles — Reusable GPU-instanced particle system.
 * 
 * Props:
 *   count      — Max particles (default: 100)
 *   size       — Base particle size (default: 0.1)
 *   color      — Base color (default: '#ff8800')
 *   emissive   — Emissive color (default: same as color)
 *   emissiveIntensity — Glow intensity (default: 2)
 *   opacity    — Base opacity (default: 0.8)
 *   blending   — THREE blending mode (default: AdditiveBlending)
 * 
 * Ref API:
 *   emit(position, velocity, opts) — Spawn particle burst
 *   clear() — Reset all particles
 */
const InstancedParticles = ({ 
  count = 100, 
  size = 0.1, 
  color = '#ff8800',
  emissive,
  emissiveIntensity = 2,
  opacity = 0.8,
  blending = THREE.AdditiveBlending,
  particleRef,
}) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useRef(
    Array.from({ length: count }, () => ({
      active: false,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      life: 0,
      maxLife: 1,
      scale: 1,
      color: new THREE.Color(color),
    }))
  );

  const nextIndex = useRef(0);

  // Expose emit API via ref
  if (particleRef) {
    particleRef.current = {
      emit: (position, velocity = { x: 0, y: 1, z: 0 }, opts = {}) => {
        const burstCount = opts.count || 8;
        const spread = opts.spread || 1;
        const speed = opts.speed || 3;
        const lifetime = opts.lifetime || 0.8;
        
        for (let i = 0; i < burstCount; i++) {
          const p = particles.current[nextIndex.current];
          p.active = true;
          p.position.set(
            position.x + (Math.random() - 0.5) * 0.2,
            position.y + (Math.random() - 0.5) * 0.2,
            position.z + (Math.random() - 0.5) * 0.2,
          );
          p.velocity.set(
            (velocity.x + (Math.random() - 0.5) * spread) * speed,
            (velocity.y + (Math.random() - 0.5) * spread) * speed,
            (velocity.z + (Math.random() - 0.5) * spread) * speed,
          );
          p.life = 0;
          p.maxLife = lifetime + Math.random() * lifetime * 0.5;
          p.scale = 0.5 + Math.random() * 0.5;
          if (opts.color) p.color.set(opts.color);
          
          nextIndex.current = (nextIndex.current + 1) % count;
        }
      },
      clear: () => {
        particles.current.forEach(p => { p.active = false; });
      },
    };
  }

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.05);
    
    particles.current.forEach((p, i) => {
      if (!p.active) {
        dummy.position.set(0, -100, 0);
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        return;
      }

      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        dummy.position.set(0, -100, 0);
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        return;
      }

      // Apply gravity and drag
      p.velocity.y -= 4 * dt;
      p.velocity.multiplyScalar(1 - 2 * dt);

      p.position.add(p.velocity.clone().multiplyScalar(dt));

      const progress = p.life / p.maxLife;
      const fadeScale = p.scale * size * (1 - progress * progress);

      dummy.position.copy(p.position);
      dummy.scale.setScalar(Math.max(fadeScale, 0.001));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive || color}
        emissiveIntensity={emissiveIntensity}
        transparent
        opacity={opacity}
        blending={blending}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

export default InstancedParticles;
