import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

class FaskaFinalFantasyScene extends Phaser.Scene {
    constructor() {
        super('FaskaFinalFantasyScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#000');
        
        // Game State
        this.gameState = 'MENU'; // MENU, MATH, RESOLVING_MATH, PLAYER_ATTACK, ENEMY_ATTACK, GAME_OVER
        this.playerHp = 100;
        this.playerMaxHp = 100;
        this.enemyHp = 100;
        this.enemyMaxHp = 100;
        
        // Generate particle texture for explosions
        if (!this.textures.exists('particle')) {
            const gfx = this.make.graphics({x:0, y:0, add:false});
            gfx.fillStyle(0xffffff, 1);
            gfx.fillCircle(4, 4, 4);
            gfx.generateTexture('particle', 8, 8);
        }

        this.createBackground();
        this.createEntities();
        this.createUI();
        this.createMathUI();
        
        this.input.keyboard.on('keydown', this.handleKeydown, this);
        this.events.on('shutdown', () => {
            this.input.keyboard.off('keydown', this.handleKeydown, this);
        });
        
        // Idle Floating animation
        this.tweens.add({
            targets: [this.player, this.enemy],
            y: '-=10',
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createBackground() {
        const graphics = this.add.graphics();
        // gradient sky
        graphics.fillGradientStyle(0x0a0a2a, 0x0a0a2a, 0x1a1a3a, 0x1a1a3a, 1);
        graphics.fillRect(0, 0, 800, 600);
        
        // floor
        graphics.fillGradientStyle(0x0f3460, 0x0f3460, 0x000000, 0x000000, 1);
        graphics.fillRect(0, 350, 800, 250);

        // grid lines on floor (synthwave style)
        graphics.lineStyle(1, 0x00ffff, 0.2);
        for(let i=0; i<=800; i+=40) {
            graphics.moveTo(i, 350);
            graphics.lineTo(i - 200, 600);
            graphics.moveTo(i, 350);
            graphics.lineTo(i + 200, 600);
        }
        for(let j=350; j<=600; j+=25) {
            graphics.moveTo(0, j);
            graphics.lineTo(800, j);
        }
        graphics.strokePath();
    }
    
    createEntities() {
        // Enemy Container (left side)
        this.enemy = this.add.container(200, 250);
        const enemyGraphics = this.add.graphics();
        // Body
        enemyGraphics.fillStyle(0xe94560, 1);
        enemyGraphics.fillEllipse(0, -20, 60, 80);
        // Eyes
        enemyGraphics.fillStyle(0xffff00, 1);
        enemyGraphics.fillCircle(-15, -40, 5);
        enemyGraphics.fillCircle(15, -40, 5);
        // Horns
        enemyGraphics.fillStyle(0xffffff, 1);
        enemyGraphics.fillTriangle(-15, -60, -5, -60, -25, -90);
        enemyGraphics.fillTriangle(15, -60, 5, -60, 25, -90);
        // Shadow
        const shadow1 = this.add.graphics();
        shadow1.fillStyle(0x000000, 0.5);
        shadow1.fillEllipse(0, 40, 60, 15);
        this.enemy.add(shadow1);
        this.enemy.add(enemyGraphics);
        
        // Player Container (right side)
        this.player = this.add.container(600, 250);
        const playerGraphics = this.add.graphics();
        // Body
        playerGraphics.fillStyle(0x00d2ff, 1);
        playerGraphics.fillRoundedRect(-20, -40, 40, 60, 10);
        // Head
        playerGraphics.fillStyle(0xffffff, 1);
        playerGraphics.fillCircle(0, -55, 15);
        // Sword
        playerGraphics.fillStyle(0xdddddd, 1);
        playerGraphics.fillRect(-60, -20, 60, 5); // pointing left
        playerGraphics.fillStyle(0xaaaaaa, 1);
        playerGraphics.fillRect(-15, -28, 5, 21); // guard
        // Shield
        playerGraphics.fillStyle(0x0055ff, 1);
        playerGraphics.fillCircle(15, -10, 15);
        // Shadow
        const shadow2 = this.add.graphics();
        shadow2.fillStyle(0x000000, 0.5);
        shadow2.fillEllipse(0, 40, 50, 15);
        this.player.add(shadow2);
        this.player.add(playerGraphics);
        
        // Health Bars & Names
        this.enemyHealthBar = this.add.graphics();
        this.playerHealthBar = this.add.graphics();
        this.enemyHealthText = this.add.text(150, 130, 'Drache', {fontSize: '20px', fill: '#fff', fontStyle: 'bold'}).setOrigin(0.5);
        this.playerHealthText = this.add.text(650, 130, 'Held', {fontSize: '20px', fill: '#fff', fontStyle: 'bold'}).setOrigin(0.5);
        this.updateHealthBars();
    }

    updateHealthBars() {
        // Enemy Health
        this.enemyHealthBar.clear();
        this.enemyHealthBar.fillStyle(0xff0000, 1);
        this.enemyHealthBar.fillRect(100, 150, 100, 15);
        this.enemyHealthBar.fillStyle(0x00ff00, 1);
        this.enemyHealthBar.fillRect(100, 150, Math.max(0, 100 * (this.enemyHp / this.enemyMaxHp)), 15);
        this.enemyHealthBar.lineStyle(2, 0xffffff, 1);
        this.enemyHealthBar.strokeRect(100, 150, 100, 15);
        
        // Player Health
        this.playerHealthBar.clear();
        this.playerHealthBar.fillStyle(0xff0000, 1);
        this.playerHealthBar.fillRect(600, 150, 100, 15);
        this.playerHealthBar.fillStyle(0x00ff00, 1);
        this.playerHealthBar.fillRect(600, 150, Math.max(0, 100 * (this.playerHp / this.playerMaxHp)), 15);
        this.playerHealthBar.lineStyle(2, 0xffffff, 1);
        this.playerHealthBar.strokeRect(600, 150, 100, 15);
    }
    
    createUI() {
        this.menuContainer = this.add.container(0, 420);
        const menuBg = this.add.graphics();
        menuBg.fillStyle(0x000000, 0.8);
        menuBg.lineStyle(4, 0x0f3460, 1);
        menuBg.fillRect(20, 0, 760, 160);
        menuBg.strokeRect(20, 0, 760, 160);
        this.menuContainer.add(menuBg);

        const createBtn = (x, y, text, action) => {
            const btn = this.add.container(x, y);
            const bg = this.add.graphics();
            bg.fillStyle(0x1a1a2e, 1);
            bg.lineStyle(2, 0x00d2ff, 1);
            bg.fillRoundedRect(0, 0, 200, 60, 10);
            bg.strokeRoundedRect(0, 0, 200, 60, 10);
            
            const txt = this.add.text(100, 30, text, {
                fontSize: '28px', fill: '#fff', fontStyle: 'bold'
            }).setOrigin(0.5);
            
            btn.add(bg);
            btn.add(txt);
            
            const hitArea = new Phaser.Geom.Rectangle(0, 0, 200, 60);
            btn.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
            
            btn.on('pointerdown', () => {
                this.startMath(action);
            });
            btn.on('pointerover', () => {
                bg.clear();
                bg.fillStyle(0x0f3460, 1);
                bg.lineStyle(2, 0x00ffff, 1);
                bg.fillRoundedRect(0, 0, 200, 60, 10);
                bg.strokeRoundedRect(0, 0, 200, 60, 10);
            });
            btn.on('pointerout', () => {
                bg.clear();
                bg.fillStyle(0x1a1a2e, 1);
                bg.lineStyle(2, 0x00d2ff, 1);
                bg.fillRoundedRect(0, 0, 200, 60, 10);
                bg.strokeRoundedRect(0, 0, 200, 60, 10);
            });
            
            return btn;
        };

        this.menuContainer.add(createBtn(150, 50, '🗡️ Angriff', 'Angriff'));
        this.menuContainer.add(createBtn(450, 50, '✨ Magie', 'Magie'));
    }

    createMathUI() {
        this.mathContainer = this.add.container(400, 80).setVisible(false);
        
        const mathBg = this.add.graphics();
        mathBg.fillStyle(0x000000, 0.8);
        mathBg.lineStyle(2, 0x00ff00, 1);
        mathBg.fillRoundedRect(-150, -60, 300, 150, 10);
        mathBg.strokeRoundedRect(-150, -60, 300, 150, 10);
        this.mathContainer.add(mathBg);

        this.mathText = this.add.text(0, -20, '', { fontSize: '40px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        this.inputText = this.add.text(0, 30, '', { fontSize: '40px', fill: '#00ffff', fontStyle: 'bold' }).setOrigin(0.5);
        this.mathContainer.add(this.mathText);
        this.mathContainer.add(this.inputText);
        
        this.timerBar = this.add.graphics();
        this.mathContainer.add(this.timerBar);
    }

    startMath(action) {
        if (this.gameState !== 'MENU') return;
        this.gameState = 'MATH';
        this.menuContainer.setVisible(false);
        this.mathContainer.setVisible(true);
        
        // Generate multiplication problem
        const num1 = Phaser.Math.Between(2, 9);
        const num2 = Phaser.Math.Between(2, 9);
        this.correctAnswer = (num1 * num2).toString();
        this.currentInput = '';
        this.mathText.setText(`${num1} x ${num2} = ?`);
        this.inputText.setText('');
        
        this.timeLeft = 5000; // 5 seconds
        this.selectedAction = action;
    }

    handleKeydown(event) {
        if (this.gameState !== 'MATH') return;
        
        if (event.key.match(/^[0-9]$/)) {
            if (this.currentInput.length < 3) {
                this.currentInput += event.key;
                this.inputText.setText(this.currentInput);
            }
        } else if (event.key === 'Backspace') {
            this.currentInput = this.currentInput.slice(0, -1);
            this.inputText.setText(this.currentInput);
        } else if (event.key === 'Enter') {
            this.checkAnswer();
        }
    }

    checkAnswer() {
        this.gameState = 'RESOLVING_MATH';
        this.mathContainer.setVisible(false);
        
        let damage = 0;
        let isCritical = false;
        let textStr = '';
        let color = 0xffffff;
        
        if (this.currentInput === this.correctAnswer) {
            if (this.timeLeft > 2500) {
                damage = Phaser.Math.Between(30, 45);
                isCritical = true;
                textStr = 'KRITISCH!';
                color = 0xffff00;
            } else {
                damage = Phaser.Math.Between(15, 25);
                textStr = 'GUT!';
                color = 0x00ff00;
            }
        } else {
            damage = Phaser.Math.Between(1, 5);
            textStr = 'FALSCH/ZU LANGSAM!';
            color = 0xff0000;
        }
        
        this.showPopupText(400, 200, textStr, color);
        
        this.time.delayedCall(1000, () => {
            this.executePlayerAttack(damage, isCritical);
        });
    }

    update(time, delta) {
        if (this.gameState === 'MATH') {
            this.timeLeft -= delta;
            this.drawTimerBar();
            if (this.timeLeft <= 0) {
                this.currentInput = ''; // Force wrong answer
                this.checkAnswer();
            }
        }
    }

    drawTimerBar() {
        this.timerBar.clear();
        this.timerBar.fillStyle(0xff0000, 1);
        this.timerBar.fillRect(-120, 65, 240, 10);
        this.timerBar.fillStyle(0x00ff00, 1);
        const ratio = Math.max(0, this.timeLeft / 5000);
        this.timerBar.fillRect(-120, 65, 240 * ratio, 10);
    }
    
    executePlayerAttack(damage, isCritical) {
        this.gameState = 'PLAYER_ATTACK';
        
        if (this.selectedAction === 'Magie') {
            const magicBall = this.add.graphics();
            magicBall.fillStyle(0x00ffff, 1);
            magicBall.fillCircle(0, 0, 20);
            magicBall.x = this.player.x - 40;
            magicBall.y = this.player.y - 20;
            
            this.tweens.add({
                targets: magicBall,
                x: this.enemy.x,
                y: this.enemy.y,
                duration: 400,
                ease: 'Power2',
                onComplete: () => {
                    magicBall.destroy();
                    this.hitEnemy(damage, isCritical);
                    this.time.delayedCall(800, () => this.enemyTurn());
                }
            });
        } else {
            const startX = this.player.x;
            this.tweens.add({
                targets: this.player,
                x: this.enemy.x + 80,
                duration: 200,
                yoyo: true,
                ease: 'Power2',
                onYoyo: () => {
                    this.hitEnemy(damage, isCritical);
                },
                onComplete: () => {
                    this.time.delayedCall(800, () => this.enemyTurn());
                }
            });
        }
    }

    hitEnemy(damage, isCritical) {
        this.cameras.main.shake(isCritical ? 300 : 150, isCritical ? 0.02 : 0.01);
        this.enemyHp = Math.max(0, this.enemyHp - damage);
        this.updateHealthBars();
        
        this.showDamage(this.enemy.x, this.enemy.y - 50, damage, isCritical);
        this.createParticles(this.enemy.x, this.enemy.y, isCritical ? 0xffff00 : 0x00ffff);
        
        // Enemy hit flash
        const hitGraphics = this.add.graphics();
        hitGraphics.fillStyle(0xffffff, 0.5);
        hitGraphics.fillEllipse(this.enemy.x, this.enemy.y - 20, 80, 100);
        this.tweens.add({
            targets: hitGraphics,
            alpha: 0,
            duration: 200,
            onComplete: () => hitGraphics.destroy()
        });
    }

    enemyTurn() {
        if (this.enemyHp <= 0) {
            this.endGame(true);
            return;
        }
        
        this.gameState = 'ENEMY_ATTACK';
        const damage = Phaser.Math.Between(8, 20);
        
        // Enemy shoots fire
        const fireBall = this.add.graphics();
        fireBall.fillStyle(0xffaa00, 1);
        fireBall.fillCircle(0, 0, 20);
        fireBall.x = this.enemy.x + 40;
        fireBall.y = this.enemy.y - 20;
        
        this.tweens.add({
            targets: fireBall,
            x: this.player.x,
            y: this.player.y,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                fireBall.destroy();
                this.hitPlayer(damage);
                this.time.delayedCall(800, () => {
                    if (this.playerHp <= 0) {
                        this.endGame(false);
                    } else {
                        this.menuContainer.setVisible(true);
                        this.gameState = 'MENU';
                    }
                });
            }
        });
    }

    hitPlayer(damage) {
        this.cameras.main.shake(150, 0.015);
        this.playerHp = Math.max(0, this.playerHp - damage);
        this.updateHealthBars();
        this.showDamage(this.player.x, this.player.y - 50, damage, false);
        this.createParticles(this.player.x, this.player.y, 0xff0000);
        
        const hitGraphics = this.add.graphics();
        hitGraphics.fillStyle(0xffffff, 0.5);
        hitGraphics.fillRoundedRect(this.player.x - 30, this.player.y - 60, 60, 80, 10);
        this.tweens.add({
            targets: hitGraphics,
            alpha: 0,
            duration: 200,
            onComplete: () => hitGraphics.destroy()
        });
    }

    showPopupText(x, y, text, color) {
        const popup = this.add.text(x, y, text, { fontSize: '48px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5).setTint(color);
        this.tweens.add({
            targets: popup,
            y: y - 100,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => popup.destroy()
        });
    }

    showDamage(x, y, damage, isCritical) {
        const dmgText = this.add.text(x, y, `-${damage}`, {
            fontSize: isCritical ? '64px' : '40px',
            fill: isCritical ? '#ffff00' : '#ff0000',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: dmgText,
            y: y - 80,
            alpha: 0,
            duration: 1200,
            ease: 'Cubic.easeOut',
            onComplete: () => dmgText.destroy()
        });
    }

    createParticles(x, y, color) {
        const particles = this.add.particles(x, y, 'particle', {
            speed: { min: 100, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 1.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 800,
            tint: color
        });
        particles.explode(40);
        this.time.delayedCall(1000, () => {
            particles.destroy();
        });
    }

    endGame(playerWon) {
        this.gameState = 'GAME_OVER';
        this.menuContainer.setVisible(false);
        this.mathContainer.setVisible(false);
        
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.8);
        overlay.fillRect(0, 0, 800, 600);
        
        const title = playerWon ? 'SIEG!' : 'NIEDERLAGE!';
        const color = playerWon ? '#00ff00' : '#ff0000';
        
        this.add.text(400, 200, title, {
            fontSize: '80px', fill: color, fontStyle: 'bold', stroke: '#fff', strokeThickness: 4
        }).setOrigin(0.5);
        
        const restartBtn = this.add.text(400, 400, 'NOCHMAL SPIELEN', {
            fontSize: '36px', fill: '#fff', fontStyle: 'bold', backgroundColor: '#0f3460', padding: {x: 30, y: 15}
        }).setOrigin(0.5).setInteractive();
        
        restartBtn.on('pointerdown', () => {
            this.scene.restart();
        });
        restartBtn.on('pointerover', () => {
            restartBtn.setBackgroundColor('#e94560');
        });
        restartBtn.on('pointerout', () => {
            restartBtn.setBackgroundColor('#0f3460');
        });
    }
}

const FaskaFinalFantasy = ({ onExit }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    // Ensure we don't initialize Phaser multiple times in React Strict Mode
    if (gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'phaser-container',
      physics: {
        default: 'arcade',
      },
      scene: [FaskaFinalFantasyScene]
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', boxShadow: '0 0 20px rgba(0,0,0,0.5)', borderRadius: '8px', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      <button 
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          zIndex: 10,
          padding: '8px 16px',
          backgroundColor: '#e94560',
          color: 'white',
          border: '2px solid #fff',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        Beenden
      </button>
      <div id="phaser-container" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default FaskaFinalFantasy;
