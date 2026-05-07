export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionStatus = 'paid' | 'unpaid' | 'received' | 'unreceived';

export type Transaction = {
  id: string;
  walletId: string;
  type: TransactionType;
  title: string;
  description: string;
  amount: number;
  categoryId: string;
  status: TransactionStatus;
  isRecurring: boolean;
  date: Date;
  createdAt: Date;
};
