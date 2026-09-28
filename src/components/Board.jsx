import React from 'react';

// You will need to fill in the exact coordinates (row, col) from the spec
// Rows and Cols are 0-indexed (0 to 14)
const SPECIAL_CELLS = {
  '12,7': { type: 'S', num: 1 }, '7,3': { type: 'S', num: 2 }, '3,8': { type: 'S', num: 3 }, '8,12': { type: 'S', num: 4 }, '11,8': { type: 'S', num: 5 },
  '8,4': { type: 'S', num: 6 }, '4,7': { type: 'S', num: 7 }, '7,11': { type: 'S', num: 8 }, '7,1': { type: 'S', num: 9 }, '7,14': { type: 'S', num: 10 },
  '12,8': { type: 'P', num: 1 }, '11,7': { type: 'P', num: 2 }, '8,3': { type: 'P', num: 3 }, '5,7': { type: 'P', num: 4 }, '1,7': { type: 'P', num: 5 },
  '14,7': { type: 'P', num: 6 }, '7,4': { type: 'P', num: 7 }, '7,12': { type: 'P', num: 8 }, '8,11': { type: 'P', num: 9 }, '5,9': { type: 'P', num: 10 }
};

const renderCells = () => {
  const cells = [];
  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      // Skip bases
      if (r < 6 && c < 6) continue; // TL
      if (r < 6 && c > 8) continue; // TR
      if (r > 8 && c < 6) continue; // BL
      if (r > 8 && c > 8) continue; // BR
      // Skip center
      if (r >= 6 && r <= 8 && c >= 6 && c <= 8) continue;

      let isHomeStretch = false;
      let bgColor = '#F9F1DC'; // Cream

      // Home stretches
      if (r === 7 && c >= 1 && c <= 5) {
        isHomeStretch = true;
        bgColor = '#F36E21'; // Orange
      } else if (c === 7 && r >= 1 && r <= 5) {
        isHomeStretch = true;
        bgColor = '#FFD100'; // Yellow
      } else if (r === 7 && c >= 9 && c <= 13) {
        isHomeStretch = true;
        bgColor = '#E31837'; // Red
      } else if (c === 7 && r >= 9 && r <= 13) {
        isHomeStretch = true;
        bgColor = '#2E2B6B'; // Navy
      }

      const special = SPECIAL_CELLS[`${r},${c}`];

      cells.push(
        <div 
          key={`${r}-${c}`} 
          style={{ 
            gridRow: r + 1, 
            gridColumn: c + 1,
            backgroundColor: bgColor,
            border: '1px solid #ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {special && (
            <div style={{
              width: '80%',
              height: '80%',
              borderRadius: '8px',
              backgroundColor: special.type === 'S' ? '#E31837' : '#2E8B57',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
              boxShadow: special.type === 'S' ? '0 0 8px rgba(227, 24, 55, 0.8)' : '0 0 8px rgba(46, 139, 87, 0.8)'
            }}>
              {special.type}{special.num}
            </div>
          )}
        </div>
      );
    }
  }
  return cells;
};

