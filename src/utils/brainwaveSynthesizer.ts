// Real Browser Web Audio API Binaural & Brainwave Synthesizer

class BrainwaveSynthesizer {
  private ctx: AudioContext | null = null;
  private oscLeft: OscillatorNode | null = null;
  private oscRight: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  private profiles: Record<string, { baseFreq: number; diff: number }> = {
    Delta: { baseFreq: 140, diff: 2.5 }, // Deep restorative state
    Theta: { baseFreq: 200, diff: 6.0 }, // Meditation & memory assimilation
    Alpha: { baseFreq: 220, diff: 10.0 }, // Relaxed cognitive focus
    Beta: { baseFreq: 250, diff: 20.0 }, // Active problem solving
    Gamma: { baseFreq: 300, diff: 40.0 }, // Peak insight & synthesis
  };

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
  }

  public start(profile: "Delta" | "Theta" | "Alpha" | "Beta" | "Gamma" = "Beta", volume = 0.3) {
    this.stop();
    this.init();

    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const { baseFreq, diff } = this.profiles[profile] || this.profiles.Beta;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(volume * 0.15, this.ctx.currentTime); // gentle ambient level

    // Stereo panning
    const merger = this.ctx.createChannelMerger(2);

    this.oscLeft = this.ctx.createOscillator();
    this.oscLeft.type = "sine";
    this.oscLeft.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

    this.oscRight = this.ctx.createOscillator();
    this.oscRight.type = "sine";
    this.oscRight.frequency.setValueAtTime(baseFreq + diff, this.ctx.currentTime);

    this.oscLeft.connect(merger, 0, 0); // left channel
    this.oscRight.connect(merger, 0, 1); // right channel

    merger.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    this.oscLeft.start();
    this.oscRight.start();
    this.isPlaying = true;
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)) * 0.15, this.ctx.currentTime, 0.05);
    }
  }

  public stop() {
    if (this.oscLeft) {
      try {
        this.oscLeft.stop();
        this.oscLeft.disconnect();
      } catch (e) {}
      this.oscLeft = null;
    }
    if (this.oscRight) {
      try {
        this.oscRight.stop();
        this.oscRight.disconnect();
      } catch (e) {}
      this.oscRight = null;
    }
    this.isPlaying = false;
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const brainwaveSynthesizer = new BrainwaveSynthesizer();
