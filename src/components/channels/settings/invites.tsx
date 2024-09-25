import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Alert, useColorScheme } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { main_url } from '../../../constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { community } from '../../../constants/StaticData/en.json';
import { ThemeColors } from '../../../constants/thems';

export default function Invites({ visible, onClose, setOverview }) {
  const [inviteLink, setInviteLink] = useState('');
  const [newInviteLink, setNewInviteLink] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const scheme = useColorScheme();
  const themeColors = ThemeColors[scheme];

  useEffect(() => {
    if (visible) {
      fetchInviteLink();
    }
  }, [visible]);

  const fetchInviteLink = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);

      if (token) {
        const response = await axios.get(
          `${main_url}/api/channels/${setOverview.id}/invite-link/`,
          {
            headers: {
              'Authorization': 'Bearer ' + jsonObject.access,
            },
          }
        );
        if (response.data.token) {
          const fullInviteUrl = `${main_url}/invite/${response.data.token}`;
          setInviteLink(fullInviteUrl);
        } else {
          setInviteLink('');
        }
      } else {
        console.error('No token found');
      }
    } catch (error) {
      console.error('Error fetching invite link:', error);
    }
  };

  const createInviteLink = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);

      if (token) {
        const response = await axios.post(
          `${main_url}/api/channels/${setOverview.id}/invite-link/`,
          {},
          {
            headers: {
              'Authorization': 'Bearer ' + jsonObject.access,
            },
          }
        );
        const fullInviteUrl = `${main_url}/invite/${response.data.token}`;
        setInviteLink(fullInviteUrl);
        Alert.alert('Success', 'Invite link created successfully');
      } else {
        console.error('No token found');
      }
    } catch (error) {
      console.error('Error creating invite link:', error);
      Alert.alert('Error', 'Failed to create invite link');
    }
  };

  const updateInviteLink = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);

      if (token) {
        const response = await axios.put(
          `${main_url}/api/channels/${setOverview.id}/invite-link/`,
          { invite_link: newInviteLink },
          {
            headers: {
              'Authorization': 'Bearer ' + jsonObject.access,
            },
          }
        );
        const fullInviteUrl = `${main_url}/invite/${response.data.token}`;
        setInviteLink(fullInviteUrl);
        Alert.alert('Success', 'Invite link updated successfully');
      } else {
        console.error('No token found');
      }
    } catch (error) {
      console.error('Error updating invite link:', error);
      Alert.alert('Error', 'Failed to update invite link');
    }
  };

  const handleSave = async () => {
    if (!inviteLink) {
      await createInviteLink();
    } else {
      await updateInviteLink();
    }
    onClose();
  };

  const copyToClipboard = async () => {
    if (inviteLink) {
      await Clipboard.setString(inviteLink);
      Alert.alert('Copied', 'Invite link copied to clipboard');
    } else {
      Alert.alert('Error', 'No invite link available to copy');
    }
  };

  return (
    <Modal style={{ backgroundColor: themeColors.background }} transparent visible={visible} animationType="slide">
      <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} style={{ color: themeColors.text }} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: themeColors.text }]}>{community.settings.members.invite_title}</Text>
        </View>
        <ScrollView
          style={[styles.modalContent, { backgroundColor: themeColors.background }]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Text style={[styles.inviteLinkText, { color: themeColors.text }]}>{community.settings.members.invite_link}:</Text>
          <View style={styles.inviteLinkContainer}>
            <Text style={[styles.inviteLink, { color: themeColors.text }]}>{inviteLink || 'No invite link set'}</Text>
            {inviteLink ? (
              <TouchableOpacity onPress={copyToClipboard}>
                <Icon name="copy" size={20} style={{ color: themeColors.text }} />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: themeColors.button }]}
            onPress={createInviteLink}
          >
            <Text style={{ color: themeColors.text }}>{community.settings.members.generate_invite_link}</Text>
          </TouchableOpacity>
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
  backButton: {
    position: 'relative',
    top: 10,
    left: 0,
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#202020',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: '91%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white',
    marginTop: 20,
    marginLeft: 20,
  },
  backButtonContainer: {
    padding: 10,
    paddingBottom: -10,
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 0.3,
    borderBlockColor: ThemeColors.text,
  },
  createButton: {
    backgroundColor: '#36393f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: 160,
    height: 50,
    marginRight: 10,
    marginTop: 8,
    justifyContent: 'center',
  },
  inviteLinkText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  inviteLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inviteLink: {
    color: 'lightgray',
    fontSize: 14,
    flex: 1,
  },
});
