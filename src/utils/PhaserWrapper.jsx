import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

/**
 * A robust React wrapper for Phaser 3 games.
 * Handles React 18 Strict Mode double mounting, cleans up old instances,
 * and ensures the canvas is correctly attached to the container.
 */
export default function PhaserWrapper({ config, sceneClass }) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy any existing game instance to prevent duplicates
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    const finalConfig = {
      ...config,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: config.width || 800,
        height: config.height || 600,
        ...(config.scale || {})
      },
      parent: containerRef.current,
      scene: [sceneClass],
    };

    const game = new Phaser.Game(finalConfig);
    gameRef.current = game;

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [config, sceneClass]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
