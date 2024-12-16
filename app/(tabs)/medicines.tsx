import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

const MEDI_COLORS = {
  PRIMARY: {
    TEAL_1: '#0D6C7E',
    TEAL_2: '#08505D',
    TEAL_3: '#04282E'
  },
  SECONDARY: {
    CARE_BLUE: '#4A90E2',
    HEALTH_GREEN: '#2ECC71',
    ALERT_RED: '#E74C3C'
  },
  NEUTRAL: {
    LIGHT_GRAY: '#F4F4F4',
    MEDIUM_GRAY: '#E0E0E0',
    DARK_GRAY: '#ADADAD'
  }
};

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  timing: string[];
  category: string;
  instructions: string;
  remainingDays: number;
  reminderEnabled: boolean;
}

export default function MedicinesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Metformin',
      dosage: '500mg',
      timing: ['Morning', 'Night'],
      category: 'Diabetes',
      instructions: 'Take after meals',
      remainingDays: 15,
      reminderEnabled: true
    },
    {
      id: '2',
      name: 'Amlodipine',
      dosage: '5mg',
      timing: ['Morning'],
      category: 'Blood Pressure',
      instructions: 'Take on empty stomach',
      remainingDays: 20,
      reminderEnabled: true
    },
    {
      id: '3',
      name: 'Aspirin',
      dosage: '81mg',
      timing: ['Morning'],
      category: 'Heart',
      instructions: 'Take with food',
      remainingDays: 30,
      reminderEnabled: true
    },
    {
      id: '4',
      name: 'Vitamin D3',
      dosage: '2000 IU',
      timing: ['Morning'],
      category: 'Supplements',
      instructions: 'Take with fatty meal',
      remainingDays: 45,
      reminderEnabled: false
    },
    {
      id: '5',
      name: 'Atorvastatin',
      dosage: '20mg',
      timing: ['Night'],
      category: 'Heart',
      instructions: 'Take at bedtime',
      remainingDays: 25,
      reminderEnabled: true
    }
  ]);

  const categories = ['all', 'Diabetes', 'Blood Pressure', 'Heart', 'Supplements'];

  const toggleReminder = async (medicineId: string) => {
    const medicine = medicines.find(m => m.id === medicineId);
    if (medicine) {
      if (!medicine.reminderEnabled) {
        // Request notification permissions
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please enable notifications to set reminders');
          return;
        }
      }
      
      setMedicines(medicines.map(m => 
        m.id === medicineId 
          ? { ...m, reminderEnabled: !m.reminderEnabled }
          : m
      ));
    }
  };

  const addNewMedicine = () => {
    router.push('/(tabs)/addMedicine');
  };

  const deleteMedicine = (medicineId: string) => {
    Alert.alert(
      'Delete Medicine',
      'Are you sure you want to delete this medicine?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => setMedicines(medicines.filter(m => m.id !== medicineId)),
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>Medicines</Text>
          <TouchableOpacity onPress={addNewMedicine} style={styles.addButton}>
            <MaterialCommunityIcons name="plus" size={24} color={MEDI_COLORS.PRIMARY.TEAL_1} />
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText
              ]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Medicine List */}
        <View style={styles.medicineList}>
          {medicines
            .filter(m => selectedCategory === 'all' || m.category === selectedCategory)
            .map(medicine => (
              <View key={medicine.id} style={styles.medicineCard}>
                <View style={styles.medicineHeader}>
                  <View>
                    <Text style={styles.medicineName}>{medicine.name}</Text>
                    <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
                  </View>
                  <View style={styles.medicineActions}>
                    <TouchableOpacity 
                      onPress={() => toggleReminder(medicine.id)}
                      style={styles.reminderButton}
                    >
                      <MaterialCommunityIcons 
                        name={medicine.reminderEnabled ? "bell" : "bell-off"} 
                        size={20} 
                        color={medicine.reminderEnabled ? MEDI_COLORS.SECONDARY.CARE_BLUE : MEDI_COLORS.NEUTRAL.DARK_GRAY} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => deleteMedicine(medicine.id)}
                      style={styles.deleteButton}
                    >
                      <MaterialCommunityIcons 
                        name="delete-outline" 
                        size={20} 
                        color={MEDI_COLORS.SECONDARY.ALERT_RED} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.timingContainer}>
                  {medicine.timing.map((time, index) => (
                    <View key={index} style={styles.timingBadge}>
                      <Text style={styles.timingText}>{time}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.instructions}>{medicine.instructions}</Text>
                <Text style={styles.remaining}>
                  Remaining: {medicine.remainingDays} days
                </Text>
              </View>
            ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    padding: 8,
  },
  categoryContainer: {
    padding: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: MEDI_COLORS.NEUTRAL.MEDIUM_GRAY,
  },
  selectedCategory: {
    backgroundColor: MEDI_COLORS.PRIMARY.TEAL_1,
    borderColor: MEDI_COLORS.PRIMARY.TEAL_1,
  },
  categoryText: {
    color: MEDI_COLORS.PRIMARY.TEAL_2,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  medicineList: {
    padding: 15,
  },
  medicineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
  },
  medicineDosage: {
    fontSize: 14,
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
    marginTop: 4,
  },
  medicineActions: {
    flexDirection: 'row',
  },
  reminderButton: {
    padding: 5,
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  timingContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  timingBadge: {
    backgroundColor: MEDI_COLORS.SECONDARY.CARE_BLUE + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 8,
  },
  timingText: {
    color: MEDI_COLORS.SECONDARY.CARE_BLUE,
    fontSize: 12,
  },
  instructions: {
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
    fontSize: 14,
    marginTop: 10,
  },
  remaining: {
    color: MEDI_COLORS.SECONDARY.HEALTH_GREEN,
    fontSize: 12,
    marginTop: 8,
  },
}); 