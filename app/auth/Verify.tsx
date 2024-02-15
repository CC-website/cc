import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, Dimensions, TextInput, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CountryPicker from 'react-native-country-picker-modal';
import Password from './Password';

export default function VerifyCode({ visible, onClose, onSendData }) {
  const { width } = Dimensions.get('window');
  const slideInRight = new Animated.Value(width);
  const [country, setCountry] = useState({
    cca2: 'CM',
    callingCode: '237',
    name: 'Cameroon',
  });
  const [email, setEmail] = useState('');
  const [registrationType, setRegistrationType] = useState('phone');
  const [getPassword, setGetPassword] = useState(false);
  const countryPickerRef = useRef(null);
  const [verifyMessage, setVerifyMessage] = useState('');
  const [enteredCode, setEnteredCode] = useState('');

  console.log(onSendData);

  useEffect(() => {
    Animated.timing(slideInRight, {
      toValue: visible ? 0 : width,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  const openPasswordModal = () => {
    setGetPassword(true);
  };

  const closePasswordModal = () => {
    setGetPassword(false);
  };

  const handleClose = () => {
    Animated.timing(slideInRight, {
      toValue: width,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      onClose();
      slideInRight.setValue(width);
    });
  };

  const handleToggle = (type) => {
    setRegistrationType(type);
  };

  const handleNext = () => {
    const correctCode = onSendData.verification_code; // The correct verification code from the backend
    console.log(correctCode);
    console.log(enteredCode);
    if (enteredCode == correctCode) {
      console.log('Verification Successful');
      openPasswordModal();
    } else {
      setVerifyMessage('Invalid Verification Code.');
      return;
    }
  };

  const handleCountryPress = () => {
    countryPickerRef.current?.openModal();
  };

  const handleCountrySelect = (selectedCountry) => {
    setCountry(selectedCountry);
    countryPickerRef.current?.closeModal();
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [
              {
                translateX: slideInRight,
              },
            ],
          },
        ]}
      >
        <View style={styles.modalContent}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleClose}>
              <Icon name="arrow-left" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.content}>
            <>
              <Text style={{ color: 'red', fontSize: 15 }}>{verifyMessage}</Text>
              <TextInput
                style={styles.input}
                placeholder="Verification Code"
                autoCapitalize="none"
                value={enteredCode}
                onChangeText={setEnteredCode}
              />
            </>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={{ color: 'white' }}>Next</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Animated.View>
      <Password finalData={onSendData} visible={getPassword} onClose={closePasswordModal} />
    </Modal>
  );
}


const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  backButton: {
    position: 'relative',
    top: 10,
    left: 0,
    padding: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  backButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: '#fff',
    padding: 10,
    paddingBottom: 20,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#202020',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 20,
    textAlign: 'center',
  },
  toggleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  countryPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    color: 'white',
    marginTop: 10,
    paddingLeft: 10,
  },
  nextButton: {
    backgroundColor: '#36393f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  selectedCountryContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    padding: 10,
  },
  selectedCountryText: {
    color: 'white',
    marginLeft: 10,
  },
  selectedCountryFlag: {
    width: 30,
    height: 30,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
