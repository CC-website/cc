import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Switch, Alert, useColorScheme, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { main_url } from '../../../constants/Urls';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeColors } from '../../../constants/thems';

export default function SetPermissions({ visible, onClose, permissionsData, setOverview, singleUser }) {
  const [action, setAction] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const scheme = useColorScheme();
  const themeColors = ThemeColors[scheme];
  

  useEffect(() => {
    // Initialize removePermissions state with all permissions set to true
    const initialPermissions = {};
    permissionsData.forEach(permission => {
      initialPermissions[permission.id] = true;
    });
  }, [permissionsData]);

  


  const handleConfirmation = async () => {
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);
  
      if (!token) {
        console.log('No token found');
        return;
      }
  
      // Logic to handle the action confirmation
      setShowConfirmation(false);
      setAction(null);
  
      // Perform the action based on the value of 'action' state
      let formData = {};
      if (action === 'band') {
        formData = {
          'channel_id': setOverview.id,
          'user_id': singleUser.id,
          'action': 'band',
        };
        // Handle 'band' action
      } else if (action === 'kick') {
        formData = {
          'channel_id': setOverview.id,
          'user_id': singleUser.id,
          'action': 'kick',
        };
        // Handle 'kick' action
      } else if (action === 'transfer') {
        formData = {
          'channel_id': setOverview.id,
          'user_id': singleUser.id,
          'action': 'transfer',
        };
        // Handle 'transfer' action
      } else if (action === 'restore') {
        formData = {
          'channel_id': setOverview.id,
          'user_id': singleUser.id,
          'action': 'restore',
        };
        // Handle 'restore' action
      }
  
      const url = `${main_url}/api/permissions/perform-action-on-members/`;
      console.log('Perform action on members:', url);
  
      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': 'Bearer ' + jsonObject.access,
        },
      });
  
      console.log('Action performed:', response.data);
  
      onClose();
    } catch (error) {
      console.log('Error performing action:', error);
    }
  };
  
  
  return (
    <Modal style={{ backgroundColor: themeColors.background }} transparent visible={visible} animationType="slide">
      <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} style={{ color: themeColors.text }} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Set Permission</Text>
          </View>
          
        </View>
        <ScrollView
          style={[styles.modalContent, { backgroundColor: themeColors.background }]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.userInfoContainer}>
            <View style={styles.userpiccontainer}>
            <Image
                    style={styles.memberImage}
                    source={{ uri: `${main_url}/${singleUser.profile_picture}` }}
                  />
            </View>
            <Text style={[styles.username, { color: themeColors.text }]}>{singleUser.username}</Text>
          </View>
          <View style={styles.actionStyles}>
            <TouchableOpacity
              style={styles.userInfoContainer}
              onPress={() => {
                setAction('band');
                setShowConfirmation(true);
              }}
            >
              <View style={styles.userpiccontainer}>
                <MaterialCommunityIcons name="account-lock" size={20} style={{ color: themeColors.text }} />
              </View>
              <Text style={[styles.username, { color: themeColors.text }]}>Ban {singleUser.username}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.userInfoContainer}
              onPress={() => {
                setAction('kick');
                setShowConfirmation(true);
              }}
            >
              <View style={styles.userpiccontainer}>
                <MaterialCommunityIcons name="account-remove" size={20} style={{ color: themeColors.text }} />
              </View>
              <Text style={[styles.username, { color: themeColors.text }]}>Kick {singleUser.username}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.userInfoContainer}
              onPress={() => {
                setAction('transfer');
                setShowConfirmation(true);
              }}
            >
              <View style={styles.userpiccontainer}>
                <MaterialCommunityIcons name="handshake" size={20} style={{ color: themeColors.text }} />
              </View>
              <Text style={[styles.username, { color: themeColors.text }]}>Transfer ownership to {singleUser.username}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {showConfirmation && (
          <View style={[styles.confirmationContainer, { backgroundColor: themeColors.background }]}>
            <Text style={[styles.confirmationText, { color: themeColors.text }]}>
              Are you sure you want to {action} {singleUser.username}?
            </Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmation}
              >
                <Text style={[styles.confirmButtonText, { color: themeColors.text }]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowConfirmation(false);
                  setAction(null);
                }}
              >
                <Text style={[styles.cancelButtonText, { color: themeColors.text }]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  backButton: {
    position: 'relative',
    top: 10,
    left: 0,
    padding: 10,
  },
  backButtonContainer: {
    padding: 10,
    paddingBottom: -10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: ThemeColors.text,
  },
  titleContainer: {
    width:'80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '5%'
  },
  createButton: {
    backgroundColor: '#36393f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: "gray",
    borderRadius: 5,
    padding: 6,
  },
  userIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  permissionType: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userpiccontainer: {
    backgroundColor: '#36393f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10, 
    borderRadius: 50,
    height: 40,
    width: 40,
    marginRight: 15,
  },
  permissionContainer: {
    borderBottomWidth: 0.4,
    borderBottomColor: 'white',
    backgroundColor: '#36393f',
    padding: 8,
  },
  firstItem: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 0.4,
    borderBottomColor: 'white',
    backgroundColor: '#36393f',
  },
  lastItem: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#36393f',
  },
  actionStyles: {
    marginTop: 30,
  },
  confirmationContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: 'center',
    elevation: 5,
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  memberImage: {
    width: 40,  // set appropriate width
    height: 40, // set appropriate height
    resizeMode: 'cover',
    borderRadius: 25, // appropriate radius for a circle
  }
});
