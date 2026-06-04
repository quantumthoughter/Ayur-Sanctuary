import { useCrystalTheme, MODE_LABELS } from "../theme/CrystalThemeContext";
import type { View } from "../App";
import type { CrystalThemeMode } from "../theme/CrystalTheme";

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
  currentView: View;
  onNavigate: (view: View) => void;
  resonanceKey: string;
  onThemeToggle: () => void;
  themeMode: CrystalThemeMode;
}

interface NavItem {
  view: View;
  icon: string;
  label: string;
  tooltip: string;
}

const NAV_ITEMS: NavItem[] = [
  { view: "gates", icon: "🏛️", label: "Gates", tooltip: "Return to the Gates" },
  { view: "core", icon: "💎", label: "Sovereign Core", tooltip: "Your Inner Sanctuary" },
  { view: "calibration", icon: "🔮", label: "Crystal Calibration", tooltip: "Tune Your Instrument" },
  { view: "breathwork", icon: "🌊", label: "Breathwork Hall", tooltip: "Ride the Wave of Life" },
  { view: "detox", icon: "🌿", label: "Detox Grotto", tooltip: "Liberation of Light" },
  { view: "somatic", icon: "🧬", label: "Somatic Wisdom", tooltip: "Body Temple" },
  { view: "celestial", icon: "🌌", label: "Celestial Nav", tooltip: "Consciousness Observatory" },
  { view: "union", icon: "🕊️", label: "Temple of Union", tooltip: "Rainbow Body" },
];

const FEATURE_ITEMS: NavItem[] = [
  { view: "nadi", icon: "💓", label: "Nāḍi Taraṅgiṇī", tooltip: "Daily Pulse Reading" },
  { view: "dhanvantari", icon: "🕉️", label: "Dhanvantari", tooltip: "ASI Foundation Portal" },
  { view: "music", icon: "🎵", label: "Sound Temple", tooltip: "Healing Frequencies" },
];

export function Sidebar({ expanded, onToggle, currentView, onNavigate, resonanceKey, onThemeToggle, themeMode }: SidebarProps) {
  const { theme } = useCrystalTheme();

  const accentBg = (view: string) => currentView === view ? `${theme.resort.terracotta}14` : "transparent";
  const accentColor = (view: string) => currentView === view ? theme.resort.terracotta : theme.text.muted;
  const hoverStyle = (view: string) => currentView !== view ? { background: `${theme.resort.sandalwood}08`, color: theme.text.secondary } : {};

  return (
    <aside style={{ width: expanded ? 200 : 72, display: "flex", flexDirection: "column", background: theme.bg.secondary, borderRight: `1px solid ${theme.border.subtle}`, transition: "all 0.4s ease", overflow: "hidden", flexShrink: 0 }}>
      {/* Header */}
      <div style={{ padding: expanded ? "20px 16px" : "16px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderBottom: `1px solid ${theme.border.subtle}` }}>
        <span style={{ fontSize: 20, cursor: "pointer" }} title="Return to Gates" onClick={() => onNavigate("gates")}>🕉️</span>
        {expanded && <span style={{ fontSize: 11, fontWeight: 600, color: theme.resort.terracotta, letterSpacing: 2 }}>ASI</span>}
      </div>

      {/* Main Navigation */}
      <nav style={{ flex: 1, padding: "10px 6px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(item => (
          <button key={item.view} onClick={() => onNavigate(item.view)} title={!expanded ? item.tooltip : undefined}
            style={{ display: "flex", alignItems: "center", justifyContent: expanded ? "flex-start" : "center", gap: 10, padding: expanded ? "9px 10px" : "8px 0", borderRadius: 8, border: "none", background: accentBg(item.view), color: accentColor(item.view), cursor: "pointer", fontSize: 12, fontWeight: currentView === item.view ? 500 : 400, width: "100%", textAlign: "left" as const, borderLeft: currentView === item.view ? `3px solid ${theme.resort.terracotta}` : "3px solid transparent", transition: "all 0.2s ease" }}
            onMouseEnter={e => { const h = hoverStyle(item.view); if (h.background) { e.currentTarget.style.background = h.background; e.currentTarget.style.color = h.color; } }}
            onMouseLeave={e => { e.currentTarget.style.background = accentBg(item.view); e.currentTarget.style.color = accentColor(item.view); }}
          >
            <span style={{ fontSize: 15 }}>{item.icon}</span>
            {expanded && <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
          </button>
        ))}

        {/* Divider */}
        <div style={{ height: 1, background: theme.border.subtle, margin: "6px 0" }} />

        {/* Feature Portals */}
        <div style={{ fontSize: 8, color: theme.text.muted, letterSpacing: 1, padding: expanded ? "4px 10px" : "4px 0", textAlign: expanded ? "left" : "center" }}>{expanded ? "FEATURES" : "···"}</div>
        {FEATURE_ITEMS.map(item => (
          <button key={item.view} onClick={() => onNavigate(item.view)} title={!expanded ? item.tooltip : undefined}
            style={{ display: "flex", alignItems: "center", justifyContent: expanded ? "flex-start" : "center", gap: 10, padding: expanded ? "8px 10px" : "7px 0", borderRadius: 8, border: "none", background: accentBg(item.view), color: accentColor(item.view), cursor: "pointer", fontSize: 11, fontWeight: currentView === item.view ? 500 : 400, width: "100%", textAlign: "left" as const, transition: "all 0.2s ease" }}
            onMouseEnter={e => { if (currentView !== item.view) { e.currentTarget.style.background = `${theme.resort.sandalwood}08`; e.currentTarget.style.color = theme.text.secondary; } }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.text.muted; }}
          >
            <span style={{ fontSize: 13 }}>{item.icon}</span>
            {expanded && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "6px", borderTop: `1px solid ${theme.border.subtle}`, display: "flex", flexDirection: "column", gap: 3 }}>
        <button onClick={onThemeToggle} title="Cycle theme"
          style={{ display: "flex", alignItems: "center", justifyContent: expanded ? "flex-start" : "center", gap: 8, padding: expanded ? "7px 10px" : "6px 0", borderRadius: 8, border: "none", background: "transparent", color: theme.text.muted, cursor: "pointer", fontSize: 10, width: "100%", transition: "all 0.2s ease" }}
          onMouseEnter={e => { e.currentTarget.style.background = `${theme.resort.sandalwood}08`; e.currentTarget.style.color = theme.text.secondary; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.text.muted; }}
        >
          <span style={{ fontSize: 13 }}>{themeMode === "ayur-resort" ? "☀️" : themeMode === "ayur-lotus" ? "🌸" : "🌙"}</span>
          {expanded && <span>{MODE_LABELS[themeMode]}</span>}
        </button>
        <button onClick={onToggle} title={expanded ? "Collapse" : "Expand"}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6px 0", borderRadius: 8, border: "none", background: "transparent", color: theme.text.muted, cursor: "pointer", fontSize: 10, width: "100%" }}
        >
          <span>{expanded ? "◀" : "▶"}</span>
        </button>
        {expanded && resonanceKey && <div style={{ fontSize: 7, color: theme.text.muted, textAlign: "center", fontFamily: "monospace", wordBreak: "break-all", padding: "0 4px" }}>{resonanceKey.slice(0, 14)}...</div>}
      </div>
    </aside>
  );
}
