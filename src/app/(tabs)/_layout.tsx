import { Tabs } from 'expo-router';
import { Wallet, User } from 'phosphor-react-native';
import { colors, fontSize as fs } from '@/constants';
import { useLanguage } from '@/store/LanguageContext';

export default function TabLayout() {
  const { t } = useLanguage();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: fs.sm, // 14px
        },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.wallets'),
          tabBarIcon: ({ color, focused }) => (
            // `color` é calculado automaticamente pelo React Navigation
            // com base em tabBarActiveTintColor / tabBarInactiveTintColor
            <Wallet
              size={28}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, focused }) => (
            <User
              size={28}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />
    </Tabs>
  );
}