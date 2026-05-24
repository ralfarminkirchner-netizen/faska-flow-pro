import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

class FaskaManScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FaskaManScene' });
    }

    preload() {
        let gfx = this.add.graphics();

        // Wall Texture
        gfx.lineStyle(4, 0x00ffff, 1);
        gfx.strokeRect(2, 2, 36, 36);
        gfx.fillStyle(0x000033, 1);
        gfx.fillRect(2, 2, 36, 36);
        gfx.generateTexture('wall', 40, 40);
        gfx.clear();

        // Player Texture (Open Mouth)
        gfx.fillStyle(0xffff00, 1);
        gfx.beginPath();
        gfx.arc(20, 20, 16, 0.2 * Math.PI, 1.8 * Math.PI, false);
        gfx.lineTo(20, 20);
        gfx.closePath();
        gfx.fill();
        gfx.generateTexture('player_open', 40, 40);
        gfx.clear();

        // Player Texture (Closed Mouth)
        gfx.fillStyle(0xffff00, 1);
        gfx.beginPath();
        gfx.arc(20, 20, 16, 0, 2 * Math.PI, false);
        gfx.fill();
        gfx.generateTexture('player_closed', 40, 40);
        gfx.clear();

        // Ghost Texture
        gfx.fillStyle(0xffffff, 1); // Base color will be tinted
        gfx.beginPath();
        gfx.arc(20, 16, 14, Math.PI, 0, false);
        gfx.lineTo(34, 34);
        gfx.lineTo(27, 30);
        gfx.lineTo(20, 34);
        gfx.lineTo(13, 30);
        gfx.lineTo(6, 34);
        gfx.closePath();
        gfx.fill();
        // Eyes
        gfx.fillStyle(0x000000, 1);
        gfx.fillCircle(14, 14, 4);
        gfx.fillCircle(26, 14, 4);
        gfx.fillStyle(0xffffff, 1);
        gfx.fillCircle(15, 14, 2);
        gfx.fillCircle(27, 14, 2);
        gfx.generateTexture('ghost', 40, 40);
        gfx.clear();

        // Particle Texture
        gfx.fillStyle(0xffffff, 1);
        gfx.fillCircle(4, 4, 4);
        gfx.generateTexture('particle', 8, 8);
        gfx.clear();
    }

    create() {
        this.score = this.registry.get('score') || 0;
        this.cameras.main.setBackgroundColor('#050510');

        const level = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
            [1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
            [1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
            [1,0,1,0,1,0,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
            [1,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1,0,1],
            [1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1,0,1,0,1],
            [1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,1],
            [1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ];

        this.walls = this.physics.add.staticGroup();
        this.emptySpaces = [];

        for (let row = 0; row < level.length; row++) {
            for (let col = 0; col < level[row].length; col++) {
                let x = col * 40 + 20;
                let y = row * 40 + 20;
                if (level[row][col] === 1) {
                    this.walls.create(x, y, 'wall');
                } else {
                    // Keep a safe zone around spawn point (60, 60)
                    if (x > 100 || y > 100) {
                        this.emptySpaces.push({x, y});
                    }
                }
            }
        }

        // Animations
        this.anims.create({
            key: 'chomp',
            frames: [
                { key: 'player_open' },
                { key: 'player_closed' }
            ],
            frameRate: 10,
            repeat: -1
        });

        // Player
        this.player = this.physics.add.sprite(60, 60, 'player_open');
        this.player.play('chomp');
        this.player.setCollideWorldBounds(true);
        this.player.setSize(20, 20); // smaller hitbox for better cornering

        // Words
        this.words = this.physics.add.group();
        const nouns = ['Haus', 'Baum', 'Apfel', 'Katze', 'Auto', 'Hund', 'Stuhl', 'Tisch', 'Buch', 'Maus', 'Sonne'];
        const adjs = ['schnell', 'groß', 'klein', 'bunt', 'laut', 'leise', 'kalt', 'heiß', 'klug', 'dumm', 'schön'];

        Phaser.Utils.Array.Shuffle(this.emptySpaces);
        for (let i = 0; i < 30; i++) {
            if (!this.emptySpaces[i]) break;

            let isNoun = Math.random() > 0.5;
            let textList = isNoun ? nouns : adjs;
            let wordStr = Phaser.Utils.Array.GetRandom(textList);

            let wordText = this.add.text(this.emptySpaces[i].x, this.emptySpaces[i].y, wordStr, {
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            wordText.setShadow(0, 0, '#ffffff', 5, false, true);
            wordText.setData('isNoun', isNoun);

            this.physics.add.existing(wordText);
            wordText.body.setSize(wordText.width + 10, wordText.height + 10);
            wordText.body.setOffset(-wordText.width / 2 - 5, -wordText.height / 2 - 5);

            this.tweens.add({
                targets: wordText,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 600 + Math.random() * 400,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            this.words.add(wordText);
        }

        // Ghosts
        this.ghosts = this.physics.add.group();
        const ghostColors = [0xff0000, 0x00ff00, 0x00ffff, 0xff00ff, 0xff8800];
        for (let i = 0; i < 4; i++) {
            if(i >= this.emptySpaces.length) break;
            let pos = this.emptySpaces[this.emptySpaces.length - 1 - i];
            let ghost = this.ghosts.create(pos.x, pos.y, 'ghost');
            ghost.setCollideWorldBounds(true);
            ghost.setSize(24, 24);
            ghost.setBounce(1);
            ghost.setTint(Phaser.Utils.Array.GetRandom(ghostColors));
            this.setRandomGhostVelocity(ghost);
        }

        // Collisions
        this.physics.add.collider(this.player, this.walls);
        this.physics.add.collider(this.ghosts, this.walls, this.handleGhostWallCollision, null, this);
        this.physics.add.overlap(this.player, this.words, this.eatWord, null, this);
        this.physics.add.overlap(this.player, this.ghosts, this.hitGhost, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();

        // UI
        this.add.text(400, 20, 'Friss alle NOMEN!', {
            fontSize: '28px',
            fontFamily: 'Arial Black, sans-serif',
            fontWeight: '900',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(100);

        this.scoreText = this.add.text(20, 10, 'Punkte: ' + this.score, {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setDepth(100);

        // Timer for ghosts to occasionally turn randomly
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.ghosts.getChildren().forEach(ghost => {
                    if (Math.random() > 0.5) {
                        this.setRandomGhostVelocity(ghost);
                    }
                });
            },
            loop: true
        });
    }

    createExplosion(x, y, color) {
        // A version-independent, physics-based custom particle burst using standard images/tweens
        for (let i = 0; i < 20; i++) {
            let p = this.add.image(x, y, 'particle').setTint(color);
            p.setDepth(50);
            let angle = Phaser.Math.Between(0, 360);
            let speed = Phaser.Math.Between(50, 200);
            let rad = Phaser.Math.DegToRad(angle);
            let tx = x + Math.cos(rad) * (speed * 0.5);
            let ty = y + Math.sin(rad) * (speed * 0.5);

            this.tweens.add({
                targets: p,
                x: tx,
                y: ty,
                alpha: 0,
                scale: { start: 1.5, end: 0 },
                duration: 600,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
    }

    showFloatingText(x, y, message, color) {
        let t = this.add.text(x, y, message, {
            fontSize: '20px',
            fontWeight: 'bold',
            color: color,
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(150);

        this.tweens.add({
            targets: t,
            y: y - 40,
            alpha: 0,
            duration: 1000,
            onComplete: () => t.destroy()
        });
    }

    setRandomGhostVelocity(ghost) {
        const speed = 120;
        const dirs = [
            { x: speed, y: 0 },
            { x: -speed, y: 0 },
            { x: 0, y: speed },
            { x: 0, y: -speed }
        ];
        let dir = Phaser.Utils.Array.GetRandom(dirs);
        ghost.setVelocity(dir.x, dir.y);
    }

    handleGhostWallCollision(ghost, wall) {
        this.setRandomGhostVelocity(ghost);
    }

    eatWord(player, word) {
        let isNoun = word.getData('isNoun');
        let activeNouns = this.words.getChildren().filter(w => w.getData('isNoun') && w.active);

        if (isNoun) {
            this.score += 10;
            this.createExplosion(word.x, word.y, 0x00ff00);
            this.showFloatingText(word.x, word.y, '+10', '#00ff00');
        } else {
            this.score -= 5;
            this.createExplosion(word.x, word.y, 0xff0000);
            this.cameras.main.shake(150, 0.01);
            this.showFloatingText(word.x, word.y, '-5', '#ff0000');
        }

        this.registry.set('score', this.score);
        this.scoreText.setText('Punkte: ' + this.score);

        if (activeNouns.length <= 1 && isNoun) {
            // Level cleared logic
            this.time.delayedCall(500, () => {
                this.scene.restart();
            });
        }

        word.destroy();
    }

    hitGhost(player, ghost) {
        if (this.physics.world.isPaused) return;

        this.physics.pause();
        player.setTint(0xff0000);
        this.createExplosion(player.x, player.y, 0xffff00);
        this.cameras.main.shake(300, 0.03);
        this.registry.set('score', 0); // reset score on death

        this.time.delayedCall(1500, () => {
            this.scene.restart();
        });
    }

    update() {
        if (this.physics.world.isPaused) return;

        const speed = 180;
        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.left.isDown) {
            velocityX = -speed;
            this.player.setAngle(180);
        } else if (this.cursors.right.isDown) {
            velocityX = speed;
            this.player.setAngle(0);
        } else if (this.cursors.up.isDown) {
            velocityY = -speed;
            this.player.setAngle(-90);
        } else if (this.cursors.down.isDown) {
            velocityY = speed;
            this.player.setAngle(90);
        }

        this.player.setVelocity(velocityX, velocityY);

        // Smooth turning assist logic
        if (velocityX !== 0) {
            let targetY = Math.floor(this.player.y / 40) * 40 + 20;
            if (Math.abs(this.player.y - targetY) < 15) {
                this.player.y += (targetY - this.player.y) * 0.2;
            }
        } else if (velocityY !== 0) {
            let targetX = Math.floor(this.player.x / 40) * 40 + 20;
            if (Math.abs(this.player.x - targetX) < 15) {
                this.player.x += (targetX - this.player.x) * 0.2;
            }
        }
    }
}

const FaskaMan = ({ onExit }) => {
    const gameRef = useRef(null);
    const gameInstanceRef = useRef(null);

    useEffect(() => {
        if (gameInstanceRef.current) return;

        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameRef.current,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                    gravity: { y: 0 }
                }
            },
            scene: [FaskaManScene]
        };

        gameInstanceRef.current = new Phaser.Game(config);

        return () => {
            if (gameInstanceRef.current) {
                gameInstanceRef.current.destroy(true);
                gameInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#000'
        }}>
            <div style={{ position: 'relative', width: 800, height: 600, border: '4px solid #333', borderRadius: '10px', overflow: 'hidden' }}>
                <button
                    onClick={onExit}
                    style={{
                        position: 'absolute',
                        top: 15,
                        right: 15,
                        zIndex: 1000,
                        padding: '10px 20px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        backgroundColor: '#ff3333',
                        color: '#ffffff',
                        border: '2px solid #aa0000',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                        textTransform: 'uppercase',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#ff5555'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#ff3333'}
                >
                    Beenden
                </button>
                <div ref={gameRef} style={{ width: 800, height: 600 }} />
            </div>
        </div>
    );
};

export default FaskaMan;
