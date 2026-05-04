import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, Row, ScreenWrapper, Section } from './_shared';

type Variant = 'solid' | 'outline' | 'ghost' | 'link';
type Color = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'muted';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const BG: Record<Color, string> = {
  primary: colors.primary,
  secondary: colors.secondary,
  success: colors.success,
  danger: colors.danger,
  warning: colors.warning,
  muted: '#6B7280',
};

const SIZES: Record<Size, { px: number; py: number; fs: number; br: number }> = {
  xs: { px: 8, py: 4, fs: 11, br: 4 },
  sm: { px: 12, py: 6, fs: 12, br: 6 },
  md: { px: 16, py: 9, fs: 14, br: 8 },
  lg: { px: 20, py: 11, fs: 16, br: 10 },
  xl: { px: 24, py: 13, fs: 18, br: 12 },
};

function Btn({
  label,
  variant = 'solid',
  color = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
}: {
  label: string;
  variant?: Variant;
  color?: Color;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
}) {
  const bg = BG[color];
  const sz = SIZES[size];
  const textColor = variant === 'solid' ? '#FFFFFF' : bg;

  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.btn,
        { paddingHorizontal: sz.px, paddingVertical: sz.py, borderRadius: sz.br, opacity: disabled ? 0.4 : 1 },
        variant === 'solid' && { backgroundColor: bg },
        variant === 'outline' && { borderWidth: 1.5, borderColor: bg },
        variant === 'ghost' && {},
        variant === 'link' && { paddingHorizontal: 0, paddingVertical: 0 },
      ]}
    >
      {loading && <ActivityIndicator size="small" color={textColor} style={{ marginRight: 6 }} />}
      <Text
        style={{
          fontSize: sz.fs,
          fontWeight: '600',
          color: textColor,
          textDecorationLine: variant === 'link' ? 'underline' : 'none',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function ButtonScreen() {
  return (
    <ScreenWrapper>
      <Section title="Variante: Solid">
        <Label text="Primary" /><Btn label="Solid Primary" variant="solid" color="primary" />
        <Label text="Secondary" /><Btn label="Solid Secondary" variant="solid" color="secondary" />
        <Label text="Success" /><Btn label="Solid Success" variant="solid" color="success" />
        <Label text="Danger" /><Btn label="Solid Danger" variant="solid" color="danger" />
        <Label text="Warning" /><Btn label="Solid Warning" variant="solid" color="warning" />
        <Label text="Muted" /><Btn label="Solid Muted" variant="solid" color="muted" />
      </Section>

      <Section title="Variante: Outline">
        <Label text="Primary" /><Btn label="Outline Primary" variant="outline" color="primary" />
        <Label text="Danger" /><Btn label="Outline Danger" variant="outline" color="danger" />
        <Label text="Success" /><Btn label="Outline Success" variant="outline" color="success" />
        <Label text="Muted" /><Btn label="Outline Muted" variant="outline" color="muted" />
      </Section>

      <Section title="Variante: Ghost">
        <Label text="Primary" /><Btn label="Ghost Primary" variant="ghost" color="primary" />
        <Label text="Danger" /><Btn label="Ghost Danger" variant="ghost" color="danger" />
        <Label text="Secondary" /><Btn label="Ghost Secondary" variant="ghost" color="secondary" />
      </Section>

      <Section title="Variante: Link">
        <Label text="Primary" /><Btn label="Link Primary" variant="link" color="primary" />
        <Label text="Danger" /><Btn label="Link Danger" variant="link" color="danger" />
      </Section>

      <Section title="Tamanhos">
        <Label text="xs" /><Btn label="Extra Small" size="xs" />
        <Label text="sm" /><Btn label="Small" size="sm" />
        <Label text="md (padrão)" /><Btn label="Medium" size="md" />
        <Label text="lg" /><Btn label="Large" size="lg" />
        <Label text="xl" /><Btn label="Extra Large" size="xl" />
      </Section>

      <Section title="Estados">
        <Label text="Default" /><Btn label="Default" />
        <Label text="Disabled" /><Btn label="Disabled" disabled />
        <Label text="Loading" /><Btn label="Salvando..." loading />
        <Label text="Outline Disabled" /><Btn label="Disabled" variant="outline" disabled />
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});
