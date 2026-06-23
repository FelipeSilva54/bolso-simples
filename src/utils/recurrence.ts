import { Transaction } from '@/types/transaction';
import { DateRange } from '@/types/period';

function getNextOccurrence(date: Date, recurrenceType: string): Date {
  const d = new Date(date);
  switch (recurrenceType) {
    case 'daily':        d.setDate(d.getDate() + 1); break;
    case 'weekly':       d.setDate(d.getDate() + 7); break;
    case 'biweekly':     d.setDate(d.getDate() + 14); break;
    case 'monthly':      d.setMonth(d.getMonth() + 1); break;
    case 'bimonthly':    d.setMonth(d.getMonth() + 2); break;
    case 'quarterly':    d.setMonth(d.getMonth() + 3); break;
    case 'semiannually': d.setMonth(d.getMonth() + 6); break;
    case 'annually':     d.setFullYear(d.getFullYear() + 1); break;
    default:             d.setMonth(d.getMonth() + 1);
  }
  return d;
}

// Expands recurring transactions into all their occurrences within the range.
// Non-recurring transactions are returned as-is.
// Each virtual occurrence shares the same `id` as the source transaction.
export function expandRecurring(transactions: Transaction[], range: DateRange): Transaction[] {
  const result: Transaction[] = [];

  for (const tx of transactions) {
    if (!tx.isRecurring || !tx.recurrenceType) {
      result.push(tx);
      continue;
    }

    // Skip transactions that haven't started yet for this range
    if (tx.date > range.end) continue;

    // Advance from anchor until we reach range.start
    let current = new Date(tx.date);
    let safety = 0;
    while (current < range.start && safety < 100_000) {
      const next = getNextOccurrence(current, tx.recurrenceType);
      if (next.getTime() === current.getTime()) break;
      current = next;
      safety++;
    }

    // Emit all occurrences within [range.start, range.end]
    safety = 0;
    while (current <= range.end && safety < 10_000) {
      if (current >= range.start) {
        result.push({ ...tx, date: new Date(current) });
      }
      const next = getNextOccurrence(current, tx.recurrenceType);
      if (next.getTime() === current.getTime()) break;
      current = next;
      safety++;
    }
  }

  return result;
}
