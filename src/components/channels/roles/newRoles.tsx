import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { main_url } from '../../../constants/Urls';

export default function NewRoles({ visible, onClose, setOverview }) {
    const [enteredRole, setEnteredRole] = useState('');
    const [selectedPermission, setSelectedPermission] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [step, setStep] = useState(1);
    const [showPermissionPopup, setShowPermissionPopup] = useState(false);
    const [showMemberPopup, setShowMemberPopup] = useState(false);
    const [showRolePopup, setShowRolePopup] = useState(false);
    const [selectedTab, setSelectedTab] = useState('role');

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchUsers = async () => {
        try {
            const allData = ['members/', 'admins/', 'blocked-members/'];
            const fetchedMembers = [];
            for (const element of allData) {
                const response = await axios.get(`${main_url}/api/channels/${setOverview.id}/${element}`);
                response.data.forEach(element => {
                    fetchedMembers.push({ ...element, selected: false });
                });
            }
            setSelectedMembers(fetchedMembers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await axios.get(`${main_url}/api/permissions/types/`);
            setSelectedPermission(response.data.map(perm => ({ ...perm, selected: false })));
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const handleNextStep = () => {
        if (step === 1 && enteredRole !== '') {
            setStep(2);
            handleTabChange('permissions')
            setSelectedTab('permissions');
        } else if (step === 2 && selectedPermission.some(perm => perm.selected)) {
            setStep(3);
            fetchUsers();
            handleTabChange('members')
            setSelectedTab('members');
        } else if(enteredRole == ''){
            setShowRolePopup(true)
            setTimeout(() => {
                setShowRolePopup(false);
            }, 2000);
        }else{
            
            setShowPermissionPopup(true);
            setTimeout(() => {
                setShowPermissionPopup(false);
            }, 2000);
        }
    };

    const handdlesetStep = (value) =>{
        if(value == 1){
            handleTabChange('role')
            setStep(1);
        }else if(value ==2){
            handleTabChange('permissions')
            setStep(2);
        }else if(value ==2){
            handleTabChange('members')
            setStep(3);
        }
    }

    const handleSetPermission = async () => {
        if (selectedMembers.some(member => member.selected)) {
            console.log("===================================================")
            const finalmember = selectedMembers.filter(member => member.selected).map(member => member.id);
            const finalePremissions = selectedPermission.filter(perm => perm.selected).map(perm => perm.id);
            
            const formData = {
                'members' : finalmember,
                'permission': finalePremissions, // Wrap permissionsData[2] in a list
                'permission_type': enteredRole,
                'target_id': setOverview.id, // Ensure targetId is parsed as an integer
                'target_type': 'channel',
            };
            console.log(formData)
            const url = `${main_url}/api/permissions/assign/`;
      
            const response = await axios.post(url, formData);
        
            console.log('Permission set:', response.data);
            setSelectedMembers([]);
            setSelectedPermission([]);
            setEnteredRole('');
            onClose()
        } else {
            setShowMemberPopup(true);
            setTimeout(() => {
                setShowMemberPopup(false);
            }, 2000);
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

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                   
                    <View style={styles.backButtonContainer}>
                        {step > 1 && (
                            <TouchableOpacity style={styles.backButton2} onPress={() => handdlesetStep(step - 1)}>
                               <Ionicons name="arrow-back" size={24} color="white" /> 
                            </TouchableOpacity>
                        )}
                        {step <= 1 && (
                             <TouchableOpacity style={styles.backButton} onPress={onClose}>
                             <Ionicons name="arrow-back" size={24} color="white" />
                         </TouchableOpacity>
                        )}
                        {step < 3 && (
                            <TouchableOpacity style={styles.createButton} onPress={handleNextStep}>
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        )}
                        {step === 3 && (
                            <TouchableOpacity style={styles.createButton} onPress={handleSetPermission}>
                                <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity  style={[styles.tab, selectedTab === 'role' && styles.selectedTab]}>
                            <Text style={styles.tabText}>Role</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  style={[styles.tab, selectedTab === 'permissions' && styles.selectedTab]}>
                            <Text style={styles.tabText}>Permissions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  style={[styles.tab, selectedTab === 'members' && styles.selectedTab]}>
                            <Text style={styles.tabText}>Members</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.section]}>
                        <View style={styles.spliter}></View>
                    </View>
                    {step === 1 && (
                        <View style={styles.channelContainer}>
                            <View style={styles.channelContainer2}>
                                <View style={styles.mainTitleContainer}>
                                    <Text style={styles.mainTitle}>Create a new role</Text>
                                    <Text style={styles.mainTitle2}>Give this role a unique name. You can always change this later.</Text>
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
                                    <Text style={styles.permissionItem}>{perm.permission_type}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                    {step === 3 && (
                        <ScrollView>
                            {selectedMembers.map((member, index) => (
                                <View key={index} style={styles.checkboxContainer}>
                                    <Switch
                                        value={member.selected}
                                        onValueChange={(newValue) => {
                                            const updatedMembers = [...selectedMembers];
                                            updatedMembers[index].selected = newValue;
                                            setSelectedMembers(updatedMembers);
                                        }}
                                    />
                                    <Text style={styles.memberItem}>{member.username}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                    
                </View>
            </View>

            {/* Role Pop-up Modal */}
            <Modal transparent visible={showRolePopup} animationType="fade">
                <View style={styles.popupContainer}>
                    <View style={styles.popupBox}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowRolePopup(false)}>
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.popupText}>Please enter a Role</Text>
                    </View>
                </View>
            </Modal>
    
            {/* Permission Pop-up Modal */}
            <Modal transparent visible={showPermissionPopup} animationType="fade">
                <View style={styles.popupContainer}>
                    <View style={styles.popupBox}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowPermissionPopup(false)}>
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.popupText}>Please select at least one permission.</Text>
                    </View>
                </View>
            </Modal>
    
            {/* Member Pop-up Modal */}
            <Modal transparent visible={showMemberPopup} animationType="fade">
                <View style={styles.popupContainer}>
                    <View style={styles.popupBox}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowMemberPopup(false)}>
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.popupText}>Please select at least one member.</Text>
                    </View>
                </View>
            </Modal>
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
        borderBottomColor: '#fff',
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
        backgroundColor: 'rgba(169, 169, 169, 0.1)',
    },
    backButtonContainer: {
        padding: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 0.3,
        borderBottomColor: '#fff'
    },
    permissionItem: {
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#fff',
        color: 'white',
    },
    memberItem: {
        padding: 10,
        borderBottomColor: '#fff',
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
    popupText: {
        fontSize: 16,
        textAlign: 'center',
    },
});
