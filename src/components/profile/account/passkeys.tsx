import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Switch, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import Styles from '../../../constants/Styles/profile/account/security';

// Initialize styles outside of the component



export default function Passkeys({ visible, onClose }) {
  const styles = Styles();
  const [userName, setUserName] = useState('');
  const [about, setAbout] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

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
          <Text style={styles.modalTitle}>Passkeys</Text>
        </View>


        <>
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <TouchableOpacity style={styles.profilePictureContainer} onPress={handleChooseImage}>
                <MaterialCommunityIcons name="key" size={100} style={styles.inputIcon} />
            </TouchableOpacity>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputDescription, {marginTop:20}]}>A simple way to sign in safely</Text>
              <Text style={[styles.inputDescription2, {color:'#505459'}]}>
                You can use your fingerprint, face, or screen lock to verify if it's you with a passkey. your passkeys are safely stored in a password manager.
              </Text>
              
              <View style={[styles.inputWordContainer]}>
                <TouchableOpacity style={styles.createButton}>
                  <Text style={{color:'white'}}>Create a passkey</Text>
                </TouchableOpacity>
              </View>  

            </View>
            
          </ScrollView>
        </>
      </View>
    </Modal>
  );
}
