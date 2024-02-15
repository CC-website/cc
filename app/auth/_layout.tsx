import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../../src/constants/Colors';
import AuthRequiredPage from './AuthRequiredPage';
import { main_url } from '../../src/constants/Urls';
import ChannelsScreen from '../(tabs)/channels';
import Index from '../(tabs)';
import Profile from '../(tabs)/profile';
import NotificationScreen from '../(tabs)/notifications';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const Tab = createBottomTabNavigator();

export default function AuthLayout({ state }) {
  const navigation = useNavigation();
  const [isLoggedIn, setLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);
      if (token) {
          console.log(jsonObject.access)
          const response = await axios.get(main_url + '/user/check_login_status/', {
              headers: {
                  'Authorization': 'Bearer ' + jsonObject.access
              }
          });

        if (response.data.user) {
          setLoggedIn(true);
          return navigation.navigate('Messages');
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

  if (!isLoggedIn) {
    console.log("NNNNNNNNNNNNNNNNNNNNNNNNNN")

    return <AuthRequiredPage  />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint, // Replace with your actual color
        tabBarInactiveTintColor: Colors.light.tabIconDefault, // Replace with your actual color
        tabBarStyle: [{ display: 'flex' }, null],
      }}
    >
      <Tab.Screen
        name="Login"
        component={ChannelsScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="users" size={24} color={color} />,
        }}
        
      />
      <Tab.Screen
        name="Register"
        component={Index}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="comment" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
