import React, { useRef, useEffect } from 'react';
import { useGameStore, STATES } from './GameLogic';

export default function Fighters() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const playerImg = new Image();
        playerImg.src = '/textures/fighter_player.png';
        const enemyImg = new Image();
        enemyImg.src = '/textures/fighter_enemy.png';

        const ctx = canvasRef.current.getContext('2d');

        let reqId;
        const render = () => {
            const { p1, p2, camera, projectiles, particles, screenShake } = useGameStore.getState();
            ctx.clearRect(0, 0, 800, 450);
            
            let shakeX = 0;
            let shakeY = 0;
            if (screenShake > 0) {
                shakeX = Math.random() * screenShake - screenShake/2;
                shakeY = Math.random() * screenShake - screenShake/2;
            }

            const drawFighter = (f, img, isP1) => {
                ctx.save();
                ctx.translate(f.x - camera.x + shakeX, f.y - camera.y + shakeY);
                ctx.scale(f.facing, 1);
                
                let bounce = 0;
                let rot = 0;
                if (f.state === STATES.IDLE) bounce = Math.sin(f.stateTimer * 0.1) * 2;
                else if (f.state === STATES.WALK_F || f.state === STATES.WALK_B) bounce = Math.abs(Math.sin(f.stateTimer * 0.3)) * -5;
                else if (f.state === STATES.HIT) rot = -0.3;
                else if (f.state === STATES.KO) { rot = -Math.PI/2; bounce = 15; }
                
                ctx.translate(0, bounce);
                ctx.rotate(rot);

                if (img.complete && img.naturalHeight !== 0) {
                    ctx.drawImage(img, -50, -130, 100, 150);
                } else {
                    ctx.fillStyle = isP1 ? '#ff3333' : '#3333ff';
                    ctx.fillRect(-20, -100, 40, 100);
                    ctx.fillStyle = 'white';
                    ctx.fillRect(10, -90, 10, 20);
                }
                
                if (f.state === STATES.PUNCH) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.fillRect(20, -90, 40, 20);
                } else if (f.state === STATES.KICK) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.fillRect(20, -60, 50, 20);
                }
                
                ctx.restore();
            };

            drawFighter(p1, playerImg, true);
            drawFighter(p2, enemyImg, false);

            projectiles.forEach(p => {
                ctx.save();
                ctx.translate(p.x - camera.x + shakeX, p.y - camera.y + shakeY);
                let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.4, '#00ffff');
                grad.addColorStop(1, 'rgba(0, 255, 255, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(0, 0, 25, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            particles.forEach(p => {
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.life);
                ctx.beginPath();
                ctx.arc(p.x - camera.x + shakeX, p.y - camera.y + shakeY, 6 * p.life, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            });

            reqId = requestAnimationFrame(render);
        };
        render();

        return () => cancelAnimationFrame(reqId);
    }, []);

    return <canvas ref={canvasRef} width={800} height={450} style={{ position: 'absolute', left: 0, top: 0, zIndex: 2 }} />;
}
