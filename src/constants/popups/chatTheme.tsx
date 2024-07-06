import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const ChatTheme = ({ visible, onClose, onSubmit, title, message = null, options }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    
    const RadioButton = ({ selected, styles }) => (
        <View style={[styles.radioContainer, selected && styles.selectedRadioButton]}>
            {selected && <View style={styles.radioButton} />}
        </View>
    );
    
    const handleOptionSelect = (index) => {
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption !== null) {
            onSubmit(options[selectedOption]);
        }
    };
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.optionsContainer}>
                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.optionItem}
                                onPress={() => handleOptionSelect(index)}
                            >
                                <RadioButton styles={styles} selected={selectedOption === index} />
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black overlay
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        textAlign: 'center',
        marginBottom: 20,
    },
    radioButton: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#3498db', // Color of selected radio button
    },
    radioContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#3498db', // Color of radio button border
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    optionsContainer: {
        width: '100%',
        marginBottom: 20,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionText: {
        marginLeft: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        width: '40%',
        justifyContent: 'space-between',
        marginLeft: '50%',
    },
    button: {
        padding: 5,
    },
    buttonText: {
        color: '#3498db',
        fontWeight: 'bold',
    },
});

export default ChatTheme;
