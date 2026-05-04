import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, Label, Row, ScreenWrapper, Section } from './_shared';

type BadgeColor = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'secondary';
type BadgeVariant = 'solid' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

const BADGE_COLORS: Record<BadgeColor, { bg: string; border: string; text: string }> = {
  primary: { bg: colors.primaryLight, border: colors.primary, text: colors.primaryDark },
  success: { bg: colors.successLight, border: colors.success, text: '#065F46' },
  warning: { bg: colors.warningLight, border: colors.warning, text: '#92400E' },
  danger: { bg: colors.dangerLight, border: colors.danger, text: '#991B1B' },
  info: { bg: colors.infoLight, border: colors.info, text: colors.primaryDark },
  muted: { bg: colors.mutedLight, border: '#9CA3AF', text: '#374151' },
  secondary: { bg: colors.secondaryLight, border: colors.secondary, text: '#5B21B6' },
};

const SIZES: Record<BadgeSize, { px: number; py: number; fs: number }> = {
  sm: { px: 6, py: 2, fs: 10 },
  md: { px: 8, py: 3, fs: 11 },
  lg: { px: 10, py: 4, fs: 12 },
};

function Badge({
  label,
  color = 'primary',
  variant = 'solid',
  size = 'md',
}: {
  label: string;
  color?: BadgeColor;
  variant?: BadgeVariant;
  size?: BadgeSize;
}) {
  const c = BADGE_COLORS[color];
  const sz = SIZES[size];

  return (
    <View
      style={[
        styles.badge,
        {
          paddingHorizontal: sz.px,
          paddingVertical: sz.py,
          backgroundColor: variant === 'solid' ? c.bg : 'transparent',
          borderWidth: 1,
          borderColor: c.border,
        },
      ]}
    >
      <Text style={{ fontSize: sz.fs, fontWeight: '600', color: c.text }}>{label}</Text>
    </View>
  );
}

export function BadgeScreen() {
  return (
    <ScreenWrapper>
      <Section title="Variante: Solid">
        <Row wrap>
          <View style={styles.item}><Label text="Primary" /><Badge label="Primary" color="primary" /></View>
          <View style={styles.item}><Label text="Success" /><Badge label="Success" color="success" /></View>
          <View style={styles.item}><Label text="Warning" /><Badge label="Warning" color="warning" /></View>
          <View style={styles.item}><Label text="Danger" /><Badge label="Danger" color="danger" /></View>
          <View style={styles.item}><Label text="Info" /><Badge label="Info" color="info" /></View>
          <View style={styles.item}><Label text="Secondary" /><Badge label="Secondary" color="secondary" /></View>
          <View style={styles.item}><Label text="Muted" /><Badge label="Muted" color="muted" /></View>
        </Row>
      </Section>

      <Section title="Variante: Outline">
        <Row wrap>
          <View style={styles.item}><Label text="Primary" /><Badge label="Primary" color="primary" variant="outline" /></View>
          <View style={styles.item}><Label text="Success" /><Badge label="Success" color="success" variant="outline" /></View>
          <View style={styles.item}><Label text="Warning" /><Badge label="Warning" color="warning" variant="outline" /></View>
          <View style={styles.item}><Label text="Danger" /><Badge label="Danger" color="danger" variant="outline" /></View>
          <View style={styles.item}><Label text="Muted" /><Badge label="Muted" color="muted" variant="outline" /></View>
        </Row>
      </Section>

      <Section title="Tamanhos">
        <Row wrap>
          <View style={styles.item}><Label text="sm" /><Badge label="Small" size="sm" /></View>
          <View style={styles.item}><Label text="md (padrão)" /><Badge label="Medium" size="md" /></View>
          <View style={styles.item}><Label text="lg" /><Badge label="Large" size="lg" /></View>
        </Row>
      </Section>

      <Section title="Uso em contexto">
        <Row wrap>
          <Badge label="Novo" color="primary" />
          <Badge label="Pago" color="success" />
          <Badge label="Pendente" color="warning" />
          <Badge label="Vencido" color="danger" />
          <Badge label="Cancelado" color="muted" />
          <Badge label="Recorrente" color="secondary" />
        </Row>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  item: {
    marginBottom: 4,
  },
});
