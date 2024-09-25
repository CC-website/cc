import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import MessagingScreen from '../messaging/MessagingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Ws_main_url } from '../../../constants/Urls';

export default function Groupe({ visible, onClose, setShowBottomBar }) {
  const screenWidth = Dimensions.get('window').width;
  // const [slideAnim] = useState(new Animated.Value(screenWidth));
  const [openby, setOpenby] = useState(0);
  const [isGroup, setIsGroup] = useState(false);
  const [processedData, setProcessedData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const clientRef = useRef(null);
  const roomName = '123';
  const [messages, setMessages] = useState([]);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width * 0.86)).current;
  // const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenWidth * 0.86,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        slideAnim.setValue(screenWidth * 0.86);
      });
    }
  }, [visible]);

  // Load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('UserData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      } else {
        console.log("No user data found");
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Check online status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected && state.isInternetReachable);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Connect to WebSocket server
  useEffect(() => {
    const connectWebSocket = () => {
      const wsUrl = `ws:${Ws_main_url}/ws/chat/${roomName}/`;
      clientRef.current = new WebSocket(wsUrl);

      clientRef.current.onopen = () => {
        console.log('WebSocket Client Connected');
        if (isOnline && userData) {
          clientRef.current.send(JSON.stringify({
            text: "Online",
            sender: userData.id,
            status: "online",
            timestamp: Date.now(),
          }));
        }
      };

      clientRef.current.onmessage = (message) => {
        console.log('Received message:', message.data);
        const newMessage = JSON.parse(message.data);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      clientRef.current.onerror = (error) => {
        console.error('WebSocket Error:', error.message);
      };

      clientRef.current.onclose = (event) => {
        console.log('WebSocket Client Closed:', event.code, event.reason);
      };
    };

    if (userData) {
      connectWebSocket();
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.close();
      }
    };
  }, [userData, roomName, isOnline]);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (visible) {
      setShowBottomBar(false);
      
      setShowBottomBar(true);
      Animated.timing(slideAnim, {
        toValue: screenWidth * 0.86,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        slideAnim.setValue(screenWidth * 0.86);
      });
    }
  }, [visible, screenWidth * 0.86]);

 

  const handelSetOpenby = () => {
    if(openby === 0){
      console.log("time")
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setOpenby(1);
    }
    if(openby === 1){
      Animated.timing(slideAnim, {
        toValue: screenWidth * 0.86,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        slideAnim.setValue(screenWidth * 0.86);
        setShowBottomBar(true);
        setOpenby(0);
      });
    }
    
  };

  return (
    <Animated.View
      style={[
        styles.modalContainer,
        { transform: [{ translateX: slideAnim }] }
      ]}
    >
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => handelSetOpenby()}>
          <Icon name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>
          {userData.username} {messages.length > 0 && messages[0].text}
        </Text>
        <TouchableOpacity style={styles.createButton} >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <MessagingScreen roomName={roomName} isGroup={isGroup} userData={processedData} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  modal: {
    borderRadius: 10,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#202020',
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 20,
    borderRadius: 10,
    marginTop: 40,
    height: "100%",
  },
  backButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#fff',
  },
  backButton: {
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  createButton: {
    backgroundColor: '#36393f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: 60,
    height: 50,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  optionButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '45%',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
