import type { ReactNode, CSSProperties } from "react";
import { MicroParticles } from "./MicroParticles";

const PORTAL_BG_IMAGES: Record<string, string> = {
  arrival: "/images/ASI_frontpage.png",
  calibration: "/images/crystal_chamber.png",
  breathwork: "/images/Breathwork_hall.png",
  detox: "/images/Detox_grotto.png",
  somatic: "/images/somatic_wisdom_portal.png",
  celestial: "/images/celestial_navigation_portal.png",
  union: "/images/Temple_of_union.png",
  nadi: "/images/Nadi_Tarangini.png",
  dhanvantari: "/images/tat_tvam_asi_en.png",
  music: "/images/Sound_temple.png",
  amma: "/images/Amma_blessings.png",
  meditation: "/images/meditation.png",
  silence: "/images/silence_protocol.png",
  clinic: "/images/ayur_clinic.png",
  pyramid: "/images/mexican_pyramid.png",
};

const PORTAL_BG_VIDEOS: Record<string, string> = {
  union: "/videos/Meditation_crispr.mp4",
  detox: "/videos/Shirodhara_crispr.mp4",
  welcome: "/videos/a_great_amazing_welcome_video.mp4",
  celestial: "/videos/Himalaya_egy_sh.mp4",
};

interface PortalImageBgProps {
  imageKey?: string;
  videoKey?: string;
  children: ReactNode;
  overlayOpacity?: number;
  brightness?: number;
  contentMaxWidth?: number;
  style?: CSSProperties;
}

export function PortalImageBg({
  imageKey, videoKey, children,
  overlayOpacity = 0.25,
  brightness = 0.5,
  contentMaxWidth = 700,
  style,
}: PortalImageBgProps) {
  const imagePath = imageKey ? PORTAL_BG_IMAGES[imageKey] : undefined;
  const videoPath = videoKey ? PORTAL_BG_VIDEOS[videoKey] : undefined;

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      background: "#1a0802",
      ...style,
    }}>
      <MicroParticles color="rgba(251, 146, 60, 0.2)" count={30} speed={0.1} opacity={0.2} />

      {/* Warm golden hour background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "linear-gradient(170deg, #1a0802 0%, #2d1004 30%, #3a1a06 60%, #1a0802 100%)",
      }} />

      {/* Video background */}
      {videoPath && (
        <video
          autoPlay muted loop playsInline
          style={{
            position: "fixed", inset: 0, zIndex: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            filter: `brightness(${brightness * 0.7}) saturate(0.8)`,
          }}
        >
          <source src={videoPath} type="video/mp4" />
        </video>
      )}

      {/* Image background (fallback or additional) */}
      {imagePath && !videoPath && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 0,
          backgroundImage: `url(${imagePath})`,
          backgroundSize: "cover", backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: `brightness(${brightness}) saturate(1.0)`,
        }} />
      )}

      {/* Warm amber overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        background: `linear-gradient(180deg, rgba(26,8,2,${overlayOpacity}) 0%, rgba(26,8,2,${Math.min(overlayOpacity + 0.1, 0.5)}) 100%)`,
      }} />

      <div style={{
        position: "relative", zIndex: 2,
        padding: 24, maxWidth: contentMaxWidth, margin: "0 auto",
        minHeight: "100%", display: "flex", flexDirection: "column",
      }}>
        {children}
      </div>

      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 1, zIndex: 3,
        background: "linear-gradient(90deg, transparent, rgba(251, 146, 60, 0.2), transparent)",
      }} />
    </div>
  );
}
