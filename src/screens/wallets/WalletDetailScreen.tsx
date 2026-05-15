import React, { useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
  Platform,
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
import DateTimePicker from '@react-native-community/datetimepicker';
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

const BADGE_LABEL: Record<TransactionStatus, string> = {
  paid: 'Pago',
  unpaid: 'Não pago',
  received: 'Recebido',
  unreceived: 'Não recebido',
};

function getIconComponent(name: string | undefined): IconComponent {
  if (!name) return Tag as unknown as IconComponent;
  const Icon = (Phosphor as unknown as Record<string, unknown>)[name];
  return ((Icon ?? Tag) as unknown) as IconComponent;
}

function transformTransaction(t: Transaction, category?: Category): GroupTransaction {
  const icon: IconComponent = category
    ? getIconComponent(category.icon)
    : ((t.type === 'income'
        ? ArrowUp
        : t.type === 'expense'
        ? ArrowDown
        : ArrowsLeftRight) as IconComponent);

  const iconColor = category
    ? category.color
    : t.type === 'income'
    ? colors.success
    : t.type === 'expense'
    ? colors.danger
    : colors.primary;

  const amount = t.type === 'expense' ? -t.amount : t.amount;

  const badgeVariant: 'success' | 'danger' =
    t.status === 'paid' || t.status === 'received' ? 'success' : 'danger';

  return {
    id: t.id,
    icon,
    iconColor,
    title: t.title,
    description: t.description || undefined,
    amount,
    badgeVariant,
    badgeLabel: BADGE_LABEL[t.status],
    installmentIndex: t.installmentIndex,
    installmentTotal: t.installmentTotal,
  };
}

function groupByDate(
  transactions: Transaction[],
  categoriesById: Map<string, Category>,
): { date: string; transactions: GroupTransaction[] }[] {
  const map = new Map<string, { date: string; transactions: GroupTransaction[] }>();

  for (const t of transactions) {
    const d =
      t.date instanceof Date
        ? t.date
        : (t.date as unknown as { toDate: () => Date }).toDate();

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    if (!map.has(key)) {
      map.set(key, { date: formatGroupDate(d), transactions: [] });
    }
    map.get(key)!.transactions.push(
      transformTransaction(t, categoriesById.get(t.categoryId)),
    );
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, group]) => group);
}

