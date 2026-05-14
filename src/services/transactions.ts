import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { Transaction, TransactionType, TransactionStatus } from '@/types/transaction';

export async function getTransaction(
  userId: string,
  walletId: string,
  transactionId: string,
): Promise<Transaction | null> {
  const ref = doc(db, 'users', userId, 'wallets', walletId, 'transactions', transactionId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    id: snap.id,
    walletId,
    type: d.type as TransactionType,
    title: d.title,
    description: d.description ?? '',
    amount: d.amount,
    categoryId: d.categoryId,
    status: d.status as TransactionStatus,
    isRecurring: d.isRecurring ?? false,
    date: (d.date as Timestamp).toDate(),
    createdAt: (d.createdAt as Timestamp)?.toDate() ?? new Date(),
    installmentIndex: d.installmentIndex,
    installmentTotal: d.installmentTotal,
  };
}

export type AddTransactionInput = {
  type: TransactionType;
  title: string;
  description: string;
  amount: number;
  categoryId: string;
  status: TransactionStatus;
  isRecurring: boolean;
  date: Date;
  installmentIndex?: number;
  installmentTotal?: number;
};

export function getTransactionsRef(
  userId: string,
  walletId: string,
): CollectionReference<DocumentData> {
  return collection(db, 'users', userId, 'wallets', walletId, 'transactions');
}

export async function addTransaction(
  userId: string,
  walletId: string,
  input: AddTransactionInput,
): Promise<string> {
  const data: Record<string, unknown> = {
    type: input.type,
    title: input.title,
    description: input.description,
    amount: input.amount,
    categoryId: input.categoryId,
    status: input.status,
    isRecurring: input.isRecurring,
    date: Timestamp.fromDate(input.date),
    createdAt: serverTimestamp(),
  };
  if (input.installmentIndex != null) data.installmentIndex = input.installmentIndex;
  if (input.installmentTotal != null) data.installmentTotal = input.installmentTotal;
  const ref = await addDoc(getTransactionsRef(userId, walletId), data);
  return ref.id;
}

export async function updateTransaction(
  userId: string,
  walletId: string,
  transactionId: string,
  data: Partial<AddTransactionInput>,
): Promise<void> {
  const ref = doc(db, 'users', userId, 'wallets', walletId, 'transactions', transactionId);
  await updateDoc(ref, {
    ...data,
    ...(data.date ? { date: Timestamp.fromDate(data.date) } : {}),
  });
}

export async function deleteTransaction(
  userId: string,
  walletId: string,
  transactionId: string,
): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'wallets', walletId, 'transactions', transactionId));
}
