import { C } from "../styles/theme";

export default function Modal({ title, children, onClose, width = 500 }) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,14,28,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div style={{
        background: C.surface, borderRadius: 20, padding: "28px 30px",
        width, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto",
        animation: "fadeIn 0.2s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontWeight: 900, fontSize: 18, color: C.text }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: C.muted, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
