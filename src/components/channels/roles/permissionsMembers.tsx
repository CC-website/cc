import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, ScrollView, Switch } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { main_url } from '../../../constants/Urls';
import axios from 'axios';

export default function PermissionsMembers({ visible, onClose, setOverview, permissions, allMembers }) {
    const [selectedMembers, setSelectedMembers] = useState([]);

    useEffect(() => {
        // Initialize selectedMembers with member IDs from permissions
        const memberIds = permissions[0].members.map(member => member.id);
        setSelectedMembers(memberIds);
    }, [permissions]);

    const toggleMemberSelection = (memberId) => {
        // Toggle member selection
        if (selectedMembers.includes(memberId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== memberId));
        } else {
            setSelectedMembers([...selectedMembers, memberId]);
        }
    };
    
    const saveUser = async () => {
        console.log(selectedMembers)
        try {
            const formData = {
                'permissions_update_members': selectedMembers,
                'permission_assignment_id':permissions[0].id,
            };
            console.log(formData);
            
            const url = `${main_url}/api/permissions/assign/`;
            const response = await axios.put(url, formData);
            
            onClose();
        } catch (error) {
            console.log("An error occurred during update:", error);
        }
    }

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.backButtonContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={onClose}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>{setOverview.name}</Text>
                        <TouchableOpacity style={styles.createButton} onPress={saveUser}>
                            <Text style={{color:'white'}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.section]}>
                        <View style={styles.spliter}></View>
                        {/* Render members */}
                        <ScrollView>
                            {allMembers.map(member => (
                                <View key={member.id} style={styles.memberItem}>
                                    <View style={styles.memberCircle}>
                                        <Text style={styles.memberText}>{member.username.charAt(0)}</Text>
                                    </View>
                                    <Text style={styles.memberName}>{member.username}</Text>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={selectedMembers.includes(member.id) ? "#81b0ff" : "#f4f3f4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={() => toggleMemberSelection(member.id)}
                                        value={selectedMembers.includes(member.id)}
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
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    memberCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
    },
    memberText: {
        color: 'white',
        fontSize: 16,
    },
    memberName: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
    },
});
