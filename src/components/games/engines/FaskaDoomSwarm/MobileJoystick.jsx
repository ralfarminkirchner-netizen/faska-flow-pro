import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from './GameLogic';

export default function MobileJoystick() {
    const setJoystickMove = useGameStore(state => state.setJoystickMove);
    const setIsShooting = useGameStore(state => state.setIsShooting);
    const toggleAmmo = useGameStore(state => state.toggleAmmo);
    const setIsLocked = useGameStore(state => state.setIsLocked);

    const joystickRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
    const maxRadius = 40;

    useEffect(() => {
        // Just being active on mobile implies we are "locked" into the game
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        if (isTouch) {
            setIsLocked(true);
        }
    }, [setIsLocked]);

    const handleTouchStart = (e) => {
        setIsDragging(true);
        updateStickPosition(e.touches[0]);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        updateStickPosition(e.touches[0]);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        setStickPos({ x: 0, y: 0 });
        setJoystickMove({ x: 0, y: 0 });
    };

    const updateStickPosition = (touch) => {
        if (!joystickRef.current) return;
        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let deltaX = touch.clientX - centerX;
        let deltaY = touch.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > maxRadius) {
            deltaX = (deltaX / distance) * maxRadius;
            deltaY = (deltaY / distance) * maxRadius;
        }

        setStickPos({ x: deltaX, y: deltaY });

        // Normalize for the player controller (-1 to 1)
        // Note: Moving joystick up (negative Y) should move player forward (negative moveForward)
        // We flip signs depending on the math in Player.jsx. Let's just output normalized X and Y.
        setJoystickMove({ x: -(deltaX / maxRadius), y: deltaY / maxRadius });
    };

    // Mobile controls only appear if we detect touch
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    useEffect(() => {
        setIsTouchDevice(('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
    }, []);

    if (!isTouchDevice) return null;

    return (
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, zIndex: 50, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
            {/* Joystick */}
            <div 
                ref={joystickRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                style={{
                    width: 120, height: 120, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)',
                    position: 'relative', pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                <div style={{
                    width: 50, height: 50, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.6)',
                    transform: `translate(${stickPos.x}px, ${stickPos.y}px)`
                }} />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', pointerEvents: 'auto' }}>
                <button 
                    onClick={() => toggleAmmo()}
                    style={{
                        width: 70, height: 70, borderRadius: '50%', backgroundColor: 'rgba(0,0,255,0.5)',
                        color: 'white', fontWeight: 'bold', border: '2px solid white'
                    }}
                >
                    SWAP
                </button>
                <button 
                    onTouchStart={(e) => { e.preventDefault(); setIsShooting(true); }}
                    onClick={() => setIsShooting(true)}
                    style={{
                        width: 90, height: 90, borderRadius: '50%', backgroundColor: 'rgba(255,0,0,0.5)',
                        color: 'white', fontWeight: 'bold', border: '2px solid white'
                    }}
                >
                    FIRE
                </button>
            </div>
        </div>
    );
}
