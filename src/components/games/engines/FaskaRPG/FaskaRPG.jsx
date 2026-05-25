import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 12;

const STYLES = {
  container: {
    width: '100vw', height: '100vh',
    background: '#1a1a2e', color: '#e0e0e0',
    fontFamily: '"Courier New", Courier, monospace', display: 'flex',
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    position: 'absolute', top: 0, left: 0, zIndex: 9999
  },
  header: {
    position: 'absolute', top: 20, left: 20,
    display: 'flex', flexDirection: 'column', gap: '10px'
  },
  board: {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_SIZE}, 48px)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, 48px)`,
    gap: '2px',
    background: '#16213e',
    padding: '12px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
  },
  cell: {
    width: '48px', height: '48px',
    background: '#0f3460',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '28px', cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    userSelect: 'none'
  },
  player: { background: '#4ecca3', color: '#1a1a2e', transform: 'scale(0.9)', borderRadius: '50%', boxShadow: '0 0 10px #4ecca3' },
  enemy: { background: '#e94560', color: 'white', transform: 'scale(0.9)', borderRadius: '50%', boxShadow: '0 0 10px #e94560' },
  obstacle: { background: '#53354a', borderRadius: '2px' },
  button: {
    padding: '12px 24px', background: '#e94560',
    color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
  },
  logContainer: {
    marginTop: '30px', width: '600px', height: '150px',
    background: '#111', padding: '15px', overflowY: 'auto',
    borderRadius: '8px', border: '2px solid #0f3460',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
  },
  logEntry: { marginBottom: '5px', lineHeight: '1.4' },
  statsBar: {
    display: 'flex', gap: '20px', marginBottom: '20px', fontSize: '22px', fontWeight: 'bold'
  }
};

export default function FaskaRPG({ onExit }) {
  const [player, setPlayer] = useState({ x: 1, y: 1, hp: 100, maxHp: 100, damage: 25 });
  const [enemies, setEnemies] = useState([
    { id: 1, x: 10, y: 10, hp: 50, maxHp: 50, damage: 15 },
    { id: 2, x: 10, y: 2, hp: 40, maxHp: 40, damage: 12 },
    { id: 3, x: 2, y: 10, hp: 60, maxHp: 60, damage: 18 },
  ]);
  const [obstacles, setObstacles] = useState([
    { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 5, y: 4 }, { x: 5, y: 5 },
    { x: 8, y: 8 }, { x: 8, y: 7 }, { x: 7, y: 8 },
    { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 8, y: 2 }, { x: 7, y: 2 }
  ]);
  const [logs, setLogs] = useState(['Welcome to FaskaRPG!', 'Click adjacent tiles to move or attack.', 'Defeat all enemies to win.']);
  const [turn, setTurn] = useState('player');
  const logRef = useRef(null);

  const log = (msg) => setLogs(l => [...l, msg]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCellClick = (x, y) => {
    if (turn !== 'player' || player.hp <= 0) return;

    const dist = Math.abs(player.x - x) + Math.abs(player.y - y);
    if (dist > 1) {
      log('Target is too far!');
      return;
    }

    if (obstacles.some(o => o.x === x && o.y === y)) {
      log('Path blocked by obstacle.');
      return;
    }

    const enemyIndex = enemies.findIndex(e => e.x === x && e.y === y);
    if (enemyIndex !== -1) {
      const enemy = enemies[enemyIndex];
      const damage = Math.floor(Math.random() * player.damage) + 10;
      enemy.hp -= damage;
      log(`Player attacks Enemy ${enemy.id} for ${damage} damage!`);
      
      if (enemy.hp <= 0) {
        log(`Enemy ${enemy.id} defeated!`);
        enemies.splice(enemyIndex, 1);
      }
      setEnemies([...enemies]);
      setTurn('enemy');
      return;
    }

    setPlayer({ ...player, x, y });
    setTurn('enemy');
  };

  useEffect(() => {
    if (turn === 'enemy' && player.hp > 0) {
      setTimeout(() => {
        if (enemies.length === 0) {
          log('Victory! All enemies have been defeated!');
          return;
        }

        let newEnemies = [...enemies];
        let newPlayerHp = player.hp;

        newEnemies.forEach(enemy => {
          const dist = Math.abs(enemy.x - player.x) + Math.abs(enemy.y - player.y);
          if (dist === 1) {
            // Attack
            const damage = Math.floor(Math.random() * enemy.damage) + 5;
            newPlayerHp -= damage;
            log(`Enemy ${enemy.id} attacks Player for ${damage} damage!`);
          } else {
            // Move
            const dx = Math.sign(player.x - enemy.x);
            const dy = Math.sign(player.y - enemy.y);
            let nx = enemy.x;
            let ny = enemy.y;
            
            if (Math.random() > 0.5 && dx !== 0) nx += dx;
            else if (dy !== 0) ny += dy;
            else nx += dx;

            const occupied = 
              (nx === player.x && ny === player.y) ||
              newEnemies.some(e => e.id !== enemy.id && e.x === nx && e.y === ny) ||
              obstacles.some(o => o.x === nx && o.y === ny);

            if (!occupied && nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
              enemy.x = nx;
              enemy.y = ny;
            }
          }
        });

        setPlayer(p => ({ ...p, hp: newPlayerHp }));
        setEnemies(newEnemies);
        
        if (newPlayerHp <= 0) {
          log('You have fallen in battle. Game Over.');
        } else {
          setTurn('player');
        }
      }, 600);
    }
  }, [turn, enemies, player, obstacles]);

  const cells = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      let isPlayer = player.x === x && player.y === y;
      let enemyHere = enemies.find(e => e.x === x && e.y === y);
      let isObstacle = obstacles.some(o => o.x === x && o.y === y);

      let cellStyle = { ...STYLES.cell };
      let content = '';

      if (isPlayer) {
        Object.assign(cellStyle, STYLES.player);
        content = '🥷';
      } else if (enemyHere) {
        Object.assign(cellStyle, STYLES.enemy);
        content = '👹';
      } else if (isObstacle) {
        Object.assign(cellStyle, STYLES.obstacle);
      }

      if (turn === 'player' && !isPlayer && !isObstacle && player.hp > 0) {
        const dist = Math.abs(player.x - x) + Math.abs(player.y - y);
        if (dist === 1) {
          if (enemyHere) cellStyle.boxShadow = 'inset 0 0 15px rgba(233, 69, 96, 0.8)';
          else cellStyle.boxShadow = 'inset 0 0 15px rgba(78, 204, 163, 0.6)';
        }
      }

      cells.push(
        <div key={`${x}-${y}`} style={cellStyle} onClick={() => handleCellClick(x, y)}>
          {content}
        </div>
      );
    }
  }

  return (
    <div style={STYLES.container}>
      <div style={STYLES.header}>
        <h2 style={{ margin: 0, color: '#4ecca3', fontSize: '32px', textShadow: '0 0 10px rgba(78,204,163,0.5)' }}>FaskaRPG</h2>
        <button style={STYLES.button} onClick={onExit}>EXIT TO MENU</button>
      </div>
      
      <div style={STYLES.statsBar}>
        <span style={{ color: player.hp > 30 ? '#4ecca3' : '#e94560' }}>
          HP: {Math.max(0, player.hp)} / {player.maxHp}
        </span>
        <span style={{ color: '#e0e0e0' }}>Enemies: {enemies.length}</span>
        <span style={{ color: turn === 'player' ? '#4ecca3' : '#e94560' }}>
          {turn === 'player' ? "Player's Turn" : "Enemy's Turn..."}
        </span>
      </div>

      <div style={STYLES.board}>
        {cells}
      </div>

      <div style={STYLES.logContainer} ref={logRef}>
        {logs.map((l, i) => (
          <div key={i} style={{ ...STYLES.logEntry, color: l.includes('Damage') || l.includes('defeated') ? '#e94560' : (l.includes('Victory') ? '#4ecca3' : '#aaa') }}>
            &gt; {l}
          </div>
        ))}
      </div>
    </div>
  );
}
