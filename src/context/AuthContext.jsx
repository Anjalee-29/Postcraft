import { createContext, useContext, useState, useEffect } from "react";
import AuthStore from "../store/authStore";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthStore.init()
      .then(() => AuthStore.getSession())
      .then(u => { setUser(u); setLoading(false); });
  }, []);

  const login = async (email, pass) => {
    const res = await AuthStore.login(email, pass);
    if (res.user) setUser(res.user);
    return res;
  };

  const logout = async () => { await AuthStore.logout(); setUser(null); };

  const refreshUser = async () => {
    const u = await AuthStore.getSession();
    setUser(u);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
