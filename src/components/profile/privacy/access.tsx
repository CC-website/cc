import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { main_url } from '../../../constants/Urls';
import Styles from '../../../constants/Styles/profile/privacy/privacy';

export default function Access({ visible, onClose, choice }) {
    const styles = Styles();
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchUserData();
            setSelectedOption(data);
        };
        fetchData();
    }, [choice]); // Fetch data whenever choice changes

    const fetchUserData = async () => {
        try {
            const privacySettings = await AsyncStorage.getItem('UserPrivacyData');
            
            if (privacySettings) {
                const parsedUserData = JSON.parse(privacySettings);
                return parsedUserData[choice];
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
                const response = await axios.patch(main_url + '/user/privacy-settings/', { type: choice, option: value }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jsonObject.access}`,
                    },
                });

                if (response.status === 200) {
                    await AsyncStorage.setItem('UserPrivacyData', JSON.stringify({ [choice]: value }));
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
                    <Text style={styles.modalTitle}>{choice}</Text>
                </View>
                <ScrollView
                    style={styles.modalContent}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <Text style={[styles.inputDescription2, { marginBottom: 30 }]}>
                        {choice === 'Groups' ? 'Who can add me to ' : 'Who can see my '}
                        {choice}
                    </Text>

                    <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange(0)}>
                        <RadioButton styles={styles} selected={selectedOption === 0} />
                        <Text style={[styles.optionText, selectedOption === 0 ? { color: 'black' } : null]}>Everyone</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange(1)}>
                        <RadioButton styles={styles} selected={selectedOption === 1} />
                        <Text style={[styles.optionText, selectedOption === 1 ? { color: 'black' } : null]}>My contacts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange(2)}>
                        <RadioButton styles={styles} selected={selectedOption === 2} />
                        <Text style={[styles.optionText, selectedOption === 2 ? { color: 'black' } : null]}>My contacts except</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange(3)}>
                        <RadioButton styles={styles} selected={selectedOption === 3} />
                        <Text style={[styles.optionText, selectedOption === 3 ? { color: 'black' } : null]}>Nobody</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );
}

const RadioButton = ({ selected, styles }) => (
    <View style={[styles.radioContainer, selected && styles.selectedRadioButton, { marginRight: 10 }]}>
        {selected && <View style={styles.radioButton} />}
    </View>
);
