import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  query,
  getDocs,
  where,
  collectionGroup,
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { useAuth } from "../../context/AuthContext";
// import BottomNavigation from '../../components/BottomNavigation';

// Development mode flag - set to true to see debug info
const DEV_MODE = false;

/**
 * Utility function to safely format dates from Firestore timestamps
 */
const formatFirestoreDate = (
  timestamp: any,
  format: "iso" | "local" = "iso"
): string => {
  if (!timestamp) return "N/A";

  try {
    let dateObj;

    if (timestamp.seconds) {
      // Firestore Timestamp format
      dateObj = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      // JavaScript Date object
      dateObj = timestamp;
    } else if (typeof timestamp === "string") {
      // ISO String format
      dateObj = new Date(timestamp);
    }

    if (dateObj && !isNaN(dateObj.getTime())) {
      if (format === "iso") {
        return dateObj.toISOString().split("T")[0];
      } else {
        return dateObj.toLocaleDateString();
      }
    }
  } catch (error) {
    console.error("❌ Date conversion error:", error);
  }

  return "N/A";
};

// Simple debug panel to show state in development
const DebugPanel = ({ data }: { data: any }) => {
  if (!DEV_MODE) return null;

  return (
    <View style={debugStyles.container}>
      <Text style={debugStyles.title}>📊 Debug Info</Text>
      <ScrollView style={debugStyles.scrollContent}>
        <Text style={debugStyles.content}>{JSON.stringify(data, null, 2)}</Text>
      </ScrollView>
    </View>
  );
};

const MEDI_COLORS = {
  PRIMARY: {
    TEAL_1: "#0D6C7E",
    TEAL_2: "#08505D",
    TEAL_3: "#04282E",
  },
  SECONDARY: {
    CARE_BLUE: "#4A90E2",
    HEALTH_GREEN: "#2ECC71",
    ALERT_RED: "#E74C3C",
  },
  NEUTRAL: {
    LIGHT_GRAY: "#F4F4F4",
    MEDIUM_GRAY: "#E0E0E0",
    DARK_GRAY: "#ADADAD",
  },
};

interface HealthRecord {
  id: string;
  type: string;
  category: string;
  date: string;
  title: string;
  description: string;
  fileType: "pdf" | "image" | "signal";
  fileUrl: string;
  results?: {
    parameter: string;
    value: string;
    unit: string;
    status: "normal" | "high" | "low";
  }[];
}

