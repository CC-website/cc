import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../../src/constants/Colors';
import AuthRequiredPage from '../auth/AuthRequiredPage';
import { main_url } from '../../src/constants/Urls';
import ChannelsScreen from '../../app/(tabs)/channels';
import Index from '../../app/(tabs)';
import Profile from '../../app/(tabs)/profile';
import NotificationScreen from '../../app/(tabs)/notifications';
import { ThemeProvider } from '../../src/constants/ThemeContext';
import { useTheme } from '../../src/constants/ThemeContext';



function TabBarIcon(props) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}



const Tab = createBottomTabNavigator();

export default function TabBottomLayout({ state }) {
  const navigation = useNavigation();
  const [isLoggedIn, setLoggedIn] = useState(false);

  
  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);
      if (token) {
          const response = await axios.get(main_url + '/user/check_login_status/', {
              headers: {
                  'Authorization': 'Bearer ' + jsonObject.access
              }
          });

          
        if (response.data.user) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, [state]);

  useEffect(() => {
    if (isLoggedIn) {
      // Refresh the app before returning the AuthRequiredPage
      refreshApp();
    }
  }, [isLoggedIn]);

  const refreshApp = () => {
    // Reset the root component by changing the key
    navigation.setParams({ key: Math.random() });
  };

  if (!isLoggedIn) {
    // If not logged in, return the "Messages" screen instead of AuthRequiredPage
    return <AuthRequiredPage />;
  }
   useTheme();

console.log('NIgel==========================',useTheme())

  return (
    <ThemeProvider>
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'royalblue', // Replace with your actual color
        tabBarInactiveTintColor: Colors.light.tabIconDefault, // Replace with your actual color
        tabBarStyle: [{
          display: 'flex',
          backgroundColor: "darck",
          borderWidth: 0, // Set border width to 0
        }, null],
      }}
    >

      <Tab.Screen
        name="Channels"
        component={ChannelsScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="users" size={24} color={color} />,
          headerShown: false, // Hide the top bar for the Channels screen
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Index}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="comment" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="bell" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  </ThemeProvider>
    
  );
}
