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
  DocumentReference,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { Wallet } from '@/types/wallet';

// Firestore batch limit is 500 ops. Split into safe chunks to avoid the limit.
async function deleteDocsInChunks(refs: DocumentReference[]): Promise<void> {
  const CHUNK = 450;
  for (let i = 0; i < refs.length; i += CHUNK) {
    const batch = writeBatch(db);
    refs.slice(i, i + CHUNK).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
}

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
    await deleteDocsInChunks(txSnap.docs.map((d) => d.ref));
  }
  await deleteDoc(doc(db, 'users', userId, 'wallets', walletId));
}

export async function clearAllUserData(userId: string): Promise<void> {
  const walletsSnap = await getDocs(collection(db, 'users', userId, 'wallets'));

  for (const walletDoc of walletsSnap.docs) {
    const txSnap = await getDocs(
      collection(db, 'users', userId, 'wallets', walletDoc.id, 'transactions'),
    );
    if (!txSnap.empty) {
      await deleteDocsInChunks(txSnap.docs.map((d) => d.ref));
    }
    await deleteDoc(walletDoc.ref);
  }

  const categoriesSnap = await getDocs(collection(db, 'users', userId, 'categories'));
  if (!categoriesSnap.empty) {
    await deleteDocsInChunks(categoriesSnap.docs.map((d) => d.ref));
  }
}
