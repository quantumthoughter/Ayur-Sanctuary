import { useCrystalTheme } from "./CrystalThemeContext";
import type { CrystalThemeMode } from "./CrystalTheme";

export interface PortalThemeColors {
  mode: CrystalThemeMode;
  themeLabel: string;
  accent: string;
  accentHover: string;
  bg: string;
  bgCard: string;
  bgCardHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderHover: string;
  glow: string;
  gradientBg: string;
  sandalwood: string;
  palm: string;
  amber: string;
  turmeric: string;
}

export function usePortalTheme(): PortalThemeColors {
  const { theme, mode } = useCrystalTheme();

  const base = {
    mode,
    themeLabel: theme.label,
    accent: theme.resort.terracotta,
    accentHover: theme.resort.turmeric,
    bg: theme.bg.primary,
    bgCard: theme.bg.card,
    bgCardHover: theme.bg.cardHover,
    text: theme.text.primary,
    textSecondary: theme.text.secondary,
    textMuted: theme.text.muted,
    border: theme.border.subtle,
    borderHover: theme.border.hover,
    glow: theme.glow,
    sandalwood: theme.resort.sandalwood,
    palm: theme.resort.palm,
    amber: theme.resort.amber,
    turmeric: theme.resort.turmeric,
  };

  const gradientBg = mode === "ayur-resort"
    ? `linear-gradient(160deg, ${theme.bg.primary} 0%, ${theme.bg.secondary} 50%, ${theme.bg.tertiary} 100%)`
    : `linear-gradient(160deg, ${theme.bg.primary} 0%, ${theme.bg.secondary} 50%, ${theme.bg.tertiary} 100%)`;

  return { ...base, gradientBg };
}
