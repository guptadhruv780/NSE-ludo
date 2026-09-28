import { PATH, HOME_STRETCHES, START_INDICES } from '../data/boardLayout';
import { squareEffects } from '../data/squareEffects';

// Constants
export const WIN_PROGRESS = 56;
export const SAFE_SPOTS = ['6,1', '1,8', '8,13', '13,6', '2,6', '6,12', '12,8', '8,2'];

export function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// Enforce strict order: Red -> Navy Blue -> Orange -> Yellow
const ORDER = ['Red', 'Navy Blue', 'Orange', 'Yellow'];

export function getNextPlayerIndex(currentIndex, players, skipTurns) {
  let newSkipTurns = [...skipTurns];
  
  // Filter standard ORDER to only include colors of currently playing players
  const activeOrder = ORDER.filter(color => players.some(p => p.color === color));
  
  if (activeOrder.length === 0) {
    return { nextIndex: 0, newSkipTurns };
  }

  const currentColor = players[currentIndex]?.color;
  let orderIndex = activeOrder.indexOf(currentColor);
  if (orderIndex === -1) orderIndex = 0;

  for (let step = 1; step <= activeOrder.length; step++) {
    const nextColor = activeOrder[(orderIndex + step) % activeOrder.length];
    const candidateIndex = players.findIndex(p => p.color === nextColor);
    
    if (candidateIndex === -1) continue;

    if (newSkipTurns[candidateIndex] > 0) {
      newSkipTurns[candidateIndex] -= 1;
    } else if (players[candidateIndex].rank === null) {
      return { nextIndex: candidateIndex, newSkipTurns };
    }
  }
  
  return { nextIndex: currentIndex, newSkipTurns };
}

export function getSpecialSquareAtCoordinate(r, c) {
  const specials = {
    '12,7': 'S1', '7,3': 'S2', '3,8': 'S3', '8,12': 'S4', '11,8': 'S5',
    '8,4': 'S6', '4,7': 'S7', '7,11': 'S8', '7,1': 'S9', '7,14': 'S10',
    '12,8': 'P1', '11,7': 'P2', '8,3': 'P3', '5,7': 'P4', '1,7': 'P5',
    '14,7': 'P6', '7,4': 'P7', '7,12': 'P8', '8,11': 'P9', '5,9': 'P10'
  };
  return specials[`${r},${c}`] || null;
}

// Get raw logical coordinates for a progress level
export function getCoordinates(color, progress) {
  if (progress === -1) return null; 
  if (progress >= WIN_PROGRESS) {
    // Return array [row, col] mapped to each color's home triangle center
    const centerMap = {
      'Red': [7, 8],
      'Yellow': [6, 7],
      'Navy Blue': [8, 7],
      'Orange': [7, 6]
    };
    return centerMap[color] || [7, 7];
  }
  
  if (progress >= 51) {
    const homeStretch = HOME_STRETCHES[color] || HOME_STRETCHES['Navy Blue'];
    return homeStretch[progress - 51];
  }
  
  const startIndex = START_INDICES[color] !== undefined ? START_INDICES[color] : START_INDICES['Navy Blue'];
  const actualIndex = (startIndex + progress) % PATH.length;
  return PATH[actualIndex];
}

// Get absolute pixel/grid coords for base slots
export function getBaseCoordinates(color, tokenIndex) {
  const map = {
    'Orange': [ [1,1], [1,3], [3,1], [3,3] ],
    'Yellow': [ [1,10], [1,12], [3,10], [3,12] ],
    'Navy Blue': [ [10,1], [10,3], [12,1], [12,3] ],
    'Red': [ [10,10], [10,12], [12,10], [12,12] ]
  };
  return map[color][tokenIndex] || map['Orange'][tokenIndex];
}

// Determine which tokens can legally move
export function getValidTokens(player, roll) {
  const valid = [];
  player.tokens.forEach((progress, index) => {
    if (progress === -1) {
      if (roll === 6 || roll === 1) valid.push(index);
    } else if (progress < WIN_PROGRESS) {
      if (progress + roll <= WIN_PROGRESS) {
        valid.push(index);
      }
    }
  });
  return valid;
}

// Find if any opponent token is on the same spot (and not safe)
export function getCapturedToken(coords, currentPlayerIndex, players) {
  for (let pIndex = 0; pIndex < players.length; pIndex++) {
    if (pIndex === currentPlayerIndex) continue;
    
    const p = players[pIndex];
    for (let tIndex = 0; tIndex < 4; tIndex++) {
      if (p.tokens[tIndex] >= 0 && p.tokens[tIndex] < WIN_PROGRESS) {
        const c = getCoordinates(p.color, p.tokens[tIndex]);
        // EXACT match checking
        if (c && c[0] === coords[0] && c[1] === coords[1]) {
          return { playerIndex: pIndex, tokenIndex: tIndex };
        }
      }
    }
  }
  return null;
}
