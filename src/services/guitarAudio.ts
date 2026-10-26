/**
 * Web Audio API Acoustic Guitar Synthesizer & Percussion Engine
 * Uses Karplus-Strong string synthesis & physical multi-harmonic resonance
 * Runs 100% offline in browser without needing external audio files!
 */

class GuitarAudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Frequency table for guitar:
  // Standard tuning: E2 (82.41), A2 (110.00), D3 (146.83), G3 (196.00), B3 (246.94), E4 (329.63)
  private readonly openStringFreqs = [
    329.63, // Corda 1 (E4 - Mi agudo)
    246.94, // Corda 2 (B3 - Si)
    196.00, // Corda 3 (G3 - Sol)
    146.83, // Corda 4 (D3 - Ré)
    110.00, // Corda 5 (A2 - Lá)
    82.41,  // Corda 6 (E2 - Mi grave)
  ];

  public getNoteFrequency(stringIndex: number, fret: number): number {
    const baseFreq = this.openStringFreqs[stringIndex] || 82.41;
    return baseFreq * Math.pow(2, fret / 12);
  }

  /**
   * Pluck a single guitar string with Karplus-Strong physical modeling
   * Gives an organic acoustic nylon/steel plucked sound with body resonance
   */
  public playString(stringIndex: number, fret: number, duration: number = 2.2, velocity: number = 0.9): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const freq = this.getNoteFrequency(stringIndex, fret);
    const now = this.ctx.currentTime;

    // Karplus-Strong Buffer Synthesis
    const sampleRate = this.ctx.sampleRate;
    const period = Math.round(sampleRate / freq);
    const bufferLength = Math.max(2, period);
    const noiseBuffer = this.ctx.createBuffer(1, bufferLength, sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    // Initial pluck excitation (pinkish noise burst simulating pick/finger friction)
    for (let i = 0; i < bufferLength; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / bufferLength);
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Low-pass filter for natural acoustic damping (thicker strings damp high frets faster)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const cutoff = Math.min(6500, Math.max(600, freq * (stringIndex >= 3 ? 6.5 : 8.5)));
    filter.frequency.setValueAtTime(cutoff, now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(120, freq * 1.5), now + duration * 0.7);

    // Acoustic body resonance peak (simulate violão wooden body resonance around 100-220Hz)
    const bodyFilter = this.ctx.createBiquadFilter();
    bodyFilter.type = 'peaking';
    bodyFilter.frequency.setValueAtTime(190, now);
    bodyFilter.Q.setValueAtTime(1.8, now);
    bodyFilter.gain.setValueAtTime(4.0, now);

    // String gain envelope
    const stringGain = this.ctx.createGain();
    const initialVolume = Math.min(1.0, velocity * (stringIndex >= 3 ? 0.9 : 0.75));
    stringGain.gain.setValueAtTime(0.001, now);
    stringGain.gain.linearRampToValueAtTime(initialVolume, now + 0.004);
    
    // Natural acoustic decay curve
    const decayFactor = stringIndex >= 3 ? 0.35 : 0.45;
    stringGain.gain.exponentialRampToValueAtTime(initialVolume * 0.3, now + duration * decayFactor);
    stringGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Secondary subtle harmonic oscillator to add nylon body warmth
    const warmOsc = this.ctx.createOscillator();
    const warmGain = this.ctx.createGain();
    warmOsc.type = 'triangle';
    warmOsc.frequency.setValueAtTime(freq, now);
    warmGain.gain.setValueAtTime(initialVolume * 0.25, now);
    warmGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6);

    warmOsc.connect(warmGain);
    warmGain.connect(this.masterGain);

    // Connect audio graph
    noiseSource.connect(filter);
    filter.connect(bodyFilter);
    bodyFilter.connect(stringGain);
    stringGain.connect(this.masterGain);

    noiseSource.start(now);
    warmOsc.start(now);

    noiseSource.stop(now + duration);
    warmOsc.stop(now + duration);
  }

  /**
   * Play an entire chord with strum simulation (direction and speed)
   */
  public playChord(
    frets: (number | null)[], // 6 numbers (from string 6 to string 1 or string 1 to 6)
    direction: 'down' | 'up' | 'arpeggio' = 'down',
    strumSpeedMs: number = 35,
    stringsOrder: '1to6' | '6to1' = '6to1'
  ): void {
    const stringFrets = stringsOrder === '6to1' ? frets : [...frets].reverse();

    // order of strings to pluck based on strum direction
    const order = direction === 'down' 
      ? [5, 4, 3, 2, 1, 0] // 6ª corda para 1ª corda
      : [0, 1, 2, 3, 4, 5]; // 1ª corda para 6ª corda

    if (direction === 'arpeggio') {
      strumSpeedMs = 120;
    }

    let delay = 0;
    order.forEach((stringIdx) => {
      const fret = stringFrets[stringIdx];
      if (fret !== null && fret !== undefined && fret >= 0) {
        setTimeout(() => {
          this.playString(stringIdx, fret, 2.4, 0.85);
        }, delay);
        delay += strumSpeedMs;
      }
    });
  }

  /**
   * Percussive wood tap or palm mute slap (essential for Sertanejo and Guarania rhythms)
   */
  public playMuteSlap(intensity: number = 0.8): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    // Filtered noise burst for acoustic guitar body slap
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.18));
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.Q.setValueAtTime(1.2, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(intensity * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    // Low thump on the soundboard
    const thumpOsc = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    thumpOsc.type = 'sine';
    thumpOsc.frequency.setValueAtTime(140, now);
    thumpOsc.frequency.exponentialRampToValueAtTime(55, now + 0.07);

    thumpGain.gain.setValueAtTime(intensity * 0.7, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    thumpOsc.connect(thumpGain);
    thumpGain.connect(this.masterGain);

    whiteNoise.start(now);
    thumpOsc.start(now);

    whiteNoise.stop(now + 0.09);
    thumpOsc.stop(now + 0.09);
  }

  /**
   * Metronome click (high tick for downbeat, subtle woodblock tick for offbeats)
   */
  public playClick(isAccent: boolean = false): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = isAccent ? 1200 : 800;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.03);

    gain.gain.setValueAtTime(isAccent ? 0.45 : 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  /**
   * Reference pitch for tuner
   */
  public playTunerNote(stringIndex: number): void {
    this.playString(stringIndex, 0, 3.5, 0.95);
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const guitarAudio = new GuitarAudioService();
