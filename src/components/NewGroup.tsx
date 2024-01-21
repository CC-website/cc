import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { Ionicons } from '@expo/vector-icons';

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

  const selectImage = async () => {
    // Request permissions if not granted
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
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
      console.log(image);
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
        let imageBase64 = '';

        if (image) {
          imageBase64 = await encodeImageToBase64();

          // Check if the imageBase64 string is in the expected format
          if (!imageBase64.includes(';base64,')) {
            // Handle the case where the imageBase64 string is not in the expected format
            console.error('Invalid imageBase64 format');
            alert('Error creating group. Please try again.');
            return;
          }
        }

        const url = 'http://192.168.145.37:8000/api/groups/';

        // Make a POST request with data in the request body
        const response = await axios.post(url, {
          subchannel: selectedSubChannel?.id || '',
          name: channelName,
          description: channelDescription,
          image: imageBase64,
        });

        // Handle the response as needed
        console.log(response.data);
        alert('Group created successfully!');
      } catch (error) {
        // Handle error
        console.error(error);
        alert('Error creating group. Please try again.');
      }

      // Reset form fields and close the modal
      setChannelName('');
      setChannelLogo(null);
      setChannelDescription('');
      setImage(null);
      setSelectedSubChannel(null);
      onClose();
    }
  };

  // Subchannel Selection Modal
  const SubchannelSelectionModal = ({ visible, onClose, subchannels, onSelectSubchannel }) => {
    return (
      <Modal transparent visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
        <View  style={styles.backButtonContainer1}>
            <TouchableOpacity style={[styles.backButton1, {marginTop: 15}]} onPress={onClose}>
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

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
          <View  style={styles.backButtonContainer}>
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
          >
          <Text style={styles.channelName}> Select Sub Channel Name</Text>

          {/* Subchannel Selection Button */}
          <View style={styles.channelContainer}>
            <View style= {{width: '72%'}}>
              <TouchableOpacity style={[styles.input, {width: '90%'}]} onPress={openSubchannelModal}>
                <Text>{selectedSubChannel ? selectedSubChannel.name : 'Select Subchannel'}</Text>
              </TouchableOpacity>

              {/* Channel Name */}
              <Text style={styles.channelName}> Group Name</Text>
              <TextInput
                style={[styles.input, {width: '90%'}]}
                placeholder="Group Name"
                value={channelName}
                onChangeText={(text) => setChannelName(text)}
              />
            </View>
            
            <View>
            <TouchableOpacity style={[styles.uploadButton, {height: 90}]} onPress={selectImage}>
              <Text style={styles.buttonText}>Upload Logo</Text>
              <Icon name="users" size={30} color="#fff" style={{ marginTop: 10 }} />
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.logoPreview} />}
          </View>
          </View>
          
          

          {/* Channel Description */}
          <Text style={styles.channelName}> Goup Description</Text>
          <TextInput
            style={[styles.input, {height:80}]}
            placeholder="Group Description"
            value={channelDescription}
            onChangeText={(text) => setChannelDescription(text)}
            multiline
          />

          {/* Subchannel Selection Modal */}
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
