import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const PALETTE = {
  LIGHTEST: 0x9bbc0f,
  LIGHT: 0x8bac0f,
  DARK: 0x306230,
  DARKEST: 0x0f380f,
  STR_LIGHTEST: '#9bbc0f',
  STR_LIGHT: '#8bac0f',
  STR_DARK: '#306230',
  STR_DARKEST: '#0f380f'
};

export default function FaskaLand({ onExit }) {
  const gameRef = useRef(null);

  useEffect(() => {
    class MainScene extends Phaser.Scene {
      constructor() {
        super({ key: 'MainScene' });
        this.score = 0;
        this.equation = { a: 0, b: 0, answer: 0 };
      }

      preload() {
        const g = this.add.graphics();
        
        // Player texture (Mario-ish block)
        g.fillStyle(PALETTE.DARKEST);
        g.fillRect(0, 0, 24, 24);
        g.fillStyle(PALETTE.LIGHTEST);
        g.fillRect(4, 4, 6, 6); // eye
        g.generateTexture('player', 24, 24);
        g.clear();

        // Platform texture
        g.fillStyle(PALETTE.DARK);
        g.fillRect(0, 0, 32, 32);
        g.lineStyle(2, PALETTE.DARKEST);
        g.strokeRect(0, 0, 32, 32);
        g.generateTexture('platform', 32, 32);
        g.clear();

        // Enemy texture (Goomba-ish)
        g.fillStyle(PALETTE.DARKEST);
        g.fillRect(0, 0, 20, 20);
        g.fillStyle(PALETTE.LIGHTEST);
        g.fillRect(4, 4, 4, 4);
        g.fillRect(12, 4, 4, 4);
        g.generateTexture('enemy', 20, 20);
        g.clear();

        // Collectible/Answer box texture
        g.lineStyle(2, PALETTE.DARKEST);
        g.fillStyle(PALETTE.LIGHT);
        g.fillRect(0, 0, 32, 32);
        g.strokeRect(0, 0, 32, 32);
        g.generateTexture('answerBox', 32, 32);
        g.clear();

        // Particle texture
        g.fillStyle(PALETTE.DARKEST);
        g.fillRect(0, 0, 4, 4);
        g.generateTexture('particle', 4, 4);
        g.clear();
      }

      create() {
        this.cameras.main.setBackgroundColor(PALETTE.LIGHTEST);
        
        // World bounds
        this.physics.world.setBounds(0, 0, 800, 600);

        // Platforms
        this.platforms = this.physics.add.staticGroup();
        // Ground
        for (let i = 0; i < 800; i += 32) {
          this.platforms.create(i + 16, 584, 'platform');
        }
        // Jump platforms
        const platCoords = [
          [200, 450], [232, 450], [264, 450],
          [550, 350], [582, 350], [614, 350],
          [100, 300], [132, 300], [164, 300],
          [350, 250], [382, 250], [414, 250]
        ];
        platCoords.forEach(c => this.platforms.create(c[0], c[1], 'platform'));

        // Player
        this.player = this.physics.add.sprite(50, 500, 'player');
        this.player.setBounce(0.0);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);

        // Enemies
        this.enemies = this.physics.add.group();
        this.spawnEnemy(400, 500);
        this.spawnEnemy(600, 500);
        this.spawnEnemy(400, 200);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this);

        // Answer Boxes
        this.answerBoxes = this.physics.add.staticGroup();
        this.physics.add.overlap(this.player, this.answerBoxes, this.collectAnswer, null, this);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();

        // UI
        this.scoreText = this.add.text(16, 16, 'Punkte: 0', { fontSize: '20px', fill: PALETTE.STR_DARKEST, fontFamily: 'monospace' });
        this.equationText = this.add.text(400, 32, '', { fontSize: '24px', fill: PALETTE.STR_DARKEST, fontFamily: 'monospace', fontStyle: 'bold' }).setOrigin(0.5, 0.5);

        this.generateEquation();

        // Particles - Use backwards compatible syntax for Phaser 3
        try {
          // Phaser 3.60+ syntax attempt
          this.particles = this.add.particles(0, 0, 'particle', {
              speed: { min: -150, max: 150 },
              angle: { min: 0, max: 360 },
              scale: { start: 1, end: 0 },
              blendMode: 'NORMAL',
              lifespan: 600,
              gravityY: 400,
              emitting: false
          });
        } catch (e) {
          // Fallback for Phaser < 3.60
          const particleManager = this.add.particles('particle');
          this.particles = particleManager.createEmitter({
              speed: { min: -150, max: 150 },
              angle: { min: 0, max: 360 },
              scale: { start: 1, end: 0 },
              blendMode: 'NORMAL',
              lifespan: 600,
              gravityY: 400,
              on: false
          });
        }
      }

      emitParticles(x, y, count) {
        if (this.particles.emitParticleAt) {
          this.particles.emitParticleAt(x, y, count); // 3.60+
        } else if (this.particles.explode) {
          this.particles.explode(count, x, y); // < 3.60
        }
      }

      spawnEnemy(x, y) {
        const enemy = this.enemies.create(x, y, 'enemy');
        enemy.setBounce(0);
        enemy.setVelocityX(50);
        enemy.direction = 1;
      }

      generateEquation() {
        this.equation.a = Phaser.Math.Between(1, 9);
        this.equation.b = Phaser.Math.Between(1, 9);
        this.equation.answer = this.equation.a + this.equation.b;
        this.equationText.setText(`${this.equation.a} + ${this.equation.b} = ?`);

        // Clear old boxes
        this.answerBoxes.getChildren().forEach(b => {
          if (b.textRef) b.textRef.destroy();
        });
        this.answerBoxes.clear(true, true);

        // Generate answers
        const answers = [this.equation.answer];
        while (answers.length < 3) {
          const wrong = Phaser.Math.Between(2, 18);
          if (!answers.includes(wrong)) {
            answers.push(wrong);
          }
        }
        
        Phaser.Utils.Array.Shuffle(answers);

        // Spawn locations for answer boxes above platforms
        const positions = [
          {x: 232, y: 380},
          {x: 582, y: 280},
          {x: 132, y: 230},
          {x: 382, y: 180},
          {x: 400, y: 500}
        ];
        Phaser.Utils.Array.Shuffle(positions);

        for (let i = 0; i < 3; i++) {
          const pos = positions[i];
          const box = this.answerBoxes.create(pos.x, pos.y, 'answerBox');
          box.answerValue = answers[i];
          
          const text = this.add.text(pos.x, pos.y, answers[i].toString(), {
            fontSize: '16px', fill: PALETTE.STR_DARKEST, fontFamily: 'monospace', fontStyle: 'bold'
          }).setOrigin(0.5, 0.5);
          
          box.textRef = text;
        }
      }

      hitEnemy(player, enemy) {
        if (player.body.velocity.y > 0 && player.y < enemy.y - 10) {
          // Stomp
          enemy.destroy();
          player.setVelocityY(-350);
          this.cameras.main.shake(100, 0.01);
          this.emitParticles(enemy.x, enemy.y, 15);
          // Spawn new enemy randomly to keep the game active
          this.time.delayedCall(1000, () => {
             this.spawnEnemy(Phaser.Math.Between(100, 700), 50);
          });
        } else {
          // Player hit
          player.setTint(PALETTE.DARK);
          this.cameras.main.shake(200, 0.02);
          this.score = Math.max(0, this.score - 5);
          this.scoreText.setText('Punkte: ' + this.score);
          player.setPosition(50, 500); // reset position
          setTimeout(() => {
            if (player && player.active) player.clearTint();
          }, 500);
        }
      }

      collectAnswer(player, box) {
        if (box.answerValue === this.equation.answer) {
          // Correct!
          this.score += 10;
          this.scoreText.setText('Punkte: ' + this.score);
          this.cameras.main.shake(150, 0.01);
          this.emitParticles(box.x, box.y, 40);
          
          // Flash effect
          const flash = this.add.rectangle(400, 300, 800, 600, PALETTE.LIGHTEST);
          this.tweens.add({
              targets: flash,
              alpha: 0,
              duration: 300,
              onComplete: () => flash.destroy()
          });

          this.generateEquation();
        } else {
          // Wrong!
          this.score = Math.max(0, this.score - 5);
          this.scoreText.setText('Punkte: ' + this.score);
          this.cameras.main.shake(200, 0.02);
          box.setTint(PALETTE.DARKEST);
          if (box.textRef) box.textRef.destroy();
          box.destroy();
          this.emitParticles(box.x, box.y, 10);
        }
      }

      update() {
        if (!this.player.active) return;

        if (this.cursors.left.isDown) {
          this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(200);
        } else {
          this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
          this.player.setVelocityY(-450);
        }

        // Simple enemy patrol
        this.enemies.getChildren().forEach(enemy => {
          if (enemy.body.blocked.right) {
            enemy.direction = -1;
            enemy.setVelocityX(-50);
          } else if (enemy.body.blocked.left) {
            enemy.direction = 1;
            enemy.setVelocityX(50);
          } else {
            enemy.setVelocityX(50 * enemy.direction);
          }
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
          gravity: { y: 800 },
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
    <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
      <button 
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 10,
          padding: '8px 16px',
          backgroundColor: '#0f380f',
          color: '#9bbc0f',
          border: '2px solid #306230',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '2px 2px 0px #306230'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#306230';
          e.target.style.color = '#9bbc0f';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#0f380f';
          e.target.style.color = '#9bbc0f';
        }}
      >
        Beenden
      </button>
      <div ref={gameRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
