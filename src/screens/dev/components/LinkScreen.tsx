import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function Link({
  label,
  size = 'md',
  color = colors.primary,
  underline = true,
  disabled = false,
  external = false,
}: {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  underline?: boolean;
  disabled?: boolean;
  external?: boolean;
}) {
  const sizes = { sm: 12, md: 14, lg: 16 };

  return (
    <TouchableOpacity disabled={disabled} activeOpacity={0.6}>
      <Text
        style={{
          fontSize: sizes[size],
          color: disabled ? colors.muted : color,
          textDecorationLine: underline ? 'underline' : 'none',
        }}
      >
        {label}
        {external && ' ↗'}
      </Text>
    </TouchableOpacity>
  );
}

export function LinkScreen() {
  return (
    <ScreenWrapper>
      <Section title="Tamanhos">
        <Label text="sm" /><Link label="Link pequeno" size="sm" />
        <Label text="md (padrão)" /><Link label="Link médio" size="md" />
        <Label text="lg" /><Link label="Link grande" size="lg" />
      </Section>

      <Section title="Cores">
        <Label text="Primary" /><Link label="Link primary" color={colors.primary} />
        <Label text="Danger" /><Link label="Link danger" color={colors.danger} />
        <Label text="Success" /><Link label="Link success" color={colors.success} />
        <Label text="Muted" /><Link label="Link muted" color={colors.textMuted} />
      </Section>

      <Section title="Estados">
        <Label text="Com sublinhado (padrão)" />
        <Link label="Com sublinhado" />
        <Label text="Sem sublinhado" />
        <Link label="Sem sublinhado" underline={false} />
        <Label text="Disabled" />
        <Link label="Link desabilitado" disabled />
        <Label text="Externo" />
        <Link label="Termos de uso" external />
      </Section>

      <Section title="Em contexto de texto">
        <Text style={styles.paragraph}>
          Ao continuar, você concorda com os{' '}
          <Text style={styles.inline}>Termos de Uso</Text>
          {' '}e{' '}
          <Text style={styles.inline}>Política de Privacidade</Text>
          .
        </Text>

        <Text style={[styles.paragraph, { marginTop: 12 }]}>
          Não tem conta?{' '}
          <Text style={styles.inline}>Entrar sem cadastro →</Text>
        </Text>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  inline: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});
