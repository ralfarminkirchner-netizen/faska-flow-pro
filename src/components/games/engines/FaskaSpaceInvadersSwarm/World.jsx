import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './GameLogic';
import { Text } from '@react-three/drei';

const Alien = ({ position, numberValue }) => {
  const ref = useRef();
  useFrame((state, delta) => {
    ref.current.rotation.y += delta;
    ref.current.rotation.x += delta * 0.5;
  });
  return (
    <group position={position}>
      <mesh ref={ref}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#ff00ff" />
      </mesh>
      <Text position={[0, 0.6, 0]} fontSize={0.4} color="white" outlineWidth={0.05} outlineColor="black" rotation={[-Math.PI / 4, 0, 0]}>
        {numberValue}
      </Text>
    </group>
  );
};

const World = () => {
  const updateGameState = useGameStore(state => state.updateGameState);
  const aliens = useGameStore(state => state.aliens);
  const lasers = useGameStore(state => state.lasers);

  useFrame((state, delta) => {
    updateGameState(delta);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#000022" />
      </mesh>

      {aliens.map(a => (
        <Alien key={a.id} position={[a.x, 0, a.z]} numberValue={a.numberValue} />
      ))}

      {lasers.map(l => (
        <mesh key={l.id} position={[l.x, 0, l.z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      ))}
    </>
  );
};

export default World;
