import React from 'react';

export default function SquareEffectPopup({ effectData, onClose }) {
  if (!effectData) return null;

  const isScam = effectData.type === 'scam';
  const cardImage = effectData.image;
  const squareId = effectData.id || '';
  const title = effectData.title || (isScam ? 'Scam Alert' : 'Investor Protection');
  const description = effectData.customDescription || effectData.description || getEffectDescription(effectData);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(5, 5, 16, 0.78)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes popIn {
            0% { transform: scale(0.85); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>

      <div style={{
        backgroundColor: '#0e1124',
        padding: '1.5rem',
        borderRadius: '20px',
        maxWidth: '430px',
        width: '100%',
        textAlign: 'center',
        border: `3px solid ${isScam ? '#E31837' : '#10B981'}`,
        boxShadow: `0 0 40px ${isScam ? 'rgba(227, 24, 55, 0.45)' : 'rgba(16, 185, 129, 0.45)'}`,
        animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        
        {/* Header Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: isScam ? 'rgba(227, 24, 55, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          border: `1px solid ${isScam ? '#E31837' : '#10B981'}`,
          borderRadius: '999px',
          padding: '4px 16px',
          color: isScam ? '#FF6B6B' : '#34D399',
          fontWeight: '800',
          fontSize: '0.85rem',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          <span>{isScam ? '⚠️ SCAM DETECTED' : '🛡️ INVESTOR PROTECTION'}</span>
          {squareId && <span style={{ opacity: 0.8 }}>({squareId})</span>}
        </div>

        {/* Card Image */}
        {cardImage ? (
          <div style={{
            width: '100%',
            maxHeight: '52vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#070914',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <img 
              src={cardImage} 
              alt={title}
              style={{
                width: 'auto',
                maxWidth: '100%',
                maxHeight: '50vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
        ) : (
          <div style={{
            fontSize: '3.5rem',
            margin: '1rem 0'
          }}>
            {isScam ? '🚨' : '🛡️'}
          </div>
        )}

        {/* Title */}
        <h2 style={{ 
          color: isScam ? '#FF6B6B' : '#34D399',
          margin: 0,
          fontSize: '1.25rem',
          fontWeight: '800',
          letterSpacing: '0.5px'
        }}>
          {title}
        </h2>
        
        {/* Effect Description */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <p style={{ 
            fontSize: '1rem', 
            color: '#E2E8F0', 
            margin: 0, 
            fontWeight: '600',
            lineHeight: 1.4
          }}>
            {description}
          </p>
        </div>
        
        {/* Continue Button */}
        <button 
          onClick={onClose}
          style={{
            width: '100%',
            background: isScam 
              ? 'linear-gradient(135deg, #E31837 0%, #B91C1C 100%)' 
              : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF',
            border: 'none',
            padding: '0.85rem 1.5rem',
            fontSize: '1.05rem',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '800',
            letterSpacing: '0.5px',
            boxShadow: `0 4px 14px ${isScam ? 'rgba(227, 24, 55, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
            transition: 'transform 0.15s ease, filter 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.15)'}
          onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
        >
          CONTINUE GAME
        </button>
      </div>
    </div>
  );
}

function getEffectDescription(data) {
  if (!data) return '';
  switch(data.effect) {
    case 'sendHome': return 'Token sent back to Home base!';
    case 'skipTurn': return `Skip next ${data.value} turn(s).`;
    case 'moveBack': return `Move back ${data.value} step(s).`;
    case 'skipNextProtectionBonus': return 'Skip the bonus of the next Protection square you land on.';
    case 'moveAhead': return `Move ahead ${data.value} step(s)!`;
    case 'rollAgain': return 'Roll the dice once more!';
    case 'immuneNextScam': return 'Immune to the next Scam square hit!';
    default: return '';
  }
}
