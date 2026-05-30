import { C } from "../styles/theme";

export default function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 700, color: C.text, display: "block", marginBottom: 6 }}>{label}</label>
      )}
      <input
        {...props}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 14,
          border: `1.5px solid ${error ? C.danger : C.border}`,
          outline: "none", color: C.text, background: "#fff",
          fontFamily: "inherit", transition: "border-color 0.15s",
          ...props.style,
        }}
        onFocus={e => { e.target.style.borderColor = C.primary; }}
        onBlur={e  => { e.target.style.borderColor = error ? C.danger : C.border; }}
      />
      {error && <p style={{ color: C.danger, fontSize: 12, marginTop: 4, fontWeight: 600 }}>{error}</p>}
    </div>
  );
}
