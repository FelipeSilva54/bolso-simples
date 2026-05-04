import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function Skeleton({ width, height, borderRadius = 4 }: { width: number | string; height: number; borderRadius?: number }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width as number, height, borderRadius, opacity },
      ]}
    />
  );
}

export function SkeletonScreen() {
  return (
    <ScreenWrapper>
      <Section title="Linhas de texto">
        <Label text="Título" />
        <Skeleton width="60%" height={20} borderRadius={4} />
        <Label text="Parágrafo" />
        <Skeleton width="100%" height={14} borderRadius={4} />
        <Skeleton width="90%" height={14} borderRadius={4} />
        <Skeleton width="75%" height={14} borderRadius={4} />
      </Section>

      <Section title="Avatar + texto (card de perfil)">
        <View style={styles.profileRow}>
          <Skeleton width={48} height={48} borderRadius={24} />
          <View style={styles.profileText}>
            <Skeleton width={120} height={16} borderRadius={4} />
            <Skeleton width={80} height={12} borderRadius={4} />
          </View>
        </View>
      </Section>

      <Section title="Card de transação">
        <View style={styles.transactionRow}>
          <Skeleton width={40} height={40} borderRadius={8} />
          <View style={{ flex: 1 }}>
            <Skeleton width="50%" height={14} borderRadius={4} />
            <Skeleton width="30%" height={12} borderRadius={4} />
          </View>
          <Skeleton width={60} height={16} borderRadius={4} />
        </View>
        <View style={styles.transactionRow}>
          <Skeleton width={40} height={40} borderRadius={8} />
          <View style={{ flex: 1 }}>
            <Skeleton width="65%" height={14} borderRadius={4} />
            <Skeleton width="25%" height={12} borderRadius={4} />
          </View>
          <Skeleton width={50} height={16} borderRadius={4} />
        </View>
        <View style={styles.transactionRow}>
          <Skeleton width={40} height={40} borderRadius={8} />
          <View style={{ flex: 1 }}>
            <Skeleton width="45%" height={14} borderRadius={4} />
            <Skeleton width="35%" height={12} borderRadius={4} />
          </View>
          <Skeleton width={70} height={16} borderRadius={4} />
        </View>
      </Section>

      <Section title="Card de carteira">
        <View style={styles.walletCard}>
          <Skeleton width={100} height={14} borderRadius={4} />
          <Skeleton width={140} height={32} borderRadius={6} />
          <Skeleton width={80} height={12} borderRadius={4} />
        </View>
      </Section>

      <Section title="Circular">
        <View style={styles.circles}>
          <Skeleton width={32} height={32} borderRadius={16} />
          <Skeleton width={48} height={48} borderRadius={24} />
          <Skeleton width={64} height={64} borderRadius={32} />
        </View>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileText: {
    flex: 1,
    gap: 8,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  walletCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  circles: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
});
