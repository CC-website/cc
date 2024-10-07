import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { main_url } from '../../../constants/Urls';

export default function SecurityAction({ visible, onClose, setOverview, channelId }) {
  const [pauseInvites, setPauseInvites] = useState(false);
  const [pauseDMs, setPauseDMs] = useState(false);
  const [pauseDuration, setPauseDuration] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // New refreshing state

  const durations = [
    { label: '1 Hour', value: 1 },
    { label: '2 Hours', value: 2 },
    { label: '4 Hours', value: 4 },
    { label: '6 Hours', value: 6 },
    { label: '12 Hours', value: 12 },
    { label: '24 Hours', value: 24 },
    { label: '1 Week', value: 7 * 24 },
    { label: '1 Month', value: 30 * 24 },
    { label: '3 Months', value: 3 * 30 * 24 },
    { label: '6 Months', value: 6 * 30 * 24 },
    { label: '1 Year', value: 12 * 30 * 24 }
  ];

  // Function to fetch current settings for a specific channel from the backend
const fetchSecuritySettings = async (channelId) => {
  try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);

      if (token) {
          const response = await axios.get(`${main_url}/api/security-actions/${channelId}/`, {
              headers: {
                  'Authorization': 'Bearer ' + jsonObject.access,
              },
          });

          const data = response.data;
          setPauseInvites(data.pause_invites);
          setPauseDMs(data.pause_dms);
          setPauseDuration(data.pause_duration);
      } else {
          console.log('No token found');
      }
  } catch (error) {
      console.log('Error fetching security settings:', error);
      Alert.alert('Error', 'Could not load security settings. Please try again.');
  }
};

useEffect(() => {
  if (visible && channelId) {
    fetchSecuritySettings(channelId); // Use channelId to fetch settings
  }
}, [visible, channelId]); 

  // Function to send updated settings to the backend for a specific channel
  const handleSave = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const jsonObject = JSON.parse(token);
        const channelId = setOverview.id;
  
        if (token) {
            const response = await axios.post(`${main_url}/api/security-actions/${channelId}/`, {
                pause_invites: pauseInvites,
                pause_dms: pauseDMs,
                pause_duration: pauseDuration,
            }, {
                headers: {
                    'Content-Type': 'application/json', // Set content type to JSON
                    'Authorization': 'Bearer ' + jsonObject.access,
                },
            });
  
            // Handle response after saving
            console.log('Security actions updated:', response.data);
            Alert.alert('Success', 'Security actions have been updated!');
        } else {
            console.log('No token found');
        }
    } catch (error) {
        console.log('Error saving security actions:', error);
        Alert.alert('Error', 'Could not save security actions. Please try again.');
    }
  
    onClose(); // Close the modal after saving
  };
  

  // Function to handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSecuritySettings(channelId); // Re-fetch the security settings
    setRefreshing(false); // End the refreshing animation
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Security Actions</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleSave}>
            <Text style={{ color: 'white' }}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.modalContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh} // Trigger refresh when pulled down
              tintColor="#fff"
            />
          }
        >
          <Text style={styles.sectionTitle}>Pause Invites</Text>
          <TouchableOpacity
            style={[styles.toggleButton, pauseInvites ? styles.active : styles.inactive]}
            onPress={() => setPauseInvites(!pauseInvites)}
          >
            <Text style={styles.buttonText}>{pauseInvites ? 'Invites Paused' : 'Pause Invites'}</Text>
          </TouchableOpacity>
          <Text style={styles.description}>
            Temporarily stop new members from joining your channel. Existing members are unaffected.
          </Text>

          <Text style={styles.sectionTitle}>Pause Direct Messages</Text>
          <TouchableOpacity
            style={[styles.toggleButton, pauseDMs ? styles.active : styles.inactive]}
            onPress={() => setPauseDMs(!pauseDMs)}
          >
            <Text style={styles.buttonText}>{pauseDMs ? 'DMs Paused' : 'Pause Direct Messages'}</Text>
          </TouchableOpacity>
          <Text style={styles.description}>
            Prevent new DMs between non-friends for the selected time. Friends, moderators, and app notifications can still DM.
          </Text>

          <Text style={styles.sectionTitle}>Pause Duration</Text>
          <ScrollView horizontal style={styles.durationContainer}>
            {durations.map((duration, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.durationButton, pauseDuration === duration.value && styles.selectedDuration]}
                onPress={() => setPauseDuration(duration.value)}
              >
                <Text style={styles.durationText}>{duration.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
  },
  backButton: {
    position: 'relative',
    top: 10,
    left: 0,
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#202020',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: '85%',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  backButtonContainer: {
    padding: 10,
    paddingBottom: -10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: '#fff',
  },
  createButton: {
    backgroundColor: '#36393f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: 60,
    height: 50,
    marginRight: 10,
    marginTop: 8,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white',
    marginTop: 20,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: '#1e90ff',
  },
  inactive: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  description: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 15,
    opacity: 0.7,
  },
  durationContainer: {
    marginVertical: 20,
    flexDirection: 'row',
  },
  durationButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#555',
    marginHorizontal: 5,
  },
  selectedDuration: {
    backgroundColor: '#1e90ff',
  },
  durationText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

