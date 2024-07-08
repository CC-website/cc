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
import { ThemeProvider } from '../../src/constants/ThemeContext';
import { useTheme } from '../../src/constants/ThemeContext';
import BroadCast from '../../app/(tabs)/notifications';
import Groupe from '../../app/components/Groupe'; // Adjust the import path as needed

function TabBarIcon(props) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const Tab = createBottomTabNavigator();

export default function TabBottomLayout({ state }) {
  const navigation = useNavigation();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(true);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);
      if (token) {
        const response = await axios.get(main_url + '/user/check_login_status/', {
          headers: {
            'Authorization': 'Bearer ' + jsonObject.access,
          },
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
      refreshApp();
    }
  }, [isLoggedIn]);

  const refreshApp = () => {
    navigation.setParams({ key: Math.random() });
  };

  if (!isLoggedIn) {
    return <AuthRequiredPage />;
  }
  useTheme();

  return (
    <ThemeProvider>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'royalblue',
          tabBarInactiveTintColor: Colors.light.tabIconDefault,
          tabBarStyle: [{
            display: showBottomBar ? 'flex' : 'none',
            backgroundColor: 'dark',
            borderWidth: 0,
          }, null],
        }}
      >
    

    <Tab.Screen
  name="Channels"
  component={(props) => <ChannelsScreen {...props} setShowBottomBar={setShowBottomBar} />}
  options={{
    tabBarIcon: ({ color }) => <FontAwesome name="users" size={24} color={color} />,
    headerShown: false,
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
          name="BroadCast"
          component={BroadCast}
          options={{
            tabBarIcon: ({ color }) => <FontAwesome name="tv" size={24} color={color} />,
            headerShown: false,
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
