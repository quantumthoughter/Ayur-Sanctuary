export type OscillatorWaveform = "sine" | "triangle" | "sawtooth" | "square";

export interface ToneConfig {
  frequency: number;
  waveform: OscillatorWaveform;
  gain: number;
  pan?: number;
}

export interface BreathState {
  phase: "inhale" | "hold" | "exhale" | "rest" | "idle";
  progress: number;
}

export class SanctuaryAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeOscillators: Map<string, { osc: OscillatorNode; gain: GainNode }> = new Map();
  private stereoSplitter: ChannelSplitterNode | null = null;
  private isPlaying = false;

  private async ensureContext(): Promise<AudioContext> {
    if (!this.ctx || this.ctx.state === "closed") {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
      this.stereoSplitter = this.ctx.createChannelSplitter(2);
    }
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
    return this.ctx;
  }

  async startTone(id: string, config: ToneConfig): Promise<void> {
    const ctx = await this.ensureContext();
    if (this.activeOscillators.has(id)) return;

    const osc = ctx.createOscillator();
    osc.type = config.waveform;
    osc.frequency.value = config.frequency;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(config.gain, ctx.currentTime + 0.1);

    const panner = ctx.createStereoPanner?.();
    if (panner && config.pan !== undefined) {
      panner.pan.value = config.pan;
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain!);
    } else {
      osc.connect(gain);
      gain.connect(this.masterGain!);
    }

    osc.start(ctx.currentTime);
    this.activeOscillators.set(id, { osc, gain });
    this.isPlaying = true;
  }

  stopTone(id: string, fadeOut = 0.3): void {
    const entry = this.activeOscillators.get(id);
    if (!entry || !this.ctx) return;
    const { osc, gain } = entry;
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + fadeOut);
    osc.stop(this.ctx.currentTime + fadeOut + 0.05);
    setTimeout(() => {
      try { osc.disconnect(); } catch { }
      try { gain.disconnect(); } catch { }
    }, (fadeOut + 0.1) * 1000);
    this.activeOscillators.delete(id);
    if (this.activeOscillators.size === 0) this.isPlaying = false;
  }

  stopAll(): void {
    for (const id of this.activeOscillators.keys()) {
      this.stopTone(id, 0.5);
    }
  }

  async playCrystallineTone(frequency: number, duration?: number): Promise<void> {
    await this.startTone("crystalline", { frequency, waveform: "sine", gain: 0.15 });
    if (duration) {
      setTimeout(() => this.stopTone("crystalline", 1), duration * 1000);
    }
  }

  async playBinauralBeat(baseFreq: number, beatFreq: number): Promise<void> {
    await this.startTone("binaural-left", { frequency: baseFreq, waveform: "sine", gain: 0.08, pan: -1 });
    await this.startTone("binaural-right", { frequency: baseFreq + beatFreq, waveform: "sine", gain: 0.08, pan: 1 });
  }

  stopBinauralBeat(): void {
    this.stopTone("binaural-left", 0.5);
    this.stopTone("binaural-right", 0.5);
  }

  async play432Hz(): Promise<void> {
    await this.playCrystallineTone(432, undefined);
    for (const harmonic of [216, 108, 72, 54]) {
      setTimeout(() => {
        this.startTone(`harmonic-${harmonic}`, { frequency: harmonic, waveform: "sine", gain: 0.04 });
      }, 200);
    }
  }

  stop432Hz(): void {
    this.stopTone("crystalline");
    for (const harmonic of [216, 108, 72, 54]) {
      this.stopTone(`harmonic-${harmonic}`);
    }
  }

  async playSolfeggio(freq: number): Promise<void> {
    await this.startTone("solfeggio", { frequency: freq, waveform: "triangle", gain: 0.12 });
  }

  stopSolfeggio(): void {
    this.stopTone("solfeggio", 0.5);
  }

  updateBreathModulation(breathState: BreathState): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    if (breathState.phase === "inhale") {
      const target = 0.2 + breathState.progress * 0.3;
      this.masterGain.gain.linearRampToValueAtTime(target, now + 0.05);
    } else if (breathState.phase === "exhale") {
      const target = 0.5 - breathState.progress * 0.3;
      this.masterGain.gain.linearRampToValueAtTime(target, now + 0.05);
    } else if (breathState.phase === "hold" || breathState.phase === "rest") {
      this.masterGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    }
  }

  createNoise(type: "white" | "pink" | "brown"): AudioBufferSourceNode | null {
    if (!this.ctx) return null;
    const sr = this.ctx.sampleRate;
    const len = sr * 2;
    const buf = this.ctx.createBuffer(1, len, sr);
    const data = buf.getChannelData(0);

    if (type === "white") {
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    } else if (type === "pink") {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.96900 * b2 + w * 0.1538520;
        b3 = 0.86650 * b3 + w * 0.3104856;
        b4 = 0.55000 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    } else {
      let v = 0;
      for (let i = 0; i < len; i++) {
        v = (v + (Math.random() * 2 - 1) * 0.02) * 0.997;
        data[i] = v * 3;
      }
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buf;
    source.loop = true;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.02;
    source.connect(gain);
    gain.connect(this.masterGain!);
    source.start();
    return source;
  }

  get isActive(): boolean {
    return this.isPlaying;
  }

  async dispose(): Promise<void> {
    this.stopAll();
    if (this.ctx) {
      await this.ctx.close();
      this.ctx = null;
    }
  }
}

export const sanctuaryAudio = new SanctuaryAudio();
