import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function FaskaBomberman({ onExit }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 600,
      height: 520,
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

    let p1, p2;
    let solidWalls, destructibleBlocks, bombs, explosions;
    let cursors, wasd;
    let gameInst;

    const tileSize = 40;

    function preload() {
      const g = this.add.graphics();
      
      g.fillStyle(0x888888, 1);
      g.fillRect(0, 0, tileSize, tileSize);
      g.generateTexture('wall', tileSize, tileSize);
      g.clear();

      g.fillStyle(0x8b4513, 1);
      g.fillRect(0, 0, tileSize, tileSize);
      g.fillStyle(0xa0522d, 1);
      g.fillRect(5, 5, 30, 10);
      g.fillRect(5, 20, 10, 15);
      g.fillRect(20, 20, 15, 15);
      g.generateTexture('block', tileSize, tileSize);
      g.clear();

      g.fillStyle(0x000000, 1);
      g.fillCircle(tileSize/2, tileSize/2, 16);
      g.fillStyle(0xff0000, 1);
      g.fillCircle(tileSize/2, 8, 4);
      g.generateTexture('bomb', tileSize, tileSize);
      g.clear();

      g.fillStyle(0xffaa00, 0.8);
      g.fillRect(0, 0, tileSize, tileSize);
      g.fillStyle(0xff0000, 1);
      g.fillCircle(tileSize/2, tileSize/2, 10);
      g.generateTexture('explosion', tileSize, tileSize);
      g.clear();

      g.fillStyle(0x0000ff, 1);
      g.fillCircle(tileSize/2, tileSize/2, 14);
      g.generateTexture('p1', tileSize, tileSize);
      g.clear();

      g.fillStyle(0xff00ff, 1);
      g.fillCircle(tileSize/2, tileSize/2, 14);
      g.generateTexture('p2', tileSize, tileSize);
      g.destroy();
    }

    function create() {
      this.add.rectangle(0, 0, 600, 520, 0x228B22).setOrigin(0, 0);

      solidWalls = this.physics.add.staticGroup();
      destructibleBlocks = this.physics.add.staticGroup();
      bombs = this.physics.add.group();
      explosions = this.physics.add.group();

      const cols = 15;
      const rows = 13;
      
      for(let y=0; y<rows; y++){
        for(let x=0; x<cols; x++){
          if(x === 0 || x === cols-1 || y === 0 || y === rows-1 || (x%2===0 && y%2===0)){
            solidWalls.create(x*tileSize + tileSize/2, y*tileSize + tileSize/2, 'wall');
          } else {
            // safe zones for players
            if((x<=2 && y<=2) || (x>=cols-3 && y>=rows-3)) continue;
            if(Math.random() > 0.3) {
              destructibleBlocks.create(x*tileSize + tileSize/2, y*tileSize + tileSize/2, 'block');
            }
          }
        }
      }

      p1 = this.physics.add.sprite(tileSize*1.5, tileSize*1.5, 'p1');
      p1.setCollideWorldBounds(true);
      p1.bombCount = 1;
      p1.bombPower = 2;

      p2 = this.physics.add.sprite(600 - tileSize*1.5, 520 - tileSize*1.5, 'p2');
      p2.setCollideWorldBounds(true);
      p2.bombCount = 1;
      p2.bombPower = 2;

      this.physics.add.collider(p1, solidWalls);
      this.physics.add.collider(p1, destructibleBlocks);
      this.physics.add.collider(p1, bombs);
      
      this.physics.add.collider(p2, solidWalls);
      this.physics.add.collider(p2, destructibleBlocks);
      this.physics.add.collider(p2, bombs);

      this.physics.add.overlap(p1, explosions, () => killPlayer(1), null, this);
      this.physics.add.overlap(p2, explosions, () => killPlayer(2), null, this);
      this.physics.add.overlap(destructibleBlocks, explosions, (block) => block.destroy(), null, this);

      cursors = this.input.keyboard.createCursorKeys();
      wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        enter: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
      };

      const exitBtn = this.add.text(10, 5, 'EXIT', { font: 'bold 16px Arial', fill: '#ffffff', backgroundColor: '#ff0000' }).setInteractive().setDepth(100);
      exitBtn.on('pointerdown', () => {
         if (onExit) onExit();
      });
    }
    
    function killPlayer(playerNum) {
      if (onExit) {
        alert(`Player ${playerNum === 1 ? '2' : '1'} Wins!`);
        onExit();
      }
    }

    function placeBomb(scene, player) {
      if(player.bombCount <= 0) return;
      
      const bx = Math.floor(player.x / tileSize) * tileSize + tileSize/2;
      const by = Math.floor(player.y / tileSize) * tileSize + tileSize/2;
      
      const bomb = bombs.create(bx, by, 'bomb');
      bomb.setImmovable(true);
      bomb.body.moves = false;
      player.bombCount--;

      setTimeout(() => {
        bomb.destroy();
        player.bombCount++;
        explode(scene, bx, by, player.bombPower);
      }, 2000);
    }

    function explode(scene, bx, by, power) {
      createExplosion(scene, bx, by);
      
      const dirs = [[1,0], [-1,0], [0,1], [0,-1]];
      dirs.forEach(d => {
        for(let i=1; i<=power; i++){
          const ex = bx + d[0]*tileSize*i;
          const ey = by + d[1]*tileSize*i;
          
          let stopped = false;
          solidWalls.children.iterate(w => {
            if(w && Math.abs(w.x - ex) < 5 && Math.abs(w.y - ey) < 5) stopped = true;
          });
          if(stopped) break;
          
          let hitBlock = false;
          destructibleBlocks.children.iterate(b => {
            if(b && Math.abs(b.x - ex) < 5 && Math.abs(b.y - ey) < 5) {
              hitBlock = true;
              b.destroy();
            }
          });
          
          createExplosion(scene, ex, ey);
          if(hitBlock) break;
        }
      });
    }
    
    function createExplosion(scene, x, y) {
      const exp = explosions.create(x, y, 'explosion');
      setTimeout(() => exp.destroy(), 500);
    }

    function update() {
      const speed = 150;
      
      // P1 (WASD)
      p1.setVelocity(0);
      if (wasd.left.isDown) p1.setVelocityX(-speed);
      else if (wasd.right.isDown) p1.setVelocityX(speed);
      else if (wasd.up.isDown) p1.setVelocityY(-speed);
      else if (wasd.down.isDown) p1.setVelocityY(speed);
      
      if (Phaser.Input.Keyboard.JustDown(wasd.space)) placeBomb(this, p1);

      // P2 (Arrows)
      p2.setVelocity(0);
      if (cursors.left.isDown) p2.setVelocityX(-speed);
      else if (cursors.right.isDown) p2.setVelocityX(speed);
      else if (cursors.up.isDown) p2.setVelocityY(-speed);
      else if (cursors.down.isDown) p2.setVelocityY(speed);

      if (Phaser.Input.Keyboard.JustDown(wasd.enter)) placeBomb(this, p2);
    }

    gameInst = new Phaser.Game(config);
    return () => {
      gameInst.destroy(true);
    };
  }, [onExit]);

  return <div ref={containerRef} className="w-full h-full flex justify-center items-center bg-black" />;
}
