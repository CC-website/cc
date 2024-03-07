import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons , Entypo} from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { main_url } from '../../constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ErrorMessage, SuccessMessage } from '../../constants/Message/message1';


export default function AddUsers({ visible, onClose, channelName, ChannelId, name }) {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [keyboardType, setKeyboardType] = useState('default');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownAddUserVisible, setIsDropdownAddUserVisible] = useState(false);
  const [processedData, setProcessedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [canAddUser, setcanAddUser] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const [selecteditems, setSelecteditems] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessageModal, setSuccessMessageModal] = useState(false);
  const [errorMessageModal, setErrorMessageModal] = useState(false);
  const [multiSelect, setMultiSelect] = useState(false);

  const handleKeyboardSwitch = () => {
    setKeyboardType(prevType => prevType === 'numeric' ? 'default' : 'numeric');
  };

  useEffect(() => {
    fetchContactsAndUsers();
  }, []);

  const fetchContactsAndUsers = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync();
        setContacts(data);
        GetUsers(data);
      } else {
        console.log('Permission to access contacts was denied');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const GetUsers = async (contacts) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${main_url}/user/get-users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contacts }),
      });
      if (response.ok) {
        const data = await response.json();
        setProcessedData(data);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSearchButtonClick = () => {
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setSearchQuery('');
  };

  const handleBackgroundPress = () => {
    if (isSearching) {
      handleClearSearch();
    }
  };

  const handleRefresh = () => {
    setIsDropdownVisible(false);
    GetUsers(contacts);
  };

  const filterContacts = (data, query) => {
    if (!data) return []; // Add a safeguard to handle undefined data
    return data.filter();
};


const addMember = async () => {
  if (channelName.trim() !== '') {
    try {
      const url = main_url + '/api/channels/add_members/';
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);

      // Create FormData object to send data including image
      const formData = new FormData();
      formData.append('name', channelName);
      formData.append('channel_id', ChannelId);

      // Append selected contact IDs to the form data
      selectedContactIds.forEach(id => {
        formData.append('selectedContactIds', id);
      });

      // Make a POST request with FormData and appropriate headers
      if (token) {
        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + jsonObject.access
          }
        });

        // Handle the response as needed
        console.log(response.data);
        setSuccessMessageModal(true)
        setSuccessMessage(response.data.message)
        setMultiSelect(false)
        setSelectedContactIds([])
        setcanAddUser(false)
        setSelecteditems(false)
      } else {
        console.error('No token found');
      }
    } catch (error) {
      // Handle error
      console.error(error);
      alert('Error creating channel. Please try again.');
    }

    // Reset form fields and close the modal
    setIsDropdownAddUserVisible(false)
  }
};

