import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image, ScrollView, SafeAreaView, useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { Ionicons } from '@expo/vector-icons';
import { main_url } from '../../../constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { community } from '../../../constants/StaticData/en.json';

export default function NewChannelForm({ visible, onClose, onCreateChannel }) {
  const [channelName, setChannelName] = useState('');
  const [channelLogo, setChannelLogo] = useState(null);
  const [channelDescription, setChannelDescription] = useState('');
  const [image, setImage] = useState(null);
  const scheme = useColorScheme();

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
        const imageBase64 = await encodeImageToBase64();
        const url = `${main_url}/api/channels/create/`;
        const token = await AsyncStorage.getItem('userToken');
        const jsonObject = JSON.parse(token);

        const formData = new FormData();
        formData.append('name', channelName);
        formData.append('description', channelDescription);
        formData.append('image', imageBase64);

        if (token) {
          const response = await axios.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${jsonObject.access}`
            }
          });
          
          console.log(response.data);
          alert('Community created successfully!');
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

  const colors = {
    light: {
      background: '#f4f4f4',
      card: '#f4f4f4',
      text: '#000000',
      button: '#007bff',
      buttonText: '#ffffff',
      inputBackground: '#ffffff',
      inputText: '#000000',
      inputBorder: '#cccccc',
    },
    dark: {
      background: '#1A1A24',
      card: '#1A1A24',
      text: '#ffffff',
      button: '#0d0a1e',
      buttonText: '#ffffff',
      inputBackground: '#ffff',
      inputText: 'gray',
      inputBorder: '#ffff',
    },
  };

  const themeColors = colors[scheme];

  return (
    <Modal  style={[{ backgroundColor: themeColors.background }]} transparent visible={visible} animationType="slide">
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
        <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
          <View style={[styles.header, { backgroundColor: themeColors.card }]}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Icon name="arrow-left" size={18} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>{community.create_community.title}</Text>
            <TouchableOpacity style={[styles.createButton, { backgroundColor: themeColors.button }]} onPress={handleCreateChannel}>
              <Ionicons name="add-circle-outline" size={24} color={themeColors.buttonText} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={[styles.modalContent, { backgroundColor: themeColors.card }]}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <Text style={[styles.channelName, { color: themeColors.text }]}>{community.create_community.name}</Text>
            <View style={styles.channelContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: themeColors.inputBackground, color: themeColors.inputText, borderColor: themeColors.inputBorder, width: "60%" }]}
                placeholder={community.create_community.name}
                value={channelName}
                onChangeText={(text) => setChannelName(text)}
              />
              <View>
                <TouchableOpacity style={[styles.uploadButton, { backgroundColor: themeColors.button, height: 90, marginTop: -10 }]} onPress={selectImage}>
                  <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>{community.create_community.log}</Text>
                  <Icon name="users" size={30} color={themeColors.buttonText} style={{ marginTop: 10 }} />
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.logoPreview} />}
              </View>
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: themeColors.inputBackground, color: themeColors.inputText, borderColor: themeColors.inputBorder, height: 80 }]}
              placeholder={community.create_community.description}
              value={channelDescription}
              onChangeText={(text) => setChannelDescription(text)}
              multiline
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  backButton: {
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 50,
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: '90%',
  },
  channelName: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  channelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  uploadButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  logoPreview: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});
