import React, { useState } from 'react';
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
import { Toast } from '@/components/Toast';
import { clearAllUserData } from '@/services/wallets';

type IconComponent = React.ComponentType<{ size?: number; color?: string; weight?: string }>;

export function ProfileScreen() {
  const router = useRouter();
  const { user, loginWithGoogle, logout, deleteAccount } = useAuth();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [clearDataDialogVisible, setClearDataDialogVisible] = useState(false);
  const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');
  const [clearing, setClearing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setStatusBarStyle('dark');
    }, [])
  );

  const displayName =
    user?.isAnonymous || !user?.displayName ? 'Visitante' : user.displayName;
  const avatarInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : 'V';

  const handleLogout = () => setLogoutDialogVisible(true);

  const handleClearHistory = () => setClearDataDialogVisible(true);

  const handleConfirmClearData = async () => {
    if (!user) return;
    setClearing(true);
    try {
      await clearAllUserData(user.uid);
      setClearDataDialogVisible(false);
      setToastMessage('Histórico apagado com sucesso');
      setToastVariant('success');
      setTimeout(() => {
        router.replace('/(tabs)');
        setToastMessage(null);
      }, 1000);
    } catch {
      setToastMessage('Não foi possível apagar os dados. Tente novamente.');
      setToastVariant('error');
      setClearing(false);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
    } catch {
      setToastMessage('Não foi possível excluir a conta. Tente novamente.');
      setToastVariant('error');
      setDeleting(false);
    }
  };

  const handleShare = async () => {
    await Share.share({
      message:
        'Conheça o Bolso Simples, o app de finanças 100% brasileiro, gratuito e sem anúncios!',
    });
  };

  const deleteAccountDescription = user?.isAnonymous
    ? 'Ao excluir sua conta, todos os seus dados — carteiras, transações e categorias — serão apagados permanentemente. Como você está no modo sem cadastro, não há como recuperar essas informações depois.'
    : 'Ao excluir sua conta, todos os seus dados — carteiras, transações e categorias — serão apagados permanentemente. Essa ação não pode ser desfeita e não afeta sua conta Google.';

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
    <StatusBar style="dark"/>

      <Header
        title={`Olá, ${displayName}`}
        variant="home"
        theme="light"
        rightIcon={Bell as IconComponent}
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
            accessibilityLabel="Editar perfil"
          >
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.avatar}
                accessibilityLabel="Foto de perfil"
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
              accessibilityLabel="Ilustração de perfil"
            />
            <Button
              variant="outlined"
              onPress={loginWithGoogle}
              leftIcon={
                <Image
                  source={require('@/assets/images/Logo-Google.png')}
                  style={styles.googleLogo}
                  accessibilityLabel="Logo do Google"
                />
              }
            >
              Entrar com o Google
            </Button>
          </View>
        )}

        {/* Seção: Seu app */}
        <View>
          <Text style={styles.sectionLabel}>Seu app</Text>
          <ListItem
            icon={List as IconComponent}
            label="Categorias"
            onPress={() => router.push('/(stack)/categories' as never)}
            accessibilityLabel="Categorias"
          />
          <ListItem
            icon={Heart as IconComponent}
            label="Preferências"
            onPress={() => router.push('/(stack)/preferences' as never)}
            accessibilityLabel="Preferências"
          />
        </View>

        {/* Seção: Informações e ajuda */}
        <View>
          <Text style={styles.sectionLabel}>Informações e ajuda</Text>
          <ListItem
            icon={Info as IconComponent}
            label="Sobre"
            onPress={() => router.push('/(stack)/about' as never)}
            accessibilityLabel="Sobre"
          />
          <ListItem
            icon={ShareNetwork as IconComponent}
            label="Compartilhar com um amigo"
            onPress={handleShare}
            accessibilityLabel="Compartilhar com um amigo"
          />
          <ListItem
            icon={Star as IconComponent}
            label="Avaliar aplicativo"
            onPress={() => router.push('/(stack)/rate' as never)}
            accessibilityLabel="Avaliar aplicativo"
          />
          <ListItem
            icon={SignOutIcon as IconComponent}
            label="Sair do aplicativo"
            onPress={handleLogout}
            accessibilityLabel="Sair do aplicativo"
          />
        </View>

        {/* Seção: Outros */}
        <View>
          <Text style={styles.sectionLabel}>Outros</Text>
          <TouchableOpacity
            onPress={() => router.push('/(stack)/support' as never)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Apoie o Bolso Simples"
            style={styles.listItem}
          >
            <HandHeart size={24} color={colors.success} weight="regular" />
            <Text style={[styles.listItemLabel, styles.listItemLabelSuccess]} numberOfLines={1}>
              Apoie o Bolso Simples
            </Text>
            <CaretRight size={16} color={colors.muted} weight="regular" />
          </TouchableOpacity>
          <ListItem
            icon={BroomIcon as IconComponent}
            label="Limpar dados"
            onPress={handleClearHistory}
            accessibilityLabel="Limpar dados"
          />
          <ListItem
            icon={TrashIcon as IconComponent}
            label="Excluir conta"
            onPress={() => setDeleteAccountVisible(true)}
            accessibilityLabel="Excluir conta"
            color={colors.danger}
          />
        </View>
      </ScrollView>

      <Dialog
        visible={logoutDialogVisible}
        title="Desconectar"
        description="Tem certeza que deseja sair?"
        confirmLabel="Sair"
        cancelLabel="Cancelar"
        onConfirm={logout}
        onCancel={() => setLogoutDialogVisible(false)}
      />

      <Dialog
        visible={clearDataDialogVisible}
        title="Apagar todo o histórico?"
        description="Todas as suas carteiras, transações e categorias serão removidas permanentemente. Essa ação não tem volta."
        confirmLabel="Limpar tudo"
        cancelLabel="Cancelar"
        requireConfirmation={true}
        confirmationLabel="Entendo que vou perder todos os meus dados"
        loading={clearing}
        onConfirm={handleConfirmClearData}
        onCancel={() => setClearDataDialogVisible(false)}
      />

      <Dialog
        visible={deleteAccountVisible}
        title="Excluir conta"
        description={deleteAccountDescription}
        confirmLabel="Excluir conta"
        cancelLabel="Cancelar"
        requireConfirmation={true}
        confirmationLabel="Entendi que essa ação é permanente e não pode ser desfeita"
        loading={deleting}
        onConfirm={handleConfirmDeleteAccount}
        onCancel={() => setDeleteAccountVisible(false)}
      />

      <Toast message={toastMessage} variant={toastVariant} />
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
});
