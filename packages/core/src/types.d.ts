export interface CrystallineTone {
    frequency: number;
    note: string;
    color: string;
    name: string;
}
export interface ColorCode {
    hex: string;
    rgb: [number, number, number];
    name: string;
}
export interface ResonanceSignature {
    id: string;
    crystallineTone: CrystallineTone;
    colorCode: ColorCode;
    primaryPath: PathId;
    coherenceScore: number;
    createdAt: string;
}
export interface SessionFlow {
    sessionId: string;
    resonanceKey: string;
    pathsVisited: PathId[];
    coherenceMoments: number;
    lightCoherence: number;
    startedAt: string;
    lastActivity: string;
}
export type PathId = "stillness" | "harmonic" | "detox" | "somatic" | "celestial" | "union";
export interface PathInfo {
    id: PathId;
    title: string;
    subtitle: string;
    color: string;
    icon: string;
    description: string;
}
export declare const PATHS: Record<PathId, PathInfo>;
export declare const TONES: Record<string, CrystallineTone>;
export declare const SOLFEGGIO: Record<string, CrystallineTone>;
export declare const SUB_HARMONICS_432: readonly [432, 216, 108, 72, 54, 33.5, 27, 13.5];
//# sourceMappingURL=types.d.ts.map