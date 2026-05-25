import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const WORD_GROUPS = [
    { name: "Früchte", words: ["Apfel", "Banane", "Kirsche", "Birne", "Orange", "Traube", "Melone", "Pfirsich", "Kiwi"] },
    { name: "Fahrzeuge", words: ["Auto", "Bus", "Fahrrad", "Zug", "Flugzeug", "Schiff", "LKW", "Traktor", "Roller"] },
    { name: "Tiere", words: ["Hund", "Katze", "Maus", "Elefant", "Tiger", "Bär", "Löwe", "Vogel", "Pferd"] },
    { name: "Möbel", words: ["Stuhl", "Tisch", "Bett", "Schrank", "Sofa", "Regal", "Sessel", "Hocker"] },
    { name: "Kleidung", words: ["Hose", "Hemd", "Schuh", "Jacke", "Hut", "Socke", "Kleid", "Pullover", "Mütze"] },
    { name: "Berufe", words: ["Arzt", "Lehrer", "Bäcker", "Maler", "Koch", "Bauer", "Polizist", "Friseur", "Pilot"] }
];

class FaskaMoorhuhnScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FaskaMoorhuhnScene' });
        this.score = 0;
    }

    create() {
        this.generateTextures();

        // Background Sky
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x1E90FF, 0x1E90FF, 1);
        bg.fillRect(0, 0, 800, 600);

        // Sun
        bg.fillStyle(0xFFD700, 1);
        bg.fillCircle(700, 100, 50);
        
        // Clouds
        bg.fillStyle(0xffffff, 0.8);
        bg.fillCircle(150, 120, 30);
        bg.fillCircle(180, 110, 40);
        bg.fillCircle(210, 120, 30);
        bg.fillCircle(550, 160, 20);
        bg.fillCircle(580, 150, 30);
        bg.fillCircle(610, 160, 20);

        // Hills Background
        bg.fillStyle(0x228B22, 1);
        bg.beginPath();
        bg.moveTo(0, 600);
        bg.lineTo(0, 400);
        bg.quadraticCurveTo(200, 300, 400, 450);
        bg.quadraticCurveTo(600, 550, 800, 350);
        bg.lineTo(800, 600);
        bg.fillPath();

        // Hills Foreground
        bg.fillStyle(0x32CD32, 1);
        bg.beginPath();
        bg.moveTo(0, 600);
        bg.lineTo(0, 500);
        bg.quadraticCurveTo(300, 400, 600, 500);
        bg.quadraticCurveTo(700, 550, 800, 450);
        bg.lineTo(800, 600);
        bg.fillPath();

        // HUD Score
        this.scoreText = this.add.text(20, 20, 'Punkte: 0', {
            fontSize: '32px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setDepth(100);

        // Instruction Text Background
        const instrBg = this.add.graphics();
        instrBg.fillStyle(0x000000, 0.5);
        instrBg.fillRoundedRect(150, 10, 500, 50, 10);
        instrBg.setDepth(99);

        // Instruction Text
        this.instructionText = this.add.text(400, 35, 'Finde das unpassende Wort!', {
            fontSize: '26px',
            fontFamily: 'Arial',
            fill: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.5).setDepth(100);

        // Crosshair Setup
        this.input.setDefaultCursor('none');
        this.crosshair = this.add.graphics().setDepth(200);
        this.drawCrosshair();

        this.input.on('pointermove', (pointer) => {
            this.crosshair.setPosition(pointer.x, pointer.y);
        });

        this.input.on('pointerdown', (pointer) => {
            this.shoot(pointer);
        });

        this.targetGroup = this.add.group();
        this.startWave();
    }

    generateTextures() {
        const p = this.make.graphics({ x: 0, y: 0, add: false });
        p.fillStyle(0xffffff);
        p.fillCircle(8, 8, 8);
        p.generateTexture('particle', 16, 16);
    }

    drawCrosshair() {
        this.crosshair.clear();
        this.crosshair.lineStyle(3, 0xff0000, 1);
        this.crosshair.strokeCircle(0, 0, 15);
        this.crosshair.beginPath();
        this.crosshair.moveTo(-25, 0);
        this.crosshair.lineTo(-5, 0);
        this.crosshair.moveTo(5, 0);
        this.crosshair.lineTo(25, 0);
        this.crosshair.moveTo(0, -25);
        this.crosshair.lineTo(0, -5);
        this.crosshair.moveTo(0, 5);
        this.crosshair.lineTo(0, 25);
        this.crosshair.strokePath();
    }

    startWave() {
        this.targetGroup.clear(true, true);

        // Pick random main group and random odd group
        const mainGroupIdx = Phaser.Math.Between(0, WORD_GROUPS.length - 1);
        let oddGroupIdx = Phaser.Math.Between(0, WORD_GROUPS.length - 1);
        while (oddGroupIdx === mainGroupIdx) {
            oddGroupIdx = Phaser.Math.Between(0, WORD_GROUPS.length - 1);
        }

        const mainGroup = WORD_GROUPS[mainGroupIdx];
        const oddGroup = WORD_GROUPS[oddGroupIdx];

        // Pick 4 words from main group and 1 word from odd group
        const mainWords = Phaser.Utils.Array.Shuffle([...mainGroup.words]).slice(0, 4);
        const oddWord = Phaser.Utils.Array.Shuffle([...oddGroup.words])[0];

        const waveWords = [...mainWords.map(w => ({ word: w, isOdd: false })), { word: oddWord, isOdd: true }];
        Phaser.Utils.Array.Shuffle(waveWords);

        // Spawn targets
        waveWords.forEach((item, i) => {
            this.spawnTarget(item.word, item.isOdd, i);
        });
    }

    spawnTarget(word, isOdd, index) {
        const startLeft = Math.random() > 0.5;
        const x = startLeft ? -100 - Math.random() * 200 : 900 + Math.random() * 200;
        const y = 150 + index * 80 + Math.random() * 40;
        
        const container = this.add.container(x, y);

        const colors = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff, 0x44ffff, 0xff9900];
        const balloonColor = colors[Phaser.Math.Between(0, colors.length - 1)];

        const g = this.add.graphics();
        // Balloon
        g.fillStyle(balloonColor, 1);
        g.fillCircle(0, -40, 35);
        g.lineStyle(2, 0x000000, 1);
        g.strokeCircle(0, -40, 35);
        
        // Strings
        g.beginPath();
        g.moveTo(-15, -10);
        g.lineTo(-15, 10);
        g.moveTo(15, -10);
        g.lineTo(15, 10);
        g.strokePath();

        // Basket
        g.fillStyle(0x8B4513, 1);
        g.fillRect(-20, 10, 40, 25);
        g.strokeRect(-20, 10, 40, 25);

        // Sign background
        g.fillStyle(0xffffff, 0.95);
        g.fillRoundedRect(-70, 40, 140, 35, 8);
        g.strokeRoundedRect(-70, 40, 140, 35, 8);

        const text = this.add.text(0, 57, word, {
            fontSize: '20px',
            fontFamily: 'Arial',
            fill: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.5);

        container.add([g, text]);
        
        container.setSize(140, 150); 
        container.setInteractive(new Phaser.Geom.Rectangle(-70, -75, 140, 150), Phaser.Geom.Rectangle.Contains);

        const scale = Math.random() * 0.3 + 0.85;
        container.setScale(scale);

        container.wordData = {
            word: word,
            isOdd: isOdd,
            baseY: y,
            speed: (Math.random() * 1.5 + 1.5) * (startLeft ? 1 : -1),
            timeOffset: Math.random() * Math.PI * 2,
            fleeing: false
        };

        this.targetGroup.add(container);
    }

    shoot(pointer) {
        // Crosshair Recoil Animation
        this.tweens.add({
            targets: this.crosshair,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 50,
            yoyo: true
        });

        // Muzzle Flash
        const flash = this.add.graphics();
        flash.fillStyle(0xffff00, 0.6);
        flash.fillCircle(pointer.x, pointer.y, 40);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 200,
            onComplete: () => flash.destroy()
        });

        // Check for hits
        const targets = this.targetGroup.getChildren();
        for (let i = targets.length - 1; i >= 0; i--) {
            const t = targets[i];
            const bounds = t.getBounds();
            if (bounds.contains(pointer.x, pointer.y) && !t.wordData.fleeing) {
                this.hitTarget(t);
                break; 
            }
        }
    }

    hitTarget(target) {
        const isOdd = target.wordData.isOdd;
        const x = target.x;
        const y = target.y;

        target.destroy();

        if (isOdd) {
            // Correct answer
            this.cameras.main.shake(150, 0.015);
            this.createExplosion(x, y - 40, 0x00ff00);
            this.showFloatingText(x, y, '+10', '#00ff00');
            this.score += 10;
            
            // Remaining targets flee in panic
            this.targetGroup.getChildren().forEach(t => {
                t.wordData.fleeing = true;
                t.wordData.speed = t.wordData.speed > 0 ? 15 : -15; 
            });

            // Start next wave after delay
            this.time.delayedCall(1500, () => {
                this.startWave();
            });
        } else {
            // Wrong answer
            this.cameras.main.shake(100, 0.005);
            this.createExplosion(x, y - 40, 0xff0000);
            this.showFloatingText(x, y, '-5', '#ff0000');
            this.score = Math.max(0, this.score - 5);
        }

        this.scoreText.setText('Punkte: ' + this.score);
    }

    createExplosion(x, y, colorTint) {
        const emitterConfig = {
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 600,
            gravityY: 300,
            tint: colorTint
        };

        // Cross-version compatibility for particles
        if (Phaser.VERSION && parseInt(Phaser.VERSION.split('.')[1]) >= 60) {
            const emitter = this.add.particles(x, y, 'particle', {
                ...emitterConfig,
                emitting: false
            });
            emitter.explode(40);
            this.time.delayedCall(1000, () => emitter.destroy());
        } else {
            const particles = this.add.particles('particle');
            const emitter = particles.createEmitter({
                ...emitterConfig,
                on: false
            });
            emitter.explode(40, x, y);
            this.time.delayedCall(1000, () => particles.destroy());
        }
    }

    showFloatingText(x, y, msg, color) {
        const txt = this.add.text(x, y, msg, {
            fontSize: '40px',
            fontFamily: 'Arial',
            fill: color,
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 4
        }).setOrigin(0.5, 0.5).setDepth(150);

        this.tweens.add({
            targets: txt,
            y: y - 100,
            alpha: 0,
            duration: 1000,
            ease: 'Power1',
            onComplete: () => txt.destroy()
        });
    }

    update(time, delta) {
        const t = time / 1000;
        
        this.targetGroup.getChildren().forEach(target => {
            const data = target.wordData;
            
            target.x += data.speed;
            
            if (!data.fleeing) {
                target.y = data.baseY + Math.sin(t * 3 + data.timeOffset) * 25;
            }

            if (!data.fleeing) {
                // Wrap around screen horizontally
                if (data.speed > 0 && target.x > 900) {
                    target.x = -100;
                } else if (data.speed < 0 && target.x < -100) {
                    target.x = 900;
                }
            }
        });
    }
}

const FaskaMoorhuhn = ({ onExit }) => {
    const gameContainer = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameContainer.current,
            backgroundColor: '#000000',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: FaskaMoorhuhnScene
        };

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '800px', height: '600px', margin: '0 auto', overflow: 'hidden', borderRadius: '10px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
            <button
                onClick={onExit}
                style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    zIndex: 10,
                    padding: '10px 20px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: '3px solid #cc0000',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    textTransform: 'uppercase'
                }}
            >
                Beenden
            </button>
            <div ref={gameContainer} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default FaskaMoorhuhn;
