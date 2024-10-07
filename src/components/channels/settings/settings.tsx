import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Switch,
  Alert,
  RefreshControl,
} from 'react-native';
import { main_url } from '../../../constants/Urls';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can replace FontAwesome with your preferred icon library
import { Image } from 'react-native';
import NewSubChannelForm from '../subchannels/newSubChannel';
import NewGroupForm from '../groups/NewGroup';
import ChannelSettings from './channelSettings';
import SecurityAction from '../general_ations/security_action';
import MessageCC from '../general_ations/messageCC';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NewEvent from '../../events/newEvent';
import ListEvents from '../../events/listEvents';

export default function EmptyModal({ visible, onClose, channelInfo }) {
  const {
    image_url,
    name,
    onlineMembers,
    totalMembers,
  } = channelInfo;

  const [buttonOpacity, setButtonOpacity] = useState(1);
  const [hideMutedChannel, setHideMutedChannel] = useState(false);
  const [allowDirectMessages, setAllowDirectMessages] = useState(false);
  const [allowMessageRequests, setAllowMessageRequests] = useState(false);
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [isModalVisible3, setModalVisible3] = useState(false);
  const [securityActions, setSecurityActions] = useState(false);
  const [messageCC, setMessageCC] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newEvent, setNewEvent] = useState(false);
  const [listEvent, setListEvent] = useState(false);

  const handleToggle = (setter) => {
    setter((prev) => !prev);
  };

  const handleOpenListEvent = () => {
    setListEvent(true);
  };

  const handleCloseListEvent = () =>{
    setListEvent(false);
  }

  const handleOpenNewEvent = () => {
    setNewEvent(true);
  };

  const handleCloseNewEvent = () =>{
    setNewEvent(false);
  }

  const handleOpenMessageCC = () => {
    setMessageCC(true);
  };

  const handleCloseMessageCC = () =>{
    setMessageCC(false);
  }

  const handleOpenSecurityAction = () => {
    setSecurityActions(true);
  };

  const handleCloseSecurityAction = () =>{
    setSecurityActions(false);
  }

  const handleNewSubChannel = () => {
    setModalVisible1(true);
  };

  const handleChannelSettings = () =>{
    setModalVisible3(true);
  }

  const handleCloseModal1 = () => {
    setModalVisible1(false);
  };

  const handleCloseModal3 = () => {
    setModalVisible3(false);
  };
  
  const handleNewGroup = () => {
    setModalVisible2(true);
  };

  const handleCloseModal2 = () => {
    setModalVisible2(false);
  };

  const handleCreateChannel = (channelName) => {
    // Implement logic to create a new main channel
    console.log('Creating new channel:', channelName);
    // You may want to send an API request to create the channel on the server
  };



  const getModerationSettings = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const channelId = channelInfo?.id; // Ensure channelInfo is defined
  
      if (token) {
        const jsonObject = JSON.parse(token); // Parse token if it's a JSON object
        const response = await axios.get(`${main_url}/api/moderation-actions/${channelId}/`, {
          headers: {
            'Authorization': 'Bearer ' + jsonObject.access,
          },
        });
  
        const { mute_channel, direct_message, message_request } = response.data;
  
        // Set the state based on the backend response
        setHideMutedChannel(mute_channel);
        setAllowDirectMessages(direct_message);
        setAllowMessageRequests(message_request);
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.error('Error fetching moderation settings:', error);
    }
  };

 // Call fetchModerationSettings initially or when channelInfo changes
 useEffect(() => {
  getModerationSettings();
}, [channelInfo]);



  const handleSwitchToggle = async (value) => {
    console.log('Switch Toggled:', value);

    try {
        const token = await AsyncStorage.getItem('userToken');
        const jsonObject = JSON.parse(token);
        const channelId = channelInfo.id;

        if (token) {
            const response = await axios.post(`${main_url}/api/moderation-actions/${channelId}/`, {
                moderation: value,  // 'message_request', 'direct_message', 'mute_channel'
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jsonObject.access,
                },
            });

            console.log('Security actions updated:', response.data);
            console.log('Success', 'Security actions have been updated!');
        } else {
            console.log('No token found');
        }
    } catch (error) {
        console.log('Error saving security actions:', error);
        Alert.alert('Error', 'Could not save security actions. Please try again.');
    }
};

