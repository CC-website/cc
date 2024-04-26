import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import SetPermissions from '../members/setPermissions';
import Styles from '../../../constants/Styles/profile/privacy/privacy';

export default function Calls({ visible, onClose }) {
    const styles = Styles();
    const [isSilenceEnabled, setIsSilenceEnabled] = useState(false);

    const toggleSilence = () => {
        setIsSilenceEnabled(!isSilenceEnabled);
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Icon name="arrow-left" size={18} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Calls</Text>
                </View>
                <>
                    <ScrollView
                        style={styles.modalContent}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.disappearingSubContainer}>
                            <TouchableOpacity onPress={() => openModal('disappearing')}>
                                <Text style={styles.inputDescription}>Silence unknown callers</Text>
                                <Text style={styles.inputDescription2}>
                                    Calls from unknown numbers will be silenced. They will still be shown in the calls tab and in your notifications.
                                </Text>
                            </TouchableOpacity>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={isSilenceEnabled ? '#81b0ff' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSilence}
                                value={isSilenceEnabled}
                            />
                        </View>
                    </ScrollView>
                </>
            </View>
        </Modal>
    );
}
