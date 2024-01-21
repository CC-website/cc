import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EditSubChannel from './editSubChannel';
import EditGroup from './editGroup';

export default function EditChannels({ visible, onClose, setOverview }) {
  const [expandedSubchannels, setExpandedSubchannels] = useState([]);
  const [editSubChannels, setEditSubChannels] = useState(false);
  const [selectedSubchannelId, setSelectedSubchannelId] = useState(null);
  const [editGroups, setEditGroups] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const openEditSubChannelModal = (subchannelId) => {
    setEditSubChannels(true);
    setSelectedSubchannelId(subchannelId);
  };

  const closeEditSubChannelModal = () => {
    setEditSubChannels(false);
    setSelectedSubchannelId(null);
  };

  const openEditGroup = (groupId) => {
    setEditGroups(true);
    setSelectedGroupId(groupId);
  }

  const closeEditGroup = () => {
    setEditGroups(false);
    setSelectedGroupId(null);
  }

  const toggleSubchannel = (subchannelId) => {
    setExpandedSubchannels((prev) =>
      prev.includes(subchannelId) ? prev.filter((id) => id !== subchannelId) : [...prev, subchannelId]
    );
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
          </View>

          <View style={[styles.section]}>
            <View style={styles.spliter}></View>

            {/* Subchannels Dropdown */}
            {setOverview.subchannels && (
              <ScrollView>
                <View style={styles.sectionContainer}>
                  {setOverview.subchannels.map((subchannel) => (
                    <View key={subchannel.id}>
                      <TouchableOpacity
                        style={[styles.subChannelItem]}
                        onPress={() => toggleSubchannel(subchannel.id)}
                      >
                        <View style={styles.subChannelItemContainer}>
                          <Ionicons
                            name={expandedSubchannels.includes(subchannel.id) ? 'chevron-down' : 'chevron-up'}
                            size={20}
                            color="#fff"
                          />
                          <Text style={[styles.channelName, { marginLeft: 5 }]}>{subchannel.name}</Text>
                        </View>

                        {/* Delete and Edit buttons for Subchannel */}
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() => openEditSubChannelModal(subchannel.id)}
                          >
                            <Ionicons name="create" size={18} color="#90EE90" />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>

                      {/* Groups Dropdown */}
                      {expandedSubchannels.includes(subchannel.id) && subchannel.groups && (
                        <>
                          {subchannel.groups.map((group) => (
                            <View key={group.id} style={[styles.groupChannelItem, { backgroundColor: '#202020' }]}>
                            <Image
                              source={{
                                uri: group.image_url ? group.image_url : 'http://192.168.145.37:8000/group_logos/group.png',
                              }}
                              style={[styles.logoImage, { borderRadius: 10, height: 35 }]}
                            />
                            <Text style={[styles.channelName, { marginLeft: 5 }]}>{group.name}</Text>
                          
                            {/* Delete and Edit buttons for Group */}
                            <View style={styles.buttonContainer}>
                              <TouchableOpacity
                                style={styles.button}
                                onPress={() => openEditGroup(group.id)}  
                              >
                                <Ionicons name="create" size={18} color="white" />
                              </TouchableOpacity>
                            </View>
                          
                            {/* Conditionally render EditGroup for the selected group */}
                            {editGroups && selectedGroupId === group.id && (
                              <EditGroup
                                visible={editGroups}
                                onClose={closeEditGroup}
                                setOverview={group}
                              />
                            )}
                          </View>
                          
                          ))}
                        </>
                      )}
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </View>
      {/* Edit SubChannel Modal */}
      <EditSubChannel
        visible={editSubChannels}
        onClose={closeEditSubChannelModal}
        setOverview={
          selectedSubchannelId
            ? setOverview.subchannels.find((subchannel) => subchannel.id === selectedSubchannelId)
            : setOverview
        }
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
  },
  sectionContainer: {
    padding: 10,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  channelName: {
    color: '#fff',
    fontWeight: 'bold',
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
  subChannelItem: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  groupChannelItem: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'relative',
    top: 10,
    left: 0,
    padding: 10,
  },
  subChannelItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 199,
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
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 10,
  },
});
