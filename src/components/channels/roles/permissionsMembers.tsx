import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Switch, Image, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { main_url } from '../../../constants/Urls';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { community } from '../../../constants/StaticData/en.json';
import { ThemeColors } from '../../../constants/thems';

export default function PermissionsMembers({ visible, onClose, setOverview, permissions, allMembers }) {
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [allUsersSelected, setAllUsersSelected] = useState(false);
    const scheme = useColorScheme();
    const themeColors = ThemeColors[scheme];

    useEffect(() => {
        const memberIds = permissions[0].members.map(member => member.user);
        setSelectedMembers(memberIds);
        setAllUsersSelected(allMembers.every(member => memberIds.includes(member.id)));
    }, [permissions, allMembers]);

    const toggleMemberSelection = (memberId) => {
        const isSelected = selectedMembers.includes(memberId);
        const updatedSelectedMembers = isSelected
            ? selectedMembers.filter(id => id !== memberId)
            : [...selectedMembers, memberId];

        setSelectedMembers(updatedSelectedMembers);

        // Update the "All Members" toggle based on the updated selection
        setAllUsersSelected(updatedSelectedMembers.length === allMembers.length);
    };

    const toggleAllMembersSelection = () => {
        if (allUsersSelected) {
            setSelectedMembers([]);
        } else {
            const memberIds = allMembers.map(member => member.id);
            setSelectedMembers(memberIds);
        }
        setAllUsersSelected(!allUsersSelected);
    };

    const handleSetPermission = async () => {
        const formData = {
            all_members: allUsersSelected,
            members: selectedMembers,
            permission: [permissions[0].id],
            permission_type: permissions[0].permission_type,
            target_id: setOverview.id,
            target_type: 'channel',
            permission_assignment_id: permissions[0].id
        };

        try {
            const token = await AsyncStorage.getItem('userToken');
            const jsonObject = JSON.parse(token);

            if (jsonObject) {
                const url = `${main_url}/api/permissions/assign/`;
                await axios.put(url, formData, {
                    headers: {
                        Authorization: 'Bearer ' + jsonObject.access
                    }
                });
                onClose();
            }
        } catch (error) {
            console.log("An error occurred during update:", error);
        }
    };

    return (
        <Modal transparent  style={{ backgroundColor: themeColors.background }} visible={visible} animationType="slide">
            <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
                <View style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
                    <View style={styles.backButtonContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={onClose}>
                            <Ionicons name="arrow-back" size={24} style={{ color: themeColors.text }} />
                        </TouchableOpacity>
                        <Text style={[styles.modalTitle, { color: themeColors.text }]}>{setOverview.name}</Text>
                        <TouchableOpacity style={styles.createButton} onPress={handleSetPermission}>
                            <Text style={{ color: themeColors.text }}>{community.settings.members.save}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.section, { backgroundColor: themeColors.background }]}>
                        <View style={styles.spliter}></View>
                        {/* All Members Toggle */}
                        <View style={styles.memberItem}>
                            <Text style={[styles.memberName, { color: themeColors.text }]}>{community.settings.members.all_members}</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={allUsersSelected ? "#81b0ff" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleAllMembersSelection}
                                value={allUsersSelected}
                            />
                        </View>
                        {/* Render individual members */}
                        <ScrollView>
                            {allMembers.map((member) => (
                                <View key={member.id} style={styles.memberItem}>
                                    <View style={styles.memberCircle}>
                                        {console.log(`Image URL: ${main_url}/${member.profile_picture}`)}
                                        {member.profile_picture ? (
                                            <Image
                                                style={styles.memberImage}
                                                source={{ uri: `${main_url.replace(/\/$/, '')}/${member.profile_picture.replace(/^\//, '')}` }}
                                            />
                                        ) : (
                                            <Ionicons name="people" size={40} color="gray" style={styles.memberIcon} />
                                        )}
                                    </View>
                                    <Text style={[styles.memberName, { color: themeColors.text }]}>
                                        {member.username}
                                    </Text>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={selectedMembers.includes(member.id) ? "#81b0ff" : "#f4f3f4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={() => toggleMemberSelection(member.id)}
                                        value={selectedMembers.includes(member.id)}
                                        disabled={allUsersSelected} // Disable individual switches when "All Members" is selected
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
    },
    modalContent: {
        width: '100%',
        height: '100%',
        padding: 10,
    },
    section: {
        overflow: 'hidden',
        backgroundColor: '#202020',
        borderRadius: 10,
        marginTop: 20,
        paddingBottom: 140,
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
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: ThemeColors.text,
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
    memberImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 50,
    },
    memberIcon: {
        // Optional styles for the icon if needed
    },
});
