import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Bell } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Header } from '@/components/Header';
import { BalanceDisplay } from '@/components/BalanceDisplay';
import { WalletCard } from '@/components/WalletCard';
import { EmptyState } from '@/components/EmptyState';
import { FAB } from '@/components/FAB';
import { Skeleton } from '@/components/Skeleton';
import { useAuth } from '@/store/AuthContext';
import { useWallets } from '@/hooks/useWallets';
import { useWalletsBalance } from '@/hooks/useWalletsBalance';

type IconComponent = React.ComponentType<{ size?: number; color?: string; weight?: string }>;

export function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { wallets, loading } = useWallets();
  const { balanceByWallet, totalBalance } = useWalletsBalance(wallets);
  const [hideBalance, setHideBalance] = useState(false);

  const displayName =
    user?.isAnonymous || !user?.displayName ? 'Visitante' : user.displayName;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="light" />

      <Header
        title={`Olá, ${displayName}`}
        variant="home"
        theme="dark"
        rightIcon={Bell as IconComponent}
        onRightPress={() => router.push('/(stack)/notifications' as never)}
      />

      <BalanceDisplay
        variant="total"
        subtitle="Seu balanço total é de:"
        balance={totalBalance}
        hideBalance={hideBalance}
        onToggleVisibility={() => setHideBalance((h) => !h)}
      />

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Minhas carteiras</Text>

        {loading ? (
          <View style={styles.skeletonList}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={styles.skeletonCard}>
                <View style={styles.skeletonCardTop}>
                  <Skeleton height={16} width="45%" borderRadius={radius.sm} />
                  <Skeleton width={36} height={36} borderRadius={radius.sm} />
                </View>
                <View style={styles.skeletonCardBottom}>
                  <Skeleton height={14} width="55%" borderRadius={radius.sm} />
                  <Skeleton height={28} width="70%" borderRadius={radius.sm} />
                </View>
              </View>
            ))}
          </View>
        ) : wallets.length === 0 ? (
          <EmptyState
            image={require('@/assets/images/Wallet.png')}
            title="Comece criando uma carteira"
            subtitle="Clique no botão abaixo para criar sua primeira carteira"
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {wallets.map((wallet) => (
              <WalletCard
                key={wallet.id}
                name={wallet.name}
                balance={balanceByWallet[wallet.id] ?? 0}
                color={wallet.color}
                hideBalance={hideBalance}
                onPress={() => router.push(`/(stack)/wallet/${wallet.id}` as never)}
                onOptionsPress={() => {}}
              />
            ))}
          </ScrollView>
        )}
      </View>

      <FAB
        label="Adicionar carteira"
        onPress={() => router.push('/(stack)/add-wallet' as never)}
        accessibilityLabel="Adicionar carteira"
        style={styles.fab}
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
  sectionTitle: {
    fontSize: fs.lg,
    fontWeight: fw.semibold,
    color: colors.content,
    paddingHorizontal: 20,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  skeletonList: {
    paddingHorizontal: 20,
    gap: spacing.md,
  },
  skeletonCard: {
    borderRadius: radius.md,
    backgroundColor: colors.borderLight,
    padding: 20,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  skeletonCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  skeletonCardBottom: {
    gap: spacing.xs,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: spacing.xxxl + spacing.xxl,
    gap: spacing.md,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xxl,
    right: 20,
  },
});
