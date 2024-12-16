import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1); // Step 1: Personal Details, Step 2: OTP Verification, Step 3: PIN Creation
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    uniqueId: '',
    mobileNumber: '',
    pin: '',
    confirmPin: '',
    otp: '',
  });

  const handleSendOTP = () => {
    // TODO: Implement actual OTP sending logic
    Alert.alert('OTP Sent', 'A verification code has been sent to your mobile number.');
    setStep(2);
  };

  const handleVerifyOTP = () => {
    // TODO: Add OTP verification logic
    if (formData.otp.length === 6) {
      Alert.alert('OTP Verified', 'Proceed to create your PIN.');
      setStep(3);
    } else {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
  };

  const handleSignup = () => {
    if (formData.pin === formData.confirmPin && formData.pin.length === 6) {
      Alert.alert(
        'Success',
        'Account created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/home')
          }
        ]
      );
    } else {
      Alert.alert('Error', 'PINs do not match or are invalid. Try again.');
    }
  };

  const renderStep1 = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Full Name (as per govt documents)"
        placeholderTextColor="#ADADAD"
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (DD/MM/YYYY)"
        placeholderTextColor="#ADADAD"
        value={formData.dateOfBirth}
        onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Unique ID"
        placeholderTextColor="#ADADAD"
        value={formData.uniqueId}
        onChangeText={(text) => setFormData({ ...formData, uniqueId: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        placeholderTextColor="#ADADAD"
        keyboardType="numeric"
        maxLength={10}
        value={formData.mobileNumber}
        onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="#ADADAD"
        keyboardType="numeric"
        maxLength={6}
        value={formData.otp}
        onChangeText={(text) => setFormData({ ...formData, otp: text })}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Create 6-Digit PIN"
        placeholderTextColor="#ADADAD"
        secureTextEntry
        keyboardType="numeric"
        maxLength={6}
        value={formData.pin}
        onChangeText={(text) => setFormData({ ...formData, pin: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm 6-Digit PIN"
        placeholderTextColor="#ADADAD"
        secureTextEntry
        keyboardType="numeric"
        maxLength={6}
        value={formData.confirmPin}
        onChangeText={(text) => setFormData({ ...formData, confirmPin: text })}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </>
  );

  useEffect(() => {
    return () => {
      // Cleanup function
      setFormData({
        fullName: '',
        dateOfBirth: '',
        uniqueId: '',
        mobileNumber: '',
        pin: '',
        confirmPin: '',
        otp: '',
      });
      setStep(1);
    };
  }, []);

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
          {step === 1 ? 'Create Account' : step === 2 ? 'Verify OTP' : 'Set Up PIN'}
        </Text>
        <Text style={styles.subHeaderText}>
          {step === 1 ? 'Enter your details' : step === 2 ? 'Verify your mobile number' : 'Create a secure PIN'}
        </Text>
      </View>

      <View style={styles.formContainer}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
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
  }
});
