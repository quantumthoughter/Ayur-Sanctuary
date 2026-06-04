import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { AYUR_RESORT, AYUR_LOTUS, AYUR_MOONLIGHT, type CrystalTheme, type CrystalThemeMode } from "./CrystalTheme";

interface ThemeContextValue {
  theme: CrystalTheme;
  mode: CrystalThemeMode;
  toggle: () => void;
  setMode: (mode: CrystalThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const MODE_CYCLE: CrystalThemeMode[] = ["ayur-resort", "ayur-lotus", "ayur-moonlight"];
const MODE_LABELS: Record<CrystalThemeMode, string> = {
  "ayur-resort": "Ayur Resort ☀️",
  "ayur-lotus": "Ayur Lotus 🌸",
  "ayur-moonlight": "Ayur Moonlight 🌙",
};

export function CrystalThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<CrystalThemeMode>(() => {
    const stored = localStorage.getItem("crystal-theme");
    if (stored === "ayur-resort" || stored === "ayur-lotus" || stored === "ayur-moonlight") return stored;
    return "ayur-resort";
  });

  const theme = mode === "ayur-resort" ? AYUR_RESORT : mode === "ayur-lotus" ? AYUR_LOTUS : AYUR_MOONLIGHT;

  useEffect(() => {
    localStorage.setItem("crystal-theme", mode);
    document.documentElement.className = mode;

    const root = document.documentElement;
    root.style.setProperty("--bg-primary", theme.bg.primary);
    root.style.setProperty("--bg-secondary", theme.bg.secondary);
    root.style.setProperty("--bg-tertiary", theme.bg.tertiary);
    root.style.setProperty("--text-primary", theme.text.primary);
    root.style.setProperty("--text-secondary", theme.text.secondary);
    root.style.setProperty("--text-muted", theme.text.muted);
    root.style.setProperty("--accent", theme.resort.terracotta);
    root.style.setProperty("--accent-hover", theme.resort.turmeric);
    root.style.setProperty("--sandalwood", theme.resort.sandalwood);
    root.style.setProperty("--palm", theme.resort.palm);
    root.style.setProperty("--amber", theme.resort.amber);
  }, [mode, theme]);

  const toggle = useCallback(() => {
    setModeState(prev => {
      const idx = MODE_CYCLE.indexOf(prev);
      return MODE_CYCLE[(idx + 1) % MODE_CYCLE.length];
    });
  }, []);

  const setMode = useCallback((m: CrystalThemeMode) => setModeState(m), []);

  return (
    <ThemeContext.Provider value={{ theme, mode, toggle, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useCrystalTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useCrystalTheme must be used within CrystalThemeProvider");
  return ctx;
}

export { MODE_LABELS };
export { ThemeContext };
