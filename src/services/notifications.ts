import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification } from '@/types/notification';

function storageKey(userId: string): string {
  return `notifications:${userId}`;
}

async function readAll(userId: string): Promise<Notification[]> {
  const raw = await AsyncStorage.getItem(storageKey(userId));
  if (!raw) return [];
  const parsed = JSON.parse(raw) as (Omit<Notification, 'createdAt'> & { createdAt: string })[];
  return parsed.map((n) => ({ ...n, createdAt: new Date(n.createdAt) }));
}

async function writeAll(userId: string, notifications: Notification[]): Promise<void> {
  await AsyncStorage.setItem(storageKey(userId), JSON.stringify(notifications));
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  try {
    return await readAll(userId);
  } catch {
    return [];
  }
}

export async function saveNotification(
  userId: string,
  notification: Notification,
): Promise<void> {
  try {
    const current = await readAll(userId);
    await writeAll(userId, [notification, ...current]);
  } catch {
    // silently fail — notification persistence is non-critical
  }
}

export async function markAsRead(userId: string, notificationId: string): Promise<void> {
  try {
    const current = await readAll(userId);
    const updated = current.map((n) =>
      n.id === notificationId ? { ...n, isRead: true } : n,
    );
    await writeAll(userId, updated);
  } catch {
    // silently fail
  }
}

export async function markAllAsRead(userId: string): Promise<void> {
  try {
    const current = await readAll(userId);
    const updated = current.map((n) => ({ ...n, isRead: true }));
    await writeAll(userId, updated);
  } catch {
    // silently fail
  }
}

export async function clearNotifications(userId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(storageKey(userId));
  } catch {
    // silently fail
  }
}
