import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import SetPermissions from '../members/setPermissions';
import Styles from '../../../constants/Styles/profile/privacy/privacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Calls({ visible, onClose }) {
    const styles = Styles();
    const [isSilenceEnabled, setIsSilenceEnabled] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchUserData();

            setIsSilenceEnabled(Boolean(data));
        };
        fetchData()
    }, []); // Fetch data whenever choice changes


    const fetchUserData = async () => {
        try {
            const privacySettings = await AsyncStorage.getItem('UserPrivacyData');
            
            if (privacySettings) {
                const parsedUserData = JSON.parse(privacySettings);
                return parsedUserData.calls;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        return null;
    };

    const toggleSilence = () => {
        setIsSilenceEnabled(!isSilenceEnabled);
        handleOptionChange(!isSilenceEnabled);
    };

    const handleOptionChange = async (value) => {
        try {
            setIsSilenceEnabled(value);
            const token = await AsyncStorage.getItem('userToken');
            
            if (token) {
                const jsonObject = JSON.parse(token);
                const response = await axios.patch(main_url + '/user/privacy-settings/', { type: "calls", callOption: value, option:0 }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jsonObject.access}`,
                    },
                });

                if (response.status === 200) {
                    await AsyncStorage.setItem('UserPrivacyData', JSON.stringify({ ['calls']: value }));
                    console.log('Profile data saved successfully');
                } else {
                    console.error('Failed to save profile data');
                }
            }
        } catch (error) {
            console.error('Error saving profile data:', error);
        }
        
        onClose();
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Icon name="arrow-left" size={18} color="black" />
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
                            <TouchableOpacity>
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
