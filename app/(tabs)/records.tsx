import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNavigation from '../../components/BottomNavigation';

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

interface HealthRecord {
  id: string;
  type: string;
  category: string;
  date: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'image' | 'signal';
  fileUrl: string;
  results?: {
    parameter: string;
    value: string;
    unit: string;
    status: 'normal' | 'high' | 'low';
  }[];
}

export default function RecordsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all',
    'Blood Tests',
    'Imaging',
    'Signals',
    'Reports',
    'Prescriptions'
  ];

  const records: HealthRecord[] = [
    {
      id: '1',
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
    },
    {
      id: '2',
      type: 'X-Ray',
      category: 'Imaging',
      date: '2024-01-10',
      title: 'Chest X-Ray',
      description: 'Annual chest examination',
      fileType: 'image',
      fileUrl: '/images/xray.jpg'
    },
    {
      id: '3',
      type: 'ECG',
      category: 'Signals',
      date: '2024-01-05',
      title: 'ECG Report',
      description: 'Routine ECG examination',
      fileType: 'signal',
      fileUrl: '/signals/ecg.pdf'
    }
  ];

  const renderRecordCard = (record: HealthRecord) => (
    <TouchableOpacity 
      key={record.id} 
      style={styles.recordCard}
      onPress={() => router.push({
        pathname: '/(tabs)/records/[id]',
        params: { id: record.id }
      })}
    >
      <View style={styles.recordHeader}>
        <MaterialCommunityIcons 
          name={
            record.fileType === 'pdf' ? 'file-document' :
            record.fileType === 'image' ? 'image' : 'chart-line'
          } 
          size={24} 
          color={MEDI_COLORS.PRIMARY.TEAL_1} 
        />
        <View style={styles.recordInfo}>
          <Text style={styles.recordTitle}>{record.title}</Text>
          <Text style={styles.recordDate}>{record.date}</Text>
        </View>
      </View>

      <Text style={styles.recordDescription}>{record.description}</Text>

      {record.results && (
        <View style={styles.resultsContainer}>
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
                <Text style={[
                  styles.statusIndicator,
                  styles[`${result.status}Status`]
                ]}>
                  {result.status.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Health Records</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <MaterialCommunityIcons name="upload" size={24} color={MEDI_COLORS.PRIMARY.TEAL_1} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
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
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.recordsList}>
        {records
          .filter(record => selectedCategory === 'all' || record.category === selectedCategory)
          .map(record => renderRecordCard(record))}
      </ScrollView>

      <BottomNavigation />
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
  uploadButton: {
    padding: 8,
  },
  categoriesContainer: {
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
  recordsList: {
    padding: 15,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordInfo: {
    marginLeft: 10,
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
  },
  recordDate: {
    fontSize: 12,
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
    marginTop: 2,
  },
  recordDescription: {
    fontSize: 14,
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
    marginBottom: 10,
  },
  resultsContainer: {
    borderTopWidth: 1,
    borderTopColor: MEDI_COLORS.NEUTRAL.MEDIUM_GRAY,
    paddingTop: 10,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    marginRight: 8,
  },
  statusIndicator: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  normalValue: {
    color: MEDI_COLORS.SECONDARY.HEALTH_GREEN,
  },
  normalStatus: {
    backgroundColor: MEDI_COLORS.SECONDARY.HEALTH_GREEN + '20',
    color: MEDI_COLORS.SECONDARY.HEALTH_GREEN,
  },
  highValue: {
    color: MEDI_COLORS.SECONDARY.ALERT_RED,
  },
  highStatus: {
    backgroundColor: MEDI_COLORS.SECONDARY.ALERT_RED + '20',
    color: MEDI_COLORS.SECONDARY.ALERT_RED,
  },
  lowValue: {
    color: MEDI_COLORS.SECONDARY.CARE_BLUE,
  },
  lowStatus: {
    backgroundColor: MEDI_COLORS.SECONDARY.CARE_BLUE + '20',
    color: MEDI_COLORS.SECONDARY.CARE_BLUE,
  },
});
