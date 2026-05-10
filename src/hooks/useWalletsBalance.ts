import { useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { getTransactionsRef } from '@/services/transactions';
import { useAuth } from '@/store/AuthContext';
import { Wallet } from '@/types/wallet';

type UseWalletsBalanceResult = {
  balanceByWallet: Record<string, number>;
  totalBalance: number;
  loading: boolean;
};

// Saldo é sempre recalculado a partir das transações em tempo real:
//   wallet.balance (seed inicial gravado na criação) +
//   soma de receitas com status `received` -
//   soma de despesas com status `paid`.
// Transações `unpaid`/`unreceived` não entram no cálculo.
export function useWalletsBalance(wallets: Wallet[]): UseWalletsBalanceResult {
  const { user } = useAuth();
  const [transactionTotals, setTransactionTotals] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Chave estável: detecta mudança real na lista de carteiras (não no array reference)
  const walletIdsKey = wallets
    .map((w) => w.id)
    .sort()
    .join(',');

  useEffect(() => {
    if (!user || wallets.length === 0) {
      setTransactionTotals({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const totals: Record<string, number> = {};
    const unsubscribers: (() => void)[] = [];
    let pending = wallets.length;

    for (const wallet of wallets) {
      totals[wallet.id] = 0;
    }

    for (const wallet of wallets) {
      const unsub = onSnapshot(
        getTransactionsRef(user.uid, wallet.id),
        (snapshot) => {
          let total = 0;
          for (const docSnap of snapshot.docs) {
            const data = docSnap.data();
            const amount = data.amount as number;
            const type = data.type as string;
            const status = data.status as string;
            if (type === 'income' && status === 'received') total += amount;
            else if (type === 'expense' && status === 'paid') total -= amount;
          }
          totals[wallet.id] = total;
          setTransactionTotals({ ...totals });
          if (pending > 0) {
            pending--;
            if (pending === 0) setLoading(false);
          }
        },
      );
      unsubscribers.push(unsub);
    }

    return () => {
      for (const unsub of unsubscribers) unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, walletIdsKey]);

  const balanceByWallet: Record<string, number> = {};
  for (const wallet of wallets) {
    balanceByWallet[wallet.id] = wallet.balance + (transactionTotals[wallet.id] ?? 0);
  }
  const totalBalance = Object.values(balanceByWallet).reduce((sum, v) => sum + v, 0);

  return { balanceByWallet, totalBalance, loading };
}
