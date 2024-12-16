import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MEDI_COLORS = {
  PRIMARY: {
    TEAL_1: '#0D6C7E',
    TEAL_2: '#08505D',
  },
  SECONDARY: {
    HEALTH_GREEN: '#2ECC71',
    CARE_BLUE: '#4A90E2',
  },
  NEUTRAL: {
    LIGHT_GRAY: '#F4F4F4',
    MEDIUM_GRAY: '#E0E0E0',
    DARK_GRAY: '#ADADAD'
  }
};

interface MealPlan {
  time: string;
  meal: string;
  calories: number;
  items: string[];
}

export default function FreeDietPlanScreen() {
  const router = useRouter();
  
  const dailyPlan: MealPlan[] = [
    {
      time: '7:00 AM',
      meal: 'Breakfast',
      calories: 400,
      items: [
        'Oatmeal with fruits (300 cal)',
        'Greek yogurt (100 cal)',
        'Green tea or black coffee (0 cal)'
      ]
    },
    {
      time: '10:30 AM',
      meal: 'Mid-Morning Snack',
      calories: 150,
      items: [
        'Mixed nuts (100 cal)',
        'Apple (50 cal)'
      ]
    },
    {
      time: '1:00 PM',
      meal: 'Lunch',
      calories: 500,
      items: [
        'Grilled chicken breast (250 cal)',
        'Brown rice (150 cal)',
        'Steamed vegetables (100 cal)'
      ]
    },
    {
      time: '4:30 PM',
      meal: 'Evening Snack',
      calories: 150,
      items: [
        'Whole grain crackers (100 cal)',
        'Hummus (50 cal)'
      ]
    },
    {
      time: '7:30 PM',
      meal: 'Dinner',
      calories: 400,
      items: [
        'Fish/Tofu (200 cal)',
        'Quinoa (100 cal)',
        'Mixed salad (100 cal)'
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={MEDI_COLORS.PRIMARY.TEAL_1} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Basic Healthy Diet</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Daily Calorie Target</Text>
          <Text style={styles.calorieText}>1600 calories</Text>
          <Text style={styles.summaryDescription}>
            This balanced meal plan is designed for an average adult maintaining a healthy weight.
            Adjust portions based on your specific needs.
          </Text>
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Key Guidelines</Text>
          <View style={styles.tipItem}>
            <MaterialCommunityIcons name="water" size={20} color={MEDI_COLORS.SECONDARY.CARE_BLUE} />
            <Text style={styles.tipText}>Drink 8-10 glasses of water daily</Text>
          </View>
          <View style={styles.tipItem}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={MEDI_COLORS.SECONDARY.CARE_BLUE} />
            <Text style={styles.tipText}>Maintain consistent meal timings</Text>
          </View>
          <View style={styles.tipItem}>
            <MaterialCommunityIcons name="food-apple" size={20} color={MEDI_COLORS.SECONDARY.CARE_BLUE} />
            <Text style={styles.tipText}>Include fruits and vegetables in every meal</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Daily Meal Plan</Text>
        {dailyPlan.map((meal, index) => (
          <View key={index} style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <View>
                <Text style={styles.mealTime}>{meal.time}</Text>
                <Text style={styles.mealName}>{meal.meal}</Text>
              </View>
              <View style={styles.caloriesBadge}>
                <Text style={styles.caloriesText}>{meal.calories} cal</Text>
              </View>
            </View>
            <View style={styles.mealItems}>
              {meal.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.mealItem}>
                  <MaterialCommunityIcons name="circle-small" size={20} color={MEDI_COLORS.PRIMARY.TEAL_1} />
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>Want a Personalized Plan?</Text>
          <Text style={styles.upgradeText}>
            Upgrade to premium for customized meal plans based on your specific needs and goals.
          </Text>
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.upgradeButtonText}>Explore Premium Plans</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: MEDI_COLORS.NEUTRAL.MEDIUM_GRAY,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_1,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
    marginBottom: 8,
  },
  calorieText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: MEDI_COLORS.SECONDARY.HEALTH_GREEN,
    marginBottom: 8,
  },
  summaryDescription: {
    fontSize: 14,
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: MEDI_COLORS.PRIMARY.TEAL_2,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
    marginBottom: 15,
    marginTop: 10,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTime: {
    fontSize: 14,
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
  },
  caloriesBadge: {
    backgroundColor: MEDI_COLORS.SECONDARY.HEALTH_GREEN + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  caloriesText: {
    color: MEDI_COLORS.SECONDARY.HEALTH_GREEN,
    fontWeight: 'bold',
  },
  mealItems: {
    marginTop: 8,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
  },
  upgradeCard: {
    backgroundColor: MEDI_COLORS.PRIMARY.TEAL_1,
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  upgradeText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 15,
  },
  upgradeButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: MEDI_COLORS.PRIMARY.TEAL_1,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 