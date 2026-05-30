import React, { useEffect, useRef } from 'react';
import { useGameStore } from './GameLogic';

export default function Player({ scene }) {
  const spriteRef = useRef(null);

  useEffect(() => {
    if (!scene || !scene.playerGroup) return;

    // Create player sprite
    const sprite = scene.playerGroup.create(400, 300, 'player');
    sprite.setDisplaySize(48, 48);
    sprite.setCollideWorldBounds(true);
    sprite.setBounce(0.1);
    
    spriteRef.current = sprite;

    const updateLoop = () => {
      const { joystickVector } = useGameStore.getState();
      const speed = 250;
      if (spriteRef.current && spriteRef.current.active) {
        spriteRef.current.setVelocityX(joystickVector.x * speed);
        spriteRef.current.setVelocityY(joystickVector.y * speed);
      }
    };

    scene.events.on('update', updateLoop);

    return () => {
      scene.events.off('update', updateLoop);
      if (spriteRef.current) {
        spriteRef.current.destroy();
      }
    };
  }, [scene]);

  return null;
}
