
class AudioService {
  private audioContext: AudioContext | null = null;

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playBeep(frequency: number = 800, duration: number = 0.1, type: OscillatorType = 'sine') {
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playLevelUpBeep() {
    // Standard high beep for "Beep Test" level changes or timer end
    this.playBeep(1200, 0.3, 'square');
  }

  playTick() {
    // Subtle tick for the final 5 seconds
    this.playBeep(600, 0.05, 'sine');
  }
}

export const audioService = new AudioService();
