import { useState, useEffect, useRef } from "react";
import { MicroParticles } from "../components/MicroParticles";

interface ArrivalProps {
  onArrive: (resonanceKey: string) => void;
}

export function Arrival({ onArrive }: ArrivalProps) {
  const [showEnter, setShowEnter] = useState(false);
  const [arriving, setArriving] = useState(false);
  const [resonanceKey, setResonanceKey] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  // Forward-reverse seamless loop with fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isForward = true;
    let wasPausedForEnter = false;
    let supportsReverse = true;

    const scheduleNext = () => {
      if (wasPausedForEnter) return;
      if (isForward) {
        // Play forward
        video.playbackRate = 1;
        video.play().catch(() => {});
      } else {
        // Play in reverse
        if (supportsReverse) {
          try {
            video.playbackRate = -1;
            video.play().catch(() => {
              supportsReverse = false;
              // Fallback: loop forward
              video.playbackRate = 1;
              video.loop = true;
              video.play().catch(() => {});
            });
          } catch {
            supportsReverse = false;
            video.playbackRate = 1;
            video.loop = true;
            video.play().catch(() => {});
          }
        }
      }
    };

    const onEnded = () => {
      if (wasPausedForEnter) return;
      isForward = !isForward;
      scheduleNext();
    };

    video.loop = false;
    video.addEventListener("ended", onEnded);

    video.play().then(() => {
      setTimeout(() => setShowEnter(true), 2500);
    }).catch(() => {
      setTimeout(() => setShowEnter(true), 1500);
    });

    return () => {
      video.removeEventListener("ended", onEnded);
      wasPausedForEnter = true;
    };
  }, []);

  const handleEnter = () => {
    setArriving(true);
    const key = `ASI-${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`.toUpperCase();
    setResonanceKey(key);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.playbackRate = 1;
    }
    setTimeout(() => onArrive(key), 1200);
  };

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%", overflow: "hidden",
      background: "#1a0802",
    }}>
      {/* Micro particles everywhere */}
      <MicroParticles color="rgba(255, 247, 214, 0.4)" count={80} speed={0.3} opacity={0.35} />

      {/* Video Background */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          filter: "brightness(0.65) saturate(1.1)",
        }}
        src="/videos/welcome_hero.mp4"
      />

      {/* Shimmer overlay — makes the image feel alive */}
      <div
        ref={shimmerRef}
        style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: `
            radial-gradient(ellipse at 30% 40%, rgba(255, 183, 3, 0.04) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 60%, rgba(224, 122, 95, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(212, 163, 115, 0.04) 0%, transparent 50%)
          `,
          animation: "shimmer 6s ease infinite alternate",
        }}
      />

      {/* Gradient overlays */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: `linear-gradient(180deg, rgba(26,8,2,0.35) 0%, transparent 35%, transparent 65%, rgba(26,8,2,0.55) 100%)`,
      }} />

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", zIndex: 1,
        background: "linear-gradient(0deg, rgba(212,163,115,0.1), transparent)",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "space-between",
        padding: "60px 24px 80px",
      }}>
        {/* Top: ASI Cinematic Reveal */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 13, color: "#e07a5f", letterSpacing: 10, fontWeight: 500, marginBottom: 14,
            opacity: 0, animation: "fadeDown 1s ease 0.5s forwards",
            textShadow: "0 0 30px rgba(224, 122, 95, 0.3)",
          }}>
            ASI
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 46, fontWeight: 400,
            color: "#fff7d6", letterSpacing: 8, lineHeight: 1.2,
            opacity: 0, animation: "fadeDown 1s ease 0.8s forwards",
            textShadow: "0 0 40px rgba(255, 247, 214, 0.12)",
          }}>
            Ayur Sanctuary
          </h1>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 300,
            color: "#fde68a", letterSpacing: 18, marginTop: -2,
            opacity: 0, animation: "fadeDown 1s ease 1.1s forwards",
            textShadow: "0 0 30px rgba(253, 230, 138, 0.08)",
          }}>
            International
          </h1>
          <div style={{
            width: 60, height: 1,
            background: "linear-gradient(90deg, transparent, #e07a5f, transparent)",
            margin: "16px auto 0",
            opacity: 0, animation: "fadeIn 0.8s ease 1.5s forwards",
          }} />
          <div style={{
            fontFamily: "'Playfair Display', serif", fontStyle: "italic",
            fontSize: 12, color: "#c4a080", letterSpacing: 4, marginTop: 10,
            opacity: 0, animation: "fadeIn 0.8s ease 1.8s forwards",
          }}>
            — The Chrysalis —
          </div>
        </div>

        {/* Bottom: Glass-morphism Enter Button */}
        <div style={{
          textAlign: "center",
          opacity: showEnter ? 1 : 0,
          transform: showEnter ? "translateY(0)" : "translateY(25px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          <button
            onClick={handleEnter}
            disabled={arriving}
            style={{
              padding: "16px 60px", borderRadius: 30,
              border: "1px solid rgba(255, 183, 3, 0.2)",
              background: "linear-gradient(145deg, rgba(255, 247, 214, 0.06), rgba(224, 122, 95, 0.04))",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              color: "#fde68a",
              fontSize: 14, fontFamily: "'Inter', sans-serif",
              letterSpacing: 5,
              cursor: arriving ? "wait" : "pointer",
              transition: "all 0.5s ease",
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "linear-gradient(145deg, rgba(255, 247, 214, 0.12), rgba(224, 122, 95, 0.08))";
              e.currentTarget.style.borderColor = "rgba(255, 183, 3, 0.5)";
              e.currentTarget.style.color = "#fff7d6";
              e.currentTarget.style.boxShadow = "0 0 35px rgba(255, 183, 3, 0.12), 0 4px 24px rgba(0,0,0,0.15)";
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "linear-gradient(145deg, rgba(255, 247, 214, 0.06), rgba(224, 122, 95, 0.04))";
              e.currentTarget.style.borderColor = "rgba(255, 183, 3, 0.2)";
              e.currentTarget.style.color = "#fde68a";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.15)";
              e.currentTarget.style.transform = "translateY(0) scale(1)";
            }}
          >
            {arriving ? "ARRIVING..." : "ENTER"}
          </button>
        </div>

        {/* Arrival — Flower Blooming */}
        {arriving && (
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 3, textAlign: "center",
            animation: "fadeIn 0.5s ease",
          }}>
            {/* Flower of Life arrival glow */}
            <div style={{
              width: 160, height: 160, borderRadius: 80, margin: "0 auto",
              position: "relative",
              animation: "bloomIn 1s ease forwards",
            }}>
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <div key={i} style={{
                  position: "absolute",
                  top: "50%", left: "50%",
                  width: 40, height: 40, borderRadius: 20,
                  margin: -20,
                  background: `radial-gradient(circle, rgba(224, 122, 95, ${0.15 - i * 0.015}), transparent)`,
                  transform: `translate(${Math.cos(angle * Math.PI / 180) * 45}px, ${Math.sin(angle * Math.PI / 180) * 45}px) scale(${0.3 + i * 0.1})`,
                  animation: "petalBloom 0.6s ease forwards",
                  animationDelay: `${0.1 + i * 0.08}s`,
                  opacity: 0,
                }} />
              ))}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 32, animation: "fadeIn 0.5s ease 0.6s forwards", opacity: 0,
              }}>🕉️</div>
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#fff7d6", letterSpacing: 3, marginTop: 12, animation: "fadeUp 0.5s ease 0.8s forwards", opacity: 0 }}>
              You have arrived.
            </p>
            <p style={{ fontSize: 9, color: "#c4a080", fontFamily: "monospace", letterSpacing: 2, marginTop: 6, animation: "fadeUp 0.5s ease 1s forwards", opacity: 0 }}>
              {resonanceKey}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
