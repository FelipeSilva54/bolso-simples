import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInAnonymously as firebaseSignInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  deleteUser,
} from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';
import { seedDefaultCategories } from '@/services/categories';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAnonymous: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Seed das categorias padrão no primeiro acesso. Não bloqueia a UI:
      // se falhar (ex: offline ou regra do Firestore), só logamos.
      if (firebaseUser) {
        seedDefaultCategories(firebaseUser.uid).catch((err) => {
          console.warn('seedDefaultCategories falhou:', err);
        });
      }
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

  async function deleteAccount(): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const uid = currentUser.uid;

    const batch = writeBatch(db);

    const walletsSnap = await getDocs(collection(db, 'users', uid, 'wallets'));
    for (const walletDoc of walletsSnap.docs) {
      const txSnap = await getDocs(
        collection(db, 'users', uid, 'wallets', walletDoc.id, 'transactions'),
      );
      txSnap.docs.forEach((txDoc) => batch.delete(txDoc.ref));
      batch.delete(walletDoc.ref);
    }

    const categoriesSnap = await getDocs(collection(db, 'users', uid, 'categories'));
    categoriesSnap.docs.forEach((catDoc) => batch.delete(catDoc.ref));

    batch.delete(doc(db, 'users', uid));
    await batch.commit();

    await deleteUser(currentUser);
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginAnonymous, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
