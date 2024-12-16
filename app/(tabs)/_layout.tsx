import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: 'Records',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.fill" color={color} />,
          tabBarButton: (props) => (
            <HapticTab 
              {...props} 
              onPress={() => {
                props.onPress?.();
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bell.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="signUp"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="healthReports"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="medicines"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="baymaxAI"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="aiInsights"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dietPlan"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="addMedicine"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
