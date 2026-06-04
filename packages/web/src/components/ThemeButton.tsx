import type { ReactNode, CSSProperties } from "react";
import { useCrystalTheme } from "../theme/CrystalThemeContext";

interface ThemeButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  color?: string;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  style?: CSSProperties;
  disabled?: boolean;
  icon?: string;
  subtitle?: string;
}

export function ThemeButton({ children, onClick, variant = "primary", color, fullWidth, size = "md", style, disabled, icon, subtitle }: ThemeButtonProps) {
  const { theme, mode } = useCrystalTheme();

  const accentColor = color || theme.resort.terracotta;
  const hoverColor = color || theme.resort.turmeric;

  const sz = size === "sm" ? { padding: "8px 16px", fontSize: 11 } : size === "lg" ? { padding: "16px 32px", fontSize: 14 } : { padding: "12px 24px", fontSize: 13 };

  const base: CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    fontFamily: "'Inter', sans-serif", letterSpacing: 1,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.35s ease", opacity: disabled ? 0.5 : 1,
    width: fullWidth ? "100%" : undefined,
    ...sz, ...style,
  };

  if (variant === "secondary") {
    Object.assign(base, {
      borderRadius: 16,
      border: `1px solid ${accentColor}25`,
      background: `${accentColor}06`,
      color: theme.text.secondary,
    });
  } else if (variant === "ghost") {
    Object.assign(base, {
      borderRadius: 12,
      border: `1px solid ${theme.border.subtle}`,
      background: "transparent",
      color: theme.text.muted,
    });
  } else {
    Object.assign(base, {
      borderRadius: 24,
      border: `1px solid ${accentColor}40`,
      background: `linear-gradient(135deg, ${accentColor}10, ${accentColor}05)`,
      color: theme.text.secondary,
    });
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={base}
      onMouseEnter={e => {
        if (disabled) return;
        e.currentTarget.style.borderColor = hoverColor;
        e.currentTarget.style.background = `linear-gradient(135deg, ${hoverColor}20, ${hoverColor}10)`;
        e.currentTarget.style.color = theme.text.primary;
        e.currentTarget.style.boxShadow = `0 0 20px ${hoverColor}20`;
        if (mode !== "ayur-moonlight") e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        if (disabled) return;
        e.currentTarget.style.cssText = "";
        Object.assign(e.currentTarget.style, base);
      }}
    >
      {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
      {subtitle ? (
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "inherit", fontWeight: 500 }}>{children}</div>
          <div style={{ fontSize: 10, color: theme.text.muted, marginTop: 1 }}>{subtitle}</div>
        </div>
      ) : children}
    </button>
  );
}
