import { useState, useEffect, useRef } from "react";
import type { PathId } from "@asi/core";

interface GatesProps {
  resonanceKey: string;
  onSelectPath: (path: PathId) => void;
  onNadiClick?: () => void;
  onDhanvantariClick?: () => void;
  onMusicClick?: () => void;
  onCertClick?: () => void;
  onAboutClick?: () => void;
  onContactClick?: () => void;
  onThemeToggle?: () => void;
  themeMode?: string;
}

const GATES = [
  { id: "stillness" as PathId, name: "STILLNESS", sub: "crystal calibration", sym: "\u25EF", color: "#e07a5f" },
  { id: "harmonic" as PathId, name: "BREATHWORK", sub: "sound & resonance", sym: "\u2248", color: "#f4a261" },
  { id: "detox" as PathId, name: "DETOX", sub: "purification grotto", sym: "\u25B3", color: "#ffb703" },
  { id: "somatic" as PathId, name: "BODY TEMPLE", sub: "somatic wisdom", sym: "\u25C7", color: "#f472b6" },
  { id: "celestial" as PathId, name: "OBSERVATORY", sub: "consciousness sky", sym: "\u2606", color: "#60a5fa" },
  { id: "union" as PathId, name: "UNION", sub: "temple of union", sym: "\u25C9", color: "#c084fc" },
];

const NAV_TABS = [
  { key: "nadi", label: "N\u0101\u1E0D\u012B" },
  { key: "dhanvantari", label: "Dhanvantari" },
  { key: "music", label: "Sound Temple" },
  { key: "cert", label: "Certification" },
  { key: "about", label: "About Us" },
  { key: "contact", label: "Contact Us" },
];

const S = 640, R = 250, BTN = 140, HALF = 70;

interface Qubit { x: number; y: number; vx: number; vy: number; sz: number; al: number; ph: number; sp: number }

