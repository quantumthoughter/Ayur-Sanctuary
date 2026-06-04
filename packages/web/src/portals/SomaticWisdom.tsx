import { useState, useEffect, useRef } from "react";
import { AvatarChat } from "../components/AvatarChat";
import { useCrystalTheme } from "../theme/CrystalThemeContext";

interface Props { resonanceKey: string }

const PRACTICES = [
  { title: "Cellular Breath", subtitle: "Prana enters every cell", duration: "5 min", color: "#f472b6", instruction: "Bring awareness to your breath. Imagine it entering not just your lungs, but every cell of your body. With each inhale, light fills the cell. With each exhale, what no longer serves releases. The cell remembers wholeness." },
  { title: "DNA Activation Scan", subtitle: "The original code awakens", duration: "7 min", color: "#ec4899", instruction: "Close your eyes. Scan from the crown of your head to the soles of your feet. At each area, pause and ask: 'What story does this place hold?' The body writes its history in tissue. Reading it is the first step to rewriting it." },
  { title: "Rasayana Touch", subtitle: "Ayurvedic cellular rejuvenation", duration: "10 min", color: "#be185d", instruction: "Warm your hands by rubbing them together. Place them on your lower belly. Breathe warmth into your palms. Feel the intelligence of your body responding to your own touch. This is rasayana — the body heals itself when witnessed with love." },
  { title: "Kaya Kalpa Sealing", subtitle: "The alchemy of immortality", duration: "8 min", color: "#f43f5e", instruction: "Visualize a golden thread running through your spine, from the base to the crown. Breathe light up the thread. When the light reaches the crown, your entire being hums with the frequency of renewal." },
];

const WISDOM_CARDS = [
  { icon: "🧬", title: "DNA Is Not Destiny", text: "Only 2% of your DNA codes for proteins. The other 98% is regulatory — responding to your environment, your thoughts, your beliefs. Epigenetics is the Ayurveda of the genome: lifestyle rewrites the code." },
  { icon: "🫀", title: "The Body Remembers", text: "Trauma is held in the fascia. Joy is held in the heart's electromagnetic field. The body is not a machine to be fixed — it is a living library of every experience you've ever had." },
  { icon: "🔬", title: "CRISPR Within", text: "Before CRISPR-Cas9, the body had its own editing system: RNA interference, autophagy, methylation. Meditation, breathwork, and specific herbs activate these endogenous editors." },
  { icon: "🌿", title: "Rasayana: The Rejuvenation Path", text: "Rasayana is not anti-aging — it is conscious aging. The body sheds and regenerates 330 billion cells daily. Rasayana supports the quality of that regeneration through herbs, lifestyle, and inner attitude." },
  { icon: "🔥", title: "Agni: The Cellular Fire", text: "At the cellular level, agni is mitochondrial function. Healthy mitochondria = healthy cells = healthy tissue = healthy being. Kindle your inner fire with warmth, rest, and presence." },
  { icon: "💎", title: "Ojas: The Essence of Vitality", text: "Ojas is the subtle essence of all bodily tissues — the glow of health, the radiance of immunity. It is built through deep sleep, regular routine, love, and the digestion of experience itself." },
];

