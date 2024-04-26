import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import SetPermissions from '../members/setPermissions';
import Styles from '../../constants/Styles/profile/privacy/privacy';

export default function Language({ visible, onClose, choice }) {
    const styles = Styles();
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        // Initialize selected option based on choice
        if (choice === 'lastSeen' || choice === 'profilePic' || choice === 'About' || choice === 'Status' || choice === 'groups') {
            setSelectedOption('Everyone');
        } else {
            setSelectedOption('Nobody');
        }
    }, [choice]);

    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Icon name="arrow-left" size={18} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Languages</Text>
                </View>
                <>
                    <ScrollView
                        style={styles.modalContent}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <Text style={[styles.inputDescription2, { marginBottom: 30 }]}>
                            {choice === 'Groups' ? 'Who can add me to ' : 'Who can see my '}
                            {choice}
                        </Text>

                        <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange('Everyone')}>
                            <RadioButton styles={styles} selected={selectedOption === 'Everyone'} />
                            <Text style={[styles.optionText, selectedOption === 'Everyone' ? { color: '#fff' } : null]}>Everyone</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange('My contacts')}>
                            <RadioButton styles={styles} selected={selectedOption === 'My contacts'} />
                            <Text style={[styles.optionText, selectedOption === 'My contacts' ? { color: '#fff' } : null]}>My contacts</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange('My contacts except')}>
                            <RadioButton styles={styles} selected={selectedOption === 'My contacts except'} />
                            <Text style={[styles.optionText, selectedOption === 'My contacts except' ? { color: '#fff' } : null]}>My contacts except</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange('Nobody')}>
                            <RadioButton styles={styles} selected={selectedOption === 'Nobody'} />
                            <Text style={[styles.optionText, selectedOption === 'Nobody' ? { color: '#fff' } : null]}>Nobody</Text>
                        </TouchableOpacity>
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