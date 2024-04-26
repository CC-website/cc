import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import SetPermissions from '../members/setPermissions';
import Styles from '../../../constants/Styles/profile/privacy/privacy';

export default function Disappearing({ visible, onClose }) {
    const styles = Styles();
    const [selectedOption, setSelectedOption] = useState('Off');

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

                        <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange('24 hours')}>
                            <RadioButton styles={styles} selected={selectedOption === '24 hours'} />
                            <Text style={[styles.optionText, selectedOption === '24 hours' ? { color: '#fff' } : null]}>24 hours</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange('7 days')}>
                            <RadioButton styles={styles} selected={selectedOption === '7 days'} />
                            <Text style={[styles.optionText, selectedOption === '7 days' ? { color: '#fff' } : null]}>7 days</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange('90 days')}>
                            <RadioButton styles={styles} selected={selectedOption === '90 days'} />
                            <Text style={[styles.optionText, selectedOption === '90 days' ? { color: '#fff' } : null]}>90 days</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionContainer} onPress={() => handleOptionChange('Off')}>
                            <RadioButton styles={styles} selected={selectedOption === 'Off'} />
                            <Text style={[styles.optionText, selectedOption === 'Off' ? { color: '#fff' } : null]}>Off</Text>
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
