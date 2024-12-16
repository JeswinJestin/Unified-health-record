import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const fadeAnim = new Animated.Value(1);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/login');
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/helping-hands-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.appName}>MEDICONNECT</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 200,  // Increased size for better visibility
    height: 200, // Increased size for better visibility
    borderRadius: 100, // Half of width/height for perfect circle
    borderWidth: 3,
    borderColor: '#0D9DAA', // Teal/turquoise color matching your logo
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    padding: 20, // Add padding to prevent image from touching the border
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0D9DAA', // Matching the border color
    letterSpacing: 2,
  },
});
