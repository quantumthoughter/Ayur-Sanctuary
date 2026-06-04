import { useState, useEffect, useRef } from "react";
import { useCrystalTheme } from "../theme/CrystalThemeContext";

interface Props { resonanceKey: string }

type CertStep = "intro" | "apply" | "review" | "issued";

const LEVELS = [
  { id: "practitioner", label: "Certified Practitioner", desc: "For individual Ayurvedic practitioners, therapists, and wellness coaches.", fee: "Free", color: "#2a9d8f" },
  { id: "clinic", label: "Certified Clinic", desc: "For Ayurvedic clinics, wellness centers, and diagnostic facilities.", fee: "₹11,000 / $150", color: "#e07a5f" },
  { id: "resort", label: "Certified Resort", desc: "For Ayurveda resorts, retreat centers, and Panchakarma facilities.", fee: "₹25,000 / $350", color: "#f4a261" },
  { id: "gurukul", label: "Certified Gurukul", desc: "For educational institutions, training centers, and research organizations.", fee: "₹35,000 / $500", color: "#264653" },
];

const BENEFITS = [
  "Listed on ASI Foundation's global directory of verified Ayurveda providers",
  "Right to display the ASI Verified Seal on your website, premises, and materials",
  "Priority referrals from the ASI Dhanvantari diagnostic network",
  "Access to the Nadi Tarangini practitioner integration program",
  "Invitation to annual ASI Foundation conferences and community events",
  "Inclusion in the ASI blockchain registry for immutable credential verification",
];

