import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/app/firebase/config'; // Make sure you have this firebase config file
import { SendDirectSms } from 'react-native-send-direct-sms';
import { MaterialIcons } from '@expo/vector-icons';

const sendSmsData = (mobileNumber: string, bodySMS: string, onSuccess: (otp: string) => void) => {
  console.log('Attempting to send SMS to:', mobileNumber);
  console.log('SMS content:', bodySMS);
  
  // Extract OTP from the message
  const otpMatch = bodySMS.match(/\d{6}/);
  const otp = otpMatch ? otpMatch[0] : '';
  
  SendDirectSms(mobileNumber, bodySMS)
    .then((res) => {
      console.log('SMS sent successfully:', res);
      // Call the success callback with the OTP
      onSuccess(otp);
    })
    .catch((err) => {
      console.error('SMS sending failed:', err);
    });
};

export default function SignupScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [currentOtp, setCurrentOtp] = useState('');

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOTP = async () => {
    console.log('Starting OTP send process...');
    console.log('Mobile number:', formData.mobileNumber);

    if (!formData.mobileNumber || formData.mobileNumber.length !== 10) {
      console.log('Invalid mobile number length:', formData.mobileNumber.length);
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoadingOtp(true);
    try {
      const otp = generateOTP();
      console.log('Generated OTP:', otp);
      
      const otpMessage = `Your MediConnect OTP is: ${otp}. Valid for 10 minutes.`;
      console.log('OTP message:', otpMessage);
      
      // Store OTP in Firestore
      console.log('Storing OTP in Firestore...');
      await setDoc(doc(db, 'otpVerifications', formData.mobileNumber), {
        otp,
        expiry: new Date(Date.now() + 10 * 60000), // 10 minutes from now
        attempts: 0,
        verified: false,
        createdAt: new Date(),
      });
      console.log('OTP stored in Firestore successfully');

      // Send OTP via SMS and show popup when successful
      console.log('Initiating SMS send...');
      sendSmsData(formData.mobileNumber, otpMessage, (receivedOtp) => {
        setCurrentOtp(receivedOtp || otp);
        setShowOtpPopup(true);
      });
      
      setOtpSent(true);
      console.log('OTP process completed successfully');
      Alert.alert('Success', 'OTP has been sent to your mobile number');
    } catch (error: any) {
      console.error('OTP process failed:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoadingOtp(false);
      console.log('OTP process finished');
    }
  };

  const handleSignup = async () => {
    if (!otpSent) {
      Alert.alert('Error', 'Please verify your mobile number first');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        createdAt: new Date(),
      });

      // Navigate to OTP verification page with mobile number
      router.push({
        pathname: '/auth/verify-otp',
        params: { 
          mobileNumber: formData.mobileNumber,
          userId: userCredential.user.uid
        }
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Image 
            source={require('../../assets/images/MediConLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>MEDICONNECT</Text>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Create Account
        </Text>
        <Text style={styles.subHeaderText}>
          Enter your details
        </Text>
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
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
        />
        <View style={styles.phoneContainer}>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder="Mobile Number"
            placeholderTextColor="#ADADAD"
            keyboardType="numeric"
            maxLength={10}
            value={formData.mobileNumber}
            onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
          />
          <TouchableOpacity 
            style={[styles.otpButton, isLoadingOtp && styles.otpButtonDisabled]}
            onPress={handleSendOTP}
            disabled={isLoadingOtp}
          >
            <Text style={styles.otpButtonText}>
              {isLoadingOtp ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, !otpSent && styles.buttonDisabled]} 
          onPress={handleSignup}
          disabled={!otpSent}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/login')}>
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
              Please use this OTP to verify your account.
              Valid for 10 minutes.
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
    backgroundColor: '#F4F4F4',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#0D6C7E',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    padding: 15,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D6C7E',
    letterSpacing: 1,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0D6C7E',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#ADADAD',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    color: '#04282E',
  },
  button: {
    backgroundColor: '#F4A261',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  loginText: {
    color: '#ADADAD',
    fontSize: 14,
  },
  loginLink: {
    color: '#E76F51',
    fontSize: 14,
    fontWeight: 'bold',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  phoneInput: {
    flex: 1,
    marginBottom: 0,
  },
  otpButton: {
    backgroundColor: '#0D6C7E',
    padding: 15,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  otpButtonDisabled: {
    backgroundColor: '#ADADAD',
  },
  otpButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ADADAD',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D6C7E',
    marginBottom: 20,
    marginTop: 10,
  },
  otpText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F4A261',
    letterSpacing: 5,
    marginBottom: 20,
  },
  otpDescription: {
    fontSize: 14,
    color: '#ADADAD',
    textAlign: 'center',
    marginBottom: 20,
  },
  copyButton: {
    backgroundColor: '#0D6C7E',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
