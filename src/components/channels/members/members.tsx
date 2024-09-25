import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Image, RefreshControl, useColorScheme, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import SetPermissions from './setPermissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { community } from '../../../constants/StaticData/en.json';
import { ThemeColors } from '../../../constants/thems';

export default function Members({ visible, onClose, onCreateChannel, setOverview, channelId, target_type, subchannelId }) {

  const [selectedTab, setSelectedTab] = useState('members');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [setPermissionsModal, setSetpermissionsModal] = useState(false);
  const [permissionsData, setPermissionsData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [singleUser, setSingleUser] = useState([]);
  const [ownerData, setOwnerData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [subchannelMembers, setSubchannelMembers] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [memberToggles, setMemberToggles] = useState({}); // For subchannel/group membership toggles
  const scheme = useColorScheme();
  const themeColors = ThemeColors[scheme];

 
  const handelOpenPermission = (id) => {

    // Check if the passed `id` exists in the selectedMemberIds array
    if (target_type === 'channel') {
        // Filter the selected user object from subchannelMembers
        const selectedUser = users.find(member => member.id === id);
        
        setSetpermissionsModal(true);

        // Set the complete user object to setSingleUser
        console.log("now you can see ==========================================", selectedUser)
        if (selectedUser) {
            setSingleUser(selectedUser);
            console.log("Selected User Object:", selectedUser);
        }
    }
};




  const handelClosePermission = () =>{
    setSetpermissionsModal(false)
  }

  // Function to fetch owner data
  const fetchOwnerData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);

      if (token) {
        const response = await axios.get(`${main_url}/api/channels/owner/${channelId}/`, {
          headers: {
            'Authorization': 'Bearer ' + jsonObject.access
          }
        });
        setOwnerData(response.data.owner);
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.log("Error fetching owner data:", error);
    }
  };

  // Function to fetch channel members
  const fetchChannelMembers = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);

      if (token) {
        const response = await axios.get(`${main_url}/api/channels/${channelId}/members/`, {
          headers: {
            'Authorization': 'Bearer ' + jsonObject.access
          }
        });
        setUsers(response.data.members);
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.log('Error fetching channel members:', error);
    }
  };

  // Function to fetch subchannel members
  const fetchSubchannelMembers = async (check) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
  
      if (!token) {
        console.log('No token found');
        return;
      }
  
      const jsonObject = JSON.parse(token);
      const subchannelId_shape = subchannelId
      const url = target_type === 'group'
        ? `${main_url}/api/subchannels/${subchannelId_shape}/members/`
        : `${main_url}/api/subchannels/${setOverview.id}/members/`;
  
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${jsonObject.access}`
        }
      });
  
      const members = response.data.members || []; // Default to empty array if not found
      setUsers(members);
  
      // Initialize memberToggles for subchannel
      if(check == 1){
        const toggles = {};
        members.forEach(member => {
          toggles[member.id] = true; // Set default toggle value (true if they are part of the subchannel)
        });
        setMemberToggles(toggles); // Update state with the toggles
      }
      
  
    } catch (error) {
      console.error('Error fetching subchannel members:', error);
    }
  };
  

  // Function to fetch group members
  const fetchGroupMembers = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);

      if (token) {
        const response = await axios.get(`${main_url}/api/groups/${setOverview.id}/members/`, {
          headers: {
            'Authorization': 'Bearer ' + jsonObject.access
          }
        });

        const members = response.data.members;
        setUsers(members);

        // Initialize memberToggles for group
        const toggles = {};
        members.forEach(member => {
          toggles[member.id] = true; // Set default toggle value (true if they are part of the group)
        });
        setMemberToggles(toggles); // Update state with the toggles
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.log('Error fetching group members:', error);
    }
  };


  useEffect(() => {
    fetchOwnerData();
    if (target_type === 'channel') {
      fetchChannelMembers();
    } else if (target_type === 'subchannel') {
      const check = 1
      fetchSubchannelMembers(check);
      fetchChannelMembers();
    } else if (target_type === 'group') {
      const check = 2
      fetchSubchannelMembers(check);
      fetchGroupMembers();
    }
  }, [target_type]);

  // Toggle member between channel and subchannel
  const toggleSubchannelMembership = (memberId) => {
    setMemberToggles((prevToggles) => ({
      ...prevToggles,
      [memberId]: !prevToggles[memberId],
    }));
  };

  // Toggle member between subchannel and group
  const toggleGroupMembership = (memberId) => {
    setMemberToggles((prevToggles) => ({
      ...prevToggles,
      [memberId]: !prevToggles[memberId],
    }));
  };

  const handleUpdatesubchannel = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
  
      if (!token) {
        console.log('No token found');
        return;
      }
  
      const jsonObject = JSON.parse(token);
  
      // Convert memberToggles object to an array of selected member IDs
      const selectedMemberIds = Object.keys(memberToggles).filter(id => memberToggles[id] === true);
      
      // Initialize request variables
      let requestBody;
      let url;
  
      if (target_type === 'group') {
        requestBody = {
          group_id: setOverview.id,
          members: selectedMemberIds
        };
        url = `${main_url}/api/groups/members/`;
      } else {
        requestBody = {
          sub_channel_id: setOverview.id,
          members: selectedMemberIds
        };
        url = `${main_url}/api/subchannels/members/`;
      }
  
      console.log("Channel ID:", setOverview.id);
      console.log("Selected members (array of IDs):", selectedMemberIds);
  
      // Make POST request with JSON body
      const response = await axios.post(url, requestBody, {
        headers: {
          'Authorization': `Bearer ${jsonObject.access}`,
          'Content-Type': 'application/json',
        }
      });
  
      setSubchannelMembers(response.data.members);
      onClose();
      
    } catch (error) {
      console.error('Error updating subchannel members:', error);
    }
  };
  

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (target_type === 'channel') {
      fetchChannelMembers().then(() => setRefreshing(false));
    } else if (target_type === 'subchannel') {
      const check = 1
      fetchChannelMembers();
      fetchSubchannelMembers(check).then(() => setRefreshing(false));
    } else if (target_type === 'group') {
      const check = 2
      fetchSubchannelMembers(check);
      fetchGroupMembers().then(() => setRefreshing(false));
    }
  }, [target_type]);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal style={{ backgroundColor: themeColors.background }} transparent visible={visible} animationType="slide">
      <View style={[styles.modalContainer,{ backgroundColor: themeColors.background }]}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} style={{ color: themeColors.text }} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[styles.modalTitle,  { color: themeColors.text }]}>{setOverview.name} {community.settings.members.title}</Text>
          </View>
          {target_type === 'subchannel'?(
            <TouchableOpacity style={styles.createButton} onPress={handleUpdatesubchannel}>
            <Text style={{ color: themeColors.text }}>{community.settings.members.save}</Text>
          </TouchableOpacity>
          ): target_type === 'group'?(
            <TouchableOpacity style={styles.createButton} onPress={handleUpdatesubchannel}>
            <Text style={{ color: themeColors.text }}>{community.settings.members.save}</Text>
          </TouchableOpacity>
          ):null}
          
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput,  { color: themeColors.text }]}
            onChangeText={setSearchTerm}
            value={searchTerm}
            placeholder={community.settings.members.search}
            placeholderTextColor="#ccc"
          />
        </View>
        <View>
            {ownerData && (
              <View style={styles.userInfoContainer}>
                <View style={styles.userpiccontainer}>
                <Image
                    style={styles.memberImage}
                    source={{ uri: `${main_url.replace(/\/$/, '')}/${ownerData.profile_picture.replace(/^\//, '')}` }}
                  />
                </View>
                <Text style={[styles.username,  { color: themeColors.text }]}>{community.settings.members.owner}: {ownerData.username}</Text>
              </View>
            )}
          </View>
        <ScrollView
          style={[styles.modalContent, { backgroundColor: themeColors.background }]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {filteredUsers.map((user) => (
            <TouchableOpacity key={user.id} style={styles.members} onPress={() => handelOpenPermission(user.id)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.userIcon}>
                  <Image
                    style={styles.memberImage}
                    source={{ uri: `${main_url.replace(/\/$/, '')}/${user.profile_picture.replace(/^\//, '')}` }}
                    onError={() => console.log('Error loading image')}
                  />
                </View>
                <Text style={[styles.username, { color: themeColors.text }]}>{user.username}</Text>
              </View>
              {target_type === 'subchannel' && (
                <Switch
                  value={memberToggles[user.id] || false}
                  onValueChange={() => toggleSubchannelMembership(user.id)}
                />
              )}
              {target_type === 'group' && (
                <Switch
                  value={memberToggles[user.id] || false}
                  onValueChange={() => toggleGroupMembership(user.id)}
                />
              )}
              {target_type === 'group'? (
               <></>
              ): target_type === 'subchannel'? (
                <></>
            ):( <MaterialCommunityIcons name="chevron-right" size={24} style={{ color: themeColors.text }} />)}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <SetPermissions
        visible={setPermissionsModal}
        onClose={handelClosePermission}
        permissionsData={permissionsData}
        setOverview={setOverview}
        singleUser={singleUser}
      />
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
  modalContent: {
    backgroundColor: '#202020',
    borderRadius: 8,
    padding: 20,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    marginTop: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  searchContainer: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width:'80%',
    color: '#fff',
    height: 40,
  },
  searchInput: {
    color: '#fff',
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    marginBottom: 10,
    width: "100%",
    paddingLeft: 5,
    paddingRight: 10,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
  },
  createButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIcon: {
    backgroundColor: 'graywishdarkblue',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    color: '#fff',
  },
  members: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: 'graywishdarkblue',
    borderBlockColor: ThemeColors.text,
    borderBottomWidth: .4 ,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userpiccontainer: {
    backgroundColor: 'graywishdarkblue',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  memberImage: {
    width: 40,  // set appropriate width
    height: 40, // set appropriate height
    resizeMode: 'cover',
    borderRadius: 25, // appropriate radius for a circle
  }
  
});
