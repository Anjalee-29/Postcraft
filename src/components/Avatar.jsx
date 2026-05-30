export default function Avatar({ name = "", size = 36, seed = 0 }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const hue      = (name.length * 37 + seed * 91) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, hsl(${hue},70%,45%), hsl(${(hue + 50) % 360},80%,55%))`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 800, fontSize: size * 0.36, flexShrink: 0,
      userSelect: "none",
    }}>{initials}</div>
  );
}
