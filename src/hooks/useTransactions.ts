import { useState, useEffect, useMemo } from 'react';
import { onSnapshot, query, where, orderBy, Timestamp, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { Transaction, TransactionType, TransactionStatus } from '@/types/transaction';
import { Period, periodToRange } from '@/types/period';
import { getTransactionsRef } from '@/services/transactions';
import { useAuth } from '@/store/AuthContext';
import { expandRecurring } from '@/utils/recurrence';

type UseTransactionsParams = {
  walletId: string;
  period: Period;
  enabled?: boolean;
};

type UseTransactionsResult = {
  transactions: Transaction[];
  loading: boolean;
};

function mapDoc(doc: QueryDocumentSnapshot<DocumentData>, walletId: string): Transaction {
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
    recurrenceType: data.recurrenceType as string | undefined,
    date: data.date instanceof Timestamp ? data.date.toDate() : new Date(),
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    installmentIndex: data.installmentIndex as number | undefined,
    installmentTotal: data.installmentTotal as number | undefined,
  };
}

export function useTransactions({ walletId, period, enabled = true }: UseTransactionsParams): UseTransactionsResult {
  const { user } = useAuth();
  const [periodTxs, setPeriodTxs] = useState<Transaction[]>([]);
  const [recurringTxs, setRecurringTxs] = useState<Transaction[]>([]);
  const [loadingPeriod, setLoadingPeriod] = useState(true);
  const [loadingRecurring, setLoadingRecurring] = useState(true);

  const range = periodToRange(period);
  const rangeKey = range
    ? `${range.start.getTime()}-${range.end.getTime()}`
    : 'all';

  // Subscription 1: transactions within the period range (or all when mode === 'all')
  useEffect(() => {
    if (!enabled) {
      setPeriodTxs([]);
      setLoadingPeriod(true);
      return;
    }
    if (!user || !walletId) {
      setPeriodTxs([]);
      setLoadingPeriod(false);
      return;
    }

    setLoadingPeriod(true);

    const baseRef = getTransactionsRef(user.uid, walletId);
    const q = range == null
      ? query(baseRef, orderBy('date', 'desc'))
      : query(
          baseRef,
          where('date', '>=', Timestamp.fromDate(range.start)),
          where('date', '<=', Timestamp.fromDate(range.end)),
          orderBy('date', 'desc'),
        );

    return onSnapshot(q, (snapshot) => {
      setPeriodTxs(snapshot.docs.map((doc) => mapDoc(doc, walletId)));
      setLoadingPeriod(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, walletId, rangeKey, enabled]);

  // Subscription 2: ALL recurring transactions — needed to expand occurrences
  // that fall in the current period but whose anchor date is before range.start.
  // Only active when a range filter is applied.
  useEffect(() => {
    if (!enabled || range == null) {
      setRecurringTxs([]);
      setLoadingRecurring(false);
      return;
    }
    if (!user || !walletId) {
      setRecurringTxs([]);
      setLoadingRecurring(false);
      return;
    }

    setLoadingRecurring(true);

    const baseRef = getTransactionsRef(user.uid, walletId);
    const q = query(baseRef, where('isRecurring', '==', true));

    return onSnapshot(q, (snapshot) => {
      setRecurringTxs(snapshot.docs.map((doc) => mapDoc(doc, walletId)));
      setLoadingRecurring(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, walletId, rangeKey, enabled]);

  const transactions = useMemo<Transaction[]>(() => {
    // Re-derive range inside memo so we depend on the stable rangeKey, not the object ref
    const currentRange = periodToRange(period);

    if (currentRange == null) {
      // 'all' mode: return everything as-is (no expansion needed)
      return periodTxs;
    }

    // Merge: non-recurring from period query + all recurring (deduplicated by id)
    const seenIds = new Set<string>();
    const merged: Transaction[] = [];

    for (const tx of periodTxs) {
      if (!tx.isRecurring) {
        merged.push(tx);
        seenIds.add(tx.id);
      }
    }

    // Recurring transactions (from the dedicated subscription)
    // Some may already be in periodTxs — deduplicate so we expand each only once
    for (const tx of recurringTxs) {
      if (!seenIds.has(tx.id)) {
        merged.push(tx);
        seenIds.add(tx.id);
      }
    }

    // Also add recurring transactions from periodTxs that aren't in recurringTxs yet
    // (e.g., if Firestore's isRecurring subscription hasn't resolved yet)
    for (const tx of periodTxs) {
      if (tx.isRecurring && !seenIds.has(tx.id)) {
        merged.push(tx);
        seenIds.add(tx.id);
      }
    }

    const expanded = expandRecurring(merged, currentRange);
    return expanded.sort((a, b) => b.date.getTime() - a.date.getTime());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodTxs, recurringTxs, rangeKey]);

  const loading = loadingPeriod || (range != null && loadingRecurring);

  return { transactions, loading };
}
