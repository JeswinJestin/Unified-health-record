import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  Alert 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MEDI_COLORS = {
  PRIMARY: {
    TEAL_1: '#0D6C7E',
    TEAL_2: '#08505D',
  },
  SECONDARY: {
    HEALTH_GREEN: '#2ECC71',
    CARE_BLUE: '#4A90E2',
    ALERT_RED: '#E74C3C'
  },
  NEUTRAL: {
    LIGHT_GRAY: '#F4F4F4',
    MEDIUM_GRAY: '#E0E0E0',
    DARK_GRAY: '#ADADAD'
  }
};

const { width } = Dimensions.get('window');

interface DietPlan {
  id: string;
  title: string;
  description: string;
  image: any;
  isPremium: boolean;
  price?: number;
  benefits?: string[];
}

export default function DietPlanScreen() {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const dietPlans: DietPlan[] = [
    {
      id: '1',
      title: 'Basic Healthy Diet',
      description: 'General healthy eating guidelines with basic meal plans',
      image: require('../../assets/images/health1.jpg'),
      isPremium: false,
    },
    {
      id: '2',
      title: 'Premium Weight Loss Plan',
      description: 'Personalized weight loss diet with detailed meal plans',
      image: require('../../assets/images/health2.jpg'),
      isPremium: true,
      price: 29.99,
      benefits: [
        'Personalized meal plans',
        'Weekly shopping lists',
        'Recipe alternatives',
        'Nutritionist support'
      ]
    },
    {
      id: '3',
      title: 'Premium Diabetic Diet',
      description: 'Specialized diet plan for managing diabetes',
      image: require('../../assets/images/health1.jpg'),
      isPremium: true,
      price: 39.99,
      benefits: [
        'Blood sugar optimized meals',
        'Carb counting guides',
        'Diabetes-friendly recipes',
        'Expert consultation'
      ]
    }
  ];

  const handlePurchase = (plan: DietPlan) => {
    Alert.alert(
      'Premium Plan',
      `Would you like to purchase ${plan.title} for $${plan.price}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Buy Now',
          onPress: () => initiatePayment(plan)
        }
      ]
    );
  };

  const initiatePayment = (plan: DietPlan) => {
    // TODO: Implement payment gateway integration
    Alert.alert('Payment', 'Payment gateway integration to be implemented');
  };

  const renderPlanCard = (plan: DietPlan) => (
    <View key={plan.id} style={styles.planCard}>
      <Image source={plan.image} style={styles.planImage} />
      <View style={styles.planContent}>
        <View style={styles.planHeader}>
          <Text style={styles.planTitle}>{plan.title}</Text>
          {plan.isPremium && (
            <View style={styles.premiumBadge}>
              <MaterialCommunityIcons name="crown" size={16} color="#FFD700" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>
        <Text style={styles.planDescription}>{plan.description}</Text>
        
        {plan.isPremium && plan.benefits && (
          <View style={styles.benefitsContainer}>
            {plan.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <MaterialCommunityIcons name="check-circle" size={16} color={MEDI_COLORS.SECONDARY.HEALTH_GREEN} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={[
            styles.actionButton,
            plan.isPremium ? styles.premiumButton : styles.freeButton
          ]}
          onPress={() => plan.isPremium ? handlePurchase(plan) : router.push('/(tabs)/dietPlan/free')}
        >
          <Text style={styles.actionButtonText}>
            {plan.isPremium ? `Unlock for $${plan.price}` : 'View Plan'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Diet Plans</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerTitle}>Premium Diet Plans</Text>
          <Text style={styles.bannerText}>
            Get personalized diet plans tailored to your health goals
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {dietPlans.map(renderPlanCard)}
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  bannerContainer: {
    backgroundColor: MEDI_COLORS.PRIMARY.TEAL_1,
    padding: 20,
    margin: 15,
    borderRadius: 15,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  plansContainer: {
    padding: 15,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  planImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  planContent: {
    padding: 15,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
    flex: 1,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    color: '#FFB100',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  planDescription: {
    fontSize: 14,
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
    marginBottom: 12,
  },
  benefitsContainer: {
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 14,
    color: MEDI_COLORS.PRIMARY.TEAL_2,
    marginLeft: 8,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  premiumButton: {
    backgroundColor: MEDI_COLORS.SECONDARY.HEALTH_GREEN,
  },
  freeButton: {
    backgroundColor: MEDI_COLORS.SECONDARY.CARE_BLUE,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 