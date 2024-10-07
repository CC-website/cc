import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert, FlatList, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { main_url } from '../../../constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const subjects = [
  { label: 'Report Issues', value: 'report' },
  { label: 'Add Suggestions for App Improvement', value: 'suggestion' },
];

export default function MessageCC({ visible, onClose, channelId }) {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].value);
  const [message, setMessage] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userMessages, setUserMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State to handle refreshing

  // Fetch messages for the logged-in user when the modal is opened
  const fetchUserMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);

      if (token) {
        const response = await axios.get(`${main_url}/api/CCmessages-from-channel/user/`, {
          headers: {
            'Authorization': 'Bearer ' + jsonObject.access,
            'Content-Type': 'application/json',
          },
        });

        setUserMessages(response.data);
      }
    } catch (error) {
      console.log('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchUserMessages();
    }
  }, [visible]);

  // Function to handle refreshing
  const onRefresh = async () => {
    setRefreshing(true); // Show the refreshing spinner
    await fetchUserMessages(); // Fetch the messages again
    setRefreshing(false); // Hide the refreshing spinner after fetching is complete
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);

      if (token && message) {
        const response = await axios.post(`${main_url}/api/CCmessages-from-channel/`, {
          subject: selectedSubject,
          message: message,
          channel: channelId,
          parent_message: null, // Set to null for new messages; modify as needed for replies
        }, {
          headers: {
            'Authorization': 'Bearer ' + jsonObject.access,
            'Content-Type': 'application/json',
          },
        });

        console.log('Message sent:', response.data);
        Alert.alert('Success', 'Your message has been sent successfully!');
        setMessage(''); // Clear message input
        onClose(); // Close the modal after sending the message
      } else {
        Alert.alert('Error', 'Please fill in the message field.');
      }
    } catch (error) {
      console.log('Error sending message:', error);
      Alert.alert('Error', 'Could not send your message. Please try again.');
    }
  };

  const renderMessageItem = ({ item }) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageSubject}>{item.subject}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.messageDate}>{new Date(item.created_at).toLocaleString()}</Text>
  
      {/* Render replies only if they exist and are not null */}
      {item.replies && item.replies.length > 0 && (
        <FlatList
          data={item.replies}
          keyExtractor={reply => reply.id.toString()}
          renderItem={({ item: reply }) => (
            <View style={styles.replyItem}>
              <Text style={styles.replyText}>{reply.message}</Text>
              <Text style={styles.replyDate}>{new Date(reply.created_at).toLocaleString()}</Text>
            </View>
          )}
          style={styles.repliesContainer}
        />
      )}
    </View>
  );
  

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Send Message to Company</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
            <Text style={{ color: 'white' }}>Send</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.instructionText}>
            Use this form to report issues with the channel or to send suggestions for app improvements.
          </Text>
          
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text style={styles.dropdownText}>
              {subjects.find(subject => subject.value === selectedSubject).label}
            </Text>
          </TouchableOpacity>

          {dropdownVisible && (
            <FlatList
              data={subjects}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedSubject(item.value);
                    setDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Message"
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />

          {/* Display messages and replies */}
          <FlatList
            data={userMessages}
            keyExtractor={item => item.id.toString()}
            renderItem={renderMessageItem}
            style={styles.messagesContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#202020',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0.3,
    borderBottomColor: '#fff',
  },
  backButton: {
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  createButton: {
    backgroundColor: '#36393f',
    padding: 10,
    borderRadius: 5,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  dropdown: {
    backgroundColor: '#303030',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  dropdownText: {
    color: 'white',
  },
  dropdownItem: {
    backgroundColor: '#404040',
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#fff',
  },
  dropdownItemText: {
    color: 'white',
  },
  input: {
    backgroundColor: '#303030',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  instructionText: {
    color: 'silver',
    marginBottom: 10,
  },
  messagesContainer: {
    marginTop: 20,
  },
  messageItem: {
    backgroundColor: '#404040',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  messageSubject: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageText: {
    color: 'white',
  },
  messageDate: {
    color: 'silver',
    fontSize: 12,
  },
  repliesContainer: {
    marginTop: 10,
  },
  replyItem: {
    backgroundColor: '#505050',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  replyText: {
    color: 'white',
  },
  replyDate: {
    color: 'silver',
    fontSize: 12,
  },
});
