import React, { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { colors } from '@/constants';
import { Header } from '@/components/Header';
import { EmptyState } from '@/components/EmptyState';
import { NotificationItem } from '@/components/NotificationItem';
import { useNotifications } from '@/store/NotificationContext';
import { Notification } from '@/types/notification';
import { useLanguage } from '@/store/LanguageContext';

export function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markAsRead } = useNotifications();
  const { t } = useLanguage();

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
        title={t('notifications.title')}
        variant="screen"
        theme="light"
        showBackButton
        onBackPress={() => router.back()}
      />

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            image={require('@/assets/images/Notification.png')}
            title={t('notifications.emptyTitle')}
            subtitle={t('notifications.emptySubtitle')}
          />
        }
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
    backgroundColor: colors.white,
  },
  list: {
    flex: 1,
  },
  listContentEmpty: {
    flex: 1,
  },
});
