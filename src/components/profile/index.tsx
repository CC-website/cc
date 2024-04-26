import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Switch, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import SetPermissions from '../members/setPermissions';
import Styles from '../../constants/Styles/profile/editProfile';

// Initialize styles outside of the component



export default function EditProfile({ visible, onClose }) {
  const styles = Styles();
  const [userName, setUserName] = useState('');
  const [about, setAbout] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const handleSave = () => {
    // Handle saving profile information
    // You can send this data to your backend using axios or any other method
  };

  const handleChooseImage = () => {
    // Implement image picker functionality
    // You can use libraries like react-native-image-picker or expo-image-picker
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
            <Text style={{color:'white'}}>Save</Text>
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
              <MaterialCommunityIcons name="account" size={34}  style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="User Name"
                value={userName}
                onChangeText={setUserName}
              />
            </View>
            <Text style={styles.inputDescription}>This is not your username or pin. This name will be visible to your CC contacts.</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="information" size={34}  style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="About"
                value={about}
                onChangeText={setAbout}
              />
            </View> 
            <Text style={styles.inputDescription}>About</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="phone" size={34}  style={styles.inputIcon} />
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
              <MaterialCommunityIcons name="email" size={34}  style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
            <Text style={styles.inputDescription}>Eail</Text>
          </ScrollView>
        </>
      </View>
    </Modal>
  );
}
