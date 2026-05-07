import { useState, useEffect } from 'react';
import { onSnapshot, Timestamp } from 'firebase/firestore';
import { Wallet } from '@/types/wallet';
import { getWalletsRef, createWallet as createWalletService } from '@/services/wallets';
import { useAuth } from '@/store/AuthContext';

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
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWallets([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(getWalletsRef(user.uid), (snapshot) => {
      setWallets(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name as string,
            color: data.color as string,
            balance: data.balance as number,
            createdAt: data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : new Date(),
          };
        }),
      );
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  async function createWallet(input: CreateWalletInput): Promise<void> {
    if (!user) return;
    await createWalletService(user.uid, input);
  }

  return { wallets, loading, createWallet };
}
