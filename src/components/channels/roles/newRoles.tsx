import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView, Switch, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { community } from '../../../constants/StaticData/en.json';
import { ThemeColors } from '../../../constants/thems';

export default function NewRoles({ visible, onClose, setOverview, channelId, target_type }) {
    const [enteredRole, setEnteredRole] = useState('');
    const [selectedPermission, setSelectedPermission] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [allUsersSelected, setAllUsersSelected] = useState(false);
    const [step, setStep] = useState(1);
    const [showPermissionPopup, setShowPermissionPopup] = useState(false);
    const [showMemberPopup, setShowMemberPopup] = useState(false);
    const [showRolePopup, setShowRolePopup] = useState(false);
    const [errorPopupMessage, setErrorPopupMessage] = useState('');
    const [selectedTab, setSelectedTab] = useState('role');
    const scheme = useColorScheme();
    const themeColors = ThemeColors[scheme];

    useEffect(() => {
        fetchPermissions();
    }, []);

    useEffect(() => {
        if (step === 3) {
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
            
        }
    }, [step]);

    const fetchUsers = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const jsonObject = JSON.parse(token);
            if (jsonObject) {
                const response = await axios.get(`${main_url}/api/channels/${channelId}/members/`, {
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

    const fetchPermissions = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const jsonObject = JSON.parse(token);
            if (jsonObject) {
                const response = await axios.get(`${main_url}/api/permissions/types/?target_type=${target_type}`, {
                    headers: {
                        'Authorization': 'Bearer ' + jsonObject.access
                    }
                });
                setSelectedPermission(response.data.map(perm => ({ ...perm, selected: false })));
            } else {
                console.log('No token found');
            }
        } catch (error) {
            console.log('Error fetching permissions:', error);
        }
    };

    const handleNextStep = () => {
        if (step === 1 && enteredRole !== '') {
            setStep(2);
            handleTabChange('permissions');
        } else if (step === 2 && selectedPermission.some(perm => perm.selected)) {
            setStep(3);
            handleTabChange('members');
        } else if (enteredRole === '') {
            setErrorPopupMessage('Please enter a role name.');
            setShowRolePopup(true);
        } else {
            setErrorPopupMessage('Please select at least one permission.');
            setShowPermissionPopup(true);
        }
    };

    const handleSetPermission = async () => {
        if (selectedMembers.some(member => member.selected) || allUsersSelected) {
            const finalMembers = selectedMembers.filter(member => member.selected).map(member => member.id);
            const finalPermissions = selectedPermission.filter(perm => perm.selected).map(perm => perm.id);

            const formData = {
                ...(allUsersSelected ? { 'all_members': true } : { 'all_members': false }),
                'members': finalMembers,
                'permission': finalPermissions,
                'permission_type': enteredRole,
                'target_id': setOverview.id,
                'target_type': target_type,
            };

            const url = `${main_url}/api/permissions/assign/`;
            const token = await AsyncStorage.getItem('userToken');
            const jsonObject = JSON.parse(token);

            if (jsonObject) {
                try {
                    await axios.post(url, formData, {
                        headers: {
                            'Authorization': 'Bearer ' + jsonObject.access
                        }
                    });
                    setSelectedMembers([]);
                    setSelectedPermission([]);
                    setEnteredRole('');
                    setAllUsersSelected(false);
                    onClose();
                } catch (error) {
                    if (error.response && error.response.data && error.response.data.error) {
                        setErrorPopupMessage(error.response.data.error);
                    } else {
                        setErrorPopupMessage('Error setting permission.');
                    }
                    setShowMemberPopup(true);
                }
            }
        } else {
            setErrorPopupMessage('Please select at least one member.');
            setShowMemberPopup(true);
        }
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        if (tab === 'role') {
            setStep(1);
        } else if (tab === 'permissions') {
            setStep(2);
        } else if (tab === 'members') {
            setStep(3);
        }
    };

    const toggleAllUsers = (newValue) => {
        setAllUsersSelected(newValue);
        setSelectedMembers(selectedMembers.map(member => ({ ...member, selected: newValue })));
    };

    return (
        <Modal style={{ backgroundColor: themeColors.background }} transparent visible={visible} animationType="slide">
            <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
                <View style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
                    <View style={styles.backButtonContainer}>
                        {step > 1 && (
                            <TouchableOpacity style={styles.backButton2} onPress={() => setStep(step - 1)}>
                                <Ionicons name="arrow-back" size={24} style={{ color: themeColors.text }} />
                            </TouchableOpacity>
                        )}
                        {step <= 1 && (
                            <TouchableOpacity style={styles.backButton} onPress={onClose}>
                                <Ionicons name="arrow-back" size={24} style={{ color: themeColors.text }} />
                            </TouchableOpacity>
                        )}
                        {step < 3 && (
                            <TouchableOpacity style={styles.createButton} onPress={handleNextStep}>
                                <Ionicons name="arrow-forward" size={24} style={{ color: themeColors.text }} />
                            </TouchableOpacity>
                        )}
                        {step === 3 && (
                            <TouchableOpacity style={styles.createButton} onPress={handleSetPermission}>
                                <Ionicons name="checkmark-circle-outline" size={24} style={{ color: themeColors.text }} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity style={[styles.tab, selectedTab === 'role' && styles.selectedTab]} onPress={() => handleTabChange('role')}>
                            <Text style={[styles.tabText, { color: themeColors.text }]}>{community.settings.members.role}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tab, selectedTab === 'permissions' && styles.selectedTab]} onPress={() => handleTabChange('permissions')}>
                            <Text style={[styles.tabText, { color: themeColors.text }]}>{community.settings.members.permissions}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tab, selectedTab === 'members' && styles.selectedTab]} onPress={() => handleTabChange('members')}>
                            <Text style={[styles.tabText, { color: themeColors.text }]}>{community.settings.members.title}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.section]}>
                        <View style={styles.spliter}></View>
                    </View>
                    {step === 1 && (
                        <View style={styles.channelContainer}>
                            <View style={styles.channelContainer2}>
                                <View style={styles.mainTitleContainer}>
                                    <Text style={[styles.mainTitle, { color: themeColors.text }]}>{community.settings.members.create_role}</Text>
                                    <Text style={[styles.mainTitle2, { color: themeColors.text }]}>{community.settings.members.role_comment}</Text>
                                </View>
                                
                                <TextInput
                                    style={[styles.input, { width: "60%" }]}
                                    placeholder="Role Name"
                                    value={enteredRole}
                                    onChangeText={(text) => setEnteredRole(text)}
                                />
                            </View>
                            
                        </View>
                    )}
                    {step === 2 && (
                        <ScrollView>
                            {selectedPermission.map((perm, index) => (
                                <View key={index} style={styles.checkboxContainer}>
                                    <Switch
                                        value={perm.selected}
                                        onValueChange={(newValue) => {
                                            const updatedPerms = [...selectedPermission];
                                            updatedPerms[index].selected = newValue;
                                            setSelectedPermission(updatedPerms);
                                        }}
                                    />
                                    <Text style={[styles.permissionItem, { color: themeColors.text }]}>{perm.permission_type}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                    {step === 3 && (
                        <ScrollView>
                        <View style={styles.checkboxContainer}>
                            <Switch
                                value={allUsersSelected}
                                onValueChange={toggleAllUsers}
                            />
                            <Text style={[styles.memberItem, { color: themeColors.text }]}>{community.settings.members.all_user}</Text>
                        </View>
                        {selectedMembers.map((member, index) => (
                            <View key={index} style={styles.checkboxContainer}>
                                <Switch
                                    value={member.selected}
                                    onValueChange={(newValue) => {
                                        const updatedMembers = [...selectedMembers];
                                        updatedMembers[index].selected = newValue;
                                        setSelectedMembers(updatedMembers);

                                        // Check if all members are selected
                                        const allSelected = updatedMembers.every(member => member.selected);
                                        setAllUsersSelected(allSelected);

                                        if (!newValue) {
                                            setAllUsersSelected(false); // Unselect "All Users" if any user is unselected
                                        }
                                    }}
                                />
                                <Text style={[styles.memberItem, { color: themeColors.text }]}>{member.username}</Text>
                            </View>
                        ))}

                    </ScrollView>
                    )}
                </View>
                {errorPopupMessage && (
                    <Modal style={{ backgroundColor: themeColors.background }} transparent visible={showRolePopup || showPermissionPopup || showMemberPopup} animationType="slide">
                        <View style={styles.modalContainer2}>
                            <View style={[styles.errorContent, { backgroundColor: themeColors.card }]}>
                                <Text style={styles.errorText}>{errorPopupMessage}</Text>
                                <TouchableOpacity onPress={() => {
                                    setShowRolePopup(false);
                                    setShowPermissionPopup(false);
                                    setShowMemberPopup(false);
                                    setErrorPopupMessage('');
                                }}>
                                    <Text style={styles.closeButton2}>{community.settings.members.close}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
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
    modalContainer2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    modalContent: {
        width: '100%',
        height: '100%',
    },
    channelContainer: {
        padding: 10,
        paddingBottom: -10,
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15
    },
    channelContainer2: {
        padding: 10,
        paddingBottom: -10,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
      },
      tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 20,
      },
      selectedTab: {
        borderBottomColor: ThemeColors.text,
        borderBottomWidth: 1,
      },
      tabText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
      },
      mainTitle: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 3,
      },
      mainTitleContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      mainTitle2: {
        fontSize: 13,
        color: 'gray',
        fontWeight: 'bold',
        marginBottom: 20,
      },
    createButton: {
        backgroundColor: '#36393f',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 8,
        justifyContent: 'space-between',
        flexDirection: 'row',

    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
        color: ThemeColors.text,
    },
    section: {
        overflow: 'hidden',
        paddingLeft: 20,
        backgroundColor: '#202020',
        borderRadius: 10,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton2: {
        backgroundColor: '#36393f',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 8,
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginRight: 20,
    },
    spliter: {
        height: 0.3,
        width: '100%',
        backgroundColor: ThemeColors.text,
    },
    backButtonContainer: {
        padding: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 0.3,
        borderBottomColor: ThemeColors.text,
    },
    permissionItem: {
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: ThemeColors.text,
        color: 'white',
    },
    memberItem: {
        padding: 10,
        borderBottomColor: ThemeColors.text,
        color: 'white',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
    },
    popupContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popupBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeButton2: {
        fontSize: 16,
        color: '#007bff',
    },
    popupText: {
        fontSize: 16,
        textAlign: 'center',
    },
    errorContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 10,
    },
});
