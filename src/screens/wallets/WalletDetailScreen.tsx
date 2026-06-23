import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Animated,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  CalendarBlank,
  ArrowUp,
  ArrowDown,
  ArrowsLeftRight,
  Tag,
  CaretLeft,
  CaretRight,
  Eye,
  EyeClosed,
} from 'phosphor-react-native';
import * as Phosphor from 'phosphor-react-native';
import { DateRangePicker } from '@/components/DateRangePicker';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Header } from '@/components/Header';
import { Skeleton } from '@/components/Skeleton';
import { BalanceDisplay } from '@/components/BalanceDisplay';
import { MonthFilter } from '@/components/MonthFilter';
import { SummaryCard } from '@/components/SummaryCard';
import { TransactionGroup } from '@/components/TransactionGroup';
import { TransactionDetailSheet } from '@/components/TransactionDetailSheet';
import { PeriodPickerSheet } from '@/components/PeriodPickerSheet';
import { EmptyState } from '@/components/EmptyState';
import { FAB } from '@/components/FAB';
import { useAuth } from '@/store/AuthContext';
import { useWallets } from '@/hooks/useWallets';
import { useWalletsBalance } from '@/hooks/useWalletsBalance';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { updateTransaction, deleteTransaction } from '@/services/transactions';
import { useToast } from '@/store/ToastContext';
import { useLanguage } from '@/store/LanguageContext';
import { Transaction, TransactionStatus } from '@/types/transaction';
import { Category } from '@/types/category';
import { Period, PeriodMode } from '@/types/period';

type IconComponent = React.ComponentType<{ size?: number; color?: string; weight?: string }>;

type GroupTransaction = {
  id: string;
  icon: IconComponent;
  iconColor: string;
  title: string;
  description?: string;
  amount: number;
  badgeVariant: 'danger' | 'success' | 'info';
  badgeLabel: string;
  installmentIndex?: number;
  installmentTotal?: number;
};


function getIconComponent(name: string | undefined): IconComponent {
  if (!name) return Tag as unknown as IconComponent;
  const Icon = (Phosphor as unknown as Record<string, unknown>)[name];
  return ((Icon ?? Tag) as unknown) as IconComponent;
}

function transformTransaction(
  tx: Transaction,
  category?: Category,
  badgeLabels?: Record<TransactionStatus, string>,
): GroupTransaction {
  const icon: IconComponent = category
    ? getIconComponent(category.icon)
    : ((tx.type === 'income'
        ? ArrowUp
        : tx.type === 'expense'
        ? ArrowDown
        : ArrowsLeftRight) as IconComponent);

  const iconColor = category
    ? category.color
    : tx.type === 'income'
    ? colors.success
    : tx.type === 'expense'
    ? colors.danger
    : colors.primary;

  const amount = tx.type === 'expense' ? -tx.amount : tx.amount;

  const badgeVariant: 'success' | 'danger' =
    tx.status === 'paid' || tx.status === 'received' ? 'success' : 'danger';

  return {
    id: tx.id,
    icon,
    iconColor,
    title: tx.title,
    description: tx.description || undefined,
    amount,
    badgeVariant,
    badgeLabel: badgeLabels ? badgeLabels[tx.status] : tx.status,
    installmentIndex: tx.installmentIndex,
    installmentTotal: tx.installmentTotal,
  };
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatGroupDate(date: Date, weekdays: string[], months: string[]): string {
  return `${weekdays[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
}

function formatDayLabel(date: Date, weekdays: string[], months: string[]): string {
  return `${weekdays[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

function groupByDate(
  transactions: Transaction[],
  categoriesById: Map<string, Category>,
  weekdays: string[],
  months: string[],
  badgeLabels: Record<TransactionStatus, string>,
): { date: string; transactions: GroupTransaction[] }[] {
  const map = new Map<string, { date: string; transactions: GroupTransaction[] }>();

  for (const tx of transactions) {
    const d =
      tx.date instanceof Date
        ? tx.date
        : (tx.date as unknown as { toDate: () => Date }).toDate();

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    if (!map.has(key)) {
      map.set(key, { date: formatGroupDate(d, weekdays, months), transactions: [] });
    }
    map.get(key)!.transactions.push(
      transformTransaction(tx, categoriesById.get(tx.categoryId), badgeLabels),
    );
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, group]) => group);
}

function groupByMonth(
  transactions: Transaction[],
  categoriesById: Map<string, Category>,
  months: string[],
  badgeLabels: Record<TransactionStatus, string>,
): { date: string; transactions: GroupTransaction[] }[] {
  const map = new Map<string, { date: string; transactions: GroupTransaction[] }>();

  for (const tx of transactions) {
    const d =
      tx.date instanceof Date
        ? tx.date
        : (tx.date as unknown as { toDate: () => Date }).toDate();

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    if (!map.has(key)) {
      const label = `${capitalize(months[d.getMonth()])} de ${d.getFullYear()}`;
      map.set(key, { date: label, transactions: [] });
    }
    map.get(key)!.transactions.push(
      transformTransaction(tx, categoriesById.get(tx.categoryId), badgeLabels),
    );
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, group]) => group);
}

function formatShortDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}/${m}/${date.getFullYear()}`;
}

function toJsDate(date: Date | { toDate: () => Date }): Date {
  return date instanceof Date ? date : date.toDate();
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function WalletDetailScreen() {
  const router = useRouter();
  const { walletId } = useLocalSearchParams<{ walletId: string }>();
  const { user } = useAuth();
  const [hideBalance, setHideBalance] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const today = useRef(new Date()).current;
  const [period, setPeriod] = useState<Period>({
    mode: 'monthly',
    month: today.getMonth(),
    year: today.getFullYear(),
  });
  const [debouncedPeriod, setDebouncedPeriod] = useState<Period>(period);
  const periodDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (periodDebounceRef.current) clearTimeout(periodDebounceRef.current);
    periodDebounceRef.current = setTimeout(() => {
      setDebouncedPeriod(period);
    }, 300);
    return () => {
      if (periodDebounceRef.current) clearTimeout(periodDebounceRef.current);
    };
  }, [period]);
  const [periodSheetVisible, setPeriodSheetVisible] = useState(false);
  const [dateRangePickerVisible, setDateRangePickerVisible] = useState(false);

  const { showToast } = useToast();
  const { t } = useLanguage();

  const weekdays = useMemo(() => [
    t('date.weekdays.sun'), t('date.weekdays.mon'), t('date.weekdays.tue'),
    t('date.weekdays.wed'), t('date.weekdays.thu'), t('date.weekdays.fri'),
    t('date.weekdays.sat'),
  ], [t]);

  const months = useMemo(() => [
    t('date.months.jan'), t('date.months.feb'), t('date.months.mar'), t('date.months.apr'),
    t('date.months.may'), t('date.months.jun'), t('date.months.jul'), t('date.months.aug'),
    t('date.months.sep'), t('date.months.oct'), t('date.months.nov'), t('date.months.dec'),
  ], [t]);

  const badgeLabels = useMemo<Record<TransactionStatus, string>>(() => ({
    paid: t('common.paid'),
    unpaid: t('common.notPaid'),
    received: t('common.received'),
    unreceived: t('common.notReceived'),
  }), [t]);

  const [detailSheetVisible, setDetailSheetVisible] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  const prevPeriodRef = useRef<() => void>(() => {});
  const nextPeriodRef = useRef<() => void>(() => {});

  prevPeriodRef.current = () => {
    if (period.mode === 'monthly') {
      const newMonth = period.month === 0 ? 11 : period.month - 1;
      const newYear = period.month === 0 ? period.year - 1 : period.year;
      setPeriod({ mode: 'monthly', month: newMonth, year: newYear });
    } else if (period.mode === 'daily') {
      setPeriod({ mode: 'daily', date: addDays(period.date, -1) });
    } else if (period.mode === 'yearly') {
      setPeriod({ mode: 'yearly', year: period.year - 1 });
    }
  };

  nextPeriodRef.current = () => {
    if (period.mode === 'monthly') {
      const newMonth = period.month === 11 ? 0 : period.month + 1;
      const newYear = period.month === 11 ? period.year + 1 : period.year;
      setPeriod({ mode: 'monthly', month: newMonth, year: newYear });
    } else if (period.mode === 'daily') {
      setPeriod({ mode: 'daily', date: addDays(period.date, 1) });
    } else if (period.mode === 'yearly') {
      setPeriod({ mode: 'yearly', year: period.year + 1 });
    }
  };

  const swipePanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.5,
      onPanResponderRelease: (_, { dx, vx }) => {
        if (Math.abs(dx) < 40 && Math.abs(vx) < 0.3) return;
        if (dx > 0) prevPeriodRef.current();
        else nextPeriodRef.current();
      },
    }),
  ).current;

  const { wallets } = useWallets();
  const wallet = useMemo(() => wallets.find((w) => w.id === walletId), [wallets, walletId]);
  const walletList = useMemo(() => (wallet ? [wallet] : []), [wallet]);
  const { balanceByWallet } = useWalletsBalance(walletList, { enabled: ready });
  const calculatedBalance = walletId ? balanceByWallet[walletId] ?? 0 : 0;

  const { transactions, loading } = useTransactions({
    walletId: walletId ?? '',
    period: debouncedPeriod,
    enabled: ready,
  });

  const { categories } = useCategories();

  const categoriesById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );

  const { totalIncome, totalExpense, monthBalance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const tx of transactions) {
      if (tx.type === 'income' && tx.status === 'received') income += tx.amount;
      else if (tx.type === 'expense' && tx.status === 'paid') expense += tx.amount;
    }
    return { totalIncome: income, totalExpense: expense, monthBalance: income - expense };
  }, [transactions]);

  const groupedTransactions = useMemo(
    () =>
      period.mode === 'yearly'
        ? groupByMonth(transactions, categoriesById, months, badgeLabels)
        : groupByDate(transactions, categoriesById, weekdays, months, badgeLabels),
    [transactions, categoriesById, period.mode, weekdays, months, badgeLabels],
  );

  const selectedTransaction = useMemo(() => {
    const t = transactions.find((t) => t.id === selectedTransactionId);
    if (!t) return null;
    const category = categoriesById.get(t.categoryId);
    return {
      id: t.id,
      title: t.title,
      description: t.description || undefined,
      amount: t.amount,
      type: t.type as 'expense' | 'income',
      status: t.status,
      date: toJsDate(t.date as Date | { toDate: () => Date }),
      isRecurring: t.isRecurring,
      icon: getIconComponent(category?.icon),
      iconColor: category?.color ?? colors.primary,
      installmentIndex: t.installmentIndex,
      installmentTotal: t.installmentTotal,
    };
  }, [selectedTransactionId, transactions, categoriesById]);

  const handleTodayPress = useCallback(() => {
    setPeriod({
      mode: 'monthly',
      month: today.getMonth(),
      year: today.getFullYear(),
    });
  }, [today]);

  const handleMonthChange = useCallback((month: number, year: number) => {
    setPeriod({ mode: 'monthly', month, year });
  }, []);

  const handleSelectPeriodMode = useCallback((mode: PeriodMode) => {
    setPeriodSheetVisible(false);
    if (mode === 'monthly') {
      setPeriod({ mode: 'monthly', month: today.getMonth(), year: today.getFullYear() });
    } else if (mode === 'daily') {
      setPeriod({ mode: 'daily', date: today });
    } else if (mode === 'yearly') {
      setPeriod({ mode: 'yearly', year: today.getFullYear() });
    } else if (mode === 'all') {
      setPeriod({ mode: 'all' });
    } else if (mode === 'custom') {
      setDateRangePickerVisible(true);
    }
  }, [today]);

  const handleCustomRangeConfirm = useCallback((start: Date, end: Date) => {
    setPeriod({ mode: 'custom', start, end });
  }, []);

  const handlePrevDay = useCallback(() => {
    setPeriod((p) => {
      if (p.mode !== 'daily') return p;
      return { mode: 'daily', date: addDays(p.date, -1) };
    });
  }, []);

  const handleNextDay = useCallback(() => {
    setPeriod((p) => {
      if (p.mode !== 'daily') return p;
      return { mode: 'daily', date: addDays(p.date, 1) };
    });
  }, []);

  const handlePrevYear = useCallback(() => {
    setPeriod((p) => {
      if (p.mode !== 'yearly') return p;
      return { mode: 'yearly', year: p.year - 1 };
    });
  }, []);

  const handleNextYear = useCallback(() => {
    setPeriod((p) => {
      if (p.mode !== 'yearly') return p;
      return { mode: 'yearly', year: p.year + 1 };
    });
  }, []);

  const handleTransactionPress = useCallback((id: string) => {
    setSelectedTransactionId(id);
    setDetailSheetVisible(true);
  }, []);

  const renderTransactionGroup = useCallback(({ item }: { item: (typeof groupedTransactions)[0] }) => (
    <TransactionGroup
      date={item.date}
      transactions={item.transactions}
      onTransactionPress={handleTransactionPress}
    />
  ), [handleTransactionPress]);

  const handleDetailClose = useCallback(() => {
    setDetailSheetVisible(false);
    setSelectedTransactionId(null);
  }, []);

  const handleStatusChange = useCallback(async (id: string, newStatus: TransactionStatus) => {
    if (!user || !walletId) return;
    try {
      await updateTransaction(user.uid, walletId, id, { status: newStatus });
    } catch {
      showToast(t('common.error'), 'error');
    }
  }, [user, walletId, showToast, t]);

  const handleDeleteTransaction = useCallback(async (id: string) => {
    if (!user || !walletId) return;
    try {
      await deleteTransaction(user.uid, walletId, id);
      handleDetailClose();
      showToast(t('wallet.transactionDeleted'));
    } catch {
      showToast(t('common.error'), 'error');
    }
  }, [user, walletId, handleDetailClose, showToast, t]);

  const handleEditTransaction = useCallback((id: string) => {
    handleDetailClose();
    router.push({
      pathname: '/(stack)/edit-transaction/[transactionId]' as never,
      params: { transactionId: id, walletId },
    });
  }, [handleDetailClose, router, walletId]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="light" />

      <Header
        title={wallet?.name ?? t('wallet.fallbackName')}
        variant="screen"
        theme="dark"
        showBackButton
        onBackPress={() => router.back()}
        secondaryRightIcon={(hideBalance ? EyeClosed : Eye) as IconComponent}
        onSecondaryRightPress={() => setHideBalance((v) => !v)}
        secondaryRightIconLabel={hideBalance ? t('wallet.showBalance') : t('wallet.hideBalance')}
        rightIcon={CalendarBlank as IconComponent}
        onRightPress={() => setPeriodSheetVisible(true)}
      />

      <BalanceDisplay
        variant="wallet"
        subtitle={t('wallet.balanceSubtitle')}
        balance={calculatedBalance}
        hideBalance={hideBalance}
        onTodayPress={handleTodayPress}
      />

      <View style={styles.body} {...swipePanResponder.panHandlers}>
        {period.mode === 'monthly' && (
          <MonthFilter
            activeMonth={period.month}
            activeYear={period.year}
            onChange={handleMonthChange}
          />
        )}

        {period.mode === 'daily' && (
          <View style={styles.periodNav}>
            <TouchableOpacity
              onPress={handlePrevDay}
              style={styles.periodNavButton}
              accessibilityLabel={t('wallet.previousDay')}
              accessibilityRole="button"
            >
              <CaretLeft size={20} color={colors.subcontent} weight="bold" />
            </TouchableOpacity>
            <Text style={styles.periodNavLabel} numberOfLines={1}>
              {formatDayLabel(period.date, weekdays, months)}
            </Text>
            <TouchableOpacity
              onPress={handleNextDay}
              style={styles.periodNavButton}
              accessibilityLabel={t('wallet.nextDay')}
              accessibilityRole="button"
            >
              <CaretRight size={20} color={colors.subcontent} weight="bold" />
            </TouchableOpacity>
          </View>
        )}

        {period.mode === 'yearly' && (
          <View style={styles.periodNav}>
            <TouchableOpacity
              onPress={handlePrevYear}
              style={styles.periodNavButton}
              accessibilityLabel={t('wallet.previousYear')}
              accessibilityRole="button"
            >
              <CaretLeft size={20} color={colors.subcontent} weight="bold" />
            </TouchableOpacity>
            <Text style={styles.periodNavLabel}>{period.year}</Text>
            <TouchableOpacity
              onPress={handleNextYear}
              style={styles.periodNavButton}
              accessibilityLabel={t('wallet.nextYear')}
              accessibilityRole="button"
            >
              <CaretRight size={20} color={colors.subcontent} weight="bold" />
            </TouchableOpacity>
          </View>
        )}

        {period.mode === 'all' && (
          <View style={styles.periodNav}>
            <Text style={styles.periodNavLabel}>{t('wallet.allTransactions')}</Text>
          </View>
        )}

        {period.mode === 'custom' && (
          <TouchableOpacity
            onPress={() => setDateRangePickerVisible(true)}
            style={styles.periodNav}
            accessibilityLabel={t('wallet.editCustomRange')}
            accessibilityRole="button"
          >
            <Text style={styles.periodNavLabel} numberOfLines={1}>
              {formatShortDate(period.start)}  →  {formatShortDate(period.end)}
            </Text>
          </TouchableOpacity>
        )}

        {/* SummaryCard com sombra animada baseada no scrollY */}
        <Animated.View style={[
          styles.summaryRow,
          {
            shadowColor: colors.content,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: scrollY.interpolate({
              inputRange: [0, 20],
              outputRange: [0, 0.1],
              extrapolate: 'clamp',
            }),
            shadowRadius: 4,
            elevation: scrollY.interpolate({
              inputRange: [0, 20],
              outputRange: [0, 4],
              extrapolate: 'clamp',
            }),
            zIndex: 1,
          }
        ]}>
          <SummaryCard
            income={totalIncome}
            expense={totalExpense}
            balance={monthBalance}
            hideBalance={hideBalance}
          />
        </Animated.View>

        {loading ? (
          <View style={styles.skeletonContainer}>
            {[0, 1].map((g) => (
              <View key={g} style={styles.skeletonGroup}>
                <View style={styles.skeletonDateHeader}>
                  <Skeleton height={12} width="40%" borderRadius={radius.sm} />
                </View>
                {[0, 1, 2].map((r) => (
                  <View key={r} style={styles.skeletonRow}>
                    <Skeleton width={36} height={36} borderRadius={radius.full} />
                    <View style={styles.skeletonRowInfo}>
                      <Skeleton height={16} width="50%" borderRadius={radius.sm} />
                      <Skeleton height={12} width="35%" borderRadius={radius.sm} />
                    </View>
                    <View style={styles.skeletonRowRight}>
                      <Skeleton height={16} width={60} borderRadius={radius.sm} />
                      <Skeleton height={20} width={48} borderRadius={radius.full} />
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : transactions.length === 0 ? (
          <EmptyState
            image={require('@/assets/images/MobilePay.png')}
            title={t('wallet.emptyTitle')}
            subtitle={t('wallet.emptySubtitle')}
          />
        ) : (
          <FlatList
            data={groupedTransactions}
            keyExtractor={(item) => item.date}
            renderItem={renderTransactionGroup}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            removeClippedSubviews={true}
            initialNumToRender={8}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        )}
      </View>

      <FAB
        accessibilityLabel={t('wallet.addTransactionFab')}
        onPress={() =>
          router.push({
            pathname: '/(stack)/add-transaction' as never,
            params: { walletId },
          })
        }
        style={styles.fab}
      />

      <TransactionDetailSheet
        visible={detailSheetVisible}
        onClose={handleDetailClose}
        transaction={selectedTransaction}
        onDelete={handleDeleteTransaction}
        onEdit={handleEditTransaction}
        onStatusChange={handleStatusChange}
      />

      <PeriodPickerSheet
        visible={periodSheetVisible}
        onClose={() => setPeriodSheetVisible(false)}
        currentMode={period.mode}
        onSelectMode={handleSelectPeriodMode}
      />

      <DateRangePicker
        visible={dateRangePickerVisible}
        onClose={() => setDateRangePickerVisible(false)}
        onConfirm={handleCustomRangeConfirm}
        initialStartDate={period.mode === 'custom' ? period.start : undefined}
        initialEndDate={period.mode === 'custom' ? period.end : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
  },
  summaryRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.offwhite,
    backgroundColor: colors.background,
  },
  periodNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  periodNavButton: {
    padding: spacing.xs,
  },
  periodNavLabel: {
    flex: 1,
    fontSize: fs.sm,
    fontWeight: fw.medium,
    color: colors.content,
    textAlign: 'center',
  },
  skeletonContainer: {
    flex: 1,
  },
  skeletonGroup: {
    backgroundColor: colors.white,
    marginTop: spacing.xl,
  },
  skeletonDateHeader: {
    paddingHorizontal: 20,
    paddingVertical: spacing.md,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: 20,
    gap: spacing.lg,
  },
  skeletonRowInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  skeletonRowRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  list: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
  },
});