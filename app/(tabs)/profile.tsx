import React, { useState } from 'react';
import { StyleSheet, Button, Alert, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { useNavigation } from '@react-navigation/native';
import { Text, View } from '../../src/components/Themed';
import { RootTabScreenProps } from '../../types';
import { main_url } from '../../src/constants/Urls';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';
import Styles from '../../src/constants/Styles/profile';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Account from '../../src/components/profile/account';
import Chat from '../../src/components/profile/chats';
import Help from '../../src/components/profile/help';
import Invite from '../../src/components/profile/invite';
import Language from '../../src/components/profile/language';
import Privacy from '../../src/components/profile/privacy';
import Storage from '../../src/components/profile/storage';
import EditProfile from '../../src/components/profile';

export default function Profile() {

  const navigation = useNavigation();
  const styles = Styles();
  const [profil, setProfile] = useState(false);
  const [modals, setModals] = useState({
    account: false,
    privacy: false,
    chats: false,
    storage: false,
    language: false,
    help: false,
    invite: false,
  });

  const openEditProfile = () =>{
    setProfile(true);
  }
  const closeEditProfile = () =>{
    setProfile(false);
  }

  const openModal = (item) => {
    setModals((prevModals) => ({ ...prevModals, [item]: true }));
  };

  const closeModal = (item) => {
    setModals((prevModals) => ({ ...prevModals, [item]: false }));
  };
  
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


  const renderModal = (modalKey) => {
    switch (modalKey) {
      case 'account':
        return <Account visible={modals.account} onClose={() => closeModal('account')} />;
      case 'privacy':
        return <Privacy visible={modals.privacy} onClose={() => closeModal('privacy')} />;
      case 'chats':
        return <Chat visible={modals.chats} onClose={() => closeModal('chats')} />;
      case 'storage':
        return <Storage visible={modals.storage} onClose={() => closeModal('storage')} />;
      case 'language':
        return <Language visible={modals.language} onClose={() => closeModal('language')} />;
      case 'help':
        return <Help visible={modals.help} onClose={() => closeModal('help')} />;
      case 'invite':
        return <Invite visible={modals.invite} onClose={() => closeModal('invite')} />;
      default:
        return null;
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.userImageContainer}>
        <View style={styles.topbar}></View>
        <View style={styles.picTextContainer}>
          <View style={styles.profilePicContain}></View>
          <View style={styles.profileTextContain}>
            <View style={styles.profileNameContainer} >
              <Text style={styles.title}>Nigel Bah</Text>
              <TouchableOpacity onPress={openEditProfile}>
                <FontAwesome name="edit" size={20} style={[styles.title, {margin: 10,}]} />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.smallText}> I am on CC !</Text>
            </View>
          </View>
        </View>
        
        
      </View>
      <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >


      <TouchableOpacity onPress={() => openModal('account')} style={styles.settingItem}>
        <View style= {styles.iconContainer}>
         <Ionicons name="key" size={20} color="#fff" style={[styles.title, {margin: 10,}]} />
        </View>
        <View style= {styles.settingTextContainer}>
          <Text style = {styles.mainSettingItemText}>Account</Text>
          <Text style = {styles.subSettingItemText}>Security notification, change number</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => openModal('privacy')} style={styles.settingItem}>
        <View style= {styles.iconContainer}>
        <FontAwesome name="lock" size={20} style={[styles.title, {margin: 10,}]}  />
        </View>
        <View style= {styles.settingTextContainer}>
          <Text style = {styles.mainSettingItemText}>Privacy</Text>
          <Text style = {styles.subSettingItemText}>Block contacts, disappearing messages</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => openModal('chats')} style={styles.settingItem}>
        <View style= {styles.iconContainer}>
          <FontAwesome name="comments" size={20} style={[styles.title, {margin: 10,}]} />
        </View>
        <View style= {styles.settingTextContainer}>
          <Text style = {styles.mainSettingItemText}>Chats</Text>
          <Text style = {styles.subSettingItemText}>Theme, wallpapers, chat history</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => openModal('storage')} style={styles.settingItem}>
        <View style= {styles.iconContainer}>
          <FontAwesome name="database" size={20} style={[styles.title, {margin: 10,}]} />
        </View>
        <View style= {styles.settingTextContainer}>
          <Text style = {styles.mainSettingItemText}>Storage and data</Text>
          <Text style = {styles.subSettingItemText}>Network usage, group & call tones</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => openModal('language')} style={styles.settingItem}>
        <View style= {styles.iconContainer}>
          <FontAwesome name="language" size={20} style={[styles.title, {margin: 10,}]} />
        </View>
        <View style= {styles.settingTextContainer}>
          <Text style = {styles.mainSettingItemText}>App language</Text>
          <Text style = {styles.subSettingItemText}>English (device's language)</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => openModal('help')} style={styles.settingItem}>
        <View style= {styles.iconContainer}>
          <FontAwesome name="question-circle" size={20} style={[styles.title, {margin: 10,}]} />
        </View>
        <View style= {styles.settingTextContainer}>
          <Text style = {styles.mainSettingItemText}>Help</Text>
          <Text style = {styles.subSettingItemText}>Help center, contact us, privacy policy</Text>
        </View>
      </TouchableOpacity>


      <TouchableOpacity onPress={() => openModal('invite')} style={styles.settingItem}>
        <View style= {styles.iconContainer}>
          <FontAwesome name="user-plus" size={20} style={[styles.title, {margin: 10,}]} />
        </View>
        <View style= {styles.settingTextContainer}>
          <Text style = {styles.mainSettingItemText}>Invite a friend</Text>
        </View>
      </TouchableOpacity>


      <TouchableOpacity onPress={handleLogout} style={styles.settingItem}>
        <View style= {styles.iconContainer}>
          <FontAwesome name="sign-out" size={20} style={[styles.title, {margin: 10,}]} />
        </View>
        <View style= {styles.settingTextContainer}>
          <Text style = {styles.mainSettingItemText}>Log out</Text>
        </View>
      </TouchableOpacity>

          
    </ScrollView>
      
      
      {/* Logout button */}
      {/* <Button title="Logout" onPress={handleLogout} /> */}

      {Object.keys(modals).map((modalKey) => renderModal(modalKey))}
        <EditProfile
        visible={profil}
        onClose={closeEditProfile}
        />
    </View>
  );
}
