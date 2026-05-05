import { Tabs } from 'expo-router';
import { Wallet, User } from 'phosphor-react-native';
import { colors, fontSize as fs } from '@/constants';

export default function TabLayout() {
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
          title: 'Carteiras',
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
          title: 'Perfil',
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