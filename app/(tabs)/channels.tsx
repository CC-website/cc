import React, { useRef, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView, StyleSheet, PanResponder, Image, Dimensions, useColorScheme  } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import NewChannelForm from '../../src/components/channels/settings/newChannelForm'; // Adjust the path based on your project structure
import NewSubChannelForm from '../../src/components/channels/subchannels/newSubChannel';
import NewGroupForm from '../../src/components/channels/groups/NewGroup';
import Settings from '../../src/components/channels/settings/settings';
import Icon from 'react-native-vector-icons/FontAwesome';
import { main_url } from '../../src/constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddUsers from '../../src/components/users/AddUsers';
import { useTheme } from '../../src/constants/ThemeContext';
import Colors from '../../src/constants/Colors';
import Styles from '../../src/constants/Styles/channel';
import Groupe from '../../src/components/channels/groups';
import AllCommunities from '../../src/components/channels/settings/AllCommunities';

const ChannelsScreen = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedSubChannel, setSelectedSubChannel] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expandedSubChannels, setExpandedSubChannels] = useState({});
  const [mainChannelName, setMainChannelName] = useState('');
  const [mainChannelId, setMainChannelId] = useState('');
  const [groupModal, setGroupModal] = useState(1);
  const [openby, setOpenby] = useState(0);
  const styles = Styles();
  const [showBottomBar, setShowBottomBar] = useState(true); // Example state in TabBottomLayout
  const scheme = useColorScheme();
  const [ModalVisibleCommunity, setModalVisibleCommunity] = useState(false);


  const screenWidth = Dimensions.get('window').width;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          console.log('Swiped from right to left');
          setGroupModal(1); // Open the group screen
        }

        if (gestureState.dx > 50) {
          console.log('Swiped from left to right');
          setGroupModal(0); // Close the group screen
        }
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const getChannel = async ( axiosInstance, mainUrl, setChannels) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);
      console.log(jsonObject.access)
      if (token) {
        console.log(`${mainUrl}/api/channels/`)
        const response = await axiosInstance.get(`${mainUrl}/api/channels/`, {
          headers: {
            'Authorization': 'Bearer ' + jsonObject.access
          }
        });
        console.log('Channels data:', response.data);
        setChannels(response.data);
      } else {
        console.error('No token found');
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  useEffect(() => {
    getChannel(axios, main_url, setChannels);
  }, []);


  useEffect(() => {
    if (selectedChannel) {
      const mainChannel = channels.find((c) => c.id === selectedChannel);
      setMainChannelName(mainChannel ? mainChannel.name : '');
      setMainChannelId(mainChannel ? mainChannel.id : '');
    } else {
      setMainChannelName('');
      setMainChannelId('');
    }
  }, [selectedChannel, channels]);

  const handleChannelPress = (channelId) => {
    setSelectedChannel(channelId);
    setSelectedSubChannel(null);
    setSelectedGroup(null);
  };

  const handleSubChannelPress = (subChannelId) => {
    setExpandedSubChannels((prev) => ({
      ...prev,
      [subChannelId]: !prev[subChannelId],
    }));

    if (!expandedSubChannels[subChannelId]) {
      setSelectedSubChannel(subChannelId);
    }
  };

  const handleGroupPress = (groupId) => {
    setSelectedGroup(groupId);
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible3, setModalVisible3] = useState(false);
  const [addusersModal, setAddusersModal] = useState(false);

  const handleNewMainChannel = () => {
    setModalVisible(true);
  };

  const handleSettings = () => {
    setModalVisible3(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleCloseModal3 = () => {
    setModalVisible3(false);
  };

  const handleAddUsers = () => {
    setAddusersModal(true)
  };

  const handleAddUsersClose = () => {
    setAddusersModal(false)
  };

  const handGroupMOdalOpen = () => {
    setGroupModal(1)
  };

  const handGroupMOdalClose = () => {
    setGroupModal(0)
  };

  const handleCreateChannel = (channelName) => {
    console.log('Creating new channel:', channelName);
  };


  const handelCommunityView = () =>{
    setModalVisibleCommunity(true)
  }

  const handelCommunityclose = () =>{
    setModalVisibleCommunity(false)
  }

  const colors = {
    light: {
      background: '#f4f4f4',
      card: '#ffffff',
      text: '#000000',
      button: '#007bff',
      buttonText: '#ffffff',
      inputBackground: '#ffffff',
      inputText: '#000000',
      inputBorder: '#cccccc',
    },
    dark: {
      background: '#1A1A24',
      card: '#242333',
      text: '#ffffff',
      button: '#0d0a1e',
      buttonText: '#ffffff',
      inputBackground: '#ffff',
      inputText: '#ffffff',
      inputBorder: '#ffff',
    },
  };

  const themeColors = colors[scheme];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]} {...panResponder.panHandlers}>
      <View style={[styles.sectionContainer, { marginTop: 60, padding: 2, width: 80 }, { backgroundColor: themeColors.card }]}>
        <TouchableOpacity
          style={[styles.channelItem, styles.newChannelButton, { width: 70, marginLeft: 4 }]}
          onPress={handleNewMainChannel}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.channelItem, styles.newChannelButton, { width: 70, marginLeft: 4 }]}
          onPress={handelCommunityView}
        >
          <Ionicons name="people-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <FlatList
          data={channels}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[selectedChannel === item.id ? styles.channelItem : styles.channelItem1, { marginBottom: index === channels.length - 1 ? 20 : 0 }]}
              onPress={() => handleChannelPress(item.id)}
              disabled={!item.id}
            >
              <Image
                source={{ uri: item.image_url ? item.image_url : "http://192.168.145.37:8000/channel_logos/channel1.png" }}
                style={styles.logoImage}
              />
              <Text style={styles.channelName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.sectionBase, { marginTop: 10, alignItems: 'center' }]}
        />
      </View>
      <View style={[styles.section, { flex: 7, marginTop: 40, borderTopLeftRadius: 30 }, { backgroundColor: themeColors.card }]} >
        {selectedChannel ? (
          <View style={{ width: '100%', height: '100%' }}>
            <View style={[styles.sectionContainer1, { backgroundColor: themeColors.card }]}>
              <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5, marginLeft: 20 }}>
                {mainChannelName && (
                  <Text style={[styles.titleText, { color: themeColors.text }]}>{mainChannelName}</Text>
                )}
                <TouchableOpacity onPress={handleSettings}>
                  <Ionicons name="ellipsis-horizontal" size={20} style={[styles.dropDownbotton, { color: themeColors.text }]} />
                </TouchableOpacity>
              </View>
              <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                  <View style={styles.searchInput}>
                    <TextInput placeholder="Search" style={{ color: 'white' }} />
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.newChannelButton, { width: '25%', backgroundColor: '#36393f', justifyContent: 'center' }]}
                  onPress={handleAddUsers}
                >
                  <Icon name="user-plus" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{ width: '100%', alignItems: 'center', padding: 10, marginTop: 15, flexDirection: 'row' }}
                onPress={handleNewMainChannel}
              >
                <View style={styles.headerContainer}>
                  <TouchableOpacity style={styles.iconContainer}>
                    <FontAwesome5 name="bars" size={15} style={[styles.dropDownbotton, { color: themeColors.text }]} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconContainer1}>
                    <FontAwesome5 name="search" size={8} style={[styles.dropDownbotton, { color: themeColors.text }]} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.dropDownbotton, { marginLeft: 10, fontSize: 15 }, { color: themeColors.text }]}>Browse Channels</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.spliter}></View>
            <View style={[styles.sectionContainer1, { backgroundColor: themeColors.card }]}>
              <FlatList
                data={channels.find((c) => c.id === selectedChannel)?.subchannels || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.subChannelItem]}
                    onPress={() => handleSubChannelPress(item.id)}
                    disabled={!item.id}
                  >
                    <View style={styles.subChannelItemContainer}>
                      <Ionicons
                        name={expandedSubChannels[item.id] ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        style={styles.dropDownbotton}
                      />
                      <Text style={[styles.channelName, { marginLeft: 5 }]}>{item.name}</Text>
                    </View>
                    {expandedSubChannels[item.id] &&
                      item.groups.map((group) => (
                        <TouchableOpacity
                          key={group.id}
                          style={[styles.groupChannelItem, { backgroundColor: selectedGroup === group.id ? 'royalblue' : '#36393f' }]}
                          onPress={() => handleGroupPress(group.id)}
                          disabled={!group.id}
                        >
                          <Image
                            source={{ uri: group.image_url ? group.image_url : "http://192.168.145.37:8000/group_logos/group.png" }}
                            style={[styles.logoImage, { borderRadius: 10, height: 35 }]}
                          />
                          <Text style={[styles.channelName, { marginLeft: 5, color: 'white' }]}> {group.name}</Text>
                        </TouchableOpacity>
                      ))}
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        ) : (
            <Text>No channel selected</Text>
          )}
          
      </View>
      <View style={[styles.sectionBase, { flex: 0.2 }]}>
        <Text style={styles.text}></Text>
      </View>
      <TouchableOpacity onPress={() => handGroupMOdalOpen()} style={[styles.groupSection, { flex: 1.7, marginTop: 40 }]}>

      </TouchableOpacity>
      <NewChannelForm
        visible={isModalVisible}
        onClose={handleCloseModal}
        onCreateChannel={handleCreateChannel}
      />
      <Settings
        visible={isModalVisible3}
        onClose={handleCloseModal3}
        onCreateChannel={handleCreateChannel}
        channelInfo={channels.find((c) => c.id === selectedChannel) || {}}
      />
      <AddUsers
        visible={addusersModal}
        onClose={handleAddUsersClose}
        onCreateChannel={handleAddUsers}
        channelName={mainChannelName}
        ChannelId={mainChannelId}
        name='channel'
      />
      <Groupe
        visible={groupModal !== 0}
        onClose={handGroupMOdalClose}
        setShowBottomBar={setShowBottomBar} 
      />
      <AllCommunities
        visible={ModalVisibleCommunity}
        onClose={handelCommunityclose}
      />
    </View>
  );
};

export default ChannelsScreen;
