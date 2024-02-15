import React from 'react';
import { StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { useNavigation } from '@react-navigation/native';
import { Text, View } from '../../src/components/Themed';
import { RootTabScreenProps } from '../../types';
import { main_url } from '../../src/constants/Urls';

export default function Profile() {

  const navigation = useNavigation();
  
  const handleLogout = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      
      // Check if the token is available
      if (token) {
        // Parse the token to access the access property
        const jsonObject = JSON.parse(token);
        
        // Send a GET request to the logout endpoint
        const response = await axios.get(main_url + '/user/logout/', {
          headers: {
            'Authorization': `Bearer ${jsonObject.access}`
          }
        });
        
        // Show alert indicating successful logout
        Alert.alert('Logout', 'You have been logged out successfully');
        
        // Clear the token from AsyncStorage
        await AsyncStorage.removeItem('userToken');
        
        // Navigate to the login screen or any other screen you desire after logout
        return navigation.navigate('auth');
      } else {
        // Show alert indicating token is not available
        Alert.alert('Logout', 'Token not found. Please login again.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      // Show alert indicating error occurred during logout
      Alert.alert('Error', 'An error occurred while logging out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      {/* Logout button */}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
