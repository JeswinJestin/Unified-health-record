import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/firebase/config'; // Adjust this import path based on your firebase config location

const MEDI_COLORS = {
  PRIMARY: {
    TEAL_1: '#0D6C7E',
  },
  NEUTRAL: {
    DARK_GRAY: '#ADADAD',
  },
};

function CustomBottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === `/(tabs)${path}`;

  return (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity 
        style={styles.bottomNavItem} 
        onPress={() => router.replace('/(tabs)/home')}
      >
        <MaterialCommunityIcons 
          name="home" 
          size={24} 
          color={isActive('/home') ? MEDI_COLORS.PRIMARY.TEAL_1 : MEDI_COLORS.NEUTRAL.DARK_GRAY} 
        />
        <Text style={[styles.bottomNavItemText, isActive('/home') && styles.activeText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.bottomNavItem} 
        onPress={() => router.replace('/(tabs)/records')}
      >
        <MaterialCommunityIcons 
          name="clipboard-text-outline" 
          size={24} 
          color={isActive('/records') ? MEDI_COLORS.PRIMARY.TEAL_1 : MEDI_COLORS.NEUTRAL.DARK_GRAY} 
        />
        <Text style={[styles.bottomNavItemText, isActive('/records') && styles.activeText]}>Records</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.bottomNavItem} 
        onPress={() => router.replace('/(tabs)/notifications')}
      >
        <MaterialCommunityIcons 
          name="bell-outline" 
          size={24} 
          color={isActive('/notifications') ? MEDI_COLORS.PRIMARY.TEAL_1 : MEDI_COLORS.NEUTRAL.DARK_GRAY} 
        />
        <Text style={[styles.bottomNavItemText, isActive('/notifications') && styles.activeText]}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.bottomNavItem} 
        onPress={() => router.replace('/(tabs)/profile')}
      >
        <MaterialCommunityIcons 
          name="account-outline" 
          size={24} 
          color={isActive('/profile') ? MEDI_COLORS.PRIMARY.TEAL_1 : MEDI_COLORS.NEUTRAL.DARK_GRAY} 
        />
        <Text style={[styles.bottomNavItemText, isActive('/profile') && styles.activeText]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Redirect to login if user is not authenticated and not already on login/signup
      if (!user && pathname !== '/login' && pathname !== '/signup') {
        router.replace('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [pathname]);

  const hideNavigation = pathname === '/login' || pathname === '/signup';

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="records" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="healthReports" options={{ presentation: 'modal' }} />
        <Stack.Screen name="medicines" options={{ presentation: 'modal' }} />
        <Stack.Screen name="baymaxAI" options={{ presentation: 'modal' }} />
        <Stack.Screen name="aiInsights" options={{ presentation: 'modal' }} />
        <Stack.Screen name="dietPlan" options={{ presentation: 'modal' }} />
        <Stack.Screen name="emergency" options={{ presentation: 'modal' }} />
        <Stack.Screen name="addMedicine" options={{ presentation: 'modal' }} />
      </Stack>
      {!hideNavigation && <CustomBottomNavigation />}
    </>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNavItem: {
    alignItems: 'center',
  },
  bottomNavItemText: {
    fontSize: 12,
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
    marginTop: 4,
  },
  activeText: {
    color: MEDI_COLORS.PRIMARY.TEAL_1,
  },
});
