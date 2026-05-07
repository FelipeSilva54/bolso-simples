import { useState, useEffect } from 'react';
import { Wallet } from '@/types/wallet';

type CreateWalletInput = {
  name: string;
  color: string;
  initialBalance: number;
};

type UseWalletsResult = {
  wallets: Wallet[];
  loading: boolean;
  createWallet: (input: CreateWalletInput) => Promise<void>;
};

export function useWallets(): UseWalletsResult {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: subscribe to Firestore wallets collection
    setLoading(false);
  }, []);

  async function createWallet(_input: CreateWalletInput): Promise<void> {
    // TODO: create wallet in Firestore
  }

  return { wallets, loading, createWallet };
}
