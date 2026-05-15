import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Bell } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';
import { Header } from '@/components/Header';
import { NotificationItem } from '@/components/NotificationItem';
import { useNotifications } from '@/store/NotificationContext';
import { Notification } from '@/types/notification';

function EmptyNotifications() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIconCircle}>
        <Bell size={40} color={colors.muted} weight="regular" />
      </View>
      <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
      <Text style={styles.emptySubtitle}>Você está em dia com tudo por aqui.</Text>
    </View>
  );
}

export function NotificationsScreen() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const sorted = [...notifications].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  const renderItem = useCallback<ListRenderItem<Notification>>(
    ({ item }) => (
      <NotificationItem
        notification={item}
        onPress={() => markAsRead(item.id)}
      />
    ),
    [markAsRead],
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />

      <Header
        title="Notificações"
        variant="screen"
        theme="light"
        showBackButton
        onBackPress={() => router.back()}
      />

      {unreadCount > 0 && (
        <TouchableOpacity
          onPress={markAllAsRead}
          style={styles.markAllRow}
          accessibilityRole="button"
          accessibilityLabel="Marcar todas as notificações como lidas"
        >
          <Text style={styles.markAllLabel}>Marcar todas como lidas</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyNotifications />}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={sorted.length === 0 ? styles.listContentEmpty : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  markAllRow: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  markAllLabel: {
    fontSize: fs.sm,
    fontWeight: fw.medium,
    color: colors.primary,
  },
  list: {
    flex: 1,
  },
  listContentEmpty: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 110,
    paddingHorizontal: spacing.xxxl,
    gap: spacing.md,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: fs.lg,
    fontWeight: fw.bold,
    color: colors.content,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.subcontent,
    textAlign: 'center',
  },
});
