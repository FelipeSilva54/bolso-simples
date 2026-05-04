import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInAnonymously as firebaseSignInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/src/services/firebase';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAnonymous: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function loginWithGoogle(): Promise<void> {
    throw new Error('loginWithGoogle requires expo-auth-session — install and configure first');
  }

  async function loginAnonymous(): Promise<void> {
    await firebaseSignInAnonymously(auth);
  }

  async function logout(): Promise<void> {
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginAnonymous, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
