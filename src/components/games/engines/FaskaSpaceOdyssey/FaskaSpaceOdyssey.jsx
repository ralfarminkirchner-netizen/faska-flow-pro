import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { KeyboardControls, Stars } from '@react-three/drei';
import World from './World';
import useGameLogic from './GameLogic';

const FaskaSpaceOdyssey = () => {
  const { gameState, score, health, resetGame, startGame } = useGameLogic();

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', background: 'black', overflow: 'hidden' }}>
      {gameState === 'menu' && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, color: 'white', textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#00f3ff' }}>Faska Space Odyssey</h1>
          <button 
            onClick={startGame}
            style={{ padding: '10px 20px', fontSize: '1.5rem', background: '#00f3ff', color: 'black', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
          >
            Start Mission
          </button>
        </div>
      )}

      {gameState === 'gameover' && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, color: 'white', textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', color: 'red' }}>GAME OVER</h1>
          <h2>Final Score: {score}</h2>
          <button 
            onClick={resetGame}
            style={{ padding: '10px 20px', fontSize: '1.5rem', background: 'red', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
          >
            Try Again
          </button>
        </div>
      )}

      {gameState === 'victory' && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, color: 'white', textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', color: 'green' }}>VICTORY!</h1>
          <h2>Final Score: {score}</h2>
          <button 
            onClick={resetGame}
            style={{ padding: '10px 20px', fontSize: '1.5rem', background: 'green', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
          >
            Play Again
          </button>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'boss') && (
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, color: '#00f3ff', fontFamily: 'monospace', fontSize: '1.2rem', pointerEvents: 'none' }}>
          <div>SCORE: {score}</div>
          <div>SHIELD: {health}%</div>
          {gameState === 'boss' && <div style={{ color: 'red', marginTop: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>BOSS APPROACHING!</div>}
        </div>
      )}

      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
          { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
          { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
          { name: 'right', keys: ['ArrowRight', 'KeyD'] },
          { name: 'shoot', keys: ['Space'] }
        ]}
      >
        <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
          <color attach="background" args={['#000005']} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#00f3ff" />
          <Physics gravity={[0, 0, 0]}>
            {gameState !== 'menu' && <World />}
          </Physics>
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default FaskaSpaceOdyssey;
