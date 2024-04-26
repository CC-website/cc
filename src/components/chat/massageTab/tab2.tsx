import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';


export default function Screen2() {
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

    let prevScrollY = useRef(0);

    const onScroll = (event) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      if (currentScrollY > prevScrollY.current) {
        setScroll(true)
        console.log("Tab 2 Downscroll");
      } else {
        console.log("Tab 2 Upscroll");
        setScroll(false)
      }
      prevScrollY.current = currentScrollY;
    };

    const truncateText = (text, limit) => {
      const words = text.split(' ');
      if (words.length > limit) {
        return words.slice(0, limit).join(' ') + '...';
      }
      return text;
    };
    

    // Sample user data
    const users = [
      { id: 1, name: 'John Doe', message: "To add an archived icon to your application, you can utilize an icon library like @expo/vector-icons. If you already have this library installed, you can use the MaterialCommunityIcons from it. Here's how you can add an archived icon to your upper bar:", time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 2, name: 'Jane Smith', message: "If you've already tried these steps and the issue persists, could you provide more details on how you're testing the application and any specific behavior you're observing? This information can help diagnose the problem more accurately. Ensure that you've imported MaterialCommunityIcons from '@expo/vector-icons', and then use it as shown above to add the archive icon to your upper bar. Adjust the size, color, and style of the icon as needed to fit your application's design.", time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      { id: 3, name: 'John Doe', message: "To add an archived icon to your application, you can utilize an icon library like @expo/vector-icons. If you already have this library installed, you can use the MaterialCommunityIcons from it. Here's how you can add an archived icon to your upper bar:", time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 4, name: 'Jane Smith', message: "If you've already tried these steps and the issue persists, could you provide more details on how you're testing the application and any specific behavior you're observing? This information can help diagnose the problem more accurately. Ensure that you've imported MaterialCommunityIcons from '@expo/vector-icons', and then use it as shown above to add the archive icon to your upper bar. Adjust the size, color, and style of the icon as needed to fit your application's design.", time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      { id: 5, name: 'John Doe', message: "To add an archived icon to your application, you can utilize an icon library like @expo/vector-icons. If you already have this library installed, you can use the MaterialCommunityIcons from it. Here's how you can add an archived icon to your upper bar:", time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 6, name: 'Jane Smith', message: "If you've already tried these steps and the issue persists, could you provide more details on how you're testing the application and any specific behavior you're observing? This information can help diagnose the problem more accurately. Ensure that you've imported MaterialCommunityIcons from '@expo/vector-icons', and then use it as shown above to add the archive icon to your upper bar. Adjust the size, color, and style of the icon as needed to fit your application's design.", time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      { id: 7, name: 'John Doe', message: "To add an archived icon to your application, you can utilize an icon library like @expo/vector-icons. If you already have this library installed, you can use the MaterialCommunityIcons from it. Here's how you can add an archived icon to your upper bar:", time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 8, name: 'Jane Smith', message: "If you've already tried these steps and the issue persists, could you provide more details on how you're testing the application and any specific behavior you're observing? This information can help diagnose the problem more accurately. Ensure that you've imported MaterialCommunityIcons from '@expo/vector-icons', and then use it as shown above to add the archive icon to your upper bar. Adjust the size, color, and style of the icon as needed to fit your application's design.", time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      { id: 9, name: 'John Doe', message: "To add an archived icon to your application, you can utilize an icon library like @expo/vector-icons. If you already have this library installed, you can use the MaterialCommunityIcons from it. Here's how you can add an archived icon to your upper bar:", time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 10, name: 'Jane Smith', message: "If you've already tried these steps and the issue persists, could you provide more details on how you're testing the application and any specific behavior you're observing? This information can help diagnose the problem more accurately. Ensure that you've imported MaterialCommunityIcons from '@expo/vector-icons', and then use it as shown above to add the archive icon to your upper bar. Adjust the size, color, and style of the icon as needed to fit your application's design.", time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      { id: 11, name: 'John Doe', message: "To add an archived icon to your application, you can utilize an icon library like @expo/vector-icons. If you already have this library installed, you can use the MaterialCommunityIcons from it. Here's how you can add an archived icon to your upper bar:", time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 12, name: 'Jane Smith', message: "If you've already tried these steps and the issue persists, could you provide more details on how you're testing the application and any specific behavior you're observing? This information can help diagnose the problem more accurately. Ensure that you've imported MaterialCommunityIcons from '@expo/vector-icons', and then use it as shown above to add the archive icon to your upper bar. Adjust the size, color, and style of the icon as needed to fit your application's design.", time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      { id: 13, name: 'John Doe', message: "To add an archived icon to your application, you can utilize an icon library like @expo/vector-icons. If you already have this library installed, you can use the MaterialCommunityIcons from it. Here's how you can add an archived icon to your upper bar:", time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 14, name: 'Jane Smith', message: "If you've already tried these steps and the issue persists, could you provide more details on how you're testing the application and any specific behavior you're observing? This information can help diagnose the problem more accurately. Ensure that you've imported MaterialCommunityIcons from '@expo/vector-icons', and then use it as shown above to add the archive icon to your upper bar. Adjust the size, color, and style of the icon as needed to fit your application's design.", time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      { id: 15, name: 'John Doe', message: "To add an archived icon to your application, you can utilize an icon library like @expo/vector-icons. If you already have this library installed, you can use the MaterialCommunityIcons from it. Here's how you can add an archived icon to your upper bar:", time: '10:30 AM', hydrogenAtom: false, messageCount: 5 },
      { id: 16, name: 'Jane Smith', message: "If you've already tried these steps and the issue persists, could you provide more details on how you're testing the application and any specific behavior you're observing? This information can help diagnose the problem more accurately. Ensure that you've imported MaterialCommunityIcons from '@expo/vector-icons', and then use it as shown above to add the archive icon to your upper bar. Adjust the size, color, and style of the icon as needed to fit your application's design.", time: '9:45 AM', hydrogenAtom: true, messageCount: 3 },
      // Add more users as needed
    ];
    return (
      <>
      <ScrollView style={styles.tabContent} onScroll={onScroll}>
        <View style={styles.archived}>
          <TouchableOpacity  style={styles.userItemUser}>
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
        {users.map((user,index) => (
          <TouchableOpacity key={user.id} style={[styles.userItem, index === users.length - 1? {marginBottom: 30}:null]}>
            <View style={styles.userItemUser}>
              <View style={[styles.profileImageContainer]}>
                <View style={styles.profileImage}>
                  {user.hydrogenAtom && <View style={styles.hydrogenAtomDecoration}><Text style={styles.messageCount}>{user.messageCount}</Text></View>}
                  {/* Add image component if you want to include user images */}
                </View>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
              </View>
            </View>
            <View style={styles.userItemMessage}>
              <Text style={styles.userMessage}>{truncateText(user.message, 50)}</Text>
              <View style={styles.timeContainer}>
                <Text style={styles.time}>{user.time}</Text>
              </View>
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
    },
    addButton: {
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 5,
      position: 'absolute',
      bottom: '10%',
      left: '80%',
    },
    archived: {
      height: 50,
      marginBottom: 10,
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
    tabContent: {
      backgroundColor: '#f0f0f0',
      flex: 1,
      padding: 10,
      marginBottom:23,
    },
    userItem: {
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 10,
      borderRadius: 5,
      backgroundColor:'white',
      padding: 5,
    },
    userItemUser: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      justifyContent: 'center',
    },
    userItemMessage: {
      flexDirection: 'column',
      marginBottom: 10,
      width: '100%',
    },
    profileImageContainer: {
      marginRight: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
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