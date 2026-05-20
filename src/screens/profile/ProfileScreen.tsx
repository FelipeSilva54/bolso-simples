import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
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
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
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

  const deleteAccountDescription = user?.isAnonymous
    ? t('profile.deleteAccountDialogDescAnonymous')
    : t('profile.deleteAccountDialogDescLoggedIn');

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
    <StatusBar style="dark"/>

      <Header
        title={`${t('common.greetingPrefix')}${displayName}`}
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
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => router.push('/(stack)/edit-profile' as never)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t('profile.editProfile')}
          >
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.avatar}
                accessibilityLabel={t('profile.profilePhoto')}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{avatarInitial}</Text>
              </View>
            )}

            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1}>
                {user?.displayName ?? ''}
              </Text>
              <Text style={styles.profileEmail} numberOfLines={1}>
                {user?.email ?? ''}
              </Text>
            </View>

            <CaretRight size={16} color={colors.muted} weight="regular" />
          </TouchableOpacity>
        ) : (
          <View style={styles.profileCardAnonymous}>
            <Image
              source={require('@/assets/images/Logo-Icon.png')}
              style={styles.anonymousImage}
              resizeMode="contain"
              accessibilityLabel={t('profile.profileIllustration')}
            />
            <Button
              variant="outlined"
              onPress={loginWithGoogle}
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
          <Text style={styles.sectionLabel}>{t('profile.sectionApp')}</Text>
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
          <Text style={styles.sectionLabel}>{t('profile.sectionHelp')}</Text>
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
            onPress={() => router.push('/(stack)/rate' as never)}
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
          <Text style={styles.sectionLabel}>{t('profile.sectionOther')}</Text>
          <TouchableOpacity
            onPress={() => router.push('/(stack)/support' as never)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t('profile.support')}
            style={styles.listItem}
          >
            <HandHeart size={24} color={colors.success} weight="regular" />
            <Text style={[styles.listItemLabel, styles.listItemLabelSuccess]} numberOfLines={1}>
              {t('profile.support')}
            </Text>
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
        title={t('profile.logoutDialogTitle')}
        description={t('profile.logoutDialogDescription')}
        confirmLabel={t('profile.logoutDialogConfirm')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutDialogVisible(false)}
      />

      <Dialog
        visible={clearDataDialogVisible}
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
