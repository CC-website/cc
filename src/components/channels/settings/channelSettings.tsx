import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { Entypo, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import Overview from './overview';
import EditChannels from './editChannel';
import { main_url } from '../../../constants/Urls';
import Members from '../members/members';
import Roles from '../roles/roles';
import BanedMembers from '../bans/bans';

export default function ChannelSettings({ visible, onClose, selectedChannel }) {


    const [buttonOpacity, setButtonOpacity] = useState(1);
    const [isModalVisibleOverview, setModalVisibleOverview] = useState(false);
    const [openEditChannelsModel, setOpenEditChannelsModel] = useState(false);
    const [openMembersModal, setOpenMembersModal] = useState(false);
    const [openRoles, setOpenRoles] = useState(false);
    const [openBans, setOpenBans] = useState(false);


    const handelOpenRoles = () =>{
      setOpenRoles(true);
    }
    const handelCloseRoles = () =>{
      setOpenRoles(false);
    }
    const handelOpenBans = () =>{
      setOpenBans(true);
    }
    const handelCloseBans = () =>{
      setOpenBans(false);
    }
    const handleChannelOverview = () =>{
        setModalVisibleOverview(true);
      }

    const handleCloseModalOverview = () => {
        setModalVisibleOverview(false);
    };

    const editChannels = () => {
      setOpenEditChannelsModel(true);
    }

    const closeEditChannelModel = () => {
      setOpenEditChannelsModel(false);
    }

    const closeMembersModal = () => {
      setOpenMembersModal(false);
    }
    const membersModal = () => {
      setOpenMembersModal(true);
    }

    const handleCreateChannelModel = (channelName) => {
        // Implement logic to create a new main channel
        console.log('Creating new channel:', channelName);
        // You may want to send an API request to create the channel on the server
      };

    
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Channel Settings</Text>
        </View>
        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
            <View style={styles.section}>
             <View style={styles.channelContainer}>
                <TouchableOpacity style={styles.logo}>
                <Image
                    source={{
                    uri: selectedChannel?.image_url
                        ? selectedChannel.image_url
                        : ""+main_url+"/channel_logos/channel1.png",
                    }}
                    style={styles.logo}
                />
                </TouchableOpacity>
                <Text style={styles.textTitle}>{selectedChannel.name}</Text>
            </View>
          </View>
          <View style={styles.section}>
                <Text style={styles.smallText}>Settings</Text>
          </View>
          <View style={styles.section}>
            <View >
                {/* Channel Profile */}
                
                    
                <TouchableOpacity
                    style={{ ...styles.createButton, opacity: buttonOpacity }}
                    onPress={handleChannelOverview}
                >
                    <View style={styles.settingsBox}>
                        <TouchableOpacity style={styles.createSubButton}>
                            <Entypo name="info-with-circle" size={24} color="white" />
                        </TouchableOpacity>


                        <Text style={styles.settingsText}>Overview</Text>
                    </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                style={{ ...styles.createButton1, opacity: buttonOpacity }}
                onPress={() => console.log('Report Raid pressed')}
                >
                    <View style={styles.settingsBox}>
                        <TouchableOpacity style={styles.createSubButton} >
                            <MaterialCommunityIcons name="sword-cross" size={24} color="white" />
                        </TouchableOpacity>

                        <Text style={styles.settingsText}>Moderation</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                style={{ ...styles.createButton1, opacity: buttonOpacity }}
                onPress={editChannels}
                >
                    <View style={styles.settingsBox}>
                        <TouchableOpacity style={styles.createSubButton}>
                        <MaterialCommunityIcons name="abugida-thai" size={24} color="white" />
                        </TouchableOpacity>

                        <Text style={styles.settingsText}>Channels</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                style={{ ...styles.createButton1, opacity: buttonOpacity }}
                onPress={() => console.log('Report Raid pressed')}
                >
                    <View style={styles.settingsBox}>
                        <TouchableOpacity style={styles.createSubButton}>
                        <MaterialCommunityIcons name="whatsapp" size={24} color="white" />
                        </TouchableOpacity>

                        <Text style={styles.settingsText}>Intergrations</Text>
                    </View>
                </TouchableOpacity>

                {/* Report Server */}
                <TouchableOpacity
                style={{ ...styles.createButton1, opacity: buttonOpacity }}
                onPress={() => console.log('Report Server pressed')}
                >
                    <View style={styles.settingsBox}>
                        <TouchableOpacity style={styles.createSubButton}>
                        <MaterialCommunityIcons name="emoticon-excited-outline" size={24} color="white" />
                        </TouchableOpacity>

                        <Text style={styles.settingsText}>Emoji</Text>
                    </View>
                </TouchableOpacity>

                {/* Security Action */}
                <TouchableOpacity
                style={{ ...styles.createButton2, opacity: buttonOpacity, marginBottom: 40 }}
                onPress={() => console.log('Security Action pressed')}
                >
                    <View style={styles.settingsBox}>
                        <TouchableOpacity style={styles.createSubButton}>
                        <MaterialCommunityIcons name="security" size={24} color="white" />
                        </TouchableOpacity>

                        <Text style={styles.settingsText}>Security</Text>
                    </View>
                </TouchableOpacity>
            </View>
          </View>


          <View style={styles.section}>
                <Text style={styles.smallText}>Channel Bank</Text>
          </View>
          <View style={styles.section}>
            <View >
                {/* Channel Profile */}
                <TouchableOpacity
                style={{ ...styles.createButton3, opacity: buttonOpacity }}
                onPress={() => console.log('Channel Profile pressed')}
                >
                    <View style={styles.settingsBox}>
                        <TouchableOpacity style={styles.createSubButton}>
                        <MaterialCommunityIcons name="bank" size={24} color="white" />
                        </TouchableOpacity>

                        <Text style={styles.settingsText}>CC Bank</Text>
                    </View>
                </TouchableOpacity>
            </View>
          </View>


          <View style={styles.section}>
                <Text style={styles.smallText}>User Management</Text>
          </View>
          <View style={styles.section}>
            <View >
                {/* Channel Profile */}
                <TouchableOpacity
                style={{ ...styles.createButton, opacity: buttonOpacity }}
                onPress={membersModal}
                >
                    <View style={styles.settingsBox}>
                        <TouchableOpacity style={styles.createSubButton}>
                            <MaterialCommunityIcons name="account-multiple" size={24} color="white" />
                        </TouchableOpacity>

                        <Text style={styles.settingsText}>Members</Text>
                    </View>
                </TouchableOpacity>

                
                <TouchableOpacity
                style={{ ...styles.createButton1, opacity: buttonOpacity }}
                onPress={handelOpenRoles}
                >
                    <View style={styles.settingsBox}>
                        <TouchableOpacity style={styles.createSubButton}>
                            <MaterialCommunityIcons name="security" size={24} color="white" />
                        </TouchableOpacity>

                        <Text style={styles.settingsText}>Roles</Text>
                    </View>
                </TouchableOpacity>

                {/* Report Server */}
                <TouchableOpacity
                style={{ ...styles.createButton1, opacity: buttonOpacity }}
                onPress={() => console.log('Report Server pressed')}
                >
                    <View style={styles.settingsBox}>
                        <TouchableOpacity style={styles.createSubButton} >
                            <MaterialCommunityIcons name="link" size={24} color="white" />
                        </TouchableOpacity>

                        <Text style={styles.settingsText}>Invites</Text>
                    </View>
                </TouchableOpacity>

                {/* Security Action */}
                <TouchableOpacity
                style={{ ...styles.createButton2, opacity: buttonOpacity, marginBottom: 40 }}
                onPress={handelOpenBans}
                >
                    <View style={styles.settingsBox}>
                        <TouchableOpacity style={styles.createSubButton}>
                        <MaterialCommunityIcons name="hammer" size={24} color="white" />
                        </TouchableOpacity>

                        <Text style={styles.settingsText}>Bans</Text>
                    </View>
                </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {/* New Group Form Modal */}
      <Overview
        visible={isModalVisibleOverview}
        onClose={handleCloseModalOverview}
        onCreateChannel={handleChannelOverview}
        setOverview={selectedChannel}
        // setChannels={setChannels}
      />
      {/* Edit channels model */}
      <EditChannels
      visible={openEditChannelsModel}
      onClose={closeEditChannelModel}
      onCreateChannel={editChannels}
      setOverview={selectedChannel}
      /> 
      <Members
      visible={openMembersModal}
      onClose={closeMembersModal}
      onCreateChannel={membersModal}
      setOverview={selectedChannel}
      /> 

      <Roles
      visible={openRoles}
      onClose={handelCloseRoles}
      setOverview={selectedChannel}
      /> 
      <BanedMembers
          visible={openBans}
          onClose={handelCloseBans}
          setOverview={selectedChannel} onCreateChannel={undefined}      /> 
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
    backgroundColor: '#202020',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: '91%',
  },
  modalTitle: {
    fontSize: 18,
    width: '80%',
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  logo: {
    backgroundColor: '#36393f',
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },
  backButton: {
    position: 'relative',
    top: 10,
    left: 0,
    padding: 10,
  },
  backButtonContainer: {
    padding: 10,
    paddingBottom: -10,
    width: "100%",
    flexDirection: 'row',
    borderBottomWidth: 0.3,
    borderBottomColor: '#fff',
  },
  channelContainer: {
    padding: 10,
    paddingTop: 30,
    paddingBottom: 30,
    width: "100%",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    color: 'white',
    marginTop: 15,
    fontSize: 20,
  },
  smallText:{
    color: 'gray',
    fontSize: 15,
    marginBottom:10,
  },
  section:{
    width: '100%',
  },
  createButton: {
    backgroundColor: '#36393f',
    paddingLeft: 10,
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    alignSelf: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#fff',
    height: 60,
  },
  createButton1: {
    backgroundColor: '#36393f',
    paddingLeft: 10,
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#fff',
    height: 60,
  },
  createButton2: {
    backgroundColor: '#36393f',
    paddingLeft: 10,
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: '100%',
    alignSelf: 'center',
    height: 60,
    marginBottom: 15,
  },
  createButton3: {
    backgroundColor: '#36393f',
    paddingLeft: 10,
    justifyContent: 'center',
    borderRadius: 10,
    width: '100%',
    alignSelf: 'center',
    height: 60,
    marginBottom:30,
  },
  createSubButton:{
    position: 'relative',
    padding: 10,
  },
  settingsText:{
    color: '#fff',
    fontWeight: 'bold',
  },
  markAsReadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  settingsBox:{
    flexDirection: 'row',
    alignItems: 'center',
  },
});
