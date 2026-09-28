import React, { useState } from 'react';
import RegistrationScreen from './components/RegistrationScreen.jsx';
import Board from './components/Board.jsx';
import Dice from './components/Dice.jsx';
import Token from './components/Token.jsx';
import SquareEffectPopup from './components/SquareEffectPopup.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';
import WinnerCelebration from './components/WinnerCelebration.jsx';
import { exportToExcel } from './utils/exportExcel.js';
import { 
  getSpecialSquareAtCoordinate, getCoordinates, getBaseCoordinates, 
  getNextPlayerIndex, getValidTokens, getCapturedToken, WIN_PROGRESS 
} from './utils/gameLogic.js';
import { squareEffects } from './data/squareEffects.js';
import { playSound } from './utils/soundManager.js';

export default function App() {
  // Show registration screen first
  const [screen, setScreen] = useState('registration');
  const [players, setPlayers] = useState([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  
  // Game state
  const [skipTurns, setSkipTurns] = useState([0, 0, 0, 0]);
  const [isImmune, setIsImmune] = useState([false, false, false, false]);
  const [skipProtection, setSkipProtection] = useState([false, false, false, false]);
  
  // Selection state when multiple tokens can move
  const [pendingRoll, setPendingRoll] = useState(null);
  const [selectableTokens, setSelectableTokens] = useState([]);
  const [movingToken, setMovingToken] = useState(null); // { pIndex, tIndex }
  const [activeEffect, setActiveEffect] = useState(null);
  const [winnerCelebration, setWinnerCelebration] = useState(null);

  const handleRegistrationComplete = (playersData) => {
    const initPlayers = playersData.map(p => ({ 
      ...p, 
      tokens: [-1, -1, -1, -1], 
      rank: null 
    }));
    setPlayers(initPlayers);
    setSkipTurns(new Array(initPlayers.length).fill(0));
    setIsImmune(new Array(initPlayers.length).fill(false));
    setSkipProtection(new Array(initPlayers.length).fill(false));
    
    // Start with the first active player according to turn order: Red -> Navy Blue -> Orange -> Yellow
    const order = ['Red', 'Navy Blue', 'Orange', 'Yellow'];
    const activeColorsInOrder = order.filter(color => initPlayers.some(p => p.color === color));
    const firstPlayerIndex = initPlayers.findIndex(p => p.color === activeColorsInOrder[0]);
    setCurrentTurnIndex(firstPlayerIndex !== -1 ? firstPlayerIndex : 0);

    localStorage.setItem('investSafeLudoPlayers', JSON.stringify(initPlayers));
    setScreen('game');
  };

  const checkWinner = (newPlayers) => {
    let anyWon = false;
    let newlyFinishedWinner = null;

    newPlayers.forEach((p) => {
      if (p.rank === null && p.tokens.every(t => t >= WIN_PROGRESS)) {
        const currentRank = newPlayers.filter(x => x.rank !== null).length + 1;
        p.rank = currentRank;
        anyWon = true;
        if (!newlyFinishedWinner) newlyFinishedWinner = p;
      }
    });

    const unfinished = newPlayers.filter(p => p.rank === null);
    // When only 1 player remains and at least 1 player has finished, assign last rank and end game
    if (unfinished.length <= 1 && newPlayers.length > 1) {
      if (unfinished.length === 1 && newPlayers.some(p => p.rank !== null)) {
        unfinished[0].rank = newPlayers.length;
      }
      const topWinner = newPlayers.find(p => p.rank === 1) || newlyFinishedWinner || newPlayers[0];
      playSound('win');
      setWinnerCelebration(topWinner);
    } else if (newPlayers.every(p => p.rank !== null)) {
      const topWinner = newPlayers.find(p => p.rank === 1) || newlyFinishedWinner || newPlayers[0];
      playSound('win');
      setWinnerCelebration(topWinner);
    }
  };

  const handleDiceRoll = (roll) => {
    const cpIndex = currentTurnIndex;
    const player = players[cpIndex];

    const validTokens = getValidTokens(player, roll);

    if (validTokens.length === 0) {
      // Cannot move any tokens
      setTimeout(() => passTurn(roll === 6), 500);
      return;
    }

    if (validTokens.length === 1) {
      // Auto move
      executeMove(cpIndex, validTokens[0], roll);
    } else {
      // Wait for user to select a token
      setPendingRoll(roll);
      setSelectableTokens(validTokens);
    }
  };

  const handleTokenClick = (pIndex, tIndex) => {
    if (pendingRoll === null || pIndex !== currentTurnIndex) return;
    if (!selectableTokens.includes(tIndex)) return;

    const roll = pendingRoll;
    setPendingRoll(null);
    setSelectableTokens([]);
    executeMove(pIndex, tIndex, roll);
  };

  const executeMove = (pIndex, tIndex, roll) => {
    setMovingToken({ pIndex, tIndex });
    
    let newProgress = players[pIndex].tokens[tIndex] === -1 ? 0 : players[pIndex].tokens[tIndex] + roll;
    if (newProgress > WIN_PROGRESS) newProgress = WIN_PROGRESS;
    
    playSound('move');

    setTimeout(() => {
      const newPlayers = JSON.parse(JSON.stringify(players)); // deep copy
      newPlayers[pIndex].tokens[tIndex] = newProgress;
      
      setMovingToken(null);
      let rolledSix = roll === 6;

      // 1. Check Capture
      if (newProgress >= 0 && newProgress < WIN_PROGRESS) {
        const coords = getCoordinates(newPlayers[pIndex].color, newProgress);
        if (coords) {
          const cap = getCapturedToken(coords, pIndex, newPlayers);
          if (cap) {
            newPlayers[cap.playerIndex].tokens[cap.tokenIndex] = -1; // Send home
            playSound('capture');
          }

          // 2. Check Special Squares
          const squareId = getSpecialSquareAtCoordinate(coords[0], coords[1]);
          if (squareId) {
            const effect = squareEffects[squareId];
            setPlayers(newPlayers);
            handleSpecialSquare(squareId, effect, pIndex, tIndex, newPlayers, rolledSix);
            return;
          }
        }
      }

      setPlayers(newPlayers);
      checkWinner(newPlayers);
      passTurn(rolledSix);

    }, 500); // 500ms token move delay
  };

  const handleSpecialSquare = (squareId, effect, pIndex, tIndex, newPlayers, rolledSix) => {
    if (!effect) return;
    const player = newPlayers[pIndex];
    const newSkipTurns = [...skipTurns];
    const newImmune = [...isImmune];
    const newSkipProtection = [...skipProtection];
    let extraTurnGranted = rolledSix;

    if (effect.type === 'scam') {
      playSound('scam');
      if (newImmune[pIndex]) {
        // Immunity blocks scam
        newImmune[pIndex] = false;
        setIsImmune(newImmune);
        setActiveEffect({
          ...effect,
          id: squareId,
          customDescription: '🛡️ Scam Blocked! Your Protection Immunity saved your token from this penalty.'
        });
      } else {
        // Execute scam effect
        if (effect.effect === 'sendHome') {
          player.tokens[tIndex] = -1;
        } else if (effect.effect === 'skipTurn') {
          newSkipTurns[pIndex] += (effect.value || 1);
        } else if (effect.effect === 'moveBack') {
          player.tokens[tIndex] = Math.max(0, player.tokens[tIndex] - (effect.value || 0));
        } else if (effect.effect === 'skipNextProtectionBonus') {
          newSkipProtection[pIndex] = true;
        }
        
        setPlayers([...newPlayers]);
        setSkipTurns(newSkipTurns);
        setIsImmune(newImmune);
        setSkipProtection(newSkipProtection);
        setActiveEffect({ ...effect, id: squareId });
      }
    } else if (effect.type === 'protection') {
      playSound('protection');
      if (newSkipProtection[pIndex]) {
        // Dabba trading penalty cancels this protection bonus
        newSkipProtection[pIndex] = false;
        setSkipProtection(newSkipProtection);
        setActiveEffect({
          ...effect,
          id: squareId,
          customDescription: '⚠️ Bonus Forfeited! The Dabba Trading penalty cancelled this Protection bonus.'
        });
      } else {
        // Execute protection effect
        if (effect.effect === 'moveAhead') {
          player.tokens[tIndex] = Math.min(WIN_PROGRESS, player.tokens[tIndex] + (effect.value || 0));
        } else if (effect.effect === 'rollAgain') {
          extraTurnGranted = true;
        } else if (effect.effect === 'immuneNextScam') {
          newImmune[pIndex] = true;
        }

        setPlayers([...newPlayers]);
        setSkipTurns(newSkipTurns);
        setIsImmune(newImmune);
        setSkipProtection(newSkipProtection);
        setActiveEffect({ ...effect, id: squareId });
      }
    }

    const closeHandler = () => {
      setActiveEffect(null);
      checkWinner(newPlayers);
      passTurn(extraTurnGranted);
    };
    
    setActiveEffect(prev => prev ? { ...prev, onClose: closeHandler } : null);
  };

  const passTurn = (rolledSix) => {
    if (rolledSix) {
      // Extra turn, keep current turn
      return;
    }
    const { nextIndex, newSkipTurns } = getNextPlayerIndex(currentTurnIndex, players, skipTurns);
    setSkipTurns(newSkipTurns);
    setCurrentTurnIndex(nextIndex);
    playSound('turn');
  };

  const getPlayerColorHex = (colorName) => {
    switch(colorName?.toLowerCase()) {
      case 'orange': return '#F36E21';
      case 'yellow': return '#FFD100';
      case 'navy blue': return '#2E2B6B';
      case 'red': return '#E31837';
      default: return '#333';
    }
  };

  // Pre-calculate token overlaps to offset them visually
  const tokenPlacements = [];
  players.forEach((p, pIndex) => {
    p.tokens.forEach((progress, tIndex) => {
      if (progress === -1) {
        const c = getBaseCoordinates(p.color, tIndex);
        tokenPlacements.push({ pIndex, tIndex, r: c[0], c: c[1], isBase: true, isHome: false });
      } else if (progress >= WIN_PROGRESS) {
        const c = getCoordinates(p.color, progress);
        if (c) tokenPlacements.push({ pIndex, tIndex, r: c[0], c: c[1], isBase: false, isHome: true });
      } else {
        const c = getCoordinates(p.color, progress);
        if (c) tokenPlacements.push({ pIndex, tIndex, r: c[0], c: c[1], isBase: false, isHome: false });
      }
    });
  });

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {screen === 'registration' && (
        <RegistrationScreen onContinue={handleRegistrationComplete} />
      )}
      
      {screen === 'game' && (
        <div style={{ 
          minHeight: '100vh',
          background: 'radial-gradient(circle at 50% 0%, #1a1642 0%, #0d0c1c 65%, #07060e 100%)',
          padding: '2rem 1rem 3rem 1rem', 
          display: 'flex', 
          gap: '2.5rem', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          position: 'relative',
          overflowX: 'hidden'
        }}>
          {/* Decorative Ambient Background Orbs */}
          <div style={{
            position: 'absolute',
            top: '5%',
            left: '10%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(243, 110, 33, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
            filter: 'blur(70px)',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            top: '30%',
            right: '8%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(0, 219, 233, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
            filter: 'blur(80px)',
            zIndex: 0
          }} />
          
          {/* Main Board Area */}
          <div style={{ flex: '0 0 auto', position: 'relative', zIndex: 1 }}>
            <Board>
              {tokenPlacements.map((tp, idx) => {
                const player = players[tp.pIndex];
                const isSelectable = pendingRoll !== null && tp.pIndex === currentTurnIndex && selectableTokens.includes(tp.tIndex);
                const isMoving = movingToken?.pIndex === tp.pIndex && movingToken?.tIndex === tp.tIndex;
                
                // Count how many tokens are on this exact square to offset them
                const sharingSquare = tokenPlacements.filter(o => !o.isBase && o.r === tp.r && o.c === tp.c);
                let offsetX = 0;
                let offsetY = 0;
                if (!tp.isBase && sharingSquare.length > 1) {
                  const shareIndex = sharingSquare.findIndex(o => o.pIndex === tp.pIndex && o.tIndex === tp.tIndex);
                  // simple 4-corner offset
                  const offsets = [ [-4, -4], [4, -4], [-4, 4], [4, 4], [0,0], [8,0] ];
                  offsetX = offsets[shareIndex % offsets.length][0];
                  offsetY = offsets[shareIndex % offsets.length][1];
                }

                return (
                  <div 
                    key={`${tp.pIndex}-${tp.tIndex}`}
                    onClick={() => handleTokenClick(tp.pIndex, tp.tIndex)}
                    style={{
                      gridRow: tp.isBase ? `${tp.r + 1} / ${tp.r + 3}` : tp.r + 1,
                      gridColumn: tp.isBase ? `${tp.c + 1} / ${tp.c + 3}` : tp.c + 1,
                      width: tp.isBase ? '28px' : '60%',
                      height: tp.isBase ? '28px' : '60%',
                      placeSelf: 'center',
                      backgroundColor: getPlayerColorHex(player.color),
                      borderRadius: '50%',
                      border: isSelectable ? '3px solid #fff' : '2px solid rgba(255,255,255,0.7)',
                      boxShadow: isSelectable 
                        ? '0 0 12px 6px rgba(255,255,255,0.9)' 
                        : (isMoving ? '0 0 12px 4px rgba(255,255,255,0.8)' : '0 2px 4px rgba(0,0,0,0.4)'),
                      zIndex: isSelectable || isMoving ? 100 : 10,
                      transition: 'all 0.3s ease',
                      transform: `translate(${offsetX}px, ${offsetY}px) ${isSelectable || isMoving ? 'scale(1.3)' : 'scale(1)'}`,
                      cursor: isSelectable ? 'pointer' : 'default',
                      animation: isSelectable ? 'pulse 1s infinite' : 'none'
                    }}
                  />
                );
              })}
            </Board>
            <style>{`
              @keyframes pulse {
                0% { transform: scale(1.1); box-shadow: 0 0 0 0 rgba(255,255,255,0.7); }
                70% { transform: scale(1.3); box-shadow: 0 0 0 10px rgba(255,255,255,0); }
                100% { transform: scale(1.1); box-shadow: 0 0 0 0 rgba(255,255,255,0); }
              }
            `}</style>
          </div>

          {/* Sidebar / HUD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '340px', position: 'relative', zIndex: 1, marginTop: '0.5rem' }}>
            
            {/* Players Card */}
            <div style={{ 
              backgroundColor: 'rgba(26, 24, 52, 0.85)', 
              backdropFilter: 'blur(25px)',
              padding: '1.5rem', 
              borderRadius: '20px', 
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6), 0 0 25px rgba(243, 110, 33, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.35rem', fontWeight: '800', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.01em' }}>
                  Players
                </h2>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: '700', 
                  color: '#FFBE93', 
                  backgroundColor: 'rgba(243, 110, 33, 0.18)', 
                  padding: '4px 10px', 
                  borderRadius: '8px',
                  border: '1px solid rgba(243, 110, 33, 0.35)'
                }}>
                  Turn: {players[currentTurnIndex]?.name || `Player ${currentTurnIndex + 1}`}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {players.map((p, i) => {
                  const isCurrent = currentTurnIndex === i;
                  const colorHex = getPlayerColorHex(p.color);
                  return (
                    <div key={i} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.9rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '14px',
                      border: isCurrent ? `2px solid ${colorHex}` : '1px solid rgba(255, 255, 255, 0.08)',
                      backgroundColor: isCurrent ? 'rgba(35, 32, 70, 0.95)' : 'rgba(13, 12, 28, 0.65)',
                      boxShadow: isCurrent ? `0 0 20px -2px ${colorHex}55, inset 0 0 12px ${colorHex}22` : 'none',
                      transition: 'all 0.25s ease'
                    }}>
                      {/* Player Color Token Circle */}
                      <div style={{ 
                        width: '28px', 
                        height: '28px', 
                        backgroundColor: colorHex, 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: '800',
                        fontSize: '0.78rem',
                        boxShadow: `0 2px 8px ${colorHex}88`,
                        flexShrink: 0
                      }}>
                        {i + 1}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ 
                          fontWeight: '800', 
                          display: 'block', 
                          color: '#FFFFFF',
                          fontSize: '1.05rem',
                          fontFamily: "'Outfit', sans-serif",
                          lineHeight: 1.2
                        }}>
                          {p.name || `Player ${i + 1}`} {p.rank ? `(Finished #${p.rank})` : ''}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: '600' }}>
                            {p.color}
                          </span>
                          {p.org && (
                            <>
                              <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
                              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {p.org}
                              </span>
                            </>
                          )}
                        </div>
                        {skipTurns[i] > 0 && (
                          <span style={{ fontSize: '0.75rem', color: '#F87171', fontWeight: '700', display: 'block', marginTop: '3px' }}>
                            ⚠️ Skips remaining: {skipTurns[i]}
                          </span>
                        )}
                        {isImmune[i] && (
                          <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: '700', display: 'block', marginTop: '3px' }}>
                            🛡️ Immune to next Scam!
                          </span>
                        )}
                      </div>

                      {isCurrent && (
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: '800', 
                          color: colorHex, 
                          backgroundColor: `${colorHex}25`, 
                          border: `1px solid ${colorHex}66`,
                          padding: '3px 8px', 
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}>
                          Rolling
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dice Card */}
            <div style={{ 
              backgroundColor: 'rgba(26, 24, 52, 0.85)', 
              backdropFilter: 'blur(25px)',
              padding: '1.75rem', 
              borderRadius: '20px', 
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}>
              <Dice 
                onRoll={handleDiceRoll} 
                disabled={movingToken !== null || activeEffect !== null || pendingRoll !== null}
                currentPlayerColor={getPlayerColorHex(players[currentTurnIndex]?.color)}
              />

              {pendingRoll !== null && (
                <div style={{ 
                  marginTop: '1.25rem', 
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  color: '#FCA5A5', 
                  fontWeight: '700', 
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  lineHeight: 1.4
                }}>
                  You rolled a <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 900 }}>{pendingRoll}</span>! <br/>
                  Click a highlighted token to move it.
                </div>
              )}
            </div>

            {/* Action Buttons Card */}
            <div style={{ 
              backgroundColor: 'rgba(26, 24, 52, 0.85)', 
              backdropFilter: 'blur(25px)',
              padding: '1.25rem', 
              borderRadius: '20px', 
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.85rem' 
            }}>
              <button 
                onClick={() => exportToExcel(players)}
                style={{ 
                  padding: '0.85rem', 
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  cursor: 'pointer', 
                  fontWeight: '700',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(5, 150, 105, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                <span>Export Standings (Excel)</span>
              </button>

              <button 
                onClick={() => setScreen('results')}
                style={{ 
                  padding: '0.85rem', 
                  background: 'linear-gradient(135deg, #F36E21 0%, #C2410C 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  cursor: 'pointer', 
                  fontWeight: '700',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(243, 110, 33, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>flag</span>
                <span>End Game Early</span>
              </button>
            </div>
          </div>

          {activeEffect && (
            <SquareEffectPopup 
              effectData={activeEffect} 
              onClose={activeEffect.onClose} 
            />
          )}

          {winnerCelebration && (
            <WinnerCelebration 
              winner={winnerCelebration} 
              onComplete={() => {
                setWinnerCelebration(null);
                setScreen('results');
              }} 
            />
          )}
        </div>
      )}

      {screen === 'results' && (
        <ResultsScreen players={players} onRestart={() => setScreen('registration')} />
      )}
    </div>
  );
}
