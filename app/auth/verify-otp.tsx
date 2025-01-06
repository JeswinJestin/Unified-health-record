import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { mobileNumber, userId } = params;

  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [generatedOTP, setGeneratedOTP] = useState('');

  useEffect(() => {
    // Generate a random 6-digit OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(newOTP);
    
    // In a real app, you would send this OTP via SMS using a service like Twilio
    console.log('Generated OTP:', newOTP); // For testing purposes
    
    // Start the countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    if (timeLeft === 0) {
      Alert.alert('Error', 'OTP has expired. Please request a new one.');
      return;
    }

    if (otp === generatedOTP) {
      try {
        // Update user document to mark mobile number as verified
        await updateDoc(doc(db, 'users', userId as string), {
          mobileVerified: true,
        });

        Alert.alert(
          'Success',
          'Mobile number verified successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/auth/login')
            }
          ]
        );
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOTP = () => {
    if (timeLeft === 0) {
      // Generate new OTP and reset timer
      const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(newOTP);
      setTimeLeft(180);
      console.log('New OTP:', newOTP); // For testing purposes
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Verify Your Mobile Number</Text>
      <Text style={styles.subHeaderText}>
        Enter the 6-digit code sent to {mobileNumber}
      </Text>

      <TextInput
        style={styles.otpInput}
        placeholder="Enter OTP"
        placeholderTextColor="#ADADAD"
        keyboardType="numeric"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />

      <Text style={styles.timerText}>
        Time remaining: {formatTime(timeLeft)}
      </Text>

      <TouchableOpacity 
        style={styles.verifyButton} 
        onPress={handleVerifyOTP}
      >
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.resendButton, timeLeft > 0 && styles.disabledButton]}
        onPress={handleResendOTP}
        disabled={timeLeft > 0}
      >
        <Text style={[styles.resendText, timeLeft > 0 && styles.disabledText]}>
          Resend OTP
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D6C7E',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#ADADAD',
    marginBottom: 30,
    textAlign: 'center',
  },
  otpInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 5,
  },
  timerText: {
    fontSize: 16,
    color: '#0D6C7E',
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: '#F4A261',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    padding: 10,
  },
  resendText: {
    color: '#E76F51',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#ADADAD',
  },
}); 