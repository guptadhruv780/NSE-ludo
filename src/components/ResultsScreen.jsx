import Icon from './Icon.jsx';
import React from 'react';
import { exportToExcel } from '../utils/exportExcel';

export default function ResultsScreen({ players, onRestart }) {
  // Sort players: winners (rank 1) first, then others
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.rank && b.rank) return a.rank - b.rank;
    if (a.rank) return -1;
    if (b.rank) return 1;
    return 0;
  });

  const getPlayerColorHex = (colorName) => {
    switch(colorName.toLowerCase()) {
      case 'orange': return '#F36E21';
      case 'yellow': return '#FFD100';
      case 'navy blue': return '#4169E1';
      case 'red': return '#E31837';
      default: return '#333';
    }
  };

  return (
    <div className="results-screen" style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 0%, #1a1642 0%, #0d0c1c 70%, #07060e 100%)',
      padding: '3rem 1.5rem', 
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Ambient background glows */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(243, 110, 33, 0.15) 0%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '820px', width: '100%', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        
        {/* NSE Logo & Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '6px 14px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <img src="/nse-logo.png" alt="NSE Logo" style={{ height: '34px', width: 'auto', display: 'block', objectFit: 'contain' }} />
          </div>
        </div>

        <h1 style={{ 
          color: '#FFFFFF', 
          fontSize: '3.2rem', 
          margin: '0 0 0.5rem 0',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 900,
          letterSpacing: '-0.02em',
          textShadow: '0 0 30px rgba(243, 110, 33, 0.4)'
        }}>
          🏆 Match Completed!
        </h1>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, rgba(243, 110, 33, 0.18) 0%, rgba(46, 43, 107, 0.45) 100%)',
          padding: '0.45rem 1.35rem',
          borderRadius: '9999px',
          border: '1px solid rgba(243, 110, 33, 0.4)',
          marginBottom: '2rem'
        }}>
          <span style={{ color: '#FF9248', fontWeight: '800', fontSize: '1rem', fontFamily: "'Outfit', sans-serif" }}>
            "Soch Kar, Samajh Kar, Invest Kar"
          </span>
        </div>
        
        {/* Final Standings List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
          {sortedPlayers.map((player, index) => {
            const colorHex = getPlayerColorHex(player.color);
            const isWinner = player.rank === 1;

            return (
              <div 
                key={player.color} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.5rem',
                  border: isWinner ? '2px solid #FBBF24' : `1px solid rgba(255, 255, 255, 0.12)`,
                  borderRadius: '18px',
                  backgroundColor: isWinner ? 'rgba(251, 191, 36, 0.12)' : 'rgba(26, 24, 52, 0.85)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: isWinner ? '0 10px 30px rgba(251, 191, 36, 0.2)' : '0 10px 25px rgba(0,0,0,0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  {/* Rank Badge */}
                  <div style={{ 
                    width: '46px', 
                    height: '46px', 
                    backgroundColor: isWinner ? '#FBBF24' : colorHex, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isWinner ? '#000' : '#fff',
                    fontWeight: '900',
                    fontSize: '1.25rem',
                    fontFamily: "'Outfit', sans-serif",
                    boxShadow: `0 4px 15px ${isWinner ? 'rgba(251, 191, 36, 0.5)' : colorHex + '66'}`
                  }}>
                    {isWinner ? '👑' : (player.rank || (index + 1))}
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    <h3 style={{ 
                      margin: 0, 
                      color: '#ffffff', 
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      fontFamily: "'Outfit', sans-serif"
                    }}>
                      {player.name} {isWinner && <span style={{ color: '#FBBF24', fontSize: '0.9rem', marginLeft: '6px' }}>★ Winner</span>}
                    </h3>
                    <p style={{ margin: '0.3rem 0 0 0', color: '#94A3B8', fontSize: '0.85rem' }}>
                      {player.org} • {player.phone}
                    </p>
                  </div>
                </div>

                <div style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '800', 
                  color: colorHex,
                  backgroundColor: `${colorHex}22`,
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: `1px solid ${colorHex}55`
                }}>
                  {player.color}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => exportToExcel(players)}
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              padding: '1rem 2.25rem',
              fontSize: '1.05rem',
              fontWeight: '800',
              fontFamily: "'Outfit', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(5, 150, 105, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Icon className="material-symbols-outlined">download</Icon>
            <span>Export Standings (Excel)</span>
          </button>
          
          <button
            onClick={onRestart}
            style={{
              background: 'linear-gradient(135deg, #F36E21 0%, #FF8A3D 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              padding: '1rem 2.5rem',
              fontSize: '1.05rem',
              fontWeight: '800',
              fontFamily: "'Outfit', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(243, 110, 33, 0.45)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Icon className="material-symbols-outlined">replay</Icon>
            <span>Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
