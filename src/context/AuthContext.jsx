import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  seedDatabase,
  loginUser,
  registerUser,
  logoutUser,
  getCurrentSession,
} from '../services/database';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await seedDatabase();
      } catch (err) {
        // Tidak fatal kalau seed gagal (mis. tabel sudah pernah diisi manual),
        // tapi tetap ditampilkan di console supaya kelihatan kalau koneksi Supabase bermasalah.
        console.error('Gagal seed database:', err.message);
      }
      const session = getCurrentSession();
      setUser(session);
      setLoading(false);
    };
    init();
  }, []);

  const login = async ({ email, password }) => {
    const result = await loginUser({ email, password });
    if (result.success) setUser(result.user);
    return result;
  };

  const register = async (data) => {
    const result = await registerUser(data);
    return result;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
};

export default AuthContext;
