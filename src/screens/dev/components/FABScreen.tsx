import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function FAB({
  icon,
  label,
  size = 'md',
  color = colors.primary,
  extended = false,
  position = 'none',
}: {
  icon: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  extended?: boolean;
  position?: 'none' | 'bottomRight' | 'bottomCenter';
}) {
  const sizes = { sm: 40, md: 56, lg: 68 };
  const iconSizes = { sm: 18, md: 24, lg: 28 };
  const sz = sizes[size];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.fab,
        { backgroundColor: color, width: extended ? undefined : sz, height: sz, borderRadius: sz / 2 },
        extended && styles.fabExtended,
        position === 'bottomRight' && styles.posBottomRight,
        position === 'bottomCenter' && styles.posBottomCenter,
      ]}
    >
      <Text style={{ fontSize: iconSizes[size] }}>{icon}</Text>
      {extended && label && (
        <Text style={styles.fabLabel}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

export function FABScreen() {
  return (
    <ScreenWrapper>
      <Section title="Tamanhos">
        <Label text="sm (40px)" />
        <FAB icon="➕" size="sm" />
        <Label text="md (56px — padrão)" />
        <FAB icon="➕" size="md" />
        <Label text="lg (68px)" />
        <FAB icon="➕" size="lg" />
      </Section>

      <Section title="Cores">
        <View style={styles.row}>
          <FAB icon="➕" color={colors.primary} />
          <FAB icon="✓" color={colors.success} />
          <FAB icon="✏️" color={colors.secondary} />
          <FAB icon="🗑️" color={colors.danger} />
        </View>
      </Section>

      <Section title="Extended (com label)">
        <Label text="Com texto" />
        <FAB icon="➕" label="Nova transação" color={colors.primary} extended />
        <Label text="Success extended" />
        <FAB icon="✓" label="Marcar como pago" color={colors.success} extended />
      </Section>

      <Section title="Posição (contextual)">
        <View style={styles.canvas}>
          <Text style={styles.canvasLabel}>Área de conteúdo</Text>
          <FAB icon="➕" position="bottomRight" />
        </View>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  fab: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  fabExtended: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    borderRadius: 28,
    height: 56,
  },
  fabLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  posBottomRight: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  posBottomCenter: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  canvas: {
    height: 160,
    backgroundColor: colors.mutedLight,
    borderRadius: 12,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
