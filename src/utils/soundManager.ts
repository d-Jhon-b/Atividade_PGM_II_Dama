// src/utils/soundManager.ts - Gerenciador de efeitos sonoros e vibração
import { Platform, Vibration } from 'react-native';

class SoundManager {
  private muted: boolean = false;
  private audioCtx: any = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.audioCtx = new AudioCtx();
        }
      } catch {
        // AudioContext indisponível ou bloqueado
      }
    }
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.1, gainVal: number = 0.15) {
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
      } catch {
        // Fallback
      }
    }
  }

  public playMove() {
    if (this.muted) return;
    this.playTone(380, 'triangle', 0.08, 0.2);
    try {
      Vibration.vibrate(15);
    } catch {
      // Ignora erro de vibração
    }
  }

  public playCapture() {
    if (this.muted) return;
    this.playTone(220, 'square', 0.12, 0.25);
    setTimeout(() => {
      this.playTone(440, 'triangle', 0.09, 0.2);
    }, 70);
    try {
      Vibration.vibrate([0, 30, 40, 30]);
    } catch {
      // Ignora erro de vibração
    }
  }

  public playKing() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.16, 0.2);
      }, idx * 80);
    });
    try {
      Vibration.vibrate([0, 40, 40, 60]);
    } catch {
      // Ignora erro de vibração
    }
  }

  public playWin() {
    if (this.muted) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.25, 0.25);
      }, idx * 110);
    });
    try {
      Vibration.vibrate([0, 80, 50, 80, 50, 150]);
    } catch {
      // Ignora erro de vibração
    }
  }

  public playClick() {
    if (this.muted) return;
    this.playTone(600, 'sine', 0.04, 0.08);
  }
}

export const soundManager = new SoundManager();
export default soundManager;
