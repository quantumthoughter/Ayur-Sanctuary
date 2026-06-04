import { CrystallineTone, ColorCode, ResonanceSignature, TONES, SOLFEGGIO } from "./types.js";

export function generateResonanceKey(seed?: string): string {
  const ts = Date.now().toString(16);
  const rand = Math.random().toString(16).slice(2, 10);
  const sig = seed ? seed.slice(0, 8) : "AYUR";
  return `${sig}-${ts}-${rand}`.toUpperCase();
}

export function selectCrystallineTone(preference?: string): CrystallineTone {
  const tones = Object.values(TONES);
  if (preference && TONES[preference]) return TONES[preference];
  return tones[Math.floor(Math.random() * tones.length)];
}

export function selectSolfeggio(preference?: string): CrystallineTone {
  const tones = Object.values(SOLFEGGIO);
  if (preference && SOLFEGGIO[preference]) return SOLFEGGIO[preference];
  return tones[Math.floor(Math.random() * tones.length)];
}

export function toneToColorCode(tone: CrystallineTone): ColorCode {
  const hex = tone.color;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { hex, rgb: [r, g, b], name: tone.name };
}

export function createResonanceSignature(tone?: CrystallineTone): ResonanceSignature {
  const selectedTone = tone ?? selectCrystallineTone();
  return {
    id: crypto.randomUUID(),
    crystallineTone: selectedTone,
    colorCode: toneToColorCode(selectedTone),
    primaryPath: "stillness",
    coherenceScore: 0,
    createdAt: new Date().toISOString(),
  };
}

export function computeCoherence(
  breathRate: number,
  heartRateVariability: number,
  emotionalState?: string
): number {
  let score = 0.5;
  if (breathRate >= 4 && breathRate <= 7) score += 0.2;
  if (heartRateVariability > 0.05) score += 0.15;
  if (emotionalState === "calm" || emotionalState === "peaceful") score += 0.15;
  return Math.min(Math.max(score, 0), 1);
}

export function computeLightCoherence(
  sessionsCompleted: number,
  coherenceMoments: number
): number {
  const base = sessionsCompleted * 5;
  const bonus = coherenceMoments * 2;
  return Math.min(base + bonus, 100);
}

export function frequencyToColor(freq: number): string {
  const s = Math.log(freq / 261.63) / Math.log(2);
  const hue = (s * 60 + 0) % 360;
  return `hsl(${hue}, 80%, 60%)`;
}

export function mixFrequencies(freqs: number[]): number {
  return freqs.reduce((a, b) => a + b, 0) / freqs.length;
}
