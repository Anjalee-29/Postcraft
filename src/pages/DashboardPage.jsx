import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { C, TYPE_META, PLATFORM_META } from "../styles/theme";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import Btn from "../components/Btn";

export default function DashboardPage({ setActive }) {
  const { user }                = useAuth();
  const { posts, postsLoading } = usePosts();

  const thisWeek = posts.filter(p => new Date(p.createdAt) > new Date(Date.now() - 7 * 864e5));
  const recent   = posts.slice(0, 6);

  return (
    <div style={{ padding: "32px 36px", maxWidth: 940 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: C.text, marginBottom: 5 }}>
          Good day, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ color: C.muted, fontSize: 14 }}>Here's your content overview.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
        <StatCard label="Total Posts"  value={posts.length}                                         sub="All time"    icon="📝" />
        <StatCard label="Published"    value={posts.filter(p => p.status === "published").length}   sub="Live content" icon="🚀" accentColor={C.success} />
        <StatCard label="Platforms"    value={3}                                                    sub="FB · IG · WA" icon="📱" accentColor={C.accent} />
        <StatCard label="This Week"    value={thisWeek.length}                                      sub="Recent posts" icon="📅" accentColor={C.warn} />
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Recent posts list */}
        <div style={{ flex: 2, minWidth: 300 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 14 }}>Recent Posts</h2>
          <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            {postsLoading ? (
              <div style={{ padding: 32, textAlign: "center", color: C.muted }}>Loading…</div>
            ) : recent.length === 0 ? (
              <div style={{ padding: 36, textAlign: "center", color: C.muted, fontSize: 14 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                <p style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>No posts yet</p>
                <button onClick={() => setActive("create")} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontWeight: 700, fontSize: 14 }}>
                  Create your first post →
                </button>
              </div>
            ) : recent.map((post, i) => {
              const tm = TYPE_META[post.postType] || { icon: "📝", label: post.postType };
              return (
                <div key={post.id} style={{
                  padding: "13px 18px",
                  borderBottom: i < recent.length - 1 ? `1px solid ${C.bg}` : "none",
                  display: "flex", alignItems: "center", gap: 13,
                }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {tm.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: C.text, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {post.prompt?.slice(0, 65)}{post.prompt?.length > 65 ? "…" : ""}
                    </p>
                    <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>
                      {tm.label} · {post.platforms?.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(", ")} · {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge label={post.status} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform breakdown + quick actions */}
        <div style={{ flex: 1, minWidth: 210 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 14 }}>Platforms</h2>
          {PLATFORM_META.map(p => {
            const count = posts.filter(x => x.platforms?.includes(p.id)).length;
            const pct   = posts.length ? (count / posts.length) * 100 : 0;
            return (
              <div key={p.id} style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: "12px 16px", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{p.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: C.text, flex: 1 }}>{p.label}</span>
                  <span style={{ fontWeight: 900, fontSize: 16, color: p.color }}>{count}</span>
                </div>
                <div style={{ height: 5, background: C.bg, borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: p.color, borderRadius: 3, transition: "width 0.5s" }} />
                </div>
              </div>
            );
          })}
          <Btn full onClick={() => setActive("create")} style={{ marginTop: 8 }}>✏️ New Post</Btn>
        </div>
      </div>
    </div>
  );
}
