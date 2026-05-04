import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export const colors = {
  bg: '#F9FAFB',
  card: '#FFFFFF',
  border: '#E5E7EB',
  divider: '#F3F4F6',
  text: '#111827',
  textSecondary: '#374151',
  textMuted: '#6B7280',
  primary: '#3B82F6',
  primaryLight: '#DBEAFE',
  primaryDark: '#1D4ED8',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  secondary: '#8B5CF6',
  secondaryLight: '#EDE9FE',
  muted: '#9CA3AF',
  mutedLight: '#F3F4F6',
};

export function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      style={sharedStyles.container}
      contentContainerStyle={sharedStyles.content}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={sharedStyles.section}>
      <Text style={sharedStyles.sectionTitle}>{title}</Text>
      <View style={sharedStyles.sectionContent}>{children}</View>
    </View>
  );
}

export function Label({ text }: { text: string }) {
  return <Text style={sharedStyles.label}>{text}</Text>;
}

export function Row({
  children,
  wrap = false,
}: {
  children: React.ReactNode;
  wrap?: boolean;
}) {
  return (
    <View style={[sharedStyles.row, wrap && sharedStyles.rowWrap]}>
      {children}
    </View>
  );
}

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.divider,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionContent: {
    padding: 16,
    gap: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
    marginBottom: 4,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowWrap: {
    flexWrap: 'wrap',
  },
});
