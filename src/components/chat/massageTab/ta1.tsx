import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons, MaterialCommunityIcons, MaterialIcons  } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';

export default function Screen1() {
    const navigation = useNavigation();
    const panGestureHandlerRef = useRef(null);
    const [scroll, setScroll] = useState(false)

    let prevScrollY = useRef(0);

    const onScroll = (event) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      if (currentScrollY > prevScrollY.current) {
        setScroll(true)
        console.log("Tab 1 Downscroll");
      } else {
        console.log("Tab 1 Upscroll");
        setScroll(false)
      }
      prevScrollY.current = currentScrollY;
    };

    // Sample user data
    const users = [
      { id: 1, name: 'John Doe', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 2, name: 'Jane Smith', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      { id: 3, name: 'John Doe', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 4, name: 'Jane Smith', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      { id: 5, name: 'John Doe', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 6, name: 'Jane Smith', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      { id: 7, name: 'John Doe', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 8, name: 'Jane Smith', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      { id: 9, name: 'John Doe', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 10, name: 'Jane Smith', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      { id: 11, name: 'John Doe', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 12, name: 'Jane Smith', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      { id: 13, name: 'John Doe', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 14, name: 'Jane Smith', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      { id: 15, name: 'John Doe', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 16, name: 'Jane Smith', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      // Add more users as needed
    ];

    return (
      <>
        <ScrollView style={styles.tabContent}>
          <View style={styles.archived}>
          <TouchableOpacity  style={styles.userItem}>
              <View style={[styles.profileImageContainer]}>
                <View style={[styles.profileImage, {backgroundColor:'transparent'}]}>
                  <MaterialCommunityIcons name="archive" size={24} color="black" />
                </View>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Archived</Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.time}>3</Text>
              </View>
              
            </TouchableOpacity>
            
          </View>
          {users.map((user, index) => (
            <TouchableOpacity key={user.id} style={[styles.userItem, index===users.length - 1 ? {marginBottom: 20}:null]}>
              <View style={[styles.profileImageContainer, user.hydrogenAtom && styles.hydrogenAtomProfileImageContainer]}>
                <View style={styles.profileImage}>
                  {user.hydrogenAtom && <View style={styles.hydrogenAtomDecoration}><Text style={styles.messageCount}>{user.messageCount}</Text></View>}
                  {/* Add image component if you want to include user images */}
                </View>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userMessage}>{user.message}</Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.time}>{user.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="add" size={24} color="black" /> 
        </TouchableOpacity>
      </>
    );
  }




const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "red",
      
    },
    archived: {
      height: 50,
      marginBottom: 10,
    },
    addButton: {
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 5,
      position: 'absolute',
      bottom: '10%',
      left: '80%',
    },
    upperBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      backgroundColor: '#ddd',
      height: 50,
      top: 20,
    },
    iconButton: {
      padding: 10,
    },
    sectionBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#ddd',
      height: 50,
    },
    tab: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      backgroundColor: 'lightgray',
    },
    content: {
      flex: 1,
      top: 23,
    },
    tabContent2: {
      marginTop: 5,
      borderTopRightRadius: 40,
      borderTopLeftRadius: 40,
    },
    tabContent: {
      backgroundColor: '#f0f0f0',
      flex: 1,
      padding: 10,
      marginBottom:23,
    },
    userItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    profileImageContainer: {
      marginRight: 10,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      position: 'relative',
      backgroundColor: 'lightblue', // Default background color for profile image
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    hydrogenAtomProfileImageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    hydrogenAtomDecoration: {
      position: 'absolute',
      top: -5,
      right: -5,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center',
    },
    messageCount: {
      color: 'white',
      fontWeight: 'bold',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    userMessage: {
      color: 'gray',
    },
    timeContainer: {
      marginLeft: 10,
      alignItems: 'flex-end',
    },
    time: {
      fontWeight: 'bold',
      fontSize: 12,
      color: 'blue',
    },
    
  });