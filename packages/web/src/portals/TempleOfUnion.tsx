import { useState, useEffect, useRef } from "react";
import { AvatarChat } from "../components/AvatarChat";
import { useCrystalTheme } from "../theme/CrystalThemeContext";

interface Props { resonanceKey: string }

const GATES = [
  { title: "Rainbow Body", subtitle: "Jalus · The body dissolving into light", color: "#fbbf24", content: "<strong>Rainbow body (jalus)</strong> is not a legend — it is the culmination of the Vajrayana path where the physical body dissolves back into its elemental light at the time of death. Over 160,000 practitioners in Tibetan tradition are said to have achieved this. The body does not go anywhere — it remembers that it was always made of light and simply returns to that state." },
  { title: "Light Body Activation", subtitle: "The 12 cranial nerves as gates", color: "#f59e0b", content: "The <strong>12 cranial nerves</strong> are not just biological structures — they are portals of light connecting brain to body to consciousness beyond. Each nerve corresponds to a gate of activation. When all 12 are awakened, the body becomes a conductor for what the Tibetan tradition calls the vajra body — indestructible, luminous, sovereign." },
  { title: "Phowa: Conscious Dying", subtitle: "The art of transferring consciousness", color: "#d97706", content: "<strong>Phowa</strong> is the practice of ejecting consciousness at the moment of death into a pure land or for rebirth. By training in Phowa while alive, you learn to release attachment to every identity, every body, every timeline. You die before you die. And what survives is the clear light that was always there." },
  { title: "Bardo Navigation", subtitle: "The 49 days between lives", color: "#92400e", content: "The <strong>Bardo Thodol</strong> maps the 49-day journey between death and rebirth. But the bardos are not only after death — you traverse a bardo every night between falling asleep and dreaming. Learning to navigate the bardo of sleep is training for navigating the bardo of death." },
  { title: "Kāla Chakra Engine", subtitle: "The Wheel of Time as liberation", color: "#b45309", content: "The <strong>Kālachakra Tantra</strong> tracks the convergence of outer cycles (planetary), inner cycles (energy body), and alternative cycles (consciousness timelines). When these three wheels align, liberation is the recognition that you were never bound. The engine is already running. You simply need to see it." },
  { title: "Clear Light of Reality", subtitle: "Rigpa · The ground of all experience", color: "#fef3c7", content: "The clear light is the ground of all phenomena — the luminous emptiness from which all experience arises. In Dzogchen, this is called <strong>Rigpa</strong>: pristine awareness that recognizes itself. Every moment of genuine presence is a glimpse of the clear light. Death is simply the moment when the coverings are fully removed." },
];

const AXIOMS = [
  "The body is not a prison. It is the laboratory where matter learns it is light.",
  "You do not escape the cycle of birth and death. You complete it by seeing there was never anyone born and never anyone to die.",
  "Rainbow body is not a miracle. It is a remembering — the body recalling that it was always frequency, never substance.",
  "The Kāla Chakra turns whether you are aware of it or not. Awareness is the axle.",
  "Union is not the merging of two things. It is the recognition that they were never separate.",
  "Liberation is not from the body. It is through the body. The body is the last gate.",
];

export function TempleOfUnion({ resonanceKey }: Props) {
  const [activeGate, setActiveGate] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useCrystalTheme();

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = 200; canvas.height = 200;
    const rays: { angle: number; len: number; a: number; s: number }[] = [];
    for (let i = 0; i < 20; i++) rays.push({ angle: (Math.PI * 2 / 20) * i, len: 15 + Math.random() * 35, a: 0.08 + Math.random() * 0.2, s: 0.002 + Math.random() * 0.005 });
    const particles: { x: number; y: number; r: number; hue: number }[] = [];
    for (let i = 0; i < 20; i++) particles.push({ x: 100, y: 100, r: 1 + Math.random() * 2, hue: 40 + Math.random() * 30 });
    let t = 0;
    function animate() {
      if (!ctx) return; t += 0.01; ctx.clearRect(0, 0, 200, 200);
      ctx.save(); ctx.translate(100, 100);
      for (const r of rays) { const a = r.angle + t * r.s; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r.len, Math.sin(a) * r.len); ctx.strokeStyle = `rgba(251, 191, 36, ${r.a})`; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.restore();
      for (const p of particles) { p.x += Math.sin(t + p.hue) * 0.3; p.y += Math.cos(t * 0.7 + p.hue) * 0.3; if (p.x < 0 || p.x > 200) p.x = 100; if (p.y < 0 || p.y > 200) p.y = 100; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, 0.15)`; ctx.fill(); }
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  const glassBg = `linear-gradient(145deg, rgba(255,247,214,0.03), ${theme.resort.sandalwood}04)`;

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, height: "100%", overflow: "auto" }}>
      <div style={{ textAlign: "center" }}>
        <canvas ref={canvasRef} width={200} height={200} style={{ width: 50, height: 50, borderRadius: 25, margin: "0 auto 6px" }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: theme.text.primary }}>Temple of Union</h1>
        <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 2, marginTop: 2 }}>RAINBOW BODY · KĀLA CHAKRA · LIBERATION</div>
      </div>

      <div style={{ padding: 14, borderRadius: 12, background: glassBg, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.border.subtle}` }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: theme.text.secondary, lineHeight: 1.8 }}>
          "The cycle of life and death is not a punishment. It is a curriculum. Each birth, a classroom. Each death, a graduation. The Kāla Chakra turns not to trap you in suffering, but to offer you, with every rotation, the chance to remember who you are before time began."
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
        {GATES.map((g, i) => (
          <button key={i} onClick={() => setActiveGate(activeGate === i ? null : i)}
            style={{ padding: 14, borderRadius: 12, border: `1px solid ${activeGate === i ? `${g.color}44` : theme.border.subtle}`, background: activeGate === i ? `${g.color}08` : glassBg, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: "inherit", transition: "all 0.3s ease" }}
          >
            <div style={{ fontSize: 12, color: g.color, fontWeight: 500 }}>{g.title}</div>
            <div style={{ fontSize: 9, color: theme.text.muted, marginTop: 2 }}>{g.subtitle}</div>
            {activeGate === i && <div style={{ fontSize: 11, color: theme.text.secondary, lineHeight: 1.7, marginTop: 8 }} dangerouslySetInnerHTML={{ __html: g.content }} />}
          </button>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 1, marginBottom: 6 }}>UNION AXIOMS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 8 }}>
          {AXIOMS.map((a, i) => (
            <div key={i} style={{ padding: 12, borderRadius: 10, border: `1px solid ${theme.border.subtle}`, background: glassBg, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
              <div style={{ fontSize: 11, color: theme.resort.amber, fontFamily: "'Playfair Display', serif", fontStyle: "italic", lineHeight: 1.6 }}>"{a}"</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ minHeight: 220, borderTop: `1px solid ${theme.border.subtle}`, paddingTop: 12 }}>
        <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 1, marginBottom: 8 }}>CONSULT THE WEB WEAVER</div>
        <AvatarChat navigatorId="union" userContext={{ resonanceKey, crystallineTone: "Gold" }} />
      </div>
    </div>
  );
}
