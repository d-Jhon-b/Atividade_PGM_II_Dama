import { Platform, Vibration } from 'react-native';

class SoundManager {
  constructor() {
    this.muted = false;
    this.audioCtx = null;
    this.initAudioContext();
  }

  initAudioContext() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.audioCtx = new AudioCtx();
        }
      } catch (e) {
        // AudioContext not available or blocked
      }
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15) {
    if (this.muted) return;

    if (Platform.OS === 'web' && this.audioCtx) {
      try {
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch (e) {
        // fallback
      }
    }
  }

  playMove() {
    if (this.muted) return;
    this.playTone(380, 'triangle', 0.08, 0.2);
    try {
      Vibration.vibrate(15);
    } catch (e) {}
  }

  playCapture() {
    if (this.muted) return;
    this.playTone(220, 'square', 0.12, 0.25);
    setTimeout(() => {
      this.playTone(440, 'triangle', 0.09, 0.2);
    }, 70);
    try {
      Vibration.vibrate([0, 30, 40, 30]);
    } catch (e) {}
  }

  playKing() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.16, 0.2);
      }, idx * 80);
    });
    try {
      Vibration.vibrate([0, 40, 40, 60]);
    } catch (e) {}
  }

  playWin() {
    if (this.muted) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.25, 0.25);
      }, idx * 110);
    });
    try {
      Vibration.vibrate([0, 80, 50, 80, 50, 150]);
    } catch (e) {}
  }

  playClick() {
    if (this.muted) return;
    this.playTone(600, 'sine', 0.04, 0.08);
  }
}

export const soundManager = new SoundManager();
export default soundManager;
