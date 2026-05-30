import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * MobileJoystick — Universal touch controls for all FASKA Flow games.
 * Provides a virtual joystick (left side) and action buttons (right side).
 * 
 * Props:
 *   onMove(dx, dy)    — Normalized direction [-1, 1]
 *   onAction(name)    — 'A', 'B', 'X', 'Y' button pressed
 *   onActionUp(name)  — Button released
 *   buttons           — Array of button configs [{label, id, color}]
 *   visible           — Show/hide controls (default: auto-detect touch)
 */
export default function MobileJoystick({
  onMove,
  onAction,
  onActionUp,
  buttons = [
    { label: 'A', id: 'A', color: '#10b981' },
    { label: 'B', id: 'B', color: '#ef4444' },
  ],
  visible,
}) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [activeButtons, setActiveButtons] = useState(new Set());
  const baseRef = useRef(null);
  const touchIdRef = useRef(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const moveIntervalRef = useRef(null);
  const lastDirRef = useRef({ dx: 0, dy: 0 });

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  const show = visible !== undefined ? visible : isTouchDevice;

  const RADIUS = 45;

  const handleJoystickStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.changedTouches?.[0] || e;
    touchIdRef.current = touch.identifier ?? 'mouse';
    const rect = baseRef.current.getBoundingClientRect();
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    // Start continuous movement reporting
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    moveIntervalRef.current = setInterval(() => {
      if (onMove && (lastDirRef.current.dx !== 0 || lastDirRef.current.dy !== 0)) {
        onMove(lastDirRef.current.dx, lastDirRef.current.dy);
      }
    }, 16); // ~60fps
  }, [onMove]);

  const handleJoystickMove = useCallback((e) => {
    e.preventDefault();
    const touch = e.changedTouches
      ? Array.from(e.changedTouches).find(t => t.identifier === touchIdRef.current)
      : e;
    if (!touch || !centerRef.current) return;

    const clientX = touch.clientX ?? touch.pageX;
    const clientY = touch.clientY ?? touch.pageY;

    let dx = clientX - centerRef.current.x;
    let dy = clientY - centerRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > RADIUS) {
      dx = (dx / dist) * RADIUS;
      dy = (dy / dist) * RADIUS;
    }

    setKnobPos({ x: dx, y: dy });

    const normDx = dx / RADIUS;
    const normDy = dy / RADIUS;
    lastDirRef.current = { dx: normDx, dy: normDy };

    if (onMove) {
      onMove(normDx, normDy);
    }
  }, [onMove]);

  const handleJoystickEnd = useCallback((e) => {
    e.preventDefault();
    touchIdRef.current = null;
    setKnobPos({ x: 0, y: 0 });
    lastDirRef.current = { dx: 0, dy: 0 };
    if (onMove) onMove(0, 0);
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  }, [onMove]);

  useEffect(() => {
    return () => {
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    };
  }, []);

  const handleButtonDown = useCallback((id) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveButtons(prev => new Set(prev).add(id));
    if (onAction) onAction(id);
  }, [onAction]);

  const handleButtonUp = useCallback((id) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveButtons(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (onActionUp) onActionUp(id);
  }, [onActionUp]);

  if (!show) return null;

  return (
    <>
      {/* Joystick — Left Side */}
      <div
        className="joystick-zone"
        style={{ left: 20 }}
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickEnd}
        onPointerDown={handleJoystickStart}
        onPointerMove={handleJoystickMove}
        onPointerUp={handleJoystickEnd}
      >
        <div ref={baseRef} className="joystick-base">
          <div
            className="joystick-knob"
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            }}
          />
          {/* D-pad visual guides */}
          <svg
            width="120" height="120"
            style={{ position: 'absolute', pointerEvents: 'none', opacity: 0.15 }}
          >
            <line x1="60" y1="15" x2="60" y2="105" stroke="white" strokeWidth="1" />
            <line x1="15" y1="60" x2="105" y2="60" stroke="white" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Action Buttons — Right Side */}
      <div
        className="joystick-zone"
        style={{
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'center',
        }}
      >
        {buttons.map((btn, i) => {
          const isPressed = activeButtons.has(btn.id);
          const angle = buttons.length > 2
            ? (i / buttons.length) * Math.PI * 2 - Math.PI / 2
            : 0;
          
          return (
            <button
              key={btn.id}
              className={`action-btn ${isPressed ? 'pressed' : ''}`}
              style={{
                background: isPressed
                  ? `${btn.color}99`
                  : `${btn.color}33`,
                borderColor: `${btn.color}88`,
                boxShadow: isPressed
                  ? `0 0 20px ${btn.color}66`
                  : 'none',
              }}
              onTouchStart={handleButtonDown(btn.id)}
              onTouchEnd={handleButtonUp(btn.id)}
              onTouchCancel={handleButtonUp(btn.id)}
              onPointerDown={handleButtonDown(btn.id)}
              onPointerUp={handleButtonUp(btn.id)}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
