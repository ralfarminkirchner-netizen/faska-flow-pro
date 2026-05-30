const fs = require('fs');
let code = fs.readFileSync('src/components/games/engines/FaskaKartSwarm/FaskaKartSwarm.jsx', 'utf-8');

// 1. Update useKeys
code = code.replace(
  `const useKeys = () => {\n  const keys = useRef({});`,
  `const useKeys = (externalKeysRef) => {\n  const keys = externalKeysRef || useRef({});`
);

// 2. Add MobileControls before FaskaKartSwarm
const mobileControlsCode = `
const MobileControls = ({ keysRef }) => {
  const handleTouch = (key, state) => (e) => {
    e.preventDefault();
    keysRef.current[key] = state;
  };
  return (
    <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', zIndex: 40, pointerEvents: 'none' }}>
      <div style={{ display: 'flex', gap: '15px', pointerEvents: 'auto' }}>
        <button onTouchStart={handleTouch('ArrowLeft', true)} onTouchEnd={handleTouch('ArrowLeft', false)} onMouseDown={handleTouch('ArrowLeft', true)} onMouseUp={handleTouch('ArrowLeft', false)} style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.2)', border: '2px solid white', borderRadius: '50%', fontSize: '30px', color: 'white' }}>⬅️</button>
        <button onTouchStart={handleTouch('ArrowRight', true)} onTouchEnd={handleTouch('ArrowRight', false)} onMouseDown={handleTouch('ArrowRight', true)} onMouseUp={handleTouch('ArrowRight', false)} style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.2)', border: '2px solid white', borderRadius: '50%', fontSize: '30px', color: 'white' }}>➡️</button>
      </div>
      <div style={{ display: 'flex', gap: '15px', pointerEvents: 'auto', alignItems: 'center' }}>
        <button onTouchStart={handleTouch('ShiftLeft', true)} onTouchEnd={handleTouch('ShiftLeft', false)} onMouseDown={handleTouch('ShiftLeft', true)} onMouseUp={handleTouch('ShiftLeft', false)} style={{ width: 70, height: 70, background: 'rgba(255,165,0,0.5)', border: '2px solid white', borderRadius: '50%', fontSize: '24px', marginRight: '10px' }}>💨</button>
        <button onTouchStart={handleTouch('KeyE', true)} onTouchEnd={handleTouch('KeyE', false)} onMouseDown={handleTouch('KeyE', true)} onMouseUp={handleTouch('KeyE', false)} style={{ width: 70, height: 70, background: 'rgba(255,255,0,0.5)', border: '2px solid white', borderRadius: '50%', fontSize: '24px', marginRight: '10px' }}>💥</button>
        <button onTouchStart={handleTouch('ArrowDown', true)} onTouchEnd={handleTouch('ArrowDown', false)} onMouseDown={handleTouch('ArrowDown', true)} onMouseUp={handleTouch('ArrowDown', false)} style={{ width: 80, height: 80, background: 'rgba(239,68,68,0.5)', border: '2px solid white', borderRadius: '50%', fontSize: '30px' }}>🛑</button>
        <button onTouchStart={handleTouch('ArrowUp', true)} onTouchEnd={handleTouch('ArrowUp', false)} onMouseDown={handleTouch('ArrowUp', true)} onMouseUp={handleTouch('ArrowUp', false)} style={{ width: 90, height: 90, background: 'rgba(34,197,94,0.5)', border: '2px solid white', borderRadius: '50%', fontSize: '40px' }}>🚀</button>
      </div>
    </div>
  );
};
`;
code = code.replace(`const FaskaKartSwarm = ({ onExit }) => {`, mobileControlsCode + `\nconst FaskaKartSwarm = ({ onExit, isLearncade = true }) => {\n  const keysRef = useRef({});`);

// 3. Pass keysRef to Scene and MobileControls
code = code.replace(
  `        <Scene\n          gameStateRef={gameStateRef}\n          updateGame={updateGame}\n          onLapComplete={handleLapComplete}\n        />`,
  `        <Scene\n          gameStateRef={gameStateRef}\n          updateGame={updateGame}\n          onLapComplete={handleLapComplete}\n          isLearncade={isLearncade}\n          keysRef={keysRef}\n        />`
);
code = code.replace(
  `{/* Controls hint */}`,
  `<MobileControls keysRef={keysRef} />\n      {/* Controls hint */}`
);

// 4. Update Scene to accept isLearncade and keysRef and pass them
code = code.replace(
  `const Scene = ({ gameStateRef, updateGame, onLapComplete }) => {`,
  `const Scene = ({ gameStateRef, updateGame, onLapComplete, isLearncade, keysRef }) => {`
);
code = code.replace(
  `      <PlayerKart\n        gameStateRef={gameStateRef}`,
  `      <PlayerKart\n        isLearncade={isLearncade}\n        keysRef={keysRef}\n        gameStateRef={gameStateRef}`
);

