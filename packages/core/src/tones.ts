import { CrystallineTone } from "./types.js";

export function generateToneOscillatorConfig(
  tone: CrystallineTone,
  type: OscillatorType = "sine"
): OscillatorOptions {
  return {
    frequency: tone.frequency,
    type,
  };
}

export function createBinauralBeat(
  baseFreq: number,
  beatFreq: number
): { left: number; right: number } {
  return {
    left: baseFreq,
    right: baseFreq + beatFreq,
  };
}

export function generateHarmonicSeries(
  fundamental: number,
  harmonics: number = 8
): number[] {
  return Array.from({ length: harmonics }, (_, i) => fundamental * (i + 1));
}

export function generateSubHarmonicSeries(
  fundamental: number,
  divisions: number = 6
): number[] {
  return Array.from({ length: divisions }, (_, i) => fundamental / Math.pow(2, i + 1));
}

export function closestNote(frequency: number): string {
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const A4 = 440;
  const semitones = 12 * Math.log2(frequency / A4);
  const index = Math.round(semitones) % 12;
  const octave = 4 + Math.floor((Math.round(semitones) + 9) / 12);
  return `${notes[(index + 12) % 12]}${octave}`;
}

export function freqToMidi(frequency: number): number {
  return 69 + 12 * Math.log2(frequency / 440);
}

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