export function SomaticWisdom({ resonanceKey }: Props) {
  const [activePractice, setActivePractice] = useState<number | null>(null);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useCrystalTheme();

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = 200; canvas.height = 200;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; hue: number }[] = [];
    for (let i = 0; i < 40; i++) particles.push({ x: Math.random() * 200, y: Math.random() * 200, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: 1 + Math.random() * 2, hue: 320 + Math.random() * 40 });
    let t = 0;
    function animate() {
      if (!ctx) return;
      t += 0.01; ctx.clearRect(0, 0, 200, 200);
      for (const p of particles) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > 200) p.vx *= -1; if (p.y < 0 || p.y > 200) p.vy *= -1; ctx.beginPath(); ctx.arc(p.x, p.y, p.r + Math.sin(t + p.hue) * 0.5, 0, Math.PI * 2); ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, 0.15)`; ctx.fill(); }
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  const tc = (c: string) => `${c}`;
  const glassBg = `linear-gradient(145deg, rgba(255,247,214,0.03), ${theme.resort.sandalwood}04)`;

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, height: "100%", overflow: "auto" }}>
      <div style={{ textAlign: "center" }}>
        <canvas ref={canvasRef} width={200} height={200} style={{ width: 50, height: 50, borderRadius: 25, margin: "0 auto 6px" }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: theme.text.primary }}>Somatic Wisdom</h1>
        <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 2, marginTop: 2 }}>BODY TEMPLE · AYURVEDIC CRISPR · RASAYANA</div>
      </div>

      <div style={{ padding: 14, borderRadius: 12, background: glassBg, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.border.subtle}` }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: theme.text.secondary, lineHeight: 1.8 }}>
          "The body is not a prison for the soul — it is the laboratory where the soul learns to transform matter into light. Ayurvedic CRISPR is not about editing genes for future generations. It is about unlocking the dormant intelligence already within every cell, here and now, in this living body."
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
        {PRACTICES.map((p, i) => (
          <button key={i} onClick={() => setActivePractice(activePractice === i ? null : i)}
            style={{ padding: 14, borderRadius: 12, border: `1px solid ${activePractice === i ? `${p.color}44` : theme.border.subtle}`, background: activePractice === i ? `${p.color}08` : `linear-gradient(145deg, rgba(255,247,214,0.02), ${theme.resort.sandalwood}04)`, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: "inherit", transition: "all 0.3s ease" }}
            onMouseEnter={e => { if (activePractice !== i) { e.currentTarget.style.borderColor = `${p.color}33`; e.currentTarget.style.background = `${p.color}04`; } }}
            onMouseLeave={e => { if (activePractice !== i) { e.currentTarget.style.borderColor = theme.border.subtle; e.currentTarget.style.background = `linear-gradient(145deg, rgba(255,247,214,0.02), ${theme.resort.sandalwood}04)`; } }}
          >
            <div style={{ fontSize: 12, color: p.color, fontWeight: 500 }}>{p.title}</div>
            <div style={{ fontSize: 9, color: theme.text.muted, marginTop: 2 }}>{p.subtitle} · {p.duration}</div>
            {activePractice === i && <div style={{ fontSize: 11, color: theme.text.secondary, lineHeight: 1.6, marginTop: 8, fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>{p.instruction}</div>}
          </button>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 1, marginBottom: 6 }}>WISDOM CARDS · TAP TO REVEAL</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 8 }}>
          {WISDOM_CARDS.map((card, i) => (
            <div key={i} onClick={() => setFlippedCard(flippedCard === i ? null : i)}
              style={{ padding: 12, borderRadius: 12, border: `1px solid ${flippedCard === i ? `${theme.resort.terracotta}25` : theme.border.subtle}`, background: flippedCard === i ? `${theme.resort.terracotta}04` : glassBg, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", cursor: "pointer", transition: "all 0.3s ease" }}
            >
              <div style={{ fontSize: 18, marginBottom: 4 }}>{flippedCard === i ? card.icon : "💡"}</div>
              <div style={{ fontSize: 11, color: theme.resort.terracotta, fontWeight: 500 }}>{flippedCard === i ? card.title : "Tap to reveal"}</div>
              {flippedCard === i && <div style={{ fontSize: 11, color: theme.text.secondary, lineHeight: 1.6, marginTop: 4 }}>{card.text}</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ minHeight: 220, borderTop: `1px solid ${theme.border.subtle}`, paddingTop: 12 }}>
        <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 1, marginBottom: 8 }}>CONSULT THE BODY ORACLE</div>
        <AvatarChat navigatorId="somatic" userContext={{ resonanceKey, crystallineTone: "Rose Quartz" }} />
      </div>
    </div>
  );
}
