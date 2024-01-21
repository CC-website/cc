import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function EditGroup({ visible, onClose, setOverview }) {
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [image, setImage] = useState(null);

  const selectImage = async () => {
    // Request permissions if not granted
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to select images.');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const encodeImageToBase64 = async () => {
    try {
      if (!image) return ''; // Return an empty string if no image is selected

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

  const handleUpdateChannel = async () => {
    try {
      // Create a data object with only the fields that have changed
      const data = {};
      if (channelName.trim() !== '') data.name = channelName;
      if (channelDescription.trim() !== '') data.description = channelDescription;

      // Check if the image has changed
      if (image !== null) {
        const imageBase64 = await encodeImageToBase64();
        data.image = imageBase64;
      }

      if (Object.keys(data).length === 0) {
        // No changes, inform the user or handle as needed
        Alert.alert('No Changes', 'No changes to update.');
        return;
      }

      const url = `http://192.168.145.37:8000/api/channels/${setOverview.id}/`;

      // Make a PUT request with data in the request body
      const response = await axios.put(url, data);

      // Handle the response as needed
      console.log(response.data);
      Alert.alert('Group Updated', 'Group updated successfully!');
    } catch (error) {
      // Handle error
      console.error('Error updating channel:', error);
      Alert.alert('Error Updating Group', 'Error updating channel. Please try again.');
    }

    // Reset form fields and close the modal
    setChannelName('');
    setChannelDescription('');
    setImage(null);
    onClose();
  };

  const handleDeleteChannel = () => {
    // Display a confirmation pop-up
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this channel?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const url = `http://192.168.145.37:8000/api/channels/${setOverview.id}/`;

              // Make a DELETE request
              const response = await axios.delete(url);

              // Handle the response as needed
              console.log(response.data);
              Alert.alert('Group Deleted', 'Group deleted successfully!');
            } catch (error) {
              // Handle error
              console.error('Error deleting channel:', error);
              Alert.alert('Error Deleting Group', 'Error deleting channel. Please try again.');
            }

            // Close the modal after deletion
            onClose();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Update Group</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleUpdateChannel}>
            <Text style={{ color: 'white' }}>Save</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Text style={styles.channelName}>Group Name</Text>
          <View style={styles.channelContainer}>
            <TextInput
              style={[styles.input, { width: '60%' }]}
              placeholder={setOverview.name}
              value={channelName ? channelName : setOverview.name}
              onChangeText={(text) => setChannelName(text)}
            />
          </View>
          <Text style={styles.channelName}>Group Description</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder={setOverview.description}
            value={channelDescription ? channelDescription : setOverview.description}
            onChangeText={(text) => setChannelDescription(text)}
            multiline
          />

          <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <MaterialIcons name="touch-app" size={20} color="white" />
              <Text style={styles.buttonText}>Update Logo</Text>
            </View>
            <TouchableOpacity style={styles.logo}>
              <Image
                source={{
                  uri: setOverview?.image_url
                    ? setOverview.image_url
                    : 'http://192.168.145.37:8000/group_logos/group.png',
                }}
                style={styles.logo}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          {image && <Image source={{ uri: image }} style={styles.logoPreview} />}

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteChannel}>
            <Text style={styles.buttonText}>Delete Group</Text>
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
  channelContainer: {
    padding: 10,
    paddingBottom: -10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  modalContent: {
    backgroundColor: '#202020',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: '91%',
  },
  channelName: {
    color: 'silver',
    fontSize: 20,
    marginBottom: 30,
    marginTop: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white',
    marginTop: 20,
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
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    color: 'white',
    marginBottom: 10,
    paddingLeft: 10,
  },
  uploadButton: {
    backgroundColor: '#36393f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
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
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logo: {
    backgroundColor: '#36393f',
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
});
