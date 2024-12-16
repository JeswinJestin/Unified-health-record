import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // In a real app, fetch record details based on id
  const record = {
    id: id,
    type: 'Blood Test',
    category: 'Blood Tests',
    date: '2024-01-15',
    title: 'Complete Blood Count',
    description: 'Routine blood work including hemoglobin, WBC, platelets',
    fileType: 'pdf',
    fileUrl: '/reports/cbc.pdf',
    results: [
      { parameter: 'Hemoglobin', value: '14.5', unit: 'g/dL', status: 'normal' },
      { parameter: 'WBC', value: '7.8', unit: 'K/µL', status: 'normal' },
      { parameter: 'Platelets', value: '250', unit: 'K/µL', status: 'normal' }
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={MEDI_COLORS.PRIMARY.TEAL_1} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Record Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.recordCard}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{record.title}</Text>
            <Text style={styles.date}>{record.date}</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Type</Text>
              <Text style={styles.value}>{record.type}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.value}>{record.category}</Text>
            </View>
          </View>

          <Text style={styles.description}>{record.description}</Text>

          {record.results && (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>Test Results</Text>
              {record.results.map((result, index) => (
                <View key={index} style={styles.resultItem}>
                  <Text style={styles.parameterName}>{result.parameter}</Text>
                  <View style={styles.valueContainer}>
                    <Text style={[
                      styles.parameterValue,
                      styles[`${result.status}Value`]
                    ]}>
                      {result.value} {result.unit}
                    </Text>
                    <View style={[styles.statusBadge, styles[`${result.status}Badge`]]}>
                      <Text style={styles.statusText}>{result.status}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.viewFileButton}>
            <MaterialCommunityIcons name="file-document" size={20} color="#FFFFFF" />
            <Text style={styles.viewFileText}>View Full Report</Text>
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
    padding: 15,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoItem: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: MEDI_COLORS.PRIMARY.TEAL_2,
  },
  description: {
    fontSize: 14,
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
    marginBottom: 20,
    lineHeight: 20,
  },
  resultsSection: {
    borderTopWidth: 1,
    borderTopColor: MEDI_COLORS.NEUTRAL.MEDIUM_GRAY,
    paddingTop: 20,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
    marginBottom: 15,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  parameterName: {
    fontSize: 14,
    color: MEDI_COLORS.PRIMARY.TEAL_2,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  parameterValue: {
    fontSize: 14,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  normalValue: {
    color: MEDI_COLORS.SECONDARY.HEALTH_GREEN,
  },
  normalBadge: {
    backgroundColor: MEDI_COLORS.SECONDARY.HEALTH_GREEN + '20',
  },
  highValue: {
    color: MEDI_COLORS.SECONDARY.ALERT_RED,
  },
  highBadge: {
    backgroundColor: MEDI_COLORS.SECONDARY.ALERT_RED + '20',
  },
  lowValue: {
    color: MEDI_COLORS.SECONDARY.CARE_BLUE,
  },
  lowBadge: {
    backgroundColor: MEDI_COLORS.SECONDARY.CARE_BLUE + '20',
  },
  statusText: {
    fontSize: 12,
    color: MEDI_COLORS.PRIMARY.TEAL_2,
    textTransform: 'capitalize',
  },
  viewFileButton: {
    backgroundColor: MEDI_COLORS.PRIMARY.TEAL_1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  viewFileText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 