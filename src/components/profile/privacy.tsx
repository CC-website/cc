import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import SetPermissions from '../members/setPermissions';
import Styles from '../../constants/Styles/profile/privacy/privacy';
import Access from './privacy/access';
import Calls from './privacy/calls';
import Disappearing from './privacy/disappearing';

export default function Privacy({ visible, onClose }) {
  const [access, getAccess] = useState(false);
  const [calls, getCalls] = useState(false);
  const [disappearing, setDisappearing] = useState(false);
  const [choice, setChoice] = useState(null);

  const openModal = (choice) => {
    setChoice(choice);
    if (['Last seen', 'Profile picture', 'About', 'Status', 'Groups'].includes(choice)) {
      getAccess(true);
    } else if (choice === 'calls') {
      getCalls(true);
    } else if (choice === 'disappearing') {
      setDisappearing(true);
    }
  };

  const closeModal = (choice) => {
    setChoice(choice);
    if (['Last seen', 'Profile picture', 'About', 'Status', 'Groups'].includes(choice)) {
      getAccess(false);
    } else if (choice === 'calls') {
      getCalls(false);
    } else if (choice === 'disappearing') {
      setDisappearing(false);
    }
  };

  const styles = Styles();

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Privacy</Text>
        </View>
        <>
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <Text style={[styles.inputDescription2, { marginBottom: 30 }]}>Who can see my personal info </Text>
            <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => openModal('Last seen')}>
              <Text style={styles.inputDescription}>Last seen and online</Text>
              <Text style={styles.inputDescription2}>Nobody, Everyone</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => openModal('Profile picture')}>
              <Text style={styles.inputDescription}>Profile photo</Text>
              <Text style={styles.inputDescription2}>Everyone</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => openModal('About')}>
              <Text style={styles.inputDescription}>About</Text>
              <Text style={styles.inputDescription2}>Everyone</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => openModal('Status')}>
              <Text style={styles.inputDescription}>Status</Text>
              <Text style={styles.inputDescription2}>My contacts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => openModal('Groups')}>
              <Text style={styles.inputDescription}>Groups</Text>
              <Text style={styles.inputDescription2}>Everyone</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => openModal('calls')}>
              <Text style={styles.inputDescription}>Calls</Text>
              <Text style={styles.inputDescription2}>Silence unknown callers</Text>
            </TouchableOpacity>

            <View style={styles.disappearingContainer}>
              <Text style={styles.inputDescription2}>Disappearing messages</Text>
              <View style={styles.disappearingSubContainer}>
                <TouchableOpacity onPress={() => openModal('disappearing')}>
                  <Text style={styles.inputDescription}>Default message timer</Text>
                  <Text style={styles.inputDescription2}>Start new chats with disappearing messages set to your timer</Text>
                </TouchableOpacity>
                <Text style={styles.inputDescription2}>Off</Text>
              </View>
            </View>
          </ScrollView>
        </>
      </View>
      <Access visible={access} onClose={() => closeModal(choice)} choice={choice} />
      <Calls visible={calls} onClose={() => closeModal(choice)} />
      <Disappearing visible={disappearing} onClose={() => closeModal(choice)}  />
    </Modal>
  );
}
