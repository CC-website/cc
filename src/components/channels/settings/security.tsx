import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView, Alert, Switch, useColorScheme } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { main_url } from '../../../constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { community } from '../../../constants/StaticData/en.json';
import { ThemeColors } from '../../../constants/thems'

export default function Security({ visible, onClose, setOverview }) {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const scheme = useColorScheme();
  const themeColors = ThemeColors[scheme];

  useEffect(() => {
    const checkMfaStatus = async () => {
      try {
        const token = await getAuthToken();
        const response = await axios.get(`${main_url}/api/mfa/${setOverview.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          if (response.data.code) {
            setMfaEnabled(true);
            setGeneratedCode(response.data.code);
          } else {
            setMfaEnabled(false);
            setGeneratedCode('');
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setMfaEnabled(false);
          setGeneratedCode('');
        } else {
          setMfaEnabled(false);
          setGeneratedCode('');
        }
      }
    };

    if (visible) {
      checkMfaStatus();
    }
  }, [visible]);

  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const jsonObject = JSON.parse(token);
        return jsonObject.access;
      } else {
        throw new Error('No token found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve authentication token.');
      throw error;
    }
  };

  const fetchVerificationCode = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${main_url}/api/mfa/${setOverview.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setGeneratedCode(response.data.code || '');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setGeneratedCode('');
      } else {
        Alert.alert('Error', 'Failed to fetch verification code.');
      }
    }
  };

  const regenerateCode = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.post(`${main_url}/api/mfa/${setOverview.id}/regenerate/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setGeneratedCode(response.data.code || '');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to regenerate verification code.');
    }
  };

  const toggleMfa = async (value) => {
    try {
      const token = await getAuthToken();
      if (value) {
        // Enable MFA
        const response = await axios.post(`${main_url}/api/mfa/${setOverview.id}/create/`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 201) {
          setMfaEnabled(true);
          setGeneratedCode(response.data.code || '');
          Alert.alert('MFA Enabled', 'Multi-Factor Authentication is now enabled.');
        } else {
          Alert.alert('Error', 'Failed to enable MFA.');
        }
      } else {
        // Disable MFA
        await axios.delete(`${main_url}/api/mfa/${setOverview.id}/disable/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Check if MFA is successfully disabled
        const statusResponse = await axios.get(`${main_url}/api/mfa/${setOverview.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (statusResponse.status === 200 && !statusResponse.data.code) {
          setMfaEnabled(false);
          setGeneratedCode('');
          Alert.alert('MFA Disabled', 'Multi-Factor Authentication has been disabled.');
        } else {
          Alert.alert('Error', 'Failed to disable MFA.');
        }
      }
    } catch (error) {
      setMfaEnabled(false);
    }
  };

  const verifyCode = async () => {
    setIsVerifying(true);
    try {
      const token = await getAuthToken();
      const response = await axios.post(`${main_url}/api/mfa/${setOverview.id}/verify/`, {
        code: verificationCode,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 && response.data.success) {
        Alert.alert('MFA Enabled', 'Multi-Factor Authentication is now enabled.');
        setMfaEnabled(true);
      } else {
        Alert.alert('Verification Failed', 'The code you entered is incorrect.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify the code. Please try again.');
    }
    setIsVerifying(false);
  };

  return (
    <Modal style={{ backgroundColor: themeColors.background }} transparent visible={visible} animationType="slide">
      <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} style={{ color: themeColors.text }} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: themeColors.text }]}>Security</Text>
          <View style={styles.toggleContainer}>
            <Text style={[styles.toggleLabel, { color: themeColors.text }]}>Enable MFA</Text>
            <Switch value={mfaEnabled} onValueChange={toggleMfa} />
          </View>
        </View>
        <ScrollView style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
          {mfaEnabled && (
            <View style={styles.verificationContainer}>
              <Text style={[styles.verificationText, { color: themeColors.text }]}>Verification Code:</Text>
              {generatedCode ? (
                <View>
                  <Text style={[styles.generatedCode, { color: themeColors.text }]}>{generatedCode}</Text>
                  <TouchableOpacity style={styles.regenerateButton} onPress={regenerateCode}>
                    <Text style={[styles.regenerateButtonText, { color: themeColors.text }]}>Regenerate Code</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={[styles.verificationText, { color: themeColors.text }]}>Generating code...</Text>
              )}
              <Text style={[styles.verificationText, { color: themeColors.text }]}>Enter Verification Code:</Text>
              <TextInput
                style={styles.input}
                placeholder="Verification Code"
                placeholderTextColor="#888"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={verifyCode}
                disabled={isVerifying}
              >
                <Text style={[styles.verifyButtonText, { color: themeColors.text }]}>
                  {isVerifying ? 'Verifying...' : 'Verify Code'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
  },
  backButton: {
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#202020',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: '91%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  backButtonContainer: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: ThemeColors.text,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    color: 'white',
    marginRight: 10,
  },
  verificationContainer: {
    marginTop: 20,
  },
  verificationText: {
    color: 'white',
    marginBottom: 10,
  },
  generatedCode: {
    color: '#28a745',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  regenerateButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  regenerateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'white',
    marginBottom: 10,
  },
  verifyButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
