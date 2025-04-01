import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/firebase/config';

export default function SplashScreen() {
  const fadeAnim = new Animated.Value(1);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // First show the splash screen for 2 seconds
    const splashTimer = setTimeout(() => {
      // Start fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        // After fade out, check auth state and redirect
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in, redirect to home
            console.log('User is signed in, redirecting to home');
            router.replace('/(tabs)/home');
          } else {
            // No user is signed in, redirect to login
            console.log('No user is signed in, redirecting to login');
            router.replace('/(tabs)/login');
          }
          setIsLoading(false);
        });

        // Clean up the auth listener
        return () => unsubscribe();
      });
    }, 2000);

    return () => clearTimeout(splashTimer);
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
      {isLoading && (
        <ActivityIndicator 
          style={styles.loader} 
          size="large" 
          color="#0D6C7E" 
        />
      )}
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
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#0D6C7E',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 18,
  },
  logo: {
    width: '125%',
    height: '125%',
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0D6C7E',
    letterSpacing: 1,
  },
  loader: {
    marginTop: 30,
  },
});
