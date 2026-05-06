import { useState, useEffect } from 'react';
import { Wallet } from '@/types/wallet';

type UseWalletsResult = {
  wallets: Wallet[];
  loading: boolean;
};

export function useWallets(): UseWalletsResult {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: subscribe to Firestore wallets collection
    setLoading(false);
  }, []);

  return { wallets, loading };
}
