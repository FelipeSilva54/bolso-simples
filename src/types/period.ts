export type PeriodMode = 'monthly' | 'daily' | 'yearly' | 'all' | 'custom';

export type Period =
  | { mode: 'monthly'; month: number; year: number } // 0-indexed month
  | { mode: 'daily'; date: Date }
  | { mode: 'yearly'; year: number }
  | { mode: 'all' }
  | { mode: 'custom'; start: Date; end: Date };

export type DateRange = { start: Date; end: Date };

// Converte um Period em range de datas para query Firestore.
// Retorna null para o modo "all" (sem filtro de data).
export function periodToRange(period: Period): DateRange | null {
  if (period.mode === 'all') return null;
  if (period.mode === 'monthly') {
    return {
      start: new Date(period.year, period.month, 1, 0, 0, 0, 0),
      end: new Date(period.year, period.month + 1, 0, 23, 59, 59, 999),
    };
  }
  if (period.mode === 'daily') {
    const d = period.date;
    return {
      start: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0),
      end: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999),
    };
  }
  if (period.mode === 'yearly') {
    return {
      start: new Date(period.year, 0, 1, 0, 0, 0, 0),
      end: new Date(period.year, 11, 31, 23, 59, 59, 999),
    };
  }
  return {
    start: new Date(
      period.start.getFullYear(),
      period.start.getMonth(),
      period.start.getDate(),
      0, 0, 0, 0,
    ),
    end: new Date(
      period.end.getFullYear(),
      period.end.getMonth(),
      period.end.getDate(),
      23, 59, 59, 999,
    ),
  };
}
