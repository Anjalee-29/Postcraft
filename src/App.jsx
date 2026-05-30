import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PostsProvider } from "./context/PostsContext";
import { C, GLOBAL_CSS } from "./styles/theme";

import Sidebar from "./components/Sidebar";
import Spinner from "./components/Spinner";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostHistoryPage from "./pages/PostHistoryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

function AppShell() {
  const { user, loading } = useAuth();
  const [active, setActive] = useState("dashboard");

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.dark, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
      <div style={{ width: 50, height: 50, borderRadius: 13, background: `linear-gradient(135deg,${C.primary},${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 22, color: "#fff" }}>P</div>
      <Spinner size={24} />
      <style>{GLOBAL_CSS}</style>
    </div>
  );

  if (!user) return <LoginPage />;

  const PAGE = {
    dashboard: <DashboardPage setActive={setActive} />,
    create:    <CreatePostPage />,
    history:   <PostHistoryPage />,
    analytics: <AnalyticsPage />,
    settings:  <SettingsPage />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{GLOBAL_CSS}</style>
      <Sidebar active={active} setActive={setActive} />
      <main style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        {PAGE[active] || PAGE.dashboard}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <AppShell />
      </PostsProvider>
    </AuthProvider>
  );
}
