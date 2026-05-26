import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

class FaskaScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FaskaScene' });
  }

  preload() {
    this.createTextures();
  }

  createTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Player (Idle)
    g.fillStyle(0xff2222); g.fillRect(8, 0, 16, 12); // Hat/Head
    g.fillStyle(0x2222ff); g.fillRect(6, 12, 20, 14); // Body
    g.fillStyle(0x000000); g.fillRect(6, 26, 6, 6); g.fillRect(20, 26, 6, 6); // Boots
    g.fillStyle(0xffdcb1); g.fillRect(10, 4, 12, 8); // Face
    g.generateTexture('player_idle', 32, 32);
    g.clear();

    // Cape
    g.fillStyle(0xffdd00);
    g.beginPath(); g.moveTo(0, 0); g.lineTo(16, 0); g.lineTo(24, 24); g.lineTo(4, 24); g.closePath();
    g.fillPath();
    g.generateTexture('cape', 24, 24);
    g.clear();

    // Platform
    g.fillStyle(0x388e3c); g.fillRect(0, 0, 32, 8); // Grass
    g.fillStyle(0x795548); g.fillRect(0, 8, 32, 24); // Dirt
    g.lineStyle(2, 0x2e7d32, 1); g.strokeRect(0, 0, 32, 32); // Inner Border
    g.fillStyle(0x5d4037); g.fillRect(8, 12, 4, 4); g.fillRect(20, 20, 4, 4); // Dirt details
    g.generateTexture('platform', 32, 32);
    g.clear();

    // Enemy (Goomba style)
    g.fillStyle(0xd84315); g.fillCircle(16, 16, 14); // Body
    g.fillStyle(0xffffff); g.fillCircle(10, 12, 4); g.fillCircle(22, 12, 4); // Eyes
    g.fillStyle(0x000000); g.fillCircle(10, 12, 2); g.fillCircle(22, 12, 2); // Pupils
    g.fillStyle(0x000000); g.fillRect(8, 26, 6, 6); g.fillRect(18, 26, 6, 6); // Feet
    g.generateTexture('enemy', 32, 32);
    g.clear();

    // Answer Box
    g.fillStyle(0xffca28); g.fillRect(0, 0, 40, 40);
    g.lineStyle(4, 0xffffff, 1); g.strokeRect(2, 2, 36, 36);
    g.fillStyle(0xffb300); g.fillRect(4, 4, 32, 32);
    g.generateTexture('answer_box', 40, 40);
    g.clear();

    // Particles
    g.fillStyle(0xffffff); g.fillRect(0, 0, 6, 6);
    g.generateTexture('particle_white', 6, 6);
    g.clear();
    g.fillStyle(0xffdd00); g.fillRect(0, 0, 6, 6);
    g.generateTexture('particle_yellow', 6, 6);
    g.clear();
    
    // Background Elements (Cloud/Hills)
    g.fillStyle(0xffffff, 0.7);
    g.fillCircle(20, 20, 20); g.fillCircle(40, 15, 25); g.fillCircle(60, 25, 15);
    g.generateTexture('cloud', 80, 50);
    g.clear();
  }

  create() {
    // Background sky
    this.add.rectangle(0, 0, 4000, 1200, 0x64b5f6).setOrigin(0).setScrollFactor(0);
    
    // Clouds parallax
    for (let i = 0; i < 20; i++) {
      this.add.sprite(Phaser.Math.Between(0, 3000), Phaser.Math.Between(50, 300), 'cloud')
        .setScrollFactor(0.2 + Math.random() * 0.3)
        .setScale(1 + Math.random());
    }

    // World bounds
    this.physics.world.setBounds(0, 0, 3000, 600);

    // Groups
    this.platforms = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group();
    this.answers = this.physics.add.group();

    // Generate Level
    for (let i = 0; i < 100; i++) {
      // Create pits
      if (i % 12 === 0 || i % 12 === 1) continue;
      this.platforms.create(i * 32 + 16, 584, 'platform');
      
      // Floating platforms
      if (i % 8 === 0) {
        this.platforms.create(i * 32 + 16, 450, 'platform');
        this.platforms.create(i * 32 + 48, 450, 'platform');
      }
      
      // Spawn enemies randomly on ground
      if (i > 10 && Math.random() > 0.7 && i % 12 > 2) {
        const enemy = this.enemies.create(i * 32 + 16, 500, 'enemy');
        enemy.setBounce(0.1);
        enemy.setVelocityX(Math.random() > 0.5 ? 50 : -50);
        enemy.body.setGravityY(500);
      }
    }

    // Player
    this.player = this.physics.add.sprite(100, 400, 'player_idle');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(400);

    // Cape Sprite (attached to player)
    this.cape = this.add.sprite(this.player.x, this.player.y, 'cape');
    this.cape.setOrigin(0.5, 0);
    this.hasCape = false;
    this.cape.visible = false;

    // Particles
    this.emitter = this.add.particles(0, 0, 'particle_white', {
      speed: { min: 50, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: 600,
      gravityY: 400,
      blendMode: 'ADD',
      emitting: false
    });
    
    this.starEmitter = this.add.particles(0, 0, 'particle_yellow', {
      speed: { min: 100, max: 300 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.5, end: 0 },
      lifespan: 1000,
      gravityY: 200,
      blendMode: 'ADD',
      emitting: false
    });

    // Collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.answers, this.platforms);

    this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
    this.physics.add.overlap(this.player, this.answers, this.handleCollectAnswer, null, this);

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      z: Phaser.Input.Keyboard.KeyCodes.Z,
      x: Phaser.Input.Keyboard.KeyCodes.X,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // Camera
    this.cameras.main.setBounds(0, 0, 3000, 600);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // Game State
    this.pMeter = 0;
    this.isSpinJumping = false;
    this.isInvulnerable = false;
    this.score = 0;

    // Math Educational Twist logic
    this.currentQuestion = {};
    
    // UI Elements
    this.uiContainer = this.add.container(0, 0).setScrollFactor(0);
    this.uiContainer.setDepth(100);

    const uiBg = this.add.rectangle(400, 30, 800, 60, 0x000000, 0.6);
    this.uiContainer.add(uiBg);

    this.scoreText = this.add.text(20, 15, 'SCORE: 0', { fontSize: '24px', fill: '#fff', fontStyle: 'bold', fontFamily: 'monospace' });
    this.uiContainer.add(this.scoreText);

    this.questionText = this.add.text(400, 15, 'Löse die Aufgabe!', { fontSize: '28px', fill: '#ffcc00', fontStyle: 'bold', fontFamily: 'monospace' }).setOrigin(0.5, 0);
    this.uiContainer.add(this.questionText);

    // P-Meter UI
    this.uiContainer.add(this.add.text(20, 50, 'P-METER:', { fontSize: '14px', fill: '#fff', fontFamily: 'monospace' }));
    this.pMeterBarBg = this.add.rectangle(90, 56, 100, 10, 0x333333).setOrigin(0, 0.5);
    this.pMeterBar = this.add.rectangle(90, 56, 0, 10, 0xff0000).setOrigin(0, 0.5);
    this.uiContainer.add(this.pMeterBarBg);
    this.uiContainer.add(this.pMeterBar);

    this.generateMathQuestion();

    // Spawn answers periodically
    this.time.addEvent({
      delay: 4000,
      callback: this.spawnAnswers,
      callbackScope: this,
      loop: true
    });
  }

  generateMathQuestion() {
    const ops = ['+', '-', '*'];
    const op = ops[Phaser.Math.Between(0, 2)];
    let a, b, ans;
    if (op === '+') { a = Phaser.Math.Between(5, 50); b = Phaser.Math.Between(5, 50); ans = a + b; }
    else if (op === '-') { a = Phaser.Math.Between(20, 100); b = Phaser.Math.Between(1, a); ans = a - b; }
    else { a = Phaser.Math.Between(2, 10); b = Phaser.Math.Between(2, 10); ans = a * b; }
    
    this.currentQuestion = { text: `${a} ${op === '*' ? 'x' : op} ${b} = ?`, ans };
    this.questionText.setText(`ZIEL: ${this.currentQuestion.text}`);
    this.questionText.setScale(1.2);
    this.tweens.add({
      targets: this.questionText,
      scale: 1,
      duration: 300,
      ease: 'Bounce.easeOut'
    });
  }

  spawnAnswers() {
    // Spawn 3 answer boxes around player's expected path
    const spawnX = Phaser.Math.Clamp(this.player.x + Phaser.Math.Between(100, 400), 50, 2950);
    const spawnY = -50;

    const answersToSpawn = [this.currentQuestion.ans];
    // Add two wrong answers
    while(answersToSpawn.length < 3) {
      const wrong = this.currentQuestion.ans + Phaser.Math.Between(-10, 10);
      if (!answersToSpawn.includes(wrong) && wrong >= 0) answersToSpawn.push(wrong);
    }
    
    Phaser.Utils.Array.Shuffle(answersToSpawn);

    answersToSpawn.forEach((ans, index) => {
      const box = this.add.sprite(0, 0, 'answer_box');
      const text = this.add.text(0, 0, ans.toString(), { fontSize: '20px', fill: '#000', fontStyle: 'bold', fontFamily: 'monospace' }).setOrigin(0.5);
      
      const container = this.add.container(spawnX + (index * 60) - 60, spawnY, [box, text]);
      container.setSize(40, 40);
      this.physics.world.enable(container);
      
      container.body.setBounce(0.8);
      container.body.setCollideWorldBounds(true);
      container.body.setVelocityX(Phaser.Math.Between(-30, 30));
      container.answerValue = ans;
      
      this.answers.add(container);

      // Cleanup after 10 seconds
      this.time.delayedCall(10000, () => {
        if (container.active) container.destroy();
      });
    });
  }

  handlePlayerEnemyCollision(player, enemy) {
    if (this.isInvulnerable) return;

    const stompThreshold = enemy.y - 10;
    
    if (player.body.velocity.y > 0 && player.y < stompThreshold) {
      // Stomp
      enemy.destroy();
      player.setVelocityY(this.isSpinJumping ? -500 : -350);
      this.cameras.main.shake(100, 0.005);
      this.emitter.emitParticleAt(enemy.x, enemy.y, 15);
      
      this.score += 50;
      this.scoreText.setText(`SCORE: ${this.score}`);
    } else {
      // Hurt
      this.takeDamage();
    }
  }

  handleCollectAnswer(player, answerContainer) {
    const val = answerContainer.answerValue;
    const x = answerContainer.x;
    const y = answerContainer.y;
    answerContainer.destroy();

    if (val === this.currentQuestion.ans) {
      // Correct!
      this.cameras.main.shake(150, 0.01);
      this.starEmitter.emitParticleAt(x, y, 30);
      
      this.score += 500;
      this.scoreText.setText(`SCORE: ${this.score}`);
      
      // Powerup!
      if (!this.hasCape) {
        this.hasCape = true;
        this.cape.visible = true;
        // Flash player
        this.tweens.add({
          targets: this.player,
          alpha: 0,
          yoyo: true,
          repeat: 3,
          duration: 100
        });
      }
      
      this.generateMathQuestion();
    } else {
      // Wrong!
      this.takeDamage();
    }
  }

  takeDamage() {
    if (this.isInvulnerable) return;

    this.cameras.main.shake(200, 0.02);
    
    if (this.hasCape) {
      // Lose cape
      this.hasCape = false;
      this.cape.visible = false;
      this.isInvulnerable = true;
      this.player.setAlpha(0.5);
      this.time.delayedCall(2000, () => {
        this.isInvulnerable = false;
        this.player.setAlpha(1);
      });
      // Knockback
      this.player.setVelocityY(-300);
      this.player.setVelocityX(this.player.flipX ? 200 : -200);
    } else {
      // Respawn logic (simplify as taking damage to 0)
      this.scene.restart();
    }
  }

  update(time, delta) {
    if (!this.player || !this.player.active) return;

    const isGrounded = this.player.body.touching.down || this.player.body.blocked.down;
    const cursors = this.cursors;

    // Movement
    if (cursors.left.isDown) {
      this.player.setAccelerationX(-800);
      this.player.flipX = true;
    } else if (cursors.right.isDown) {
      this.player.setAccelerationX(800);
      this.player.flipX = false;
    } else {
      this.player.setAccelerationX(0);
      this.player.setDragX(1200);
    }

    // Sprint & Max Velocity
    const isSprinting = this.keys.shift.isDown;
    const maxSpeed = isSprinting ? 350 : 200;
    this.player.setMaxVelocity(maxSpeed, 1000);

    // P-Meter Logic
    if (isSprinting && isGrounded && Math.abs(this.player.body.velocity.x) > 180) {
      this.pMeter = Math.min(this.pMeter + (delta * 0.1), 100);
    } else if (isGrounded) {
      this.pMeter = Math.max(this.pMeter - (delta * 0.2), 0);
    }
    
    // Update P-Meter UI
    this.pMeterBar.width = this.pMeter;
    this.pMeterBar.fillColor = this.pMeter === 100 ? 0x00ff00 : 0xff0000;

    // Jumping
    if (Phaser.Input.Keyboard.JustDown(this.keys.z) || Phaser.Input.Keyboard.JustDown(this.keys.space)) {
      if (isGrounded) {
        let jumpVelocity = -550;
        if (this.pMeter === 100) jumpVelocity = -800; // Fly if P-Meter is full
        this.player.setVelocityY(jumpVelocity);
        this.isSpinJumping = false;
      }
    }

    // Spin Jump
    if (Phaser.Input.Keyboard.JustDown(this.keys.x) && isGrounded) {
      this.player.setVelocityY(-500);
      this.isSpinJumping = true;
    }

    // Cape Glide Logic
    if (this.hasCape && !isGrounded && this.player.body.velocity.y > 0 && (this.keys.z.isDown || this.keys.space.isDown)) {
      this.player.body.gravity.y = -700; // Counteract the world gravity (1000) partially
      this.player.setMaxVelocity(maxSpeed, 150); // Slow fall speed
    } else {
      this.player.body.gravity.y = 0; // Return to standard gravity
    }

    // Visuals & Animations
    if (this.isSpinJumping && !isGrounded) {
      this.player.angle += this.player.flipX ? -20 : 20;
    } else {
      this.player.angle = 0;
    }

    // Update Cape position
    if (this.hasCape) {
      this.cape.setPosition(this.player.x + (this.player.flipX ? 8 : -8), this.player.y - 4);
      this.cape.flipX = this.player.flipX;
      // Animate cape slightly if flying or moving
      if (!isGrounded && this.player.body.velocity.y > 0) {
        this.cape.angle = this.player.flipX ? -30 : 30; // Glide spread
      } else {
        this.cape.angle = 0;
      }
    }

    // Pit death
    if (this.player.y > 600) {
      this.scene.restart();
    }

    // Enemy basic AI
    this.enemies.getChildren().forEach(enemy => {
      if (enemy.body.velocity.x === 0 && enemy.active) {
         // reverse direction if hitting a wall
         enemy.setVelocityX(Math.random() > 0.5 ? 50 : -50);
      }
    });
  }
}

export default function FaskaWorld({ onExit }) {
  const gameRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const config = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: 800,
      height: 600,
      pixelArt: true, // Super important for SNES retro feel!
      backgroundColor: '#000000',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 1000 },
          debug: false
        }
      },
      scene: [FaskaScene]
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      border: '4px solid #fff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 0 30px rgba(0, 0, 0, 0.8)',
      backgroundColor: '#000'
    }}>
      <button
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          zIndex: 1000,
          padding: '10px 20px',
          backgroundColor: '#e74c3c',
          color: '#ffffff',
          border: '3px solid #c0392b',
          borderRadius: '6px',
          fontWeight: '900',
          fontSize: '16px',
          cursor: 'pointer',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          transition: 'all 0.1s ease'
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Beenden
      </button>
      
      <div 
        ref={gameRef} 
        id="faska-world-game" 
        style={{ width: '800px', height: '600px', margin: '0 auto' }} 
      />
    </div>
  );
}
