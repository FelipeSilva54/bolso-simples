import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Bell } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';
import { Header } from '@/components/Header';
import { BalanceDisplay } from '@/components/BalanceDisplay';
import { WalletCard } from '@/components/WalletCard';
import { EmptyState } from '@/components/EmptyState';
import { FAB } from '@/components/FAB';
import { useAuth } from '@/store/AuthContext';
import { useWallets } from '@/hooks/useWallets';

export function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { wallets, loading } = useWallets();
  const [hideBalance, setHideBalance] = useState(false);

  const displayName =
    user?.isAnonymous || !user?.displayName ? 'Visitante' : user.displayName;

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="light" />

      <Header
        title={`Olá, ${displayName}`}
        variant="home"
        theme="dark"
        rightIcon={Bell}
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
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={colors.primary}
          />
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
                balance={wallet.balance}
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
    fontWeight: fw.bold,
    color: colors.content,
    paddingHorizontal: 20,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  loader: {
    flex: 1,
    marginTop: spacing.xxl,
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
