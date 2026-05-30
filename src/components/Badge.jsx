export default function Badge({ label }) {
  const MAP = {
    published: { bg: "#ecfdf5", color: "#059669" },
    draft:     { bg: "#fef3c7", color: "#d97706" },
    archived:  { bg: "#f3f4f6", color: "#6b7280" },
    admin:     { bg: "#ede9fe", color: "#6d28d9" },
    member:    { bg: "#e0f2fe", color: "#0369a1" },
    active:    { bg: "#ecfdf5", color: "#059669" },
    inactive:  { bg: "#fee2e2", color: "#dc2626" },
  };
  const s = MAP[label?.toLowerCase()] || { bg: "#f3f4f6", color: "#555" };
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: s.bg, color: s.color, whiteSpace: "nowrap",
    }}>{label}</span>
  );
}
