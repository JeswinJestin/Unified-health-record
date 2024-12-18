import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { router } from 'expo-router';

const ProfileScreen = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({...userData});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const auth = getAuth();
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser?.uid || ''));
      
      if (userDoc.exists()) {
        const data = userDoc.data() as { fullName: string; email: string; phone: string; address: string };
        setUserData(data);
        setEditedData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const isValidPhoneNumber = (phone: string) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  };

  const handleUpdateProfile = async () => {
    try {
      if (!isValidPhoneNumber(editedData.phone)) {
        alert('Please enter a valid phone number');
        return;
      }

      const auth = getAuth();
      const db = getFirestore();
      await updateDoc(doc(db, 'users', auth.currentUser?.uid || ''), editedData);
      setUserData(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Picture Section */}
      <View style={styles.profilePicContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Replace with actual image URL
          style={styles.profilePic}
        />
      </View>

      {/* User Information Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{userData.fullName}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userData.email}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{userData.phone}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{userData.address}</Text>
      </View>

      {/* Action Buttons Section */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]}
          onPress={handleSignOut}
        >
          <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={isEditing} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <TextInput
              style={styles.input}
              value={editedData.fullName}
              onChangeText={(text) => setEditedData({...editedData, fullName: text})}
              placeholder="Name"
            />
            <TextInput
              style={[
                styles.input,
                !isValidPhoneNumber(editedData.phone) && editedData.phone !== '' && styles.invalidInput
              ]}
              value={editedData.phone}
              onChangeText={(text) => setEditedData({...editedData, phone: text})}
              placeholder="Phone (123-456-7890)"
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              value={editedData.address}
              onChangeText={(text) => setEditedData({...editedData, address: text})}
              placeholder="Address"
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={handleUpdateProfile}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F4F4F4',
  },
  profilePicContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#0D6C7E',
  },
  infoContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#08505D',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  actionsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#0D6C7E',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#D62828',
  },
  logoutText: {
    color: '#F4F4F4',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#08505D',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#0D6C7E',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  invalidInput: {
    borderColor: '#D62828',
    borderWidth: 2,
  },
});

export default ProfileScreen;
