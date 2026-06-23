import { Notification } from '@/types/notification';
import { Transaction } from '@/types/transaction';
import { Wallet } from '@/types/wallet';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  );
}

function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

export function checkExpenseDue(transactions: Transaction[], currency = 'BRL'): Notification[] {
  const now = new Date();
  return transactions
    .filter(
      (t) =>
        t.type === 'expense' &&
        t.status === 'unpaid' &&
        (isToday(t.date) || isTomorrow(t.date))
    )
    .map((t) => {
      const when = isToday(t.date) ? 'hoje' : 'amanhã';
      return {
        id: generateId(),
        type: 'expense_due' as const,
        title: 'Despesa a vencer',
        body: `"${t.title}" de ${formatCurrency(t.amount, currency)} vence ${when} (${formatDate(t.date)}).`,
        isRead: false,
        createdAt: now,
      };
    });
}

export function checkIncomePending(transactions: Transaction[], currency = 'BRL'): Notification[] {
  const now = new Date();
  return transactions
    .filter(
      (t) =>
        t.type === 'income' &&
        t.status === 'unreceived' &&
        isPast(t.date)
    )
    .map((t) => ({
      id: generateId(),
      type: 'income_pending' as const,
      title: 'Receita pendente',
      body: `"${t.title}" de ${formatCurrency(t.amount, currency)} estava prevista para ${formatDate(t.date)} e ainda não foi recebida.`,
      isRead: false,
      createdAt: now,
    }));
}

export function buildMonthlySummary(
  transactions: Transaction[],
  month: number,
  year: number,
  currency = 'BRL',
  monthNames?: string[],
): Notification | null {
  const now = new Date();

  const DEFAULT_MONTH_NAMES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  const names = monthNames ?? DEFAULT_MONTH_NAMES;

  const monthTransactions = transactions.filter((t) => {
    const d = t.date instanceof Date ? t.date : (t.date as unknown as { toDate: () => Date }).toDate();
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  const totalReceived = monthTransactions
    .filter((t) => t.type === 'income' && t.status === 'received')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPaid = monthTransactions
    .filter((t) => t.type === 'expense' && t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);

  // Não gera resumo se não há nada a reportar
  if (totalReceived === 0 && totalPaid === 0) return null;

  const monthLabel = `${names[month - 1]}/${year}`;

  return {
    id: generateId(),
    type: 'monthly_summary',
    title: `Resumo de ${monthLabel}`,
    body: `Você recebeu ${formatCurrency(totalReceived, currency)} e pagou ${formatCurrency(totalPaid, currency)} em ${monthLabel}.`,
    isRead: false,
    createdAt: now,
  };
}

export function checkNegativeBalance(wallets: Wallet[], currency = 'BRL'): Notification[] {
  const now = new Date();
  return wallets
    .filter((w) => w.balance < 0)
    .map((w) => ({
      id: generateId(),
      type: 'negative_balance' as const,
      title: 'Saldo negativo',
      body: `A carteira "${w.name}" está com saldo negativo de ${formatCurrency(w.balance, currency)}.`,
      isRead: false,
      createdAt: now,
    }));
}
