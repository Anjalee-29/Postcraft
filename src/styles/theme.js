// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
export const C = {
  primary:      "#6d28d9",
  primaryLight: "#ede9fe",
  primaryDark:  "#4c1d95",
  accent:       "#db2777",
  surface:      "#ffffff",
  bg:           "#f5f4fb",
  text:         "#1a1a2e",
  muted:        "#8a8a9a",
  border:       "#e8e5f5",
  success:      "#059669",
  warn:         "#d97706",
  danger:       "#dc2626",
  dark:         "#0f0e1c",
  darkMid:      "#17162a",
};

export const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; font-family: 'Segoe UI', system-ui, sans-serif; }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes fadeIn  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:0.45; } }
  @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
`;

// ---------------------------------------------------------------------------
// Shared metadata used across pages
// ---------------------------------------------------------------------------
export const TYPE_META = {
  promo:  { icon: "📢", label: "Promotional"   },
  engage: { icon: "💬", label: "Engagement"    },
  info:   { icon: "💡", label: "Informational" },
  event:  { icon: "🗓️", label: "Event"         },
  story:  { icon: "✨", label: "Brand Story"   },
};

export const PLATFORM_META = [
  { id: "facebook",  label: "Facebook",  color: "#1877F2", bg: "#E7F0FD", icon: "📘" },
  { id: "instagram", label: "Instagram", color: "#E1306C", bg: "#FCE8F0", icon: "📸" },
  { id: "whatsapp",  label: "WhatsApp",  color: "#25D366", bg: "#E6F9EE", icon: "💬" },
];

export const POST_TYPES = [
  { id: "promo",  label: "Promotional",   icon: "📢", desc: "Offers, launches, discounts" },
  { id: "engage", label: "Engagement",    icon: "💬", desc: "Questions, polls, community" },
  { id: "info",   label: "Informational", icon: "💡", desc: "Tips, how-tos, education"    },
  { id: "event",  label: "Event",         icon: "🗓️", desc: "Announcements, live events"  },
  { id: "story",  label: "Brand Story",   icon: "✨", desc: "Culture, values, BTS"        },
];

export const TONES = ["Professional", "Casual", "Witty", "Inspiring", "Urgent", "Friendly"];
