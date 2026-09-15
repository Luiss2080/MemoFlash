let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, type, duration, vol) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export const sound = {
  init: initAudio,
  flip: (enabled) => enabled && playTone(300, 'sine', 0.1, 0.1),
  match: (enabled) => {
    if (!enabled) return;
    playTone(600, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(800, 'sine', 0.2, 0.1), 100);
  },
  error: (enabled) => enabled && playTone(150, 'sawtooth', 0.2, 0.1),
  win: (enabled) => {
    if (!enabled) return;
    [400, 500, 600, 800, 1000].forEach((f, i) => {
      setTimeout(() => playTone(f, 'square', 0.1, 0.1), i * 100);
    });
  }
};