export function Gates({
  resonanceKey, onSelectPath, onNadiClick, onDhanvantariClick,
  onMusicClick, onCertClick, onAboutClick, onContactClick,
  onThemeToggle, themeMode,
}: GatesProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bloomed, setBloomed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const navRef = useRef<HTMLElement>(null);

  const navClick: Record<string, () => void> = {
    nadi: onNadiClick || (() => {}),
    dhanvantari: onDhanvantariClick || (() => {}),
    music: onMusicClick || (() => {}),
    cert: onCertClick || (() => {}),
    about: onAboutClick || (() => {}),
    contact: onContactClick || (() => {}),
  };

  const pos = GATES.map((_, i) => {
    const a = (Math.PI * 2 / 6) * i - Math.PI / 2;
    return { x: Math.cos(a) * R + S / 2, y: Math.sin(a) * R + S / 2 };
  });

  useEffect(() => { setTimeout(() => setBloomed(true), 200); }, []);

  const updateCenter = () => {
    if (gateRef.current) {
      const r = gateRef.current.getBoundingClientRect();
      centerRef.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      updateCenter();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateCenter);
    setTimeout(updateCenter, 400);
    updateCenter();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateCenter);
    };
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext("2d");
    if (!cx) return;

    let w = 0, h = 0;
    const rs = () => { w = cv.width = window.innerWidth; h = cv.height = window.innerHeight; };
    rs();
    window.addEventListener("resize", rs);

    const qs: Qubit[] = [];
    for (let i = 0; i < 35; i++) {
      qs.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.06, vy: (Math.random() - 0.5) * 0.06,
        sz: 0.5 + Math.random() * 1.2, al: 0.1 + Math.random() * 0.3,
        ph: Math.random() * Math.PI * 2, sp: 0.1 + Math.random() * 0.25,
      });
    }

    let t = 0;

    // 3D rotation helpers
    function rx(x: number, y: number, z: number, a: number) {
      const c = Math.cos(a), s = Math.sin(a);
      return { x, y: y * c - z * s, z: y * s + z * c };
    }
    function ry(x: number, y: number, z: number, a: number) {
      const c = Math.cos(a), s = Math.sin(a);
      return { x: x * c + z * s, y, z: -x * s + z * c };
    }
    function project(x: number, y: number, z: number, d: number, s: number) {
      const sc = s / (d + z);
      return { x: x * sc, y: -y * sc };
    }
    function rz(x: number, y: number, z: number, a: number) {
      const c = Math.cos(a), s = Math.sin(a);
      return { x: x * c - y * s, y: x * s + y * c, z };
    }

    // Cube vertices for star tetrahedron
    const cV: [number, number, number][] = [
      [-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],
      [-1,1,-1],[1,1,-1],[1,1,1],[-1,1,1]
    ];
    const t1i = [6,1,4,3]; // upward tetrahedron (positive parity)
    const t2i = [0,7,2,5]; // downward (negative parity)
    const tEdges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];

    function draw() {
      try {
      if (!cx) return;
      t += 0.003;
      cx.clearRect(0, 0, w, h);

      const cxr = centerRef.current.x || w / 2;
      const cyr = centerRef.current.y || h / 2 + 24;
      const br = 0.55 + 0.45 * Math.sin(t * 0.12);

      // Temple pillars
      [w * 0.1, w * 0.28, w * 0.72, w * 0.9].forEach(px => {
        const g = cx.createLinearGradient(px, h, px, 0);
        g.addColorStop(0, "rgba(251,146,60,0)");
        g.addColorStop(0.15, `rgba(251,146,60,${0.08 + br * 0.04})`);
        g.addColorStop(0.5, `rgba(251,146,60,${0.04 + br * 0.03})`);
        g.addColorStop(0.85, `rgba(251,146,60,0.01)`);
        g.addColorStop(1, "rgba(251,146,60,0)");
        cx.fillStyle = g;
        cx.fillRect(px - 2.5, 0, 5, h);
      });

      // Sun rays
      for (let i = 0; i < 9; i++) {
        const a = -0.7 + i * 0.04 + Math.sin(t * 0.08) * 0.02;
        const ln = Math.min(w, h) * 1.3;
        const sx = w * 0.88, sy = h * 0.1;
        const g = cx.createLinearGradient(sx, sy, sx + Math.cos(a) * ln, sy + Math.sin(a) * ln);
        g.addColorStop(0, `rgba(255,215,0,${0.015 + Math.sin(t * 0.2 + i) * 0.008 + br * 0.01})`);
        g.addColorStop(0.3, `rgba(253,230,138,${0.008 + br * 0.006})`);
        g.addColorStop(1, "rgba(253,230,138,0)");
        cx.strokeStyle = g;
        cx.lineWidth = 1 + br * 0.4 + Math.sin(t * 0.15 + i * 0.5) * 0.3;
        cx.beginPath();
        cx.moveTo(sx, sy);
        cx.lineTo(sx + Math.cos(a) * ln, sy + Math.sin(a) * ln);
        cx.stroke();
      }

      // Sun orb glow
      const sg = cx.createRadialGradient(w * 0.9, h * 0.08, 0, w * 0.9, h * 0.08, Math.min(w, h) * 0.45);
      sg.addColorStop(0, `rgba(255,215,0,${0.02 + br * 0.015})`);
      sg.addColorStop(0.2, `rgba(253,230,138,${0.015 + br * 0.01})`);
      sg.addColorStop(0.5, `rgba(251,146,60,${0.008})`);
      sg.addColorStop(1, "rgba(251,146,60,0)");
      cx.fillStyle = sg;
      cx.fillRect(0, 0, w, h);

      // Neural qubits
      qs.forEach((q, i) => {
        q.x += q.vx + Math.sin(t * q.sp + q.ph) * 0.08;
        q.y += q.vy + Math.cos(t * q.sp * 0.7 + q.ph) * 0.08;
        if (q.x < -20) q.x = w + 20;
        if (q.x > w + 20) q.x = -20;
        if (q.y < -20) q.y = h + 20;
        if (q.y > h + 20) q.y = -20;

        for (let j = i + 1; j < qs.length; j++) {
          const dx = qs[j].x - q.x, dy = qs[j].y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            const ca = (1 - dist / 90) * 0.08 * q.al * qs[j].al * br;
            cx.beginPath();
            cx.moveTo(q.x, q.y);
            cx.lineTo(qs[j].x, qs[j].y);
            cx.strokeStyle = `rgba(253,230,138,${ca})`;
            cx.lineWidth = 0.3;
            cx.stroke();
          }
        }

        const qa = q.al * (0.5 + 0.5 * Math.sin(t * q.sp * 2 + q.ph));
        cx.beginPath();
        cx.arc(q.x, q.y, q.sz * (0.8 + 0.2 * br), 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,235,200,${qa * br})`;
        cx.fill();
        cx.beginPath();
        cx.arc(q.x, q.y, q.sz * 0.4, 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,255,240,${qa * br * 0.8})`;
        cx.fill();
      });

      // === STAR GATE ===
      cx.save();
      cx.translate(cxr, cyr);

      const geoR = R;
      const gatePts: { x: number; y: number }[] = [];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 / 6) * i - Math.PI / 2;
        gatePts.push({ x: Math.cos(a) * geoR, y: Math.sin(a) * geoR });
      }

      // === PORTAL RING ===
      cx.save();
      cx.rotate(t * 0.002);
      for (let i = 0; i < 48; i++) {
        const a = (Math.PI * 2 / 48) * i, a2 = (Math.PI * 2 / 48) * (i + 1);
        const g = 0.5 + Math.sin(t * 0.25 + i * 0.25) * 0.3;
        cx.beginPath();
        cx.arc(0, 0, geoR * 1.2, a, a2);
        cx.arc(0, 0, geoR * 1.08, a2, a, true);
        cx.closePath();
        cx.fillStyle = `rgba(253,230,138,${0.03 * g * br})`;
        cx.fill();
      }
      cx.restore();
      cx.beginPath();
      cx.arc(0, 0, geoR * 1.15, 0, Math.PI * 2);
      cx.strokeStyle = `rgba(253,230,138,${0.08 + br * 0.06})`;
      cx.lineWidth = 0.5 + br * 0.4;
      cx.stroke();
      const oh = cx.createRadialGradient(0, 0, geoR * 1.05, 0, 0, geoR * 1.4);
      oh.addColorStop(0, `rgba(253,230,138,${0.02 * br})`);
      oh.addColorStop(0.5, `rgba(251,146,60,${0.01 * br})`);
      oh.addColorStop(1, "rgba(251,146,60,0)");
      cx.fillStyle = oh;
      cx.beginPath();
      cx.arc(0, 0, geoR * 1.4, 0, Math.PI * 2);
      cx.fill();

      // === FLOWER OF LIFE — perfect sacred geometry ===
      // All 7 circles share the same radius so they intersect at the center and at every petal node
      const folPulse = 0.96 + 0.04 * Math.sin(t * 0.15);
      const folR = geoR * folPulse;
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 / 6) * i - Math.PI / 2;
        const fx = Math.cos(a) * geoR, fy = Math.sin(a) * geoR;
        cx.beginPath();
        cx.arc(fx, fy, folR * 1.08, 0, Math.PI * 2);
        cx.fillStyle = `rgba(253,230,138,${0.035 * br})`;
        cx.fill();
        cx.beginPath();
        cx.arc(fx, fy, folR, 0, Math.PI * 2);
        cx.strokeStyle = `rgba(253,230,138,${0.2 * br})`;
        cx.lineWidth = 0.6 + br * 0.4;
        cx.stroke();
        cx.beginPath();
        cx.arc(fx, fy, folR * 0.25, 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,235,180,${0.05 * br})`;
        cx.fill();
      }
      cx.beginPath();
      cx.arc(0, 0, folR, 0, Math.PI * 2);
      cx.fillStyle = `rgba(255,235,180,${0.03 * br})`;
      cx.fill();
      cx.strokeStyle = `rgba(253,230,138,${0.2 * br})`;
      cx.lineWidth = 0.6 + br * 0.4;
      cx.stroke();

      // Petal intersection blooms
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 / 6) * i - Math.PI / 2;
        const px = Math.cos(a) * geoR * 0.5, py = Math.sin(a) * geoR * 0.5;
        const pg = 0.4 + 0.6 * Math.sin(t * 0.15 + i * 0.6);
        cx.beginPath();
        cx.arc(px, py, 2 + br * 3 * pg, 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,215,0,${0.08 * br * pg})`;
        cx.fill();
      }
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 / 12) * i;
        const ir = geoR * 0.5;
        const ix = Math.cos(a) * ir, iy = Math.sin(a) * ir;
        const ig = 0.3 + 0.7 * Math.sin(t * 0.15 + i * 0.5);
        cx.beginPath();
        cx.arc(ix, iy, 1.5 + br * 2 * ig, 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,235,180,${0.06 * br * ig})`;
        cx.fill();
      }

      // === RAINBOW SHIMMER — 528 Hz coherent field ===
      // Rainbow harmonics radiating through the Flower of Life circles
      const rHue = (t * 4) % 360; // slow full-spectrum cycle
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 / 6) * i - Math.PI / 2;
        const fx = Math.cos(a) * geoR, fy = Math.sin(a) * geoR;
        const hOff = i * 8;
        const rg = cx.createRadialGradient(fx, fy, 0, fx, fy, folR * 1.15);
        rg.addColorStop(0, `hsla(${(rHue + 50 + hOff) % 360}, 85%, 70%, ${0.05 * br})`);
        rg.addColorStop(0.4, `hsla(${(rHue + 120 + hOff) % 360}, 75%, 55%, ${0.03 * br})`);
        rg.addColorStop(0.7, `hsla(${(rHue + 220 + hOff) % 360}, 65%, 50%, ${0.015 * br})`);
        rg.addColorStop(1, `hsla(${(rHue + 300 + hOff) % 360}, 55%, 45%, 0)`);
        cx.fillStyle = rg;
        cx.beginPath();
        cx.arc(fx, fy, folR * 1.15, 0, Math.PI * 2);
        cx.fill();
        for (let j = 0; j < 10; j++) {
          const pa = (Math.PI * 2 / 10) * j + t * 0.1 + i * 0.35;
          const pr = folR * (0.7 + 0.3 * Math.sin(t * 0.07 + i * 0.5 + j * 0.4));
          const px = fx + Math.cos(pa) * pr, py = fy + Math.sin(pa) * pr;
          const ps = 0.5 + 0.4 * Math.sin(t * 0.18 + i * 0.2 + j * 0.6);
          const cellH = (rHue + j * 30 + i * 12) % 360;
          cx.beginPath();
          cx.arc(px, py, ps, 0, Math.PI * 2);
          cx.fillStyle = `hsla(${cellH}, 90%, 78%, ${0.07 * br * ps})`;
          cx.fill();
          cx.beginPath();
          cx.arc(px, py, ps * 0.35, 0, Math.PI * 2);
          cx.fillStyle = `hsla(${cellH}, 90%, 92%, ${0.1 * br * ps})`;
          cx.fill();
        }
      }
      { // Center circle rainbow
        const cg = cx.createRadialGradient(0, 0, 0, 0, 0, folR * 1.15);
        cg.addColorStop(0, `hsla(${(rHue + 80) % 360}, 85%, 75%, ${0.05 * br})`);
        cg.addColorStop(0.4, `hsla(${(rHue + 150) % 360}, 75%, 60%, ${0.03 * br})`);
        cg.addColorStop(0.7, `hsla(${(rHue + 240) % 360}, 65%, 50%, ${0.015 * br})`);
        cg.addColorStop(1, `hsla(${(rHue + 320) % 360}, 55%, 45%, 0)`);
        cx.fillStyle = cg;
        cx.beginPath();
        cx.arc(0, 0, folR * 1.15, 0, Math.PI * 2);
        cx.fill();
        for (let j = 0; j < 12; j++) {
          const pa = (Math.PI * 2 / 12) * j + t * 0.08;
          const pr = folR * (0.55 + 0.45 * Math.sin(t * 0.09 + j * 0.35));
          const ps = 0.5 + 0.4 * Math.sin(t * 0.2 + j * 0.5);
          const cellH = (rHue + j * 25) % 360;
          const px = Math.cos(pa) * pr, py = Math.sin(pa) * pr;
          cx.beginPath();
          cx.arc(px, py, ps, 0, Math.PI * 2);
          cx.fillStyle = `hsla(${cellH}, 90%, 78%, ${0.07 * br * ps})`;
          cx.fill();
          cx.beginPath();
          cx.arc(px, py, ps * 0.35, 0, Math.PI * 2);
          cx.fillStyle = `hsla(${cellH}, 90%, 92%, ${0.1 * br * ps})`;
          cx.fill();
        }
      }

      // === 3D STAR TETRAHEDRON — Standing 6-Pointed Star ===
      // Fixed pose: upper tetrahedron spins clockwise, lower counter-clockwise
      const fixY = Math.PI / 6;
      const fixX = Math.PI / 12;
      const spinSpd = 0.08;
      const dist = 2.8;
      const projScale = geoR * 2.0;

      // Upper tetrahedron — golden/amber, clockwise Z spin
      const t1Proj = t1i.map(idx => {
        const v = cV[idx];
        let r = ry(v[0], v[1], v[2], fixY);
        r = rx(r.x, r.y, r.z, fixX);
        r = rz(r.x, r.y, r.z, t * spinSpd);
        return project(r.x, r.y, r.z, dist, projScale);
      });
      cx.strokeStyle = `rgba(255,183,3,${0.25 * br})`;
      cx.lineWidth = 1.2 + br * 0.5;
      tEdges.forEach(([a, b]) => {
        const f = t1Proj[a], pt2 = t1Proj[b];
        cx.beginPath();
        cx.moveTo(f.x, f.y);
        cx.lineTo(pt2.x, pt2.y);
        cx.stroke();
        const pr = (t * 0.3 + a * 0.2 + b * 0.15) % 1;
        const lx = f.x + (pt2.x - f.x) * pr, ly = f.y + (pt2.y - f.y) * pr;
        const lv = Math.sin(pr * Math.PI);
        cx.beginPath();
        cx.arc(lx, ly, 2 + br * 2 * lv, 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,255,240,${0.3 * br * lv})`;
        cx.fill();
      });

      // Lower tetrahedron — silver/cool, counter-clockwise Z spin
      const t2Proj = t2i.map(idx => {
        const v = cV[idx];
        let r = ry(v[0], v[1], v[2], fixY);
        r = rx(r.x, r.y, r.z, fixX);
        r = rz(r.x, r.y, r.z, -t * spinSpd);
        return project(r.x, r.y, r.z, dist, projScale);
      });
      cx.strokeStyle = `rgba(200,215,255,${0.2 * br})`;
      cx.lineWidth = 1 + br * 0.5;
      tEdges.forEach(([a, b]) => {
        const f = t2Proj[a], pt2 = t2Proj[b];
        cx.beginPath();
        cx.moveTo(f.x, f.y);
        cx.lineTo(pt2.x, pt2.y);
        cx.stroke();
        const pr = (t * 0.3 + a * 0.15 + b * 0.2 + 0.5) % 1;
        const lx = f.x + (pt2.x - f.x) * pr, ly = f.y + (pt2.y - f.y) * pr;
        const lv = Math.sin(pr * Math.PI);
        cx.beginPath();
        cx.arc(lx, ly, 2 + br * 2 * lv, 0, Math.PI * 2);
        cx.fillStyle = `rgba(220,235,255,${0.25 * br * lv})`;
        cx.fill();
      });

      // Vertex coronas — per tetrahedron
      t1Proj.forEach((p, i) => {
        const vg = 0.5 + 0.5 * Math.sin(t * 0.2 + i * 0.7);
        cx.beginPath();
        cx.arc(p.x, p.y, 3.5 * vg, 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,215,0,${0.3 * br * vg})`;
        cx.fill();
      });
      t2Proj.forEach((p, i) => {
        const vg = 0.5 + 0.5 * Math.sin(t * 0.2 + i * 0.7);
        cx.beginPath();
        cx.arc(p.x, p.y, 3 * vg, 0, Math.PI * 2);
        cx.fillStyle = `rgba(200,220,255,${0.25 * br * vg})`;
        cx.fill();
      });

      // Star-point connections — fixed orientation (no spin)
      const dir6: [number, number, number][] = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
      const starPts = dir6.map(d => {
        let r = ry(d[0], d[1], d[2], fixY);
        r = rx(r.x, r.y, r.z, fixX);
        return project(r.x, r.y, r.z, dist, projScale);
      });
      starPts.forEach(sp => {
        cx.beginPath();
        cx.moveTo(0, 0);
        cx.lineTo(sp.x, sp.y);
        cx.strokeStyle = `rgba(255,235,180,${0.04 * br})`;
        cx.lineWidth = 0.3;
        cx.stroke();
      });

      // === METATRON RAYS — connecting center to gates ===
      gatePts.forEach((p, i) => {
        const rp = 0.6 + 0.4 * Math.sin(t * 0.12 + i * 0.5);
        cx.beginPath();
        cx.moveTo(0, 0);
        cx.lineTo(p.x * rp, p.y * rp);
        cx.strokeStyle = `rgba(251,146,60,${0.1 * br * rp})`;
        cx.lineWidth = 0.4 + br * 0.2 * rp;
        cx.stroke();
        const lr = (t * 0.15 + i * 0.3) % 1;
        const lx = p.x * rp * lr, ly = p.y * rp * lr;
        cx.beginPath();
        cx.arc(lx, ly, 1.5 + br * 1.5 * Math.sin(lr * Math.PI), 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,215,0,${0.15 * br * Math.sin(lr * Math.PI)})`;
        cx.fill();
      });

      // Hexagon outer ring
      for (let i = 0; i < 6; i++) {
        const j = (i + 1) % 6;
        const hp = 0.6 + 0.4 * Math.sin(t * 0.12 + i * 0.3);
        cx.beginPath();
        cx.moveTo(gatePts[i].x, gatePts[i].y);
        cx.lineTo(gatePts[j].x, gatePts[j].y);
        cx.strokeStyle = `rgba(253,230,138,${0.08 * br * hp})`;
        cx.lineWidth = 0.4 + br * 0.2 * hp;
        cx.stroke();
        const mx = (gatePts[i].x + gatePts[j].x) / 2, my = (gatePts[i].y + gatePts[j].y) / 2;
        const mg = 0.5 + 0.5 * Math.sin(t * 0.2 + i * 0.8);
        cx.beginPath();
        cx.arc(mx, my, 1.5 + br * 1.5 * mg, 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,235,180,${0.06 * br * mg})`;
        cx.fill();
      }

      // Cross connections (opposite vertices)
      for (let i = 0; i < 3; i++) {
        const from = i, to = i + 3;
        const cp = 0.5 + 0.5 * Math.sin(t * 0.12 + i * 0.7);
        cx.beginPath();
        cx.moveTo(gatePts[from].x, gatePts[from].y);
        cx.lineTo(gatePts[to].x, gatePts[to].y);
        cx.strokeStyle = `rgba(251,191,36,${0.1 * br * cp})`;
        cx.lineWidth = 0.4 + br * 0.25 * cp;
        cx.stroke();
        const pr = (t * 0.1 + i * 0.4) % 1;
        const px = gatePts[from].x + (gatePts[to].x - gatePts[from].x) * pr;
        const py = gatePts[from].y + (gatePts[to].y - gatePts[from].y) * pr;
        cx.beginPath();
        cx.arc(px, py, 2 + br * 2 * Math.sin(pr * Math.PI), 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,215,0,${0.2 * br * Math.sin(pr * Math.PI)})`;
        cx.fill();
      }

      // === GATE VERTEX GLOWS ===
      const chakraColors = ["#e07a5f", "#f4a261", "#ffb703", "#f472b6", "#60a5fa", "#c084fc"];
      gatePts.forEach((p, i) => {
        const vg = 0.5 + 0.5 * Math.sin(t * 0.12 + i * 1.0);
        const col = chakraColors[i];
        const s = HALF * 0.55;
        const pulse = 0.92 + 0.08 * Math.sin(t * 0.1 + i * 0.8);
        const hex = (v: number) => Math.max(0, Math.round(v)).toString(16).padStart(2, '0');
        const gr = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, s * 1.6);
        gr.addColorStop(0, `${col}${hex(25 * br * vg)}`);
        gr.addColorStop(0.5, `${col}${hex(12 * br * vg)}`);
        gr.addColorStop(1, `${col}00`);
        cx.fillStyle = gr;
        cx.beginPath();
        cx.arc(p.x, p.y, s * 1.6, 0, Math.PI * 2);
        cx.fill();
        cx.beginPath();
        cx.arc(p.x, p.y, s * pulse, 0, Math.PI * 2);
        cx.strokeStyle = `rgba(253,230,138,${0.2 * br * vg})`;
        cx.lineWidth = 0.8;
        cx.stroke();
        cx.beginPath();
        cx.arc(p.x, p.y, s * 0.08 * pulse, 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,255,240,${0.2 * br * vg})`;
        cx.fill();
      });

      // === CENTER LIGHT — The Amrita Pot ===
      // Bright core — the nectar of immortality glowing at center
      const cGlow = 0.5 + 0.5 * Math.sin(t * 0.2);
      const cR = geoR * (0.15 + 0.08 * cGlow);
      const cvr = cx.createRadialGradient(0, 0, 0, 0, 0, geoR * 0.5);
      cvr.addColorStop(0, `rgba(255,255,240,${0.2 + br * 0.15 + cGlow * 0.1})`);
      cvr.addColorStop(0.1, `rgba(255,235,180,${0.15 + br * 0.12})`);
      cvr.addColorStop(0.3, `rgba(253,230,138,${0.08 + br * 0.08})`);
      cvr.addColorStop(0.5, `rgba(251,146,60,${0.03 + br * 0.04})`);
      cvr.addColorStop(0.8, `rgba(180,90,30,${0.01})`);
      cvr.addColorStop(1, "rgba(180,90,30,0)");
      cx.fillStyle = cvr;
      cx.beginPath();
      cx.arc(0, 0, geoR * 0.5, 0, Math.PI * 2);
      cx.fill();

      // Bright inner core
      cx.beginPath();
      cx.arc(0, 0, cR, 0, Math.PI * 2);
      cx.fillStyle = `rgba(255,255,240,${0.25 + br * 0.15 + cGlow * 0.15})`;
      cx.fill();

      // Light rays radiating through the Flower of Life
      for (let i = 0; i < 24; i++) {
        const a = (Math.PI * 2 / 24) * i + t * 0.04;
        const rayLen = geoR * (0.6 + 0.3 * Math.sin(t * 0.1 + i * 0.4));
        const rayWidth = 0.5 + br * 1.5 * (0.3 + 0.7 * Math.sin(t * 0.15 + i * 0.3));
        const g = cx.createLinearGradient(0, 0, Math.cos(a) * rayLen, Math.sin(a) * rayLen);
        g.addColorStop(0, `rgba(255,255,240,${0.12 + br * 0.08 + cGlow * 0.06})`);
        g.addColorStop(0.3, `rgba(255,235,180,${0.06 + br * 0.05})`);
        g.addColorStop(0.6, `rgba(253,200,100,${0.02 + br * 0.02})`);
        g.addColorStop(1, "rgba(253,200,100,0)");
        cx.strokeStyle = g;
        cx.lineWidth = rayWidth;
        cx.beginPath();
        cx.moveTo(0, 0);
        cx.lineTo(Math.cos(a) * rayLen, Math.sin(a) * rayLen);
        cx.stroke();
      }

      // Energy particles flowing outward from center
      for (let i = 0; i < 25; i++) {
        const pa = t * 0.5 + i * 0.4 + Math.sin(t * 0.08 + i) * 0.2;
        const pd = 5 + ((t * 15 + i * 37) % (geoR * 0.65));
        const ep = 1 - pd / (geoR * 0.65);
        const sz = 0.8 + ep * 1.2;
        cx.beginPath();
        cx.arc(Math.cos(pa) * pd, Math.sin(pa) * pd, sz + Math.sin(t * 0.3 + i) * 0.3, 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,255,240,${ep * 0.2 * br + Math.sin(t * 0.3 + i * 0.7) * 0.04})`;
        cx.fill();
      }

      cx.restore();
      } catch (e) { console.warn("Gate canvas error:", e); }
      requestAnimationFrame(draw);
    }
    draw();
    return () => { window.removeEventListener("resize", rs); };
  }, []);

  return (
    <div style={{
      position: "relative", width: "100%", minHeight: "100vh", overflowY: "auto",
      background: "linear-gradient(160deg, #1a0802 0%, #2a0e04 12%, #4a1a08 32%, #5a2210 45%, #4a1a08 58%, #2a0e04 78%, #1a0802 100%)",
    }}>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />

      {/* Dhanvantari Navigation — brass-warm */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        height: 52, width: "100%",
        display: "flex", alignItems: "center",
        background: scrolled ? "rgba(26,8,2,0.82)" : "rgba(26,8,2,0.35)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(180,120,60,0.08)" : "1px solid transparent",
        transition: "all 0.4s ease",
        padding: "0 24px",
      }}>
        {/* ASI mark — like a brass stamp */}
        <div style={{
          fontSize: 12, color: "#d97706", letterSpacing: 6, fontWeight: 400,
          marginRight: 28, whiteSpace: "nowrap",
          textShadow: "0 0 20px rgba(217,119,6,0.15)",
        }}>
          ASI
        </div>

        {/* Nav tabs — Dhanvantari warm */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, flex: 1, overflowX: "auto" }}>
          {NAV_TABS.map(tab => (
            <button key={tab.key} onClick={navClick[tab.key]}
              style={{
                padding: "6px 14px", borderRadius: 4,
                border: "none", background: "transparent",
                color: "rgba(217,119,6,0.55)", cursor: "pointer",
                fontFamily: "inherit", fontSize: 10, letterSpacing: 1.5,
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
                position: "relative",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fde68a"; e.currentTarget.style.background = "rgba(217,119,6,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(217,119,6,0.55)"; e.currentTarget.style.background = "transparent"; }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Theme toggle */}
        {onThemeToggle && (
          <button onClick={onThemeToggle}
            style={{
              padding: "5px 10px", borderRadius: 4,
              border: "1px solid rgba(217,119,6,0.1)",
              background: "transparent",
              color: "rgba(217,119,6,0.5)", cursor: "pointer",
              fontFamily: "inherit", fontSize: 8, letterSpacing: 1,
              transition: "all 0.25s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(217,119,6,0.8)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(217,119,6,0.5)"}
          >
            {themeMode === "ayur-resort" ? "Resort" : themeMode === "ayur-lotus" ? "Lotus" : "Moonlight"}
          </button>
        )}

        {/* Hamburger — brass ring */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            marginLeft: 8, width: 30, height: 30, borderRadius: 15,
            border: "1px solid rgba(217,119,6,0.2)",
            background: "transparent",
            color: "#d97706", fontSize: 12, cursor: "pointer",
            fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.25s ease",
            letterSpacing: 1,
            textShadow: "0 0 12px rgba(217,119,6,0.1)",
          }}
        >
          {sidebarOpen ? "\u00D7" : "\u2630"}
        </button>
      </nav>

      {/* === Sidebar === */}
      {sidebarOpen && (
        <>
          <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.3)" }} />
          <div style={{
            position: "fixed", top: 0, left: 0, bottom: 0, width: 220, zIndex: 70,
            background: "rgba(26,8,2,0.9)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            borderRight: "1px solid rgba(217,119,6,0.08)",
            padding: "56px 12px 20px", display: "flex", flexDirection: "column", gap: 1,
          }}>
            {GATES.map(g => (
              <button key={g.id} onClick={() => { setSidebarOpen(false); onSelectPath(g.id); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                  borderRadius: 6, border: "none", background: "transparent",
                  color: "#d97706", cursor: "pointer", fontSize: 11,
                  fontFamily: "inherit", transition: "all 0.2s ease",
                  textAlign: "left", letterSpacing: 1,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(217,119,6,0.08)"; e.currentTarget.style.color = "#fde68a"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#d97706"; }}
              >
                <span style={{ fontSize: 11, opacity: 0.5 }}>{g.sym}</span>
                <span style={{ fontWeight: 500 }}>{g.name}</span>
                <span style={{ fontSize: 8, opacity: 0.25, marginLeft: "auto" }}>{g.sub}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* === Hero — Star Gate === */}
      <main style={{
        position: "relative", zIndex: 2,
        width: "100%", minHeight: "calc(100vh - 48px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "20px 20px 60px",
        opacity: bloomed ? 1 : 0,
        transform: bloomed ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 1.5s ease, transform 1.5s ease",
      }}>
        {/* Header — Dhanvantari sunrise */}
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <div style={{
            fontSize: 10, color: "#d97706", letterSpacing: 14, fontWeight: 400,
            textShadow: "0 0 60px rgba(217,119,6,0.3), 0 0 120px rgba(217,119,6,0.1)",
          }}>
            ASI
          </div>
          <div style={{
            fontFamily: "'Playfair Display','Georgia',serif", fontStyle: "italic",
            fontSize: 8, color: "rgba(217,119,6,0.25)",
            letterSpacing: 5, marginTop: 2,
          }}>
            — dhanvantari sunrise ·
          </div>
        </div>

        {/* Star Gate */}
        <div ref={gateRef} style={{ position: "relative", width: S, height: S }}>
          {GATES.map((g, i) => {
            const p = pos[i];
            const h = hovered === i;
            return (
              <button key={g.id} onClick={() => onSelectPath(g.id)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: "absolute",
                  left: p.x - HALF, top: p.y - HALF,
                  width: BTN, height: BTN,
                  borderRadius: "50%",
                  border: `2px solid ${h ? g.color : "rgba(160,120,70,0.25)"}`,
                  background: h
                    ? `radial-gradient(circle at 35% 30%, rgba(255,247,214,0.7) 0%, rgba(196,120,50,0.85) 20%, ${g.color}88 45%, rgba(140,65,20,0.95) 70%, rgba(80,35,10,1) 100%)`
                    : `radial-gradient(circle at 35% 30%, rgba(255,247,214,0.35) 0%, rgba(180,100,40,0.6) 25%, rgba(120,55,20,0.75) 55%, rgba(80,35,12,0.85) 80%, rgba(50,25,8,1) 100%)`,
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                  transform: h ? "scale(1.1)" : "scale(1)",
                  boxShadow: h
                    ? `0 0 0 2px rgba(74,45,20,0.6), 0 0 0 5px rgba(160,120,70,0.4), 0 0 0 8px rgba(60,35,12,0.5), 0 0 0 11px rgba(180,140,80,0.3), 0 0 0 14px rgba(50,25,8,0.2), 0 0 50px ${g.color}55, inset 0 0 30px ${g.color}33, 0 8px 32px rgba(0,0,0,0.5)`
                    : `0 0 0 2px rgba(74,45,20,0.4), 0 0 0 5px rgba(160,120,70,0.25), 0 0 0 8px rgba(60,35,12,0.3), 0 0 0 11px rgba(180,140,80,0.15), 0 0 0 14px rgba(50,25,8,0.1), 0 0 25px rgba(253,230,138,0.06), inset 0 2px 6px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.35)`,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 1, color: h ? "#fff" : "#fde68a",
                  zIndex: h ? 10 : 1,
                  textShadow: h ? "0 0 20px rgba(0,0,0,0.5)" : "0 0 12px rgba(0,0,0,0.3)",
                }}
              >
                <span style={{
                  fontSize: h ? 20 : 16, lineHeight: 1,
                  transition: "all 0.3s ease",
                  filter: h ? `drop-shadow(0 0 10px ${g.color})` : "none",
                }}>
                  {g.sym}
                </span>
                <span style={{
                  fontSize: h ? 11 : 9, fontWeight: 700, letterSpacing: 2.5,
                  transition: "all 0.3s ease",
                  color: h ? "#fff" : "#fde68a",
                  textShadow: h ? "0 0 20px rgba(0,0,0,0.6)" : "0 0 12px rgba(0,0,0,0.4)",
                }}>
                  {g.name}
                </span>
                <span style={{
                  fontSize: 6.5, fontWeight: 300, letterSpacing: 2,
                  opacity: h ? 0.8 : 0.5, color: h ? "#d4a373" : "#a16207",
                }}>
                  {g.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dhanvantari resonance signature */}
        <div style={{ fontSize: 7, color: "rgba(217,119,6,0.25)", fontFamily: "monospace", letterSpacing: 4, marginTop: 14 }}>
          {resonanceKey}
        </div>

        {/* === Dhanvantari scroll content === */}
        <div style={{ maxWidth: 640, width: "100%", marginTop: 48, padding: "0 20px" }}>
          {/* brass divider */}
          <div style={{
            width: 80, height: 1, margin: "0 auto 36px",
            background: "linear-gradient(90deg, transparent, rgba(217,119,6,0.3), transparent)",
          }} />

          {/* portal description */}
          <div style={{
            background: "rgba(26,8,2,0.5)",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            borderRadius: 12, padding: 28,
            border: "1px solid rgba(217,119,6,0.06)",
            marginBottom: 20,
          }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 9, color: "#d97706", letterSpacing: 6, fontWeight: 400 }}>
                THE SIX GATES
              </div>
              <div style={{
                width: 40, height: 1, margin: "12px auto",
                background: "rgba(217,119,6,0.15)",
              }} />
            </div>
            <div style={{
              display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
            }}>
              {[
                { sym: "\u25BC", name: "DH\u0100R\u0100", sub: "grounding stream", desc: "The gate of stillness. Root your awareness in the earth of your own being. Calibration through meditation." },
                { sym: "\u25D0", name: "PR\u0100\u1E47A", sub: "life breath", desc: "The gate of breath. Let the rising sun fill your lungs. Harmonic resonance through pranayama." },
                { sym: "\u25B2", name: "TEJA", sub: "inner fire", desc: "The gate of fire. Purify through the radiant heat of conscious awareness. Ayurvedic detox and renewal." },
                { sym: "\u2726", name: "\u0100NANDA", sub: "bliss", desc: "The gate of heart. Embodied presence that opens into unconditional love. Somatic awakening." },
                { sym: "\u25CE", name: "VYOMA", sub: "vast sky", desc: "The gate of space. Expand into the infinite. Celestial connection beyond the veils." },
                { sym: "\u25C9", name: "AK\u1E62A", sub: "eye of wisdom", desc: "The gate of light. See with the eye that perceives beyond duality. Unity consciousness." },
              ].map((item, i) => (
                <div key={i} style={{
                  flex: "1 1 170px", padding: "14px 16px", borderRadius: 10,
                  background: "rgba(26,8,2,0.5)",
                  border: "1px solid rgba(217,119,6,0.06)",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(217,119,6,0.2)"; e.currentTarget.style.background = "rgba(26,8,2,0.6)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(217,119,6,0.06)"; e.currentTarget.style.background = "rgba(26,8,2,0.5)"; }}
                >
                  <div style={{ fontSize: 18, color: "#d97706", marginBottom: 6, lineHeight: 1 }}>{item.sym}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: "#fde68a", marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontSize: 7, color: "rgba(217,119,6,0.4)", letterSpacing: 1.5, marginBottom: 8, fontStyle: "italic" }}>{item.sub}</div>
                  <div style={{ fontSize: 8.5, color: "rgba(212,163,115,0.7)", lineHeight: 1.7, fontWeight: 300 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* portal features */}
          <div style={{
            background: "rgba(26,8,2,0.35)",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            borderRadius: 12, padding: 24, marginBottom: 20,
            border: "1px solid rgba(217,119,6,0.06)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 9, color: "#d97706", letterSpacing: 6, marginBottom: 16 }}>
              PORTAL FEATURES
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { label: "N\u0101\u1E0D\u012B Tarangi\u1E47\u012B", desc: "Ayurvedic pulse diagnosis. Read the rhythm of your constitution. Daily nadi pariksha with AI-guided analysis." },
                { label: "Dhanvantari", desc: "Your personal ayur record keeper. Consultations, medicine recommendations, treatment plans and portal navigation guidance." },
                { label: "Sound Temple", desc: "Healing frequencies and vibrational medicine. 432Hz, solfeggio tones, binaural beats for deep resonance." },
                { label: "Certification", desc: "ASI accredited ayurvedic certification. From foundational knowledge to advanced mastery." },
              ].map((feat, i) => (
                <div key={i} style={{ flex: "1 1 200px", padding: "12px 14px", borderRadius: 8, background: "rgba(26,8,2,0.4)", border: "1px solid rgba(217,119,6,0.05)" }}>
                  <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 2, color: "#fde68a", marginBottom: 6 }}>{feat.label}</div>
                  <div style={{ fontSize: 8, color: "rgba(212,163,115,0.6)", lineHeight: 1.7, fontWeight: 300 }}>{feat.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
            <div style={{ fontSize: 9, color: "rgba(212,163,115,0.5)", letterSpacing: 4, fontWeight: 300 }}>
              AI \u0100yurveda Intelligence
            </div>
            <div style={{ fontSize: 7.5, color: "rgba(217,119,6,0.3)", fontFamily: "'Playfair Display','Georgia',serif", fontStyle: "italic", marginTop: 6 }}>
              science of life alchemies
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
