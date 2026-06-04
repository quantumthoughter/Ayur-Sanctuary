import { CrystallineTone } from "./types.js";
export declare function generateToneOscillatorConfig(tone: CrystallineTone, type?: OscillatorType): OscillatorOptions;
export declare function createBinauralBeat(baseFreq: number, beatFreq: number): {
    left: number;
    right: number;
};
export declare function generateHarmonicSeries(fundamental: number, harmonics?: number): number[];
export declare function generateSubHarmonicSeries(fundamental: number, divisions?: number): number[];
export declare function closestNote(frequency: number): string;
export declare function freqToMidi(frequency: number): number;
export declare function midiToFreq(midi: number): number;
//# sourceMappingURL=tones.d.ts.map