import type { ReactNode } from "react";
import { PortalImageBg } from "./PortalImageBg";

interface CrystalChamberProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  imageKey?: string;
  videoKey?: string;
}

export function CrystalChamber({ children, title, subtitle, compact, imageKey, videoKey }: CrystalChamberProps) {
  return (
    <PortalImageBg imageKey={imageKey} videoKey={videoKey} overlayOpacity={0.25} brightness={0.5} contentMaxWidth={compact ? undefined : 700}>
      {(title || subtitle) && (
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          {title && <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 400, color: "#fff7d6", letterSpacing: 1, marginBottom: subtitle ? 6 : 0 }}>{title}</h1>}
          {subtitle && <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: "#fde68a", lineHeight: 1.6 }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </PortalImageBg>
  );
}
