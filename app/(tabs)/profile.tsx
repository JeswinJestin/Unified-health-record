import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    profileImage: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({...userData});
  const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const fetchUserData = async () => {
    try {
      const auth = getAuth();
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser?.uid || ''));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          profileImage: data.profileImage || '',
        });
        setEditedData({
          fullName: data.fullName || '',
          email: data.email || '', 
          phone: data.phone || '',
          address: data.address || '',
          profileImage: data.profileImage || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const storage = getStorage();
        const auth = getAuth();
        const imageRef = ref(storage, `profileImages/${auth.currentUser?.uid}`);
        
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        
        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);
        
        setEditedData(prev => ({
          ...prev,
          profileImage: downloadURL
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.profilePicContainer}
          onPress={() => setIsImagePickerVisible(true)}
        >
          <Image
            source={
              userData.profileImage 
                ? { uri: userData.profileImage }
                : require('../../assets/images/default-avatar.png')
            }
            style={styles.profilePic}
          />
          <View style={styles.editIconContainer}>
            <MaterialIcons name="edit" size={20} color="#FFF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{userData.fullName}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <MaterialIcons name="phone" size={24} color="#0D6C7E" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{userData.phone}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={24} color="#0D6C7E" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{userData.address}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setIsEditing(true)}
        >
          <MaterialIcons name="edit" size={24} color="#FFF" />
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleSignOut}
        >
          <MaterialIcons name="logout" size={24} color="#FFF" />
          <Text style={styles.actionButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={isEditing} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalProfilePic}
              onPress={pickImage}
            >
              <Image
                source={
                  editedData.profileImage 
                    ? { uri: editedData.profileImage }
                    : require('../../assets/images/default-avatar.png')
                }
                style={styles.modalProfileImage}
              />
              <View style={styles.modalEditIcon}>
                <MaterialIcons name="camera-alt" size={20} color="#FFF" />
              </View>
            </TouchableOpacity>

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
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={handleUpdateProfile}
              >
                <Text style={styles.modalButton}>Save</Text>
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
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  header: {
    backgroundColor: '#0D6C7E',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profilePicContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F4A261',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  infoCard: {
    margin: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  actionsContainer: {
    padding: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D6C7E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#D62828',
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
  modalProfilePic: {
    position: 'relative',
    marginBottom: 15,
  },
  modalProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  modalEditIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F4A261',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
  },
});

export default ProfileScreen;
