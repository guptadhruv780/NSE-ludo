import React from 'react';

export default function Token({ row, col, color, isMoving }) {
  if (row === null || col === null) return null;

  return (
    <div 
      style={{
        gridRow: row + 1,
        gridColumn: col + 1,
        width: '80%',
        height: '80%',
        margin: '10%',
        backgroundColor: color,
        borderRadius: '50%',
        border: '2px solid white',
        boxShadow: isMoving ? '0 0 12px 4px rgba(255,255,255,0.8)' : '0 2px 4px rgba(0,0,0,0.4)',
        zIndex: 10,
        transition: 'all 0.3s ease',
        transform: isMoving ? 'scale(1.2)' : 'scale(1)'
      }}
    />
  );
}
