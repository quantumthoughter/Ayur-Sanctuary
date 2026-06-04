export function generateToneOscillatorConfig(tone, type = "sine") {
    return {
        frequency: tone.frequency,
        type,
    };
}
export function createBinauralBeat(baseFreq, beatFreq) {
    return {
        left: baseFreq,
        right: baseFreq + beatFreq,
    };
}
export function generateHarmonicSeries(fundamental, harmonics = 8) {
    return Array.from({ length: harmonics }, (_, i) => fundamental * (i + 1));
}
export function generateSubHarmonicSeries(fundamental, divisions = 6) {
    return Array.from({ length: divisions }, (_, i) => fundamental / Math.pow(2, i + 1));
}
export function closestNote(frequency) {
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const A4 = 440;
    const semitones = 12 * Math.log2(frequency / A4);
    const index = Math.round(semitones) % 12;
    const octave = 4 + Math.floor((Math.round(semitones) + 9) / 12);
    return `${notes[(index + 12) % 12]}${octave}`;
}
export function freqToMidi(frequency) {
    return 69 + 12 * Math.log2(frequency / 440);
}
export function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
}
//# sourceMappingURL=tones.js.map