const Base = ({ startRow, startCol, color }) => (
  <div style={{
    gridRow: `${startRow} / ${startRow + 6}`,
    gridColumn: `${startCol} / ${startCol + 6}`,
    backgroundColor: color,
    border: '1px solid #ccc',
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gridTemplateRows: 'repeat(6, 1fr)',
  }}>
    <div style={{
      gridRow: '2 / 6',
      gridColumn: '2 / 6',
      backgroundColor: '#fff',
      borderRadius: '16px',
      display: 'grid',
      // This 4x4 grid perfectly maps to the 4x4 cells of the outer board inside this white box
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: 'repeat(4, 1fr)',
    }}>
      {/* Top Left Circle: Spans local rows 1-2, cols 1-2 */}
      <div style={{ gridArea: '1 / 1 / 3 / 3', padding: '15%' }}>
        <div style={{ width: '100%', height: '100%', backgroundColor: color, borderRadius: '50%', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.3)' }}></div>
      </div>
      {/* Top Right Circle: Spans local rows 1-2, cols 3-4 */}
      <div style={{ gridArea: '1 / 3 / 3 / 5', padding: '15%' }}>
        <div style={{ width: '100%', height: '100%', backgroundColor: color, borderRadius: '50%', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.3)' }}></div>
      </div>
      {/* Bottom Left Circle: Spans local rows 3-4, cols 1-2 */}
      <div style={{ gridArea: '3 / 1 / 5 / 3', padding: '15%' }}>
        <div style={{ width: '100%', height: '100%', backgroundColor: color, borderRadius: '50%', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.3)' }}></div>
      </div>
      {/* Bottom Right Circle: Spans local rows 3-4, cols 3-4 */}
      <div style={{ gridArea: '3 / 3 / 5 / 5', padding: '15%' }}>
        <div style={{ width: '100%', height: '100%', backgroundColor: color, borderRadius: '50%', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.3)' }}></div>
      </div>
    </div>
  </div>
);

export default function Board({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Header section with NSE Logo */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '6px 14px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <img 
              src="/nse-logo.png" 
              alt="NSE Logo" 
              style={{ height: '36px', width: 'auto', display: 'block', objectFit: 'contain' }} 
            />
          </div>
          <h1 style={{ 
            color: '#FFFFFF', 
            fontSize: '2.6rem', 
            margin: 0, 
            fontWeight: '900', 
            letterSpacing: '1px', 
            fontFamily: "'Outfit', sans-serif",
            textShadow: '0 2px 12px rgba(0,0,0,0.5)'
          }}>
            INVEST SAFE LUDO
          </h1>
        </div>
        
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, rgba(243, 110, 33, 0.18) 0%, rgba(46, 43, 107, 0.45) 100%)',
          padding: '0.45rem 1.35rem',
          borderRadius: '9999px',
          border: '1px solid rgba(243, 110, 33, 0.45)',
          boxShadow: '0 0 20px rgba(243, 110, 33, 0.25)',
          marginBottom: '0.6rem'
        }}>
          <span style={{ color: '#FF9248', fontWeight: '800', fontSize: '1.05rem', letterSpacing: '0.02em', fontFamily: "'Outfit', sans-serif" }}>
            "Soch Kar, Samajh Kar, Invest Kar"
          </span>
        </div>

        <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: 0, fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          DODGE THE SCAMS · TRUST THE SAFEGUARDS · RACE TO FINANCIAL FREEDOM
        </p>
      </div>

      {/* Board container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(15, 40px)',
        gridTemplateRows: 'repeat(15, 40px)',
        gap: '0',
        backgroundColor: '#fff',
        border: '3px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(243, 110, 33, 0.2)',
        padding: '0',
        position: 'relative'
      }}>
        
        {/* Bases */}
        <Base startRow={1} startCol={1} color="#F36E21" /> {/* TL Orange */}
        <Base startRow={1} startCol={10} color="#FFD100" /> {/* TR Yellow */}
        <Base startRow={10} startCol={1} color="#2E2B6B" /> {/* BL Navy Blue */}
        <Base startRow={10} startCol={10} color="#E31837" /> {/* BR Red */}

        {/* Path Cells */}
        {renderCells()}

        {/* Center Triangles */}
        <div style={{ gridRow: '7 / 10', gridColumn: '7 / 10', position: 'relative' }}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none">
            {/* Top Triangle - Yellow */}
            <polygon points="0,0 100,0 50,50" fill="#FFD100" stroke="#ccc" strokeWidth="1" />
            {/* Right Triangle - Red */}
            <polygon points="100,0 100,100 50,50" fill="#E31837" stroke="#ccc" strokeWidth="1" />
            {/* Bottom Triangle - Navy Blue */}
            <polygon points="0,100 100,100 50,50" fill="#2E2B6B" stroke="#ccc" strokeWidth="1" />
            {/* Left Triangle - Orange */}
            <polygon points="0,0 0,100 50,50" fill="#F36E21" stroke="#ccc" strokeWidth="1" />
          </svg>
        </div>
        
        {/* Render dynamic elements like tokens */}
        {children}

      </div>
    </div>
  );
}
