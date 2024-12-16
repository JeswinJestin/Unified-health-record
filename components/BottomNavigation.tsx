import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MEDI_COLORS = {
  PRIMARY: {
    TEAL_1: '#0D6C7E',
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
    return pathname === `/(tabs)${path}`;
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
          color={isActive('/') ? MEDI_COLORS.PRIMARY.TEAL_1 : MEDI_COLORS.NEUTRAL.DARK_GRAY} 
        />
        <Text style={[styles.bottomNavItemText, isActive('/') && styles.activeText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.bottomNavItem} 
        onPress={() => handlePress('records')}
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
        onPress={() => handlePress('notifications')}
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
        onPress={() => handlePress('profile')}
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
    color: MEDI_COLORS.PRIMARY.TEAL_1,
  },
}); 