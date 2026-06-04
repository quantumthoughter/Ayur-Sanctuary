import { CrystallineTone, ColorCode, ResonanceSignature } from "./types.js";
export declare function generateResonanceKey(seed?: string): string;
export declare function selectCrystallineTone(preference?: string): CrystallineTone;
export declare function selectSolfeggio(preference?: string): CrystallineTone;
export declare function toneToColorCode(tone: CrystallineTone): ColorCode;
export declare function createResonanceSignature(tone?: CrystallineTone): ResonanceSignature;
export declare function computeCoherence(breathRate: number, heartRateVariability: number, emotionalState?: string): number;
export declare function computeLightCoherence(sessionsCompleted: number, coherenceMoments: number): number;
export declare function frequencyToColor(freq: number): string;
export declare function mixFrequencies(freqs: number[]): number;
//# sourceMappingURL=resonance.d.ts.map