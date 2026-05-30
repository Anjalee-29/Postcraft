import Storage, { uid, nowISO, hashPass } from "./storage";

const AuthStore = {
  async init() {
    const idx = await Storage.get("users:index");
    if (!idx || idx.length === 0) {
      await AuthStore.createUser({
        name: "Alex Morgan",
        email: "admin@postcraft.io",
        password: "Admin@123",
        role: "admin",
      });
    }
  },

  async createUser({ name, email, password, role = "member" }) {
    const id   = uid();
    const user = {
      id, name, email,
      passwordHash: hashPass(password),
      role,
      createdAt: nowISO(),
      active: true,
    };
    await Storage.set(`users:${id}`, user);
    const idx = (await Storage.get("users:index")) || [];
    idx.push(id);
    await Storage.set("users:index", idx);
    return user;
  },

  async listUsers() {
    const idx   = (await Storage.get("users:index")) || [];
    const users = await Promise.all(idx.map(id => Storage.get(`users:${id}`)));
    return users.filter(Boolean);
  },

  async login(email, password) {
    const users = await AuthStore.listUsers();
    const user  = users.find(
      u => u.email === email && u.passwordHash === hashPass(password) && u.active
    );
    if (!user) return { error: "Invalid email or password" };
    const session = { userId: user.id, token: uid(), createdAt: nowISO() };
    await Storage.set("session:current", session);
    return { user, session };
  },

  async logout() { await Storage.del("session:current"); },

  async getSession() {
    const s = await Storage.get("session:current");
    if (!s) return null;
    return Storage.get(`users:${s.userId}`);
  },

  async resetPassword(userId, newPassword) {
    const user = await Storage.get(`users:${userId}`);
    if (!user) return false;
    user.passwordHash = hashPass(newPassword);
    await Storage.set(`users:${userId}`, user);
    return true;
  },

  async updateUser(userId, updates) {
    const user = await Storage.get(`users:${userId}`);
    if (!user) return false;
    const updated = { ...user, ...updates };
    await Storage.set(`users:${userId}`, updated);
    return updated;
  },

  async deactivateUser(userId) {
    const user = await Storage.get(`users:${userId}`);
    if (!user || user.role === "admin") return false;
    user.active = false;
    await Storage.set(`users:${userId}`, user);
    return true;
  },
};

export default AuthStore;
