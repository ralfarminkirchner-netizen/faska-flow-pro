import React from 'react';
import { useGameStore } from './GameLogic';

export function World() {
  const { doors, switches, chests } = useGameStore();

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '800px', height: '600px', backgroundColor: '#16162a' }}>
      
      {/* Grid Floor */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'linear-gradient(#222244 1px, transparent 1px), linear-gradient(90deg, #222244 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.3
      }} />

      {/* Walls */}
      <div style={{ position: 'absolute', top: '0', left: '0', right: '0', height: '20px', background: '#0d0d1a', borderBottom: '2px solid #333388' }} />
      <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '20px', background: '#0d0d1a', borderTop: '2px solid #333388' }} />
      <div style={{ position: 'absolute', top: '0', bottom: '0', left: '0', width: '20px', background: '#0d0d1a', borderRight: '2px solid #333388' }} />
      <div style={{ position: 'absolute', top: '0', bottom: '0', right: '0', width: '20px', background: '#0d0d1a', borderLeft: '2px solid #333388' }} />

      {/* Doors */}
      {doors.map(d => (
        <div key={d.id} style={{
          position: 'absolute', left: d.x - 40, top: d.y - 20, width: '80px', height: '40px',
          backgroundColor: d.open ? '#050510' : '#8b1a1a', 
          border: d.open ? '2px solid #33ff99' : '2px solid #cc2222',
          zIndex: 5
        }}>
          {!d.open && (
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '12px', height: '16px', background: '#ffaa00' }} />
          )}
        </div>
      ))}

      {/* Switches */}
      {switches.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: s.x - 15, top: s.y - 15, width: '30px', height: '30px',
          backgroundColor: s.active ? '#00ff66' : '#ff3333', 
          borderRadius: '50%', border: '3px solid #fff',
          boxShadow: s.active ? '0 0 10px #00ff66' : '0 0 10px #ff3333',
          zIndex: 5
        }} />
      ))}

      {/* Chests */}
      {chests.map(c => (
        <div key={c.id} style={{
          position: 'absolute', left: c.x - 20, top: c.y - 15, width: '40px', height: '30px',
          backgroundColor: c.open ? '#CD853F' : '#8B4513', 
          border: '2px solid #DAA520',
          borderRadius: '4px',
          zIndex: 5
        }}>
          {!c.open && <div style={{ width: '12px', height: '8px', background: 'gold', margin: '10px auto' }} />}
        </div>
      ))}
    </div>
  );
}
