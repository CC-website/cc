import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { main_url } from '../../../constants/Urls';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

export default function SetPermissions({ visible, onClose, permissionsData, setOverview, singleUser }) {
  const [permissionType, setPermissionType] = useState('');
  const [targetId, setTargetId] = useState('');
  const [targetType, setTargetType] = useState('admin'); // Default to admin
  const [removePermissions, setRemovePermissions] = useState({});
  const [action, setAction] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  

  useEffect(() => {
    // Initialize removePermissions state with all permissions set to true
    const initialPermissions = {};
    permissionsData.forEach(permission => {
      initialPermissions[permission.id] = true;
    });
    setRemovePermissions(initialPermissions);
  }, [permissionsData]);

  const handleSetPermission = async () => {
    // Logic to send data for permissions whose toggle buttons are set to false
    const permissionsToRemove = [];
    Object.entries(removePermissions).forEach(([id, value]) => {
      if (!value) {
        permissionsToRemove.push(id);
      }
    });
    if (permissionsToRemove.length > 0) {
      
      try {
        const formData = {
            'permissions_to_remove': permissionsToRemove,
            'user_id':singleUser.id,
        };
        console.log(formData);
        
        const url = `${main_url}/api/permissions/remove-user-role/`;
        console.log('Permissions to remove:', url);
        const response = await axios.put(url, formData);
        
        console.log('Permissions to remove:', url);
        onClose();
    } catch (error) {
        console.log("An error occurred during update:", error);
    }
      
    } else {
      // Show alert if no permissions are set to false
      Alert.alert('No Change', 'No change has been made.');
    }
  };

  const handleRemovePermission = (permissionId) => {
    setRemovePermissions(prevState => ({
      ...prevState,
      [permissionId]: !prevState[permissionId] // Toggle the remove permission state
    }));
  };

  const handleConfirmation = async () => {
    // Logic to handle the action confirmation
    setShowConfirmation(false);
    setAction(null);
    // Perform the action based on the value of 'action' state
    let formData = {}
    if (action === 'band') {
      formData = {
        'channel_id': setOverview.id,
        'user_id':singleUser.id,
        'action': 'band',
    };
      // Handle 'band' action
    } else if (action === 'kick') {
      formData = {
        'channel_id': setOverview.id,
        'user_id':singleUser.id,
        'action': 'kick',
    };
      // Handle 'kick' action
    } else if (action === 'transfer') {
      formData = {
        'channel_id': setOverview.id,
        'user_id':singleUser.id,
        'action': 'transfer',
    };
      // Handle 'transfer' action
    }
    const url = `${main_url}/api/permissions/perform-action-on-members/`;
        console.log('Permissions to remove:', url);
        const response = await axios.post(url, formData);
        
        console.log('Permissions to remove:', response.data);

        onClose();
  };
  
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Set Permission</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleSetPermission}>
            <Text style={styles.createButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.userInfoContainer}>
            <View style={styles.userpiccontainer}>
              <Icon name="user" size={24} color="#fff" />
            </View>
            <Text style={styles.username}>{singleUser.username}</Text>
          </View>
          {permissionsData.map((permission, index) => (
            <View 
              key={permission.id} 
              style={[
                styles.permissionContainer, 
                index === 0 && styles.firstItem, 
                index === permissionsData.length - 1 && styles.lastItem
              ]}
            >
              <View style={styles.permissionInfoContainer}>
                <Text style={styles.permissionType}>{permission.permission_type}</Text>
                <Switch
                  value={removePermissions[permission.id]}
                  onValueChange={() => handleRemovePermission(permission.id)}
                />
              </View>
            </View>
          ))}
          <View style={styles.actionStyles}>
            <TouchableOpacity
              style={styles.userInfoContainer}
              onPress={() => {
                setAction('band');
                setShowConfirmation(true);
              }}
            >
              <View style={styles.userpiccontainer}>
                <MaterialCommunityIcons name="account-lock" size={20} color="#FFC0CB" />
              </View>
              <Text style={[styles.username,{color:'#FFC0CB'}]}>Ban {singleUser.username}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.userInfoContainer}
              onPress={() => {
                setAction('kick');
                setShowConfirmation(true);
              }}
            >
              <View style={styles.userpiccontainer}>
                <MaterialCommunityIcons name="account-remove" size={20} color="#FFC0CB" />
              </View>
              <Text style={[styles.username,{color:'#FFC0CB'}]}>Kick {singleUser.username}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.userInfoContainer}
              onPress={() => {
                setAction('transfer');
                setShowConfirmation(true);
              }}
            >
              <View style={styles.userpiccontainer}>
                <MaterialCommunityIcons name="handshake" size={20} color="white" />
              </View>
              <Text style={styles.username}>Transfer ownership to {singleUser.username}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {showConfirmation && (
          <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationText}>
              Are you sure you want to {action} {singleUser.username}?
            </Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmation}
              >
                <Text style={styles.confirmButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowConfirmation(false);
                  setAction(null);
                }}
              >
                <Text style={styles.cancelButtonText}>No</Text>
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
    borderBottomColor: '#fff',
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
});
