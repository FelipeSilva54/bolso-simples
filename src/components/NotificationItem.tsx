import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import {
  CalendarX,
  ClockCountdown,
  ChartBar,
  TrendDown,
} from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';
import type { Notification, NotificationType } from '@/types/notification';

const WARNING_COLOR = '#D97706';
const WARNING_LIGHT_COLOR = '#FEF3C7';

type IconConfig = {
  Icon: React.ComponentType<{ size?: number; color?: string; weight?: string }>;
  iconColor: string;
  circleColor: string;
};

const ICON_MAP: Record<NotificationType, IconConfig> = {
  expense_due: { Icon: CalendarX, iconColor: colors.danger, circleColor: colors.dangerLight },
  income_pending: { Icon: ClockCountdown, iconColor: WARNING_COLOR, circleColor: WARNING_LIGHT_COLOR },
  monthly_summary: { Icon: ChartBar, iconColor: colors.info, circleColor: colors.infoLight },
  negative_balance: { Icon: TrendDown, iconColor: colors.danger, circleColor: colors.dangerLight },
};

function getRelativeTime(date: Date | string): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMin < 60) return `há ${diffMin} min`;
  if (diffH < 24) return `há ${diffH} h`;
  return `há ${diffDays} dias`;
}

type NotificationItemProps = {
  notification: Notification;
  onPress?: () => void;
};

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const { Icon, iconColor, circleColor } = ICON_MAP[notification.type];
  const relativeTime = getRelativeTime(notification.createdAt);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={notification.title}
      style={[styles.container, !notification.isRead && styles.containerUnread]}
    >
      <View style={[styles.iconCircle, { backgroundColor: circleColor }]}>
        <Icon size={16} color={iconColor} weight="regular" />
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {notification.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={styles.time}>{relativeTime}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.lg,   // aumentado de md (12) para lg (16)
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    gap: spacing.lg,
  },
  containerUnread: {
    backgroundColor: '#fafafa',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: fs.md,
    fontWeight: fw.semibold,
    color: colors.content,
  },
  body: {
    fontSize: fs.sm,
    fontWeight: fw.regular,
    color: colors.subcontent,
  },
  time: {
    fontSize: fs.xs,
    fontWeight: fw.regular,
    color: colors.muted,
  },
});