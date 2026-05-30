import { useAuth } from "../context/AuthContext";
import { C } from "../styles/theme";
import Avatar from "./Avatar";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",    icon: "🏠" },
  { id: "create",    label: "Create Post",  icon: "✏️",  badge: "AI" },
  { id: "history",   label: "Post History", icon: "📋" },
  { id: "analytics", label: "Analytics",    icon: "📊" },
  { id: "settings",  label: "Settings",     icon: "⚙️" },
];

export default function Sidebar({ active, setActive }) {
  const { user, logout } = useAuth();
  return (
    <aside style={{
      width: 228, minHeight: "100vh", background: C.dark,
      display: "flex", flexDirection: "column",
      borderRight: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: `linear-gradient(135deg,${C.primary},${C.accent})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 16, color: "#fff",
          }}>P</div>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 17, letterSpacing: "-0.5px" }}>PostCraft</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "14px 10px" }}>
        {NAV_ITEMS.map(item => {
          const on = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 13px", borderRadius: 9, border: "none", cursor: "pointer",
              background: on ? "rgba(109,40,217,0.28)" : "transparent",
              color: on ? "#c4b5fd" : "rgba(255,255,255,0.48)",
              fontWeight: on ? 700 : 400, fontSize: 14,
              textAlign: "left", marginBottom: 2, transition: "all 0.13s",
            }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  background: C.primary, color: "#fff",
                  borderRadius: 7, fontSize: 9, padding: "2px 7px", fontWeight: 900,
                }}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Avatar name={user?.name || ""} size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: 0, textTransform: "capitalize" }}>{user?.role}</p>
          </div>
        </div>
        <button onClick={logout} style={{
          width: "100%", background: "rgba(255,255,255,0.06)", border: "none",
          borderRadius: 8, padding: "8px", color: "rgba(255,255,255,0.4)",
          cursor: "pointer", fontSize: 13, fontWeight: 600,
        }}>
          🚪 Sign out
        </button>
      </div>
    </aside>
  );
}
