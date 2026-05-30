import { useState } from "react";
import { usePosts } from "../context/PostsContext";
import { C, TYPE_META, PLATFORM_META } from "../styles/theme";
import Badge from "../components/Badge";
import Btn from "../components/Btn";
import Modal from "../components/Modal";

// ---------------------------------------------------------------------------
// Share helpers — mirrors CreatePostPage
// ---------------------------------------------------------------------------
const shareToPlatform = {
  facebook:  (caption) => window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(caption)}&u=https://postcraft.io`, "_blank", "width=600,height=500,noopener,noreferrer"),
  instagram: (caption) => { navigator.clipboard.writeText(caption).catch(() => {}); window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer"); },
  whatsapp:  (caption) => window.open(`https://wa.me/?text=${encodeURIComponent(caption)}`, "_blank", "noopener,noreferrer"),
};

const SHARE_LABEL = {
  facebook:  { label: "Share on Facebook",  icon: "📘" },
  instagram: { label: "Open Instagram",     icon: "📸" },
  whatsapp:  { label: "Send on WhatsApp",   icon: "💬" },
};

export default function PostHistoryPage() {
  const { posts, postsLoading, removePost, changeStatus } = usePosts();
  const [filter,     setFilter]     = useState("all");
  const [search,     setSearch]     = useState("");
  const [detail,     setDetail]     = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [sharedId,   setSharedId]   = useState(null); // tracks "platformId" just shared

  const filtered = posts.filter(p => {
    if (filter !== "all" && p.status !== filter) return false;
    if (search && !p.prompt?.toLowerCase().includes(search.toLowerCase()) &&
        !p.tone?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const doDelete = async (id) => {
    await removePost(id);
    setConfirmDel(null);
  };

  const handleShare = (platformId, caption) => {
    shareToPlatform[platformId]?.(caption);
    setSharedId(platformId);
    setTimeout(() => setSharedId(null), 3000);
  };

  const FILTERS = ["all", "published", "draft", "archived"];

  return (
    <div style={{ padding: "32px 36px", maxWidth: 940 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: C.text, marginBottom: 5 }}>Post History 📋</h1>
        <p style={{ color: C.muted, fontSize: 14 }}>{posts.length} post{posts.length !== 1 ? "s" : ""} saved</p>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: C.muted }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search prompts…"
            style={{ padding: "9px 14px 9px 36px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", width: 230, fontFamily: "inherit", color: C.text }}
            onFocus={e => { e.target.style.borderColor = C.primary; }}
            onBlur={e  => { e.target.style.borderColor = C.border; }}
          />
        </div>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "8px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 700,
            border: filter === f ? `2px solid ${C.primary}` : `1px solid ${C.border}`,
            background: filter === f ? C.primaryLight : "#fff",
            color: filter === f ? C.primary : C.muted,
            textTransform: "capitalize",
          }}>
            {f === "all" ? `All (${posts.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${posts.filter(p => p.status === f).length})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        {postsLoading ? (
          <div style={{ padding: 40, textAlign: "center", color: C.muted }}>Loading posts…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 50, textAlign: "center", color: C.muted }}>
            <div style={{ fontSize: 38, marginBottom: 10 }}>📭</div>
            <p style={{ fontWeight: 700, color: C.text, marginBottom: 5 }}>No posts found</p>
            <p style={{ fontSize: 13 }}>Try adjusting your filter or search term.</p>
          </div>
        ) : filtered.map((post, i) => {
          const tm = TYPE_META[post.postType] || { icon: "📝" };
          return (
            <div key={post.id} style={{
              padding: "14px 20px",
              borderBottom: i < filtered.length - 1 ? `1px solid ${C.bg}` : "none",
              display: "flex", alignItems: "center", gap: 13,
              transition: "background 0.12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.bg; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                {tm.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: C.text, margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {post.prompt?.slice(0, 80)}{post.prompt?.length > 80 ? "…" : ""}
                </p>
                <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>
                  {post.tone} · {post.platforms?.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(", ")} · by {post.userName} · {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge label={post.status} />
              <div style={{ display: "flex", gap: 7, flexShrink: 0, alignItems: "center" }}>
                <Btn small variant="flat" onClick={() => setDetail(post)}>View</Btn>
                <select
                  value={post.status}
                  onChange={e => changeStatus(post.id, e.target.value)}
                  style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: "inherit", cursor: "pointer", color: C.text, background: "#fff" }}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                <Btn small variant="danger" onClick={() => setConfirmDel(post.id)}>🗑</Btn>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {detail && (
        <Modal title="Post Details" onClose={() => { setDetail(null); setSharedId(null); }} width={640}>
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Prompt</p>
            <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7 }}>{detail.prompt}</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <Badge label={TYPE_META[detail.postType]?.label || detail.postType} />
            <Badge label={detail.tone} />
            <Badge label={detail.status} />
            <span style={{ fontSize: 12, color: C.muted, alignSelf: "center" }}>
              {new Date(detail.createdAt).toLocaleString()}
            </span>
          </div>

          {PLATFORM_META.filter(p => detail.platforms?.includes(p.id)).map(pl => {
            const data = detail.results?.[pl.id];
            if (!data?.caption) return null;
            const sm       = SHARE_LABEL[pl.id];
            const isShared = sharedId === pl.id;
            return (
              <div key={pl.id} style={{ background: pl.bg, borderRadius: 12, padding: "14px 16px", marginBottom: 12, border: `1px solid ${pl.color}22` }}>
                {/* Platform header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <p style={{ fontWeight: 800, fontSize: 13, color: C.text, margin: 0 }}>{pl.icon} {pl.label}</p>
                  {/* Share button */}
                  <button
                    onClick={() => handleShare(pl.id, data.caption)}
                    style={{
                      padding: "6px 14px", borderRadius: 8, border: "none",
                      cursor: "pointer", fontWeight: 700, fontSize: 12,
                      fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
                      background: isShared ? C.success : pl.color,
                      color: "#fff", transition: "background 0.2s",
                      boxShadow: `0 2px 6px ${pl.color}44`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                  >
                    <span>{isShared ? "✓" : sm.icon}</span>
                    {isShared
                      ? pl.id === "instagram" ? "Caption copied!" : "Opened!"
                      : sm.label}
                    {!isShared && <span style={{ opacity: 0.7, fontSize: 10 }}>↗</span>}
                  </button>
                </div>

                {data.imagePrompt && <p style={{ fontSize: 12, color: "#555", marginBottom: 8, fontStyle: "italic", lineHeight: 1.5 }}>🖼️ {data.imagePrompt}</p>}
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{data.caption}</p>

                {pl.id === "instagram" && isShared && (
                  <p style={{ fontSize: 11, color: C.success, marginTop: 8, fontWeight: 600 }}>
                    ✓ Caption copied to clipboard — paste it in Instagram!
                  </p>
                )}
              </div>
            );
          })}
        </Modal>
      )}

      {/* Delete confirm modal */}
      {confirmDel && (
        <Modal title="Delete Post?" onClose={() => setConfirmDel(null)} width={400}>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            This action cannot be undone. The post and all its generated content will be permanently removed.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setConfirmDel(null)}>Cancel</Btn>
            <Btn variant="danger"    onClick={() => doDelete(confirmDel)}>Delete Permanently</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
