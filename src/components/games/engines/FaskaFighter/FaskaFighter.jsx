import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const FaskaFighter = ({ onExit }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    let game;
    let isGameOver = false;

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      },
      backgroundColor: '#1a1a2e'
    };

    game = new Phaser.Game(config);

    // Global game vars
    let player, enemy;
    let playerHealth = 100;
    let enemyHealth = 100;
    let playerHealthBar, enemyHealthBar;
    
    let words = [
      'FUNCTION', 'VARIABLE', 'COMPONENT', 'REACT', 'PHASER', 
      'JAVASCRIPT', 'PROGRAM', 'CODING', 'STATE', 'PROPS', 'EFFECT',
      'RENDER', 'CANVAS', 'CONTEXT', 'OBJECT', 'ARRAY'
    ];
    let currentWord = '';
    let typedWord = '';
    let enemyTimerText;
    let timeLeft = 10;
    let timerEvent;

    function preload() {
      // Create simple textures for particles
      const g = this.make.graphics({x: 0, y: 0, add: false});
      g.fillStyle(0xffffff, 1);
      g.fillCircle(4, 4, 4);
      g.generateTexture('particle', 8, 8);
    }

    function create() {
      const scene = this;

      // Background
      const bg = scene.add.graphics();
      bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
      bg.fillRect(0, 0, 800, 600);

      // Floor
      bg.fillStyle(0x0f3460, 1);
      bg.fillRect(0, 450, 800, 150);

      // Entities
      player = scene.add.container(200, 350);
      const pBody = scene.add.rectangle(0, 0, 40, 100, 0x4ecca3);
      const pHead = scene.add.circle(0, -60, 25, 0x4ecca3);
      const pArm = scene.add.rectangle(25, -20, 50, 15, 0x4ecca3).setOrigin(0, 0.5);
      player.add([pBody, pHead, pArm]);
      player.arm = pArm;
      player.startX = 200;

      enemy = scene.add.container(600, 350);
      const eBody = scene.add.rectangle(0, 0, 40, 100, 0xe94560);
      const eHead = scene.add.circle(0, -60, 25, 0xe94560);
      const eArm = scene.add.rectangle(-25, -20, 50, 15, 0xe94560).setOrigin(1, 0.5);
      enemy.add([eBody, eHead, eArm]);
      enemy.arm = eArm;
      enemy.startX = 600;

      // UI Texts
      scene.add.text(50, 30, 'PLAYER', { fontSize: '24px', fill: '#4ecca3', fontStyle: 'bold' });
      scene.add.text(650, 30, 'ENEMY', { fontSize: '24px', fill: '#e94560', fontStyle: 'bold' });
      
      playerHealthBar = scene.add.graphics();
      enemyHealthBar = scene.add.graphics();
      updateHealthBars(scene);

      enemyTimerText = scene.add.text(400, 90, '', { 
        fontSize: '32px', fill: '#e94560', fontStyle: 'bold', fontFamily: 'monospace' 
      }).setOrigin(0.5);

      scene.wordGroup = scene.add.container(400, 150);

      setNextWord(scene);

      // Keyboard input
      scene.input.keyboard.on('keydown', (event) => {
        if (isGameOver) return;
        
        if (event.keyCode >= 65 && event.keyCode <= 90) {
          const char = event.key.toUpperCase();
          if (char === currentWord[typedWord.length]) {
            typedWord += char;
            playerPunch(scene);
            
            if (typedWord === currentWord) {
              throwFireball(scene);
            } else {
               updateWordDisplay(scene);
            }
          } else {
            scene.cameras.main.shake(100, 0.005);
            // Red flash on text
            scene.wordGroup.list.forEach(c => c.setTint(0xff0000));
            scene.time.delayedCall(200, () => {
                if(scene.wordGroup && scene.wordGroup.list) {
                    scene.wordGroup.list.forEach(c => c.clearTint());
                }
            });
          }
        }
      });
      
      // Timer setup
      timerEvent = scene.time.addEvent({
        delay: 1000,
        callback: () => {
          if (isGameOver) return;
          timeLeft--;
          enemyTimerText.setText(`Attack in: ${timeLeft}s`);
          if (timeLeft <= 0) {
             enemyAttack(scene);
          }
        },
        callbackScope: scene,
        loop: true
      });
    }

    function update() {
    }

    function setNextWord(scene) {
      currentWord = Phaser.Math.RND.pick(words);
      typedWord = '';
      timeLeft = Math.floor(Math.random() * 3) + 5; // 5 to 7 seconds per word
      updateWordDisplay(scene);
      enemyTimerText.setText(`Attack in: ${timeLeft}s`);
    }

    function updateWordDisplay(scene) {
      if(scene.wordGroup) {
         scene.wordGroup.removeAll(true);
      }
      
      const charWidth = 30; // approx width for monospace 48px
      const totalWidth = currentWord.length * charWidth;
      let startX = -totalWidth / 2 + charWidth / 2;
      
      for(let i=0; i<currentWord.length; i++) {
          let isTyped = i < typedWord.length;
          let color = isTyped ? '#ffffff' : '#4ecca3';
          let alpha = isTyped ? 1 : 0.5;
          let scale = isTyped ? 1.2 : 1.0;
          let char = scene.add.text(startX, 0, currentWord[i], {
              fontSize: '48px', 
              fontFamily: 'monospace', 
              fill: color,
              fontStyle: 'bold'
          }).setOrigin(0.5).setAlpha(alpha).setScale(scale);
          startX += charWidth;
          scene.wordGroup.add(char);
      }
    }

    function updateHealthBars(scene) {
       playerHealthBar.clear();
       playerHealthBar.fillStyle(0x333333);
       playerHealthBar.fillRect(50, 60, 300, 20);
       playerHealthBar.fillStyle(0x4ecca3);
       playerHealthBar.fillRect(50, 60, 300 * (Math.max(0, playerHealth) / 100), 20);
       
       enemyHealthBar.clear();
       enemyHealthBar.fillStyle(0x333333);
       enemyHealthBar.fillRect(450, 60, 300, 20);
       enemyHealthBar.fillStyle(0xe94560);
       let eWidth = 300 * (Math.max(0, enemyHealth) / 100);
       enemyHealthBar.fillRect(750 - eWidth, 60, eWidth, 20);
    }

    function playerPunch(scene) {
        scene.tweens.add({
            targets: player,
            x: player.startX + 20,
            duration: 50,
            yoyo: true
        });
        scene.tweens.add({
            targets: player.arm,
            scaleX: 1.5,
            duration: 50,
            yoyo: true
        });
        
        createParticles(scene, player.x + 50, player.y - 20, 0x4ecca3, 5);
    }

    function throwFireball(scene) {
        const fireball = scene.add.circle(player.x + 50, player.y - 20, 20, 0x4ecca3);
        
        const trail = scene.add.particles(0, 0, 'particle', {
            speed: 50,
            scale: { start: 2, end: 0 },
            blendMode: 'ADD',
            tint: 0x4ecca3,
            lifespan: 300
        });
        trail.startFollow(fireball);
        
        scene.tweens.add({
            targets: fireball,
            x: enemy.x,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                fireball.destroy();
                trail.stop();
                scene.time.delayedCall(1000, () => trail.destroy());
                damageEnemy(scene, 20);
            }
        });
        
        setNextWord(scene);
    }
    
    function damageEnemy(scene, amount) {
        enemyHealth -= amount;
        updateHealthBars(scene);
        scene.cameras.main.shake(200, 0.015);
        createParticles(scene, enemy.x, enemy.y - 20, 0xffaa00, 40);
        
        scene.tweens.add({
            targets: enemy.list,
            alpha: 0.2,
            duration: 50,
            yoyo: true,
            repeat: 3
        });

        if (enemyHealth <= 0 && !isGameOver) {
            endGame(scene, 'YOU WIN!');
        }
    }

    function enemyAttack(scene) {
        scene.tweens.add({
            targets: enemy,
            x: enemy.startX - 100,
            duration: 200,
            yoyo: true,
            ease: 'Back.easeIn',
            onYoyo: () => {
                damagePlayer(scene, 15);
            }
        });
        scene.tweens.add({
            targets: enemy.arm,
            scaleX: 2,
            duration: 200,
            yoyo: true
        });
        setNextWord(scene);
    }

    function damagePlayer(scene, amount) {
        playerHealth -= amount;
        updateHealthBars(scene);
        scene.cameras.main.shake(250, 0.025);
        createParticles(scene, player.x, player.y - 20, 0xff0000, 40);
        
        scene.tweens.add({
            targets: player.list,
            alpha: 0.2,
            duration: 50,
            yoyo: true,
            repeat: 3
        });

        if (playerHealth <= 0 && !isGameOver) {
            endGame(scene, 'GAME OVER');
        }
    }
    
    function createParticles(scene, x, y, color, count) {
        const emitter = scene.add.particles(x, y, 'particle', {
            speed: { min: 100, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 2, end: 0 },
            blendMode: 'ADD',
            tint: color,
            lifespan: 600,
            quantity: count,
            emitting: false
        });
        emitter.explode();
        scene.time.delayedCall(1000, () => emitter.destroy());
    }
    
    function endGame(scene, text) {
        isGameOver = true;
        scene.add.text(400, 300, text, { fontSize: '80px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'monospace' }).setOrigin(0.5);
        if (scene.wordGroup) {
            scene.wordGroup.destroy();
        }
        enemyTimerText.setText('');
        if (timerEvent) {
            timerEvent.remove();
        }
    }

    return () => {
      if (game) {
        game.destroy(true);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', overflow: 'hidden', backgroundColor: '#1a1a2e', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
      <button 
        onClick={onExit} 
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          padding: '10px 20px',
          backgroundColor: '#e94560',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 10,
          fontWeight: 'bold',
          fontSize: '16px',
          textTransform: 'uppercase',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#ff5b77'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#e94560'}
      >
        Beenden
      </button>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default FaskaFighter;
