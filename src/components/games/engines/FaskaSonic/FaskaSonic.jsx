import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const FaskaSonic = ({ onExit }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    class MainScene extends Phaser.Scene {
      constructor() {
        super({ key: 'MainScene' });
        this.targetWord = "HAUS";
        this.collectedLetters = "";
        this.wordList = ["HAUS", "HUND", "BAUM", "AUTO", "BALL", "MAUS", "KATZE", "SPIEL", "BUCH", "SCHULE", "LERNEN", "SONNE", "MOND", "STERN"];
        this.baseSpeed = 400;
        this.platforms = null;
        this.letters = null;
        this.droppedLetters = null;
        this.player = null;
        this.lastPlatformX = 0;
        this.lastPlatformY = 500;
        this.particles = null;
        this.score = 0;
      }

      preload() {
        // No external assets required
      }

      create() {
        this.cameras.main.setBackgroundColor('#050510');
        
        // Generate Textures
        this.generateTextures();

        // Physics groups
        this.platforms = this.physics.add.staticGroup();
        
        // Custom container groups don't have built-in group factories that configure physics
        // easily, so we manage lists and manually enable physics on them.
        this.letters = this.add.group();
        this.droppedLetters = this.add.group();

        // Player
        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.setCircle(16);
        this.player.setBounce(0.1);
        this.player.setFriction(0);
        this.player.setMaxVelocity(800, 1000);
        
        // Background elements (parallax)
        this.bgGraphics = this.add.graphics();
        this.bgGraphics.setScrollFactor(0); // we will manually draw the parallax
        
        // Add particle manager for spark explosions
        this.particles = this.add.particles(0, 0, 'spark', {
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 500,
            emitting: false
        });

        // Initial platform
        this.createPlatform(0, 500, 1200);
        
        // Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.droppedLetters, this.platforms);
        
        this.physics.add.overlap(this.player, this.letters, this.collectLetter, null, this);

        // Camera
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setFollowOffset(-200, 100);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // UI
        this.uiWord = this.add.text(400, 50, '', { font: 'bold 48px Arial', fill: '#ffffff', stroke: '#000000', strokeThickness: 4 }).setOrigin(0.5).setScrollFactor(0);
        this.uiCollected = this.add.text(400, 110, '', { font: 'bold 36px Arial', fill: '#00ff00', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5).setScrollFactor(0);
        this.uiScore = this.add.text(50, 50, 'Score: 0', { font: 'bold 24px Arial', fill: '#ffff00', stroke: '#000000', strokeThickness: 3 }).setScrollFactor(0);
        
        this.setNewWord();
      }

      generateTextures() {
        const graphics = this.make.graphics();
        
        // Player
        graphics.fillStyle(0x00aaff, 1);
        graphics.fillCircle(16, 16, 16);
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.strokeCircle(16, 16, 16);
        graphics.generateTexture('player', 32, 32);
        graphics.clear();

        // Platform
        graphics.fillStyle(0x1a0033, 1);
        graphics.fillRect(0, 0, 100, 40);
        graphics.lineStyle(4, 0x9900ff, 1);
        graphics.strokeRect(0, 0, 100, 40);
        // Add some neon grid lines inside
        graphics.lineStyle(1, 0xff00ff, 0.5);
        graphics.beginPath();
        graphics.moveTo(0, 20);
        graphics.lineTo(100, 20);
        graphics.moveTo(50, 0);
        graphics.lineTo(50, 40);
        graphics.strokePath();
        graphics.generateTexture('platform', 100, 40);
        graphics.clear();

        // Spark
        graphics.fillStyle(0xffff00, 1);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('spark', 8, 8);
        graphics.clear();
      }

      setNewWord() {
        this.targetWord = Phaser.Utils.Array.GetRandom(this.wordList);
        this.collectedLetters = "";
        this.updateUI();
      }

      updateUI() {
        let displayWord = "";
        for (let i = 0; i < this.targetWord.length; i++) {
            if (i < this.collectedLetters.length) {
                displayWord += this.collectedLetters[i] + " ";
            } else {
                displayWord += "_ ";
            }
        }
        this.uiWord.setText("WORT: " + this.targetWord);
        this.uiCollected.setText(displayWord);
        this.uiScore.setText("Score: " + this.score);
      }

      createPlatform(x, y, width) {
        const tiles = Math.ceil(width / 100);
        for(let i=0; i<tiles; i++) {
            const p = this.platforms.create(x + i*100 + 50, y, 'platform');
            p.refreshBody();
        }
        this.lastPlatformX = Math.max(this.lastPlatformX, x + width);
        this.lastPlatformY = y;
      }

      spawnTerrain() {
        if (this.player.x + 1200 > this.lastPlatformX) {
            const gap = Phaser.Math.Between(100, 250);
            const currentY = this.lastPlatformY;
            
            // Randomly go up or down a bit
            let newY = currentY + Phaser.Math.Between(-80, 80);
            newY = Phaser.Math.Clamp(newY, 300, 600);
            
            const width = Phaser.Math.Between(500, 1200);
            const startX = this.lastPlatformX + gap;
            
            this.createPlatform(startX, newY, width);
            this.spawnLetters(startX, newY - 120, width);
        }
      }

      createLetterContainer(x, y, letterChar, isDropped) {
        const container = this.add.container(x, y);
        container.setSize(40, 40);
        
        const graphics = this.add.graphics();
        const color = isDropped ? 0xff5555 : 0xffaa00;
        const alpha = isDropped ? 0.7 : 1;
        
        graphics.fillStyle(color, alpha);
        graphics.fillCircle(0, 0, 20);
        graphics.lineStyle(3, 0xffffff, alpha);
        graphics.strokeCircle(0, 0, 20);
        
        const text = this.add.text(0, 0, letterChar, { 
            font: 'bold 24px Arial', 
            fill: '#000000' 
        }).setOrigin(0.5);
        if (isDropped) text.setAlpha(alpha);
        
        container.add([graphics, text]);
        
        this.physics.world.enable(container);
        container.body.setCircle(20, -20, -20);
        
        return container;
      }

      spawnLetters(x, y, width) {
        const numLetters = Math.floor(width / 200);
        
        for (let i = 0; i < numLetters; i++) {
            const lx = x + 100 + i * 200;
            const ly = y - Phaser.Math.Between(0, 50);
            
            const nextNeededLetter = this.targetWord[this.collectedLetters.length];
            
            let letterChar = '';
            // 50% chance for correct letter, otherwise random A-Z
            if (nextNeededLetter && Math.random() < 0.5) {
                letterChar = nextNeededLetter;
            } else {
                letterChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }

            const container = this.createLetterContainer(lx, ly, letterChar, false);
            container.body.allowGravity = false;
            container.letterChar = letterChar;
            this.letters.add(container);
            
            // Hover animation
            this.tweens.add({
                targets: container,
                y: ly - 20,
                duration: Phaser.Math.Between(800, 1200),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
      }

      collectLetter(player, letterContainer) {
        // Prevent collecting if already processed
        if (!letterContainer.active) return;
        
        const char = letterContainer.letterChar;
        letterContainer.setActive(false);
        letterContainer.setVisible(false);
        letterContainer.body.enable = false;
        
        const expectedChar = this.targetWord[this.collectedLetters.length];
        
        if (char === expectedChar) {
            // Correct
            this.collectedLetters += char;
            this.score += 10;
            
            // Particle explosion
            this.particles.emitParticleAt(letterContainer.x, letterContainer.y, 30);
            
            // Flash screen green
            this.cameras.main.flash(200, 0, 255, 0, 0.2);

            if (this.collectedLetters === this.targetWord) {
                this.score += 100;
                this.setNewWord();
                this.cameras.main.flash(500, 100, 255, 100, 0.4);
                this.cameras.main.shake(300, 0.01);
                this.baseSpeed += 20; // Increase speed on success
            }
            this.updateUI();
        } else {
            // Wrong
            this.cameras.main.shake(200, 0.03);
            this.cameras.main.flash(200, 255, 0, 0, 0.4);
            
            if (this.collectedLetters.length > 0) {
                for (let i = 0; i < this.collectedLetters.length; i++) {
                    const dropChar = this.collectedLetters[i];
                    const drop = this.createLetterContainer(player.x, player.y - 20, dropChar, true);
                    
                    drop.body.setBounce(0.8, 0.8);
                    drop.body.collideWorldBounds = false;
                    drop.body.setVelocity(
                        Phaser.Math.Between(-300, 300), 
                        Phaser.Math.Between(-500, -200)
                    );
                    drop.body.setAngularVelocity(Phaser.Math.Between(-300, 300));
                    
                    this.droppedLetters.add(drop);

                    this.tweens.add({
                        targets: drop,
                        alpha: 0,
                        duration: 1000,
                        delay: 1000,
                        onComplete: () => drop.destroy()
                    });
                }
                this.collectedLetters = "";
                this.score = Math.max(0, this.score - 20);
                this.updateUI();
            }
        }
        
        // Remove from scene fully after a tiny delay just in case
        this.time.delayedCall(10, () => {
            letterContainer.destroy();
        });
      }

      drawBackground() {
        this.bgGraphics.clear();
        
        // Draw some grid lines scrolling based on camera
        const scrollX = this.cameras.main.scrollX;
        const width = 800;
        const height = 600;
        
        this.bgGraphics.lineStyle(1, 0x330066, 0.5);
        
        // Vertical lines
        const step = 100;
        const startX = scrollX - (scrollX % step);
        
        for (let x = startX; x < startX + width + step; x += step) {
            // Parallax effect: draw relative to camera
            const drawX = x - scrollX * 0.5; // Parallax factor 0.5
            // Need to wrap the drawX if it goes off screen for infinite effect
            const wrappedX = ((drawX % width) + width) % width;
            this.bgGraphics.beginPath();
            this.bgGraphics.moveTo(wrappedX, 0);
            this.bgGraphics.lineTo(wrappedX, height);
            this.bgGraphics.strokePath();
        }
      }

      update() {
        if (!this.player) return;

        // Death by falling
        if (this.player.y > 800) {
            this.player.setPosition(this.lastPlatformX - 400, 300);
            this.player.setVelocity(0, 0);
            this.cameras.main.shake(300, 0.05);
            this.score = Math.max(0, this.score - 50);
            this.baseSpeed = Math.max(400, this.baseSpeed - 50); // slow down on fall
            this.updateUI();
        }

        // Keep player moving forward (Auto Runner)
        // If player hits a wall, their X velocity drops, let's force it slightly
        if (this.player.body.velocity.x < this.baseSpeed) {
            this.player.setAccelerationX(500);
        } else {
            this.player.setAccelerationX(0);
        }
        
        // Player rotation effect based on speed
        this.player.rotation += this.player.body.velocity.x * 0.0005;

        // Jump
        if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.touching.down) {
            this.player.setVelocityY(-750);
        }

        this.spawnTerrain();
        this.drawBackground();
        
        // Cleanup old objects to prevent memory leaks
        const cleanupX = this.cameras.main.scrollX - 400;
        
        this.platforms.getChildren().forEach(p => {
            if (p.x < cleanupX) p.destroy();
        });
        
        this.letters.getChildren().forEach(l => {
            if (l.x < cleanupX) l.destroy();
        });
        
        this.droppedLetters.getChildren().forEach(d => {
            if (d.y > 1000 || d.x < cleanupX) d.destroy();
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
          gravity: { y: 1500 },
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
    <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', overflow: 'hidden', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
      <div ref={gameRef} style={{ width: '100%', height: '100%' }} />
      <button 
        onClick={onExit} 
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          padding: '12px 24px',
          fontSize: '18px',
          backgroundColor: 'rgba(255, 0, 85, 0.8)',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.5)',
          borderRadius: '8px',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 0, 85, 1)'}
        onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 0, 85, 0.8)'}
      >
        Beenden
      </button>
    </div>
  );
};

export default FaskaSonic;
