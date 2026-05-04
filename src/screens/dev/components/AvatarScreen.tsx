import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, Label, Row, ScreenWrapper, Section } from './_shared';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const SIZES: Record<AvatarSize, { size: number; fontSize: number }> = {
  xs: { size: 24, fontSize: 10 },
  sm: { size: 32, fontSize: 12 },
  md: { size: 40, fontSize: 14 },
  lg: { size: 48, fontSize: 16 },
  xl: { size: 64, fontSize: 20 },
  '2xl': { size: 80, fontSize: 24 },
};

function Avatar({
  size = 'md',
  initials,
  color = colors.primary,
  showBadge = false,
}: {
  size?: AvatarSize;
  initials: string;
  color?: string;
  showBadge?: boolean;
}) {
  const sz = SIZES[size];

  return (
    <View style={{ position: 'relative' }}>
      <View
        style={[
          styles.avatar,
          { width: sz.size, height: sz.size, borderRadius: sz.size / 2, backgroundColor: color },
        ]}
      >
        <Text style={[styles.initials, { fontSize: sz.fontSize }]}>{initials}</Text>
      </View>
      {showBadge && (
        <View
          style={[
            styles.badge,
            { width: sz.size * 0.28, height: sz.size * 0.28, borderRadius: sz.size * 0.14 },
          ]}
        />
      )}
    </View>
  );
}

function ImageAvatar({ size = 'md' }: { size?: AvatarSize }) {
  const sz = SIZES[size];

  return (
    <View
      style={[
        styles.avatar,
        styles.imagePlaceholder,
        { width: sz.size, height: sz.size, borderRadius: sz.size / 2 },
      ]}
    >
      <Text style={{ fontSize: sz.fontSize }}>👤</Text>
    </View>
  );
}

export function AvatarScreen() {
  return (
    <ScreenWrapper>
      <Section title="Tamanhos">
        <Row>
          {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as AvatarSize[]).map((s) => (
            <View key={s} style={styles.item}>
              <Avatar size={s} initials="FS" />
              <Text style={styles.sizeLabel}>{s}</Text>
            </View>
          ))}
        </Row>
      </Section>

      <Section title="Fallback: Iniciais">
        <Row>
          <Avatar size="lg" initials="FS" color={colors.primary} />
          <Avatar size="lg" initials="AB" color={colors.success} />
          <Avatar size="lg" initials="JC" color={colors.secondary} />
          <Avatar size="lg" initials="MR" color={colors.warning} />
        </Row>
      </Section>

      <Section title="Fallback: Ícone">
        <Row>
          <ImageAvatar size="sm" />
          <ImageAvatar size="md" />
          <ImageAvatar size="lg" />
          <ImageAvatar size="xl" />
        </Row>
      </Section>

      <Section title="Com badge de status (online)">
        <Row>
          <View style={styles.item}>
            <Avatar size="md" initials="FS" showBadge />
            <Text style={styles.sizeLabel}>Online</Text>
          </View>
          <View style={styles.item}>
            <Avatar size="lg" initials="AB" color={colors.success} showBadge />
            <Text style={styles.sizeLabel}>Online</Text>
          </View>
        </Row>
      </Section>

      <Section title="Grupo de avatars">
        <View style={styles.group}>
          {[colors.primary, colors.success, colors.secondary, colors.warning].map((c, i) => (
            <View key={i} style={[styles.groupItem, { zIndex: 4 - i, marginLeft: i === 0 ? 0 : -12 }]}>
              <Avatar size="md" initials={['FS', 'AB', 'JC', '+3'][i]} color={c} />
            </View>
          ))}
        </View>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  imagePlaceholder: {
    backgroundColor: colors.mutedLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.card,
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  sizeLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupItem: {
    borderWidth: 2,
    borderColor: colors.card,
    borderRadius: 20,
  },
});
