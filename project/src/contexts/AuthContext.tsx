import { createContext, useEffect, useState, ReactNode } from 'react';

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
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
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedProfile = localStorage.getItem('profile');
    
    if (savedUser && savedProfile) {
      setUser(JSON.parse(savedUser));
      setProfile(JSON.parse(savedProfile));
    }
    
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const newUser = {
        id: crypto.randomUUID(),
        email,
      };

      const newProfile = {
        id: newUser.id,
        email,
        full_name: fullName,
        phone: phone || null,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('profile', JSON.stringify(newProfile));
      localStorage.setItem(`password_${email}`, password); // For demo purposes only

      setUser(newUser);
      setProfile(newProfile);
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    const savedPassword = localStorage.getItem(`password_${email}`);
    if (savedPassword === password) {
      const savedUser = localStorage.getItem('user');
      const savedProfile = localStorage.getItem('profile');
      
      if (savedUser && savedProfile) {
        const user = JSON.parse(savedUser);
        const profile = JSON.parse(savedProfile);
        setUser(user);
        setProfile(profile);
        return { error: null };
      }
    }
    return { error: new Error('Invalid email or password') };
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    // Don't clear localStorage to persist demo data
  };

  const resetPassword = async () => {
    // Demo implementation
    return { error: null };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return { error: new Error('No user logged in') };

    try {
      const updatedProfile = {
        ...profile,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
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

