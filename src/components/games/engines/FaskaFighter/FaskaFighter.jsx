import React, { useState, useEffect, useRef } from 'react';

// --- Chromakey Helper ---
const processSprite = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      // Remove magenta background
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 200 && data[i+1] < 50 && data[i+2] > 200) {
          data[i+3] = 0; // transparent
        }
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.src = src;
  });
};

const QUESTIONS = [
  { term: "const", desc: "Declares a block-scoped, read-only named constant.", attack: "HADOUKEN" },
  { term: "let", desc: "Declares a block-scoped, local variable.", attack: "SHORYUKEN" },
  { term: "function", desc: "Declares a function.", attack: "SPINNING BIRD KICK" },
  { term: "return", desc: "Specifies the value to be returned by a function.", attack: "SONIC BOOM" },
  { term: "if", desc: "Executes a statement if a specified condition is truthy.", attack: "TIGER KNEE" }
];

export default function FaskaFighter({ onExit }) {
  const [sprites, setSprites] = useState({ player: null, enemy: null });
  
  // Game State
  const [gameState, setGameState] = useState({
    playerHealth: 100,
    enemyHealth: 100,
    playerX: 20,
    enemyX: 70, // percentages
    playerState: 'idle', // idle, attack, hit, dead
    enemyState: 'idle',
    questionActive: false,
    currentQuestion: null,
    typedText: '',
    message: 'FIGHT!',
    combo: 0
  });

  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  // Load Sprites
  useEffect(() => {
    Promise.all([
      processSprite('/textures/fighter_player.png'),
      processSprite('/textures/fighter_enemy.png')
    ]).then(([p, e]) => setSprites({ player: p, enemy: e }));

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  }, []);

  const nextQuestion = () => {
    const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    setGameState(prev => ({
      ...prev,
      questionActive: true,
      currentQuestion: q,
      typedText: '',
      message: ''
    }));
  };

  // Keyboard Typing Mechanics
  useEffect(() => {
    const handleKeyDown = (e) => {
      const state = stateRef.current;
      if (!state.questionActive || state.playerHealth <= 0 || state.enemyHealth <= 0) return;

      if (e.key.length === 1) { // Normal character
        const targetWord = state.currentQuestion.term;
        const nextChar = targetWord[state.typedText.length];

        if (e.key.toLowerCase() === nextChar.toLowerCase()) {
          const newTyped = state.typedText + e.key;
          
          if (newTyped.length === targetWord.length) {
            // Success! Execute Attack
            executeAttack(state.currentQuestion.attack);
          } else {
            setGameState(prev => ({ ...prev, typedText: newTyped }));
            // Mini punch animation
            setGameState(prev => ({ ...prev, playerState: 'mini-attack' }));
            setTimeout(() => setGameState(prev => ({ ...prev, playerState: 'idle' })), 100);
          }
        } else {
          // Mistake! Enemy attacks
          enemyAttack();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const executeAttack = (attackName) => {
    setGameState(prev => ({
      ...prev,
      questionActive: false,
      playerState: 'attack',
      enemyState: 'hit',
      message: attackName + '!',
      enemyHealth: Math.max(0, prev.enemyHealth - 20),
      combo: prev.combo + 1
    }));

    setTimeout(() => {
      const st = stateRef.current;
      if (st.enemyHealth > 0) {
        setGameState(prev => ({ ...prev, playerState: 'idle', enemyState: 'idle' }));
        nextQuestion();
      } else {
        setGameState(prev => ({ ...prev, playerState: 'win', enemyState: 'dead', message: 'K.O. - YOU WIN!' }));
      }
    }, 1000);
  };

  const enemyAttack = () => {
    setGameState(prev => ({
      ...prev,
      typedText: '', // Reset progress
      enemyState: 'attack',
      playerState: 'hit',
      playerHealth: Math.max(0, prev.playerHealth - 15),
      combo: 0,
      message: 'COUNTER ATTACK!'
    }));

    setTimeout(() => {
      const st = stateRef.current;
      if (st.playerHealth > 0) {
        setGameState(prev => ({ ...prev, playerState: 'idle', enemyState: 'idle', message: '' }));
      } else {
        setGameState(prev => ({ ...prev, playerState: 'dead', enemyState: 'win', questionActive: false, message: 'K.O. - YOU LOSE' }));
      }
    }, 800);
  };

  const getTransform = (charType, animState) => {
    if (charType === 'player') {
      if (animState === 'attack') return 'translateX(20vw) scale(1.1)';
      if (animState === 'mini-attack') return 'translateX(5vw)';
      if (animState === 'hit') return 'translateX(-5vw) rotate(-10deg)';
      if (animState === 'dead') return 'translateY(10vw) rotate(-90deg)';
    } else {
      if (animState === 'attack') return 'translateX(-20vw) scaleX(-1.1) scaleY(1.1)';
      if (animState === 'hit') return 'translateX(5vw) scaleX(-1) rotate(-10deg) brightness(2) hue-rotate(90deg)';
      if (animState === 'dead') return 'translateY(10vw) scaleX(-1) rotate(90deg) grayscale(1)';
    }
    return charType === 'enemy' ? 'scaleX(-1)' : 'none';
  };

  return (
    <div style={{
      width: '100%', height: '100%', position: 'absolute', inset: 0,
      backgroundImage: 'url(/textures/fighter_bg.png)',
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      fontFamily: 'Impact, sans-serif', overflow: 'hidden',
      boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)'
    }}>
      
      {/* UI Layer */}
      <div style={{ position: 'absolute', top: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
        {/* Player Health */}
        <div style={{ width: '40%' }}>
          <div style={{ color: 'white', fontSize: '32px', textShadow: '2px 2px 0 black' }}>FASKA-RYU</div>
          <div style={{ width: '100%', height: '30px', backgroundColor: 'red', border: '4px solid white', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${gameState.playerHealth}%`, height: '100%', backgroundColor: 'yellow', transition: 'width 0.2s' }} />
          </div>
        </div>
        
        <div style={{ color: 'white', fontSize: '64px', textShadow: '0 0 10px red', fontWeight: 'bold' }}>VS</div>

        {/* Enemy Health */}
        <div style={{ width: '40%', textAlign: 'right' }}>
          <div style={{ color: 'white', fontSize: '32px', textShadow: '2px 2px 0 black' }}>AKUMA-BUG</div>
          <div style={{ width: '100%', height: '30px', backgroundColor: 'red', border: '4px solid white', borderRadius: '5px', overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: `${gameState.enemyHealth}%`, height: '100%', backgroundColor: 'yellow', transition: 'width 0.2s' }} />
          </div>
        </div>
      </div>

      <button onClick={onExit} style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', padding: '10px 20px', fontSize: '20px', backgroundColor: '#e74c3c', color: 'white', border: '3px solid black', borderRadius: '10px', cursor: 'pointer', zIndex: 20 }}>BEENDEN</button>

      {/* Combo Counter */}
      {gameState.combo > 1 && (
        <div style={{ position: 'absolute', top: '20%', left: '10%', color: 'yellow', fontSize: '48px', textShadow: '4px 4px 0 red', fontStyle: 'italic', zIndex: 5 }}>
          {gameState.combo} COMBO!
        </div>
      )}

      {/* Message Text */}
      {gameState.message && (
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '80px', textShadow: '5px 5px 0 red, -5px -5px 0 red, 5px -5px 0 red, -5px 5px 0 red', zIndex: 10, animation: 'pulse 0.5s infinite alternate' }}>
          {gameState.message}
        </div>
      )}

      {/* Typing Interface */}
      {gameState.questionActive && (
        <div style={{ position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.8)', padding: '20px 40px', borderRadius: '20px', border: '5px solid #3498db', textAlign: 'center', zIndex: 10, minWidth: '60%' }}>
          <div style={{ color: '#ecf0f1', fontSize: '24px', marginBottom: '10px' }}>Type the missing keyword:</div>
          <div style={{ color: '#f1c40f', fontSize: '32px', marginBottom: '20px' }}>{gameState.currentQuestion.desc}</div>
          
          <div style={{ fontSize: '64px', letterSpacing: '10px', fontFamily: 'monospace', fontWeight: 'bold' }}>
            {gameState.currentQuestion.term.split('').map((char, i) => {
              const isTyped = i < gameState.typedText.length;
              return (
                <span key={i} style={{ color: isTyped ? '#2ecc71' : '#555', textShadow: isTyped ? '0 0 10px #2ecc71' : 'none' }}>
                  {isTyped ? char : '_'}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Characters Layer */}
      <div style={{ position: 'absolute', bottom: '15%', left: 0, width: '100%', height: '50vh', pointerEvents: 'none' }}>
        
        {/* Player Sprite */}
        {sprites.player && (
          <img 
            src={sprites.player} 
            alt="Player" 
            style={{ 
              position: 'absolute', left: `${gameState.playerX}%`, bottom: 0, height: '100%', 
              transform: getTransform('player', gameState.playerState),
              transformOrigin: 'bottom center',
              transition: 'transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              filter: `drop-shadow(10px 10px 0px rgba(0,0,0,0.5)) ${gameState.playerState === 'hit' ? 'sepia(1) hue-rotate(-50deg) saturate(5)' : ''}`
            }} 
          />
        )}

        {/* Enemy Sprite */}
        {sprites.enemy && (
          <img 
            src={sprites.enemy} 
            alt="Enemy" 
            style={{ 
              position: 'absolute', left: `${gameState.enemyX}%`, bottom: 0, height: '100%', 
              transform: getTransform('enemy', gameState.enemyState),
              transformOrigin: 'bottom center',
              transition: 'transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              filter: `drop-shadow(10px 10px 0px rgba(0,0,0,0.5)) ${gameState.enemyState === 'hit' ? 'brightness(10)' : ''}`
            }} 
          />
        )}
      </div>

      <style>{`@keyframes pulse { 0% { transform: translate(-50%, -50%) scale(1); } 100% { transform: translate(-50%, -50%) scale(1.1); } }`}</style>
    </div>
  );
}