export function ASICertification({ resonanceKey }: Props) {
  const [step, setStep] = useState<CertStep>("intro");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", clinic: "", website: "", city: "", country: "", agree: false });
  const [certId, setCertId] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useCrystalTheme();

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = 200; canvas.height = 200;
    const rings: { r: number; a: number; s: number }[] = [];
    for (let i = 0; i < 6; i++) rings.push({ r: 10 + i * 12, a: 0.06 + i * 0.025, s: 0.003 + i * 0.001 });
    let t = 0;
    function animate() {
      if (!ctx) return; t += 0.01; ctx.clearRect(0, 0, 200, 200); ctx.translate(100, 100);
      ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fillStyle = `${theme.resort.terracotta}40`; ctx.fill();
      for (const ring of rings) { ctx.beginPath(); ctx.arc(0, 0, ring.r + Math.sin(t * ring.s) * 1.5, 0, Math.PI * 2); ctx.strokeStyle = `${theme.resort.terracotta}${Math.round(ring.a * 255).toString(16).padStart(2, "0")}`; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  const issueCert = () => {
    const id = `ASI-CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setCertId(id);
    setStep("issued");
  };

  const glassBg = `linear-gradient(145deg, rgba(255,247,214,0.03), ${theme.resort.sandalwood}04)`;
  const inputStyle: React.CSSProperties = { padding: "10px 12px", borderRadius: 10, border: `1px solid ${theme.border.subtle}`, background: `linear-gradient(145deg, rgba(255,247,214,0.02), ${theme.resort.sandalwood}04)`, color: theme.text.primary, fontSize: 12, fontFamily: "'Inter', sans-serif", outline: "none", width: "100%", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" };

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16, height: "100%", overflow: "auto" }}>
      <div style={{ textAlign: "center" }}>
        <canvas ref={canvasRef} width={200} height={200} style={{ width: 50, height: 50, borderRadius: 25, margin: "0 auto 6px" }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: theme.text.primary }}>ASI Certification</h1>
        <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 2, marginTop: 2 }}>AYUR SANCTUARY INTERNATIONAL · FOUNDATION SEAL</div>
      </div>

      {step === "intro" && (
        <>
          <div style={{ padding: 14, borderRadius: 12, background: glassBg, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.border.subtle}` }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: theme.text.secondary, lineHeight: 1.8 }}>
              "The ASI Foundation Certification is a living mark of authenticity. It signifies that a practitioner, clinic, resort, or gurukul adheres to the highest standards of authentic Ayurvedic practice, verified through the ASI network and sealed on the blockchain for immutable trust."
            </p>
          </div>

          <div>
            <div style={{ fontSize: 9, color: theme.text.muted, letterSpacing: 1, marginBottom: 8 }}>CHOOSE YOUR CERTIFICATION LEVEL</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {LEVELS.map(level => (
                <button key={level.id} onClick={() => setSelectedLevel(level.id)}
                  style={{ padding: 14, borderRadius: 12, border: `1px solid ${selectedLevel === level.id ? `${level.color}50` : theme.border.subtle}`, background: selectedLevel === level.id ? `${level.color}08` : glassBg, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: "inherit", transition: "all 0.3s ease" }}
                >
                  <div style={{ fontSize: 12, color: level.color, fontWeight: 500 }}>{level.label}</div>
                  <div style={{ fontSize: 10, color: theme.text.secondary, marginTop: 4, lineHeight: 1.5 }}>{level.desc}</div>
                  <div style={{ fontSize: 10, color: theme.resort.amber, marginTop: 6, fontFamily: "monospace" }}>{level.fee}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: 14, borderRadius: 12, background: glassBg, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.border.subtle}` }}>
            <div style={{ fontSize: 9, color: theme.resort.terracotta, letterSpacing: 1, marginBottom: 8 }}>BENEFITS OF CERTIFICATION</div>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4, fontSize: 11, color: theme.text.secondary, lineHeight: 1.5 }}>
                <span style={{ color: theme.resort.palm, fontSize: 12 }}>✦</span>
                <span>{b}</span>
              </div>
            ))}
          </div>

          <button onClick={() => setStep("apply")} disabled={!selectedLevel}
            style={{ padding: "12px 24px", borderRadius: 20, border: `1px solid ${selectedLevel ? `${theme.resort.terracotta}40` : theme.border.subtle}`, background: selectedLevel ? `${theme.resort.terracotta}08` : "transparent", color: selectedLevel ? theme.resort.terracotta : theme.text.muted, fontSize: 12, cursor: selectedLevel ? "pointer" : "not-allowed", fontFamily: "inherit", letterSpacing: 1, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", transition: "all 0.3s ease", opacity: selectedLevel ? 1 : 0.5 }}
          >APPLY FOR CERTIFICATION</button>
        </>
      )}

      {step === "apply" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 10, color: theme.text.muted, letterSpacing: 1, marginBottom: 4 }}>APPLICATION FORM · {LEVELS.find(l => l.id === selectedLevel)?.label}</div>
          {[{ l: "Full Name", k: "name" }, { l: "Email", k: "email" }, { l: "Phone", k: "phone" }, { l: "Clinic/Organization Name", k: "clinic" }, { l: "Website", k: "website" }, { l: "City", k: "city" }, { l: "Country", k: "country" }].map(f => (
            <div key={f.k}>
              <div style={{ fontSize: 9, color: theme.text.muted, marginBottom: 2 }}>{f.l}</div>
              <input value={(form as any)[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} placeholder={f.l} style={inputStyle} />
            </div>
          ))}
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 4 }}>
            <input type="checkbox" checked={form.agree} onChange={e => setForm({ ...form, agree: e.target.checked })} style={{ accentColor: theme.resort.terracotta }} />
            <div style={{ fontSize: 10, color: theme.text.secondary }}>I confirm that all information provided is accurate and that I adhere to authentic Ayurvedic standards as defined by the ASI Foundation.</div>
          </label>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button onClick={() => setStep("intro")} style={{ flex: 1, padding: "10px", borderRadius: 14, border: `1px solid ${theme.border.subtle}`, background: "transparent", color: theme.text.muted, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>← BACK</button>
            <button onClick={issueCert} disabled={!form.agree || !form.name || !form.email} style={{ flex: 2, padding: "10px", borderRadius: 14, border: `1px solid ${form.agree && form.name && form.email ? `${theme.resort.terracotta}40` : theme.border.subtle}`, background: form.agree && form.name && form.email ? `${theme.resort.terracotta}08` : "transparent", color: form.agree && form.name && form.email ? theme.resort.terracotta : theme.text.muted, fontSize: 11, cursor: form.agree && form.name && form.email ? "pointer" : "not-allowed", fontFamily: "inherit", letterSpacing: 1, opacity: form.agree && form.name && form.email ? 1 : 0.5 }}>
              SUBMIT APPLICATION
            </button>
          </div>
        </div>
      )}

      {step === "issued" && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📜</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: theme.resort.terracotta, marginBottom: 8 }}>Certificate Issued</h2>
          <p style={{ fontSize: 12, color: theme.text.secondary, marginBottom: 16, lineHeight: 1.6 }}>
            Thank you, {form.name}. Your application for <strong>{LEVELS.find(l => l.id === selectedLevel)?.label}</strong> has been received and is being added to the ASI Foundation registry.
          </p>
          <div style={{ padding: 16, borderRadius: 12, background: glassBg, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${theme.resort.terracotta}25`, marginBottom: 16 }}>
            <div style={{ fontSize: 8, color: theme.text.muted, letterSpacing: 1, marginBottom: 6 }}>CERTIFICATE ID</div>
            <div style={{ fontSize: 11, color: theme.resort.amber, fontFamily: "monospace", letterSpacing: 2, wordBreak: "break-all" }}>{certId}</div>
            <div style={{ fontSize: 8, color: theme.text.muted, marginTop: 6, fontFamily: "monospace" }}>🔗 View on ASI Blockchain · {new Date().toLocaleDateString()}</div>
          </div>
          <div style={{ fontSize: 10, color: theme.text.secondary, lineHeight: 1.6, fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
            "Your certification is a living seal — verified, transparent, and anchored in the immutable light of Dhanvantari's wisdom."
          </div>
        </div>
      )}
    </div>
  );
}
