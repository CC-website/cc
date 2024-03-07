import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import ImgToBase64 from 'react-native-image-base64';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { Ionicons } from '@expo/vector-icons';
import { main_url } from '../../../constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewChannelForm({ visible, onClose, onCreateChannel }) {
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
  

  const handleCreateChannel = async () => {
    if (channelName.trim() !== '' && channelDescription.trim() !== '') {
        try {
            console.log("Nigel: " + image);
            const imageBase64 = await encodeImageToBase64();
            const url = main_url+'/api/channels/create/';
            const token = await AsyncStorage.getItem('userToken');
            const jsonObject = JSON.parse(token);

            // Create FormData object to send data including image
            const formData = new FormData();
            formData.append('name', channelName);
            formData.append('description', channelDescription);
            formData.append('image', imageBase64);

            // Make a POST request with FormData and appropriate headers
            if (token) {
                const response = await axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + jsonObject.access
                    }
                });
                
                // Handle the response as needed
                console.log(response.data);
                alert('Channel created successfully!');
            } else {
                console.error('No token found');
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
        <View  style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Create New Channel</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateChannel}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Text style={styles.channelName}>Channel Name</Text>
          <View style={styles.channelContainer}>
            <TextInput
              style={[styles.input, {width: "60%"}]}
              placeholder="Channel Name"
              value={channelName}
              onChangeText={(text) => setChannelName(text)}
            />
            <View>
            <TouchableOpacity style={[styles.uploadButton, {height: 90, marginTop: -10}]} onPress={selectImage}>
              <Text style={styles.buttonText}>Upload Logo</Text>
              <Icon name="users" size={30} color="#fff" style={{ marginTop: 10 }} />
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.logoPreview} />}
          </View>
          </View>
          <TextInput
            style={[styles.input , {height: 80}]}
            placeholder="Channel Description"
            value={channelDescription}
            onChangeText={(text) => setChannelDescription(text)}
            multiline
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
  backButton: {
    position: 'relative',
    top: 10,
    left: 0,
    padding: 10,
  },
  channelContainer: {
    padding: 10,
    paddingBottom: -10,
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  modalContent: {
    backgroundColor: '#202020',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: '91%',
  },
  channelName:{
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
    width: "100%",
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
