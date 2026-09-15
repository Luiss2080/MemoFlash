export const sound = {
  ctx: null,
  bgmInterval: null,
  bgmEnabled: false,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  playTone(freq, type, duration, vol, enabled) {
    if (!enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },

  flip(enabled) {
    this.playTone(300, 'sine', 0.1, 0.1, enabled);
  },

  match(enabled) {
    if (!enabled) return;
    this.playTone(440, 'square', 0.1, 0.1, true);
    setTimeout(() => this.playTone(880, 'square', 0.2, 0.1, true), 100);
  },

  error(enabled) {
    this.playTone(150, 'sawtooth', 0.2, 0.1, enabled);
  },

  win(enabled) {
    if (!enabled) return;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'square', 0.3, 0.1, true), i * 150);
    });
  },
  
  toggleBgm(enabled) {
    this.bgmEnabled = enabled;
    if (!enabled) {
      if (this.bgmInterval) {
        clearInterval(this.bgmInterval);
        this.bgmInterval = null;
      }
      return;
    }
    
    if (this.bgmInterval) return; // already playing
    
    this.init();
    const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C
    let step = 0;
    
    this.bgmInterval = setInterval(() => {
      this.playTone(notes[step % notes.length], 'triangle', 0.2, 0.03, this.bgmEnabled);
      step++;
    }, 400); 
  }
};
