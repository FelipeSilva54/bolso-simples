import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  deleteUser,
} from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { useRouter, useSegments } from 'expo-router';
import { auth, db } from '@/services/firebase';
import { seedDefaultCategories } from '@/services/categories';
import { clearNotifications } from '@/services/notifications';

GoogleSignin.configure({
  webClientId: '552079077785-fienoalfospe047s005rl29nq0c2s046.apps.googleusercontent.com',
});

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
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Seed das categorias padrão no primeiro acesso. Não bloqueia a UI:
      // se falhar (ex: offline ou regra do Firestore), só logamos.
      if (firebaseUser) {
        seedDefaultCategories(firebaseUser.uid).catch((err) => {
          if (__DEV__) console.warn('seedDefaultCategories falhou:', err);
        });
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;
    const inProtectedRoute = segments[0] === '(tabs)' || segments[0] === '(stack)';
    const inAuthRoute = segments[0] === 'login';
    if (!user && inProtectedRoute) {
      router.replace('/login');
    } else if (user && inAuthRoute) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  async function loginWithGoogle(): Promise<void> {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { data } = await GoogleSignin.signIn();
    if (!data?.idToken) throw new Error('Google Sign-In: no idToken returned');
    const credential = GoogleAuthProvider.credential(data.idToken);
    await signInWithCredential(auth, credential);
  }

  async function loginAnonymous(): Promise<void> {
    await firebaseSignInAnonymously(auth);
  }

  async function logout(): Promise<void> {
    if (!auth.currentUser?.isAnonymous) {
      try { await GoogleSignin.signOut(); } catch {}
    }
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

    await clearNotifications(uid);

    if (!currentUser.isAnonymous) {
      try { await GoogleSignin.revokeAccess(); } catch {}
      try { await GoogleSignin.signOut(); } catch {}
    }

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
