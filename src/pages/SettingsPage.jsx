import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import AuthStore from "../store/authStore";
import { hashPass } from "../store/storage";
import { C } from "../styles/theme";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Input from "../components/Input";
import Btn from "../components/Btn";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [tab,          setTab]          = useState("profile");
  const [users,        setUsers]        = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [toast,        setToast]        = useState({ type: "", text: "" });
  const [confirmDeact, setConfirmDeact] = useState(null);

  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [passForm,    setPassForm]    = useState({ current: "", newPass: "", confirm: "" });
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [passErrors,  setPassErrors]  = useState({});
  const [userErrors,  setUserErrors]  = useState({});

  const notify = (type, text) => { setToast({ type, text }); setTimeout(() => setToast({ type: "", text: "" }), 3000); };

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    const all = await AuthStore.listUsers();
    setUsers(all.filter(u => u.active));
    setLoadingUsers(false);
  }, []);

  useEffect(() => { if (tab === "users") loadUsers(); }, [tab, loadUsers]);

  const saveProfile = async () => {
    if (!profileForm.name || !profileForm.email) { notify("error", "Name and email are required"); return; }
    const updated = await AuthStore.updateUser(user.id, { name: profileForm.name, email: profileForm.email });
    if (!updated) { notify("error", "Update failed"); return; }
    await refreshUser();
    notify("success", "Profile updated!");
  };

  const changePassword = async () => {
    const e = {};
    if (hashPass(passForm.current) !== user.passwordHash) e.current = "Current password is incorrect";
    if (passForm.newPass.length < 6)                      e.newPass = "Minimum 6 characters";
    if (passForm.newPass !== passForm.confirm)             e.confirm = "Passwords don't match";
    if (Object.keys(e).length) { setPassErrors(e); return; }
    await AuthStore.resetPassword(user.id, passForm.newPass);
    setPassForm({ current: "", newPass: "", confirm: "" });
    setPassErrors({});
    notify("success", "Password changed successfully!");
  };

  const createUser = async () => {
    const e = {};
    if (!newUserForm.name)               e.name     = "Required";
    if (!newUserForm.email)              e.email    = "Required";
    if (newUserForm.password.length < 6) e.password = "Min 6 characters";
    const dupe = users.find(u => u.email === newUserForm.email);
    if (dupe)                            e.email    = "Email already in use";
    if (Object.keys(e).length) { setUserErrors(e); return; }
    await AuthStore.createUser(newUserForm);
    setNewUserForm({ name: "", email: "", password: "", role: "member" });
    setUserErrors({});
    await loadUsers();
    notify("success", "User created!");
  };

  const deactivateUser = async (id) => {
    await AuthStore.deactivateUser(id);
    setConfirmDeact(null);
    await loadUsers();
    notify("success", "User deactivated.");
  };

  const TABS = [
    { id: "profile",  label: "My Profile"      },
    { id: "password", label: "Change Password" },
    ...(user?.role === "admin" ? [{ id: "users", label: "User Management" }] : []),
  ];

  return (
    <div style={{ padding: "32px 36px", maxWidth: 720 }}>
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: C.text, marginBottom: 5 }}>Settings ⚙️</h1>
        <p style={{ color: C.muted, fontSize: 14 }}>Manage your account and team</p>
      </div>

      <Toast msg={toast} />

      <div style={{ display: "flex", gap: 7, marginBottom: 22, flexWrap: "wrap" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "9px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit",
            border: tab === t.id ? `2px solid ${C.primary}` : `1px solid ${C.border}`,
            background: tab === t.id ? C.primaryLight : "#fff",
            color: tab === t.id ? C.primary : C.muted,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "26px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 26, paddingBottom: 22, borderBottom: `1px solid ${C.bg}` }}>
            <Avatar name={user?.name} size={58} />
            <div>
              <p style={{ fontWeight: 900, fontSize: 18, color: C.text, margin: "0 0 3px" }}>{user?.name}</p>
              <p style={{ color: C.muted, fontSize: 13, margin: "0 0 8px" }}>{user?.email}</p>
              <Badge label={user?.role} />
            </div>
          </div>
          <Input label="Full Name"     value={profileForm.name}  onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Email Address" type="email" value={profileForm.email} onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} />
          <Btn onClick={saveProfile}>Save Changes</Btn>
        </div>
      )}

      {/* Password tab */}
      {tab === "password" && (
        <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "26px 28px" }}>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
            Use a strong password with a mix of letters, numbers, and symbols.
          </p>
          <Input label="Current Password" type="password" placeholder="Your current password"
            value={passForm.current} onChange={e => { setPassForm(f => ({ ...f, current: e.target.value })); setPassErrors(p => ({ ...p, current: "" })); }}
            error={passErrors.current} />
          <Input label="New Password" type="password" placeholder="Min 6 characters"
            value={passForm.newPass} onChange={e => { setPassForm(f => ({ ...f, newPass: e.target.value })); setPassErrors(p => ({ ...p, newPass: "" })); }}
            error={passErrors.newPass} />
          <Input label="Confirm New Password" type="password" placeholder="Repeat new password"
            value={passForm.confirm} onChange={e => { setPassForm(f => ({ ...f, confirm: e.target.value })); setPassErrors(p => ({ ...p, confirm: "" })); }}
            error={passErrors.confirm} />
          <Btn onClick={changePassword}>🔒 Change Password</Btn>
        </div>
      )}

      {/* User management tab (admin only) */}
      {tab === "users" && user?.role === "admin" && (
        <div>
          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "24px 26px", marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 18 }}>➕ Create New User</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
              <Input label="Full Name"     value={newUserForm.name}     onChange={e => { setNewUserForm(f => ({ ...f, name: e.target.value }));     setUserErrors(v => ({ ...v, name: "" })); }}  error={userErrors.name} />
              <Input label="Email Address" type="email" value={newUserForm.email} onChange={e => { setNewUserForm(f => ({ ...f, email: e.target.value })); setUserErrors(v => ({ ...v, email: "" })); }} error={userErrors.email} />
              <Input label="Password"      type="password" value={newUserForm.password} onChange={e => { setNewUserForm(f => ({ ...f, password: e.target.value })); setUserErrors(v => ({ ...v, password: "" })); }} error={userErrors.password} />
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: C.text, display: "block", marginBottom: 6 }}>Role</label>
                <select
                  value={newUserForm.role}
                  onChange={e => setNewUserForm(f => ({ ...f, role: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", color: C.text, background: "#fff" }}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <Btn onClick={createUser}>Create User</Btn>
          </div>

          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.bg}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: C.text, margin: 0 }}>Team Members</h2>
              <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{users.length} active</span>
            </div>
            {loadingUsers ? (
              <div style={{ padding: 30, textAlign: "center", color: C.muted }}>Loading…</div>
            ) : users.length === 0 ? (
              <div style={{ padding: 30, textAlign: "center", color: C.muted }}>No users found.</div>
            ) : users.map((u, i) => (
              <div key={u.id} style={{
                padding: "14px 22px",
                borderBottom: i < users.length - 1 ? `1px solid ${C.bg}` : "none",
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <Avatar name={u.name} size={40} seed={i} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: C.text, margin: 0 }}>{u.name}</p>
                    {u.id === user.id && <span style={{ fontSize: 11, color: C.muted, fontStyle: "italic" }}>(you)</span>}
                  </div>
                  <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>
                    {u.email} · Joined {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge label={u.role} />
                <Badge label="active" />
                {u.id !== user.id && u.role !== "admin" && (
                  <Btn small variant="danger" onClick={() => setConfirmDeact(u)}>Deactivate</Btn>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {confirmDeact && (
        <Modal title="Deactivate User?" onClose={() => setConfirmDeact(null)} width={420}>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 10, lineHeight: 1.6 }}>
            You are about to deactivate <strong style={{ color: C.text }}>{confirmDeact.name}</strong>.
            They will no longer be able to sign in.
          </p>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>This action can be reversed from the database.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setConfirmDeact(null)}>Cancel</Btn>
            <Btn variant="danger"    onClick={() => deactivateUser(confirmDeact.id)}>Yes, Deactivate</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
