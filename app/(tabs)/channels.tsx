import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import NewChannelForm from '../../src/components/channels/settings/newChannelForm'; // Adjust the path based on your project structure
import { Image } from 'react-native';
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



export default function ChannelsScreen() {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedSubChannel, setSelectedSubChannel] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expandedSubChannels, setExpandedSubChannels] = useState({});
  const [mainChannelName, setMainChannelName] = useState('');
  const [mainChannelId, setMainChannelId] = useState('');
  const styles = Styles();

   











  const getChannel = async (axiosInstance, mainUrl, setChannels) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);
      if (token) {
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
  }

  const handleAddUsersClose = () => {
    setAddusersModal(false)
  }

  const handleCreateChannel = (channelName) => {
    console.log('Creating new channel:', channelName);
  };

  return (
    <View style={[styles.container]}>
      <View style={[styles.sectionContainer, { marginTop: 60, padding: 2, width: 80 }]}>
        <TouchableOpacity
          style={[styles.channelItem, styles.newChannelButton, { width: 70, marginLeft: 4 }]}
          onPress={handleNewMainChannel}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <FlatList
          data={channels}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[selectedChannel === item.id?
                styles.channelItem: styles.channelItem1,
                {
                  marginBottom: index === channels.length - 1 ? 20 : 0,
                },
              ]}
              onPress={() => handleChannelPress(item.id)}
              disabled={!item.id}
            >
              <Image
                source={{
                  uri: item.image_url
                    ? item.image_url
                    : "http://192.168.145.37:8000/channel_logos/channel1.png",
                }}
                style={styles.logoImage}
              />
              <Text style={styles.channelName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.sectionBase,
            { marginTop: 10, alignItems: 'center' },
          ]}
        />
      </View>
      <View style={[styles.section, { flex: 7, marginTop: 40 , borderTopLeftRadius: 30,}, ]}>
        {selectedChannel ? (
          <View style={{ width: '100%', height: '100%' }}>
            <View style={styles.sectionContainer1}>
              <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5, marginLeft: 20, }}>
                {mainChannelName && (
                  <Text style={styles.titleText}>{mainChannelName}</Text>
                )}

                <TouchableOpacity onPress={handleSettings}>
                  <Ionicons name="ellipsis-horizontal" size={20} style={styles.dropDownbotton} />
                </TouchableOpacity>

              </View>

              <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                  <View style={styles.searchInput}>
                    <TextInput placeholder="Search" style={{ color: 'white' }} />
                  </View>

                  <TouchableOpacity style={styles.searchButton} onPress={() => console.log('Create new group')}>
                    <Ionicons name="search" size={24} color="#fff" />
                  </TouchableOpacity>
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
                    <FontAwesome5 name="bars" size={15} style={styles.dropDownbotton} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconContainer1}>
                    <FontAwesome5 name="search" size={8} style={styles.dropDownbotton} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.dropDownbotton,{ marginLeft: 10, fontSize: 15 }]}>Browse Channels</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.spliter}></View>

            <View style={styles.sectionContainer1}>
              <FlatList
                data={channels.find((c) => c.id === selectedChannel)?.subchannels || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.subChannelItem,
                    ]}
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
                          style={[
                            styles.groupChannelItem,
                            { backgroundColor: selectedGroup === group.id ? 'royalblue' : '#36393f' },
                          ]}
                          onPress={() => handleGroupPress(group.id)}
                          disabled={!group.id}
                        >
                      
                          <Image
                            source={{
                              uri: group.image_url
                                ? group.image_url
                                : "http://192.168.145.37:8000/group_logos/group.png",
                            }}
                            style={[styles.logoImage, { borderRadius: 10, height: 35 }]}
                          />
                          <Text style={[styles.channelName, { marginLeft: 5 , color: 'white',}]}> {group.name}</Text>
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
      <View style={[styles.section, { flex: 1.7, marginTop: 40 }]}>
        <Text style={[styles.text, { color: 'red' }]}>
          {selectedGroup
            ? channels
              .reduce(
                (acc, channel) =>
                  acc.concat(
                    channel.subchannels.reduce(
                      (subAcc, subchannel) =>
                        subAcc.concat(subchannel.groups.map((group) => ({ ...group, subchannel }))),
                      []
                    )
                  ),
                []
              )
              .find((g) => g.id === selectedGroup)?.name
            : ''}
        </Text>
      </View>
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
    </View>
  );
}

