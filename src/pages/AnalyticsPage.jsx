import { usePosts } from "../context/PostsContext";
import { C, TYPE_META, PLATFORM_META, POST_TYPES, TONES } from "../styles/theme";
import StatCard from "../components/StatCard";

function BarChart({ data, colorFn, maxVal, height = 90 }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: height + 28 }}>
      {data.map((d, i) => {
        const barH = Math.max((d.count / maxVal) * height, d.count > 0 ? 8 : 2);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 0 }}>
            {d.count > 0 && <span style={{ fontSize: 9, fontWeight: 700, color: C.primary }}>{d.count}</span>}
            <div style={{
              width: "100%", borderRadius: "4px 4px 0 0",
              background: d.count > 0 ? (colorFn ? colorFn(i, d) : `linear-gradient(180deg,${C.primary},${C.accent})`) : C.bg,
              height: `${barH}px`, transition: "height 0.4s",
            }} />
            <span style={{ fontSize: 9, color: C.muted, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%", textAlign: "center" }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function HBar({ label, count, total, color }) {
  const pct = total ? (count / total) * 100 : 0;
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 900, color: color || C.primary }}>{count}</span>
      </div>
      <div style={{ height: 6, background: C.bg, borderRadius: 3 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color || `linear-gradient(90deg,${C.primary},${C.accent})`, borderRadius: 3, transition: "width 0.5s" }} />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { posts } = usePosts();

  const byType = POST_TYPES.map(t => ({
    ...t, count: posts.filter(p => p.postType === t.id).length
  }));

  const byPlatform = PLATFORM_META.map(p => ({
    ...p, count: posts.filter(x => x.platforms?.includes(p.id)).length
  }));

  const byTone = TONES.map(t => ({
    tone: t, count: posts.filter(p => p.tone === t).length
  })).filter(t => t.count > 0);

  const byStatus = ["published", "draft", "archived"].map(s => ({
    status: s, count: posts.filter(p => p.status === s).length
  }));

  const dailyData = (() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d     = new Date(Date.now() - i * 864e5);
      const key   = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      const count = posts.filter(p => {
        const pd = new Date(p.createdAt);
        return pd.toDateString() === d.toDateString();
      }).length;
      days.push({ label: key, count });
    }
    return days;
  })();

  const maxDaily = Math.max(...dailyData.map(d => d.count), 1);

  return (
    <div style={{ padding: "32px 36px", maxWidth: 940 }}>
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: C.text, marginBottom: 5 }}>Analytics 📊</h1>
        <p style={{ color: C.muted, fontSize: 14 }}>{posts.length} total posts analysed</p>
      </div>

      {posts.length === 0 ? (
        <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "60px 30px", textAlign: "center", color: C.muted }}>
          <div style={{ fontSize: 46, marginBottom: 14 }}>📊</div>
          <p style={{ fontWeight: 700, color: C.text, marginBottom: 6, fontSize: 16 }}>No data yet</p>
          <p style={{ fontSize: 14 }}>Create some posts to see your analytics.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 14, marginBottom: 22, flexWrap: "wrap" }}>
            <StatCard label="Published" value={byStatus.find(s => s.status === "published")?.count || 0} sub="Live"    icon="🚀" accentColor={C.success} />
            <StatCard label="Drafts"    value={byStatus.find(s => s.status === "draft")?.count     || 0} sub="Saved"   icon="📝" accentColor={C.warn} />
            <StatCard label="Archived"  value={byStatus.find(s => s.status === "archived")?.count  || 0} sub="Stored"  icon="📦" accentColor={C.muted} />
            <StatCard label="Avg / Day" value={(posts.length / 14).toFixed(1)}                           sub="Last 14d" icon="📅" />
          </div>

          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "22px 24px", marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 18 }}>Daily Posts — Last 14 Days</h2>
            <BarChart data={dailyData} maxVal={maxDaily} height={100} />
          </div>

          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 16 }}>By Post Type</h2>
              {byType.map(t => <HBar key={t.id} label={`${t.icon} ${t.label}`} count={t.count} total={posts.length} />)}
            </div>

            <div style={{ flex: 1, minWidth: 220, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 16 }}>By Platform</h2>
              {byPlatform.map(p => <HBar key={p.id} label={`${p.icon} ${p.label}`} count={p.count} total={posts.length} color={p.color} />)}
            </div>

            <div style={{ flex: 1, minWidth: 220, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 16 }}>By Tone</h2>
              {byTone.length === 0
                ? <p style={{ color: C.muted, fontSize: 13 }}>No data yet.</p>
                : byTone.map(t => <HBar key={t.tone} label={t.tone} count={t.count} total={posts.length} color={C.accent} />)
              }
            </div>
          </div>
        </>
      )}
    </div>
  );
}
