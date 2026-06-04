import { useState, useRef, useEffect, useCallback } from "react";
import { sanctuaryAudio } from "../audio/SanctuaryAudio";
import { AvatarChat } from "../components/AvatarChat";
import { useCrystalTheme } from "../theme/CrystalThemeContext";

interface Props { resonanceKey: string }

type Pattern = "box" | "4-7-8" | "coherent" | "free";

const PATTERNS: Record<Pattern, { name: string; inhale: number; hold: number; exhale: number; rest: number }> = {
  box: { name: "Box Breath", inhale: 4, hold: 4, exhale: 4, rest: 0 },
  "4-7-8": { name: "4-7-8 Breath", inhale: 4, hold: 7, exhale: 8, rest: 0 },
  coherent: { name: "Coherent Breath", inhale: 5, hold: 0, exhale: 5, rest: 0 },
  free: { name: "Free Flow", inhale: 4, hold: 2, exhale: 4, rest: 2 },
};

export function BreathworkHall({ resonanceKey }: Props) {
  const [pattern, setPattern] = useState<Pattern>("coherent");
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<"idle" | "inhale" | "hold" | "exhale" | "rest">("idle");
  const [phaseTime, setPhaseTime] = useState(0);
  const [coherenceScore, setCoherenceScore] = useState(0);
  const { theme } = useCrystalTheme();

  const activeRef = useRef(active);
  activeRef.current = active;

  // Fixed breath cycle using refs — no stale closures, no effect re-creation
  useEffect(() => {
    if (!active) { setPhase("idle"); setPhaseTime(0); sanctuaryAudio.stop432Hz(); sanctuaryAudio.stopBinauralBeat(); return; }

    const p = PATTERNS[pattern];
    const cycleTime = p.inhale + p.hold + p.exhale + p.rest;
    sanctuaryAudio.play432Hz();
    sanctuaryAudio.playBinauralBeat(432, pattern === "coherent" ? 5 : 4);

    const interval = setInterval(() => {
      if (!activeRef.current) { clearInterval(interval); return; }

      const elapsed = (parseInt(localStorage.getItem("breathElapsed") || "0") + 0.1);
      localStorage.setItem("breathElapsed", String(elapsed));
      const mod = elapsed % cycleTime;

      let newPhase: "inhale" | "hold" | "exhale" | "rest";
      let progress: number;

      if (mod < p.inhale) { newPhase = "inhale"; progress = mod / p.inhale; }
      else if (mod < p.inhale + p.hold) { newPhase = "hold"; progress = (mod - p.inhale) / p.hold; }
      else if (mod < p.inhale + p.hold + p.exhale) { newPhase = "exhale"; progress = (mod - p.inhale - p.hold) / p.exhale; }
      else { newPhase = "rest"; progress = (mod - p.inhale - p.hold - p.exhale) / (p.rest || 1); }

      setPhase(newPhase);
      setPhaseTime(progress);
      sanctuaryAudio.updateBreathModulation({ phase: newPhase, progress });

    }, 100);

    return () => { clearInterval(interval); localStorage.removeItem("breathElapsed"); };
  }, [active, pattern]);

  const toggleBreath = useCallback(() => {
    if (!active) { setActive(true); setCoherenceScore(prev => Math.min(prev + 0.1, 1)); }
    else { setActive(false); }
  }, [active]);

  const p = PATTERNS[pattern];
  const phaseColor = phase === "inhale" ? theme.resort.amber : phase === "hold" ? theme.resort.turmeric : phase === "exhale" ? theme.resort.palm : theme.text.muted;

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, height: "100%", overflow: "auto" }}>
      <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 2, textAlign: "center" }}>BREATHWORK & MEDITATION CRYSTAL HALL</div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: theme.text.primary, textAlign: "center" }}>Riding the Wave of Life</h1>

      <div style={{ width: "100%", height: 200, borderRadius: 16, overflow: "hidden", background: `linear-gradient(145deg, ${theme.resort.amber}06, ${theme.resort.sandalwood}04)`, border: `1px solid ${theme.border.subtle}` }} />

      {/* Pattern buttons */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {(Object.keys(PATTERNS) as Pattern[]).map(key => (
          <button key={key} onClick={() => { setPattern(key); setActive(false); }}
            style={{
              padding: "7px 14px", borderRadius: 14,
              border: `1px solid ${key === pattern ? theme.resort.terracotta : theme.border.subtle}`,
              background: key === pattern ? `${theme.resort.terracotta}10` : `linear-gradient(145deg, rgba(255,247,214,0.02), ${theme.resort.sandalwood}04)`,
              backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
              color: key === pattern ? theme.resort.terracotta : theme.text.muted,
              fontSize: 11, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.3s ease",
            }}
          >{PATTERNS[key].name}</button>
        ))}
      </div>

      {/* Solfeggio */}
      <div>
        <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 1, marginBottom: 6 }}>HEALING FREQUENCIES</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          {[{ f: 174, c: "#e17055" }, { f: 285, c: "#fdcb6e" }, { f: 396, c: "#e84393" }, { f: 417, c: "#a29bfe" }, { f: 528, c: "#00b894" }, { f: 639, c: "#74b9ff" }, { f: 741, c: "#f8a5c2" }, { f: 852, c: "#a55eea" }, { f: 963, c: "#f3a683" }].map(({ f, c }) => (
            <button key={f} onClick={() => sanctuaryAudio.playSolfeggio(f)}
              style={{ padding: "5px 10px", borderRadius: 10, border: `1px solid ${c}33`, background: `${c}08`, color: c, fontSize: 10, cursor: "pointer", fontFamily: "inherit", transition: "all 0.3s ease" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${c}18`; e.currentTarget.style.borderColor = c; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${c}08`; e.currentTarget.style.borderColor = `${c}33`; }}
            >{f} Hz</button>
          ))}
        </div>
      </div>

      {/* Breath Guide */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, borderRadius: 12, background: `linear-gradient(145deg, rgba(255,247,214,0.03), ${theme.resort.sandalwood}04)`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.border.subtle}` }}>
        <div style={{ width: 70, height: 70, borderRadius: 35, border: `2px solid ${phaseColor}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.5s ease", transform: active ? phase === "inhale" ? "scale(1.25)" : phase === "exhale" ? "scale(0.75)" : "scale(1)" : "scale(1)", boxShadow: active ? `0 0 20px ${phaseColor}30` : "none", flexShrink: 0 }}>
          <span style={{ fontSize: 24 }}>💎</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: phaseColor, fontFamily: "'Playfair Display', serif", letterSpacing: 3, marginBottom: 4, textTransform: "uppercase", transition: "color 0.3s ease" }}>{phase === "idle" ? "READY" : phase}</div>
          <div style={{ height: 4, borderRadius: 2, background: theme.border.subtle, overflow: "hidden" }}>
            <div style={{ width: `${phase === "idle" ? 0 : phaseTime * 100}%`, height: "100%", background: `linear-gradient(90deg, ${phaseColor}, ${theme.resort.amber})`, borderRadius: 2, transition: "width 0.1s linear" }} />
          </div>
          <div style={{ fontSize: 10, color: theme.text.muted, marginTop: 4 }}>{p.inhale}s in · {p.hold}s hold · {p.exhale}s out · {p.rest}s rest</div>
        </div>
        <button onClick={toggleBreath} style={{ padding: "9px 18px", borderRadius: 18, border: `1px solid ${active ? theme.resort.palm : theme.resort.terracotta}35`, background: active ? `${theme.resort.palm}10` : `${theme.resort.terracotta}08`, color: active ? theme.resort.palm : theme.resort.terracotta, fontSize: 12, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", transition: "all 0.3s ease" }}>{active ? "STOP" : "START"}</button>
      </div>

      {/* Coherence */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ fontSize: 10, color: theme.text.muted, letterSpacing: 1 }}>COHERENCE</div>
        <div style={{ flex: 1, height: 5, borderRadius: 2, background: theme.border.subtle, overflow: "hidden" }}>
          <div style={{ width: `${coherenceScore * 100}%`, height: "100%", background: `linear-gradient(90deg, ${theme.text.muted}, ${theme.resort.terracotta}, ${theme.resort.amber})`, borderRadius: 2, transition: "width 0.5s ease" }} />
        </div>
        <div style={{ fontSize: 13, color: theme.resort.amber, fontFamily: "'Playfair Display', serif" }}>{Math.round(coherenceScore * 100)}%</div>
      </div>

      {/* Wave Weaver */}
      <div style={{ minHeight: 220, borderTop: `1px solid ${theme.border.subtle}`, paddingTop: 12, marginTop: 4 }}>
        <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 1, marginBottom: 8 }}>CONSULT THE WAVE WEAVER</div>
        <AvatarChat navigatorId="harmonic" userContext={{ resonanceKey, coherenceScore }} />
      </div>
    </div>
  );
}
