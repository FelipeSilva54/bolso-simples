import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Notification } from '@/types/notification';
import { Transaction } from '@/types/transaction';
import { Wallet } from '@/types/wallet';
import {
  getNotifications,
  markAsRead as serviceMarkAsRead,
  markAllAsRead as serviceMarkAllAsRead,
  saveNotification,
} from '@/services/notifications';
import {
  buildMonthlySummary,
  checkExpenseDue,
  checkIncomePending,
  checkNegativeBalance,
} from '@/utils/notificationGenerator';
import { useAuth } from '@/store/AuthContext';
import { usePreferences } from '@/store/PreferencesContext';
import { useLanguage } from '@/store/LanguageContext';

type NotificationContextValue = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  checkAndGenerateNotifications: (wallets: Wallet[], transactions: Transaction[]) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { preferences } = usePreferences();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    getNotifications(user.uid).then((real) => {
      setNotifications(real);
    });
  }, [user]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const markAsRead = useCallback(
    async (id: string) => {
      if (!user) return;
      await serviceMarkAsRead(user.uid, id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    },
    [user],
  );

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    await serviceMarkAllAsRead(user.uid);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, [user]);

  const checkAndGenerateNotifications = useCallback(
    async (wallets: Wallet[], transactions: Transaction[]) => {
      if (!user) return;

      const currency = preferences.currency;
      const monthNames = [
        t('date.months.jan'), t('date.months.feb'), t('date.months.mar'), t('date.months.apr'),
        t('date.months.may'), t('date.months.jun'), t('date.months.jul'), t('date.months.aug'),
        t('date.months.sep'), t('date.months.oct'), t('date.months.nov'), t('date.months.dec'),
      ].map((m) => m.charAt(0).toUpperCase() + m.slice(1));

      const now = new Date();
      const candidates: Notification[] = [
        ...checkExpenseDue(transactions, currency),
        ...checkIncomePending(transactions, currency),
        ...checkNegativeBalance(wallets, currency),
      ];

      // Resumo mensal só aparece nos primeiros 7 dias do mês, referente ao mês anterior fechado
      if (now.getDate() <= 7) {
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const summary = buildMonthlySummary(
          transactions,
          prevMonthDate.getMonth() + 1,
          prevMonthDate.getFullYear(),
          currency,
          monthNames,
        );
        if (summary) candidates.push(summary);
      }

      const existing = await getNotifications(user.uid);

      const toSave = candidates.filter(
        (candidate) =>
          !existing.some((stored) => {
            if (stored.type !== candidate.type) return false;
            // Resumo mensal: apenas um por mês (não por dia)
            if (candidate.type === 'monthly_summary') {
              return isSameMonth(stored.createdAt, candidate.createdAt);
            }
            return isSameDay(stored.createdAt, candidate.createdAt);
          }),
      );

      for (const notification of toSave) {
        await saveNotification(user.uid, notification);
      }

      if (toSave.length > 0) {
        const updated = await getNotifications(user.uid);
        setNotifications(updated);
      }
    },
    [user, preferences.currency, t],
  );

  const value = useMemo(
    () => ({ notifications, unreadCount, markAsRead, markAllAsRead, checkAndGenerateNotifications }),
    [notifications, unreadCount, markAsRead, markAllAsRead, checkAndGenerateNotifications],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
