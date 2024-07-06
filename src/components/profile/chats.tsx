import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../constants/Urls';
import ChatTheme from '../../constants/popups/chatTheme';

export default function Chat({ visible, onClose }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [themePopupVisible, setThemePopupVisible] = useState(false); // State for theme popup
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const handleModalSubmit = (option) => {
    setSelectedOption(option);
    console.log(option)
    setThemePopupVisible(false);
};

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Create New </Text>
          <TouchableOpacity style={styles.createButton}>
            <Text style={{color:'white'}}>Save</Text>
          </TouchableOpacity>
        </View>
        <>
          
          
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.Title}>Display</Text>
              <View style={styles.body}>
                <TouchableOpacity style={styles.bodyItem} onPress={() => setThemePopupVisible(true)}>
                  <View style={styles.bodyItemIcon}>
                  {/* <Ionicons name="ios-moon" size={24} color="black" /> */}
                  <Ionicons name="ios-sunny" size={24} color="black" />

                  </View>
                    <View style={styles.bodyItemTextContainer}>
                      <View style={styles.bodyItemText}>
                        <Text style={styles.topText}>Theme</Text>
                        <Text style={styles.bottomText}>System default</Text>
                    </View>
                  </View>
                  
                </TouchableOpacity>
                <TouchableOpacity style={styles.bodyItem}>
                  <View style={styles.bodyItemIcon}>
                  <MaterialCommunityIcons name="image" size={24} color="black" />
                  </View>
                  <View style={styles.bodyItemTextContainer}>
                    <View style={styles.bodyItemText}>
                      <Text style={styles.topText}>Wallpaper</Text>
                    </View>
                  </View>
                  
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.Title}>Chat settings</Text>
              <View style={styles.body}>
                <TouchableOpacity style={styles.bodyItem}>
                  <View style={styles.bodyItemIcon}>

                  </View>
                    <View style={styles.bodyItemTextContainer}>
                      <View style={styles.bodyItemText}>
                        <Text style={styles.topText}>Enter is send</Text>
                        <Text style={styles.bottomText}>Enter key will send your message</Text>
                      </View>
                      <View style={styles.Tugglecontainer}>
                        <Switch
                          trackColor={{ false: "#767577", true: "#81b0ff" }}
                          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={toggleSwitch}
                          value={isEnabled}
                        />
                      </View>
                    </View>
                  
                </TouchableOpacity>
                <TouchableOpacity style={styles.bodyItem}>
                  <View style={styles.bodyItemIcon}>
                  </View>
                  <View style={styles.bodyItemTextContainer}>
                    <View style={styles.bodyItemText}>
                      <Text style={styles.topText}>Media Visibility</Text>
                      <Text style={styles.bottomText}>Show newly downloaded media in your device's gallery</Text>
                    </View>
                    <View style={styles.Tugglecontainer}>
                      <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                      />
                    </View>
                  </View>
                  
                </TouchableOpacity>
                <TouchableOpacity style={styles.bodyItem}>
                  <View style={styles.bodyItemIcon}>

                  </View>
                    <View style={styles.bodyItemTextContainer}>
                      <View style={styles.bodyItemText}>
                        <Text style={styles.topText}>Font size</Text>
                        <Text style={styles.bottomText}>Medium</Text>
                    </View>
                  </View>
                  
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.Title}>Archived chats</Text>
              <View style={styles.body}>
              <TouchableOpacity style={styles.bodyItem}>
                  <View style={styles.bodyItemIcon}>
                  </View>
                  <View style={styles.bodyItemTextContainer}>
                    <View style={styles.bodyItemText}>
                      <Text style={styles.topText}>Keep chats archived</Text>
                      <Text style={styles.bottomText}>Show newly downloaded media in your device's gallery</Text>
                    </View>
                    <View style={styles.Tugglecontainer}>
                      <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                      />
                    </View>
                  </View>
                  
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.body}>
                <TouchableOpacity style={styles.bodyItem}>
                  <View style={styles.bodyItemIcon}>
                  <Ionicons name="cloud-outline" size={24} color="black" />
                  </View>
                    <View style={styles.bodyItemTextContainer}>
                      <View style={styles.bodyItemText}>
                        <Text style={styles.topText}>Chat backup</Text>
                    </View>
                  </View>
                  
                </TouchableOpacity>
                <TouchableOpacity style={styles.bodyItem}>
                  <View style={styles.bodyItemIcon}>
                  <Ionicons name="ios-phone-portrait-outline" size={24} color="black" />



                  <Ionicons style={{position: 'absolute', marginLeft: 10,}} name="arrow-forward-outline" size={16} color="black" />
                  </View>
                  <View style={styles.bodyItemTextContainer}>
                    <View style={styles.bodyItemText}>
                      <Text style={styles.topText}>Transfer chats</Text>
                    </View>
                  </View>
                  
                </TouchableOpacity>
                <TouchableOpacity style={styles.bodyItem}>
                  <View style={styles.bodyItemIcon}>
                  <Ionicons name="time-outline" size={24} color="black" />
                  </View>
                  <View style={styles.bodyItemTextContainer}>
                    <View style={styles.bodyItemText}>
                      <Text style={styles.topText}>Chat history</Text>
                    </View>
                  </View>
                  
                </TouchableOpacity>
              </View>
            </View>
            
          </ScrollView>
        </>
      </View>
      <ChatTheme
        visible={themePopupVisible}
        onClose={() => setThemePopupVisible(false)}
        onSubmit={handleModalSubmit}
        title="Select Theme"
        // message="Please select a theme:"
        options={['System default', 'Light', 'Dark']}
      />
    </Modal>
  );
}


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    height: '91%',
  },
  section: {
    flexDirection: 'column',
    borderBottomWidth: 0.3,
    borderBottomColor: '#000',
    padding: 15,

  },
  Title: {
    color: 'gray',
    marginBottom: 10,
  },
  body: {
   flexDirection: 'column',
  },
  bodyItemTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  bodyItem: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 5,
  },
  bodyItemIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '9%',
  },
  bodyItemText: {
    flexDirection: 'column',
    marginLeft: 20,
    width: "70%",
  },
  topText: {
    color: '#000',
  },
  bottomText: {
    color: 'gray',
  },
  Tugglecontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  backButtonContainer: {
    padding: 10,
    paddingBottom: -10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: '#000',
  },
  backButton: {
    position: 'relative',
    top: 10,
    left: 0,
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 20,
  },
  createButton: {
    backgroundColor: '#36393f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: 60,
    height: 50,
    marginRight: 10,
    marginTop: 8,
    justifyContent: 'center',
  },
});
