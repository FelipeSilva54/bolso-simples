import { useState, useEffect } from 'react';
import { onSnapshot, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { Transaction, TransactionType, TransactionStatus } from '@/types/transaction';
import { Period, periodToRange } from '@/types/period';
import { getTransactionsRef } from '@/services/transactions';
import { useAuth } from '@/store/AuthContext';

type UseTransactionsParams = {
  walletId: string;
  period: Period;
  enabled?: boolean;
};

type UseTransactionsResult = {
  transactions: Transaction[];
  loading: boolean;
};

export function useTransactions({ walletId, period, enabled = true }: UseTransactionsParams): UseTransactionsResult {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const range = periodToRange(period);
  // Chave estável para o useEffect: muda apenas quando o intervalo muda de fato.
  const rangeKey = range
    ? `${range.start.getTime()}-${range.end.getTime()}`
    : 'all';

  useEffect(() => {
    if (!enabled) {
      setTransactions([]);
      setLoading(true);
      return;
    }
    if (!user || !walletId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const baseRef = getTransactionsRef(user.uid, walletId);
    const q = range == null
      ? query(baseRef, orderBy('date', 'desc'))
      : query(
          baseRef,
          where('date', '>=', Timestamp.fromDate(range.start)),
          where('date', '<=', Timestamp.fromDate(range.end)),
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
            installmentIndex: data.installmentIndex as number | undefined,
            installmentTotal: data.installmentTotal as number | undefined,
          };
        }),
      );
      setLoading(false);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, walletId, rangeKey, enabled]);

  return { transactions, loading };
}
