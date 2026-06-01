import React, { useEffect } from 'react';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import PostProcessingStack from '../../../../shared/PostProcessingStack';
import { useMathDefenderStore } from './GameLogic';
import World from './World';

export default function FaskaMathDefenderSwarm() {
  const store = useMathDefenderStore();

  // Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent handling if a quiz is active or game not playing
      if (!store.isPlaying || store.isPaused || store.quizActive) return;
      store.handleTyping(e.key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store]);

  return (
    <>
      <SwarmOrchestrator cameraPos={[0, 5, 25]} cameraFov={60}>
        <World />
        <PostProcessingStack 
          preset="space" 
          damageFlash={store.baseHitEvent ? 1 : 0} 
        />
      </SwarmOrchestrator>

      <UIOverlay
        gameName="Math Defender"
        score={store.score}
        lives={store.lives}
        level={store.level}
        isPaused={store.isPaused}
        isGameOver={store.isGameOver}
        onPause={store.pauseGame}
        onRestart={store.startGame}
        onExit={() => window.history.back()}
        showLearncadeScore
        quizScore={store.quizScore}
      >
        {/* Massive text for currentInput */}
        {store.isPlaying && !store.isGameOver && !store.isPaused && (
          <div style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <div style={{
              fontSize: '4rem',
              fontWeight: 900,
              color: store.errorEvent ? '#ef4444' : '#00ffff',
              textShadow: `0 0 20px ${store.errorEvent ? 'rgba(239, 68, 68, 0.8)' : 'rgba(0, 255, 255, 0.8)'}`,
              fontFamily: 'Outfit, sans-serif',
              minHeight: '4.5rem',
              transition: 'color 0.2s',
            }}>
              {store.currentInput || ''}
            </div>
          </div>
        )}

        {/* On-screen Numpad for mobile (optional fallback if needed) */}
        {store.isPlaying && !store.isGameOver && !store.isPaused && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            pointerEvents: 'auto',
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'Del'].map(key => (
              <button
                key={key}
                onClick={() => {
                  if (key === 'C') store.resetInput();
                  else if (key === 'Del') store.handleTyping('Backspace');
                  else store.handleTyping(key.toString());
                }}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(10, 10, 26, 0.8)',
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  color: '#fff',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  fontFamily: 'Outfit, sans-serif',
                  backdropFilter: 'blur(5px)',
                  cursor: 'pointer'
                }}
              >
                {key}
              </button>
            ))}
          </div>
        )}
      </UIOverlay>

      {/* Intro Screen */}
      {!store.isPlaying && !store.isGameOver && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,5,16,0.9)', backdropFilter: 'blur(10px)',
          fontFamily: 'Outfit, sans-serif', color: 'white'
        }}>
          <h1 style={{ fontSize: '4rem', color: '#00ffff', textShadow: '0 0 20px #00ffff', margin: 0 }}>
            Math Defender
          </h1>
          <p style={{ fontSize: '1.5rem', opacity: 0.8, maxWidth: 600, textAlign: 'center', margin: '20px 0' }}>
            Type the answers to the math problems to shoot down the incoming asteroids!
          </p>
          <button 
            onClick={store.startGame}
            style={{
              padding: '16px 32px', fontSize: '1.5rem', fontWeight: 'bold',
              borderRadius: '16px', background: '#00ffff', color: '#000',
              border: 'none', cursor: 'pointer', marginTop: '20px',
              boxShadow: '0 0 20px rgba(0,255,255,0.5)'
            }}
          >
            Start Game
          </button>
        </div>
      )}

      {/* Learncade Quiz Overlay */}
      {store.quizActive && (
        <div style={{ position: 'absolute', zIndex: 60, inset: 0 }}>
          <LearncadeQuiz
            active={store.quizActive}
            question={store.quizQuestion}
            onAnswer={store.answerQuiz}
            onBonus={() => {
              store.addScore(100);
              // Add an extra life!
              useMathDefenderStore.setState(state => ({ lives: state.lives + 1 }));
            }}
            streak={store.quizStreak}
            quizScore={store.quizScore}
            bonusLabel="Extra Leben!"
          />
        </div>
      )}
    </>
  );
}
