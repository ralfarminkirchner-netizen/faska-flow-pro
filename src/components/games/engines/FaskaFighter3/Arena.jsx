import React, { useRef, useEffect } from 'react';
import { useGameStore } from './GameLogic';

export default function Arena() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const bgImg = new Image();
        bgImg.src = '/textures/fighter_bg.png';
        const ctx = canvasRef.current.getContext('2d');

        let reqId;
        const render = () => {
            const { camera, screenShake } = useGameStore.getState();
            ctx.clearRect(0, 0, 800, 450);
            
            let shakeX = 0;
            let shakeY = 0;
            if (screenShake > 0) {
                shakeX = Math.random() * screenShake - screenShake/2;
                shakeY = Math.random() * screenShake - screenShake/2;
            }

            if (bgImg.complete && bgImg.naturalHeight !== 0) {
                ctx.drawImage(bgImg, -camera.x + shakeX, -camera.y + shakeY, 1200, 450);
            } else {
                ctx.save();
                ctx.translate(shakeX, shakeY);
                let grad = ctx.createLinearGradient(0, 0, 0, 450);
                grad.addColorStop(0, '#0a0a2a');
                grad.addColorStop(1, '#4a1a3a');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 800, 450);
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(0, 400 - camera.y, 800, 50);
                ctx.restore();
            }
            reqId = requestAnimationFrame(render);
        };
        render();

        return () => cancelAnimationFrame(reqId);
    }, []);

    return <canvas ref={canvasRef} width={800} height={450} style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }} />;
}
