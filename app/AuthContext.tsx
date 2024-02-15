import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import TabStackLayout from './(tabs)/_layout';

function TabBarIcon(props) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const Tab = createBottomTabNavigator();

export default function AuthContext() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.navigate('(tabs)');
  }, []); // Empty dependency array to ensure this effect only runs once when the component mounts

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="(tabs)"
        component={TabStackLayout}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="comment" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
