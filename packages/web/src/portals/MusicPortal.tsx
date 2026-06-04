import { useState, useRef, useEffect } from "react";
import { sanctuaryAudio } from "../audio/SanctuaryAudio";
import { useCrystalTheme } from "../theme/CrystalThemeContext";

interface Props { resonanceKey: string }

const TRACKS = [
  { id: "dhanvantari-432", title: "Dhanvantari's Pulse", desc: "432Hz — the primordial vibration of cosmic healing.", type: "frequency", color: "#fbbf24", icon: "🕉️", freq: [432, 216, 108] },
  { id: "surya-528", title: "Surya DNA Activation", desc: "528Hz — the love frequency for DNA repair and cellular awakening.", type: "frequency", color: "#ef4444", icon: "☀️", freq: [528, 264, 132] },
  { id: "soma-639", title: "Soma Connection", desc: "639Hz — weaves the heart's electromagnetic field into coherence with all beings.", type: "transmission", color: "#f472b6", icon: "💗", freq: [639, 852] },
  { id: "kala-chakra", title: "Kāla Chakra Drone", desc: "The Wheel of Time sounding itself. A deep harmonic drone for present-moment anchoring.", type: "ambient", color: "#6366f1", icon: "🌀", freq: [108, 72, 54, 33.5] },
  { id: "ama-174", title: "Amma's Embrace", desc: "174Hz — the frequency of pain relief and security. The sound of the Mother's embrace.", type: "transmission", color: "#34d399", icon: "🤱", freq: [174, 285] },
  { id: "rainbow-body", title: "Rainbow Body Resonance", desc: "Full Solfeggio spectrum — 174 to 963 Hz. The body dissolving into light.", type: "transmission", color: "#fef08a", icon: "🌈", freq: [174, 285, 396, 417, 528, 639, 741, 852, 963] },
  { id: "om-mani", title: "Oṃ Maṇi Padme Hūṃ", desc: "The mantra of Avalokiteshvara — compassion itself. Chanted at 432Hz.", type: "chant", color: "#c084fc", icon: "🔮", freq: [432] },
  { id: "soma-963", title: "Sahasrara Opening", desc: "963Hz — the crown frequency. Activates the thousand-petalled lotus.", type: "frequency", color: "#e8edff", icon: "💫", freq: [963, 852] },
  { id: "binaural-theta", title: "Theta Gateway", desc: "4-7 Hz binaural beat for deep meditation and cellular regeneration.", type: "ambient", color: "#60a5fa", icon: "🌙", freq: [432, 436, 439] },
  { id: "sunflower-417", title: "Sunflower Release", desc: "417Hz — clears stagnant energy and facilitates transformation.", type: "transmission", color: "#f59e0b", icon: "🌻", freq: [417, 396] },
];

