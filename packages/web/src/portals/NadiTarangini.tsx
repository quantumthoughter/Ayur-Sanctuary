import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { sanctuaryAudio } from "../audio/SanctuaryAudio";
import { AvatarChat } from "../components/AvatarChat";
import { useCrystalTheme } from "../theme/CrystalThemeContext";

interface Props { resonanceKey: string }

type Dosha = "vata" | "pitta" | "kapha" | "tridoshic";

const DOSHA_INFO: Record<Dosha, { color: string; emoji: string; element: string; wisdom: string[] }> = {
  vata: { color: "#9b6dff", emoji: "🌬️", element: "Air · Ether", wisdom: ["Today your energy is light and mobile. Ground yourself with warm, heavy practices.", "Vata is high. Root yourself in routine. Warm oil massage and cooked foods will comfort you.", "The air element moves through you. Consistency is your medicine today."] },
  pitta: { color: "#f472b6", emoji: "🔥", element: "Fire · Water", wisdom: ["Pitta rises. You have fire today — use it for focused work, but cool the edges.", "Your inner fire is bright. Channel it into creative expression. Keep your cool with mint and moonlight.", "Fire element dominant. Seek shade and sweetness. Avoid heat and conflict."] },
  kapha: { color: "#34d399", emoji: "🌍", element: "Earth · Water", wisdom: ["Kapha grounds you today. Honor the body's need for rest, but invite gentle movement.", "Heavy, steady energy. Begin with invigoration — dry brushing, warm spices, movement before meditation.", "Earth element is strong. Use this stability to build something lasting — but avoid stagnation."] },
  tridoshic: { color: "#e8edff", emoji: "☯️", element: "Balanced", wisdom: ["All three doshas are in harmony today. Rest in it. Do not disturb. Simply be.", "Tridoshic balance. Your energies are aligned. Float in this grace.", "The three forces within you are singing in harmony. This is a gift."] },
};

const MOCK_HRV = () => 0.04 + Math.random() * 0.08;
const MOCK_BREATH = () => 4 + Math.random() * 4;

function determineDosha(hrv: number, br: number): Dosha {
  if (hrv > 0.09 && br > 7) return "vata";
  if (hrv > 0.06 && br > 5) return "pitta";
  if (hrv < 0.05 && br < 5) return "kapha";
  return "tridoshic";
}

