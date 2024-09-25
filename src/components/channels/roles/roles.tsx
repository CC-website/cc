import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, RefreshControl, useColorScheme } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import NewRoles from './newRoles';
import PermissionsRoles from './permissionsRoles';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { main_url } from '../../../constants/Urls';
import { community } from '../../../constants/StaticData/en.json';
import { ThemeColors } from '../../../constants/thems';

export default function Roles({ visible, onClose, setOverview, target_type, channelId, subchannelId }) {
    const [openRoles, setOpenRoles] = useState(false);
    const [permissions, setPermissions] = useState([]);
    const [everyonePermissions, setEveryonePermissions] = useState([]);
    const [selectedPermissionType, setSelectedPermissionType] = useState([]);
    const [numberOfRoles, setNumberOfRoles] = useState(null);
    const [permissionsRoles, setPermissionsRoles] = useState(false);
    const [completData, setCompleteData] = useState([]);
    const [allPermission, setAllPermission] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const scheme = useColorScheme();
    const themeColors = ThemeColors[scheme];

    useEffect(() => {
        fetchData();
    }, [visible]);

    const fetchData = async () => {
        await fetchUsers();
        await fetchPermissions();
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    const handelOpenRoles = () => {
        setOpenRoles(true);
    };

    const handelCloseRoles = () => {
        setOpenRoles(false);
    };

    const fetchUsers = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const jsonObject = JSON.parse(token);
    
            if (token) {
                console.log("url : ",`${main_url}/api/permissions/assign/${setOverview.id}/${target_type}/`)
                const response = await axios.get(`${main_url}/api/permissions/assign/${setOverview.id}/${target_type}/`, {
                    headers: {
                        'Authorization': 'Bearer ' + jsonObject.access,
                    },
                });
                const data = response.data;
                const everyonePerms = data.filter(permission => permission.all_members === true);
                const otherPerms = data.filter(permission => permission.all_members !== true);
    
                setCompleteData(data);
                setNumberOfRoles(otherPerms.length);
                setEveryonePermissions(everyonePerms);
                setPermissions(otherPerms);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPermissions = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const jsonObject = JSON.parse(token);
            if (token) {
                const response = await axios.get(`${main_url}/api/permissions/types/?target_type=${target_type}`, {
                    headers: {
                        'Authorization': 'Bearer ' + jsonObject.access,
                    },
                });
                const data = response.data;
                console.log("8888888888888844444444444444444444444", data)
                setAllPermission(data);
            }
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const handleSetPermission = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const jsonObject = JSON.parse(token);
            if (token) {
                const formData = {
                    // Your form data logic here
                };
                await axios.put(`${main_url}/api/permissions/assign/`, formData, {
                    headers: {
                        'Authorization': 'Bearer ' + jsonObject.access,
                    },
                });
                onClose();
            }
        } catch (error) {
            console.log('An error occurred during update:', error);
        }
    };

    const handlePermissionTypeClick = (id) => {
        const everyonePerms = completData.filter(permission => permission.id === id);
        setSelectedPermissionType(everyonePerms);
        setPermissionsRoles(true);
    };

    const closePermissionsModal = () => {
        setPermissionsRoles(false);
    };

    return (
        <Modal style={{ backgroundColor: themeColors.background }} transparent visible={visible} animationType="slide">
            <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
                <View style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
                    <View style={[styles.backButtonContainer, { backgroundColor: themeColors.background }]}>
                        <TouchableOpacity style={styles.backButton} onPress={onClose}>
                            <Ionicons name="arrow-back" size={24} style={{ color: themeColors.text }} />
                        </TouchableOpacity>
                        <Text style={[styles.modalTitle, { color: themeColors.text }]}>{setOverview.name}</Text>
                        <TouchableOpacity style={styles.createButton} onPress={handelOpenRoles}>
                            <Ionicons name="add-circle-outline" size={24} style={{ color: themeColors.text }} />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.section, { backgroundColor: themeColors.background }]}>
                        <View style={styles.spliter}></View>
                        <Text style={[styles.sectionSubTitle, { color: themeColors.text }]}>
                            {community.settings.members.user_role_text2}
                        </Text>
                        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                            {community.settings.members.for_all_members} - {everyonePermissions.length}
                        </Text>
                        <ScrollView
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                        >
                            {everyonePermissions.map(permission => (
                                <TouchableOpacity
                                    key={permission.id}
                                    onPress={() => handlePermissionTypeClick(permission.id)}
                                    style={[styles.permissionTypeContainer, { backgroundColor: themeColors.card }]}
                                >
                                    <View style={styles.rolecontainer}>
                                        <View style={styles.channelIconcontainer}>
                                            <FontAwesome name="users" size={24} style={{ color: themeColors.text }} />
                                        </View>
                                        <View style={styles.roleTextcontainer}>
                                            <Text style={[styles.permissionType, { color: themeColors.text }]}>{permission.permission_type}</Text>
                                            <Text style={[styles.sectionSubTitle, { color: themeColors.text }]}>
                                                {community.settings.members.defualt}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{community.settings.members.role} - {numberOfRoles}</Text>
                        <ScrollView
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                        >
                            {permissions.map(permission => (
                                <TouchableOpacity
                                    key={permission.permission_type}
                                    onPress={() => handlePermissionTypeClick(permission.id)}
                                    style={[styles.permissionTypeContainer, { backgroundColor: themeColors.card }]}
                                >
                                    <View style={styles.firstContainer}>
                                        <View style={styles.secondContainer}>
                                            <View style={styles.secondContainer1}>
                                                <MaterialCommunityIcons
                                                    name="security"
                                                    size={24}
                                                    style={{ color: themeColors.text }}
                                                />
                                            </View>
                                            <View>
                                                <Text style={[styles.permissionType, { color: themeColors.text }]}>
                                                    {permission.permission_type}
                                                </Text>
                                                <View style={styles.thirdContainer}>
                                                    <FontAwesome name="user" size={14} style={{ color: themeColors.text }} />
                                                    <Text style={[styles.sectionSubTitle2, { color: themeColors.text }]}>
                                                        {permission.members.length} {community.settings.members.members}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View>
                                            <MaterialCommunityIcons
                                                name="chevron-right"
                                                size={24}
                                                style={{ color: themeColors.text }}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </View>
        <NewRoles visible={openRoles} onClose={handelCloseRoles} setOverview={setOverview} channelId={channelId} target_type={target_type}/>
            <PermissionsRoles
                visible={permissionsRoles}
                onClose={closePermissionsModal}
                setOverview={setOverview}
                permissions={selectedPermissionType}
                allPermission={allPermission}
                target_type={target_type}
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
        backgroundColor: '#202020',
        borderRadius: 10,
        marginTop: 5,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20
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
        marginBottom: 10,
    },
    permissionTypeContainer: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    backButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    backButton: {
        marginLeft: 10,
    },
    createButton: {
        marginRight: 10,
    },
    spliter: {
        width: '100%',
        height: 1,
        backgroundColor: 'gray',
        marginBottom: 16,
    },
    rolecontainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    channelIconcontainer: {
        marginRight: 8,
    },
    roleTextcontainer: {
        flex: 1,
    },
    firstContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    secondContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    secondContainer1: {
        marginRight: 10,
    },
    thirdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    permissionType: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    sectionSubTitle2: {
        fontSize: 12,
    },
});
