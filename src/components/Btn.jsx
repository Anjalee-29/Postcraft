import { C } from "../styles/theme";

export default function Btn({ children, variant = "primary", onClick, disabled, small, full, style: extra = {} }) {
  const base = {
    border: "none", borderRadius: 10, cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 700, fontFamily: "inherit", transition: "opacity 0.15s, transform 0.1s",
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
    fontSize: small ? 13 : 14, padding: small ? "8px 16px" : "11px 22px",
    width: full ? "100%" : "auto",
  };
  const variants = {
    primary:   { background: `linear-gradient(135deg,${C.primary},${C.accent})`, color: "#fff", opacity: disabled ? 0.5 : 1 },
    secondary: { background: C.surface, color: C.text, border: `1.5px solid ${C.border}` },
    danger:    { background: "#fee2e2", color: C.danger },
    ghost:     { background: "transparent", color: C.muted },
    flat:      { background: C.primaryLight, color: C.primary },
  };
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      style={{ ...base, ...variants[variant], ...extra }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.88"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
    >{children}</button>
  );
}