export function NadiTarangini({ resonanceKey }: Props) {
  const [reading, setReading] = useState<any>(null);
  const [animating, setAnimating] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [clicked, setClicked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useCrystalTheme();

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(200, 200);
    const particles = new THREE.BufferGeometry();
    const pos = new Float32Array(120 * 3);
    const colors = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      const r = 0.5 + Math.random() * 1.5, theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = new THREE.Color().setHSL(0.05 + Math.random() * 0.08, 0.6, 0.4 + Math.random() * 0.3);
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    particles.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const mesh = new THREE.Points(particles, mat);
    scene.add(mesh);
    camera.position.z = 2.5;
    let t = 0;
    function animate() { requestAnimationFrame(animate); t += 0.003; mesh.rotation.y = t * 0.1; mesh.rotation.x = Math.sin(t * 0.05) * 0.05; renderer.render(scene, camera); }
    animate();
    return () => renderer.dispose();
  }, []);

  const takeReading = useCallback(() => {
    setAnimating(true);
    sanctuaryAudio.playCrystallineTone(528, 1);
    const hrv = MOCK_HRV();
    const br = MOCK_BREATH();
    const dosha = determineDosha(hrv, br);
    const d = DOSHA_INFO[dosha];
    const wisdom = d.wisdom[Math.floor(Math.random() * d.wisdom.length)];
    setTimeout(() => {
      setReading({ dosha, score: Math.round((hrv + (6 - Math.abs(br - 6)) / 10) * 50), wisdom, hrv: Math.round(hrv * 1000) / 1000, breathRate: Math.round(br * 10) / 10 });
      setAnimating(false);
      sanctuaryAudio.playCrystallineTone(639, 1.5);
    }, 1500);
  }, []);

  const di = reading?.dosha ? DOSHA_INFO[reading.dosha as Dosha] : null;
  const glassBg = `linear-gradient(145deg, rgba(255,247,214,0.03), ${theme.resort.sandalwood}04)`;

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, height: "100%", overflow: "auto" }}>
      <div style={{ textAlign: "center" }}>
        <canvas ref={canvasRef} width={200} height={200} style={{ width: 50, height: 50, borderRadius: 25, margin: "0 auto 6px" }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: theme.text.primary }}>Nāḍi Taraṅgiṇī</h1>
        <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 2, marginTop: 2 }}>PULSE READING · DAILY WISDOM</div>
      </div>

      {!reading && !animating && !clicked && (
        <div style={{ textAlign: "center", maxWidth: 380, alignSelf: "center" }}>
          <p style={{ color: theme.text.secondary, fontSize: 12, lineHeight: 1.7, fontFamily: "'Playfair Display', serif", fontStyle: "italic", marginBottom: 16 }}>"Your pulse carries a story the mind has forgotten. Let us listen."</p>
          <button onClick={() => { takeReading(); setClicked(true); }} style={{ padding: "12px 28px", borderRadius: 20, border: `1px solid ${theme.resort.terracotta}35`, background: `${theme.resort.terracotta}08`, color: theme.resort.terracotta, fontSize: 12, letterSpacing: 2, cursor: "pointer", fontFamily: "inherit", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", transition: "all 0.3s ease" }}>TAKE YOUR PULSE</button>
        </div>
      )}

      {animating && (
        <div style={{ textAlign: "center", padding: 30 }}>
          <div style={{ fontSize: 30, animation: "pulse 0.8s ease infinite" }}>💓</div>
          <p style={{ color: theme.text.muted, fontSize: 11, marginTop: 8, fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>Listening to your pulse...</p>
        </div>
      )}

      {reading && di && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 14, borderRadius: 12, background: glassBg, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.border.subtle}` }}>
            <span style={{ fontSize: 26 }}>{di.emoji}</span>
            <div><div style={{ fontSize: 13, color: theme.text.primary, fontFamily: "'Playfair Display', serif", textTransform: "capitalize" }}>{reading.dosha} · {di.element}</div><div style={{ fontSize: 9, color: theme.text.muted, marginTop: 2 }}>Score: {reading.score}%</div></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "HRV", value: reading.hrv, color: theme.resort.terracotta, pct: Math.min(reading.hrv * 1000, 100) },
              { label: "BREATH RATE", value: `${reading.breathRate}/min`, color: theme.resort.palm, pct: Math.min((reading.breathRate / 12) * 100, 100) },
            ].map((s, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 10, background: glassBg, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", border: `1px solid ${theme.border.subtle}` }}>
                <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 1 }}>{s.label}</div>
                <div style={{ fontSize: 18, color: s.color, fontFamily: "'Playfair Display', serif", marginTop: 2 }}>{s.value}</div>
                <div style={{ height: 3, borderRadius: 2, background: theme.border.subtle, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ width: `${s.pct}%`, height: "100%", background: `linear-gradient(90deg, ${s.color}, ${theme.resort.amber})`, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: 14, borderRadius: 12, background: glassBg, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.border.subtle}` }}>
            <div style={{ fontSize: 9, color: theme.resort.terracotta, letterSpacing: 1, marginBottom: 6 }}>DAILY WISDOM</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: theme.text.secondary, lineHeight: 1.7 }}>"{reading.wisdom}"</p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={takeReading} style={{ flex: 1, padding: "9px", borderRadius: 14, border: `1px solid ${theme.border.subtle}`, background: glassBg, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", color: theme.resort.terracotta, fontSize: 11, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1, transition: "all 0.3s ease" }}>NEW READING</button>
            <button onClick={() => setShowChat(!showChat)} style={{ flex: 1, padding: "9px", borderRadius: 14, border: `1px solid ${theme.resort.palm}30`, background: `${theme.resort.palm}08`, color: theme.resort.palm, fontSize: 11, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1, transition: "all 0.3s ease" }}>{showChat ? "HIDE" : "ASK PULSE READER"}</button>
          </div>

          {showChat && <div style={{ minHeight: 220, borderTop: `1px solid ${theme.border.subtle}`, paddingTop: 12 }}><AvatarChat navigatorId="nadi" userContext={{ resonanceKey, crystallineTone: reading.dosha, coherenceScore: reading.score / 100 }} /></div>}
        </div>
      )}
    </div>
  );
}
