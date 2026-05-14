import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ArrowSquareOut } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Header } from '@/components/Header';

export function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" backgroundColor={colors.white} />

      <Header
        title="Sobre"
        variant="screen"
        theme="light"
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Bloco do app */}
        <View style={styles.appBlock}>
          <View style={styles.iconContainer}>
            <Image
              source={require('@/assets/images/Logo-Icon.png')}
              style={styles.appIcon}
              resizeMode="contain"
              accessibilityLabel="Ícone do Bolso Simples"
            />
          </View>
          <Text style={styles.appName}>
            <Text style={styles.appNameRegular}>bolso</Text>
            <Text style={styles.appNameBold}>simples</Text>
          </Text>
          <Text style={styles.tagline}>
            Simplificando a organização das finanças pessoais
          </Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
        </View>

        {/* Seção de informações */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>E-mail de contato</Text>
            <Text style={styles.value}>bolsosimples@gmail.com</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Versão do aplicativo</Text>
            <Text style={styles.value}>1.0.0</Text>
          </View>
        </View>

        {/* Seção de links legais */}
        <View style={[styles.section, styles.legalSection]}>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => Linking.openURL('https://bolsosimples.com/termos')}
            activeOpacity={0.7}
            accessibilityRole="link"
            accessibilityLabel="Abrir termos de uso no navegador"
          >
            <Text style={styles.label}>Termos de uso</Text>
            <ArrowSquareOut size={20} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => Linking.openURL('https://bolsosimples.com/privacidade')}
            activeOpacity={0.7}
            accessibilityRole="link"
            accessibilityLabel="Abrir política de privacidade no navegador"
          >
            <Text style={styles.label}>Política de privacidade</Text>
            <ArrowSquareOut size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerLine}>Feito com ♥ no Brasil</Text>
          <Text style={styles.footerLineLast}>© 2025 Bolso Simples</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  // Bloco do app
  appBlock: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  appIcon: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: fs.xxl,
    color: colors.content,
    marginTop: spacing.md,
  },
  appNameRegular: {
    fontWeight: fw.regular,
  },
  appNameBold: {
    fontWeight: fw.bold,
  },
  tagline: {
    fontSize: fs.md,
    color: colors.subcontent,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: fs.md * 1.4,
  },
  version: {
    fontSize: fs.sm,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  // Seções
  section: {
    marginTop: spacing.xxl,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  legalSection: {
    marginTop: spacing.xl,
  },

  // Linhas de info (não clicáveis)
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },

  // Linhas de link (clicáveis)
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },

  label: {
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.content,
  },
  value: {
    fontSize: fs.sm,
    fontWeight: fw.regular,
    color: colors.subcontent,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.lg,
  },

  // Rodapé
  footer: {
    marginTop: spacing.xxl,
    alignItems: 'center',
    paddingBottom: spacing.xxl,
  },
  footerLine: {
    fontSize: fs.md,
    color: colors.muted,
    textAlign: 'center',
  },
  footerLineLast: {
    fontSize: fs.sm,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