const removeSelect = () =>{
  setMultiSelect(false)
  setSelectedContactIds([])
  setcanAddUser(false)
  setSelecteditems(false)
}
const HandleNo = () =>{
  setSelectedContactIds([]);
  setIsDropdownAddUserVisible(false);
}

  const renderContacts = () => {
    // Initialize dataToRender as an empty array
    let dataToRender = [];
  
    // Check if processedData is available
    if (!processedData || processedData.length === 0) {
      // If processedData is not available or empty, render a message
      return (
        <View style={styles.userContainer}>
          <Text style={styles.contactName}>No contacts to display</Text>
        </View>
      );
    }
  
    // Proceed with rendering the contacts
    if (searchQuery) {
      const filteredContacts = filterContacts(processedData, searchQuery);
      dataToRender = filteredContacts;
    } else {
      dataToRender = processedData;
    }

  

  const selectNumber = (contactId, about) =>{
    // setSelectedContactIds([])
    // setMultiSelect(false)
    
    if(multiSelect){
      if(about == 'Sorry I am not on CC.'){
        setcanAddUser(false)
        setIsDropdownAddUserVisible(true)
      }else{
              setSelectedContactIds(prevIds => {
                if (prevIds.includes(contactId)) {
                  // If selected, remove it from the selected list
                  return prevIds.filter(id => id !== contactId);
                } else {
                  // If not selected, add it to the selected list
                  return [...prevIds, contactId];
                }
              });
              console.log("=============Nigel===============",selectedContactIds)
              
              
            }
    }else{
      if(about == 'Sorry I am not on CC.'){
        setcanAddUser(false)
        setIsDropdownAddUserVisible(true)
      }else{
        setSelectedContactIds([contactId])
        setcanAddUser(true)
        setIsDropdownAddUserVisible(true)
      }
    }
    
    
  }


  const selectNumbers = (contactId, about) => {
    // Check if the contactId is already selected
    if(about == 'Sorry I am not on CC.'){
      setcanAddUser(false)
      setIsDropdownAddUserVisible(true)
    }else{
          setSelectedContactIds(prevIds => {
            if (prevIds.includes(contactId)) {
              // If selected, remove it from the selected list
              return prevIds.filter(id => id !== contactId);
            } else {
              // If not selected, add it to the selected list
              return [...prevIds, contactId];
            }
          });
        setSelecteditems(true)
        setMultiSelect(true)
        console.log("=============Nigel===============",selectedContactIds)
      }
    
  };
  

  console.log(channelName)
  console.log(ChannelId)
  console.log(name)
    return dataToRender.data.map(contact =>
      <View key={contact.id} style={styles.userContainer}>
        <TouchableOpacity style={styles.contactContainer} onPress={() => selectNumber(contact.user_id, contact.about)} onLongPress={() => selectNumbers(contact.user_id, contact.about)}>
          <View style={styles.profilePic}>
            <View style={styles.profilePicontainer}>
              <Icon name="user" size={20} color="#fff" />
            </View>
            
          {selectedContactIds.includes(contact.user_id) && (
            <View style={styles.tickedContainer}>
              <Icon name="check" size={20} color="green" />
            </View>
            
          )}
          </View>
          <View style={styles.ContactText}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={{ color: 'gray' }}>{contact.about}</Text>
          </View>
        </TouchableOpacity>
    </View>
    

      )
  };
  


  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <>
        <Modal transparent visible={visible} animationType="slide">
          <View style={styles.modalContainer}>
          {selecteditems? (
              <View style={styles.backButtonContainer}>
                <TouchableOpacity style={styles.backButton} onPress={removeSelect}>
                  <Icon name="arrow-left" size={18} color="#fff" />
                </TouchableOpacity>
                <View style={{width: '65%'}}>
                  <Text style={styles.modalTitle}>Adding {selectedContactIds.length} user{selectedContactIds.length >1? 's':''} to {channelName}</Text>
                </View>
                <TouchableOpacity style={styles.createButton} onPress={addMember}>
                  <Ionicons name="add-circle-outline" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            ) :
              !isSearching ? (
              <View style={styles.backButtonContainer}>
                <TouchableOpacity style={styles.backButton} onPress={onClose}>
                  <Icon name="arrow-left" size={18} color="#fff" />
                </TouchableOpacity>
                <View>
                  <Text style={styles.modalTitle}>Add New User</Text>
                  <Text style={styles.numberOfContacts}>{contacts.length} Contacts</Text>
                </View>
                <View style={styles.createButtonsContainer}>
                  <TouchableOpacity style={styles.searchButton} onPress={handleSearchButtonClick}>
                    <Ionicons name="search" size={24} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.moreButton} onPress={() => setIsDropdownVisible(true)}>
                      <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.searchContainer}>
                  <TouchableOpacity style={styles.backButton} onPress={handleBackgroundPress}>
                      <Icon name="arrow-left" size={18} color="#fff" />
                  </TouchableOpacity>
                  <TextInput
                      style={styles.searchInput}
                      placeholder="Search by name"
                      value={searchQuery}
                      onChangeText={(text) => {
                          setSearchQuery(text);
                          // Filter processedData directly
                          const filteredContacts = filterContacts(processedData, text);
                          setProcessedData(filteredContacts); // Update the state with filtered contacts
                      }}
                      keyboardType={isSearching ? keyboardType : 'default'}
                  />



                  <View style={styles.keyboardSwitchButtons}>
                      <TouchableOpacity onPress={handleKeyboardSwitch}>
                      {keyboardType === 'numeric' ? (
                          <Entypo name="keyboard" size={24} color="#fff" />
                      ) : (
                          <Ionicons name="keypad" size={24} color="#fff" />
                      )}
                      </TouchableOpacity>
                  </View>
              </View>
            )}
            {isLoading ? (
              <View style={styles.modalContent}>
                <ActivityIndicator color="#fff" size="large" style={{marginTop: 20}} />
              </View>
              
            ) : (
              <ScrollView
                style={styles.modalContent}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                {renderContacts()}
              </ScrollView>
            )}
            
          </View>
        </Modal>
        {isDropdownVisible && (
          <Modal transparent visible={isDropdownVisible} animationType="slide">
            <TouchableOpacity style={styles.dropdownOverlay} onPress={() => setIsDropdownVisible(false)} />
            <View style={styles.dropdownMenu}>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => console.log('Invite a Friend')}>
                <Text style={styles.dropdownItemText}>Invite a Friend</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={handleRefresh}>
                <Text style={styles.dropdownItemText}>Refresh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => console.log('Help')}>
                <Text style={styles.dropdownItemText}>Help</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}

        {isDropdownAddUserVisible && (
          <Modal transparent visible={isDropdownAddUserVisible} animationType="slide">
            <TouchableOpacity style={styles.dropdownOverlay} onPress={() => setIsDropdownAddUserVisible(false)} />
            <View style={styles.adduserdropdownMenu}>
             {canAddUser ? canAddUser &&(
              <View>
                <Text style={styles.modalTitle}>
                  Are you sure you want to add this user to this {name}?
                </Text>
                <View style = {styles.acceptButton}>
                  <TouchableOpacity style={styles.dropdownItem} onPress={addMember}>
                    <Text style={styles.dropdownItemText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={HandleNo }>
                    <Text style={styles.dropdownItemText}>NO</Text>
                  </TouchableOpacity>
                </View>
              </View>

             ): (
              <View>
                <Text style={styles.modalTitle}>
                  Sorry this user has no account on CC.
                </Text>
                <TouchableOpacity style={styles.closeButton}  onPress={() => setIsDropdownAddUserVisible(false)}>
                  <Text style={styles.smallText}>Close</Text>
                </TouchableOpacity>
              </View>
              
             )}
            </View>
          </Modal>
        )}
        {successMessageModal && 
        (
        <Modal transparent visible={successMessageModal} animationType="slide">
           <TouchableOpacity style={styles.dropdownOverlay} onPress={() => setIsDropdownAddUserVisible(false)} />
            <View style={[styles.adduserdropdownMenuMessage,  {backgroundColor:'transparent'}]}>
              <SuccessMessage message={successMessage} onClose={() => setSuccessMessageModal(false)} />
            </View>
        </Modal>
        )}
        {errorMessageModal && 
        (
        <Modal transparent visible={errorMessageModal} animationType="slide">
          <TouchableOpacity style={styles.dropdownOverlay} onPress={() => setIsDropdownAddUserVisible(false)} />
            <View style={[styles.adduserdropdownMenuMessage,  {backgroundColor:'transparent'}]}>
              <ErrorMessage message={errorMessage} onClose={() => setErrorMessageModal(false)} />
            </View>
        </Modal>
        )}
      </>
    </TouchableWithoutFeedback>
  );
}



