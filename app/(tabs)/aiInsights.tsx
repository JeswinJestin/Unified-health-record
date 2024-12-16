import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
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

interface HealthInsight {
  id: string;
  type: 'prediction' | 'trend' | 'recommendation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  relatedMetrics: string[];
  action?: string;
}

export default function AIInsightsScreen() {
  const insights: HealthInsight[] = [
    {
      id: '1',
      type: 'prediction',
      title: 'Blood Pressure Trend Alert',
      description: 'Based on your recent blood pressure readings, there\'s a slight upward trend. While still within normal range, early lifestyle modifications could prevent future issues.',
      severity: 'low',
      relatedMetrics: ['Blood Pressure', 'Heart Rate'],
      action: 'Consider reducing sodium intake and increasing physical activity'
    },
    {
      id: '2',
      type: 'trend',
      title: 'Cholesterol Pattern Detected',
      description: 'Your LDL cholesterol shows seasonal variations. Higher readings are observed during winter months.',
      severity: 'medium',
      relatedMetrics: ['Cholesterol', 'Triglycerides'],
      action: 'Schedule follow-up with your doctor'
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Sleep Pattern Impact',
      description: 'Correlation detected between irregular sleep patterns and elevated stress markers.',
      severity: 'medium',
      relatedMetrics: ['Sleep Data', 'Cortisol Levels'],
      action: 'Implement regular sleep schedule'
    }
  ];

  const renderInsightCard = (insight: HealthInsight) => (
    <View key={insight.id} style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <MaterialCommunityIcons 
          name={
            insight.type === 'prediction' ? 'crystal-ball' :
            insight.type === 'trend' ? 'trending-up' : 'lightbulb'
          } 
          size={24} 
          color={MEDI_COLORS.PRIMARY.TEAL_1} 
        />
        <View style={styles.insightTitleContainer}>
          <Text style={styles.insightTitle}>{insight.title}</Text>
          <View style={[styles.severityBadge, styles[`severity${insight.severity}`]]}>
            <Text style={styles.severityText}>
              {insight.severity.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.insightDescription}>{insight.description}</Text>

      <View style={styles.metricsContainer}>
        {insight.relatedMetrics.map((metric, index) => (
          <View key={index} style={styles.metricBadge}>
            <Text style={styles.metricText}>{metric}</Text>
          </View>
        ))}
      </View>

      {insight.action && (
        <View style={styles.actionContainer}>
          <MaterialCommunityIcons name="arrow-right-circle" size={20} color={MEDI_COLORS.SECONDARY.CARE_BLUE} />
          <Text style={styles.actionText}>{insight.action}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>AI Health Insights</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Health Overview</Text>
          <Text style={styles.summaryText}>
            Based on your recent health data, our AI has generated personalized insights
            and recommendations for your well-being.
          </Text>
        </View>

        <View style={styles.insightsList}>
          {insights.map(insight => renderInsightCard(insight))}
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
    padding: 15,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
    lineHeight: 20,
  },
  insightsList: {
    gap: 15,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  insightTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
    marginBottom: 5,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  severitylow: {
    backgroundColor: MEDI_COLORS.SECONDARY.HEALTH_GREEN + '20',
  },
  severitymedium: {
    backgroundColor: MEDI_COLORS.SECONDARY.CARE_BLUE + '20',
  },
  severityhigh: {
    backgroundColor: MEDI_COLORS.SECONDARY.ALERT_RED + '20',
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: MEDI_COLORS.PRIMARY.TEAL_2,
  },
  insightDescription: {
    fontSize: 14,
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
    lineHeight: 20,
    marginBottom: 10,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  metricBadge: {
    backgroundColor: MEDI_COLORS.PRIMARY.TEAL_1 + '10',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  metricText: {
    fontSize: 12,
    color: MEDI_COLORS.PRIMARY.TEAL_1,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: MEDI_COLORS.NEUTRAL.MEDIUM_GRAY,
  },
  actionText: {
    fontSize: 14,
    color: MEDI_COLORS.SECONDARY.CARE_BLUE,
    flex: 1,
  },
}); 