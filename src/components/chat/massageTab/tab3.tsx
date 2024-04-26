import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';
import DynamicCircularBorder from '../../../constants/DynamicCircularBorder';
import Circle from '../../../constants/test_circle';





export default function Screen3() {
    const users = [
      { id: 1, name: 'John Doe 1', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: true, messageCount: 5, postCount: 3 },
      { id: 2, name: 'Jane Smith 2', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3, postCount: 2 },
      { id: 3, name: 'John Doe 3', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5, postCount: 3 },
      { id: 4, name: 'Jane Smith 4', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3, postCount: 2 },
      { id: 5, name: 'John Doe 5', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5, postCount: 3 },
      { id: 6, name: 'Jane Smith 6', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3, postCount: 2 },
      { id: 7, name: 'John Doe 7', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5, postCount: 3 },
      { id: 8, name: 'Jane Smith 8', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3, postCount: 2 },
      { id: 9, name: 'John Doe 9', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5, postCount: 3 },
      { id: 10, name: 'Jane Smith 10', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3, postCount: 2 },
      { id: 11, name: 'John Doe 11', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5, postCount: 3 },
      { id: 12, name: 'Jane Smith 12', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3, postCount: 2 },
      { id: 13, name: 'John Doe 13', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5, postCount: 3 },
      { id: 14, name: 'Jane Smith 14', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3, postCount: 2 },
      { id: 15, name: 'John Doe 15', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5, postCount: 3 },
      { id: 16, name: 'Jane Smith 16', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3, postCount: 2 },
      { id: 17, name: 'John Doe 17', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5, postCount: 3 },
      { id: 18, name: 'Jane Smith 18', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3, postCount: 2 },
      { id: 19, name: 'John Doe 19', message: 'Hello there!', time: '10:30 AM', hydrogenAtom: false, messageCount: 5, postCount: 3 },
      { id: 20, name: 'Jane Smith 20', message: 'Good morning!', time: '9:45 AM', hydrogenAtom: true, messageCount: 3, postCount: 2 },
    ];
    
    const [scrollX, setScrollX] = useState(0);
    const scrollViewRef = useRef(null);
  
    const onGestureEvent = ({ nativeEvent }) => {
      const { translationX } = nativeEvent;
      scrollViewRef.current.scrollTo({ x: scrollX - translationX, animated: false });
    };
  
    const onScroll = (event) => {
      setScrollX(event.nativeEvent.contentOffset.x);
    };
  
    return (
      <>
      <ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        style={styles.sectionBody}
        contentContainerStyle={{ paddingRight: 16 }} // Adjust the paddingRight to match the width of your content
      >
        <View style={styles.archived}>
          <TouchableOpacity style={styles.userItem}>
            <View style={[styles.profileImageContainer]}>
              <View style={[styles.profileImage, { backgroundColor: 'transparent' }]}>
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
          <TouchableOpacity 
            style={[styles.callContainer, index === users.length - 1 ? { marginBottom: 30 } : null]} 
            key={user.id}
          >
            <View style={[styles.post, { borderColor: user.hydrogenAtom ? 'royalblue' : 'gray' }]}>
              <View style={styles.postImageContainer}>
                <View style={styles.container}>
                  <View style={styles.circle}></View>
                </View>
                <View style={styles.hydrogenAtomDecoration}>
                  <Text style={styles.messageCount}>{user.messageCount}</Text>
                </View>
                <View style={styles.hydrogenAtomDecoration2}>
                  <Text style={styles.messageCount}>{user.messageCount}</Text>
                </View>
              </View>
              <View style={styles.postCount}>
                <Text style={styles.postUserName}>{user.name}</Text>
                <Text style={styles.postUserName}>{user.name}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.postUserName}>{user.time}</Text>
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
    // tab 3 
    archived: {
      height: 50,
      marginBottom: 10,
    },
    messageCount: {
      color: 'white',
      fontWeight: 'bold',
    },
    semiCircle: {
      position: 'absolute',
      width: 20,
      height: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomWidth: 2,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderColor: 'royalblue', // Adjust the color as needed
      transform: [{ rotate: '45deg' }], // Adjust the rotation angle as needed
    },
    hydrogenAtomDecoration: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'gray',
      justifyContent: 'center',
      alignItems: 'center',
    },
    hydrogenAtomDecoration2: {
      position: 'absolute',
      top: 40,
      right: 40,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'royalblue',
      justifyContent: 'center',
      alignItems: 'center',
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
    time: {
      fontWeight: 'bold',
      fontSize: 12,
      color: 'blue',
    },
    timeContainer: {
      marginLeft: 10,
      alignItems: 'flex-end',
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
    profileImageContainer: {
      marginRight: 10,
    },
    userItem: {
      flexDirection: 'row',
      alignItems: 'center',
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
    callContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tabContent: {
      backgroundColor: '#f0f0f0',
      flex: 1,
      padding: 10,
      paddingTop: 20,
    },
    section: {
      marginBottom: 20,
    },
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginBottom: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    sectionHeaderText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    sectionHeaderButton: {
      backgroundColor: 'blue',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    sectionHeaderButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    sectionBody: {
      backgroundColor: '#f0f0f0',
      paddingTop: 30,
      paddingBottom: 30,
      marginBottom: 20,
    },
    // tab 3 section 1
  
   post: {
      marginRight: 10,
      padding: 10,
      borderColor: 'transparent',
      position: 'relative',
      flexDirection:'row',
    },
    firstPost: {
      borderColor: 'gray',
    },
    postImageContainer: {
      alignItems: 'center',
      marginBottom: 5,
      height:60,
      width:60,
      borderRadius: 50,
      borderWidth: 2,
    },
    plusIcon: {
      position: 'absolute',
      bottom: -10,
      right: -10,
      backgroundColor: 'royalblue',
      borderRadius: 50,
      padding: 5,
    },
    postUserName: {
      textAlign: 'center',
    },
    postCount: {
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    postCountText: {
      color: 'white',
      fontWeight: 'bold',
    },

    // // status style
    // container: {
    //   position: 'relative',
    //   width: 200, // Adjust the width and height as needed
    //   height: 200,
    // },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circle: {
      width: '100%',
      height: '100%',
      borderRadius: 100, // Half of width and height to make it a circle
      backgroundColor: 'lightblue', // Example background color
      justifyContent: 'center',
      alignItems: 'center',
    },
    borderLine: {
      position: 'absolute',
      backgroundColor: 'black', // Example border color
      height: 3, // Example border width
      width: '100%',
    },
  });
  