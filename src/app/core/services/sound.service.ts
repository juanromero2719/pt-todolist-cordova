import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('AudioContext no soportado');
      this.enabled = false;
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.enabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      // Silenciar errores de audio
    }
  }

  playSuccess(): void {
    // Sonido de éxito: dos tonos ascendentes
    this.playTone(523.25, 0.1, 'sine'); // Do
    setTimeout(() => this.playTone(659.25, 0.15, 'sine'), 100); // Mi
  }

  playComplete(): void {
    // Sonido de completado: acorde mayor
    this.playTone(523.25, 0.1, 'sine'); // Do
    setTimeout(() => this.playTone(659.25, 0.1, 'sine'), 50); // Mi
    setTimeout(() => this.playTone(783.99, 0.15, 'sine'), 100); // Sol
  }

  playDelete(): void {
    // Sonido de eliminación: tono descendente
    this.playTone(440, 0.1, 'sawtooth');
    setTimeout(() => this.playTone(330, 0.15, 'sawtooth'), 50);
  }

  playClick(): void {
    // Sonido de click suave
    this.playTone(800, 0.05, 'square');
  }

  toggle(): void {
    this.enabled = !this.enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

