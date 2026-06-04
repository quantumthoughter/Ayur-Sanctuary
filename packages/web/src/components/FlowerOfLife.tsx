import { useEffect, useRef } from "react";

interface FlowerOfLifeProps {
  size?: number;
}

export function FlowerOfLife({ size = 420 }: FlowerOfLifeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2);

    const cx = size / 2;
    const cy = size / 2;
    const R = size * 0.38;
    const r = size * 0.15;

    let t = 0;
    function animate() {
      if (!ctx) return;
      t += 0.005;
      ctx.clearRect(0, 0, size, size);

      ctx.save();
      ctx.translate(cx, cy);

      // Slow rotation
      ctx.rotate(t * 0.008);

      // === Tetrahedron ===
      const tetraR = R * 0.85;
      const tetraPoints: { x: number; y: number }[] = [];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 / 6) * i - Math.PI / 2;
        tetraPoints.push({
          x: Math.cos(a) * tetraR,
          y: Math.sin(a) * tetraR,
        });
      }

      // Tetrahedron edges — connecting to form the star
      for (let i = 0; i < 6; i++) {
        for (let j = i + 1; j < 6; j++) {
          const d = Math.sqrt(
            Math.pow(tetraPoints[i].x - tetraPoints[j].x, 2) +
            Math.pow(tetraPoints[i].y - tetraPoints[j].y, 2)
          );
          if (d > tetraR * 0.5 && d < tetraR * 1.9) {
            ctx.beginPath();
            ctx.moveTo(tetraPoints[i].x, tetraPoints[i].y);
            ctx.lineTo(tetraPoints[j].x, tetraPoints[j].y);
            ctx.strokeStyle = `rgba(251, 146, 60, ${0.06 + Math.sin(t + i * 0.5) * 0.03})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Inner tetrahedron (counter-rotating)
      const innerR = tetraR * 0.5;
      ctx.rotate(-t * 0.012);
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 / 6) * i;
        const px = Math.cos(a) * innerR;
        const py = Math.sin(a) * innerR;
        ctx.beginPath();
        ctx.arc(px, py, 1.5 + Math.sin(t + i) * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 100, ${0.08 + Math.sin(t * 0.5 + i) * 0.04})`;
        ctx.fill();
      }
      ctx.rotate(t * 0.012);

      // === Flower of Life inner circles ===
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 / 6) * i;
        const px = Math.cos(a) * r * 1.2;
        const py = Math.sin(a) * r * 1.2;
        const pulse = 0.6 + Math.sin(t + i * 0.7) * 0.15;
        ctx.beginPath();
        ctx.arc(px, py, r * 0.28 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 100, ${0.03 + Math.sin(t * 0.4 + i) * 0.015})`;
        ctx.fill();
      }

      // Center glow
      const centerG = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.2);
      centerG.addColorStop(0, `rgba(255, 200, 100, ${0.06 + Math.sin(t * 0.3) * 0.03})`);
      centerG.addColorStop(1, "rgba(255, 200, 100, 0)");
      ctx.fillStyle = centerG;
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Subtle outer ring
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.95, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 200, 100, ${0.04 + Math.sin(t * 0.2) * 0.02})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();

      requestAnimationFrame(animate);
    }
    animate();
  }, [size]);

  return <canvas ref={canvasRef} style={{ width: size, height: size, display: "block" }} />;
}
