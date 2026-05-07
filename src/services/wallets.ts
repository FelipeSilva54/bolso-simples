import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

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

export async function deleteWallet(userId: string, walletId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'wallets', walletId));
}
