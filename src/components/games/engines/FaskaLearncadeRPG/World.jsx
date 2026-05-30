import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import Player from './Player';
import NPCs from './NPCs';

export default function World() {
  const containerRef = useRef(null);
  const [scene, setScene] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    class MainScene extends Phaser.Scene {
      constructor() {
        super('MainScene');
      }

      preload() {
        // Textures as requested
        this.load.image('grass', '/textures/grass_platform.png');
        this.load.image('wall', '/textures/castle_wall.png');
        // Player and NPCs
        this.load.image('player', '/animal-friends/cutouts/luna-hase.png'); 
        this.load.image('math_npc', '/animal-friends/cutouts/luna-hase.png');
        this.load.image('german_npc', '/animal-friends/cutouts/bruno-baer.png');
      }

      create() {
        this.physics.world.setBounds(0, 0, 800, 600);
        
        // Add grass background
        for (let x = 0; x < 800; x += 64) {
          for (let y = 0; y < 600; y += 64) {
            this.add.image(x + 32, y + 32, 'grass').setDisplaySize(64, 64);
          }
        }
        
        // Walls group
        this.walls = this.physics.add.staticGroup();
        
        // Top and bottom boundaries
        for (let x = 0; x <= 800; x += 64) {
          this.walls.create(x + 32, 32, 'wall').setDisplaySize(64, 64).refreshBody();
          this.walls.create(x + 32, 600 - 32, 'wall').setDisplaySize(64, 64).refreshBody();
        }
        // Left and right boundaries
        for (let y = 0; y <= 600; y += 64) {
          this.walls.create(32, y + 32, 'wall').setDisplaySize(64, 64).refreshBody();
          this.walls.create(800 - 32, y + 32, 'wall').setDisplaySize(64, 64).refreshBody();
        }

        this.playerGroup = this.physics.add.group();
        this.npcGroup = this.physics.add.group();
        
        this.physics.add.collider(this.playerGroup, this.walls);
        this.physics.add.collider(this.playerGroup, this.npcGroup);

        setScene(this);
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      transparent: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [MainScene]
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
      setScene(null);
    };
  }, []);

  return (
    <div className="flex justify-center items-center w-full max-w-[800px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border-4 border-indigo-500/30 bg-black">
      <div ref={containerRef} className="w-full h-full" />
      {scene && (
        <>
          <Player scene={scene} />
          <NPCs scene={scene} />
        </>
      )}
    </div>
  );
}
