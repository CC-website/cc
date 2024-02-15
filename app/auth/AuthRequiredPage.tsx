import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import Register from './Register';
import VerifyCode from './Verify';
import Password from './Password';
import Login from './Login';
import { useNavigation } from '@react-navigation/native';

export default function AuthRequiredPage() {
  const [loginModal, setLoginModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [getPassword, setGetPassword] = useState(false);

  const navigation = useNavigation();

  const openLoginModal = () => {
    setLoginModal(true);
  };

  const closeLoginModal = () => {
    setLoginModal(false);
  };

  const openRegisterModal = () => {
    setRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setRegisterModal(false);
  };

  const handleRegistrationComplete = () => {
    setLoginModal(false);
    setRegisterModal(false);
    setVerifyModal(false);
    setGetPassword(false);
    // You can also navigate back to AuthRequiredPage if needed
    // navigation.navigate('AuthRequiredPage');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainContent}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
            Login/Sign Up Required
          </Text>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={openLoginModal}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={openRegisterModal}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <Register
        visible={registerModal}
        onClose={handleRegistrationComplete}
      />
      <Login
      visible={loginModal}
      onClose={closeLoginModal}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Light gray background color
  },
  content: {
    height: '96%',
    width: '100%',
    backgroundColor: '#202020', // White background color
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Add elevation for shadow (Android)
    shadowColor: '#000', // Shadow color (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
    marginTop:40,
  },
  mainContent: {
    fontSize: 20,
    color: '#333',
    height:"78%",
  },
  loginButton: {
    backgroundColor: '#3498db', // Blue color
    paddingVertical: 15,
    width: '100%',
    borderRadius: 5,
    marginTop:40,
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: '#27ae60', // Green color
    paddingVertical: 15,
    width: '100%',
    borderRadius: 5,
    marginTop:10,
    alignItems: 'center',
  },
});
