interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 16px",
        borderRadius: 20,
        border: "1px solid rgba(251, 146, 60, 0.2)",
        background: "rgba(26, 8, 2, 0.5)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: "#fde68a",
        fontSize: 11,
        cursor: "pointer",
        fontFamily: "inherit",
        letterSpacing: 1,
        transition: "all 0.3s ease",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#fb923c"; e.currentTarget.style.background = "rgba(251, 146, 60, 0.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(251, 146, 60, 0.2)"; e.currentTarget.style.background = "rgba(26, 8, 2, 0.5)"; }}
    >
      ← BACK
    </button>
  );
}
