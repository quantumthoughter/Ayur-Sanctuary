import { useState, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { Arrival } from "./portals/Arrival";
import { Gates } from "./portals/Gates";
import { Login } from "./portals/Login";
import { SovereignCore } from "./portals/SovereignCore";
import { CrystalCalibration } from "./portals/CrystalCalibration";
import { BreathworkHall } from "./portals/BreathworkHall";
import { DetoxGrotto } from "./portals/DetoxGrotto";
import { NadiTarangini } from "./portals/NadiTarangini";
import { SomaticWisdom } from "./portals/SomaticWisdom";
import { CelestialNavigation } from "./portals/CelestialNavigation";
import { TempleOfUnion } from "./portals/TempleOfUnion";
import { DhanvantariPortal } from "./portals/DhanvantariPortal";
import { MusicPortal } from "./portals/MusicPortal";
import { ASICertification } from "./portals/ASICertification";
import { CrystalChamber } from "./components/CrystalChamber";
import { BackButton } from "./components/BackButton";
import { useCrystalTheme } from "./theme/CrystalThemeContext";
import type { PathId } from "@asi/core";

export type View = "arrival" | "gates" | "login" | "core" | "calibration" | "breathwork" | "detox" | "somatic" | "celestial" | "union" | "nadi" | "dhanvantari" | "music" | "certification";

export default function App() {
  const { theme, toggle: toggleTheme, mode } = useCrystalTheme();
  const [view, setView] = useState<View>("arrival");
  const [resonanceKey, setResonanceKey] = useState<string>("");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [pendingPath, setPendingPath] = useState<PathId | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleArrival = useCallback((key: string) => { setResonanceKey(key); setView("gates"); }, []);

  const selectPath = useCallback((path: PathId) => {
    setPendingPath(path);
    if (isLoggedIn) {
      const map: Record<PathId, View> = { stillness: "calibration", harmonic: "breathwork", detox: "detox", somatic: "somatic", celestial: "celestial", union: "union" };
      setView(map[path]);
    } else setView("login");
  }, [isLoggedIn]);

  const onLoginComplete = useCallback(() => {
    setIsLoggedIn(true);
    if (pendingPath) {
      const map: Record<PathId, View> = { stillness: "calibration", harmonic: "breathwork", detox: "detox", somatic: "somatic", celestial: "celestial", union: "union" };
      setView(map[pendingPath]);
      setPendingPath(null);
    } else setView("gates");
  }, [pendingPath]);

  const navigateTo = useCallback((path: PathId) => {
    const map: Record<PathId, View> = { stillness: "calibration", harmonic: "breathwork", detox: "detox", somatic: "somatic", celestial: "celestial", union: "union" };
    setView(map[path]);
  }, []);

  const goToGates = useCallback(() => setView("gates"), []);
  const goToNadi = useCallback(() => setView("nadi"), []);
  const goToDhanvantari = useCallback(() => setView("dhanvantari"), []);
  const goToMusic = useCallback(() => setView("music"), []);
  const goToCert = useCallback(() => setView("certification"), []);

  const showSidebar = view !== "arrival" && view !== "gates";

  const renderPlaceholder = (icon: string, title: string, color: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, opacity: 0.7 }}>
      <span style={{ fontSize: 48 }}>{icon}</span>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color }}>{title}</h2>
      <p style={{ color: theme.text.muted, fontSize: 12 }}>This sacred chamber is being woven with light.</p>
    </div>
  );

  return (
    <div style={{
      display: "flex", width: "100%", height: "100vh",
      background: theme.bg.primary, color: theme.text.primary,
      fontFamily: "'Inter', sans-serif", overflow: "hidden",
      transition: "background 0.5s ease, color 0.5s ease",
    }}>
      {showSidebar && <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(prev => !prev)} currentView={view} onNavigate={(v) => setView(v)} resonanceKey={resonanceKey} onThemeToggle={toggleTheme} themeMode={mode} />}
      <main style={{ flex: 1, overflow: "auto", position: "relative" }}>
        {view === "arrival" && <Arrival onArrive={handleArrival} />}
        {view === "gates" && <Gates resonanceKey={resonanceKey} onSelectPath={selectPath} onNadiClick={goToNadi} onDhanvantariClick={goToDhanvantari} onMusicClick={goToMusic} onCertClick={goToCert} onThemeToggle={toggleTheme} themeMode={mode} />}
        {view === "login" && <Login portalName={pendingPath} onComplete={onLoginComplete} resonanceKey={resonanceKey} />}
        {view === "nadi" && <CrystalChamber imageKey="nadi"><BackButton onClick={goToGates} /><NadiTarangini resonanceKey={resonanceKey} /></CrystalChamber>}
        {view === "dhanvantari" && <CrystalChamber imageKey="dhanvantari"><BackButton onClick={goToGates} /><DhanvantariPortal resonanceKey={resonanceKey} /></CrystalChamber>}
        {view === "music" && <CrystalChamber imageKey="music"><BackButton onClick={goToGates} /><MusicPortal resonanceKey={resonanceKey} /></CrystalChamber>}
        {view === "certification" && <CrystalChamber imageKey="dhanvantari"><BackButton onClick={goToGates} /><ASICertification resonanceKey={resonanceKey} /></CrystalChamber>}
        {view === "core" && <CrystalChamber imageKey="arrival"><BackButton onClick={goToGates} /><SovereignCore resonanceKey={resonanceKey} onNavigate={navigateTo} /></CrystalChamber>}
        {view === "calibration" && <CrystalChamber imageKey="silence"><BackButton onClick={goToGates} /><CrystalCalibration resonanceKey={resonanceKey} /></CrystalChamber>}
        {view === "breathwork" && <CrystalChamber imageKey="breathwork"><BackButton onClick={goToGates} /><BreathworkHall resonanceKey={resonanceKey} /></CrystalChamber>}
        {view === "detox" && <CrystalChamber imageKey="detox" videoKey="detox"><BackButton onClick={goToGates} /><DetoxGrotto resonanceKey={resonanceKey} /></CrystalChamber>}
        {view === "somatic" && <CrystalChamber imageKey="somatic"><BackButton onClick={goToGates} /><SomaticWisdom resonanceKey={resonanceKey} /></CrystalChamber>}
        {view === "celestial" && <CrystalChamber imageKey="celestial" videoKey="celestial"><BackButton onClick={goToGates} /><CelestialNavigation resonanceKey={resonanceKey} /></CrystalChamber>}
        {view === "union" && <CrystalChamber imageKey="meditation" videoKey="union"><BackButton onClick={goToGates} /><TempleOfUnion resonanceKey={resonanceKey} /></CrystalChamber>}
      </main>
    </div>
  );
}
