import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

export default function AddMedicineScreen() {
  const router = useRouter();
  const [medicine, setMedicine] = useState({
    name: '',
    dosage: '',
    category: '',
    instructions: '',
    timing: [] as string[],
    remainingDays: '',
  });

  const timingOptions = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const categoryOptions = ['Diabetes', 'Blood Pressure', 'Heart', 'Supplements', 'Pain Relief', 'Antibiotics'];

  const toggleTiming = (time: string) => {
    if (medicine.timing.includes(time)) {
      setMedicine({
        ...medicine,
        timing: medicine.timing.filter(t => t !== time)
      });
    } else {
      setMedicine({
        ...medicine,
        timing: [...medicine.timing, time]
      });
    }
  };

  const handleSubmit = () => {
    if (!medicine.name || !medicine.dosage || !medicine.category || medicine.timing.length === 0) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Pass the new medicine back to medicines screen
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={MEDI_COLORS.PRIMARY.TEAL_1} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Medicine</Text>
      </View>

      <ScrollView style={styles.form}>
        <Text style={styles.label}>Medicine Name*</Text>
        <TextInput
          style={styles.input}
          value={medicine.name}
          onChangeText={(text) => setMedicine({ ...medicine, name: text })}
          placeholder="Enter medicine name"
        />

        <Text style={styles.label}>Dosage*</Text>
        <TextInput
          style={styles.input}
          value={medicine.dosage}
          onChangeText={(text) => setMedicine({ ...medicine, dosage: text })}
          placeholder="e.g., 500mg"
        />

        <Text style={styles.label}>Category*</Text>
        <View style={styles.categoryContainer}>
          {categoryOptions.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                medicine.category === category && styles.selectedCategory
              ]}
              onPress={() => setMedicine({ ...medicine, category })}
            >
              <Text style={[
                styles.categoryText,
                medicine.category === category && styles.selectedCategoryText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Timing*</Text>
        <View style={styles.timingContainer}>
          {timingOptions.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timingButton,
                medicine.timing.includes(time) && styles.selectedTiming
              ]}
              onPress={() => toggleTiming(time)}
            >
              <Text style={[
                styles.timingText,
                medicine.timing.includes(time) && styles.selectedTimingText
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Instructions</Text>
        <TextInput
          style={[styles.input, styles.instructionsInput]}
          value={medicine.instructions}
          onChangeText={(text) => setMedicine({ ...medicine, instructions: text })}
          placeholder="Special instructions"
          multiline
        />

        <Text style={styles.label}>Days Supply</Text>
        <TextInput
          style={styles.input}
          value={medicine.remainingDays}
          onChangeText={(text) => setMedicine({ ...medicine, remainingDays: text })}
          placeholder="Number of days"
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Medicine</Text>
        </TouchableOpacity>
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
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: MEDI_COLORS.NEUTRAL.MEDIUM_GRAY,
  },
  instructionsInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: MEDI_COLORS.NEUTRAL.MEDIUM_GRAY,
    margin: 4,
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
  timingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  timingButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: MEDI_COLORS.NEUTRAL.MEDIUM_GRAY,
    margin: 4,
  },
  selectedTiming: {
    backgroundColor: MEDI_COLORS.SECONDARY.CARE_BLUE,
    borderColor: MEDI_COLORS.SECONDARY.CARE_BLUE,
  },
  timingText: {
    color: MEDI_COLORS.PRIMARY.TEAL_2,
  },
  selectedTimingText: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: MEDI_COLORS.PRIMARY.TEAL_1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 