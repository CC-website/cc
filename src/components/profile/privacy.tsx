import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../constants/Urls';
import SetPermissions from '../members/setPermissions';
import Styles from '../../constants/Styles/profile/privacy/privacy';
import Access from './privacy/access';
import Calls from './privacy/calls';
import Disappearing from './privacy/disappearing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default function Privacy({ visible, onClose }) {
  const [access, getAccess] = useState(false);
  const [calls, getCalls] = useState(false);
  const [disappearing, setDisappearing] = useState(false);
  const [choice, setChoice] = useState(null);
  const [last, setLast] = useState('');
  const [photo, setPhoto] = useState('');
  const [about, setAbout] = useState('');
  const [status, setStatus] = useState('');
  const [groups, setGroups] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  const openModal = (choice) => {
    setChoice(choice);
    if (['last_seen_online', 'profile_photo', 'about', 'status', 'groups'].includes(choice)) {
      getAccess(true);
    } else if (choice === 'calls') {
      getCalls(true);
    } else if (choice === 'disappearing') {
      setDisappearing(true);
    }
  };

  const closeModal = (choice) => {
    setChoice(choice);
    if (['last_seen_online', 'profile_photo', 'about', 'status', 'groups'].includes(choice)) {
      getAccess(false);
    } else if (choice === 'calls') {
      getCalls(false);
    } else if (choice === 'disappearing') {
      setDisappearing(false);
    }
  };

  const saveUserData = async (userData) => {
    try {
      // Convert userData object to a string before saving
      const userDataString = JSON.stringify(userData);
      
      await AsyncStorage.setItem('UserPrivacyData', userDataString);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };
  

  const fetchUserData = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      const jsonObject = JSON.parse(token);
      
      try {
        const response = await fetch(main_url + '/user/privacy-settings/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jsonObject.access}`
          }
        });
  
        if (response.ok) {
          const userData = await response.json();
          
          // Save userData object locally (after converting to string)
          setLast(userData.last_seen_online)
          setPhoto(userData.profile_photo)
          setAbout(userData.about)
          setStatus(userData.status)
          setGroups(userData.groups)
          await saveUserData(userData);
          // setUserData(userData);
          
          console.log(userData);
        } else {
          console.log('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };
  
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe(); // Unsubscribe when the component unmounts
    };
  }, []);

   // Add this useEffect to update user data on subsequent calls
   useEffect(() => {
    if (isConnected) {
      const interval = setInterval(fetchUserData, 60000); // Fetch data every minute (adjust as needed)
      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [isConnected]);

  const styles = Styles();

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Privacy</Text>
        </View>
        <>
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {/* PRIVACY_CHOICES = [
        (0, 'Everyone'),
        (1, 'MyContacts'),
        (2, 'MyContactsExcept'),
        (3, 'Nobody'),
    ] */}
            <Text style={[styles.inputDescription2, { marginBottom: 30 }]}>Who can see my personal info </Text>
            <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => openModal('last_seen_online')}>
              <Text style={styles.inputDescription}>Last seen and online</Text>
              <Text style={styles.inputDescription2}>{last== '2' ? "My contacts Except" : last== '0' ? "Everyone": last== '1' ? "My contacts": last== '3' ? "Nobody": null}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => openModal('profile_photo')}>
              <Text style={styles.inputDescription}>Profile photo</Text>
              <Text style={styles.inputDescription2}>{photo== '2' ? "My contacts Except" : photo== '0' ? "Everyone": photo== '1' ? "My contacts": photo== '3' ? "Nobody": null}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => openModal('about')}>
              <Text style={styles.inputDescription}>About</Text>
              <Text style={styles.inputDescription2}>{about== '2' ? "My contacts Except" : about== '0' ? "Everyone": about== '1' ? "My contacts": about== '3' ? "Nobody": null}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => openModal('status')}>
              <Text style={styles.inputDescription}>Status</Text>
              <Text style={styles.inputDescription2}>{status== '2' ? "My contacts Except" : status== '0' ? "Everyone": status== '1' ? "My contacts": status== '3' ? "Nobody": null}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => openModal('groups')}>
              <Text style={styles.inputDescription}>Groups</Text>
              <Text style={styles.inputDescription2}>{groups== '2' ? "My contacts Except" : groups== '0' ? "Everyone": groups== '1' ? "My contacts": groups== '3' ? "Nobody": null}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => openModal('calls')}>
              <Text style={styles.inputDescription}>Calls</Text>
              <Text style={styles.inputDescription2}>Silence unknown callers</Text>
            </TouchableOpacity>

            <View style={styles.disappearingContainer}>
              <Text style={styles.inputDescription2}>Disappearing messages</Text>
              <View style={styles.disappearingSubContainer}>
                <TouchableOpacity onPress={() => openModal('disappearing')}>
                  <Text style={styles.inputDescription}>Default message timer</Text>
                  <Text style={styles.inputDescription2}>Start new chats with disappearing messages set to your timer</Text>
                </TouchableOpacity>
                <Text style={styles.inputDescription2}>Off</Text>
              </View>
            </View>
          </ScrollView>
        </>
      </View>
      <Access visible={access} onClose={() => closeModal(choice)} choice={choice} />
      <Calls visible={calls} onClose={() => closeModal(choice)} />
      <Disappearing visible={disappearing} onClose={() => closeModal(choice)}  />
    </Modal>
  );
}
