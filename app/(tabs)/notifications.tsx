import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
// import BottomNavigation from '../../components/BottomNavigation';

const MEDI_COLORS = {
  PRIMARY: {
    TEAL_1: '#0D6C7E',
  },
  SECONDARY: {
    HEALTH_GREEN: '#2ECC71',
  },
  NEUTRAL: {
    LIGHT_GRAY: '#F4F4F4',
    MEDIUM_GRAY: '#E0E0E0',
  }
};

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
      </View>
      
      {/* Add your notifications content here */}
      
      {/* <BottomNavigation /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MEDI_COLORS.NEUTRAL.LIGHT_GRAY,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: MEDI_COLORS.NEUTRAL.MEDIUM_GRAY,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_1,
  },
});