export default function RecordsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [userPatientId, setUserPatientId] = useState<string | null>(null);
  const [records, setRecords] = useState<HealthRecord[]>([]);

  const categories = [
    "all",
    "Blood Tests",
    "Imaging",
    "Signals",
    "Reports",
    "Prescriptions",
  ];

  // Function to fetch the current user's patient record
  const fetchUserPatientRecord = async () => {
    try {
      console.log("======== RECORDS DEBUG ========");
      console.log("🔍 Starting to fetch patient record");

      // DEBUGGING: Use a test email if user auth fails
      const TEST_EMAIL = "jovitmathew236@gmail.com"; // This should match a patient in your database

      if (!user && !auth.currentUser) {
        console.warn(
          "⚠️ No user found in context or auth. Using test email for debugging:",
          TEST_EMAIL
        );
      }

      // Find patient document based on email
      const userEmail =
        user?.displayName || auth.currentUser?.email || TEST_EMAIL;
      console.log("👤 Looking up user with email:", userEmail);

      if (!userEmail) {
        setError("No user email found");
        setIsLoading(false);
        console.error("❌ EMAIL ERROR: User email is undefined or null");
        return;
      }

      const patientsRef = collection(db, "patientRequests");
      const q = query(patientsRef, where("email", "==", userEmail));
      console.log("🔎 Querying Firestore with:", userEmail);

      const querySnapshot = await getDocs(q);
      console.log("📊 Query returned documents:", querySnapshot.docs.length);

      if (querySnapshot.empty) {
        setError("No patient record found for this user");
        setIsLoading(false);
        console.error(
          "❌ DB ERROR: No matching patient record found for email:",
          userEmail
        );
        return;
      }

      // Get the patient ID
      const patientDoc = querySnapshot.docs[0];
      const patientId = patientDoc.id;
      console.log("✅ Found patient document with ID:", patientId);
      console.log(
        "📄 Patient data:",
        JSON.stringify(patientDoc.data(), null, 2)
      );
      // setUserPatientId(patientDoc.id);

      // Now fetch visits for this patient
      await fetchPatientVisits(patientId);
    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
      setError("Failed to fetch patient data");
      setIsLoading(false);
    }
  };

  // Function to fetch patient visits and transform them into health records
  const fetchPatientVisits = async (patientId: string) => {
    try {
      console.log("🏥 Fetching visits for patient ID:", patientId);

      const visitsRef = collection(db, `patientRequests/${patientId}/visits`);
      console.log(
        "🔗 Using visits collection path:",
        `patientRequests/${patientId}/visits`
      );

      const visitsSnapshot = await getDocs(visitsRef);
      console.log(
        "📈 Visits query returned documents:",
        visitsSnapshot.docs.length
      );
      console.log("📊 Visits docs empty?", visitsSnapshot.empty);

      if (visitsSnapshot.empty) {
        console.warn("⚠️ WARNING: No visits found for patient:", patientId);
        setRecords([]);
        setIsLoading(false);
        return;
      }

      // Print debug info about each visit document
      visitsSnapshot.docs.forEach((doc, index) => {
        console.log(`📋 Visit ${index + 1} ID:`, doc.id);
        console.log(
          `📋 Visit ${index + 1} Data:`,
          JSON.stringify(doc.data(), null, 2)
        );
      });

      // Transform visits data into health records format
      const healthRecords: HealthRecord[] = [];

      visitsSnapshot.forEach((doc) => {
        try {
          const visitData = doc.data();
          console.log(`🔄 Processing visit document: ${doc.id}`);

          // Process vital signs as a record
          if (visitData.vitalSigns) {
            console.log(
              `💓 Visit has vital signs:`,
              JSON.stringify(visitData.vitalSigns, null, 2)
            );

            // Use the utility function for date formatting
            const formattedDate = formatFirestoreDate(
              visitData.updatedAt,
              "iso"
            );
            const localDateString = formatFirestoreDate(
              visitData.updatedAt,
              "local"
            );

            const vitalSignsRecord: HealthRecord = {
              id: `${doc.id}_vitals`,
              type: "Vital Signs",
              category: "Reports",
              date: formattedDate,
              title: "Vital Signs Report",
              description: `Visit on ${localDateString}`,
              fileType: "signal",
              fileUrl: "",
              results: [],
            };

            if (visitData.vitalSigns.bloodPressure) {
              vitalSignsRecord.results?.push({
                parameter: "Blood Pressure",
                value: visitData.vitalSigns.bloodPressure,
                unit: "mmHg",
                status: "normal",
              });
            }

            if (visitData.vitalSigns.heartRate) {
              vitalSignsRecord.results?.push({
                parameter: "Heart Rate",
                value: visitData.vitalSigns.heartRate,
                unit: "bpm",
                status: "normal",
              });
            }

            if (visitData.vitalSigns.oxygenSaturation) {
              vitalSignsRecord.results?.push({
                parameter: "Oxygen Saturation",
                value: visitData.vitalSigns.oxygenSaturation,
                unit: "%",
                status: "normal",
              });
            }

            if (visitData.vitalSigns.respiratoryRate) {
              vitalSignsRecord.results?.push({
                parameter: "Respiratory Rate",
                value: visitData.vitalSigns.respiratoryRate,
                unit: "breaths/min",
                status: "normal",
              });
            }

            healthRecords.push(vitalSignsRecord);
            console.log(`✅ Added vital signs record for visit: ${doc.id}`);
          } else {
            console.log(`⚠️ No vital signs data found for visit: ${doc.id}`);
          }

          // Process medications as prescriptions
          if (visitData.medications && Array.isArray(visitData.medications)) {
            console.log(
              `💊 Visit has ${visitData.medications.length} medications`
            );

            visitData.medications.forEach((med: any, index: number) => {
              if (med.name) {
                console.log(`💊 Processing medication: ${med.name}`);
                const medicationRecord: HealthRecord = {
                  id: `${doc.id}_med_${index}`,
                  type: "Prescription",
                  category: "Prescriptions",
                  date: formatFirestoreDate(visitData.updatedAt),
                  title: `Prescription: ${med.name}`,
                  description: `Dosage: ${med.dosage || "N/A"}, Duration: ${
                    med.duration || "N/A"
                  } days`,
                  fileType: "pdf",
                  fileUrl: "",
                };

                healthRecords.push(medicationRecord);
                console.log(`✅ Added medication record: ${med.name}`);
              } else {
                console.log(
                  `⚠️ Skipping medication with no name at index ${index}`
                );
              }
            });
          } else {
            console.log(`ℹ️ No medications found for visit: ${doc.id}`);
          }
        } catch (docError) {
          console.error(`❌ ERROR processing visit ${doc.id}:`, docError);
          // Continue processing other documents despite this error
        }
      });

      console.log(
        `🏁 Finished processing. Total health records: ${healthRecords.length}`
      );
      console.log(`🏁 Health records by category:`);
      const categoryCounts = healthRecords.reduce((acc, record) => {
        acc[record.category] = (acc[record.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log(categoryCounts);

      setRecords(healthRecords);
      console.log(`🔄 State updated with ${healthRecords.length} records`);
      setIsLoading(false);
      console.log(`🔄 Loading state set to false`);
    } catch (err: any) {
      console.error("❌ ERROR FETCHING VISITS:", err);

      // Check for specific Firebase error codes
      let errorMessage = "Failed to fetch visit data";

      if (err.code) {
        // Handle Firebase specific error codes
        switch (err.code) {
          case "permission-denied":
            errorMessage = "You don't have permission to access these records";
            break;
          case "unavailable":
            errorMessage =
              "Database service is currently unavailable. Please try again later.";
            break;
          case "not-found":
            errorMessage =
              "Records not found. They may have been moved or deleted.";
            break;
          case "invalid-argument":
            errorMessage = "Invalid request format. Please contact support.";
            break;
          default:
            errorMessage = `Error fetching data: ${
              err.message || "Unknown error"
            }`;
        }
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Direct test function for Firestore connection
  const testFirestoreConnection = async () => {
    try {
      console.log("🧪 TESTING FIRESTORE CONNECTION");

      // Test query to patientRequests collection
      const testRef = collection(db, "patientRequests");
      const testSnapshot = await getDocs(testRef);

      console.log("✅ Successfully connected to Firestore");
      console.log(`📊 Found ${testSnapshot.docs.length} patient documents`);

      // Log the first few document IDs
      const docIds = testSnapshot.docs.slice(0, 3).map((doc) => doc.id);
      console.log("📑 First few document IDs:", docIds);

      // Test alert to confirm data in UI
      alert(
        `Firestore test successful. Found ${testSnapshot.docs.length} patients.`
      );
    } catch (error: any) {
      console.error("❌ FIRESTORE TEST ERROR:", error);
      alert(`Firestore test failed: ${error.message || "Unknown error"}`);
    }
  };

  // Fetch data when component loads
  useEffect(() => {
    console.log("🔄 RECORDS SCREEN - useEffect triggered");
    console.log("👤 Current user in context:", user?.displayName);
    setIsLoading(true);
    console.log("🔄 Set loading state to true");
    fetchUserPatientRecord();
  }, [user]);

  const renderRecordCard = (record: HealthRecord) => (
    <TouchableOpacity
      key={record.id}
      style={styles.recordCard}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/records/[id]",
          params: { id: record.id },
        })
      }
    >
      <View style={styles.recordHeader}>
        <MaterialCommunityIcons
          name={
            record.fileType === "pdf"
              ? "file-document"
              : record.fileType === "image"
              ? "image"
              : "chart-line"
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
                <Text
                  style={[
                    styles.parameterValue,
                    styles[`${result.status}Value`],
                  ]}
                >
                  {result.value} {result.unit}
                </Text>
                <Text
                  style={[
                    styles.statusIndicator,
                    styles[`${result.status}Status`],
                  ]}
                >
                  {result.status.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={MEDI_COLORS.PRIMARY.TEAL_1} />
          <Text style={styles.loadingText}>Loading health records...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={50}
            color={MEDI_COLORS.SECONDARY.ALERT_RED}
          />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setIsLoading(true);
              setError(null);
              fetchUserPatientRecord();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Health Records</Text>
        <View style={styles.headerButtons}>
          {DEV_MODE && (
            <TouchableOpacity
              style={styles.debugButton}
              onPress={testFirestoreConnection}
            >
              <MaterialCommunityIcons
                name="database"
                size={24}
                color={MEDI_COLORS.SECONDARY.ALERT_RED}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.uploadButton}>
            <MaterialCommunityIcons
              name="upload"
              size={24}
              color={MEDI_COLORS.PRIMARY.TEAL_1}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.recordsList}>
        {records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={50}
              color={MEDI_COLORS.NEUTRAL.DARK_GRAY}
            />
            <Text style={styles.emptyText}>No health records found</Text>

            {/* Retry button when no records are found */}
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                console.log("🔄 Manual retry triggered");
                setIsLoading(true);
                fetchUserPatientRecord();
              }}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          records
            .filter(
              (record) =>
                selectedCategory === "all" ||
                record.category === selectedCategory
            )
            .map((record) => renderRecordCard(record))
        )}
      </ScrollView>

      {/* Debug Panel */}
      <DebugPanel
        data={{
          userEmail: user?.displayName || auth.currentUser?.email,
          recordsCount: records.length,
          isLoading,
          error,
          categories: records.map((r) => r.category),
        }}
      />

      {/* <BottomNavigation /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MEDI_COLORS.NEUTRAL.LIGHT_GRAY,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: MEDI_COLORS.NEUTRAL.MEDIUM_GRAY,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: MEDI_COLORS.PRIMARY.TEAL_1,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  debugButton: {
    padding: 8,
    marginRight: 8,
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
    backgroundColor: "#FFFFFF",
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
    color: "#FFFFFF",
  },
  recordsList: {
    padding: 15,
  },
  recordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  recordInfo: {
    marginLeft: 10,
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: "bold",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  parameterName: {
    fontSize: 14,
    color: MEDI_COLORS.PRIMARY.TEAL_2,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: MEDI_COLORS.SECONDARY.HEALTH_GREEN + "20",
    color: MEDI_COLORS.SECONDARY.HEALTH_GREEN,
  },
  highValue: {
    color: MEDI_COLORS.SECONDARY.ALERT_RED,
  },
  highStatus: {
    backgroundColor: MEDI_COLORS.SECONDARY.ALERT_RED + "20",
    color: MEDI_COLORS.SECONDARY.ALERT_RED,
  },
  lowValue: {
    color: MEDI_COLORS.SECONDARY.CARE_BLUE,
  },
  lowStatus: {
    backgroundColor: MEDI_COLORS.SECONDARY.CARE_BLUE + "20",
    color: MEDI_COLORS.SECONDARY.CARE_BLUE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: MEDI_COLORS.PRIMARY.TEAL_1,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: MEDI_COLORS.SECONDARY.ALERT_RED,
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: MEDI_COLORS.PRIMARY.TEAL_1,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 10,
    color: MEDI_COLORS.NEUTRAL.DARK_GRAY,
    fontSize: 16,
    textAlign: "center",
  },
});

const debugStyles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 10,
    maxHeight: 200,
    zIndex: 9999,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  scrollContent: {
    maxHeight: 170,
  },
  content: {
    color: "#fff",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 10,
  },
});
