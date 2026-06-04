import { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { apiCalibrate } from "../api";
import { AvatarChat } from "../components/AvatarChat";
import { sanctuaryAudio } from "../audio/SanctuaryAudio";
import { useCrystalTheme } from "../theme/CrystalThemeContext";

interface Props { resonanceKey: string }

const QUESTIONS = [
  { id: "energy", question: "What energy calls you?", options: ["🌊 Flowing", "🔥 Warming", "🌀 Expanding", "💎 Still", "✨ Light"] },
  { id: "intention", question: "What brings you to the sanctuary?", options: ["🧘 Peace", "💪 Strength", "🔍 Clarity", "💖 Connection", "🌅 Renewal"] },
  { id: "element", question: "Which element resonates?", options: ["🌊 Water", "🔥 Fire", "🌍 Earth", "💨 Air", "💫 Ether"] },
];

export function CrystalCalibration({ resonanceKey }: Props) {
  const [step, setStep] = useState<"welcome" | "questions" | "result" | "dialogue">("welcome");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [tone, setTone] = useState<any>(null);
  const [listening, setListening] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const crystalRef = useRef<THREE.Mesh | null>(null);
  const crystalColor = useRef("#e07a5f");
  const { theme } = useCrystalTheme();

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(200, 200);

    const geo = new THREE.OctahedronGeometry(1.2);
    const mat = new THREE.MeshPhongMaterial({ color: 0xe07a5f, emissive: 0x8d4a3a, emissiveIntensity: 0.2, transparent: true, opacity: 0.9, shininess: 100 });
    const crystal = new THREE.Mesh(geo, mat);
    crystalRef.current = crystal;
    const light = new THREE.PointLight(0xe07a5f, 2, 10);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x221144, 0.3));
    scene.add(crystal);
    camera.position.z = 3.5;

    function animate() {
      requestAnimationFrame(animate);
      crystal.rotation.x += 0.004;
      crystal.rotation.y += 0.007;
      const m = crystal.material as THREE.MeshPhongMaterial;
      const t = new THREE.Color(crystalColor.current);
      m.color.lerp(t, 0.02);
      m.emissive.lerp(t, 0.02);
      renderer.render(scene, camera);
    }
    animate();
    return () => renderer.dispose();
  }, []);

  const handleAnswer = useCallback(async (answer: string) => {
    const next = { ...answers, [QUESTIONS[qIdx].id]: answer };
    setAnswers(next);
    if (qIdx < QUESTIONS.length - 1) { setQIdx(p => p + 1); return; }
    setStep("result");
    setListening(true);
    setAvatarMsg("Tuning your instrument...");
    sanctuaryAudio.playCrystallineTone(528, 2);
    try {
      const data = await apiCalibrate(next, resonanceKey);
      setTone(data.crystallineTone);
      setAvatarMsg(data.message);
      crystalColor.current = data.crystallineTone.color;
      if (crystalRef.current) {
        const c = new THREE.Color(data.crystallineTone.color);
        (crystalRef.current.material as THREE.MeshPhongMaterial).color = c;
        (crystalRef.current.material as THREE.MeshPhongMaterial).emissive = c;
        (crystalRef.current.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.3;
      }
      sanctuaryAudio.playCrystallineTone(data.crystallineTone.frequency);
    } catch {
      setTone({ note: "A4", color: "#a29bfe", name: "Third Eye", frequency: 440 });
      setAvatarMsg("Your system calls for A4 — Third Eye frequency.");
      sanctuaryAudio.playCrystallineTone(440);
    }
    setListening(false);
  }, [answers, qIdx, resonanceKey]);

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, height: "100%", overflow: "auto" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 70, height: 70, borderRadius: 35, overflow: "hidden", margin: "0 auto 8px" }}>
          <canvas ref={canvasRef} width={200} height={200} style={{ width: 70, height: 70 }} />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: theme.text.primary }}>Crystal Calibration</h1>
      </div>

      {step === "welcome" && (
        <div style={{ textAlign: "center", maxWidth: 460, alignSelf: "center", width: "100%" }}>
          <p style={{ color: theme.text.secondary, fontSize: 13, lineHeight: 1.8, fontFamily: "'Playfair Display', serif", fontStyle: "italic", marginBottom: 20 }}>"Let's tune your instrument."</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setStep("questions")} style={glassBtn(theme.resort.terracotta, theme)}>TUNE YOUR INSTRUMENT</button>
            <button onClick={() => setStep("dialogue")} style={glassBtn(theme.resort.palm, theme)}>SPEAK WITH THE NAVIGATOR</button>
          </div>
        </div>
      )}

      {step === "questions" && (
        <div style={{ textAlign: "center", maxWidth: 460, alignSelf: "center", width: "100%" }}>
          <div style={{ fontSize: 10, color: theme.text.muted, marginBottom: 6, letterSpacing: 1 }}>QUESTION {qIdx + 1} OF {QUESTIONS.length}</div>
          <div style={{ height: 3, borderRadius: 2, background: theme.border.subtle, marginBottom: 20, overflow: "hidden" }}>
            <div style={{ width: `${((qIdx + 1) / QUESTIONS.length) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${theme.resort.terracotta}, ${theme.resort.turmeric})`, borderRadius: 2, transition: "width 0.3s ease" }} />
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: theme.text.primary, marginBottom: 20, lineHeight: 1.5 }}>{QUESTIONS[qIdx].question}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {QUESTIONS[qIdx].options.map(opt => (
              <button key={opt} onClick={() => handleAnswer(opt)}
                style={{ padding: "11px 18px", borderRadius: 12, border: `1px solid ${theme.border.subtle}`, background: `linear-gradient(145deg, rgba(255,247,214,0.02), ${theme.resort.sandalwood}04)`, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", color: theme.text.secondary, fontSize: 13, cursor: "pointer", transition: "all 0.3s ease", textAlign: "center", fontFamily: "inherit" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${theme.resort.terracotta}40`; e.currentTarget.style.background = `${theme.resort.terracotta}06`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border.subtle; e.currentTarget.style.background = `linear-gradient(145deg, rgba(255,247,214,0.02), ${theme.resort.sandalwood}04)`; }}
              >{opt}</button>
            ))}
          </div>
        </div>
      )}

      {step === "result" && tone && (
        <div style={{ textAlign: "center", maxWidth: 460, alignSelf: "center" }}>
          {listening && <div style={{ color: theme.resort.terracotta, fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 13 }}>{avatarMsg}</div>}
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: tone.color, margin: "0 auto 12px", boxShadow: `0 0 25px ${tone.color}33` }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, color: theme.text.secondary, marginBottom: 12, lineHeight: 1.7 }}>{avatarMsg}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 16 }}>
              {[{ l: "NOTE", v: tone.note }, { l: "FREQ", v: `${tone.frequency} Hz` }, { l: "KEY", v: tone.name }].map((d, i) => (
                <div key={i}><div style={{ fontSize: 9, color: theme.text.muted, marginBottom: 2, letterSpacing: 1 }}>{d.l}</div><div style={{ fontSize: 20, color: tone.color, fontFamily: "'Playfair Display', serif" }}>{d.v}</div></div>
              ))}
            </div>
            <button onClick={() => setStep("dialogue")} style={glassBtn(tone.color, theme)}>SPEAK WITH THE NAVIGATOR</button>
          </div>
        </div>
      )}

      {step === "dialogue" && (
        <div style={{ flex: 1, minHeight: 300 }}>
          <AvatarChat navigatorId="stillness" userContext={{ resonanceKey, crystallineTone: tone?.note, mood: tone ? "calibrated" : undefined }} />
        </div>
      )}
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
