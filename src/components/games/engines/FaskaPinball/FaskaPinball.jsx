import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const FaskaPinball = ({ onExit }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    class PinballScene extends Phaser.Scene {
      constructor() {
        super('PinballScene');
      }

      preload() {
        // Generate Textures
        const gfx = this.add.graphics();
        
        // Ball (glowy)
        gfx.fillStyle(0xffffff, 1);
        gfx.fillCircle(16, 16, 12);
        gfx.fillStyle(0xaaddff, 0.5);
        gfx.fillCircle(16, 16, 16);
        gfx.generateTexture('ball', 32, 32);
        gfx.clear();

        // Bumper
        gfx.fillStyle(0x222233, 1);
        gfx.fillCircle(40, 40, 38);
        gfx.lineStyle(6, 0x00ffff);
        gfx.strokeCircle(40, 40, 36);
        gfx.generateTexture('bumper', 80, 80);
        gfx.clear();

        // Flipper
        gfx.fillStyle(0xff3366, 1);
        gfx.fillRoundedRect(0, 0, 120, 24, 12);
        gfx.generateTexture('flipper', 120, 24);
        gfx.clear();

        // Wall
        gfx.fillStyle(0x334466, 1);
        gfx.fillRect(0, 0, 300, 20);
        gfx.generateTexture('wall', 300, 20);
        gfx.clear();
        
        // Particle
        gfx.fillStyle(0xffffff, 1);
        gfx.fillCircle(4, 4, 4);
        gfx.generateTexture('particle', 8, 8);
        gfx.clear();
      }

      create() {
        this.score = 0;
        this.multiplier = 1;

        // Background grid for visual flair
        this.add.grid(300, 400, 600, 800, 40, 40, 0x000000, 0, 0x00ffff, 0.05);

        // UI Text
        this.scoreText = this.add.text(20, 20, 'SCORE: 0', { 
          fontSize: '28px', fill: '#fff', fontStyle: 'bold', fontFamily: 'Arial' 
        }).setDepth(100);
        
        this.multiText = this.add.text(20, 56, 'MULT: x1', { 
          fontSize: '22px', fill: '#0ff', fontStyle: 'bold', fontFamily: 'Arial' 
        }).setDepth(100);
        
        this.add.text(300, 770, '← L-Flipper   R-Flipper →', {
            fontSize: '18px', fill: '#888', fontFamily: 'Arial'
        }).setOrigin(0.5).setDepth(100);

        this.add.text(300, 20, 'Nomen = Gut, Verben/Adjektive = Schlecht', {
            fontSize: '16px', fill: '#aaa', fontFamily: 'Arial'
        }).setOrigin(0.5, 0).setDepth(100);

        // Collision Categories
        const COLLISION_BALL = 0x0001;
        const COLLISION_STOPPER = 0x0002;
        const COLLISION_FLIPPER = 0x0004;

        this.matter.world.setBounds(0, 0, 600, 800, 200, true, true, true, false);

        // Slanted bottom walls to funnel ball to flippers
        this.matter.add.image(70, 660, 'wall', null, { 
            isStatic: true, 
            angle: Math.PI / 5,
            collisionFilter: { category: COLLISION_BALL, mask: 0xFFFF }
        });
        this.matter.add.image(530, 660, 'wall', null, { 
            isStatic: true, 
            angle: -Math.PI / 5,
            collisionFilter: { category: COLLISION_BALL, mask: 0xFFFF }
        });

        // Top angled walls to bounce ball nicely
        this.matter.add.image(100, 50, 'wall', null, { isStatic: true, angle: -Math.PI / 8 });
        this.matter.add.image(500, 50, 'wall', null, { isStatic: true, angle: Math.PI / 8 });

        const flipperOptions = {
            density: 0.1,
            friction: 0,
            restitution: 0.2,
            collisionFilter: {
                category: COLLISION_FLIPPER,
                mask: 0xFFFF // Collides with everything
            }
        };

        const stopperOptions = { 
            isStatic: true,
            render: { visible: false },
            collisionFilter: {
                category: COLLISION_STOPPER,
                mask: COLLISION_FLIPPER // Only collides with flippers
            }
        };

        // Left Flipper
        this.leftFlipper = this.matter.add.image(200, 720, 'flipper', null, flipperOptions);
        this.matter.add.constraint(
            this.matter.add.rectangle(150, 720, 2, 2, { isStatic: true, isSensor: true }),
            this.leftFlipper.body,
            0, 1,
            { pointA: { x: 0, y: 0 }, pointB: { x: -50, y: 0 } }
        );
        // Stoppers Left
        this.matter.add.circle(240, 680, 10, stopperOptions); // Top
        this.matter.add.circle(240, 740, 10, stopperOptions); // Bottom

        // Right Flipper
        this.rightFlipper = this.matter.add.image(400, 720, 'flipper', null, flipperOptions);
        this.matter.add.constraint(
            this.matter.add.rectangle(450, 720, 2, 2, { isStatic: true, isSensor: true }),
            this.rightFlipper.body,
            0, 1,
            { pointA: { x: 0, y: 0 }, pointB: { x: 50, y: 0 } }
        );
        // Stoppers Right
        this.matter.add.circle(360, 680, 10, stopperOptions); // Top
        this.matter.add.circle(360, 740, 10, stopperOptions); // Bottom

        // Bumpers (Educational Logic)
        this.bumpers = [];
        const bumperPositions = [
          {x: 300, y: 180}, {x: 180, y: 280}, {x: 420, y: 280}, 
          {x: 230, y: 420}, {x: 370, y: 420}, {x: 300, y: 540}
        ];

        const nouns = ["Apfel", "Baum", "Haus", "Katze", "Hund", "Auto", "Schule", "Mond", "Buch", "Tisch", "Feuer", "Wasser", "Stern", "Berg"];
        const others = ["laufen", "spielen", "schnell", "groß", "singen", "blau", "kalt", "lachen", "schön", "tanzen", "lesen", "klein", "heiß", "laut"];

        bumperPositions.forEach((pos) => {
          const isNoun = Math.random() > 0.5;
          const wordList = isNoun ? nouns : others;
          const word = wordList[Math.floor(Math.random() * wordList.length)];
          
          const bumper = this.matter.add.image(pos.x, pos.y, 'bumper', null, { 
            isStatic: true,
            restitution: 1.6,
            label: 'bumper',
            collisionFilter: { category: COLLISION_BALL, mask: 0xFFFF }
          });
          bumper.setCircle(38);
          
          const text = this.add.text(pos.x, pos.y, word, { 
              fontSize: '16px', fill: '#fff', fontStyle: 'bold', fontFamily: 'Arial' 
          }).setOrigin(0.5);
          
          bumper.wordData = { isNoun, textObj: text };
          this.bumpers.push(bumper);
        });

        // The Ball
        this.ball = this.matter.add.image(300, 50, 'ball', null, {
          restitution: 0.6,
          friction: 0.001,
          frictionAir: 0.001,
          density: 0.05,
          label: 'ball',
          collisionFilter: {
              category: COLLISION_BALL,
              mask: 0xFFFF ^ COLLISION_STOPPER // Collide with all EXCEPT stoppers
          }
        });
        this.ball.setCircle(14);
        
        // Ball Trail Effect
        this.add.particles(0, 0, 'particle', {
            speed: 0,
            lifespan: 300,
            scale: { start: 1, end: 0 },
            alpha: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            follow: this.ball
        });

        // Hit Particles
        this.particles = this.add.particles(0, 0, 'particle', {
          lifespan: 800,
          speed: { min: 100, max: 400 },
          scale: { start: 1, end: 0 },
          blendMode: 'ADD',
          emitting: false
        });

        // Inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Collisions
        this.matter.world.on('collisionstart', (event) => {
          event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;
            let bumperBody = null;
            if (bodyA.label === 'bumper' && bodyB.label === 'ball') bumperBody = bodyA;
            if (bodyB.label === 'bumper' && bodyA.label === 'ball') bumperBody = bodyB;
            
            if (bumperBody && bumperBody.gameObject && bumperBody.gameObject.wordData) {
              this.hitBumper(bumperBody.gameObject);
            }
          });
        });
      }

      hitBumper(bumper) {
        const data = bumper.wordData;
        if (data.isNoun) {
          this.multiplier = Math.min(20, this.multiplier + 1);
          this.score += 100 * this.multiplier;
          this.multiText.setText('MULT: x' + this.multiplier);
          this.multiText.setColor('#0f0');
          
          this.cameras.main.shake(150, 0.008);
          this.particles.setParticleTint(0x00ff00);
          this.particles.emitParticleAt(bumper.x, bumper.y, 20);
          
          bumper.setTint(0x00ff00);
          this.time.delayedCall(200, () => bumper.clearTint());
        } else {
          this.multiplier = 1;
          this.score += 10;
          this.multiText.setText('MULT: x1');
          this.multiText.setColor('#f00');
          
          this.cameras.main.shake(100, 0.004);
          this.particles.setParticleTint(0xff0000);
          this.particles.emitParticleAt(bumper.x, bumper.y, 10);

          bumper.setTint(0xff0000);
          this.time.delayedCall(200, () => bumper.clearTint());
        }
        
        this.scoreText.setText('SCORE: ' + this.score);
        
        this.tweens.add({
          targets: [bumper, data.textObj],
          scale: 1.3,
          duration: 100,
          yoyo: true
        });
        
        // Refresh word after a short delay
        const nouns = ["Apfel", "Baum", "Haus", "Katze", "Hund", "Auto", "Schule", "Mond", "Buch", "Tisch", "Feuer", "Wasser", "Stern", "Berg"];
        const others = ["laufen", "spielen", "schnell", "groß", "singen", "blau", "kalt", "lachen", "schön", "tanzen", "lesen", "klein", "heiß", "laut"];
        
        this.time.delayedCall(500, () => {
          const isNoun = Math.random() > 0.5;
          const wordList = isNoun ? nouns : others;
          const word = wordList[Math.floor(Math.random() * wordList.length)];
          data.isNoun = isNoun;
          data.textObj.setText(word);
        });
      }

      update() {
        // Flipper logic
        if (this.cursors.left.isDown) {
          this.leftFlipper.setAngularVelocity(-0.35);
        } else {
          this.leftFlipper.setAngularVelocity(0.15);
        }
        
        if (this.cursors.right.isDown) {
          this.rightFlipper.setAngularVelocity(0.35);
        } else {
          this.rightFlipper.setAngularVelocity(-0.15);
        }

        // Reset ball if it falls through
        if (this.ball.y > 850) {
          this.ball.setPosition(300, 50);
          this.ball.setVelocity(0, 0);
          this.multiplier = 1;
          this.multiText.setText('MULT: x1');
          this.multiText.setColor('#0ff');
          this.cameras.main.shake(300, 0.015);
        }
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: 600,
      height: 800,
      parent: gameRef.current,
      backgroundColor: '#0a0a1a',
      physics: {
        default: 'matter',
        matter: {
          gravity: { y: 2.5 },
          debug: false
        }
      },
      scene: PinballScene
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '600px', height: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <button
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          zIndex: 10,
          padding: '8px 16px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#ff3366',
          color: 'white',
          border: '2px solid #fff',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(255,51,102,0.5)',
          textTransform: 'uppercase'
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        Beenden
      </button>
      <div ref={gameRef} style={{ width: '100%', height: '100%', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 30px rgba(0,255,255,0.2)' }} />
    </div>
  );
};

export default FaskaPinball;
