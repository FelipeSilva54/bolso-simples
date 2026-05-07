import { useState, useEffect } from 'react';
import { onSnapshot, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { Transaction, TransactionType, TransactionStatus } from '@/types/transaction';
import { getTransactionsRef } from '@/services/transactions';
import { useAuth } from '@/store/AuthContext';

type UseTransactionsParams = {
  walletId: string;
  month: number; // 0-indexed (0 = Janeiro, 11 = Dezembro)
  year: number;
};

type UseTransactionsResult = {
  transactions: Transaction[];
  loading: boolean;
};

export function useTransactions({ walletId, month, year }: UseTransactionsParams): UseTransactionsResult {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !walletId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const start = new Date(year, month, 1, 0, 0, 0, 0);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const q = query(
      getTransactionsRef(user.uid, walletId),
      where('date', '>=', Timestamp.fromDate(start)),
      where('date', '<=', Timestamp.fromDate(end)),
      orderBy('date', 'desc'),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            walletId,
            type: data.type as TransactionType,
            title: data.title as string,
            description: (data.description as string) ?? '',
            amount: data.amount as number,
            categoryId: data.categoryId as string,
            status: data.status as TransactionStatus,
            isRecurring: (data.isRecurring as boolean) ?? false,
            date: data.date instanceof Timestamp ? data.date.toDate() : new Date(),
            createdAt:
              data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
          };
        }),
      );
      setLoading(false);
    });

    return unsubscribe;
  }, [user, walletId, month, year]);

  return { transactions, loading };
}
