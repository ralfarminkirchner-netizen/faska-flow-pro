import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function FaskaMotocross({ onExit }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      physics: {
        default: 'matter',
        matter: {
          gravity: { y: 1 },
          debug: false
        }
      },
      scene: {
        preload,
        create,
        update
      }
    };

    let cursors;
    let gameInst;
    let bikeBody, frontWheel, backWheel;
    let nitro = 100;
    let nitroText;
    let isFlipped = false;
    let lastAngle = 0;
    let flips = 0;
    let flipText;

    function preload() {
      const g = this.add.graphics();
      
      // Chassis
      g.fillStyle(0x0000ff, 1);
      g.fillRect(0, 0, 60, 20);
      g.generateTexture('chassis', 60, 20);
      g.clear();

      // Wheel
      g.fillStyle(0x333333, 1);
      g.fillCircle(15, 15, 15);
      g.fillStyle(0xaaaaaa, 1);
      g.fillCircle(15, 15, 5);
      g.generateTexture('wheel', 30, 30);
      g.destroy();
    }

    function create() {
      this.matter.world.setBounds(0, -2000, 10000, 2600);

      // Create Terrain
      let x = 0;
      let y = 500;
      for (let i = 0; i < 50; i++) {
        let width = Phaser.Math.Between(100, 400);
        let height = Phaser.Math.Between(-150, 150);
        
        let cx = x + width / 2;
        let cy = y + height / 2;
        
        let rect = this.matter.add.rectangle(cx, cy + 300, width, 600, { isStatic: true, friction: 0.8 });
        
        // draw terrain
        this.add.rectangle(cx, cy + 300, width, 600, 0x8b4513);
        
        x += width;
        y += height;
      }

      // Build Bike
      bikeBody = this.matter.add.image(200, 300, 'chassis');
      bikeBody.setBody({ type: 'rectangle', width: 60, height: 20 }, { mass: 2 });
      
      backWheel = this.matter.add.image(170, 320, 'wheel');
      backWheel.setBody({ type: 'circle', radius: 15 }, { mass: 1, friction: 0.9, restitution: 0.1 });
      
      frontWheel = this.matter.add.image(230, 320, 'wheel');
      frontWheel.setBody({ type: 'circle', radius: 15 }, { mass: 1, friction: 0.9, restitution: 0.1 });

      this.matter.add.joint(bikeBody, backWheel, 30, 0.4, { pointA: { x: -30, y: 10 } });
      this.matter.add.joint(bikeBody, frontWheel, 30, 0.4, { pointA: { x: 30, y: 10 } });
      
      cursors = this.input.keyboard.createCursorKeys();

      this.cameras.main.startFollow(bikeBody, false, 0.5, 0.5);
      this.cameras.main.setZoom(0.8);

      nitroText = this.add.text(10, 50, 'Nitro: 100', { font: '24px Arial', fill: '#ff0000' }).setScrollFactor(0);
      flipText = this.add.text(10, 80, 'Flips: 0', { font: '24px Arial', fill: '#ffff00' }).setScrollFactor(0);
      this.add.text(10, 110, 'Arrows to drive/tilt, SPACE for Nitro', { font: '18px Arial', fill: '#fff' }).setScrollFactor(0);

      const exitBtn = this.add.text(10, 10, 'EXIT', { font: 'bold 20px Arial', fill: '#ffffff', backgroundColor: '#ff0000' }).setInteractive().setScrollFactor(0);
      exitBtn.on('pointerdown', () => {
         if (onExit) onExit();
      });
    }

    function update() {
      // Bike controls
      if (cursors.right.isDown) {
        backWheel.applyForce({ x: 0.005, y: 0 });
      }
      if (cursors.left.isDown) {
        backWheel.applyForce({ x: -0.005, y: 0 });
      }
      
      // Air control
      if (cursors.up.isDown) {
        bikeBody.applyForce({ x: 0, y: -0.005 });
        bikeBody.setAngularVelocity(-0.1);
      }
      if (cursors.down.isDown) {
         bikeBody.setAngularVelocity(0.1);
      }
      
      // Nitro
      if (cursors.space.isDown && nitro > 0) {
        bikeBody.applyForce({ x: 0.02, y: -0.005 });
        nitro -= 0.5;
        nitroText.setText('Nitro: ' + Math.max(0, Math.floor(nitro)));
      }

      // Flip detection
      let angle = bikeBody.angle;
      if (Math.abs(angle - lastAngle) > 180) {
        // Crossed the 180 / -180 boundary
        isFlipped = !isFlipped;
        if (!isFlipped) {
          flips++;
          nitro = Math.min(100, nitro + 20); // reward nitro
          flipText.setText('Flips: ' + flips);
          nitroText.setText('Nitro: ' + Math.max(0, Math.floor(nitro)));
        }
      }
      lastAngle = angle;
      
      // Restart if fell down extremely far
      if (bikeBody.y > 2500) {
         if (onExit) onExit();
      }
    }

    gameInst = new Phaser.Game(config);
    return () => {
      gameInst.destroy(true);
    };
  }, [onExit]);

  return <div ref={containerRef} className="w-full h-full flex justify-center items-center bg-black" />;
}
