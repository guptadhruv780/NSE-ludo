// Import Scam Card Images
import s1Img from '../pic/scam/WhatsApp Image 2026-09-24 at 1.18.49 PM (2).jpeg'; // Fake Trading App
import s2Img from '../pic/scam/WhatsApp Image 2026-09-24 at 1.18.47 PM (1).jpeg'; // Unregistered Investment Tips
import s3Img from '../pic/scam/WhatsApp Image 2026-09-24 at 1.18.49 PM.jpeg';     // Opinion Trading Scam
import s4Img from '../pic/scam/WhatsApp Image 2026-09-24 at 1.18.47 PM (2).jpeg'; // Pump & Dump Scam
import s5Img from '../pic/scam/WhatsApp Image 2026-09-24 at 1.18.47 PM.jpeg';     // Fake Trading Courses
import s6Img from '../pic/scam/WhatsApp Image 2026-09-24 at 1.18.49 PM (1).jpeg'; // Deepfake Videos
import s7Img from '../pic/scam/WhatsApp Image 2026-09-24 at 1.18.48 PM.jpeg';     // Digital Arrest Scam
import s8Img from '../pic/scam/WhatsApp Image 2026-09-24 at 1.18.46 PM (2).jpeg'; // Foreign Portfolio Scam FPI
import s9Img from '../pic/scam/WhatsApp Image 2026-09-24 at 1.18.48 PM (1).jpeg'; // Dabba Trading Scam
import s10Img from '../pic/scam/WhatsApp Image 2026-09-24 at 1.18.48 PM (2).jpeg';// Guaranteed Returns

// Import Protection Card Images
import p1Img from '../pic/protection/WhatsApp Image 2026-09-24 at 1.18.43 PM.jpeg';     // SEBI Verified App
import p2Img from '../pic/protection/WhatsApp Image 2026-09-24 at 1.18.44 PM.jpeg';     // Spot-a-Scam Tool
import p3Img from '../pic/protection/WhatsApp Image 2026-09-24 at 1.18.46 PM (1).jpeg'; // SCORES / SMART ODR
import p4Img from '../pic/protection/WhatsApp Image 2026-09-24 at 1.18.45 PM.jpeg';     // SEBI Registered Broker
import p5Img from '../pic/protection/WhatsApp Image 2026-09-24 at 1.18.45 PM (1).jpeg'; // Common Investor Service Centre (CISC)
import p6Img from '../pic/protection/WhatsApp Image 2026-09-24 at 1.18.46 PM.jpeg';     // Report Cyber Fraud (1930 / Chaksu)
import p7Img from '../pic/protection/WhatsApp Image 2026-09-24 at 1.18.43 PM (1).jpeg'; // Verify before Trust
import p8Img from '../pic/protection/WhatsApp Image 2026-09-24 at 1.18.44 PM (2).jpeg'; // SEBI CHECK
import p9Img from '../pic/protection/WhatsApp Image 2026-09-24 at 1.18.44 PM (1).jpeg'; // Deal with Registered IA
import p10Img from '../pic/protection/WhatsApp Image 2026-09-24 at 1.18.45 PM (2).jpeg';// 1600 Series Registered Calls

