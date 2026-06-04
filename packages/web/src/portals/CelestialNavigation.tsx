import { useState, useEffect, useRef } from "react";
import { AvatarChat } from "../components/AvatarChat";
import { useCrystalTheme } from "../theme/CrystalThemeContext";

interface Props { resonanceKey: string }

const NAV_MODES = [
  { title: "Kālachakra Compass", subtitle: "The Wheel of Time", color: "#6366f1", content: "<strong>Kālachakra</strong> — the Wheel of Time — maps the cycles within cycles: breath cycles, day cycles, life cycles, yuga cycles, cosmic cycles. Where you are in the wheel determines what is possible. The Kālachakra Tantra teaches that time is not linear — it is a mandala you can learn to move within." },
  { title: "Jyotish: The Science of Light", subtitle: "Vedic astronomical navigation", color: "#818cf8", content: "<strong>Jyotish</strong> is not predictive astrology. It is the study of how celestial light interacts with biological consciousness. The 27 nakshatras are not constellations — they are frequency zones the Moon passes through, each activating different layers of the subconscious." },
  { title: "Timeline Navigation", subtitle: "Consciousness across parallel nows", color: "#a78bfa", content: "The many-worlds interpretation, the holographic principle, and the Vedic concept of <strong>loka</strong> all point to the same truth: multiple timelines coexist. You navigate them not through choice alone, but through resonance. The timeline you experience is the one whose frequency matches your current state of being." },
  { title: "The Body as Cosmos", subtitle: "Microcosm navigates macrocosm", color: "#c4b5fc", content: "Every cell contains the entire universe in potential — this is the holographic principle made flesh. The 108 marmas of Ayurveda correspond to specific galactic coordinates. The 72,000 nadis mirror the cosmic web. To navigate the cosmos, descend inward into the body's own celestial map." },
];

const YUGAS = [
  { name: "Satya Yuga", years: "1,728,000", quality: "Truth · Purity · Direct knowing", color: "#e8edff" },
  { name: "Treta Yuga", years: "1,296,000", quality: "Sacrifice · Ritual · Indirect knowing", color: "#a5b4fc" },
  { name: "Dvapara Yuga", years: "864,000", quality: "Duality · Conflict", color: "#818cf8" },
  { name: "Kali Yuga", years: "432,000", quality: "Darkness · The spiritual emergency", color: "#6366f1" },
];

export function CelestialNavigation({ resonanceKey }: Props) {
  const [activeMode, setActive] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useCrystalTheme();

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = 200; canvas.height = 200;
    const stars: { x: number; y: number; r: number; a: number; s: number }[] = [];
    for (let i = 0; i < 30; i++) stars.push({ x: Math.random() * 200, y: Math.random() * 200, r: 0.5 + Math.random() * 1.5, a: 0.2 + Math.random() * 0.5, s: 0.005 + Math.random() * 0.02 });
    let t = 0;
    function animate() {
      if (!ctx) return; t += 0.01; ctx.clearRect(0, 0, 200, 200);
      for (const s of stars) { s.a = 0.2 + Math.sin(t * s.s + s.x) * 0.4; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(200, 200, 220, ${s.a})`; ctx.fill(); }
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  const glassBg = `linear-gradient(145deg, rgba(255,247,214,0.03), ${theme.resort.sandalwood}04)`;

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, height: "100%", overflow: "auto" }}>
      <div style={{ textAlign: "center" }}>
        <canvas ref={canvasRef} width={200} height={200} style={{ width: 50, height: 50, borderRadius: 25, margin: "0 auto 6px" }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: theme.text.primary }}>Celestial Navigation</h1>
        <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 2, marginTop: 2 }}>CONSCIOUSNESS OBSERVATORY · KĀLACHAKRA · JYOTISH</div>
      </div>

      <div style={{ padding: 14, borderRadius: 12, background: glassBg, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.border.subtle}` }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: theme.text.secondary, lineHeight: 1.8 }}>
          "The sky is not above you. The sky is the shape of your consciousness projected outward. Jyotish is the science of reading that projection back to its source. Kālachakra is the engine that moves through all timelines."
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 10 }}>
        {NAV_MODES.map((m, i) => (
          <button key={i} onClick={() => setActive(activeMode === i ? null : i)}
            style={{ padding: 14, borderRadius: 12, border: `1px solid ${activeMode === i ? `${m.color}44` : theme.border.subtle}`, background: activeMode === i ? `${m.color}08` : glassBg, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: "inherit", transition: "all 0.3s ease" }}
          >
            <div style={{ fontSize: 12, color: m.color, fontWeight: 500 }}>{m.title}</div>
            <div style={{ fontSize: 9, color: theme.text.muted, marginTop: 2 }}>{m.subtitle}</div>
            {activeMode === i && <div style={{ fontSize: 11, color: theme.text.secondary, lineHeight: 1.7, marginTop: 8 }} dangerouslySetInnerHTML={{ __html: m.content }} />}
          </button>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 1, marginBottom: 6 }}>THE YUGA CYCLE · WHERE ARE WE NOW</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
          {YUGAS.map((y, i) => (
            <div key={i} style={{ padding: 12, borderRadius: 10, border: `1px solid ${y.color}18`, background: i === 3 ? `${y.color}08` : glassBg, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
              <div style={{ fontSize: 11, color: y.color, fontWeight: 500 }}>{y.name}</div>
              <div style={{ fontSize: 8, color: theme.text.muted, fontFamily: "monospace", marginTop: 2 }}>{y.years} years</div>
              <div style={{ fontSize: 10, color: theme.text.secondary, marginTop: 4, lineHeight: 1.4 }}>{y.quality}</div>
              {i === 3 && <div style={{ fontSize: 9, color: theme.resort.amber, marginTop: 6, fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>— The Kali Yuga is not a curse. It is the spiritual emergency that forces awakening.</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ minHeight: 220, borderTop: `1px solid ${theme.border.subtle}`, paddingTop: 12 }}>
        <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 1, marginBottom: 8 }}>CONSULT THE STAR GUIDE</div>
        <AvatarChat navigatorId="celestial" userContext={{ resonanceKey, crystallineTone: "Sapphire" }} />
      </div>
    </div>
  );
}
