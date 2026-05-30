import React, { useState } from 'react';
import { useGameStore } from './GameLogic';

export function UIOverlay({ onExit }) {
  const { health, maxHealth, inventory, phase, activeQuiz, submitQuiz } = useGameStore();
  const [answer, setAnswer] = useState('');

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 100 }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', pointerEvents: 'auto' }}>
        <div>
          <button onClick={onExit} style={{ 
            padding: '10px 20px', background: '#e11d48', color: 'white', 
            border: '2px solid #fff', borderRadius: '8px', 
            fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}>
            EXIT
          </button>
        </div>
        
        <div style={{ 
          background: 'rgba(0,0,0,0.7)', padding: '10px 20px', 
          borderRadius: '8px', color: 'white', display: 'flex', gap: '30px', alignItems: 'center',
          border: '2px solid #444'
        }}>
          <div>
            <span style={{ color: '#ef4444', fontSize: '24px' }}>
              {Array.from({ length: maxHealth }).map((_, i) => (i < health ? '❤️' : '🖤')).join(' ')}
            </span>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '20px', color: '#ffcc00' }}>
            🔑 {inventory.keys}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '20px', color: '#ff8800' }}>
            💣 {inventory.bombs}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {phase === 'quiz' && activeQuiz && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,30,0.95)', border: '4px solid #00ffcc', padding: '40px', 
          borderRadius: '16px', color: 'white', textAlign: 'center', pointerEvents: 'auto',
          boxShadow: '0 0 40px rgba(0, 255, 204, 0.4)'
        }}>
          <h2 style={{ color: '#00ffcc', margin: '0 0 20px 0', fontSize: '28px' }}>Learncade Puzzle</h2>
          <p style={{ fontSize: '24px', margin: '20px 0' }}>{activeQuiz.question}</p>
          <input 
            type="text" 
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            style={{ 
              padding: '12px', fontSize: '20px', width: '250px', 
              borderRadius: '8px', border: 'none', textAlign: 'center',
              outline: 'none'
            }}
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter') {
                submitQuiz(answer);
                setAnswer('');
              }
            }}
          />
          <br/>
          <button 
            onClick={() => { submitQuiz(answer); setAnswer(''); }}
            style={{ 
              marginTop: '30px', padding: '12px 30px', 
              background: '#00ffcc', color: '#000', 
              fontWeight: 'bold', fontSize: '18px',
              border: 'none', borderRadius: '8px', cursor: 'pointer'
            }}
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
}
