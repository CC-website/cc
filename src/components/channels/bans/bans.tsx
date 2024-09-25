import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Switch, useColorScheme, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { main_url } from '../../../constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { community } from '../../../constants/StaticData/en.json';
import { ThemeColors } from '../../../constants/thems';
import axios from 'axios';

export default function BannedMembers({ visible, onClose, onCreateChannel, setOverview }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [toggledMembers, setToggledMembers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const scheme = useColorScheme();
  const themeColors = ThemeColors[scheme];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);

      if (token) {
        const response = await axios.get(
          `${main_url}/api/channels/banned-members/${setOverview.id}/`,
          {
            headers: {
              Authorization: 'Bearer ' + jsonObject.access,
            },
          }
        );

        const initialToggledMembers = response.data.blocked_members.map((user) => user.id);
        setToggledMembers(initialToggledMembers);
        setUsers(response.data.blocked_members);

        // Save fetched data locally
        await AsyncStorage.setItem('bannedMembersData', JSON.stringify(response.data.blocked_members));
        setErrorMessage(''); // Clear any previous error messages
      } else {
        setErrorMessage('No token found');
        console.error('No token found');
      }
    } catch (error) {
      console.log('Error fetching users:', error);
      if (error.response && error.response.status === 403) {
        setErrorMessage('You do not have permission to perform this action.');
      } else {
        setErrorMessage('Failed to fetch banned members. Please try again.');
      }

      // Load data from local storage if fetching fails
      const localData = await AsyncStorage.getItem('bannedMembersData');
      if (localData) {
        setUsers(JSON.parse(localData));
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers().then(() => setRefreshing(false));
  }, []);

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const toggleMember = (userId) => {
    if (toggledMembers.includes(userId)) {
      setToggledMembers((prevMembers) => prevMembers.filter((memberId) => memberId !== userId));
    } else {
      setToggledMembers((prevMembers) => [...prevMembers, userId]);
    }
  };

  const onSave = async () => {
    try {
      const membersWithTogglesFalse = users
        .filter((user) => !toggledMembers.includes(user.id))
        .map((user) => user.id);

      const formData = {
        channel_id: setOverview.id,
        user_id: membersWithTogglesFalse,
        action: 'restore',
      };

      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);

      if (token) {
        const url = `${main_url}/api/permissions/perform-action-on-members/`;

        const response = await axios.post(url, formData, {
          headers: {
            Authorization: 'Bearer ' + jsonObject.access,
          },
        });

        console.log('Permissions response:', response.data);
        onClose();
        setErrorMessage(''); // Clear any error message after successful save
      } else {
        setErrorMessage('No token found');
        console.error('No token found');
      }
    } catch (error) {
      console.error('Error performing action:', error);
      if (error.response && error.response.status === 403) {
        setErrorMessage('You do not have permission to perform this action.');
      } else {
        setErrorMessage('Failed to save changes. Please try again.');
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal style={{ backgroundColor: themeColors.background }} transparent visible={visible} animationType="slide">
      <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} style={{ color: themeColors.text }} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: themeColors.text }]}>
            {community.settings.members.band}
          </Text>
          <TouchableOpacity style={styles.createButton} onPress={onSave}>
            <Text style={{ color: themeColors.text }}>{community.settings.members.save}</Text>
          </TouchableOpacity>
        </View>

        {/* Error message display */}
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            onChangeText={handleSearch}
            value={searchTerm}
            placeholder={community.settings.members.search}
            placeholderTextColor="#ccc"
          />
        </View>

        <ScrollView
          style={[styles.modalContent, { backgroundColor: themeColors.background }]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {filteredUsers.map((user) => (
            <View key={user.id} style={styles.members}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.userIcon}>
                  <Icon name="user" size={24} style={{ color: themeColors.text }} />
                </View>
                <Text style={[styles.username, { color: themeColors.text }]}>{user.username}</Text>
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
  members: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.4,
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
  searchInput: {
    color: '#fff',
    backgroundColor: '#333',
    height: 38,
    padding: 10,
    borderRadius: 20,
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
