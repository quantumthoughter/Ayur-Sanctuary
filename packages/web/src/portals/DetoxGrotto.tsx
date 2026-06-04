import { useState } from "react";
import { sanctuaryAudio } from "../audio/SanctuaryAudio";
import { AvatarChat } from "../components/AvatarChat";
import { useCrystalTheme } from "../theme/CrystalThemeContext";

interface Props { resonanceKey: string }

const WISDOM_TIPS = [
  "Drink water with a squeeze of lime and intention today.",
  "Breathe out anything that is not yours to carry.",
  "What would you let go of if no one was watching?",
  "The body knows how to purify itself — you only need to listen.",
  "Today, choose one thought that limits you and offer it to the light.",
  "Stagnant energy is just unexpressed truth. Speak it gently.",
];

export function DetoxGrotto({ resonanceKey }: Props) {
  const [phase, setPhase] = useState<"enter" | "scan" | "liberate" | "complete">("enter");
  const [shadowCount] = useState(8);
  const [liberated, setLiberated] = useState(0);
  const [wisdomTip, setWisdomTip] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const { theme } = useCrystalTheme();

  const startScan = () => {
    setPhase("scan");
    setScanProgress(0);
    sanctuaryAudio.play432Hz();
    sanctuaryAudio.playCrystallineTone(396);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        const next = prev + Math.random() * 0.1;
        if (next >= 1) {
          clearInterval(interval);
          setPhase("liberate");
          setWisdomTip(WISDOM_TIPS[Math.floor(Math.random() * WISDOM_TIPS.length)]);
          sanctuaryAudio.stopTone("crystalline");
          sanctuaryAudio.playCrystallineTone(528);
          return 1;
        }
        return next;
      });
    }, 300);
  };

  const liberateShadow = () => {
    if (liberated >= shadowCount) return;
    setLiberated(p => p + 1);
    sanctuaryAudio.playCrystallineTone(639 + Math.random() * 100, 0.5);
    if (liberated + 1 >= shadowCount) {
      setPhase("complete");
      setWisdomTip(WISDOM_TIPS[Math.floor(Math.random() * WISDOM_TIPS.length)]);
      sanctuaryAudio.stop432Hz();
      sanctuaryAudio.playCrystallineTone(852, 3);
    }

  };

  const progress = shadowCount > 0 ? liberated / shadowCount : 0;

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, height: "100%", overflow: "auto" }}>
      <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 2, textAlign: "center" }}>DETOXIFICATION GROTTO</div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: theme.text.primary, textAlign: "center" }}>The Liberation of Light</h1>

      <div style={{ width: "100%", height: 180, borderRadius: 16, overflow: "hidden", background: `linear-gradient(145deg, ${theme.resort.palm}06, ${theme.resort.sandalwood}04)`, border: `1px solid ${theme.border.subtle}` }} />

      {phase === "enter" && (
        <div style={{ textAlign: "center", maxWidth: 460, alignSelf: "center" }}>
          <p style={{ color: theme.text.secondary, fontSize: 12, fontFamily: "'Playfair Display', serif", fontStyle: "italic", lineHeight: 1.7, marginBottom: 16 }}>"Toxins are not just physical — they are stagnant thoughts, old beliefs, energies that no longer belong to you."</p>
          <button onClick={startScan} style={glassBtn(theme.resort.palm, theme)}>BEGIN PURIFICATION SCAN</button>
        </div>
      )}

      {phase === "scan" && (
        <div style={{ textAlign: "center", maxWidth: 460, alignSelf: "center", width: "100%" }}>
          <div style={{ fontSize: 10, color: theme.text.muted, letterSpacing: 1, marginBottom: 6 }}>SCANNING ENERGY FIELD</div>
          <div style={{ height: 5, borderRadius: 2, background: theme.border.subtle, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ width: `${scanProgress * 100}%`, height: "100%", background: `linear-gradient(90deg, ${theme.resort.palm}, ${theme.resort.amber})`, borderRadius: 2, transition: "width 0.2s ease" }} />
          </div>
          <div style={{ fontSize: 11, color: theme.text.muted }}>{Math.round(scanProgress * 100)}% — Listening to the density...</div>
        </div>
      )}

      {phase === "liberate" && (
        <div style={{ maxWidth: 460, alignSelf: "center", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: theme.text.muted, letterSpacing: 1 }}>SHADOWS: {liberated}/{shadowCount}</div>
            <div style={{ fontSize: 10, color: theme.text.muted }}>{Math.round(progress * 100)}%</div>
          </div>
          <div style={{ height: 5, borderRadius: 2, background: theme.border.subtle, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ width: `${progress * 100}%`, height: "100%", background: `linear-gradient(90deg, ${theme.resort.palm}, ${theme.resort.amber}, #fff7d6)`, borderRadius: 2, transition: "width 0.3s ease" }} />
          </div>
          <div style={{ padding: 14, borderRadius: 12, background: `linear-gradient(145deg, rgba(255,247,214,0.03), ${theme.resort.palm}04)`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.resort.palm}15`, marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: theme.resort.palm, fontFamily: "'Playfair Display', serif", fontStyle: "italic", lineHeight: 1.6 }}>"{wisdomTip}"</div>
          </div>
          <button onClick={liberateShadow} disabled={liberated >= shadowCount} style={{ ...glassBtn(theme.resort.palm, theme), width: "100%", opacity: liberated >= shadowCount ? 0.5 : 1 }}>
            {liberated >= shadowCount ? "ALL CLEARED" : `LIBERATE A SHADOW (${shadowCount - liberated} remaining)`}
          </button>
        </div>
      )}

      {phase === "complete" && (
        <div style={{ textAlign: "center", maxWidth: 460, alignSelf: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>✨</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: theme.resort.palm, marginBottom: 8 }}>Liberation Complete</h2>
          <p style={{ color: theme.text.secondary, fontSize: 12, fontFamily: "'Playfair Display', serif", fontStyle: "italic", lineHeight: 1.6, marginBottom: 6 }}>"You have cleared the energy ready for release."</p>
          <div style={{ padding: 14, borderRadius: 12, background: `linear-gradient(145deg, rgba(255,247,214,0.03), ${theme.resort.palm}04)`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.resort.palm}15`, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: theme.resort.palm, fontFamily: "'Playfair Display', serif", fontStyle: "italic", lineHeight: 1.6 }}>"{wisdomTip}"</div>
          </div>
          <button onClick={() => { setPhase("enter"); setLiberated(0); setScanProgress(0); sanctuaryAudio.stopAll(); }} style={glassBtn(theme.resort.palm, theme)}>RETURN</button>
        </div>
      )}

      <div style={{ minHeight: 200, borderTop: `1px solid ${theme.resort.palm}08`, paddingTop: 12, marginTop: 4 }}>
        <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 1, marginBottom: 8 }}>CONSULT THE LIBERATOR</div>
        <AvatarChat navigatorId="detox" userContext={{ resonanceKey, crystallineTone: "Emerald", recentPaths: ["detox"] }} />
      </div>
    </div>
  );
}

const glassBtn = (color: string, t: any): React.CSSProperties => ({
  padding: "11px 22px", borderRadius: 20, border: `1px solid ${color}35`,
  background: `linear-gradient(145deg, ${color}08, ${color}04)`,
  backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
  color, fontSize: 12, cursor: "pointer", letterSpacing: 1, fontFamily: "inherit",
  transition: "all 0.3s ease",
});
