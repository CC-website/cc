import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';

export default function Groupe({ visible, onClose, setShowBottomBar }) {
  const [slideAnim] = useState(new Animated.Value(400));
  const [openby, setOpenby] = useState(0);

  useEffect(() => {
    console.log(visible)
    if (visible) {
      setShowBottomBar(false); // Hide the bottom bar when the modal is visible
      if (openby === 1) {
        Animated.timing(slideAnim, {
          toValue: 308,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (openby === 0) {
        Animated.timing(slideAnim, {
          toValue: 308,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } else {
      setShowBottomBar(true); // Show the bottom bar when the modal is hidden
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        slideAnim.setValue(400);
      });
    }
  }, [visible]);


  useEffect(() => {
    if (visible) {
      setShowBottomBar(false); // Hide the bottom bar when the modal is visible
      // Your existing animation code...
    } else {
      setShowBottomBar(true); // Show the bottom bar when the modal is hidden
      // Your existing animation code...
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(400);
      setShowBottomBar(true); // Show the bottom bar when the modal is closed
      Animated.timing(slideAnim, {
        toValue: 308,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setOpenby(0);
    });
  };

  const handelSetOpenby = () => {
    setOpenby(1);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
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
        <Text style={styles.modalTitle}>Create New Group</Text>
        <TouchableOpacity style={styles.createButton} onPress={() => handleClose()}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Add your modal content here */}
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
});
