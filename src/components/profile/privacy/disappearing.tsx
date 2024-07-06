import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import SetPermissions from '../members/setPermissions';
import Styles from '../../../constants/Styles/profile/privacy/privacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Disappearing({ visible, onClose }) {
    const styles = Styles();
    const [selectedOption, setSelectedOption] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchUserData();

            setSelectedOption(data);
        };
        fetchData()
    }, []); // Fetch data whenever choice changes

    const fetchUserData = async () => {
        try {
            const privacySettings = await AsyncStorage.getItem('UserPrivacyData');
            
            if (privacySettings) {
                const parsedUserData = JSON.parse(privacySettings);
                return parsedUserData.disappearing_messages;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        return null;
    };



    const handleOptionChange = async (value) => {
        try {
            setSelectedOption(value);
            const token = await AsyncStorage.getItem('userToken');
            
            if (token) {
                const jsonObject = JSON.parse(token);
                const response = await axios.patch(main_url + '/user/privacy-settings/', { type: "disappearing_messages", messageValue: value, option:0, callOption: null }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jsonObject.access}`,
                    },
                });

                if (response.status === 200) {
                    await AsyncStorage.setItem('UserPrivacyData', JSON.stringify({ ['disappearing_messages']: value }));
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
                    <Text style={styles.modalTitle}>Default message timer</Text>
                </View>
                <>
                    <ScrollView
                        style={styles.modalContent}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <Text style={[styles.inputDescription2, { marginBottom: 30 }]}>
                            Start new chats with a disappearing message timer set to
                        </Text>

                        <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange(24)}>
                            <RadioButton styles={styles} selected={selectedOption === 24} />
                            <Text style={[styles.optionText, selectedOption === 24 ? { color: 'black' } : null]}>24 hours</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange(7)}>
                            <RadioButton styles={styles} selected={selectedOption === 7} />
                            <Text style={[styles.optionText, selectedOption === 7 ? { color: 'black' } : null]}>7 days</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange(90)}>
                            <RadioButton styles={styles} selected={selectedOption === 90} />
                            <Text style={[styles.optionText, selectedOption === 90 ? { color: 'black' } : null]}>90 days</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange(0)}>
                            <RadioButton styles={styles} selected={selectedOption === 0} />
                            <Text style={[styles.optionText, selectedOption === 0 ? { color: 'black' } : null]}>Off</Text>
                        </TouchableOpacity>
                        <Text style={[styles.inputDescription2, { marginTop: 30 }]}>
                            When turned on, all new individual chats will start with disappearing messages set to the duration you select. This setting will not affect your existing chats.
                        </Text>
                    </ScrollView>
                </>
            </View>
        </Modal>
    );
}

const RadioButton = ({ selected, styles }) => (
    <View style={[styles.radioContainer, selected && styles.selectedRadioButton, {marginRight: 10}]}>
        {selected && <View style={styles.radioButton} />}
    </View>
);
