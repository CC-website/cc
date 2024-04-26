import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Switch, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import Styles from '../../../constants/Styles/profile/account/security';

// Initialize styles outside of the component



export default function Security({ visible, onClose }) {
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
          <Text style={styles.modalTitle}>Security notifications</Text>
        </View>


        <>
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <TouchableOpacity style={styles.profilePictureContainer} onPress={handleChooseImage}>
                <Icon name="lock" size={100} style={styles.inputIcon} />
            </TouchableOpacity>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputDescription, {marginTop:20}]}>Your chats and calls are private</Text>
              <Text style={[styles.inputDescription2, {color:'#505459'}]}>End-to-end encription keeps your personal messages and calls between you and the people you choose. Not even CC can read or listen to them. This includes your: </Text>
              
              <View style={[styles.inputWordContainer]}>
                <View>
                  <Icon name="user-circle" size={24} style={styles.inputTextIcon} />
                </View>
                <Text style={[styles.inputDescription2, { width:"80%"}]}>Text and voice messages</Text>
              </View>

              <View style={[styles.inputWordContainer]}>
                <View>
                  <Icon name="user-circle" size={24} style={styles.inputTextIcon} />
                </View>
                <Text style={[styles.inputDescription2, { width:"80%"}]}>Audiow and video calls</Text>
              </View>

              <View style={[styles.inputWordContainer]}>
                <View>
                  <Icon name="user-circle" size={24} style={styles.inputTextIcon} />
                </View>
                <Text style={[styles.inputDescription2, { width:"80%"}]}>Photos, videos and documents</Text>
              </View>

              <View style={[styles.inputWordContainer]}>
                <View>
                  <Icon name="user-circle" size={24} style={styles.inputTextIcon} />
                </View>
                <Text style={[styles.inputDescription2, { width:"80%"}]}>Location sharing</Text>
              </View>

              <View style={[styles.inputWordContainer]}>
                <View>
                  <Icon name="user-circle" size={24} style={styles.inputTextIcon} />
                </View>
                <Text style={[styles.inputDescription2, { width:"80%"}]}>Status updates</Text>
              </View>

            </View>
            
          </ScrollView>
        </>
      </View>
    </Modal>
  );
}
