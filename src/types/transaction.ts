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
  recurrenceType?: string;
  date: Date;
  createdAt: Date;
  installmentIndex?: number;  // 1, 2, 3... — só presente em transações parceladas
  installmentTotal?: number;  // total de parcelas (>1 para indicar parcelamento)
};
