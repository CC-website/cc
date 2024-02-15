import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, Dimensions, TextInput, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CountryPicker from 'react-native-country-picker-modal';
import VerifyCode from './Verify';
import libphonenumber from 'google-libphonenumber';

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

export default function Register({ visible, onClose }) {
  const { width } = Dimensions.get('window');
  const slideInRight = new Animated.Value(width);
  const [country, setCountry] = useState({
    cca2: 'CM',
    callingCode: '237',
    name: 'Cameroon',
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [registrationType, setRegistrationType] = useState('phone');
  const [verify, setVerify] = useState(false);
  const countryPickerRef = useRef(null);
  const [registrationData, setRegistrationData] = useState({});
  const [verificationCode, setVerificationCode] = useState(0);
  const [invalidPhoneNumber, setInvalidPhoneNumber] = useState('');
  const [verificationTimeout, setVerificationTimeout] = useState(null);

  useEffect(() => {
    Animated.timing(slideInRight, {
      toValue: visible ? 0 : width,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  const handleClose = () => {
    clearTimeout(verificationTimeout);
    onClose();

    // Reset state
    setCountry({
      cca2: 'CM',
      callingCode: '237',
      name: 'Cameroon',
    });
    setPhoneNumber('');
    setEmail('');
    setRegistrationType('phone');
    setVerify(false);
    setRegistrationData({});
    setVerificationCode(0);
    setInvalidPhoneNumber('');
    slideInRight.setValue(width);
  };

  const handleToggle = (type) => {
    setRegistrationType(type);
  };

  const closeVerify = () => {
    setVerify(false);
  };

  const openVerify = () => {
    setVerify(true);
  };

  const handleNext = async () => {
    clearTimeout(verificationTimeout);

    if (registrationType === 'phone') {
      try {
        const parsedNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, country.cca2);
        const isValid = phoneUtil.isValidNumber(parsedNumber);
        if (!isValid) {
          setInvalidPhoneNumber('Invalid phone number');
          return;
        }
      } catch (error) {
        console.error('Error validating phone number:', error);
        setInvalidPhoneNumber('Error validating phone number');
        return;
      }
    }

    setInvalidPhoneNumber('');

    const generatedCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code

    if (registrationType === 'phone') {
      setVerificationCode(generatedCode);
      setRegistrationData({
        "type": registrationType,
        "verification_code": generatedCode,
        "code": country,
        "phone_number": phoneNumber,
      });
      openVerify();
    } else {
      setVerificationCode(generatedCode);
      setRegistrationData({
        "type": registrationType,
        "verification_code": generatedCode,
        "email": email,
      });
      openVerify();
    }

    const timeout = setTimeout(() => {
      console.log('Verification Code Expired');
      setVerificationCode(0);
    }, 50000);
    setVerificationTimeout(timeout);
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
            <View style={styles.toggleButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor: registrationType === 'phone' ? '#36393f' : 'transparent',
                    borderColor: registrationType === 'phone' ? '#36393f' : 'black',
                    borderWidth: registrationType === 'phone' ? 0 : 1,
                  },
                ]}
                onPress={() => handleToggle('phone')}
              >
                <Text style={styles.toggleButtonText}>Phone Registration</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor: registrationType === 'email' ? '#36393f' : 'transparent',
                    borderColor: registrationType === 'email' ? '#36393f' : 'black',
                    borderWidth: registrationType === 'email' ? 0 : 1,
                  },
                ]}
                onPress={() => handleToggle('email')}
              >
                <Text style={styles.toggleButtonText}>Email Registration</Text>
              </TouchableOpacity>
            </View>

            {registrationType === 'phone' && (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                  <TouchableOpacity
                    style={{ height: 49, width: 70, backgroundColor: 'white', marginTop: 9, borderRadius: 2, justifyContent: 'center', alignItems: 'center', padding: 3 }}
                    onPress={handleCountryPress}
                  >
                    <View style={styles.countryPickerContainer}>
                      <CountryPicker
                        ref={countryPickerRef}
                        withFilter
                        withFlag
                        withFlagButton
                        withCallingCode
                        withCallingCodeButton
                        onSelect={handleCountrySelect}
                        countryName=""
                        visible={false}
                      />
                    </View>
                  </TouchableOpacity>
                  {country && (
                    <View style={[styles.selectedCountryContainer, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                      <Image
                        style={styles.selectedCountryFlag}
                        source={{ uri: `https://flagsapi.com/${country.cca2}/flat/64.png` }}
                      />
                      <Text style={styles.selectedCountryText}>{country.name}</Text>
                      <Text style={styles.selectedCountryText}>(+{country.callingCode})</Text>
                    </View>
                  )}
                </View>
                <Text style={{ color: 'red', fontSize: 15 }}>{invalidPhoneNumber}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </>
            )}
            {registrationType === 'email' && (
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            )}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={{ color: 'white' }}>Next</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Animated.View>
      <VerifyCode onSendData={registrationData} visible={verify} onClose={closeVerify} />
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
});
