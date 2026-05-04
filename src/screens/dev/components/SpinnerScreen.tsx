import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, Label, Row, ScreenWrapper, Section } from './_shared';

function SpinnerDemo({ size, color, label }: { size: 'small' | 'large'; color: string; label: string }) {
  return (
    <View style={styles.item}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
  );
}

export function SpinnerScreen() {
  return (
    <ScreenWrapper>
      <Section title="Tamanhos">
        <Row>
          <View style={styles.item}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.itemLabel}>small</Text>
          </View>
          <View style={styles.item}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.itemLabel}>large</Text>
          </View>
        </Row>
      </Section>

      <Section title="Cores">
        <Row wrap>
          <SpinnerDemo size="large" color={colors.primary} label="primary" />
          <SpinnerDemo size="large" color={colors.secondary} label="secondary" />
          <SpinnerDemo size="large" color={colors.success} label="success" />
          <SpinnerDemo size="large" color={colors.danger} label="danger" />
          <SpinnerDemo size="large" color={colors.warning} label="warning" />
          <SpinnerDemo size="large" color={colors.muted} label="muted" />
        </Row>
      </Section>

      <Section title="Com texto">
        <View style={styles.withText}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
        <View style={styles.withText}>
          <ActivityIndicator size="small" color={colors.muted} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>Buscando transações...</Text>
        </View>
      </Section>

      <Section title="Tela inteira (estado de carregamento)">
        <View style={styles.fullPage}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.fullPageText}>Carregando dados...</Text>
        </View>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  itemLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  withText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: colors.text,
  },
  fullPage: {
    backgroundColor: colors.card,
    borderRadius: 12,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  fullPageText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
