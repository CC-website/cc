// Members.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import SetPermissions from './setPermissions';

export default function Members({ visible, onClose, onCreateChannel, setOverview }) {
  const [selectedTab, setSelectedTab] = useState('members');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [setPermissionsModal, setSetpermissionsModal] = useState(false);
  const [permissionsData, setPermissionsData] = useState([]);
  const [permissions, setPermissions] = useState([])
  const [singleUser, setSingleUser] = useState([])
  const [ownerData, setOwnerData] = useState(null);

  // Function to fetch owner data
  const fetchOwnerData = async () => {
    try {
      const response = await axios.get(`${main_url}/api/channels/owner/${setOverview.id}`);
      console.log(response.data)
      setOwnerData(response.data); // Assuming the response contains owner data
    } catch (error) {
      console.log("Error fetching owner data:", error);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  useEffect(() => {
    fetchPermissions();
    fetchUsers();
  }, [selectedTab]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${main_url}/api/channels/${setOverview.id}/members/`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      let userIds = [];
      users.forEach(element => {
        userIds.push(element.id);
      });
  
      const response = await axios.get(`${main_url}/api/permissions/list/`, {
        params: { user_ids: userIds, target_id: setOverview.id }
      });
  
      // Filter out duplicate permissions based on their IDs
      const uniquePermissions = Array.from(new Set(response.data.map(permission => permission.id)))
        .map(id => response.data.find(permission => permission.id === id));
  
      setPermissions(uniquePermissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };
  
  


  const closeSetpermissionsModal = () =>{
    setSetpermissionsModal(false)
  }
   


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
        permission.members.some(member => member.id === userId)
    );
    console.log("Filtered Permissions:", filteredPermissions);

    // Set permissions data and open the modal
    setSingleUser(selectedUser)
    setPermissionsData(filteredPermissions);
    setSetpermissionsModal(true);
};





  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Create New Group</Text>
          <TouchableOpacity style={styles.createButton}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
          <>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                onChangeText={handleSearch}
                value={searchTerm}
                placeholder="Search by username"
                placeholderTextColor="#ccc"
              />
            </View>
            <View>
              {ownerData && (
                <View style={styles.userInfoContainer}>
                  <View style={styles.userpiccontainer}>
                    <Icon name="user" size={24} color="#fff" />
                  </View>
                  <Text style={styles.username}>Owner: {ownerData.username}</Text>
                </View>
              )}
            </View>
            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              {filteredUsers.map((user) => (
                <View key={user.id} style={styles.members}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={ () => handleSelectedUser(user.id)}>
                        <View style={styles.userIcon}>
                            <Icon name="user" size={24} color="#fff" />
                        </View>
                        <Text style={styles.username}>{user.username}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => handleSelectedUser(user.id)}>
                      <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            ))}

            </ScrollView>
          </>
      </View>
      <SetPermissions
      visible={setPermissionsModal}
      onClose={closeSetpermissionsModal}
      permissionsData = {permissionsData}
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
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: '91%',
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
  backButton: {
    position: 'relative',
    top: 10,
    left: 0,
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white',
    marginTop: 20,
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    marginTop: 10,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedTab: {
    borderBottomColor: '#fff',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  members: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBlockColor: 'white',
    borderBottomWidth: .4 ,
    marginBottom: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    padding: 25,
    marginBottom: 10,
    width: '100%',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: "gray",
    borderRadius: 5,
    padding: 6,
  },
  searchInput: {
    color: '#fff',
    backgroundColor: '#333',
    height: 38,
    padding: 10,
    borderRadius: 20
  },
  userpiccontainer: {
    backgroundColor: '#36393f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10, 
    borderRadius: 50,
    height: 40,
    width: 40,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    marginBottom: 10,
  },
  userActions: {
    flexDirection: 'row',
  },
  memversAction: {
    width: '60%',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
},
userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
},

});
