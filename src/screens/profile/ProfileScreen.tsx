import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Linking,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setStatusBarStyle } from 'expo-status-bar';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  Bell,
  List,
  Heart,
  HandHeart,
  Info,
  ShareNetwork,
  Star,
  CaretRight,
  BroomIcon,
  TrashIcon,
  SignOutIcon,
} from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { ListItem } from '@/components/ListItem';
import { Dialog } from '@/components/Dialog';
import { useAuth } from '@/store/AuthContext';
import { useNotifications } from '@/store/NotificationContext';
import { useToast } from '@/store/ToastContext';
import { useLanguage } from '@/store/LanguageContext';
import { clearAllUserData } from '@/services/wallets';

type IconComponent = React.ComponentType<{ size?: number; color?: string; weight?: string }>;

export function ProfileScreen() {
  const router = useRouter();
  const { user, loginWithGoogle, logout, deleteAccount } = useAuth();
  const { unreadCount } = useNotifications();
  const { t } = useLanguage();

  const BellWithBadge = useMemo<IconComponent>(() => {
    return function BellWithBadgeIcon({ size, color, weight }) {
      return (
        <View>
          <Bell size={size} color={color} weight={weight as any} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <AppText style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </AppText>
            </View>
          )}
        </View>
      );
    };
  }, [unreadCount]);
  const { showToast } = useToast();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [clearDataDialogVisible, setClearDataDialogVisible] = useState(false);
  const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      showToast(err?.message ?? t('login.googleErrorGeneric'), 'error');
    } finally {
      setLoadingGoogle(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setStatusBarStyle('dark');
    }, [])
  );

  const displayName =
    user?.isAnonymous || !user?.displayName ? t('common.visitor') : user.displayName;
  const avatarInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : 'V';

  const handleLogout = () => setLogoutDialogVisible(true);

  const handleConfirmLogout = () => {
    setLogoutDialogVisible(false);
    logout();
  };

  const handleClearHistory = () => setClearDataDialogVisible(true);

  const handleConfirmClearData = async () => {
    if (!user) return;
    setClearing(true);
    try {
      await clearAllUserData(user.uid);
      setClearDataDialogVisible(false);
      setClearing(false);
      router.replace('/(tabs)');
      showToast(t('profile.clearDataSuccess'));
    } catch {
      showToast(t('profile.clearDataError'), 'error');
      setClearing(false);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      setDeleteAccountVisible(false);
    } catch {
      showToast(t('profile.deleteAccountError'), 'error');
      setDeleting(false);
    }
  };

  const handleShare = async () => {
    await Share.share({ message: t('profile.shareMessage') });
  };

  const handleRate = async () => {
    const marketUrl = 'market://details?id=com.bolsosimples.app';
    const webUrl = 'https://play.google.com/store/apps/details?id=com.bolsosimples.app';
    try {
      const supported = await Linking.canOpenURL(marketUrl);
      await Linking.openURL(supported ? marketUrl : webUrl);
    } catch {
      await Linking.openURL(webUrl).catch(() => {});
    }
  };

  const deleteAccountDescription = user?.isAnonymous
    ? t('profile.deleteAccountDialogDescAnonymous')
    : t('profile.deleteAccountDialogDescLoggedIn');

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <Header
        title={`${t('common.greetingPrefix')}${displayName} 👋`}
        variant="home"
        theme="light"
        rightIcon={BellWithBadge}
        onRightPress={() => router.push('/(stack)/notifications' as never)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Card de perfil */}
        {!user?.isAnonymous ? (
          <View style={styles.profileCard}>
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.avatar}
                accessibilityLabel={t('profile.profilePhoto')}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <AppText style={styles.avatarInitial}>{avatarInitial}</AppText>
              </View>
            )}

            <View style={styles.profileInfo}>
              <AppText style={styles.profileName} numberOfLines={1}>
                {user?.displayName ?? ''}
              </AppText>
              <AppText style={styles.profileEmail} numberOfLines={1}>
                {user?.email ?? ''}
              </AppText>
            </View>
          </View>
        ) : (
          <View style={styles.profileCardAnonymous}>
            <Image
              source={require('@/assets/images/Logo-Icon.png')}
              style={styles.anonymousImage}
              resizeMode="contain"
              accessibilityLabel={t('profile.profileIllustration')}
            />
            <Button
              variant="soft"
              onPress={handleGoogleSignIn}
              loading={loadingGoogle}
              style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight }}
              leftIcon={
                <Image
                  source={require('@/assets/images/Logo-Google.png')}
                  style={styles.googleLogo}
                  accessibilityLabel={t('common.googleLogo')}
                />
              }
            >
              {t('profile.loginWithGoogle')}
            </Button>
          </View>
        )}

        {/* Seção: Seu app */}
        <View>
          <AppText style={styles.sectionLabel}>{t('profile.sectionApp')}</AppText>
          <ListItem
            icon={List as IconComponent}
            label={t('profile.categories')}
            onPress={() => router.push('/(stack)/categories' as never)}
            accessibilityLabel={t('profile.categories')}
          />
          <ListItem
            icon={Heart as IconComponent}
            label={t('profile.preferences')}
            onPress={() => router.push('/(stack)/preferences' as never)}
            accessibilityLabel={t('profile.preferences')}
          />
        </View>

        {/* Seção: Informações e ajuda */}
        <View>
          <AppText style={styles.sectionLabel}>{t('profile.sectionHelp')}</AppText>
          <ListItem
            icon={Info as IconComponent}
            label={t('profile.about')}
            onPress={() => router.push('/(stack)/about' as never)}
            accessibilityLabel={t('profile.about')}
          />
          <ListItem
            icon={ShareNetwork as IconComponent}
            label={t('profile.share')}
            onPress={handleShare}
            accessibilityLabel={t('profile.share')}
          />
          <ListItem
            icon={Star as IconComponent}
            label={t('profile.rate')}
            onPress={handleRate}
            accessibilityLabel={t('profile.rate')}
          />
          <ListItem
            icon={SignOutIcon as IconComponent}
            label={t('profile.logout')}
            onPress={handleLogout}
            accessibilityLabel={t('profile.logout')}
          />
        </View>

        {/* Seção: Outros */}
        <View>
          <AppText style={styles.sectionLabel}>{t('profile.sectionOther')}</AppText>
          <TouchableOpacity
            onPress={() => router.push('/(stack)/support' as never)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t('profile.support')}
            style={styles.listItem}
          >
            <HandHeart size={24} color={colors.success} weight="regular" />
            <AppText style={[styles.listItemLabel, styles.listItemLabelSuccess]} numberOfLines={1}>
              {t('profile.support')}
            </AppText>
            <CaretRight size={16} color={colors.muted} weight="regular" />
          </TouchableOpacity>
          <ListItem
            icon={BroomIcon as IconComponent}
            label={t('profile.clearData')}
            onPress={handleClearHistory}
            accessibilityLabel={t('profile.clearData')}
          />
          <ListItem
            icon={TrashIcon as IconComponent}
            label={t('profile.deleteAccount')}
            onPress={() => setDeleteAccountVisible(true)}
            accessibilityLabel={t('profile.deleteAccount')}
            color={colors.danger}
          />
        </View>
      </ScrollView>

      <Dialog
        visible={logoutDialogVisible}
        variant="disconnect"
        title={t('profile.logoutDialogTitle')}
        description={t('profile.logoutDialogDescription')}
        confirmLabel={t('profile.logoutDialogConfirm')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutDialogVisible(false)}
      />

      <Dialog
        visible={clearDataDialogVisible}
        variant="clear"
        title={t('profile.clearDataDialogTitle')}
        description={t('profile.clearDataDialogDescription')}
        confirmLabel={t('profile.clearDataDialogConfirm')}
        cancelLabel={t('common.cancel')}
        requireConfirmation={true}
        confirmationLabel={t('common.confirmAware')}
        loading={clearing}
        onConfirm={handleConfirmClearData}
        onCancel={() => setClearDataDialogVisible(false)}
      />

      <Dialog
        visible={deleteAccountVisible}
        variant="delete"
        title={t('profile.deleteAccountDialogTitle')}
        description={deleteAccountDescription}
        confirmLabel={t('profile.deleteAccountDialogConfirm')}
        cancelLabel={t('common.cancel')}
        requireConfirmation={true}
        confirmationLabel={t('common.confirmAware')}
        loading={deleting}
        onConfirm={handleConfirmDeleteAccount}
        onCancel={() => setDeleteAccountVisible(false)}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },

  scrollView: {
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  profileCard: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: fs.lg,
    fontWeight: fw.bold,
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  profileName: {
    fontSize: fs.md,
    fontWeight: fw.semibold,
    color: colors.content,
  },
  profileEmail: {
    fontSize: fs.sm,
    color: colors.subcontent,
  },
  profileCardAnonymous: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  anonymousImage: {
    alignSelf: 'center',
    width: 100,
    height: 100,
  },
  googleLogo: {
    width: 20,
    height: 20,
  },
  sectionLabel: {
    fontSize: fs.sm,
    fontWeight: fw.regular,
    color: colors.subcontent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    gap: spacing.lg,
  },
  listItemLabel: {
    flex: 1,
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.content,
  },
  listItemLabelSuccess: {
    color: colors.success,
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
