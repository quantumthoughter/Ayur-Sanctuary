import type { ReactNode, CSSProperties } from "react";
import { useCrystalTheme } from "../theme/CrystalThemeContext";

interface GlassCardProps {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  hover?: boolean;
  glow?: boolean;
  padding?: string;
}

export function GlassCard({ children, onClick, style, hover = true, glow = false, padding = "16px" }: GlassCardProps) {
  const { theme, mode } = useCrystalTheme();

  const isFire = mode === "ayur-resort";

  const base: CSSProperties = {
    padding,
    borderRadius: 16,
    border: `1px solid ${theme.resort.sandalwood}18`,
    background: `linear-gradient(145deg, rgba(255, 247, 214, 0.04), ${theme.resort.sandalwood}06)`,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    transition: "all 0.4s ease",
    cursor: onClick ? "pointer" : "default",
    boxShadow: glow
      ? isFire
        ? "0 8px 32px rgba(224, 122, 95, 0.08)"
        : "0 8px 32px rgba(155, 109, 255, 0.06)"
      : "none",
    ...style,
  };

  return (
    <div
      onClick={onClick}
      style={base}
      onMouseEnter={hover && onClick ? e => {
        e.currentTarget.style.borderColor = `${theme.resort.terracotta}40`;
        e.currentTarget.style.background = `linear-gradient(145deg, ${theme.resort.sandalwood}12, ${theme.resort.terracotta}08)`;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = isFire
          ? `0 12px 40px ${theme.resort.terracotta}12`
          : `0 12px 40px rgba(155, 109, 255, 0.1)`;
      } : undefined}
      onMouseLeave={hover && onClick ? e => {
        e.currentTarget.style.borderColor = `${theme.resort.sandalwood}18`;
        e.currentTarget.style.background = `linear-gradient(145deg, rgba(255, 247, 214, 0.04), ${theme.resort.sandalwood}06)`;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = glow ? (isFire ? "0 8px 32px rgba(224, 122, 95, 0.08)" : "0 8px 32px rgba(155, 109, 255, 0.06)") : "none";
      } : undefined}
    >
      {children}
    </div>
  );
}
