import { createContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from '../api/api';

// Only used for local profile editing (not persisted in Firebase)
export type Profile = {
  full_name: string;
  phone: string | null;
};

type User = {
  id: string;
  email: string;
};

type AuthError = Error;

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;

};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await authAPI.profile();
          const u = res.data.data.user;
          setUser({ id: u.id || u._id, email: u.email });
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

  const signUp = async (email: string, password: string) => {
    try {
      const full_name = email.split('@')[0];
      const res = await authAPI.register({ email, password, full_name });
      const { token, user: u } = res.data.data;
      localStorage.setItem('token', token);
      setUser({ id: u.id || u._id, email: u.email });
      setProfile({ full_name: u.full_name, phone: u.phone || null });
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await authAPI.login({ email, password });
      const { token, user: u } = res.data.data;
      localStorage.setItem('token', token);
      setUser({ id: u.id || u._id, email: u.email });
      setProfile({ full_name: u.full_name, phone: u.phone || null });
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try { await authAPI.logout(); } catch {}
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    // Backend reset password not implemented; no-op for now
    return { error: null };
  };

  // Local profile editing only
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };
    try {
      const res = await authAPI.updateProfile(updates);
      const u = res.data.data.user;
      setProfile({ full_name: u.full_name, phone: u.phone || null });
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

