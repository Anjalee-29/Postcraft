import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthStore from "../store/authStore";
import { C, GLOBAL_CSS } from "../styles/theme";
import Input from "../components/Input";
import Btn from "../components/Btn";
import Spinner from "../components/Spinner";

export default function LoginPage() {
  const { login } = useAuth();
  const [mode,    setMode]    = useState("login"); // "login" | "reset"
  const [form,    setForm]    = useState({ email: "", password: "", newPassword: "", confirm: "" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [banner,  setBanner]  = useState("");

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const validate = (rules) => {
    const e = {};
    rules.forEach(([k, cond, msg]) => { if (cond) e[k] = msg; });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate([
      ["email",    !form.email,    "Required"],
      ["password", !form.password, "Required"],
    ])) return;
    setLoading(true);
    const res = await login(form.email, form.password);
    if (res.error) setErrors({ password: res.error });
    setLoading(false);
  };

  const handleReset = async () => {
    if (!validate([
      ["email",       !form.email,                       "Required"],
      ["newPassword", form.newPassword.length < 6,       "Minimum 6 characters"],
      ["confirm",     form.newPassword !== form.confirm,  "Passwords don't match"],
    ])) return;
    setLoading(true);
    const users = await AuthStore.listUsers();
    const found = users.find(u => u.email === form.email && u.active);
    if (!found) { setErrors({ email: "No active account with this email" }); setLoading(false); return; }
    await AuthStore.resetPassword(found.id, form.newPassword);
    setBanner("Password reset! Please sign in.");
    setMode("login");
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg,${C.dark} 0%,#1a1040 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        width: 420, background: C.surface, borderRadius: 22,
        padding: "40px 38px", boxShadow: "0 28px 70px rgba(0,0,0,0.35)",
        animation: "fadeIn 0.35s ease",
      }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 54, height: 54, borderRadius: 14, margin: "0 auto 14px",
            background: `linear-gradient(135deg,${C.primary},${C.accent})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 24, color: "#fff",
          }}>P</div>
          <h1 style={{ fontWeight: 900, fontSize: 24, color: C.text, marginBottom: 5 }}>PostCraft</h1>
          <p style={{ color: C.muted, fontSize: 14 }}>
            {mode === "login" ? "Sign in to your workspace" : "Reset your password"}
          </p>
        </div>

        {banner && (
          <div style={{ background: "#ecfdf5", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", color: C.success, fontWeight: 700, fontSize: 13, marginBottom: 18 }}>
            ✓ {banner}
          </div>
        )}

        <Input label="Email address" type="email" placeholder="you@company.com"
          value={form.email} onChange={e => set("email", e.target.value)} error={errors.email} />

        {mode === "login" ? (
          <Input label="Password" type="password" placeholder="••••••••"
            value={form.password} onChange={e => set("password", e.target.value)} error={errors.password} />
        ) : (
          <>
            <Input label="New Password" type="password" placeholder="Min 6 characters"
              value={form.newPassword} onChange={e => set("newPassword", e.target.value)} error={errors.newPassword} />
            <Input label="Confirm Password" type="password" placeholder="Repeat new password"
              value={form.confirm} onChange={e => set("confirm", e.target.value)} error={errors.confirm} />
          </>
        )}

        <Btn full onClick={mode === "login" ? handleLogin : handleReset} disabled={loading} style={{ marginTop: 4 }}>
          {loading ? <><Spinner />&nbsp;Please wait…</> : mode === "login" ? "Sign In →" : "Reset Password →"}
        </Btn>

        <p style={{ textAlign: "center", marginTop: 16 }}>
          <button
            onClick={() => { setMode(mode === "login" ? "reset" : "login"); setErrors({}); setBanner(""); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontWeight: 700, fontSize: 13 }}
          >
            {mode === "login" ? "Forgot password?" : "← Back to Sign In"}
          </button>
        </p>

        <div style={{ marginTop: 22, padding: "12px 14px", background: C.bg, borderRadius: 10, fontSize: 12, color: C.muted, textAlign: "center", lineHeight: 1.7 }}>
          Default admin<br />
          <strong style={{ color: C.text }}>admin@postcraft.io</strong>&nbsp;/&nbsp;<strong style={{ color: C.text }}>Admin@123</strong>
        </div>
      </div>
      <style>{GLOBAL_CSS}</style>
    </div>
  );
}
