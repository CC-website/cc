import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, ScrollView } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import EditSubChannel from '../subchannels/editSubChannel';
import EditGroup from '../groups/editGroup';
import { main_url } from '../../../constants/Urls';
import NewRoles from './newRoles';
import axios from 'axios';
import PermissionsRoles from './permissionsRoles';

export default function Roles({ visible, onClose, setOverview }) {
    const [openRoles, setOpenRoles] = useState(false);
    const [permissions, setPermissions] = useState([]);
    const [everyonePermissions, setEveryonePermissions] = useState([]);
    const [selectedPermissionType, setSelectedPermissionType] = useState([]);
    const [numberOfRoles, setNumberOfRoles] = useState(null);
    const [permissionsRoles, setPermissionsRoles] =useState(false);
    const [completData, setCompleteData] = useState([]);
    const [allPermission,setAllPermission] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handelOpenRoles = () =>{
        setOpenRoles(true);
    }
    const handelCloseRoles = () =>{
        setOpenRoles(false);
    }
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${main_url}/api/permissions/assign/${setOverview.id}/channel`);
            const data = response.data;
            const everyonePerms = data.filter(permission => permission.all_members == true);
            const otherPerms = data.filter(permission => permission.all_members != true);
            const otherPermsCount = otherPerms.length;
            setCompleteData(data);
            setNumberOfRoles(otherPermsCount);
            setEveryonePermissions(everyonePerms);
            setPermissions(otherPerms);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await axios.get(`${main_url}/api/permissions/types/`);
            setAllPermission(response.data);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const handlePermissionTypeClick = (id) => {
        const everyonePerms = completData.filter(permission => permission.id === id);
        fetchPermissions();
        setSelectedPermissionType(everyonePerms);
        setPermissionsRoles(true);
    };

    const closePermissionsModal = () => {
        setPermissionsRoles(false);
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.backButtonContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={onClose}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>{setOverview.name}</Text>
                        <TouchableOpacity style={styles.createButton} onPress={handelOpenRoles}>
                            <Ionicons name="add-circle-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.section]}>
                        <View style={styles.spliter}></View>
                        {/* Everyone Permissions Section */}
                        <Text style={styles.sectionSubTitle}>Use roles to group your channel members and assign permissions.</Text>
                        <Text style={styles.sectionTitle}>ROLES FOR ALL MEMBERS - {everyonePermissions.length}</Text>
                        <ScrollView>
                            {everyonePermissions.map(permission => (
                                <TouchableOpacity 
                                    key={permission.id} 
                                    onPress={() => handlePermissionTypeClick(permission.id)}
                                    style={styles.permissionTypeContainer}
                                > 
                                <View style={styles.rolecontainer}>
                                    <View style={styles.channelIconcontainer}>
                                        <FontAwesome name="users" size={24} color={'white'} />
                                    </View>
                                    <View style={styles.roleTextcontainer}>
                                        <Text style={styles.permissionType}>{permission.permission_type}</Text>
                                        <Text style={styles.sectionSubTitle}>Default permissions for all channel members</Text>
                                    </View>
                                    
                                </View>
                                    
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        {/* Other Permissions Section */}
                        <Text style={styles.sectionTitle}>ROLES - {numberOfRoles}</Text>
                        <ScrollView>
                            {permissions.map(permission => (
                                <TouchableOpacity 
                                    key={permission.permission_type} 
                                    onPress={() => handlePermissionTypeClick(permission.id)}
                                    style={styles.permissionTypeContainer}
                                >
                                    <View style={styles.firstContainer}>
                                        <View  style={styles.secondContainer}>
                                            <View style={styles.secondContainer1}>
                                                <MaterialCommunityIcons name="security" size={24} color="white" />
                                            </View>
                                            <View>
                                                <Text style={styles.permissionType}>{permission.permission_type}</Text>
                                                <View style={styles.thirdContainer}>
                                                    <FontAwesome name="user" size={14} color={'gray'} />
                                                    <Text style={styles.sectionSubTitle2}>{permission.members.length} Members</Text>
                                                </View>
                                                
                                            </View>
                                        </View>
                                        <View>
                                            <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
                                        </View>
                                        
                                    </View>
                                    
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </View>
            {/* Edit SubChannel Modal */}
            <NewRoles
                visible={openRoles}
                onClose={handelCloseRoles}
                setOverview={setOverview}
            />
            <PermissionsRoles
                visible={permissionsRoles}
                onClose={closePermissionsModal}
                setOverview={setOverview}
                permissions={selectedPermissionType}
                allPermission = {allPermission}
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
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'gray',
        marginBottom: 10,
    },
    sectionSubTitle: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 20,
    },
    sectionSubTitle2: {
        fontSize: 13,
        color: 'gray',
        marginLeft: 5,
    },
    roleTextcontainer: {
        paddingTop: 20,
    },
    rolecontainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    firstContainer: {
        width: '100%',
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10,
    },
    secondContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondContainer1: {
        marginRight: 10,
    },
    thirdContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
    },
    channelIconcontainer: {
        padding: 15,
        backgroundColor: '#36393f',
        borderRadius: 50,
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    permissionTypeContainer: {
        paddingVertical: 10,
    },
    permissionType: {
        color: 'white',
        fontSize: 16,
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
        borderBottomColor: '#fff',
        justifyContent: 'space-between'
    },
});
