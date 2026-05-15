import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
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

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    getNotifications(user.uid).then((real) => {
      // TEMP TEST — remover antes do build final
      const fakeNotifications: Notification[] = [
        {
          id: 'test-1',
          type: 'expense_due',
          title: 'Conta de luz vence amanhã',
          body: 'R$ 180,00 ainda não foi marcado como pago.',
          isRead: false,
          createdAt: new Date(),
        },
        {
          id: 'test-2',
          type: 'income_pending',
          title: 'Receita não confirmada',
          body: 'Freela de R$ 500,00 ainda não foi marcado como recebido.',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 90),
        },
        {
          id: 'test-3',
          type: 'monthly_summary',
          title: 'Resumo de abril',
          body: 'Você recebeu R$ 3.200,00 e pagou R$ 2.100,00 este mês.',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25),
        },
        {
          id: 'test-4',
          type: 'negative_balance',
          title: 'Carteira Nubank negativa',
          body: 'Saldo atual: -R$ 45,00.',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 5),
        },
      ];
      setNotifications(fakeNotifications);
    });
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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

      const now = new Date();
      const candidates: Notification[] = [
        ...checkExpenseDue(transactions),
        ...checkIncomePending(transactions),
        ...checkNegativeBalance(wallets),
        buildMonthlySummary(transactions, now.getMonth() + 1, now.getFullYear()),
      ];

      const existing = await getNotifications(user.uid);

      const toSave = candidates.filter(
        (candidate) =>
          !existing.some(
            (stored) =>
              stored.type === candidate.type &&
              isSameDay(stored.createdAt, candidate.createdAt),
          ),
      );

      for (const notification of toSave) {
        await saveNotification(user.uid, notification);
      }

      if (toSave.length > 0) {
        const updated = await getNotifications(user.uid);
        setNotifications(updated);
      }
    },
    [user],
  );

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, checkAndGenerateNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
