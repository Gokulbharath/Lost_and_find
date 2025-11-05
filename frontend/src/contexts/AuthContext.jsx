// @refresh reset
import { createContext, useEffect, useState } from 'react';
import { authAPI } from '../api/api';

export const authContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await authAPI.profile();
          const u = res.data.data.user;
          setUser({ id: u.id || u._id, email: u.email, isAdmin: u.isAdmin || false });
          setProfile({ full_name: u.full_name, phone: u.phone || null });
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch {
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const signUp = async (userData) => {
    try {
      // Ensure we pass the fields the server expects: email, password, full_name, phone
      const { email, password, full_name, phone } = userData;
      const payload = { email, password, full_name };
      if (phone !== undefined) payload.phone = phone;
      
      console.log("auth -- ", payload.email);
      const res = await authAPI.register(payload);
      const { token, user: u } = res.data.data;
      localStorage.setItem('token', token);
      setUser({ id: u.id || u._id, email: u.email, isAdmin: u.isAdmin || false });
      setProfile({ full_name: u.full_name, phone: u.phone || null });
      return { error: null, user: { id: u.id || u._id, email: u.email, isAdmin: u.isAdmin || false } };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { token, user: u } = res.data.data;
      localStorage.setItem('token', token);
      setUser({ id: u.id || u._id, email: u.email, isAdmin: u.isAdmin || false });
      setProfile({ full_name: u.full_name, phone: u.phone || null });
      return { error: null, user: { id: u.id || u._id, email: u.email, isAdmin: u.isAdmin || false } };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email) => {
    try {
      console.info('Reset password requested for:', email);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: new Error('No user logged in') };
    try {
      const res = await authAPI.updateProfile(updates);
      const u = res.data.data.user;
      setProfile({ full_name: u.full_name, phone: u.phone || null });
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = { user, profile, loading, signUp, signIn, signOut, resetPassword, updateProfile };
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}


