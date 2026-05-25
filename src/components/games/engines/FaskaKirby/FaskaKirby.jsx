import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function FaskaKirby({ onExit }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 600 },
          debug: false
        }
      },
      scene: {
        preload,
        create,
        update
      }
    };

    let player;
    let platforms;
    let cursors;
    let enemies;
    let door;
    let gameInst;

    function preload() {
      const g = this.add.graphics();
      
      // Player (Pink floaty character)
      g.fillStyle(0xffb6c1, 1);
      g.fillCircle(16, 16, 16);
      g.fillStyle(0x000000, 1);
      g.fillCircle(10, 10, 2);
      g.fillCircle(22, 10, 2);
      g.generateTexture('kirby', 32, 32);
      g.clear();

      // Enemy
      g.fillStyle(0xff0000, 1);
      g.fillRect(0, 0, 32, 32);
      g.generateTexture('enemy', 32, 32);
      g.clear();

      // Platform
      g.fillStyle(0x8b4513, 1);
      g.fillRect(0, 0, 400, 32);
      g.generateTexture('platform', 400, 32);
      g.clear();
      
      // Small Platform
      g.fillStyle(0x8b4513, 1);
      g.fillRect(0, 0, 100, 32);
      g.generateTexture('platform_small', 100, 32);
      g.clear();

      // Door
      g.fillStyle(0x000000, 1);
      g.fillRect(0, 0, 40, 60);
      g.fillStyle(0x888888, 1);
      g.fillCircle(30, 30, 4);
      g.generateTexture('door', 40, 60);
      g.destroy();
    }

    function create() {
      this.physics.world.setBounds(0, 0, 1600, 600);
      
      // Background gradient
      this.add.rectangle(0, 0, 1600, 600, 0x87CEEB).setOrigin(0, 0);

      platforms = this.physics.add.staticGroup();
      
      // Ground
      for(let i=0; i<4; i++) {
        platforms.create(200 + i*400, 584, 'platform');
      }

      platforms.create(400, 450, 'platform_small');
      platforms.create(600, 350, 'platform_small');
      platforms.create(850, 250, 'platform_small');
      platforms.create(1100, 400, 'platform_small');

      door = this.physics.add.staticSprite(1400, 530, 'door');

      player = this.physics.add.sprite(100, 450, 'kirby');
      player.setBounce(0.1);
      player.setCollideWorldBounds(true);
      player.body.setGravityY(200);

      enemies = this.physics.add.group();
      const enemy1 = enemies.create(500, 550, 'enemy');
      enemy1.setVelocityX(50);
      const enemy2 = enemies.create(900, 550, 'enemy');
      enemy2.setVelocityX(-50);
      
      enemies.children.iterate((child) => {
        child.setCollideWorldBounds(true);
        child.setBounce(1);
      });

      this.physics.add.collider(player, platforms);
      this.physics.add.collider(enemies, platforms);
      this.physics.add.overlap(player, door, reachDoor, null, this);
      this.physics.add.collider(player, enemies, hitEnemy, null, this);

      cursors = this.input.keyboard.createCursorKeys();
      
      this.cameras.main.setBounds(0, 0, 1600, 600);
      this.cameras.main.startFollow(player);

      this.add.text(10, 10, 'Faska Kirby - Arrows to move, UP to float', { font: '16px Arial', fill: '#000' }).setScrollFactor(0);
      
      const exitBtn = this.add.text(740, 10, 'EXIT', { font: 'bold 16px Arial', fill: '#ff0000' }).setInteractive().setScrollFactor(0);
      exitBtn.on('pointerdown', () => {
         if (onExit) onExit();
      });
    }

    function hitEnemy(player, enemy) {
      if (player.body.velocity.y > 0 && player.y < enemy.y - 16) {
        enemy.destroy();
        player.setVelocityY(-300);
      } else {
        player.setTint(0xff0000);
        player.setVelocity(0, -200);
        this.physics.pause();
        setTimeout(() => {
          if (onExit) onExit();
        }, 1500);
      }
    }
    
    function reachDoor(player, door) {
      this.physics.pause();
      this.add.text(player.x - 50, player.y - 50, 'LEVEL CLEAR!', { font: '24px Arial', fill: '#ffff00' });
    }

    function update() {
      if (cursors.left.isDown) {
        player.setVelocityX(-200);
        player.flipX = true;
      } else if (cursors.right.isDown) {
        player.setVelocityX(200);
        player.flipX = false;
      } else {
        player.setVelocityX(0);
      }

      if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
        player.setVelocityY(-300);
      }
    }

    gameInst = new Phaser.Game(config);
    return () => {
      gameInst.destroy(true);
    };
  }, [onExit]);

  return <div ref={containerRef} className="w-full h-full flex justify-center items-center bg-black" />;
}
