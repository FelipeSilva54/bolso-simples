import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, Label, Row, ScreenWrapper, Section } from './_shared';

const ICONS = [
  { emoji: '💰', name: 'Wallet' },
  { emoji: '💳', name: 'CreditCard' },
  { emoji: '📈', name: 'TrendUp' },
  { emoji: '📉', name: 'TrendDown' },
  { emoji: '🔔', name: 'Bell' },
  { emoji: '⚙️', name: 'Gear' },
  { emoji: '👤', name: 'User' },
  { emoji: '🔍', name: 'MagnifyingGlass' },
  { emoji: '➕', name: 'Plus' },
  { emoji: '✏️', name: 'Pencil' },
  { emoji: '🗑️', name: 'Trash' },
  { emoji: '👁️', name: 'Eye' },
  { emoji: '📅', name: 'Calendar' },
  { emoji: '🏠', name: 'House' },
  { emoji: '🚗', name: 'Car' },
  { emoji: '🍔', name: 'ForkKnife' },
  { emoji: '💊', name: 'Pill' },
  { emoji: '📚', name: 'Books' },
];

function IconDemo({ emoji, name, size = 24, color = colors.text }: { emoji: string; name: string; size?: number; color?: string }) {
  return (
    <View style={styles.iconItem}>
      <Text style={{ fontSize: size }}>{emoji}</Text>
      <Text style={styles.iconName}>{name}</Text>
    </View>
  );
}

export function IconScreen() {
  return (
    <ScreenWrapper>
      <Section title="Tamanhos">
        <Row>
          <View style={styles.iconItem}>
            <Text style={{ fontSize: 16 }}>💰</Text>
            <Text style={styles.iconName}>16</Text>
          </View>
          <View style={styles.iconItem}>
            <Text style={{ fontSize: 20 }}>💰</Text>
            <Text style={styles.iconName}>20</Text>
          </View>
          <View style={styles.iconItem}>
            <Text style={{ fontSize: 24 }}>💰</Text>
            <Text style={styles.iconName}>24</Text>
          </View>
          <View style={styles.iconItem}>
            <Text style={{ fontSize: 32 }}>💰</Text>
            <Text style={styles.iconName}>32</Text>
          </View>
          <View style={styles.iconItem}>
            <Text style={{ fontSize: 48 }}>💰</Text>
            <Text style={styles.iconName}>48</Text>
          </View>
        </Row>
      </Section>

      <Section title="Ícones Phosphor (usados no app)">
        <View style={styles.grid}>
          {ICONS.map((i) => (
            <IconDemo key={i.name} emoji={i.emoji} name={i.name} />
          ))}
        </View>
      </Section>

      <Section title="Ícones em contexto (botões e lista)">
        <Row>
          <View style={styles.iconBtn}>
            <Text style={{ fontSize: 18 }}>➕</Text>
            <Text style={styles.btnLabel}>Nova transação</Text>
          </View>
        </Row>
        <Row>
          <View style={[styles.categoryTag, { backgroundColor: colors.primaryLight }]}>
            <Text style={{ fontSize: 16 }}>🍔</Text>
            <Text style={[styles.btnLabel, { color: colors.primaryDark }]}>Alimentação</Text>
          </View>
          <View style={[styles.categoryTag, { backgroundColor: colors.successLight }]}>
            <Text style={{ fontSize: 16 }}>💰</Text>
            <Text style={[styles.btnLabel, { color: '#065F46' }]}>Salário</Text>
          </View>
        </Row>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  iconItem: {
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  iconName: {
    fontSize: 9,
    color: colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});
