export const PATH = [
  // Left Arm Top
  [6,0], [6,1], [6,2], [6,3], [6,4], [6,5],
  // Top Arm Left
  [5,6], [4,6], [3,6], [2,6], [1,6], [0,6],
  // Top Arm Tip
  [0,7],
  // Top Arm Right
  [0,8], [1,8], [2,8], [3,8], [4,8], [5,8],
  // Right Arm Top
  [6,9], [6,10], [6,11], [6,12], [6,13], [6,14],
  // Right Arm Tip
  [7,14],
  // Right Arm Bot
  [8,14], [8,13], [8,12], [8,11], [8,10], [8,9],
  // Bot Arm Right
  [9,8], [10,8], [11,8], [12,8], [13,8], [14,8],
  // Bot Arm Tip
  [14,7],
  // Bot Arm Left
  [14,6], [13,6], [12,6], [11,6], [10,6], [9,6],
  // Left Arm Bot
  [8,5], [8,4], [8,3], [8,2], [8,1], [8,0],
  // Left Arm Tip
  [7,0]
];

export const HOME_STRETCHES = {
  Orange: [[7,1], [7,2], [7,3], [7,4], [7,5]],
  Yellow: [[1,7], [2,7], [3,7], [4,7], [5,7]],
  Red: [[7,13], [7,12], [7,11], [7,10], [7,9]],
  'Navy Blue': [[13,7], [12,7], [11,7], [10,7], [9,7]] // mapped properly
};

export const START_INDICES = {
  Orange: 1,
  Yellow: 14,
  Red: 27,
  'Navy Blue': 40
};
