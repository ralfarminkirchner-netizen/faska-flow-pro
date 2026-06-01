import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * MobileJoystick — Universal touch controls for all FASKA Flow games.
 * Provides a virtual joystick (left side) and action buttons (right side).
 * 
 * Props:
 *   onMove(dx, dy)    — Normalized direction [-1, 1]
 *   onLook(dx, dy)    — Pointer delta for camera / aiming look
 *   onAction(name)    — 'A', 'B', 'X', 'Y' button pressed
 *   onActionUp(name)  — Button released
 *   buttons           — Array of button configs [{label, id, color}]
 *   visible           — Show/hide controls (default: auto-detect touch)
 */
export default function MobileJoystick({
  onMove,
  onLook,
  onAction,
  onActionUp,
  buttons = [
    { label: 'A', id: 'A', color: '#10b981' },
    { label: 'B', id: 'B', color: '#ef4444' },
  ],
  visible,
}) {
  const [isTouchDevice] = useState(() => (
    typeof window !== 'undefined' && (
      'ontouchstart' in window || window.navigator.maxTouchPoints > 0
    )
  ));
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [activeButtons, setActiveButtons] = useState(new Set());
  const baseRef = useRef(null);
  const joystickPointerIdRef = useRef(null);
  const lookPointerIdRef = useRef(null);
  const buttonPointersRef = useRef(new Map());
  const centerRef = useRef({ x: 0, y: 0 });
  const lastLookPosRef = useRef({ x: 0, y: 0 });
  const moveIntervalRef = useRef(null);
  const lastDirRef = useRef({ dx: 0, dy: 0 });

  const show = visible !== undefined ? visible : isTouchDevice;

  const RADIUS = 45;

  const stopEvent = useCallback((e) => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
  }, []);

  const capturePointer = useCallback((target, pointerId) => {
    try {
      target.setPointerCapture?.(pointerId);
    } catch {
      // Synthetic tests and older browsers may not expose capturable pointers.
    }
  }, []);

  const releasePointer = useCallback((target, pointerId) => {
    try {
      target.releasePointerCapture?.(pointerId);
    } catch {
      // Pointer capture may already be gone after cancel/lostcapture.
    }
  }, []);

  const updateJoystickFromPointer = useCallback((clientX, clientY) => {
    if (!centerRef.current) return;

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

  const handleJoystickStart = useCallback((e) => {
    stopEvent(e);
    if (joystickPointerIdRef.current !== null) return;
    joystickPointerIdRef.current = e.pointerId;
    capturePointer(e.currentTarget, e.pointerId);

    const rect = baseRef.current.getBoundingClientRect();
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    updateJoystickFromPointer(e.clientX, e.clientY);

    // Start continuous movement reporting
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    moveIntervalRef.current = setInterval(() => {
      if (onMove && (lastDirRef.current.dx !== 0 || lastDirRef.current.dy !== 0)) {
        onMove(lastDirRef.current.dx, lastDirRef.current.dy);
      }
    }, 16); // ~60fps
  }, [capturePointer, onMove, stopEvent, updateJoystickFromPointer]);

  const handleJoystickMove = useCallback((e) => {
    stopEvent(e);
    if (e.pointerId !== joystickPointerIdRef.current) return;
    updateJoystickFromPointer(e.clientX, e.clientY);
  }, [stopEvent, updateJoystickFromPointer]);

  const handleJoystickEnd = useCallback((e) => {
    stopEvent(e);
    if (e.pointerId !== joystickPointerIdRef.current) return;
    releasePointer(e.currentTarget, e.pointerId);
    joystickPointerIdRef.current = null;
    setKnobPos({ x: 0, y: 0 });
    lastDirRef.current = { dx: 0, dy: 0 };
    if (onMove) onMove(0, 0);
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  }, [onMove, releasePointer, stopEvent]);

  const handleLookStart = useCallback((e) => {
    if (!onLook || lookPointerIdRef.current !== null) return;
    stopEvent(e);
    lookPointerIdRef.current = e.pointerId;
    lastLookPosRef.current = { x: e.clientX, y: e.clientY };
    capturePointer(e.currentTarget, e.pointerId);
  }, [capturePointer, onLook, stopEvent]);

  const handleLookMove = useCallback((e) => {
    if (!onLook || e.pointerId !== lookPointerIdRef.current) return;
    stopEvent(e);
    const dx = e.clientX - lastLookPosRef.current.x;
    const dy = e.clientY - lastLookPosRef.current.y;
    lastLookPosRef.current = { x: e.clientX, y: e.clientY };
    onLook(dx, dy);
  }, [onLook, stopEvent]);

  const handleLookEnd = useCallback((e) => {
    if (e.pointerId !== lookPointerIdRef.current) return;
    stopEvent(e);
    releasePointer(e.currentTarget, e.pointerId);
    lookPointerIdRef.current = null;
  }, [releasePointer, stopEvent]);

  useEffect(() => {
    return () => {
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    };
  }, []);

  const handleButtonDown = useCallback((id) => (e) => {
    stopEvent(e);
    capturePointer(e.currentTarget, e.pointerId);
    const currentPointers = buttonPointersRef.current.get(id) ?? new Set();
    const wasInactive = currentPointers.size === 0;
    currentPointers.add(e.pointerId);
    buttonPointersRef.current.set(id, currentPointers);
    setActiveButtons(prev => new Set(prev).add(id));
    if (wasInactive && onAction) onAction(id);
  }, [capturePointer, onAction, stopEvent]);

  const handleButtonUp = useCallback((id) => (e) => {
    stopEvent(e);
    releasePointer(e.currentTarget, e.pointerId);
    if (!buttonPointersRef.current.has(id)) return;
    const currentPointers = buttonPointersRef.current.get(id);
    currentPointers.delete(e.pointerId);
    if (currentPointers.size > 0) {
      buttonPointersRef.current.set(id, currentPointers);
      return;
    }
    buttonPointersRef.current.delete(id);
    setActiveButtons(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (onActionUp) onActionUp(id);
  }, [onActionUp, releasePointer, stopEvent]);

  if (!show) return null;

  return (
    <>
      {onLook && (
        <div
          className="joystick-look-zone"
          aria-label="Kamera drehen"
          onPointerDown={handleLookStart}
          onPointerMove={handleLookMove}
          onPointerUp={handleLookEnd}
          onPointerCancel={handleLookEnd}
          onContextMenu={(e) => e.preventDefault()}
        />
      )}

      {/* Joystick — Left Side */}
      <div
        className="joystick-zone joystick-zone-left"
        onPointerDown={handleJoystickStart}
        onPointerMove={handleJoystickMove}
        onPointerUp={handleJoystickEnd}
        onPointerCancel={handleJoystickEnd}
        onContextMenu={(e) => e.preventDefault()}
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
        className="joystick-zone joystick-zone-right"
        onContextMenu={(e) => e.preventDefault()}
      >
        {buttons.map((btn) => {
          const isPressed = activeButtons.has(btn.id);

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
              onPointerDown={handleButtonDown(btn.id)}
              onPointerUp={handleButtonUp(btn.id)}
              onPointerCancel={handleButtonUp(btn.id)}
              onLostPointerCapture={handleButtonUp(btn.id)}
              aria-label={btn.ariaLabel || btn.label}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
