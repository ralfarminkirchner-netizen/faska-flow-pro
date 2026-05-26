import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function FaskaInvadersSwarm({ onExit }) {
  const gameContainerRef = useRef(null);
  
  useEffect(() => {
    class InvaderScene extends Phaser.Scene {
      constructor() {
        super({ key: 'InvaderScene' });
      }

      preload() {
        // No external assets required, we draw everything procedurally to work offline
      }

      create() {
        this.generateTextures();
        this.setupBackground();
        this.setupGameObjects();
        this.setupInput();
        this.startLevel();
      }

      generateTextures() {
        const g = this.make.graphics({x:0, y:0, add:false});
        
        // Player texture (Triangle / Ship)
        g.fillStyle(0x00ffff, 1);
        g.beginPath();
        g.moveTo(16, 0);
        g.lineTo(32, 32);
        g.lineTo(16, 24);
        g.lineTo(0, 32);
        g.closePath();
        g.fillPath();
        g.generateTexture('player', 32, 32);

        // Alien base texture (Retro blocky style)
        g.clear();
        g.fillStyle(0xff00ff, 1);
        g.fillRect(4, 0, 24, 8);
        g.fillRect(0, 8, 32, 16);
        g.fillRect(4, 24, 8, 8);
        g.fillRect(20, 24, 8, 8);
        g.generateTexture('alien', 32, 32);

        // Laser texture
        g.clear();
        g.fillStyle(0xffff00, 1);
        g.fillRect(0, 0, 4, 16);
        g.generateTexture('laser', 4, 16);

        // Particle texture
        g.clear();
        g.fillStyle(0xffffff, 1);
        g.fillCircle(4, 4, 4);
        g.generateTexture('particle', 8, 8);
        
        // Star texture
        g.clear();
        g.fillStyle(0xffffff, 1);
        g.fillRect(0, 0, 2, 2);
        g.generateTexture('star', 2, 2);
      }

      setupBackground() {
        this.cameras.main.setBackgroundColor('#000022');
        this.stars = this.add.particles(0, 0, 'star', {
            x: { min: 0, max: 800 },
            y: 0,
            lifespan: 4000,
            speedY: { min: 50, max: 200 },
            scale: { start: 0.5, end: 1.5 },
            alpha: { start: 0.2, end: 0.6 },
            quantity: 2,
            frequency: 100,
            blendMode: 'ADD'
        });
        this.stars.forward(4000);
      }

      setupGameObjects() {
        this.player = this.physics.add.sprite(400, 550, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBlendMode(Phaser.BlendModes.ADD);

        this.lasers = this.physics.add.group();
        this.aliens = this.physics.add.group();

        this.physics.add.overlap(this.lasers, this.aliens, this.handleCollision, null, this);

        this.wordText = this.add.text(400, 30, '', {
            fontFamily: 'Courier, monospace',
            fontSize: '28px',
            color: '#00ffff',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);

        this.words = ["PHASER", "REACT", "STATE", "PROPS", "HOOKS", "EFFECT", "LOGIC", "CODE", "SWARM"];
        this.currentWordIndex = 0;
        this.gameOver = false;
        this.lastShotTime = 0;
      }

      setupInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      }

      startLevel() {
        this.gameOver = false;
        this.targetWord = this.words[this.currentWordIndex];
        this.currentLetterIndex = 0;
        this.alienSpeed = 40 + (this.currentWordIndex * 15);
        this.alienDirection = 1;
        
        this.player.setPosition(400, 550);
        this.player.setVelocity(0, 0);
        this.player.setTint(0xffffff);

        this.updateUI();
        this.spawnAliens();
      }

      spawnAliens() {
        this.aliens.clear(true, true);
        
        const rows = 4;
        const cols = 7;
        const totalAliens = rows * cols;
        
        let letters = this.targetWord.split('');
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        
        // Fill the rest of the swarm with random letters
        while(letters.length < totalAliens) {
            letters.push(alphabet[Phaser.Math.Between(0, 25)]);
        }
        
        Phaser.Utils.Array.Shuffle(letters);
        
        let i = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = 120 + c * 90;
                const y = 100 + r * 60;
                const letter = letters[i];
                
                const sprite = this.add.sprite(0, 0, 'alien').setOrigin(0.5);
                const text = this.add.text(0, 0, letter, { 
                    fontFamily: 'Courier, monospace', 
                    fontSize: '22px', 
                    color: '#ffffff', 
                    fontStyle: 'bold' 
                }).setOrigin(0.5);
                
                const container = this.add.container(x, y, [sprite, text]);
                container.setSize(32, 32);
                container.setData('letter', letter);
                
                this.physics.add.existing(container);
                container.body.setOffset(-16, -16); // Center the physical body on the container's coordinates
                
                this.aliens.add(container);
                i++;
            }
        }
      }

      updateUI() {
        let wordStr = "";
        for (let i = 0; i < this.targetWord.length; i++) {
            if (i < this.currentLetterIndex) {
                // Already shot letters
                wordStr += `[${this.targetWord[i]}] `;
            } else if (i === this.currentLetterIndex) {
                // Next required letter
                wordStr += `>${this.targetWord[i]}< `;
            } else {
                // Future letters
                wordStr += `${this.targetWord[i]} `;
            }
        }
        this.wordText.setText("ZIELWORT:\n" + wordStr);
        this.wordText.setColor('#00ffff');
      }

      update(time, delta) {
        if (this.gameOver) return;

        // Player movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-350);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(350);
        } else {
            this.player.setVelocityX(0);
        }

        // Shooting
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.shoot();
        }

        // Alien Swarm movement
        let hitEdge = false;
        const children = this.aliens.getChildren();
        for (let i = 0; i < children.length; i++) {
            const alien = children[i];
            alien.x += this.alienSpeed * (delta / 1000) * this.alienDirection;
            
            // Check bounds (750 right edge, 50 left edge)
            if ((this.alienDirection === 1 && alien.x > 750) || 
                (this.alienDirection === -1 && alien.x < 50)) {
                hitEdge = true;
            }
        }

        if (hitEdge) {
            this.alienDirection *= -1;
            this.alienSpeed += 5; // Gradually increase difficulty natively
            
            for (let i = 0; i < children.length; i++) {
                const alien = children[i];
                alien.y += 25; // Descend
                alien.x += this.alienSpeed * (delta / 1000) * this.alienDirection * 2; // Extra push out of edge
                
                if (alien.y > 520) {
                    this.triggerGameOver();
                }
            }
        }

        // Cleanup off-screen lasers
        this.lasers.getChildren().forEach(laser => {
            if (laser.y < -10) {
                laser.destroy();
            }
        });
      }

      shoot() {
        if (this.time.now < this.lastShotTime + 300) return;
        this.lastShotTime = this.time.now;
        
        const laser = this.lasers.create(this.player.x, this.player.y - 20, 'laser');
        laser.setVelocityY(-600);
        laser.setBlendMode(Phaser.BlendModes.ADD);
      }

      handleCollision(laser, alienContainer) {
        laser.destroy();
        const letter = alienContainer.getData('letter');
        const expected = this.targetWord[this.currentLetterIndex];
        
        if (letter === expected) {
            // Success! Correct letter shot.
            this.createExplosion(alienContainer.x, alienContainer.y, 0x00ff00, 30);
            alienContainer.destroy();
            this.cameras.main.shake(100, 0.01);
            this.currentLetterIndex++;
            
            if (this.currentLetterIndex >= this.targetWord.length) {
                this.levelComplete();
            } else {
                this.updateUI();
            }
        } else {
            // Mistake! Wrong letter shot. Punish the player.
            this.createExplosion(alienContainer.x, alienContainer.y, 0xff0000, 10);
            this.cameras.main.shake(200, 0.02);
            
            // Educational Mechanic: Swarm descends and speeds up upon errors
            this.alienSpeed += 25; 
            
            const sprite = alienContainer.list[0];
            const text = alienContainer.list[1];
            sprite.setTint(0xff0000);
            text.setColor('#ff0000');
            
            // Flash red briefly then revert (alien survives)
            this.time.delayedCall(150, () => {
                if (sprite && sprite.active) {
                    sprite.setTint(0xff00ff);
                    text.setColor('#ffffff');
                }
            });
            
            // Force descend
            this.aliens.getChildren().forEach(a => {
                a.y += 10;
                if (a.y > 520) this.triggerGameOver();
            });
        }
      }

      createExplosion(x, y, color, count) {
        const emitter = this.add.particles(0, 0, 'particle', {
            speed: { min: 50, max: 250 },
            scale: { start: 1, end: 0 },
            tint: color,
            lifespan: 500,
            blendMode: 'ADD',
            emitting: false
        });
        emitter.explode(count, x, y);
        
        // Clean up emitter memory after explosion completes
        this.time.delayedCall(600, () => emitter.destroy());
      }

      levelComplete() {
        this.gameOver = true;
        this.wordText.setText("GUT GEMACHT!");
        this.wordText.setColor('#00ff00');
        this.lasers.clear(true, true);
        
        // Explode remaining aliens in a chain reaction
        this.aliens.getChildren().forEach(alien => {
            this.createExplosion(alien.x, alien.y, 0x00ffff, 15);
        });
        this.aliens.clear(true, true);
        
        // Prepare next word
        this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
        
        // Short pause then start next level
        this.time.delayedCall(2000, () => {
            this.startLevel();
        });
      }

      triggerGameOver() {
        if (this.gameOver) return;
        this.gameOver = true;
        
        this.cameras.main.shake(500, 0.05);
        this.wordText.setText("GAME OVER");
        this.wordText.setColor('#ff0000');
        
        this.player.setTint(0xff0000);
        this.createExplosion(this.player.x, this.player.y, 0xff0000, 100);
        
        // Restart scene entirely
        this.time.delayedCall(3000, () => {
            this.scene.restart();
        });
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainerRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },
      scene: InvaderScene
    };

    const game = new Phaser.Game(config);

    // Clean up Phaser game on unmount to prevent React strict-mode memory leaks
    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,255,255,0.2)' }}>
      {/* Absolute overlay button to exit the game */}
      <button 
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          zIndex: 10,
          padding: '10px 20px',
          backgroundColor: 'rgba(255, 0, 0, 0.8)',
          color: 'white',
          border: '2px solid #ff4444',
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: 'Courier, monospace',
          fontWeight: 'bold',
          fontSize: '16px',
          textTransform: 'uppercase',
          transition: 'all 0.2s ease',
          boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 0, 0, 1)';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
          e.target.style.transform = 'scale(1)';
        }}
      >
        Beenden
      </button>
      
      {/* Phaser Canvas Container */}
      <div ref={gameContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
