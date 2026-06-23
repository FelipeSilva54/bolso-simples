import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Dialog } from '@/components/Dialog';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setStatusBarStyle, setStatusBarBackgroundColor } from 'expo-status-bar';
import { useRouter, useFocusEffect } from 'expo-router';
import { Bell, Eye, EyeClosed } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Header } from '@/components/Header';
import { BalanceDisplay } from '@/components/BalanceDisplay';
import { WalletCard } from '@/components/WalletCard';
import { EmptyState } from '@/components/EmptyState';
import { FAB } from '@/components/FAB';
import { Skeleton } from '@/components/Skeleton';
import { WalletActionsSheet } from '@/components/WalletActionsSheet';
import { useAuth } from '@/store/AuthContext';
import { useNotifications } from '@/store/NotificationContext';
import { useToast } from '@/store/ToastContext';
import { useLanguage } from '@/store/LanguageContext';
import { useWallets } from '@/hooks/useWallets';
import { useWalletsBalance } from '@/hooks/useWalletsBalance';
import { deleteWallet } from '@/services/wallets';

type IconComponent = React.ComponentType<{ size?: number; color?: string; weight?: string }>;

type SelectedWallet = { id: string; name: string } | null;

export function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { unreadCount, checkAndGenerateNotifications } = useNotifications();
  const { wallets, loading } = useWallets();
  const { t } = useLanguage();

  const BellWithBadge = useMemo<IconComponent>(() => {
    return function BellWithBadgeIcon({ size, color, weight }) {
      return (
        <View>
          <Bell size={size} color={color} weight={weight as any} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
      );
    };
  }, [unreadCount]);
  const { balanceByWallet, totalBalance } = useWalletsBalance(wallets);
  const { showToast } = useToast();
  const [hideBalance, setHideBalance] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<SelectedWallet>(null);
  const [walletToDelete, setWalletToDelete] = useState<SelectedWallet>(null);
  const [deletingWallet, setDeletingWallet] = useState(false);

  // Gera notificações com saldos calculados sempre que as carteiras mudam
  useEffect(() => {
    if (loading || wallets.length === 0) return;
    const walletsWithBalance = wallets.map((w) => ({
      ...w,
      balance: balanceByWallet[w.id] ?? w.balance,
    }));
    checkAndGenerateNotifications(walletsWithBalance, []);
  }, [wallets, balanceByWallet, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  useFocusEffect(
    React.useCallback(() => {
      setStatusBarStyle('light');
      setStatusBarBackgroundColor(colors.primary, false);
    }, [])
  );

  useEffect(() => {
    if (walletToDelete === null) {
      setStatusBarStyle('light');
      setStatusBarBackgroundColor(colors.primary, false);
    }
  }, [walletToDelete]);

  const displayName =
    user?.isAnonymous || !user?.displayName ? t('common.visitor') : user.displayName;

  const handleOptionsPress = useCallback((id: string, name: string) => {
    setSelectedWallet({ id, name });
  }, []);

  const handleSheetClose = useCallback(() => {
    setSelectedWallet(null);
  }, []);

  const handleEdit = useCallback(() => {
    if (!selectedWallet) return;
    const { id } = selectedWallet;
    setSelectedWallet(null);
    router.push(`/(stack)/edit-wallet/${id}` as never);
  }, [selectedWallet, router]);

  const handleDeletePress = useCallback(() => {
    if (!selectedWallet) return;
    setWalletToDelete(selectedWallet);
    setSelectedWallet(null);
  }, [selectedWallet]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!user || !walletToDelete) return;
    setDeletingWallet(true);
    try {
      await deleteWallet(user.uid, walletToDelete.id);
      showToast(t('home.walletDeleted'));
      setWalletToDelete(null);
    } catch {
      Alert.alert(t('common.error'), t('home.walletDeleteError'));
    } finally {
      setDeletingWallet(false);
    }
  }, [user, walletToDelete, showToast, t]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <Header
        title={`${t('common.greetingPrefix')}${displayName} 👋`}
        variant="home"
        theme="dark"
        secondaryRightIcon={(hideBalance ? EyeClosed : Eye) as IconComponent}
        onSecondaryRightPress={() => setHideBalance((h) => !h)}
        secondaryRightIconLabel={hideBalance ? t('home.showBalance') : t('home.hideBalance')}
        rightIcon={BellWithBadge}
        onRightPress={() => router.push('/(stack)/notifications' as never)}
      />

      <BalanceDisplay
        variant="total"
        subtitle={t('home.totalBalance')}
        balance={totalBalance}
        hideBalance={hideBalance}
      />

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>{t('home.myWallets')}</Text>

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
            title={t('home.emptyWalletTitle')}
            subtitle={t('home.emptyWalletSubtitle')}
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {wallets.map((wallet) => (
              <WalletCard
                key={wallet.id}
                walletId={wallet.id}
                initialBalance={wallet.balance}
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
        label={t('home.addWallet')}
        onPress={() => router.push('/(stack)/add-wallet' as never)}
        accessibilityLabel={t('home.addWallet')}
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
        variant="delete"
        title={t('home.deleteWalletTitle')}
        description={t('home.deleteWalletDescription')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        loading={deletingWallet}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { if (!deletingWallet) setWalletToDelete(null); }}
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
    gap: spacing.lg,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xxl,
    right: 20,
  },
  badge: {
    position: 'absolute',
    top: -spacing.xs,
    right: -spacing.xs,
    minWidth: spacing.lg,
    height: spacing.lg,
    borderRadius: spacing.sm,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  badgeText: {
    fontSize: fs.xs,
    fontWeight: fw.bold,
    color: colors.white,
    lineHeight: spacing.lg,
  },
});
