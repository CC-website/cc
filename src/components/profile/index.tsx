import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { main_url } from '../../../src/constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styles from '../../constants/Styles/profile/editProfile';

export default function EditProfile({ visible, onClose }) {
  const styles = Styles();
  const [userName, setUserName] = useState('');
  const [about, setAbout] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('UserData');
      if (savedUserData) {
        const parsedUserData = JSON.parse(savedUserData);
        setUserData(parsedUserData);
        setProfilePicture(main_url + parsedUserData.profile_picture);
        setUserName(parsedUserData.username);
        setPhoneNumber(parsedUserData.phone_number);
        setAbout(parsedUserData.about);
        setEmail(parsedUserData.email);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const encodeImageToBase64 = async (image) => {
    try {
      if (!image) return ''; // Return an empty string if no image is selected

      const response = await fetch(image);
      const blob = await response.blob();
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      return base64String;
    } catch (error) {
      console.error('Error encoding image to base64:', error);
      throw error;
    }
  };

  const saveProfileData = async (username, about, phone, email, profile) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      const jsonObject = JSON.parse(token);
      try {
        const profileImageBase64 = await encodeImageToBase64(profile); // Encode selected image to base64

        const formData = new FormData();
        formData.append('username', username);
        formData.append('about', about);
        formData.append('phone_number', phone);
        formData.append('email', email);
        formData.append('profile_picture', profileImageBase64);

        const response = await axios.put(main_url + '/user/user-info/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${jsonObject.access}`,
          },
        });

        if (response.status === 200) {
          console.log('Profile data saved successfully');
        } else {
          console.error('Failed to save profile data');
        }
      } catch (error) {
        console.error('Error saving profile data:', error);
      }
    }
  };

  const handleChooseImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!pickerResult.canceled) {
        setProfilePicture(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.error('Error choosing image:', error);
    }
  };

  const handleSave = () => {
    saveProfileData(userName, about, phoneNumber, email, profilePicture);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} style={styles.inputIcon} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleSave}>
            <Text style={{ color: 'white' }}>Save</Text>
          </TouchableOpacity>
        </View>
        <>
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <TouchableOpacity style={styles.profilePictureContainer} onPress={handleChooseImage}>
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
              ) : (
                <Icon name="user-circle" size={100} style={styles.inputIcon} />
              )}
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={34} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="User Name"
                value={userName}
                onChangeText={setUserName}
              />
            </View>
            <Text style={styles.inputDescription}>This is not your username or pin. This name will be visible to your CC contacts.</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="information" size={34} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="About"
                value={about}
                onChangeText={setAbout}
              />
            </View>
            <Text style={styles.inputDescription}>About</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="phone" size={34} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
            <Text style={styles.inputDescription}>Phone</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email" size={34} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
            <Text style={styles.inputDescription}>Email</Text>
          </ScrollView>
        </>
      </View>
    </Modal>
  );
}
