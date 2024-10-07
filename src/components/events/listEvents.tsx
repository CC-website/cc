import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView, // Replace FlatList with ScrollView
  Alert,
  TextInput,
  Image,
  RefreshControl, // Import Image component
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { main_url } from '../../constants/Urls';
import NewEvent from './newEvent';

export default function ListEvents({ visible, onClose, setOverview, navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [newEvent, setNewEvent] = useState(false);
  const [sendeventId, seteventId] = useState(null);
  


  const handleOpenNewEvent = (id) => {
    seteventId(id)
    setNewEvent(true);
  };

  const handleCloseNewEvent = () =>{
    setNewEvent(false);
  }

  const statusOptions = [
    { label: 'ACTIVE', color: '#28a745' },      // Green
    { label: 'INACTIVE', color: '#6c757d' },    // Gray
    { label: 'CANCELLED', color: '#dc3545' },   // Red
    { label: 'COMPLETED', color: '#17a2b8' },    // Teal
    { label: 'POSTPONED', color: '#ffc107' },    // Yellow
    { label: 'DRAFT', color: '#007bff' },        // Blue
  ];
  


  const fetchEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);
      const response = await axios.get(`${main_url}/api/events/?channel_id=${setOverview.id}`, {
        headers: {
          'Authorization': `Bearer ${jsonObject.access}`,
        },
      });
      console.log("check event data -00000000000000000000000000000000000000000", response.data)
      setEvents(response.data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load events.');
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    if (visible) {
      fetchEvents();
    }
  }, [visible]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents(); 
  };

  const updateEventStatus = async (eventId, newStatus) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);
  
      const response = await axios.get(
        `${main_url}/api/events/${eventId}/update-status/`, // Updated the endpoint URL to match the new status update method
        {
          headers: {
            'Authorization': `Bearer ${jsonObject.access}`,
            'Content-Type': 'application/json',
          },
          params: { status: newStatus }, // Pass the new status as a query parameter
        }
      );
  
      Alert.alert('Success', response.data.detail);
  
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, status: newStatus } : event
        )
      );
      setStatusModalVisible(false); 
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update event status.');
    }
  };
  

  const handleStatusChange = (event) => {
    setSelectedEvent(event);
    setStatusModalVisible(true); 
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Events</Text>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by event name"
          placeholderTextColor="silver"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {loading ? (
          <Text style={{ color: '#fff' }}>Loading events...</Text>
        ) : (
          <ScrollView
            contentContainerStyle={styles.eventList}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={refreshing}
            //     onRefresh={onRefresh} // Calls the onRefresh function when pulled down
            //     colors={['#fff']} // You can customize the color of the refresh indicator
            //   />
            // }
          >
            {filteredEvents.map((item) => {
              const status = statusOptions.find(option => option.label === item.status);
              const statusColor = status ? status.color : '#fff'; 
              return (
                <View key={item.id.toString()} style={styles.eventItem}>
                  <Image
                      source={{
                        uri: item.image
                          ? `${main_url.replace(/\/$/, '')}/${item.image.replace(/^\//, '')}`
                          : null, // Fallback to null if image is null or undefined
                      }}
                      style={styles.eventImage}
                    />

                  <View style={styles.eventDetails}>
                    <Text style={styles.eventName}>{item.name}</Text>
                    <Text style={styles.eventDescription}>{item.description}</Text>
                    <View style={styles.eventStatusContainer}>
                      <Text style={[styles.eventStatus, { backgroundColor: statusColor }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.eventActions}>
                    <TouchableOpacity onPress={() => handleOpenNewEvent(item.id)}
                    >
                      <Icon name="edit" size={20} color="#fff" style={styles.actionIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleStatusChange(item)}>
                      <Icon name="list" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        <Modal
          transparent={true}
          visible={statusModalVisible}
          animationType="slide"
          onRequestClose={() => setStatusModalVisible(false)}
        >
          <View style={styles.statusModalContainer}>
            <View style={styles.statusModalContent}>
              <Text style={styles.statusModalTitle}>Select Status</Text>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status.label}
                  style={styles.statusOption}
                  onPress={() => {
                    setSelectedStatus(status.label);
                    updateEventStatus(selectedEvent.id, status.label);
                  }}
                >
                  <Text style={styles.statusText}>{status.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setStatusModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <NewEvent
        visible={newEvent}
        onClose={handleCloseNewEvent}
        setOverview={setOverview}
        eventId={sendeventId}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#202020',
    paddingTop: 50,
  },
  backButton: {
    position: 'relative',
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  backButtonContainer: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: 'silver',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '90%',
    color: 'white',
  },
  eventList: {
    padding: 20,
    width: '100%',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  eventDetails: {
    flex: 1,
  },
  eventName: {
    color: 'silver',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDescription: {
    color: 'silver',
    fontSize: 14,
    marginVertical: 5,
  },
  eventStatusContainer: {
    marginTop: 5,
  },
  eventStatus: {
    padding: 5,
    borderRadius: 5,
    color: '#fff',
  },
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 10,
  },
  statusModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  statusModalContent: {
    width: '80%',
    backgroundColor: '#444',
    padding: 20,
    borderRadius: 10,
  },
  statusModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  statusOption: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: '#555',
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  cancelText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});
