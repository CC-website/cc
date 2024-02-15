import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, Dimensions, TextInput, ScrollView, Button, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Success and Error Message Components
import { SuccessMessage, ErrorMessage } from '../../src/constants/Message/message1';
import { main_url } from '../../src/constants/Urls';

export default function Login({ visible, onClose }) {

  const navigation = useNavigation();

  const { width } = Dimensions.get('window');
  const slideInRight = new Animated.Value(width);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationType, setRegistrationType] = useState('phone');

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false); // Step 1: Introduce loading state

  useEffect(() => {
    Animated.timing(slideInRight, {
      toValue: visible ? 0 : width,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideInRight, {
      toValue: width,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setPhoneNumber('');
      setEmail('');
      setPassword('');
      onClose();
      slideInRight.setValue(width);
    });
  };

  const handleNext = async () => {
    setLoading(true); // Step 2: Set loading to true when login button is clicked

    const url = main_url + '/user/login/';

    try {
      let response;

      if (registrationType === 'phone') {
        response = await axios.post(url, {
          username: phoneNumber,
          password: password,
        });
      } else if (registrationType === 'email') {
        response = await axios.post(url, {
          username: email,
          password: password,
        });
      }

      // Handle the response with SuccessMessage
      setSuccessMessage(response.data.message);

      // Handle JWT tokens (modify this part based on your backend response)
      const token = response.data.token;
      saveToken(token); // Save the token to AsyncStorage
      setPhoneNumber('');
      setEmail('');
      setPassword('');
      setLoading(false); // Step 2: Reset loading to false after receiving response
      return navigation.navigate('AuthContext');
    } catch (error) {
      // Handle errors with ErrorMessage
      if (error.response) {
        let errorMessage = JSON.parse(error.response.data.error);
        let firstErrorMessage = errorMessage.__all__[0];
        let message = firstErrorMessage.message;

        setErrorMessage(message);
      } else if (error.request) {
        setErrorMessage('Request was made but no response received');
      } else {
        setErrorMessage('An unexpected error occurred');
      }
      setLoading(false); // Step 2: Reset loading to false after handling error
    }
  };

  const saveToken = async (token) => {
    try {
      const tokenString = JSON.stringify(token); // Convert token to a string
      await AsyncStorage.setItem('userToken', tokenString);
    } catch (error) {
      console.error('Error saving token to AsyncStorage:', error);
    }
  };
  

  const handleToggle = (type) => {
    setRegistrationType(type);
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
              {/* Display error message if exists */}
              {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />}

              {/* Display success message if exists */}
              {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage(null)} />}

              <TextInput
                style={styles.input}
                placeholder= "Phone Number or Email" 
                // keyboardType={registrationType === 'phone' ? "phone-pad" : "email-address"}
                autoCapitalize="none"
                value={registrationType === 'phone' ? phoneNumber : email}
                onChangeText={registrationType === 'phone' ? setPhoneNumber : setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                autoCapitalize="none"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" /> // Step 3: Set color of loader to white
                ) : (
                  <Text style={{ color: 'white' }}>Login</Text>
                )}
              </TouchableOpacity>
            </>
          </ScrollView>
        </View>
      </Animated.View>
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
});
