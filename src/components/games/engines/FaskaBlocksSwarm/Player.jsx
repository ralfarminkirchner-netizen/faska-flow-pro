import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useBlocksStore, { COLS, ROWS, getBlocks, getGhostY } from './GameLogic';

const BLOCK_SIZE = 0.95; // Slightly less than 1 for gaps between blocks

/**
 * Renders the current falling piece as 3D boxes with emissive glow,
 * and the ghost piece showing where it will land.
 */
export default function Player() {
  const groupRef = useRef();

  const currentPiece = useBlocksStore((s) => s.currentPiece);
  const grid = useBlocksStore((s) => s.grid);
  const isPlaying = useBlocksStore((s) => s.isPlaying);
  const tick = useBlocksStore((s) => s.tick);
  const clearingLines = useBlocksStore((s) => s.clearingLines);
  const clearAnimTimer = useBlocksStore((s) => s.clearAnimTimer);

  // Offset to center the grid
  const offsetX = -COLS / 2;
  const offsetY = -ROWS / 2;

  // Game tick
  useFrame((state, delta) => {
    if (!isPlaying) return;
    try {
      tick(delta);
    } catch (e) {
      console.error('[Blocks Player] tick error:', e);
    }
  });

  if (!isPlaying) return null;

  // Get current piece blocks
  const pieceBlocks = currentPiece ? getBlocks(currentPiece) : [];

  // Get ghost piece position
  const ghostY = currentPiece ? getGhostY(grid, currentPiece) : 0;
  const ghostBlocks = currentPiece
    ? currentPiece.shape[currentPiece.rotation % currentPiece.shape.length].map(
        ([r, c]) => ({
          row: ghostY + r,
          col: currentPiece.x + c,
        })
      )
    : [];

  return (
    <group ref={groupRef}>
      {/* === PLACED BLOCKS ON GRID === */}
      {grid.map((row, rowIdx) =>
        row.map((cell, colIdx) => {
          if (cell === null) return null;

          // Check if this row is being cleared
          const isClearing = clearingLines.includes(rowIdx);
          const clearProgress = isClearing
            ? 1 - clearAnimTimer / 0.4
            : 0;

          return (
            <mesh
              key={`grid-${rowIdx}-${colIdx}`}
              position={[
                colIdx + offsetX + 0.5,
                (ROWS - rowIdx - 1) + offsetY + 0.5,
                0,
              ]}
              scale={isClearing ? [1 - clearProgress, 1 - clearProgress, 1 - clearProgress] : [1, 1, 1]}
            >
              <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]} />
              <meshStandardMaterial
                color={cell}
                emissive={cell}
                emissiveIntensity={isClearing ? 3 + clearProgress * 5 : 0.4}
                roughness={0.3}
                metalness={0.5}
                transparent={isClearing}
                opacity={isClearing ? 1 - clearProgress : 1}
              />
            </mesh>
          );
        })
      )}

      {/* === GHOST PIECE === */}
      {currentPiece &&
        ghostBlocks.map((block, i) => (
          <mesh
            key={`ghost-${i}`}
            position={[
              block.col + offsetX + 0.5,
              (ROWS - block.row - 1) + offsetY + 0.5,
              0,
            ]}
          >
            <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]} />
            <meshStandardMaterial
              color={currentPiece.color}
              transparent
              opacity={0.15}
              wireframe={false}
            />
            {/* Wireframe overlay for ghost */}
            <mesh>
              <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]} />
              <meshStandardMaterial
                color={currentPiece.color}
                wireframe
                transparent
                opacity={0.35}
              />
            </mesh>
          </mesh>
        ))}

      {/* === CURRENT FALLING PIECE === */}
      {currentPiece &&
        pieceBlocks.map((block, i) => (
          <group
            key={`piece-${i}`}
            position={[
              block.col + offsetX + 0.5,
              (ROWS - block.row - 1) + offsetY + 0.5,
              0,
            ]}
          >
            <mesh castShadow>
              <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]} />
              <meshStandardMaterial
                color={currentPiece.color}
                emissive={currentPiece.color}
                emissiveIntensity={0.8}
                roughness={0.2}
                metalness={0.6}
              />
            </mesh>
            {/* Highlight edge */}
            <mesh>
              <boxGeometry args={[BLOCK_SIZE + 0.02, BLOCK_SIZE + 0.02, BLOCK_SIZE + 0.02]} />
              <meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={0.1}
                side={THREE.BackSide}
              />
            </mesh>
          </group>
        ))}

      {/* === LINE CLEAR FLASH EFFECTS === */}
      {clearingLines.map((rowIdx) => (
        <mesh
          key={`clear-flash-${rowIdx}`}
          position={[
            0,
            (ROWS - rowIdx - 1) + offsetY + 0.5,
            0.5,
          ]}
        >
          <planeGeometry args={[COLS + 1, 1.2]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={8 * (clearAnimTimer / 0.4)}
            transparent
            opacity={0.6 * (clearAnimTimer / 0.4)}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
