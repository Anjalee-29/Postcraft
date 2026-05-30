import { C } from "../styles/theme";

export default function StatCard({ label, value, sub, icon, accentColor = C.primary }) {
  return (
    <div style={{
      background: C.surface, borderRadius: 14, padding: "18px 20px",
      border: `1px solid ${C.border}`, flex: 1, minWidth: 130,
      animation: "fadeIn 0.4s ease both",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>
      <p style={{ fontSize: 28, fontWeight: 900, color: C.text, margin: "0 0 4px" }}>{value}</p>
      <p style={{ fontSize: 12, color: accentColor, fontWeight: 700, margin: 0 }}>{sub}</p>
    </div>
  );
}
