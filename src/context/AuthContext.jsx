import { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

function savedUser() {
  try { return JSON.parse(localStorage.getItem('aashanway-user')); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(savedUser);
  const [token, setToken] = useState(() => localStorage.getItem('aashanway-token'));
  const saveSession = (response) => {
    localStorage.setItem('aashanway-token', response.token);
    localStorage.setItem('aashanway-user', JSON.stringify(response.user));
    setToken(response.token); setUser(response.user);
  };
  const login = async (email, password) => { const response = await authService.login(email, password); saveSession(response); return response.user; };
  const register = async (data) => { await authService.register(data); return login(data.email, data.password); };
  const logout = () => { localStorage.removeItem('aashanway-token'); localStorage.removeItem('aashanway-user'); setToken(null); setUser(null); };
  const role = Number(user?.role_id) === 1 ? 'admin' : 'seller';
  const value = useMemo(() => ({ user, token, role, isAuthenticated: Boolean(token), login, register, logout }), [user, token, role]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
