import React from 'react';
import {
  View,
  Image,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
import { colors, fontSize as fs, fontWeight as fw, spacing, lineHeight as lh } from '@/constants';

type EmptyStateProps = {
  image: ImageSourcePropType;
  title: string;
  subtitle?: string;
  centered?: boolean;
};

export function EmptyState({ image, title, subtitle, centered = false }: EmptyStateProps) {
  return (
    <View style={[styles.container, centered && styles.containerCentered]}>
      <Image source={image} style={styles.image} resizeMode="contain" />

      <AppText style={styles.title}>{title}</AppText>

      {subtitle != null && (
        <AppText style={styles.subtitle}>{subtitle}</AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 110,
    paddingHorizontal: spacing.xxxl,
    gap: spacing.md,
  },
  containerCentered: {
    flex: 0,
    justifyContent: undefined,
    paddingTop: 0,
  },
  image: {
    width: 160,
    height: 130,
  },
  title: {
    fontSize: fs.lg,
    fontWeight: fw.bold,
    color: colors.content,
    textAlign: 'center',
    lineHeight: lh.md(fs.lg),
  },
  subtitle: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.subcontent,
    textAlign: 'center',
    lineHeight: lh.md(fs.md),
  },
});