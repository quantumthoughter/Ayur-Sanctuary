import { useEffect } from "react";
import { useCrystalTheme } from "../theme/CrystalThemeContext";

export function useParticleEffect(canvasRef: React.RefObject<HTMLCanvasElement | null>, options?: {
  count?: number;
  color?: string;
  speed?: number;
  size?: [number, number];
}) {
  const { mode } = useCrystalTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = options?.count || 50;
    const speed = options?.speed || 0.3;
    const baseColor = options?.color || (mode === "ayur-resort" ? "255, 247, 214" : "200, 180, 255");
    const minR = options?.size?.[0] || 1;
    const maxR = options?.size?.[1] || 3;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number; da: number; drift: number }[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed * 0.4,
        vy: (Math.random() - 0.5) * speed * 0.4,
        r: minR + Math.random() * (maxR - minR),
        a: 0.08 + Math.random() * 0.25,
        da: 0.003 + Math.random() * 0.008,
        drift: Math.random() * Math.PI * 2,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx + Math.sin(Date.now() * 0.0003 + p.drift) * 0.1;
        p.y += p.vy + Math.cos(Date.now() * 0.0002 + p.drift) * 0.1;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const pulse = Math.sin(Date.now() * p.da) * 0.5 + 0.5;
        const alpha = p.a * (0.5 + pulse * 0.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseColor}, ${Math.max(0.02, Math.min(0.4, alpha))})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
}
