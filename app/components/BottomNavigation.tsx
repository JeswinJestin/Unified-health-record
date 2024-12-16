import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MEDI_COLORS = {
  PRIMARY: {
    TEAL_1: '#0D6C7E',
  },
  SECONDARY: {
    CARE_BLUE: '#4A90E2',
    HEALTH_GREEN: '#2ECC71',
    ALERT_RED: '#E74C3C'
  },
  NEUTRAL: {
    DARK_GRAY: '#ADADAD',
  },
};

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = (destination: string) => {
    if (destination === '/') {
      router.replace('/(tabs)');
    } else {
      router.replace(`/(tabs)/${destination}`);
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/(tabs)') return true;
    if (path === 'records' && pathname?.includes('/records')) return true;
    if (path === 'notifications' && pathname?.includes('/notifications')) return true;
    if (path === 'profile' && pathname?.includes('/profile')) return true;
    return false;
  };

  return (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity 
        style={styles.bottomNavItem} 
        onPress={() => handlePress('/')}
      >
        <MaterialCommunityIcons 
          name="home" 
          size={24} 
          color={isActive('/') ? MEDI_COLORS.SECONDARY.HEALTH_GREEN : MEDI_COLORS.PRIMARY.TEAL_1}
        />
        <Text style={[
          styles.bottomNavItemText,
          isActive('/') && styles.activeText
        ]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.bottomNavItem} 
        onPress={() => handlePress('records')}
      >
        <MaterialCommunityIcons 
          name="clipboard-text-outline" 
          size={24} 
          color={isActive('records') ? MEDI_COLORS.SECONDARY.HEALTH_GREEN : MEDI_COLORS.PRIMARY.TEAL_1}
        />
        <Text style={[
          styles.bottomNavItemText,
          isActive('records') && styles.activeText
        ]}>Records</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.bottomNavItem} 
        onPress={() => handlePress('notifications')}
      >
        <MaterialCommunityIcons 
          name="bell-outline" 
          size={24} 
          color={isActive('notifications') ? MEDI_COLORS.SECONDARY.HEALTH_GREEN : MEDI_COLORS.PRIMARY.TEAL_1}
        />
        <Text style={[
          styles.bottomNavItemText,
          isActive('notifications') && styles.activeText
        ]}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.bottomNavItem} 
        onPress={() => handlePress('profile')}
      >
        <MaterialCommunityIcons 
          name="account-outline" 
          size={24} 
          color={isActive('profile') ? MEDI_COLORS.SECONDARY.HEALTH_GREEN : MEDI_COLORS.PRIMARY.TEAL_1}
        />
        <Text style={[
          styles.bottomNavItemText,
          isActive('profile') && styles.activeText
        ]}>Profile</Text>
      </TouchableOpacity>
    </View>
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
    color: MEDI_COLORS.SECONDARY.HEALTH_GREEN,
  },
}); 