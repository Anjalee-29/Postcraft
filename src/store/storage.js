// ---------------------------------------------------------------------------
// Storage — thin wrapper around window.storage (Claude artifact API)
// ---------------------------------------------------------------------------
const Storage = {
  async get(key) {
    try {
      const r = await window.storage.get(key);
      return r ? JSON.parse(r.value) : null;
    } catch { return null; }
  },
  async set(key, value) {
    try { await window.storage.set(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  async del(key) {
    try { await window.storage.delete(key); return true; }
    catch { return false; }
  },
  async list(prefix) {
    try { const r = await window.storage.list(prefix); return r?.keys || []; }
    catch { return []; }
  },
};

export function uid()       { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
export function nowISO()    { return new Date().toISOString(); }
export function hashPass(p) { let h = 0; for (const c of p) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0; return h.toString(16); }

export default Storage;
