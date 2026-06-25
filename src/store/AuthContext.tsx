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
import { deleteDoc, doc } from 'firebase/firestore';
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { useRouter, useSegments } from 'expo-router';
import { auth, db } from '@/services/firebase';
import { seedDefaultCategories } from '@/services/categories';
import { clearNotifications } from '@/services/notifications';
import { clearAllUserData } from '@/services/wallets';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAnonymous: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  isGuestDetached: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // When an anonymous user "logs out", we keep the Firebase session alive
  // and use this flag to send them back to the login screen. This preserves
  // the anonymous UID so their Firestore data remains accessible on re-entry.
  const [isGuestDetached, setIsGuestDetached] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // When a real (non-anonymous) user signs in, clear the detached flag.
      if (firebaseUser && !firebaseUser.isAnonymous) {
        setIsGuestDetached(false);
      }

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
    if ((!user || isGuestDetached) && inProtectedRoute) {
      router.replace('/login');
    } else if (user && !isGuestDetached && inAuthRoute) {
      router.replace('/(tabs)');
    }
  }, [user, loading, isGuestDetached, segments]);

  async function loginWithGoogle(): Promise<void> {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { data } = await GoogleSignin.signIn();
    if (!data?.idToken) throw new Error('Google Sign-In: no idToken returned');
    const credential = GoogleAuthProvider.credential(data.idToken);
    await signInWithCredential(auth, credential);
  }

  async function loginAnonymous(): Promise<void> {
    if (user?.isAnonymous) {
      // Session is still alive — just bring the user back into the app.
      setIsGuestDetached(false);
      return;
    }
    await firebaseSignInAnonymously(auth);
  }

  async function logout(): Promise<void> {
    if (auth.currentUser?.isAnonymous) {
      // Keep the Firebase anonymous session intact so the UID (and all
      // Firestore data) survives. Just navigate away from protected routes.
      setIsGuestDetached(true);
      return;
    }
    try { await GoogleSignin.signOut(); } catch {}
    await firebaseSignOut(auth);
  }

  async function deleteAccount(): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const uid = currentUser.uid;

    // clearAllUserData handles chunked batch deletes (safe for >500 ops)
    await clearAllUserData(uid);
    await deleteDoc(doc(db, 'users', uid));
    await clearNotifications(uid);

    if (!currentUser.isAnonymous) {
      try { await GoogleSignin.revokeAccess(); } catch {}
      try { await GoogleSignin.signOut(); } catch {}
    }

    await deleteUser(currentUser);
  }

  return (
    <AuthContext.Provider value={{ user, loading, isGuestDetached, loginWithGoogle, loginAnonymous, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
