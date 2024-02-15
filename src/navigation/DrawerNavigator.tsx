import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from 'react-native';

import Colors from '../../src/constants/Colors';
import AuthRequiredPage from '../../app/auth/AuthRequiredPage';
import { main_url } from '../../src/constants/Urls';
import ChannelsScreen from '../../app/(tabs)/channels';
import Index from '../../app/(tabs)';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const Drawer = createDrawerNavigator();

export default function TabDrawLayout({ state }) {
  const colorScheme = useColorScheme();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const navigation = useNavigation();
  console.log("this is the start page")
  const checkLoginStatus = async () => {
    try {
      // Make a request to your backend endpoint to check user's login status
      // const response = await axios.get(main_url + '/user/check_login_status/');

      // Update the isLoggedIn state based on the response from the backend
      setLoggedIn(true);

      // If the user is logged in, navigate to the home page
      if (isLoggedIn) {
        navigation.navigate('Messages'); // Replace 'Home' with the name of your home screen
      }
    } catch (error) {
      // Handle error (e.g., network error, server error)
      console.error('Error checking login status:', error);
    }
  };

  useEffect(() => {
    // Check the login status when the component mounts
    checkLoginStatus();
  }, [state]); // Update effect dependency to include 'state'

  if (!isLoggedIn) {
    return <AuthRequiredPage navigation={navigation} />;
  }

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Channels"
        component={ChannelsScreen}
        options={{
          drawerIcon: ({ color }) => <FontAwesome name="users" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Messages"
        component={Index}
        options={{
          drawerIcon: ({ color }) => <FontAwesome name="comment" size={24} color={color} />,
        }}
      />
      {/* Add more Drawer.Screen components as needed */}
    </Drawer.Navigator>
  );
}

// Add your specific screen components for ChannelsScreen, MessagesScreen, etc.
