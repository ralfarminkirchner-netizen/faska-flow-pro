import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

export default function FaskaBike({ onExit }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 400,
      parent: containerRef.current,
      physics: {
        default: 'arcade',
        arcade: {
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
    let obstacles;
    let cursors;
    let gameInst;
    let tempBar;
    let speed = 0;
    let temperature = 0;
    let isOverheated = false;
    let lane = 1; // 0 to 3
    let z = 0;
    let zVelocity = 0;
    let distance = 0;
    let distanceText;
    let trackLines = [];

    const lanesY = [250, 290, 330, 370];

    function preload() {
      const g = this.add.graphics();
      
      // Bike
      g.fillStyle(0xff0000, 1);
      g.fillRect(0, 10, 40, 20);
      g.fillStyle(0x000000, 1);
      g.fillCircle(10, 30, 10);
      g.fillCircle(30, 30, 10);
      g.fillStyle(0xffffff, 1);
      g.fillRect(25, 0, 10, 10);
      g.generateTexture('bike', 40, 40);
      g.clear();

      // Ramp
      g.fillStyle(0xffa500, 1);
      g.beginPath();
      g.moveTo(0, 40);
      g.lineTo(60, 40);
      g.lineTo(60, 10);
      g.closePath();
      g.fillPath();
      g.generateTexture('ramp', 60, 40);
      g.clear();

      // Mud
      g.fillStyle(0x8b4513, 0.8);
      g.fillEllipse(40, 20, 80, 40);
      g.generateTexture('mud', 80, 40);
      g.destroy();
    }

    function create() {
      this.add.rectangle(0, 0, 800, 400, 0x87CEEB).setOrigin(0, 0);
      this.add.rectangle(0, 200, 800, 200, 0x228B22).setOrigin(0, 0); // Grass
      this.add.rectangle(0, 230, 800, 170, 0xd2b48c).setOrigin(0, 0); // Dirt track

      for (let i = 0; i < 4; i++) {
        let line = this.add.rectangle(0, lanesY[i] + 15, 800, 2, 0xffffff).setOrigin(0, 0);
        line.setAlpha(0.3);
      }

      obstacles = this.physics.add.group();
      
      player = this.add.sprite(100, lanesY[lane], 'bike');
      
      tempBar = this.add.rectangle(400, 30, 200, 20, 0x00ff00);
      distanceText = this.add.text(600, 20, 'Dist: 0', { font: '20px Arial', fill: '#000' });

      cursors = this.input.keyboard.createCursorKeys();

      const exitBtn = this.add.text(10, 10, 'EXIT', { font: 'bold 16px Arial', fill: '#ffffff', backgroundColor: '#ff0000' }).setInteractive();
      exitBtn.on('pointerdown', () => {
         if (onExit) onExit();
      });
      
      // Spawn obstacles continuously
      this.time.addEvent({
        delay: 1500,
        loop: true,
        callback: () => {
          if (speed > 5) {
            const obsLane = Phaser.Math.Between(0, 3);
            const type = Phaser.Math.Between(0, 1) === 0 ? 'ramp' : 'mud';
            const obs = obstacles.create(850, lanesY[obsLane], type);
            obs.obsLane = obsLane;
            obs.typeStr = type;
          }
        }
      });
    }

    function update() {
      if (isOverheated) {
        speed *= 0.95;
        temperature -= 2;
        if (temperature <= 0) {
          temperature = 0;
          isOverheated = false;
        }
      } else {
        if (cursors.right.isDown) {
          speed += 0.5;
          temperature += 0.5;
        } else if (cursors.left.isDown) {
          speed -= 0.5;
          temperature -= 1;
        } else {
          speed -= 0.2;
          temperature -= 0.5;
        }
      }
      
      if (temperature > 200) {
        isOverheated = true;
        temperature = 200;
        speed = speed / 2;
      }
      
      speed = Phaser.Math.Clamp(speed, 0, 25);
      temperature = Phaser.Math.Clamp(temperature, 0, 200);
      
      tempBar.width = temperature;
      tempBar.fillColor = temperature > 150 ? 0xff0000 : (temperature > 100 ? 0xffff00 : 0x00ff00);

      distance += speed * 0.1;
      distanceText.setText('Dist: ' + Math.floor(distance));

      // Jump physics
      if (z > 0) {
        zVelocity -= 1; // gravity
        z += zVelocity;
        if (z <= 0) {
          z = 0;
          zVelocity = 0;
          player.angle = 0;
        } else {
           if (cursors.left.isDown) player.angle -= 2;
           if (cursors.right.isDown) player.angle += 2;
        }
      } else {
        if (Phaser.Input.Keyboard.JustDown(cursors.up) && lane > 0) {
          lane--;
        } else if (Phaser.Input.Keyboard.JustDown(cursors.down) && lane < 3) {
          lane++;
        }
      }

      player.y = lanesY[lane] - z;

      // Obstacle collision
      obstacles.children.iterate((obs) => {
        if (obs) {
          obs.x -= speed;
          if (obs.x < -100) {
            obs.destroy();
          } else {
            // Collision logic
            if (obs.obsLane === lane && Math.abs(obs.x - player.x) < 30 && z === 0) {
              if (obs.typeStr === 'ramp') {
                zVelocity = 15;
                z = 1;
              } else if (obs.typeStr === 'mud') {
                speed *= 0.8;
              }
            }
          }
        }
      });
      
      if (z === 0 && player.angle !== 0) {
        // Crash landing
        if (Math.abs(player.angle) > 30) {
          speed = 0;
          temperature = 200;
          isOverheated = true;
        }
        player.angle = 0;
      }
    }

    gameInst = new Phaser.Game(config);
    return () => {
      gameInst.destroy(true);
    };
  }, [onExit]);

  return <div ref={containerRef} className="w-full h-full flex justify-center items-center bg-black" />;
}
