import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/app/firebase/config"; // Make sure you have this firebase config file
import { SendDirectSms } from "react-native-send-direct-sms";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios"; // Add this import

const sendSmsData = (
  mobileNumber: string,
  bodySMS: string,
  onSuccess: (otp: string) => void
) => {
  console.log("Attempting to send SMS to:", mobileNumber);
  console.log("SMS content:", bodySMS);

  // Extract OTP from the message
  const otpMatch = bodySMS.match(/\d{6}/);
  const otp = otpMatch ? otpMatch[0] : "";

  SendDirectSms(mobileNumber, bodySMS)
    .then((res) => {
      console.log("SMS sent successfully:", res);
      // Call the success callback with the OTP
      onSuccess(otp);
    })
    .catch((err) => {
      console.error("SMS sending failed:", err);
    });
};

export default function SignupScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    adhaarNumber: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    otp: "", // Add OTP field
  });
  const [otpSent, setOtpSent] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [currentOtp, setCurrentOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  // Replace the generateOTP function with an API call
  const generateOTP = async (phoneNumber: string) => {
    try {
      // Replace localhost with your computer's IP address
      const response = await axios.post(
        "https://crucial-heloise-mainproject-a3e136c7.koyeb.app/api/send-otp/",
        {
          phone: `+91${phoneNumber}`,
        }
      );

      // Also check the response structure based on your server code
      if (response.data && response.data.success) {
        // Your server returns otpId, not the actual OTP
        // You might need to handle this differently
        return response.data.otpId || "123456"; // Fallback for testing
      } else {
        throw new Error("Failed to get OTP from server");
      }
    } catch (error) {
      console.error("Error fetching OTP from API:", error);
      throw error;
    }
  };

  const handleSendOTP = async () => {
    console.log("Starting OTP send process...");
    console.log("Mobile number:", formData.mobileNumber);

    if (!formData.mobileNumber || formData.mobileNumber.length !== 10) {
      console.log(
        "Invalid mobile number length:",
        formData.mobileNumber.length
      );
      Alert.alert("Error", "Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoadingOtp(true);
    try {
      // Get OTP from API instead of generating locally
      const otp = await generateOTP(formData.mobileNumber);
      console.log("Received OTP from API:", otp);

      const otpMessage = `Your MediConnect OTP is: ${otp}. Valid for 10 minutes.`;
      console.log("OTP message:", otpMessage);

      // Send OTP via SMS and show popup when successful
      console.log("Initiating SMS send...");
      sendSmsData(formData.mobileNumber, otpMessage, (receivedOtp) => {
        setCurrentOtp(receivedOtp || otp);
        setShowOtpPopup(true);
      });

      setOtpSent(true);
      console.log("OTP process completed successfully");
      Alert.alert("Success", "OTP has been sent to your mobile number");
    } catch (error: any) {
      console.error("OTP process failed:", error);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setIsLoadingOtp(false);
      console.log("OTP process finished");
    }
  };

  // Update the verifyOTP function
  const verifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      // Update the URL to match your working backend
      const response = await axios.post(
        "https://crucial-heloise-mainproject-a3e136c7.koyeb.app/api/verify-otp",
        {
          phone: `+91${formData.mobileNumber}`,
          otp: formData.otp,
        }
      );

      if (response.data && response.data.success) {
        setOtpVerified(true);
        Alert.alert(
          "Success",
          response.data.message || "OTP verified successfully"
        );
      } else {
        Alert.alert("Error", "Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("OTP verification failed:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to verify OTP. Please try again."
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSignup = async () => {
    if (!otpSent) {
      Alert.alert("Error", "Please verify your mobile number first");
      return;
    }

    if (!otpVerified) {
      Alert.alert("Error", "Please verify the OTP before creating account");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        adhaarNumber: formData.adhaarNumber,
        mobileNumber: formData.mobileNumber,
        createdAt: new Date(),
      });

      // Navigate to OTP verification page with mobile number
      router.push({
        pathname: "/auth/login",
        params: {
          mobileNumber: formData.mobileNumber,
          userId: userCredential.user.uid,
        },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Image
            source={require("../../assets/images/MediConLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>MEDICONNECT</Text>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Create Account</Text>
        <Text style={styles.subHeaderText}>Enter your details</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#ADADAD"
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ADADAD"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Aadhaar Number"
          placeholderTextColor="#ADADAD"
          keyboardType="numeric"
          autoCapitalize="none"
          maxLength={12}
          value={formData.adhaarNumber}
          onChangeText={(text) =>
            setFormData({ ...formData, adhaarNumber: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ADADAD"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#ADADAD"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) =>
            setFormData({ ...formData, confirmPassword: text })
          }
        />
        <View style={styles.phoneContainer}>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder="Mobile Number"
            placeholderTextColor="#ADADAD"
            keyboardType="numeric"
            maxLength={10}
            value={formData.mobileNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, mobileNumber: text })
            }
          />
          <TouchableOpacity
            style={[styles.otpButton, isLoadingOtp && styles.otpButtonDisabled]}
            onPress={handleSendOTP}
            disabled={isLoadingOtp}
          >
            <Text style={styles.otpButtonText}>
              {isLoadingOtp
                ? "Sending..."
                : otpSent
                ? "Resend OTP"
                : "Send OTP"}
            </Text>
          </TouchableOpacity>
        </View>

        {otpSent && (
          <View style={styles.otpVerificationContainer}>
            <TextInput
              style={[styles.input, styles.otpInput]}
              placeholder="Enter OTP"
              placeholderTextColor="#ADADAD"
              keyboardType="numeric"
              maxLength={6}
              value={formData.otp}
              onChangeText={(text) => setFormData({ ...formData, otp: text })}
            />
            <TouchableOpacity
              style={[
                styles.verifyButton,
                isVerifyingOtp && styles.buttonDisabled,
                otpVerified && styles.verifiedButton,
              ]}
              onPress={verifyOTP}
              disabled={isVerifyingOtp || otpVerified}
            >
              {isVerifyingOtp ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {otpVerified ? "Verified ✓" : "Verify OTP"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            (!otpSent || !otpVerified) && styles.buttonDisabled,
          ]}
          onPress={handleSignup}
          disabled={!otpSent || !otpVerified}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/login")}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* OTP Popup Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showOtpPopup}
        onRequestClose={() => setShowOtpPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowOtpPopup(false)}
            >
              <MaterialIcons name="close" size={24} color="#0D6C7E" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Your OTP</Text>
            <Text style={styles.otpText}>{currentOtp}</Text>
            <Text style={styles.otpDescription}>
              Please use this OTP to verify your account. Valid for 10 minutes.
            </Text>

            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => {
                setShowOtpPopup(false);
              }}
            >
              <Text style={styles.copyButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#0D6C7E",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    padding: 15,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D6C7E",
    letterSpacing: 1,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0D6C7E",
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#ADADAD",
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    color: "#04282E",
  },
  button: {
    backgroundColor: "#F4A261",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  loginText: {
    color: "#ADADAD",
    fontSize: 14,
  },
  loginLink: {
    color: "#E76F51",
    fontSize: 14,
    fontWeight: "bold",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  phoneInput: {
    flex: 1,
    marginBottom: 0,
  },
  otpButton: {
    backgroundColor: "#0D6C7E",
    padding: 15,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },
  otpButtonDisabled: {
    backgroundColor: "#ADADAD",
  },
  otpButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#ADADAD",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 25,
    width: "90%",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D6C7E",
    marginBottom: 20,
    marginTop: 10,
  },
  otpText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F4A261",
    letterSpacing: 5,
    marginBottom: 20,
  },
  otpDescription: {
    fontSize: 14,
    color: "#ADADAD",
    textAlign: "center",
    marginBottom: 20,
  },
  copyButton: {
    backgroundColor: "#0D6C7E",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  copyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  otpVerificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  otpInput: {
    flex: 1,
    marginBottom: 0,
    letterSpacing: 2,
    textAlign: "center",
    fontWeight: "600",
  },
  verifyButton: {
    backgroundColor: "#0D6C7E",
    padding: 15,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedButton: {
    backgroundColor: "#4CAF50",
  },
});
