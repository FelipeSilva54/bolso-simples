import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Button } from '@/components/Button';

export default function LoginRoute() {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingAnonymous, setLoadingAnonymous] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    try {
      // TODO: signInWithGoogle
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setLoadingAnonymous(true);
    try {
      // TODO: signInAnonymously
    } finally {
      setLoadingAnonymous(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.banner} />

      <View style={styles.card}>
        <Text style={styles.title}>Seja bem-vindo ao Bolso Simples!</Text>

        <View style={styles.gapSm} />

        <Text style={styles.subtitle}>
          Seu app de bolso para finanças{' '}
          <Text style={styles.bold}>100% brasileiro</Text>
          {', '}
          <Text style={styles.bold}>gratuito</Text>
          {' e '}
          <Text style={styles.bold}>sem anúncios.</Text>
        </Text>

        <View style={styles.gapXl} />

        <Button
          variant="outlined"
          onPress={handleGoogleSignIn}
          loading={loadingGoogle}
          disabled={loadingAnonymous}
          leftIcon={
            <Image
              source={require('@/assets/images/Logo-Icon.png')}
              style={styles.googleIcon}
              accessibilityLabel="Logo do Google"
            />
          }
        >
          Entrar com o Google
        </Button>

        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>ou</Text>
          <View style={styles.separatorLine} />
        </View>

        <Button
          variant="primary"
          onPress={handleAnonymousSignIn}
          loading={loadingAnonymous}
          disabled={loadingGoogle}
        >
          Entrar sem cadastro
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  banner: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  card: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  title: {
    fontSize: fs.xxl,
    fontWeight: fw.bold,
    color: colors.content,
  },
  gapSm: {
    height: spacing.sm,
  },
  gapXl: {
    height: spacing.xl,
  },
  subtitle: {
    fontSize: fs.sm,
    color: colors.subcontent,
  },
  bold: {
    fontWeight: fw.bold,
    color: colors.subcontent,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  separatorText: {
    fontSize: fs.sm,
    color: colors.muted,
    marginHorizontal: spacing.sm,
  },
});
