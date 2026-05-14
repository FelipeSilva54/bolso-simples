import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  Timestamp,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { Wallet } from '@/types/wallet';

export function getWalletsRef(userId: string): CollectionReference<DocumentData> {
  return collection(db, 'users', userId, 'wallets');
}

export async function createWallet(
  userId: string,
  input: { name: string; color: string; initialBalance: number },
): Promise<string> {
  const ref = await addDoc(getWalletsRef(userId), {
    name: input.name,
    color: input.color,
    balance: input.initialBalance,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateWallet(
  userId: string,
  walletId: string,
  data: Partial<{ name: string; color: string }>,
): Promise<void> {
  await updateDoc(doc(db, 'users', userId, 'wallets', walletId), data);
}

export async function getWallet(userId: string, walletId: string): Promise<Wallet | null> {
  const snap = await getDoc(doc(db, 'users', userId, 'wallets', walletId));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    id: snap.id,
    name: d.name as string,
    color: d.color as string,
    balance: d.balance as number,
    createdAt: d.createdAt instanceof Timestamp ? d.createdAt.toDate() : new Date(),
  };
}

export async function deleteWallet(userId: string, walletId: string): Promise<void> {
  const txRef = collection(db, 'users', userId, 'wallets', walletId, 'transactions');
  const txSnap = await getDocs(txRef);
  if (!txSnap.empty) {
    const batch = writeBatch(db);
    txSnap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
  await deleteDoc(doc(db, 'users', userId, 'wallets', walletId));
}

export async function clearAllUserData(userId: string): Promise<void> {
  const batch = writeBatch(db);

  const walletsRef = collection(db, 'users', userId, 'wallets');
  const walletsSnap = await getDocs(walletsRef);

  for (const walletDoc of walletsSnap.docs) {
    const txRef = collection(db, 'users', userId, 'wallets', walletDoc.id, 'transactions');
    const txSnap = await getDocs(txRef);
    txSnap.docs.forEach((txDoc) => batch.delete(txDoc.ref));
    batch.delete(walletDoc.ref);
  }

  const categoriesRef = collection(db, 'users', userId, 'categories');
  const categoriesSnap = await getDocs(categoriesRef);
  categoriesSnap.docs.forEach((catDoc) => batch.delete(catDoc.ref));

  await batch.commit();
}
