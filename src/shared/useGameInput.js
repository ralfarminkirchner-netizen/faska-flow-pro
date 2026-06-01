import { useEffect, useRef, useCallback } from 'react';

/**
 * Unified keyboard + touch input hook.
 * Maps WASD/Arrows to normalized dx/dy and Space/Enter to action buttons.
 * Also processes joystick input from MobileJoystick component.
 */
export default function useGameInput(store) {
  const keysRef = useRef(new Set());

  const updateFromKeyboard = useCallback(() => {
    const keys = keysRef.current;
    let dx = 0, dy = 0;

    if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) dx -= 1;
    if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) dx += 1;
    if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) dy -= 1;
    if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) dy += 1;

    // Normalize diagonal
    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
    }

    store.getState().setInput(dx, dy);
  }, [store]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current.add(e.key);
      updateFromKeyboard();

      // Action buttons
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        store.getState().setAction('A', true);
      }
      if (e.key === 'Shift') {
        store.getState().setAction('B', true);
      }
      if (e.key === 'e' || e.key === 'E') {
        store.getState().setAction('X', true);
      }
      if (e.key === 'q' || e.key === 'Q') {
        store.getState().setAction('Y', true);
      }
      // Pause
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        store.getState().pauseGame();
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current.delete(e.key);
      updateFromKeyboard();

      if (e.key === ' ' || e.key === 'Enter') {
        store.getState().setAction('A', false);
      }
      if (e.key === 'Shift') {
        store.getState().setAction('B', false);
      }
      if (e.key === 'e' || e.key === 'E') {
        store.getState().setAction('X', false);
      }
      if (e.key === 'q' || e.key === 'Q') {
        store.getState().setAction('Y', false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [store, updateFromKeyboard]);

  // Joystick handlers to pass to MobileJoystick
  const onMove = useCallback((dx, dy) => {
    store.getState().setInput(dx, dy);
  }, [store]);

  const onAction = useCallback((id) => {
    store.getState().setAction(id, true);
  }, [store]);

  const onActionUp = useCallback((id) => {
    store.getState().setAction(id, false);
  }, [store]);

  return { onMove, onAction, onActionUp };
}
