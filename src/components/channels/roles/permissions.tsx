import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Switch, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { main_url } from '../../../constants/Urls';
import axios from 'axios';
import { community } from '../../../constants/StaticData/en.json';
import { ThemeColors } from '../../../constants/thems';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Permissionspermission({ visible, onClose, setOverview, permissions, allPermission }) {
    const [permissionToggles, setPermissionToggles] = useState({});
    const scheme = useColorScheme();
    const themeColors = ThemeColors[scheme];

    // Initialize the permission toggles based on the permissions data
    useEffect(() => {
        console.log("check or show the permissions for test", permissions)
        console.log("check or show the all permissions for test", allPermission)
        const initialToggles = {};
        permissions[0].permission.forEach(permission => {
            initialToggles[permission] = true;
        });
        console.log(initialToggles)
        setPermissionToggles(initialToggles);
    }, [permissions]);

    // Toggle the permission switch
    const togglePermission = (permissionType) => {
        setPermissionToggles(prevState => ({
            ...prevState,
            [permissionType]: !prevState[permissionType]
        }));
    };

    // Function to handle when the createButton is pressed
    const handleCreateButtonPress = async () => {
        // Get the permission IDs for each toggled permission with true value
        const toggledPermissions: { id: any; permissionType: string; }[] = [];
        Object.entries(permissionToggles).forEach(([permissionType, value]) => {
            if (value) {
                const permission = allPermission.find(permission => permission.permission_type === permissionType);
                if (permission) {
                    toggledPermissions.push({ id: permission.id, permissionType });
                }
            }
        });
        try {
            const formData = {
                'permissions_updates': toggledPermissions,
                'permission_assignment_id':permissions[0].id,
            };
            console.log(formData);
            
            const url = `${main_url}/api/permissions/assign/`;
            const token = await AsyncStorage.getItem('userToken');
            const jsonObject = JSON.parse(token);
    
            if (token) {
            const response = await axios.put(url, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jsonObject.access
                }
            });
        }
            
            onClose();
        } catch (error) {
            console.log("An error occurred during update:", error);
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
                        <TouchableOpacity style={styles.createButton} onPress={handleCreateButtonPress}>
                            <Text style={{ color: themeColors.text }}>{community.settings.members.save}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.section, { backgroundColor: themeColors.background }]}>
                        <View style={styles.spliter}></View>
                        <Text style={[styles.sectionSubTitle, { color: themeColors.text }]}>{community.settings.members.user_role_text}</Text>
                        <ScrollView style={[{paddingBottom:20}, { backgroundColor: themeColors.background }]}>
                            {/* List all permissions from allPermission */}
                            {allPermission.map(permission => (
                                <View key={permission.id} style={styles.permissionItem}>
                                    <Text style={[styles.permissionType, { color: themeColors.text }]}>{permission.permission_type}</Text>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={permissionToggles[permission.permission_type] ? "#81b0ff" : "#f4f3f4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={() => togglePermission(permission.permission_type)}
                                        value={permissionToggles[permission.permission_type]}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
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
        paddingBottom: 140,
    },
    sectionSubTitle: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 20,
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
    permissionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: ThemeColors.text,
    },
    permissionType: {
        color: 'white',
        fontSize: 16,
    },
});
