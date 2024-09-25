import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { Ionicons } from '@expo/vector-icons';
import { main_url } from '../../../constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewGroupForm({
  visible,
  onClose,
  onCreateChannel,
  selectedChannel,
}) {
  const [channelName, setChannelName] = useState('');
  const [channelLogo, setChannelLogo] = useState(null);
  const [channelDescription, setChannelDescription] = useState('');
  const [image, setImage] = useState(null);
  const [selectedSubChannel, setSelectedSubChannel] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const encodeImageToBase64 = async () => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      return base64String;
    } catch (error) {
      console.error('Error encoding image to base64:', error);
      throw error;
    }
  };

  const handleCreateChannel = async () => {
    if (channelName.trim() !== '' && channelDescription.trim() !== '') {
      try {
        const imageBase64 = await encodeImageToBase64();
        const url = `${main_url}/api/groups/`;
        const token = await AsyncStorage.getItem('userToken');
        const jsonObject = JSON.parse(token);

        const formData = new FormData();
        formData.append('subchannel', selectedSubChannel?.id || '');
        formData.append('name', channelName);
        formData.append('description', channelDescription);
        formData.append('image', imageBase64);

        if (token) {
          const response = await axios.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${jsonObject.access}`,
            },
          });

          console.log(response.data);
          alert('Group created successfully!');
        } else {
          console.error('No token found');
        }
      } catch (error) {
        console.error(error);
        alert('Error creating channel. Please try again.');
      }

      setChannelName('');
      setChannelLogo(null);
      setChannelDescription('');
      setImage(null);
      onClose();
    }
  };

  const SubchannelSelectionModal = ({ visible, onClose, subchannels, onSelectSubchannel }) => {
    return (
      <Modal transparent visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.backButtonContainer1}>
            <TouchableOpacity style={[styles.backButton1, { marginTop: 15 }]} onPress={onClose}>
              <Icon name="arrow-left" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <Text style={styles.modalTitle}>Select Subchannel</Text>
            {subchannels.map((subchannel) => (
              <TouchableOpacity
                key={subchannel.id}
                style={styles.subchannelItem}
                onPress={() => onSelectSubchannel(subchannel)}
              >
                <Text style={styles.subchannelText}>{subchannel.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const [subchannelModalVisible, setSubchannelModalVisible] = useState(false);

  const openSubchannelModal = () => {
    setSubchannelModalVisible(true);
  };

  const closeSubchannelModal = () => {
    setSubchannelModalVisible(false);
  };

  const handleSelectSubchannel = (subchannel) => {
    setSelectedSubChannel(subchannel);
    closeSubchannelModal();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Add your refresh logic here, such as re-fetching data or resetting form fields
    setTimeout(() => setRefreshing(false), 2000); // Simulating a refresh action
  }, []);

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Create New Group</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateChannel}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.channelName}> Select Sub Channel Name</Text>

          <View style={styles.channelContainer}>
            <View style={{ width: '72%' }}>
              <TouchableOpacity style={[styles.input, { width: '90%' }]} onPress={openSubchannelModal}>
                <Text>{selectedSubChannel ? selectedSubChannel.name : 'Select Subchannel'}</Text>
              </TouchableOpacity>

              <Text style={styles.channelName}> Group Name</Text>
              <TextInput
                style={[styles.input, { width: '90%' }]}
                placeholder="Group Name"
                value={channelName}
                onChangeText={(text) => setChannelName(text)}
              />
            </View>

            <View>
              <TouchableOpacity style={[styles.uploadButton, { height: 90 }]} onPress={selectImage}>
                <Text style={styles.buttonText}>Upload Logo</Text>
                <Icon name="users" size={30} color="#fff" style={{ marginTop: 10 }} />
              </TouchableOpacity>
              {image && <Image source={{ uri: image }} style={styles.logoPreview} />}
            </View>
          </View>

          <Text style={styles.channelName}> Group Description</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Group Description"
            value={channelDescription}
            onChangeText={(text) => setChannelDescription(text)}
            multiline
          />

          <SubchannelSelectionModal
            visible={subchannelModalVisible}
            onClose={closeSubchannelModal}
            subchannels={selectedChannel?.subchannels || []}
            onSelectSubchannel={handleSelectSubchannel}
          />
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
  modalContent: {
    backgroundColor: '#202020',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: '91%',
  },
  channelContainer: {
    padding: 10,
    paddingBottom: -10,
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white',
    marginTop: 20,
  },
  channelName:{
    color: 'silver',
    fontSize: 20,
    marginBottom: 30,
    marginTop: 20,
  },
  logo: {
    backgroundColor: '#36393f',
    width: 90,
    height: 90,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -20,
  },
  input: {
    height: 50,
    justifyContent: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  backButtonContainer: {
    padding: 10,
    paddingBottom: -10,
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: '#fff',
  },
  backButtonContainer1: {
    padding: 10,
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'relative',
    top: 10,
    left: 0,
    padding: 10,
  },
  backButton1: {
    position: 'relative',
    left: 0,
    paddingLeft: 10,
  },
  uploadButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoPreview: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    borderRadius: 5,
    marginBottom: 10,
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
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subchannelItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  subchannelText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
  },
});

