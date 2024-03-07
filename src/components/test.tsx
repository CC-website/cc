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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sectionBase: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  section: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'royalblue',
    borderRadius: 10,
  },
  sectionContainer: {
    padding: 10,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  channelName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  channelItem: {
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  subChannelItem: {
    marginTop: 18,
  },
  groupChannelItem: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subChannelItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 199,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    width: '65%',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  spliter: {
    height: 0.3,
    width: '100%',
    backgroundColor: 'rgba(169, 169, 169, 0.1)',
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#fff',
    height: 34,
    width: '80%',
    paddingRight: 10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  searchButton: {
    backgroundColor: 'royalblue',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    padding: 3,
    marginLeft: -5,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#fff'
  },
  button: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 5,
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
  },
  searchInputbutton: {
    color: '#fff',
    marginLeft: 5,
    backgroundColor: '#3498db',
    padding: 5,
    borderRadius: 15,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 25,
  },

  newChannelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'royalblue',
    padding: 10,
    borderRadius: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  iconContainer: {
    position: 'relative',
  },
  iconContainer1: {
    position: 'absolute',
    left: 6,
    top: 6,
  },
});

export default function ChannelsScreen() {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedSubChannel, setSelectedSubChannel] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expandedSubChannels, setExpandedSubChannels] = useState({});
  const [mainChannelName, setMainChannelName] = useState('');
  const [mainChannelId, setMainChannelId] = useState('');

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
    <View style={styles.container}>
      <View style={[styles.sectionContainer, { marginTop: 40, padding: 2, width: 80 }]}>
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
              style={[
                styles.channelItem,
                {
                  backgroundColor:
                    selectedChannel === item.id
                      ? '#202020'
                      : item.id === ''
                        ? 'transparent'
                        : 'transparent',
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
      <View style={[styles.section, { flex: 7, marginTop: 40 }]}>
        {selectedChannel ? (
          <View style={{ width: '100%', height: '100%' }}>
            <View style={styles.sectionContainer}>
              <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
                {mainChannelName && (
                  <Text style={{ color: 'white', fontSize: 18 }}>{mainChannelName}</Text>
                )}

                <TouchableOpacity onPress={handleSettings}>
                  <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
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
                    <FontAwesome5 name="bars" size={15} color="silver" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconContainer1}>
                    <FontAwesome5 name="search" size={8} color="white" />
                  </TouchableOpacity>
                </View>
                <Text style={{ marginLeft: 10, fontSize: 15, color: 'white' }}>Browse Channels</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.spliter}></View>

            <View style={styles.sectionContainer}>
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
                        color="#fff"
                      />
                      <Text style={[styles.channelName, { marginLeft: 5 }]}>{item.name}</Text>
                    </View>
                    {expandedSubChannels[item.id] &&
                      item.groups.map((group) => (
                        <TouchableOpacity
                          key={group.id}
                          style={[
                            styles.groupChannelItem,
                            { backgroundColor: selectedGroup === group.id ? 'red' : '#202020' },
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
                          <Text style={[styles.channelName, { marginLeft: 5 }]}> {group.name}</Text>
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
      <View style={[styles.sectionBase, { flex: 0.3 }]}>
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
