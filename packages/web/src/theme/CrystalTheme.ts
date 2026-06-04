export type CrystalThemeMode = "ayur-resort" | "ayur-lotus" | "ayur-moonlight";

export interface CrystalTheme {
  mode: CrystalThemeMode;
  label: string;

  resort: {
    sandalwood: string;
    terracotta: string;
    turmeric: string;
    palm: string;
    lotus: string;
    clay: string;
    amber: string;
    sunrise: string;
  };

  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
    cardHover: string;
  };

  text: {
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
  };

  border: {
    subtle: string;
    hover: string;
  };

  glow: string;

  pathColors: Record<string, string>;
}

export const AYUR_RESORT: CrystalTheme = {
  mode: "ayur-resort",
  label: "Ayur Resort ☀️",

  resort: {
    sandalwood: "#d4a373",
    terracotta: "#e07a5f",
    turmeric: "#f4a261",
    palm: "#2a9d8f",
    lotus: "#e9c46a",
    clay: "#8d6e63",
    amber: "#ffb703",
    sunrise: "#fb8500",
  },

  bg: {
    primary: "#faf3e0",
    secondary: "#f5ebd0",
    tertiary: "#efe3c0",
    card: "rgba(212, 163, 115, 0.08)",
    cardHover: "rgba(212, 163, 115, 0.15)",
  },

  text: {
    primary: "#3e2a1e",
    secondary: "#5c4033",
    muted: "#8d6e63",
    accent: "#e07a5f",
  },

  border: {
    subtle: "rgba(212, 163, 115, 0.2)",
    hover: "rgba(224, 122, 95, 0.3)",
  },

  glow: "0 0 20px rgba(244, 162, 97, 0.15), 0 0 40px rgba(224, 122, 95, 0.05)",
  pathColors: {
    stillness: "#e07a5f",
    harmonic: "#f4a261",
    detox: "#2a9d8f",
    somatic: "#e9c46a",
    celestial: "#264653",
    union: "#fb8500",
  },
};

export const AYUR_LOTUS: CrystalTheme = {
  mode: "ayur-lotus",
  label: "Ayur Lotus 🌸",

  resort: {
    sandalwood: "#b8a9c9",
    terracotta: "#c77d9a",
    turmeric: "#e8a87c",
    palm: "#7ebc9e",
    lotus: "#f0c2d4",
    clay: "#9a7aa0",
    amber: "#f4c2c2",
    sunrise: "#f4a0b0",
  },

  bg: {
    primary: "#fdf6f0",
    secondary: "#f8eee8",
    tertiary: "#f3e5dc",
    card: "rgba(200, 125, 154, 0.06)",
    cardHover: "rgba(200, 125, 154, 0.12)",
  },

  text: {
    primary: "#3d2c3a",
    secondary: "#5e4b5a",
    muted: "#9a7aa0",
    accent: "#c77d9a",
  },

  border: {
    subtle: "rgba(200, 125, 154, 0.15)",
    hover: "rgba(200, 125, 154, 0.25)",
  },

  glow: "0 0 20px rgba(232, 168, 124, 0.12), 0 0 40px rgba(200, 125, 154, 0.05)",
  pathColors: {
    stillness: "#c77d9a",
    harmonic: "#e8a87c",
    detox: "#7ebc9e",
    somatic: "#f0c2d4",
    celestial: "#b8a9c9",
    union: "#f4c2c2",
  },
};

export const AYUR_MOONLIGHT: CrystalTheme = {
  mode: "ayur-moonlight",
  label: "Ayur Moonlight 🌙",

  resort: {
    sandalwood: "#a0897a",
    terracotta: "#c48a7a",
    turmeric: "#d4a574",
    palm: "#5a8a7a",
    lotus: "#c4a8c0",
    clay: "#7a6a5a",
    amber: "#d4b87a",
    sunrise: "#e8a060",
  },

  bg: {
    primary: "#1a1620",
    secondary: "#241e2c",
    tertiary: "#2e2638",
    card: "rgba(160, 137, 122, 0.06)",
    cardHover: "rgba(160, 137, 122, 0.12)",
  },

  text: {
    primary: "#e8e0d0",
    secondary: "#c4b8a8",
    muted: "#8a7a6a",
    accent: "#c48a7a",
  },

  border: {
    subtle: "rgba(160, 137, 122, 0.12)",
    hover: "rgba(196, 138, 122, 0.25)",
  },

  glow: "0 0 20px rgba(196, 138, 122, 0.12), 0 0 40px rgba(160, 137, 122, 0.05)",
  pathColors: {
    stillness: "#c48a7a",
    harmonic: "#d4a574",
    detox: "#5a8a7a",
    somatic: "#c4a8c0",
    celestial: "#a0897a",
    union: "#d4b87a",
  },
};

export const THEMES: Record<CrystalThemeMode, CrystalTheme> = {
  "ayur-resort": AYUR_RESORT,
  "ayur-lotus": AYUR_LOTUS,
  "ayur-moonlight": AYUR_MOONLIGHT,
};
