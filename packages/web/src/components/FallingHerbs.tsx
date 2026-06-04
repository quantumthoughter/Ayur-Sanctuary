import { useEffect, useRef } from "react";

interface FallingHerbsProps {
  count?: number;
}

const HERBS = ["🌿", "🍃", "🌱", "☘️", "🌾", "🌸", "💚"];

export function FallingHerbs({ count = 20 }: FallingHerbsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const leaves: { x: number; y: number; vx: number; vy: number; r: number; a: number; rot: number; rotSpeed: number; herb: string; alpha: number }[] = [];
    for (let i = 0; i < count; i++) {
      leaves.push({
        x: Math.random() * w,
        y: Math.random() * h - h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0.3 + Math.random() * 0.5,
        r: 8 + Math.random() * 12,
        a: Math.random() * Math.PI * 2,
        rot: 0,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        herb: HERBS[Math.floor(Math.random() * HERBS.length)],
        alpha: 0.3 + Math.random() * 0.4,
      });
    }

    let t = 0;
    function animate() {
      if (!ctx) return;
      t += 0.01;
      ctx.clearRect(0, 0, w, h);

      for (const leaf of leaves) {
        leaf.x += leaf.vx + Math.sin(t + leaf.a) * 0.2;
        leaf.y += leaf.vy;
        leaf.rot += leaf.rotSpeed;
        if (leaf.y > h + 20) { leaf.y = -20; leaf.x = Math.random() * w; }

        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rot);
        ctx.globalAlpha = leaf.alpha;
        ctx.font = `${leaf.r}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(leaf.herb, 0, 0);
        ctx.restore();
      }

      requestAnimationFrame(animate);
    }
    animate();

    return () => { window.removeEventListener("resize", resize); };
  }, [count]);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }} />;
}
