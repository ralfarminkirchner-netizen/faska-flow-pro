import React from 'react';
import { useGameStore } from './GameLogic';
import { Text } from '@react-three/drei';

const Block = ({ x, y, value, color }) => {
  return (
    <group position={[x, -y, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
      {value > 0 && (
        <Text
          position={[0, 0, 0.46]}
          fontSize={0.6}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {value}
        </Text>
      )}
    </group>
  );
};

const Blocks = () => {
  const grid = useGameStore(state => state.grid);
  const currentPiece = useGameStore(state => state.currentPiece);

  return (
    <group>
      {/* Render settled grid blocks */}
      {grid.map((row, y) => 
        row.map((cell, x) => 
          cell ? <Block key={`fixed-${x}-${y}`} x={x} y={y} value={cell.value} color={cell.color} /> : null
        )
      )}

      {/* Render current piece */}
      {currentPiece && currentPiece.shape.map((row, r) =>
        row.map((cell, c) => 
          cell ? (
            <Block 
              key={`curr-${c}-${r}`} 
              x={currentPiece.x + c} 
              y={currentPiece.y + r} 
              value={currentPiece.values[r][c]} 
              color={currentPiece.color} 
            />
          ) : null
        )
      )}
    </group>
  );
};

export default Blocks;
