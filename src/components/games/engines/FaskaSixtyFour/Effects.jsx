import React from 'react';
import { Sky } from '@react-three/drei';
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing';

export function Effects() {
  return (
    <>
      {/* Environment / Sky */}
      <Sky 
        sunPosition={[100, 20, 100]} 
        turbidity={0.3} 
        rayleigh={0.5} 
        mieCoefficient={0.005} 
        mieDirectionalG={0.8} 
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        position={[100, 20, 100]}
        intensity={1.5}
        shadow-mapSize-width={1024} // Keep mapSize moderate for mobile performance
        shadow-mapSize-height={1024}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Post-processing */}
      {/* Disable multisampling (multisampling=0) to save performance on mobile devices */}
      <EffectComposer multisampling={0} disableNormalPass>
        {/* Bloom effect */}
        <Bloom 
          luminanceThreshold={0.85} 
          luminanceSmoothing={0.1} 
          intensity={1.2} 
          mipmapBlur // Can be disabled if further mobile optimization is needed
        />
        {/* Ambient Occlusion (Screen Space Ambient Occlusion) */}
        <SSAO 
          samples={9} // Low sample count for mobile performance
          radius={0.1} 
          intensity={20} 
          luminanceInfluence={0.6} 
          color="black" 
        />
      </EffectComposer>
    </>
  );
}

export default Effects;
