import { C } from "../styles/theme";

export default function Toast({ msg }) {
  if (!msg.text) return null;
  const ok = msg.type === "success";
  return (
    <div style={{
      background: ok ? "#ecfdf5" : "#fef2f2",
      border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}`,
      borderRadius: 10, padding: "11px 16px",
      color: ok ? C.success : C.danger,
      fontWeight: 700, fontSize: 13, marginBottom: 18,
      animation: "fadeIn 0.2s ease",
    }}>
      {ok ? "✓ " : "⚠ "}{msg.text}
    </div>
  );
}
