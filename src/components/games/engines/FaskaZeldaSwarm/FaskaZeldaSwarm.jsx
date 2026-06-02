import { useCallback, useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import SwarmOrchestrator from '../../../../shared/SwarmOrchestrator';
import MobileJoystick from '../../../../shared/MobileJoystick';
import UIOverlay from '../../../../shared/UIOverlay';
import LearncadeQuiz from '../../../../shared/LearncadeQuiz';
import useGameInput from '../../../../shared/useGameInput';
import PostProcessingStack from '../../../../shared/PostProcessingStack';
import InstancedParticles from '../../../../shared/ParticleSystem';
import { useScreenShake } from '../../../../shared/ScreenShake';
import useZeldaStore from './GameLogic';
import Player from './Player';
import World from './World';

const PIXEL_FONT = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
const SWITCH_HINTS = {
  blade: 'Schwert-Siegel',
  arrow: 'Bogen-Siegel',
  bomb: 'Bomben-Siegel',
  shield: 'Schild-Siegel',
};

/**
 * FaskaZeldaSwarm — Top-down Adventure Game
 * Features:
 * - Zelda-style exploration
 * - Sword combat with slimes and bats
 * - Room transitions
 * - Rupee collection
 * - Learncade quiz integration
 * - PostProcessing (adventure preset), Particles, ScreenShake
 */

// Hearts display (Zelda-style)
function HeartsDisplay() {
  const health = useZeldaStore((s) => s.health);
  const maxHealth = useZeldaStore((s) => s.maxHealth);

  const hearts = [];
  for (let i = 0; i < maxHealth / 2; i++) {
    const remaining = health - i * 2;
    let state = 'empty';
    if (remaining >= 2) state = 'full';
    else if (remaining === 1) state = 'half';
    hearts.push(state);
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 60,
        left: 16,
        display: 'flex',
        gap: 4,
        fontSize: 22,
        zIndex: 55,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
      }}
    >
      {hearts.map((h, i) => (
        <span key={i} className={`pixel-heart pixel-heart-${h}`} />
      ))}
    </div>
  );
}

