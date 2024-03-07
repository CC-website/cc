import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import SetPermissions from '../members/setPermissions';

export default function BanedMembers({ visible, onClose, onCreateChannel, setOverview }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [setPermissionsModal, setSetpermissionsModal] = useState(false);
  const [toggledMembers, setToggledMembers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${main_url}/api/channels/baned-members/${setOverview.id}`);
      console.log("baned members", response.data.blocked_members);
      const initialToggledMembers = response.data.blocked_members.map(user => user.id);
      setToggledMembers(initialToggledMembers);
      setUsers(response.data.blocked_members);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const toggleMember = (userId) => {
    if (toggledMembers.includes(userId)) {
      setToggledMembers(prevMembers => prevMembers.filter(memberId => memberId !== userId));
    } else {
      setToggledMembers(prevMembers => [...prevMembers, userId]);
    }
  };

  const onSave = async () => {
    // Get user IDs of members with toggles set to false
    const membersWithTogglesFalse = users
      .filter(user => !toggledMembers.includes(user.id))
      .map(user => user.id);
    console.log("User IDs with toggles set to false:", membersWithTogglesFalse);


   const formData = {
        'channel_id': setOverview.id,
        'user_id': membersWithTogglesFalse,
        'action': 'restore',
    };
    // Handle 'transfer' action
  
  const url = `${main_url}/api/permissions/perform-action-on-members/`;
      console.log('Permissions to remove:', url);
      const response = await axios.post(url, formData);
      
      console.log('Permissions to remove:', response.data);

      onClose();
    // Perform any action with the user IDs
  };
  
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Create New Group</Text>
          <TouchableOpacity style={styles.createButton} onPress={onSave}>
            <Text style={{color:'white'}}>Save</Text>
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
          
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {filteredUsers.map((user) => (
              <View key={user.id} style={styles.members}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} >
                    <View style={styles.userIcon}>
                        <Icon name="user" size={24} color="#fff" />
                    </View>
                    <Text style={styles.username}>{user.username}</Text>
                </TouchableOpacity>
                <View style={styles.toggleContainer}>
                  <Switch
                    value={toggledMembers.includes(user.id)}
                    onValueChange={() => toggleMember(user.id)}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </>
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
  toggleContainer: {
    flex: 1,
    alignItems: 'flex-end',
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
