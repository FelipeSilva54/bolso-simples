import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // TODO: substituir pelo listener do Firestore
    // Path: users/{userId}/wallets/{walletId}/transactions
    // Query sugerida:
    //   const start = new Date(year, month, 1);
    //   const end   = new Date(year, month + 1, 0, 23, 59, 59, 999);
    //   query(collectionRef, where('date', '>=', start), where('date', '<=', end))

    setTransactions([]);
    setLoading(false);
  }, [walletId, month, year]);

  return { transactions, loading };
}
