import diceRollSound from '../sounds/Dice rolling.mp3';
import scamHitSound from '../sounds/Scam square hit.mp3';
import protectionHitSound from '../sounds/Protection square hit.mp3';
import winSound from '../sounds/Winnergame over.mp3';
import moveSound from '../sounds/Button click (UI).mp3';
import captureSound from '../sounds/Token capturedkilled.mp3';
import turnChangeSound from '../sounds/Player turn change.mp3';

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const playSynth = (type) => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  const now = audioCtx.currentTime;
  
  if (type === 'dice') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
    setTimeout(() => playSynth('dice-tick'), 100);
    setTimeout(() => playSynth('dice-tick'), 200);
  } else if (type === 'dice-tick') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(200 + Math.random()*200, now);
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'scam') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.3);
    gainNode.gain.setValueAtTime(0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'protection') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
    gainNode.gain.setValueAtTime(0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  } else if (type === 'win') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.setValueAtTime(500, now + 0.2);
    osc.frequency.setValueAtTime(600, now + 0.4);
    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.linearRampToValueAtTime(0.01, now + 0.6);
    osc.start(now);
    osc.stop(now + 0.6);
  } else if (type === 'move') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  }
};

export const playSound = (type) => {
  const soundPaths = {
    'dice': diceRollSound,
    'scam': scamHitSound,
    'protection': protectionHitSound,
    'win': winSound,
    'move': moveSound,
    'capture': captureSound,
    'turn': turnChangeSound
  };

  const path = soundPaths[type];
  if (!path) {
    playSynth(type);
    return;
  }

  const audio = new Audio(path);
  audio.play().catch(e => {
    console.warn(`Could not play ${path}`, e);
    playSynth(type);
  });
};
