import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, Dimensions, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Success and Error Message Components
import { SuccessMessage, ErrorMessage } from '../../src/constants/Message/message1';
import { main_url } from '../../src/constants/Urls';
import { useNavigation } from '@react-navigation/native';

export default function Password({ visible, onClose, finalData }) {
  const { width } = Dimensions.get('window');
  const slideInRight = new Animated.Value(width);

  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [password3, setPassword3] = useState('');
  const [registrationType, setRegistrationType] = useState('phone');
  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigation = useNavigation();

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
      onClose();
      slideInRight.setValue(width);
    });
  };

  const handleToggle = (type) => {
    setRegistrationType(type);
  };

  const saveToken = async (token) => {
    try {
      const tokenString = JSON.stringify(token);
      await AsyncStorage.setItem('userToken', tokenString);
    } catch (error) {
      console.error('Error saving token to AsyncStorage:', error);
    }
  };

  const register = async () => {
    setLoading(true); // Show loader
    const url = main_url + '/user/register/';

    try {
      let response;

      if (finalData.type === 'phone') {
        response = await axios.post(url, {
          username: finalData.phone_number,
          phone_number: finalData.phone_number,
          password: password1,
          code: finalData.code,
        });
      } else if (finalData.type === 'email') {
        response = await axios.post(url, {
          username: finalData.email,
          email: finalData.email,
          password: password1,
          code: {},
        });
      }

      setLoading(false); // Hide loader

      // Handle the response with SuccessMessage
      setSuccessMessage(response.data.message);

      // Handle JWT tokens (modify this part based on your backend response)
      const token = response.data.token;
      console.log(token)
      saveToken(token); // Save the token to AsyncStorage

      // Simulate a 2-second delay before navigation
      setTimeout(() => {
        // Navigate back to the layout page after successful registration
        navigation.navigate('AuthContext');
      }, 2000);
    } catch (error) {
      setLoading(false); // Hide loader
      // Handle errors with ErrorMessage
      setErrorMessage(error.response.data.message);
    }
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
                placeholder="Enter Password"
                autoCapitalize="none"
                secureTextEntry
                value={password1}
                onChangeText={setPassword1}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                autoCapitalize="none"
                secureTextEntry
                value={password2}
                onChangeText={setPassword2}
              />
              <TouchableOpacity style={styles.nextButton} onPress={register}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: 'white' }}>Register</Text>
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
