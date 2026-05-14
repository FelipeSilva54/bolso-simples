import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Dialog } from '@/components/Dialog';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Bell, Eye, EyeSlash } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Header } from '@/components/Header';
import { BalanceDisplay } from '@/components/BalanceDisplay';
import { WalletCard } from '@/components/WalletCard';
import { EmptyState } from '@/components/EmptyState';
import { FAB } from '@/components/FAB';
import { Skeleton } from '@/components/Skeleton';
import { WalletActionsSheet } from '@/components/WalletActionsSheet';
import { Toast } from '@/components/Toast';
import { useAuth } from '@/store/AuthContext';
import { useWallets } from '@/hooks/useWallets';
import { useWalletsBalance } from '@/hooks/useWalletsBalance';
import { deleteWallet } from '@/services/wallets';

type IconComponent = React.ComponentType<{ size?: number; color?: string; weight?: string }>;

type SelectedWallet = { id: string; name: string } | null;

export function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { wallets, loading } = useWallets();
  const { balanceByWallet, totalBalance } = useWalletsBalance(wallets);
  const [hideBalance, setHideBalance] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<SelectedWallet>(null);
  const [walletToDelete, setWalletToDelete] = useState<SelectedWallet>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayName =
    user?.isAnonymous || !user?.displayName ? 'Visitante' : user.displayName;

  function showToast(message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(null);
    setTimeout(() => {
      setToastMessage(message);
      toastTimerRef.current = setTimeout(() => setToastMessage(null), 2500);
    }, 50);
  }

  function handleOptionsPress(id: string, name: string) {
    setSelectedWallet({ id, name });
  }

  function handleSheetClose() {
    setSelectedWallet(null);
  }

  function handleEdit() {
    if (!selectedWallet) return;
    const { id } = selectedWallet;
    setSelectedWallet(null);
    router.push(`/(stack)/edit-wallet/${id}` as never);
  }

  function handleDeletePress() {
    if (!selectedWallet) return;
    setWalletToDelete(selectedWallet);
    setSelectedWallet(null);
  }

  async function handleDeleteConfirm() {
    if (!user || !walletToDelete) return;
    const wallet = walletToDelete;
    setWalletToDelete(null);
    try {
      await deleteWallet(user.uid, wallet.id);
      showToast('Carteira excluída');
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir a carteira. Tente novamente.');
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="light" />

      <Header
        title={`Olá, ${displayName}`}
        variant="home"
        theme="dark"
        secondaryRightIcon={(hideBalance ? EyeSlash : Eye) as IconComponent}
        onSecondaryRightPress={() => setHideBalance((h) => !h)}
        secondaryRightIconLabel={hideBalance ? 'Mostrar saldo' : 'Ocultar saldo'}
        rightIcon={Bell as IconComponent}
        onRightPress={() => router.push('/(stack)/notifications' as never)}
      />

      <BalanceDisplay
        variant="total"
        subtitle="Seu balanço total é de:"
        balance={totalBalance}
        hideBalance={hideBalance}
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
                onOptionsPress={() => handleOptionsPress(wallet.id, wallet.name)}
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

      <WalletActionsSheet
        walletId={selectedWallet?.id ?? ''}
        walletName={selectedWallet?.name ?? ''}
        isVisible={selectedWallet !== null}
        onClose={handleSheetClose}
        onEdit={handleEdit}
        onDelete={handleDeletePress}
      />

      <Dialog
        visible={walletToDelete !== null}
        title="Excluir carteira"
        description="Tem certeza? Todas as transações desta carteira também serão excluídas."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setWalletToDelete(null)}
      />

      <Toast message={toastMessage} />
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
