import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const FaskaZelda = ({ onExit }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    class MainScene extends Phaser.Scene {
      constructor() {
        super({ key: 'MainScene' });
      }

      preload() {
        // Generate a particle texture
        const gfx = this.make.graphics({ x: 0, y: 0, add: false });
        gfx.fillStyle(0xffffff);
        gfx.fillCircle(8, 8, 8);
        gfx.generateTexture('particle', 16, 16);
        gfx.clear();

        // Generate a grid texture for the floor
        gfx.lineStyle(1, 0x222233, 1);
        gfx.strokeRect(0, 0, 40, 40);
        gfx.generateTexture('grid', 40, 40);
        gfx.destroy();
      }

      create() {
        this.cameras.main.setBackgroundColor('#11111a');
        
        // Floor pattern
        this.add.tileSprite(400, 300, 800, 600, 'grid').setAlpha(0.5);

        // Groups
        this.walls = this.physics.add.staticGroup();
        this.keys = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.doorGroup = this.physics.add.staticGroup();
        
        this.buildRoom();
        
        // Player
        this.player = this.add.rectangle(400, 500, 24, 24, 0x00ffcc);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        // Make the player body slightly smaller for generous collisions
        this.player.body.setSize(20, 20);
        
        // Player trail
        this.trail = this.add.particles(0, 0, 'particle', {
          speed: 0,
          scale: { start: 0.6, end: 0 },
          alpha: { start: 0.3, end: 0 },
          lifespan: 400,
          blendMode: 'ADD',
          tint: 0x00ffcc,
          frequency: 50
        });
        this.trail.startFollow(this.player);

        // UI
        this.uiText = this.add.text(400, 70, '', {
          fontSize: '36px',
          fill: '#fff',
          fontStyle: 'bold',
          stroke: '#000',
          strokeThickness: 4,
          shadow: { offsetX: 2, offsetY: 2, color: '#00ccff', blur: 10, fill: true }
        }).setOrigin(0.5);

        // Inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
          up: Phaser.Input.Keyboard.KeyCodes.W,
          down: Phaser.Input.Keyboard.KeyCodes.S,
          left: Phaser.Input.Keyboard.KeyCodes.A,
          right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // Colliders
        this.physics.add.collider(this.player, this.walls);
        this.physics.add.collider(this.enemies, this.walls);
        this.physics.add.collider(this.player, this.doorGroup, this.hitDoor, null, this);
        this.physics.add.overlap(this.player, this.keys, this.hitKey, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);

        this.generateLevel();
      }

      buildRoom() {
        this.walls.clear(true, true);
        this.doorGroup.clear(true, true);

        const wallColor = 0x222233;
        const wallGlow = 0x444466;

        // Draw basic shapes for walls to look nicer
        const createWall = (x, y, w, h) => {
          const wall = this.add.rectangle(x, y, w, h, wallColor);
          wall.setStrokeStyle(2, wallGlow);
          this.walls.add(wall);
        };

        // Top wall (split for door)
        createWall(175, 20, 350, 40);
        createWall(625, 20, 350, 40);

        // Bottom wall
        createWall(400, 580, 800, 40);

        // Left wall
        createWall(20, 300, 40, 600);

        // Right wall
        createWall(780, 300, 40, 600);

        // Door (in the gap on top wall, x:350 to 450 => center is 400, width is 100)
        this.door = this.add.rectangle(400, 20, 100, 40, 0xff3333);
        this.door.setStrokeStyle(4, 0xff0000);
        this.doorGroup.add(this.door);
        this.doorUnlocked = false;
      }

      generateLevel() {
        this.keys.clear(true, true);
        this.enemies.clear(true, true);
        
        this.doorUnlocked = false;
        this.door.setFillStyle(0xff3333);
        this.door.setStrokeStyle(4, 0xff0000);
        
        // Reset player pos with a cool entry effect
        this.player.setPosition(400, 500);
        this.player.setScale(0);
        this.tweens.add({
          targets: this.player,
          scale: 1,
          duration: 500,
          ease: 'Back.easeOut'
        });
        
        // Math problem
        const num1 = Phaser.Math.Between(5, 20);
        const num2 = Phaser.Math.Between(5, 20);
        const correctAnswer = num1 + num2;
        this.uiText.setText(`${num1} + ${num2} = ?`);
        this.uiText.setTint(0xffffff);
        
        let answers = [
          correctAnswer, 
          correctAnswer + Phaser.Math.Between(1, 5), 
          correctAnswer - Phaser.Math.Between(1, 5)
        ];
        // Shuffle
        answers = answers.sort(() => Math.random() - 0.5);
        
        const positions = [
          { x: 200, y: 300 },
          { x: 400, y: 300 },
          { x: 600, y: 300 }
        ];

        answers.forEach((ans, idx) => {
          const keyContainer = this.add.container(positions[idx].x, positions[idx].y);
          
          const bg = this.add.rectangle(0, 0, 50, 50, 0x00ccff);
          bg.setStrokeStyle(3, 0xffffff);
          
          const txt = this.add.text(0, 0, ans.toString(), { 
            fontSize: '28px', 
            fill: '#fff', 
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 3
          }).setOrigin(0.5);
          
          keyContainer.add([bg, txt]);
          keyContainer.setSize(50, 50);
          
          this.physics.add.existing(keyContainer);
          keyContainer.body.setImmovable(true);
          
          keyContainer.answer = ans;
          keyContainer.isCorrect = (ans === correctAnswer);
          
          // Floating animation on the visual parts
          this.tweens.add({
            targets: [bg, txt],
            y: '-=10',
            yoyo: true,
            repeat: -1,
            duration: 800 + Math.random() * 400,
            ease: 'Sine.easeInOut'
          });

          // Spinning glow effect
          this.tweens.add({
            targets: bg,
            angle: 360,
            repeat: -1,
            duration: 4000,
            ease: 'Linear'
          });
          
          this.keys.add(keyContainer);
        });
      }

      hitKey(player, keyContainer) {
        if (keyContainer.isCorrect) {
          // Correct!
          this.cameras.main.shake(200, 0.01);
          this.spawnParticles(keyContainer.x, keyContainer.y, 0x00ff00, 40);
          
          this.uiText.setText('Tür geöffnet!');
          this.uiText.setTint(0x00ff00);
          
          this.doorUnlocked = true;
          this.door.setFillStyle(0x00ffcc);
          this.door.setStrokeStyle(4, 0x00ff00);
          
          // Cool exit animation for remaining keys
          this.keys.getChildren().forEach(key => {
            this.tweens.add({
              targets: key,
              scale: 0,
              alpha: 0,
              duration: 300,
              onComplete: () => key.destroy()
            });
          });
        } else {
          // Wrong!
          this.cameras.main.shake(300, 0.02);
          this.spawnParticles(keyContainer.x, keyContainer.y, 0xff0000, 30);
          
          // Spawn enemy
          this.spawnEnemy(keyContainer.x, keyContainer.y);
          
          keyContainer.destroy();
        }
      }

      hitDoor(player, door) {
        if (this.doorUnlocked) {
          this.cameras.main.flash(500, 255, 255, 255);
          this.generateLevel();
        }
      }
      
      spawnEnemy(x, y) {
        const enemy = this.add.rectangle(x, y, 24, 24, 0xff00ff);
        enemy.setStrokeStyle(2, 0xffffff);
        this.physics.add.existing(enemy);
        enemy.body.setCollideWorldBounds(true);
        enemy.body.setBounce(1, 1);
        
        // Add particles to enemy
        const enemyTrail = this.add.particles(0, 0, 'particle', {
          speed: 0,
          scale: { start: 0.5, end: 0 },
          alpha: { start: 0.5, end: 0 },
          lifespan: 300,
          blendMode: 'ADD',
          tint: 0xff00ff
        });
        enemyTrail.startFollow(enemy);
        enemy.trail = enemyTrail;

        // Spin animation
        this.tweens.add({
          targets: enemy,
          angle: 360,
          repeat: -1,
          duration: 1000,
          ease: 'Linear'
        });

        this.enemies.add(enemy);
      }

      hitEnemy(player, enemy) {
        // Debounce hits
        if (player.isInvulnerable) return;
        
        this.cameras.main.shake(200, 0.03);
        
        player.isInvulnerable = true;
        player.fillColor = 0xff0000;
        
        // Invulnerability flickering
        this.tweens.add({
          targets: player,
          alpha: 0.2,
          yoyo: true,
          repeat: 5,
          duration: 100,
          onComplete: () => {
            player.alpha = 1;
            player.fillColor = 0x00ffcc;
            player.isInvulnerable = false;
          }
        });
        
        // Knockback
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        player.body.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500);
        
        // Briefly stun player
        player.isStunned = true;
        this.time.delayedCall(300, () => {
          player.isStunned = false;
        });

        // Destroy enemy upon collision
        this.spawnParticles(enemy.x, enemy.y, 0xff00ff, 20);
        if (enemy.trail) enemy.trail.destroy();
        enemy.destroy();
      }

      spawnParticles(x, y, color, count) {
        const emitter = this.add.particles(x, y, 'particle', {
          speed: { min: 100, max: 300 },
          angle: { min: 0, max: 360 },
          scale: { start: 1, end: 0 },
          blendMode: 'ADD',
          lifespan: 800,
          tint: color
        });
        emitter.explode(count);
      }

      update() {
        if (this.player.isStunned) return;

        const speed = 250;
        this.player.body.setVelocity(0);

        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
          velocityX = -speed;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
          velocityX = speed;
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
          velocityY = -speed;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
          velocityY = speed;
        }
        
        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
          velocityX *= 0.7071;
          velocityY *= 0.7071;
        }

        this.player.body.setVelocity(velocityX, velocityY);

        // Enemy AI (move towards player)
        this.enemies.getChildren().forEach(enemy => {
          this.physics.moveToObject(enemy, this.player, 120);
        });
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
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
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', boxShadow: '0 0 20px rgba(0,0,0,0.5)', borderRadius: '8px', overflow: 'hidden' }}>
      <div ref={gameRef} />
      <button
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          padding: '10px 20px',
          fontSize: '18px',
          fontWeight: 'bold',
          backgroundColor: '#ff4444',
          color: 'white',
          border: '2px solid #fff',
          borderRadius: '8px',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 4px 6px rgba(0,0,0,0.4)',
          textTransform: 'uppercase'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#ff6666'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#ff4444'}
      >
        Beenden
      </button>
    </div>
  );
};

export default FaskaZelda;
