import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, SafeAreaView, useColorScheme, Image, TextInput } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import NetInfo from '@react-native-community/netinfo';
import { main_url } from '../../../constants/Urls';
import { community as communityText } from '../../../constants/StaticData/en.json';
import { debounce } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AllCommunities({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [communities, setCommunities] = useState<any[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const scheme = useColorScheme();
  const [comFollow, setComFollow] = useState({ memberships: [] });
  const [userData, setUserData] = useState([]);

  const colors = {
    light: {
      background: '#f4f4f4',
      card: '#f4f4f4',
      text: '#000000',
      button: '#007bff',
      buttonText: '#ffffff',
      inputBackground: '#ffffff',
      inputText: '#000000',
      inputBorder: '#cccccc',
    },
    dark: {
      background: '#1A1A24',
      card: '#1A1A24',
      text: '#ffffff',
      button: '#0d6efd',
      buttonText: '#ffffff',
      inputBackground: '#333333',
      inputText: '#ffffff',
      inputBorder: '#cccccc',
    },
  };

  const themeColors = colors[scheme];

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected && state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('UserData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      } else {
        console.log("No user data found");
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleFollow = async (communityId: number, targetType: string, targetStatus: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token || '{}');

      const response = await axios.post(`${main_url}/api/community_action/`, {
        target_type: targetType,
        target_id: communityId,
        target_action: targetStatus,
      }, {
        headers: {
          Authorization: 'Bearer ' + jsonObject.access,
        },
      });

      // Update the comFollow state with the response data
      console.log("this is how it is clicked", response.data);
      fetchData();
    } catch (error) {
      console.error('Error following community:', error);
    }
  };

  const handleGetMembershipStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token || '{}');

      const response = await axios.get(`${main_url}/api/community_action/`, {
        params: {
          target_type: 'channel',
        },
        headers: {
          Authorization: 'Bearer ' + jsonObject.access,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching membership status:', error);
    }
  };

  const fetchData = async () => {
    if (visible) {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const jsonObject = JSON.parse(token || '{}');

        const [communitiesResponse, membershipStatus] = await Promise.all([
          axios.get(`${main_url}/api/get_channels/`, {
            headers: {
              Authorization: 'Bearer ' + jsonObject.access,
            },
          }),
          handleGetMembershipStatus()
        ]);

        setCommunities(communitiesResponse.data);
        setFilteredCommunities(communitiesResponse.data);
        console.log("this is how it is gotten", membershipStatus);
        setComFollow(membershipStatus);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  useEffect(() => {
    
    loadUserData();

    fetchData();
    console.log("this is user data", userData)
    console.log("member data", comFollow)
    
  }, [visible]);

  const handleSearch = debounce((query: string) => {
    const filtered = communities.filter((community: any) =>
      community.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCommunities(filtered);
  }, 300);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    handleSearch(text);
  };

  return (
    <Modal style={[{ backgroundColor: themeColors.background }]} transparent visible={visible} animationType="slide">
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
        <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
          <View style={[styles.header, { backgroundColor: themeColors.card }]}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Icon name="arrow-left" size={18} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>{communityText.create_community.find_communit}</Text>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, { backgroundColor: themeColors.inputBackground, color: themeColors.inputText }]}
              placeholder="Search by community name..."
              placeholderTextColor={themeColors.inputBorder}
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
          </View>
          {!isOnline ? (
            <View style={styles.offlineContainer}>
              <Text style={[styles.offlineText, { color: themeColors.text }]}>You are offline</Text>
            </View>
          ) : (
            <ScrollView
              style={[styles.modalContent, { backgroundColor: themeColors.card }]}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              {filteredCommunities.map((community: any) => (
                community.owner !== userData.id && (
                <View key={community.id} style={styles.communityContainer}>
                  <View style={styles.imageContainer}>
                    {community.logo ? (
                      <Image source={{ uri: community.logo }} style={styles.logoPreview} />
                    ) : (
                      <Icon name="user" size={80} color={themeColors.text} style={styles.creatorIcon} />
                    )}
                  </View>
                  <View style={styles.communityDetails}>
                    <Text style={[styles.communityName, { color: themeColors.text }]}>{community.name}</Text>
                    <Text style={[styles.communityDescription, { color: themeColors.text }]}>{community.description}</Text>
                    <View style={styles.buttonContainer}>
                      {comFollow.memberships &&
                        comFollow.memberships.some(membership => membership.target.id === community.id && membership.status === "Following") ? (
                        <TouchableOpacity
                          style={[styles.button, { backgroundColor: themeColors.button }, { flexDirection: 'row' }]}
                          onPress={() => handleFollow(community.id, 'channel', 'following')}
                        >
                          <Icon name="check" size={20} color={themeColors.buttonText} />
                          <Text style={[styles.buttonText, { color: themeColors.buttonText }, { marginLeft: 4 }]}>
                            {communityText.create_community.follow}
                          </Text>
                        </TouchableOpacity>
                      ) : comFollow.memberships.some(membership => membership.target.id === community.id && membership.status === "Un-followed") ? (
                        <TouchableOpacity
                          style={[styles.button, { backgroundColor: themeColors.button }, { flexDirection: 'row' }]}
                          onPress={() => handleFollow(community.id, 'channel', 'following')}
                        >
                          <Icon name="plus" size={20} color={themeColors.buttonText} />
                          <Text style={[styles.buttonText, { color: themeColors.buttonText }, { marginLeft: 4 }]}>
                            {communityText.create_community.follow}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[styles.button, { backgroundColor: themeColors.button }, { flexDirection: 'row' }]}
                          onPress={() => handleFollow(community.id, 'channel', 'following')}
                        >
                          <Icon name="plus" size={20} color={themeColors.buttonText} />
                          <Text style={[styles.buttonText, { color: themeColors.buttonText }, { marginLeft: 4 }]}>
                            {communityText.create_community.follow}
                          </Text>
                        </TouchableOpacity>
                      )}

                      {comFollow.memberships &&
                        comFollow.memberships.some(membership => membership.target.id === community.id && membership.status === "disconnected") ? (
                        <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.button }, { flexDirection: "row" }]} onPress={() => handleFollow(community.id, 'channel', 'connecting')}>
                          <Icon name="link" size={20} color={themeColors.buttonText} />
                          <Text style={[styles.buttonText, { color: themeColors.buttonText }, { marginLeft: 4 }]}>
                            {communityText.create_community.connect}
                          </Text>
                        </TouchableOpacity>
                      ) : comFollow.memberships.some(membership => membership.target.id === community.id && membership.status === "connected") ? (
                        <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.button }, { flexDirection: "row" }]} onPress={() => handleFollow(community.id, 'channel', 'connecting')}>
                          <Icon name="check" size={20} color={themeColors.buttonText} />
                          <Text style={[styles.buttonText, { color: themeColors.buttonText }, { marginLeft: 4 }]}>
                            {communityText.create_community.connect}
                          </Text>
                        </TouchableOpacity>
                      ) : comFollow.memberships.some(membership => membership.target.id === community.id && membership.status === "Requested") ? (
                        <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.button }, { flexDirection: "row" }]} onPress={() => handleFollow(community.id, 'channel', 'connecting')}>
                          <Icon name="clock-o" size={20} color={themeColors.buttonText} />
                          <Text style={[styles.buttonText, { color: themeColors.buttonText }, { marginLeft: 4 }]}>
                            {communityText.create_community.request}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.button }, { flexDirection: "row" }]} onPress={() => handleFollow(community.id, 'channel', 'connecting')}>
                          <Icon name="link" size={20} color={themeColors.buttonText} />
                          <Text style={[styles.buttonText, { color: themeColors.buttonText }, { marginLeft: 4 }]}>
                            {communityText.create_community.connect}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
                )
              )
              
              )}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    width: '100%',
    marginBottom: 10,
    marginTop: 20,
  },
  searchInput: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: '90%',
    marginBottom: 20,
  },
  communityContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
    borderRadius: 10,
    paddingTop:10,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  creatorIcon: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  communityDetails: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  communityName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  communityDescription: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});