// Zelda-specific HUD
function ZeldaHUD() {
  const rupees = useZeldaStore((s) => s.rupees);
  const arrows = useZeldaStore((s) => s.arrows);
  const maxArrows = useZeldaStore((s) => s.maxArrows);
  const bombs = useZeldaStore((s) => s.bombs);
  const maxBombs = useZeldaStore((s) => s.maxBombs);
  const relics = useZeldaStore((s) => s.relics);
  const currentRoom = useZeldaStore((s) => s.currentRoom);
  const totalRooms = useZeldaStore((s) => s.totalRooms);
  const enemies = useZeldaStore((s) => s.enemies);
  const aliveCount = enemies.filter((e) => e.alive).length;
  const swordSwinging = useZeldaStore((s) => s.swordSwinging);
  const transitioning = useZeldaStore((s) => s.transitioning);
  const stamina = useZeldaStore((s) => s.stamina);
  const maxStamina = useZeldaStore((s) => s.maxStamina);
  const rolling = useZeldaStore((s) => s.rolling);
  const rollCooldown = useZeldaStore((s) => s.rollCooldown);
  const shieldActive = useZeldaStore((s) => s.shieldActive);
  const shieldFlash = useZeldaStore((s) => s.shieldFlash);
  const spinCooldown = useZeldaStore((s) => s.spinCooldown);
  const combo = useZeldaStore((s) => s.combo);
  const courageCharge = useZeldaStore((s) => s.courageCharge);
  const courageTimer = useZeldaStore((s) => s.courageTimer);
  const stats = useZeldaStore((s) => s.stats);
  const goals = useZeldaStore((s) => s.goals);
  const mode = useZeldaStore((s) => s.mode);
  const shrines = useZeldaStore((s) => s.shrines);
  const switches = useZeldaStore((s) => s.switches);
  const roomUnlocked = useZeldaStore((s) => s.roomUnlocked);
  const roomMessage = useZeldaStore((s) => s.roomMessage);
  const roomMessageTimer = useZeldaStore((s) => s.roomMessageTimer);
  const targetLockId = useZeldaStore((s) => s.targetLockId);
  const activeContract = useZeldaStore((s) => s.activeContract);
  const contractTimer = useZeldaStore((s) => s.contractTimer);
  const contractCooldown = useZeldaStore((s) => s.contractCooldown);
  const contractMedals = useZeldaStore((s) => s.contractMedals);
  const contractFails = useZeldaStore((s) => s.contractFails);
  const staminaPct = Math.round((stamina / maxStamina) * 100);
  const activeShrine = shrines.find((shrine) => !shrine.solved && !shrine.failed) || shrines[0];
  const switchesOpen = switches.every((button) => button.active);
  const lockedTarget = targetLockId ? enemies.find((enemy) => enemy.id === targetLockId && enemy.alive) : null;
  const contractValue = activeContract ? Math.max(0, (stats[activeContract.type] || 0) - (activeContract.startValue || 0)) : 0;
  const contractProgress = activeContract ? Math.min(activeContract.target, contractValue) : 0;
  const contractPct = activeContract ? Math.min(100, Math.round((contractProgress / activeContract.target) * 100)) : 0;
  const pendingSwitch = switches.find((button) => !button.active);
  const puzzleTitle = activeShrine && mode === 'learn'
    ? activeShrine.subject || 'Learncade'
    : roomUnlocked
      ? 'Tor offen'
      : pendingSwitch
        ? SWITCH_HINTS[pendingSwitch.kind] || 'Werkzeug-Siegel'
        : switchesOpen
          ? 'Raumziel'
          : 'Schalterziel';
  const showStaminaPanel = staminaPct < 100 || shieldActive || rolling || rollCooldown > 0 || spinCooldown > 0;
  const showCouragePanel = courageTimer > 0 || courageCharge > 0 || combo > 0 || goals.some((goal) => goal.complete);
  const solvedShrines = shrines.filter((shrine) => shrine.solved).length;
  const failedShrines = shrines.filter((shrine) => shrine.failed).length;
  const mapRooms = Array.from({ length: totalRooms }, (_, index) => ({
    index,
    current: index === currentRoom,
    cleared: index < currentRoom || (index === currentRoom && roomUnlocked),
    boss: index > 0 && (index + 1) % 5 === 0,
  }));

  return (
    <>
      <HeartsDisplay />

      {/* Bottom HUD */}
      <div
        style={{
          position: 'fixed',
          bottom: 12,
          left: 12,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          maxWidth: 'min(740px, calc(100vw - 24px))',
          gap: 8,
          pointerEvents: 'none',
          zIndex: 55,
        }}
      >
        {/* Rupees */}
        <div
          style={{
            background: 'rgba(10, 40, 10, 0.85)',
            borderRadius: 0,
            padding: '6px 10px',
            border: '1px solid rgba(34, 221, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 20 }}>💎</span>
          <span
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 18,
              fontWeight: 800,
              color: '#22dd44',
              textShadow: '0 0 10px rgba(34, 221, 68, 0.5)',
            }}
          >
            {rupees}
          </span>
        </div>

        {/* Room indicator */}
        <div
          style={{
            background: 'rgba(10, 10, 40, 0.85)',
            borderRadius: 0,
            padding: '6px 10px',
            border: '1px solid rgba(100, 100, 255, 0.3)',
          }}
        >
          <div
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 11,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {mode === 'learn' ? 'Lernraum' : 'Raum'}
          </div>
          <div
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 15,
              fontWeight: 700,
              color: '#aabbff',
            }}
          >
            {currentRoom + 1}/{totalRooms}
          </div>
        </div>

        {/* Inventory */}
        <div
          style={{
            background: 'rgba(30, 24, 10, 0.85)',
            borderRadius: 0,
            padding: '6px 10px',
            border: '1px solid rgba(250, 204, 21, 0.3)',
            minWidth: 124,
          }}
        >
          <div
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 11,
              color: '#fef3c7',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
	            Ausruestung
          </div>
          <div style={{ fontFamily: 'Outfit, sans-serif', color: '#facc15', fontWeight: 900, fontSize: 15 }}>
	            {arrows}/{maxArrows} Pfeile · {bombs}/{maxBombs} Bomben
          </div>
          <div style={{ fontFamily: 'Outfit, sans-serif', color: '#cbd5e1', fontWeight: 800, fontSize: 10 }}>
	            Bogen · Bomben · Relikte {relics}
          </div>
        </div>

        {/* Active room contract */}
        <div
          style={{
            background: activeContract ? 'rgba(39, 30, 6, 0.88)' : 'rgba(15, 23, 42, 0.82)',
            borderRadius: 0,
            padding: '6px 10px',
            border: `1px solid ${activeContract ? 'rgba(250,204,21,.42)' : 'rgba(148,163,184,.24)'}`,
            minWidth: 198,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: '#fef3c7', fontWeight: 900, letterSpacing: 1 }}>
              RAUMAUFTRAG
            </span>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: activeContract && contractTimer < 8 ? '#fb7185' : '#facc15', fontWeight: 900 }}>
              {activeContract ? `${Math.ceil(contractTimer)}s` : `${Math.ceil(contractCooldown)}s`}
            </span>
          </div>
          <div style={{ marginTop: 5, fontFamily: 'Outfit, sans-serif', fontSize: 12, color: activeContract ? '#fde68a' : '#cbd5e1', fontWeight: 900 }}>
            {activeContract ? activeContract.label : 'naechster Auftrag'}
          </div>
          <div style={{ height: 6, background: 'rgba(15,23,42,.84)', borderRadius: 999, overflow: 'hidden', marginTop: 6 }}>
            <div
              style={{
                height: '100%',
                width: `${activeContract ? contractPct : 100 - Math.min(100, contractCooldown * 50)}%`,
                background: activeContract ? 'linear-gradient(90deg, #facc15, #22c55e)' : 'rgba(148,163,184,.42)',
              }}
            />
          </div>
          <div style={{ marginTop: 5, fontFamily: 'Outfit, sans-serif', fontSize: 10, color: '#cbd5e1', fontWeight: 800 }}>
            {activeContract ? `${contractProgress}/${activeContract.target}` : `Medaillen ${contractMedals} · Verpasst ${contractFails}`}
            {activeContract ? ` · Medaillen ${contractMedals}` : ''}
          </div>
        </div>

        {/* Stamina / defense */}
        {showStaminaPanel && (
          <div
          style={{
            background: shieldActive ? 'rgba(14, 165, 233, 0.2)' : rolling ? 'rgba(245, 158, 11, 0.18)' : 'rgba(10, 25, 35, 0.85)',
            borderRadius: 0,
            padding: '6px 10px',
            border: `1px solid ${shieldFlash > 0 ? 'rgba(103, 232, 249, 0.85)' : 'rgba(14, 165, 233, 0.3)'}`,
            minWidth: 136,
          }}
        >
          <div
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 11,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {shieldActive ? '🛡️ Schild' : rolling ? '💨 Rolle' : rollCooldown > 0 ? 'Rolle wartet' : 'Ausdauer'}
          </div>
          <div style={{ height: 7, borderRadius: 999, background: 'rgba(15, 23, 42, .82)', marginTop: 7, overflow: 'hidden' }}>
            <div
              style={{
                width: `${staminaPct}%`,
                height: '100%',
                background: staminaPct > 35 ? 'linear-gradient(90deg, #10b981, #67e8f9)' : '#f97316',
              }}
            />
          </div>
          <div
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 10,
              color: shieldActive ? '#67e8f9' : rolling ? '#fef08a' : spinCooldown > 0 ? '#f97316' : '#cbd5e1',
              fontWeight: 800,
              marginTop: 5,
            }}
          >
	            Rolle · Schild · Lock-on · Wirbel
          </div>
        </div>
        )}

        {/* Courage / masteries */}
        {showCouragePanel && (
          <div
          style={{
            background: courageTimer > 0 ? 'rgba(250, 204, 21, 0.18)' : 'rgba(18, 24, 38, 0.86)',
            borderRadius: 0,
            padding: '6px 10px',
            border: `1px solid ${courageTimer > 0 ? 'rgba(250,204,21,.65)' : 'rgba(148,163,184,.25)'}`,
            minWidth: 186,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: '#94a3b8', fontWeight: 900, letterSpacing: 1 }}>
              MUT-FOKUS
            </span>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: '#facc15', fontWeight: 900 }}>
              {courageTimer > 0 ? `${courageTimer.toFixed(1)}s` : `${Math.round(courageCharge)}%`} · SERIE x{combo}
            </span>
          </div>
          <div style={{ height: 6, background: 'rgba(15,23,42,.84)', borderRadius: 999, overflow: 'hidden', marginTop: 6 }}>
            <div
              style={{
                height: '100%',
                width: `${courageTimer > 0 ? 100 : courageCharge}%`,
                background: courageTimer > 0 ? 'linear-gradient(90deg, #facc15, #22c55e)' : '#22c55e',
              }}
            />
          </div>
          <div style={{ marginTop: 7, fontFamily: 'Outfit, sans-serif', fontSize: 10, fontWeight: 900, color: '#94a3b8', letterSpacing: 1 }}>
            MEISTERUNGEN
          </div>
          {goals.slice(0, 5).map((goal) => {
            const value = Math.min(goal.target, stats[goal.type] || 0);
            return (
              <div
                key={goal.id}
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 10,
                  fontWeight: 800,
                  color: goal.complete ? '#86efac' : '#cbd5e1',
                  marginTop: 2,
                }}
              >
                {goal.complete ? 'OK' : `${value}/${goal.target}`} {goal.label}
              </div>
            );
          })}
        </div>
        )}

        {/* Enemies count */}
	        {aliveCount > 0 && (
	          <div
            style={{
              background: 'rgba(40, 10, 10, 0.85)',
              borderRadius: 0,
              padding: '6px 10px',
              border: '1px solid rgba(255, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>👾</span>
            <span
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 20,
                fontWeight: 700,
                color: '#ff4444',
              }}
            >
              {aliveCount}
            </span>
	          </div>
	        )}
	        {lockedTarget && (
	          <div
	            style={{
	              background: lockedTarget.type === 'boss' ? 'rgba(69, 10, 10, 0.86)' : 'rgba(30, 20, 8, 0.86)',
	              borderRadius: 0,
	              padding: '6px 10px',
	              border: `1px solid ${lockedTarget.type === 'boss' ? 'rgba(239,68,68,.45)' : 'rgba(250,204,21,.42)'}`,
	              minWidth: 154,
	            }}
	          >
	            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: '#fef3c7', fontWeight: 900, letterSpacing: 1 }}>
	              LOCK-ON
	            </div>
	            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, color: lockedTarget.type === 'boss' ? '#fecaca' : '#facc15', fontWeight: 900, marginTop: 2 }}>
	              {lockedTarget.type === 'boss' ? 'Tempelritter' : lockedTarget.type === 'scribe' ? 'Schreiber' : lockedTarget.type}
	            </div>
	          </div>
	        )}
	      </div>

      <div className="zelda-dungeon-map">
        <div className="zelda-map-heading">
          <span>DUNGEON-KARTE</span>
          <strong>{currentRoom + 1}/{totalRooms}</strong>
        </div>
        <div className="zelda-dungeon-map-grid">
          {mapRooms.map((room) => (
            <div
              key={room.index}
              className="zelda-map-cell"
              style={{
                background: room.current
                  ? '#facc15'
                  : room.cleared
                    ? '#22c55e'
                    : room.boss
                      ? 'rgba(127, 29, 29, .92)'
                      : 'rgba(15, 23, 42, .88)',
                borderColor: room.current
                  ? '#fef08a'
                  : room.cleared
                    ? '#86efac'
                    : room.boss
                      ? '#fb7185'
                      : 'rgba(148, 163, 184, .35)',
                color: room.current ? '#172554' : room.boss ? '#fecaca' : '#f8fafc',
              }}
              aria-label={`Raum ${room.index + 1}`}
            >
              {room.current ? '>' : room.boss ? 'B' : room.index + 1}
            </div>
          ))}
        </div>
        <div className="zelda-map-status">
          Tor {roomUnlocked ? 'offen' : 'zu'} · Auftrag {contractMedals} OK/{contractFails} Fail
        </div>
        {mode === 'learn' && (
          <div className="zelda-map-status zelda-map-status-learn">
            Schreine {solvedShrines}/{shrines.length} · Fehler {failedShrines}
          </div>
        )}
      </div>

      {((roomMessageTimer > 0 && roomUnlocked) || (activeShrine && mode === 'learn')) && (
        <div
          style={{
            position: 'fixed',
            top: 118,
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: 520,
            background: 'rgba(15, 23, 42, 0.74)',
            border: `1px solid ${roomUnlocked ? 'rgba(34,197,94,.55)' : 'rgba(250,204,21,.32)'}`,
            borderRadius: 0,
            padding: '8px 14px',
            color: '#f8fafc',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 900,
            zIndex: 56,
            textAlign: 'center',
            pointerEvents: 'none',
            boxShadow: '0 16px 45px rgba(0,0,0,.28)',
          }}
        >
	          <div style={{ color: roomUnlocked ? '#86efac' : '#fef3c7', fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase' }}>
	            {puzzleTitle}
	          </div>
          <div style={{ fontSize: 13, marginTop: 3 }}>
            {activeShrine && mode === 'learn' ? activeShrine.prompt : roomMessage}
          </div>
        </div>
      )}

      {/* Sword indicator */}
      {swordSwinging && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 55,
          }}
        >
          <div
            style={{
              fontSize: 40,
              animation: 'swordSlash 0.3s ease-out',
              filter: 'drop-shadow(0 0 10px rgba(170, 221, 255, 0.5))',
            }}
          >
            ⚔️
          </div>
        </div>
      )}

      {/* Room transition overlay */}
      {transitioning && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 90,
            pointerEvents: 'none',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 24,
              color: '#ffdd44',
              fontWeight: 700,
            }}
          >
            🚪 Naechster Raum...
          </span>
        </div>
      )}

      <style>{`
        @keyframes swordSlash {
          0% { transform: rotate(-45deg) scale(0.5); opacity: 0; }
          50% { transform: rotate(15deg) scale(1.2); opacity: 1; }
          100% { transform: rotate(0deg) scale(1); opacity: 0.5; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
}

// Start screen
function ModeSwitch({ mode, onModeChange }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        pointerEvents: 'auto',
      }}
    >
      {[
        ['arcade', 'Normal'],
        ['learn', 'Learncade'],
      ].map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onModeChange(id)}
          style={{
            padding: '9px 16px',
            borderRadius: 10,
            border: mode === id ? '1px solid #22dd44' : '1px solid rgba(255,255,255,.18)',
            background: mode === id ? 'rgba(34, 221, 68, 0.18)' : 'rgba(10, 24, 14, 0.76)',
            color: mode === id ? '#bbf7d0' : '#cbd5e1',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 900,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: 0.7,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function FloatingModeSwitch({ mode, onModeChange }) {
  return (
    <div style={{ position: 'fixed', top: 64, left: '50%', transform: 'translateX(-50%)', zIndex: 58 }}>
      <ModeSwitch mode={mode} onModeChange={onModeChange} />
    </div>
  );
}

function ZeldaPixelStyle() {
  return (
    <style>{`
      .faska-zelda-pixel {
        background:
          linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px),
          linear-gradient(0deg, rgba(255,255,255,.035) 1px, transparent 1px),
          #132611;
        background-size: 8px 8px, 8px 8px, auto;
        color-scheme: dark;
        image-rendering: pixelated;
      }

      .faska-zelda-pixel canvas {
        image-rendering: pixelated;
        image-rendering: crisp-edges;
        filter: saturate(1.22) contrast(1.18);
      }

      .faska-zelda-pixel::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 48;
        background:
          repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 1px, transparent 1px 4px),
          radial-gradient(circle at 50% 40%, transparent 0 50%, rgba(0,0,0,.24) 100%);
        mix-blend-mode: soft-light;
      }

      .faska-zelda-pixel .btn-primary,
      .faska-zelda-pixel button {
        border-radius: 0 !important;
        font-family: ${PIXEL_FONT} !important;
        letter-spacing: 0 !important;
        text-transform: uppercase;
        box-shadow: 4px 4px 0 rgba(2,6,23,.92), 0 0 0 2px rgba(255,255,255,.12) inset !important;
      }

      .faska-zelda-pixel .joystick-base,
      .faska-zelda-pixel .joystick-knob,
      .faska-zelda-pixel .action-btn {
        border-radius: 0 !important;
      }

      .faska-zelda-pixel .pixel-heart {
        width: 20px;
        height: 18px;
        display: inline-block;
        image-rendering: pixelated;
        background:
          linear-gradient(90deg, transparent 0 10%, currentColor 10% 40%, transparent 40% 60%, currentColor 60% 90%, transparent 90%),
          linear-gradient(90deg, currentColor 0 100%);
        background-size: 100% 45%, 100% 55%;
        background-position: 0 0, 0 45%;
        background-repeat: no-repeat;
        color: #ef4444;
        filter: drop-shadow(2px 2px 0 #020617);
      }

      .faska-zelda-pixel .pixel-heart-half {
        background:
          linear-gradient(90deg, transparent 0 10%, currentColor 10% 40%, transparent 40% 60%, rgba(15,23,42,.86) 60% 90%, transparent 90%),
          linear-gradient(90deg, currentColor 0 50%, rgba(15,23,42,.86) 50% 100%);
      }

      .faska-zelda-pixel .pixel-heart-empty {
        color: rgba(15,23,42,.86);
        outline: 2px solid rgba(239,68,68,.65);
        outline-offset: -2px;
      }

      .faska-zelda-pixel .zelda-dungeon-map {
        position: fixed;
        top: 112px;
        right: 14px;
        width: 206px;
        z-index: 55;
        pointer-events: none;
        padding: 10px;
        background: rgba(5, 24, 16, .82);
        border: 2px solid rgba(187, 247, 208, .38);
        box-shadow: 5px 5px 0 rgba(2, 6, 23, .78), 0 0 0 2px rgba(255,255,255,.08) inset;
        font-family: ${PIXEL_FONT};
      }

      .faska-zelda-pixel .zelda-map-heading {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        align-items: center;
        color: #bbf7d0;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0;
      }

      .faska-zelda-pixel .zelda-map-heading strong {
        color: #facc15;
        font-size: 12px;
      }

      .faska-zelda-pixel .zelda-dungeon-map-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 5px;
        margin-top: 8px;
      }

      .faska-zelda-pixel .zelda-map-cell {
        width: 100%;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid rgba(148, 163, 184, .35);
        box-shadow: 2px 2px 0 rgba(2, 6, 23, .88);
        font-size: 10px;
        font-weight: 900;
        line-height: 1;
      }

      .faska-zelda-pixel .zelda-map-status {
        margin-top: 8px;
        color: #cbd5e1;
        font-size: 9px;
        font-weight: 800;
        line-height: 1.35;
      }

      .faska-zelda-pixel .zelda-map-status-learn {
        color: #fde68a;
      }

      @media (max-width: 700px) {
        .faska-zelda-pixel .zelda-dungeon-map {
          top: 104px;
          right: 8px;
          width: 164px;
          padding: 8px;
        }

        .faska-zelda-pixel .zelda-dungeon-map-grid {
          gap: 4px;
          margin-top: 6px;
        }

        .faska-zelda-pixel .zelda-map-cell {
          height: 16px;
          font-size: 9px;
        }

        .faska-zelda-pixel .joystick-zone-right {
          grid-template-columns: repeat(3, 58px) !important;
          gap: 8px !important;
          right: max(8px, env(safe-area-inset-right)) !important;
        }

        .faska-zelda-pixel .joystick-zone-left {
          left: max(8px, env(safe-area-inset-left)) !important;
        }
      }
    `}</style>
  );
}

// Start screen
function StartScreen({ onStart, mode, onModeChange }) {
  return (
    <div
      className="faska-zelda-pixel zelda-start-screen"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #1a3a1e 0%, #0a1a0e 70%)',
        zIndex: 100,
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <ZeldaPixelStyle />
      <h1
        style={{
          fontFamily: PIXEL_FONT,
          fontSize: 42,
          fontWeight: 900,
          color: '#f8fafc',
          textShadow: '4px 4px 0 #052e16, 0 0 28px rgba(34, 221, 68, 0.38)',
          letterSpacing: 0,
          margin: 0,
        }}
      >
        ⚔️ FASKA ZELDA PRO
      </h1>
      <p
        style={{
          fontFamily: PIXEL_FONT,
          fontSize: 14,
          color: '#bbf7d0',
          maxWidth: 520,
          textAlign: 'center',
          lineHeight: 1.8,
          background: 'rgba(5, 46, 22, .76)',
          border: '2px solid rgba(187,247,208,.42)',
          padding: '14px 18px',
          boxShadow: '6px 6px 0 rgba(2,6,23,.7)',
        }}
      >
        {mode === 'learn'
          ? 'Wort-Schreine, Werkzeug-Siegel, Raumauftraege und Medaillen greifen ineinander.'
          : 'Ein Pixel-Dungeon mit Raeumen, Siegeln, Gegnern, Bogen, Bomben, Raumauftraegen und Bossdruck.'}
      </p>
      <ModeSwitch mode={mode} onModeChange={onModeChange} />
      <button
        onClick={onStart}
        className="btn-primary"
        style={{
          padding: '16px 48px',
          fontSize: 20,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #1a8a2a, #22dd44)',
          border: '2px solid #44ff6644',
          borderRadius: 16,
          color: '#fff',
          cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif',
          textShadow: '0 2px 4px rgba(0,0,0,0.4)',
          boxShadow: '0 0 30px rgba(34, 221, 68, 0.4)',
        }}
      >
        🗡️ ABENTEUER STARTEN
      </button>
    </div>
  );
}

// Scene content — holds particles, shake, and post-processing inside the Canvas
function SceneContent({ particleRef, shake, ShakeUpdater, damageFlash }) {
  return (
    <>
      <TopDownCamera />
      <World particleRef={particleRef} />
      <Player particleRef={particleRef} shake={shake} />
      <ShakeUpdater />
      <InstancedParticles particleRef={particleRef} count={150} color="#ffaa00" />
      <PostProcessingStack preset="adventure" damageFlash={damageFlash} />
    </>
  );
}

export default function FaskaZeldaSwarm() {
  const score = useZeldaStore((s) => s.score);
  const lives = useZeldaStore((s) => s.lives);
  const level = useZeldaStore((s) => s.level);
  const isPlaying = useZeldaStore((s) => s.isPlaying);
  const isPaused = useZeldaStore((s) => s.isPaused);
  const isGameOver = useZeldaStore((s) => s.isGameOver);
  const quizActive = useZeldaStore((s) => s.quizActive);
  const quizQuestion = useZeldaStore((s) => s.quizQuestion);
  const quizScore = useZeldaStore((s) => s.quizScore);
  const quizStreak = useZeldaStore((s) => s.quizStreak);
  const mode = useZeldaStore((s) => s.mode);
  const health = useZeldaStore((s) => s.health);

  const startGame = useZeldaStore((s) => s.startGame);
  const pauseGame = useZeldaStore((s) => s.pauseGame);
  const answerQuiz = useZeldaStore((s) => s.answerQuiz);
  const setMode = useZeldaStore((s) => s.setMode);

  // Shared refs for particles and screen shake
  const particleRef = useRef();
  const { shake, ShakeUpdater } = useScreenShake();

  // Track damage flash for post-processing
  const [damageFlash, setDamageFlash] = useState(0);
  const prevHealthRef = useRef(health);
  useEffect(() => {
    if (health < prevHealthRef.current) setDamageFlash(1);
    prevHealthRef.current = health;
  }, [health]);
  useEffect(() => {
    if (damageFlash <= 0) return undefined;
    const frame = requestAnimationFrame(() => {
      setDamageFlash((value) => Math.max(0, value - 0.045));
    });
    return () => cancelAnimationFrame(frame);
  }, [damageFlash]);

  // Input hook
  const { onMove, onAction, onActionUp } = useGameInput(useZeldaStore);

  const handleStart = useCallback(() => {
    try {
      startGame();
    } catch (e) {
      console.error('[FaskaZeldaSwarm] start error:', e);
    }
  }, [startGame]);

  const handleRestart = useCallback(() => {
    try {
      startGame();
    } catch (e) {
      console.error('[FaskaZeldaSwarm] restart error:', e);
    }
  }, [startGame]);

  const handleExit = useCallback(() => {
    try {
      window.history.back();
    } catch {
      // Silent
    }
  }, []);

  const handleQuizAnswer = useCallback(
    (answer) => {
      try {
        answerQuiz(answer);
      } catch (e) {
        console.warn('[FaskaZeldaSwarm] quiz error:', e);
      }
    },
    [answerQuiz]
  );

  // Show start screen if not playing and not game over
  if (!isPlaying && !isGameOver) {
    return <StartScreen onStart={handleStart} mode={mode} onModeChange={setMode} />;
  }

  return (
    <div className="faska-zelda-pixel" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <ZeldaPixelStyle />
      <SwarmOrchestrator
        gameName="FASKA ZELDA PRO"
        gravity={[0, -20, 0]}
        cameraProps={{
          position: [0, 17, 5.5],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        onReset={handleRestart}
        canvasProps={{
          orthographic: true,
          dpr: 1,
          gl: { antialias: false, alpha: false, powerPreference: 'high-performance' },
          style: {
            imageRendering: 'pixelated',
            background: '#14351d',
          },
          camera: {
            position: [0, 17, 5.5],
            zoom: 56,
            near: 0.1,
            far: 100,
          },
        }}
      >
        <SceneContent
          particleRef={particleRef}
          shake={shake}
          ShakeUpdater={ShakeUpdater}
          damageFlash={damageFlash}
        />
      </SwarmOrchestrator>

      {/* Main HUD */}
      <UIOverlay
        score={score}
        lives={lives}
        level={level}
        isPaused={isPaused}
        isGameOver={isGameOver}
        onPause={pauseGame}
        onRestart={handleRestart}
        onExit={handleExit}
        gameName="FASKA ZELDA PRO"
        showLearncadeScore
        quizScore={quizScore}
        showLives={false}
      />

      {/* Zelda-specific HUD */}
      {isPlaying && <ZeldaHUD />}
      {isPlaying && <FloatingModeSwitch mode={mode} onModeChange={setMode} />}

      {/* Quiz overlay */}
      <LearncadeQuiz
        active={quizActive}
        question={quizQuestion}
        onAnswer={handleQuizAnswer}
        streak={quizStreak}
        quizScore={quizScore}
      />

      {/* Mobile controls */}
      <MobileJoystick
        onMove={onMove}
        onAction={onAction}
        onActionUp={onActionUp}
        buttons={[
          { label: '⚔️', id: 'A', color: '#22dd44' },
	          { label: '💨', id: 'B', color: '#f59e0b' },
	          { label: '🛡️', id: 'X', color: '#4488ff' },
	          { label: '🏹', id: 'Y', color: '#facc15' },
	          { label: '💣', id: 'L', color: '#ef4444' },
	          { label: '🎯', id: 'Z', color: '#38bdf8' },
	          { label: '🌀', id: 'R', color: '#a855f7' },
	        ]}
      />
    </div>
  );
}

// Top-down camera that follows the player
function TopDownCamera() {
  const playerPosition = useZeldaStore((s) => s.playerPosition);

  useFrame(({ camera }) => {
    try {
      // Smooth follow with offset
      const targetX = playerPosition[0];
      const targetZ = playerPosition[2] + 5.5;
      if ('zoom' in camera && camera.zoom !== 56) {
        camera.zoom = 56;
        camera.updateProjectionMatrix();
      }

      camera.position.x += (targetX - camera.position.x) * 0.08;
      camera.position.z += (targetZ - camera.position.z) * 0.08;
      camera.position.y = 17;

      // Look at player area
      camera.lookAt(playerPosition[0], 0, playerPosition[2]);
    } catch {
      // Silent
    }
  });

  return null;
}
