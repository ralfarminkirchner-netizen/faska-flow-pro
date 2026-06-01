import React, { useEffect, useState } from 'react';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import { useGameStore } from './GameLogic';
import World from './World';

export default function FaskaTypeHeroSwarm() {
  const { score, health, handleKey, initGame } = useGameStore();
  const [showQuiz, setShowQuiz] = useState(false);
  const [lastQuizScore, setLastQuizScore] = useState(0);

  // Initialize Game and setup Keyboard Listeners
  useEffect(() => {
    initGame();
    
    const onKeyDown = (e) => {
      // Prevent handling keys if the quiz is open or game is over
      if (!showQuiz && useGameStore.getState().health > 0) {
        handleKey(e.key);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey, initGame, showQuiz]);

  // Handle Learncade Quiz trigger every 500 points
  useEffect(() => {
    if (score > 0 && score - lastQuizScore >= 500) {
      setShowQuiz(true);
      setLastQuizScore(score);
    }
  }, [score, lastQuizScore]);

  const handleQuizComplete = () => {
    setShowQuiz(false);
  };

  const gameOver = health <= 0;

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000', position: 'relative' }}>
      <SwarmOrchestrator>
        <World />
      </SwarmOrchestrator>

      {/* Main HUD overlay */}
      <UIOverlay 
        score={score} 
        lives={Math.ceil(health / 34)} // Map 100 health to ~3 lives for UI logic compatibility
        gameOver={gameOver} 
        onRestart={initGame} 
      />

      {/* Custom Health Bar */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '24px',
        background: '#111',
        border: '3px solid #333',
        borderRadius: '12px',
        overflow: 'hidden',
        zIndex: 10,
        boxShadow: '0 0 10px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          width: `${Math.max(0, health)}%`,
          height: '100%',
          background: health > 30 ? '#00ffcc' : '#ff0044',
          boxShadow: `0 0 10px ${health > 30 ? '#00ffcc' : '#ff0044'}`,
          transition: 'width 0.2s ease-out, background 0.2s'
        }} />
      </div>

      {/* On-screen controls (linked to camera parallax in World) */}
      <MobileJoystick />

      {/* Educational Quiz Overlay */}
      {showQuiz && (
        <LearncadeQuiz onComplete={handleQuizComplete} />
      )}
    </div>
  );
}
