import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function ProgressBar({
  value,
  color = colors.primary,
  size = 'md',
  showLabel = true,
}: {
  value: number;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}) {
  const heights = { xs: 4, sm: 6, md: 8, lg: 12 };
  const h = heights[size];
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height: h, borderRadius: h }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clamped}%`,
              height: h,
              backgroundColor: color,
              borderRadius: h,
            },
          ]}
        />
      </View>
      {showLabel && <Text style={styles.label}>{clamped}%</Text>}
    </View>
  );
}

export function ProgressScreen() {
  return (
    <ScreenWrapper>
      <Section title="Valores">
        <Label text="0%" /><ProgressBar value={0} />
        <Label text="25%" /><ProgressBar value={25} />
        <Label text="50%" /><ProgressBar value={50} />
        <Label text="75%" /><ProgressBar value={75} />
        <Label text="100%" /><ProgressBar value={100} />
      </Section>

      <Section title="Tamanhos">
        <Label text="xs" /><ProgressBar value={60} size="xs" showLabel={false} />
        <Label text="sm" /><ProgressBar value={60} size="sm" showLabel={false} />
        <Label text="md (padrão)" /><ProgressBar value={60} size="md" showLabel={false} />
        <Label text="lg" /><ProgressBar value={60} size="lg" showLabel={false} />
      </Section>

      <Section title="Cores">
        <Label text="Primary" /><ProgressBar value={70} color={colors.primary} />
        <Label text="Success" /><ProgressBar value={100} color={colors.success} />
        <Label text="Warning" /><ProgressBar value={45} color={colors.warning} />
        <Label text="Danger" /><ProgressBar value={20} color={colors.danger} />
        <Label text="Secondary" /><ProgressBar value={85} color={colors.secondary} />
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  track: {
    flex: 1,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {},
  label: {
    fontSize: 12,
    color: colors.textMuted,
    width: 36,
    textAlign: 'right',
  },
});
