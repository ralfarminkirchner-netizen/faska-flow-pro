import React, { useEffect } from 'react';
import { useGameStore } from './GameLogic';
import Phaser from 'phaser';

export default function NPCs({ scene }) {
  useEffect(() => {
    if (!scene || !scene.npcGroup) return;

    // Create Math NPC
    const mathNPC = scene.npcGroup.create(200, 200, 'math_npc');
    mathNPC.setImmovable(true);
    mathNPC.setDisplaySize(64, 64);

    // Create German NPC
    const germanNPC = scene.npcGroup.create(600, 200, 'german_npc');
    germanNPC.setImmovable(true);
    germanNPC.setDisplaySize(64, 64);

    const updateLoop = () => {
      const { interactPressed, activeNPC } = useGameStore.getState();
      
      if (interactPressed && !activeNPC && scene.playerGroup) {
        const player = scene.playerGroup.getChildren()[0];
        if (!player) return;

        const distMath = Phaser.Math.Distance.Between(player.x, player.y, mathNPC.x, mathNPC.y);
        const distGerman = Phaser.Math.Distance.Between(player.x, player.y, germanNPC.x, germanNPC.y);
        
        // Interaction radius check
        if (distMath < 100) {
          useGameStore.getState().setActiveNPC('math');
          useGameStore.getState().setInteractPressed(false);
        } else if (distGerman < 100) {
          useGameStore.getState().setActiveNPC('german');
          useGameStore.getState().setInteractPressed(false);
        }
      }
    };

    scene.events.on('update', updateLoop);

    return () => {
      scene.events.off('update', updateLoop);
      if (mathNPC) mathNPC.destroy();
      if (germanNPC) germanNPC.destroy();
    };
  }, [scene]);

  return null;
}
