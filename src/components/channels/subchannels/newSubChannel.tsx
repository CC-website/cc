import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView, Image } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { Ionicons } from '@expo/vector-icons';
import { main_url } from '../../../constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewSubChannelForm({ visible, onClose, onCreateChannel, selectedChannel }) {
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');



  const handleCreateChannel = async () => {
    if (channelName.trim() !== '' && channelDescription.trim() !== '') {
        try {
            const url = ''+main_url+'/api/subchannels/';
            // const url = main_url+'/api/channels/create/';
            const token = await AsyncStorage.getItem('userToken');
            const jsonObject = JSON.parse(token);

            // Create FormData object to send data including image
            const formData = new FormData();
            formData.append('name', channelName);
            formData.append('description', channelDescription);
            formData.append('channel_id', selectedChannel.id);
            formData.append('channel_name', selectedChannel.name);

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
                alert('Sub Channel created successfully!');
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
        // setChannelLogo(null);
        setChannelDescription('');
        // setImage(null);
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
          <Text style={styles.modalTitle}>Create New Sub Channel</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateChannel}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          

          {/* Display selectedChannel in a non-editable TextInput */}
          <Text style={styles.channelName}>Channel Name</Text>
          <View style={styles.channelContainer}>
            <TextInput
              style={[styles.input, { borderColor:'transparent',color: '#fff', fontWeight: 'bold',fontSize: 20, height: 22,}]}
              placeholder="Main Channel"
              value={selectedChannel ? selectedChannel.name : ''}
              editable={false}
            />

            <TouchableOpacity style={styles.logo}>
              <Image
                source={{
                  uri: selectedChannel?.image_url
                    ? selectedChannel.image_url
                    : ""+main_url+"/channel_logos/channel1.png",
                }}
                style={styles.logo}
              />
            </TouchableOpacity>
          </View>
          


          {/* Channel Name */}
          <Text style={styles.channelName}>Sub Channel Name</Text>
          <TextInput
            style={[styles.input, {height: 60, color: 'white'}]}
            placeholder="Subchannel Name"
            value={channelName}
            onChangeText={(text) => setChannelName(text)}
          />

          {/* Channel Description */}
          <Text style={styles.channelName}>Sub Channel Description</Text>
          <TextInput
            style={[styles.input, {height: 90, color: 'white'}]}
            placeholder="Subchannel Description"
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
  },
  logo: {
    backgroundColor: '#36393f',
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },
  backButton: {
    position: 'relative',
    top: 10,
    left: 0,
    padding: 10,
  },
  channelName:{
    color: 'silver',
    fontSize: 20,
    marginBottom: 30,
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
  channelContainer: {
    padding: 10,
    paddingBottom: -10,
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
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
function encodeImageToBase64() {
  throw new Error('Function not implemented.');
}