export function MusicPortal({ resonanceKey }: Props) {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useCrystalTheme();

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = 200; canvas.height = 200;
    const rays: { a: number; len: number; hue: number; s: number }[] = [];
    for (let i = 0; i < 30; i++) rays.push({ a: (Math.PI * 2 / 30) * i, len: 15 + Math.random() * 40, hue: 30 + Math.random() * 25, s: 0.002 + Math.random() * 0.005 });
    let t = 0;
    function animate() {
      if (!ctx) return; t += 0.01; ctx.clearRect(0, 0, 200, 200); ctx.translate(100, 100);
      for (const r of rays) { const a = r.a + t * r.s; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * (r.len + Math.sin(t * 0.5 + r.a) * 4), Math.sin(a) * (r.len + Math.sin(t * 0.5 + r.a) * 4)); ctx.strokeStyle = `hsla(${r.hue}, 90%, 60%, 0.08)`; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fillStyle = "rgba(251, 191, 36, 0.2)"; ctx.fill();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  const playTrack = async (track: typeof TRACKS[0]) => {
    if (isPlaying && activeTrack === track.id) { sanctuaryAudio.stopAll(); setIsPlaying(false); setActiveTrack(null); return; }
    sanctuaryAudio.stopAll();
    if (track.freq[0]) sanctuaryAudio.playCrystallineTone(track.freq[0]);
    if (track.id === "binaural-theta") sanctuaryAudio.playBinauralBeat(track.freq[0], track.freq[1] - track.freq[0]);
    if (track.freq.length > 1) track.freq.slice(1).forEach((f, i) => setTimeout(() => sanctuaryAudio.playCrystallineTone(f), i * 500));
    setActiveTrack(track.id);
    setIsPlaying(true);
  };

  const glassBg = `linear-gradient(145deg, rgba(255,247,214,0.03), ${theme.resort.sandalwood}04)`;

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, height: "100%", overflow: "auto" }}>
      <div style={{ textAlign: "center" }}>
        <canvas ref={canvasRef} width={200} height={200} style={{ width: 50, height: 50, borderRadius: 25, margin: "0 auto 6px" }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: theme.text.primary }}>Dhanvantari Sound Temple</h1>
        <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 2, marginTop: 2 }}>ASCENSION · HEALING · TRANSMISSION · JOY</div>
      </div>

      <div style={{ padding: 14, borderRadius: 12, background: glassBg, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.border.subtle}`, textAlign: "center" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 11, color: theme.text.secondary, lineHeight: 1.7 }}>
          "Sound is the first medicine. Before herbs, before touch, before words — there was vibration. Each frequency here is a transmission."
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 10 }}>
        {TRACKS.map(track => {
          const isActive = activeTrack === track.id;
          return (
            <div key={track.id} style={{ padding: 14, borderRadius: 12, border: `1px solid ${isActive ? `${track.color}44` : theme.border.subtle}`, background: isActive ? `${track.color}08` : glassBg, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", transition: "all 0.3s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>{track.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: track.color, fontWeight: 500 }}>{track.title}</div>
                  <div style={{ fontSize: 8, color: theme.text.muted, textTransform: "uppercase", letterSpacing: 1 }}>{track.type}</div>
                </div>
                <button onClick={() => playTrack(track)} style={{ width: 30, height: 30, borderRadius: 15, border: `1px solid ${track.color}44`, background: isActive ? `${track.color}20` : `${track.color}06`, color: track.color, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }}>{isActive ? "⏹" : "▶"}</button>
              </div>
              <div onClick={() => setShowInfo(showInfo === track.id ? null : track.id)} style={{ cursor: "pointer" }}>
                <div style={{ fontSize: 11, color: theme.text.secondary, lineHeight: 1.5, fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>{(showInfo === track.id || isActive) ? `"${track.desc}"` : "Tap for wisdom..."}</div>
              </div>
            </div>
          );
        })}
      </div>

      {isPlaying && (
        <div style={{ padding: 10, borderRadius: 10, background: glassBg, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.resort.amber}20`, display: "flex", justifyContent: "space-between", alignItems: "center", animation: "fadeUp 0.3s ease" }}>
          <div><div style={{ fontSize: 10, color: theme.resort.amber }}>Now Playing</div><div style={{ fontSize: 11, color: theme.text.primary, fontFamily: "'Playfair Display', serif" }}>{TRACKS.find(t => t.id === activeTrack)?.title}</div></div>
          <button onClick={() => { sanctuaryAudio.stopAll(); setIsPlaying(false); setActiveTrack(null); }} style={{ padding: "5px 12px", borderRadius: 10, border: `1px solid rgba(239,68,68,0.3)`, background: "rgba(239,68,68,0.06)", color: "#ef4444", fontSize: 10, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}>STOP</button>
        </div>
      )}

      <div style={{ padding: 10, borderRadius: 10, background: glassBg, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", border: `1px solid ${theme.border.subtle}`, textAlign: "center" }}>
        <div style={{ fontSize: 8, color: theme.text.muted, letterSpacing: 1 }}>YOUR RESONANCE KEY</div>
        <div style={{ fontSize: 9, color: theme.resort.terracotta, fontFamily: "monospace", marginTop: 2, letterSpacing: 2 }}>{resonanceKey}</div>
      </div>
    </div>
  );
}
