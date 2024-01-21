import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import ImgToBase64 from 'react-native-image-base64';

export default function NewSubChannelForm({ visible, onClose, onCreateChannel, selectedChannel }) {
  const [channelName, setChannelName] = useState('');
  const [channelLogo, setChannelLogo] = useState(null);
  const [channelDescription, setChannelDescription] = useState('');
  const [image, setImage] = useState(null);

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
        console.log("Nigel: " + image);
        const imageBase64 = image ? await encodeImageToBase64() : '';
        const url = 'http://192.168.145.37:8000/api/subchannels/';

        // Check if the imageBase64 string is in the expected format
        if (imageBase64.includes(';base64,')) {
            // Make a POST request with data in the request body
            console.log(selectedChannel);
            const response = await axios.post(url, {
                channel: selectedChannel.id, // Use main channel ID instead of name
                name: channelName,
                description: channelDescription,
                image: imageBase64,
            });
          
            // Handle the response as needed
            console.log(response.data);
            alert('Channel created successfully!');
          } else {
          // Handle the case where the imageBase64 string is not in the expected format
          console.error('Invalid imageBase64 format');
          alert('Error creating channel. Please try again.');
        }
      } catch (error) {
        // Handle error
        console.error(error);
        alert('Error creating channel. Please try again.');
      }

      // Reset form fields and close the modal
      setChannelName('');
      setChannelLogo(null);
      setChannelDescription('');
      setImage(null);
      onClose();
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New Sub Channel</Text>
          
          {/* Display selectedChannel in a non-editable TextInput */}
            <TextInput
                style={[styles.input, { backgroundColor: '#eee', color: '#555', fontWeight: 'bold' }]}
                placeholder="Main Channel"
                value={selectedChannel ? selectedChannel.name : ''}
                editable={false}
            />
          
          {/* Channel Name */}
          <TextInput
            style={styles.input}
            placeholder="Subchannel Name"
            value={channelName}
            onChangeText={(text) => setChannelName(text)}
          />
          
          {/* Upload Logo Button */}
          <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
            <Text style={styles.buttonText}>Upload Logo</Text>
          </TouchableOpacity>
          
          {/* Display selected image preview */}
          {image && <Image source={{ uri: image }} style={styles.logoPreview} />}
          
          {/* Channel Description */}
          <TextInput
            style={styles.input}
            placeholder="Subchannel Description"
            value={channelDescription}
            onChangeText={(text) => setChannelDescription(text)}
            multiline
          />
          
          {/* Create Button */}
          <TouchableOpacity style={styles.createButton} onPress={handleCreateChannel}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
          
          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  uploadButton: {
    backgroundColor: '#3498db',
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
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
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
});