const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
  },
  refreshButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
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
  // modalContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#202020',
  // },
  backButton: {
    padding: 10,
  },
  userContainer: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    marginBottom: 15,
  },
  modalContent: {
    backgroundColor: '#202020',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: '91.5%', // Adjusted height for search input
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  numberOfContacts: {
    color: 'gray',
    fontSize: 12,
  },
  backButtonContainer: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#fff',
  },
  createButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: '#36393f',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  moreButton: {
    backgroundColor: '#36393f',
    padding: 10,
    borderRadius: 5,
  },
  contactName: {
    color: 'white',
  },
  profilePic: {
    borderRadius: 50,
    height: 50,
    width: 50,
    backgroundColor: '#36393f',
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'black',
  },  
  profilePicontainer : {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 50, 
  },
  contactContainer: {
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ContactText: {
    flexDirection: 'column',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 5,
    borderRadius: 40,
    backgroundColor: '#36393f',
    alignItems: 'center'
  },
  searchInput: {
    backgroundColor: '#36393f',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: 'white',
    width: '74%',
  },
  keyboardSwitchButtons: {
    flexDirection: 'row',
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  acceptButton: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 70,
    right: 10,
    backgroundColor: '#36393f',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 200,
  },
  adduserdropdownMenuMessage: {
    position: 'absolute',
    top: 20,
    right: 2,
    backgroundColor: '#36393f',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: "60%",
    height: "20%",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  adduserdropdownMenu: {
    position: 'absolute',
    top: 170,
    right: 40,
    backgroundColor: '#36393f',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: "60%",
    height: "20%",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: '#ddd',
  },
  dropdownItemText: {
    color: 'white',
    fontSize: 16,
  },
  tickedContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 50,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    marginTop: 25,
    marginLeft: 25,
    zIndex: 1,
    width: 30,
    height: 30,
    backgroundColor: '#36393f',
  },
  closeButton: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    padding: 5, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallText: {
    color: 'white'
  },
});
