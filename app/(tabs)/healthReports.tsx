import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
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

type VitalMetric = 'bp' | 'sugar' | 'cholesterol';

interface VitalData {
  labels: string[];
  datasets: Array<{
    data: number[];
  }>;
}

interface VitalStat {
  current: string;
  status: string;
  unit?: string;
  data: VitalData;
}

interface VitalStats {
  [key: string]: VitalStat;
}

export default function HealthReportsScreen() {
  const router = useRouter();
  const [selectedMetric, setSelectedMetric] = useState<VitalMetric>('bp');

  const vitalStats = {
    bp: {
      current: '120/80',
      status: 'Normal',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          data: [120, 122, 118, 121, 120, 119],
        }]
      }
    },
    sugar: {
      current: '99',
      status: 'Normal',
      unit: 'mg/dL',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          data: [95, 98, 102, 99, 97, 99],
        }]
      }
    },
    cholesterol: {
      current: '180',
      status: 'Good',
      unit: 'mg/dL',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          data: [190, 185, 182, 180, 178, 180],
        }]
      }
    }
  };

  const healthUpdates = [
    {
      type: 'improvement',
      title: 'Blood Pressure Stabilized',
      description: 'Your BP has remained in the normal range for the last 3 months',
      date: '2023-07-15'
    },
    {
      type: 'diagnosis',
      title: 'Vitamin D Deficiency',
      description: 'Prescribed supplements and increased sun exposure recommended',
      date: '2023-06-01'
    },
    {
      type: 'lifestyle',
      title: 'Diet Plan Update',
      description: 'New low-sodium diet plan showing positive results',
      date: '2023-05-15'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>Health Reports</Text>
        </View>

        {/* Vital Statistics Cards */}
        <View style={styles.vitalStatsContainer}>
          <TouchableOpacity 
            style={[styles.vitalCard, selectedMetric === 'bp' && styles.selectedCard]}
            onPress={() => setSelectedMetric('bp')}
          >
            <MaterialCommunityIcons name="heart-pulse" size={24} color={MEDI_COLORS.SECONDARY.CARE_BLUE} />
            <Text style={styles.vitalTitle}>Blood Pressure</Text>
            <Text style={styles.vitalValue}>{vitalStats.bp.current}</Text>
            <Text style={styles.vitalStatus}>{vitalStats.bp.status}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.vitalCard, selectedMetric === 'sugar' && styles.selectedCard]}
            onPress={() => setSelectedMetric('sugar')}
          >
            <MaterialCommunityIcons name="water" size={24} color={MEDI_COLORS.SECONDARY.HEALTH_GREEN} />
            <Text style={styles.vitalTitle}>Blood Sugar</Text>
            <Text style={styles.vitalValue}>{vitalStats.sugar.current}</Text>
            <Text style={styles.vitalStatus}>{vitalStats.sugar.status}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.vitalCard, selectedMetric === 'cholesterol' && styles.selectedCard]}
            onPress={() => setSelectedMetric('cholesterol')}
          >
            <MaterialCommunityIcons name="chart-line" size={24} color={MEDI_COLORS.SECONDARY.ALERT_RED} />
            <Text style={styles.vitalTitle}>Cholesterol</Text>
            <Text style={styles.vitalValue}>{vitalStats.cholesterol.current}</Text>
            <Text style={styles.vitalStatus}>{vitalStats.cholesterol.status}</Text>
          </TouchableOpacity>
        </View>

        {/* Trend Graph */}
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>6 Month Trend</Text>
          <LineChart
            data={vitalStats[selectedMetric].data}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(13, 108, 126, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            bezier
            style={styles.graph}
          />
        </View>

        {/* Health Updates */}
        <View style={styles.updatesContainer}>
          <Text style={styles.sectionTitle}>Health Updates</Text>
          {healthUpdates.map((update, index) => (
            <View key={index} style={styles.updateCard}>
              <MaterialCommunityIcons 
                name={update.type === 'improvement' ? 'trending-up' : 
                      update.type === 'diagnosis' ? 'medical-bag' : 'food-apple'} 
                size={24} 
                color={MEDI_COLORS.PRIMARY.TEAL_1}
              />
              <View style={styles.updateContent}>
                <Text style={styles.updateTitle}>{update.title}</Text>
                <Text style={styles.updateDescription}>{update.description}</Text>
                <Text style={styles.updateDate}>{update.date}</Text>
              </View>
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
    backgroundColor: '#F4F4F4',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D6C7E',
  },
  vitalStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    flexWrap: 'wrap',
  },
  vitalCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedCard: {
    borderColor: '#0D6C7E',
    borderWidth: 2,
  },
  vitalTitle: {
    fontSize: 14,
    color: '#ADADAD',
    marginTop: 8,
    textAlign: 'center',
  },
  vitalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D6C7E',
    marginTop: 4,
  },
  vitalStatus: {
    fontSize: 12,
    color: '#2ECC71',
    marginTop: 4,
  },
  graphContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D6C7E',
    marginBottom: 15,
  },
  graph: {
    borderRadius: 10,
    marginVertical: 8,
  },
  updatesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D6C7E',
    marginBottom: 15,
  },
  updateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  updateContent: {
    flex: 1,
    marginLeft: 15,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D6C7E',
    marginBottom: 4,
  },
  updateDescription: {
    fontSize: 14,
    color: '#ADADAD',
    marginBottom: 4,
  },
  updateDate: {
    fontSize: 12,
    color: '#ADADAD',
  },
}); 