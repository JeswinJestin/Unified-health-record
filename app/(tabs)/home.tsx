import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

const MEDI_COLORS = {
  PRIMARY: {
    TEAL_1: '#0D6C7E',
    TEAL_2: '#08505D',
    TEAL_3: '#04282E'
  },
  SECONDARY: {
    CARE_BLUE: '#4A90E2',
    HEALTH_GREEN: '#2ECC71',
    ALERT_RED: '#E74C3C',
    BAYMAX_PURPLE: '#9B59B6',
    INSIGHTS_ORANGE: '#E67E22',
    DIET_YELLOW: '#F1C40F'
  },
  NEUTRAL: {
    LIGHT_GRAY: '#F4F4F4',
    MEDIUM_GRAY: '#E0E0E0',
    DARK_GRAY: '#ADADAD'
  }
};

export default function HomeScreen() {
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/login');
      } else {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const firstName = userData.fullName?.split(' ')[0] || 'User';
            setUserName(firstName);
          } else {
            setUserName('User');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserName('User');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePress = (destination: string) => {
    if (destination === 'records') {
      router.replace('/(tabs)/records');
    } else {
      router.push(`/(tabs)/${destination}` as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>{greeting}, {userName}!</Text>
        </View>

        {/* Dashboard Sections */}
        <View style={styles.dashboardSection}>
          <View style={[styles.dashboardCard, styles.healthReportsCard]}>
            <TouchableOpacity onPress={() => handlePress('healthReports')}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={32} color={MEDI_COLORS.PRIMARY.TEAL_1} />
              <Text style={styles.dashboardCardTitle}>Health Reports</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.dashboardCard, styles.medicinesCard]}>
            <TouchableOpacity onPress={() => handlePress('medicines')}>
              <MaterialCommunityIcons name="pill" size={32} color={MEDI_COLORS.PRIMARY.TEAL_1} />
              <Text style={styles.dashboardCardTitle}>Medicines</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.dashboardCard, styles.baymaxCard]}>
            <TouchableOpacity onPress={() => handlePress('baymaxAI')}>
              <MaterialCommunityIcons name="robot" size={32} color={MEDI_COLORS.PRIMARY.TEAL_1} />
              <Text style={styles.dashboardCardTitle}>Baymax AI</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.dashboardCard, styles.insightsCard]}>
            <TouchableOpacity onPress={() => handlePress('aiInsights')}>
              <MaterialCommunityIcons name="chart-line" size={32} color={MEDI_COLORS.PRIMARY.TEAL_1} />
              <Text style={styles.dashboardCardTitle}>AI Insights</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.dashboardCard, styles.dietCard]}>
            <TouchableOpacity onPress={() => handlePress('dietPlan')}>
              <MaterialCommunityIcons name="food-apple" size={32} color={MEDI_COLORS.PRIMARY.TEAL_1} />
              <Text style={styles.dashboardCardTitle}>Diet Plan</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.dashboardCard, styles.emergencyCard]}>
            <TouchableOpacity onPress={() => handlePress('emergency')}>
              <MaterialCommunityIcons name="ambulance" size={32} color={MEDI_COLORS.PRIMARY.TEAL_1} />
              <Text style={styles.dashboardCardTitle}>Emergency</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Articles Section */}
        <View style={styles.healthArticlesSection}>
          <Text style={styles.sectionTitle}>Health Articles</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.healthArticleCard}>
              <Image 
                source={require('../../assets/images/health1.jpg')} 
                style={styles.healthArticleImage}
                resizeMode="cover"
              />
              <Text style={styles.healthArticleTitle}>The 25 Healthiest Fruits You Can Eat</Text>
              <Text style={styles.healthArticleTime}>5 min read</Text>
            </View>
            <View style={styles.healthArticleCard}>
              <Image 
                source={require('../../assets/images/health2.jpg')} 
                style={styles.healthArticleImage}
                resizeMode="cover"
              />
              <Text style={styles.healthArticleTitle}>The Impact of COVID-19 on Healthcare Systems</Text>
              <Text style={styles.healthArticleTime}>5 min read</Text>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.seeMoreButton}>
            <Text style={styles.seeMoreButtonText}>See More</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => handlePress('/')}>
          <MaterialCommunityIcons name="home" size={24} color={MEDI_COLORS.PRIMARY.TEAL_1} />
          <Text style={styles.bottomNavItemText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => handlePress('records')}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={24} color={MEDI_COLORS.PRIMARY.TEAL_1} />
          <Text style={styles.bottomNavItemText}>Records</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => handlePress('/notifications')}>
          <MaterialCommunityIcons name="bell-outline" size={24} color={MEDI_COLORS.PRIMARY.TEAL_1} />
          <Text style={styles.bottomNavItemText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => handlePress('/profile')}>
          <MaterialCommunityIcons name="account-outline" size={24} color={MEDI_COLORS.PRIMARY.TEAL_1} />
          <Text style={styles.bottomNavItemText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MEDI_COLORS.NEUTRAL.LIGHT_GRAY,
  },
  greetingSection: {
    padding: 20,
    backgroundColor: MEDI_COLORS.NEUTRAL.LIGHT_GRAY,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
  },
  dashboardSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: MEDI_COLORS.NEUTRAL.LIGHT_GRAY,
  },
  dashboardCard: {
    width: (Dimensions.get('window').width - 60) / 3,
    height: 100,
    backgroundColor: MEDI_COLORS.NEUTRAL.MEDIUM_GRAY,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dashboardCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
    marginTop: 8,
  },
  healthReportsCard: {
    backgroundColor: MEDI_COLORS.SECONDARY.CARE_BLUE,
  },
  medicinesCard: {
    backgroundColor: MEDI_COLORS.SECONDARY.HEALTH_GREEN,
  },
  baymaxCard: {
    backgroundColor: MEDI_COLORS.SECONDARY.BAYMAX_PURPLE,
  },
  insightsCard: {
    backgroundColor: MEDI_COLORS.SECONDARY.INSIGHTS_ORANGE,
  },
  dietCard: {
    backgroundColor: MEDI_COLORS.SECONDARY.DIET_YELLOW,
  },
  emergencyCard: {
    backgroundColor: MEDI_COLORS.SECONDARY.ALERT_RED,
  },
  healthArticlesSection: {
    padding: 20,
    backgroundColor: MEDI_COLORS.NEUTRAL.LIGHT_GRAY,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
    marginBottom: 15,
  },
  healthArticleCard: {
    width: 250,
    backgroundColor: MEDI_COLORS.NEUTRAL.MEDIUM_GRAY,
    borderRadius: 10,
    marginRight: 20,
  },
  healthArticleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
    marginTop: 10,
    marginHorizontal: 10,
  },
  healthArticleTime: {
    fontSize: 12,
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  seeMoreButton: {
    backgroundColor: MEDI_COLORS.PRIMARY.TEAL_1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    alignSelf: 'center',
  },
  seeMoreButtonText: {
    color: MEDI_COLORS.NEUTRAL.LIGHT_GRAY,
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: MEDI_COLORS.NEUTRAL.LIGHT_GRAY,
    borderTopWidth: 1,
    borderTopColor: MEDI_COLORS.NEUTRAL.MEDIUM_GRAY,
    paddingVertical: 10,
  },
  bottomNavItem: {
    alignItems: 'center',
  },
  bottomNavItemText: {
    fontSize: 12,
    color: MEDI_COLORS.PRIMARY.TEAL_1,
    marginTop: 4,
  },
  healthArticlePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: MEDI_COLORS.NEUTRAL.MEDIUM_GRAY,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthArticleImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});