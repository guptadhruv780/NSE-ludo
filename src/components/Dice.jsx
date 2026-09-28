import React, { useState } from 'react';
import { playSound } from '../utils/soundManager';

export default function Dice({ onRoll, disabled, currentPlayerColor }) {
  const [rolling, setRolling] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleRoll = () => {
    if (disabled || rolling) return;
    
    setRolling(true);
    playSound('dice');
    
    // Exactly ONE source of truth for the roll value, 1 to 6
    const rollValue = Math.floor(Math.random() * 6) + 1;
    
    // Map roll value to exactly one clean CSS 3D transform state
    let targetX = 0, targetY = 0;
    switch(rollValue) {
      case 1: targetX = 0; targetY = 0; break;
      case 2: targetX = 0; targetY = 90; break;
      case 3: targetX = -90; targetY = 0; break;
      case 4: targetX = 90; targetY = 0; break;
      case 5: targetX = 0; targetY = -90; break;
      case 6: targetX = 0; targetY = 180; break;
    }

    // Add exactly 1080 degrees (3 spins) to the current base rotation to ensure it tumbles smoothly
    const nextX = Math.floor(rotation.x / 360) * 360 + 1080 + targetX;
    const nextY = Math.floor(rotation.y / 360) * 360 + 1080 + targetY;
    
    setRotation({ x: nextX, y: nextY });
    
    setTimeout(() => {
      setRolling(false);
      onRoll(rollValue); // strictly pass the 1-6 value
    }, 700); 
  };

  const faceStyle = {
    position: 'absolute',
    width: '60px',
    height: '60px',
    backgroundColor: 'white',
    border: '2px solid #ccc',
    boxSizing: 'border-box', // CRITICAL: prevents border from making faces larger than 60px (causing overlap/bleed)
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    backfaceVisibility: 'hidden', // Stop bleed of hidden faces
    color: currentPlayerColor
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div 
        style={{
          width: '60px',
          height: '60px',
          perspective: '600px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1
        }}
        onClick={handleRoll}
      >
        <div 
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.7s cubic-bezier(0.1, 0.8, 0.2, 1)', 
            // One clean transform applied to the parent
            transform: `translateZ(-30px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          }}
        >
          {/* 6 exact faces of the cube, translated perfectly by half the width (30px) */}
          <div style={{ ...faceStyle, transform: 'rotateY(0deg) translateZ(30px)' }}>1</div>
          <div style={{ ...faceStyle, transform: 'rotateY(-90deg) translateZ(30px)' }}>2</div>
          <div style={{ ...faceStyle, transform: 'rotateX(90deg) translateZ(30px)' }}>3</div>
          <div style={{ ...faceStyle, transform: 'rotateX(-90deg) translateZ(30px)' }}>4</div>
          <div style={{ ...faceStyle, transform: 'rotateY(90deg) translateZ(30px)' }}>5</div>
          <div style={{ ...faceStyle, transform: 'rotateY(180deg) translateZ(30px)' }}>6</div>
        </div>
      </div>
      <button 
        onClick={handleRoll} 
        disabled={disabled || rolling}
        style={{
          padding: '0.75rem 1.75rem',
          backgroundColor: currentPlayerColor,
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '800',
          fontSize: '1rem',
          fontFamily: "'Outfit', sans-serif",
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          boxShadow: '0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>casino</span>
        <span>{rolling ? 'Rolling...' : 'Roll Dice'}</span>
      </button>
    </div>
  );
}
