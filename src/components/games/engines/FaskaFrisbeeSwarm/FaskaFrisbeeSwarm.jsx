import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const FaskaFrisbeeSwarm = ({ onExit }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    class MainScene extends Phaser.Scene {
      constructor() {
        super({ key: 'MainScene' });
      }

      init() {
        this.score = 0;
        this.wind = new Phaser.Math.Vector2(0, 0);
        this.isAiming = false;
        this.isFlying = false;
        this.startDragPoint = new Phaser.Math.Vector2();
        this.endDragPoint = new Phaser.Math.Vector2();
      }

      create() {
        this.cameras.main.setBackgroundColor('#2e8b57'); // Park green

        // Create trees
        this.trees = [];
        for (let i = 0; i < 15; i++) {
          const x = Phaser.Math.Between(0, 800);
          const y = Phaser.Math.Between(0, 600);
          const tree = this.drawTree(x, y);
          tree.setDepth(1);
        }

        this.generateTextures();

        // Target (dog)
        this.target = this.physics.add.sprite(400, 100, 'dogTex');
        this.target.body.setCircle(20, 5, 5);
        this.target.setDepth(3);

        // Player
        this.player = this.add.sprite(400, 500, 'playerTex');
        this.player.setDepth(4);

        // Frisbee
        this.frisbee = this.physics.add.sprite(400, 500, 'frisbeeTex');
        this.frisbee.body.setCircle(15);
        this.frisbee.setDepth(5);
        this.frisbee.setVisible(false);

        // UI Text
        this.uiText = this.add.text(20, 20, '', { 
          font: '16px monospace', 
          fill: '#ffffff', 
          backgroundColor: '#000000bb', 
          padding: {x: 15, y:15}
        });
        this.uiText.setDepth(10);

        this.add.text(400, 570, 'Tip: The wind vector adds acceleration to your frisbee. Aim against it!', {
          font: '16px Arial',
          fill: '#ffffff',
          backgroundColor: '#000000aa',
          padding: {x: 10, y: 5}
        }).setOrigin(0.5).setDepth(10);

        this.graphics = this.add.graphics();
        this.graphics.setDepth(2); // Aim line below player/frisbee

        this.setupNewRound();

        // Inputs
        this.input.on('pointerdown', this.onPointerDown, this);
        this.input.on('pointermove', this.onPointerMove, this);
        this.input.on('pointerup', this.onPointerUp, this);

        // Overlaps
        this.physics.add.overlap(this.frisbee, this.target, this.onHitTarget, null, this);
      }

      drawTree(x, y) {
        const tree = this.add.graphics();
        tree.fillStyle(0x8b4513, 1);
        tree.fillRect(x - 5, y, 10, 20);
        tree.fillStyle(0x006400, 1);
        tree.fillCircle(x, y, 20);
        tree.fillStyle(0x228b22, 1);
        tree.fillCircle(x + 5, y - 5, 15);
        return tree;
      }

      generateTextures() {
        // Player
        const pGr = this.add.graphics();
        pGr.fillStyle(0x4169e1, 1);
        pGr.fillCircle(20, 20, 20);
        pGr.fillStyle(0xffe4c4, 1); // skin
        pGr.fillCircle(20, 10, 10);
        pGr.generateTexture('playerTex', 40, 40);
        pGr.destroy();

        // Frisbee
        const fGr = this.add.graphics();
        fGr.fillStyle(0xffffff, 1);
        fGr.fillCircle(15, 15, 15);
        fGr.lineStyle(3, 0xff0000, 1); // Red stripe
        fGr.beginPath();
        fGr.moveTo(0, 15);
        fGr.lineTo(30, 15);
        fGr.strokePath();
        fGr.generateTexture('frisbeeTex', 30, 30);
        fGr.destroy();

        // Dog
        const dogGr = this.add.graphics();
        dogGr.fillStyle(0x8B4513, 1);
        dogGr.fillEllipse(25, 25, 40, 20);
        dogGr.fillCircle(40, 15, 12);
        dogGr.fillTriangle(45, 5, 50, -5, 35, 5);
        dogGr.lineStyle(4, 0x8B4513, 1);
        dogGr.beginPath();
        dogGr.moveTo(10, 20);
        dogGr.lineTo(0, 10);
        dogGr.strokePath();
        dogGr.generateTexture('dogTex', 50, 50);
        dogGr.destroy();

        // Particle
        const pt = this.add.graphics();
        pt.fillStyle(0xffffff, 1);
        pt.fillCircle(4, 4, 4);
        pt.generateTexture('particle', 8, 8);
        pt.destroy();
        
        // Star for explosion
        const st = this.add.graphics();
        st.fillStyle(0xffffff, 1);
        st.fillCircle(8, 8, 8);
        st.generateTexture('star', 16, 16);
        st.destroy();

        // Trail emitter
        this.trailEmitter = this.add.particles(0, 0, 'particle', {
          speed: 10,
          scale: { start: 0.8, end: 0 },
          alpha: { start: 0.6, end: 0 },
          lifespan: 400,
          blendMode: 'ADD'
        });
        this.trailEmitter.setDepth(4);
        this.trailEmitter.stop();
        
        // Explosion emitter
        this.explosionEmitter = this.add.particles(0, 0, 'star', {
          speed: { min: 100, max: 300 },
          scale: { start: 1, end: 0 },
          alpha: { start: 1, end: 0 },
          lifespan: 1000,
          tint: [ 0xffff00, 0xffaa00, 0xff0000, 0xffffff ],
          blendMode: 'ADD',
          emitting: false
        });
        this.explosionEmitter.setDepth(10);
      }

      updateWindParticles() {
        if (this.windEmitter) {
          this.windEmitter.destroy();
        }
        this.windEmitter = this.add.particles(0, 0, 'particle', {
          x: { min: -100, max: 900 },
          y: { min: -100, max: 700 },
          lifespan: 2000,
          speedX: this.wind.x,
          speedY: this.wind.y,
          alpha: { start: 0.1, end: 0 },
          scale: { start: 0.5, end: 1.5 },
          blendMode: 'ADD',
          frequency: 100
        });
        this.windEmitter.setDepth(2);
      }

      setupNewRound() {
        this.isAiming = false;
        this.isFlying = false;
        
        this.frisbee.setPosition(this.player.x, this.player.y);
        this.frisbee.body.setVelocity(0, 0);
        this.frisbee.body.setAcceleration(0, 0);
        this.frisbee.setVisible(true);
        this.trailEmitter.stop();
        this.trailEmitter.startFollow(this.frisbee);
        
        this.target.setPosition(Phaser.Math.Between(150, 650), Phaser.Math.Between(100, 250));
        
        const windX = Phaser.Math.Between(-300, 300);
        const windY = Phaser.Math.Between(-150, 150);
        this.wind.set(windX, windY);
        
        this.updateWindParticles();
        this.updateUI();
      }

      updateUI() {
        this.uiText.setText(
          `🏆 Score: ${this.score}\n\n` +
          `💨 WIND EQUATION:\n` +
          `v(t) = v₀ + a·t\n` +
          `a = [ ${this.wind.x.toFixed(0)}, ${this.wind.y.toFixed(0)} ] px/s²\n\n` +
          `Pull back to aim (v₀)`
        );
      }

      onPointerDown(pointer) {
        if (this.isFlying) return;
        this.isAiming = true;
        this.startDragPoint.set(pointer.x, pointer.y);
      }

      onPointerMove(pointer) {
        if (!this.isAiming) return;
        this.endDragPoint.set(pointer.x, pointer.y);
        
        const maxDrag = 200;
        let dx = this.startDragPoint.x - pointer.x;
        let dy = this.startDragPoint.y - pointer.y;
        
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > maxDrag) {
            dx = (dx / dist) * maxDrag;
            dy = (dy / dist) * maxDrag;
        }
        
        this.graphics.clear();
        
        // Draw dotted predicted path (straight line without wind)
        this.graphics.lineStyle(2, 0xffffff, 0.5);
        this.graphics.beginPath();
        this.graphics.moveTo(this.player.x, this.player.y);
        this.graphics.lineTo(this.player.x + dx * 5, this.player.y + dy * 5);
        this.graphics.strokePath();

        // Draw sling line
        this.graphics.lineStyle(4, 0xffaa00, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(this.player.x, this.player.y);
        this.graphics.lineTo(this.player.x - dx, this.player.y - dy);
        this.graphics.strokePath();
      }

      onPointerUp(pointer) {
        if (!this.isAiming) return;
        this.isAiming = false;
        this.graphics.clear();
        
        const maxDrag = 200;
        let dx = this.startDragPoint.x - pointer.x;
        let dy = this.startDragPoint.y - pointer.y;
        
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > maxDrag) {
            dx = (dx / dist) * maxDrag;
            dy = (dy / dist) * maxDrag;
        }
        
        const speedMult = 4;
        
        this.isFlying = true;
        this.frisbee.body.setVelocity(dx * speedMult, dy * speedMult);
        this.frisbee.body.setAcceleration(this.wind.x, this.wind.y);
        this.trailEmitter.start();
      }

      onHitTarget() {
        if (!this.isFlying) return;
        this.isFlying = false;
        
        this.frisbee.body.setVelocity(0, 0);
        this.frisbee.body.setAcceleration(0, 0);
        this.trailEmitter.stop();
        
        this.cameras.main.shake(200, 0.015);
        this.explosionEmitter.emitParticleAt(this.target.x, this.target.y, 50);
        
        this.score += 20;
        this.updateUI();
        
        const text = this.add.text(this.target.x, this.target.y - 30, 'CATCH!', { 
          font: '32px Arial', fill: '#00ff00', stroke: '#ffffff', strokeThickness: 4 
        }).setOrigin(0.5).setDepth(20);
        
        this.tweens.add({
          targets: text,
          y: text.y - 50,
          alpha: 0,
          scale: 1.5,
          duration: 1000,
          onComplete: () => {
            text.destroy();
            this.setupNewRound();
          }
        });
      }

      missThrow() {
        this.isFlying = false;
        this.cameras.main.shake(150, 0.005);
        this.trailEmitter.stop();
        this.frisbee.body.setVelocity(0, 0);
        this.frisbee.body.setAcceleration(0, 0);
        
        this.score = Math.max(0, this.score - 5);
        this.updateUI();
        
        const text = this.add.text(this.frisbee.x, this.frisbee.y, 'Miss!', { 
          font: '24px Arial', fill: '#ff0000', stroke: '#ffffff', strokeThickness: 4 
        }).setOrigin(0.5).setDepth(20);
        
        this.tweens.add({
          targets: text,
          y: text.y - 50,
          alpha: 0,
          duration: 1000,
          onComplete: () => {
            text.destroy();
            this.setupNewRound();
          }
        });
      }

      update(time, delta) {
        if (this.isFlying) {
          this.frisbee.rotation += 0.2;
          
          if (this.frisbee.x < -100 || this.frisbee.x > 900 || this.frisbee.y < -100 || this.frisbee.y > 700) {
            this.missThrow();
          }
        }
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
    <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
      <div ref={gameRef} />
      <button 
        onClick={onExit}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#ff4444',
          color: 'white',
          border: '2px solid #fff',
          borderRadius: '8px',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#ff0000'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#ff4444'}
      >
        Beenden
      </button>
    </div>
  );
};

export default FaskaFrisbeeSwarm;