function groupByMonth(
  transactions: Transaction[],
  categoriesById: Map<string, Category>,
): { date: string; transactions: GroupTransaction[] }[] {
  const map = new Map<string, { date: string; transactions: GroupTransaction[] }>();

  for (const t of transactions) {
    const d =
      t.date instanceof Date
        ? t.date
        : (t.date as unknown as { toDate: () => Date }).toDate();

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    if (!map.has(key)) {
      const label = `${capitalize(MONTHS[d.getMonth()])} de ${d.getFullYear()}`;
      map.set(key, { date: label, transactions: [] });
    }
    map.get(key)!.transactions.push(
      transformTransaction(t, categoriesById.get(t.categoryId)),
    );
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, group]) => group);
}

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MONTHS = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatGroupDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} de ${MONTHS[date.getMonth()]}`;
}

function formatDayLabel(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
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

  const today = new Date();
  const [period, setPeriod] = useState<Period>({
    mode: 'monthly',
    month: today.getMonth(),
    year: today.getFullYear(),
  });
  const [periodSheetVisible, setPeriodSheetVisible] = useState(false);
  const [pickerStep, setPickerStep] = useState<'none' | 'customStart' | 'customEnd'>('none');
  const [pendingCustomStart, setPendingCustomStart] = useState<Date | null>(null);

  const { showToast } = useToast();
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
  const wallet = wallets.find((w) => w.id === walletId);
  const walletList = useMemo(() => (wallet ? [wallet] : []), [wallet]);
  const { balanceByWallet } = useWalletsBalance(walletList);
  const calculatedBalance = walletId ? balanceByWallet[walletId] ?? 0 : 0;

  const { transactions, loading } = useTransactions({
    walletId: walletId ?? '',
    period,
  });

  const { categories } = useCategories();

  const categoriesById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );

  const totalIncome = transactions
    .filter((t) => t.type === 'income' && t.status === 'received')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense' && t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthBalance = totalIncome - totalExpense;

  const groupedTransactions = useMemo(
    () =>
      period.mode === 'yearly'
        ? groupByMonth(transactions, categoriesById)
        : groupByDate(transactions, categoriesById),
    [transactions, categoriesById, period.mode],
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

  const handleTodayPress = () => {
    setPeriod({
      mode: 'monthly',
      month: today.getMonth(),
      year: today.getFullYear(),
    });
  };

  const handleMonthChange = (month: number, year: number) => {
    setPeriod({ mode: 'monthly', month, year });
  };

  const handleSelectPeriodMode = (mode: PeriodMode) => {
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
      setPendingCustomStart(null);
      setPickerStep('customStart');
    }
  };

  const handleCustomDateChange = (
    event: { type?: string },
    selectedDate?: Date,
  ) => {
    if (event.type === 'dismissed' || !selectedDate) {
      setPickerStep('none');
      setPendingCustomStart(null);
      return;
    }

    if (pickerStep === 'customStart') {
      setPendingCustomStart(selectedDate);
      setPickerStep('customEnd');
    } else if (pickerStep === 'customEnd' && pendingCustomStart != null) {
      setPeriod({ mode: 'custom', start: pendingCustomStart, end: selectedDate });
      setPickerStep('none');
      setPendingCustomStart(null);
    }
  };

  const handlePrevDay = () => {
    if (period.mode !== 'daily') return;
    setPeriod({ mode: 'daily', date: addDays(period.date, -1) });
  };

  const handleNextDay = () => {
    if (period.mode !== 'daily') return;
    setPeriod({ mode: 'daily', date: addDays(period.date, 1) });
  };

  const handlePrevYear = () => {
    if (period.mode !== 'yearly') return;
    setPeriod({ mode: 'yearly', year: period.year - 1 });
  };

  const handleNextYear = () => {
    if (period.mode !== 'yearly') return;
    setPeriod({ mode: 'yearly', year: period.year + 1 });
  };

  const handleTransactionPress = (id: string) => {
    setSelectedTransactionId(id);
    setDetailSheetVisible(true);
  };

  const handleDetailClose = () => {
    setDetailSheetVisible(false);
    setSelectedTransactionId(null);
  };

  const handleStatusChange = async (id: string, newStatus: TransactionStatus) => {
    if (!user || !walletId) return;
    await updateTransaction(user.uid, walletId, id, { status: newStatus });
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="light" />

      <Header
        title={wallet?.name ?? 'Carteira'}
        variant="screen"
        theme="dark"
        showBackButton
        onBackPress={() => router.back()}
        secondaryRightIcon={(hideBalance ? EyeClosed : Eye) as IconComponent}
        onSecondaryRightPress={() => setHideBalance((v) => !v)}
        secondaryRightIconLabel={hideBalance ? 'Mostrar saldo' : 'Ocultar saldo'}
        rightIcon={CalendarBlank as IconComponent}
        onRightPress={() => setPeriodSheetVisible(true)}
      />

      <BalanceDisplay
        variant="wallet"
        subtitle="Saldo da carteira:"
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
              accessibilityLabel="Dia anterior"
              accessibilityRole="button"
            >
              <CaretLeft size={20} color={colors.subcontent} weight="bold" />
            </TouchableOpacity>
            <Text style={styles.periodNavLabel} numberOfLines={1}>
              {formatDayLabel(period.date)}
            </Text>
            <TouchableOpacity
              onPress={handleNextDay}
              style={styles.periodNavButton}
              accessibilityLabel="Próximo dia"
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
              accessibilityLabel="Ano anterior"
              accessibilityRole="button"
            >
              <CaretLeft size={20} color={colors.subcontent} weight="bold" />
            </TouchableOpacity>
            <Text style={styles.periodNavLabel}>{period.year}</Text>
            <TouchableOpacity
              onPress={handleNextYear}
              style={styles.periodNavButton}
              accessibilityLabel="Próximo ano"
              accessibilityRole="button"
            >
              <CaretRight size={20} color={colors.subcontent} weight="bold" />
            </TouchableOpacity>
          </View>
        )}

        {period.mode === 'all' && (
          <View style={styles.periodNav}>
            <Text style={styles.periodNavLabel}>Todas as transações</Text>
          </View>
        )}

        {period.mode === 'custom' && (
          <TouchableOpacity
            onPress={() => {
              setPendingCustomStart(null);
              setPickerStep('customStart');
            }}
            style={styles.periodNav}
            accessibilityLabel="Editar intervalo personalizado"
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
            onIncomePress={() =>
              router.push({
                pathname: '/(stack)/transaction-list' as never,
                params: { walletId, type: 'income' },
              })
            }
            onExpensePress={() =>
              router.push({
                pathname: '/(stack)/transaction-list' as never,
                params: { walletId, type: 'expense' },
              })
            }
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
            title="Nenhuma transação adicionada"
            subtitle="Clique no botão de + para adicionar uma receita ou despesa."
          />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            {groupedTransactions.map((group) => (
              <TransactionGroup
                key={group.date}
                date={group.date}
                transactions={group.transactions}
                onTransactionPress={handleTransactionPress}
              />
            ))}
          </ScrollView>
        )}
      </View>

      <FAB
        accessibilityLabel="Adicionar transação"
        onPress={() =>
          router.push({
            pathname: '/(stack)/add-transaction' as never,
            params: { walletId },
          })
        }
        style={{
          position: 'absolute',
          bottom: spacing.xl,
          right: spacing.lg,
        }}
      />

      <TransactionDetailSheet
        visible={detailSheetVisible}
        onClose={handleDetailClose}
        transaction={selectedTransaction}
        onDelete={async (id) => {
          if (!user || !walletId) return;
          await deleteTransaction(user.uid, walletId, id);
          handleDetailClose();
          showToast('Transação excluída com sucesso');
        }}
        onEdit={(id) => {
          handleDetailClose();
          router.push({
            pathname: '/(stack)/edit-transaction/[transactionId]' as never,
            params: { transactionId: id, walletId },
          });
        }}
        onStatusChange={handleStatusChange}
      />

      <PeriodPickerSheet
        visible={periodSheetVisible}
        onClose={() => setPeriodSheetVisible(false)}
        currentMode={period.mode}
        onSelectMode={handleSelectPeriodMode}
      />

      {pickerStep !== 'none' && (
        <DateTimePicker
          value={
            pickerStep === 'customEnd' && pendingCustomStart != null
              ? pendingCustomStart
              : new Date()
          }
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={
            pickerStep === 'customEnd' && pendingCustomStart != null
              ? pendingCustomStart
              : undefined
          }
          onChange={handleCustomDateChange}
        />
      )}
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
});