export const squareEffects = {
  // --- 10 SCAM SQUARES (S1 - S10) ---
  'S1': {
    id: 'S1',
    theme: 'Fake Trading App',
    type: 'scam',
    effect: 'sendHome',
    value: 0,
    title: 'Scam Alert: Fake Trading App',
    description: 'Send token back to Home! Unregulated apps steal credentials and funds.',
    image: s1Img
  },
  'S2': {
    id: 'S2',
    theme: 'Unregistered Investment Tips',
    type: 'scam',
    effect: 'sendHome',
    value: 0,
    title: 'Scam Alert: Unregistered Tips',
    description: 'Send token back to Home! Never trade on unofficial messaging groups.',
    image: s2Img
  },
  'S3': {
    id: 'S3',
    theme: 'Opinion Trading Scam',
    type: 'scam',
    effect: 'skipTurn',
    value: 1,
    title: 'Scam Alert: Opinion Trading',
    description: 'Skip 1 turn! Binary bets and opinion trading platforms are illegal.',
    image: s3Img
  },
  'S4': {
    id: 'S4',
    theme: 'Pump and Dump Scam',
    type: 'scam',
    effect: 'sendHome',
    value: 0,
    title: 'Scam Alert: Pump & Dump',
    description: 'Send token back to Home! Artificial hype leads to sudden stock crashes.',
    image: s4Img
  },
  'S5': {
    id: 'S5',
    theme: 'Fake Trading Course',
    type: 'scam',
    effect: 'moveBack',
    value: 5,
    title: 'Scam Alert: Fake Trading Course',
    description: 'Move back 5 steps! Beware of self-proclaimed "finfluencers" selling overpriced courses.',
    image: s5Img
  },
  'S6': {
    id: 'S6',
    theme: 'Deepfake Videos',
    type: 'scam',
    effect: 'skipTurn',
    value: 2,
    title: 'Scam Alert: Deepfake Videos',
    description: 'Skip 2 turns! AI deepfakes of celebrities and CEOs promote fake investment schemes.',
    image: s6Img
  },
  'S7': {
    id: 'S7',
    theme: 'Digital Arrest Scam',
    type: 'scam',
    effect: 'moveBack',
    value: 3,
    title: 'Scam Alert: Digital Arrest Call',
    description: 'Move back 3 steps! Law enforcement authorities never place you under "digital arrest".',
    image: s7Img
  },
  'S8': {
    id: 'S8',
    theme: 'Foreign Portfolio Scam (FPI)',
    type: 'scam',
    effect: 'skipTurn',
    value: 2,
    title: 'Scam Alert: FPI Scam',
    description: 'Skip 2 turns! Claims of foreign institutional accounts with guaranteed high allocation are fraudulent.',
    image: s8Img
  },
  'S9': {
    id: 'S9',
    theme: 'Dabba Trading',
    type: 'scam',
    effect: 'skipNextProtectionBonus',
    value: 0,
    title: 'Scam Alert: Dabba Trading',
    description: 'Skip next Protection bonus! Off-exchange bucket shop trading offers no investor protection.',
    image: s9Img
  },
  'S10': {
    id: 'S10',
    theme: 'Guaranteed Returns Scam',
    type: 'scam',
    effect: 'moveBack',
    value: 2,
    title: 'Scam Alert: Guaranteed Returns',
    description: 'Move back 2 steps! Legitimate equity markets cannot offer fixed guaranteed returns.',
    image: s10Img
  },

  // --- 10 PROTECTION SQUARES (P1 - P10) ---
  'P1': {
    id: 'P1',
    theme: 'SEBI Verified App',
    type: 'protection',
    effect: 'moveAhead',
    value: 2,
    title: 'Protection: SEBI Verified App',
    description: 'Move ahead 2 steps! Always trade through officially verified applications.',
    image: p1Img
  },
  'P2': {
    id: 'P2',
    theme: 'Spot-a-Scam Tool',
    type: 'protection',
    effect: 'rollAgain',
    value: 0,
    title: 'Protection: Spot-a-Scam Tool',
    description: 'Roll the dice once more! Proactive verification keeps your capital secure.',
    image: p2Img
  },
  'P3': {
    id: 'P3',
    theme: 'SCORES / SMART ODR',
    type: 'protection',
    effect: 'moveAhead',
    value: 5,
    title: 'Protection: SCORES / SMART ODR',
    description: 'Move ahead 5 steps! SEBI’s trusted dispute resolution mechanism protects your rights.',
    image: p3Img
  },
  'P4': {
    id: 'P4',
    theme: 'SEBI Registered Broker',
    type: 'protection',
    effect: 'rollAgain',
    value: 0,
    title: 'Protection: SEBI Registered Broker',
    description: 'Roll the dice once more! Trading only with licensed intermediaries ensures regulatory safety.',
    image: p4Img
  },
  'P5': {
    id: 'P5',
    theme: 'Visit a CISC Centre',
    type: 'protection',
    effect: 'moveAhead',
    value: 3,
    title: 'Protection: Common Investor Service Centre',
    description: 'Move ahead 3 steps! Common Investor Service Centres assist with offline grievance redressal.',
    image: p5Img
  },
  'P6': {
    id: 'P6',
    theme: 'Report Cyber Fraud (1930 / Chaksu)',
    type: 'protection',
    effect: 'immuneNextScam',
    value: 0,
    title: 'Protection: Report Cyber Fraud',
    description: 'Immune to next Scam! Reporting fraud promptly safeguards the entire financial system.',
    image: p6Img
  },
  'P7': {
    id: 'P7',
    theme: 'Verify Before You Trust',
    type: 'protection',
    effect: 'moveAhead',
    value: 2,
    title: 'Protection: Verify Before You Trust',
    description: 'Move ahead 2 steps! Scanning QR codes & checking credentials prevents fraud before it happens.',
    image: p7Img
  },
  'P8': {
    id: 'P8',
    theme: 'SEBI CHECK - Verify Before Pay',
    type: 'protection',
    effect: 'rollAgain',
    value: 0,
    title: 'Protection: SEBI CHECK',
    description: 'Roll the dice once more! Verify registered entity bank accounts prior to transferring funds.',
    image: p8Img
  },
  'P9': {
    id: 'P9',
    theme: 'Deal with Registered IA / RA',
    type: 'protection',
    effect: 'immuneNextScam',
    value: 0,
    title: 'Protection: Registered IA / RA',
    description: 'Immune to next Scam! Seek advice strictly from SEBI-registered Research Analysts & Advisors.',
    image: p9Img
  },
  'P10': {
    id: 'P10',
    theme: '1600 Series Call Verification',
    type: 'protection',
    effect: 'moveAhead',
    value: 2,
    title: 'Protection: Official 1600 Calls',
    description: 'Move ahead 2 steps! Legitimate intermediary calls originate only from official 1600 series numbers.',
    image: p10Img
  }
};
