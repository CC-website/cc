import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Screen3 from '../../src/components/chat/massageTab/tab3';
import Screen4 from '../../src/components/chat/massageTab/tab4';
import Screen1 from '../../src/components/chat/massageTab/ta1';
import Screen2 from '../../src/components/chat/massageTab/tab2';

const Tab = createMaterialTopTabNavigator();

export default function Index() {
  const navigation = useNavigation();
  const panGestureHandlerRef = useRef(null);
  const [scroll, setScroll] = useState(false)

  const onPanGestureEvent = (event) => {
    if (event.nativeEvent.translationX > 0) {
      navigation.navigate('Tab1');
    } else {
      navigation.navigate('Tab2');
    }
  };




  return (
    <View style={styles.container}>
      {/* Bar above the tabs */}
      <View style={[styles.upperBar, {top:20}]}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="md-card" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="md-camera" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="md-search" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>
     
      {/* Content */}
      <View style={[styles.content, {top: 23}]}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
            tabBarShowIcon: true,
            tabBarIndicatorStyle: { backgroundColor: 'blue' },
            tabBarStyle: { backgroundColor: '#fff', position: 'sticky', top: 0 },
            swipeEnabled: true,
          }}
        >
          <Tab.Screen
            name="Contacts"
            component={Screen1}
          />
          <Tab.Screen
            name="Channels"
            component={Screen2}
          />
          <Tab.Screen
            name="Status"
            component={Screen3}
          />
          <Tab.Screen
            name="Calls"
            component={Screen4}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  upperBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  tabContainer: {
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 5,
    backgroundColor: '#ddd',
    elevation: 5,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

