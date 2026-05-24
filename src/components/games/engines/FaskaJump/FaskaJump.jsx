import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const FaskaJump = ({ onExit }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    class MainScene extends Phaser.Scene {
      constructor() {
        super({ key: 'MainScene' });
      }

      preload() {
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Player texture
        g.fillStyle(0x00ccff, 1);
        g.fillRoundedRect(0, 0, 32, 32, 8);
        g.fillStyle(0xffffff, 1);
        g.fillRect(6, 8, 8, 8);
        g.fillRect(18, 8, 8, 8);
        g.fillStyle(0x000000, 1);
        g.fillRect(8, 10, 4, 4);
        g.fillRect(20, 10, 4, 4);
        g.generateTexture('player', 32, 32);
        g.clear();

        // Platform texture
        g.fillStyle(0x4caf50, 1);
        g.fillRoundedRect(0, 0, 120, 24, 4);
        g.lineStyle(2, 0x2e7d32, 1);
        g.strokeRoundedRect(0, 0, 120, 24, 4);
        g.generateTexture('platform', 120, 24);
        g.clear();

        // Ground texture
        g.fillStyle(0x795548, 1);
        g.fillRect(0, 0, 800, 60);
        g.fillStyle(0x4caf50, 1);
        g.fillRect(0, 0, 800, 10); // grass top
        g.generateTexture('ground', 800, 60);
        g.clear();

        // Block texture
        g.fillStyle(0xffc107, 1);
        g.fillRoundedRect(0, 0, 48, 48, 8);
        g.lineStyle(4, 0xff9800, 1);
        g.strokeRoundedRect(0, 0, 48, 48, 8);
        g.generateTexture('block', 48, 48);
        g.clear();

        // Enemy texture
        g.fillStyle(0xf44336, 1);
        g.fillRect(0, 0, 28, 28);
        g.fillStyle(0x000000, 1);
        g.fillRect(4, 6, 8, 4);
        g.fillRect(16, 6, 8, 4);
        g.fillRect(6, 18, 16, 4); // mouth
        g.generateTexture('enemy', 28, 28);
        g.clear();

        // Particle texture
        g.fillStyle(0xffffff, 1);
        g.fillCircle(4, 4, 4);
        g.generateTexture('particle', 8, 8);
        g.clear();
      }

      create() {
        this.score = 0;
        this.isTransitioning = false;
        
        this.cameras.main.setBackgroundColor('#1e1e38');

        this.platforms = this.physics.add.staticGroup();
        this.blocks = this.physics.add.staticGroup();
        this.enemies = this.physics.add.group();
        
        // Ground
        this.platforms.create(400, 570, 'ground');

        // Platforms
        const platCoords = [
            {x: 150, y: 450},
            {x: 650, y: 450},
            {x: 400, y: 320},
            {x: 150, y: 200},
            {x: 650, y: 200}
        ];
        platCoords.forEach(p => this.platforms.create(p.x, p.y, 'platform'));

        // Player
        this.player = this.physics.add.sprite(400, 500, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.player.setMaxVelocity(300, 800);

        // Inputs
        this.cursors = this.input.keyboard.createCursorKeys();

        // UI
        this.scoreText = this.add.text(20, 20, 'Punkte: 0', { 
            fontSize: '28px', 
            fill: '#00ffff', 
            fontFamily: 'Arial, sans-serif', 
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        
        this.questionText = this.add.text(400, 40, '', { 
            fontSize: '48px', 
            fill: '#ffeb3b', 
            fontFamily: 'Arial, sans-serif', 
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.player, this.blocks, this.hitBlock, null, this);
        this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this);

        // State
        this.blockTexts = [];
        this.generateQuestion();
        this.spawnEnemies();
        
        // Particles
        this.particles = this.add.particles(0, 0, 'particle', {
            lifespan: 800,
            speed: { min: 100, max: 300 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            emitting: false
        });
      }

      spawnEnemies() {
        this.enemies.clear(true, true);
        const enemyLocs = [
            {x: 150, y: 400},
            {x: 650, y: 400},
            {x: 400, y: 270}
        ];
        enemyLocs.forEach(loc => {
            let enemy = this.enemies.create(loc.x, loc.y, 'enemy');
            enemy.setBounce(0.2);
            enemy.setCollideWorldBounds(true);
            enemy.setVelocityX(Phaser.Math.Between(0, 1) ? 60 : -60);
        });
      }

      generateQuestion() {
        this.blocks.clear(true, true);
        this.blockTexts.forEach(t => t.destroy());
        this.blockTexts = [];
        this.isTransitioning = false;

        let num1 = Phaser.Math.Between(1, 10);
        let num2 = Phaser.Math.Between(1, 10);
        let op = Phaser.Math.Between(0, 1);
        let answer;
        let opStr;
        if (op === 0) {
            answer = num1 + num2;
            opStr = '+';
        } else {
            if (num1 < num2) { let t = num1; num1 = num2; num2 = t; }
            answer = num1 - num2;
            opStr = '-';
        }
        
        this.currentAnswer = answer;
        this.questionText.setText(`${num1} ${opStr} ${num2} = ?`);

        let answers = [answer];
        while(answers.length < 4) {
            let wrong = answer + Phaser.Math.Between(-5, 5);
            if(wrong !== answer && !answers.includes(wrong) && wrong >= 0) {
                answers.push(wrong);
            }
        }
        Phaser.Utils.Array.Shuffle(answers);

        const blockPositions = [
            {x: 250, y: 350},
            {x: 550, y: 350},
            {x: 150, y: 130},
            {x: 650, y: 130}
        ];

        for(let i=0; i<4; i++) {
            let b = this.blocks.create(blockPositions[i].x, blockPositions[i].y, 'block');
            b.answer = answers[i];
            
            let t = this.add.text(b.x, b.y, answers[i].toString(), { 
                fontSize: '24px', 
                fill: '#ffffff', 
                fontStyle: 'bold',
                fontFamily: 'Arial, sans-serif',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);
            this.blockTexts.push({ sprite: b, text: t });
        }
      }

      hitBlock(player, block) {
        if (this.isTransitioning) return;
        
        if (player.body.touching.up && block.body.touching.down) {
            this.isTransitioning = true;
            
            this.tweens.add({
                targets: block,
                y: block.y - 10,
                yoyo: true,
                duration: 100
            });

            if (block.answer === this.currentAnswer) {
                this.correctAnswer(block);
            } else {
                this.wrongAnswer(block);
            }
        }
      }

      correctAnswer(block) {
        this.score += 10;
        this.scoreText.setText('Punkte: ' + this.score);
        
        this.cameras.main.shake(200, 0.015);
        this.particles.emitParticleAt(block.x, block.y, 40);
        
        block.setTint(0x00ff00);
        
        this.time.delayedCall(600, () => {
            this.generateQuestion();
        });
      }

      wrongAnswer(block) {
        this.score = Math.max(0, this.score - 5);
        this.scoreText.setText('Punkte: ' + this.score);
        this.cameras.main.shake(200, 0.03);
        
        this.particles.setParticleTint(0xff0000);
        this.particles.emitParticleAt(block.x, block.y, 15);
        this.particles.setParticleTint(0xffffff); // reset

        block.setTint(0xff0000);
        
        this.time.delayedCall(400, () => {
            block.clearTint();
            this.isTransitioning = false;
        });
      }

      hitEnemy(player, enemy) {
        if (player.body.touching.down && enemy.body.touching.up) {
            // Jump on enemy
            enemy.destroy();
            player.setVelocityY(-450);
            this.score += 5;
            this.scoreText.setText('Punkte: ' + this.score);
            this.particles.emitParticleAt(enemy.x, enemy.y, 20);
            
            // respawn enemy after a while
            this.time.delayedCall(3000, () => {
                if (this.enemies) {
                    let newEnemy = this.enemies.create(400, 100, 'enemy');
                    newEnemy.setBounce(0.2);
                    newEnemy.setCollideWorldBounds(true);
                    newEnemy.setVelocityX(Phaser.Math.Between(0, 1) ? 60 : -60);
                }
            });
        } else {
            // Player hit by enemy
            player.setPosition(400, 500);
            player.setVelocity(0, 0);
            this.cameras.main.shake(300, 0.04);
            this.score = Math.max(0, this.score - 10);
            this.scoreText.setText('Punkte: ' + this.score);
        }
      }

      update() {
        const speed = 250;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-650);
        }

        this.enemies.getChildren().forEach(enemy => {
            if (enemy.body.blocked.left) {
                enemy.setVelocityX(60);
            } else if (enemy.body.blocked.right) {
                enemy.setVelocityX(-60);
            }
        });

        this.blockTexts.forEach(bt => {
            if (bt.sprite.active) {
                bt.text.setPosition(bt.sprite.x, bt.sprite.y);
            } else {
                bt.text.setVisible(false);
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
    <div style={{ position: 'relative', width: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <button 
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          zIndex: 10,
          padding: '10px 24px',
          backgroundColor: '#ff3366',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
          transition: 'transform 0.1s'
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Beenden
      </button>
      <div ref={gameRef} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
    </div>
  );
};

export default FaskaJump;
