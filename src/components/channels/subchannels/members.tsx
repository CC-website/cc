import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Image, RefreshControl, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { community } from '../../../constants/StaticData/en.json';
import { ThemeColors } from '../../../constants/thems';
import SetPermissions from '../members/setPermissions';

export default function SubChannelMembers({ visible, onClose, setOverview, channelId }) {
  const [selectedTab, setSelectedTab] = useState('members');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [setPermissionsModal, setSetpermissionsModal] = useState(false);
  const [permissionsData, setPermissionsData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [singleUser, setSingleUser] = useState([]);
  const [ownerData, setOwnerData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const scheme = useColorScheme();
  const themeColors = ThemeColors[scheme];


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
        console.log(response.data.owner);
        setOwnerData(response.data.owner); // Assuming the response contains owner data
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.log("Error fetching owner data:", error);
    }
  };

  useEffect(() => {
    console.log("channel id uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu", channelId)
    fetchOwnerData();
  }, []);

  useEffect(() => {
    fetchPermissions();
    fetchUsers();
  }, [selectedTab]);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);

      if (token) {
        console.log(`${main_url}/api/channels/${channelId}/members/`);
        const response = await axios.get(`${main_url}/api/channels/${channelId}/members/`, {
          headers: {
            'Authorization': 'Bearer ' + jsonObject.access
          }
        });
        console.log(response.data.members);
        setUsers(response.data.members);
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.log('Error fetching users 111111:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);

      if (token) {
        console.log(`${main_url}/api/permissions/list/`);
        const response = await axios.get(`${main_url}/api/permissions/list/`, {
          headers: {
            'Authorization': 'Bearer ' + jsonObject.access
          },
          params: { target_id: channelId }
        });
        console.log('Permissions data:', response.data);

        // Filter out duplicate permissions based on their IDs
        const uniquePermissions = Array.from(new Set(response.data.map(permission => permission.id)))
          .map(id => response.data.find(permission => permission.id === id));

        setPermissions(uniquePermissions);
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.log('Error fetching permissions:', error);
    }
  };

  const closeSetpermissionsModal = () => {
    setSetpermissionsModal(false);
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectedUser = (userId) => {
    // Fetch permissions
    fetchPermissions();

    // Find the selected user
    const selectedUser = users.find(user => user.id === userId);
    console.log("Selected User:", selectedUser);

    // Filter permissions based on the selected user's ID
    const filteredPermissions = permissions.filter(permission => 
      permission.members?.some(member => member.id === userId)
    );
    console.log("Filtered Permissions:", filteredPermissions);

    // Set permissions data and open the modal
    setSingleUser(selectedUser);
    setPermissionsData(filteredPermissions);
    setSetpermissionsModal(true);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers().then(() => setRefreshing(false));
    fetchPermissions();
  }, []);

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
          
        </View>
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput,  { color: themeColors.text }]}
              onChangeText={handleSearch}
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
    <TouchableOpacity key={user.id} style={styles.members} onPress={() => handleSelectedUser(user.id)}>
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
      <MaterialCommunityIcons name="chevron-right" size={24} style={{ color: themeColors.text }} />
    </TouchableOpacity>

    
  ))}
</ScrollView>

        </>
      </View>
      <SetPermissions
        visible={setPermissionsModal}
        onClose={closeSetpermissionsModal}
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
    marginBottom: 10,
  },
  titleContainer: {
    width:'80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '5%'
  },
  backButton: {
    marginRight: 10,
    padding: 10,
  },
  createButton: {
    alignItems: 'flex-end',
    flex: 1,
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
