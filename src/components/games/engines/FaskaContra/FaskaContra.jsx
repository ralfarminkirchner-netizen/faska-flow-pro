import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create() {
    this.createTextures();

    this.health = 5;
    this.score = 0;
    this.gameOver = false;
    this.lastFired = 0;
    this.facingRight = true;

    // Background
    // Dark moody background
    this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);

    // Platforms
    this.platforms = this.physics.add.staticGroup();
    // Ground
    this.platforms.create(400, 584, 'ground').setScale(800/32, 1).refreshBody();
    // Middle platforms
    this.platforms.create(400, 450, 'platform').setScale(6, 1).refreshBody();
    this.platforms.create(150, 320, 'platform').setScale(4, 1).refreshBody();
    this.platforms.create(650, 320, 'platform').setScale(4, 1).refreshBody();
    this.platforms.create(400, 180, 'platform').setScale(4, 1).refreshBody();

    // Player
    this.player = this.physics.add.sprite(400, 500, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.1);
    this.player.setDragX(1000); // Friction

    // Groups
    this.bullets = this.physics.add.group();
    this.enemies = this.physics.add.group();

    // Colliders
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.bullets, this.platforms, (bullet) => {
        this.createParticles(bullet.x, bullet.y, 0xffff00, 5);
        bullet.destroy();
    });
    
    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.playerHitEnemy, null, this);

    // Inputs
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // UI
    this.scoreText = this.add.text(16, 16, 'Punkte: 0', { fontSize: '24px', fill: '#0f0', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 });
    this.healthText = this.add.text(16, 50, 'Leben: 5', { fontSize: '24px', fill: '#f00', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 });
    this.instructionText = this.add.text(400, 30, 'Schieße auf die FALSCHE Grammatik!', { fontSize: '22px', fill: '#0ff', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);

    // Spawning
    this.spawnTimer = this.time.addEvent({
      delay: 2500,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });
  }

  createTextures() {
    const g = this.add.graphics();
    
    // Player
    g.fillStyle(0x00ffcc, 1);
    g.fillRoundedRect(0, 0, 32, 48, 4);
    // Visor
    g.fillStyle(0xffffff, 1);
    g.fillRect(18, 10, 14, 10);
    // Gun
    g.fillStyle(0x555555, 1);
    g.fillRect(16, 26, 20, 8);
    g.generateTexture('player', 36, 48);
    g.clear();

    // Enemy
    g.fillStyle(0xe94560, 1);
    g.fillRoundedRect(0, 0, 32, 32, 4);
    // Eyes
    g.fillStyle(0x000000, 1);
    g.fillRect(6, 8, 6, 6);
    g.fillRect(20, 8, 6, 6);
    g.fillStyle(0xffffff, 1);
    g.fillRect(8, 10, 2, 2);
    g.fillRect(22, 10, 2, 2);
    // Mouth (angry)
    g.fillStyle(0x000000, 1);
    g.fillRect(10, 22, 12, 4);
    g.generateTexture('enemy', 32, 32);
    g.clear();

    // Bullet
    g.fillStyle(0xffff00, 1);
    g.fillCircle(8, 8, 8);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(8, 8, 4);
    g.generateTexture('bullet', 16, 16);
    g.clear();

    // Ground
    g.fillStyle(0x16213e, 1);
    g.fillRect(0, 0, 32, 32);
    g.lineStyle(2, 0x0f3460, 1);
    g.strokeRect(0, 0, 32, 32);
    g.lineStyle(2, 0x00ffcc, 1);
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(32, 0);
    g.strokePath();
    g.generateTexture('ground', 32, 32);
    g.clear();

    // Platform
    g.fillStyle(0x0f3460, 1);
    g.fillRect(0, 0, 32, 16);
    g.lineStyle(2, 0x00ffcc, 1);
    g.strokeRect(0, 0, 32, 16);
    g.generateTexture('platform', 32, 16);
    g.clear();

    g.destroy();
  }

  spawnEnemy() {
    if (this.gameOver) return;

    const spawnLeft = Math.random() > 0.5;
    const x = spawnLeft ? -32 : 832;
    const y = 80;

    const enemy = this.enemies.create(x, y, 'enemy');
    enemy.setBounce(0.2);
    
    const isCorrect = Math.random() > 0.5;
    enemy.isCorrect = isCorrect;
    
    const correctSentences = [
      'Ich gehe nach Hause.',
      'Das ist ein Buch.',
      'Wir essen Pizza.',
      'Du bist klug.',
      'Sie liest ein Buch.',
      'Der Hund bellt.',
      'Ich mag Eis.'
    ];
    
    const incorrectSentences = [
      'Ich gehen nach Hause.',
      'Das sind ein Buch.',
      'Wir isst Pizza.',
      'Du bin klug.',
      'Sie lest ein Buch.',
      'Der Hunde bellt.',
      'Ich mag Eiscreme viel.'
    ];

    const sentences = isCorrect ? correctSentences : incorrectSentences;
    const sentence = sentences[Math.floor(Math.random() * sentences.length)];
    
    const textLabel = this.add.text(0, 0, sentence, {
      fontSize: '16px',
      fill: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 4, y: 2 },
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5, 1);

    enemy.textLabel = textLabel;
    
    // Give them a random speed
    enemy.speed = Math.random() * 50 + 50; 
  }

  update(time) {
    if (this.gameOver) return;

    // Movement
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.player.setVelocityX(-250);
      this.player.flipX = true;
      this.facingRight = false;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.player.setVelocityX(250);
      this.player.flipX = false;
      this.facingRight = true;
    } else {
      this.player.setAccelerationX(0);
    }

    if ((this.cursors.up.isDown || this.wasd.up.isDown) && this.player.body.touching.down) {
      this.player.setVelocityY(-650);
      this.createParticles(this.player.x, this.player.y + 24, 0x00ffcc, 10);
    }

    // Shooting
    if ((this.cursors.space.isDown || this.wasd.space.isDown) && time > this.lastFired) {
      this.shoot();
      this.lastFired = time + 250;
    }

    // Update enemies
    this.enemies.getChildren().forEach((enemy) => {
      // Move towards player
      if (enemy.x < this.player.x - 10) {
        enemy.setVelocityX(enemy.speed);
      } else if (enemy.x > this.player.x + 10) {
        enemy.setVelocityX(-enemy.speed);
      }
      
      // Random jump if stuck or just randomly
      if (enemy.body.touching.down && (enemy.body.velocity.x === 0 || Math.random() < 0.005)) {
        enemy.setVelocityY(-550);
      }

      // Cleanup if they fall off
      if (enemy.y > 650) {
        if (enemy.textLabel) enemy.textLabel.destroy();
        enemy.destroy();
      }

      // Update text pos
      if (enemy.active && enemy.textLabel) {
        enemy.textLabel.setPosition(enemy.x, enemy.y - 20);
      }
    });

    // Clean up bullets
    this.bullets.getChildren().forEach(bullet => {
      if (bullet.x < -50 || bullet.x > 850) {
        bullet.destroy();
      }
    });
  }

  shoot() {
    const startX = this.facingRight ? this.player.x + 20 : this.player.x - 20;
    const bullet = this.bullets.create(startX, this.player.y + 5, 'bullet');
    bullet.body.allowGravity = false;
    bullet.setVelocityX(this.facingRight ? 800 : -800);
    
    this.cameras.main.shake(50, 0.002);
    
    // Muzzle flash
    this.createParticles(startX, this.player.y + 5, 0xffff00, 3);
  }

  hitEnemy(bullet, enemy) {
    bullet.destroy();
    
    if (enemy.isCorrect) {
      // Punish player
      this.takeDamage('Falsch! Das war korrektes Deutsch.');
    } else {
      // Reward player
      this.score += 10;
      this.scoreText.setText('Punkte: ' + this.score);
      this.createParticles(enemy.x, enemy.y, 0xe94560, 20);
      this.cameras.main.shake(100, 0.01);
      
      const pText = this.add.text(enemy.x, enemy.y - 40, '+10', { fontSize: '20px', fill: '#0f0', fontStyle: 'bold' }).setOrigin(0.5);
      this.tweens.add({
        targets: pText,
        y: pText.y - 50,
        alpha: 0,
        duration: 1000,
        onComplete: () => pText.destroy()
      });
    }

    if (enemy.textLabel) {
      enemy.textLabel.destroy();
    }
    enemy.destroy();
  }

  playerHitEnemy(player, enemy) {
    this.takeDamage('Ein Feind hat dich erwischt!');
    this.createParticles(enemy.x, enemy.y, 0xe94560, 20);
    
    if (enemy.textLabel) {
      enemy.textLabel.destroy();
    }
    enemy.destroy();
  }

  takeDamage(reason) {
    this.health -= 1;
    this.healthText.setText('Leben: ' + this.health);
    
    this.cameras.main.shake(250, 0.02);
    this.cameras.main.flash(200, 255, 0, 0);
    this.createParticles(this.player.x, this.player.y, 0xff0000, 15);

    // Show reason text floating up
    const rText = this.add.text(400, 200, reason, { 
      fontSize: '24px', 
      fill: '#fff', 
      backgroundColor: '#f00',
      padding: {x: 10, y: 5},
      fontStyle: 'bold' 
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: rText,
      y: rText.y - 50,
      alpha: 0,
      duration: 2000,
      onComplete: () => rText.destroy()
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.gameOver = true;
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.spawnTimer.remove();
    
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
    this.add.text(400, 250, 'SPIEL VORBEI', { fontSize: '64px', fill: '#ff3366', fontStyle: 'bold', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5);
    this.add.text(400, 330, 'Endstand: ' + this.score, { fontSize: '32px', fill: '#00ffcc' }).setOrigin(0.5);
    
    const restartBtn = this.add.text(400, 420, 'Nochmal spielen', { 
      fontSize: '28px', 
      fill: '#ffffff', 
      backgroundColor: '#0f3460', 
      padding: {x: 20, y: 10},
      stroke: '#00ffcc',
      strokeThickness: 2
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerover', () => restartBtn.setBackgroundColor('#e94560'))
    .on('pointerout', () => restartBtn.setBackgroundColor('#0f3460'))
    .on('pointerdown', () => {
      this.scene.restart();
    });
  }

  createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const rect = this.add.rectangle(x, y, 6, 6, color);
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 150 + 50;
      const targetX = x + Math.cos(angle) * speed;
      const targetY = y + Math.sin(angle) * speed;
      
      this.tweens.add({
        targets: rect,
        x: targetX,
        y: targetY,
        alpha: 0,
        scale: 0.5,
        duration: 800 + Math.random() * 400,
        ease: 'Power2',
        onComplete: () => rect.destroy()
      });
    }
  }
}

const FaskaContra = ({ onExit }) => {
  const gameContainer = useRef(null);
  
  useEffect(() => {
    if (!gameContainer.current) return;
    
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainer.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 1200 },
          debug: false
        }
      },
      scene: MainScene
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', overflow: 'hidden', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
      <button
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          zIndex: 10,
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#ff3366',
          color: 'white',
          border: '2px solid white',
          borderRadius: '8px',
          cursor: 'pointer',
          textTransform: 'uppercase',
          boxShadow: '0 4px 0px rgba(255,255,255,0.5)',
          transition: 'all 0.1s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(2px)';
          e.currentTarget.style.boxShadow = '0 2px 0px rgba(255,255,255,0.5)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 0px rgba(255,255,255,0.5)';
        }}
      >
        Beenden
      </button>
      <div ref={gameContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default FaskaContra;
