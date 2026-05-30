import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { C, PLATFORM_META, POST_TYPES, TONES } from "../styles/theme";
import Btn from "../components/Btn";
import Spinner from "../components/Spinner";
import Badge from "../components/Badge";

// ---------------------------------------------------------------------------
// Share helpers — one per platform
// ---------------------------------------------------------------------------
const shareToPlatform = {
  facebook: (caption) => {
    // Facebook sharer pre-fills the quote/message field
    const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(caption)}&u=https://postcraft.io`;
    window.open(url, "_blank", "width=600,height=500,noopener,noreferrer");
  },

  instagram: (caption) => {
    // Instagram has no web share URL — best UX: copy caption then open Instagram
    navigator.clipboard.writeText(caption).catch(() => {});
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  },

  whatsapp: (caption) => {
    // WhatsApp supports direct text pre-fill via wa.me
    const url = `https://wa.me/?text=${encodeURIComponent(caption)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  },
};

// Share button labels & tooltips per platform
const SHARE_META = {
  facebook:  { label: "Share on Facebook",  icon: "📘", tip: "Opens Facebook with caption pre-filled" },
  instagram: { label: "Open Instagram",     icon: "📸", tip: "Caption copied — paste it in Instagram" },
  whatsapp:  { label: "Send on WhatsApp",   icon: "💬", tip: "Opens WhatsApp with caption pre-filled" },
};

function PlatformResultCard({ platform, caption, imagePrompt, loading, onSave }) {
  const [copied,   setCopied]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [shared,   setShared]   = useState(false);
  const [showTip,  setShowTip]  = useState(false);

  const copy = () => {
    const text = `${imagePrompt ? `🖼️ IMAGE PROMPT:\n${imagePrompt}\n\n` : ""}📝 CAPTION:\n${caption}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2200);
  };

  const handleSave = async () => {
    await onSave();
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const handleShare = () => {
    shareToPlatform[platform.id]?.(caption);
    setShared(true); setTimeout(() => setShared(false), 3000);
  };

  const sm = SHARE_META[platform.id];

  return (
    <div style={{
      background: C.surface, borderRadius: 16,
      border: `2px solid ${platform.bg}`, overflow: "hidden",
      animation: "fadeIn 0.3s ease",
    }}>
      {/* Card header */}
      <div style={{ background: platform.bg, padding: "11px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: platform.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
          {platform.icon}
        </div>
        <span style={{ fontWeight: 800, fontSize: 14, color: C.text }}>{platform.label}</span>
        {caption && (
          <span style={{ marginLeft: "auto", fontSize: 11, color: C.muted, fontWeight: 600 }}>
            {caption.length} chars
          </span>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: 16 }}>
        {loading ? (
          <div>
            {[100, 82, 66].map((w, i) => (
              <div key={i} style={{
                height: 11, borderRadius: 5, marginBottom: 9, width: `${w}%`,
                background: "linear-gradient(90deg,#f0eeff 25%,#e4e0fa 50%,#f0eeff 75%)",
                backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
              }} />
            ))}
          </div>
        ) : caption ? (
          <>
            {imagePrompt && (
              <div style={{ background: C.bg, borderRadius: 9, padding: "10px 12px", marginBottom: 12, border: `1px dashed ${C.border}` }}>
                <p style={{ fontSize: 10, color: C.muted, margin: "0 0 4px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>🖼️ Image Prompt</p>
                <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.55 }}>{imagePrompt}</p>
              </div>
            )}

            <p style={{ fontSize: 14, color: C.text, lineHeight: 1.75, margin: "0 0 14px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {caption}
            </p>

            {/* ── Action buttons row ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

              {/* Row 1: Copy + Save */}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn small variant="secondary" onClick={copy} style={{ flex: 1 }}>
                  {copied ? "✓ Copied!" : "📋 Copy All"}
                </Btn>
                <Btn small onClick={handleSave} style={{ flex: 1, background: platform.color }}>
                  {saved ? "✓ Saved!" : "💾 Save Post"}
                </Btn>
              </div>

              {/* Row 2: Share button — full width, platform-coloured */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={handleShare}
                  onMouseEnter={() => setShowTip(true)}
                  onMouseLeave={() => setShowTip(false)}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 13,
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: shared
                      ? C.success
                      : platform.color,
                    color: "#fff",
                    transition: "background 0.2s, opacity 0.15s",
                    boxShadow: `0 2px 8px ${platform.color}44`,
                  }}
                  onMouseEnterCapture={e => { e.currentTarget.style.opacity = "0.88"; }}
                  onMouseLeaveCapture={e => { e.currentTarget.style.opacity = "1"; }}
                >
                  <span style={{ fontSize: 15 }}>{shared ? "✓" : sm.icon}</span>
                  {shared
                    ? platform.id === "instagram"
                      ? "Caption copied — paste in Instagram!"
                      : `Opened ${platform.label}!`
                    : sm.label}
                  {!shared && <span style={{ marginLeft: "auto", fontSize: 11, opacity: 0.75 }}>↗</span>}
                </button>

                {/* Tooltip */}
                {showTip && !shared && (
                  <div style={{
                    position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
                    transform: "translateX(-50%)",
                    background: "#1a1a2e", color: "#fff",
                    fontSize: 11, fontWeight: 600, padding: "6px 12px",
                    borderRadius: 8, whiteSpace: "nowrap",
                    pointerEvents: "none", zIndex: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                  }}>
                    {sm.tip}
                    <div style={{
                      position: "absolute", top: "100%", left: "50%",
                      transform: "translateX(-50%)",
                      borderWidth: "5px 5px 0", borderStyle: "solid",
                      borderColor: "#1a1a2e transparent transparent",
                    }} />
                  </div>
                )}
              </div>

              {/* Instagram-specific notice */}
              {platform.id === "instagram" && (
                <p style={{ fontSize: 11, color: C.muted, textAlign: "center", margin: 0, lineHeight: 1.5 }}>
                  ℹ️ Instagram doesn't allow direct web sharing — caption is auto-copied to clipboard.
                </p>
              )}
            </div>
          </>
        ) : (
          <p style={{ color: "#ccc", fontSize: 13, textAlign: "center", padding: "20px 0", fontStyle: "italic" }}>
            Generate content to preview
          </p>
        )}
      </div>
    </div>
  );
}

export default function CreatePostPage() {
  const { user }     = useAuth();
  const { savePost } = usePosts();

  const [postType,     setPostType]     = useState(null);
  const [selPlatforms, setSelPlatforms] = useState(["facebook", "instagram", "whatsapp"]);
  const [tone,         setTone]         = useState("Friendly");
  const [prompt,       setPrompt]       = useState("");
  const [results,      setResults]      = useState({});
  const [loading,      setLoading]      = useState(false);
  const [genError,     setGenError]     = useState("");

  const togglePlatform = id =>
    setSelPlatforms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const generate = async () => {
    if (!prompt.trim() || !postType || selPlatforms.length === 0) return;
    setLoading(true); setResults({}); setGenError("");

    const systemPrompt = `You are an expert social media copywriter.
Respond ONLY with a valid JSON object — no markdown fences, no extra text.
Shape:
{
  "facebook":  { "caption": "...", "imagePrompt": "..." },
  "instagram": { "caption": "...", "imagePrompt": "..." },
  "whatsapp":  { "caption": "...", "imagePrompt": "..." }
}
Platform rules:
- Facebook:  engaging, 80–500 chars, optional hashtags
- Instagram: visual, 80–220 chars, 5–10 hashtags at the end
- WhatsApp:  conversational & warm, 60–300 chars, no hashtags
imagePrompt: one vivid sentence for an AI image generator.
Tone: ${tone}.
Post type: ${postType}.
Only include these platforms: ${selPlatforms.join(", ")}.`;

    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: `Create a ${tone} ${postType} post about: ${prompt}` }],
        }),
      });
      const data = await res.json();
      const raw  = (data.content || []).map(b => b.text || "").join("");
      setResults(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch (e) {
      setGenError("Generation failed — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveForPlatform = (platformId) => {
    if (!results[platformId]) return;
    return savePost({ userId: user.id, userName: user.name, prompt, postType, tone, platforms: selPlatforms, results });
  };

  const canGenerate = prompt.trim() && postType && selPlatforms.length > 0 && !loading;

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1040 }}>
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: C.text, marginBottom: 5 }}>Create Post ✏️</h1>
        <p style={{ color: C.muted, fontSize: 14 }}>AI-powered captions + image prompts, ready to publish</p>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>

        {/* ── Left config panel ── */}
        <div style={{ width: 240, flexShrink: 0, display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Post type */}
          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "18px 16px" }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Post Type</p>
            {POST_TYPES.map(pt => (
              <button key={pt.id} onClick={() => setPostType(pt.id)} style={{
                width: "100%", padding: "9px 12px", borderRadius: 9, cursor: "pointer",
                textAlign: "left", marginBottom: 7, display: "flex", alignItems: "center", gap: 11,
                border: postType === pt.id ? `2px solid ${C.primary}` : `1px solid ${C.border}`,
                background: postType === pt.id ? C.primaryLight : "#fff",
              }}>
                <span style={{ fontSize: 19 }}>{pt.icon}</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 12, color: postType === pt.id ? C.primary : C.text, margin: "0 0 1px" }}>{pt.label}</p>
                  <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>{pt.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Platforms */}
          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "18px 16px" }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Platforms</p>
            {PLATFORM_META.map(p => (
              <button key={p.id} onClick={() => togglePlatform(p.id)} style={{
                width: "100%", padding: "9px 12px", borderRadius: 9, cursor: "pointer",
                textAlign: "left", marginBottom: 7, display: "flex", alignItems: "center", gap: 11,
                border: selPlatforms.includes(p.id) ? `2px solid ${p.color}` : `1px solid ${C.border}`,
                background: selPlatforms.includes(p.id) ? p.bg : "#fff",
              }}>
                <span style={{ fontSize: 19 }}>{p.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: C.text, flex: 1 }}>{p.label}</span>
                {selPlatforms.includes(p.id) && <span style={{ color: p.color, fontWeight: 900 }}>✓</span>}
              </button>
            ))}
          </div>

          {/* Tone */}
          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "18px 16px" }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Tone</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {TONES.map(t => (
                <button key={t} onClick={() => setTone(t)} style={{
                  padding: "5px 12px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 700,
                  border: tone === t ? `2px solid ${C.primary}` : `1px solid ${C.border}`,
                  background: tone === t ? C.primaryLight : "#fff",
                  color: tone === t ? C.primary : C.muted,
                }}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: prompt + results ── */}
        <div style={{ flex: 1, minWidth: 340 }}>

          {/* Prompt box */}
          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "20px 22px", marginBottom: 18 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
              What's your post about?
            </p>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Launching a 30% off summer sale on all skincare products — capture excitement and urgency…"
              rows={5}
              style={{
                width: "100%", borderRadius: 10, border: `1.5px solid ${C.border}`,
                padding: "12px 14px", fontSize: 14, lineHeight: 1.65, color: C.text,
                resize: "vertical", outline: "none", fontFamily: "inherit",
              }}
              onFocus={e => { e.target.style.borderColor = C.primary; }}
              onBlur={e  => { e.target.style.borderColor = C.border; }}
            />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12, marginBottom: 14 }}>
              {postType && <Badge label={POST_TYPES.find(p => p.id === postType)?.label} />}
              <Badge label={tone} />
              {selPlatforms.map(p => <Badge key={p} label={p.charAt(0).toUpperCase() + p.slice(1)} />)}
            </div>
            <Btn onClick={generate} disabled={!canGenerate} style={{ float: "right" }}>
              {loading ? <><Spinner />&nbsp;Generating…</> : "✨ Generate Content"}
            </Btn>
            <div style={{ clear: "both" }} />
          </div>

          {genError && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 16px", color: C.danger, fontWeight: 700, fontSize: 13, marginBottom: 16 }}>
              ⚠ {genError}
            </div>
          )}

          {(loading || Object.keys(results).length > 0) && !results.error && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {PLATFORM_META.filter(p => selPlatforms.includes(p.id)).map(platform => (
                <PlatformResultCard
                  key={platform.id}
                  platform={platform}
                  caption={results[platform.id]?.caption}
                  imagePrompt={results[platform.id]?.imagePrompt}
                  loading={loading && !results[platform.id]}
                  onSave={() => handleSaveForPlatform(platform.id)}
                />
              ))}
            </div>
          )}

          {!loading && Object.keys(results).length === 0 && (
            <div style={{ background: C.bg, borderRadius: 16, padding: "44px 30px", textAlign: "center", border: `1.5px dashed ${C.border}` }}>
              <div style={{ fontSize: 50, marginBottom: 14 }}>🪄</div>
              <h3 style={{ fontWeight: 800, color: C.text, marginBottom: 8 }}>Ready when you are</h3>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                Select a post type, pick platforms,<br />write your prompt, hit Generate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
