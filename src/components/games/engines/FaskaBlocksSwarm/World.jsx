import React from 'react';

const World = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      
      {/* Board Background */}
      <mesh position={[4.5, -9.5, -0.5]} receiveShadow>
        <boxGeometry args={[10, 20, 0.5]} />
        <meshStandardMaterial color="#2a2a3a" />
      </mesh>

      {/* Borders */}
      {/* Left */}
      <mesh position={[-0.5, -9.5, 0]} receiveShadow>
        <boxGeometry args={[1, 20, 1]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      {/* Right */}
      <mesh position={[9.5, -9.5, 0]} receiveShadow>
        <boxGeometry args={[1, 20, 1]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      {/* Bottom */}
      <mesh position={[4.5, -20, 0]} receiveShadow>
        <boxGeometry args={[11, 1, 1]} />
        <meshStandardMaterial color="#444" />
      </mesh>
    </>
  );
};

export default World;
