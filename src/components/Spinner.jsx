import { C } from "../styles/theme";

export default function Spinner({ size = 18, color = C.primary }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      border: `2px solid ${C.primaryLight}`, borderTopColor: color,
      animation: "spin 0.7s linear infinite", flexShrink: 0,
    }} />
  );
}
