import { useState } from "react";
import type { PathId } from "@asi/core";

interface LoginProps {
  portalName: PathId | null;
  onComplete: () => void;
  resonanceKey: string;
}

type LoginMethod = "google" | "facebook" | "instagram" | "whatsapp" | "email" | "phone" | null;

const PORTAL_LABELS: Record<PathId, string> = {
  stillness: "Crystal Calibration Chamber",
  harmonic: "Breathwork & Sound Hall",
  detox: "Detoxification Grotto",
  somatic: "Body Temple",
  celestial: "Consciousness Observatory",
  union: "Temple of Union",
};

export function Login({ portalName, onComplete, resonanceKey }: LoginProps) {
  const [method, setMethod] = useState<LoginMethod>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [optLocalMcp, setOptLocalMcp] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => onComplete();
  const portalLabel = portalName ? PORTAL_LABELS[portalName] : "the Sanctuary";

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%", overflow: "auto",
      background: "linear-gradient(160deg, #1a0802 0%, #2a0e04 12%, #4a1a08 32%, #5a2210 45%, #4a1a08 58%, #2a0e04 78%, #1a0802 100%)",
    }}>
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 15%, rgba(251,146,60,0.04), transparent 60%)`,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "40px 24px 60px", display: "flex", flexDirection: "column", gap: 28, minHeight: "100%" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#fb923c", letterSpacing: 4, marginBottom: 8 }}>ASI</div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 14, color: "rgba(253,230,138,0.6)", lineHeight: 1.6 }}>
            Sign in to enter <span style={{ color: "#fde68a" }}>{portalLabel}</span>
          </p>
          <p style={{ fontSize: 10, color: "rgba(251,146,60,0.3)", marginTop: 8, fontFamily: "monospace" }}>{resonanceKey.slice(0, 16)}...</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {!method ? (
            <>
              <LoginBtn icon="🔵" label="Continue with Google" color="#4285F4" onClick={() => setMethod("google")} />
              <LoginBtn icon="🔷" label="Continue with Facebook" color="#1877F2" onClick={() => setMethod("facebook")} />
              <LoginBtn icon="🟣" label="Continue with Instagram" color="#E4405F" onClick={() => setMethod("instagram")} />
              <LoginBtn icon="🟢" label="Continue with WhatsApp" color="#25D366" onClick={() => setMethod("whatsapp")} />
              <LoginBtn icon="✉️" label="Continue with Email" color="#e07a5f" onClick={() => setMethod("email")} />
              <LoginBtn icon="📱" label="Continue with Phone" color="#2a9d8f" onClick={() => setMethod("phone")} />
            </>
          ) : method === "email" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 12, color: "rgba(253,230,138,0.5)", letterSpacing: 1 }}>ENTER YOUR EMAIL</div>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
              <button onClick={handleContinue} style={continueBtn}>CONTINUE</button>
              <button onClick={() => setMethod(null)} style={backBtn}>← Back</button>
            </div>
          ) : method === "phone" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 12, color: "rgba(253,230,138,0.5)", letterSpacing: 1 }}>ENTER YOUR PHONE NUMBER</div>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" style={inputStyle} />
              <button onClick={handleContinue} style={continueBtn}>CONTINUE</button>
              <button onClick={() => setMethod(null)} style={backBtn}>← Back</button>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{method === "google" ? "🔵" : method === "facebook" ? "🔷" : method === "instagram" ? "🟣" : "🟢"}</div>
              <p style={{ color: "rgba(253,230,138,0.6)", fontSize: 14, marginBottom: 20 }}>Connecting to {method.charAt(0).toUpperCase() + method.slice(1)}...</p>
              <button onClick={handleContinue} style={continueBtn}>CONTINUE</button>
              <button onClick={() => setMethod(null)} style={{ ...backBtn, marginTop: 8 }}>← Back</button>
            </div>
          )}
        </div>

        <div style={{ padding: 16, borderRadius: 12, border: "1px solid rgba(251,146,60,0.08)", background: "rgba(26,8,2,0.4)" }}>
          <div style={{ fontSize: 11, color: "#fb923c", letterSpacing: 1, marginBottom: 12 }}>DATA SOVEREIGNTY</div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 12 }}>
            <input type="checkbox" checked={optLocalMcp} onChange={e => setOptLocalMcp(e.target.checked)} style={{ accentColor: "#e07a5f" }} />
            <div>
              <div style={{ fontSize: 12, color: "rgba(253,230,138,0.65)" }}>Use local MCP server</div>
              <div style={{ fontSize: 10, color: "rgba(253,230,138,0.35)" }}>Your data stays on your machine.</div>
            </div>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ accentColor: "#2a9d8f" }} />
            <div>
              <div style={{ fontSize: 12, color: "#2a9d8f" }}>I understand and agree</div>
              <div style={{ fontSize: 10, color: "rgba(253,230,138,0.35)" }}>ASI stores only essential session data. Full transparency logs available.</div>
            </div>
          </label>
        </div>

        <div style={{ padding: 12, borderRadius: 8, background: "rgba(42,157,143,0.04)", border: "1px solid rgba(42,157,143,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: "#2a9d8f", letterSpacing: 1 }}>DATA TRANSPARENCY</div>
            <div style={{ fontSize: 9, color: "rgba(253,230,138,0.3)", fontFamily: "monospace" }}>LIVE</div>
          </div>
          <div style={{ fontSize: 10, color: "rgba(253,230,138,0.4)", lineHeight: 1.6, fontFamily: "monospace" }}>
            • Resonance Key: {resonanceKey.slice(0, 12)}...<br />
            • Portal: {portalLabel}<br />
            • Data stored: minimal session only
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginBtn({ icon, label, color, onClick }: { icon: string; label: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 12,
      border: `1px solid ${color}25`, background: `${color}06`,
      color: "rgba(253,230,138,0.7)", fontSize: 13, cursor: "pointer",
      transition: "all 0.3s ease", width: "100%", textAlign: "left", fontFamily: "inherit",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}12`; e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.transform = "translateX(4px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}06`; e.currentTarget.style.borderColor = `${color}25`; e.currentTarget.style.transform = "translateX(0)"; }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "12px 14px", borderRadius: 10,
  border: "1px solid rgba(251,146,60,0.15)",
  background: "rgba(26,8,2,0.4)", color: "#fde68a",
  fontSize: 14, fontFamily: "'Inter', sans-serif", outline: "none", width: "100%",
};

const continueBtn: React.CSSProperties = {
  padding: "12px 24px", borderRadius: 20,
  border: "1px solid rgba(224,122,95,0.3)",
  background: "rgba(224,122,95,0.08)", color: "#e07a5f",
  fontSize: 13, cursor: "pointer", letterSpacing: 1, fontFamily: "inherit",
};

const backBtn: React.CSSProperties = {
  padding: "8px 16px", borderRadius: 12, border: "none",
  background: "transparent", color: "rgba(253,230,138,0.35)", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
};
