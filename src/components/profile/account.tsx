import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import SetPermissions from '../members/setPermissions';
import AddContact from './account/addContact';
import Passkeys from './account/passkeys';
import Security from './account/security';
import Verification from './account/verification';
import Styles from '../../constants/Styles/profile/account/account';

export default function Account({ visible, onClose }) {
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [addContactVisible, setAddContactVisible] = useState(false);
  const [emailAddressVisible, setEmailAddressVisible] = useState(false);
  const [changeNumberVisible, setChangeNumberVisible] = useState(false);
  const [passkeysVisible, setPasskeysVisible] = useState(false);
  const [securityVisible, setSecurityVisible] = useState(false);
  const [verificationVisible, setVerificationVisible] = useState(false);
  const styles = Styles()
  const handleDeleteAccount = () => {
    // Implement account deletion logic
    // Show confirmation modal before proceeding
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} style={styles.inputIcon} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Account</Text>
          
        </View> 
        <>
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <MenuItem styles={styles} icon="shield-check" text="Security Notification" onPress={() => setSecurityVisible(true)} />
            <MenuItem styles={styles} icon="key" text="Passkeys" onPress={() => setPasskeysVisible(true)} />
            <MenuItem styles={styles} icon="lock" text="Lock your account" onPress={() => setVerificationVisible(true)} />
            <MenuItem styles={styles} icon="account-plus" text="Add Contact" onPress={() => setAddContactVisible(true)} />
            <TouchableOpacity style={styles.createButton} onPress={handleDeleteAccount}>
              <Text style={{color:'red'}}>Delete Account</Text>
            </TouchableOpacity> 
          </ScrollView>
        </>
      </View>
      <AddContact visible={addContactVisible} onClose={() => setAddContactVisible(false)} />
      <Passkeys visible={passkeysVisible} onClose={() => setPasskeysVisible(false)} />
      <Security visible={securityVisible} onClose={() => setSecurityVisible(false)} />
      <Verification visible={verificationVisible} onClose={() => setVerificationVisible(false)} />

      {/* Delete Account Confirmation Modal */}
      <Modal transparent visible={deleteConfirmationVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.deleteConfirmation}>
            <Text style={styles.deleteConfirmationText}>Are you sure you want to delete your account?</Text>
            <TouchableOpacity style={styles.deleteConfirmationButton} onPress={handleDeleteAccount}>
              <Text style={{ color: 'red' }}>Confirm Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteConfirmationButton} onPress={() => setDeleteConfirmationVisible(false)}>
              <Text style={{ color: '#fff' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

// Menu Item Component
const MenuItem = ({ icon, text, onPress, styles }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <MaterialCommunityIcons name={icon} size={24} style={styles.menuIcon} />
    <Text style={styles.menuText}>{text}</Text> 
  </TouchableOpacity>
);