// 5. Update PlayerKart to use isLearncade, keysRef, and bullet time
code = code.replace(
  `const PlayerKart = ({\n  gameStateRef, updateGame, itemBoxes, setItemBoxes,\n  setBananas, bananas, projectiles, setProjectiles,\n  onLapComplete\n}) => {\n  const { camera } = useThree();\n  const keys = useKeys();`,
  `const PlayerKart = ({\n  isLearncade, keysRef, gameStateRef, updateGame, itemBoxes, setItemBoxes,\n  setBananas, bananas, projectiles, setProjectiles,\n  onLapComplete\n}) => {\n  const { camera } = useThree();\n  const keys = useKeys(keysRef);`
);

// PlayerKart useFrame
code = code.replace(
  `    if (gameStateRef.current.phase !== 'racing') return;\n    const dt = clamp(delta, 0.001, 0.08);`,
  `    if (gameStateRef.current.phase !== 'racing' && gameStateRef.current.phase !== 'quiz') return;\n    let dt = clamp(delta, 0.001, 0.08);\n    if (gameStateRef.current.phase === 'quiz') dt *= 0.15; // BULLET TIME`
);

// Item box collision
code = code.replace(
  `        const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];\n        const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];\n        updateGame({\n          heldItem: item,\n          pendingCountry: country,\n          showCountryModal: true,\n          countryAnswer: '',\n          phase: 'quiz'\n        });`,
  `        const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];\n        if (isLearncade) {\n          const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];\n          // Pick 2 wrong countries for multiple choice\n          const wrong1 = COUNTRIES[(COUNTRIES.indexOf(country) + 1) % COUNTRIES.length];\n          const wrong2 = COUNTRIES[(COUNTRIES.indexOf(country) + 2) % COUNTRIES.length];\n          const options = [country, wrong1, wrong2].sort(() => Math.random() - 0.5);\n          updateGame({\n            heldItem: item,\n            pendingCountry: country,\n            countryOptions: options,\n            showCountryModal: true,\n            phase: 'quiz'\n          });\n        } else {\n          updateGame({ heldItem: item });\n        }`
);

// 6. Update AIKart useFrame for bullet time
code = code.replace(
  `    if (gameStateRef.current.phase !== 'racing') return;\n    const dt = clamp(delta, 0.001, 0.08);`,
  `    if (gameStateRef.current.phase !== 'racing' && gameStateRef.current.phase !== 'quiz') return;\n    let dt = clamp(delta, 0.001, 0.08);\n    if (gameStateRef.current.phase === 'quiz') dt *= 0.15; // BULLET TIME`
);

// 7. Change Country Modal to Multiple Choice
const modalCodeRegex = /\{\/\* Country Modal \*\/\}[\s\S]*?(?=\{\/\* Win Screen \*\/|\{\/\* Countdown \*\/)/;

const newModalCode = `{/* Country Modal */}
      {gameState.showCountryModal && gameState.pendingCountry && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)', zIndex: 50,
          fontFamily: 'sans-serif'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
            border: gameState.wrongAnswer ? '4px solid #ef4444' : '4px solid #facc15',
            borderRadius: '20px',
            padding: '36px 44px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            maxWidth: '420px', width: '90%',
            transition: 'border-color 0.2s'
          }}>
            <div style={{ fontSize: '90px', lineHeight: 1, textShadow: '4px 4px 0 #000' }}>
              {gameState.pendingCountry.flag}
            </div>
            <h2 style={{ color: '#facc15', fontSize: '26px', margin: '16px 0 8px', textShadow: '2px 2px 0 #000' }}>
              {{ shell: '🐚', boost: '⚡', banana: '🍌' }[gameState.heldItem] || '❓'} Item erhalten!
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '18px', margin: '0 0 20px', fontWeight: 'bold' }}>
              Welches Land zeigt diese Flagge?
            </p>
            {gameState.wrongAnswer && (
              <p style={{ color: '#ef4444', fontSize: '16px', margin: '0 0 12px', fontWeight: 'bold' }}>
                ❌ Falsch! Versuche es nochmal.
              </p>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {gameState.countryOptions && gameState.countryOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (opt.name === gameState.pendingCountry.name) {
                      handleCountryCorrect();
                    } else {
                      handleCountryWrong();
                    }
                  }}
                  style={{
                    padding: '16px', fontSize: '20px', fontWeight: 'bold',
                    background: '#2563eb', color: 'white',
                    border: '2px solid #3b82f6', borderRadius: '12px', cursor: 'pointer',
                    boxShadow: '0 4px 0 #1d4ed8', transition: 'all 0.1s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#3b82f6'}
                  onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
                  onMouseDown={e => e.currentTarget.style.transform = 'translateY(4px)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
                  onTouchStart={e => e.currentTarget.style.transform = 'translateY(4px)'}
                  onTouchEnd={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      `;

code = code.replace(modalCodeRegex, newModalCode);

fs.writeFileSync('src/components/games/engines/FaskaKartSwarm/FaskaKartSwarm.jsx', code);
console.log('FaskaKartSwarm updated successfully.');