// Define the onRefresh function for pull-to-refresh
const onRefresh = async () => {
  setRefreshing(true);
  await getModerationSettings(); // Reload moderation settings
  setRefreshing(false);
};


  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Adding RefreshControl
          }
        >
          {/* Top Section */}
          <View style={styles.topSection}>
            <View style={{ marginTop: 0 }}>
              {/* Channel Logo */}
              <TouchableOpacity style={styles.logo}>
                <Image source={{ uri: image_url ? image_url : ""+main_url+"/channel_logos/channel1.png", }} style={styles.channelLogo} />
              </TouchableOpacity>

              {/* Channel Name and Members */}
              <View style={styles.channelInfoContainer}>
                <Text style={styles.channelName}>{name}</Text>
                <View style={styles.membersContainer}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.membersText}>{onlineMembers} online</Text>
                  <View style={styles.memberDot} />
                  <Text style={styles.membersText}>{totalMembers} Member(s)</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Line Separator */}
          <View style={styles.separator} />

          {/* Icon Buttons Section */}
          <View style={styles.iconButtonsContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="rocket" size={20} color="#fff" />
              <Text style={styles.iconLabel}>VIP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOpenListEvent} style={styles.iconButton}>
            <Icon name="calendar" size={20} color="#fff" />
              <Text style={styles.iconLabel}>Events</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="bell" size={20} color="#fff" />
              <Text style={styles.iconLabel}>Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleChannelSettings} style={styles.iconButton}>
              <Icon name="cogs" size={20} color="#fff" />
              <Text style={styles.iconLabel}>Settings</Text>
            </TouchableOpacity>
          </View>

          {/* Mark as Read Button */}
          <TouchableOpacity
            style={{ ...styles.markAsReadButton, opacity: buttonOpacity }}
            onPress={() => console.log('Mark as Read pressed')}
          >
            <Text style={styles.markAsReadText}>Mark All Notifications As Read</Text>
          </TouchableOpacity>
          <View style={{ marginTop: 25 }}>
            {/* Create Sub Channel */}
            <TouchableOpacity
              style={{ ...styles.createButton, opacity: buttonOpacity }}
              onPress={handleNewSubChannel}
            >
              <Text style={styles.markAsReadText}>Create Sub Channel</Text>
            </TouchableOpacity>

            {/* Create Group */}
            <TouchableOpacity
              style={{ ...styles.createButton1, opacity: buttonOpacity }}
              onPress={handleNewGroup}
            >
              <Text style={styles.markAsReadText}>Create Group</Text>
            </TouchableOpacity>

            {/* Create Event */}
            <TouchableOpacity
              style={{ ...styles.createButton2, opacity: buttonOpacity }}
              onPress={handleOpenNewEvent}
            >
              <Text style={[styles.markAsReadText, { color: 'white' }]}>Create Event</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 25 }}>
            {/* Channel Profile */}
            <TouchableOpacity
              style={{ ...styles.createButton, opacity: buttonOpacity }}
              onPress={() => console.log('Channel Profile pressed')}
            >
              <Text style={styles.markAsReadText}>Channel Profile</Text>
            </TouchableOpacity>

            {/* Hide Muted Channel */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Hide Muted Channel</Text>
              <Switch
                value={hideMutedChannel}
                onValueChange={() => {
                  handleToggle(setHideMutedChannel);
                  setToggleSwitch(!toggleSwitch);
                  handleSwitchToggle("mute_channel");
                }}
              />
            </View>

            {/* Allow Direct Messages */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Allow Direct Messages</Text>
              <Switch
                value={allowDirectMessages}
                onValueChange={() => {
                  handleToggle(setAllowDirectMessages);
                  setToggleSwitch(!toggleSwitch);
                  handleSwitchToggle("direct_message");
                }}
              />
            </View>

            {/* Allow Message Requests */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Allow Message Requests</Text>
              <Switch
                value={allowMessageRequests}
                onValueChange={() => {
                  handleToggle(setAllowMessageRequests);
                  setToggleSwitch(!toggleSwitch);
                  handleSwitchToggle("message_request");
                }}
              />
            </View>

            {/* Report Server */}
            <TouchableOpacity
              style={{ ...styles.createButton1, opacity: buttonOpacity }}
              onPress={handleOpenMessageCC}
            >
              <Text style={styles.markAsReadText}>Message CC</Text>
            </TouchableOpacity>

            {/* Security Action */}
            <TouchableOpacity
              style={{ ...styles.createButton2, opacity: buttonOpacity, marginBottom: 40 }}
              onPress={handleOpenSecurityAction}
            >
              <Text style={[styles.markAsReadText, { color: '#4A0000'}]}>Security Action</Text>
            </TouchableOpacity>
          </View>

          {/* Back Arrow Icon Button */}
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
        </ScrollView>
        {/* New Sub Channel Form Modal */}
      <NewSubChannelForm
        visible={isModalVisible1}
        onClose={handleCloseModal1}
        onCreateChannel={handleCreateChannel}
        selectedChannel={channelInfo}
      />
      {/* New Group Form Modal */}
      <NewGroupForm
        visible={isModalVisible2}
        onClose={handleCloseModal2}
        onCreateChannel={handleCreateChannel}
        selectedChannel={channelInfo}
        // setChannels={setChannels}
      />

      {/* New Group Form Modal */}
      <ChannelSettings
        visible={isModalVisible3}
        onClose={handleCloseModal3}
        onCreateChannel={handleCreateChannel}
        selectedChannel={channelInfo}
        // setChannels={setChannels}
      />

      {/* Security Action Modal */}
      <SecurityAction
        visible={securityActions}
        onClose={handleCloseSecurityAction}
        setOverview={channelInfo}
        channelId = {channelInfo.id}
        // setChannels={setChannels}
      />

      <MessageCC
        visible={messageCC}
        onClose={handleCloseMessageCC}
        setOverview={channelInfo}
        channelId = {channelInfo.id}
        // setChannels={setChannels}
      />

      <NewEvent
        visible={newEvent}
        onClose={handleCloseNewEvent}
        setOverview={channelInfo}
      />

      <ListEvents
        visible={listEvent}
        onClose={handleCloseListEvent}
        setOverview={channelInfo}
      />
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#202020',
    width: '100%',
    height: '88%',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    position: 'relative',
    marginTop: 90,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  channelLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  channelInfoContainer: {
    marginLeft: 10,
    marginTop: 15,
  },
  channelName: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'green',
    marginRight: 5,
  },
  memberDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  membersText: {
    color: '#fff',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#36393f',
    marginVertical: 10,
    width: '118%',
    left: -18,
  },
  iconButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 3,
    marginBottom: 10,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconLabel: {
    color: '#fff',
    marginTop: 5,
  },
  markAsReadButton: {
    backgroundColor: '#36393f',
    paddingLeft: 10,
    justifyContent: 'center',
    borderRadius: 10,
    width: '100%',
    alignSelf: 'center',
    marginTop: 15,
    height: 55,
  },
  createButton: {
    backgroundColor: '#36393f',
    paddingLeft: 10,
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    alignSelf: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#fff',
    height: 60,
  },
  createButton1: {
    backgroundColor: '#36393f',
    paddingLeft: 10,
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#fff',
    height: 60,
  },
  createButton2: {
    backgroundColor: '#36393f',
    paddingLeft: 10,
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: '100%',
    alignSelf: 'center',
    height: 60,
    marginBottom: 15,
  },
  markAsReadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  logo: {
    backgroundColor: '#36393f',
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#36393f',
    paddingLeft: 10,
    width: '100%',
    alignSelf: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#fff',
    height: 60,
  },
  toggleText: {
    color: '#fff',
    fontSize: 16,
  },
});
