import { useState, useEffect } from 'react';
import { onSnapshot, Timestamp } from 'firebase/firestore';
import { getTransactionsRef } from '@/services/transactions';
import { useAuth } from '@/store/AuthContext';

function getLastNMonthKeys(n: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return keys;
}

export function useWalletSparkline(
  walletId: string,
  initialBalance: number,
  monthCount = 7,
): { data: number[]; loading: boolean } {
  const { user } = useAuth();
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !walletId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const ref = getTransactionsRef(user.uid, walletId);

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const monthlyDeltas = new Map<string, number>();

      for (const docSnap of snapshot.docs) {
        const d = docSnap.data();
        const type = d.type as string;
        const status = d.status as string;
        const amount = d.amount as number;
        const date = d.date instanceof Timestamp ? d.date.toDate() : new Date();

        if (
          !((type === 'income' && status === 'received') ||
            (type === 'expense' && status === 'paid'))
        ) {
          continue;
        }

        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const delta = type === 'income' ? amount : -amount;
        monthlyDeltas.set(key, (monthlyDeltas.get(key) ?? 0) + delta);
      }

      const targetMonths = getLastNMonthKeys(monthCount);

      // Saldo acumulado até o início do período alvo
      let runningBefore = initialBalance;
      for (const [key, delta] of monthlyDeltas.entries()) {
        if (key < targetMonths[0]) {
          runningBefore += delta;
        }
      }

      // Saldo ao final de cada mês do período alvo
      const balances: number[] = [];
      let running = runningBefore;
      for (const month of targetMonths) {
        running += monthlyDeltas.get(month) ?? 0;
        balances.push(running);
      }

      setData(balances);
      setLoading(false);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, walletId, initialBalance, monthCount]);

  return { data, loading };
}
