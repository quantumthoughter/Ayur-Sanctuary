import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import type { PathId } from "@asi/core";
import { useCrystalTheme } from "../theme/CrystalThemeContext";

interface Props { resonanceKey: string; onNavigate: (path: PathId) => void }

const PATHS = [
  { id: "stillness" as PathId, icon: "💎", title: "Stillness", subtitle: "Crystal Calibration", color: "#e07a5f" },
  { id: "harmonic" as PathId, icon: "🌊", title: "Harmonic Flow", subtitle: "Breathwork Hall", color: "#f4a261" },
  { id: "detox" as PathId, icon: "✨", title: "Clarification", subtitle: "Detox Grotto", color: "#2a9d8f" },
  { id: "somatic" as PathId, icon: "🧬", title: "Somatic Wisdom", subtitle: "Body Temple", color: "#e9c46a" },
  { id: "celestial" as PathId, icon: "🌌", title: "Celestial Nav", subtitle: "Consciousness Observatory", color: "#264653" },
  { id: "union" as PathId, icon: "🕊️", title: "Alchemical Union", subtitle: "Temple of Union", color: "#fb8500" },
];

export function SovereignCore({ resonanceKey, onNavigate }: Props) {
  const [coherenceScore, setCoherenceScore] = useState(0.5);
  const [lightCoherence, setLightCoherence] = useState(0);
  const [breathing, setBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale" | "rest" | "idle">("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useCrystalTheme();

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(200, 200);

    const geo = new THREE.IcosahedronGeometry(1.5, 2);
    const mat = new THREE.MeshPhongMaterial({
      color: 0xe07a5f, emissive: 0x8d4a3a, emissiveIntensity: 0.15, transparent: true, opacity: 0.8, wireframe: true,
    });
    const crystal = new THREE.Mesh(geo, mat);
    const light = new THREE.PointLight(0xe07a5f, 1, 10);
    light.position.set(3, 3, 3);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x3a2a1a, 0.25));
    scene.add(crystal);
    camera.position.z = 4;

    function animate() {
      requestAnimationFrame(animate);
      crystal.rotation.x += 0.003;
      crystal.rotation.y += 0.005;
      renderer.render(scene, camera);
    }
    animate();
    return () => renderer.dispose();
  }, []);

  const startBreath = () => {
    if (breathing) return;
    setBreathing(true);
    const cycle = () => {
      setBreathPhase("inhale");
      setTimeout(() => { setBreathPhase("hold");
        setTimeout(() => { setBreathPhase("exhale");
          setTimeout(() => { setBreathPhase("rest");
            setTimeout(() => { if (breathing) cycle(); }, 2000);
          }, 4000);
        }, 2000);
      }, 4000);
    };
    cycle();
    setCoherenceScore(prev => Math.min(prev + 0.05, 1));
    setLightCoherence(prev => Math.min(prev + 2, 100));
  };

  const stopBreath = () => { setBreathing(false); setBreathPhase("idle"); };

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, height: "100%", overflow: "auto" }}>
      {/* Header with glass */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, background: `linear-gradient(145deg, ${theme.resort.sandalwood}08, ${theme.resort.terracotta}04)`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.resort.sandalwood}12` }}>
        <div style={{ width: 70, height: 70, borderRadius: 35, overflow: "hidden", flexShrink: 0 }}>
          <canvas ref={canvasRef} width={200} height={200} style={{ width: 70, height: 70 }} />
        </div>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: theme.text.primary }}>Sovereign Core</h1>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: theme.text.secondary, marginTop: 2 }}>Your Inner Sanctuary</p>
          <p style={{ fontSize: 9, color: theme.text.muted, fontFamily: "monospace", marginTop: 6 }}>{resonanceKey}</p>
        </div>
      </div>

      {/* Coherence Dashboard */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 500, alignSelf: "center", width: "100%" }}>
        {[
          { label: "HEART COHERENCE", value: coherenceScore, color: theme.resort.terracotta, gradient: `linear-gradient(90deg, ${theme.text.muted}, ${theme.resort.terracotta})` },
          { label: "LIGHT COHERENCE", value: lightCoherence / 100, color: theme.resort.palm, gradient: `linear-gradient(90deg, ${theme.resort.palm}, ${theme.resort.terracotta})`, raw: lightCoherence },
        ].map((item, i) => (
          <div key={i} style={{ padding: 14, borderRadius: 12, background: `linear-gradient(145deg, rgba(255,247,214,0.03), ${theme.resort.sandalwood}04)`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.border.subtle}` }}>
            <div style={{ fontSize: 10, color: theme.text.muted, letterSpacing: 1, marginBottom: 8 }}>{item.label}</div>
            <div style={{ height: 6, borderRadius: 3, background: theme.border.subtle, overflow: "hidden" }}>
              <div style={{ width: `${(item.raw ?? item.value) * 100}%`, height: "100%", background: item.gradient, borderRadius: 3, transition: "width 0.5s ease" }} />
            </div>
            <div style={{ fontSize: 18, color: item.color, fontFamily: "'Playfair Display', serif", marginTop: 6 }}>{Math.round((item.raw ?? item.value) * 100)}</div>
          </div>
        ))}
      </div>

      {/* Breath Practice */}
      <div style={{ padding: 16, borderRadius: 12, background: `linear-gradient(145deg, rgba(255,247,214,0.03), ${theme.resort.sandalwood}04)`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.border.subtle}` }}>
        <div style={{ fontSize: 10, color: theme.text.muted, letterSpacing: 1, marginBottom: 10 }}>HEART-COHERENCE BREATH</div>
        <div style={{ fontSize: 13, color: breathPhase === "inhale" ? theme.resort.amber : breathPhase === "hold" ? theme.resort.turmeric : breathPhase === "exhale" ? theme.resort.palm : theme.text.muted, fontFamily: "'Playfair Display', serif", fontStyle: "italic", textTransform: "uppercase", letterSpacing: 3, marginBottom: 10, transition: "color 0.3s ease" }}>{breathPhase === "idle" ? "Ready" : breathPhase}</div>
        <div style={{ width: 50, height: 50, borderRadius: 25, border: `2px solid ${theme.resort.sandalwood}30`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease", transform: breathPhase === "inhale" ? "scale(1.3)" : breathPhase === "exhale" ? "scale(0.8)" : "scale(1)", marginBottom: 10 }}><span style={{ fontSize: 22 }}>💎</span></div>
        <button onClick={breathing ? stopBreath : startBreath} style={{ padding: "10px 22px", borderRadius: 20, border: `1px solid ${breathing ? theme.resort.palm : theme.resort.terracotta}40`, background: breathing ? `${theme.resort.palm}12` : `${theme.resort.terracotta}08`, color: breathing ? theme.resort.palm : theme.resort.terracotta, fontSize: 12, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1, transition: "all 0.3s ease" }}>{breathing ? "COMPLETE" : "BEGIN BREATH"}</button>
      </div>

      {/* Paths */}
      <div>
        <div style={{ fontSize: 10, color: theme.text.muted, letterSpacing: 1, marginBottom: 10 }}>PORTALS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
          {PATHS.map(path => (
            <button key={path.id} onClick={() => onNavigate(path.id)} style={{ padding: 14, borderRadius: 12, background: `linear-gradient(145deg, rgba(255,247,214,0.02), ${path.color}04)`, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", border: `1px solid ${path.color}18`, cursor: "pointer", transition: "all 0.3s ease", textAlign: "left", fontFamily: "inherit", color: "inherit" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = path.color; e.currentTarget.style.background = `${path.color}10`; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${path.color}18`; e.currentTarget.style.background = `linear-gradient(145deg, rgba(255,247,214,0.02), ${path.color}04)`; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{path.icon}</div>
              <div style={{ fontSize: 12, color: path.color, fontWeight: 500 }}>{path.title}</div>
              <div style={{ fontSize: 10, color: theme.text.muted, marginTop: 2 }}>{path.subtitle}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
