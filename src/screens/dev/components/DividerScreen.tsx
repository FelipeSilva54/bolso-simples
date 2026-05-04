import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function HDivider({ color = colors.border, thickness = 1 }: { color?: string; thickness?: number }) {
  return <View style={{ height: thickness, backgroundColor: color, width: '100%' }} />;
}

function VDivider({ color = colors.border, thickness = 1, height = 24 }: { color?: string; thickness?: number; height?: number }) {
  return <View style={{ width: thickness, backgroundColor: color, height }} />;
}

export function DividerScreen() {
  return (
    <ScreenWrapper>
      <Section title="Horizontal">
        <Label text="Default (1px, border)" />
        <HDivider />

        <Label text="2px" />
        <HDivider thickness={2} />

        <Label text="Cor primary" />
        <HDivider color={colors.primary} />

        <Label text="Cor success" />
        <HDivider color={colors.success} />

        <Label text="Tracejado (visual)" />
        <View style={styles.dashed} />
      </Section>

      <Section title="Vertical">
        <View style={styles.vRow}>
          <Text style={styles.text}>Receitas</Text>
          <VDivider height={32} />
          <Text style={styles.text}>Despesas</Text>
          <VDivider height={32} />
          <Text style={styles.text}>Saldo</Text>
        </View>
      </Section>

      <Section title="Com texto centralizado">
        <View style={styles.withText}>
          <HDivider />
          <Text style={styles.dividerText}>ou</Text>
          <HDivider />
        </View>

        <View style={styles.withText}>
          <HDivider />
          <Text style={styles.dividerText}>Outubro 2025</Text>
          <HDivider />
        </View>
      </Section>

      <Section title="Separando seções (lista)">
        <Text style={styles.listItem}>Alimentação — R$ 45,90</Text>
        <HDivider />
        <Text style={styles.listItem}>Transporte — R$ 12,50</Text>
        <HDivider />
        <Text style={styles.listItem}>Moradia — R$ 800,00</Text>
        <HDivider />
        <Text style={styles.listItem}>Lazer — R$ 65,00</Text>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  dashed: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.border,
  },
  vRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    fontSize: 13,
    color: colors.text,
  },
  withText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerText: {
    fontSize: 12,
    color: colors.textMuted,
    whiteSpace: 'nowrap' as never,
  },
  listItem: {
    fontSize: 14,
    color: colors.text,
    paddingVertical: 10,
  },
});
