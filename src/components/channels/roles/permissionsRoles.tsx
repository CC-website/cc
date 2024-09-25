import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, ScrollView, TextInput, Switch, useColorScheme } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Permissionspermission from './permissions';
import PermissionsMembers from './permissionsMembers';
import ConfirmationPopup from '../../../constants/ConfirmationPopup';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { community } from '../../../constants/StaticData/en.json';
import { ThemeColors } from '../../../constants/thems';

export default function PermissionsRoles({ visible, onClose, setOverview, permissions, allPermission, target_type }) {
    
    const [openPermissionModal, setOpenPermissionModal] = useState(false);
    const [openMembersModal, setOpenMembersModal] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [OldroleName, setOldRoleName] = useState('');
    const [allowMention, setAllowMention] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [permissionType, setPermissionType] = useState('No Data');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const scheme = useColorScheme();
    const themeColors = ThemeColors[scheme];


    useEffect(() => {
        console.log(permissions)
        if (permissions.length > 0) {
            const permissionType = permissions[0].permission_type;
            const allUsers = permissions[0].all_members
            setPermissionType(permissionType);
            setRoleName(permissionType);
            setOldRoleName(permissionType)
            setAllowMention(allUsers)
        }
        
    }, [permissions]);


    const handelOpenPermissionModal = () =>{
        setOpenPermissionModal(true);
    }

    const handelClosePermissionModal = () =>{
        setOpenPermissionModal(false);
    }
    const handelopenMembersModal = () =>{
        if(target_type === 'community'){
            fetchUsers();
        }else{
            if(target_type === 'sub-community'){
                fetchSubChannelUsers();
            }else{
                if(target_type === 'group'){
                    fetchGroupUsers();
                }
            }
        }
        setOpenMembersModal(true);
    }
    const handelCloseMembersModal = () =>{
        setOpenMembersModal(false);
    }

    const handleDeleteRole = () => {
        deletePermission()
        setShowDeleteConfirmation(true);
    };

    const confirmDeleteRole = () => {
        // Add your logic to delete the role here
        onClose(); // Close the modal after deletion
        setShowDeleteConfirmation(false);
    };

    const cancelDeleteRole = () => {
        setShowDeleteConfirmation(false);
    };


    const fetchUsers = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          const jsonObject = JSON.parse(token);
    
          if (token) {
            console.log(`${main_url}/api/channels/${setOverview.id}/members/`);
            const response = await axios.get(`${main_url}/api/channels/${setOverview.id}/members/`, {
              headers: {
                'Authorization': 'Bearer ' + jsonObject.access
              }
            });
            setSelectedMembers(response.data.members);
          } else {
            console.error('No token found');
          }
        } catch (error) {
          console.log('Error fetching users 111111:', error);
        }
      };


      const fetchSubChannelUsers = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const jsonObject = JSON.parse(token);
            if (jsonObject) {
                const response = await axios.get(`${main_url}/api/subchannels/${setOverview.id}/members/`, {
                    headers: {
                        'Authorization': 'Bearer ' + jsonObject.access
                    }
                });
                 setSelectedMembers(response.data.members.map(member => ({ ...member, selected: false })));
            } else {
                console.log('No token found');
            }
        } catch (error) {
            console.log('Error fetching users:', error);
        }
    };

    const fetchGroupUsers = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const jsonObject = JSON.parse(token);
            if (jsonObject) {
                const response = await axios.get(`${main_url}/api/groups/${setOverview.id}/members/`, {
                    headers: {
                        'Authorization': 'Bearer ' + jsonObject.access
                    }
                });
                setSelectedMembers(response.data.members.map(member => ({ ...member, selected: false })));
            } else {
                console.log('No token found');
            }
        } catch (error) {
            console.log('Error fetching users:', error);
        }
    };


    const updateRole = async () => {
        try {
            const formData = {
                'permission_type': roleName,
                'old_permission_type': OldroleName,
                'all_users': allowMention,
                'permission_assignment_id':permissions[0].id,
                'target_id': setOverview.id,
                'target_type': target_type
            };
            console.log(formData);
            
            const url = `${main_url}/api/permissions/assign/`;
            const token = await AsyncStorage.getItem('userToken');
            const jsonObject = JSON.parse(token);
        
            if (token) {
                const response = await axios.put(url, formData, {
                    headers: {
                      'Authorization': 'Bearer ' + jsonObject.access
                    }
                  });
            }
            onClose();
        } catch (error) {
            console.log("An error occurred during update:", error);
        }
    };


    const deletePermission = async () => {
        try {
            const formData = {
                'permission_assignment_id': permissions[0].id, // This matches the backend delete requirement
            };
    
            const url = `${main_url}/api/permissions/assign/`;
            const token = await AsyncStorage.getItem('userToken');
            const jsonObject = JSON.parse(token);
    
            if (token) {
                // Perform the DELETE request with Authorization header
                const response = await axios.delete(url, {
                    headers: {
                        'Authorization': 'Bearer ' + jsonObject.access,
                        'Content-Type': 'application/json', // Set content type as JSON
                    },
                    data: formData, // Pass form data as 'data' when using DELETE method
                });
    
                console.log(response.data); // Optional: Log the response data
            }
    
            onClose();
        } catch (error) {
            console.log("An error occurred during deletion:", error);
        }
    };
    
    

    return (
        <Modal style={{ backgroundColor: themeColors.background }} transparent visible={visible} animationType="slide">
            <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
                <View style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
                    <View style={styles.backButtonContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={onClose}>
                            <Ionicons name="arrow-back" size={24} style={{ color: themeColors.text }} />
                        </TouchableOpacity>
                        <Text style={[styles.modalTitle, { color: themeColors.text }]}>{setOverview.name}</Text>
                        <TouchableOpacity style={styles.createButton} onPress={updateRole}>
                            <Text style={{ color: themeColors.text }}>{community.settings.members.save}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.Rolenamecontainer, { backgroundColor: themeColors.background }]}>
                        <Text style={[styles.sectionSubTitle, { color: themeColors.text }]}>{community.settings.members.role_name}</Text>
                        <TextInput
                            style={styles.inputField}
                            placeholder="Role Name"
                            value={roleName}
                            onChangeText={text => setRoleName(text)}
                        />
                    </View>
                    <View style={styles.allowMentionContainer}>
                        <Text style={[styles.sectionSubTitle, { color: themeColors.text }]}>{community.settings.members.allow_anyone}</Text>
                        <Switch
                            value={allowMention}
                            onValueChange={value => setAllowMention(value)}
                        />
                    </View>
                    <View style={[styles.section]}>
                        <View style={styles.spliter}></View>
                        {/* Everyone Permissions Section */}
                        <ScrollView>
                            {/* Add your content here */}
                        </ScrollView>
                    </View>
                    <View style={styles.bottomButtonsContainer}>
                        
                       
                            <TouchableOpacity style={[styles.bottomButton1, { backgroundColor: themeColors.card }]} onPress={handelOpenPermissionModal}>
                                <Text style={[styles.bottomButtonText, { color: themeColors.text }]}>{community.settings.members.permissions}</Text>
                                <MaterialCommunityIcons name="chevron-right" size={24} style={{ color: themeColors.text }} />
                            </TouchableOpacity>
                       
                            <TouchableOpacity style={[styles.bottomButton2, { backgroundColor: themeColors.card }]} onPress={handelopenMembersModal}>
                                <Text style={[styles.bottomButtonText, { color: themeColors.text }]}>{community.settings.members.members}</Text>
                                <MaterialCommunityIcons name="chevron-right" size={24} style={{ color: themeColors.text }} />
                            </TouchableOpacity>
                       

                        
                    </View>
                    <View style={styles.deleteButtonContainer}>
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteRole}>
                            <Text style={styles.deleteButtonText}>{community.settings.members.delete_role}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Permissionspermission
                visible={openPermissionModal}
                onClose={handelClosePermissionModal}
                setOverview={setOverview}
                permissions={permissions}
                allPermission = {allPermission}
            />
            <PermissionsMembers
                visible={openMembersModal}
                onClose={handelCloseMembersModal}
                setOverview={setOverview}
                permissions={permissions}
                allMembers = {selectedMembers}
            />

            <ConfirmationPopup
                visible={showDeleteConfirmation}
                onClose={cancelDeleteRole}
                onConfirm={confirmDeleteRole}
                message="Are you sure you want to delete this role?"
            />
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#202020',
    },
    modalContent: {
        width: '100%',
        height: '100%',
    },
    section: {
        overflow: 'hidden',
        paddingLeft: 20,
        backgroundColor: '#202020',
        borderRadius: 10,
        marginTop: 20,
    },
    sectionSubTitle: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10,
    },
    Rolenamecontainer: {
        marginTop: 20,
        padding: 20,
    },
    allowMentionContainer: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    createButton: {
        backgroundColor: '#36393f',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: 60,
        height: 50,
        marginTop: 8,
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 18,
        width: '60%',
        fontWeight: 'bold',
        marginBottom: 30,
        color: 'white',
        marginTop: 20,
        textAlign: 'center',
    },
    backButton: {
        position: 'relative',
        top: 10,
        left: 0,
        padding: 10,
    },
    spliter: {
        height: 0.3,
        width: '100%',
        backgroundColor: 'rgba(169, 169, 169, 0.1)',
    },
    backButtonContainer: {
        padding: 10,
        paddingBottom: -10,
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 0.3,
        borderBottomColor: ThemeColors.text,
        justifyContent: 'space-between'
    },
    bottomButtonsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    bottomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#36393f',
        padding: 10,
        borderTopEndRadius: 5,
        borderTopLeftRadius: 5,
        borderBottomWidth: .4,
        borderBottomColor: ThemeColors.text,
        justifyContent: 'space-between',
    },
    bottomButton1: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#36393f',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'space-between',
    },
    bottomButton2: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#36393f',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        justifyContent: 'space-between',
    },
    bottomButtonText: {
        color: 'white',
        marginRight: 10,
    },
    deleteButtonContainer: {
        width: '100%',
        padding: 20,
        marginTop: 20,
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
    },
    inputField: {
        backgroundColor: '#36393f',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        color: 'white',
    },
});
