import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CalendarBlank, ArrowUp, ArrowDown, ArrowsLeftRight, Tag } from 'phosphor-react-native';
import * as Phosphor from 'phosphor-react-native';
import { colors, spacing } from '@/constants';
import { Header } from '@/components/Header';
import { BalanceDisplay } from '@/components/BalanceDisplay';
import { MonthFilter } from '@/components/MonthFilter';
import { SummaryCard } from '@/components/SummaryCard';
import { TransactionGroup } from '@/components/TransactionGroup';
import { TransactionDetailSheet } from '@/components/TransactionDetailSheet';
import { EmptyState } from '@/components/EmptyState';
import { FAB } from '@/components/FAB';
import { useWallets } from '@/hooks/useWallets';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { Transaction, TransactionStatus } from '@/types/transaction';
import { Category } from '@/types/category';

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

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MONTHS = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

function formatGroupDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} de ${MONTHS[date.getMonth()]}`;
}

function toJsDate(date: Date | { toDate: () => Date }): Date {
  return date instanceof Date ? date : date.toDate();
}

export function WalletDetailScreen() {
  const router = useRouter();
  const { walletId } = useLocalSearchParams<{ walletId: string }>();
  const [hideBalance, setHideBalance] = useState(false);

  const today = new Date();
  const [activeYear, setActiveYear] = useState(today.getFullYear());
  const [activeMonth, setActiveMonth] = useState(today.getMonth());

  const [detailSheetVisible, setDetailSheetVisible] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  const { wallets } = useWallets();
  const wallet = wallets.find((w) => w.id === walletId);

  const { transactions, loading } = useTransactions({
    walletId: walletId ?? '',
    month: activeMonth,
    year: activeYear,
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
    () => groupByDate(transactions, categoriesById),
    [transactions, categoriesById],
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
    };
  }, [selectedTransactionId, transactions, categoriesById]);

  const handleTodayPress = () => {
    setActiveMonth(today.getMonth());
    setActiveYear(today.getFullYear());
  };

  const handleMonthChange = (month: number, year: number) => {
    setActiveMonth(month);
    setActiveYear(year);
  };

  const handleTransactionPress = (id: string) => {
    setSelectedTransactionId(id);
    setDetailSheetVisible(true);
  };

  const handleDetailClose = () => {
    setDetailSheetVisible(false);
    setSelectedTransactionId(null);
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
        rightIcon={CalendarBlank as IconComponent}
        onRightPress={() => {
          // TODO: abrir filtro por data
        }}
      />

      <BalanceDisplay
        variant="wallet"
        subtitle="Saldo da carteira:"
        balance={wallet?.balance ?? 0}
        hideBalance={hideBalance}
        onToggleVisibility={() => setHideBalance((v) => !v)}
        onTodayPress={handleTodayPress}
      />

      <View style={styles.body}>
        <MonthFilter
          activeMonth={activeMonth}
          activeYear={activeYear}
          onChange={handleMonthChange}
        />

        <View style={styles.summaryRow}>
          <SummaryCard
            label="Receitas"
            value={totalIncome}
            variant="income"
            hideBalance={hideBalance}
            onPress={() =>
              router.push({
                pathname: '/(stack)/transaction-list' as never,
                params: { walletId, type: 'income', month: activeMonth, year: activeYear },
              })
            }
          />
          <SummaryCard
            label="Despesas"
            value={totalExpense}
            variant="expense"
            hideBalance={hideBalance}
            onPress={() =>
              router.push({
                pathname: '/(stack)/transaction-list' as never,
                params: { walletId, type: 'expense', month: activeMonth, year: activeYear },
              })
            }
          />
          <SummaryCard
            label="Saldo"
            value={monthBalance}
            variant="balance"
            hideBalance={hideBalance}
          />
        </View>

        {loading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator color={colors.primary} />
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
        onDelete={(id) => {
          // TODO: implementar exclusão
        }}
        onEdit={(id) => {
          // TODO: implementar edição
        }}
        onStatusChange={(id, newStatus) => {
          // TODO: implementar atualização de status
        }}
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
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingBottom: 100,
  },
});