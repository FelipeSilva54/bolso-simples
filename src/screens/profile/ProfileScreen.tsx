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
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as Application from 'expo-application';
import {
  Bell,
  List,
  Heart,
  Lock,
  HandHeart,
  Question,
  Info,
  ShareNetwork,
  Star,
  CaretRight,
} from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { ListItem } from '@/components/ListItem';
import { Dialog } from '@/components/Dialog';
import { useAuth } from '@/store/AuthContext';

type IconComponent = React.ComponentType<{ size?: number; color?: string; weight?: string }>;

export function ProfileScreen() {
  const router = useRouter();
  const { user, loginWithGoogle, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const displayName =
    user?.isAnonymous || !user?.displayName ? 'Visitante' : user.displayName;
  const avatarInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : 'V';

  const appVersion = Application.nativeApplicationVersion ?? '—';
  const buildVersion = Application.nativeBuildVersion ?? '—';

  const handleShare = async () => {
    await Share.share({
      message:
        'Conheça o Bolso Simples, o app de finanças 100% brasileiro, gratuito e sem anúncios!',
    });
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutDialog(false);
    await logout();
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" backgroundColor={colors.white}/>

      <Header
        title={`Olá, ${displayName}`}
        variant="home"
        theme="light"
        rightIcon={Bell as IconComponent}
        onRightPress={() => router.push('/(stack)/notifications' as never)}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile block */}
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

        {/* Outros serviços */}
        <View>
          <Text style={styles.sectionLabel}>Outros serviços</Text>
          <ListItem
            icon={List as IconComponent}
            label="Categorias"
            onPress={() => router.push('/(stack)/categories' as never)}
            accessibilityLabel="Categorias"
          />
          <ListItem
            icon={Heart as IconComponent}
            label="Preferências do app"
            onPress={() => router.push('/(stack)/preferences' as never)}
            accessibilityLabel="Preferências do app"
          />
        </View>

        {/* Configurações da conta */}
        <View>
          <Text style={styles.sectionLabel}>Configurações da conta</Text>
          <ListItem
            icon={Lock as IconComponent}
            label="Segurança"
            onPress={() => router.push('/(stack)/security' as never)}
            accessibilityLabel="Segurança"
          />
          <ListItem
            icon={Bell as IconComponent}
            label="Notificações"
            onPress={() => router.push('/(stack)/notifications' as never)}
            accessibilityLabel="Notificações"
          />
        </View>

        {/* Suporte */}
        <View>
          <Text style={styles.sectionLabel}>Suporte</Text>

          {/* "Apoie o bolsosimples" — inline, cor success */}
          <TouchableOpacity
            onPress={() => router.push('/(stack)/support' as never)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Apoie o bolsosimples"
            style={styles.listItem}
          >
            <HandHeart size={24} color={colors.success} weight="regular" />
            <Text style={[styles.listItemLabel, styles.listItemLabelSuccess]} numberOfLines={1}>
              Apoie o bolsosimples
            </Text>
            <CaretRight size={16} color={colors.muted} weight="regular" />
          </TouchableOpacity>

          <ListItem
            icon={Question as IconComponent}
            label="Ajuda"
            onPress={() => router.push('/(stack)/help' as never)}
            accessibilityLabel="Ajuda"
          />
          <ListItem
            icon={Info as IconComponent}
            label="Sobre o APP"
            onPress={() => router.push('/(stack)/about' as never)}
            accessibilityLabel="Sobre o APP"
          />
          <ListItem
            icon={ShareNetwork as IconComponent}
            label="Compartilhe com um amigo"
            onPress={handleShare}
            accessibilityLabel="Compartilhe com um amigo"
          />
          <ListItem
            icon={Star as IconComponent}
            label="Avalie nosso app"
            onPress={() => router.push('/(stack)/rate' as never)}
            accessibilityLabel="Avalie nosso app"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.version}>
            Versão {appVersion} ({buildVersion})
          </Text>
          <Button
            variant="dangerLight"
            onPress={() => setShowLogoutDialog(true)}
          >
            Sair do aplicativo
          </Button>
        </View>
      </ScrollView>

      <Dialog
        visible={showLogoutDialog}
        title="Sair do app?"
        description="Tem certeza que deseja sair da sua conta?"
        confirmLabel="Sair"
        cancelLabel="Cancelar"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },

  // Profile card
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
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

  // Section labels
  sectionLabel: {
    fontSize: fs.sm,
    fontWeight: fw.regular,
    color: colors.subcontent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
  },

  // Inline list item (mirrors ListItem layout)
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

  // Footer
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  version: {
    fontSize: fs.sm,
    color: colors.muted,
    textAlign: 'center',
    paddingBottom: spacing.md,
  },
});
